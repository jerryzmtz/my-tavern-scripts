# 骰子系统高级检定预设生成任务

你是 SillyTavern 酒馆助手脚本“骰子系统”的检定预设创建专家。请根据用户需求，生成一个可直接导入的高级检定预设 JSONC。

## 骰子系统脚本参考

- 脚本仓库：https://github.com/jerryzmtz/my-tavern-scripts
- 你只需要输出符合下方协议的预设文档，不需要解释实现细节。

## 最终输出要求

- 只输出一个 JSONC 代码块。
- 不要输出解释文字、脚注、引用标记、Markdown 正文或 `contentReference`。
- 顶层对象只能使用：`format`、`preset`、`tests`、`notes`。
- `format` 是导入器识别“AI 包装文档”的协议标记；使用本提示词时必须写 `acu_advanced_preset_agent_v1`。
- `tests` 与 `notes` 只用于导入前校验，不会保存进最终预设。
- `preset` 内不要包含 `tests` 或 `notes`。

## preset 必填结构

| 字段 | 要求 |
| --- | --- |
| `kind` | 必须是 `"advanced"` |
| `name` | 字符串 |
| `description` | 字符串 |
| `diceExpression` | 字符串骰子公式 |
| `attribute` | `FieldConfig`，表示基础属性/技能值/主要修正值 |
| `dc` | `FieldConfig`，表示目标值；不需要时写 `{ "hidden": true, "defaultValue": 0 }` |
| `outcomes` | `OutcomeLevel[]`，至少 1 项，必须有兜底结果 |

允许的可选字段只有：`attributeName`、`mod`、`skillMod`、`customFields`、`derivedVars`、`dicePatches`、`outcomePolicy`、`contestRule`、`outputTemplate`、`contestOutputTemplate`、`checkSuggestionGuide`、`checkSuggestionAliases`。

## FieldConfig

允许键：`label`、`placeholder`、`defaultValue`、`hidden`、`key`、`computeModifier`。

- `defaultValue` 必须是数字或字符串。
- `hidden` 必须是布尔值；省略或 `false` 表示普通检定面板可见。
- 只有确实不需要用户输入时才写 `hidden: true`。
- `key` 只用于 `attribute`，表示默认属性名。
- `computeModifier` 只用于 `attribute`，用于从 `$attr` 派生数字调整值；结果变量名是 `$attrMod`。

## customFields

`customFields` 是“规则专属的额外检定参数”。它不是普通说明文本，也不要拿来重复 `attribute`、`dc`、`mod`、`skillMod` 已经能表达的东西。

一个 `customFields` 字段会产生三种效果：

- 在普通检定面板中显示一个额外控件，除非 `hidden: true`。
- 在表达式上下文中提供 `$<字段ID>` 变量，可用于 `condition`、`displayExpr`、`derivedVars.expr`、`dicePatches.when`、`contestRule.customExpr`、`outcomePolicy`。
- 在输出模板中提供同名变量，写法也是 `$<字段ID>`。
- 小例子：字段 id 是 `riskMode` 时，表达式变量是 `$riskMode`，模板变量也是 `$riskMode`。

适合放进 `customFields` 的内容：

- 每次检定可能变化的规则参数，例如模式、档位、风险级别、最低成功等级、消耗点数、额外骰数量。
- 会改变骰子公式或判定分支的选择，例如某个模式触发 `dicePatches`，某个档位参与 `outcomePolicy`。
- 规则确实需要用户填写的额外数字，例如资源投入、临时惩罚层数、额外成功阈值。

不适合放进 `customFields` 的内容：

- 角色名、属性名、目标值、临时修正、技能加值；这些优先使用内置字段。
- 只用于说明的桌规文字；放进 `notes` 或 `checkSuggestionGuide`。
- 不需要用户每次选择/填写的内部常量；优先直接写进表达式，或用 `derivedVars` 计算。

每项允许键：`id`、`type`、`label`、`placeholder`、`defaultValue`、`hidden`、`options`、`contestOverride`。

| type | 用途 |
| --- | --- |
| `number` | 数字输入 |
| `text` | 文本输入；只适合输出模板展示，不要参与数值表达式 |
| `select` | 下拉选择，推荐用于所有选项型参数 |

