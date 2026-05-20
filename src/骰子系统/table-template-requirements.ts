export const TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT = 'acu_table_template_requirement_preset_v1';
export const TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION = 1;
export const DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID = '__builtin_table_template_dice_v42__';

export type TemplateInspectionSeverity = 'error' | 'warning' | 'info';
export type TemplateSourceTextField = 'note' | 'initNode' | 'insertNode' | 'updateNode' | 'deleteNode';

export type TableTemplateRequirementLevelConfig = {
  defaults?: {
    sheet?: TemplateInspectionSeverity;
    header?: TemplateInspectionSeverity;
    ddl?: TemplateInspectionSeverity;
    sourceData?: Partial<Record<TemplateSourceTextField, TemplateInspectionSeverity>>;
    config?: TemplateInspectionSeverity;
    mate?: TemplateInspectionSeverity;
  };
  sheets?: Record<
    string,
    {
      sheet?: TemplateInspectionSeverity;
      header?: TemplateInspectionSeverity;
      headers?: Record<string, TemplateInspectionSeverity>;
      ddl?: TemplateInspectionSeverity;
      sourceData?: Partial<Record<TemplateSourceTextField, TemplateInspectionSeverity>>;
      config?: TemplateInspectionSeverity;
    }
  >;
};

export type TemplateRecord = Record<string, unknown>;

export type TableTemplateRequirementPreset = {
  id: string;
  name: string;
  description?: string;
  format?: string;
  version?: number;
  builtin?: boolean;
  order?: number;
  requirementLevels?: TableTemplateRequirementLevelConfig;
  template: TemplateRecord;
};

export type TemplateInspectionSheet = {
  key: string;
  name: string;
  headers: string[];
  sqlTableName: string;
  sourceData: Record<string, unknown>;
  raw: Record<string, unknown>;
};

export type TemplateInspectionIssue = {
  severity: TemplateInspectionSeverity;
  groupName: string;
  title: string;
  missing: string[];
  impact: string;
  suggestion: string;
  fixable: boolean;
  fixActions: string[];
};

export type TemplateInspectionIssueGroup = {
  name: string;
  severity: TemplateInspectionSeverity;
  issues: TemplateInspectionIssue[];
};

export type TemplateInspectionResult = {
  presetId: string;
  presetName: string;
  sheets: TemplateInspectionSheet[];
  issues: TemplateInspectionIssue[];
  fixableCount: number;
  manualCount: number;
  checkedAt: string;
};

export type TableTemplateRepairPlan = {
  changed: boolean;
  repairedTemplate: TemplateRecord | null;
  actions: string[];
  manualIssues: string[];
};

type TemplateSheetEntry = {
  key: string;
  sheet: Record<string, unknown>;
};

type SheetMatchResult = {
  entry: TemplateSheetEntry | null;
  ambiguous: boolean;
  reasons: string[];
};

type DdlColumnInfo = {
  sqlName: string;
  comment: string;
  definition: string;
};

type SheetRowShape = {
  expectedWidth: number;
  shortRows: number;
  longRows: number;
  nonArrayRows: number;
};

const SOURCE_TEXT_FIELDS: TemplateSourceTextField[] = ['note', 'initNode', 'insertNode', 'updateNode', 'deleteNode'];
const CONFIG_FIELDS = ['updateConfig', 'exportConfig'] as const;
const TEMPLATE_ORDER_FIELD = 'orderNo';
const SOURCE_TEXT_FIELD_LABELS: Record<TemplateSourceTextField, string> = {
  note: '表格说明',
  initNode: '初始化规则',
  insertNode: '新增数据规则',
  updateNode: '更新数据规则',
  deleteNode: '删除数据规则',
};
const CONFIG_FIELD_LABELS: Record<(typeof CONFIG_FIELDS)[number], string> = {
  updateConfig: '自动更新设置',
  exportConfig: '导出设置',
};
const SEVERITY_RANK: Record<TemplateInspectionSeverity, number> = {
  info: 0,
  warning: 1,
  error: 2,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const cloneTemplateValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const hasOwn = (record: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(record, key);

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeSeverity = (
  value: unknown,
  fallback: TemplateInspectionSeverity = 'info',
): TemplateInspectionSeverity => {
  if (value === 'error' || value === 'warning' || value === 'info') return value;
  return fallback;
};

const maxSeverity = (values: TemplateInspectionSeverity[]): TemplateInspectionSeverity => {
  if (values.length === 0) return 'info';
  return values.reduce((highest, value) => (SEVERITY_RANK[value] > SEVERITY_RANK[highest] ? value : highest), 'info');
};

const normalizeTemplateText = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const normalizeHeaderText = (value: unknown): string => normalizeTemplateText(value).replace(/\s+/g, '');
const normalizeHeaderLookupText = (value: unknown): string =>
  normalizeHeaderText(value)
    .replace(/（/g, '(')
    .replace(/）/g, ')');

const isRowIdHeader = (value: unknown): boolean => {
  const normalized = normalizeHeaderText(value);
  return normalized === 'row_id' || normalized === '行号';
};

const getSourceTextFieldLabel = (field: string): string =>
  Object.prototype.hasOwnProperty.call(SOURCE_TEXT_FIELD_LABELS, field)
    ? SOURCE_TEXT_FIELD_LABELS[field as TemplateSourceTextField]
    : field;

const getConfigFieldLabel = (field: string): string =>
  Object.prototype.hasOwnProperty.call(CONFIG_FIELD_LABELS, field)
    ? CONFIG_FIELD_LABELS[field as (typeof CONFIG_FIELDS)[number]]
    : field;

const formatSheetName = (name: string): string => `“${name}”`;

const normalizeDdlColumnComment = (comment: unknown): string =>
  toSafeString(comment)
    .replace(/[，,].*$/, '')
    .trim();

const getDdlColumnCommentAliases = (comment: unknown): string[] => {
  const fullComment = normalizeDdlColumnComment(comment);
  if (!fullComment) return [];
  const aliases = [fullComment];
  const looseComment = fullComment.replace(/[（(].*$/, '').trim();
  if (looseComment && looseComment !== fullComment) aliases.push(looseComment);
  return Array.from(new Set(aliases));
};

const headersEquivalent = (left: unknown, right: unknown): boolean => {
  if (isRowIdHeader(left) && isRowIdHeader(right)) return true;
  return normalizeHeaderLookupText(left) === normalizeHeaderLookupText(right);
};

const toSafeString = (value: unknown): string => String(value ?? '').trim();

const getTemplateSheetEntries = (template: unknown): TemplateSheetEntry[] => {
  if (!isRecord(template)) return [];
  return Object.entries(template)
    .filter((entry): entry is [string, Record<string, unknown>] => {
      const [key, value] = entry;
      return key.startsWith('sheet_') && isRecord(value);
    })
    .map(([key, sheet]) => ({ key, sheet }))
    .sort((left, right) => getSheetOrder(left.sheet) - getSheetOrder(right.sheet));
};

const getSheetOrder = (sheet: Record<string, unknown>): number => {
  const value = Number(sheet[TEMPLATE_ORDER_FIELD]);
  return Number.isFinite(value) ? value : 999999;
};

const getSheetHeaders = (sheet: Record<string, unknown>): string[] => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const headerRow = Array.isArray(content[0]) ? content[0] : [];
  return headerRow.map(header => toSafeString(header));
};

const getSheetContentProblems = (sheet: Record<string, unknown>): string[] => {
  if (hasOwn(sheet, 'content') && !Array.isArray(sheet.content)) return ['content 必须是数组'];
  if (Array.isArray(sheet.content) && sheet.content.length > 0 && !Array.isArray(sheet.content[0])) {
    return ['content[0] 表头行必须是数组'];
  }
  return [];
};

const ensureSheetContent = (sheet: Record<string, unknown>): unknown[][] => {
  if (!Array.isArray(sheet.content)) sheet.content = [['row_id']];
  const content = sheet.content as unknown[][];
  if (!Array.isArray(content[0])) content[0] = ['row_id'];
  return content;
};

const getSheetSourceData = (sheet: Record<string, unknown>): Record<string, unknown> => {
  if (!isRecord(sheet.sourceData)) sheet.sourceData = {};
  return sheet.sourceData as Record<string, unknown>;
};

const getDdlStructureText = (ddl: unknown): string =>
  String(ddl || '')
    .replace(/'([^']|'')*'/g, "''")
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--[^\r\n]*/g, '');

const stripDdlBlockComments = (ddl: unknown): string => String(ddl || '').replace(/\/\*[\s\S]*?\*\//g, '');

export const parseDdlTableName = (ddl: unknown): string => {
  const match = getDdlStructureText(ddl).match(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z_][A-Za-z0-9_]*)/i);
  return toSafeString(match?.[1]);
};

