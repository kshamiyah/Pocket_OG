import { useEffect, useMemo, useRef, useState } from "react";
import { ExchangeArrowIcon } from "./HandoverMark";
import { hasLayout, totalBeds } from "../utils/wardLayouts";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { PRIMARY_BTN_COMPACT, SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_BODY, TYPE_CAPTION, TYPE_DISMISS, TYPE_OVERLINE, TYPE_UI } from "../utils/typography";

const ROW = "w-full text-left px-5 py-3.5 active:bg-gray-50 dark:active:bg-gray-900";

function isShareable(wardLayouts, ward) {
  return hasLayout(wardLayouts, ward) && totalBeds(wardLayouts[ward]) > 0;
}

export default function WardSetupExchangeSheet({
  open,
  onClose,
  wardNames,
  wardLayouts,
  onReceive,
  onShare,
}) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState("menu");
  const [selected, setSelected] = useState(() => new Set());
  const closingRef = useRef(false);

  const shareableWards = useMemo(
    () => wardNames.filter((w) => isShareable(wardLayouts, w)),
    [wardNames, wardLayouts],
  );

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
      setStep("menu");
      onClose();
      after?.();
    }, 280);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(() => requestClose());

  if (!open && !closing) return null;

  const toggle = (ward) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ward)) next.delete(ward);
      else next.add(ward);
      return next;
    });
  };

  const confirmShare = () => {
    const layouts = {};
    for (const ward of selected) {
      if (isShareable(wardLayouts, ward)) layouts[ward] = wardLayouts[ward];
    }
    if (Object.keys(layouts).length === 0) return;
    requestClose(() => onShare(layouts));
  };

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
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl max-h-[min(85dvh,100%)] flex flex-col overflow-hidden">
          <SheetDragHandle handleProps={handleProps} />

          {step === "menu" ? (
            <>
              <p className={`px-5 pt-2 pb-3 flex items-center gap-1.5 ${TYPE_OVERLINE}`}>
                <ExchangeArrowIcon className="w-3.5 h-3.5 text-claude-600" />
                Exchange ward setup
              </p>
              <button
                type="button"
                onClick={() => {
                  if (shareableWards.length === 0) return;
                  setSelected(new Set(shareableWards));
                  setStep("share");
                }}
                disabled={shareableWards.length === 0}
                className={`${ROW} border-b border-gray-100 dark:border-gray-900 disabled:opacity-50`}
              >
                <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
                  Share ward setup
                </span>
                <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
                  {shareableWards.length > 0
                    ? "Send bed layouts as a QR or link (one or more wards)"
                    : "Set up at least one ward with beds before sharing"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => requestClose(onReceive)}
                className={ROW}
              >
                <span className={`${TYPE_BODY} font-semibold text-gray-900 dark:text-white block`}>
                  Receive ward setup
                </span>
                <span className={`${TYPE_CAPTION} block mt-0.5 leading-snug`}>
                  Scan or paste a colleague&apos;s code to import their bed layouts
                </span>
              </button>
              <button type="button" onClick={() => requestClose()} className={`w-full py-3 ${TYPE_DISMISS}`}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="px-5 pt-2 pb-2 shrink-0">
                <p className={TYPE_OVERLINE}>Share ward setup</p>
                <p className={`${TYPE_CAPTION} mt-1`}>Choose which wards to include</p>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-2 touch-pan-y">
                <div className="flex flex-col gap-1.5">
                  {shareableWards.map((ward) => {
                    const count = totalBeds(wardLayouts[ward]);
                    const on = selected.has(ward);
                    return (
                      <button
                        key={ward}
                        type="button"
                        onClick={() => toggle(ward)}
                        className={`w-full text-left px-3 py-3 rounded-xl border flex items-center gap-3 transition-colors ${
                          on ? SELECTED_CHIP : "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${
                            on ? "bg-white/20 border-white" : "border-gray-400 dark:border-gray-600"
                          }`}
                          aria-hidden="true"
                        >
                          {on && <span className="text-white text-[10px]">✓</span>}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`${TYPE_UI} block truncate`}>{ward}</span>
                          <span className={`${TYPE_CAPTION} block ${on ? "text-white/80" : ""}`}>
                            {count} bed{count === 1 ? "" : "s"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="shrink-0 px-5 pt-2 pb-2 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-900">
                <button
                  type="button"
                  onClick={confirmShare}
                  disabled={selected.size === 0}
                  className={`${PRIMARY_BTN_COMPACT} disabled:opacity-50`}
                >
                  Share {selected.size || ""} ward{selected.size === 1 ? "" : "s"}
                </button>
                <button type="button" onClick={() => setStep("menu")} className={`py-2 ${TYPE_DISMISS}`}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
