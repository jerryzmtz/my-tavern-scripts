# AcuDice API 文档

AcuDice 是骰子系统对外暴露的公共 API，允许其他插件和角色卡前端界面调用骰子投掷和检定功能。

## 快速开始

```javascript
// 骰子投掷
const result = AcuDice.roll('2d6+3');
console.log(result.total); // 例如: 9

// 属性检定（COC 规则）
const check = await AcuDice.check({
  attribute: '力量',
  targetValue: 50,
});
console.log(check.success); // true 或 false
console.log(check.message); // "成功！掷出 35 <= 50"
```

## API 参考

### `AcuDice.version`

**类型**: `string`

当前 API 版本号。

```javascript
console.log(AcuDice.version); // "1.2.0"
```

---

### `AcuDice.roll(formula)`

执行骰子投掷，同步返回结果。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `formula` | `string` | 是 | 骰子表达式 |

**支持的表达式格式**:

- 基础骰子: `1d6`, `2d10`, `1d20`, `1d100`
- 带修正值: `1d20+5`, `2d6-2`, `3d6*5`
- 保留最高: `4d6kh3` (投4个d6，保留最高3个)
- 保留最低: `4d6kl3` (投4个d6，保留最低3个)
- 丢弃最高: `4d6dh1` (投4个d6，丢弃最高1个)
- 丢弃最低: `4d6dl1` (投4个d6，丢弃最低1个)
- 复合表达式: `2d6+1d4+3`

**返回值**:

```typescript
{
  total: number; // 最终结果
  formula: string; // 原始表达式
  breakdown: string; // 计算过程描述
}
```

**示例**:

```javascript
// 基础投掷
AcuDice.roll('2d6');
// => { total: 7, formula: '2d6', breakdown: '2d6 = 7' }

// 带修正值
AcuDice.roll('1d20+5');
// => { total: 18, formula: '1d20+5', breakdown: '1d20+5 = 18' }

// D&D 属性生成 (4d6取最高3个)
AcuDice.roll('4d6kh3');
// => { total: 14, formula: '4d6kh3', breakdown: '4d6kh3 = 14' }
```

**错误处理**:

```javascript
try {
  AcuDice.roll('invalid');
} catch (error) {
  console.error(error.message);
  // "[AcuDice] roll() 需要一个有效的骰子表达式字符串"
}
```

---

### `AcuDice.check(options)`

执行属性或技能检定，异步返回结果。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `options.attribute` | `string` | 否*
| 属性名称（如"力量"、"敏捷"） | | `options.skill` | `string` | 否* | 技能名称（如"侦查"、"聆听"） | |
`options.targetValue` | `number` | 否\* | 目标值/难度等级 | | `options.diceType` | `string`
| 否 | 骰子类型，默认为系统配置（通常是"1d100"） | | `options.successCriteria` | `'lte' \| 'gte'`
| 否 | 成功判定规则，默认根据骰子类型自动选择 | | `options.modifier` | `number` | 否 | 额外修正值 |

> \*注意: 必须提供 `targetValue`，或者提供 `attribute`/`skill` 名称（系统会自动从角色数据中查找对应数值）

**成功判定规则**:

- `'lte'` (小于等于): COC 规则，掷出 ≤ 目标值为成功
- `'gte'` (大于等于): DND 规则，掷出 ≥ 目标值(DC)为成功

**返回值**:

```typescript
{
  success: boolean; // 是否成功
  roll: number; // 掷骰结果（含修正值）
  target: number; // 目标值
  margin: number; // 成功/失败幅度
  criticalSuccess: boolean; // 是否大成功
  criticalFailure: boolean; // 是否大失败
  message: string; // 可读的结果描述
  diceType: string; // 使用的骰子类型
  rule: 'coc' | 'dnd'; // 使用的规则类型
}
```

**示例**:

```javascript
// COC 规则检定 (1d100，小于等于目标值成功)
const cocCheck = await AcuDice.check({
  attribute: '力量',
  targetValue: 50,
  diceType: '1d100',
});
// => {
//   success: true,
//   roll: 35,
//   target: 50,
//   margin: 15,
//   criticalSuccess: false,
//   criticalFailure: false,
//   message: "成功！掷出 35 <= 50",
//   diceType: "1d100",
//   rule: "coc"
// }

// DND 规则检定 (1d20，大于等于DC成功)
const dndCheck = await AcuDice.check({
  attribute: '力量',
  targetValue: 15,
  diceType: '1d20',
  modifier: 3,
  successCriteria: 'gte',
});
// => {
//   success: true,
//   roll: 18,
//   target: 15,
//   margin: 3,
//   criticalSuccess: false,
//   criticalFailure: false,
//   message: "成功！掷出 18 >= DC 15",
//   diceType: "1d20",
//   rule: "dnd"
// }

// 自动从角色数据获取属性值
const autoCheck = await AcuDice.check({
  attribute: '侦查',
});
// 系统会自动查找角色的"侦查"技能值作为目标值
```

