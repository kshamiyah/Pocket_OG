import { useEffect, useRef, useState } from "react";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BODY, TYPE_CAPTION, TYPE_DISMISS, TYPE_OVERLINE, TYPE_UI } from "../utils/typography";

const ROW = "w-full text-left px-5 py-3.5 active:bg-gray-50 dark:active:bg-gray-900";

export default function WardActionsSheet({
  open,
  ward,
  jobsOnWard,
  onClose,
  onEdit,
  onRemove,
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const requestClose = (after) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      setConfirming(false);
      onClose();
      after?.();
    }, 280);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(() => requestClose());

  if ((!open && !closing) || !ward) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
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
          {confirming ? (
            <div className="px-5 pt-2 pb-4">
              <p className={`${TYPE_OVERLINE} mb-2`}>Remove ward</p>
              <p className={`${TYPE_CAPTION} mb-4 leading-snug`}>
                Remove {ward}?
                {jobsOnWard > 0
                  ? ` ${jobsOnWard} job${jobsOnWard === 1 ? "" : "s"} will lose their ward tag.`
                  : " Layout and bed notes for this ward will be deleted."}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className={`flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 ${TYPE_UI} text-gray-600 dark:text-gray-300`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => requestClose(onRemove)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"
                >
                  Delete ward
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`px-5 pt-2 pb-3 ${TYPE_OVERLINE} truncate`}>{ward}</p>
              <button
                type="button"
                onClick={() => requestClose(onEdit)}
                className={`${ROW} border-b border-gray-100 dark:border-gray-900`}
              >
                <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
                  Edit beds
                </span>
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className={ROW}
              >
                <span className={`${TYPE_BODY} font-semibold text-red-600 dark:text-red-400 block`}>
                  Remove ward
                </span>
              </button>
              <button type="button" onClick={() => requestClose()} className={`w-full py-3 ${TYPE_DISMISS}`}>
                Cancel
              </button>
            </>
          )}
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
