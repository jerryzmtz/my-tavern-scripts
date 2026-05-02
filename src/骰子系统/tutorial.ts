export type TutorialScope =
  | 'core'
  | 'settings'
  | 'settingsAppearance'
  | 'settingsLayout'
  | 'settingsPosition'
  | 'settingsOptions'
  | 'settingsTables'
  | 'settingsValidation'
  | 'settingsRegex'
  | 'settingsAdvanced'
  | 'dice'
  | 'contestDice'
  | 'diceHistory'
  | 'diceSettings'
  | 'advancedPresetManager'
  | 'attributePresetManager'
  | 'map'
  | 'relationshipGraph'
  | 'avatarManager'
  | 'table'
  | 'mvu'
  | 'changes'
  | 'favorites'
  | 'inventory'
  | 'inventoryDetail'
  | 'shardShop'
  | 'gacha'
  | 'gachaSettings'
  | 'gachaItemEditor';

type TutorialPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center';
type TutorialAction = 'prev' | 'next' | 'skip' | 'never';

interface TutorialStep {
  selector?: string | readonly string[];
  title: string;
  content: string;
  placement?: TutorialPlacement;
}

interface TutorialState {
  version: 1;
  revision: number;
  disabled: boolean;
  completedScopes: TutorialScope[];
}

export interface TutorialModule {
  maybeStart(scope: TutorialScope, options?: { target?: HTMLElement; interrupt?: boolean }): void;
  start(scope: TutorialScope, options?: { manual?: boolean; target?: HTMLElement; interrupt?: boolean }): void;
  close(): void;
  isDisabled(): boolean;
}

interface TutorialModuleOptions {
  getTheme: () => string;
  getStore: <T>(key: string, fallback: T) => T;
  setStore: (key: string, value: unknown) => void;
  getDocument: () => Document;
  getWindow: () => Window;
}

interface ActiveTutorial {
  scope: TutorialScope;
  steps: TutorialStep[];
  index: number;
  manual: boolean;
  visibleIndexes: number[];
  targetCache: Map<number, HTMLElement | null>;
  initialTarget?: HTMLElement;
}

interface StartOptions {
  manual?: boolean;
  completeWhenMissing?: boolean;
  target?: HTMLElement;
  interrupt?: boolean;
}

