import { useEffect, useRef, useState } from "react";
import { DarkModeToggleRow } from "./DarkModeToggle";

const ROW = "w-full text-left px-5 py-3.5 text-base font-bold text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-900";

export default function HomeMenu({
  open, onClose, shiftLabel, onManageWards, onEditProfile, onEndShift,
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = (after) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      onClose();
      after?.();
    }, 280);
  };

  if (!open && !closing) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => requestClose()}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out ${
          entered && !closing ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
      >
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
        <p className="px-5 pt-2 pb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          {shiftLabel} shift
        </p>
        <button type="button" onClick={() => requestClose(onManageWards)} className={ROW}>
          Manage wards
        </button>
        <button type="button" onClick={() => requestClose(onEditProfile)} className={ROW}>
          Profile
        </button>
        <button type="button" onClick={() => requestClose(onEndShift)} className={ROW}>
          End shift
        </button>
        <div className="border-t border-gray-100 dark:border-gray-900">
          <DarkModeToggleRow />
        </div>
        <button type="button" onClick={() => requestClose()} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
}