**COC 规则特殊判定**:

- **大成功**: 掷出 1-5
- **困难成功**: 掷出 ≤ 目标值/2
- **极难成功**: 掷出 ≤ 目标值/5
- **大失败**: 掷出 96-100

**DND 规则特殊判定**:

- **大成功**: 掷出 20 (Natural 20)
- **大失败**: 掷出 1 (Natural 1)

---

### `AcuDice.onReady(callback)`

注册 API 就绪回调。如果 API 已加载完成，回调会立即执行。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `callback` | `() => void` | 是 | 回调函数 |

**示例**:

```javascript
AcuDice.onReady(() => {
  console.log('AcuDice API 已就绪');
  // 在这里执行依赖 AcuDice 的初始化代码
});
```

---

### `AcuDice.on(event, handler)` / `AcuDice.off(event, handler)`

订阅/取消订阅检定事件。

**支持的事件**:

- `'check'`: 普通检定完成时触发
- `'contest'`: 对抗检定完成时触发
- `'effect_run'`: 效果执行完成时触发

**示例**:

```javascript
// 订阅普通检定事件
AcuDice.on('check', result => {
  console.log('检定结果:', result.outcomeText);
  console.log('属性:', result.attrName, '掷骰:', result.total, '目标:', result.target);
  // v1.2.0: 可获取结果分级信息
  if (result.outcomeId) {
    console.log('结果分级:', result.outcomeName);
  }
});

// 订阅效果执行事件
AcuDice.on('effect_run', event => {
  console.log('效果执行:', event.status, event.characterName, event.attributeName);
  console.log('执行结果:', event.effectResults);
});

// 订阅对抗检定事件
AcuDice.on('contest', result => {
  console.log('对抗胜者:', result.winner);
});

// 取消订阅
const handler = result => console.log(result);
AcuDice.on('check', handler);
AcuDice.off('check', handler);
```

---

### `AcuDice.getLatestCheck()`

返回最近一次普通检定结果。

**返回值**: `CheckHistoryItem | null`

---

### `AcuDice.getLatestContest()`

返回最近一次对抗检定结果。

**返回值**: `(ContestResult & { timestamp: number }) | null`

---

### `AcuDice.getHistory(options)`

返回历史记录列表。每个条目包含 `historyType` 字段（'check' 或 'contest'）用于区分。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `options.limit` | `number`
| 否 | 返回条目数量限制 | | `options.type` | `'check' \| 'contest'` | 否 | 过滤记录类型 |

**示例**:

```javascript
const history = AcuDice.getHistory({ limit: 10 });
history.forEach(item => {
  if (item.historyType === 'check' || item._type === 'check') {
    console.log(`检定: ${item.attrName} → ${item.outcomeText}`);
  } else {
    console.log(`对抗: ${item.winner} 获胜`);
  }
});
```

---

### `AcuDice.listCharacters()`

返回所有可用角色名列表。

**返回值**: `string[]`

---

### `AcuDice.getCharacterAttributes(name)`

返回指定角色的所有属性。

**参数**: `name` (角色名) **返回值**: `Array<{ name: string; value: number }>`

---

### `AcuDice.getAttributeValue(name, attribute)`

返回指定角色的指定属性值。

**参数**: `name` (角色名), `attribute` (属性名) **返回值**: `number | null`

---

### `AcuDice.checkByCharacter(options)`

按角色名和属性名进行检定。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `options.name` | `string` | 是 | 角色名称 | |
`options.attribute` | `string` | 是 | 属性/技能名称 | | `options.modifier` | `number` | 否 | 额外修正值 |

---

### `AcuDice.contest(options)`

执行对抗检定。

