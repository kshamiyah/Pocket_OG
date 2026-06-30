import { useState } from "react";
import { combineFeatureGrades } from "@pocket-og/guidelines";

// Interactive CTG feature picker (NICE NG229 §1.4). Grades each feature as
// white = reassuring, amber = non-reassuring, red = abnormal, then computes the
// overall category via the shared combineFeatureGrades engine. Used as the
// "classifier" node of the NG229_CTG flowchart. Cells marked ⚠ await verbatim
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
  normal:       { label: "Normal",               tone: "emerald", sub: "All three features reassuring" },
  suspicious:   { label: "Suspicious",           tone: "amber",   sub: "1 non-reassuring feature" },
  pathological: { label: "Pathological",         tone: "red",     sub: "≥ 2 non-reassuring, or ≥ 1 abnormal feature" },
  urgent:       { label: "Urgent intervention",  tone: "red",     sub: "Prolonged deceleration ≥ 3 minutes" },
};

const TONE = {
  emerald: { banner: "bg-emerald-50 border-emerald-200", title: "text-emerald-800", dot: "bg-emerald-500", btn: "bg-emerald-600 active:bg-emerald-700" },
  amber:   { banner: "bg-amber-50 border-amber-200",     title: "text-amber-800",   dot: "bg-amber-500",   btn: "bg-amber-500 active:bg-amber-600" },
  red:     { banner: "bg-red-50 border-red-200",         title: "text-red-800",     dot: "bg-red-600",     btn: "bg-red-600 active:bg-red-700" },
};

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

export default function CTGFeaturePicker({ onResult }) {
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
    <div>
      <FeatureGroup index={1} title="Baseline rate (bpm)" options={BASELINE} sel={baseline} onPick={setBaseline} />
      <FeatureGroup index={2} title="Baseline variability" options={VARIABILITY} sel={variability} dur={varDur}
        onPick={id => { setVariability(id); setVarDur(null); }} onPickDur={setVarDur} />
      <FeatureGroup index={3} title="Decelerations" options={DECELS} sel={decel} dur={decelDur}
        onPick={id => { setDecel(id); setDecelDur(null); }} onPickDur={setDecelDur} />

      {!category ? (
        <p className="text-sm text-gray-400 text-center py-3">Grade all three features to calculate the category.</p>
      ) : (
        <div className={`rounded-2xl border ${tone.banner} p-4`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${tone.dot}`} />
            <h3 className={`text-lg font-bold ${tone.title}`}>{cat.label}</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">{cat.sub}</p>
          <button
            onClick={() => onResult(category, cat.label)}
            className={`mt-3 w-full py-2.5 rounded-xl text-white text-sm font-semibold ${tone.btn}`}
          >
            Continue to actions →
          </button>
        </div>
      )}

      <button onClick={reset} className="mt-3 w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50">
        Reset features
      </button>
    </div>
  );
}
