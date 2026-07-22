import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import HandoverMark from "./HandoverMark";
import { decodeHandoverPayload, extractHandoverCode } from "../utils/payload";
import { SCREEN, safeBottom, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_TITLE } from "../utils/typography";

export default function ScanScreen({ onBack, onScanned }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const rafRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [pastedLink, setPastedLink] = useState("");

  const handleCode = (raw) => {
    const code = extractHandoverCode(raw) ?? raw;
    try {
      const payload = decodeHandoverPayload(code);
      onScanned(payload);
    } catch (e) {
      setError(e.message || "Couldn't read that code. Try again.");
    }
  };

  useEffect(() => {
    let stream;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        tick();
      } catch (err) {
        if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
          setError("Camera access is off. Allow it in Settings, or paste the handover link below.");
        } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
          setError("No camera found. Paste the handover link below instead.");
        } else {
          setError("Couldn't start the camera. Paste the handover link below instead.");
        }
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(imageData.data, imageData.width, imageData.height);
        if (result?.data) {
          handleCode(result.data);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 px-0" style={safeTop()}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className={BACK_LINK} aria-label="Back to home">← Home</button>
          <HandoverMark className={TYPE_TITLE} />
        </div>
      </div>

      <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden bg-gray-900 my-1 flex items-center justify-center">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        {!cameraReady && !error && (
          <p className="relative text-gray-400 text-sm px-8 text-center">Starting camera…</p>
        )}
        {cameraReady && (
          <div className="absolute inset-4 border-2 border-claude-400/80 rounded-2xl pointer-events-none" />
        )}
      </div>

      {error && (
        <p className="shrink-0 text-sm text-red-600 dark:text-red-400 my-2 text-center">{error}</p>
      )}

      <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400 text-center my-2">
        Point your camera at your colleague&apos;s takeover code
      </p>

      <div className="shrink-0 flex items-center gap-2" style={safeBottom()}>
        <input
          type="text"
          value={pastedLink}
          onChange={(e) => setPastedLink(e.target.value)}
          placeholder="Or paste the handover link"
          className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
        />
        <button
          onClick={() => pastedLink.trim() && handleCode(pastedLink.trim())}
          disabled={!pastedLink.trim()}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold active:scale-95 transition-all"
        >
          Go
        </button>
      </div>
    </div>
  );
}
