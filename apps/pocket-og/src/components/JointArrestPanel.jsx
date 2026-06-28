import { useState, useEffect } from "react";
import {
  CPR_CYCLE_SEC,
  SHOCK_ENERGY,
  ADRENALINE_INTERVAL_SEC,
  JOINT_ARREST_QUICK_TIMES,
  JOINT_POST_RESUS,
  JOINT_IMMEDIATE_ACTIONS,
  minsAgoToTimestamp,
  cycleRemainingMs,
  adrenalineDue,
  arrestAdrenalineControlVisible,
  arrestAdrenalineCountdownSec,
} from "../data/emergency/cardiac-arrest-shared.js";

export { JOINT_IMMEDIATE_ACTIONS };

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

/** Single compact command bar — cycle timer, rhythm, drugs, ROSC (Option F). */
export function JointArrestCommandBar({
  arrest,
  now,
  interruptActive = false,
  onRhythmCheck,
  onRosc,
  onAdrenaline,
  onAmio300,
  onAmio150,
}) {
  if (!arrest?.active || arrest.rosc) return null;
  const remaining = cycleRemainingMs(arrest, now);
  const due = remaining <= 0;
  const adrDue = adrenalineDue(arrest, now);
  const adrVisible = arrestAdrenalineControlVisible(arrest);
  const adrCountdownSec = arrestAdrenalineCountdownSec(arrest, now);
  const sinceAdr = arrest.lastAdrenalineAt ? (now - arrest.lastAdrenalineAt) / 1000 : null;
  const amio300Due = arrest.shockCount >= 3 && !arrest.amio300Given;
  const amio150Due = arrest.shockCount >= 5 && !arrest.amio150Given;

  if (interruptActive) {
    return (
      <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/25 px-3 py-1.5 flex items-center gap-2 min-h-0">
        <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider shrink-0">⚡ C{arrest.cycleNumber}</span>
        <span className={`font-mono text-lg font-bold tabular-nums shrink-0 ${due ? "text-amber-400" : "text-white"}`}>
          {fmtArrestClock(remaining)}
        </span>
        <span className="text-gray-600 text-[10px] truncate flex-1 min-w-0">{due ? "rhythm due" : "to rhythm"}</span>
        {arrest.shockCount > 0 && (
          <span className="text-gray-600 text-[10px] shrink-0">{arrest.shockCount}× shock</span>
        )}
        <button
          onClick={onRosc}
          className="shrink-0 border border-gray-700 text-gray-300 text-[10px] font-medium px-2 py-1 rounded"
        >
          ROSC
        </button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/25 px-3 py-2 space-y-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider shrink-0">⚡ C{arrest.cycleNumber}</span>
        <span className={`font-mono text-lg font-bold tabular-nums shrink-0 ${due ? "text-amber-400" : "text-white"}`}>
          {fmtArrestClock(remaining)}
        </span>
        <span className="text-gray-600 text-[10px] truncate flex-1 min-w-0">{due ? "rhythm due" : "to rhythm"}</span>
        {arrest.shockCount > 0 && (
          <span className="text-gray-600 text-[10px] shrink-0">{arrest.shockCount} shock{arrest.shockCount === 1 ? "" : "s"}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={onRhythmCheck}
          className={`font-bold py-2 px-3 rounded-lg text-xs min-h-[36px] ${due ? "bg-amber-500 text-gray-950" : "border border-red-800 text-white"}`}
        >
          Rhythm check
        </button>
        {adrVisible && (
          <button
            onClick={onAdrenaline}
            className={`font-bold py-2 px-3 rounded-lg text-xs min-h-[36px] ${
              adrDue ? "bg-amber-500 text-gray-950" : "border border-amber-800/60 text-amber-100"
            }`}
          >
            {adrDue
              ? "Adrenaline — give"
              : adrCountdownSec != null
                ? `Adrenaline ${fmtArrestClock(adrCountdownSec * 1000)}`
                : "Adrenaline — give"}
          </button>
        )}
        {amio300Due && (
          <button onClick={onAmio300} className="font-bold py-2 px-3 rounded-lg text-xs min-h-[36px] bg-amber-500 text-gray-950">
            Amio 300
          </button>
        )}
        {amio150Due && (
          <button onClick={onAmio150} className="font-bold py-2 px-3 rounded-lg text-xs min-h-[36px] bg-amber-500 text-gray-950">
            Amio 150
          </button>
        )}
        <button
          onClick={onRosc}
          className="ml-auto border border-gray-700 text-gray-300 text-xs font-medium px-3 py-2 rounded-lg min-h-[36px]"
        >
          ROSC
        </button>
      </div>
    </div>
  );
}

export function JointArrestRhythmPrompt({ cycleNumber, onShockable, onNonShockable, overlay = false }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([150, 80, 150]); }, []);
  const inner = (
    <>
      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Arrest — pause &lt;5 s</span>
      <p className="text-white text-lg font-bold leading-snug">Rhythm check — cycle {cycleNumber}</p>
      <p className="text-gray-600 text-xs">PPH management continues after this check</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onShockable} className="w-full bg-red-600 text-white font-black py-3 text-sm rounded-lg min-h-[48px]">
          Shockable (VF / pulseless VT)
        </button>
        <button onClick={onNonShockable} className="w-full border border-gray-700 text-white font-bold py-3 text-sm rounded-lg min-h-[48px]">
          Non-shockable (asystole / PEA)
        </button>
      </div>
    </>
  );
  if (overlay) {
    return (
      <div
        className="w-full bg-gray-900 border-t border-red-900/50 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {inner}
      </div>
    );
  }
  return <div className="px-4 py-3.5 space-y-2.5">{inner}</div>;
}