**参数**: | 参数 | 类型 | 必需 | 说明 | |------|------|------|------| | `options.left` | `object` | 是 | 发起方/左侧（含
`name`, `attribute`, 可选 `targetValue`） | | `options.right` | `object` | 是 | 被动方/右侧（含 `name`,
`attribute`, 可选 `targetValue`） | | `options.rule` | `string` | 否 | 平局处理规则：`initiator_win`, `initiator_lose`,
`tie` |

> **注意**: `attacker` 和 `defender` 参数在 v1.2.0 中已弃用，建议迁移到 `left` 和 `right`。
>
> 每个参与者可提供 `targetValue` 直接指定目标值，或省略 `targetValue` 让系统从角色数据中自动查找。

**示例**:

```javascript
// 从角色数据自动获取属性值
const result = await AcuDice.contest({
  left: { name: '莉莉', attribute: '敏捷' },
  right: { name: '警卫', attribute: '侦查' },
  rule: 'initiator_win', // 平局时发起方胜
});

console.log(`${result.left.name} 掷出 ${result.left.roll}, 胜者: ${result.winner}`);

// 直接指定目标值（无需角色数据）
const result2 = await AcuDice.contest({
  left: { name: '玩家', attribute: '力量', targetValue: 50 },
  right: { name: '敌人', attribute: '力量', targetValue: 40 },
});
```

---

### `AcuDice.listPresets()`

返回所有可用骰子预设的摘要列表。

**返回值**: `PresetSummary[]`

**示例**:

```javascript
const presets = AcuDice.listPresets();
presets.forEach(p => {
  console.log(`${p.name} (${p.id}): ${p.description}, 内置: ${p.builtin}`);
});
```

---

### `AcuDice.getPresetSummary(id)`

返回指定 ID 的预设摘要信息。

**参数**: `id` (string) - 预设 ID **返回值**: `PresetSummary | null`

**示例**:

```javascript
const preset = AcuDice.getPresetSummary('__builtin_default__');
if (preset) {
  console.log(`预设: ${preset.name}`);
  console.log(`描述: ${preset.description}`);
  console.log(`内置: ${preset.builtin}`);
}
```

---

### `AcuDice.getActivePresetId()`

返回当前正在使用的预设 ID。

**返回值**: `string | null`

**示例**:

```javascript
const activeId = AcuDice.getActivePresetId();
if (activeId) {
  const preset = AcuDice.getPresetSummary(activeId);
  console.log('激活预设:', preset?.name);
}
```

---

## 类型定义

