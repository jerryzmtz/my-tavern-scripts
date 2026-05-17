export type DialogueIndentStrategy = 'conservative' | 'balanced' | 'aggressive';

export interface DialogueIndentSpeaker {
  primaryName: string;
  displayName: string;
  aliases: readonly string[];
}

export interface DialogueSpeakerMatch {
  primaryName: string;
  displayName: string;
  alias: string;
  confidence: DialogueIndentStrategy;
}

export interface DialogueTextSegment {
  type: 'text';
  text: string;
}

export interface DialogueQuoteSegment {
  type: 'dialogue';
  speakerPrimaryName: string;
  speakerDisplayName: string;
  speakerAlias: string;
  quote: string;
  sourceText: string;
  continuation: boolean;
}

export type DialogueIndentSegment = DialogueTextSegment | DialogueQuoteSegment;

interface IndexedSpeakerAlias {
  alias: string;
  aliasKey: string;
  primaryName: string;
  displayName: string;
  length: number;
}

export interface DialogueSpeakerIndex {
  aliases: readonly IndexedSpeakerAlias[];
  conflictAliasKeys: ReadonlySet<string>;
}

interface QuoteRange {
  openIndex: number;
  closeIndex: number;
  endIndex: number;
  quote: string;
}

interface IgnoredRange {
  start: number;
  end: number;
}

interface SpeakerContextMatch {
  match: DialogueSpeakerMatch;
  startOffset: number;
  endOffset: number;
}

interface DialogueCandidate {
  match: DialogueSpeakerMatch;
  start: number;
  end: number;
  quote: string;
}

const quotePairs: Record<string, string> = {
  '「': '」',
  '『': '』',
  '“': '”',
  '"': '"',
  '‘': '’',
  "'": "'",
};

const speechVerbs = [
  '说道',
  '问道',
  '喊道',
  '叫道',
  '答道',
  '笑道',
  '叹道',
  '念道',
  '低声说',
  '小声说',
  '轻声说',
  '沉声说',
  '喃喃道',
  '呢喃道',
  '嘟囔道',
  '开口道',
  '回答道',
  '补充道',
  '说',
  '问',
  '喊',
  '叫',
  '答',
  '笑',
  '叹',
  '念',
  '低语',
  '喃喃',
  '呢喃',
  '嘟囔',
  '开口',
  '回答',
  '补充',
];

const speechVerbPattern = speechVerbs.map(escapeRegExp).join('|');
const systemBlockPattern = /<meta:检定结果(?:\s[^>]*)?>[\s\S]*?<\/meta:检定结果>/gi;

const punctuationPattern = /[。！？!?；;]/;
const asciiWordPattern = /[A-Za-z0-9_]/;

export const createDialogueSpeakerIndex = (speakers: readonly DialogueIndentSpeaker[]): DialogueSpeakerIndex => {
  const aliasOwners = new Map<string, Set<string>>();
  const indexedAliases: IndexedSpeakerAlias[] = [];

  const registerAlias = (speaker: DialogueIndentSpeaker, alias: string) => {
    const trimmedAlias = normalizeVisibleText(alias);
    if (!trimmedAlias) {
      return;
    }
    const aliasKey = normalizeAliasKey(trimmedAlias);
    const owners = aliasOwners.get(aliasKey) ?? new Set<string>();
    owners.add(speaker.primaryName);
    aliasOwners.set(aliasKey, owners);
    indexedAliases.push({
      alias: trimmedAlias,
      aliasKey,
      primaryName: speaker.primaryName,
      displayName: speaker.displayName || speaker.primaryName,
      length: Array.from(trimmedAlias).length,
    });
  };

  for (const speaker of speakers) {
    registerAlias(speaker, speaker.primaryName);
    registerAlias(speaker, speaker.displayName);
    for (const alias of speaker.aliases) {
      registerAlias(speaker, alias);
    }
  }

  const conflictAliasKeys = new Set<string>();
  for (const [aliasKey, owners] of aliasOwners.entries()) {
    if (owners.size > 1) {
      conflictAliasKeys.add(aliasKey);
    }
  }

  const deduped = new Map<string, IndexedSpeakerAlias>();
  for (const indexedAlias of indexedAliases) {
    if (conflictAliasKeys.has(indexedAlias.aliasKey)) {
      continue;
    }
    const dedupeKey = `${indexedAlias.primaryName}\n${indexedAlias.aliasKey}`;
    const current = deduped.get(dedupeKey);
    if (!current || indexedAlias.length > current.length) {
      deduped.set(dedupeKey, indexedAlias);
    }
  }

  return {
    aliases: [...deduped.values()].sort((left, right) => right.length - left.length || left.alias.localeCompare(right.alias)),
    conflictAliasKeys,
  };
};

