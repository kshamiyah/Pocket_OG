import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { UPDATES } from "../data/updates";

const TAG = {
  new:      { label: "New",      cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  improved: { label: "Improved", cls: "bg-blue-50 text-blue-700 border-blue-100" },
  fixed:    { label: "Fixed",    cls: "bg-amber-50 text-amber-700 border-amber-100" },
};

function Release({ release, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-3 rounded-2xl bg-gray-50 px-4 py-3">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-2 text-left">
        <span className="text-sm font-bold text-gray-900">v{release.version}</span>
        <span className="text-xs text-gray-400">{release.date}</span>
        <svg className={`w-4 h-4 text-gray-300 ml-auto shrink-0 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <p className="text-xs text-gray-500 mt-0.5">{release.title}</p>
      {open && (
        <ul className="mt-3 space-y-2">
          {release.changes.map((c, i) => {
            const t = TAG[c.tag] ?? TAG.improved;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${t.cls}`}>{t.label}</span>
                <span className="text-sm text-gray-700 leading-snug">{c.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function UpdatesModal({ open, onClose }) {
  return (
    <BottomSheet open={open} onClose={onClose} zIndex={56} maxWidthClass="max-w-md" align="responsive" sheetClassName="max-h-[85vh]">
      <div className="px-6 pt-2 pb-4 overflow-y-auto flex-1">
        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold tracking-wide text-gray-900">What&apos;s new</h2>
          <p className="text-xs text-gray-400 mt-1">Recent updates to Pocket O&amp;G</p>
        </div>
        {UPDATES.map((r, i) => (
          <Release key={r.version} release={r} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="px-6 pt-2 pb-1 shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Close
        </button>
      </div>
    </BottomSheet>
  );
}