const countDdlCreateTableStatements = (ddl: unknown): number =>
  (getDdlStructureText(ddl).match(/\bCREATE\s+TABLE\b/gi) || []).length;

const hasDdlTrailingCommaBeforeClose = (ddl: unknown): boolean =>
  /,\s*\)\s*;?\s*$/.test(getDdlStructureText(ddl));

const getDdlSeparatorProblems = (ddl: unknown): string[] => {
  const lines = getDdlStructureText(ddl).split(/\r?\n/);
  const definitions: { lineNumber: number; text: string }[] = [];
  let insideCreateTable = false;

  lines.forEach((line, index) => {
    const text = line.trim();
    if (!insideCreateTable && /\bCREATE\s+TABLE\b/i.test(text)) {
      insideCreateTable = true;
      return;
    }
    if (!insideCreateTable) return;
    if (!text || text.startsWith('/*') || text.endsWith('*/')) return;
    if (/^\)/.test(text)) {
      insideCreateTable = false;
      return;
    }
    definitions.push({ lineNumber: index + 1, text });
  });

  return definitions
    .slice(0, -1)
    .filter(definition => !definition.text.endsWith(','))
    .map(definition => `建表说明第 ${definition.lineNumber} 行定义后缺少逗号`);
};

const parseDdlColumns = (ddl: unknown): DdlColumnInfo[] => {
  const text = stripDdlBlockComments(ddl);
  if (!text.trim()) return [];
  const lines = text.split(/\r?\n/);
  const columns: DdlColumnInfo[] = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || /^\)?;?$/.test(trimmed)) continue;
    if (/^CREATE\s+TABLE\b/i.test(trimmed)) continue;
    if (/^(CONSTRAINT|PRIMARY|UNIQUE|CHECK|FOREIGN)\b/i.test(trimmed)) continue;
    const match = trimmed.match(/^(?:"((?:[^"]|"")*)"|`((?:[^`]|``)*)`|\[([^\]]+)\]|([A-Za-z_][A-Za-z0-9_]*))(.*)$/);
    if (!match) continue;
    const sqlName = (match[1] || match[2] || match[3] || match[4]).replace(/""/g, '"').replace(/``/g, '`');
    const definition = normalizeDdlColumnDefinition(`${sqlName}${match[5] || ''}`);
    const commentMatch = definition.match(/--\s*(.+?)\s*$/);
    const comment = normalizeDdlColumnComment(commentMatch?.[1]);
    columns.push({ sqlName, comment, definition });
  }
  return columns;
};

const normalizeDdlColumnDefinition = (definition: string): string =>
  definition.trim().replace(/,\s*$/, '').replace(/,\s*(--\s*.*)$/, ' $1');

const formatDdlColumnDefinition = (definition: string, needsComma: boolean): string => {
  const cleaned = normalizeDdlColumnDefinition(definition);
  if (!needsComma) return cleaned;
  if (/\s--\s*/.test(cleaned)) return cleaned.replace(/\s+(--\s*.*)$/, ', $1');
  return `${cleaned},`;
};

const appendCommaToLastDdlColumnLine = (text: string): string => {
  const lines = text.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index].trim()) continue;
    lines[index] = formatDdlColumnDefinition(lines[index], true);
    return lines.join('\n');
  }
  return text;
};

const getDdlColumnForHeader = (ddl: unknown, header: string): DdlColumnInfo | null => {
  const columns = getDdlColumnsForHeader(ddl, header);
  return columns[0] || null;
};

const getDdlColumnsForHeader = (ddl: unknown, header: string): DdlColumnInfo[] =>
  parseDdlColumns(ddl).filter(
    column =>
      getDdlColumnCommentAliases(column.comment).some(alias => headersEquivalent(alias, header)) ||
      headersEquivalent(column.sqlName, header),
  );

const getDdlColumnsForSqlName = (ddl: unknown, sqlName: string): DdlColumnInfo[] =>
  parseDdlColumns(ddl).filter(column => column.sqlName === sqlName);

const hasDdlColumnForHeader = (ddl: unknown, header: string): boolean => Boolean(getDdlColumnForHeader(ddl, header));

const getDuplicateDdlSqlNames = (ddl: unknown): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  parseDdlColumns(ddl).forEach(column => {
    const normalized = column.sqlName.toLowerCase();
    if (seen.has(normalized)) duplicates.add(column.sqlName);
    seen.add(normalized);
  });
  return Array.from(duplicates.values());
};

const hasDdlSqlNameForRequirementHeader = (targetDdl: unknown, requirementDdl: unknown, header: string): boolean => {
  const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
  return Boolean(requirementColumn && getDdlColumnsForSqlName(targetDdl, requirementColumn.sqlName).length > 0);
};

const getDdlColumnBody = (column: DdlColumnInfo): string =>
  column.definition
    .replace(new RegExp(`^\\s*${escapeRegExp(column.sqlName)}\\b`), '')
    .replace(/\s--.*$/, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

const getSheetSqlTableName = (sheet: Record<string, unknown>): string =>
  parseDdlTableName(isRecord(sheet.sourceData) ? sheet.sourceData.ddl : '');

const makeInspectionSheet = (key: string, sheet: Record<string, unknown>): TemplateInspectionSheet => ({
  key,
  name: toSafeString(sheet.name || key),
  headers: getSheetHeaders(sheet),
  sqlTableName: getSheetSqlTableName(sheet),
  sourceData: isRecord(sheet.sourceData) ? (sheet.sourceData as Record<string, unknown>) : {},
  raw: sheet,
});

export const getTemplateInspectionSheets = (template: unknown): TemplateInspectionSheet[] =>
  getTemplateSheetEntries(template).map(entry => makeInspectionSheet(entry.key, entry.sheet));

const getPresetSheetLevelConfig = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): NonNullable<TableTemplateRequirementLevelConfig['sheets']>[string] | null => {
  const sheetLevels = preset.requirementLevels?.sheets;
  if (!isRecord(sheetLevels)) return null;
  const candidates = [
    requirementKey,
    toSafeString(requirementSheet.name),
    getSheetSqlTableName(requirementSheet),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (isRecord(sheetLevels[candidate])) return sheetLevels[candidate];
  }
  return null;
};

const getConfiguredHeaderSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
  header: string,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  const headerLevels = isRecord(sheetConfig?.headers) ? sheetConfig.headers : {};
  const direct = headerLevels[header];
  if (direct) return normalizeSeverity(direct, 'error');
  const fuzzy = Object.entries(headerLevels).find(([key]) => headersEquivalent(key, header))?.[1];
  if (fuzzy) return normalizeSeverity(fuzzy, 'error');
  return normalizeSeverity(
    sheetConfig?.header || preset.requirementLevels?.defaults?.header,
    'error',
  );
};

const getConfiguredSheetSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.sheet || preset.requirementLevels?.defaults?.sheet, 'error');
};

const getConfiguredDdlSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.ddl || preset.requirementLevels?.defaults?.ddl, 'warning');
};

const getConfiguredSourceFieldSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
  field: TemplateSourceTextField,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(
    sheetConfig?.sourceData?.[field] || preset.requirementLevels?.defaults?.sourceData?.[field],
    field === 'note' ? 'warning' : 'info',
  );
};