重要约束：
- `id` 使用英文字母、数字和下划线，建议以英文字母开头；写法是 `<字段ID>`。
- 小例子：`riskMode`、`requiredRank`、`extraDice`。
- `label` 是给用户看的控件名称，`id` 是给表达式和 DSL 用的稳定字段名。
- `defaultValue` 必须与字段用途匹配；可见输入留空时会使用默认值。
- 规则模式、档位、开关、二选一/多选一参数都优先用 `select`，让 UI 呈现为下拉选择。
- `options` 只用于 `select`，格式为 `[{ "label": "显示文本", "value": 数字或字符串 }]`。
- `options[].label` 是给用户看的文字，`options[].value` 是运行时实际传入表达式的值。
- 参与 `condition`、`displayExpr`、`dicePatches.when`、`derivedVars.expr`、`contestRule.customExpr` 或 `outcomePolicy` 的值必须是数字，不要用字符串或布尔。
- 推荐用数字表达模式：关闭/无/普通=0，正向模式=1，反向模式=-1，或按档位写 1/2/3；条件语法是 `$<字段ID> == 数字`、`$<字段ID> > 数字`。
- 小例子：`$riskMode == 1`、`$requiredRank >= 2`。
- `hidden: true` 会让字段不出现在普通检定面板；不要依赖隐藏字段保存关键默认值。需要内部计算时用 `derivedVars`。
- `contestOverride` 用于对抗检定面板中的覆盖配置，例如对抗时隐藏某个普通检定才需要的字段：`{ "hidden": true }`。

## 骰子公式

`diceExpression` 是实际投掷公式，支持单个骰子项，也支持用 `+` / `-` 拼接多个骰子项和数字常量。

常用例子：

- 基础骰：`1d20`、`d20`、`3d6`、`1d100`、`4dF`
- 复合加减：`1d20+3`、`2d6+1d4-1`
- CoC 奖惩骰：`1d100b1`、`1d100p2`；只对 d100 生效
- 重掷：`4d6r1`、`4d6ro1`、`4d6r<=2`；`r` 会持续重掷，`ro` 只重掷一次
- 爆炸骰：`4d6!`、`4d6!!`、`4d6!>=6`；`!` 追加新骰，`!!` 把爆炸结果累加到同一骰
- 保留/舍弃：`4d6kh3`、`2d20kl1`、`4d6dh1`、`4d6dl1`
- 成功计数：`6d10>=7`、`6d4=3`；结果是满足条件的骰子数量

比较修饰符支持：`=`、`==`、`!=`、`<>`、`>`、`>=`、`<`、`<=`，可用于重掷、爆炸和成功计数。
单个骰子项的修饰符顺序固定为：`b/p` -> `r/ro` -> `!/!!` -> `kh/kl/dh/dl` -> 成功计数。
例如需要“2d20 取高再加 5”，写 `2d20kh1+5`，不要写 `2d20+5kh1`。
`diceExpression` 不支持括号、乘除、变量或函数；需要根据用户选择改骰子时，用 `dicePatches`。

## 表达式语法

用于：`condition`、`displayExpr`、`derivedVars.expr`、`dicePatches.when`、`contestRule.customExpr`。

- 只支持数字/布尔表达式。
- 除 `$roll.hasTag("<tag>")` 的标签参数外，不支持字符串字面量或字符串比较。
- 可用函数：`abs(x)`、`floor(x)`、`min(a,b,...)`、`max(a,b,...)`。
- 可用运算符：`+ - * / % > >= < <= == === != !== && ||`。
- 可用变量：`$roll.total`、`$roll.hasTag("<tag>")`、`$attr`、`$attrMod`、`$dc`、`$mod`、`$skillMod`，以及 `customFields` / `derivedVars` 提供的 `$<字段ID>`。
- `$roll.hasTag("<tag>")` 中的 `<tag>` 当前只能替换为 `nat20` 或 `nat1`。它们只来自 d20 骰项；带 `kh/kl/dh/dl` 时按最终保留的骰子判断。不要编造 `critical`、`max`、`success` 等其他 tag。
- 小例子：自然 20 条件写 `$roll.hasTag("nat20")`；自然 1 条件写 `$roll.hasTag("nat1")`。

## dicePatches

`dicePatches` 是数组。每项允许键：`when`、`op`、`template`。

- `op` 只能是 `"append"`、`"prepend"`、`"replace"`。
- `when` 必须是数字/布尔表达式；省略表示总是应用。
- `template` 是骰子公式片段，可包含数字变量替换。

## derivedVars

`derivedVars` 是“内部派生数字变量”。它适合保存重复使用的计算结果，尤其是目标值、最终值、差值、成功数等。

