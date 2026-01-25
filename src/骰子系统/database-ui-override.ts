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
        html body .auto-card-updater-popup button,
        html body .auto-card-updater-popup .button {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }
        html body .auto-card-updater-popup button:hover,
        html body .auto-card-updater-popup .button:hover {
          background: ${t.btnHover} !important;
        }
        html body .auto-card-updater-popup button.primary,
        html body .auto-card-updater-popup .button.primary {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .button-group.acu-data-mgmt-buttons button,
        html body #shujuku_v104-popup.auto-card-updater-popup .button-group.acu-data-mgmt-buttons .button,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .button-group.acu-data-mgmt-buttons button,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .button-group.acu-data-mgmt-buttons .button {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .button-group.acu-data-mgmt-buttons button:hover,
        html body #shujuku_v104-popup.auto-card-updater-popup .button-group.acu-data-mgmt-buttons .button:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .button-group.acu-data-mgmt-buttons button:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .button-group.acu-data-mgmt-buttons .button:hover {
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
        html body #shujuku_v104-popup.auto-card-updater-popup table thead th,
        html body #shujuku_v104-popup.auto-card-updater-popup table th,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table thead th,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-header,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-header,
        html body #shujuku_v104-main-window .acu-window-header,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-header {
          background: ${t.bgNav} !important;
          border-bottom: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-title,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-title,
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-title span,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-title span,
        html body #shujuku_v104-main-window .acu-window-title,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-title,
        html body #shujuku_v104-main-window .acu-window-title span,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-title span {
          color: ${t.textMain} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-title i,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-title i,
        html body #shujuku_v104-main-window .acu-window-title i,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-title i {
          color: ${t.accent} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn,
        html body #shujuku_v104-main-window .acu-window-btn,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn:hover,
        html body #shujuku_v104-main-window .acu-window-btn:hover,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn.close:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn.close:hover,
        html body #shujuku_v104-main-window .acu-window-btn.close:hover,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn.close:hover {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-stepper,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-stepper {
          background-color: ${t.inputBg} !important;
          border-color: ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-stepper-btn,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-stepper-btn {
          background-color: ${t.btnBg} !important;
          color: ${t.textSub} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-stepper-btn:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-stepper-btn:hover {
          background-color: ${t.btnHover} !important;
          color: ${t.accent} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-stepper-btn:active,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-stepper-btn:active {
          background-color: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-stepper-value,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-stepper-value {
          background-color: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border-left: 1px solid ${t.border} !important;
          border-right: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="number"],
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="number"] {
          color-scheme: ${stepperColorScheme} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="number"]::-webkit-inner-spin-button,
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="number"]::-webkit-outer-spin-button,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="number"]::-webkit-inner-spin-button,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="number"]::-webkit-outer-spin-button {
          filter: ${stepperSpinFilter} !important;
          opacity: ${stepperSpinOpacity} !important;
        }
        html body .auto-card-updater-popup input,
        html body .auto-card-updater-popup select,
        html body .auto-card-updater-popup textarea,
        html body #shujuku_v104-popup input,
        html body #shujuku_v104-popup select,
        html body #shujuku_v104-popup textarea,
        html body div[id^="shujuku"][id$="-popup"] input,
        html body div[id^="shujuku"][id$="-popup"] select,
        html body div[id^="shujuku"][id$="-popup"] textarea {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          background-image: none !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-color: ${t.border} !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }

        /* 修复 placeholder 颜色 */
        html body .auto-card-updater-popup input::placeholder,
        html body .auto-card-updater-popup textarea::placeholder,
        [id^="shujuku"][id$="-popup"] input::placeholder,
        [id^="shujuku"][id$="-popup"] textarea::placeholder {
          color: ${t.textSub} !important;
          opacity: 0.7;
        }

        /* ========== Checkbox 强化覆盖 ========== */
        /* Checkbox Container (Group) */
        html body #shujuku_v104-popup.auto-card-updater-popup .checkbox-group,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .checkbox-group {
          background-color: transparent !important; /* 避免容器产生不必要的背景 */
          color: ${t.textMain} !important;
        }
        
        /* Checkbox Label */
        html body #shujuku_v104-popup.auto-card-updater-popup .checkbox-group label,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .checkbox-group label {
          color: ${t.textMain} !important;
        }

        /* Checkbox Input Element (统一自绘，压制酒馆主题/脚本自绘) */
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="checkbox"],
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="checkbox"],
        html body #shujuku_v104-popup.auto-card-updater-popup .checkbox-group input[type="checkbox"],
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .checkbox-group input[type="checkbox"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 16px !important;
          height: 16px !important;
          min-width: 16px !important;
          min-height: 16px !important;
          border-radius: 4px !important;
          border: 1px solid ${t.border} !important;
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
        }
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="checkbox"]::before,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="checkbox"]::before,
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="checkbox"]::after,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="checkbox"]::after {
          content: none !important;
          display: none !important;
        }

        /* Checked State */
        html body #shujuku_v104-popup.auto-card-updater-popup input[type="checkbox"]:checked,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="checkbox"]:checked {
          background-color: ${t.accent} !important;
          border-color: ${t.accent} !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'%3E%3Cpath fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M1 5l3 3 7-7'/%3E%3C/svg%3E") !important;
        }
        html body .auto-card-updater-popup th,
        html body .auto-card-updater-popup thead th {
          color: ${t.textMain} !important;
          background-color: ${t.btnActiveBg} !important;
        }
        /* ========== Status & Messages Display 状态与消息显示 (自绘强化) ========== */
        html body .auto-card-updater-popup span[id$="-status-display"],
        html body .auto-card-updater-popup span[id$="-messages-display"],
        html body .auto-card-updater-popup p.notes,
        html body div[id$="-popup"] span[id$="-status-display"],
        html body div[id$="-popup"] span[id$="-messages-display"],
        html body div[id$="-popup"] p.notes,
        html body span[id$="-card-update-status-display"],
        html body span[id$="-total-messages-display"],
        html body [id$="-status-message"] {
          display: block !important;
          background-color: var(--acu-bg-2) !important;
          color: var(--acu-text-1) !important;
          border: 1px solid var(--acu-border) !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          margin: 8px 0 !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05) !important;
          word-break: break-all !important;
        }
        html body .auto-card-updater-popup span[id$="-status-display"] b,
        html body div[id$="-popup"] span[id$="-status-display"] b,
        html body span[id$="-card-update-status-display"] b {
          color: var(--acu-accent) !important;
          font-weight: bold !important;
        }
        html body .auto-card-updater-popup span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body div[id$="-popup"] span[id$="-status-display"] *:not(b):not([style*="color"]),
        html body span[id$="-card-update-status-display"] *:not(b):not([style*="color"]) {
          color: inherit !important;
        }
        html body .auto-card-updater-popup table tbody tr,
        html body .auto-card-updater-popup table tbody tr:nth-child(odd),
        html body .auto-card-updater-popup table tbody tr:nth-child(even) {
          background-color: ${t.bgPanel} !important;
        }
        html body .auto-card-updater-popup table tbody tr:hover {
          background-color: ${t.btnHover} !important;
        }
        html body .auto-card-updater-popup table tbody td {
          color: ${t.textMain} !important;
        }

        /* ========== Table Layout & Column Alignment 表格布局与列对齐 ========== */
        html body .auto-card-updater-popup table,
        html body #shujuku_v104-popup.auto-card-updater-popup table,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table {
          table-layout: fixed !important;
          width: 100% !important;
          border-collapse: collapse !important;
          max-width: 100% !important;
          overflow: hidden !important;
          /* 修复右侧空白：确保表格填满容器 */
          box-sizing: border-box !important;
        }

        html body .auto-card-updater-popup table thead,
        html body .auto-card-updater-popup table tbody,
        html body .auto-card-updater-popup table tr,
        html body #shujuku_v104-popup.auto-card-updater-popup table thead,
        html body #shujuku_v104-popup.auto-card-updater-popup table tbody,
        html body #shujuku_v104-popup.auto-card-updater-popup table tr,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table thead,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table tbody,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table tr {
          width: 100% !important;
          box-sizing: border-box !important;
        }

        html body .auto-card-updater-popup table th,
        html body .auto-card-updater-popup table td,
        html body #shujuku_v104-popup.auto-card-updater-popup table th,
        html body #shujuku_v104-popup.auto-card-updater-popup table td,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td {
          text-align: left !important;
          padding: 5px 8px !important;
          border: 1px solid ${t.border} !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
        }

        /* 第一列（名称列）左对齐，自适应宽度 */
        html body .auto-card-updater-popup table th:first-child,
        html body .auto-card-updater-popup table td:first-child,
        html body #shujuku_v104-popup.auto-card-updater-popup table th:first-child,
        html body #shujuku_v104-popup.auto-card-updater-popup table td:first-child,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th:first-child,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td:first-child {
          text-align: left !important;
          width: 25% !important;
        }

        /* 中间列居中对齐，均分剩余宽度 */
        html body .auto-card-updater-popup table th:not(:first-child):not(:last-child),
        html body .auto-card-updater-popup table td:not(:first-child):not(:last-child),
        html body #shujuku_v104-popup.auto-card-updater-popup table th:not(:first-child):not(:last-child),
        html body #shujuku_v104-popup.auto-card-updater-popup table td:not(:first-child):not(:last-child),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th:not(:first-child):not(:last-child),
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td:not(:first-child):not(:last-child) {
          text-align: center !important;
          width: calc((100% - 25%) / 4) !important;
        }

        /* 最后一列（操作列）居中 */
        html body .auto-card-updater-popup table th:last-child,
        html body .auto-card-updater-popup table td:last-child,
        html body #shujuku_v104-popup.auto-card-updater-popup table th:last-child,
        html body #shujuku_v104-popup.auto-card-updater-popup table td:last-child,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th:last-child,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td:last-child {
          text-align: center !important;
          width: 25% !important;
        }

        /* ========== Mobile Responsive 移动端适配 ========== */
        @media (max-width: 768px) {
          html body .auto-card-updater-popup table,
          html body #shujuku_v104-popup.auto-card-updater-popup table,
          html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table {
            font-size: 0.8em !important;
          }

          html body .auto-card-updater-popup table th,
          html body .auto-card-updater-popup table td,
          html body #shujuku_v104-popup.auto-card-updater-popup table th,
          html body #shujuku_v104-popup.auto-card-updater-popup table td,
          html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table th,
          html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup table td {
            padding: 4px 6px !important;
          }
        }

        /* ========== Radio group 单选按钮组 ========== */
        #shujuku_v104-popup.auto-card-updater-popup .qrf_radio_group,
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup .qrf_radio_group {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 6px;
          padding: 8px 12px !important;
        }
        #shujuku_v104-popup.auto-card-updater-popup .qrf_radio_group label,
        #shujuku_v104-popup.auto-card-updater-popup .qrf_radio_group span,
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup .qrf_radio_group label,
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup .qrf_radio_group span {
          color: ${t.textMain} !important;
        }
        #shujuku_v104-popup.auto-card-updater-popup input[type="radio"],
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="radio"] {
          -webkit-appearance: none !important;
          appearance: none !important;
          width: 16px !important;
          height: 16px !important;
          min-width: 16px !important;
          min-height: 16px !important;
          border-radius: 50% !important;
          border: 1px solid ${t.border} !important;
          background-color: ${t.inputBg} !important;
          box-shadow: none !important;
          position: relative !important;
          cursor: pointer !important;
          vertical-align: middle !important;
        }
        #shujuku_v104-popup.auto-card-updater-popup input[type="radio"]:checked,
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="radio"]:checked {
          border-color: ${t.accent} !important;
        }
        #shujuku_v104-popup.auto-card-updater-popup input[type="radio"]:checked::after,
        [id^="shujuku"][id$="-popup"].auto-card-updater-popup input[type="radio"]:checked::after {
          content: '' !important;
          position: absolute !important;
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: ${t.accent} !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }

        /* ========== Worldbook entry list 世界书条目列表 ========== */
        #shujuku_v104-popup .qrf_worldbook_entry_list,
        #shujuku_v104-popup [class*="worldbook-entry-list"],
        [id^="shujuku"][id$="-popup"] .qrf_worldbook_entry_list,
        [id^="shujuku"][id$="-popup"] [class*="worldbook-entry-list"] {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 6px;
        }
        #shujuku_v104-popup .qrf_worldbook_entry_list label,
        #shujuku_v104-popup .qrf_worldbook_entry_list span,
        #shujuku_v104-popup .qrf_worldbook_entry_list div,
        [id^="shujuku"][id$="-popup"] .qrf_worldbook_entry_list label,
        [id^="shujuku"][id$="-popup"] .qrf_worldbook_entry_list span,
        [id^="shujuku"][id$="-popup"] .qrf_worldbook_entry_list div {
          color: ${t.textMain} !important;
        }

        /* ========== Plot prompt segment textarea ========== */
        #shujuku_v104-popup textarea.plot-prompt-segment-content,
        #shujuku_v104-popup .plot-prompt-segment-content,
        [id^="shujuku"][id$="-popup"] textarea.plot-prompt-segment-content,
        [id^="shujuku"][id$="-popup"] .plot-prompt-segment-content {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }

        /* ========== Plot prompt segment container ========== */
        #shujuku_v104-popup .plot-prompt-segment,
        [id^="shujuku"][id$="-popup"] .plot-prompt-segment {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }

        /* Toggle switch 内部 checkbox 维持隐藏输入，避免被上面规则接管 */
        html body #shujuku_v104-popup.auto-card-updater-popup .toggle-switch input[type="checkbox"],
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .toggle-switch input[type="checkbox"] {
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

        /* 状态文本高亮（替换内联 lightgreen） */
        html body #shujuku_v104-popup.auto-card-updater-popup span[style*="lightgreen"],
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup span[style*="lightgreen"] {
          color: ${t.accent} !important;
        }

        /* Toggle switch 轨道与滑块（修复浅色主题可见性） */
        html body #shujuku_v104-popup.auto-card-updater-popup .toggle-switch .slider,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .toggle-switch .slider {
          background-color: ${t.inputBg} !important;
          background: ${t.inputBg} !important;
          border: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .toggle-switch .slider:before,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .toggle-switch .slider:before {
          background-color: ${t.btnActiveText} !important;
          border: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .toggle-switch input:checked + .slider,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .toggle-switch input:checked + .slider {
          background-color: ${t.btnActiveBg} !important;
          background: ${t.btnActiveBg} !important;
          border-color: ${t.btnActiveBg} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .toggle-switch input:checked + .slider:before,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .toggle-switch input:checked + .slider:before {
          background-color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveText} !important;
        }

        /* ========== Prompt Segment Toolbar (修复浅色/玻璃主题对比度) ========== */
        /* Container */
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment {
          background-color: ${t.bgPanel} !important;
          border: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
        }

        /* Toolbar Container */
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar {
          background-color: transparent !important;
          color: ${t.textMain} !important;
        }

        /* Controls: Role Select, Main Slot Select, Delete Button */
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-role,
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-main-slot,
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-delete-btn,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-role,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-main-slot,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-delete-btn {
          background-color: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }

        /* Hover states */
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-role:hover,
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-main-slot:hover,
        html body #shujuku_v104-popup.auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-delete-btn:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-role:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-main-slot:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .prompt-segment-toolbar .prompt-segment-delete-btn:hover {
          background-color: ${t.btnHover} !important;
        }

        /* ========== Tabs Navigation 标签页导航 ========== */
        /* Container */
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-tabs-nav,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-tabs-nav,
        html body #shujuku_v104-main-window .acu-tabs-nav,
        html body [id^="shujuku"][id$="-main-window"] .acu-tabs-nav {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          color: ${t.textMain} !important;
          border-bottom: 1px solid ${t.border} !important;
        }

        /* Section Title */
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-nav-section-title,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-nav-section-title,
        html body #shujuku_v104-main-window .acu-nav-section-title,
        html body [id^="shujuku"][id$="-main-window"] .acu-nav-section-title {
          color: ${t.textSub} !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-weight: 600 !important;
        }

        /* Tab Button (default state) */
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-tab-button,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-tab-button,
        html body #shujuku_v104-main-window .acu-tab-button,
        html body [id^="shujuku"][id$="-main-window"] .acu-tab-button {
          background-color: transparent !important;
          background: transparent !important;
          color: ${t.textSub} !important;
          border: 1px solid transparent !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        /* Tab Button (hover) */
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-tab-button:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-tab-button:hover,
        html body #shujuku_v104-main-window .acu-tab-button:hover,
        html body [id^="shujuku"][id$="-main-window"] .acu-tab-button:hover {
          background-color: ${t.btnBg} !important;
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
        }

        /* Tab Button (active state) */
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-tab-button.active,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-tab-button.active,
        html body #shujuku_v104-main-window .acu-tab-button.active,
        html body [id^="shujuku"][id$="-main-window"] .acu-tab-button.active {
          background-color: ${t.btnActiveBg} !important;
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
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
