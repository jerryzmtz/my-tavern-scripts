/**
 * 神-数据库UI主题同步
 *
 * 此文件从 index.ts 拆分出来，专门用于同步数据库界面的主题颜色与样式。
 *
 * ## 为什么拆分？
 * - index.ts 过于庞大，拆分后降低维护成本
 * - 样式同步逻辑相对独立，适合单独管理
 *
 * ## 如何使用？
 * - 在 index.ts 中通过 `import { injectDatabaseStyles } from './database-ui-override'` 导入
 * - 在主题切换或初始化时调用该函数
 *
 * ## 如何修改样式？
 * - 直接在本文件中编辑 DATABASE_THEME_MAP 或 injectDatabaseStyles 逻辑
 * - 运行 `pnpm build` 验证构建成功
 *
 * @see index.ts - injectDatabaseStyles() 函数（约第 9491 行）
 */

interface ThemeColors {
  bgNav: string;
  bgPanel: string;
  border: string;
  textMain: string;
  textSub: string;
  btnBg: string;
  btnHover: string;
  btnActiveBg: string;
  btnActiveText: string;
  accent: string;
  inputBg: string;
}

type DatabaseThemeMap = Record<string, ThemeColors>;

const DATABASE_THEME_MAP: DatabaseThemeMap = {
  retro: {
    bgNav: '#e6e2d3',
    bgPanel: '#e6e2d3',
    border: '#dcd0c0',
    textMain: '#5e4b35',
    textSub: '#999',
    btnBg: '#dcd0c0',
    btnHover: '#cbbba8',
    btnActiveBg: '#8d7b6f',
    btnActiveText: '#fdfaf5',
    accent: '#7a695f',
    inputBg: '#f5f2eb',
  },
  dark: {
    bgNav: '#2b2b2b',
    bgPanel: '#252525',
    border: '#444',
    textMain: '#eee',
    textSub: '#aaa',
    btnBg: '#3a3a3a',
    btnHover: '#4a4a4a',
    btnActiveBg: '#6a5acd',
    btnActiveText: '#fff',
    accent: '#9b8cd9',
    inputBg: '#3a3a3a',
  },
  modern: {
    bgNav: '#ffffff',
    bgPanel: '#f8f9fa',
    border: '#e0e0e0',
    textMain: '#333',
    textSub: '#666',
    btnBg: '#f1f3f5',
    btnHover: '#e9ecef',
    btnActiveBg: '#007bff',
    btnActiveText: '#fff',
    accent: '#007bff',
    inputBg: '#f1f3f5',
  },
  forest: {
    bgNav: '#e8f5e9',
    bgPanel: '#e8f5e9',
    border: '#c8e6c9',
    textMain: '#2e7d32',
    textSub: '#81c784',
    btnBg: '#c8e6c9',
    btnHover: '#a5d6a7',
    btnActiveBg: '#43a047',
    btnActiveText: '#fff',
    accent: '#4caf50',
    inputBg: '#c8e6c9',
  },
  ocean: {
    bgNav: '#e3f2fd',
    bgPanel: '#e3f2fd',
    border: '#90caf9',
    textMain: '#1565c0',
    textSub: '#64b5f6',
    btnBg: '#bbdefb',
    btnHover: '#90caf9',
    btnActiveBg: '#1976d2',
    btnActiveText: '#fff',
    accent: '#2196f3',
    inputBg: '#bbdefb',
  },
  cyber: {
    bgNav: '#000000',
    bgPanel: '#0a0a0a',
    border: '#333',
    textMain: '#00ffcc',
    textSub: '#ff00ff',
    btnBg: '#111',
    btnHover: '#222',
    btnActiveBg: '#ff00ff',
    btnActiveText: '#000',
    accent: '#00ffcc',
    inputBg: '#111',
  },
  nightowl: {
    bgNav: '#0a2133',
    bgPanel: '#011627',
    border: '#132e45',
    textMain: '#e0e6f2',
    textSub: '#a6b8cc',
    btnBg: '#1f3a52',
    btnHover: '#2a4a68',
    btnActiveBg: '#7fdbca',
    btnActiveText: '#011627',
    accent: '#7fdbca',
    inputBg: '#1f3a52',
  },
  sakura: {
    bgNav: '#F9F0EF',
    bgPanel: '#F9F0EF',
    border: '#EBDCD9',
    textMain: '#6B5552',
    textSub: '#C08D8D',
    btnBg: '#EBDCD9',
    btnHover: '#D8C7C4',
    btnActiveBg: '#C08D8D',
    btnActiveText: '#F9F0EF',
    accent: '#C08D8D',
    inputBg: '#EBDCD9',
  },
  minepink: {
    bgNav: '#1a1a1a',
    bgPanel: '#1a1a1a',
    border: '#333333',
    textMain: '#ffb3d9',
    textSub: '#ff80c1',
    btnBg: '#2a2a2a',
    btnHover: '#3a3a3a',
    btnActiveBg: '#ff80c1',
    btnActiveText: '#1a1a1a',
    accent: '#ff80c1',
    inputBg: '#2a2a2a',
  },
  purple: {
    bgNav: '#f3e5f5',
    bgPanel: '#f3e5f5',
    border: '#ce93d8',
    textMain: '#6a1b9a',
    textSub: '#9c27b0',
    btnBg: '#e1bee7',
    btnHover: '#ce93d8',
    btnActiveBg: '#9c27b0',
    btnActiveText: '#fff',
    accent: '#9c27b0',
    inputBg: '#e1bee7',
  },
  wechat: {
    bgNav: '#F7F7F7',
    bgPanel: '#F7F7F7',
    border: '#E5E5E5',
    textMain: '#333333',
    textSub: '#666666',
    btnBg: '#E5E5E5',
    btnHover: '#D5D5D5',
    btnActiveBg: '#09B83E',
    btnActiveText: '#FFFFFF',
    accent: '#09B83E',
    inputBg: '#E5E5E5',
  },
  educational: {
    bgNav: '#000000',
    bgPanel: '#000000',
    border: '#1B1B1B',
    textMain: '#FFFFFF',
    textSub: '#CCCCCC',
    btnBg: '#1B1B1B',
    btnHover: '#2B2B2B',
    btnActiveBg: '#FF9900',
    btnActiveText: '#000000',
    accent: '#FF9900',
    inputBg: '#1B1B1B',
  },
  vaporwave: {
    bgNav: '#191970',
    bgPanel: '#191970',
    border: 'rgba(0,255,255,0.3)',
    textMain: '#00FFFF',
    textSub: '#FF00FF',
    btnBg: 'rgba(25,25,112,0.8)',
    btnHover: 'rgba(0,255,255,0.2)',
    btnActiveBg: '#FF00FF',
    btnActiveText: '#191970',
    accent: '#00FFFF',
    inputBg: 'rgba(25,25,112,0.6)',
  },
  classicpackaging: {
    bgNav: '#000000',
    bgPanel: '#000000',
    border: '#FFFF00',
    textMain: '#FFFF00',
    textSub: '#CCCC00',
    btnBg: '#FF0000',
    btnHover: '#CC0000',
    btnActiveBg: '#0000FF',
    btnActiveText: '#FFFF00',
    accent: '#FF0000',
    inputBg: '#1a1a1a',
  },
  galgame: {
    bgNav: '#FFF0F5',
    bgPanel: '#FFF0F5',
    border: '#F0D4E4',
    textMain: '#6B4A5A',
    textSub: '#B08A9A',
    btnBg: '#FFE4E9',
    btnHover: '#FFD4E4',
    btnActiveBg: '#E8B4D9',
    btnActiveText: '#6B4A5A',
    accent: '#E8B4D9',
    inputBg: '#FFF8FA',
  },
  terminal: {
    bgNav: '#0c0c0c',
    bgPanel: '#0c0c0c',
    border: '#00ff00',
    textMain: '#00ff00',
    textSub: '#00cc00',
    btnBg: '#1a1a1a',
    btnHover: '#2a2a2a',
    btnActiveBg: '#00ff00',
    btnActiveText: '#0c0c0c',
    accent: '#00ff00',
    inputBg: '#0c0c0c',
  },
  dreamcore: {
    bgNav: '#F4F1EA',
    bgPanel: '#F4F1EA',
    border: '#D6D2C4',
    textMain: '#5C5869',
    textSub: '#9490A0',
    btnBg: '#E6E1D5',
    btnHover: '#DBD8CC',
    btnActiveBg: '#8A9AC6',
    btnActiveText: '#FFFFFF',
    accent: '#8A9AC6',
    inputBg: '#FFFFFF',
  },
  aurora: {
    bgNav: 'linear-gradient(135deg,#0f172a,#1e293b)',
    bgPanel: 'linear-gradient(180deg,#0f172a 0%,#334155 100%)',
    border: '#38bdf8',
    textMain: '#e2e8f0',
    textSub: '#94a3b8',
    btnBg: 'linear-gradient(135deg,#162a3d,#25224d)',
    btnHover: 'linear-gradient(135deg,#1e3a5f,#312e81)',
    btnActiveBg: 'linear-gradient(135deg,#38bdf8,#a855f7)',
    btnActiveText: '#fff',
    accent: '#38bdf8',
    inputBg: '#0f172a',
  },
  chouten: {
    bgNav: 'linear-gradient(135deg,rgba(26,10,46,0.95) 0%,rgba(45,27,78,0.95) 50%,rgba(26,10,46,0.95) 100%)',
    bgPanel: 'rgba(26,10,46,0.95)',
    border: '#FF7EB6',
    textMain: '#FFFFFF',
    textSub: '#D0BFFF',
    btnBg: 'rgba(255,255,255,0.1)',
    btnHover: 'rgba(255,107,157,0.3)',
    btnActiveBg: 'linear-gradient(90deg,#FF6B9D,#B388FF)',
    btnActiveText: '#FFFFFF',
    accent: '#7FFFD4',
    inputBg: 'rgba(0,0,0,0.3)',
  },
};

