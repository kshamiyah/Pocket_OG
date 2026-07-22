import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { buildHandoverUrl } from "../utils/payload";
import { totalBeds } from "../utils/wardLayouts";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { PRIMARY_BTN_COMPACT, safeBottom } from "../utils/screenLayout";
import { TYPE_CAPTION, TYPE_OVERLINE } from "../utils/typography";

export default function ShareWardSheet({ open, wardName, layout, onClose }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [copied, setCopied] = useState(false);
  const closingRef = useRef(false);

  const url = useMemo(() => {
    if (!open || !wardName || !layout) return null;
    return buildHandoverUrl([], { [wardName]: layout });
  }, [open, wardName, layout]);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: 280 })
      .then((dataUrl) => { if (!cancelled) { setQrDataUrl(dataUrl); setQrError(null); } })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError("Too much for one QR. Copy the link instead.");
        }
      });
    return () => { cancelled = true; };
  }, [url]);

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setEntered(false);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      onClose();
    }, 280);
  };

  const { dragY, dragging, handleProps } = useBottomSheetSwipe(requestClose);

  const share = async () => {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${wardName} bed setup`, text: `Bed layout for ${wardName}`, url });
      } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* unavailable */ }
    }
  };

  if (!open && !closing) return null;

  const bedCount = totalBeds(layout);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close share sheet"
        onClick={requestClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          entered && !closing ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 ${dragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: bottomSheetTransform({ entered, closing, dragY }) }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 shadow-2xl max-h-[min(92dvh,100%)] flex flex-col overflow-hidden">
          <SheetDragHandle handleProps={handleProps} />
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden touch-pan-y px-5 pt-3 pb-4">
            <p className={TYPE_OVERLINE}>Share ward setup</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{wardName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bedCount} bed{bedCount === 1 ? "" : "s"} · no jobs, layout only
            </p>

            <div className="flex justify-center py-4">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${wardName} bed setup`}
                  className="w-full max-w-[min(72vw,14rem)] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white p-3 object-contain"
                />
              )}
              {!qrDataUrl && qrError && (
                <p className={`${TYPE_CAPTION} text-red-600 dark:text-red-400 text-center`}>{qrError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={share}
              disabled={!url}
              className="w-full py-2.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 active:scale-[0.98] transition-all"
            >
              {copied ? "Link copied" : navigator.share ? "Share link" : "Copy link"}
            </button>
          </div>
          <div
            className="shrink-0 px-5 pt-2 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950"
            style={safeBottom("0.5rem")}
          >
            <button type="button" onClick={requestClose} className={`w-full ${PRIMARY_BTN_COMPACT}`}>
              Close
            </button>
          </div>
        </div>
        <SheetSafeBottom />
      </div>
    </div>
  );
}
