import {
  createDialogueSpeakerIndex,
  hasDialogueQuoteSegments,
  parseDialogueIndentSegments,
  type DialogueIndentSegment,
  type DialogueIndentSpeaker,
  type DialogueIndentStrategy,
} from './dialogue-indent';

export interface DialogueIndentConfig {
  theme?: unknown;
  dialogueIndentEnabled?: unknown;
  dialogueIndentStrategy?: unknown;
}

export interface DialogueIndentTagFilter {
  whitelist: readonly string[];
  blacklist: readonly string[];
}

export interface DialogueIndentTextPart {
  text: string;
  renderable: boolean;
}

export interface DialogueRenderMessage {
  message_id: number | string;
  message?: unknown;
  role?: unknown;
  is_system?: unknown;
  is_hidden?: unknown;
}

interface DialogueTable {
  headers?: unknown[];
  rows?: unknown[][];
}

interface DialogueIndentRendererDependencies {
  getConfig: () => DialogueIndentConfig;
  getDefaultTheme: () => string;
  getCachedRawData: () => unknown;
  getTableData: () => unknown;
  processJsonData: (json: unknown) => Record<string, DialogueTable>;
  rebuildNameAliases: (tables: Record<string, DialogueTable>) => void;
  getNameAliases: (name: string) => string[];
  resolveNameAlias: (name: string) => string;
  getAvatarLookupNames: (name: unknown) => string[];
  getAvatarAll: () => Record<string, { aliases?: unknown[] } | undefined>;
  getAvatarPrimaryName: (name: string) => string;
  getAvatarAsync: (name: string) => Promise<string | null | undefined>;
  getAvatarOffsetX: (name: string) => number;
  getAvatarOffsetY: (name: string) => number;
  getAvatarScale: (name: string) => number;
  getAvatarImageColor: (name: string) => string;
  getLocalAvatarNames: () => Promise<string[]>;
  getTagFilter: () => DialogueIndentTagFilter;
  isCharacterTable: (tableName: string) => boolean;
  findNameColumnIndex: (headers: unknown[], fallbackIndex?: number) => number;
  getCharacterNameCandidates: (name: unknown, includeResolved?: boolean) => string[];
  getDisplayName: (name: string) => string;
  replaceUserPlaceholders: (text: string) => string;
  escapeHtml: (text: string) => string;
  formatMessageBeforeDialogueIndent: (text: string, messageId: number | string) => string;
  formatRegexedMessageFragment: (text: string, messageId: number | string) => string;
  getHostDocument: () => Document;
  getJQuery: () => JQueryStatic;
  retrieveDisplayedMessage: (messageId: number | string) => JQuery<HTMLElement> | null;
  emitMessageRendered?: (messageId: number | string) => void;
  getLatestAssistantMessage: () => DialogueRenderMessage | null;
  warn: (message: string, error?: unknown) => void;
}

export interface DialogueIndentRenderer {
  schedule: () => void;
  refreshNow: () => void;
}

const DIALOGUE_INDENT_RENDER_VERSION = '3';
const DIALOGUE_INDENT_ORIGINAL_HTML_KEY = 'acuDialogueIndentOriginalHtml';
const DIALOGUE_INDENT_RENDER_DELAY_MS = 120;
const USER_AVATAR_PRIMARY_NAMES = ['{{user}}', '<user>'] as const;

interface DialogueIndentTagToken {
  name: string;
  raw: string;
  start: number;
  end: number;
  closing: boolean;
  selfClosing: boolean;
}

interface DialogueIndentTagPair {
  name: string;
  contentStart: number;
  contentEnd: number;
}

interface DialogueIndentAtomicRange {
  start: number;
  end: number;
  contentStart: number;
  contentEnd: number;
}

type DialogueIndentSplitMarker =
  | {
      type: 'tag';
      start: number;
      end: number;
      raw: string;
    }
  | {
      type: 'atomic';
      start: number;
      end: number;
      contentStart: number;
      contentEnd: number;
    };

type DialogueIndentFrontendChunk =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'frontend';
      text: string;
    };

type DialogueIndentRenderItem =
  | {
      type: 'html';
      html: string;
    }
  | {
      type: 'frontend';
      sourceText: string;
    };

interface DialogueIndentFrontendElement {
  element: HTMLElement;
  rendered: boolean;
}

