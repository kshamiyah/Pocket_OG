import { fmtMmSs } from "./sos-ui.jsx";
import { pphLevelVal, effectiveUterotonicDelaySec, effectiveCarboRepeatDelaySec } from "../data/emergency/pph-shared.js";
import {
  bloodLossRate,
  isBloodCheckEvent,
  reassessInterval,
  bleedingSettled,
  hadBloodCheckSince,
  txaEligible,
  getLastUterotonic,
  getNextUterotonic,
} from "../data/emergency/pph-logic.js";

const UTEROTONIC_SHORT = {
  oxytocin_bolus: "Oxy bolus",
  oxytocin_inf: "Oxy inf",
  ergometrine: "Ergo",
  carboprost: "Carbo",
  misoprostol: "Misoprostol",
};

function bloodCheckCountdown(log, now, level, sessionRecoveredAt) {
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  if (!lastCheck) return null;
  const intervalSec = reassessInterval(bloodLossRate(log, now), level);
  const anchor = Math.max(lastCheck.time, sessionRecoveredAt ?? 0);
  const dueAt = anchor + intervalSec * 1000;
  return { remainingMs: dueAt - now, intervalSec, overdue: now >= dueAt };
}

function collectAssignedFollowUps(tasks, taskStates, level, now, forcedTasks, assignedStripLabels, callTaskVisible) {
  const forced = forcedTasks || [];
  const list = [];
  for (const t of tasks) {
    if (!t.followUpDelay) continue;
    if (t.special === "carbo") continue;
    const state = taskStates[t.id];
    if (state?.status !== "assigned" || !state.assignedAt) continue;
    if (pphLevelVal(t.level) > pphLevelVal(level) && !forced.includes(t.id)) continue;
    if (callTaskVisible && !callTaskVisible(t, level)) continue;
    const delayMs = t.followUpDelay * 1000;
    const remainingMs = state.assignedAt + delayMs - now;
    const label = assignedStripLabels?.[t.id] ?? t.title.split("—")[0].trim().slice(0, 16);
    list.push({ id: t.id, label, remainingMs, overdue: remainingMs <= 0, delayMs });
  }
  list.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    return a.remainingMs - b.remainingMs;
  });
  return list;
}

function buildUterotonicRow({ taskStates, level, log, now, uterotonicHold, forcedTasks }) {
  const next = getNextUterotonic(taskStates, level, forcedTasks);
  if (!next) return null;
  const last = getLastUterotonic(taskStates);
  if (!last) return null;

  const label = UTEROTONIC_SHORT[next.id] ?? next.title.split(" ")[0];
  if (uterotonicHold && bleedingSettled(log, now)) {
    return { key: "uterotonic", label, sublabel: "Hold — settled", overdue: false, waiting: true };
  }

  const rate = bloodLossRate(log, now);
  const delayMs = effectiveUterotonicDelaySec(last.id, rate) * 1000;
  const pharmRemaining = last.at + delayMs - now;
  if (pharmRemaining > 0) {
    return { key: "uterotonic", label, remainingMs: pharmRemaining, delayMs, overdue: false };
  }
  if (!hadBloodCheckSince(log, last.at)) {
    return { key: "uterotonic", label, sublabel: "Check blood loss", overdue: true };
  }
  return { key: "uterotonic", label, remainingMs: 0, overdue: true };
}

function CountdownRow({ label, remainingMs, overdue, delayMs, sublabel, onClick, asButton = false }) {
  const rem = remainingMs != null ? Math.max(0, remainingMs) : null;
  const Tag = asButton ? "button" : "div";
  return (
    <Tag
      type={asButton ? "button" : undefined}
      onClick={onClick}
      className={`w-full flex items-center gap-3 text-left ${asButton ? "active:opacity-80 transition" : ""}`}
    >
      <span className="text-gray-600 text-xs w-24 shrink-0 truncate" title={label}>{label}</span>
      <div className="flex-1 bg-gray-800 h-px relative">
        {!overdue && rem != null && delayMs != null && (
          <div
            className="absolute top-0 left-0 h-px bg-gray-500 transition-all"
            style={{ width: `${Math.max(0, Math.min(100, (1 - rem / delayMs) * 100))}%` }}
          />
        )}
        {overdue && <div className="absolute top-0 left-0 h-px w-full bg-amber-400" />}
      </div>
      <span className={`text-xs font-mono tabular-nums w-14 text-right shrink-0 ${overdue ? "text-amber-400 font-bold" : "text-gray-500"}`}>
        {sublabel ?? (overdue ? "due now" : fmtMmSs(rem))}
      </span>
    </Tag>
  );
}

/**
 * PPH drug / timing strip — full mode on PPH-only; compact during joint arrest (TXA 2nd, carbo, uterotonics).
 */
