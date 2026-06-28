// Shared maternal cardiac arrest timing + CPR cycle logic.
// Used by standalone CardiacArrestPage and PPH-embedded (Option F) joint arrest.

export const PMCS_DECISION_SEC = 4 * 60;
export const PMCS_DELIVERY_SEC = 5 * 60;
export const CPR_CYCLE_SEC = 2 * 60;
export const ADRENALINE_INTERVAL_SEC = 180;
export const SHOCK_ENERGY = "200 J biphasic";

/** Standalone cardiac arrest SOS — immediate resus checklist (GTG56). */
export const STANDALONE_IMMEDIATE_ACTIONS = [
  { id: "call_2222", title: "Call 2222 — maternal cardiac arrest",
    detail: "Cardiac arrest team + senior obstetrician + senior obstetric anaesthetist + senior midwife\nNeonatal team if antepartum > 22 weeks" },
  { id: "cpr", title: "Start CPR — 30:2",
    detail: "Centre of chest · 100–120/min · depth 5–6 cm\nMinimise interruptions" },
  { id: "mlud", title: "Manual uterine displacement — to the LEFT", over20Only: true,
    detail: "Displace the uterus up and to the left to relieve aortocaval compression\nPreferred over tilt — keeps her supine for effective compressions" },
  { id: "airway", title: "Airway — high-flow O₂",
    detail: "Early intubation (cuffed ETT) by experienced anaesthetist — difficult airway, high aspiration risk\nBag-mask / supraglottic airway until then" },
  { id: "iv_access", title: "IV access — above the diaphragm",
    detail: "2 × wide-bore ≥ 16G ABOVE the diaphragm — lower-limb access is ineffective with aortocaval compression\nUpper-limb intraosseous (IO) if peripheral fails\n500 ml crystalloid bolus; aggressive volume replacement (caution in pre-eclampsia/eclampsia)" },
  { id: "defib", title: "Attach defibrillator — assess rhythm",
    detail: "Same energy as non-pregnant (200 J biphasic)\nShockable (VF/pVT) vs non-shockable (asystole/PEA)" },
];

/** Postpartum embedded arrest — parallel resus checklist (no PMCS/MLUD). */
export const JOINT_IMMEDIATE_ACTIONS = [
  { id: "call_2222", title: "2222 — maternal cardiac arrest",
    detail: "Cardiac arrest team + senior obstetrician + anaesthetist + senior midwife" },
  { id: "cpr", title: "CPR 30:2 — hard and fast",
    detail: "Centre of chest · 100–120/min · depth 5–6 cm · minimise interruptions" },
  { id: "airway", title: "Airway — high-flow O₂",
    detail: "Early intubation by experienced anaesthetist · bag-mask until then" },
  { id: "iv_access", title: "IV access above diaphragm",
    detail: "2 × wide-bore ≥ 16G upper limb · IO if needed · continue volume replacement" },
  { id: "defib", title: "Defibrillator — rhythm q2min",
    detail: "200 J biphasic · shockable vs non-shockable" },
  { id: "pph_continue", title: "Continue haemorrhage control",
    detail: "PPH checklist below — do not stop uterotonics, TXA, or surgical measures during CPR" },
];

/** Arrest resus ticks that satisfy overlapping PPH checklist items (embedded arrest). */
export const ARREST_RESUS_TO_PPH_TASKS = {
  airway: ["abc"],
  iv_access: ["iv_access"],
};

/** PPH tasks already done → skip matching arrest immediate actions when arrest starts. */
export function arrestResusPrefilledFromPph(taskStates) {
  const done = new Set(["call_2222"]);
  const abc = taskStates?.abc?.status;
  if (abc === "done" || abc === "skipped") done.add("airway");
  if (taskStates?.iv_access?.status === "done") done.add("iv_access");
  return [...done];
}

export function pphTasksForArrestResusAction(actionId) {
  return ARREST_RESUS_TO_PPH_TASKS[actionId] ?? [];
}

/** PPH task id → arrest resus action to auto-tick when PPH item is completed during joint arrest. */
export const PPH_TASK_TO_ARREST_RESUS = {
  abc: "airway",
  iv_access: "iv_access",
};

export function arrestResusActionForPphTask(taskId) {
  return PPH_TASK_TO_ARREST_RESUS[taskId] ?? null;
}

export function isPphTaskCoveredByArrestResus(taskId, arrest) {
  if (!arrest?.active || arrest.rosc) return false;
  const resusDone = resusActionsDoneSet(arrest);
  for (const [resusId, pphIds] of Object.entries(ARREST_RESUS_TO_PPH_TASKS)) {
    if (pphIds.includes(taskId) && resusDone.includes(resusId)) return true;
  }
  return false;
}

