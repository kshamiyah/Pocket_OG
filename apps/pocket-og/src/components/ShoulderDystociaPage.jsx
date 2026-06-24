import { useState, useEffect, useMemo } from "react";
import { SHOULDER_DYSTOCIA_EMERGENCY } from "../data/emergency";

const EM = SHOULDER_DYSTOCIA_EMERGENCY;

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

const LETTER_BG = {
  H: "bg-red-600",
  E: "bg-orange-500",
  L: "bg-amber-500",
  P: "bg-yellow-500",
  R: "bg-blue-600",
};

// ── HELPERR step card ──────────────────────────────────────────────────────
function HelperrCard({ step, stepKey, now, checked, onToggle }) {
  const timestamp = checked.get(stepKey);
  const done = !!timestamp;
  const bg = LETTER_BG[step.letter] || "bg-gray-600";
  const lightText = step.letter === "P" ? "text-gray-900" : "text-white";

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 rounded-2xl px-4 py-4 text-left transition-all ${
        done ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-lg ${bg} ${lightText} ${done ? "opacity-40" : ""}`}>
        {step.letter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-bold leading-snug ${done ? "text-gray-400 line-through" : "text-gray-900"}`}>
            {step.step}
          </p>
          {step.critical && !done && (
            <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded shrink-0">CRITICAL</span>
          )}
          {done && (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <p className={`text-xs mt-1 leading-relaxed whitespace-pre-line ${done ? "text-gray-300" : "text-gray-500"}`}>
          {step.detail}
        </p>
        {done && (
          <p className="text-[10px] text-green-600 font-medium mt-1">
            {fmtTime(timestamp)} · {fmtTimeAgo(timestamp, now)}
          </p>
        )}
      </div>
    </button>
  );
}

// ── Summary screen ─────────────────────────────────────────────────────────
function SummaryScreen({ emergencyStartTime, resolveTime, checked, onNewEmergency, onClose }) {
  const duration = Math.floor((resolveTime - emergencyStartTime) / 1000);

  const timeline = useMemo(() => {
    const events = [{ time: emergencyStartTime, label: "Emergency declared", type: "start" }];
    for (const [key, time] of checked.entries()) {
      const idx = parseInt(key.split("_")[1], 10);
      const step = EM.helperr[idx];
      if (step) events.push({ time, label: `${step.letter} — ${step.step}`, type: "step" });
    }
    events.push({ time: resolveTime, label: "Emergency stood down", type: "end" });
    return events.sort((a, b) => a.time - b.time);
  }, [emergencyStartTime, resolveTime, checked]);

  const dotColor = { start: "bg-red-500", end: "bg-green-500", step: "bg-blue-400" };
  const stepsDone = checked.size;

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
          <h1 className="text-xl font-bold text-white">Shoulder Dystocia Summary</h1>
          <p className="text-xs text-green-300 mt-0.5">
            {fmtTime(emergencyStartTime)} → {fmtTime(resolveTime)}
          </p>
          <div className="flex gap-2 mt-3">
            {[
              { value: fmtClock(duration), label: "Duration" },
              { value: stepsDone, label: "Steps done" },
              { value: EM.helperr.length - stepsDone, label: "Skipped" },
            ].map(stat => (
              <div key={stat.label} className="flex-1 bg-white/15 rounded-xl px-2 py-2.5 text-center">
                <p className="text-base font-bold text-white tabular-nums leading-tight">{stat.value}</p>
                <p className="text-[10px] text-green-200 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-4">
        {/* Timeline */}
        <div className="mx-4 mt-4 mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Timeline</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {timeline.map((event, i) => {
              const isBookend = event.type === "start" || event.type === "end";
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""} ${isBookend ? "bg-gray-50" : ""}`}>
                  <span className="text-xs tabular-nums font-bold text-gray-400 shrink-0 w-11">{fmtTime(event.time)}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[event.type]}`} />
                  <p className={`flex-1 text-sm leading-snug min-w-0 ${isBookend ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>{event.label}</p>
                </div>
              );
            })}
          </div>
          {stepsDone === 0 && (
            <p className="text-xs text-gray-400 text-center mt-3">No HELPERR steps were recorded.</p>
          )}
        </div>

        {/* After delivery */}
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

        {/* MBRRACE */}
        <div className="mx-4 mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">M</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 tracking-wider uppercase mb-1">MBRRACE — Shoulder Dystocia</p>
              <p className="text-sm text-rose-900 leading-relaxed">{EM.mbrrace}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3 flex gap-3"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <button onClick={onNewEmergency} className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm active:bg-black transition-colors">
          New Emergency
        </button>
        <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm active:bg-gray-200 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ShoulderDystociaPage({ onClose }) {
  const [emergencyStartTime] = useState(() => new Date());
  const [checked, setChecked] = useState(new Map());
  const [now, setNow] = useState(() => new Date());
  const [showSummary, setShowSummary] = useState(false);
  const [resolveTime, setResolveTime] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleCheck = (key) =>
    setChecked(prev => {
      const next = new Map(prev);
      next.has(key) ? next.delete(key) : next.set(key, new Date());
      return next;
    });

  const standDown = () => { setResolveTime(new Date()); setShowSummary(true); };

  const handleNewEmergency = () => {
    setChecked(new Map());
    setShowSummary(false);
    setResolveTime(null);
  };

  const elapsed = Math.floor((now - emergencyStartTime) / 1000);
  const fiveMinWarn = elapsed >= 300;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
    >
      {showSummary ? (
        <SummaryScreen
          emergencyStartTime={emergencyStartTime}
          resolveTime={resolveTime}
          checked={checked}
          onNewEmergency={handleNewEmergency}
          onClose={onClose}
        />
      ) : (
        <>
          {/* ── Header ──────────────────────────────────────────────── */}
          <div
            className="bg-red-800 text-white flex-shrink-0"
            style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
          >
            <div className="px-4 pt-2 pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">Emergency Protocol</span>
                  <span className="text-[10px] font-bold bg-red-700 text-red-200 px-2 py-0.5 rounded">GTG42</span>
                </div>
                <h1 className="text-xl font-bold text-white leading-tight">Shoulder Dystocia</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${fiveMinWarn ? "bg-amber-400" : "bg-red-300"}`} />
                  <span className={`text-xs font-mono tabular-nums ${fiveMinWarn ? "text-amber-300 font-bold" : "text-red-200"}`}>
                    {fmtClock(elapsed)} since declared{fiveMinWarn ? " — ⚠ 5 MINS ELAPSED" : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-700/60 hover:bg-red-700 text-white transition-colors mt-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Scrollable content ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto pb-4 pt-4">

            {/* Do NOT warnings */}
            <div className="mx-4 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-bold text-red-500 tracking-wider uppercase mb-2">Do NOT</p>
                <div className="space-y-1.5">
                  {EM.doNot.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-red-800 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HELPERR */}
            <div className="mx-4 mb-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm font-bold text-gray-800">HELPERR</span>
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {checked.size} / {EM.helperr.length}
                </span>
              </div>
              <div className="space-y-2">
                {EM.helperr.map((step, i) => (
                  <HelperrCard
                    key={`step_${i}`}
                    step={step}
                    stepKey={`step_${i}`}
                    now={now}
                    checked={checked}
                    onToggle={() => toggleCheck(`step_${i}`)}
                  />
                ))}
              </div>
            </div>

            {/* Last resorts */}
            <div className="mx-4 mt-4 mb-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm font-bold text-gray-800">Last Resort Manoeuvres</span>
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Only if HELPERR fails</span>
              </div>
              <div className="space-y-2">
                {EM.lastResorts.map((lr, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-red-100 px-4 py-3.5 flex gap-3 items-start shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{lr.step}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{lr.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Bottom bar ───────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
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
