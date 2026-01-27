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
        html body [id^="shujuku"][id$="-main-window"] .acu-window-header,
        html body #shujuku_v104-visualizer-window .acu-window-header,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-header {
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
        html body [id^="shujuku"][id$="-main-window"] .acu-window-title span,
        html body #shujuku_v104-visualizer-window .acu-window-title,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-title,
        html body #shujuku_v104-visualizer-window .acu-window-title span,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-title span {
          color: ${t.textMain} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-title i,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-title i,
        html body #shujuku_v104-main-window .acu-window-title i,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-title i,
        html body #shujuku_v104-visualizer-window .acu-window-title i,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-title i {
          color: ${t.accent} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn,
        html body #shujuku_v104-main-window .acu-window-btn,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn,
        html body #shujuku_v104-visualizer-window .acu-window-btn,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-btn {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
          border: 1px solid ${t.border} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn:hover,
        html body #shujuku_v104-main-window .acu-window-btn:hover,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn:hover,
        html body #shujuku_v104-visualizer-window .acu-window-btn:hover,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-btn:hover {
          background: ${t.btnHover} !important;
          color: ${t.textMain} !important;
        }
        html body #shujuku_v104-popup.auto-card-updater-popup .acu-window-btn.close:hover,
        html body [id^="shujuku"][id$="-popup"].auto-card-updater-popup .acu-window-btn.close:hover,
        html body #shujuku_v104-main-window .acu-window-btn.close:hover,
        html body [id^="shujuku"][id$="-main-window"] .acu-window-btn.close:hover,
        html body #shujuku_v104-visualizer-window .acu-window-btn.close:hover,
        html body [id^="shujuku"][id$="-visualizer-window"] .acu-window-btn.close:hover {
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

        /* 可视化编辑器 - 布局容器 */
        /* Header */
        #acu-visualizer-content .acu-vis-header {
          background-color: ${t.bgNav} !important;
          background: ${t.bgNav} !important;
          border-bottom: 1px solid ${t.border} !important;
          color: ${t.textMain} !important;
        }

        /* Content Area */
        #acu-visualizer-content .acu-vis-content {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
        }

        /* Sidebar */
        #acu-visualizer-content .acu-vis-sidebar {
          background-color: ${t.bgNav} !important;
          background: ${t.bgNav} !important;
          border-right: 1px solid ${t.border} !important;
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
        }

        #acu-visualizer-content .acu-vis-actions {
          color: ${t.textSub} !important;
        }

        /* 可视化编辑器 - 数据卡片 */
        /* Card Grid Layout */
        #acu-visualizer-content .acu-card-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
          gap: 16px !important;
          padding: 16px !important;
        }

        /* Data Card Container */
        #acu-visualizer-content .acu-data-card {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          border: 1px solid ${t.border} !important;
          border-radius: 10px !important;
          /* 修复：允许卡片内容垂直滚动，而非截断 */
          overflow: visible !important;
          overflow-y: auto !important;
          max-height: 70vh !important;
          display: flex !important;
          flex-direction: column !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        #acu-visualizer-content .acu-data-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25) !important;
          border-color: ${t.btnActiveBg} !important;
        }

        /* Add Row Card - 覆盖内联样式 */
        #acu-visualizer-content #acu-vis-add-row,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row {
          background: ${t.bgPanel} !important;
          background-color: ${t.bgPanel} !important;
          border: 2px dashed ${t.accent} !important;
          border-color: ${t.accent} !important;
        }
        #acu-visualizer-content #acu-vis-add-row i,
        #acu-visualizer-content #acu-vis-add-row div,
        #acu-visualizer-content #acu-vis-add-row i.fa-solid,
        #acu-visualizer-content #acu-vis-add-row i.fa-plus,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > i,
        #acu-visualizer-content .acu-data-card#acu-vis-add-row > div,
        #acu-vis-add-row i[style],
        #acu-vis-add-row div[style] {
          color: ${t.accent} !important;
        }
        #acu-visualizer-content #acu-vis-add-row:hover {
          background: ${t.btnBg} !important;
          background-color: ${t.btnBg} !important;
          border-color: ${t.btnActiveBg} !important;
        }
        #acu-visualizer-content #acu-vis-add-row:hover i,
        #acu-visualizer-content #acu-vis-add-row:hover div,
        #acu-vis-add-row:hover i[style],
        #acu-vis-add-row:hover div[style] {
          color: ${t.btnActiveBg} !important;
        }

        /* Card Header */
        #acu-visualizer-content .acu-card-header {
          background-color: ${t.btnActiveBg} !important;
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          padding: 12px 16px !important;
          font-weight: 600 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-bottom: 1px solid ${t.border} !important;
        }

        /* Card Body */
        #acu-visualizer-content .acu-card-body {
          background-color: ${t.bgPanel} !important;
          background: ${t.bgPanel} !important;
          padding: 16px !important;
          flex: 1 !important;
          color: ${t.textMain} !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
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
          transition: all 0.2s ease !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          min-width: unset !important;
          min-height: unset !important;
        }

        #acu-visualizer-content .acu-mode-btn:hover {
          background: ${t.btnBg} !important;
          color: ${t.textMain} !important;
        }

        /* Mode Button (active) */
        #acu-visualizer-content .acu-mode-btn.active {
          background: ${t.btnActiveBg} !important;
          color: ${t.btnActiveText} !important;
          border-color: ${t.btnActiveBg} !important;
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
        }

        #acu-visualizer-content .acu-btn-primary:hover {
          filter: brightness(1.1) !important;
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
        }

        #acu-visualizer-content .acu-btn-secondary:hover {
          background: ${t.btnHover} !important;
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
          border-radius: 4px !important;
          width: 100% !important;
        }

        #acu-visualizer-content .acu-form-input:focus,
        #acu-visualizer-content .acu-form-textarea:focus {
          border-color: ${t.accent} !important;
          outline: none !important;
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
            padding: 8px !important;
            gap: 8px !important;
          }

          #acu-visualizer-content .acu-mode-switch {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-mode-btn {
            flex: 1 !important;
            text-align: center !important;
            padding: 8px 6px !important;
          }

          #acu-visualizer-content .acu-vis-actions {
            width: 100% !important;
            justify-content: center !important;
          }

          #acu-visualizer-content .acu-btn-primary,
          #acu-visualizer-content .acu-btn-secondary {
            flex: 1 !important;
            text-align: center !important;
            padding: 8px 10px !important;
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
            padding: 10px !important;
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