const getConfiguredConfigSeverity = (
  preset: TableTemplateRequirementPreset,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateInspectionSeverity => {
  const sheetConfig = getPresetSheetLevelConfig(preset, requirementKey, requirementSheet);
  return normalizeSeverity(sheetConfig?.config || preset.requirementLevels?.defaults?.config, 'info');
};

const getConfiguredMateSeverity = (preset: TableTemplateRequirementPreset): TemplateInspectionSeverity =>
  normalizeSeverity(preset.requirementLevels?.defaults?.mate, 'info');

const findMatchingSheetEntry = (
  targetTemplate: unknown,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): TemplateSheetEntry | null => findMatchingSheetMatch(targetTemplate, requirementKey, requirementSheet).entry;

const findMatchingSheetMatch = (
  targetTemplate: unknown,
  requirementKey: string,
  requirementSheet: Record<string, unknown>,
): SheetMatchResult => {
  const entries = getTemplateSheetEntries(targetTemplate);
  const exact = entries.find(entry => entry.key === requirementKey);
  if (exact) return { entry: exact, ambiguous: false, reasons: [] };

  const requirementSqlName = getSheetSqlTableName(requirementSheet);
  if (requirementSqlName) {
    const bySqlName = entries.filter(entry => getSheetSqlTableName(entry.sheet) === requirementSqlName);
    if (bySqlName.length === 1) return { entry: bySqlName[0], ambiguous: false, reasons: [] };
    if (bySqlName.length > 1) {
      return {
        entry: null,
        ambiguous: true,
        reasons: [`有 ${bySqlName.length} 张表使用 SQL 表名 ${requirementSqlName}`],
      };
    }
  }

  const requirementName = normalizeTemplateText(requirementSheet.name);
  if (!requirementName) return { entry: null, ambiguous: false, reasons: [] };
  const byName = entries.filter(entry => normalizeTemplateText(entry.sheet.name) === requirementName);
  const compatibleByName = requirementSqlName
    ? byName.filter(entry => {
        const sqlName = getSheetSqlTableName(entry.sheet);
        return sqlName === requirementSqlName;
      })
    : byName;
  if (compatibleByName.length === 1) return { entry: compatibleByName[0], ambiguous: false, reasons: [] };
  if (compatibleByName.length > 1) {
    return {
      entry: null,
      ambiguous: true,
      reasons: [`有 ${compatibleByName.length} 张表使用显示名 ${toSafeString(requirementSheet.name)}`],
    };
  }
  return { entry: null, ambiguous: false, reasons: [] };
};

const getMissingHeaders = (targetHeaders: string[], requirementHeaders: string[]): string[] =>
  requirementHeaders.filter(header => !targetHeaders.some(targetHeader => headersEquivalent(targetHeader, header)));

const getDuplicateHeaders = (headers: string[]): string[] => {
  const seen = new Map<string, string>();
  const duplicates = new Map<string, string>();
  headers.forEach(header => {
    const normalized = normalizeHeaderText(header);
    if (!normalized) return;
    if (seen.has(normalized)) {
      duplicates.set(normalized, seen.get(normalized) || header);
      return;
    }
    seen.set(normalized, header);
  });
  return Array.from(duplicates.values());
};

const getSheetRowShape = (sheet: Record<string, unknown>): SheetRowShape => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const expectedWidth = Array.isArray(content[0]) ? content[0].length : 0;
  const shape: SheetRowShape = { expectedWidth, shortRows: 0, longRows: 0, nonArrayRows: 0 };
  if (expectedWidth === 0) return shape;
  content.slice(1).forEach(row => {
    if (!Array.isArray(row)) {
      shape.nonArrayRows += 1;
      return;
    }
    if (row.length < expectedWidth) shape.shortRows += 1;
    if (row.length > expectedWidth) shape.longRows += 1;
  });
  return shape;
};

const buildRowShapeMissing = (shape: SheetRowShape): string[] => {
  const missing: string[] = [];
  if (shape.shortRows > 0) missing.push(`${shape.shortRows} 行数据短于表头列数`);
  if (shape.longRows > 0) missing.push(`${shape.longRows} 行数据长于表头列数`);
  if (shape.nonArrayRows > 0) missing.push(`${shape.nonArrayRows} 行数据不是数组`);
  return missing;
};

const padShortRowsToHeaderLength = (sheet: Record<string, unknown>): number => {
  const content = Array.isArray(sheet.content) ? sheet.content : [];
  const expectedWidth = Array.isArray(content[0]) ? content[0].length : 0;
  if (expectedWidth === 0) return 0;
  let changedRows = 0;
  content.slice(1).forEach(row => {
    if (!Array.isArray(row) || row.length >= expectedWidth) return;
    while (row.length < expectedWidth) row.push('');
    changedRows += 1;
  });
  return changedRows;
};

const getDdlStructureProblems = (targetDdl: unknown, requirementDdl: unknown): string[] => {
  const problems: string[] = [];
  const targetText = String(targetDdl || '').trim();
  if (!targetText) return problems;

  const createCount = countDdlCreateTableStatements(targetText);
  if (createCount === 0) problems.push('建表说明缺少 CREATE TABLE 语句');
  if (createCount > 1) problems.push(`建表说明包含 ${createCount} 个 CREATE TABLE 语句`);
  if (createCount > 0 && !/\)\s*;\s*$/.test(getDdlStructureText(targetText))) problems.push('建表说明缺少结尾的 );');
  if (hasDdlTrailingCommaBeforeClose(targetText)) problems.push('建表说明在右括号前存在尾随逗号');
  problems.push(...getDdlSeparatorProblems(targetText));
  getDuplicateDdlSqlNames(targetText).forEach(sqlName => {
    problems.push(`建表说明存在重复 SQL 列名 ${sqlName}`);
  });

  const targetTableName = parseDdlTableName(targetText);
  const requirementTableName = parseDdlTableName(requirementDdl);
  if (targetTableName && requirementTableName && targetTableName !== requirementTableName) {
    problems.push(`建表说明表名为 ${targetTableName}，默认要求为 ${requirementTableName}`);
  }

  return problems;
};

const getDdlColumnCompatibilityProblems = (
  targetDdl: unknown,
  requirementDdl: unknown,
  headers: string[],
): string[] => {
  const problems: string[] = [];
  headers.forEach(header => {
    if (isRowIdHeader(header)) return;
    const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
    if (!requirementColumn) return;
    const targetColumns = getDdlColumnsForHeader(targetDdl, header);
    const sqlNameColumns = getDdlColumnsForSqlName(targetDdl, requirementColumn.sqlName);
    const matchedByHeader = targetColumns.length > 0;
    const candidateColumns = targetColumns.length > 0 ? targetColumns : sqlNameColumns;
    if (candidateColumns.length === 0) return;
    if (candidateColumns.length > 1) {
      problems.push(`“${header}”在建表说明中匹配到 ${candidateColumns.length} 个列定义`);
      return;
    }
    const targetColumn = candidateColumns[0];
    if (
      !matchedByHeader ||
      targetColumn.sqlName !== requirementColumn.sqlName ||
      getDdlColumnBody(targetColumn) !== getDdlColumnBody(requirementColumn)
    ) {
      problems.push(
        `“${header}”当前定义为 ${targetColumn.definition}，默认要求为 ${requirementColumn.definition}`,
      );
    }
  });
  return problems;
};

const SOURCE_RULE_TAGS = ['属性规则', '检定规则'] as const;
const SOURCE_TEXT_WARNING_LENGTH = 50000;

const countTextMatches = (text: string, pattern: RegExp): number => (text.match(pattern) || []).length;

const getRuleTagOrder = (text: string): string[] =>
  SOURCE_RULE_TAGS.map(tag => ({ tag, index: text.indexOf(`<${tag}>`) }))
    .filter(item => item.index >= 0)
    .sort((left, right) => left.index - right.index)
    .map(item => item.tag);

const getRuleTagStackProblems = (text: string): string[] => {
  const problems: string[] = [];
  const stack: string[] = [];
  const pattern = /<\/?(属性规则|检定规则)>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const token = match[0];
    const tag = match[1];
    if (!token.startsWith('</')) {
      stack.push(tag);
      continue;
    }
    const opened = stack.pop();
    if (opened !== tag) {
      problems.push('规则标记嵌套顺序不正确');
      break;
    }
  }
  return problems;
};

const getSourceTextTagProblems = (targetText: unknown, requirementText: unknown): string[] => {
  if (typeof targetText !== 'string') return [];
  const requirement = typeof requirementText === 'string' ? requirementText : '';
  const problems: string[] = [];
  SOURCE_RULE_TAGS.forEach(tag => {
    const openPattern = new RegExp(`<${tag}>`, 'g');
    const closePattern = new RegExp(`</${tag}>`, 'g');
    const targetOpenCount = countTextMatches(targetText, openPattern);
    const targetCloseCount = countTextMatches(targetText, closePattern);
    const requirementUsesTag = requirement.includes(`<${tag}>`) || requirement.includes(`</${tag}>`);
    if (requirementUsesTag && (targetOpenCount === 0 || targetCloseCount === 0)) {
      problems.push(`缺少完整的 <${tag}>...</${tag}> 标记`);
      return;
    }
    if (targetOpenCount !== targetCloseCount) problems.push(`<${tag}> 标记未成对闭合`);
    if (targetOpenCount > 1) problems.push(`<${tag}> 标记重复出现`);
  });
  problems.push(...getRuleTagStackProblems(targetText));
  const requirementOrder = getRuleTagOrder(requirement);
  const targetOrder = getRuleTagOrder(targetText);
  if (
    requirementOrder.length > 1 &&
    requirementOrder.every(tag => targetOrder.includes(tag)) &&
    requirementOrder.join('|') !== targetOrder.filter(tag => requirementOrder.includes(tag)).join('|')
  ) {
    problems.push('规则标记顺序与模板检验预设不一致');
  }
  return problems;
};

