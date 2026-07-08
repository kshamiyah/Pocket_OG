import BottomSheet from "./BottomSheet";
import { sourceColors, SOURCE_ORDER, SOURCE_LABELS } from "../data/glColors";

const BUILD = typeof __BUILD_INFO__ !== "undefined" ? __BUILD_INFO__ : { version: "dev", sha: "dev", date: "" };

const FEATURES = [
  { label: "Search", detail: "Ask a clinical question across summarised guideline content" },
  { label: "Guides", detail: "Browse RCOG, NICE, and local trust guidelines" },
  { label: "Flow", detail: "Step through interactive clinical pathways" },
  { label: "Counsel", detail: "Counselling walkthroughs: benefits, risks and alternatives" },
  { label: "Calc", detail: "Ward calculators and dosing tools" },
  { label: "Rx", detail: "Prescribing reference for common O&G scenarios" },
];

const LIMITATIONS = [
  "For qualified healthcare professionals only",
  "Decision support — not a substitute for clinical judgement",
  "Always follow your local trust protocols where they differ",
  "Content is summarised — verify against the source guideline",
];

export default function AboutModal({ open, onClose }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      zIndex={55}
      maxWidthClass="max-w-md"
      align="responsive"
      sheetClassName="max-h-[85vh]"
    >
      <div className="px-6 pt-2 pb-4 overflow-y-auto flex-1">
        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold tracking-wide text-gray-900">Pocket O&G</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Pocket the evidence. Make the call.
          </p>
        </div>

        <section className="mb-5">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">What&apos;s inside</p>
          <div className="space-y-2">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-start gap-3 rounded-2xl bg-gray-50 px-3.5 py-3">
                <span className="text-xs font-bold text-gray-900 bg-white border border-gray-100 rounded-lg px-2 py-1 shrink-0 min-w-[3.25rem] text-center">
                  {f.label}
                </span>
                <p className="text-[13px] text-gray-600 leading-snug pt-0.5">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Sources</p>
          <p className="text-[13px] text-gray-600 leading-relaxed rounded-2xl bg-gray-50 px-3.5 py-3">
            Content summarised from national guidance (RCOG, NICE, and others) and local trust protocols.
            Full PDFs are linked where available.
          </p>
          <p className="text-[11px] text-gray-400 mt-3 mb-1.5">Colours indicate the source:</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-2xl bg-gray-50 px-3.5 py-3">
            {SOURCE_ORDER.map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${sourceColors(s).accent}`} />
                <span className="text-[12px] text-gray-600 leading-snug">{SOURCE_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Important</p>
          <ul className="space-y-1.5 rounded-2xl bg-gray-50 px-3.5 py-3">
            {LIMITATIONS.map(line => (
              <li key={line} className="flex items-start gap-2 text-[13px] text-gray-600 leading-snug">
                <span className="text-gray-400 shrink-0 mt-0.5">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[13px] text-gray-500 text-center leading-relaxed">
          Built by{" "}
          <a
            href="https://drshamiyah.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900"
          >
            Khalid Shamiyah
          </a>
        </p>
      </div>

      <div className="px-6 pt-2 pb-1 shrink-0 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Close
        </button>
        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          Spotted an error? Use the feedback button bottom-left.
        </p>
        <p className="text-[10px] text-gray-300 text-center mt-1.5 font-mono">
          v{BUILD.version} · {BUILD.sha}{BUILD.date ? ` · ${BUILD.date}` : ""}
        </p>
      </div>
    </BottomSheet>
  );
}
