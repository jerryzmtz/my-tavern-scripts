/**
 * 骰子系统主样式表
 *
 * 此文件从 index.ts 拆分出来，包含所有 CSS 样式定义。
 *
 * ## 为什么拆分？
 * - index.ts 原本超过 31000 行，拆分后提高可维护性
 * - CSS 是纯字符串常量，不涉及运行时逻辑，适合独立管理
 *
 * ## 如何使用？
 * - 在 index.ts 中通过 `import { MAIN_STYLES } from './styles'` 导入
 * - 由 addStyles() 函数注入到页面 <head> 中
 *
 * ## 如何修改样式？
 * - 直接在本文件中编辑 MAIN_STYLES 字符串
 * - 运行 `pnpm build` 验证构建成功
 *
 * @see index.ts - addStyles() 函数（约第 15780 行）
 */
export const MAIN_STYLES = `
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
        text-align: center;
        padding: 6px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-text-main) !important;
        font-size: 12px;
    }
    /* 隐藏number类型输入框的步数器 */
    .acu-dice-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-inner-spin-button,
    .acu-contest-panel input[type="number"]::-webkit-outer-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-inner-spin-button,
    .acu-dice-config-dialog input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .acu-dice-panel input[type="number"],
    .acu-contest-panel input[type="number"],
    .acu-dice-config-dialog input[type="number"] {
        -moz-appearance: textfield;
        text-align: center;
        box-sizing: border-box;
    }
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-dice-config-dialog input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
        text-align: center;
    }
    .acu-dice-input {
        text-align: center;
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
        padding: 4px 4px;
        background: var(--acu-input-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 4px;
        color: var(--acu-text-main) !important;
        font-size: 10px;
        line-height: 1.2;
        min-height: 24px;
        box-sizing: border-box;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
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
    .acu-embedded-options-container button:not(.acu-opt-btn) {
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
    .acu-embedded-options-container button:not(.acu-opt-btn):hover {
        background: var(--acu-btn-hover);
    }
    .acu-wrapper button:focus,
    .acu-edit-overlay button:focus,
    .acu-dice-panel button:focus,
    .acu-contest-panel button:focus,
    .acu-relation-graph-overlay button:focus,
    .acu-avatar-manager-overlay button:focus,
    .acu-preview-overlay button:focus,
    .acu-embedded-options-container button:not(.acu-opt-btn):focus {
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
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-import-confirm-overlay,
    .acu-crop-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.6);
        z-index: 31010;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        backdrop-filter: blur(2px);
    }
    /* 骰子面板遮罩层 - 需要在 preview-overlay(31100) 之上，属于编辑层(31200) */
    .acu-dice-overlay,
    .acu-contest-overlay,
    .acu-dice-config-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.6);
        z-index: 31200 !important;
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

    /* ========== 骰子面板专用样式 ========== */
    /* 骰子面板 - 属于编辑层(31200+)，需要在 preview-overlay(31100) 之上 */
    .acu-dice-panel,
    .acu-contest-panel {
        position: relative;
        z-index: 31201 !important;
        width: 340px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        max-height: calc(100dvh - 32px);
    }
    .acu-dice-panel-header {
        padding: 12px 15px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .acu-dice-panel-title {
        font-size: 15px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .acu-dice-panel-actions button {
        background: none;
        border: none;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 14px;
        padding: 4px;
        transition: all 0.2s;
    }
    .acu-dice-panel-actions button:hover {
        color: var(--acu-accent);
    }
    .acu-dice-panel-body {
        padding: 15px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-presets {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 12px;
        align-items: center;
    }
    .acu-dice-preset {
        padding: 4px 10px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-text-main);
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .acu-dice-preset:hover {
        background: var(--acu-btn-hover);
    }
    .acu-dice-preset.active {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
    }
    .acu-dice-preset.active:hover {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        filter: brightness(1.1);
    }
    .acu-dice-form-row {
        display: grid;
        gap: 6px;
        margin-bottom: 6px;
    }
    .acu-dice-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
    .acu-dice-form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .acu-dice-form-label {
        font-size: 10px;
        color: var(--acu-text-sub);
        margin-bottom: 2px;
        min-height: 18px;
        display: flex;
        align-items: center;
    }
    .acu-dice-form-label.center { justify-content: center; }
    /* Section Title (Party A/B, Quick Select) */
    .acu-dice-section-title {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 6px;
        min-height: 24px;
    }
    .acu-dice-section-title > span {
        font-size: 12px;
        font-weight: bold;
        color: var(--acu-accent);
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }
    .acu-dice-quick-section {
        margin-bottom: 10px;
    }
    .acu-dice-quick-title {
        font-size: 10px;
        color: var(--acu-text-sub);
        font-weight: bold;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-dice-quick-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        max-height: 60px;
        overflow-y: auto;
    }
    .acu-dice-quick-inline {
        display: flex;
        gap: 4px;
        margin-left: 0;
        margin-top: 4px;
        flex: 1 1 100%;
        align-content: flex-start;
        min-width: 0;
        max-width: 100%;
        max-height: 63px;
        overflow-x: hidden;
        overflow-y: auto;
        white-space: normal;
        align-items: flex-start;
        flex-wrap: wrap;
        -webkit-overflow-scrolling: touch;
    }
    .acu-dice-quick-inline::-webkit-scrollbar { width: 6px; }
    .acu-dice-quick-compact {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        margin-bottom: 8px;
        max-height: 63px;
        overflow-y: auto;
        align-content: flex-start;
    }
    .acu-dice-panel .acu-dice-char-btn,
    .acu-contest-panel .acu-dice-char-btn,
    .acu-dice-panel .acu-dice-attr-btn,
    .acu-contest-panel .acu-dice-attr-btn,
    .acu-dice-panel .acu-dice-gen-attr-btn,
    .acu-dice-panel .acu-dice-clear-attr-btn,
    .acu-contest-panel .acu-contest-attr-btn,
    .acu-contest-panel .acu-contest-gen-attr-btn,
    .acu-contest-panel .acu-contest-clear-attr-btn {
        padding: 1px 5px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-text-main);
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        flex-shrink: 0;
        line-height: 1.3;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
    }
    /* [修复] 覆盖酒馆全局触控优化样式 - 防止移动端按钮被强制放大 */
    /* 酒馆全局规则: @media (hover: none) and (pointer: coarse) { button { min-width: 44px; min-height: 44px; } } */
    /* 使用通配符一次性禁用所有骰子系统容器内的按钮，避免逐个添加 */
    @media (hover: none) and (pointer: coarse) {
        [class^="acu-"] button,
        [class*=" acu-"] button,
        [class^="acu-"] button[class],
        [class*=" acu-"] button[class],
        [id^="shujuku"] button {
            min-width: unset !important;
            min-height: unset !important;
        }
    }
    .acu-dice-panel .acu-dice-char-btn:hover,
    .acu-contest-panel .acu-dice-char-btn:hover,
    .acu-dice-panel .acu-dice-attr-btn:hover,
    .acu-contest-panel .acu-dice-attr-btn:hover,
    .acu-dice-panel .acu-dice-gen-attr-btn:hover,
    .acu-dice-panel .acu-dice-clear-attr-btn:hover,
    .acu-contest-panel .acu-contest-attr-btn:hover,
    .acu-contest-panel .acu-contest-gen-attr-btn:hover,
    .acu-contest-panel .acu-contest-clear-attr-btn:hover {
        background: var(--acu-btn-hover);
    }
    .acu-dice-panel .acu-dice-char-btn.active,
    .acu-contest-panel .acu-dice-char-btn.active,
    .acu-dice-panel .acu-dice-attr-btn.active,
    .acu-contest-panel .acu-dice-attr-btn.active {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
    }
    .acu-dice-roll-btn {
        width: 100%;
        padding: 12px;
        background: var(--acu-accent);
        border: none;
        border-radius: 8px;
        color: var(--acu-button-text, #fff);
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
    }
    .acu-dice-roll-btn:hover {
        filter: brightness(1.1);
    }
    .acu-random-skill-btn {
        width: 18px;
        height: 18px;
        padding: 0;
        background: transparent;
        border: 1px dashed var(--acu-accent);
        border-radius: 4px;
        color: var(--acu-accent);
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .acu-random-skill-btn:hover {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
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
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .acu-close-btn:hover {
        background: none;
        color: var(--acu-accent);
    }

    /* 滚动条全局隐藏 */
    [class^="acu-"], [class^="acu-"] * { scrollbar-width: none; -ms-overflow-style: none; }
    [class^="acu-"] *::-webkit-scrollbar { display: none !important; }

    /* ========== 主题变量定义 ========== */
    .acu-theme-retro { --acu-bg-nav: #e6e2d3; --acu-bg-panel: #e6e2d3; --acu-border: #dcd0c0; --acu-text-main: #5e4b35; --acu-text-sub: #999; --acu-btn-bg: #dcd0c0; --acu-btn-hover: #cbbba8; --acu-btn-active-bg: #8d7b6f; --acu-btn-active-text: #fdfaf5; --acu-accent: #7a695f; --acu-table-head: #efebe4; --acu-table-hover: #f0ebe0; --acu-opt-hover: #f7f3ed; --acu-opt-bg: #fffef9; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #fffef9; --acu-badge-bg: #efebe4; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #27ae60; --acu-success-bg: rgba(39, 174, 96, 0.15); --acu-scrollbar-track: #e6e2d3; --acu-scrollbar-thumb: #cbbba8; --acu-input-bg: #f5f2eb;--acu-hl-manual: #d35400; --acu-hl-manual-bg: rgba(211, 84, 0, 0.15); --acu-hl-diff: #2980b9; --acu-hl-diff-bg: rgba(41, 128, 185, 0.15); --acu-error-text: #e74c3c; --acu-error-bg: rgba(231, 76, 60, 0.15); --acu-error-border: rgba(231, 76, 60, 0.5); --acu-warning-icon: #e67e22; --acu-failure-text: #e74c3c; --acu-failure-bg: rgba(231, 76, 60, 0.15); --acu-warning-text: #f39c12; --acu-warning-bg: rgba(243, 156, 18, 0.15); --acu-crit-success-text: #9b59b6; --acu-crit-success-bg: rgba(155, 89, 182, 0.15); --acu-crit-failure-text: #c0392b; --acu-crit-failure-bg: rgba(192, 57, 43, 0.15); --acu-extreme-success-text: #2980b9; --acu-extreme-success-bg: rgba(41, 128, 185, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #5e4b35; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-dark { --acu-bg-nav: #2b2b2b; --acu-bg-panel: #252525; --acu-border: #444; --acu-text-main: #eee; --acu-text-sub: #aaa; --acu-btn-bg: #3a3a3a; --acu-btn-hover: #4a4a4a; --acu-btn-active-bg: #6a5acd; --acu-btn-active-text: #fff; --acu-accent: #9b8cd9; --acu-table-head: #333333; --acu-table-hover: #3a3a3a; --acu-opt-hover: rgba(255, 255, 255, 0.1); --acu-opt-bg: rgba(255, 255, 255, 0.05); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #2d3035; --acu-badge-bg: #3a3f4b; --acu-menu-bg: #333; --acu-menu-text: #eee; --acu-success-text: #4cd964; --acu-success-bg: rgba(76, 217, 100, 0.2); --acu-scrollbar-track: #2b2b2b; --acu-scrollbar-thumb: #555; --acu-hl-manual: #ff6b81; --acu-hl-manual-bg: rgba(255, 107, 129, 0.2); --acu-hl-diff: #00d2d3; --acu-hl-diff-bg: rgba(0, 210, 211, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-failure-text: #ff6b6b; --acu-failure-bg: rgba(255, 107, 107, 0.2); --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-crit-success-text: #ba68c8; --acu-crit-success-bg: rgba(186, 104, 200, 0.2); --acu-crit-failure-text: #d32f2f; --acu-crit-failure-bg: rgba(211, 47, 47, 0.2); --acu-extreme-success-text: #42a5f5; --acu-extreme-success-bg: rgba(66, 165, 245, 0.2); --acu-overlay-bg: rgba(0,0,0,0.75); --acu-overlay-bg-light: rgba(0,0,0,0.65); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,255,0.05); --acu-very-light-bg: rgba(255,255,255,0.02); --acu-button-text: #fff; --acu-gray-bg: rgba(255,255,255,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-modern { --acu-bg-nav: #ffffff; --acu-bg-panel: #f8f9fa; --acu-border: #e0e0e0; --acu-text-main: #333; --acu-text-sub: #666; --acu-btn-bg: #f1f3f5; --acu-btn-hover: #e9ecef; --acu-btn-active-bg: #007bff; --acu-btn-active-text: #fff; --acu-accent: #007bff; --acu-table-head: #f8f9fa; --acu-table-hover: #f1f3f5; --acu-opt-hover: #f1f3f5; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #f1f3f5; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #28a745; --acu-success-bg: rgba(40, 167, 69, 0.15); --acu-scrollbar-track: #fff; --acu-scrollbar-thumb: #ccc; --acu-hl-manual: #fd7e14; --acu-hl-manual-bg: rgba(253, 126, 20, 0.15); --acu-hl-diff: #0d6efd; --acu-hl-diff-bg: rgba(13, 110, 253, 0.15); --acu-error-text: #dc3545; --acu-error-bg: rgba(220, 53, 69, 0.15); --acu-error-border: rgba(220, 53, 69, 0.5); --acu-warning-icon: #fd7e14; --acu-failure-text: #dc3545; --acu-failure-bg: rgba(220, 53, 69, 0.15); --acu-warning-text: #ffc107; --acu-warning-bg: rgba(255, 193, 7, 0.15); --acu-crit-success-text: #6f42c1; --acu-crit-success-bg: rgba(111, 66, 193, 0.15); --acu-crit-failure-text: #c82333; --acu-crit-failure-bg: rgba(200, 35, 51, 0.15); --acu-extreme-success-text: #17a2b8; --acu-extreme-success-bg: rgba(23, 162, 184, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #333; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-forest { --acu-bg-nav: #e8f5e9; --acu-bg-panel: #e8f5e9; --acu-border: #c8e6c9; --acu-text-main: #2e7d32; --acu-text-sub: #81c784; --acu-btn-bg: #c8e6c9; --acu-btn-hover: #a5d6a7; --acu-btn-active-bg: #43a047; --acu-btn-active-text: #fff; --acu-accent: #4caf50; --acu-table-head: #dcedc8; --acu-table-hover: #f1f8e9; --acu-opt-hover: #f1f8e9; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #dcedc8; --acu-menu-bg: #fff; --acu-menu-text: #2e7d32; --acu-success-text: #2e7d32; --acu-success-bg: rgba(46, 125, 50, 0.2); --acu-scrollbar-track: #e8f5e9; --acu-scrollbar-thumb: #a5d6a7; --acu-hl-manual: #e67e22; --acu-hl-manual-bg: rgba(230, 126, 34, 0.15); --acu-hl-diff: #1e8449; --acu-hl-diff-bg: rgba(30, 132, 73, 0.2); --acu-button-text: #2e7d32; --acu-button-text-on-accent: #fff; }
    .acu-theme-ocean { --acu-bg-nav: #e3f2fd; --acu-bg-panel: #e3f2fd; --acu-border: #90caf9; --acu-text-main: #1565c0; --acu-text-sub: #64b5f6; --acu-btn-bg: #bbdefb; --acu-btn-hover: #90caf9; --acu-btn-active-bg: #1976d2; --acu-btn-active-text: #fff; --acu-accent: #2196f3; --acu-table-head: #bbdefb; --acu-table-hover: #e1f5fe; --acu-opt-hover: #e1f5fe; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #e3f2fd; --acu-menu-bg: #fff; --acu-menu-text: #1565c0; --acu-success-text: #0288d1; --acu-success-bg: rgba(2, 136, 209, 0.15); --acu-scrollbar-track: #e3f2fd; --acu-scrollbar-thumb: #90caf9; --acu-hl-manual: #ff4757; --acu-hl-manual-bg: rgba(255, 71, 87, 0.15); --acu-hl-diff: #0277bd; --acu-hl-diff-bg: rgba(2, 119, 189, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-failure-text: #d32f2f; --acu-failure-bg: rgba(211, 47, 47, 0.15); --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-crit-success-text: #7b1fa2; --acu-crit-success-bg: rgba(123, 31, 162, 0.15); --acu-crit-failure-text: #b71c1c; --acu-crit-failure-bg: rgba(183, 28, 28, 0.15); --acu-extreme-success-text: #0277bd; --acu-extreme-success-bg: rgba(2, 119, 189, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #1565c0; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-cyber { --acu-bg-nav: #000000; --acu-bg-panel: #0a0a0a; --acu-border: #333; --acu-text-main: #00ffcc; --acu-text-sub: #ff00ff; --acu-btn-bg: #111; --acu-btn-hover: #222; --acu-btn-active-bg: #ff00ff; --acu-btn-active-text: #000; --acu-accent: #00ffcc; --acu-table-head: #050505; --acu-table-hover: #111; --acu-opt-hover: rgba(0, 255, 204, 0.15); --acu-opt-bg: rgba(0, 255, 204, 0.08); --acu-shadow: 0 0 15px rgba(0,255,204,0.15); --acu-card-bg: #050505; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #111; --acu-menu-text: #00ffcc; --acu-success-text: #0f0; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #000; --acu-scrollbar-thumb: #333; --acu-hl-manual: #ff9f43; --acu-hl-manual-bg: rgba(255, 159, 67, 0.2); --acu-hl-diff: #0abde3; --acu-hl-diff-bg: rgba(10, 189, 227, 0.2); --acu-button-text-on-accent: #000; }
    .acu-theme-cyber .acu-nav-btn { border-color: #222; }
    .acu-theme-cyber .acu-data-card { border-color: #222; }
    .acu-theme-cyber .acu-dice-panel input::placeholder,
    .acu-theme-cyber .acu-contest-panel input::placeholder {
        color: #ff00ff !important;
        opacity: 0.7;
    }
    .acu-theme-cyber .acu-dice-panel input[type="text"],
    .acu-theme-cyber .acu-dice-panel input[type="number"],
    .acu-theme-cyber .acu-dice-panel input:not([type]),
    .acu-theme-cyber .acu-contest-panel input[type="text"],
    .acu-theme-cyber .acu-contest-panel input[type="number"],
    .acu-theme-cyber .acu-contest-panel input:not([type]) {
        color: #ff00ff !important;
    }
    .acu-theme-nightowl { --acu-bg-nav: #0a2133; --acu-bg-panel: #011627; --acu-border: #132e45; --acu-text-main: #e0e6f2; --acu-text-sub: #a6b8cc; --acu-btn-bg: #1f3a52; --acu-btn-hover: #2a4a68; --acu-btn-active-bg: #7fdbca; --acu-btn-active-text: #011627; --acu-accent: #7fdbca; --acu-table-head: #0a2133; --acu-table-hover: #01294a; --acu-opt-hover: rgba(127, 219, 202, 0.15); --acu-opt-bg: rgba(127, 219, 202, 0.08); --acu-shadow: rgba(0,0,0,0.5); --acu-card-bg: #0a2133; --acu-badge-bg: #1f3a52; --acu-menu-bg: #011627; --acu-menu-text: #e0e6f2; --acu-success-text: #addb67; --acu-success-bg: rgba(173, 219, 103, 0.15); --acu-scrollbar-track: #011627; --acu-scrollbar-thumb: #1f3a52; --acu-hl-manual: #ff8f66; --acu-hl-manual-bg: rgba(255, 143, 102, 0.2); --acu-hl-diff: #82aaff; --acu-hl-diff-bg: rgba(130, 170, 255, 0.2); --acu-button-text-on-accent: #011627; }
    .acu-theme-sakura { --acu-bg-nav: #F9F0EF; --acu-bg-panel: #F9F0EF; --acu-border: #EBDCD9; --acu-text-main: #6B5552; --acu-text-sub: #C08D8D; --acu-btn-bg: #EBDCD9; --acu-btn-hover: #D8C7C4; --acu-btn-active-bg: #C08D8D; --acu-btn-active-text: #F9F0EF; --acu-accent: #C08D8D; --acu-table-head: #F9F0EF; --acu-table-hover: #F5EAE8; --acu-opt-hover: #F5EAE8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #F9F0EF; --acu-menu-bg: #fff; --acu-menu-text: #6B5552; --acu-success-text: #6B5552; --acu-success-bg: rgba(192, 141, 141, 0.12); --acu-scrollbar-track: #F9F0EF; --acu-scrollbar-thumb: #EBDCD9; --acu-hl-manual: #A68A7A; --acu-hl-manual-bg: rgba(166, 138, 122, 0.12); --acu-hl-diff: #9B7A7A; --acu-hl-diff-bg: rgba(155, 122, 122, 0.2); --acu-error-text: #9B7A7A; --acu-error-bg: rgba(155, 122, 122, 0.12); --acu-error-border: rgba(155, 122, 122, 0.4); --acu-warning-icon: #A68A7A; --acu-failure-text: #9B7A7A; --acu-failure-bg: rgba(155, 122, 122, 0.12); --acu-warning-text: #A68A7A; --acu-warning-bg: rgba(166, 138, 122, 0.12); --acu-crit-success-text: #8B7A7A; --acu-crit-success-bg: rgba(139, 122, 122, 0.12); --acu-crit-failure-text: #8B6F6F; --acu-crit-failure-bg: rgba(139, 111, 111, 0.12); --acu-extreme-success-text: #9B8A8A; --acu-extreme-success-bg: rgba(155, 138, 138, 0.12); --acu-overlay-bg: rgba(107, 85, 82, 0.6); --acu-overlay-bg-light: rgba(107, 85, 82, 0.5); --acu-shadow-bg: rgba(107, 85, 82, 0.3); --acu-light-bg: rgba(192, 141, 141, 0.08); --acu-very-light-bg: rgba(192, 141, 141, 0.02); --acu-button-text: #6B5552; --acu-gray-bg: rgba(192, 141, 141, 0.08); --acu-button-text-on-accent: #F9F0EF; }
    .acu-theme-minepink { --acu-bg-nav: #1a1a1a; --acu-bg-panel: #1a1a1a; --acu-border: #333333; --acu-text-main: #ffb3d9; --acu-text-sub: #ff80c1; --acu-btn-bg: #2a2a2a; --acu-btn-hover: #3a3a3a; --acu-btn-active-bg: #ff80c1; --acu-btn-active-text: #1a1a1a; --acu-accent: #ff80c1; --acu-table-head: #252525; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 128, 193, 0.15); --acu-opt-bg: rgba(255, 128, 193, 0.08); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #222222; --acu-badge-bg: #2a2a2a; --acu-menu-bg: #1a1a1a; --acu-menu-text: #ffb3d9; --acu-success-text: #ff80c1; --acu-success-bg: rgba(255, 128, 193, 0.2); --acu-scrollbar-track: #1a1a1a; --acu-scrollbar-thumb: #333333; --acu-hl-manual: #ffa726; --acu-hl-manual-bg: rgba(255, 167, 38, 0.2); --acu-hl-diff: #ff80c1; --acu-hl-diff-bg: rgba(255, 128, 193, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-failure-text: #ff6b6b; --acu-failure-bg: rgba(255, 107, 107, 0.2); --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-crit-success-text: #ff80c1; --acu-crit-success-bg: rgba(255, 128, 193, 0.2); --acu-crit-failure-text: #ff4444; --acu-crit-failure-bg: rgba(255, 68, 68, 0.2); --acu-extreme-success-text: #ffb3d9; --acu-extreme-success-bg: rgba(255, 179, 217, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 128, 193, 0.1); --acu-very-light-bg: rgba(255, 128, 193, 0.02); --acu-button-text: #1a1a1a; --acu-gray-bg: rgba(255, 128, 193, 0.1); --acu-button-text-on-accent: #1a1a1a; }
    .acu-theme-purple { --acu-bg-nav: #f3e5f5; --acu-bg-panel: #f3e5f5; --acu-border: #ce93d8; --acu-text-main: #6a1b9a; --acu-text-sub: #9c27b0; --acu-btn-bg: #e1bee7; --acu-btn-hover: #ce93d8; --acu-btn-active-bg: #9c27b0; --acu-btn-active-text: #fff; --acu-accent: #9c27b0; --acu-table-head: #f8e1f5; --acu-table-hover: #fce4ec; --acu-opt-hover: #fce4ec; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #f8e1f5; --acu-menu-bg: #fff; --acu-menu-text: #6a1b9a; --acu-success-text: #6a1b9a; --acu-success-bg: rgba(106, 27, 154, 0.15); --acu-scrollbar-track: #f3e5f5; --acu-scrollbar-thumb: #ce93d8; --acu-hl-manual: #f57c00; --acu-hl-manual-bg: rgba(245, 124, 0, 0.15); --acu-hl-diff: #6a1b9a; --acu-hl-diff-bg: rgba(106, 27, 154, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-failure-text: #d32f2f; --acu-failure-bg: rgba(211, 47, 47, 0.15); --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-crit-success-text: #7b1fa2; --acu-crit-success-bg: rgba(123, 31, 162, 0.15); --acu-crit-failure-text: #b71c1c; --acu-crit-failure-bg: rgba(183, 28, 28, 0.15); --acu-extreme-success-text: #6a1b9a; --acu-extreme-success-bg: rgba(106, 27, 154, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(156, 39, 176, 0.1); --acu-very-light-bg: rgba(156, 39, 176, 0.02); --acu-button-text: #6a1b9a; --acu-gray-bg: rgba(156, 39, 176, 0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-wechat { --acu-bg-nav: #F7F7F7; --acu-bg-panel: #F7F7F7; --acu-border: #E5E5E5; --acu-text-main: #333333; --acu-text-sub: #666666; --acu-btn-bg: #E5E5E5; --acu-btn-hover: #D5D5D5; --acu-btn-active-bg: #09B83E; --acu-btn-active-text: #FFFFFF; --acu-accent: #09B83E; --acu-table-head: #F0F0F0; --acu-table-hover: #EBEBEB; --acu-opt-hover: #EBEBEB; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #F0F0F0; --acu-menu-bg: #fff; --acu-menu-text: #333333; --acu-success-text: #09B83E; --acu-success-bg: rgba(9, 184, 62, 0.12); --acu-scrollbar-track: #F7F7F7; --acu-scrollbar-thumb: #E5E5E5; --acu-hl-manual: #FF9500; --acu-hl-manual-bg: rgba(255, 149, 0, 0.12); --acu-hl-diff: #09B83E; --acu-hl-diff-bg: rgba(9, 184, 62, 0.2); --acu-error-text: #E53E3E; --acu-error-bg: rgba(229, 62, 62, 0.12); --acu-error-border: rgba(229, 62, 62, 0.5); --acu-warning-icon: #FF9500; --acu-failure-text: #E53E3E; --acu-failure-bg: rgba(229, 62, 62, 0.12); --acu-warning-text: #FF9500; --acu-warning-bg: rgba(255, 149, 0, 0.12); --acu-crit-success-text: #07A832; --acu-crit-success-bg: rgba(7, 168, 50, 0.15); --acu-crit-failure-text: #C53030; --acu-crit-failure-bg: rgba(197, 48, 48, 0.15); --acu-extreme-success-text: #09B83E; --acu-extreme-success-bg: rgba(9, 184, 62, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.2); --acu-light-bg: rgba(9, 184, 62, 0.08); --acu-very-light-bg: rgba(9, 184, 62, 0.02); --acu-button-text: #333333; --acu-gray-bg: rgba(9, 184, 62, 0.08); --acu-button-text-on-accent: #fff; }
    .acu-theme-educational { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #1B1B1B; --acu-text-main: #FFFFFF; --acu-text-sub: #CCCCCC; --acu-btn-bg: #1B1B1B; --acu-btn-hover: #2B2B2B; --acu-btn-active-bg: #FF9900; --acu-btn-active-text: #000000; --acu-accent: #FF9900; --acu-table-head: #1B1B1B; --acu-table-hover: #2B2B2B; --acu-opt-hover: rgba(255, 153, 0, 0.18); --acu-opt-bg: rgba(255, 153, 0, 0.1); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #1B1B1B; --acu-badge-bg: #1B1B1B; --acu-menu-bg: #000000; --acu-menu-text: #FFFFFF; --acu-success-text: #FF9900; --acu-success-bg: rgba(255, 153, 0, 0.15); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #1B1B1B; --acu-input-bg: #1B1B1B; --acu-hl-manual: #FF9900; --acu-hl-manual-bg: rgba(255, 153, 0, 0.15); --acu-hl-diff: #FFB84D; --acu-hl-diff-bg: rgba(255, 184, 77, 0.2); --acu-error-text: #FF6B6B; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #FFAA00; --acu-failure-text: #FF6B6B; --acu-failure-bg: rgba(255, 107, 107, 0.2); --acu-warning-text: #FFAA00; --acu-warning-bg: rgba(255, 170, 0, 0.2); --acu-crit-success-text: #FF9900; --acu-crit-success-bg: rgba(255, 153, 0, 0.2); --acu-crit-failure-text: #FF4444; --acu-crit-failure-bg: rgba(255, 68, 68, 0.2); --acu-extreme-success-text: #FFB84D; --acu-extreme-success-bg: rgba(255, 184, 77, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 153, 0, 0.1); --acu-very-light-bg: rgba(255, 153, 0, 0.02); --acu-button-text: #FFFFFF; --acu-gray-bg: rgba(255, 255, 255, 0.1); --acu-button-text-on-accent: #000; }
    .acu-theme-vaporwave { --acu-bg-nav: #191970; --acu-bg-panel: #191970; --acu-border: rgba(0, 255, 255, 0.3); --acu-text-main: #00FFFF; --acu-text-sub: #FF00FF; --acu-btn-bg: rgba(25, 25, 112, 0.8); --acu-btn-hover: rgba(0, 255, 255, 0.2); --acu-btn-active-bg: #FF00FF; --acu-btn-active-text: #191970; --acu-accent: #00FFFF; --acu-table-head: rgba(25, 25, 112, 0.9); --acu-table-hover: rgba(0, 255, 255, 0.1); --acu-opt-hover: rgba(0, 255, 255, 0.18); --acu-opt-bg: rgba(0, 255, 255, 0.1); --acu-shadow: 0 0 15px rgba(0, 255, 255, 0.3); --acu-card-bg: rgba(25, 25, 112, 0.95); --acu-badge-bg: rgba(25, 25, 112, 0.8); --acu-menu-bg: #191970; --acu-menu-text: #00FFFF; --acu-success-text: #00FFFF; --acu-success-bg: rgba(0, 255, 255, 0.15); --acu-scrollbar-track: #191970; --acu-scrollbar-thumb: rgba(0, 255, 255, 0.3); --acu-input-bg: rgba(25, 25, 112, 0.6); --acu-hl-manual: #00FFFF; --acu-hl-manual-bg: rgba(0, 255, 255, 0.2); --acu-hl-diff: #FF00FF; --acu-hl-diff-bg: rgba(255, 0, 255, 0.2); --acu-error-text: #FF00FF; --acu-error-bg: rgba(255, 0, 255, 0.2); --acu-error-border: rgba(255, 0, 255, 0.5); --acu-warning-icon: #FF00FF; --acu-failure-text: #FF00FF; --acu-failure-bg: rgba(255, 0, 255, 0.2); --acu-warning-text: #FF00FF; --acu-warning-bg: rgba(255, 0, 255, 0.15); --acu-crit-success-text: #00FFFF; --acu-crit-success-bg: rgba(0, 255, 255, 0.2); --acu-crit-failure-text: #FF00FF; --acu-crit-failure-bg: rgba(255, 0, 255, 0.25); --acu-extreme-success-text: #00FFFF; --acu-extreme-success-bg: rgba(0, 255, 255, 0.2); --acu-overlay-bg: rgba(25, 25, 112, 0.85); --acu-overlay-bg-light: rgba(25, 25, 112, 0.75); --acu-shadow-bg: rgba(0, 255, 255, 0.3); --acu-light-bg: rgba(0, 255, 255, 0.05); --acu-very-light-bg: rgba(0, 255, 255, 0.02); --acu-button-text: #F0F8FF; --acu-gray-bg: rgba(0, 255, 255, 0.1); --acu-button-text-on-accent: #191970; }
    .acu-theme-vaporwave .acu-nav-btn { border-color: rgba(0, 255, 255, 0.3); }
    .acu-theme-vaporwave .acu-data-card { border-color: rgba(0, 255, 255, 0.3); }
    .acu-theme-vaporwave .acu-dice-panel input::placeholder,
    .acu-theme-vaporwave .acu-contest-panel input::placeholder {
        color: #FF00FF !important;
        opacity: 0.7;
    }
    .acu-theme-vaporwave .acu-dice-panel input[type="text"],
    .acu-theme-vaporwave .acu-dice-panel input[type="number"],
    .acu-theme-vaporwave .acu-dice-panel input:not([type]),
    .acu-theme-vaporwave .acu-contest-panel input[type="text"],
    .acu-theme-vaporwave .acu-contest-panel input[type="number"],
    .acu-theme-vaporwave .acu-contest-panel input:not([type]) {
        color: #00FFFF !important;
    }
    .acu-theme-classicpackaging { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #FFFF00; --acu-text-main: #FFFF00; --acu-text-sub: #CCCC00; --acu-btn-bg: #FF0000; --acu-btn-hover: #CC0000; --acu-btn-active-bg: #0000FF; --acu-btn-active-text: #FFFF00; --acu-accent: #FF0000; --acu-table-head: #1a1a1a; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 255, 0, 0.15); --acu-opt-bg: rgba(255, 255, 0, 0.08); --acu-shadow: rgba(255,255,0,0.3); --acu-card-bg: #1a1a1a; --acu-badge-bg: #FF0000; --acu-menu-bg: #000000; --acu-menu-text: #FFFF00; --acu-success-text: #0000FF; --acu-success-bg: rgba(0, 0, 255, 0.2); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #FFFF00; --acu-input-bg: #1a1a1a; --acu-hl-manual: #FF0000; --acu-hl-manual-bg: rgba(255, 0, 0, 0.2); --acu-hl-diff: #0000FF; --acu-hl-diff-bg: rgba(0, 0, 255, 0.2); --acu-error-text: #FF0000; --acu-error-bg: rgba(255, 0, 0, 0.2); --acu-error-border: rgba(255, 0, 0, 0.8); --acu-warning-icon: #FF0000; --acu-failure-text: #FF0000; --acu-failure-bg: rgba(255, 0, 0, 0.2); --acu-warning-text: #FF0000; --acu-warning-bg: rgba(255, 0, 0, 0.15); --acu-crit-success-text: #0000FF; --acu-crit-success-bg: rgba(0, 0, 255, 0.2); --acu-crit-failure-text: #FF0000; --acu-crit-failure-bg: rgba(255, 0, 0, 0.25); --acu-extreme-success-text: #0000FF; --acu-extreme-success-bg: rgba(0, 0, 255, 0.2); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,0,0.1); --acu-very-light-bg: rgba(255,255,0,0.02); --acu-button-text: #FFFF00; --acu-gray-bg: rgba(255,255,0,0.1); --acu-button-text-on-accent: #FFFF00; }
    .acu-theme-classicpackaging .acu-nav-btn { border-color: #FFFF00; border-width: 2px; font-weight: bold; }
    .acu-theme-classicpackaging .acu-data-card { border-color: #FFFF00; border-width: 2px; }
    .acu-theme-classicpackaging .acu-dice-panel input::placeholder,
    .acu-theme-classicpackaging .acu-contest-panel input::placeholder {
        color: #666600 !important;
        opacity: 0.7;
    }
    .acu-theme-classicpackaging .acu-dice-panel input[type="text"],
    .acu-theme-classicpackaging .acu-dice-panel input[type="number"],
    .acu-theme-classicpackaging .acu-dice-panel input:not([type]),
    .acu-theme-classicpackaging .acu-contest-panel input[type="text"],
    .acu-theme-classicpackaging .acu-contest-panel input[type="number"],
    .acu-theme-classicpackaging .acu-contest-panel input:not([type]) {
        color: #FFFF00 !important;
        font-weight: bold;
    }
    .acu-theme-galgame { --acu-bg-nav: #FFF0F5; --acu-bg-panel: #FFF0F5; --acu-border: #F0D4E4; --acu-text-main: #6B4A5A; --acu-text-sub: #B08A9A; --acu-btn-bg: #FFE4E9; --acu-btn-hover: #FFD4E4; --acu-btn-active-bg: #E8B4D9; --acu-btn-active-text: #6B4A5A; --acu-accent: #E8B4D9; --acu-table-head: #FFF5F9; --acu-table-hover: #FFF0F8; --acu-opt-hover: #FFF0F8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(232, 180, 217, 0.25); --acu-card-bg: #ffffff; --acu-badge-bg: #FFF5F9; --acu-menu-bg: #fff; --acu-menu-text: #6B4A5A; --acu-success-text: #D4A5C8; --acu-success-bg: rgba(212, 165, 200, 0.15); --acu-scrollbar-track: #FFF0F5; --acu-scrollbar-thumb: #F0D4E4; --acu-input-bg: #FFF8FA; --acu-hl-manual: #D4A5A5; --acu-hl-manual-bg: rgba(212, 165, 165, 0.15); --acu-hl-diff: #E8B4D9; --acu-hl-diff-bg: rgba(232, 180, 217, 0.2); --acu-error-text: #C88A9A; --acu-error-bg: rgba(200, 138, 154, 0.15); --acu-error-border: rgba(200, 138, 154, 0.4); --acu-warning-icon: #D4A5A5; --acu-failure-text: #C88A9A; --acu-failure-bg: rgba(200, 138, 154, 0.15); --acu-warning-text: #D4A5A5; --acu-warning-bg: rgba(212, 165, 165, 0.15); --acu-crit-success-text: #E8B4D9; --acu-crit-success-bg: rgba(232, 180, 217, 0.2); --acu-crit-failure-text: #C88A9A; --acu-crit-failure-bg: rgba(200, 138, 154, 0.2); --acu-extreme-success-text: #D4A5C8; --acu-extreme-success-bg: rgba(212, 165, 200, 0.2); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(232, 180, 217, 0.25); --acu-light-bg: rgba(232, 180, 217, 0.08); --acu-very-light-bg: rgba(232, 180, 217, 0.02); --acu-button-text: #6B4A5A; --acu-button-text-on-accent: #6B4A5A; --acu-gray-bg: rgba(232, 180, 217, 0.1); }
    .acu-theme-galgame .acu-nav-btn { border-radius: 8px; transition: all 0.3s ease; }
    .acu-theme-galgame .acu-data-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(232, 180, 217, 0.15); transition: all 0.3s ease; }
    .acu-theme-galgame .acu-data-card:hover { box-shadow: 0 6px 20px rgba(232, 180, 217, 0.25); transform: translateY(-2px); }
    .acu-theme-galgame .acu-nav-btn:hover { box-shadow: 0 2px 8px rgba(232, 180, 217, 0.2); }
    .acu-theme-terminal { --acu-bg-nav: #0c0c0c; --acu-bg-panel: #0c0c0c; --acu-border: #00ff00; --acu-text-main: #00ff00; --acu-text-sub: #00cc00; --acu-btn-bg: #1a1a1a; --acu-btn-hover: #2a2a2a; --acu-btn-active-bg: #00ff00; --acu-btn-active-text: #0c0c0c; --acu-accent: #00ff00; --acu-table-head: #0a0a0a; --acu-table-hover: #1a1a1a; --acu-opt-hover: rgba(0, 255, 0, 0.12); --acu-opt-bg: rgba(0, 255, 0, 0.06); --acu-shadow: rgba(0,255,0,0.2); --acu-card-bg: #0c0c0c; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #0c0c0c; --acu-menu-text: #00ff00; --acu-success-text: #00ff00; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #0c0c0c; --acu-scrollbar-thumb: #00ff00; --acu-input-bg: #0c0c0c; --acu-hl-manual: #ffff00; --acu-hl-manual-bg: rgba(255, 255, 0, 0.15); --acu-hl-diff: #00ffff; --acu-hl-diff-bg: rgba(0, 255, 255, 0.15); --acu-error-text: #ff0000; --acu-error-bg: rgba(255, 0, 0, 0.15); --acu-error-border: rgba(255, 0, 0, 0.5); --acu-warning-icon: #ffff00; --acu-failure-text: #ff0000; --acu-failure-bg: rgba(255, 0, 0, 0.15); --acu-warning-text: #ffff00; --acu-warning-bg: rgba(255, 255, 0, 0.15); --acu-crit-success-text: #00ffff; --acu-crit-success-bg: rgba(0, 255, 255, 0.15); --acu-crit-failure-text: #ff00ff; --acu-crit-failure-bg: rgba(255, 0, 255, 0.15); --acu-extreme-success-text: #00ff00; --acu-extreme-success-bg: rgba(0, 255, 0, 0.2); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.7); --acu-light-bg: rgba(0,255,0,0.05); --acu-very-light-bg: rgba(0,255,0,0.02); --acu-button-text: #0c0c0c; --acu-gray-bg: rgba(0,255,0,0.05); --acu-button-text-on-accent: #0c0c0c; font-family: 'Courier New', 'Consolas', 'Monaco', monospace; }
    .acu-theme-terminal .acu-nav-btn { border-color: #00ff00; text-shadow: 0 0 5px rgba(0,255,0,0.5); }
    .acu-theme-terminal .acu-data-card { border-color: #00ff00; text-shadow: 0 0 2px rgba(0,255,0,0.3); }
    .acu-theme-terminal .acu-dice-panel input::placeholder,
    .acu-theme-terminal .acu-contest-panel input::placeholder {
        color: #008800 !important;
        opacity: 0.7;
    }
    .acu-theme-terminal .acu-dice-panel input[type="text"],
    .acu-theme-terminal .acu-dice-panel input[type="number"],
    .acu-theme-terminal .acu-dice-panel input:not([type]),
    .acu-theme-terminal .acu-contest-panel input[type="text"],
    .acu-theme-terminal .acu-contest-panel input[type="number"],
    .acu-theme-terminal .acu-contest-panel input:not([type]) {
        color: #00ff00 !important;
    }
    .acu-theme-dreamcore { --acu-bg-nav: #F4F1EA; --acu-bg-panel: #F4F1EA; --acu-border: #D6D2C4; --acu-text-main: #5C5869; --acu-text-sub: #9490A0; --acu-btn-bg: #E6E1D5; --acu-btn-hover: #DBD8CC; --acu-btn-active-bg: #8A9AC6; --acu-btn-active-text: #FFFFFF; --acu-accent: #8A9AC6; --acu-table-head: #EBE7DE; --acu-table-hover: #F8F6F0; --acu-opt-hover: #F8F6F0; --acu-opt-bg: #FFFFFF; --acu-shadow: rgba(92, 88, 105, 0.15); --acu-card-bg: #FFFFFF; --acu-badge-bg: #EBE7DE; --acu-menu-bg: #FCFAF5; --acu-menu-text: #5C5869; --acu-success-text: #4A7A68; --acu-success-bg: rgba(74, 122, 104, 0.18); --acu-scrollbar-track: #F4F1EA; --acu-scrollbar-thumb: #D6D2C4; --acu-input-bg: #FFFFFF; --acu-hl-manual: #8A7040; --acu-hl-manual-bg: rgba(138, 112, 64, 0.18); --acu-hl-diff: #8A9AC6; --acu-hl-diff-bg: rgba(138, 154, 198, 0.18); --acu-error-text: #B85C5C; --acu-error-bg: rgba(184, 92, 92, 0.15); --acu-error-border: rgba(184, 92, 92, 0.4); --acu-warning-icon: #E0C080; --acu-failure-text: #8F5E5E; --acu-failure-bg: rgba(143, 94, 94, 0.18); --acu-warning-text: #8A7040; --acu-warning-bg: rgba(138, 112, 64, 0.18); --acu-crit-success-text: #2D6E58; --acu-crit-success-bg: rgba(45, 110, 88, 0.25); --acu-crit-failure-text: #7A3E3E; --acu-crit-failure-bg: rgba(122, 62, 62, 0.25); --acu-extreme-success-text: #5C5228; --acu-extreme-success-bg: rgba(92, 82, 40, 0.2); --acu-overlay-bg: rgba(244, 241, 234, 0.85); --acu-overlay-bg-light: rgba(255, 255, 255, 0.4); --acu-shadow-bg: rgba(92, 88, 105, 0.15); --acu-light-bg: rgba(138, 154, 198, 0.08); --acu-very-light-bg: rgba(138, 154, 198, 0.03); --acu-button-text: #5C5869; --acu-gray-bg: rgba(92, 88, 105, 0.08); --acu-button-text-on-accent: #fff; }
    .acu-theme-dreamcore .acu-nav-btn { border-color: #D6D2C4; }
    /* 极光幻境 (Aurora) 主题：深邃星空与极光渐变 */
    .acu-theme-aurora {
        --acu-bg-nav: linear-gradient(135deg, #0f172a, #1e293b);
        --acu-bg-panel: linear-gradient(180deg, #0f172a 0%, #334155 100%);
        --acu-border: #38bdf8;
        --acu-text-main: #e2e8f0;
        --acu-text-sub: #94a3b8;
        --acu-btn-bg: linear-gradient(135deg, #162a3d, #25224d);
        --acu-btn-hover: linear-gradient(135deg, #1e3a5f, #312e81);
        --acu-btn-active-bg: linear-gradient(135deg, #38bdf8, #a855f7);
        --acu-btn-active-text: #fff;
        --acu-accent: #38bdf8;
        --acu-table-head: linear-gradient(90deg, #0f172a, #1e293b);
        --acu-table-hover: rgba(56, 189, 248, 0.08);
        --acu-opt-hover: rgba(56, 189, 248, 0.15);
        --acu-opt-bg: rgba(56, 189, 248, 0.08);
        --acu-shadow: 0 8px 32px rgba(56, 189, 248, 0.15), 0 4px 16px rgba(168, 85, 247, 0.1);
        --acu-card-bg: linear-gradient(145deg, #1e293b, #0f172a);
        --acu-badge-bg: rgba(56, 189, 248, 0.2);
        --acu-menu-bg: #1e293b;
        --acu-menu-text: #e2e8f0;
        --acu-success-text: #4ade80;
        --acu-success-bg: rgba(74, 222, 128, 0.15);
        --acu-scrollbar-track: #0f172a;
        --acu-scrollbar-thumb: #38bdf8;
        --acu-input-bg: #0f172a;
        --acu-hl-manual: #f97316;
        --acu-hl-manual-bg: rgba(249, 115, 22, 0.2);
        --acu-hl-diff: #38bdf8;
        --acu-hl-diff-bg: rgba(56, 189, 248, 0.2);
        --acu-error-text: #f87171;
        --acu-error-bg: rgba(248, 113, 113, 0.2);
        --acu-error-border: rgba(248, 113, 113, 0.5);
        --acu-warning-icon: #fbbf24;
        --acu-failure-text: #f87171;
        --acu-failure-bg: rgba(248, 113, 113, 0.2);
        --acu-warning-text: #fbbf24;
        --acu-warning-bg: rgba(251, 191, 36, 0.2);
        --acu-crit-success-text: #a855f7;
        --acu-crit-success-bg: rgba(168, 85, 247, 0.2);
        --acu-crit-failure-text: #ef4444;
        --acu-crit-failure-bg: rgba(239, 68, 68, 0.25);
        --acu-extreme-success-text: #22d3ee;
        --acu-extreme-success-bg: rgba(34, 211, 238, 0.2);
        --acu-overlay-bg: rgba(15, 23, 42, 0.98);
        --acu-overlay-bg-light: rgba(30, 41, 59, 0.95);
        --acu-shadow-bg: rgba(56, 189, 248, 0.2);
        --acu-light-bg: rgba(56, 189, 248, 0.08);
        --acu-very-light-bg: rgba(56, 189, 248, 0.03);
        --acu-button-text: #e2e8f0;
        --acu-gray-bg: rgba(148, 163, 184, 0.1);
        --acu-button-text-on-accent: #fff;
    }
    .acu-theme-aurora .acu-nav-btn { border-color: rgba(56, 189, 248, 0.3); }
    .acu-theme-aurora .acu-data-card { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 4px 20px rgba(56, 189, 248, 0.1), 0 2px 10px rgba(168, 85, 247, 0.08); }
    .acu-theme-aurora .acu-dice-panel input::placeholder,
    .acu-theme-aurora .acu-contest-panel input::placeholder {
        color: #94a3b8 !important;
        opacity: 0.7;
    }
    .acu-theme-aurora .acu-dice-panel input[type="text"],
    .acu-theme-aurora .acu-dice-panel input[type="number"],
    .acu-theme-aurora .acu-dice-panel input:not([type]),
    .acu-theme-aurora .acu-contest-panel input[type="text"],
    .acu-theme-aurora .acu-contest-panel input[type="number"],
    .acu-theme-aurora .acu-contest-panel input:not([type]) {
        color: #e2e8f0 !important;
    }
    /* 极光幻境：导航栏 - 极光渐变光效 */
    .acu-theme-aurora .acu-nav-container {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%) !important;
        border: 1px solid #38bdf8 !important;
        box-shadow: 0 0 30px rgba(56, 189, 248, 0.1), 0 0 60px rgba(168, 85, 247, 0.05), inset 0 0 20px rgba(56, 189, 248, 0.05) !important;
        overflow: visible !important;
    }
    /* 极光顶部渐变光条 */
    .acu-theme-aurora .acu-nav-container::before {
        content: '';
        position: absolute;
        top: -1px; left: -1px; right: -1px; bottom: -1px;
        background: linear-gradient(90deg, #38bdf8, #a855f7, #22d3ee, #38bdf8);
        background-size: 300% 100%;
        z-index: -1;
        border-radius: 14px;
        animation: aurora-glow 6s ease-in-out infinite;
        opacity: 0.6;
    }
    @keyframes aurora-glow {
        0% { background-position: 0% 50%; opacity: 0.4; }
        50% { background-position: 100% 50%; opacity: 0.7; }
        100% { background-position: 0% 50%; opacity: 0.4; }
    }
    /* 极光幻境：按钮样式 */
    .acu-theme-aurora .acu-nav-btn {
        border: 1px solid rgba(56, 189, 248, 0.2) !important;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1)) !important;
        border-radius: 8px;
        color: #e2e8f0;
        transition: all 0.3s ease;
    }
    .acu-theme-aurora .acu-nav-btn:hover {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2)) !important;
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 4px 15px rgba(56, 189, 248, 0.2);
        transform: translateY(-2px);
    }
    .acu-theme-aurora .acu-nav-btn.active {
        background: linear-gradient(135deg, #38bdf8, #a855f7) !important;
        border-color: transparent !important;
        color: #ffffff !important;
        box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4), 0 2px 10px rgba(168, 85, 247, 0.3);
        font-weight: bold;
    }
    /* 极光幻境：数据卡片 */
    .acu-theme-aurora .acu-data-card:hover {
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 8px 30px rgba(56, 189, 248, 0.15), 0 4px 15px rgba(168, 85, 247, 0.1);
        transform: translateY(-3px);
    }
    .acu-theme-dreamcore .acu-data-card { border-color: #D6D2C4; box-shadow: 0 2px 8px rgba(92, 88, 105, 0.1); }
    .acu-theme-dreamcore .acu-dice-panel input::placeholder,
    .acu-theme-dreamcore .acu-contest-panel input::placeholder {
        color: #B0ACC0 !important;
        opacity: 0.9;
    }
    .acu-theme-dreamcore .acu-dice-panel input[type="text"],
    .acu-theme-dreamcore .acu-dice-panel input[type="number"],
    .acu-theme-dreamcore .acu-dice-panel input:not([type]),
    .acu-theme-dreamcore .acu-contest-panel input[type="text"],
    .acu-theme-dreamcore .acu-contest-panel input[type="number"],
    .acu-theme-dreamcore .acu-contest-panel input:not([type]) {
        color: #4A4652 !important;
    }
    /* 超天酱 (Choutenちゃん) 主题：電脳カワイイ・オーバードライブ */
    .acu-theme-chouten {
        --acu-bg-nav: linear-gradient(135deg, rgba(26, 10, 46, 0.95) 0%, rgba(45, 27, 78, 0.95) 50%, rgba(26, 10, 46, 0.95) 100%);
        --acu-bg-panel: rgba(26, 10, 46, 0.95);
        --acu-border: #FF7EB6;
        --acu-text-main: #FFFFFF;
        --acu-text-sub: #D0BFFF;
        --acu-btn-bg: rgba(255, 255, 255, 0.1);
        --acu-btn-hover: rgba(255, 107, 157, 0.3);
        --acu-btn-active-bg: linear-gradient(90deg, #FF6B9D, #B388FF);
        --acu-btn-active-text: #FFFFFF;
        --acu-accent: #7FFFD4;
        --acu-table-head: rgba(255, 107, 157, 0.15);
        --acu-table-hover: linear-gradient(90deg, rgba(255, 107, 157, 0.2), rgba(127, 255, 212, 0.2));
        --acu-opt-hover: linear-gradient(90deg, rgba(255, 107, 157, 0.15), rgba(127, 255, 212, 0.15)); --acu-opt-bg: transparent;
        --acu-shadow: rgba(255, 107, 157, 0.5);
        --acu-card-bg: rgba(20, 10, 35, 0.7);
        --acu-badge-bg: rgba(127, 255, 212, 0.2);
        --acu-menu-bg: #2D1B4E;
        --acu-menu-text: #FFE4F0;
        --acu-success-text: #7FFFD4;
        --acu-success-bg: rgba(127, 255, 212, 0.15);
        --acu-scrollbar-track: #1A0A2E;
        --acu-scrollbar-thumb: #FF6B9D;
        --acu-input-bg: rgba(0, 0, 0, 0.3);
        --acu-hl-manual: #FFD93D;
        --acu-hl-manual-bg: rgba(255, 217, 61, 0.2);
        --acu-hl-diff: #7FFFD4;
        --acu-hl-diff-bg: rgba(127, 255, 212, 0.2);
        --acu-error-text: #FF6B6B;
        --acu-error-bg: rgba(255, 107, 107, 0.2);
        --acu-error-border: #FF6B6B;
        --acu-warning-icon: #FFD93D;
        --acu-failure-text: #FF6B6B;
        --acu-failure-bg: rgba(255, 107, 107, 0.2);
        --acu-warning-text: #FFD93D;
        --acu-warning-bg: rgba(255, 217, 61, 0.2);
        --acu-crit-success-text: #00FFAB;
        --acu-crit-success-bg: rgba(0, 255, 171, 0.25);
        --acu-crit-failure-text: #FF4757;
        --acu-crit-failure-bg: rgba(255, 71, 87, 0.25);
        --acu-extreme-success-text: #00D9FF;
        --acu-extreme-success-bg: rgba(0, 217, 255, 0.2);
        --acu-overlay-bg: rgba(26, 10, 46, 0.95);
        --acu-overlay-bg-light: rgba(45, 27, 78, 0.85);
        --acu-shadow-bg: rgba(255, 107, 157, 0.3);
        --acu-light-bg: rgba(255, 107, 157, 0.1);
        --acu-very-light-bg: rgba(179, 136, 255, 0.05);
        --acu-button-text: #FFFFFF;
        --acu-button-text-on-accent: #1A0A2E;
        --acu-gray-bg: rgba(255, 255, 255, 0.05);
    }

    .acu-theme-retro { --acu-opt-bright-bg: #fffef9; }
    .acu-theme-modern,
    .acu-theme-forest,
    .acu-theme-ocean,
    .acu-theme-sakura,
    .acu-theme-purple,
    .acu-theme-wechat,
    .acu-theme-galgame,
    .acu-theme-dreamcore { --acu-opt-bright-bg: #ffffff; }
    .acu-theme-dark { --acu-opt-bright-bg: rgba(255, 255, 255, 0.05); }
    .acu-theme-cyber { --acu-opt-bright-bg: rgba(0, 255, 204, 0.08); }
    .acu-theme-nightowl { --acu-opt-bright-bg: rgba(127, 219, 202, 0.08); }
    .acu-theme-minepink { --acu-opt-bright-bg: rgba(255, 128, 193, 0.08); }
    .acu-theme-educational { --acu-opt-bright-bg: rgba(255, 153, 0, 0.1); }
    .acu-theme-vaporwave { --acu-opt-bright-bg: rgba(0, 255, 255, 0.1); }
    .acu-theme-aurora { --acu-opt-bright-bg: rgba(56, 189, 248, 0.1); }
    .acu-theme-classicpackaging { --acu-opt-bright-bg: rgba(255, 255, 0, 0.08); }
    .acu-theme-terminal { --acu-opt-bright-bg: rgba(0, 255, 0, 0.06); }
    .acu-theme-chouten { --acu-opt-bright-bg: transparent; }

    /* 超天酱：导航栏 - 偶像舞台光效 */
    .acu-theme-chouten .acu-nav-container {
        background: linear-gradient(180deg, rgba(45, 27, 78, 0.95) 0%, rgba(26, 10, 46, 0.98) 100%) !important;
        border: 1px solid rgba(255, 107, 157, 0.5) !important;
        box-shadow: 0 0 20px rgba(179, 136, 255, 0.2), inset 0 0 30px rgba(255, 107, 157, 0.1) !important;
        backdrop-filter: blur(10px);
        overflow: visible !important;
    }
    /* 顶部彩虹光条 */
    .acu-theme-chouten .acu-nav-container::before {
        content: '';
        position: absolute;
        top: -2px; left: -2px; right: -2px; bottom: -2px;
        background: linear-gradient(90deg, #FF6B9D, #B388FF, #7FFFD4, #FF6B9D);
        background-size: 300% 100%;
        z-index: -1;
        border-radius: 12px;
        animation: chouten-rainbow-border 4s linear infinite;
        opacity: 0.8;
    }
    @keyframes chouten-rainbow-border {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* 超天酱：按钮 - 糖果霓虹 */
    .acu-theme-chouten .acu-nav-btn {
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-radius: 8px;
        color: #FFE4F0;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }
    .acu-theme-chouten .acu-nav-btn:hover {
        background: rgba(255, 107, 157, 0.2) !important;
        border-color: #FF6B9D !important;
        text-shadow: 0 0 8px #FF6B9D;
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
    }
    .acu-theme-chouten .acu-nav-btn.active {
        background: linear-gradient(135deg, #FF6B9D 0%, #B388FF 100%) !important;
        border-color: #FFFFFF !important;
        color: #FFFFFF !important;
        box-shadow: 0 0 20px rgba(255, 107, 157, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3);
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    /* 按钮激活时的闪烁粒子效果 (模拟) */
    .acu-theme-chouten .acu-nav-btn.active::after {
        content: '✦';
        position: absolute;
        top: 2px;
        right: 4px;
        font-size: 10px;
        color: #7FFFD4;
        animation: chouten-sparkle 1.5s infinite;
    }

    /* 超天酱：数据卡片 - 赛博光晕 */
    .acu-theme-chouten .acu-data-card {
        border: 1px solid rgba(179, 136, 255, 0.3) !important;
        background: linear-gradient(160deg, rgba(30, 15, 50, 0.85) 0%, rgba(20, 8, 40, 0.9) 100%) !important;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(179, 136, 255, 0.05);
        position: relative;
    }
    .acu-theme-chouten .acu-data-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, #7FFFD4, transparent);
        opacity: 0.5;
    }
    .acu-theme-chouten .acu-data-card:hover {
        border-color: #7FFFD4 !important;
        box-shadow: 0 8px 30px rgba(127, 255, 212, 0.15), 0 0 15px rgba(127, 255, 212, 0.1);
        transform: translateY(-2px);
    }

    /* 超天酱：输入框 - 浮空全息 */
    .acu-theme-chouten .acu-dice-panel input::placeholder,
    .acu-theme-chouten .acu-contest-panel input::placeholder {
        color: rgba(179, 136, 255, 0.6) !important;
    }
    .acu-theme-chouten .acu-dice-panel input,
    .acu-theme-chouten .acu-contest-panel input {
        background: rgba(0, 0, 0, 0.4) !important;
        border: 1px solid rgba(255, 107, 157, 0.3) !important;
        border-radius: 4px;
        color: #7FFFD4 !important;
        transition: all 0.3s ease;
    }
    .acu-theme-chouten .acu-dice-panel input:focus,
    .acu-theme-chouten .acu-contest-panel input:focus {
        border-color: #7FFFD4 !important;
        box-shadow: 0 0 10px rgba(127, 255, 212, 0.4), inset 0 0 10px rgba(127, 255, 212, 0.1) !important;
        background: rgba(0, 0, 0, 0.6) !important;
    }

    /* 超天酱：滚动条 */
    .acu-theme-chouten ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FF6B9D, #B388FF) !important;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .acu-theme-chouten ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    /* 超天酱：表格行 - 悬停高亮 */
    .acu-theme-chouten .acu-card-row {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .acu-theme-chouten .acu-card-row:hover {
        background: linear-gradient(90deg, rgba(255, 107, 157, 0.2), rgba(179, 136, 255, 0.1)) !important;
        box-shadow: inset 2px 0 0 #FF6B9D;
    }

    /* 超天酱：徽章闪烁动画 */
    .acu-theme-chouten .acu-badge-green {
        background: rgba(127, 255, 212, 0.15) !important;
        color: #7FFFD4 !important;
        border: 1px solid rgba(127, 255, 212, 0.4);
        box-shadow: 0 0 10px rgba(127, 255, 212, 0.2);
        animation: chouten-badge-pulse 2s infinite;
    }
    @keyframes chouten-badge-pulse {
        0%, 100% { box-shadow: 0 0 5px rgba(127, 255, 212, 0.2); opacity: 0.9; }
        50% { box-shadow: 0 0 15px rgba(127, 255, 212, 0.5); opacity: 1; }
    }
    @keyframes chouten-sparkle {
        0%, 100% { opacity: 0.4; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    /* Night Owl主题：数据验证和表格管理框框使用更暗的边框 */
    .acu-theme-nightowl .acu-table-manager-item,
    .acu-theme-nightowl .acu-validation-rule-item {
        border-color: var(--acu-border) !important;
    }
    .acu-theme-nightowl .acu-table-manager-item:hover,
    .acu-theme-nightowl .acu-validation-rule-item:hover {
        border-color: rgba(127, 219, 202, 0.4) !important;
    }
    /* Night Owl主题：预设卡片框框使用更暗的边框 */
    .acu-theme-nightowl .acu-preset-item {
        border-color: var(--acu-border) !important;
    }
    .acu-theme-nightowl .acu-preset-item:hover {
        border-color: rgba(127, 219, 202, 0.4) !important;
    }
    .acu-wrapper { position: relative; width: 100%; margin: 15px 0; z-index: 31000 !important; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column-reverse; }
    .acu-wrapper.acu-mode-embedded { position: relative !important; width: 100% !important; margin-top: 8px !important; z-index: 31001 !important; clear: both; display: flex; flex-direction: column-reverse !important; padding: 0; }
    .acu-wrapper.acu-mode-embedded .acu-nav-container { position: relative !important; z-index: 31002 !important; }
    .acu-wrapper.acu-mode-embedded .acu-data-display { position: absolute !important; bottom: 100% !important; left: 0 !important; right: 0 !important; width: 100% !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.25) !important; border: 1px solid var(--acu-border); margin-bottom: 5px; z-index: 31010 !important; max-height: 70vh !important; overflow-y: auto !important; }
    .acu-nav-container { display: grid; grid-template-columns: repeat(var(--acu-grid-cols, 3), 1fr); gap: 4px; padding: 6px; background: var(--acu-bg-nav); border: 1px solid var(--acu-border); border-radius: 10px; align-items: center; box-shadow: 0 2px 6px var(--acu-shadow); position: relative; z-index: 31001 !important; }
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
            .acu-nav-btn .acu-nav-warning-icon { color: var(--acu-error-text, #e74c3c); font-size: 10px; margin-left: 2px; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            .acu-action-btn { flex: 1; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--acu-btn-bg); border-radius: 8px; color: var(--acu-text-sub); cursor: pointer; border: 1px solid transparent; transition: all 0.2s; margin: 0; }
            .acu-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .acu-action-btn:focus, .acu-action-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--acu-accent) !important; }
            #acu-btn-save-global { color: var(--acu-btn-active-bg); } #acu-btn-save-global:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); }

            .acu-data-display { position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; max-height: 80vh; height: auto; background: var(--acu-bg-panel); border: 1px solid var(--acu-border); border-radius: 8px; box-shadow: 0 8px 30px var(--acu-shadow); display: flex; flex-direction: column; z-index: 31002 !important; opacity: 0; visibility: hidden; transition: opacity 0.2s ease-out, visibility 0s linear 0.2s; pointer-events: none; }
            .acu-data-display.visible { opacity: 1; visibility: visible; transition: opacity 0.2s ease-in, visibility 0s linear 0s; pointer-events: auto; }
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
            .acu-data-card.pending-deletion { opacity: 0.6; border: 1px dashed var(--acu-error-text, #e74c3c); }
            .acu-data-card.pending-deletion::after { content: "待删除"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: var(--acu-error-text, #e74c3c); font-size: 24px; font-weight: bold; border: 2px solid var(--acu-error-text, #e74c3c); padding: 5px 10px; border-radius: 8px; opacity: 0.8; pointer-events: none; }
            @keyframes pulse-highlight { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
            .acu-highlight-manual { color: var(--acu-hl-manual) !important; background-color: var(--acu-hl-manual-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-highlight-diff { color: var(--acu-hl-diff) !important; background-color: var(--acu-hl-diff-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-editable-title.acu-highlight-manual, .acu-editable-title.acu-highlight-diff { width: auto; display: inline-block; }
            .acu-card-header { flex: 0 0 auto; padding: 8px 10px; background: var(--acu-table-head); border-bottom: 1px dashed var(--acu-border); font-weight: bold; color: var(--acu-text-main); font-size: 14px; display: flex; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 8px; min-height: 40px; height: auto !important; position: relative; }
            .acu-editable-title { flex: 1; width: auto !important; cursor: pointer; border-bottom: 1px dashed transparent; transition: all 0.2s; white-space: pre-wrap !important; overflow: visible !important; word-break: break-word !important; text-align: center; line-height: 1.3; margin: 0; }
            .acu-editable-title:hover { border-bottom-color: var(--acu-accent); color: var(--acu-accent); }
            .acu-card-index { position: static !important; transform: none !important; margin: 0; flex-shrink: 0; font-size: 11px; color: var(--acu-text-sub); font-weight: normal; background: var(--acu-badge-bg); padding: 2px 6px; border-radius: 4px; }
            .acu-bookmark-icon { position: absolute; top: 8px; right: 8px; color: var(--acu-accent); cursor: pointer; font-size: 16px; opacity: 0.3; transition: opacity 0.2s, color 0.2s, transform 0.2s; z-index: 10; }
            .acu-bookmark-icon:hover { opacity: 0.6; transform: scale(1.1); }
            .acu-bookmark-icon.bookmarked { color: var(--acu-accent); opacity: 1; }
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
            .acu-page-btn.active { background: var(--acu-accent); color: var(--acu-button-text-on-accent, #fff); border-color: var(--acu-accent); font-weight: bold; }
            .acu-page-btn.disabled { opacity: 0.5; cursor: not-allowed; }
            .acu-page-info { font-size: 12px; color: var(--acu-text-sub); margin: 0 10px; }
            /* --- [重设计] 行动选项面板样式 - 叙事书页风 --- */
            .acu-option-panel {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 4px;
                background: var(--acu-opt-panel-bg, var(--acu-bg-nav));
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                margin-top: 0;
                margin-bottom: 4px;
                width: 100%;
                box-sizing: border-box;
                z-index: 31001;
                animation: acuFadeIn 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .acu-embedded-options-container {
                width: 100%;
                max-width: 100%;
                margin: 12px 0;
                padding: 0;
                clear: both;
                box-sizing: border-box;
                animation: acuFadeIn 0.3s ease;
            }

            .acu-opt-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                font-weight: 600;
                color: var(--acu-text-main);
                padding: 8px 0;
                border-bottom: 1px solid var(--acu-border);
                margin-bottom: 8px;
                cursor: pointer;
                user-select: none;
                transition: color 0.2s;
            }
            .acu-opt-header:hover {
                color: var(--acu-text-main);
            }

            /* --- [重设计] 叙事条目风格按钮 --- */
            .acu-opt-btn {
                background: var(--acu-opt-bright-bg, #ffffff);
                border: 1px solid transparent;
                padding: 3px 6px;
                border-radius: 4px;
                cursor: pointer;
                color: var(--acu-text-main);
                font-size: var(--acu-opt-font-size, 12px) !important;
                transition: all 0.15s;
                font-weight: normal;
                text-align: left;
                white-space: pre-wrap;
                word-break: break-word;
                min-height: 22px;
                line-height: 1.3;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                opacity: 1;
            }
            .acu-opt-btn:last-child {
                border-bottom: none;
            }
            .acu-opt-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
                transform: translateX(3px);
            }
            .acu-opt-btn:active {
                background: var(--acu-btn-active-bg);
                color: var(--acu-btn-active-text);
            }

            /* --- [新增] 折叠态样式 --- */
            .acu-option-panel.collapsed .acu-opt-btn {
                display: none;
            }
            .acu-option-panel.collapsed .acu-opt-header {
                border-bottom: none;
                margin-bottom: 0;
            }
            @keyframes acuFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            /* [新增] 骰子结果隐藏动画：消除闪烁 */
            .acu-dice-result-revealing {
                opacity: 0 !important;
                transform: translateY(3px) !important;
                transition: opacity 0.18s ease-out, transform 0.18s ease-out !important;
            }
            .acu-dice-result-revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            /* 移动端性能优化：减少动画时长 */
            @media (max-width: 768px) {
                .acu-dice-result-revealing {
                    transition: opacity 0.15s ease-out, transform 0.15s ease-out !important;
                }
            }
            /* 尊重用户的减弱动画偏好设置 */
            @media (prefers-reduced-motion: reduce) {
                .acu-dice-result-revealing {
                    transition: none !important;
                    opacity: 1 !important;
                    transform: none !important;
                }
            }

            .acu-menu-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: transparent; z-index: 31110 !important; }
            /* 1. 菜单容器：背景色、边框、阴影全部跟随主题变量 */
.acu-cell-menu {
    position: fixed !important;
    background: var(--acu-menu-bg) !important;
    border: 1px solid var(--acu-border);
    box-shadow: 0 6px 20px var(--acu-shadow) !important;
    z-index: 31111 !important;
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
            .acu-cell-menu-item#act-delete { color: var(--acu-error-text, #e74c3c); }
            .acu-cell-menu-item#act-delete:hover { background: var(--acu-error-bg, rgba(231, 76, 60, 0.1)); } /* 红色半透明背景，任何主题都适配 */
            .acu-cell-menu-item#act-close { border-top: 1px dashed var(--acu-border); color: var(--acu-text-sub); }

/* 5. 匹配状态标签 */
            .acu-match-full { color: var(--acu-success-text, #27ae60); }
            .acu-match-partial { color: var(--acu-warning-text, #f39c12); }

/* 6. 布局编辑完成按钮 */
            .acu-btn-finish-sort {
                background: rgba(255,255,255,0.2);
                color: var(--acu-button-text-on-accent, #fff);
                border: 1px solid rgba(255,255,255,0.4);
                padding: 4px 14px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-btn-finish-sort:hover, .acu-btn-finish-sort.hover {
                background: var(--acu-button-text-on-accent, #fff);
                color: var(--acu-accent);
            }

            .acu-edit-overlay { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75) !important; z-index: 31200 !important; display: flex; justify-content: center !important; align-items: center !important; backdrop-filter: blur(2px); }
            .acu-edit-dialog { background: var(--acu-bg-panel); width: 95%; max-width: 500px; max-height: 95vh; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 15px 50px rgba(0,0,0,0.6); color: var(--acu-text-main); border: 1px solid var(--acu-border); overflow: hidden; flex-shrink: 0; }
            @media (min-width: 768px) { .acu-edit-dialog { max-width: 900px; width: 90%; } .acu-edit-dialog.acu-settings-dialog { max-width: 400px; width: 400px; } }
            .acu-edit-title { margin: 0; font-size: 16px; font-weight: bold; color: var(--acu-text-main); padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
            .acu-edit-icon-muted { opacity: 0.7; }
            .acu-edit-content { background: var(--acu-bg-panel); }
            .acu-settings-content-scroll { flex: 1; overflow-y: auto; padding: 15px; }
            .acu-card-edit-field { margin-bottom: 10px; }
            .acu-card-edit-label { display: block; font-size: 12px; color: var(--acu-accent); font-weight: bold; margin-bottom: 4px; }
            .acu-card-edit-input { width: 100%; padding: 10px; border: 1px solid var(--acu-border); border-radius: 6px; background: var(--acu-input-bg); color: var(--acu-text-main); box-sizing: border-box; font-size: 14px; line-height: 1.5; }
            .acu-card-edit-input:focus { outline: none; border-color: var(--acu-accent); }
            .acu-card-edit-textarea { min-height: 40px; max-height: 500px; resize: none; overflow-y: hidden; }
            .acu-edit-textarea { width: 100%; height: auto; padding: 12px; border: 1px solid var(--acu-border) !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 14px; line-height: 1.6; overflow-y: auto !important; }
            .acu-edit-textarea:focus { outline: none; border-color: var(--acu-accent) !important; }
            .acu-edit-textarea::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            @media (min-width: 768px) { .acu-edit-textarea { height: auto !important; font-size: 15px !important; } }
            .acu-edit-textarea:focus { outline: 1px solid #aaa; }
            .acu-dialog-btns { display: flex; justify-content: flex-end; gap: 20px; margin-top: 10px; }
            .acu-dialog-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 6px; color: var(--acu-text-sub); transition: color 0.2s; }
            .acu-dialog-btn:hover { color: var(--acu-text-main); } .acu-btn-confirm { color: var(--acu-success-text); } .acu-btn-confirm:hover { opacity: 0.8; }
            /* --- [UI Optimization] PC-First Edit Mode Styles --- */
            .acu-order-controls { grid-column: 1 / -1; order: -2; display: none; width: 100%; text-align: left; background: var(--acu-accent); color: var(--acu-button-text-on-accent, var(--acu-text-main)); padding: 6px 12px; margin: 0 0 8px 0; border-radius: 4px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .acu-order-controls.visible { display: flex; align-items: center; justify-content: space-between; }

            .acu-nav-container.editing-order { border: 2px solid var(--acu-accent); background: var(--acu-bg-panel); }
            .acu-nav-container.editing-order .acu-nav-btn, .acu-nav-container.editing-order .acu-action-btn { opacity: 1 !important; cursor: grab !important; border: 1px solid var(--acu-border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .acu-nav-container.editing-order .acu-nav-btn:hover, .acu-nav-container.editing-order .acu-action-btn:hover { border-color: var(--acu-accent); transform: translateY(-1px); }

            .acu-swap-selected { background-color: var(--acu-accent) !important; color: var(--acu-button-text-on-accent, var(--acu-text-main)) !important; border-color: var(--acu-accent); box-shadow: 0 0 0 2px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.2); transform: scale(1.05); z-index: 10; }
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
            .acu-settings-item { margin-bottom: 15px; }
            .acu-settings-label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px; color: #ccc; }
            .acu-settings-val { float: right; color: #4cd964; font-size: 12px; }
            .acu-slider { width: 100%; height: 4px; background: #555; border-radius: 2px; outline: none; -webkit-appearance: none; }
            .acu-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
            .acu-select { width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid #555; color: #fff; border-radius: 4px; outline: none; }
            .acu-edit-overlay input[type="checkbox"].acu-checkbox { margin-right: 10px; accent-color: var(--acu-accent) !important; background: transparent !important; background-color: transparent !important; }
            .acu-btn-block { width: 100%; padding: 10px; background: #444; color: #eee; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
            .acu-btn-block:hover { background: #555; color: #fff; }
            .acu-expand-trigger { background: var(--acu-bg-nav); border: 1px solid var(--acu-border); box-shadow: 0 2px 6px var(--acu-shadow); cursor: pointer; color: var(--acu-text-main); font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s; z-index: 31005 !important; }
            .acu-expand-trigger:hover { background: var(--acu-btn-hover); transform: translateY(-2px); }
            .acu-col-bar { width: 100%; justify-content: center; padding: 8px 10px; border-radius: 6px; }
            .acu-col-pill { width: auto !important; padding: 6px 16px; border-radius: 50px; }
            .acu-col-mini { width: 40px !important; height: 40px !important; padding: 0; justify-content: center; border-radius: 50%; }
            .acu-col-mini span { display: none; }
            /* [优化] 小眼睛图标悬停效果 */
            .acu-nav-toggle-btn:hover { opacity: 1 !important; transform: translateY(-50%) scale(1.2); color: var(--acu-accent); }
            .acu-align-right { margin-left: auto; align-self: flex-end; }
            .acu-align-center { 
                margin-left: auto !important; 
                margin-right: auto !important; 
            }
            .acu-align-left { margin-right: auto; margin-left: 0; align-self: flex-start; }
            .acu-nav-container.acu-left-mode .acu-actions-group { order: -1; margin-left: 0; margin-right: 10px; }
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
                #acu-btn-save-global:hover { background: var(--acu-accent) !important; color: var(--acu-btn-active-text) !important; }
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
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    transform: none !important;
                    width: 92vw !important;
                    max-width: 400px !important;
                    max-height: calc(100vh - 32px) !important;
                    max-height: calc(100dvh - 32px) !important;
                }
                .acu-dice-overlay, .acu-contest-overlay {
                    align-items: center !important;
                    padding: 16px !important;
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

                /* 仪表盘地点名称单行省略样式 */
                .acu-dash-locations .acu-location-item {
                    padding: 4px 8px !important;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden; /* 防止内容溢出 */
                    align-items: center;
                    color: var(--acu-text-main);
                }

                .acu-dash-locations .acu-location-item > span:first-child {
                    display: flex !important;
                    align-items: center;
                    gap: 6px;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
                    overflow: hidden;
                }

                .acu-dash-locations .acu-location-item > span:first-child i {
                    flex-shrink: 0; /* 图标不收缩 */
                    font-size: 9px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                }

                .acu-dash-locations .acu-location-item > i {
                    margin-left: auto;
                    width: 14px;
                    text-align: center;
                    font-size: 10px;
                    opacity: 0.4;
                    color: var(--acu-text-sub);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                .acu-dash-locations .acu-location-item > span:first-child > span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    min-width: 0; /* 允许flex子元素收缩 */
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
                    font-size: 11px;
                    color: var(--acu-text-sub);
                    text-align: center;
                    padding: 15px;
                    opacity: 0.7;
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* 仪表盘中有固定高度容器的空状态居中 */
                .acu-player-status .acu-empty-hint,
                .acu-dash-locations > div .acu-empty-hint {
                    height: 100%;
                    min-height: inherit;
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
                z-index: 31100 !important;
                backdrop-filter: blur(3px);
                animation: acuFadeIn 0.2s ease;
            }

                .acu-preview-overlay .acu-data-card {
                    width: 90vw;
                    max-width: 400px;
                    flex: none;
                }
                @media (min-width: 768px) {
                    .acu-preview-overlay .acu-data-card {
                        max-width: 550px;
                    }
                }

            .acu-preview-close:hover {
                background: var(--acu-error-bg, rgba(231, 76, 60, 0.1));
                color: var(--acu-error-text, #e74c3c);
            }

            .acu-dash-clickable {
                cursor: pointer;
                transition: all 0.15s;
            }

            .acu-dash-clickable:hover {
                background: var(--acu-table-hover);
            }
            .acu-current-location span {
                color: inherit;
                font-weight: inherit;
            }
            .acu-current-location i {
                color: inherit;
            }
            .acu-current-location > span:first-child > span {
                font-weight: 600;
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
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 31105;
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
                color: var(--acu-text-main);
                transition: background 0.1s;
            }
            .acu-dropdown-item:hover {
                background: var(--acu-table-head);
            }
            .acu-dropdown-empty {
                padding: 8px 10px;
                font-size: 12px;
                text-align: center;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            /* === 输入框清除按钮样式 === */
            .acu-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
            .acu-input-wrapper input { padding-right: 24px !important; }
            .acu-clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: transparent !important; border: none !important; font-size: 12px; cursor: pointer; padding: 4px; line-height: 1; opacity: 0.5; transition: opacity 0.2s, color 0.2s; z-index: 5; color: var(--acu-text-sub); }
            .acu-clear-btn:hover { background: transparent !important; border: none !important; opacity: 1 !important; color: var(--acu-accent) !important; }

            /* === 结果徽章样式 === */
            .acu-result-badge {
                padding: 3px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                border: 1px solid transparent;
            }
            .acu-result-badge-crit-success { background-color: var(--acu-crit-success-bg); color: var(--acu-crit-success-text); border-color: var(--acu-crit-success-bg); }
            .acu-result-badge-extreme-success { background-color: var(--acu-extreme-success-bg); color: var(--acu-extreme-success-text); border-color: var(--acu-extreme-success-bg); }
            .acu-result-badge-success { background-color: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-bg); }
            .acu-result-badge-warning { background-color: var(--acu-warning-bg); color: var(--acu-warning-text); border-color: var(--acu-warning-bg); }
            .acu-result-badge-failure { background-color: var(--acu-failure-bg); color: var(--acu-failure-text); border-color: var(--acu-failure-bg); }
            .acu-result-badge-crit-failure { background-color: var(--acu-crit-failure-bg); color: var(--acu-crit-failure-text); border-color: var(--acu-crit-failure-bg); }

            /* === 预设按钮样式 === */
            .acu-dice-preset, .acu-contest-preset {
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-dice-preset:hover, .acu-contest-preset:hover {
                background: var(--acu-btn-hover);
            }
            .acu-dice-preset.active, .acu-contest-preset.active {
                background: var(--acu-accent);
                color: var(--acu-button-text-on-accent, #fff);
                border-color: var(--acu-accent);
            }
            .acu-dice-preset.active:hover, .acu-contest-preset.active:hover {
                background: var(--acu-accent);
                color: var(--acu-button-text-on-accent, #fff);
                filter: brightness(1.1);
            }

            /* === 骰子结果显示区域 === */
            .acu-dice-result-display {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                gap: 8px;
            }
            .acu-dice-result-value {
                font-size: 22px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-dice-result-target {
                font-size: 11px;
                color: var(--acu-text-sub);
                opacity: 0.9;
            }
            .acu-dice-retry-btn {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .acu-dice-retry-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }

            /* === 对战结果显示区域 === */
            .acu-contest-result-display {
                display: none;
                margin-bottom: 10px;
            }
            .acu-contest-result-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                cursor: pointer;
            }
            .acu-contest-result-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-result-winner-row {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 16px;
                background: var(--acu-light-bg);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
            }
            .acu-contest-reroll-icon {
                font-size: 14px;
                color: var(--acu-text-sub);
                transition: all 0.2s;
            }
            .acu-contest-result-winner-row:hover .acu-contest-reroll-icon {
                color: var(--acu-accent);
                transform: rotate(90deg);
            }
            .acu-contest-result-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                flex: 1;
            }
            .acu-contest-result-side {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-contest-result-side.right {
                flex-direction: row-reverse;
            }
            .acu-contest-vs {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                padding: 0 4px;
            }
            .acu-contest-result-name {
                font-size: 10px;
                color: var(--acu-text-main);
                opacity: 0.9;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 4em;
                text-align: center;
            }
            .acu-contest-result-value {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
            }
            .acu-contest-winner-text {
                font-size: 14px;
                font-weight: bold;
            }
            .acu-contest-winner-success { color: var(--acu-success-text); }
            .acu-contest-winner-warning { color: var(--acu-warning-text); }
            .acu-contest-winner-failure { color: var(--acu-failure-text); }

            /* === 关系图滑块容器 === */
            .acu-node-size-slider-container {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
            }
            .acu-node-size-slider-container .acu-slider-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
            }
            .acu-node-size-slider-container .acu-slider-value {
                font-size: 11px;
                color: var(--acu-accent);
                font-weight: bold;
                min-width: 35px;
                text-align: right;
            }
            .acu-node-size-slider-container input[type="range"] {
                background: var(--acu-btn-bg);
            }

            /* === 关系图过滤按钮 === */
            .acu-graph-filter-btn {
                transition: all 0.15s;
            }
            .acu-graph-filter-btn.active {
                background: var(--acu-accent) !important;
                color: var(--acu-button-text-on-accent, #fff) !important;
                border-color: var(--acu-accent) !important;
            }

            /* === 关系图箭头标记 - 使用 CSS 变量 === */
            .acu-graph-svg #arrowhead-end polygon,
            .acu-graph-svg #arrowhead-start polygon {
                fill: var(--acu-text-sub);
            }
            .acu-graph-svg #arrowhead-end-hl polygon,
            .acu-graph-svg #arrowhead-start-hl polygon {
                fill: var(--acu-accent);
            }

            /* === 导入提示样式 === */
            .acu-import-empty {
                text-align: center;
                padding: 20px;
                color: var(--acu-text-sub);
            }
            .acu-import-warning {
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-import-warning i {
                color: var(--acu-warning-icon, #f39c12);
            }
            .acu-import-success {
                text-align: center;
                padding: 10px;
                color: var(--acu-success-text);
            }

            /* ========== 人物关系图样式 ========== */
            .acu-relation-graph-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
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
                stroke: var(--acu-accent);
                stroke-width: 3;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
            }
            .acu-graph-node:hover .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
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
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-bg {
                stroke: var(--acu-accent);
                stroke-width: 3;
            }
            .acu-graph-svg.highlighting .acu-graph-node.highlighted .acu-node-avatar {
                box-shadow: 0 0 0 2px var(--acu-accent);
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
            .acu-node-size-slider-container input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
                outline: none;
                cursor: pointer;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--acu-accent);
                cursor: pointer;
                border: 2px solid var(--acu-bg-panel);
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s;
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
            }
            .acu-node-size-slider-container input[type="range"]::-moz-range-track {
                height: 10px;
                border-radius: 5px;
                background: var(--acu-btn-bg);
            }
            @media (max-width: 768px) {
                .acu-relation-graph-container {
                    width: 100%;
                    height: 80vh;
                    max-height: none;
                    border-radius: 12px;
                }
                .acu-graph-legend {
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 8px 6px;
                }
            }

            /* ========== 地图可视化样式 ========== */
            .acu-map-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-map-container {
                width: 95%;
                max-width: 500px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.45);
            }
            .acu-map-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
                white-space: nowrap;
                flex-shrink: 0;
            }
            .acu-map-actions {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .acu-map-actions button {
                width: 28px !important;
                height: 28px !important;
                min-width: unset !important;
                min-height: unset !important;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
            }
            .acu-map-actions button:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
            }
            .acu-map-back-btn {
                width: 28px !important;
                height: 28px !important;
                min-width: unset !important;
                min-height: unset !important;
            }
            .acu-map-body {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 12px;
                overflow: hidden;
            }
            /* 焦点区域 - 3列Grid布局 */
            .acu-map-focus-area {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 12px;
                align-items: center;
                border: 1px dashed var(--acu-border);
                border-radius: 12px;
                padding: 16px;
                background: var(--acu-btn-bg);
            }

            /* 侧翼 */
            .acu-map-wing {
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-width: 0;
                align-self: flex-start; /* 侧翼顶部对齐 */
            }
            .acu-map-wing.left { align-items: flex-end; text-align: right; }
            .acu-map-wing.right { align-items: flex-start; text-align: left; }

            .acu-map-mobile-stack {
                display: none;
            }

            /* 头像组 */
            .acu-map-avatar-group {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: flex-start; /* 顶部对齐 */
                min-height: 70px; /* 确保有最小高度 */
            }
            .acu-map-wing.left .acu-map-avatar-group { justify-content: flex-end; }
            .acu-map-wing.right .acu-map-avatar-group { justify-content: flex-start; }

            /* 头像智能堆叠 */
            .acu-map-wing.left .acu-map-avatar:not(:last-child) { margin-right: -12px; }
            .acu-map-wing.right .acu-map-avatar:not(:first-child) { margin-left: -12px; }
            .acu-map-avatar:hover { transform: scale(1.1); z-index: 10; position: relative; }

            .acu-map-avatar {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                min-width: 56px;
                cursor: pointer;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .acu-map-avatar-circle {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                border: 2px solid var(--acu-accent);
                background: var(--acu-btn-bg);
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-sub);
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .acu-map-avatar-name {
                font-size: 11px;
                color: var(--acu-text-main);
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }

            /* 元素组 */
            .acu-map-element-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                max-width: 140px;
            }
            .acu-map-element-chip {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-bg-panel);
                font-size: 11px;
                color: var(--acu-text-main);
                cursor: pointer;
                transition: all 0.15s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-map-element-chip:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
                transform: translateX(2px);
            }

            /* 中央舞台 */
            .acu-map-stage-center {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 100px;
                z-index: 2;
                cursor: pointer;
            }

            /* 透明背景大号Emoji */
            .acu-map-location-emoji {
                background: transparent;
                border: none;
                width: auto;
                height: auto;
                font-size: 4rem;
                line-height: 1;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .acu-map-location-emoji:hover { transform: scale(1.1) rotate(5deg); }

            /* FA图标主题色继承 */
            .acu-map-location-emoji .acu-theme-icon,
            .acu-map-chip-emoji .acu-theme-icon,
            .acu-map-thumbnail-emoji .acu-theme-icon {
                color: var(--acu-accent);
                font-size: inherit;
            }

            /* 无emoji时的文字占位 */
            .acu-map-location-text {
                width: 64px;
                height: 64px;
                border-radius: 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                font-weight: bold;
                color: var(--acu-text-sub);
            }

            /* 地点名 */
            .acu-map-location-name {
                margin-top: 8px;
                font-weight: 700;
                font-size: 1.1em;
                max-width: 140px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--acu-text-main);
            }

            /* 缩略图样式 */
            .acu-map-thumbnails {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 12px;
                max-height: 50vh;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px;
                box-sizing: border-box;
            }
            .acu-map-thumbnail {
                position: relative;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                padding: 8px;
                background: var(--acu-btn-bg);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-map-thumbnail.active {
                border-color: var(--acu-accent);
                box-shadow: 0 0 0 1px var(--acu-accent);
            }
            .acu-map-thumbnail:hover {
                border-color: var(--acu-accent);
                transform: translateY(-2px);
            }
            .acu-map-thumbnail-emoji {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
            }
            .acu-map-thumbnail-placeholder {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: var(--acu-bg-panel);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-sub);
                border: 1px solid var(--acu-border);
            }
            .acu-map-thumbnail-name { font-size: 11px; color: var(--acu-text-main); }

            /* 角标 */
            .acu-map-thumbnail-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                min-width: 22px;
                height: 22px;
                padding: 0 6px;
                border-radius: 99px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                font-size: 0.75rem;
                font-weight: 800;
                font-variant-numeric: tabular-nums;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 6px rgba(0,0,0,0.25);
                border: 3px solid var(--acu-btn-bg);
                z-index: 10;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .acu-map-thumbnail:hover .acu-map-thumbnail-badge {
                transform: scale(1.1);
            }

            /* 地区标签页 */
            .acu-map-region-tabs {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-left: auto;
                margin-right: 8px;
            }
            .acu-map-region-tab {
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-map-region-tab.active,
            .acu-map-region-tab:hover {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            .acu-map-empty {
                text-align: center;
                color: var(--acu-text-sub);
                font-size: 12px;
                padding: 8px 0;
            }
            .acu-map-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                width: 100%;
            }
            .acu-map-spinner {
                width: 32px;
                height: 32px;
                border: 3px solid var(--acu-border);
                border-top-color: var(--acu-accent);
                border-radius: 50%;
                animation: acu-map-spin 0.8s linear infinite;
            }
            @keyframes acu-map-spin { to { transform: rotate(360deg); } }
            @media (max-width: 768px) {
                .acu-map-container {
                    width: 96%;
                    max-height: 92vh;
                }
                .acu-map-focus-area {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 16px 12px;
                    background: var(--acu-btn-bg);
                }
                .acu-map-stage-center {
                    width: 100%;
                    margin-bottom: 4px;
                    flex-direction: row;
                    justify-content: center;
                    gap: 12px;
                }
                .acu-map-location-emoji {
                    font-size: 2.5rem;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .acu-map-location-text {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }
                .acu-map-location-name {
                    margin-top: 0;
                    font-size: 1.25rem;
                    max-width: none;
                    text-align: left;
                    align-self: center;
                }
                .acu-map-wing {
                    display: none;
                }
                .acu-map-mobile-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                }
                .acu-map-mobile-avatars,
                .acu-map-mobile-elements {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 8px;
                    max-height: 168px;
                    overflow-y: auto;
                    padding: 2px 4px;
                }
                .acu-map-mobile-avatars:empty,
                .acu-map-mobile-elements:empty {
                    display: none;
                }
                .acu-map-avatar {
                    min-width: auto;
                    width: 52px;
                }
                .acu-map-avatar-circle {
                    width: 42px;
                    height: 42px;
                }
                .acu-map-element-chip {
                    font-size: 12px;
                    padding: 6px 10px;
                    background: var(--acu-bg-panel);
                }
                .acu-map-thumbnails {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                }
            }

            /* ========== 头像管理弹窗样式 ========== */
            .acu-avatar-manager-overlay {
                background: rgba(0,0,0,0.7);
                z-index: 31300;
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
            .acu-avatar-header-actions {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .acu-avatar-list {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                min-height: 0;
            }
            .acu-avatar-file-input,
            #acu-avatar-file-input {
                display: none;
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
            .acu-avatar-preview.has-image {
                background-image: var(--acu-avatar-image);
                background-position: var(--acu-avatar-x, 50%) var(--acu-avatar-y, 50%);
                background-size: var(--acu-avatar-scale, 150%);
                background-repeat: no-repeat;
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
            .acu-protagonist-toggle {
                background: transparent;
                border: none;
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: pointer;
                padding: 4px 6px;
                margin-left: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .acu-protagonist-toggle:hover {
                opacity: 0.8;
                background: var(--acu-bg-hover);
            }
            .acu-protagonist-toggle.active {
                opacity: 1;
                color: var(--acu-accent);
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
            .acu-avatar-save-btn:hover { color: var(--acu-success-text, #27ae60) !important; }
            .acu-avatar-clear-btn:hover { color: var(--acu-error-text, #e74c3c) !important; }
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
                z-index: 31400;
            }
            .acu-import-confirm-dialog {
                width: 90%;
                max-width: 360px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden;
            }
            .acu-import-confirm-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-import-confirm-header i {
                font-size: 16px;
            }
            .acu-import-confirm-body {
                padding: 20px;
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
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-border) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-import-cancel-btn:hover {
                background: var(--acu-btn-hover) !important;
            }
            .acu-import-confirm-btn {
                background: var(--acu-accent) !important;
                border: none !important;
                color: var(--acu-btn-active-text) !important;
            }
            .acu-import-confirm-btn:hover {
                opacity: 0.85 !important;
                background: var(--acu-accent) !important;
            }
            /* ========== 预设导入警告样式 ========== */
            .acu-import-warning-container {
                text-align: center;
                padding: 16px 12px 20px;
                color: var(--acu-text-main);
            }
            .acu-import-warning-icon {
                display: block;
                width: 48px;
                height: 48px;
                margin: 0 auto 12px;
                line-height: 48px;
                border-radius: 50%;
                background: rgba(243, 156, 18, 0.15);
                color: var(--acu-warning-icon, #f39c12);
                font-size: 22px;
            }
            .acu-import-warning-title {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 8px;
                color: var(--acu-text-main);
            }
            .acu-import-warning-message {
                font-size: 13px;
                color: var(--acu-text-sub);
                line-height: 1.5;
            }
            .acu-import-conflict-options {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px dashed var(--acu-border);
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .acu-import-radio {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                color: var(--acu-text-main) !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid transparent !important;
                transition: all 0.2s ease;
            }
            .acu-import-radio:hover {
                border-color: var(--acu-border) !important;
                background: var(--acu-btn-hover) !important;
            }
            .acu-import-radio input {
                accent-color: var(--acu-accent);
                width: 16px;
                height: 16px;
            }
            .acu-import-confirm-footer {
                display: flex;
                gap: 12px;
                padding: 16px 20px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
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
            .acu-dice-cfg-item.acu-cfg-toggle-item {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
            }
            .acu-dice-cfg-item.acu-cfg-toggle-item > label {
                margin: 0;
                font-size: 13px;
                color: var(--acu-text-main);
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
                padding: 10px 12px;
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
                background: var(--acu-btn-bg);
                border-color: var(--acu-btn-bg);
                color: var(--acu-button-text);
            }
            .acu-dice-cfg-actions button.primary:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-btn-hover);
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
            .acu-settings-title-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .acu-settings-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-version-badge {
                display: inline-flex;
                align-items: center;
                line-height: 1.2;
                white-space: nowrap;
                letter-spacing: 0.5px;
                background: var(--acu-badge-bg, rgba(0, 0, 0, 0.05));
                color: var(--acu-text-sub);
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 10px;
                font-weight: normal;
                margin-left: 6px;
                opacity: 0.8;
            }
            .acu-help-btn {
                background: none !important;
                border: none !important;
                box-shadow: none !important;
                outline: none !important;
                color: var(--acu-text-sub);
                cursor: pointer;
                font-size: 16px;
                padding: 6px;
                margin: 0;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-help-btn:hover {
                color: var(--acu-text-main);
                background: var(--acu-table-hover) !important;
            }
            /* 手动更新按钮 - 纯图标，透明背景，与版本号大小一致 */
            .acu-manual-update-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                color: var(--acu-text-sub);
                border: none;
                padding: 0;
                margin-left: 6px;
                font-size: 11px;
                opacity: 0.6;
                cursor: pointer;
                transition: all 0.2s;
                vertical-align: middle;
                line-height: 1;
            }
            .acu-manual-update-btn:hover {
                opacity: 1;
                color: var(--acu-accent, #3b82f6);
                background: transparent;
            }
            /* 手动更新确认弹窗样式 */
            .acu-manual-update-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 31400;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 16px;
                box-sizing: border-box;
            }
            .acu-manual-update-dialog {
                background: var(--acu-panel-bg, #ffffff);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 100%;
                max-width: 360px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                position: relative;
                z-index: 1;
            }
            .acu-manual-update-header {
                padding: 14px 16px;
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-manual-update-body {
                padding: 16px;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                line-height: 1.6;
            }
            .acu-manual-update-body p {
                margin: 0 0 12px 0;
                color: var(--acu-text-main) !important;
            }
            .acu-manual-update-safe-box {
                background: var(--acu-card-bg, rgba(34, 197, 94, 0.1));
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                padding: 10px 12px;
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            .acu-manual-update-safe-box i {
                color: var(--acu-accent, #22c55e);
                margin-top: 2px;
            }
            .acu-manual-update-safe-box .safe-text {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.5;
            }
            .acu-manual-update-safe-box .safe-text strong {
                color: var(--acu-text-main);
                display: block;
                margin-bottom: 2px;
            }
            .acu-manual-update-footer {
                padding: 12px 16px;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-manual-update-cancel-btn,
            .acu-manual-update-confirm-btn {
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
                border: none;
            }
            .acu-manual-update-cancel-btn {
                background: var(--acu-card-bg);
                color: var(--acu-text-sub);
                border: 1px solid var(--acu-border);
            }
            .acu-manual-update-cancel-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-text-main);
            }
            .acu-manual-update-confirm-btn {
                background: var(--acu-accent, #3b82f6);
                color: #fff;
            }
            .acu-manual-update-confirm-btn:hover {
                filter: brightness(1.1);
            }
            .acu-manual-update-confirm-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
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
                overflow: hidden;
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
                color: var(--acu-btn-active-text);
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
                color: var(--acu-btn-active-text);
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
                background: rgba(120, 120, 128, 0.16);
                border: none;
                border-radius: 24px;
                transition: all 0.3s ease;
            }
            .acu-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background: #fff;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            .acu-toggle input:checked + .acu-toggle-slider {
                background: var(--acu-accent);
            }
            .acu-toggle input:checked + .acu-toggle-slider:before {
                transform: translateX(20px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            /* Range Slider 滑条样式 */
            .acu-range-slider {
                -webkit-appearance: none;
                appearance: none;
                flex: 1;
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.3);
                outline: none;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .acu-range-slider::-webkit-slider-runnable-track {
                height: 6px;
                border-radius: 3px;
                background: transparent;
            }
            .acu-range-slider::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                margin-top: -6px !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-webkit-slider-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-webkit-slider-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-slider::-moz-range-track {
                height: 6px;
                border-radius: 3px;
                background: rgba(120, 120, 128, 0.16);
            }
            .acu-range-slider::-moz-range-thumb {
                width: 18px !important;
                height: 18px !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
                cursor: pointer !important;
                transition: all 0.2s ease;
            }
            .acu-range-slider:hover::-moz-range-thumb {
                transform: scale(1.05) !important;
                background: #e8e8e8 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            }
            .acu-range-slider:active::-moz-range-thumb {
                transform: scale(0.95) !important;
                background: #d0d0d0 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
            }
            .acu-range-value {
                min-width: 45px;
                text-align: right;
                font-weight: 600;
                font-size: 13px;
                color: var(--acu-accent, var(--SmartThemeBodyColor, #d4a574));
            }
            /* 疯狂程度按钮组样式 */
            .acu-crazy-btn {
                padding: 4px 12px;
                font-size: 12px;
                border: 1px solid var(--acu-border, rgba(0,0,0,0.1));
                border-radius: 4px;
                background: var(--acu-btn-bg, rgba(0,0,0,0.05));
                color: var(--acu-text, inherit);
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }
            .acu-crazy-btn:hover {
                background: var(--acu-btn-hover, rgba(0,0,0,0.1));
            }
            .acu-crazy-btn.active {
                background: var(--acu-accent, #d4a574);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent, #d4a574);
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            }
            /* Debug控制台过滤样式 - 增加优先级防止被酒馆样式覆盖 */
            .acu-debug-console-dialog .acu-debug-filter,
            .acu-debug-console-dialog label input.acu-debug-filter {
                cursor: pointer !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                appearance: checkbox !important;
                -webkit-appearance: checkbox !important;
                -moz-appearance: checkbox !important;
            }
            .acu-debug-console-dialog label {
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
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
                border: 1px solid var(--acu-border);
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
                color: var(--acu-button-text);
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
                border-left: 1px solid var(--acu-border);
                border-right: 1px solid var(--acu-border);
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
            .acu-changes-count { margin-left: auto; background: var(--acu-accent); color: var(--acu-btn-active-text); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
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
            .acu-simple-mode-toggle.active { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
            .acu-simple-mode-toggle:hover { background: var(--acu-accent); color: var(--acu-btn-active-text); border-color: var(--acu-accent); }
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
                color: var(--acu-btn-active-text);
            }
            .acu-edit-dialog .acu-btn-confirm:hover {
                background: var(--acu-accent);
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
            .acu-changed-badge { font-size: 10px; padding: 1px 6px; background: var(--acu-accent); color: var(--acu-btn-active-text); border-radius: 3px; font-weight: normal; }
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
                color: var(--acu-accent);
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
                color: var(--acu-btn-active-text);
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
                color: var(--text-sub);
                transition: all 0.2s;
                flex-shrink: 0;
                background: none;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-rule-toggle:hover {
                opacity: 0.8;
            }
            .acu-rule-toggle.active {
                color: var(--acu-accent);
                opacity: 1;
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
                background: none !important;
            }
            .acu-rule-delete {
                background: none;
                border: none;
                color: var(--text-sub);
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
            .acu-rule-edit {
                background: none;
                border: none;
                color: var(--text-sub);
                cursor: pointer;
                padding: 4px;
                opacity: 0.6;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .acu-rule-edit:hover {
                color: var(--accent-color);
                opacity: 1;
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
                z-index: 31320;
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
            .acu-validation-modal-body .acu-panel-input::placeholder,
            .acu-validation-modal input[type="text"]::placeholder,
            .acu-validation-modal input[type="number"]::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7 !important;
            }
            .acu-validation-modal select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }
            .acu-validation-modal select option[value=""] {
                color: var(--acu-text-sub) !important;
                opacity: 0.7 !important;
            }
            .acu-rule-config-section {
                padding: 8px 0;
            }
            .acu-validation-modal-footer {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding: 16px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-validation-modal-footer .acu-btn {
                flex: 1;
                padding: 10px 12px !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
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
                color: var(--acu-btn-active-text);
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
                background: var(--acu-accent) !important;
                color: var(--acu-btn-active-text) !important;
                border: 1px solid var(--acu-accent) !important;
                border-radius: 4px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
            }
            .acu-smart-fix-quick-btn:hover {
                background: var(--acu-btn-active-bg) !important;
                color: var(--acu-btn-active-text) !important;
                border-color: var(--acu-btn-active-bg) !important;
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
                z-index: 31330;
            }
            .acu-crop-file-input {
                display: none;
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
                color: var(--acu-btn-active-text);
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

            /* ========== 收藏夹面板样式 ========== */
            .acu-favorites-overlay,
            .acu-fav-edit-overlay,
            .acu-fav-new-overlay,
            .acu-fav-send-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(2px);
            }
            .acu-favorites-panel {
                width: 90%;
                max-width: 800px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-favorites-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-favorites-header h3 {
                margin: 0;
                font-size: 16px;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .acu-favorites-header-actions {
                display: flex;
                gap: 8px;
            }
            .acu-fav-header-btn {
                padding: 6px 12px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s ease;
            }
            .acu-fav-header-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-header-btn.acu-fav-close {
                background: transparent;
                border: none;
                font-size: 16px;
            }
            .acu-favorites-filter {
                display: flex;
                gap: 10px;
                padding: 12px 18px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-favorites-filter select,
            .acu-favorites-filter input {
                flex: 1;
                padding: 8px 12px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-favorites-filter select {
                max-width: 200px;
            }
            .acu-favorites-content {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-favorites-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
                color: var(--acu-text-muted);
                text-align: center;
            }
            .acu-favorites-group {
                margin-bottom: 20px;
            }
            .acu-favorites-group-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-favorites-group-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 12px;
            }
            .acu-favorites-card {
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                padding: 12px;
                transition: all 0.2s ease;
            }
            .acu-favorites-card:hover {
                border-color: var(--acu-accent);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .acu-favorites-card-header {
                margin-bottom: 8px;
            }
            .acu-favorites-card-preview {
                font-size: 12px;
                color: var(--acu-text-main);
                line-height: 1.5;
            }
            .acu-fav-preview-item {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-fav-preview-item b {
                color: var(--acu-accent);
            }
            .acu-favorites-card-source {
                font-size: 11px;
                color: var(--acu-text-muted);
                margin-top: 4px;
            }
            .acu-favorites-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
            }
            .acu-favorites-tag {
                padding: 2px 8px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 10px;
                font-size: 10px;
                font-weight: 500;
            }
            .acu-favorites-card-actions {
                display: flex;
                gap: 6px;
                justify-content: flex-end;
            }
            .acu-fav-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            .acu-fav-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            .acu-fav-send:hover {
                color: #27ae60;
            }

            /* ========== 收藏夹标签过滤可折叠区域 ========== */
            .acu-fav-tag-filter-collapsible {
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-tag-filter-header {
                position: sticky;
                top: 0;
                z-index: 1;
                padding: 6px 12px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
            }
            .acu-fav-tag-filter-header span {
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                color: var(--acu-text-sub);
                font-weight: 500;
            }
            .acu-fav-tag-toggle-icon {
                font-size: 10px;
                color: var(--acu-text-sub);
                transition: transform 0.2s;
            }
            .acu-fav-tag-filter-body {
                padding: 8px 12px;
                background: var(--acu-table-head);
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
            }
            .acu-fav-tag-filter-body.horizontal {
                display: grid;
                grid-auto-flow: column;
                grid-template-rows: repeat(auto-fill, minmax(28px, 1fr));
                gap: 6px;
                overflow-x: auto;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-filter-body {
                display: none;
            }
            .acu-fav-tag-filter-collapsible.collapsed .acu-fav-tag-toggle-icon {
                transform: rotate(-90deg);
            }
            .acu-fav-tag-btn {
                padding: 0 10px;
                height: 28px;
                background: transparent;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(var(--acu-font-size, 13px) * 0.85);
                transition: all 0.2s ease;
                opacity: 0.5;
                white-space: nowrap;
            }
            .acu-fav-tag-btn:hover {
                opacity: 0.8;
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-tag-btn.active {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
                opacity: 1;
            }

            /* 编辑弹窗 */
            .acu-fav-edit-modal,
            .acu-fav-new-modal,
            .acu-fav-send-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .acu-fav-edit-modal-header,
            .acu-fav-new-modal-header,
            .acu-fav-send-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-edit-modal-header h4,
            .acu-fav-new-modal-header h4,
            .acu-fav-send-modal-header h4 {
                margin: 0;
                font-size: 15px;
                color: var(--acu-accent);
            }
            .acu-fav-edit-close,
            .acu-fav-new-close,
            .acu-fav-send-close {
                background: transparent;
                border: none;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 16px;
            }
            .acu-fav-edit-modal-body,
            .acu-fav-new-modal-body,
            .acu-fav-send-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-fav-edit-tags-section {
                margin-bottom: 16px;
            }
            .acu-fav-edit-tags-section label {
                display: block;
                font-size: 12px;
                color: var(--acu-text-muted);
                margin-bottom: 6px;
            }
            .acu-fav-edit-tags-section input {
                width: 100%;
                padding: 8px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 13px;
            }
            .acu-fav-edit-rows {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 12px;
            }
            .acu-fav-edit-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .acu-fav-edit-header {
                flex: 0 0 120px;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-accent);
                font-size: 12px;
                font-weight: 600;
            }
            .acu-fav-edit-value {
                flex: 1;
                padding: 8px 10px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 12px;
            }
            .acu-fav-edit-remove {
                width: 28px;
                height: 28px;
                background: transparent;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-muted);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-remove:hover {
                color: #e74c3c;
                border-color: #e74c3c;
            }
            .acu-fav-edit-add-col {
                padding: 8px 12px;
                background: var(--acu-btn-bg);
                border: 1px dashed var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }
            .acu-fav-edit-add-col:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }
            .acu-fav-edit-modal-footer,
            .acu-fav-new-modal-footer,
            .acu-fav-send-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-edit-cancel,
            .acu-fav-new-cancel,
            .acu-fav-send-cancel {
                padding: 8px 16px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
            }
            .acu-fav-edit-save,
            .acu-fav-new-create {
                padding: 8px 16px;
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                border-radius: 6px;
                color: var(--acu-btn-active-text);
                cursor: pointer;
            }
            .acu-fav-edit-save:hover,
            .acu-fav-new-create:hover {
                opacity: 0.9;
            }

            /* 发送选择弹窗 */
            .acu-fav-send-option {
                padding: 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .acu-fav-send-option:hover {
                border-color: var(--acu-accent);
                background: var(--acu-btn-hover);
            }
            .acu-fav-send-option-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 4px;
            }
            .acu-fav-send-option-mode {
                font-size: 12px;
            }
            .acu-fav-send-unmatched {
                font-size: 11px;
                color: var(--acu-text-muted);
                margin-top: 4px;
            }

            /* 新建模板选择 */
            .acu-fav-new-modal-body label {
                display: block;
                font-size: 13px;
                color: var(--acu-text-main);
                margin-bottom: 10px;
            }
            .acu-fav-new-modal-body select {
                width: 100%;
                padding: 10px 12px;
                background: var(--acu-bg-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .acu-favorites-panel {
                    width: 95%;
                    max-height: 90vh;
                }
                .acu-favorites-group-cards {
                    grid-template-columns: 1fr;
                }
                .acu-favorites-header-actions {
                    flex-wrap: wrap;
                }
                .acu-fav-header-btn span {
                    display: none;
                }
            }

            /* ========== 收藏夹面板样式 (新增) ========== */
            /* [修复] 收藏夹外层容器必须限制高度和溢出，防止卡片超出面板范围 */
            .acu-fav-wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
                max-height: 100%;
                overflow: hidden;
            }
            .acu-fav-panel-content {
                padding: 12px;
                overflow-y: auto;
                overflow-x: auto;
                flex: 1;
                min-height: 0; /* 关键：允许 flex 子元素收缩 */
                /* 滚动条样式 - Firefox */
                scrollbar-width: thin;
                scrollbar-color: var(--acu-btn-bg) var(--acu-bg-nav);
                overscroll-behavior: contain;
            }
            /* 收藏夹面板滚动条 - Webkit (Chrome/Safari/Edge) */
            .acu-fav-panel-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-track {
                background: var(--acu-bg-nav);
                border-radius: 4px;
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb {
                background: var(--acu-btn-bg);
                border-radius: 4px;
                border: 2px solid var(--acu-bg-nav);
            }
            .acu-fav-panel-content::-webkit-scrollbar-thumb:hover {
                background: var(--acu-btn-hover);
            }
            .acu-fav-panel-content::-webkit-scrollbar-corner {
                background: var(--acu-bg-nav);
            }
            /* [已废弃] 工具栏已移至Header，保留样式以防回退 */
            /*
            .acu-fav-toolbar {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            */
            .acu-fav-select,
            .acu-fav-input {
                padding: 6px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }
            .acu-fav-select {
                min-width: 120px;
            }
            .acu-fav-input {
                flex: 1;
                min-width: 150px;
            }
            .acu-fav-toolbar-btn {
                padding: 6px 10px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                font-size: 12px;
            }
            .acu-fav-toolbar-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-grid {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .acu-fav-group-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--acu-accent);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .acu-fav-group-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            /* 收藏夹卡片 - 复用 acu-data-card 宽度，保持与普通表格一致 */
            .acu-fav-card {
                flex: 0 0 var(--acu-card-width, 260px);
                width: var(--acu-card-width, 260px);
                cursor: pointer;
            }
            .acu-fav-card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 6px 12px 8px;
                border-top: 1px dashed var(--acu-border);
            }
            .acu-fav-tag {
                padding: 2px 6px;
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-radius: 8px;
                font-size: 10px;
            }
            /* [已废弃] 操作按钮已改为单击菜单，保留样式以防回退 */
            /*
            .acu-fav-card-actions {
                display: flex;
                justify-content: flex-end;
                gap: 4px;
                padding: 8px 12px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-action-btn {
                width: 28px;
                height: 28px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
            }
            .acu-fav-action-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }
            .acu-fav-delete:hover {
                color: #e74c3c;
            }
            */
            .acu-fav-empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--acu-text-muted);
            }
            .acu-fav-empty i {
                font-size: 36px;
                opacity: 0.3;
                margin-bottom: 12px;
            }
            .acu-fav-empty p {
                margin: 4px 0;
            }

            /* 编辑弹窗 - 保留弹窗形式，添加移动端适配 */
            .acu-fav-edit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 31300;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-modal {
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            @media (max-width: 768px) {
                .acu-fav-edit-modal {
                    position: fixed !important;
                    top: 5% !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 92vw !important;
                    max-height: 88vh !important;
                }
                .acu-fav-edit-overlay {
                    align-items: flex-start !important;
                    padding-top: 5vh !important;
                }
                .acu-fav-group-cards {
                    grid-template-columns: 1fr !important;
                }
            }
            /* 编辑弹窗输入框样式覆盖 */
            .acu-fav-edit-modal input {
                padding: 8px 10px !important;
                background: var(--acu-bg-panel) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                height: auto !important;
                box-shadow: none !important;
            }

    /* Cleaned up Inline Styles */
    #dice-custom-input { width: 60px; }
    #contest-custom-dice {
        width: 60px;
        flex: 0 0 auto;
    }
    
    .acu-mvu-dice-icon {
        cursor: pointer;
        color: var(--acu-accent);
        opacity: 0.6;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        flex-shrink: 0;
    }
    
    .acu-mvu-level-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        transition: all 0.2s;
        background: transparent;
        color: var(--acu-text-sub);
        opacity: 0.5;
    }
    .acu-mvu-level-toggle.active {
        background: var(--acu-accent);
        color: var(--acu-btn-active-text);
        border-color: var(--acu-accent);
        opacity: 1;
    }
    
    .acu-mvu-header {
        padding: 6px 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    }
    
    .acu-mvu-body {
        padding: 8px;
        background: var(--acu-table-head);
        border-bottom: 1px solid var(--acu-border);
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
    }
    
    .acu-mvu-item {
        display: flex;
        align-items: center;
        padding: 6px 8px;
        margin-bottom: 4px;
        background: var(--acu-table-hover);
        border-radius: 4px;
        border-left: 3px solid var(--acu-accent);
    }
    
    .acu-mvu-path {
        font-size: calc(var(--acu-font-size, 13px) * 0.77);
        color: var(--acu-text-sub);
        margin-bottom: 2px;
    }
    
    .acu-mvu-val {
        font-size: var(--acu-font-size, 13px);
        color: var(--acu-accent);
        font-weight: bold;
        cursor: pointer;
    }
    
    .acu-mvu-list {
        padding: 0 8px;
    }

    .acu-mvu-toggle-icon {
        font-size: 10px;
        color: var(--acu-text-sub);
        transition: transform 0.2s;
    }
    .acu-mvu-header-text {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-mvu-item-content {
        flex: 1;
        min-width: 0;
    }
    .acu-mvu-item-row {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .acu-mvu-attr-name {
        font-size: calc(var(--acu-font-size, 13px) * 0.92);
        color: var(--acu-text-main);
        font-weight: bold;
    }
    .acu-order-first {
        order: -1;
    }
    .acu-text-sub-small {
        font-size: calc(var(--acu-font-size, 13px) * 0.85);
        color: var(--acu-text-sub);
    }
    .acu-ml-6 {
        margin-left: 6px;
    }

    /* Graph & Node Size Controls */
    .acu-graph-filter-btn {
        padding: 4px 6px;
        font-size: 12px;
    }
    .acu-graph-filter-btn.ml-8 {
        margin-left: 8px;
    }
    .acu-node-size-slider-container {
        position: absolute;
        display: none;
        width: 200px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10;
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
    }
    .acu-slider-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }
    .acu-range-input {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        background: var(--acu-input-bg);
        margin: 0;
    }
    .acu-range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--acu-accent);
        cursor: pointer;
        margin-top: -4px; /* Adjust for track height if needed, usually 0 or negative for center */
    }
    .acu-range-input::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        background: var(--acu-input-bg);
        border-radius: 4px;
    }
    .acu-graph-reset-btn {
        width: auto;
        height: auto;
        padding: 4px 10px;
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .acu-node-size-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    .acu-stepper-container {
        display: flex;
        align-items: center;
    }
    .acu-stepper-value-display {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .acu-zoom-info {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--acu-text-sub);
        font-size: 11px;
    }
`;