export const normalizeDialogueIndentStrategy = (value: unknown): DialogueIndentStrategy => {
  if (value === 'balanced' || value === 'aggressive') return value;
  return 'conservative';
};

const normalizeDialogueIndentTagName = (value: string): string => {
  let tagName = String(value || '').trim();
  if (tagName.startsWith('<') && tagName.endsWith('>')) {
    tagName = tagName
      .slice(1, -1)
      .replace(/^\/\s*/, '')
      .replace(/\/\s*$/, '')
      .trim();
    tagName = tagName.split(/\s+/)[0] || '';
  }
  return tagName.toLocaleLowerCase();
};

const normalizeDialogueIndentTagList = (tags: readonly string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  tags.forEach(tag => {
    const normalized = normalizeDialogueIndentTagName(tag);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });
  return result;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isIndexInAtomicRanges = (index: number, ranges: readonly DialogueIndentAtomicRange[]): boolean =>
  ranges.some(range => range.start <= index && index < range.end);

const collectMarkdownFenceRanges = (text: string): DialogueIndentAtomicRange[] => {
  const ranges: DialogueIndentAtomicRange[] = [];
  const openPattern = /(^|\r?\n)[ \t]{0,3}(`{3,}|~{3,})([^\r\n]*)(?:\r?\n|$)/g;
  let openMatch: RegExpExecArray | null;
  while ((openMatch = openPattern.exec(text)) !== null) {
    const start = openMatch.index + openMatch[1].length;
    const marker = openMatch[2];
    const fenceChar = marker.charAt(0);
    const closePattern = new RegExp(`(^|\\r?\\n)[ \\t]{0,3}${escapeRegExp(fenceChar)}{${marker.length},}[ \\t]*(?:\\r?\\n|$)`, 'g');
    closePattern.lastIndex = openPattern.lastIndex;
    const closeMatch = closePattern.exec(text);
    const contentStart = openPattern.lastIndex;
    const contentEnd = closeMatch ? closeMatch.index : text.length;
    const end = closeMatch ? closeMatch.index + closeMatch[0].length : text.length;
    ranges.push({
      start,
      end,
      contentStart,
      contentEnd,
    });
    openPattern.lastIndex = end;
  }
  return ranges;
};

const isDialogueIndentFrontendCode = (text: string): boolean => {
  const normalized = String(text || '').toLocaleLowerCase();
  return ['html>', '<head>', '<body'].some(token => normalized.includes(token));
};

const collectDialogueIndentFrontendRanges = (text: string): DialogueIndentAtomicRange[] =>
  collectMarkdownFenceRanges(text).filter(range =>
    isDialogueIndentFrontendCode(text.slice(range.contentStart, range.contentEnd)),
  );

const splitDialogueIndentTextByFrontendBlocks = (text: string): DialogueIndentFrontendChunk[] => {
  const ranges = collectDialogueIndentFrontendRanges(text);
  if (ranges.length === 0) {
    return [{ type: 'text', text }];
  }

  const chunks: DialogueIndentFrontendChunk[] = [];
  let cursor = 0;
  ranges.forEach(range => {
    if (range.start > cursor) {
      chunks.push({ type: 'text', text: text.slice(cursor, range.start) });
    }
    chunks.push({ type: 'frontend', text: text.slice(range.start, range.end) });
    cursor = Math.max(cursor, range.end);
  });
  if (cursor < text.length) {
    chunks.push({ type: 'text', text: text.slice(cursor) });
  }
  return chunks.filter(chunk => chunk.text.length > 0);
};

const collectDialogueIndentTagTokens = (
  text: string,
  atomicRanges: readonly DialogueIndentAtomicRange[] = [],
): DialogueIndentTagToken[] => {
  const tokens: DialogueIndentTagToken[] = [];
  const tagPattern = /<\s*(\/?)\s*([^\s>/]+)(?:\s[^>]*)?(\/?)\s*>/g;
  for (const match of text.matchAll(tagPattern)) {
    if (typeof match.index !== 'number') continue;
    if (isIndexInAtomicRanges(match.index, atomicRanges)) continue;
    const raw = match[0];
    const rawName = String(match[2] || '')
      .replace(/\/$/, '')
      .trim();
    const name = normalizeDialogueIndentTagName(rawName);
    if (!name || name.startsWith('!') || name.startsWith('?')) continue;
    tokens.push({
      name,
      raw,
      start: match.index,
      end: match.index + raw.length,
      closing: match[1] === '/',
      selfClosing: match[3] === '/' || /\/\s*>$/.test(raw),
    });
  }
  return tokens;
};

const collectDialogueIndentTagPairs = (tokens: readonly DialogueIndentTagToken[]): DialogueIndentTagPair[] => {
  const openStacks = new Map<string, DialogueIndentTagToken[]>();
  const pairs: DialogueIndentTagPair[] = [];
  tokens.forEach(token => {
    if (token.selfClosing) return;
    if (!token.closing) {
      const stack = openStacks.get(token.name) || [];
      stack.push(token);
      openStacks.set(token.name, stack);
      return;
    }

    const stack = openStacks.get(token.name);
    const openingToken = stack?.pop();
    if (!openingToken) return;
    pairs.push({
      name: token.name,
      contentStart: openingToken.end,
      contentEnd: token.start,
    });
  });
  return pairs.filter(pair => pair.contentStart <= pair.contentEnd);
};

const getActiveDialogueIndentTags = (pairs: readonly DialogueIndentTagPair[], start: number, end: number): string[] => {
  const activeTags: string[] = [];
  pairs.forEach(pair => {
    if (pair.contentStart <= start && end <= pair.contentEnd) {
      activeTags.push(pair.name);
    }
  });
  return activeTags;
};

const canRenderDialogueIndentPart = (
  activeTags: readonly string[],
  whitelist: readonly string[],
  blacklist: readonly string[],
): boolean => {
  if (blacklist.some(tag => activeTags.includes(tag))) return false;
  if (whitelist.length === 0 || whitelist.includes('*')) return true;
  return whitelist.some(tag => activeTags.includes(tag));
};

export const splitDialogueIndentTextByTagFilter = (
  text: string,
  tagFilter: DialogueIndentTagFilter,
): DialogueIndentTextPart[] => {
  if (!text) return [];

  const whitelist = normalizeDialogueIndentTagList(tagFilter.whitelist);
  const blacklist = normalizeDialogueIndentTagList(tagFilter.blacklist);
  const atomicRanges = collectMarkdownFenceRanges(text);
  const tokens = collectDialogueIndentTagTokens(text, atomicRanges);
  const pairs = collectDialogueIndentTagPairs(tokens);
  const parts: DialogueIndentTextPart[] = [];

  const pushPart = (partText: string, renderable: boolean): void => {
    if (!partText) return;
    const previous = parts[parts.length - 1];
    if (previous && previous.renderable === renderable) {
      previous.text += partText;
      return;
    }
    parts.push({ text: partText, renderable });
  };

  const markers: DialogueIndentSplitMarker[] = [
    ...tokens.map(token => ({
      type: 'tag' as const,
      start: token.start,
      end: token.end,
      raw: token.raw,
    })),
    ...atomicRanges.map(range => ({
      type: 'atomic' as const,
      start: range.start,
      end: range.end,
      contentStart: range.contentStart,
      contentEnd: range.contentEnd,
    })),
  ].sort((left, right) => left.start - right.start || left.end - right.end);

  let cursor = 0;
  markers.forEach(marker => {
    if (marker.end <= cursor) return;
    if (marker.start > cursor) {
      const activeTags = getActiveDialogueIndentTags(pairs, cursor, marker.start);
      pushPart(text.slice(cursor, marker.start), canRenderDialogueIndentPart(activeTags, whitelist, blacklist));
    }
    pushPart(marker.type === 'tag' ? marker.raw : text.slice(marker.start, marker.end), false);
    cursor = Math.max(cursor, marker.end);
  });

  if (cursor < text.length) {
    const activeTags = getActiveDialogueIndentTags(pairs, cursor, text.length);
    pushPart(text.slice(cursor), canRenderDialogueIndentPart(activeTags, whitelist, blacklist));
  }

  return parts;
};

export const createDialogueIndentRenderer = (deps: DialogueIndentRendererDependencies): DialogueIndentRenderer => {
  let renderTimer: number | null = null;
  let renderTicket = 0;

  const getDialogueIndentConfig = (): {
    enabled: boolean;
    strategy: DialogueIndentStrategy;
    tagFilter: DialogueIndentTagFilter;
  } => {
    const config = deps.getConfig();
    return {
      enabled: config.dialogueIndentEnabled === true,
      strategy: normalizeDialogueIndentStrategy(config.dialogueIndentStrategy),
      tagFilter: deps.getTagFilter(),
    };
  };

  const pushUniqueName = (items: string[], value: unknown): void => {
    const name = String(value ?? '').trim();
    if (name && !items.includes(name)) items.push(name);
  };

  const isSameName = (left: unknown, right: unknown): boolean => {
    return (
      String(left ?? '')
        .trim()
        .toLowerCase() ===
      String(right ?? '')
        .trim()
        .toLowerCase()
    );
  };

  const isUserAvatarPrimaryName = (name: string): boolean => {
    return USER_AVATAR_PRIMARY_NAMES.some(primaryName => isSameName(primaryName, name));
  };

  const addDialogueSpeaker = (
    speakers: Map<string, DialogueIndentSpeaker>,
    name: unknown,
    extraCandidates: readonly unknown[] = [],
    trustedAliases: readonly unknown[] = [],
  ): void => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return;

    const primaryName = deps.getAvatarPrimaryName(rawName) || deps.resolveNameAlias(rawName) || rawName;
    const displayName = deps.getDisplayName(deps.replaceUserPlaceholders(primaryName) || primaryName);
    const aliases: string[] = [];
    const aliasCandidates: unknown[] = [rawName, primaryName];
    const pushCandidate = (value: unknown) => aliasCandidates.push(value);
    const pushResolvedCandidate = (value: unknown): void => {
      const candidate = String(value ?? '').trim();
      if (!candidate) return;

      const avatarPrimaryName = deps.getAvatarPrimaryName(candidate);
      const aliasPrimaryName = deps.resolveNameAlias(candidate);
      const acceptedByAvatarManager = isSameName(candidate, primaryName) || isSameName(avatarPrimaryName, primaryName);
      const acceptedByNameAliasRegistry =
        !isUserAvatarPrimaryName(primaryName) && isSameName(aliasPrimaryName, primaryName);

      if (acceptedByAvatarManager || acceptedByNameAliasRegistry) {
        pushUniqueName(aliases, candidate);
      }
    };

    deps.getAvatarLookupNames(rawName).forEach(pushCandidate);
    deps.getAvatarLookupNames(primaryName).forEach(pushCandidate);
    deps.getCharacterNameCandidates(rawName).forEach(pushCandidate);
    deps.getCharacterNameCandidates(primaryName).forEach(pushCandidate);
    deps.getNameAliases(rawName).forEach(pushCandidate);
    deps.getNameAliases(primaryName).forEach(pushCandidate);
    extraCandidates.forEach(pushCandidate);
    aliasCandidates.forEach(pushResolvedCandidate);
    trustedAliases.forEach(alias => pushUniqueName(aliases, alias));

    const current = speakers.get(primaryName);
    if (current) {
      aliases.forEach(alias => pushUniqueName(current.aliases as string[], alias));
      return;
    }

    speakers.set(primaryName, {
      primaryName,
      displayName,
      aliases,
    });
  };

  const rebuildDialogueNameAliasRegistry = (): void => {
    try {
      const rawData = deps.getCachedRawData() || deps.getTableData();
      if (rawData) {
        deps.rebuildNameAliases(deps.processJsonData(rawData));
      }
    } catch (error) {
      deps.warn('正文头像渲染刷新角色别名失败', error);
    }
  };

  const buildDialogueIndentSpeakers = async (): Promise<DialogueIndentSpeaker[]> => {
    rebuildDialogueNameAliasRegistry();

    const speakers = new Map<string, DialogueIndentSpeaker>();
    const avatarMap = deps.getAvatarAll();
    for (const [name, avatarData] of Object.entries(avatarMap)) {
      addDialogueSpeaker(speakers, name, [], Array.isArray(avatarData?.aliases) ? avatarData.aliases : []);
    }

    try {
      const localNames = await deps.getLocalAvatarNames();
      localNames.forEach(name => addDialogueSpeaker(speakers, name));
    } catch (error) {
      deps.warn('正文头像渲染读取本地头像失败', error);
    }

    try {
      const rawData = deps.getCachedRawData() || deps.getTableData();
      const tables = deps.processJsonData(rawData);
      Object.entries(tables).forEach(([tableName, table]) => {
        if (!deps.isCharacterTable(tableName) || !Array.isArray(table.headers) || !Array.isArray(table.rows)) {
          return;
        }
        const nameIndex = deps.findNameColumnIndex(table.headers, 1);
        table.rows.forEach(row => {
          const name = Array.isArray(row) ? row[nameIndex] : '';
          const rawName = String(name ?? '').trim();
          const resolvedName = deps.getAvatarPrimaryName(rawName);
          if (resolvedName && (avatarMap[resolvedName] || avatarMap[rawName])) {
            addDialogueSpeaker(speakers, resolvedName, deps.getCharacterNameCandidates(name));
          }
        });
      });
    } catch (error) {
      deps.warn('正文头像渲染读取角色表名称失败', error);
    }

    return [...speakers.values()].filter(speaker => speaker.primaryName && speaker.aliases.length > 0);
  };

  const getDialogueMessageElement = (messageId: number | string): JQuery<HTMLElement> => {
    const retrieved = deps.retrieveDisplayedMessage(messageId);
    if (retrieved && retrieved.length) return retrieved.first();

    const idText = String(messageId);
    const $ = deps.getJQuery();
    const $chat = $(deps.getHostDocument()).find('#chat');
    if (!$chat.length) return $();
    return $chat
      .find(
        `.mes[mesid="${idText}"], .mes[data-message-id="${idText}"], .mes#mes_${idText}, .message-body[data-message-id="${idText}"]`,
      )
      .first();
  };

  const getDialogueMessageTextElement = ($messageElement: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    let $mesText = $messageElement.find('.mes_text').first();
    if (!$mesText.length) {
      $mesText = $messageElement.find('.message-text, .text').first();
    }
    return $mesText.length ? $mesText : $messageElement;
  };

  const restoreDialogueIndentElement = ($mesText: JQuery<HTMLElement>): void => {
    const originalHtml = $mesText.data(DIALOGUE_INDENT_ORIGINAL_HTML_KEY);
    if (typeof originalHtml === 'string') {
      $mesText.html(originalHtml);
    }
    $mesText.removeData(DIALOGUE_INDENT_ORIGINAL_HTML_KEY);
    $mesText.removeAttr('data-acu-dialogue-indent-applied data-acu-dialogue-indent-hash');
  };

  const restoreAllElements = (): void => {
    deps
      .getJQuery()(deps.getHostDocument())
      .find('[data-acu-dialogue-indent-applied="true"]')
      .each((_, element) => restoreDialogueIndentElement(deps.getJQuery()(element)));
  };

  const restoreAllExcept = ($currentMesText: JQuery<HTMLElement>): void => {
    const currentElement = $currentMesText.get(0);
    deps
      .getJQuery()(deps.getHostDocument())
      .find('[data-acu-dialogue-indent-applied="true"]')
      .each((_, element) => {
        if (element !== currentElement) {
          restoreDialogueIndentElement(deps.getJQuery()(element));
        }
      });
  };

  const renderMessageTextFragment = (text: string, messageId: number | string): string => {
    if (!text) return '';
    try {
      return deps.formatRegexedMessageFragment(text, messageId);
    } catch (error) {
      deps.warn('正文头像渲染格式化普通文本失败', error);
    }
    return deps.escapeHtml(text).replace(/\n/g, '<br>');
  };

  const collectFrontendRenderElements = ($mesText: JQuery<HTMLElement>): DialogueIndentFrontendElement[] => {
    const $ = deps.getJQuery();
    const elements: DialogueIndentFrontendElement[] = [];
    $mesText.find('div.TH-render, pre').each((_, element) => {
      const $element = $(element);
      if ($element.is('pre')) {
        if ($element.closest('div.TH-render').length > 0) return;
        if (!isDialogueIndentFrontendCode($element.text())) return;
      } else if (!isDialogueIndentFrontendCode($element.find('pre').text() || $element.text())) {
        return;
      }
      elements.push({ element, rendered: $element.is('div.TH-render') });
    });
    return elements;
  };

  const createDialogueIndentRootElement = (
    items: readonly DialogueIndentRenderItem[],
    themeName: string,
    frontendElements: DialogueIndentFrontendElement[],
    messageId: number | string,
  ): JQuery<HTMLElement> => {
    const $ = deps.getJQuery();
    const $root = $('<div>')
      .addClass(`acu-dialogue-indent-root acu-theme-${themeName}`)
      .attr('data-acu-dialogue-indent-version', DIALOGUE_INDENT_RENDER_VERSION);

    items.forEach(item => {
      if (item.type === 'html') {
        $root.append(item.html);
        return;
      }
      const frontendElement = frontendElements.shift();
      if (frontendElement) {
        $root.append(frontendElement.element);
      } else {
        $root.append(renderMessageTextFragment(item.sourceText, messageId));
      }
    });

    return $root;
  };

  const escapeCssUrlValue = (url: string): string => {
    return String(url).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '').replace(/\r/g, '');
  };

  const renderDialogueQuoteSegment = async (
    segment: Extract<DialogueIndentSegment, { type: 'dialogue' }>,
    messageId: number | string,
  ): Promise<string> => {
    const avatarUrl = await deps.getAvatarAsync(segment.speakerPrimaryName);
    if (!avatarUrl) {
      return renderMessageTextFragment(segment.sourceText, messageId);
    }

    const avatarStyle = [
      `--acu-dialogue-avatar-image: url('${escapeCssUrlValue(avatarUrl)}')`,
      `--acu-dialogue-avatar-x: ${deps.getAvatarOffsetX(segment.speakerPrimaryName)}%`,
      `--acu-dialogue-avatar-y: ${deps.getAvatarOffsetY(segment.speakerPrimaryName)}%`,
      `--acu-dialogue-avatar-scale: ${deps.getAvatarScale(segment.speakerPrimaryName)}%`,
    ].join('; ');
    const asideStyle = `--acu-dialogue-character-color: ${deps.getAvatarImageColor(segment.speakerPrimaryName)}`;
    const rawSpeakerName = segment.speakerDisplayName || segment.speakerPrimaryName;
    const [speakerInitial = '', ...speakerRestParts] = Array.from(rawSpeakerName);
    const speakerName = speakerInitial
      ? `<span class="acu-dialogue-speaker-initial">${deps.escapeHtml(speakerInitial)}</span>${deps.escapeHtml(speakerRestParts.join(''))}`
      : '';
    const quoteHtml = renderMessageTextFragment(segment.quote, messageId);
    const continuationClass = segment.continuation ? ' is-continuation' : '';
    const avatarHtml = segment.continuation
      ? '<div class="acu-dialogue-avatar-spacer" aria-hidden="true"></div>'
      : `<div class="acu-dialogue-avatar" style="${avatarStyle}" aria-hidden="true"></div>`;
    const speakerHtml = segment.continuation ? '' : `<div class="acu-dialogue-speaker">${speakerName}</div>`;

    return [
      `<section class="acu-dialogue-aside${continuationClass}" style="${asideStyle}" data-speaker="${deps.escapeHtml(segment.speakerPrimaryName)}">`,
      avatarHtml,
      '<div class="acu-dialogue-body">',
      speakerHtml,
      `<div class="acu-dialogue-quote">${quoteHtml}</div>`,
      '</div>',
      '</section>',
    ].join('');
  };

  const renderDialogueIndentSegmentsHtml = async (
    segments: readonly DialogueIndentSegment[],
    messageId: number | string,
  ): Promise<string> => {
    const parts: string[] = [];
    for (const segment of segments) {
      if (segment.type === 'text') {
        parts.push(renderMessageTextFragment(segment.text, messageId));
      } else {
        parts.push(await renderDialogueQuoteSegment(segment, messageId));
      }
    }
    return parts.join('');
  };

  const renderDialogueIndentHtmlByTagFilter = async (
    messageText: string,
    speakerIndex: ReturnType<typeof createDialogueSpeakerIndex>,
    strategy: DialogueIndentStrategy,
    tagFilter: DialogueIndentTagFilter,
    messageId: number | string,
  ): Promise<{ items: DialogueIndentRenderItem[]; hasDialogue: boolean; hasFrontendBlock: boolean }> => {
    const chunks = splitDialogueIndentTextByFrontendBlocks(messageText);
    let hasDialogue = false;
    let hasFrontendBlock = false;
    const items: DialogueIndentRenderItem[] = [];
    const pushHtml = (html: string): void => {
      if (!html) return;
      const previous = items[items.length - 1];
      if (previous?.type === 'html') {
        previous.html += html;
        return;
      }
      items.push({ type: 'html', html });
    };

    for (const chunk of chunks) {
      if (chunk.type === 'frontend') {
        hasFrontendBlock = true;
        items.push({
          type: 'frontend',
          sourceText: chunk.text,
        });
        continue;
      }

      const parts = splitDialogueIndentTextByTagFilter(chunk.text, tagFilter);
      for (const part of parts) {
        if (!part.renderable) {
          pushHtml(renderMessageTextFragment(part.text, messageId));
          continue;
        }
        const segments = parseDialogueIndentSegments(part.text, speakerIndex, strategy);
        if (hasDialogueQuoteSegments(segments)) {
          hasDialogue = true;
        }
        pushHtml(await renderDialogueIndentSegmentsHtml(segments, messageId));
      }
    }

    return { items, hasDialogue, hasFrontendBlock };
  };

  const createRenderHash = (
    messageText: string,
    config: { enabled: boolean; strategy: DialogueIndentStrategy; tagFilter: DialogueIndentTagFilter },
  ): string => {
    return [
      DIALOGUE_INDENT_RENDER_VERSION,
      config.enabled ? '1' : '0',
      config.strategy,
      normalizeDialogueIndentTagList(config.tagFilter.whitelist).join(','),
      normalizeDialogueIndentTagList(config.tagFilter.blacklist).join(','),
      deps.getConfig().theme,
      messageText,
    ].join('\u0001');
  };

  const renderLatest = async (): Promise<void> => {
    const ticket = ++renderTicket;
    const config = getDialogueIndentConfig();
    if (!config.enabled) {
      restoreAllElements();
      return;
    }

    const message = deps.getLatestAssistantMessage();
    if (!message) {
      restoreAllElements();
      return;
    }

    const messageId = message.message_id;
    const messageText = String(message.message || '');
    let dialogueIndentSourceText = messageText;
    try {
      dialogueIndentSourceText = deps.formatMessageBeforeDialogueIndent(messageText, messageId);
    } catch (error) {
      deps.warn('正文头像渲染应用酒馆正则失败', error);
    }
    const $messageElement = getDialogueMessageElement(messageId);
    if (!$messageElement.length) return;

    const $mesText = getDialogueMessageTextElement($messageElement);
    restoreAllExcept($mesText);

    const renderHash = createRenderHash(dialogueIndentSourceText, config);
    if ($mesText.attr('data-acu-dialogue-indent-hash') === renderHash) return;

    if ($mesText.attr('data-acu-dialogue-indent-applied') !== 'true') {
      $mesText.data(DIALOGUE_INDENT_ORIGINAL_HTML_KEY, $mesText.html());
    } else {
      restoreDialogueIndentElement($mesText);
    }

    const frontendElements = collectFrontendRenderElements($mesText);
    const speakers = await buildDialogueIndentSpeakers();
    if (ticket !== renderTicket) return;

    const speakerIndex = createDialogueSpeakerIndex(speakers);
    const renderResult = await renderDialogueIndentHtmlByTagFilter(
      dialogueIndentSourceText,
      speakerIndex,
      config.strategy,
      config.tagFilter,
      messageId,
    );
    if (!renderResult.hasDialogue) {
      restoreDialogueIndentElement($mesText);
      return;
    }

    if (ticket !== renderTicket) return;

    const themeName = String(deps.getConfig().theme || deps.getDefaultTheme()).replace(/[^a-z0-9_-]/gi, '');
    const renderedFrontendElementCount = frontendElements.filter(item => item.rendered).length;
    const frontendBlockCount = renderResult.items.filter(item => item.type === 'frontend').length;
    const $root = createDialogueIndentRootElement(renderResult.items, themeName, frontendElements, messageId);
    $mesText
      .empty()
      .append($root)
      .attr('data-acu-dialogue-indent-applied', 'true')
      .attr('data-acu-dialogue-indent-hash', renderHash);
    if (renderResult.hasFrontendBlock && frontendBlockCount > renderedFrontendElementCount && deps.emitMessageRendered) {
      window.setTimeout(() => deps.emitMessageRendered?.(messageId), 0);
    }
  };

  const schedule = (): void => {
    if (renderTimer !== null) {
      window.clearTimeout(renderTimer);
    }
    renderTimer = window.setTimeout(() => {
      renderTimer = null;
      void renderLatest();
    }, DIALOGUE_INDENT_RENDER_DELAY_MS);
  };

  const refreshNow = (): void => {
    if (renderTimer !== null) {
      window.clearTimeout(renderTimer);
      renderTimer = null;
    }
    void renderLatest();
  };

  return { schedule, refreshNow };
};