/** Virtual task states so PPH queue skips items already covered by arrest resus. */
export function taskStatesWithArrestResusSync(taskStates, arrest) {
  if (!arrest?.active || arrest.rosc) return taskStates;
  const resusDone = new Set(arrest.resusActionsDone ?? []);
  let changed = false;
  const next = { ...taskStates };
  for (const [resusId, pphIds] of Object.entries(ARREST_RESUS_TO_PPH_TASKS)) {
    if (!resusDone.has(resusId)) continue;
    for (const id of pphIds) {
      const st = next[id]?.status;
      if (st === "done" || st === "skipped" || st === "already_given") continue;
      next[id] = { ...(next[id] ?? {}), status: "done", viaArrestResus: resusId };
      changed = true;
    }
  }
  return changed ? next : taskStates;
}

export function filterImmediateActions(actions, { gestation } = {}) {
  return actions.filter(a => !a.over20Only || gestation === "over20");
}

export function resusActionsDoneSet(arrest) {
  return arrest?.resusActionsDone ?? arrest?.actionsDone ?? [];
}

export function nextPendingResusAction(actions, doneSet = []) {
  return actions.find(a => !doneSet.includes(a.id)) ?? null;
}

/** True during live resus — standalone pages omit `active`; joint arrest sets it explicitly. */
export function isArrestResusLive(arrest) {
  if (!arrest || arrest.rosc) return false;
  if (arrest.active === false) return false;
  return true;
}

/** Post-ROSC care while PPH continues (postpartum — no PMCS, no app switch). */
export const JOINT_POST_RESUS = [
  { id: "haemorrhage", text: "Continue haemorrhage control — PPH checklist; MHP, uterotonics, TXA, fibrinogen" },
  { id: "haemostasis", text: "Surgical haemostasis if needed — tamponade, sutures, compression, hysterectomy" },
  { id: "ecg", text: "12-lead ECG; treat underlying cause; cardiology review if indicated" },
  { id: "icu", text: "Transfer to ICU — consultant intensivist; targeted temperature management" },
  { id: "debrief", text: "Debrief patient/family and team; MBRRACE if near-miss or death" },
];

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
    amio300Given: false,
    amio150Given: false,
    resusActionsDone: [],
    postResusDone: [],
    postResusCollapsed: false,
    rosc: false,
    roscTime: null,
    pendingShock: false,
    rhythmPromptOpen: false,
  };
}

/** Backfill fields when loading an older persisted joint-arrest snapshot. */
export function normalizeJointArrestState(arrest) {
  if (!arrest) return emptyJointArrestState();
  return {
    ...emptyJointArrestState(),
    ...arrest,
    resusActionsDone: arrest.resusActionsDone ?? [],
    postResusDone: arrest.postResusDone ?? [],
    postResusCollapsed: arrest.postResusCollapsed ?? false,
    amio300Given: arrest.amio300Given ?? false,
    amio150Given: arrest.amio150Given ?? false,
  };
}

export function adrenalineDue(arrest, now) {
  if (!isArrestResusLive(arrest)) return false;
  if (arrest.adrenalineArmed && arrest.adrenalineCount === 0) return true;
  if (arrest.lastAdrenalineAt != null && (now - arrest.lastAdrenalineAt) / 1000 >= ADRENALINE_INTERVAL_SEC) return true;
  return false;
}

/** Show adrenaline control once first dose is indicated or any dose has been logged. */
export function arrestAdrenalineControlVisible(arrest) {
  if (!isArrestResusLive(arrest)) return false;
  return !!(arrest.adrenalineArmed || arrest.adrenalineCount > 0);
}

export function arrestAdrenalineCountdownSec(arrest, now) {
  if (!arrest.lastAdrenalineAt || adrenalineDue(arrest, now)) return null;
  const since = (now - arrest.lastAdrenalineAt) / 1000;
  if (since >= ADRENALINE_INTERVAL_SEC) return null;
  return ADRENALINE_INTERVAL_SEC - since;
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
    amio300Given: false,
    amio150Given: false,
    resusActionsDone: ["call_2222"],
    postResusDone: [],
    postResusCollapsed: false,
    rosc: false,
    roscTime: null,
    pendingShock: false,
    rhythmPromptOpen: false,
  };
}

