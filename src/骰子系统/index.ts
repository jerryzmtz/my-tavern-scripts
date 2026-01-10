(function () {
  'use strict';

  const SCRIPT_ID = 'acu_visualizer_ui_v19_6_ai_overlay';
  // ========================================
  // LockManager - 字段锁定管理器（按聊天隔离）
  // ========================================
  const LockManager = {
    STORAGE_KEY_PREFIX: 'acu_locked_fields_v2_',
    MAX_CONTEXTS: 20, // 最多保留多少个聊天的锁定数据

    PRIMARY_KEYS: {
      全局数据表: null,
      世界地图点: '详细地点',
      地图元素表: '元素名称',
      主角信息: '姓名',
      重要人物表: '姓名',
      技能表: '技能名称',
      物品表: '物品名称',
      装备表: '装备名称',
      任务表: '名称',
      总结表: '编码索引',
      总体大纲: '编码索引',
      重要情报: '情报名称',
      势力: '名称',
    },

    _cache: null,
    _currentContextId: null,

    // 获取当前上下文专属的存储键
    _getStorageKey(ctxId) {
      return this.STORAGE_KEY_PREFIX + (ctxId || getCurrentContextFingerprint());
    },

    // 清理过旧的锁定数据，只保留最近使用的 N 个
    _cleanupOldContexts() {
      try {
        const prefix = this.STORAGE_KEY_PREFIX;
        const allKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            allKeys.push(key);
          }
        }

        if (allKeys.length <= this.MAX_CONTEXTS) return;

        // 按最后访问时间排序（通过内部 _lastAccess 字段）
        const keyWithTime = allKeys.map(key => {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            return { key, time: data?._lastAccess || 0 };
          } catch {
            return { key, time: 0 };
          }
        });

        keyWithTime.sort((a, b) => b.time - a.time);

        // 删除超出限制的旧数据
        const toDelete = keyWithTime.slice(this.MAX_CONTEXTS);
        toDelete.forEach(item => {
          localStorage.removeItem(item.key);
        });

        if (toDelete.length > 0) {
          console.log(`[LockManager] 清理了 ${toDelete.length} 个过期的锁定数据`);
        }
      } catch (e) {
        console.warn('[LockManager] 清理失败', e);
      }
    },

    _load() {
      const ctxId = getCurrentContextFingerprint();

      // 上下文变化时清空缓存
      if (this._currentContextId !== ctxId) {
        this._cache = null;
        this._currentContextId = ctxId;
      }

      if (!this._cache) {
        try {
          const stored = localStorage.getItem(this._getStorageKey());
          this._cache = stored ? JSON.parse(stored) : {};
          // 移除内部元数据字段，不暴露给业务逻辑
          delete this._cache._lastAccess;
        } catch (e) {
          this._cache = {};
        }
      }
      return this._cache;
    },

    _save() {
      try {
        // 写入时附带最后访问时间戳
        const dataToSave = { ...this._cache, _lastAccess: Date.now() };
        localStorage.setItem(this._getStorageKey(), JSON.stringify(dataToSave));

        // 每次保存后尝试清理（内部有数量判断，不会频繁执行）
        this._cleanupOldContexts();
      } catch (e) {
        console.warn('[LockManager] 保存失败', e);
      }
    },

    getRowKey(tableName, row, headers) {
      const pkField = this.PRIMARY_KEYS[tableName];
      if (pkField === null) return '_row_0';

      let fieldIndex = 1;
      if (pkField) {
        const idx = headers.indexOf(pkField);
        if (idx !== -1) fieldIndex = idx;
      }

      if (!row[fieldIndex]) return null;
      return `${pkField || headers[fieldIndex]}=${row[fieldIndex]}`;
    },

    lockField(tableName, rowKey, fieldName, value) {
      const data = this._load();
      if (!data[tableName]) data[tableName] = {};
      if (!data[tableName][rowKey]) {
        data[tableName][rowKey] = { _fullRow: false, _fields: {}, _snapshot: null };
      }
      data[tableName][rowKey]._fields[fieldName] = value;
      this._save();
    },

    lockRow(tableName, rowKey, rowData, headers) {
      const data = this._load();
      if (!data[tableName]) data[tableName] = {};

      const snapshot = {};
      headers.forEach((h, i) => {
        if (h && rowData[i] != null && rowData[i] !== '') {
          snapshot[h] = rowData[i];
        }
      });

      data[tableName][rowKey] = { _fullRow: true, _fields: {}, _snapshot: snapshot };
      this._save();
    },

    unlockField(tableName, rowKey, fieldName) {
      const data = this._load();
      const lock = data[tableName]?.[rowKey];
      if (!lock) return;

      delete lock._fields[fieldName];
      if (!lock._fullRow && Object.keys(lock._fields).length === 0) {
        delete data[tableName][rowKey];
        if (Object.keys(data[tableName]).length === 0) {
          delete data[tableName];
        }
      }
      this._save();
    },

    unlockRow(tableName, rowKey) {
      const data = this._load();
      if (data[tableName]) {
        delete data[tableName][rowKey];
        if (Object.keys(data[tableName]).length === 0) {
          delete data[tableName];
        }
        this._save();
      }
    },

    isFieldLocked(tableName, rowKey, fieldName) {
      const lock = this._load()[tableName]?.[rowKey];
      if (!lock) return false;
      if (lock._fullRow) return lock._snapshot?.hasOwnProperty(fieldName);
      return lock._fields?.hasOwnProperty(fieldName);
    },

    isRowLocked(tableName, rowKey) {
      return this._load()[tableName]?.[rowKey]?._fullRow === true;
    },

    applyLocks(tableName, tableContent) {
      const tableLocks = this._load()[tableName];
      if (!tableLocks || !tableContent || tableContent.length < 2) {
        return { modified: false, restored: [] };
      }

      const headers = tableContent[0];
      const restored = [];
      let modified = false;

      // 建立现有行的索引
      const rowIndex = {};
      for (let i = 1; i < tableContent.length; i++) {
        const key = this.getRowKey(tableName, tableContent[i], headers);
        if (key) rowIndex[key] = i;
      }

      for (const [rowKey, lock] of Object.entries(tableLocks)) {
        const idx = rowIndex[rowKey];

        if (idx === undefined) {
          // 行不存在，尝试重建（仅在同一聊天内有效）
          const newRow = this._rebuildRow(headers, lock);
          if (newRow) {
            tableContent.push(newRow);
            restored.push(rowKey);
            modified = true;
          }
          continue;
        }

        const row = tableContent[idx];
        const fields = lock._fullRow ? lock._snapshot : lock._fields;

        if (fields) {
          for (const [field, value] of Object.entries(fields)) {
            const colIdx = headers.indexOf(field);
            if (colIdx !== -1 && row[colIdx] !== value) {
              row[colIdx] = value;
              modified = true;
            }
          }
        }
      }

      return { modified, restored };
    },

    _rebuildRow(headers, lock) {
      const fields = lock._fullRow ? lock._snapshot : lock._fields;
      if (!fields || Object.keys(fields).length === 0) return null;

      const row = new Array(headers.length).fill(null);
      for (const [field, value] of Object.entries(fields)) {
        const idx = headers.indexOf(field);
        if (idx !== -1) row[idx] = value;
      }
      return row;
    },

    getLockedFields(tableName, rowKey) {
      const lock = this._load()[tableName]?.[rowKey];
      if (!lock) return [];
      if (lock._fullRow) return Object.keys(lock._snapshot || {});
      return Object.keys(lock._fields || {});
    },

    // 清理当前聊天的所有锁定（调试用）
    clearCurrentContext() {
      localStorage.removeItem(this._getStorageKey());
      this._cache = null;
    },
  };
  const escapeHtml = s =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  // [新增] 智能填充输入栏函数
  const smartInsertToTextarea = (newContent, contentType) => {
    // contentType: 'action' (交互选项) 或 'dice' (骰子结果)
    const $ta = $('#send_textarea');
    if (!$ta.length) return;

    const currentVal = ($ta.val() || '').trim();

    // 普通检定结果的识别正则
    // 格式: "角色名发起了【属性名】检定，掷出XX，判定式，【结果】"
    const normalDiceRegex = /[\u4e00-\u9fa5a-zA-Z<>]+发起了【[^】]+】检定，掷出\d+，[^【]*【[^】]+】/g;

    // 对抗检定结果的识别正则
    // 格式: "进行了一次【... vs ...】的对抗检定。... (目标...) 掷出 ...，判定为【...】；... (目标...) 掷出 ...，判定为【...】。最终结果：【...】"
    const contestDiceRegex =
      /进行了一次【[^】]+ vs [^】]+】的对抗检定。.*?\(目标\d+\) 掷出 \d+，判定为【[^】]+】；.*?\(目标\d+\) 掷出 \d+，判定为【[^】]+】。最终结果：【[^】]+】/g;

    // 交互选项的识别正则（以<user>开头，匹配到句末标点）
    const actionRegex = /<user>(?:(?!<user>).)*?[。！？]/g;

    // 如果输入栏为空，直接填入
    if (!currentVal) {
      $ta.val(newContent).trigger('input').trigger('change');
      return;
    }

    // 解析当前内容，分离三个部分
    let workingText = currentVal;
    let existingAction = '';
    let existingDice = '';

    // 1. 先提取对抗检定结果（优先级更高，格式更长）
    const contestMatches = workingText.match(contestDiceRegex);
    if (contestMatches && contestMatches.length > 0) {
      existingDice = contestMatches[contestMatches.length - 1];
      workingText = workingText.replace(contestDiceRegex, '\u0000').trim();
      console.log('[ACU SmartInsert] Found and extracted contest roll:', existingDice);
    }

    // 2. 再提取普通检定结果
    const normalMatches = workingText.match(normalDiceRegex);
    if (normalMatches && normalMatches.length > 0) {
      // 如果已有对抗检定结果，普通检定会覆盖它；否则取普通检定
      existingDice = normalMatches[normalMatches.length - 1];
      workingText = workingText.replace(normalDiceRegex, '\u0000').trim();
      console.log('[ACU SmartInsert] Found and extracted normal roll:', existingDice);
    }

    // 3. 提取交互选项
    const actionMatches = workingText.match(actionRegex);
    if (actionMatches && actionMatches.length > 0) {
      existingAction = actionMatches[actionMatches.length - 1];
      workingText = workingText.replace(actionRegex, '\u0001').trim();
      console.log('[ACU SmartInsert] Found and extracted action:', existingAction);
    }

    // 4. 移除占位符，剩下的就是用户输入
    let userInput = workingText
      .replace(/[\u0000\u0001]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 5. 根据新内容类型，更新对应部分
    if (contentType === 'dice') {
      existingDice = newContent;
    } else if (contentType === 'action') {
      existingAction = newContent;
    }

    // 6. 重新组合：用户输入 + 交互选项 + 骰子结果
    const parts = [];
    if (userInput) parts.push(userInput);
    if (existingAction) parts.push(existingAction);
    if (existingDice) parts.push(existingDice);

    const finalVal = parts.join(' ');
    $ta.val(finalVal).trigger('input').trigger('change');
  };
  const STORAGE_KEY_TABLE_ORDER = 'acu_table_order';
  const STORAGE_KEY_ACTION_ORDER = 'acu_action_order';
  const STORAGE_KEY_PENDING_DELETIONS = 'acu_pending_deletions';
  const STORAGE_KEY_ACTIVE_TAB = 'acu_active_tab';
  const STORAGE_KEY_UI_CONFIG = 'acu_ui_config_v19';
  const STORAGE_KEY_LAST_SNAPSHOT = 'acu_data_snapshot_v19';
  const STORAGE_KEY_IS_COLLAPSED = 'acu_ui_collapsed_state';
  const STORAGE_KEY_DASHBOARD_ACTIVE = 'acu_dashboard_active';
  // [新增] 移植功能所需的存储键
  const STORAGE_KEY_TABLE_HEIGHTS = 'acu_table_heights_v19';
  const STORAGE_KEY_TABLE_STYLES = 'acu_table_styles_v19';
  const STORAGE_KEY_HIDDEN_TABLES = 'acu_hidden_tables_v19';
  const STORAGE_KEY_GM_CONFIG = 'acu_gm_engine_config_v1';
  const STORAGE_KEY_REVERSE_TABLES = 'acu_reverse_tables_v1';
  const MAX_ACTION_BUTTONS = 6; // 活动栏最大按钮数
  const MIN_PANEL_HEIGHT = 200; // 面板最小高度
  const MAX_PANEL_HEIGHT = 1200; // 面板最大高度

  const STORAGE_KEY_DICE_CONFIG = 'acu_dice_config_v1';
  const STORAGE_KEY_ATTRIBUTE_PRESETS = 'acu_attribute_presets_v1';
  const STORAGE_KEY_ACTIVE_ATTR_PRESET = 'acu_active_attr_preset_v1';

  const STORAGE_KEY_AVATAR_MAP = 'acu_avatar_map_v1';

  // ========================================
  // ValidationRuleManager - 数据验证规则系统
  // ========================================
  const STORAGE_KEY_VALIDATION_RULES = 'acu_validation_rules_v1';
  const STORAGE_KEY_VALIDATION_ENABLED = 'acu_validation_enabled_v1';
  const STORAGE_KEY_VALIDATION_MODE = 'acu_validation_mode'; // 数据验证模式（只显示验证错误）

  // 规则类型信息（用于 UI 显示和分组）
  const RULE_TYPE_INFO = {
    // 表级规则
    tableReadonly: { name: '表级只读', scope: 'table', icon: 'fa-lock', desc: '禁止修改整个表' },
    rowLimit: { name: '行数限制', scope: 'table', icon: 'fa-arrows-up-down', desc: '限制表的行数范围' },
    // 字段级规则
    required: { name: '必填', scope: 'field', icon: 'fa-asterisk', desc: '字段不能为空' },
    format: { name: '格式验证', scope: 'field', icon: 'fa-font', desc: '正则表达式匹配' },
    enum: { name: '枚举验证', scope: 'field', icon: 'fa-list', desc: '值必须在列表中' },
    numeric: { name: '数值范围', scope: 'field', icon: 'fa-hashtag', desc: '数值必须在范围内' },
    relation: { name: '关联验证', scope: 'field', icon: 'fa-link', desc: '引用其他表的值' },
  };

  // 内置验证规则定义
  const BUILTIN_VALIDATION_RULES = [
    // 总结表编码格式
    {
      id: 'summary_code_format',
      name: '总结表编码格式',
      description: '编码索引必须为 AM+三位数字格式，如 AM001',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '总结表',
      targetColumn: '编码索引',
      ruleType: 'format',
      config: { pattern: '^AM\\d{3}$' },
      errorMessage: '编码索引必须为 AM+三位数字格式（如 AM001）',
    },
    // 总体大纲编码格式
    {
      id: 'outline_code_format',
      name: '总体大纲编码格式',
      description: '编码索引必须为 AM+三位数字格式，如 AM001',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '总体大纲',
      targetColumn: '编码索引',
      ruleType: 'format',
      config: { pattern: '^AM\\d{3}$' },
      errorMessage: '编码索引必须为 AM+三位数字格式（如 AM001）',
    },
    // 任务表状态枚举
    {
      id: 'quest_status_enum',
      name: '任务表状态',
      description: '任务状态必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '任务表',
      targetColumn: '状态',
      ruleType: 'enum',
      config: { values: ['进行中', '已完成', '已失败', '已放弃'] },
      errorMessage: '状态必须为：进行中、已完成、已失败、已放弃',
    },
    // 任务表类型枚举
    {
      id: 'quest_type_enum',
      name: '任务表类型',
      description: '任务类型必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '任务表',
      targetColumn: '类型',
      ruleType: 'enum',
      config: { values: ['主线', '支线', '日常'] },
      errorMessage: '类型必须为：主线、支线、日常',
    },
    // 任务表优先级枚举
    {
      id: 'quest_priority_enum',
      name: '任务表优先级',
      description: '任务优先级必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '任务表',
      targetColumn: '优先级',
      ruleType: 'enum',
      config: { values: ['紧急', '重要', '普通'] },
      errorMessage: '优先级必须为：紧急、重要、普通',
    },
    // 装备表状态枚举
    {
      id: 'equip_status_enum',
      name: '装备表状态',
      description: '装备状态必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '装备表',
      targetColumn: '状态',
      ruleType: 'enum',
      config: { values: ['已装备', '闲置'] },
      errorMessage: '状态必须为：已装备、闲置',
    },
    // 装备表品质枚举
    {
      id: 'equip_quality_enum',
      name: '装备表品质',
      description: '装备品质必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '装备表',
      targetColumn: '品质',
      ruleType: 'enum',
      config: { values: ['普通', '优秀', '稀有', '史诗', '传说', '神话'] },
      errorMessage: '品质必须为：普通、优秀、稀有、史诗、传说、神话',
    },
    // 物品表品质枚举
    {
      id: 'item_quality_enum',
      name: '物品表品质',
      description: '物品品质必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '物品表',
      targetColumn: '品质',
      ruleType: 'enum',
      config: { values: ['普通', '优秀', '稀有', '史诗', '传说', '神话'] },
      errorMessage: '品质必须为：普通、优秀、稀有、史诗、传说、神话',
    },
    // 技能表类型枚举
    {
      id: 'skill_type_enum',
      name: '技能表类型',
      description: '技能类型必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '技能表',
      targetColumn: '类型',
      ruleType: 'enum',
      config: { values: ['主动', '被动', '特质'] },
      errorMessage: '类型必须为：主动、被动、特质',
    },
    // 技能表品质枚举
    {
      id: 'skill_quality_enum',
      name: '技能表品质',
      description: '技能品质必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '技能表',
      targetColumn: '品质',
      ruleType: 'enum',
      config: { values: ['普通', '优秀', '稀有', '史诗', '传说', '神话'] },
      errorMessage: '品质必须为：普通、优秀、稀有、史诗、传说、神话',
    },
    // 技能表熟练度数值范围
    {
      id: 'skill_proficiency_range',
      name: '技能熟练度范围',
      description: '技能熟练度必须在 0-100 之间',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '技能表',
      targetColumn: '熟练度',
      ruleType: 'numeric',
      config: { min: 0, max: 100 },
      errorMessage: '熟练度必须在 0-100 之间',
    },
    // 重要人物表在场状态枚举
    {
      id: 'npc_presence_enum',
      name: '重要人物在场状态',
      description: '在场状态必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '重要人物表',
      targetColumn: '在场状态',
      ruleType: 'enum',
      config: { values: ['在场', '离场'] },
      errorMessage: '在场状态必须为：在场、离场',
    },
    // 世界地图点探索状态枚举
    {
      id: 'map_explore_enum',
      name: '地图点探索状态',
      description: '探索状态必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '世界地图点',
      targetColumn: '探索状态',
      ruleType: 'enum',
      config: { values: ['未探索', '部分探索', '已探索'] },
      errorMessage: '探索状态必须为：未探索、部分探索、已探索',
    },
    // 世界地图点重要度枚举
    {
      id: 'map_importance_enum',
      name: '地图点重要度',
      description: '重要度必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '世界地图点',
      targetColumn: '重要度',
      ruleType: 'enum',
      config: { values: ['核心', '重要', '普通'] },
      errorMessage: '重要度必须为：核心、重要、普通',
    },
    // 重要情报重要度枚举
    {
      id: 'intel_importance_enum',
      name: '情报重要度',
      description: '重要度必须为指定值之一',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '重要情报',
      targetColumn: '重要度',
      ruleType: 'enum',
      config: { values: ['核心', '重要', '普通'] },
      errorMessage: '重要度必须为：核心、重要、普通',
    },
    // 主角所在地点关联验证
    {
      id: 'player_location_relation',
      name: '主角地点关联',
      description: '主角所在地点必须存在于世界地图点表',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '主角信息',
      targetColumn: '所在地点',
      ruleType: 'relation',
      config: { refTable: '世界地图点', refColumn: '详细地点' },
      errorMessage: '所在地点必须是世界地图点表中已存在的详细地点',
    },
    // NPC所在地点关联验证
    {
      id: 'npc_location_relation',
      name: 'NPC地点关联',
      description: 'NPC所在地点必须存在于世界地图点表',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '重要人物表',
      targetColumn: '所在地点',
      ruleType: 'relation',
      config: { refTable: '世界地图点', refColumn: '详细地点' },
      errorMessage: '所在地点必须是世界地图点表中已存在的详细地点',
    },
    // 地图元素所在地点关联验证（元素的所在地点可以是详细地点或次要地区）
    {
      id: 'element_location_relation',
      name: '元素地点关联',
      description: '元素所在地点必须存在于世界地图点表的详细地点或次要地区',
      enabled: true,
      builtin: true,
      intercept: false,
      targetTable: '地图元素表',
      targetColumn: '所在地点',
      ruleType: 'relation',
      config: { refTable: '世界地图点', refColumn: ['详细地点', '次要地区'] },
      errorMessage: '所在地点必须是世界地图点表中已存在的详细地点或次要地区',
    },
  ];

  // ========================================
  // PresetManager - 验证规则预设管理
  // ========================================
  const STORAGE_KEY_PRESETS = 'acu_validation_presets_v1';
  const STORAGE_KEY_ACTIVE_PRESET = 'acu_active_preset_id';

  const PresetManager = {
    _cache: null,

    // 获取所有预设
    getAllPresets() {
      if (this._cache) return this._cache;
      const stored = Store.get(STORAGE_KEY_PRESETS, null);
      if (!stored) {
        this._initDefaultPreset();
        return this._cache;
      }
      this._cache = stored;
      return stored;
    },

    // 获取当前激活的预设
    getActivePreset() {
      const presets = this.getAllPresets();
      const activeId = Store.get(STORAGE_KEY_ACTIVE_PRESET, 'default');
      return presets.find(p => p.id === activeId) || presets[0];
    },

    // 设置激活预设
    setActivePreset(id) {
      if (!this.getAllPresets().find(p => p.id === id)) return false;
      Store.set(STORAGE_KEY_ACTIVE_PRESET, id);
      ValidationRuleManager.clearCache();
      console.log('[PresetManager] 切换预设:', id);
      return true;
    },

    // 创建新预设
    createPreset(name) {
      const presets = this.getAllPresets();
      const newPreset = {
        id: 'preset_' + Date.now(),
        name: name || '新预设',
        builtin: false,
        rules: [],
        createdAt: new Date().toISOString(),
      };
      presets.push(newPreset);
      this._save(presets);
      return newPreset;
    },

    // 复制预设
    duplicatePreset(id) {
      const source = this.getAllPresets().find(p => p.id === id);
      if (!source) return null;
      const presets = this.getAllPresets();
      const newPreset = {
        id: 'preset_' + Date.now(),
        name: source.name + ' (副本)',
        builtin: false,
        rules: JSON.parse(JSON.stringify(source.rules)),
        createdAt: new Date().toISOString(),
      };
      presets.push(newPreset);
      this._save(presets);
      console.log('[PresetManager] 复制预设:', source.name, '->', newPreset.name);
      return newPreset;
    },

    // 删除预设（只保护 id='default' 的默认预设）
    deletePreset(id) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === id);
      if (!preset || preset.id === 'default') return false; // 只保护默认预设
      const filtered = presets.filter(p => p.id !== id);
      this._save(filtered);
      if (Store.get(STORAGE_KEY_ACTIVE_PRESET) === id) {
        Store.set(STORAGE_KEY_ACTIVE_PRESET, 'default');
        ValidationRuleManager.clearCache();
      }
      console.log('[PresetManager] 删除预设:', id);
      return true;
    },

    // 更新预设规则
    updatePresetRules(id, rules) {
      const presets = this.getAllPresets();
      const preset = presets.find(p => p.id === id);
      if (!preset) return false;
      preset.rules = rules;
      this._save(presets);
      ValidationRuleManager.clearCache();
      return true;
    },

    // 导出预设
    exportPreset(id) {
      const preset = this.getAllPresets().find(p => p.id === id);
      if (!preset) return null;
      return JSON.stringify({ format: 'acu_preset_v1', preset: { name: preset.name, rules: preset.rules } }, null, 2);
    },

    // 导入预设
    importPreset(json) {
      try {
        const data = JSON.parse(json);
        if (data.format !== 'acu_preset_v1' || !data.preset) return null;
        const presets = this.getAllPresets();
        const newPreset = {
          id: 'imported_' + Date.now(),
          name: data.preset.name || '导入的预设',
          builtin: false,
          rules: data.preset.rules || [],
          createdAt: new Date().toISOString(),
        };
        presets.push(newPreset);
        this._save(presets);
        console.log('[PresetManager] 导入预设:', newPreset.name);
        return newPreset;
      } catch (e) {
        console.error('[PresetManager] 导入失败:', e);
        return null;
      }
    },

    // 初始化默认预设
    _initDefaultPreset() {
      const defaultPreset = {
        id: 'default',
        name: '默认预设',
        builtin: true,
        rules: BUILTIN_VALIDATION_RULES.map(r => ({ ...r })),
        createdAt: new Date().toISOString(),
      };
      // 迁移旧版自定义规则
      const oldCustom = Store.get(STORAGE_KEY_VALIDATION_RULES, []);
      if (oldCustom.length > 0) {
        defaultPreset.rules.push(...oldCustom.map(r => ({ ...r, builtin: false })));
        console.log('[PresetManager] 迁移旧规则:', oldCustom.length, '条');
      }
      this._cache = [defaultPreset];
      this._save(this._cache);
      Store.set(STORAGE_KEY_ACTIVE_PRESET, 'default');
    },

    // 恢复默认预设的规则
    resetDefaultPreset() {
      const presets = this.getAllPresets();
      const defaultPreset = presets.find(p => p.id === 'default');
      if (defaultPreset) {
        defaultPreset.rules = BUILTIN_VALIDATION_RULES.map(r => ({ ...r }));
        this._save(presets);
        ValidationRuleManager.clearCache();
        console.log('[PresetManager] 默认预设已恢复');
        return true;
      }
      return false;
    },

    _save(presets) {
      Store.set(STORAGE_KEY_PRESETS, presets);
      this._cache = presets;
    },

    clearCache() {
      this._cache = null;
    },
  };

  // 验证规则管理器（从 PresetManager 获取规则）
  const ValidationRuleManager = {
    _cache: null,
    _enabledCache: null,

    // 获取所有规则（从当前激活预设）
    getAllRules() {
      if (this._cache) return this._cache;

      const preset = PresetManager.getActivePreset();
      const enabledStates = this.getEnabledStates();

      // 应用启用状态
      const allRules = (preset?.rules || []).map(rule => ({
        ...rule,
        enabled: enabledStates[rule.id] !== undefined ? enabledStates[rule.id] : rule.enabled,
      }));

      this._cache = allRules;
      return allRules;
    },

    // 获取启用状态映射
    getEnabledStates() {
      if (this._enabledCache) return this._enabledCache;
      this._enabledCache = Store.get(STORAGE_KEY_VALIDATION_ENABLED, {});
      return this._enabledCache;
    },

    // 切换规则启用状态
    toggleRuleEnabled(ruleId, enabled) {
      const states = this.getEnabledStates();
      states[ruleId] = enabled;
      Store.set(STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;
      this._cache = null; // 清除缓存以便下次重新计算
      console.log(`[ValidationRuleManager] 规则 ${ruleId} 已${enabled ? '启用' : '禁用'}`);
    },

    // 切换规则拦截状态
    toggleRuleIntercept(ruleId, intercept) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const rule = preset.rules.find(r => r.id === ruleId);
      if (!rule) return false;

      rule.intercept = intercept;
      PresetManager.updatePresetRules(preset.id, preset.rules);
      console.log(`[ValidationRuleManager] 规则 ${ruleId} 拦截已${intercept ? '启用' : '关闭'}`);
      return true;
    },

    // 获取启用的规则
    getEnabledRules() {
      return this.getAllRules().filter(rule => rule.enabled);
    },

    // 添加自定义规则（到当前激活预设）
    addCustomRule(rule) {
      if (!rule.id || !rule.name || !rule.targetTable) {
        console.error('[ValidationRuleManager] 规则缺少必要字段');
        return false;
      }

      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      // 检查 ID 是否重复
      if (preset.rules.some(r => r.id === rule.id)) {
        console.error('[ValidationRuleManager] 规则 ID 已存在:', rule.id);
        return false;
      }

      const newRule = { ...rule, builtin: false, enabled: true };
      preset.rules.push(newRule);
      PresetManager.updatePresetRules(preset.id, preset.rules);
      console.log('[ValidationRuleManager] 添加规则:', newRule.name);
      return true;
    },

    // 删除规则
    removeCustomRule(ruleId) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules.splice(index, 1);
      PresetManager.updatePresetRules(preset.id, preset.rules);

      // 清理启用状态
      const states = this.getEnabledStates();
      delete states[ruleId];
      Store.set(STORAGE_KEY_VALIDATION_ENABLED, states);
      this._enabledCache = states;

      console.log('[ValidationRuleManager] 删除规则:', ruleId);
      return true;
    },

    // 更新规则
    updateCustomRule(ruleId, updates) {
      const preset = PresetManager.getActivePreset();
      if (!preset) return false;

      const index = preset.rules.findIndex(r => r.id === ruleId);
      if (index === -1) return false;

      preset.rules[index] = { ...preset.rules[index], ...updates, id: ruleId };
      PresetManager.updatePresetRules(preset.id, preset.rules);
      return true;
    },

    // 清除缓存
    clearCache() {
      this._cache = null;
      this._enabledCache = null;
    },

    // 获取按表名分组的规则
    getRulesByTable(tableName) {
      return this.getEnabledRules().filter(rule => rule.targetTable === tableName);
    },
  };

  // ========================================
  // ValidationEngine - 数据验证引擎
  // ========================================
  const ValidationEngine = {
    // 格式验证（正则表达式）
    validateFormat(value, pattern) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      try {
        const regex = new RegExp(pattern);
        return regex.test(String(value));
      } catch (e) {
        console.error('[ValidationEngine] 正则表达式错误:', pattern, e);
        return true; // 正则错误时跳过验证
      }
    },

    // 枚举验证
    validateEnum(value, allowedValues) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      if (!Array.isArray(allowedValues) || allowedValues.length === 0) return true;
      return allowedValues.includes(String(value));
    },

    // 数值范围验证
    validateNumeric(value, min, max) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证

      // 提取数值（支持 "50/100" 或 "力量:80" 等格式）
      const strVal = String(value);
      let numVal;

      // 尝试解析百分比格式 "50%"
      if (strVal.endsWith('%')) {
        numVal = parseFloat(strVal);
      }
      // 尝试解析分数格式 "50/100"
      else if (strVal.includes('/')) {
        const parts = strVal.split('/');
        numVal = parseFloat(parts[0]);
      }
      // 尝试解析 "属性:数值" 格式
      else if (strVal.includes(':')) {
        const parts = strVal.split(':');
        numVal = parseFloat(parts[parts.length - 1]);
      }
      // 直接解析数字
      else {
        numVal = parseFloat(strVal);
      }

      if (isNaN(numVal)) return true; // 非数值跳过

      if (min !== undefined && min !== null && numVal < min) return false;
      if (max !== undefined && max !== null && numVal > max) return false;
      return true;
    },

    // 关联验证（检查值是否存在于另一表的某列，支持多列 OR 检查）
    validateRelation(value, rawData, refTable, refColumn) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      if (!rawData || !refTable || !refColumn) return true;

      // 查找引用表
      let refSheet = null;
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === refTable) {
          refSheet = rawData[sheetId];
          break;
        }
      }

      if (!refSheet || !refSheet.content || refSheet.content.length < 2) {
        return true; // 引用表不存在或为空时跳过
      }

      const headers = refSheet.content[0];
      const strVal = String(value);

      // 支持 refColumn 为数组，任一列匹配即可
      const columns = Array.isArray(refColumn) ? refColumn : [refColumn];

      for (const col of columns) {
        const refColIndex = headers.indexOf(col);
        if (refColIndex === -1) continue; // 该列不存在，跳过检查下一列

        // 检查值是否存在于该引用列
        for (let i = 1; i < refSheet.content.length; i++) {
          if (String(refSheet.content[i][refColIndex] || '') === strVal) {
            return true; // 任一列匹配即通过
          }
        }
      }

      return columns.length === 0; // 空列数组返回 true，否则返回 false（所有列都未匹配）
    },

    // 必填验证
    validateRequired(value) {
      return value !== null && value !== undefined && String(value).trim() !== '';
    },

    // 表级只读验证（比较新旧数据）
    validateTableReadonly(oldContent, newContent) {
      if (!oldContent || !newContent) return true;
      return JSON.stringify(oldContent) === JSON.stringify(newContent);
    },

    // 行数限制验证
    validateRowLimit(rowCount, min, max) {
      if (min !== undefined && min !== null && rowCount < min) return false;
      if (max !== undefined && max !== null && rowCount > max) return false;
      return true;
    },

    // 检查拦截规则（用于更新拦截，检查所有启用了 intercept 的规则）
    checkTableRules(snapshot, newData, rules) {
      const violations = [];
      if (!snapshot || !newData || !rules) return violations;

      for (const rule of rules) {
        // 只检查启用了拦截的规则
        if (!rule.enabled || !rule.intercept) continue;
        const typeInfo = RULE_TYPE_INFO[rule.ruleType];
        if (!typeInfo) continue;

        // 查找目标表
        let oldSheet = null,
          newSheet = null;
        for (const sheetId in snapshot) {
          if (snapshot[sheetId]?.name === rule.targetTable) {
            oldSheet = snapshot[sheetId];
            break;
          }
        }
        for (const sheetId in newData) {
          if (newData[sheetId]?.name === rule.targetTable) {
            newSheet = newData[sheetId];
            break;
          }
        }

        if (!newSheet) continue;

        // 表级规则检查
        if (typeInfo.scope === 'table') {
          if (rule.ruleType === 'tableReadonly') {
            if (!this.validateTableReadonly(oldSheet?.content, newSheet?.content)) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                message: rule.errorMessage || `表 "${rule.targetTable}" 为只读，不允许修改`,
              });
            }
          } else if (rule.ruleType === 'rowLimit') {
            const rowCount = (newSheet.content?.length || 1) - 1; // 减去表头
            if (!this.validateRowLimit(rowCount, rule.config?.min, rule.config?.max)) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                message:
                  rule.errorMessage ||
                  `表 "${rule.targetTable}" 行数 ${rowCount} 超出限制 (${rule.config?.min || 0}-${rule.config?.max || '∞'})`,
              });
            }
          }
        }
        // 字段级规则检查
        else if (typeInfo.scope === 'field' && rule.targetColumn) {
          const headers = newSheet.content?.[0] || [];
          const colIndex = headers.indexOf(rule.targetColumn);
          if (colIndex === -1) continue;

          // 检查新数据中的每一行
          for (let rowIdx = 1; rowIdx < (newSheet.content?.length || 0); rowIdx++) {
            const row = newSheet.content[rowIdx];
            const value = row?.[colIndex];
            const isValid = this.validateValue(value, rule, newData);

            if (!isValid) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                rowIndex: rowIdx,
                columnName: rule.targetColumn,
                currentValue: String(value ?? ''),
                message: rule.errorMessage || `字段 "${rule.targetColumn}" 验证失败`,
              });
              // 只报告第一个违规即可触发回滚
              break;
            }
          }
        }
      }
      return violations;
    },

    // 验证单个值
    validateValue(value, rule, rawData) {
      switch (rule.ruleType) {
        case 'format':
          return this.validateFormat(value, rule.config?.pattern);
        case 'enum':
          return this.validateEnum(value, rule.config?.values);
        case 'numeric':
          return this.validateNumeric(value, rule.config?.min, rule.config?.max);
        case 'relation':
          return this.validateRelation(value, rawData, rule.config?.refTable, rule.config?.refColumn);
        case 'required':
          return this.validateRequired(value);
        default:
          return true;
      }
    },

    // 验证单行数据
    validateRow(row, headers, tableName, rowIndex, rules, rawData) {
      const errors = [];

      for (const rule of rules) {
        if (rule.targetTable !== tableName) continue;
        if (!rule.enabled) continue;

        // 找到目标列
        const colIndex = headers.indexOf(rule.targetColumn);
        if (colIndex === -1) continue;

        const value = row[colIndex];
        const isValid = this.validateValue(value, rule, rawData);

        if (!isValid) {
          errors.push({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: rule.ruleType,
            rule: rule, // 保存完整规则对象用于智能修改
            tableName: tableName,
            rowIndex: rowIndex,
            columnName: rule.targetColumn,
            currentValue: String(value ?? ''),
            errorMessage: rule.errorMessage,
            severity: 'error',
          });
        }
      }

      return errors;
    },

    // 验证整个数据集
    validateAllData(rawData) {
      if (!rawData) return [];

      const rules = ValidationRuleManager.getEnabledRules();
      if (rules.length === 0) return [];

      const allErrors = [];

      for (const sheetId in rawData) {
        if (!sheetId.startsWith('sheet_')) continue;
        const sheet = rawData[sheetId];
        if (!sheet?.name || !sheet?.content || sheet.content.length < 2) continue;

        const tableName = sheet.name;
        const headers = sheet.content[0];
        const tableRules = rules.filter(r => r.targetTable === tableName);

        if (tableRules.length === 0) continue;

        // 检查表级规则（如行数限制）
        for (const rule of tableRules) {
          const typeInfo = RULE_TYPE_INFO[rule.ruleType];
          if (typeInfo?.scope === 'table') {
            if (rule.ruleType === 'rowLimit') {
              const rowCount = sheet.content.length - 1;
              if (!this.validateRowLimit(rowCount, rule.config?.min, rule.config?.max)) {
                allErrors.push({
                  ruleId: rule.id,
                  ruleName: rule.name,
                  ruleType: rule.ruleType,
                  rule: rule, // 保存完整规则对象用于智能修改
                  tableName: tableName,
                  rowIndex: -1, // 表级错误
                  columnName: '',
                  currentValue: `${rowCount} 行`,
                  errorMessage:
                    rule.errorMessage ||
                    `行数 ${rowCount} 超出限制 (${rule.config?.min || 0}-${rule.config?.max || '∞'})`,
                  severity: 'warning',
                });
              }
            }
            // tableReadonly 不在这里检查（需要对比快照）
          }
        }

        // 验证每一行（字段级规则）
        const fieldRules = tableRules.filter(r => RULE_TYPE_INFO[r.ruleType]?.scope !== 'table');
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          const rowErrors = this.validateRow(row, headers, tableName, i - 1, fieldRules, rawData);
          allErrors.push(...rowErrors);
        }
      }

      return allErrors;
    },

    // 验证特定表的数据
    validateTable(rawData, tableName) {
      if (!rawData) return [];

      const rules = ValidationRuleManager.getRulesByTable(tableName);
      if (rules.length === 0) return [];

      // 查找表
      let targetSheet = null;
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === tableName) {
          targetSheet = rawData[sheetId];
          break;
        }
      }

      if (!targetSheet || !targetSheet.content || targetSheet.content.length < 2) {
        return [];
      }

      const headers = targetSheet.content[0];
      const allErrors = [];

      for (let i = 1; i < targetSheet.content.length; i++) {
        const row = targetSheet.content[i];
        const rowErrors = this.validateRow(row, headers, tableName, i - 1, rules, rawData);
        allErrors.push(...rowErrors);
      }

      return allErrors;
    },

    // 按表名分组验证结果
    groupErrorsByTable(errors) {
      const grouped = {};
      for (const error of errors) {
        if (!grouped[error.tableName]) {
          grouped[error.tableName] = [];
        }
        grouped[error.tableName].push(error);
      }
      return grouped;
    },

    // 获取验证错误数量
    getErrorCount(rawData) {
      return this.validateAllData(rawData).length;
    },
  };

  // ========================================
  // LocalAvatarDB - 本地头像 IndexedDB 存储
  // ========================================
  const LocalAvatarDB = {
    DB_NAME: 'acu_local_avatars',
    STORE_NAME: 'avatars',
    DB_VERSION: 1,
    _db: null,
    _urlCache: new Map(), // 缓存 ObjectURL 避免重复创建

    // 初始化数据库
    async init() {
      if (this._db) return this._db;

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

        request.onerror = () => {
          console.error('[LocalAvatarDB] 打开数据库失败:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };

        request.onupgradeneeded = event => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            // 主键为角色名
            db.createObjectStore(this.STORE_NAME, { keyPath: 'name' });
          }
        };
      });
    },

    // 保存图片（自动去重：相同 name 会覆盖）
    async save(name, blob) {
      if (!name || !blob) return false;

      try {
        const db = await this.init();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);

          // 清理旧的 ObjectURL 缓存
          if (this._urlCache.has(name)) {
            URL.revokeObjectURL(this._urlCache.get(name));
            this._urlCache.delete(name);
          }

          const data = {
            name: name,
            blob: blob,
            size: blob.size,
            type: blob.type,
            updatedAt: Date.now(),
          };

          const request = store.put(data);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[LocalAvatarDB] 保存失败:', request.error);
            reject(request.error);
          };
        });
      } catch (e) {
        console.error('[LocalAvatarDB] save error:', e);
        return false;
      }
    },

    // 获取图片 URL（返回 ObjectURL）
    async get(name) {
      if (!name) return null;

      // 先查缓存
      if (this._urlCache.has(name)) {
        return this._urlCache.get(name);
      }

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.get(name);

          request.onsuccess = () => {
            const data = request.result;
            if (data && data.blob) {
              const url = URL.createObjectURL(data.blob);
              this._urlCache.set(name, url);
              resolve(url);
            } else {
              resolve(null);
            }
          };

          request.onerror = () => resolve(null);
        });
      } catch (e) {
        console.error('[LocalAvatarDB] get error:', e);
        return null;
      }
    },

    // 检查是否存在本地图片
    async has(name) {
      if (!name) return false;

      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getKey(name);

          request.onsuccess = () => resolve(request.result !== undefined);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        return false;
      }
    },

    // 删除图片
    async delete(name) {
      if (!name) return false;

      try {
        // 清理 ObjectURL 缓存
        if (this._urlCache.has(name)) {
          URL.revokeObjectURL(this._urlCache.get(name));
          this._urlCache.delete(name);
        }

        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.delete(name);

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[LocalAvatarDB] delete error:', e);
        return false;
      }
    },

    // 获取所有已存储的角色名列表
    async getAllNames() {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getAllKeys();

          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => resolve([]);
        });
      } catch (e) {
        return [];
      }
    },

    // 获取存储统计信息
    async getStats() {
      try {
        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            const items = request.result || [];
            const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
            resolve({
              count: items.length,
              totalSize: totalSize,
              totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
            });
          };

          request.onerror = () => resolve({ count: 0, totalSize: 0, totalSizeMB: '0' });
        });
      } catch (e) {
        return { count: 0, totalSize: 0, totalSizeMB: '0' };
      }
    },

    // 清理所有数据
    async clearAll() {
      try {
        // 清理所有 ObjectURL 缓存
        this._urlCache.forEach(url => URL.revokeObjectURL(url));
        this._urlCache.clear();

        const db = await this.init();
        return new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const store = tx.objectStore(this.STORE_NAME);
          const request = store.clear();

          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      } catch (e) {
        console.error('[LocalAvatarDB] clearAll error:', e);
        return false;
      }
    },
  };

  // [新增] 获取 SillyTavern 用户头像 URL
  const getUserAvatarUrl = () => {
    try {
      // 方法1: 从页面 DOM 中查找用户头像元素
      const w = window.parent || window;
      const $ = w.jQuery || window.jQuery;
      if ($) {
        // SillyTavern 用户头像通常在 #user_avatar_block img 或 .avatar[title="You"] img
        const $avatar = $('#user_avatar_block img').first();
        if ($avatar.length && $avatar.attr('src')) {
          return $avatar.attr('src');
        }
        // 备选：查找聊天中用户消息的头像
        const $userMes = $('.mes[is_user="true"]').last().find('.avatar img');
        if ($userMes.length && $userMes.attr('src')) {
          return $userMes.attr('src');
        }
      }
      // 方法2: 尝试从 SillyTavern API 获取
      const ST = w.SillyTavern || window.SillyTavern;
      if (ST && ST.getContext) {
        const ctx = ST.getContext();
        if (ctx && ctx.userAvatar) {
          return ctx.userAvatar;
        }
      }
    } catch (e) {
      console.warn('[ACU] getUserAvatarUrl error:', e);
    }
    return null;
  };

  // [新增] 获取主角名字（用于判断是否是主角）
  const getPlayerName = () => {
    const rawData = cachedRawData || (typeof getTableData === 'function' ? getTableData() : null);
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]?.[1]) {
          return sheet.content[1][1];
        }
      }
    }
    return null;
  };

  // [新增] 获取 SillyTavern Persona 名称（用于显示）
  const getPersonaName = () => {
    try {
      // 方法1: SillyTavern 标准 API
      const w = window.parent || window;
      if (w.SillyTavern?.getContext) {
        const ctx = w.SillyTavern.getContext();
        if (ctx?.name1) return ctx.name1;
      }
      // 方法2: 直接访问全局变量
      if (typeof name1 !== 'undefined' && name1) return name1;
      if (w.name1) return w.name1;
      // 方法3: 从 DOM 中查找
      const $ = w.jQuery || window.jQuery;
      if ($) {
        const $persona = $('#user_avatar_block .avatar-name, #persona_name_input').first();
        if ($persona.length) {
          const name = $persona.val?.() || $persona.text?.();
          if (name && name.trim()) return name.trim();
        }
      }
    } catch (e) {
      console.warn('[ACU] getPersonaName error:', e);
    }
    return null;
  };

  // [新增] 获取用于显示的玩家名称（优先 Persona，其次主角表，最后默认值）
  const getDisplayPlayerName = () => {
    return getPersonaName() || getPlayerName() || '主角';
  };

  // [新增] 替换文本中的用户占位符为 Persona 名称（仅用于显示）
  const replaceUserPlaceholders = text => {
    if (!text || typeof text !== 'string') return text;
    const displayName = getDisplayPlayerName();
    // 替换 <user>、{{user}}（不区分大小写）
    let result = text.replace(/<user>/gi, displayName);
    result = result.replace(/\{\{user\}\}/gi, displayName);
    return result;
  };
  // 头像管理工具（支持裁剪偏移）
  const AvatarManager = {
    _cache: null,

    load() {
      if (!this._cache) {
        const raw = Store.get(STORAGE_KEY_AVATAR_MAP, {});
        this._cache = {};
        for (const name in raw) {
          if (typeof raw[name] === 'string') {
            this._cache[name] = { url: raw[name], offsetX: 50, offsetY: 50, scale: 150, aliases: [] };
          } else {
            this._cache[name] = {
              url: raw[name].url || '',
              offsetX: raw[name].offsetX ?? 50,
              offsetY: raw[name].offsetY ?? 50,
              scale: raw[name].scale ?? 150,
              aliases: raw[name].aliases || [],
            };
          }
        }
      }
      return this._cache;
    },

    save() {
      Store.set(STORAGE_KEY_AVATAR_MAP, this._cache || {});
      this._cache = null;
    },

    // 同步获取（仅 URL 和 ST 头像，不含本地图片）
    get(name) {
      const data = this.load()[name];
      if (data && data.url) return data.url;

      for (const key in this._cache) {
        if (this._cache[key].aliases && this._cache[key].aliases.includes(name)) {
          if (this._cache[key].url) return this._cache[key].url;
        }
      }

      const playerName = getPlayerName();
      if (name === '<user>' || name === '主角' || (playerName && name === playerName)) {
        const stAvatar = getUserAvatarUrl();
        if (stAvatar) return stAvatar;
      }

      return null;
    },

    // 异步获取（优先级：本地图片 > URL > ST头像）
    async getAsync(name) {
      if (!name) return null;

      // 判断是否是主角
      const playerName = getPlayerName();
      const isPlayer = name === '<user>' || name === '主角' || (playerName && name === playerName);

      // 1. 优先查本地 IndexedDB
      const localUrl = await LocalAvatarDB.get(name);
      if (localUrl) return localUrl;

      // 2. 如果是主角，也尝试用 <user> 查找
      if (isPlayer && name !== '<user>') {
        const userLocalUrl = await LocalAvatarDB.get('<user>');
        if (userLocalUrl) return userLocalUrl;
      }

      // 3. 检查别名对应的本地图片
      const primaryName = this.getPrimaryName(name);
      if (primaryName !== name) {
        const aliasLocalUrl = await LocalAvatarDB.get(primaryName);
        if (aliasLocalUrl) return aliasLocalUrl;
      }

      // 4. 回退到同步方法（URL / ST头像）
      return this.get(name);
    },

    // 检查是否有本地图片
    async hasLocalAvatar(name) {
      if (!name) return false;
      const has = await LocalAvatarDB.has(name);
      if (has) return true;

      const primaryName = this.getPrimaryName(name);
      if (primaryName !== name) {
        return await LocalAvatarDB.has(primaryName);
      }
      return false;
    },

    // 保存本地图片
    async saveLocalAvatar(name, blob) {
      return await LocalAvatarDB.save(name, blob);
    },

    // 删除本地图片
    async deleteLocalAvatar(name) {
      return await LocalAvatarDB.delete(name);
    },

    getOffsetX(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.offsetX ?? 50) : 50;
    },

    getOffsetY(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.offsetY ?? 50) : 50;
    },

    getScale(name) {
      const data = this._resolveByAlias(name);
      return data ? (data.scale ?? 150) : 150;
    },

    // 根据名字或别名找到主记录
    _resolveByAlias(name) {
      const data = this.load()[name];
      if (data) return data;
      for (const key in this._cache) {
        if (this._cache[key].aliases && this._cache[key].aliases.includes(name)) {
          return this._cache[key];
        }
      }
      return null;
    },

    // 获取主名称（如果传入的是别名，返回主名称）
    getPrimaryName(name) {
      if (this.load()[name]) return name;
      for (const key in this._cache) {
        if (this._cache[key].aliases && this._cache[key].aliases.includes(name)) {
          return key;
        }
      }
      return name;
    },

    set(name, url, offsetX = 50, offsetY = 50, scale = 150, aliases = []) {
      this.load()[name] = { url, offsetX, offsetY, scale, aliases };
      this.save();
    },

    setPosition(name, offsetX, offsetY) {
      const data = this.load()[name];
      if (data) {
        data.offsetX = offsetX;
        data.offsetY = offsetY;
        this.save();
      }
    },

    setScale(name, scale) {
      const data = this.load()[name];
      if (data) {
        data.scale = scale;
        this.save();
      }
    },

    setAliases(name, aliases) {
      const data = this.load()[name];
      if (data) {
        data.aliases = aliases;
        this.save();
      }
    },

    remove(name) {
      delete this.load()[name];
      this.save();
    },

    getAll() {
      return this.load();
    },

    // 导出为JSON对象
    exportData() {
      return {
        version: 1,
        exportTime: new Date().toISOString(),
        avatars: this.load(),
      };
    },

    // 导入数据，返回统计信息
    importData(jsonData, overwriteConflicts = true) {
      if (!jsonData || !jsonData.avatars) {
        throw new Error('无效的配置文件格式');
      }

      const current = this.load();
      const stats = { added: 0, updated: 0, skipped: 0 };

      for (const name in jsonData.avatars) {
        const imported = jsonData.avatars[name];
        if (!imported.url) continue;

        if (current[name]) {
          // 冲突
          if (overwriteConflicts) {
            current[name] = {
              url: imported.url,
              offsetX: imported.offsetX ?? 50,
              offsetY: imported.offsetY ?? 50,
              scale: imported.scale ?? 150,
              aliases: imported.aliases || [],
            };
            stats.updated++;
          } else {
            stats.skipped++;
          }
        } else {
          // 新增
          current[name] = {
            url: imported.url,
            offsetX: imported.offsetX ?? 50,
            offsetY: imported.offsetY ?? 50,
            scale: imported.scale ?? 150,
            aliases: imported.aliases || [],
          };
          stats.added++;
        }
      }

      this.save();
      return stats;
    },

    // 分析导入文件，返回冲突信息
    analyzeImport(jsonData) {
      if (!jsonData || !jsonData.avatars) {
        return { valid: false, error: '无效的配置文件格式' };
      }

      const current = this.load();
      const result = { valid: true, total: 0, newItems: [], conflicts: [] };

      for (const name in jsonData.avatars) {
        if (!jsonData.avatars[name].url) continue;
        result.total++;
        if (current[name]) {
          result.conflicts.push(name);
        } else {
          result.newItems.push(name);
        }
      }

      return result;
    },
  };

  // ========================================
  // MVU 变量可视化模块 v2.0
  // 独立模块 - 卡片分组式 UI
  // ========================================
  const MvuModule = (function () {
    'use strict';

    // ===== 私有变量 =====
    const MODULE_ID = '__mvu__';

    // ===== 样式定义 =====
    const STYLES = `
            /* MVU 面板容器 */
            .acu-mvu-panel {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .acu-mvu-panel .acu-panel-header {
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                padding: 10px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            .acu-mvu-panel .acu-panel-header .acu-panel-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: var(--acu-text-main);
            }
            .acu-mvu-panel .acu-panel-header .acu-panel-title i {
                color: var(--acu-accent);
            }
            .acu-mvu-panel .acu-header-actions {
                display: flex;
                gap: 4px;
            }
            .acu-mvu-panel .mvu-header-btn {
                background: transparent;
                border: 1px solid var(--acu-border);
                color: var(--acu-text-sub);
                cursor: pointer;
                padding: 5px 10px;
                font-size: 13px;
                border-radius: 4px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-mvu-panel .mvu-header-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
            }

            /* MVU 内容区 */
            .mvu-content {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                scrollbar-width: none;
            }
            .mvu-content::-webkit-scrollbar {
                display: none;
            }

            /* MVU 卡片 */
            .mvu-card {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 10px;
                overflow: hidden;
            }
            .mvu-card:last-child {
                margin-bottom: 0;
            }
            .mvu-card-header {
                background: var(--acu-table-head);
                padding: 8px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                user-select: none;
                transition: background 0.2s;
            }
            .mvu-card-header:hover {
                background: var(--acu-table-hover);
            }
            .mvu-card-title {
                font-weight: 600;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .mvu-card-count {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: normal;
            }
            .mvu-card-toggle {
                color: var(--acu-text-sub);
                font-size: 10px;
                transition: transform 0.2s;
            }
            .mvu-card.collapsed .mvu-card-toggle {
                transform: rotate(-90deg);
            }
            .mvu-card-body {
                padding: 8px 12px;
                display: block;
            }
            .mvu-card.collapsed .mvu-card-body {
                display: none;
            }

            /* 嵌套卡片 */
            .mvu-card .mvu-card {
                background: var(--acu-table-head);
                margin: 6px 0;
            }
            .mvu-card .mvu-card .mvu-card-header {
                background: rgba(128,128,128,0.1);
                padding: 6px 10px;
            }
            .mvu-card .mvu-card .mvu-card-body {
                padding: 6px 10px;
            }

            /* 键值对行 */
            .mvu-row {
                display: flex;
                align-items: flex-start;
                padding: 5px 0;
                border-bottom: 1px dashed var(--acu-border);
            }
            .mvu-row:last-child {
                border-bottom: none;
            }
            .mvu-key {
                color: var(--acu-text-sub);
                min-width: 80px;
                max-width: 120px;
                flex-shrink: 0;
                font-size: 12px;
                padding-right: 8px;
                word-break: break-all;
            }
            .mvu-value-wrap {
                flex: 1;
                display: flex;
                align-items: flex-start;
                gap: 6px;
                min-width: 0;
            }
            .mvu-value {
                color: var(--acu-text-main);
                font-size: 13px;
                cursor: pointer;
                padding: 1px 6px;
                border-radius: 4px;
                transition: background 0.2s;
                word-break: break-word;
                flex: 1;
            }
            .mvu-value:hover {
                background: var(--acu-table-hover);
            }
            .mvu-value.mvu-array-value {
                font-size: 12px;
                color: var(--acu-text-sub);
            }
            .mvu-change-indicator {
                color: var(--acu-success-text);
                font-weight: bold;
                font-size: 12px;
                flex-shrink: 0;
            }
            .mvu-row.mvu-changed {
                background: var(--acu-success-bg);
                margin: 0 -12px;
                padding: 5px 12px;
                border-radius: 4px;
            }
            .mvu-card .mvu-card .mvu-row.mvu-changed {
                margin: 0 -10px;
                padding: 5px 10px;
            }

            /* 空状态 */
            .mvu-empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--acu-text-sub);
            }
            .mvu-empty i {
                font-size: 32px;
                margin-bottom: 12px;
                display: block;
                opacity: 0.5;
            }
            .mvu-empty p {
                margin: 0 0 6px 0;
            }
            .mvu-empty .mvu-empty-hint {
                font-size: 12px;
                opacity: 0.7;
            }

            /* 编辑弹窗 */
            .mvu-edit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                animation: mvuFadeIn 0.15s ease-out;
            }
            .mvu-edit-dialog {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                padding: 16px;
                width: 90%;
                max-width: 400px;
                animation: mvuSlideIn 0.2s ease-out;
            }
            .mvu-edit-title {
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .mvu-edit-path {
                font-size: 11px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                padding: 6px 10px;
                border-radius: 4px;
                margin-bottom: 12px;
                word-break: break-all;
                font-family: monospace;
            }
            .mvu-edit-textarea {
                width: 100%;
                min-height: 80px;
                padding: 10px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg, var(--acu-bg-panel));
                color: var(--acu-text-main);
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
            }
            .mvu-edit-textarea:focus {
                outline: none;
                border-color: var(--acu-accent);
            }
            .mvu-edit-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-top: 8px;
                opacity: 0.7;
            }
            .mvu-edit-btns {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
            .mvu-edit-btn {
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }
            .mvu-edit-btn.mvu-btn-cancel {
                background: transparent;
                border: 1px solid var(--acu-border);
                color: var(--acu-text-sub);
            }
            .mvu-edit-btn.mvu-btn-cancel:hover {
                background: var(--acu-table-hover);
            }
            .mvu-edit-btn.mvu-btn-save {
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                color: #fff;
            }
            .mvu-edit-btn.mvu-btn-save:hover {
                opacity: 0.9;
            }

            @keyframes mvuFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes mvuSlideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            /* 导航按钮 */
            .acu-nav-btn.acu-mvu-btn.active {
                background: var(--acu-btn-active-bg);
                color: var(--acu-btn-active-text);
            }
        `;

    // ===== 工具函数 =====
    function escapeHtml(s) {
      return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function isAvailable() {
      return typeof window.Mvu !== 'undefined' && typeof window.Mvu.getMvuData === 'function';
    }

    function getData() {
      if (!isAvailable()) return null;
      try {
        const allVars = window.Mvu.getMvuData({ type: 'message', message_id: -1 });
        if (!allVars) return null;
        return {
          stat_data: allVars.stat_data || null,
          display_data: allVars.display_data || {},
          delta_data: allVars.delta_data || {},
          schema: allVars.schema || null,
        };
      } catch (e) {
        console.warn('[MvuModule] getData error:', e);
        return null;
      }
    }

    // 判断是否是 ValueWithDescription 格式 [值, "描述"]
    function isVWD(value) {
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[1] === 'string' &&
        (typeof value[0] === 'number' || typeof value[0] === 'string' || typeof value[0] === 'boolean')
      );
    }

    // 判断是否是简单数组（元素都是原始值）
    function isSimpleArray(value) {
      if (!Array.isArray(value)) return false;
      return value.every(
        item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null,
      );
    }

    // 获取变化指示器
    function getChangeIndicator(path, deltaData) {
      if (!deltaData || !path) return '';

      const parts = path.split('.');
      let current = deltaData;
      for (const part of parts) {
        if (current === null || current === undefined) return '';
        current = current[part];
      }

      if (!current) return '';

      if (typeof current === 'string' && current.includes('->')) {
        const match = current.match(/^(-?[\d.]+)->(-?[\d.]+)/);
        if (match) {
          const oldVal = parseFloat(match[1]);
          const newVal = parseFloat(match[2]);
          if (!isNaN(oldVal) && !isNaN(newVal)) {
            return newVal > oldVal ? '↑' : newVal < oldVal ? '↓' : '';
          }
        }
        return '•';
      }
      return '';
    }

    // 统计对象/数组的子项数量
    function countChildren(value) {
      if (Array.isArray(value)) {
        if (isVWD(value)) return 0;
        return value.length;
      }
      if (value && typeof value === 'object') {
        return Object.keys(value).filter(k => !k.startsWith('$')).length;
      }
      return 0;
    }

    // ===== 渲染函数 =====

    // 渲染单个键值对行
    function renderRow(key, value, path, deltaData) {
      const changeIndicator = getChangeIndicator(path, deltaData);
      const changedClass = changeIndicator ? 'mvu-changed' : '';

      let displayValue;
      let valueClass = 'mvu-value';

      if (isVWD(value)) {
        displayValue = String(value[0]);
      } else if (isSimpleArray(value)) {
        displayValue = value.map(v => String(v ?? '')).join(', ');
        valueClass += ' mvu-array-value';
      } else {
        displayValue = String(value ?? '');
      }

      return `
                <div class="mvu-row ${changedClass}">
                    <div class="mvu-key">${escapeHtml(key)}</div>
                    <div class="mvu-value-wrap">
                        <span class="${valueClass}" data-path="${escapeHtml(path)}">${escapeHtml(displayValue)}</span>
                        ${changeIndicator ? `<span class="mvu-change-indicator">${changeIndicator}</span>` : ''}
                    </div>
                </div>
            `;
    }

    // 渲染卡片（递归）
    function renderCard(key, value, path, deltaData, depth, defaultExpanded) {
      const childCount = countChildren(value);
      const collapsedClass = defaultExpanded ? '' : 'collapsed';

      let bodyHtml = '';

      if (Array.isArray(value) && !isVWD(value) && !isSimpleArray(value)) {
        // 复杂数组：每个元素作为子卡片或行
        value.forEach((item, index) => {
          const itemPath = `${path}[${index}]`;

          if (item && typeof item === 'object' && !isVWD(item) && !isSimpleArray(item)) {
            bodyHtml += renderCard(`[${index}]`, item, itemPath, deltaData, depth + 1, false);
          } else {
            bodyHtml += renderRow(`[${index}]`, item, itemPath, deltaData);
          }
        });
      } else if (value && typeof value === 'object' && !isVWD(value)) {
        // 对象：遍历键值
        const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));

        for (const [childKey, childValue] of entries) {
          const childPath = path ? `${path}.${childKey}` : childKey;

          if (childValue && typeof childValue === 'object' && !isVWD(childValue) && !isSimpleArray(childValue)) {
            // 嵌套对象/数组 → 子卡片
            bodyHtml += renderCard(childKey, childValue, childPath, deltaData, depth + 1, false);
          } else {
            // 原始值或简单数组 → 行
            bodyHtml += renderRow(childKey, childValue, childPath, deltaData);
          }
        }
      }

      const countText = Array.isArray(value) ? `[${childCount}]` : `(${childCount})`;

      return `
                <div class="mvu-card ${collapsedClass}" data-path="${escapeHtml(path)}" data-depth="${depth}">
                    <div class="mvu-card-header">
                        <div class="mvu-card-title">
                            <span>${escapeHtml(key)}</span>
                            <span class="mvu-card-count">${countText}</span>
                        </div>
                        <span class="mvu-card-toggle">▼</span>
                    </div>
                    <div class="mvu-card-body">
                        ${bodyHtml}
                    </div>
                </div>
            `;
    }

    // ===== 公开 API =====
    return {
      MODULE_ID: MODULE_ID,

      isAvailable: isAvailable,
      getData: getData,

      injectStyles: function () {
        // 获取主页面的 document（兼容 iframe 环境）
        const targetDoc = window.parent?.document || document;
        if (targetDoc.getElementById('mvu-module-styles')) return;
        console.log('[MvuModule] Injecting styles to parent document');
        const styleEl = targetDoc.createElement('style');
        styleEl.id = 'mvu-module-styles';
        styleEl.textContent = STYLES;
        targetDoc.head.appendChild(styleEl);
      },

      renderNavButton: function (isActive) {
        if (!isAvailable()) return '';
        const activeClass = isActive ? 'active' : '';
        return `<button class="acu-nav-btn acu-mvu-btn $${activeClass}" id="acu-btn-mvu" data-table="$${MODULE_ID}" style="order:-1;">
                    <i class="fa-solid fa-code-branch"></i><span>变量</span>
                </button>`;
      },

      renderPanel: function () {
        console.log('[MvuModule] renderPanel called');
        const mvuData = getData();

        if (!mvuData || !mvuData.stat_data) {
          console.log('[MvuModule] No data available');
          return `
                        <div class="acu-panel-header">
                            <div class="acu-panel-title">
                                <i class="fa-solid fa-code-branch"></i>
                                <span>MVU 变量</span>
                            </div>
                            <div class="acu-header-actions">
                                <button class="mvu-header-btn mvu-btn-close" title="关闭">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mvu-content">
                            <div class="mvu-empty">
                                <i class="fa-solid fa-exclamation-circle"></i>
                                <p>未检测到 MVU 变量数据</p>
                                <p class="mvu-empty-hint">请确保角色卡已配置 [InitVar] 并进行过对话</p>
                            </div>
                        </div>
                    `;
        }

        // 构建顶层卡片
        const topKeys = Object.keys(mvuData.stat_data).filter(k => !k.startsWith('$'));
        console.log('[MvuModule] Top level keys:', topKeys);

        let cardsHtml = '';
        for (const key of topKeys) {
          const value = mvuData.stat_data[key];
          const childCount = countChildren(value);

          if (value && typeof value === 'object' && !isVWD(value) && !isSimpleArray(value)) {
            // 对象/复杂数组 → 卡片（顶层默认展开）
            cardsHtml += renderCard(key, value, key, mvuData.delta_data, 0, true);
          } else {
            // 原始值或简单数组 → 单独一个迷你卡片
            cardsHtml += `
                            <div class="mvu-card" data-path="${escapeHtml(key)}" data-depth="0">
                                <div class="mvu-card-body">
                                    ${renderRow(key, value, key, mvuData.delta_data)}
                                </div>
                            </div>
                        `;
          }
        }

        return `
                    <div class="acu-panel-header">
                        <div class="acu-panel-title">
                            <i class="fa-solid fa-code-branch"></i>
                            <span>MVU 变量</span>
                            <span class="mvu-card-count" style="margin-left:4px;">(${topKeys.length})</span>
                        </div>
                        <div class="acu-header-actions">
                            <button class="mvu-header-btn mvu-btn-refresh" title="刷新">
                                <i class="fa-solid fa-sync-alt"></i>
                            </button>
                            <button class="mvu-header-btn mvu-btn-close" title="关闭">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mvu-content">
                        ${cardsHtml}
                    </div>
                `;
      },

      bindEvents: function ($container) {
        // 使用主页面的 jQuery
        const $ = window.parent?.jQuery || window.jQuery;
        if (!$ || !$container || !$container.length) {
          console.warn('[MvuModule] bindEvents: jQuery or container not available');
          return;
        }

        console.log('[MvuModule] bindEvents called, container:', $container.attr('id') || $container.attr('class'));

        // 使用主页面的 jQuery 重新获取容器
        const $panel = $('#acu-data-area');
        if (!$panel.length) {
          console.warn('[MvuModule] bindEvents: #acu-data-area not found');
          return;
        }

        // 解绑旧事件
        $panel.off('.mvu');

        // 卡片折叠/展开
        $panel.on('click.mvu', '.mvu-card-header', function (e) {
          e.stopPropagation();
          const $card = $(this).closest('.mvu-card');
          $card.toggleClass('collapsed');
          console.log('[MvuModule] Toggle card:', $card.data('path'), 'collapsed:', $card.hasClass('collapsed'));
        });

        // 刷新按钮
        $panel.on('click.mvu', '.mvu-btn-refresh', function (e) {
          e.stopPropagation();
          console.log('[MvuModule] Refresh clicked');
          MvuModule.refresh($panel);
        });

        // 关闭按钮
        $panel.on('click.mvu', '.mvu-btn-close', function (e) {
          e.stopPropagation();
          console.log('[MvuModule] Close clicked');
          if (typeof Store !== 'undefined' && typeof STORAGE_KEY_ACTIVE_TAB !== 'undefined') {
            Store.set(STORAGE_KEY_ACTIVE_TAB, null);
          }
          $panel.removeClass('visible');
          $('.acu-nav-btn').removeClass('active');
        });

        // 点击值编辑
        $panel.on('click.mvu', '.mvu-value', function (e) {
          e.stopPropagation();
          const $value = $(this);
          const path = $value.data('path');
          if (!path) {
            console.warn('[MvuModule] No path on value element');
            return;
          }
          const currentValue = $value
            .text()
            .replace(/\s*\$\s*$/, '')
            .trim(); // 移除末尾的 $
          console.log('[MvuModule] Edit value:', path, currentValue);

          MvuModule.showEditDialog(path, currentValue, async function (newValue) {
            if (newValue !== null && newValue !== currentValue) {
              const success = await MvuModule.setValue(path, newValue);
              const toastr = window.parent?.toastr || window.toastr;
              if (success) {
                $value.text(newValue);
                $value.css('background', 'var(--acu-success-bg)');
                setTimeout(() => $value.css('background', ''), 1500);
              } else {
                if (toastr) toastr.error('保存失败');
              }
            }
          });
        });

        console.log(
          '[MvuModule] Events bindbindEvents complete. Cards:',
          $panel.find('.mvu-card').length,
          'Values:',
          $panel.find('.mvu-value').length,
        );
      },

      showEditDialog: function (path, currentValue, onSave) {
        // 使用主页面的 jQuery 和 document
        const $ = window.parent?.jQuery || window.jQuery;
        const targetDoc = window.parent?.document || document;
        if (!$) return;

        // 移除已有弹窗
        $(targetDoc).find('.mvu-edit-overlay').remove();

        const currentTheme = (typeof getConfig === 'function' ? getConfig().theme : null) || 'retro';

        const html = `
                    <div class="mvu-edit-overlay acu-edit-overlay acu-theme-${currentTheme}">
                        <div class="mvu-edit-dialog acu-edit-dialog">
                            <div class="acu-edit-title">
                                <i class="fa-solid fa-edit" style="opacity:0.7;"></i>
                                <span>编辑变量</span>
                            </div>
                            <div class="mvu-edit-path">${escapeHtml(path)}</div>
                            <textarea class="mvu-edit-textarea acu-edit-textarea">${escapeHtml(currentValue)}</textarea>
                            <div class="mvu-edit-hint">Ctrl+Enter 保存 | Esc 取消</div>
                            <div class="acu-dialog-btns">
                                <button class="acu-dialog-btn mvu-btn-cancel">
                                    <i class="fa-solid fa-times"></i> 取消
                                </button>
                                <button class="acu-dialog-btn acu-btn-confirm mvu-btn-save">
                                    <i class="fa-solid fa-check"></i> 保存
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        $(targetDoc.body).append(html);
        const $overlay = $(targetDoc).find('.mvu-edit-overlay');
        const $input = $overlay.find('.mvu-edit-textarea');

        setTimeout(() => $input.focus().select(), 50);

        // 取消按钮
        $overlay.on('click', '.mvu-btn-cancel', function (e) {
          e.preventDefault();
          e.stopPropagation();
          $overlay.remove();
          onSave(null);
        });

        // 保存按钮
        $overlay.on('click', '.mvu-btn-save', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const newValue = $input.val();
          $overlay.remove();
          onSave(newValue);
        });

        // 点击遮罩关闭
        $overlay.on('click', function (e) {
          if ($(e.target).hasClass('mvu-edit-overlay')) {
            $overlay.remove();
            onSave(null);
          }
        });

        // 键盘快捷键
        $input.on('keydown', function (e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            $overlay.remove();
            onSave(null);
          } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            const newValue = $input.val();
            $overlay.remove();
            onSave(newValue);
          }
        });
      },

      setValue: async function (path, newValue) {
        if (!isAvailable()) return false;

        try {
          // 尝试解析为数字或布尔值
          let parsedValue = newValue;
          if (newValue === 'true') parsedValue = true;
          else if (newValue === 'false') parsedValue = false;
          else if (!isNaN(Number(newValue)) && String(newValue).trim() !== '') {
            parsedValue = Number(newValue);
          }

          console.log('[MvuModule] setValue:', path, '→', parsedValue);

          const mvuData = window.Mvu.getMvuData({ type: 'message', message_id: -1 });
          if (!mvuData) {
            console.error('[MvuModule] 无法获取 MVU 数据');
            return false;
          }

          const success = await window.Mvu.setMvuVariable(mvuData, path, parsedValue, {
            reason: '手动编辑',
            is_recursive: false,
          });

          if (success) {
            await window.Mvu.replaceMvuData(mvuData, { type: 'message', message_id: -1 });
            console.log('[MvuModule] 变量已更新成功');
          } else {
            console.warn('[MvuModule] setMvuVariable 返回 false');
          }

          return success;
        } catch (e) {
          console.error('[MvuModule] setValue error:', e);
          return false;
        }
      },

      isModuleTab: function (tableName) {
        return tableName === MODULE_ID;
      },

      refresh: function ($container) {
        if (!$container || !$container.length) return;
        console.log('[MvuModule] refresh called');
        const panelHtml = this.renderPanel();
        $container.html('<div class="acu-mvu-panel">' + panelHtml + '</div>');
        this.bindEvents($container);
      },
    };
  })();
  // MVU 变量可视化模块结束
  // 默认骰子配置（COC规则）
  const DEFAULT_DICE_CONFIG = {
    critSuccessMax: 5,
    hardSuccessDiv: 5,
    difficultSuccessDiv: 2,
    critFailMin: 96,
    ruleType: 'high_good',
    lastDiceType: '1d100',
    // DND 专用配置
    dndCritSuccess: 20,
    dndCritFail: 1,
    // 对抗平手规则: initiator_lose | tie | initiator_win
    contestTieRule: 'initiator_lose',
  };

  const getDiceConfig = () => Store.get(STORAGE_KEY_DICE_CONFIG, DEFAULT_DICE_CONFIG);
  const saveDiceConfig = cfg => Store.set(STORAGE_KEY_DICE_CONFIG, { ...getDiceConfig(), ...cfg });

  // ========================================
  // 属性规则预设系统
  // ========================================

  // 骰子公式校验（支持高级语法）
  const DiceFormulaRegex = /^(\d+d\d+)(kh\d+|kl\d+|dh\d+|dl\d+)?([+\-*/]\d+)?$/i;

  // 内置属性规则预设
  const BUILTIN_ATTRIBUTE_PRESETS = [
    {
      format: 'acu_attr_preset_v1',
      version: 1,
      id: 'coc7',
      name: '简化COC规则',
      builtin: true,
      description: '基于克苏鲁的呼唤第7版规则的属性预设。包含8条基本属性和16条特殊属性。',
      baseAttributes: [
        { name: '力量', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '体质', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '敏捷', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '外貌', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '意志', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '幸运', formula: '3d6*5', range: [15, 90], modifier: '1d10-5' },
        { name: '智力', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
        { name: '教育', formula: '2d6*5+30', range: [40, 90], modifier: '1d10-5' },
      ],
      specialAttributes: [
        // 高频核心技能（范围 15-110，限制到95，平均60）
        { name: '侦查', formula: '10+5d20', range: [15, 95] },
        { name: '聆听', formula: '10+5d20', range: [15, 95] },
        { name: '心理学', formula: '10+5d20', range: [15, 95] },
        // 中频常用技能（范围 9-85，平均47）
        { name: '说服', formula: '5+4d20', range: [9, 85] },
        { name: '话术', formula: '5+4d20', range: [9, 85] },
        { name: '潜行', formula: '5+4d20', range: [9, 85] },
        { name: '格斗', formula: '5+4d20', range: [9, 85] },
        { name: '射击', formula: '5+4d20', range: [9, 85] },
        // 低频辅助技能（范围 8-65，平均36）
        { name: '魅惑', formula: '5+3d20', range: [8, 65] },
        { name: '恐吓', formula: '5+3d20', range: [8, 65] },
        { name: '图书馆使用', formula: '5+3d20', range: [8, 65] },
        { name: '急救', formula: '5+3d20', range: [8, 65] },
        // 极低稀有技能（范围 3-41，平均22）
        { name: '神秘学', formula: '1+2d20', range: [3, 41] },
        // 公式计算
        { name: '闪避', formula: '敏捷/2', range: [1, 99] },
        // COC 特色
        { name: 'SAN值', formula: '意志', range: [1, 99] },
        { name: '克苏鲁神话', formula: '1d5', range: [1, 5] },
      ],
    },
    {
      format: 'acu_attr_preset_v1',
      version: 1,
      id: 'dnd5e',
      name: '简化DND规则',
      builtin: true,
      description: '基于龙与地下城第5版规则的属性预设。包含6条基本属性和8条特殊属性。',
      baseAttributes: [
        { name: '力量', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '敏捷', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '体质', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '智力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '感知', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
        { name: '魅力', formula: '4d6dl1', range: [3, 18], modifier: '1d4-2' },
      ],
      specialAttributes: [
        // 高频技能（范围 10-20，平均15）
        { name: '察觉', formula: '8+2d6', range: [10, 20] },
        { name: '隐匿', formula: '8+2d6', range: [10, 20] },
        // 中频技能（范围 7-17，平均12）
        { name: '运动', formula: '5+2d6', range: [7, 17] },
        { name: '巧手', formula: '5+2d6', range: [7, 17] },
        { name: '洞悉', formula: '5+2d6', range: [7, 17] },
        { name: '游说', formula: '5+2d6', range: [7, 17] },
        // 低频技能（范围 4-14，平均9）
        { name: '奥秘', formula: '2+2d6', range: [4, 14] },
        { name: '欺瞒', formula: '2+2d6', range: [4, 14] },
      ],
    },
  ];

  // 属性预设管理器
  const AttributePresetManager = (() => {
    let _cache = null;

    return {
      // 获取所有预设（内置 + 自定义）
      getAllPresets() {
        if (_cache) return _cache;
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []);
        _cache = [...BUILTIN_ATTRIBUTE_PRESETS, ...stored];
        return _cache;
      },

      // 获取当前激活的预设（null = 使用默认逻辑）
      getActivePreset() {
        const activeId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        if (!activeId) return null;
        return this.getAllPresets().find(p => p.id === activeId) || null;
      },

      // 设置激活的预设
      setActivePreset(id) {
        try {
          // 如果id是空字符串，设置为null
          const finalId = id === '' || id === undefined ? null : id;
          Store.set(STORAGE_KEY_ACTIVE_ATTR_PRESET, finalId);
          // 清除缓存，确保下次获取时是最新的
          _cache = null;
          console.log('[AttributePresetManager] 切换预设:', finalId);
          return true;
        } catch (err) {
          console.error('[AttributePresetManager] 设置预设失败:', err);
          return false;
        }
      },

      // 创建自定义预设
      createPreset(preset) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []);
        const newPreset = {
          ...preset,
          id: preset.id || 'custom_' + Date.now(),
          builtin: false,
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[AttributePresetManager] 创建预设:', newPreset.name);
        return newPreset;
      },

      // 更新自定义预设
      updatePreset(id, updates) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []);
        const index = stored.findIndex(p => p.id === id);
        if (index < 0) return false;
        stored[index] = { ...stored[index], ...updates };
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, stored);
        _cache = null;
        console.log('[AttributePresetManager] 更新预设:', id);
        return true;
      },

      // 删除自定义预设
      deletePreset(id) {
        const stored = Store.get(STORAGE_KEY_ATTRIBUTE_PRESETS, []);
        const filtered = stored.filter(p => p.id !== id);
        if (filtered.length === stored.length) return false;
        Store.set(STORAGE_KEY_ATTRIBUTE_PRESETS, filtered);
        _cache = null;
        // 如果删除的是激活预设，清除激活状态
        if (Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET) === id) {
          Store.set(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);
        }
        console.log('[AttributePresetManager] 删除预设:', id);
        return true;
      },

      // 导出预设为 JSON
      exportPreset(id) {
        const preset = this.getAllPresets().find(p => p.id === id);
        if (!preset) return null;
        const exported = {
          format: 'acu_attr_preset_v1',
          version: 1,
          ...preset,
        };
        delete exported.builtin; // 导出时移除内置标记
        return JSON.stringify(exported, null, 2);
      },

      // 从 JSON 导入预设
      importPreset(jsonStr) {
        try {
          const data = JSON.parse(jsonStr);

          // 校验格式
          if (data.format !== 'acu_attr_preset_v1') {
            throw new Error('不支持的预设格式');
          }

          // 基本校验
          if (!data.name || !data.baseAttributes || !Array.isArray(data.baseAttributes)) {
            throw new Error('预设数据不完整');
          }

          // 生成新ID避免冲突
          const imported = {
            ...data,
            id: 'imported_' + Date.now(),
            builtin: false,
            createdAt: new Date().toISOString(),
          };

          return this.createPreset(imported);
        } catch (e) {
          console.error('[AttributePresetManager] 导入失败:', e);
          return null;
        }
      },

      // 清除缓存
      clearCache() {
        _cache = null;
      },
    };
  })();

  // ========================================
  // 公式解析器系统（支持骰子表达式和变量引用）
  // ========================================

  /**
   * 投单个骰子表达式
   * 支持: 3d6, 4d6kh3, 4d6dl1, 4d6dh1
   * @returns 骰子结果，解析失败返回 NaN
   */
  const rollDiceExpression = expr => {
    const rollDice = sides => Math.floor(Math.random() * sides) + 1;

    const match = expr.match(/^(\d+)d(\d+)(kh\d+|kl\d+|dh\d+|dl\d+)?$/i);
    if (!match) return NaN;

    const [, countStr, sidesStr, keepDrop] = match;
    const count = parseInt(countStr, 10);
    const sides = parseInt(sidesStr, 10);

    let rolls = Array.from({ length: count }, () => rollDice(sides));

    // 处理 keep/drop
    if (keepDrop) {
      const kd = keepDrop.toLowerCase();
      const n = parseInt(kd.slice(2), 10);
      rolls.sort((a, b) => b - a); // 降序排列

      if (kd.startsWith('kh'))
        rolls = rolls.slice(0, n); // 保留最高n个
      else if (kd.startsWith('kl'))
        rolls = rolls.slice(-n); // 保留最低n个
      else if (kd.startsWith('dh'))
        rolls = rolls.slice(n); // 去掉最高n个
      else if (kd.startsWith('dl')) rolls = rolls.slice(0, -n); // 去掉最低n个
    }

    return rolls.reduce((a, b) => a + b, 0);
  };

  /**
   * 解析并计算公式（支持变量引用）
   * @param formula 公式字符串，如 "力量/2+1d10" 或 "3d6*5"
   * @param context 变量上下文，如 { 力量: 50, 敏捷: 40 }
   * @returns 计算结果（整数）
   */
  const evaluateFormula = (formula, context = {}) => {
    if (!formula) return 0;

    let expr = String(formula).trim();

    // 1. 替换变量为数值（按长度降序替换，避免部分匹配）
    const varNames = Object.keys(context).sort((a, b) => b.length - a.length);
    for (const name of varNames) {
      const value = context[name];
      if (typeof value === 'number' && !isNaN(value)) {
        // 用括号包裹避免运算优先级问题
        expr = expr.split(name).join(`(${value})`);
      }
    }

    // 2. 替换骰子表达式为数值
    expr = expr.replace(/\d+d\d+(kh\d+|kl\d+|dh\d+|dl\d+)?/gi, match => {
      const result = rollDiceExpression(match);
      return isNaN(result) ? '0' : String(result);
    });

    // 3. 安全性检查：只允许数字和基本运算符
    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      console.warn('[evaluateFormula] 公式包含非法字符:', formula, '→', expr);
      return 0;
    }

    // 4. 计算数学表达式
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${expr})`)();
      return Math.round(result); // 四舍五入为整数
    } catch (e) {
      console.error('[evaluateFormula] 公式计算失败:', formula, '→', expr, e);
      return 0;
    }
  };

  /**
   * 生成单个属性值，应用范围限制
   * @param formula 公式字符串
   * @param range 可选范围 [min, max]
   * @param context 变量上下文
   * @returns 属性值
   */
  const generateAttributeValue = (formula, range, context) => {
    let value = evaluateFormula(formula, context);

    if (range && Array.isArray(range) && range.length === 2) {
      value = Math.max(range[0], Math.min(range[1], value));
    }

    return value;
  };

  // ========================================
  // 仪表盘统一配置中心
  // ========================================
  const DASHBOARD_TABLE_CONFIG = {
    global: {
      tableKeywords: ['全局数据表', '全局数据', '全局'],
      columns: {
        detailLocation: { keywords: ['当前详细地点', '详细地点', '具体位置', '当前位置'], fallbackIndex: null },
        currentLocation: { keywords: ['当前次要地区', '当前所在地点', '当前地点', '所在地点'], fallbackIndex: 2 },
      },
    },
    player: {
      // 新增: user, <user>
      tableKeywords: ['主角信息', '主角', '玩家', '角色信息', 'player', '用户', 'user', '<user>'],
      columns: {
        name: { keywords: ['姓名', '名称', '人物名称', 'name'], fallbackIndex: 1 },
        status: { keywords: ['状态关键词', '状态关键字', '状态标签', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置', '所在地'], fallbackIndex: null },
        attrs: { keywords: ['基础属性', '属性'], fallbackIndex: null, isMultiple: true },
        // 新增: 灵石, 积分, 代币, 信用点
        money: {
          keywords: ['金钱', '资金', '金币', '货币', '余额', '灵石', '积分', '代币', '信用点'],
          fallbackIndex: null,
        },
        resources: { keywords: ['资源数据', '资源', 'resources'], fallbackIndex: null },
      },
    },
    location: {
      // 新增: 秘境, 副本, 洞府, 空间, 位面, 界域
      tableKeywords: [
        '世界地图点',
        '地图点',
        '地图',
        '地点',
        '地点表',
        '地图表',
        '场景',
        '区域',
        '秘境',
        '副本',
        '洞府',
        '空间',
        '位面',
        '界域',
      ],
      columns: {
        name: {
          keywords: ['详细地点', '具体位置', '当前地点', '次要地区', '主要地区', '地区', '地点名', '名称'],
          fallbackIndex: 1,
        },
        description: { keywords: ['环境描述', '描述', '说明', '介绍', '氛围描述'], fallbackIndex: null },
      },
    },
    npc: {
      // 新增: 弟子, 成员, 队友, 伙伴, 宠物, 灵宠
      tableKeywords: [
        '重要人物表',
        '重要人物',
        'NPC',
        '人物表',
        '人物',
        '角色表',
        '角色',
        'character',
        '弟子',
        '成员',
        '队友',
        '伙伴',
        '宠物',
        '灵宠',
      ],
      columns: {
        name: { keywords: ['姓名', '名称'], fallbackIndex: 1 },
        status: { keywords: ['自身状态', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置'], fallbackIndex: null },
        inScene: { keywords: ['在场状态', '在场', '是否离场', '离场'], fallbackIndex: null },
      },
    },
    quest: {
      // 新增: 委托, 悬赏
      tableKeywords: ['任务表', '备忘事项', '任务', '事项', '目标', '待办', '主线', '支线', '委托', '悬赏'],
      columns: {
        name: { keywords: ['事项名称', '任务名', '名称'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '事项类型'], fallbackIndex: 2 },
        progress: { keywords: ['进度', '完成度', '进度/结果'], fallbackIndex: 5 },
        status: { keywords: ['状态'], fallbackIndex: 6 },
      },
      filters: {
        active: { column: 'status', includes: ['活跃', '进行中', '进行'], excludeColumn: 'type', excludes: ['规则'] },
      },
    },
    bag: {
      // 新增: 储物袋, 空间戒指
      tableKeywords: ['背包物品', '背包', '物品', '道具', '库存', '储物袋', '空间戒指', '持有物品表'],
      columns: {
        name: { keywords: ['物品名称', '名称', '物品名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '物品类型'], fallbackIndex: 2 },
        count: { keywords: ['数量', '个数', '持有数'], fallbackIndex: 3 },
      },
    },
    skill: {
      // 新增: 神通, 道法, 功法, 血脉, 天赋, 义体改造, 超凡能力, 词条
      tableKeywords: [
        '主角技能',
        '技能表',
        '技能',
        '能力',
        '魔法',
        '超能力',
        '异能',
        '神通',
        '道法',
        '功法',
        '血脉',
        '天赋',
        '义体改造',
        '超凡能力',
        '词条',
      ],
      columns: {
        name: { keywords: ['技能名称', '名称', '技能名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        level: { keywords: ['等级', '级别', '熟练度', 'lv'], fallbackIndex: 3 },
      },
    },
    equip: {
      // 新增: 法宝, 灵器, 仙器, 神器, 义体, 神装
      tableKeywords: ['装备表', '装备', '武器', '防具', '法宝', '灵器', '仙器', '神器', '义体', '神装'],
      columns: {
        name: { keywords: ['装备名称', '名称', '装备名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        part: { keywords: ['部位', '装备部位', '位置'], fallbackIndex: 3 },
        isEquipped: { keywords: ['状态', '是否装备', '装备状态', '装备中'], fallbackIndex: 4 },
      },
      filters: {
        equipped: { column: 'isEquipped', includes: ['已装备', '装备中', 'true', '是', 'yes', 'equipped'] },
      },
    },
  };

  // 仪表盘数据解析器
  const DashboardDataParser = {
    // 根据配置查找表
    findTable(allTables, moduleKey) {
      const config = DASHBOARD_TABLE_CONFIG[moduleKey];
      if (!config) return null;

      for (const keyword of config.tableKeywords) {
        for (const tableName in allTables) {
          if (tableName.includes(keyword)) {
            return {
              data: allTables[tableName],
              name: tableName,
              key: allTables[tableName].key,
              config: config,
            };
          }
        }
      }
      return null;
    },

    // 根据配置查找列索引
    findColumnIndex(headers, columnKey, moduleConfig) {
      const colConfig = moduleConfig.columns[columnKey];
      if (!colConfig) return -1;

      // 先尝试关键词匹配
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (colConfig.keywords.some(kw => h.includes(kw.toLowerCase()))) {
          return i;
        }
      }

      // 回退到默认索引
      return colConfig.fallbackIndex ?? -1;
    },

    // 从行中提取指定列的值
    getValue(row, headers, columnKey, moduleConfig) {
      const idx = this.findColumnIndex(headers, columnKey, moduleConfig);
      if (idx < 0 || idx >= row.length) return null;
      return row[idx];
    },

    // 获取模块的所有列索引映射
    getColumnMap(headers, moduleKey) {
      const config = DASHBOARD_TABLE_CONFIG[moduleKey];
      if (!config) return {};

      const map = {};
      for (const colKey in config.columns) {
        map[colKey] = this.findColumnIndex(headers, colKey, config);
      }
      return map;
    },

    // 解析表格数据为结构化对象数组
    parseRows(tableResult, moduleKey) {
      if (!tableResult || !tableResult.data) return [];

      const { data, config } = tableResult;
      const headers = data.headers || [];
      const rows = data.rows || [];
      const colMap = this.getColumnMap(headers, moduleKey);

      return rows.map((row, idx) => {
        const obj = { _rowIndex: idx, _raw: row };
        for (const colKey in colMap) {
          const colIdx = colMap[colKey];
          obj[colKey] = colIdx >= 0 && colIdx < row.length ? row[colIdx] : null;
        }
        return obj;
      });
    },

    // 应用过滤器（容错：当目标列不存在时返回全部数据）
    applyFilter(parsedRows, filterKey, moduleKey) {
      const config = DASHBOARD_TABLE_CONFIG[moduleKey];
      if (!config || !config.filters || !config.filters[filterKey]) return parsedRows;

      const filter = config.filters[filterKey];

      // 容错：检查过滤列是否存在（即parsedRows中是否有该字段的有效值）
      const hasFilterColumn = parsedRows.some(row => row[filter.column] !== null && row[filter.column] !== undefined);
      if (!hasFilterColumn) {
        // 过滤列不存在，返回全部数据
        return parsedRows;
      }

      return parsedRows.filter(row => {
        const value = String(row[filter.column] || '').toLowerCase();
        const matchInclude = filter.includes.some(inc => value.includes(inc.toLowerCase()));

        if (filter.excludeColumn && filter.excludes) {
          const excludeValue = String(row[filter.excludeColumn] || '').toLowerCase();
          const matchExclude = filter.excludes.some(exc => excludeValue.includes(exc.toLowerCase()));
          return matchInclude && !matchExclude;
        }

        return matchInclude;
      });
    },
  };

  const DEFAULT_GM_CONFIG = {
    enabled: true,
    diceSystem: '1d100',
    showDiceIcon: true,
    autoSendPrompt: true,
    action_groups: [
      {
        table_keywords: ['地点', '地图', 'Location', 'Map', '世界', '场所'],
        actions: [
          { label: '前往', icon: 'fa-walking', type: 'prompt', template: '<user>前往{Name}。', auto_send: true },
          { label: '探索', icon: 'fa-search', type: 'prompt', template: '<user>探索{Name}。', auto_send: true },
          { label: '停留', icon: 'fa-clock', type: 'prompt', template: '<user>在{Name}停留。', auto_send: true },
        ],
      },
      {
        table_keywords: ['人物', 'NPC', '重要人物', '角色', '女主'],
        actions: [
          { label: '交谈', icon: 'fa-comments', type: 'prompt', template: '<user>与{Name}交谈。', auto_send: true },
          { label: '观察', icon: 'fa-eye', type: 'prompt', template: '<user>观察{Name}。', auto_send: true },
          { label: '战斗', icon: 'fa-hand-fist', type: 'prompt', template: '<user>与{Name}战斗。', auto_send: true },
        ],
      },
      {
        table_keywords: ['物品', '背包', '道具'],
        actions: [
          { label: '使用', icon: 'fa-hand-pointer', type: 'prompt', template: '<user>使用了{Name}。', auto_send: true },
          { label: '查看', icon: 'fa-eye', type: 'prompt', template: '<user>查看了{Name}。', auto_send: true },
          { label: '丢弃', icon: 'fa-trash', type: 'prompt', template: '<user>丢弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['装备', '武器', '防具'],
        actions: [
          {
            label: '装备',
            icon: 'fa-shield-halved',
            type: 'prompt',
            template: '<user>装备了{Name}。',
            auto_send: true,
          },
          { label: '卸下', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>卸下了{Name}。', auto_send: true },
          { label: '卖出', icon: 'fa-coins', type: 'prompt', template: '<user>卖出了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['技能', '能力'],
        actions: [
          {
            label: '使用',
            icon: 'fa-wand-magic-sparkles',
            type: 'skill_check',
            template: '<user>使用{Name}。',
            auto_send: true,
          },
          { label: '练习', icon: 'fa-dumbbell', type: 'prompt', template: '<user>练习{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['备忘', '任务', '事项'],
        actions: [
          {
            label: '追踪',
            icon: 'fa-crosshairs',
            type: 'prompt',
            template: '<user>将{Name}设为当前追踪目标。',
            auto_send: true,
          },
          {
            label: '整理',
            icon: 'fa-list-check',
            type: 'prompt',
            template: '<user>整理关于{Name}的信息。',
            auto_send: true,
          },
          { label: '放弃', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>放弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['势力', '组织', '阵营'],
        actions: [
          {
            label: '打探',
            icon: 'fa-ear-listen',
            type: 'prompt',
            template: '<user>打探{Name}的情报。',
            auto_send: true,
          },
          { label: '加入', icon: 'fa-user-plus', type: 'prompt', template: '<user>申请加入{Name}。', auto_send: true },
          {
            label: '合作',
            icon: 'fa-handshake',
            type: 'prompt',
            template: '<user>向{Name}请求合作。',
            auto_send: true,
          },
        ],
      },
    ],
  };
  // [新增] 统一主题颜色定义
  const THEME_COLORS = {
    retro: {
      bgPanel: '#e6e2d3',
      border: '#dcd0c0',
      textMain: '#5e4b35',
      textSub: '#8a7a6a',
      btnBg: '#dcd0c0',
      btnHover: '#cbbba8',
      accent: '#7a695f',
      tableHead: '#efebe4',
      successText: '#27ae60',
      successBg: 'rgba(39, 174, 96, 0.15)',
      inputBg: '#f5f2eb',
      inputText: '#5e4b35',
      placeholderText: '#a09080',
      btnActiveBg: '#8d7b6f',
      btnActiveText: '#fdfaf5',
    },
    dark: {
      bgPanel: 'rgba(30, 30, 30, 0.98)',
      border: '#444',
      textMain: '#eee',
      textSub: '#999',
      btnBg: 'rgba(60, 60, 60, 0.9)',
      btnHover: '#505050',
      accent: '#9b8cd9',
      tableHead: 'rgba(45, 45, 45, 0.95)',
      successText: '#4cd964',
      successBg: 'rgba(76, 217, 100, 0.2)',
      inputBg: 'rgba(50, 50, 50, 0.95)',
      inputText: '#eee',
      placeholderText: '#777',
      btnActiveBg: '#6a5acd',
      btnActiveText: '#fff',
    },
    modern: {
      bgPanel: '#f8f9fa',
      border: '#e0e0e0',
      textMain: '#333',
      textSub: '#666',
      btnBg: '#e9ecef',
      btnHover: '#dee2e6',
      accent: '#007bff',
      tableHead: '#f1f3f5',
      successText: '#28a745',
      successBg: 'rgba(40, 167, 69, 0.15)',
      inputBg: '#fff',
      inputText: '#333',
      placeholderText: '#999',
      btnActiveBg: '#007bff',
      btnActiveText: '#fff',
    },
    forest: {
      bgPanel: '#e8f5e9',
      border: '#a5d6a7',
      textMain: '#2e7d32',
      textSub: '#66bb6a',
      btnBg: '#c8e6c9',
      btnHover: '#a5d6a7',
      accent: '#43a047',
      tableHead: '#dcedc8',
      successText: '#2e7d32',
      successBg: 'rgba(46, 125, 50, 0.2)',
      inputBg: '#f1f8e9',
      inputText: '#2e7d32',
      placeholderText: '#81c784',
      btnActiveBg: '#43a047',
      btnActiveText: '#fff',
    },
    ocean: {
      bgPanel: '#e3f2fd',
      border: '#90caf9',
      textMain: '#1565c0',
      textSub: '#42a5f5',
      btnBg: '#bbdefb',
      btnHover: '#90caf9',
      accent: '#1976d2',
      tableHead: '#bbdefb',
      successText: '#0288d1',
      successBg: 'rgba(2, 136, 209, 0.15)',
      inputBg: '#e1f5fe',
      inputText: '#1565c0',
      placeholderText: '#64b5f6',
      btnActiveBg: '#1976d2',
      btnActiveText: '#fff',
    },
    cyber: {
      bgPanel: '#0a0a0a',
      border: '#00ffcc33',
      textMain: '#00ffcc',
      textSub: '#00cc99',
      btnBg: 'rgba(0, 255, 204, 0.1)',
      btnHover: 'rgba(0, 255, 204, 0.2)',
      accent: '#00ffcc',
      tableHead: 'rgba(0, 255, 204, 0.05)',
      successText: '#0f0',
      successBg: 'rgba(0, 255, 0, 0.15)',
      inputBg: 'rgba(0, 0, 0, 0.6)',
      inputText: '#00ffcc',
      placeholderText: '#006655',
      btnActiveBg: '#ff00ff',
      btnActiveText: '#fff',
    },
    nightowl: {
      bgPanel: '#011627',
      border: '#132e45',
      textMain: '#e0e6f2',
      textSub: '#a6b8cc',
      btnBg: '#1f3a52',
      btnHover: '#2a4a68',
      accent: '#7fdbca',
      tableHead: '#0a2133',
      successText: '#addb67',
      successBg: 'rgba(173, 219, 103, 0.15)',
      inputBg: '#00101c',
      inputText: '#e0e6f2',
      placeholderText: '#6a8090',
      btnActiveBg: '#7fdbca',
      btnActiveText: '#011627',
    },
  };
  const getThemeColors = () => THEME_COLORS[getConfig().theme] || THEME_COLORS['retro'];
  const getGMConfig = () => Store.get(STORAGE_KEY_GM_CONFIG, DEFAULT_GM_CONFIG);

  const getActionsForTable = tableName => {
    const config = getGMConfig();
    if (!config.enabled || !config.action_groups) return [];
    const lowerName = tableName.toLowerCase();
    for (const group of config.action_groups) {
      const matched = group.table_keywords.some(keyword => lowerName.includes(keyword.toLowerCase()));
      if (matched) return group.actions || [];
    }
    return [];
  };
  const isNumericCell = value => {
    if (value === null || value === undefined || value === '') return false;
    const str = String(value).trim();
    // 匹配: 纯数字、百分比、分数(50/100)、任意中文/英文标签:数字 格式
    return (
      /^-?\d+(\.\d+)?%?$/.test(str) ||
      /^\d+\/\d+$/.test(str) ||
      /^[\u4e00-\u9fa5a-zA-Z]+[:\s：]\s*\d+/i.test(str) ||
      /\d+/.test(str)
    );
  };

  const extractNumericValue = value => {
    if (!value) return 0;
    const str = String(value).trim();
    // 处理分数形式 (50/100 -> 取第一个数)
    if (/^\d+\/\d+$/.test(str)) return parseInt(str.split('/')[0], 10);
    // 处理百分比
    if (str.endsWith('%')) return parseInt(str.replace('%', ''), 10);
    // 处理 "标签:数值" 格式，提取最后一个数字
    const matches = str.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 0;
  };

  const parseAttributeString = str => {
    if (!str) return [];
    const results = [];
    const rawStr = String(str).trim();

    // 尝试解析 JSON 格式 {"属性名":数值, ...}
    if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
      try {
        const jsonObj = JSON.parse(rawStr);
        for (const key in jsonObj) {
          const val = jsonObj[key];
          if (typeof val === 'number') {
            results.push({ name: key, value: val });
          } else if (typeof val === 'string' && /^\d+$/.test(val)) {
            results.push({ name: key, value: parseInt(val, 10) });
          }
        }
        if (results.length > 0) return results;
      } catch (e) {
        // JSON 解析失败，继续用原有逻辑
      }
    }

    // 原有逻辑：解析 "属性名:数值; 属性名:数值" 格式
    const parts = rawStr.split(/[,;，；\s]+/);
    for (const part of parts) {
      const match = part.match(/^"?([\u4e00-\u9fa5a-zA-Z_]+)"?[:\s：]\s*"?(-?\d+)"?/);
      if (match) {
        results.push({ name: match[1], value: parseInt(match[2], 10) });
      }
    }
    return results;
  };
  // [新增] 解析人际关系字符串，支持多种格式:
  // 格式1: "人名(关系标签);人名(关系)"
  // 格式2: "与人名:关系描述;与人名:关系描述"
  // 格式3: "与人名:关系描述,细节;与人名:关系"
  const parseRelationshipString = str => {
    if (!str) return [];
    const results = [];
    const rawStr = String(str).trim();

    // 按分号分割
    const parts = rawStr.split(/[;；]/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // 格式2/3: "与人名:关系" 或 "与人名：关系"
      const colonMatch = trimmed.match(/^与?(.+?)[:\：](.+)$/);
      if (colonMatch) {
        const name = colonMatch[1].trim();
        const relation = colonMatch[2].trim();
        if (name && relation) {
          results.push({ name: name, relation: relation });
          continue;
        }
      }

      // 格式1: "人名(关系)" 或 "人名（关系）"
      const parenMatch = trimmed.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
      if (parenMatch) {
        results.push({ name: parenMatch[1].trim(), relation: parenMatch[2].trim() });
        continue;
      }

      // 都不匹配，整个作为人名
      if (trimmed.length > 0) {
        results.push({ name: trimmed, relation: '' });
      }
    }
    return results;
  };

  // [新增] 检测是否是人际关系格式
  const isRelationshipCell = (value, headerName) => {
    if (!value) return false;
    const str = String(value).trim();
    const lowerHeader = (headerName || '').toLowerCase();
    // 表头包含"关系"关键词
    if (lowerHeader.includes('关系') || lowerHeader.includes('人际')) {
      return true;
    }
    // 或者内容匹配 "名字(关系);名字(关系)" 格式
    return /^[^(（;；]+[(（][^)）]+[)）]([;；][^(（;；]+[(（][^)）]+[)）])*$/.test(str);
  };

  const processTemplate = (template, cardData, headers) => {
    if (!template || !cardData) return template;
    let result = template;
    const name = cardData[1] || '未知';
    result = result.replace(/\{Name\}/gi, name);
    result = result.replace(/\{RowIndex\}/gi, cardData[0] || '0');
    if (headers && headers.length > 0) {
      headers.forEach((header, idx) => {
        if (header && idx < cardData.length) {
          const value = cardData[idx] || '未知';
          const regex = new RegExp(`\\{${header}\\}`, 'gi');
          result = result.replace(regex, value);
        }
      });
    }
    result = result.replace(/\{[^}]+\}/g, '未知');
    return result;
  };

  // 固定显示的功能按钮
  const ACTION_BUTTONS = [
    { id: 'acu-btn-save-global', icon: 'fa-save', title: '保存所有修改' },
    { id: 'acu-btn-refresh', icon: 'fa-sync-alt', title: '重新加载' },
    { id: 'acu-btn-collapse', icon: 'fa-chevron-down', title: '收起面板' },
    // {id: 'acu-btn-open-editor', icon: 'fa-table-columns', title: '打开内置编辑器'},
    { id: 'acu-btn-refill', icon: 'fa-bolt', title: '重新填表' },
    { id: 'acu-btn-settings', icon: 'fa-cog', title: '全能设置' },
  ];

  let isInitialized = false;
  let isSaving = false;
  let isEditingOrder = false;
  let isSettingsOpen = false;
  let currentDiffMap = new Set();
  let observer = null;
  let _boundRenderHandler = null;

  // --- 全局状态变量 ---
  let cachedRawData = null;
  let hasUnsavedChanges = false;
  let tablePageStates = {};
  let tableSearchStates = {};
  let lastOptionHash = null;
  let optionPanelVisible = false; // [新增] 选项面板可见性控制
  // [修改] 初始化时从硬盘读取记忆
  const STORAGE_KEY_SCROLL = 'acu_scroll_v19_fixed';
  let tableScrollStates = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SCROLL);
    if (saved) tableScrollStates = JSON.parse(saved);
  } catch (e) {
    console.warn('[ACU] Error:', e);
  }
  // [优化] 智能更新控制器：后端数据变动时，自动更新快照
  const UpdateController = {
    _lastValidationCount: 0,
    _isRollingBack: false, // 防止回滚时触发递归

    handleUpdate: () => {
      // 防止回滚操作触发递归
      if (UpdateController._isRollingBack) return;

      // === 更新拦截逻辑（检查启用了 intercept 的规则） ===
      try {
        const snapshot = loadSnapshot();
        const newData = getTableData();
        if (snapshot && newData) {
          const rules = ValidationRuleManager.getEnabledRules();
          const violations = ValidationEngine.checkTableRules(snapshot, newData, rules);

          if (violations.length > 0) {
            console.warn('[ACU] 规则拦截触发，执行回滚:', violations);
            UpdateController._isRollingBack = true;

            // 获取 API 并回滚
            const api = getCore().getDB();
            if (api?.fillTable) {
              api.fillTable(snapshot);
              if (window.toastr) {
                window.toastr.error(violations[0].message, '已回滚', {
                  timeOut: 5000,
                  positionClass: 'toast-bottom-right',
                });
              }
            }

            setTimeout(() => {
              UpdateController._isRollingBack = false;
            }, 500);
            return;
          }
        }
      } catch (e) {
        console.error('[ACU] 拦截检查失败:', e);
      }

      // 直接触发渲染，让 renderInterface 内部处理数据获取和差异计算
      // 注意：不要在这里更新快照！快照只在用户主动保存时更新
      renderInterface();

      // 执行实时验证
      setTimeout(() => {
        try {
          const rawData = cachedRawData || getTableData();
          if (rawData) {
            const errors = ValidationEngine.validateAllData(rawData);
            const newCount = errors.length;

            // 只有当错误数量增加时才弹出提示
            if (newCount > UpdateController._lastValidationCount && newCount > 0) {
              const newErrors = newCount - UpdateController._lastValidationCount;
            }

            UpdateController._lastValidationCount = newCount;

            // 更新导航栏指示器
            updateValidationIndicator(newCount);
          }
        } catch (e) {
          console.error('[ACU] 验证执行失败:', e);
        }
      }, 100);
    },
  };

  // 更新导航栏验证指示器
  const updateValidationIndicator = count => {
    const { $ } = getCore();
    const $indicator = $('.acu-validation-indicator');

    if (count > 0) {
      if ($indicator.length) {
        $indicator.find('.acu-validation-count').text(count);
        $indicator.show();
      }
    } else {
      $indicator.hide();
    }
  };

  // --- [重构] 上下文指纹工具 ---
  const getCurrentContextFingerprint = () => {
    try {
      // 方式1: 酒馆标准 API
      if (typeof SillyTavern !== 'undefined' && SillyTavern.getCurrentChatId) {
        return SillyTavern.getCurrentChatId();
      }
      // 方式2: 直接访问属性
      if (typeof SillyTavern !== 'undefined' && SillyTavern.chatId) {
        return SillyTavern.chatId;
      }
      // 方式3: 父窗口 (iframe 场景)
      if (window.parent?.SillyTavern?.getCurrentChatId) {
        return window.parent.SillyTavern.getCurrentChatId();
      }
    } catch (e) {
      console.warn('[ACU] getCurrentContextFingerprint error:', e);
    }
    return 'unknown_context';
  };

  // 全局状态追踪 (已清理死代码)

  const DEFAULT_CONFIG = {
    layout: 'horizontal',
    collapseStyle: 'bar',
    collapseAlign: 'right',
    fontFamily: 'default',
    theme: 'retro',
    cardWidth: 260,
    fontSize: 13,
    highlightNew: true,
    itemsPerPage: 50,
    actionsPosition: 'bottom',
    gridColumns: 'auto', // [修改] 默认为智能自动列数
    positionMode: 'fixed', // fixed=悬浮底部, embedded=跟随消息
    showOptionPanel: true, // [新增] 显示选项面板
    clickOptionToAutoSend: true, // [新增] 点击选项自动发送
    optionFontSize: 12, // [新增] 行动选项独立字体大小
  };

  const FONTS = [
    { id: 'default', name: '系统默认 (Modern)', val: `'Segoe UI', 'Microsoft YaHei', sans-serif` },
    { id: 'hanchan', name: '寒蝉全圆体', val: `"寒蝉全圆体", sans-serif` },
    { id: 'maple', name: 'Maple Mono (代码风)', val: `"Maple Mono NF CN", monospace` },
    { id: 'huiwen', name: '汇文明朝体 (Huiwen)', val: `"Huiwen-mincho", serif` },
    { id: 'cooper', name: 'Cooper正楷', val: `"CooperZhengKai", serif` },
    { id: 'yffyt', name: 'YFFYT (艺术体)', val: `"YFFYT", sans-serif` },
    { id: 'fusion', name: 'Fusion Pixel (像素风)', val: `"Fusion Pixel 12px M latin", monospace` },
    { id: 'wenkai', name: '霞鹜文楷 (WenKai)', val: `"LXGW WenKai", serif` },
    { id: 'notosans', name: '思源黑体 (Noto Sans)', val: `"Noto Sans CJK", sans-serif` },
    { id: 'zhuque', name: '朱雀仿宋 (Zhuque)', val: `"Zhuque Fangsong (technical preview)", serif` },
  ];

  const THEMES = [
    { id: 'retro', name: '复古羊皮 (Retro)', icon: 'fa-scroll' },
    { id: 'dark', name: '极夜深空 (Dark)', icon: 'fa-moon' },
    { id: 'modern', name: '现代清爽 (Modern)', icon: 'fa-sun' },
    { id: 'forest', name: '森之物语 (Forest)', icon: 'fa-tree' },
    { id: 'ocean', name: '深海幽蓝 (Ocean)', icon: 'fa-water' },
    { id: 'cyber', name: '赛博霓虹 (Cyber)', icon: 'fa-bolt' },
    { id: 'nightowl', name: '深蓝磨砂 (Night Owl)', icon: 'fa-feather' },
  ];

  // [优化] 缓存 core 对象 (修复竞态条件 + 增强 ST 穿透查找)
  let _coreCache = null;
  const getCore = () => {
    const w = window.parent || window;
    // 动态获取 jQuery
    const $ = window.jQuery || w.jQuery;

    // 只有当缓存存在且有效($存在)时，才直接返回
    if (_coreCache && _coreCache.$) return _coreCache;

    const core = {
      $: $,
      getDB: () => w.AutoCardUpdaterAPI || window.AutoCardUpdaterAPI,
      clipboard: w.navigator.clipboard,
      // 增强查找：依次尝试 当前窗口 -> 父窗口 -> 顶层窗口 (带跨域保护)
      ST:
        window.SillyTavern ||
        w.SillyTavern ||
        (() => {
          try {
            return window.top ? window.top.SillyTavern : null;
          } catch (e) {
            return null;
          }
        })(),
    };

    // 只有成功获取到 jQuery 后才锁定缓存，防止初始化过早导致永久失效
    if ($) _coreCache = core;
    return core;
  };

  const updateSaveButtonState = () => {
    const { $ } = getCore();
    const $btn = $('#acu-btn-save-global');
    const $icon = $btn.find('i');
    const deletions = getPendingDeletions();
    let hasDeletions = false;
    if (deletions) {
      for (const key in deletions) {
        if (deletions[key] && deletions[key].length > 0) {
          hasDeletions = true;
          break;
        }
      }
    }
    if (hasUnsavedChanges || hasDeletions) {
      $icon.addClass('acu-icon-breathe');
      $btn.attr('title', '你有未保存的手动修改或删除操作');
    } else {
      $icon.removeClass('acu-icon-breathe');
      $btn.attr('title', '保存');
      $btn.css('color', '');
    }
  };

  const getIconForTableName = name => {
    if (!name) return 'fa-table';
    const n = name.toLowerCase();
    if (n.includes('主角') || n.includes('角色')) return 'fa-user-circle';
    if (n.includes('通用') || n.includes('全局')) return 'fa-globe-asia';
    if (n.includes('装备') || n.includes('背包')) return 'fa-briefcase';
    if (n.includes('技能') || n.includes('武魂')) return 'fa-dragon';
    if (n.includes('关系') || n.includes('周边')) return 'fa-user-friends';
    if (n.includes('任务') || n.includes('日志')) return 'fa-scroll';
    if (n.includes('人物') || n.includes('关键人物')) return 'fa-address-book';
    if (n.includes('总结') || n.includes('大纲')) return 'fa-book-reader';
    if (n.includes('地图点') || n.includes('世界地图')) return 'fa-map-location-dot';
    if (n.includes('地图元素') || n.includes('机关') || n.includes('线索')) return 'fa-bullseye';
    if (n.includes('势力') || n.includes('阵营')) return 'fa-shield-halved';
    if (n.includes('物品')) return 'fa-gem';
    if (n.includes('情报') || n.includes('信息')) return 'fa-file-lines';
    if (n.includes('选项')) return 'fa-list-check';
    return 'fa-table';
  };

  const getBadgeStyle = text => {
    if (!text) return '';
    const str = String(text).trim();
    if (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str)) return 'acu-badge-green';
    if (str.length <= 6 && !str.includes('http')) return 'acu-badge-neutral';
    if (['是', '否', '有', '无', '死亡', '存活'].includes(str)) return 'acu-badge-neutral';
    return '';
  };

  // [优化] 统一存储封装 (带静默自动清理)
  const Store = {
    get: (key, def = null) => {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? def;
      } catch {
        return def;
      }
    },
    set: (key, val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        // 捕获存储空间已满错误
        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
          console.warn('[ACU] 存储空间已满，触发静默清理策略...');
          try {
            // 1. 优先删除最占空间的“数据快照” (不影响功能，只会导致下次刷新暂时没有蓝色高亮)
            localStorage.removeItem(STORAGE_KEY_LAST_SNAPSHOT);

            // 2. 再次尝试保存
            localStorage.setItem(key, JSON.stringify(val));
          } catch (retryErr) {
            // 如果清理后还是存不下，才弹窗打扰用户
            console.error('[ACU Store] 清理后依然失败', retryErr);
            if (window.toastr && !window._acuQuotaAlerted) {
              window.toastr.warning('⚠️ 浏览器存储空间严重不足，配置保存失败');
              window._acuQuotaAlerted = true;
              setTimeout(() => (window._acuQuotaAlerted = false), 10000);
            }
          }
        } else {
          console.error('[ACU Store]', e);
        }
      }
    },
  };

  const getActiveTabState = () => Store.get(STORAGE_KEY_ACTIVE_TAB);
  const saveActiveTabState = v => Store.set(STORAGE_KEY_ACTIVE_TAB, v);
  const getPendingDeletions = () => Store.get(STORAGE_KEY_PENDING_DELETIONS, {});
  const savePendingDeletions = v => Store.set(STORAGE_KEY_PENDING_DELETIONS, v);
  const getSavedTableOrder = () => Store.get(STORAGE_KEY_TABLE_ORDER);
  const saveTableOrder = v => Store.set(STORAGE_KEY_TABLE_ORDER, v);
  const getCollapsedState = () => Store.get(STORAGE_KEY_IS_COLLAPSED, false);
  const saveCollapsedState = v => Store.set(STORAGE_KEY_IS_COLLAPSED, v);
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = () => {
    const data = Store.get(STORAGE_KEY_LAST_SNAPSHOT);
    if (!data) return null;
    // 获取当前环境指纹
    const currentCtx = getCurrentContextFingerprint();
    // 如果快照里的指纹存在，但和当前不一致，说明是上个角色的数据，必须作废
    if (data._contextId && data._contextId !== currentCtx) {
      return null;
    }
    return data;
  };

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = v => {
    if (!v) return;
    // 确保数据对象里带有当前 ChatID
    if (typeof v === 'object') {
      v._contextId = getCurrentContextFingerprint();
    }
    Store.set(STORAGE_KEY_LAST_SNAPSHOT, v);
  };

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = () => Store.get(STORAGE_KEY_TABLE_HEIGHTS, {});
  const saveTableHeights = v => Store.set(STORAGE_KEY_TABLE_HEIGHTS, v);
  const getTableStyles = () => Store.get(STORAGE_KEY_TABLE_STYLES, {});
  const saveTableStyles = v => Store.set(STORAGE_KEY_TABLE_STYLES, v);
  const getHiddenTables = () => Store.get(STORAGE_KEY_HIDDEN_TABLES, []);
  const saveHiddenTables = v => Store.set(STORAGE_KEY_HIDDEN_TABLES, v);
  const getReverseTables = () => Store.get(STORAGE_KEY_REVERSE_TABLES, []);
  const saveReverseTables = v => Store.set(STORAGE_KEY_REVERSE_TABLES, v);

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = tableName => {
    if (!tableName) return false;
    const keywords = ['总结', '大纲', '日志', '记录', '历史'];
    return keywords.some(kw => tableName.includes(kw));
  };

  // 判断表格当前是否为倒序
  const isTableReversed = tableName => {
    return getReverseTables().includes(tableName);
  };

  // 切换表格倒序状态
  const toggleTableReverse = tableName => {
    const list = getReverseTables();
    const idx = list.indexOf(tableName);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(tableName);
    }
    saveReverseTables(list);
    console.log('[ACU] toggleTableReverse:', tableName, 'reversed:', idx < 0);
  };
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = characterName => {
    const rawData = cachedRawData || getTableData();
    if (!rawData) return [];

    const isUser = !characterName || characterName === '<user>' || characterName.trim() === '';

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet || !sheet.name || !sheet.content) continue;
      const sheetName = sheet.name;

      // 主角信息表 -> <user> (模糊匹配)
      if (
        isUser &&
        (sheetName.includes('主角') || sheetName.includes('玩家') || sheetName.toLowerCase().includes('player'))
      ) {
        if (sheet.content[1]) {
          const headers = sheet.content[0] || [];
          const row = sheet.content[1];
          let attrs = [];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!attrs.includes(attr.name)) attrs.push(attr.name);
              });
            }
          });
          if (attrs.length > 0) return attrs;
        }
      }

      // 重要人物表 -> 其他角色 (模糊匹配)
      if (
        !isUser &&
        (sheetName.includes('人物') ||
          sheetName.includes('NPC') ||
          sheetName.includes('角色') ||
          sheetName.toLowerCase().includes('character'))
      ) {
        const headers = sheet.content[0] || [];
        // 动态查找姓名列
        let nameColIdx = 1;
        for (let h = 0; h < headers.length; h++) {
          if (
            headers[h] &&
            (headers[h].includes('姓名') || headers[h].includes('名称') || headers[h].toLowerCase().includes('name'))
          ) {
            nameColIdx = h;
            break;
          }
        }

        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && row[nameColIdx] === characterName) {
            let attrs = [];
            headers.forEach((h, idx) => {
              if (h && h.includes('属性')) {
                const parsed = parseAttributeString(row[idx] || '');
                parsed.forEach(attr => {
                  if (!attrs.includes(attr.name)) attrs.push(attr.name);
                });
              }
            });
            return attrs;
          }
        }
      }
    }

    return [];
  };
  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = (characterName, attrName) => {
    const rawData = cachedRawData || getTableData();
    if (!rawData || !attrName) return null;

    const isUser = !characterName || characterName === '<user>' || characterName.trim() === '';

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet || !sheet.name || !sheet.content) continue;
      const sheetName = sheet.name;

      // 主角信息表 -> <user> (模糊匹配)
      if (
        isUser &&
        (sheetName.includes('主角') || sheetName.includes('玩家') || sheetName.toLowerCase().includes('player'))
      ) {
        if (sheet.content[1]) {
          const headers = sheet.content[0] || [];
          const row = sheet.content[1];
          for (let idx = 0; idx < headers.length; idx++) {
            const h = headers[idx];
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              const found = parsed.find(attr => attr.name === attrName);
              if (found) return found.value;
            }
          }
        }
      }

      // 重要人物表 -> 其他角色 (模糊匹配)
      if (
        !isUser &&
        (sheetName.includes('人物') ||
          sheetName.includes('NPC') ||
          sheetName.includes('角色') ||
          sheetName.toLowerCase().includes('character'))
      ) {
        const headers = sheet.content[0] || [];
        // 动态查找姓名列
        let nameColIdx = 1;
        for (let h = 0; h < headers.length; h++) {
          if (
            headers[h] &&
            (headers[h].includes('姓名') || headers[h].includes('名称') || headers[h].toLowerCase().includes('name'))
          ) {
            nameColIdx = h;
            break;
          }
        }

        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && row[nameColIdx] === characterName) {
            for (let idx = 0; idx < headers.length; idx++) {
              const h = headers[idx];
              if (h && h.includes('属性')) {
                const parsed = parseAttributeString(row[idx] || '');
                const found = parsed.find(attr => attr.name === attrName);
                if (found) return found.value;
              }
            }
          }
        }
      }
    }

    return null;
  };
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = () => {
    const preset = AttributePresetManager.getActivePreset();
    if (preset && preset.baseAttributes) {
      return preset.baseAttributes.map(attr => attr.name);
    }
    return STANDARD_ATTRS;
  };

  /**
   * 获取当前规则的随机属性池（包含基本属性和特殊属性）
   * 默认状态：返回所有规则预设的属性合并（超级大杂烩）
   * 选中特定规则时：返回该规则的基本属性 + 特殊属性
   */
  const getRandomSkillPool = () => {
    try {
      const preset = AttributePresetManager.getActivePreset();
      if (preset) {
        // 选中特定规则：返回该规则的基本属性 + 特殊属性
        const allAttrs = new Set();
        
        // 添加基本属性
        if (preset.baseAttributes && Array.isArray(preset.baseAttributes)) {
          preset.baseAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : (attr && attr.name);
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }
        
        // 添加特殊属性
        if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
          preset.specialAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : (attr && attr.name);
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }
        
        return Array.from(allAttrs);
      }

      // 默认状态（没有激活预设）：返回所有规则预设的属性合并（超级大杂烩）
      const allPresets = AttributePresetManager.getAllPresets() || [];
      const allAttrs = new Set(RANDOM_SKILL_POOL || []); // 先添加默认池

      // 合并所有预设的基本属性和特殊属性
      if (Array.isArray(allPresets)) {
        allPresets.forEach(p => {
          if (!p) return;
          
          // 添加基本属性
          if (p.baseAttributes && Array.isArray(p.baseAttributes)) {
            p.baseAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : (attr && attr.name);
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }
          
          // 添加特殊属性
          if (p.specialAttributes && Array.isArray(p.specialAttributes)) {
            p.specialAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : (attr && attr.name);
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }
        });
      }

      return Array.from(allAttrs);
    } catch (err) {
      console.error('[ACU] getRandomSkillPool 错误:', err);
      return RANDOM_SKILL_POOL || [];
    }
  };

  // [新增] 随机技能池（用于属性名随机生成，可自由增减）
  const RANDOM_SKILL_POOL = [
    // --- 身体与移动类 (Physical & Movement) ---
    '杂技',
    '特技',
    '运动',
    '格斗',
    '斗殴',
    '攀爬',
    '健康',
    '闪避',
    '身法',
    '驾驶',
    '耐力',
    '灵巧',
    '巧手',
    '戏法',
    '跑酷',
    '飞行',
    '潜行',
    '渗透',
    '骑术',
    '游泳',
    '投掷',
    '跳跃',
    '体操',
    '功夫',
    '武术',

    // --- 社交与心理类 (Social & Psychological) ---
    '行政',
    '官僚',
    '权威',
    '命令',
    '交易',
    '掮客',
    '欺诈',
    '诱骗',
    '谎言侦测',
    '狂欢',
    '交际',
    '摆布',
    '镇定',
    '黑话',
    '行话',
    '礼节',
    '礼仪',
    '信誉',
    '财力',
    '戏剧',
    '表演',
    '共情',
    '洞察',
    '情感',
    '团队精神',
    '话术',
    '博弈',
    '赌博',
    '阅人',
    '小透明',
    '审讯',
    '恐吓',
    '挑衅',
    '领导',
    '谈判',
    '演说',
    '精神分析',
    '街头智慧',
    '边缘知识',
    '残酷真相',
    '意志',
    '决心',
    '说服',
    '魅惑',
    '威吓',
    '游说',
    '交涉',
    '察言观色',
    '欺骗',
    '洞悉',
    '欺瞒',
    // 网络/现代用语
    '标新立异',
    '脑内剧场',
    '神游太虚',
    '踩地雷',
    '顾左右而言他',
    '主角光环',
    '厚颜无耻',
    '甩锅',
    '造假',
    '废话文学',
    '上头',
    '破防',
    '种草',
    '社死',
    '点子',
    '惊世智慧',
    '奶龙之力',
    '狗屎运',
    '天意',
    '桃花运',

    // --- 技术与技艺类 (Technical & Crafting) ---
    '建筑学',
    '军械',
    '枪械制造',
    '工匠',
    '技艺',
    '生物科技',
    '露营',
    '化学',
    '药理',
    '创作',
    '电脑',
    '黑客',
    '赛博技术',
    '爆破',
    '电子学',
    '工程学',
    '急救',
    '伪造',
    '信息安全',
    '修补',
    '捣鼓',
    '开锁',
    '机械',
    '修理',
    '医学',
    '摄影',
    '编程',
    '锻造',
    '编译',
    '科技使用',
    '机械维修',
    '电气维修',
    '锁匠',
    '操作重型机械',
    '药学',
    '艺术',

    // --- 知识与调查类 (Knowledge & Investigation) ---
    '会计',
    '人类学',
    '智慧生物学',
    '考古学',
    '灵视',
    '导航',
    '方向',
    '天文学',
    '生物学',
    '犯罪学',
    '神话',
    '禁忌知识',
    '文化',
    '习俗',
    '法医',
    '搜证',
    '历史',
    '人力情报',
    '调查',
    '搜索',
    '语言',
    '语言学',
    '法律',
    '图书馆使用',
    '研究',
    '学识',
    '侦察',
    '神秘学',
    '物理',
    '有备无患',
    '信号情报',
    '生存',
    '战术',
    '神学',
    '通识',
    '侦查',
    '聆听',
    '心理学',
    '追踪',
    '博物学',
    '克苏鲁神话',
    '地质学',
    '气象学',
    '奥秘',
    '自然',
    '宗教',
    '察觉',
    '求生',
    '情报收集',
    '估价',
    '密语',
    '读唇',
    '手语',

    // --- 战斗与特殊类 (Combat & Special) ---
    '弓术',
    '炮术',
    '引导',
    '召唤',
    '信仰',
    '奇迹',
    '击剑',
    '枪械',
    '射击',
    '重武器',
    '先攻',
    '神射',
    '狙击',
    '武艺',
    '近战',
    '兵器',
    '预兆',
    '运气',
    '格挡',
    '灵能',
    '巫术',
    '施法',
    '茶道',
    '破坏',
    '剑术',
    '斧术',
    '鞭术',
    '躲藏',
    '乔装',
    '隐匿',
    '驯兽',
    '医疗',
    '催眠',
    '伪装',
    '时髦值',
  ];

  // [新增] 生成 COC/DND 风格的6维属性（支持预设）
  /**
   * 生成角色属性
   * @param isDNDOrPreset 布尔值(旧版兼容) 或 预设对象 或 null(自动获取激活预设)
   * @returns { base: {...}, special: {...} } 或旧格式 {...}（向后兼容）
   */
  const generateRPGAttributes = (isDNDOrPreset = undefined) => {
    // 兼容旧版：如果传入布尔值，使用传统逻辑
    if (typeof isDNDOrPreset === 'boolean') {
      const isDND = isDNDOrPreset;
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);

      const generateValue = () => {
        if (isDND) {
          const base = generate3d6();
          const adjust = rollDice(4) - 2;
          return Math.max(3, Math.min(18, base + adjust));
        } else {
          const base = generate3d6() * 5;
          const adjust = rollDice(10) - 5;
          return Math.max(5, Math.min(95, base + adjust));
        }
      };

      const result = {};
      STANDARD_ATTRS.forEach(attr => {
        result[attr] = generateValue();
      });
      return result; // 旧格式
    }

    // 新版：使用预设系统
    const preset = isDNDOrPreset || AttributePresetManager.getActivePreset();

    // 如果没有激活预设，使用默认逻辑（百分制六维）
    if (!preset) {
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);
      const result = {};
      STANDARD_ATTRS.forEach(attr => {
        const base = generate3d6() * 5;
        const adjust = rollDice(10) - 5;
        result[attr] = Math.max(5, Math.min(95, base + adjust));
      });
      return { base: result, special: {} };
    }

    // 第一阶段：生成基本属性
    const baseResult = {};
    preset.baseAttributes.forEach(attr => {
      const formula = attr.modifier ? `${attr.formula}+${attr.modifier}` : attr.formula;
      baseResult[attr.name] = generateAttributeValue(formula, attr.range, {});
    });

    // 第二阶段：生成特别属性（可引用基本属性）
    const specialResult = {};
    if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
      preset.specialAttributes.forEach(attr => {
        specialResult[attr.name] = generateAttributeValue(attr.formula, attr.range, baseResult);
      });
    }

    return { base: baseResult, special: specialResult };
  };

  // [新增] 清空角色的规则预设属性（保留用户自定义属性）
  const clearPresetAttributesForCharacter = async charName => {
    const rawData = cachedRawData || getTableData();
    if (!rawData) {
      console.error('[ACU] clearPresetAttributesForCharacter: 无法获取表格数据');
      if (window.toastr) window.toastr.error('无法获取表格数据');
      return { success: false };
    }

    const isUser = !charName || charName === '<user>' || charName.trim() === '';
    let targetSheet = null;
    let targetRowIndex = -1;
    let targetColIndex = -1;
    let sheetKey = null;

    // 查找目标表和行（复用查找逻辑）
    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet || !sheet.name || !sheet.content) continue;
      const sheetName = sheet.name;
      const headers = sheet.content[0] || [];

      // 主角信息表
      if (
        isUser &&
        (sheetName.includes('主角') || sheetName.includes('玩家') || sheetName.toLowerCase().includes('player'))
      ) {
        if (sheet.content[1]) {
          targetSheet = sheet;
          targetRowIndex = 1;
          sheetKey = key;

          // 查找属性列
          for (let h = 0; h < headers.length; h++) {
            if (headers[h] && headers[h].includes('基础属性')) {
              targetColIndex = h;
              break;
            }
          }
          if (targetColIndex < 0) {
            for (let h = 0; h < headers.length; h++) {
              if (headers[h] && headers[h].includes('属性')) {
                targetColIndex = h;
                break;
              }
            }
          }
          break;
        }
      }

      // NPC/角色/人物表
      if (
        !isUser &&
        (sheetName.includes('人物') ||
          sheetName.includes('NPC') ||
          sheetName.includes('角色') ||
          sheetName.toLowerCase().includes('character'))
      ) {
        let nameColIdx = 1;
        for (let h = 0; h < headers.length; h++) {
          if (
            headers[h] &&
            (headers[h].includes('姓名') || headers[h].includes('名称') || headers[h].toLowerCase().includes('name'))
          ) {
            nameColIdx = h;
            break;
          }
        }

        // 查找目标行
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && row[nameColIdx] === charName) {
            targetSheet = sheet;
            targetRowIndex = i;
            sheetKey = key;

            // 查找属性列
            for (let h = 0; h < headers.length; h++) {
              if (headers[h] && headers[h].includes('基础属性')) {
                targetColIndex = h;
                break;
              }
            }
            if (targetColIndex < 0) {
              for (let h = 0; h < headers.length; h++) {
                if (headers[h] && headers[h].includes('属性')) {
                  targetColIndex = h;
                  break;
                }
              }
            }
            break;
          }
        }
        if (targetRowIndex > 0) break;
      }
    }

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      console.error('[ACU] clearPresetAttributesForCharacter: 找不到角色', charName);
      if (window.toastr) window.toastr.error(`找不到角色「${charName || '<user>'}」`);
      return { success: false };
    }

    if (targetColIndex < 0) {
      console.error('[ACU] clearPresetAttributesForCharacter: 找不到属性列');
      if (window.toastr) window.toastr.error('找不到属性列');
      return { success: false };
    }

    // 读取现有属性
    const existingStr = targetSheet.content[targetRowIndex][targetColIndex] || '';
    const existingAttrs = parseAttributeString(existingStr);

    // 获取当前规则预设的属性名集合
    const standardAttrs = getStandardAttrs();
    const preset = AttributePresetManager.getActivePreset();
    const presetAttrNames = new Set(standardAttrs);
    if (preset && preset.specialAttributes) {
      preset.specialAttributes.forEach(attr => presetAttrNames.add(attr.name));
    }

    // 只保留用户自定义的属性
    const customAttrs = existingAttrs.filter(attr => !presetAttrNames.has(attr.name));
    const newAttrString = customAttrs.map(attr => `${attr.name}:${attr.value}`).join(';');

    // 写入数据
    targetSheet.content[targetRowIndex][targetColIndex] = newAttrString;
    cachedRawData = rawData;

    // 保存
    await saveDataOnly(rawData);

    return {
      success: true,
      attrString: newAttrString,
    };
  };

  // [新增] 将属性写入角色表格
  const writeAttributesToCharacter = async (charName, newAttrs, isDND = false) => {
    const rawData = cachedRawData || getTableData();
    if (!rawData) {
      console.error('[ACU] writeAttributesToCharacter: 无法获取表格数据');
      if (window.toastr) window.toastr.error('无法获取表格数据');
      return { success: false };
    }

    const isUser = !charName || charName === '<user>' || charName.trim() === '';
    let targetSheet = null;
    let targetRowIndex = -1;
    let targetColIndex = -1;
    let sheetKey = null;

    // 查找目标表和行
    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet || !sheet.name || !sheet.content) continue;
      const sheetName = sheet.name;
      const headers = sheet.content[0] || [];

      // 主角信息表
      if (
        isUser &&
        (sheetName.includes('主角') || sheetName.includes('玩家') || sheetName.toLowerCase().includes('player'))
      ) {
        if (sheet.content[1]) {
          targetSheet = sheet;
          targetRowIndex = 1;
          sheetKey = key;

          // 查找属性列（优先"基础属性"）
          for (let h = 0; h < headers.length; h++) {
            if (headers[h] && headers[h].includes('基础属性')) {
              targetColIndex = h;
              break;
            }
          }
          if (targetColIndex < 0) {
            for (let h = 0; h < headers.length; h++) {
              if (headers[h] && headers[h].includes('属性')) {
                targetColIndex = h;
                break;
              }
            }
          }
          break;
        }
      }

      // 重要人物表
      if (
        !isUser &&
        (sheetName.includes('人物') ||
          sheetName.includes('NPC') ||
          sheetName.includes('角色') ||
          sheetName.toLowerCase().includes('character'))
      ) {
        // 查找姓名列
        let nameColIdx = 1;
        for (let h = 0; h < headers.length; h++) {
          if (
            headers[h] &&
            (headers[h].includes('姓名') || headers[h].includes('名称') || headers[h].toLowerCase().includes('name'))
          ) {
            nameColIdx = h;
            break;
          }
        }

        // 查找目标行
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && row[nameColIdx] === charName) {
            targetSheet = sheet;
            targetRowIndex = i;
            sheetKey = key;

            // 查找属性列
            for (let h = 0; h < headers.length; h++) {
              if (headers[h] && headers[h].includes('基础属性')) {
                targetColIndex = h;
                break;
              }
            }
            if (targetColIndex < 0) {
              for (let h = 0; h < headers.length; h++) {
                if (headers[h] && headers[h].includes('属性')) {
                  targetColIndex = h;
                  break;
                }
              }
            }
            break;
          }
        }
        if (targetRowIndex > 0) break;
      }
    }

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      console.error('[ACU] writeAttributesToCharacter: 找不到角色', charName);
      if (window.toastr) window.toastr.error(`找不到角色「${charName || '<user>'}」`);
      return { success: false };
    }

    if (targetColIndex < 0) {
      console.error('[ACU] writeAttributesToCharacter: 找不到属性列');
      if (window.toastr) window.toastr.error('找不到属性列（需要包含"属性"关键词的列）');
      return { success: false };
    }

    // 读取现有属性
    const existingStr = targetSheet.content[targetRowIndex][targetColIndex] || '';
    const existingAttrs = parseAttributeString(existingStr);

    // 构建现有属性的映射
    const existingMap = {};
    existingAttrs.forEach(attr => {
      existingMap[attr.name] = attr.value;
    });

    // 获取当前规则的所有属性列表（基本+特殊）
    const standardAttrs = getStandardAttrs();
    const preset = AttributePresetManager.getActivePreset();
    const presetAttrNames = new Set(standardAttrs);
    if (preset && preset.specialAttributes) {
      preset.specialAttributes.forEach(attr => presetAttrNames.add(attr.name));
    }

    // 检查标准属性（基本属性）是否完整
    let standardCount = 0;
    standardAttrs.forEach(attrName => {
      if (existingMap[attrName] !== undefined) {
        standardCount++;
      }
    });
    const isComplete = standardCount === standardAttrs.length;

    // 收集用户自定义属性（不属于当前规则预设的属性）
    const customAttrs = [];
    existingAttrs.forEach(attr => {
      if (!presetAttrNames.has(attr.name)) {
        customAttrs.push({ name: attr.name, value: attr.value });
      }
    });

    // 按标准顺序构建结果
    const resultParts = [];

    // 1. 写入基本属性
    standardAttrs.forEach(attrName => {
      if (isComplete) {
        // 完整 → 全部用新值覆盖
        const newValue = newAttrs[attrName] !== undefined ? newAttrs[attrName] : existingMap[attrName];
        if (newValue !== undefined) {
          resultParts.push(`${attrName}:${newValue}`);
        }
      } else {
        // 不完整 → 有则保留，无则用新值
        if (existingMap[attrName] !== undefined) {
          resultParts.push(`${attrName}:${existingMap[attrName]}`);
        } else if (newAttrs[attrName] !== undefined) {
          resultParts.push(`${attrName}:${newAttrs[attrName]}`);
        }
      }
    });

    // 2. 写入特殊属性（如果完整则覆盖，否则补充）
    Object.keys(newAttrs).forEach(attrName => {
      if (!standardAttrs.includes(attrName)) {
        // 这是特殊属性
        if (isComplete || !existingMap[attrName]) {
          // 完整时覆盖，或者不存在时添加
          resultParts.push(`${attrName}:${newAttrs[attrName]}`);
        } else {
          // 不完整且已存在，保留旧值
          resultParts.push(`${attrName}:${existingMap[attrName]}`);
        }
      }
    });

    // 3. 追加用户自定义属性（不属于规则预设的）
    customAttrs.forEach(attr => {
      resultParts.push(`${attr.name}:${attr.value}`);
    });

    const newAttrString = resultParts.join(';');

    // 写入数据
    targetSheet.content[targetRowIndex][targetColIndex] = newAttrString;
    cachedRawData = rawData;

    // 保存（不更新快照，保留审核面板状态）
    await saveDataOnly(rawData);

    // 返回写入的属性供UI更新
    const writtenAttrs = [];
    standardAttrs.forEach(attrName => {
      writtenAttrs.push({ name: attrName, value: newAttrs[attrName] });
    });

    return {
      success: true,
      attrs: writtenAttrs,
      attrString: newAttrString,
      wasComplete: isComplete,
    };
  };
  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = characterName => {
    const rawData = cachedRawData || getTableData();
    if (!rawData) return [];

    const isUser = !characterName || characterName === '<user>' || characterName.trim() === '';
    let attrs = [];

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet || !sheet.name || !sheet.content) continue;
      const sheetName = sheet.name;

      // 主角信息表 -> <user> (模糊匹配)
      if (
        isUser &&
        (sheetName.includes('主角') || sheetName.includes('玩家') || sheetName.toLowerCase().includes('player'))
      ) {
        if (sheet.content[1]) {
          const headers = sheet.content[0] || [];
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!attrs.some(a => a.name === attr.name)) {
                  attrs.push(attr);
                }
              });
            }
          });
          if (attrs.length > 0) break;
        }
      }

      // 重要人物表 -> 其他角色 (模糊匹配)
      if (
        !isUser &&
        (sheetName.includes('人物') ||
          sheetName.includes('NPC') ||
          sheetName.includes('角色') ||
          sheetName.toLowerCase().includes('character'))
      ) {
        const headers = sheet.content[0] || [];
        // 动态查找姓名列
        let nameColIdx = 1;
        for (let h = 0; h < headers.length; h++) {
          if (
            headers[h] &&
            (headers[h].includes('姓名') || headers[h].includes('名称') || headers[h].toLowerCase().includes('name'))
          ) {
            nameColIdx = h;
            break;
          }
        }

        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row && row[nameColIdx] === characterName) {
            headers.forEach((h, idx) => {
              if (h && h.includes('属性')) {
                const parsed = parseAttributeString(row[idx] || '');
                parsed.forEach(attr => {
                  if (!attrs.some(a => a.name === attr.name)) {
                    attrs.push(attr);
                  }
                });
              }
            });
            break;
          }
        }
        if (attrs.length > 0) break;
      }
    }

    return attrs;
  };
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = ($input, options, themeColors) => {
    const { $ } = getCore();
    const t = themeColors || {};
    const inputId = $input.attr('id') || 'dd_' + Math.random().toString(36).substr(2, 9);
    $input.attr('id', inputId);

    // 移除已存在的下拉
    $input.parent().find('.acu-dropdown-list').remove();

    // 包裹成 wrapper
    if (!$input.parent().hasClass('acu-dropdown-wrapper')) {
      $input.wrap('<div class="acu-dropdown-wrapper"></div>');
    }

    // 创建下拉列表
    const $dropdown = $(`<div class="acu-dropdown-list" data-for="${inputId}"></div>`);
    $dropdown.css({
      background: t.bgPanel || '#fff',
      'border-color': t.border || '#ccc',
    });
    $input.after($dropdown);

    const renderItems = (filter = '') => {
      const lowerFilter = filter.toLowerCase();
      const filtered = options.filter(opt => opt.toLowerCase().includes(lowerFilter));

      if (filtered.length === 0) {
        $dropdown.html(`<div class="acu-dropdown-empty" style="color:${t.textSub || '#999'};">无匹配项</div>`);
      } else {
        $dropdown.html(
          filtered
            .map(
              opt =>
                `<div class="acu-dropdown-item" data-value="${escapeHtml(opt)}" style="color:${t.textMain || '#333'};">${escapeHtml(opt)}</div>`,
            )
            .join(''),
        );
      }
    };

    const showDropdown = () => {
      $('.acu-dropdown-list').removeClass('visible');
      renderItems($input.val());
      $dropdown.addClass('visible');
    };

    const hideDropdown = () => {
      $dropdown.removeClass('visible');
    };

    // 点击输入框显示下拉
    $input.off('.acudd').on('focus.acudd click.acudd', function (e) {
      e.stopPropagation();
      showDropdown();
    });

    // 输入筛选
    $input.on('input.acudd', function () {
      renderItems($(this).val());
    });

    // hover 效果（动态适配主题）
    $dropdown
      .on('mouseenter', '.acu-dropdown-item', function () {
        $(this).css('background', t.tableHead || 'rgba(128,128,128,0.15)');
      })
      .on('mouseleave', '.acu-dropdown-item', function () {
        $(this).css('background', 'transparent');
      });

    // 选择项目
    $dropdown.on('click', '.acu-dropdown-item', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const val = $(this).data('value');
      $input.val(val).trigger('change');
      hideDropdown();
    });

    // 点击下拉列表本身不关闭
    $dropdown.on('click', function (e) {
      e.stopPropagation();
    });

    // 点击面板其他区域关闭
    $input
      .closest('.acu-dice-panel, .acu-contest-panel')
      .off('click.acudd_' + inputId)
      .on('click.acudd_' + inputId, function (e) {
        if (!$(e.target).closest('.acu-dropdown-wrapper').length) {
          hideDropdown();
        }
      });
  };
  // [新增] 给输入框添加清除按钮
  const addClearButton = ($panel, inputSelector, themeColors) => {
    const { $ } = getCore();
    const t = themeColors || {};
    $panel.find(inputSelector).each(function () {
      const $input = $(this);
      // 避免重复添加
      if ($input.parent().hasClass('acu-input-wrapper')) return;
      // 包装输入框
      $input.wrap('<div class="acu-input-wrapper"></div>');
      // 添加清除按钮 - 使用内联样式跟随主题
      const $clearBtn = $(
        `<button type="button" class="acu-clear-btn" title="清除" style="color:${t.textSub || '#999'};"><i class="fa-solid fa-times"></i></button>`,
      );
      $input.after($clearBtn);
      // 点击清除
      $clearBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $input.val('').trigger('input').trigger('change').focus();
      });
      // 悬停效果 - 使用主题强调色
      $clearBtn
        .on('mouseenter', function () {
          $(this).css({ color: t.accent || '#7a695f', opacity: '1' });
        })
        .on('mouseleave', function () {
          $(this).css({ color: t.textSub || '#999', opacity: '0.5' });
        });
    });
  };
  // [新增] 统一的骰子规则设置面板
  const showDiceSettingsPanel = (isDND = false) => {
    const { $ } = getCore();
    $('.acu-dice-config-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();

    const ruleTitle = isDND ? 'DND 规则设置' : 'COC 规则设置';
    const resetText = isDND ? '恢复 DND 默认' : '恢复 COC 默认';

    // 默认值定义
    const defaults = isDND
      ? { critSuccess: 20, critFail: 1 }
      : { critSuccess: 5, critFail: 96, hardDiv: 2, extremeDiv: 5 };

    // 当前值：只有用户明确设置过才显示，否则留空用 placeholder
    const currentCritSuccess = isDND
      ? diceCfg.dndCritSuccess !== undefined && diceCfg.dndCritSuccess !== defaults.critSuccess
        ? diceCfg.dndCritSuccess
        : ''
      : diceCfg.critSuccessMax !== undefined && diceCfg.critSuccessMax !== defaults.critSuccess
        ? diceCfg.critSuccessMax
        : '';
    const currentCritFail = isDND
      ? diceCfg.dndCritFail !== undefined && diceCfg.dndCritFail !== defaults.critFail
        ? diceCfg.dndCritFail
        : ''
      : diceCfg.critFailMin !== undefined && diceCfg.critFailMin !== defaults.critFail
        ? diceCfg.critFailMin
        : '';
    const currentHardDiv =
      !isDND && diceCfg.difficultSuccessDiv !== undefined && diceCfg.difficultSuccessDiv !== defaults.hardDiv
        ? diceCfg.difficultSuccessDiv
        : '';
    const currentExtremeDiv =
      !isDND && diceCfg.hardSuccessDiv !== undefined && diceCfg.hardSuccessDiv !== defaults.extremeDiv
        ? diceCfg.hardSuccessDiv
        : '';

    const tieRule = diceCfg.contestTieRule || 'initiator_lose';

    const cocExtraHtml = isDND
      ? ''
      : `
            <div class="acu-dice-cfg-row">
                <div class="acu-dice-cfg-item">
                    <label>困难 (÷)</label>
                    <input type="number" id="cfg-hard-div" value="${currentHardDiv}" placeholder="${defaults.hardDiv}" min="2" max="5">
                </div>
                <div class="acu-dice-cfg-item">
                    <label>极难 (÷)</label>
                    <input type="number" id="cfg-extreme-div" value="${currentExtremeDiv}" placeholder="${defaults.extremeDiv}" min="3" max="10">
                </div>
            </div>
        `;

    const panelHtml = `
            <div class="acu-dice-config-overlay">
                <div class="acu-dice-config-dialog acu-theme-${config.theme}">
                    <div class="acu-dice-cfg-header">
                        <span><i class="fa-solid fa-cog"></i> ${ruleTitle}</span>
                        <button class="acu-config-close"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-dice-cfg-body">
                        <div class="acu-dice-cfg-row">
                            <div class="acu-dice-cfg-item">
                                <label>大成功阈值</label>
                                <input type="number" id="cfg-crit-success" value="${currentCritSuccess}" placeholder="${defaults.critSuccess}" min="1" max="100">
                            </div>
                            <div class="acu-dice-cfg-item">
                                <label>大失败阈值</label>
                                <input type="number" id="cfg-crit-fail" value="${currentCritFail}" placeholder="${defaults.critFail}" min="1" max="100">
                            </div>
                        </div>
                        ${cocExtraHtml}
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item">
                                <label>对抗平手规则</label>
                                <select id="cfg-tie-rule">
                                    <option value="initiator_lose" ${tieRule === 'initiator_lose' ? 'selected' : ''}>甲方判负 (默认)</option>
                                    <option value="tie" ${tieRule === 'tie' ? 'selected' : ''}>双方平手</option>
                                    <option value="initiator_win" ${tieRule === 'initiator_win' ? 'selected' : ''}>甲方判胜</option>
                                </select>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-actions">
                            <button id="cfg-reset-dice">${resetText}</button>
                            <button id="cfg-save-dice" class="primary"><i class="fa-solid fa-check"></i> 保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const $panel = $(panelHtml);
    $('body').append($panel);

    $panel.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      'z-index': '2147483655',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '20px',
      'box-sizing': 'border-box',
    });

    const closePanel = () => $panel.remove();
    $panel.find('.acu-config-close').click(closePanel);
    $panel.on('click', e => {
      if ($(e.target).hasClass('acu-dice-config-overlay')) closePanel();
    });

    $panel.find('#cfg-save-dice').click(function () {
      const newCfg = { contestTieRule: $('#cfg-tie-rule').val() };

      // 读取值，空则用默认值
      const critSuccessVal = $('#cfg-crit-success').val().trim();
      const critFailVal = $('#cfg-crit-fail').val().trim();

      if (isDND) {
        newCfg.dndCritSuccess = critSuccessVal !== '' ? parseInt(critSuccessVal, 10) : defaults.critSuccess;
        newCfg.dndCritFail = critFailVal !== '' ? parseInt(critFailVal, 10) : defaults.critFail;
      } else {
        newCfg.critSuccessMax = critSuccessVal !== '' ? parseInt(critSuccessVal, 10) : defaults.critSuccess;
        newCfg.critFailMin = critFailVal !== '' ? parseInt(critFailVal, 10) : defaults.critFail;

        const hardDivVal = $('#cfg-hard-div').val().trim();
        const extremeDivVal = $('#cfg-extreme-div').val().trim();
        newCfg.difficultSuccessDiv = hardDivVal !== '' ? parseInt(hardDivVal, 10) : defaults.hardDiv;
        newCfg.hardSuccessDiv = extremeDivVal !== '' ? parseInt(extremeDivVal, 10) : defaults.extremeDiv;
      }

      saveDiceConfig(newCfg);
      closePanel();
    });

    $panel.find('#cfg-reset-dice').click(function () {
      // 重置后清空输入框，让 placeholder 显示默认值
      $panel.find('#cfg-crit-success').val('');
      $panel.find('#cfg-crit-fail').val('');
      if (!isDND) {
        $panel.find('#cfg-hard-div').val('');
        $panel.find('#cfg-extreme-div').val('');
      }
    });
  };
  // [新增] 显示掷骰面板
  const showDicePanel = (options = {}) => {
    const { $ } = getCore();
    $('.acu-dice-panel, .acu-dice-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();
    // 读取上次保存的骰子类型，必须是有效公式，否则默认1d100
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    // 验证是否是有效骰子公式，无效则回退到1d100
    if (!/^\d+d\d+$/i.test(savedDiceType)) {
      savedDiceType = '1d100';
    }
    // [新增] 构建角色和属性下拉列表
    const rawDataForList = cachedRawData || getTableData();
    let diceCharacterList = ['<user>'];
    let diceAttrList = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;

        if (sheet.name === '重要人物表') {
          for (let i = 1; i < sheet.content.length; i++) {
            const row = sheet.content[i];
            if (row && row[1]) diceCharacterList.push(row[1]);
          }
        }

        if (sheet.name === '主角信息' && sheet.content[1]) {
          const row = sheet.content[1];
          const headers = sheet.content[0] || [];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!diceAttrList.includes(attr.name)) diceAttrList.push(attr.name);
              });
            }
          });
        }
      }
    }
    const {
      targetValue = null, // [修复] 默认为 null，支持留空自动计算
      targetName = '目标',
      diceType = savedDiceType, // 使用上次保存的骰子类型
      successCriteria = 'lte', // [新增] 默认成功标准：小于等于（COC规则）
      onResult = null,
      initiatorName = '', // [修复] 接收发起者名字
    } = options;

    const t = getThemeColors();

    const overlay = $(
      `<div class="acu-dice-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:2147483647;"></div>`,
    );

    // [精简] 成功标准选项：只保留 COC 和 DND
    const successCriteriaOptions = [
      { id: 'lte', name: '≤ (COC)' },
      { id: 'gte', name: '≥ (DND)' },
    ];

    // [新增] 根据骰子类型智能选择默认成功标准
    let defaultCriteria = successCriteria;
    if (diceType === '1d100') defaultCriteria = 'lte';
    else if (diceType === '1d20') defaultCriteria = 'gte';

    const panel = $(`
            <div class="acu-dice-panel acu-theme-${config.theme}" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 340px;
                max-width: 90vw;
                background: ${t.bgPanel};
                border: 1px solid ${t.border};
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                z-index: 2147483648;
                overflow: hidden;
                font-family: 'Microsoft YaHei', sans-serif;
            ">
                <div style="padding: 12px 15px; background: ${t.tableHead}; border-bottom: 1px solid ${t.border}; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 15px; font-weight: bold; color: ${t.accent}; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-dice-d20"></i> 普通检定
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button id="dice-switch-contest-top" style="background: none; border: none; color: ${t.textSub}; cursor: pointer; font-size: 14px; padding: 4px; transition: all 0.2s;" title="切换到对抗检定"><i class="fa-solid fa-people-arrows"></i></button>
                        <button class="acu-dice-config-btn" style="background: none; border: none; color: ${t.textSub}; cursor: pointer; font-size: 14px; padding: 4px; transition: all 0.2s;" title="掷骰规则设置">
                            <i class="fa-solid fa-cog"></i>
                        </button>
                        <button class="acu-dice-close" style="background: none; border: none; color: ${t.textSub}; cursor: pointer; font-size: 16px; padding: 4px;">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <div style="padding: 15px; max-height: 70vh; overflow-y: auto;">
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; align-items: center;" class="acu-dice-presets">
                        <button class="acu-dice-preset ${diceType === '1d20' ? 'active' : ''}" data-dice="1d20" data-criteria="gte" style="padding: 4px 10px; background: ${diceType === '1d20' ? t.accent : t.btnBg}; border: 1px solid ${t.border}; border-radius: 4px; color: ${diceType === '1d20' ? '#fff' : t.textMain}; font-size: 11px; cursor: pointer;">1d20</button>
                        <button class="acu-dice-preset ${diceType === '1d100' ? 'active' : ''}" data-dice="1d100" data-criteria="lte" style="padding: 4px 10px; background: ${diceType === '1d100' ? t.accent : t.btnBg}; border: 1px solid ${t.border}; border-radius: 4px; color: ${diceType === '1d100' ? '#fff' : t.textMain}; font-size: 11px; cursor: pointer;">1d100</button>
                        <button class="acu-dice-preset acu-dice-custom-btn" data-dice="custom" style="padding: 4px 10px; background: ${!['1d20', '1d100'].includes(diceType) ? t.accent : t.btnBg}; border: 1px solid ${t.border}; border-radius: 4px; color: ${!['1d20', '1d100'].includes(diceType) ? '#fff' : t.textMain}; font-size: 11px; cursor: pointer;">自定义</button>
                        <input type="text" id="dice-custom-input" placeholder="如2d6" value="${!['1d20', '1d100'].includes(diceType) ? diceType : ''}" style="width:60px;">
                    </div>

                    <!-- 快捷选择角色 -->
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 11px; color: ${t.accent}; font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-user"></i> 快捷选择</div>
                        <div id="dice-char-buttons" style="display: flex; flex-wrap: wrap; gap: 4px; max-height: 60px; overflow-y: auto;"></div>
                    </div>

                    <!-- 第1行：名字 + 属性名 -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;">名字</div>
                            <input type="text" id="dice-initiator-name" value="${escapeHtml(initiatorName)}" placeholder="<user>">
                        </div>
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px; display: flex; align-items: center; gap: 6px;">
                                属性名
                                <button type="button" class="acu-random-skill-btn" id="dice-random-skill" title="随机技能" style="width: 20px; height: 20px; padding: 0; background: transparent; border: 1px dashed ${t.accent}; border-radius: 4px; color: ${t.accent}; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                    <i class="fa-solid fa-dice"></i>
                                </button>
                            </div>
                            <input type="text" id="dice-attr-name" value="${escapeHtml(targetName || '')}" placeholder="自由检定">
                        </div>
                    </div>

                    <!-- 第2行：属性值 + 目标值 -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;">属性值</div>
                            <input type="number" id="dice-attr-value" value="" placeholder="留空=50%最大值">
                        </div>
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;" id="dice-target-label">目标值</div>
                            <input type="text" id="dice-target" value="${targetValue !== null ? targetValue : ''}" placeholder="留空=属性值" class="acu-dice-input">
                        </div>
                    </div>

                    <!-- 第3行：成功标准 + 难度等级 + 修正值 -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px;" id="dice-row-3">
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;">成功标准</div>
                            <select id="dice-success-criteria" class="acu-dice-select">
                                ${successCriteriaOptions
                                  .map(
                                    opt =>
                                      `<option value="${opt.id}" ${opt.id === defaultCriteria ? 'selected' : ''}>${opt.name}</option>`,
                                  )
                                  .join('')}
                            </select>
                        </div>
                        <div id="dice-difficulty-wrapper">
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;">难度等级</div>
                            <select id="dice-difficulty" class="acu-dice-select">
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="extreme">极难</option>
                                <option value="critical">大成功</option>
                            </select>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 2px;">修正值</div>
                            <input type="number" id="dice-modifier" value="0" style="text-align: center;">
                        </div>
                    </div>

                    <!-- 快捷选择属性 -->
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 10px; color: ${t.textSub}; margin-bottom: 4px;"><i class="fa-solid fa-sliders"></i> 快捷选择属性</div>
                        <div id="dice-attr-buttons" style="display: flex; flex-wrap: wrap; gap: 4px; max-height: 80px; overflow-y: auto;"></div>
                    </div>
                    <!-- 隐藏的骰子公式 -->
                    <input type="hidden" id="dice-formula" value="${diceType}">

                    <button id="dice-roll-btn" style="width: 100%; padding: 12px; background: ${t.accent}; border: none; border-radius: 8px; color: #fff; font-size: 15px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fa-solid fa-dice"></i> 掷骰！
                    </button>
                    <div id="dice-result-area"></div>
                </div>
            </div>
        `);

    $('body').append(overlay).append(panel);

    // [新增] 构建角色快捷按钮
    const buildCharButtons = () => {
      const $container = panel.find('#dice-char-buttons');
      let html = '';
      diceCharacterList.forEach(name => {
        const displayName = name === '<user>' ? getDisplayPlayerName() : replaceUserPlaceholders(name);
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html += `<button class="acu-dice-char-btn" data-char="${escapeHtml(name)}" style="padding:3px 8px;background:${t.btnBg};border:1px solid ${t.border};border-radius:4px;color:${t.textMain};font-size:11px;cursor:pointer;white-space:nowrap;" title="${escapeHtml(displayName)}">${escapeHtml(shortName)}</button>`;
      });
      $container.html(html || `<div style="font-size:11px;color:${t.textSub};">无角色数据</div>`);
      // 绑定点击事件
      $container.find('.acu-dice-char-btn').click(function () {
        const charName = $(this).data('char');
        panel.find('#dice-initiator-name').val(charName).trigger('change');
      });
    };

    // [新增] 构建属性快捷按钮
    const buildAttrButtons = charName => {
      const $container = panel.find('#dice-attr-buttons');
      const attrs = getFullAttributesForCharacter(charName);

      let html = '';

      // 现有属性按钮
      if (attrs.length > 0) {
        attrs.forEach(attr => {
          html += `<button class="acu-dice-attr-btn" data-name="${escapeHtml(attr.name)}" data-value="${attr.value}" style="padding:3px 8px;background:${t.inputBg};border:1px solid ${t.border};border-radius:4px;color:${t.inputText};font-size:11px;cursor:pointer;">${escapeHtml(attr.name)}:${attr.value}</button>`;
        });
      }

      // 生成属性按钮（始终显示）
      html += `<button class="acu-dice-gen-attr-btn" style="padding:3px 8px;background:transparent;border:1px dashed ${t.accent};border-radius:4px;color:${t.accent};font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;" title="为当前角色生成属性"><i class="fa-solid fa-dice"></i></button>`;

      // 清空属性按钮
      html += `<button class="acu-dice-clear-attr-btn" style="padding:3px 8px;background:transparent;border:1px dashed #e74c3c;border-radius:4px;color:#e74c3c;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;margin-left:4px;" title="清空当前规则的属性（保留自定义属性）"><i class="fa-solid fa-trash-alt"></i></button>`;

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-dice-attr-btn').click(function () {
        const attrName = $(this).data('name');
        const attrValue = $(this).data('value');
        panel.find('#dice-attr-name').val(attrName);
        panel.find('#dice-attr-value').val(attrValue);

        // 根据成功标准设置目标值
        const criteria = panel.find('#dice-success-criteria').val() || 'lte';
        const isDND = criteria === 'gte';
        const numValue = parseInt(attrValue, 10) || 0;

        if (isDND) {
          // DND模式：目标值 = 20 - 属性值
          const targetValue = Math.max(1, 20 - numValue);
          panel.find('#dice-target').val(targetValue);
        } else {
          // COC模式：目标值 = 属性值
          panel.find('#dice-target').val(attrValue);
        }

        // 触发change事件以更新相关UI
        panel.find('#dice-attr-value').trigger('change');
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-dice-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[ACU] 属性生成中，跳过自动刷新');
        };

        try {
          const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

          console.log('[ACU] 生成属性 for:', charName);

          // 生成属性（使用激活的预设）
          const generated = generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // 合并基础属性和特别属性
          const allAttrs = { ...baseAttrs, ...specialAttrs };

          // 写入所有属性到表格
          const result = await writeAttributesToCharacter(charName, allAttrs);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[ACU] 生成属性失败:', err);
          if (window.toastr) window.toastr.error('生成属性失败');
        } finally {
          // [修复] 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-dice-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

        if (!confirm(`确定要清空「${charName}」的规则预设属性吗？\n\n（用户自定义的属性会保留）`)) {
          return;
        }

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[ACU] 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[ACU] 清空属性 for:', charName);

          const result = await clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[ACU] 清空属性失败:', err);
          if (window.toastr) window.toastr.error('清空属性失败');
        } finally {
          // 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色按钮
    buildCharButtons();
    // 初始化属性按钮（默认<user>）
    buildAttrButtons('<user>');
    // [新增] 随机技能按钮点击事件
    panel.find('#dice-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#dice-attr-name').val(randomSkill).trigger('change');
    });

    // 初始化自定义下拉菜单
    initCustomDropdown(panel.find('#dice-initiator-name'), diceCharacterList, t);
    initCustomDropdown(panel.find('#dice-attr-name'), diceAttrList, t);
    // [新增] 添加清除按钮
    addClearButton(panel, '#dice-initiator-name, #dice-attr-name, #dice-attr-value, #dice-target', t);

    // [修复] 角色变化时更新属性列表和快捷按钮
    panel.find('#dice-initiator-name').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#dice-attr-name'), newAttrList.length > 0 ? newAttrList : diceAttrList, t);

      // [新增] 更新属性快捷按钮
      buildAttrButtons(charName);
    });

    // [新增] 属性名变化时自动填入属性值
    panel.find('#dice-attr-name').on('change.acuval', function () {
      const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrValue = getAttributeValue(charName, attrName);
      if (attrValue !== null) {
        panel.find('#dice-attr-value').val(attrValue);
        panel.find('#dice-target').val(attrValue);
      }
    });

    // [修复] 根据骰子类型自动转换目标值
    const convertTargetForDice = (currentTarget, fromDice, toDice) => {
      if (!currentTarget || currentTarget === '') return '';
      const val = parseInt(currentTarget, 10);
      if (isNaN(val)) return currentTarget;

      // 获取骰子最大值
      const getMaxRoll = dice => {
        const match = dice.match(/(\d+)d(\d+)/i);
        if (!match) return 100;
        return parseInt(match[1], 10) * parseInt(match[2], 10);
      };

      const fromMax = getMaxRoll(fromDice);
      const toMax = getMaxRoll(toDice);

      // 按比例转换
      const ratio = val / fromMax;
      const newVal = Math.round(ratio * toMax);
      return Math.max(1, Math.min(newVal, toMax));
    };

    // [重写] 成功标准切换时更新 UI（COC/DND 模式切换）
    const updateRuleMode = () => {
      const criteria = panel.find('#dice-success-criteria').val();
      const isDND = criteria === 'gte';
      const $targetInput = panel.find('#dice-target');
      const $difficultyWrapper = panel.find('#dice-difficulty-wrapper');
      const $row3 = panel.find('#dice-row-3');

      if (isDND) {
        // DND 模式
        $targetInput.attr('placeholder', '留空=20-属性值');
        panel.find('#dice-target-label').text('DC');
        $difficultyWrapper.hide();
        $row3.css('grid-template-columns', '1fr 1fr');
      } else {
        // COC 模式
        $targetInput.attr('placeholder', '留空=属性值');
        panel.find('#dice-target-label').text('目标值');
        $difficultyWrapper.show();
        $row3.css('grid-template-columns', '1fr 1fr 1fr');
      }
    };

    panel.find('#dice-success-criteria').on('change', updateRuleMode);

    // 初始化时执行一次
    updateRuleMode();

    // 记录当前骰子类型用于转换
    let currentDiceType = diceType;

    // 骰子预设点击 - [修复] 同时切换成功标准和转换目标值
    panel.find('.acu-dice-preset').click(function () {
      const newDice = $(this).data('dice');
      // 自定义按钮有单独的处理逻辑，这里跳过
      if (newDice === 'custom') return;

      panel.find('.acu-dice-preset').css({ background: t.btnBg, color: t.textMain });
      $(this).css({ background: t.accent, color: '#fff' });

      // 保存本次选择的骰子类型
      saveDiceConfig({ lastDiceType: newDice });
      const suggestedCriteria = $(this).data('criteria') || 'lte';

      // [修复] 自动转换目标值
      const $targetInput = panel.find('#dice-target');
      const currentTargetVal = $targetInput.val().trim();
      if (currentTargetVal !== '') {
        const convertedVal = convertTargetForDice(currentTargetVal, currentDiceType, newDice);
        $targetInput.val(convertedVal);
      }

      // 更新自动提示中的范围
      const getMaxRoll = dice => {
        const match = dice.match(/(\d+)d(\d+)/i);
        if (!match) return 100;
        return parseInt(match[1], 10) * parseInt(match[2], 10);
      };
      const newMax = getMaxRoll(newDice);
      panel.find('#dice-target-auto').text(`(自动: 1~${newMax})`);

      currentDiceType = newDice;
      panel.find('#dice-formula').val(newDice);

      // [新增] 自动切换成功标准并更新提示
      panel.find('#dice-success-criteria').val(suggestedCriteria).trigger('change');
    });
    // 自定义骰子按钮点击事件
    panel.find('.acu-dice-custom-btn').click(function () {
      // 立即高亮自定义按钮，取消其他按钮高亮
      panel.find('.acu-dice-preset').css({ background: t.btnBg, color: t.textMain });
      $(this).css({ background: t.accent, color: '#fff' });

      const customDice = panel.find('#dice-custom-input').val().trim();
      // 如果输入框为空，聚焦并等待用户输入
      if (!customDice) {
        panel.find('#dice-custom-input').focus();
        return;
      }
      if (!/^\d+d\d+$/i.test(customDice)) {
        if (window.toastr) window.toastr.warning('格式错误，请输入如 4d6');
        return;
      }

      // 自动转换目标值
      const $targetInput = panel.find('#dice-target');
      const currentTargetVal = $targetInput.val().trim();
      if (currentTargetVal !== '') {
        const convertedVal = convertTargetForDice(currentTargetVal, currentDiceType, customDice);
        $targetInput.val(convertedVal);
      }

      panel.find('#dice-formula').val(customDice);
      currentDiceType = customDice;

      // 保存自定义骰子类型
      saveDiceConfig({ lastDiceType: customDice });

      panel.find('#dice-success-criteria').val('gte').trigger('change');
    });

    // 自定义骰子输入框回车确认
    panel.find('#dice-custom-input').on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        panel.find('.acu-dice-custom-btn').click();
      }
    });
    // 掷骰逻辑
    const rollDice = formula => {
      const match = formula.match(/(\d+)d(\d+)([+-]\d+)?/i);
      if (!match) return { total: 0, rolls: [], formula };

      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      const modifier = match[3] ? parseInt(match[3], 10) : 0;

      const rolls = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      const total = rolls.reduce((a, b) => a + b, 0) + modifier;

      return { total, rolls, sides, count, modifier, formula };
    };

    // [新增] 根据成功标准判断是否成功
    const checkSuccess = (value, target, criteria) => {
      switch (criteria) {
        case 'lt':
          return value < target; // 小于
        case 'lte':
          return value <= target; // 小于等于 (COC)
        case 'eq':
          return value === target; // 等于
        case 'gte':
          return value >= target; // 大于等于 (DND)
        case 'gt':
          return value > target; // 大于
        default:
          return value <= target; // 默认COC规则
      }
    };

    // [修改] 判断大成功/大失败的边界值 - 读取用户配置
    const getCriticalBounds = (sides, criteria) => {
      const isLowerBetter = ['lte', 'lt'].includes(criteria);
      const diceCfg = getDiceConfig();

      if (sides === 100) {
        return isLowerBetter
          ? { critSuccess: diceCfg.critSuccessMax, critFailure: diceCfg.critFailMin }
          : { critSuccess: diceCfg.critFailMin, critFailure: diceCfg.critSuccessMax };
      } else if (sides === 20) {
        return isLowerBetter ? { critSuccess: 1, critFailure: 20 } : { critSuccess: 20, critFailure: 1 };
      } else {
        const maxVal = sides;
        const minVal = 1;
        return isLowerBetter
          ? { critSuccess: minVal, critFailure: maxVal }
          : { critSuccess: maxVal, critFailure: minVal };
      }
    };

    // 掷骰按钮点击
    panel.find('#dice-roll-btn').click(function () {
      const formula = panel.find('#dice-formula').val().trim() || '1d100';
      const mod = parseInt(panel.find('#dice-modifier').val(), 10) || 0;
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';
      const criteria = panel.find('#dice-success-criteria').val() || 'lte';
      const difficulty = panel.find('#dice-difficulty').val() || 'normal';

      // 判断规则类型
      const isDND = criteria === 'gte';

      // 获取骰子配置（根据规则类型读取不同配置）
      const diceCfg = getDiceConfig();
      const hardDiv = diceCfg.difficultSuccessDiv || 2;
      const extremeDiv = diceCfg.hardSuccessDiv || 5;
      // COC: 大成功 ≤ critSuccessMax, 大失败 ≥ critFailMin
      // DND: 大成功 ≥ dndCritSuccess, 大失败 ≤ dndCritFail
      const critSuccessMax = isDND ? diceCfg.dndCritFail || 1 : diceCfg.critSuccessMax || 5;
      const critFailMin = isDND ? diceCfg.dndCritSuccess || 20 : diceCfg.critFailMin || 96;

      // 目标值计算（COC 和 DND 不同）
      let targetInputVal = panel.find('#dice-target').val().trim();
      let attrInputVal = panel.find('#dice-attr-value').val().trim();
      let attrValue = attrInputVal !== '' ? parseInt(attrInputVal, 10) : 0;
      let target;
      let isAutoTarget = false;

      // 辅助函数：根据骰子公式计算最大值的一半
      const getDefaultTarget = formulaStr => {
        const match = formulaStr.match(/(\d+)d(\d+)/i);
        if (match) {
          const maxRoll = parseInt(match[1], 10) * parseInt(match[2], 10);
          return Math.round(maxRoll / 2);
        }
        return 50;
      };

      if (targetInputVal !== '') {
        // 用户手动输入了目标值/DC
        target = parseInt(targetInputVal, 10) || getDefaultTarget(formula);
      } else if (isDND) {
        // DND 模式：留空时 DC = 20 - 属性值（若属性值为空则DC=10）
        if (attrValue > 0) {
          target = Math.max(1, 20 - attrValue);
          isAutoTarget = true;
        } else {
          target = 10; // 默认中等难度
          isAutoTarget = true;
        }
      } else {
        // COC 模式：留空时目标值 = 属性值，若属性值也空则取骰子最大值的一半
        if (attrValue > 0) {
          target = attrValue;
          isAutoTarget = true;
        } else {
          target = getDefaultTarget(formula);
          isAutoTarget = true;
        }
      }

      const result = rollDice(formula);
      const finalValue = result.total + mod;

      // 根据规则和难度等级计算
      let requiredTarget = target;
      let difficultyLabel = '';
      let difficultyDiv = 1;

      // DND 模式忽略难度等级
      if (!isDND) {
        switch (difficulty) {
          case 'hard':
            requiredTarget = Math.floor(target / hardDiv);
            difficultyLabel = '困难';
            difficultyDiv = hardDiv;
            break;
          case 'extreme':
            requiredTarget = Math.floor(target / extremeDiv);
            difficultyLabel = '极难';
            difficultyDiv = extremeDiv;
            break;
          case 'critical':
            requiredTarget = critSuccessMax;
            difficultyLabel = '大成功';
            break;
          default:
            difficultyLabel = '';
            break;
        }
      }

      // 判定结果
      let isCritSuccess = false;
      let isCritFailure = false;
      let isSuccess = false;
      let outcomeText = '';
      let outcomeClass = '';

      // 大成功/大失败判定（最高优先级）
      if (isDND) {
        // DND: 大成功 ≥ 20，大失败 ≤ 1
        isCritSuccess = finalValue >= critFailMin; // 复用 critFailMin 作为 DND 大成功阈值
        isCritFailure = finalValue <= critSuccessMax; // 复用 critSuccessMax 作为 DND 大失败阈值
      } else {
        // COC: 大成功 ≤ 5，大失败 ≥ 96
        isCritSuccess = finalValue <= critSuccessMax;
        isCritFailure = finalValue >= critFailMin;
      }

      // 根据规则判断成功/失败
      if (isDND) {
        isSuccess = finalValue >= requiredTarget;
      } else {
        isSuccess = finalValue <= requiredTarget;
      }

      // 确定最终结果文本
      if (isCritSuccess) {
        outcomeText = '大成功！';
        outcomeClass = 'success';
        isSuccess = true;
      } else if (isCritFailure) {
        outcomeText = '大失败！';
        outcomeClass = 'failure';
        isSuccess = false;
      } else if (isSuccess) {
        if (isDND) {
          outcomeText = '成功';
        } else if (difficulty === 'hard') {
          outcomeText = '困难成功';
        } else if (difficulty === 'extreme') {
          outcomeText = '极难成功';
        } else {
          // 普通难度下，检查是否达成更高成就
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            outcomeText = '极难成功';
          } else if (finalValue <= hardTarget) {
            outcomeText = '困难成功';
          } else {
            outcomeText = '成功';
          }
        }
        outcomeClass = 'success';
      } else {
        outcomeText = '失败';
        outcomeClass = 'failure';
      }

      const successColor = t.successText;
      const failureColor = '#e74c3c';
      const criteriaSymbol = isDND ? '≥' : '≤';

      // 显示结果区域
      panel.find('#dice-result-area').html(`
                <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:${t.tableHead}; border-radius:6px; margin-top:8px; gap:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:22px; font-weight:bold; color:${t.accent};">${finalValue}</span>
                        <span style="font-size:11px; color:${t.textSub};">${criteriaSymbol}${requiredTarget}${difficultyLabel ? '(' + difficultyLabel + ')' : ''}</span>
                    </div>
                    <span style="padding:4px 12px; border-radius:12px; font-size:12px; font-weight:bold; white-space:nowrap; background:${outcomeClass === 'success' ? t.successBg : 'rgba(231, 76, 60, 0.15)'}; color:${outcomeClass === 'success' ? successColor : failureColor};">${outcomeText}</span>
                </div>
            `);

      // 生成 Prompt 文本
      const initiatorName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      let judgeExpr = '';

      if (isCritSuccess) {
        if (isDND) {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        } else {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        // DND 模式
        if (isSuccess) {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}≥${requiredTarget}`;
        } else {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}<${requiredTarget}`;
        }
      } else if (difficulty === 'critical') {
        // COC 难度设为大成功但没达成
        judgeExpr = `需≤${critSuccessMax}，${finalValue}>${critSuccessMax}`;
      } else if (difficulty !== 'normal') {
        // COC 困难或极难
        if (isSuccess) {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}≤${requiredTarget}`;
        } else {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}>${requiredTarget}`;
        }
      } else {
        // COC 普通难度
        if (isSuccess) {
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${extremeDiv}`;
          } else if (finalValue <= hardTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${hardDiv}`;
          } else {
            judgeExpr = `需≤${target}，${finalValue}≤${target}`;
          }
        } else {
          judgeExpr = `需≤${target}，${finalValue}>${target}`;
        }
      }

      const diceResultText = `${initiatorName}发起了【${attrName}】检定，掷出${finalValue}，${judgeExpr}，【${outcomeText}】`;
      smartInsertToTextarea(diceResultText, 'dice');
      if (onResult) {
        onResult({
          success: isSuccess,
          total: finalValue,
          target,
          outcomeText,
          attrName,
          criteria,
          isAutoTarget,
          formula: formulaText,
        });
      }
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim();
      const attrValueInput = panel.find('#dice-attr-value').val().trim();
      const currentName = panel.find('#dice-attr-name').val() || '';
      const currentDice = panel.find('#dice-formula').val() || '1d100';
      const initiatorNameVal = panel.find('#dice-initiator-name').val().trim();
      closePanel();
      showContestPanel({
        // 只有用户实际输入了非默认值才传递，否则留空让 placeholder 生效
        initiatorName: initiatorNameVal && initiatorNameVal !== '<user>' ? initiatorNameVal : '',
        initiatorValue: attrValueInput !== '' ? parseInt(attrValueInput, 10) : undefined,
        diceType: currentDice,
      });
    });
    // 关闭
    const closePanel = () => {
      overlay.remove();
      panel.remove();
    };
    overlay.click(closePanel);
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用统一设置面板
    panel.find('.acu-dice-config-btn').click(function (e) {
      e.stopPropagation();
      const currentCriteria = panel.find('#dice-success-criteria').val();
      const isDND = currentCriteria === 'gte';
      showDiceSettingsPanel(isDND);
    });
  };

  // [新增] 显示对抗检定面板
  const showContestPanel = (options = {}) => {
    const { $ } = getCore();
    $('.acu-dice-panel, .acu-dice-overlay, .acu-contest-panel, .acu-contest-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();

    // 读取保存的骰子类型，必须是有效公式
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    if (!/^\d+d\d+$/i.test(savedDiceType)) {
      savedDiceType = '1d100';
    }

    // 修复：正确接收所有传入参数
    const opponentName = options.opponentName || '';
    const diceType = options.diceType || savedDiceType;
    const passedInitiatorName = options.initiatorName || '';
    const passedInitiatorValue = options.initiatorValue;
    const passedOpponentValue = options.opponentValue;

    const rawData = cachedRawData || getTableData();
    let playerAttrs = [];
    let opponentAttrs = [];

    // [新增] 构建角色下拉列表（<user> + 重要人物表）
    let characterList = ['<user>'];
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet && sheet.name === '重要人物表' && sheet.content) {
          for (let i = 1; i < sheet.content.length; i++) {
            const row = sheet.content[i];
            if (row && row[1]) characterList.push(row[1]);
          }
          break;
        }
      }
    }
    // [新增] 构建属性下拉列表
    let contestAttrList = [];
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet && sheet.name === '主角信息' && sheet.content && sheet.content[1]) {
          const headers = sheet.content[0] || [];
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
              });
            }
          });
          break;
        }
      }
    }
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (!sheet || !sheet.name || !sheet.content) continue;

        if (sheet.name === '主角信息' && sheet.content[1]) {
          const attrStr = sheet.content[1][7] || '';
          playerAttrs = parseAttributeString(attrStr);
        }

        if (sheet.name === '重要人物表' && opponentName) {
          for (let i = 1; i < sheet.content.length; i++) {
            const row = sheet.content[i];
            if (row && row[1] === opponentName) {
              const attrStr = row[9] || '';
              opponentAttrs = parseAttributeString(attrStr);
              break;
            }
          }
        }
      }
    }

    const t = getThemeColors();

    const buildAttrButtons = (attrs, targetType) => {
      if (attrs.length === 0)
        return '<div style="font-size:11px;color:' + t.textSub + ';text-align:center;padding:4px;">无属性数据</div>';
      let html = '';
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        html +=
          '<button class="acu-contest-attr-btn" data-val="' +
          attr.value +
          '" data-aname="' +
          escapeHtml(attr.name) +
          '" data-type="' +
          targetType +
          '" style="padding:3px 8px;background:' +
          t.inputBg +
          ';border:1px solid ' +
          t.border +
          ';border-radius:4px;color:' +
          t.inputText +
          ';font-size:11px;cursor:pointer;margin:2px;">' +
          escapeHtml(attr.name) +
          ': ' +
          attr.value +
          '</button>';
      }
      return html;
    };

    const overlay = $(
      '<div class="acu-contest-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:2147483647;"></div>',
    );
    const panelHtml =
      '<div class="acu-contest-panel" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:360px;max-width:92vw;background:' +
      t.bgPanel +
      ';border:1px solid ' +
      t.border +
      ';border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.4);z-index:2147483648;font-family:Microsoft YaHei,sans-serif;overflow:hidden;">' +
      '<div style="padding:12px 15px;background:' +
      t.tableHead +
      ';border-bottom:1px solid ' +
      t.border +
      ';display:flex;justify-content:space-between;align-items:center;">' +
      '<div style="font-size:15px;font-weight:bold;color:' +
      t.accent +
      ';display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-people-arrows"></i> 对抗检定</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button id="contest-switch-normal" style="background:none;border:none;color:' +
      t.textSub +
      ';cursor:pointer;font-size:14px;padding:4px;transition:all 0.2s;" title="切换到普通检定"><i class="fa-solid fa-dice-d20"></i></button>' +
      '<button class="acu-contest-config-btn" style="background:none;border:none;color:' +
      t.textSub +
      ';cursor:pointer;font-size:14px;padding:4px;transition:all 0.2s;" title="掷骰规则设置"><i class="fa-solid fa-cog"></i></button>' +
      '<button class="acu-contest-close" style="background:none;border:none;color:' +
      t.textSub +
      ';cursor:pointer;font-size:16px;padding:4px;"><i class="fa-solid fa-times"></i></button>' +
      '</div>' +
      '</div>' +
      '<div style="padding:15px;max-height:70vh;overflow-y:auto;">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">' +
      '<button class="acu-contest-preset' +
      (diceType === '1d20' ? ' active' : '') +
      '" data-dice="1d20" style="padding:4px 10px;background:' +
      (diceType === '1d20' ? t.accent : t.btnBg) +
      ';border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      (diceType === '1d20' ? '#fff' : t.textMain) +
      ';font-size:11px;cursor:pointer;">1d20</button>' +
      '<button class="acu-contest-preset' +
      (diceType === '1d100' ? ' active' : '') +
      '" data-dice="1d100" style="padding:4px 10px;background:' +
      (diceType === '1d100' ? t.accent : t.btnBg) +
      ';border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      (diceType === '1d100' ? '#fff' : t.textMain) +
      ';font-size:11px;cursor:pointer;">1d100</button>' +
      '<button class="acu-contest-preset acu-contest-custom-btn" data-dice="custom" style="padding:4px 10px;background:' +
      (!['1d20', '1d100'].includes(diceType) ? t.accent : t.btnBg) +
      ';border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      (!['1d20', '1d100'].includes(diceType) ? '#fff' : t.textMain) +
      ';font-size:11px;cursor:pointer;">自定义</button>' +
      '<input type="text" id="contest-custom-dice" placeholder="如2d6" value="' +
      (!['1d20', '1d100'].includes(diceType) ? diceType : '') +
      '" style="width:60px;padding:4px 6px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:11px;text-align:center;box-sizing:border-box;" />' +
      '</div>' +
      '<input type="hidden" id="contest-dice-type" value="' +
      diceType +
      '">' +
      '<div style="font-size:11px;color:' +
      t.accent +
      ';font-weight:bold;margin-bottom:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span><i class="fa-solid fa-user"></i> 甲方</span><div id="contest-init-char-buttons" style="display:flex;flex-wrap:wrap;gap:3px;"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">名字</div><input type="text" id="contest-init-display" value="" placeholder="<user>" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;display:flex;align-items:center;gap:6px;">属性名<button type="button" class="acu-random-skill-btn" id="contest-init-random-skill" title="随机技能" style="width:18px;height:18px;padding:0;background:transparent;border:1px dashed ' +
      t.accent +
      ';border-radius:4px;color:' +
      t.accent +
      ';font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-dice"></i></button></div><input type="text" id="contest-init-name" value="" placeholder="自由检定" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">属性值</div><input type="number" id="contest-init-value" value="' +
      (passedInitiatorValue !== undefined ? passedInitiatorValue : '') +
      '" placeholder="留空=50%最大值" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">目标值</div><input type="number" id="contest-init-target" value="" placeholder="自动" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '</div>' +
      '<div id="init-attr-buttons" style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:8px;max-height:50px;overflow-y:auto;">' +
      buildAttrButtons(playerAttrs, 'init') +
      '</div>' +
      '<div style="font-size:11px;color:' +
      t.accent +
      ';font-weight:bold;margin-bottom:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span><i class="fa-solid fa-user-slash"></i> 乙方</span><div id="contest-opp-char-buttons" style="display:flex;flex-wrap:wrap;gap:3px;"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">名字</div><input type="text" id="contest-opponent-display" value="' +
      escapeHtml(opponentName) +
      '" placeholder="对手" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;display:flex;align-items:center;gap:6px;">属性名<button type="button" class="acu-random-skill-btn" id="contest-opp-random-skill" title="随机技能" style="width:18px;height:18px;padding:0;background:transparent;border:1px dashed ' +
      t.accent +
      ';border-radius:4px;color:' +
      t.accent +
      ';font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-dice"></i></button></div><input type="text" id="contest-opp-name" value="" placeholder="同甲方" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">属性值</div><input type="number" id="contest-opp-value" value="' +
      (passedOpponentValue !== undefined ? passedOpponentValue : '') +
      '" placeholder="留空=50%最大值" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '<div><div style="font-size:10px;color:' +
      t.textSub +
      ';margin-bottom:2px;">目标值</div><input type="number" id="contest-opp-target" value="" placeholder="自动" style="width:100%;padding:5px;background:' +
      t.inputBg +
      ' !important;border:1px solid ' +
      t.border +
      ';border-radius:4px;color:' +
      t.inputText +
      ' !important;font-size:12px;text-align:center;box-sizing:border-box;"></div>' +
      '</div>' +
      '<div id="opp-attr-buttons" style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:10px;max-height:50px;overflow-y:auto;">' +
      buildAttrButtons(opponentAttrs, 'opp') +
      '</div>' +
      '<button id="contest-roll-btn" style="width:100%;padding:12px;background:' +
      t.accent +
      ';border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;"><i class="fa-solid fa-dice"></i> 开始对抗！</button>' +
      '<div id="contest-result-area"></div>' +
      '</div>' +
      '</div>';

    const panel = $(panelHtml);
    $('body').append(overlay).append(panel);
    // [新增] 构建角色快捷按钮 - 复用普通检定的样式规格
    const buildCharBtns = targetType => {
      const containerId = targetType === 'init' ? '#contest-init-char-buttons' : '#contest-opp-char-buttons';
      const $container = panel.find(containerId);
      let html = '';
      characterList.forEach(name => {
        const displayName = name === '<user>' ? getDisplayPlayerName() : replaceUserPlaceholders(name);
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html +=
          '<button class="acu-contest-char-btn" data-char="' +
          escapeHtml(name) +
          '" data-type="' +
          targetType +
          '" style="padding:3px 8px;background:' +
          t.btnBg +
          ';border:1px solid ' +
          t.border +
          ';border-radius:4px;color:' +
          t.textMain +
          ';font-size:11px;cursor:pointer;white-space:nowrap;" title="' +
          escapeHtml(displayName) +
          '">' +
          escapeHtml(shortName) +
          '</button>';
      });
      $container.html(html);
      $container.find('.acu-contest-char-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const charName = $(this).data('char');
        const type = $(this).data('type');
        if (type === 'init') {
          panel.find('#contest-init-display').val(charName).trigger('change');
        } else {
          panel.find('#contest-opponent-display').val(charName).trigger('change');
        }
      });
    };

    // [新增] 重建属性快捷按钮
    const rebuildAttrBtns = (attrs, targetType) => {
      const containerId = targetType === 'init' ? '#init-attr-buttons' : '#opp-attr-buttons';
      const $container = panel.find(containerId);

      let html = '';

      // 现有属性按钮
      if (attrs.length > 0) {
        attrs.forEach(attr => {
          html +=
            '<button class="acu-contest-attr-btn" data-val="' +
            attr.value +
            '" data-aname="' +
            escapeHtml(attr.name) +
            '" data-type="' +
            targetType +
            '" style="padding:2px 6px;background:' +
            t.inputBg +
            ';border:1px solid ' +
            t.border +
            ';border-radius:3px;color:' +
            t.inputText +
            ';font-size:10px;cursor:pointer;">' +
            escapeHtml(attr.name) +
            ':' +
            attr.value +
            '</button>';
        });
      }

      // 生成属性按钮
      html +=
        '<button class="acu-contest-gen-attr-btn" data-type="' +
        targetType +
        '" style="padding:2px 6px;background:transparent;border:1px dashed ' +
        t.accent +
        ';border-radius:3px;color:' +
        t.accent +
        ';font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:3px;" title="生成属性"><i class="fa-solid fa-dice" style="font-size:9px;"></i>生成</button>';

      // 清空属性按钮
      html +=
        '<button class="acu-contest-clear-attr-btn" data-type="' +
        targetType +
        '" style="padding:2px 6px;background:transparent;border:1px dashed #e74c3c;border-radius:3px;color:#e74c3c;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:3px;margin-left:4px;" title="清空规则属性"><i class="fa-solid fa-trash-alt" style="font-size:9px;"></i></button>';

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-contest-attr-btn').click(function () {
        const val = $(this).attr('data-val');
        const aname = $(this).attr('data-aname');
        const type = $(this).attr('data-type');
        if (type === 'init') {
          panel.find('#contest-init-value').val(val);
          panel.find('#contest-init-name').val(aname);
        } else {
          panel.find('#contest-opp-value').val(val);
          panel.find('#contest-opp-name').val(aname);
        }
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-contest-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const type = $btn.attr('data-type');

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[ACU] 对抗属性生成中，跳过自动刷新');
        };

        try {
          // 获取角色名
          let charName;
          if (type === 'init') {
            charName = panel.find('#contest-init-display').val().trim() || '<user>';
          } else {
            charName = panel.find('#contest-opponent-display').val().trim();
          }

          if (!charName) {
            if (window.toastr) window.toastr.warning('请先选择角色');
            return;
          }

          console.log('[ACU] 对抗面板生成属性 for:', charName, 'type:', type);

          // 生成属性（使用激活的预设）
          const generated = generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // 合并基础属性和特别属性
          const allAttrs = { ...baseAttrs, ...specialAttrs };

          // 写入所有属性到表格
          const result = await writeAttributesToCharacter(charName, allAttrs);

          if (result.success) {
            // 刷新该方属性按钮
            const refreshedAttrs = getFullAttributesForCharacter(charName);
            rebuildAttrBtns(refreshedAttrs, type);
          }
        } catch (err) {
          console.error('[ACU] 对抗面板生成属性失败:', err);
          if (window.toastr) window.toastr.error('生成属性失败');
        } finally {
          // [修复] 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-contest-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const type = $btn.attr('data-type');

        // 获取角色名
        let charName;
        if (type === 'init') {
          charName = panel.find('#contest-init-display').val().trim() || '<user>';
        } else {
          charName = panel.find('#contest-opponent-display').val().trim();
        }

        if (!charName) {
          if (window.toastr) window.toastr.warning('请先选择角色');
          return;
        }

        if (!confirm(`确定要清空「${charName}」的规则预设属性吗？\n\n（用户自定义的属性会保留）`)) {
          return;
        }

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[ACU] 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[ACU] 对抗面板清空属性 for:', charName, 'type:', type);

          const result = await clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新该方属性按钮
            const refreshedAttrs = getFullAttributesForCharacter(charName);
            rebuildAttrBtns(refreshedAttrs, type);
          }
        } catch (err) {
          console.error('[ACU] 对抗面板清空属性失败:', err);
          if (window.toastr) window.toastr.error('清空属性失败');
        } finally {
          // 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色快捷按钮
    buildCharBtns('init');
    buildCharBtns('opp');
    // [新增] 甲方随机技能按钮
    panel.find('#contest-init-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-init-name').val(randomSkill).trigger('change');
    });

    // [新增] 乙方随机技能按钮
    panel.find('#contest-opp-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-opp-name').val(randomSkill).trigger('change');
    });
    // 修复：如果传入了初始角色名，触发属性按钮刷新
    if (passedInitiatorName) {
      const initAttrs = getFullAttributesForCharacter(passedInitiatorName);
      rebuildAttrBtns(initAttrs, 'init');
    }
    if (opponentName) {
      const oppAttrs = getFullAttributesForCharacter(opponentName);
      rebuildAttrBtns(oppAttrs, 'opp');
    }

    // 初始化下拉菜单
    initCustomDropdown(panel.find('#contest-init-display'), characterList, t);
    initCustomDropdown(panel.find('#contest-opponent-display'), characterList, t);
    initCustomDropdown(panel.find('#contest-init-name'), contestAttrList, t);
    initCustomDropdown(panel.find('#contest-opp-name'), contestAttrList, t);
    addClearButton(
      panel,
      '#contest-init-display, #contest-init-name, #contest-init-value, #contest-init-target, #contest-opponent-display, #contest-opp-name, #contest-opp-value, #contest-opp-target',
      t,
    );

    // 甲方角色变化时更新属性
    panel.find('#contest-init-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#contest-init-name'), newAttrList.length > 0 ? newAttrList : contestAttrList, t);
      const fullAttrs = getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'init');
    });

    // 乙方角色变化时更新属性
    panel.find('#contest-opponent-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim();
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#contest-opp-name'), newAttrList.length > 0 ? newAttrList : contestAttrList, t);
      const fullAttrs = getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'opp');
    });

    // 甲方属性名变化时自动填入属性值
    panel.find('#contest-init-name').on('change.acuval', function () {
      const charName = panel.find('#contest-init-display').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrValue = getAttributeValue(charName, attrName);
      if (attrValue !== null) {
        panel.find('#contest-init-value').val(attrValue);
      }
    });

    // 乙方属性名变化时自动填入属性值
    panel.find('#contest-opp-name').on('change.acuval', function () {
      const charName = panel.find('#contest-opponent-display').val().trim();
      const attrName = $(this).val().trim();
      const attrValue = getAttributeValue(charName, attrName);
      if (attrValue !== null) {
        panel.find('#contest-opp-value').val(attrValue);
      }
    });

    // 骰子预设切换
    panel.find('.acu-contest-preset').click(function () {
      const newDice = $(this).data('dice');
      // 自定义按钮有单独处理，这里跳过
      if (newDice === 'custom') return;

      panel.find('.acu-contest-preset').css({ background: t.btnBg, color: t.textMain });
      $(this).css({ background: t.accent, color: '#fff' });
      panel.find('#contest-dice-type').val(newDice);

      // 保存骰子类型
      saveDiceConfig({ lastDiceType: newDice });
    });

    // 自定义骰子按钮点击事件
    panel.find('.acu-contest-custom-btn').click(function () {
      // 立即高亮自定义按钮，取消其他按钮高亮
      panel.find('.acu-contest-preset').css({ background: t.btnBg, color: t.textMain });
      $(this).css({ background: t.accent, color: '#fff' });

      var customDice = panel.find('#contest-custom-dice').val().trim();
      // 如果输入框为空，聚焦并等待用户输入
      if (!customDice) {
        panel.find('#contest-custom-dice').focus();
        return;
      }
      if (!/^\d+d\d+$/i.test(customDice)) {
        if (window.toastr) window.toastr.warning('格式错误，请输入如 4d6');
        return;
      }

      panel.find('#contest-dice-type').val(customDice);

      // 保存自定义骰子类型
      saveDiceConfig({ lastDiceType: customDice });
    });

    // 自定义骰子输入框回车确认
    panel.find('#contest-custom-dice').on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        panel.find('.acu-contest-custom-btn').click();
      }
    });
    // 掷骰函数
    const rollDice = function (formula) {
      const match = formula.match(/(\d+)d(\d+)([+-]\d+)?/i);
      if (!match) return { total: 0, rolls: [], sides: 100 };
      const count = parseInt(match[1], 10);
      const sides = parseInt(match[2], 10);
      const modifier = match[3] ? parseInt(match[3], 10) : 0;
      const rolls = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      return {
        total:
          rolls.reduce(function (a, b) {
            return a + b;
          }, 0) + modifier,
        rolls: rolls,
        sides: sides,
      };
    };

    const getSuccessLevel = function (roll, target, sides) {
      if (sides === 100) {
        if (roll <= 5) return { level: 3, name: '大成功', color: '#9b59b6' };
        if (roll >= 96) return { level: -1, name: '大失败', color: '#c0392b' };
        if (roll <= Math.floor(target / 5)) return { level: 2, name: '极难成功', color: '#2980b9' };
        if (roll <= Math.floor(target / 2)) return { level: 1, name: '困难成功', color: '#27ae60' };
        if (roll <= target) return { level: 0, name: '普通成功', color: '#f39c12' };
        return { level: -1, name: '失败', color: '#e74c3c' };
      } else {
        if (roll === 20) return { level: 3, name: '大成功', color: '#9b59b6' };
        if (roll === 1) return { level: -1, name: '大失败', color: '#c0392b' };
        if (roll >= target) return { level: 0, name: '成功', color: '#27ae60' };
        return { level: -1, name: '失败', color: '#e74c3c' };
      }
    };

    panel.find('#contest-roll-btn').click(function () {
      var formula = panel.find('#contest-dice-type').val() || '1d100';

      var initName = panel.find('#contest-init-display').val().trim() || '<user>';
      var initAttrName = panel.find('#contest-init-name').val().trim() || '自由检定';
      // 辅助函数：根据骰子公式计算最大值的一半
      var getHalfMax = function (formulaStr) {
        var m = formulaStr.match(/(\d+)d(\d+)/i);
        if (m) return Math.round((parseInt(m[1], 10) * parseInt(m[2], 10)) / 2);
        return 50;
      };

      var initValueInput = panel.find('#contest-init-value').val().trim();
      var initValue;
      if (initValueInput === '') {
        // 属性值留空：使用骰子最大值的一半作为默认
        initValue = getHalfMax(formula);
      } else {
        initValue = parseInt(initValueInput, 10) || getHalfMax(formula);
      }
      var initTargetInput = panel.find('#contest-init-target').val().trim();
      var initTarget;
      if (initTargetInput !== '') {
        initTarget = parseInt(initTargetInput, 10);
      } else {
        // 目标值留空：使用属性值（若属性值也是默认的，则两者相等）
        initTarget = initValue;
      }

      var oppName = panel.find('#contest-opponent-display').val().trim() || '对手';
      var oppAttrName = panel.find('#contest-opp-name').val().trim() || initAttrName;
      var oppValueInput = panel.find('#contest-opp-value').val().trim();
      var oppValue;
      if (oppValueInput === '') {
        // 属性值留空：使用骰子最大值的一半作为默认
        oppValue = getHalfMax(formula);
      } else {
        oppValue = parseInt(oppValueInput, 10) || getHalfMax(formula);
      }
      var oppTargetInput = panel.find('#contest-opp-target').val().trim();
      var oppTarget;
      if (oppTargetInput !== '') {
        oppTarget = parseInt(oppTargetInput, 10);
      } else {
        // 目标值留空：使用属性值
        oppTarget = oppValue;
      }

      var initResult = rollDice(formula);
      var oppResult = rollDice(formula);
      var initSuccess = getSuccessLevel(initResult.total, initTarget, initResult.sides);
      var oppSuccess = getSuccessLevel(oppResult.total, oppTarget, oppResult.sides);

      var winner, winnerColor, resultDesc;
      var diceCfg = getDiceConfig();
      var tieRule = diceCfg.contestTieRule || 'initiator_lose';

      if (initSuccess.level > oppSuccess.level) {
        winner = initName + ' 胜利';
        winnerColor = '#27ae60';
        resultDesc = initSuccess.name + ' 胜过 ' + oppSuccess.name;
      } else if (initSuccess.level < oppSuccess.level) {
        winner = oppName + ' 胜利';
        winnerColor = '#e74c3c';
        resultDesc = oppSuccess.name + ' 胜过 ' + initSuccess.name;
      } else {
        // 平手情况，根据配置决定结果
        resultDesc = '双方均为 ' + initSuccess.name;
        if (tieRule === 'initiator_win') {
          winner = '平手，' + initName + ' 判胜';
          winnerColor = '#27ae60';
        } else if (tieRule === 'tie') {
          winner = '双方平手';
          winnerColor = '#f39c12';
        } else {
          // 默认: initiator_lose
          winner = '平手，' + initName + ' 判负';
          winnerColor = '#e74c3c';
        }
      }

      panel
        .find('#contest-result-area')
        .html(
          '<div style="padding:8px 10px;background:' +
            t.tableHead +
            ';border-radius:6px;margin-top:8px;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:6px;flex-wrap:wrap;">' +
            '<div style="display:flex;align-items:center;gap:4px;min-width:0;">' +
            '<span style="font-size:11px;color:' +
            t.textSub +
            ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60px;">' +
            escapeHtml(initName) +
            '</span>' +
            '<span style="font-size:18px;font-weight:bold;color:' +
            t.accent +
            ';">' +
            initResult.total +
            '</span>' +
            '<span style="padding:2px 5px;background:' +
            initSuccess.color +
            ';color:#fff;border-radius:8px;font-size:9px;white-space:nowrap;">' +
            initSuccess.name +
            '</span>' +
            '</div>' +
            '<span style="color:' +
            t.textSub +
            ';font-size:11px;font-weight:bold;">VS</span>' +
            '<div style="display:flex;align-items:center;gap:4px;min-width:0;">' +
            '<span style="padding:2px 5px;background:' +
            oppSuccess.color +
            ';color:#fff;border-radius:8px;font-size:9px;white-space:nowrap;">' +
            oppSuccess.name +
            '</span>' +
            '<span style="font-size:18px;font-weight:bold;color:' +
            t.accent +
            ';">' +
            oppResult.total +
            '</span>' +
            '<span style="font-size:11px;color:' +
            t.textSub +
            ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60px;">' +
            escapeHtml(oppName) +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div style="text-align:center;padding:5px 8px;background:' +
            winnerColor +
            ';border-radius:4px;">' +
            '<span style="font-size:12px;font-weight:bold;color:#fff;">' +
            winner +
            '</span>' +
            '</div>' +
            '</div>',
        );

      const contestResultText =
        `进行了一次【${initAttrName} vs ${oppAttrName}】的对抗检定。` +
        `${initName} (目标${initTarget}) 掷出 ${initResult.total}，判定为【${initSuccess.name}】；` +
        `${oppName} (目标${oppTarget}) 掷出 ${oppResult.total}，判定为【${oppSuccess.name}】。` +
        `最终结果：【${winner}】`;
      smartInsertToTextarea(contestResultText, 'dice');
    });
    // [新增] 切换到普通检定
    panel.find('#contest-switch-normal').click(function () {
      var initValueInput = panel.find('#contest-init-value').val().trim();
      var currentInitName = panel.find('#contest-init-name').val() || '';
      var currentDice = panel.find('#contest-dice-type').val() || '1d100';
      var initiatorNameVal = panel.find('#contest-init-display').val().trim();
      closePanel();
      showDicePanel({
        // 只有用户实际输入了值才传递，否则传 null 让普通检定面板显示 placeholder
        targetValue: initValueInput !== '' ? parseInt(initValueInput, 10) : null,
        targetName: currentInitName,
        diceType: currentDice,
        initiatorName: initiatorNameVal,
      });
    });
    // 齿轮设置按钮点击 - 调用统一设置面板
    // 对抗检定根据当前骰子类型判断规则：1d20 -> DND, 其他 -> COC
    panel.find('.acu-contest-config-btn').click(function (e) {
      e.stopPropagation();
      const currentDice = panel.find('#contest-dice-type').val() || '1d100';
      const isDND = currentDice === '1d20';
      showDiceSettingsPanel(isDND);
    });
    var closePanel = function () {
      overlay.remove();
      panel.remove();
    };
    overlay.click(closePanel);
    panel.find('.acu-contest-close').click(closePanel);
  };
  // [新增] 显示预览卡片（复用表格卡片样式）
  const showPreviewCard = (tableName, headers, row, rowIndex, tableKey) => {
    const { $ } = getCore();
    $('.acu-preview-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();

    // 获取标题（通常是第二列，索引1）
    const title = row[1] || '详情';

    // 构建内容行
    let bodyHtml = '';
    for (let i = 1; i < headers.length; i++) {
      const headerName = headers[i];
      const cellValue = row[i];
      if (!headerName || cellValue === null || cellValue === undefined || cellValue === '') continue;

      bodyHtml += `
                <div class="acu-preview-row">
                    <div class="acu-preview-label">${escapeHtml(headerName)}</div>
                    <div class="acu-preview-value">${escapeHtml(String(cellValue))}</div>
                </div>
            `;
    }

    // 创建弹窗
    const overlay = $(`
            <div class="acu-preview-overlay acu-theme-${config.theme}">
                <div class="acu-preview-card">
                    <div class="acu-panel-header">
                        <div class="acu-preview-title">
                            <i class="fa-solid fa-id-card"></i>
                            <span>${escapeHtml(title)}</span>
                        </div>
                        <button class="acu-close-btn acu-preview-close"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-preview-body">
                        ${bodyHtml || '<div style="text-align:center;color:var(--acu-text-sub);padding:20px;">无数据</div>'}
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);

    // 关闭事件
    overlay.find('.acu-preview-close').click(() => overlay.remove());
    overlay.on('click', function (e) {
      if ($(e.target).hasClass('acu-preview-overlay')) overlay.remove();
    });
  };

  // 人物关系图可视化
  const showRelationshipGraph = npcTable => {
    const { $ } = getCore();
    $('.acu-relation-graph-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();

    const headers = npcTable.headers || [];
    const rows = npcTable.rows || [];

    const nameIdx = headers.findIndex(h => h && (h.includes('姓名') || h.includes('名称'))) || 1;
    const relationIdx = headers.findIndex(h => h && h.includes('人际关系'));
    const npcTableKey = npcTable.key || '';

    if (relationIdx < 0) {
      if (window.toastr) window.toastr.warning('未找到"人际关系"列');
      return;
    }

    const nodes = new Map();
    const edges = [];

    const resolveName = name => AvatarManager.getPrimaryName(name);

    const rawData = cachedRawData || getTableData();
    let playerName = '主角';
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          playerName = sheet.content[1][1] || '主角';
          break;
        }
      }
    }
    const resolvedPlayerName = resolveName(playerName);
    const playerTableKey = (() => {
      for (const k in rawData) {
        if (rawData[k]?.name?.includes('主角')) return k;
      }
      return '';
    })();
    nodes.set(resolvedPlayerName, {
      name: resolvedPlayerName,
      isPlayer: true,
      x: 0,
      y: 0,
      tableKey: playerTableKey,
      rowIndex: 0,
    });

    // 查找"在场状态"列索引（模糊匹配）
    const inSceneColIdx = headers.findIndex(h => h && h.includes('在场'));

    rows.forEach((row, idx) => {
      const rawNpcName = row[nameIdx];
      if (!rawNpcName) return;

      const npcName = resolveName(rawNpcName);

      // 判断是否在场：支持多种格式
      let isInScene = false;
      if (inSceneColIdx > 0) {
        const inSceneVal = String(row[inSceneColIdx] || '')
          .trim()
          .toLowerCase();
        const header = String(headers[inSceneColIdx] || '').toLowerCase();

        if (header.includes('离场')) {
          isInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
        } else {
          isInScene =
            inSceneVal.startsWith('在场') || inSceneVal === 'true' || inSceneVal === '是' || inSceneVal === 'yes';
        }
      }

      if (!nodes.has(npcName)) {
        nodes.set(npcName, {
          name: npcName,
          isPlayer: false,
          x: 0,
          y: 0,
          tableKey: npcTableKey,
          rowIndex: idx,
          isInScene: isInScene,
        });
      }

      const relationStr = row[relationIdx] || '';
      const relations = parseRelationshipString(relationStr);

      relations.forEach(rel => {
        if (!rel.name) return;
        const resolvedRelName = resolveName(rel.name);

        if (resolvedRelName === npcName) return;

        if (!nodes.has(resolvedRelName)) {
          // 查找该人物在NPC表中的行索引
          let relRowIndex = -1;
          for (let ri = 0; ri < rows.length; ri++) {
            if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
              relRowIndex = ri;
              break;
            }
          }
          nodes.set(resolvedRelName, {
            name: resolvedRelName,
            isPlayer: resolvedRelName === resolvedPlayerName,
            x: 0,
            y: 0,
            tableKey: relRowIndex >= 0 ? npcTableKey : '',
            rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
          });
        }

        // 清洗关系词：移除冗余前缀/后缀，分割多关系词
        const cleanRelation = rawRel => {
          if (!rawRel) return [];
          const parts = String(rawRel)
            .split(/[,，、;；\/\|]+|\s*[和与&]\s*|\s{2,}|\n/)
            .map(s => s.trim())
            .filter(s => s && s.length < 30); // 放宽初筛限制，后续智能提取

          // 常见关系词库（用于从长文本中智能提取）
          const commonRelations = [
            '恋人',
            '情侣',
            '夫妻',
            '伴侣',
            '爱人',
            '男友',
            '女友',
            '前男友',
            '前女友',
            '朋友',
            '好友',
            '挚友',
            '密友',
            '闺蜜',
            '死党',
            '知己',
            '损友',
            '同学',
            '校友',
            '同窗',
            '学长',
            '学姐',
            '学弟',
            '学妹',
            '前辈',
            '后辈',
            '同事',
            '上司',
            '下属',
            '老板',
            '员工',
            '搭档',
            '队友',
            '战友',
            '伙伴',
            '师父',
            '师傅',
            '徒弟',
            '弟子',
            '老师',
            '学生',
            '导师',
            '门生',
            '父亲',
            '母亲',
            '儿子',
            '女儿',
            '兄弟',
            '姐妹',
            '哥哥',
            '姐姐',
            '弟弟',
            '妹妹',
            '爷爷',
            '奶奶',
            '外公',
            '外婆',
            '叔叔',
            '阿姨',
            '舅舅',
            '姑姑',
            '表哥',
            '表姐',
            '表弟',
            '表妹',
            '堂兄',
            '堂弟',
            '堂姐',
            '堂妹',
            '家人',
            '亲人',
            '亲戚',
            '血亲',
            '义父',
            '义母',
            '义兄',
            '义妹',
            '敌人',
            '仇人',
            '对手',
            '劲敌',
            '宿敌',
            '情敌',
            '死敌',
            '冤家',
            '邻居',
            '室友',
            '房东',
            '租客',
            '客户',
            '商人',
            '雇主',
            '雇员',
            '信徒',
            '教徒',
            '追随者',
            '崇拜者',
            '粉丝',
            '陌生人',
            '熟人',
            '路人',
            '过客',
          ];

          return parts
            .map(p => {
              // [新增] 移除所有中英文括号及其内容
              p = p.replace(/[（(][^）)]*[）)]/g, '').trim();
              // === 特殊前缀处理：XX的目标/对象 → 保留XX ===
              const specialSuffixMatch = p.match(/^(.+)的(目标|对象)$/);
              if (specialSuffixMatch) {
                p = specialSuffixMatch[1]; // "执念的目标" → "执念"
              } else {
                // === 普通情况：XX的YY → 保留YY ===
                p = p.replace(/^[\u4e00-\u9fa5]{2,4}的(?=[\u4e00-\u9fa5]{1,4}$)/, '');
              }

              // === 移除冗余前缀 ===
              p = p.replace(/^(?:属于|作为|身为|是其?|为其?|乃)/, '');
              p = p.replace(/^(?:曾经是?|以前是?|原本是?|前)/, '前');
              p = p.replace(/^(?:互为|彼此是?|相互是?)/, '');

              // === 移除冗余后缀 ===
              p = p.replace(/关系$/, '');
              p = p.replace(/对象$/, '');
              p = p.replace(/目标$/, '');

              // === 特殊短语替换 ===
              p = p.replace(/^关系复杂$/, '复杂');
              p = p.replace(/^关系不明$/, '不明');
              p = p.replace(/^关系微妙$/, '微妙');
              p = p.replace(/^关系紧张$/, '紧张');
              p = p.replace(/^关系亲密$/, '亲密');
              p = p.replace(/^关系疏远$/, '疏远');
              p = p.replace(/^(?:不认识|不熟悉|陌生人?)$/, '陌生');
              p = p.replace(/^(?:认识|熟人)$/, '熟人');
              p = p.replace(/^(?:好朋友|挚友|密友|至交)$/, '挚友');
              p = p.replace(/^(?:男朋友|男友)$/, '男友');
              p = p.replace(/^(?:女朋友|女友)$/, '女友');
              p = p.replace(/^(?:前男友|前男朋友)$/, '前男友');
              p = p.replace(/^(?:前女友|前女朋友)$/, '前女友');
              p = p.replace(/^(?:暗恋对象|暗恋)$/, '暗恋');
              p = p.replace(/^(?:单相思|单恋)$/, '单恋');
              p = p.replace(/^(?:青梅竹马|儿时玩伴|发小)$/, '青梅竹马');
              p = p.replace(/^(?:同班同学|同级同学)$/, '同学');
              p = p.replace(/^(?:工作伙伴|合作伙伴|搭档)$/, '搭档');

              p = p.trim();

              // === [新增] 智能提取：如果处理后仍然过长，尝试从末尾提取常见关系词 ===
              if (p.length > 8) {
                // 尝试匹配末尾的常见关系词
                for (const rel of commonRelations) {
                  if (p.endsWith(rel)) {
                    return rel;
                  }
                }
                // 如果没匹配到，尝试提取最后2-4个字
                const lastChars = p.slice(-4);
                for (const rel of commonRelations) {
                  if (lastChars.includes(rel)) {
                    return rel;
                  }
                }
                // 兜底：取最后3个字
                return p.slice(-3);
              }

              return p;
            })
            .filter(s => s && s.length > 0 && s.length <= 8);
        };

        const cleanedLabels = cleanRelation(rel.relation);
        if (cleanedLabels.length === 0) cleanedLabels.push('');

        // 查找已存在的边（无论方向）
        let existingEdge = edges.find(
          e =>
            (e.source === npcName && e.target === resolvedRelName) ||
            (e.source === resolvedRelName && e.target === npcName),
        );

        if (!existingEdge) {
          // 创建新边，使用新的数据结构
          edges.push({
            source: npcName,
            target: resolvedRelName,
            // 新结构：分别存储两个方向的标签
            labelsFromSource: cleanedLabels.slice(0, 2), // source→target 方向，最多2个
            labelsFromTarget: [], // target→source 方向
          });
        } else {
          // 边已存在，追加标签到正确的方向
          if (existingEdge.source === npcName) {
            // 当前npc是source，追加到 labelsFromSource
            const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
            // 去重并限制最多2个
            existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
          } else {
            // 当前npc是target，追加到 labelsFromTarget
            const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
            existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
          }
        }
      });
    });

    const nodeArr = Array.from(nodes.values());
    const centerX = 400,
      centerY = 300;

    // [新增] 统计每个节点的关系数量
    const connectionCount = new Map();
    nodeArr.forEach(node => connectionCount.set(node.name, 0));
    edges.forEach(edge => {
      connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
      connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
    });

    // [新增] 根据屏幕尺寸和关系数量计算节点半径
    const isMobileView = window.innerWidth <= 768;
    const baseRadius = isMobileView ? 22 : 28;
    const maxRadius = isMobileView ? 38 : 50;
    const playerBaseRadius = isMobileView ? 28 : 35;
    const radiusPerConnection = isMobileView ? 2.5 : 3.5;

    const getNodeRadius = (nodeName, isPlayer) => {
      if (isPlayer) {
        const count = connectionCount.get(nodeName) || 0;
        return Math.min(maxRadius, playerBaseRadius + Math.sqrt(count) * radiusPerConnection);
      }
      const count = connectionCount.get(nodeName) || 0;
      return Math.min(maxRadius, baseRadius + Math.sqrt(count) * radiusPerConnection);
    };

    // 将半径信息存入节点
    nodeArr.forEach(node => {
      node.radius = getNodeRadius(node.name, node.isPlayer);
    });

    // 根据最大节点尺寸调整布局半径
    const maxNodeRadius = Math.max(...nodeArr.map(n => n.radius));
    const radius = Math.min(280, Math.max(180, nodeArr.length * 30 + maxNodeRadius));
    nodeArr.forEach((node, i) => {
      if (node.isPlayer) {
        node.x = centerX;
        node.y = centerY;
      } else {
        const angle = (2 * Math.PI * i) / nodeArr.length;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      }
    });

    // 视图状态
    let scale = 1;
    let panX = 0;
    let panY = 0;
    const minScale = 0.3;
    const maxScale = 4;

    const overlay = $(`
            <div class="acu-relation-graph-overlay acu-theme-${config.theme}">
                <div class="acu-relation-graph-container">
                    <div class="acu-panel-header">
                        <div class="acu-graph-title"><i class="fa-solid fa-project-diagram"></i> 人物关系图</div>
                        <div class="acu-graph-actions">
                            <button class="acu-graph-btn" id="graph-zoom-in" title="放大"><i class="fa-solid fa-plus"></i></button>
                            <button class="acu-graph-btn" id="graph-zoom-out" title="缩小"><i class="fa-solid fa-minus"></i></button>
                            <button class="acu-graph-btn" id="graph-manage-avatar" title="管理头像"><i class="fa-solid fa-user-circle"></i></button>
                            <button class="acu-graph-btn acu-graph-close" title="关闭"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-graph-canvas-wrapper">
                        <svg class="acu-graph-svg" viewBox="0 0 800 600">
                            <defs>
                                <marker id="arrowhead-end" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 6 2.5, 0 5" fill="${t.textSub}" />
                                </marker>
                                <marker id="arrowhead-start" markerWidth="6" markerHeight="5" refX="1" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="6 0, 0 2.5, 6 5" fill="${t.textSub}" />
                                </marker>
                                <marker id="arrowhead-end-hl" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 7 3, 0 6" fill="${t.accent}" />
                                </marker>
                                <marker id="arrowhead-start-hl" markerWidth="7" markerHeight="6" refX="1" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="7 0, 0 3, 7 6" fill="${t.accent}" />
                                </marker>
                            </defs>
                            <g class="acu-graph-transform">
                                <g class="acu-graph-edges"></g>
                                <g class="acu-graph-nodes"></g>
                            </g>
                        </svg>
                    </div>
                    <div class="acu-graph-legend">
                        <button class="acu-graph-btn" id="graph-zoom-reset" title="重置视图" style="width:auto;height:auto;padding:4px 10px;font-size:11px;display:flex;align-items:center;gap:4px;"><i class="fa-solid fa-compress-arrows-alt"></i><span>重置</span></button>
                        <span class="acu-zoom-display">${Math.round(scale * 100)}%</span>
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);

    const $svg = overlay.find('.acu-graph-svg');
    const $transform = overlay.find('.acu-graph-transform');
    const $edgesGroup = overlay.find('.acu-graph-edges');
    const $nodesGroup = overlay.find('.acu-graph-nodes');
    const $zoomDisplay = overlay.find('.acu-zoom-display');
    const $wrapper = overlay.find('.acu-graph-canvas-wrapper');

    const updateTransform = () => {
      $transform.attr('transform', `translate(${panX}, ${panY}) scale(${scale})`);
      $zoomDisplay.text(`${Math.round(scale * 100)}%`);
    };

    const zoomTo = (newScale, centerX = 400, centerY = 300) => {
      const oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, newScale));
      const scaleChange = scale / oldScale;
      panX = centerX - (centerX - panX) * scaleChange;
      panY = centerY - (centerY - panY) * scaleChange;
      updateTransform();
    };

    const render = async () => {
      let edgesHtml = '';
      edges.forEach((edge, edgeIdx) => {
        const source = nodes.get(edge.source);
        const target = nodes.get(edge.target);
        if (!source || !target) return;

        // 计算方向向量和中点
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / len; // 单位向量
        const ny = dy / len;

        // 垂直于连线的向量（用于标签偏移）
        const px = -ny;
        const py = nx;

        // 判断箭头类型
        const hasFromSource =
          edge.labelsFromSource && edge.labelsFromSource.length > 0 && edge.labelsFromSource.some(l => l);
        const hasFromTarget =
          edge.labelsFromTarget && edge.labelsFromTarget.length > 0 && edge.labelsFromTarget.some(l => l);

        // 缩短线条，避免箭头与节点重叠（增加额外间距）
        const sourceRadius = source.radius || 28;
        const targetRadius = target.radius || 28;
        const arrowGap = 10; // 箭头与节点之间的额外间距（考虑大节点）
        const x1 = source.x + nx * (sourceRadius + arrowGap);
        const y1 = source.y + ny * (sourceRadius + arrowGap);
        const x2 = target.x - nx * (targetRadius + arrowGap);
        const y2 = target.y - ny * (targetRadius + arrowGap);

        // 智能去重：跨方向移除重复标签
        let srcLabels = (edge.labelsFromSource || []).filter(l => l);
        let tgtLabels = (edge.labelsFromTarget || []).filter(l => l);

        // 找出两边都有的标签（共同标签）
        const srcSet = new Set(srcLabels);
        const tgtSet = new Set(tgtLabels);
        const commonLabels = [...srcSet].filter(l => tgtSet.has(l));

        // 从两边移除共同标签，它们将显示在中间
        const srcUnique = srcLabels.filter(l => !commonLabels.includes(l));
        const tgtUnique = tgtLabels.filter(l => !commonLabels.includes(l));

        // 设置箭头标记
        let markerStart = '';
        let markerEnd = '';
        if (hasFromSource) markerEnd = 'url(#arrowhead-end)';
        if (hasFromTarget) markerStart = 'url(#arrowhead-start)';

        edgesHtml += `<line class="acu-graph-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                    ${markerEnd ? `marker-end="${markerEnd}"` : ''}
                    ${markerStart ? `marker-start="${markerStart}"` : ''}
                    data-edge-idx="${edgeIdx}" />`;

        // 渲染标签
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        // 计算标签位置（根据连线长度动态调整，更紧凑）
        const lineLen = Math.sqrt(dx * dx + dy * dy);

        // 判断是否是"双向且内容完全一致"的情况
        const isBidirectional = hasFromSource && hasFromTarget;
        const isBidirectionalSame =
          isBidirectional && commonLabels.length > 0 && srcUnique.length === 0 && tgtUnique.length === 0;

        // 只有双向且完全一致时，标签才显示在正中间
        if (isBidirectionalSame) {
          // 双向相同：标签显示在正中间
          commonLabels.slice(0, 2).forEach((lbl, i) => {
            if (!lbl) return;
            const offsetDir = i === 0 ? 1 : -1;
            const offsetDist = 6 + i * 10;
            const lx = midX + px * offsetDir * offsetDist;
            const ly = midY + py * offsetDir * offsetDist;
            edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${escapeHtml(lbl)}</text>`;
          });
        } else {
          // 单向或双向不同：分区域显示
          // 偏移量：从中点向source/target方向偏移，但不要太靠近节点
          // 使用连线长度的25%，但限制在合理范围内
          const safeOffset = Math.max(30, Math.min(lineLen * 0.25, 60));

          // 关系词Emoji映射表
          const relationEmojiMap = [
            {
              emoji: '💕',
              keywords: [
                '恋人',
                '恋爱',
                '爱情',
                '恋情',
                '情侣',
                '男友',
                '女友',
                '暗恋',
                '单恋',
                '心动',
                '喜欢',
                '爱慕',
                '倾心',
                '钟情',
                '情人',
                '爱人',
              ],
            },
            {
              emoji: '👨‍👩‍👧',
              keywords: [
                '家人',
                '亲人',
                '父母',
                '父亲',
                '母亲',
                '兄弟',
                '姐妹',
                '兄妹',
                '姐弟',
                '儿子',
                '女儿',
                '爷爷',
                '奶奶',
                '外公',
                '外婆',
                '叔叔',
                '阿姨',
                '表亲',
                '堂亲',
                '血亲',
              ],
            },
            {
              emoji: '😊',
              keywords: [
                '朋友',
                '友人',
                '好友',
                '友情',
                '伙伴',
                '搭档',
                '队友',
                '战友',
                '同伴',
                '盟友',
                '挚友',
                '密友',
                '至交',
                '闺蜜',
                '死党',
                '知己',
                '莫逆',
              ],
            },
            {
              emoji: '🎓',
              keywords: [
                '师父',
                '师傅',
                '徒弟',
                '师徒',
                '老师',
                '学生',
                '导师',
                '弟子',
                '门生',
                '同学',
                '同窗',
                '同级',
                '同班',
                '前辈',
                '后辈',
                '学长',
                '学姐',
                '学弟',
                '学妹',
              ],
            },
            { emoji: '💰', keywords: ['交易', '合作', '生意', '客户', '商业', '利益', '雇佣', '契约', '合同'] },
            { emoji: '⚔️', keywords: ['对手', '竞争', '劲敌', '宿敌', '情敌', '死对头', '冤家'] },
            { emoji: '💢', keywords: ['敌人', '仇人', '仇恨', '敌对', '仇敌', '死敌', '憎恨', '怨恨', '仇怨'] },
            { emoji: '🙏', keywords: ['信仰', '崇拜', '敬仰', '仰慕', '追随', '信徒', '教徒', '狂信'] },
            { emoji: '🌀', keywords: ['复杂', '微妙', '纠葛', '羁绊', '纠缠'] },
          ];

          // 给关系词添加Emoji
          const addRelationEmoji = lbl => {
            if (!lbl) return '';
            for (const group of relationEmojiMap) {
              for (const kw of group.keywords) {
                if (lbl.includes(kw)) {
                  return lbl + group.emoji;
                }
              }
            }
            return lbl;
          };

          // 截断过长标签的辅助函数（在添加emoji之前截断）
          const truncateLabel = (lbl, maxLen = 4) => {
            if (!lbl) return '';
            const truncated = lbl.length > maxLen ? lbl.substring(0, maxLen) + '..' : lbl;
            return addRelationEmoji(truncated);
          };

          // 1. 共同标签（显示在正中间，垂直于连线一上一下）
          if (commonLabels.length > 0) {
            commonLabels.slice(0, 1).forEach((lbl, i) => {
              if (!lbl) return;
              // 单个共同标签放在线的上方
              const lx = midX + px * 8;
              const ly = midY + py * 8 - 3;
              edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${escapeHtml(truncateLabel(lbl, 5))}</text>`;
            });
          }

          // 2. Source侧标签（靠近source，垂直于连线排列）
          if (srcUnique.length > 0 || (hasFromSource && !hasFromTarget && commonLabels.length === 0)) {
            const labelsToShow = srcUnique.length > 0 ? srcUnique : srcLabels;
            // 基准点：从中点向source方向偏移
            const labelBaseX = midX - nx * safeOffset;
            const labelBaseY = midY - ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列：第一个在线上方，第二个在线下方
              const perpOffset = (i === 0 ? 1 : -1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${escapeHtml(truncateLabel(lbl, 5))}</text>`;
            });
          }

          // 3. Target侧标签（靠近target，垂直于连线排列）
          if (tgtUnique.length > 0 || (hasFromTarget && !hasFromSource && commonLabels.length === 0)) {
            const labelsToShow = tgtUnique.length > 0 ? tgtUnique : tgtLabels;
            // 基准点：从中点向target方向偏移
            const labelBaseX = midX + nx * safeOffset;
            const labelBaseY = midY + ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列
              const perpOffset = (i === 0 ? -1 : 1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${escapeHtml(truncateLabel(lbl, 5))}</text>`;
            });
          }
        }
      });
      $edgesGroup.html(edgesHtml);

      // [修复] 异步获取头像后再渲染节点
      let nodesHtml = '';
      for (const node of nodeArr) {
        // 使用异步方法获取头像（优先本地 > URL > ST头像）
        const nodeAvatar = await AvatarManager.getAsync(node.name);
        const isPlayer = node.isPlayer;

        // 在场标记：左上角小圆点（放大尺寸，确保可见）
        const indicatorRadius = Math.max(8, node.radius * 0.28);
        const indicatorOffset = node.radius * 0.65;
        const inSceneIndicator = node.isInScene
          ? `<circle class="acu-node-inscene-indicator" cx="${-indicatorOffset}" cy="${-indicatorOffset}" r="${indicatorRadius}" style="fill:var(--acu-accent);stroke:var(--acu-bg-panel);stroke-width:2;" />`
          : '';

        const nodeDisplayName = replaceUserPlaceholders(node.name);
        nodesHtml += `
                <g class="acu-graph-node acu-dash-preview-trigger" data-name="${escapeHtml(node.name)}" data-table-key="${node.tableKey || ''}" data-row-index="${node.rowIndex !== undefined ? node.rowIndex : ''}" transform="translate(${node.x}, ${node.y})">
                    <circle class="acu-node-bg ${isPlayer ? 'player' : ''}" r="${node.radius}" />
                    ${
                      nodeAvatar
                        ? (() => {
                            const offsetX = AvatarManager.getOffsetX(node.name);
                            const offsetY = AvatarManager.getOffsetY(node.name);
                            const scaleVal = AvatarManager.getScale(node.name);
                            const size = (node.radius - 2) * 2;
                            return `<foreignObject x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}">
                            <div xmlns="http://www.w3.org/1999/xhtml" style="
                                width: ${size}px;
                                height: ${size}px;
                                border-radius: 50%;
                                background-image: url('${nodeAvatar}');
                                background-size: ${scaleVal}%;
                                background-position: ${offsetX}% ${offsetY}%;
                                background-repeat: no-repeat;
                            "></div>
                        </foreignObject>`;
                          })()
                        : `<text class="acu-node-char" dy="0.35em">${escapeHtml(nodeDisplayName.charAt(0))}</text>`
                    }
                    ${inSceneIndicator}
                    <text class="acu-node-label" dy="${node.radius + 14}">${escapeHtml(nodeDisplayName)}</text>
                </g>
            `;
      }
      $nodesGroup.html(nodesHtml);
    };

    render().then(() => {
      updateTransform();
    });

    // [新增] 悬浮高亮交互函数
    const highlightNode = nodeName => {
      $svg.addClass('highlighting');

      // 高亮当前节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if ($(this).data('name') === nodeName) {
          $(this).addClass('highlighted');
        }
      });

      // 找出所有与该节点相连的边和对端节点
      const connectedNodes = new Set([nodeName]);

      edges.forEach(edge => {
        if (edge.source === nodeName || edge.target === nodeName) {
          const otherNode = edge.source === nodeName ? edge.target : edge.source;
          connectedNodes.add(otherNode);
        }
      });

      // 高亮相连的节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if (connectedNodes.has($(this).data('name'))) {
          $(this).addClass('highlighted');
        }
      });

      // 高亮相关的边和标签
      const connectedEdgeIndices = new Set();
      edges.forEach((edge, idx) => {
        if (edge.source === nodeName || edge.target === nodeName) {
          connectedEdgeIndices.add(idx);
        }
      });

      $edgesGroup.find('.acu-graph-edge').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('highlighted');
          if ($(this).attr('marker-end')) {
            $(this).attr('marker-end', 'url(#arrowhead-end-hl)');
          }
          if ($(this).attr('marker-start')) {
            $(this).attr('marker-start', 'url(#arrowhead-start-hl)');
          }
        }
      });

      $edgesGroup.find('.acu-graph-edge-label').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('highlighted');
        }
      });
    };

    const clearHighlight = () => {
      $svg.removeClass('highlighting');
      $nodesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.acu-graph-edge').each(function () {
        if ($(this).attr('marker-end')) {
          $(this).attr('marker-end', 'url(#arrowhead-end)');
        }
        if ($(this).attr('marker-start')) {
          $(this).attr('marker-start', 'url(#arrowhead-start)');
        }
      });
    };

    // [修复] 节点交互 - PC悬浮高亮 + 移动端长按高亮 + 单击预览
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 全局状态
    let currentHighlightedNode = null; // 当前高亮的节点名
    let longPressTimer = null;
    let tapBlocked = false; // 阻止点击的标志

    if (isTouchDevice) {
      // ========== 移动端逻辑 ==========
      let currentHighlightedNode = null;

      $nodesGroup.on('pointerdown', '.acu-graph-node', function (e) {
        const $node = $(this);
        const nodeName = $node.data('name');
        const startX = e.clientX;
        const startY = e.clientY;
        const startTime = Date.now();
        let hasMoved = false;
        let longPressTriggered = false;

        // 如果已有高亮，这次点击只用于清除
        if (currentHighlightedNode) {
          clearHighlight();
          currentHighlightedNode = null;
          // 直接return，不绑定后续事件
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 长按计时器
        const longPressTimer = setTimeout(() => {
          if (!hasMoved && nodeName) {
            longPressTriggered = true;
            currentHighlightedNode = nodeName;
            highlightNode(nodeName);
            if (navigator.vibrate) navigator.vibrate(30);
          }
        }, 300);

        const onMove = moveE => {
          const dx = Math.abs(moveE.clientX - startX);
          const dy = Math.abs(moveE.clientY - startY);
          if (dx > 8 || dy > 8) {
            hasMoved = true;
            clearTimeout(longPressTimer);
          }
        };

        const onUp = () => {
          $(document).off('pointermove.mobilenode pointerup.mobilenode pointercancel.mobilenode');
          clearTimeout(longPressTimer);

          const elapsed = Date.now() - startTime;

          // 长按已触发 → 什么都不做（高亮保持）
          if (longPressTriggered) {
            return;
          }

          // 移动了 → 什么都不做
          if (hasMoved) {
            return;
          }

          // 快速点击（<300ms）且没移动 → 显示详情
          if (elapsed < 300) {
            const tableKey = $node.data('table-key');
            const rowIndex = $node.data('row-index');

            if (tableKey && rowIndex !== '' && rowIndex !== undefined) {
              const rawData = cachedRawData || getTableData();
              if (rawData && rawData[tableKey]) {
                const sheet = rawData[tableKey];
                const headers = sheet.content ? sheet.content[0] : [];
                const row = sheet.content ? sheet.content[parseInt(rowIndex, 10) + 1] : null;
                if (row) {
                  showPreviewCard(sheet.name || '详情', headers, row, parseInt(rowIndex, 10), tableKey);
                }
              }
            }
          }
        };

        $(document).on('pointermove.mobilenode', onMove);
        $(document).on('pointerup.mobilenode pointercancel.mobilenode', onUp);
      });

      // 点击画布空白处清除高亮
      $wrapper.on('pointerup.mobileclear', function (e) {
        if (currentHighlightedNode && !$(e.target).closest('.acu-graph-node').length) {
          clearHighlight();
          currentHighlightedNode = null;
        }
      });
    } else {
      // ========== PC端逻辑 ==========

      $nodesGroup.on('pointerenter.pchover', '.acu-graph-node', function () {
        const nodeName = $(this).data('name');
        if (nodeName) {
          highlightNode(nodeName);
        }
      });

      $nodesGroup.on('pointerleave.pchover', '.acu-graph-node', function () {
        clearHighlight();
      });

      // PC端点击显示详情
      $nodesGroup.on('click.pcclick', '.acu-graph-node', function (e) {
        e.stopPropagation();
        const $node = $(this);
        const tableKey = $node.data('table-key');
        const rowIndex = $node.data('row-index');

        if (tableKey && rowIndex !== '' && rowIndex !== undefined) {
          const rawData = cachedRawData || getTableData();
          if (rawData && rawData[tableKey]) {
            const sheet = rawData[tableKey];
            const headers = sheet.content ? sheet.content[0] : [];
            const row = sheet.content ? sheet.content[parseInt(rowIndex, 10) + 1] : null;
            if (row) {
              showPreviewCard(sheet.name || '详情', headers, row, parseInt(rowIndex, 10), tableKey);
            }
          }
        }
      });
    }

    // 画布平移和缩放 - 使用 Pointer Events API

    const getSvgPoint = (clientX, clientY) => {
      const svg = $svg[0];
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };

    // 画布平移和缩放 - 使用 Pointer Events API
    let isPanning = false;
    let panStartX = 0,
      panStartY = 0;
    let panStartPanX = 0,
      panStartPanY = 0;
    let lastPinchDist = 0;
    let activePointerId = null;

    const wrapperEl = $wrapper[0];
    const svgEl = $svg[0];

    // Pointer Down - 开始拖拽
    wrapperEl.onpointerdown = function (e) {
      if (e.button !== 0) return;
      // [修复] 如果点击的是节点，不启动画布拖拽
      if ($(e.target).closest('.acu-graph-node').length) return;
      e.preventDefault();
      wrapperEl.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartPanX = panX;
      panStartPanY = panY;
      svgEl.style.cursor = 'grabbing';
    };

    // Pointer Move - 拖拽中
    wrapperEl.onpointermove = function (e) {
      if (!isPanning || e.pointerId !== activePointerId) return;
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      const rect = svgEl.getBoundingClientRect();
      panX = panStartPanX + (dx / rect.width) * 800;
      panY = panStartPanY + (dy / rect.height) * 600;
      updateTransform();
    };

    // Pointer Up - 结束拖拽
    wrapperEl.onpointerup = function (e) {
      if (e.pointerId === activePointerId) {
        wrapperEl.releasePointerCapture(e.pointerId);
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = 'grab';
      }
    };

    // Pointer Cancel - 取消
    wrapperEl.onpointercancel = function (e) {
      if (e.pointerId === activePointerId) {
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = 'grab';
      }
    };

    // 滚轮缩放
    wrapperEl.onwheel = function (e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoomTo(scale + delta);
    };

    // 移动端双指缩放
    wrapperEl.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          isPanning = false;
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            zoomTo(scale * (newDist / lastPinchDist));
          }
          lastPinchDist = newDist;
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener('touchend', function (e) {
      if (e.touches.length < 2) lastPinchDist = 0;
    });

    // 清理函数
    const cleanupEvents = () => {
      wrapperEl.onpointerdown = null;
      wrapperEl.onpointermove = null;
      wrapperEl.onpointerup = null;
      wrapperEl.onpointercancel = null;
      wrapperEl.onwheel = null;
    };

    // 按钮
    overlay.find('#graph-zoom-in').click(() => zoomTo(scale + 0.25));
    overlay.find('#graph-zoom-out').click(() => zoomTo(scale - 0.25));

    // 重置视图（缩放、位置 + 节点布局）
    overlay.find('#graph-zoom-reset').click(() => {
      // 重置缩放和平移
      scale = 1;
      panX = 0;
      panY = 0;
      updateTransform();

      // 同时重置节点布局
      nodeArr.forEach((node, i) => {
        if (node.isPlayer) {
          node.x = centerX;
          node.y = centerY;
        } else {
          const angle = (2 * Math.PI * i) / nodeArr.length;
          node.x = centerX + radius * Math.cos(angle);
          node.y = centerY + radius * Math.sin(angle);
        }
      });
      render();
    });

    overlay.find('#graph-manage-avatar').click(() => {
      showAvatarManager(nodeArr, () => render());
    });

    const closeGraph = () => {
      cleanupEvents();
      overlay.remove();
    };
    overlay.find('.acu-graph-close').click(closeGraph);
    overlay.on('click', function (e) {
      if ($(e.target).hasClass('acu-relation-graph-overlay')) closeGraph();
    });
  };
  // ========================================
  // 头像裁剪弹窗 - 统一PC/移动端体验
  // ========================================

  const showAvatarCropModal = (imageSource, characterName, onSave) => {
    const { $ } = getCore();
    $('.acu-crop-modal-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();

    // 初始参数
    let scale = 150;
    let offsetX = 50;
    let offsetY = 50;

    // 尝试读取已有配置
    const existing = AvatarManager.getAll()[characterName];
    if (existing) {
      scale = existing.scale ?? 150;
      offsetX = existing.offsetX ?? 50;
      offsetY = existing.offsetY ?? 50;
    }

    const modalHtml = `
            <div class="acu-crop-modal-overlay acu-theme-${config.theme}">
                <div class="acu-crop-modal">
                    <div class="acu-crop-header">
                        <span><i class="fa-solid fa-crop-simple"></i> 调整头像 - ${escapeHtml(characterName)}</span>
                        <button class="acu-crop-close"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-crop-body">
                        <div class="acu-crop-container">
                            <div class="acu-crop-image" style="
                                background-image: url('${imageSource}');
                                background-size: ${scale}%;
                                background-position: ${offsetX}% ${offsetY}%;
                            "></div>
                            <div class="acu-crop-mask"></div>
                        </div>
                        <div class="acu-crop-hint">拖拽移动 · 滚轮/双指缩放</div>
                    </div>
                    <div class="acu-crop-footer">
                        <label class="acu-crop-btn acu-crop-reupload" title="重新上传">
                            <i class="fa-solid fa-camera"></i>
                            <input type="file" accept="image/*" class="acu-crop-file-input" style="display:none;" />
                        </label>
                        <button class="acu-crop-btn acu-crop-cancel">取消</button>
                        <button class="acu-crop-btn acu-crop-confirm"><i class="fa-solid fa-check"></i> 确定</button>
                    </div>
                </div>
            </div>
        `;

    const $modal = $(modalHtml);
    $('body').append($modal);

    // 强制样式确保居中（复用其他弹窗的可靠方式）
    $modal.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'z-index': '2147483658',
    });

    const $image = $modal.find('.acu-crop-image');
    const $container = $modal.find('.acu-crop-container');
    const containerEl = $container[0];
    const imageEl = $image[0];

    // 更新图片样式
    const updateImageStyle = () => {
      imageEl.style.backgroundSize = `${scale}%`;
      imageEl.style.backgroundPosition = `${offsetX}% ${offsetY}%`;
    };

    // === 拖拽逻辑（使用 Pointer Events 统一处理） ===
    let isDragging = false;
    let startX = 0,
      startY = 0;
    let startOffsetX = 0,
      startOffsetY = 0;
    let activePointerId = null;

    imageEl.addEventListener('pointerdown', e => {
      // 忽略多点触控的额外手指
      if (activePointerId !== null) return;

      e.preventDefault();
      e.stopPropagation();

      isDragging = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startOffsetX = offsetX;
      startOffsetY = offsetY;

      imageEl.setPointerCapture(e.pointerId);
      imageEl.style.cursor = 'grabbing';
    });

    imageEl.addEventListener('pointermove', e => {
      if (!isDragging || e.pointerId !== activePointerId) return;

      e.preventDefault();
      e.stopPropagation();

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // 灵敏度根据缩放调整
      const sensitivity = 100 / scale;
      offsetX = Math.max(0, Math.min(100, startOffsetX - deltaX * sensitivity));
      offsetY = Math.max(0, Math.min(100, startOffsetY - deltaY * sensitivity));
      updateImageStyle();
    });

    imageEl.addEventListener('pointerup', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.releasePointerCapture(e.pointerId);
      imageEl.style.cursor = 'grab';
    });

    imageEl.addEventListener('pointercancel', e => {
      if (e.pointerId !== activePointerId) return;

      isDragging = false;
      activePointerId = null;
      imageEl.style.cursor = 'grab';
    });

    // === 缩放逻辑 ===
    // 滚轮缩放
    containerEl.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -10 : 10;
        scale = Math.max(100, Math.min(300, scale + delta));
        updateImageStyle();
      },
      { passive: false },
    );

    // 双指缩放
    let lastPinchDist = 0;
    let pinchStartScale = scale;

    containerEl.addEventListener(
      'touchstart',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          pinchStartScale = scale;
        }
      },
      { passive: false },
    );

    containerEl.addEventListener(
      'touchmove',
      e => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            const pinchRatio = newDist / lastPinchDist;
            scale = Math.max(100, Math.min(300, pinchStartScale * pinchRatio));
            updateImageStyle();
          }
        }
      },
      { passive: false },
    );

    containerEl.addEventListener('touchend', e => {
      if (e.touches.length < 2) {
        lastPinchDist = 0;
        pinchStartScale = scale;
      }
    });

    // === 按钮事件 ===
    // 重新上传
    $modal.find('.acu-crop-file-input').on('change', async function (e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        if (window.toastr) window.toastr.warning('请选择图片文件');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (window.toastr) window.toastr.warning('图片大小不能超过 5MB');
        return;
      }

      try {
        // 保存新图片
        const success = await AvatarManager.saveLocalAvatar(characterName, file);
        if (success) {
          // 获取新 URL 并更新预览
          const newUrl = await LocalAvatarDB.get(characterName);
          imageSource = newUrl;

          // 重置裁剪参数
          scale = 150;
          offsetX = 50;
          offsetY = 50;

          // 更新显示
          $image.css('background-image', `url('${newUrl}')`);
          updateImageStyle();
        }
      } catch (err) {
        console.error('[ACU] 重新上传失败:', err);
        if (window.toastr) window.toastr.error('上传失败');
      }

      $(this).val('');
    });
    $modal.find('.acu-crop-close, .acu-crop-cancel').on('click', () => {
      $modal.remove();
    });

    $modal.find('.acu-crop-confirm').on('click', () => {
      onSave({ scale, offsetX, offsetY });
      $modal.remove();
    });

    // 点击遮罩关闭
    $modal.on('click', e => {
      if ($(e.target).hasClass('acu-crop-modal-overlay')) {
        $modal.remove();
      }
    });
  };
  // 头像管理弹窗（简化版 - 使用裁剪弹窗）
  const showAvatarManager = (nodeArr, onUpdate) => {
    const { $ } = getCore();
    $('.acu-avatar-manager-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();
    const avatars = AvatarManager.getAll();

    // 异步构建列表
    const buildList = async () => {
      let listHtml = '';

      for (const node of nodeArr) {
        const data = avatars[node.name] || {};
        let currentUrl = data.url || '';

        // 检查是否有本地图片
        const hasLocal = await AvatarManager.hasLocalAvatar(node.name);
        let displayUrl = '';
        let sourceLabel = '';

        if (hasLocal) {
          displayUrl = await LocalAvatarDB.get(node.name);
          sourceLabel = '<span class="acu-avatar-source acu-source-local">本地</span>';
        } else if (currentUrl) {
          displayUrl = currentUrl;
          sourceLabel = '<span class="acu-avatar-source acu-source-url">URL</span>';
        } else {
          const playerName = getPlayerName();
          const isPlayer = node.name === '<user>' || node.name === '主角' || (playerName && node.name === playerName);
          if (isPlayer) {
            displayUrl = getUserAvatarUrl() || '';
            if (displayUrl) sourceLabel = '<span class="acu-avatar-source acu-source-auto">酒馆</span>';
          }
        }

        const aliases = (data.aliases || []).join(', ');
        const hasAvatar = !!displayUrl;

        listHtml += `
                    <div class="acu-avatar-item" data-name="${escapeHtml(node.name)}" data-has-local="${hasLocal}" data-display-url="${escapeHtml(displayUrl)}">
                        <div class="acu-avatar-preview-wrap">
                            <div class="acu-avatar-preview ${hasAvatar ? 'has-image' : ''}" style="${hasAvatar ? `background-image: url('${displayUrl}'); background-position: ${data.offsetX ?? 50}% ${data.offsetY ?? 50}%; background-size: ${data.scale ?? 150}%;` : ''}">
                                ${!hasAvatar ? `<span>${escapeHtml(node.name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>` : ''}
                            </div>
                            ${sourceLabel}
                        </div>
                        <div class="acu-avatar-info">
                            <div class="acu-avatar-name-row">
                                <div class="acu-avatar-name">${escapeHtml(node.name)}</div>
                                <div class="acu-avatar-actions">
                                    <button class="acu-avatar-save-btn" title="保存"><i class="fa-solid fa-check"></i></button>
                                    <button class="acu-avatar-clear-btn" title="清除"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                            <input type="text" class="acu-avatar-url" placeholder="粘贴URL..." value="${escapeHtml(currentUrl)}" />
                            <input type="text" class="acu-avatar-aliases" placeholder="别名（逗号分隔）..." value="${escapeHtml(aliases)}" title="例如: 睦, 睦头" />
                            <input type="file" accept="image/*" class="acu-avatar-file-input" style="display:none;" />
                        </div>
                    </div>
                `;
      }

      return listHtml;
    };

    // 先显示加载状态
    const managerHtml = `
            <div class="acu-avatar-manager-overlay acu-theme-${config.theme}">
                <div class="acu-avatar-manager">
                    <div class="acu-panel-header">
                        <div class="acu-avatar-title"><i class="fa-solid fa-user-circle"></i> 头像管理</div>
                        <div style="display:flex;gap:4px;align-items:center;">
                            <button class="acu-avatar-import-btn" title="导入"><i class="fa-solid fa-file-import"></i></button>
                            <button class="acu-avatar-export-btn" title="导出"><i class="fa-solid fa-file-export"></i></button>
                            <button class="acu-avatar-close"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-avatar-list" id="acu-avatar-list-container">
                        <div style="text-align:center;padding:20px;color:${t.textSub};">
                            <i class="fa-solid fa-spinner fa-spin"></i> 加载中...
                        </div>
                    </div>
                </div>
                <input type="file" id="acu-avatar-file-input" accept=".json" style="display:none;" />
            </div>
        `;

    const $manager = $(managerHtml);
    $('body').append($manager);

    // 异步加载列表
    buildList().then(listHtml => {
      $manager.find('#acu-avatar-list-container').html(listHtml);
      bindAvatarEvents();
    });

    // 刷新单个条目的显示
    const refreshItem = async name => {
      const $item = $manager.find(`.acu-avatar-item[data-name="${name}"]`);
      if (!$item.length) return;

      const data = AvatarManager.getAll()[name] || {};
      const hasLocal = await AvatarManager.hasLocalAvatar(name);
      let displayUrl = '';
      let sourceLabel = '';

      if (hasLocal) {
        displayUrl = await LocalAvatarDB.get(name);
        sourceLabel = '<span class="acu-avatar-source acu-source-local">本地</span>';
      } else if (data.url) {
        displayUrl = data.url;
        sourceLabel = '<span class="acu-avatar-source acu-source-url">URL</span>';
      }

      const $preview = $item.find('.acu-avatar-preview');
      $item.find('.acu-avatar-source').remove();

      if (displayUrl) {
        $preview
          .addClass('has-image')
          .css({
            'background-image': `url('${displayUrl}')`,
            'background-position': `${data.offsetX ?? 50}% ${data.offsetY ?? 50}%`,
            'background-size': `${data.scale ?? 150}%`,
          })
          .find('span')
          .remove();
        $item.find('.acu-avatar-preview-wrap').append(sourceLabel);
      } else {
        $preview
          .removeClass('has-image')
          .css({ 'background-image': '', 'background-position': '', 'background-size': '' })
          .html(`<span>${escapeHtml(name.charAt(0))}</span><i class="fa-solid fa-camera acu-avatar-camera-hint"></i>`);
      }

      $item.attr('data-has-local', hasLocal);
      $item.attr('data-display-url', displayUrl);
    };

    const bindAvatarEvents = () => {
      // 点击头像预览
      $manager.on('click', '.acu-avatar-preview', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-avatar-item');
        const name = $item.data('name');
        const displayUrl = $item.attr('data-display-url');

        if (displayUrl) {
          // 有图片 → 打开裁剪弹窗
          showAvatarCropModal(displayUrl, name, async result => {
            const data = AvatarManager.getAll()[name] || {};
            AvatarManager.set(name, data.url || '', result.offsetX, result.offsetY, result.scale, data.aliases || []);
            await refreshItem(name);
            onUpdate && onUpdate();
          });
        } else {
          // 无图片 → 触发文件上传
          $item.find('.acu-avatar-file-input').click();
        }
      });

      // 本地文件上传
      $manager.on('change', '.acu-avatar-file-input', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          if (window.toastr) window.toastr.warning('请选择图片文件');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          if (window.toastr) window.toastr.warning('图片大小不能超过 5MB');
          return;
        }

        const $item = $(this).closest('.acu-avatar-item');
        const name = $item.data('name');

        try {
          const success = await AvatarManager.saveLocalAvatar(name, file);
          if (success) {
            const newUrl = await LocalAvatarDB.get(name);
            await refreshItem(name);

            // 自动弹出裁剪弹窗
            showAvatarCropModal(newUrl, name, async result => {
              const data = AvatarManager.getAll()[name] || {};
              AvatarManager.set(name, data.url || '', result.offsetX, result.offsetY, result.scale, data.aliases || []);
              await refreshItem(name);
              onUpdate && onUpdate();
            });
          }
        } catch (err) {
          console.error('[ACU] 上传头像失败:', err);
          if (window.toastr) window.toastr.error('上传失败');
        }

        $(this).val('');
      });

      // 保存URL → 弹出裁剪
      $manager.on('click', '.acu-avatar-save-btn', async function () {
        const $item = $(this).closest('.acu-avatar-item');
        const name = $item.data('name');
        const url = $item.find('.acu-avatar-url').val().trim();
        const aliasesStr = $item.find('.acu-avatar-aliases').val().trim();
        const aliases = aliasesStr
          ? aliasesStr
              .split(/[,，]/)
              .map(s => s.trim())
              .filter(s => s && s !== name)
          : [];

        const data = AvatarManager.getAll()[name] || {};

        // 保存基础配置
        AvatarManager.set(name, url, data.offsetX ?? 50, data.offsetY ?? 50, data.scale ?? 150, aliases);

        // 如果有URL且没有本地图片，弹出裁剪
        const hasLocal = $item.attr('data-has-local') === 'true';
        if (url && !hasLocal) {
          await refreshItem(name);
          showAvatarCropModal(url, name, async result => {
            AvatarManager.set(name, url, result.offsetX, result.offsetY, result.scale, aliases);
            await refreshItem(name);
            onUpdate && onUpdate();
          });
        } else {
          await refreshItem(name);
          onUpdate && onUpdate();
        }
      });

      // 清除
      $manager.on('click', '.acu-avatar-clear-btn', async function () {
        const $item = $(this).closest('.acu-avatar-item');
        const name = $item.data('name');

        await AvatarManager.deleteLocalAvatar(name);
        AvatarManager.remove(name);

        $item.find('.acu-avatar-url').val('');
        $item.find('.acu-avatar-aliases').val('');
        await refreshItem(name);
        onUpdate && onUpdate();
      });

      // 导出
      $manager.on('click', '.acu-avatar-export-btn', function () {
        const exportData = AvatarManager.exportData();
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `avatar-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // 导入
      $manager.on('click', '.acu-avatar-import-btn', function () {
        $manager.find('#acu-avatar-file-input').click();
      });

      $manager.on('change', '#acu-avatar-file-input', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (evt) {
          try {
            const jsonData = JSON.parse(evt.target.result);
            const analysis = AvatarManager.analyzeImport(jsonData);

            if (!analysis.valid) {
              if (window.toastr) window.toastr.error(analysis.error);
              return;
            }

            showImportConfirmDialog(jsonData, analysis, () => {
              $manager.remove();
              showAvatarManager(nodeArr, onUpdate);
              onUpdate && onUpdate();
            });
          } catch (err) {
            console.error('[ACU] 导入解析失败:', err);
            if (window.toastr) window.toastr.error('文件解析失败');
          }
        };
        reader.readAsText(file);
        $(this).val('');
      });
    };

    // 关闭
    const closeManager = () => $manager.remove();
    $manager.on('click', '.acu-avatar-close', closeManager);
    $manager.on('click', function (e) {
      if ($(e.target).hasClass('acu-avatar-manager-overlay')) closeManager();
    });
  };

  // 导入确认弹窗
  const showImportConfirmDialog = (jsonData, analysis, onComplete) => {
    const { $ } = getCore();
    $('.acu-import-confirm-overlay').remove();

    const t = getThemeColors();
    const config = getConfig();

    const hasConflicts = analysis.conflicts.length > 0;
    const conflictListHtml =
      analysis.conflicts.length > 0
        ? `<div style="max-height:80px;overflow-y:auto;background:rgba(0,0,0,0.1);border-radius:4px;padding:6px 8px;margin-top:6px;font-size:11px;color:${t.textSub};">${analysis.conflicts.map(n => escapeHtml(n)).join(', ')}</div>`
        : '';

    const dialogHtml = `
            <div class="acu-import-confirm-overlay acu-theme-${config.theme}">
                <div class="acu-import-confirm-dialog">
                    <div class="acu-import-confirm-header">
                        <i class="fa-solid fa-file-import"></i> 导入头像配置
                    </div>
                    <div class="acu-import-confirm-body">
                        <div class="acu-import-stats">
                            <div class="acu-import-stat">
                                <span class="acu-stat-num">${analysis.total}</span>
                                <span class="acu-stat-label">总计</span>
                            </div>
                            <div class="acu-import-stat acu-stat-new">
                                <span class="acu-stat-num">${analysis.newItems.length}</span>
                                <span class="acu-stat-label">新增</span>
                            </div>
                            <div class="acu-import-stat acu-stat-conflict">
                                <span class="acu-stat-num">${analysis.conflicts.length}</span>
                                <span class="acu-stat-label">冲突</span>
                            </div>
                        </div>

                        ${
                          hasConflicts
                            ? `
                            <div class="acu-import-conflict-section">
                                <div style="font-size:12px;font-weight:bold;color:${t.textMain};margin-bottom:4px;">
                                    <i class="fa-solid fa-exclamation-triangle" style="color:#e67e22;"></i> 以下角色已存在：
                                </div>
                                ${conflictListHtml}
                                <div class="acu-import-conflict-options">
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="overwrite" checked />
                                        <span>用导入的覆盖本地</span>
                                    </label>
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="skip" />
                                        <span>保留本地的不变</span>
                                    </label>
                                </div>
                            </div>
                        `
                            : `
                            <div style="text-align:center;padding:10px;color:${t.successText};">
                                <i class="fa-solid fa-check-circle"></i> 无冲突，可直接导入
                            </div>
                        `
                        }
                    </div>
                    <div class="acu-import-confirm-footer">
                        <button class="acu-import-cancel-btn">取消</button>
                        <button class="acu-import-confirm-btn">确认导入</button>
                    </div>
                </div>
            </div>
        `;

    const $dialog = $(dialogHtml);
    $('body').append($dialog);

    // 强制样式
    const overlayEl = $dialog[0];
    overlayEl.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0,0,0,0.6) !important;
            z-index: 2147483655 !important;
            display: flex;
            justify-content: center !important;
            align-items: center !important;
            padding: 16px;
            box-sizing: border-box !important;
        `;

    const closeDialog = () => $dialog.remove();

    $dialog.find('.acu-import-cancel-btn').click(closeDialog);
    $dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-import-confirm-overlay')) closeDialog();
    });

    $dialog.find('.acu-import-confirm-btn').click(function () {
      const overwrite = $dialog.find('input[name="conflict-mode"]:checked').val() !== 'skip';
      try {
        const stats = AvatarManager.importData(jsonData, overwrite);
        closeDialog();
        onComplete && onComplete();
      } catch (err) {
        console.error('[ACU] 导入失败:', err);
        if (window.toastr) window.toastr.error('导入失败：' + err.message);
      }
    });
  };
  // [新增] 整体编辑模态框 (已修复自动高度与样式复用)
  const showCardEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();
    let rawData = cachedRawData || getTableData() || loadSnapshot();

    let displayRow = row;
    // 确保获取的是最新数据
    if (rawData && rawData[tableKey] && rawData[tableKey]?.content?.[rowIndex + 1]) {
      displayRow = rawData[tableKey]?.content?.[rowIndex + 1];
    }

    const inputsHtml = displayRow
      .map((cell, idx) => {
        if (idx === 0) return ''; // 跳过索引列
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        // 自动高度的 textarea
        return `
                <div class="acu-card-edit-field" style="margin-bottom: 10px;">
                    <label style="display:block;font-size:12px;color:var(--acu-accent);font-weight:bold;margin-bottom:4px;">${escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-edit-textarea" data-col="${idx}" spellcheck="false" rows="1"
                    style="width:100%;min-height:40px;max-height:500px;padding:10px;resize:none;overflow-y:hidden;">${escapeHtml(val)}</textarea>
                </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">整体编辑 (#${rowIndex + 1} - ${escapeHtml(tableName)})</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
                        ${inputsHtml}
                    </div>
                     <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-card-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-card-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // --- [修复] 自动高度调节逻辑 ---
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 shrinking 时的 scrollHeight
      el.style.height = 'auto';
      const contentHeight = el.scrollHeight + 2;
      const maxHeight = 500;
      el.style.height = Math.min(contentHeight, maxHeight) + 'px';
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    };

    // 1. 初始化时：使用 requestAnimationFrame 确保在 DOM 渲染后执行
    requestAnimationFrame(() => {
      dialog.find('textarea').each(function () {
        adjustHeight(this);
      });
    });

    // 2. 输入时：实时调整
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });
    // -----------------------------

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-card-cancel').click(closeDialog);

    // 保存逻辑：复用 v8.4 的 saveDataToDatabase
    dialog.find('#dlg-card-save').click(async () => {
      let rawData = cachedRawData || getTableData() || loadSnapshot();
      if (rawData && rawData[tableKey]) {
        const currentRow = rawData[tableKey]?.content?.[rowIndex + 1];
        if (!currentRow) {
          closeDialog();
          return;
        }
        let hasChanges = false;
        dialog.find('textarea').each(function () {
          const colIdx = parseInt($(this).data('col'));
          const newVal = $(this).val();
          if (String(currentRow[colIdx]) !== String(newVal)) {
            hasChanges = true;
            currentRow[colIdx] = newVal;
          }
        });
        if (hasChanges) {
          await saveDataToDatabase(rawData, false, true); // 触发 v8.4 的保存流程
          renderInterface();
        }
      }
      closeDialog();
    });
    dialog.on('click', function (e) {
      // 点击遮罩层关闭
      if ($(e.target).hasClass('acu-edit-overlay')) {
        closeDialog();
        return;
      }
      // 点击关闭按钮（双重保险）
      if ($(e.target).closest('#dlg-close-x, #dlg-close, .acu-close-btn').length) {
        closeDialog();
      }
    });
  };

  // [优化] 内存配置缓存
  let _configCache = null;
  const getConfig = () => {
    if (!_configCache) _configCache = { ...DEFAULT_CONFIG, ...Store.get(STORAGE_KEY_UI_CONFIG, {}) };
    return _configCache;
  };
  const saveConfig = newCfg => {
    _configCache = { ...getConfig(), ...newCfg };
    Store.set(STORAGE_KEY_UI_CONFIG, _configCache);
    applyConfigStyles(_configCache);
  };

  const generateDiffMap = currentData => {
    const lastData = loadSnapshot();
    const diffSet = new Set();
    if (!lastData) return diffSet;

    for (const sheetId in currentData) {
      const newSheet = currentData[sheetId];
      const oldSheet = lastData[sheetId];
      if (!newSheet || !newSheet.name) continue;
      const tableName = newSheet.name;
      if (!oldSheet) {
        if (newSheet.content) {
          newSheet.content.forEach((row, rIdx) => {
            if (rIdx > 0) diffSet.add(`${tableName}-row-${rIdx - 1}`);
          });
        }
        continue;
      }
      const newRows = newSheet.content || [];
      const oldRows = oldSheet.content || [];
      newRows.forEach((row, rIdx) => {
        if (rIdx === 0) return;
        const oldRow = oldRows[rIdx];
        if (!oldRow) {
          diffSet.add(`${tableName}-row-${rIdx - 1}`);
        } else {
          row.forEach((cell, cIdx) => {
            if (cIdx === 0) return;
            const oldCell = oldRow[cIdx];
            if (String(cell) !== String(oldCell)) diffSet.add(`${tableName}-${rIdx - 1}-${cIdx}`);
          });
        }
      });
    }
    return diffSet;
  };

  const applyConfigStyles = config => {
    const { $ } = getCore();
    const $wrapper = $('.acu-wrapper');
    const fontVal = FONTS.find(f => f.id === config.fontFamily)?.val || FONTS[0].val;

    // [优化] 只有字体 ID 变化时才重写 Style 标签，避免闪烁
    const $styleTag = $('#acu-dynamic-font');
    const currentFontId = $styleTag.data('font-id');

    if (currentFontId !== config.fontFamily) {
      $styleTag.remove();
      const fontImport = `
                @import url("https://fontsapi.zeoseven.com/3/main/result.css");
                @import url("https://fontsapi.zeoseven.com/442/main/result.css");
                @import url("https://fontsapi.zeoseven.com/256/main/result.css");
                @import url("https://fontsapi.zeoseven.com/482/main/result.css");
                @import url("https://fontsapi.zeoseven.com/446/main/result.css");
                @import url("https://fontsapi.zeoseven.com/570/main/result.css");
                @import url("https://fontsapi.zeoseven.com/292/main/result.css");
                @import url("https://fontsapi.zeoseven.com/69/main/result.css");
                @import url("https://fontsapi.zeoseven.com/7/main/result.css");
            `;
      $('head').append(`
                <style id="acu-dynamic-font" data-font-id="${config.fontFamily}">
                    ${fontImport}
                    .acu-wrapper, .acu-edit-dialog, .acu-cell-menu, .acu-nav-container, .acu-data-card, .acu-panel-title, .acu-settings-label, .acu-btn-block, .acu-nav-btn, .acu-edit-textarea, #acu-ghost-preview {
                        font-family: ${fontVal} !important;
                    }
                </style>
            `);
    }

    // [优化] 尺寸和颜色变化只更新 CSS 变量，完全不闪烁
    const cssVars = {
      '--acu-card-width': `${config.cardWidth}px`,
      '--acu-font-size': `${config.fontSize}px`,
      '--acu-opt-font-size': `${config.optionFontSize || 12}px`,
      '--acu-grid-cols': config.gridColumns,
    };

    if ($wrapper.length) {
      $wrapper.removeClass((idx, cls) => (cls.match(/(^|\s)acu-theme-\S+/g) || []).join(' '));
      $wrapper.addClass(`acu-theme-${config.theme}`);
      $wrapper.css(cssVars);
    }

    const $optContainer = $('.acu-embedded-options-container');
    if ($optContainer.length) {
      $optContainer.removeClass((idx, cls) => (cls.match(/(^|\s)acu-theme-\S+/g) || []).join(' '));
      $optContainer.addClass(`acu-theme-${config.theme}`);
      $optContainer.css(cssVars);
    }
  };

  const addStyles = () => {
    const _styleStart = performance.now();
    if (window._acuStylesInjected && $(`#${SCRIPT_ID}-styles`).length) return;
    window._acuStylesInjected = true;
    const { $ } = getCore();
    $('style').each(function () {
      if (this.id && this.id.startsWith('acu_') && this.id.endsWith('-styles') && this.id !== `${SCRIPT_ID}-styles`)
        $(this).remove();
    });
    $(`#${SCRIPT_ID}-styles`).remove();
    const styles = `
        <style id="${SCRIPT_ID}-styles">
    /* ========== 核心隔离层 ========== */
    .acu-wrapper,
    .acu-wrapper *:not(i[class*="fa-"]),
    .acu-edit-overlay,
    .acu-edit-overlay *:not(i[class*="fa-"]),
    .acu-cell-menu,
    .acu-cell-menu *:not(i[class*="fa-"]),
    .acu-dice-panel,
    .acu-dice-panel *:not(i[class*="fa-"]),
    .acu-contest-panel,
    .acu-contest-panel *:not(i[class*="fa-"]),
    .acu-relation-graph-overlay,
    .acu-relation-graph-overlay *:not(i[class*="fa-"]),
    .acu-avatar-manager-overlay,
    .acu-avatar-manager-overlay *:not(i[class*="fa-"]),
    .acu-preview-overlay,
    .acu-preview-overlay *:not(i[class*="fa-"]),
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *:not(i[class*="fa-"]),
    .acu-embedded-options-container,
    .acu-embedded-options-container *:not(i[class*="fa-"]) {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
    }
    /* ========== 基础样式 ========== */
    .acu-wrapper,
    .acu-edit-overlay,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-import-confirm-overlay,
    .acu-embedded-options-container,
    .acu-cell-menu {
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: var(--acu-text-main);
    }
    /* 投骰面板统一样式 (需要 !important 覆盖 SillyTavern 全局样式和内联样式) */
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-dice-panel input[type="text"],
    .acu-dice-panel input[type="number"],
    .acu-dice-panel input:not([type]),
    .acu-dice-panel select,
    .acu-contest-panel input[type="text"],
    .acu-contest-panel input[type="number"],
    .acu-contest-panel input:not([type]),
    .acu-contest-panel select,
    .acu-dice-config-dialog input[type="text"],
    .acu-dice-config-dialog input[type="number"],
    .acu-dice-config-dialog input:not([type]),
    .acu-dice-config-dialog select {
        width: 100%;
        padding: 6px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-text-main) !important;
        font-size: 12px;
        text-align: center;
        box-sizing: border-box;
    }
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-dice-config-dialog input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
    }
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-dice-config-dialog input:focus,
    .acu-dice-config-dialog select:focus {
        outline: none;
        border-color: var(--acu-accent) !important;
    }
    .acu-dice-panel select option,
    .acu-contest-panel select option,
    .acu-dice-config-dialog select option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    /* 投骰面板下拉框统一样式 */
    .acu-dice-select {
        width: 100%;
        padding: 6px 4px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-text-main) !important;
        font-size: 11px;
        box-sizing: border-box;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
    }
    .acu-dice-select:focus {
        outline: none;
        border-color: var(--acu-accent) !important;
    }
    .acu-dice-select option {
        background: var(--acu-bg-panel) !important;
        color: var(--acu-text-main) !important;
    }
    /* 搜索框样式 */
    .acu-wrapper .acu-search-input {
        background-color: var(--acu-input-bg) !important;
        color: var(--acu-text-main) !important;
        border: 1px solid var(--acu-border);
    }
    .acu-wrapper .acu-search-input:focus {
        outline: none;
        border-color: var(--acu-accent);
        box-shadow: none !important;
    }
    .acu-wrapper .acu-search-input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
    }
    /* ========== 通用组件基类 ========== */
    /* 按钮基类 */
    .acu-wrapper button,
    .acu-edit-overlay button,
    .acu-dice-panel button,
    .acu-contest-panel button,
    .acu-relation-graph-overlay button,
    .acu-avatar-manager-overlay button,
    .acu-preview-overlay button,
    .acu-embedded-options-container button {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        cursor: pointer;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        transition: all 0.2s ease;
        outline: none;
    }
    .acu-wrapper button:hover,
    .acu-edit-overlay button:hover,
    .acu-dice-panel button:hover,
    .acu-contest-panel button:hover,
    .acu-relation-graph-overlay button:hover,
    .acu-avatar-manager-overlay button:hover,
    .acu-preview-overlay button:hover,
    .acu-embedded-options-container button:hover {
        background: var(--acu-btn-hover);
    }
    .acu-wrapper button:focus,
    .acu-edit-overlay button:focus,
    .acu-dice-panel button:focus,
    .acu-contest-panel button:focus,
    .acu-relation-graph-overlay button:focus,
    .acu-avatar-manager-overlay button:focus,
    .acu-preview-overlay button:focus,
    .acu-embedded-options-container button:focus {
        outline: none;
        box-shadow: none;
    }

    /* 输入框基类 */
    .acu-wrapper input,
    .acu-wrapper textarea,
    .acu-wrapper select,
    .acu-edit-overlay input,
    .acu-edit-overlay textarea,
    .acu-edit-overlay select,
    .acu-dice-panel input,
    .acu-dice-panel select,
    .acu-contest-panel input,
    .acu-contest-panel select,
    .acu-avatar-manager-overlay input {
        font-family: inherit;
        font-size: inherit;
        line-height: 1.4;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        outline: none;
        transition: border-color 0.2s;
    }
    .acu-wrapper input:focus,
    .acu-wrapper textarea:focus,
    .acu-wrapper select:focus,
    .acu-edit-overlay input:focus,
    .acu-edit-overlay textarea:focus,
    .acu-edit-overlay select:focus,
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-avatar-manager-overlay input:focus {
        border-color: var(--acu-accent);
        box-shadow: none;
        outline: none;
    }
    .acu-wrapper input::placeholder,
    .acu-wrapper textarea::placeholder,
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-avatar-manager-overlay input::placeholder {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }

    /* 弹窗遮罩层基类 */
    .acu-edit-overlay,
    .acu-dice-overlay,
    .acu-contest-overlay,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-import-confirm-overlay,
    .acu-dice-config-overlay,
    .acu-crop-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.6);
        z-index: 2147483646;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }

    /* 弹窗容器基类 */
    .acu-edit-dialog,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-container,
    .acu-avatar-manager,
    .acu-preview-card,
    .acu-import-confirm-dialog,
    .acu-dice-config-dialog {
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    /* 弹窗头部基类 - 统一使用 .acu-panel-header */
    .acu-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        flex-shrink: 0;
    }

    /* 关闭按钮基类 - 所有关闭按钮统一使用 .acu-close-btn */
    .acu-close-btn {
        background: none;
        border: none;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 16px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .acu-close-btn:hover {
        background: rgba(231, 76, 60, 0.15);
        color: #e74c3c;
    }

    /* 滚动条全局隐藏 */
    [class^="acu-"], [class^="acu-"] * { scrollbar-width: none; -ms-overflow-style: none; }
    [class^="acu-"] *::-webkit-scrollbar { display: none !important; }

    /* ========== 主题变量定义 ========== */
    .acu-theme-retro { --acu-bg-nav: #e6e2d3; --acu-bg-panel: #e6e2d3; --acu-border: #dcd0c0; --acu-text-main: #5e4b35; --acu-text-sub: #999; --acu-btn-bg: #dcd0c0; --acu-btn-hover: #cbbba8; --acu-btn-active-bg: #8d7b6f; --acu-btn-active-text: #fdfaf5; --acu-accent: #7a695f; --acu-table-head: #efebe4; --acu-table-hover: #f0ebe0; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #fffef9; --acu-badge-bg: #efebe4; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #27ae60; --acu-success-bg: rgba(39, 174, 96, 0.15); --acu-scrollbar-track: #e6e2d3; --acu-scrollbar-thumb: #cbbba8; --acu-input-bg: #f5f2eb;--acu-hl-manual: #d35400; --acu-hl-manual-bg: rgba(211, 84, 0, 0.15); --acu-hl-diff: #2980b9; --acu-hl-diff-bg: rgba(41, 128, 185, 0.15); }
    .acu-theme-dark { --acu-bg-nav: #2b2b2b; --acu-bg-panel: #252525; --acu-border: #444; --acu-text-main: #eee; --acu-text-sub: #aaa; --acu-btn-bg: #3a3a3a; --acu-btn-hover: #4a4a4a; --acu-btn-active-bg: #6a5acd; --acu-btn-active-text: #fff; --acu-accent: #9b8cd9; --acu-table-head: #333333; --acu-table-hover: #3a3a3a; --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #2d3035; --acu-badge-bg: #3a3f4b; --acu-menu-bg: #333; --acu-menu-text: #eee; --acu-success-text: #4cd964; --acu-success-bg: rgba(76, 217, 100, 0.2); --acu-scrollbar-track: #2b2b2b; --acu-scrollbar-thumb: #555; --acu-hl-manual: #ff6b81; --acu-hl-manual-bg: rgba(255, 107, 129, 0.2); --acu-hl-diff: #00d2d3; --acu-hl-diff-bg: rgba(0, 210, 211, 0.2); }
    .acu-theme-modern { --acu-bg-nav: #ffffff; --acu-bg-panel: #f8f9fa; --acu-border: #e0e0e0; --acu-text-main: #333; --acu-text-sub: #666; --acu-btn-bg: #f1f3f5; --acu-btn-hover: #e9ecef; --acu-btn-active-bg: #007bff; --acu-btn-active-text: #fff; --acu-accent: #007bff; --acu-table-head: #f8f9fa; --acu-table-hover: #f1f3f5; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #f1f3f5; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #28a745; --acu-success-bg: rgba(40, 167, 69, 0.15); --acu-scrollbar-track: #fff; --acu-scrollbar-thumb: #ccc; --acu-hl-manual: #fd7e14; --acu-hl-manual-bg: rgba(253, 126, 20, 0.15); --acu-hl-diff: #0d6efd; --acu-hl-diff-bg: rgba(13, 110, 253, 0.15); }
    .acu-theme-forest { --acu-bg-nav: #e8f5e9; --acu-bg-panel: #e8f5e9; --acu-border: #c8e6c9; --acu-text-main: #2e7d32; --acu-text-sub: #81c784; --acu-btn-bg: #c8e6c9; --acu-btn-hover: #a5d6a7; --acu-btn-active-bg: #43a047; --acu-btn-active-text: #fff; --acu-accent: #4caf50; --acu-table-head: #dcedc8; --acu-table-hover: #f1f8e9; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #dcedc8; --acu-menu-bg: #fff; --acu-menu-text: #2e7d32; --acu-success-text: #2e7d32; --acu-success-bg: rgba(46, 125, 50, 0.2); --acu-scrollbar-track: #e8f5e9; --acu-scrollbar-thumb: #a5d6a7; --acu-hl-manual: #e67e22; --acu-hl-manual-bg: rgba(230, 126, 34, 0.15); --acu-hl-diff: #1e8449; --acu-hl-diff-bg: rgba(30, 132, 73, 0.2); }
    .acu-theme-ocean { --acu-bg-nav: #e3f2fd; --acu-bg-panel: #e3f2fd; --acu-border: #bbdefb; --acu-text-main: #1565c0; --acu-text-sub: #64b5f6; --acu-btn-bg: #bbdefb; --acu-btn-hover: #90caf9; --acu-btn-active-bg: #1976d2; --acu-btn-active-text: #fff; --acu-accent: #2196f3; --acu-table-head: #bbdefb; --acu-table-hover: #e1f5fe; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #e3f2fd; --acu-menu-bg: #fff; --acu-menu-text: #1565c0; --acu-success-text: #0288d1; --acu-success-bg: rgba(2, 136, 209, 0.15); --acu-scrollbar-track: #e3f2fd; --acu-scrollbar-thumb: #90caf9; --acu-hl-manual: #ff4757; --acu-hl-manual-bg: rgba(255, 71, 87, 0.15); --acu-hl-diff: #0277bd; --acu-hl-diff-bg: rgba(2, 119, 189, 0.2); }
    .acu-theme-cyber { --acu-bg-nav: #000000; --acu-bg-panel: #0a0a0a; --acu-border: #333; --acu-text-main: #00ffcc; --acu-text-sub: #ff00ff; --acu-btn-bg: #111; --acu-btn-hover: #222; --acu-btn-active-bg: #ff00ff; --acu-btn-active-text: #fff; --acu-accent: #00ffcc; --acu-table-head: #050505; --acu-table-hover: #111; --acu-shadow: 0 0 15px rgba(0,255,204,0.15); --acu-card-bg: #050505; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #111; --acu-menu-text: #00ffcc; --acu-success-text: #0f0; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #000; --acu-scrollbar-thumb: #333; --acu-hl-manual: #ff9f43; --acu-hl-manual-bg: rgba(255, 159, 67, 0.2); --acu-hl-diff: #0abde3; --acu-hl-diff-bg: rgba(10, 189, 227, 0.2); }
    .acu-theme-cyber .acu-nav-btn { border-color: #222; }
    .acu-theme-cyber .acu-data-card { border-color: #222; }
    .acu-theme-nightowl { --acu-bg-nav: #0a2133; --acu-bg-panel: #011627; --acu-border: #132e45; --acu-text-main: #e0e6f2; --acu-text-sub: #a6b8cc; --acu-btn-bg: #1f3a52; --acu-btn-hover: #2a4a68; --acu-btn-active-bg: #7fdbca; --acu-btn-active-text: #011627; --acu-accent: #7fdbca; --acu-table-head: #0a2133; --acu-table-hover: #01294a; --acu-shadow: rgba(0,0,0,0.5); --acu-card-bg: #0a2133; --acu-badge-bg: #1f3a52; --acu-menu-bg: #011627; --acu-menu-text: #e0e6f2; --acu-success-text: #addb67; --acu-success-bg: rgba(173, 219, 103, 0.15); --acu-scrollbar-track: #011627; --acu-scrollbar-thumb: #1f3a52; --acu-hl-manual: #ff8f66; --acu-hl-manual-bg: rgba(255, 143, 102, 0.2); --acu-hl-diff: #82aaff; --acu-hl-diff-bg: rgba(130, 170, 255, 0.2); }
    /* 浅色强调色主题的按钮文字修正 */
    .acu-theme-cyber .acu-btn-confirm,
    .acu-theme-cyber .acu-changes-count,
    .acu-theme-nightowl .acu-btn-confirm,
    .acu-theme-nightowl .acu-changes-count {
        color: #111 !important;
    }
    .acu-wrapper { position: relative; width: 100%; margin: 15px 0; z-index: 2147483640 !important; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column-reverse; }
    .acu-wrapper.acu-mode-embedded { position: relative !important; width: 100% !important; margin-top: 8px !important; z-index: 2147483641 !important; clear: both; display: flex; flex-direction: column-reverse !important; padding: 0; }
    .acu-wrapper.acu-mode-embedded .acu-nav-container { position: relative !important; z-index: 2147483642 !important; }
    .acu-wrapper.acu-mode-embedded .acu-data-display { position: absolute !important; bottom: 100% !important; left: 0 !important; right: 0 !important; width: 100% !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.25) !important; border: 1px solid var(--acu-border); margin-bottom: 5px; z-index: 2147483647 !important; max-height: 70vh !important; overflow-y: auto !important; }
    .acu-nav-container { display: grid; grid-template-columns: repeat(var(--acu-grid-cols, 3), 1fr); gap: 4px; padding: 6px; background: var(--acu-bg-nav); border: 1px solid var(--acu-border); border-radius: 10px; align-items: center; box-shadow: 0 2px 6px var(--acu-shadow); position: relative; z-index: 2147483641 !important; }
    .acu-nav-btn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 3px; padding: 4px 2px; border: 1px solid transparent; border-radius: 6px; background: var(--acu-btn-bg); color: var(--acu-text-main); font-weight: 600; font-size: 11px; cursor: pointer; transition: all 0.2s ease; user-select: none; overflow: hidden; height: 28px; }
    .acu-nav-btn span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; margin-top: 1px; }
    .acu-nav-btn:hover { background: var(--acu-btn-hover); transform: translateY(-2px); }
    .acu-nav-btn:focus, .acu-nav-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--acu-accent) !important; }
    /* [新增] 移植功能样式 */
/* --- 1. 外层容器：防止误触边缘 --- */
.acu-height-control {
    display: flex;
    align-items: center;
    margin-right: 8px;
    cursor: ns-resize;
    padding: 4px;
    border-radius: 4px;
    color: var(--acu-text-sub);
    transition: all 0.2s;
    /* 关键属性：禁止在此区域触发浏览器默认手势 */
    touch-action: none;
}

/* 交互反馈 */
.acu-height-control:hover, .acu-height-control.active {
    color: var(--acu-accent);
    background: var(--acu-table-hover);
}

/* --- 2. [加保险] 内部图标：这是事件绑定的主体，必须禁止触摸 --- */
.acu-height-drag-handle {
    cursor: ns-resize;
    /* 双重保险：确保直接按在图标上也不会触发滚动 */
    touch-action: none;
}

            /* 视图切换样式 */
            .acu-view-btn { background: transparent !important; border: none; color: var(--acu-text-main) !important; cursor: pointer; padding: 4px; margin-right: 5px; font-size: 14px; opacity: 0.7; }
            .acu-view-btn:hover { opacity: 1; color: var(--acu-accent) !important; background: var(--acu-table-hover) !important; border-radius: 4px; }
            .acu-view-btn.acu-reverse-btn.active, .acu-reverse-btn[data-reversed="true"] { color: var(--acu-accent) !important; opacity: 1; }
            /* Grid 视图 (双列) */
            .acu-card-body.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; }
            /* 修复版：强制 Grid 模式使用 Flex 布局并允许高度自适应 */
.acu-card-body.view-grid .acu-card-row { display: flex; height: auto !important; min-height: fit-content; border: 1px solid var(--acu-border); border-radius: 6px; padding: 4px 6px; flex-direction: column !important; align-items: flex-start !important; background: rgba(0,0,0,0.02); box-sizing: border-box; }
            .acu-card-body.view-grid .acu-card-row.acu-grid-span-full { grid-column: 1 / -1; }
            .acu-card-body.view-grid .acu-card-label { width: 100% !important; font-size: 0.85em; opacity: 0.8; margin-bottom: 2px; }
            .acu-card-body.view-grid .acu-card-value { width: 100% !important; }

            /* List 视图 (单列 - 原版增强) */
            .acu-nav-btn.active { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); outline: none; border-color: transparent; }
            .acu-nav-btn.active:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); transform: none; }
            .acu-nav-btn.active:focus, .acu-nav-btn.active:focus-visible { outline: none; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2) !important; }
            .acu-nav-btn.has-validation-errors { border-color: rgba(231, 76, 60, 0.5); }
            .acu-nav-btn .acu-nav-warning-icon { color: #e74c3c; font-size: 10px; margin-left: 2px; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            .acu-action-btn { flex: 1; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--acu-btn-bg); border-radius: 8px; color: var(--acu-text-sub); cursor: pointer; border: 1px solid transparent; transition: all 0.2s; margin: 0; }
            .acu-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .acu-action-btn:focus, .acu-action-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--acu-accent) !important; }
            #acu-btn-save-global { color: var(--acu-btn-active-bg); } #acu-btn-save-global:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); }

            .acu-data-display { position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; max-height: 80vh; height: auto; background: var(--acu-bg-panel); border: 1px solid var(--acu-border); border-radius: 8px; box-shadow: 0 8px 30px var(--acu-shadow); display: none; flex-direction: column; z-index: 2147483642 !important; animation: popUp 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
            .acu-data-display.visible { display: flex; }
            @keyframes popUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes highlightFlash { 0%, 100% { box-shadow: none; } 50% { box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.6); } }
            .acu-highlight-flash { animation: highlightFlash 0.5s ease-in-out 3; }

            .acu-panel-header { flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: var(--acu-table-head); border-bottom: 1px dashed var(--acu-border); border-radius: 8px 8px 0 0; }
            /* 核心修改：增加了 flex: 1 和 min-width: 0，强制标题在空间不足时自动变短显示省略号 */
/* --- 新的标题布局：纵向排列 --- */
.acu-panel-title {
    display: flex;
    flex-direction: column; /* 垂直堆叠 */
    justify-content: center;
    align-items: flex-start;
    flex: 1; /* 占据剩余空间 */
    min-width: 0; /* 允许压缩 */
    margin-right: 8px;
    overflow: hidden;
}

/* 第一行：标题主体 (加粗，稍大) */
.acu-title-main {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    font-size: 13px; /* 你要求的：字体变小一点，但保持加粗 */
    font-weight: bold;
    color: var(--acu-text-main);
    line-height: 1.2;
}

/* 标题文字本身 (溢出省略) */
.acu-title-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 第二行：页码信息 (灰色，更小) */
.acu-title-sub {
    font-size: 10px;
    color: var(--acu-text-sub);
    font-weight: normal;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    line-height: 1.2;
    margin-top: 1px;
}
            /* 增加了 flex-shrink: 0; 防止被标题挤压 */
/* 核心修改：flex-shrink: 0 确保这一块区域永远不会被压缩 */
.acu-header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
            .acu-search-wrapper { position: relative; display: flex; align-items: center; }
            .acu-wrapper input.acu-search-input { background: var(--acu-btn-bg) !important; border: 1px solid var(--acu-border) !important; color: var(--acu-text-main) !important; padding: 4px 8px 4px 24px; border-radius: 12px; font-size: 12px; width: 120px; transition: width 0.2s, border-color 0.2s; }
            .acu-wrapper input.acu-search-input::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            .acu-wrapper input.acu-search-input:focus { width: 160px; outline: none !important; border-color: var(--acu-accent) !important; box-shadow: none !important; }
            .acu-search-input::placeholder { color: var(--acu-text-sub) ; opacity: 0.7; }
            .acu-search-icon { position: absolute; left: 8px; font-size: 10px; color: var(--acu-text-sub); pointer-events: none; }
            /* 增加了 min-width 和 flex-shrink: 0 */
            .acu-panel-content { flex: 1; overflow-x: auto; overflow-y: hidden; padding: 15px; background: transparent; scrollbar-width: thin; scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track); overscroll-behavior-x: contain; overscroll-behavior-y: auto; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; }
            /* 增加了 height: 100%; 让网格容器填满面板的高度 */
.acu-card-grid { display: flex; flex-wrap: nowrap; gap: 12px; align-items: flex-start; }
            .acu-layout-vertical .acu-panel-content { overflow-x: hidden !important; overflow-y: auto !important; overscroll-behavior: auto; touch-action: manipulation; min-height: 0; }
            /* 竖向布局时恢复 auto 高度 */
.acu-layout-vertical .acu-card-grid { flex-wrap: wrap !important; justify-content: center; padding-bottom: 20px; height: auto; }
.acu-wrapper:not(.acu-layout-vertical) .acu-manual-mode .acu-card-grid { height: 100%; } .acu-manual-mode .acu-data-card { max-height: 100% !important; overscroll-behavior-y: auto; } .acu-data-card { flex: 0 0 var(--acu-card-width, 260px); width: var(--acu-card-width, 260px); background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; height: auto; max-height: 60vh; overflow-y: auto; overscroll-behavior-y: auto; touch-action: manipulation; transition: all 0.2s ease; display: flex; flex-direction: column; position: relative; }
            .acu-data-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px var(--acu-shadow); border-color: var(--acu-accent); }
            .acu-data-card.pending-deletion { opacity: 0.6; border: 1px dashed #e74c3c; }
            .acu-data-card.pending-deletion::after { content: "待删除"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: #e74c3c; font-size: 24px; font-weight: bold; border: 2px solid #e74c3c; padding: 5px 10px; border-radius: 8px; opacity: 0.8; pointer-events: none; }
            @keyframes pulse-highlight { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
            .acu-highlight-manual { color: var(--acu-hl-manual) !important; background-color: var(--acu-hl-manual-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-highlight-diff { color: var(--acu-hl-diff) !important; background-color: var(--acu-hl-diff-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-editable-title.acu-highlight-manual, .acu-editable-title.acu-highlight-diff { width: auto; display: inline-block; }
            .acu-card-header { flex: 0 0 auto; padding: 8px 10px; background: var(--acu-table-head); border-bottom: 1px dashed var(--acu-border); font-weight: bold; color: var(--acu-text-main); font-size: 14px; display: flex; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 8px; min-height: 40px; height: auto !important; }
            .acu-editable-title { flex: 1; width: auto !important; cursor: pointer; border-bottom: 1px dashed transparent; transition: all 0.2s; white-space: pre-wrap !important; overflow: visible !important; word-break: break-word !important; text-align: center; line-height: 1.3; margin: 0; }
            .acu-editable-title:hover { border-bottom-color: var(--acu-accent); color: var(--acu-accent); }
            .acu-card-index { position: static !important; transform: none !important; margin: 0; flex-shrink: 0; font-size: 11px; color: var(--acu-text-sub); font-weight: normal; background: var(--acu-badge-bg); padding: 2px 6px; border-radius: 4px; }
            .acu-card-body { padding: 6px 12px; display: flex; flex-direction: column; gap: 0; font-size: var(--acu-font-size, 13px); flex: 1; }
            .acu-card-row { display: block; padding: 6px 0; border-bottom: 1px dashed var(--acu-border); cursor: pointer; overflow: hidden; }
            .acu-card-row:last-child { border-bottom: none; }
            .acu-card-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 10px; border-top: 1px dashed var(--acu-border); background: var(--acu-table-head); }
            .acu-action-item { padding: 4px 10px; font-size: 11px; border: 1px solid var(--acu-border); border-radius: 4px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.15s; white-space: nowrap; }
            .acu-action-item:hover { background: var(--acu-btn-hover); border-color: var(--acu-accent); color: var(--acu-accent); transform: translateY(-1px); }
            .acu-action-item:active { transform: translateY(0); }
            .acu-action-item.check-type { border-style: dashed; }
            .acu-action-item i { font-size: 10px; opacity: 0.7; }
            .acu-card-row:hover { background: var(--acu-table-hover); }
            .acu-card-label { float: left !important; clear: left; width: auto !important; margin-right: 8px !important; color: var(--acu-text-sub); font-size: 0.9em; line-height: 1.5; padding-top: 0; }
            .acu-hide-label .acu-card-label { display: none; }
            .acu-hide-label .acu-card-value { width: 100% !important; }
            .acu-inline-dice-btn:hover { opacity: 1 !important; transform: scale(1.2); }
            .acu-card-value { display: block; width: auto !important; margin: 0; text-align: left !important; word-break: break-all !important; white-space: pre-wrap !important; line-height: 1.5 !important; color: var(--acu-text-main); font-size: 1em; }
            .acu-tag-container { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 2px; }
            .acu-multi-attr-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
            .acu-badge { display: inline-block; padding: 1px 8px; border-radius: 12px; font-size: 0.9em; font-weight: 500; line-height: 1.2; }
            .acu-badge-green { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-neutral { background: var(--acu-badge-bg); color: var(--acu-text-main); border: 1px solid var(--acu-border); }
            .acu-panel-footer { flex: 0 0 auto; padding: 8px; border-top: 1px dashed var(--acu-border); background: var(--acu-table-head); display: flex; justify-content: center; align-items: center; gap: 5px; flex-wrap: wrap; }
            .acu-page-btn { padding: 4px 10px; min-width: 32px; height: 28px; border-radius: 4px; border: 1px solid var(--acu-border); background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
            .acu-page-btn:hover:not(.disabled):not(.active) { background: var(--acu-btn-hover); transform: translateY(-1px); }
            .acu-page-btn.active { background: var(--acu-accent); color: #fff; border-color: var(--acu-accent); font-weight: bold; }
            .acu-page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
            .acu-page-info { font-size: 12px; color: var(--acu-text-sub); margin: 0 10px; }
            /* --- [新增] 行动选项面板样式 --- */
            /* 改为 Flex Column 垂直布局 */
            /* --- [修改] 袖珍型·垂直紧凑布局 --- */
            .acu-option-panel {
                display: flex;
                flex-direction: column;
                gap: 2px;                 /* 间距极小，排列更紧密 */
                padding: 4px;             /* 容器内边距缩小 */
                background: var(--acu-bg-nav);
                border: 1px solid var(--acu-border);
                border-radius: 6px;       /* 圆角缩小 */
                margin-top: 0;
                margin-bottom: 4px;
                backdrop-filter: blur(5px);
                width: 100%;
                box-sizing: border-box;
                z-index: 2147483641;
                animation: acuFadeIn 0.3s ease;
            }

            .acu-embedded-options-container {
                width: 100%;
                max-width: 100%;
                margin-top: 6px;
                clear: both;
                animation: acuFadeIn 0.3s ease;
            }

            .acu-opt-header {
                text-align: center;
                font-size: 10px;          /* 标题字体更小 */
                font-weight: bold;
                color: var(--acu-text-sub);
                padding-bottom: 2px;
                border-bottom: 1px dashed var(--acu-border);
                margin-bottom: 2px;
            }

            /* --- [修改] 袖珍按钮样式 --- */
            .acu-opt-btn {
                background: var(--acu-btn-bg);
                border: 1px solid transparent; /* 默认无边框，更干净 */
                padding: 3px 6px;              /* 极窄内边距 */
                border-radius: 4px;
                cursor: pointer;
                color: var(--acu-text-main);
                font-size: var(--acu-opt-font-size, 12px) !important; /* [修改] 使用独立变量 */
                transition: all 0.15s;
                font-weight: normal;           /* 去除加粗 */
                text-align: left;              /* 左对齐 */
                white-space: pre-wrap;
                word-break: break-word;
                min-height: 22px;              /* 压低高度，超薄 */
                line-height: 1.3;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                opacity: 0.9;
            }

            .acu-opt-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent); /* 悬停时显示边框 */
                transform: translateX(3px);      /* 悬停时轻微右移反馈 */
                opacity: 1;
            }
            .acu-opt-btn:active { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); }
            @keyframes acuFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .acu-menu-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: transparent; z-index: 2147483645 !important; }
            /* 1. 菜单容器：背景色、边框、阴影全部跟随主题变量 */
.acu-cell-menu {
    position: fixed !important;
    background: var(--acu-menu-bg) !important;
    border: 1px solid var(--acu-border);
    box-shadow: 0 6px 20px var(--acu-shadow) !important;
    z-index: 2147483647 !important;
    border-radius: 8px;
    overflow: hidden;
    min-width: 150px;
    color: var(--acu-menu-text);
}

/* 2. 菜单项：文字颜色跟随主题 */
.acu-cell-menu-item {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    gap: 12px;
    align-items: center;
    color: var(--acu-menu-text);
    font-weight: 500;
    background: transparent;
    transition: background 0.2s;
}

/* 3. 悬停效果：使用主题定义的通用悬停色 */
.acu-cell-menu-item:hover {
    background: var(--acu-table-hover);
}

/* 4. 特殊按钮优化 */
            .acu-cell-menu-item#act-delete { color: #e74c3c; }
            .acu-cell-menu-item#act-delete:hover { background: rgba(231, 76, 60, 0.1); } /* 红色半透明背景，任何主题都适配 */
            .acu-cell-menu-item#act-close { border-top: 1px dashed var(--acu-border); color: var(--acu-text-sub); }
            .acu-edit-overlay { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75) !important; z-index: 2147483646 !important; display: flex; justify-content: center !important; align-items: center !important; backdrop-filter: blur(2px); }
            .acu-edit-dialog { background: var(--acu-bg-panel); width: 95%; max-width: 500px; max-height: 95vh; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 15px 50px rgba(0,0,0,0.6); color: var(--acu-text-main); border: 1px solid var(--acu-border); overflow: hidden; flex-shrink: 0; }
            @media (min-width: 768px) { .acu-edit-dialog { max-width: 900px; width: 90%; } .acu-edit-dialog.acu-settings-dialog { max-width: 400px; width: 400px; } }
            .acu-edit-title { margin: 0; font-size: 16px; font-weight: bold; color: var(--acu-text-main); padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
            .acu-edit-textarea { width: 100%; height: auto; padding: 12px; border: 1px solid var(--acu-border) !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 14px; line-height: 1.6; overflow-y: auto !important; }
            .acu-edit-textarea:focus { outline: none; border-color: var(--acu-accent) !important; }
            .acu-edit-textarea::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            @media (min-width: 768px) { .acu-edit-textarea { height: auto !important; font-size: 15px !important; } }
            .acu-edit-textarea:focus { outline: 1px solid #aaa; }
            .acu-dialog-btns { display: flex; justify-content: flex-end; gap: 20px; margin-top: 10px; }
            .acu-dialog-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 6px; color: var(--acu-text-sub); transition: color 0.2s; }
            .acu-dialog-btn:hover { color: var(--acu-text-main); } .acu-btn-confirm { color: var(--acu-success-text); } .acu-btn-confirm:hover { opacity: 0.8; }
            /* --- [UI Optimization] PC-First Edit Mode Styles --- */
            .acu-order-controls { grid-column: 1 / -1; order: -2; display: none; width: 100%; text-align: left; background: var(--acu-accent); color: #fff; padding: 6px 12px; margin: 0 0 8px 0; border-radius: 4px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .acu-order-controls.visible { display: flex; align-items: center; justify-content: space-between; }

            .acu-nav-container.editing-order { border: 2px solid var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-nav-container.editing-order .acu-nav-btn, .acu-nav-container.editing-order .acu-action-btn { opacity: 1 !important; cursor: grab !important; border: 1px solid var(--acu-border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .acu-nav-container.editing-order .acu-nav-btn:hover, .acu-nav-container.editing-order .acu-action-btn:hover { border-color: var(--acu-accent); transform: translateY(-1px); }

            .acu-swap-selected { background-color: var(--acu-accent) !important; color: #fff !important; border-color: var(--acu-accent); box-shadow: 0 0 0 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.2); transform: scale(1.05); z-index: 10; }
            .acu-drag-over { border: 2px dashed var(--acu-accent); opacity: 0.5; transform: scale(0.95); background: rgba(var(--acu-accent-rgb), 0.1); }

            /* --- [PC Style] Unused Pool Optimization (工具架样式) --- */
            .acu-unused-pool {
                grid-column: 1 / -1;
                display: none;
                flex-wrap: wrap;
                gap: 8px;
                background: var(--acu-table-head); /* 使用表头背景色，更融合 */
                border: 1px dashed var(--acu-border); /* 虚线框表示这是编辑区域 */
                padding: 10px 15px;
                margin: 0 0 10px 0;
                border-radius: 8px;
                justify-content: flex-start;
                align-items: center;
                min-height: 50px;
                box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
            }
            .acu-unused-pool.visible { display: flex; animation: acuFadeIn 0.2s ease-out; }

            /* PC端清晰的文字引导 */
            .acu-unused-pool::before {
                content: "备选功能池 (拖拽图标到下方启用 ↘)";
                display: flex;
                align-items: center;
                height: 32px;
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                margin-right: 15px;
                padding-right: 15px;
                border-right: 1px solid var(--acu-border);
                white-space: nowrap;
                opacity: 0.8;
            }

            .acu-actions-group { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 4px; border-top: 1px dashed var(--acu-border); padding-top: 8px; margin-top: 4px; min-height: 36px; transition: all 0.2s; }

            /* [修复] 移动端顶部布局适配：强制提升顺序 */
            .acu-pos-top .acu-actions-group { order: -1; border-top: none; border-bottom: 1px dashed var(--acu-border); margin-top: 0; margin-bottom: 6px; padding-top: 0; padding-bottom: 8px; }

            /* [修复] 编辑模式下，备选池也跟随置顶 */
            .acu-pos-top .acu-unused-pool { order: -1; margin-bottom: 10px; border-bottom: 1px dashed var(--acu-border); }
            .acu-actions-group.dragging-over { background: rgba(127, 127, 127, 0.05); box-shadow: inset 0 0 10px rgba(0,0,0,0.05); }

            /* 仪表盘横向滚动模式 */
                .acu-dash-body.acu-dash-horizontal {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 15px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 10px;
                }
                .acu-dash-body.acu-dash-horizontal > div {
                    flex: 0 0 280px;
                    min-width: 280px;
                    max-height: 60vh;
                    overflow-y: auto;
                }
                @media (min-width: 769px) {
                    .acu-dash-body.acu-dash-horizontal > div {
                        flex: 0 0 320px;
                        min-width: 320px;
                    }
                }
            /* Mobile adjustments to keep it usable there */
            @media (max-width: 768px) {
                .acu-unused-pool { justify-content: center; background: rgba(0,0,0,0.05); border: 1px dashed var(--acu-border); border-bottom: none; margin: 0 0 8px 0; border-radius: 6px; }
                .acu-unused-pool::before { display: block; width: 100%; text-align: center; margin-bottom: 4px; content: "可选功能池 (拖拽或点击)"; }
                .acu-order-controls { flex-direction: column; gap: 6px; text-align: center; }
            }
            .acu-actions-group.dragging-over { background: rgba(var(--acu-accent-rgb), 0.1); border-color: var(--acu-accent); }
            .acu-actions-group .acu-divider { display: none; }
            .acu-settings-item { margin-bottom: 15px; }
            .acu-settings-label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px; color: #ccc; }
            .acu-settings-val { float: right; color: #4cd964; font-size: 12px; }
            .acu-slider { width: 100%; height: 4px; background: #555; border-radius: 2px; outline: none; -webkit-appearance: none; }
            .acu-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
            .acu-select { width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px; outline: none; }
            .acu-edit-overlay input[type="checkbox"].acu-checkbox { margin-right: 10px; accent-color: var(--acu-accent) !important; background: transparent !important; background-color: transparent !important; }
            .acu-btn-block { width: 100%; padding: 10px; background: #444; color: #eee; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
            .acu-btn-block:hover { background: #555; color: #fff; }
            .acu-expand-trigger { background: var(--acu-bg-nav); border: 1px solid var(--acu-border); box-shadow: 0 2px 6px var(--acu-shadow); cursor: pointer; color: var(--acu-text-main); font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s; z-index: 2147483645 !important; }
            .acu-expand-trigger:hover { background: var(--acu-btn-hover); transform: translateY(-2px); }
            /* [优化] 小眼睛图标悬停效果 */
            .acu-nav-toggle-btn:hover { opacity: 1 !important; transform: translateY(-50%) scale(1.2); color: var(--acu-accent); }
            .acu-align-right { margin-left: auto; align-self: flex-end; }
            .acu-align-left { margin-right: auto; margin-left: 0; align-self: flex-start; }
            .acu-nav-container.acu-left-mode .acu-actions-group { order: -1; margin-left: 0; margin-right: 10px; }
            .acu-col-bar { width: 100%; justify-content: center; padding: 8px 10px; border-radius: 6px; }
            .acu-col-pill { width: auto !important; padding: 6px 16px; border-radius: 50px; }
            .acu-col-mini { width: 40px !important; height: 40px !important; padding: 0; justify-content: center; border-radius: 50%; }
            .acu-col-mini span { display: none; }
            #acu-btn-collapse { color: var(--acu-text-sub); }
            #acu-btn-collapse:hover { color: var(--acu-text-main); background: rgba(0,0,0,0.05); }
            @keyframes acu-breathe { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); color: #ff7e67; } 100% { opacity: 1; transform: scale(1); } } .acu-icon-breathe { animation: acu-breathe 3s infinite ease-in-out !important; display: inline-block; }

            @media (min-width: 768px) {
                .acu-wrapper.acu-mode-embedded .acu-nav-container { width: fit-content !important; min-width: 300px; max-width: 100%; margin: 0 auto; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; border: 1px solid var(--acu-border); padding: 6px 20px; background: var(--acu-bg-nav) !important; }
                .acu-wrapper.acu-mode-embedded .acu-data-display { bottom: calc(100% + 12px) !important; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important; }
                .acu-nav-container { display: flex; flex-wrap: wrap !important; gap: 6px !important; padding: 6px 10px; grid-template-columns: none !important; flex-direction: row !important; justify-content: flex-start !important; align-items: center !important; height: auto !important; }
                .acu-nav-container .acu-nav-btn { width: fit-content !important; flex: 0 0 auto !important; height: 32px !important; padding: 0 12px; font-size: 13px !important; min-width: auto !important; }
                .acu-nav-btn span { max-width: 200px; }
                .acu-action-btn { flex: 0 0 32px !important; width: 32px !important; height: 32px !important; background: transparent !important; color: var(--acu-text-sub) !important; border-radius: 6px; border: 1px solid transparent; }
                .acu-action-btn:hover { background: var(--acu-btn-hover) !important; color: var(--acu-text-main) !important; transform: scale(1.1); box-shadow: none; }
                #acu-btn-save-global { color: var(--acu-accent) !important; }
                #acu-btn-save-global:hover { background: var(--acu-accent) !important; color: #fff !important; }
                .acu-order-controls { margin: 0 0 8px 0; padding: 4px; }
                .acu-actions-group { width: auto !important; margin-left: auto !important; border-top: none !important; border-bottom: none !important; padding: 0; margin-top: 0 !important; margin-bottom: 0 !important; gap: 4px !important; background: transparent; justify-content: flex-end; order: 9999 !important; display: flex; }
                .acu-pos-top .acu-actions-group { order: -1 !important; margin-left: 0 !important; margin-right: 10px !important; justify-content: flex-start !important; }
            }
            @media (max-width: 768px) {
                .acu-panel-content { -webkit-overflow-scrolling: touch !important; overscroll-behavior-y: auto; }
                .acu-data-card { box-shadow: none !important; border: 1px solid var(--acu-border); transform: translateZ(0); }
                .acu-data-card:hover { transform: none !important; box-shadow: none !important; }
                .acu-nav-btn:hover { transform: none !important; }
            }
            /* === 移动端投骰面板适配 === */
            @media (max-width: 768px) {
                .acu-dice-panel, .acu-contest-panel {
                    position: fixed !important;
                    top: 5% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 92vw !important;
                    max-width: 400px !important;
                    max-height: 88vh !important;
                    overflow-y: auto !important;
                }
                .acu-dice-panel > div:last-child, .acu-contest-panel > div:last-child {
                    max-height: none !important;
                    overflow-y: visible !important;
                }
                .acu-dice-overlay, .acu-contest-overlay {
                    align-items: flex-start !important;
                    padding-top: 5vh !important;
                }
            }
                /* === 仪表盘新增样式：可展开地点列表 === */
                .acu-dash-body {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr 1fr;
                    gap: 15px;
                    margin: 15px 0;
                }

                .acu-dash-locations {
                    background: var(--acu-card-bg);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--acu-border);
                }

                .acu-dash-locations h3 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .acu-location-group {
                    margin-bottom: 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: var(--acu-card-bg);
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }

                .acu-location-group.expanded {
                    border-color: var(--acu-accent);
                }

                .acu-location-header {
                    padding: 8px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--acu-table-head);
                    transition: all 0.2s;
                    user-select: none;
                }

                .acu-location-header:hover {
                    background: var(--acu-table-hover);
                }

                .acu-expand-icon {
                    font-size: 10px;
                    transition: transform 0.2s;
                    color: var(--acu-text-sub);
                }

                .acu-location-group.expanded .acu-expand-icon {
                    transform: rotate(90deg);
                    color: var(--acu-accent);
                }

                .acu-region-name {
                    flex: 1;
                    font-weight: bold;
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-location-count {
                    font-size: 11px;
                    color: var(--acu-text-sub);
                }

                .acu-location-list {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .acu-location-group.expanded .acu-location-list {
                    max-height: 500px;
                }

                .acu-location-item {
                    padding: 6px 10px 6px 26px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    border-bottom: 1px dashed rgba(0,0,0,0.05);
                    transition: all 0.15s;
                }

                .acu-location-item:last-child {
                    border-bottom: none;
                }

                .acu-location-item:hover {
                    background: var(--acu-table-hover);
                    transform: translateX(4px);
                }

                .acu-location-item.current {
                    background: var(--acu-hl-diff-bg);
                    font-weight: bold;
                    color: var(--acu-hl-diff);
                }

                .acu-location-item i {
                    font-size: 10px;
                    opacity: 0.6;
                }

                .acu-current-badge {
                    margin-left: auto;
                    font-size: 10px;
                    padding: 2px 6px;
                    background: var(--acu-btn-active-bg);
                    color: var(--acu-btn-active-text);
                    border-radius: 3px;
                    font-weight: bold;
                }
                /* === 仪表盘核心样式（补充） === */
                .acu-dash-context {
                    background: linear-gradient(135deg, var(--acu-table-head), var(--acu-bg-panel));
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    border: 1px solid var(--acu-border);
                }

                .acu-dash-location {
                    font-size: 18px;
                    font-weight: bold;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .acu-dash-location-desc {
                    font-size: 13px;
                    color: var(--acu-text-sub);
                    margin-top: 6px;
                    line-height: 1.5;
                }

                .acu-dash-player, .acu-dash-intel {
                    background: var(--acu-card-bg);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--acu-border);
                }

                .acu-dash-player h3, .acu-dash-intel h3 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .acu-player-status {
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-task-item {
                    padding: 8px;
                    margin-bottom: 6px;
                    background: rgba(0,0,0,0.03);
                    border-radius: 6px;
                    border-left: 3px solid var(--acu-border);
                }

                .acu-task-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--acu-text-main);
                }

                .acu-empty-hint {
                    font-size: 12px;
                    color: var(--acu-text-sub);
                    text-align: center;
                    padding: 15px;
                    opacity: 0.7;
                }
                /* 审核面板空状态居中 */
                .acu-changes-content .acu-empty-hint {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                }

                .acu-dashboard-content {
                    padding: 15px;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    touch-action: pan-y !important;
                    overscroll-behavior-y: contain;
                    max-height: calc(80vh - 60px);
                }

                /* === 仪表盘交互按钮优化 === */
                h3.acu-dash-table-link,
                h4.acu-dash-table-link {
                    cursor: pointer;
                    transition: all 0.15s;
                    padding: 2px 4px;
                    margin: -2px -4px;
                    border-radius: 4px;
                }
                h3.acu-dash-table-link:hover,
                h4.acu-dash-table-link:hover {
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘操作图标 - 统一放大+增加点击热区 */
                .acu-dash-dice-btn,
                .acu-dash-goto-btn,
                .acu-dash-use-item-btn,
                .acu-dash-use-skill-btn,
                .acu-dash-track-task-btn,
                .acu-dash-msg-btn,
                .acu-dash-contest-btn,
                .acu-dash-dice-free,
                .acu-dash-relation-graph-btn,
                .acu-dash-avatar-manager-btn {
                    cursor: pointer;
                    color: var(--acu-text-sub);
                    opacity: 0.5;
                    font-size: 14px !important;
                    padding: 6px;
                    margin: -4px;
                    border-radius: 4px;
                    transition: all 0.15s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 28px;
                    min-height: 28px;
                }
                .acu-dash-dice-btn:hover,
                .acu-dash-goto-btn:hover,
                .acu-dash-use-item-btn:hover,
                .acu-dash-use-skill-btn:hover,
                .acu-dash-track-task-btn:hover,
                .acu-dash-msg-btn:hover,
                .acu-dash-contest-btn:hover,
                .acu-dash-dice-free:hover {
                    opacity: 1;
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                    transform: scale(1.1);
                }

                /* 仪表盘可点击项 - 增强反馈 */
                .acu-dash-clickable {
                    cursor: pointer;
                    transition: all 0.15s;
                    border-radius: 4px;
                }
                .acu-dash-clickable:hover {
                    background: var(--acu-table-hover);
                }
                .acu-dash-clickable:active {
                    transform: scale(0.98);
                }

                @media (max-width: 768px) {
                    .acu-dash-body {
                        grid-template-columns: 1fr;
                        max-height: none;
                        overflow: visible;
                    }

                    .acu-dashboard-content {
                        max-height: calc(75vh - 50px) !important;
                        padding-bottom: 20px !important;
                    }

                    /* 移动端进一步放大操作按钮 */
                    .acu-dash-dice-btn,
                    .acu-dash-goto-btn,
                    .acu-dash-use-item-btn,
                    .acu-dash-use-skill-btn,
                    .acu-dash-track-task-btn,
                    .acu-dash-msg-btn,
                    .acu-dash-contest-btn,
                    .acu-dash-dice-free {
                        font-size: 16px !important;
                        padding: 8px;
                        min-width: 36px;
                        min-height: 36px;
                    }
                }
            /* === 仪表盘预览卡片样式 === */
            .acu-preview-overlay {
                z-index: 2147483650;
                backdrop-filter: blur(3px);
                animation: acuFadeIn 0.2s ease;
            }

            .acu-preview-card {
                background: var(--acu-card-bg);
                width: 90%;
                max-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                animation: acuFadeIn 0.25s ease;
            }
                .acu-preview-overlay .acu-data-card {
                    width: 90vw;
                    max-width: 400px;
                    flex: none;
                }
                @media (min-width: 768px) {
                    .acu-preview-card,
                    .acu-preview-overlay .acu-data-card {
                        max-width: 550px;
                    }
                }
            .acu-preview-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .acu-preview-close:hover {
                background: rgba(231, 76, 60, 0.1);
                color: #e74c3c;
            }

            .acu-preview-body {
                padding: 15px;
            }

            .acu-preview-row {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px dashed var(--acu-border);
            }

            .acu-preview-row:last-child {
                border-bottom: none;
            }

            .acu-preview-label {
                flex: 0 0 80px;
                color: var(--acu-text-sub);
                font-size: 12px;
            }

            .acu-preview-value {
                flex: 1;
                color: var(--acu-text-main);
                font-size: 13px;
                word-break: break-word;
            }

            .acu-dash-clickable {
                cursor: pointer;
                transition: all 0.15s;
            }

            .acu-dash-clickable:hover {
                background: var(--acu-table-hover);
            }
            .acu-current-location span {
                color: var(--acu-accent);
                font-weight: 600;
            }
            .acu-current-location i {
                color: var(--acu-accent);
            }
            /* === 自定义下拉菜单样式 === */
            .acu-dropdown-wrapper { position: relative; width: 100%; }
            .acu-dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                max-height: 150px;
                overflow-y: auto;
                border: 1px solid;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 2147483649;
                display: none;
            }
            .acu-dropdown-list.visible { display: block; }
            .acu-dropdown-item {
                padding: 6px 10px;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                background: transparent;
                transition: background 0.1s;
            }
            .acu-dropdown-empty {
                padding: 8px 10px;
                font-size: 12px;
                text-align: center;
                opacity: 0.7;
            }
            /* === 输入框清除按钮样式 === */
            .acu-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
            .acu-input-wrapper input { padding-right: 24px !important; }
            .acu-clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: transparent !important; border: none; font-size: 12px; cursor: pointer; padding: 4px; line-height: 1; opacity: 0.5; transition: opacity 0.2s; z-index: 5; }
            .acu-clear-btn:hover { background: transparent !important; opacity: 1 !important; }

            /* ========== 人物关系图样式 ========== */
            .acu-relation-graph-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 2147483650;
                backdrop-filter: blur(4px);
            }
            .acu-relation-graph-container {
                width: 95%;
                max-width: 900px;
                height: 85vh;
                max-height: 700px;
            }
            .acu-graph-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-graph-actions {
                display: flex;
                gap: 8px;
            }
            .acu-graph-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-graph-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-graph-canvas-wrapper {
                flex: 1;
                overflow: hidden;
                position: relative;
                min-height: 0;
            }
            .acu-graph-svg {
                width: 100%;
                height: 100%;
                cursor: grab;
            }
            .acu-graph-svg:active { cursor: grabbing; }
            .acu-graph-edge {
                stroke: var(--acu-border);
                stroke-width: 2;
                opacity: 0.6;
            }
            .acu-graph-edge-label {
                font-size: 11px;
                fill: var(--acu-text-sub);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-graph-node { cursor: grab; }
            .acu-graph-node:active { cursor: grabbing; }
            .acu-node-bg {
                fill: var(--acu-btn-bg);
                stroke: var(--acu-border);
                stroke-width: 2;
                transition: all 0.2s;
            }
            .acu-node-bg.player {
                fill: var(--acu-accent);
                stroke: var(--acu-btn-active-text);
            }
            .acu-graph-node:hover .acu-node-bg {
                stroke-width: 3;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            .acu-graph-svg.highlighting .acu-graph-node {
                opacity: 0.2;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label {
                opacity: 0.1;
                transition: opacity 0.2s ease;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted {
                opacity: 1;
            }
            .acu-graph-svg.highlighting .acu-graph-edge.highlighted {
                opacity: 1;
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label.highlighted {
                opacity: 1;
                fill: var(--acu-accent);
                font-weight: bold;
            }
            .acu-node-char {
                font-size: 16px;
                font-weight: bold;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-bg.player + text.acu-node-char,
            .acu-node-bg.player ~ text.acu-node-char {
                fill: var(--acu-btn-active-text);
            }
            .acu-node-label {
                font-size: 12px;
                fill: var(--acu-text-main);
                text-anchor: middle;
                pointer-events: none;
            }
            .acu-node-inscene-indicator {
                fill: var(--acu-accent);
                stroke: var(--acu-bg-panel);
                stroke-width: 2;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
            }
            .acu-graph-legend {
                display: flex;
                gap: 16px;
                justify-content: center;
                padding: 10px;
                border-top: 1px solid var(--acu-border);
                font-size: 12px;
                color: var(--acu-text-sub);
                flex-shrink: 0;
            }
            .acu-graph-legend span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-zoom-display {
                background: var(--acu-btn-bg);
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: bold;
                color: var(--acu-accent);
                min-width: 45px;
                text-align: center;
            }
            @media (max-width: 768px) {
                .acu-relation-graph-container {
                    width: 100%;
                    height: 80vh;
                    max-height: none;
                    border-radius: 12px;
                }
            }

            /* ========== 头像管理弹窗样式 ========== */
            .acu-avatar-manager-overlay {
                background: rgba(0,0,0,0.7);
                z-index: 2147483655;
            }
            .acu-avatar-manager {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
            }
            .acu-avatar-title {
                font-size: 15px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-avatar-list {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                min-height: 0;
            }
            .acu-avatar-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 10px;
                border-bottom: 1px dashed var(--acu-border);
            }
            .acu-avatar-item:last-child { border-bottom: none; }
            .acu-avatar-preview {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: var(--acu-btn-bg);
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--acu-border);
                flex-shrink: 0;
                position: relative;
                cursor: pointer;
            }
            .acu-avatar-preview span {
                font-size: 18px;
                font-weight: bold;
                color: var(--acu-text-sub);
            }
            .acu-avatar-camera-hint {
                position: absolute;
                bottom: 2px;
                right: 2px;
                font-size: 12px;
                color: var(--acu-text-sub);
                opacity: 0.5;
                pointer-events: none;
            }
            .acu-avatar-preview:hover .acu-avatar-camera-hint {
                opacity: 0.8;
                color: var(--acu-accent);
            }
            .acu-avatar-info {
                flex: 1;
                min-width: 0;
            }
            .acu-avatar-name {
                font-size: 13px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-avatar-name-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                margin-bottom: 6px;
            }
            .acu-avatar-manager-overlay input.acu-avatar-url,
            .acu-avatar-manager-overlay input.acu-avatar-aliases {
                width: 100%;
                padding: 6px 8px;
                font-size: 12px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-main) !important;
                box-sizing: border-box;
                -webkit-appearance: none;
                appearance: none;
            }
            .acu-avatar-manager-overlay input.acu-avatar-url:focus,
            .acu-avatar-manager-overlay input.acu-avatar-aliases:focus {
                outline: none;
                border-color: var(--acu-accent);
                box-shadow: none !important;
            }
            /* 头像输入行（URL + 上传按钮） */
            .acu-avatar-input-row {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .acu-avatar-input-row .acu-avatar-url {
                flex: 1;
                min-width: 0;
            }
            .acu-avatar-upload-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                cursor: pointer;
                flex-shrink: 0;
                transition: all 0.15s;
            }
            .acu-avatar-upload-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
            }
            .acu-avatar-upload-btn:active {
                transform: scale(0.95);
            }
            /* 头像来源标签 */
            .acu-avatar-source {
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 9px;
                padding: 1px 6px;
                border-radius: 8px;
                font-weight: bold;
                white-space: nowrap;
            }
            .acu-avatar-preview-wrap {
                position: relative;
                flex-shrink: 0;
            }
            .acu-source-local,
            .acu-source-url,
            .acu-source-auto {
                background: var(--acu-badge-bg);
                color: var(--acu-text-sub);
            }
            .acu-avatar-manager-overlay input.acu-avatar-aliases {
                padding: 4px 8px;
                font-size: 11px;
                margin-top: 4px;
            }
            .acu-avatar-manager-overlay input::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7;
            }
            .acu-avatar-actions {
                display: flex;
                flex-direction: row;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-avatar-manager-overlay .acu-avatar-actions button {
                width: 32px;
                height: 32px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-avatar-manager-overlay .acu-avatar-actions button:hover {
                background: var(--acu-btn-hover) !important;
                color: var(--acu-accent) !important;
            }
            .acu-avatar-save-btn:hover { color: #27ae60 !important; }
            .acu-avatar-clear-btn:hover { color: #e74c3c !important; }
            .acu-avatar-import-btn,
            .acu-avatar-export-btn {
                width: 28px;
                height: 28px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s;
            }
            .acu-avatar-import-btn:hover,
            .acu-avatar-export-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-avatar-crop-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 6px;
                font-size: 11px;
                color: var(--acu-text-sub);
            }
            .acu-avatar-crop-row.hidden { display: none; }
            .acu-avatar-manager-overlay .acu-avatar-scale {
                flex: 1;
                height: 6px !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                outline: none;
                border: none;
                margin: 0 8px;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-webkit-slider-runnable-track {
                height: 6px !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                border: none;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 16px !important;
                height: 16px !important;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer !important;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
                margin-top: -5px !important;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-moz-range-track {
                height: 6px !important;
                background: var(--acu-border) !important;
                border-radius: 3px;
                border: none;
            }
            .acu-avatar-manager-overlay .acu-avatar-scale::-moz-range-thumb {
                width: 16px !important;
                height: 16px !important;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                border: 2px solid var(--acu-bg-panel);
                cursor: pointer !important;
            }
            @media (max-width: 768px) {
                .acu-avatar-manager {
                    width: 95%;
                    max-height: 85vh;
                }
            }

            /* ========== 导入确认弹窗样式 ========== */
            .acu-import-confirm-overlay {
                z-index: 2147483660;
            }
            .acu-import-confirm-dialog {
                width: 90%;
                max-width: 320px;
            }
            .acu-import-confirm-body {
                padding: 16px;
            }
            .acu-import-stats {
                display: flex;
                justify-content: space-around;
                margin-bottom: 16px;
            }
            .acu-import-stat {
                text-align: center;
            }
            .acu-stat-num {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-stat-label {
                font-size: 11px;
                color: var(--acu-text-sub);
            }
            .acu-stat-new .acu-stat-num { color: var(--acu-success-text); }
            .acu-stat-conflict .acu-stat-num { color: #e67e22; }
            .acu-import-conflict-section {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-import-conflict-options {
                margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .acu-import-radio {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 13px;
                color: var(--acu-text-main);
            }
            .acu-import-radio input {
                accent-color: var(--acu-accent);
            }
            .acu-import-confirm-footer {
                display: flex;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-import-cancel-btn,
            .acu-import-confirm-btn {
                flex: 1;
                padding: 10px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-import-cancel-btn {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                color: var(--acu-text-main);
            }
            .acu-import-cancel-btn:hover {
                background: var(--acu-btn-hover);
            }
            .acu-import-confirm-btn {
                background: var(--acu-accent);
                border: none;
                color: #fff;
            }
            .acu-import-confirm-btn:hover {
                opacity: 0.9;
            }
            /* ========== 头像导入/导出相关样式 ========== */
            .acu-avatar-import-btn,
            .acu-avatar-export-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
            }

            /* ========== 统一骰子设置面板样式 ========== */
            .acu-dice-config-dialog {
                width: 320px;
                max-width: 92vw;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.4);
                overflow: hidden;
            }
            .acu-dice-cfg-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 14px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-dice-cfg-header .acu-config-close {
                background: none;
                border: none;
                color: var(--acu-text-sub);
                cursor: pointer;
                font-size: 14px;
                padding: 4px;
            }
            .acu-dice-cfg-header .acu-config-close:hover {
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-body {
                padding: 12px;
            }
            .acu-dice-cfg-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 10px;
            }
            .acu-dice-cfg-row.acu-cfg-full-row {
                grid-template-columns: 1fr;
            }
            .acu-dice-cfg-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .acu-dice-cfg-item label {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: 500;
            }
            .acu-dice-cfg-item input,
            .acu-dice-cfg-item select {
                width: 100%;
                padding: 7px 8px;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border);
                border-radius: 5px;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                text-align: center;
                box-sizing: border-box;
            }
            .acu-dice-cfg-item input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }
            .acu-dice-cfg-item select option {
                background: var(--acu-bg-panel);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-item input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }
            .acu-dice-cfg-item select {
                text-align: left;
                cursor: pointer;
            }
            .acu-dice-cfg-item select option {
                background: var(--acu-bg-panel);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-item input:focus,
            .acu-dice-cfg-item select:focus {
                outline: none;
                border-color: var(--acu-accent);
            }
            .acu-cfg-hint {
                font-size: 9px;
                color: var(--acu-text-sub);
                opacity: 0.7;
                text-align: center;
            }
            .acu-dice-cfg-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
                padding-top: 10px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-dice-cfg-actions button {
                flex: 1;
                padding: 9px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
            }
            .acu-dice-cfg-actions button:hover {
                background: var(--acu-btn-hover);
            }
            .acu-dice-cfg-actions button.primary {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: #fff;
            }
            .acu-dice-cfg-actions button.primary:hover {
                opacity: 0.9;
            }
            /* ========== 新版设置面板样式 ========== */
            .acu-settings-dialog {
                width: 380px;
                max-width: 380px;
                max-height: 85vh;
                padding: 0;
                gap: 0;
            }
            @media (max-width: 768px) {
                .acu-settings-dialog {
                    width: 92vw;
                    max-width: 92vw;
                    max-height: 85vh;
                }
                .acu-settings-body {
                    max-height: calc(85vh - 110px);
                    -webkit-overflow-scrolling: touch;
                }
                .acu-table-manager-list {
                    max-height: 40vh;
                    -webkit-overflow-scrolling: touch;
                }
            }
            .acu-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 16px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-settings-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-settings-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 8px;
                -webkit-overflow-scrolling: touch;
            }
            .acu-settings-group {
                background: var(--acu-card-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 8px;
            }
            .acu-settings-group-title {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 14px;
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: var(--acu-table-head);
                cursor: pointer;
                user-select: none;
                transition: background 0.15s;
            }
            .acu-settings-group-title:hover {
                background: var(--acu-table-hover);
            }
            .acu-group-chevron {
                font-size: 10px;
                color: var(--acu-text-sub);
                width: 12px;
                transition: transform 0.2s;
            }
            .acu-settings-group-body {
                padding: 4px 12px 8px;
            }
            .acu-settings-group.collapsed .acu-settings-group-body {
                display: none;
            }
            .acu-settings-group-body.acu-animating {
                display: block !important;
                overflow: hidden;
            }
            .acu-settings-group:last-child {
                margin-bottom: 0;
            }
            .acu-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px dashed var(--acu-border);
                gap: 12px;
                min-height: 44px;
            }
            .acu-setting-row:last-child {
                border-bottom: none;
            }
            .acu-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px dashed var(--acu-border);
                gap: 12px;
            }
            .acu-setting-row:last-child {
                border-bottom: none;
            }
            .acu-setting-row-slider {
                flex-direction: column;
                align-items: stretch;
            }
            .acu-setting-info {
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
                min-width: 0;
            }
            .acu-setting-label {
                font-size: 13px;
                color: var(--acu-text-main);
            }
            .acu-setting-hint {
                font-size: 10px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-setting-value {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-accent);
                margin-left: auto;
            }
            .acu-setting-select {
                padding: 6px 10px;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 12px;
                min-width: 120px;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 8px center;
                padding-right: 28px;
            }
            .acu-setting-select:focus {
                outline: none;
                border-color: var(--acu-accent) !important;
            }
            .acu-setting-select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-select-short {
                min-width: 80px;
            }
            .acu-setting-slider {
                width: 100%;
                height: 6px;
                margin-top: 8px;
                -webkit-appearance: none;
                appearance: none;
                background: var(--acu-border) !important;
                border-radius: 3px;
                outline: none;
                border: none;
            }
            .acu-setting-slider::-webkit-slider-runnable-track {
                height: 6px;
                background: var(--acu-border);
                border-radius: 3px;
            }
            .acu-setting-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                margin-top: -6px;
            }
            .acu-setting-slider::-moz-range-track {
                height: 6px;
                background: var(--acu-border);
                border-radius: 3px;
                border: none;
            }
            .acu-setting-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: var(--acu-accent) !important;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            }
            .acu-setting-slider:focus {
                outline: none;
            }
            .acu-setting-mini-btn {
                width: 28px;
                height: 28px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                flex-shrink: 0;
                transition: all 0.15s;
            }
            .acu-setting-mini-btn:hover, .acu-setting-mini-btn.active {
                background: var(--acu-accent);
                color: #fff;
                border-color: var(--acu-accent);
            }

            /* ========== 属性预设管理面板样式 ========== */
            .acu-preset-item {
                padding: 12px;
                background: var(--acu-card-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                transition: all 0.2s;
            }
            .acu-preset-item:hover {
                background: var(--acu-table-hover);
                border-color: var(--acu-accent);
            }
            .acu-preset-item.active {
                border-color: var(--acu-accent);
                background: var(--acu-table-hover);
            }
            .acu-preset-info {
                flex: 1;
            }
            .acu-preset-name {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-preset-desc {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 4px;
            }
            .acu-preset-stats {
                font-size: 10px;
                color: var(--acu-text-sub);
            }
            .acu-preset-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
                align-items: center;
            }
            .acu-preset-btn {
                width: 32px;
                height: 32px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                transition: all 0.15s;
            }
            .acu-preset-btn:hover {
                background: var(--acu-accent);
                color: #fff;
                border-color: var(--acu-accent);
            }
            .acu-preset-btn.acu-preset-delete:hover {
                background: rgba(231, 76, 60, 0.2);
                color: #e74c3c;
                border-color: #e74c3c;
            }
            /* 预设编辑器输入框样式（防止被主题覆盖） */
            .acu-preset-editor-input,
            .acu-preset-editor-textarea {
                background: var(--acu-input-bg) !important;
                color: var(--acu-text-main) !important;
                border: 1px solid var(--acu-border) !important;
            }
            .acu-preset-editor-input:focus,
            .acu-preset-editor-textarea:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px rgba(var(--acu-accent-rgb, 100, 150, 200), 0.2) !important;
            }
            .acu-preset-editor-textarea {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            }
            /* Toggle 开关 */
            .acu-toggle {
                position: relative;
                width: 44px;
                height: 24px;
                flex-shrink: 0;
            }
            .acu-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .acu-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background: var(--acu-border);
                border-radius: 24px;
                transition: all 0.2s;
            }
            .acu-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: var(--acu-bg-panel);
                border-radius: 50%;
                transition: all 0.2s;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .acu-toggle input:checked + .acu-toggle-slider {
                background: var(--acu-accent);
            }
            .acu-toggle input:checked + .acu-toggle-slider:before {
                transform: translateX(20px);
            }
            .acu-setting-action-btn {
                width: 100%;
                padding: 10px 14px;
                margin-bottom: 6px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.15s;
            }
            /* Stepper 步进器 */
            .acu-stepper {
                display: flex;
                align-items: center;
                border: 1.5px solid var(--acu-accent);
                border-radius: 6px;
                overflow: hidden;
                background: transparent !important;
                flex-shrink: 0;
            }
            .acu-stepper-btn {
                width: 36px;
                height: 34px;
                border: none !important;
                background: transparent !important;
                background-color: transparent !important;
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-stepper-btn:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-accent);
            }
            .acu-stepper-btn:active {
                transform: scale(0.95);
                background: var(--acu-accent) !important;
                color: #fff;
            }
            .acu-stepper-value {
                min-width: 60px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: transparent !important;
                border-left: 1px solid var(--acu-accent);
                border-right: 1px solid var(--acu-accent);
            }
            /* ========== 变更审核面板样式 ========== */
            .acu-changes-content {
                padding: 10px;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                overscroll-behavior-y: contain;
            }
            /* ========== 验证错误消息样式 ========== */
            .acu-validation-error-msg {
                font-size: 11px;
                color: var(--acu-text-sub);
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            /* 数据验证模式提示 - 固定在面板顶部，不参与横向滚动 */
            .acu-validation-mode-hint {
                padding: 8px 12px;
                font-size: 12px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                border-radius: 6px;
                margin: 0 0 10px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            /* 审核面板横向滚动模式 */
            .acu-changes-content.acu-changes-horizontal {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                align-items: flex-start !important;
                gap: 12px;
                overflow-x: auto !important;
                overflow-y: visible !important;
                touch-action: pan-x pan-y !important;
                padding-bottom: 5px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-x: contain;
                overscroll-behavior-y: auto;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-list {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                gap: 12px;
                align-items: flex-start;
                min-width: max-content;
            }
            .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                flex: 0 0 280px;
                min-width: 280px;
                max-width: 280px;
                max-height: none;
                overflow-y: visible;
                -webkit-overflow-scrolling: auto;
                overscroll-behavior-y: auto;
            }
            @media (min-width: 769px) {
                .acu-changes-content.acu-changes-horizontal .acu-changes-group {
                    flex: 0 0 320px;
                    min-width: 320px;
                    max-width: 320px;
                }
            }
            .acu-changes-list { display: flex; flex-direction: column; gap: 10px; }
            .acu-changes-group { background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; overflow: hidden; }
            .acu-changes-group-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--acu-table-head); font-weight: bold; font-size: 13px; color: var(--acu-text-main); }
            .acu-changes-count { margin-left: auto; background: var(--acu-accent); color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
            .acu-changes-group-body { padding: 6px; display: flex; flex-direction: column; gap: 4px; }
            .acu-change-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 6px; font-size: 12px; background: rgba(0,0,0,0.02); flex-wrap: wrap; transition: all 0.15s; }
            .acu-change-item:hover { background: var(--acu-table-hover); }
            .acu-change-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; flex-shrink: 0; }
            .acu-badge-added { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-deleted { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); }
            .acu-badge-modified { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); }
            .acu-change-title { color: var(--acu-text-main); font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-field { color: var(--acu-text-sub); font-size: 11px; flex-shrink: 0; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .acu-change-diff { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; overflow: hidden; }
            .acu-diff-old { color: var(--acu-hl-manual); text-decoration: line-through; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            .acu-diff-arrow { color: var(--acu-text-sub); flex-shrink: 0; }
            .acu-diff-new { color: var(--acu-success-text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
            /* 变更操作按钮 */
            .acu-change-actions { display: flex; gap: 4px; margin-left: auto; flex-shrink: 0; }
            .acu-change-action-btn { width: 24px; height: 24px; border: 1px solid var(--acu-border); border-radius: 4px; background: var(--acu-btn-bg); color: var(--acu-text-sub); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: all 0.15s; padding: 0; }
            .acu-change-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); transform: scale(1.1); }
            .acu-action-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-action-reject:hover, .acu-action-restore:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-action-edit:hover { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); border-color: var(--acu-hl-diff); }
            /* 批量操作按钮 - 增强深色主题下的对比度 */
            .acu-changes-batch-btn { width: 32px; height: 32px; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 6px; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.15s; }
            .acu-changes-batch-btn:hover { background: rgba(255,255,255,0.2); color: #fff; border-color: rgba(255,255,255,0.6); }
            .acu-batch-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-batch-reject:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-simple-mode-toggle.active { background: var(--acu-accent); color: #fff; border-color: var(--acu-accent); }
            .acu-simple-mode-toggle:hover { background: var(--acu-accent); color: #fff; border-color: var(--acu-accent); }
            /* 浅色主题适配 */
            .acu-theme-light .acu-changes-batch-btn { border-color: rgba(0,0,0,0.3); background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.7); }
            .acu-theme-light .acu-changes-batch-btn:hover { background: rgba(0,0,0,0.1); color: rgba(0,0,0,0.9); border-color: rgba(0,0,0,0.5); }
            .acu-changes-group.collapsed .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group:not(.collapsed) .acu-collapse-icon { transform: rotate(0deg); }
            .acu-changes-group-header:hover { background: var(--acu-table-hover); }
            /* 变更对比编辑弹窗样式 */
            .acu-diff-section { margin-bottom: 12px; }
            .acu-diff-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
            .acu-diff-readonly { padding: 10px 12px; background: var(--acu-table-head); border: 1px dashed var(--acu-border); border-radius: 6px; color: var(--acu-text-main); font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; max-height: 150px; overflow-y: auto; opacity: 0.8; }
            .acu-diff-arrow-down { text-align: center; color: var(--acu-text-sub); font-size: 14px; margin: 8px 0; opacity: 0.5; }
            /* 可编辑区域高亮样式 */
            .acu-diff-new-section { padding: 12px; background: var(--acu-input-bg); border: 2px solid var(--acu-accent); border-radius: 6px; box-shadow: 0 0 0 3px rgba(127, 127, 255, 0.1); }
            .acu-diff-new-section .acu-diff-label { color: var(--acu-accent); font-weight: 600; }
            .acu-diff-new-section textarea,
            .acu-diff-new-section input { background: var(--acu-input-bg) !important; border-color: var(--acu-border) !important; }
            .acu-diff-new-section textarea:focus,
            .acu-diff-new-section input:focus { border-color: var(--acu-accent) !important; box-shadow: 0 0 0 2px rgba(127, 127, 255, 0.15); }
            /* 单字段编辑弹窗按钮优化 */
            .acu-edit-dialog .acu-dialog-btns {
                display: flex;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                margin: 0 -16px -16px -16px;
                border-radius: 0 0 12px 12px;
            }
            .acu-edit-dialog .acu-dialog-btn {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                white-space: nowrap;
                transition: all 0.15s;
            }
            .acu-edit-dialog .acu-dialog-btn:hover {
                background: var(--acu-btn-hover);
            }
            .acu-edit-dialog .acu-btn-confirm {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: #fff;
            }
            .acu-edit-dialog .acu-btn-confirm:hover {
                opacity: 0.9;
            }
            @media (max-width: 768px) {
                .acu-edit-dialog .acu-dialog-btns {
                    flex-wrap: nowrap;
                }
                .acu-edit-dialog .acu-dialog-btn {
                    padding: 10px 8px;
                    font-size: 12px;
                    min-width: 0;
                }
                .acu-edit-dialog .acu-dialog-btn i {
                    font-size: 11px;
                }
            }
            @media (max-width: 768px) {
                .acu-change-item { padding: 8px 6px; }
                .acu-change-diff { flex-basis: 100%; margin-top: 4px; order: 10; }
                .acu-change-actions { order: 5; }
                .acu-diff-old, .acu-diff-new { max-width: 100px; }
                .acu-change-action-btn { width: 28px; height: 28px; }
            }
            .acu-change-field-count { font-size: 11px; color: var(--acu-text-sub); margin-left: 4px; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            /* 多字段整体编辑弹窗样式 */
            .acu-row-edit-field { margin-bottom: 12px; padding: 10px; background: var(--acu-table-head); border-radius: 6px; border: 1px solid transparent; }
            .acu-row-edit-field.acu-field-changed { border-color: var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-row-edit-label { font-size: 12px; font-weight: bold; color: var(--acu-text-sub); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
            .acu-changed-badge { font-size: 10px; padding: 1px 6px; background: var(--acu-accent); color: #fff; border-radius: 3px; font-weight: normal; }
            .acu-row-edit-old { font-size: 12px; color: var(--acu-text-sub); padding: 6px 8px; background: var(--acu-table-head); border-radius: 4px; margin-bottom: 6px; text-decoration: line-through; opacity: 0.7; white-space: pre-wrap; word-break: break-word; }
            .acu-row-edit-input { width: 100%; min-height: 36px; max-height: 200px; padding: 8px; resize: none; }
            .acu-empty-val { opacity: 0.5; font-style: italic; }
            /* ========== 表格管理列表样式 ========== */
            .acu-table-manager-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: 300px;
                overflow-y: auto;
                padding: 4px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-y: contain;
                touch-action: pan-y;
            }
            .acu-table-manager-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                background: transparent;
                border: 1.5px solid var(--acu-accent);
                border-radius: 6px;
                cursor: default;
                transition: all 0.15s;
                user-select: none;
                touch-action: pan-y;
            }
            .acu-table-manager-item:hover {
                background: var(--acu-table-hover);
            }
            .acu-table-manager-item.hidden-table {
                opacity: 0.5;
                border-color: var(--acu-border);
                border-style: dashed;
            }
            .acu-table-manager-item.hidden-table .acu-table-item-name {
                text-decoration: line-through;
            }
            .acu-table-item-check {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--acu-accent);
                border-radius: 4px;
                transition: all 0.15s;
            }
            .acu-table-item-check:hover {
                background: var(--acu-table-hover);
                transform: scale(1.1);
            }
            .acu-table-manager-item.hidden-table .acu-table-item-check {
                color: var(--acu-text-sub);
            }
            .acu-table-item-icon {
                width: 20px;
                text-align: center;
                color: var(--acu-text-sub);
                font-size: 12px;
            }
            .acu-table-item-name {
                flex: 1;
                font-size: 13px;
                color: var(--acu-text-main);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-table-item-handle {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-sub);
                cursor: grab;
                opacity: 0.4;
                transition: all 0.15s;
                border-radius: 4px;
            }
            .acu-table-item-handle:hover {
                opacity: 1;
                background: var(--acu-table-hover);
                color: var(--acu-accent);
            }
            .acu-table-manager-item.acu-dragging {
                opacity: 0.9;
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 100;
            }
            .acu-table-manager-item.acu-dragging .acu-table-item-name,
            .acu-table-manager-item.acu-dragging .acu-table-item-check,
            .acu-table-manager-item.acu-dragging .acu-table-item-icon,
            .acu-table-manager-item.acu-dragging .acu-table-item-handle {
                color: #fff;
            }
            .acu-table-manager-item.acu-drag-above {
                border-top: 2px solid var(--acu-accent);
                margin-top: -1px;
            }
            .acu-table-manager-item.acu-drag-below {
                border-bottom: 2px solid var(--acu-accent);
                margin-bottom: -1px;
            }
            @media (max-width: 768px) {
                .acu-table-item-handle {
                    opacity: 0.6;
                }
            }
            /* 特殊按钮样式（投骰/审核/变量） */
            .acu-table-manager-item.acu-special-item {
                background: linear-gradient(135deg, rgba(var(--acu-accent-rgb, 128, 128, 128), 0.08), transparent);
                border-style: dashed;
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-icon {
                color: var(--acu-accent);
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-name {
                font-weight: 500;
            }
            /* ========== 数据验证规则样式 ========== */
            .acu-validation-rules-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-height: 280px;
                overflow-y: auto;
                padding: 2px;
            }
            .acu-validation-rule-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                background: transparent;
                border: 1.5px solid var(--acu-accent);
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            .acu-validation-rule-item.disabled {
                opacity: 0.5;
            }
            .acu-validation-rule-item:hover {
                border-color: var(--acu-accent);
            }
            .acu-rule-toggle {
                cursor: pointer;
                font-size: 18px;
                color: var(--acu-text-sub);
                transition: color 0.2s;
                flex-shrink: 0;
            }
            .acu-rule-toggle.active {
                color: var(--acu-accent);
            }
            .acu-rule-toggle:hover {
                opacity: 0.8;
            }
            .acu-rule-info {
                flex: 1;
                min-width: 0;
            }
            .acu-rule-name {
                font-size: 12px;
                font-weight: 500;
                color: var(--acu-text-main);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-rule-target {
                font-size: 10px;
                color: var(--acu-text-sub);
                margin-top: 2px;
            }
            .acu-rule-type-icon {
                width: 20px;
                font-size: 12px;
                color: var(--acu-text-sub);
                flex-shrink: 0;
                text-align: center;
            }
            .acu-rule-delete {
                background: none;
                border: none;
                color: var(--acu-text-sub);
                cursor: pointer;
                padding: 4px;
                opacity: 0.6;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .acu-rule-delete:hover {
                color: #e74c3c;
                opacity: 1;
            }
            .acu-rule-intercept {
                cursor: pointer;
                font-size: 14px;
                color: var(--acu-text-sub);
                padding: 4px 6px;
                border-radius: 4px;
                opacity: 0.5;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .acu-rule-intercept:hover {
                opacity: 0.8;
                background: var(--acu-hover-bg);
            }
            .acu-rule-intercept.active {
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-add-rule-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                width: 100%;
                padding: 10px;
                margin-top: 8px;
                background: var(--acu-btn-bg);
                border: 1px dashed var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-add-rule-btn:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
            }
            /* 验证规则弹窗 */
            .acu-validation-modal-overlay {
                z-index: 2147483659;
            }
            .acu-validation-modal {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 90%;
                max-width: 420px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            .acu-validation-modal-body {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 60vh;
                overflow-y: auto;
            }
            .acu-validation-modal-body .acu-setting-row {
                flex-wrap: wrap;
            }
            .acu-validation-modal-body .acu-panel-input,
            .acu-validation-modal input[type="text"],
            .acu-validation-modal input[type="number"],
            .acu-validation-modal select {
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                padding: 8px 10px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                box-shadow: none !important;
                -webkit-appearance: none !important;
            }
            .acu-validation-modal-body .acu-panel-input:focus,
            .acu-validation-modal input[type="text"]:focus,
            .acu-validation-modal input[type="number"]:focus,
            .acu-validation-modal select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
            }
            .acu-rule-config-section {
                padding: 8px 0;
            }
            .acu-validation-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 12px 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            /* 智能修改弹窗样式 */
            .acu-smart-fix-meta {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 4px 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                flex-wrap: wrap !important;
            }
            .acu-smart-fix-separator {
                color: var(--acu-border) !important;
                opacity: 0.5 !important;
            }
            .acu-smart-fix-diff {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                padding: 6px 0 !important;
                margin: 4px 0 !important;
                flex-wrap: wrap !important;
            }
            .acu-smart-fix-diff-old-text {
                color: var(--acu-hl-manual) !important;
                text-decoration: line-through !important;
                opacity: 0.7 !important;
                font-size: 13px !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                max-width: 150px !important;
            }
            .acu-smart-fix-diff-arrow {
                color: var(--acu-text-sub) !important;
                flex-shrink: 0 !important;
            }
            .acu-smart-fix-empty {
                opacity: 0.5 !important;
                font-style: italic !important;
            }
            .acu-smart-fix-diff-input-wrapper {
                flex: 1 !important;
                min-width: 120px !important;
            }
            .acu-smart-fix-diff-input-wrapper input,
            .acu-smart-fix-diff-input-wrapper select {
                width: 100% !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                color: var(--acu-text-main) !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                box-shadow: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                min-height: 26px !important;
                line-height: 1.3 !important;
            }
            .acu-smart-fix-diff-input-wrapper input:focus,
            .acu-smart-fix-diff-input-wrapper select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
            }
            .acu-smart-fix-diff-input-wrapper select {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23666' d='M5 7L1 3h8z'/%3E%3C/svg%3E") !important;
                background-repeat: no-repeat !important;
                background-position: right 6px center !important;
                padding-right: 24px !important;
            }
            .acu-smart-fix-diff-input-wrapper select option {
                background: var(--acu-card-bg) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-smart-fix-suggest {
                padding: 10px !important;
                background: var(--acu-card-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                margin-top: 8px !important;
            }
            .acu-smart-fix-suggest-label {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                margin-bottom: 6px !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
            }
            .acu-smart-fix-suggest-label i {
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-suggest-value {
                font-size: 13px !important;
                color: var(--acu-success-text) !important;
                font-weight: 500 !important;
                padding: 6px 8px !important;
                background: var(--acu-success-bg) !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-suggest-value:hover {
                background: var(--acu-success-text) !important;
                color: white !important;
            }
            .acu-smart-fix-suggest-options {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 6px !important;
            }
            .acu-smart-fix-suggest-options-scroll {
                max-height: 120px !important;
                overflow-y: auto !important;
                padding-right: 4px !important;
            }
            .acu-smart-fix-option {
                display: inline-block !important;
                font-size: 12px !important;
                padding: 4px 10px !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-option:hover {
                background: var(--acu-btn-hover) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-option-current {
                background: var(--acu-hl-manual-bg) !important;
                border-color: var(--acu-hl-manual) !important;
                color: var(--acu-hl-manual) !important;
                text-decoration: line-through !important;
                opacity: 0.7 !important;
            }
            .acu-smart-fix-error-hint {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 8px !important;
                background: var(--acu-card-bg) !important;
                border-radius: 4px !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
            }
            .acu-smart-fix-error-hint i {
                color: var(--acu-accent) !important;
                flex-shrink: 0 !important;
            }
            @media (max-width: 600px) {
                .acu-smart-fix-diff {
                    flex-direction: column !important;
                    align-items: stretch !important;
                }
                .acu-smart-fix-diff-arrow {
                    transform: rotate(90deg) !important;
                }
            }
            .acu-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid transparent;
            }
            .acu-btn-secondary {
                background: var(--acu-btn-bg);
                border-color: var(--acu-border);
                color: var(--acu-text-main);
            }
            .acu-btn-secondary:hover {
                background: var(--acu-btn-hover);
            }
            .acu-btn-primary {
                background: var(--acu-accent);
                color: white;
            }
            .acu-btn-primary:hover {
                opacity: 0.9;
            }
            /* 智能修改弹窗新增样式 */
            .acu-smart-fix-rule-info {
                padding: 10px 12px !important;
                background: var(--acu-table-head) !important;
                border: 1px solid var(--acu-border) !important;
                border-left: 3px solid var(--acu-accent) !important;
                border-radius: 4px !important;
                margin-bottom: 12px !important;
            }
            .acu-smart-fix-rule-header {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                color: var(--acu-text-main) !important;
                margin-bottom: 4px !important;
            }
            .acu-smart-fix-rule-header i {
                color: var(--acu-accent) !important;
            }
            .acu-smart-fix-rule-desc {
                font-size: 12px !important;
                color: var(--acu-text-sub) !important;
                line-height: 1.4 !important;
            }
            .acu-smart-fix-suggest-section {
                margin-top: 12px !important;
            }
            .acu-smart-fix-suggest code {
                background: var(--acu-table-head) !important;
                padding: 2px 6px !important;
                border-radius: 3px !important;
                font-size: 11px !important;
                color: var(--acu-text-main) !important;
            }
            .acu-smart-fix-quick-btn {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 6px 12px !important;
                background: var(--acu-success-bg) !important;
                color: var(--acu-success-text) !important;
                border: 1px solid var(--acu-success-text) !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-quick-btn:hover {
                background: var(--acu-success-text) !important;
                color: white !important;
            }
            .acu-smart-fix-table-summary {
                padding: 12px !important;
                background: var(--acu-card-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
            }
            .acu-smart-fix-stat {
                font-size: 13px !important;
                color: var(--acu-text-main) !important;
                margin-bottom: 8px !important;
            }
            .acu-smart-fix-stat strong {
                color: var(--acu-hl-manual) !important;
            }
            .acu-smart-fix-change-list {
                max-height: 150px !important;
                overflow-y: auto !important;
                margin-top: 8px !important;
            }
            .acu-smart-fix-change-item {
                font-size: 11px !important;
                color: var(--acu-text-sub) !important;
                padding: 4px 8px !important;
                background: var(--acu-table-head) !important;
                border-radius: 3px !important;
                margin-bottom: 4px !important;
            }
            .acu-smart-fix-hint {
                font-size: 12px !important;
                color: var(--acu-text-sub) !important;
                padding: 8px !important;
                background: var(--acu-table-head) !important;
                border-radius: 4px !important;
                margin-top: 8px !important;
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
            }
            .acu-smart-fix-hint i {
                color: var(--acu-accent) !important;
            }
            /* ========== 头像裁剪弹窗样式 ========== */
            .acu-crop-modal-overlay {
                z-index: 2147483658;
            }
            .acu-crop-modal {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 90%;
                max-width: 360px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            .acu-crop-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-crop-close {
                background: none;
                border: none;
                color: var(--acu-text-sub);
                font-size: 16px;
                cursor: pointer;
                padding: 4px;
            }
            .acu-crop-close:hover {
                color: var(--acu-text-main);
            }
            .acu-crop-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }
            .acu-crop-container {
                position: relative;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                overflow: hidden;
                touch-action: none;
                user-select: none;
            }
            .acu-crop-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                cursor: grab;
            }
            .acu-crop-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 3px solid var(--acu-accent);
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 0 1000px rgba(0,0,0,0.3);
            }
            .acu-crop-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-crop-footer {
                display: flex;
                gap: 10px;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-top: 1px solid var(--acu-border);
            }
            .acu-crop-btn {
                flex: 1;
                padding: 10px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-crop-cancel {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                color: var(--acu-text-main);
            }
            .acu-crop-cancel:hover {
                background: var(--acu-btn-hover);
            }
            .acu-crop-confirm {
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                color: #fff;
            }
            .acu-crop-confirm:hover {
                opacity: 0.9;
            }
            .acu-crop-reupload {
                flex: 0 0 auto;
                padding: 10px 14px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-crop-reupload:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
    </style>
    `;
    $('head').append(styles);
  };

  const getTableData = () => {
    const api = getCore().getDB();
    return api && api.exportTableAsJson ? api.exportTableAsJson() : null;
  };

  const saveDataToDatabase = async (tableData, skipRender = false, commitDeletes = false) => {
    if (isSaving) return; // 简单的防重入
    isSaving = true;
    const { $ } = getCore();
    const $saveBtn = $('#acu-btn-save-global');

    // UI 反馈
    if (!skipRender && $saveBtn.length) {
      $saveBtn.find('i').removeClass('fa-save').addClass('fa-spinner fa-spin');
      $saveBtn.prop('disabled', true);
    }

    try {
      // 1. 简单浅拷贝，只取 sheet_ 开头的数据 (白名单机制 = 不卡顿)
      const dataToSave = {};
      // 补全 mate 防止校验报错
      if (!tableData.mate) dataToSave.mate = { type: 'chatSheets', version: 1 };
      else dataToSave.mate = tableData.mate;

      Object.keys(tableData).forEach(k => {
        if (k.startsWith('sheet_')) {
          dataToSave[k] = tableData[k];
        }
      });

      // 2. 处理删除 (如果有)
      if (commitDeletes) {
        const deletions = getPendingDeletions();
        Object.keys(deletions).forEach(key => {
          if (dataToSave[key] && dataToSave[key].content) {
            deletions[key]
              .sort((a, b) => b - a)
              .forEach(idx => {
                if (dataToSave[key].content[idx + 1]) dataToSave[key].content.splice(idx + 1, 1);
              });
          }
        });
        savePendingDeletions({});
      }

      // 3. 直接调用 API 保存 (无中间商赚差价)
      const api = getCore().getDB();
      if (api && api.importTableAsJson) {
        await api.importTableAsJson(JSON.stringify(dataToSave));
      }

      // 4. 更新本地状态
      cachedRawData = dataToSave;
      saveSnapshot(dataToSave);
      hasUnsavedChanges = false;
      currentDiffMap = new Set();
      if (window.acuModifiedSet) window.acuModifiedSet.clear();

      if (!skipRender) {
        renderInterface();
      }
    } catch (e) {
      console.error('Save error:', e);
      if (window.toastr) window.toastr.error('保存出错');
    } finally {
      isSaving = false;
      if (!skipRender && $saveBtn.length) {
        $saveBtn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-save');
        $saveBtn.prop('disabled', false);
      }
    }
  };

  // [新增] 轻量级保存：只保存数据到数据库，不更新快照
  const saveDataOnly = async tableData => {
    try {
      const dataToSave = {};
      if (!tableData.mate) dataToSave.mate = { type: 'chatSheets', version: 1 };
      else dataToSave.mate = tableData.mate;

      Object.keys(tableData).forEach(k => {
        if (k.startsWith('sheet_')) {
          dataToSave[k] = tableData[k];
        }
      });

      const api = getCore().getDB();
      if (api && api.importTableAsJson) {
        await api.importTableAsJson(JSON.stringify(dataToSave));
      }

      cachedRawData = dataToSave;
      // 注意：不调用 saveSnapshot()，不更新 hasUnsavedChanges
    } catch (e) {
      console.error('[ACU] saveDataOnly error:', e);
    }
  };
  const processJsonData = json => {
    const tables = {};
    if (!json || typeof json !== 'object') return tables;
    for (const sheetId in json) {
      if (json[sheetId]?.name) {
        const sheet = json[sheetId];
        tables[sheet.name] = {
          key: sheetId,
          headers: sheet.content ? sheet.content[0] || [] : [],
          rows: sheet.content ? sheet.content.slice(1) : [],
          rawContent: sheet.content || [],
          exportConfig: sheet.exportConfig || {},
          updateConfig: sheet.updateConfig || {},
          ...sheet,
        };
      }
    }
    return tables;
  };

  // ========================================
  // 智能修改辅助函数
  // ========================================

  // 格式验证智能推算
  function suggestFormatValue(pattern, rowIndex, existingValues = []) {
    if (!pattern || rowIndex === undefined || rowIndex < 0) return null;

    try {
      // 识别 "前缀+数字" 模式，如 ^AM\d{3}$
      // pattern 在 JavaScript 字符串中是 '^AM\\d{3}$'，实际内容是 '^AM\d{3}$'
      // 在正则匹配时，要匹配字面量 \d{3}，需要用 /\\d\{3\}/（转义后的反斜杠+d，转义后的花括号）
      // 匹配格式：^?[字母]+\d\{数字\}$?
      const prefixMatch = pattern.match(/^\^?([A-Za-z]+)\\d\{(\d+)\}\$?$/);

      if (prefixMatch) {
        const prefix = prefixMatch[1]; // "AM"
        const digits = parseInt(prefixMatch[2], 10); // 3
        const nextNum = String(rowIndex + 1).padStart(digits, '0'); // rowIndex是0-based，+1后补零
        return prefix + nextNum; // "AM001"
      }

      // 尝试识别其他常见模式，如 \d{3} 单独出现（仅数字）
      const numOnlyMatch = pattern.match(/^\^?\\d\{(\d+)\}\$?$/);
      if (numOnlyMatch) {
        const digits = parseInt(numOnlyMatch[1], 10);
        return String(rowIndex + 1).padStart(digits, '0');
      }
    } catch (e) {
      console.error('[ACU] 格式推算失败:', e);
    }

    return null; // 无法推算，显示空输入框
  }

  // 关联验证下拉选项提取（支持多列 OR 合并）
  function getRelationOptions(refTable, refColumns, rawData) {
    const options = new Set();
    if (!refTable || !refColumns || !rawData) return Array.from(options);

    const columns = Array.isArray(refColumns) ? refColumns : [refColumns];

    // 查找引用表
    for (const sheetId in rawData) {
      if (rawData[sheetId]?.name === refTable) {
        const headers = rawData[sheetId].content?.[0] || [];
        const rows = rawData[sheetId].content?.slice(1) || [];

        // 遍历所有指定的列
        columns.forEach(col => {
          const colIdx = headers.indexOf(col);
          if (colIdx >= 0) {
            rows.forEach(row => {
              const value = row?.[colIdx];
              if (value !== null && value !== undefined && String(value).trim() !== '') {
                options.add(String(value).trim());
              }
            });
          }
        });

        break; // 找到表后跳出
      }
    }

    return Array.from(options).sort();
  }

  // 获取同列其他行的示例值（用于 required 规则）
  function getColumnExamples(tableName, columnName, currentRowIndex, rawData, maxCount = 5) {
    const examples = new Set();
    if (!tableName || !columnName || !rawData) return [];

    for (const sheetId in rawData) {
      if (rawData[sheetId]?.name === tableName) {
        const headers = rawData[sheetId].content?.[0] || [];
        const rows = rawData[sheetId].content?.slice(1) || [];
        const colIdx = headers.indexOf(columnName);

        if (colIdx >= 0) {
          rows.forEach((row, idx) => {
            if (idx !== currentRowIndex) {
              const value = row?.[colIdx];
              if (value !== null && value !== undefined && String(value).trim() !== '') {
                examples.add(String(value).trim());
              }
            }
          });
        }
        break;
      }
    }

    return Array.from(examples).slice(0, maxCount);
  }

  // 获取数值的最近有效值
  function getNearestValidNumber(currentValue, min, max) {
    const num = parseFloat(currentValue);
    if (isNaN(num)) return min !== undefined ? min : 0;
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
  }

  // ========================================
  // 添加自定义验证规则弹窗
  // ========================================
  const showAddValidationRuleModal = parentDialog => {
    const { $ } = getCore();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;

    // 获取所有表名
    const rawData = cachedRawData || getTableData();
    const tables = processJsonData(rawData || {});
    const tableNames = Object.keys(tables);

    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal ${currentThemeClass}">
          <div class="acu-settings-header">
            <div class="acu-settings-title"><i class="fa-solid fa-plus"></i> 添加验证规则</div>
            <button class="acu-close-btn" id="dlg-rule-close"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="acu-validation-modal-body">
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则名称</span></div>
              <input type="text" id="rule-name" class="acu-panel-input" placeholder="如：物品数量限制" style="flex:1;">
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">目标表格</span></div>
              <select id="rule-table" class="acu-setting-select">
                <option value="">请选择...</option>
                ${tableNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
              </select>
            </div>
            <div class="acu-setting-row" id="row-column">
              <div class="acu-setting-info"><span class="acu-setting-label">目标列</span></div>
              <select id="rule-column" class="acu-setting-select" disabled>
                <option value="">请先选择表格...</option>
              </select>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则类型</span></div>
              <select id="rule-type" class="acu-setting-select">
                <optgroup label="── 表级规则 ──">
                  <option value="tableReadonly">表级只读（禁止修改）</option>
                  <option value="rowLimit">行数限制</option>
                </optgroup>
                <optgroup label="── 字段级规则 ──">
                  <option value="required">必填</option>
                  <option value="format">格式验证（正则）</option>
                  <option value="enum">枚举验证（可选值）</option>
                  <option value="numeric">数值范围</option>
                  <option value="relation">关联验证（引用其他表）</option>
                </optgroup>
              </select>
            </div>
            <!-- 表级只读无需配置 -->
            <div class="acu-rule-config-section" id="config-tableReadonly">
              <div style="font-size:11px;color:var(--acu-text-sub);padding:8px;background:var(--acu-card-bg);border-radius:4px;">
                <i class="fa-solid fa-info-circle"></i> 启用后，该表将不允许任何修改（需开启更新拦截）
              </div>
            </div>
            <!-- 行数限制配置 -->
            <div class="acu-rule-config-section" id="config-rowLimit" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">最少行数</span></div>
                <input type="number" id="cfg-row-min" class="acu-panel-input" placeholder="0" style="width:80px;">
                <div class="acu-setting-info" style="margin-left:16px;"><span class="acu-setting-label">最多行数</span></div>
                <input type="number" id="cfg-row-max" class="acu-panel-input" placeholder="不限" style="width:80px;">
              </div>
            </div>
            <!-- 必填无需配置 -->
            <div class="acu-rule-config-section" id="config-required" style="display:none;">
              <div style="font-size:11px;color:var(--acu-text-sub);padding:8px;background:var(--acu-card-bg);border-radius:4px;">
                <i class="fa-solid fa-info-circle"></i> 该字段不能为空
              </div>
            </div>
            <!-- 格式验证配置 -->
            <div class="acu-rule-config-section" id="config-format" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">正则表达式</span></div>
                <input type="text" id="cfg-pattern" class="acu-panel-input" placeholder="如：^AM\\d{3}$" style="flex:1;">
              </div>
            </div>
            <!-- 枚举验证配置 -->
            <div class="acu-rule-config-section" id="config-enum" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">允许的值</span></div>
                <input type="text" id="cfg-values" class="acu-panel-input" placeholder="用逗号分隔，如：进行中,已完成,已失败" style="flex:1;">
              </div>
            </div>
            <!-- 数值范围配置 -->
            <div class="acu-rule-config-section" id="config-numeric" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">最小值</span></div>
                <input type="number" id="cfg-min" class="acu-panel-input" placeholder="0" style="width:80px;">
                <div class="acu-setting-info" style="margin-left:16px;"><span class="acu-setting-label">最大值</span></div>
                <input type="number" id="cfg-max" class="acu-panel-input" placeholder="100" style="width:80px;">
              </div>
            </div>
            <!-- 关联验证配置 -->
            <div class="acu-rule-config-section" id="config-relation" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">关联表格</span></div>
                <select id="cfg-ref-table" class="acu-setting-select">
                  <option value="">请选择...</option>
                  ${tableNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
                </select>
              </div>
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">关联列</span></div>
                <select id="cfg-ref-column" class="acu-setting-select" multiple style="flex:1;min-height:80px;">
                  <option value="">请先选择关联表格...</option>
                </select>
              </div>
              <div style="font-size:11px;color:var(--acu-text-sub);padding:8px;background:var(--acu-card-bg);border-radius:4px;margin-top:8px;">
                <i class="fa-solid fa-info-circle"></i> 可选择多列，任一列匹配即通过验证（OR 逻辑）。使用 Ctrl/Cmd 键可选择多个列。
              </div>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">错误提示</span></div>
              <input type="text" id="rule-error-msg" class="acu-panel-input" placeholder="验证失败时显示的提示信息" style="flex:1;">
            </div>
          </div>
          <div class="acu-validation-modal-footer">
            <button class="acu-btn acu-btn-secondary" id="dlg-rule-cancel">取消</button>
            <button class="acu-btn acu-btn-primary" id="dlg-rule-save">添加</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 表格选择变化时更新列选项
    dialog.find('#rule-table').on('change', function () {
      const tableName = $(this).val();
      const $colSelect = dialog.find('#rule-column');

      if (!tableName || !tables[tableName]) {
        $colSelect.html('<option value="">请先选择表格...</option>').prop('disabled', true);
        return;
      }

      const headers = tables[tableName].headers || [];
      const options = headers
        .filter((h, i) => i > 0 && h) // 跳过索引列
        .map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`)
        .join('');

      $colSelect.html('<option value="">请选择...</option>' + options).prop('disabled', false);
    });

    // 关联表格选择变化时更新关联列选项
    dialog.find('#cfg-ref-table').on('change', function () {
      const refTableName = $(this).val();
      const $refColSelect = dialog.find('#cfg-ref-column');

      if (!refTableName || !tables[refTableName]) {
        $refColSelect.html('<option value="">请先选择关联表格...</option>').prop('disabled', true);
        return;
      }

      const headers = tables[refTableName].headers || [];
      const options = headers
        .filter((h, i) => i > 0 && h) // 跳过索引列
        .map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`)
        .join('');

      $refColSelect.html(options).prop('disabled', false);
    });

    // 规则类型变化时切换配置区域和目标列显示
    dialog.find('#rule-type').on('change', function () {
      const type = $(this).val();
      const typeInfo = RULE_TYPE_INFO[type];
      const isTableRule = typeInfo?.scope === 'table';

      // 切换配置区域
      dialog.find('.acu-rule-config-section').hide();
      dialog.find('#config-' + type).show();

      // 表级规则隐藏目标列选择
      if (isTableRule) {
        dialog.find('#row-column').hide();
        dialog.find('#rule-column').val('').prop('disabled', true);
      } else {
        dialog.find('#row-column').show();
        // 如果已选择表格，启用列选择
        if (dialog.find('#rule-table').val()) {
          dialog.find('#rule-column').prop('disabled', false);
        }
      }
    });

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#dlg-rule-close, #dlg-rule-cancel', closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-validation-modal-overlay')) closeDialog();
    });

    // 保存
    dialog.find('#dlg-rule-save').on('click', function () {
      const name = dialog.find('#rule-name').val()?.trim();
      const targetTable = dialog.find('#rule-table').val();
      const targetColumn = dialog.find('#rule-column').val();
      const ruleType = dialog.find('#rule-type').val();
      const errorMessage = dialog.find('#rule-error-msg').val()?.trim();
      const typeInfo = RULE_TYPE_INFO[ruleType];
      const isTableRule = typeInfo?.scope === 'table';

      // 验证必填项
      if (!name) {
        if (window.toastr) window.toastr.warning('请输入规则名称');
        return;
      }
      if (!targetTable) {
        if (window.toastr) window.toastr.warning('请选择目标表格');
        return;
      }
      // 字段级规则必须选择目标列
      if (!isTableRule && !targetColumn) {
        if (window.toastr) window.toastr.warning('请选择目标列');
        return;
      }

      // 构建配置
      const ruleConfig = {};
      if (ruleType === 'tableReadonly') {
        // 无需配置
      } else if (ruleType === 'rowLimit') {
        const min = dialog.find('#cfg-row-min').val();
        const max = dialog.find('#cfg-row-max').val();
        if (min !== '') ruleConfig.min = parseInt(min, 10);
        if (max !== '') ruleConfig.max = parseInt(max, 10);
      } else if (ruleType === 'required') {
        // 无需配置
      } else if (ruleType === 'format') {
        const pattern = dialog.find('#cfg-pattern').val()?.trim();
        if (!pattern) {
          if (window.toastr) window.toastr.warning('请输入正则表达式');
          return;
        }
        // 验证正则表达式有效性
        try {
          new RegExp(pattern);
        } catch (e) {
          if (window.toastr) window.toastr.error('正则表达式无效');
          return;
        }
        ruleConfig.pattern = pattern;
      } else if (ruleType === 'enum') {
        const valuesStr = dialog.find('#cfg-values').val()?.trim();
        if (!valuesStr) {
          if (window.toastr) window.toastr.warning('请输入允许的值');
          return;
        }
        ruleConfig.values = valuesStr
          .split(',')
          .map(v => v.trim())
          .filter(v => v);
      } else if (ruleType === 'numeric') {
        const min = dialog.find('#cfg-min').val();
        const max = dialog.find('#cfg-max').val();
        if (min !== '') ruleConfig.min = parseFloat(min);
        if (max !== '') ruleConfig.max = parseFloat(max);
      } else if (ruleType === 'relation') {
        const refTable = dialog.find('#cfg-ref-table').val();
        const refColumns = dialog.find('#cfg-ref-column').val(); // 多选时返回数组

        if (!refTable) {
          if (window.toastr) window.toastr.warning('请选择关联表格');
          return;
        }

        const selectedColumns = Array.isArray(refColumns) ? refColumns : refColumns ? [refColumns] : [];
        if (selectedColumns.length === 0 || (selectedColumns.length === 1 && !selectedColumns[0])) {
          if (window.toastr) window.toastr.warning('请至少选择一列作为关联列');
          return;
        }

        ruleConfig.refTable = refTable;
        // 如果只有一列，保存为字符串；如果多列，保存为数组
        ruleConfig.refColumn = selectedColumns.length === 1 ? selectedColumns[0] : selectedColumns;
      }

      // 生成规则 ID
      const ruleId = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      // 添加规则（新建规则默认不启用拦截）
      const newRule = {
        id: ruleId,
        name: name,
        description: '',
        targetTable: targetTable,
        targetColumn: isTableRule ? '' : targetColumn, // 表级规则不需要 targetColumn
        ruleType: ruleType,
        config: ruleConfig,
        errorMessage: errorMessage || typeInfo?.desc || '数据验证失败',
        intercept: false, // 新建规则默认不启用拦截
      };

      if (ValidationRuleManager.addCustomRule(newRule)) {
        closeDialog();

        // 刷新规则列表
        const $rulesList = parentDialog.find('#validation-rules-list');
        const ruleHtml = `
          <div class="acu-validation-rule-item" data-rule-id="${escapeHtml(ruleId)}">
            <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo?.name || ruleType)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo?.icon || 'fa-question'}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${escapeHtml(name)}</div>
              <div class="acu-rule-target">${escapeHtml(targetTable)}${isTableRule ? ' (整表)' : '.' + escapeHtml(targetColumn)}</div>
            </div>
            <div class="acu-rule-intercept" data-rule-id="${escapeHtml(ruleId)}" title="点击启用拦截（违反时回滚）"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="acu-rule-toggle active" title="点击切换启用/禁用">
              <i class="fa-solid fa-toggle-on"></i>
            </div>
            <button class="acu-rule-delete" data-rule-id="${escapeHtml(ruleId)}" title="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;
        $rulesList.append(ruleHtml);
        // 事件由父级事件委托处理，无需单独绑定
      } else {
        if (window.toastr) window.toastr.error('规则添加失败');
      }
    });
  };

  // ========================================
  // 智能修改弹窗
  // ========================================
  const showSmartFixModal = error => {
    if (!error || !error.rule) {
      if (window.toastr) window.toastr.warning('无法获取规则信息');
      return;
    }

    const { $ } = getCore();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const rule = error.rule;
    const ruleType = error.ruleType || rule.ruleType;
    const typeInfo = RULE_TYPE_INFO[ruleType] || { name: ruleType, icon: 'fa-question' };
    const isTableRule = typeInfo?.scope === 'table';

    // 获取原始数据和快照
    const rawData = cachedRawData || getTableData();
    const snapshot = loadSnapshot();

    // 获取快照值（用于字段级规则）
    let snapshotValue = '';
    if (!isTableRule && snapshot && error.tableName && error.columnName !== undefined) {
      for (const sheetId in snapshot) {
        if (snapshot[sheetId]?.name === error.tableName) {
          const headers = snapshot[sheetId].content?.[0] || [];
          const colIdx = headers.indexOf(error.columnName);
          const rowIdx = error.rowIndex + 1;
          if (colIdx >= 0 && snapshot[sheetId].content?.[rowIdx]) {
            snapshotValue = snapshot[sheetId].content[rowIdx][colIdx] ?? '';
          }
          break;
        }
      }
    }

    const hasSnapshotValue = snapshotValue !== '' && String(snapshotValue) !== String(error.currentValue || '');

    // ========================================
    // 表级规则特殊处理
    // ========================================
    if (isTableRule) {
      showTableRuleFixModal(error, rule, ruleType, rawData, snapshot, currentThemeClass);
      return;
    }

    // ========================================
    // 字段级规则处理
    // ========================================

    // 根据规则类型生成不同的修改UI
    let inputHtml = '';

    if (ruleType === 'enum' && rule.config?.values) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'relation' && rule.config?.refTable && rule.config?.refColumn) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'numeric') {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'format' && rule.config?.pattern) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else {
      // 必填或其他
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    }

    // 生成智能修复建议内容
    let smartSuggestHtml = '';

    if (ruleType === 'required') {
      // 必填验证：显示同列示例值
      const examples = getColumnExamples(error.tableName, error.columnName, error.rowIndex, rawData, 5);
      if (examples.length > 0) {
        smartSuggestHtml = `
          <div class="acu-smart-fix-suggest">
            <div class="acu-smart-fix-suggest-label">
              <i class="fa-solid fa-lightbulb"></i> 同列示例值:
            </div>
            <div class="acu-smart-fix-suggest-options">
              ${examples
                .map(
                  val => `
                <span class="acu-smart-fix-option" data-value="${escapeHtml(val)}" title="点击填充">
                  ${escapeHtml(val.length > 20 ? val.substring(0, 20) + '...' : val)}
                </span>
              `,
                )
                .join('')}
            </div>
          </div>
        `;
      }
    } else if (ruleType === 'enum' && rule.config?.values) {
      // 枚举验证：显示所有可用选项
      const validValues = rule.config.values;
      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-list"></i> 允许的值 (点击选择):
          </div>
          <div class="acu-smart-fix-suggest-options acu-smart-fix-suggest-options-scroll">
            ${validValues
              .map(
                val => `
              <span class="acu-smart-fix-option ${error.currentValue === val ? 'acu-smart-fix-option-current' : ''}"
                    data-value="${escapeHtml(val)}" title="${error.currentValue === val ? '当前值（无效）' : '点击选择'}">
                ${escapeHtml(val)}
              </span>
            `,
              )
              .join('')}
          </div>
        </div>
      `;
    } else if (ruleType === 'format' && rule.config?.pattern) {
      // 格式验证：显示格式说明和推荐值
      const suggestedValue = suggestFormatValue(rule.config.pattern, error.rowIndex);
      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-font"></i> 格式要求: <code>${escapeHtml(rule.config.pattern)}</code>
          </div>
          ${
            suggestedValue
              ? `
            <div style="margin-top:8px;">
              <span class="acu-smart-fix-suggest-label" style="margin-bottom:4px;display:block;">
                <i class="fa-solid fa-lightbulb"></i> 推荐值:
              </span>
              <span class="acu-smart-fix-quick-btn" data-value="${escapeHtml(suggestedValue)}">
                <i class="fa-solid fa-magic"></i> ${escapeHtml(suggestedValue)}
              </span>
            </div>
          `
              : ''
          }
        </div>
      `;
    } else if (ruleType === 'numeric') {
      // 数值范围验证：显示范围和快速修正按钮
      const min = rule.config?.min;
      const max = rule.config?.max;
      const currentNum = parseFloat(error.currentValue);
      const isOutOfRange =
        !isNaN(currentNum) && ((min !== undefined && currentNum < min) || (max !== undefined && currentNum > max));
      const nearestValid = isOutOfRange ? getNearestValidNumber(error.currentValue, min, max) : null;

      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-hashtag"></i> 允许范围: ${min !== undefined ? min : '-∞'} ~ ${max !== undefined ? max : '+∞'}
          </div>
          ${
            isOutOfRange && nearestValid !== null
              ? `
            <div style="margin-top:8px;">
              <span class="acu-smart-fix-quick-btn" data-value="${nearestValid}">
                <i class="fa-solid fa-arrow-right"></i> 修正为 ${nearestValid}
              </span>
            </div>
          `
              : ''
          }
        </div>
      `;
    } else if (ruleType === 'relation' && rule.config?.refTable && rule.config?.refColumn) {
      // 关联验证：显示可用值列表（带搜索）
      const options = getRelationOptions(rule.config.refTable, rule.config.refColumn, rawData);
      if (options.length > 0) {
        smartSuggestHtml = `
          <div class="acu-smart-fix-suggest">
            <div class="acu-smart-fix-suggest-label">
              <i class="fa-solid fa-link"></i> 关联表 "${escapeHtml(rule.config.refTable)}" 可用值 (${options.length}项):
            </div>
            <div class="acu-smart-fix-suggest-options acu-smart-fix-suggest-options-scroll" id="smart-fix-options-container">
              ${options
                .map(
                  val => `
                <span class="acu-smart-fix-option ${error.currentValue === val ? 'acu-smart-fix-option-current' : ''}"
                      data-value="${escapeHtml(val)}" title="${error.currentValue === val ? '当前值（无效）' : '点击选择'}">
                  ${escapeHtml(val)}
                </span>
              `,
                )
                .join('')}
            </div>
          </div>
        `;
      }
    }

    // 弹窗HTML
    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal ${currentThemeClass}" style="max-width:450px;">
          <div class="acu-edit-title">智能修改: ${escapeHtml(error.tableName || '')} - ${escapeHtml(error.columnName || '')}</div>
          <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
            <!-- 规则说明 -->
            <div class="acu-smart-fix-rule-info">
              <div class="acu-smart-fix-rule-header">
                <i class="fa-solid ${typeInfo.icon}"></i>
                <span>${escapeHtml(error.ruleName || rule.name || '')}</span>
              </div>
              <div class="acu-smart-fix-rule-desc">${escapeHtml(error.errorMessage || rule.errorMessage || typeInfo.desc || '')}</div>
            </div>

            <!-- 快照值（只读） -->
            ${
              hasSnapshotValue
                ? `
              <div class="acu-diff-section acu-diff-old-section">
                <div class="acu-diff-label">
                  <i class="fa-solid fa-clock-rotate-left"></i> 快照值（原始）
                </div>
                <div class="acu-diff-readonly">${escapeHtml(snapshotValue)}</div>
              </div>
              <div class="acu-diff-arrow-down"><i class="fa-solid fa-arrow-down"></i></div>
            `
                : ''
            }

            <!-- 当前值（可编辑） -->
            <div class="acu-diff-section acu-diff-new-section">
              <div class="acu-diff-label">
                <i class="fa-solid fa-pen"></i> 当前值（可编辑）
              </div>
              ${inputHtml}
            </div>

            <!-- 智能建议 -->
            ${
              smartSuggestHtml
                ? `
              <div class="acu-smart-fix-suggest-section">
                ${smartSuggestHtml}
              </div>
            `
                : ''
            }
          </div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            ${hasSnapshotValue ? `<button class="acu-dialog-btn acu-btn-revert" id="smart-fix-revert"><i class="fa-solid fa-rotate-left"></i> 恢复快照值</button>` : ''}
            <button class="acu-dialog-btn acu-btn-confirm" id="smart-fix-confirm"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 点击建议选项或快速修正按钮，填充到输入框
    dialog.on('click', '.acu-smart-fix-option, .acu-smart-fix-quick-btn', function () {
      if ($(this).hasClass('acu-smart-fix-option-current')) return;
      const optionValue = $(this).data('value') || $(this).text().trim();
      dialog.find('#smart-fix-value').val(optionValue).trigger('input');
    });

    // 恢复快照值
    dialog.on('click', '#smart-fix-revert', function () {
      dialog.find('#smart-fix-value').val(snapshotValue);
    });

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#smart-fix-close, #smart-fix-cancel', closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-validation-modal-overlay')) closeDialog();
    });

    // 确认修改
    dialog.find('#smart-fix-confirm').on('click', async function () {
      const newValue = dialog.find('#smart-fix-value').val()?.trim() || '';

      if (newValue === '' && ruleType === 'required') {
        if (window.toastr) window.toastr.warning('必填字段不能为空');
        return;
      }

      // 更新单元格值
      try {
        const rawData = cachedRawData || getTableData();
        let updated = false;

        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName) {
            const sheet = rawData[sheetId];
            const headers = sheet.content?.[0] || [];

            if (error.rowIndex >= 0 && error.columnName) {
              const colIdx = headers.indexOf(error.columnName);
              const rowIdx = error.rowIndex + 1;

              if (colIdx >= 0 && sheet.content && sheet.content[rowIdx]) {
                sheet.content[rowIdx][colIdx] = newValue;
                updated = true;
                break;
              }
            }
          }
        }

        if (updated) {
          await saveDataToDatabase(rawData, false, false);
          closeDialog();
          renderInterface();
        } else {
          if (window.toastr) window.toastr.error('无法找到目标单元格');
        }
      } catch (e) {
        console.error('[ACU] 更新单元格失败:', e);
        if (window.toastr) window.toastr.error('更新失败: ' + (e.message || '未知错误'));
      }
    });
  };

  // ========================================
  // 表级规则智能修改弹窗
  // ========================================
  const showTableRuleFixModal = (error, rule, ruleType, rawData, snapshot, currentThemeClass) => {
    const { $ } = getCore();
    const typeInfo = RULE_TYPE_INFO[ruleType] || { name: ruleType, icon: 'fa-question' };

    let contentHtml = '';
    let actionBtns = '';

    if (ruleType === 'tableReadonly') {
      // 表只读规则：显示修改概览，提供恢复整表功能
      let changeCount = 0;
      let changeDetails = [];

      if (snapshot && rawData) {
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName && snapshot[sheetId]) {
            const newRows = rawData[sheetId].content?.slice(1) || [];
            const oldRows = snapshot[sheetId].content?.slice(1) || [];

            // 检测修改
            newRows.forEach((row, idx) => {
              const oldRow = oldRows[idx];
              if (!oldRow) {
                changeDetails.push(`第${idx + 1}行: 新增`);
                changeCount++;
              } else {
                for (let c = 0; c < row.length; c++) {
                  if (String(row[c] || '') !== String(oldRow[c] || '')) {
                    changeDetails.push(`第${idx + 1}行: 有修改`);
                    changeCount++;
                    break;
                  }
                }
              }
            });

            // 检测删除
            if (oldRows.length > newRows.length) {
              for (let i = newRows.length; i < oldRows.length; i++) {
                changeDetails.push(`第${i + 1}行: 已删除`);
                changeCount++;
              }
            }
            break;
          }
        }
      }

      contentHtml = `
        <div class="acu-smart-fix-rule-info">
          <div class="acu-smart-fix-rule-header">
            <i class="fa-solid fa-lock"></i>
            <span>表只读保护</span>
          </div>
          <div class="acu-smart-fix-rule-desc">此表被设置为只读，但检测到有修改。</div>
        </div>
        <div class="acu-smart-fix-table-summary">
          <div class="acu-smart-fix-stat">
            <i class="fa-solid fa-exclamation-triangle"></i>
            检测到 <strong>${changeCount}</strong> 处修改
          </div>
          ${
            changeDetails.length > 0
              ? `
            <div class="acu-smart-fix-change-list">
              ${changeDetails
                .slice(0, 10)
                .map(d => `<div class="acu-smart-fix-change-item">${escapeHtml(d)}</div>`)
                .join('')}
              ${changeDetails.length > 10 ? `<div class="acu-smart-fix-change-item">... 还有 ${changeDetails.length - 10} 处</div>` : ''}
            </div>
          `
              : ''
          }
        </div>
      `;
      actionBtns = `
        <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
        <button class="acu-dialog-btn acu-btn-revert" id="smart-fix-restore-table"><i class="fa-solid fa-rotate-left"></i> 恢复整表</button>
      `;
    } else if (ruleType === 'rowLimit') {
      // 行数限制规则：显示超出的行，提供删除功能
      const minRows = rule.config?.min;
      const maxRows = rule.config?.max;
      let currentRowCount = 0;
      let excessRows = [];

      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === error.tableName) {
          currentRowCount = (rawData[sheetId].content?.length || 1) - 1; // 减去表头
          break;
        }
      }

      const isTooMany = maxRows !== undefined && currentRowCount > maxRows;
      const isTooFew = minRows !== undefined && currentRowCount < minRows;

      if (isTooMany) {
        for (let i = maxRows + 1; i <= currentRowCount; i++) {
          excessRows.push(i);
        }
      }

      contentHtml = `
        <div class="acu-smart-fix-rule-info">
          <div class="acu-smart-fix-rule-header">
            <i class="fa-solid fa-arrows-up-down"></i>
            <span>行数限制</span>
          </div>
          <div class="acu-smart-fix-rule-desc">${escapeHtml(error.errorMessage || rule.errorMessage || '')}</div>
        </div>
        <div class="acu-smart-fix-table-summary">
          <div class="acu-smart-fix-stat">
            当前行数: <strong>${currentRowCount}</strong> 行
            ${minRows !== undefined || maxRows !== undefined ? ` | 限制: ${minRows !== undefined ? minRows : 0} ~ ${maxRows !== undefined ? maxRows : '∞'} 行` : ''}
          </div>
          ${
            isTooMany && excessRows.length > 0
              ? `
            <div class="acu-smart-fix-excess-rows">
              <div class="acu-smart-fix-suggest-label">
                <i class="fa-solid fa-trash"></i> 需删除的行 (第 ${excessRows[0]} 行及之后):
              </div>
              <div class="acu-smart-fix-change-list">
                ${excessRows
                  .slice(0, 10)
                  .map(r => `<div class="acu-smart-fix-change-item">第 ${r} 行</div>`)
                  .join('')}
                ${excessRows.length > 10 ? `<div class="acu-smart-fix-change-item">... 共 ${excessRows.length} 行</div>` : ''}
              </div>
            </div>
          `
              : ''
          }
          ${
            isTooFew
              ? `
            <div class="acu-smart-fix-hint">
              <i class="fa-solid fa-info-circle"></i> 需要添加 ${minRows - currentRowCount} 行才能满足最小行数要求
            </div>
          `
              : ''
          }
        </div>
      `;

      if (isTooMany && excessRows.length > 0) {
        actionBtns = `
          <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
          <button class="acu-dialog-btn acu-btn-confirm" id="smart-fix-delete-rows" data-start="${maxRows}" data-table="${escapeHtml(error.tableName)}">
            <i class="fa-solid fa-trash"></i> 删除多余的 ${excessRows.length} 行
          </button>
        `;
      } else {
        actionBtns = `<button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 关闭</button>`;
      }
    }

    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal ${currentThemeClass}" style="max-width:450px;">
          <div class="acu-edit-title">智能修改: ${escapeHtml(error.tableName || '')} (表级规则)</div>
          <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
            ${contentHtml}
          </div>
          <div class="acu-dialog-btns">
            ${actionBtns}
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#smart-fix-cancel', closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-validation-modal-overlay')) closeDialog();
    });

    // 恢复整表
    dialog.on('click', '#smart-fix-restore-table', async function () {
      if (!snapshot) {
        if (window.toastr) window.toastr.warning('无快照数据');
        return;
      }

      try {
        // 恢复指定表的数据
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName && snapshot[sheetId]) {
            rawData[sheetId] = JSON.parse(JSON.stringify(snapshot[sheetId]));
            break;
          }
        }

        await saveDataToDatabase(rawData, false, false);
        closeDialog();
        renderInterface();
      } catch (e) {
        console.error('[ACU] 恢复表失败:', e);
        if (window.toastr) window.toastr.error('恢复失败: ' + (e.message || '未知错误'));
      }
    });

    // 删除多余行
    dialog.on('click', '#smart-fix-delete-rows', async function () {
      const startRow = parseInt($(this).data('start'), 10);
      const tableName = $(this).data('table');

      try {
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === tableName) {
            // 保留表头(index 0)和前 startRow 行数据(index 1 到 startRow)
            rawData[sheetId].content = rawData[sheetId].content.slice(0, startRow + 1);
            break;
          }
        }

        await saveDataToDatabase(rawData, false, false);
        closeDialog();
        renderInterface();
      } catch (e) {
        console.error('[ACU] 删除行失败:', e);
        if (window.toastr) window.toastr.error('删除失败: ' + (e.message || '未知错误'));
      }
    });
  };

  // ========================================
  // 属性预设管理面板
  // ========================================

  const showAttributePresetManager = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();
    const presets = AttributePresetManager.getAllPresets();
    const activeId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);

    // 生成预设列表HTML
    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin;

        return `
        <div class="acu-preset-item ${isActive ? 'active' : ''}" data-id="${preset.id}">
          <div class="acu-preset-info">
            <div class="acu-preset-name">
              ${escapeHtml(preset.name)}
              ${isBuiltin ? `<span style="font-size: 10px; color: ${t.textSub}; margin-left: 6px;">(内置)</span>` : ''}
            </div>
            ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
            <div class="acu-preset-stats">
              基础属性: ${preset.baseAttributes.length} | 特别属性: ${preset.specialAttributes?.length || 0}
            </div>
          </div>
          <div class="acu-preset-actions" style="display: flex; align-items: center; gap: 8px;">
            <label class="acu-toggle" style="margin: 0;">
              <input type="checkbox" class="acu-preset-toggle" data-id="${preset.id}" ${isActive ? 'checked' : ''}>
              <span class="acu-toggle-slider"></span>
            </label>
            ${!isBuiltin ? `<button class="acu-preset-btn acu-preset-edit" data-id="${preset.id}" title="编辑"><i class="fa-solid fa-pen"></i></button>` : ''}
            <button class="acu-preset-btn acu-preset-export" data-id="${preset.id}" title="导出"><i class="fa-solid fa-download"></i></button>
            ${!isBuiltin ? `<button class="acu-preset-btn acu-preset-delete" data-id="${preset.id}" title="删除" style="color: #e74c3c;"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
        </div>
      `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme}" style="width: 600px; max-width: 92vw; max-height: 80vh;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid ${t.border};">
            <div style="font-size: 16px; font-weight: bold; color: ${t.textMain};">
              <i class="fa-solid fa-dice-d20"></i> 属性规则预设管理
            </div>
            <button class="acu-close-btn"><i class="fa-solid fa-times"></i></button>
          </div>

          <div style="flex: 1; overflow-y: auto; padding: 12px 0;">
            <div id="acu-presets-list">
              ${presetsHtml || `<div style="text-align: center; padding: 40px; color: ${t.textSub};">暂无自定义预设</div>`}
            </div>
          </div>

          <div style="display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid ${t.border};">
            <button id="acu-preset-new" style="flex: 1; padding: 10px; background: ${t.accent}; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px;">
              <i class="fa-solid fa-plus"></i> 新建预设
            </button>
            <button id="acu-preset-import" style="flex: 1; padding: 10px; background: ${t.btnBg}; border: 1px solid ${t.border}; border-radius: 6px; color: ${t.textMain}; cursor: pointer; font-size: 13px;">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-preset-back" style="padding: 10px 16px; background: ${t.btnBg}; border: 1px solid ${t.border}; border-radius: 6px; color: ${t.textMain}; cursor: pointer; font-size: 13px;">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>

          <input type="file" id="acu-preset-file-input" accept=".json" style="display: none;" />
        </div>
      </div>
    `);

    $('body').append(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn, #acu-preset-back').on('click', () => {
      overlay.remove();
      showSettingsModal();
    });

    // Toggle切换预设激活状态
    overlay.on('change', '.acu-preset-toggle', function () {
      const $toggle = $(this);
      const id = $toggle.data('id');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        // 激活该预设
        AttributePresetManager.setActivePreset(id);

        // 将其他所有toggle设置为未选中状态（确保只有一个激活）
        overlay.find('.acu-preset-toggle').each(function() {
          const $thisToggle = $(this);
          const thisId = $thisToggle.data('id');
          if (thisId !== id) {
            $thisToggle.prop('checked', false);
          }
        });

        // 更新预设项的active类
        overlay.find('.acu-preset-item').removeClass('active');
        overlay.find(`.acu-preset-item[data-id="${id}"]`).addClass('active');
      } else {
        // 取消激活（设置为null，使用默认规则）
        AttributePresetManager.setActivePreset(null);

        // 更新预设项的active类
        overlay.find('.acu-preset-item').removeClass('active');
      }
    });

    // 编辑预设
    overlay.on('click', '.acu-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      showAttributePresetEditor(id);
    });

    // 导出预设
    overlay.on('click', '.acu-preset-export', function () {
      const id = $(this).data('id');
      const json = AttributePresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) window.toastr.error('导出失败');
        return;
      }

      const preset = presets.find(p => p.id === id);
      const filename = `acu_preset_${preset?.name || id}_${Date.now()}.json`;
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.toastr) window.toastr.success('预设已导出');
    });

    // 删除预设
    overlay.on('click', '.acu-preset-delete', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      if (confirm(`确定要删除预设「${preset?.name}」吗？`)) {
        const success = AttributePresetManager.deletePreset(id);
        if (success) {
          if (window.toastr) window.toastr.success('预设已删除');
          overlay.remove();
          showAttributePresetManager();
        } else {
          if (window.toastr) window.toastr.error('删除失败');
        }
      }
    });

    // 新建预设
    overlay.find('#acu-preset-new').on('click', () => {
      overlay.remove();
      showAttributePresetEditor();
    });

    // 导入预设
    overlay.find('#acu-preset-import').on('click', () => {
      overlay.find('#acu-preset-file-input').click();
    });

    overlay.find('#acu-preset-file-input').on('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const imported = AttributePresetManager.importPreset(evt.target.result);
          if (imported) {
            if (window.toastr) window.toastr.success(`预设「${imported.name}」导入成功`);
            overlay.remove();
            showAttributePresetManager();
          } else {
            if (window.toastr) window.toastr.error('导入失败：格式不正确');
          }
        } catch (err) {
          console.error('[ACU] 导入预设失败:', err);
          if (window.toastr) window.toastr.error('导入失败');
        }
      };
      reader.readAsText(file);

      // 重置输入框
      $(this).val('');
    });

    // 点击遮罩关闭
    overlay.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) {
        overlay.remove();
        showSettingsModal();
      }
    });
  };

  // 规则预设编辑器
  const showAttributePresetEditor = (presetId = null) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();

    const config = getConfig();
    const t = getThemeColors();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? AttributePresetManager.getAllPresets().find(p => p.id === presetId) : null;

    // 默认值
    const defaultData = {
      name: existingPreset?.name || '新规则预设',
      description: existingPreset?.description || '',
      baseAttributes: existingPreset?.baseAttributes || [
        { name: '力量', formula: '3d6', range: [3, 18] },
        { name: '敏捷', formula: '3d6', range: [3, 18] },
        { name: '体质', formula: '3d6', range: [3, 18] },
        { name: '智力', formula: '3d6', range: [3, 18] },
        { name: '感知', formula: '3d6', range: [3, 18] },
        { name: '魅力', formula: '3d6', range: [3, 18] },
      ],
      specialAttributes: existingPreset?.specialAttributes || [],
    };

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme}" style="width: 650px; max-width: 95vw; max-height: 85vh;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid ${t.border};">
            <div style="font-size: 16px; font-weight: bold; color: ${t.textMain};">
              <i class="fa-solid fa-pen"></i> ${isEdit ? '编辑' : '新建'}规则预设
            </div>
            <button class="acu-close-btn"><i class="fa-solid fa-times"></i></button>
          </div>

          <div style="flex: 1; overflow-y: auto; padding: 12px 0;">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12px; color: ${t.textSub}; margin-bottom: 4px;">预设名称</label>
              <input id="preset-name" type="text" value="${escapeHtml(defaultData.name)}" class="acu-preset-editor-input" style="width: 100%; padding: 8px; border: 1px solid ${t.border} !important; border-radius: 6px; background: ${t.inputBg} !important; color: ${t.textMain} !important; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12px; color: ${t.textSub}; margin-bottom: 4px;">描述</label>
              <input id="preset-desc" type="text" value="${escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" style="width: 100%; padding: 8px; border: 1px solid ${t.border} !important; border-radius: 6px; background: ${t.inputBg} !important; color: ${t.textMain} !important; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 12px; color: ${t.textSub}; margin-bottom: 8px;">
                JSON配置 <span style="font-size: 10px; color: ${t.textSub};">(支持直接编辑或导入)</span>
              </label>
              <textarea id="preset-json" class="acu-preset-editor-textarea" style="width: 100%; height: 320px; padding: 10px; border: 1px solid ${t.border} !important; border-radius: 6px; background: ${t.inputBg} !important; color: ${t.textMain} !important; font-family: 'Consolas', 'Monaco', monospace !important; font-size: 12px; resize: vertical; box-sizing: border-box;"></textarea>
            </div>

            <div style="font-size: 11px; color: ${t.textSub}; padding: 8px; background: var(--acu-table-head); border-radius: 6px; line-height: 1.6;">
              <strong>配置格式说明：</strong><br/>
              • baseAttributes: 基本属性数组，每项包含 name、formula、range、modifier(可选)<br/>
              • specialAttributes: 特别属性数组，每项包含 name、formula、range(可选)<br/>
              • 公式支持: 3d6, 4d6kh3, 变量引用(力量/2), 数学运算(+、-、*、/)
            </div>
          </div>

          <div style="display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid ${t.border};">
            <button id="preset-save" style="flex: 1; padding: 10px; background: ${t.accent}; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; font-weight: bold;">
              <i class="fa-solid fa-check"></i> 保存
            </button>
            <button id="preset-cancel" style="padding: 10px 16px; background: ${t.btnBg}; border: 1px solid ${t.border}; border-radius: 6px; color: ${t.textMain}; cursor: pointer; font-size: 13px;">
              <i class="fa-solid fa-times"></i> 取消
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);

    const $jsonTextarea = overlay.find('#preset-json');

    // 初始化JSON
    const updateJSON = () => {
      const data = {
        baseAttributes: defaultData.baseAttributes,
        specialAttributes: defaultData.specialAttributes,
      };
      $jsonTextarea.val(JSON.stringify(data, null, 2));
    };
    updateJSON();

    // 关闭
    overlay.find('.acu-close-btn, #preset-cancel').on('click', () => {
      overlay.remove();
      showAttributePresetManager();
    });

    // 保存
    overlay.find('#preset-save').on('click', () => {
      try {
        const name = overlay.find('#preset-name').val().trim();
        const description = overlay.find('#preset-desc').val().trim();
        const jsonStr = $jsonTextarea.val().trim();

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        // 解析JSON
        const jsonData = JSON.parse(jsonStr);

        // 校验必需字段
        if (
          !jsonData.baseAttributes ||
          !Array.isArray(jsonData.baseAttributes) ||
          jsonData.baseAttributes.length === 0
        ) {
          if (window.toastr) window.toastr.error('基本属性不能为空');
          return;
        }

        // 构建预设
        const preset = {
          format: 'acu_attr_preset_v1',
          version: 1,
          id: presetId || `custom_${Date.now()}`,
          name,
          description,
          baseAttributes: jsonData.baseAttributes,
          specialAttributes: jsonData.specialAttributes || [],
        };

        // 保存
        if (isEdit) {
          AttributePresetManager.updatePreset(presetId, preset);
          if (window.toastr) window.toastr.success('预设已更新');
        } else {
          AttributePresetManager.createPreset(preset);
          if (window.toastr) window.toastr.success('预设已创建');
        }

        overlay.remove();
        showAttributePresetManager();
      } catch (err) {
        console.error('[ACU] 保存预设失败:', err);
        if (window.toastr) window.toastr.error('保存失败：' + (err.message || 'JSON格式错误'));
      }
    });

    // 点击遮罩关闭
    overlay.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) {
        overlay.remove();
        showAttributePresetManager();
      }
    });
  };

  const showSettingsModal = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').not(':has(.acu-settings-dialog)').remove();
    isSettingsOpen = true;
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const t = getThemeColors();

    // 分组折叠状态（从存储读取，默认第一组展开）
    const expandedGroups = Store.get('acu_settings_expanded', ['appearance']);

    const isGroupExpanded = groupId => expandedGroups.includes(groupId);
    // 生成表格管理列表HTML（包含特殊按钮）
    const SPECIAL_BUTTONS = [
      { key: '__dice__', name: '投骰', icon: 'fa-dice-d20' },
      { key: '__changes__', name: '变更审核', icon: 'fa-clipboard-check' },
      { key: '__mvu__', name: 'MVU变量', icon: 'fa-code-branch' },
    ];

    // 生成表格管理列表HTML（包含特殊按钮：投骰、审核、MVU变量）
    const SPECIAL_BUTTONS_CONFIG = [
      { key: '__dice__', name: '投骰', icon: 'fa-dice-d20' },
      { key: '__changes__', name: '变更审核', icon: 'fa-code-compare' },
      { key: '__mvu__', name: 'MVU变量', icon: 'fa-code-branch' },
    ];

    const tableManagerHtml = (() => {
      const rawData = cachedRawData || getTableData();
      const tables = processJsonData(rawData || {});
      const savedOrder = getSavedTableOrder() || [];
      const hiddenList = getHiddenTables();

      // 构建所有可管理项：特殊按钮 + 真实表格
      let allItems = [];

      // 添加特殊按钮
      SPECIAL_BUTTONS_CONFIG.forEach(btn => {
        // MVU 按钮仅当 MVU 可用时显示
        if (btn.key === '__mvu__' && !MvuModule.isAvailable()) return;
        allItems.push({ key: btn.key, name: btn.name, icon: btn.icon, isSpecial: true });
      });

      // 添加真实表格
      Object.keys(tables).forEach(name => {
        allItems.push({ key: name, name: name, icon: getIconForTableName(name), isSpecial: false });
      });

      // 应用保存的排序
      if (savedOrder.length > 0) {
        const orderMap = new Map(savedOrder.map((k, i) => [k, i]));
        allItems.sort((a, b) => {
          const aIdx = orderMap.has(a.key) ? orderMap.get(a.key) : 9999;
          const bIdx = orderMap.has(b.key) ? orderMap.get(b.key) : 9999;
          return aIdx - bIdx;
        });
      }

      return allItems
        .map(item => {
          const isHidden = hiddenList.includes(item.key);
          const specialClass = item.isSpecial ? ' acu-special-item' : '';
          const displayName = item.name;
          return (
            '<div class="acu-table-manager-item' +
            specialClass +
            (isHidden ? ' hidden-table' : '') +
            '" data-table-name="' +
            escapeHtml(item.key) +
            '" draggable="false">' +
            '<div class="acu-table-item-check" title="点击切换显示/隐藏">' +
            '<i class="fa-solid ' +
            (isHidden ? 'fa-eye-slash' : 'fa-eye') +
            '"></i>' +
            '</div>' +
            '<div class="acu-table-item-icon"><i class="fa-solid ' +
            item.icon +
            '"></i></div>' +
            '<div class="acu-table-item-name">' +
            escapeHtml(displayName) +
            '</div>' +
            '<div class="acu-table-item-handle" title="拖拽排序">' +
            '<i class="fa-solid fa-grip-vertical"></i>' +
            '</div>' +
            '</div>'
          );
        })
        .join('');
    })();
    const chevron = groupId => (isGroupExpanded(groupId) ? 'fa-chevron-down' : 'fa-chevron-right');

    const dialog = $(`
        <div class="acu-edit-overlay">
            <div class="acu-edit-dialog acu-settings-dialog ${currentThemeClass}">
                <div class="acu-settings-header">
                    <div class="acu-settings-title"><i class="fa-solid fa-cog"></i> 设置</div>
                    <button class="acu-close-btn" id="dlg-close-x"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="acu-settings-body">
                <!-- 外观样式 -->
                <div class="acu-settings-group ${isGroupExpanded('appearance') ? '' : 'collapsed'}" data-group="appearance">                    <div class="acu-settings-group-title">
                        <i class="fa-solid ${chevron('appearance')} acu-group-chevron"></i>
                        <i class="fa-solid fa-palette"></i> 外观样式
                    </div>
                    <div class="acu-settings-group-body">
                        <div class="acu-setting-row">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">背景主题</span>
                            </div>
                            <select id="cfg-theme" class="acu-setting-select">
                                ${THEMES.map(t => `<option value="${t.id}" ${t.id === config.theme ? 'selected' : ''}>${t.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体风格</span>
                            </div>
                            <select id="cfg-font-family" class="acu-setting-select">
                                ${FONTS.map(f => `<option value="${f.id}" ${f.id === config.fontFamily ? 'selected' : ''}>${f.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="acu-setting-row">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小 (界面)</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-main" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.fontSize}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">字体大小 (选项)</span>
                            </div>
                            <div class="acu-stepper" data-id="cfg-font-opt" data-min="10" data-max="24" data-step="1">
                                <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                <span class="acu-stepper-value">${config.optionFontSize || 12}px</span>
                                <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                        <div class="acu-setting-row acu-setting-row-toggle">
                            <div class="acu-setting-info">
                                <span class="acu-setting-label">高亮变化内容</span>
                            </div>
                            <label class="acu-toggle">
                                <input type="checkbox" id="cfg-new" ${config.highlightNew ? 'checked' : ''}>
                                <span class="acu-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                    <!-- 布局设置 -->
                    <div class="acu-settings-group ${isGroupExpanded('layout') ? '' : 'collapsed'}" data-group="layout">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('layout')} acu-group-chevron"></i>
                            <i class="fa-solid fa-th-large"></i> 布局设置
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">卡片宽度</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-width" data-min="200" data-max="500" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.cardWidth}px</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">布局模式</span>
                                </div>
                                <select id="cfg-layout" class="acu-setting-select">
                                    <option value="horizontal" ${config.layout !== 'vertical' ? 'selected' : ''}>横向滚动</option>
                                    <option value="vertical" ${config.layout === 'vertical' ? 'selected' : ''}>竖向滚动</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">底部按钮列数</span>
                                    <span class="acu-setting-hint">仅移动端</span>
                                </div>
                                <select id="cfg-grid-cols" class="acu-setting-select acu-select-short">
                                    <option value="2" ${config.gridColumns == 2 ? 'selected' : ''}>2列</option>
                                    <option value="3" ${config.gridColumns == 3 ? 'selected' : ''}>3列</option>
                                    <option value="4" ${config.gridColumns == 4 ? 'selected' : ''}>4列</option>
                                    <option value="auto" ${config.gridColumns === 'auto' ? 'selected' : ''}>自动</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">每页显示条数</span>
                                </div>
                                <div class="acu-stepper" data-id="cfg-per-page" data-min="10" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${config.itemsPerPage}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 属性规则 -->
                    <div class="acu-settings-group ${isGroupExpanded('attrRules') ? '' : 'collapsed'}" data-group="attrRules">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('attrRules')} acu-group-chevron"></i>
                            <i class="fa-solid fa-dice-d20"></i> 属性规则
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">当前规则</span>
                                    <span class="acu-setting-hint">投骰属性生成</span>
                                </div>
                                <select id="cfg-attr-preset" class="acu-setting-select">
                                    <option value="">默认（百分制六维）</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <button id="cfg-attr-preset-manage" style="width: 100%; padding: 8px; background: ${t.accent}; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                    <i class="fa-solid fa-cog"></i> 管理规则预设
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 位置与交互 -->
                    <div class="acu-settings-group ${isGroupExpanded('position') ? '' : 'collapsed'}" data-group="position">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('position')} acu-group-chevron"></i>
                            <i class="fa-solid fa-arrows-alt"></i> 位置与交互
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">面板位置</span>
                                </div>
                                <select id="cfg-position" class="acu-setting-select">
                                    <option value="fixed" ${config.positionMode !== 'embedded' ? 'selected' : ''}>悬浮底部</option>
                                    <option value="embedded" ${config.positionMode === 'embedded' ? 'selected' : ''}>跟随消息</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">功能按钮位置</span>
                                </div>
                                <select id="cfg-action-pos" class="acu-setting-select acu-select-short">
                                    <option value="bottom" ${config.actionsPosition !== 'top' ? 'selected' : ''}>底部</option>
                                    <option value="top" ${config.actionsPosition === 'top' ? 'selected' : ''}>顶部</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起样式</span>
                                </div>
                                <select id="cfg-col-style" class="acu-setting-select acu-select-short">
                                    <option value="bar" ${config.collapseStyle === 'bar' ? 'selected' : ''}>长条</option>
                                    <option value="pill" ${config.collapseStyle === 'pill' ? 'selected' : ''}>胶囊</option>
                                    <option value="mini" ${config.collapseStyle === 'mini' ? 'selected' : ''}>圆钮</option>
                                </select>
                            </div>
                            <div class="acu-setting-row">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">收起位置</span>
                                </div>
                                <select id="cfg-col-align" class="acu-setting-select acu-select-short">
                                    <option value="right" ${config.collapseAlign !== 'left' ? 'selected' : ''}>靠右</option>
                                    <option value="left" ${config.collapseAlign === 'left' ? 'selected' : ''}>靠左</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- 行动选项 -->
                    <div class="acu-settings-group ${isGroupExpanded('options') ? '' : 'collapsed'}" data-group="options">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('options')} acu-group-chevron"></i>
                            <i class="fa-solid fa-gamepad"></i> 行动选项
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-setting-row acu-setting-row-toggle">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">显示行动选项面板</span>
                                </div>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-show-opt" ${config.showOptionPanel !== false ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="acu-setting-row acu-setting-row-toggle" id="row-auto-send" style="${config.showOptionPanel !== false ? '' : 'display:none;'}">
                                <div class="acu-setting-info">
                                    <span class="acu-setting-label">点击选项直接发送</span>
                                </div>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-auto-send" ${config.clickOptionToAutoSend !== false ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                <!-- 表格管理 -->
                    <div class="acu-settings-group ${isGroupExpanded('tables') ? '' : 'collapsed'}" data-group="tables">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('tables')} acu-group-chevron"></i>
                            <i class="fa-solid fa-table"></i> 表格管理
                        </div>
                        <div class="acu-settings-group-body">
                            <div class="acu-table-manager-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 点击切换显示，长按拖拽排序
                            </div>
                            <div class="acu-table-manager-list" id="table-manager-list">
                                ${tableManagerHtml}
                            </div>
                        </div>
                    </div>

                    <!-- 数据验证规则 -->
                    <div class="acu-settings-group ${isGroupExpanded('validation') ? '' : 'collapsed'}" data-group="validation">
                        <div class="acu-settings-group-title">
                            <i class="fa-solid ${chevron('validation')} acu-group-chevron"></i>
                            <i class="fa-solid fa-shield-check"></i> 数据验证规则
                        </div>
                        <div class="acu-settings-group-body">
                            <!-- 预设选择器 -->
                            <div class="acu-setting-row" style="margin-bottom:8px;">
                                <span>当前预设</span>
                                <select class="acu-setting-select" id="preset-select" style="flex:1;max-width:160px;">
                                    ${PresetManager.getAllPresets()
                                      .map(
                                        p =>
                                          `<option value="${escapeHtml(p.id)}" ${p.id === PresetManager.getActivePreset()?.id ? 'selected' : ''}>${escapeHtml(p.name)}${p.builtin ? ' (内置)' : ''}</option>`,
                                      )
                                      .join('')}
                                </select>
                            </div>
                            <!-- 预设操作按钮 -->
                            <div style="display:flex;gap:6px;margin-bottom:10px;">
                                <button class="acu-action-btn" id="btn-preset-dup" title="复制预设" style="flex:1;height:28px;"><i class="fa-solid fa-copy"></i></button>
                                <button class="acu-action-btn" id="btn-preset-new" title="新建预设" style="flex:1;height:28px;"><i class="fa-solid fa-plus"></i></button>
                                <button class="acu-action-btn" id="btn-preset-del" title="删除预设" style="flex:1;height:28px;"><i class="fa-solid fa-trash"></i></button>
                                <button class="acu-action-btn" id="btn-preset-export" title="导出" style="flex:1;height:28px;"><i class="fa-solid fa-file-export"></i></button>
                                <button class="acu-action-btn" id="btn-preset-import" title="导入" style="flex:1;height:28px;"><i class="fa-solid fa-file-import"></i></button>
                                <button class="acu-action-btn" id="btn-preset-reset" title="恢复默认预设规则" style="flex:1;height:28px;"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <div class="acu-validation-hint" style="font-size:11px;color:var(--acu-text-sub);margin-bottom:8px;padding:0 4px;">
                                <i class="fa-solid fa-info-circle"></i> 验证规则用于检测数据合法性，<i class="fa-solid fa-shield-halved"></i> 表示启用拦截
                            </div>
                            <div class="acu-validation-rules-list" id="validation-rules-list">
                                ${ValidationRuleManager.getAllRules()
                                  .map(rule => {
                                    const typeInfo = RULE_TYPE_INFO[rule.ruleType] || {
                                      name: rule.ruleType,
                                      icon: 'fa-question',
                                    };
                                    const isTableRule = typeInfo.scope === 'table';
                                    const hasIntercept = rule.intercept;
                                    return `
                                    <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
                                        <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
                                            <i class="fa-solid ${typeInfo.icon}"></i>
                                        </div>
                                        <div class="acu-rule-info">
                                            <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
                                            <div class="acu-rule-target">${escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
                                        </div>
                                        <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截' : '点击启用拦截（违反时回滚）'}"><i class="fa-solid fa-shield-halved"></i></div>
                                        <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
                                            <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                                        </div>
                                        <button class="acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                `;
                                  })
                                  .join('')}
                            </div>
                            <button class="acu-add-rule-btn" id="btn-add-validation-rule">
                                <i class="fa-solid fa-plus"></i> 添加自定义规则
                            </button>
                        </div>
                    </div>
                </div>

                </div><!-- 关闭 .acu-settings-body -->
            </div>
        </div>
    `);
    $('body').append(dialog);

    // === 分组折叠交互（带动画） ===
    dialog.find('.acu-settings-group-title').on('click', function () {
      const $group = $(this).closest('.acu-settings-group');
      const $body = $group.find('.acu-settings-group-body');

      // 防止动画过程中重复点击
      if ($body.hasClass('acu-animating')) return;

      const groupId = $group.data('group');
      const $chevron = $(this).find('.acu-group-chevron');
      let expanded = Store.get('acu_settings_expanded', ['appearance']);

      if ($group.hasClass('collapsed')) {
        // 展开
        $group.removeClass('collapsed');
        $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        if (!expanded.includes(groupId)) expanded.push(groupId);

        $body.addClass('acu-animating').show();
        const targetHeight = $body.prop('scrollHeight');
        $body.css('height', 0).animate({ height: targetHeight }, 180, function () {
          $(this).css('height', '').removeClass('acu-animating');
        });
      } else {
        // 收起
        $group.addClass('collapsed');
        $chevron.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        expanded = expanded.filter(id => id !== groupId);

        const currentHeight = $body.outerHeight();
        $body
          .addClass('acu-animating')
          .css('height', currentHeight)
          .animate({ height: 0 }, 180, function () {
            $(this).hide().css('height', '').removeClass('acu-animating');
          });
      }

      Store.set('acu_settings_expanded', expanded);
    });

    // === 设置项事件绑定 ===
    // 主题
    dialog.find('#cfg-theme').on('change', function () {
      const newTheme = $(this).val();
      saveConfig({ theme: newTheme });
      dialog
        .find('.acu-edit-dialog')
        .removeClass(THEMES.map(t => `acu-theme-${t.id}`).join(' '))
        .addClass(`acu-theme-${newTheme}`);
    });

    // 字体
    dialog.find('#cfg-font-family').on('change', function () {
      saveConfig({ fontFamily: $(this).val() });
    });

    // 属性规则预设
    (() => {
      const $select = dialog.find('#cfg-attr-preset');
      const activeId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);

      // 填充下拉框
      const presets = AttributePresetManager.getAllPresets();
      presets.forEach(preset => {
        const isActive = preset.id === activeId;
        $select.append(
          `<option value="${preset.id}" ${isActive ? 'selected' : ''}>${preset.name}${preset.builtin ? '' : ' (自定义)'}</option>`,
        );
      });

      // 切换预设
      $select.on('change', function () {
        const selectedId = $(this).val();
        AttributePresetManager.setActivePreset(selectedId || null);
        if (window.toastr) {
          if (selectedId) {
            const preset = presets.find(p => p.id === selectedId);
            window.toastr.success(`已切换到：${preset?.name || '未知预设'}`);
          } else {
            window.toastr.info('已切换到默认规则（百分制六维）');
          }
        }
      });

      // 管理按钮
      dialog.find('#cfg-attr-preset-manage').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dialog.remove();
        isSettingsOpen = false;
        showAttributePresetManager();
      });
    })();

    // 布局
    dialog.find('#cfg-layout').on('change', function () {
      saveConfig({ layout: $(this).val() });
      renderInterface();
    });
    dialog.find('#cfg-grid-cols').on('change', function () {
      saveConfig({ gridColumns: $(this).val() });
    });

    // 位置
    dialog.find('#cfg-position').on('change', function () {
      saveConfig({ positionMode: $(this).val() });
      renderInterface();
    });
    dialog.find('#cfg-action-pos').on('change', function () {
      saveConfig({ actionsPosition: $(this).val() });
      renderInterface();
    });
    dialog.find('#cfg-col-style').on('change', function () {
      saveConfig({ collapseStyle: $(this).val() });
      renderInterface();
    });
    dialog.find('#cfg-col-align').on('change', function () {
      saveConfig({ collapseAlign: $(this).val() });
      renderInterface();
    });

    // 行动选项
    dialog.find('#cfg-show-opt').on('change', function () {
      const checked = $(this).is(':checked');
      saveConfig({ showOptionPanel: checked });
      if (!checked) Store.set('acu_hide_nav_only', false);
      if (checked) dialog.find('#row-auto-send').slideDown(200);
      else dialog.find('#row-auto-send').slideUp(200);
      renderInterface();
    });
    dialog.find('#cfg-auto-send').on('change', function () {
      saveConfig({ clickOptionToAutoSend: $(this).is(':checked') });
    });
    dialog.find('#cfg-new').on('change', function () {
      saveConfig({ highlightNew: $(this).is(':checked') });
      renderInterface();
    });

    // === 表格管理：点击切换显示/隐藏 ===
    dialog.find('.acu-table-item-check').on('click', function (e) {
      e.stopPropagation();
      const $item = $(this).closest('.acu-table-manager-item');
      const tableName = $item.data('table-name');
      let hiddenList = getHiddenTables();
      const $icon = $(this).find('i');

      if (hiddenList.includes(tableName)) {
        // 显示
        hiddenList = hiddenList.filter(n => n !== tableName);
        $item.removeClass('hidden-table');
        $icon.removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // 隐藏
        hiddenList.push(tableName);
        $item.addClass('hidden-table');
        $icon.removeClass('fa-eye').addClass('fa-eye-slash');
      }

      saveHiddenTables(hiddenList);
      renderInterface();
    });

    // === 表格管理：拖拽排序 ===
    const $list = dialog.find('#table-manager-list');
    let dragState = {
      isDragging: false,
      element: null,
      timer: null,
      startY: 0,
    };

    const clearDragState = () => {
      if (dragState.timer) {
        clearTimeout(dragState.timer);
        dragState.timer = null;
      }
      if (dragState.element) {
        $(dragState.element).removeClass('acu-dragging');
      }
      $list.find('.acu-drag-above, .acu-drag-below').removeClass('acu-drag-above acu-drag-below');
      dragState.isDragging = false;
      dragState.element = null;
    };

    const startDrag = $item => {
      dragState.isDragging = true;
      dragState.element = $item[0];
      $item.addClass('acu-dragging');
    };

    const finishDrag = () => {
      if (!dragState.isDragging || !dragState.element) {
        clearDragState();
        return;
      }

      const $dragged = $(dragState.element);
      const $target = $list.find('.acu-drag-above, .acu-drag-below').first();

      if ($target.length && $target[0] !== dragState.element) {
        if ($target.hasClass('acu-drag-above')) {
          $dragged.insertBefore($target);
        } else {
          $dragged.insertAfter($target);
        }

        // 保存新顺序
        const newOrder = [];
        $list.find('.acu-table-manager-item').each(function () {
          newOrder.push($(this).data('table-name'));
        });
        saveTableOrder(newOrder);
      }

      clearDragState();
    };

    // 手柄：立即开始拖拽
    $list[0].addEventListener(
      'pointerdown',
      function (e) {
        const handle = e.target.closest('.acu-table-item-handle');
        if (!handle) return;

        e.preventDefault();
        const $item = $(handle).closest('.acu-table-manager-item');
        dragState.startY = e.clientY;
        startDrag($item);
        handle.setPointerCapture(e.pointerId);
      },
      { passive: false },
    );

    // 列表项：长按开始拖拽
    $list[0].addEventListener('pointerdown', function (e) {
      const item = e.target.closest('.acu-table-manager-item');
      if (!item) return;
      // 跳过眼睛图标和手柄
      if (e.target.closest('.acu-table-item-check, .acu-table-item-handle')) return;

      dragState.startY = e.clientY;
      const $item = $(item);

      dragState.timer = setTimeout(() => {
        startDrag($item);
      }, 350);
    });

    // 指针移动
    $list[0].addEventListener(
      'pointermove',
      function (e) {
        // 移动超过阈值取消长按
        if (dragState.timer && Math.abs(e.clientY - dragState.startY) > 8) {
          clearTimeout(dragState.timer);
          dragState.timer = null;
        }

        if (!dragState.isDragging || !dragState.element) return;
        e.preventDefault();

        // 查找目标位置
        const items = $list.find('.acu-table-manager-item').not('.acu-dragging');
        let targetItem = null;
        let insertBefore = true;

        items.each(function () {
          const rect = this.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;

          if (e.clientY < midY && !targetItem) {
            targetItem = this;
            insertBefore = true;
          } else if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
            targetItem = this;
            insertBefore = e.clientY < midY;
          }
        });

        // 更新视觉指示
        $list.find('.acu-drag-above, .acu-drag-below').removeClass('acu-drag-above acu-drag-below');
        if (targetItem && targetItem !== dragState.element) {
          $(targetItem).addClass(insertBefore ? 'acu-drag-above' : 'acu-drag-below');
        }
      },
      { passive: false },
    );

    // 指针释放
    $list[0].addEventListener('pointerup', finishDrag);
    $list[0].addEventListener('pointercancel', clearDragState);

    // 触摸移动时阻止页面滚动
    $list[0].addEventListener(
      'touchmove',
      function (e) {
        if (dragState.isDragging) {
          e.preventDefault();
        }
      },
      { passive: false },
    );

    // === Stepper 步进器事件 ===
    dialog.find('.acu-stepper').each(function () {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = newVal => {
        newVal = Math.max(min, Math.min(max, newVal));
        const unit = id === 'cfg-per-page' ? '' : 'px';
        $value.text(newVal + unit);

        // 实时预览
        if (id === 'cfg-width') {
          $('.acu-wrapper').css('--acu-card-width', newVal + 'px');
          saveConfig({ cardWidth: newVal });
        } else if (id === 'cfg-font-main') {
          $('.acu-wrapper').css('--acu-font-size', newVal + 'px');
          saveConfig({ fontSize: newVal });
        } else if (id === 'cfg-font-opt') {
          $('.acu-wrapper, .acu-embedded-options-container').css('--acu-opt-font-size', newVal + 'px');
          saveConfig({ optionFontSize: newVal });
        } else if (id === 'cfg-per-page') {
          saveConfig({ itemsPerPage: newVal });
        }
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    // === 验证规则：切换启用/禁用（使用事件委托支持动态元素）===
    dialog.on('click', '.acu-rule-toggle', function (e) {
      e.stopPropagation();
      const $toggle = $(this);
      const $item = $toggle.closest('.acu-validation-rule-item');
      const ruleId = $item.data('rule-id');
      const $icon = $toggle.find('i');
      const isCurrentlyActive = $toggle.hasClass('active');

      // 切换状态
      ValidationRuleManager.toggleRuleEnabled(ruleId, !isCurrentlyActive);

      // 更新 UI
      if (isCurrentlyActive) {
        $toggle.removeClass('active');
        $icon.removeClass('fa-toggle-on').addClass('fa-toggle-off');
        $item.addClass('disabled');
      } else {
        $toggle.addClass('active');
        $icon.removeClass('fa-toggle-off').addClass('fa-toggle-on');
        $item.removeClass('disabled');
      }
    });

    // === 验证规则：删除规则（使用事件委托）===
    dialog.on('click', '.acu-rule-delete', function (e) {
      e.stopPropagation();
      const ruleId = $(this).data('rule-id');
      const $item = $(this).closest('.acu-validation-rule-item');

      if (confirm('确定要删除这条自定义规则吗？')) {
        if (ValidationRuleManager.removeCustomRule(ruleId)) {
          $item.fadeOut(200, function () {
            $(this).remove();
          });
        }
      }
    });

    // === 验证规则：切换拦截状态（使用事件委托）===
    dialog.on('click', '.acu-rule-intercept', function (e) {
      e.stopPropagation();
      const $btn = $(this);
      const ruleId = $btn.data('rule-id');
      const isCurrentlyActive = $btn.hasClass('active');

      if (ValidationRuleManager.toggleRuleIntercept(ruleId, !isCurrentlyActive)) {
        if (isCurrentlyActive) {
          $btn.removeClass('active').attr('title', '点击启用拦截（违反时回滚）');
        } else {
          $btn.addClass('active').attr('title', '点击关闭拦截');
        }
      }
    });

    // === 预设管理事件 ===
    const refreshPresetUI = () => {
      ValidationRuleManager.clearCache();
      const rules = ValidationRuleManager.getAllRules();
      let html = '';
      rules.forEach(rule => {
        const typeInfo = RULE_TYPE_INFO[rule.ruleType] || { name: rule.ruleType, icon: 'fa-question' };
        const isTableRule = typeInfo.scope === 'table';
        const hasIntercept = rule.intercept;
        html += `
          <div class="acu-validation-rule-item ${rule.enabled ? '' : 'disabled'}" data-rule-id="${escapeHtml(rule.id)}">
            <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo.name)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo.icon}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${escapeHtml(rule.name)}</div>
              <div class="acu-rule-target">${escapeHtml(rule.targetTable)}${rule.targetColumn ? '.' + escapeHtml(rule.targetColumn) : isTableRule ? ' (整表)' : ''}</div>
            </div>
            <div class="acu-rule-intercept ${hasIntercept ? 'active' : ''}" data-rule-id="${escapeHtml(rule.id)}" title="${hasIntercept ? '点击关闭拦截' : '点击启用拦截（违反时回滚）'}"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="acu-rule-toggle ${rule.enabled ? 'active' : ''}" title="点击切换启用/禁用">
              <i class="fa-solid ${rule.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </div>
            <button class="acu-rule-delete" data-rule-id="${escapeHtml(rule.id)}" title="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>`;
      });
      dialog.find('#validation-rules-list').html(html);
    };

    // 切换预设
    dialog.find('#preset-select').on('change', function () {
      if (PresetManager.setActivePreset($(this).val())) {
        refreshPresetUI();
      }
    });

    // 复制预设
    dialog.find('#btn-preset-dup').on('click', function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      const newPreset = PresetManager.duplicatePreset(preset.id);
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 新建预设
    dialog.find('#btn-preset-new').on('click', function () {
      const name = prompt('请输入新预设名称:', '我的预设');
      if (!name?.trim()) return;
      const newPreset = PresetManager.createPreset(name.trim());
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      }
    });

    // 删除预设
    dialog.find('#btn-preset-del').on('click', function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      if (preset.id === 'default') {
        if (window.toastr) window.toastr.warning('默认预设不能删除');
        return;
      }
      if (!confirm(`确定删除预设"${preset.name}"吗？`)) return;
      if (PresetManager.deletePreset(preset.id)) {
        dialog.find(`#preset-select option[value="${preset.id}"]`).remove();
        dialog.find('#preset-select').val('default').trigger('change');
      }
    });

    // 导出预设
    dialog.find('#btn-preset-export').on('click', function () {
      const preset = PresetManager.getActivePreset();
      if (!preset) return;
      const json = PresetManager.exportPreset(preset.id);
      if (json) {
        navigator.clipboard
          .writeText(json)
          .then(() => {})
          .catch(() => {
            prompt('复制以下内容:', json);
          });
      }
    });

    // 导入预设
    dialog.find('#btn-preset-import').on('click', function () {
      const json = prompt('粘贴预设 JSON:');
      if (!json?.trim()) return;
      const newPreset = PresetManager.importPreset(json.trim());
      if (newPreset) {
        dialog
          .find('#preset-select')
          .append(`<option value="${escapeHtml(newPreset.id)}">${escapeHtml(newPreset.name)}</option>`);
        dialog.find('#preset-select').val(newPreset.id).trigger('change');
      } else {
        if (window.toastr) window.toastr.error('导入失败，请检查格式');
      }
    });

    // 恢复默认预设规则
    dialog.find('#btn-preset-reset').on('click', function () {
      if (!confirm('确定要将默认预设恢复为初始状态吗？\n这将删除所有对默认预设的修改。')) return;
      if (PresetManager.resetDefaultPreset()) {
        // 如果当前是默认预设，刷新规则列表
        if (PresetManager.getActivePreset()?.id === 'default') {
          refreshPresetUI();
        }
      } else {
        if (window.toastr) window.toastr.error('恢复失败');
      }
    });

    // === 验证规则：添加自定义规则 ===
    dialog.find('#btn-add-validation-rule').on('click', function () {
      showAddValidationRuleModal(dialog);
    });

    // === 关闭 ===
    const closeDialog = () => {
      isSettingsOpen = false;
      dialog.remove();
      renderInterface();
    };
    dialog.on('click', '#dlg-close-x, .acu-settings-header .acu-close-btn', closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) closeDialog();
    });
  };

  const renderInterface = () => {
    // 设置面板打开时跳过重绘，防止事件丢失
    if (isSettingsOpen) return;
    const _renderStart = performance.now();
    const { $ } = getCore();

    // [修复] Observer 延迟创建保险 (带节流优化)
    if (!observer && $('#chat').length) {
      const $chat = $('#chat');
      let mutationLock = false;
      const handleMutation = () => {
        if (mutationLock) return;
        mutationLock = true;
        requestAnimationFrame(() => {
          const config = getConfig();
          if (config.positionMode === 'embedded') {
            mutationLock = false;
            return;
          }
          const children = $chat.children();
          const lastChild = children.last()[0];
          const wrapper = $('.acu-wrapper')[0];
          if (wrapper && lastChild && lastChild !== wrapper) {
            if ($(lastChild).hasClass('mes') || $(lastChild).hasClass('message-body')) {
              $chat.append(wrapper);
            }
          }
          mutationLock = false;
        });
      };
      observer = new MutationObserver(handleMutation);
      observer.observe($chat[0], { childList: true });
    }
    let rawData;
    if (hasUnsavedChanges && cachedRawData) {
      rawData = cachedRawData;
    } else {
      rawData = getTableData();

      // [锁定功能] 应用锁定值覆盖
      if (rawData) {
        let anyLockApplied = false;
        for (const sheetId in rawData) {
          if (!sheetId.startsWith('sheet_')) continue;
          const sheet = rawData[sheetId];
          if (!sheet || !sheet.name || !sheet.content) continue;

          const result = LockManager.applyLocks(sheet.name, sheet.content);
          if (result.modified) {
            anyLockApplied = true;
          }
          if (result.restored.length > 0) {
          }
        }
        if (anyLockApplied) {
        }
      }
      if (rawData) {
        cachedRawData =
          typeof structuredClone === 'function' ? structuredClone(rawData) : JSON.parse(JSON.stringify(rawData));

        const existingSnapshot = loadSnapshot();
        const currentCtx = getCurrentContextFingerprint();

        // 检查快照是否有效（存在且包含实际表数据）
        const hasValidSnapshotData =
          existingSnapshot && Object.keys(existingSnapshot).some(k => k.startsWith('sheet_'));

        if (!existingSnapshot || !hasValidSnapshotData) {
          // 情况1：没有快照 或 快照数据为空 → 保存新快照
          saveSnapshot({ ...cachedRawData, _contextId: currentCtx });
        } else if (!existingSnapshot._contextId) {
          // 情况2：旧版快照（无 ID）→ 打上当前上下文标记，但不覆盖数据
          saveSnapshot({ ...existingSnapshot, _contextId: currentCtx });
        } else if (existingSnapshot._contextId !== currentCtx) {
          // 情况3：确认切换了聊天 → 覆盖为新数据
          cachedRawData._contextId = currentCtx;
          saveSnapshot(cachedRawData);
        }
        // 情况4：同一聊天且快照有效 → 不动，保持高亮正常
      }
    }

    const $searchInput = $('.acu-search-input');
    if ($('.acu-wrapper').length && $searchInput.is(':focus')) {
      if (rawData) {
        if (!isSaving) currentDiffMap = generateDiffMap(rawData);
        const tables = processJsonData(rawData);
        const activeTab = getActiveTabState();
        const currentTabName = activeTab && tables[activeTab] ? activeTab : null;

        if (currentTabName && tables[currentTabName]) {
          const newHtml = renderTableContent(tables[currentTabName], currentTabName);
          const $virtualDom = $('<div>').html(newHtml);
          $('.acu-card-grid').replaceWith($virtualDom.find('.acu-card-grid'));
          $('.acu-panel-title').html($virtualDom.find('.acu-panel-title').html());
          // [修复] 修正函数名错误，复用主事件绑定
          bindEvents(tables);
          bindOptionEvents(); // <--- 加上这一句，以此确保万无一失
          return;
        }
      }
    }

    let lastScrollX = 0;
    let lastScrollY = 0;

    const $oldContent = $('.acu-panel-content');
    if ($oldContent.length) {
      lastScrollX = $oldContent.scrollLeft();
      lastScrollY = $oldContent.scrollTop();
    }

    $('.acu-wrapper').remove();
    const tables = processJsonData(rawData || {});

    if (isSaving) {
      currentDiffMap = new Set();
    } else {
      currentDiffMap = generateDiffMap(rawData);
    }

    const savedOrder = getSavedTableOrder();
    let orderedNames = Object.keys(tables);
    if (savedOrder)
      orderedNames = savedOrder.filter(n => tables[n]).concat(orderedNames.filter(n => !savedOrder.includes(n)));

    const hiddenList = getHiddenTables();
    orderedNames = orderedNames.filter(n => !hiddenList.includes(n));

    const activeTab = getActiveTabState();
    let currentTabName = activeTab && tables[activeTab] && !hiddenList.includes(activeTab) ? activeTab : null;

    const config = getConfig();
    const isCollapsed = getCollapsedState();

    const layoutClass = config.layout === 'vertical' ? 'acu-layout-vertical' : '';
    // [补回这行] 定义面板位置样式 (悬浮/嵌入)
    const positionClass = `acu-mode-${config.positionMode || 'fixed'}`;

    // [新增] 自动列数 (智能填满) 逻辑
    let finalGridCols = config.gridColumns;
    if (finalGridCols === 'auto') {
      const n = orderedNames.length;

      if (n <= 4) {
        finalGridCols = n < 2 ? 2 : n;
      } else {
        const empty3 = Math.ceil(n / 3) * 3 - n;
        const empty4 = Math.ceil(n / 4) * 4 - n;
        finalGridCols = empty4 <= empty3 ? 4 : 3;
      }
    }

    // --- [修改] 提取选项数据 + 变化检测 ---
    let optionHtml = '';
    let currentOptionHash = null; // 当前选项的指纹

    if (config.showOptionPanel !== false) {
      const optionTables = [];
      Object.keys(tables).forEach(k => {
        if (k.includes('选项')) optionTables.push(tables[k]);
      });

      // [修改开始] 添加隐藏主面板的开关
      if (optionTables.length > 0) {
        const isNavHidden = Store.get('acu_hide_nav_only', false);
        const eyeIcon = isNavHidden ? 'fa-eye-slash' : 'fa-eye';
        const eyeTitle = isNavHidden ? '显示主面板' : '隐藏主面板';
        // 在标题栏右侧加一个小眼睛
        let buttonsHtml = `
                    <div class="acu-opt-header" style="position:relative;">
                        行动选项
                        <i class="fa-solid ${eyeIcon} acu-nav-toggle-btn"
                           style="position:absolute; right:6px; top:50%; transform:translateY(-50%); cursor:pointer; opacity:0.6;"
                           title="${eyeTitle}"></i>
                    </div>`;
        let hasBtns = false;
        // [修改结束]
        let optionValues = []; // 用于生成指纹

        optionTables.forEach(table => {
          if (table.rows) {
            table.rows.forEach(row => {
              row.forEach((cell, idx) => {
                if (idx > 0 && cell && String(cell).trim()) {
                  const cellStr = String(cell).trim();
                  buttonsHtml += `<button class="acu-opt-btn" data-val="${encodeURIComponent(cellStr)}">${escapeHtml(cellStr)}</button>`;
                  optionValues.push(cellStr);
                  hasBtns = true;
                }
              });
            });
          }
        });

        if (hasBtns) {
          optionHtml = `<div class="acu-option-panel">${buttonsHtml}</div>`;
          // 生成选项内容的指纹 (简单拼接)
          // [修复] 将隐藏状态加入指纹，强制触发重绘
          currentOptionHash = optionValues.join('|||') + (isNavHidden ? '_hidden' : '_show');
        }
      }
    }

    // [修改] 判断选项是否变化，并控制可见性
    const optionChanged = currentOptionHash !== lastOptionHash;
    if (optionChanged && currentOptionHash !== null) {
      // 选项内容发生了实质变化（有新选项了），才显示面板
      optionPanelVisible = true;
    }
    lastOptionHash = currentOptionHash; // 更新缓存

    let html = `<div class="acu-wrapper ${positionClass} acu-theme-${config.theme} ${layoutClass}" style="--acu-card-width:${config.cardWidth}px; --acu-font-size:${config.fontSize}px; --acu-opt-font-size:${config.optionFontSize || 12}px; --acu-grid-cols:${finalGridCols}">`;

    // [布局核心] 如果是嵌入模式，选项放在 DOM 最前面（因为是 column-reverse，视觉上在最下面）
    // [修改] 增加 optionPanelVisible 判断
    if (config.positionMode === 'embedded' && optionHtml && optionPanelVisible) {
      html += optionHtml;
    }

    // [修改开始] 读取隐藏状态
    const isNavHidden = Store.get('acu_hide_nav_only', false);
    const hideStyle = isNavHidden ? 'display:none !important;' : '';

    if (isCollapsed) {
      const colStyleClass = `acu-col-${config.collapseStyle || 'bar'}`;
      // 如果处于隐藏模式，连收起的小条也隐藏
      const collapseStyle = isNavHidden ? 'display:none !important;' : '';
      const alignClass = `acu-align-${config.collapseAlign || 'right'}`;
      html += `
                <div class="acu-expand-trigger ${colStyleClass} ${alignClass}" id="acu-btn-expand" style="${collapseStyle}">
                    <i class="fa-solid fa-table"></i> <span>数据库助手 (${Object.keys(tables).length})</span>
                </div>
            `;
    } else {
      // [修改] 读取保存的高度
      const savedHeight = currentTabName ? getTableHeights()[currentTabName] : null;
      // [修改] 支持仪表盘和变更面板渲染
      const isDashboardActive = Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
      const isChangesPanelActive = Store.get('acu_changes_panel_active', false);
      const shouldShowPanel = isDashboardActive || isChangesPanelActive || currentTabName;

      html += `
                <div class="acu-data-display ${shouldShowPanel ? 'visible' : ''} ${savedHeight ? 'acu-manual-mode' : ''}" id="acu-data-area" style="${savedHeight ? 'height:' + savedHeight + 'px;' : ''} ${hideStyle}">
                    ${
                      isChangesPanelActive
                        ? renderChangesPanel(rawData)
                        : isDashboardActive
                          ? renderDashboard(tables)
                          : currentTabName
                            ? renderTableContent(tables[currentTabName], currentTabName)
                            : ''
                    }
                </div>
                `;

      // [修复] 强制写入网格列数，防止浏览器初次渲染时卡成单列
      // PC端(>768px) CSS使用了 display:flex !important，会自动忽略这个 grid 属性，所以很安全
      const gridFixStyle = `grid-template-columns: repeat(${finalGridCols}, 1fr);`;

      html += `
                <div class="acu-nav-container ${config.actionsPosition === 'top' ? 'acu-pos-top' : ''}" id="acu-nav-bar" style="${hideStyle} ${gridFixStyle}">
                    <div class="acu-order-controls" id="acu-order-hint"><i class="fa-solid fa-arrows-alt"></i> 拖动调整顺序，完成后点击保存退出</div>
            `;

      // === 计算变更数量 + 验证错误数量（供审核按钮显示） ===
      const isChangesActive = Store.get('acu_changes_panel_active', false);
      const isSimpleModeNav = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
      let changesCount = 0;
      let validationErrorCount = 0;
      if (rawData) {
        const snapshot = loadSnapshot();
        if (snapshot) {
          for (const sheetId in rawData) {
            if (!sheetId.startsWith('sheet_')) continue;
            const newSheet = rawData[sheetId];
            const oldSheet = snapshot[sheetId];
            if (!newSheet?.content) continue;
            const newRows = newSheet.content.slice(1);
            const oldRows = oldSheet?.content?.slice(1) || [];
            newRows.forEach((row, rowIdx) => {
              const oldRow = oldRows[rowIdx];
              if (!oldRow) {
                changesCount++;
                return;
              }
              row.forEach((cell, colIdx) => {
                if (colIdx === 0) return;
                if (String(cell ?? '') !== String(oldRow[colIdx] ?? '')) changesCount++;
              });
            });
            if (oldRows.length > newRows.length) changesCount += oldRows.length - newRows.length;
          }
          for (const sheetId in snapshot) {
            if (sheetId.startsWith('sheet_') && !rawData[sheetId]) changesCount++;
          }
        }
        // 计算验证错误数量
        validationErrorCount = ValidationEngine.getErrorCount(rawData);
      }
      // 数据验证模式只显示验证错误数量，完整审核模式只显示变更数量
      const isValidationMode = isSimpleModeNav;
      const displayCount = isValidationMode ? validationErrorCount : changesCount;
      // 警告图标只在数据验证模式下且有错误时显示
      const showWarningIcon = isValidationMode && validationErrorCount > 0;

      // === 构建导航按钮（支持排序和隐藏） ===
      const navHiddenList = getHiddenTables();
      const navSavedOrder = getSavedTableOrder() || [];

      // 定义所有导航项（特殊按钮 + 表格）
      const SPECIAL_NAV_ITEMS = [
        { key: '__dice__', icon: 'fa-dice-d20', label: '掷骰', id: 'acu-btn-dice-nav', extraClass: 'acu-dice-nav-btn' },
        {
          key: '__changes__',
          icon: 'fa-code-compare',
          label: `审核${displayCount > 0 ? '(' + displayCount + ')' : ''}`,
          id: 'acu-btn-changes',
          extraClass: `acu-changes-btn${showWarningIcon ? ' has-validation-errors' : ''}`,
          isActive: isChangesActive,
          warningIcon: showWarningIcon,
        },
        {
          key: '__mvu__',
          icon: 'fa-code-branch',
          label: '变量',
          id: 'acu-btn-mvu',
          extraClass: 'acu-mvu-btn',
          checkAvailable: () => MvuModule.isAvailable(),
          isActive: getActiveTabState() === MvuModule.MODULE_ID,
        },
      ];

      // 构建完整的导航项列表
      let allNavItems = [];

      // 添加特殊按钮
      SPECIAL_NAV_ITEMS.forEach(item => {
        if (item.checkAvailable && !item.checkAvailable()) return;
        if (navHiddenList.includes(item.key)) return; // 被隐藏则跳过
        allNavItems.push({ ...item, isSpecial: true });
      });

      // 添加表格标签
      orderedNames.forEach(name => {
        allNavItems.push({
          key: name,
          icon: getIconForTableName(name),
          label: name,
          isSpecial: false,
          isActive: !isDashboardActive && !isChangesActive && currentTabName === name,
        });
      });

      // 应用保存的排序
      if (navSavedOrder.length > 0) {
        const orderMap = new Map(navSavedOrder.map((k, i) => [k, i]));
        allNavItems.sort((a, b) => {
          const aIdx = orderMap.has(a.key) ? orderMap.get(a.key) : 9999;
          const bIdx = orderMap.has(b.key) ? orderMap.get(b.key) : 9999;
          return aIdx - bIdx;
        });
      }

      // [固定] 仪表盘按钮（始终第一个，不参与排序/隐藏）
      // 注意：order 从 1 开始，避免移动端 Grid 布局问题
      html += `<button class="acu-nav-btn acu-dashboard-btn ${isDashboardActive ? 'active' : ''}" id="acu-btn-dashboard" style="order: 1;">
                <i class="fa-solid fa-chart-line"></i><span>仪表盘</span>
            </button>`;

      // 渲染所有导航项（order 从 2 开始）
      allNavItems.forEach((item, idx) => {
        const activeClass = item.isActive ? 'active' : '';
        const extraClass = item.extraClass || '';
        const orderVal = idx + 2; // 从 2 开始，仪表盘占用 1

        if (item.isSpecial) {
          // 特殊按钮
          const warningIconHtml = item.warningIcon
            ? '<i class="fa-solid fa-triangle-exclamation acu-nav-warning-icon"></i>'
            : '';
          html += `<button class="acu-nav-btn ${extraClass} ${activeClass}" id="${item.id}" style="order: ${orderVal};">
                        <i class="fa-solid ${item.icon}"></i><span>${escapeHtml(item.label)}</span>${warningIconHtml}
                    </button>`;
        } else {
          // 表格标签
          html += `<button class="acu-nav-btn ${activeClass}" data-table="${escapeHtml(item.key)}" style="order: ${orderVal};">
                        <i class="fa-solid ${item.icon}"></i><span>${escapeHtml(item.label)}</span>
                    </button>`;
        }
      });
      // 渲染固定功能按钮（order 设为最大值，确保在最后）
      html += `<div class="acu-actions-group" id="acu-active-actions" style="order: 9999;">`;
      ACTION_BUTTONS.forEach(btn => {
        html += `<button class="acu-action-btn" id="${btn.id}" title="${btn.title}"><i class="fa-solid ${btn.icon}"></i></button>`;
      });
      html += `</div>`;

      html += `</div>`; // 关闭 acu-nav-container
    }

    html += `</div>`; // 关闭 acu-wrapper

    const $existing = $('.acu-wrapper');
    if ($existing.length) {
      $existing.replaceWith(html);
    } else {
      insertHtmlToPage(html);
    }

    // --- [修改] 悬浮模式下，只有选项变化且可见时才插入 ---
    if (config.positionMode !== 'embedded' && optionHtml && optionPanelVisible) {
      if (optionChanged) {
        // 选项有变化，重新插入到最新 AI 消息
        injectIndependentOptions(optionHtml);
      } else {
        // 选项没变化，检查容器是否还存在
        const $existing = $('.acu-embedded-options-container');
        if ($existing.length === 0) {
          // 容器不存在了（可能被删掉了），重新插入
          injectIndependentOptions(optionHtml);
        }
        // 否则保持原位置不动
      }
    } else if (config.positionMode !== 'embedded') {
      // 没有选项数据时，清理旧的容器
      $('.acu-embedded-options-container').remove();
    } else {
      // [修复] 嵌入式模式：清理悬浮模式遗留的独立选项容器
      $('.acu-embedded-options-container').remove();
    }

    bindEvents(tables);
    bindOptionEvents();
    updateSaveButtonState();
    // [修复] 如果审核面板激活，绑定其事件
    if (Store.get('acu_changes_panel_active', false)) {
      bindChangesEvents();
    }

    setTimeout(() => {
      const $newContent = $('.acu-panel-content');
      const activeTab = getActiveTabState();
      const savedState = tableScrollStates[activeTab];

      if ($newContent.length) {
        // 1. 恢复面板整体位置
        // 优先使用 savedState (记忆)，其次使用 lastScrollY (防抖)
        if (savedState) {
          $newContent.scrollTop(savedState.top);
          $newContent.scrollLeft(savedState.left);
        } else {
          if (lastScrollY > 0) $newContent.scrollTop(lastScrollY);
          if (lastScrollX > 0) $newContent.scrollLeft(lastScrollX);
        }

        // 2. 恢复卡片内部滚动位置 (针对长文本)
        if (savedState && savedState.inner) {
          Object.keys(savedState.inner).forEach(key => {
            const scrollTop = savedState.inner[key];
            // 找到对应的行
            const $targetTitle = $newContent.find(`.acu-editable-title[data-row="${key}"]`);
            if ($targetTitle.length) {
              const $card = $targetTitle.closest('.acu-data-card');
              // 恢复卡片本身的滚动 (如果样式是 overflow on card)
              $card.scrollTop(scrollTop);
              // 同时也尝试恢复 body 的滚动 (如果样式是 overflow on body)
              $card.find('.acu-card-body').scrollTop(scrollTop);
            }
          });
        }
      }
    }, 0);
  };

  // [新增] 独立插入选项到最新气泡
  const injectIndependentOptions = htmlContent => {
    const { $ } = getCore();
    $('.acu-embedded-options-container').remove();

    // 复用寻找最新 AI 消息的逻辑
    const getTargetContainer = () => {
      const $allMes = $('#chat .mes');
      const $aiMes = $allMes.filter(function () {
        const $this = $(this);
        if ($this.attr('is_user') === 'true' || $this.attr('is_system') === 'true' || $this.hasClass('sys_mes'))
          return false;
        // 增加 data-is-system 属性判断，兼容性更好
        if ($this.find('.name_text').text().trim() === 'System' || $this.attr('data-is-system') === 'true')
          return false;
        // [修复] 忽略没有文本内容的空消息壳子
        if ($this.find('.mes_text').length === 0) return false;
        if ($this.css('display') === 'none') return false;
        return true;
      });
      if ($aiMes.length === 0) return null;

      const $targetMes = $aiMes.last();
      const $targetBlock = $targetMes.find('.mes_block');
      return $targetBlock.length ? $targetBlock : $targetMes;
    };

    const $target = getTargetContainer();
    if ($target && $target.length) {
      const optConfig = getConfig();
      const $container = $(
        `<div class="acu-embedded-options-container acu-theme-${optConfig.theme}" style="--acu-opt-font-size:${optConfig.optionFontSize || 12}px;"></div>`,
      );
      $container.html(htmlContent);
      $target.append($container);
    }
  };

  // [修复版] 绑定选项点击事件 (优化：事件委托 + 增强发送逻辑)
  const bindOptionEvents = () => {
    const { $ } = getCore();
    // 移除旧的直接绑定，改用 Body 委托，提升性能并防止动态元素事件丢失
    $('body')
      .off('click.acu_opt')
      .on('click.acu_opt', '.acu-opt-btn', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const config = getConfig();
        const val = decodeURIComponent($(this).data('val'));

        // 情况1: 没勾选自动发送 -> 填入输入框
        if (!config.clickOptionToAutoSend) {
          smartInsertToTextarea(val, 'action');
          $('#send_textarea').focus();
          return;
        }

        // 情况2: 自动发送
        // 方案A: TavernHelper (最稳健，支持 refresh: 'affected' 以提升性能)
        if (window.TavernHelper) {
          try {
            // 1. 使用 createChatMessages 直接插入消息
            if (window.TavernHelper.createChatMessages) {
              await window.TavernHelper.createChatMessages(
                [
                  {
                    role: 'user',
                    message: val,
                  },
                ],
                {
                  // 利用 TavernHelper 的特性，只刷新受影响的楼层，避免整个聊天重绘
                  refresh: 'affected',
                },
              );

              // 2. 触发生成
              if (window.TavernHelper.triggerSlash) {
                await window.TavernHelper.triggerSlash('/trigger');
              }
              return;
            }
          } catch (err) {
            console.warn('[ACU] TavernHelper 发送失败，尝试备用方案', err);
          }
        }

        // 方案B: SillyTavern 原生接口 (Slash Command)
        const ST = window.SillyTavern || window.parent?.SillyTavern;
        if (ST && ST.executeSlashCommandsWithOptions) {
          try {
            // 使用 raw=true 避免复杂字符转义问题 (参考 slash_command.txt)
            const safeVal = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            const cmd = `/send raw=true "${safeVal}"`;

            const sendResult = await ST.executeSlashCommandsWithOptions(cmd);

            if (!sendResult.isError && !sendResult.isAborted) {
              await ST.executeSlashCommandsWithOptions('/trigger');
              return;
            }
            console.warn('[ACU] ST接口 send 失败:', sendResult);
          } catch (err) {
            console.warn('[ACU] ST接口失败，尝试按钮模拟', err);
          }
        }

        // 方案C: 填入输入框 + 点击按钮 (最后兜底)
        const ta = $('#send_textarea');
        if (ta.length) {
          ta.val(val);
          ta.trigger('input').trigger('change');
          // 短暂延迟确保 React 状态同步
          await new Promise(r => setTimeout(r, 50));
          const sendBtn = $('#send_but').filter(':visible');
          if (sendBtn.length) {
            sendBtn[0].click();
          } else {
            // 尝试触发回车
            const enterEvent = $.Event('keydown', { keyCode: 13, which: 13, bubbles: true });
            ta.trigger(enterEvent);
          }
        }
      });
  };

  const insertHtmlToPage = html => {
    const { $ } = getCore();
    const config = getConfig();

    // --- 模式分支处理 ---

    // 1. 嵌入模式 (Embedded)：保持您原版 v19 的复杂逻辑，跟随气泡
    if (config.positionMode === 'embedded') {
      $('.acu-wrapper').remove(); // 嵌入模式下，为了准确性，先移除旧的

      const getTargetContainer = () => {
        const $allMes = $('#chat .mes');
        const $aiMes = $allMes.filter(function () {
          const $this = $(this);
          if ($this.attr('is_user') === 'true') return false;
          if ($this.attr('is_system') === 'true') return false;
          if ($this.hasClass('sys_mes')) return false;
          const name = $this.find('.name_text').text().trim();
          if (name === 'System') return false;
          if ($this.css('display') === 'none') return false;
          const $textDiv = $this.find('.mes_text');
          if ($textDiv.length === 0) return false;
          const textContent = $textDiv.text().trim();
          const hasImage = $textDiv.find('img').length > 0;
          if (textContent.length === 0 && !hasImage) return false;
          return true;
        });
        // 如果找不到 AI 消息，回退到 chat
        if ($aiMes.length === 0) return $('#chat');

        // 锁定逻辑
        const isGenerating = $('#send_but').is(':hidden') || $('#send_but_stop').is(':visible');

        let targetIndex = $aiMes.length - 1;
        const $targetMes = $aiMes.eq(targetIndex);
        const $targetBlock = $targetMes.find('.mes_block');
        return $targetBlock.length ? $targetBlock : $targetMes;
      };

      const $target = getTargetContainer();
      if ($target.length) {
        if ($target.hasClass('mes_block') || $target.hasClass('mes')) {
          if ($target.find('.acu-wrapper').length === 0) {
            $target.append(html);
          } else {
            $target.find('.acu-wrapper').replaceWith(html);
          }
        } else {
          // Fallback
          if ($('#chat').find('.acu-wrapper').length === 0) {
            $target.append(html);
          }
        }
      } else {
        $('body').append(html);
      }
      return;
    }

    // 2. 悬浮底部模式 (Fixed)：【核心修改】完全照搬脚本 B 的稳健逻辑
    // 不再每次都移除，而是“有则替换，无则追加”，防止闪烁
    const $chat = $('#chat');
    const $oldWrapper = $('.acu-wrapper');

    if ($oldWrapper.length) {
      $oldWrapper.replaceWith(html);
    } else {
      if ($chat.length) {
        $chat.append(html);
      } else {
        $('body').append(html);
      }
    }
  };
  // [新增] 渲染变更审核面板
  const renderChangesPanel = rawData => {
    const snapshot = loadSnapshot();
    const config = getConfig();

    // 运行数据验证
    const validationErrors = rawData ? ValidationEngine.validateAllData(rawData) : [];

    if (!snapshot || !rawData) {
      // 即使没有快照，如果有验证错误也显示
      if (validationErrors.length === 0) {
        return `
                <div class="acu-panel-header">
                    <div class="acu-panel-title">
                        <div class="acu-title-main"><i class="fa-solid fa-code-compare"></i> <span class="acu-title-text">更新审核</span></div>
                        <div class="acu-title-sub">对比上次保存的快照</div>
                    </div>
                    <div class="acu-header-actions">
                        <button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
                <div class="acu-panel-content" style="display:flex;align-items:center;justify-content:center;">
                    <div class="acu-empty-hint">暂无快照数据</div>
                </div>`;
      }
    }

    // 收集所有变更
    const changes = [];

    for (const sheetId in rawData) {
      if (!sheetId.startsWith('sheet_')) continue;
      const newSheet = rawData[sheetId];
      const oldSheet = snapshot[sheetId];
      if (!newSheet?.name || !newSheet?.content) continue;

      const tableName = newSheet.name;
      const headers = newSheet.content[0] || [];
      const newRows = newSheet.content.slice(1);
      const oldRows = oldSheet?.content?.slice(1) || [];

      // 检测修改和新增
      newRows.forEach((row, rowIdx) => {
        const oldRow = oldRows[rowIdx];

        if (!oldRow) {
          // 整行新增
          changes.push({
            type: 'row_added',
            tableName,
            tableKey: sheetId,
            rowIndex: rowIdx,
            headers,
            row,
            title: row[1] || `行 ${rowIdx + 1}`,
          });
        } else {
          // 检查单元格变化，收集同一行的所有修改
          const rowChanges = [];
          row.forEach((cell, colIdx) => {
            if (colIdx === 0) return; // 跳过索引列
            const oldVal = String(oldRow[colIdx] ?? '');
            const newVal = String(cell ?? '');
            if (oldVal !== newVal) {
              rowChanges.push({
                colIndex: colIdx,
                header: headers[colIdx] || `列${colIdx}`,
                oldValue: oldVal,
                newValue: newVal,
              });
            }
          });

          if (rowChanges.length === 1) {
            // 单字段修改
            const c = rowChanges[0];
            changes.push({
              type: 'cell_modified',
              tableName,
              tableKey: sheetId,
              rowIndex: rowIdx,
              colIndex: c.colIndex,
              header: c.header,
              oldValue: c.oldValue,
              newValue: c.newValue,
              rowTitle: row[1] || `行 ${rowIdx + 1}`,
            });
          } else if (rowChanges.length > 1) {
            // 多字段修改，合并为一条
            changes.push({
              type: 'row_modified',
              tableName,
              tableKey: sheetId,
              rowIndex: rowIdx,
              headers,
              row,
              oldRow,
              changedFields: rowChanges,
              rowTitle: row[1] || `行 ${rowIdx + 1}`,
            });
          }
        }
      });

      // 检测删除的行
      if (oldRows.length > newRows.length) {
        for (let i = newRows.length; i < oldRows.length; i++) {
          const oldRow = oldRows[i];
          changes.push({
            type: 'row_deleted',
            tableName,
            tableKey: sheetId,
            rowIndex: i,
            headers,
            row: oldRow,
            title: oldRow[1] || `行 ${i + 1}`,
          });
        }
      }
    }

    // 检测整个表被删除
    for (const sheetId in snapshot) {
      if (!sheetId.startsWith('sheet_')) continue;
      if (!rawData[sheetId]) {
        const oldSheet = snapshot[sheetId];
        changes.push({
          type: 'table_deleted',
          tableName: oldSheet?.name || sheetId,
          tableKey: sheetId,
        });
      }
    }

    // 获取数据验证模式状态
    const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);

    // 根据模式渲染不同的标题和按钮
    const panelTitle = isValidationMode ? '数据验证' : '完整审核';
    const panelIcon = isValidationMode ? 'fa-shield-halved' : 'fa-code-compare';
    const toggleTitle = isValidationMode ? '切换到完整审核模式' : '切换到数据验证模式';

    // 渲染 HTML
    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
                    <div class="acu-title-main"><i class="fa-solid ${panelIcon}"></i> <span class="acu-title-text">${panelTitle}</span></div>
                </div>
                <div class="acu-header-actions">
                    ${!isValidationMode ? '<button class="acu-changes-batch-btn acu-batch-accept" title="接受全部变更"><i class="fa-solid fa-check-double"></i></button>' : ''}
                    <button class="acu-changes-batch-btn acu-batch-reject" title="${isValidationMode ? '全部回滚' : '拒绝全部变更'}"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="acu-changes-batch-btn acu-simple-mode-toggle ${isValidationMode ? 'active' : ''}" title="${toggleTitle}">
                        <i class="fa-solid ${isValidationMode ? 'fa-filter-circle-xmark' : 'fa-filter'}"></i>
                    </button>
                    <div class="acu-height-control">
                        <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="审核面板" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                    </div>
                    <button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                </div>
            </div>`;

    // === 数据验证模式：在内容区域之前添加提示（不参与横向滚动） ===
    if (isValidationMode) {
      html += `<div class="acu-validation-mode-hint">
        <i class="fa-solid fa-info-circle"></i>即使回滚，只要数据不合法仍会显示在此
      </div>`;
    }

    html += `<div class="acu-panel-content acu-changes-content ${config.layout === 'horizontal' ? 'acu-changes-horizontal' : ''}">`;

    // === 数据验证模式：只渲染验证错误，使用变更列表的卡片样式 ===
    if (isValidationMode) {
      if (validationErrors.length === 0) {
        html += `<div class="acu-empty-hint" style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <i class="fa-solid fa-check-circle" style="font-size:32px;color:var(--acu-success-text);margin-bottom:10px;display:block;"></i>
                数据验证通过，无违规项
            </div>`;
      } else {
        // 使用变更列表的卡片样式渲染验证错误
        const groupedErrors = ValidationEngine.groupErrorsByTable(validationErrors);
        const collapsedGroups = Store.get('acu_validation_collapsed_groups', []);

        html += `<div class="acu-changes-list">`;

        for (const tableName in groupedErrors) {
          const tableErrors = groupedErrors[tableName];
          const isCollapsed = collapsedGroups.includes(tableName);

          html += `<div class="acu-changes-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="acu-changes-group-header acu-validation-group-header" data-table="${escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${getIconForTableName(tableName)}"></i> ${escapeHtml(tableName)}
                        <span class="acu-changes-count" style="background:#e74c3c;">${tableErrors.length}</span>
                    </div>
                    <div class="acu-changes-group-body" style="${isCollapsed ? 'display:none;' : ''}">`;

          tableErrors.forEach(error => {
            const ruleData = error.rule
              ? escapeHtml(
                  JSON.stringify({
                    ruleId: error.ruleId,
                    ruleType: error.ruleType,
                    tableName: error.tableName,
                    rowIndex: error.rowIndex,
                    columnName: error.columnName || '',
                    currentValue: error.currentValue || '',
                    rule: error.rule,
                  }),
                )
              : '';

            html += `<div class="acu-change-item acu-validation-error-item"
                         data-table="${escapeHtml(error.tableName)}"
                         data-row="${error.rowIndex}"
                         data-column="${escapeHtml(error.columnName || '')}"
                         data-rule-id="${escapeHtml(error.ruleId || '')}"
                         data-rule-type="${escapeHtml(error.ruleType || '')}"
                         data-rule-data="${ruleData}">
                        <span class="acu-change-badge" style="background:var(--acu-hl-manual-bg);color:var(--acu-hl-manual);">!</span>
                        <span class="acu-change-title">${escapeHtml(error.columnName || '整行')}${error.currentValue ? `: ${escapeHtml(error.currentValue.length > 15 ? error.currentValue.substring(0, 15) + '...' : error.currentValue)}` : ''}</span>
                        <span class="acu-validation-error-msg">${escapeHtml(error.errorMessage.length > 25 ? error.errorMessage.substring(0, 25) + '...' : error.errorMessage)}</span>
                        <div class="acu-change-actions">
                            <button class="acu-change-action-btn acu-action-reject" title="回滚"><i class="fa-solid fa-rotate-left"></i></button>
                            <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>`;
          });

          html += `</div></div>`;
        }

        html += `</div>`;
      }
    } else {
      // === 完整审核模式：只渲染变更列表，不包含验证错误 ===
      if (changes.length === 0) {
        html += `<div class="acu-empty-hint" style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <i class="fa-solid fa-check-circle" style="font-size:32px;color:var(--acu-success-text);margin-bottom:10px;display:block;"></i>
                当前数据与快照一致，无变更
            </div>`;
      } else {
        // 按表名分组
        const groupedChanges = {};
        changes.forEach(c => {
          const key = c.tableName;
          if (!groupedChanges[key]) groupedChanges[key] = [];
          groupedChanges[key].push(c);
        });

        html += `<div class="acu-changes-list">`;

        const collapsedGroups = Store.get('acu_changes_collapsed_groups', []);

        for (const tableName in groupedChanges) {
          const tableChanges = groupedChanges[tableName];
          const isCollapsed = collapsedGroups.includes(tableName);
          html += `<div class="acu-changes-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="acu-changes-group-header" data-table="${escapeHtml(tableName)}" style="cursor:pointer;">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon" style="font-size:10px;width:12px;transition:transform 0.2s;"></i>
                        <i class="fa-solid ${getIconForTableName(tableName)}"></i> ${escapeHtml(tableName)}
                        <span class="acu-changes-count">${tableChanges.length}</span>
                    </div>
                    <div class="acu-changes-group-body" style="${isCollapsed ? 'display:none;' : ''}">`;

          tableChanges.forEach(change => {
            if (change.type === 'row_added') {
              html += `<div class="acu-change-item acu-change-added"
                            data-change-type="row_added"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-added">新</span>
                            <span class="acu-change-title">${escapeHtml(change.title)}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'row_deleted') {
              html += `<div class="acu-change-item acu-change-deleted"
                            data-change-type="row_deleted"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-deleted">删</span>
                            <span class="acu-change-title" style="text-decoration:line-through;opacity:0.6;">${escapeHtml(change.title)}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受删除"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-restore" title="恢复此行"><i class="fa-solid fa-undo"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'cell_modified') {
              const oldShort = change.oldValue.length > 15 ? change.oldValue.substring(0, 15) + '...' : change.oldValue;
              const newShort = change.newValue.length > 15 ? change.newValue.substring(0, 15) + '...' : change.newValue;

              const isOptionTable = change.tableName && change.tableName.includes('选项');
              let fieldDisplay;
              if (isOptionTable) {
                fieldDisplay = `${escapeHtml(change.tableName)}.${escapeHtml(change.header)}`;
              } else {
                fieldDisplay = `${escapeHtml(change.rowTitle)}.${escapeHtml(change.header)}`;
              }

              html += `<div class="acu-change-item acu-change-modified"
                            data-change-type="cell_modified"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}"
                            data-col-index="${change.colIndex}"
                            data-old-value="${encodeURIComponent(change.oldValue)}">
                            <span class="acu-change-badge acu-badge-modified">更</span>
                            <span class="acu-change-field">${fieldDisplay}</span>
                            <span class="acu-change-diff">
                                <span class="acu-diff-old">${escapeHtml(oldShort || '(空)')}</span>
                                <span class="acu-diff-arrow">→</span>
                                <span class="acu-diff-new">${escapeHtml(newShort || '(空)')}</span>
                            </span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'row_modified') {
              // 多字段修改，显示修改数量
              const fieldCount = change.changedFields.length;
              const fieldNames = change.changedFields
                .slice(0, 2)
                .map(f => f.header)
                .join('、');
              const moreText = fieldCount > 2 ? ` 等${fieldCount}项` : '';

              html += `<div class="acu-change-item acu-change-modified"
                            data-change-type="row_modified"
                            data-table-key="${change.tableKey}"
                            data-row-index="${change.rowIndex}">
                            <span class="acu-change-badge acu-badge-modified">更</span>
                            <span class="acu-change-title">${escapeHtml(change.rowTitle)}</span>
                            <span class="acu-change-field-count">${escapeHtml(fieldNames)}${moreText}</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-reject" title="拒绝"><i class="fa-solid fa-rotate-left"></i></button>
                                <button class="acu-change-action-btn acu-action-edit" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            </div>
                        </div>`;
            } else if (change.type === 'table_deleted') {
              html += `<div class="acu-change-item acu-change-deleted"
                            data-change-type="table_deleted"
                            data-table-key="${change.tableKey}">
                            <span class="acu-change-badge acu-badge-deleted">删</span>
                            <span class="acu-change-title" style="text-decoration:line-through;opacity:0.6;">整表已删除</span>
                            <div class="acu-change-actions">
                                <button class="acu-change-action-btn acu-action-accept" title="接受"><i class="fa-solid fa-check"></i></button>
                                <button class="acu-change-action-btn acu-action-restore" title="恢复整表"><i class="fa-solid fa-undo"></i></button>
                            </div>
                        </div>`;
            }
          });

          html += `</div></div>`;
        }

        html += `</div>`;
      }
    }

    html += `</div>`;
    return html;
  };
  // [新增] 绑定变更面板事件
  const bindChangesEvents = () => {
    const { $ } = getCore();

    // 关闭按钮
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-close-btn')
      .off('click')
      .on('click', function () {
        Store.set('acu_changes_panel_active', false);
        $('#acu-data-area').removeClass('visible');
        $('.acu-nav-btn').removeClass('active');
      });

    // === 触摸滑动检测阈值（用于区分滑动和点击）===
    const TOUCH_MOVE_THRESHOLD = 10; // 移动超过10px视为滑动

    // === 验证错误：回滚按钮（恢复快照值）===
    $('.acu-validation-error-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const tableName = $item.data('table');
        const rowIndex = parseInt($item.data('row'), 10);
        const columnName = $item.data('column');

        const snapshot = loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据可恢复');
          return;
        }

        try {
          const rawData = cachedRawData || getTableData();
          for (const sheetId in rawData) {
            if (rawData[sheetId]?.name === tableName && snapshot[sheetId]) {
              const headers = rawData[sheetId].content?.[0] || [];
              const colIdx = headers.indexOf(columnName);
              if (colIdx >= 0 && snapshot[sheetId].content?.[rowIndex + 1]) {
                const snapshotValue = snapshot[sheetId].content[rowIndex + 1][colIdx];
                rawData[sheetId].content[rowIndex + 1][colIdx] = snapshotValue;
                await saveDataToDatabase(rawData, false, false);
                renderInterface();
                return;
              }
              break;
            }
          }
          if (window.toastr) window.toastr.warning('无法找到对应的快照数据');
        } catch (err) {
          console.error('[ACU] 恢复快照值失败:', err);
          if (window.toastr) window.toastr.error('恢复失败');
        }
      });

    // === 验证错误：编辑按钮（智能修改）===
    $('.acu-validation-error-item .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const ruleData = $item.data('rule-data');
        if (!ruleData) {
          if (window.toastr) window.toastr.warning('无法获取规则信息');
          return;
        }
        try {
          const parsed = typeof ruleData === 'string' ? JSON.parse(ruleData) : ruleData;
          const error = {
            ruleId: parsed.ruleId,
            ruleType: parsed.ruleType,
            rule: parsed.rule,
            tableName: $item.data('table') || parsed.tableName || '',
            rowIndex: parseInt($item.data('row'), 10) || parsed.rowIndex || 0,
            columnName: $item.data('column') || parsed.columnName || '',
            currentValue: parsed.currentValue || '',
            ruleName: parsed.ruleName || parsed.rule?.name || '',
            errorMessage: parsed.errorMessage || parsed.rule?.errorMessage || '',
          };
          showSmartFixModal(error);
        } catch (err) {
          console.error('[ACU] 解析规则数据失败:', err);
          if (window.toastr) window.toastr.error('解析规则数据失败');
        }
      });

    // === 验证错误项：点击定位（但按钮区域除外，且区分滑动和点击）===
    let validationItemTouchStartPos: { x: number; y: number } | null = null;

    $('.acu-validation-error-item')
      .off('click touchstart touchend touchmove')
      .on('touchstart', function (e) {
        const touch = (e.originalEvent as TouchEvent).touches[0];
        validationItemTouchStartPos = { x: touch.clientX, y: touch.clientY };
      })
      .on('touchmove', function (e) {
        if (!validationItemTouchStartPos) return;
        const touch = (e.originalEvent as TouchEvent).touches[0];
        const deltaX = Math.abs(touch.clientX - validationItemTouchStartPos.x);
        const deltaY = Math.abs(touch.clientY - validationItemTouchStartPos.y);
        // 如果移动超过阈值，清除起始位置，表示这是滑动
        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
          validationItemTouchStartPos = null;
        }
      })
      .on('touchend', function (e) {
        // 如果触摸位置已被清除（滑动），不触发点击
        if (!validationItemTouchStartPos) return;
        validationItemTouchStartPos = null;

        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        const tableName = $(this).data('table');
        const rowIndex = $(this).data('row');

        // 关闭审核面板并跳转到对应表格
        Store.set('acu_changes_panel_active', false);
        saveActiveTabState(tableName);
        renderInterface();

        // 延迟滚动到对应行
        setTimeout(() => {
          const $targetCard = $(`.acu-data-card[data-row-index="${rowIndex}"]`);
          if ($targetCard.length) {
            $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            $targetCard.addClass('acu-highlight-flash');
            setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
          }
        }, 300);
      })
      .on('click', function (e) {
        // 桌面端仍使用 click 事件
        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // 检测是否是触摸设备，如果是则 touchend 已处理
        if ('ontouchstart' in window) return;

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        const tableName = $(this).data('table');
        const rowIndex = $(this).data('row');

        // 关闭审核面板并跳转到对应表格
        Store.set('acu_changes_panel_active', false);
        saveActiveTabState(tableName);
        renderInterface();

        // 延迟滚动到对应行
        setTimeout(() => {
          const $targetCard = $(`.acu-data-card[data-row-index="${rowIndex}"]`);
          if ($targetCard.length) {
            $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            $targetCard.addClass('acu-highlight-flash');
            setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
          }
        }, 300);
      });

    // 折叠/展开分组（根据模式使用不同的存储键）
    $('.acu-changes-group-header')
      .off('click')
      .on('click', function (e) {
        if ($(e.target).closest('.acu-change-item').length) return;

        const tableName = $(this).data('table');
        const $group = $(this).closest('.acu-changes-group');
        const $body = $group.find('.acu-changes-group-body');
        const $icon = $(this).find('.acu-collapse-icon');

        // 根据是否是数据验证模式使用不同的存储键
        const isValidationMode = $(this).hasClass('acu-validation-group-header');
        const storageKey = isValidationMode ? 'acu_validation_collapsed_groups' : 'acu_changes_collapsed_groups';
        let collapsedGroups = Store.get(storageKey, []);

        if ($group.hasClass('collapsed')) {
          $group.removeClass('collapsed');
          $body.slideDown(200);
          $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
          collapsedGroups = collapsedGroups.filter(n => n !== tableName);
        } else {
          $group.addClass('collapsed');
          $body.slideUp(200);
          $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
          if (!collapsedGroups.includes(tableName)) {
            collapsedGroups.push(tableName);
          }
        }

        Store.set(storageKey, collapsedGroups);
      });

    // === 单项操作：接受（完整面板变更条目）===
    $('.acu-change-item .acu-action-accept')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');

        const snapshot = loadSnapshot();
        const rawData = cachedRawData || getTableData();
        if (!snapshot || !rawData) return;

        if (changeType === 'cell_modified') {
          // 接受单元格修改：将新值写入快照
          if (snapshot[tableKey]?.content?.[rowIndex + 1] && rawData[tableKey]?.content?.[rowIndex + 1]) {
            snapshot[tableKey].content[rowIndex + 1][colIndex] = rawData[tableKey].content[rowIndex + 1][colIndex];
          }
        } else if (changeType === 'row_modified') {
          // 接受整行修改：将整行新值写入快照
          if (snapshot[tableKey]?.content && rawData[tableKey]?.content?.[rowIndex + 1]) {
            snapshot[tableKey].content[rowIndex + 1] = [...rawData[tableKey].content[rowIndex + 1]];
          }
        } else if (changeType === 'row_added') {
          // 接受新增行：将新行写入快照
          if (rawData[tableKey]?.content?.[rowIndex + 1]) {
            if (!snapshot[tableKey]) {
              snapshot[tableKey] = JSON.parse(JSON.stringify(rawData[tableKey]));
            } else {
              snapshot[tableKey].content[rowIndex + 1] = [...rawData[tableKey].content[rowIndex + 1]];
            }
          }
        } else if (changeType === 'row_deleted') {
          // 接受删除：从快照中也删除该行
          if (snapshot[tableKey]?.content?.[rowIndex + 1]) {
            snapshot[tableKey].content.splice(rowIndex + 1, 1);
          }
        } else if (changeType === 'table_deleted') {
          // 接受整表删除：从快照中删除该表
          delete snapshot[tableKey];
        }

        saveSnapshot(snapshot);

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：拒绝（完整面板变更条目）===
    $('.acu-change-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');
        const oldValue = decodeURIComponent($item.data('old-value') || '');

        const snapshot = loadSnapshot();
        let rawData = cachedRawData || getTableData();
        if (!snapshot || !rawData) return;

        if (changeType === 'cell_modified') {
          // 拒绝单元格修改：恢复为快照中的旧值
          if (rawData[tableKey]?.content?.[rowIndex + 1]) {
            rawData[tableKey].content[rowIndex + 1][colIndex] = oldValue;
          }
        } else if (changeType === 'row_modified') {
          // 拒绝整行修改：从快照恢复整行
          if (snapshot[tableKey]?.content?.[rowIndex + 1] && rawData[tableKey]?.content) {
            rawData[tableKey].content[rowIndex + 1] = [...snapshot[tableKey].content[rowIndex + 1]];
          }
        } else if (changeType === 'row_added') {
          // 拒绝新增行：从数据中删除该行
          if (rawData[tableKey]?.content?.[rowIndex + 1]) {
            rawData[tableKey].content.splice(rowIndex + 1, 1);
          }
        }

        // [修复] 使用轻量级保存，只保存数据，不更新快照
        await saveDataOnly(rawData);

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：恢复（用于已删除的行/表）===
    $('.acu-action-restore')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');

        const snapshot = loadSnapshot();
        let rawData = cachedRawData || getTableData();
        if (!snapshot || !rawData) return;

        if (changeType === 'row_deleted') {
          // 恢复删除的行：从快照中取回该行
          if (snapshot[tableKey]?.content?.[rowIndex + 1]) {
            const restoredRow = [...snapshot[tableKey].content[rowIndex + 1]];
            if (!rawData[tableKey]) {
              rawData[tableKey] = JSON.parse(JSON.stringify(snapshot[tableKey]));
              rawData[tableKey].content = [snapshot[tableKey].content[0]];
            }
            // 插入到正确位置
            rawData[tableKey].content.splice(rowIndex + 1, 0, restoredRow);
          }
        } else if (changeType === 'table_deleted') {
          // 恢复整个表：从快照中取回
          if (snapshot[tableKey]) {
            rawData[tableKey] = JSON.parse(JSON.stringify(snapshot[tableKey]));
          }
        }

        // [修复] 使用轻量级保存，只保存数据，不更新快照
        await saveDataOnly(rawData);

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          refreshChangesPanel();
        });
      });

    // === 单项操作：编辑（完整面板变更条目，排除验证错误项）===
    $('.acu-change-item:not(.acu-validation-error-item) .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const changeType = $item.data('change-type');

        if (!tableKey || rowIndex === undefined) return;

        const rawData = cachedRawData || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const sheet = rawData[tableKey];
        const headers = sheet.content ? sheet.content[0] : [];
        const row = sheet.content ? sheet.content[rowIndex + 1] : null;

        if (!row) {
          if (window.toastr) window.toastr.warning('该行可能已被删除');
          return;
        }

        // 根据变更类型选择编辑方式
        if (changeType === 'row_modified') {
          // 多字段修改，打开整体编辑
          showRowCompareEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        } else if (changeType === 'cell_modified') {
          const colIndex = $item.data('col-index');
          const headerName = headers[colIndex] || `列${colIndex}`;
          const cellValue = row[colIndex] || '';
          showChangeSingleFieldModal(cellValue, headerName, sheet.name, rowIndex, colIndex, tableKey);
        } else {
          showChangeEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        }
      });

    // === 批量操作：接受全部 ===
    $('.acu-batch-accept')
      .off('click')
      .on('click', async function () {
        const rawData = cachedRawData || getTableData();
        if (!rawData) return;

        // 将当前数据完整保存为新快照
        saveSnapshot(JSON.parse(JSON.stringify(rawData)));
        currentDiffMap = new Set();

        // 刷新面板
        refreshChangesPanel();
      });

    // === 批量操作：拒绝全部 ===
    $('.acu-batch-reject')
      .off('click')
      .on('click', async function () {
        const snapshot = loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据');
          return;
        }

        // 将快照数据恢复为当前数据
        const restoredData = JSON.parse(JSON.stringify(snapshot));
        cachedRawData = restoredData;
        await saveDataToDatabase(restoredData, false, false);
      });

    // === 简洁模式切换 ===
    $('.acu-simple-mode-toggle')
      .off('click')
      .on('click', function () {
        const currentMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
        const newMode = !currentMode;
        Store.set(STORAGE_KEY_VALIDATION_MODE, newMode);

        // 刷新面板
        const rawData = cachedRawData || getTableData();
        $('#acu-data-area').html(renderChangesPanel(rawData));
        bindChangesEvents();

        // 更新导航栏计数
        updateChangesCount(rawData);
      });

    // === 高度拖动调节 ===
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-height-drag-handle')
      .off('pointerdown')
      .on('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const handle = this;
        handle.setPointerCapture(e.pointerId);
        $(handle).addClass('active');
        const $panel = $('#acu-data-area');
        const startHeight = $panel.height();
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          let newHeight = startHeight - dy; // 向上拖动增加高度
          if (newHeight < MIN_PANEL_HEIGHT) newHeight = MIN_PANEL_HEIGHT;
          if (newHeight > MAX_PANEL_HEIGHT) newHeight = MAX_PANEL_HEIGHT;
          $panel.css('height', newHeight + 'px');
        };
        handle.onpointerup = function (upE) {
          $(handle).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          // 保存高度
          const finalHeight = $panel.height();
          const heights = getTableHeights();
          heights[tableName] = finalHeight;
          saveTableHeights(heights);
        };
      })
      .off('dblclick')
      .on('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const $panel = $('#acu-data-area');
        $panel.css('height', ''); // 清除高度样式
        // 清除保存的高度
        const heights = getTableHeights();
        delete heights[tableName];
        saveTableHeights(heights);
      });

    // === 横向模式：智能区分横向和竖向滑动 ===
    const $horizontalScroller = $('.acu-changes-content.acu-changes-horizontal');
    if ($horizontalScroller.length) {
      $horizontalScroller[0].addEventListener(
        'touchstart',
        function (e) {
          this._touchStartX = e.touches[0].clientX;
          this._touchStartY = e.touches[0].clientY;
          this._scrollDirection = null; // 重置滚动方向
        },
        { passive: true },
      );

      $horizontalScroller[0].addEventListener(
        'touchmove',
        function (e) {
          if (!this._touchStartX) return;

          const deltaX = Math.abs(e.touches[0].clientX - this._touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - this._touchStartY);

          // 第一次移动时确定主滚动方向
          if (!this._scrollDirection && (deltaX > 5 || deltaY > 5)) {
            this._scrollDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
          }

          // 只在明确是横向滚动时才阻止事件传播
          // 竖向滚动时不做任何干预，让其自然触发页面滚动
          if (this._scrollDirection === 'horizontal' && deltaX > 10) {
            e.stopPropagation();
          }
        },
        { passive: false },
      );

      $horizontalScroller[0].addEventListener(
        'touchend',
        function () {
          this._touchStartX = null;
          this._touchStartY = null;
          this._scrollDirection = null;
        },
        { passive: true },
      );
    }
  };

  // [新增] 刷新变更面板（辅助函数）
  const refreshChangesPanel = () => {
    const { $ } = getCore();
    const rawData = cachedRawData || getTableData();
    currentDiffMap = generateDiffMap(rawData);

    const $panel = $('#acu-data-area');
    if ($panel.length && Store.get('acu_changes_panel_active', false)) {
      $panel.html(renderChangesPanel(rawData));
      bindChangesEvents();

      // 更新导航栏计数
      updateChangesCount(rawData);
    }
  };

  // [新增] 更新审核按钮计数（包含变更数 + 验证错误数）
  const updateChangesCount = rawData => {
    const { $ } = getCore();
    const snapshot = loadSnapshot();
    let changesCount = 0;

    if (snapshot && rawData) {
      for (const sheetId in rawData) {
        if (!sheetId.startsWith('sheet_')) continue;
        const newSheet = rawData[sheetId];
        const oldSheet = snapshot[sheetId];
        if (!newSheet?.content) continue;
        const newRows = newSheet.content.slice(1);
        const oldRows = oldSheet?.content?.slice(1) || [];
        newRows.forEach((row, rowIdx) => {
          const oldRow = oldRows[rowIdx];
          if (!oldRow) {
            changesCount++;
            return;
          }
          row.forEach((cell, colIdx) => {
            if (colIdx === 0) return;
            if (String(cell ?? '') !== String(oldRow[colIdx] ?? '')) changesCount++;
          });
        });
        if (oldRows.length > newRows.length) changesCount += oldRows.length - newRows.length;
      }
      for (const sheetId in snapshot) {
        if (sheetId.startsWith('sheet_') && !rawData[sheetId]) changesCount++;
      }
    }

    // 获取验证错误数量
    const validationErrorCount = rawData ? ValidationEngine.getErrorCount(rawData) : 0;

    // 根据模式决定显示的数量：数据验证模式只计错误数，完整审核模式只计变更数
    const isValidationMode = Store.get(STORAGE_KEY_VALIDATION_MODE, false);
    const displayCount = isValidationMode ? validationErrorCount : changesCount;
    // 警告图标只在数据验证模式下且有错误时显示
    const showWarningIcon = isValidationMode && validationErrorCount > 0;

    const $btn = $('#acu-btn-changes');
    const $span = $btn.find('span');
    $span.html(displayCount > 0 ? `审核(${displayCount})` : '审核');

    // 更新警告图标
    if (showWarningIcon) {
      if (!$btn.find('.acu-nav-warning-icon').length) {
        $span.append(' <i class="fa-solid fa-triangle-exclamation acu-nav-warning-icon"></i>');
      }
      $btn.addClass('has-validation-errors');
    } else {
      $btn.find('.acu-nav-warning-icon').remove();
      $btn.removeClass('has-validation-errors');
    }
  };
  // [新增] 变更面板专用编辑弹窗（保存后只更新单行快照）
  const showChangeEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    const inputsHtml = row
      .map((cell, idx) => {
        if (idx === 0) return '';
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        return `
                <div class="acu-card-edit-field" style="margin-bottom: 10px;">
                    <label style="display:block;font-size:12px;color:var(--acu-accent);font-weight:bold;margin-bottom:4px;">${escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-edit-textarea" data-col="${idx}" spellcheck="false" rows="1"
                                                        style="width:100%;min-height:40px;max-height:500px;padding:10px;resize:none;overflow-y:hidden;">${escapeHtml(val)}</textarea>                            </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">编辑变更 (#${rowIndex + 1} - ${escapeHtml(tableName)})</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
                        ${inputsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-change-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-change-save"><i class="fa-solid fa-check"></i> 保存并确认</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // [修复] 自动高度调节逻辑
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 scrollHeight
      el.style.height = 'auto';
      const contentHeight = el.scrollHeight + 2;
      const maxHeight = 500;
      el.style.height = Math.min(contentHeight, maxHeight) + 'px';
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    };

    // 1. 初始化时：使用 requestAnimationFrame 确保在 DOM 渲染后执行
    requestAnimationFrame(() => {
      dialog.find('textarea').each(function () {
        adjustHeight(this);
      });
    });

    // 2. 输入时：实时调整
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => {
      isSettingsOpen = false;
      dialog.remove();
    };
    dialog.find('#dlg-change-cancel').click(closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) closeDialog();
    });

    dialog.find('#dlg-change-save').click(async () => {
      let rawData = cachedRawData || getTableData();
      if (rawData && rawData[tableKey]) {
        const currentRow = rawData[tableKey]?.content?.[rowIndex + 1];
        if (!currentRow) {
          closeDialog();
          return;
        }

        let hasChanges = false;
        dialog.find('textarea').each(function () {
          const colIdx = parseInt($(this).data('col'));
          const newVal = $(this).val();
          if (String(currentRow[colIdx]) !== String(newVal)) {
            hasChanges = true;
            currentRow[colIdx] = newVal;
          }
        });

        if (hasChanges) {
          // 1. 保存到数据库（不更新快照）
          const api = getCore().getDB();
          if (api && api.importTableAsJson) {
            const dataToSave = { mate: rawData.mate || { type: 'chatSheets', version: 1 } };
            Object.keys(rawData).forEach(k => {
              if (k.startsWith('sheet_')) dataToSave[k] = rawData[k];
            });
            await api.importTableAsJson(JSON.stringify(dataToSave));
          }
          cachedRawData = rawData;

          // 2. 只更新快照中这一行（关键！）
          const snapshot = loadSnapshot();
          if (snapshot && snapshot[tableKey] && snapshot[tableKey].content) {
            snapshot[tableKey].content[rowIndex + 1] = [...currentRow];
            saveSnapshot(snapshot);
          }

          // 3. 重新计算 diffMap 并刷新变更面板
          currentDiffMap = generateDiffMap(rawData);

          // 4. 刷新变更面板
          const $panel = $('#acu-data-area');
          $panel.html(renderChangesPanel(rawData));
          bindChangesEvents();
        }
      }
      closeDialog();
    });
  };
  // [新增] 变更面板专用单字段编辑弹窗
  const showChangeSingleFieldModal = (value, headerName, tableName, rowIndex, colIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    // 获取快照中的旧值
    const snapshot = loadSnapshot();
    const oldValue = snapshot?.[tableKey]?.content?.[rowIndex + 1]?.[colIndex] ?? '';
    const hasOldValue = oldValue !== '' && String(oldValue) !== String(value);

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:450px;">
                    <div class="acu-edit-title">编辑: ${escapeHtml(tableName)} - ${escapeHtml(headerName)}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
                        ${
                          hasOldValue
                            ? `
                        <div class="acu-diff-section acu-diff-old-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-clock-rotate-left"></i> 原始值（快照）
                            </div>
                            <div class="acu-diff-readonly">${escapeHtml(oldValue)}</div>
                        </div>
                        <div class="acu-diff-arrow-down">
                            <i class="fa-solid fa-arrow-down"></i>
                        </div>
                        `
                            : ''
                        }
                        <div class="acu-diff-section acu-diff-new-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-pen"></i> ${hasOldValue ? '当前值（可编辑）' : '内容'}
                            </div>
                            <textarea class="acu-change-single-input acu-edit-textarea" spellcheck="false"
                                style="width:100%;min-height:60px;max-height:300px;padding:12px;resize:none;">${escapeHtml(value)}</textarea>
                        </div>
                    </div>
                    <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-single-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        ${hasOldValue ? `<button class="acu-dialog-btn acu-btn-revert" id="dlg-single-revert"><i class="fa-solid fa-rotate-left"></i> 恢复原值</button>` : ''}
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-single-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const $textarea = dialog.find('.acu-change-single-input');
    const adjustHeight = () => {
      $textarea[0].style.height = 'auto';
      const h = Math.max(60, Math.min($textarea[0].scrollHeight + 2, 300));
      $textarea[0].style.height = h + 'px';
    };
    setTimeout(adjustHeight, 0);
    $textarea.on('input', adjustHeight);
    $textarea.focus();

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-single-cancel').click(closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) closeDialog();
    });

    // [新增] 恢复原值按钮
    dialog.find('#dlg-single-revert').click(function () {
      $textarea.val(oldValue).trigger('input');
    });

    dialog.find('#dlg-single-save').click(async () => {
      const newVal = $textarea.val();
      let rawData = cachedRawData || getTableData();

      if (rawData && rawData[tableKey] && rawData[tableKey].content) {
        const currentRow = rawData[tableKey].content[rowIndex + 1];
        if (currentRow && String(currentRow[colIndex]) !== String(newVal)) {
          currentRow[colIndex] = newVal;

          // 保存到数据库
          await saveDataOnly(rawData);

          // 只更新快照中这一个单元格
          const snapshot = loadSnapshot();
          if (
            snapshot &&
            snapshot[tableKey] &&
            snapshot[tableKey].content &&
            snapshot[tableKey].content[rowIndex + 1]
          ) {
            snapshot[tableKey].content[rowIndex + 1][colIndex] = newVal;
            saveSnapshot(snapshot);
          }

          // 刷新
          currentDiffMap = generateDiffMap(rawData);
          refreshChangesPanel();
        }
      }
      closeDialog();
    });
  };

  // [新增] 多字段变更整体对比编辑弹窗
  const showRowCompareEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = getCore();
    const config = getConfig();

    // 获取快照中的旧行
    const snapshot = loadSnapshot();
    const oldRow = snapshot?.[tableKey]?.content?.[rowIndex + 1] || [];

    // 构建字段对比列表
    let fieldsHtml = '';
    for (let idx = 1; idx < headers.length; idx++) {
      const headerName = headers[idx] || `列 ${idx}`;
      const oldVal = oldRow[idx] ?? '';
      const newVal = row[idx] ?? '';
      const isChanged = String(oldVal) !== String(newVal);

      fieldsHtml += `
                <div class="acu-row-edit-field ${isChanged ? 'acu-field-changed' : ''}">
                    <div class="acu-row-edit-label">${escapeHtml(headerName)} ${isChanged ? '<span class="acu-changed-badge">已改</span>' : ''}</div>
                    ${isChanged ? `<div class="acu-row-edit-old">${escapeHtml(oldVal) || '<span class="acu-empty-val">(空)</span>'}</div>` : ''}
                    <textarea class="acu-row-edit-input acu-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${escapeHtml(newVal)}</textarea>
                </div>
            `;
    }

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:550px;">
                    <div class="acu-edit-title">整体编辑: ${escapeHtml(tableName)} - ${escapeHtml(row[1] || '行 ' + (rowIndex + 1))}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px; max-height:60vh;">
                        ${fieldsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-row-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn" id="dlg-row-revert"><i class="fa-solid fa-rotate-left"></i> 全部恢复</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-row-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight + 2, 200) + 'px';
    };
    dialog.find('textarea').each(function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-row-cancel').click(closeDialog);
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) closeDialog();
    });

    // 全部恢复
    dialog.find('#dlg-row-revert').click(function () {
      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        $(this)
          .val(oldRow[colIdx] ?? '')
          .trigger('input');
      });
    });

    // 保存
    dialog.find('#dlg-row-save').click(async () => {
      let rawData = cachedRawData || getTableData();
      if (!rawData?.[tableKey]?.content?.[rowIndex + 1]) {
        closeDialog();
        return;
      }

      const currentRow = rawData[tableKey].content[rowIndex + 1];
      let hasChanges = false;

      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        const newVal = $(this).val();
        if (String(currentRow[colIdx]) !== String(newVal)) {
          hasChanges = true;
          currentRow[colIdx] = newVal;
        }
      });

      if (hasChanges) {
        await saveDataOnly(rawData);

        // 更新快照中这一行
        const snapshot = loadSnapshot();
        if (snapshot?.[tableKey]?.content) {
          snapshot[tableKey].content[rowIndex + 1] = [...currentRow];
          saveSnapshot(snapshot);
        }

        currentDiffMap = generateDiffMap(rawData);
        refreshChangesPanel();
      }
      closeDialog();
    });
  };
  const renderDashboard = allTables => {
    const config = getConfig();

    // [保留] 通用列索引查找函数 - 供未迁移模块使用
    const findColIndex = (headers, keywords) => {
      if (!headers || !Array.isArray(keywords)) return -1;
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (keywords.some(kw => h.includes(kw.toLowerCase()))) return i;
      }
      return -1;
    };

    // [重构] 使用统一配置中心查找表格
    const globalResult = DashboardDataParser.findTable(allTables, 'global');
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const locationResult = DashboardDataParser.findTable(allTables, 'location');
    const npcResult = DashboardDataParser.findTable(allTables, 'npc');
    const questResult = DashboardDataParser.findTable(allTables, 'quest');
    const bagResult = DashboardDataParser.findTable(allTables, 'bag');
    const skillResult = DashboardDataParser.findTable(allTables, 'skill');
    const equipResult = DashboardDataParser.findTable(allTables, 'equip');

    // [兼容] 保留旧变量名供后续未迁移模块使用
    const locationTable = locationResult?.data;
    const playerTable = playerResult?.data;
    const questTable = questResult?.data;
    const npcTable = npcResult?.data;
    const bagTable = bagResult?.data;
    const skillTable = skillResult?.data;
    const equipTable = equipResult?.data;

    // [重构] 主角数据 - 使用新解析器
    let player = { name: '主角', status: '正常', position: '', attrs: '', money: '0' };
    const playerParsed = DashboardDataParser.parseRows(playerResult, 'player');

    if (playerParsed.length > 0) {
      const p = playerParsed[0];
      player.name = p.name || '主角';
      player.status = p.status || '正常';
      player.position = p.position || '';
      player.money = p.money || '';
      player.resources = '';

      // [特殊处理] 属性列可能有多个，需要合并
      if (playerResult?.data?.headers && playerResult?.data?.rows?.[0]) {
        const headers = playerResult.data.headers;
        const row = playerResult.data.rows[0];
        let allAttrsStr = '';
        headers.forEach((h, idx) => {
          if (h && h.includes('属性')) {
            const val = row[idx];
            if (val) allAttrsStr += (allAttrsStr ? '; ' : '') + val;
          }
        });
        player.attrs = allAttrsStr;

        // 解析资源数据
        headers.forEach((h, idx) => {
          if (h && (h.includes('资源') || h.includes('金钱'))) {
            const val = row[idx];
            if (val) player.resources = val;
          }
        });
      }
    }

    // [兼容] 保留旧变量供后续HTML渲染使用
    const playerRows = playerTable?.rows || [];
    const playerHeaders = playerTable?.headers || [];

    // [重构] 从全局数据表获取当前地点信息 - 使用新解析器
    const globalTable = globalResult?.data;
    let globalDetailLocation = ''; // 详细地点（用于高亮匹配）
    let globalLocation = ''; // 次要地区（备选）

    if (globalResult?.data?.rows?.length > 0) {
      const headers = globalResult.data.headers || [];
      const row = globalResult.data.rows[0];

      // 优先获取详细地点
      const detailIdx = DashboardDataParser.findColumnIndex(headers, 'detailLocation', globalResult.config);
      if (detailIdx >= 0 && row[detailIdx]) {
        globalDetailLocation = row[detailIdx];
      }

      // 备选：次要地区
      const locIdx = DashboardDataParser.findColumnIndex(headers, 'currentLocation', globalResult.config);
      globalLocation = locIdx >= 0 && row[locIdx] ? row[locIdx] : row[2] || '';
    }

    // currentPlaceName 优先使用详细地点，其次次要地区，最后从主角位置提取
    let currentPlaceName =
      globalDetailLocation ||
      globalLocation ||
      (player.position.includes('-') ? player.position.split('-')[0].trim() : player.position);

    // [重构] NPC数据 - 使用新解析器
    const npcTableName = npcResult?.name || '重要人物表';
    const npcTableKey = npcResult?.key || '';
    const npcHeaders = npcTable?.headers || [];

    const npcParsed = DashboardDataParser.parseRows(npcResult, 'npc');

    // 分离在场和离场的NPC
    let inSceneNPCs = [];
    let offSceneNPCs = [];
    npcParsed.forEach(npc => {
      const inSceneVal = String(npc.inScene || '').toLowerCase();
      const npcData = {
        name: npc.name || '未知',
        status: npc.status || '',
        position: npc.position || '',
        index: npc._rowIndex,
      };
      if (inSceneVal === 'true' || inSceneVal === '在场') {
        inSceneNPCs.push(npcData);
      } else {
        offSceneNPCs.push(npcData);
      }
    });
    // 合并：在场的排前面
    let allNPCs = [...inSceneNPCs, ...offSceneNPCs];

    // [重构] 任务数据 - 使用新解析器 + 过滤器
    const questTableName = questResult?.name || '备忘事项';
    const questParsed = DashboardDataParser.parseRows(questResult, 'quest');
    const activeQuestParsed = DashboardDataParser.applyFilter(questParsed, 'active', 'quest');

    // 任务排序：主线 > 支线 > 日常 > 其他
    const questTypeOrder = type => {
      const t = String(type || '').toLowerCase();
      if (t.includes('主线')) return 0;
      if (t.includes('支线')) return 1;
      if (t.includes('日常')) return 2;
      return 3;
    };
    let activeTasks = activeQuestParsed
      .map(q => ({
        name: q.name || '任务',
        type: q.type || '',
        progress: q.progress || '',
        _rowIndex: q._rowIndex,
      }))
      .sort((a, b) => questTypeOrder(a.type) - questTypeOrder(b.type))
      .slice(0, 5);
    // [重构] 背包物品数据 - 使用新解析器
    const bagTableName = bagResult?.name || '背包物品表';

    const bagParsed = DashboardDataParser.parseRows(bagResult, 'bag');
    let bagItems = bagParsed.slice(0, 6).map(item => ({
      name: item.name || '未知物品',
      count: item.count || '1',
      type: item.type || '',
    }));

    // [重构] 技能数据 - 使用新解析器
    const skillTableName = skillResult?.name || '主角技能表';

    const skillParsed = DashboardDataParser.parseRows(skillResult, 'skill');
    let skills = skillParsed.slice(0, 6).map(s => ({
      name: s.name || '未知技能',
      level: s.level || '',
      type: s.type || '',
    }));

    // [重构] 装备数据 - 使用新解析器 + 过滤器
    const equipTableName = equipResult?.name || '装备表';

    const equipParsed = DashboardDataParser.parseRows(equipResult, 'equip');
    const equippedParsed = DashboardDataParser.applyFilter(equipParsed, 'equipped', 'equip');

    let equippedItems = equippedParsed.slice(0, 4).map(e => ({
      name: e.name || '未知装备',
      type: e.type || '',
      part: e.part || '',
    }));
    // [重构] 地点数据 - 使用新解析器
    const locationTableName = locationResult?.name || '世界地图点';
    const locationTableKey = locationResult?.key || '';

    const locationParsed = DashboardDataParser.parseRows(locationResult, 'location');

    // 构建HTML
    let html = `
        <div class="acu-panel-header">
            <div class="acu-panel-title">
                <div class="acu-title-main"><i class="fa-solid fa-chart-line"></i> <span class="acu-title-text">仪表盘</span></div>
                <div class="acu-title-sub">综合状态总览</div>
            </div>
            <div class="acu-header-actions">
                <div class="acu-height-control">
                    <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="仪表盘" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                </div>
                <button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
        </div>
        <div class="acu-panel-content acu-dashboard-content">
            <div class="acu-dash-body ${config.layout === 'horizontal' ? 'acu-dash-horizontal' : ''}">
            <!-- 左列：主角状态 + 技能 -->
                <div class="acu-dash-player">
                    <h3 class="acu-dash-clickable acu-dash-preview-trigger"
                        data-table-key="${playerResult?.key || ''}"
                        data-row-index="0"
                        data-preview-type="player"
                        style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
                        <span><i class="fa-solid fa-user-circle"></i> ${escapeHtml(replaceUserPlaceholders(player.name))}</span>
                        <span style="font-size:11px;font-weight:normal;color:var(--acu-text-main);background:var(--acu-badge-bg);padding:2px 8px;border-radius:10px;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(player.status)}">${escapeHtml(player.status.length > 6 ? player.status.substring(0, 6) + '..' : player.status)}</span>
                    </h3>
                    <div class="acu-player-status" style="margin-bottom:8px;">
                        ${(() => {
                          // 解析资源数据
                          const resourcesStr = player.resources || player.money || '';
                          const parsedResources = parseAttributeString(resourcesStr);
                          if (parsedResources.length > 0) {
                            return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;max-height:52px;overflow-y:auto;margin-bottom:6px;padding-bottom:6px;border-bottom:1px dashed var(--acu-border);">
                                    ${parsedResources
                                      .slice(0, 4)
                                      .map(
                                        res => `
                                        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 3px;">
                                            <span style="color:var(--acu-text-sub);font-size:10px;white-space:nowrap;" title="${escapeHtml(res.name)}">${escapeHtml(res.name.substring(0, 3))}</span>
                                            <div style="display:flex;align-items:center;gap:2px;flex-shrink:0;">
                                                <span style="color:var(--acu-accent);font-size:11px;font-weight:bold;">${res.value}</span>
                                                <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${res.value}" data-name="${escapeHtml(res.name)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;" title="以${res.name}(${res.value})进行检定"></i>
                                            </div>
                                        </div>
                                    `,
                                      )
                                      .join('')}
                                </div>`;
                          }
                          return '';
                        })()}
        ${(() => {
          // 收集所有属性列的数据
          let allAttrs = [];
          if (playerRows.length > 0 && playerHeaders.length > 0) {
            const row = playerRows[0];
            playerHeaders.forEach((h, idx) => {
              if (h && h.includes('属性')) {
                const parsed = parseAttributeString(row[idx] || '');
                parsed.forEach(attr => {
                  if (!allAttrs.some(a => a.name === attr.name)) {
                    allAttrs.push(attr);
                  }
                });
              }
            });
          }

          if (allAttrs.length > 0) {
            // 三列网格布局，最大3行（约78px），超出滚动
            return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 6px;max-height:78px;overflow-y:auto;overflow-x:hidden;">
                    ${allAttrs
                      .map(
                        attr => `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 3px;border-bottom:1px dashed var(--acu-border);min-width:0;">
                            <span style="color:var(--acu-text-sub);font-size:10px;white-space:nowrap;" title="${escapeHtml(attr.name)}">${escapeHtml(attr.name.substring(0, 2))}</span>
                            <div style="display:flex;align-items:center;gap:2px;flex-shrink:0;">
                                <span style="color:var(--acu-text-main);font-size:11px;font-weight:bold;">${attr.value}</span>
                                <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${attr.value}" data-name="${escapeHtml(attr.name)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;" title="以${attr.name}(${attr.value})进行检定"></i>
                            </div>
                        </div>
                    `,
                      )
                      .join('')}
                </div>`;
          }
          return '';
        })()}
                    </div>

                    <h4 class="acu-dash-table-link" data-table="${escapeHtml(skillTableName)}" style="font-size:12px;color:var(--acu-accent);margin:10px 0 6px 0;"><i class="fa-solid fa-bolt"></i> 技能 (${skillParsed.length})</h4>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2px 6px;max-height:78px;overflow-y:auto;overflow-x:hidden;">
                    ${
                      skills.length > 0
                        ? skills
                            .map((skill, idx) => {
                              const skillValue = extractNumericValue(skill.level);
                              const hasNumeric = skillValue > 0;
                              const skillRowIndex = skillParsed.findIndex(s => s.name === skill.name);
                              return `<div class="acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${skillResult?.key || ''}"
                            data-row-index="${skillRowIndex >= 0 ? skillRowIndex : idx}"
                            data-preview-type="skill"
                            style="display:flex;justify-content:space-between;align-items:center;padding:2px 3px;border-bottom:1px dashed var(--acu-border);min-width:0;cursor:pointer;">
                            <span style="color:var(--acu-text-sub);font-size:10px;white-space:nowrap;" title="${escapeHtml(skill.name)}">${escapeHtml(skill.name.length > 5 ? skill.name.substring(0, 5) + '..' : skill.name)}</span>
                            <div style="display:flex;align-items:center;gap:2px;flex-shrink:0;">
                                ${
                                  hasNumeric
                                    ? `<span style="color:var(--acu-text-main);font-size:11px;font-weight:bold;">${skillValue}</span>
                                <i class="fa-solid fa-dice-d20 acu-dash-dice-btn" data-target="${skillValue}" data-name="${escapeHtml(skill.name)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;" title="以${skill.name}(${skillValue})进行检定"></i>`
                                    : `<span style="color:var(--acu-text-sub);font-size:10px;">${escapeHtml(skill.level || '-')}</span>`
                                }
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div style="grid-column:1/-1;text-align:center;color:var(--acu-text-sub);padding:8px;font-size:11px;">暂无技能</div>'
                    }
                    </div>
                </div>

                <!-- 中列：地点 + NPC -->
                <div class="acu-dash-locations">
                    <h3 class="acu-dash-table-link" data-table="${escapeHtml(locationTableName)}"><i class="fa-solid fa-map"></i> 地点 (${locationParsed.length})</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;max-height:100px;overflow-y:auto;overflow-x:hidden;margin-bottom:10px;">
                    ${
                      locationParsed.length > 0
                        ? locationParsed
                            .map((loc, idx) => {
                              const areaName = loc.name || '未知';
                              const isCurrent =
                                currentPlaceName &&
                                (areaName.includes(currentPlaceName) || currentPlaceName.includes(areaName));
                              return `<div class="acu-location-item acu-dash-clickable acu-dash-preview-trigger ${isCurrent ? 'acu-current-location' : ''}"
                            data-table-key="${escapeHtml(locationTableKey)}"
                            data-row-index="${loc._rowIndex}"
                            data-preview-type="location"
                            style="padding:4px 8px;display:flex;justify-content:space-between;align-items:center;">
                            <span style="display:flex;align-items:center;gap:6px;">
                                ${isCurrent ? '<i class="fa-solid fa-location-dot"></i>' : '<i class="fa-solid fa-map-pin" style="font-size:9px;opacity:0.4;"></i>'}
                                <span title="${escapeHtml(areaName)}">${escapeHtml(areaName.length > 6 ? areaName.substring(0, 6) + '..' : areaName)}</span>
                            </span>
                            ${!isCurrent ? `<i class="fa-solid fa-walking acu-dash-goto-btn" data-location="${escapeHtml(areaName)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;" title="前往${areaName}"></i>` : '<i class="fa-solid fa-street-view" title="您在这里"></i>'}
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无地点数据</div>'
                    }
                    </div>

                    <h3 class="acu-dash-table-link" data-table="${escapeHtml(npcTableName)}" style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
                        <span><i class="fa-solid fa-users"></i> 角色 (${allNPCs.length})</span>
                        <span style="display:flex;gap:8px;">
                            <i class="fa-solid fa-project-diagram acu-dash-relation-graph-btn" title="人物关系图" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.6;font-size:12px;padding:4px;"></i>
                            <i class="fa-solid fa-user-circle acu-dash-avatar-manager-btn" title="头像管理" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.6;font-size:12px;padding:4px;"></i>
                        </span>
                    </h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;max-height:150px;overflow-y:auto;overflow-x:hidden;">
                    ${
                      allNPCs.length > 0
                        ? allNPCs
                            .slice(0, 12)
                            .map((npc, npcIdx) => {
                              const isInScene = inSceneNPCs.some(n => n.name === npc.name);
                              const isLastNpc = npcIdx === Math.min(allNPCs.length, 12) - 1;
                              const npcAvatar = AvatarManager.get(npc.name);
                              const avatarOffsetX = AvatarManager.getOffsetX(npc.name);
                              const avatarOffsetY = AvatarManager.getOffsetY(npc.name);
                              const avatarScale = AvatarManager.getScale(npc.name);
                              const avatarStyle = npcAvatar
                                ? `background-image:url('${npcAvatar}');background-size:${avatarScale}%;background-position:${avatarOffsetX}% ${avatarOffsetY}%;`
                                : '';
                              const offSceneFilter = isInScene
                                ? ''
                                : 'filter:grayscale(80%) brightness(0.7);opacity:0.5;';
                              return `<div class="acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${escapeHtml(npcTableKey)}"
                            data-row-index="${npc.index}"
                            data-preview-type="npc"
                            style="padding:6px 4px;${!isLastNpc ? 'border-bottom:1px dashed var(--acu-border);' : ''}">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span class="acu-task-name" style="font-size:12px;display:flex;align-items:center;gap:6px;">
                                    <span class="acu-dash-npc-avatar" style="width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--acu-btn-bg);border:1.5px solid ${isInScene ? 'var(--acu-accent)' : 'var(--acu-border)'};${avatarStyle}${offSceneFilter}" title="${isInScene ? '在场' : '不在场'}">
                                        ${!npcAvatar ? `<span style="font-size:10px;font-weight:bold;color:var(--acu-text-sub);${offSceneFilter}">${escapeHtml(npc.name.charAt(0))}</span>` : ''}
                                    </span>
                                    <span title="${escapeHtml(npc.name)}" style="${isInScene ? '' : 'opacity:0.6;'}">${escapeHtml(npc.name.length > 4 ? npc.name.substring(0, 4) + '..' : npc.name)}</span>
                                </span>
                                <div style="display:flex;align-items:center;">
                                    <i class="fa-solid fa-people-arrows acu-dash-contest-btn" data-npc="${escapeHtml(npc.name)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:11px;" title="与${npc.name}进行对抗检定"></i>
                                </div>
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">暂无重要人物</div>'
                    }
                    </div>
                </div>

                <!-- 右列：背包 + 技能 + 任务 -->
                <div class="acu-dash-intel">
                    <h3 class="acu-dash-table-link" data-table="${escapeHtml(bagTableName)}"><i class="fa-solid fa-bag-shopping"></i> 物品 (${bagParsed.length})</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;max-height:80px;overflow-y:auto;margin-bottom:10px;">
                    ${
                      bagItems.length > 0
                        ? bagItems
                            .map((item, idx) => {
                              const isLastBag = idx === bagItems.length - 1;
                              return `<div class="acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${bagResult?.key || ''}"
                            data-row-index="${idx}"
                            data-preview-type="bag"
                            style="display:flex;justify-content:space-between;align-items:center;padding:5px 4px;font-size:11px;cursor:pointer;${!isLastBag ? 'border-bottom:1px dashed var(--acu-border);' : ''}">
                            <span style="color:var(--acu-text-main);flex:1;white-space:nowrap;" title="${escapeHtml(item.name)}">${escapeHtml(item.name.length > 4 ? item.name.substring(0, 4) + '..' : item.name)}</span>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <i class="fa-solid fa-hand-pointer acu-dash-use-item-btn" data-item="${escapeHtml(item.name)}" style="cursor:pointer;color:var(--acu-text-sub);opacity:0.4;font-size:10px;" title="使用${item.name}"></i>
                                <span style="color:var(--acu-accent);font-weight:bold;">${escapeHtml(item.count)}</span>
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">背包为空</div>'
                    }
                    </div>

                    <h3 class="acu-dash-table-link" data-table="${escapeHtml(equipTableName)}" style="margin-top:10px;"><i class="fa-solid fa-shield-halved"></i> 装备 (${equippedItems.length})</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;max-height:80px;overflow-y:auto;margin-bottom:10px;">
                    ${
                      equippedItems.length > 0
                        ? equippedItems
                            .map((item, idx) => {
                              const isLast = idx === equippedItems.length - 1;
                              return `<div class="acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${equipResult?.key || ''}"
                            data-row-index="${equipParsed.findIndex(r => r.name === item.name)}"
                            data-preview-type="equipment"
                            style="display:flex;justify-content:space-between;align-items:center;padding:5px 4px;font-size:11px;cursor:pointer;${!isLast ? 'border-bottom:1px dashed var(--acu-border);' : ''}">
                            <span style="color:var(--acu-text-main);" title="${escapeHtml(item.name)}">${escapeHtml(item.name.length > 5 ? item.name.substring(0, 5) + '..' : item.name)}</span>
                            <span style="color:var(--acu-text-sub);font-size:10px;">${escapeHtml(item.part || item.type)}</span>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">无装备</div>'
                    }
                    </div>

                    <h3 class="acu-dash-table-link" data-table="${escapeHtml(questTableName)}" style="margin-top:10px;"><i class="fa-solid fa-clipboard-list"></i> 任务 (${activeTasks.length})</h3>
                    ${
                      activeTasks.length > 0
                        ? activeTasks
                            .map((t, idx) => {
                              const isMain = String(t.type || '').includes('主线');
                              // 解析进度百分比
                              let progressPercent = null;
                              const progressMatch = String(t.progress || '').match(/(\d+)\s*%/);
                              if (progressMatch) {
                                progressPercent = Math.min(100, Math.max(0, parseInt(progressMatch[1], 10)));
                              }
                              const progressBar =
                                progressPercent !== null
                                  ? `<div style="width:40px;height:4px;background:var(--acu-border);border-radius:2px;overflow:hidden;"><div style="width:${progressPercent}%;height:100%;background:var(--acu-accent);"></div></div>`
                                  : '';
                              return `<div class="acu-task-item acu-dash-clickable acu-dash-preview-trigger"
                            data-table-key="${questResult?.key || ''}"
                            data-row-index="${t._rowIndex !== undefined ? t._rowIndex : questParsed.findIndex(q => q.name === t.name)}"
                            data-preview-type="quest"
                            style="padding:4px 8px;margin-bottom:3px;cursor:pointer;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div class="acu-task-name" style="font-size:11px;${isMain ? 'font-weight:600;' : ''}">${escapeHtml(t.name)}</div>
                                ${progressBar}
                            </div>
                        </div>`;
                            })
                            .join('')
                        : '<div class="acu-empty-hint">无进行中任务</div>'
                    }
                </div>
            </div>
    `;
    return html;
  };

  const renderTableContent = (tableData, tableName) => {
    const _tableStart = performance.now();
    if (!tableData || !tableData.rows.length)
      return `
            <div class="acu-panel-header"><div class="acu-panel-title"><i class="fa-solid ${getIconForTableName(tableName)}"></i> ${tableName}</div><button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button></div>
            <div class="acu-panel-content"><div style="text-align:center;color:var(--acu-text-sub);padding:20px;">暂无数据</div></div>`;

    const config = getConfig();
    const pendingDeletions = getPendingDeletions()[tableData.key] || [];
    const headers = (tableData.headers || []).slice(1);

    // 获取当前表格的视图模式 (默认 list)
    const currentStyle = (getTableStyles() || {})[tableName] || 'list';
    const isGridMode = currentStyle === 'grid';

    let titleColIndex = 1;
    if (tableData.headers.length === 1) {
      titleColIndex = 0;
    } else if (tableName.includes('总结') || tableName.includes('大纲')) {
      const idx = tableData.headers.findIndex(
        h => h && (h.includes('索引') || h.includes('编号') || h.includes('代码')),
      );
      if (idx > 0) titleColIndex = idx;
    }

    // --- 搜索和排序逻辑 ---
    let processedRows = tableData.rows.map((row, index) => ({ data: row, originalIndex: index }));
    const searchTerm = (tableSearchStates[tableName] || '').toLowerCase().trim();

    // 检查是否需要倒序显示
    const isReversed = isTableReversed(tableName);

    if (searchTerm) {
      processedRows = processedRows.filter(item =>
        item.data.some(cell => String(cell).toLowerCase().includes(searchTerm)),
      );
      processedRows.sort((a, b) => {
        const titleA = String(a.data[titleColIndex] || '').toLowerCase();
        const titleB = String(b.data[titleColIndex] || '').toLowerCase();
        const aHitTitle = titleA.includes(searchTerm);
        const bHitTitle = titleB.includes(searchTerm);
        if (titleA === searchTerm && titleB !== searchTerm) return -1;
        if (titleA !== searchTerm && titleB === searchTerm) return 1;
        if (aHitTitle && !bHitTitle) return -1;
        if (!aHitTitle && bHitTitle) return 1;
        return a.originalIndex - b.originalIndex;
      });
    } else {
      // 默认按原始顺序排列，如果启用倒序则反转
      if (isReversed) {
        processedRows.sort((a, b) => b.originalIndex - a.originalIndex);
      } else {
        processedRows.sort((a, b) => a.originalIndex - b.originalIndex);
      }
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = processedRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = tablePageStates[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    tablePageStates[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = processedRows.slice(startIdx, endIdx);
    // [修改] 表头增加了 视图切换按钮 和 高度拖拽手柄
    // 生成倒序按钮（仅特定表格显示）
    const showReverseBtn = shouldShowReverseButton(tableName);
    const reverseBtnHtml = showReverseBtn
      ? `
            <button class="acu-view-btn acu-reverse-btn" data-table="${escapeHtml(tableName)}" title="${isReversed ? '当前：倒序（新→旧），点击切换为正序' : '当前：正序（旧→新），点击切换为倒序'}">
                <i class="fa-solid ${isReversed ? 'fa-sort-amount-up' : 'fa-sort-amount-down'}"></i>
            </button>
        `
      : '';

    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
    <div class="acu-title-main"><i class="fa-solid ${getIconForTableName(tableName)}"></i> <span class="acu-title-text">${escapeHtml(tableName)}</span></div>
    <div class="acu-title-sub">(${startIdx + 1}-${Math.min(endIdx, totalItems)} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
</div>
                <div class="acu-header-actions">
                    ${tableName.includes('人物') ? `<button class="acu-view-btn" id="acu-btn-relation-graph" data-table="${escapeHtml(tableName)}" title="查看人物关系图"><i class="fa-solid fa-project-diagram"></i></button>` : ''}
                    ${reverseBtnHtml}
                    <button class="acu-view-btn" id="acu-btn-switch-style" data-table="${escapeHtml(tableName)}" title="🔄 点击切换视图模式 (当前: ${isGridMode ? '双列网格' : '单列列表'})">
                        <i class="fa-solid ${isGridMode ? 'fa-th-large' : 'fa-list'}"></i>
                    </button>
                    <div class="acu-height-control">
                        <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                    </div>

                    <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索全部..." value="${(tableSearchStates[tableName] || '').replace(/"/g, '&quot;')}" /></div>
                    <button class="acu-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                </div>
            </div>
            <div class="acu-panel-content"><div class="acu-card-grid">`;

    html += rowsToRender
      .map(item => {
        const realRowIdx = item.originalIndex;
        const row = item.data;
        const isPending = pendingDeletions.includes(realRowIdx);
        const cardTitle = row[titleColIndex] || '未命名';
        const showDefaultIndex = titleColIndex === 1;
        const titleCellId = `${tableData.key}-${realRowIdx}-${titleColIndex}`;
        const isTitleModified = window.acuModifiedSet && window.acuModifiedSet.has(titleCellId);
        const isRowNew = currentDiffMap.has(`${tableName}-row-${realRowIdx}`);
        let rowClass = '';
        if (config.highlightNew) {
          if (isTitleModified) rowClass = 'acu-highlight-manual';
          else if (isRowNew) rowClass = 'acu-highlight-diff';
        }

        // 计算有效列数，用于网格视图末行占满处理
        const validColIndices = row.map((_, i) => i).filter(i => i > 0 && i !== titleColIndex);
        const isOddValidCount = validColIndices.length % 2 === 1;

        const cardBody = row
          .map((cell, cIdx) => {
            if (cIdx <= 0 || cIdx === titleColIndex) return '';
            // [新增] 隐藏"交互选项"列（因为已经以按钮形式显示）
            const currentHeader = headers[cIdx - 1] || '';
            if (currentHeader.includes('交互')) return '';
            const isLastValidCol = cIdx === validColIndices[validColIndices.length - 1];
            const spanFullRow = isLastValidCol && isOddValidCount;
            // 清理列标题：移除括号/方括号及其内容
            const rawHeaderName = headers[cIdx - 1] || '属性' + cIdx;
            const headerName = rawHeaderName.replace(/[\(（\[【][^)）\]】]*[\)）\]】]/g, '').trim();
            const safeStr = str =>
              String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            const rawStrOriginal = String(cell).trim();
            const rawStr = replaceUserPlaceholders(rawStrOriginal);
            const invalidPlaceholders = ['-', '--', '—', 'null', 'none', '无', '空', 'n/a', 'undefined', '/', 'nil'];
            if (invalidPlaceholders.includes(rawStr.toLowerCase())) {
              return ''; // 直接跳过这一行，不渲染
            }

            let contentHtml = '';
            let hideLabel = false; // 是否隐藏列标题
            const splitRegex = /[;；]/;

            // 检测是否是属性格式 (如 "演技:92" 或 "演技:92, 洞察:88")
            const parsedAttrs = parseAttributeString(rawStr);
            // [新增] 人际关系智能拆分
            if (isRelationshipCell(rawStr, headerName)) {
              const relations = parseRelationshipString(rawStr);
              // [修复] 过滤掉关系标签为无效值的记录
              const validRelations = relations.filter(rel => {
                if (!rel.relation) return true; // 没有关系标签的保留
                return !invalidPlaceholders.includes(rel.relation.toLowerCase());
              });

              if (validRelations.length > 1) {
                hideLabel = true;
                let relHtml = '';
                for (let i = 0; i < validRelations.length; i++) {
                  const rel = validRelations[i];
                  const borderStyle =
                    i < validRelations.length - 1 ? 'border-bottom:1px dashed rgba(128,128,128,0.2);' : '';
                  relHtml +=
                    '<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;' +
                    borderStyle +
                    '">';
                  relHtml +=
                    '<span style="color:var(--acu-text-sub);font-size:0.95em;">' + safeStr(rel.name) + '</span>';
                  if (rel.relation) {
                    relHtml +=
                      '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
                      safeStr(rel.relation) +
                      '</span>';
                  }
                  relHtml += '</div>';
                }
                contentHtml = '<div class="acu-relation-container">' + relHtml + '</div>';
              } else if (validRelations.length === 1) {
                hideLabel = true;
                const rel = validRelations[0];
                contentHtml =
                  '<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;">';
                contentHtml +=
                  '<span style="color:var(--acu-text-sub);font-size:0.95em;">' + safeStr(rel.name) + '</span>';
                if (rel.relation) {
                  contentHtml +=
                    '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
                    safeStr(rel.relation) +
                    '</span>';
                }
                contentHtml += '</div>';
              }
            } else if (parsedAttrs.length > 1) {
              // 多属性：2列网格显示，每个配骰子图标
              hideLabel = true;
              let attrsHtml = '';
              for (let i = 0; i < parsedAttrs.length; i++) {
                const attr = parsedAttrs[i];
                attrsHtml +=
                  '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">';
                attrsHtml +=
                  '<span style="color:var(--acu-text-sub);font-size:0.9em;white-space:nowrap;" title="' +
                  safeStr(attr.name) +
                  '">' +
                  safeStr(attr.name.length > 3 ? attr.name.substring(0, 5) : attr.name) +
                  '</span>';
                attrsHtml += '<div style="display:flex;align-items:center;gap:4px;">';
                attrsHtml +=
                  '<span style="color:var(--acu-text-main);font-weight:bold;font-size:0.95em;">' +
                  attr.value +
                  '</span>';
                attrsHtml +=
                  '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
                  safeStr(attr.name) +
                  '" data-attr-value="' +
                  attr.value +
                  '" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:10px;" title="检定"></i>';
                attrsHtml += '</div></div>';
              }
              contentHtml = '<div class="acu-multi-attr-container">' + attrsHtml + '</div>';
            } else if (parsedAttrs.length === 1) {
              // 单属性格式 (如 "演技:92") - 也隐藏列标题
              hideLabel = true;
              const attr = parsedAttrs[0];
              contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
              contentHtml +=
                '<span style="color:var(--acu-text-sub);font-size:0.95em;">' + safeStr(attr.name) + '</span>';
              contentHtml += '<div style="display:flex;align-items:center;gap:6px;">';
              contentHtml += '<span style="color:var(--acu-text-main);font-weight:bold;">' + attr.value + '</span>';
              contentHtml +=
                '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
                safeStr(attr.name) +
                '" data-attr-value="' +
                attr.value +
                '" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:11px;" title="检定"></i>';
              contentHtml += '</div></div>';
            } else if (rawStr.length > 0 && splitRegex.test(rawStr) && !rawStr.includes('http')) {
              // [修复] 无效值黑名单，这些词不应被渲染为标签
              const invalidTagValues = ['-', '--', '—', 'null', 'none', '无', '空', 'n/a', 'undefined', '/', 'nil'];
              const parts = rawStr
                .split(splitRegex)
                .map(s => s.trim())
                .filter(s => s && !invalidTagValues.includes(s.toLowerCase()));
              const allShort = parts.length > 1 && parts.every(p => p.length <= 6);
              if (allShort) {
                const tagsHtml = parts
                  .map(part => {
                    const subStyle = getBadgeStyle(part) || 'acu-badge-neutral';
                    return '<span class="acu-badge ' + subStyle + '">' + safeStr(part) + '</span>';
                  })
                  .join('');
                contentHtml = '<div class="acu-tag-container">' + tagsHtml + '</div>';
              } else if (parts.length > 0) {
                // 过滤后如果还有有效内容，则正常显示
                contentHtml = safeStr(parts.join('; '));
              } else {
                // 过滤后没有任何有效内容，渲染为空
                contentHtml = '';
              }
            } else if (isNumericCell(rawStr) && !rawStr.includes(':') && !rawStr.includes('：')) {
              // 纯数值加骰子，但保留列标题
              const numVal = extractNumericValue(rawStr);
              contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
              contentHtml += '<span>' + safeStr(rawStr) + '</span>';
              contentHtml +=
                '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
                safeStr(headerName) +
                '" data-attr-value="' +
                numVal +
                '" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:11px;margin-left:6px;" title="检定"></i>';
              contentHtml += '</div>';
            } else {
              const badgeStyle = getBadgeStyle(rawStr);
              const displayCell = safeStr(rawStr) === '' && String(cell) !== '0' ? '&nbsp;' : safeStr(rawStr);
              contentHtml = badgeStyle
                ? '<span class="acu-badge ' + badgeStyle + '">' + displayCell + '</span>'
                : displayCell;
            }

            const isDiffChanged = currentDiffMap.has(tableName + '-' + realRowIdx + '-' + cIdx);
            const cellId = tableData.key + '-' + realRowIdx + '-' + cIdx;
            const isUserModified = window.acuModifiedSet && window.acuModifiedSet.has(cellId);
            let cellHighlight = '';
            if (config.highlightNew) {
              if (isUserModified) cellHighlight = 'acu-highlight-manual';
              else if (isDiffChanged) cellHighlight = 'acu-highlight-diff';
            }

            // 隐藏标题时添加特殊 class
            // 检查锁定状态并添加图标
            const lockRowKey = LockManager.getRowKey(tableName, row, tableData.headers);
            const isThisFieldLocked = lockRowKey && LockManager.isFieldLocked(tableName, lockRowKey, headers[cIdx - 1]);
            const lockIcon = isThisFieldLocked
              ? '<i class="fa-solid fa-lock" style="color:var(--acu-accent);font-size:10px;margin-left:4px;opacity:0.7;" title="已锁定"></i>'
              : '';

            const rowClass =
              'acu-card-row acu-cell' +
              (spanFullRow ? ' acu-grid-span-full' : '') +
              (hideLabel ? ' acu-hide-label' : '');

            return (
              '<div class="' +
              rowClass +
              '" data-key="' +
              escapeHtml(tableData.key) +
              '" data-tname="' +
              escapeHtml(tableName) +
              '" data-row="' +
              realRowIdx +
              '" data-col="' +
              cIdx +
              '" data-val="' +
              encodeURIComponent(cell ?? '') +
              '"><div class="acu-card-label">' +
              headerName +
              lockIcon +
              '</div><div class="acu-card-value ' +
              cellHighlight +
              '">' +
              contentHtml +
              '</div></div>'
            );
          })
          .join('');

        // [修改] 给 acu-card-body 增加了 view-grid 或 view-list 类
        // [新增] 获取该表格的动作列表并生成按钮HTML
        let tableActions = getActionsForTable(tableName);
        let actionsHtml = '';

        // [特殊处理] 检查是否有"交互选项"列，将自定义选项追加到默认动作后面
        const interactColIdx = headers.findIndex(h => h && h.includes('交互'));
        if (interactColIdx >= 0 && row[interactColIdx + 1]) {
          // 过滤掉无效值：-、null、none、空、无、N/A 等
          const invalidValues = ['-', 'null', 'none', '无', '空', 'n/a', 'undefined', '/'];
          const interactOptions = String(row[interactColIdx + 1])
            .split(/[,，、;；]/)
            .map(s => s.trim())
            .filter(s => s && !invalidValues.includes(s.toLowerCase()));
          if (interactOptions.length > 0) {
            // 获取默认动作的标签列表，用于去重
            const existingLabels = tableActions.map(a => a.label.toLowerCase());
            // 常用动作的图标映射
            const iconMap = {
              战斗: 'fa-hand-fist',
              攻击: 'fa-hand-fist',
              交谈: 'fa-comments',
              对话: 'fa-comments',
              观察: 'fa-eye',
              查看: 'fa-eye',
              使用: 'fa-hand-pointer',
              赠送: 'fa-gift',
              送礼: 'fa-gift',
              丢弃: 'fa-trash',
              装备: 'fa-shield-halved',
              邀约: 'fa-calendar-check',
              告别: 'fa-hand',
              求爱: 'fa-heart',
              表演: 'fa-music',
            };
            // 只追加不在默认动作中的自定义选项
            const newActions = interactOptions
              .filter(opt => !existingLabels.includes(opt.toLowerCase()))
              .map(opt => ({
                label: opt,
                icon: iconMap[opt] || 'fa-hand-pointer',
                type: 'prompt',
                template: `<user>${opt}{Name}。`,
                auto_send: true,
              }));
            // 合并：默认动作 + 自定义动作
            tableActions = [...tableActions, ...newActions];
          }
        }

        if (tableActions.length > 0) {
          const cardTitle = row[titleColIndex] || '未知';
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${escapeHtml(act.label)}</button>`,
            )
            .join('');
          actionsHtml = `<div class="acu-card-actions">${actionBtns}</div>`;
        }

        // 检查整行是否被锁定
        const cardLockRowKey = LockManager.getRowKey(tableName, row, tableData.headers);
        const isCardRowLocked = cardLockRowKey && LockManager.isRowLocked(tableName, cardLockRowKey);
        const cardLockIcon = isCardRowLocked
          ? ' <i class="fa-solid fa-lock" style="color:var(--acu-accent);font-size:11px;opacity:0.8;" title="整行已锁定"></i>'
          : '';

        return `<div class="acu-data-card ${isPending ? 'pending-deletion' : ''}"><div class="acu-card-header"><span class="acu-card-index">${showDefaultIndex ? '#' + (realRowIdx + 1) : ''}</span><span class="acu-cell acu-editable-title ${rowClass}" data-key="${escapeHtml(tableData.key)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${encodeURIComponent(cardTitle ?? '')}" title="点击编辑标题">${escapeHtml(cardTitle)}${cardLockIcon}</span></div><div class="acu-card-body ${isGridMode ? 'view-grid' : 'view-list'}">${cardBody}</div>${actionsHtml}</div>`;
      })
      .join('');
    html += `</div></div>`;

    if (totalPages > 1) {
      html += `<div class="acu-panel-footer"><button class="acu-page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) range.push(1, 2, 3, 4, 5, '...', totalPages);
        else if (currentPage >= totalPages - 3)
          range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      range.forEach(p => {
        if (p === '...') html += `<span class="acu-page-info">...</span>`;
        else html += `<button class="acu-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      });
      html += `<button class="acu-page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button></div>`;
    }
    return html;
  };

  // [新增] 通用状态保存函数 (面板滚动 + 卡片内部滚动)
  const saveCurrentTabState = () => {
    const { $ } = getCore();
    const activeTab = getActiveTabState();
    const $content = $('.acu-panel-content');

    if (activeTab && $content.length) {
      const innerScrolls = {};
      // 遍历所有卡片，记录内部滚动条位置
      $content.find('.acu-data-card, .acu-card-body, .acu-edit-textarea').each(function () {
        if (this.scrollTop > 0) {
          // 尝试找到这张卡片的唯一标识 (Row Index)
          const $card = $(this).closest('.acu-data-card');
          const rIdx = $card.find('.acu-editable-title').data('row');
          // 如果是编辑框，还要加特殊标记
          const isEdit = $(this).hasClass('acu-edit-textarea');

          if (rIdx !== undefined) {
            const key = isEdit ? `edit-${rIdx}` : rIdx;
            innerScrolls[key] = this.scrollTop;
          }
        }
      });

      // 存入全局状态对象
      tableScrollStates[activeTab] = {
        left: $content.scrollLeft(),
        top: $content.scrollTop(),
        inner: innerScrolls,
        timestamp: Date.now(), // 加个时间戳方便调试
      };
    }
  };

  const closePanel = () => {
    const { $ } = getCore();
    saveCurrentTabState(); // <--- 调用通用保存

    $('#acu-data-area').removeClass('visible');
    $('.acu-nav-btn').removeClass('active');
    saveActiveTabState(null);
    // [修复] 关闭表格面板时，不要移除气泡里的行动选项
    // $('.acu-embedded-options-container').remove();
  };

  const bindEvents = tables => {
    const { $ } = getCore();
    const $wrapper = $('.acu-wrapper');
    // [新增] 仪表盘-人物关系图按钮
    $wrapper.on('click', '.acu-dash-relation-graph-btn', function (e) {
      e.stopPropagation();
      const allTables = processJsonData(cachedRawData || getTableData());
      const npcResult = DashboardDataParser.findTable(allTables, 'npc');
      if (npcResult && npcResult.data) {
        showRelationshipGraph(npcResult.data);
      } else {
        if (window.toastr) window.toastr.warning('未找到人物数据');
      }
    });

    // [新增] 仪表盘-头像管理按钮
    $wrapper.on('click', '.acu-dash-avatar-manager-btn', function (e) {
      e.stopPropagation();
      const allTables = processJsonData(cachedRawData || getTableData());
      const npcResult = DashboardDataParser.findTable(allTables, 'npc');
      const playerResult = DashboardDataParser.findTable(allTables, 'player');
      const nodeArr = [];
      // 添加主角
      if (playerResult?.data?.rows?.[0]) {
        nodeArr.push({ name: playerResult.data.rows[0][1] || '主角', isPlayer: true });
      }
      // 添加NPC
      if (npcResult?.data?.rows) {
        npcResult.data.rows.forEach((row, idx) => {
          if (row[1]) nodeArr.push({ name: row[1], isPlayer: false, rowIndex: idx });
        });
      }
      if (nodeArr.length > 0) {
        showAvatarManager(nodeArr, () => renderInterface());
      } else {
        if (window.toastr) window.toastr.warning('未找到人物数据');
      }
    });
    // 仪表盘模块标题点击跳转
    $wrapper.on('click', '.acu-dash-table-link', function (e) {
      e.stopPropagation();
      const tableName = $(this).data('table');
      if (tableName) {
        Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
        saveActiveTabState(tableName);
        renderInterface();
      }
    });

    // [修复] 阻止横向滑动冒泡到 SillyTavern，防止触发"滑动重新生成"
    $('.acu-panel-content')
      .off('touchstart.acu_swipe touchmove.acu_swipe')
      .on('touchstart.acu_swipe', function (e) {
        this._touchStartX = e.originalEvent.touches[0].clientX;
        this._touchStartY = e.originalEvent.touches[0].clientY;
      })
      .on('touchmove.acu_swipe', function (e) {
        if (!this._touchStartX) return;
        const deltaX = Math.abs(e.originalEvent.touches[0].clientX - this._touchStartX);
        const deltaY = Math.abs(e.originalEvent.touches[0].clientY - this._touchStartY);
        // 如果是横向滑动（角度小于45度），阻止冒泡
        if (deltaX > deltaY && deltaX > 10) {
          e.stopPropagation();
        }
      });

    $('body')
      .off('click.acu_nav_toggle')
      .on('click.acu_nav_toggle', '.acu-nav-toggle-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // 1. 切换数据状态
        const current = Store.get('acu_hide_nav_only', false);
        const newState = !current;
        Store.set('acu_hide_nav_only', newState);

        // 2. [新增] 立即手动切换图标 (视觉瞬时反馈)
        const $icon = $(this);
        if (newState) {
          $icon.removeClass('fa-eye').addClass('fa-eye-slash');
          $icon.attr('title', '显示主面板');
        } else {
          $icon.removeClass('fa-eye-slash').addClass('fa-eye');
          $icon.attr('title', '隐藏主面板');
        }

        // 3. 触发重绘
        renderInterface();
      });

    const $panel = $('.acu-panel-content');
    if ($panel.length) {
      // [优化] 滚动防抖，避免频繁写入硬盘导致卡顿
      let scrollTimer = null;
      $panel.off('scroll.acu_save').on('scroll.acu_save', function () {
        const $this = $(this);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const activeTab = getActiveTabState();
          if (activeTab) {
            if (!tableScrollStates[activeTab]) tableScrollStates[activeTab] = { top: 0, left: 0, inner: {} };
            tableScrollStates[activeTab].top = $this.scrollTop();
            tableScrollStates[activeTab].left = $this.scrollLeft();
            // 不再每次滚动都写入，只更新内存，页面卸载时统一保存
          }
        }, 200);
      });
    }

    $('body')
      .off('click.acu_delegate')
      .on('click.acu_delegate', '.acu-wrapper', function (e) {
        if (isEditingOrder) return;
        const $target = $(e.target);

        // [修复] 设置按钮特殊处理 - 无论在哪个位置都优先响应
        const $settingsBtn = $target.closest('#acu-btn-settings');
        if ($settingsBtn.length) {
          e.stopPropagation();
          e.preventDefault();
          showSettingsModal();
          return;
        }

        const $navBtn = $target.closest('.acu-nav-btn');
        if ($navBtn.length) {
          // [新增] 仪表盘按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-dashboard') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isDashboardActive = Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
            const isPanelVisible = $('#acu-data-area').hasClass('visible');

            if (isDashboardActive && isPanelVisible) {
              // 仪表盘已打开，关闭面板
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
              $('#acu-data-area').removeClass('visible');
              $('.acu-nav-btn').removeClass('active');
            } else {
              // 打开仪表盘
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, true);
              saveActiveTabState(null);
              $('.acu-nav-btn').removeClass('active');
              $navBtn.addClass('active');
              // 直接更新面板内容而不是完整重绘
              const rawData = cachedRawData || getTableData();
              const tables = processJsonData(rawData || {});
              $('#acu-data-area').html(renderDashboard(tables)).addClass('visible');
              // 重新绑定仪表盘内的事件
              bindEvents(tables);
            }
            return false;
          }
          // [新增] 变更审核按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-changes') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isChangesActive = Store.get('acu_changes_panel_active', false);
            const isPanelVisible = $('#acu-data-area').hasClass('visible');

            if (isChangesActive && isPanelVisible) {
              // 变更面板已打开，关闭面板
              Store.set('acu_changes_panel_active', false);
              $('#acu-data-area').removeClass('visible');
              $('.acu-nav-btn').removeClass('active');
            } else {
              // 打开变更面板
              Store.set('acu_changes_panel_active', true);
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
              saveActiveTabState(null);
              $('.acu-nav-btn').removeClass('active');
              $navBtn.addClass('active');
              // 直接更新面板内容
              const rawData = cachedRawData || getTableData();
              $('#acu-data-area').html(renderChangesPanel(rawData)).addClass('visible');
              // 绑定变更面板内的事件
              bindChangesEvents();
            }
            return false;
          }
          // [新增] MVU 变量按钮特殊处理
          if ($navBtn.attr('id') === 'acu-btn-mvu') {
            e.preventDefault();
            e.stopImmediatePropagation();
            const isMvuActive = getActiveTabState() === MvuModule.MODULE_ID;
            const isPanelVisible = $('#acu-data-area').hasClass('visible');

            if (isMvuActive && isPanelVisible) {
              // MVU面板已打开，关闭面板
              saveActiveTabState(null);
              $('#acu-data-area').removeClass('visible');
              $('.acu-nav-btn').removeClass('active');
            } else {
              // 打开MVU面板
              Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
              Store.set('acu_changes_panel_active', false);
              saveActiveTabState(MvuModule.MODULE_ID);
              $('.acu-nav-btn').removeClass('active');
              // 渲染MVU面板
              const $panel = $('#acu-data-area');
              $panel.html(MvuModule.renderPanel()).addClass('visible');
              MvuModule.bindEvents($panel);
            }
            return false;
          }
          e.stopPropagation();
          // [修复] 点击普通表格时，必须关闭仪表盘和变更面板状态
          Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
          Store.set('acu_changes_panel_active', false);
          const tableName = $navBtn.data('table');
          const currentActiveTab = getActiveTabState();
          if (currentActiveTab === tableName && $('#acu-data-area').hasClass('visible')) {
            closePanel();
            return;
          }
          $('.acu-nav-btn').removeClass('active');
          $navBtn.addClass('active');
          if ($('.acu-panel-content').length && currentActiveTab) {
            saveCurrentTabState();
          }
          saveActiveTabState(tableName);
          setTimeout(() => renderInterface(), 0);
          return;
        }
        const $cell = $target.closest('.acu-cell');
        if ($cell.length) {
          e.stopPropagation();
          showCellMenu(e, $cell[0]);
          return;
        }
        const $pageBtn = $target.closest('.acu-page-btn');
        if ($pageBtn.length) {
          e.stopPropagation();
          if ($pageBtn.hasClass('disabled') || $pageBtn.hasClass('active')) return;
          const newPage = parseInt($pageBtn.data('page'));
          const activeTab = getActiveTabState();
          if (activeTab) {
            tablePageStates[activeTab] = newPage;
            renderInterface();
            requestAnimationFrame(() => {
              $('.acu-panel-content').scrollTop(0);
            });
          }
          return;
        }
        return;
      });

    $('#acu-btn-expand')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (isEditingOrder) return;
        saveCollapsedState(false);
        renderInterface();
      });
    // [回归] 收起按钮逻辑
    $('#acu-btn-collapse')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (isEditingOrder) return;
        saveCollapsedState(true);
        renderInterface();
      });

    // [修改版] 刷新按钮 = 极速回档 (Instant Revert)
    $('#acu-btn-refresh')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();

        // [修复] 关键漏网之鱼：如果是编辑布局模式，禁止触发刷新，只允许被拖拽
        if (isEditingOrder) return;

        // 1. 安全锁：如果正在后台保存，禁止刷新，防止数据冲突
        if (isSaving) {
          if (window.toastr) window.toastr.warning('⏳ 正在后台同步数据，无法撤销，请稍后...');
          return;
        }

        const $btn = $(e.currentTarget);
        const $icon = $btn.find('i');
        // $icon.addClass('fa-spin'); // 注释掉旋转动画，追求视觉上的“瞬变”

        // 2. 【核心】彻底清除所有未保存状态 (瞬间丢弃脏数据)
        // (1) 清空待删除记录
        savePendingDeletions({});

        // (2) 清空内存缓存 -> 丢弃未保存的修改
        cachedRawData = null;

        // (3) 重置状态标记
        hasUnsavedChanges = false;
        currentDiffMap.clear();
        if (window.acuModifiedSet) window.acuModifiedSet.clear();

        // (4) 重置保存按钮样式 (去掉呼吸灯)
        const $saveBtn = $('#acu-btn-save-global');
        $saveBtn.find('i').removeClass('acu-icon-breathe');
        $saveBtn.attr('title', '保存所有修改').css('color', '');

        // 3. 【极速优化】移除 300ms 延时，直接读取快照
        // await new Promise(r => setTimeout(r, 300)); // <--- 删掉这行人为延时

        // 尝试优先读取本地快照（Last Snapshot），这样最快，不需要等后端API
        const snapshot = loadSnapshot();
        if (snapshot) {
          cachedRawData = snapshot; // 强制回滚到快照
        }

        // 4. 重新渲染界面
        // 清理旧的样式标签，防止残留
        $('.acu-edit-overlay, .acu-cell-menu, .acu-menu-backdrop').remove();

        // 立即重绘
        renderInterface();

        // $icon.removeClass('fa-spin');
      });

    // [修改] 将收起按钮改为手动更新按钮
    $('#acu-btn-force-update')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (isEditingOrder) return;
        const api = getCore().getDB();
        if (api && typeof api.manualUpdate === 'function') {
          try {
            await api.manualUpdate();
          } catch (err) {
            console.error('[ACU] 手动更新失败:', err);
            if (window.toastr) window.toastr.error('手动更新触发失败');
          }
        } else {
          if (window.toastr)
            window.toastr.warning('⚠ 后端脚本未提供 manualUpdate 接口，请确保同时也更新了最新的后端脚本');
        }
      });
    $('body')
      .off('click.acu_settings')
      .on('click.acu_settings', '#acu-btn-settings', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (isEditingOrder) return;
        showSettingsModal();
      });
    // [新增] 导航栏掷骰按钮
    $('#acu-btn-dice-nav')
      .off('click')
      .on('click', e => {
        e.stopPropagation();
        if (isEditingOrder) return;
        showDicePanel({
          targetValue: null,
          targetName: '自由检定',
          // 不传 diceType，让函数内部使用保存的值
        });
      });

    /* // 内置编辑器（已注释）
    $('#acu-btn-open-editor').off('click').on('click', (e) => {
        e.stopPropagation();
        if (isEditingOrder) return;
        const api = getCore().getDB();
        if (api && typeof api.openVisualizer === 'function') {
            api.openVisualizer();
        } else if (window.toastr) {
            window.toastr.warning('后端脚本(神·数据库)未就绪或版本过低');
        }
    });
    */

    // 重新填表按钮
    $('#acu-btn-refill')
      .off('click')
      .on('click', async e => {
        e.stopPropagation();
        if (isEditingOrder) return;
        const api = getCore().getDB();
        if (api && typeof api.manualUpdate === 'function') {
          try {
            console.log('[ACU] 手动填表触发');
            await api.manualUpdate();
          } catch (err) {
            console.error('[ACU] 手动填表失败:', err);
          }
        } else {
          console.warn('[ACU] manualUpdate API 不可用');
        }
      });
    $('#acu-btn-save-global')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        if (isEditingOrder) return;
        let dataToSave = null;
        if (hasUnsavedChanges && cachedRawData) {
          dataToSave = cachedRawData;
        } else {
          dataToSave = getTableData();
        }

        if (dataToSave) {
          // 1. 【核心修改】把中间的 false 改为 true，禁止保存后重绘界面
          await saveDataToDatabase(dataToSave, true, true);

          // 2. 【手动善后】因为不重绘了，我们需要手动把界面上的“未保存”红字变回普通颜色
          // 移除所有手动修改的高亮类
          $('.acu-highlight-manual').removeClass('acu-highlight-manual');

          // 3. 清理内部的脏数据标记
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          hasUnsavedChanges = false;

          // 4. 手动重置保存按钮的状态（去掉呼吸灯，变回灰色）
          const $btn = $(this);
          const $icon = $btn.find('i');
          $icon.removeClass('acu-icon-breathe fa-spinner fa-spin').addClass('fa-save');
          $btn.attr('title', '保存所有修改').css('color', '');
          $btn.prop('disabled', false);

          // 5. 提示用户
        } else {
          if (window.toastr) window.toastr.error('无法获取有效数据，保存失败');
        }
      });

    const $searchInput = $('.acu-search-input');
    if ($searchInput.length) {
      let searchTimeout;
      let isComposing = false;
      $searchInput
        .off('compositionstart compositionend input')
        .on('compositionstart', () => {
          isComposing = true;
        })
        .on('compositionend', function () {
          isComposing = false;
          const val = $(this).val();
          const activeTab = getActiveTabState();
          if (activeTab) {
            tableSearchStates[activeTab] = val;
            tablePageStates[activeTab] = 1;
            renderInterface();
            setTimeout(() => {
              $('.acu-search-input').focus();
            }, 0);
          }
        })
        .on('input', function () {
          if (isComposing) return;
          const val = $(this).val();
          const selectionStart = this.selectionStart;
          const selectionEnd = this.selectionEnd;
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            const activeTab = getActiveTabState();
            if (activeTab) {
              tableSearchStates[activeTab] = val;
              tablePageStates[activeTab] = 1;
              const isFocus = document.activeElement && document.activeElement.classList.contains('acu-search-input');
              renderInterface();
              if (isFocus) {
                const $newInput = $('.acu-search-input');
                $newInput.focus();
                if ($newInput.length && $newInput[0].setSelectionRange) {
                  try {
                    $newInput[0].setSelectionRange(selectionStart, selectionEnd);
                  } catch (e) {}
                }
              }
            }
          }, 300);
        });
    }
    // 人物关系图按钮
    $('#acu-btn-relation-graph')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const rawData = cachedRawData || getTableData();
        if (rawData) {
          for (const key in rawData) {
            const sheet = rawData[key];
            if (sheet?.name === tableName) {
              const tableData = {
                headers: sheet.content?.[0] || [],
                rows: sheet.content?.slice(1) || [],
                key: key,
              };
              showRelationshipGraph(tableData);
              return;
            }
          }
        }
        if (window.toastr) window.toastr.warning('无法获取表格数据');
      });
    // --- [新增] 移植功能的事件绑定 ---

    // 1. 视图切换
    $('#acu-btn-switch-style')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const styles = getTableStyles();
        const current = styles[tableName] || 'list';
        styles[tableName] = current === 'grid' ? 'list' : 'grid'; // 切换
        saveTableStyles(styles);
        renderInterface(); // 重绘
      });

    // 2. 高度拖拽
    $('.acu-height-drag-handle')
      .off('pointerdown')
      .on('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const handle = this;
        handle.setPointerCapture(e.pointerId);
        $(handle).addClass('active');
        const $panel = $('#acu-data-area');
        const startHeight = $panel.height();
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          let newHeight = startHeight - dy; // 向上拖动增加高度
          if (newHeight < MIN_PANEL_HEIGHT) newHeight = MIN_PANEL_HEIGHT;
          if (newHeight > MAX_PANEL_HEIGHT) newHeight = MAX_PANEL_HEIGHT;
          $panel.css('height', newHeight + 'px');
        };
        handle.onpointerup = function (upE) {
          $(handle).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          if (tableName) {
            const heights = getTableHeights();
            heights[tableName] = parseInt($panel.css('height'));
            saveTableHeights(heights);
            $panel.addClass('acu-manual-mode');
          }
        };
      });

    // 3. 双击重置高度 - 支持整个头部区域触发
    $('.acu-height-drag-handle')
      .off('dblclick')
      .on('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        if (tableName) {
          const heights = getTableHeights();
          delete heights[tableName];
          saveTableHeights(heights);
          $('#acu-data-area').css('height', '').removeClass('acu-manual-mode');
        }
      });

    // [新增] 倒序按钮点击事件
    $wrapper.on('click', '.acu-reverse-btn', function (e) {
      e.stopPropagation();
      const tName = $(this).data('table');
      if (!tName) return;

      toggleTableReverse(tName);

      // 重新渲染当前表格
      renderInterface();
    });
    // [新增] 双击头部任意位置也可重置高度
    $('.acu-panel-header')
      .off('dblclick.acu')
      .on('dblclick.acu', function (e) {
        if ($(e.target).closest('.acu-search-input, .acu-close-btn, .acu-view-btn').length) return;
        e.preventDefault();
        e.stopPropagation();
        const tableName = getActiveTabState();
        if (tableName) {
          const heights = getTableHeights();
          delete heights[tableName];
          saveTableHeights(heights);
          $('#acu-data-area').css('height', '').removeClass('acu-manual-mode');
        }
      });

    $('.acu-close-btn')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $input = $('.acu-search-input');

        // 如果搜索框有内容，清空搜索框
        if ($input.length && $input.val()) {
          $input.val('').trigger('input').focus();
          return;
        }

        // 检查是否是仪表盘状态
        const isDashboardActive = Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false);
        if (isDashboardActive) {
          // 仪表盘状态：关闭仪表盘，重新渲染到默认状态
          Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
          saveActiveTabState(null);
          renderInterface();
          return;
        }

        // 普通表格状态：正常关闭面板
        closePanel();
      });
    // [新增] 动作按钮点击事件
    $('body')
      .off('click.acu_action')
      .on('click.acu_action', '.acu-action-item', function (e) {
        e.stopPropagation();
        e.preventDefault();

        const $btn = $(this);
        const rowIdx = parseInt($btn.data('row'), 10);
        const actionIdx = parseInt($btn.data('action-idx'), 10);

        // 获取当前表格信息
        const $card = $btn.closest('.acu-data-card');
        const $title = $card.find('.acu-editable-title');
        const tableKey = $title.data('key');
        const tableName = $title.data('tname') || '';

        // 获取行数据
        const rawData = cachedRawData || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const headers = rawData[tableKey].content[0] || [];
        const rowData = rawData[tableKey].content[rowIdx + 1] || [];

        // 无效值列表
        const invalidValues = ['-', 'null', 'none', '无', '空', 'n/a', 'undefined', '/'];

        // 先获取默认动作配置
        let actions = getActionsForTable(tableName);

        // 查找"交互选项"列，追加自定义动作（而非覆盖）
        const interactColIdx = headers.findIndex(h => h && String(h).includes('交互'));
        if (interactColIdx >= 0 && rowData[interactColIdx]) {
          const cellValue = String(rowData[interactColIdx]).trim();
          if (cellValue && !invalidValues.includes(cellValue.toLowerCase())) {
            const interactOptions = cellValue
              .split(/[,，、;；]/)
              .map(s => s.trim())
              .filter(s => s && !invalidValues.includes(s.toLowerCase()));
            if (interactOptions.length > 0) {
              // 获取默认动作的标签列表，用于去重
              const existingLabels = actions.map(a => a.label.toLowerCase());
              // 只追加不在默认动作中的自定义选项
              const newActions = interactOptions
                .filter(opt => !existingLabels.includes(opt.toLowerCase()))
                .map(opt => ({
                  label: opt,
                  icon: 'fa-hand-pointer',
                  type: 'prompt',
                  template: `<user>对{Name}进行交互：${opt}。`,
                  auto_send: true,
                }));
              // 合并：默认动作 + 自定义动作
              actions = [...actions, ...newActions];
            }
          }
        }

        const action = actions[actionIdx];

        // [特殊处理] 技能检定类型：使用技能并打开掷骰面板
        if (action && action.type === 'skill_check') {
          const skillName = rowData[1] || '技能';

          // 查找属性值或熟练度
          let checkValue = null;
          const attrValIdx = headers.findIndex(h => h && h.includes('属性值'));
          const profIdx = headers.findIndex(h => h && (h.includes('熟练') || h.includes('等级')));

          // 优先取属性值
          if (attrValIdx > 0 && rowData[attrValIdx]) {
            const val = extractNumericValue(rowData[attrValIdx]);
            if (val > 0) checkValue = val;
          }
          // 回退到熟练度
          if (checkValue === null && profIdx > 0 && rowData[profIdx]) {
            const val = extractNumericValue(rowData[profIdx]);
            if (val > 0) checkValue = val;
          }

          // 填入使用技能的文本
          const promptText = processTemplate(action.template, rowData, headers);
          smartInsertToTextarea(promptText, 'action');

          // 如果有有效数值，打开掷骰面板
          if (checkValue !== null && checkValue > 0) {
            showDicePanel({
              targetValue: checkValue,
              targetName: skillName,
              initiatorName: '<user>',
            });
          } else {
            $('#send_textarea').focus();
          }
          return;
        }

        if (action && action.template) {
          // 获取该行的数据
          const rawData = cachedRawData || getTableData();
          if (rawData && rawData[tableKey]) {
            const headers = rawData[tableKey].content[0] || [];
            const rowData = rawData[tableKey].content[rowIdx + 1] || [];
            const npcName = rowData[1] || '对方';

            // 如果是"交谈"动作，弹出输入框
            if (action.label === '交谈') {
              const config = getConfig();
              $('.acu-msg-overlay').remove();

              const t = getThemeColors();

              const overlay = $(`
                        <div class="acu-msg-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:2147483647;display:flex;justify-content:center;align-items:center;">
                            <div style="background:${t.bgPanel};border:1px solid ${t.border};border-radius:12px;padding:16px;width:90%;max-width:320px;box-shadow:0 10px 40px rgba(0,0,0,0.4);">
                                <div style="font-size:14px;font-weight:bold;color:${t.accent};margin-bottom:12px;display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-comment"></i> 发送消息给 ${escapeHtml(npcName)}
                                </div>
                                <input type="text" id="acu-msg-input" placeholder="输入消息内容..." style="width:100%;padding:10px 12px;background:${t.inputBg} !important;border:1px solid ${t.border};border-radius:6px;color:${t.textMain} !important;font-size:14px;box-sizing:border-box;" autofocus>
                                <div style="display:flex;gap:8px;margin-top:12px;">
                                    <button id="acu-msg-cancel" style="flex:1;padding:8px;background:${t.inputBg};border:1px solid ${t.border};border-radius:6px;color:${t.textMain};cursor:pointer;">取消</button>
                                    <button id="acu-msg-send" style="flex:1;padding:8px;background:${t.btnActiveBg};border:none;border-radius:6px;color:${t.btnActiveText};cursor:pointer;font-weight:bold;">发送</button>
                                </div>
                            </div>
                        </div>
                    `);

              $('body').append(overlay);
              // [关键修复] 用 JS 强制设置 overlay 样式
              const overlayEl = overlay[0];
              overlayEl.style.setProperty('position', 'fixed', 'important');
              overlayEl.style.setProperty('top', '0', 'important');
              overlayEl.style.setProperty('left', '0', 'important');
              overlayEl.style.setProperty('right', '0', 'important');
              overlayEl.style.setProperty('bottom', '0', 'important');
              overlayEl.style.setProperty('width', '100vw', 'important');
              overlayEl.style.setProperty('height', '100vh', 'important');
              overlayEl.style.setProperty('display', 'flex', 'important');
              overlayEl.style.setProperty('justify-content', 'center', 'important');
              overlayEl.style.setProperty('align-items', 'center', 'important');
              overlayEl.style.setProperty('z-index', '2147483650', 'important');
              setTimeout(() => overlay.find('#acu-msg-input').focus(), 50);

              const sendMessage = () => {
                const msg = overlay.find('#acu-msg-input').val().trim();
                if (msg) {
                  const promptText = `<user>对${npcName}说："${msg}"`;
                  smartInsertToTextarea(promptText, 'action');
                  $('#send_textarea').focus();
                }
                overlay.remove();
              };

              overlay.find('#acu-msg-send').click(sendMessage);
              overlay.find('#acu-msg-input').on('keydown', function (ev) {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  sendMessage();
                }
              });
              overlay.find('#acu-msg-cancel').click(() => overlay.remove());
              overlay.on('click', function (ev) {
                if ($(ev.target).hasClass('acu-msg-overlay')) overlay.remove();
              });
              return;
            }

            // 其他动作：使用 processTemplate 处理模板
            const promptText = processTemplate(action.template, rowData, headers);
            smartInsertToTextarea(promptText, 'action');
            $('#send_textarea').focus();
          }
        }
      });

    // [新增] 全局骰子按钮（面板右上角）
    $('body')
      .off('click.acu_global_dice')
      .on('click.acu_global_dice', '#acu-btn-dice', function (e) {
        e.stopPropagation();
        showDicePanel({
          targetValue: 50,
          targetName: '自定义检定',
          diceType: '1d100',
        });
      });
    // ========== [新增代码开始] ==========
    // 仪表盘地点列表的展开/收起交互
    $('body')
      .off('click.acu_location_toggle')
      .on('click.acu_location_toggle', '.acu-location-header', function (e) {
        e.stopPropagation();
        const $group = $(this).closest('.acu-location-group');
        $group.toggleClass('expanded');
      });

    // [新增] 仪表盘跳转功能：点击"查看全部"或地点项，跳转到对应表格
    $('body')
      .off('click.acu_dash_jump')
      .on('click.acu_dash_jump', '.acu-dash-jump-link, .acu-dash-loc-item', function (e) {
        e.stopPropagation();
        const tableName = $(this).data('table');
        const searchTerm = $(this).data('search') || '';

        if (tableName) {
          // 1. 关闭仪表盘
          Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);

          // 2. 切换到目标表格
          saveActiveTabState(tableName);

          // 3. 如果有搜索词，设置搜索状态
          if (searchTerm) {
            tableSearchStates[tableName] = searchTerm;
            tablePageStates[tableName] = 1;
          }

          // 4. 重新渲染
          renderInterface();

          // 5. 聚焦搜索框（如果有搜索词）
          if (searchTerm) {
            setTimeout(() => {
              const $input = $('.acu-search-input');
              if ($input.length) $input.focus();
            }, 100);
          }
        }
      });
    // ========== [新增代码结束] ==========
    // [新增] 表格卡片内联骰子图标点击事件
    $('body')
      .off('click.acu_inline_dice')
      .on('click.acu_inline_dice', '.acu-inline-dice-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // 使用 .attr() 直接读取，避免 jQuery 驼峰转换问题
        const attrName = $(this).attr('data-attr-name') || '属性';
        const attrValue = parseInt($(this).attr('data-attr-value'), 10) || 50;

        // 获取卡片标题作为实体名称（NPC名字等）
        const $card = $(this).closest('.acu-data-card');
        const cardTitle = $card.find('.acu-editable-title').text().trim();

        // 判断是否是主角相关表格（如果是主角表，仍用<user>）
        const tableName = $card.find('.acu-editable-title').data('tname') || '';
        const isPlayerTable = tableName.includes('主角');
        const initiatorName = isPlayerTable ? '<user>' : cardTitle;

        showDicePanel({
          targetValue: attrValue,
          targetName: attrName,
          initiatorName: initiatorName,
          // 不传 diceType，使用保存的值
        });
      });
    // [新增] 仪表盘骰子检定按钮
    $('body')
      .off('click.acu_dash_dice')
      .on('click.acu_dash_dice', '.acu-dash-dice-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const targetValue = parseInt($(this).data('target'), 10) || 50;
        const targetName = $(this).data('name') || '属性';
        const npcName = $(this).data('npc') || '';

        // 如果是NPC的属性，直接打开对抗检定
        if (npcName) {
          // 修复：尝试获取主角的同名属性值
          const playerAttrValue = getAttributeValue('<user>', targetName) || 50;
          showContestPanel({
            initiatorName: '<user>',
            initiatorValue: playerAttrValue,
            opponentName: npcName,
            opponentValue: targetValue,
          });
        } else {
          showDicePanel({
            targetValue: targetValue,
            targetName: targetName,
            initiatorName: '<user>',
          });
        }
      });
    // [新增] 已知地区"前往"按钮
    $('body')
      .off('click.acu_dash_goto')
      .on('click.acu_dash_goto', '.acu-dash-goto-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const locationName = $(this).data('location') || '未知地点';
        const promptText = `<user>前往${locationName}。`;
        smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 背包物品"使用"按钮
    $('body')
      .off('click.acu_dash_use_item')
      .on('click.acu_dash_use_item', '.acu-dash-use-item-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const itemName = $(this).data('item') || '物品';
        const promptText = `<user>使用${itemName}。`;
        smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 技能列表"使用"按钮 - 使用技能并进行检定
    $('body')
      .off('click.acu_dash_use_skill')
      .on('click.acu_dash_use_skill', '.acu-dash-use-skill-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const skillName = $(this).data('skill') || '技能';

        // 查找该技能的属性值或熟练度
        const rawData = cachedRawData || getTableData();
        let checkValue = null;

        if (rawData) {
          // 查找技能表
          for (const key in rawData) {
            const sheet = rawData[key];
            if (!sheet || !sheet.name || !sheet.content) continue;
            if (sheet.name.includes('技能') || sheet.name.includes('能力')) {
              const headers = sheet.content[0] || [];
              // 动态查找列索引
              const nameIdx = headers.findIndex(h => h && (h.includes('名称') || h.includes('技能名'))) || 1;
              const attrValIdx = headers.findIndex(h => h && h.includes('属性值'));
              const profIdx = headers.findIndex(h => h && (h.includes('熟练') || h.includes('等级')));

              for (let i = 1; i < sheet.content.length; i++) {
                const row = sheet.content[i];
                if (row && row[nameIdx === -1 ? 1 : nameIdx] === skillName) {
                  // 优先取属性值
                  if (attrValIdx > 0 && row[attrValIdx]) {
                    const val = extractNumericValue(row[attrValIdx]);
                    if (val > 0) {
                      checkValue = val;
                      break;
                    }
                  }
                  // 回退到熟练度
                  if (profIdx > 0 && row[profIdx]) {
                    const val = extractNumericValue(row[profIdx]);
                    if (val > 0) {
                      checkValue = val;
                      break;
                    }
                  }
                  break;
                }
              }
              if (checkValue !== null) break;
            }
          }
        }

        // 先填入使用技能的文本
        const promptText = `<user>使用${skillName}。`;
        smartInsertToTextarea(promptText, 'action');

        // 如果有有效数值，打开掷骰面板进行检定
        if (checkValue !== null && checkValue > 0) {
          showDicePanel({
            targetValue: checkValue,
            targetName: skillName,
            initiatorName: '<user>',
          });
        } else {
          // 没有有效数值，只聚焦输入框
          $('#send_textarea').focus();
        }
      });
    // [新增] 进行中任务"追踪"按钮
    $('body')
      .off('click.acu_dash_track_task')
      .on('click.acu_dash_track_task', '.acu-dash-track-task-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const taskName = $(this).data('task') || '任务';
        const promptText = `<user>将${taskName}设为当前追踪目标。`;
        smartInsertToTextarea(promptText, 'action');
        $('#send_textarea').focus();
      });
    // [新增] 重要人物"发消息"按钮
    $('body')
      .off('click.acu_dash_msg')
      .on('click.acu_dash_msg', '.acu-dash-msg-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '对方';
        const config = getConfig();

        // 移除已有的弹窗
        $('.acu-msg-overlay').remove();

        // 获取当前主题的颜色变量
        const t = getThemeColors();

        const overlay = $(`
            <div class="acu-msg-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:2147483647;display:flex;justify-content:center;align-items:center;">
                <div class="acu-msg-dialog" style="background:${t.bgPanel};border:1px solid ${t.border};border-radius:12px;padding:16px;width:90%;max-width:320px;box-shadow:0 10px 40px rgba(0,0,0,0.4);">
                    <div style="font-size:14px;font-weight:bold;color:${t.accent};margin-bottom:12px;display:flex;align-items:center;gap:6px;">
                        <i class="fa-solid fa-comment"></i> 发送消息给 ${escapeHtml(npcName)}
                    </div>
                    <input type="text" id="acu-msg-input" placeholder="输入消息内容..." style="width:100%;padding:10px 12px;background:${t.inputBg} !important;border:1px solid ${t.border};border-radius:6px;color:${t.textMain} !important;font-size:14px;box-sizing:border-box;" autofocus>
                    <div style="display:flex;gap:8px;margin-top:12px;">
                        <button id="acu-msg-cancel" style="flex:1;padding:8px;background:${t.inputBg};border:1px solid ${t.border};border-radius:6px;color:${t.textMain};cursor:pointer;">取消</button>
                        <button id="acu-msg-send" style="flex:1;padding:8px;background:${t.btnActiveBg};border:none;border-radius:6px;color:${t.btnActiveText};cursor:pointer;font-weight:bold;">发送</button>
                    </div>
                </div>
            </div>
        `);

        $('body').append(overlay);
        const overlayEl = overlay[0];
        overlayEl.style.setProperty('position', 'fixed', 'important');
        overlayEl.style.setProperty('top', '0', 'important');
        overlayEl.style.setProperty('left', '0', 'important');
        overlayEl.style.setProperty('right', '0', 'important');
        overlayEl.style.setProperty('bottom', '0', 'important');
        overlayEl.style.setProperty('width', '100vw', 'important');
        overlayEl.style.setProperty('height', '100vh', 'important');
        overlayEl.style.setProperty('display', 'flex', 'important');
        overlayEl.style.setProperty('justify-content', 'center', 'important');
        overlayEl.style.setProperty('align-items', 'center', 'important');
        overlayEl.style.setProperty('z-index', '2147483650', 'important');
        setTimeout(() => overlay.find('#acu-msg-input').focus(), 50);

        const sendMessage = () => {
          const msg = overlay.find('#acu-msg-input').val().trim();
          if (msg) {
            const promptText = `<user>对${npcName}说："${msg}"`;
            smartInsertToTextarea(promptText, 'action');
            $('#send_textarea').focus();
          }
          overlay.remove();
        };

        // 点击发送
        overlay.find('#acu-msg-send').click(sendMessage);

        // 回车发送
        overlay.find('#acu-msg-input').on('keydown', function (ev) {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            sendMessage();
          }
        });

        // 点击取消或背景关闭
        overlay.find('#acu-msg-cancel').click(() => overlay.remove());
        overlay.on('click', function (ev) {
          if ($(ev.target).hasClass('acu-msg-overlay')) overlay.remove();
        });
      });
    // [新增] NPC对抗检定按钮
    $('body')
      .off('click.acu_dash_contest')
      .on('click.acu_dash_contest', '.acu-dash-contest-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        const npcName = $(this).data('npc') || '';

        const rawData = cachedRawData || getTableData();

        var playerAttrValue = 50;
        var npcAttrValue = 50;
        var foundPlayer = false;
        var foundNPC = false;

        if (rawData) {
          for (var key in rawData) {
            var sheet = rawData[key];
            if (!sheet || !sheet.name || !sheet.content) continue;

            // 主角信息表
            if (sheet.name === '主角信息') {
              if (sheet.content[1]) {
                var attrStr = sheet.content[1][7] || '';
                var parts = attrStr.split(/[,，;；\s]+/);
                for (var i = 0; i < parts.length; i++) {
                  var match = parts[i].match(/^([\u4e00-\u9fa5a-zA-Z]+)[:\s：]\s*(\d+)/);
                  if (match) {
                    playerAttrValue = parseInt(match[2], 10);
                    foundPlayer = true;
                    break;
                  }
                }
              }
            }

            // 重要人物表
            if (sheet.name === '重要人物表' && npcName) {
              for (var j = 1; j < sheet.content.length; j++) {
                var row = sheet.content[j];
                if (row && row[1] === npcName) {
                  var npcAttrStr = row[9] || '';
                  var npcParts = npcAttrStr.split(/[,，;；\s]+/);
                  for (var k = 0; k < npcParts.length; k++) {
                    var npcMatch = npcParts[k].match(/^([\u4e00-\u9fa5a-zA-Z]+)[:\s：]\s*(\d+)/);
                    if (npcMatch) {
                      npcAttrValue = parseInt(npcMatch[2], 10);
                      foundNPC = true;
                      break;
                    }
                  }
                  break;
                }
              }
            }
          }
        }

        showContestPanel({
          initiatorName: '<user>',
          initiatorValue: playerAttrValue,
          opponentName: npcName,
          opponentValue: npcAttrValue,
          diceType: '1d100',
        });
      });
    // [重构] 仪表盘预览功能：复用表格卡片渲染，完整功能
    $('body')
      .off('click.acu_dash_preview')
      .on('click.acu_dash_preview', '.acu-dash-preview-trigger', function (e) {
        e.stopPropagation();

        const tableKey = $(this).data('table-key');
        const rowIndex = parseInt($(this).data('row-index'), 10);

        if (!tableKey || isNaN(rowIndex)) return;

        const rawData = cachedRawData || getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const table = rawData[tableKey];
        const tableName = table.name || '详情';
        const headers = table.content[0] || [];
        const rowData = table.content[rowIndex + 1];

        if (!rowData) return;

        const config = getConfig();
        const title = rowData[1] || '未命名';

        // 复用 renderTableContent 中的卡片渲染逻辑
        const titleColIndex = 1;
        const realRowIdx = rowIndex;

        // 构建卡片内容（复用主表格的渲染逻辑）
        let cardBody = '';
        rowData.forEach((cell, cIdx) => {
          if (cIdx <= 0 || cIdx === titleColIndex) return;
          const currentHeader = headers[cIdx] || '';
          if (currentHeader.includes('交互')) return; // 隐藏交互选项列

          const headerName = headers[cIdx] || '属性' + cIdx;
          const rawStr = String(cell || '').trim();
          if (!rawStr) return;

          let contentHtml = '';
          let hideLabel = false;

          const parsedAttrs = parseAttributeString(rawStr);
          // [新增] 人际关系智能拆分
          if (isRelationshipCell(rawStr, headerName)) {
            const relations = parseRelationshipString(rawStr);
            if (relations.length > 1) {
              hideLabel = true;
              let relHtml = '';
              relations.forEach((rel, i) => {
                const borderStyle = i < relations.length - 1 ? 'border-bottom:1px dashed rgba(128,128,128,0.2);' : '';
                relHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;${borderStyle}">
                            <span style="color:var(--acu-text-main);font-size:0.95em;">${escapeHtml(rel.name)}</span>
                            ${rel.relation ? `<span style="color:var(--acu-text-sub);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">${escapeHtml(rel.relation)}</span>` : ''}
                        </div>`;
              });
              contentHtml = `<div class="acu-relation-container">${relHtml}</div>`;
            } else if (relations.length === 1 && relations[0].relation) {
              const rel = relations[0];
              contentHtml = `<div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:var(--acu-text-main);">${escapeHtml(rel.name)}</span>
                        <span style="color:var(--acu-text-sub);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">${escapeHtml(rel.relation)}</span>
                    </div>`;
            }
          } else if (parsedAttrs.length > 1) {
            hideLabel = true;
            let attrsHtml = '';
            parsedAttrs.forEach((attr, i) => {
              const borderStyle = i < parsedAttrs.length - 1 ? 'border-bottom:1px dashed rgba(128,128,128,0.2);' : '';
              attrsHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;${borderStyle}">
                        <span style="color:var(--acu-text-sub);font-size:0.95em;">${escapeHtml(attr.name)}</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span style="color:var(--acu-text-main);font-weight:bold;">${attr.value}</span>
                            <i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="${escapeHtml(attr.name)}" data-attr-value="${attr.value}" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:11px;" title="检定"></i>
                        </div></div>`;
            });
            contentHtml = `<div class="acu-multi-attr-container">${attrsHtml}</div>`;
          } else if (parsedAttrs.length === 1) {
            hideLabel = true;
            const attr = parsedAttrs[0];
            contentHtml = `<div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:var(--acu-text-sub);font-size:0.95em;">${escapeHtml(attr.name)}</span>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <span style="color:var(--acu-text-main);font-weight:bold;">${attr.value}</span>
                        <i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="${escapeHtml(attr.name)}" data-attr-value="${attr.value}" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:11px;" title="检定"></i>
                    </div></div>`;
          } else if (isNumericCell(rawStr) && !rawStr.includes(':') && !rawStr.includes('：')) {
            const numVal = extractNumericValue(rawStr);
            contentHtml = `<div style="display:flex;justify-content:space-between;align-items:center;">
                    <span>${escapeHtml(rawStr)}</span>
                    <i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="${escapeHtml(headerName)}" data-attr-value="${numVal}" style="cursor:pointer;color:var(--acu-accent);opacity:0.5;font-size:11px;margin-left:6px;" title="检定"></i>
                </div>`;
          } else {
            const badgeStyle = getBadgeStyle(rawStr);
            contentHtml = badgeStyle
              ? `<span class="acu-badge ${badgeStyle}">${escapeHtml(rawStr)}</span>`
              : escapeHtml(rawStr);
          }

          const rowClass = 'acu-card-row acu-cell' + (hideLabel ? ' acu-hide-label' : '');
          cardBody += `<div class="${rowClass}" data-key="${escapeHtml(tableKey)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${cIdx}" data-val="${encodeURIComponent(cell ?? '')}">
                <div class="acu-card-label">${escapeHtml(headerName)}</div>
                <div class="acu-card-value">${contentHtml}</div>
            </div>`;
        });

        // 构建动作按钮
        let actionsHtml = '';
        let tableActions = getActionsForTable(tableName);
        const interactColIdx = headers.findIndex(h => h && String(h).includes('交互'));
        if (interactColIdx > 0 && rowData[interactColIdx]) {
          const interactOptions = String(rowData[interactColIdx])
            .split(/[,，、;；]/)
            .map(s => s.trim())
            .filter(s => s);
          if (interactOptions.length > 0) {
            tableActions = interactOptions.map(opt => ({
              label: opt,
              icon: 'fa-hand-pointer',
              type: 'prompt',
              template: `<user>对{Name}进行交互：${opt}。`,
              auto_send: true,
            }));
          }
        }
        if (tableActions.length > 0) {
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${escapeHtml(act.label)}</button>`,
            )
            .join('');
          actionsHtml = `<div class="acu-card-actions">${actionBtns}</div>`;
        }

        // 构建完整卡片
        const cardHtml = `
            <div class="acu-preview-overlay acu-theme-${config.theme}" style="--acu-card-width:${config.cardWidth}px;--acu-font-size:${config.fontSize}px;">
                <div class="acu-data-card" style="width:90vw;max-width:420px;max-height:85vh;overflow-y:auto;">
                    <div class="acu-card-header">
                        <span class="acu-card-index">#${realRowIdx + 1}</span>
                        <span class="acu-cell acu-editable-title" data-key="${escapeHtml(tableKey)}" data-tname="${escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${encodeURIComponent(title)}">${escapeHtml(title)}</span>
                        <button class="acu-preview-close" style="margin-left:auto;background:none;border:none;color:var(--acu-text-sub);cursor:pointer;font-size:16px;padding:4px;"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-card-body view-list">${cardBody}</div>
                    ${actionsHtml}
                </div>
            </div>
        `;

        $('.acu-preview-overlay').remove();
        $('body').append(cardHtml);

        // 强制样式修复
        const overlayEl = $('.acu-preview-overlay')[0];
        if (overlayEl) {
          overlayEl.style.setProperty('position', 'fixed', 'important');
          overlayEl.style.setProperty('top', '0', 'important');
          overlayEl.style.setProperty('left', '0', 'important');
          overlayEl.style.setProperty('right', '0', 'important');
          overlayEl.style.setProperty('bottom', '0', 'important');
          overlayEl.style.setProperty('width', '100vw', 'important');
          overlayEl.style.setProperty('height', '100vh', 'important');
          overlayEl.style.setProperty('display', 'flex', 'important');
          overlayEl.style.setProperty('justify-content', 'center', 'important');
          overlayEl.style.setProperty('align-items', 'center', 'important');
          overlayEl.style.setProperty('z-index', '2147483650', 'important');
        }

        // 关闭事件
        $('.acu-preview-overlay').on('click', function (ev) {
          if ($(ev.target).hasClass('acu-preview-overlay') || $(ev.target).closest('.acu-preview-close').length) {
            $(this).remove();
          }
        });
      });

    // === [修复] 移动端审核面板：阻止水平滑动冒泡，防止触发 ST 的 swipe regenerate ===
    (function () {
      const $doc = $(document);
      let touchStartX = 0;
      let touchStartY = 0;

      // 使用事件委托，监听整个 data-area
      $doc.on('touchstart.acuSwipeFix', '#acu-data-area', function (e) {
        if (e.originalEvent.touches.length === 1) {
          touchStartX = e.originalEvent.touches[0].clientX;
          touchStartY = e.originalEvent.touches[0].clientY;
        }
      });

      $doc.on('touchmove.acuSwipeFix', '#acu-data-area', function (e) {
        if (e.originalEvent.touches.length !== 1) return;

        const touch = e.originalEvent.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);

        // 如果是水平滑动为主（X位移 > Y位移 * 1.5），阻止冒泡
        if (deltaX > deltaY * 1.5 && deltaX > 10) {
          e.stopPropagation();
          console.log('[ACU] 阻止水平滑动冒泡，防止 ST swipe');
        }
      });
    })();
  };

  let selectedSwapSource = null;
  const toggleOrderEditMode = () => {
    const { $ } = getCore();
    isEditingOrder = !isEditingOrder;

    const $container = $('#acu-nav-bar');
    const $hint = $('#acu-order-hint');
    const $pool = $('#acu-action-pool');

    // 检查必要元素是否存在
    if (!$container.length) {
      console.error('[ACU] 找不到导航栏容器');
      isEditingOrder = false;
      return;
    }

    selectedSwapSource = null;
    $('.acu-swap-selected').removeClass('acu-swap-selected');

    if (isEditingOrder) {
      // 进入编辑模式
      $container.addClass('editing-order');
      if ($pool.length) $pool.addClass('visible');

      if ($hint.length) {
        $hint
          .html(
            `
                    <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:8px;">
                        <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:200px;">
                            <span><i class="fa-solid fa-layer-group"></i> 布局编辑</span>
                            <span style="font-size:11px; opacity:0.9; font-weight:normal;">拖动或点击交换位置</span>
                        </div>
                        <button id="acu-btn-finish-sort" style="background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.4); padding:4px 14px; border-radius:4px; cursor:pointer; font-size:12px; transition:all 0.2s; white-space:nowrap;">
                            <i class="fa-solid fa-check"></i> 完成保存
                        </button>
                    </div>
                `,
          )
          .addClass('visible')
          .css('display', 'flex');

        $('#acu-btn-finish-sort').hover(
          function () {
            $(this).css({ background: '#fff', color: 'var(--acu-accent)' });
          },
          function () {
            $(this).css({ background: 'rgba(255,255,255,0.2)', color: '#fff' });
          },
        );

        $('#acu-btn-finish-sort')
          .off('click')
          .on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            toggleOrderEditMode();
          });
      }

      // 关闭数据面板
      $('#acu-data-area').removeClass('visible');

      // 设置可拖拽属性（排除特殊按钮）
      $container.find('.acu-nav-btn').not('#acu-btn-dashboard, #acu-btn-dice-nav').attr('draggable', 'true');
      $container.find('.acu-action-btn').attr('draggable', 'true');

      // 初始化拖拽
      initSortable();
    } else {
      // 退出编辑模式
      $container.removeClass('editing-order');
      if ($hint.length) $hint.removeClass('visible').hide();
      if ($pool.length) $pool.removeClass('visible');

      // 移除拖拽属性和事件
      $container.find('.acu-nav-btn, .acu-action-btn').attr('draggable', 'false');
      $('.acu-nav-btn, .acu-action-btn').off('.sort');
      $('#acu-action-pool, #acu-active-actions').off('.sort');

      // 保存表格标签顺序
      const newTableOrder = [];
      $container.find('.acu-nav-btn[data-table]').each(function () {
        const tableName = $(this).data('table');
        if (tableName) {
          newTableOrder.push(tableName);
        }
      });
      if (newTableOrder.length > 0) {
        saveTableOrder(newTableOrder);
      }

      // 保存功能按钮顺序
      const newActionOrder = [];
      $('#acu-active-actions .acu-action-btn').each(function () {
        const btnId = $(this).attr('id');
        if (btnId) {
          newActionOrder.push(btnId);
        }
      });

      // 保护设置按钮
      if (!newActionOrder.includes('acu-btn-settings')) {
        newActionOrder.push('acu-btn-settings');
      }

      Store.set(STORAGE_KEY_ACTION_ORDER, newActionOrder);

      // 重绘界面
      renderInterface();
    }
  };

  const initSortable = () => {
    const { $ } = getCore();
    let $dragSrcEl = null;

    // 清理旧事件
    $('.acu-nav-btn, .acu-action-btn, #acu-action-pool, #acu-active-actions').off('.sort');

    // --- 1. 按钮本身的拖拽逻辑 (交换顺序) ---
    const $items = $('.acu-nav-btn, .acu-action-btn');

    $items.on('dragstart.sort', function (e) {
      $dragSrcEl = $(this);
      $(this).css('opacity', '0.4');
      e.originalEvent.dataTransfer.effectAllowed = 'move';
    });

    $items.on('dragend.sort', function (e) {
      $(this).css('opacity', '1');
      $('.acu-drag-over').removeClass('acu-drag-over');
      $('.acu-actions-group, .acu-unused-pool').removeClass('dragging-over');
    });

    $items.on('dragover.sort', function (e) {
      e.preventDefault();
      return false;
    });
    $items.on('dragenter.sort', function () {
      if ($dragSrcEl && this !== $dragSrcEl[0]) $(this).addClass('acu-drag-over');
    });
    $items.on('dragleave.sort', function () {
      $(this).removeClass('acu-drag-over');
    });

    $items.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('acu-drag-over');
      if (!$dragSrcEl || $dragSrcEl[0] === this) return false;

      const isSrcAction = $dragSrcEl.hasClass('acu-action-btn');
      const isTgtAction = $(this).hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) return false;

      if (isSrcAction) {
        const targetPoolId = $(this).parent().attr('id');
        const srcPoolId = $dragSrcEl.parent().attr('id');

        if (srcPoolId === 'acu-action-pool' && targetPoolId === 'acu-active-actions') {
          if ($('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
            if (window.toastr) window.toastr.warning('活动栏最多6个，请先拖走一个');
            return false;
          }
        }

        if (srcPoolId !== targetPoolId) {
          $(this).before($dragSrcEl);
          return false;
        }
      }

      const $temp = $('<span>').hide();
      $dragSrcEl.before($temp);
      $(this).before($dragSrcEl);
      $temp.replaceWith($(this));
      return false;
    });

    // --- 2. 容器的拖拽逻辑 (上架/下架) ---
    const $containers = $('#acu-action-pool, #acu-active-actions');

    $containers.on('dragover.sort', function (e) {
      e.preventDefault();
      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        $(this).addClass('dragging-over');
      }
    });

    $containers.on('dragleave.sort', function (e) {
      $(this).removeClass('dragging-over');
    });

    $containers.on('drop.sort', function (e) {
      e.stopPropagation();
      $(this).removeClass('dragging-over');

      if ($dragSrcEl && $dragSrcEl.hasClass('acu-action-btn')) {
        const currentParentId = $dragSrcEl.parent().attr('id');
        const targetId = $(this).attr('id');
        const btnId = $dragSrcEl.attr('id');

        if (currentParentId !== targetId) {
          if (targetId === 'acu-action-pool') {
            if (btnId === 'acu-btn-settings') {
              if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
              return false;
            }
            $(this).append($dragSrcEl);
          } else if (targetId === 'acu-active-actions') {
            if ($(this).children().length >= 6) {
              if (window.toastr) window.toastr.warning('活动栏已满6个，无法继续添加');
              return false;
            }
            $(this).append($dragSrcEl);
          }
        }
      }
      return false;
    });

    // --- 【新增】3. 容器点击事件 - 支持点动移动功能按钮 ---
    $containers.on('click.sort', function (e) {
      e.stopPropagation();

      // 如果点击的是按钮本身，不处理
      if ($(e.target).closest('.acu-action-btn, .acu-nav-btn').length > 0) return;

      // 如果没有选中任何按钮，不处理
      if (!selectedSwapSource) return;

      const $src = $(selectedSwapSource);

      // 只有功能按钮才能跨池移动
      if (!$src.hasClass('acu-action-btn')) {
        if (window.toastr) window.toastr.warning('表格标签不能移入功能池');
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const targetId = $(this).attr('id');
      const btnId = $src.attr('id');

      // 同一个容器内点击，取消选中
      if (srcPoolId === targetId) {
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      // 活动栏 → 备选池
      if (targetId === 'acu-action-pool') {
        if (btnId === 'acu-btn-settings') {
          if (window.toastr) window.toastr.warning('设置按钮是核心组件，无法移除');
          $src.removeClass('acu-swap-selected');
          selectedSwapSource = null;
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
      }
      // 备选池 → 活动栏
      else if (targetId === 'acu-active-actions') {
        if ($('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏已满6个，请先移走一个');
          return;
        }
        $(this).append($src);
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = null;
      }
    });

    // --- 4. 点击互换模式 (Click-to-Swap) - 按钮之间 ---
    $items.on('click.sort', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (selectedSwapSource && selectedSwapSource === this) {
        $(this).removeClass('acu-swap-selected');
        selectedSwapSource = null;
        return;
      }

      if (!selectedSwapSource) {
        selectedSwapSource = this;
        $(this).addClass('acu-swap-selected');
        return;
      }

      const $src = $(selectedSwapSource);
      const $tgt = $(this);

      const isSrcAction = $src.hasClass('acu-action-btn');
      const isTgtAction = $tgt.hasClass('acu-action-btn');
      if (isSrcAction !== isTgtAction) {
        if (window.toastr) window.toastr.warning('无法在表格标签和功能按钮之间交换');
        $src.removeClass('acu-swap-selected');
        selectedSwapSource = this;
        $(this).addClass('acu-swap-selected');
        return;
      }

      const srcPoolId = $src.parent().attr('id');
      const tgtPoolId = $tgt.parent().attr('id');

      if (isSrcAction && srcPoolId === 'acu-action-pool' && tgtPoolId === 'acu-active-actions') {
        if ($('#acu-active-actions').children().length >= MAX_ACTION_BUTTONS) {
          if (window.toastr) window.toastr.warning('活动栏最多6个，请先移走一个');
          return;
        }
      }

      if (srcPoolId !== tgtPoolId) {
        $tgt.before($src);
      } else {
        const $temp = $('<span>').hide();
        $src.before($temp);
        $tgt.before($src);
        $temp.replaceWith($tgt);
      }

      $src.removeClass('acu-swap-selected');
      selectedSwapSource = null;
    });
  };

  const showCellMenu = (e, cell) => {
    const { $ } = getCore();
    $('.acu-cell-menu, .acu-menu-backdrop').remove();
    const backdrop = $('<div class="acu-menu-backdrop"></div>');
    $('body').append(backdrop);

    const rowIdx = parseInt($(cell).data('row'), 10);
    const colIdx = parseInt($(cell).data('col'), 10);
    if (isNaN(rowIdx) || isNaN(colIdx)) {
      console.warn('[ACU] 无效的行/列索引');
      backdrop.remove();
      return;
    }
    const tableKey = $(cell).data('key');
    // v19.x 可能没有 tname，尝试获取
    const tableName = $(cell).data('tname') || $(cell).closest('.acu-data-card').find('.acu-editable-title').text();
    const content = decodeURIComponent($(cell).data('val'));
    const config = getConfig();

    // 唯一标识 ID
    const cellId = `${tableKey}-${rowIdx}-${colIdx}`;
    if (!window.acuModifiedSet) window.acuModifiedSet = new Set();

    // 状态检查
    const isModified = window.acuModifiedSet.has(cellId);

    // 获取当前表格的待删除列表
    const pendingDeletionsMap = getPendingDeletions();
    const tableDeletions = pendingDeletionsMap[tableKey] || [];
    const isPending = tableDeletions.includes(rowIdx);

    // 计算锁定状态
    const headers = cachedRawData?.[tableKey]?.content?.[0] || [];
    const rowData = cachedRawData?.[tableKey]?.content?.[rowIdx + 1] || [];
    const lockRowKey = LockManager.getRowKey(tableName, rowData, headers);
    const currentHeader = headers[colIdx] || '';

    const isFieldLocked = lockRowKey && LockManager.isFieldLocked(tableName, lockRowKey, currentHeader);
    const isRowLocked = lockRowKey && LockManager.isRowLocked(tableName, lockRowKey);

    // 构建锁定菜单项
    let lockMenuHtml = '';
    if (lockRowKey) {
      lockMenuHtml = '<div style="border-top:1px dashed var(--acu-border); margin:4px 0;"></div>';
      if (isFieldLocked) {
        lockMenuHtml +=
          '<div class="acu-cell-menu-item" id="act-unlock-field" style="color:#27ae60;"><i class="fa-solid fa-unlock"></i> 解锁此单元格</div>';
      } else {
        lockMenuHtml +=
          '<div class="acu-cell-menu-item" id="act-lock-field" style="color:#f39c12;"><i class="fa-solid fa-lock"></i> 锁定此单元格</div>';
      }
      if (isRowLocked) {
        lockMenuHtml +=
          '<div class="acu-cell-menu-item" id="act-unlock-row" style="color:#27ae60;"><i class="fa-solid fa-unlock"></i> 解锁整行</div>';
      } else {
        lockMenuHtml +=
          '<div class="acu-cell-menu-item" id="act-lock-row" style="color:#f39c12;"><i class="fa-solid fa-lock"></i> 锁定整行</div>';
      }
    }

    const menu = $(`
            <div class="acu-cell-menu acu-theme-${config.theme}">
                <div class="acu-cell-menu-item" id="act-edit"><i class="fa-solid fa-pen"></i> 编辑内容</div>
                <div class="acu-cell-menu-item" id="act-edit-card" style="color:#9b59b6"><i class="fa-solid fa-edit"></i> 整体编辑</div>
                <div class="acu-cell-menu-item" id="act-insert" style="color:#2980b9"><i class="fa-solid fa-plus"></i> 在下方插入新行</div>
                <div class="acu-cell-menu-item" id="act-copy"><i class="fa-solid fa-copy"></i> 复制内容</div>
                ${isNumericCell(content) ? '<div class="acu-cell-menu-item" id="act-dice" style="color:#9b59b6; border-top:1px dashed var(--acu-border);"><i class="fa-solid fa-dice-d20"></i> 投骰检定 (' + extractNumericValue(content) + ')</div>' : ''}
                ${lockMenuHtml}
                ${isModified ? '<div class="acu-cell-menu-item" id="act-undo" style="color:#e67e22; border-top:1px solid #eee;"><i class="fa-solid fa-undo"></i> 撤销本次修改</div>' : ''}
                ${isPending ? '<div class="acu-cell-menu-item" id="act-restore" style="color:#27ae60"><i class="fa-solid fa-undo"></i> 恢复整行</div>' : '<div class="acu-cell-menu-item" id="act-delete" style="color:#e74c3c"><i class="fa-solid fa-trash"></i> 删除整行</div>'}
                <div class="acu-cell-menu-item" id="act-close"><i class="fa-solid fa-times"></i> 关闭菜单</div>
            </div>
        `);
    $('body').append(menu);

    // 稳健的坐标计算
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    const mWidth = menu.outerWidth() || 150;
    const mHeight = menu.outerHeight() || 150;
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (!clientX && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
      clientX = e.originalEvent.touches[0].clientX;
      clientY = e.originalEvent.touches[0].clientY;
    } else if (!clientX && e.changedTouches && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    // 兜底坐标
    if (clientX === undefined) clientX = winWidth / 2;
    if (clientY === undefined) clientY = winHeight / 2;

    let left = clientX + 5;
    let top = clientY + 5;
    if (left + mWidth > winWidth) left = clientX - mWidth - 5;
    if (top + mHeight > winHeight) top = clientY - mHeight - 5;

    // 防止负坐标
    if (left < 5) left = 5;
    if (top < 5) top = 5;

    menu.css({ top: top + 'px', left: left + 'px' });

    const closeAll = () => {
      menu.remove();
      backdrop.remove();
    };
    backdrop.on('click', closeAll);
    menu.find('#act-close').click(closeAll);
    // 锁定字段
    menu.find('#act-lock-field').click(() => {
      if (lockRowKey && currentHeader) {
        LockManager.lockField(tableName, lockRowKey, currentHeader, content);
        renderInterface();
      }
      closeAll();
    });

    // 解锁字段
    menu.find('#act-unlock-field').click(() => {
      if (lockRowKey && currentHeader) {
        LockManager.unlockField(tableName, lockRowKey, currentHeader);
        renderInterface();
      }
      closeAll();
    });

    // 锁定整行
    menu.find('#act-lock-row').click(() => {
      if (lockRowKey) {
        LockManager.lockRow(tableName, lockRowKey, rowData, headers);
        renderInterface();
      }
      closeAll();
    });

    // 解锁整行
    menu.find('#act-unlock-row').click(() => {
      if (lockRowKey) {
        LockManager.unlockRow(tableName, lockRowKey);
        renderInterface();
      }
      closeAll();
    });

    // 复制功能 (v7.9 融合增强版：优先酒馆接口，兼容性最佳)
    menu.find('#act-copy').click(async e => {
      e.stopPropagation();

      // 【第一优先级】尝试使用酒馆 v7.7 的原生接口 (移动端/PWA 完美兼容)
      // 来源: slash_command.txt /clipboard-set
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        try {
          // 转义特殊字符防止命令崩溃
          const safeContent = content
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');
          await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
          closeAll();
          return; // 如果成功，直接结束，不走后面的浏览器逻辑
        } catch (err) {
          console.warn('酒馆接口复制失败，尝试浏览器原生方法', err);
        }
      }

      // 【第二优先级】浏览器原生逻辑 (v7.8 的兜底方案)
      const doCopy = text => {
        // 方案A: 现代 API (仅在 HTTPS 或 localhost 下有效)
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch(() => {
              fallbackCopy(text);
            });
        } else {
          // 方案B: 传统 execCommand (兼容 HTTP)
          fallbackCopy(text);
        }
      };

      const fallbackCopy = text => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;

          // 移动端防抖动处理
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');

          document.body.appendChild(textArea);

          textArea.select();
          textArea.setSelectionRange(0, 99999); // 针对 iOS Safari

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
          } else {
            throw new Error('execCommand failed');
          }
        } catch (err) {
          console.error('复制失败:', err);
          prompt('复制失败，请长按下方文本手动复制:', text);
        }
      };

      doCopy(content);
      closeAll();
    });

    // 撤销功能
    menu.find('#act-undo').click(() => {
      const snapshot = loadSnapshot();
      let originalValue = null;
      if (snapshot && snapshot[tableKey]?.content[rowIdx + 1]) {
        originalValue = snapshot[tableKey].content[rowIdx + 1][colIdx];
      }

      if (originalValue !== null) {
        if (!cachedRawData) cachedRawData = getTableData();
        if (cachedRawData && cachedRawData[tableKey]?.content[rowIdx + 1]) {
          cachedRawData[tableKey].content[rowIdx + 1][colIdx] = originalValue;
        }

        const $cell = $(cell);
        $cell.attr('data-val', encodeURIComponent(originalValue));
        $cell.data('val', encodeURIComponent(originalValue));

        // [核心修复1] 正确查找显示目标，防止覆盖 Label
        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length > 0) {
          $displayTarget = $cell.find('.acu-card-value');
        } else if ($cell.hasClass('acu-grid-item')) {
          $displayTarget = $cell.find('.acu-grid-value');
        } else if ($cell.hasClass('acu-full-item')) {
          $displayTarget = $cell.find('.acu-full-value');
        }

        const badgeStyle = getBadgeStyle(originalValue);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${originalValue}</span>`);
        } else {
          $displayTarget.text(originalValue);
        }

        // [修复] 修正类名，确保撤销后高亮立即消失
        $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
        if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

        window.acuModifiedSet.delete(cellId);

        if (window.acuModifiedSet.size === 0) {
          hasUnsavedChanges = false;
          updateSaveButtonState();
        }
      } else {
        if (window.toastr) window.toastr.warning('无法找到原始数据，撤销失败');
      }
      closeAll();
    });

    // [优化] 删除逻辑 (支持即时模式 & 视觉秒删)
    menu.find('#act-delete').click(async () => {
      closeAll();

      let actOrd = Store.get(STORAGE_KEY_ACTION_ORDER);
      if (!actOrd || !Array.isArray(actOrd))
        actOrd = ['acu-btn-save-global', 'acu-btn-collapse', 'acu-btn-refresh', 'acu-btn-settings'];
      const isInstantMode = !actOrd.includes('acu-btn-save-global');

      if (isInstantMode) {
        // --- 视觉优化：前端直接移除 DOM，不等待后台 ---
        const $card = $(cell).closest('.acu-data-card');
        $card.css('transition', 'all 0.2s ease').css('opacity', '0').css('transform', 'scale(0.9)');
        setTimeout(() => $card.slideUp(200, () => $card.remove()), 200);

        // --- 数据操作 ---
        if (!cachedRawData) cachedRawData = getTableData() || loadSnapshot();
        if (cachedRawData && cachedRawData[tableKey]?.content) {
          cachedRawData[tableKey].content.splice(rowIdx + 1, 1);

          // 【关键】手动更新快照，并告诉保存函数 skipRender=true (跳过重绘)
          saveSnapshot(cachedRawData);
          await saveDataToDatabase(cachedRawData, true, true);
        }
      } else {
        // --- 默认模式 (手动保存) ---
        const dels = getPendingDeletions();
        if (!dels[tableKey]) dels[tableKey] = [];
        if (!dels[tableKey].includes(rowIdx)) {
          dels[tableKey].push(rowIdx);
          savePendingDeletions(dels);
        }

        // 视觉变灰
        $(cell).closest('.acu-data-card').addClass('pending-deletion');

        // 刷新按钮状态
        updateSaveButtonState();
      }
    });

    // 恢复逻辑
    menu.find('#act-restore').click(() => {
      const dels = getPendingDeletions();
      if (dels[tableKey]) {
        dels[tableKey] = dels[tableKey].filter(i => i !== rowIdx);
        if (dels[tableKey].length === 0) delete dels[tableKey];
        savePendingDeletions(dels);
      }

      $(cell).closest('.acu-data-card').removeClass('pending-deletion');
      updateSaveButtonState();
      closeAll();
    });

    // [新增] 插入新行功能 (修复版：增加立即重绘指令)
    menu.find('#act-insert').click(async () => {
      closeAll();
      // 1. 获取最新数据 (优先用缓存，没有则重新获取)
      if (!cachedRawData) cachedRawData = getTableData();
      if (!cachedRawData) cachedRawData = loadSnapshot();

      if (cachedRawData && cachedRawData[tableKey]?.content) {
        const sheet = cachedRawData[tableKey];
        // 2. 构造空行 (长度等于表头)
        const colCount = sheet.content[0] ? sheet.content[0].length : 2;
        const newRow = new Array(colCount).fill('');
        // 智能填充序号 (简单的自增逻辑)
        if (colCount > 0) newRow[0] = String(sheet.content.length);

        // 3. 插入数据 (rowIdx是当前行下标，+2 表示插入到当前行对应的 content 索引之后)
        sheet.content.splice(rowIdx + 2, 0, newRow);

        // 4. 保存
        // 先保存数据
        await saveDataToDatabase(cachedRawData, false, true);

        // 【核心修复】保存后立即重绘界面，否则新行不会显示！
        renderInterface();

        // 额外优化：如果是竖向模式，尝试滚动一下以确保新行可见
        setTimeout(() => {
          const $panel = $('.acu-panel-content');
          // 只有当不在底部时才微调，防止乱跳
          if ($panel.length && $panel[0].scrollHeight > $panel.height()) {
            $panel.scrollTop($panel.scrollTop() + 10);
          }
        }, 100);
      }
    });

    // [新增] 整体编辑事件
    menu.find('#act-edit-card').click(() => {
      closeAll();
      const rawData = cachedRawData || getTableData();
      if (rawData && rawData[tableKey]) {
        const headers = rawData[tableKey].content[0];
        const row = rawData[tableKey].content[rowIdx + 1];
        if (row) {
          showCardEditModal(row, headers, tableName, rowIdx, tableKey);
        }
      }
    });

    // [新增] 投骰检定功能
    menu.find('#act-dice').click(() => {
      closeAll();
      const targetValue = extractNumericValue(content);
      const headerName = $(cell).find('.acu-card-label').text() || '属性';
      showDicePanel({
        targetValue: targetValue,
        targetName: headerName,
        diceType: '1d100',
      });
    });
    menu.find('#act-edit').click(() => {
      closeAll();
      showEditDialog(content, async newVal => {
        // 1. 写入内存数据
        if (!cachedRawData) cachedRawData = getTableData() || loadSnapshot();

        if (cachedRawData && cachedRawData[tableKey]?.content[rowIdx + 1]) {
          cachedRawData[tableKey].content[rowIdx + 1][colIdx] = newVal;
        } else {
          alert('数据结构异常，无法写入缓存，请刷新页面');
          return;
        }

        // 2. 准备 UI 元素
        const $cell = $(cell);
        $cell.attr('data-val', encodeURIComponent(newVal)).data('val', encodeURIComponent(newVal));

        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length) $displayTarget = $cell.find('.acu-card-value');
        else if ($cell.hasClass('acu-grid-item')) $displayTarget = $cell.find('.acu-grid-value');
        else if ($cell.hasClass('acu-editable-title')) $displayTarget = $cell;

        // 3. 更新 UI 文字/样式 (通用)
        const badgeStyle = getBadgeStyle(newVal);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${escapeHtml(newVal)}</span>`);
        } else {
          $displayTarget.text(newVal);
        }

        // 4. 判断模式：即时保存 vs 手动保存
        let actOrd = Store.get(STORAGE_KEY_ACTION_ORDER);
        if (!actOrd || !Array.isArray(actOrd))
          actOrd = ['acu-btn-save-global', 'acu-btn-collapse', 'acu-btn-refresh', 'acu-btn-settings'];
        const isInstantMode = !actOrd.includes('acu-btn-save-global');

        if (isInstantMode) {
          // --- A. 即时模式 ---
          // 移除高亮 (因为马上就保存了)
          $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
          if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

          // 立即保存 (后台)
          saveSnapshot(cachedRawData);
          await saveDataToDatabase(cachedRawData, true, true);
        } else {
          // --- B. 普通模式 (关键修复点) ---
          // 必须手动加上高亮类，否则用户不知道改了哪里
          $displayTarget.removeClass('acu-highlight-diff').addClass('acu-highlight-manual');
          if ($cell.hasClass('acu-editable-title'))
            $cell.removeClass('acu-highlight-diff').addClass('acu-highlight-manual');

          // 标记为未保存
          if (!window.acuModifiedSet) window.acuModifiedSet = new Set();
          window.acuModifiedSet.add(cellId);
          hasUnsavedChanges = true;
          updateSaveButtonState();
        }
      });
    });
  };

  const showEditDialog = (content, onSave) => {
    const { $ } = getCore();
    const config = getConfig();

    const dialog = $(`
            <div class="acu-edit-overlay">
                <!-- 2. [修改] 在这里加上 acu-theme-${config.theme} -->
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">编辑单元格内容</div>
                    <textarea class="acu-edit-textarea" spellcheck="false">${escapeHtml(content)}</textarea>
                    <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 2 + 'px';
    };
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    dialog.find('#dlg-cancel').click(() => dialog.remove());
    // 点击遮罩层也可以关闭
    dialog.on('click', function (e) {
      if ($(e.target).hasClass('acu-edit-overlay')) dialog.remove();
    });

    dialog.find('#dlg-save').click(() => {
      onSave(dialog.find('textarea').val());
      dialog.remove();
    });
  };

  // ==========================================
  // [优化后] 新的初始化入口 (Observer 只创建一次)
  // ==========================================
  const init = () => {
    if (isInitialized) return;
    MvuModule.injectStyles();

    // 清理旧的 Observer（防止重复监听）
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    addStyles();
    // 2. 保留原有的 SillyTavern 事件监听（使用具名函数防止重复注册）
    if (window.SillyTavern && window.SillyTavern.eventSource) {
      const events = window.SillyTavern.eventTypes;
      const source = window.SillyTavern.eventSource;
      const triggers = [events.CHAT_CHANGED, events.MESSAGE_SWIPED, events.MESSAGE_DELETED, events.MESSAGE_UPDATED];

      // 确保只创建一次处理函数
      if (!_boundRenderHandler) {
        _boundRenderHandler = () => {
          if (!isEditingOrder) setTimeout(renderInterface, 500);
        };
      }

      // 确保只创建一次聊天切换处理函数（移到模块级防止重复注册）
      if (!window._acuBoundChatChangeHandler) {
        window._acuBoundChatChangeHandler = () => {
          cachedRawData = null;
          tablePageStates = {};
          tableSearchStates = {};
          tableScrollStates = {};
          hasUnsavedChanges = false;
          currentDiffMap.clear();
          if (window.acuModifiedSet) window.acuModifiedSet.clear();
          setTimeout(renderInterface, 500);
        };
      }
      const _boundChatChangeHandler = window._acuBoundChatChangeHandler;

      triggers.forEach(evt => {
        if (evt) {
          source.removeListener(evt, _boundRenderHandler);
          source.removeListener(evt, _boundChatChangeHandler); // 防止重复注册
          if (evt === events.CHAT_CHANGED) {
            source.on(evt, _boundChatChangeHandler);
          } else {
            source.on(evt, _boundRenderHandler);
          }
        }
      });
    }

    // 3. 轮询等待数据库 API 就绪
    const loop = () => {
      const api = getCore().getDB();
      if (api?.exportTableAsJson) {
        isInitialized = true;

        // --- [Fix] 移动到这里：确保 API 就绪且 #chat 存在后再启动监听 (带节流优化) ---
        const $chat = $('#chat');
        if ($chat.length && !observer) {
          let mutationLock = false;
          const handleMutation = () => {
            if (mutationLock) return;
            mutationLock = true;
            requestAnimationFrame(() => {
              const config = getConfig();
              if (config.positionMode === 'embedded') {
                mutationLock = false;
                return;
              }

              const children = $chat.children();
              const lastChild = children.last()[0];
              const wrapper = $('.acu-wrapper')[0];

              if (wrapper && lastChild && lastChild !== wrapper) {
                if ($(lastChild).hasClass('mes') || $(lastChild).hasClass('message-body')) {
                  $chat.append(wrapper);
                }
              }
              mutationLock = false;
            });
          };
          observer = new MutationObserver(handleMutation);
          observer.observe($chat[0], { childList: true });
        }
        // --------------------------------------------------

        renderInterface(); // 首次渲染
        // 注册回调
        if (api.registerTableUpdateCallback) {
          api.registerTableUpdateCallback(UpdateController.handleUpdate);

          // 恢复快照功能
          if (api.registerTableFillStartCallback) {
            api.registerTableFillStartCallback(() => {
              const current = api.exportTableAsJson();
              if (current) saveSnapshot(current);
            });
          }
        }
      } else {
        // 限制重试次数，防止无限循环 (约 60秒后放弃)
        if (!isInitialized) {
          window._acuInitRetries = (window._acuInitRetries || 0) + 1;
          if (window._acuInitRetries < 60) {
            setTimeout(loop, 1000);
          } else {
            console.warn('[ACU] 未检测到数据库后端 API，停止轮询。请确保已安装神·数据库脚本。');
          }
        }
      }
    };
    loop();

    // [新增] 监听用户发送消息 - 隐藏选项面板（选项已过时）
    const setupOptionHideListener = () => {
      const hideOptionPanel = () => {
        optionPanelVisible = false;
        $('.acu-option-panel, .acu-embedded-options-container').fadeOut(200, function () {
          $(this).remove();
        });
      };

      // [优化] 统一事件注册逻辑 (优先 ST 原生 -> 降级到全局)
      const ST = window.SillyTavern || window.parent?.SillyTavern;
      // 获取事件名，兼容不同版本
      const evtName =
        ST?.eventTypes?.MESSAGE_SENT || (window.tavern_events ? window.tavern_events.MESSAGE_SENT : 'message_sent');

      // 1. 优先使用 ST.eventSource (官方标准)
      if (ST?.eventSource) {
        ST.eventSource.on(evtName, hideOptionPanel);
        return;
      }

      // 2. 降级尝试全局 eventOn (TavernHelper 或旧版环境)
      if (typeof window.eventOn === 'function') {
        window.eventOn(evtName, hideOptionPanel);
        return;
      }
    };

    // 延迟执行，确保酒馆助手已加载
    setTimeout(setupOptionHideListener, 2000);

    // [新增] 页面卸载时清理资源
    $(window)
      .off('beforeunload.acu pagehide.acu')
      .on('beforeunload.acu pagehide.acu', () => {
        try {
          localStorage.setItem(STORAGE_KEY_SCROLL, JSON.stringify(tableScrollStates));
          if (observer) {
            observer.disconnect();
            observer = null;
          }
        } catch (e) {}
      });
  };

  const { $ } = getCore();
  if ($) $(document).ready(init);
  else window.addEventListener('load', init);
})();
