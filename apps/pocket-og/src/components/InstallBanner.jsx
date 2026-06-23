import { useState, useEffect } from "react";

const VISITS_KEY = "pocketog_install_visits";
const DISMISSED_KEY = "pocketog_install_dismissed";
const MAX_VISITS = 3;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const visits = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10) + 1;
    localStorage.setItem(VISITS_KEY, String(visits));

    if (visits <= MAX_VISITS) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 overflow-hidden">
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
          <svg className="w-4.5 h-4.5 text-white" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">Add to Home Screen</p>
          <p className="text-xs text-gray-500 mt-0.5">Opens like an app — no browser bar</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs font-semibold text-purple-600 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors"
          >
            {expanded ? "Hide" : "How?"}
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-purple-200 transition-colors"
          >
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-purple-100 pt-3">
          {/* iOS */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">iPhone / iPad (Safari)</p>
            <ol className="space-y-1.5">
              {[
                "Open this page in Safari",
                <>Tap the <span className="inline-flex items-center gap-0.5 font-semibold text-gray-700">Share <ShareIcon /></span> button at the bottom of the screen</>,
                <>Scroll down and tap <span className="font-semibold text-gray-700">Add to Home Screen</span></>,
                <>Tap <span className="font-semibold text-gray-700">Add</span></>,
              ].map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Android */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Android (Chrome)</p>
            <ol className="space-y-1.5">
              {[
                "Open this page in Chrome",
                <>Tap the <span className="font-semibold text-gray-700">⋮</span> menu in the top-right corner</>,
                <>Tap <span className="font-semibold text-gray-700">Add to Home screen</span></>,
                <>Tap <span className="font-semibold text-gray-700">Add</span></>,
              ].map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}
