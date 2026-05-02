const DB_TOAST_MUTE_STYLE_ID = 'dice-db-toast-mute';

const collectDatabaseToastDocuments = (): Document[] => {
  const docs: Document[] = [];
  const tryAddDoc = (targetWindow: Window | null | undefined) => {
    try {
      const doc = targetWindow?.document;
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
