import { useState, useEffect } from "react";

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

const SUBTIER = {
  "pet": "1a", "aph": "1a",
  "iugr": "1b",
  "dm-t1t2": "1c", "anticoag": "1c",
  "icp": "2a", "gdm-macro": "2a",
  "age-45": "2b", "rfm": "2b",
  "pcr": "2c",
  "age-40-44": "2d", "htn-op": "2d",
  "gdm-low": "2e",
  "post-dates": "R",
};

const SUBTIER_ORDER = {
  "1a": 0, "1b": 1, "1c": 2,
  "2a": 0, "2b": 1, "2c": 2, "2d": 3, "2e": 4,
  "R": 0,
};

const PRIORITY_ORDER = { 1: 0, 2: 1, Routine: 2 };

const WINDOWS = {
  "pet":       { type: "asap" },
  "aph":       { type: "asap" },
  "iugr":      { type: "individual" },
  "dm-t1t2":   { start: 37 * 7,     end: 38 * 7 + 6 },
  "anticoag":  { start: 39 * 7,     end: 39 * 7     },
  "icp":       { start: 37 * 7,     end: 39 * 7 + 6 },
  "gdm-macro": { start: 37 * 7,     end: 40 * 7     },
  "age-45":    { start: 38 * 7,     end: 38 * 7     },
  "rfm":       { start: 38 * 7 + 6, end: null       },
  "pcr":       { start: 39 * 7,     end: 40 * 7 + 6 },
  "htn-op":    { start: 40 * 7,     end: 40 * 7 + 6 },
  "age-40-44": { start: 40 * 7,     end: 40 * 7     },
  "gdm-low":   { start: 40 * 7 + 3, end: 40 * 7 + 6 },
  "post-dates":{ start: 40 * 7 + 7, end: null       },
};

function fmtGest(days) {
  return `${Math.floor(days / 7)}+${days % 7}`;
}

function gestUrgencyScore(key, gestDays) {
  const w = WINDOWS[key];
  if (!w || w.type === "asap") return -Infinity;
  if (w.type === "individual" || gestDays === null) return 0;
  return -(gestDays - w.start);
}

function isOverdue(key, gestDays) {
  const w = WINDOWS[key];
  if (!w || !gestDays || w.type === "asap" || w.type === "individual") return false;
  return w.end !== null && gestDays > w.end;
}

function gestStatus(p) {
  const w = WINDOWS[p.ind.key];
  if (!w || w.type === "asap" || w.type === "individual") return null;
  if (p.gestDays === null) return null;
  const overEnd = w.end !== null ? p.gestDays - w.end : null;
  const fromStart = p.gestDays - w.start;
  if (overEnd !== null && overEnd > 0) return `${fmtGest(p.gestDays)}, ${overEnd}d past target window (${p.ind.gestation})`;
  if (fromStart > 0 && w.end === null)  return `${fmtGest(p.gestDays)}, ${fromStart}d past target (${p.ind.gestation})`;
  if (fromStart >= 0)                   return `${fmtGest(p.gestDays)}, in window (${p.ind.gestation})`;
  return `${fmtGest(p.gestDays)}, window opens in ${-fromStart}d (${p.ind.gestation})`;
}

function explainRank(p) {
  const w = WINDOWS[p.ind.key];
  const waitTxt = p.daysWaiting > 0 ? `${p.daysWaiting}d on list` : "added today";
  if (w?.type === "asap") return "Inpatient — immediate delivery indicated";
  if (w?.type === "individual") {
    return p.gestDays !== null
      ? `${fmtGest(p.gestDays)} — consultant-directed · ${waitTxt}`
      : `Consultant-directed · ${waitTxt}`;
  }
  if (!w || p.gestDays === null) return `Target ${p.ind.gestation} · ${waitTxt}`;
  const gs = gestStatus(p);
  return gs ? `${gs} · ${waitTxt}` : waitTxt;
}

function briefNote(p) {
  const w = WINDOWS[p.ind.key];
  if (w?.type === "asap") return `${p.label} (inpatient — immediate)`;
  if (w?.type === "individual") {
    const g = p.gestDays ? ` ${fmtGest(p.gestDays)},` : "";
    return `${p.label} (${g} consultant-directed${p.daysWaiting > 0 ? `, ${p.daysWaiting}d waiting` : ""})`;
  }
  if (!p.gestDays) return `${p.label}${p.daysWaiting > 0 ? ` (${p.daysWaiting}d waiting)` : ""}`;
  const w2 = w;
  const overEnd = w2.end != null ? p.gestDays - w2.end : null;
  const fromStart = p.gestDays - w2.start;
  if (overEnd > 0) return `${p.label} (${fmtGest(p.gestDays)}, ${overEnd}d past target)`;
  if (fromStart >= 0) return `${p.label} (${fmtGest(p.gestDays)}, in window)`;
  return `${p.label} (${fmtGest(p.gestDays)}, ${-fromStart}d before window)`;
}

