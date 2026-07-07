// A quiet, self-dismissing confirmation with an escape hatch — fast actions
// (mark done, delete) shouldn't need a confirm dialog, but they should be
// reversible for a few seconds after the fact.
export default function UndoToast({ message, onUndo }) {
  if (!message) return null;
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-40 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 shadow-lg text-sm font-semibold"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }}
    >
      {message}
      <button onClick={onUndo} className="text-amber-400 dark:text-amber-600 font-bold px-2.5 py-1 rounded-full">
        Undo
      </button>
    </div>
  );
}
