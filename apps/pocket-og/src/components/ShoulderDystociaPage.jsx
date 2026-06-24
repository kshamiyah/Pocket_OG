import { useState, useEffect } from "react";
import { SHOULDER_DYSTOCIA_EMERGENCY } from "../data/emergency";

const EM = SHOULDER_DYSTOCIA_EMERGENCY;

function padded(n) { return String(n).padStart(2, "0"); }
function fmtClock(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}h ${padded(m)}m ${padded(sec)}s`;
  return `${padded(m)}m ${padded(sec)}s`;
}
function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

const LETTER_BG = { H: "bg-red-600", E: "bg-orange-500", L: "bg-amber-500", P: "bg-yellow-400", R: "bg-blue-600" };
const LETTER_TEXT = { P: "text-gray-900" };

// ── Head-delivered setup ──────────────────────────────────────────────────
function HeadSetupScreen({ onConfirm }) {
  const presets = [
    { label: "Just now", secs: 0 },
    { label: "~1 min ago", secs: 60 },
    { label: "~2 min ago", secs: 120 },
    { label: "~3 min ago", secs: 180 },
  ];
  return (
    <div className="flex flex-col h-full bg-red-800"
      style={{ paddingTop: "max(20px, env(safe-area-inset-top))", paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
      <div className="flex items-center gap-2 px-5 pt-2 pb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">Shoulder Dystocia · GTG42</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">When was the head delivered?</h1>
        <p className="text-red-200 text-sm text-center mb-10">Sets the 5-minute hypoxia clock</p>
        <div className="space-y-3 w-full max-w-xs">
          {presets.map(p => (
            <button
              key={p.secs}
              onClick={() => onConfirm(new Date(Date.now() - p.secs * 1000))}
              className={`w-full rounded-2xl font-bold transition-all active:scale-[0.98] ${
                p.secs === 0
                  ? "py-5 bg-white text-red-800 text-lg shadow-lg"
                  : "py-4 bg-red-700/60 text-white text-base border border-red-600/60"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => onConfirm(null)} className="text-red-400 text-sm text-center pb-2">
        Unknown — skip
      </button>
    </div>
  );
}