const getSourceTextNoiseProblems = (targetText: unknown): string[] => {
  if (typeof targetText !== 'string') return [];
  const problems: string[] = [];
  if (targetText.length > SOURCE_TEXT_WARNING_LENGTH) {
    problems.push(`文本长度超过 ${SOURCE_TEXT_WARNING_LENGTH} 字，建议拆分或压缩`);
  }
  if (
    /<script\b|on[a-z]+\s*=|javascript:/i.test(targetText) ||
    /<\/?(?:a|audio|button|div|embed|form|iframe|img|input|math|object|span|style|svg|video)\b/i.test(targetText)
  ) {
    problems.push('包含疑似可执行 HTML/脚本噪音');
  }
  return problems;
};

const textMentionsValue = (text: unknown, value: unknown): boolean => {
  const normalizedText = normalizeTemplateText(text);
  const normalizedValue = normalizeTemplateText(value);
  return Boolean(normalizedValue && normalizedText.includes(normalizedValue));
};

const getSourceFieldMissingHeaders = (
  targetSource: Record<string, unknown>,
  requirementSource: Record<string, unknown>,
  field: string,
  missingHeaders: string[],
): string[] => {
  const requirementText = requirementSource[field];
  if (!requirementText) return [];
  const targetText = targetSource[field];
  if (!targetText) return missingHeaders.filter(header => textMentionsValue(requirementText, header));
  return missingHeaders.filter(header => textMentionsValue(requirementText, header) && !textMentionsValue(targetText, header));
};

const collectMissingObjectPaths = (target: unknown, requirement: unknown, prefix = ''): string[] => {
  if (!isRecord(requirement)) return [];
  const targetRecord = isRecord(target) ? target : {};
  const paths: string[] = [];
  Object.keys(requirement).forEach(key => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!Object.prototype.hasOwnProperty.call(targetRecord, key)) {
      paths.push(path);
      return;
    }
    if (isRecord(requirement[key]) && isRecord(targetRecord[key])) {
      paths.push(...collectMissingObjectPaths(targetRecord[key], requirement[key], path));
    }
  });
  return paths;
};

const buildIssue = (issue: TemplateInspectionIssue): TemplateInspectionIssue => issue;

const collectDuplicateValues = (items: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  items.forEach(item => {
    const normalized = normalizeTemplateText(item);
    if (!normalized) return;
    if (seen.has(normalized)) duplicates.add(item);
    seen.add(normalized);
  });
  return Array.from(duplicates.values());
};