/**
 * 注入数据库样式
 * @param themeId 主题 ID
 */
export function injectDatabaseStyles(themeId: string, fontFamily?: string) {
  try {
    const getJQuery = (w: Window | null | undefined) => {
      try {
        return (w as any)?.jQuery as any;
      } catch {
        return null;
      }
    };

    // 同时尝试当前窗口/父窗口/顶层窗口，避免样式注入到错误 document
    const targets = [getJQuery(window), getJQuery(window.parent), getJQuery(window.top)].filter(
      (v, idx, arr) => !!v && arr.indexOf(v) === idx,
    );
    if (!targets.length) return;

    const t = DATABASE_THEME_MAP[themeId] || DATABASE_THEME_MAP.aurora;
    const darkThemeIds = new Set(['cyber', 'terminal', 'aurora', 'chouten', 'classicpackaging']);
    const isDarkTheme = darkThemeIds.has(themeId);
    const stepperSpinFilter = isDarkTheme ? 'invert(1) brightness(1.05)' : 'none';
    const stepperSpinOpacity = isDarkTheme ? '0.85' : '0.55';
    const stepperColorScheme = isDarkTheme ? 'dark' : 'light';

    // ========== 选择器常量 (代码结构优化) ==========
    // 使用 :is() 合并重复选择器，减少代码冗余
    // 弹窗容器选择器
    const S_POPUP = `#shujuku_v104-popup.auto-card-updater-popup, [id^="shujuku"][id$="-popup"].auto-card-updater-popup`;
    // 主窗口选择器
    const S_MAIN = `#shujuku_v104-main-window, [id^="shujuku"][id$="-main-window"]`;
    // 可视化窗口选择器
    const S_VIS = `#shujuku_v104-visualizer-window, [id^="shujuku"][id$="-visualizer-window"]`;
    // 所有窗口选择器
    const S_ALL_WINDOWS = `${S_POPUP}, ${S_MAIN}, ${S_VIS}`;
    // 弹窗+主窗口选择器
    const S_POPUP_MAIN = `${S_POPUP}, ${S_MAIN}`;

    const fontCss = fontFamily
      ? `
        /* 字体同步：覆盖数据库文本字体（避免影响图标字体 / pseudo-element 图标） */
        html body .auto-card-updater-popup,
        html body #shujuku_v104-main-window,
        html body [id^="shujuku"][id$="-main-window"],
        html body #shujuku_v104-popup.auto-card-updater-popup,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup {
          --acu-font-family: ${fontFamily};
          font-family: var(--acu-font-family) !important;
        }

        html body .auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body #shujuku_v104-main-window :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body [id^="shujuku"][id$="-main-window"] :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body #shujuku_v104-popup.auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup :is(div, p, span, label, a, button:not(.acu-window-btn), input, select, textarea, th, td, li, ul, ol, h1, h2, h3, h4, h5, h6, small, strong, em) {
          font-family: var(--acu-font-family) !important;
        }
      `
      : '';

    const css = `
      <style id="dice-db-theme-sync">
        ${fontCss}
        html body .auto-card-updater-popup {
          --acu-bg-0: ${t.bgPanel} !important;
          --acu-bg-1: ${t.bgNav} !important;
          --acu-bg-2: ${t.btnBg} !important;
          --acu-border: ${t.border} !important;
          --acu-border-2: ${t.border} !important;
          --acu-text-1: ${t.textMain} !important;
          --acu-text-2: ${t.textSub} !important;
          --acu-text-3: ${t.textSub} !important;
          --acu-accent: ${t.accent} !important;
          --acu-accent-glow: ${t.accent}1a !important;
        }
        /* ========== 按钮系统美化 ========== */
        html body .auto-card-updater-popup button,
        html body .auto-card-updater-popup .button {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
        }
        
        /* 普通按钮悬停效果 */
        html body .auto-card-updater-popup button:hover,
        html body .auto-card-updater-popup .button:hover {
          background: ${t.btnHover} !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        /* 普通按钮点击效果 */
        html body .auto-card-updater-popup button:active,
        html body .auto-card-updater-popup .button:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
          transition-duration: 0.1s !important;
        }
        
        /* Primary 按钮 - 更强的视觉权重 */
        html body .auto-card-updater-popup button.primary,
        html body .auto-card-updater-popup .button.primary {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px ${t.accent}33 !important;
        }
        
        /* Primary 按钮悬停效果 */
        html body .auto-card-updater-popup button.primary:hover,
        html body .auto-card-updater-popup .button.primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px ${t.accent}44 !important;
          filter: brightness(1.1) !important;
        }
        
        /* Primary 按钮点击效果 */
        html body .auto-card-updater-popup button.primary:active,
        html body .auto-card-updater-popup .button.primary:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 2px 8px ${t.accent}22 !important;
          filter: brightness(0.95) !important;
        }
        
        /* 禁用状态按钮 */
        html body .auto-card-updater-popup button:disabled,
        html body .auto-card-updater-popup .button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: none !important;
          box-shadow: none !important;
        }
        /* button-group 内按钮 - 继承基础样式即可，不需要重复定义 */
        html body :is(${S_POPUP}) .button-group.acu-data-mgmt-buttons button,
        html body :is(${S_POPUP}) .button-group.acu-data-mgmt-buttons .button {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }
        html body :is(${S_POPUP}) .button-group.acu-data-mgmt-buttons button:hover,
        html body :is(${S_POPUP}) .button-group.acu-data-mgmt-buttons .button:hover {
          background: ${t.btnHover} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup code,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup code {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-left: 2px solid ${t.accent} !important;
        }
        html body :is(${S_POPUP}) table thead th,
        html body :is(${S_POPUP}) table th {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.border} !important;
        }

        /* ========== 弹窗容器美化 ========== */
        html body :is(${S_ALL_WINDOWS}) {
          border-radius: 16px !important;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px ${t.border},
            0 0 40px -10px ${t.accent}33 !important;
          animation: acu-db-popup-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        @keyframes acu-db-popup-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* ========== 头部样式 (使用 :is() 简化选择器) ========== */
        html body :is(${S_POPUP_MAIN}) {
          padding-top: 0 !important;
        }

        html body :is(${S_POPUP_MAIN}) .acu-layout {
          margin-top: 0 !important;
        }

        html body :is(${S_ALL_WINDOWS}) .acu-window-header {
          background: linear-gradient(135deg, ${t.bgNav} 0%, ${t.bgPanel} 100%) !important;
          border-bottom: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
          padding: 14px 18px !important;
          position: relative !important;
          margin: 0 !important;
          z-index: 32012 !important;
        }

        /* 头部底部高光线 */
        html body :is(${S_ALL_WINDOWS}) .acu-window-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 60% !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, ${t.accent}66, transparent) !important;
        }

        /* 标题文字 */
        html body :is(${S_ALL_WINDOWS}) .acu-window-title,
        html body :is(${S_ALL_WINDOWS}) .acu-window-title span {
          color: ${t.textMain} !important;
          font-weight: 600 !important;
          letter-spacing: 0.3px !important;
        }

        /* 标题图标 */
        html body :is(${S_ALL_WINDOWS}) .acu-window-title i {
          color: ${t.accent} !important;
          transition: transform 0.3s ease, color 0.2s ease !important;
        }

        /* 标题图标悬停动画 */
        html body :is(${S_ALL_WINDOWS}) .acu-window-header:hover .acu-window-title i {
          transform: rotate(15deg) scale(1.1) !important;
        }

        /* 窗口按钮 */
        html body :is(${S_ALL_WINDOWS}) .acu-window-btn {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${S_ALL_WINDOWS}) .acu-window-btn:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        html body :is(${S_ALL_WINDOWS}) .acu-window-btn.close:hover {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          box-shadow: 0 2px 12px ${t.accent}44 !important;
        }

        html body :is(${S_POPUP}) .acu-stepper {
          background-color: ${t.inputBg} !important;
          border-color: ${t.border} !important;
        }
        html body :is(${S_POPUP}) .acu-stepper-btn {
          background-color: ${t.btnBg} !important;
          color: ${t.textSub} !important;
        }
        html body :is(${S_POPUP}) .acu-stepper-btn:hover {
          background-color: ${t.btnHover} !important;
          color: ${t.accent} !important;
        }
        html body :is(${S_POPUP}) .acu-stepper-btn:active {
          background-color: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
        }
        html body :is(${S_POPUP}) .acu-stepper-value {
          background-color: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border-left: 1px solid ${t.border} !important;
          border-right: 1px solid ${t.border} !important;
        }
        html body :is(${S_POPUP}) input[type="number"] {
          color-scheme: ${stepperColorScheme} !important;
        }
        html body :is(${S_POPUP}) input[type="number"]::-webkit-inner-spin-button,
        html body :is(${S_POPUP}) input[type="number"]::-webkit-outer-spin-button {
          filter: ${stepperSpinFilter} !important;
          opacity: ${stepperSpinOpacity} !important;
        }
        /* ========== 表单控件美化 ========== */
        html body .auto-card-updater-popup :is(input, select, textarea),
        html body :is(${S_POPUP}) :is(input, select, textarea) {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          background-image: none !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-color: ${t.border} !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
        }

        /* 输入框聚焦效果 - 增强版 */
        html body .auto-card-updater-popup :is(input, select, textarea):focus,
        html body :is(${S_POPUP}) :is(input, select, textarea):focus {
          border-color: ${t.accent} !important;
          box-shadow: 0 0 0 3px ${t.accent}22, 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          outline: none !important;
        }

        /* 输入框悬停效果 */
        html body .auto-card-updater-popup :is(input, select, textarea):hover:not(:focus),
        html body :is(${S_POPUP}) :is(input, select, textarea):hover:not(:focus) {
          border-color: ${t.accent}66 !important;
        }

        /* 修复 placeholder 颜色 */
        html body .auto-card-updater-popup :is(input, textarea)::placeholder,
        html body :is(${S_POPUP}) :is(input, textarea)::placeholder {
          color: ${t.textSub} !important;
          opacity: 0.6 !important;
          transition: opacity 0.2s ease !important;
        }

        /* placeholder 聚焦时淡化 */
        html body .auto-card-updater-popup :is(input, textarea):focus::placeholder,
        html body :is(${S_POPUP}) :is(input, textarea):focus::placeholder {
          opacity: 0.4 !important;
        }

        /* ========== Select 下拉框美化 ========== */
        html body .auto-card-updater-popup select,
        html body :is(${S_POPUP}) select {
          appearance: none !important;
          -webkit-appearance: none !important;
          padding-right: 36px !important;
          cursor: pointer !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 12px !important;
        }

        /* Select 悬停时箭头颜色变化 */
        html body .auto-card-updater-popup select:hover,
        html body :is(${S_POPUP}) select:hover {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(t.accent)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
        }

        /* ========== Textarea 美化 ========== */
        html body .auto-card-updater-popup textarea,
        html body :is(${S_POPUP}) textarea {
          min-height: 80px !important;
          resize: vertical !important;
          line-height: 1.5 !important;
        }

        /* ========== 数据隔离区专用布局修复 ========== */
        html body :is(${S_POPUP}) [id$="-data-isolation-input-area"] {
          margin-top: 12px !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-input-area"] > div {
          display: flex !important;
          align-items: stretch !important;
          gap: 12px !important;
          margin-top: 8px !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-combo"] {
          position: relative !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          display: block !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-code"] {
          width: 100% !important;
          min-height: 44px !important;
          padding-right: 52px !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-history-toggle"] {
          position: absolute !important;
          right: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 34px !important;
          min-width: 34px !important;
          height: 34px !important;
          min-height: 34px !important;
          padding: 0 !important;
          border-radius: 8px !important;
          border: 1px solid ${t.border} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          line-height: 1 !important;
          font-size: 13px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
          z-index: 2 !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-history-toggle"]:hover {
          background: ${t.btnHover} !important;
          color: ${t.accent} !important;
          transform: translateY(-50%) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14) !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-history-list"] {
          margin: 0 !important;
          padding: 6px !important;
          border-radius: 10px !important;
          border: 1px solid ${t.border} !important;
          background: ${t.bgPanel} !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18) !important;
          max-height: 240px !important;
          z-index: 32030 !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-history-list"] li {
          color: ${t.textMain} !important;
          border-radius: 6px !important;
        }

        html body :is(${S_POPUP}) [id$="-data-isolation-history-list"] li:hover {
          background: ${t.btnHover} !important;
        }

        /* ========== 模板预设工具栏统一样式 ========== */
        html body :is(${S_POPUP}) .acu-template-presets {
          border: 1px solid ${t.border} !important;
          background: ${t.bgPanel} !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${S_POPUP}) .acu-template-preset-toolbar {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
          align-items: stretch !important;
        }

        html body :is(${S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-left {
          display: grid !important;
          grid-template-columns: minmax(220px, 1fr) auto auto !important;
          align-items: center !important;
          gap: 10px !important;
          width: 100% !important;
        }

        html body :is(${S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-actions {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(108px, 1fr)) !important;
          gap: 10px !important;
          width: 100% !important;
          align-items: stretch !important;
        }

        html body :is(${S_POPUP}) .acu-template-preset-toolbar :is(select.text_pole, [id$="-template-preset-select"]) {
          min-height: 44px !important;
        }

        html body :is(${S_POPUP}) .acu-mini-btn {
          min-height: 44px !important;
          padding: 10px 14px !important;
          border-radius: 10px !important;
          border: 1px solid ${t.border} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          font-size: 15px !important;
          font-weight: 650 !important;
          letter-spacing: 0.1px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease !important;
        }

        html body :is(${S_POPUP}) .acu-mini-btn:hover {
          background: ${t.btnHover} !important;
          border-color: ${t.accent}66 !important;
          color: ${t.textMain} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12) !important;
        }

        html body :is(${S_POPUP}) .acu-mini-btn:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
        }

        html body :is(${S_POPUP}) .acu-mini-btn.primary {
          background: ${t.btnActiveBg} !important;
          border-color: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          box-shadow: 0 8px 20px ${t.accent}33 !important;
        }

        html body :is(${S_POPUP}) .acu-mini-btn.primary:hover {
          filter: brightness(1.08) !important;
        }

        html body :is(${S_POPUP}) button[id$="-template-preset-delete"].acu-mini-btn,
        html body :is(${S_POPUP}) .acu-mini-btn.danger {
          border-color: ${t.border} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-save"].primary {
          min-height: 44px !important;
          padding: 10px 18px !important;
          white-space: nowrap !important;
          border-radius: 10px !important;
          background: ${t.textMain} !important;
          border-color: ${t.textMain} !important;
          color: ${t.bgPanel} !important;
          font-weight: 700 !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18) !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-save"].primary:hover {
          background: ${t.accent} !important;
          border-color: ${t.accent} !important;
          color: ${t.btnActiveText} !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-delete-entries"] {
          min-height: 42px !important;
          min-width: 280px !important;
          padding: 10px 18px !important;
          border-radius: 10px !important;
          border: 1px solid ${t.border} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          font-weight: 650 !important;
          letter-spacing: 0.1px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-delete-entries"]:hover {
          background: ${t.btnHover} !important;
          border-color: ${t.accent}66 !important;
          color: ${t.textMain} !important;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-1px) !important;
          filter: none !important;
        }

        html body :is(${S_POPUP}) button[id$="-data-isolation-delete-entries"]:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1) !important;
          filter: none !important;
        }

        /* Textarea resize 手柄样式 */
        html body .auto-card-updater-popup textarea::-webkit-resizer,
        html body :is(${S_POPUP}) textarea::-webkit-resizer {
          border-width: 8px !important;
          border-style: solid !important;
          border-color: transparent ${t.border} ${t.border} transparent !important;
        }

        /* ========== 禁用状态 ========== */
        html body .auto-card-updater-popup :is(input, select, textarea):disabled,
        html body :is(${S_POPUP}) :is(input, select, textarea):disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          background-color: ${t.bgNav} !important;
        }

        /* ========== Checkbox 强化覆盖 ========== */
        /* Checkbox Container (Group) */
        html body :is(${S_POPUP}) .checkbox-group {
          background-color: transparent !important;
          color: ${t.textMain} !important;
        }

        /* Checkbox Label */
        html body :is(${S_POPUP}) .checkbox-group label {
          color: ${t.textMain} !important;
        }

        /* Checkbox Input Element (统一自绘，压制酒馆主题/脚本自绘) */
        html body :is(${S_POPUP}) input[type="checkbox"],
        html body :is(${S_POPUP}) .checkbox-group input[type="checkbox"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          min-height: 18px !important;
          border-radius: 5px !important;
          border: 1.5px solid ${t.border} !important;
          background-color: ${t.inputBg} !important;
          background-image: none !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 12px 10px !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 2px 8px 2px 0 !important;
          cursor: pointer !important;
          vertical-align: middle !important;
          transition: all 0.2s ease !important;
        }
        html body :is(${S_POPUP}) input[type="checkbox"]::before,
        html body :is(${S_POPUP}) input[type="checkbox"]::after {
          content: none !important;
          display: none !important;
        }

        /* Checkbox hover effect */
        html body :is(${S_POPUP}) input[type="checkbox"]:hover {
          border-color: ${t.accent} !important;
          box-shadow: 0 0 0 3px ${t.accent}22 !important;
        }

        /* Checked State */
        html body :is(${S_POPUP}) input[type="checkbox"]:checked {
          background-color: ${t.accent} !important;
          border-color: ${t.accent} !important;
          background-image: none !important;
        }

        /* 设置区 checkbox 改为开关形态，降低重复勾选框噪声 */
        html body :is(${S_POPUP}) .checkbox-group {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 12px !important;
          padding: 10px 14px !important;
          border: 1px solid ${t.border} !important;
          border-radius: 12px !important;
          background: ${t.bgPanel} !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > label {
          margin: 0 !important;
          flex: 1 1 auto !important;
          order: 1 !important;
          color: ${t.textMain} !important;
          font-size: 14px !important;
          font-weight: 650 !important;
          line-height: 1.45 !important;
          cursor: pointer !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          order: 2 !important;
          margin: 0 0 0 10px !important;
          width: 42px !important;
          min-width: 42px !important;
          height: 24px !important;
          min-height: 24px !important;
          border-radius: 999px !important;
          border: 1.5px solid ${t.border} !important;
          background: ${t.inputBg} !important;
          background-image: none !important;
          position: relative !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08) !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]::before {
          content: '' !important;
          display: block !important;
          position: absolute !important;
          top: 2px !important;
          left: 2px !important;
          width: 18px !important;
          height: 18px !important;
          border-radius: 50% !important;
          background: ${t.btnActiveText} !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22) !important;
          transform: translateX(0) !important;
          transition: transform 0.18s ease, background-color 0.18s ease !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]::after {
          content: none !important;
          display: none !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]:checked {
          background: ${t.btnActiveBg} !important;
          border-color: ${t.btnActiveBg} !important;
          background-image: none !important;
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]:checked::before {
          transform: translateX(18px) !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 3px ${t.accent}33 !important;
        }

        html body :is(${S_POPUP}) .checkbox-group > input[type="checkbox"]:disabled {
          opacity: 0.55 !important;
          cursor: not-allowed !important;
        }

        html body :is(${S_POPUP}) .checkbox-group:has(> input[type="checkbox"]:checked) {
          border-color: ${t.accent}66 !important;
          box-shadow: 0 0 0 1px ${t.accent}22 inset !important;
        }

        /* ========== 表头样式增强 ========== */
        html body .auto-card-updater-popup :is(th, thead th),
        html body :is(${S_POPUP}) table thead th,
        html body :is(${S_POPUP}) table th {
          color: ${t.btnActiveText} !important;
          background: linear-gradient(135deg, ${t.btnActiveBg} 0%, ${t.accent} 100%) !important;
          background-color: ${t.btnActiveBg} !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.5px !important;
          padding: 12px 14px !important;
          border: none !important;
          border-bottom: 2px solid ${t.accent} !important;
          position: relative !important;
        }

        /* 表头首列圆角 */
        html body .auto-card-updater-popup table thead th:first-child,
        html body :is(${S_POPUP}) table thead th:first-child {
          border-top-left-radius: 8px !important;
        }

        /* 表头末列圆角 */
        html body .auto-card-updater-popup table thead th:last-child,
        html body :is(${S_POPUP}) table thead th:last-child {
          border-top-right-radius: 8px !important;
        }

        /* ========== Status & Messages Display 状态与消息显示 ========== */
        html body .auto-card-updater-popup span[id$="-status-display"],
        html body .auto-card-updater-popup span[id$="-messages-display"],
        html body .auto-card-updater-popup p.notes,
        html body :is(${S_POPUP}) span[id$="-status-display"],
        html body :is(${S_POPUP}) span[id$="-messages-display"],
        html body :is(${S_POPUP}) p.notes,
        html body span[id$="-card-update-status-display"],
        html body span[id$="-total-messages-display"],
        html body [id$="-status-message"] {
          display: block !important;
          background-color: var(--acu-bg-2) !important;
          color: var(--acu-text-1) !important;
          border: 1px solid var(--acu-border) !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          margin: 10px 0 !important;
          font-size: 13px !important;
          line-height: 1.5 !important;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.08) !important;
          word-break: break-all !important;
        }

        html body .auto-card-updater-popup span[id$="-status-display"] b,
        html body :is(${S_POPUP}) span[id$="-status-display"] b,
        html body span[id$="-card-update-status-display"] b {
          color: var(--acu-accent) !important;
          font-weight: 600 !important;
        }

        html body .auto-card-updater-popup span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body :is(${S_POPUP}) span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body span[id$="-card-update-status-display"] *:not(b):not([style*="color"]) {
          color: inherit !important;
        }

        /* ========== 表格行样式增强 ========== */
        html body .auto-card-updater-popup table tbody tr {
          background-color: ${t.bgPanel} !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* 斑马纹效果 */
        html body .auto-card-updater-popup table tbody tr:nth-child(even) {
          background-color: ${t.bgNav} !important;
        }

        /* 行悬停效果 */
        html body .auto-card-updater-popup table tbody tr:hover {
          background-color: ${t.btnHover} !important;
          box-shadow: inset 3px 0 0 ${t.accent} !important;
        }

        /* 单元格样式 */
        html body .auto-card-updater-popup table tbody td {
          color: ${t.textMain} !important;
          padding: 10px 14px !important;
          border-bottom: 1px solid ${t.border} !important;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          vertical-align: middle !important;
        }

        /* 最后一行无底边框 */
        html body .auto-card-updater-popup table tbody tr:last-child td {
          border-bottom: none !important;
        }

        /* ========== 表格容器美化 ========== */
        html body .auto-card-updater-popup table,
        html body :is(${S_POPUP}) table {
          table-layout: fixed !important;
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          border: 1px solid ${t.border} !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        }

        html body .auto-card-updater-popup table :is(thead, tbody, tr),
        html body :is(${S_POPUP}) table :is(thead, tbody, tr) {
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* 单元格基础样式 */
        html body .auto-card-updater-popup table :is(th, td),
        html body :is(${S_POPUP}) table :is(th, td),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td {
          text-align: left !important;
          padding: 10px 14px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
        }

        /* 第一列（名称列）左对齐 */
        html body .auto-card-updater-popup table :is(th, td):first-child,
        html body :is(${S_POPUP}) table :is(th, td):first-child {
          text-align: left !important;
          width: 25% !important;
        }

        /* 中间列居中对齐 */
        html body .auto-card-updater-popup table :is(th, td):not(:first-child):not(:last-child),
        html body :is(${S_POPUP}) table :is(th, td):not(:first-child):not(:last-child) {
          text-align: center !important;
          width: calc((100% - 25%) / 4) !important;
        }

        /* 最后一列（操作列）居中 */
        html body .auto-card-updater-popup table :is(th, td):last-child,
        html body :is(${S_POPUP}) table :is(th, td):last-child {
          text-align: center !important;
          width: 25% !important;
        }

        /* ========== Mobile Responsive 移动端适配 ========== */
        @media (max-width: 768px) {
          html body .auto-card-updater-popup table,
          html body :is(${S_POPUP}) table {
            font-size: 0.85em !important;
            box-shadow: none !important;
          }

          html body .auto-card-updater-popup table :is(th, td),
          html body :is(${S_POPUP}) table :is(th, td) {
            padding: 8px 10px !important;
          }

          /* 移动端表头样式简化 */
          html body .auto-card-updater-popup table thead th,
          html body :is(${S_POPUP}) table thead th {
            padding: 10px 8px !important;
            font-size: 11px !important;
          }

          /* 移动端弹窗入场动画优化 */
          html body :is(${S_ALL_WINDOWS}) {
            animation: acu-db-popup-enter-mobile 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
        }

        @keyframes acu-db-popup-enter-mobile {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== Radio group 单选按钮组 ========== */
        html body :is(${S_POPUP}) .qrf_radio_group {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
        }

        html body :is(${S_POPUP}) .qrf_radio_group :is(label, span) {
          color: ${t.textMain} !important;
        }

        html body :is(${S_POPUP}) input[type="radio"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          box-sizing: border-box !important;
          width: 18px !important;
          height: 18px !important;
          min-width: 18px !important;
          min-height: 18px !important;
          padding: 0 !important;
          margin: 0 8px 0 0 !important;
          border-radius: 50% !important;
          border: 1.5px solid ${t.border} !important;
          background-color: ${t.inputBg} !important;
          box-shadow: none !important;
          position: relative !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          vertical-align: middle !important;
          transition: all 0.2s ease !important;
        }

        html body :is(${S_POPUP}) input[type="radio"]:hover {
          border-color: ${t.accent} !important;
          box-shadow: 0 0 0 3px ${t.accent}22 !important;
        }

        html body :is(${S_POPUP}) input[type="radio"]:checked {
          border-color: ${t.accent} !important;
        }

        html body :is(${S_POPUP}) input[type="radio"]:checked::after {
          content: '' !important;
          position: absolute !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          background: ${t.accent} !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }

        /* ========== Worldbook entry list 世界书条目列表 ========== */
        html body :is(${S_POPUP}) .qrf_worldbook_entry_list,
        html body :is(${S_POPUP}) [class*="worldbook-entry-list"] {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 8px !important;
        }

        html body :is(${S_POPUP}) .qrf_worldbook_entry_list :is(label, span, div) {
          color: ${t.textMain} !important;
        }

        /* ========== Plot prompt segment ========== */
        html body :is(${S_POPUP}) :is(textarea.plot-prompt-segment-content, .plot-prompt-segment-content) {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }

        html body :is(${S_POPUP}) .plot-prompt-segment {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 8px !important;
        }

        /* ========== 剧情推进区专属修复 ========== */
        html body :is(${S_POPUP}) #acu-tab-plot .acu-card > div:first-child {
          display: flex !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 14px !important;
          flex-wrap: wrap !important;
        }

        html body :is(${S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:first-child {
          flex: 1 1 360px !important;
          min-width: 0 !important;
        }

        html body :is(${S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:first-child > p.notes {
          display: block !important;
          margin: 6px 0 0 0 !important;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          color: ${t.textSub} !important;
          font-size: 13px !important;
          line-height: 1.45 !important;
          word-break: normal !important;
        }

        html body :is(${S_POPUP}) #acu-tab-plot .acu-card > div:first-child > div:nth-child(2) {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }

        html body :is(${S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) {
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
          white-space: nowrap !important;
          word-break: keep-all !important;
          min-width: 148px !important;
          width: auto !important;
          max-width: 100% !important;
          padding: 12px 22px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
        }

        html body :is(${S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) i {
          flex-shrink: 0 !important;
        }

        /* ========== Toggle switch ========== */
        /* 内部 checkbox 维持隐藏 */
        html body :is(${S_POPUP}) .toggle-switch input[type="checkbox"] {
          -webkit-appearance: auto !important;
          appearance: auto !important;
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          width: 0 !important;
          height: 0 !important;
          min-width: 0 !important;
          min-height: 0 !important;
          opacity: 0 !important;
          margin: 0 !important;
        }

        /* 状态文本高亮 */
        html body :is(${S_POPUP}) span[style*="lightgreen"] {
          color: ${t.accent} !important;
        }

        /* Toggle switch 轨道与滑块 */
        html body :is(${S_POPUP}) .toggle-switch .slider {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          border: 1.5px solid ${t.border} !important;
          border-radius: 20px !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${S_POPUP}) .toggle-switch .slider:before {
          background-color: ${t.btnActiveText} !important;
          border: 1px solid ${t.border} !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        html body :is(${S_POPUP}) .toggle-switch input:checked + .slider {
          background-color: ${t.btnActiveBg} !important;
          background: ${t.btnActiveBg} !important;
          border-color: ${t.btnActiveBg} !important;
        }

        html body :is(${S_POPUP}) .toggle-switch input:checked + .slider:before {
          background-color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveText} !important;
        }

        /* ========== Prompt Segment Toolbar ========== */
        html body :is(${S_POPUP}) .prompt-segment {
          background-color: ${t.bgPanel} !important;
          border: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
          border-radius: 8px !important;
        }

        html body :is(${S_POPUP}) .prompt-segment-toolbar {
          background-color: transparent !important;
          color: ${t.textMain} !important;
        }

        html body :is(${S_POPUP}) .prompt-segment-toolbar :is(.prompt-segment-role, .prompt-segment-main-slot, .prompt-segment-delete-btn) {
          background-color: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        html body :is(${S_POPUP}) .prompt-segment-toolbar :is(.prompt-segment-role, .prompt-segment-main-slot, .prompt-segment-delete-btn):hover {
          background-color: ${t.btnHover} !important;
        }

        /* ========== Tabs Navigation 标签页导航 ========== */
        html body :is(${S_POPUP_MAIN}) .acu-tabs-nav {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          color: ${t.textMain} !important;
          border-bottom: 1px solid ${t.border} !important;
          margin: 0 !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 32011 !important;
          isolation: isolate !important;
        }

        html body :is(${S_POPUP_MAIN}) .acu-nav-section-title {
          color: ${t.textSub} !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
        }

        /* Tab Button (default state) */
        html body :is(${S_POPUP_MAIN}) .acu-tab-button {
          background-color: transparent !important;
          background: transparent !important;
          color: ${t.textSub} !important;
          border: 1px solid transparent !important;
          border-radius: 8px !important;
          padding: 8px 14px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Tab Button (hover) */
        html body :is(${S_POPUP_MAIN}) .acu-tab-button:hover {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          transform: translateY(-1px) !important;
        }

        /* Tab Button (active state) */
        html body :is(${S_POPUP_MAIN}) .acu-tab-button.active {
          background-color: ${t.btnActiveBg} !important;
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
          box-shadow: 0 2px 8px ${t.accent}33 !important;
        }

        /* ========== 可视化编辑器 ========== */
        /* Header - 增强渐变效果 */
        #acu-visualizer-content .acu-vis-header {
          background: linear-gradient(135deg, ${t.bgNav} 0%, ${t.bgPanel} 100%) !important;
          border-bottom: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
          position: relative !important;
        }

        /* Header 底部高光 */
        #acu-visualizer-content .acu-vis-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 40% !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, ${t.accent}44, transparent) !important;
        }

        /* Content Area */
        #acu-visualizer-content .acu-vis-content {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
        }

        /* Sidebar - 增强样式 */
        #acu-visualizer-content .acu-vis-sidebar {
          background-color: ${t.bgNav} !important;
          background: ${t.bgNav} !important;
          border-right: 1px solid ${t.border} !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05) !important;
        }

        /* Main Section */
        #acu-visualizer-content .acu-vis-main {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          color: ${t.textMain} !important;
        }

        /* Title & Actions */
        #acu-visualizer-content .acu-vis-title {
          color: ${t.textMain} !important;
          font-weight: 600 !important;
        }

        #acu-visualizer-content .acu-vis-actions {
          color: ${t.textSub} !important;
        }

        /* 可视化编辑器 - 数据卡片 */
        /* Card Grid Layout - 增强间距和动画 */
        #acu-visualizer-content .acu-card-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
          gap: 20px !important;
          padding: 20px !important;
        }

        /* Data Card Container - 现代化卡片设计 */
        #acu-visualizer-content .acu-data-card {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 12px !important;
          overflow: visible !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
          display: flex !important;
          flex-direction: column !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.08),
            0 1px 2px rgba(0, 0, 0, 0.04) !important;
          position: relative !important;
        }

        /* 卡片左侧装饰线 */
        #acu-visualizer-content .acu-data-card::before {
          content: '' !important;
          position: absolute !important;
          top: 12px !important;
          bottom: 12px !important;
          left: 0 !important;
          width: 3px !important;
          background: ${t.accent} !important;
          border-radius: 0 3px 3px 0 !important;
          opacity: 0 !important;
          transition: opacity 0.25s ease !important;
        }

        /* 卡片悬停效果 */
        #acu-visualizer-content .acu-data-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.15),
            0 4px 8px rgba(0, 0, 0, 0.08),
            0 0 0 1px ${t.accent}22 !important;
          border-color: ${t.accent}66 !important;
        }

        /* 悬停时显示装饰线 */
        #acu-visualizer-content .acu-data-card:hover::before {
          opacity: 1 !important;
        }

        /* Add Row Card - 虚线边框样式增强 */
        #acu-visualizer-content #acu-vis-add-row,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row {
          background: ${t.bgPanel} !important;
          background-color: ${t.bgPanel} !important;
          border: 2px dashed ${t.accent}66 !important;
          border-color: ${t.accent}66 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          min-height: 48px !important;
          padding: 6px 12px !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* 添加卡片无装饰线 */
        #acu-visualizer-content #acu-vis-add-row::before {
          display: none !important;
        }

        #acu-visualizer-content #acu-vis-add-row i,
        #acu-visualizer-content #acu-vis-add-row i.fa-solid,
        #acu-visualizer-content #acu-vis-add-row i.fa-plus,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > i,
        #acu-vis-add-row i[style] {
          color: ${t.accent} !important;
          font-size: 20px !important;
          line-height: 1 !important;
          transition: all 0.25s ease !important;
        }

        #acu-visualizer-content #acu-vis-add-row div,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > div,
        #acu-vis-add-row div[style] {
          color: ${t.accent} !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          font-weight: 650 !important;
          transition: all 0.25s ease !important;
        }

        #acu-visualizer-content #acu-vis-add-row:hover {
          background: ${t.btnBg} !important;
          background-color: ${t.btnBg} !important;
          border-color: ${t.accent} !important;
          border-style: solid !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 20px ${t.accent}22 !important;
        }

        #acu-visualizer-content #acu-vis-add-row:hover i,
        #acu-visualizer-content #acu-vis-add-row:hover div,
        #acu-vis-add-row:hover i[style],
        #acu-vis-add-row:hover div[style] {
          color: ${t.btnActiveBg} !important;
          transform: scale(1.2) !important;
        }

        /* Card Header - 现代化设计 */
        #acu-visualizer-content .acu-card-header {
          background: linear-gradient(135deg, ${t.btnActiveBg} 0%, ${t.accent} 100%) !important;
          background-color: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          padding: 14px 18px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-bottom: none !important;
          border-radius: 12px 12px 0 0 !important;
          position: relative !important;
        }

        /* Card Header 底部微光 */
        #acu-visualizer-content .acu-card-header::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
        }

        /* Card Body - 优化内边距和排版 */
        #acu-visualizer-content .acu-card-body {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          padding: 18px !important;
          flex: 1 !important;
          color: ${t.textMain} !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          border-radius: 0 0 12px 12px !important;
        }
        /* 可视化编辑器 - 交互按钮 */
        /* Lock Buttons - 通配符统一处理所有锁定按钮 */
        #acu-visualizer-content [class*="acu-lock"],
        #acu-visualizer-content [class*="acu-vis-lock"] {
          background: ${t.btnBg} !important;
          color: ${t.textSub} !important;
          border: 1px solid ${t.border} !important;
          padding: 4px 6px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          /* 紧凑尺寸 - 防止触摸屏优化导致按钮增大 */
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
          font-size: 12px !important;
          line-height: 1 !important;
          border-radius: 4px !important;
          flex-shrink: 0 !important;
        }

        #acu-visualizer-content [class*="acu-lock"]:hover,
        #acu-visualizer-content [class*="acu-vis-lock"]:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
        }

        /* Delete Buttons (Red warning) */
        #acu-visualizer-content .acu-vis-del-row,
        #acu-visualizer-content .acu-vis-del-table-btn {
          background: ${t.btnBg} !important;
          color: ${t.textSub} !important;
          border: 1px solid ${t.border} !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-vis-del-row:hover,
        #acu-visualizer-content .acu-vis-del-table-btn:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }

        /* Add Table Button */
        #acu-visualizer-content .acu-add-table-btn {
          background: ${t.accent} !important;
          color: #fff !important;
          border: none !important;
          padding: 10px 16px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-add-table-btn:hover {
          background: ${t.btnActiveBg} !important;
        }

        /* 可视化编辑器 - 工具栏容器 */
        #acu-visualizer-content .acu-vis-toolbar {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 8px 12px !important;
          background: ${t.bgNav} !important;
          border-bottom: 1px solid ${t.border} !important;
          flex-shrink: 0 !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }

        /* 可视化编辑器 - 模式切换与操作按钮 */
        /* Mode Switch Container */
        #acu-visualizer-content .acu-mode-switch {
          display: flex !important;
          gap: 4px !important;
          padding: 4px !important;
          background: ${t.bgPanel} !important;
          border-radius: 6px !important;
          border: 1px solid ${t.border} !important;
          flex-shrink: 0 !important;
        }

        /* Mode Button (default) */
        #acu-visualizer-content .acu-mode-btn {
          background: transparent !important;
          color: ${t.textSub} !important;
          border: 1px solid transparent !important;
          padding: 6px 10px !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
        }

        #acu-visualizer-content .acu-mode-btn:hover {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          transform: translateY(-1px) !important;
        }

        #acu-visualizer-content .acu-mode-btn:active {
          transform: translateY(0) scale(0.98) !important;
        }

        /* Mode Button (active) */
        #acu-visualizer-content .acu-mode-btn.active {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
          box-shadow: 0 2px 8px ${t.accent}33 !important;
        }

        /* 操作按钮区域 */
        #acu-visualizer-content .acu-vis-actions {
          display: flex !important;
          gap: 6px !important;
          flex-wrap: wrap !important;
          justify-content: flex-end !important;
          flex-shrink: 1 !important;
          min-width: 0 !important;
        }

        /* Primary Button */
        #acu-visualizer-content .acu-btn-primary {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border: none !important;
          padding: 6px 12px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 6px ${t.accent}33 !important;
        }

        #acu-visualizer-content .acu-btn-primary:hover {
          filter: brightness(1.1) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px ${t.accent}44 !important;
        }

        #acu-visualizer-content .acu-btn-primary:active {
          transform: translateY(0) scale(0.98) !important;
          box-shadow: 0 1px 4px ${t.accent}22 !important;
        }

        /* Secondary Button */
        #acu-visualizer-content .acu-btn-secondary {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          padding: 6px 12px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #acu-visualizer-content .acu-btn-secondary:hover {
          background: ${t.btnHover} !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        #acu-visualizer-content .acu-btn-secondary:active {
          transform: translateY(0) scale(0.98) !important;
        }
        /* 可视化编辑器 - 字段元素 */
        /* Field Row */
        #acu-visualizer-content .acu-field-row {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px !important;
          padding: 10px 0 !important;
          border-bottom: 1px solid ${t.border} !important;
          transition: background-color 0.2s ease !important;
        }

        #acu-visualizer-content .acu-field-row:last-child {
          border-bottom: none !important;
        }

        /* Field Label - 覆盖inline style的justify-content:space-between，让锁定按钮紧跟文字 */
        #acu-visualizer-content .acu-field-label {
          color: ${t.textSub} !important;
          font-weight: 600 !important;
          min-width: 140px !important;
          max-width: 200px !important;
          font-size: 13px !important;
          padding-top: 8px !important;
          user-select: none !important;
          overflow: visible !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          /* 覆盖inline style，让锁定按钮紧跟在列名后面而不是被推到右边 */
          justify-content: flex-start !important;
        }

        /* Field Value Wrapper - 改为横向布局，锁定按钮紧跟在值后面 */
        #acu-visualizer-content .acu-field-value-wrap {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 8px !important;
          width: 100% !important;
        }

        /* 单元格锁定按钮 - 紧凑样式 */
        #acu-visualizer-content .acu-field-value-wrap > .acu-lock-btn {
          flex-shrink: 0 !important;
          padding: 4px 6px !important;
          font-size: 12px !important;
          border-radius: 4px !important;
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
        }

        /* Field Value (editable) */
        #acu-visualizer-content .acu-field-value {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          min-height: 38px !important;
          /* 修复：让输入框始终占满一行，文字自动换行 */
          flex: 1 1 0 !important;
          min-width: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: text !important;
          line-height: 1.5 !important;
          /* 文字换行 */
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }

        #acu-visualizer-content .acu-field-value:hover {
          border-color: ${t.accent} !important;
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        #acu-visualizer-content .acu-field-value:focus {
          border-color: ${t.accent} !important;
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${t.accent}33 !important;
        }

        /* 可视化编辑器 - 配置面板 */
        /* Panel Container */
        #acu-visualizer-content .acu-config-panel {
          background: ${t.bgPanel} !important;
          padding: 20px !important;
          border-radius: 8px !important;
        }

        /* Config Section */
        #acu-visualizer-content .acu-config-section {
          margin-bottom: 24px !important;
        }

        #acu-visualizer-content .acu-config-section h4 {
          color: ${t.textMain} !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
        }

        /* Form Group */
        #acu-visualizer-content .acu-form-group {
          margin-bottom: 16px !important;
        }

        #acu-visualizer-content .acu-form-group label {
          color: ${t.textSub} !important;
          display: block !important;
          margin-bottom: 6px !important;
          font-weight: 500 !important;
        }

        /* Form Inputs */
        #acu-visualizer-content .acu-form-input,
        #acu-visualizer-content .acu-form-textarea {
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          width: 100% !important;
          font-size: 14px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        #acu-visualizer-content .acu-form-input:hover,
        #acu-visualizer-content .acu-form-textarea:hover {
          border-color: ${t.accent}66 !important;
        }

        #acu-visualizer-content .acu-form-input:focus,
        #acu-visualizer-content .acu-form-textarea:focus {
          border-color: ${t.accent} !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${t.accent}22 !important;
        }

        #acu-visualizer-content .acu-form-textarea {
          min-height: 80px !important;
          resize: vertical !important;
          line-height: 1.5 !important;
        }

        /* Hint Text */
        #acu-visualizer-content .acu-hint {
          color: ${t.textSub} !important;
          font-size: 12px !important;
          opacity: 0.7 !important;
          margin-top: 4px !important;
        }

        /* ========== 可视化编辑器 - 侧边栏导航 ========== */
        /* 侧边栏容器 */
        #acu-visualizer-content .acu-vis-sidebar {
          background: ${t.bgNav} !important;
          border-right: 1px solid ${t.border} !important;
          padding: 8px !important;
          overflow-y: auto !important;
        }

        /* 通配符: 侧边栏内所有按钮统一紧凑样式 - 防止触控优化导致按钮放大 */
        #acu-visualizer-content .acu-vis-sidebar button,
        #acu-visualizer-content [class*="acu-table-nav-"] button,
        #acu-visualizer-content [class*="acu-vis-del-"] {
          min-width: unset !important;
          min-height: unset !important;
          width: auto !important;
          height: auto !important;
          padding: 4px 6px !important;
          font-size: 12px !important;
          line-height: 1 !important;
          border-radius: 4px !important;
          background: ${t.btnBg} !important;
          color: ${t.textSub} !important;
          border: 1px solid ${t.border} !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          flex-shrink: 0 !important;
        }

        #acu-visualizer-content .acu-vis-sidebar button:hover,
        #acu-visualizer-content [class*="acu-table-nav-"] button:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
        }

        /* 删除按钮悬停时变红色警告 */
        #acu-visualizer-content [class*="acu-vis-del-"]:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }

        /* Table Nav Item (default) */
        #acu-visualizer-content .acu-table-nav-item {
          background: transparent !important;
          color: ${t.textSub} !important;
          border: 1px solid transparent !important;
          padding: 6px 8px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 6px !important;
          border-radius: 6px !important;
          margin-bottom: 2px !important;
          font-size: 16px !important;
        }

        /* Table Nav Item (hover) */
        #acu-visualizer-content .acu-table-nav-item:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
        }

        /* Table Nav Item (active) */
        #acu-visualizer-content .acu-table-nav-item.active {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
        }

        /* 表格导航内容区 */
        #acu-visualizer-content .acu-table-nav-content {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex: 1 !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }

        /* 表格导航操作按钮区 */
        #acu-visualizer-content .acu-table-nav-actions {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          flex-shrink: 0 !important;
        }

        /* Table Name */
        #acu-visualizer-content .acu-table-name {
          font-weight: 500 !important;
          flex: 1 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        /* Table Index */
        #acu-visualizer-content .acu-table-index {
          font-size: 10px !important;
          color: ${t.textSub} !important;
          opacity: 0.7 !important;
        }

        /* 新增表格按钮 */
        #acu-visualizer-content .acu-add-table-btn {
          width: 100% !important;
          margin-top: 8px !important;
          padding: 8px 12px !important;
          background: ${t.accent} !important;
          color: ${t.btnActiveText} !important;
          border: none !important;
          border-radius: 6px !important;
          font-size: 12px !important;
          cursor: pointer !important;
          min-width: unset !important;
          min-height: unset !important;
        }

        #acu-visualizer-content .acu-add-table-btn:hover {
          filter: brightness(1.1) !important;
        }

        /* 表格导航按钮 - 透明背景（使用更广泛的选择器） */
        .acu-table-order-btn,
        .acu-vis-del-table-btn,
        .acu-vis-sidebar .acu-table-order-btn,
        .acu-vis-sidebar .acu-vis-del-table-btn,
        .acu-table-nav-actions .acu-table-order-btn,
        .acu-table-nav-actions .acu-vis-del-table-btn,
        #acu-visualizer-content .acu-table-order-btn,
        #acu-visualizer-content .acu-vis-del-table-btn {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          color: ${t.textSub} !important;
          opacity: 0.7 !important;
        }

        .acu-table-order-btn:hover,
        .acu-vis-del-table-btn:hover,
        .acu-vis-sidebar .acu-table-order-btn:hover,
        .acu-vis-sidebar .acu-vis-del-table-btn:hover,
        .acu-table-nav-actions .acu-table-order-btn:hover,
        .acu-table-nav-actions .acu-vis-del-table-btn:hover,
        #acu-visualizer-content .acu-table-order-btn:hover,
        #acu-visualizer-content .acu-vis-del-table-btn:hover {
          background: ${t.btnHover} !important;
          background-color: ${t.btnHover} !important;
          color: ${t.textMain} !important;
          opacity: 1 !important;
        }

        .acu-table-order-btn:disabled,
        #acu-visualizer-content .acu-table-order-btn:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        /* 可视化编辑器 - 滚动条与响应式 */
        /* Scrollbar Styles */
        #acu-visualizer-content ::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-track {
          background: ${t.bgNav} !important;
          border-radius: 4px !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-thumb {
          background: ${t.btnBg} !important;
          border-radius: 4px !important;
          border: 2px solid ${t.bgNav} !important;
        }

        #acu-visualizer-content ::-webkit-scrollbar-thumb:hover {
          background: ${t.btnHover} !important;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          /* 工具栏响应式 - 垂直堆叠布局 */
          #acu-visualizer-content .acu-vis-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 6px !important;
            gap: 4px !important;
          }

          #acu-visualizer-content .acu-mode-switch {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-mode-btn {
            flex: 1 !important;
            text-align: center !important;
            padding: 6px 8px !important;
            min-height: 32px !important;
          }

          #acu-visualizer-content .acu-vis-actions {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-btn-primary,
          #acu-visualizer-content .acu-btn-secondary {
            flex: 1 !important;
            text-align: center !important;
            padding: 6px 10px !important;
            min-height: 32px !important;
          }

          #acu-visualizer-content .acu-vis-header {
            flex-direction: column !important;
            height: auto !important;
            padding: 10px !important;
          }

          #acu-visualizer-content .acu-vis-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid ${t.border} !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }

          #acu-visualizer-content .acu-vis-content {
            flex-direction: column !important;
          }

          #acu-visualizer-content .acu-card-grid {
            grid-template-columns: 1fr !important;
            padding: 12px !important;
            gap: 16px !important;
          }

          /* 移动端卡片简化动画 */
          #acu-visualizer-content .acu-data-card {
            border-radius: 10px !important;
          }

          #acu-visualizer-content .acu-data-card:hover {
            transform: none !important;
          }

          #acu-visualizer-content .acu-data-card::before {
            display: none !important;
          }

          #acu-visualizer-content .acu-card-header {
            padding: 12px 14px !important;
            border-radius: 10px 10px 0 0 !important;
          }

          #acu-visualizer-content .acu-card-body {
            padding: 14px !important;
            border-radius: 0 0 10px 10px !important;
          }

          #acu-visualizer-content .acu-field-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          #acu-visualizer-content .acu-field-label {
            min-width: unset !important;
            width: 100% !important;
            padding-bottom: 4px !important;
          }

          #acu-visualizer-content .acu-vis-actions {
            justify-content: center !important;
            width: 100% !important;
            margin-top: 10px !important;
          }

          /* 移动端通用按钮触控优化 */
          html body .auto-card-updater-popup button,
          html body .auto-card-updater-popup .button {
            min-height: 44px !important;
            padding: 10px 16px !important;
          }

          /* 移动端禁用 transform 动画以提升性能 */
          html body .auto-card-updater-popup button:hover,
          html body .auto-card-updater-popup .button:hover {
            transform: none !important;
          }

          html body .auto-card-updater-popup button:active,
          html body .auto-card-updater-popup .button:active {
            transform: scale(0.98) !important;
          }

          html body :is(${S_POPUP}) [id$="-data-isolation-input-area"] > div {
            flex-direction: column !important;
          }

          html body :is(${S_POPUP}) button[id$="-data-isolation-save"].primary {
            width: 100% !important;
          }

          html body :is(${S_POPUP}) button[id$="-data-isolation-history-toggle"] {
            width: 36px !important;
            min-width: 36px !important;
            height: 36px !important;
            min-height: 36px !important;
          }

          html body :is(${S_POPUP}) button[id$="-data-isolation-delete-entries"] {
            width: 100% !important;
            min-width: 0 !important;
          }

          html body :is(${S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-left {
            grid-template-columns: 1fr !important;
          }

          html body :is(${S_POPUP}) .acu-template-preset-toolbar .acu-template-preset-actions {
            grid-template-columns: 1fr 1fr !important;
          }

          html body :is(${S_POPUP}) .acu-mini-btn {
            width: 100% !important;
          }

          html body :is(${S_POPUP}) :is(button[id$="-plot-start-loop-btn"], button[id$="-plot-stop-loop-btn"]) {
            width: 100% !important;
          }
        }

        /* 可视化编辑器 - 列编辑器 */
        /* Column List */
        #acu-visualizer-content .acu-col-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          padding: 8px 0 !important;
        }

        /* Column Item */
        #acu-visualizer-content .acu-col-item {
          background: ${t.btnBg} !important;
          border: 1px solid ${t.border} !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-col-item:hover {
          background: ${t.btnHover} !important;
        }

        /* Column Input */
        #acu-visualizer-content .acu-col-input {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          padding: 6px 10px !important;
          border-radius: 4px !important;
          flex: 1 !important;
          font-size: 13px !important;
        }

        #acu-visualizer-content .acu-col-input:focus {
          border-color: ${t.accent} !important;
          outline: none !important;
        }

        /* Column Delete Button */
        #acu-visualizer-content .acu-col-btn {
          background: ${t.btnBg} !important;
          color: ${t.textSub} !important;
          border: 1px solid ${t.border} !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        #acu-visualizer-content .acu-col-btn:hover {
          background: #ff4444 !important;
          color: #fff !important;
          border-color: #cc0000 !important;
        }
      </style>
    `;

    for (const $ of targets) {
      $('#dice-db-theme-sync').remove();
      $('head').append(css);
    }
  } catch (e) {
    // 完全静默
  }
}

