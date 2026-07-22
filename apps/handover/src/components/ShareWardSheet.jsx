import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { buildHandoverUrl } from "../utils/payload";
import { totalBeds } from "../utils/wardLayouts";
import { bottomSheetTransform, useBottomSheetSwipe } from "../utils/useBottomSheetSwipe";
import SheetDragHandle, { SheetSafeBottom } from "./SheetDragHandle";
import { PRIMARY_BTN_COMPACT, safeBottom } from "../utils/screenLayout";
import { TYPE_CAPTION, TYPE_OVERLINE } from "../utils/typography";

const QR_TOO_LARGE = "Too much for one QR. Copy the link instead, or share fewer wards.";

function bedsInLayouts(layouts) {
  return Object.values(layouts || {}).reduce((n, layout) => n + totalBeds(layout), 0);
}

export default function ShareWardSheet({ open, layouts, onClose }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [copied, setCopied] = useState(false);
  const closingRef = useRef(false);

  const wardNames = useMemo(() => Object.keys(layouts || {}), [layouts]);

  const url = useMemo(() => {
    if (!open || wardNames.length === 0) return null;
    return buildHandoverUrl([], layouts);
  }, [open, layouts, wardNames.length]);

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
          setQrError(QR_TOO_LARGE);
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
    const title = wardNames.length === 1
      ? `${wardNames[0]} bed setup`
      : `${wardNames.length} ward layouts`;
    const text = wardNames.length === 1
      ? `Bed layout for ${wardNames[0]}`
      : `Bed layouts: ${wardNames.join(", ")}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
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

  const bedCount = bedsInLayouts(layouts);
  const multi = wardNames.length > 1;

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
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {multi ? `${wardNames.length} wards` : wardNames[0]}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bedCount} bed{bedCount === 1 ? "" : "s"} · no jobs, layout only
            </p>
            {multi && (
              <p className={`${TYPE_CAPTION} mt-2 leading-snug`}>
                {wardNames.join(" · ")}
              </p>
            )}

            <div className="flex justify-center py-4">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Ward setup QR code"
                  className="w-full max-w-[min(72vw,14rem)] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white p-3 object-contain"
                />
              )}
              {!qrDataUrl && qrError && (
                <p className={`${TYPE_CAPTION} text-red-600 dark:text-red-400 text-center leading-snug px-2`}>
                  {qrError}
                </p>
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