const getTemplateStructureIssues = (template: unknown, sheets: TemplateInspectionSheet[]): TemplateInspectionIssue[] => {
  const issues: TemplateInspectionIssue[] = [];
  const duplicateNames = collectDuplicateValues(sheets.map(sheet => sheet.name));
  if (duplicateNames.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复表格显示名',
        missing: duplicateNames.map(name => `重复表格显示名：${name}`),
        impact: '按显示名 fallback 匹配表格时可能选错表，自动修复也可能补到错误位置。',
        suggestion: '请确保每张表的显示名唯一；如果需要保留旧表，建议改成清晰的归档名称。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  const duplicateSqlNames = collectDuplicateValues(sheets.map(sheet => sheet.sqlTableName));
  if (duplicateSqlNames.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复 SQL 表名',
        missing: duplicateSqlNames.map(name => `重复 SQL 表名：${name}`),
        impact: '多张表声明同一个 SQL 表名时，系统无法可靠判断哪张表才是当前聊天真正生效的数据表。',
        suggestion: '请确认重复表是否为旧版本残留；正式使用的表应保持唯一 SQL 表名。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  const entries = getTemplateSheetEntries(template);
  const orderValues = entries
    .map(entry => Number(entry.sheet[TEMPLATE_ORDER_FIELD]))
    .filter(value => Number.isFinite(value))
    .map(value => String(value));
  const duplicateOrders = collectDuplicateValues(orderValues);
  if (duplicateOrders.length > 0) {
    issues.push(
      buildIssue({
        severity: 'warning',
        groupName: '模板全局结构',
        title: '存在重复表格排序号',
        missing: duplicateOrders.map(order => `重复 orderNo：${order}`),
        impact: '排序号冲突会让 fallback 匹配和界面展示顺序不稳定。',
        suggestion: '请为每张表设置唯一的 orderNo。',
        fixable: false,
        fixActions: [],
      }),
    );
  }

  return issues;
};

type BuiltinRequirementSheetSpec = {
  key: string;
  headers: string[];
  sheetSeverity: TemplateInspectionSeverity;
  defaultHeaderSeverity: TemplateInspectionSeverity;
  headerSeverities?: Record<string, TemplateInspectionSeverity>;
};

const BUILTIN_DICE_REQUIREMENT_SPECS: BuiltinRequirementSheetSpec[] = [
  {
    key: 'sheet_global_data',
    headers: ['当前详细地点', '当前次要地区', '当前主要地区', '当前时间'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 当前主要地区: 'info' },
  },
  {
    key: 'sheet_world_map',
    headers: ['详细地点', '次要地区', '主要地区'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 详细地点: 'warning' },
  },
  {
    key: 'sheet_map_elements',
    headers: ['元素名称', '所在地点'],
    sheetSeverity: 'warning',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 元素名称: 'warning', 所在地点: 'warning' },
  },
  {
    key: 'sheet_protagonist',
    headers: ['姓名', '所在地点', '基础属性', '特有属性'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 姓名: 'error', 基础属性: 'error', 特有属性: 'warning' },
  },
  {
    key: 'sheet_important_npc',
    headers: ['姓名', '基础属性', '特有属性', '所在地点', '在场状态', '人际关系'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'warning',
    headerSeverities: { 姓名: 'error', 基础属性: 'error', 特有属性: 'error', 人际关系: 'warning' },
  },
  {
    key: 'sheet_inventory',
    headers: ['物品名称', '类型', '数量', '品质', '描述'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'error',
  },
  {
    key: 'sheet_equipment',
    headers: ['装备名称', '类型', '品质', '状态', '描述'],
    sheetSeverity: 'error',
    defaultHeaderSeverity: 'error',
  },
];

const buildRequirementNote = (sheetName: string, headers: string[]): string =>
  `【表格模板校验关注列】${sheetName}: ${headers.map((header, index) => `列${index + 1}=${header}`).join('；')}`;

const filterDdlByHeaders = (ddl: unknown, headers: string[]): string | undefined => {
  const tableName = parseDdlTableName(ddl);
  const definitions = headers
    .map(header => getDdlColumnForHeader(ddl, header)?.definition || '')
    .filter(Boolean);
  if (!tableName || definitions.length === 0) return undefined;
  return `CREATE TABLE ${tableName} (\n${definitions
    .map((definition, index) => `  ${formatDdlColumnDefinition(definition, index < definitions.length - 1)}`)
    .join('\n')}\n);`;
};

const pickRequirementSheet = (
  sourceSheet: Record<string, unknown>,
  spec: BuiltinRequirementSheetSpec,
): Record<string, unknown> => {
  const sourceHeaders = getSheetHeaders(sourceSheet);
  const headers = sourceHeaders.filter(header => spec.headers.some(required => headersEquivalent(required, header)));

  const sourceData = isRecord(sourceSheet.sourceData) ? (sourceSheet.sourceData as Record<string, unknown>) : {};
  const pickedSourceData: Record<string, unknown> = {
    note: buildRequirementNote(toSafeString(sourceSheet.name || spec.key), headers),
  };
  const ddl = filterDdlByHeaders(sourceData.ddl, headers);
  if (ddl) pickedSourceData.ddl = ddl;

  return {
    name: sourceSheet.name || spec.key,
    [TEMPLATE_ORDER_FIELD]: sourceSheet[TEMPLATE_ORDER_FIELD],
    content: [headers],
    sourceData: pickedSourceData,
  };
};

const buildBuiltinDiceRequirementTemplate = (template: TemplateRecord): TemplateRecord => {
  const requirementTemplate: TemplateRecord = {};
  BUILTIN_DICE_REQUIREMENT_SPECS.forEach(spec => {
    const sourceSheet = isRecord(template[spec.key]) ? (template[spec.key] as Record<string, unknown>) : null;
    if (!sourceSheet) return;
    requirementTemplate[spec.key] = pickRequirementSheet(sourceSheet, spec);
  });

  return requirementTemplate;
};

const buildBuiltinDiceRequirementLevels = (): TableTemplateRequirementLevelConfig => ({
  defaults: {
    sheet: 'warning',
    header: 'warning',
    ddl: 'warning',
    sourceData: {
      note: 'info',
    },
    config: 'info',
    mate: 'info',
  },
  sheets: Object.fromEntries(
    BUILTIN_DICE_REQUIREMENT_SPECS.map(spec => [
      spec.key,
      {
        sheet: spec.sheetSeverity,
        header: spec.defaultHeaderSeverity,
        headers: spec.headerSeverities || {},
      },
    ]),
  ),
});

export const createBuiltinTableTemplateRequirementPreset = (templateRaw: string): TableTemplateRequirementPreset => {
  const parsed = JSON.parse(templateRaw);
  const template = isRecord(parsed) ? (parsed as TemplateRecord) : {};
  const requirementTemplate = buildBuiltinDiceRequirementTemplate(template);
  return {
    id: DEFAULT_TABLE_TEMPLATE_REQUIREMENT_PRESET_ID,
    name: '默认表格检验',
    description: '检查当前聊天模板是否满足骰子系统常用表格的基础要求，并按严重、警告、提示分级显示问题。',
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    builtin: true,
    order: 0,
    requirementLevels: buildBuiltinDiceRequirementLevels(),
    template: requirementTemplate,
  };
};

export const normalizeTableTemplateRequirementPreset = (
  raw: unknown,
  fallbackId = `custom_table_template_requirement_${Date.now()}`,
): TableTemplateRequirementPreset | null => {
  if (!isRecord(raw)) return null;
  const source = isRecord(raw.preset) ? (raw.preset as Record<string, unknown>) : raw;
  const template = isRecord(source.template) ? (source.template as TemplateRecord) : null;
  if (!template) return null;
  const name = toSafeString(source.name) || '未命名模板检验预设';
  return {
    id: toSafeString(source.id) || fallbackId,
    name,
    description: toSafeString(source.description),
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    builtin: source.builtin === true,
    order: Number.isFinite(Number(source.order)) ? Number(source.order) : 999,
    requirementLevels: isRecord(source.requirementLevels)
      ? cloneTemplateValue(source.requirementLevels as TableTemplateRequirementLevelConfig)
      : undefined,
    template: cloneTemplateValue(template),
  };
};

export const exportTableTemplateRequirementPreset = (preset: TableTemplateRequirementPreset): string => {
  const exported = {
    format: TABLE_TEMPLATE_REQUIREMENT_PRESET_FORMAT,
    version: TABLE_TEMPLATE_REQUIREMENT_PRESET_VERSION,
    preset: {
      id: preset.id,
      name: preset.name,
      description: preset.description || '',
      requirementLevels: preset.requirementLevels,
      template: preset.template,
    },
  };
  return JSON.stringify(exported, null, 2);
};

export const inspectTableTemplateWithPreset = (
  template: unknown,
  preset: TableTemplateRequirementPreset,
): TemplateInspectionResult => {
  const targetSheets = getTemplateInspectionSheets(template);
  const issues: TemplateInspectionIssue[] = [...getTemplateStructureIssues(template, targetSheets)];

  getTemplateSheetEntries(preset.template).forEach(({ key: requirementKey, sheet: requirementSheet }) => {
    const requirementInspectionSheet = makeInspectionSheet(requirementKey, requirementSheet);
    const matchedEntry = findMatchingSheetEntry(template, requirementKey, requirementSheet);

    if (!matchedEntry) {
      const severity = getConfiguredSheetSeverity(preset, requirementKey, requirementSheet);
      issues.push(
        buildIssue({
          severity,
          groupName: requirementInspectionSheet.name,
          title: `缺少${formatSheetName(requirementInspectionSheet.name)}表`,
          missing: [`需要追加${formatSheetName(requirementInspectionSheet.name)}表`],
          impact: '依赖这张表的仪表盘、检定、地图或骰子商店可能无法读取和保存数据。',
          suggestion: '可以把预设中的表结构追加到当前聊天模板末尾，不会改动已有表。',
          fixable: true,
          fixActions: [`追加${formatSheetName(requirementInspectionSheet.name)}表`],
        }),
      );
      return;
    }

    const matchedSheet = makeInspectionSheet(matchedEntry.key, matchedEntry.sheet);
    const contentProblems = getSheetContentProblems(matchedSheet.raw);
    if (contentProblems.length > 0) {
      issues.push(
        buildIssue({
          severity: 'error',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}的表格内容结构无效`,
          missing: contentProblems.map(problem => `${formatSheetName(matchedSheet.name)}表的 ${problem}`),
          impact: '表头或数据区不是数组时，自动修复无法判断旧内容应如何映射到新列，直接重建可能丢失用户数据。',
          suggestion: '请先手动把 content 修成二维数组，再使用智能修复补齐缺失列。',
          fixable: false,
          fixActions: [],
        }),
      );
    }
    const missingHeaders = getMissingHeaders(matchedSheet.headers, requirementInspectionSheet.headers);
    if (missingHeaders.length > 0) {
      const missingFirstColumn = missingHeaders.some(header => isRowIdHeader(header));
      const severity = maxSeverity(
        missingHeaders.map(header =>
          isRowIdHeader(header) ? 'warning' : getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
        ),
      );
      issues.push(
        buildIssue({
          severity,
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}缺少必要列`,
          missing: missingHeaders.map(header => `${formatSheetName(matchedSheet.name)}表缺少“${header}”列`),
          impact: '缺少这些列时，系统可能找不到要读取或保存的数据，仪表盘、检定和自动填表都会不稳定。',
          suggestion: missingFirstColumn
            ? '“行号”必须放在第一列，请手动补好行号首列后再使用智能修复。'
            : '可以把缺少的列追加到表头末尾，并为现有数据行补空值。',
          fixable: !missingFirstColumn,
          fixActions: missingFirstColumn
            ? []
            : missingHeaders.map(header => `在${formatSheetName(matchedSheet.name)}表末尾追加“${header}”列`),
        }),
      );
    }

    const duplicateHeaders = getDuplicateHeaders(matchedSheet.headers);
    if (duplicateHeaders.length > 0) {
      const severity = maxSeverity(
        duplicateHeaders.map(header =>
          requirementInspectionSheet.headers.some(required => headersEquivalent(required, header))
            ? getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header)
            : 'warning',
        ),
      );
      issues.push(
        buildIssue({
          severity,
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在重复列名`,
          missing: duplicateHeaders.map(header => `${formatSheetName(matchedSheet.name)}表重复出现“${header}”列`),
          impact: '重复列名会让系统按表头定位字段时命中不确定的列，可能导致读取、保存或自动修复写错位置。',
          suggestion: '请保留唯一的业务列名；如果需要额外说明，建议放进表格说明而不是新增同名列。',
          fixable: false,
          fixActions: [],
        }),
      );
    }

    const blankHeaderIndexes = matchedSheet.headers
      .map((header, index) => (normalizeHeaderText(header) ? -1 : index + 1))
      .filter(index => index > 0);
    if (blankHeaderIndexes.length > 0) {
      issues.push(
        buildIssue({
          severity: 'warning',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在空白列名`,
          missing: blankHeaderIndexes.map(index => `${formatSheetName(matchedSheet.name)}表第 ${index} 列为空白列名`),
          impact: '空白列名无法稳定映射到 DDL、表格说明或自动改表字段。',
          suggestion: '请删除空白列，或为它填写明确且唯一的业务列名。',
          fixable: false,
          fixActions: [],
        }),
      );
    }

    const rowShape = getSheetRowShape(matchedSheet.raw);
    const rowShapeMissing = buildRowShapeMissing(rowShape);
    if (rowShapeMissing.length > 0) {
      const onlyShortRows = rowShape.shortRows > 0 && rowShape.longRows === 0 && rowShape.nonArrayRows === 0;
      issues.push(
        buildIssue({
          severity: 'warning',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}存在行列数不一致`,
          missing: rowShapeMissing,
          impact: '数据行长度和表头不一致时，数据库插件或自动改表逻辑可能把后续单元格映射到错误列。',
          suggestion: onlyShortRows
            ? '可以为较短的数据行补齐空单元格；较长行需要手动确认多出来的内容应归属哪一列。'
            : '请手动确认较长行或非数组行，避免删除或移动真实数据。',
          fixable: onlyShortRows,
          fixActions: onlyShortRows ? [`为${formatSheetName(matchedSheet.name)}表的短数据行补齐空单元格`] : [],
        }),
      );
    }

    const targetSource = matchedSheet.sourceData;
    const requirementSource = requirementInspectionSheet.sourceData;
    const requirementDdl = requirementSource.ddl;
    const targetDdl = targetSource.ddl;
    const rawSourceData = matchedSheet.raw.sourceData;
    const hasInvalidSourceData = hasOwn(matchedSheet.raw, 'sourceData') && !isRecord(rawSourceData);
    if (hasInvalidSourceData) {
      issues.push(
        buildIssue({
          severity: 'error',
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}的模板资源结构无效`,
          missing: [`${formatSheetName(matchedSheet.name)}表的 sourceData 必须是对象`],
          impact: 'sourceData 不是对象时，建表说明和表格规则无法可靠读取；直接自动修复会丢弃原始内容。',
          suggestion: '请先手动把 sourceData 修成对象，或确认旧内容可以废弃后再重新导入标准表格模板。',
          fixable: false,
          fixActions: [],
        }),
      );
    }
    if (!hasInvalidSourceData && requirementDdl) {
      const configuredDdlSeverity = getConfiguredDdlSeverity(preset, requirementKey, requirementSheet);
      if (!targetDdl) {
        issues.push(
          buildIssue({
            severity: configuredDdlSeverity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}缺少建表说明`,
            missing: [`${formatSheetName(matchedSheet.name)}表缺少建表说明`],
            impact: '缺少建表说明时，系统无法稳定识别每一列的内部名称、别名和取值限制，保存或渲染时可能出错。',
            suggestion: '可以补入模板检验预设里的建表说明；已有表头和已有数据不会被改动。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入建表说明`],
          }),
        );
      } else {
        const missingDdlHeaders = requirementInspectionSheet.headers.filter(
          header =>
            !isRowIdHeader(header) &&
            hasDdlColumnForHeader(requirementDdl, header) &&
            !hasDdlColumnForHeader(targetDdl, header) &&
            !hasDdlSqlNameForRequirementHeader(targetDdl, requirementDdl, header),
        );
        if (missingDdlHeaders.length > 0) {
          const canAppendDdl = /\n\s*\)\s*;\s*$/.test(String(targetDdl || '')) && parseDdlColumns(targetDdl).length > 0;
          const severity = maxSeverity([
            configuredDdlSeverity,
            ...missingDdlHeaders.map(header =>
              getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
            ),
          ]);
          issues.push(
            buildIssue({
              severity: canAppendDdl ? severity : 'error',
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明缺少新增列`,
              missing: missingDdlHeaders.map(header => `${formatSheetName(matchedSheet.name)}的建表说明缺少“${header}”列`),
              impact: '表头里有这列，但建表说明里没有对应定义时，保存、读取和渲染可能对不上。',
              suggestion: canAppendDdl
                ? '可以把缺少的列定义追加到建表说明末尾。'
                : '当前建表说明格式不完整，系统无法判断安全追加位置，需要手动修好后再补列。',
              fixable: canAppendDdl,
              fixActions: canAppendDdl
                ? missingDdlHeaders.map(header => `在${formatSheetName(matchedSheet.name)}的建表说明中追加“${header}”定义`)
                : [],
            }),
          );
        }
        const ddlStructureProblems = getDdlStructureProblems(targetDdl, requirementDdl);
        if (ddlStructureProblems.length > 0) {
          issues.push(
            buildIssue({
              severity: maxSeverity([
                configuredDdlSeverity,
                getConfiguredSheetSeverity(preset, requirementKey, requirementSheet),
              ]),
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明格式异常`,
              missing: ddlStructureProblems.map(problem => `${formatSheetName(matchedSheet.name)}${problem}`),
              impact: '建表说明结构异常时，系统可能解析到错误表、错误列，或在数据库插件执行时失败。',
              suggestion: '请手动修正建表说明，确保只有一个完整的 CREATE TABLE，表名和默认模板一致，且闭合括号前没有尾随逗号。',
              fixable: false,
              fixActions: [],
            }),
          );
        }

        const ddlCompatibilityProblems = getDdlColumnCompatibilityProblems(
          targetDdl,
          requirementDdl,
          requirementInspectionSheet.headers,
        );
        if (ddlCompatibilityProblems.length > 0) {
          const severity = maxSeverity([
            configuredDdlSeverity,
            ...requirementInspectionSheet.headers.map(header =>
              getConfiguredHeaderSeverity(preset, requirementKey, requirementSheet, header),
            ),
          ]);
          issues.push(
            buildIssue({
              severity,
              groupName: matchedSheet.name,
              title: `${formatSheetName(matchedSheet.name)}的建表说明与默认列定义不一致`,
              missing: ddlCompatibilityProblems.map(problem => `${formatSheetName(matchedSheet.name)}${problem}`),
              impact: '表头看起来正确但内部 SQL 列名、类型或约束漂移时，保存、渲染和示例 SQL 可能写向错误字段。',
              suggestion: '请按当前默认模板核对这些列的 SQL 名称、类型、NOT NULL、CHECK 和 UNIQUE 等约束；这类语义漂移需要人工确认。',
              fixable: false,
              fixActions: [],
            }),
          );
        }
      }
    }

    if (!hasInvalidSourceData) SOURCE_TEXT_FIELDS.forEach(field => {
      const requirementText = requirementSource[field];
      if (!requirementText) return;
      const fieldLabel = getSourceTextFieldLabel(field);
      const severity = getConfiguredSourceFieldSeverity(preset, requirementKey, requirementSheet, field);
      const targetText = targetSource[field];
      if (hasOwn(targetSource, field) && targetText !== null && targetText !== '' && typeof targetText !== 'string') {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}不是文本`,
            missing: [`${formatSheetName(matchedSheet.name)}表的${fieldLabel}必须是文本内容`],
            impact: '非文本说明会被浏览器或数据库插件隐式转成字符串，可能导致列说明、规则标记或 SQL 示例误判。',
            suggestion: '可以从模板检验预设补入标准文本；如需保留旧内容，请先手动改成普通文本。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入${fieldLabel}`],
          }),
        );
        return;
      }
      if (!targetText) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}缺少${fieldLabel}`,
            missing: [`${formatSheetName(matchedSheet.name)}表缺少${fieldLabel}`],
            impact: field === 'note' ? '自动填表时缺少这张表的列说明和填写约束。' : '自动改表时缺少对应规则，可能填错列或漏填内容。',
            suggestion: '可以从模板检验预设补入这段说明。',
            fixable: true,
            fixActions: [`为${formatSheetName(matchedSheet.name)}表补入${fieldLabel}`],
          }),
        );
        return;
      }
      const sourceMissingHeaders = getSourceFieldMissingHeaders(
        targetSource,
        requirementSource,
        field,
        requirementInspectionSheet.headers.filter(header => !isRowIdHeader(header)),
      );
      if (sourceMissingHeaders.length > 0) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}缺少新增列说明`,
            missing: sourceMissingHeaders.map(header => `${formatSheetName(matchedSheet.name)}的${fieldLabel}缺少“${header}”说明`),
            impact: field === 'note' ? '自动填表可能不知道新增列的含义、位置或取值限制。' : '自动改表时可能仍按旧列清单处理，导致新增列漏写。',
            suggestion: field === 'deleteNode' ? '只有删除规则会用到新增列时才需要补充；一般可以先手动确认。' : '可以在原说明末尾追加新增列说明和新版写入示例。',
            fixable: field !== 'deleteNode',
            fixActions:
              field === 'deleteNode'
                ? []
                : sourceMissingHeaders.map(header => `在${formatSheetName(matchedSheet.name)}的${fieldLabel}里追加“${header}”说明`),
          }),
        );
      }
      const sourceTagProblems = getSourceTextTagProblems(targetText, requirementText);
      if (sourceTagProblems.length > 0) {
        issues.push(
          buildIssue({
            severity,
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}规则标记不完整`,
            missing: sourceTagProblems.map(problem => `${formatSheetName(matchedSheet.name)}的${fieldLabel}${problem}`),
            impact: '规则标记缺失、重复或未闭合时，属性规则和检定规则同步可能只更新一部分文本，导致 AI 使用过期规则。',
            suggestion: '请手动整理规则块，确保每类规则只有一对完整的开始和结束标记。',
            fixable: false,
            fixActions: [],
          }),
        );
      }
      const sourceNoiseProblems = getSourceTextNoiseProblems(targetText);
      if (sourceNoiseProblems.length > 0) {
        issues.push(
          buildIssue({
            severity: 'warning',
            groupName: matchedSheet.name,
            title: `${formatSheetName(matchedSheet.name)}的${fieldLabel}包含异常噪音`,
            missing: sourceNoiseProblems.map(problem => `${formatSheetName(matchedSheet.name)}的${fieldLabel}${problem}`),
            impact: '过长文本或疑似脚本片段会增加提示词注入、渲染转义和人工维护风险。',
            suggestion: '请压缩说明文本，并移除脚本标签、事件属性或 javascript: 链接等内容。',
            fixable: false,
            fixActions: [],
          }),
        );
      }
    });

    CONFIG_FIELDS.forEach(field => {
      const missingPaths = collectMissingObjectPaths(matchedSheet.raw[field], requirementSheet[field], field);
      if (missingPaths.length === 0) return;
      const fieldLabel = getConfigFieldLabel(field);
      issues.push(
        buildIssue({
          severity: getConfiguredConfigSeverity(preset, requirementKey, requirementSheet),
          groupName: matchedSheet.name,
          title: `${formatSheetName(matchedSheet.name)}缺少${fieldLabel}`,
          missing: [`${formatSheetName(matchedSheet.name)}表的${fieldLabel}不完整`],
          impact: '缺少这类设置时，数据库插件可能无法按默认方式更新、导出或注入模板内容。',
          suggestion: '可以只补齐缺失设置，不覆盖已有设置。',
          fixable: true,
          fixActions: [`补齐${formatSheetName(matchedSheet.name)}表的${fieldLabel}`],
        }),
      );
    });
  });

  const missingMatePaths = collectMissingObjectPaths(
    isRecord(template) ? template.mate : undefined,
    isRecord(preset.template) ? preset.template.mate : undefined,
    'mate',
  );
  if (missingMatePaths.length > 0) {
    issues.push(
      buildIssue({
        severity: getConfiguredMateSeverity(preset),
        groupName: '模板全局配置',
        title: '缺少模板全局设置',
        missing: ['模板全局设置不完整'],
        impact: '模板作用范围、插入位置或默认行为可能不完整。',
        suggestion: '可以只补齐缺失的全局设置，不覆盖已有设置。',
        fixable: true,
        fixActions: ['补齐模板全局设置'],
      }),
    );
  }

  return {
    presetId: preset.id,
    presetName: preset.name,
    sheets: targetSheets,
    issues,
    fixableCount: issues.filter(issue => issue.fixable).length,
    manualCount: issues.filter(issue => !issue.fixable).length,
    checkedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
  };
};

const uniqueSheetKey = (template: TemplateRecord, baseKey: string): string => {
  if (!Object.prototype.hasOwnProperty.call(template, baseKey)) return baseKey;
  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${baseKey}_${index}`;
    if (!Object.prototype.hasOwnProperty.call(template, candidate)) return candidate;
  }
  return `${baseKey}_${Date.now()}`;
};

const getNextOrderNo = (template: TemplateRecord): number => {
  const orders = getTemplateSheetEntries(template)
    .map(entry => Number(entry.sheet[TEMPLATE_ORDER_FIELD]))
    .filter(value => Number.isFinite(value));
  return orders.length > 0 ? Math.max(...orders) + 1 : getTemplateSheetEntries(template).length + 1;
};

const appendMissingHeadersToSheet = (sheet: Record<string, unknown>, missingHeaders: string[]): void => {
  const content = ensureSheetContent(sheet);
  const headerRow = content[0];
  missingHeaders.forEach(header => headerRow.push(header));
  for (let rowIndex = 1; rowIndex < content.length; rowIndex += 1) {
    const row = content[rowIndex];
    if (!Array.isArray(row)) continue;
    missingHeaders.forEach(() => row.push(''));
  }
};

const appendDdlColumns = (ddl: string, definitions: string[]): string | null => {
  const cleaned = definitions.map(definition => formatDdlColumnDefinition(definition, false)).filter(Boolean);
  if (cleaned.length === 0) return ddl;
  const match = ddl.match(/\n\s*\)\s*;\s*(?:\/\*[\s\S]*?\*\/\s*)*$/);
  if (!match || match.index === undefined) return null;
  const before = ddl.slice(0, match.index).replace(/\s+$/, '');
  const after = ddl.slice(match.index);
  const beforeWithSeparator = appendCommaToLastDdlColumnLine(before);
  const addition = cleaned
    .map((definition, index) => `  ${formatDdlColumnDefinition(definition, index < cleaned.length - 1)}`)
    .join('\n');
  return `${beforeWithSeparator}\n${addition}${after}`;
};