// ── Persistent header strip ───────────────────────────────────────────────
function Header({ emergencyStartTime, headDeliveredTime, now, onStandDown, onClose }) {
  const elapsed = Math.floor((now - emergencyStartTime) / 1000);
  const headSecs = headDeliveredTime ? Math.floor((now - headDeliveredTime) / 1000) : null;
  const warn = headSecs !== null && headSecs >= 300;
  const headPct = headSecs !== null ? Math.min(100, (headSecs / 300) * 100) : null;

  return (
    <div className="bg-red-800 text-white flex-shrink-0"
      style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
      <div className="px-4 pt-2 pb-2 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">Shoulder Dystocia · GTG42</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-wide text-red-400">Declared</p>
              <p className="text-base font-mono font-bold text-white tabular-nums leading-tight">{fmtClock(elapsed)}</p>
            </div>
            {headDeliveredTime && (
              <>
                <div className="w-px h-8 bg-red-700" />
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-red-400">Head delivered</p>
                  <p className={`text-base font-mono font-bold tabular-nums leading-tight ${warn ? "text-amber-300" : "text-white"}`}>
                    {fmtClock(headSecs)}{warn ? " ⚠" : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <button
            onClick={onStandDown}
            className="text-[11px] font-bold text-green-300 bg-green-900/40 border border-green-700/40 px-3 py-1.5 rounded-xl"
          >
            Stand Down
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-700/60"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {headPct !== null && (
        <div className="px-4 pb-2">
          <div className="h-1 bg-red-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${warn ? "bg-amber-400" : "bg-red-500"}`}
              style={{ width: `${headPct}%` }}
            />
          </div>
          {warn && <p className="text-[10px] font-bold text-amber-300 mt-1">⚠ 5 minutes elapsed — escalate rapidly</p>}
        </div>
      )}
    </div>
  );
}

// ── HELPERR progress bar ──────────────────────────────────────────────────
function ProgressBar({ currentIndex, stepTimestamps }) {
  return (
    <div className="bg-red-900 flex-shrink-0 px-4 py-2 flex items-center gap-1.5">
      {EM.helperr.map((s, i) => {
        const done = stepTimestamps.has(i);
        const active = i === currentIndex;
        return (
          <div
            key={i}
            className={`flex items-center justify-center rounded-lg font-black text-xs transition-all ${
              done    ? "w-7 h-7 bg-green-500 text-white" :
              active  ? "w-8 h-8 bg-white text-red-800 shadow-md" :
                        "w-7 h-7 bg-red-800 text-red-500"
            }`}
          >
            {s.letter}
          </div>
        );
      })}
      <span className="ml-auto text-[11px] font-medium text-red-400">
        {currentIndex + 1} / {EM.helperr.length}
      </span>
    </div>
  );
}

// ── Single HELPERR step ───────────────────────────────────────────────────
function StepScreen({ stepIndex, stepTimestamps, emergencyStartTime, headDeliveredTime, now, onDone, onStandDown, onClose }) {
  const step = EM.helperr[stepIndex];
  const nextStep = EM.helperr[stepIndex + 1];
  const bg = LETTER_BG[step.letter] || "bg-gray-600";
  const textCol = LETTER_TEXT[step.letter] || "text-white";

  return (
    <div className="flex flex-col h-full">
      <Header
        emergencyStartTime={emergencyStartTime}
        headDeliveredTime={headDeliveredTime}
        now={now}
        onStandDown={onStandDown}
        onClose={onClose}
      />
      <ProgressBar currentIndex={stepIndex} stepTimestamps={stepTimestamps} />

      {/* Main content — no scroll */}
      <div className="flex-1 flex flex-col px-4 pt-5 pb-3 min-h-0">

        {/* Letter + title */}
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black text-3xl shadow-sm ${bg} ${textCol}`}>
            {step.letter}
          </div>
          <div className="min-w-0">
            {step.critical && (
              <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded mb-1 inline-block">
                CRITICAL
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 leading-snug">{step.step}</h2>
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 overflow-y-auto min-h-0">
          <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">{step.detail}</p>
        </div>

        {/* DO NOT reminder */}
        <div className="mt-3 flex-shrink-0 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          <p className="text-[11px] font-semibold text-red-600 leading-relaxed">
            ⚠ No fundal pressure · No excessive traction · No lateral neck flexion
          </p>
        </div>
      </div>

      {/* Action button */}
      <div
        className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onDone}
          className="w-full py-5 rounded-2xl bg-red-700 text-white font-bold text-base flex items-center justify-center gap-3 active:bg-red-800 active:scale-[0.98] transition-all shadow-sm"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Done
            {nextStep
              ? <span className="font-normal opacity-80"> — Next: {nextStep.step}</span>
              : <span className="font-normal opacity-80"> — View last resorts</span>
            }
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Last resorts ──────────────────────────────────────────────────────────
function LastResortsScreen({ emergencyStartTime, headDeliveredTime, now, onStandDown, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <Header
        emergencyStartTime={emergencyStartTime}
        headDeliveredTime={headDeliveredTime}
        now={now}
        onStandDown={onStandDown}
        onClose={onClose}
      />

      <div className="flex-shrink-0 bg-red-900 px-4 py-2.5">
        <p className="text-xs font-bold text-white">HELPERR complete — last resort manoeuvres</p>
        <p className="text-[10px] text-red-400 mt-0.5">Inform consultant obstetrician and anaesthetist immediately</p>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-5 pb-3 gap-3 min-h-0 overflow-y-auto">
        {EM.lastResorts.map((lr, i) => (
          <div key={i} className="bg-white rounded-2xl border border-red-100 px-4 py-4 flex gap-3 shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-red-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{lr.step}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{lr.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onStandDown}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-base flex items-center justify-center gap-2 active:bg-green-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Stand Down — Resolve Emergency
        </button>
      </div>
    </div>
  );
}

// ── Summary ───────────────────────────────────────────────────────────────
function SummaryScreen({ emergencyStartTime, resolveTime, stepTimestamps, headDeliveredTime, onNewEmergency, onClose }) {
  const duration = Math.floor((resolveTime - emergencyStartTime) / 1000);
  const headToBody = headDeliveredTime ? Math.floor((resolveTime - headDeliveredTime) / 1000) : null;

  const dotColor = { start: "bg-red-500", end: "bg-green-500", step: "bg-blue-400", head: "bg-amber-400" };

  const timeline = [
    { time: emergencyStartTime, label: "Emergency declared", type: "start" },
    ...(headDeliveredTime ? [{ time: headDeliveredTime, label: "Head delivered", type: "head" }] : []),
    ...[...stepTimestamps.entries()].map(([idx, time]) => ({
      time, label: `${EM.helperr[idx].letter} — ${EM.helperr[idx].step}`, type: "step",
    })),
    { time: resolveTime, label: "Emergency stood down", type: "end" },
  ].sort((a, b) => a.time - b.time);

  const stats = [
    { value: fmtClock(duration), label: "Duration" },
    ...(headToBody != null ? [{ value: fmtClock(headToBody), label: "Head-to-body" }] : []),
    { value: stepTimestamps.size, label: "Steps done" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-green-700 text-white flex-shrink-0"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-200">Emergency Resolved</span>
          </div>
          <h1 className="text-xl font-bold">Shoulder Dystocia Summary</h1>
          <p className="text-xs text-green-300 mt-0.5">{fmtTime(emergencyStartTime)} → {fmtTime(resolveTime)}</p>
          <div className="flex gap-2 mt-3">
            {stats.map(s => (
              <div key={s.label} className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
                <p className="text-base font-bold tabular-nums leading-tight">{s.value}</p>
                <p className="text-[10px] text-green-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-4">
        <div className="mx-4 mt-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Timeline</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {timeline.map((event, i) => {
              const bookend = event.type === "start" || event.type === "end";
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""} ${bookend ? "bg-gray-50" : ""}`}>
                  <span className="text-xs tabular-nums font-bold text-gray-400 shrink-0 w-11">{fmtTime(event.time)}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[event.type]}`} />
                  <p className={`flex-1 text-sm leading-snug min-w-0 ${bookend ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>{event.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">After Delivery — Next Steps</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {EM.afterDelivery.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <svg className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-sm text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-1">MBRRACE</p>
              <p className="text-sm text-rose-900 leading-relaxed">{EM.mbrrace}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3 flex gap-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <button onClick={onNewEmergency} className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm active:bg-black">
          New Emergency
        </button>
        <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200">
          Close
        </button>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function ShoulderDystociaPage({ onClose }) {
  const [emergencyStartTime] = useState(() => new Date());
  const [headDeliveredTime, setHeadDeliveredTime] = useState(null);
  const [phase, setPhase] = useState("head-setup"); // head-setup | helperr | last-resorts | summary
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimestamps, setStepTimestamps] = useState(new Map());
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Keep screen on for the duration of the emergency
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock;
    navigator.wakeLock.request("screen").then(l => { lock = l; }).catch(() => {});
    return () => { lock?.release(); };
  }, []);

  const handleHeadConfirm = (time) => {
    setHeadDeliveredTime(time);
    setPhase("helperr");
  };

  const handleStepDone = () => {
    setStepTimestamps(prev => new Map(prev).set(currentStepIndex, new Date()));
    if (currentStepIndex < EM.helperr.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      setPhase("last-resorts");
    }
  };

  const handleStandDown = () => {
    setResolveTime(new Date());
    setPhase("summary");
  };

  const handleNewEmergency = () => {
    setHeadDeliveredTime(null);
    setCurrentStepIndex(0);
    setStepTimestamps(new Map());
    setResolveTime(null);
    setPhase("head-setup");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
    >
      {phase === "head-setup" && (
        <HeadSetupScreen onConfirm={handleHeadConfirm} />
      )}
      {phase === "helperr" && (
        <StepScreen
          stepIndex={currentStepIndex}
          stepTimestamps={stepTimestamps}
          emergencyStartTime={emergencyStartTime}
          headDeliveredTime={headDeliveredTime}
          now={now}
          onDone={handleStepDone}
          onStandDown={handleStandDown}
          onClose={onClose}
        />
      )}
      {phase === "last-resorts" && (
        <LastResortsScreen
          emergencyStartTime={emergencyStartTime}
          headDeliveredTime={headDeliveredTime}
          now={now}
          onStandDown={handleStandDown}
          onClose={onClose}
        />
      )}
      {phase === "summary" && (
        <SummaryScreen
          emergencyStartTime={emergencyStartTime}
          resolveTime={resolveTime}
          stepTimestamps={stepTimestamps}
          headDeliveredTime={headDeliveredTime}
          onNewEmergency={handleNewEmergency}
          onClose={onClose}
        />
      )}
    </div>
  );
}
