import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildHandoverUrl } from "../utils/payload";

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${on ? "bg-amber-600" : "bg-gray-300 dark:bg-gray-700"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function HandoverScreen({ jobs, onBack, onFinish }) {
  const [includeCompleted, setIncludeCompleted] = useState(false);
  const [keepCopy, setKeepCopy] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [copied, setCopied] = useState(false);

  const openJobs = jobs.filter((j) => !j.done);
  const jobsToSend = includeCompleted ? jobs : openJobs;
  const url = jobsToSend.length ? buildHandoverUrl(jobsToSend) : null;

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: 260 })
      .then((dataUrl) => { if (!cancelled) { setQrDataUrl(dataUrl); setQrError(null); } })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError("That's too much for one QR code. Clear some completed jobs first, or use Share instead.");
        }
      });
    return () => { cancelled = true; };
  }, [url]);

  const share = async () => {
    if (!url) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Handover", text: `${jobsToSend.length} jobs to hand over`, url }); }
      catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable */ }
    }
  };

  const finish = () => onFinish({ clear: !keepCopy });

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 px-5">
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400" aria-label="Back to home">← Home</button>
        <div className="font-extrabold text-lg text-gray-900 dark:text-white">
          Handover<span className="text-amber-600">.</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="font-mono text-4xl font-extrabold tabular-nums text-gray-900 dark:text-white">
          {jobsToSend.length}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          job{jobsToSend.length === 1 ? "" : "s"} to pass on
          {openJobs.filter((j) => j.priority === "urgent").length > 0 &&
            ` · ${openJobs.filter((j) => j.priority === "urgent").length} urgent`}
        </div>
      </div>

      <div className="flex justify-center mb-4 min-h-[280px] items-center">
        {jobsToSend.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center px-8">
            Nothing to hand over. Add a job first, or switch on completed jobs below.
          </p>
        )}
        {jobsToSend.length > 0 && qrDataUrl && (
          <img src={qrDataUrl} alt="Handover QR code" className="rounded-xl border border-gray-200 dark:border-gray-800" />
        )}
        {jobsToSend.length > 0 && qrError && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center px-8">{qrError}</p>
        )}
      </div>

      {jobsToSend.length > 0 && (
        <button
          onClick={share}
          className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold mb-6 active:scale-[0.98] transition-all"
        >
          {copied ? "Link copied" : navigator.share ? "Share link instead" : "Copy link instead"}
        </button>
      )}

      <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Include completed jobs</div>
          <div className="text-xs text-gray-400 dark:text-gray-600">Usually left off</div>
        </div>
        <Toggle on={includeCompleted} onClick={() => setIncludeCompleted((v) => !v)} />
      </div>
      <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800 mb-8">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Keep a copy on this phone</div>
          <div className="text-xs text-gray-400 dark:text-gray-600">Off clears your list after handover</div>
        </div>
        <Toggle on={keepCopy} onClick={() => setKeepCopy((v) => !v)} />
      </div>
      </div>

      <div className="shrink-0 pt-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <button
          onClick={finish}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-95 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}
