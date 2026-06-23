import { useState, useEffect } from "react";

const STORAGE_KEY = "pocketog_disclaimer_v1";

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl mx-0 sm:mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Important Notice</h2>
              <p className="text-xs text-gray-400">Please read before continuing</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-2.5">
              <span className="text-gray-400 shrink-0 mt-0.5">1.</span>
              <p><span className="font-semibold text-gray-900">Healthcare professionals only.</span> This app is intended for use by qualified healthcare professionals. It is not designed for patient self-management or lay use.</p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-gray-400 shrink-0 mt-0.5">2.</span>
              <p><span className="font-semibold text-gray-900">Not a substitute for clinical judgement.</span> All content is provided as a decision aid. Clinical responsibility remains with the treating clinician. Always apply professional judgement to individual patient circumstances.</p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-gray-400 shrink-0 mt-0.5">3.</span>
              <p><span className="font-semibold text-gray-900">Verify local protocols.</span> Dosing, thresholds, and management pathways may differ from your institution's policies. Always defer to your local protocols and current prescribing guidance.</p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-gray-400 shrink-0 mt-0.5">4.</span>
              <p><span className="font-semibold text-gray-900">Guideline currency.</span> Content is summarised from guidelines current at the time of publication. Check source guidelines for the most up-to-date recommendations before applying in practice.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <button
            onClick={accept}
            className="w-full bg-gray-900 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            I understand — I am a healthcare professional
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
            By continuing, you confirm you are a qualified healthcare professional and agree to use this app as a decision aid only.
          </p>
        </div>
      </div>
    </div>
  );
}