export function rhythmCheckDue(arrest, now) {
  if (!isArrestResusLive(arrest) || arrest.cycleStart == null) return false;
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

export function jointArrestHadActivity(arrest) {
  if (!arrest) return false;
  return !!(arrest.active || arrest.rosc || arrest.shockCount || arrest.adrenalineCount
    || (arrest.resusActionsDone?.length ?? 0) > 1 || arrest.cycleNumber > 1);
}

export function jointArrestSummaryText(arrest) {
  if (!jointArrestHadActivity(arrest)) return null;
  const amio = arrest.amio150Given ? "300 + 150 mg" : arrest.amio300Given ? "300 mg" : null;
  return {
    outcome: arrest.rosc
      ? "ROSC — embedded arrest ended; PPH haemorrhage management continued"
      : "Embedded cardiac arrest resus alongside PPH",
    stats: `${arrest.cycleNumber} CPR cycle${arrest.cycleNumber === 1 ? "" : "s"} · ${arrest.shockCount} shock${arrest.shockCount === 1 ? "" : "s"} · ${arrest.adrenalineCount} adrenaline${amio ? ` · amiodarone ${amio}` : ""}`,
    postResusDone: arrest.postResusDone ?? [],
  };
}

export function jointPostResusPending(arrest) {
  if (!arrest?.rosc) return 0;
  const done = arrest.postResusDone ?? [];
  return JOINT_POST_RESUS.filter(p => !done.includes(p.id)).length;
}

/** Next embedded-arrest interrupt for PPH prompt queue (Phase 1: rhythm + shock). */
export function computeJointArrestPrompt(arrest, now) {
  if (!isArrestResusLive(arrest)) return null;
  if (arrest.pendingShock) {
    return { type: "arrest_shock", shockNumber: arrest.shockCount + 1 };
  }
  if (arrest.rhythmPromptOpen || rhythmCheckDue(arrest, now)) {
    return { type: "arrest_rhythm", cycleNumber: arrest.cycleNumber };
  }
  return null;
}

/**
 * Arrest-side NOW prompt — timed interrupts and sequential resus tasks.
 * Priority: shock → rhythm → adrenaline → amiodarone → next checklist item.
 */
export function computeArrestNowPrompt(arrest, now, actions) {
  if (!isArrestResusLive(arrest)) return null;
  if (arrest.pendingShock) {
    return { type: "arrest_shock", shockNumber: arrest.shockCount + 1 };
  }
  if (arrest.rhythmPromptOpen || rhythmCheckDue(arrest, now)) {
    return { type: "arrest_rhythm", cycleNumber: arrest.cycleNumber };
  }
  if (adrenalineDue(arrest, now)) {
    return { type: "arrest_adrenaline" };
  }
  if (arrest.shockCount >= 3 && !arrest.amio300Given) {
    return { type: "arrest_amio", dose: 300 };
  }
  if (arrest.shockCount >= 5 && !arrest.amio150Given) {
    return { type: "arrest_amio", dose: 150 };
  }
  const doneSet = resusActionsDoneSet(arrest);
  const pending = nextPendingResusAction(actions, doneSet);
  if (pending) {
    return {
      type: "arrest_resus",
      action: pending,
      step: doneSet.length + 1,
      total: actions.length,
    };
  }
  return null;
}

/** Arrest-only coming-up timeline (standalone SOS or joint arrest lane). */
export function computeArrestComingUpItems(arrest, now, actions) {
  if (!isArrestResusLive(arrest)) return [];
  const items = [];
  const doneSet = resusActionsDoneSet(arrest);

  if (arrest.pendingShock) {
    items.push({
      dueAt: now, sortAt: now - 1e6, label: `Shock #${arrest.shockCount + 1} — deliver`,
      lane: "arrest", kind: "shock", overdue: true,
    });
  }
  if (arrest.cycleStart != null) {
    const rhythmDueAt = arrest.cycleStart + CPR_CYCLE_SEC * 1000;
    const rhythmOverdue = now >= rhythmDueAt || arrest.rhythmPromptOpen;
    items.push({
      dueAt: rhythmOverdue ? now : rhythmDueAt,
      sortAt: rhythmDueAt,
      label: `Rhythm check — cycle ${arrest.cycleNumber}`,
      lane: "arrest", kind: "rhythm", overdue: rhythmOverdue,
    });
  }
  if (adrenalineDue(arrest, now)) {
    items.push({
      dueAt: now, sortAt: now - 5e5, label: "Adrenaline 1 mg IV",
      lane: "arrest", kind: "adr", overdue: true,
    });
  } else if (arrest.lastAdrenalineAt) {
    const adrDueAt = arrest.lastAdrenalineAt + ADRENALINE_INTERVAL_SEC * 1000;
    if (now < adrDueAt) {
      items.push({
        dueAt: adrDueAt, sortAt: adrDueAt, label: "Adrenaline 1 mg IV",
        lane: "arrest", kind: "adr", overdue: false,
      });
    }
  }
  if (arrest.shockCount >= 3 && !arrest.amio300Given) {
    items.push({
      dueAt: now, sortAt: now - 4e5, label: "Amiodarone 300 mg",
      lane: "arrest", kind: "amio", overdue: true,
    });
  }
  if (arrest.shockCount >= 5 && !arrest.amio150Given) {
    items.push({
      dueAt: now, sortAt: now - 3e5, label: "Amiodarone 150 mg",
      lane: "arrest", kind: "amio", overdue: true,
    });
  }
  actions.filter(a => !doneSet.includes(a.id)).forEach((a, i) => {
    items.push({
      dueAt: now,
      sortAt: now + i,
      label: a.title,
      lane: "arrest",
      kind: "checklist",
      overdue: i === 0,
      manual: i > 0,
    });
  });

  items.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    return (a.sortAt ?? a.dueAt) - (b.sortAt ?? b.dueAt);
  });
  return items.slice(0, 6);
}
