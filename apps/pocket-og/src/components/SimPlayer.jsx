import { useState } from "react";
import { glColors } from "../data/glColors";
import { nodeOptions, scoredBeatCount } from "../data/simCases";

// On Call simulation player. Walks the beats of a sim case: narrative info
// screens, single-best-answer questions, pick-the-set checklists, and a closing
// lesson. Choices are locked after the first answer; only a correct first
// attempt scores, and every answer (right or wrong) shows the guideline
// reasoning with its source before the case moves on.

function beatOptions(beat) {
  if (beat.fromNode) return nodeOptions(beat.fromNode.fc, beat.fromNode.node);
  return beat.options ?? [];
}

function ObsPanel({ obs }) {
  if (!obs) return null;
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {Object.entries(obs).map(([k, v]) => (
        <span key={k} className="inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs">
          <span className="text-gray-400 font-medium">{k}</span>
          <span className="text-gray-700 font-semibold">{v}</span>
        </span>
      ))}
    </div>
  );
}

function WhyPanel({ why, source, correct }) {
  return (
    <div className={`mt-4 rounded-2xl border p-4 ${correct ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
      <p className={`text-xs font-bold mb-1.5 ${correct ? "text-green-700" : "text-amber-700"}`}>
        {correct ? "Correct" : "Not quite"}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{why}</p>
      {source && <p className="mt-2 text-xs text-gray-400">{source}</p>}
    </div>
  );
}

export default function SimPlayer({ simCase, onClose, onNavigate }) {
  const theme = glColors(simCase.gl);
  const [beatIdx, setBeatIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);        // choice: selected index, locked once set
  const [ticked, setTicked] = useState(new Set());   // checklist: selected indices
  const [revealed, setRevealed] = useState(false);   // checklist: answers shown

  const beat = simCase.beats[beatIdx];
  const totalScored = scoredBeatCount(simCase);
  const questionNum = simCase.beats
    .slice(0, beatIdx + 1)
    .filter(b => b.kind === "choice" || b.kind === "checklist").length;

  const advance = () => {
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
  const answered = beat.kind === "choice" ? chosen !== null : revealed;
  const isLesson = beat.kind === "lesson";

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>

      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>
          SIM
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{simCase.title}</p>
          <p className="text-xs text-gray-400">{simCase.setting} · training simulation, fictional patient</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close simulation"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Progress */}
      <div className="shrink-0 px-4 py-2 border-b border-gray-50 flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {simCase.beats.map((b, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i < beatIdx ? theme.accent : i === beatIdx ? "bg-gray-400" : "bg-gray-100"}`}
            />
          ))}
        </div>
        {!isLesson && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {questionNum > 0 && (beat.kind === "choice" || beat.kind === "checklist")
              ? `Question ${questionNum} of ${totalScored}`
              : simCase.patient.details}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-lg mx-auto">

          {/* Patient strip */}
          {!isLesson && (
            <div className="mb-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className={`w-8 h-8 rounded-full ${theme.bg} border ${theme.border} flex items-center justify-center text-xs font-bold ${theme.text} shrink-0`}>
                {simCase.patient.name[0]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{simCase.patient.name} · {simCase.patient.details}</p>
                <p className="text-xs text-gray-400 leading-snug">{simCase.patient.history}</p>
              </div>
            </div>
          )}

          <ObsPanel obs={beat.obs} />

          {/* Narrative */}
          {beat.title && <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>}
          {beat.narrative && <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{beat.narrative}</p>}

          {/* Question */}
          {beat.question && (
            <p className="text-base font-semibold text-gray-900 leading-snug mb-4">{beat.question}</p>
          )}

          {/* Choice options */}
          {beat.kind === "choice" && (
            <div className="space-y-2.5">
              {options.map((opt, i) => {
                const isAnswer = i === beat.answer;
                const isChosen = i === chosen;
                let cls = "border-gray-200 hover:border-teal-400 hover:bg-teal-50";
                if (chosen !== null) {
                  if (isAnswer) cls = "border-green-400 bg-green-50";
                  else if (isChosen) cls = "border-red-300 bg-red-50";
                  else cls = "border-gray-100 opacity-60";
                }
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={chosen !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all ${cls}`}
                  >
                    <p className="text-sm font-medium text-gray-800 leading-snug">{opt.label}</p>
                    {opt.sublabel && (chosen === null || isAnswer) && (
                      <p className="text-xs text-gray-400 mt-0.5">{opt.sublabel}</p>
                    )}
                  </button>
                );
              })}
              {answered && <WhyPanel why={beat.why} source={beat.source} correct={chosen === beat.answer} />}
            </div>
          )}

          {/* Checklist */}
          {beat.kind === "checklist" && (
            <div className="space-y-2.5">
              {beat.items.map((item, i) => {
                const on = ticked.has(i);
                let cls = on ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-gray-300";
                if (revealed) {
                  if (item.required && on) cls = "border-green-400 bg-green-50";
                  else if (item.required && !on) cls = "border-amber-400 bg-amber-50";
                  else if (!item.required && on) cls = "border-red-300 bg-red-50";
                  else cls = "border-gray-100 opacity-70";
                }
                return (
                  <button
                    key={i}
                    onClick={() => toggleTick(i)}
                    disabled={revealed}
                    className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all ${cls}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] font-bold ${on ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 text-transparent"}`}>✓</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug">{item.label}</p>
                        {revealed && (
                          <p className={`text-xs mt-1 leading-snug ${item.required ? "text-gray-500" : "text-red-600"}`}>
                            {item.required ? item.why : `Not indicated: ${item.why}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {!revealed ? (
                <button
                  onClick={revealChecklist}
                  disabled={ticked.size === 0}
                  className={`mt-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors disabled:opacity-40 ${theme.solid} ${theme.solidHover}`}
                >
                  Confirm selection
                </button>
              ) : (
                <p className="mt-3 text-xs text-gray-400">{beat.source}</p>
              )}
            </div>
          )}

          {/* Lesson */}
          {isLesson && (
            <div>
              <div className={`h-1 w-12 rounded-full mb-4 ${theme.accent}`} />
              <h2 className="text-xl font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>
              <p className="mb-3 text-sm text-gray-700 leading-relaxed">{beat.summary}</p>
              <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.bg} border ${theme.border}`}>
                <span className={`text-sm font-bold ${theme.text}`}>{score} / {totalScored}</span>
                <span className="text-xs text-gray-500">first-attempt answers correct</span>
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
                      <button
                        key={i}
                        onClick={() => { onClose(); onNavigate?.(l); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${theme.badge} border ${theme.border} hover:opacity-80 transition-opacity`}
                      >
                        {l.label} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={onClose}
                className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}
              >
                End of case · close
              </button>
            </div>
          )}

          {/* Continue (info beats, and answered questions) */}
          {!isLesson && (beat.kind === "info" || answered) && (
            <button
              onClick={advance}
              className={`mt-5 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}
            >
              {beat.kind === "info" ? "See the patient →" : "Continue →"}
            </button>
          )}

          <p className="text-xs text-gray-400 mt-8 text-center leading-relaxed">
            Training simulation with a fictional patient · decision aid only, clinical responsibility remains with the treating clinician
          </p>
        </div>
      </div>
    </div>
  );
}
