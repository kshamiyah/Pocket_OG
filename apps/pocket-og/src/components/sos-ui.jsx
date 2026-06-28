/** Shared SOS emergency UI — PPH, cardiac arrest, shoulder dystocia. */

export const SOS_SAFE_TOP = "max(12px, env(safe-area-inset-top))";
export const SOS_SAFE_BOTTOM = "max(16px, env(safe-area-inset-bottom))";

export function fmtMmSs(ms) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function SosShell({ children, className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-gray-950 text-white overflow-hidden w-full max-w-full ${className}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {children}
    </div>
  );
}

export function SosCloseButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 bg-gray-900 shrink-0 ${className}`}
      aria-label="Exit"
    >
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export function SosSetupBadge({ label, pulse = true }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {pulse && <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />}
      <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 truncate">{label}</span>
    </div>
  );
}

/** Dark bottom-sheet exit confirm — shared across SOS protocols. */
export function SosExitConfirm({
  active,
  onConfirm,
  onCancel,
  activeTitle = "Exit simulator?",
  inactiveTitle = "Exit without starting?",
  activeBody = "This discards the session without a stand-down record. If the emergency is resolved, use Stand down instead.",
  inactiveBody = "Opened by mistake? No session will be saved.",
  confirmLabel = "Exit",
  zClass = "z-[60]",
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/80 ${zClass} flex items-end p-4`}
      style={{ paddingBottom: SOS_SAFE_BOTTOM }}
      onClick={onCancel}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
        <p className="text-white font-bold mb-1">{active ? activeTitle : inactiveTitle}</p>
        <p className="text-gray-500 text-sm mb-4">{active ? activeBody : inactiveBody}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 font-medium py-2.5 rounded-lg text-sm">Stay</button>
          <button type="button" onClick={onConfirm} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function SosStickyFooter({ children, className = "" }) {
  return (
    <div
      className={`flex-shrink-0 px-4 pt-3 border-t border-gray-800 bg-gray-950 ${className}`}
      style={{ paddingBottom: SOS_SAFE_BOTTOM }}
    >
      {children}
    </div>
  );
}
