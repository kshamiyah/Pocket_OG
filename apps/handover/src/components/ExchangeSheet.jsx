import { useRef, useState } from "react";
import { ExchangeArrowIcon } from "./HandoverMark";
import { bottomSheetTransform, sheetMotionClass, useBottomSheetSwipe, useSheetEntered } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BODY, TYPE_CAPTION, TYPE_DISMISS, TYPE_OVERLINE } from "../utils/typography";

const ROW = "w-full text-left px-5 py-3.5 active:bg-gray-50 dark:active:bg-gray-900";

export default function ExchangeSheet({
  open, onClose, onScan, onShareJobs, onEndShift,
}) {
  const [entered, setEntered] = useSheetEntered(open);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);

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

  const handoverDetail = "Shift keeps running. Jobs stay on your list unless you remove them.";

  const endShiftDetail = "See your shift summary, hand over if needed, then clear your list";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={() => requestClose()}
        className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 ${sheetMotionClass({ dragging })}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl">
          <SheetDragHandle handleProps={handleProps} />
          <p className={`px-5 pt-2 pb-3 flex items-center gap-1.5 ${TYPE_OVERLINE}`}>
            <ExchangeArrowIcon className="w-3.5 h-3.5 text-claude-600" />
            Exchange
          </p>
          <button
            type="button"
            onClick={() => requestClose(onScan)}
            className={`${ROW} border-b border-gray-100 dark:border-gray-900`}
          >
            <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
              Take over
            </span>
            <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
              Scan or paste a colleague&apos;s code to add their jobs
            </span>
          </button>
          <button
            type="button"
            onClick={() => requestClose(onShareJobs)}
            className={`${ROW} border-b border-gray-100 dark:border-gray-900`}
          >
            <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
              Hand over
            </span>
            <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
              {handoverDetail}
            </span>
          </button>
          <button
            type="button"
            onClick={() => requestClose(onEndShift)}
            className={ROW}
          >
            <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
              End shift
            </span>
            <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
              {endShiftDetail}
            </span>
          </button>
          <button type="button" onClick={() => requestClose()} className={`w-full py-3 ${TYPE_DISMISS}`}>
            Cancel
          </button>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
