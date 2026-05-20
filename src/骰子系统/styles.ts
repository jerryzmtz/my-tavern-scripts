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
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-edit-overlay,
    .acu-edit-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-cell-menu,
    .acu-cell-menu *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dice-panel,
    .acu-dice-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-contest-panel,
    .acu-contest-panel *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-relation-graph-overlay,
    .acu-relation-graph-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-avatar-manager-overlay,
    .acu-avatar-manager-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-preview-overlay,
    .acu-preview-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-gacha-overlay,
    .acu-gacha-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-overlay,
    .acu-inventory-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-config-backup-overlay,
    .acu-config-backup-overlay *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-embedded-options-container,
    .acu-embedded-options-container *:not(i[class*="fa-"]):not(i[class*="ti-"]),
    .acu-dialogue-indent-root,
    .acu-dialogue-indent-root *:not(i[class*="fa-"]):not(i[class*="ti-"]) {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
    }
    /* ========== 基础样式 ========== */
    .acu-wrapper.acu-dice-ui-root,
    .acu-edit-overlay,
    .acu-dice-panel,
    .acu-contest-panel,
    .acu-relation-graph-overlay,
    .acu-avatar-manager-overlay,
    .acu-preview-overlay,
    .acu-gacha-overlay,
    .acu-inventory-overlay,
    .acu-inventory-detail-overlay,
    .acu-import-confirm-overlay,
    .acu-config-backup-overlay,
    .acu-embedded-options-container,
    .acu-dialogue-indent-root,
    .acu-cell-menu {
        font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        font-size: 13px;
        line-height: 1.5;
        color: var(--acu-text-main);
        --acu-motion-fast: 160ms;
        --acu-motion-normal: 220ms;
        --acu-ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --acu-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
        --acu-focus-ring: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 34%, transparent);
        --acu-disabled-opacity: 0.48;
        --acu-state-warning-border: color-mix(in srgb, var(--acu-warning-icon) 58%, var(--acu-border));
        --acu-state-error-border: color-mix(in srgb, var(--acu-error-text) 58%, var(--acu-border));
        --acu-state-accent-border: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
    }

    .mes.acu-host-regenerate-hidden .swipeRightBlock,
    .mes.acu-host-regenerate-hidden .swipe_right {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }

    /* ========== 正文头像渲染 ========== */
    .acu-dialogue-indent-root {
        width: 100%;
        max-width: 100%;
        color: var(--acu-text-main);
        line-height: 1.68;
        overflow-wrap: anywhere;
        word-break: normal;
    }

    .acu-dialogue-indent-root > :first-child {
        margin-top: 0;
    }

    .acu-dialogue-indent-root > :last-child {
        margin-bottom: 0;
    }

    .acu-dialogue-aside {
        --acu-dialogue-character-color: var(--acu-accent);
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        column-gap: 12px;
        align-items: start;
        max-width: 100%;
        margin: 0.82em 0;
    }

    .acu-dialogue-aside.is-continuation {
        margin-top: -0.16em;
    }

    .acu-dialogue-avatar,
    .acu-dialogue-avatar-spacer {
        width: 48px;
        min-width: 48px;
    }

    .acu-dialogue-avatar {
        aspect-ratio: 1;
        border-radius: 6px;
        background-image: var(--acu-dialogue-avatar-image, none);
        background-size: var(--acu-dialogue-avatar-scale, 150%);
        background-position: var(--acu-dialogue-avatar-x, 50%) var(--acu-dialogue-avatar-y, 50%);
        background-repeat: no-repeat;
        background-color: var(--acu-table-head);
        border: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 34%, var(--acu-border));
        box-shadow:
            0 1px 0 color-mix(in srgb, var(--acu-card-bg) 78%, transparent),
            inset 0 0 0 1px color-mix(in srgb, var(--acu-dialogue-character-color) 18%, transparent);
        overflow: hidden;
        position: relative;
    }

    .acu-dialogue-body {
        min-width: 0;
        max-width: 100%;
    }

    .acu-dialogue-speaker {
        margin: 0 0 0.16em;
        color: var(--acu-text-main);
        font-size: 0.94em;
        font-weight: 650;
        line-height: 1.35;
        letter-spacing: 0;
    }

    .acu-dialogue-speaker-initial {
        display: inline-block;
        margin-right: 1px;
        color: var(--acu-dialogue-character-color);
        font-size: 1.28em;
        font-weight: 800;
        line-height: 0.9;
        letter-spacing: 0;
        vertical-align: -0.04em;
    }

    .acu-dialogue-quote {
        min-width: 0;
        padding-left: 12px;
        border-left: 1px solid color-mix(in srgb, var(--acu-dialogue-character-color) 46%, var(--acu-border));
        color: var(--acu-text-main);
        line-height: 1.72;
    }

    .acu-dialogue-aside.is-continuation .acu-dialogue-quote {
        border-left-color: color-mix(in srgb, var(--acu-dialogue-character-color) 24%, var(--acu-border));
    }

    @media (max-width: 600px) {
        .acu-dialogue-indent-root {
            line-height: 1.62;
        }

        .acu-dialogue-aside {
            grid-template-columns: 40px minmax(0, 1fr);
            column-gap: 9px;
            margin: 0.72em 0;
        }

        .acu-dialogue-avatar,
        .acu-dialogue-avatar-spacer {
            width: 38px;
            min-width: 38px;
        }

        .acu-dialogue-quote {
            padding-left: 10px;
            line-height: 1.66;
        }
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
        color: var(--acu-input-text, var(--acu-text-main)) !important;
        font-size: 12px;
        height: 30px;
        line-height: 1;
        box-sizing: border-box;
    }
    /* select 需要额外处理以匹配 input 尺寸 */
    .acu-dice-panel select,
    .acu-contest-panel select,
    .acu-dice-config-dialog select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 0 6px;
        margin: 0;
        text-align-last: center;
        display: block;
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
        color: var(--acu-input-placeholder, var(--acu-text-sub)) !important;
        opacity: 0.7;
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
    /* 搜索框样式 */
    .acu-wrapper.acu-dice-ui-root .acu-search-input {
        background-color: var(--acu-input-bg) !important;
        color: var(--acu-text-main) !important;
        border: 1px solid var(--acu-border);
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input:focus {
        outline: none;
        border-color: var(--acu-accent);
        box-shadow: none !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-search-input::placeholder {
        color: var(--acu-text-sub) !important;
        opacity: 0.7;
    }
    /* ========== 通用组件基类 ========== */
    /* 按钮基类 */
    .acu-wrapper.acu-dice-ui-root button,
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
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard),
            transform var(--acu-motion-fast) var(--acu-ease-out);
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root button:hover,
    .acu-edit-overlay button:hover,
    .acu-dice-panel button:hover,
    .acu-contest-panel button:hover,
    .acu-relation-graph-overlay button:hover,
    .acu-avatar-manager-overlay button:hover,
    .acu-preview-overlay button:hover,
    .acu-embedded-options-container button:not(.acu-opt-btn):hover {
        background: var(--acu-btn-hover);
    }
    .acu-wrapper.acu-dice-ui-root button:focus,
    .acu-edit-overlay button:focus,
    .acu-dice-panel button:focus,
    .acu-contest-panel button:focus,
    .acu-relation-graph-overlay button:focus,
    .acu-avatar-manager-overlay button:focus,
    .acu-preview-overlay button:focus,
    .acu-embedded-options-container button:not(.acu-opt-btn):focus {
        outline: none;
        box-shadow: var(--acu-focus-ring);
    }
    .acu-wrapper.acu-dice-ui-root button:disabled,
    .acu-edit-overlay button:disabled,
    .acu-dice-panel button:disabled,
    .acu-contest-panel button:disabled,
    .acu-relation-graph-overlay button:disabled,
    .acu-avatar-manager-overlay button:disabled,
    .acu-preview-overlay button:disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn):disabled,
    .acu-wrapper.acu-dice-ui-root button.disabled,
    .acu-edit-overlay button.disabled,
    .acu-dice-panel button.disabled,
    .acu-contest-panel button.disabled,
    .acu-relation-graph-overlay button.disabled,
    .acu-avatar-manager-overlay button.disabled,
    .acu-preview-overlay button.disabled,
    .acu-embedded-options-container button:not(.acu-opt-btn).disabled {
        opacity: var(--acu-disabled-opacity);
        cursor: not-allowed;
        pointer-events: none;
    }

    /* 输入框基类 */
    .acu-wrapper.acu-dice-ui-root input,
    .acu-wrapper.acu-dice-ui-root textarea,
    .acu-wrapper.acu-dice-ui-root select,
    .acu-edit-overlay input,
    .acu-edit-overlay textarea,
    .acu-edit-overlay select,
    .acu-dice-panel input,
    .acu-dice-panel select,
    .acu-contest-panel input,
    .acu-contest-panel select,
    .acu-avatar-manager-overlay input.acu-input {
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
    .acu-wrapper.acu-dice-ui-root input:focus,
    .acu-wrapper.acu-dice-ui-root textarea:focus,
    .acu-wrapper.acu-dice-ui-root select:focus,
    .acu-edit-overlay input:focus,
    .acu-edit-overlay textarea:focus,
    .acu-edit-overlay select:focus,
    .acu-dice-panel input:focus,
    .acu-dice-panel select:focus,
    .acu-contest-panel input:focus,
    .acu-contest-panel select:focus,
    .acu-avatar-manager-overlay input.acu-input:focus {
        border-color: var(--acu-accent);
        box-shadow: none;
        outline: none;
    }
    .acu-wrapper.acu-dice-ui-root input::placeholder,
    .acu-wrapper.acu-dice-ui-root textarea::placeholder,
    .acu-dice-panel input::placeholder,
    .acu-contest-panel input::placeholder,
    .acu-avatar-manager-overlay input.acu-input::placeholder {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }

    .acu-inline-callout {
        padding: 10px 12px;
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        line-height: 1.5;
        font-size: 12px;
    }
    .acu-inline-callout-warning {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-state-warning-border);
    }
    .acu-inline-callout i {
        margin-right: 6px;
    }

    /* 确保重要人物表（卡片）和 MVU 面板中的输入框始终有高对比度 */
    .acu-wrapper.acu-dice-ui-root .acu-data-card input,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea,
    .acu-preview-overlay .acu-data-card input,
    .acu-preview-overlay .acu-data-card textarea,
    .acu-mvu-panel input,
    .acu-mvu-panel textarea {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        background-color: var(--SillyTavern-bar-color, #0b0b0b) !important;
    }
    .acu-wrapper.acu-dice-ui-root .acu-data-card input::placeholder,
    .acu-wrapper.acu-dice-ui-root .acu-data-card textarea::placeholder,
    .acu-preview-overlay .acu-data-card input::placeholder,
    .acu-preview-overlay .acu-data-card textarea::placeholder,
    .acu-mvu-panel input::placeholder,
    .acu-mvu-panel textarea::placeholder {
        color: var(--SillyTavern-text-color, #e0e0e0) !important;
        opacity: 0.7 !important;
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
        height: 100dvh;
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
        height: 100dvh;
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
        border: 1px solid transparent;
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 14px;
        width: 28px;
        height: 28px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-panel-actions button:hover,
    .acu-dice-panel-actions button:focus-visible {
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
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
    /* 预设快捷按钮区 */
    .acu-dice-quick-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
        align-items: center;
        max-height: 72px; /* 约两行高度: (28px + 8px) * 2 */
        overflow-y: auto;
        overflow-x: hidden;
    }

    .acu-dice-return-btn {
        width: 100%;
        padding: 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-accent);
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-return-btn:hover,
    .acu-dice-return-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-return-btn i {
        font-size: 14px;
    }
    .acu-dice-quick-preset-btn {
        padding: 2px 8px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-main);
        font-size: 10px;
        cursor: pointer;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1.4;
        user-select: none;
    }
    .acu-dice-quick-preset-btn:hover:not(.active),
    .acu-dice-quick-preset-btn:focus-visible:not(.active) {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-quick-preset-btn.active,
    .acu-dice-quick-preset-btn.active:hover {
        background: var(--acu-accent);
        color: var(--acu-button-text-on-accent, #fff);
        border-color: var(--acu-accent);
        font-weight: 500;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-accent) 70%, transparent);
    }
    .acu-dice-quick-preset-btn.active:hover,
    .acu-dice-quick-preset-btn.active:focus-visible {
        box-shadow: var(--acu-focus-ring);
        outline: none;
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
    .acu-dice-preset-quick-actions {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 6px;
    }
    .acu-dice-preset-action-btn {
        width: 20px;
        height: 20px;
        padding: 0;
        border-radius: 4px;
        border: 1px solid var(--acu-border);
        background: var(--acu-btn-bg);
        color: var(--acu-accent);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-preset-action-btn:hover,
    .acu-dice-preset-action-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-dice-preset-action-btn i {
        font-size: 10px;
    }
    .acu-dice-preset-action-btn.disabled {
        opacity: 0.6;
        cursor: default;
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
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
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
        .acu-wrapper.acu-dice-ui-root button,
        .acu-wrapper.acu-dice-ui-root button[class],
        .acu-edit-overlay button,
        .acu-edit-overlay button[class],
        .acu-dice-panel button,
        .acu-dice-panel button[class],
        .acu-contest-panel button,
        .acu-contest-panel button[class],
        .acu-preview-overlay button,
        .acu-preview-overlay button[class],
        .acu-gacha-overlay button,
        .acu-gacha-overlay button[class],
        .acu-inventory-overlay button,
        .acu-inventory-overlay button[class],
        .acu-inventory-detail-overlay button,
        .acu-inventory-detail-overlay button[class],
        .acu-import-confirm-overlay button,
        .acu-import-confirm-overlay button[class],
        .acu-embedded-options-container button,
        .acu-embedded-options-container button[class] {
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
    .acu-contest-panel .acu-contest-clear-attr-btn:hover,
    .acu-dice-panel .acu-dice-char-btn:focus-visible,
    .acu-contest-panel .acu-dice-char-btn:focus-visible,
    .acu-dice-panel .acu-dice-attr-btn:focus-visible,
    .acu-contest-panel .acu-dice-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-gen-attr-btn:focus-visible,
    .acu-dice-panel .acu-dice-clear-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-gen-attr-btn:focus-visible,
    .acu-contest-panel .acu-contest-clear-attr-btn:focus-visible {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        box-shadow: var(--acu-focus-ring);
        outline: none;
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
        border: 1px solid var(--acu-accent);
        border-radius: 8px;
        color: var(--acu-button-text-on-accent, var(--acu-btn-active-text));
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-dice-roll-btn:hover,
    .acu-dice-roll-btn:focus-visible {
        background: var(--acu-btn-active-bg, var(--acu-accent));
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent));
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }
    .acu-random-skill-btn {
        width: 18px;
        height: 18px;
        padding: 0;
        background: transparent;
        border: 1px solid var(--acu-border);
        border-radius: 4px;
        color: var(--acu-accent);
        font-size: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }
    .acu-random-skill-btn:hover,
    .acu-random-skill-btn:focus-visible {
        background: var(--acu-btn-hover);
        box-shadow: var(--acu-focus-ring);
        outline: none;
    }

    .acu-dice-history-dialog { max-width: 600px; width: min(94vw, 600px); max-height: 82vh; display: flex; flex-direction: column; padding: 14px; }
    .acu-dice-history-header,
    .acu-history-main,
    .acu-history-title-row,
    .acu-history-meta,
    .acu-history-side,
    .acu-history-footer,
    .acu-history-stats-summary,
    .acu-history-stats-values { display: flex; }
    .acu-dice-history-header { justify-content: space-between; align-items: center; gap: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
    .acu-dice-history-header h3 { margin: 0; font-size: 19px; color: var(--acu-text-main); font-weight: 700; display: flex; align-items: center; gap: 8px; min-width: 0; }
    .acu-dice-history-header h3 i { color: var(--acu-accent); }
    .acu-dice-history-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
    .acu-dice-history-filters { --acu-history-filter-height: 40px; display: grid; grid-template-columns: minmax(92px, 0.75fr) minmax(104px, 0.85fr) minmax(120px, 1.4fr); gap: 6px; margin-top: 8px; align-items: stretch; }
    .acu-history-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .acu-dice-history-filters select,
    .acu-dice-history-filters input { width: 100%; min-width: 0; }
    .acu-dice-history-dialog .acu-dice-history-filters select.acu-dice-select,
    .acu-dice-history-search,
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { height: var(--acu-history-filter-height) !important; }
    .acu-dice-history-search { position: relative; min-width: 0; }
    .acu-dice-history-search i { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--acu-text-sub); pointer-events: none; }
    .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input { padding-left: 30px !important; }
    .acu-dice-history-stats { margin-top: 6px; padding: 8px; border: 1px solid var(--acu-border); border-radius: 8px; background: var(--acu-card-bg); }
    .acu-history-stats-grid { margin-bottom: 6px; }
    .acu-history-stat-card { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: 1px solid var(--acu-border); border-radius: 6px; min-width: 0; }
    .acu-history-stat-card small { display: block; font-size: 11px; line-height: 1.2; color: var(--acu-text-sub); white-space: nowrap; }
    .acu-history-stat-card strong { display: block; font-size: 16px; line-height: 1.1; font-weight: 700; color: var(--acu-text-main); }
    .acu-history-stats-summary { justify-content: space-between; align-items: center; gap: 6px 10px; flex-wrap: wrap; font-size: 12px; line-height: 1.35; }
    .acu-history-stats-summary > span,
    .acu-history-scope-note,
    .acu-history-roll,
    .acu-history-time { color: var(--acu-text-sub); }
    .acu-history-stats-summary > span { flex: 0 0 auto; }
    .acu-history-stats-values { gap: 10px; flex-wrap: wrap; min-width: 0; }
    .acu-history-stats-values span { color: var(--acu-text-main); }
    .acu-history-stats-values b.is-success { color: var(--acu-success-text); }
    .acu-history-scope-note { margin-top: 6px; font-size: 11px; }
    .acu-dice-history-list { margin-top: 8px; overflow-y: auto; flex: 1; min-height: 220px; max-height: 52vh; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; touch-action: pan-y; }
    .acu-history-item { padding: 10px 12px; border: 1px solid var(--acu-border); border-radius: 8px; margin-bottom: 8px; background: var(--acu-bg-panel); }
    .acu-history-main { justify-content: space-between; align-items: flex-start; gap: 8px; }
    .acu-history-primary { min-width: 0; flex: 1; }
    .acu-history-title-row { align-items: center; gap: 6px; min-width: 0; }
    .acu-history-tag,
    .acu-history-status { border: 1px solid var(--acu-border); border-radius: 999px; padding: 1px 7px; font-size: 11px; }
    .acu-history-tag { color: var(--acu-text-sub); flex-shrink: 0; font-size: 10px; }
    .acu-history-title { font-weight: 700; color: var(--acu-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    .acu-history-pushed-icon { font-size: 10px; color: var(--acu-text-sub); margin-left: 4px; }
    .acu-history-meta { margin-top: 6px; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
    .acu-history-result { color: var(--acu-history-result-color, var(--acu-text-main)); font-weight: 700; }
    .acu-history-roll,
    .acu-history-detail { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .acu-history-status { color: var(--acu-history-status-color, var(--acu-text-sub)); border-color: color-mix(in srgb, var(--acu-history-status-color, var(--acu-text-sub)) 40%, transparent); }
    .acu-history-side { align-items: center; gap: 5px; flex-shrink: 0; }
    .acu-history-time { font-size: 12px; }
    .acu-history-icon-btn { border: 1px solid transparent; background: transparent; color: var(--acu-text-sub); border-radius: 6px; cursor: pointer; width: 24px; height: 24px; padding: 0; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
    .acu-history-detail-copy { background: var(--acu-btn-bg); border-color: var(--acu-border); }
    .acu-history-icon-btn:hover,
    .acu-history-icon-btn:focus-visible { background: var(--acu-btn-hover); color: var(--acu-accent); border-color: var(--acu-border); box-shadow: var(--acu-focus-ring); outline: none; }
    .acu-history-detail { margin-top: 8px; padding: 9px 10px; background: color-mix(in srgb, var(--acu-card-bg) 72%, transparent); border: 1px solid var(--acu-border); border-radius: 6px; font-size: 11px; line-height: 1.5; color: var(--acu-text-sub); white-space: pre-wrap; }
    .acu-history-detail strong { display: block; font-weight: 700; color: var(--acu-text-main); margin-bottom: 4px; }
    .acu-history-detail hr { border: 0; border-top: 1px solid var(--acu-border); margin: 7px 0; }
    .acu-history-footer { justify-content: space-between; gap: 8px; padding-top: 10px; border-top: 1px solid var(--acu-border); margin-top: 8px; flex-wrap: wrap; }
    @media (max-width: 640px) {
        .acu-dice-history-dialog {
            width: calc(100vw - 20px);
            max-height: calc(100dvh - 24px);
            padding: 12px;
        }
        .acu-dice-history-header h3 {
            font-size: 16px;
        }
        .acu-dice-history-filters {
            --acu-history-filter-height: 34px;
            grid-template-columns: minmax(78px, 0.75fr) minmax(88px, 0.85fr) minmax(86px, 1fr);
            gap: 6px;
            margin-top: 8px;
        }
        .acu-dice-history-filters select,
        .acu-dice-history-filters input {
            font-size: 12px;
        }
        .acu-dice-history-search i {
            left: 9px;
        }
        .acu-dice-history-dialog .acu-dice-history-search input.acu-dice-input {
            padding-left: 27px !important;
        }
        .acu-history-stat-card {
            padding: 5px 6px;
            gap: 4px;
        }
        .acu-history-stat-card small {
            font-size: 10px;
        }
        .acu-history-stat-card strong {
            font-size: 15px;
        }
        .acu-history-stats-summary {
            align-items: stretch;
            font-size: 11px;
        }
        .acu-history-stats-summary > span {
            width: 100%;
        }
        .acu-history-stats-values {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            width: 100%;
            gap: 4px;
        }
        .acu-history-stats-values span {
            min-width: 0;
            white-space: nowrap;
        }
        .acu-history-main {
            flex-direction: column;
        }
        .acu-history-side {
            width: 100%;
            justify-content: space-between;
        }
        .acu-history-footer {
            justify-content: stretch;
        }
        .acu-history-footer .acu-dialog-btn {
            flex: 1;
        }
    }
    @media (max-width: 360px) {
        .acu-history-stats-values {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
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
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .acu-close-btn:hover {
        background: none !important;
        color: var(--acu-accent);
    }

    /* 滚动条默认隐藏仅限骰子前端自身，避免影响数据库本体 */
    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *,
    .acu-edit-overlay,
    .acu-edit-overlay *,
    .acu-dice-panel,
    .acu-dice-panel *,
    .acu-contest-panel,
    .acu-contest-panel *,
    .acu-preview-overlay,
    .acu-preview-overlay *,
    .acu-gacha-overlay,
    .acu-gacha-overlay *,
    .acu-inventory-overlay,
    .acu-inventory-overlay *,
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *,
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *,
    .acu-embedded-options-container,
    .acu-embedded-options-container * {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .acu-wrapper.acu-dice-ui-root *::-webkit-scrollbar,
    .acu-edit-overlay *::-webkit-scrollbar,
    .acu-dice-panel *::-webkit-scrollbar,
    .acu-contest-panel *::-webkit-scrollbar,
    .acu-preview-overlay *::-webkit-scrollbar,
    .acu-gacha-overlay *::-webkit-scrollbar,
    .acu-inventory-overlay *::-webkit-scrollbar,
    .acu-inventory-detail-overlay *::-webkit-scrollbar,
    .acu-import-confirm-overlay *::-webkit-scrollbar,
    .acu-embedded-options-container *::-webkit-scrollbar {
        display: none !important;
    }

    /* ========== 主题变量定义 ========== */
    /* 主题维护提示：这里是骰子系统主题色源头。修改或新增 .acu-theme-* 时，
       需要同步检查 外部参考/数据库主题/acu-db-theme-dice-<theme-id>.json 的变量映射和 previewColors。
       渐变主题在数据库主题变量里要保留纯色兜底，渐变只放到支持 background-image 的位置。 */
    .acu-theme-native {
        --acu-native-blur-bg: rgb(from var(--SmartThemeBlurTintColor, #191919) r g b / 1);
        --acu-native-chat-bg: rgb(from var(--SmartThemeChatTintColor, #191919) r g b / 1);
        --acu-native-bot-bg: rgb(from var(--SmartThemeBotMesBlurTintColor, #303030) r g b / 1);
        --acu-native-user-bg: rgb(from var(--SmartThemeUserMesBlurTintColor, #383838) r g b / 1);
        --acu-bg-nav: var(--acu-native-blur-bg);
        --acu-bg-panel: var(--acu-native-blur-bg);
        --acu-bg-main: var(--acu-native-chat-bg);
        --acu-bg-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-border: var(--SmartThemeBorderColor, rgba(128,128,128,0.35));
        --acu-text-main: var(--SmartThemeBodyColor, #ddd);
        --acu-text-sub: var(--SmartThemeEmColor, var(--SmartThemeQuoteColor, #aaa));
        --acu-btn-bg: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-btn-hover: color-mix(in srgb, var(--acu-native-user-bg) 82%, var(--acu-text-main) 18%);
        --acu-btn-active-bg: var(--SmartThemeQuoteColor, var(--SmartThemeBodyColor, #8ad));
        --acu-btn-active-text: rgb(from var(--SmartThemeChatTintColor, #111) r g b / 1);
        --acu-accent: var(--SmartThemeQuoteColor, var(--SmartThemeBodyColor, #8ad));
        --acu-accent-rgb: 128,128,128;
        --acu-table-head: color-mix(in srgb, var(--acu-native-blur-bg) 94%, var(--acu-text-main) 6%);
        --acu-table-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-opt-hover: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-opt-bg: color-mix(in srgb, var(--acu-native-chat-bg) 92%, var(--acu-text-main) 8%);
        --acu-shadow: var(--SmartThemeShadowColor, rgba(0,0,0,0.35));
        --acu-card-bg: var(--acu-native-chat-bg);
        --acu-badge-bg: color-mix(in srgb, var(--acu-native-bot-bg) 88%, var(--acu-text-main) 12%);
        --acu-menu-bg: var(--acu-native-blur-bg);
        --acu-menu-text: var(--SmartThemeBodyColor, #ddd);
        --acu-success-text: #4cd964;
        --acu-success-bg: rgba(76,217,100,0.18);
        --acu-scrollbar-track: var(--acu-native-chat-bg);
        --acu-scrollbar-thumb: var(--SmartThemeBorderColor, rgba(128,128,128,0.45));
        --acu-input-bg: color-mix(in srgb, var(--acu-native-chat-bg) 94%, var(--acu-text-main) 6%);
        --acu-hl-manual: var(--SmartThemeQuoteColor, #f0ad4e);
        --acu-hl-manual-bg: rgba(240,173,78,0.16);
        --acu-hl-diff: var(--SmartThemeEmColor, #5bc0de);
        --acu-hl-diff-bg: rgba(91,192,222,0.16);
        --acu-error-text: #ff6b6b;
        --acu-error-bg: rgba(255,107,107,0.18);
        --acu-error-border: rgba(255,107,107,0.45);
        --acu-warning-icon: #ffa726;
        --acu-warning-text: #ffa726;
        --acu-warning-bg: rgba(255,167,38,0.18);
        --acu-overlay-bg: var(--acu-native-blur-bg);
        --acu-overlay-bg-light: var(--acu-native-blur-bg);
        --acu-shadow-bg: rgba(0,0,0,0.4);
        --acu-light-bg: rgba(255,255,255,0.06);
        --acu-very-light-bg: rgba(255,255,255,0.025);
        --acu-button-text: var(--SmartThemeBodyColor, #ddd);
        --acu-gray-bg: rgba(128,128,128,0.12);
        --acu-button-text-on-accent: rgb(from var(--SmartThemeChatTintColor, #111) r g b / 1);
    }
    .acu-theme-native.acu-edit-overlay,
    .acu-theme-native.acu-dice-overlay,
    .acu-theme-native.acu-contest-overlay,
    .acu-theme-native.acu-dice-config-overlay,
    .acu-theme-native.acu-avatar-manager-overlay,
    .acu-theme-native.acu-preview-overlay,
    .acu-theme-native.acu-import-confirm-overlay,
    .acu-theme-native.acu-crop-modal-overlay,
    .acu-theme-native.acu-relation-graph-overlay,
    .acu-theme-native.acu-map-overlay,
    .acu-theme-native.acu-delete-confirm-overlay,
    .acu-theme-native.acu-favorites-overlay,
    .acu-theme-native.acu-fav-edit-overlay,
    .acu-theme-native.acu-fav-new-overlay,
    .acu-theme-native.acu-fav-send-overlay,
    .acu-theme-native.acu-fav-tag-overlay,
    .acu-theme-native.acu-inventory-overlay,
    .acu-theme-native.acu-gacha-overlay,
    .acu-theme-native.acu-gacha-shard-confirm-overlay,
    .acu-theme-native.acu-inventory-detail-overlay,
    .acu-dice-overlay:has(.acu-theme-native),
    .acu-contest-overlay:has(.acu-theme-native),
    .acu-dice-config-overlay:has(.acu-theme-native),
    .acu-favorites-overlay:has(.acu-theme-native),
    .acu-fav-edit-overlay:has(.acu-theme-native),
    .acu-fav-new-overlay:has(.acu-theme-native),
    .acu-fav-send-overlay:has(.acu-theme-native),
    .acu-fav-tag-overlay:has(.acu-theme-native),
    .acu-theme-native .acu-options-panel {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        filter: none !important;
    }
    .acu-theme-native.acu-edit-dialog,
    .acu-theme-native .acu-edit-dialog,
    .acu-theme-native.acu-dice-panel,
    .acu-theme-native .acu-dice-panel,
    .acu-theme-native.acu-contest-panel,
    .acu-theme-native .acu-contest-panel,
    .acu-theme-native.acu-dice-config-dialog,
    .acu-theme-native .acu-dice-config-dialog,
    .acu-theme-native .acu-data-display,
    .acu-theme-native .acu-options-panel,
    .acu-theme-native .acu-option-panel,
    .acu-theme-native .acu-embedded-options-container,
    .acu-theme-native .acu-inventory-shell,
    .acu-theme-native .acu-inventory-detail,
    .acu-theme-native .acu-gacha-shell,
    .acu-preview-overlay:has(.acu-theme-native) .acu-data-card,
    .acu-wrapper.acu-dice-ui-root.acu-theme-native .acu-data-card {
        background: var(--acu-bg-panel) !important;
        background-color: var(--acu-bg-panel) !important;
    }
    .acu-theme-native .acu-data-card,
    .acu-theme-native.acu-data-card,
    .acu-theme-native .acu-cell-menu {
        background: var(--acu-card-bg) !important;
        background-color: var(--acu-card-bg) !important;
    }
    .acu-theme-retro { --acu-bg-nav: #e6e2d3; --acu-bg-panel: #e6e2d3; --acu-border: #dcd0c0; --acu-text-main: #5e4b35; --acu-text-sub: #999; --acu-btn-bg: #dcd0c0; --acu-btn-hover: #cbbba8; --acu-btn-active-bg: #8d7b6f; --acu-btn-active-text: #fdfaf5; --acu-accent: #7a695f; --acu-table-head: #efebe4; --acu-table-hover: #f0ebe0; --acu-opt-hover: #f7f3ed; --acu-opt-bg: #fffef9; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #fffef9; --acu-badge-bg: #efebe4; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #27ae60; --acu-success-bg: rgba(39, 174, 96, 0.15); --acu-scrollbar-track: #e6e2d3; --acu-scrollbar-thumb: #cbbba8; --acu-input-bg: #f5f2eb;--acu-hl-manual: #d35400; --acu-hl-manual-bg: rgba(211, 84, 0, 0.15); --acu-hl-diff: #2980b9; --acu-hl-diff-bg: rgba(41, 128, 185, 0.15); --acu-error-text: #e74c3c; --acu-error-bg: rgba(231, 76, 60, 0.15); --acu-error-border: rgba(231, 76, 60, 0.5); --acu-warning-icon: #e67e22; --acu-warning-text: #f39c12; --acu-warning-bg: rgba(243, 156, 18, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #5e4b35; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-dark { --acu-bg-nav: #2b2b2b; --acu-bg-panel: #252525; --acu-border: #444; --acu-text-main: #eee; --acu-text-sub: #aaa; --acu-btn-bg: #3a3a3a; --acu-btn-hover: #4a4a4a; --acu-btn-active-bg: #6a5acd; --acu-btn-active-text: #fff; --acu-accent: #9b8cd9; --acu-table-head: #333333; --acu-table-hover: #3a3a3a; --acu-opt-hover: rgba(255, 255, 255, 0.1); --acu-opt-bg: rgba(255, 255, 255, 0.05); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #2d3035; --acu-badge-bg: #3a3f4b; --acu-menu-bg: #333; --acu-menu-text: #eee; --acu-success-text: #4cd964; --acu-success-bg: rgba(76, 217, 100, 0.2); --acu-scrollbar-track: #2b2b2b; --acu-scrollbar-thumb: #555; --acu-hl-manual: #ff6b81; --acu-hl-manual-bg: rgba(255, 107, 129, 0.2); --acu-hl-diff: #00d2d3; --acu-hl-diff-bg: rgba(0, 210, 211, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.75); --acu-overlay-bg-light: rgba(0,0,0,0.65); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,255,0.05); --acu-very-light-bg: rgba(255,255,255,0.02); --acu-button-text: #fff; --acu-gray-bg: rgba(255,255,255,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-modern { --acu-bg-nav: #ffffff; --acu-bg-panel: #f8f9fa; --acu-border: #e0e0e0; --acu-text-main: #333; --acu-text-sub: #666; --acu-btn-bg: #f1f3f5; --acu-btn-hover: #e9ecef; --acu-btn-active-bg: #007bff; --acu-btn-active-text: #fff; --acu-accent: #007bff; --acu-table-head: #f8f9fa; --acu-table-hover: #f1f3f5; --acu-opt-hover: #f1f3f5; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #f1f3f5; --acu-menu-bg: #fff; --acu-menu-text: #333; --acu-success-text: #28a745; --acu-success-bg: rgba(40, 167, 69, 0.15); --acu-scrollbar-track: #fff; --acu-scrollbar-thumb: #ccc; --acu-hl-manual: #fd7e14; --acu-hl-manual-bg: rgba(253, 126, 20, 0.15); --acu-hl-diff: #0d6efd; --acu-hl-diff-bg: rgba(13, 110, 253, 0.15); --acu-error-text: #dc3545; --acu-error-bg: rgba(220, 53, 69, 0.15); --acu-error-border: rgba(220, 53, 69, 0.5); --acu-warning-icon: #fd7e14; --acu-warning-text: #ffc107; --acu-warning-bg: rgba(255, 193, 7, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #333; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-forest { --acu-bg-nav: #e8f5e9; --acu-bg-panel: #e8f5e9; --acu-border: #c8e6c9; --acu-text-main: #2e7d32; --acu-text-sub: #81c784; --acu-btn-bg: #c8e6c9; --acu-btn-hover: #a5d6a7; --acu-btn-active-bg: #43a047; --acu-btn-active-text: #fff; --acu-accent: #4caf50; --acu-table-head: #dcedc8; --acu-table-hover: #f1f8e9; --acu-opt-hover: #f1f8e9; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #dcedc8; --acu-menu-bg: #fff; --acu-menu-text: #2e7d32; --acu-success-text: #2e7d32; --acu-success-bg: rgba(46, 125, 50, 0.2); --acu-scrollbar-track: #e8f5e9; --acu-scrollbar-thumb: #a5d6a7; --acu-hl-manual: #e67e22; --acu-hl-manual-bg: rgba(230, 126, 34, 0.15); --acu-hl-diff: #1e8449; --acu-hl-diff-bg: rgba(30, 132, 73, 0.2); --acu-error-text: #c0392b; --acu-error-bg: rgba(192, 57, 43, 0.15); --acu-error-border: rgba(192, 57, 43, 0.5); --acu-warning-icon: #e67e22; --acu-warning-text: #e67e22; --acu-warning-bg: rgba(230, 126, 34, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(76, 175, 80, 0.1); --acu-very-light-bg: rgba(76, 175, 80, 0.02); --acu-button-text: #2e7d32; --acu-gray-bg: rgba(76, 175, 80, 0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-ocean { --acu-bg-nav: #e3f2fd; --acu-bg-panel: #e3f2fd; --acu-border: #90caf9; --acu-text-main: #1565c0; --acu-text-sub: #64b5f6; --acu-btn-bg: #bbdefb; --acu-btn-hover: #90caf9; --acu-btn-active-bg: #1976d2; --acu-btn-active-text: #fff; --acu-accent: #2196f3; --acu-table-head: #bbdefb; --acu-table-hover: #e1f5fe; --acu-opt-hover: #e1f5fe; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #e3f2fd; --acu-menu-bg: #fff; --acu-menu-text: #1565c0; --acu-success-text: #0288d1; --acu-success-bg: rgba(2, 136, 209, 0.15); --acu-scrollbar-track: #e3f2fd; --acu-scrollbar-thumb: #90caf9; --acu-hl-manual: #ff4757; --acu-hl-manual-bg: rgba(255, 71, 87, 0.15); --acu-hl-diff: #0277bd; --acu-hl-diff-bg: rgba(2, 119, 189, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(0,0,0,0.1); --acu-very-light-bg: rgba(0,0,0,0.02); --acu-button-text: #1565c0; --acu-gray-bg: rgba(128,128,128,0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-cyber { --acu-bg-nav: #000000; --acu-bg-panel: #0a0a0a; --acu-border: #333; --acu-text-main: #00ffcc; --acu-text-sub: #ff00ff; --acu-btn-bg: #111; --acu-btn-hover: #222; --acu-btn-active-bg: #ff00ff; --acu-btn-active-text: #000; --acu-accent: #00ffcc; --acu-table-head: #050505; --acu-table-hover: #111; --acu-opt-hover: rgba(0, 255, 204, 0.15); --acu-opt-bg: rgba(0, 255, 204, 0.08); --acu-shadow: 0 0 15px rgba(0,255,204,0.15); --acu-card-bg: #050505; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #111; --acu-menu-text: #00ffcc; --acu-success-text: #0f0; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #000; --acu-scrollbar-thumb: #333; --acu-hl-manual: #ff9f43; --acu-hl-manual-bg: rgba(255, 159, 67, 0.2); --acu-hl-diff: #0abde3; --acu-hl-diff-bg: rgba(10, 189, 227, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.85); --acu-overlay-bg-light: rgba(0,0,0,0.75); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(0, 255, 204, 0.08); --acu-very-light-bg: rgba(0, 255, 204, 0.02); --acu-button-text-on-accent: #000; --acu-input-text: #ff00ff; --acu-input-placeholder: #ff00ff; }
    .acu-theme-cyber .acu-nav-btn { border-color: #222; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-cyber .acu-data-card,
    .acu-preview-overlay.acu-theme-cyber .acu-data-card { border-color: #222; }
    .acu-theme-nightowl { --acu-bg-nav: #0a2133; --acu-bg-panel: #011627; --acu-border: #132e45; --acu-text-main: #e0e6f2; --acu-text-sub: #a6b8cc; --acu-btn-bg: #1f3a52; --acu-btn-hover: #2a4a68; --acu-btn-active-bg: #7fdbca; --acu-btn-active-text: #011627; --acu-accent: #7fdbca; --acu-table-head: #0a2133; --acu-table-hover: #01294a; --acu-opt-hover: rgba(127, 219, 202, 0.15); --acu-opt-bg: rgba(127, 219, 202, 0.08); --acu-shadow: rgba(0,0,0,0.5); --acu-card-bg: #0a2133; --acu-badge-bg: #1f3a52; --acu-menu-bg: #011627; --acu-menu-text: #e0e6f2; --acu-success-text: #addb67; --acu-success-bg: rgba(173, 219, 103, 0.15); --acu-scrollbar-track: #011627; --acu-scrollbar-thumb: #1f3a52; --acu-hl-manual: #ff8f66; --acu-hl-manual-bg: rgba(255, 143, 102, 0.2); --acu-hl-diff: #82aaff; --acu-hl-diff-bg: rgba(130, 170, 255, 0.2); --acu-error-text: #ef5350; --acu-error-bg: rgba(239, 83, 80, 0.2); --acu-error-border: rgba(239, 83, 80, 0.5); --acu-warning-icon: #ffcb6b; --acu-warning-text: #ffcb6b; --acu-warning-bg: rgba(255, 203, 107, 0.2); --acu-overlay-bg: rgba(1, 22, 39, 0.85); --acu-overlay-bg-light: rgba(1, 22, 39, 0.75); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(127, 219, 202, 0.08); --acu-very-light-bg: rgba(127, 219, 202, 0.02); --acu-button-text: #e0e6f2; --acu-gray-bg: rgba(127, 219, 202, 0.08); --acu-button-text-on-accent: #011627; }
    .acu-theme-sakura { --acu-bg-nav: #F9F0EF; --acu-bg-panel: #F9F0EF; --acu-border: #EBDCD9; --acu-text-main: #6B5552; --acu-text-sub: #C08D8D; --acu-btn-bg: #EBDCD9; --acu-btn-hover: #D8C7C4; --acu-btn-active-bg: #C08D8D; --acu-btn-active-text: #F9F0EF; --acu-accent: #C08D8D; --acu-table-head: #F9F0EF; --acu-table-hover: #F5EAE8; --acu-opt-hover: #F5EAE8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #F9F0EF; --acu-menu-bg: #fff; --acu-menu-text: #6B5552; --acu-success-text: #6B5552; --acu-success-bg: rgba(192, 141, 141, 0.12); --acu-scrollbar-track: #F9F0EF; --acu-scrollbar-thumb: #EBDCD9; --acu-hl-manual: #A68A7A; --acu-hl-manual-bg: rgba(166, 138, 122, 0.12); --acu-hl-diff: #9B7A7A; --acu-hl-diff-bg: rgba(155, 122, 122, 0.2); --acu-error-text: #9B7A7A; --acu-error-bg: rgba(155, 122, 122, 0.12); --acu-error-border: rgba(155, 122, 122, 0.4); --acu-warning-icon: #A68A7A; --acu-warning-text: #A68A7A; --acu-warning-bg: rgba(166, 138, 122, 0.12); --acu-overlay-bg: rgba(107, 85, 82, 0.6); --acu-overlay-bg-light: rgba(107, 85, 82, 0.5); --acu-shadow-bg: rgba(107, 85, 82, 0.3); --acu-light-bg: rgba(192, 141, 141, 0.08); --acu-very-light-bg: rgba(192, 141, 141, 0.02); --acu-button-text: #6B5552; --acu-gray-bg: rgba(192, 141, 141, 0.08); --acu-button-text-on-accent: #F9F0EF; }
    .acu-theme-minepink { --acu-bg-nav: #1a1a1a; --acu-bg-panel: #1a1a1a; --acu-border: #333333; --acu-text-main: #ffb3d9; --acu-text-sub: #ff80c1; --acu-btn-bg: #2a2a2a; --acu-btn-hover: #3a3a3a; --acu-btn-active-bg: #ff80c1; --acu-btn-active-text: #1a1a1a; --acu-accent: #ff80c1; --acu-table-head: #252525; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 128, 193, 0.15); --acu-opt-bg: rgba(255, 128, 193, 0.08); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #222222; --acu-badge-bg: #2a2a2a; --acu-menu-bg: #1a1a1a; --acu-menu-text: #ffb3d9; --acu-success-text: #ff80c1; --acu-success-bg: rgba(255, 128, 193, 0.2); --acu-scrollbar-track: #1a1a1a; --acu-scrollbar-thumb: #333333; --acu-hl-manual: #ffa726; --acu-hl-manual-bg: rgba(255, 167, 38, 0.2); --acu-hl-diff: #ff80c1; --acu-hl-diff-bg: rgba(255, 128, 193, 0.2); --acu-error-text: #ff6b6b; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #ffa726; --acu-warning-text: #ffa726; --acu-warning-bg: rgba(255, 167, 38, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 128, 193, 0.1); --acu-very-light-bg: rgba(255, 128, 193, 0.02); --acu-button-text: #1a1a1a; --acu-gray-bg: rgba(255, 128, 193, 0.1); --acu-button-text-on-accent: #1a1a1a; }
    .acu-theme-purple { --acu-bg-nav: #f3e5f5; --acu-bg-panel: #f3e5f5; --acu-border: #ce93d8; --acu-text-main: #6a1b9a; --acu-text-sub: #9c27b0; --acu-btn-bg: #e1bee7; --acu-btn-hover: #ce93d8; --acu-btn-active-bg: #9c27b0; --acu-btn-active-text: #fff; --acu-accent: #9c27b0; --acu-table-head: #f8e1f5; --acu-table-hover: #fce4ec; --acu-opt-hover: #fce4ec; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.15); --acu-card-bg: #ffffff; --acu-badge-bg: #f8e1f5; --acu-menu-bg: #fff; --acu-menu-text: #6a1b9a; --acu-success-text: #6a1b9a; --acu-success-bg: rgba(106, 27, 154, 0.15); --acu-scrollbar-track: #f3e5f5; --acu-scrollbar-thumb: #ce93d8; --acu-hl-manual: #f57c00; --acu-hl-manual-bg: rgba(245, 124, 0, 0.15); --acu-hl-diff: #6a1b9a; --acu-hl-diff-bg: rgba(106, 27, 154, 0.2); --acu-error-text: #d32f2f; --acu-error-bg: rgba(211, 47, 47, 0.15); --acu-error-border: rgba(211, 47, 47, 0.5); --acu-warning-icon: #f57c00; --acu-warning-text: #f57c00; --acu-warning-bg: rgba(245, 124, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.4); --acu-light-bg: rgba(156, 39, 176, 0.1); --acu-very-light-bg: rgba(156, 39, 176, 0.02); --acu-button-text: #6a1b9a; --acu-gray-bg: rgba(156, 39, 176, 0.1); --acu-button-text-on-accent: #fff; }
    .acu-theme-wechat { --acu-bg-nav: #F7F7F7; --acu-bg-panel: #F7F7F7; --acu-border: #E5E5E5; --acu-text-main: #333333; --acu-text-sub: #666666; --acu-btn-bg: #E5E5E5; --acu-btn-hover: #D5D5D5; --acu-btn-active-bg: #09B83E; --acu-btn-active-text: #FFFFFF; --acu-accent: #09B83E; --acu-table-head: #F0F0F0; --acu-table-hover: #EBEBEB; --acu-opt-hover: #EBEBEB; --acu-opt-bg: #ffffff; --acu-shadow: rgba(0,0,0,0.1); --acu-card-bg: #ffffff; --acu-badge-bg: #F0F0F0; --acu-menu-bg: #fff; --acu-menu-text: #333333; --acu-success-text: #09B83E; --acu-success-bg: rgba(9, 184, 62, 0.12); --acu-scrollbar-track: #F7F7F7; --acu-scrollbar-thumb: #E5E5E5; --acu-hl-manual: #FF9500; --acu-hl-manual-bg: rgba(255, 149, 0, 0.12); --acu-hl-diff: #09B83E; --acu-hl-diff-bg: rgba(9, 184, 62, 0.2); --acu-error-text: #E53E3E; --acu-error-bg: rgba(229, 62, 62, 0.12); --acu-error-border: rgba(229, 62, 62, 0.5); --acu-warning-icon: #FF9500; --acu-warning-text: #FF9500; --acu-warning-bg: rgba(255, 149, 0, 0.12); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(0,0,0,0.2); --acu-light-bg: rgba(9, 184, 62, 0.08); --acu-very-light-bg: rgba(9, 184, 62, 0.02); --acu-button-text: #333333; --acu-gray-bg: rgba(9, 184, 62, 0.08); --acu-button-text-on-accent: #fff; }
    .acu-theme-educational { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #1B1B1B; --acu-text-main: #FFFFFF; --acu-text-sub: #CCCCCC; --acu-btn-bg: #1B1B1B; --acu-btn-hover: #2B2B2B; --acu-btn-active-bg: #FF9900; --acu-btn-active-text: #000000; --acu-accent: #FF9900; --acu-table-head: #1B1B1B; --acu-table-hover: #2B2B2B; --acu-opt-hover: rgba(255, 153, 0, 0.18); --acu-opt-bg: rgba(255, 153, 0, 0.1); --acu-shadow: rgba(0,0,0,0.6); --acu-card-bg: #1B1B1B; --acu-badge-bg: #1B1B1B; --acu-menu-bg: #000000; --acu-menu-text: #FFFFFF; --acu-success-text: #FF9900; --acu-success-bg: rgba(255, 153, 0, 0.15); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #1B1B1B; --acu-input-bg: #1B1B1B; --acu-hl-manual: #FF9900; --acu-hl-manual-bg: rgba(255, 153, 0, 0.15); --acu-hl-diff: #FFB84D; --acu-hl-diff-bg: rgba(255, 184, 77, 0.2); --acu-error-text: #FF6B6B; --acu-error-bg: rgba(255, 107, 107, 0.2); --acu-error-border: rgba(255, 107, 107, 0.5); --acu-warning-icon: #FFAA00; --acu-warning-text: #FFAA00; --acu-warning-bg: rgba(255, 170, 0, 0.2); --acu-overlay-bg: rgba(0,0,0,0.8); --acu-overlay-bg-light: rgba(0,0,0,0.7); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255, 153, 0, 0.1); --acu-very-light-bg: rgba(255, 153, 0, 0.02); --acu-button-text: #FFFFFF; --acu-gray-bg: rgba(255, 255, 255, 0.1); --acu-button-text-on-accent: #000; }
    .acu-theme-vaporwave { --acu-bg-nav: #191970; --acu-bg-panel: #191970; --acu-border: rgba(0, 255, 255, 0.3); --acu-text-main: #00FFFF; --acu-text-sub: #FF00FF; --acu-btn-bg: rgba(25, 25, 112, 0.8); --acu-btn-hover: rgba(0, 255, 255, 0.2); --acu-btn-active-bg: #FF00FF; --acu-btn-active-text: #191970; --acu-accent: #00FFFF; --acu-table-head: rgba(25, 25, 112, 0.9); --acu-table-hover: rgba(0, 255, 255, 0.1); --acu-opt-hover: rgba(0, 255, 255, 0.18); --acu-opt-bg: rgba(0, 255, 255, 0.1); --acu-shadow: 0 0 15px rgba(0, 255, 255, 0.3); --acu-card-bg: rgba(25, 25, 112, 0.95); --acu-badge-bg: rgba(25, 25, 112, 0.8); --acu-menu-bg: #191970; --acu-menu-text: #00FFFF; --acu-success-text: #00FFFF; --acu-success-bg: rgba(0, 255, 255, 0.15); --acu-scrollbar-track: #191970; --acu-scrollbar-thumb: rgba(0, 255, 255, 0.3); --acu-input-bg: rgba(25, 25, 112, 0.6); --acu-hl-manual: #00FFFF; --acu-hl-manual-bg: rgba(0, 255, 255, 0.2); --acu-hl-diff: #FF00FF; --acu-hl-diff-bg: rgba(255, 0, 255, 0.2); --acu-error-text: #FF00FF; --acu-error-bg: rgba(255, 0, 255, 0.2); --acu-error-border: rgba(255, 0, 255, 0.5); --acu-warning-icon: #FF00FF; --acu-warning-text: #FF00FF; --acu-warning-bg: rgba(255, 0, 255, 0.15); --acu-overlay-bg: rgba(25, 25, 112, 0.85); --acu-overlay-bg-light: rgba(25, 25, 112, 0.75); --acu-shadow-bg: rgba(0, 255, 255, 0.3); --acu-light-bg: rgba(0, 255, 255, 0.05); --acu-very-light-bg: rgba(0, 255, 255, 0.02); --acu-button-text: #F0F8FF; --acu-gray-bg: rgba(0, 255, 255, 0.1); --acu-button-text-on-accent: #191970; --acu-input-text: #00FFFF; --acu-input-placeholder: #FF00FF; }
    .acu-theme-vaporwave .acu-nav-btn { border-color: rgba(0, 255, 255, 0.3); }
    .acu-wrapper.acu-dice-ui-root.acu-theme-vaporwave .acu-data-card,
    .acu-preview-overlay.acu-theme-vaporwave .acu-data-card { border-color: rgba(0, 255, 255, 0.3); }
    .acu-theme-classicpackaging { --acu-bg-nav: #000000; --acu-bg-panel: #000000; --acu-border: #FFFF00; --acu-text-main: #FFFF00; --acu-text-sub: #CCCC00; --acu-btn-bg: #FF0000; --acu-btn-hover: #CC0000; --acu-btn-active-bg: #0000FF; --acu-btn-active-text: #FFFF00; --acu-accent: #FF0000; --acu-table-head: #1a1a1a; --acu-table-hover: #2a2a2a; --acu-opt-hover: rgba(255, 255, 0, 0.15); --acu-opt-bg: rgba(255, 255, 0, 0.08); --acu-shadow: rgba(255,255,0,0.3); --acu-card-bg: #1a1a1a; --acu-badge-bg: #FF0000; --acu-menu-bg: #000000; --acu-menu-text: #FFFF00; --acu-success-text: #0000FF; --acu-success-bg: rgba(0, 0, 255, 0.2); --acu-scrollbar-track: #000000; --acu-scrollbar-thumb: #FFFF00; --acu-input-bg: #1a1a1a; --acu-hl-manual: #FF0000; --acu-hl-manual-bg: rgba(255, 0, 0, 0.2); --acu-hl-diff: #0000FF; --acu-hl-diff-bg: rgba(0, 0, 255, 0.2); --acu-error-text: #FF0000; --acu-error-bg: rgba(255, 0, 0, 0.2); --acu-error-border: rgba(255, 0, 0, 0.8); --acu-warning-icon: #FF0000; --acu-warning-text: #FF0000; --acu-warning-bg: rgba(255, 0, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.6); --acu-light-bg: rgba(255,255,0,0.1); --acu-very-light-bg: rgba(255,255,0,0.02); --acu-button-text: #FFFF00; --acu-gray-bg: rgba(255,255,0,0.1); --acu-button-text-on-accent: #FFFF00; --acu-input-text: #FFFF00; --acu-input-placeholder: #666600; }
    .acu-theme-classicpackaging .acu-nav-btn { border-color: #FFFF00; border-width: 2px; font-weight: bold; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-classicpackaging .acu-data-card,
    .acu-preview-overlay.acu-theme-classicpackaging .acu-data-card { border-color: #FFFF00; border-width: 2px; }
    .acu-theme-galgame { --acu-bg-nav: #FFF0F5; --acu-bg-panel: #FFF0F5; --acu-border: #F0D4E4; --acu-text-main: #6B4A5A; --acu-text-sub: #B08A9A; --acu-btn-bg: #FFE4E9; --acu-btn-hover: #FFD4E4; --acu-btn-active-bg: #E8B4D9; --acu-btn-active-text: #6B4A5A; --acu-accent: #E8B4D9; --acu-table-head: #FFF5F9; --acu-table-hover: #FFF0F8; --acu-opt-hover: #FFF0F8; --acu-opt-bg: #ffffff; --acu-shadow: rgba(232, 180, 217, 0.25); --acu-card-bg: #ffffff; --acu-badge-bg: #FFF5F9; --acu-menu-bg: #fff; --acu-menu-text: #6B4A5A; --acu-success-text: #D4A5C8; --acu-success-bg: rgba(212, 165, 200, 0.15); --acu-scrollbar-track: #FFF0F5; --acu-scrollbar-thumb: #F0D4E4; --acu-input-bg: #FFF8FA; --acu-hl-manual: #D4A5A5; --acu-hl-manual-bg: rgba(212, 165, 165, 0.15); --acu-hl-diff: #E8B4D9; --acu-hl-diff-bg: rgba(232, 180, 217, 0.2); --acu-error-text: #C88A9A; --acu-error-bg: rgba(200, 138, 154, 0.15); --acu-error-border: rgba(200, 138, 154, 0.4); --acu-warning-icon: #D4A5A5; --acu-warning-text: #D4A5A5; --acu-warning-bg: rgba(212, 165, 165, 0.15); --acu-overlay-bg: rgba(0,0,0,0.6); --acu-overlay-bg-light: rgba(0,0,0,0.5); --acu-shadow-bg: rgba(232, 180, 217, 0.25); --acu-light-bg: rgba(232, 180, 217, 0.08); --acu-very-light-bg: rgba(232, 180, 217, 0.02); --acu-button-text: #6B4A5A; --acu-button-text-on-accent: #6B4A5A; --acu-gray-bg: rgba(232, 180, 217, 0.1); }
    .acu-theme-galgame .acu-nav-btn { border-radius: 8px; transition: all 0.3s ease; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-galgame .acu-data-card,
    .acu-preview-overlay.acu-theme-galgame .acu-data-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(232, 180, 217, 0.15); transition: all 0.3s ease; }
    .acu-wrapper.acu-dice-ui-root.acu-theme-galgame .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-galgame .acu-data-card:hover { box-shadow: 0 6px 20px rgba(232, 180, 217, 0.25); transform: translateY(-2px); }
    .acu-theme-galgame .acu-nav-btn:hover { box-shadow: 0 2px 8px rgba(232, 180, 217, 0.2); }
    .acu-theme-terminal { --acu-bg-nav: #0c0c0c; --acu-bg-panel: #0c0c0c; --acu-border: #00ff00; --acu-text-main: #00ff00; --acu-text-sub: #00cc00; --acu-btn-bg: #1a1a1a; --acu-btn-hover: #2a2a2a; --acu-btn-active-bg: #00ff00; --acu-btn-active-text: #0c0c0c; --acu-accent: #00ff00; --acu-table-head: #0a0a0a; --acu-table-hover: #1a1a1a; --acu-opt-hover: rgba(0, 255, 0, 0.12); --acu-opt-bg: rgba(0, 255, 0, 0.06); --acu-shadow: rgba(0,255,0,0.2); --acu-card-bg: #0c0c0c; --acu-badge-bg: #1a1a1a; --acu-menu-bg: #0c0c0c; --acu-menu-text: #00ff00; --acu-success-text: #00ff00; --acu-success-bg: rgba(0, 255, 0, 0.15); --acu-scrollbar-track: #0c0c0c; --acu-scrollbar-thumb: #00ff00; --acu-input-bg: #0c0c0c; --acu-hl-manual: #ffff00; --acu-hl-manual-bg: rgba(255, 255, 0, 0.15); --acu-hl-diff: #00ffff; --acu-hl-diff-bg: rgba(0, 255, 255, 0.15); --acu-error-text: #ff0000; --acu-error-bg: rgba(255, 0, 0, 0.15); --acu-error-border: rgba(255, 0, 0, 0.5); --acu-warning-icon: #ffff00; --acu-warning-text: #ffff00; --acu-warning-bg: rgba(255, 255, 0, 0.15); --acu-overlay-bg: rgba(0,0,0,0.9); --acu-overlay-bg-light: rgba(0,0,0,0.8); --acu-shadow-bg: rgba(0,0,0,0.7); --acu-light-bg: rgba(0,255,0,0.05); --acu-very-light-bg: rgba(0,255,0,0.02); --acu-button-text: #0c0c0c; --acu-gray-bg: rgba(0,255,0,0.05); --acu-button-text-on-accent: #0c0c0c; font-family: 'Courier New', 'Consolas', 'Monaco', monospace; --acu-input-text: #00ff00; --acu-input-placeholder: #008800; }
    .acu-theme-terminal .acu-nav-btn { border-color: #00ff00; text-shadow: 0 0 5px rgba(0,255,0,0.5); }
    .acu-wrapper.acu-dice-ui-root.acu-theme-terminal .acu-data-card,
    .acu-preview-overlay.acu-theme-terminal .acu-data-card { border-color: #00ff00; text-shadow: 0 0 2px rgba(0,255,0,0.3); }
    .acu-theme-dreamcore { --acu-bg-nav: #F4F1EA; --acu-bg-panel: #F4F1EA; --acu-border: #D6D2C4; --acu-text-main: #5C5869; --acu-text-sub: #9490A0; --acu-btn-bg: #E6E1D5; --acu-btn-hover: #DBD8CC; --acu-btn-active-bg: #8A9AC6; --acu-btn-active-text: #FFFFFF; --acu-accent: #8A9AC6; --acu-table-head: #EBE7DE; --acu-table-hover: #F8F6F0; --acu-opt-hover: #F8F6F0; --acu-opt-bg: #FFFFFF; --acu-shadow: rgba(92, 88, 105, 0.15); --acu-card-bg: #FFFFFF; --acu-badge-bg: #EBE7DE; --acu-menu-bg: #FCFAF5; --acu-menu-text: #5C5869; --acu-success-text: #4A7A68; --acu-success-bg: rgba(74, 122, 104, 0.18); --acu-scrollbar-track: #F4F1EA; --acu-scrollbar-thumb: #D6D2C4; --acu-input-bg: #FFFFFF; --acu-hl-manual: #8A7040; --acu-hl-manual-bg: rgba(138, 112, 64, 0.18); --acu-hl-diff: #8A9AC6; --acu-hl-diff-bg: rgba(138, 154, 198, 0.18); --acu-error-text: #B85C5C; --acu-error-bg: rgba(184, 92, 92, 0.15); --acu-error-border: rgba(184, 92, 92, 0.4); --acu-warning-icon: #E0C080; --acu-warning-text: #8A7040; --acu-warning-bg: rgba(138, 112, 64, 0.18); --acu-overlay-bg: rgba(244, 241, 234, 0.85); --acu-overlay-bg-light: rgba(255, 255, 255, 0.4); --acu-shadow-bg: rgba(92, 88, 105, 0.15); --acu-light-bg: rgba(138, 154, 198, 0.08); --acu-very-light-bg: rgba(138, 154, 198, 0.03); --acu-button-text: #5C5869; --acu-gray-bg: rgba(92, 88, 105, 0.08); --acu-button-text-on-accent: #fff; }
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
       
       
        --acu-warning-text: #fbbf24;
        --acu-warning-bg: rgba(251, 191, 36, 0.2);
       
       
       
       
       
       
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
    .acu-wrapper.acu-dice-ui-root.acu-theme-aurora .acu-data-card,
    .acu-preview-overlay.acu-theme-aurora .acu-data-card { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 4px 20px rgba(56, 189, 248, 0.1), 0 2px 10px rgba(168, 85, 247, 0.08); }
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
    .acu-wrapper.acu-dice-ui-root.acu-theme-aurora .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-aurora .acu-data-card:hover {
        border-color: rgba(56, 189, 248, 0.5) !important;
        box-shadow: 0 8px 30px rgba(56, 189, 248, 0.15), 0 4px 15px rgba(168, 85, 247, 0.1);
        transform: translateY(-3px);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-dreamcore .acu-data-card,
    .acu-preview-overlay.acu-theme-dreamcore .acu-data-card { border-color: #D6D2C4; box-shadow: 0 2px 8px rgba(92, 88, 105, 0.1); }
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
       
       
        --acu-warning-text: #FFD93D;
        --acu-warning-bg: rgba(255, 217, 61, 0.2);
       
       
       
       
       
       
        --acu-overlay-bg: rgba(26, 10, 46, 0.95);
        --acu-overlay-bg-light: rgba(45, 27, 78, 0.85);
        --acu-shadow-bg: rgba(255, 107, 157, 0.3);
        --acu-light-bg: rgba(255, 107, 157, 0.1);
        --acu-very-light-bg: rgba(179, 136, 255, 0.05);
        --acu-button-text: #FFFFFF;
        --acu-button-text-on-accent: #1A0A2E;
        --acu-gray-bg: rgba(255, 255, 255, 0.05);
    }

    /* Badge 颜色从主题色自动推导，无需每个主题单独维护 */
    [class*="acu-theme-"] {
      --acu-failure-text: var(--acu-error-text);
      --acu-failure-bg: var(--acu-error-bg);
      --acu-crit-failure-text: var(--acu-error-text);
      --acu-crit-failure-bg: var(--acu-error-bg);
      --acu-crit-success-text: var(--acu-accent);
      --acu-crit-success-bg: var(--acu-success-bg);
      --acu-extreme-success-text: var(--acu-hl-diff);
      --acu-extreme-success-bg: var(--acu-hl-diff-bg);
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
        transition:
            background-color var(--acu-motion-normal) var(--acu-ease-standard),
            border-color var(--acu-motion-normal) var(--acu-ease-standard),
            color var(--acu-motion-normal) var(--acu-ease-standard),
            box-shadow var(--acu-motion-normal) var(--acu-ease-standard),
            transform var(--acu-motion-normal) var(--acu-ease-out);
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
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card {
        border: 1px solid rgba(179, 136, 255, 0.3) !important;
        background: linear-gradient(160deg, rgba(30, 15, 50, 0.85) 0%, rgba(20, 8, 40, 0.9) 100%) !important;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(179, 136, 255, 0.05);
        position: relative;
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card::after,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, #7FFFD4, transparent);
        opacity: 0.5;
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-data-card:hover,
    .acu-preview-overlay.acu-theme-chouten .acu-data-card:hover {
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
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten ::-webkit-scrollbar-thumb,
    .acu-preview-overlay.acu-theme-chouten ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #FF6B9D, #B388FF) !important;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten ::-webkit-scrollbar-track,
    .acu-preview-overlay.acu-theme-chouten ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    /* 超天酱：表格行 - 悬停高亮 */
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-card-row,
    .acu-preview-overlay.acu-theme-chouten .acu-card-row {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .acu-wrapper.acu-dice-ui-root.acu-theme-chouten .acu-card-row:hover,
    .acu-preview-overlay.acu-theme-chouten .acu-card-row:hover {
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
    .acu-wrapper.acu-dice-ui-root { position: relative; width: 100%; margin: 15px 0; z-index: 1000 !important; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column-reverse; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-pill,
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating { pointer-events: none !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-pill .acu-expand-trigger,
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating .acu-expand-trigger { pointer-events: auto !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-bar { pointer-events: auto !important; }
    .acu-wrapper.acu-dice-ui-root.acu-is-collapsed.acu-collapse-floating { position: fixed !important; right: auto !important; bottom: auto !important; width: 48px !important; max-width: 48px !important; height: 48px !important; margin: 0 !important; z-index: 1000 !important; display: block !important; visibility: visible !important; opacity: 1 !important; overflow: visible !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport { position: fixed !important; left: 0 !important; right: auto !important; bottom: max(8px, env(safe-area-inset-bottom)); width: 100% !important; max-width: 100% !important; margin: 0 !important; transform: none !important; z-index: 1000 !important; display: flex; flex-direction: column-reverse !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport .acu-nav-container { position: relative !important; z-index: 31020 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-viewport .acu-data-display { position: absolute !important; bottom: calc(100% + 10px) !important; left: 0 !important; right: 0 !important; width: 100% !important; max-height: min(80vh, var(--acu-viewport-panel-max-height, calc(100dvh - 96px))) !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded { position: relative !important; width: 100% !important; margin-top: 8px !important; z-index: 1000 !important; clear: both; display: flex; flex-direction: column-reverse !important; padding: 0; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container { position: relative !important; z-index: 31020 !important; border-radius: 0 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container::before { border-radius: 0 !important; }
    .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-data-display { position: absolute !important; bottom: 100% !important; left: 0 !important; right: 0 !important; width: 100% !important; box-shadow: 0 -10px 30px rgba(0,0,0,0.25) !important; border: 1px solid var(--acu-border); margin-bottom: 5px; z-index: 31010 !important; max-height: 70vh !important; overflow-y: auto !important; }
    .acu-nav-container { display: grid; grid-template-columns: repeat(var(--acu-grid-cols, 3), 1fr); gap: 5px; padding: 6px; background: var(--acu-bg-nav); border: 1px solid var(--acu-border); border-radius: 10px; align-items: center; box-shadow: 0 2px 6px var(--acu-shadow); position: relative; z-index: 31020 !important; }
    .acu-nav-items { display: contents; }
    .acu-nav-btn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 4px; padding: 4px 6px; border: 1px solid var(--acu-border); border-radius: 7px; background: var(--acu-btn-bg); color: var(--acu-text-main); font-weight: 600; font-size: var(--acu-nav-font-size, 13px); cursor: pointer; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); user-select: none; overflow: hidden; height: var(--acu-nav-button-size, 32px); }
    .acu-nav-btn span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; margin-top: 1px; }
    .acu-nav-btn:hover { background: var(--acu-btn-hover); border-color: var(--acu-accent); transform: translateY(-1px); }
    .acu-nav-btn:focus, .acu-nav-btn:focus-visible { outline: none; box-shadow: var(--acu-focus-ring) !important; }
    /* [新增] 移植功能样式 */
/* --- 1. 外层容器：防止误触边缘 --- */
.acu-height-control {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    cursor: ns-resize;
    padding: 0;
    border-radius: 6px;
    color: var(--acu-text-sub);
    border: 1px solid transparent;
    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard);
    /* 关键属性：禁止在此区域触发浏览器默认手势 */
    touch-action: none;
}

/* 交互反馈 */
.acu-height-control:hover, .acu-height-control.active {
    color: var(--acu-accent);
    background: var(--acu-table-hover);
    border-color: var(--acu-border);
}

/* --- 2. [加保险] 内部图标：这是事件绑定的主体，必须禁止触摸 --- */
.acu-height-drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: ns-resize;
    /* 双重保险：确保直接按在图标上也不会触发滚动 */
    touch-action: none;
}

            /* 视图切换样式 */
            .acu-view-btn { background: transparent !important; border: 1px solid transparent; color: var(--acu-text-main) !important; cursor: pointer; padding: 5px; margin-right: 2px; font-size: 14px; opacity: 0.7; border-radius: 6px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), opacity var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-view-btn:hover { opacity: 1; color: var(--acu-accent) !important; background: var(--acu-table-hover) !important; border-color: var(--acu-border); }
            .acu-view-btn.acu-reverse-btn.active, .acu-reverse-btn[data-reversed="true"] { color: var(--acu-accent) !important; opacity: 1; }
            /* Grid 视图 (双列) */
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid,
            .acu-preview-overlay .acu-card-body.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; }
            /* 修复版：强制 Grid 模式使用 Flex 布局并允许高度自适应 */
.acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-row,
.acu-preview-overlay .acu-card-body.view-grid .acu-card-row { display: flex; height: auto !important; min-height: fit-content; border: 1px solid var(--acu-border); border-radius: 6px; padding: 5px 7px; flex-direction: column !important; align-items: flex-start !important; background: rgba(0,0,0,0.02); box-sizing: border-box; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-row.acu-grid-span-full,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-row.acu-grid-span-full { grid-column: 1 / -1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-label,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-label { width: 100% !important; font-size: 0.85em; opacity: 0.8; margin-bottom: 2px; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body.view-grid .acu-card-value,
            .acu-preview-overlay .acu-card-body.view-grid .acu-card-value { width: 100% !important; }

            /* List 视图 (单列 - 原版增强) */
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active,
            .acu-nav-btn.active { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); box-shadow: 0 1px 4px var(--acu-shadow); outline: none; border-color: var(--acu-btn-active-bg); }
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:hover,
            .acu-nav-btn.active:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); transform: none; }
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:focus,
            .acu-wrapper.acu-dice-ui-root button.acu-nav-btn.active:focus-visible,
            .acu-nav-btn.active:focus, .acu-nav-btn.active:focus-visible { outline: none; box-shadow: var(--acu-focus-ring), 0 1px 4px var(--acu-shadow) !important; }
            .acu-nav-btn.has-validation-errors { border-color: rgba(231, 76, 60, 0.5); }
            .acu-nav-btn .acu-nav-warning-icon { color: var(--acu-error-text, #e74c3c); font-size: 10px; margin-left: 2px; }
            .acu-action-btn { flex: 1; height: var(--acu-nav-button-size, 32px); font-size: var(--acu-nav-icon-size, 14px); display: flex; align-items: center; justify-content: center; background: var(--acu-btn-bg); border-radius: 8px; color: var(--acu-text-sub); cursor: pointer; border: 1px solid var(--acu-border); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); margin: 0; }
            .acu-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); border-color: var(--acu-accent); transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .acu-action-btn:focus, .acu-action-btn:focus-visible { outline: none; box-shadow: var(--acu-focus-ring) !important; }
            #acu-btn-save-global { color: var(--acu-btn-active-bg); } #acu-btn-save-global:hover { background: var(--acu-btn-active-bg); color: var(--acu-btn-active-text); }

            .acu-data-display { position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; max-height: 80vh; height: auto; background: var(--acu-bg-panel); border: 1px solid var(--acu-border); border-radius: 8px; box-shadow: 0 8px 30px var(--acu-shadow); display: flex; flex-direction: column; z-index: 31002 !important; opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity var(--acu-motion-normal) var(--acu-ease-standard), transform var(--acu-motion-normal) var(--acu-ease-standard), visibility 0s linear var(--acu-motion-normal); pointer-events: none; }
            .acu-data-display.visible { opacity: 1; visibility: visible; transform: translateY(0); transition: opacity var(--acu-motion-normal) var(--acu-ease-standard), transform var(--acu-motion-normal) var(--acu-ease-standard), visibility 0s linear 0s; pointer-events: auto; }
            @keyframes popUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes highlightFlash { 0%, 100% { box-shadow: none; } 50% { box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.6); } }
            .acu-highlight-flash { animation: highlightFlash 0.5s ease-in-out 3; }

            .acu-panel-header { flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 14px; background: var(--acu-table-head); border-bottom: 1px solid var(--acu-border); border-radius: 8px 8px 0 0; }
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
.acu-header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
            .acu-search-wrapper { position: relative; display: flex; align-items: center; }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input { background: var(--acu-btn-bg) !important; border: 1px solid var(--acu-border) !important; color: var(--acu-text-main) !important; padding: 4px 8px 4px 24px; border-radius: 12px; font-size: 12px; width: 120px; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            .acu-wrapper.acu-dice-ui-root input.acu-search-input:focus { width: 160px; outline: none !important; border-color: var(--acu-accent) !important; box-shadow: none !important; }
            .acu-search-input::placeholder { color: var(--acu-text-sub) ; opacity: 0.7; }
            .acu-search-icon { position: absolute; left: 8px; font-size: 10px; color: var(--acu-text-sub); pointer-events: none; }
            .acu-empty-state { min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--acu-text-sub); text-align: center; padding: 24px; }
            .acu-empty-state i { font-size: 20px; opacity: 0.7; }
            .acu-empty-state span { font-size: 12px; }
            /* 普通横向表格由卡片自己纵向滚动；手动高度模式才把面板高度传给卡片 */
            .acu-wrapper.acu-dice-ui-root .acu-panel-content { flex: 1; min-height: 0; overflow-x: auto; overflow-y: hidden; padding: 15px; background: transparent; scrollbar-width: thin; scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track); overscroll-behavior-x: contain; overscroll-behavior-y: contain; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; }
            .acu-wrapper.acu-dice-ui-root .acu-card-grid { display: flex; flex-wrap: nowrap; gap: 12px; align-items: flex-start; }
            .acu-wrapper.acu-dice-ui-root:not(.acu-layout-vertical) .acu-manual-mode .acu-panel-content > .acu-card-grid { height: 100%; min-height: 0; }
            .acu-wrapper.acu-dice-ui-root:not(.acu-layout-vertical) .acu-manual-mode .acu-panel-content > .acu-card-grid > .acu-data-card { max-height: 100% !important; min-height: 0; overflow-y: auto; }
            .acu-wrapper.acu-dice-ui-root.acu-layout-vertical .acu-panel-content { overflow-x: hidden !important; overflow-y: auto !important; overscroll-behavior: auto; touch-action: manipulation; min-height: 0; }
            /* 竖向布局时恢复 auto 高度 */
            .acu-wrapper.acu-dice-ui-root.acu-layout-vertical .acu-card-grid { flex-wrap: wrap !important; justify-content: center; padding-bottom: 20px; height: auto; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card, .acu-preview-overlay .acu-data-card { flex: 0 0 var(--acu-card-width, 260px); width: var(--acu-card-width, 260px); background: var(--acu-card-bg); border: 1px solid var(--acu-border); border-radius: 8px; height: auto; max-height: min(52vh, 520px, calc(100dvh - 140px)); overflow-y: auto; overscroll-behavior-y: contain; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); display: flex; flex-direction: column; position: relative; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card:hover,
            .acu-preview-overlay .acu-data-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px var(--acu-shadow); border-color: var(--acu-accent); }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.pending-deletion,
            .acu-preview-overlay .acu-data-card.pending-deletion { opacity: 0.6; border: 1px dashed var(--acu-error-text, #e74c3c); }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.pending-deletion::after,
            .acu-preview-overlay .acu-data-card.pending-deletion::after { content: "待删除"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: var(--acu-error-text, #e74c3c); font-size: 24px; font-weight: bold; border: 2px solid var(--acu-error-text, #e74c3c); padding: 5px 10px; border-radius: 8px; opacity: 0.8; pointer-events: none; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.acu-card-locked,
            .acu-preview-overlay .acu-data-card.acu-card-locked { border: 2px solid var(--acu-accent); box-shadow: 0 0 8px rgba(var(--acu-accent-rgb, 59, 130, 246), 0.3); position: relative; }
            .acu-wrapper.acu-dice-ui-root .acu-data-card.acu-card-locked::before,
            .acu-preview-overlay .acu-data-card.acu-card-locked::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(var(--acu-accent-rgb, 59, 130, 246), 0.05) 0%, transparent 50%); pointer-events: none; z-index: 0; border-radius: 8px; }
            .acu-row-lock-badge { color: var(--acu-accent); font-size: 14px; opacity: 0.9; margin-left: 4px; flex-shrink: 0; }
            @keyframes pulse-highlight { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
            .acu-highlight-manual { color: var(--acu-hl-manual) !important; background-color: var(--acu-hl-manual-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-highlight-diff { color: var(--acu-hl-diff) !important; background-color: var(--acu-hl-diff-bg) !important; border-radius: 4px; padding: 0 4px; font-weight: bold; animation: pulse-highlight 2s infinite; display: inline-block; }
            .acu-editable-title.acu-highlight-manual, .acu-editable-title.acu-highlight-diff { width: auto; display: inline-block; }
            .acu-wrapper.acu-dice-ui-root .acu-card-header,
            .acu-preview-overlay .acu-card-header { flex: 0 0 auto; padding: 8px 10px; background: var(--acu-table-head); border-bottom: 1px solid var(--acu-border); font-weight: bold; color: var(--acu-text-main); font-size: 14px; display: flex; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 8px; min-height: 40px; height: auto !important; position: relative; }
            .acu-editable-title { flex: 1; width: auto !important; cursor: pointer; border-bottom: 1px dashed transparent; transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard); white-space: pre-wrap !important; overflow: visible !important; word-break: break-word !important; text-align: center; line-height: 1.3; margin: 0; }
            .acu-editable-title:hover { border-bottom-color: var(--acu-accent); color: var(--acu-accent); }
            .acu-card-index { position: static !important; transform: none !important; margin: 0; flex-shrink: 0; font-size: 11px; color: var(--acu-text-sub); font-weight: normal; background: var(--acu-badge-bg); padding: 2px 6px; border-radius: 4px; }
            .acu-preview-overlay .acu-card-preview-close { margin-left: auto; width: 34px; height: 34px; min-width: 34px; min-height: 34px; flex: 0 0 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--acu-text-sub); font-size: 16px; line-height: 1; box-shadow: none; }
            .acu-preview-overlay .acu-card-preview-close:hover,
            .acu-preview-overlay .acu-card-preview-close:focus-visible { border-color: var(--acu-border); background: var(--acu-table-hover); color: var(--acu-accent); }
            .acu-bookmark-icon { position: absolute; top: 8px; right: 8px; color: var(--acu-accent); cursor: pointer; font-size: 16px; opacity: 0.35; transition: opacity var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard); z-index: 10; }
            .acu-bookmark-icon:hover { opacity: 0.7; }
            .acu-bookmark-icon.bookmarked { color: var(--acu-accent); opacity: 1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-body,
            .acu-preview-overlay .acu-card-body { padding: 6px 12px; display: flex; flex-direction: column; gap: 0; font-size: var(--acu-font-size, 13px); flex: 1; }
            .acu-wrapper.acu-dice-ui-root .acu-card-row,
            .acu-preview-overlay .acu-card-row { display: block; padding: 7px 0; border-bottom: 1px solid var(--acu-border); cursor: pointer; overflow: hidden; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-wrapper.acu-dice-ui-root .acu-card-row:last-child,
            .acu-preview-overlay .acu-card-row:last-child { border-bottom: none; }
            .acu-wrapper.acu-dice-ui-root .acu-card-actions,
            .acu-preview-overlay .acu-card-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 10px; border-top: 1px solid var(--acu-border); background: var(--acu-table-head); }
            .acu-action-item { padding: 4px 10px; font-size: 11px; border: 1px solid var(--acu-border); border-radius: 5px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; gap: 4px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); white-space: nowrap; }
            .acu-action-item:hover { background: var(--acu-btn-hover); border-color: var(--acu-accent); color: var(--acu-accent); transform: translateY(-1px); }
            .acu-action-item:active { transform: translateY(0); }
            .acu-action-item.check-type { border-style: dashed; }
            .acu-action-item i { font-size: 10px; opacity: 0.7; }
            .acu-wrapper.acu-dice-ui-root .acu-card-row:hover,
            .acu-preview-overlay .acu-card-row:hover { background: var(--acu-table-hover); }
            .acu-wrapper.acu-dice-ui-root .acu-card-label,
            .acu-preview-overlay .acu-card-label { float: left !important; clear: left; width: auto !important; margin-right: 8px !important; color: var(--acu-text-sub); font-size: 0.9em; line-height: 1.5; padding-top: 0; }
            .acu-wrapper.acu-dice-ui-root .acu-hide-label .acu-card-label,
            .acu-preview-overlay .acu-hide-label .acu-card-label { display: none; }
            .acu-wrapper.acu-dice-ui-root .acu-hide-label .acu-card-value,
            .acu-preview-overlay .acu-hide-label .acu-card-value { width: 100% !important; }
            .acu-inline-dice-btn:hover { opacity: 1 !important; }
            .acu-wrapper.acu-dice-ui-root .acu-card-value,
            .acu-preview-overlay .acu-card-value { display: block; width: auto !important; margin: 0; text-align: left !important; word-break: break-all !important; white-space: pre-wrap !important; line-height: 1.5 !important; color: var(--acu-text-main); font-size: 1em; }
            .acu-tag-container { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 2px; }
            .acu-multi-attr-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; }
            .acu-badge { display: inline-block; padding: 1px 8px; border-radius: 12px; font-size: 0.9em; font-weight: 500; line-height: 1.2; }
            .acu-badge-green { background: var(--acu-success-bg); color: var(--acu-success-text); }
            .acu-badge-neutral { background: var(--acu-badge-bg); color: var(--acu-text-main); border: 1px solid var(--acu-border); }
            .acu-panel-footer { flex: 0 0 auto; padding: 8px; border-top: 1px solid var(--acu-border); background: var(--acu-table-head); display: flex; justify-content: center; align-items: center; gap: 5px; flex-wrap: wrap; }
            .acu-page-btn { padding: 4px 10px; min-width: 32px; height: 28px; border-radius: 5px; border: 1px solid var(--acu-border); background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); }
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
                background: var(--acu-bg-nav);
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
            .acu-opt-header > span {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }
            .acu-opt-chevron {
                flex: 0 0 auto;
                width: 8px;
                height: 8px;
                box-sizing: border-box;
                border-right: 2px solid currentColor;
                border-bottom: 2px solid currentColor;
                transform: rotate(45deg);
                transform-origin: center;
                transition: transform 0.16s ease;
            }
            .acu-option-panel.collapsed .acu-opt-chevron {
                transform: rotate(-45deg);
            }

            /* --- [重设计] 叙事条目风格按钮 --- */
            .acu-opt-btn,
            .acu-check-suggestion-btn {
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
            .acu-opt-btn:last-child,
            .acu-check-suggestion-btn:last-child {
                border-bottom: none;
            }
            .acu-opt-btn:hover,
            .acu-check-suggestion-btn:hover {
                background: var(--acu-table-hover);
                color: var(--acu-accent);
                border-color: var(--acu-accent);
                transform: translateX(3px);
            }
            .acu-opt-btn:active,
            .acu-check-suggestion-btn:active {
                background: var(--acu-btn-active-bg);
                color: var(--acu-btn-active-text);
            }

            .acu-wrapper.acu-dice-ui-root .acu-option-table-content {
                padding: 12px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-grid {
                display: block !important;
                width: 100%;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-panel {
                margin: 0;
                gap: 6px;
                max-width: 100%;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-row {
                width: 100%;
                min-height: 32px;
                align-items: flex-start;
                gap: 10px;
                padding: 8px 10px;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-index {
                flex: 0 0 auto;
                color: var(--acu-accent);
                font-weight: 700;
                opacity: 0.9;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-text {
                flex: 1 1 auto;
                min-width: 0;
                white-space: pre-wrap;
                word-break: break-word;
            }
            .acu-wrapper.acu-dice-ui-root .acu-option-table-empty {
                padding: 18px;
                text-align: center;
                color: var(--acu-text-sub);
            }

            /* --- [新增] 折叠态样式 --- */
            .acu-option-panel.collapsed .acu-opt-btn,
            .acu-option-panel.collapsed .acu-check-suggestion-btn {
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
    padding: 4px;
}

/* 2. 菜单项：文字颜色跟随主题 */
.acu-cell-menu-item {
    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    gap: 12px;
    align-items: center;
    color: var(--acu-menu-text);
    font-weight: 500;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    text-align: left;
    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard);
}

/* 3. 悬停效果：使用主题定义的通用悬停色 */
.acu-cell-menu-item:hover,
.acu-cell-menu-item:focus-visible {
    background: var(--acu-table-hover);
    border-color: var(--acu-border);
    outline: none;
}
.acu-cell-menu-separator {
    height: 1px;
    margin: 4px 0;
    background: var(--acu-border);
}

/* 4. 特殊按钮优化 */
            .acu-cell-menu-item#act-delete,
            .acu-cell-menu-item[data-action="delete"] { color: var(--acu-error-text, #e74c3c); }
            .acu-cell-menu-item#act-delete:hover,
            .acu-cell-menu-item[data-action="delete"]:hover { background: var(--acu-error-bg, rgba(231, 76, 60, 0.1)); } /* 红色半透明背景，任何主题都适配 */
            .acu-cell-menu-item#act-close,
            .acu-cell-menu-item[data-action="close"] { color: var(--acu-text-sub); }

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

            .acu-edit-overlay { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; height: 100dvh; background: rgba(0,0,0,0.75) !important; z-index: 31200 !important; display: flex; justify-content: center !important; align-items: center !important; backdrop-filter: blur(2px); }
            .acu-edit-dialog { background: var(--acu-bg-panel); width: 95%; max-width: 500px; max-height: 95vh; padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 15px 50px rgba(0,0,0,0.6); color: var(--acu-text-main); border: 1px solid var(--acu-border); overflow: hidden; flex-shrink: 0; }
            @media (min-width: 768px) { .acu-edit-dialog { max-width: 900px; width: 90%; } .acu-edit-dialog.acu-settings-dialog { max-width: 400px; width: 400px; } }
            .acu-edit-title { margin: 0; font-size: 16px; font-weight: bold; color: var(--acu-text-main); padding-bottom: 8px; border-bottom: 1px solid var(--acu-border); }
            .acu-edit-icon-muted { opacity: 0.7; }
            .acu-edit-content { background: var(--acu-bg-panel); }
            .acu-settings-content-scroll { flex: 1; overflow-y: auto; padding: 15px; }
            .acu-card-edit-field { margin-bottom: 10px; }
            .acu-card-edit-label { display: block; font-size: 12px; color: var(--acu-accent); font-weight: bold; margin-bottom: 4px; }
            .acu-card-edit-input { width: 100% !important; padding: 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; box-sizing: border-box !important; font-size: 14px !important; line-height: 1.5 !important; appearance: none; -webkit-appearance: none; }
            .acu-card-edit-input:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog select { padding: 6px 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; font-size: 13px !important; appearance: none; -webkit-appearance: none; cursor: pointer; }
            .acu-edit-dialog select:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog select option { background: var(--acu-bg-panel) !important; color: var(--acu-text-main) !important; }
            .acu-edit-dialog input[type="text"], .acu-edit-dialog input[type="number"], .acu-edit-dialog input[type="search"], .acu-edit-dialog input:not([type]) { padding: 6px 10px !important; border: 1px solid var(--acu-border) !important; border-radius: 6px !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; font-size: 13px !important; box-sizing: border-box !important; }
            .acu-edit-dialog input:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-dialog input::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            .acu-card-edit-textarea { min-height: 40px; max-height: 500px; resize: none; overflow-y: hidden; }
            .acu-edit-textarea { width: 100%; height: auto; padding: 12px; border: 1px solid var(--acu-border) !important; background: var(--acu-input-bg) !important; color: var(--acu-text-main) !important; border-radius: 6px; resize: vertical; box-sizing: border-box; font-size: 14px; line-height: 1.6; overflow-y: auto !important; }
            .acu-edit-textarea:focus { outline: none !important; border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring) !important; }
            .acu-edit-textarea::placeholder { color: var(--acu-text-sub) !important; opacity: 0.7; }
            @media (min-width: 768px) { .acu-edit-textarea { height: auto !important; font-size: 15px !important; } }
            .acu-edit-textarea:focus { outline: none !important; }
            .acu-dialog-btns { display: flex; justify-content: flex-end; gap: 20px; margin-top: 10px; }
            .acu-dialog-btn { background: none; border: 1px solid transparent; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 6px; color: var(--acu-text-sub); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), box-shadow var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-dialog-btn:hover, .acu-dialog-btn:focus-visible { background: var(--acu-btn-bg); color: var(--acu-text-main); border-color: var(--acu-border); outline: none; }
            .acu-btn-confirm { color: var(--acu-success-text); } .acu-btn-confirm:hover, .acu-btn-confirm:focus-visible { opacity: 0.9; }
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

            .acu-actions-group { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 4px; border-top: 1px solid var(--acu-border); padding-top: 8px; margin-top: 4px; min-height: calc(var(--acu-nav-button-size, 32px) + 4px); transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }

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
                    height: 100%;
                    min-height: 0;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                }
                .acu-dash-body.acu-dash-horizontal > div {
                    flex: 0 0 280px;
                    min-width: 280px;
                    min-height: 0;
                    max-height: 100%;
                    overflow-y: auto;
                    box-sizing: border-box;
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
            .acu-expand-trigger { background: var(--acu-bg-nav); border: 1px solid var(--acu-border); box-shadow: 0 2px 6px var(--acu-shadow); cursor: pointer; color: var(--acu-text-main); font-size: 13px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), transform var(--acu-motion-fast) var(--acu-ease-standard); z-index: 31005 !important; }
            .acu-expand-trigger:hover { background: var(--acu-btn-hover); transform: translateY(-1px); }
            .acu-col-bar { width: 100%; justify-content: center; padding: 8px 10px; border-radius: 6px; }
            .acu-col-pill { width: auto !important; padding: 6px 16px; border-radius: 50px; }
            .acu-col-floating { width: 48px !important; height: 48px !important; padding: 0; justify-content: center; border-radius: 50%; cursor: grab; touch-action: none; user-select: none; font-size: 16px; display: flex !important; visibility: visible !important; opacity: 1 !important; }
            .acu-col-floating span { display: none; }
            .acu-col-floating:hover { transform: translateY(-1px) scale(1.02); }
            .acu-col-floating:focus, .acu-col-floating:focus-visible { outline: none; box-shadow: var(--acu-focus-ring), 0 2px 6px var(--acu-shadow) !important; }
            .acu-col-floating:active, .acu-col-floating.acu-floating-dragging { cursor: grabbing; transform: scale(0.98); }
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

            @media (min-width: 769px) {
                .acu-wrapper.acu-dice-ui-root.acu-mode-viewport { bottom: max(12px, env(safe-area-inset-bottom)); }
                .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-nav-container { width: 100% !important; min-width: 0; max-width: 100%; box-sizing: border-box; margin: 0; border-radius: 0 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; border: 1px solid var(--acu-border); padding: 6px 10px; background: var(--acu-bg-nav) !important; }
                .acu-wrapper.acu-dice-ui-root.acu-mode-embedded .acu-data-display { bottom: calc(100% + 12px) !important; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important; }
                .acu-nav-container { display: flex; flex-wrap: wrap !important; gap: 6px !important; padding: 6px 10px; grid-template-columns: none !important; flex-direction: row !important; justify-content: flex-start !important; align-items: center !important; height: auto !important; }
                .acu-nav-container .acu-nav-btn { width: fit-content !important; flex: 0 0 auto !important; height: var(--acu-nav-button-size, 32px) !important; padding: 0 var(--acu-nav-button-padding-x, 12px); font-size: var(--acu-nav-font-size, 13px) !important; min-width: auto !important; }
                .acu-nav-btn span { max-width: 200px; }
                .acu-action-btn { flex: 0 0 var(--acu-nav-button-size, 32px) !important; width: var(--acu-nav-button-size, 32px) !important; height: var(--acu-nav-button-size, 32px) !important; font-size: var(--acu-nav-icon-size, 14px) !important; background: transparent !important; color: var(--acu-text-sub) !important; border-radius: 6px; border: 1px solid transparent; }
                .acu-action-btn:hover { background: var(--acu-btn-hover) !important; color: var(--acu-text-main) !important; transform: translateY(-1px); box-shadow: none; }
                #acu-btn-save-global { color: var(--acu-accent) !important; }
                #acu-btn-save-global:hover { background: var(--acu-accent) !important; color: var(--acu-btn-active-text) !important; }
                .acu-order-controls { margin: 0 0 8px 0; padding: 4px; }
                .acu-actions-group { width: auto !important; margin-left: auto !important; border-top: none !important; border-bottom: none !important; padding: 0; margin-top: 0 !important; margin-bottom: 0 !important; gap: 4px !important; background: transparent; justify-content: flex-end; order: 9999 !important; display: flex; }
                .acu-pos-top .acu-actions-group { order: -1 !important; margin-left: 0 !important; margin-right: 10px !important; justify-content: flex-start !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned.acu-mode-embedded .acu-nav-container { width: 100% !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(clamp(118px, calc(var(--acu-nav-button-size, 32px) + var(--acu-nav-font-size, 13px) + var(--acu-nav-font-size, 13px) + 70px), 168px), 1fr)) !important; flex-wrap: initial !important; justify-content: stretch !important; align-items: center !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container .acu-nav-btn { width: 100% !important; min-width: 0 !important; flex: none !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-btn span { max-width: 100%; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-actions-group { grid-column: span 2 / -1 !important; justify-self: end; width: auto !important; margin-left: 0 !important; margin-right: 0 !important; }
                .acu-wrapper.acu-dice-ui-root.acu-desktop-nav-aligned .acu-nav-container.acu-pos-top .acu-actions-group { grid-column: 1 / span 2 !important; justify-self: start; margin-right: 0 !important; }
            }
            @media (max-width: 768px) {
                .acu-wrapper.acu-dice-ui-root .acu-panel-content { -webkit-overflow-scrolling: touch !important; overscroll-behavior-y: auto; }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-container {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    max-height: clamp(152px, 28dvh, 196px);
                    overflow: hidden !important;
                    overscroll-behavior: contain;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items {
                    display: grid;
                    grid-template-columns: repeat(var(--acu-grid-cols, 3), minmax(0, 1fr));
                    gap: 5px;
                    align-content: start;
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-x: hidden !important;
                    overflow-y: auto !important;
                    overscroll-behavior-y: contain;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items::-webkit-scrollbar {
                    width: 0 !important;
                    height: 0 !important;
                    display: none !important;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-items .acu-nav-btn {
                    width: 100%;
                    min-width: 0;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-actions-group {
                    position: relative;
                    bottom: auto;
                    z-index: 2;
                    flex: 0 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 6px !important;
                    padding-top: 6px;
                    border-top: 1px solid var(--acu-border);
                    background: var(--acu-bg-nav);
                    box-shadow: none;
                }
                .acu-wrapper.acu-dice-ui-root.acu-mode-fixed.acu-has-visible-panel .acu-nav-container.acu-pos-top .acu-actions-group {
                    order: -1 !important;
                    margin-top: 0 !important;
                    margin-bottom: 6px !important;
                    padding-top: 0;
                    padding-bottom: 6px;
                    border-top: none !important;
                    border-bottom: 1px solid var(--acu-border) !important;
                }
                .acu-wrapper.acu-dice-ui-root .acu-data-card,
                .acu-preview-overlay .acu-data-card { box-shadow: none !important; border: 1px solid var(--acu-border); transform: translateZ(0); }
                .acu-wrapper.acu-dice-ui-root .acu-data-card:hover,
                .acu-preview-overlay .acu-data-card:hover { transform: none !important; box-shadow: none !important; }
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
                    gap: 12px;
                    margin: 6px 0;
                }

                .acu-dashboard-section {
                    background: var(--acu-card-bg);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid var(--acu-border);
                    min-width: 0;
                }

                .acu-dash-section-heading {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    color: var(--acu-accent);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                    min-width: 0;
                    line-height: 1.3;
                }

                .acu-dash-section-heading > span:first-child {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-subheading {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin: 6px 0 4px 0;
                    font-size: 12px;
                    line-height: 1.3;
                    color: var(--acu-accent);
                }

                .acu-dash-status-badge {
                    max-width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding: 2px 8px;
                    border: 1px solid var(--acu-border);
                    border-radius: 999px;
                    background: var(--acu-badge-bg);
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 500;
                }

                .acu-dash-section-actions {
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                    flex-shrink: 0;
                }

                .acu-dash-resource-list,
                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list,
                .acu-dash-quest-list {
                    scrollbar-width: thin;
                    scrollbar-color: var(--acu-scrollbar-thumb) transparent;
                }

                .acu-dash-resource-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    max-height: 44px;
                    overflow-y: auto;
                    margin-bottom: 4px;
                    padding-bottom: 4px;
                    border-bottom: 1px solid var(--acu-border);
                }

                .acu-dash-location-list,
                .acu-dash-role-list,
                .acu-dash-items-list,
                .acu-dash-equipment-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 6px;
                    align-content: start;
                    overflow-x: hidden;
                    overflow-y: auto;
                }

                .acu-dash-location-list { max-height: 110px; margin-bottom: 10px; }
                .acu-dash-role-list { max-height: 150px; }
                .acu-dash-items-list { max-height: 90px; margin-bottom: 10px; }
                .acu-dash-equipment-list { max-height: 80px; margin-bottom: 10px; }
                .acu-dash-quest-list { max-height: 60px; overflow-y: auto; }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-person-row,
                .acu-dash-item-row,
                .acu-dash-equipment-row,
                .acu-task-item {
                    min-width: 0;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row,
                .acu-dash-item-row,
                .acu-dash-row-main {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 6px;
                }

                .acu-dash-metric-row,
                .acu-dash-attr-row {
                    padding: 2px 3px;
                }

                .acu-dash-attr-list {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px 4px;
                    max-height: 104px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    padding-bottom: 2px;
                }

                .acu-dash-attr-row {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-metric-label {
                    min-width: 0;
                    color: var(--acu-text-sub);
                    font-size: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .acu-dash-metric-value-group,
                .acu-dash-row-actions {
                    display: inline-flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                }

                .acu-dash-metric-value {
                    color: var(--acu-accent);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-attr-value {
                    color: var(--acu-text-main);
                    font-size: 11px;
                    font-weight: 700;
                }

                .acu-dash-row-separated {
                    border-bottom: 1px dashed var(--acu-border);
                }

                .acu-dash-person-row {
                    padding: 6px 4px;
                }

                .acu-dash-name-with-avatar,
                .acu-dash-item-name,
                .acu-dash-equipment-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                    color: var(--acu-text-main);
                    font-size: 12px;
                }

                .acu-dash-item-name,
                .acu-dash-equipment-row span {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-item-row {
                    padding: 5px 4px;
                    font-size: 11px;
                }

                .acu-dash-equipment-row {
                    padding: 4px;
                    font-size: 11px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .acu-dash-muted {
                    opacity: 0.6;
                }

                .acu-task-main {
                    font-weight: 600;
                }

                .acu-location-group {
                    margin-bottom: 8px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: var(--acu-card-bg);
                    border: 1px solid transparent;
                    transition: border-color var(--acu-motion-fast) var(--acu-ease-standard), background-color var(--acu-motion-fast) var(--acu-ease-standard);
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
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard);
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
                    opacity: 0;
                    transition: opacity var(--acu-motion-normal) var(--acu-ease-standard);
                }

                .acu-location-group.expanded .acu-location-list {
                    max-height: 500px;
                    opacity: 1;
                }

                .acu-location-item {
                    padding: 6px 10px 6px 26px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    border-bottom: 1px dashed rgba(0,0,0,0.05);
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
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

                .acu-player-status {
                    font-size: 13px;
                    color: var(--acu-text-main);
                }

                .acu-task-item {
                    padding: 4px 3px;
                    margin-bottom: 0;
                    background: transparent;
                    border: 0;
                    border-bottom: 1px dashed var(--acu-border);
                    border-radius: 0;
                }
                .acu-task-item:last-child {
                    border-bottom: 0;
                }
                .acu-task-item.acu-dash-clickable:hover,
                .acu-task-item.acu-dash-clickable:active {
                    background: transparent;
                }
                .acu-task-item.acu-dash-clickable:hover .acu-task-name {
                    color: var(--acu-accent);
                }

                .acu-task-name {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 11px;
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
                    padding: 8px 15px;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    touch-action: pan-y !important;
                    overscroll-behavior-y: contain;
                    max-height: calc(80vh - 60px);
                }

                .acu-wrapper.acu-dice-ui-root .acu-data-display.acu-manual-mode .acu-dashboard-content {
                    max-height: none !important;
                }

                /* === 仪表盘交互按钮优化 === */
                h3.acu-dash-table-link,
                h4.acu-dash-table-link {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
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
                .acu-dash-map-btn,
                .acu-dash-gacha-btn,
                .acu-dash-inventory-btn,
                .acu-dash-relation-graph-btn,
                .acu-dash-avatar-manager-btn {
                    cursor: pointer;
                    color: var(--acu-text-sub);
                    opacity: 0.5;
                    font-size: 14px !important;
                    padding: 6px;
                    margin: -4px;
                    border-radius: 4px;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), opacity var(--acu-motion-fast) var(--acu-ease-standard);
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
                .acu-dash-dice-free:hover,
                .acu-dash-map-btn:hover,
                .acu-dash-gacha-btn:hover,
                .acu-dash-inventory-btn:hover,
                .acu-dash-relation-graph-btn:hover,
                .acu-dash-avatar-manager-btn:hover {
                    opacity: 1;
                    color: var(--acu-accent);
                    background: var(--acu-table-hover);
                }

                /* 仪表盘可点击项 - 增强反馈 */
                .acu-dash-clickable {
                    cursor: pointer;
                    transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
                    border-radius: 4px;
                }
                .acu-dash-clickable:hover {
                    background: var(--acu-table-hover);
                }
                .acu-dash-clickable:active {
                    background: var(--acu-table-hover);
                }

                @media (max-width: 768px) {
                    .acu-dash-body:not(.acu-dash-horizontal) {
                        grid-template-columns: 1fr;
                        max-height: none;
                        overflow: visible;
                    }

                    .acu-dashboard-content {
                        max-height: calc(50vh - 40px) !important;
                        padding: 8px 10px !important;
                        padding-bottom: 8px !important;
                    }

                    .acu-dash-body.acu-dash-horizontal {
                        gap: 10px;
                        padding-bottom: 6px;
                    }

                    .acu-dash-player,
                    .acu-dash-locations,
                    .acu-dash-intel {
                        padding: 10px;
                    }

                    /* 移动端进一步放大操作按钮 */
                    .acu-dash-dice-btn,
                    .acu-dash-goto-btn,
                    .acu-dash-use-item-btn,
                    .acu-dash-use-skill-btn,
                    .acu-dash-track-task-btn,
                    .acu-dash-msg-btn,
                    .acu-dash-contest-btn,
                    .acu-dash-dice-free,
                    .acu-dash-map-btn,
                    .acu-dash-gacha-btn,
                    .acu-dash-inventory-btn,
                    .acu-dash-relation-graph-btn,
                    .acu-dash-avatar-manager-btn {
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
                transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard);
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
            .acu-result-badge-crit-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-accent); }
            .acu-result-badge-extreme-success { background-color: var(--acu-hl-diff-bg); color: var(--acu-text-main); border-color: var(--acu-hl-diff); }
            .acu-result-badge-success { background-color: var(--acu-success-bg); color: var(--acu-text-main); border-color: var(--acu-success-text); }
            .acu-result-badge-warning { background-color: var(--acu-warning-bg); color: var(--acu-text-main); border-color: var(--acu-warning-text); }
            .acu-result-badge-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }
            .acu-result-badge-crit-failure { background-color: var(--acu-error-bg); color: var(--acu-text-main); border-color: var(--acu-error-text); }


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

            /* === 资源消耗器按钮 (燃运等) === */
            .acu-dice-burners {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-left: 4px;
            }
            .acu-dice-burner-btn {
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
            .acu-dice-burner-btn:hover {
                opacity: 1;
                color: var(--acu-accent);
            }
            .acu-dice-burner-btn i {
                font-size: 14px;
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
            .acu-graph-filter-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
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
                box-sizing: border-box;
            }
            .acu-graph-title {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-accent);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-graph-heading {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            .acu-graph-heading-text {
                display: none;
            }
            .acu-graph-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-graph-btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
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
            .acu-graph-svg.acu-graph-move-mode {
                cursor: default;
            }
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
            .acu-graph-edge-label-html {
                pointer-events: none;
                transition: opacity 0.2s ease, color 0.2s ease;
            }
            .acu-graph-node { cursor: grab; }
            .acu-graph-node:active { cursor: grabbing; }
            .acu-graph-move-mode .acu-graph-node {
                cursor: move;
            }
            .acu-graph-node-dragging .acu-graph-node,
            .acu-graph-node-dragging .acu-graph-node:active {
                cursor: grabbing;
            }
            .acu-graph-move-mode .acu-graph-node .acu-node-bg {
                stroke-dasharray: 4 3;
            }
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
            .acu-graph-svg.highlighting .acu-graph-edge-label-html {
                opacity: 0.1;
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
            .acu-graph-svg.highlighting .acu-graph-edge-label.acu-graph-label-highlighted {
                opacity: 1;
                fill: var(--acu-accent);
                font-weight: 700;
            }
            .acu-graph-svg.highlighting .acu-graph-edge-label-html.acu-graph-label-highlighted {
                opacity: 1;
                color: var(--acu-accent) !important;
                font-weight: 700;
                background: transparent !important;
                box-shadow: none !important;
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
            .acu-node-center-indicator {
                fill: none;
                stroke: var(--acu-accent);
                stroke-width: 2;
                stroke-dasharray: 6 3;
                opacity: 0.7;
                animation: acu-center-spin 8s linear infinite;
                pointer-events: none;
            }
            @keyframes acu-center-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .acu-graph-center-dropdown {
                position: relative;
            }
            .acu-graph-center-trigger {
                display: flex;
                align-items: center;
                gap: 6px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                max-width: 130px;
                min-height: 34px;
                box-sizing: border-box;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-graph-center-trigger:hover {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-trigger .acu-center-label {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100px;
            }
            .acu-graph-center-trigger .fa-caret-down {
                font-size: 10px;
                opacity: 0.6;
                transition: transform 0.2s;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-trigger {
                border-color: var(--acu-accent);
            }
            .acu-graph-center-dropdown.open .fa-caret-down {
                transform: rotate(180deg);
            }
            .acu-graph-center-menu {
                display: none;
                position: absolute;
                top: calc(100% + 4px);
                left: 0;
                min-width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                z-index: 10;
            }
            .acu-graph-center-dropdown.open .acu-graph-center-menu {
                display: block;
            }
            .acu-center-option {
                padding: 6px 12px;
                font-size: 12px;
                color: var(--acu-text-main);
                cursor: pointer;
                white-space: nowrap;
                transition: background 0.15s;
            }
            .acu-center-option:hover {
                background: var(--acu-btn-hover);
            }
            .acu-center-option.active {
                color: var(--acu-accent);
                font-weight: bold;
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
            .acu-graph-view-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }
            .acu-graph-legend span {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .acu-graph-node-size-label {
                font-size: 11px;
                color: var(--acu-text-sub);
                white-space: nowrap;
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
                    width: calc(100vw - 20px);
                    height: 80vh;
                    max-height: none;
                    border-radius: 12px;
                }
                .acu-relation-graph-container .acu-panel-header {
                    display: grid;
                    grid-template-columns: minmax(120px, 1fr) auto 34px 34px;
                    grid-template-areas:
                        "graph-heading . graph-help graph-close"
                        "graph-center graph-tools graph-relayout graph-avatar";
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                }
                .acu-graph-title {
                    display: contents;
                }
                .acu-graph-heading {
                    grid-area: graph-heading;
                    justify-self: start;
                }
                .acu-graph-heading-text {
                    display: inline;
                    font-size: 13px;
                    color: var(--acu-text-main);
                    white-space: nowrap;
                }
                .acu-graph-center-dropdown {
                    grid-area: graph-center;
                    min-width: 0;
                }
                .acu-graph-center-trigger {
                    width: 100%;
                    max-width: none;
                    justify-content: space-between;
                }
                .acu-graph-center-trigger .acu-center-label {
                    max-width: none;
                }
                .acu-graph-filter-controls {
                    grid-area: graph-tools;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-left: 0;
                    min-width: 0;
                    justify-self: start;
                }
                .acu-graph-actions {
                    display: contents;
                }
                .acu-graph-actions .acu-panel-tutorial-btn {
                    grid-area: graph-help;
                }
                .acu-graph-actions #graph-relayout {
                    grid-area: graph-relayout;
                }
                .acu-graph-actions #graph-manage-avatar {
                    grid-area: graph-avatar;
                }
                .acu-graph-actions .acu-graph-close {
                    grid-area: graph-close;
                }
                .acu-graph-legend {
                    gap: 8px;
                    flex-wrap: nowrap;
                    padding: 8px 6px;
                    overflow-x: auto;
                    justify-content: flex-start;
                }
                .acu-graph-view-controls {
                    min-width: max-content;
                }
            }

            /* ========== 地图可视化样式 ========== */
            .acu-map-overlay {
                background: rgba(0,0,0,0.8);
                z-index: 31100;
                backdrop-filter: blur(4px);
            }
            .acu-map-container {
                width: min(500px, calc(100vw - 24px));
                max-width: 500px;
                max-height: 85vh;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.45);
                box-sizing: border-box;
            }
            .acu-map-container .acu-panel-header {
                display: grid;
                grid-template-columns: auto minmax(0, 1fr) auto;
                align-items: center;
                gap: 8px;
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
                min-width: 0;
            }
            .acu-map-actions {
                display: flex;
                gap: 6px;
                align-items: center;
                flex-shrink: 0;
            }
            .acu-map-actions button {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
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
                color: var(--acu-text-main);
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
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
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
                transition: transform var(--acu-motion-normal) var(--acu-ease-out);
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
            .acu-map-thumbnail:focus-visible {
                outline: 2px solid var(--acu-focus-ring);
                outline-offset: 2px;
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
                transition: transform var(--acu-motion-fast) var(--acu-ease-out);
            }

            .acu-map-thumbnail:hover .acu-map-thumbnail-badge {
                transform: scale(1.1);
            }

            /* 地区标签页 */
            .acu-map-region-tabs {
                display: flex;
                flex-wrap: nowrap;
                gap: 4px;
                width: 100%;
                min-width: 0;
                overflow-x: auto;
                scroll-behavior: smooth;
                scrollbar-width: none;
            }
            .acu-map-region-tabs::-webkit-scrollbar {
                display: none;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs {
                scrollbar-width: thin;
                scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track);
                padding-bottom: 6px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar:horizontal {
                height: 8px;
                display: block;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-track:horizontal {
                background: var(--acu-scrollbar-track);
                border-radius: 4px;
            }
            .acu-map-overlay.acu-show-horizontal-scrollbar .acu-map-region-tabs::-webkit-scrollbar-thumb:horizontal {
                background: var(--acu-scrollbar-thumb);
                border-radius: 4px;
            }
            .acu-map-region-tab {
                padding: 4px 10px;
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                background: var(--acu-btn-bg);
                color: var(--acu-text-sub);
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
                min-height: 32px;
                white-space: nowrap;
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
            .acu-map-loading-wide {
                grid-column: 1 / -1;
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
                    width: calc(100vw - 20px);
                    max-height: 92vh;
                }
                .acu-map-container .acu-panel-header {
                    grid-template-columns: auto minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 6px;
                    padding: 10px;
                }
                .acu-map-title {
                    min-width: 0;
                }
                .acu-map-region-tab {
                    padding: 4px 9px;
                }
                .acu-map-actions {
                    justify-content: flex-end;
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
                inset: 0;
                box-sizing: border-box;
                overflow: hidden;
            }
            .acu-avatar-manager {
                width: min(500px, calc(100vw - 24px));
                max-width: 100%;
                height: min(720px, calc(100vh - 24px));
                height: min(720px, calc(100dvh - 24px));
                max-height: min(720px, calc(100vh - 24px));
                max-height: min(720px, calc(100dvh - 24px));
                min-height: 0;
                box-sizing: border-box;
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
                flex-direction: column;
                padding: 10px;
                border-bottom: 1px dashed var(--acu-border);
                transition: background-color 0.2s ease;
            }
            .acu-avatar-item:last-child { border-bottom: none; }
            .acu-avatar-item.expanded {
                background-color: rgba(127, 127, 127, 0.05);
            }

            /* --- 折叠状态行 --- */
            .acu-avatar-row-collapsed {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
            }

            /* 头像预览部分 (复用原样式但稍作调整) */
            .acu-avatar-identity-tools {
                position: relative;
                display: flex;
                align-items: center;
                flex: 0 0 auto;
            }

            .acu-avatar-preview {
                --acu-avatar-image: none;
                --acu-avatar-x: 50%;
                --acu-avatar-y: 50%;
                --acu-avatar-scale: 150%;
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
                transition: border-color 0.2s;
            }
            .acu-avatar-preview:hover {
                border-color: var(--acu-accent);
            }
            .acu-avatar-preview.has-image {
                background-image: var(--acu-avatar-image);
                background-position: var(--acu-avatar-x) var(--acu-avatar-y);
                background-size: var(--acu-avatar-scale);
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

            /* 角色信息摘要 */
            .acu-avatar-info-summary {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .acu-avatar-name {
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-text-main);
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                gap: 5px;
                min-width: 0;
                position: relative;
            }

            .acu-avatar-name-text {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-avatar-url-preview {
                font-size: 12px;
                color: var(--acu-text-sub);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
                opacity: 0.8;
            }
            /* 操作按钮区 (折叠态) */
            .acu-avatar-actions-collapsed {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
            }

            /* --- 展开状态行 --- */
            .acu-avatar-row-expanded {
                display: none;
                opacity: 0;
                transform: translateY(-2px);
                transition:
                    opacity var(--acu-motion-normal) var(--acu-ease-standard),
                    transform var(--acu-motion-normal) var(--acu-ease-out);
                margin-top: 0;
                padding-top: 0;
            }
            .acu-avatar-item.expanded .acu-avatar-row-expanded {
                display: block;
                opacity: 1;
                transform: translateY(0);
                margin-top: 10px;
                padding-top: 4px;
                border-top: 1px solid var(--acu-border);
            }
            
            .acu-avatar-details {
                padding-top: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .acu-protagonist-toggle {
                background: transparent;
                border: none;
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: pointer;
                width: 30px;
                height: 30px;
                min-width: 30px;
                min-height: 30px;
                padding: 0;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .acu-protagonist-toggle:hover {
                opacity: 0.8;
                background: var(--acu-bg-hover);
            }
            .acu-protagonist-toggle.active {
                opacity: 1;
                color: var(--acu-accent);
            }
            
            /* 输入行布局 */
            .acu-input-group {
                display: flex;
                gap: 8px;
                align-items: flex-start;
            }
            .acu-input-group-label {
                width: 32px;
                font-size: 12px;
                color: var(--acu-text-sub);
                text-align: right;
                flex-shrink: 0;
                line-height: 36px;
            }
            
            /* URL容器 - 与别名容器统一样式 */
            .acu-url-container {
                flex: 1;
                display: flex;
                align-items: center;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg);
                min-height: 36px;
                box-sizing: border-box;
                transition: border-color 0.2s ease;
            }
            .acu-url-container:focus-within {
                border-color: var(--acu-accent);
            }
            
            /* URL输入框 - 无边框融入容器 */
            .acu-avatar-manager-overlay .acu-url-container > input.acu-avatar-url,
            .acu-avatar-manager-overlay .acu-url-container > input.acu-avatar-url:focus {
                border: 0 !important;
                background: transparent !important;
                padding: 0 !important;
                font-size: 11px !important;
                color: var(--acu-text-main) !important;
                flex: 1;
                min-width: 0;
                outline: none !important;
                box-shadow: none !important;
                height: 26px !important;
                line-height: 26px !important;
                border-radius: 0 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-url-container input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }

            .acu-avatar-color-container {
                position: relative;
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 0 0 auto;
                flex-wrap: nowrap;
            }

            .acu-avatar-color-swatch-btn {
                width: 34px !important;
                min-width: 34px !important;
            }

            .acu-avatar-name .acu-avatar-color-swatch-btn {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
            }

            .acu-avatar-color-swatch {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                border: 1px solid color-mix(in srgb, var(--acu-border) 65%, var(--acu-avatar-ui-color) 35%);
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-bg-panel) 70%, transparent);
                pointer-events: none;
            }

            .acu-avatar-color-popover {
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                z-index: 20;
                width: 230px;
                padding: 10px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-bg-panel);
                box-shadow: 0 10px 28px var(--acu-shadow);
                display: grid;
                gap: 8px;
            }

            .acu-avatar-color-popover[hidden] {
                display: none;
            }

            .acu-avatar-color-popover-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                min-width: 0;
                min-height: 22px;
            }

            .acu-avatar-color-panel-title {
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1;
            }

            .acu-avatar-manager-overlay .acu-avatar-color-close-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                width: 30px;
                height: 30px;
                min-width: 30px;
                padding: 0;
                border: 0 !important;
                border-radius: 0 !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                box-shadow: none !important;
                cursor: pointer;
                font-size: 14px;
                transition:
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-avatar-manager-overlay .acu-avatar-color-close-btn:hover,
            .acu-avatar-manager-overlay .acu-avatar-color-close-btn:focus {
                border: 0 !important;
                background: transparent !important;
                color: var(--acu-text-main) !important;
                box-shadow: none !important;
            }

            .acu-avatar-color-swatch-grid {
                display: grid;
                grid-template-columns: repeat(6, minmax(0, 1fr));
                gap: 5px;
            }

            .acu-avatar-color-option {
                min-width: 0;
                height: 24px;
                padding: 0;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-avatar-option-color) !important;
                cursor: pointer;
                transition:
                    border-color var(--acu-motion-fast) var(--acu-ease-standard),
                    transform var(--acu-motion-fast) var(--acu-ease-out);
            }

            .acu-avatar-color-option:hover,
            .acu-avatar-color-option.active {
                border-color: var(--acu-accent);
                transform: translateY(-1px);
            }

            .acu-avatar-color-free-picker {
                display: grid;
                gap: 7px;
                padding: 7px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: color-mix(in srgb, var(--acu-input-bg) 82%, var(--acu-bg-panel) 18%);
            }

            .acu-avatar-color-slider-row {
                display: grid;
                grid-template-columns: 34px minmax(0, 1fr);
                align-items: center;
                gap: 8px;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1;
            }

            .acu-avatar-color-slider {
                width: 100%;
                min-width: 0;
                height: 6px;
                margin: 0;
                border: 1px solid color-mix(in srgb, var(--acu-border) 82%, transparent);
                border-radius: 999px;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
                cursor: pointer;
            }

            .acu-avatar-color-hue-slider {
                background: linear-gradient(
                    to right,
                    hsl(0, 70%, 55%),
                    hsl(60, 70%, 55%),
                    hsl(120, 70%, 55%),
                    hsl(180, 70%, 55%),
                    hsl(240, 70%, 55%),
                    hsl(300, 70%, 55%),
                    hsl(360, 70%, 55%)
                );
            }

            .acu-avatar-color-saturation-slider {
                background: linear-gradient(
                    to right,
                    hsl(var(--acu-avatar-picker-hue), 0%, var(--acu-avatar-picker-lightness)),
                    hsl(var(--acu-avatar-picker-hue), 100%, var(--acu-avatar-picker-lightness))
                );
            }

            .acu-avatar-color-lightness-slider {
                background: linear-gradient(
                    to right,
                    hsl(var(--acu-avatar-picker-hue), var(--acu-avatar-picker-saturation), 20%),
                    hsl(var(--acu-avatar-picker-hue), var(--acu-avatar-picker-saturation), 80%)
                );
            }

            .acu-avatar-color-slider::-webkit-slider-thumb {
                width: 14px;
                height: 14px;
                border: 2px solid var(--acu-bg-panel);
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                box-shadow: 0 0 0 1px var(--acu-border);
                -webkit-appearance: none;
                appearance: none;
            }

            .acu-avatar-color-slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border: 2px solid var(--acu-bg-panel);
                border-radius: 50%;
                background: var(--acu-avatar-ui-color);
                box-shadow: 0 0 0 1px var(--acu-border);
            }

            .acu-avatar-manager-overlay input.acu-avatar-color-hex,
            .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                width: 100% !important;
                min-width: 0;
                height: 34px !important;
                padding: 0 8px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                background: var(--acu-input-bg) !important;
                color: var(--acu-text-main) !important;
                font-size: 12px !important;
                line-height: 34px !important;
                box-shadow: none !important;
                outline: none !important;
                text-transform: uppercase;
            }

            .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-avatar-color-action-row {
                display: flex;
                align-items: stretch;
                gap: 6px;
                min-width: 0;
            }

            .acu-avatar-color-action-row input.acu-avatar-color-hex,
            .acu-avatar-color-action-row input.acu-avatar-color-hex:focus {
                flex: 1 1 auto;
                width: auto !important;
            }

            .acu-avatar-color-generate-btn {
                flex: 0 0 auto;
                min-width: 94px;
                height: 34px;
                padding: 0 10px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 12px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s;
            }

            .acu-avatar-color-generate-btn:hover {
                border-color: var(--acu-accent);
                background: var(--acu-btn-hover);
                color: var(--acu-accent);
            }

            /* 上传与保存采用紧凑图标按钮 */
            .acu-avatar-upload-trigger {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                margin: 0;
                box-sizing: border-box;
                font-size: 12px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                cursor: pointer;
                transition: all 0.2s;
            }
            .acu-avatar-upload-trigger:hover {
                background: var(--acu-btn-hover);
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }

            /* 底部操作栏 */
            .acu-avatar-expanded-footer {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 8px;
                margin-top: 4px;
            }

            .acu-avatar-footer-actions {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 8px;
                flex-wrap: nowrap;
            }

            .acu-btn-action {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .acu-btn-action:hover {
                background: var(--acu-btn-hover) !important;
                color: var(--acu-accent) !important;
            }
            
            .acu-avatar-reset-settings-btn {
                width: auto !important;
                min-width: 68px !important;
                padding: 0 10px !important;
                gap: 6px !important;
                color: var(--acu-text-main) !important;
                white-space: nowrap;
            }

            .acu-avatar-reset-settings-btn:hover {
                border-color: var(--acu-error-text, #e74c3c) !important;
                color: var(--acu-error-text, #e74c3c) !important;
            }

            .acu-avatar-save-btn {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
                width: 34px !important;
                height: 34px !important;
                min-width: 34px !important;
                min-height: 34px !important;
                font-size: 12px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                background: var(--acu-btn-bg) !important;
                color: var(--acu-text-main) !important;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            .acu-avatar-save-btn:hover {
                background: var(--acu-btn-hover) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-accent) !important;
            }
            
            .acu-btn-delete:hover { color: var(--acu-error-text, #e74c3c) !important; border-color: var(--acu-error-text, #e74c3c) !important; }

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
            
            /* Tag Input Container - 与URL容器和搜索框统一样式 */
            .acu-alias-tags-container {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                background: var(--acu-input-bg);
                min-height: 36px;
                cursor: text;
                box-sizing: border-box;
                align-items: center;
                transition: border-color 0.2s ease;
            }
            .acu-alias-tags-container:focus-within {
                border-color: var(--acu-accent);
            }

            /* Tag Item - 透明边框风格，与URL输入统一 */
            .acu-alias-tag {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 8px;
                background: transparent;
                color: var(--acu-text-main);
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.4;
                border: 1px solid var(--acu-border);
                user-select: none;
                transition: all 0.2s ease;
                max-width: 100%;
                animation: acu-slide-in 0.2s cubic-bezier(0.2, 0, 0.2, 1) forwards;
            }
            .acu-alias-tag:hover {
                border-color: var(--acu-accent);
                color: var(--acu-accent);
            }

            /* Tag Delete Icon - 简洁风格 */
            .acu-alias-tag i {
                cursor: pointer;
                opacity: 0.4;
                font-size: 10px;
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
                margin-right: -2px;
            }
            .acu-alias-tag i:hover {
                opacity: 1;
                color: var(--acu-error-text, #e74c3c);
            }

            /* 别名输入框 - 无边框无背景，融入容器 */
            .acu-avatar-manager-overlay .acu-alias-tags-container > input.acu-alias-input,
            .acu-avatar-manager-overlay .acu-alias-tags-container > input.acu-alias-input:focus {
                border: 0 !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 2px 0;
                font-size: 12px !important;
                color: var(--acu-text-main) !important;
                flex: 1;
                min-width: 80px;
                outline: none !important;
                box-shadow: none !important;
                height: 24px;
                line-height: 24px;
                border-radius: 0 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
            }
            .acu-alias-input::placeholder {
                color: var(--acu-text-sub);
                opacity: 0.6;
            }

            /* Animation - 进场动画 */
            @keyframes acu-slide-in {
                from { opacity: 0; transform: scale(0.95) translateY(2px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            /* Mobile Optimization - 触控友好适配 */
            @media (hover: none) and (pointer: coarse) {
                .acu-alias-tags-container {
                    padding: 6px 8px;
                    gap: 6px;
                    min-height: 40px;
                }
                .acu-alias-tag {
                    padding: 4px 10px;
                    font-size: 12px;
                    border-radius: 4px;
                }
                .acu-alias-tag i {
                    width: 18px;
                    height: 18px;
                    font-size: 11px;
                    margin-right: -4px;
                }
                .acu-alias-input {
                    height: 28px;
                    font-size: 12px;
                }
            }

            .acu-avatar-import-btn,
            .acu-avatar-export-btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
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
                .acu-avatar-manager-overlay {
                    padding: 10px;
                }
                .acu-avatar-manager {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 20px);
                    height: calc(100dvh - 20px);
                    max-height: calc(100vh - 20px);
                    max-height: calc(100dvh - 20px);
                }
                .acu-avatar-item {
                    padding: 10px 8px;
                }
                .acu-avatar-row-collapsed {
                    gap: 8px;
                }
                .acu-avatar-identity-tools {
                    gap: 6px;
                }
                .acu-avatar-color-container {
                    flex-wrap: nowrap;
                    gap: 5px;
                }
                .acu-avatar-manager-overlay input.acu-avatar-color-hex,
                .acu-avatar-manager-overlay input.acu-avatar-color-hex:focus {
                    width: 100% !important;
                    min-width: 78px;
                }
                .acu-avatar-color-popover {
                    width: 210px;
                }
                .acu-avatar-footer-actions {
                    display: flex;
                    width: 100%;
                    gap: 6px;
                    justify-content: flex-end;
                }
                .acu-avatar-upload-trigger,
                .acu-avatar-save-btn {
                    width: 34px !important;
                }
            }

            /* ========== 头像管理器视图切换与排序 ========== */
/* ========== 头像管理器工具栏 v3 ========== */

            /* 标题栏操作按钮区域 */
            .acu-avatar-header-actions {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* 标题栏中的按钮统一样式 */
            .acu-avatar-header-actions .acu-btn-icon {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-header-actions .acu-btn-icon:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            /* 关闭按钮与其他按钮对齐 */
            .acu-avatar-header-actions .acu-avatar-close {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-header-actions .acu-avatar-close:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            /* 工具栏中的搜索框 */
            .acu-toolbar-group .acu-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                width: 100px;
                transition: color var(--acu-motion-fast) var(--acu-ease-standard);
                flex-shrink: 0;
            }

            .acu-toolbar-group .acu-search-wrapper:focus-within {
                width: 140px;
            }

            .acu-toolbar-group .acu-search-icon {
                position: absolute;
                left: 8px;
                color: var(--acu-text-sub);
                pointer-events: none;
                font-size: 11px;
                z-index: 1;
            }

            .acu-toolbar-group .acu-avatar-search {
                width: 100%;
                height: 34px !important;
                min-height: 34px !important;
                max-height: 34px !important;
                padding: 0 24px 0 26px !important;
                margin: 0 !important;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                line-height: 32px !important;
            }

            .acu-toolbar-group .acu-avatar-search:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-toolbar-group .acu-avatar-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7;
            }

            .acu-toolbar-group .acu-search-clear {
                position: absolute;
                right: 2px;
                width: 30px;
                height: 30px;
                border: 0;
                background: transparent;
                cursor: pointer;
                color: var(--acu-text-sub);
                font-size: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .acu-toolbar-group .acu-search-clear:hover {
                color: var(--acu-text-main);
            }

            /* 旧样式保留以防兼容问题 */
            .acu-avatar-header-actions .acu-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                width: 100px;
                transition: color var(--acu-motion-fast) var(--acu-ease-standard);
            }

            .acu-avatar-header-actions .acu-search-wrapper:focus-within {
                width: 140px;
            }

            .acu-avatar-header-actions .acu-search-icon {
                position: absolute;
                left: 8px;
                color: var(--acu-text-sub);
                pointer-events: none;
                font-size: 11px;
            }

            .acu-avatar-header-actions .acu-avatar-search {
                width: 100%;
                height: 28px;
                padding: 0 24px 0 26px !important;
                background: var(--acu-input-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                box-shadow: none !important;
                outline: none !important;
            }

            .acu-avatar-header-actions .acu-avatar-search:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-avatar-header-actions .acu-avatar-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.7;
            }

            .acu-avatar-header-actions .acu-search-clear {
                position: absolute;
                right: 2px;
                width: 30px;
                height: 30px;
                border: 0;
                background: transparent;
                cursor: pointer;
                color: var(--acu-text-sub);
                font-size: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .acu-avatar-header-actions .acu-search-clear:hover {
                color: var(--acu-text-main);
            }

            /* 工具栏 */
            .acu-avatar-toolbar {
                display: flex;
                flex-wrap: nowrap;
                gap: 6px;
                padding: 8px 12px;
                background-color: var(--acu-bg-panel);
                border-bottom: 1px solid var(--acu-border);
                align-items: center;
                justify-content: flex-start;
            }

            .acu-toolbar-group {
                display: flex;
                flex-wrap: nowrap;
                gap: 6px;
                align-items: center;
                min-width: 0;
            }

            .acu-toolbar-group.left {
                flex: 1 1 auto;
                min-width: 0;
                width: 100%;
            }

            .acu-toolbar-group.right {
                flex-shrink: 0;
            }

            /* 图标按钮 */
            .acu-avatar-manager-overlay .acu-btn-icon {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background-color: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .acu-avatar-manager-overlay .acu-btn-icon:hover {
                background-color: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            .acu-avatar-manager-overlay .acu-btn-icon.active {
                background-color: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            /* 下拉框 */
            .acu-select-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select {
                height: 34px !important;
                min-height: 34px !important;
                max-height: 34px !important;
                padding: 0 24px 0 8px !important;
                margin: 0 !important;
                background: var(--acu-btn-bg) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 4px !important;
                color: var(--acu-text-main) !important;
                font-size: 11px !important;
                cursor: pointer;
                appearance: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23888' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E") !important;
                background-repeat: no-repeat !important;
                background-position: right 8px center !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                line-height: 32px !important;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select option {
                background: var(--acu-bg-panel) !important;
                color: var(--acu-text-main) !important;
            }

            .acu-avatar-manager-overlay .acu-toolbar-select:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: none !important;
            }

            .acu-select-wrapper.sort-field .acu-toolbar-select {
                min-width: 60px;
            }

            .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-avatar-filter-controls {
                width: 100%;
                align-items: center;
                flex-wrap: nowrap;
            }

            .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-toolbar-group .acu-search-wrapper {
                flex: 1 1 170px;
                width: auto;
                min-width: 112px;
                max-width: 340px;
                margin-left: auto;
            }

            .acu-avatar-manager-overlay .acu-sort-menu {
                position: relative;
                flex-shrink: 0;
            }

            .acu-avatar-manager-overlay .acu-sort-trigger {
                min-width: 72px;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                background-image: none !important;
                text-align: left;
            }

            .acu-avatar-manager-overlay .acu-sort-label {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-avatar-manager-overlay .acu-sort-trigger .fa-caret-down {
                font-size: 10px;
                color: var(--acu-text-sub);
                transition: transform 0.16s ease;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-trigger {
                border-color: var(--acu-accent) !important;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-trigger .fa-caret-down {
                transform: rotate(180deg);
            }

            .acu-avatar-manager-overlay .acu-sort-menu-list {
                display: none;
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                min-width: 100%;
                padding: 4px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                box-shadow: 0 8px 24px var(--acu-shadow);
                z-index: 2;
            }

            .acu-avatar-manager-overlay .acu-sort-menu.open .acu-sort-menu-list {
                display: grid;
                gap: 2px;
            }

            .acu-avatar-manager-overlay .acu-sort-option {
                width: 100%;
                height: 32px;
                padding: 0 10px;
                border: 0;
                border-radius: 4px;
                background: transparent;
                color: var(--acu-text-main);
                font-size: 12px;
                text-align: left;
                cursor: pointer;
            }

            .acu-avatar-manager-overlay .acu-sort-option:hover {
                background: var(--acu-btn-hover);
            }

            .acu-avatar-manager-overlay .acu-sort-option.active {
                background: var(--acu-accent);
                color: var(--acu-button-text-on-accent);
            }

            /* 移动端响应式 - 搜索框更紧凑 */
            @media (max-width: 500px) {
                .acu-avatar-toolbar {
                    padding: 8px;
                    gap: 5px;
                }
                .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-avatar-filter-controls {
                    gap: 5px;
                }
                .acu-avatar-manager-overlay:not(.acu-custom-table-name-icon-manager-overlay) .acu-toolbar-group .acu-search-wrapper {
                    order: 0;
                    flex: 1 1 72px;
                    width: 100%;
                    max-width: none;
                    min-width: 72px;
                    margin-left: 0;
                }
                .acu-avatar-manager-overlay .acu-sort-trigger {
                    min-width: 66px;
                    max-width: 84px;
                    gap: 5px;
                    padding-left: 7px !important;
                    padding-right: 7px !important;
                }
                .acu-toolbar-group .acu-avatar-search {
                    padding-left: 22px !important;
                    padding-right: 22px !important;
                }
                .acu-toolbar-group .acu-search-icon {
                    left: 7px;
                }
                .acu-toolbar-group .acu-search-clear {
                    width: 24px;
                }
                .acu-avatar-header-actions .acu-search-wrapper {
                    width: 80px;
                }
                .acu-avatar-header-actions .acu-search-wrapper:focus-within {
                    width: 100px;
                }
            }

            /* ========== 图标预设管理器 ========== */
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager {
                width: min(96vw, 1120px);
                max-width: 1120px;
                max-height: calc(100vh - 40px);
                max-height: calc(100dvh - 40px);
                min-height: min(620px, calc(100vh - 40px));
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-guide-top {
                flex: 0 0 auto;
                background: color-mix(in srgb, var(--acu-bg-panel) 92%, var(--acu-card-bg, var(--acu-bg-panel)) 8%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-panel-header {
                padding: 14px 18px;
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-title {
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-title i {
                color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-avatar-header-actions {
                gap: 8px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-btn-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-file-input {
                display: none;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager .acu-btn-icon:focus-visible,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:focus-visible,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:focus-visible {
                outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
                outline-offset: 2px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                flex-wrap: wrap;
                align-items: stretch;
                gap: 10px;
                flex-shrink: 0;
                padding: 12px 18px;
                background: color-mix(in srgb, var(--acu-table-head) 72%, transparent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls {
                flex: 0 1 340px;
                flex-wrap: nowrap;
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-select-wrapper {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select {
                min-width: 120px !important;
                max-width: 190px;
                height: 38px !important;
                min-height: 38px !important;
                max-height: 38px !important;
                border-radius: 8px !important;
                font-size: 12px !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select:hover,
            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select:focus {
                border-color: color-mix(in srgb, var(--acu-accent) 68%, var(--acu-border)) !important;
                background-color: color-mix(in srgb, var(--acu-input-bg, var(--acu-btn-bg)) 86%, var(--acu-accent) 14%) !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-table-filter {
                min-width: 150px !important;
                max-width: 230px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                flex: 1 1 220px;
                min-width: 160px;
                width: 100% !important;
                transition: none;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-toolbar-group .acu-custom-icon-search-wrapper:focus-within {
                width: 100% !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper .acu-search-icon {
                position: absolute;
                left: 10px;
                color: var(--acu-text-sub);
                pointer-events: none;
                z-index: 1;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                width: 100%;
                height: 38px !important;
                min-height: 38px !important;
                padding: 0 12px 0 32px !important;
                margin: 0 !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 8px !important;
                color: var(--acu-text-main) !important;
                box-shadow: none !important;
                outline: none !important;
                box-sizing: border-box !important;
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 22%, transparent) !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search::placeholder {
                color: var(--acu-text-sub) !important;
                opacity: 0.75;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-actions {
                flex: 0 0 auto;
                margin-left: 0;
                flex-wrap: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn {
                min-height: 36px;
                padding: 8px 12px;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:hover {
                border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
                color: var(--acu-text-main);
                transform: translateY(-1px);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn:active {
                transform: translateY(0);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-body {
                display: grid;
                grid-template-columns: minmax(300px, 0.95fr) minmax(340px, 1.05fr);
                flex: 1 1 auto;
                min-height: 0;
                overflow: hidden;
                border-top: 1px solid var(--acu-border);
                background: color-mix(in srgb, var(--acu-bg-panel) 94%, var(--acu-table-head) 6%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                min-height: 0;
                overflow-y: auto;
                overscroll-behavior: contain;
                -ms-overflow-style: none;
                scrollbar-width: none;
                -webkit-overflow-scrolling: touch;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list::-webkit-scrollbar,
            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list {
                border-right: 1px solid var(--acu-border);
                padding: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-empty-note {
                color: var(--acu-text-sub);
                font-size: 11px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item {
                cursor: pointer;
                border: 1px solid transparent;
                border-radius: 8px;
                margin-bottom: 6px;
                padding: 10px 12px;
                transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:last-child {
                margin-bottom: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:hover {
                background: color-mix(in srgb, var(--acu-table-hover) 86%, transparent);
                border-color: color-mix(in srgb, var(--acu-border) 76%, var(--acu-accent) 24%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item.is-selected {
                background: color-mix(in srgb, var(--acu-table-hover) 82%, var(--acu-accent) 10%);
                border-color: color-mix(in srgb, var(--acu-accent) 56%, var(--acu-border));
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acu-accent) 18%, transparent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item:focus-visible {
                outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
                outline-offset: 2px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item .acu-avatar-row-collapsed {
                gap: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list-info {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list-name {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-wrap: wrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview {
                width: 46px;
                height: 46px;
                border-radius: 10px;
                border-width: 1px;
                cursor: default;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-source {
                bottom: -8px;
                border: 1px solid color-mix(in srgb, var(--acu-border) 78%, transparent);
                background: color-mix(in srgb, var(--acu-bg-panel) 78%, var(--acu-badge-bg) 22%);
                color: var(--acu-text-main);
                font-size: 10px;
                line-height: 1.1;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-name {
                max-width: 100%;
                min-width: 0;
                font-size: 15px;
                line-height: 1.35;
                margin-bottom: 3px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-name > span:first-child {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-missing-text {
                color: var(--acu-warning-text);
                margin-left: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-avatar-url-preview {
                max-width: 100%;
                line-height: 1.45;
                opacity: 0.88;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                padding: 16px;
                background: color-mix(in srgb, var(--acu-bg-panel) 90%, var(--acu-table-head) 10%);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-panel {
                display: flex;
                flex-direction: column;
                gap: 16px;
                min-height: 100%;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-head {
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 14px;
                border-bottom: 1px dashed var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-title {
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
                color: var(--acu-text-main);
                font-size: 12px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-url-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                min-width: 0;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-local-status {
                color: var(--acu-warning-text);
                font-size: 11px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                width: 100%;
                min-height: 42px;
                padding: 0 12px;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 8px !important;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                box-sizing: border-box;
                transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url:focus {
                border-color: var(--acu-accent) !important;
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 20%, transparent) !important;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-warning {
                display: flex;
                align-items: flex-start;
                gap: 7px;
                padding: 9px 10px;
                border: 1px solid color-mix(in srgb, var(--acu-warning-text) 48%, var(--acu-border));
                border-radius: 8px;
                background: var(--acu-warning-bg);
                color: var(--acu-warning-text);
                font-size: 12px;
                line-height: 1.45;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
                gap: 10px;
                margin-top: auto;
                padding-top: 12px;
                border-top: 1px dashed var(--acu-border);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                flex: 1 1 118px;
                min-width: 0;
                min-height: 42px;
                padding: 8px 10px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                border-radius: 8px;
                transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:hover {
                border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
                background: var(--acu-btn-hover);
                transform: translateY(-1px);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn:active {
                transform: translateY(0);
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save-local {
                display: none !important;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local {
                font-size: 0;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local i {
                font-size: 14px;
                margin-right: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local::after {
                content: "上传";
                font-size: 14px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save {
                font-size: 0;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save i {
                font-size: 14px;
                margin-right: 6px;
            }

            .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save::after {
                content: "保存";
                font-size: 14px;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-save-hint {
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.45;
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-primary-btn {
                background: var(--acu-accent);
                color: var(--acu-btn-active-text);
                border-color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-primary-btn:hover {
                color: var(--acu-btn-active-text);
                background: color-mix(in srgb, var(--acu-accent) 86%, var(--acu-text-main) 14%);
                border-color: var(--acu-accent);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-danger-btn {
                color: var(--acu-error-text);
            }

            .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-danger-btn:hover {
                color: var(--acu-error-text);
                border-color: color-mix(in srgb, var(--acu-error-text) 62%, var(--acu-border));
                background: var(--acu-error-bg);
            }

            @media (prefers-reduced-motion: reduce) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                    transition: none;
                }
            }

            @media (max-width: 768px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-manager {
                    width: calc(100vw - 16px);
                    height: calc(100vh - 16px);
                    height: calc(100dvh - 16px);
                    max-height: calc(100vh - 16px);
                    max-height: calc(100dvh - 16px);
                    min-height: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    display: grid;
                    grid-template-columns: minmax(86px, 0.9fr) minmax(96px, 1fr) 42px 42px minmax(96px, 1.1fr);
                    grid-template-areas: "module table import export search";
                    gap: 6px;
                    align-items: center;
                    padding: 10px 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls {
                    display: contents;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls .acu-select-wrapper:nth-of-type(1) {
                    grid-area: module;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-filter-controls .acu-select-wrapper:nth-of-type(2) {
                    grid-area: table;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-table-filter,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                    min-width: 0 !important;
                    max-width: none;
                    width: 100%;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper {
                    grid-area: search;
                    height: 40px;
                    width: 100% !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-group .acu-custom-icon-search-wrapper:focus-within {
                    width: 100% !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-actions {
                    grid-area: pack;
                    display: contents;
                    margin-left: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-pack-btn {
                    width: 100%;
                    min-width: 0;
                    height: 40px;
                    min-height: 40px;
                    padding: 0;
                    border-radius: 8px;
                    justify-content: center;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-import {
                    grid-area: import;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-export {
                    grid-area: export;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search,
                .acu-custom-table-name-icon-manager-overlay .acu-toolbar-select {
                    height: 40px !important;
                    min-height: 40px !important;
                    font-size: 13px !important;
                    border-radius: 8px !important;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                    padding-left: 30px !important;
                    padding-right: 6px !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-search-wrapper .acu-search-icon {
                    left: 10px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-action-label {
                    display: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-body {
                    grid-template-columns: 1fr;
                    grid-template-rows: minmax(0, 1fr) auto;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list {
                    border-right: 0;
                    border-bottom: 1px solid var(--acu-border);
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    position: relative;
                    border-top: 1px solid var(--acu-border);
                    background: color-mix(in srgb, var(--acu-bg-panel) 92%, var(--acu-table-head) 8%);
                    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--acu-text-main) 10%, transparent);
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail::before {
                    content: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-list,
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    padding: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail {
                    padding-top: 8px;
                    padding-bottom: max(8px, env(safe-area-inset-bottom));
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-table-name-icon-item {
                    padding: 8px 10px;
                    margin-bottom: 5px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-row-collapsed {
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-preview {
                    width: 38px;
                    height: 38px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-name {
                    font-size: 13px;
                    margin-bottom: 0;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-avatar-url-preview {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 11px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-panel {
                    min-height: 0;
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-head {
                    display: none;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form {
                    gap: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-form label {
                    gap: 5px !important;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-url {
                    padding: 7px 9px !important;
                    min-height: 36px;
                    font-size: 12px !important;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-url-label {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-local-status {
                    max-width: 55%;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-actions {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 6px;
                    margin-top: auto;
                    padding-top: 8px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn {
                    flex: 0 1 auto;
                    min-width: 0;
                    width: 100%;
                    min-height: 38px;
                    padding: 0 4px;
                    justify-content: center;
                    white-space: nowrap;
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-detail-btn i {
                    margin-right: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save i,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local i {
                    margin-right: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-save::after,
                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-pick-local::after {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input {
                    font-size: 0;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input i {
                    font-size: 12px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-clear-input::after {
                    content: "清空";
                    font-size: 12px;
                }
            }

            @media (max-width: 520px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    grid-template-columns: minmax(78px, 0.9fr) minmax(88px, 1fr) 40px 40px minmax(78px, 1.1fr);
                }
            }

            @media (max-width: 420px) {
                .acu-custom-table-name-icon-manager-overlay .acu-custom-icon-toolbar {
                    grid-template-columns: minmax(72px, 0.9fr) minmax(80px, 1fr) 40px 40px minmax(64px, 1.1fr);
                    gap: 5px;
                    padding-inline: 10px;
                }

                .acu-custom-table-name-icon-manager-overlay #acu-custom-icon-search {
                    font-size: 12px !important;
                }
            }

            .acu-system-confirm-overlay,
            .acu-custom-icon-confirm-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                min-height: 100vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 32100 !important;
                padding: 16px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                transform: none !important;
                background: transparent !important;
                backdrop-filter: none !important;
            }

            .acu-system-confirm-dialog,
            .acu-custom-icon-confirm-dialog {
                width: min(420px, calc(100vw - 32px)) !important;
                max-width: calc(100vw - 32px) !important;
                max-height: calc(100vh - 32px) !important;
                max-height: calc(100dvh - 32px) !important;
                margin: auto !important;
                transform: none !important;
            }

            .acu-system-input-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                min-height: 100vh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 32100 !important;
                padding: 16px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                transform: none !important;
                background: transparent !important;
                backdrop-filter: none !important;
            }

            .acu-system-input-dialog {
                width: min(460px, calc(100vw - 32px)) !important;
                max-width: calc(100vw - 32px) !important;
                max-height: calc(100vh - 32px) !important;
                max-height: calc(100dvh - 32px) !important;
                margin: auto !important;
                transform: none !important;
            }

            .acu-system-input-content {
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 0;
            }

            .acu-system-input-label {
                color: var(--acu-text-main);
                font-size: 13px;
                font-weight: 600;
                line-height: 1.4;
            }

            .acu-system-input-detail {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.55;
            }

            .acu-system-input-control {
                width: 100%;
                min-height: 38px;
                padding: 9px 10px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 7px !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 13px !important;
                line-height: 1.5;
                box-sizing: border-box !important;
            }

            textarea.acu-system-input-control {
                min-height: 132px;
                max-height: min(280px, 45dvh);
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
            }

            .acu-system-input-control:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-system-input-control[readonly] {
                cursor: text;
            }

            .acu-system-confirm-content,
            .acu-custom-icon-confirm-content {
                padding-bottom: 4px;
            }

            .acu-system-confirm-detail,
            .acu-custom-icon-confirm-detail {
                margin-top: 12px;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-btn-bg);
                color: var(--acu-text-main);
                font-size: 12px;
                line-height: 1.6;
                text-align: left;
                max-height: min(180px, 35dvh);
                overflow-y: auto;
            }

            .acu-system-confirm-overlay .acu-import-warning-icon.warning,
            .acu-custom-icon-confirm-overlay .acu-import-warning-icon.warning {
                background: var(--acu-warning-bg, rgba(243, 156, 18, 0.15));
                color: var(--acu-warning-text, var(--acu-warning-icon, #f39c12));
            }

            .acu-system-confirm-overlay .acu-import-warning-icon.danger,
            .acu-custom-icon-confirm-overlay .acu-import-warning-icon.danger {
                background: var(--acu-error-bg, rgba(231, 76, 60, 0.15));
                color: var(--acu-error-text, #e74c3c);
            }

            .acu-system-confirm-overlay .acu-import-confirm-btn.warning,
            .acu-custom-icon-confirm-overlay .acu-import-confirm-btn.warning {
                background: var(--acu-accent) !important;
                border-color: var(--acu-accent) !important;
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff)) !important;
            }

            .acu-system-confirm-overlay .acu-import-confirm-btn.danger,
            .acu-custom-icon-confirm-overlay .acu-import-confirm-btn.danger {
                background: var(--acu-error-text, #e74c3c) !important;
                border-color: var(--acu-error-text, #e74c3c) !important;
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff)) !important;
            }

            .acu-msg-overlay {
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                height: 100dvh !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 31100 !important;
                padding: 16px;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.5);
                color: var(--acu-text-main);
            }

            .acu-msg-dialog {
                width: min(320px, calc(100vw - 32px));
                max-width: calc(100vw - 32px);
                padding: 16px;
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                background: var(--acu-bg-panel);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            }

            .acu-msg-title {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 12px;
                color: var(--acu-accent);
                font-size: 14px;
                font-weight: 700;
                line-height: 1.35;
            }

            .acu-msg-input {
                width: 100%;
                min-height: 38px;
                padding: 10px 12px !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px !important;
                background: var(--acu-input-bg, var(--acu-btn-bg)) !important;
                color: var(--acu-text-main) !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
            }

            .acu-msg-input:focus {
                outline: none !important;
                border-color: var(--acu-accent) !important;
                box-shadow: var(--acu-focus-ring) !important;
            }

            .acu-msg-actions {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px;
                margin-top: 12px;
            }

            .acu-msg-cancel,
            .acu-msg-send {
                min-height: 38px;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 700;
            }

            .acu-msg-cancel {
                border: 1px solid var(--acu-border);
                background: var(--acu-input-bg, var(--acu-btn-bg));
                color: var(--acu-text-main);
            }

            .acu-msg-send {
                border: 1px solid var(--acu-btn-active-bg, var(--acu-accent));
                background: var(--acu-btn-active-bg, var(--acu-accent));
                color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
            }

            .acu-msg-cancel:hover,
            .acu-msg-cancel:focus-visible {
                border-color: var(--acu-accent);
                background: var(--acu-table-hover);
                color: var(--acu-accent);
            }

            .acu-msg-send:hover,
            .acu-msg-send:focus-visible {
                filter: brightness(1.05);
            }

            @media (max-width: 480px) {
                .acu-system-confirm-overlay,
                .acu-custom-icon-confirm-overlay {
                    padding: 12px !important;
                }

                .acu-system-confirm-dialog,
                .acu-custom-icon-confirm-dialog,
                .acu-system-input-dialog {
                    width: calc(100vw - 24px) !important;
                    max-width: calc(100vw - 24px) !important;
                    max-height: calc(100dvh - 24px) !important;
                }

                .acu-system-confirm-overlay .acu-import-confirm-footer,
                .acu-custom-icon-confirm-overlay .acu-import-confirm-footer {
                    padding: 12px;
                    gap: 8px;
                }

                .acu-system-confirm-overlay .acu-import-cancel-btn,
                .acu-system-confirm-overlay .acu-import-confirm-btn,
                .acu-custom-icon-confirm-overlay .acu-import-cancel-btn,
                .acu-custom-icon-confirm-overlay .acu-import-confirm-btn {
                    min-height: 40px;
                    padding: 9px 10px;
                }
            }

            /* ========== 删除确认弹窗样式 ========== */
            .acu-delete-confirm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 31500;
                backdrop-filter: blur(4px);
                padding: 16px;
                box-sizing: border-box;
            }

            .acu-delete-confirm-modal {
                width: 90%;
                max-width: 420px;
                max-height: calc(100vh - 32px);
                max-height: calc(100dvh - 32px);
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden;
                animation: acu-modal-pop 0.2s ease-out;
                display: flex;
                flex-direction: column;
            }

            @keyframes acu-modal-pop {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .acu-delete-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                color: var(--acu-accent);
                font-size: 14px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .acu-delete-header i {
                font-size: 16px;
            }

            .acu-delete-content {
                padding: 20px;
                flex: 1;
                min-height: 0;
                overflow-y: auto;
            }

            .acu-delete-character-info {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 12px;
                background: var(--acu-table-head);
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .acu-delete-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--acu-btn-bg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
                color: var(--acu-text-sub);
                overflow: hidden;
                flex-shrink: 0;
            }

            .acu-delete-avatar.has-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .acu-delete-name {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
            }

            .acu-delete-section-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: bold;
                color: var(--acu-text-sub);
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .acu-delete-section-title i {
                font-size: 11px;
            }

            .acu-delete-table-preview {
                margin-bottom: 16px;
            }

            .acu-delete-table-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 10px;
                background: var(--acu-btn-bg);
                border-radius: 6px;
                border: 1px solid var(--acu-border);
            }

            .acu-delete-cell {
                font-size: 12px;
                color: var(--acu-text-sub);
            }

            .acu-delete-cell strong {
                color: var(--acu-text-main);
            }

            .acu-delete-relationships {
                margin-bottom: 16px;
            }

            .acu-delete-ref-list {
                list-style: none;
                padding: 0;
                margin: 0;
                background: var(--acu-btn-bg);
                border-radius: 6px;
                border: 1px solid var(--acu-border);
                padding: 8px 12px;
            }

            .acu-delete-ref-list li {
                font-size: 12px;
                color: var(--acu-text-sub);
                padding: 4px 0;
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-delete-ref-list li:last-child {
                border-bottom: none;
            }

            .acu-delete-ref-list li strong {
                color: var(--acu-text-main);
            }

            .acu-delete-warning {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 12px;
                background: var(--acu-warning-bg, rgba(243, 156, 18, 0.15));
                border: 1px solid var(--acu-warning-text, #f39c12);
                border-radius: 8px;
                font-size: 12px;
                color: var(--acu-warning-text, #f39c12);
            }

            .acu-delete-warning i {
                font-size: 14px;
                flex-shrink: 0;
                margin-top: 1px;
            }

            .acu-delete-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }

            .acu-delete-cancel-btn,
            .acu-delete-confirm-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            .acu-delete-cancel-btn {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                color: var(--acu-text-sub);
            }

            .acu-delete-cancel-btn:hover {
                background: var(--acu-btn-hover);
                color: var(--acu-text-main);
            }

            .acu-delete-confirm-btn {
                background: var(--acu-accent);
                border: none;
                color: var(--acu-button-text-on-accent, #fff);
            }

            .acu-delete-confirm-btn:hover {
                filter: brightness(1.1);
                transform: translateY(-1px);
                color: var(--acu-button-text-on-accent, #fff);
            }

            /* ========== [Redesign] 删除确认弹窗新样式 ========== */
            .acu-delete-confirm-modal.redesign {
                width: 400px;
                max-width: 95vw;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid var(--acu-border);
                background: var(--acu-bg-panel);
                box-shadow: 0 24px 48px rgba(0,0,0,0.6);

                /* 语义化变量映射：使用主题变量 */
                --c-destruct: var(--acu-error-text, #e74c3c);
                --c-destruct-bg: var(--acu-error-bg, rgba(231, 76, 60, 0.15));
                --c-warning: var(--acu-hl-manual, #e67e22);
                --c-warning-bg: var(--acu-hl-manual-bg, rgba(230, 126, 34, 0.15));
                --c-caution: var(--acu-warning-text, #f1c40f);
                --c-caution-bg: var(--acu-warning-bg, rgba(241, 196, 15, 0.15));
            }

            /* 头部 - destruct 样式 */
            .acu-delete-header.destruct {
                background: var(--c-destruct-bg);
                color: var(--c-destruct);
                border-bottom: 1px solid var(--c-destruct-bg);
                font-size: 15px;
                padding: 16px 20px;
                position: relative;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* 关闭按钮 (×) */
            .acu-delete-close-btn {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                width: 28px;
                height: 28px;
                border: none;
                background: transparent;
                color: var(--c-destruct);
                font-size: 16px;
                cursor: pointer;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s;
                opacity: 0.7;
            }

            .acu-delete-close-btn:hover {
                opacity: 1;
                background: var(--c-destruct-bg);
            }

            /* 分区卡片通用 */
            .acu-del-section {
                border-radius: 8px;
                border: 1px solid var(--acu-border);
                overflow: hidden;
            }

            .acu-del-section-head {
                padding: 8px 12px;
                font-size: 12px;
                font-weight: bold;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--acu-text-sub);
            }

            /* 状态色修饰 */
            .acu-del-section.destruct { border-color: var(--c-destruct-bg); }
            .acu-del-section.destruct .acu-del-section-head {
                color: var(--c-destruct);
                background: var(--c-destruct-bg);
                border-bottom-color: var(--c-destruct-bg);
            }

            .acu-del-section.warning { border-color: var(--c-warning-bg); }
            .acu-del-section.warning .acu-del-section-head {
                color: var(--c-warning);
                background: var(--c-warning-bg);
                border-bottom-color: var(--c-warning-bg);
            }

            .acu-del-section.caution { border-color: var(--c-caution-bg); }
            .acu-del-section.caution .acu-del-section-head {
                color: var(--c-caution);
                background: var(--c-caution-bg);
                border-bottom-color: var(--c-caution-bg);
            }

            /* 核心身份卡片 */
            .acu-del-card {
                padding: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--acu-btn-bg);
            }

            .acu-del-avatar-box {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: 2px solid var(--c-destruct);
                overflow: hidden;
                flex-shrink: 0;
                background: var(--acu-bg-panel);
            }

            .acu-del-avatar-box .acu-avatar-preview {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 0;
            }

            .acu-del-name {
                font-size: 16px;
                font-weight: bold;
                color: var(--acu-text-main);
            }

            .acu-del-meta {
                font-size: 12px;
                color: var(--acu-text-sub);
                margin-top: 2px;
            }

            .acu-del-info {
                flex: 1;
                min-width: 0;
            }

            /* 列表样式 */
            .acu-del-list {
                list-style: none;
                padding: 0;
                margin: 0;
                background: var(--acu-btn-bg);
            }

            .acu-del-list li {
                padding: 8px 12px;
                font-size: 13px;
                color: var(--acu-text-main);
                border-bottom: 1px solid var(--acu-border);
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }

            .acu-del-list li:last-child { border-bottom: none; }

            .acu-del-list li i {
                margin-top: 3px;
                font-size: 12px;
                color: var(--acu-text-sub);
                width: 16px;
                text-align: center;
            }

            .acu-del-list li strong { color: var(--acu-accent); }

            /* 别名子分组 */
            .acu-del-list li.sub-group {
                flex-direction: column;
                gap: 6px;
            }

            .acu-del-list .group-title {
                font-size: 12px;
                color: var(--acu-text-sub);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .acu-del-list .group-content {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }

            .acu-del-list .tag {
                font-size: 11px;
                padding: 2px 6px;
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 4px;
                color: var(--acu-text-sub);
            }

            .acu-del-list .group-warning {
                font-size: 12px;
                color: var(--c-warning);
                margin-top: 4px;
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .acu-del-list .group-warning .detail {
                opacity: 0.8;
                font-size: 11px;
            }

            /* 引用摘要 */
            .acu-del-summary {
                padding: 8px 12px;
                font-size: 12px;
                color: var(--acu-text-main);
                background: var(--acu-btn-bg);
                border-bottom: 1px solid var(--acu-border);
            }

            .acu-del-list.compact li {
                padding: 6px 12px;
                font-size: 12px;
            }

            .acu-del-list.compact li.more {
                color: var(--acu-text-sub);
                font-style: italic;
                padding-left: 38px;
            }

            /* 关系标签 */
            .acu-del-list .relation-tag {
                display: inline-block;
                font-size: 10px;
                padding: 1px 6px;
                background: var(--c-warning-bg);
                color: var(--c-warning);
                border-radius: 3px;
                margin-left: 4px;
                font-weight: normal;
            }

            /* 最终警告 */
            .acu-del-final-warn {
                font-size: 13px;
                color: var(--acu-text-sub);
                text-align: center;
                margin-top: 4px;
            }

            .acu-del-final-warn strong {
                color: var(--c-destruct);
            }

            /* 按钮 - destruct 样式 */
            .acu-delete-confirm-btn.destruct {
                background: var(--c-destruct);
                color: var(--acu-btn-active-text, #fff);
                border: 1px solid transparent;
            }

            .acu-delete-confirm-btn.destruct:hover {
                filter: brightness(0.9);
            }

            .acu-delete-confirm-btn.destruct:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                filter: grayscale(0.5);
            }

            /* 退出动画 */
            .acu-delete-confirm-overlay.closing .acu-delete-confirm-modal {
                transform: scale(0.9);
                opacity: 0;
                transition: all 0.2s ease-in;
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
                justify-content: space-between;
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
            .acu-stat-conflict .acu-stat-num { color: var(--acu-hl-manual); }
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
                border: 1px solid var(--acu-text-sub) !important;
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
                border: 1px solid var(--acu-text-sub);
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
                max-height: min(85dvh, calc(100dvh - 32px));
                padding: 0;
                gap: 0;
            }
            @media (max-width: 768px) {
                .acu-settings-dialog {
                    width: 92vw;
                    max-width: 92vw;
                    max-height: 85vh;
                    max-height: calc(100dvh - 24px);
                }
                .acu-settings-body {
                    max-height: calc(85vh - 110px);
                    max-height: calc(100dvh - 134px);
                    -webkit-overflow-scrolling: touch;
                }
                .acu-table-manager-list {
                    max-height: 40vh;
                    max-height: 40dvh;
                    -webkit-overflow-scrolling: touch;
                }
            }
            .acu-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 16px;
                gap: 12px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-settings-title-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .acu-settings-title {
                font-size: 16px;
                font-weight: 700;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                flex: 1 1 auto;
                line-height: 1.2;
            }
            .acu-settings-title-main {
                display: inline-flex;
                align-items: center;
                gap: 9px;
                min-width: 0;
            }
            .acu-settings-title-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--acu-text-main);
                font-size: 18px;
                line-height: 1;
            }
            .acu-settings-heading {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-header-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
                min-width: 0;
            }
            .acu-version-badge {
                display: inline-flex;
                align-items: center;
                min-height: 28px;
                line-height: 1.2;
                white-space: nowrap;
                letter-spacing: 0;
                background: transparent;
                color: var(--acu-text-sub);
                border-radius: 0;
                border: none;
                padding: 0 2px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 0;
                opacity: 0.72;
            }
            .acu-help-btn {
                width: 32px;
                height: 32px;
                min-width: 32px;
                min-height: 32px;
                background: transparent !important;
                border: 1px solid transparent !important;
                box-shadow: none !important;
                outline: none !important;
                color: var(--acu-text-sub);
                cursor: pointer;
                font-size: 15px;
                padding: 0;
                margin: 0;
                border-radius: 7px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                opacity: 0.86;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-help-btn:hover {
                color: var(--acu-accent);
                background: var(--acu-table-hover) !important;
                opacity: 1;
            }
            .acu-settings-dialog .acu-close-btn {
                width: 32px;
                height: 32px;
                min-width: 32px;
                min-height: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                border: 1px solid transparent !important;
                border-radius: 7px;
                background: transparent !important;
                color: var(--acu-text-sub);
                opacity: 0.86;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-settings-dialog .acu-close-btn:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-settings-dialog .acu-help-btn:focus-visible,
            .acu-settings-dialog .acu-close-btn:focus-visible,
            .acu-manual-update-btn:focus-visible {
                outline: none !important;
                box-shadow: var(--acu-focus-ring) !important;
                opacity: 1;
            }
            .acu-manual-update-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                min-width: 30px;
                min-height: 30px;
                background: transparent !important;
                color: var(--acu-text-sub);
                border: 1px solid transparent !important;
                box-shadow: none !important;
                outline: none !important;
                padding: 0;
                margin-left: 0;
                font-size: 13px;
                opacity: 0.82;
                cursor: pointer;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard);
                vertical-align: middle;
                line-height: 1;
            }
            .acu-manual-update-btn:hover {
                opacity: 1;
                color: var(--acu-accent, #3b82f6);
                background: var(--acu-table-hover) !important;
            }
            @media (max-width: 360px) {
                .acu-settings-header {
                    padding: 12px 14px;
                    gap: 10px;
                }
                .acu-settings-title {
                    gap: 8px;
                }
                .acu-version-badge {
                    font-size: 11px;
                }
            }
            /* 手动更新确认弹窗样式 */
            .acu-manual-update-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                height: 100dvh;
                background: rgba(0, 0, 0, 0.6);
                z-index: 31400;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 16px;
                box-sizing: border-box;
            }
            .acu-manual-update-dialog {
                background: var(--acu-bg-panel);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                width: 100%;
                max-width: 360px;
                max-height: calc(100vh - 32px);
                max-height: calc(100dvh - 32px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                position: relative;
                z-index: 1;
                display: flex;
                flex-direction: column;
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
                flex-shrink: 0;
            }
            .acu-manual-update-body {
                padding: 16px;
                color: var(--acu-text-main) !important;
                font-size: 13px;
                line-height: 1.6;
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
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
                flex-shrink: 0;
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
                border: 1px solid var(--acu-text-sub);
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
                justify-content: space-between;
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
            .acu-settings-group-title-main {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-settings-group-help {
                width: 28px;
                height: 28px;
                min-width: 28px;
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin-left: auto;
                border: 1px solid transparent !important;
                border-radius: 6px;
                background: transparent !important;
                box-shadow: none !important;
                color: var(--acu-text-sub) !important;
                font-size: 13px;
                opacity: 0.82;
                transform: none !important;
            }
            .acu-settings-group-help:hover {
                border-color: transparent !important;
                background: var(--acu-table-hover) !important;
                color: var(--acu-text-main) !important;
                opacity: 1;
                transform: none !important;
            }
            .acu-settings-group-help:focus:not(:focus-visible) {
                outline: none !important;
                box-shadow: none !important;
            }
            .acu-settings-group-help:focus-visible {
                outline: none !important;
                border-color: transparent !important;
                box-shadow: var(--acu-focus-ring) !important;
                opacity: 1;
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
                border-bottom: 1px solid color-mix(in srgb, var(--acu-border) 62%, transparent);
                gap: 12px;
                min-height: 44px;
            }
            .acu-setting-row:last-child {
                border-bottom: none;
            }
            .acu-setting-row[hidden] {
                display: none !important;
            }
            .acu-setting-dependent-row {
                margin-left: 24px;
                min-height: 40px;
            }
            .acu-setting-dependent-row .acu-setting-label {
                font-size: 12px;
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
            .acu-deprecated-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                margin-left: 5px;
                padding: 1px 5px;
                border: 1px solid color-mix(in srgb, var(--acu-text-sub) 28%, transparent);
                border-radius: 999px;
                background: color-mix(in srgb, var(--acu-badge-bg, var(--acu-btn-bg)) 74%, transparent);
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 600;
                line-height: 1.2;
                white-space: nowrap;
                vertical-align: 1px;
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
            .acu-setting-segmented {
                display: inline-flex;
                flex-wrap: nowrap;
                justify-content: flex-end;
                gap: 2px;
                max-width: min(100%, 320px);
                padding: 2px;
                border: 1px solid var(--acu-border);
                border-radius: 7px;
                background: var(--acu-input-bg, var(--acu-btn-bg));
                flex: 0 1 auto;
            }
            .acu-setting-segmented-option {
                flex: 0 1 auto;
                min-height: 28px;
                padding: 4px 9px;
                border: 1px solid transparent !important;
                border-radius: 5px !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                font-size: 12px;
                line-height: 1.2;
                white-space: nowrap;
                box-shadow: none !important;
                transform: none !important;
            }
            .acu-setting-segmented-option:hover {
                background: var(--acu-table-hover) !important;
                color: var(--acu-text-main) !important;
                border-color: var(--acu-border) !important;
            }
            .acu-setting-segmented-option.active,
            .acu-setting-segmented-option.active:hover {
                background: var(--acu-btn-active-bg) !important;
                color: var(--acu-btn-active-text) !important;
                border-color: var(--acu-btn-active-bg) !important;
                font-weight: 600;
            }
            .acu-setting-segmented-option:focus-visible {
                outline: none !important;
                box-shadow: var(--acu-focus-ring) !important;
            }
            .acu-setting-segmented-option:disabled {
                opacity: var(--acu-disabled-opacity);
                cursor: not-allowed;
            }
            @media (max-width: 380px) {
                .acu-settings-dialog .acu-setting-row {
                    align-items: stretch;
                    flex-direction: column;
                    gap: 8px;
                }
                .acu-settings-dialog .acu-setting-info {
                    width: 100%;
                }
                .acu-settings-dialog .acu-setting-dependent-row {
                    margin-left: 12px;
                }
                .acu-settings-dialog .acu-setting-select,
                .acu-settings-dialog .acu-stepper {
                    width: 100%;
                    min-width: 0;
                }
                .acu-settings-dialog .acu-stepper-btn {
                    flex: 1 1 0;
                    min-width: 44px;
                }
                .acu-settings-dialog .acu-stepper-value {
                    flex: 1.2 1 0;
                    min-width: 72px;
                }
                .acu-settings-dialog .acu-setting-segmented {
                    flex-wrap: wrap;
                    width: 100%;
                    max-width: none;
                    justify-content: stretch;
                }
                .acu-settings-dialog .acu-setting-segmented-option {
                    flex: 1 1 0;
                    min-width: 0;
                }
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
                display: grid;
                grid-template-columns: 32px minmax(0, 1fr) auto 28px;
                column-gap: 12px;
                align-items: center;
                padding: 10px 12px;
                background: var(--acu-card-bg);
                border: 1px solid rgba(var(--acu-accent-rgb, 128, 128, 128), 0.15);
                border-radius: 12px;
                margin-bottom: 10px;
                transition: all 0.14s ease-out;
                position: relative;
            }
            /* 简化布局：仅有 info + actions 两列的面板 */
            #acu-presets-list .acu-preset-item,
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                display: flex;
                gap: 12px;
            }
            #acu-presets-list .acu-preset-info,
            #acu-action-presets-list .acu-preset-info,
            #acu-dashboard-presets-list .acu-preset-info,
            #acu-render-presets-list .acu-preset-info,
            #acu-table-template-requirement-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-dashboard-presets-list .acu-preset-stats,
            #acu-render-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #acu-action-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-dashboard-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-render-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-table-template-requirement-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-action-presets-list .acu-preset-item,
            #acu-dashboard-presets-list .acu-preset-item,
            #acu-render-presets-list .acu-preset-item,
            #acu-table-template-requirement-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-action-presets-list .acu-preset-stats,
            #acu-table-template-requirement-presets-list .acu-preset-stats {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-item.acu-preset-hidden {
                opacity: 0.6;
                border-color: var(--acu-border);
            }
            .acu-preset-item:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.04);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border-color: var(--acu-accent);
                transform: translateY(-1px);
                z-index: 1;
            }
            .acu-preset-check {
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 10px;
                color: var(--acu-accent);
                transition: all 0.14s;
            }
            .acu-preset-check:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
            }
            .acu-preset-item.acu-preset-hidden .acu-preset-check {
                color: var(--acu-text-sub);
                opacity: 0.5;
            }
            .acu-preset-info {
                min-width: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .acu-preset-name {
                font-size: 14px;
                font-weight: 600;
                color: var(--acu-text-main);
                margin-bottom: 2px;
                letter-spacing: 0.2px;
                line-height: 1.15;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .acu-preset-desc {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                opacity: 0.8;
            }
            .acu-preset-stats {
                font-size: 10px;
                color: var(--acu-text-sub);
                opacity: 0.7;
            }
            .acu-preset-actions {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
                align-items: center;
            }
            .acu-preset-btn {
                width: 30px;
                height: 30px;
                border: 1px solid transparent;
                border-radius: 10px;
                background: transparent;
                color: var(--acu-text-sub);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                transition: all 0.14s;
                opacity: 0.7;
            }
            .acu-preset-btn:hover {
                background: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.1);
                color: var(--acu-accent);
                opacity: 1;
            }
            .acu-preset-btn:active {
                transform: translateY(1px);
            }
            .acu-preset-btn:focus-visible {
                outline: 2px solid var(--acu-accent);
                outline-offset: 1px;
            }
            .acu-preset-btn.acu-preset-delete:hover {
                background: rgba(231, 76, 60, 0.15);
                color: #e74c3c;
            }
            .acu-preset-handle {
                width: 28px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                color: var(--acu-text-sub);
                opacity: 0.55;
                transition: opacity 0.2s;
            }
            .acu-preset-item:hover .acu-preset-handle {
                opacity: 0.95;
            }
            .acu-preset-handle:active {
                cursor: grabbing;
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
            .acu-settings-compact-action {
                width: 90px;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 12px;
            }
            .acu-blacklist-manager-overlay {
                z-index: 31300 !important;
                padding: 20px;
            }
            .acu-blacklist-manager-dialog {
                width: min(600px, 90vw);
                max-width: 600px;
                max-height: min(82vh, 620px);
                padding: 0;
                gap: 0;
            }
            .acu-blacklist-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 16px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
                flex-shrink: 0;
            }
            .acu-blacklist-header h3 {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                margin: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-blacklist-body {
                display: flex;
                flex: 1;
                flex-direction: column;
                min-height: 0;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-blacklist-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-hint {
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-blacklist-textarea {
                width: 100%;
                min-height: 124px;
                max-height: 300px;
                resize: vertical;
                font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace;
                line-height: 1.5;
            }
            .acu-blacklist-add-row {
                display: flex;
                align-items: stretch;
                gap: 8px;
                min-width: 0;
            }
            .acu-blacklist-input {
                flex: 1;
                min-width: 0;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-add-btn {
                flex: 0 0 auto;
                min-width: 88px;
                padding-inline: 14px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions {
                margin: 16px -16px -16px;
            }
            .acu-edit-dialog.acu-blacklist-manager-dialog .acu-blacklist-actions .acu-dialog-btn {
                min-height: 38px;
            }
            .acu-edit-dialog.acu-dice-settings-dialog {
                width: min(92vw, 600px);
                max-width: 600px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                padding: 14px;
            }
            .acu-dice-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-dice-settings-header h3 {
                margin: 0;
                font-size: 17px;
                font-weight: 700;
                color: var(--acu-text-main);
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-dice-settings-header h3 i {
                color: var(--acu-accent);
            }
            .acu-dice-settings-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-dice-settings-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 12px 0 0;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            .acu-dice-settings-section + .acu-dice-settings-section {
                margin-top: 0;
                padding-top: 0;
                border-top: 0;
            }
            .acu-dice-settings-dialog .acu-setting-row {
                gap: 12px;
                min-height: 42px;
                padding: 8px 0;
            }
            .acu-dice-settings-dialog .acu-setting-dependent-row {
                margin-left: 24px;
                min-height: 40px;
            }
            .acu-dice-settings-dialog .acu-setting-info {
                min-width: 0;
            }
            .acu-dice-settings-dialog .acu-setting-label {
                overflow-wrap: anywhere;
            }
            .acu-dice-settings-dialog .acu-dice-settings-action {
                width: 90px;
                flex: 0 0 90px;
                padding: 6px 12px;
                font-size: 12px;
                margin-bottom: 0;
            }
            .acu-dice-settings-dialog .acu-dice-settings-select {
                width: 90px;
                min-width: 90px;
                flex: 0 0 90px;
                text-align: center;
                text-align-last: center;
            }
            .acu-dice-settings-dialog #dice-settings-crazy-mode-row {
                min-height: 42px;
                border-bottom: 1px dashed var(--acu-border);
            }
            @media (max-width: 640px) {
                .acu-edit-dialog.acu-dice-settings-dialog {
                    width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-dice-settings-header h3 {
                    font-size: 16px;
                }
                .acu-dice-settings-dialog .acu-dice-settings-action,
                .acu-dice-settings-dialog .acu-dice-settings-select {
                    width: 86px;
                    min-width: 86px;
                    flex-basis: 86px;
                }
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
            .acu-change-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid transparent; border-radius: 6px; font-size: 12px; background: rgba(0,0,0,0.02); flex-wrap: wrap; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
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
            .acu-change-action-btn { width: 26px; height: 26px; border: 1px solid var(--acu-border); border-radius: 5px; background: var(--acu-btn-bg); color: var(--acu-text-sub); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); padding: 0; }
            .acu-change-action-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); }
            .acu-action-accept:hover { background: var(--acu-success-bg); color: var(--acu-success-text); border-color: var(--acu-success-text); }
            .acu-action-reject:hover, .acu-action-restore:hover { background: var(--acu-hl-manual-bg); color: var(--acu-hl-manual); border-color: var(--acu-hl-manual); }
            .acu-action-edit:hover { background: var(--acu-hl-diff-bg); color: var(--acu-hl-diff); border-color: var(--acu-hl-diff); }
            /* 批量操作按钮 - 增强深色主题下的对比度 */
            .acu-changes-batch-btn { width: 32px; height: 32px; border: 1px solid var(--acu-border); border-radius: 6px; background: var(--acu-btn-bg); color: var(--acu-text-main); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background-color var(--acu-motion-fast) var(--acu-ease-standard), color var(--acu-motion-fast) var(--acu-ease-standard), border-color var(--acu-motion-fast) var(--acu-ease-standard); }
            .acu-changes-batch-btn:hover { background: var(--acu-btn-hover); color: var(--acu-text-main); border-color: var(--acu-border); }
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
            .acu-diff-readonly { padding: 10px 12px; background: var(--acu-table-head); border: 1px solid var(--acu-border); border-radius: 6px; color: var(--acu-text-main); font-size: 13px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; max-height: 150px; overflow-y: auto; opacity: 0.8; }
            .acu-diff-arrow-down { text-align: center; color: var(--acu-text-sub); font-size: 14px; margin: 8px 0; opacity: 0.5; }
            /* 可编辑区域高亮样式 */
            .acu-diff-new-section { padding: 12px; background: var(--acu-input-bg); border: 1px solid var(--acu-accent); border-radius: 6px; box-shadow: var(--acu-focus-ring); }
            .acu-diff-new-section .acu-diff-label { color: var(--acu-accent); font-weight: 600; }
            .acu-diff-new-section textarea,
            .acu-diff-new-section input { background: var(--acu-input-bg) !important; border-color: var(--acu-border) !important; }
            .acu-diff-new-section textarea:focus,
            .acu-diff-new-section input:focus { border-color: var(--acu-accent) !important; box-shadow: var(--acu-focus-ring); }
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
                border: 1px solid var(--acu-text-sub);
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
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    border-color var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-edit-dialog .acu-dialog-btn:hover,
            .acu-edit-dialog .acu-dialog-btn:focus-visible {
                background: var(--acu-btn-hover);
                border-color: var(--acu-border);
                box-shadow: var(--acu-focus-ring);
                outline: none;
            }
            .acu-edit-dialog .acu-btn-confirm {
                background: var(--acu-accent);
                border-color: var(--acu-accent);
                color: var(--acu-btn-active-text);
            }
            .acu-edit-dialog .acu-btn-confirm:hover,
            .acu-edit-dialog .acu-btn-confirm:focus-visible {
                background: var(--acu-accent);
                opacity: 0.9;
            }
            .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                width: min(600px, 92vw);
                max-width: 600px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-manager-dialog {
                width: min(640px, 92vw);
                max-width: 640px;
            }
            .acu-advanced-preset-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
                color: var(--acu-text-main);
                font-size: 16px;
                line-height: 1.3;
            }
            .acu-advanced-preset-header-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }
            .acu-advanced-preset-body {
                flex: 1;
                overflow-y: auto;
                padding: 2px 2px 0;
                min-height: 0;
            }
            .acu-advanced-preset-hint {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
                padding: 0 2px;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.35;
            }
            #acu-advanced-presets-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #acu-advanced-presets-list .acu-preset-item {
                margin-bottom: 0;
            }
            #acu-advanced-presets-list .acu-preset-info {
                flex: 1;
                min-width: 0;
            }
            #acu-advanced-presets-list .acu-preset-actions {
                gap: 6px;
            }
            #acu-advanced-presets-list .acu-preset-handle {
                touch-action: none;
            }
            .acu-preset-badge {
                display: inline-flex;
                align-items: center;
                margin-left: 6px;
                padding: 1px 5px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 500;
                line-height: 1.2;
                vertical-align: 1px;
            }
            .acu-advanced-preset-footer {
                display: flex;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                flex: 1 1 180px;
            }
            .acu-advanced-preset-file-input {
                display: none;
            }
            .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                width: min(720px, 95vw);
                max-width: 720px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-edit-dialog.acu-dashboard-preset-editor-dialog {
                width: min(760px, 95vw);
                max-width: 760px;
            }
            .acu-advanced-preset-editor-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding: 2px 2px 0;
            }
            .acu-advanced-preset-editor-fields {
                display: grid;
                grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
                gap: 12px;
                margin-bottom: 14px;
            }
            .acu-advanced-preset-field {
                min-width: 0;
            }
            .acu-advanced-preset-field label,
            .acu-advanced-preset-json-label {
                display: flex;
                align-items: baseline;
                gap: 6px;
                margin-bottom: 5px;
                color: var(--acu-text-sub);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
            }
            .acu-advanced-preset-json-label span {
                color: var(--acu-text-sub);
                font-size: 10px;
                font-weight: 400;
                opacity: 0.82;
            }
            .acu-advanced-preset-editor-dialog .acu-preset-editor-input {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 10px;
                border-radius: 6px;
                font-size: 13px;
                line-height: 1.4;
            }
            .acu-advanced-preset-json-section {
                margin-bottom: 14px;
            }
            .acu-advanced-preset-json-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 8px;
            }
            .acu-advanced-preset-json-textarea {
                width: 100%;
                height: 32em;
                min-height: 22em;
                box-sizing: border-box;
                padding: 10px 12px;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.5;
                resize: vertical;
            }
            .acu-advanced-preset-format-help-summary {
                display: flex;
                align-items: flex-start;
                gap: 6px;
                margin-top: 8px;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.45;
            }
            .acu-advanced-preset-format-help-summary strong {
                flex: 0 0 auto;
                color: var(--acu-text-main);
            }
            .acu-advanced-preset-format-help {
                margin-top: 8px;
                padding: 10px 12px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.6;
            }
            .acu-advanced-preset-format-help strong {
                color: var(--acu-text-main);
            }
            .acu-attribute-preset-json-textarea {
                height: 26em;
                min-height: 18em;
            }
            .acu-action-preset-json-textarea {
                height: 24em;
                min-height: 18em;
            }
            .acu-dashboard-preset-json-textarea {
                height: 28em;
                min-height: 20em;
            }
            .acu-advanced-preset-editor-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
                flex-shrink: 0;
            }
            .acu-advanced-preset-editor-tools,
            .acu-advanced-preset-editor-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                min-width: 0;
            }
            .acu-advanced-preset-editor-tools {
                flex: 0 1 auto;
            }
            .acu-advanced-preset-editor-actions {
                flex: 1 1 auto;
                justify-content: flex-end;
            }
            .acu-advanced-preset-editor-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-tool-btn {
                min-height: 36px;
                padding: 8px 10px;
                font-size: 12px;
            }
            .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                flex: 0 1 220px;
                min-width: 160px;
                font-weight: 700;
            }
            .acu-template-inspection-card {
                border: 1px solid var(--acu-border);
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-header-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                flex: 0 0 auto;
            }
            .acu-template-inspection-title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tutorial-btn,
            .acu-template-inspection-close {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                min-height: 30px !important;
                margin: 0 !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                background: transparent !important;
                color: var(--acu-text-sub) !important;
                font-size: 17px;
            }
            .acu-template-inspection-tutorial-btn i,
            .acu-template-inspection-close i {
                color: inherit !important;
            }
            .acu-template-inspection-tutorial-btn:hover,
            .acu-template-inspection-tutorial-btn:focus-visible,
            .acu-template-inspection-close:hover,
            .acu-template-inspection-close:focus-visible {
                background: var(--acu-btn-hover, var(--acu-table-hover)) !important;
                color: var(--acu-accent) !important;
                border-color: var(--acu-border) !important;
                outline: none;
            }
            .acu-template-inspection-summary {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 14px;
                padding: 0 0 10px;
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-template-inspection-summary-head {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                min-width: 0;
            }
            .acu-template-inspection-summary-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 18px;
                width: 18px;
                height: 18px;
                margin-top: 1px;
                color: var(--acu-template-inspection-summary-color, var(--acu-accent));
                font-size: 12px;
            }
            .acu-template-inspection-summary-copy {
                min-width: 0;
            }
            .acu-template-inspection-summary-title {
                color: var(--acu-text-main);
                font-size: 14px;
                font-weight: 800;
                line-height: 1.3;
            }
            .acu-template-inspection-stats {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 4px 10px;
                flex: 0 0 auto;
                max-width: 50%;
                padding-top: 1px;
            }
            .acu-template-inspection-stat {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                min-height: 20px;
                padding: 0;
                border: 0;
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-sub);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-stat b {
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 800;
            }
            .acu-template-inspection-stat-error {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-error b {
                color: var(--acu-error-text);
            }
            .acu-template-inspection-stat-warning {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-warning b {
                color: var(--acu-warning-text);
            }
            .acu-template-inspection-stat-info {
                color: var(--acu-text-main);
            }
            .acu-template-inspection-stat-info b {
                color: var(--acu-accent);
            }
            .acu-template-inspection-tabs {
                gap: 0 !important;
                padding: 0 !important;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-card-bg);
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }
            .acu-template-inspection-tab {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                min-height: 44px;
                padding: 8px 10px;
                border: 0;
                border-bottom: 1px solid var(--acu-border);
                border-radius: 0;
                background: transparent;
                color: var(--acu-text-main);
                cursor: pointer;
                text-align: left;
                touch-action: manipulation;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-template-inspection-tab:last-child {
                border-bottom: 0;
            }
            .acu-template-inspection-tab:hover,
            .acu-template-inspection-tab:focus {
                background: var(--acu-table-hover);
                outline: none;
            }
            .acu-template-inspection-tab.active {
                background: color-mix(in srgb, var(--acu-template-inspection-color, var(--acu-accent)) 10%, var(--acu-table-head));
            }
            .acu-template-inspection-tab-icon {
                flex: 0 0 14px;
                width: 14px;
                color: var(--acu-template-inspection-color, var(--acu-accent));
                text-align: center;
                font-size: 12px;
            }
            .acu-template-inspection-tab-label {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-tab.active .acu-template-inspection-tab-label {
                font-weight: 700;
            }
            .acu-template-inspection-tab-count {
                margin-left: 0 !important;
                flex: 0 0 auto;
            }
            .acu-template-inspection-card-list {
                gap: 8px;
            }
            .acu-template-inspection-panels,
            .acu-template-inspection-panel,
            .acu-template-inspection-card-list,
            .acu-template-inspection-card {
                width: 100%;
                min-width: 0;
                box-sizing: border-box;
            }
            .acu-template-inspection-card .acu-changes-group-header {
                min-height: 42px;
                border-bottom: 1px solid var(--acu-border);
                background: var(--acu-table-head);
            }
            .acu-template-inspection-card .acu-changes-count {
                font-weight: 700;
            }
            .acu-template-inspection-card .acu-changes-group-body {
                padding: 0;
            }
            .acu-template-inspection-card .acu-change-item {
                border: 0;
                border-radius: 0;
                background: transparent;
                padding: 12px 14px;
            }
            .acu-template-inspection-dialog-clean {
                width: min(720px, 96vw) !important;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                flex: 0 0 auto;
                overflow: visible;
                padding: 14px 0 !important;
            }
            .acu-template-inspection-clean-card {
                display: grid;
                grid-template-columns: minmax(0, 1fr);
                gap: 14px;
                padding: 16px;
                border: 1px solid var(--acu-border);
                border-radius: 10px;
                background: var(--acu-card-bg);
            }
            .acu-template-inspection-clean-result {
                display: grid;
                grid-template-columns: 42px minmax(0, 1fr);
                gap: 12px;
                align-items: center;
            }
            .acu-template-inspection-clean-icon {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                background: color-mix(in srgb, var(--acu-success-text) 18%, var(--acu-card-bg));
                color: var(--acu-success-text);
                font-size: 20px;
            }
            .acu-template-inspection-clean-copy {
                min-width: 0;
            }
            .acu-template-inspection-clean-title {
                color: var(--acu-text-main);
                font-size: 15px;
                font-weight: 700;
                line-height: 1.35;
            }
            .acu-template-inspection-clean-desc {
                margin-top: 3px;
                color: var(--acu-text-sub);
                font-size: 12px;
                line-height: 1.45;
            }
            .acu-template-inspection-clean-meta {
                display: grid;
                grid-template-columns: minmax(0, 1.5fr) minmax(92px, 0.6fr) minmax(126px, 0.8fr);
                gap: 8px;
            }
            .acu-template-inspection-clean-meta div {
                min-width: 0;
                padding: 8px 10px;
                border: 1px solid var(--acu-border);
                border-radius: 8px;
                background: var(--acu-table-head);
            }
            .acu-template-inspection-clean-meta span {
                display: block;
                color: var(--acu-text-sub);
                font-size: 10px;
                line-height: 1.2;
                margin-bottom: 3px;
            }
            .acu-template-inspection-clean-meta strong {
                display: block;
                overflow: hidden;
                color: var(--acu-text-main);
                font-size: 12px;
                font-weight: 600;
                line-height: 1.35;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .acu-template-inspection-clean-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .acu-template-inspection-clean-stats span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 8px;
                border: 1px solid var(--acu-border);
                border-radius: 999px;
                color: var(--acu-text-sub);
                background: var(--acu-table-head);
                font-size: 11px;
                line-height: 1.2;
            }
            .acu-template-inspection-clean-stats b {
                color: var(--acu-text-main);
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-item {
                align-items: center;
                padding: 12px;
                border-radius: 10px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name {
                display: flex;
                align-items: center;
                gap: 6px;
                max-width: 100%;
                margin-bottom: 3px;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-name .acu-preset-badge {
                margin-left: 0;
                flex-shrink: 0;
            }
            .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                margin-left: auto;
                padding-left: 8px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty {
                min-height: 190px !important;
            }
            .acu-template-inspection-overlay .acu-template-inspection-layout-empty .acu-empty-hint {
                min-height: 190px !important;
                padding: 22px 20px !important;
            }
            .acu-template-inspection-overlay .acu-dialog-btn {
                white-space: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-actions {
                flex-wrap: nowrap;
            }
            .acu-template-inspection-overlay .acu-template-inspection-download {
                flex: 0 1 auto;
                min-width: 0;
                max-width: 220px;
            }
            .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                flex: 0 0 auto;
                min-width: 0;
            }
            .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                padding-top: 12px;
                border-top: 1px solid var(--acu-border);
            }
            .acu-template-inspection-overlay .acu-dialog-btn:disabled {
                background: var(--acu-btn-bg);
                border-color: var(--acu-border);
                color: var(--acu-text-sub);
                opacity: 0.5;
                cursor: not-allowed;
                box-shadow: none;
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-header h3 {
                    font-size: 15px;
                }
                #acu-advanced-presets-list .acu-preset-item {
                    grid-template-columns: 30px minmax(0, 1fr) auto;
                    column-gap: 8px;
                    padding: 9px 10px;
                }
                #acu-advanced-presets-list .acu-preset-handle {
                    display: none;
                }
                #acu-advanced-presets-list .acu-preset-actions {
                    gap: 4px;
                }
                #acu-advanced-presets-list .acu-preset-btn {
                    width: 28px;
                    height: 28px;
                    font-size: 12px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-item {
                    align-items: stretch;
                    gap: 10px;
                    padding: 10px;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-actions {
                    gap: 5px;
                    padding-left: 0;
                }
                .acu-table-template-requirement-manager-dialog .acu-preset-btn {
                    width: 30px;
                    height: 30px;
                }
                .acu-advanced-preset-footer {
                    flex-wrap: nowrap;
                    gap: 6px;
                    padding-top: 10px;
                }
                .acu-advanced-preset-footer .acu-dialog-btn {
                    flex: 1 1 0;
                    min-width: 0;
                    min-height: 34px;
                    padding: 7px 6px;
                    font-size: 12px;
                }
                .acu-advanced-preset-footer .acu-advanced-preset-footer-main {
                    flex-basis: 0;
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-manager-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
            }
            @media (max-width: 768px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: calc(100vw - 20px);
                    max-width: calc(100vw - 20px);
                    max-height: calc(100dvh - 24px);
                    padding: 12px;
                }
                .acu-advanced-preset-editor-fields {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-advanced-preset-json-head {
                    flex-direction: column;
                    align-items: stretch;
                }
                .acu-advanced-preset-json-label {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-advanced-preset-json-textarea {
                    height: 24em;
                    min-height: 20em;
                }
                .acu-advanced-preset-format-help-summary {
                    flex-direction: column;
                    gap: 2px;
                }
                .acu-attribute-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-action-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-dashboard-preset-json-textarea {
                    height: 20em;
                    min-height: 16em;
                }
                .acu-advanced-preset-editor-footer {
                    flex-wrap: wrap;
                    align-items: stretch;
                }
                .acu-advanced-preset-editor-tools,
                .acu-advanced-preset-editor-actions {
                    flex: 1 1 100%;
                    width: 100%;
                    justify-content: stretch;
                }
                .acu-advanced-preset-editor-tools .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-actions .acu-dialog-btn {
                    flex: 1 1 calc(50% - 4px);
                    min-width: 0;
                }
                .acu-advanced-preset-editor-footer .acu-advanced-preset-editor-save {
                    flex: 1 1 calc(50% - 4px);
                }
            }
            @media (max-width: 480px) {
                .acu-edit-dialog.acu-advanced-preset-editor-dialog {
                    width: min(370px, calc(100vw - 20px));
                    max-width: min(370px, calc(100vw - 20px));
                }
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
            @media (max-width: 768px) {
                .acu-template-inspection-overlay .acu-edit-dialog {
                    width: calc(100vw - 20px) !important;
                    max-width: calc(100vw - 20px) !important;
                    max-height: calc(100dvh - 24px) !important;
                    padding: 12px !important;
                }
                .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-clean-card {
                    gap: 12px;
                    padding: 12px;
                }
                .acu-template-inspection-clean-result {
                    grid-template-columns: 36px minmax(0, 1fr);
                    gap: 10px;
                }
                .acu-template-inspection-clean-icon {
                    width: 36px;
                    height: 36px;
                    font-size: 17px;
                }
                .acu-template-inspection-clean-meta {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 6px;
                }
                .acu-template-inspection-clean-meta div {
                    padding: 7px 9px;
                }
                .acu-template-inspection-overlay .acu-settings-content-scroll {
                    max-height: calc(100dvh - 230px) !important;
                    overflow-y: auto !important;
                    padding: 10px 0 !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-body {
                    max-height: none !important;
                    overflow: visible !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-actions {
                    gap: 8px !important;
                    padding-top: 10px !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-download {
                    flex: 1 1 0;
                    max-width: none;
                }
                .acu-template-inspection-overlay .acu-template-inspection-dialog-clean .acu-template-inspection-primary-actions {
                    flex: 0 0 auto;
                }
                .acu-template-inspection-summary {
                    flex-direction: column;
                    gap: 5px !important;
                    padding: 0 0 8px !important;
                    margin-bottom: 10px !important;
                }
                .acu-template-inspection-summary-head {
                    gap: 7px;
                }
                .acu-template-inspection-summary-icon {
                    flex-basis: 16px;
                    width: 16px;
                    height: 16px;
                    font-size: 11px;
                }
                .acu-template-inspection-summary-title {
                    font-size: 13px;
                }
                .acu-template-inspection-stats {
                    display: flex;
                    gap: 4px 10px;
                    justify-content: flex-start;
                    max-width: none;
                }
                .acu-template-inspection-stat {
                    justify-content: flex-start;
                    min-width: 0;
                    min-height: 18px;
                    padding: 0;
                }
                .acu-template-inspection-layout {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    gap: 10px !important;
                }
                .acu-template-inspection-tabs {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    min-width: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding: 0 !important;
                }
                .acu-template-inspection-layout-empty {
                    min-height: 180px !important;
                }
                .acu-template-inspection-tab {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: none !important;
                    padding: 8px 9px !important;
                    min-height: 44px;
                }
                .acu-template-inspection-panels {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding-right: 0 !important;
                }
                .acu-template-inspection-card .acu-changes-group-header {
                    padding: 8px !important;
                    align-items: flex-start !important;
                    gap: 6px !important;
                }
                .acu-template-inspection-card .acu-changes-count {
                    margin-left: 4px !important;
                    flex-shrink: 0;
                }
                .acu-template-inspection-card .acu-change-item {
                    padding: 8px !important;
                    word-break: break-word;
                }
                .acu-template-inspection-overlay .acu-dialog-btns {
                    gap: 8px !important;
                    padding: 10px 12px !important;
                }
                .acu-template-inspection-overlay .acu-dialog-btn {
                    min-width: 0 !important;
                    white-space: nowrap !important;
                }
                .acu-template-inspection-overlay .acu-template-inspection-primary-actions {
                    flex-wrap: nowrap !important;
                    min-width: 0;
                }
            }
            .acu-template-inspection-layout-empty {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 190px;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-tabs {
                display: none !important;
            }
            .acu-template-inspection-layout-empty .acu-template-inspection-panels {
                flex: 1;
                max-height: none !important;
                overflow: visible !important;
                padding-right: 0 !important;
            }
            .acu-template-inspection-layout-empty .acu-empty-hint {
                width: 100%;
                min-height: 190px !important;
                padding: 22px 20px !important;
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
            .acu-table-manager-hint {
                font-size: 11px;
                color: var(--acu-text-sub);
                margin-bottom: 8px;
                padding: 0 4px;
            }
            .acu-settings-manager-body .acu-table-manager-list {
                max-height: min(520px, 55vh);
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
            .acu-dragging {
                cursor: grabbing;
            }
            .acu-drag-ghost {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                opacity: 0.9;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                transform: rotate(2deg);
            }
            .acu-drag-placeholder {
                opacity: 0.3;
                border: 2px dashed var(--acu-border);
                background: var(--acu-table-hover);
            }
            .acu-drag-indicator {
                height: 3px;
                background: var(--acu-accent);
                border-radius: 2px;
                margin: 4px 0;
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
                border-color: rgba(var(--acu-accent-rgb, 128, 128, 128), 0.3);
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-icon {
                color: var(--acu-accent);
            }
            .acu-table-manager-item.acu-special-item .acu-table-item-name {
                font-weight: 500;
            }
            /* ========== 设置内预设管理层 ========== */
            .acu-settings-manager-overlay {
                position: fixed;
                inset: 0;
                height: 100vh;
                height: 100dvh;
                z-index: 10040;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }
            .acu-settings-manager-overlay[hidden] {
                display: none !important;
            }
            .acu-settings-manager-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(8, 10, 12, 0.46);
            }
            .acu-settings-manager-dialog {
                position: relative;
                z-index: 1;
                width: min(760px, calc(100vw - 32px));
                max-height: min(780px, calc(100vh - 40px));
                max-height: min(780px, calc(100dvh - 40px));
                display: flex;
                flex-direction: column;
                overflow: hidden;
                background: var(--acu-bg-panel, #1f1f1f);
                background-color: var(--acu-bg-panel, #1f1f1f);
                color: var(--acu-text-main);
                border: 1px solid var(--acu-border);
                border-radius: 12px;
                box-shadow: 0 18px 52px rgba(8, 10, 12, 0.38);
            }
            .acu-settings-manager-header {
                flex: 0 0 auto;
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-settings-manager-title {
                min-width: 0;
            }
            .acu-settings-manager-body {
                flex: 1 1 auto;
                min-height: 0;
                overflow: auto;
                padding: 14px 16px 16px;
                background: var(--acu-bg-panel, #1f1f1f);
                background-color: var(--acu-bg-panel, #1f1f1f);
            }
            .acu-settings-manager-control-row {
                gap: 12px;
            }
            .acu-settings-manager-control-row > span {
                color: var(--acu-text-main);
                font-weight: 600;
            }
            @media (max-width: 600px) {
                .acu-settings-manager-overlay {
                    padding: 10px;
                }
                .acu-settings-manager-dialog {
                    width: calc(100vw - 20px);
                    max-height: calc(100vh - 20px);
                    max-height: calc(100dvh - 20px);
                    border-radius: 10px;
                }
                .acu-settings-manager-body {
                    padding: 12px;
                }
                .acu-settings-manager-control-row {
                    align-items: stretch;
                    flex-direction: column;
                }
                .acu-settings-manager-control-row .acu-setting-select {
                    width: 100%;
                    max-width: none !important;
                }
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
            .acu-settings-manager-dialog .acu-rule-action {
                width: 28px;
                height: 28px;
                min-width: 28px;
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 28px;
                padding: 0;
                margin: 0;
                border: 1px solid transparent;
                border-radius: 6px;
                background: transparent;
                box-shadow: none;
                color: var(--acu-text-sub);
                cursor: pointer;
                opacity: 0.68;
                transition:
                    background-color var(--acu-motion-fast) var(--acu-ease-standard),
                    color var(--acu-motion-fast) var(--acu-ease-standard),
                    opacity var(--acu-motion-fast) var(--acu-ease-standard),
                    box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
            }
            .acu-settings-manager-dialog .acu-rule-action:hover {
                border-color: transparent;
                background: var(--acu-table-hover);
                opacity: 1;
            }
            .acu-settings-manager-dialog .acu-rule-action:focus {
                outline: none;
                box-shadow: none;
            }
            .acu-settings-manager-dialog .acu-rule-action:focus-visible {
                outline: none;
                box-shadow: var(--acu-focus-ring);
                opacity: 1;
            }
            .acu-settings-manager-dialog .acu-rule-edit:hover {
                color: var(--acu-accent);
            }
            .acu-settings-manager-dialog .acu-rule-delete:hover {
                color: var(--acu-error-text, #e74c3c);
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
                background: var(--acu-table-hover);
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
            .acu-edit-dialog.acu-validation-rule-editor-dialog {
                width: min(560px, 92vw);
                max-width: 560px;
                max-height: 85vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .acu-validation-modal-body {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 60vh;
                overflow-y: auto;
            }
            .acu-validation-rule-editor-dialog .acu-validation-modal-body {
                flex: 1;
                min-height: 0;
                max-height: none;
                padding: 2px 2px 0;
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
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                padding: 12px 0 0;
                border-top: 1px solid var(--acu-border);
                background: transparent;
                flex-shrink: 0;
            }
            .acu-validation-modal-footer .acu-advanced-preset-editor-actions {
                justify-content: flex-end;
            }
            .acu-validation-modal-footer .acu-dialog-btn {
                flex: 0 0 auto;
                min-height: 38px;
                margin: 0;
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
                border-color: var(--acu-text-sub);
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
                border-color: var(--acu-state-accent-border) !important;
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
                width: min(360px, calc(100vw - 24px));
                max-width: 360px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                box-sizing: border-box;
            }
            .acu-crop-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
                font-size: 14px;
                font-weight: bold;
                color: var(--acu-accent);
            }
            .acu-crop-close {
                width: 34px;
                height: 34px;
                min-width: 34px;
                min-height: 34px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-border);
                border-radius: 6px;
                color: var(--acu-text-sub);
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-crop-close:hover {
                color: var(--acu-text-main);
                background: var(--acu-btn-hover);
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
                display: grid;
                grid-template-columns: 44px minmax(0, 1fr) minmax(0, 1fr);
                gap: 10px;
                padding: 12px 16px;
                background: var(--acu-table-head);
                border-top: 1px solid var(--acu-border);
            }
            .acu-crop-btn {
                min-width: 0;
                min-height: 38px;
                padding: 10px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
            }
            .acu-crop-cancel {
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
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
                padding: 0;
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
            .acu-fav-send-overlay,
            .acu-fav-tag-overlay {
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
                color: var(--acu-text-sub);
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
                color: var(--acu-text-sub);
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
            .acu-fav-send-modal,
            .acu-fav-tag-modal {
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
            .acu-fav-send-modal-header,
            .acu-fav-tag-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--acu-table-head);
                border-bottom: 1px solid var(--acu-border);
            }
            .acu-fav-edit-modal-header h4,
            .acu-fav-new-modal-header h4,
            .acu-fav-send-modal-header h4,
            .acu-fav-tag-modal-header h4 {
                margin: 0;
                font-size: 15px;
                color: var(--acu-accent);
            }
            .acu-fav-edit-close,
            .acu-fav-new-close,
            .acu-fav-send-close,
            .acu-fav-tag-close {
                background: transparent !important;
                border: none !important;
                color: var(--acu-text-main) !important;
                cursor: pointer;
                font-size: 16px;
            }
            .acu-fav-edit-close:hover,
            .acu-fav-new-close:hover,
            .acu-fav-send-close:hover,
            .acu-fav-tag-close:hover {
                background: transparent !important;
                color: var(--acu-accent) !important;
            }
            .acu-fav-edit-modal-body,
            .acu-fav-new-modal-body,
            .acu-fav-send-modal-body,
            .acu-fav-tag-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }
            .acu-fav-edit-tags-section,
            .acu-fav-tag-input-section {
                margin-bottom: 16px;
            }
            .acu-fav-edit-tags-section label,
            .acu-fav-tag-input-section label {
                display: block;
                font-size: 12px;
                color: var(--acu-text-sub);
                margin-bottom: 6px;
            }
            .acu-fav-edit-tags-section input,
            .acu-fav-tag-input-section input {
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
                background: transparent !important;
                border: 1px solid var(--acu-border) !important;
                border-radius: 6px;
                color: var(--acu-text-sub) !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .acu-fav-edit-remove:hover {
                color: #e74c3c !important;
                border-color: #e74c3c !important;
                background: transparent !important;
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
            .acu-fav-send-modal-footer,
            .acu-fav-tag-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 14px 18px;
                border-top: 1px solid var(--acu-border);
                background: var(--acu-bg-main);
            }
            .acu-fav-edit-cancel,
            .acu-fav-new-cancel,
            .acu-fav-send-cancel,
            .acu-fav-tag-cancel {
                padding: 8px 16px;
                background: var(--acu-btn-bg);
                border: 1px solid var(--acu-text-sub);
                border-radius: 6px;
                color: var(--acu-text-main);
                cursor: pointer;
            }
            .acu-fav-edit-save,
            .acu-fav-new-create,
            .acu-fav-tag-confirm {
                padding: 8px 16px;
                background: var(--acu-accent);
                border: 1px solid var(--acu-accent);
                border-radius: 6px;
                color: var(--acu-btn-active-text);
                cursor: pointer;
            }
            .acu-fav-edit-save:hover,
            .acu-fav-new-create:hover,
            .acu-fav-tag-confirm:hover {
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
                color: var(--acu-text-sub);
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
            /* [修复] 收藏夹卡片来源标签 - 放在底部与tags一起 */
            .acu-fav-card-source {
                font-size: 11px;
                color: var(--acu-text-sub);
                font-weight: normal;
                background: var(--acu-badge-bg);
                padding: 2px 8px;
                border-radius: 4px;
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
                color: var(--acu-text-sub);
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
                .acu-fav-send-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
                }
                .acu-fav-tag-modal {
                    width: 92vw !important;
                    max-width: 500px !important;
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
            .acu-fav-edit-modal input,
            .acu-fav-tag-modal input {
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
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            border-color var(--acu-motion-fast) var(--acu-ease-standard),
            opacity var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
        background: transparent;
        color: var(--acu-text-sub);
        opacity: 0.5;
    }
    .acu-mvu-level-toggle:hover,
    .acu-mvu-level-toggle:focus-visible {
        border-color: var(--acu-border);
        box-shadow: var(--acu-focus-ring);
        outline: none;
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
        border: 1px solid var(--acu-state-accent-border);
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

    /* 锁定图标 - CSS-only */
    [data-locked="true"]::after {
        content: "\\f023";
        font-family: "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 10px;
        color: var(--acu-accent);
        opacity: 0.7;
        margin-left: 4px;
        pointer-events: none;
        display: inline;
    }

    /* 标题锁图标略大 */
    .acu-editable-title[data-locked="true"]::after {
        font-size: 11px;
        opacity: 0.8;
    }

    /* ========== 导入确认弹窗样式 ========== */
    .acu-import-confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 31300;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;
    }

    .acu-import-confirm-dialog {
        width: 90%;
        max-width: 420px;
        max-height: calc(100vh - 32px);
        background: var(--acu-bg-panel);
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        overflow: hidden;
        animation: acu-modal-pop 0.2s ease-out;
        display: flex;
        flex-direction: column;
    }

    .acu-import-confirm-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .acu-import-close-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 6px;
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .acu-import-close-btn:hover {
        background: var(--acu-btn-hover);
        color: var(--acu-text-main);
    }

    .acu-import-warning {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: var(--acu-hl-manual-bg, rgba(230, 126, 34, 0.15));
        border-radius: 6px;
        color: var(--acu-hl-manual, #e67e22);
        font-size: 13px;
        margin-bottom: 12px;
    }

    .acu-import-conflict-list {
        max-height: 120px;
        overflow-y: auto;
        padding: 10px 12px;
        background: var(--acu-table-hover);
        border-radius: 6px;
        font-size: 12px;
        color: var(--acu-text-main);
        line-height: 1.6;
        margin-bottom: 12px;
    }

    .acu-import-conflict-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .acu-import-radio {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-radio:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
    }

    .acu-import-radio input[type="radio"] {
        accent-color: var(--acu-accent);
    }

    .acu-import-success {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        background: var(--acu-success-bg, rgba(39, 174, 96, 0.15));
        border-radius: 6px;
        color: var(--acu-success-text, #27ae60);
        font-size: 13px;
    }

    .acu-gacha-catalog-import-icon {
        background: var(--acu-btn-hover) !important;
        color: var(--acu-accent) !important;
    }

    .acu-import-confirm-footer {
        display: flex;
        gap: 10px;
        padding: 14px 18px;
        border-top: 1px solid var(--acu-border);
        background: var(--acu-table-head);
    }

    .acu-import-confirm-footer.acu-gacha-catalog-clear-footer {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .acu-gacha-catalog-clear-all {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
        color: var(--acu-text-main) !important;
    }

    .acu-import-cancel-btn,
    .acu-import-confirm-btn {
        flex: 1;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .acu-import-cancel-btn {
        background: var(--acu-btn-bg);
        border: 1px solid var(--acu-text-sub);
        color: var(--acu-text-main);
    }

    .acu-import-cancel-btn:hover {
        background: var(--acu-btn-hover);
    }

    .acu-import-confirm-btn {
        background: var(--acu-accent);
        border: 1px solid var(--acu-accent);
        color: var(--acu-btn-active-text);
    }

    .acu-import-confirm-btn:hover {
        filter: brightness(1.1);
    }

    /* ========================================
     * Debug Console - 移动端优化 & 美化
     * ======================================== */
    
    /* 主弹窗容器 - 移动端全屏，PC端居中 */
    .acu-debug-console-dialog {
        width: 100% !important;
        max-width: 100vw !important;
        height: 100% !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        margin: 0 !important;
        background: var(--acu-bg-panel) !important;
        animation: debugSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog {
            width: 90vw !important;
            max-width: 900px !important;
            height: 85vh !important;
            max-height: 700px !important;
            border-radius: 16px !important;
            animation: debugFadeScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
    }
    
    @keyframes debugSlideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes debugFadeScale {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* Header 样式美化 */
    .acu-debug-console-dialog .acu-settings-header {
        background: linear-gradient(135deg, var(--acu-table-head) 0%, var(--acu-bg-panel) 100%) !important;
        border-bottom: 1px solid var(--acu-border) !important;
        padding: 16px 20px !important;
        position: relative !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title {
        font-size: 16px !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        color: var(--acu-text-main) !important;
    }
    
    .acu-debug-console-dialog .acu-settings-title i {
        font-size: 18px !important;
        color: var(--acu-accent) !important;
        animation: debugPulse 2s ease-in-out infinite !important;
    }
    
    @keyframes debugPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    /* 工具栏 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-toolbar {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        background: var(--acu-card-bg) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-toolbar {
            flex-direction: row !important;
            align-items: center !important;
            padding: 14px 20px !important;
        }
    }
    
    /* Console 抓取开关 */
    .acu-debug-console-dialog .acu-debug-capture-row {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 10px 14px !important;
        background: var(--acu-table-hover) !important;
        border-radius: 10px !important;
        border: 1px solid var(--acu-border) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-label {
        font-size: 13px !important;
        color: var(--acu-text-sub) !important;
        flex: 1 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status {
        font-size: 12px !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        font-weight: 600 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.enabled {
        background: var(--acu-success-bg) !important;
        color: var(--acu-success-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-capture-status.disabled {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    /* 过滤器按钮组 - 移动端横向滚动 */
    .acu-debug-console-dialog .acu-debug-filter-group {
        display: flex !important;
        gap: 8px !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 4px 0 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-group::-webkit-scrollbar {
        display: none !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn {
        flex-shrink: 0 !important;
        padding: 8px 14px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
        box-shadow: 0 2px 8px rgba(var(--acu-accent-rgb, 59, 130, 246), 0.3) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn .count {
        font-size: 10px !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        min-width: 18px !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-filter-btn.active .count {
        background: rgba(0, 0, 0, 0.15) !important;
    }
    
    /* 日志类型指示器颜色 */
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="log"] .indicator { color: var(--acu-text-sub) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="info"] .indicator { color: var(--acu-hl-diff) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="warn"] .indicator { color: var(--acu-warning-text) !important; }
    .acu-debug-console-dialog .acu-debug-filter-btn[data-filter-type="error"] .indicator { color: var(--acu-error-text) !important; }
    
    /* 操作按钮组 */
    .acu-debug-console-dialog .acu-debug-actions {
        display: flex !important;
        gap: 8px !important;
        margin-top: 8px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-actions {
            margin-top: 0 !important;
            margin-left: auto !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn {
        flex: 1 !important;
        padding: 10px 12px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border: 1px solid var(--acu-border) !important;
        background: var(--acu-btn-bg) !important;
        color: var(--acu-text-main) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
    }
    
    @media (min-width: 768px) {
        .acu-debug-console-dialog .acu-debug-action-btn {
            flex: none !important;
            padding: 8px 14px !important;
        }
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:hover {
        background: var(--acu-btn-hover) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn:active {
        transform: scale(0.95) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.primary {
        background: var(--acu-accent) !important;
        color: var(--acu-button-text-on-accent, #fff) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger {
        color: var(--acu-error-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-action-btn.danger:hover {
        background: var(--acu-error-bg) !important;
        border-color: var(--acu-error-text) !important;
    }
    
    /* 日志滚动区域 */
    .acu-debug-console-dialog .acu-debug-log-scroll {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: var(--acu-card-bg) !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    /* 日志容器 */
    .acu-debug-console-dialog .acu-debug-log-container {
        padding: 0 !important;
    }
    
    /* 单条日志项 - 移动端优化 */
    .acu-debug-console-dialog .acu-debug-log-item {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--acu-border) !important;
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
        transition: background 0.15s ease !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:hover {
        background: var(--acu-table-hover) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-item:active {
        background: var(--acu-btn-hover) !important;
    }
    
    /* 日志头部 - 移动端垂直布局 */
    .acu-debug-console-dialog .acu-debug-log-header {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 8px !important;
        margin-bottom: 6px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-time {
        font-size: 10px !important;
        color: var(--acu-text-sub) !important;
        opacity: 0.8 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type {
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        padding: 2px 8px !important;
        border-radius: 4px !important;
        letter-spacing: 0.5px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.log {
        background: var(--acu-badge-bg) !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.info {
        background: var(--acu-hl-diff-bg) !important;
        color: var(--acu-hl-diff) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.warn {
        background: var(--acu-warning-bg) !important;
        color: var(--acu-warning-text) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-log-type.error {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
    }
    
    /* 日志内容 */
    .acu-debug-console-dialog .acu-debug-log-content {
        color: var(--acu-text-main) !important;
        word-break: break-word !important;
        white-space: pre-wrap !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
    }
    
    /* 堆栈信息 */
    .acu-debug-console-dialog .acu-debug-log-stack {
        margin-top: 8px !important;
        padding: 10px 12px !important;
        background: rgba(0, 0, 0, 0.05) !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        color: var(--acu-text-sub) !important;
        white-space: pre-wrap !important;
        word-break: break-all !important;
        border: 1px solid var(--acu-state-error-border) !important;
    }
    
    /* 空状态 */
    .acu-debug-console-dialog .acu-debug-empty {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 60px 20px !important;
        color: var(--acu-text-sub) !important;
        text-align: center !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty i {
        font-size: 48px !important;
        margin-bottom: 16px !important;
        opacity: 0.5 !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-text {
        font-size: 14px !important;
        margin-bottom: 8px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-empty-hint {
        font-size: 12px !important;
        opacity: 0.7 !important;
    }
    
    /* 底部状态栏 */
    .acu-debug-console-dialog .acu-debug-footer {
        padding: 12px 16px !important;
        border-top: 1px solid var(--acu-border) !important;
        background: var(--acu-table-head) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        font-size: 12px !important;
        color: var(--acu-text-sub) !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stats {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
    }
    
    .acu-debug-console-dialog .acu-debug-stat-value {
        font-weight: 700 !important;
        color: var(--acu-accent) !important;
    }
    
    /* 关闭按钮优化 */
    .acu-debug-console-dialog .acu-close-btn {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        color: var(--acu-text-sub) !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
    }
    
    .acu-debug-console-dialog .acu-close-btn:hover {
        background: var(--acu-error-bg) !important;
        color: var(--acu-error-text) !important;
        border-color: var(--acu-error-text) !important;
        transform: rotate(90deg) !important;
    }
    
    /* Toggle 开关美化 */
    .acu-debug-console-dialog .acu-toggle {
        position: relative !important;
        display: inline-block !important;
        width: 44px !important;
        height: 24px !important;
        flex-shrink: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input {
        opacity: 0 !important;
        width: 0 !important;
        height: 0 !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider {
        position: absolute !important;
        cursor: pointer !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: var(--acu-btn-bg) !important;
        border: 1px solid var(--acu-border) !important;
        border-radius: 24px !important;
        transition: all 0.3s ease !important;
    }
    
    .acu-debug-console-dialog .acu-toggle-slider::before {
        position: absolute !important;
        content: "" !important;
        height: 18px !important;
        width: 18px !important;
        left: 2px !important;
        bottom: 2px !important;
        background: var(--acu-text-sub) !important;
        border-radius: 50% !important;
        transition:
            transform var(--acu-motion-normal) var(--acu-ease-out),
            background-color var(--acu-motion-normal) var(--acu-ease-standard) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider {
        background: var(--acu-accent) !important;
        border-color: var(--acu-accent) !important;
    }
    
    .acu-debug-console-dialog .acu-toggle input:checked + .acu-toggle-slider::before {
        transform: translateX(20px) !important;
        background: var(--acu-button-text-on-accent, #fff) !important;
    }
/* ========== 效果输入区域样式 ========== */
    .acu-effect-inputs-area {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--acu-border);
    }
    .acu-effect-input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 6px;
    }
    .acu-effect-input-label {
        font-size: 11px;
        color: var(--acu-text-sub);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .acu-effect-preview-text {
        font-size: 10px;
        color: var(--acu-text-sub);
        opacity: 0.8;
        margin-top: 2px;
        text-align: right;
    }
    .acu-effect-preview-text span {
        margin-left: 8px;
    }
    .acu-effect-preview-text span.positive { color: var(--acu-success-text); }
    .acu-effect-preview-text span.negative { color: var(--acu-failure-text); }

    /* ========== 物品栏可视化 ========== */
    .acu-inventory-overlay,
    .acu-gacha-overlay {
        position: fixed;
        inset: 0;
        z-index: 31140;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 18px;
        background:
            radial-gradient(circle at top, color-mix(in srgb, var(--acu-accent) 16%, transparent), transparent 44%),
            linear-gradient(180deg, rgba(10, 16, 26, 0.82), rgba(5, 8, 14, 0.9));
        backdrop-filter: blur(5px);
    }
    .acu-gacha-overlay {
        z-index: 31145;
    }
    .acu-inventory-shell,
    .acu-gacha-shell {
        width: min(460px, 92vw);
        height: min(88vh, 920px);
        max-width: 100vw;
        max-height: 100dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 36%, var(--acu-border));
        border-radius: 18px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 92%, #0c1726) 0%, color-mix(in srgb, var(--acu-bg-panel) 96%, #08111d) 100%);
        box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .acu-gacha-shell {
        width: min(560px, 94vw);
        height: auto;
        max-height: min(88vh, 920px);
    }
    .acu-inventory-window-header {
        flex-shrink: 0;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.06)),
            linear-gradient(180deg, color-mix(in srgb, var(--acu-table-head) 92%, #111b2a), color-mix(in srgb, var(--acu-bg-panel) 94%, #08111d));
        border-bottom: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
    }
    .acu-inventory-window-header .acu-header-actions {
        gap: 10px;
        flex-wrap: nowrap;
    }
    .acu-inventory-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        min-height: 0;
        padding: 10px 12px 12px;
        color: var(--acu-text-main);
        touch-action: pan-y;
    }
    .acu-gacha-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 0;
        overflow: hidden auto;
        padding: 14px;
        color: var(--acu-text-main);
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }
    .acu-gacha-overlay .acu-header-actions > button,
    .acu-gacha-settings-header-actions > button,
    .acu-gacha-shard-shop .acu-inventory-detail-header-actions > button {
        width: 34px;
        height: 34px;
        min-width: 34px;
        min-height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 34px;
    }
    .acu-gacha-stat-row,
    .acu-gacha-wallet-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }
    .acu-gacha-shard-shop-open {
        margin-left: auto;
        min-height: 30px;
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-btn-active-bg) 30%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 14%, var(--acu-btn-bg));
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 800;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-shop-open,
    .acu-gacha-shard-shop-open span,
    .acu-gacha-shard-shop-open strong {
        min-width: 0;
    }
    .acu-gacha-shard-shop-open strong {
        font-size: inherit;
    }
    .acu-gacha-shard-shop-open:hover {
        border-color: var(--acu-btn-active-bg);
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        opacity: 1;
    }
    .acu-gacha-draw-row {
        position: relative;
        bottom: 0;
        flex-shrink: 0;
        z-index: 4;
        display: grid;
        grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
        gap: 10px;
        padding: 8px 14px 10px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-bg-panel) 72%, transparent), var(--acu-bg-panel) 42%),
            color-mix(in srgb, var(--acu-bg-panel) 94%, var(--acu-card-bg));
    }
    .acu-gacha-draw-btn {
        min-width: 0;
        min-height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.1;
        border: 1px solid color-mix(in srgb, var(--acu-btn-active-bg) 24%, transparent);
        background: color-mix(in srgb, var(--acu-btn-active-bg) 12%, var(--acu-card-bg));
        color: var(--acu-accent);
        box-shadow: 0 8px 20px rgba(0, 0, 0, .18);
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-draw-btn:hover {
        border-color: var(--acu-btn-active-bg);
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        opacity: 1;
        transform: translateY(-1px);
    }
    .acu-gacha-draw-btn i {
        font-size: 18px;
    }
    .acu-gacha-draw-btn strong {
        font-size: 18px;
    }
    .acu-gacha-draw-ten {
        min-height: 56px;
        font-size: 17px;
    }
    .acu-gacha-stat-row .acu-badge,
    .acu-gacha-wallet-row .acu-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .acu-gacha-fortune-badge strong {
        color: var(--acu-text-main);
        font-size: inherit;
    }
    .acu-gacha-fortune-progress {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-fortune-progress-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-width: 0;
        color: var(--acu-text-main);
        font-size: 13px;
        font-weight: 800;
    }
    .acu-gacha-fortune-progress-head span,
    .acu-gacha-fortune-progress-head strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-fortune-progress-head span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-accent);
        flex-shrink: 0;
    }
    .acu-gacha-fortune-progress-head strong {
        color: var(--acu-text-main);
        text-align: right;
    }
    .acu-gacha-progress-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-progress-item {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 9px 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 14%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 68%, transparent);
    }
    .acu-gacha-progress-label {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;
        font-size: 11px;
        color: var(--acu-text-sub);
    }
    .acu-gacha-progress-label span,
    .acu-gacha-progress-label strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-progress-label strong {
        color: var(--acu-text-main);
        font-size: 12px;
    }
    .acu-gacha-progress-bar {
        width: 100%;
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-border) 55%, transparent);
    }
    .acu-gacha-progress-bar span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--acu-accent), color-mix(in srgb, var(--acu-accent) 70%, #b9f56c));
        transition: none;
    }
    .acu-gacha-active-progress.is-reward-flash {
        animation: acu-gacha-reward-flash 900ms ease-out;
        border-color: color-mix(in srgb, var(--acu-accent) 48%, var(--acu-border));
    }
    .acu-gacha-active-progress.is-reward-flash .acu-gacha-progress-bar span {
        transition-duration: 160ms;
    }
    @keyframes acu-gacha-reward-flash {
        0% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--acu-accent) 34%, transparent);
            transform: translateY(0);
        }
        35% {
            box-shadow: 0 0 0 4px color-mix(in srgb, var(--acu-accent) 18%, transparent);
            transform: translateY(-1px);
        }
        100% {
            box-shadow: 0 0 0 0 transparent;
            transform: translateY(0);
        }
    }
    .acu-gacha-progress-note {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 10px;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-pool-tabs {
        flex: 0 0 auto;
        display: flex;
        flex-wrap: nowrap;
        gap: 2px;
        min-height: 42px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 0 1px 0;
        align-items: flex-end;
        border-bottom: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        scrollbar-width: none;
    }
    .acu-gacha-pool-tabs::-webkit-scrollbar {
        display: none;
    }
    .acu-gacha-pool-tab {
        flex: 0 0 auto;
        min-width: 78px;
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 8px 6px;
        border: 0;
        border-bottom: 3px solid transparent;
        background: transparent;
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.15;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color .16s ease, border-color .16s ease, background-color .16s ease;
    }
    .acu-gacha-pool-tab i {
        flex-shrink: 0;
        font-size: 11px;
    }
    .acu-gacha-pool-tab:hover {
        color: var(--acu-text-main);
        background: color-mix(in srgb, var(--acu-table-hover) 70%, transparent);
    }
    .acu-gacha-pool-tab.active {
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        border-bottom-color: var(--acu-btn-active-text, #fff);
        background: var(--acu-btn-active-bg, var(--acu-accent));
        box-shadow:
            inset 0 -3px 0 var(--acu-btn-active-text, rgba(255, 255, 255, .95)),
            0 0 0 1px color-mix(in srgb, var(--acu-btn-active-text, #fff) 36%, transparent),
            0 8px 18px color-mix(in srgb, var(--acu-accent) 32%, transparent);
    }
    .acu-custom-table-name-icon.has-image {
        background-image: none !important;
    }
    .acu-custom-async-image {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: inherit;
        background: transparent;
        pointer-events: none;
        user-select: none;
    }
    .acu-gacha-settings-overlay,
    .acu-gacha-item-editor-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100dvh;
        z-index: 31340 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(0, 0, 0, .72);
    }
    .acu-gacha-item-editor-overlay {
        z-index: 31355 !important;
    }
    .acu-gacha-name-dialog-overlay {
        z-index: 31360 !important;
        height: 100dvh;
    }
    .acu-gacha-catalog-dialog-overlay,
    .acu-gacha-confirm-overlay {
        z-index: 31380 !important;
    }
    .acu-gacha-settings-dialog,
    .acu-gacha-item-editor,
    .acu-gacha-name-dialog {
        width: min(920px, 94vw);
        max-height: min(88dvh, 920px);
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        border: 1px solid var(--acu-border);
        border-radius: 12px;
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
        box-shadow: 0 22px 60px rgba(0, 0, 0, .42);
        color-scheme: light;
    }
    .acu-gacha-item-editor {
        width: min(720px, 94vw);
    }
    .acu-gacha-name-dialog {
        width: min(420px, 92vw);
    }
    .acu-gacha-settings-header,
    .acu-gacha-settings-footer,
    .acu-gacha-settings-section-head {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    .acu-gacha-settings-header {
        padding-bottom: 10px;
        border-bottom: 1px solid var(--acu-border);
    }
    .acu-gacha-settings-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 17px;
        font-weight: 800;
    }
    .acu-gacha-settings-header-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex: 0 0 auto;
    }
    .acu-gacha-settings-body,
    .acu-gacha-item-editor-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-right: 2px;
    }
    .acu-gacha-settings-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .acu-gacha-settings-items-section {
        gap: 10px;
    }
    .acu-gacha-settings-items-section > .acu-gacha-settings-section-head {
        display: grid;
        grid-template-columns: minmax(150px, max-content) minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: 0 0 2px;
        border: 0;
        border-radius: 0;
        background: transparent;
    }
    .acu-gacha-settings-section-head > div:first-child {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .acu-gacha-settings-section-head strong {
        font-size: 14px;
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-section-head span {
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
    }
    .acu-gacha-settings-section-head .acu-dialog-btn,
    .acu-gacha-settings-toolbar .acu-dialog-btn {
        flex: 0 0 auto !important;
        width: auto !important;
        min-width: 124px;
        min-height: 34px;
        padding: 7px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
    }
    .acu-gacha-settings-pool-list,
    .acu-gacha-settings-item-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .acu-gacha-settings-pool-item,
    .acu-gacha-settings-item {
        min-width: 0;
        display: grid;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 86%, var(--acu-accent));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-card-bg) 90%, transparent);
    }
    .acu-gacha-settings-pool-item {
        grid-template-columns: 28px minmax(0, 1fr) auto;
        margin-bottom: 0;
    }
    .acu-gacha-settings-item {
        grid-template-columns: 22px 38px minmax(0, 1fr) auto;
        gap: 8px;
        padding: 9px 10px;
        border-radius: 9px;
        cursor: pointer;
    }
    .acu-gacha-settings-item:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 72%, transparent);
        outline-offset: 2px;
    }
    .acu-gacha-settings-item .acu-gacha-settings-actions {
        cursor: auto;
    }
    .acu-gacha-settings-item .acu-gacha-item-handle {
        cursor: grab;
    }
    .acu-gacha-settings-pool-item.is-hidden,
    .acu-gacha-settings-item.is-disabled,
    .acu-gacha-settings-item[style*="display: none"] {
        opacity: .55;
    }
    .acu-gacha-settings-pool-main,
    .acu-gacha-settings-item-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .acu-gacha-settings-pool-name,
    .acu-gacha-settings-item-name {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        color: var(--acu-text-main);
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
    }
    .acu-gacha-settings-pool-name span,
    .acu-gacha-settings-item-name span {
        flex: 0 0 auto;
        padding: 1px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 18%, transparent);
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
    }
    .acu-gacha-settings-pool-meta,
    .acu-gacha-settings-item-meta,
    .acu-gacha-settings-item-desc {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-settings-item-custom-fields {
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
    }
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview {
        max-height: 42px;
        overflow: hidden;
    }
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-chip,
    .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview-more {
        max-width: min(100%, 220px);
    }
    .acu-gacha-settings-actions {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
    }
    .acu-gacha-settings-inline-actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .acu-gacha-settings-more {
        position: relative;
        display: none;
    }
    .acu-gacha-settings-more > summary {
        list-style: none;
    }
    .acu-gacha-settings-more > summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-settings-more-menu {
        position: absolute;
        right: 0;
        top: calc(100% + 6px);
        z-index: 3;
        min-width: 116px;
        display: grid;
        gap: 4px;
        padding: 6px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 76%, transparent);
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-bg-panel) 96%, #000);
        box-shadow: 0 12px 26px rgba(0, 0, 0, .36);
    }
    .acu-gacha-settings-more:not([open]) .acu-gacha-settings-more-menu {
        display: none;
    }
    .acu-gacha-settings-more-menu button {
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--acu-text-main);
        padding: 6px 8px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        text-align: left;
    }
    .acu-gacha-settings-more-menu button:hover {
        background: color-mix(in srgb, var(--acu-table-hover) 80%, transparent);
    }
    .acu-gacha-settings-more-menu button.danger {
        color: var(--acu-error-text);
    }
    .acu-gacha-pool-all-fixed,
    .acu-gacha-settings-toolbar,
    .acu-gacha-settings-search {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .acu-gacha-pool-all-fixed {
        justify-content: center;
        width: 44px;
        height: 24px;
        flex: 0 0 44px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 999px;
        color: var(--acu-text-sub);
        background: color-mix(in srgb, var(--acu-btn-bg) 70%, transparent);
        font-size: 10px;
        font-weight: 800;
    }
    .acu-gacha-pool-all-toggle {
        flex: 0 0 44px;
        margin: 0;
    }
    .acu-gacha-pool-visible-toggle:disabled {
        opacity: .45;
        cursor: default;
    }
    .acu-gacha-pool-handle,
    .acu-gacha-pool-handle-placeholder,
    .acu-gacha-item-handle {
        width: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--acu-text-sub);
        touch-action: none;
    }
    .acu-gacha-settings-items-section.is-searching .acu-gacha-item-handle {
        opacity: .38;
        cursor: not-allowed;
    }
    .acu-gacha-settings-item-icon {
        width: 34px;
        aspect-ratio: 1 / 1;
        height: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 18px;
        overflow: hidden;
    }
    .acu-gacha-settings-toolbar {
        width: 100%;
        min-width: 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(104px, max-content)) minmax(220px, 1fr);
        align-items: center;
        justify-content: stretch;
        gap: 8px;
    }
    .acu-gacha-settings-toolbar .acu-dialog-btn {
        min-width: 124px;
        justify-content: center;
    }
    .acu-gacha-settings-search {
        width: 100%;
        min-width: 0;
        justify-self: end;
        min-height: 34px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 10px;
        border: 1px solid var(--acu-border);
        border-radius: 9px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
    }
    .acu-gacha-settings-dialog .acu-gacha-settings-search input.acu-gacha-settings-item-search {
        width: 100%;
        min-width: 0;
        height: 100%;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        outline: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--acu-text-main) !important;
        font: inherit !important;
        font-size: 12px !important;
    }
    .acu-gacha-settings-filter {
        width: 100%;
        min-width: 0;
        min-height: 34px;
        max-width: none;
        border: 1px solid var(--acu-border);
        border-radius: 9px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        padding: 0 28px 0 10px;
        font: inherit;
        font-size: 12px;
        outline: 0;
        appearance: none;
        -webkit-appearance: none;
        background-image: linear-gradient(45deg, transparent 50%, var(--acu-text-sub) 50%), linear-gradient(135deg, var(--acu-text-sub) 50%, transparent 50%);
        background-position: calc(100% - 15px) 50%, calc(100% - 10px) 50%;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
    }
    .acu-gacha-settings-filter:focus {
        border-color: color-mix(in srgb, var(--acu-accent) 70%, var(--acu-border));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-settings-filter option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-filter-menu {
        position: relative;
        min-width: 104px;
        min-height: 34px;
    }
    .acu-gacha-settings-filter-trigger {
        width: 100%;
        min-height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 7px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 84%, transparent);
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-btn-bg) 78%, transparent);
        color: var(--acu-text-main);
        padding: 0 10px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
    }
    .acu-gacha-settings-filter-trigger > i:first-child {
        color: var(--acu-text-sub);
        font-size: 11px;
    }
    .acu-gacha-settings-filter-menu-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .acu-gacha-settings-filter-chevron {
        color: var(--acu-text-sub);
        font-size: 10px;
        transition: transform .16s ease;
    }
    .acu-gacha-settings-filter-menu.is-open .acu-gacha-settings-filter-chevron {
        transform: rotate(180deg);
    }
    .acu-gacha-settings-filter-menu.is-active .acu-gacha-settings-filter-trigger,
    .acu-gacha-settings-filter-trigger:hover,
    .acu-gacha-settings-filter-trigger:focus-visible {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 12%, var(--acu-btn-bg));
        outline: 0;
    }
    .acu-gacha-settings-filter-menu-list {
        position: absolute;
        right: 0;
        top: calc(100% + 7px);
        z-index: 4;
        min-width: 168px;
        display: none;
        gap: 4px;
        padding: 6px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 76%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-bg-panel) 96%, #000);
        box-shadow: 0 14px 28px rgba(0, 0, 0, .38);
    }
    .acu-gacha-settings-filter-menu.is-open .acu-gacha-settings-filter-menu-list {
        display: grid;
    }
    .acu-gacha-settings-filter-option {
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--acu-text-main);
        padding: 6px 8px;
        font: inherit;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        text-align: left;
    }
    .acu-gacha-settings-filter-option i {
        width: 14px;
        color: var(--acu-text-sub);
        text-align: center;
    }
    .acu-gacha-settings-filter-option:hover,
    .acu-gacha-settings-filter-option.active {
        background: color-mix(in srgb, var(--acu-accent) 16%, var(--acu-table-hover));
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-filter-option.active i {
        color: var(--acu-accent);
    }
    .acu-gacha-settings-pool-tabs {
        min-height: auto;
        gap: 6px;
        align-items: center;
        padding: 0 0 6px;
        border-bottom-color: color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab {
        min-width: 72px;
        min-height: 32px;
        padding: 6px 10px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 78%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--acu-btn-bg) 74%, transparent);
        font-size: 12px;
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab.active {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: var(--acu-btn-active-bg, var(--acu-accent));
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--acu-accent) 22%, transparent);
    }
    .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab.active i {
        color: inherit;
    }
    .acu-gacha-confirm-overlay .acu-import-warning-icon.danger,
    .acu-gacha-confirm-overlay .acu-import-confirm-btn.danger {
        background: var(--acu-error-bg) !important;
        border-color: var(--acu-error-text) !important;
        color: var(--acu-error-text) !important;
    }
    .acu-gacha-name-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
    }
    .acu-gacha-name-field input {
        min-height: 42px;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-main);
        padding: 8px 10px;
        font: inherit;
        outline: none;
    }
    .acu-gacha-name-field input:focus {
        border-color: var(--acu-accent);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-item-editor-body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: hidden auto;
    }
    .acu-gacha-item-editor-body label,
    .acu-gacha-item-pools,
    .acu-gacha-item-flags {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
    }
    .acu-gacha-item-editor-body label > span,
    .acu-gacha-item-pools > span {
        color: var(--acu-text-sub);
        line-height: 1.2;
    }
    .acu-gacha-item-editor-body label.wide,
    .acu-gacha-item-pools.wide,
    .acu-gacha-item-flags.wide,
    .acu-gacha-item-checkbox.wide {
        grid-column: 1 / -1;
    }
    .acu-gacha-item-editor-body input,
    .acu-gacha-item-editor-body select,
    .acu-gacha-item-editor-body textarea {
        width: 100%;
        min-width: 0;
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        background: color-mix(in srgb, var(--acu-btn-bg) 96%, var(--acu-bg-panel)) !important;
        color: var(--acu-text-main) !important;
        -webkit-text-fill-color: var(--acu-text-main);
        padding: 8px 9px;
        font: inherit;
        font-size: 12px;
        box-shadow: none !important;
        color-scheme: light;
        forced-color-adjust: none;
        appearance: none;
        -webkit-appearance: none;
    }
    .acu-gacha-item-editor-body input:focus,
    .acu-gacha-item-editor-body select:focus,
    .acu-gacha-item-editor-body textarea:focus {
        outline: 0;
        border-color: color-mix(in srgb, var(--acu-accent) 70%, var(--acu-border));
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--acu-accent) 18%, transparent) !important;
    }
    .acu-gacha-item-editor-body input[type="file"] {
        min-height: 38px;
        padding: 6px;
        cursor: pointer;
    }
    .acu-gacha-item-editor-body input[type="file"]::file-selector-button {
        margin-right: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 45%, var(--acu-border));
        border-radius: 7px;
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
        color: var(--acu-text-main);
        padding: 5px 9px;
        font: inherit;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
    }
    .acu-gacha-item-editor-body select {
        padding-right: 28px;
        background-image: linear-gradient(45deg, transparent 50%, var(--acu-text-sub) 50%), linear-gradient(135deg, var(--acu-text-sub) 50%, transparent 50%);
        background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
        background-size: 5px 5px, 5px 5px;
        background-repeat: no-repeat;
    }
    .acu-gacha-item-editor-body option {
        background: var(--acu-bg-panel);
        color: var(--acu-text-main);
    }
    .acu-gacha-item-editor-body input::placeholder,
    .acu-gacha-item-editor-body textarea::placeholder,
    .acu-gacha-settings-search input::placeholder {
        color: color-mix(in srgb, var(--acu-text-sub) 78%, transparent);
        -webkit-text-fill-color: color-mix(in srgb, var(--acu-text-sub) 78%, transparent);
    }
    .acu-gacha-item-editor-body textarea {
        resize: vertical;
        min-height: 76px;
    }
    .acu-gacha-item-pools > div {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
    }
    .acu-gacha-item-flags {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .acu-gacha-icon-editor-card {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: minmax(92px, 112px) minmax(0, 1fr);
        gap: 12px;
        align-items: start;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 82%, var(--acu-accent));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 88%, transparent);
    }
    .acu-gacha-icon-editor-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        min-height: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 28%, var(--acu-border));
        border-radius: 14px;
        background:
            linear-gradient(135deg, color-mix(in srgb, var(--acu-accent) 14%, transparent), transparent),
            color-mix(in srgb, var(--acu-btn-bg) 82%, transparent);
        color: var(--acu-text-main);
        font-size: 30px;
        overflow: hidden;
    }
    .acu-gacha-icon-editor-fields {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
    }
    .acu-gacha-icon-editor-note {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.45;
    }
    .acu-gacha-custom-fields {
        grid-column: 1 / -1;
        border: 1px solid color-mix(in srgb, var(--acu-border) 86%, var(--acu-accent));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 90%, transparent);
        overflow: hidden;
    }
    .acu-gacha-custom-fields summary {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--acu-text-main);
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-custom-fields summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-custom-fields summary::after {
        content: '\f078';
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        transition: transform .14s ease, color .14s ease;
    }
    .acu-gacha-custom-fields[open] summary::after {
        transform: rotate(180deg);
        color: var(--acu-accent);
    }
    .acu-gacha-custom-fields summary > span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 850;
    }
    .acu-gacha-custom-fields summary small {
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
        text-align: right;
    }
    .acu-gacha-custom-field-panel {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 0 12px 12px;
    }
    .acu-gacha-custom-field-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding-top: 10px;
        border-top: 1px solid color-mix(in srgb, var(--acu-border) 70%, transparent);
    }
    .acu-gacha-custom-field-toolbar > div {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .acu-gacha-custom-field-toolbar strong {
        color: var(--acu-text-main);
        font-size: 12px;
        line-height: 1.2;
    }
    .acu-gacha-custom-field-toolbar small {
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 650;
        line-height: 1.35;
    }
    .acu-gacha-target-table-field {
        margin: 0;
    }
    .acu-gacha-target-column-toolbar {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        padding-top: 2px;
    }
    .acu-gacha-target-column-toolbar strong {
        color: var(--acu-text-main);
        font-size: 12px;
        line-height: 1.2;
    }
    .acu-gacha-target-column-toolbar small {
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 650;
        line-height: 1.35;
        text-align: right;
    }
    .acu-gacha-target-column-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-target-column-field {
        margin: 0;
    }
    .acu-gacha-custom-field-add {
        flex: 0 0 auto;
        min-height: 32px;
        padding: 6px 10px;
        font-size: 11px;
    }
    .acu-gacha-custom-field-add:disabled {
        opacity: .52;
        cursor: not-allowed;
    }
    .acu-gacha-custom-field-rows {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .acu-gacha-custom-field-row {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(120px, .85fr) minmax(0, 1.35fr) auto;
        gap: 8px;
        align-items: end;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
    }
    .acu-gacha-custom-field-row label {
        margin: 0;
    }
    .acu-gacha-custom-field-value {
        min-height: 38px;
        max-height: min(32dvh, 220px);
        overflow: auto;
        resize: vertical;
    }
    .acu-gacha-custom-field-remove {
        width: 34px;
        min-width: 34px;
        height: 34px;
        border: 1px solid color-mix(in srgb, var(--acu-error-border) 72%, var(--acu-border));
        border-radius: 9px;
        background: color-mix(in srgb, var(--acu-error-bg) 42%, var(--acu-btn-bg));
        color: color-mix(in srgb, var(--acu-error-text) 80%, var(--acu-text-main));
        cursor: pointer;
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-remove:hover:not(:disabled) {
        border-color: var(--acu-error-text);
        background: color-mix(in srgb, var(--acu-error-bg) 58%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-custom-field-remove:disabled {
        opacity: .48;
        cursor: not-allowed;
    }
    .acu-gacha-custom-field-suggestions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }
    .acu-gacha-custom-field-suggestions > span {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 800;
    }
    .acu-gacha-custom-field-suggestion-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-width: 0;
    }
    .acu-gacha-custom-field-suggestion {
        max-width: 100%;
        min-height: 30px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 36%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 10%, var(--acu-btn-bg));
        color: var(--acu-text-main);
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 800;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-suggestion:hover {
        border-color: var(--acu-accent);
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
    }
    .acu-gacha-custom-field-suggestion-empty {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-style: normal;
        font-weight: 650;
    }
    .acu-gacha-item-pool-option,
    .acu-gacha-item-checkbox {
        flex-direction: row !important;
        align-items: center;
        gap: 6px !important;
    }
    .acu-gacha-item-pool-option {
        width: auto !important;
        min-height: 34px;
        padding: 6px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-btn-bg) 86%, transparent);
        color: var(--acu-text-sub);
        transition: border-color .14s ease, background-color .14s ease, color .14s ease;
    }
    .acu-gacha-item-pool-option:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 58%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 10%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-item-pool-option:has(input:checked) {
        border-color: color-mix(in srgb, var(--acu-accent) 72%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-btn-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-item-pool-option input,
    .acu-gacha-item-checkbox input {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        border-radius: 6px;
        border: 1px solid var(--acu-border);
        background: color-mix(in srgb, var(--acu-btn-bg) 90%, transparent) !important;
        appearance: none;
        -webkit-appearance: none;
        display: inline-grid;
        place-items: center;
        color-scheme: light;
        forced-color-adjust: none;
    }
    .acu-gacha-item-pool-option input:checked,
    .acu-gacha-item-checkbox input:checked {
        border-color: var(--acu-accent);
        background: var(--acu-accent) !important;
    }
    .acu-gacha-item-pool-option input:checked::after,
    .acu-gacha-item-checkbox input:checked::after {
        content: "";
        width: 8px;
        height: 5px;
        border-left: 2px solid var(--acu-btn-active-text, #fff);
        border-bottom: 2px solid var(--acu-btn-active-text, #fff);
        transform: rotate(-45deg) translate(1px, -1px);
    }
    .acu-gacha-item-checkbox {
        min-height: 34px;
        padding: 6px 0;
        color: var(--acu-text-main);
    }
    .acu-gacha-settings-footer {
        padding-top: 12px;
        border-top: 1px solid var(--acu-border);
        flex-wrap: wrap;
    }
    .acu-gacha-settings-dialog > .acu-gacha-settings-footer {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
        align-items: stretch;
        gap: 8px;
    }
    .acu-gacha-settings-footer .acu-dialog-btn {
        flex: 1 1 132px;
        min-width: 0;
        min-height: 38px;
        border-radius: 8px;
        color: var(--acu-text-main);
        background: var(--acu-btn-bg);
        border-color: var(--acu-border);
        transition: background-color .14s ease, border-color .14s ease, color .14s ease, opacity .14s ease;
    }
    .acu-gacha-settings-footer .acu-dialog-btn:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-text-main);
        opacity: 1;
    }
    .acu-gacha-settings-footer .acu-btn-confirm,
    .acu-gacha-settings-footer .acu-btn-confirm:hover {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
    }
    .acu-gacha-settings-footer .danger:hover {
        border-color: var(--acu-error-text);
        color: var(--acu-error-text);
        background: var(--acu-error-bg);
    }
    .acu-gacha-item-editor .acu-dialog-btn:hover {
        background: var(--acu-btn-hover);
        border-color: var(--acu-accent);
        color: var(--acu-text-main);
        opacity: 1;
    }
    .acu-gacha-item-editor .acu-btn-confirm:hover {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        opacity: .9;
    }
    .acu-gacha-pickup-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-accent) 11%, transparent), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-pickup-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .02em;
    }
    .acu-gacha-pickup-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }
    .acu-gacha-pickup-card {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        padding: 10px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        transition: transform .14s ease, border-color .14s ease, background .14s ease;
    }
    .acu-gacha-pickup-card:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--acu-accent) 45%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 84%, var(--acu-accent) 10%);
    }
    .acu-gacha-pickup-card:focus-visible {
        outline: 2px solid var(--acu-accent);
        outline-offset: 2px;
    }
    .acu-gacha-pickup-card strong {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: var(--acu-text-main);
        font-size: 13px;
        line-height: 1.25;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-pickup-card-icon {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 13px;
        line-height: 1;
    }
    .acu-gacha-pickup-desc {
        color: var(--acu-text-sub);
        font-size: 11px;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .acu-gacha-custom-field-preview {
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
    .acu-gacha-custom-field-preview-chip,
    .acu-gacha-custom-field-chip,
    .acu-gacha-custom-field-preview-more {
        min-width: 0;
        max-width: 100%;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-card-bg) 76%, var(--acu-accent));
        color: var(--acu-text-main);
        font-size: 10px;
        font-weight: 750;
        line-height: 1.3;
    }
    .acu-gacha-custom-field-preview-key {
        flex: 0 1 auto;
        max-width: 45%;
        overflow: hidden;
        color: var(--acu-text-sub);
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-preview-value {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-preview-chip-value-only {
        max-width: min(100%, 168px);
        border-color: color-mix(in srgb, var(--acu-text-sub) 24%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-table-hover) 84%, transparent);
        color: var(--acu-text-main);
        font-weight: 700;
    }
    .acu-gacha-custom-field-preview-more {
        flex: 0 0 auto;
        color: var(--acu-accent);
    }
    .acu-gacha-pickup-rarity {
        width: fit-content;
        max-width: 100%;
        padding: 1px 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 22%, transparent);
        color: var(--acu-btn-active-text);
        font-size: 10px !important;
        font-weight: 800;
        line-height: 1.35 !important;
    }
    .acu-gacha-section {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 22%, var(--acu-border));
        border-radius: 12px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
    }
    .acu-gacha-recent-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: min(26dvh, 260px);
        overflow: hidden auto;
        padding-right: 2px;
        overscroll-behavior: contain;
        scrollbar-width: thin;
    }
    .acu-gacha-recent-detail-btn {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 10px;
        border: 1px solid transparent;
        border-radius: 10px;
        background: var(--acu-card-bg);
        color: var(--acu-text-main);
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background .14s ease, border-color .14s ease, transform .14s ease;
    }
    .acu-gacha-recent-detail-btn:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 36%, transparent);
        background: color-mix(in srgb, var(--acu-accent) 12%, var(--acu-card-bg));
        transform: translateY(-1px);
    }
    .acu-gacha-recent-detail-btn:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 62%, transparent);
        outline-offset: 2px;
    }
    .acu-gacha-recent-reward-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-recent-quality {
        flex-shrink: 0;
        opacity: .72;
    }
    .acu-gacha-static-field-row {
        cursor: default;
    }
    .acu-gacha-recent-section {
        gap: 0;
    }
    .acu-gacha-recent-section summary {
        min-width: 0;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-recent-section summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-recent-section summary > span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-weight: 800;
    }
    .acu-gacha-recent-section summary > strong {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main);
        font-size: 12px;
        font-weight: 800;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-recent-toggle {
        color: var(--acu-text-sub);
        transition: transform .16s ease;
    }
    .acu-gacha-recent-section[open] {
        gap: 8px;
    }
    .acu-gacha-recent-section[open] .acu-gacha-recent-toggle {
        transform: rotate(180deg);
    }
    .acu-gacha-shard-tabs {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 6px;
    }
    .acu-gacha-shard-tab {
        min-width: 0;
        height: 42px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px;
        margin: 0;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
        color: var(--acu-text-sub);
        cursor: pointer;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        appearance: none;
        -webkit-appearance: none;
        vertical-align: top;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-tab:hover {
        border-color: color-mix(in srgb, var(--acu-btn-active-bg) 55%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 16%, var(--acu-btn-bg));
        color: var(--acu-accent);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-tab i {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        line-height: 1;
    }
    .acu-gacha-shard-tab strong {
        display: inline-flex;
        align-items: center;
        color: var(--acu-text-main);
        font-size: 13px;
        line-height: 1;
    }
    .acu-gacha-shard-tab.active {
        background: var(--acu-btn-active-bg, var(--acu-accent));
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
        border-color: var(--acu-btn-active-bg, var(--acu-accent));
        box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--acu-btn-active-text, #fff) 16%, transparent),
            0 8px 18px color-mix(in srgb, var(--acu-accent) 24%, transparent);
        transform: none;
    }
    .acu-gacha-shard-tab.active:hover {
        transform: none;
    }
    .acu-gacha-shard-tab.active strong {
        color: inherit;
    }
    .acu-gacha-shard-shop-overlay {
        z-index: 31320 !important;
    }
    .acu-gacha-pickup-detail-overlay {
        z-index: 31365 !important;
    }
    .acu-gacha-custom-field-details,
    .acu-gacha-custom-fields-details {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-card-bg) 94%, transparent);
    }
    .acu-gacha-custom-field-details summary,
    .acu-gacha-custom-fields-details summary {
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--acu-text-main);
        cursor: pointer;
        list-style: none;
    }
    .acu-gacha-custom-field-details summary::-webkit-details-marker,
    .acu-gacha-custom-fields-details summary::-webkit-details-marker {
        display: none;
    }
    .acu-gacha-custom-field-details summary::after,
    .acu-gacha-custom-fields-details summary::after {
        content: '\f078';
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        transition: transform .14s ease, color .14s ease;
    }
    .acu-gacha-custom-field-details[open] summary::after,
    .acu-gacha-custom-fields-details[open] summary::after {
        transform: rotate(180deg);
        color: var(--acu-accent);
    }
    .acu-gacha-custom-field-details summary > span,
    .acu-gacha-custom-fields-details summary > span {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
        font-size: 13px;
        font-weight: 850;
    }
    .acu-gacha-custom-field-details summary strong,
    .acu-gacha-custom-fields-details summary strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-custom-field-details summary small,
    .acu-gacha-custom-fields-details summary small {
        flex: 0 0 auto;
        color: var(--acu-text-sub);
        font-size: 10px;
        font-weight: 700;
    }
    .acu-gacha-custom-field-detail-list {
        max-height: min(34dvh, 320px);
        overflow: hidden auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 12px 12px;
    }
    .acu-gacha-custom-field-detail-row {
        min-width: 0;
        display: grid;
        grid-template-columns: minmax(96px, .42fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-border) 72%, transparent);
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-btn-bg) 72%, transparent);
    }
    .acu-gacha-custom-field-detail-key,
    .acu-gacha-custom-field-detail-value {
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
    .acu-gacha-custom-field-detail-key {
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.35;
    }
    .acu-gacha-custom-field-detail-value {
        color: var(--acu-text-main);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.45;
        white-space: pre-wrap;
    }
    .acu-gacha-shard-shop {
        width: min(760px, 94vw);
        max-height: min(86dvh, 760px);
        overflow: hidden;
        gap: 10px;
        padding: 14px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-header {
        align-items: center;
        gap: 10px;
        padding-bottom: 0;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-head-main {
        gap: 8px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        font-size: 20px;
    }
    .acu-gacha-shard-shop .acu-inventory-detail-title {
        font-size: 18px;
        line-height: 1.1;
    }
    .acu-gacha-shard-shop .acu-preview-close {
        width: 34px;
        height: 34px;
        border-radius: 10px;
    }
    .acu-gacha-shard-items {
        min-height: 0;
        max-height: min(56dvh, 520px);
        flex: 0 1 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        grid-auto-rows: minmax(76px, max-content);
        align-content: start;
        gap: 10px;
        overflow: hidden auto;
        padding-right: 2px;
        scrollbar-width: none;
    }
    .acu-gacha-shard-item-card {
        position: relative;
        min-width: 0;
        display: block;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        color: var(--acu-text-main);
        overflow: hidden;
        touch-action: manipulation;
        transition: border-color .16s ease, background .16s ease, transform .16s ease, box-shadow .16s ease;
    }
    .acu-gacha-shard-item-card > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-item-card:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 34%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 92%, var(--acu-accent));
        transform: translateY(-1px);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--acu-accent) 12%, transparent);
    }
    .acu-gacha-shard-item-card.is-disabled {
        cursor: default;
    }
    .acu-gacha-shard-item-card.is-disabled:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 28%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 94%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-gacha-shard-price,
    .acu-gacha-shard-owned {
        position: absolute;
        right: 10px;
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 4px 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-btn-bg) 78%, transparent);
        color: var(--acu-accent);
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
    }
    .acu-gacha-shard-price {
        top: 10px;
        z-index: 3;
        cursor: pointer;
        overflow: hidden;
        pointer-events: auto;
        transition: border-color .16s ease, background .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-price > * {
        position: relative;
        z-index: 1;
    }
    .acu-gacha-shard-price i {
        font-size: 12px;
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price {
        border-color: color-mix(in srgb, var(--acu-btn-active-bg) 42%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-active-bg) 16%, var(--acu-card-bg));
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card.is-available .acu-gacha-shard-price:hover {
        border-color: var(--acu-btn-active-bg);
        background: color-mix(in srgb, var(--acu-btn-active-bg) 24%, var(--acu-card-bg));
        color: var(--acu-accent);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price,
    .acu-gacha-shard-item-card.is-disabled .acu-gacha-shard-price:hover {
        cursor: not-allowed;
        border-color: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 62%, transparent);
        color: var(--acu-text-sub);
        transform: none;
    }
    .acu-gacha-shard-owned {
        bottom: 10px;
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-card-main {
        width: 100%;
        min-height: 76px;
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
        padding: 12px;
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-align: left;
        user-select: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main,
    .acu-gacha-shard-card-main:hover {
        background: transparent;
        border-color: transparent;
        color: inherit;
        box-shadow: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:hover,
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus {
        background: transparent;
        color: inherit;
        transform: none;
    }
    .acu-gacha-shard-shop .acu-gacha-shard-card-main:focus-visible {
        outline: 2px solid color-mix(in srgb, var(--acu-accent) 54%, transparent);
        outline-offset: -4px;
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
    }
    .acu-gacha-shard-item-card:hover .acu-gacha-shard-item-icon {
        background: color-mix(in srgb, var(--acu-accent) 18%, transparent);
    }
    .acu-gacha-shard-item-icon {
        width: 56px;
        aspect-ratio: 1 / 1;
        height: auto;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-accent) 14%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-item-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-card-main .acu-gacha-custom-field-preview {
        max-height: 38px;
        overflow: hidden;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-right: 58px;
    }
    .acu-gacha-shard-item-head strong,
    .acu-gacha-shard-item-head span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-item-head strong {
        color: var(--acu-text-main);
        font-size: 14px;
        font-weight: 900;
    }
    .acu-gacha-shard-item-head span,
    .acu-gacha-shard-item-desc {
        color: var(--acu-text-sub);
        font-size: 11px;
    }
    .acu-gacha-shard-item-desc {
        display: none;
        margin: 0;
        line-height: 1.45;
    }
    .acu-gacha-shard-confirm-overlay {
        z-index: 31370 !important;
        padding: 18px;
        background: rgba(0, 0, 0, 0.42);
        backdrop-filter: blur(4px);
    }
    .acu-gacha-shard-confirm {
        width: min(360px, 92vw);
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 30%, var(--acu-border));
        border-radius: 16px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 96%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
    }
    .acu-gacha-shard-confirm-head {
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr);
        gap: 12px;
        align-items: center;
    }
    .acu-gacha-shard-confirm-icon {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-accent) 12%, transparent);
        font-size: 28px;
    }
    .acu-gacha-shard-confirm-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-gacha-shard-confirm-text strong {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main);
        font-size: 16px;
        font-weight: 900;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .acu-gacha-shard-confirm-text span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 12px;
        font-weight: 800;
    }
    .acu-gacha-shard-confirm-text small {
        color: var(--acu-text-sub);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.35;
    }
    .acu-gacha-shard-confirm-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .acu-gacha-shard-confirm-btn {
        min-height: 40px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 12px;
        background: color-mix(in srgb, var(--acu-btn-bg) 82%, transparent);
        color: var(--acu-text-main);
        cursor: pointer;
        font-size: 13px;
        font-weight: 900;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease;
    }
    .acu-gacha-shard-confirm-btn:hover {
        border-color: var(--acu-btn-active-bg);
        transform: translateY(-1px);
    }
    .acu-gacha-shard-confirm-btn.primary {
        background: var(--acu-btn-active-bg);
        border-color: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #fff));
    }
    .acu-gacha-shard-confirm-btn.secondary:hover {
        background: color-mix(in srgb, var(--acu-accent) 14%, var(--acu-btn-bg));
        color: var(--acu-accent);
    }
    .acu-inventory-toolbar {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 5px 7px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 10px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
            color-mix(in srgb, var(--acu-card-bg) 92%, #0f1b2b);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .acu-inventory-filter-collapse-btn {
        width: 100%;
        min-height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 7px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--acu-text-main);
        cursor: pointer;
        text-align: left;
        transition: background-color .16s ease, color .16s ease;
    }
    .acu-inventory-filter-collapse-btn:hover {
        background: color-mix(in srgb, var(--acu-table-hover) 88%, transparent);
    }
    .acu-inventory-filter-collapse-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        color: var(--acu-text-sub);
        font-size: 12px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-collapse-title > i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-count {
        min-width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--acu-accent) 24%, transparent);
        color: var(--acu-btn-active-text);
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
    }
    .acu-inventory-filter-collapse-icon {
        color: var(--acu-text-sub);
        font-size: 12px;
        transition: transform 0.24s ease;
    }
    .acu-inventory-filter-collapse-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 6px;
        overflow: hidden;
        max-height: 420px;
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity var(--acu-motion-normal) var(--acu-ease-standard),
            transform var(--acu-motion-normal) var(--acu-ease-out);
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-body {
        max-height: 0;
        opacity: 0;
        margin-top: 0;
        transform: translateY(-2px);
        pointer-events: none;
    }
    .acu-inventory-filter-collapsible.collapsed .acu-inventory-filter-collapse-icon {
        transform: rotate(-90deg);
    }
    .acu-inventory-search {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .acu-inventory-search i {
        position: absolute;
        left: 12px;
        color: var(--acu-accent);
        opacity: 0.82;
        pointer-events: none;
    }
    .acu-inventory-search input {
        width: 100%;
        min-height: 42px;
        padding: 10px 12px 10px 36px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        background-color: color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        color: var(--acu-text-main) !important;
        -webkit-text-fill-color: var(--acu-text-main) !important;
        font-size: var(--acu-font-size, 13px);
        outline: none;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        -webkit-box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            inset 0 0 0 1000px color-mix(in srgb, var(--acu-input-bg, var(--acu-card-bg)) 88%, #08121d) !important;
        appearance: none;
        -webkit-appearance: none;
    }
    .acu-inventory-search input::placeholder {
        color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        -webkit-text-fill-color: color-mix(in srgb, var(--acu-text-sub) 88%, transparent) !important;
        opacity: 1;
    }
    .acu-inventory-search-inline {
        width: min(190px, 38vw);
        flex: 0 1 min(190px, 38vw);
    }
    .acu-inventory-search-inline input {
        min-height: 34px;
        padding-top: 7px;
        padding-bottom: 7px;
        font-size: 12px;
    }
    .acu-inventory-filter-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .acu-inventory-filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--acu-text-sub);
        font-size: 11px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }
    .acu-inventory-filter-label i {
        color: var(--acu-accent);
    }
    .acu-inventory-filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
        gap: 6px;
    }
    .acu-inventory-filter-btn {
        min-height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.12)),
            color-mix(in srgb, var(--acu-btn-bg) 92%, #0b1624);
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: transform .16s ease, border-color .16s ease, color .16s ease, background-color .16s ease, box-shadow .16s ease;
    }
    .acu-inventory-filter-btn:hover {
        color: var(--acu-text-main);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
        transform: translateY(-1px);
    }
    .acu-inventory-filter-btn.active {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
        box-shadow:
            0 0 0 1px color-mix(in srgb, var(--acu-accent) 24%, transparent),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
    }
    .acu-inventory-overlay .acu-inventory-filter-btn:hover {
        color: var(--acu-accent);
        border-color: color-mix(in srgb, var(--acu-accent) 64%, var(--acu-border));
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.04)),
            color-mix(in srgb, var(--acu-card-bg) 86%, var(--acu-accent));
    }
    .acu-inventory-overlay .acu-inventory-filter-btn.active,
    .acu-inventory-overlay .acu-inventory-filter-btn.active:hover {
        color: var(--acu-btn-active-text);
        border-color: color-mix(in srgb, var(--acu-accent) 80%, white 8%);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.08)),
            var(--acu-btn-active-bg);
    }
    .acu-inventory-grid {
        flex: 1;
        overflow: hidden auto;
        min-height: 0;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap: 8px;
        row-gap: 6px;
        justify-content: start;
        align-content: start;
        min-width: 0;
        padding-right: 2px;
        grid-auto-rows: max-content;
    }
    .acu-inventory-grid.is-empty {
        grid-template-columns: minmax(0, 1fr);
        justify-content: stretch;
    }
    .acu-inventory-card {
        display: flex;
        flex-direction: column;
        min-width: 0;
        border: 0;
        border-radius: 16px;
        background: transparent;
        color: var(--acu-text-main);
        overflow: visible;
        transition: transform .18s ease, opacity .18s ease;
    }
    .acu-inventory-card:hover {
        transform: translateY(-2px);
    }
    .acu-inventory-card.is-depleted {
        opacity: .46;
    }
    .acu-inventory-card.acu-inventory-changed {
        filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--acu-hl-diff) 18%, transparent));
    }
    .acu-inventory-card-main {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 3px;
        align-items: center;
        border: 0;
        background: transparent;
        color: var(--acu-text-main);
        text-align: center;
        padding: 2px 2px 4px;
        cursor: pointer;
        min-width: 0;
        border-radius: 12px;
        transition: background-color .16s ease;
    }
    .acu-inventory-card-main:hover {
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
    }
    .acu-inventory-card.acu-inventory-changed .acu-inventory-card-main {
        background: color-mix(in srgb, var(--acu-hl-diff) 10%, transparent);
    }
    .acu-inventory-slot-visual {
        position: relative;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: min(100%, 76px);
        min-height: 68px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
    }
    .acu-inventory-icon {
        width: 60px;
        height: 60px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        line-height: 1;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
        overflow: hidden;
        transition: transform .16s ease;
    }
    .acu-inventory-card-main:hover .acu-inventory-icon {
        transform: scale(1.05);
    }
    .acu-inventory-card-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 100%;
        align-items: center;
    }
    .acu-inventory-name {
        font-weight: 700;
        color: var(--acu-text-main);
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        min-width: 0;
        line-height: 1.2;
        font-size: 12px;
        max-width: 100%;
    }
    .acu-inventory-meta,
    .acu-inventory-badges,
    .acu-inventory-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex-wrap: wrap;
        min-width: 0;
    }
    .acu-inventory-type,
    .acu-inventory-quality,
    .acu-inventory-change-badge,
    .acu-inventory-task-badge,
    .acu-inventory-empty-badge,
    .acu-inventory-presence {
        display: inline-flex;
        align-items: center;
        min-height: 20px;
        padding: 1px 7px;
        border-radius: 999px;
        border: 1px solid var(--acu-border);
        background: var(--acu-badge-bg);
        color: var(--acu-text-main);
        font-size: 10px;
        line-height: 1.4;
        white-space: nowrap;
    }
    .acu-inventory-quality {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-change-badge {
        border-color: var(--acu-hl-diff);
        color: var(--acu-hl-diff);
        background: var(--acu-hl-diff-bg);
        font-weight: 700;
    }
    .acu-inventory-task-badge {
        color: var(--acu-warning-text);
        background: var(--acu-warning-bg);
        border-color: var(--acu-warning-icon);
    }
    .acu-inventory-empty-badge {
        color: var(--acu-text-sub);
    }
    .acu-inventory-count {
        position: absolute;
        right: 6px;
        bottom: 5px;
        min-width: 22px;
        height: 22px;
        padding: 0 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: var(--acu-btn-active-bg);
        color: var(--acu-btn-active-text);
        font-weight: 800;
        font-size: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.26);
    }
    .acu-inventory-icon-btn {
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-btn-bg) 92%, #101927);
        color: var(--acu-text-main);
        cursor: pointer;
    }
    .acu-inventory-icon-btn:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-empty {
        grid-column: 1 / -1;
        min-height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        border: 1px dashed color-mix(in srgb, var(--acu-accent) 20%, var(--acu-border));
        border-radius: 12px;
        color: var(--acu-text-sub);
        background: color-mix(in srgb, var(--acu-card-bg) 90%, #101927);
        text-align: center;
        padding: 18px;
    }
    .acu-inventory-empty[hidden] {
        display: none !important;
    }
    .acu-inventory-empty.compact {
        min-height: 88px;
    }
    .acu-inventory-empty i {
        color: var(--acu-accent);
        font-size: 22px;
    }
    .acu-inventory-detail-overlay {
        position: fixed;
        inset: 0;
        z-index: 31250;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
        background: color-mix(in srgb, var(--acu-overlay-bg, rgba(0, 0, 0, 0.62)) 74%, transparent);
        backdrop-filter: blur(3px);
    }
    .acu-inventory-detail {
        width: min(560px, 94vw);
        max-height: min(78vh, 720px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow: hidden auto;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 26%, var(--acu-border));
        border-radius: 18px;
        background:
            linear-gradient(180deg, color-mix(in srgb, var(--acu-card-bg) 95%, white 3%), color-mix(in srgb, var(--acu-bg-panel) 98%, #f1ede3));
        color: var(--acu-text-main);
        box-shadow: 0 18px 44px var(--acu-shadow);
        padding: 18px;
    }
    .acu-inventory-detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding-bottom: 2px;
    }
    .acu-inventory-detail-head-main {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 0;
        flex: 1;
    }
    .acu-inventory-detail-icon {
        width: 72px;
        height: 72px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        border: 0;
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
        font-size: 42px;
        line-height: 1;
    }
    .acu-inventory-detail-summary {
        min-width: 0;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .acu-inventory-detail-title-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
    }
    .acu-inventory-detail-title {
        min-width: 0;
        max-width: 100%;
        color: var(--acu-text-main);
        font-size: 30px;
        font-weight: 800;
        word-break: break-word;
        line-height: 1.15;
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail-inline-action {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .acu-inventory-detail-inline-action:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
        background: var(--acu-table-hover);
    }
    .acu-inventory-detail-header-actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }
    .acu-inventory-detail .acu-preview-close {
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 24%, var(--acu-border));
        border-radius: 10px;
        background: color-mix(in srgb, var(--acu-accent) 8%, transparent);
        color: var(--acu-accent);
        cursor: pointer;
        transition: border-color .15s ease, color .15s ease, background .15s ease;
    }
    .acu-inventory-detail .acu-preview-close:hover {
        border-color: var(--acu-error-text);
        background: var(--acu-error-bg);
        color: var(--acu-error-text);
    }
    .acu-inventory-detail-sub,
    .acu-inventory-detail-desc {
        color: var(--acu-text-sub);
        font-size: 15px;
        line-height: 1.55;
        word-break: break-word;
    }
    .acu-inventory-detail-sub {
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail .acu-inventory-detail-sub:hover {
        background: transparent;
        color: var(--acu-accent);
    }
    .acu-inventory-detail-field-row {
        width: 100%;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover {
        background: color-mix(in srgb, var(--acu-card-bg) 88%, var(--acu-accent));
        color: inherit;
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover .acu-inventory-detail-field-label {
        color: var(--acu-accent);
    }
    .acu-inventory-detail .acu-inventory-detail-field-row:hover .acu-inventory-detail-field-value {
        color: var(--acu-text-main);
    }
    .acu-inventory-detail-field-label {
        color: var(--acu-text-sub);
        font-size: 13px;
        flex: 0 0 auto;
    }
    .acu-inventory-detail-field-value {
        color: var(--acu-text-main);
        font-size: 15px;
        font-weight: 700;
        text-align: right;
        word-break: break-word;
    }
    .acu-inventory-detail-desc {
        background: var(--acu-card-bg);
        border: 1px solid var(--acu-border);
        border-radius: 14px;
        padding: 14px 16px;
        width: 100%;
        box-sizing: border-box;
        text-align: left;
        cursor: pointer;
    }
    .acu-inventory-detail .acu-inventory-detail-desc:hover {
        border-color: color-mix(in srgb, var(--acu-accent) 34%, var(--acu-border));
        background: color-mix(in srgb, var(--acu-card-bg) 92%, var(--acu-accent));
        color: var(--acu-text-sub);
    }
    .acu-inventory-detail-meta-wrap {
        display: block;
        padding: 12px 14px;
        box-sizing: border-box;
        border: 1px solid color-mix(in srgb, var(--acu-accent) 18%, var(--acu-border));
        border-radius: 14px;
        background: color-mix(in srgb, var(--acu-card-bg) 94%, transparent);
        cursor: pointer;
    }
    .acu-inventory-detail-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .acu-inventory-meta-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-enum-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-enum-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 4px 2px;
    }
    .acu-inventory-enum-option {
        justify-content: center;
    }
    .acu-inventory-enum-option.is-active {
        border-color: var(--acu-accent);
        background: color-mix(in srgb, var(--acu-accent) 18%, var(--acu-card-bg));
        color: var(--acu-accent);
    }
    .acu-inventory-edit-overlay {
        z-index: 31270 !important;
    }
    .acu-inventory-edit-overlay .acu-edit-dialog {
        position: relative;
        z-index: 31271 !important;
    }
    .acu-inventory-meta-overlay {
        z-index: 31270 !important;
    }
    .acu-inventory-meta-overlay .acu-inventory-meta-dialog {
        position: relative;
        z-index: 31271 !important;
    }
    .acu-inventory-detail-menu.acu-cell-menu {
        position: absolute !important;
        z-index: 31266 !important;
        min-width: min(280px, calc(100vw - 16px));
    }
    .acu-menu-backdrop.acu-inventory-detail-menu-backdrop {
        position: absolute !important;
        inset: 0;
        z-index: 31265 !important;
    }
    .acu-inventory-detail-actions {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 2px;
        align-self: flex-start;
        width: fit-content;
        max-width: 100%;
    }
    .acu-inventory-detail-actions .acu-action-item {
        padding: 7px 12px;
        font-size: 13px;
        border-radius: 999px;
        gap: 6px;
    }
    .acu-inventory-detail-actions .acu-action-item i {
        font-size: 11px;
    }
    .acu-inventory-gift-dialog {
        width: min(420px, 92vw);
    }
    .acu-inventory-gift-overlay {
        z-index: 31260 !important;
    }
    .acu-inventory-gift-overlay .acu-inventory-gift-dialog {
        position: relative;
        z-index: 31261 !important;
    }
    .acu-inventory-gift-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }
    .acu-inventory-gift-title-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }
    .acu-inventory-gift-close,
    .acu-inventory-gift-filter-toggle {
        width: 34px;
        height: 34px;
        flex-shrink: 0;
        border: 1px solid var(--acu-border);
        border-radius: 8px;
        background: var(--acu-btn-bg);
        color: var(--acu-text-sub);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
    }
    .acu-inventory-gift-close:hover,
    .acu-inventory-gift-filter-toggle:hover {
        border-color: var(--acu-accent);
        color: var(--acu-accent);
    }
    .acu-inventory-gift-filter-toggle.active {
        background: var(--acu-accent);
        border-color: var(--acu-accent);
        color: var(--acu-btn-active-text);
    }
    .acu-inventory-gift-list {
        display: grid;
        gap: 8px;
        max-height: 52vh;
        overflow-y: auto;
        padding: 4px;
    }
    .acu-inventory-gift-target {
        width: 100%;
        min-height: 54px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 10px;
        background: var(--acu-card-bg);
        color: var(--acu-text-main);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s, background 0.15s, transform 0.15s;
    }
    .acu-inventory-gift-target:hover {
        border-color: var(--acu-accent);
        background: var(--acu-table-hover);
    }
    .acu-inventory-gift-target.is-away:hover {
        border-color: var(--acu-border);
    }
    .acu-inventory-gift-avatar {
        width: 38px;
        height: 38px;
        cursor: inherit;
        transition: border-color 0.15s, filter 0.15s, opacity 0.15s;
    }
    .acu-inventory-gift-avatar:hover {
        border-color: inherit;
    }
    .acu-inventory-gift-avatar.is-away {
        border-color: var(--acu-border);
        filter: grayscale(80%) brightness(0.7);
        opacity: 0.5;
    }
    .acu-inventory-gift-avatar span {
        font-size: 14px;
        color: var(--acu-text-main);
    }
    .acu-inventory-gift-avatar.is-away span {
        color: var(--acu-text-sub);
    }
    .acu-inventory-gift-avatar-indicator {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--acu-accent);
        border: 2px solid var(--acu-card-bg);
        box-sizing: border-box;
    }
    .acu-inventory-gift-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 600;
        color: var(--acu-text-main);
    }
    .acu-inventory-gift-name.is-away {
        color: var(--acu-text-sub);
        opacity: 0.7;
    }
    .acu-inventory-presence {
        justify-self: end;
        min-width: 44px;
        padding: 4px 10px;
        border: 1px solid var(--acu-border);
        border-radius: 999px;
        color: var(--acu-text-sub);
        background: var(--acu-btn-bg);
        font-size: 12px;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
    }
    .acu-inventory-presence.is-present {
        color: var(--acu-accent);
        border-color: var(--acu-accent);
        background: var(--acu-badge-bg, var(--acu-btn-bg));
    }
    .acu-inventory-presence.is-away {
        color: var(--acu-text-sub);
    }
    @media (max-width: 768px) {
        .acu-inventory-overlay,
        .acu-gacha-overlay {
            padding: 0;
            align-items: flex-end;
        }
        .acu-inventory-shell {
            width: 100vw;
            height: min(94dvh, 920px);
            max-height: 94dvh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
        }
        .acu-gacha-shell {
            width: 100vw;
            height: auto;
            max-height: 94dvh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
        }
        .acu-inventory-content {
            padding: 12px;
        }
        .acu-gacha-content {
            flex: 0 1 auto;
            gap: 9px;
            overflow: hidden auto;
            padding: 10px;
        }
        .acu-gacha-stat-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(84px, auto);
            gap: 6px;
        }
        .acu-gacha-stat-row .acu-badge {
            min-width: 0;
            min-height: 30px;
            justify-content: center;
            padding: 5px 7px;
            font-size: 11px;
            white-space: nowrap;
        }
        .acu-gacha-shard-shop-open {
            width: auto;
            min-width: 84px;
            min-height: 30px;
            margin-left: 0;
            padding: 5px 8px;
            justify-content: center;
            gap: 4px;
        }
        .acu-gacha-shard-shop-open span {
            display: inline;
            max-width: 52px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .acu-gacha-shard-shop-open i {
            margin: 0;
            font-size: 14px;
        }
        .acu-gacha-shard-shop-open strong {
            font-size: 11px;
            line-height: 1;
        }
        .acu-gacha-fortune-progress {
            gap: 7px;
            padding: 8px;
            border-radius: 10px;
        }
        .acu-gacha-progress-grid {
            grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
            gap: 6px;
        }
        .acu-gacha-fortune-progress-head {
            align-items: center;
            flex-direction: row;
            gap: 8px;
            font-size: 12px;
        }
        .acu-gacha-fortune-progress-head strong {
            max-width: 58%;
            text-align: right;
        }
        .acu-gacha-progress-item {
            gap: 5px;
            padding: 7px 8px;
            border-radius: 9px;
        }
        .acu-gacha-active-progress {
            order: -2;
        }
        .acu-gacha-char-progress {
            order: -1;
        }
        .acu-gacha-last-progress {
            display: none;
        }
        .acu-gacha-progress-note {
            font-size: 9px;
            line-height: 1.25;
        }
        .acu-gacha-pool-tabs {
            flex: 0 0 auto;
            display: flex;
            min-height: 40px;
            gap: 4px;
            overflow-x: auto;
            overflow-y: hidden;
            align-items: flex-end;
            padding-bottom: 4px;
            scrollbar-width: none;
        }
        .acu-gacha-pool-tabs::-webkit-scrollbar {
            display: none;
        }
        .acu-gacha-pool-tab {
            flex: 0 0 auto;
            min-width: 70px;
            min-height: 32px;
            padding: 6px 10px;
            border-radius: 9px 9px 0 0;
            font-size: 12px;
        }
        .acu-gacha-settings-overlay,
        .acu-gacha-item-editor-overlay,
        .acu-gacha-name-dialog-overlay {
            padding: 0;
            align-items: flex-end;
        }
        .acu-gacha-settings-dialog,
        .acu-gacha-item-editor,
        .acu-gacha-name-dialog {
            width: 100vw;
            max-height: 94dvh;
            border-radius: 18px 18px 0 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 0;
            padding: 12px;
        }
        .acu-gacha-settings-section-head {
            align-items: stretch;
            flex-direction: column;
        }
        .acu-gacha-settings-items-section > .acu-gacha-settings-section-head {
            display: grid;
            grid-template-columns: 1fr;
            padding: 8px;
            gap: 8px;
            border: 1px solid color-mix(in srgb, var(--acu-border) 64%, transparent);
            border-radius: 10px;
            background: color-mix(in srgb, var(--acu-btn-bg) 42%, transparent);
        }
        .acu-gacha-settings-toolbar {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            justify-content: stretch;
        }
        .acu-gacha-settings-search {
            grid-column: 1 / -1;
            grid-row: 2 / 3;
            flex: 1 1 auto;
        }
        .acu-gacha-settings-filter {
            width: 100%;
            min-width: 0;
        }
        .acu-gacha-settings-filter-menu {
            min-width: 0;
        }
        .acu-gacha-settings-filter-trigger {
            min-width: 0;
            min-height: 40px;
            justify-content: flex-start;
            padding: 0 9px;
            font-size: 12px;
        }
        .acu-gacha-settings-filter-menu-label {
            flex: 1 1 auto;
            text-align: left;
        }
        .acu-gacha-settings-filter-menu-list {
            left: 0;
            right: auto;
            min-width: min(210px, 76vw);
        }
        .acu-gacha-settings-toolbar .acu-dialog-btn {
            grid-column: 2 / 3;
            width: 100% !important;
            min-width: 0;
            justify-content: center;
        }
        .acu-gacha-settings-search input {
            width: 100%;
        }
        .acu-gacha-settings-pool-item {
            grid-template-columns: 24px minmax(0, 1fr) auto;
            gap: 8px;
        }
        .acu-gacha-settings-pool-item .acu-gacha-settings-actions {
            grid-column: 3 / 4;
            grid-row: 1 / 2;
            justify-content: flex-end;
        }
        .acu-gacha-pool-handle,
        .acu-gacha-pool-handle-placeholder {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-settings-item {
            grid-template-columns: 18px 32px minmax(0, 1fr) auto;
            gap: 8px;
            padding: 8px;
        }
        .acu-gacha-settings-item .acu-gacha-settings-actions {
            grid-column: 4 / 5;
            grid-row: 1 / 2;
            align-self: center;
            justify-content: flex-end;
            gap: 6px;
        }
        .acu-gacha-settings-inline-actions {
            display: none;
        }
        .acu-gacha-settings-more {
            display: inline-block;
        }
        .acu-gacha-settings-more > summary {
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
        }
        .acu-gacha-item-handle {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-settings-item-icon {
            width: 32px;
        }
        .acu-gacha-settings-item-name {
            flex-wrap: wrap;
            gap: 5px;
            font-size: 13px;
        }
        .acu-gacha-settings-item-meta {
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .acu-gacha-settings-item-desc {
            display: none;
        }
        .acu-gacha-settings-item-custom-fields {
            grid-column: 1 / -1;
        }
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview {
            max-height: 46px;
        }
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-chip,
        .acu-gacha-settings-item-custom-fields .acu-gacha-custom-field-preview-more {
            max-width: 100%;
        }
        .acu-gacha-settings-pool-tabs {
            gap: 5px;
            padding-bottom: 6px;
        }
        .acu-gacha-settings-pool-tabs .acu-gacha-pool-tab {
            min-width: 62px;
            min-height: 30px;
            padding: 6px 8px;
            border-radius: 8px;
            font-size: 11px;
        }
        .acu-gacha-item-editor-body {
            grid-template-columns: 1fr;
        }
        .acu-gacha-icon-editor-card {
            grid-template-columns: 1fr;
        }
        .acu-gacha-icon-editor-preview {
            width: min(92px, 34vw);
            justify-self: center;
        }
        .acu-gacha-icon-editor-fields {
            grid-template-columns: 1fr;
        }
        .acu-gacha-custom-fields summary {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
        }
        .acu-gacha-custom-field-toolbar {
            align-items: stretch;
            flex-direction: column;
        }
        .acu-gacha-target-column-toolbar {
            align-items: flex-start;
            flex-direction: column;
        }
        .acu-gacha-target-column-toolbar small {
            text-align: left;
        }
        .acu-gacha-target-column-grid {
            grid-template-columns: minmax(0, 1fr);
        }
        .acu-gacha-custom-field-add {
            width: 100%;
            justify-content: center;
        }
        .acu-gacha-custom-field-row {
            grid-template-columns: minmax(0, 1fr);
        }
        .acu-gacha-custom-field-remove {
            width: 100%;
            min-width: 0;
        }
        .acu-gacha-pickup-section {
            gap: 6px;
            padding: 8px;
            border-radius: 10px;
        }
        .acu-gacha-pickup-title {
            font-size: 11px;
        }
        .acu-gacha-pickup-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 7px;
            overflow: visible;
            padding-bottom: 1px;
        }
        .acu-gacha-pickup-card {
            width: 100%;
            padding: 8px;
            gap: 4px;
        }
        .acu-gacha-pickup-card strong {
            font-size: 12px;
            white-space: nowrap;
        }
        .acu-gacha-pickup-card-icon {
            width: 16px;
            height: 16px;
            font-size: 12px;
        }
        .acu-gacha-pickup-desc {
            -webkit-line-clamp: 1;
            font-size: 10px;
        }
        .acu-gacha-custom-field-preview {
            gap: 3px;
        }
        .acu-gacha-custom-field-preview-chip,
        .acu-gacha-custom-field-preview-more {
            max-width: 100%;
            padding: 1px 5px;
            font-size: 9px;
        }
        .acu-gacha-custom-field-detail-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 4px;
        }
        .acu-gacha-draw-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            padding: 7px 10px 8px;
            box-shadow: 0 -10px 22px color-mix(in srgb, var(--acu-bg-panel) 72%, transparent);
        }
        .acu-gacha-draw-btn,
        .acu-gacha-draw-ten {
            min-height: 46px;
            padding: 8px;
            border-radius: 12px;
            font-size: 15px;
        }
        .acu-gacha-draw-btn i,
        .acu-gacha-draw-btn strong {
            font-size: 16px;
        }
        .acu-gacha-shard-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .acu-gacha-shard-shop .acu-inventory-detail-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 10px;
        }
        .acu-gacha-shard-shop .acu-inventory-detail-head-main {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            grid-template-columns: 42px minmax(0, 1fr);
        }
        .acu-gacha-shard-shop .acu-inventory-detail-header-actions {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            width: auto;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
            padding-top: 8px;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer .acu-dialog-btn {
            min-height: 42px;
            padding: 5px 4px;
            flex-direction: column;
            gap: 3px;
            font-size: 11px;
            line-height: 1.08;
            white-space: normal;
            text-align: center;
        }
        .acu-gacha-settings-dialog > .acu-gacha-settings-footer .acu-dialog-btn i {
            font-size: 12px;
            line-height: 1;
        }
        .acu-gacha-shard-items {
            grid-template-columns: 1fr;
        }
        .acu-gacha-recent-section summary {
            grid-template-columns: minmax(0, 1fr) auto;
        }
        .acu-gacha-recent-list {
            max-height: min(22dvh, 220px);
        }
        .acu-gacha-recent-section summary > strong {
            grid-column: 1 / -1;
            order: 3;
        }
        .acu-inventory-window-header .acu-header-actions {
            align-items: center;
        }
        .acu-inventory-search-inline {
            width: min(156px, 36vw);
            flex-basis: min(156px, 36vw);
        }
        .acu-inventory-search-inline input {
            min-height: 34px;
            padding-left: 32px;
        }
        .acu-inventory-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            column-gap: 8px;
            row-gap: 6px;
            justify-content: stretch;
            padding-right: 0;
        }
        .acu-inventory-icon {
            width: 60px;
            height: 60px;
            font-size: 40px;
        }
        .acu-inventory-name {
            font-size: 12px;
        }
        .acu-inventory-icon-btn {
            width: 40px;
            height: 40px;
        }
        .acu-inventory-detail-overlay {
            align-items: center;
            padding: 12px;
        }
        .acu-inventory-detail {
            width: min(94vw, 560px);
            max-height: min(78dvh, 680px);
            border-radius: 16px;
            padding: 16px;
        }
        .acu-inventory-detail-header {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
        }
        .acu-inventory-detail-head-main {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            align-items: center;
            width: 100%;
            gap: 12px;
        }
        .acu-inventory-detail-title-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            width: 100%;
        }
        .acu-inventory-detail-header-actions {
            width: 100%;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-header {
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: start;
            gap: 10px;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-head-main {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }
        .acu-gacha-pickup-detail .acu-inventory-detail-header-actions {
            grid-column: 2 / 3;
            grid-row: 1 / 2;
            width: auto;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-pickup-detail .acu-preview-close {
            width: 34px;
            height: 34px;
            min-width: 34px;
            min-height: 34px;
            flex: 0 0 34px;
            padding: 0;
            border-color: transparent;
            border-radius: 8px;
            background: transparent;
            color: var(--acu-text-sub);
        }
        .acu-inventory-detail-actions .acu-action-item {
            min-height: 38px;
            padding: 8px 10px;
            border-radius: 10px;
        }
        .acu-inventory-detail-title {
            display: block;
            width: 100%;
            font-size: 24px;
        }
        .acu-inventory-detail-sub {
            display: block;
            width: 100%;
        }
        .acu-inventory-enum-options {
            grid-template-columns: 1fr;
        }
        .acu-inventory-detail-sub,
        .acu-inventory-detail-desc {
            font-size: 14px;
        }
        .acu-inventory-detail-icon {
            width: 64px;
            height: 64px;
            font-size: 38px;
        }
        .acu-inventory-detail-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(104px, 1fr));
            width: 100%;
            gap: 8px;
        }
    }

    /* ========== 配置备份与还原弹窗 ========== */
    .acu-config-backup-overlay {
        position: fixed;
        inset: 0;
        z-index: 31420;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: transparent;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-dialog {
        width: min(760px, 96vw);
        height: min(82dvh, calc(100dvh - 36px));
        min-height: min(680px, calc(100dvh - 36px));
        max-height: calc(100dvh - 36px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 10px;
        background: var(--acu-bg-panel, #1f1f1f);
        color: var(--acu-text-main, #eee);
        box-shadow: 0 18px 60px rgba(0,0,0,0.45);
    }

    .acu-config-backup-header,
    .acu-config-backup-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
    }

    .acu-config-backup-header {
        padding: 14px 16px;
        border-bottom: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-config-backup-heading {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1 1 auto;
    }

    .acu-config-backup-title-icon {
        flex: 0 0 auto;
        color: var(--acu-accent);
    }

    .acu-config-backup-title-copy {
        min-width: 0;
    }

    .acu-config-backup-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-subtitle {
        font-size: 12px;
        line-height: 1.35;
        color: var(--acu-text-sub, #aaa);
    }

    .acu-config-backup-header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex: 0 0 auto;
    }

    .acu-config-backup-tutorial-btn,
    .acu-config-backup-close {
        width: 30px !important;
        height: 30px !important;
        min-width: 30px !important;
        min-height: 30px !important;
        padding: 0 !important;
        margin: 0 !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent !important;
        border-radius: 6px !important;
        background: transparent !important;
        color: var(--acu-text-sub, #aaa) !important;
        cursor: pointer;
        font-size: 18px;
    }

    .acu-config-backup-tutorial-btn i,
    .acu-config-backup-close i {
        color: inherit !important;
    }

    .acu-config-backup-tutorial-btn:hover,
    .acu-config-backup-tutorial-btn:focus-visible,
    .acu-config-backup-close:hover,
    .acu-config-backup-close:focus-visible {
        background: var(--acu-btn-hover, var(--acu-table-hover)) !important;
        color: var(--acu-accent) !important;
        border-color: var(--acu-border, rgba(128,128,128,0.35)) !important;
        outline: none;
    }

    .acu-config-backup-body {
        flex: 1 1 auto;
        min-height: 0;
        padding: 14px 16px;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .acu-config-backup-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        min-height: 0;
    }

    .acu-config-backup-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .acu-config-backup-section-title {
        min-width: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-selection-actions {
        display: flex;
        gap: 6px;
        flex: 0 0 auto;
    }

    .acu-config-backup-mini-btn {
        width: auto !important;
        margin: 0 !important;
        padding: 5px 9px !important;
        font-size: 12px !important;
        white-space: nowrap;
    }

    .acu-config-backup-module-list {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        flex-direction: column;
        gap: 8px;
        overflow: auto;
        padding-right: 0;
    }

    .acu-config-backup-empty {
        padding: 14px;
        border: 1px dashed var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        color: var(--acu-text-sub, #aaa);
        text-align: center;
    }

    .acu-config-backup-module-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
        cursor: pointer;
    }

    .acu-config-backup-module-row:hover {
        border-color: var(--acu-state-accent-border, var(--acu-accent));
    }

    .acu-config-backup-module-checkbox {
        flex: 0 0 auto;
        margin-top: 3px;
    }

    .acu-config-backup-module-main {
        display: flex;
        flex: 1 1 auto;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        gap: 3px;
    }

    .acu-config-backup-module-title-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 10px;
    }

    .acu-config-backup-module-name {
        min-width: 0;
        overflow: hidden;
        color: var(--acu-text-main, #eee);
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .acu-config-backup-module-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 34px;
        flex: 0 0 auto;
        margin-left: auto;
        color: var(--acu-text-sub, #aaa);
        font-size: 11px;
        font-style: normal;
        line-height: 1;
        text-align: right;
        transform: none;
        white-space: nowrap;
        writing-mode: horizontal-tb;
    }

    .acu-config-backup-module-desc {
        color: var(--acu-text-sub, #aaa);
        font-size: 12px;
        line-height: 1.45;
    }

    .acu-config-backup-module-warning {
        margin-top: 6px;
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 11px;
        line-height: 1.45;
    }

    .acu-config-backup-warning-list,
    .acu-config-backup-template-notice,
    .acu-config-backup-privacy-notice {
        display: flex;
        gap: 6px;
        padding: 10px;
        border: 1px solid rgba(245,158,11,0.45);
        border-radius: 8px;
        background: rgba(245,158,11,0.08);
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 12px;
        line-height: 1.45;
    }

    .acu-config-backup-warning-list {
        flex-direction: column;
    }

    .acu-config-backup-template-notice {
        align-items: flex-start;
    }

    .acu-config-backup-privacy-notice {
        align-items: flex-start;
        color: var(--acu-text-main, #eee);
    }

    .acu-config-backup-privacy-text {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    .acu-config-backup-privacy-text strong {
        color: var(--acu-warning-icon, #f59e0b);
        font-size: 12px;
        line-height: 1.35;
    }

    .acu-config-backup-privacy-text span {
        color: var(--acu-text-main, #eee);
        line-height: 1.5;
    }

    .acu-config-backup-template-icon,
    .acu-config-backup-privacy-icon {
        margin-top: 2px;
    }

    .acu-config-backup-summary-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
    }

    .acu-config-backup-summary-card {
        padding: 10px;
        border: 1px solid var(--acu-border, rgba(128,128,128,0.35));
        border-radius: 8px;
        background: var(--acu-card-bg, var(--acu-bg-panel, #1f1f1f));
    }

    .acu-config-backup-summary-label {
        font-size: 11px;
        color: var(--acu-text-sub, #aaa);
    }

    .acu-config-backup-summary-value {
        color: var(--acu-text-main, #eee);
        font-size: 12px;
        word-break: break-all;
    }

    .acu-config-backup-footer {
        padding: 12px 16px;
        border-top: 1px solid var(--acu-border, rgba(128,128,128,0.35));
    }

    .acu-config-backup-import-actions,
    .acu-config-backup-primary-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .acu-config-backup-primary-actions {
        justify-content: flex-end;
        flex: 0 0 auto;
        flex-wrap: wrap;
    }

    .acu-config-backup-footer-btn {
        width: auto !important;
        margin: 0 !important;
        padding: 7px 12px !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12px !important;
        white-space: nowrap;
    }

    .acu-config-backup-primary-btn {
        background: var(--acu-accent) !important;
        color: var(--acu-btn-active-text, var(--acu-button-text-on-accent, #f4f1e8)) !important;
    }

    .acu-config-backup-footer-btn[hidden] {
        display: none !important;
    }

    .acu-config-backup-body,
    .acu-config-backup-module-list {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .acu-config-backup-body::-webkit-scrollbar,
    .acu-config-backup-module-list::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
    }

    @media (max-width: 560px) {
        .acu-config-backup-overlay {
            align-items: stretch;
            padding: 10px;
        }

        .acu-config-backup-dialog {
            width: calc(100vw - 20px);
            height: calc(100dvh - 20px);
            min-height: 0;
            max-height: calc(100dvh - 20px);
        }

        .acu-config-backup-header,
        .acu-config-backup-body,
        .acu-config-backup-footer {
            padding-right: 12px;
            padding-left: 12px;
        }

        .acu-config-backup-section-head {
            align-items: stretch;
            flex-direction: column;
        }

        .acu-config-backup-footer {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: stretch;
            gap: 6px;
            padding-top: 8px;
            padding-bottom: 8px;
        }

        .acu-config-backup-selection-actions {
            flex-wrap: wrap;
        }

        .acu-config-backup-mini-btn {
            flex: 1 1 72px;
        }

        .acu-config-backup-summary-grid {
            grid-template-columns: 1fr;
        }

        .acu-config-backup-import-actions,
        .acu-config-backup-primary-actions {
            min-width: 0;
            width: auto;
        }

        .acu-config-backup-primary-actions {
            grid-column: span 2;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
        }

        .acu-config-backup-footer-btn {
            min-width: 0;
            min-height: 34px;
            width: 100% !important;
            padding: 6px 6px !important;
            gap: 4px;
        }

        #acu-config-backup-export,
        #acu-config-backup-apply {
            order: 1;
        }

        #acu-config-backup-cancel {
            order: 2;
        }
    }

    @media (max-width: 480px) {
        .acu-gacha-settings-item {
            grid-template-columns: 18px 30px minmax(0, 1fr) 44px;
        }
        .acu-gacha-settings-item .acu-gacha-settings-actions {
            grid-column: 4 / 5;
            grid-row: 1 / 2;
            align-self: center;
            justify-content: flex-end;
            flex-wrap: nowrap;
        }
        .acu-gacha-settings-item .acu-gacha-item-enabled-toggle {
            display: none;
        }
        .acu-gacha-settings-more > summary {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
        }
        .acu-gacha-custom-field-toolbar,
        .acu-gacha-custom-field-suggestions,
        .acu-gacha-custom-field-suggestion-list {
            min-width: 0;
        }
        .acu-gacha-custom-field-suggestion {
            max-width: 100%;
        }
        .acu-gacha-custom-field-detail-list {
            max-height: min(38dvh, 300px);
        }
    }

    .acu-wrapper.acu-dice-ui-root,
    .acu-wrapper.acu-dice-ui-root *,
    .acu-edit-overlay,
    .acu-edit-overlay *,
    .acu-dice-panel,
    .acu-dice-panel *,
    .acu-contest-panel,
    .acu-contest-panel *,
    .acu-preview-overlay,
    .acu-preview-overlay *,
    .acu-gacha-overlay,
    .acu-gacha-overlay *,
    .acu-inventory-overlay,
    .acu-inventory-overlay *,
    .acu-inventory-detail-overlay,
    .acu-inventory-detail-overlay *,
    .acu-import-confirm-overlay,
    .acu-import-confirm-overlay *,
    .acu-embedded-options-container,
    .acu-embedded-options-container * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
    }
    .acu-wrapper.acu-dice-ui-root::-webkit-scrollbar,
    .acu-wrapper.acu-dice-ui-root *::-webkit-scrollbar,
    .acu-edit-overlay::-webkit-scrollbar,
    .acu-edit-overlay *::-webkit-scrollbar,
    .acu-dice-panel::-webkit-scrollbar,
    .acu-dice-panel *::-webkit-scrollbar,
    .acu-contest-panel::-webkit-scrollbar,
    .acu-contest-panel *::-webkit-scrollbar,
    .acu-preview-overlay::-webkit-scrollbar,
    .acu-preview-overlay *::-webkit-scrollbar,
    .acu-gacha-overlay::-webkit-scrollbar,
    .acu-gacha-overlay *::-webkit-scrollbar,
    .acu-inventory-overlay::-webkit-scrollbar,
    .acu-inventory-overlay *::-webkit-scrollbar,
    .acu-inventory-detail-overlay::-webkit-scrollbar,
    .acu-inventory-detail-overlay *::-webkit-scrollbar,
    .acu-import-confirm-overlay::-webkit-scrollbar,
    .acu-import-confirm-overlay *::-webkit-scrollbar,
    .acu-embedded-options-container::-webkit-scrollbar,
    .acu-embedded-options-container *::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs {
        scrollbar-width: thin !important;
        scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track) !important;
        padding-bottom: 8px;
    }

    /* 面板头部图标按钮统一为 ghost button，默认不显示边框。 */
    .acu-panel-header .acu-fav-transfer-actions,
    .acu-panel-header .acu-changes-batch-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex: 0 0 auto;
    }

    .acu-panel-header > .acu-panel-title {
        min-width: 0;
        flex: 1 1 auto;
    }

    .acu-panel-header > .acu-header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        row-gap: 4px;
        flex: 0 1 auto;
        flex-wrap: wrap;
        min-width: 0;
        max-width: 100%;
    }

    .acu-panel-header > .acu-header-actions.acu-table-header-actions {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        column-gap: 6px;
        row-gap: 4px;
        flex-wrap: nowrap;
    }

    .acu-panel-header .acu-table-action-set,
    .acu-panel-header .acu-panel-control-set {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .acu-panel-header .acu-table-action-set {
        flex-wrap: wrap;
        justify-content: flex-end;
        row-gap: 4px;
    }

    .acu-panel-header .acu-panel-control-set {
        flex: 0 0 auto;
        justify-content: flex-end;
        align-self: start;
        white-space: nowrap;
    }

    .acu-panel-header > .acu-header-actions > .acu-search-wrapper,
    .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
        flex: 0 1 140px;
        width: 140px;
        min-width: 104px;
        max-width: 100%;
    }

    .acu-wrapper.acu-dice-ui-root .acu-panel-header > .acu-header-actions > .acu-search-wrapper > input.acu-search-input,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header > .acu-header-actions > .acu-search-wrapper > input.acu-search-input:focus,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header .acu-table-action-set > .acu-search-wrapper > input.acu-search-input,
    .acu-wrapper.acu-dice-ui-root .acu-panel-header .acu-table-action-set > .acu-search-wrapper > input.acu-search-input:focus {
        width: 100% !important;
    }

    @media (max-width: 520px) {
        .acu-panel-header > .acu-header-actions > .acu-search-wrapper,
        .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
            flex-basis: 110px;
            width: 110px;
        }

        .acu-panel-header > .acu-header-actions.acu-table-header-actions {
            column-gap: 4px;
        }

        .acu-panel-header .acu-table-action-set,
        .acu-panel-header .acu-panel-control-set {
            gap: 4px;
        }
    }

    @media (max-width: 380px) {
        .acu-panel-header .acu-table-action-set > .acu-search-wrapper {
            flex-basis: 94px;
            width: 94px;
            min-width: 86px;
        }
    }

    .acu-panel-header .acu-header-actions > button,
    .acu-panel-header .acu-table-action-set > button,
    .acu-panel-header .acu-fav-transfer-actions > button,
    .acu-panel-header .acu-changes-batch-actions > button,
    .acu-panel-header .acu-graph-actions > button,
    .acu-panel-header .acu-map-actions > button,
    .acu-panel-header .acu-avatar-header-actions > button,
    .acu-panel-header > .acu-settings-manager-close,
    .acu-panel-header .acu-header-actions > .acu-height-control,
    .acu-panel-header .acu-panel-control-set > button,
    .acu-panel-header .acu-panel-control-set > .acu-height-control {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px !important;
        min-height: 34px !important;
        flex: 0 0 34px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 1px solid transparent !important;
        border-radius: 6px !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--acu-text-sub) !important;
        opacity: 0.82;
        transform: none !important;
        transition:
            background-color var(--acu-motion-fast) var(--acu-ease-standard),
            color var(--acu-motion-fast) var(--acu-ease-standard),
            opacity var(--acu-motion-fast) var(--acu-ease-standard),
            box-shadow var(--acu-motion-fast) var(--acu-ease-standard);
    }

    .acu-panel-header .acu-header-actions > button:hover,
    .acu-panel-header .acu-table-action-set > button:hover,
    .acu-panel-header .acu-fav-transfer-actions > button:hover,
    .acu-panel-header .acu-changes-batch-actions > button:hover,
    .acu-panel-header .acu-graph-actions > button:hover,
    .acu-panel-header .acu-map-actions > button:hover,
    .acu-panel-header .acu-avatar-header-actions > button:hover,
    .acu-panel-header > .acu-settings-manager-close:hover,
    .acu-panel-header .acu-header-actions > .acu-height-control:hover,
    .acu-panel-header .acu-header-actions > .acu-height-control.active,
    .acu-panel-header .acu-panel-control-set > button:hover,
    .acu-panel-header .acu-panel-control-set > .acu-height-control:hover,
    .acu-panel-header .acu-panel-control-set > .acu-height-control.active {
        border-color: transparent !important;
        background: var(--acu-table-hover) !important;
        color: var(--acu-accent) !important;
        opacity: 1;
        transform: none !important;
    }

    .acu-panel-header .acu-header-actions > button:focus-visible,
    .acu-panel-header .acu-table-action-set > button:focus-visible,
    .acu-panel-header .acu-fav-transfer-actions > button:focus-visible,
    .acu-panel-header .acu-changes-batch-actions > button:focus-visible,
    .acu-panel-header .acu-graph-actions > button:focus-visible,
    .acu-panel-header .acu-map-actions > button:focus-visible,
    .acu-panel-header .acu-avatar-header-actions > button:focus-visible,
    .acu-panel-header > .acu-settings-manager-close:focus-visible,
    .acu-panel-header .acu-panel-control-set > button:focus-visible {
        outline: none !important;
        border-color: transparent !important;
        box-shadow: var(--acu-focus-ring) !important;
        opacity: 1;
    }

    .acu-panel-header > .acu-settings-manager-close:focus:not(:focus-visible) {
        outline: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-batch-accept:hover {
        color: var(--acu-success-text) !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-batch-reject:hover {
        color: var(--acu-hl-manual) !important;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-simple-mode-toggle.active {
        background: transparent !important;
        color: var(--acu-accent) !important;
        opacity: 1;
    }

    .acu-panel-header .acu-changes-batch-actions > .acu-simple-mode-toggle.active:hover {
        background: var(--acu-table-hover) !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar:horizontal {
        height: 8px !important;
        display: block !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar-track:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar-track:horizontal {
        background: var(--acu-scrollbar-track) !important;
        border-radius: 4px !important;
    }

    .acu-show-horizontal-scrollbar .acu-gacha-pool-tabs::-webkit-scrollbar-thumb:horizontal,
    .acu-show-horizontal-scrollbar.acu-gacha-pool-tabs::-webkit-scrollbar-thumb:horizontal {
        background: var(--acu-scrollbar-thumb) !important;
        border-radius: 4px !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content {
        scrollbar-width: thin !important;
        scrollbar-color: var(--acu-scrollbar-thumb) var(--acu-scrollbar-track) !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar:horizontal {
        height: 8px !important;
        display: block !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar-track:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar-track:horizontal {
        background: var(--acu-scrollbar-track) !important;
        border-radius: 4px !important;
    }

    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-panel-content::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-changes-content.acu-changes-horizontal::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dash-body.acu-dash-horizontal::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-dashboard-content::-webkit-scrollbar-thumb:horizontal,
    .acu-wrapper.acu-dice-ui-root.acu-show-horizontal-scrollbar:not(.acu-layout-vertical) .acu-fav-panel-content::-webkit-scrollbar-thumb:horizontal {
        background: var(--acu-scrollbar-thumb) !important;
        border-radius: 4px !important;
    }
`;
