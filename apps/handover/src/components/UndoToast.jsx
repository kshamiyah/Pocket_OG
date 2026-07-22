// A quiet, self-dismissing confirmation with an escape hatch — fast actions
// (mark done, delete) shouldn't need a confirm dialog, but they should be
// reversible for a few seconds after the fact.
export default function UndoToast({ message, onUndo }) {
  if (!message) return null;
  return (
    <div
      key={message}
      className="fixed left-1/2 z-40 bg-claude-600 text-white rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 shadow-lg text-sm font-semibold animate-toast-enter motion-reduce:animate-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }}
    >
      {message}
      <button type="button" onClick={onUndo} className="text-white/90 font-bold px-2.5 py-1 rounded-full underline underline-offset-2">
        Undo
      </button>
    </div>
  );
}
