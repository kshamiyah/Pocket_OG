import { useState } from "react";
import {
  CPR_CYCLE_SEC,
  ADRENALINE_INTERVAL_SEC,
  cycleRemainingMs,
  adrenalineDue,
  arrestAdrenalineControlVisible,
  arrestAdrenalineCountdownSec,
} from "../data/emergency/cardiac-arrest-shared.js";
import {
  JointArrestRhythmPrompt,
  JointArrestShockPrompt,
  ArrestResusActionPrompt,
  fmtArrestClock,
} from "./JointArrestPanel.jsx";

function fmtElapsed(ms) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatNextUpWhen(item, now) {
  if (item.overdue && !item.manual) return "due";
  if (item.manual) return "tick";
  const rem = item.dueAt - now;
  if (rem <= 0) return "due";
  const sec = Math.ceil(rem / 1000);
  return fmtElapsed(sec * 1000);
}

function nowLaneLabel(prompt) {
  if (!prompt) return null;
  if (["arrest_rhythm", "arrest_shock", "arrest_adrenaline", "arrest_amio", "arrest_resus"].includes(prompt.type)) {
    return "arrest";
  }
  return "pph";
}

/** Fixed instrument strip — PPH clock, blood loss, arrest cycle bar, adrenaline. */
export function JointInstrumentStrip({
  pphElapsed,
  bloodLoss,
  bloodLossClass,
  levelLabel,
  onAddBlood,
  onExit,
  onStandDown,
  arrest,
  now,
  onRhythmCheck,
  onRosc,
  onAdrenaline,
  onAmio300,
  onAmio150,
  showPph = true,
  bloodCheckDue = null,
}) {
  const remaining = cycleRemainingMs(arrest, now);
  const cycleDue = remaining <= 0;
  const cycleMs = CPR_CYCLE_SEC * 1000;
  const progress = Math.max(0, Math.min(1, 1 - remaining / cycleMs));
  const adrDue = adrenalineDue(arrest, now);
  const adrVisible = arrestAdrenalineControlVisible(arrest);
  const adrCountdownSec = arrestAdrenalineCountdownSec(arrest, now);
  const amio300Due = arrest.shockCount >= 3 && !arrest.amio300Given;
  const amio150Due = arrest.shockCount >= 5 && !arrest.amio150Given;

  return (
    <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900 px-3 py-2 space-y-2">
      {showPph && (
        <>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-white font-bold tabular-nums text-lg">{fmtElapsed(pphElapsed)}</span>
            <span className="text-gray-600 text-[10px] truncate">{levelLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[10px] font-mono tabular-nums">
            <span className={cycleDue ? "text-amber-400 font-bold" : "text-red-400"}>
              ⚡ {fmtArrestClock(remaining)} rhythm
            </span>
            {adrVisible && (adrDue ? (
              <span className="text-amber-400 font-bold">Adrenaline due</span>
            ) : adrCountdownSec != null ? (
              <span className="text-amber-400/90">Adrenaline {fmtArrestClock(adrCountdownSec * 1000)}</span>
            ) : null)}
            {bloodCheckDue && (
              <span className={bloodCheckDue.overdue ? "text-amber-400 font-bold" : "text-gray-500"}>
                Blood {bloodCheckDue.overdue ? "due" : fmtArrestClock(Math.max(0, bloodCheckDue.remainingMs))}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onExit} className="text-gray-600 text-[10px] border border-gray-800 px-2 py-1 rounded">Exit</button>
          <button onClick={onStandDown} className="text-gray-600 text-[10px] border border-gray-800 px-2 py-1 rounded">Stand down</button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-black tabular-nums text-xl ${bloodLossClass}`}>{bloodLoss} ml</span>
        <div className="flex gap-1 flex-1 min-w-0">
          {[100, 250, 500].map(n => (
            <button
              key={n}
              onClick={() => onAddBlood(n)}
              className="flex-1 text-gray-300 border border-gray-800 rounded text-xs py-1.5 font-medium min-h-[36px]"
            >
              +{n}
            </button>
          ))}
        </div>
      </div>
        </>
      )}

      <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="text-red-400 font-bold uppercase tracking-wider">⚡ Cycle {arrest.cycleNumber}</span>
          <span className={`font-mono tabular-nums ${cycleDue ? "text-amber-400 font-bold" : "text-white"}`}>
            {fmtArrestClock(remaining)}
          </span>
          {arrest.shockCount > 0 && (
            <span className="text-gray-600">{arrest.shockCount} shock{arrest.shockCount === 1 ? "" : "s"}</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className={`h-full transition-all ${cycleDue ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            onClick={onRhythmCheck}
            className={`font-bold py-1.5 px-3 rounded-lg text-xs min-h-[32px] ${cycleDue ? "bg-amber-500 text-gray-950" : "border border-red-800 text-white"}`}
          >
            Rhythm check
          </button>
          {adrVisible && (
            <button
              onClick={onAdrenaline}
              className={`font-bold py-1.5 px-3 rounded-lg text-xs min-h-[32px] ${
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
            <button onClick={onAmio300} className="font-bold py-1.5 px-3 rounded-lg text-xs min-h-[32px] bg-amber-500 text-gray-950">
              Amio 300
            </button>
          )}
          {amio150Due && (
            <button onClick={onAmio150} className="font-bold py-1.5 px-3 rounded-lg text-xs min-h-[32px] bg-amber-500 text-gray-950">
              Amio 150
            </button>
          )}
          <button
            onClick={onRosc}
            className="ml-auto border border-gray-700 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg min-h-[32px]"
          >
            ROSC
          </button>
        </div>
      </div>
    </div>
  );
}

/** Single primary action — rhythm, shock, resus tasks, PPH prompts, or adr. */
export function JointNowCard({ prompt, nowContent, onAdrenaline, onAmio300, onAmio150, arrest }) {
  if (!prompt) {
    return (
      <div className="flex-shrink-0 border-b border-gray-800 bg-gray-950 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Now</p>
        <p className="text-gray-600 text-sm">Continue checklists — next timed action in Coming up</p>
      </div>
    );
  }

  const lane = nowLaneLabel(prompt);

  if (prompt.type === "arrest_adrenaline") {
    return (
      <div className="flex-shrink-0 border-b border-amber-900/40 bg-amber-950/15">
        <div className="px-4 py-2 flex items-center gap-2 border-b border-amber-900/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
          <span className="text-[10px] font-bold uppercase text-red-400">Arrest</span>
        </div>
        <div className="px-4 py-3.5 space-y-2">
          <p className="text-white text-lg font-bold">Adrenaline 1 mg IV — due</p>
          <button onClick={onAdrenaline} className="w-full bg-amber-500 text-gray-950 font-black py-3 text-sm rounded-lg min-h-[48px]">
            Log dose given
          </button>
        </div>
      </div>
    );
  }

  if (prompt.type === "arrest_rhythm") {
    return (
      <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/20">
        <div className="px-4 py-2 flex items-center gap-2 border-b border-red-900/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
          <span className="text-[10px] font-bold uppercase text-red-400">Arrest</span>
        </div>
        <div className="px-4 py-3">
          <JointArrestRhythmPrompt
            cycleNumber={prompt.cycleNumber}
            onShockable={prompt.onShockable}
            onNonShockable={prompt.onNonShockable}
          />
        </div>
      </div>
    );
  }

  if (prompt.type === "arrest_shock") {
    return (
      <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/20">
        <div className="px-4 py-2 flex items-center gap-2 border-b border-red-900/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
          <span className="text-[10px] font-bold uppercase text-red-400">Arrest</span>
        </div>
        <div className="px-4 py-3">
          <JointArrestShockPrompt shockNumber={prompt.shockNumber} onDelivered={prompt.onDelivered} />
        </div>
      </div>
    );
  }

  if (prompt.type === "arrest_amio") {
    return (
      <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/20">
        <div className="px-4 py-2 flex items-center gap-2 border-b border-red-900/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
          <span className="text-[10px] font-bold uppercase text-red-400">Arrest</span>
        </div>
        <div className="px-4 py-3.5 space-y-2">
          <p className="text-white text-lg font-bold">Amiodarone {prompt.dose} mg IV</p>
          <button
            type="button"
            onClick={prompt.dose === 300 ? onAmio300 : onAmio150}
            className="w-full bg-amber-500 text-gray-950 font-black py-3 text-sm rounded-lg min-h-[48px]"
          >
            Log {prompt.dose} mg given
          </button>
        </div>
      </div>
    );
  }

  if (prompt.type === "arrest_resus") {
    return (
      <div className="flex-shrink-0 border-b border-red-900/40 bg-red-950/20">
        <div className="px-4 py-2 flex items-center gap-2 border-b border-red-900/25">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
          <span className="text-[10px] font-bold uppercase text-red-400">Arrest</span>
        </div>
        <div className="px-4 py-3">
          <ArrestResusActionPrompt
            action={prompt.action}
            step={prompt.step}
            total={prompt.total}
            onDone={prompt.onDone}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 border-b border-gray-700 bg-gray-900">
      <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Now</span>
        {lane && (
          <span className={`text-[10px] font-bold uppercase ${lane === "arrest" ? "text-red-400" : "text-amber-400"}`}>
            {lane === "arrest" ? "Arrest" : "PPH"}
          </span>
        )}
      </div>
      {nowContent}
    </div>
  );
}

export function JointComingUpPanel({ items, now, skipFirst = false }) {
  const visible = skipFirst ? items.slice(1) : items;
  if (!visible.length) return null;
  return (
    <div className="flex-shrink-0 border-b border-gray-800 bg-gray-950 px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Coming up</p>
        <p className="text-[10px] text-gray-600">
          <span className="text-red-400">●</span> Arrest
          <span className="mx-1">·</span>
          <span className="text-amber-400">●</span> PPH
        </p>
      </div>
      <div className="space-y-0.5">
        {visible.slice(0, 5).map((item, i) => (
          <div key={`${item.lane}-${item.kind}-${i}`} className="flex items-center gap-2 py-1 min-h-[26px]">
            <span className={`text-[10px] font-bold uppercase w-11 shrink-0 ${item.lane === "arrest" ? "text-red-400" : "text-amber-400"}`}>
              {item.lane === "arrest" ? "Arrest" : "PPH"}
            </span>
            <span className={`flex-1 text-xs truncate ${item.overdue ? "text-gray-300" : "text-gray-500"}`}>{item.label}</span>
            <span className="text-[11px] font-mono tabular-nums text-gray-600 shrink-0">{formatNextUpWhen(item, now)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CollapsibleArrestChecklist({ arrest, actions, title = "Cardiac arrest", onToggle, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!arrest || arrest.rosc || arrest.active === false) return null;
  const doneSet = arrest.resusActionsDone ?? arrest.actionsDone ?? [];
  const doneCount = actions.filter(a => doneSet.includes(a.id)).length;
  const pending = actions.filter(a => !doneSet.includes(a.id));

  return (
    <div className="border-b border-red-900/30 border-l-4 border-l-red-500">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left bg-red-950/15"
      >
        <span className="text-red-400 text-xs font-bold uppercase tracking-wider flex-1">
          {title} · {doneCount}/{actions.length}
        </span>
        <span className="text-gray-600 text-xs">{open ? "↑" : "↓"}</span>
      </button>
      {!open && pending.length > 0 && (
        <div className="px-4 pb-2 space-y-1">
          {pending.slice(0, 2).map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              className="w-full flex items-center gap-2 py-2 text-left rounded-lg border border-red-900/30 bg-red-950/10 px-3"
            >
              <span className="w-4 h-4 rounded border border-red-600/70 shrink-0" />
              <span className="text-white text-xs font-medium truncate">{a.title}</span>
            </button>
          ))}
          {pending.length > 2 && (
            <p className="text-gray-600 text-[10px] text-center py-1">+{pending.length - 2} more — expand</p>
          )}
        </div>
      )}
      {open && (
        <div className="pb-1">
          {actions.map(a => {
            const done = doneSet.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onToggle(a.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-4 ${
                  done ? "border-transparent opacity-60" : "border-red-500/80 bg-red-950/10"
                }`}
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  done ? "bg-red-900/40 text-red-300" : "border border-red-600/70"
                }`}>✓</span>
                <span className={`text-sm ${done ? "line-through text-gray-600" : "text-white"}`}>{a.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CollapsiblePphSection({ title, countLabel, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-amber-900/20 border-l-4 border-l-amber-500/80">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left bg-amber-950/10 sticky top-0 z-[1]"
      >
        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex-1">{title}</span>
        {countLabel && <span className="text-gray-600 text-[10px] tabular-nums">{countLabel}</span>}
        <span className="text-gray-600 text-xs">{open ? "↑" : "↓"}</span>
      </button>
      {open && children}
    </div>
  );
}

export { JointNowCard as ArrestNowCard };
