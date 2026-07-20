import { useEffect, useRef, useState } from "react";
import TextSizeStepper from "./TextSizeStepper";

const TOOLBAR_BTN =
  "w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur border border-gray-200 shadow-sm rounded-full text-gray-500 hover:text-gray-700 hover:shadow-md active:scale-95 transition-all shrink-0";

export default function TextSizeToggle({ className = "" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label="Text size"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={TOOLBAR_BTN}
      >
        <span className="text-[13px] font-semibold leading-none tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Aa
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Text size"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 p-3 text-left"
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2.5">Text size</p>
          <TextSizeStepper />
        </div>
      )}
    </div>
  );
}
