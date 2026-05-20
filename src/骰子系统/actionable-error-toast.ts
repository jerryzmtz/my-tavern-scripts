export type ActionableErrorToastSuggestion =
  | 'input'
  | 'clipboard'
  | 'importExport'
  | 'compatibility'
  | 'conflict'
  | 'api'
  | 'table'
  | 'tableTemplate'
  | 'save'
  | 'image'
  | 'resource'
  | 'developer'
  | 'generic';

export interface ActionableErrorToastOptions {
  title?: string;
  toastrOptions?: ToastrOptions;
  suggestion?: ActionableErrorToastSuggestion | string;
  developerHint?: boolean;
}

const SUGGESTIONS: Record<ActionableErrorToastSuggestion, string> = {
  input:
    '请按示例检查必填项、名称、表达式或正则语法；如果是从外部复制的内容，请先去掉多余空格、引号或 Markdown 包裹后再保存。若仍失败，请复制这条错误和输入内容片段给开发者。',
  clipboard:
    '请确认浏览器允许当前页面访问剪贴板，并尝试手动选择文本复制；若是非安全来源或移动端浏览器，请改用弹窗里的手动复制内容。若仍失败，请把浏览器控制台中的剪贴板报错发给开发者。',
  importExport:
    '请确认文件是本功能导出的 JSON/JSONC，内容不为空，顶层结构和必需字段完整；可先重新导出一份对照格式，再重新选择文件导入。若仍失败，请把文件类型、文件名和控制台解析错误发给开发者。',
  compatibility:
    '请确认酒馆助手、骰子系统脚本和导入文件来自兼容版本；优先更新脚本后刷新页面，再重新导入或执行。若仍提示版本不兼容，请把当前脚本版本、文件版本和完整错误发给开发者。',
  conflict:
    '请只保留一个会接管同一界面或同一数据的脚本启用；先禁用提示中冲突的脚本，刷新页面后再试。若无法判断冲突来源，请打开脚本管理器和浏览器控制台，把启用脚本列表与错误一起发给开发者。',
  api:
    '请确认酒馆助手后端/数据库脚本已加载并且当前聊天已完成初始化，然后刷新页面重试。若仍提示 API 或接口不可用，请打开 Debug 控制台或浏览器控制台，把缺失的 API 名称和完整错误发给开发者。',
  table:
    '请刷新数据，并确认当前聊天中确实存在对应表格、角色、属性列、目标行或目标单元格；如果刚改过模板，请先重新打开聊天或重新生成相关数据。若仍找不到，请把表名、角色名、属性名和错误一起发给开发者。',
  tableTemplate:
    '请在高级设置中使用“检验表格模板”检查当前表格模板，按检查结果补齐缺失表、列或约束，并确认当前聊天已加载正确模板。若检查本身失败，请把模板检验结果和控制台日志发给开发者。',
  save:
    '请重试保存，并确认数据库/后端脚本已加载、目标数据仍存在且内容没有过大；如果是删除、更新或写入失败，请刷新后确认目标项没有被其他操作改动。若仍失败，请把保存对象、操作步骤和控制台错误发给开发者。',
  image:
    '请确认图片文件类型受支持、体积不要过大，或 URL 能在浏览器新标签页直接打开；本地图片失败时可换一张图片，URL 失败时可改用本地上传。若仍失败，请把图片来源、URL 或文件类型和控制台错误发给开发者。',
  resource:
    '请检查当前角色的资源或属性数值是否足够，并确认资源名称和目标属性列没有拼写差异；必要时先补充资源或修正表格中的数值。若仍失败，请把资源名、当前值和错误一起发给开发者。',
  developer:
    '请打开 Debug 控制台或浏览器控制台查看日志，复制完整错误、触发步骤和当前聊天/预设信息后联系开发者。',
  generic:
    '请刷新页面或重新打开当前面板后再试；如果仍失败，请打开 Debug 控制台或浏览器控制台，复制完整错误、触发步骤和当前使用的预设/聊天信息后联系开发者。',
};

const LOG_FOLLOWUP =
  '按提示查看相关日志；如果无法定位原因，请复制完整错误、触发步骤和当前聊天/预设信息后联系开发者。';

const hasAnyKeyword = (text: string, keywords: readonly string[]): boolean =>
  keywords.some(keyword => text.includes(keyword));

const isSuggestionKey = (value: string): value is ActionableErrorToastSuggestion =>
  Object.prototype.hasOwnProperty.call(SUGGESTIONS, value);