export const parseDialogueIndentSegments = (
  text: string,
  speakerIndex: DialogueSpeakerIndex,
  strategy: DialogueIndentStrategy,
): DialogueIndentSegment[] => {
  if (!text.trim() || speakerIndex.aliases.length === 0) {
    return [{ type: 'text', text }];
  }

  const ignoredRanges = collectIgnoredRanges(text);
  const quoteRanges = collectQuoteRanges(text, ignoredRanges);
  const segments: DialogueIndentSegment[] = [];
  let cursor = 0;
  let previousSpeakerPrimaryName = '';
  let previousDialogueEnd = -1;

  for (const quoteRange of quoteRanges) {
    if (quoteRange.openIndex < cursor || !quoteRange.quote.trim()) {
      continue;
    }

    const candidate = resolveDialogueCandidate(text, quoteRange, speakerIndex, strategy, previousSpeakerPrimaryName, previousDialogueEnd);
    if (!candidate || candidate.start < cursor) {
      continue;
    }

    if (candidate.start > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, candidate.start) });
    }

    const between = previousDialogueEnd >= 0 ? text.slice(previousDialogueEnd, candidate.start) : '';
    const continuation = previousSpeakerPrimaryName === candidate.match.primaryName && !hasParagraphBreak(between);
    segments.push({
      type: 'dialogue',
      speakerPrimaryName: candidate.match.primaryName,
      speakerDisplayName: candidate.match.displayName,
      speakerAlias: candidate.match.alias,
      quote: candidate.quote,
      sourceText: text.slice(candidate.start, candidate.end),
      continuation,
    });

    cursor = candidate.end;
    previousSpeakerPrimaryName = candidate.match.primaryName;
    previousDialogueEnd = candidate.end;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', text }];
};

export const hasDialogueQuoteSegments = (segments: readonly DialogueIndentSegment[]): boolean =>
  segments.some(segment => segment.type === 'dialogue');

const resolveDialogueCandidate = (
  text: string,
  quoteRange: QuoteRange,
  speakerIndex: DialogueSpeakerIndex,
  strategy: DialogueIndentStrategy,
  previousSpeakerPrimaryName: string,
  previousDialogueEnd: number,
): DialogueCandidate | null => {
  const prefixStart = findContextStart(text, quoteRange.openIndex);
  const prefixContext = text.slice(prefixStart, quoteRange.openIndex);
  const prefixMatch = findSpeakerEndingContext(prefixContext, speakerIndex, true);
  if (prefixMatch) {
    return {
      match: prefixMatch.match,
      start: prefixStart + prefixMatch.startOffset,
      end: quoteRange.endIndex,
      quote: quoteRange.quote,
    };
  }

  const suffixEnd = Math.min(text.length, quoteRange.endIndex + 96);
  const suffixContext = text.slice(quoteRange.endIndex, suffixEnd).split(/\r?\n/)[0] ?? '';
  const suffixMatch = findSpeakerStartingContext(suffixContext, speakerIndex, true);
  if (suffixMatch) {
    return {
      match: suffixMatch.match,
      start: quoteRange.openIndex,
      end: quoteRange.endIndex + suffixMatch.endOffset,
      quote: quoteRange.quote,
    };
  }

  if (strategy !== 'conservative' && previousSpeakerPrimaryName) {
    const between = previousDialogueEnd >= 0 ? text.slice(previousDialogueEnd, quoteRange.openIndex) : '';
    if (canInheritPreviousSpeaker(between, speakerIndex)) {
      const inheritedAlias = speakerIndex.aliases.find(alias => alias.primaryName === previousSpeakerPrimaryName);
      if (inheritedAlias) {
        return {
          match: {
            primaryName: inheritedAlias.primaryName,
            displayName: inheritedAlias.displayName,
            alias: inheritedAlias.alias,
            confidence: 'balanced',
          },
          start: quoteRange.openIndex,
          end: quoteRange.endIndex,
          quote: quoteRange.quote,
        };
      }
    }
  }

  if (strategy === 'aggressive') {
    const aggressiveMatch = findAggressiveContextMatch(prefixContext, suffixContext, speakerIndex);
    if (aggressiveMatch) {
      return {
        match: aggressiveMatch,
        start: quoteRange.openIndex,
        end: quoteRange.endIndex,
        quote: quoteRange.quote,
      };
    }
  }

  return null;
};

