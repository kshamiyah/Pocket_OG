import { useEffect, useRef, useState } from "react";
import { glColors } from "../data/glColors";
import { nodeOptions, scoredBeatCount } from "../data/simCases";

// On Call simulation player, presented as a live encounter feed. Beats append
// to a scrolling transcript of the shift: a clock advances, the patient and
// midwife speak in bubbles, observations land on a monitor-style panel, and
// the user's decisions are recorded in the feed as actions taken. Choices lock
// after the first answer; only a correct first attempt scores, and every
// answer shows the guideline reasoning with its source before the encounter
// moves on.

function beatOptions(beat) {
  if (beat.fromNode) return nodeOptions(beat.fromNode.fc, beat.fromNode.node);
  return beat.options ?? [];
}

function TimeMarker({ time }) {
  if (!time) return null;
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="h-px flex-1 bg-gray-100" />
      <span className="text-[11px] font-semibold text-gray-400 tabular-nums tracking-wide">{time}</span>
      <span className="h-px flex-1 bg-gray-100" />
    </div>
  );
}

// Monitor-style obs panel. Fixed dark styling in both themes (it reads as a
// bedside monitor), so it uses arbitrary-value classes the dark remap ignores.
function ObsMonitor({ obs }) {
  if (!obs) return null;
  return (
    <div className="my-3 rounded-2xl bg-[#0b1220] border border-[#1e293b] px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Obs</span>
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

function SpeechBubble({ who, text, patientName, theme }) {
  const isPatient = who === "patient";
  const name = isPatient ? patientName : "Midwife";
  return (
    <div className="my-2.5 max-w-[88%]">
      <p className={`text-[10px] font-bold mb-1 ml-3 uppercase tracking-wide ${isPatient ? theme.conditionColor : "text-gray-400"}`}>{name}</p>
      <div className={`px-4 py-2.5 rounded-2xl rounded-tl-md border ${isPatient ? `${theme.bg} ${theme.border}` : "bg-gray-100 border-gray-100"}`}>
        <p className="text-sm text-gray-800 leading-relaxed">&ldquo;{text}&rdquo;</p>
      </div>
    </div>
  );
}

// A decision the user has already made, folded into the transcript.
function ActionRecord({ label, correct, correctLabel, why, source, theme }) {
  return (
    <div className="my-2.5">
      <div className="flex justify-end">
        <div className="max-w-[88%]">
          <p className="text-[10px] font-bold mb-1 mr-3 text-right uppercase tracking-wide text-gray-400">You</p>
          <div className={`px-4 py-2.5 rounded-2xl rounded-tr-md text-white ${theme.solid}`}>
            <p className="text-sm leading-snug">{label}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${correct ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
          {correct ? "✓ Right call" : `✕ Guideline: ${correctLabel}`}
        </span>
      </div>
      {why && (
        <div className="mt-2 rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-2.5">
          <p className="text-xs text-gray-600 leading-relaxed">{why}</p>
          {source && <p className="mt-1 text-[10px] text-gray-400">{source}</p>}
        </div>
      )}
    </div>
  );
}

function beatScene(beat, patientName, theme) {
  return (
    <>
      <TimeMarker time={beat.time} />
      {beat.title && <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{beat.title}</h2>}
      {beat.narrative && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{beat.narrative}</p>}
      <ObsMonitor obs={beat.obs} />
      {(beat.dialogue ?? []).map((d, i) => (
        <SpeechBubble key={i} who={d.who} text={d.text} patientName={patientName} theme={theme} />
      ))}
    </>
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
  const bottomRef = useRef(null);

  const beat = simCase.beats[beatIdx];
  const totalScored = scoredBeatCount(simCase);
  const isLesson = beat.kind === "lesson";
  const answered = beat.kind === "choice" ? chosen !== null : revealed;

  // Keep the newest feed entry in view as the encounter unfolds.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [beatIdx, chosen, revealed]);

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

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>

      {/* Header: where you are and when */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${theme.badge} border ${theme.border}`}>
          ON CALL
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {simCase.setting}{simCase.room ? ` · ${simCase.room}` : ""}
          </p>
          <p className="text-xs text-gray-400">{simCase.title} · fictional patient</p>
        </div>
        {beat.time && (
          <span className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500 tabular-nums shrink-0">
            {beat.time}
          </span>
        )}
        <button
          onClick={onClose}
          aria-label="Close simulation"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Progress */}
      <div className="shrink-0 px-4 py-2 border-b border-gray-50 flex gap-1">
        {simCase.beats.map((b, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < beatIdx ? theme.accent : i === beatIdx ? "bg-gray-400" : "bg-gray-100"}`}
          />
        ))}
      </div>

      {/* Encounter feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto">

          {/* Patient banner: the person you are seeing */}
          <div className="mb-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className={`w-9 h-9 rounded-full ${theme.bg} border ${theme.border} flex items-center justify-center text-sm font-bold ${theme.text} shrink-0`}>
              {patientName[0]}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{simCase.patient.name} · {simCase.patient.details}</p>
              <p className="text-xs text-gray-400 leading-snug">{simCase.patient.history}</p>
            </div>
          </div>

          {/* Past beats: the transcript so far */}
          {simCase.beats.slice(0, beatIdx).map((b, i) => {
            if (b.kind === "lesson") return null;
            const rec = results[i];
            let record = null;
            if (b.kind === "choice" && rec) {
              const opts = beatOptions(b);
              record = (
                <ActionRecord
                  label={opts[rec.chosen]?.label}
                  correct={rec.chosen === b.answer}
                  correctLabel={opts[b.answer]?.label}
                  why={b.why}
                  source={b.source}
                  theme={theme}
                />
              );
            }
            if (b.kind === "checklist" && rec) {
              const tickedSet = new Set(rec.ticked);
              const exact = b.items.every((item, j) => item.required === tickedSet.has(j));
              const missed = b.items.filter((item, j) => item.required && !tickedSet.has(j));
              record = (
                <ActionRecord
                  label={b.items.filter((_, j) => tickedSet.has(j)).map(it => it.label).join(" · ") || "Nothing selected"}
                  correct={exact}
                  correctLabel={missed.length ? `also ${missed.map(m => m.label).join(", ")}` : "the selected set only"}
                  source={b.source}
                  theme={theme}
                />
              );
            }
            return (
              <div key={i}>
                {beatScene(b, patientName, theme)}
                {record}
              </div>
            );
          })}

          {/* Current beat */}
          <div className="animate-enter">
            {!isLesson && beatScene(beat, patientName, theme)}

            {beat.question && (
              <div className="mt-4 mb-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}>Your call</span>
                <p className="text-sm font-semibold text-gray-900 leading-snug flex-1">{beat.question}</p>
              </div>
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
                {answered && (
                  <div className={`mt-4 rounded-2xl border p-4 ${chosen === beat.answer ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                    <p className={`text-xs font-bold mb-1.5 ${chosen === beat.answer ? "text-green-700" : "text-amber-700"}`}>
                      {chosen === beat.answer ? "Right call" : "Not quite"}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{beat.why}</p>
                    {beat.source && <p className="mt-2 text-xs text-gray-400">{beat.source}</p>}
                  </div>
                )}
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
                <TimeMarker time={beat.time} />
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

            {/* Continue */}
            {!isLesson && (beat.kind === "info" || answered) && (
              <button
                onClick={advance}
                className={`mt-5 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-colors ${theme.solid} ${theme.solidHover}`}
              >
                {beat.kind === "info" ? "See the patient →" : "Continue →"}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-8 text-center leading-relaxed">
            Training simulation with a fictional patient · decision aid only, clinical responsibility remains with the treating clinician
          </p>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