export function JointArrestShockPrompt({ shockNumber, onDelivered, overlay = false }) {
  const triggersAdrenaline = shockNumber >= 3;
  const triggersAmio300 = shockNumber === 3;
  const triggersAmio150 = shockNumber === 5;
  const inner = (
    <>
      <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Arrest — shock</span>
      <p className="text-white text-lg font-bold">Shock #{shockNumber}</p>
      <p className="text-gray-400 text-sm">{SHOCK_ENERGY} — resume CPR immediately</p>
      {(triggersAdrenaline || triggersAmio300 || triggersAmio150) && (
        <div className="text-amber-400/90 text-xs border border-amber-900/50 rounded-lg px-3 py-2 space-y-1">
          {triggersAdrenaline && <p>Give <span className="font-bold">adrenaline 1 mg IV</span> after this shock</p>}
          {triggersAmio300 && <p>Give <span className="font-bold">amiodarone 300 mg IV</span></p>}
          {triggersAmio150 && <p>Give <span className="font-bold">amiodarone 150 mg IV</span></p>}
        </div>
      )}
      <button onClick={onDelivered} className="w-full bg-white text-gray-950 font-black py-3 text-sm rounded-lg min-h-[48px]">
        Shock delivered — resume CPR
      </button>
    </>
  );
  if (overlay) {
    return (
      <div
        className="w-full bg-gray-900 border-t border-red-900/50 rounded-t-2xl px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2.5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {inner}
      </div>
    );
  }
  return <div className="px-4 py-3.5 space-y-2.5">{inner}</div>;
}

/** Postpartum embedded arrest resus action prompt — used in NOW card. */
export function ArrestResusActionPrompt({ action, step, total, onDone }) {
  return (
    <div className="space-y-3">
      {step != null && total != null && (
        <p className="text-gray-500 text-xs tabular-nums">Immediate action {step} of {total}</p>
      )}
      <p className="text-white text-lg font-bold leading-snug">{action.title}</p>
      {action.detail && (
        <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">{action.detail}</p>
      )}
      <button
        type="button"
        onClick={onDone}
        className="w-full bg-white text-gray-950 font-black py-3 text-sm rounded-lg min-h-[48px]"
      >
        Done ✓
      </button>
    </div>
  );
}

