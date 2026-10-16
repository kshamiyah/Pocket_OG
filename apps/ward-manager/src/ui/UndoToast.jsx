// Quiet, self-dismissing confirmation with an escape hatch (Handover's UndoToast).
// Fast actions do not need a confirm dialog, but they are reversible for a few seconds.
export default function UndoToast({ message, onUndo, bottom = "calc(env(safe-area-inset-bottom) + 5.75rem)", top = null }) {
  if (!message) return null;
  return (
    <div key={message} role="status" aria-live="polite"
      className="fixed left-1/2 z-[60] max-w-[calc(100%-2rem)] bg-claude-600 text-white rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 shadow-lg text-sm font-semibold animate-toast-enter"
      style={top ? { top, transform: "translateX(-50%)" } : { bottom, transform: "translateX(-50%)" }}>
      <span className="truncate">{message}</span>
      {onUndo && (
        <button type="button" onClick={onUndo} className="shrink-0 text-white/90 font-bold px-2.5 py-1 rounded-full underline underline-offset-2">
          Undo
        </button>
      )}
    </div>
  );
}