export function SosDrugStrip({
  variant = "full",
  tasks,
  txaTime,
  txaSecondDone,
  taskStates,
  level,
  birthTime,
  carboCount,
  carboLastTime,
  log,
  sessionRecoveredAt,
  now,
  forcedTasks,
  uterotonicHold = false,
  onAssignedTap,
  assignedStripLabels,
  callTaskVisible,
}) {
  const compact = variant === "compact";
  const items = [];
  const levelVal = pphLevelVal(level);

  if (!compact) {
    const bloodDue = bloodCheckCountdown(log, now, level, sessionRecoveredAt);
    if (bloodDue) {
      const { remainingMs, overdue } = bloodDue;
      items.push(
        <CountdownRow
          key="blood"
          label="Blood check"
          remainingMs={remainingMs}
          overdue={overdue}
          delayMs={bloodDue.intervalSec * 1000}
        />
      );
    }

    const assignedChases = collectAssignedFollowUps(tasks, taskStates, level, now, forcedTasks, assignedStripLabels, callTaskVisible);
    const shownChases = assignedChases.slice(0, 3);
    const overflowChases = assignedChases.length - shownChases.length;
    for (const chase of shownChases) {
      items.push(
        <CountdownRow
          key={`assigned-${chase.id}`}
          label={chase.label}
          remainingMs={chase.remainingMs}
          overdue={chase.overdue}
          delayMs={chase.delayMs}
          onClick={() => onAssignedTap?.(chase.id)}
          asButton
        />
      );
    }
    if (overflowChases > 0) {
      items.push(
        <p key="assigned-overflow" className="text-gray-600 text-xs pl-[6.75rem]">
          +{overflowChases} more assigned
        </p>
      );
    }

    const windowMs = 3 * 60 * 60 * 1000;
    const birthWindowRemaining = Math.max(0, birthTime + windowMs - now);
    const txaRelevant = levelVal >= pphLevelVal("major");
    const ivReady = taskStates.iv_access?.status === "done";
    const txaFirstGiven = !!txaTime;
    const txaAwaitingFirst = txaEligible(taskStates, level, txaTime);
    const showFirstDoseWindow = txaRelevant && birthWindowRemaining > 0 && !txaFirstGiven && txaAwaitingFirst && ivReady;

    if (showFirstDoseWindow) {
      const pct = Math.max(0, Math.min(100, (birthWindowRemaining / windowMs) * 100));
      const urgent = birthWindowRemaining < 30 * 60 * 1000;
      items.push(
        <div key="txa-first" className="flex items-center gap-3">
          <span className="text-gray-600 text-xs w-24 shrink-0">TXA window</span>
          <div className="flex-1 bg-gray-800 h-px relative">
            <div className={`absolute top-0 left-0 h-px transition-all ${urgent ? "bg-orange-400" : "bg-gray-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className={`text-xs font-mono tabular-nums w-14 text-right shrink-0 ${urgent ? "text-orange-400" : "text-gray-500"}`}>
            {fmtMmSs(birthWindowRemaining)}
          </span>
        </div>
      );
    }
  }

  const windowMs = 3 * 60 * 60 * 1000;
  const birthWindowRemaining = Math.max(0, birthTime + windowMs - now);
  const txaRelevant = levelVal >= pphLevelVal("major");
  const txaFirstGiven = !!txaTime;
  const secondDoseDelayMs = 30 * 60 * 1000;
  const showSecondDoseWindow = txaRelevant && txaFirstGiven && !txaSecondDone && birthWindowRemaining > 0;
  if (showSecondDoseWindow) {
    const eligibleAt = txaTime + secondDoseDelayMs;
    const untilEligible = Math.max(0, eligibleAt - now);
    const secondDoseDue = now >= eligibleAt;
    items.push(
      <CountdownRow
        key="txa-second"
        label={secondDoseDue ? "2nd dose" : "2nd dose in"}
        remainingMs={untilEligible}
        overdue={secondDoseDue}
        delayMs={secondDoseDelayMs}
      />
    );
  }

  if (carboCount > 0) {
    const carboDelayMs = carboLastTime
      ? effectiveCarboRepeatDelaySec(bloodLossRate(log, now)) * 1000
      : null;
    const nextMs = carboLastTime && carboDelayMs != null
      ? Math.max(0, carboLastTime + carboDelayMs - now)
      : null;
    const due = nextMs === 0;
    items.push(
      <div key="carbo" className="flex items-center gap-3">
        <span className="text-gray-600 text-xs w-24 shrink-0">Carboprost</span>
        <span className="text-gray-500 text-xs">{carboLastTime ? `${carboCount} / 8` : "assigned"}</span>
        {!carboLastTime && (
          <span className="text-amber-500 text-xs ml-auto">confirm dose 1</span>
        )}
        {nextMs !== null && carboCount < 8 && (
          <span className={`text-xs font-mono ml-auto tabular-nums ${due ? "text-amber-400 font-bold" : "text-gray-600"}`}>
            {due ? "dose due now" : `next in ${fmtMmSs(nextMs)}`}
          </span>
        )}
        {carboCount >= 8 && <span className="text-gray-700 text-xs ml-auto">max doses</span>}
      </div>
    );
  }

  const utRow = buildUterotonicRow({ taskStates, level, log, now, uterotonicHold, forcedTasks });
  if (utRow) {
    items.push(
      <CountdownRow
        key={utRow.key}
        label={utRow.label}
        remainingMs={utRow.remainingMs}
        overdue={utRow.overdue}
        delayMs={utRow.delayMs}
        sublabel={utRow.sublabel}
      />
    );
  }

  if (!items.length) return null;

  return (
    <div className={`px-4 py-2.5 border-b border-gray-800 flex-shrink-0 space-y-2 ${compact ? "bg-gray-950/90" : ""}`}>
      {compact && (
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">PPH drugs</p>
      )}
      {items}
    </div>
  );
}
