import { useEffect, useRef, useState } from "react";
import { glColors } from "../data/glColors";
import { beatOptions, scoredBeatCount } from "../data/simCases";

// On Call simulation: one continuous room encounter with a live chart. Before you
// enter the room, only the handover scene shows (no patient card). After that, a
// collapsible patient strip stays pinned under the header. Actions are a uniform
// single-column list. A notes sheet accumulates history, findings and obs.

const SIM_MODE_KEY = "pocketog_sim_mode_v1";

function SourceReceipt({ source, onNavigate }) {
  if (!source) return null;
  const label = typeof source === "string" ? source : source.label;
  const canOpen = typeof source === "object" && source.gl;
  if (!canOpen) return <p className="mt-2 text-xs text-gray-400">{label}</p>;
  return (
    <button
      type="button"
      onClick={() => onNavigate?.({ type: "reader", id: source.gl, sectionId: source.sectionId })}
      className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 decoration-gray-300 transition-colors"
    >
      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75h6.75a.75.75 0 01.75.75v9.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V7.5a.75.75 0 01.75-.75H9m3 0V4.5m0 2.25L9.75 4.5M12 6.75L14.25 4.5" />
      </svg>
      {label}
    </button>
  );
}

function loadSimMode() {
  try {
    const v = localStorage.getItem(SIM_MODE_KEY);
    return v === "learn" ? "learn" : "simulate";
  } catch {
    return "simulate";
  }
}

function saveSimMode(mode) {
  try { localStorage.setItem(SIM_MODE_KEY, mode); } catch { /* best effort */ }
}

