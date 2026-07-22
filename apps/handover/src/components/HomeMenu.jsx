import { useEffect, useRef, useState } from "react";
import { DarkModeToggleRow } from "./DarkModeToggle";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BODY, TYPE_DISMISS, TYPE_OVERLINE } from "../utils/typography";

const ROW = `w-full text-left px-5 py-3.5 ${TYPE_BODY} font-semibold active:bg-gray-50 dark:active:bg-gray-900`;

export default function HomeMenu({
  open, onClose, shiftLabel, onManageWards, onEditProfile, onAbout, onEndShift,
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

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(() => requestClose());

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
        className={`relative z-10 ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl">
          <SheetDragHandle handleProps={handleProps} />
          <p className={`px-5 pt-2 pb-3 ${TYPE_OVERLINE}`}>
            {shiftLabel} shift
          </p>
          <button type="button" onClick={() => requestClose(onManageWards)} className={ROW}>
            Manage wards
          </button>
          <button type="button" onClick={() => requestClose(onEditProfile)} className={ROW}>
            Profile
          </button>
          <button type="button" onClick={() => requestClose(onAbout)} className={ROW}>
            About
          </button>
          <button type="button" onClick={() => requestClose(onEndShift)} className={ROW}>
            End shift
          </button>
          <div className="border-t border-gray-100 dark:border-gray-900">
            <DarkModeToggleRow />
          </div>
          <button type="button" onClick={() => requestClose()} className={`w-full py-3 ${TYPE_DISMISS}`}>
            Cancel
          </button>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
