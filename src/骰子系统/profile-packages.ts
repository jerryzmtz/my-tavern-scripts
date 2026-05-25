export const ACU_DICE_PROFILE_FORMAT = 'acu_dice_profile_v1' as const;
export const ACU_DICE_PROFILE_MARKER_PREFIX = 'ACUDICE_PROFILE_V1:';
export const ACU_DICE_PROFILE_MARKER_PATTERN = /<!--\s*ACUDICE_PROFILE_V1:([A-Za-z0-9+/=_\-\s]+)\s*-->/g;

export interface AcuDiceProfileSource {
  type: string;
  characterName?: string;
  characterId?: string;
  chatId?: string;
  label?: string;
  profileId?: string;
}

export interface AcuDiceProfilePackage<TBackup = unknown> {
  format: typeof ACU_DICE_PROFILE_FORMAT;
  id: string;
  name: string;
  source: AcuDiceProfileSource;
  createdAt: string;
  updatedAt: string;
  moduleIds: string[];
  backup: TBackup;
  fingerprint: string;
}

export interface AcuDiceProfileMarkerCandidate {
  payload: string;
  raw: string;
  index: number;
}

export interface NormalizeAcuDiceProfileOptions {
  id?: string;
  name?: string;
  source?: AcuDiceProfileSource;
  now?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toCleanString = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';

const normalizeDateString = (value: unknown, fallback: string): string => {
  const text = toCleanString(value);
  return text ? text : fallback;
};

export const normalizeAcuDiceProfileSource = (value: unknown): AcuDiceProfileSource => {
  if (!isRecord(value)) return { type: 'imported' };
  const type = toCleanString(value.type) || 'imported';
  const source: AcuDiceProfileSource = { type };
  const characterName = toCleanString(value.characterName);
  const characterId = toCleanString(value.characterId);
  const chatId = toCleanString(value.chatId);
  const label = toCleanString(value.label);
  const profileId = toCleanString(value.profileId);
  if (characterName) source.characterName = characterName;
  if (characterId) source.characterId = characterId;
  if (chatId) source.chatId = chatId;
  if (label) source.label = label;
  if (profileId) source.profileId = profileId;
  return source;
};

export const getAcuDiceProfileSourceKey = (source: AcuDiceProfileSource): string =>
  source.type === 'character' || source.type === 'character_card'
    ? [source.type, source.characterName || source.characterId || ''].map(part => String(part).trim()).join('|')
    : [
        source.type || 'imported',
        source.characterName || '',
        source.characterId || '',
        source.profileId || source.label || '',
      ]
        .map(part => String(part).trim())
        .join('|');

const normalizeModuleIds = (value: unknown, backup: unknown): string[] => {
  const ids = Array.isArray(value) ? value.map(toCleanString).filter(Boolean) : [];
  if (ids.length > 0) return Array.from(new Set(ids));
  if (isRecord(backup) && isRecord(backup.modules)) return Object.keys(backup.modules);
  return [];
};

const stableStringify = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'undefined';
  if (Array.isArray(value)) return `[${value.map(item => stableStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map(key => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
};

export const computeAcuDiceProfileFingerprint = (backup: unknown, moduleIds: readonly string[]): string => {
  const text = stableStringify({
    backup,
    moduleIds: Array.from(new Set(moduleIds.map(String))).sort(),
  });
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= BigInt(text.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }
  return hash.toString(16).padStart(16, '0');
};

const sanitizeIdPart = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

export const createAcuDiceProfileId = (name: string, fingerprint: string): string => {
  const prefix = sanitizeIdPart(name) || 'profile';
  return `acu_${prefix}_${fingerprint.slice(0, 12)}`;
};

export const normalizeAcuDiceProfilePackage = <TBackup = unknown>(
  value: unknown,
  options: NormalizeAcuDiceProfileOptions = {},
): AcuDiceProfilePackage<TBackup> => {
  const now = options.now || new Date().toISOString();
  const record = isRecord(value) ? value : {};
  const isProfile = record.format === ACU_DICE_PROFILE_FORMAT;
  const backup = (isProfile ? record.backup : value) as TBackup;
  if (!isRecord(backup)) throw new Error('配置方案包缺少 backup 对象。');

  const moduleIds = normalizeModuleIds(isProfile ? record.moduleIds : undefined, backup);
  const fingerprint =
    toCleanString(isProfile ? record.fingerprint : '') || computeAcuDiceProfileFingerprint(backup, moduleIds);
  const source = normalizeAcuDiceProfileSource(isProfile ? record.source : options.source);
  const fallbackName =
    options.name ||
    source.label ||
    (source.characterName ? `${source.characterName}配置方案` : '') ||
    'AcuDice 配置方案';
  const name = toCleanString(isProfile ? record.name : '') || fallbackName;

  return {
    format: ACU_DICE_PROFILE_FORMAT,
    id: toCleanString(isProfile ? record.id : options.id) || createAcuDiceProfileId(name, fingerprint),
    name,
    source,
    createdAt: normalizeDateString(isProfile ? record.createdAt : undefined, now),
    updatedAt: normalizeDateString(isProfile ? record.updatedAt : undefined, now),
    moduleIds,
    backup,
    fingerprint,
  };
};

const getBuffer = ():
  | {
      from(value: string | Uint8Array, encoding?: string): { toString(encoding?: string): string };
    }
  | undefined =>
  (
    globalThis as unknown as {
      Buffer?: { from: (value: string | Uint8Array, encoding?: string) => { toString(encoding?: string): string } };
    }
  ).Buffer;

export const encodeAcuDiceProfileMarkerPayload = (jsonText: string): string => {
  const buffer = getBuffer();
  if (buffer) return buffer.from(jsonText, 'utf8').toString('base64');
  const bytes = new TextEncoder().encode(jsonText);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

export const decodeAcuDiceProfileMarkerPayload = (payload: string): string => {
  const normalized = String(payload || '')
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const buffer = getBuffer();
  if (buffer) return buffer.from(normalized, 'base64').toString('utf8');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const createAcuDiceProfileMarker = (profile: AcuDiceProfilePackage): string =>
  `<!-- ${ACU_DICE_PROFILE_MARKER_PREFIX}${encodeAcuDiceProfileMarkerPayload(JSON.stringify(profile))} -->`;

export const extractAcuDiceProfileMarkerPayloads = (text: string): AcuDiceProfileMarkerCandidate[] => {
  const candidates: AcuDiceProfileMarkerCandidate[] = [];
  ACU_DICE_PROFILE_MARKER_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ACU_DICE_PROFILE_MARKER_PATTERN.exec(String(text || '')))) {
    candidates.push({
      payload: match[1],
      raw: match[0],
      index: match.index,
    });
  }
  return candidates;
};

export const parseAcuDiceProfileMarkers = (text: string): unknown[] =>
  extractAcuDiceProfileMarkerPayloads(text).map(candidate =>
    JSON.parse(decodeAcuDiceProfileMarkerPayload(candidate.payload)),
  );

export const getAcuDiceProfilePromptKey = (chatId: string, fingerprint: string): string =>
  `${String(chatId || 'unknown_chat')}|${String(fingerprint || 'unknown_profile')}`;
