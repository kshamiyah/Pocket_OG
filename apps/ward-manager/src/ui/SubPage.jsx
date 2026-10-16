import { useEffect } from "react";
import { BTN, BTN_PRIMARY } from "./styles";
import { IconBack } from "./icons";

/**
 * A page pushed in over a sheet at the same size, like going into a tab.
 * It fills the sheet panel (the nearest positioned box) and slides in from
 * the right; Done or back slides it out. Escape closes only this page.
 */
export default function SubPage({ title, sub, backLabel, onClose, closing, onClosed, children, headerExtra }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <div role="dialog" aria-label={title}
      onAnimationEnd={e => { if (closing && e.target === e.currentTarget) onClosed(); }}
      className={`absolute inset-0 z-10 bg-white dark:bg-gray-950 flex flex-col ${closing ? "animate-push-out" : "animate-push-in"}`}>
      <div className="shrink-0 border-b border-gray-200 dark:border-gray-800 pt-3">
        <div className="px-5 pb-3 space-y-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} aria-label={`Back to ${backLabel}`}
              className="min-h-11 -ml-2 pl-1 pr-2 rounded-full flex items-center gap-0.5 text-sm font-semibold text-claude-700 dark:text-claude-400 active:scale-95"><IconBack /> {backLabel}</button>
            <h2 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white text-center pr-16">{title}</h2>
          </div>
          {sub && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">{sub}</p>}
          {headerExtra}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="px-5 py-4 space-y-5">{children}</div>
      </div>
      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
        <div className="px-5 pt-3">
          <button type="button" onClick={onClose} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>Done</button>
        </div>
      </div>
    </div>
  );
}
