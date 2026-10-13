import { useState } from "react";
import BottomSheet from "./BottomSheet";

// In-app popup for a cited source page (an image), so checking a citation
// does not leave the app. Sits above the flowchart player (z-50).
export default function SourceViewer({ source, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  // Keep showing the last page while the sheet animates closed.
  const [shown, setShown] = useState(source);
  if (source && source !== shown) {
    setShown(source);
    setZoomed(false);
  }

  return (
    <BottomSheet
      open={!!source}
      onClose={onClose}
      zIndex={60}
      align="responsive"
      maxWidthClass="max-w-3xl"
      sheetClassName="max-h-[92dvh] sm:max-h-[90dvh]"
    >
      {shown && (
        <>
          <div className="shrink-0 flex items-center gap-2 px-4 pb-3 sm:pt-4 border-b border-gray-100">
            <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="flex-1 min-w-0 truncate text-sm font-semibold text-gray-900">{shown.label}</p>
            <button
              type="button"
              onClick={() => setZoomed(z => !z)}
              aria-pressed={zoomed}
              className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {zoomed ? "Fit width" : "Zoom"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close source"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-auto bg-gray-50">
            <img
              src={shown.href}
              alt={shown.label}
              onClick={() => setZoomed(z => !z)}
              className={zoomed
                ? "block max-w-none w-[200%] sm:w-[160%] cursor-zoom-out"
                : "block w-full h-auto cursor-zoom-in"}
            />
          </div>
        </>
      )}
    </BottomSheet>
  );
}