const findSpeakerEndingContext = (
  context: string,
  speakerIndex: DialogueSpeakerIndex,
  allowShortAlias: boolean,
): SpeakerContextMatch | null => {
  const trimmedEnd = context.length - context.trimEnd().length;
  const effectiveContext = context.slice(0, context.length - trimmedEnd);
  const tailPattern = new RegExp(`^(?:\\s*(?:[:：]\\s*)|\\s*(?:[,，、]?\\s*)?(?:${speechVerbPattern})(?:[^\\n「『“"'。！？!?]{0,18})?(?:[:：,，、]?\\s*))$`);
  const bareNameTailPattern = /^\s*(?:[:：]?\s*)$/;

  for (const alias of speakerIndex.aliases) {
    if (!allowShortAlias && alias.length <= 1) {
      continue;
    }
    const aliasStart = effectiveContext.lastIndexOf(alias.alias);
    if (aliasStart < 0 || !hasReadableBoundary(effectiveContext, aliasStart, aliasStart + alias.alias.length)) {
      continue;
    }
    const tail = effectiveContext.slice(aliasStart + alias.alias.length);
    if (!tailPattern.test(tail) && !bareNameTailPattern.test(tail)) {
      continue;
    }
    const prefix = effectiveContext.slice(0, aliasStart);
    if (punctuationPattern.test(prefix.slice(-1)) || hasParagraphBreak(prefix)) {
      return makeSpeakerContextMatch(alias, aliasStart, context.length - trimmedEnd);
    }
    if (!prefix.trim()) {
      return makeSpeakerContextMatch(alias, aliasStart, context.length - trimmedEnd);
    }
  }

  return null;
};

const findSpeakerStartingContext = (
  context: string,
  speakerIndex: DialogueSpeakerIndex,
  allowShortAlias: boolean,
): SpeakerContextMatch | null => {
  const prefixPattern = /^\s*(?:[,，。！？!?、]\s*)?/;
  const suffixPattern = new RegExp(`^\\s*(?:${speechVerbPattern})(?:[^\\n。！？!?]{0,18})?[。！？!?]?`);

  for (const alias of speakerIndex.aliases) {
    if (!allowShortAlias && alias.length <= 1) {
      continue;
    }
    const aliasStart = context.indexOf(alias.alias);
    if (aliasStart < 0 || !hasReadableBoundary(context, aliasStart, aliasStart + alias.alias.length)) {
      continue;
    }
    const prefix = context.slice(0, aliasStart);
    if (!prefixPattern.test(prefix) || prefix.trim().replace(/[,，。！？!?、]/g, '')) {
      continue;
    }
    const suffix = context.slice(aliasStart + alias.alias.length);
    const suffixMatch = suffix.match(suffixPattern);
    if (!suffixMatch) {
      continue;
    }
    return makeSpeakerContextMatch(alias, aliasStart, aliasStart + alias.alias.length + suffixMatch[0].length);
  }

  return null;
};

const findAggressiveContextMatch = (
  prefixContext: string,
  suffixContext: string,
  speakerIndex: DialogueSpeakerIndex,
): DialogueSpeakerMatch | null => {
  const candidates = new Map<string, DialogueSpeakerMatch>();
  const nearbyText = `${prefixContext.slice(-48)}\n${suffixContext.slice(0, 48)}`;
  if (!new RegExp(speechVerbPattern).test(nearbyText)) {
    return null;
  }

  for (const alias of speakerIndex.aliases) {
    if (alias.length <= 1 || !nearbyText.includes(alias.alias)) {
      continue;
    }
    candidates.set(alias.primaryName, {
      primaryName: alias.primaryName,
      displayName: alias.displayName,
      alias: alias.alias,
      confidence: 'aggressive',
    });
  }

  return candidates.size === 1 ? [...candidates.values()][0] : null;
};