export function JointArrestChecklistInline({ arrest, onToggle }) {
  if (!arrest?.active || arrest.rosc) return null;
  const doneSet = arrest.resusActionsDone ?? [];
  const doneCount = JOINT_IMMEDIATE_ACTIONS.filter(a => doneSet.includes(a.id)).length;

  return (
    <div className="border-b border-red-900/30">
      <div className="px-4 py-2 bg-red-950/25 flex items-center gap-2 border-l-4 border-red-500">
        <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">Cardiac arrest</span>
        <span className="text-gray-600 text-[10px] ml-auto tabular-nums">{doneCount}/{JOINT_IMMEDIATE_ACTIONS.length}</span>
      </div>
      {JOINT_IMMEDIATE_ACTIONS.map(a => {
        const done = doneSet.includes(a.id);
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onToggle(a.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-4 transition active:opacity-80 ${
              done
                ? "border-red-900/20 bg-transparent"
                : "border-red-500 bg-red-950/15"
            }`}
          >
            <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
              done ? "bg-red-900/40 text-red-300" : "border border-red-600/70 text-transparent"
            }`}>✓</span>
            <span className={`text-sm flex-1 min-w-0 leading-snug ${done ? "text-gray-600 line-through" : "text-white font-medium"}`}>
              {a.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function JointArrestResusLane({ arrest, onToggle, compact = true }) {
  const [expanded, setExpanded] = useState(!compact);
  if (!arrest?.active || arrest.rosc) return null;
  const doneSet = arrest.resusActionsDone ?? [];
  const doneCount = JOINT_IMMEDIATE_ACTIONS.filter(a => doneSet.includes(a.id)).length;
  const pending = JOINT_IMMEDIATE_ACTIONS.filter(a => !doneSet.includes(a.id));
  const showAll = expanded || !compact;
  const visible = showAll ? JOINT_IMMEDIATE_ACTIONS : pending.slice(0, 2);

  return (
    <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/15">
      <button
        type="button"
        onClick={() => setExpanded(o => !o)}
        className="w-full px-4 py-2.5 border-b border-red-900/25 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
            Resus checklist — {doneCount}/{JOINT_IMMEDIATE_ACTIONS.length}
          </span>
          <span className="text-gray-600 text-xs shrink-0">{showAll ? "↑ less" : "↓ all"}</span>
        </div>
        {!showAll && pending.length > 0 && (
          <p className="text-gray-600 text-[11px] mt-0.5 leading-snug truncate">
            Next: {pending[0].title}
          </p>
        )}
      </button>
      <div className="px-4 py-2 space-y-1.5">
        {visible.map(a => {
          const done = doneSet.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg border transition ${
                done ? "border-gray-800 bg-gray-900/50" : "border-red-900/40 bg-red-950/20"
              }`}
            >
              <span className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                done ? "bg-white text-gray-950" : "border border-red-700/60 text-transparent"
              }`}>✓</span>
              <span className="min-w-0">
                <span className={`block text-xs font-bold leading-snug ${done ? "text-gray-500 line-through" : "text-white"}`}>{a.title}</span>
                {!done && showAll && (
                  <span className="block text-gray-500 text-[11px] leading-relaxed mt-0.5">{a.detail}</span>
                )}
              </span>
            </button>
          );
        })}
        {!showAll && pending.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full text-center text-gray-600 text-xs py-1"
          >
            +{pending.length - 2} more — show all
          </button>
        )}
      </div>
    </div>
  );
}

export function JointArrestPostResusPanel({ arrest, onToggle, onCollapse, onExpand }) {
  if (!arrest?.rosc) return null;

  const doneSet = arrest.postResusDone ?? [];
  const doneCount = JOINT_POST_RESUS.filter(p => doneSet.includes(p.id)).length;
  const statsLine = `${arrest.cycleNumber} cycle${arrest.cycleNumber === 1 ? "" : "s"} · ${arrest.shockCount} shock${arrest.shockCount === 1 ? "" : "s"} · ${arrest.adrenalineCount} adrenaline${
    (arrest.amio300Given || arrest.amio150Given)
      ? ` · ${arrest.amio150Given ? "amio 450 mg" : "amio 300 mg"}`
      : ""
  }`;

  if (arrest.postResusCollapsed) {
    return (
      <div className="flex-shrink-0 border-b border-emerald-900/40 bg-emerald-950/20 px-4 py-2 flex items-center justify-between gap-2">
        <button type="button" onClick={onExpand} className="flex-1 text-left min-w-0">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">ROSC — post-arrest care</p>
          <p className="text-gray-500 text-xs truncate">{statsLine} · {doneCount}/{JOINT_POST_RESUS.length} done</p>
        </button>
        <button type="button" onClick={onExpand} className="text-emerald-400/80 text-xs border border-emerald-900/60 px-2 py-1 rounded shrink-0">Expand</button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 border-b border-emerald-900/40 bg-emerald-950/20">
      <div className="px-4 py-2.5 flex items-start justify-between gap-2 border-b border-emerald-900/30">
        <div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">ROSC — post-arrest care</p>
          <p className="text-gray-400 text-xs mt-0.5">{statsLine}</p>
          <p className="text-gray-600 text-[11px] mt-1">PPH haemorrhage management continues on this screen</p>
        </div>
        <button type="button" onClick={onCollapse} className="text-gray-600 text-xs border border-gray-800 px-2 py-1 rounded shrink-0">Minimize</button>
      </div>
      <div className="px-4 py-2.5 space-y-1.5">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
          Post-resuscitation — {doneCount}/{JOINT_POST_RESUS.length}
        </p>
        {JOINT_POST_RESUS.map(p => {
          const done = doneSet.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggle(p.id)}
              className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg border transition ${
                done ? "border-gray-800 bg-gray-900/50" : "border-emerald-900/40"
              }`}
            >
              <span className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                done ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"
              }`}>✓</span>
              <span className={`text-xs leading-snug ${done ? "text-gray-500 line-through" : "text-white"}`}>{p.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
