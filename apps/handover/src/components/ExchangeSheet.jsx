import { useEffect, useRef, useState } from "react";
import { ExchangeArrowIcon } from "./HandoverMark";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { TYPE_BODY, TYPE_CAPTION, TYPE_DISMISS, TYPE_OVERLINE } from "../utils/typography";

const ROW = "w-full text-left px-5 py-3.5 active:bg-gray-50 dark:active:bg-gray-900";

export default function ExchangeSheet({
  open, onClose, openCount, urgentCount, onHandover, onScan,
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

  const handoverDetail = openCount > 0
    ? `Share open jobs as a QR or link${urgentCount > 0 ? ` · ${openCount} open, ${urgentCount} urgent` : ` · ${openCount} open`}`
    : "Share jobs as a QR or link, including completed if you choose";

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
        className={`relative z-10 ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl">
          <SheetDragHandle handleProps={handleProps} />
          <p className={`px-5 pt-2 pb-3 flex items-center gap-1.5 ${TYPE_OVERLINE}`}>
            <ExchangeArrowIcon className="w-3.5 h-3.5 text-claude-600" />
            Handover
          </p>
          <button
            type="button"
            onClick={() => requestClose(onHandover)}
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
            onClick={() => requestClose(onScan)}
            className={ROW}
          >
            <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
              Take over
            </span>
            <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
              Scan or paste a colleague&apos;s code to add their jobs to your list
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
