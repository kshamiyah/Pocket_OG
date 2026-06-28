// Shared maternal cardiac arrest timing + CPR cycle logic.
// Used by standalone CardiacArrestPage and PPH-embedded (Option F) joint arrest.

export const PMCS_DECISION_SEC = 4 * 60;
export const PMCS_DELIVERY_SEC = 5 * 60;
export const CPR_CYCLE_SEC = 2 * 60;
export const ADRENALINE_INTERVAL_SEC = 180;
export const SHOCK_ENERGY = "200 J biphasic";

export const JOINT_ARREST_QUICK_TIMES = [
  { label: "Now", mins: 0 },
  { label: "1m ago", mins: 1 },
  { label: "2m ago", mins: 2 },
  { label: "3m ago", mins: 3 },
  { label: "4m ago", mins: 4 },
  { label: "5m ago", mins: 5 },
];

export function minsAgoToTimestamp(minsAgo, now = Date.now()) {
  return now - minsAgo * 60 * 1000;
}

export function initialCycleFromCprStart(cprStartTime, now = Date.now()) {
  const elapsed = Math.max(0, now - cprStartTime);
  const cycleMs = CPR_CYCLE_SEC * 1000;
  const intoCycle = elapsed % cycleMs;
  const dueNow = elapsed > 0 && intoCycle === 0;
  return {
    cycleNumber: Math.floor(elapsed / cycleMs) + 1,
    cycleStart: dueNow ? now - cycleMs : now - intoCycle,
  };
}

export function emptyJointArrestState() {
  return {
    active: false,
    collapseTime: null,
    cprStartTime: null,
    cycleStart: null,
    cycleNumber: 1,
    shockCount: 0,
    adrenalineCount: 0,
    lastAdrenalineAt: null,
    adrenalineArmed: false,
    rosc: false,
    roscTime: null,
    pendingShock: false,
    rhythmPromptOpen: false,
  };
}

export function createJointArrestState({ collapseTime, cprStartTime, now = Date.now() }) {
  const { cycleNumber, cycleStart } = initialCycleFromCprStart(cprStartTime, now);
  return {
    active: true,
    collapseTime,
    cprStartTime,
    cycleStart,
    cycleNumber,
    shockCount: 0,
    adrenalineCount: 0,
    lastAdrenalineAt: null,
    adrenalineArmed: false,
    rosc: false,
    roscTime: null,
    pendingShock: false,
    rhythmPromptOpen: false,
  };
}

export function rhythmCheckDue(arrest, now) {
  if (!arrest?.active || arrest.rosc || arrest.cycleStart == null) return false;
  if (arrest.pendingShock || arrest.rhythmPromptOpen) return false;
  return (now - arrest.cycleStart) / 1000 >= CPR_CYCLE_SEC;
}

export function cycleRemainingMs(arrest, now) {
  if (!arrest?.cycleStart) return CPR_CYCLE_SEC * 1000;
  return Math.max(0, CPR_CYCLE_SEC * 1000 - (now - arrest.cycleStart));
}

export function advanceCprCycle(arrest, now = Date.now()) {
  return {
    ...arrest,
    cycleStart: now,
    cycleNumber: arrest.cycleNumber + 1,
    rhythmPromptOpen: false,
    pendingShock: false,
  };
}

/** Next embedded-arrest interrupt for PPH prompt queue (Phase 1: rhythm + shock). */
export function computeJointArrestPrompt(arrest, now) {
  if (!arrest?.active || arrest.rosc) return null;
  if (arrest.pendingShock) {
    return { type: "arrest_shock", shockNumber: arrest.shockCount + 1 };
  }
  if (arrest.rhythmPromptOpen || rhythmCheckDue(arrest, now)) {
    return { type: "arrest_rhythm", cycleNumber: arrest.cycleNumber };
  }
  return null;
}
