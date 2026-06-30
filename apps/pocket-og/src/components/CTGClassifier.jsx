import { useState } from "react";
import { combineFeatureGrades } from "@pocket-og/guidelines";

// Feature grades use the trace-light convention: white = reassuring,
// amber = non-reassuring, red = abnormal. Thresholds mirror the shared
// classifyCTGEntry engine (NICE NG229 §1.4). Cells marked ⚠ await verbatim
// verification against the NG229 PDF — keep in lockstep with ctg.js.

const GRADE = {
  white: { label: "Reassuring",     chip: "bg-emerald-600 text-white", dot: "bg-emerald-500", text: "text-emerald-700" },
  amber: { label: "Non-reassuring", chip: "bg-amber-500 text-white",   dot: "bg-amber-500",   text: "text-amber-700" },
  red:   { label: "Abnormal",       chip: "bg-red-600 text-white",     dot: "bg-red-500",     text: "text-red-700" },
};

const BASELINE = [
  { id: "110-160", label: "110–160", grade: "white" },
  { id: "100-109", label: "100–109", grade: "amber" },
  { id: "161-180", label: "161–180 ⚠", grade: "amber" },
  { id: "lt100",   label: "< 100",   grade: "red" },
  { id: "gt180",   label: "> 180 ⚠", grade: "red" },
];

const VARIABILITY = [
  { id: "5-25", label: "5–25 bpm", grade: "white" },
  { id: "lt5",  label: "< 5 bpm",  durations: [
      { id: "30-50", label: "30–50 min", grade: "amber" },
      { id: "gt50",  label: "> 50 min",  grade: "red" },
  ]},
  { id: "gt25", label: "> 25 bpm", durations: [
      { id: "short",     label: "≤ 10 min",   grade: "amber" },
      { id: "sustained", label: "> 10 min ⚠", grade: "red" },
  ]},
  { id: "sinusoidal", label: "Sinusoidal", grade: "red" },
];

const DECELS = [
  { id: "none", label: "None / early / non-concerning variable", grade: "white" },
  { id: "var-concerning", label: "Variable with concerning features", durations: [
      { id: "lt30", label: "< 30 min", grade: "amber" },
      { id: "ge30", label: "≥ 30 min", grade: "red" },
  ]},
  { id: "late",      label: "Late",                 grade: "red" },
  { id: "prolonged", label: "Prolonged (≥ 3 min)",  grade: "red" },
];

const CATEGORY = {
  normal: {
    label: "Normal", tone: "emerald", sub: "All three features reassuring",
    actions: ["Continue CTG and routine care", "Reassess and document regularly; re-evaluate on any clinical change"],
  },
  suspicious: {
    label: "Suspicious", tone: "amber", sub: "1 non-reassuring feature",
    actions: [
      "Start conservative measures (reposition left lateral, IV fluids, reduce/stop oxytocin)",
      "Correct any reversible cause; exclude cord prolapse",
      "Reassess within 30 minutes and inform the senior team",
    ],
  },
  pathological: {
    label: "Pathological", tone: "red", sub: "≥ 2 non-reassuring features, or ≥ 1 abnormal feature",
    actions: [
      "Immediate senior / consultant obstetric review",
      "Continue conservative measures",
      "Offer fetal scalp stimulation → if no acceleration, consider FBS or expedite birth",
    ],
  },
  urgent: {
    label: "Urgent intervention", tone: "red", sub: "Prolonged deceleration ≥ 3 minutes",
    actions: [
      "Call for help immediately — senior obstetric and neonatal teams",
      "Conservative measures; exclude cord prolapse; consider acute tocolysis",
      "If not recovered by ~9 minutes, prepare for urgent birth",
    ],
  },
};

const TONE = {
  emerald: { bar: "bg-emerald-500", banner: "bg-emerald-50 border-emerald-200", title: "text-emerald-800", dot: "bg-emerald-500" },
  amber:   { bar: "bg-amber-500",   banner: "bg-amber-50 border-amber-200",     title: "text-amber-800",   dot: "bg-amber-500" },
  red:     { bar: "bg-red-600",     banner: "bg-red-50 border-red-200",         title: "text-red-800",     dot: "bg-red-600" },
};

const CATEGORY_NODE = { normal: "normal", suspicious: "suspicious", pathological: "pathological", urgent: "urgent" };

