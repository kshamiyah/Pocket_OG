import { useState, useEffect } from "react";

const VISITS_KEY = "pocketog_install_visits";
const DISMISSED_KEY = "pocketog_install_dismissed";
const MIN_VISITS = 2;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function getPlatform() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

const IOS_STEPS = [
  { title: "Tap Share", detail: "The square-with-arrow icon at the bottom of Safari" },
  { title: "Add to Home Screen", detail: "Scroll down in the share menu" },
  { title: "Tap Add", detail: "Pocket O&G opens full-screen like a native app" },
];

const ANDROID_STEPS = [
  { title: "Open the menu", detail: "Tap ⋮ in the top-right corner of Chrome" },
  { title: "Install app", detail: "Or \"Add to Home screen\" on some devices" },
  { title: "Confirm", detail: "Launch from your home screen anytime" },
];

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [platform] = useState(getPlatform);

  useEffect(() => {
    if (isStandalone()) return;

    const visits = Number(localStorage.getItem(VISITS_KEY) ?? 0) + 1;
    localStorage.setItem(VISITS_KEY, String(visits));

    if (localStorage.getItem(DISMISSED_KEY) === "true") return;
    if (visits < MIN_VISITS) return;

    // Effect must run to record the visit; revealing the banner here is intentional
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  const steps = platform === "android" ? ANDROID_STEPS : IOS_STEPS;
  const platformLabel = platform === "android" ? "Android" : "iPhone";

  return (
    <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 active:opacity-70 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 leading-snug">Add to Home Screen</p>
            <p className="text-[13px] text-gray-500 mt-0.5">Opens like an app — no browser bar</p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-3">
            {platform === "other" ? "On mobile Safari or Chrome" : `On ${platformLabel}`}
          </p>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {platform === "other" && (
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Open this site on your phone in Safari or Chrome for step-by-step instructions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
