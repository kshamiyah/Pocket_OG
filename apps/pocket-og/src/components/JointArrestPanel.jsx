import { useState, useEffect } from "react";
import {
  CPR_CYCLE_SEC,
  SHOCK_ENERGY,
  JOINT_ARREST_QUICK_TIMES,
  minsAgoToTimestamp,
  cycleRemainingMs,
} from "../data/emergency/cardiac-arrest-shared.js";

function pad(n) { return String(n).padStart(2, "0"); }

export function fmtArrestClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function QuickTimePicker({ label, minsAgo, onSelect, helper, error, footer }) {
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {JOINT_ARREST_QUICK_TIMES.map(opt => (
          <button
            key={opt.mins}
            type="button"
            onClick={() => onSelect(opt.mins)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
              minsAgo === opt.mins
                ? "bg-white text-gray-950 border-white"
                : "border-gray-800 text-gray-300 hover:border-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {footer}
      {minsAgo != null && (
        <p className="text-gray-500 text-xs tabular-nums">
          ≈ {new Date(minsAgoToTimestamp(minsAgo)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {!error && helper && <p className="text-gray-600 text-xs">{helper}</p>}
    </div>
  );
}

/** Inline setup after 2222 — stays on PPH screen (Option F). */
export function JointArrestSetupSheet({ onConfirm, onCancel }) {
  const [collapseMinsAgo, setCollapseMinsAgo] = useState(0);
  const [cprSameAsCollapse, setCprSameAsCollapse] = useState(true);
  const [cprMinsAgo, setCprMinsAgo] = useState(0);

  const cprBeforeCollapse = !cprSameAsCollapse && cprMinsAgo > collapseMinsAgo;
  const cprError = cprBeforeCollapse ? "CPR cannot start before collapse." : null;

  return (
    <div className="fixed inset-0 bg-black/85 z-[56] flex items-end p-4" onClick={onCancel}>
      <div
        className="bg-gray-900 border border-red-900/50 rounded-xl p-5 w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">2222 called</p>
        <h2 className="text-white text-xl font-black mb-1">Start CPR — continue PPH resus</h2>
        <p className="text-gray-500 text-sm mb-4">
          Postpartum arrest — PMCS/MLUD not indicated. Haemorrhage control continues on this screen.
        </p>

        <div className="space-y-4 mb-5">
          <QuickTimePicker
            label="Collapse occurred at"
            minsAgo={collapseMinsAgo}
            onSelect={setCollapseMinsAgo}
            helper="Tap when collapse happened"
          />
          <QuickTimePicker
            label="CPR started at"
            minsAgo={cprSameAsCollapse ? collapseMinsAgo : cprMinsAgo}
            onSelect={(mins) => { setCprSameAsCollapse(false); setCprMinsAgo(mins); }}
            footer={(
              <button
                type="button"
                onClick={() => setCprSameAsCollapse(true)}
                className={`mt-1 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                  cprSameAsCollapse
                    ? "bg-gray-800 text-white border-gray-600"
                    : "border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                Same as collapse
              </button>
            )}
            error={cprError}
            helper="CPR cycles start from this time"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            disabled={!!cprError}
            onClick={() => onConfirm({ collapseMinsAgo, cprSameAsCollapse, cprMinsAgo })}
            className="w-full bg-red-600 text-white font-black py-3.5 rounded-xl text-sm disabled:opacity-40"
          >
            Start CPR — continue PPH
          </button>
          <button onClick={onCancel} className="text-gray-600 text-sm py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/** Persistent strip — cycle timer always visible during embedded arrest. */
export function JointArrestStrip({ arrest, now, onRhythmCheck, onRosc }) {
  if (!arrest?.active || arrest.rosc) return null;
  const remaining = cycleRemainingMs(arrest, now);
  const due = remaining <= 0;

  return (
    <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/25 px-4 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-red-400 text-xs font-bold uppercase tracking-wider">⚡ Arrest active</span>
        <span className="text-red-300/80 text-xs">2222 · postpartum</span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-gray-500 text-xs">Cycle {arrest.cycleNumber}</span>
        <span className={`font-mono text-2xl font-bold tabular-nums ${due ? "text-amber-400" : "text-white"}`}>
          {fmtArrestClock(remaining)}
        </span>
        <span className="text-gray-600 text-xs">{due ? "rhythm check due" : "to rhythm check"}</span>
        {arrest.shockCount > 0 && (
          <span className="text-gray-600 text-xs ml-auto">{arrest.shockCount} shock{arrest.shockCount === 1 ? "" : "s"}</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRhythmCheck}
          className={`flex-1 font-bold py-2.5 rounded-lg text-sm ${due ? "bg-amber-500 text-gray-950" : "border border-red-800 text-white"}`}
        >
          Rhythm check
        </button>
        <button
          onClick={onRosc}
          className="shrink-0 border border-gray-700 text-gray-300 text-xs font-medium px-3 py-2.5 rounded-lg"
        >
          ROSC
        </button>
      </div>
    </div>
  );
}

export function JointArrestRhythmPrompt({ cycleNumber, onShockable, onNonShockable }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([150, 80, 150]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Arrest — pause &lt;5 s</span>
      <p className="text-white text-xl font-bold">Rhythm check — cycle {cycleNumber}</p>
      <p className="text-gray-600 text-xs">PPH management continues after this check</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onShockable} className="w-full bg-red-600 text-white font-black py-3 text-sm rounded-lg">
          Shockable (VF / pulseless VT)
        </button>
        <button onClick={onNonShockable} className="w-full border border-gray-700 text-white font-bold py-3 text-sm rounded-lg">
          Non-shockable (asystole / PEA)
        </button>
      </div>
    </div>
  );
}

export function JointArrestShockPrompt({ shockNumber, onDelivered }) {
  const triggersAdrenaline = shockNumber >= 3;
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Arrest — shock</span>
      <p className="text-white text-xl font-bold">Shock #{shockNumber}</p>
      <p className="text-gray-400 text-sm">{SHOCK_ENERGY} — resume CPR immediately</p>
      {triggersAdrenaline && (
        <p className="text-amber-400/90 text-xs border border-amber-900/50 rounded-lg px-3 py-2">
          Give adrenaline 1 mg IV after this shock
        </p>
      )}
      <button onClick={onDelivered} className="w-full bg-white text-gray-950 font-black py-3 text-sm rounded-lg">
        Shock delivered — resume CPR
      </button>
    </div>
  );
}

export function JointArrestRoscBanner({ arrest, onDismiss }) {
  if (!arrest?.rosc) return null;
  return (
    <div className="flex-shrink-0 border-b border-emerald-900/40 bg-emerald-950/20 px-4 py-2.5 flex items-center justify-between gap-2">
      <div>
        <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">ROSC</p>
        <p className="text-gray-400 text-xs">
          {arrest.cycleNumber} cycle{arrest.cycleNumber === 1 ? "" : "s"} · {arrest.shockCount} shock{arrest.shockCount === 1 ? "" : "s"} · {arrest.adrenalineCount} adrenaline
        </p>
      </div>
      <button onClick={onDismiss} className="text-gray-600 text-xs border border-gray-800 px-2 py-1 rounded">Dismiss</button>
    </div>
  );
}
