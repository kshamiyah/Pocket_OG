import { useState, useEffect, useRef } from "react";

// ─── Maternal Cardiac Arrest SOS ──────────────────────────────────────────────
// Benchmarked against RCOG GTG56 (Maternal Collapse in Pregnancy and the
// Puerperium, 2019) Appendix 4 algorithm + Resuscitation Council (UK) ALS.
//
// Defining time-critical decision: perimortem caesarean (PMCS). From 20 weeks,
// if no ROSC within 4 minutes of collapse → start PMCS, deliver by 5 minutes.
// The PMCS clock is anchored to the TRUE collapse time, which may pre-date the
// moment this tool was opened.

const PMCS_DECISION_SEC = 4 * 60;   // start PMCS if no ROSC by 4 min
const PMCS_DELIVERY_SEC = 5 * 60;   // aim to deliver by 5 min

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, "0"); }
function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ─── Setup screen ───────────────────────────────────────────────────────────
// Captures gestation band (drives MLUD + PMCS) and time since collapse so the
// PMCS countdown is anchored to the real arrest time, not app-open time.

function SetupScreen({ onConfirm }) {
  const [gestation, setGestation] = useState(null); // "under20" | "over20"
  const [minsSince, setMinsSince] = useState(0);     // minutes already elapsed since collapse

  const canStart = gestation != null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col px-5 pt-12 pb-8 gap-6">
      <div>
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Maternal cardiac arrest</p>
        <h1 className="text-white text-3xl font-black leading-tight">Start resuscitation</h1>
        <p className="text-gray-500 text-sm mt-2">GTG56 · Resus Council UK ALS</p>
      </div>

      {/* Gestation */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Gestation</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => setGestation("over20")}
            className={`w-full text-left px-4 py-4 rounded-xl border transition ${gestation === "over20" ? "border-red-600 bg-red-950/40" : "border-gray-800"}`}>
            <span className="text-white font-bold text-base">≥ 20 weeks</span>
            <span className="block text-gray-500 text-xs mt-0.5">or uterus palpable at/above umbilicus — MLUD + PMCS apply</span>
          </button>
          <button onClick={() => setGestation("under20")}
            className={`w-full text-left px-4 py-4 rounded-xl border transition ${gestation === "under20" ? "border-red-600 bg-red-950/40" : "border-gray-800"}`}>
            <span className="text-white font-bold text-base">&lt; 20 weeks</span>
            <span className="block text-gray-500 text-xs mt-0.5">standard ALS — PMCS not indicated for maternal benefit</span>
          </button>
        </div>
      </div>

      {/* Time since collapse */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Time since collapse</p>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map(m => (
            <button key={m} onClick={() => setMinsSince(m)}
              className={`py-3 rounded-xl border text-sm font-bold transition ${minsSince === m ? "border-white bg-white text-gray-950" : "border-gray-800 text-white"}`}>
              {m === 0 ? "Now" : `${m}m`}
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-xs">
          {minsSince === 0
            ? "Collapse is happening now — clock starts at 0."
            : `Collapse was ~${minsSince} min ago — PMCS decision at 4 min fires in ${Math.max(0, 4 - minsSince)} min.`}
        </p>
      </div>

      <button
        disabled={!canStart}
        onClick={() => onConfirm({ gestation, startTime: Date.now() - minsSince * 60 * 1000 })}
        className={`mt-auto w-full py-4 rounded-xl font-black text-base transition ${canStart ? "bg-red-600 text-white" : "bg-gray-800 text-gray-600"}`}>
        Start CPR clock
      </button>
    </div>
  );
}

// ─── PMCS full-screen alarm ───────────────────────────────────────────────────

function PmcsAlarm({ onAcknowledge }) {
  useEffect(() => {
    if (!("vibrate" in navigator)) return;
    const id = setInterval(() => navigator.vibrate([400, 150, 400, 150, 400]), 2000);
    navigator.vibrate([400, 150, 400, 150, 400]);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-red-700 flex flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-red-200 text-sm font-bold uppercase tracking-widest">4 minutes — no ROSC</p>
      <h2 className="text-white text-4xl font-black leading-tight">Start perimortem caesarean now</h2>
      <p className="text-red-100 text-base leading-relaxed">
        Deliver by 5 minutes.<br />
        Do <span className="font-black">NOT</span> move the patient — operate here.<br />
        Continue CPR throughout.
      </p>
      <button onClick={onAcknowledge} className="mt-6 bg-white text-red-700 font-black text-base px-10 py-4 rounded-xl">
        PMCS started / acknowledged
      </button>
    </div>
  );
}

// ─── Immediate actions (concurrent checklist) ─────────────────────────────────
// These happen in parallel the moment CPR starts (GTG56 Appendix 4).

const IMMEDIATE_ACTIONS = [
  { id: "call_2222", title: "Call 2222 — maternal cardiac arrest",
    detail: "Cardiac arrest team + senior obstetrician + senior obstetric anaesthetist + senior midwife\nNeonatal team if antepartum > 22 weeks" },
  { id: "cpr", title: "Start CPR — 30:2",
    detail: "Centre of chest · 100–120/min · depth 5–6 cm\nMinimise interruptions" },
  { id: "mlud", title: "Manual uterine displacement — to the LEFT", over20Only: true,
    detail: "Displace the uterus up and to the left to relieve aortocaval compression\nPreferred over tilt — keeps her supine for effective compressions" },
  { id: "airway", title: "Airway — high-flow O₂",
    detail: "Early intubation (cuffed ETT) by experienced anaesthetist — difficult airway, high aspiration risk\nBag-mask / supraglottic airway until then" },
  { id: "iv_access", title: "IV access — 2 × wide-bore ≥ 16G",
    detail: "Intraosseous or central access if peripheral fails\nAggressive volume replacement (caution in pre-eclampsia/eclampsia)" },
  { id: "defib", title: "Attach defibrillator — assess rhythm",
    detail: "Same energy as non-pregnant (200 J biphasic)\nShockable (VF/pVT) vs non-shockable (asystole/PEA)" },
];

function ImmediateActions({ gestation, doneSet, onToggle }) {
  const items = IMMEDIATE_ACTIONS.filter(a => !a.over20Only || gestation === "over20");
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider px-1">Immediate actions — do all now</p>
      {items.map(a => {
        const done = doneSet.includes(a.id);
        return (
          <button key={a.id} onClick={() => onToggle(a.id)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition ${done ? "border-gray-800 bg-gray-900/60" : "border-gray-700"}`}>
            <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"}`}>✓</span>
            <span className="min-w-0">
              <span className={`block text-sm font-bold leading-snug ${done ? "text-gray-500 line-through" : "text-white"}`}>{a.title}</span>
              {!done && <span className="block text-gray-500 text-xs whitespace-pre-line leading-relaxed mt-0.5">{a.detail}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Dual-clock header ────────────────────────────────────────────────────────

function Header({ startTime, now, gestation, onClose }) {
  const elapsedMs = now - startTime;
  const pmcsRemainingMs = PMCS_DECISION_SEC * 1000 - elapsedMs;
  const pmcsDue = pmcsRemainingMs <= 0;
  const deliveryRemainingMs = PMCS_DELIVERY_SEC * 1000 - elapsedMs;
  const showPmcs = gestation === "over20";

  return (
    <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-600 text-xs">Arrest</span>
          <span className="font-mono text-white text-2xl font-bold tabular-nums">{fmtClock(elapsedMs)}</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2.5 py-1.5 rounded transition">Close</button>
      </div>
      {showPmcs && (
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider shrink-0 ${pmcsDue ? "text-red-400" : "text-gray-500"}`}>PMCS</span>
          <div className="flex-1 bg-gray-800 h-1 rounded-full relative overflow-hidden">
            <div className={`absolute top-0 left-0 h-1 rounded-full transition-all ${pmcsDue ? "bg-red-500" : "bg-orange-400"}`}
              style={{ width: `${Math.max(0, Math.min(100, (1 - elapsedMs / (PMCS_DECISION_SEC * 1000)) * 100))}%` }} />
          </div>
          <span className={`text-sm font-mono tabular-nums shrink-0 ${pmcsDue ? "text-red-400 font-bold" : "text-orange-400"}`}>
            {pmcsDue
              ? (deliveryRemainingMs > 0 ? `deliver ${fmtClock(deliveryRemainingMs)}` : "DELIVER NOW")
              : fmtClock(pmcsRemainingMs)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CardiacArrestPage({ onClose }) {
  const [phase, setPhase] = useState("setup"); // setup | active
  const [gestation, setGestation] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [rosc, setRosc] = useState(false);
  const [pmcsAcknowledged, setPmcsAcknowledged] = useState(false);
  const [pmcsAlarmDismissed, setPmcsAlarmDismissed] = useState(false);
  const [actionsDone, setActionsDone] = useState([]);
  const wakeLockRef = useRef(null);

  // 1-second tick while active
  useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Keep the screen awake during an active arrest
  useEffect(() => {
    if (phase !== "active" || !("wakeLock" in navigator)) return;
    let lock;
    navigator.wakeLock.request("screen").then(l => { lock = l; wakeLockRef.current = l; }).catch(() => {});
    return () => { try { lock?.release(); } catch {} };
  }, [phase]);

  function handleSetup({ gestation, startTime }) {
    setGestation(gestation);
    setStartTime(startTime);
    setPhase("active");
  }

  if (phase === "setup") {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 overflow-y-auto">
        <SetupScreen onConfirm={handleSetup} />
      </div>
    );
  }

  const elapsedSec = (now - startTime) / 1000;
  const pmcsTriggered =
    gestation === "over20" && !rosc && !pmcsAcknowledged && elapsedSec >= PMCS_DECISION_SEC;
  const showAlarm = pmcsTriggered && !pmcsAlarmDismissed;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 overflow-hidden">
      {showAlarm && (
        <PmcsAlarm onAcknowledge={() => { setPmcsAcknowledged(true); setPmcsAlarmDismissed(true); }} />
      )}

      <Header startTime={startTime} now={now} gestation={gestation} onClose={onClose} />

      {/* Active body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <ImmediateActions
          gestation={gestation}
          doneSet={actionsDone}
          onToggle={(id) => setActionsDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
        />
        {/* CPR cycle, reversible causes and ROSC built next in the walkthrough. */}
      </div>
    </div>
  );
}
