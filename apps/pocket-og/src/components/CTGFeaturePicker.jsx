import { useState } from "react";
import { combineFeatureGrades } from "@pocket-og/guidelines";

// Interactive CTG feature picker (NICE NG229 1.4). Grades each of the 4
// features as white = reassuring, amber = non-reassuring, red = abnormal, then
// computes the overall category via the shared combineFeatureGrades engine.
// Used as the "classifier" node of the NG229_CTG flowchart. Bands follow the
// current NG229 tables (checked against nice.org.uk, 16 Oct 2026):
//   baseline 1.4.15 (red above 160; a 20 bpm rise is amber, red in the active
//   second stage per 1.4.37), variability 1.4.18 (over 25 bpm: amber up to
//   10 min, red beyond), decelerations 1.4.24, contractions 1.4.12.
// ward-manager's classifyCTGEntry (packages/guidelines/src/ctg.js) uses the same bands.

const GRADE = {
  white: { label: "Reassuring",     chip: "bg-emerald-600 text-white", dot: "bg-emerald-500", text: "text-emerald-700" },
  amber: { label: "Non-reassuring", chip: "bg-amber-500 text-white",   dot: "bg-amber-500",   text: "text-amber-700" },
  red:   { label: "Abnormal",       chip: "bg-red-600 text-white",     dot: "bg-red-500",     text: "text-red-700" },
};

const BASELINE = [
  { id: "110-160", label: "110–160, stable", grade: "white" },
  { id: "100-109", label: "100–109", grade: "amber" },
  { id: "rise20",  label: "Rise of 20+ bpm", durTitle: "Since the start of labour or the last hourly review. Stage?", durations: [
      { id: "first",  label: "First stage or passive", grade: "amber" },
      { id: "active2", label: "Active second stage", grade: "red" },
  ]},
  { id: "undetermined", label: "Can't determine", grade: "amber" },
  { id: "lt100",   label: "< 100",   grade: "red" },
  { id: "gt160",   label: "> 160",   grade: "red" },
];

const VARIABILITY = [
  { id: "5-25", label: "5–25 bpm", grade: "white" },
  { id: "lt5",  label: "< 5 bpm",  durations: [
      { id: "30-50", label: "30–50 min", grade: "amber" },
      { id: "gt50",  label: "> 50 min",  grade: "red" },
  ]},
  { id: "gt25", label: "> 25 bpm", durations: [
      { id: "le10", label: "Up to 10 min", grade: "amber" },
      { id: "gt10", label: "> 10 min",     grade: "red" },
  ]},
  { id: "sinusoidal", label: "Sinusoidal", grade: "red" },
];

const DECELS = [
  { id: "none", label: "None / early / non-concerning variable", grade: "white" },
  { id: "var-concerning", label: "Repetitive variable, concerning", durations: [
      { id: "le30", label: "30 min or less", grade: "amber" },
      { id: "gt30", label: "> 30 min",       grade: "red" },
  ]},
  { id: "var-nonrep", label: "Non-repetitive variable, concerning", grade: "amber" },
  { id: "late",      label: "Late",                 grade: "red" },
  { id: "prolonged", label: "Acute bradycardia or prolonged (≥ 3 min)", grade: "red" },
];

const CONTRACTIONS = [
  { id: "lt5", label: "Fewer than 5 in 10 min", grade: "white" },
  { id: "ge5", label: "5+ in 10 min, or hypertonus", grade: "amber" },
];

const CATEGORY = {
  normal:       { label: "Normal",               tone: "emerald", sub: "All four features reassuring" },
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
          <p className="text-xs text-gray-400 mb-1.5">{selected.durTitle ?? "For how long?"}</p>
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
  const [baseDur, setBaseDur] = useState(null);
  const [ctx, setCtx] = useState(null);

  const gradeOf = (options, sel, dur) => {
    const o = options.find(x => x.id === sel);
    if (!o) return null;
    if (o.grade) return o.grade;
    return o.durations?.find(d => d.id === dur)?.grade ?? null;
  };

  const gBaseline = gradeOf(BASELINE, baseline, baseDur);
  const gVar = gradeOf(VARIABILITY, variability, varDur);
  const gDecel = gradeOf(DECELS, decel, decelDur);
  const gCtx = gradeOf(CONTRACTIONS, ctx);

  const allResolved = gBaseline && gVar && gDecel && gCtx;
  const category = allResolved
    ? (decel === "prolonged" ? "urgent" : combineFeatureGrades([gBaseline, gVar, gDecel, gCtx]))
    : null;

  const reset = () => { setBaseline(null); setBaseDur(null); setVariability(null); setVarDur(null); setDecel(null); setDecelDur(null); setCtx(null); };

  const cat = category ? CATEGORY[category] : null;
  const tone = cat ? TONE[cat.tone] : null;

  return (
    <div>
      <FeatureGroup index={1} title="Baseline rate (bpm)" options={BASELINE} sel={baseline} dur={baseDur}
        onPick={id => { setBaseline(id); setBaseDur(null); }} onPickDur={setBaseDur} />
      <FeatureGroup index={2} title="Baseline variability" options={VARIABILITY} sel={variability} dur={varDur}
        onPick={id => { setVariability(id); setVarDur(null); }} onPickDur={setVarDur} />
      <FeatureGroup index={3} title="Decelerations" options={DECELS} sel={decel} dur={decelDur}
        onPick={id => { setDecel(id); setDecelDur(null); }} onPickDur={setDecelDur} />
      <FeatureGroup index={4} title="Contractions" options={CONTRACTIONS} sel={ctx} onPick={setCtx} />

      {!category ? (
        <p className="text-sm text-gray-400 text-center py-3">Grade all four features to calculate the category.</p>
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