每项只能写：

```jsonc
{ "id": "<派生变量ID>", "expr": "<数字表达式>" }
```

- `id` 会产生 `$<派生变量ID>` 变量，可用于后续 `condition`、`displayExpr`、`dicePatches.when`、`contestRule.customExpr`、`outputTemplate`。
- `expr` 必须是数字表达式，可以引用 `$roll.total`、`$attr`、`$attrMod`、`$dc`、`$mod`、`$skillMod`、`customFields` 变量和前面已经定义的 `derivedVars`。
- 如果一个目标值公式很长，不要直接塞进 `displayExpr`。先放进 `derivedVars`，再在判定式里引用。

目标值型规则推荐结构：

```jsonc
"derivedVars": [
  { "id": "targetValue", "expr": "<目标值公式>" }
],
"outcomes": [
  { "id": "success", "name": "成功", "condition": "$roll.total <= $targetValue", "displayExpr": "$roll.total <= $targetValue", "priority": 20 },
  { "id": "failure", "name": "失败", "condition": "true", "displayExpr": "$roll.total <= $targetValue", "priority": 99 }
]
```

## OutcomeLevel

`outcomes` 是数组。每项必须有：`id`、`name`、`condition`、`priority`。

- 可选键：`rank`、`contestRank`、`displayExpr`、`outputText`、`style`、`effects`。
- `priority` 数字越小越先匹配。
- `condition` 必须是数字/布尔表达式。
- `displayExpr` 控制投骰后按钮里的小字判定式，也会提供 `$conditionExpr`、`$judgeResult`、`$displayValue`。它不是隐藏计算字段。
- `displayExpr` 应该是短的、用户看得懂的判定式或最终值式，通常要包含 `$roll.total` 或 `$roll`。不要写一长串目标值公式，否则按钮上会直接露出这串公式。
- 需要在输出里展示目标值、最终值、差值等中间结果时，优先用 `derivedVars` 生成 `$targetValue`、`$finalValue`、`$margin` 这类变量。
- 必须提供一个兜底 outcome，通常是：`{ "id": "failure", "name": "失败", "condition": "true", "priority": 99 }`。

## outcomePolicy

`outcomePolicy` 是 outcomes 命中后的二次裁决。它不改变投骰，也不重新计算 `condition`；只在已经命中的 outcome 基础上，根据额外规则替换最终 outcome。

当前运行时只支持 `minRank`。它用于“已经成功，但没有达到用户要求的最低成功等级”的规则，例如 CoC 的普通成功 / 困难成功 / 极难成功。普通成功失败、目标值型检定、PbtA 档位等不需要它，请省略。

`minRank` 只能写：

```jsonc
{ "kind": "minRank", "requiredRankVarId": "<数值型 customFields 字段 ID>", "unmetOutcomeId": "<未达标 outcome ID>" }
```

- `requiredRankVarId` 必须对应 `customFields` 里的 `number` 字段或数值型 `select` 字段。
- `unmetOutcomeId` 必须对应 `outcomes` 里的兜底 outcome，通常命名为 `"unmet"`，条件写 `"false"`，优先级写很大。
- 参与比较的 outcome 必须写数字 `rank`：失败通常 `0`，普通成功 `1`，更高等级依次增大；大失败可以写负数。
- 当实际命中的 `rank` 在 `1` 到 `requiredRank - 1` 之间时，最终 outcome 会替换为 `unmetOutcomeId`。
- `conditional` 是保留类型，当前不要生成。
- `keepActualOutcome` 是历史兼容字段，当前 AI 新预设不需要写。

例子：

```jsonc
{ "kind": "minRank", "requiredRankVarId": "requiredRank", "unmetOutcomeId": "unmet" }
```

## contestRule

- 不支持对抗时写：`{ "disabled": true }`。
- 支持对抗时允许键：`disabled`、`mode`、`tieBreakers`、`tieBreaker`、`customExpr`、`hideDc`、`hideMod`、`hideSkillMod`。
- `mode` 只能是 `"rank"`、`"value"`、`"margin"`、`"custom"`。
- 不允许使用 `total`、`totalExpr`、`formula`、`scoreExpr` 等未列字段。
- DND/PF 这类比最终数值高低的对抗使用：`{ "mode": "value", "tieBreakers": ["higher_attr", "initiator_wins"] }`。
- CoC 这类先比成功等级的对抗使用：`{ "mode": "rank", "tieBreakers": ["higher_attr", "initiator_wins"] }`，并在 `outcomes` 填 `contestRank`。

