import { useState } from "react";

const IOL_INDICATIONS = [
  { key: "pet",        label: "Pre-eclampsia / PET (inpatient)",             priority: 1,         gestation: "ASAP ≥37 wks" },
  { key: "iugr",       label: "IUGR / SGA / FGR",                           priority: 1,         gestation: "Individual (consultant)" },
  { key: "dm-t1t2",    label: "Pre-existing diabetes (T1/T2)",               priority: 1,         gestation: "37+0–38+6" },
  { key: "anticoag",   label: "Therapeutic anticoagulation",                 priority: 1,         gestation: "39+0" },
  { key: "aph",        label: "APH (inpatient)",                             priority: 1,         gestation: "Individual" },
  { key: "gdm-low",    label: "GDM — low risk",                              priority: 2,         gestation: "40+3–40+6" },
  { key: "gdm-macro",  label: "GDM — macrosomia / complications",            priority: 2,         gestation: "37–40" },
  { key: "age-40-44",  label: "Maternal age 40–44",                          priority: 2,         gestation: "40+0" },
  { key: "age-45",     label: "Maternal age ≥45",                            priority: 2,         gestation: "38+0" },
  { key: "htn-op",     label: "Hypertension — non-proteinuric (outpatient)", priority: 2,         gestation: "40–40+6" },
  { key: "icp",        label: "Obstetric cholestasis (BA >100)",             priority: 2,         gestation: "37+0–39+6" },
  { key: "pcr",        label: "Raised PCR ≥30 with hypertension",           priority: 2,         gestation: "39–40+6" },
  { key: "rfm",        label: "Reduced fetal movements",                     priority: 2,         gestation: "From 38+6" },
  { key: "post-dates", label: "Post-dates",                                  priority: "Routine", gestation: "40+7" },
];

const PRIORITY_STYLES = {
  1:       { badge: "bg-red-100 text-red-700",    label: "P1" },
  2:       { badge: "bg-amber-100 text-amber-700", label: "P2" },
  Routine: { badge: "bg-green-100 text-green-700", label: "Routine" },
};

const PRIORITY_ORDER = { 1: 0, 2: 1, Routine: 2 };

let _uid = 0;
const uid = () => ++_uid;

export default function IOLPrioritizer({ onClose }) {
  const [patients, setPatients] = useState([]);
  const [label, setLabel] = useState("");
  const [indication, setIndication] = useState("");

  const addPatient = () => {
    if (!indication) return;
    const ind = IOL_INDICATIONS.find(i => i.key === indication);
    if (!ind) return;
    setPatients(prev => [...prev, { id: uid(), label: label.trim() || String(prev.length + 1), ind }]);
    setLabel("");
    setIndication("");
  };

  const sorted = [...patients].sort((a, b) => (PRIORITY_ORDER[a.ind.priority] ?? 3) - (PRIORITY_ORDER[b.ind.priority] ?? 3));

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">↑↓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">IOL Priority List</p>
          <p className="text-xs text-gray-400">GL861 · Ranked by clinical urgency</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-2">
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm font-medium text-gray-500">No patients added yet</p>
              <p className="text-xs text-gray-400 mt-1">Add patients below — they will be sorted by priority automatically</p>
            </div>
          )}
          {sorted.map((p, i) => {
            const ps = PRIORITY_STYLES[p.ind.priority];
            return (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                <span className="text-xs font-semibold text-gray-400 w-4 shrink-0">{i + 1}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${ps.badge}`}>{ps.label}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">Patient {p.label}</p>
                  <p className="text-xs text-gray-500 leading-snug">{p.ind.label}</p>
                  <p className="text-xs text-gray-400">{p.ind.gestation}</p>
                </div>
                <button
                  onClick={() => setPatients(prev => prev.filter(x => x.id !== p.id))}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none shrink-0 transition-colors"
                >×</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add patient form — sticky bottom */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-lg mx-auto space-y-2">
          <input
            type="text"
            placeholder="Patient label (e.g. 1, Pt 3)"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addPatient()}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400"
          />
          <div className="flex gap-2">
            <select
              value={indication}
              onChange={e => setIndication(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 appearance-none"
            >
              <option value="">Select indication…</option>
              <optgroup label="Priority 1">
                {IOL_INDICATIONS.filter(i => i.priority === 1).map(i => (
                  <option key={i.key} value={i.key}>{i.label}</option>
                ))}
              </optgroup>
              <optgroup label="Priority 2">
                {IOL_INDICATIONS.filter(i => i.priority === 2).map(i => (
                  <option key={i.key} value={i.key}>{i.label}</option>
                ))}
              </optgroup>
              <optgroup label="Routine">
                {IOL_INDICATIONS.filter(i => i.priority === "Routine").map(i => (
                  <option key={i.key} value={i.key}>{i.label}</option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={addPatient}
              disabled={!indication}
              className="shrink-0 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Add
            </button>
          </div>
          {patients.length > 0 && (
            <button
              onClick={() => setPatients([])}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