function Chip({ active, grade, children, onClick }) {
  const base = "px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 border";
  if (active) return <button onClick={onClick} className={`${base} ${GRADE[grade]?.chip ?? "bg-gray-900 text-white"} border-transparent shadow-sm`}>{children}</button>;
  return <button onClick={onClick} className={`${base} bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100`}>{children}</button>;
}

function FeatureGroup({ index, title, options, sel, dur, onPick, onPickDur }) {
  const selected = options.find(o => o.id === sel);
  const grade = selected ? (selected.grade ?? selected.durations?.find(d => d.id === dur)?.grade ?? null) : null;
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{index}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {grade && (
          <span className={`ml-auto inline-flex items-center gap-1.5 text-xs font-semibold ${GRADE[grade].text}`}>
            <span className={`w-2 h-2 rounded-full ${GRADE[grade].dot}`} />{GRADE[grade].label}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <Chip key={o.id} active={sel === o.id} grade={o.grade ?? (sel === o.id ? "amber" : undefined)} onClick={() => onPick(o.id)}>
            {o.label}
          </Chip>
        ))}
      </div>
      {selected?.durations && (
        <div className="mt-2.5 pl-3 border-l-2 border-gray-100">
          <p className="text-xs text-gray-400 mb-1.5">For how long?</p>
          <div className="flex flex-wrap gap-2">
            {selected.durations.map(d => (
              <Chip key={d.id} active={dur === d.id} grade={d.grade} onClick={() => onPickDur(d.id)}>{d.label}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CTGClassifier({ onClose, onNavigate }) {
  const [baseline, setBaseline] = useState(null);
  const [variability, setVariability] = useState(null);
  const [varDur, setVarDur] = useState(null);
  const [decel, setDecel] = useState(null);
  const [decelDur, setDecelDur] = useState(null);

  const gradeOf = (options, sel, dur) => {
    const o = options.find(x => x.id === sel);
    if (!o) return null;
    if (o.grade) return o.grade;
    return o.durations?.find(d => d.id === dur)?.grade ?? null;
  };

  const gBaseline = gradeOf(BASELINE, baseline);
  const gVar = gradeOf(VARIABILITY, variability, varDur);
  const gDecel = gradeOf(DECELS, decel, decelDur);

  const allResolved = gBaseline && gVar && gDecel;
  const category = allResolved
    ? (decel === "prolonged" ? "urgent" : combineFeatureGrades([gBaseline, gVar, gDecel]))
    : null;

  const reset = () => { setBaseline(null); setVariability(null); setVarDur(null); setDecel(null); setDecelDur(null); };

  const cat = category ? CATEGORY[category] : null;
  const tone = cat ? TONE[cat.tone] : null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-red-500" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900 leading-tight">CTG Classifier</h2>
          <p className="text-xs text-gray-400">NG229 · build the trace, get the category</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-lg mx-auto">
          <FeatureGroup index={1} title="Baseline rate (bpm)" options={BASELINE} sel={baseline} onPick={id => setBaseline(id)} />
          <FeatureGroup index={2} title="Baseline variability" options={VARIABILITY} sel={variability} dur={varDur}
            onPick={id => { setVariability(id); setVarDur(null); }} onPickDur={setVarDur} />
          <FeatureGroup index={3} title="Decelerations" options={DECELS} sel={decel} dur={decelDur}
            onPick={id => { setDecel(id); setDecelDur(null); }} onPickDur={setDecelDur} />

          <div className="h-px bg-gray-100 my-4" />

          {!category ? (
            <p className="text-sm text-gray-400 text-center py-4">Select all three features to see the overall category.</p>
          ) : (
            <div className={`rounded-2xl border ${tone.banner} p-4`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${tone.dot}`} />
                <h3 className={`text-lg font-bold ${tone.title}`}>{cat.label}</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">{cat.sub}</p>
              <div className="mt-3 space-y-1.5">
                {cat.actions.map((a, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${tone.bar}`} />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate({ type: "flowchart", id: "NG229_CTG", node: CATEGORY_NODE[category] })}
                  className="mt-4 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold active:bg-gray-800"
                >
                  Open full action pathway →
                </button>
              )}
            </div>
          )}

          <button onClick={reset} className="mt-3 w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50">
            Reset
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
            Decision support only · interpret with the whole clinical picture · escalate suspicious/pathological traces rather than re-reading alone · NICE NG229
          </p>
        </div>
      </div>
    </div>
  );
}