## checkSuggestionGuide 与 checkSuggestionAliases

这两个字段用于配合“检定建议表”。检定建议表有 `展示文本` 和 `骰子命令` 两列：AI 先根据 `<检定规则>` 生成建议行，用户点击某一行后，脚本会解析该行的 `骰子命令` 并真正执行检定。

`checkSuggestionGuide` 可选，允许键：`rule`、`dsl`、`examples`，值都是字符串。它会被同步到数据库模板 note 的 `<检定规则>` 标签里，展示为：

- `rule`：写给 AI 的自然语言规则。说明什么时候需要检定、怎样选属性/技能/难度、哪些情况应写 `必成` / `必败` / `无`。
- `dsl`：写给 AI 的命令语法。这里必须只描述运行时能解析的 `骰子命令` 格式。
- `examples`：展示文本与骰子命令的成对示例。示例里的骰子命令必须是可执行命令，不要写伪代码。

运行时能解析的命令只有这些：

```text
检定 <角色> <属性或行动> [key=value ...]
对抗 <发起者> <属性或行动> vs <对手> <属性或行动> [key=value ...] [平局=发起方成功|发起方失败|平局]
必成
必败
无
```

DSL 书写规则：

- 尖括号内容表示占位符，例如 `<角色>`、`<属性或行动>`；实际骰子命令里要替换为真实角色名和属性/行动名。
- `key=value` 必须是一个完整 token，中间不能有空格；写 `dc=15`，不要写 `dc = 15`。
- 参数值不能包含空格；需要中文值时用短词，例如 `难度=困难`、`优势=劣势`。
- 普通检定里，`<角色>` 是第一个空格前的 token，后面直到参数前的内容是属性/行动名。
- 对抗检定必须用 ASCII `vs` 分隔双方。
- 角色名和属性名别名不由 `checkSuggestionAliases` 处理；请让 `rule` 要求 AI 从角色属性清单中原样引用名称。
- 不要在 DSL 里依赖显式骰子公式。高级预设应主要通过 `diceExpression` 和 `dicePatches` 决定骰子；`骰子命令` 只负责传入角色、属性和参数。
- `[]` 和 `|` 只是在 `dsl` 文本里给 AI 看，不是实际命令的一部分。

常用参数约定：

- `dc`：目标值 / 难度数字。
- `mod`：临时额外修正。
- `attr`：覆盖或指定基础属性值/属性名。
- `skillMod`：技能加值或技能属性名。
- `preset`：强制指定预设 ID；通常不要写，因为检定建议表会使用当前激活预设。
- `customFields` 的参数名默认就是字段 `id`。
- 对抗检定可以给双方分别传参：`leftAttr`、`rightAttr`、`leftMod`、`rightMod`、`leftSkillMod`、`rightSkillMod`；自定义字段也可以按同样规则加左右前缀，例如 `leftRiskMode` / `rightRiskMode`。

`checkSuggestionAliases` 可选，允许键：`params`、`values`。

- `params`：把 DSL 中更自然的参数名映射到运行时字段 ID，例如 `{ "难度": "dc", "目标值": "dc", "优势": "advantageMode" }`。
- `values`：把某个字段的中文值映射成实际值，例如 `{ "advantageMode": { "优势": 1, "普通": 0, "劣势": -1 } }`。
- `values` 的第一层 key 必须是映射后的字段 ID；如果 `params` 把 `优势` 映射成 `advantageMode`，就写 `values.advantageMode`，不要写 `values.优势`。
- 进入表达式、`dicePatches.when`、`derivedVars.expr`、`outcomePolicy` 的值必须映射成数字，不要映射成字符串。
- `params` 和 `values` 只处理 `key=value` 参数；不处理命令里的角色名、属性名或行动名。

推荐写法示例：

