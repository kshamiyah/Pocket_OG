import { useEffect, useRef, useState } from "react";
import { glColors } from "../data/glColors";
import { nodeOptions, scoredBeatCount } from "../data/simCases";

// On Call simulation player, presented as scene + action dock. The top of the
// screen is the scene: who is in front of you, what has just happened, what
// they say, and the bedside monitor. It replaces itself each step rather than
// growing a thread. The bottom is a fixed action dock where you make the call.
// A persistent patient strip keeps context nailed in place. Choices lock after
// the first answer; only a correct first attempt scores, and every answer shows
// the guideline reasoning with its source before the scene advances.

function beatOptions(beat) {
  if (beat.fromNode) return nodeOptions(beat.fromNode.fc, beat.fromNode.node);
  return beat.options ?? [];
}

// The clickable receipt behind every verdict: opens the cited guideline at the
// exact section, stacking over the sim so closing it returns to the case.
function SourceReceipt({ source, onNavigate }) {
  if (!source) return null;
  const label = typeof source === "string" ? source : source.label;
  const canOpen = typeof source === "object" && source.gl;
  if (!canOpen) return <p className="mt-2 text-xs text-gray-400">{label}</p>;
  return (
    <button
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

// Bedside monitor. Fixed dark styling in both themes (it reads as a monitor),
// so it uses arbitrary-value classes the dark remap leaves alone.
function ObsMonitor({ obs }) {
  if (!obs) return null;
  return (
    <div className="mt-4 rounded-2xl bg-[#0b1220] border border-[#1e293b] px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Bedside</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {Object.entries(obs).map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-2 min-w-0">
            <span className="text-[11px] text-[#64748b] font-medium truncate">{k}</span>
            <span className="text-xs text-[#6ee7b7] font-semibold tabular-nums text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Spoken lines rendered as a script, not a chat: a speaker tag with a coloured
// dot, then the quoted line. No bubbles, no alternating sides.
function SceneScript({ dialogue, patientName, theme }) {
  if (!dialogue?.length) return null;
  return (
    <div className="mt-4 space-y-3">
      {dialogue.map((d, i) => {
        const isPatient = d.who === "patient";
        return (
          <div key={i} className="pl-3 border-l-2 border-gray-100">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPatient ? theme.accent : "bg-gray-300"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isPatient ? theme.conditionColor : "text-gray-400"}`}>
                {isPatient ? patientName : "Midwife"}
              </span>
            </div>
            <p className="text-[15px] text-gray-800 leading-relaxed italic">&ldquo;{d.text}&rdquo;</p>
          </div>
        );
      })}
    </div>
  );
}

export default function SimPlayer({ simCase, onClose, onNavigate }) {
  const theme = glColors(simCase.gl);
  const patientName = simCase.patient.firstName ?? simCase.patient.name.split(" ")[0];
  const [beatIdx, setBeatIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState({});      // beatIdx → { chosen } | { ticked: number[] }
  const [chosen, setChosen] = useState(null);      // current choice beat: locked once set
  const [ticked, setTicked] = useState(new Set()); // current checklist beat
  const [revealed, setRevealed] = useState(false);
  const dockRef = useRef(null);

  const beat = simCase.beats[beatIdx];
  const totalScored = scoredBeatCount(simCase);
  const isLesson = beat.kind === "lesson";
  const answered = beat.kind === "choice" ? chosen !== null : revealed;
  const correct = beat.kind === "choice" && chosen === beat.answer;

  // When feedback appears, bring the dock's newest content into view.
  useEffect(() => {
    if (answered) dockRef.current?.scrollTo({ top: dockRef.current.scrollHeight, behavior: "smooth" });
  }, [answered]);

  const advance = () => {
    if (beat.kind === "choice") setResults(r => ({ ...r, [beatIdx]: { chosen } }));
    if (beat.kind === "checklist") setResults(r => ({ ...r, [beatIdx]: { ticked: [...ticked] } }));
    setChosen(null);
    setTicked(new Set());
    setRevealed(false);
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

  // ── Lesson: full-screen close-out, its own scroll ──────────────────────────
  if (isLesson) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
        <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>ON CALL</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight">End of case</p>
            <p className="text-xs text-gray-400">{simCase.title} · {simCase.setting}</p>
          </div>
          <button onClick={onClose} aria-label="Close simulation" className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-lg mx-auto">
            <div className={`h-1 w-12 rounded-full mb-4 ${theme.accent}`} />
            <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>
            <p className="mb-3 text-sm text-gray-700 leading-relaxed">{beat.summary}</p>
            <div className={`mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.bg} border ${theme.border}`}>
              <span className={`text-sm font-bold ${theme.text}`}>{score} / {totalScored}</span>
              <span className="text-xs text-gray-500">first-attempt calls correct</span>
            </div>

            {/* Your calls this shift — the record, restored as an end artefact */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Your calls this shift</p>
              <div className="space-y-1.5">
                {simCase.beats.map((b, i) => {
                  const rec = results[i];
                  if (!rec) return null;
                  let label, ok;
                  if (b.kind === "choice") {
                    const opts = beatOptions(b);
                    label = opts[rec.chosen]?.label;
                    ok = rec.chosen === b.answer;
                  } else if (b.kind === "checklist") {
                    const set = new Set(rec.ticked);
                    ok = b.items.every((it, j) => it.required === set.has(j));
                    label = b.items.filter((_, j) => set.has(j)).map(it => it.label).join(" · ") || "Nothing selected";
                  } else return null;
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 shrink-0 font-bold ${ok ? "text-green-600" : "text-amber-600"}`}>{ok ? "✓" : "✕"}</span>
                      <div className="min-w-0">
                        <span className="text-gray-700 leading-snug">{b.time && <span className="text-gray-400 tabular-nums mr-1">{b.time}</span>}{label}</span>
                        <div><SourceReceipt source={b.source} onNavigate={onNavigate} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
                <p className="text-xs font-bold text-gray-500 mb-2">Keep reading</p>
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
              End of case · close
            </button>
            <p className="text-xs text-gray-400 mt-8 text-center leading-relaxed">
              Training simulation with a fictional patient · decision aid only, clinical responsibility remains with the treating clinician
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Encounter: scene (top) + action dock (bottom) ──────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>

      {/* Header: where you are and when */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>ON CALL</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{simCase.setting}{simCase.room ? ` · ${simCase.room}` : ""}</p>
          <p className="text-xs text-gray-400">{simCase.title} · fictional patient</p>
        </div>
        {beat.time && (
          <span className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 tabular-nums shrink-0">{beat.time}</span>
        )}
        <button onClick={onClose} aria-label="Close simulation" className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0">×</button>
      </div>

      {/* Progress */}
      <div className="shrink-0 px-4 pt-2 flex gap-1">
        {simCase.beats.map((b, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i < beatIdx ? theme.accent : i === beatIdx ? "bg-gray-400" : "bg-gray-100"}`} />
        ))}
      </div>

      {/* Persistent patient strip: who you are seeing, always in place */}
      <div className="shrink-0 px-4 py-2.5 border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <span className={`w-8 h-8 rounded-full ${theme.bg} border ${theme.border} flex items-center justify-center text-xs font-bold ${theme.text} shrink-0`}>{patientName[0]}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{simCase.patient.name} · {simCase.patient.details}</p>
            <p className="text-[11px] text-gray-400 leading-snug truncate">{simCase.patient.history}</p>
          </div>
        </div>
      </div>

      {/* Scene: replaces itself each step (no thread) */}
      <div key={beatIdx} className="flex-1 min-h-0 overflow-y-auto px-4 py-5 animate-enter">
        <div className="max-w-lg mx-auto">
          {beat.title && <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>}
          {beat.narrative && <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">{beat.narrative}</p>}
          <SceneScript dialogue={beat.dialogue} patientName={patientName} theme={theme} />
          <ObsMonitor obs={beat.obs} />
        </div>
      </div>

      {/* Action dock: you make the call here */}
      <div ref={dockRef} className="shrink-0 max-h-[56%] overflow-y-auto border-t border-gray-100 bg-gray-50/60 px-4 pt-4 pb-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-lg mx-auto">

          {/* Info beat: nothing to decide, just proceed */}
          {beat.kind === "info" && (
            <button onClick={advance} className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}>
              See the patient →
            </button>
          )}

          {beat.question && (
            <div className="mb-3 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}>Your call</span>
              <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{beat.question}</p>
            </div>
          )}

          {/* Choice */}
          {beat.kind === "choice" && (
            <div className="space-y-2.5">
              {options.map((opt, i) => {
                const isAnswer = i === beat.answer;
                const isChosen = i === chosen;
                let cls = "border-gray-200 bg-white hover:border-teal-400 hover:bg-teal-50";
                if (chosen !== null) {
                  if (isAnswer) cls = "border-green-400 bg-green-50";
                  else if (isChosen) cls = "border-red-300 bg-red-50";
                  else cls = "border-gray-100 bg-white opacity-60";
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={chosen !== null} className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all ${cls}`}>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{opt.label}</p>
                    {opt.sublabel && (chosen === null || isAnswer) && <p className="text-xs text-gray-400 mt-0.5">{opt.sublabel}</p>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Checklist */}
          {beat.kind === "checklist" && (
            <div className="space-y-2.5">
              {beat.items.map((item, i) => {
                const on = ticked.has(i);
                let cls = on ? "border-teal-400 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300";
                if (revealed) {
                  if (item.required && on) cls = "border-green-400 bg-green-50";
                  else if (item.required && !on) cls = "border-amber-400 bg-amber-50";
                  else if (!item.required && on) cls = "border-red-300 bg-red-50";
                  else cls = "border-gray-100 bg-white opacity-70";
                }
                return (
                  <button key={i} onClick={() => toggleTick(i)} disabled={revealed} className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all ${cls}`}>
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] font-bold ${on ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 text-transparent"}`}>✓</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug">{item.label}</p>
                        {revealed && <p className={`text-xs mt-1 leading-snug ${item.required ? "text-gray-500" : "text-red-600"}`}>{item.required ? item.why : `Not indicated: ${item.why}`}</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
              {!revealed && (
                <button onClick={revealChecklist} disabled={ticked.size === 0} className={`mt-1 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors disabled:opacity-40 ${theme.solid} ${theme.solidHover}`}>
                  Confirm selection
                </button>
              )}
            </div>
          )}

          {/* Feedback + continue */}
          {answered && (
            <>
              {beat.kind === "choice" && (
                <div className={`mt-4 rounded-2xl border p-4 ${correct ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                  <p className={`text-xs font-bold mb-1.5 ${correct ? "text-green-700" : "text-amber-700"}`}>{correct ? "Right call" : "Not quite"}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{beat.why}</p>
                  <SourceReceipt source={beat.source} onNavigate={onNavigate} />
                </div>
              )}
              {beat.kind === "checklist" && <SourceReceipt source={beat.source} onNavigate={onNavigate} />}
              <button onClick={advance} className={`mt-3 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}>
                Continue →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
