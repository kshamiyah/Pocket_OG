import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { decodeHandoverPayload, extractHandoverCode } from "../utils/payload";

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
      const jobs = decodeHandoverPayload(code);
      onScanned(jobs);
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
      } catch {
        setError("Couldn't access the camera. Paste the handover link instead.");
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
    <div
      className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-5"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-500 text-xl leading-none">←</button>
        <div className="font-extrabold text-lg text-gray-900 dark:text-white">
          Handover<span className="text-amber-600">.</span>
        </div>
      </div>

      <div className="relative flex-1 rounded-2xl overflow-hidden bg-gray-900 mb-5 min-h-[320px] flex items-center justify-center">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        {!cameraReady && !error && (
          <p className="relative text-gray-400 text-sm px-8 text-center">Starting camera…</p>
        )}
        {cameraReady && (
          <div className="absolute inset-6 border-2 border-amber-400/80 rounded-2xl pointer-events-none" />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-3 text-center">{error}</p>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
        Point your camera at the outgoing doctor's handover code
      </p>

      <div className="flex items-center gap-2 mt-auto">
        <input
          type="text"
          value={pastedLink}
          onChange={(e) => setPastedLink(e.target.value)}
          placeholder="Or paste the handover link"
          className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
        <button
          onClick={() => pastedLink.trim() && handleCode(pastedLink.trim())}
          disabled={!pastedLink.trim()}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold active:scale-95 transition-all"
        >
          Go
        </button>
      </div>
    </div>
  );
}