```jsonc
"checkSuggestionGuide": {
  "rule": "使用目标值型 d20 检定：掷 1d20，加上属性调整值与临时修正，总值大于等于 DC 则成功。只有存在不确定性和失败代价时才建议检定；结果已经明确时写 无、必成 或 必败。",
  "dsl": "普通检定：检定 <角色> <属性或技能> dc=<目标值> [mod=<临时修正>] [优势=优势|普通|劣势]\n对抗检定：对抗 <发起者> <属性或技能> vs <对手> <属性或技能> [leftMod=<发起者修正>] [rightMod=<对手修正>] [优势=优势|普通|劣势]\n固定成功：必成\n固定失败：必败\n无需检定：无",
  "examples": "1. 展示文本：<user>尝试攀过雨水打滑的外墙。\n   骰子命令：检定 <user> 运动 dc=15\n2. 展示文本：<角色A>和<角色B>争抢即将关闭的舱门控制权。\n   骰子命令：对抗 <角色A> 力量 vs <角色B> 力量\n3. 展示文本：门锁已经被完全破坏，不需要额外检定。\n   骰子命令：无"
},
"checkSuggestionAliases": {
  "params": {
    "难度": "dc",
    "目标值": "dc",
    "修正": "mod",
    "优势": "advantageMode"
  },
  "values": {
    "advantageMode": {
      "优势": 1,
      "普通": 0,
      "正常": 0,
      "劣势": -1
    }
  }
}
```

## tests

`tests` 是数组。每项允许键：`name`、`context`、`expectedOutcomeId`、`expectedOutcomeName`。

- `context` 允许键：`rollTotal`、`rollTags`、`attr`、`dc`、`mod`、`skillMod`，以及 `customFields` 的字段名。
- 自然 20/自然 1 测试必须使用 `rollTags`，例如：`{ "rollTotal": 20, "rollTags": ["nat20"] }`。
- 不要使用 `tags`；正确字段名是 `rollTags`。
- 每个测试至少写 `expectedOutcomeId` 或 `expectedOutcomeName`。

## outputTemplate 变量

常用变量：`$initiator`、`$attrName`、`$formula`、`$roll`、`$roll.total`、`$dc`、`$attr`、`$attrValue`、`$attrMod`、`$skillMod`、`$mod`、`$conditionExpr`、`$judgeResult`、`$outcomeName`、`$outcomeText`、`$displayValue`。

- 默认不要写 `outputTemplate`。省略时会使用系统内置模板，并自动输出 `<meta:检定结果>...</meta:检定结果>`。
- 只有确实需要改变输出措辞时才写 `outputTemplate`。
- 如果写了 `outputTemplate`，必须保留 `<meta:检定结果>` 与 `</meta:检定结果>` 包裹；不要生成纯自然语言短句模板。
- `$displayValue` 来自命中 outcome 的 `displayExpr` 求值结果。
- 如果要输出“最终值/总值”，可以在该 outcome 写包含 `$roll.total` 的数值型 `displayExpr`，例如：`"$roll.total + $attrMod + $skillMod + $mod"`。
- 如果要输出“目标值/阈值/派生难度”，请用 `derivedVars`，例如 `$targetValue`；不要为了拿到 `$displayValue` 而把纯目标值公式写进 `displayExpr`。
- 对抗模板可用：`$initRoll`、`$oppRoll`、`$initTarget`、`$oppTarget`、`$initDisplayValue`、`$oppDisplayValue`、`$initConditionExpr`、`$oppConditionExpr`、`$winner` 等。
- 不要使用未列变量；未知变量会被替换为空字符串。

自定义输出模板推荐骨架：

```jsonc
"outputTemplate": "<meta:检定结果>\n$outcomeText\n元叙事：$initiator 发起了 $attrName 检定，$formula=$roll，判定 $conditionExpr？$judgeResult，判定为【$outcomeName】。\n</meta:检定结果>"
```

## 最小示例

下面示例只用于说明字段如何组合。生成最终预设时必须根据用户需求替换名称、规则、字段、outcomes、tests，不要照抄示例规则。