const makeSpeakerContextMatch = (alias: IndexedSpeakerAlias, startOffset: number, endOffset: number): SpeakerContextMatch => ({
  match: {
    primaryName: alias.primaryName,
    displayName: alias.displayName,
    alias: alias.alias,
    confidence: 'conservative',
  },
  startOffset,
  endOffset,
});

const canInheritPreviousSpeaker = (between: string, speakerIndex: DialogueSpeakerIndex): boolean => {
  if (hasParagraphBreak(between) || punctuationPattern.test(between.replace(/[，,、\s]/g, ''))) {
    return false;
  }
  const normalizedBetween = normalizeAliasKey(between);
  if (!normalizedBetween) {
    return true;
  }
  return !speakerIndex.aliases.some(alias => normalizedBetween.includes(alias.aliasKey));
};

const collectIgnoredRanges = (text: string): IgnoredRange[] => {
  const ranges: IgnoredRange[] = [];
  for (const match of text.matchAll(systemBlockPattern)) {
    if (typeof match.index === 'number') {
      ranges.push({ start: match.index, end: match.index + match[0].length });
    }
  }
  return ranges;
};

const collectQuoteRanges = (text: string, ignoredRanges: readonly IgnoredRange[]): QuoteRange[] => {
  const ranges: QuoteRange[] = [];
  let index = 0;
  while (index < text.length) {
    if (isIgnoredIndex(index, ignoredRanges)) {
      index += 1;
      continue;
    }
    const openChar = text[index];
    const closeChar = quotePairs[openChar];
    if (!closeChar) {
      index += 1;
      continue;
    }

    const closeIndex = findClosingQuote(text, index + 1, closeChar, ignoredRanges);
    if (closeIndex < 0) {
      index += 1;
      continue;
    }
    ranges.push({
      openIndex: index,
      closeIndex,
      endIndex: closeIndex + closeChar.length,
      quote: text.slice(index + openChar.length, closeIndex),
    });
    index = closeIndex + closeChar.length;
  }
  return ranges;
};

const findClosingQuote = (text: string, startIndex: number, closeChar: string, ignoredRanges: readonly IgnoredRange[]): number => {
  let index = startIndex;
  while (index < text.length) {
    if (isIgnoredIndex(index, ignoredRanges)) {
      index += 1;
      continue;
    }
    if (text.startsWith(closeChar, index)) {
      return index;
    }
    index += 1;
  }
  return -1;
};

const isIgnoredIndex = (index: number, ignoredRanges: readonly IgnoredRange[]): boolean =>
  ignoredRanges.some(range => index >= range.start && index < range.end);

const findContextStart = (text: string, quoteStart: number): number => {
  const windowStart = Math.max(0, quoteStart - 96);
  const before = text.slice(windowStart, quoteStart);
  const newlineIndex = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('\r'));
  if (newlineIndex >= 0) {
    return windowStart + newlineIndex + 1;
  }
  const sentenceIndex = Math.max(before.lastIndexOf('。'), before.lastIndexOf('！'), before.lastIndexOf('？'), before.lastIndexOf('!'), before.lastIndexOf('?'));
  return sentenceIndex >= 0 ? windowStart + sentenceIndex + 1 : windowStart;
};

const hasReadableBoundary = (text: string, start: number, end: number): boolean => {
  const before = start > 0 ? text[start - 1] : '';
  const after = end < text.length ? text[end] : '';
  const currentStart = text[start] ?? '';
  const currentEnd = text[end - 1] ?? '';
  if (asciiWordPattern.test(currentStart) && asciiWordPattern.test(before)) {
    return false;
  }
  if (asciiWordPattern.test(currentEnd) && asciiWordPattern.test(after)) {
    return false;
  }
  return true;
};

const hasParagraphBreak = (text: string): boolean => /\n\s*\n|\r\s*\r/.test(text);

const normalizeVisibleText = (value: string): string => value.replace(/\s+/g, ' ').trim();

const normalizeAliasKey = (value: string): string => value.replace(/\s+/g, '').toLocaleLowerCase();

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