const DB_TOAST_MUTE_STYLE_ID = 'dice-db-toast-mute';

const collectDatabaseToastDocuments = (): Document[] => {
  const docs: Document[] = [];
  const tryAddDoc = (w: Window | null | undefined) => {
    try {
      const doc = w?.document;
      if (doc && !docs.includes(doc)) docs.push(doc);
    } catch {
      return;
    }
  };

  tryAddDoc(window);
  tryAddDoc(window.parent);
  tryAddDoc(window.top);
  return docs;
};

export function setDatabaseToastMute(enabled: boolean) {
  try {
    const css = `
#toast-container .acu-toast,
.toast.acu-toast,
.acu-toast.toast {
  display: none !important;
}
`;
    const docs = collectDatabaseToastDocuments();
    for (const doc of docs) {
      const existing = doc.getElementById(DB_TOAST_MUTE_STYLE_ID);
      if (enabled) {
        if (!existing) {
          const style = doc.createElement('style');
          style.id = DB_TOAST_MUTE_STYLE_ID;
          style.textContent = css;
          (doc.head || doc.documentElement).appendChild(style);
        }
        doc.querySelectorAll('.acu-toast').forEach(node => node.remove());
      } else if (existing) {
        existing.remove();
      }
    }
  } catch {
    return;
  }
}