```jsonc
{
  "format": "acu_advanced_preset_agent_v1",
  "preset": {
    "kind": "advanced",
    "name": "目标值型 d20 检定",
    "description": "1d20 + 属性调整值 + 临时修正 >= 目标值即成功，支持优势/劣势。",
    "diceExpression": "1d20",
    "attribute": {
      "label": "属性值",
      "placeholder": "留空=10",
      "defaultValue": 10,
      "key": "属性值",
      "computeModifier": "floor(($attr - 10) / 2)"
    },
    "dc": { "label": "目标值", "placeholder": "留空=10", "defaultValue": 10 },
    "mod": { "hidden": true, "defaultValue": 0 },
    "customFields": [
      {
        "id": "advantageMode",
        "type": "select",
        "label": "优势/劣势",
        "defaultValue": 0,
        "options": [
          { "label": "普通", "value": 0 },
          { "label": "优势", "value": 1 },
          { "label": "劣势", "value": -1 }
        ]
      }
    ],
    "dicePatches": [
      { "when": "$advantageMode > 0", "op": "replace", "template": "2d20kh1" },
      { "when": "$advantageMode < 0", "op": "replace", "template": "2d20kl1" }
    ],
    "outcomes": [
      { "id": "crit_success", "name": "自然20", "condition": "$roll.hasTag(\"nat20\")", "priority": 1, "rank": 2, "contestRank": 100 },
      { "id": "crit_failure", "name": "自然1", "condition": "$roll.hasTag(\"nat1\")", "priority": 2, "rank": -1, "contestRank": 0 },
      { "id": "success", "name": "成功", "condition": "$roll.total + $attrMod + $mod >= $dc", "displayExpr": "$roll.total + $attrMod + $mod", "priority": 20, "rank": 1, "contestRank": 60 },
      { "id": "failure", "name": "失败", "condition": "true", "displayExpr": "$roll.total + $attrMod + $mod", "priority": 99, "rank": 0, "contestRank": 40 }
    ],
    "contestRule": { "mode": "value", "tieBreakers": ["higher_attr", "initiator_wins"] },
    "checkSuggestionAliases": {
      "params": { "目标值": "dc", "难度": "dc", "修正": "mod", "优势": "advantageMode" },
      "values": { "advantageMode": { "普通": 0, "优势": 1, "劣势": -1 } }
    }
  },
  "tests": [
    { "name": "普通成功", "context": { "rollTotal": 14, "attr": 14, "mod": 0, "dc": 15, "advantageMode": 0 }, "expectedOutcomeId": "success" },
    { "name": "普通失败", "context": { "rollTotal": 8, "attr": 14, "mod": 0, "dc": 15, "advantageMode": 0 }, "expectedOutcomeId": "failure" },
    { "name": "自然20", "context": { "rollTotal": 20, "rollTags": ["nat20"], "attr": 0, "mod": 0, "dc": 99, "advantageMode": 0 }, "expectedOutcomeId": "crit_success" },
    { "name": "自然1", "context": { "rollTotal": 1, "rollTags": ["nat1"], "attr": 99, "mod": 99, "dc": 1, "advantageMode": 0 }, "expectedOutcomeId": "crit_failure" }
  ],
  "notes": ["自然20/自然1是否自动成败取决于桌规；如需严格技能检定规则，可删除对应 outcomes。"]
}
```

## 可用性设计规则

- 这不是通用表单生成器，而是检定面板配置。
- 用户实际投骰时会看到：名字、属性名、`attribute`、`skillMod`、`dc`、`mod`、`customFields`。
- 可见字段越多，面板越拥挤；普通检定建议最多保留 4-6 个可见输入。
- `attribute`、`dc`、`mod`、`skillMod` 是核心内置输入，优先复用它们，不要重复做成 `customFields`。
- `customFields` 只用于规则特有且用户每次检定真的需要选择/填写的参数。
- 目标值/难度型规则必须让 `dc` 可见，除非该规则没有固定目标值。只要 `outcomes` 或 `displayExpr` 使用 `$dc`，就不要设置 `dc.hidden=true`。
- 目标值/难度型规则的 `dc.defaultValue` 要写该规则下合理的常用默认难度；不要为了省事写 0，除非该规则的普通难度确实是 0。
- 对抗检定可以通过 `contestRule.hideDc` 隐藏对抗面板的 DC；这不影响普通检定的 `dc` 可见性。
- 如果规则使用“原始属性值 -> 派生调整值”，不要让用户手填派生值。用 `attribute.defaultValue` 表示原始属性默认值，用 `attribute.computeModifier` 计算调整值，再在表达式中使用 `$attrMod`。
- 如果规则直接使用技能/能力修正值，则 `attribute` 可以表示该修正值，表达式使用 `$attr`；不要同时再创建含义重复的 `skillMod`。
- `skillMod` 只在规则确实同时需要“基础属性/调整值”和“技能/熟练/专精加值”时使用。
- `mod` 只表示临时额外修正。没有临时修正需求时设为 `{ "hidden": true, "defaultValue": 0 }`。
- 生成前先数一下可见字段：`name` 和 `attributeName` 总是存在；`attribute` / `dc` / `mod` / `skillMod` / `customFields` 未 hidden 都会显示。