const mergeMissingObjectKeys = (target: unknown, requirement: unknown): unknown => {
  if (!isRecord(requirement)) return target;
  const out = isRecord(target) ? (target as Record<string, unknown>) : {};
  Object.keys(requirement).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(out, key)) {
      out[key] = cloneTemplateValue(requirement[key]);
      return;
    }
    if (isRecord(out[key]) && isRecord(requirement[key])) {
      out[key] = mergeMissingObjectKeys(out[key], requirement[key]);
    }
  });
  return out;
};

const buildHeaderSqlNameMap = (
  headers: string[],
  targetDdl: unknown,
  requirementDdl: unknown,
): Record<string, string> => {
  const map: Record<string, string> = {};
  headers.forEach(header => {
    const targetColumn = getDdlColumnForHeader(targetDdl, header);
    const requirementColumn = getDdlColumnForHeader(requirementDdl, header);
    map[header] = targetColumn?.sqlName || requirementColumn?.sqlName || (isRowIdHeader(header) ? 'row_id' : header);
  });
  return map;
};

const getExampleValueForHeader = (header: string): string => {
  if (isRowIdHeader(header)) return '(SELECT COALESCE(MAX(row_id), 0) + 1 FROM {table})';
  if (normalizeHeaderText(header).includes('数量')) return '1';
  if (normalizeHeaderText(header).includes('年龄')) return '18';
  return `'${header}'`;
};