```typescript
interface RollResult {
  total: number;
  formula: string;
  breakdown: string;
}

interface CheckOptions {
  attribute?: string;
  skill?: string;
  targetValue?: number;
  diceType?: string;
  successCriteria?: 'lte' | 'gte';
  modifier?: number;
}

interface CheckResult {
  success: boolean;
  roll: number;
  target: number;
  margin: number;
  criticalSuccess: boolean;
  criticalFailure: boolean;
  message: string;
  diceType: string;
  rule: 'coc' | 'dnd';
}

interface CheckHistoryItem {
  success: boolean;
  total: number;
  target: number;
  outcomeText: string;
  attrName: string;
  formula: string;
  criteria: string;
  isAutoTarget: boolean;
  // v1.2.0 结果分级
  outcomeId?: string;
  outcomeName?: string;
  presetId?: string;
  // 元数据
  timestamp: number;
  detailId: string;
  initiatorName: string;
  historyType: 'check';
  detailLines: string[];
  isPushed?: boolean;
}

interface ContestResult {
  left: ContestParticipant;
  right: ContestParticipant;
  winner: 'left' | 'right' | 'tie';
  message: string;
}

interface ContestParticipant {
  name: string;
  attribute: string;
  roll: number;
  target: number;
  successLevel: number;
}

interface ContestHistoryItem extends ContestResult {
  timestamp: number;
  detailId: string;
  detailLines: string[];
}

interface ContestOptions {
  left?: { name: string; attribute: string; targetValue?: number };
  right?: { name: string; attribute: string; targetValue?: number };
  rule?: 'initiator_win' | 'initiator_lose' | 'tie';
  /** @deprecated 使用 left 替代 */
  attacker?: { name: string; attribute: string; targetValue?: number };
  /** @deprecated 使用 right 替代 */
  defender?: { name: string; attribute: string; targetValue?: number };
}

interface PresetSummary {
  id: string;
  name: string;
  description?: string;
  builtin: boolean;
}

interface EffectRunEvent {
  seq: number;
  runId: string;
  status: 'planned' | 'confirmed' | 'committed' | 'failed' | 'cancelled';
  characterName: string;
  attributeName: string;
  historyIndex: number;
  effectResults: EffectExecutionResult[];
  effectTrace: string[];
  chainMode?: 'first' | 'all';
  error?: string;
  timestamp: number;
}

interface EffectExecutionResult {
  effectId: string;
  success: boolean;
  oldValue: number;
  newValue: number;
  error?: string;
  target?: string;
  level?: number;
  triggerSourceId?: string;
  triggerThreshold?: number;
  triggerType?: 'threshold' | 'delta' | 'primary';
  triggerMatchIndex?: number;
  triggerMatchCount?: number;
}

interface HistoryOptions {
  limit?: number;
  type?: 'check' | 'contest';
}

interface AcuDiceAPI {
  version: string;
  roll(formula: string): RollResult;
  check(options?: CheckOptions): Promise<CheckResult>;
  onReady(callback: () => void): void;
  on(event: 'check', handler: (result: CheckHistoryItem) => void): void;
  on(event: 'contest', handler: (result: ContestResult) => void): void;
  on(event: 'effect_run', handler: (result: EffectRunEvent) => void): void;
  off(event: 'check', handler: (result: CheckHistoryItem) => void): void;
  off(event: 'contest', handler: (result: ContestResult) => void): void;
  off(event: 'effect_run', handler: (result: EffectRunEvent) => void): void;

  getLatestCheck(): CheckHistoryItem | null;
  getLatestContest(): (ContestResult & { timestamp: number }) | null;
  getHistory(options?: HistoryOptions): Array<CheckHistoryItem | ContestHistoryItem>;
  listCharacters(): string[];
  getCharacterAttributes(name: string): Array<{ name: string; value: number }>;
  getAttributeValue(name: string, attribute: string): number | null;
  checkByCharacter(options: { name: string; attribute: string; modifier?: number }): Promise<CheckResult>;
  contest(options: ContestOptions): Promise<ContestResult>;

  // v1.2.0
  listPresets(): PresetSummary[];
  getPresetSummary(id: string): PresetSummary | null;
  getActivePresetId(): string | null;
}

declare global {
  interface Window {
    AcuDice: AcuDiceAPI;
  }
}
```

---

## 错误处理

### 常见错误

| 错误信息                                                 | 原因                             | 解决方案                                   |
| -------------------------------------------------------- | -------------------------------- | ------------------------------------------ |
| `roll() 需要一个有效的骰子表达式字符串`                  | 传入了空值或非字符串             | 确保传入有效的骰子表达式                   |
| `无效的骰子表达式`                                       | 表达式格式不正确                 | 检查表达式格式，如 `2d6`、`1d20+5`         |
| `未找到属性或技能`                                       | 指定的属性在角色数据中不存在     | 确认属性名称正确，或直接提供 `targetValue` |
| `check() 需要 targetValue 或有效的 attribute/skill 名称` | 既没有提供目标值也没有提供属性名 | 提供其中一个参数                           |

### 错误处理示例

```javascript
// 骰子投掷错误处理
try {
  const result = AcuDice.roll(userInput);
  console.log('结果:', result.total);
} catch (error) {
  console.error('投掷失败:', error.message);
}

// 检定错误处理
try {
  const check = await AcuDice.check({ attribute: '未知属性' });
} catch (error) {
  console.error('检定失败:', error.message);
  // 回退方案：使用默认值
  const fallbackCheck = await AcuDice.check({ targetValue: 50 });
}
```

---

## 使用示例

### 在角色卡前端界面中使用

```javascript
// 在角色卡的 iframe 中调用
$(() => {
  // 等待 API 就绪
  if (typeof window.AcuDice !== 'undefined') {
    initDiceUI();
  } else {
    // 如果 API 尚未加载，等待一段时间后重试
    const checkInterval = setInterval(() => {
      if (typeof window.AcuDice !== 'undefined') {
        clearInterval(checkInterval);
        initDiceUI();
      }
    }, 100);
  }
});

function initDiceUI() {
  // 绑定投掷按钮
  $('#roll-button').on('click', () => {
    const formula = $('#dice-input').val();
    try {
      const result = AcuDice.roll(formula);
      $('#result').text(`${result.breakdown}`);
    } catch (e) {
      $('#result').text(`错误: ${e.message}`);
    }
  });

  // 绑定检定按钮
  $('#check-button').on('click', async () => {
    const attr = $('#attr-select').val();
    try {
      const result = await AcuDice.check({ attribute: attr });
      $('#check-result').html(`
        <div class="${result.success ? 'success' : 'fail'}">
          ${result.message}
        </div>
      `);
    } catch (e) {
      $('#check-result').text(`错误: ${e.message}`);
    }
  });
}
```

