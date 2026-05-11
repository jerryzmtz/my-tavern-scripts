# AcuDice API v1.2.0 手动测试清单

> 测试前提：本地 `pnpm watch` 已启动，酒馆已打开并加载了骰子系统。打开浏览器 DevTools
> Console 进行 API 调用测试。另外需要有一张 **已配置角色数据（主角信息表含属性/技能）**
> 的角色卡用于测试 check/contest 的自动查值功能。

---

## Part A：原有功能回归测试（确认不被破坏）

以下全部通过 **酒馆 UI 操作** 进行，不使用 Console。

### A1. 普通检定（UI 按钮）

- [ ] 在骰子面板点击某个属性/技能执行检定
- [ ] 确认检定结果正确显示（弹窗/面板中有结果文本）
- [ ] 确认检定结果出现在检定历史面板中
- [ ] 确认检定结果文本被正确插入到输入框

### A2. 对抗检定（UI 按钮）

- [ ] 通过 UI 发起对抗检定
- [ ] 确认双方掷骰结果和胜负判定正确显示
- [ ] 确认对抗结果出现在检定历史面板中

### A3. 骰子投掷（UI）

- [ ] 在骰子面板使用投掷功能（如快速投骰按钮）
- [ ] 确认结果正确显示

### A4. 预设系统（UI）

- [ ] 打开预设管理面板，确认预设列表正常加载
- [ ] 切换激活预设，确认切换后检定行为符合预期
- [ ] 确认内置默认预设正常工作

### A5. 效果系统（UI）

- [ ] 如果有配置效果的预设，执行检定后确认效果确认弹窗正常出现
- [ ] 确认效果执行后属性值正确更新

### A6. 检定历史面板

- [ ] 打开检定历史面板
- [ ] 确认历史条目可以展开查看详情
- [ ] 确认筛选功能正常（按类型/关键字筛选）

---

## Part B：API 新功能测试（Console 中执行）

在浏览器 Console 中输入以下代码进行测试。

### B1. 版本号

```js
console.log(AcuDice.version);
// 预期: "1.2.0"
```

- [ ] 输出为 `"1.2.0"`

### B2. roll() - 正常投掷

```js
console.log(AcuDice.roll('2d6'));
console.log(AcuDice.roll('1d20+5'));
console.log(AcuDice.roll('4d6kh3'));
console.log(AcuDice.roll('3+5'));
```

- [ ] 每次都返回 `{ total, formula, breakdown }` 格式
- [ ] `3+5` 返回 `total: 8`

### B3. roll() - 无效输入

```js
try {
  AcuDice.roll('abc');
} catch (e) {
  console.log('OK:', e.message);
}
try {
  AcuDice.roll('');
} catch (e) {
  console.log('OK:', e.message);
}
try {
  AcuDice.roll(null);
} catch (e) {
  console.log('OK:', e.message);
}
```

- [ ] 全部抛出错误，不返回 `{ total: 0 }`

### B4. check() - 直接指定 targetValue

```js
const r = await AcuDice.check({ attribute: '力量', targetValue: 50 });
console.log(r);
```

- [ ] 返回包含 `success, roll, target(50), margin, message, diceType, rule` 的对象
- [ ] `message` 包含可读的结果描述

### B5. check() - 自动从角色数据查找

```js
// 需要当前角色卡有"力量"属性
const r = await AcuDice.check({ attribute: '力量' });
console.log(r);
```

- [ ] 成功返回结果（目标值从角色数据自动获取）
- [ ] 如果角色没有该属性，抛出错误

### B6. check() - DND 规则

```js
const r = await AcuDice.check({
  attribute: '力量',
  targetValue: 15,
  diceType: '1d20',
  successCriteria: 'gte',
  modifier: 3,
});
console.log(r);
```

- [ ] `rule` 为 `'dnd'`
- [ ] `diceType` 为 `'1d20'`
- [ ] `roll` 包含了 modifier

### B7. check() 写入历史（Bug 3 修复验证）

```js
await AcuDice.check({ attribute: '力量', targetValue: 50 });
const latest = AcuDice.getLatestCheck();
console.log(latest);
```

- [ ] `latest` 不为 `null`
- [ ] 包含 `timestamp`（时间戳）
- [ ] 包含 `historyType: 'check'`
- [ ] 包含 `detailId`、`detailLines`、`initiatorName: 'API'`

### B8. check() 触发事件（Bug 3 修复验证）

```js
let received = null;
AcuDice.on('check', d => {
  received = d;
});
await AcuDice.check({ attribute: '力量', targetValue: 50 });
console.log('事件数据:', received);
```

- [ ] `received` 不为 `null`
- [ ] 包含完整检定结果字段

### B9. on/off 事件系统