function ModePicker({ mode, onChange, theme }) {
  const modes = [
    {
      id: "simulate",
      title: "Simulate",
      desc: "No right or wrong until the debrief. Like being on the shift.",
      recommended: true,
    },
    {
      id: "learn",
      title: "Learn",
      desc: "Guideline reasoning after each decision, plus the end debrief.",
    },
  ];
  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mode</p>
      <div className="grid grid-cols-2 gap-2">
        {modes.map(m => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`text-left px-3 py-3 rounded-xl border-2 transition-all ${active ? `border-teal-500 ${theme.bg}` : "border-gray-200 bg-white hover:border-gray-300"}`}
            >
              <p className="text-sm font-semibold text-gray-900">{m.title}</p>
              {m.recommended && !active && (
                <p className="text-[10px] font-bold text-teal-600 mt-0.5">Recommended</p>
              )}
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepFeedback({ beat, mode, chosen, onNavigate }) {
  if (mode === "simulate") return null;

  if (beat.kind === "choice") {
    const ok = chosen === beat.answer;
    return (
      <div className={`rounded-2xl border-l-4 p-4 ${ok ? "border-green-400 bg-gray-50" : "border-amber-400 bg-gray-50"}`}>
        <p className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
          {ok ? "What happened next" : "Consider this"}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{beat.why}</p>
        <SourceReceipt source={beat.source} onNavigate={onNavigate} />
      </div>
    );
  }

  if (beat.source) {
    return <SourceReceipt source={beat.source} onNavigate={onNavigate} />;
  }
  return null;
}

// Teaching feedback for the end screen: each scored beat as what you did vs pathway.
function buildFeedbackSteps(simCase, results) {
  const steps = [];
  for (const [i, beat] of simCase.beats.entries()) {
    const rec = results[i];
    if (!rec) continue;

    if (beat.kind === "choice") {
      const opts = beatOptions(beat);
      steps.push({
        question: beat.question,
        ok: rec.chosen === beat.answer,
        yours: opts[rec.chosen]?.label ?? "No selection",
        correct: opts[beat.answer]?.label ?? "",
        teaching: beat.why,
        source: beat.source,
        kind: "choice",
      });
    }

    if (beat.kind === "checklist") {
      const set = new Set(rec.ticked);
      const yours = beat.items.filter((_, j) => set.has(j)).map(it => it.label);
      const correct = beat.items.filter(it => it.required).map(it => it.label);
      const missed = beat.items.filter((it, j) => it.required && !set.has(j));
      const extra = beat.items.filter((it, j) => !it.required && set.has(j));
      const ok = missed.length === 0 && extra.length === 0;
      const teaching = [
        ...missed.map(it => it.why),
        ...extra.map(it => `Not indicated: ${it.why}`),
      ].join(" ");
      steps.push({
        question: beat.question,
        ok,
        yours: yours.length ? yours : ["Nothing selected"],
        correct,
        missed: missed.map(it => it.label),
        extra: extra.map(it => it.label),
        teaching: teaching || "These are the core elements of bedside assessment in this pathway.",
        source: beat.source,
        kind: "checklist",
      });
    }
  }
  return steps;
}

function FeedbackStep({ step, index, theme, onNavigate }) {
  const yoursText = step.kind === "choice" ? step.yours : step.yours.join(" · ");
  const correctText = step.kind === "choice" ? step.correct : step.correct.join(" · ");

  return (
    <div className={`rounded-2xl border p-4 ${step.ok ? "border-green-100 bg-green-50/40" : "border-amber-100 bg-amber-50/30"}`}>
      <div className="flex items-start gap-2 mb-2">
        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {index + 1}
        </span>
        <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{step.question}</p>
      </div>

      <div className="space-y-2 ml-8">
        <div className="rounded-xl bg-white border border-gray-100 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">What you did</p>
          <p className="text-sm text-gray-800 leading-snug">{yoursText}</p>
        </div>

        {!step.ok && (
          <div className={`rounded-xl ${theme.bg} border ${theme.border} px-3 py-2.5`}>
            <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${theme.conditionColor}`}>What the pathway says</p>
            <p className="text-sm text-gray-800 leading-snug">{correctText}</p>
            {step.kind === "checklist" && step.missed?.length > 0 && (
              <p className="text-xs text-amber-700 mt-1.5 leading-snug">Missed: {step.missed.join(" · ")}</p>
            )}
            {step.kind === "checklist" && step.extra?.length > 0 && (
              <p className="text-xs text-red-600 mt-1 leading-snug">Not indicated: {step.extra.join(" · ")}</p>
            )}
          </div>
        )}

        <div className="rounded-xl bg-white/80 border border-gray-100 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Why it matters</p>
          <p className="text-sm text-gray-700 leading-relaxed">{step.teaching}</p>
          <SourceReceipt source={step.source} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

function entriesFromBeat(beat, { chosen, ticked, patientName }) {
  const entries = [];
  const t = beat.time;
  if (beat.kind === "info") {
    for (const d of beat.dialogue ?? []) {
      const who = d.who === "patient" ? patientName : "Midwife";
      entries.push({ time: t, text: `${who}: ${d.text}`, kind: "note" });
    }
    for (const [k, v] of Object.entries(beat.obs ?? {})) {
      entries.push({ time: t, text: `${k} ${v}`, kind: "obs" });
    }
  }
  if (beat.kind === "choice" && chosen !== null) {
    const label = beatOptions(beat)[chosen]?.label;
    if (label) entries.push({ time: t, text: label, kind: "action" });
    for (const [k, v] of Object.entries(beat.obs ?? {})) {
      entries.push({ time: t, text: `${k} ${v}`, kind: "obs" });
    }
  }
  if (beat.kind === "checklist") {
    beat.items.forEach((item, i) => {
      if (ticked.has(i)) {
        entries.push({ time: t, text: item.label, kind: item.required ? "finding" : "action" });
      }
    });
    for (const [k, v] of Object.entries(beat.obs ?? {})) {
      entries.push({ time: t, text: `${k} ${v}`, kind: "obs" });
    }
  }
  return entries;
}

const FEATURE_GRADE = {
  white: { dot: "bg-emerald-500", label: "Reassuring" },
  amber: { dot: "bg-amber-500", label: "Non-reassuring" },
  red:   { dot: "bg-red-500", label: "Abnormal" },
};

const CTG_CATEGORY = {
  normal:       { label: "Normal",       chip: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  suspicious:   { label: "Suspicious",   chip: "bg-amber-100 text-amber-800 border-amber-200" },
  pathological: { label: "Pathological", chip: "bg-red-100 text-red-800 border-red-200" },
};

function BedsidePanel({ bedside, obs }) {
  if (bedside?.kind === "ctg") {
    const cat = CTG_CATEGORY[bedside.category] ?? CTG_CATEGORY.normal;
    return (
      <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Computerised CTG</p>
            <p className="text-xs text-gray-500 mt-0.5">{bedside.duration}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 ${cat.chip}`}>{cat.label}</span>
        </div>
        <ul className="divide-y divide-gray-100">
          {bedside.features.map(f => {
            const g = FEATURE_GRADE[f.grade] ?? FEATURE_GRADE.white;
            return (
              <li key={f.label} className="px-4 py-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${g.dot}`} title={g.label} />
                  <span className="text-xs text-gray-500">{f.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 text-right leading-snug shrink-0">{f.value}</span>
              </li>
            );
          })}
        </ul>
        {bedside.source && (
          <p className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100">{bedside.source}</p>
        )}
      </div>
    );
  }

  if (bedside?.kind === "scan") {
    return (
      <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{bedside.title ?? "Ultrasound"}</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {bedside.findings.map(f => (
            <li key={f.label} className="px-4 py-3 flex items-start justify-between gap-4">
              <span className="text-xs text-gray-500 shrink-0 pt-0.5">{f.label}</span>
              <div className="text-right min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{f.value}</p>
                {f.sub && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{f.sub}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const rows = bedside?.kind === "vitals" && bedside.rows
    ? bedside.rows
    : obs
      ? Object.entries(obs).map(([label, value]) => ({ label, value }))
      : null;
  if (!rows?.length) return null;

  return (
    <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Bedside</p>
      </div>
      <ul className="divide-y divide-gray-100">
        {rows.map(r => (
          <li key={r.label} className="px-4 py-2.5 flex items-baseline justify-between gap-4">
            <span className="text-xs text-gray-500">{r.label}</span>
            <span className="text-sm font-semibold text-gray-900 tabular-nums text-right">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PatientBanner({ simCase, patientName, theme, expanded, onToggle }) {
  return (
    <div className="shrink-0 border-b border-gray-100 px-4 py-2">
      <button
        type="button"
        onClick={onToggle}
        className="max-w-lg mx-auto w-full flex items-center gap-2.5 text-left rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        <span className={`w-8 h-8 rounded-full ${theme.bg} border ${theme.border} flex items-center justify-center text-xs font-bold ${theme.text} shrink-0`}>
          {patientName[0]}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{simCase.patient.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{simCase.patient.details}</p>
          {expanded && (
            <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">{simCase.patient.history}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

function SceneSpeech({ dialogue, patientName, theme }) {
  if (!dialogue?.length) return null;
  return (
    <div className="mt-4 space-y-3">
      {dialogue.map((d, i) => {
        const isPatient = d.who === "patient";
        return (
          <div
            key={i}
            className={`rounded-2xl px-3.5 py-2.5 ${isPatient ? `${theme.bg} border ${theme.border}` : "bg-gray-50 border border-gray-100"}`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isPatient ? theme.conditionColor : "text-gray-400"}`}>
              {isPatient ? patientName : "Midwife"}
            </p>
            <p className="text-[15px] text-gray-800 leading-relaxed">{d.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function NotesSheet({ entries, open, onToggle, theme }) {
  const preview = entries.slice(-2);
  return (
    <div className="shrink-0 border-t border-gray-100 bg-white" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className={`w-7 h-7 rounded-lg ${theme.bg} border ${theme.border} flex items-center justify-center shrink-0`}>
          <svg className={`w-3.5 h-3.5 ${theme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800">Notes · {entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
          {!open && preview.length > 0 && (
            <p className="text-[11px] text-gray-400 truncate mt-0.5">{preview.map(e => e.text).join(" · ")}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && (
        <div className="max-h-44 overflow-y-auto px-4 pb-3 border-t border-gray-50">
          {entries.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">Findings will appear here as you work the case.</p>
          ) : (
            <ul className="space-y-2 pt-2">
              {entries.map((e, i) => (
                <li key={i} className="flex gap-2 text-xs leading-snug">
                  {e.time && <span className="text-gray-400 tabular-nums shrink-0 w-9">{e.time}</span>}
                  <span className={`min-w-0 ${e.kind === "obs" ? "text-teal-700 font-medium" : "text-gray-700"}`}>{e.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function SimPlayer({ simCase, onClose, onNavigate }) {
  const theme = glColors(simCase.gl);
  const patientName = simCase.patient.firstName ?? simCase.patient.name.split(" ")[0];
  const [beatIdx, setBeatIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState({});
  const [chosen, setChosen] = useState(null);
  const [ticked, setTicked] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [patientExpanded, setPatientExpanded] = useState(false);
  const [mode, setMode] = useState(loadSimMode);
  const [chartEntries, setChartEntries] = useState(() => ([
    { time: simCase.beats[0]?.time, text: `${simCase.patient.details} · ${simCase.title}`, kind: "header" },
    { time: simCase.beats[0]?.time, text: simCase.patient.history, kind: "note" },
  ]));
  const scrollRef = useRef(null);

  const beat = simCase.beats[beatIdx];
  const totalScored = scoredBeatCount(simCase);
  const isLesson = beat.kind === "lesson";
  const answered = beat.kind === "choice" ? chosen !== null : beat.kind === "checklist" ? revealed : false;
  const inRoom = beatIdx > 0;
  const isLearn = mode === "learn";

  const setModeAndSave = (next) => {
    setMode(next);
    saveSimMode(next);
  };

  useEffect(() => {
    if (answered) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [answered]);

  const advance = () => {
    const newEntries = entriesFromBeat(beat, { chosen, ticked, patientName });
    if (newEntries.length) setChartEntries(prev => [...prev, ...newEntries]);

    if (beat.kind === "choice") setResults(r => ({ ...r, [beatIdx]: { chosen } }));
    if (beat.kind === "checklist") setResults(r => ({ ...r, [beatIdx]: { ticked: [...ticked] } }));
    setChosen(null);
    setTicked(new Set());
    setRevealed(false);
    setPatientExpanded(false);
    setBeatIdx(i => Math.min(i + 1, simCase.beats.length - 1));
  };

  const pick = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === beat.answer) setScore(s => s + 1);
  };

  const toggleTick = (i) => {
    if (revealed) return;
    setTicked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const revealChecklist = () => {
    setRevealed(true);
    const exact = beat.items.every((item, i) => item.required === ticked.has(i));
    if (exact) setScore(s => s + 1);
  };

  const options = beat.kind === "choice" ? beatOptions(beat) : [];
  const feedbackSteps = isLesson ? buildFeedbackSteps(simCase, results) : [];

  if (isLesson) {
    const allCorrect = feedbackSteps.length > 0 && feedbackSteps.every(s => s.ok);
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>ON CALL</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Feedback</p>
            <p className="text-xs text-gray-400">{simCase.title}</p>
          </div>
          <button onClick={onClose} aria-label="Close simulation" className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-lg mx-auto">
            <div className={`h-1 w-12 rounded-full mb-4 ${theme.accent}`} />
            <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>
            <p className="mb-4 text-sm text-gray-700 leading-relaxed">{beat.summary}</p>

            <div className={`mb-5 rounded-2xl border px-4 py-3 flex items-center gap-3 ${allCorrect ? "border-green-100 bg-green-50" : `${theme.border} ${theme.bg}`}`}>
              <span className={`text-2xl font-bold tabular-nums ${allCorrect ? "text-green-700" : theme.text}`}>{score}/{totalScored}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{allCorrect ? "Pathway matched throughout" : "Review the gaps below"}</p>
                <p className="text-xs text-gray-500">First-attempt decisions against {simCase.gl}</p>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Decision by decision</p>
            <div className="space-y-3 mb-6">
              {feedbackSteps.map((step, i) => (
                <FeedbackStep key={i} step={step} index={i} theme={theme} onNavigate={onNavigate} />
              ))}
            </div>

            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Key takeaways</p>
            <ul className="space-y-2.5 mb-5">
              {beat.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-snug">
                  <span className={`shrink-0 mt-0.5 font-semibold ${theme.text}`}>{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {beat.evidence && (
              <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-bold text-gray-500 mb-1">The evidence behind it</p>
                <p className="text-sm text-gray-700 leading-relaxed">{beat.evidence}</p>
              </div>
            )}
            {beat.links?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 mb-2">Go deeper</p>
                <div className="flex flex-wrap gap-2">
                  {beat.links.map((l, i) => (
                    <button key={i} onClick={() => { onClose(); onNavigate?.(l); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${theme.badge} border ${theme.border} hover:opacity-80 transition-opacity`}>
                      {l.label} →
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={onClose} className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}>
              Done
            </button>
            <p className="text-xs text-gray-400 mt-8 text-center leading-relaxed">
              Training simulation with a fictional patient · decision aid only, clinical responsibility remains with the treating clinician
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>

      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>ON CALL</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {simCase.setting}{simCase.room ? ` · ${simCase.room}` : ""}
          </p>
          <p className="text-xs text-gray-400">{simCase.title}</p>
        </div>
        {beat.time && (
          <span className="px-2.5 py-1 rounded-lg bg-gray-900 text-white text-xs font-bold tabular-nums shrink-0">{beat.time}</span>
        )}
        {beatIdx > 0 && (
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${isLearn ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
            {isLearn ? "Learn" : "Simulate"}
          </span>
        )}
        <button
          type="button"
          onClick={() => setNotesOpen(o => !o)}
          aria-label="Toggle notes"
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors shrink-0 ${notesOpen ? `${theme.bg} ${theme.text}` : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button onClick={onClose} aria-label="Close simulation" className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0">×</button>
      </div>

      {inRoom && (
        <PatientBanner
          simCase={simCase}
          patientName={patientName}
          theme={theme}
          expanded={patientExpanded}
          onToggle={() => setPatientExpanded(e => !e)}
        />
      )}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        <div key={beatIdx} className="max-w-lg mx-auto px-4 py-4 animate-enter">

          {beat.title && <h2 className="text-base font-semibold text-gray-900 leading-snug mb-1.5">{beat.title}</h2>}
          {beat.narrative && <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">{beat.narrative}</p>}
          <SceneSpeech dialogue={beat.dialogue} patientName={patientName} theme={theme} />
          <BedsidePanel bedside={beat.bedside} obs={beat.obs} />

          <div className="mt-5 pt-4 border-t border-gray-100">
            {beat.kind === "info" && (
              <>
                <ModePicker mode={mode} onChange={setModeAndSave} theme={theme} />
                <button onClick={advance} className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}>
                  Enter the room
                </button>
              </>
            )}

            {beat.question && beat.kind !== "info" && (
              <p className="text-sm font-semibold text-gray-900 leading-snug mb-3">{beat.question}</p>
            )}

            {beat.kind === "choice" && (
              <div className="space-y-2">
                {options.map((opt, i) => {
                  const isAnswer = i === beat.answer;
                  const isChosen = i === chosen;
                  let cls = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 active:scale-[0.99]";
                  if (chosen !== null) {
                    if (isLearn) {
                      if (isAnswer) cls = "border-green-400 bg-green-50";
                      else if (isChosen) cls = "border-amber-300 bg-amber-50";
                      else cls = "border-gray-100 bg-gray-50 opacity-50";
                    } else if (isChosen) {
                      cls = "border-gray-400 bg-gray-50";
                    } else {
                      cls = "border-gray-100 bg-gray-50 opacity-40";
                    }
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pick(i)}
                      disabled={chosen !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${cls}`}
                    >
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{opt.label}</p>
                      {opt.sublabel && chosen === null && (
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{opt.sublabel}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {beat.kind === "checklist" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-1">Select everything you would do or ask for at the bedside.</p>
                <div className="space-y-2">
                  {beat.items.map((item, i) => {
                    const on = ticked.has(i);
                    let cls = on ? `border-teal-400 ${theme.bg}` : "border-gray-200 bg-white hover:border-gray-300";
                    if (revealed && isLearn) {
                      if (item.required && on) cls = "border-green-400 bg-green-50";
                      else if (item.required && !on) cls = "border-amber-400 bg-amber-50";
                      else if (!item.required && on) cls = "border-red-300 bg-red-50";
                      else cls = "border-gray-100 bg-gray-50 opacity-60";
                    } else if (revealed && on) {
                      cls = "border-gray-300 bg-gray-50";
                    } else if (revealed) {
                      cls = "border-gray-100 bg-white opacity-60";
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleTick(i)}
                        disabled={revealed}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${cls}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] font-bold ${on ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 text-transparent"}`}>✓</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-800 leading-snug">{item.label}</p>
                            {revealed && isLearn && (
                              <p className={`text-[11px] mt-1 leading-snug ${item.required ? "text-gray-500" : "text-red-600"}`}>
                                {item.required ? item.why : `Not indicated: ${item.why}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!revealed && (
                  <button
                    type="button"
                    onClick={revealChecklist}
                    disabled={ticked.size === 0}
                    className={`mt-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors disabled:opacity-40 ${theme.solid} ${theme.solidHover}`}
                  >
                    Document findings
                  </button>
                )}
              </div>
            )}

            {answered && (() => {
              const feedback = (
                <StepFeedback beat={beat} mode={mode} chosen={chosen} onNavigate={onNavigate} />
              );
              return (
                <div className="mt-4">
                  {feedback}
                  <button
                    type="button"
                    onClick={advance}
                    className={`${feedback ? "mt-3" : ""} w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}
                  >
                    Continue
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <NotesSheet
        entries={chartEntries}
        open={notesOpen}
        onToggle={() => setNotesOpen(o => !o)}
        theme={theme}
      />
    </div>
  );
}
