import { useState, useEffect } from "react";
import BottomSheet from "./BottomSheet";

const STORAGE_KEY = "pocketog_disclaimer_v1";
const REMIND_EVERY_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

function shouldShowDisclaimer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  // Legacy one-time accept — treat as due for re-confirmation
  if (raw === "accepted") return true;
  const acceptedAt = Number(raw);
  if (!Number.isFinite(acceptedAt)) return true;
  return Date.now() - acceptedAt >= REMIND_EVERY_MS;
}

const POINTS = [
  {
    title: "Healthcare professionals only",
    detail: "Not for patient self-management or lay use.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    ),
  },
  {
    title: "Decision aid, not a substitute",
    detail: "Clinical responsibility stays with the treating clinician.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a45.008 45.008 0 01-9.562 0c-.483-.174-.711-.703-.589-1.202L18.75 4.97z" />
    ),
  },
  {
    title: "Follow local protocols",
    detail: "Dosing and pathways may differ from your trust's policies.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    ),
  },
  {
    title: "Check guideline dates",
    detail: "Content is summarised — verify against the source guideline.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    ),
  },
];

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldShowDisclaimer()) {
      setOpen(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  }

  return (
    <BottomSheet
      open={open}
      onClose={accept}
      dismissible={false}
      maxWidthClass="max-w-md"
      align="responsive"
      sheetClassName="max-h-[82vh]"
    >
      <div className="px-6 pt-2 pb-4 overflow-y-auto flex-1">
        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold tracking-wide text-gray-900">Pocket O&G</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">For healthcare professionals</p>
          <p className="text-xs text-gray-400 mt-2">Quick read before you start</p>
        </div>

        <div className="space-y-2.5">
          {POINTS.map(point => (
            <div
              key={point.title}
              className="flex items-start gap-3 rounded-2xl bg-gray-50 px-3.5 py-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  {point.icon}
                </svg>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-semibold text-gray-900 leading-snug">{point.title}</p>
                <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">{point.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-2 pb-1 shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={accept}
          className="w-full bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          By continuing, you confirm you are a qualified healthcare professional and agree to use this app as a decision aid only.
        </p>
      </div>
    </BottomSheet>
  );
}
