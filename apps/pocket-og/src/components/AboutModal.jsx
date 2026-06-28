const FEATURES = [
  { label: "Search", detail: "Ask a clinical question across summarised guideline content" },
  { label: "Guides", detail: "Browse RCOG, NICE, and local trust guidelines" },
  { label: "Flow", detail: "Step through interactive clinical pathways" },
  { label: "Consent", detail: "Consent prompts and procedure summaries" },
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
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl mx-0 sm:mx-4 overflow-hidden max-h-[85vh] flex flex-col"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-6 pt-2 pb-4 overflow-y-auto">
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
        </div>
      </div>
    </div>
  );
}