const inferSuggestion = (message: string): ActionableErrorToastSuggestion => {
  if (hasAnyKeyword(message, ['脚本冲突', '冲突检测', '不能同时启用', '同一界面', '同一数据'])) {
    return 'conflict';
  }
  if (
    hasAnyKeyword(message, [
      '版本不兼容',
      '版本较旧',
      '版本过旧',
      '文件版本',
      '脚本版本',
      '需要酒馆助手版本',
      '需要脚本版本',
    ])
  ) {
    return 'compatibility';
  }
  if (
    hasAnyKeyword(message, [
      'API 不可用',
      'API不可用',
      '接口不可用',
      '数据库 API',
      '数据库API',
      '数据库模板 API',
      'manualUpdate API',
      '后端脚本',
      '可视化编辑器接口',
    ])
  ) {
    return 'api';
  }
  if (hasAnyKeyword(message, ['复制', '剪贴板', 'clipboard', 'Clipboard', '手动复制', '自动复制'])) {
    return 'clipboard';
  }
  if (
    hasAnyKeyword(message, [
      '检验表格模板',
      '表格结构',
      '字段约束',
      '属性列',
      '目标列',
      '目标表',
      '关联表',
      '表格模板',
      '无效的表格模板',
      '当前模板',
      '模板检验',
    ])
  ) {
    return 'tableTemplate';
  }
  if (hasAnyKeyword(message, ['上传', '图片', '图标', '头像', 'URL', 'ObjectURL', 'Blob', '外链'])) {
    return 'image';
  }
  if (
    hasAnyKeyword(message, [
      'JSON',
      'JSONC',
      '格式',
      '文件',
      '读取',
      '导入',
      '导出',
      '备份',
      '恢复',
      '合并',
      '内容为空',
      '顶层结构',
      '预设格式',
      '酒馆正则格式',
    ])
  ) {
    return 'importExport';
  }
  if (
    hasAnyKeyword(message, [
      '骰子语法',
      '正则表达式',
      '表达式',
      '规则名称',
      '匹配模式',
      '命令',
      '验证失败',
      '无效',
      '格式不正确',
      '格式错误',
      '请填写',
      '不是有效',
      '预设名称已存在',
      '不能删除最后一个预设',
    ])
  ) {
    return 'input';
  }
  if (hasAnyKeyword(message, ['资源不足', '幸运值'])) return 'resource';
  if (
    hasAnyKeyword(message, [
      '保存',
      '更新',
      '写入',
      '填表',
      '删除',
      '收藏',
      '数据库',
      '有效数据',
      '反向写入',
      '修复失败',
      '删除保存失败',
    ])
  ) {
    return 'save';
  }
  if (
    hasAnyKeyword(message, [
      '找不到',
      '无法找到',
      '未找到',
      '无法获取表格数据',
      '表格数据',
      '目标表格',
      '目标单元格',
      '行数据为空',
      '角色',
      '属性',
      '表名',
      '列名',
      '目标行',
    ])
  ) {
    return 'table';
  }
  if (
    hasAnyKeyword(message, [
      '控制台',
      '日志',
      'Debug',
      '加载失败',
      '操作失败',
      '面板打开失败',
      '切换模式失败',
      '初始化失败',
      '打开失败',
      '获取变量数据时出错',
    ])
  ) {
    return 'developer';
  }
  return 'generic';
};

const normalizeSuggestionText = (suggestion: string): string => suggestion.replace(/^建议[:：]\s*/, '').trim();

const resolveSuggestion = (message: string, options: ActionableErrorToastOptions): string => {
  if (options.developerHint) return SUGGESTIONS.developer;
  if (typeof options.suggestion === 'string') {
    return isSuggestionKey(options.suggestion) ? SUGGESTIONS[options.suggestion] : options.suggestion;
  }
  return SUGGESTIONS[inferSuggestion(message)];
};

const ensureSentenceEnding = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return '未知错误。';
  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
};

const appendSuggestion = (message: string, suggestion: string): string => {
  const text = String(message || '').trim() || '未知错误';
  if (/建议[:：]/.test(text) || text.includes('联系开发者')) return text;

  const normalizedSuggestion = normalizeSuggestionText(
    /控制台|日志|Debug/.test(text) && suggestion === SUGGESTIONS.developer ? LOG_FOLLOWUP : suggestion,
  );
  if (!normalizedSuggestion) return text;
  if (
    text.includes(normalizedSuggestion) ||
    (text.includes('检验表格模板') && normalizedSuggestion.includes('检验表格模板'))
  ) {
    return text;
  }

  return `${ensureSentenceEnding(text)}\n建议：${normalizedSuggestion}`;
};

const isJQueryToastMessage = (message: unknown): message is JQuery => {
  if (typeof message !== 'object' || message === null) return false;
  const candidate = message as { jquery?: unknown };
  return typeof candidate.jquery === 'string';
};

const getToastr = () => {
  try {
    return window.toastr || window.parent?.toastr;
  } catch {
    return window.toastr;
  }
};

export const showActionableErrorToast = (
  message: string | JQuery | null | undefined,
  options: ActionableErrorToastOptions = {},
): void => {
  const toast = getToastr();
  if (!toast) return;

  if (isJQueryToastMessage(message)) {
    toast.error(message, options.title, options.toastrOptions);
    return;
  }

  const text = String(message || '').trim() || '未知错误';
  const suggestion = resolveSuggestion(text, options);
  toast.error(appendSuggestion(text, suggestion), options.title, options.toastrOptions);
};
