import { useEffect } from "react";
import { IconX } from "./icons";

/**
 * Bottom sheet in Handover's style. Rendered only while open so closed sheets
 * leave nothing in the page.
 */
export default function Sheet({ open, onClose, title, sub, children, footer, label }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = e => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={label ?? (typeof title === "string" ? title : undefined)}>
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative overflow-hidden w-full max-w-lg max-h-[92dvh] flex flex-col bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl dark:shadow-black/40 animate-sheet-up motion-reduce:animate-none">
        <div className="shrink-0 mx-auto mt-2 mb-1 h-4 w-full flex items-center justify-center" aria-hidden="true">
          <div className="h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
        {(title || sub) && (
          <div className="shrink-0 px-5 pb-3 flex items-start gap-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1 min-w-0">
              {title && <h2 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">{title}</h2>}
              {sub && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close"
              className="w-9 h-9 shrink-0 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 flex items-center justify-center active:scale-95">
              <IconX />
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 space-y-5">{children}</div>
        {footer && (
          <div className="shrink-0 px-5 pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