```js
let count = 0;
const h = () => {
  count++;
};
AcuDice.on('check', h);
await AcuDice.check({ targetValue: 50, attribute: '力量' });
console.log('注册后:', count); // 应为 1
AcuDice.off('check', h);
await AcuDice.check({ targetValue: 50, attribute: '力量' });
console.log('取消后:', count); // 应仍为 1
```

- [ ] 注册后 count 增加
- [ ] off() 后 count 不再增加

### B10. getHistory()

```js
const h = AcuDice.getHistory({ type: 'check', limit: 5 });
console.log('历史条数:', h.length, h);
```

- [ ] 返回数组
- [ ] 包含之前 API check() 产生的记录

### B11. contest() - 使用 targetValue（Bug 1 修复验证）

```js
const r = await AcuDice.contest({
  left: { name: '玩家', attribute: '力量', targetValue: 50 },
  right: { name: '敌人', attribute: '力量', targetValue: 40 },
});
console.log(r);
```

- [ ] 不报 `getSuccessLevel is not defined` 错误
- [ ] 返回包含 `left, right, winner, message` 的对象
- [ ] `left.successLevel` 和 `right.successLevel` 为数字

### B12. contest() - attacker/defender 别名

```js
const r = await AcuDice.contest({
  attacker: { name: '玩家', attribute: '力量', targetValue: 50 },
  defender: { name: '敌人', attribute: '力量', targetValue: 40 },
});
console.log(r);
```

- [ ] 功能同 B11，使用旧参数名仍然正常工作

### B13. contest() - 从角色数据查找（需要角色卡数据）

```js
// 替换为实际存在的角色名和属性
const r = await AcuDice.contest({
  left: { name: '<user>', attribute: '力量' },
  right: { name: 'NPC名', attribute: '力量' },
});
console.log(r);
```

- [ ] 成功获取角色属性值并完成对抗检定

### B14. listPresets()

```js
const presets = AcuDice.listPresets();
console.log(presets);
```

- [ ] 返回数组
- [ ] 每个元素包含 `id, name, description, builtin`
- [ ] 至少有一个内置预设（`__builtin_default__`）

### B15. getActivePresetId()

```js
const id = AcuDice.getActivePresetId();
console.log('当前预设:', id);
```

- [ ] 返回字符串（预设 ID）或 `null`

### B16. getPresetSummary()

```js
const presets = AcuDice.listPresets();
if (presets.length > 0) {
  const summary = AcuDice.getPresetSummary(presets[0].id);
  console.log('预设摘要:', summary);
}
```

- [ ] 返回包含 `id, name, description, builtin` 的对象
- [ ] 传入不存在的 ID 时返回 `null`

### B17. 其他已有方法

```js
console.log('角色列表:', AcuDice.listCharacters());
console.log('角色属性:', AcuDice.getCharacterAttributes('<user>'));
console.log('属性值:', AcuDice.getAttributeValue('<user>', '力量'));
```

- [ ] `listCharacters()` 返回角色名数组
- [ ] `getCharacterAttributes()` 返回属性数组
- [ ] `getAttributeValue()` 返回数字或 `null`

---

## Part C：交叉验证（API 与 UI 互通）

### C1. API check() 的结果出现在 UI 历史面板中

```js
await AcuDice.check({ attribute: '力量', targetValue: 50 });
```

- [ ] 执行后打开检定历史面板
- [ ] 确认该次 API 检定出现在历史列表中（发起者标记为 "API"）

### C2. UI 检定的结果在 API getHistory() 中可见

- [ ] 先通过 UI 面板执行一次检定
- [ ] 然后在 Console 执行 `AcuDice.getHistory({ type: 'check', limit: 1 })`
- [ ] 确认返回的是刚才 UI 操作产生的检定结果

### C3. API contest() 的结果出现在 UI 历史面板中

```js
await AcuDice.contest({
  left: { name: '玩家', attribute: '力量', targetValue: 50 },
  right: { name: '敌人', attribute: '力量', targetValue: 40 },
});
```

- [ ] 执行后在检定历史面板中可以看到该对抗记录

---

## 总结

| 分类                 | 项目数 | 说明                          |
| -------------------- | ------ | ----------------------------- |
| Part A: 原有 UI 功能 | 6 组   | 确保 API 改动没有破坏原有功能 |
| Part B: API 新功能   | 17 项  | 覆盖所有 v1.2.0 API 方法      |
| Part C: 交叉验证     | 3 项   | 确保 API 和 UI 数据互通       |

如果 Part A 全部通过 = 原有功能未受影响。如果 Part B 全部通过 = API v1.2.0 所有功能正常。如果 Part C 全部通过 =
API 和 UI 数据层完全互通。