function tiebreakNote(patients) {
  if (patients.length < 2) return briefNote(patients[0]);
  const badge = tierBadgeLabel(patients[0].ind.key, patients[0].ind.priority);
  const w = WINDOWS[patients[0].ind.key];

  if (w?.type === "individual") {
    const ns = patients.map(p => `${p.label} (${p.daysWaiting}d)`).join(" → ");
    return `${ns} — same sub-tier (${badge}), ordered by wait time`;
  }

  if (patients.length === 2) {
    const [a, b] = patients;
    if (a.gestDays && b.gestDays) {
      const oeA = w.end != null ? a.gestDays - w.end : null;
      const oeB = w.end != null ? b.gestDays - w.end : null;
      if (oeA > 0 && (!oeB || oeB <= 0)) {
        return `${a.label} before ${b.label} — both ${badge}, ${fmtGest(a.gestDays)} is ${oeA}d past target vs ${fmtGest(b.gestDays)} still in window`;
      }
      if (oeA > 0 && oeB > 0 && oeA !== oeB) {
        return `${a.label} before ${b.label} — both ${badge}, ${fmtGest(a.gestDays)} (${oeA}d past) vs ${fmtGest(b.gestDays)} (${oeB}d past)`;
      }
      const fsA = a.gestDays - w.start;
      const fsB = b.gestDays - w.start;
      if (fsA !== fsB) {
        return `${a.label} before ${b.label} — both ${badge}, ${fmtGest(a.gestDays)} further into window than ${fmtGest(b.gestDays)}`;
      }
    }
    return `${a.label} before ${b.label} — both ${badge}, ${a.daysWaiting}d vs ${b.daysWaiting}d waiting`;
  }

  const descs = patients.map(p => {
    if (!p.gestDays) return `${p.label} (${p.daysWaiting}d)`;
    const oe = w.end != null ? p.gestDays - w.end : null;
    if (oe > 0) return `${p.label} ${fmtGest(p.gestDays)} (${oe}d OD)`;
    return `${p.label} ${fmtGest(p.gestDays)}`;
  });
  return `${badge}: ${descs.join(" → ")} — ranked by gestation urgency`;
}

function generateNarrative(sorted) {
  if (sorted.length === 0) return [];

  const groups = [];
  for (const p of sorted) {
    const tier = SUBTIER[p.ind.key] ?? String(p.ind.priority);
    const last = groups[groups.length - 1];
    if (last && last.tier === tier) {
      last.patients.push(p);
    } else {
      groups.push({ tier, patients: [p] });
    }
  }

  return groups.map(({ patients }) =>
    patients.length === 1 ? briefNote(patients[0]) : tiebreakNote(patients)
  );
}

function tierBadgeLabel(key, priority) {
  const t = SUBTIER[key];
  if (!t) return priority === "Routine" ? "Routine" : `P${priority}`;
  if (t === "R") return "Routine";
  return `P${t}`;
}

const PRIORITY_BADGE_COLORS = {
  1:       "bg-red-100 text-red-700",
  2:       "bg-amber-100 text-amber-700",
  Routine: "bg-green-100 text-green-700",
};

const INPUT_CLS = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400";

let _uid = 0;
const uid = () => ++_uid;