interface TutorialViewport {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface TutorialRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const STORAGE_KEY = 'acu_tutorial_state_v1';
const STYLE_ID = 'acu-tutorial-style';
const OVERLAY_CLASS = 'acu-tutorial-overlay';
const DEFAULT_STATE: TutorialState = {
  version: 1,
  revision: 6,
  disabled: false,
  completedScopes: [],
};
const STATE_REVISION = DEFAULT_STATE.revision;

const STEPS: Record<TutorialScope, TutorialStep[]> = {
  core: [
    {
      selector: '#acu-nav-bar',
      title: '导航栏',
      content: '这里是骰子系统最主要的入口。你可以从这里切换仪表盘、掷骰、审核、变量和各类数据表。',
      placement: 'top',
    },
    {
      selector: ['.acu-dash-player', '.acu-dashboard-content'],
      title: '主角总览',
      content: '这里会汇总主角的资源、状态和属性。标题、条目和骰子图标可以继续点开详情或发起检定。',
      placement: 'right',
    },
    {
      selector: ['.acu-dash-location-group', '.acu-dash-location-title'],
      title: '地点',
      content: '这里显示故事涉及到的地点。点击地点可以查看详情，标题旁的地图图标会显示每个地点可互动的角色与元素。',
      placement: 'left',
    },
    {
      selector: ['.acu-dash-role-group', '.acu-dash-role-list', '.acu-dash-role-title'],
      title: '角色',
      content:
        '这里展示故事中的角色和在场状态。标题旁可以打开人物关系图和头像管理页面，点击角色姓名可以显示详情，点击角色右侧的按钮发起对抗检定。',
      placement: 'left',
    },
    {
      selector: ['.acu-dash-items-group', '.acu-dash-items-list', '.acu-dash-items-title'],
      title: '物品',
      content:
        '这里显示背包里的物品。标题旁旁边的按钮可以进入物品栏或商店界面。物品条目旁边的手形图标点击后可以快速使用该物品。',
      placement: 'left',
    },
    {
      selector: ['.acu-dash-equipment-task-group', '.acu-dash-equipment-list', '.acu-dash-quest-list'],
      title: '装备与任务',
      content: '这里集中显示已装备物品和进行中的任务。',
      placement: 'left',
    },
    {
      selector: ['.acu-dashboard-header-actions', '.acu-dashboard-tutorial-btn'],
      title: '仪表盘操作',
      content:
        '右上角可以播放教程、拖动调整面板高度或关闭仪表盘。其它界面的右上角也会有问号按钮，用来播放对应界面的单独教程。',
      placement: 'left',
    },
    {
      selector: '#acu-btn-dice-nav',
      title: '掷骰面板',
      content: '这里打开普通检定面板，可以选择对应规则、角色以及属性。',
      placement: 'top',
    },
    {
      selector: '#acu-btn-changes',
      title: '审核面板',
      content:
        '审核面板用于查看每楼的表格更新内容以及验证数据合法性，你可以决定回滚或手动修正发生变化的部分。如果你使用SQL表格模板，则几乎无需使用本功能',
      placement: 'top',
    },
    {
      selector: '#acu-btn-mvu',
      title: '变量面板',
      content: '变量面板用于查看以及修改当前楼层中的变量，支持MVU，ERA，LWB变量框架。',
      placement: 'top',
    },
    {
      selector: '#acu-btn-favorites',
      title: '收藏夹',
      content: '收藏夹用于跨聊天保存喜爱的内容，方便之后快速查看或迁移特定内容。',
      placement: 'top',
    },
    {
      selector: '.acu-nav-btn[data-table]',
      title: '普通表格',
      content: '这些按钮会打开具体数据表。普通表格支持搜索、切换视图、编辑字段，包含数字的字段还可以直接发起检定。',
      placement: 'top',
    },
    {
      selector: '#acu-active-actions',
      title: '功能按钮',
      content: '底部功能区包含打开数据库本体、打开编辑界面、收起前端、手动填表以及前端设置等常用操作。',
      placement: 'top',
    },
  ],
  settings: [
    {
      selector: '.acu-settings-dialog',
      title: '设置页面',
      content:
        '这里集中管理前端显示、布局、表格入口、数据验证和高级功能。修改大多数选项后会自动保存，关闭设置页后界面会按新配置重新渲染。',
      placement: 'left',
    },
    {
      selector: '.acu-settings-header',
      title: '顶部操作',
      content:
        '顶部显示当前版本，刷新按钮用于清理缓存并重新加载新版资源。右侧的问号会播放设置总览；每个标签行也有自己单独的教程。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="appearance"] .acu-settings-group-title',
      title: '外观样式',
      content: '这里调整主题、字体、字号、圆角、模糊和面板宽度等视觉效果。想让界面更紧凑或更醒目，优先从这里改。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="layout"] .acu-settings-group-title',
      title: '布局设置',
      content: '这里控制导航按钮布局、表格卡片列数、滚动条等界面排布方式。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="position"] .acu-settings-group-title',
      title: '位置设置',
      content: '这里决定前端面板出现在酒馆页面中的位置，例如嵌入、悬浮或跟随视口。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="options"] .acu-settings-group-title',
      title: '行动选项',
      content: '这里控制行动选项面板是否显示，以及点击选项时是直接发送还是先写入输入框。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="tables"] .acu-settings-group-title',
      title: '表格与按钮',
      content: '这里可以隐藏或显示前端的特定功能或某个表格，也可以调整它们的顺序。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="validation"] .acu-settings-group-title',
      title: '数据验证',
      content:
        '这里管理字段规则、只读规则和智能修复。适合用来约束 AI 填表格式，减少错误数据进入表格。如果你使用SQL表格，则几乎不需要本功能。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="regex"] .acu-settings-group-title',
      title: '正则转换',
      content:
        '这里管理自动文本转换规则。适合统一表格字段格式，但建议先小范围测试再长期启用。如果你遇到问题，优先尝试关闭此处的所有正则。',
      placement: 'bottom',
    },
    {
      selector: '.acu-settings-group[data-group="advanced"] .acu-settings-group-title',
      title: '高级设置',
      content: '这里包含检定设置、调试、缓存清理等高级功能。不了解作用时，建议保持默认配置。',
      placement: 'bottom',
    },
  ],
  settingsAppearance: [
    {
      selector: '.acu-settings-group[data-group="appearance"] .acu-settings-group-title',
      title: '外观样式',
      content:
        '外观样式负责界面的整体观感。这里适合先调主题和字体，再根据阅读习惯微调界面字号、选项字号、导航栏字号和变化高亮。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-theme',
      title: '背景主题',
      content: '主题会同步影响骰子系统的主界面配色。若觉得按钮或文字不够清晰，可以先从这里切换主题。',
      placement: 'left',
    },
    {
      selector: '#settings-row-font-family',
      title: '字体风格',
      content: '字体决定整体气质。换字体只影响骰子系统界面，不会改动酒馆本体或数据库内容。',
      placement: 'left',
    },
    {
      selector: '#settings-row-font-main',
      title: '界面字号',
      content:
        '界面字号主要影响表格卡片正文、面板内容、变量/收藏夹等主体阅读区域。',
      placement: 'left',
    },
    {
      selector: '#settings-row-font-option',
      title: '选项字号',
      content: '行动选项有独立字号。选项文本较长时可以调小一点，想要更容易点按时可以调大。',
      placement: 'left',
    },
    {
      selector: '#settings-row-font-nav',
      title: '导航栏字号',
      content:
        '导航栏字号专门控制底部或顶部导航栏里的按钮文字与右侧图标按钮大小，例如导航盘的按钮大小',
      placement: 'left',
    },
    {
      selector: '#settings-row-highlight-new',
      title: '变化高亮',
      content: '开启后，表格中新出现或被修改的内容会更醒目。适合追踪 AI 最近写入了哪些新信息。',
      placement: 'left',
    },
  ],
  settingsLayout: [
    {
      selector: '.acu-settings-group[data-group="layout"] .acu-settings-group-title',
      title: '布局设置',
      content: '布局设置决定界面怎样排布。这里主要影响导航按钮、表格卡片和滚动方式，适合根据屏幕宽度来调整。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-card-width',
      title: '卡片宽度',
      content: '卡片宽度会影响表格卡片和仪表盘内容的横向空间。文字经常换行时，可以适当调宽。',
      placement: 'left',
    },
    {
      selector: '#settings-row-layout-mode',
      title: '布局模式',
      content: '移动端适合横向滚动，PC端推荐使用竖向滚动。',
      placement: 'left',
    },
    {
      selector: '#settings-row-reverse-all',
      title: '倒序显示',
      content: '开启后，所有表格卡片都会按倒序排列，也就是最新的卡片会放在最前面。适合优先查看最近新增的记录。',
      placement: 'left',
    },
    {
      selector: '#settings-row-horizontal-scrollbar',
      title: '横向滚动条',
      content: '开启时显示横向滚动条。',
      placement: 'left',
    },
  ],
  settingsPosition: [
    {
      selector: '.acu-settings-group[data-group="position"] .acu-settings-group-title',
      title: '位置与交互',
      content: '这里控制骰子系统面板出现在哪里，以及是否允许拖动、记忆位置和折叠后对齐。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-panel-position',
      title: '面板位置',
      content:
        '悬浮底部会把前端面板放在聊天内容底部，向上滚动查看旧消息时它也会跟着离开视野。固定底部会贴在窗口底边，无论怎么滑动聊天都一直可见。跟随消息则会把面板渲染在最新消息附近。',
      placement: 'left',
    },
    {
      selector: '#settings-row-action-position',
      title: '功能按钮位置',
      content: '功能按钮可以放在顶部或底部。手机上如果底部容易误触，可以试着挪到顶部。',
      placement: 'left',
    },
    {
      selector: '#settings-row-collapse-style',
      title: '收起样式',
      content: '收起样式决定面板隐藏后长什么样。长条更醒目，胶囊和圆钮更省空间。',
      placement: 'left',
    },
  ],
  settingsOptions: [
    {
      selector: '.acu-settings-group[data-group="options"] .acu-settings-group-title',
      title: '行动选项',
      content: '行动选项会把选项表内的内容渲染成按钮，附着在最新的AI消息中。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-show-options',
      title: '显示行动面板',
      content: '关闭后界面不再显示行动选项按钮。如果完全不需要选项表的话，建议从表格模板中删除选项表。',
      placement: 'left',
    },
    {
      selector: '#row-auto-send',
      title: '点击后发送',
      content: '开启后点击行动选项会直接发送；关闭时只写入输入框，适合想先手动修改措辞的玩法。',
      placement: 'left',
    },
  ],
  settingsTables: [
    {
      selector: '.acu-settings-group[data-group="tables"] .acu-settings-group-title',
      title: '表格管理',
      content: '表格管理决定哪些表格和特殊入口会显示在主界面。它不修改表格数据，只调整入口是否可见和顺序。',
      placement: 'bottom',
    },
    {
      selector: '.acu-table-manager-hint',
      title: '显示与排序',
      content: '眼睛图标用于显示或隐藏入口，拖拽手柄可以调整顺序。隐藏入口不会删除表格，之后也能再打开。',
      placement: 'bottom',
    },
    {
      selector: '#table-manager-list .acu-table-manager-item:first-child',
      title: '入口条目',
      content: '列表里既有普通数据表，也有投骰、审核、MVU 变量等特殊入口。常用的可以拖到前面。',
      placement: 'bottom',
    },
  ],
  settingsValidation: [
    {
      selector: '.acu-settings-group[data-group="validation"] .acu-settings-group-title',
      title: '数据验证规则',
      content:
        '数据验证用于约束 AI 写入表格的内容，例如只读、范围、格式和枚举。它主要服务于自然语言填表；如果你已经使用 SQL 方式稳定填表，通常不需要此功能。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-validation-preset',
      title: '验证预设',
      content: '预设是一整套验证规则。建议先使用内置预设理解结构，再导出 JSON 作为模板进行自定义。',
      placement: 'left',
    },
    {
      selector: '#settings-row-validation-preset-actions',
      title: '预设操作',
      content:
        '这里可以复制、新建、删除、导出和导入验证预设。遇到规则异常或误改默认预设时，点击旋转箭头可以恢复默认预设规则。',
      placement: 'left',
    },
    {
      selector: '#validation-rules-list',
      title: '规则列表',
      content: '每条规则可以单独启用、编辑或删除。规则越严格，越能保证数据稳定，但也更需要和表格结构匹配。',
      placement: 'bottom',
    },
  ],
  settingsRegex: [
    {
      selector: '.acu-settings-group[data-group="regex"] .acu-settings-group-title',
      title: '正则转换规则',
      content:
        '正则转换会在读取或处理表格时自动替换文本，适合清理多余词、统一格式或修正常见写法。如果你使用 SQL 填表，通常不需要它。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-regex-preset',
      title: '正则预设',
      content: '正则预设也是高级功能。建议先导出内置 JSON，参考字段结构后再创建自己的规则集。',
      placement: 'left',
    },
    {
      selector: '#settings-row-regex-preset-actions',
      title: '预设操作',
      content:
        '这里可以复制、新建、删除、导出、导入和恢复默认正则预设。遇到文本被误改时，先点恢复默认；如果仍有问题，就把规则列表里的正则全部关掉再排查。',
      placement: 'left',
    },
    {
      selector: '#regex-rules-list',
      title: '转换规则',
      content:
        '规则会按启用状态和优先级执行。新规则最好先小范围测试；一旦发现内容被错误替换，可以先关闭对应规则或全部规则。',
      placement: 'bottom',
    },
  ],
  settingsAdvanced: [
    {
      selector: '.acu-settings-group[data-group="advanced"] .acu-settings-group-title',
      title: '高级设置',
      content: '高级设置集中放置检定、缓存、调试等功能。不了解作用时，建议保持默认值。',
      placement: 'bottom',
    },
    {
      selector: '#settings-row-attr-preset',
      title: '自定义属性规则',
      content:
        '自定义属性规则会影响表格填写提示：它规定世界观中有哪些属性名、数值范围和生成概率。建议先导出内置 JSON，再参考结构自定义。',
      placement: 'left',
    },
    {
      selector: '#settings-row-dice-preset',
      title: '检定设置',
      content: '检定设置会进入检定预设和自定义属性预设管理，与检定页面的设置相同',
      placement: 'left',
    },
    {
      selector: '#settings-row-action-preset',
      title: '自定义交互规则',
      content: '自定义交互规则决定物品、角色或表格条目可生成哪些快捷操作。它同样属于高级功能，建议参考内置结构再改。',
      placement: 'left',
    },
    {
      selector: '#settings-row-blacklist',
      title: '变量过滤黑名单',
      content: '这里可以管理不想在变量面板里显示的字段，适合隐藏噪音字段或很少查看的层级。',
      placement: 'left',
    },
    {
      selector: '#settings-row-debug-console',
      title: 'Debug 控制台',
      content: '这里会打开骰子系统的调试控制台，用来查看运行日志和错误信息。普通使用时不需要打开',
      placement: 'left',
    },
    {
      selector: '#settings-row-clear-cache',
      title: '维护功能',
      content: '遇到界面显示异常、旧配置残留或资源没有刷新时，可以尝试清空本地缓存，再重新打开界面。',
      placement: 'left',
    },
    {
      selector: '#settings-row-db-toast-mute',
      title: '屏蔽数据库弹窗',
      content: '开启后会尽量屏蔽数据库本体弹出的提示消息，适合不想被打扰时使用。',
      placement: 'left',
    },
  ],
  dice: [
    {
      selector: '.acu-dice-panel',
      title: '普通检定',
      content: '普通检定会根据当前选定的角色、属性值进行检定，并根据规则来判定结果，发送到聊天输入框中。',
      placement: 'left',
    },
    {
      selector: ['#dice-normal-presets-section', '#dice-normal-presets'],
      title: '检定规则',
      content: '这里可以切换不同检定规则。选择“自定义”时可以输入“4d6”等临时公式进行一次性判定。',
      placement: 'bottom',
    },
    {
      selector: ['#dice-char-buttons-section', '#dice-char-buttons'],
      title: '快捷选择',
      content: '这里会列出可用角色。点击角色名会填入发起者，并刷新下方可用的属性快捷按钮。',
      placement: 'bottom',
    },
    {
      selector: ['#dice-custom-fields-area', '#dice-normal-params-section'],
      title: '发起方参数',
      content:
        '这里填写发起方的名字、属性名、属性值，以及当前规则需要的技能值、目标值或临时加值。留空时会按当前规则使用默认值或自动计算。',
      placement: 'bottom',
    },
    {
      selector: '#dice-attr-buttons',
      title: '快捷属性',
      content:
        '快捷选择角色或输入角色名后，这里会显示该角色可用的属性名和值。点击属性会自动填入属性名和数值；骰子图标会按当前检定规则生成属性，垃圾桶图标会清空当前属性。',
      placement: 'top',
    },
    {
      selector: '#dice-roll-btn',
      title: '开始掷骰',
      content:
        '确认配置后点击这里进行检定。检定结果会进入检定历史，并发送到输入栏。默认设置下同一楼层多次检定时新的检定会覆盖旧结果。',
      placement: 'top',
    },
    {
      selector: '.acu-dice-panel .acu-dice-panel-actions',
      title: '右上角设置',
      content: '这里可以重播教程、切换到对抗检定、查看检定历史、打开检定设置，或关闭当前面板。',
      placement: 'bottom',
    },
  ],
  contestDice: [
    {
      selector: '.acu-contest-panel',
      title: '对抗检定',
      content: '对抗检定会同时配置发起方和对抗方，按当前规则比较双方结果，并把结论发送到聊天输入框中。',
      placement: 'left',
    },
    {
      selector: ['#contest-dice-presets-section', '.acu-contest-panel .acu-dice-presets'],
      title: '检定规则',
      content: '这里选择对抗使用的规则。不同规则会调整双方需要填写的属性、修正值和胜负判定方式。',
      placement: 'bottom',
    },
    {
      selector: ['#contest-init-char-buttons-section', '#contest-init-char-buttons'],
      title: '发起方快捷选择',
      content: '选择发起方角色后，系统会刷新该角色可用的属性按钮，并尝试补齐属性数值。',
      placement: 'bottom',
    },
    {
      selector: '#contest-init-params-section',
      title: '发起方参数',
      content: '这里填写发起方的名字、属性名、技能值和修正。留空时会按当前规则使用默认值或自动计算。',
      placement: 'bottom',
    },
    {
      selector: '#init-attr-buttons',
      title: '发起方属性',
      content:
        '选择或输入发起方角色后，这里会显示 ta 的属性名和值。点击属性会自动填入发起方参数；骰子图标会按当前规则生成属性，垃圾桶图标会清空当前属性。',
      placement: 'top',
    },
    {
      selector: ['#contest-opp-char-buttons-section', '#contest-opp-char-buttons'],
      title: '对抗方快捷选择',
      content: '这里选择对抗方角色。对抗方属性名默认沿用发起方，也可以单独指定。',
      placement: 'bottom',
    },
    {
      selector: '#contest-opp-params-section',
      title: '对抗方参数',
      content: '这里填写对抗方的名字、属性名、技能值和修正。没有明确数值时会按当前规则兜底处理。',
      placement: 'bottom',
    },
    {
      selector: '#opp-attr-buttons',
      title: '对抗方属性',
      content:
        '选择或输入对抗方角色后，这里会显示 ta 的属性名和值。点击属性会自动填入对抗方参数；骰子图标会按当前规则生成属性，垃圾桶图标会清空当前属性。',
      placement: 'top',
    },
    {
      selector: '#contest-roll-btn',
      title: '开始对抗',
      content: '双方参数确认后点击这里开始对抗。结果会显示胜负关系，并写入聊天输入框。',
      placement: 'top',
    },
    {
      selector: '.acu-contest-panel .acu-dice-panel-actions',
      title: '右上角设置',
      content: '这里可以重播教程、切换回普通检定、查看检定历史、打开对抗检定设置，或关闭当前面板。',
      placement: 'bottom',
    },
  ],
  diceHistory: [
    {
      selector: ['.acu-dice-history-dialog', '.acu-dice-history-overlay .acu-edit-dialog'],
      title: '检定历史',
      content:
        '这里汇总普通检定和对抗检定记录。你可以回看检定对象、结果、骰面、效果执行状态，以及必要时展开详情。右上角的问号可以随时重播本教程。',
      placement: 'left',
    },
    {
      selector: '#acu-history-scope-filter',
      title: '统计范围',
      content: '这里切换统计口径：本聊天只看当前会话，本角色卡汇总同一角色卡，全局则统计所有记录。',
      placement: 'bottom',
    },
    {
      selector: '#acu-history-status-filter',
      title: '状态筛选',
      content: '这里按检定效果状态筛选，例如待执行、已确认、已提交或失败。排查效果链时很有用。',
      placement: 'bottom',
    },
    {
      selector: '#acu-history-search',
      title: '搜索记录',
      content: '输入角色名、属性名、结果文字等关键词，可以快速定位某次检定。',
      placement: 'bottom',
    },
    {
      selector: '#acu-dice-history-stats',
      title: '统计概览',
      content: '这里显示当前范围的检定总数、普通检定数、对抗检定数和成功率，方便观察本局的整体走势。',
      placement: 'top',
    },
    {
      selector: ['#acu-dice-history-list', '.acu-dice-history-overlay'],
      title: '历史列表',
      content:
        '每条记录会显示时间、检定类型、结果与骰子表达式。有详情按钮时可以展开效果链路，复制按钮可以复制完整详情。',
      placement: 'top',
    },
    {
      selector: '#acu-history-clear',
      title: '清理历史',
      content: '这个按钮会清空当前会话内历史和统计库记录。清理前会再次确认，避免误删。',
      placement: 'top',
    },
  ],
  diceSettings: [
    {
      selector: ['.acu-dice-settings-dialog', '#acu-open-preset-list'],
      title: '检定设置',
      content:
        '这里集中管理检定系统的高级选项：检定预设、自定义属性预设、疯狂模式，以及检定结果在输入栏和聊天记录中的显示方式。',
      placement: 'left',
    },
    {
      selector: '#dice-settings-preset-row',
      title: '检定预设',
      content: '检定预设决定“检定时遵循的规则”，例如使用什么骰子、大于或小于多少算成功、多少算失败、是否触发效果。',
      placement: 'bottom',
    },
    {
      selector: '#dice-settings-attr-preset-row',
      title: '自定义属性预设',
      content:
        '自定义属性预设影响表格填写提示词：它规定世界观中有哪些属性名、数值范围、每个数值范围的概率等，用来帮助生成或补全属性表格。',
      placement: 'bottom',
    },
    {
      selector: '#dice-settings-crazy-mode-row',
      title: '疯狂模式',
      content: '开启疯狂模式会在每次发送消息时随机让一名角色进行一次随机检定。',
      placement: 'bottom',
    },
    {
      selector: '#dice-result-display-settings',
      title: '结果显示',
      content:
        '这些开关控制检定结果是否显示在输入栏、重投时是否覆盖上一条检定结果、以及是否隐藏聊天记录中的检定结果。隐藏聊天记录中的检定结果有可能与酒馆全局的正则冲突。',
      placement: 'top',
    },
  ],
  advancedPresetManager: [
    {
      selector: ['.acu-advanced-preset-manager-dialog', '#acu-advanced-presets-list'],
      title: '检定预设管理',
      content:
        '检定预设是检定时使用的规则集合。它会定义骰子表达式、属性和难度字段、成功失败分支、输出模板和可能的效果。',
      placement: 'left',
    },
    {
      selector: '#acu-advanced-presets-list .acu-preset-item:first-child',
      title: '预设列表',
      content:
        '列表中包含内置预设和自定义预设。点击眼睛图标可在检定页面隐藏或显示某一预设，拖拽条目右侧手柄图标可以调整她们在检定面板中的排序。',
      placement: 'right',
    },
    {
      selector: '.acu-advanced-preset-copy',
      title: '复制内置预设',
      content: '内置预设不能直接编辑。需要修改时，请先复制为自定义预设，再在副本上进行修改。',
      placement: 'left',
    },
    {
      selector: '.acu-advanced-preset-export',
      title: '导出参考',
      content: '检定预设属于高级功能。建议先导出内置内置预设的JSON，参考它的字段结构后再进行自定义。',
      placement: 'left',
    },
    {
      selector: '#acu-advanced-preset-new',
      title: '新建预设',
      content:
        '这里可以从空白模板创建一套新的检定预设。它适合已经熟悉 JSON 字段后使用；初次自定义时，更建议先复制或导出内置预设作为参考。',
      placement: 'top',
    },
    {
      selector: '#acu-advanced-preset-import',
      title: '导入预设',
      content: '写好的检定预设 JSON 可以从这里导入。导入后会出现在列表中，并可用于普通检定或对抗检定。',
      placement: 'top',
    },
  ],
  attributePresetManager: [
    {
      selector: ['.acu-attribute-preset-manager-dialog', '#acu-presets-list'],
      title: '自定义属性规则管理',
      content:
        '自定义属性预设用于影响表格填写提示词，不直接决定检定成败。它会告诉系统世界观里有哪些属性名、属性范围和取值概率。',
      placement: 'left',
    },
    {
      selector: '#acu-presets-list .acu-preset-item:first-child',
      title: '属性预设列表',
      content: '这里列出默认、内置和自定义属性预设。开启某个预设后，表格属性生成和补全会优先参考这套属性规则。',
      placement: 'right',
    },
    {
      selector: '.acu-preset-toggle',
      title: '启用规则',
      content: '每次只能启用一套属性预设。关闭当前预设会回到默认的六维属性百分制。',
      placement: 'left',
    },
    {
      selector: '.acu-preset-export',
      title: '导出参考',
      content:
        '属性预设也是高级功能。请先导出内置 JSON，参考其中的属性名、公式、范围和特殊属性结构，再制作自己的世界观规则。',
      placement: 'left',
    },
    {
      selector: '#acu-preset-import',
      title: '导入预设',
      content:
        '将自定义属性预设 JSON 导入后，就可以在这里启用。它会影响属性表格填写提示词，但不会替代检定预设的成功失败规则。',
      placement: 'top',
    },
    {
      selector: ['#acu-open-preset-list', '#acu-preset-back'],
      title: '两类预设的关系',
      content:
        '简单区分：检定预设负责“怎么判定成功或失败”；自定义属性预设负责“世界观里有哪些属性，以及表格该如何填写这些属性”。两者可以配合使用，但职责不同。',
      placement: 'top',
    },
  ],
  map: [
    {
      selector: '.acu-map-container',
      title: '地图视图',
      content: '地图会把世界地图点、角色所在地点和地图元素整理成可视化视图。点击地点、人物或元素可以查看对应表格详情。',
      placement: 'left',
    },
    {
      selector: '.acu-map-region-tabs',
      title: '地区切换',
      content: '顶部标签用于切换主要地区或次要地区。切换后，下方会展示该地区内的地点。',
      placement: 'bottom',
    },
    {
      selector: '.acu-map-focus-area',
      title: '当前焦点地点',
      content: '中间区域展示当前选中的地点。中心是地点本身，左右两侧会显示在此处的角色和可互动元素。',
      placement: 'bottom',
    },
    {
      selector: ['.acu-map-avatar:first-child', '.acu-map-mobile-avatars .acu-map-avatar:first-child'],
      title: '在场角色',
      content: '角色头像来自角色表和头像配置。点击头像可以打开角色详情，方便从地图快速确认谁在现场。',
      placement: 'top',
    },
    {
      selector: ['.acu-map-element-chip:first-child', '.acu-map-mobile-elements .acu-map-element-chip:first-child'],
      title: '地图元素',
      content: '元素通常来自地图元素表，例如机关、线索、可互动地点或特殊物件。点击可以查看对应条目的详情。',
      placement: 'top',
    },
    {
      selector: '.acu-map-thumbnails .acu-map-thumbnail:first-child',
      title: '地点列表',
      content: '下方缩略图列出当前地区内的地点。角标数字表示该地点关联的角色和元素数量，点击缩略图即可切换焦点地点。',
      placement: 'top',
    },
    {
      selector: '.acu-map-back-btn',
      title: '回到当前地点',
      content: '如果你浏览到了别的地点，可以用这个按钮回到主角当前所在地点或系统识别出的当前详细地点。',
      placement: 'left',
    },
  ],
  relationshipGraph: [
    {
      selector: '.acu-relation-graph-container',
      title: '人物关系图',
      content:
        '人物关系图会把角色表中的人际关系整理成节点和连线。角色是节点，关系是带文字和方向的连线，点击角色节点可以查看详情。',
      placement: 'left',
    },
    {
      selector: '#graph-center-dropdown',
      title: '中心角色',
      content: '这里选择关系图的中心角色。中心角色会影响直接关系筛选、节点大小和重新布局后的视图重心。',
      placement: 'bottom',
    },
    {
      selector: '#graph-filter-controls',
      title: '筛选与移动',
      content:
        '点击定位图标后只显示在场角色；链条图标启用后只显示与中心角色有关系的角色；点击十字箭头后会开启移动模式，可拖动头像来调整位置。',
      placement: 'bottom',
    },
    {
      selector: '.acu-graph-canvas-wrapper',
      title: '关系画布',
      content: '画布中可以查看角色之间的关系网络。连线文字是关系名，箭头表示关系方向；滚轮或触控可以缩放和平移视图。',
      placement: 'top',
    },
    {
      selector: '.acu-graph-nodes .acu-graph-node:first-child',
      title: '角色节点',
      content: '每个头像都是一个角色节点。点击节点会打开角色详情；主角或当前中心角色会有更明显的视觉标记。',
      placement: 'right',
    },
    {
      selector: '#graph-relayout',
      title: '重新布局',
      content: '如果节点挤在一起，可以点击这里清除布局缓存并重新计算位置。',
      placement: 'left',
    },
    {
      selector: '#graph-manage-avatar',
      title: '头像管理',
      content: '这里可以管理关系图里角色头像的图片、缩放和裁剪，让图上的人物更容易辨认。',
      placement: 'left',
    },
    {
      selector: '.acu-graph-view-controls',
      title: '视图控制',
      content: '底部可以重置视图、调整节点大小，并查看当前视图缩放比例。节点太密或太小时，可以先调这里。',
      placement: 'top',
    },
  ],
  avatarManager: [
    {
      selector: '.acu-avatar-manager',
      title: '头像管理',
      content: '这里用于给角色配置头像和别名。关系图、地图、物品栏等界面会优先使用这里保存的头像。',
      placement: 'left',
    },
    {
      selector: '.acu-avatar-header-actions',
      title: '导入导出',
      content: '右上角可以导入或导出头像配置 JSON，适合备份、迁移或分享整套角色头像设置。',
      placement: 'left',
    },
    {
      selector: '.acu-avatar-filter-controls',
      title: '筛选与排序',
      content: '工具栏可以切换当前聊天和全局头像库，按名字、日期或来源排序，也可以搜索角色名和别名。',
      placement: 'bottom',
    },
    {
      selector: '#acu-avatar-list-container .acu-avatar-user-item',
      title: '头像条目',
      content: '每个条目对应一个角色。左侧是头像预览，中间显示名字和头像来源，右侧按钮可以展开编辑或清除配置。',
      placement: 'right',
    },
    {
      selector: '#acu-avatar-list-container .acu-avatar-user-item .acu-avatar-preview',
      title: '头像预览',
      content: '点击头像预览可以上传本地图片；已有图片时会打开裁剪窗口，用来调整头像位置和缩放。',
      placement: 'right',
    },
    {
      selector: [
        '#acu-avatar-list-container .acu-avatar-user-item.expanded .acu-avatar-row-expanded',
        '#acu-avatar-list-container .acu-avatar-user-item .acu-avatar-row-expanded',
      ],
      title: '编辑头像',
      content: '展开后可以粘贴图片 URL、填写别名，或使用本地上传。别名用于把表格里的不同称呼匹配到同一个角色头像。',
      placement: 'top',
    },
    {
      selector: [
        '#acu-avatar-list-container .acu-avatar-user-item.expanded .acu-avatar-footer-actions',
        '#acu-avatar-list-container .acu-avatar-user-item .acu-avatar-footer-actions',
      ],
      title: '保存与清理',
      content: '底部按钮可以清除头像、清空别名、本地上传图片，最后点击保存应用配置。保存 URL 头像时会进入裁剪调整。',
      placement: 'top',
    },
  ],
  table: [
    {
      selector: [
        '#acu-data-area.visible .acu-data-card',
        '#acu-data-area.visible .acu-empty-hint',
        '#acu-data-area.visible .acu-panel-content',
      ],
      title: '数据卡片',
      content:
        '通用表格会以单独标签页呈现，每一行都会整理成一张卡片。单击卡片可以添加、编辑、删除或收藏条目；新增行和发生变化的单元格会默认高亮。',
      placement: 'right',
    },
    {
      selector: [
        '#acu-data-area.visible .acu-card-actions',
        '#acu-data-area.visible .acu-data-card',
        '#acu-data-area.visible .acu-panel-content',
        '#acu-data-area.visible .acu-empty-hint',
      ],
      title: '互动功能',
      content:
        '部分卡片底部会出现互动按钮。系统会根据表格名、列名或内容关键字匹配不同选项，例如地点表可能出现前往、探索、停留；没有匹配规则的表格则不会显示。互动选项可以在设置页的高级设置中修改。',
      placement: 'top',
    },
    {
      selector: [
        '#acu-data-area.visible .acu-header-actions',
        '#acu-data-area.visible .acu-panel-header',
        '#acu-data-area.visible',
      ],
      title: '右上角工具',
      content:
        '这里集中放置表格常用功能：播放本界面教程、切换排序或视图、调整面板高度、搜索和关闭。角色、地图、物品等表格还会出现对应的专用按钮。',
      placement: 'left',
    },
  ],
  mvu: [
    {
      selector: '.acu-mvu-panel',
      title: '变量面板',
      content: '变量面板用于查看以及修改当前楼层中的变量，支持MVU，ERA，LWB变量框架。',
      placement: 'top',
    },
    {
      selector: ['.acu-mvu-panel .mvu-btn-refresh', '.acu-mvu-panel .acu-header-actions'],
      title: '刷新变量',
      content: '如果角色卡支持变量框架但这里没有显示变量，可以点击刷新按钮，然后关闭变量面板再重新打开。',
      placement: 'bottom',
    },
    {
      selector: ['.mvu-btn-numeric-mode', '.acu-mvu-panel .acu-header-actions', '.acu-mvu-panel'],
      title: '数值视图',
      content: '启动数值模式时会集中展示可检定属性，点击骰子图标以快速发起检定。',
      placement: 'bottom',
    },
    {
      selector: [
        '.mvu-level-controls-collapsible',
        '.mvu-level-controls-header',
        '.mvu-numeric-mode',
        '.mvu-btn-numeric-mode',
      ],
      title: '显示层级',
      content: '数值模式下可以展开“显示层级”来过滤变量的层级。隐藏某个层级后，对应变量会从列表里省略。',
      placement: 'bottom',
    },
  ],
  changes: [
    {
      selector: ['.acu-changes-content', '#acu-data-area.visible'],
      title: '审核面板',
      content: '审核面板用于查看数据变化或验证问题，并决定接受、回滚或手动修正。',
      placement: 'top',
    },
    {
      selector: ['.acu-changes-batch-actions', '#acu-data-area.visible .acu-header-actions'],
      title: '批量操作',
      content: '这里是审核面板的批量操作区：可以接受全部变更或回滚全部变更，也可以切换完整审核与数据验证模式。',
      placement: 'left',
    },
    {
      selector: ['.acu-changes-list', '.acu-changes-content .acu-empty-hint', '.acu-changes-content'],
      title: '变更项',
      content: '这里按表格分组展示待审核内容。没有变更或验证错误时，这里会显示空状态提示。',
      placement: 'right',
    },
    {
      selector: [
        '.acu-change-actions',
        '.acu-change-action-btn',
        '.acu-change-item',
        '.acu-changes-content .acu-empty-hint',
        '.acu-changes-content',
      ],
      title: '单条操作',
      content: '每条变更右侧可以单独接受、回滚或编辑。列表为空时不会出现这些按钮，直接从空状态确认当前无需处理即可。',
      placement: 'right',
    },
  ],
  favorites: [
    {
      selector: '#acu-data-area.visible',
      title: '收藏夹',
      content:
        '单击任意卡片时可以选择将其收藏到收藏夹。收藏夹内的卡片不会跟随聊天记录变化而变化，便于跨聊天保存与复用。',
      placement: 'top',
    },
    {
      selector: [
        '#acu-data-area.visible .acu-fav-tag-filter-collapsible',
        '#acu-data-area.visible .acu-fav-tag-filter-header',
        '#acu-data-area.visible .acu-fav-tag-filter-body .acu-fav-tag-btn',
        '#acu-data-area.visible .acu-fav-group-title',
        '#acu-data-area.visible .acu-fav-panel-content',
      ],
      title: '标签过滤',
      content: '展开可以按收藏时添加的标签来筛选显示的卡片。',
      placement: 'bottom',
    },
    {
      selector: [
        '#acu-data-area.visible .acu-fav-card',
        '#acu-data-area.visible .acu-data-card.acu-fav-card',
        '#acu-data-area.visible .acu-fav-panel-content .acu-fav-empty',
        '#acu-data-area.visible .acu-fav-panel-content',
      ],
      title: '管理收藏卡片',
      content: '单击被收藏的卡片，可以执行编辑、删除、复制，以及发送到当前聊天等操作。',
      placement: 'right',
    },
    {
      selector: [
        '.acu-fav-transfer-actions',
        '#acu-fav-import, #acu-fav-export',
        '#acu-data-area.visible .acu-header-actions',
        '#acu-data-area.visible',
      ],
      title: '导入导出',
      content: '顶部按钮可以导入或导出收藏数据，适合备份与分享。',
      placement: 'left',
    },
  ],
  inventory: [
    {
      selector: '.acu-inventory-shell',
      title: '物品栏',
      content: '物品栏会把物品表整理成更适合查看和操作的界面。',
      placement: 'left',
    },
    {
      selector: '.acu-inventory-window-header .acu-header-actions',
      title: '顶部工具',
      content:
        '顶部可以搜索物品名和描述，也可以跳转到骰子商店或原始物品表。需要直接改表格数据时，用表格按钮回到原表更方便。',
      placement: 'bottom',
    },
    {
      selector: '.acu-inventory-toolbar',
      title: '筛选选项',
      content:
        '筛选区可以按类型、品质和排序方式整理物品。右上角的数字表示当前启用了几个筛选条件；点击标题可以收起或展开。',
      placement: 'bottom',
    },
    {
      selector: '.acu-inventory-grid',
      title: '物品列表',
      content:
        '这里是筛选后的物品卡片。卡片会显示图标、名称和数量；点击任意物品卡可以打开详情页，继续查看描述、来源、赠与角色或执行快捷操作。',
      placement: 'top',
    },
  ],
  inventoryDetail: [
    {
      selector: '.acu-inventory-detail',
      title: '物品详情',
      content: '详情页集中显示一个物品的名称、类型、品质、数量、来源信息和描述。',
      placement: 'left',
    },
    {
      selector: '.acu-inventory-detail-title',
      title: '物品标题',
      content: '这里是物品名称。点击名称可以打开编辑菜单，用来修正物品表里的基础字段。',
      placement: 'bottom',
    },
    {
      selector: '.acu-inventory-detail-gift',
      title: '',
      content: '礼物按钮用于把当前物品赠与某个角色。点开后可以从角色列表中选择目标，也可以只显示当前在场角色。',
      placement: 'bottom',
    },
    {
      selector: '.acu-inventory-detail-meta-wrap',
      title: '获得记录',
      content: '这里记录获得地和获取时间。点击对应行可以编辑，方便之后回溯这个物品是从哪里来的。',
      placement: 'bottom',
    },
    {
      selector: '.acu-inventory-detail-desc',
      title: '描述说明',
      content: '这里是物品描述。点击描述可以编辑原表字段，适合补充用途、限制、线索或剧情说明。',
      placement: 'top',
    },
    {
      selector: '.acu-inventory-detail-actions',
      title: '快捷操作',
      content:
        '底部按钮会根据物品类型生成可用操作，例如使用、查看或分解碎片。执行后通常会把对应动作写入聊天输入框，便于继续叙事。',
      placement: 'top',
    },
    {
      selector: '.acu-inventory-detail-header-actions',
      title: '右上角操作',
      content: '右上角可以跳回原始表格、分解物品、重播本页教程或关闭详情。',
      placement: 'left',
    },
  ],
  gacha: [
    {
      selector: '.acu-gacha-shell',
      title: '骰子商店',
      content: '骰子商店用“骰运”抽取物品。抽到的奖励会按发放目标写入物品表或装备表，因此抽取前请保证对应表格结构正确。',
      placement: 'left',
    },
    {
      selector: '.acu-gacha-stat-row',
      title: '资源与保底',
      content: '这里显示当前骰运、稀有保底、传说保底和碎片总数。保底会随着抽取推进，碎片可以进入碎片商城兑换指定物品。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-fortune-progress',
      title: '骰运获取',
      content:
        '骰运会根据检定次数、输入进度、活跃时间获得。这里会显示距离下一次基础奖励、活跃奖励还差多少，以及最近一次获得骰运的来源。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-pool-tabs',
      title: '卡池分类',
      content: '卡池按标签分类。切换标签会改变下方 PICK UP 展示和抽取范围。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-pickup-section',
      title: 'PICK UP',
      content:
        '这里展示当前卡池的重点物品，这些物品在同稀有度的物品中更容易被抽到。点击物品可以先查看说明、类型、品质。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-recent-section',
      title: '最近收获',
      content: '最近收获记录会列出近期抽到的物品和品质。抽完后可以在这里快速回看，也可以点击条目查看物品详情。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-draw-row',
      title: '抽取按钮',
      content: '点击按钮进行抽取。抽到重复的高品质物品时会转化为对应碎片。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-shard-shop-open',
      title: '碎片商城入口',
      content: '从这里进入碎片商城。碎片商城可以用碎片来兑换指定物品',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-settings-open',
      title: '商城设置',
      content: '这里可以管理奖池显示、是否加入“全部”，也可以新建和编辑自定义物品。JSON 导入导出仍然可以继续使用。',
      placement: 'bottom',
    },
  ],
  gachaSettings: [
    {
      selector: '.acu-gacha-settings-dialog',
      title: '骰子商城设置',
      content: '这里集中管理卡池、自定义物品、导入导出和清空操作。设置保存后会同步影响骰子商店与碎片商城。',
      placement: 'left',
    },
    {
      selector: '#acu-gacha-settings-pool-list',
      title: '卡池管理',
      content:
        '每行代表一个卡池。拖拽把手调整顺序，眼睛控制是否出现在商店快捷切换卡池选项中，开关控制是否加入“全部”的抽取范围。',
      placement: 'bottom',
    },
    {
      selector: '#acu-gacha-settings-pool-list .acu-gacha-settings-pool-item[data-pool-id="奇幻"]',
      title: '卡池操作',
      content:
        '以“奇幻”为例，右侧可以控制快捷标签、是否加入“全部”抽取范围、导出此卡池和重命名。只有自定义卡池会额外显示删除按钮。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-settings-pool-tabs',
      title: '查看卡池物品',
      content: '切换这里的标签可以查看不同卡池的物品列表。“全部”会把已加入全部范围的卡池合并展示。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-settings-toolbar',
      title: '筛选与排序',
      content:
        '左侧三个下拉用于筛选来源、启用状态和排序方式，右侧搜索可以匹配名称、类型、描述和卡池。筛选或排序时会暂时锁定拖拽排序。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-settings-item:first-child',
      title: '物品行',
      content:
        '物品行会显示图标、品质、来源、卡池和权重。点击行可查看详情，开关控制是否参与抽取与兑换；自定义物品可以编辑或删除。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-settings-footer',
      title: '导入导出',
      content:
        '底部提供新建卡池、新建物品、导入卡池JSON、导出卡池JSON、清空自定义和返回。导入、删除与清空都会先弹出确认框。',
      placement: 'top',
    },
  ],
  gachaItemEditor: [
    {
      selector: '.acu-gacha-item-editor',
      title: '自定义物品',
      content: '这里用于新建或编辑骰子商店的自定义物品。保存后，它会出现在所属卡池中，并参与后续抽取与碎片兑换。',
      placement: 'left',
    },
    {
      selector: '.acu-gacha-item-name-field',
      title: '名称与类型',
      content: '名称是必填项，会作为物品写入表格时的显示名。类型用于物品表分类，也会参与设置界面的搜索。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-item-quality-field',
      title: '品质与权重',
      content:
        '品质决定物品所属稀有度，并影响保底和碎片价值。权重是同一卡池、同一品质内的相对抽取概率，数值越大越容易出现。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-item-target-field',
      title: '发放方式',
      content: '发放目标决定奖励写入物品表还是装备表。发放数量会作为获得数量写入，适合一次给多个消耗品或材料。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-item-description-field',
      title: '描述',
      content: '描述会显示在商店卡片、详情和设置列表里。可以写物品效果、使用限制或叙事说明。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-item-pools',
      title: '所属卡池',
      content: '至少选择一个卡池。选中多个卡池后，同一个物品会同时出现在这些标签下；新建时会默认勾选当前进入的卡池。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-icon-editor-card',
      title: '图标',
      content: '可以使用符号图标、图片 URL 或本地图标。本地图标只保存在当前浏览器，普通 JSON 导出不会包含图片文件。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-item-flags',
      title: '数量规则',
      content: '可堆叠适合药剂、材料这类可以合并数量的奖励。唯一物品适合钥匙、神器等不希望重复获得的奖励。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-item-editor .acu-gacha-settings-footer',
      title: '保存',
      content: '确认内容后点击保存。系统会校验名称、品质、权重、数量和所属卡池，成功后回到骰子商城设置。',
      placement: 'top',
    },
  ],
  shardShop: [
    {
      selector: '.acu-gacha-shard-shop',
      title: '碎片商城',
      content: '碎片商城用于把碎片兑换成指定物品。它和骰子商店共用物品池，按稀有度消耗固定数量碎片来进行兑换。',
      placement: 'left',
    },
    {
      selector: '.acu-gacha-shard-tabs',
      title: '碎片类型',
      content: '顶部按钮按稀有度显示你拥有的碎片数量。切换稀有度后，下方只显示该品质可兑换的物品。',
      placement: 'bottom',
    },
    {
      selector: '.acu-gacha-shard-items',
      title: '兑换列表',
      content: '这里列出当前稀有度下可兑换的物品。灰掉的条目通常表示碎片不足，或唯一物品已经拥有，暂时不能重复兑换。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-shard-item-card:first-child .acu-gacha-shard-card-main',
      title: '查看物品',
      content: '点击物品主体可以查看详情，确认说明、类型和用途后再决定是否兑换。',
      placement: 'top',
    },
    {
      selector: '.acu-gacha-shard-item-card:first-child .acu-gacha-shard-buy-btn',
      title: '兑换按钮',
      content: '左侧价格按钮会显示兑换需要的碎片数量。点击后会弹出确认框，确认后奖励会写入物品表或装备表并扣除对应碎片。',
      placement: 'bottom',
    },
  ],
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const normalizeState = (rawState: unknown): TutorialState => {
  if (!rawState || typeof rawState !== 'object') return { ...DEFAULT_STATE };
  const data = rawState as Partial<TutorialState>;
  const completedScopes = Array.isArray(data.completedScopes)
    ? data.completedScopes.filter((scope): scope is TutorialScope => Object.keys(STEPS).includes(String(scope)))
    : [];
  return {
    version: 1,
    revision: typeof data.revision === 'number' && data.revision >= STATE_REVISION ? data.revision : STATE_REVISION,
    disabled: data.disabled === true,
    completedScopes: typeof data.revision === 'number' && data.revision >= STATE_REVISION ? completedScopes : [],
  };
};

const hasCompleted = (state: TutorialState, scope: TutorialScope): boolean => state.completedScopes.includes(scope);

const markCompleted = (state: TutorialState, scope: TutorialScope): TutorialState => {
  if (hasCompleted(state, scope)) return state;
  return { ...state, completedScopes: [...state.completedScopes, scope] };
};

const isTutorialAction = (action: string | undefined): action is TutorialAction =>
  action === 'prev' || action === 'next' || action === 'skip' || action === 'never';

const getSelectors = (step: TutorialStep): readonly string[] => {
  if (!step.selector) return [];
  return Array.isArray(step.selector) ? step.selector : [step.selector];
};

export const createTutorialModule = (options: TutorialModuleOptions): TutorialModule => {
  let activeTutorial: ActiveTutorial | null = null;
  let overlay: HTMLElement | null = null;
  let blocker: HTMLElement | null = null;
  let highlight: HTMLElement | null = null;
  let popover: HTMLElement | null = null;
  let maskSvg: SVGSVGElement | null = null;
  let maskPath: SVGPathElement | null = null;
  let currentTarget: HTMLElement | null = null;
  let repositionRaf: number | null = null;
  let scrollRaf: number | null = null;
  let lastActionHandledAt = 0;

  const getState = (): TutorialState => normalizeState(options.getStore<TutorialState>(STORAGE_KEY, DEFAULT_STATE));

  const saveState = (state: TutorialState): void => {
    options.setStore(STORAGE_KEY, state);
  };

  const getDoc = (): Document => options.getDocument();
  const getWin = (): Window => options.getWindow();

  const injectStyles = (): void => {
    const doc = getDoc();
    if (doc.getElementById(STYLE_ID)) return;

    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${OVERLAY_CLASS} {
        position: fixed;
        inset: 0;
        z-index: 31600;
        pointer-events: auto;
        isolation: isolate;
        font-family: "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .acu-tutorial-blocker {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        background: rgba(0, 0, 0, 0.001);
        pointer-events: auto;
        touch-action: none;
        -webkit-tap-highlight-color: transparent;
      }
      .acu-tutorial-mask {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        pointer-events: none;
        contain: layout paint style;
      }
      .acu-tutorial-mask path {
        fill: rgba(0, 0, 0, 0.66);
      }
      .acu-tutorial-highlight {
        position: fixed;
        left: 0;
        top: 0;
        border: 2px solid var(--acu-accent, #3b82f6);
        border-radius: 10px;
        box-shadow: 0 0 0 6px color-mix(in srgb, var(--acu-accent, #3b82f6) 24%, transparent);
        transition: transform 0.18s ease, width 0.18s ease, height 0.18s ease, opacity 0.12s ease;
        will-change: transform, width, height;
        z-index: 2;
        pointer-events: none;
        contain: layout paint style;
      }
      .acu-tutorial-popover {
        position: fixed;
        width: min(320px, calc(100vw - 28px));
        background: var(--acu-bg-panel, #fff);
        color: var(--acu-text-main, #222);
        border: 1px solid var(--acu-border, rgba(0, 0, 0, 0.18));
        border-radius: 8px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        z-index: 3;
      }
      .acu-tutorial-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-table-head, rgba(0, 0, 0, 0.04));
        border-bottom: 1px solid var(--acu-border, rgba(0, 0, 0, 0.14));
        font-weight: 700;
        font-size: 14px;
      }
      .acu-tutorial-head i {
        color: var(--acu-accent, #3b82f6);
      }
      .acu-tutorial-body {
        padding: 13px 14px 12px;
        color: var(--acu-text-main, #222);
        font-size: 13px;
        line-height: 1.65;
      }
      .acu-tutorial-progress {
        color: var(--acu-text-sub, #666);
        font-size: 11px;
        margin-top: 8px;
      }
      .acu-tutorial-actions {
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 10px 12px;
        background: var(--acu-table-head, rgba(0, 0, 0, 0.04));
        border-top: 1px solid var(--acu-border, rgba(0, 0, 0, 0.14));
      }
      .acu-tutorial-btn {
        min-height: 30px;
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid var(--acu-border, rgba(0, 0, 0, 0.16));
        background: var(--acu-btn-bg, rgba(0, 0, 0, 0.06));
        color: var(--acu-text-main, #222);
        cursor: pointer;
        font-size: 12px;
      }
      .acu-tutorial-btn:hover {
        background: var(--acu-btn-hover, rgba(0, 0, 0, 0.1));
      }
      .acu-tutorial-btn.primary {
        background: var(--acu-accent, #3b82f6);
        border-color: var(--acu-accent, #3b82f6);
        color: var(--acu-button-text-on-accent, #fff);
        font-weight: 700;
      }
      .acu-tutorial-btn.ghost {
        border-color: transparent;
        background: transparent;
        color: var(--acu-text-sub, #666);
      }
      .acu-tutorial-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      @media (max-width: 640px) {
        .acu-tutorial-popover {
          width: calc(100vw - 20px);
          max-height: var(--acu-tutorial-mobile-max-height, min(42dvh, 360px));
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.42);
        }
        .acu-tutorial-highlight {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--acu-accent, #3b82f6) 24%, transparent);
        }
        .acu-tutorial-head,
        .acu-tutorial-actions {
          flex: 0 0 auto;
        }
        .acu-tutorial-body {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          font-size: 13px;
        }
        .acu-tutorial-actions {
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .acu-tutorial-btn.ghost {
          grid-column: span 1;
        }
        .acu-tutorial-btn {
          min-height: 38px;
          font-size: 13px;
        }
        .acu-tutorial-btn.primary {
          min-height: 42px;
        }
      }
    `;
    doc.head.appendChild(style);
  };

  const isVisibleElement = (element: HTMLElement): boolean => {
    if (!element.isConnected) return false;
    const rect = element.getBoundingClientRect();
    const style = getWin().getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  };

  const queryVisibleElement = (selector: string): HTMLElement | null => {
    const doc = getDoc();
    const first = doc.querySelector<HTMLElement>(selector);
    if (!first) return null;
    if (isVisibleElement(first)) return first;

    const candidates = doc.querySelectorAll<HTMLElement>(selector);
    for (const element of candidates) {
      if (isVisibleElement(element)) return element;
    }
    return null;
  };

  const findTarget = (tutorial: ActiveTutorial, index: number): HTMLElement | null => {
    const step = tutorial.steps[index];
    if (index === 0 && tutorial.initialTarget && isVisibleElement(tutorial.initialTarget)) {
      return tutorial.initialTarget;
    }

    const cached = tutorial.targetCache.get(index);
    if (cached && isVisibleElement(cached)) return cached;
    if (tutorial.targetCache.has(index)) tutorial.targetCache.delete(index);

    for (const selector of getSelectors(step)) {
      const target = queryVisibleElement(selector);
      if (target) {
        tutorial.targetCache.set(index, target);
        return target;
      }
    }
    tutorial.targetCache.set(index, null);
    return null;
  };

  const isPopoverEventTarget = (target: EventTarget | null): boolean => {
    if (!target || !popover) return false;
    return target instanceof getWin().Node && popover.contains(target);
  };

  const blockOutsideTutorialEvent = (event: Event): void => {
    if (!activeTutorial || !overlay || isPopoverEventTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const blockedEventNames = [
    'pointerdown',
    'pointerup',
    'pointercancel',
    'mousedown',
    'mouseup',
    'click',
    'dblclick',
    'touchstart',
    'touchmove',
    'touchend',
    'wheel',
    'contextmenu',
  ] as const;

  const removeListeners = (): void => {
    const win = getWin();
    const doc = getDoc();
    win.removeEventListener('resize', requestReposition);
    win.removeEventListener('scroll', requestReposition);
    win.visualViewport?.removeEventListener('resize', requestReposition);
    win.visualViewport?.removeEventListener('scroll', requestReposition);
    blockedEventNames.forEach(eventName => {
      doc.removeEventListener(eventName, blockOutsideTutorialEvent, true);
    });
  };

  function requestReposition(): void {
    if (repositionRaf !== null) return;
    repositionRaf = getWin().requestAnimationFrame(() => {
      repositionRaf = null;
      positionElements();
    });
  }

  const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

  const getViewportRect = (): TutorialViewport => {
    const win = getWin();
    const doc = getDoc();
    const visualViewport = win.visualViewport;
    const left = visualViewport?.offsetLeft ?? 0;
    const top = visualViewport?.offsetTop ?? 0;
    const width = visualViewport?.width ?? win.innerWidth ?? doc.documentElement.clientWidth ?? 0;
    const height = visualViewport?.height ?? win.innerHeight ?? doc.documentElement.clientHeight ?? 0;
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
    };
  };

  const isMobileTutorialViewport = (): boolean => {
    const viewport = getViewportRect();
    const win = getWin();
    const coarsePointer = win.matchMedia?.('(pointer: coarse)').matches === true;
    return viewport.width <= 640 || (coarsePointer && viewport.width <= 820);
  };

  const getPopoverPosition = (
    targetRect: DOMRect,
    popoverRect: DOMRect,
    placement: TutorialPlacement,
  ): { left: number; top: number } => {
    const gap = 14;
    const margin = 12;
    const viewport = getViewportRect();
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxLeft = Math.max(minLeft, viewport.right - popoverRect.width - margin);
    const maxTop = Math.max(minTop, viewport.bottom - popoverRect.height - margin);

    if (placement === 'center') {
      return {
        left: clamp(viewport.left + (viewport.width - popoverRect.width) / 2, minLeft, maxLeft),
        top: clamp(viewport.top + (viewport.height - popoverRect.height) / 2, minTop, maxTop),
      };
    }

    const centeredLeft = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    const centeredTop = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
    const candidates: Record<TutorialPlacement, { left: number; top: number }> = {
      top: { left: centeredLeft, top: targetRect.top - popoverRect.height - gap },
      right: { left: targetRect.right + gap, top: centeredTop },
      bottom: { left: centeredLeft, top: targetRect.bottom + gap },
      left: { left: targetRect.left - popoverRect.width - gap, top: centeredTop },
      center: { left: centeredLeft, top: centeredTop },
    };

    let next = candidates[placement];
    const overflows =
      next.left < minLeft ||
      next.top < minTop ||
      next.left + popoverRect.width > viewport.right - margin ||
      next.top + popoverRect.height > viewport.bottom - margin;

    if (overflows) {
      const fallbackOrder: TutorialPlacement[] = ['bottom', 'top', 'right', 'left'];
      const fallback = fallbackOrder
        .map(item => candidates[item])
        .find(
          item =>
            item.left >= minLeft &&
            item.top >= minTop &&
            item.left + popoverRect.width <= viewport.right - margin &&
            item.top + popoverRect.height <= viewport.bottom - margin,
        );
      if (fallback) next = fallback;
    }

    return {
      left: clamp(next.left, minLeft, maxLeft),
      top: clamp(next.top, minTop, maxTop),
    };
  };

  const getMobilePopoverPosition = (targetRect: DOMRect, popoverRect: DOMRect): { left: number; top: number } => {
    const gap = 12;
    const margin = 10;
    const viewport = getViewportRect();
    const minLeft = viewport.left + margin;
    const minTop = viewport.top + margin;
    const maxLeft = Math.max(minLeft, viewport.right - popoverRect.width - margin);
    const maxTop = Math.max(minTop, viewport.bottom - popoverRect.height - margin);
    const left = clamp(viewport.left + (viewport.width - popoverRect.width) / 2, minLeft, maxLeft);

    const targetCenterY = targetRect.top + targetRect.height / 2;
    const targetInUpperHalf = targetCenterY < viewport.top + viewport.height / 2;
    const topEdgeCandidate = minTop;
    const bottomEdgeCandidate = maxTop;
    const preferredTop = targetInUpperHalf ? bottomEdgeCandidate : topEdgeCandidate;
    const fallbackTop = targetInUpperHalf ? topEdgeCandidate : bottomEdgeCandidate;
    const hasVerticalGap = (top: number): boolean =>
      top + popoverRect.height <= targetRect.top - gap || top >= targetRect.bottom + gap;

    if (hasVerticalGap(preferredTop)) return { left, top: preferredTop };
    if (hasVerticalGap(fallbackTop)) return { left, top: fallbackTop };

    const spaceAbove = Math.max(0, targetRect.top - viewport.top);
    const spaceBelow = Math.max(0, viewport.bottom - targetRect.bottom);
    const top = spaceBelow >= spaceAbove ? targetRect.bottom + gap : targetRect.top - popoverRect.height - gap;
    return { left, top: clamp(top, minTop, maxTop) };
  };

  const getRectFromElement = (element: HTMLElement): TutorialRect | null => {
    if (!isVisibleElement(element)) return null;
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  };

  const isRelatedToTarget = (element: HTMLElement, target?: HTMLElement | null): boolean => {
    if (!target) return false;
    return element === target || element.contains(target) || target.contains(element);
  };

  const getTargetOverlayRoot = (target?: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;
    const root = target.closest(
      '.acu-edit-overlay, .acu-inventory-detail-overlay, .acu-import-confirm-overlay, .mvu-edit-overlay',
    );
    return root instanceof getWin().HTMLElement ? root : null;
  };

  const getBottomObstacleTop = (viewport: TutorialViewport, target?: HTMLElement | null): number => {
    const doc = getDoc();
    const targetOverlayRoot = getTargetOverlayRoot(target);
    const dialogObstacleSelectors = [
      '.acu-gacha-settings-dialog > .acu-gacha-settings-footer',
      '.acu-gacha-item-editor > .acu-gacha-settings-footer',
      '.acu-edit-dialog > .acu-gacha-settings-footer',
    ];
    const globalObstacleSelectors = [
      '.acu-wrapper.acu-mode-viewport #acu-nav-bar',
      '.acu-wrapper.acu-mode-viewport .acu-nav-container',
      '#acu-nav-bar',
      '#acu-active-actions',
      '#send_form',
      '#form_sheld',
      '.send_form',
      '#send_textarea',
    ];
    const selectors = targetOverlayRoot
      ? dialogObstacleSelectors
      : [...dialogObstacleSelectors, ...globalObstacleSelectors];
    return selectors.reduce((currentTop, selector) => {
      const elements = doc.querySelectorAll<HTMLElement>(selector);
      let nextTop = currentTop;
      elements.forEach(element => {
        if (targetOverlayRoot && !targetOverlayRoot.contains(element)) return;
        // 目标本身可能就是底部栏或导航盘；这种情况下不能把它当成遮挡物避让。
        if (isRelatedToTarget(element, target)) return;
        const rect = getRectFromElement(element);
        if (!rect) return;
        const overlapsViewport = rect.bottom > viewport.top && rect.top < viewport.bottom;
        const startsInLowerHalf = rect.top > viewport.top + viewport.height * 0.4;
        if (!overlapsViewport || !startsInLowerHalf) return;
        nextTop = Math.min(nextTop, rect.top);
      });
      return nextTop;
    }, viewport.bottom);
  };

  const getTargetSafeRect = (popoverRect?: TutorialRect | null, target?: HTMLElement | null): TutorialRect => {
    const viewport = getViewportRect();
    const margin = 10;
    const gap = 12;
    let top = viewport.top + margin;
    let bottom = Math.min(viewport.bottom - margin, getBottomObstacleTop(viewport, target) - gap);
    const left = viewport.left + margin;
    const right = viewport.right - margin;

    if (popoverRect) {
      const popoverOverlapsViewport = popoverRect.bottom > viewport.top && popoverRect.top < viewport.bottom;
      if (popoverOverlapsViewport) {
        const popoverCenterY = popoverRect.top + popoverRect.height / 2;
        if (popoverCenterY < viewport.top + viewport.height / 2) {
          top = Math.max(top, popoverRect.bottom + gap);
        } else {
          bottom = Math.min(bottom, popoverRect.top - gap);
        }
      }
    }

    if (bottom - top < 120) {
      top = viewport.top + margin;
      bottom = Math.min(viewport.bottom - margin, getBottomObstacleTop(viewport, target) - gap);
    }

    return {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  };

  const getCurrentPopoverRect = (): TutorialRect | null => {
    if (!popover || popover.style.visibility === 'hidden') return null;
    const rect = popover.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  };

  const isTargetComfortablyVisible = (target: HTMLElement): boolean => {
    const safeRect = getTargetSafeRect(getCurrentPopoverRect(), target);
    const rect = target.getBoundingClientRect();
    const horizontalMargin = 4;
    const hasHorizontalPresence = rect.right >= safeRect.left + horizontalMargin && rect.left <= safeRect.right - horizontalMargin;
    const hasVerticalPresence =
      rect.height > safeRect.height
        ? rect.bottom >= safeRect.top && rect.top <= safeRect.bottom
        : rect.top >= safeRect.top && rect.bottom <= safeRect.bottom;
    return hasHorizontalPresence && hasVerticalPresence;
  };

  const isTargetInsideViewport = (target: HTMLElement): boolean => {
    const safeRect = getTargetSafeRect(null, target);
    const rect = target.getBoundingClientRect();
    const hasHorizontalPresence =
      rect.width > safeRect.width
        ? rect.right >= safeRect.left && rect.left <= safeRect.right
        : rect.left >= safeRect.left && rect.right <= safeRect.right;
    const hasVerticalPresence =
      rect.height > safeRect.height
        ? rect.bottom >= safeRect.top && rect.top <= safeRect.bottom
        : rect.top >= safeRect.top && rect.bottom <= safeRect.bottom;
    return hasHorizontalPresence && hasVerticalPresence;
  };

  const getScrollParent = (element: HTMLElement): HTMLElement | null => {
    const doc = getDoc();
    let current = element.parentElement;
    while (current && current !== doc.body) {
      const style = getWin().getComputedStyle(current);
      const overflowY = style.overflowY;
      const canScroll = /(auto|scroll|overlay)/.test(overflowY) && current.scrollHeight > current.clientHeight + 1;
      if (canScroll) return current;
      current = current.parentElement;
    }
    return (doc.scrollingElement as HTMLElement | null) || doc.documentElement;
  };

  const scrollElementBy = (element: HTMLElement, deltaY: number): boolean => {
    const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
    const nextScrollTop = clamp(element.scrollTop + deltaY, 0, maxScrollTop);
    if (Math.abs(nextScrollTop - element.scrollTop) < 1) return false;
    element.scrollTop = nextScrollTop;
    return true;
  };

  const scrollTargetIntoSafeRect = (target: HTMLElement, avoidPopover: boolean): boolean => {
    const safeRect = getTargetSafeRect(avoidPopover ? getCurrentPopoverRect() : null, target);
    const rect = target.getBoundingClientRect();
    let deltaY = 0;

    if (rect.height > safeRect.height) {
      if (rect.top > safeRect.top) {
        deltaY = rect.top - safeRect.top;
      } else if (rect.bottom < safeRect.bottom) {
        deltaY = rect.bottom - safeRect.bottom;
      }
    } else if (rect.top < safeRect.top) {
      deltaY = rect.top - safeRect.top;
    } else if (rect.bottom > safeRect.bottom) {
      deltaY = rect.bottom - safeRect.bottom;
    }

    if (Math.abs(deltaY) < 1) return false;
    const scrollParent = getScrollParent(target);
    if (scrollParent && scrollElementBy(scrollParent, deltaY)) return true;
    target.scrollIntoView({ block: 'center', inline: 'nearest' });
    return true;
  };

  const scheduleTargetIntoView = (): void => {
    if (!activeTutorial) return;
    const win = getWin();
    if (scrollRaf !== null) {
      win.cancelAnimationFrame(scrollRaf);
      scrollRaf = null;
    }

    const tutorial = activeTutorial;
    const index = tutorial.index;
    const target = findTarget(tutorial, index);
    if (!target) {
      requestReposition();
      return;
    }

    const mobile = isMobileTutorialViewport();
    const targetAlreadyVisible = mobile ? isTargetComfortablyVisible(target) : isTargetInsideViewport(target);
    if (targetAlreadyVisible) {
      requestReposition();
      return;
    }

    scrollTargetIntoSafeRect(target, mobile);
    scrollRaf = win.requestAnimationFrame(() => {
      scrollRaf = win.requestAnimationFrame(() => {
        scrollRaf = null;
        if (activeTutorial === tutorial && activeTutorial.index === index) requestReposition();
      });
    });
  };

  function positionElements(): void {
    if (!activeTutorial || !highlight || !popover) return;
    const step = activeTutorial.steps[activeTutorial.index];
    currentTarget = step ? findTarget(activeTutorial, activeTutorial.index) : null;
    const viewport = getViewportRect();
    const mobile = isMobileTutorialViewport();
    if (mobile) {
      const mobileMaxHeight = Math.max(160, Math.min(360, viewport.height * 0.42));
      popover.style.setProperty('--acu-tutorial-mobile-max-height', `${Math.round(mobileMaxHeight)}px`);
    } else {
      popover.style.removeProperty('--acu-tutorial-mobile-max-height');
    }

    const targetRect =
      currentTarget?.getBoundingClientRect() ||
      new DOMRect(viewport.left + viewport.width / 2 - 1, viewport.top + viewport.height / 2 - 1, 2, 2);
    const padding = currentTarget ? (mobile ? 4 : 6) : 0;
    let highlightLeft = currentTarget ? Math.max(viewport.left + 8, targetRect.left - padding) : 0;
    let highlightTop = currentTarget ? Math.max(viewport.top + 8, targetRect.top - padding) : 0;
    let highlightRight = currentTarget ? targetRect.right + padding : 0;
    let highlightBottom = currentTarget ? targetRect.bottom + padding : 0;

    const popoverRect = popover.getBoundingClientRect();
    const position = mobile
      ? currentTarget
        ? getMobilePopoverPosition(targetRect, popoverRect)
        : getPopoverPosition(targetRect, popoverRect, 'center')
      : getPopoverPosition(targetRect, popoverRect, step?.placement || 'bottom');
    if (currentTarget) {
      const futurePopoverRect: TutorialRect = {
        left: position.left,
        top: position.top,
        right: position.left + popoverRect.width,
        bottom: position.top + popoverRect.height,
        width: popoverRect.width,
        height: popoverRect.height,
      };
      const safeRect = getTargetSafeRect(mobile ? futurePopoverRect : null, currentTarget);
      highlightLeft = clamp(highlightLeft, safeRect.left, safeRect.right);
      highlightTop = clamp(highlightTop, safeRect.top, safeRect.bottom);
      highlightRight = clamp(highlightRight, safeRect.left, safeRect.right);
      highlightBottom = clamp(highlightBottom, safeRect.top, safeRect.bottom);
    }

    const highlightWidth = Math.max(0, highlightRight - highlightLeft);
    const highlightHeight = Math.max(0, highlightBottom - highlightTop);
    const showHighlight = Boolean(currentTarget) && highlightWidth >= 2 && highlightHeight >= 2;

    highlight.style.transform = `translate3d(${Math.round(highlightLeft)}px, ${Math.round(highlightTop)}px, 0)`;
    highlight.style.width = `${Math.round(highlightWidth)}px`;
    highlight.style.height = `${Math.round(highlightHeight)}px`;
    highlight.style.opacity = showHighlight ? '1' : '0';
    positionMask({
      left: highlightLeft,
      top: highlightTop,
      width: highlightWidth,
      height: highlightHeight,
      visible: showHighlight,
      viewport,
    });
    popover.style.left = `${Math.round(position.left)}px`;
    popover.style.top = `${Math.round(position.top)}px`;
    popover.style.visibility = 'visible';
  }

  const positionMask = (rect: {
    left: number;
    top: number;
    width: number;
    height: number;
    visible: boolean;
    viewport: TutorialViewport;
  }): void => {
    if (!maskSvg || !maskPath) return;
    const viewportWidth = Math.max(0, Math.round(rect.viewport.width));
    const viewportHeight = Math.max(0, Math.round(rect.viewport.height));
    maskSvg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
    maskSvg.setAttribute('width', `${viewportWidth}`);
    maskSvg.setAttribute('height', `${viewportHeight}`);

    const outerPath = `M0 0H${viewportWidth}V${viewportHeight}H0Z`;
    if (!rect.visible) {
      maskPath.setAttribute('d', outerPath);
      return;
    }

    const relativeLeft = rect.left - rect.viewport.left;
    const relativeTop = rect.top - rect.viewport.top;
    const left = Math.round(clamp(relativeLeft, 0, viewportWidth));
    const top = Math.round(clamp(relativeTop, 0, viewportHeight));
    const right = Math.round(clamp(relativeLeft + rect.width, 0, viewportWidth));
    const bottom = Math.round(clamp(relativeTop + rect.height, 0, viewportHeight));
    maskPath.setAttribute('d', `${outerPath}M${left} ${top}H${right}V${bottom}H${left}Z`);
  };

  const getVisibleStep = (tutorial: ActiveTutorial, direction: 1 | -1): number => {
    if (tutorial.visibleIndexes.length > 0) {
      if (direction === 1) {
        return tutorial.visibleIndexes.find(index => index >= tutorial.index) ?? -1;
      }
      for (let i = tutorial.visibleIndexes.length - 1; i >= 0; i -= 1) {
        const index = tutorial.visibleIndexes[i];
        if (index <= tutorial.index) return index;
      }
      return -1;
    }

    let index = tutorial.index;
    while (index >= 0 && index < tutorial.steps.length) {
      const step = tutorial.steps[index];
      if (!step.selector || findTarget(tutorial, index)) return index;
      index += direction;
    }
    return -1;
  };

  const hasVisibleStep = (tutorial: ActiveTutorial, direction: 1 | -1): boolean => {
    if (tutorial.visibleIndexes.length > 0) {
      return tutorial.visibleIndexes.some(index => (direction === 1 ? index > tutorial.index : index < tutorial.index));
    }

    let index = tutorial.index + direction;
    while (index >= 0 && index < tutorial.steps.length) {
      const step = tutorial.steps[index];
      if (!step.selector || findTarget(tutorial, index)) return true;
      index += direction;
    }
    return false;
  };

  const collectVisibleIndexes = (tutorial: ActiveTutorial): number[] =>
    tutorial.steps.reduce<number[]>((indexes, step, index) => {
      if (!step.selector || findTarget(tutorial, index)) indexes.push(index);
      return indexes;
    }, []);

  const completeActiveScope = (): void => {
    if (!activeTutorial) return;
    saveState(markCompleted(getState(), activeTutorial.scope));
  };

  const closeInternal = (complete: boolean): void => {
    if (complete) completeActiveScope();
    removeListeners();
    if (repositionRaf !== null) {
      getWin().cancelAnimationFrame(repositionRaf);
      repositionRaf = null;
    }
    if (scrollRaf !== null) {
      getWin().cancelAnimationFrame(scrollRaf);
      scrollRaf = null;
    }
    overlay?.remove();
    overlay = null;
    blocker = null;
    highlight = null;
    popover = null;
    maskSvg = null;
    maskPath = null;
    currentTarget = null;
    activeTutorial = null;
  };

  const render = (): void => {
    if (!activeTutorial || !popover) return;
    const step = activeTutorial.steps[activeTutorial.index];
    const isFirst = activeTutorial.index <= 0;
    const isLast = !hasVisibleStep(activeTutorial, 1);
    const nextText = isLast ? '完成' : '下一步';

    popover.innerHTML = `
      <div class="acu-tutorial-head">
        <i class="fa-solid fa-circle-question"></i>
        <span>${escapeHtml(step.title)}</span>
      </div>
      <div class="acu-tutorial-body">
        <div>${escapeHtml(step.content)}</div>
        <div class="acu-tutorial-progress">${activeTutorial.index + 1} / ${activeTutorial.steps.length}</div>
      </div>
      <div class="acu-tutorial-actions">
        <button class="acu-tutorial-btn" data-action="prev" ${isFirst ? 'disabled' : ''}>上一步</button>
        <button class="acu-tutorial-btn ghost" data-action="skip">跳过</button>
        <button class="acu-tutorial-btn ghost" data-action="never">不再显示</button>
        <button class="acu-tutorial-btn primary" data-action="next">${nextText}</button>
      </div>
    `;
    scheduleTargetIntoView();
  };

  const goTo = (direction: 1 | -1): void => {
    if (!activeTutorial) return;
    if (direction === -1) {
      if (activeTutorial.index <= 0) return;
      activeTutorial.index -= 1;
      render();
      return;
    }

    activeTutorial.index += direction;
    const nextIndex = getVisibleStep(activeTutorial, direction);
    if (nextIndex === -1) {
      closeInternal(true);
      return;
    }
    activeTutorial.index = nextIndex;
    render();
  };

  const getActionTarget = (target: EventTarget | null): HTMLElement | null => {
    if (!target) return null;
    const win = getWin();
    const element =
      target instanceof win.Element
        ? target
        : target instanceof win.Node
          ? target.parentElement
          : null;
    const actionTarget = element?.closest('[data-action]');
    return actionTarget instanceof win.HTMLElement ? actionTarget : null;
  };

  const runAction = (action: TutorialAction): void => {
    if (action === 'prev') {
      goTo(-1);
    } else if (action === 'next') {
      goTo(1);
    } else if (action === 'skip') {
      closeInternal(true);
    } else if (action === 'never') {
      saveState({ ...markCompleted(getState(), activeTutorial?.scope || 'core'), disabled: true });
      closeInternal(false);
    }
  };

  const handleOverlayAction = (event: Event): void => {
    const actionTarget = getActionTarget(event.target);
    if (!actionTarget) return;
    if (actionTarget instanceof getWin().HTMLButtonElement && actionTarget.disabled) return;

    const action = actionTarget.dataset.action;
    if (!isTutorialAction(action)) return;

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - lastActionHandledAt < 350) return;
    lastActionHandledAt = now;
    runAction(action);
  };

  const bindOverlayEvents = (): void => {
    if (!overlay) return;
    overlay.addEventListener('touchend', handleOverlayAction, { passive: false });
    overlay.addEventListener('click', handleOverlayAction);
  };

  const createOverlay = (): void => {
    const doc = getDoc();
    const svgNamespace = 'http://www.w3.org/2000/svg';
    overlay = doc.createElement('div');
    overlay.className = `${OVERLAY_CLASS} acu-theme-${options.getTheme()}`;
    blocker = doc.createElement('div');
    blocker.className = 'acu-tutorial-blocker';
    maskSvg = doc.createElementNS(svgNamespace, 'svg');
    maskSvg.classList.add('acu-tutorial-mask');
    maskSvg.setAttribute('aria-hidden', 'true');
    maskPath = doc.createElementNS(svgNamespace, 'path');
    maskPath.setAttribute('fill-rule', 'evenodd');
    maskSvg.appendChild(maskPath);
    highlight = doc.createElement('div');
    highlight.className = 'acu-tutorial-highlight';
    popover = doc.createElement('div');
    popover.className = 'acu-tutorial-popover';
    popover.style.visibility = 'hidden';
    overlay.append(blocker, maskSvg, highlight, popover);
    doc.body.appendChild(overlay);
    bindOverlayEvents();
  };

  const addListeners = (): void => {
    const win = getWin();
    const doc = getDoc();
    win.addEventListener('resize', requestReposition, { passive: true });
    win.addEventListener('scroll', requestReposition, { passive: true });
    win.visualViewport?.addEventListener('resize', requestReposition, { passive: true });
    win.visualViewport?.addEventListener('scroll', requestReposition, { passive: true });
    blockedEventNames.forEach(eventName => {
      doc.addEventListener(eventName, blockOutsideTutorialEvent, { capture: true, passive: false });
    });
  };

  const start = (scope: TutorialScope, optionsOverride: StartOptions = {}): void => {
    const manual = optionsOverride.manual === true;
    const completeWhenMissing = optionsOverride.completeWhenMissing === true;
    const interrupt = optionsOverride.interrupt === true || manual;
    const steps = STEPS[scope] || [];
    if (steps.length === 0) return;

    if (activeTutorial && !interrupt) return;

    if (!manual) {
      const state = getState();
      if (state.disabled || hasCompleted(state, scope)) return;
    }

    closeInternal(false);
    injectStyles();
    activeTutorial = {
      scope,
      steps,
      index: 0,
      manual,
      visibleIndexes: [],
      targetCache: new Map<number, HTMLElement | null>(),
      initialTarget: optionsOverride.target,
    };
    activeTutorial.visibleIndexes = collectVisibleIndexes(activeTutorial);
    const firstIndex = activeTutorial.visibleIndexes[0] ?? -1;
    if (firstIndex === -1) {
      if (!manual && completeWhenMissing) saveState(markCompleted(getState(), scope));
      activeTutorial = null;
      return;
    }

    activeTutorial.index = firstIndex;
    createOverlay();
    addListeners();
    render();
  };

  const maybeStart = (
    scope: TutorialScope,
    optionsOverride: { target?: HTMLElement; interrupt?: boolean } = {},
  ): void => {
    const maxAttempts = 6;
    const intervalMs = 160;
    let attempts = 0;
    const attemptStart = (): void => {
      if (activeTutorial && optionsOverride.interrupt !== true) return;
      const state = getState();
      if (state.disabled || hasCompleted(state, scope)) return;

      attempts += 1;
      const tutorial: ActiveTutorial = {
        scope,
        steps: STEPS[scope] || [],
        index: 0,
        manual: false,
        visibleIndexes: [],
        targetCache: new Map<number, HTMLElement | null>(),
        initialTarget: optionsOverride.target,
      };
      tutorial.visibleIndexes = collectVisibleIndexes(tutorial);
      if (tutorial.visibleIndexes.length > 0) {
        start(scope, optionsOverride);
        return;
      }
      if (attempts < maxAttempts) {
        getWin().setTimeout(attemptStart, intervalMs);
      }
    };
    getWin().setTimeout(attemptStart, intervalMs);
  };

  return {
    maybeStart,
    start,
    close: () => closeInternal(false),
    isDisabled: () => getState().disabled,
  };
};
