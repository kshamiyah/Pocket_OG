import { useEffect, useRef, useState } from "react";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { PRIMARY_BTN_COMPACT } from "../utils/screenLayout";
import { TYPE_CAPTION, TYPE_DISMISS, TYPE_OVERLINE } from "../utils/typography";

const FIELD =
  "w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

export default function AddWardSheet({ open, onClose, onAdd }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [value, setValue] = useState("");
  const closingRef = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => setEntered(true));
    const focusId = window.setTimeout(() => inputRef.current?.focus(), 320);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(focusId);
    };
  }, [open]);

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

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    requestClose(() => onAdd(trimmed));
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(() => requestClose());

  if (!open && !closing) return null;

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
          <div className="px-5 pt-2 pb-4">
            <p className={`${TYPE_OVERLINE} mb-1`}>New ward</p>
            <p className={`${TYPE_CAPTION} mb-4`}>Name the ward, then set up its beds</p>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Ward name"
              className={FIELD}
            />
            <button
              type="button"
              onClick={submit}
              disabled={!value.trim()}
              className={`${PRIMARY_BTN_COMPACT} w-full mt-3 disabled:opacity-50`}
            >
              Set up
            </button>
            <button type="button" onClick={() => requestClose()} className={`w-full py-3 ${TYPE_DISMISS}`}>
              Cancel
            </button>
          </div>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