export default function IOLPrioritizer({ onClose }) {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showNarrative, setShowNarrative] = useState(true);
  const [label, setLabel] = useState("");
  const [gestWeeks, setGestWeeks] = useState("");
  const [gestExtraDays, setGestExtraDays] = useState("");
  const [daysWaiting, setDaysWaiting] = useState("");
  const [indication, setIndication] = useState("");
  const [vpTop, setVpTop] = useState(0);
  const [vpHeight, setVpHeight] = useState(() =>
    (typeof window !== "undefined" && window.visualViewport?.height) || window.innerHeight
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { setVpTop(vv.offsetTop); setVpHeight(vv.height); };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  const gestDaysTotal = gestWeeks !== ""
    ? parseInt(gestWeeks) * 7 + (gestExtraDays !== "" ? Math.min(6, parseInt(gestExtraDays) || 0) : 0)
    : null;

  const resetForm = () => {
    setLabel(""); setGestWeeks(""); setGestExtraDays(""); setDaysWaiting(""); setIndication("");
  };

  const addPatient = () => {
    if (!indication) return;
    const ind = IOL_INDICATIONS.find(i => i.key === indication);
    if (!ind) return;
    setPatients(prev => [...prev, {
      id: uid(),
      label: label.trim() || String(prev.length + 1),
      ind,
      gestDays: gestDaysTotal,
      daysWaiting: Math.max(0, parseInt(daysWaiting) || 0),
    }]);
    resetForm();
    setShowForm(false);
  };

  const cancelForm = () => { resetForm(); setShowForm(false); };

  const sorted = [...patients].sort((a, b) => {
    const p = (PRIORITY_ORDER[a.ind.priority] ?? 3) - (PRIORITY_ORDER[b.ind.priority] ?? 3);
    if (p) return p;
    const s = (SUBTIER_ORDER[SUBTIER[a.ind.key]] ?? 9) - (SUBTIER_ORDER[SUBTIER[b.ind.key]] ?? 9);
    if (s) return s;
    const g = gestUrgencyScore(a.ind.key, a.gestDays) - gestUrgencyScore(b.ind.key, b.gestDays);
    if (g) return g;
    return b.daysWaiting - a.daysWaiting;
  });

  const narrative = generateNarrative(sorted);

  return (
    <div
      className="fixed left-0 right-0 z-50 bg-white flex flex-col overflow-hidden"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif", top: vpTop, height: vpHeight }}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">↑↓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">IOL Priority List</p>
          <p className="text-xs text-gray-400">GL861 · Ranked by urgency, gestation &amp; wait</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Ranking narrative strip */}
      {sorted.length > 0 && (
        <div className="shrink-0 border-b border-teal-100 bg-teal-50">
          <button
            onClick={() => setShowNarrative(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left"
          >
            <span className="text-xs font-semibold text-teal-700">Ranking justification</span>
            <span className="text-xs text-teal-500 shrink-0 ml-2">{showNarrative ? "▲ hide" : "▼ show"}</span>
          </button>
          {showNarrative && (
            <ul className="px-4 pb-3 space-y-1">
              {narrative.map((line, i) => (
                <li key={i} className="text-xs text-teal-900 leading-relaxed flex gap-1.5">
                  <span className="text-teal-400 shrink-0 mt-0.5">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Patient list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-2">
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm font-medium text-gray-500">No patients added yet</p>
              <p className="text-xs text-gray-400 mt-1">Tap + Add patient below to get started</p>
            </div>
          )}
          {sorted.map((p, i) => {
            const overdue = isOverdue(p.ind.key, p.gestDays);
            const badgeColor = PRIORITY_BADGE_COLORS[p.ind.priority];
            const badgeLabel = tierBadgeLabel(p.ind.key, p.ind.priority);
            const explanation = explainRank(p);
            return (
              <div key={p.id} className="px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-gray-400 w-4 pt-0.5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${badgeColor}`}>{badgeLabel}</span>
                      {overdue && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white shrink-0">Overdue</span>
                      )}
                      <p className="text-sm font-semibold text-gray-800">Patient {p.label}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">{p.ind.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{explanation}</p>
                  </div>
                  <button
                    onClick={() => setPatients(prev => prev.filter(x => x.id !== p.id))}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none shrink-0 transition-colors mt-0.5"
                  >×</button>
                </div>
              </div>
            );
          })}
          {patients.length > 0 && (
            <button
              onClick={() => setPatients([])}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Bottom — collapsed or expanded */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 pt-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-lg mx-auto">

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-base leading-none">+</span> Add patient
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">New patient</p>
                <button onClick={cancelForm} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              </div>

              <input
                type="text"
                placeholder="Patient label (optional)"
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                className={INPUT_CLS}
              />

              <div>
                <p className="text-xs text-gray-400 mb-1 pl-1">Gestation</p>
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="Weeks (e.g. 38)"
                      min="20"
                      max="43"
                      value={gestWeeks}
                      onChange={e => setGestWeeks(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="+Days"
                      min="0"
                      max="6"
                      value={gestExtraDays}
                      onChange={e => setGestExtraDays(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1 pl-1">Days on IOL list</p>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  min="0"
                  value={daysWaiting}
                  onChange={e => setDaysWaiting(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                  className={INPUT_CLS}
                />
              </div>

              <select
                value={indication}
                onChange={e => setIndication(e.target.value)}
                className={INPUT_CLS + " text-gray-700"}
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
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