const buildInsertSqlExample = (tableName: string, headers: string[], sqlNameMap: Record<string, string>): string => {
  const columns = headers.map(header => sqlNameMap[header] || header);
  const values = headers.map(header => getExampleValueForHeader(header).replace('{table}', tableName));
  return `SQL示例（追加列后）: INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
};

const buildUpdateSqlExample = (tableName: string, headers: string[], sqlNameMap: Record<string, string>): string => {
  const businessHeaders = headers.filter(header => !isRowIdHeader(header));
  const keyHeader = businessHeaders[0] || headers[0] || 'row_id';
  const updateHeaders = businessHeaders.slice(1);
  const setClause = updateHeaders.map(header => `${sqlNameMap[header] || header} = '${header}'`).join(', ');
  return `SQL示例（追加列后）: UPDATE ${tableName} SET ${setClause || `${sqlNameMap[keyHeader] || keyHeader} = '${keyHeader}'`} WHERE ${sqlNameMap[keyHeader] || keyHeader} = '${keyHeader}';`;
};

const buildNoteColumnAppendix = (
  missingHeaders: string[],
  finalHeaders: string[],
  requirementDdl: unknown,
): string => {
  const lines = missingHeaders.map(header => {
    const column = getDdlColumnForHeader(requirementDdl, header);
    const index = finalHeaders.findIndex(item => headersEquivalent(item, header));
    const definition = column?.definition
      ? column.definition
          .replace(/^\s*[A-Za-z_][A-Za-z0-9_]*\b/, '')
          .replace(/--.*$/, '')
          .trim()
      : '';
    const physical = column?.sqlName ? ` ${column.sqlName}` : '';
    const constraint = definition ? `（${definition}）` : '';
    return `列${index + 1}=${header}${physical}${constraint}`;
  });
  return lines.length > 0 ? `【新增列定义】\n${lines.join('\n')}` : '';
};

const buildSourceFieldAppendix = (
  field: string,
  missingHeaders: string[],
  finalHeaders: string[],
  tableName: string,
  targetDdl: unknown,
  requirementDdl: unknown,
): string => {
  if (field === 'note') return buildNoteColumnAppendix(missingHeaders, finalHeaders, requirementDdl);
  if (field === 'deleteNode') return '';
  const sqlNameMap = buildHeaderSqlNameMap(finalHeaders, targetDdl, requirementDdl);
  const columnSummary = `完整列清单（追加列后）: ${finalHeaders.map((header, index) => `列${index + 1}=${header}`).join('；')}`;
  const sqlExample =
    field === 'updateNode'
      ? buildUpdateSqlExample(tableName, finalHeaders, sqlNameMap)
      : buildInsertSqlExample(tableName, finalHeaders, sqlNameMap);
  return `${columnSummary}\n${sqlExample}`;
};

const appendTextIfMissing = (current: unknown, addition: string): string => {
  const currentText = String(current || '').trim();
  const additionText = String(addition || '').trim();
  if (!additionText) return currentText;
  if (currentText.includes(additionText)) return currentText;
  return currentText ? `${currentText}\n\n${additionText}` : additionText;
};

const formatResidualManualIssue = (issue: TemplateInspectionIssue): string =>
  `${issue.title}${issue.missing.length > 0 ? `：${issue.missing.join('；')}` : ''}`;

const pushUniqueManualIssue = (manualIssues: string[], issue: string): void => {
  if (!manualIssues.some(existing => existing.includes(issue) || issue.includes(existing))) {
    manualIssues.push(issue);
  }
};

const sanitizeAddedSheet = (sheet: Record<string, unknown>): Record<string, unknown> => {
  const cloned = cloneTemplateValue(sheet);
  const content = Array.isArray(cloned.content) ? cloned.content : [];
  const headerRow = Array.isArray(content[0]) ? cloneTemplateValue(content[0]) : ['row_id'];
  cloned.content = [headerRow];
  return cloned;
};

export const buildTableTemplateAppendRepairPlan = (
  template: unknown,
  preset: TableTemplateRequirementPreset,
): TableTemplateRepairPlan => {
  if (!isRecord(template)) {
    return {
      changed: false,
      repairedTemplate: null,
      actions: [],
      manualIssues: ['当前聊天模板不是有效对象，无法智能修复。'],
    };
  }

  const repairedTemplate = cloneTemplateValue(template) as TemplateRecord;
  const actions: string[] = [];
  const manualIssues: string[] = [];

  getTemplateSheetEntries(preset.template).forEach(({ key: requirementKey, sheet: requirementSheet }) => {
    const matchResult = findMatchingSheetMatch(repairedTemplate, requirementKey, requirementSheet);
    if (matchResult.ambiguous) {
      manualIssues.push(
        `${formatSheetName(toSafeString(requirementSheet.name || requirementKey))}匹配到多个候选表：${matchResult.reasons.join('；')}，请手动确认要修复哪一张表。`,
      );
      return;
    }
    let matchedEntry = matchResult.entry;
    const requirementHeaders = getSheetHeaders(requirementSheet);
    const requirementSource = isRecord(requirementSheet.sourceData) ? (requirementSheet.sourceData as Record<string, unknown>) : {};

    if (!matchedEntry) {
      const key = uniqueSheetKey(repairedTemplate, requirementKey);
      const newSheet = sanitizeAddedSheet(requirementSheet);
      newSheet[TEMPLATE_ORDER_FIELD] = getNextOrderNo(repairedTemplate);
      repairedTemplate[key] = newSheet;
      actions.push(`追加${formatSheetName(toSafeString(requirementSheet.name || key))}表`);
      matchedEntry = { key, sheet: newSheet };
    }

    const targetSheet = matchedEntry.sheet;
    const contentProblems = getSheetContentProblems(targetSheet);
    if (contentProblems.length > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的表格内容结构无效：${contentProblems.join('；')}。请先手动修成二维数组，避免自动修复丢失旧内容。`,
      );
      return;
    }

    const rawSourceData = targetSheet.sourceData;
    if (hasOwn(targetSheet, 'sourceData') && !isRecord(rawSourceData)) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的 sourceData 不是对象，无法在不丢弃旧内容的情况下自动修复。`,
      );
      return;
    }

    const sourceData = getSheetSourceData(targetSheet);
    const requirementDdl = requirementSource.ddl;
    const targetDdl = sourceData.ddl;
    const ddlStructureProblems = requirementDdl && targetDdl ? getDdlStructureProblems(targetDdl, requirementDdl) : [];
    if (ddlStructureProblems.length > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明存在结构异常：${ddlStructureProblems.join('；')}。请先手动修正后再自动修复。`,
      );
      return;
    }

    const targetHeaders = getSheetHeaders(targetSheet);
    const missingHeaders = getMissingHeaders(targetHeaders, requirementHeaders);
    const appendableMissingHeaders = missingHeaders.filter(header => !isRowIdHeader(header));
    if (missingHeaders.some(header => isRowIdHeader(header))) {
      manualIssues.push(`${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}缺少行号首列，需要手动把“行号”放在第一列。`);
    }

    if (appendableMissingHeaders.length > 0) {
      appendMissingHeadersToSheet(targetSheet, appendableMissingHeaders);
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表追加列：${appendableMissingHeaders.join('、')}`);
    }

    const paddedRows = padShortRowsToHeaderLength(targetSheet);
    if (paddedRows > 0) {
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补齐 ${paddedRows} 行短数据行`);
    }
    const rowShape = getSheetRowShape(targetSheet);
    if (rowShape.longRows > 0 || rowShape.nonArrayRows > 0) {
      manualIssues.push(
        `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}存在数据行结构异常：${buildRowShapeMissing(rowShape).join('；')}。`,
      );
    }

    const finalHeaders = getSheetHeaders(targetSheet);
    const tableName =
      parseDdlTableName(targetDdl) ||
      parseDdlTableName(requirementDdl) ||
      toSafeString(targetSheet.name || requirementSheet.name || matchedEntry.key);

    if (requirementDdl && !sourceData.ddl) {
      sourceData.ddl = cloneTemplateValue(requirementDdl);
      actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补入建表说明`);
    } else if (requirementDdl && sourceData.ddl) {
      const ddlMissingHeaders = requirementHeaders.filter(
        header =>
          !isRowIdHeader(header) &&
          Boolean(getDdlColumnForHeader(requirementDdl, header)) &&
          !hasDdlColumnForHeader(sourceData.ddl, header) &&
          !hasDdlSqlNameForRequirementHeader(sourceData.ddl, requirementDdl, header),
      );
      const ddlIncompatibleHeaders = requirementHeaders.filter(
        header =>
          !isRowIdHeader(header) &&
          Boolean(getDdlColumnForHeader(requirementDdl, header)) &&
          !hasDdlColumnForHeader(sourceData.ddl, header) &&
          hasDdlSqlNameForRequirementHeader(sourceData.ddl, requirementDdl, header),
      );
      if (ddlIncompatibleHeaders.length > 0) {
        manualIssues.push(
          `${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明中存在同 SQL 列名但注释或定义不兼容的列：${ddlIncompatibleHeaders.join('、')}。请手动确认，避免自动追加重复 SQL 列。`,
        );
      }
      const ddlDefinitions = ddlMissingHeaders
        .map(header => getDdlColumnForHeader(requirementDdl, header)?.definition || '')
        .filter(Boolean);
      if (ddlDefinitions.length > 0) {
        const nextDdl = appendDdlColumns(String(sourceData.ddl), ddlDefinitions);
        if (nextDdl) {
          sourceData.ddl = nextDdl;
          actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明追加列：${ddlMissingHeaders.join('、')}`);
        } else {
          manualIssues.push(`${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的建表说明格式不完整，无法自动追加列。`);
        }
      }
    }

    SOURCE_TEXT_FIELDS.forEach(field => {
      const requirementText = requirementSource[field];
      if (!requirementText) return;
      const fieldLabel = getSourceTextFieldLabel(field);
      if (hasOwn(sourceData, field) && sourceData[field] !== null && sourceData[field] !== '' && typeof sourceData[field] !== 'string') {
        sourceData[field] = cloneTemplateValue(requirementText);
        actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表修正${fieldLabel}为文本`);
        return;
      }
      if (!sourceData[field]) {
        sourceData[field] = cloneTemplateValue(requirementText);
        actions.push(`为${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表补入${fieldLabel}`);
        return;
      }
      const sourceMissingHeaders = getSourceFieldMissingHeaders(
        sourceData,
        requirementSource,
        field,
        requirementHeaders.filter(header => !isRowIdHeader(header)),
      );
      if (sourceMissingHeaders.length === 0) return;
      const appendix = buildSourceFieldAppendix(
        field,
        sourceMissingHeaders,
        finalHeaders,
        tableName,
        sourceData.ddl,
        requirementDdl,
      );
      if (!appendix) return;
      sourceData[field] = appendTextIfMissing(sourceData[field], appendix);
      actions.push(`在${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}的${fieldLabel}里追加列说明：${sourceMissingHeaders.join('、')}`);
    });

    CONFIG_FIELDS.forEach(field => {
      const missingPaths = collectMissingObjectPaths(targetSheet[field], requirementSheet[field], field);
      if (missingPaths.length === 0) return;
      targetSheet[field] = mergeMissingObjectKeys(targetSheet[field], requirementSheet[field]);
      actions.push(`补齐${formatSheetName(toSafeString(targetSheet.name || matchedEntry.key))}表的${getConfigFieldLabel(field)}`);
    });
  });

  const missingMatePaths = collectMissingObjectPaths(repairedTemplate.mate, preset.template.mate, 'mate');
  if (missingMatePaths.length > 0) {
    repairedTemplate.mate = mergeMissingObjectKeys(repairedTemplate.mate, preset.template.mate);
    actions.push('补齐模板全局设置');
  }

  inspectTableTemplateWithPreset(repairedTemplate, preset).issues.forEach(issue => {
    pushUniqueManualIssue(manualIssues, `修复后仍需手动处理：${formatResidualManualIssue(issue)}`);
  });

  return {
    changed: actions.length > 0,
    repairedTemplate,
    actions,
    manualIssues,
  };
};
