import { useState, useEffect } from "react";
import { SHOULDER_DYSTOCIA_EMERGENCY } from "../data/emergency";
import { SosShell, SosSetupBadge, SosCloseButton, SosExitConfirm, SosStickyFooter } from "./sos-ui.jsx";

const EM = SHOULDER_DYSTOCIA_EMERGENCY;
const SOS_BADGE = "Shoulder Dystocia · GTG42";

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

function HeadSetupScreen({ onConfirm, onExit }) {
  const presets = [
    { label: "Just now", secs: 0 },
    { label: "~1 min ago", secs: 60 },
    { label: "~2 min ago", secs: 120 },
    { label: "~3 min ago", secs: 180 },
  ];
  return (
    <div className="flex flex-col h-full px-4 pt-8 pb-8 gap-6">
      <div className="flex items-center justify-between gap-3">
        <SosSetupBadge label={SOS_BADGE} />
        <SosCloseButton onClick={onExit} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">When was the head delivered?</h1>
        <p className="text-gray-500 text-sm text-center mb-10">Sets the 5-minute hypoxia clock</p>
        <div className="space-y-3 w-full max-w-xs">
          {presets.map(p => (
            <button
              key={p.secs}
              type="button"
              onClick={() => onConfirm(new Date(Date.now() - p.secs * 1000))}
              className={`w-full rounded-xl font-bold transition-all active:scale-[0.98] ${
                p.secs === 0
                  ? "py-5 bg-white text-gray-950 text-lg"
                  : "py-4 bg-gray-900 text-white text-base border border-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => onConfirm(null)} className="text-gray-500 text-sm text-center">
        Unknown — skip
      </button>
    </div>
  );
}

function Header({ emergencyStartTime, headDeliveredTime, now, onStandDown, onExit }) {
  const elapsed = Math.floor((now - emergencyStartTime) / 1000);
  const headSecs = headDeliveredTime ? Math.floor((now - headDeliveredTime) / 1000) : null;
  const warn = headSecs !== null && headSecs >= 300;
  const headPct = headSecs !== null ? Math.min(100, (headSecs / 300) * 100) : null;

  return (
    <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SosSetupBadge label={SOS_BADGE} />
          <div className="flex items-center gap-4 mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wide text-gray-600">Declared</p>
              <p className="text-base font-mono font-bold text-white tabular-nums leading-tight">{fmtClock(elapsed)}</p>
            </div>
            {headDeliveredTime && (
              <>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-gray-600">Head delivered</p>
                  <p className={`text-base font-mono font-bold tabular-nums leading-tight ${warn ? "text-amber-400" : "text-white"}`}>
                    {fmtClock(headSecs)}{warn ? " ⚠" : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onStandDown}
            className="text-[11px] font-bold text-emerald-400 border border-emerald-900/50 bg-emerald-950/30 px-3 py-1.5 rounded-lg"
          >
            Stand down
          </button>
          <SosCloseButton onClick={onExit} />
        </div>
      </div>
      {headPct !== null && (
        <div className="mt-2">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${warn ? "bg-amber-400" : "bg-red-500"}`}
              style={{ width: `${headPct}%` }}
            />
          </div>
          {warn && <p className="text-[10px] font-bold text-amber-400 mt-1">5 minutes elapsed — escalate rapidly</p>}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ currentIndex, stepTimestamps }) {
  return (
    <div className="bg-gray-950 border-b border-gray-800 flex-shrink-0 px-4 py-2 flex items-center gap-1.5">
      {EM.helperr.map((s, i) => {
        const done = stepTimestamps.has(i);
        const active = i === currentIndex;
        return (
          <div
            key={i}
            className={`flex items-center justify-center rounded-lg font-black text-xs transition-all ${
              done    ? "w-7 h-7 bg-emerald-600 text-white" :
              active  ? "w-8 h-8 bg-white text-gray-950" :
                        "w-7 h-7 bg-gray-900 text-gray-600 border border-gray-800"
            }`}
          >
            {s.letter}
          </div>
        );
      })}
      <span className="ml-auto text-[11px] font-medium text-gray-600 tabular-nums">
        {currentIndex + 1} / {EM.helperr.length}
      </span>
    </div>
  );
}

function StepScreen({ stepIndex, stepTimestamps, emergencyStartTime, headDeliveredTime, now, onDone, onStandDown, onExit }) {
  const step = EM.helperr[stepIndex];
  const nextStep = EM.helperr[stepIndex + 1];
  const bg = LETTER_BG[step.letter] || "bg-gray-600";
  const textCol = LETTER_TEXT[step.letter] || "text-white";

  return (
    <div className="flex flex-col h-full min-h-0">
      <Header
        emergencyStartTime={emergencyStartTime}
        headDeliveredTime={headDeliveredTime}
        now={now}
        onStandDown={onStandDown}
        onExit={onExit}
      />
      <ProgressBar currentIndex={stepIndex} stepTimestamps={stepTimestamps} />

      <div className="flex-1 flex flex-col px-4 pt-5 pb-3 min-h-0">
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black text-3xl ${bg} ${textCol}`}>
            {step.letter}
          </div>
          <div className="min-w-0">
            {step.critical && (
              <span className="text-[9px] font-bold bg-red-950 text-red-400 border border-red-900/50 px-2 py-0.5 rounded mb-1 inline-block">
                CRITICAL
              </span>
            )}
            <h2 className="text-xl font-bold text-white leading-snug">{step.step}</h2>
          </div>
        </div>

        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 overflow-y-auto min-h-0">
          <p className="text-[15px] text-gray-300 leading-relaxed whitespace-pre-line">{step.detail}</p>
        </div>

        <div className="mt-3 flex-shrink-0 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-2">
          <p className="text-[11px] font-semibold text-red-400 leading-relaxed">
            No fundal pressure · No excessive traction · No lateral neck flexion
          </p>
        </div>
      </div>

      <SosStickyFooter>
        <button
          type="button"
          onClick={onDone}
          className="w-full py-4 rounded-xl bg-white text-gray-950 font-bold text-base flex items-center justify-center gap-3 active:opacity-90 transition-all"
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
      </SosStickyFooter>
    </div>
  );
}

function LastResortsScreen({ emergencyStartTime, headDeliveredTime, now, onStandDown, onExit }) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <Header
        emergencyStartTime={emergencyStartTime}
        headDeliveredTime={headDeliveredTime}
        now={now}
        onStandDown={onStandDown}
        onExit={onExit}
      />

      <div className="flex-shrink-0 bg-red-950/25 border-b border-red-900/30 px-4 py-2.5">
        <p className="text-xs font-bold text-red-400">HELPERR complete — last resort manoeuvres</p>
        <p className="text-[10px] text-gray-500 mt-0.5">Inform consultant obstetrician and anaesthetist immediately</p>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-5 pb-3 gap-3 min-h-0 overflow-y-auto">
        {EM.lastResorts.map((lr, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{lr.step}</p>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{lr.note}</p>
            </div>
          </div>
        ))}
      </div>

      <SosStickyFooter>
        <button
          type="button"
          onClick={onStandDown}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 active:bg-emerald-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Stand down — resolve emergency
        </button>
      </SosStickyFooter>
    </div>
  );
}

function SummaryScreen({ emergencyStartTime, resolveTime, stepTimestamps, headDeliveredTime, onNewEmergency, onClose }) {
  const duration = Math.floor((resolveTime - emergencyStartTime) / 1000);
  const headToBody = headDeliveredTime ? Math.floor((resolveTime - headDeliveredTime) / 1000) : null;

  const dotColor = { start: "bg-red-500", end: "bg-emerald-500", step: "bg-blue-400", head: "bg-amber-400" };

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
    <div className="flex flex-col h-full min-h-0">
      <div className="bg-gray-900 border-b border-gray-800 flex-shrink-0 px-4 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-emerald-900/50 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Emergency resolved</span>
        </div>
        <h1 className="text-xl font-bold text-white">Shoulder Dystocia Summary</h1>
        <p className="text-xs text-gray-500 mt-0.5">{fmtTime(emergencyStartTime)} → {fmtTime(resolveTime)}</p>
        <div className="flex gap-2 mt-3">
          {stats.map(s => (
            <div key={s.label} className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-2 py-2.5 text-center">
              <p className="text-base font-bold tabular-nums leading-tight text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="mx-4 mt-4 mb-4">
          <p className="text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-2">Timeline</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {timeline.map((event, i) => {
              const bookend = event.type === "start" || event.type === "end";
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-800" : ""} ${bookend ? "bg-gray-950/50" : ""}`}>
                  <span className="text-xs tabular-nums font-bold text-gray-600 shrink-0 w-11">{fmtTime(event.time)}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[event.type]}`} />
                  <p className={`flex-1 text-sm leading-snug min-w-0 ${bookend ? "font-bold text-white" : "font-medium text-gray-300"}`}>{event.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-4 mb-4">
          <p className="text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-2">After delivery — next steps</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {EM.afterDelivery.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-800" : ""}`}>
                <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <p className="text-sm text-gray-300 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-400 tracking-wider uppercase mb-1">MBRRACE</p>
              <p className="text-sm text-gray-300 leading-relaxed">{EM.mbrrace}</p>
            </div>
          </div>
        </div>
      </div>

      <SosStickyFooter className="flex gap-3">
        <button type="button" onClick={onNewEmergency} className="flex-1 py-3.5 rounded-xl bg-white text-gray-950 font-bold text-sm active:opacity-90">
          New emergency
        </button>
        <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-gray-700 text-gray-400 font-bold text-sm active:bg-gray-900">
          Close
        </button>
      </SosStickyFooter>
    </div>
  );
}

export default function ShoulderDystociaPage({ onClose }) {
  const [emergencyStartTime] = useState(() => new Date());
  const [headDeliveredTime, setHeadDeliveredTime] = useState(null);
  const [phase, setPhase] = useState("head-setup");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimestamps, setStepTimestamps] = useState(new Map());
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const [exitConfirm, setExitConfirm] = useState(false);

  const exitActive = phase !== "head-setup";
  const requestExit = () => setExitConfirm(true);
  const handleExit = () => {
    setExitConfirm(false);
    onClose();
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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
    <SosShell>
      {exitConfirm && (
        <SosExitConfirm active={exitActive} onConfirm={handleExit} onCancel={() => setExitConfirm(false)} />
      )}
      {phase === "head-setup" && (
        <HeadSetupScreen onConfirm={handleHeadConfirm} onExit={requestExit} />
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
          onExit={requestExit}
        />
      )}
      {phase === "last-resorts" && (
        <LastResortsScreen
          emergencyStartTime={emergencyStartTime}
          headDeliveredTime={headDeliveredTime}
          now={now}
          onStandDown={handleStandDown}
          onExit={requestExit}
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
    </SosShell>
  );
}
