import { useState, useEffect, useMemo } from "react";
import { PPH_EMERGENCY } from "../data/emergency";

const LEVEL_ORDER = ["minor", "major", "massive"];

const ESCALATE_COLORS = {
  minor:   "bg-orange-600 active:bg-orange-700",
  major:   "bg-red-700 active:bg-red-800",
  massive: null,
};

function padded(n) { return String(n).padStart(2, "0"); }

function fmtClock(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${padded(m)}m ${padded(s)}s`;
  return `${padded(m)}m ${padded(s)}s`;
}

function fmtTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtTimeAgo(date, now) {
  const secs = Math.floor((now - date) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${padded(mins % 60)}m ago`;
}

// Flat lookups across all levels
const ALL_CHECKLIST = Object.fromEntries(
  PPH_EMERGENCY.levels.flatMap(l => l.checklist).map(i => [i.id, i.text])
);
const ALL_DRUGS = Object.fromEntries(
  PPH_EMERGENCY.levels.flatMap(l => l.drugs).map(d => [d.id, { name: d.name, dose: d.dose }])
);

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, badge, sublabel, children }) {
  return (
    <div className="mx-4 mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-bold text-gray-800">{title}</span>
        {badge !== undefined && (
          <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Checklist item ─────────────────────────────────────────────────────────
function ChecklistItem({ item, checked, onToggle }) {
  const timestamp = checked.get(item.id);
  const done = !!timestamp;
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
        done ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
        done ? "bg-green-500 border-green-500" : "border-gray-300"
      }`}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm leading-snug ${done ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
          {item.text}
        </span>
        {done && (
          <p className="text-[10px] text-green-600 font-medium mt-0.5">{fmtTime(timestamp)}</p>
        )}
      </div>
    </button>
  );
}

// ── Drug card ──────────────────────────────────────────────────────────────
function DrugCard({
  drug, now,
  carboprostDoses, setCarboprostDoses,
  drugTimestamps, setDrugTimestamps,
  txaBirthTime, setTxaBirthTime,
  txaElapsedSec, txaRemainingS, txaWindowPct,
  txaExpired, txaUrgent, txaWarning,
  emergencyStartTime,
}) {
  const givenAt = drugTimestamps[drug.id];

  const markGiven = () => {
    if (!givenAt) setDrugTimestamps(prev => ({ ...prev, [drug.id]: new Date() }));
  };
  const unmarkGiven = () => {
    setDrugTimestamps(prev => { const n = { ...prev }; delete n[drug.id]; return n; });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <p className="text-sm font-bold text-gray-900">{drug.name}</p>
        <p className="text-base font-semibold text-red-700 mt-0.5">{drug.dose}</p>
        {drug.route && <p className="text-xs text-gray-500 mt-0.5">{drug.route}</p>}
        {drug.note && (
          <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-2.5 py-1.5 mt-2 leading-snug">
            {drug.note}
          </p>
        )}
      </div>

      {/* Simple drug: mark given */}
      {!drug.countable && !drug.timerEnabled && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          {givenAt ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">Given at {fmtTime(givenAt)}</p>
                  <p className="text-[10px] text-gray-400">{fmtTimeAgo(givenAt, now)}</p>
                </div>
              </div>
              <button onClick={unmarkGiven} className="text-xs text-gray-400 underline underline-offset-2">Undo</button>
            </div>
          ) : (
            <button
              onClick={markGiven}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 text-sm font-semibold text-gray-500 hover:text-green-700 transition-all"
            >
              Mark given
            </button>
          )}
        </div>
      )}

      {/* Carboprost counter with timestamps */}
      {drug.countable && (
        <div className={`px-4 py-3 border-t ${
          carboprostDoses.length >= drug.maxDoses ? "bg-red-50 border-red-200" :
          carboprostDoses.length >= 6 ? "bg-amber-50 border-amber-200" :
          "bg-gray-50 border-gray-100"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-gray-600">Doses given</p>
              <p className={`text-xs mt-0.5 font-medium ${
                carboprostDoses.length >= drug.maxDoses ? "text-red-600" :
                carboprostDoses.length >= 6 ? "text-amber-700" : "text-gray-400"
              }`}>
                {carboprostDoses.length >= drug.maxDoses
                  ? "⚠ MAXIMUM — do not give more"
                  : carboprostDoses.length >= 6
                  ? `⚠ ${drug.maxDoses - carboprostDoses.length} dose${drug.maxDoses - carboprostDoses.length === 1 ? "" : "s"} remaining`
                  : `Max ${drug.maxDoses} doses`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCarboprostDoses(d => d.slice(0, -1))}
                disabled={carboprostDoses.length === 0}
                className="w-10 h-10 rounded-xl bg-gray-200 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-30 flex items-center justify-center text-xl font-bold text-gray-700 transition-colors"
              >
                −
              </button>
              <span className={`text-2xl font-bold w-8 text-center tabular-nums ${
                carboprostDoses.length >= drug.maxDoses ? "text-red-600" :
                carboprostDoses.length >= 6 ? "text-amber-600" : "text-gray-900"
              }`}>
                {carboprostDoses.length}
              </span>
              <button
                onClick={() => setCarboprostDoses(d => d.length < drug.maxDoses ? [...d, new Date()] : d)}
                disabled={carboprostDoses.length >= drug.maxDoses}
                className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 active:bg-red-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold text-red-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          {carboprostDoses.length > 0 && (
            <div className="space-y-1 mt-1 pt-2 border-t border-gray-200/50">
              {carboprostDoses.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 w-12">Dose {i + 1}</span>
                  <span className="text-xs font-semibold text-gray-700">{fmtTime(t)}</span>
                  <span className="text-[10px] text-gray-400">{fmtTimeAgo(t, now)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TXA: mark given + 3-hour timer */}
      {drug.timerEnabled && (
        <div className={`px-4 py-3.5 border-t ${
          txaExpired ? "bg-red-50 border-red-200" :
          txaUrgent  ? "bg-orange-50 border-orange-200" :
          txaWarning ? "bg-amber-50 border-amber-200" :
          "bg-gray-50 border-gray-100"
        }`}>
          <div className="mb-3">
            {givenAt ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-700">TXA given at {fmtTime(givenAt)}</p>
                    <p className="text-[10px] text-gray-400">{fmtTimeAgo(givenAt, now)}</p>
                  </div>
                </div>
                <button onClick={unmarkGiven} className="text-xs text-gray-400 underline underline-offset-2">Undo</button>
              </div>
            ) : (
              <button
                onClick={markGiven}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 text-sm font-semibold text-gray-500 hover:text-green-700 transition-all"
              >
                Mark TXA given
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200/60">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-gray-600">3-hour TXA window</p>
                {txaExpired ? (
                  <p className="text-sm font-bold text-red-600 mt-0.5">Window expired</p>
                ) : (
                  <p className={`text-sm font-bold mt-0.5 ${txaUrgent ? "text-red-600" : txaWarning ? "text-amber-600" : "text-green-600"}`}>
                    {fmtClock(txaRemainingS)} remaining
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">From birth</p>
                <p className="text-base font-bold text-gray-700 tabular-nums">{fmtClock(txaElapsedSec)}</p>
              </div>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  txaExpired ? "bg-red-600" : txaUrgent ? "bg-red-500" : txaWarning ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${txaWindowPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">Birth ({fmtTime(txaBirthTime)})</span>
              <span className="text-[10px] text-gray-400">+3 hours</span>
            </div>
            <button
              onClick={() => setTxaBirthTime(new Date())}
              className="mt-1.5 text-xs text-gray-400 underline underline-offset-2"
            >
              Adjust birth time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Summary screen ─────────────────────────────────────────────────────────
function SummaryScreen({ emergencyStartTime, resolveTime, highestLevel, checked, drugTimestamps, carboprostDoses, txaBirthTime, onNewEmergency, onClose }) {
  const duration = Math.floor((resolveTime - emergencyStartTime) / 1000);
  const levelData = PPH_EMERGENCY.levels.find(l => l.id === highestLevel);
  const levelLabel = levelData?.label ?? highestLevel;

  // Build chronological timeline
  const timeline = useMemo(() => {
    const events = [
      { time: emergencyStartTime, label: "Emergency declared", type: "start" },
    ];

    // Checklist items
    for (const [id, time] of checked.entries()) {
      const text = ALL_CHECKLIST[id];
      if (text) events.push({ time, label: text, type: "checklist" });
    }

    // Drugs
    for (const [id, time] of Object.entries(drugTimestamps)) {
      const d = ALL_DRUGS[id];
      if (d) events.push({ time, label: `${d.name} — ${d.dose}`, type: "drug" });
    }

    // Carboprost doses
    carboprostDoses.forEach((time, i) => {
      events.push({ time, label: `Carboprost 0.25 mg IM — Dose ${i + 1}`, type: "drug" });
    });

    events.push({ time: resolveTime, label: "Emergency stood down", type: "end" });

    return events.sort((a, b) => a.time - b.time);
  }, [emergencyStartTime, resolveTime, checked, drugTimestamps, carboprostDoses]);

  const dotColor = {
    start:     "bg-red-500",
    end:       "bg-green-500",
    checklist: "bg-blue-400",
    drug:      "bg-purple-500",
  };

  const checkedCount = checked.size;
  const drugCount = Object.keys(drugTimestamps).length + carboprostDoses.length;

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="bg-green-700 text-white flex-shrink-0"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-200">
              Emergency Resolved
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">PPH Summary</h1>
          <p className="text-xs text-green-300 mt-0.5">
            {fmtTime(emergencyStartTime)} → {fmtTime(resolveTime)}
          </p>

          {/* Stats row */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
              <p className="text-base font-bold text-white tabular-nums leading-tight">{fmtClock(duration)}</p>
              <p className="text-[10px] text-green-200 mt-0.5">Duration</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
              <p className="text-base font-bold text-white leading-tight">{levelLabel}</p>
              <p className="text-[10px] text-green-200 mt-0.5">Max level</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
              <p className="text-base font-bold text-white tabular-nums leading-tight">{checkedCount}</p>
              <p className="text-[10px] text-green-200 mt-0.5">Steps done</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
              <p className="text-base font-bold text-white tabular-nums leading-tight">{drugCount}</p>
              <p className="text-[10px] text-green-200 mt-0.5">Drugs given</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-4">

        {/* Timeline */}
        <div className="mx-4 mt-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Timeline</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {timeline.map((event, i) => {
              const isBookend = event.type === "start" || event.type === "end";
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""} ${isBookend ? "bg-gray-50" : ""}`}
                >
                  {/* Fixed-width time column */}
                  <span className="text-xs tabular-nums font-bold text-gray-400 shrink-0 w-11">
                    {fmtTime(event.time)}
                  </span>

                  {/* Colored dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[event.type]}`} />

                  {/* Event label */}
                  <p className={`flex-1 text-sm leading-snug min-w-0 ${isBookend ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                    {event.label}
                  </p>
                </div>
              );
            })}
          </div>

          {timeline.length <= 2 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              No actions or drugs were recorded during this emergency.
            </p>
          )}
        </div>

        {/* MBRRACE */}
        <div className="mx-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-1">
                MBRRACE — {levelLabel} PPH
              </p>
              <p className="text-sm text-rose-900 leading-relaxed">{levelData?.mbrrace}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom actions ───────────────────────────────────────── */}
      <div
        className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3 flex gap-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={onNewEmergency}
          className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm active:bg-black transition-colors"
        >
          New Emergency
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>

    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function EmergencyPage({ onClose }) {
  const [emergencyStartTime] = useState(() => new Date());
  const [activeLevel, setActiveLevel] = useState("minor");
  const [highestLevel, setHighestLevel] = useState("minor");
  const [checked, setChecked] = useState(new Map());
  const [carboprostDoses, setCarboprostDoses] = useState([]);
  const [txaBirthTime, setTxaBirthTime] = useState(() => new Date());
  const [drugTimestamps, setDrugTimestamps] = useState({});
  const [now, setNow] = useState(() => new Date());
  const [showSummary, setShowSummary] = useState(false);
  const [resolveTime, setResolveTime] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const escalateLevel = (levelId) => {
    setActiveLevel(levelId);
    if (LEVEL_ORDER.indexOf(levelId) > LEVEL_ORDER.indexOf(highestLevel)) {
      setHighestLevel(levelId);
    }
  };

  const level = PPH_EMERGENCY.levels.find(l => l.id === activeLevel);
  const nextLevel = level.escalatesTo
    ? PPH_EMERGENCY.levels.find(l => l.id === level.escalatesTo)
    : null;

  const toggleCheck = (id) =>
    setChecked(prev => {
      const next = new Map(prev);
      next.has(id) ? next.delete(id) : next.set(id, new Date());
      return next;
    });

  const checkedCount = level.checklist.filter(c => checked.has(c.id)).length;
  const emergencyElapsed = Math.floor((now - emergencyStartTime) / 1000);

  const txaElapsedSec = Math.floor((now - txaBirthTime) / 1000);
  const txaRemainingS = Math.max(0, 3 * 3600 - txaElapsedSec);
  const txaWindowPct  = Math.min(100, (txaElapsedSec / (3 * 3600)) * 100);
  const txaExpired    = txaRemainingS === 0;
  const txaUrgent     = txaRemainingS < 3600;
  const txaWarning    = txaRemainingS < 5400;

  const standDown = () => {
    const t = new Date();
    setResolveTime(t);
    setShowSummary(true);
  };

  const handleNewEmergency = () => {
    setActiveLevel("minor");
    setHighestLevel("minor");
    setChecked(new Map());
    setCarboprostDoses([]);
    setTxaBirthTime(new Date());
    setDrugTimestamps({});
    setShowSummary(false);
    setResolveTime(null);
  };

  const sharedDrugProps = {
    now,
    carboprostDoses, setCarboprostDoses,
    drugTimestamps, setDrugTimestamps,
    txaBirthTime, setTxaBirthTime,
    txaElapsedSec, txaRemainingS, txaWindowPct,
    txaExpired, txaUrgent, txaWarning,
    emergencyStartTime,
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
    >
      {showSummary ? (
        <SummaryScreen
          emergencyStartTime={emergencyStartTime}
          resolveTime={resolveTime}
          highestLevel={highestLevel}
          checked={checked}
          drugTimestamps={drugTimestamps}
          carboprostDoses={carboprostDoses}
          txaBirthTime={txaBirthTime}
          onNewEmergency={handleNewEmergency}
          onClose={onClose}
        />
      ) : (
        <>
          {/* ── Header ────────────────────────────────────────────── */}
          <div
            className="bg-red-800 text-white flex-shrink-0"
            style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
          >
            <div className="px-4 pt-2 pb-1 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">
                    Emergency Protocol
                  </span>
                  <span className="text-[10px] font-bold bg-red-700 text-red-200 px-2 py-0.5 rounded">
                    GTG52
                  </span>
                </div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  Postpartum Haemorrhage
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
                  <span className="text-xs font-mono text-red-200 tabular-nums">
                    {fmtClock(emergencyElapsed)} since declared
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-red-700/60 hover:bg-red-700 text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Level tabs */}
            <div className="flex px-3 py-2 gap-2">
              {PPH_EMERGENCY.levels.map(l => (
                <button
                  key={l.id}
                  onClick={() => escalateLevel(l.id)}
                  className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
                    activeLevel === l.id
                      ? "bg-white/25 ring-1 ring-white/40"
                      : "bg-red-900/30 hover:bg-red-900/50"
                  }`}
                >
                  <div className={`text-xs font-bold ${activeLevel === l.id ? "text-white" : "text-red-300"}`}>
                    {l.label}
                  </div>
                  <div className={`text-[10px] ${activeLevel === l.id ? "text-red-100" : "text-red-400"}`}>
                    {l.sublabel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Scrollable content ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto pb-4 pt-4">

            {/* 1. Call for Help */}
            <Section title="Call for Help">
              <div className="space-y-1.5">
                {level.call.map((person, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-red-700">{i + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{person}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* 2. Checklist */}
            <Section title="Checklist" badge={`${checkedCount} / ${level.checklist.length}`}>
              <div className="space-y-1.5">
                {level.checklist.map(item => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    checked={checked}
                    onToggle={() => toggleCheck(item.id)}
                  />
                ))}
              </div>
              {checkedCount === level.checklist.length && (
                <p className="mt-3 text-center text-xs font-semibold text-green-600 bg-green-50 rounded-xl py-2">
                  All steps complete
                </p>
              )}
            </Section>

            {/* 3. Drugs */}
            <Section title="Drugs">
              <div className="space-y-3">
                {level.drugs.map(drug => (
                  <DrugCard key={drug.id} drug={drug} {...sharedDrugProps} />
                ))}
              </div>
            </Section>

            {/* 4. Blood products */}
            {level.bloodProducts && (
              <Section title="Blood Products">
                <div className="space-y-2">
                  {level.bloodProducts.map((bp, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                      <div className="w-1.5 self-stretch rounded-full bg-red-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{bp.product}</p>
                        <p className="text-sm text-red-700 font-medium mt-0.5">{bp.dose}</p>
                        {bp.note && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{bp.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 5. Surgical options (massive) */}
            {level.surgical && (
              <Section title="Surgical Options" sublabel="in order of invasiveness">
                <div className="space-y-2">
                  {level.surgical.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{s.step}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{s.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 6. Post-event care (massive) */}
            {level.postEvent && (
              <Section title="Post-Event Care">
                <div className="space-y-2">
                  {level.postEvent.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex gap-3 items-start">
                      <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <p className="text-sm text-gray-700 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

          </div>

          {/* ── Bottom actions ───────────────────────────────────────── */}
          <div
            className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3 space-y-2"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
            {/* Escalate */}
            {nextLevel ? (
              <button
                onClick={() => escalateLevel(nextLevel.id)}
                className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${ESCALATE_COLORS[activeLevel]}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Escalate → {nextLevel.label} PPH
                <span className="font-normal opacity-80 ml-1">({nextLevel.sublabel})</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-sm font-semibold text-red-700">Maximum escalation level</span>
              </div>
            )}
            {/* Stand down */}
            <button
              onClick={standDown}
              className="w-full py-3 rounded-2xl bg-green-50 border border-green-300 text-green-800 font-semibold text-sm flex items-center justify-center gap-2 active:bg-green-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Stand Down — Resolve Emergency
            </button>
          </div>
        </>
      )}
    </div>
  );
}