### 在其他插件脚本中使用

```javascript
// 在酒馆助手脚本中调用
$(() => {
  // 监听特定消息并自动投骰
  eventOn(tavern_events.MESSAGE_RECEIVED, async message => {
    if (message.includes('[投骰]')) {
      const match = message.match(/\[投骰:(\d+d\d+[^]]*)\]/);
      if (match) {
        const result = AcuDice.roll(match[1]);
        // 将结果写入变量或发送消息
        console.log(`自动投骰: ${result.breakdown}`);
      }
    }
  });
});
```

---

## 与其他插件集成

### 全局暴露规则

- 骰子系统加载后会挂载到当前 iframe 的 `window.AcuDice`
- 同源情况下也会挂载到 `window.top.AcuDice`
- 同时会向 `window` 和 `window.top`（同源时）派发 `acudice:ready` 事件

### 从其他 iframe 调用

由于骰子系统和其他插件可能在不同的 iframe 中运行，推荐使用 `window.top.AcuDice`（同源）：

```javascript
// 在其他 iframe 中访问 AcuDice（同源）
const AcuDice = window.top?.AcuDice || window.AcuDice;

if (AcuDice) {
  const result = AcuDice.roll('1d20');
  console.log(result);
} else {
  console.warn('AcuDice API 不可用');
}
```

如果需要等待初始化完成，监听 ready 事件：

```javascript
window.addEventListener(
  'acudice:ready',
  () => {
    const AcuDice = window.top?.AcuDice || window.AcuDice;
    if (AcuDice) {
      console.log(AcuDice.roll('2d6'));
    }
  },
  { once: true },
);
```

### 检查 API 可用性

```javascript
function isAcuDiceAvailable() {
  return typeof window.AcuDice !== 'undefined' || typeof window.top?.AcuDice !== 'undefined';
}

function getAcuDice() {
  return window.top?.AcuDice || window.AcuDice;
}
```

---

## 更新日志

### v1.2.0 (2026-02-08)

- ✨ 新增预设系统查询 API (`listPresets`, `getPresetSummary`, `getActivePresetId`)
- ✨ 新增 `effect_run` 事件订阅
- ✨ 检定历史记录(`CheckHistoryItem`)现包含结果分级信息（`outcomeId`, `outcomeName`, `presetId`）
- ✨ 检定历史记录新增孤注一掷标记（`isPushed`）
- 🔄 对抗检定参数从 `attacker/defender` 迁移到 `left/right`（旧参数仍兼容）
- ✨ 对抗检定支持 `targetValue` 直接指定目标值（无需角色数据）
- 🔄 `on('check')` 事件回调参数类型从 `CheckResult` 变更为 `CheckHistoryItem`
- 🛠️ `getHistory()` 返回类型细化为 `Array<CheckHistoryItem | ContestHistoryItem>`
- 🛠️ `getCharacterAttributes()` 返回类型修正为 `Array<{ name: string; value: number }>`
- 🛠️ `getAttributeValue()` 返回类型修正为 `number | null`
- 🐛 修复 `check()` API 调用不写入历史记录和不触发 `on('check')` 事件的问题
- 🐛 修复 `contest()` 内部 `getSuccessLevel` 作用域错误导致崩溃的问题
- 🐛 修复 `roll()` 对无效表达式不抛出错误的问题

### v1.1.0 (2026-01-24)

- ✨ 新增历史查询 API (`getLatestCheck`, `getLatestContest`, `getHistory`)
- ✨ 新增角色属性查询 API (`listCharacters`, `getCharacterAttributes`, `getAttributeValue`)
- ✨ 新增便捷检定 API (`checkByCharacter`, `contest`)
- ✅ 实现 `on()`/`off()` 事件订阅系统
- 🛠️ 优化类型定义

### v1.0.0 (2026-01-23)

- 🎉 初始版本发布
- ✅ `roll()` 方法：支持基础骰子、修正值、keep/drop 语法
- ✅ `check()` 方法：支持 COC/DND 规则检定
- ✅ `onReady()` 方法：初始化回调
- ⏳ `on()`/`off()` 方法：事件系统预留接口
