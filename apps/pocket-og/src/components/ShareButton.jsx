import { useState } from "react";

// Reusable share control. Uses the Web Share API (native share sheet on mobile)
// with a copy-to-clipboard fallback + "Link copied" toast on desktop/unsupported.
export default function ShareButton({ title, text, url, label = "Share", dark = false }) {
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const payload = { title, text, url: url || (typeof window !== "undefined" ? window.location.href : "") };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(payload.url ? `${text}\n${payload.url}` : text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch { /* user dismissed the share sheet — ignore */ }
  };

  return (
    <div className="relative shrink-0">
      <button
        onClick={doShare}
        aria-label={label}
        className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
          dark
            ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.368-2.684 3 3 0 00-5.368 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      {copied && (
        <span className="absolute top-full mt-1 right-0 z-50 px-2.5 py-1 rounded-full bg-gray-900 text-white text-[11px] font-medium shadow-lg whitespace-nowrap">
          Link copied
        </span>
      )}
    </div>
  );
}
