import { useState, useEffect, useRef } from "react";
import {
  getPphLevel,
  pphLevelVal,
  PPH_LEVEL_ORDER,
  PPH_THRESHOLDS,
  effectiveUterotonicDelaySec,
  effectiveCarboRepeatDelaySec,
} from "../data/emergency/pph-shared.js";
import {
  createJointArrestState,
  emptyJointArrestState,
  normalizeJointArrestState,
  minsAgoToTimestamp,
  rhythmCheckDue,
  advanceCprCycle,
  computeJointArrestPrompt,
  computeArrestNowPrompt,
  computeArrestComingUpItems,
  JOINT_IMMEDIATE_ACTIONS,
  jointArrestHadActivity,
  jointArrestSummaryText,
  cycleRemainingMs,
  adrenalineDue,
  ADRENALINE_INTERVAL_SEC,
  CPR_CYCLE_SEC,
  JOINT_POST_RESUS,
  arrestResusPrefilledFromPph,
  pphTasksForArrestResusAction,
  arrestResusActionForPphTask,
  taskStatesWithArrestResusSync,
} from "../data/emergency/cardiac-arrest-shared.js";
import {
  JointArrestSetupSheet,
  JointArrestRhythmPrompt,
  JointArrestShockPrompt,
  JointArrestChecklistInline,
} from "./JointArrestPanel.jsx";
import {
  JointInstrumentStrip,
  JointNowCard,
  JointComingUpPanel,
  CollapsibleArrestChecklist,
  CollapsiblePphSection,
} from "./JointResusDeck.jsx";
import { SosDrugStrip } from "./SosDrugStrip.jsx";
import { SosExitConfirm } from "./sos-ui.jsx";

const CALL_FOLLOWUP_SEC = 60; // Assign → move on → chase after 1 min (calls + resus trio)
const STANDARD_CALL_IDS = new Set(["call_team", "call_major", "call_massive"]);

export const TASKS = [
  // Minor — stabilisation
  { id: "call_team",      level: "minor",   type: "call",     title: "Call for help",                         detail: "• Midwife in charge\n• On-call obstetrician",                                                                                                          followUpDelay: CALL_FOLLOWUP_SEC },
  { id: "abc",            level: "minor",   type: "action",   title: "ABC — airway, breathing, circulation",  detail: "Position patient flat\nHigh-flow O₂ 15 L/min via non-rebreather mask — do not wait for SpO₂ to fall in haemorrhage\nAssess for shock — HR, BP, skin perfusion, capillary refill" },
  { id: "iv_access",      level: "minor",   type: "access",   title: "IV access + bloods",                    detail: "1 × 16G IV cannula\nBloods: FBC, coagulation, U&E, group & screen",                                                                                    followUpDelay: 90  },
  { id: "fundal_massage", level: "minor",   type: "action",   title: "Fundal massage",                        detail: "Place hand firmly on fundus\nRub up a contraction — sustained circular massage\nAssess uterine tone immediately after", noDelegate: true, noSkip: true },
  { id: "bimanual",       level: "minor",   type: "action",   title: "Bimanual uterine compression",          detail: "One hand in vagina, one on abdomen\nSustained compression until uterus contracts\nContinue while awaiting uterotonic effect",                               followUpDelay: 90, deps: ["fundal_massage"] },
  // Minor — Trauma (assess; treat only if present)
  { id: "trauma_assess",  level: "minor",   type: "action",   title: "Trauma — inspect birth canal",          detail: "Cervix, vagina, perineum — good exposure and lighting",
    assess: { question: "Any laceration, haematoma or genital tract trauma?", excludeLabel: "No — none", excludeLog: "Trauma excluded — no genital tract trauma", excludeListNote: "no lacerations / haematoma", presentLabel: "Yes — present", presentLog: "Trauma identified — proceeding to repair", treatment: "suture" } },
  { id: "suture",         level: "minor",   type: "action",   title: "Suture lacerations / surgical haemostasis", detail: "Suture all visible lacerations\nDirect pressure / pack while awaiting senior\nEscalate to theatre if not controlled",                                  hidden: true, followUpDelay: 300, followUpQuestion: "Trauma bleeding controlled?", followUpYesLog: "Trauma controlled — haemostasis achieved", followUpEscalate: "theatre", followUpEscalateLog: "Trauma not controlled at 5 min — escalating to theatre / EUA" },
  // Minor — Tissue (assess; treat only if retained)
  { id: "tissue_assess",  level: "minor",   type: "action",   title: "Tissue — check placenta",               detail: "Confirm placenta and membranes complete",
    assess: { question: "Placenta and membranes complete?", excludeLabel: "Yes — complete", excludeLog: "Tissue excluded — placenta complete", excludeListNote: "placenta complete", presentLabel: "No — retained", presentLog: "Retained tissue suspected", presentListNote: "retained tissue", treatment: "manual_removal" } },
  { id: "manual_removal", level: "minor",   type: "action",   title: "Manual removal of retained tissue",     detail: "Manual exploration / removal under anaesthesia\nGive prophylactic antibiotics",                                                                          hidden: true, followUpDelay: 300 },
  { id: "catheterise",    level: "minor",   type: "action",   title: "Catheterise",                           detail: "Urinary catheter — target output >30 ml/hr\nMonitor hourly" },
  { id: "iv_fluids",      level: "minor",   type: "fluid",    title: "IV fluids",                             detail: "IV crystalloid resuscitation (Hartmann's / 0.9% saline)",                                                                                                deps: ["iv_access"] },
  // Minor — uterotonics in order
  { id: "oxytocin_bolus", level: "minor",   type: "drug",     title: "Oxytocin 5 IU IV",                      detail: "Slowly IV over ~1 minute\nOnly if not already given for active management of third stage",                                                               uterotonic: true },
  { id: "oxytocin_inf",   level: "minor",   type: "drug",     title: "Oxytocin infusion",                     detail: "40 IU in 500 ml Hartmann's at 125 ml/hr IV",                                                                                                             uterotonic: true, deps: ["iv_access"], requiresIv: true },
  { id: "ergometrine",    level: "minor",   type: "drug",     title: "Ergometrine 500 mcg",                   detail: "IM or slow IV\nIf oxytocin alone insufficient",                                                                                                         uterotonic: true, contraindications: ["Hypertension", "Pre-eclampsia", "Cardiac disease", "Obliterative vascular disease"], fallback: "carboprost" },
  // Minor — Thrombin
  { id: "coag_review",    level: "minor",   type: "action",   title: "Review coagulation results",            detail: "Review when available\nHaematologist if known or suspected coagulopathy",                                                                                  deps: ["iv_access"] },
  // Major
  { id: "call_major",     level: "major",   type: "call",     title: "Call for help — major PPH",             detail: "• Midwife in charge\n• On-call obstetrician\n• Senior obstetrician\n• Anaesthetist\n• Alert theatre\n• Activate major PPH protocol\n• Alert blood transfusion lab", followUpDelay: CALL_FOLLOWUP_SEC, critical: true },
  { id: "txa",            level: "major",   type: "drug",     title: "Tranexamic acid 1 g IV",                detail: "Over 10 minutes IV\n⚠ TIME CRITICAL — give ASAP, within 3 hours of birth",                                                                                 followUpDelay: CALL_FOLLOWUP_SEC, critical: true, special: "txa", deps: ["iv_access"] },
  { id: "second_cannula", level: "major",   type: "access",   title: "2nd large bore cannula",                detail: "14G or 16G — insert now\nCrossmatch 4 units red cells urgently\nRepeat FBC and coagulation",                                                              followUpDelay: CALL_FOLLOWUP_SEC, critical: true, deps: ["iv_access"] },
  { id: "rapid_cryst",    level: "major",   type: "fluid",    title: "Rapid crystalloid",                     detail: "Up to 1.5–2 L Hartmann's pending blood products\nO-negative blood if life-threatening — do not wait for crossmatch\nDo not delay blood products for crystalloid",                deps: ["iv_access"] },
  { id: "carboprost",     level: "major",   type: "drug",     title: "Carboprost 0.25 mg IM",                 detail: "Every 15 minutes — up to 8 doses\nContraindicated in asthma",                                                                                              uterotonic: true, special: "carbo", followUpDelay: 90, followUpYesLog: "Carboprost dose 1 confirmed given", contraindications: ["Asthma", "Significant cardiac disease", "Active hepatic disease", "Active renal disease"], fallback: "misoprostol" },
  { id: "misoprostol",    level: "major",   type: "drug",     title: "Misoprostol 800 mcg",                   detail: "PR or sublingual — place under tongue or per rectum\nAlternative if other uterotonics unavailable or failed",                                          uterotonic: true },
  { id: "keep_warm",      level: "major",   type: "action",   title: "Keep patient warm",                     detail: "Blankets and warming device\nHypothermia worsens coagulopathy\nTreat acidosis" },
  { id: "calcium",        level: "major",   type: "drug",     title: "Calcium gluconate 10 ml 10% IV",        detail: "Treat hypocalcaemia — common in massive transfusion (citrate chelates calcium)\nCheck ionised calcium; correct acidosis\nGive slowly IV with cardiac monitoring", deps: ["iv_access"] },
  { id: "rotem_teg",      level: "major",   type: "action",   title: "ROTEM / TEG coagulation",               detail: "Point-of-care coagulation to guide product selection — if available\nNot present in all units — otherwise use lab fibrinogen/PT/APTT\nMaintain normothermia — correct acidosis", naOption: { label: "Not available", log: "ROTEM/TEG not available — using lab fibrinogen/PT/APTT" } },
  { id: "blood_products", level: "major",   type: "blood",    title: "Blood products",                        detail: "• Red cells — maintain Hb >80 g/L\n• Cryoprecipitate 2 pools — fibrinogen <2 g/L (first choice)\n• FFP 4 units — fibrinogen <1.5 g/L or coagulopathy; 1:1 with RBCs if massive ongoing loss\n• Platelets — if <75 × 10⁹/L (<100 if ongoing bleeding)\n• rFVIIa — consider if life-threatening haemorrhage not responding (haematologist)", deps: ["iv_access"] },
  // Massive
  { id: "call_massive",   level: "massive", type: "call",     title: "Activate massive PPH",                  detail: "• Consultant obstetrician — NOW\n• Consultant anaesthetist — NOW\n• Haematologist — NOW\n• Blood bank — activate MHP\n• IR if UAE planned",               followUpDelay: CALL_FOLLOWUP_SEC, critical: true },
  { id: "mhp_pack",       level: "massive", type: "blood",    title: "MHP pack immediately",                  detail: "Empirical — do not wait for lab results\nTarget pack: 6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\nMove to 1:1 RBC:FFP ratio if bleeding ongoing\nCall blood bank now",                          followUpDelay: CALL_FOLLOWUP_SEC, critical: true, deps: ["iv_access"] },
  { id: "cell_salvage",   level: "massive", type: "action",   title: "Cell salvage",                          detail: "Activate if available\nHaematologist authorisation if Rh-negative", naOption: { label: "Not available", log: "Cell salvage not available in this unit" } },
  { id: "bakri",          level: "massive", type: "surgical", title: "Bakri balloon tamponade",               detail: "300–500 ml saline — tamponade test\nIf bleeding stops, may avoid theatre\nHave theatre prepared regardless", consider: true, considerLead: "If bleeding continues despite resuscitation" },
  { id: "theatre",        level: "massive", type: "surgical", title: "Transfer to theatre",                   detail: "• Stepwise uterine devascularisation\n• Bilateral uterine artery ligation\n• B-Lynch / Hayman brace suture\n• UAE if stable\n• Peripartum hysterectomy — last resort", consider: true, considerLead: "If haemorrhage not controlled — prepare early", followUpDelay: 300, followUpQuestion: "Patient in theatre?", followUpYesLog: "Patient transferred to theatre — procedure underway" },
  { id: "cardiac_arrest_ref", level: "minor", type: "call", title: "Cardiac arrest — 2222", detail: "Call 2222 — maternal cardiac arrest\nStart CPR immediately — 30:2, hard and fast\nDo not stop haemorrhage management during CPR\nTreat reversible cause: Hypovolaemia (4 Hs)\nAnaesthetist to manage airway\nFull maternal cardiac arrest protocol applies", consider: true, considerArrestCheck: true, hidden: true },
];

// Uterotonic escalation ladder — give → pharm wait → blood-loss assess → next step
const UTEROTONIC_ORDER = ["oxytocin_bolus", "oxytocin_inf", "ergometrine", "carboprost", "misoprostol"];
const IV_ACCESS_MAX_RETRIES = 2;

// Critical queue order — at massive after IV: MHP → TXA → 2nd cannula; at major: TXA → 2nd cannula
const CRITICAL_TASK_PRIORITY = {
  call_massive: 0,
  mhp_pack: 1,
  txa: 2,
  second_cannula: 3,
  call_major: 0,
};

const MASSIVE_RESUS_AFTER_IV = ["mhp_pack", "txa", "second_cannula"];
const FOUR_T_TASK_IDS = new Set(["fundal_massage", "bimanual", "trauma_assess", "tissue_assess"]);
// After tone pathway: uterotonic bolus before trauma/tissue assessments and catheter/fluids.
const DEFER_UNTIL_OXY_BOLUS = new Set(["trauma_assess", "tissue_assess", "catheterise", "iv_fluids"]);

function bimanualCleared(taskStates) {
  const s = taskStates.bimanual?.status;
  return s === "done" || s === "skipped";
}

function resusTrioGateClear(status) {
  // Assigned = delegated, algorithm moves on; follow-up chases in 60s
  return status === "done" || status === "already_given" || status === "skipped" || status === "assigned";
}

function massiveResusTrioPending(taskStates, level) {
  if (levelVal(level) < levelVal("massive")) return false;
  if (taskStates.iv_access?.status !== "done") return false;
  return MASSIVE_RESUS_AFTER_IV.some(id => !resusTrioGateClear(taskStates[id]?.status));
}

function deferFourTs(task, taskStates, level) {
  return FOUR_T_TASK_IDS.has(task.id) && massiveResusTrioPending(taskStates, level);
}

function theatreTransferSnoozed(taskStates, now) {
  const until = taskStates.theatre?.transferSnoozeUntil;
  return until != null && now < until;
}

function considerSnoozeMs(level) {
  if (levelVal(level) >= levelVal("massive")) return 2 * 60 * 1000;
  return 5 * 60 * 1000;
}

// Time allowed per IV attempt before surfacing IM-route prompt. Retries get a fresh window.
function ivAccessDeadlineMs(level, retries) {
  if (levelVal(level) >= levelVal("massive")) return 90 * 1000;
  if (levelVal(level) >= levelVal("major")) return retries > 0 ? 90 * 1000 : 120 * 1000;
  return 3 * 60 * 1000;
}

function fmtIvWindow(ms) {
  if (ms < 120_000) return `${Math.round(ms / 1000)} sec`;
  const m = Math.round(ms / 60_000);
  return `${m} min`;
}

function uterotonicTaken(taskStates, id) {
  const s = taskStates[id]?.status;
  return s === "done" || s === "already_given";
}

function getLastUterotonic(taskStates) {
  let last = null;
  for (const id of UTEROTONIC_ORDER) {
    if (uterotonicTaken(taskStates, id)) {
      const ts = taskStates[id];
      last = { id, at: ts.doneAt || ts.alreadyGivenAt || 0 };
    }
  }
  return last;
}

function getNextUterotonic(taskStates, level, forcedTasks) {
  for (const id of UTEROTONIC_ORDER) {
    const t = TASKS.find(x => x.id === id);
    if (!t) continue;
    const forced = (forcedTasks || []).includes(id);
    if (!forced && levelVal(t.level) > levelVal(level)) continue;
    if (!uterotonicTaken(taskStates, id) && taskStates[id]?.status !== "skipped" && taskStates[id]?.status !== "not_indicated") {
      return t;
    }
  }
  return null;
}

function uterotonicLadderExhaustedAtLevel(taskStates, level) {
  if (!getLastUterotonic(taskStates)) return false;
  for (const id of UTEROTONIC_ORDER) {
    const t = TASKS.find(x => x.id === id);
    if (!t || levelVal(t.level) > levelVal(level)) continue;
    const s = taskStates[id]?.status;
    if (!uterotonicTaken(taskStates, id) && s !== "skipped" && s !== "not_indicated") return false;
  }
  return true;
}

function withTheatreIfUncontrolledMajor(forcedTasks, taskStates, log, level, bloodLossMl, at) {
  if (levelVal(level) < levelVal("major")) return forcedTasks;
  if (bloodLossMl < PPH_THRESHOLDS.theatreForce) return forcedTasks;
  if (taskStates.theatre?.status) return forcedTasks;
  if (!uterotonicLadderExhaustedAtLevel(taskStates, level)) return forcedTasks;
  if (bloodLossRate(log, at) < 10) return forcedTasks;
  if (forcedTasks.includes("theatre")) return forcedTasks;
  return [...forcedTasks, "theatre"];
}

// ─── Core logic ─────────────────────────────────────────────────────────────

const LEVEL_ORDER = PPH_LEVEL_ORDER;
function levelVal(l) { return pphLevelVal(l); }
function getLevel(ml) { return getPphLevel(ml); }

// Rate of blood loss in ml/min, derived from timestamped cumulative-total
// log entries over a rolling window (default 10 min). Smooths out the
// burst of taps when a clinician enters a large loss in one go.
function bloodLossRate(log, now, windowMs = 10 * 60 * 1000) {
  const points = log.filter(e => (e.kind === "blood_loss" || e.kind === "blood_loss_correction") && typeof e.total === "number");
  if (points.length < 2) return 0;
  const latest = points[points.length - 1];
  const cutoff = now - windowMs;
  // Reference = the last measurement at or before the window start, else the
  // first measurement we have (average since start when all points are recent).
  let ref = points[0];
  for (const p of points) { if (p.time <= cutoff) ref = p; }
  const elapsedMin = (latest.time - ref.time) / 60000;
  if (elapsedMin <= 0) return 0;
  // Burst header taps seconds apart inflate rate — floor short intervals to 1 min
  const rateElapsed = Math.max(elapsedMin, 1);
  return Math.max(0, (latest.total - ref.total) / rateElapsed);
}

// Reassessment interval (seconds) as a function of bleed rate. The current
// level sets the slowest acceptable cadence; a faster rate only shortens it.
function reassessInterval(rate, level) {
  const levelCap = level === "massive" ? 180 : level === "major" ? 240 : 300;
  let rateInterval;
  if (rate >= 150)      rateInterval = 60;   // catastrophic — check every minute
  else if (rate >= 50)  rateInterval = 120;  // brisk
  else if (rate >= 10)  rateInterval = 180;  // moderate
  else if (rate >= 1)   rateInterval = 300;  // slow ooze
  else                  rateInterval = 420;  // settled
  return Math.min(levelCap, rateInterval);
}

function bloodCheckCountdown(log, now, level, sessionRecoveredAt) {
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  if (!lastCheck) return null;
  const intervalSec = reassessInterval(bloodLossRate(log, now), level);
  const anchor = Math.max(lastCheck.time, sessionRecoveredAt ?? 0);
  const dueAt = anchor + intervalSec * 1000;
  return { remainingMs: dueAt - now, intervalSec, overdue: now >= dueAt };
}

function bleedingSettled(log, now) {
  return bloodLossRate(log, now) < 1;
}

function hadBloodCheckSince(log, since) {
  return log.some(e => isBloodCheckEvent(e) && e.time > since);
}

function isBloodCheckEvent(e) {
  return e.kind === "blood_loss" || e.kind === "blood_loss_pending" || e.kind === "blood_loss_correction" || e.kind === "blood_loss_unchanged";
}

/** Ladder timing gates — pharm wait scales with bleed rate; blood check still required. */
function uterotonicTimingBlocked(last, log, now, uterotonicHold) {
  if (!last) return false;
  const rate = bloodLossRate(log, now);
  const delayMs = effectiveUterotonicDelaySec(last.id, rate) * 1000;
  if (now - last.at < delayMs) return true;
  if (!hadBloodCheckSince(log, last.at)) return true;
  if (uterotonicHold && bleedingSettled(log, now)) return true;
  return false;
}

function carboRepeatDue(carboLastTime, now, log) {
  const delaySec = effectiveCarboRepeatDelaySec(bloodLossRate(log, now));
  return (now - carboLastTime) / 1000 >= delaySec;
}

function canEscalateUterotonic({ taskStates, log, now, level, uterotonicHold, forcedTasks }) {
  const next = getNextUterotonic(taskStates, level, forcedTasks);
  if (!next) return null;
  const last = getLastUterotonic(taskStates);
  if (!last) return next;
  if (uterotonicTimingBlocked(last, log, now, uterotonicHold)) return null;
  if (next.requiresIv && taskStates.iv_access?.status !== "done") return null;
  return next;
}

function taskCriticalForFollowUp(task, level) {
  if (task.critical) return true;
  // All escalation calls — 60s assign chase at priority 1.1
  if (STANDARD_CALL_IDS.has(task.id)) return true;
  // At major+, chase IV access once assigned — unlocks TXA, MHP, blood products
  if (task.id === "iv_access" && levelVal(level) >= levelVal("major")) return true;
  return false;
}

function taskCriticalForQueue(task) {
  return !!task.critical;
}

function depSatisfied(depId, taskStates) {
  const status = taskStates[depId]?.status;
  // IV access must be established — skip does not unlock IV-dependent tasks
  if (depId === "iv_access") return status === "done";
  return ["done", "skipped"].includes(status);
}

function shouldOfferInfusionReassess(taskStates) {
  if (uterotonicTaken(taskStates, "oxytocin_inf")) return false;
  if (taskStates.oxytocin_inf?.status === "not_indicated") return false;
  // Only when IV unlocks a pending infusion decision — not on every fresh IV completion.
  if (taskStates.oxytocin_inf?.status === "assigned") return true;
  return UTEROTONIC_ORDER.some(id => id !== "oxytocin_inf" && uterotonicTaken(taskStates, id));
}

// Hold 90s IV follow-ups until the current attempt window expires
function ivAccessFollowUpHeld(task, taskStates, now, ivAccessPendingSince, level, ivAccessRetries) {
  if (task.id !== "iv_access" || taskStates.iv_access?.status !== "assigned") return false;
  if (!ivAccessPendingSince) return false;
  return (now - ivAccessPendingSince) < ivAccessDeadlineMs(level, ivAccessRetries);
}

function txaEligible(taskStates, level, txaTime) {
  const s = taskStates.txa?.status;
  if (s === "done" || s === "already_given" || txaTime) return false;
  return levelVal(level) >= levelVal("major");
}

function effectiveTaskStatus(id, taskStates, level, txaTime) {
  const s = taskStates[id]?.status ?? null;
  // Skipped TXA without a dose — still eligible at major+
  if (id === "txa" && s === "skipped" && txaEligible(taskStates, level, txaTime)) return null;
  return s;
}

const LEAD_MODES = { GUIDED: "guided", AUTONOMOUS: "autonomous" };
/** In autonomous mode, hide step-by-step coaching only — keep all timing/safety interrupts. */
const AUTONOMOUS_HIDDEN_PROMPT_TYPES = new Set(["task", "monitoring"]);

const AUTONOMY_TYPES = new Set(["drug", "blood", "fluid", "access", "action"]);
const AUTONOMY_EXCLUDED_IDS = new Set(["fundal_massage"]);
const PARALLEL_WITH_CALL_IDS = new Set([
  "abc", "iv_access", "txa", "second_cannula", "mhp_pack", "rapid_cryst", "blood_products", "iv_fluids",
]);

function isAutonomyEligible(task, forcedTasks) {
  if (!AUTONOMY_TYPES.has(task.type)) return false;
  if (AUTONOMY_EXCLUDED_IDS.has(task.id)) return false;
  if (task.consider) return false;
  if (task.hidden && !(forcedTasks || []).includes(task.id)) return false;
  return true;
}

function autonomyButtonLabel(task) {
  return task.type === "drug" ? "Give" : "Done";
}

function getSuggestedSequenceDrug(taskStates, level, forcedTasks, txaTime) {
  if (txaEligible(taskStates, level, txaTime) && effectiveTaskStatus("txa", taskStates, level, txaTime) === null) {
    if (depSatisfied("iv_access", taskStates)) return TASKS.find(t => t.id === "txa") ?? null;
  }
  const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
  if (nextUt) return nextUt;
  for (const t of TASKS) {
    if (t.type !== "drug" || t.uterotonic || t.id === "txa") continue;
    if (levelVal(t.level) > levelVal(level) && !(forcedTasks || []).includes(t.id)) continue;
    if (effectiveTaskStatus(t.id, taskStates, level, txaTime) !== null) continue;
    if (!(t.deps || []).every(id => depSatisfied(id, taskStates))) continue;
    return t;
  }
  return null;
}

function stabilisationCallId(level) {
  if (levelVal(level) >= levelVal("massive")) return "call_massive";
  if (levelVal(level) >= levelVal("major")) return "call_major";
  return "call_team";
}

/** Checklist: one call row per level — hide lower tiers once escalated. */
function callTaskVisibleInChecklist(task, level) {
  if (!STANDARD_CALL_IDS.has(task.id)) return true;
  return task.id === stabilisationCallId(level);
}

const ASSIGNED_STRIP_LABELS = {
  call_team: "Call help",
  call_major: "Major call",
  call_massive: "Massive call",
  txa: "TXA",
  second_cannula: "2nd cannula",
  mhp_pack: "MHP pack",
  iv_access: "IV access",
  bimanual: "Bimanual",
  theatre: "Theatre",
  suture: "Suture",
  manual_removal: "Tissue removal",
  carboprost: "Carboprost",
};

function absorbLowerCallSteps(setTaskStates, taskId, t) {
  setTaskStates(prev => {
    const next = { ...prev };
    const mark = (id) => {
      if (!next[id]?.status) next[id] = { status: "done", doneAt: t, coveredByHigherCall: true };
    };
    if (taskId === "call_massive") { mark("call_team"); mark("call_major"); }
    else if (taskId === "call_major") { mark("call_team"); }
    return next;
  });
}

function ensureMajorProtocol(forcedIds, taskStates) {
  if (!forcedIds.includes("theatre")) return forcedIds;
  const extras = ["call_major", "txa", "second_cannula"];
  return [...forcedIds, ...extras.filter(id => !forcedIds.includes(id) && (taskStates[id]?.status ?? null) === null)];
}

const UNDOABLE_STATUSES = ["done", "already_given", "skipped", "not_indicated"];

function canUndoChecklistTask(task, state, jointArrest) {
  if (!state?.status || !UNDOABLE_STATUSES.includes(state.status)) return false;
  if (state.coveredByHigherCall) return false;
  if (task.id === "cardiac_arrest_ref" && (jointArrest?.active || jointArrest?.rosc)) return false;
  return true;
}

function undoBlockReason(task, state, jointArrest) {
  if (state?.coveredByHigherCall) {
    return task.id === "call_team"
      ? "Included in a higher-level call — undo Major or Massive call instead."
      : "Included in a higher-level call — undo the Massive call instead.";
  }
  if (task.id === "cardiac_arrest_ref" && jointArrest?.active) {
    return "Arrest resus in progress — stand down arrest first.";
  }
  if (task.id === "cardiac_arrest_ref" && jointArrest?.rosc) {
    return "Post-ROSC care in progress — complete arrest stand-down first.";
  }
  return null;
}

function undoNeedsConfirm(task) {
  return task.type === "drug" || task.id === "cardiac_arrest_ref" || task.id === "call_major" || task.id === "call_massive";
}

function followUpAnchor(task, taskStates) {
  const ts = taskStates[task.id];
  if (!ts || !task.followUpDelay) return null;
  if (ts.status === "assigned") return ts.assignedAt;
  if (ts.status === "done" && task.followUpQuestion && ts.followUpAt) return ts.followUpAt;
  return null;
}

function countMonitoringPending({ taskStates, level, forcedTasks, txaTime }) {
  let blocked = 0, inProgress = 0;
  for (const t of TASKS) {
    const forced = (forcedTasks || []).includes(t.id);
    if (levelVal(t.level) > levelVal(level) && !forced) continue;
    if (t.hidden && !forced) continue;
    const st = effectiveTaskStatus(t.id, taskStates, level, txaTime);
    if (st !== null) {
      if (st === "assigned") inProgress++;
      continue;
    }
    const depsOk = (t.deps || []).every(id => depSatisfied(id, taskStates));
    if (!depsOk) blocked++;
  }
  return { blocked, inProgress };
}

export function computeNextPrompt({ taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone, effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, ivFailSnoozeUntil, infusionReassess, sessionRecoveredAt, forcedFollowUpId, jointArrest, undoPromptHold }) {
  function depsOk(task) {
    return (task.deps || []).every(id => depSatisfied(id, taskStates));
  }
  // A task is relevant at the current level, OR if it has been force-activated as a
  // fallback after a higher-tier drug was found contraindicated.
  function relevant(task) { return levelVal(task.level) <= levelVal(level) || (forcedTasks || []).includes(task.id); }
  function st(id) { return effectiveTaskStatus(id, taskStates, level, txaTime); }
  function toneGate(task) {
    if (deferFourTs(task, taskStates, level)) return true;
    if (toneAssessed) return false;
    if (task.id === "bimanual" || task.id === "trauma_assess" || task.id === "tissue_assess") {
      const fundal = taskStates["fundal_massage"]?.status;
      return fundal === "done" || fundal === "skipped";
    }
    return false;
  }
  // Before surfacing a task, route to the right prompt:
  // - drugs with contraindications → CI check first
  // - assessment tasks (Four T's: trauma / tissue) → assess prompt (exclude vs treat)
  // - consider tasks → soft escalation prompt (massive PPH)
  function gate(task) {
    if (undoPromptHold?.has(task.id)) return null;
    if (task.consider) return { type: "consider", task };
    if (task.contraindications && !(ciCleared || {})[task.id]) return { type: "ci_check", task };
    if (task.assess) return { type: "assess", task };
    return { type: "task", task };
  }

  function considerSnoozed(taskId) {
    const until = taskStates[taskId]?.considerSnoozeUntil;
    return until != null && now < until;
  }

  function nextForcedTask() {
    for (const forcedId of forcedTasks || []) {
      const t = TASKS.find(x => x.id === forcedId);
      if (!t || st(t.id) !== null || !depsOk(t)) continue;
      if (t.special === "txa" && !txaEligible(taskStates, level, txaTime)) continue;
      if (t.special === "carbo" && carboCount > 0 && carboLastTime) continue;
      const g = gate(t);
      if (g) return g;
    }
    return null;
  }

  // Priority 1.04 — cardiac arrest check (flagged from ABC instability, any PPH level)
  if ((forcedTasks || []).includes("cardiac_arrest_ref") && !jointArrest?.active) {
    const arrestTask = TASKS.find(x => x.id === "cardiac_arrest_ref");
    if (arrestTask && st("cardiac_arrest_ref") == null) {
      const g = gate(arrestTask);
      if (g) return g;
    }
  }

  // Priority 1.045 — embedded arrest (Option F): rhythm / shock while PPH continues
  const jointPrompt = computeJointArrestPrompt(jointArrest, now);
  if (jointPrompt) return jointPrompt;

  // Priority 1.05 — user tapped an assigned row in the checklist
  if (forcedFollowUpId) {
    const t = TASKS.find(x => x.id === forcedFollowUpId);
    if (t && taskStates[t.id]?.status === "assigned") {
      const assignedAt = taskStates[t.id]?.assignedAt;
      const chaseEarly = !!(t.followUpDelay && assignedAt && (now - assignedAt) / 1000 < t.followUpDelay);
      if (t.id === "theatre") return { type: "theatre_transfer", task: t, early: chaseEarly };
      return { type: "followup", task: t, early: chaseEarly };
    }
  }

  // Priority 1.55 — theatre preparing → confirm patient transferred
  if (taskStates.theatre?.status === "assigned" && !theatreTransferSnoozed(taskStates, now)) {
    const theatreTask = TASKS.find(x => x.id === "theatre");
    if (theatreTask && relevant(theatreTask)) return { type: "theatre_transfer", task: theatreTask };
  }

  // Priority 1.06 — queued uterotonic (IV-fail IM route or accepted escalation) — must beat iv_fail
  if (queuedUterotonicId) {
    const qt = TASKS.find(x => x.id === queuedUterotonicId);
    if (qt && st(qt.id) == null && depsOk(qt)) {
      const g = gate(qt);
      if (g) return g;
    }
  }

  // Priority 1.08 — blood loss check (must not sit behind iv_fail indefinitely)
  const blRate = bloodLossRate(log, now);
  const blInterval = reassessInterval(blRate, level);
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  const checkAnchor = Math.max(lastCheck?.time ?? 0, sessionRecoveredAt ?? 0);
  if (lastCheck && (now - checkAnchor) / 1000 > blInterval) {
    return { type: "blood_loss_check", rate: blRate, interval: blInterval };
  }

  // Priority 1.1 — critical follow-ups (most overdue first)
  let bestCritFollowup = null;
  let bestCritOverdue = 0;
  for (const t of TASKS) {
    if (!relevant(t) || !t.followUpDelay || !taskCriticalForFollowUp(t, level)) continue;
    if (ivAccessFollowUpHeld(t, taskStates, now, ivAccessPendingSince, level, ivAccessRetries)) continue;
    const anchor = followUpAnchor(t, taskStates);
    if (anchor == null) continue;
    const overdue = (now - anchor) / 1000 - t.followUpDelay;
    if (overdue >= 0 && overdue >= bestCritOverdue) {
      bestCritOverdue = overdue;
      bestCritFollowup = t;
    }
  }
  if (bestCritFollowup) {
    if (bestCritFollowup.id === "theatre") return { type: "theatre_transfer", task: bestCritFollowup };
    return { type: "followup", task: bestCritFollowup };
  }

  // Priority 1.5 — tone assessment after fundal massage (deferred at massive until MHP/TXA/cannula)
  const fundalStatus = taskStates["fundal_massage"]?.status;
  if ((fundalStatus === "done" || fundalStatus === "skipped") && !toneAssessed && !massiveResusTrioPending(taskStates, level)) {
    return { type: "tone_check" };
  }

  // Priority 1.52 — after tone pathway, give uterotonic bolus before trauma/tissue
  // assessments and before catheter/fluids (treat atony while Four T's continue in parallel).
  if (toneAssessed && bimanualCleared(taskStates) && !uterotonicTaken(taskStates, "oxytocin_bolus")) {
    const oxyBolus = TASKS.find(x => x.id === "oxytocin_bolus");
    if (oxyBolus && relevant(oxyBolus) && st(oxyBolus.id) == null && depsOk(oxyBolus)) {
      const g = gate(oxyBolus);
      if (g) return g;
    }
  }

  // Priority 1.75 — force-activated fallbacks/treatments (carboprost after ergometrine CI, suture after trauma, etc.)
  const forced = nextForcedTask();
  if (forced) return forced;

  // Priority 1.12 — IV attempt window expired → IM route offer (optional — not a forced ladder)
  const ivFailSnoozed = ivFailSnoozeUntil != null && now < ivFailSnoozeUntil;
  if (!queuedUterotonicId && !ivFailSnoozed && taskStates.iv_access?.status !== "done" && ivAccessPendingSince) {
    const windowMs = ivAccessDeadlineMs(level, ivAccessRetries);
    if (now - ivAccessPendingSince >= windowMs) {
      const imOpts = ["ergometrine", "carboprost", "misoprostol"].filter(id => {
        const t = TASKS.find(x => x.id === id);
        return t && levelVal(t.level) <= levelVal(level) && !uterotonicTaken(taskStates, id) && taskStates[id]?.status !== "skipped";
      });
      return {
        type: "iv_fail",
        imOptions: imOpts.map(id => TASKS.find(x => x.id === id)).filter(Boolean),
        retries: ivAccessRetries,
        maxRetries: IV_ACCESS_MAX_RETRIES,
        windowMs,
        level,
      };
    }
  }

  // Priority 2.2 — uterotonic escalation offer (after blood-loss assess)
  if (uterotonicEscalate) {
    const last = getLastUterotonic(taskStates);
    return {
      type: "uterotonic_escalate",
      nextTask: uterotonicEscalate,
      sinceTitle: last ? TASKS.find(x => x.id === last.id)?.title : null,
    };
  }

  // Priority 4 — non-critical follow-ups (most overdue first)
  let bestFollowup = null;
  let bestOverdue = 0;
  for (const t of TASKS) {
    if (!relevant(t) || !t.followUpDelay || taskCriticalForFollowUp(t, level)) continue;
    if (ivAccessFollowUpHeld(t, taskStates, now, ivAccessPendingSince, level, ivAccessRetries)) continue;
    const anchor = followUpAnchor(t, taskStates);
    if (anchor == null) continue;
    const overdue = (now - anchor) / 1000 - t.followUpDelay;
    if (overdue >= 0 && overdue >= bestOverdue) {
      bestOverdue = overdue;
      bestFollowup = t;
    }
  }
  if (bestFollowup) {
    if (bestFollowup.id === "theatre") return { type: "theatre_transfer", task: bestFollowup };
    return { type: "followup", task: bestFollowup };
  }

  // Priority 4.9 — stabilisation trio in fixed order before other critical tasks
  for (const id of [stabilisationCallId(level), "abc", "iv_access"]) {
    const t = TASKS.find(x => x.id === id);
    if (!t || !relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    const g = gate(t);
    if (g) return g;
  }

  // Priority 5 — critical unstarted tasks (massive: MHP → TXA → 2nd cannula)
  for (const critLevel of ["massive", "major", "minor"]) {
    const candidates = TASKS.filter(t => {
      if (t.level !== critLevel || !relevant(t) || st(t.id) !== null || !depsOk(t) || !taskCriticalForQueue(t)) return false;
      if (t.hidden && !(forcedTasks || []).includes(t.id)) return false;
      if (t.special === "txa" && !txaEligible(taskStates, level, txaTime)) return false;
      if (t.special === "carbo" && carboCount > 0 && carboLastTime) return false;
      if (toneGate(t)) return false;
      return true;
    });
    candidates.sort((a, b) => (CRITICAL_TASK_PRIORITY[a.id] ?? 50) - (CRITICAL_TASK_PRIORITY[b.id] ?? 50));
    if (candidates.length) {
      const g = gate(candidates[0]);
      if (g) return g;
    }
  }

  // Priority 5.8 — IV established late → reassess infusion (after resus trio + before Four T's)
  if (infusionReassess && taskStates.iv_access?.status === "done" && !uterotonicTaken(taskStates, "oxytocin_inf") && taskStates.oxytocin_inf?.status !== "not_indicated" && !massiveResusTrioPending(taskStates, level)) {
    return { type: "infusion_reassess" };
  }

  // Priority 6 — carboprost repeat dose (requires confirmed first dose with timestamp)
  const carboActive = carboCount > 0 && carboLastTime;
  if (carboActive && carboCount < 8 && carboRepeatDue(carboLastTime, now, log)) {
    return { type: "carbo_dose" };
  }

  // Priority 6.5 — TXA second dose (WOMAN trial: give if bleeding continues ≥30 min after first dose,
  // still within 3-hour birth window, and at major or massive level)
  if (txaTime && !txaSecondDone && levelVal(level) >= levelVal("major")) {
    const sinceFirst = (now - txaTime) / 1000;
    const windowOpen = effectiveBirthTime + 3 * 60 * 60 * 1000 > now;
    if (sinceFirst >= 30 * 60 && windowOpen) return { type: "txa_second" };
  }

  // Priority 7 — next regular task (exclude soft-consider items — handled below)
  for (const t of TASKS) {
    if (t.consider) continue;
    if (!relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    if (t.hidden && !(forcedTasks || []).includes(t.id)) continue;
    if (t.special === "txa" && !txaEligible(taskStates, level, txaTime)) continue;
    if (t.special === "carbo" && carboCount > 0 && carboLastTime) continue;
    if (toneAssessed && !uterotonicTaken(taskStates, "oxytocin_bolus")
        && DEFER_UNTIL_OXY_BOLUS.has(t.id)) continue;
    if (toneGate(t)) continue;
    // Uterotonic ladder — only surface the next rung when allowed
    if (t.uterotonic) {
      const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
      if (!nextUt || t.id !== nextUt.id) continue;
      const last = getLastUterotonic(taskStates);
      if (last && uterotonicTimingBlocked(last, log, now, uterotonicHold)) continue;
    }
    const g = gate(t);
    if (g) return g;
  }

  // Priority 7.5 — massive escalation considerations (soft prompts, not sequential orders)
  if (levelVal(level) >= levelVal("massive")) {
    for (const t of TASKS) {
      if (!t.consider || t.considerArrestCheck || !relevant(t) || st(t.id) !== null || considerSnoozed(t.id)) continue;
      if (toneGate(t)) continue;
      const g = gate(t);
      if (g) return g;
    }
  }

  // Cardiac arrest check at massive if ABC done but not yet assessed (backup if ABC button not used)
  if (levelVal(level) >= levelVal("massive") && !jointArrest?.active) {
    const arrestTask = TASKS.find(x => x.id === "cardiac_arrest_ref");
    const abcDone = ["done", "skipped"].includes(taskStates.abc?.status);
    if (arrestTask && abcDone && st("cardiac_arrest_ref") == null && !(forcedTasks || []).includes("cardiac_arrest_ref")) {
      const g = gate(arrestTask);
      if (g) return g;
    }
  }

  const pending = countMonitoringPending({ taskStates, level, forcedTasks, txaTime });
  return { type: "monitoring", ...pending };
}

function promptToNextUpLabel(prompt, carboCount) {
  if (!prompt) return null;
  switch (prompt.type) {
    case "task": return prompt.task?.title ?? null;
    case "blood_loss_check": return "Blood loss check";
    case "carbo_dose": return `Carboprost dose ${carboCount + 1}/8`;
    case "uterotonic_escalate": return prompt.nextTask?.title ?? null;
    case "followup":
    case "theatre_transfer": return prompt.task ? `${prompt.task.title} — confirm` : null;
    case "ci_check": return `${prompt.task?.title ?? "Drug"} — CI check`;
    case "assess": return prompt.task?.title ?? null;
    case "tone_check": return "Assess uterine tone";
    case "txa_second": return "TXA 2nd dose";
    case "iv_fail": return "IV failed — IM route";
    case "infusion_reassess": return "Oxytocin infusion?";
    case "consider": return prompt.task?.title ?? null;
    default: return null;
  }
}

/** Merged arrest + PPH timeline for joint resuscitation. */
function computeJointNextUpQueue(ctx) {
  const {
    jointArrest, now, log, level, sessionRecoveredAt,
    carboCount, carboLastTime, txaTime, txaSecondDone, effectiveBirthTime,
    taskStates: rawTaskStates, toneAssessed, forcedTasks, uterotonicHold, uterotonicEscalate,
    queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, ivFailSnoozeUntil,
    infusionReassess, forcedFollowUpId, undoPromptHold,
    txaHandled, ciCleared,
  } = ctx;
  const taskStates = taskStatesWithArrestResusSync(rawTaskStates, jointArrest);

  const items = [];
  const arrest = jointArrest;

  if (arrest?.active && !arrest.rosc) {
    items.push(...computeArrestComingUpItems(arrest, now, JOINT_IMMEDIATE_ACTIONS));
  }

  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  if (lastCheck) {
    const blInterval = reassessInterval(bloodLossRate(log, now), level);
    const anchor = Math.max(lastCheck.time, sessionRecoveredAt ?? 0);
    const dueAt = anchor + blInterval * 1000;
    items.push({
      dueAt,
      sortAt: dueAt,
      label: "Blood loss check",
      lane: "pph",
      kind: "blood_check",
      overdue: now >= dueAt,
    });
  }

  if (carboCount > 0 && carboLastTime && carboCount < 8) {
    const carboDelayMs = effectiveCarboRepeatDelaySec(bloodLossRate(log, now)) * 1000;
    const dueAt = carboLastTime + carboDelayMs;
    items.push({
      dueAt,
      sortAt: dueAt,
      label: `Carboprost dose ${carboCount + 1}/8`,
      lane: "pph",
      kind: "carbo",
      overdue: now >= dueAt,
    });
  }

  if (txaTime && !txaSecondDone && levelVal(level) >= levelVal("major")) {
    const dueAt = txaTime + 30 * 60 * 1000;
    const windowOpen = effectiveBirthTime + 3 * 60 * 60 * 1000 > now;
    if (windowOpen) {
      items.push({
        dueAt: now >= dueAt ? now : dueAt,
        sortAt: dueAt,
        label: "TXA 2nd dose",
        lane: "pph",
        kind: "txa",
        overdue: now >= dueAt,
      });
    }
  }

  for (const t of TASKS) {
    if (!t.followUpDelay || taskStates[t.id]?.status !== "assigned") continue;
    const anchor = followUpAnchor(t, taskStates);
    if (anchor == null) continue;
    const dueAt = anchor + t.followUpDelay * 1000;
    items.push({
      dueAt,
      sortAt: dueAt,
      label: `${t.title} — confirm done`,
      lane: "pph",
      kind: "followup",
      overdue: now >= dueAt,
    });
  }

  const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
    if (nextUt && effectiveTaskStatus(nextUt.id, taskStates, level, txaTime) === null) {
    const last = getLastUterotonic(taskStates);
    if (last) {
      const delayMs = effectiveUterotonicDelaySec(last.id, bloodLossRate(log, now)) * 1000;
      const dueAt = last.at + delayMs;
      if (now < dueAt) {
        items.push({
          dueAt,
          sortAt: dueAt,
          label: nextUt.title,
          lane: "pph",
          kind: "uterotonic",
          overdue: false,
        });
      }
    }
  }

  const pphPrompt = computeNextPrompt({ ...ctx, jointArrest: emptyJointArrestState() });
  const immediateLabel = promptToNextUpLabel(pphPrompt, carboCount);
  const hasTimedForLabel = items.some(i => i.lane === "pph" && i.label === immediateLabel);
  if (immediateLabel && !hasTimedForLabel && pphPrompt?.type !== "monitoring") {
    const isDueNow = !["blood_loss_check", "carbo_dose", "txa_second"].includes(pphPrompt?.type);
    items.push({
      dueAt: now,
      sortAt: now + 0.1,
      label: immediateLabel,
      lane: "pph",
      kind: "action",
      overdue: isDueNow,
    });
  }

  items.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    return (a.sortAt ?? a.dueAt) - (b.sortAt ?? b.dueAt);
  });

  const seen = new Set();
  return items.filter(item => {
    const key = `${item.lane}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

function formatNextUpWhen(item, now) {
  if (item.overdue && !item.manual) return "due";
  if (item.manual) return "tick";
  const rem = item.dueAt - now;
  if (rem <= 0) return "due";
  const sec = Math.ceil(rem / 1000);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

/** PPH prompts blocked while embedded arrest protocol is already running. */
function isBlockedDuringJointArrest(prompt, jointArrest) {
  if (!jointArrest?.active || jointArrest.rosc || !prompt) return false;
  if (prompt.type === "arrest_rhythm" || prompt.type === "arrest_shock") return true;
  if (prompt.task?.id === "cardiac_arrest_ref") return true;
  if (prompt.type === "consider" && prompt.task?.considerArrestCheck) return true;
  return false;
}

/** PPH-side NOW during joint arrest — uses PPH queue without arrest rhythm/shock pre-empt. */
function computeJointPphNowPrompt(ctx) {
  const syncedTaskStates = taskStatesWithArrestResusSync(ctx.taskStates, ctx.jointArrest);
  const prompt = computeNextPrompt({ ...ctx, taskStates: syncedTaskStates, jointArrest: emptyJointArrestState() });
  if (prompt && !isBlockedDuringJointArrest(prompt, ctx.jointArrest) && prompt.type !== "monitoring") {
    return prompt;
  }

  const {
    now, log, level, sessionRecoveredAt, carboCount, carboLastTime,
    taskStates, forcedTasks, txaTime, txaSecondDone, effectiveBirthTime,
    ciCleared, uterotonicEscalate, uterotonicHold, infusionReassess,
  } = ctx;

  const blRate = bloodLossRate(log, now);
  const blInterval = reassessInterval(blRate, level);
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  if (lastCheck) {
    const checkAnchor = Math.max(lastCheck.time, sessionRecoveredAt ?? 0);
    const dueAt = checkAnchor + blInterval * 1000;
    if (now >= dueAt) {
      return { type: "blood_loss_check", rate: blRate, interval: blInterval };
    }
  }

  if (uterotonicEscalate) {
    const last = getLastUterotonic(taskStates);
    return {
      type: "uterotonic_escalate",
      nextTask: uterotonicEscalate,
      sinceTitle: last ? TASKS.find(x => x.id === last.id)?.title : null,
    };
  }

  if (carboCount > 0 && carboLastTime && carboCount < 8 && carboRepeatDue(carboLastTime, now, log)) {
    return { type: "carbo_dose" };
  }

  if (txaTime && !txaSecondDone && levelVal(level) >= levelVal("major")) {
    const sinceFirst = (now - txaTime) / 1000;
    const windowOpen = effectiveBirthTime + 3 * 60 * 60 * 1000 > now;
    if (sinceFirst >= 30 * 60 && windowOpen) return { type: "txa_second" };
  }

  if (infusionReassess && taskStates.iv_access?.status === "done"
    && !uterotonicTaken(taskStates, "oxytocin_inf") && taskStates.oxytocin_inf?.status !== "not_indicated"
    && !massiveResusTrioPending(taskStates, level)) {
    return { type: "infusion_reassess" };
  }

  const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
  if (nextUt && effectiveTaskStatus(nextUt.id, taskStates, level, txaTime) === null) {
    const last = getLastUterotonic(taskStates);
    if (last) {
      if (!uterotonicTimingBlocked(last, log, now, uterotonicHold)) {
        const t = TASKS.find(x => x.id === nextUt.id);
        if (t) {
          if (t.contraindications && !(ciCleared || {})[t.id]) return { type: "ci_check", task: t };
          return { type: "task", task: t };
        }
      }
    }
  }

  return null;
}

function pphComingUpItemToPrompt(item, ctx) {
  if (!item || item.lane !== "pph") return null;
  const { log, now, level, sessionRecoveredAt, carboCount, taskStates, forcedTasks, txaTime, ciCleared } = ctx;
  if (item.kind === "blood_check") {
    const blRate = bloodLossRate(log, now);
    const blInterval = reassessInterval(blRate, level);
    return { type: "blood_loss_check", rate: blRate, interval: blInterval };
  }
  if (item.kind === "carbo") return { type: "carbo_dose" };
  if (item.kind === "txa") return { type: "txa_second" };
  if (item.kind === "uterotonic") {
    const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
    const t = nextUt ? TASKS.find(x => x.id === nextUt.id) : null;
    if (t) {
      if (t.contraindications && !(ciCleared || {})[t.id]) return { type: "ci_check", task: t };
      return { type: "task", task: t };
    }
  }
  if (item.kind === "followup") {
    const t = TASKS.find(x => item.label.startsWith(x.title) && taskStates[x.id]?.status === "assigned");
    if (t) return { type: "followup", task: t };
  }
  if (item.kind === "action") {
    const pphPrompt = computeNextPrompt({ ...ctx, jointArrest: emptyJointArrestState() });
    if (pphPrompt && pphPrompt.type !== "monitoring" && !isBlockedDuringJointArrest(pphPrompt, ctx.jointArrest)) {
      return pphPrompt;
    }
  }
  return null;
}

/** Option A — arrest tasks beat PPH; timed arrest beats sequential resus checklist. */
function buildJointNowPrompt(jointArrest, pphCtx, handlers, now, jointNextUp = []) {
  const arrestCore = computeArrestNowPrompt(jointArrest, now, JOINT_IMMEDIATE_ACTIONS);
  if (arrestCore) {
    if (arrestCore.type === "arrest_shock") {
      return { ...arrestCore, onDelivered: handlers.onArrestShockDelivered };
    }
    if (arrestCore.type === "arrest_rhythm") {
      return {
        ...arrestCore,
        onShockable: handlers.onArrestRhythmShockable,
        onNonShockable: handlers.onArrestRhythmNonShockable,
      };
    }
    if (arrestCore.type === "arrest_resus") {
      return {
        ...arrestCore,
        onDone: () => handlers.onArrestResusDone(arrestCore.action.id),
      };
    }
    return arrestCore;
  }

  const pphPrompt = computeJointPphNowPrompt(pphCtx);
  if (pphPrompt) return pphPrompt;

  const pphItems = jointNextUp.filter(i => i.lane === "pph");
  const urgent = pphItems.find(i => i.overdue)
    ?? pphItems.find(i => !i.manual && i.kind !== "blood_check" && i.dueAt - now <= 60_000);
  if (urgent) {
    const fromItem = pphComingUpItemToPrompt(urgent, pphCtx);
    if (fromItem) return fromItem;
  }

  return null;
}

function countOpenPphTasks(taskStates, level, forcedTasks, txaTime) {
  return TASKS.filter(t => {
    if (levelVal(t.level) > levelVal(level)) return false;
    if (t.hidden && !(forcedTasks || []).includes(t.id)) return false;
    return effectiveTaskStatus(t.id, taskStates, level, txaTime) === null;
  }).length;
}

const PROMPT_SUGGESTED_TYPES = new Set([
  "task", "ci_check", "assess", "followup", "theatre_transfer", "consider",
]);

function getAlgorithmSuggestedTask(prompt, taskStates, level, forcedTasks, txaTime) {
  if (!prompt) return null;
  if (PROMPT_SUGGESTED_TYPES.has(prompt.type) && prompt.task) {
    const t = prompt.task;
    if (levelVal(t.level) > levelVal(level) && !(forcedTasks || []).includes(t.id)) return null;
    if (effectiveTaskStatus(t.id, taskStates, level, txaTime) !== null) return null;
    return t;
  }
  if (prompt.type === "uterotonic_escalate" && prompt.nextTask) {
    const t = prompt.nextTask;
    if (effectiveTaskStatus(t.id, taskStates, level, txaTime) === null) return t;
  }
  return null;
}

function getSuggestedAutonomyTask(prompt, taskStates, level, forcedTasks, txaTime) {
  const fromPrompt = getAlgorithmSuggestedTask(prompt, taskStates, level, forcedTasks, txaTime);
  if (fromPrompt) return fromPrompt;
  if (levelVal(level) >= levelVal("massive") && taskStates.iv_access?.status === "done") {
    for (const id of MASSIVE_RESUS_AFTER_IV) {
      const t = TASKS.find(x => x.id === id);
      if (!t || effectiveTaskStatus(id, taskStates, level, txaTime) !== null) continue;
      if (!(t.deps || []).every(depId => depSatisfied(depId, taskStates))) continue;
      return t;
    }
  }
  if (levelVal(level) >= levelVal("major")) {
    for (const id of ["txa", "second_cannula"]) {
      const t = TASKS.find(x => x.id === id);
      if (!t || effectiveTaskStatus(id, taskStates, level, txaTime) !== null) continue;
      if (id === "txa" && !txaEligible(taskStates, level, txaTime)) continue;
      if (!(t.deps || []).every(depId => depSatisfied(depId, taskStates))) continue;
      return t;
    }
  }
  const drug = getSuggestedSequenceDrug(taskStates, level, forcedTasks, txaTime);
  if (drug) return drug;
  for (const id of [stabilisationCallId(level), "iv_access", "abc"]) {
    const t = TASKS.find(x => x.id === id);
    if (!t || effectiveTaskStatus(id, taskStates, level, txaTime) !== null) continue;
    if (!(t.deps || []).every(depId => depSatisfied(depId, taskStates))) continue;
    return t;
  }
  return null;
}

function taskNeedsAutonomyWarning(task, suggested) {
  if (!suggested) return false;
  if (task.id === suggested.id) return false;
  if (suggested.type === "call" && PARALLEL_WITH_CALL_IDS.has(task.id)) return false;
  return true;
}

function autonomyWarnCopy(task, suggestedTitle, taskStates, level) {
  const proceedLabel = task.type === "drug" ? "Give anyway" : "Do anyway";
  if (deferFourTs(task, taskStates, level)) {
    return {
      headline: "Not next on GTG52 path",
      body: `Complete massive resus (MHP · TXA · 2nd cannula) first. Suggested next: ${suggestedTitle}. Out-of-sequence actions are logged for handover — clinical judgment remains with you.`,
      proceedLabel,
    };
  }
  const verb = task.type === "drug" ? "giving" : "action";
  return {
    headline: "Not next on GTG52 ladder",
    body: `Suggested next: ${suggestedTitle}. Out-of-sequence ${verb} is logged for handover — clinical judgment remains with you.`,
    proceedLabel,
  };
}

function shouldShowPromptRail(leadMode, prompt) {
  if (leadMode === LEAD_MODES.GUIDED) return !!prompt;
  if (!prompt) return false;
  return !AUTONOMOUS_HIDDEN_PROMPT_TYPES.has(prompt.type);
}

function LeadModeToggle({ value, onChange, compact = false }) {
  const isAutonomous = value === LEAD_MODES.AUTONOMOUS;
  return (
    <div
      className={`flex rounded-lg border border-gray-800 bg-gray-950 p-0.5 ${compact ? "w-auto min-w-[11rem]" : "w-full"}`}
      role="group"
      aria-label="Session mode"
    >
      <button
        type="button"
        aria-pressed={!isAutonomous}
        onClick={() => onChange(LEAD_MODES.GUIDED)}
        className={`flex-1 font-bold rounded-md transition ${compact ? "px-3 py-1 text-[11px]" : "py-2.5 text-xs"} ${
          !isAutonomous
            ? "bg-amber-950/60 text-amber-300 shadow-sm"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Guided
      </button>
      <button
        type="button"
        aria-pressed={isAutonomous}
        onClick={() => onChange(LEAD_MODES.AUTONOMOUS)}
        className={`flex-1 font-bold rounded-md transition ${compact ? "px-3 py-1 text-[11px]" : "py-2.5 text-xs"} ${
          isAutonomous
            ? "bg-violet-950/60 text-violet-300 shadow-sm"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        Autonomous
      </button>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(ms) {
  const s = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

// Checklist completion time — wall clock (matches real notes / drug chart)
function taskCompletedTimeLabel(ts) {
  return ts ? fmtTime(ts) : null;
}

function bloodLossClass(ml) {
  if (ml >= 2000) return "text-red-400";
  if (ml >= 1000) return "text-orange-400";
  if (ml >= 500)  return "text-yellow-300";
  return "text-white";
}

const TYPE_LABEL = {
  call: "Call", access: "Access", action: "Action",
  fluid: "Fluid", drug: "Drug", blood: "Blood", surgical: "Surgical",
};

// ─── Escalation overlay ──────────────────────────────────────────────────────

function EscalationOverlay({ level, note, onDismiss }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]); }, []);
  const cfg = {
    major:   { title: "Major PPH",   body: "Blood loss ≥ 1,000 ml\nEscalate now — senior obstetrician, anaesthetist, theatre" },
    massive: { title: "Massive PPH", body: "Blood loss ≥ 2,000 ml\nActivate massive haemorrhage protocol immediately" },
  };
  const c = cfg[level];
  if (!c) return null;
  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center gap-5 p-6 max-w-full overflow-x-hidden">
      <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Level change</p>
      <h2 className="text-white text-4xl sm:text-5xl font-black text-center max-w-full">{c.title}</h2>
      {note && <p className="text-amber-400 text-sm text-center leading-relaxed">{note}</p>}
      <p className="text-gray-400 text-sm text-center whitespace-pre-line leading-relaxed">{c.body}</p>
      <button onClick={onDismiss} className="mt-8 bg-white text-gray-950 font-black text-sm px-10 py-3 rounded-lg">
        Acknowledged — continue
      </button>
    </div>
  );
}

// ─── Stand down confirm ──────────────────────────────────────────────────────

function StandDownConfirm({ bloodLoss, jointArrest, onConfirm, onCancel }) {
  const arrestSummary = jointArrestHadActivity(jointArrest) ? jointArrestSummaryText(jointArrest) : null;
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-end p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
        <p className="text-white font-bold mb-1">Stand down?</p>
        <p className="text-gray-500 text-sm mb-2">
          Total blood loss: <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
        </p>
        {arrestSummary && (
          <div className="mb-3 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2">
            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-0.5">Joint arrest recorded</p>
            <p className="text-gray-400 text-xs">{arrestSummary.stats}</p>
            {jointArrest?.rosc && (
              <p className="text-emerald-400/90 text-xs mt-1">ROSC achieved — merged aftercare follows</p>
            )}
          </div>
        )}
        {jointArrest?.rosc && (
          <p className="text-emerald-400/90 text-xs mb-3">
            Post-arrest care checklist on the next screen.
          </p>
        )}
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 font-medium py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-white text-gray-950 font-bold py-2.5 rounded-lg text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function ExitConfirm(props) {
  return <SosExitConfirm {...props} />;
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ elapsed, bloodLoss, level, assignedCount, leadMode, showQuickAdd, arrestNav, arrestActive, onAddBlood, onCorrectBlood, onStandDown, onExit, onLeadModeChange, onOpenCardiacArrest }) {
  const levelLabel = { minor: "Minor PPH", major: "Major PPH", massive: "Massive PPH" }[level];
  const isAutonomous = leadMode === LEAD_MODES.AUTONOMOUS;
  const [correcting, setCorrecting] = useState(false);
  const [correctVal, setCorrectVal] = useState("");

  function openCorrect() {
    setCorrectVal(String(bloodLoss));
    setCorrecting(true);
  }

  function applyCorrect() {
    const n = Number(correctVal);
    if (!isNaN(n) && n >= 0 && n !== bloodLoss) {
      onCorrectBlood(n);
      setCorrecting(false);
    }
  }

  return (
    <div className={`bg-gray-900 px-3 border-b border-gray-800 flex-shrink-0 max-w-full overflow-x-hidden ${arrestActive ? "pt-2 pb-2" : "pt-3 pb-3"}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`font-mono text-white font-bold tabular-nums shrink-0 ${arrestActive ? "text-lg" : "text-xl"}`}>{fmt(elapsed)}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {arrestNav && (
            <button
              onClick={onOpenCardiacArrest}
              className="text-red-400 hover:text-red-300 text-xs border border-red-900/60 hover:border-red-700 px-2 py-1 rounded transition whitespace-nowrap"
            >
              {arrestNav.active ? `← Arrest${arrestNav.cycle ? ` · c${arrestNav.cycle}` : ""}` : "Arrest SOS →"}
            </button>
          )}
          <button onClick={onExit} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2 py-1 rounded transition">Exit</button>
          <button onClick={onStandDown} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2 py-1 rounded transition">Stand down</button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        {assignedCount > 0 && <span className="text-amber-500 text-xs">{assignedCount} in progress</span>}
        <span className="text-gray-600 text-xs">{levelLabel}</span>
      </div>
      {!arrestActive && (
        <div className="mb-2">
          <LeadModeToggle value={leadMode} onChange={onLeadModeChange} compact />
          <p className="text-gray-700 text-[10px] mt-1">
            {isAutonomous ? "Checklist & timers — you lead" : "Step-by-step prompts"}
          </p>
        </div>
      )}
      <div className={arrestActive ? "flex items-center gap-2 flex-wrap" : "space-y-2"}>
        <div className={`flex items-baseline gap-2 min-w-0 ${arrestActive ? "shrink-0" : ""}`}>
          <span className="text-gray-600 text-xs shrink-0">Blood loss</span>
          <span className={`font-black tabular-nums transition-colors ${arrestActive ? "text-xl" : "text-2xl"} ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
          {showQuickAdd && !correcting && !arrestActive && (
            <button onClick={openCorrect} className="text-gray-600 hover:text-gray-400 text-xs shrink-0 transition">Correct</button>
          )}
        </div>
        {showQuickAdd && !correcting && (
          <div className={`flex gap-1.5 ${arrestActive ? "flex-1 min-w-0" : "grid grid-cols-3 gap-2"}`}>
            {[100, 250, 500].map(n => (
              <button key={n} onClick={() => onAddBlood(n)}
                className={`text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 rounded transition font-medium ${
                  arrestActive
                    ? "flex-1 text-sm py-2 min-h-[40px]"
                    : "text-xs px-2 py-2.5 min-h-[44px]"
                }`}>
                +{n}
              </button>
            ))}
          </div>
        )}
      </div>
      {showQuickAdd && correcting && (
        <div className="mt-2 flex gap-2 items-center">
          <span className="text-gray-600 text-xs shrink-0">Revised total</span>
          <input
            type="number"
            value={correctVal}
            onChange={e => setCorrectVal(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-gray-500 text-white text-base rounded-lg px-3 py-2 outline-none"
            onKeyDown={e => e.key === "Enter" && applyCorrect()}
          />
          <button onClick={applyCorrect} className="bg-white text-gray-950 font-bold text-xs px-3 py-2 rounded-lg">Apply</button>
          <button onClick={() => setCorrecting(false)} className="text-gray-500 text-xs px-2 py-2">Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Active prompt sub-components ────────────────────────────────────────────

function shouldOfferAlreadyGiven(task, taskStates, carboCount) {
  if (!task?.uterotonic) return false;
  const st = taskStates[task.id]?.status;
  if (st === "done" || st === "already_given") return false;
  if (task.special === "carbo" && carboCount > 0) return false;
  return true;
}

function TaskPrompt({ task, onDone, onAssign, onSkip, onNotAvailable, onAlreadyGiven, ivAccessDone, onCheckCardiacArrest, showAlreadyGiven = false }) {
  const autoExpand = task.type === "drug" || task.type === "blood" || task.critical;
  const [showDetail, setShowDetail] = useState(autoExpand);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const needsIvForGive = task.id === "oxytocin_bolus" || task.requiresIv;
  const canGive = !needsIvForGive || ivAccessDone;

  function handleSkipClick() {
    if (task.critical) { setSkipConfirm(true); } else { onSkip(task); }
  }

  if (skipConfirm) {
    return (
      <div className="px-4 py-3.5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Critical task — confirm skip</span>
        <p className="text-white text-base font-bold leading-snug">{task.title}</p>
        <p className="text-gray-500 text-xs">This task is marked critical. Are you sure you want to skip it?</p>
        <div className="flex gap-2 pt-1">
          <button onClick={() => setSkipConfirm(false)} className="flex-1 border border-gray-700 text-gray-300 font-medium py-3 text-sm rounded-lg">Cancel</button>
          <button onClick={() => { setSkipConfirm(false); onSkip(task); }} className="flex-1 border border-red-900 text-red-400 font-bold py-3 text-sm rounded-lg">Skip anyway</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${task.critical ? "text-red-400" : "text-gray-600"}`}>
          {TYPE_LABEL[task.type]}{task.critical ? " — critical" : ""}
        </span>
      </div>
      <p className="text-white text-xl font-bold leading-snug">{task.title}</p>
      {task.detail && (
        <>
          {!autoExpand && (
            <button onClick={() => setShowDetail(v => !v)} className="text-gray-700 hover:text-gray-500 text-xs transition">
              {showDetail ? "hide ↑" : "detail ↓"}
            </button>
          )}
          {showDetail && (
            <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed">{task.detail}</p>
          )}
        </>
      )}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex gap-2">
          <button
            onClick={() => onDone(task)}
            disabled={!canGive}
            className={`${task.noDelegate && !showAlreadyGiven ? "w-full" : "flex-1"} bg-white text-gray-950 font-bold py-3 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Done ✓
          </button>
          {!task.noDelegate && (
            <button onClick={() => onAssign(task)} className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-medium py-3 text-sm rounded-lg transition">Assign →</button>
          )}
          {!task.uterotonic && !task.noDelegate && !task.noSkip && (
            task.naOption
              ? <button onClick={() => onNotAvailable(task)} className="border border-gray-700 hover:border-gray-500 text-gray-400 font-medium px-4 py-3 text-xs rounded-lg transition">{task.naOption.label}</button>
              : <button onClick={handleSkipClick} className="text-gray-700 hover:text-gray-500 text-xs px-4 py-3 transition">Skip</button>
          )}
          {task.uterotonic && !task.noDelegate && (
            <button onClick={handleSkipClick} className="text-gray-700 hover:text-gray-500 text-xs px-4 py-3 transition">Skip</button>
          )}
        </div>
        {showAlreadyGiven && (
          <button onClick={() => onAlreadyGiven(task)} className="text-amber-400/90 text-xs py-1">
            Given before session / other route
          </button>
        )}
        {task.id === "abc" && onCheckCardiacArrest && (
          <button onClick={onCheckCardiacArrest} className="w-full border border-red-900/50 text-red-400 font-medium py-2.5 text-sm rounded-lg">
            Unstable — check for cardiac arrest
          </button>
        )}
        {needsIvForGive && !ivAccessDone && (
          <p className="text-gray-600 text-xs">IV access required to give — use Already given if given earlier (e.g. third stage)</p>
        )}
      </div>
    </div>
  );
}

function FollowupPrompt({ task, onYes, onNo, early = false }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  const escalates = !!task.followUpEscalate;
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Follow-up</span>
      <p className="text-white text-xl font-bold leading-snug">{task.followUpQuestion || task.title}</p>
      <p className="text-gray-600 text-xs">
        {early && task.followUpDelay
          ? "Chase timer still running — confirm done to clear early"
          : task.followUpQuestion ? "Reassess now" : "Assigned to team — has it been done?"}
      </p>
      {escalates ? (
        <div className="flex flex-col gap-2 pt-1">
          <button onClick={() => onYes(task)} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">
            Yes — controlled ✓
          </button>
          <button onClick={() => onNo(task, false)} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
            Improving — check back in 5 min
          </button>
          <button onClick={() => onNo(task, true)} className="w-full border border-red-800 text-red-400 font-bold py-2.5 text-sm rounded-lg">
            Not controlled — consider theatre →
          </button>
        </div>
      ) : (
        <div className="flex gap-2 pt-1">
          <button onClick={() => onYes(task)} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">
            Yes — confirmed ✓
          </button>
          <button onClick={() => onNo(task, false)} className="flex-1 border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
            Not yet
          </button>
        </div>
      )}
    </div>
  );
}

function TheatreTransferPrompt({ task, onInTheatre, onStillPreparing }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Theatre transfer</span>
      <p className="text-white text-xl font-bold leading-snug">Patient in theatre?</p>
      <p className="text-gray-500 text-xs">Team preparing — confirm when the patient has transferred and procedure is underway</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={() => onInTheatre(task)} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">
          Yes — in theatre now ✓
        </button>
        <button onClick={() => onStillPreparing(task)} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
          Still preparing — not transferred yet
        </button>
      </div>
    </div>
  );
}

function AssessPrompt({ task, onExclude, onPresent }) {
  const a = task.assess;
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Assess — {task.title}</span>
      <p className="text-white text-xl font-bold leading-snug">{a.question}</p>
      {task.detail && <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed">{task.detail}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onExclude(task)} className="flex-1 bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">{a.excludeLabel}</button>
        <button onClick={() => onPresent(task)} className="flex-1 border border-amber-700 text-amber-400 font-bold py-3 text-sm rounded-lg">{a.presentLabel}</button>
      </div>
    </div>
  );
}

function BloodCheckPrompt({ level, bloodLoss, rate, interval, onAdd, onUnchanged, onPending, onCorrect }) {
  const [custom, setCustom] = useState("");
  const [correcting, setCorrecting] = useState(false);
  const [correctVal, setCorrectVal] = useState("");
  const rateRounded = rate != null ? Math.round(rate) : null;
  const rateDesc = rateRounded == null ? null
    : rateRounded >= 150 ? "catastrophic"
    : rateRounded >= 50  ? "brisk"
    : rateRounded >= 10  ? "moderate"
    : rateRounded >= 1   ? "slow"
    : "settled";
  const rateColor = rateRounded == null ? "text-gray-600"
    : rateRounded === 0 ? "text-gray-600"
    : rateRounded >= 150 ? "text-red-400" : rateRounded >= 50 ? "text-orange-400" : rateRounded >= 10 ? "text-yellow-300" : "text-gray-500";
  const intervalLabel = interval != null ? `${Math.round(interval / 60 * 10) / 10} min` : null;
  const showRate = rateRounded != null && rateRounded > 0;
  function submitCustom() {
    const n = Number(custom);
    if (!isNaN(n) && n > 0) { onAdd(n); setCustom(""); }
  }
  function openCorrect() {
    setCorrectVal(String(bloodLoss));
    setCorrecting(true);
  }
  function applyCorrect() {
    const n = Number(correctVal);
    if (!isNaN(n) && n >= 0 && n !== bloodLoss) {
      onCorrect(n);
      setCorrecting(false);
    }
  }
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-600 shrink-0">Blood loss check</span>
        {showRate
          ? <span className={`text-xs font-bold ${rateColor}`}>~{rateRounded} ml/min · {rateDesc}</span>
          : <span className="text-xs text-gray-600">rate establishing</span>}
      </div>
      <p className="text-gray-500 text-xs">
        Current: <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span> — additional loss?
        {intervalLabel && <span className="text-gray-700"> · next check ~{intervalLabel}</span>}
      </p>
      <div className="flex gap-2">
        {[100, 250, 500].map(n => (
          <button key={n} onClick={() => onAdd(n)}
            className="flex-1 border border-gray-700 hover:border-gray-500 text-white font-medium py-3 text-sm rounded-lg transition">
            +{n}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <input
          type="number" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Other ml"
          className="w-full bg-gray-800 border border-gray-700 focus:border-gray-500 text-white text-base rounded-lg px-3 py-2 outline-none transition"
          onKeyDown={e => e.key === "Enter" && submitCustom()}
        />
        <div className="grid grid-cols-3 gap-2">
          <button onClick={submitCustom} className="border border-gray-700 text-white text-sm py-2.5 rounded-lg">Add</button>
          <button onClick={onPending} className="border border-gray-700 text-gray-400 text-sm py-2.5 rounded-lg">Pending</button>
          <button onClick={onUnchanged} className="border border-gray-700 text-gray-400 text-sm py-2.5 rounded-lg">Unchanged</button>
        </div>
      </div>
      {!correcting ? (
        <button onClick={openCorrect} className="text-gray-600 hover:text-gray-400 text-xs transition">
          Overestimated? Correct total
        </button>
      ) : (
        <div className="space-y-2 pt-1 border-t border-gray-800">
          <p className="text-gray-500 text-xs">Revised total estimate — logged as correction (level may change)</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={correctVal}
              onChange={e => setCorrectVal(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 focus:border-gray-500 text-white text-base rounded-lg px-3 py-2 outline-none"
              onKeyDown={e => e.key === "Enter" && applyCorrect()}
            />
            <button onClick={applyCorrect} className="bg-white text-gray-950 font-bold text-sm px-3 py-2 rounded-lg">Apply</button>
            <button onClick={() => setCorrecting(false)} className="text-gray-500 text-sm px-2 py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CarboDosePrompt({ count, onDose, onSkip }) {
  return (
    <div className="px-4 py-3.5 space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Carboprost</span>
      <p className="text-white text-xl font-bold">Dose {count + 1} of 8 due</p>
      <p className="text-gray-500 text-xs">0.25 mg IM · ⚠ Contraindicated in asthma{count >= 7 ? " · This is the final dose" : ""}</p>
      <div className="flex gap-2 pt-1">
        <button onClick={onDose} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Given ✓</button>
        <button onClick={onSkip} className="border border-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-lg">Skip</button>
      </div>
    </div>
  );
}

function TxaSecondPrompt({ onGiven, onNotNeeded }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">TXA — second dose</span>
      <p className="text-white text-xl font-bold">Is bleeding continuing?</p>
      <p className="text-gray-500 text-xs">30 min since first TXA dose · WOMAN trial: give second 1 g IV over 10 min if haemorrhage continues · Still within 3-hour window</p>
      <div className="flex gap-2 pt-1">
        <button onClick={onGiven} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Give second dose ✓</button>
        <button onClick={onNotNeeded} className="border border-gray-700 text-gray-400 text-sm px-4 py-2.5 rounded-lg">Not needed</button>
      </div>
    </div>
  );
}

function ToneCheckPrompt({ onFirm, onBoggy }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Tone assessment</span>
      <p className="text-white text-xl font-bold">Is the uterus firm after massage?</p>
      <p className="text-gray-500 text-xs">Assess uterine tone now — determines next step</p>
      <div className="flex gap-2 pt-1">
        <button onClick={onFirm} className="flex-1 bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Firm ✓</button>
        <button onClick={onBoggy} className="flex-1 border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">Still boggy →</button>
      </div>
    </div>
  );
}

function UterotonicEscalatePrompt({ nextTask, sinceTitle, onYes, onHold, onNotYet }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Uterotonic escalation</span>
      <p className="text-white text-xl font-bold leading-snug">Still bleeding{sinceTitle ? ` since ${sinceTitle}` : ""}?</p>
      <p className="text-gray-500 text-xs">Give {nextTask.title}?</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onYes} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Yes — give now</button>
        <button onClick={onHold} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">Hold — bleeding settling</button>
        <button onClick={onNotYet} className="w-full border border-gray-800 text-gray-500 text-sm py-2 rounded-lg">Not yet</button>
      </div>
    </div>
  );
}

function IvFailPrompt({ imOptions, retries, maxRetries, windowMs, level, onRetry, onImDrug, onDismiss }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  const canRetry = retries < maxRetries;
  const nextWindow = fmtIvWindow(ivAccessDeadlineMs(level, retries + 1));
  const title = retries === 0
    ? `No IV after ${fmtIvWindow(windowMs)}`
    : "Still no IV access";
  const detail = canRetry
    ? `Cannula not in — consider IM / sublingual uterotonics. ${maxRetries - retries} formal retry${maxRetries - retries !== 1 ? "ies" : ""} left.`
    : "Formal retries used — keep attempting IV or give IM uterotonics if indicated. Infusion needs IV.";
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-red-400">IV access</span>
      <p className="text-white text-xl font-bold leading-snug">{title}</p>
      <p className="text-gray-500 text-xs">{detail}</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onRetry} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
          {canRetry ? `Keep trying — another ${nextWindow}` : "Keep trying IV — reset timer"}
        </button>
        {imOptions.map(t => (
          <button key={t.id} onClick={() => onImDrug(t)} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">
            {t.title}
          </button>
        ))}
        <button onClick={onDismiss} className="w-full border border-gray-800 text-gray-500 text-sm py-2 rounded-lg">
          Not now — use checklist
        </button>
      </div>
    </div>
  );
}

function InfusionReassessPrompt({ onYes, onAssign, onNotNeeded }) {
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">IV access established</span>
      <p className="text-white text-xl font-bold leading-snug">Is oxytocin infusion still needed?</p>
      <p className="text-gray-500 text-xs">Reassess — other uterotonics may already be in progress</p>
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onYes} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">Yes — give infusion</button>
        <button onClick={onAssign} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">Assign → start infusion</button>
        <button onClick={onNotNeeded} className="w-full border border-gray-800 text-gray-500 text-sm py-2 rounded-lg">No — not indicated</button>
      </div>
    </div>
  );
}

function MonitoringPrompt({ inProgress, blocked }) {
  let message = "All actionable tasks complete — continue monitoring";
  if (inProgress > 0 && blocked > 0) {
    message = `${inProgress} in progress · ${blocked} awaiting prerequisites — confirm below when done`;
  } else if (inProgress > 0) {
    message = `${inProgress} task${inProgress > 1 ? "s" : ""} in progress — confirm below when done`;
  } else if (blocked > 0) {
    message = `${blocked} task${blocked > 1 ? "s" : ""} awaiting prerequisites — resolve blockers below`;
  }
  return (
    <div className="px-4 py-4">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Monitoring</span>
      <p className="text-gray-500 text-sm mt-1">{message}</p>
    </div>
  );
}

// ─── Contraindication check ───────────────────────────────────────────────────

function CiCheckPrompt({ task, onClear, onContraindicated }) {
  const fallback = TASKS.find(t => t.id === task.fallback);
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Before giving — check contraindications</span>
      <p className="text-white text-xl font-bold leading-snug">{task.title}</p>
      <p className="text-gray-400 text-sm">Any of these present?</p>
      <ul className="text-gray-300 text-sm space-y-1 pl-1">
        {task.contraindications.map(ci => (
          <li key={ci} className="flex gap-2"><span className="text-amber-500">•</span>{ci}</li>
        ))}
      </ul>
      <div className="flex gap-2 pt-1.5">
        <button onClick={() => onClear(task)} className="flex-1 bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">None present — give</button>
        <button onClick={() => onContraindicated(task)} className="flex-1 border border-amber-700 text-amber-400 font-bold py-3 text-sm rounded-lg">
          {fallback ? `Contraindicated → ${fallback.title}` : "Contraindicated"}
        </button>
      </div>
    </div>
  );
}

// ─── Consider escalation (massive PPH — unstable patient) ─────────────────────

function ConsiderPrompt({ task, remindMin, onPrepare, onNotIndicated, onNotNow, onArrestYes, onArrestNo }) {
  const isArrestCheck = !!task.considerArrestCheck;
  const [arrestConfirmStep, setArrestConfirmStep] = useState(0);

  useEffect(() => {
    setArrestConfirmStep(0);
  }, [task.id]);

  if (isArrestCheck && arrestConfirmStep === 1) {
    return (
      <div className="px-4 py-3.5 space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Confirm</span>
        <p className="text-white text-xl font-bold leading-snug">Patient unresponsive and no pulse?</p>
        <p className="text-gray-500 text-xs">Only confirm if checked — this launches the full maternal cardiac arrest protocol.</p>
        <div className="flex flex-col gap-2 pt-1">
          <button onClick={() => onArrestYes(task)} className="w-full bg-red-500 text-white font-bold py-3 text-sm rounded-lg">
            Yes — call 2222 now
          </button>
          <button onClick={() => setArrestConfirmStep(0)} className="w-full border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">
            No — go back
          </button>
        </div>
      </div>
    );
  }

  const title = isArrestCheck ? "Cardiac arrest?" : `Consider ${task.title.toLowerCase()}?`;
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-violet-400">{isArrestCheck ? "Check" : "Consider"}</span>
      <p className="text-white text-xl font-bold leading-snug">{title}</p>
      {isArrestCheck ? (
        <p className="text-gray-500 text-xs">Unstable patient — confirm before continuing PPH resus</p>
      ) : task.considerLead ? (
        <p className="text-gray-500 text-xs">{task.considerLead} — patient unstable, prepare if needed</p>
      ) : null}
      {task.detail && (
        <p className="text-gray-600 text-xs whitespace-pre-line leading-relaxed border-l-2 border-gray-800 pl-3">{task.detail}</p>
      )}
      <div className="flex flex-col gap-2 pt-1">
        {isArrestCheck ? (
          <>
            <button onClick={() => setArrestConfirmStep(1)} className="w-full bg-red-500 text-white font-bold py-3 text-sm rounded-lg">
              Yes — check pulse & responsiveness
            </button>
            <button onClick={() => onArrestNo(task)} className="w-full border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">
              No — continue PPH resus
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onPrepare(task)} className="w-full border border-gray-600 text-white font-medium py-3 text-sm rounded-lg">
              Prepare — assign team
            </button>
            <button onClick={() => onNotIndicated(task)} className="w-full border border-gray-800 text-gray-400 text-sm py-2.5 rounded-lg">
              Not indicated
            </button>
            <button onClick={() => onNotNow(task)} className="w-full text-gray-600 text-sm py-2 rounded-lg">
              Not now — remind in {remindMin} min
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Active prompt area ───────────────────────────────────────────────────────

function ActivePromptArea({ prompt, bloodLoss, level, carboCount, assignedCount, ivAccessDone, cardiacArrestPending, taskStates, handlers }) {
  if (!prompt) return null;
  const { onDone, onAssign, onSkip, onNotAvailable, onAlreadyGiven, onFollowupYes, onFollowupNo, onAssessExclude, onAssessPresent, onBloodAdd, onBloodUnchanged, onBloodPending, onBloodCorrect, onCarboDose, onCarboSkip, onTxaSecondGiven, onTxaSecondNotNeeded, onToneCheckFirm, onToneCheckBoggy, onCiClear, onCiContraindicated, onUterotonicEscalateYes, onUterotonicEscalateHold, onUterotonicEscalateNotYet, onIvFailRetry, onIvFailImDrug, onIvFailDismiss, onInfusionYes, onInfusionAssign, onInfusionNotNeeded, onConsiderPrepare, onConsiderNotIndicated, onConsiderNotNow, onConsiderArrestYes, onConsiderArrestNo, onCheckCardiacArrest, onTheatreInTheatre, onTheatreStillPreparing, onArrestRhythmShockable, onArrestRhythmNonShockable, onArrestShockDelivered } = handlers;

  let content;
  switch (prompt.type) {
    case "arrest_rhythm":
    case "arrest_shock":
      return null;
    case "task":         content = <TaskPrompt task={prompt.task} onDone={onDone} onAssign={onAssign} onSkip={onSkip} onNotAvailable={onNotAvailable} onAlreadyGiven={onAlreadyGiven} ivAccessDone={ivAccessDone} onCheckCardiacArrest={prompt.task.id === "abc" && cardiacArrestPending ? onCheckCardiacArrest : undefined} showAlreadyGiven={shouldOfferAlreadyGiven(prompt.task, taskStates, carboCount)} />; break;
    case "followup":     content = <FollowupPrompt task={prompt.task} onYes={onFollowupYes} onNo={onFollowupNo} early={prompt.early} />; break;
    case "theatre_transfer": content = <TheatreTransferPrompt task={prompt.task} onInTheatre={onTheatreInTheatre} onStillPreparing={onTheatreStillPreparing} />; break;
    case "assess":       content = <AssessPrompt task={prompt.task} onExclude={onAssessExclude} onPresent={onAssessPresent} />; break;
    case "blood_loss_check": content = <BloodCheckPrompt level={level} bloodLoss={bloodLoss} rate={prompt.rate} interval={prompt.interval} onAdd={onBloodAdd} onUnchanged={onBloodUnchanged} onPending={onBloodPending} onCorrect={onBloodCorrect} />; break;
    case "carbo_dose":   content = <CarboDosePrompt count={carboCount} onDose={onCarboDose} onSkip={onCarboSkip} />; break;
    case "txa_second":   content = <TxaSecondPrompt onGiven={onTxaSecondGiven} onNotNeeded={onTxaSecondNotNeeded} />; break;
    case "tone_check":   content = <ToneCheckPrompt onFirm={onToneCheckFirm} onBoggy={onToneCheckBoggy} />; break;
    case "uterotonic_escalate": content = <UterotonicEscalatePrompt nextTask={prompt.nextTask} sinceTitle={prompt.sinceTitle} onYes={() => onUterotonicEscalateYes(prompt.nextTask)} onHold={onUterotonicEscalateHold} onNotYet={onUterotonicEscalateNotYet} />; break;
    case "iv_fail":      content = <IvFailPrompt imOptions={prompt.imOptions} retries={prompt.retries} maxRetries={prompt.maxRetries} windowMs={prompt.windowMs} level={prompt.level} onRetry={onIvFailRetry} onImDrug={onIvFailImDrug} onDismiss={onIvFailDismiss} />; break;
    case "infusion_reassess": content = <InfusionReassessPrompt onYes={onInfusionYes} onAssign={onInfusionAssign} onNotNeeded={onInfusionNotNeeded} />; break;
    case "ci_check":     content = <CiCheckPrompt task={prompt.task} onClear={onCiClear} onContraindicated={onCiContraindicated} />; break;
    case "consider":     content = <ConsiderPrompt task={prompt.task} remindMin={Math.round(considerSnoozeMs(level) / 60000)} onPrepare={onConsiderPrepare} onNotIndicated={onConsiderNotIndicated} onNotNow={onConsiderNotNow} onArrestYes={onConsiderArrestYes} onArrestNo={onConsiderArrestNo} />; break;
    case "monitoring":   content = <MonitoringPrompt inProgress={prompt.inProgress} blocked={prompt.blocked} />; break;
    default:             return null;
  }

  const isInterrupt = ["followup", "theatre_transfer", "assess", "blood_loss_check", "carbo_dose", "txa_second", "tone_check", "ci_check", "uterotonic_escalate", "iv_fail", "infusion_reassess", "consider", "arrest_rhythm", "arrest_shock"].includes(prompt.type);

  return (
    <div className={`flex-shrink-0 border-b border-gray-800 relative z-10 ${isInterrupt ? "bg-gray-900" : "bg-gray-900"}`}>
      {isInterrupt && (
        <div className="px-4 pt-2.5 pb-0">
          <div className="h-px bg-amber-500/50 w-full" />
        </div>
      )}
      {content}
    </div>
  );
}

// ─── Checklist autonomy + lead mode ───────────────────────────────────────────

function AutonomousModeBanner({ jointArrestActive = false }) {
  if (jointArrestActive) return null;
  return (
    <div className="flex-shrink-0 px-4 py-2 border-b border-violet-900/40 bg-violet-950/20">
      <p className="text-violet-300 text-xs font-medium">Checklist mode — work from the list below. Timers stay active.</p>
    </div>
  );
}

/** Merged timeline — used by Coming up panel in Option A deck. */
function JointNextUpPanel({ items, now }) {
  if (!items.length) return null;
  return (
    <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900/80 px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Next up</p>
        <p className="text-[10px] text-gray-600 shrink-0">
          <span className="text-red-400">●</span> Arrest
          <span className="mx-1.5">·</span>
          <span className="text-amber-400">●</span> PPH
        </p>
      </div>
      <div className="space-y-0.5">
        {items.map((item, i) => (
          <div
            key={`${item.lane}-${item.kind}-${item.label}-${i}`}
            className="flex items-center gap-2 py-1 min-h-[28px]"
          >
            <span className={`text-[10px] font-bold uppercase w-11 shrink-0 ${item.lane === "arrest" ? "text-red-400" : "text-amber-400"}`}>
              {item.lane === "arrest" ? "Arrest" : "PPH"}
            </span>
            <span className={`flex-1 text-xs leading-snug truncate ${item.overdue ? "text-white font-medium" : "text-gray-400"}`}>
              {item.label}
            </span>
            <span className={`text-[11px] font-mono tabular-nums shrink-0 ${item.overdue ? "text-amber-400 font-bold" : "text-gray-600"}`}>
              {formatNextUpWhen(item, now)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutOfSequenceConfirm({ task, suggestedTitle, taskStates, level, onProceed, onCancel }) {
  const { headline, body, proceedLabel } = autonomyWarnCopy(task, suggestedTitle, taskStates, level);
  return (
    <div className="fixed inset-0 bg-black/80 z-[55] flex items-end p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-amber-800/60 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
        <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">{headline}</p>
        <p className="text-white font-bold text-base mb-1">{task.title}</p>
        <p className="text-gray-500 text-sm mb-4">{body}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 font-medium py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={onProceed} className="flex-1 bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm">{proceedLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ChecklistAutonomyActions({ task, ivAccessDone, ciCleared, isAutonomousLead, showAlreadyGiven = false, onDone, onDoneWithIv, onAlreadyGiven, onAssign, onSkip, onNotAvailable, onAssessExclude, onAssessPresent, onCancel }) {
  const [skipConfirm, setSkipConfirm] = useState(false);
  const isDrug = task.type === "drug";
  const needsIvForGive = isDrug && (task.id === "oxytocin_bolus" || task.requiresIv);
  const canGive = !needsIvForGive || ivAccessDone;
  const ciPending = isDrug && task.contraindications?.length && !(ciCleared || {})[task.id];
  const doneLabel = isDrug ? "Given now ✓" : "Done ✓";
  const sheetTitle = isDrug ? "Checklist — give drug" : "Checklist";

  if (isAutonomousLead && needsIvForGive && !ivAccessDone) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[55] flex items-end p-4" onClick={onCancel}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">IV access</p>
          <p className="text-white text-lg font-bold mb-1">Is IV in?</p>
          <p className="text-gray-500 text-sm mb-4">
            Needed for <span className="text-gray-300">{task.title}</span>.
            {" "}Confirming will record IV access and this step together.
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={() => onDoneWithIv(task)} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">
              Yes — IV in ✓
            </button>
            {task.uterotonic && (
              <button onClick={() => onAlreadyGiven(task)} className="w-full border border-amber-700 text-amber-400 font-bold py-3 text-sm rounded-lg">
                Already given (other route)
              </button>
            )}
            <button onClick={onCancel} className="text-gray-500 text-sm py-2">Not yet</button>
          </div>
        </div>
      </div>
    );
  }

  if (skipConfirm) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[55] flex items-end p-4" onClick={() => setSkipConfirm(false)}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
          <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">{isDrug ? "Critical drug — confirm skip" : "Confirm skip"}</p>
          <p className="text-white font-bold mb-3">{task.title}</p>
          <div className="flex gap-3">
            <button onClick={() => setSkipConfirm(false)} className="flex-1 border border-gray-700 text-gray-300 py-2.5 rounded-lg text-sm">Cancel</button>
            <button onClick={() => { setSkipConfirm(false); onSkip(task); }} className="flex-1 border border-red-900 text-red-400 font-bold py-2.5 rounded-lg text-sm">Skip anyway</button>
          </div>
        </div>
      </div>
    );
  }

  if (task.assess) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[55] flex items-end p-4" onClick={onCancel}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Checklist — assess</p>
          <p className="text-white text-lg font-bold mb-2">{task.title}</p>
          {task.detail && <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed mb-3">{task.detail}</p>}
          <p className="text-gray-300 text-sm mb-4">{task.assess.question}</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => onAssessExclude(task)} className="w-full border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">{task.assess.excludeLabel}</button>
            <button onClick={() => onAssessPresent(task)} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">{task.assess.presentLabel}</button>
            <button onClick={onCancel} className="text-gray-600 text-sm py-2">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[55] flex items-end p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{sheetTitle}</p>
        <p className="text-white text-lg font-bold mb-2">{task.title}</p>
        {task.detail && <p className="text-gray-500 text-xs whitespace-pre-line leading-relaxed mb-3">{task.detail}</p>}
        {ciPending && (
          <p className="text-amber-400/90 text-xs border border-amber-900/50 rounded-lg px-3 py-2 mb-3">
            Contraindications not yet screened in the prompt flow — confirm safe to give.
          </p>
        )}
        {needsIvForGive && !ivAccessDone && (
          <p className="text-gray-500 text-xs mb-3">IV access not recorded — use Already given if route was IM/SL/PR or given before.</p>
        )}
        <div className="flex flex-col gap-2">
          {task.naOption && (
            <button onClick={() => onNotAvailable(task)} className="w-full border border-gray-700 text-gray-300 font-medium py-3 text-sm rounded-lg">{task.naOption.label}</button>
          )}
          <div className="flex gap-2">
            <button onClick={() => onDone(task)} disabled={isDrug && !canGive} className="flex-1 bg-white text-gray-950 font-bold py-3 text-sm rounded-lg disabled:opacity-40">{doneLabel}</button>
            {!task.noDelegate && (
              <button onClick={() => onAssign(task)} className="flex-1 border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">Assign →</button>
            )}
          </div>
          {showAlreadyGiven && (
            <button onClick={() => onAlreadyGiven(task)} className="text-amber-400/90 text-xs py-1">
              Given before session / other route
            </button>
          )}
          {!task.noSkip && (
            <button onClick={() => (isDrug && task.critical) ? setSkipConfirm(true) : onSkip(task)} className="text-gray-600 hover:text-gray-400 text-xs py-2">
              {isDrug ? "Skip this drug" : "Skip this step"}
            </button>
          )}
          <button onClick={onCancel} className="text-gray-600 text-sm py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ChecklistDetailSheet({
  task,
  state,
  status,
  taskStates,
  level,
  txaTime,
  forcedTasks,
  ivAccessDone,
  isAutonomousLead,
  cardiacArrestPending,
  onClose,
  onDone,
  onAssign,
  onSkip,
  onNotAvailable,
  onAlreadyGiven,
  onConsiderPrepare,
  onConsiderNotIndicated,
  onConsiderNotNow,
  onAutonomyAction,
  onCheckCardiacArrest,
  onAssignedDone,
  onAssessExclude,
  onAssessPresent,
  onConfirmTask,
  onUndo,
  jointArrest,
}) {
  const [undoConfirm, setUndoConfirm] = useState(false);
  const blockingDeps = (task.deps || []).filter(id => !depSatisfied(id, taskStates));
  const fourTsLocked = deferFourTs(task, taskStates, level);
  const isLocked = !status && (blockingDeps.length > 0 || fourTsLocked);
  const lockNote = fourTsLocked
    ? "Complete massive resus (MHP · TXA · 2nd cannula) first"
    : blockingDeps.length > 0
      ? `Awaits: ${TASKS.find(t => t.id === blockingDeps[0])?.title ?? blockingDeps[0]}`
      : null;
  const remindMin = Math.round(considerSnoozeMs(level) / 60000);
  const isConsider = task.consider && !task.considerArrestCheck;
  const canAutonomy = isAutonomyEligible(task, forcedTasks) && status === null;
  const isDrug = task.type === "drug";
  const canUndo = canUndoChecklistTask(task, state, jointArrest);
  const undoBlock = undoBlockReason(task, state, jointArrest);
  const isCompleted = UNDOABLE_STATUSES.includes(status);

  function act(fn) {
    fn(task);
    onClose();
  }

  function statusSummary() {
    if (status === "done" || status === "already_given") {
      const ts = state?.doneAt ?? state?.alreadyGivenAt;
      return [status === "already_given" && "Already given", state?.outOfSequence && "Out of sequence", ts && taskCompletedTimeLabel(ts)].filter(Boolean).join(" · ");
    }
    if (status === "not_indicated") return "Not indicated";
    if (status === "skipped") return state?.skipReason === "not_required" ? "Not required — uterus firm" : "Skipped";
    if (status === "assigned") return task.id === "theatre" ? "Team preparing" : "Assigned — in progress";
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[54] flex items-end p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
          {TYPE_LABEL[task.type] ?? task.type}{task.critical ? " — critical" : ""}{isConsider ? " — consider" : ""}
        </p>
        <p className="text-white text-lg font-bold mb-2">{task.title}</p>
        {task.considerLead && status === null && (
          <p className="text-violet-300/90 text-sm mb-2">{task.considerLead}</p>
        )}
        {task.detail && (
          <p className="text-gray-400 text-xs whitespace-pre-line leading-relaxed mb-3 border-l-2 border-gray-800 pl-3">{task.detail}</p>
        )}
        {isLocked && lockNote && (
          <p className="text-gray-500 text-xs border border-gray-800 rounded-lg px-3 py-2 mb-3">{lockNote}</p>
        )}
        {statusSummary() && (
          <p className="text-gray-600 text-xs mb-3">{statusSummary()}</p>
        )}

        <div className="flex flex-col gap-2">
          {status === null && isConsider && (
            <>
              <button onClick={() => act(onConsiderPrepare)} className="w-full border border-gray-600 text-white font-medium py-3 text-sm rounded-lg">
                Prepare — assign team
              </button>
              <button onClick={() => act(onConsiderNotIndicated)} className="w-full border border-gray-800 text-gray-400 text-sm py-2.5 rounded-lg">
                Not indicated
              </button>
              <button onClick={() => { onConsiderNotNow(task); onClose(); }} className="w-full text-gray-600 text-sm py-2 rounded-lg">
                Not now — remind in {remindMin} min
              </button>
            </>
          )}

          {status === null && task.type === "call" && (
            <>
              <div className="flex gap-2">
                <button onClick={() => act(onDone)} className="flex-1 bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">Done ✓</button>
                <button onClick={() => act(onAssign)} className="flex-1 border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">Assign →</button>
              </div>
            </>
          )}

          {status === null && task.id === "fundal_massage" && (
            <button onClick={() => act(onDone)} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">Done ✓</button>
          )}

          {status === null && task.assess && (
            <>
              <button onClick={() => act(onAssessExclude)} className="w-full border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">{task.assess.excludeLabel}</button>
              <button onClick={() => act(onAssessPresent)} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">{task.assess.presentLabel}</button>
            </>
          )}

          {status === null && canAutonomy && !isConsider && task.type !== "call" && !task.assess && task.id !== "fundal_massage" && (
            <>
              {isDrug && task.uterotonic && (
                <button onClick={() => act(onAlreadyGiven)} className="w-full border border-amber-700 text-amber-400 font-bold py-3 text-sm rounded-lg">Already given</button>
              )}
              {task.naOption && (
                <button onClick={() => act(onNotAvailable)} className="w-full border border-gray-700 text-gray-300 font-medium py-3 text-sm rounded-lg">{task.naOption.label}</button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => (isAutonomousLead && !isDrug ? act(onDone) : (() => { onClose(); onAutonomyAction(task); })())}
                  className="flex-1 bg-white text-gray-950 font-bold py-3 text-sm rounded-lg"
                >
                  {autonomyButtonLabel(task)}{isDrug ? "" : " ✓"}
                </button>
                {!task.noDelegate && (
                  <button onClick={() => act(onAssign)} className="flex-1 border border-gray-700 text-white font-medium py-3 text-sm rounded-lg">Assign →</button>
                )}
              </div>
              {task.id === "abc" && cardiacArrestPending && onCheckCardiacArrest && (
                <button
                  onClick={() => { onCheckCardiacArrest(); onClose(); }}
                  className="w-full border border-red-900/50 text-red-400 font-medium py-2.5 text-sm rounded-lg"
                >
                  Unstable — check for cardiac arrest
                </button>
              )}
              {!task.noSkip && (
                <button onClick={() => act(onSkip)} className="text-gray-600 hover:text-gray-400 text-xs py-2">
                  {isDrug ? "Skip this drug" : "Skip this step"}
                </button>
              )}
            </>
          )}

          {status === "assigned" && (
            <>
              <button onClick={() => { onAssignedDone(task.id); onClose(); }} className="w-full bg-white text-gray-950 font-bold py-3 text-sm rounded-lg">Done ✓</button>
              <button onClick={() => { onClose(); onConfirmTask(task.id); }} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
                Reassess — not yet?
              </button>
            </>
          )}

          {isCompleted && (
            <>
              {task.id === "abc" && cardiacArrestPending && onCheckCardiacArrest && (
                <button
                  onClick={() => { onCheckCardiacArrest(); onClose(); }}
                  className="w-full border border-red-900/50 text-red-400 font-medium py-2.5 text-sm rounded-lg"
                >
                  Unstable — check for cardiac arrest
                </button>
              )}
              {canUndo && onUndo && (
                <>
                  {undoConfirm ? (
                    <div className="border border-amber-900/40 rounded-lg p-3 space-y-2">
                      <p className="text-amber-200/90 text-xs leading-relaxed">
                        Clear this answer and log it as undone? Use if logged in error — e.g. drug said given but not confirmed.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { onUndo(task); setUndoConfirm(false); }}
                          className="flex-1 bg-amber-700 text-white font-bold py-2.5 text-sm rounded-lg"
                        >
                          Yes — undo
                        </button>
                        <button
                          onClick={() => setUndoConfirm(false)}
                          className="flex-1 border border-gray-700 text-gray-400 text-sm py-2.5 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => (undoNeedsConfirm(task) ? setUndoConfirm(true) : onUndo(task))}
                      className="w-full border border-amber-800/60 text-amber-400 font-medium py-2.5 text-sm rounded-lg"
                    >
                      Undo
                    </button>
                  )}
                </>
              )}
              {undoBlock && (
                <p className="text-gray-600 text-xs border border-gray-800 rounded-lg px-3 py-2">{undoBlock}</p>
              )}
            </>
          )}

          <button onClick={onClose} className="text-gray-600 text-sm py-2 mt-1">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskRow({ task, state, taskStates, level, txaTime, now, emergencyStartTime, onConfirm, onAssignedDone, onAutonomyAction, onOpenDetail, suggestedTaskId, forcedTasks, isAutonomousLead }) {
  const rawStatus = state?.status ?? null;
  const txaDeferred = task.id === "txa" && rawStatus === "skipped" && txaEligible(taskStates, level, txaTime);
  const status = txaDeferred ? null : rawStatus;
  const blockingDeps = (task.deps || []).filter(id => !depSatisfied(id, taskStates));
  const fourTsLocked = deferFourTs(task, taskStates, level);
  const isLocked = !status && (blockingDeps.length > 0 || fourTsLocked);
  const isSuggested = suggestedTaskId === task.id;
  const isPendingAutonomy = isAutonomyEligible(task, forcedTasks) && status === null;
  const lockHint = fourTsLocked
    ? "awaits MHP / TXA / 2nd cannula"
    : blockingDeps.length > 0
      ? `awaits ${TASKS.find(t => t.id === blockingDeps[0])?.title ?? blockingDeps[0]}`
      : null;

  function completedMark() {
    const ts = task.id === "txa" && txaTime
      ? txaTime
      : (state?.doneAt ?? state?.alreadyGivenAt);
    return taskCompletedTimeLabel(ts);
  }

  if (status === "done" || status === "already_given") {
    const assessNote = task.assess && state?.assessOutcome === "excluded"
      ? task.assess.excludeListNote
      : task.assess && state?.assessOutcome === "present"
        ? task.assess.presentListNote
        : null;
    const callNote = state?.coveredByHigherCall
      ? (task.id === "call_team" ? "included in major call" : "included in massive call")
      : null;
    const refNote = state?.arrestConfirmed ? "2222 called"
      : state?.considerNoArrest ? "no arrest"
      : state?.inTheatre ? "in theatre"
      : null;
    const mark = completedMark();
    const oosNote = state?.outOfSequence ? "out of sequence" : null;
    return (
      <button type="button" onClick={() => onOpenDetail(task)} className="w-full flex items-center gap-3 px-4 py-1.5 text-left active:bg-gray-900/40 transition">
        <span className="text-gray-700 text-xs w-3 shrink-0">✓</span>
        <span className="text-gray-700 text-sm min-w-0 flex-1">{task.title}</span>
        <span className="text-gray-800 text-xs shrink-0 text-right tabular-nums">
          {[status === "already_given" && "already given", oosNote, assessNote, callNote, refNote, mark].filter(Boolean).join(" · ")}
        </span>
      </button>
    );
  }

  if (status === "not_indicated") {
    return (
      <button type="button" onClick={() => onOpenDetail(task)} className="w-full flex items-center gap-3 px-4 py-1.5 text-left active:bg-gray-900/40 transition">
        <span className="text-gray-800 text-xs w-3 shrink-0">–</span>
        <span className="text-gray-800 text-sm flex-1">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto">not indicated</span>
      </button>
    );
  }

  if (status === "skipped") {
    return (
      <button type="button" onClick={() => onOpenDetail(task)} className="w-full flex items-center gap-3 px-4 py-1.5 text-left active:bg-gray-900/40 transition">
        <span className="text-gray-800 text-xs w-3 shrink-0">–</span>
        <span className="text-gray-800 text-sm flex-1">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto">
          {state?.skipReason === "not_required" ? "not required — uterus firm" : "skipped"}
        </span>
      </button>
    );
  }

  if (status === "assigned") {
    const assignedAt = state.assignedAt || now;
    const statusNote = task.id === "theatre" ? "preparing" : null;
    let timeLabel;
    if (task.followUpDelay) {
      const remainingMs = assignedAt + task.followUpDelay * 1000 - now;
      timeLabel = remainingMs <= 0 ? "follow-up due" : `follow-up in ${fmt(Math.max(0, remainingMs))}`;
    } else {
      timeLabel = fmt(now - assignedAt);
    }
    const chaseOverdue = task.followUpDelay && assignedAt + task.followUpDelay * 1000 - now <= 0;
    return (
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-80 transition"
        >
          <span className="text-amber-500 text-xs w-3 shrink-0">→</span>
          <span className="text-white text-sm flex-1 min-w-0">{task.title}</span>
          <span className={`text-xs tabular-nums shrink-0 text-right ${chaseOverdue ? "text-amber-400 font-medium" : "text-gray-600"}`}>
            {[statusNote, timeLabel].filter(Boolean).join(" · ")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onAssignedDone(task.id)}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-600 text-white hover:border-gray-400 transition"
        >
          Done ✓
        </button>
      </div>
    );
  }

  if (isLocked && !isPendingAutonomy) {
    const blockingTitle = fourTsLocked
      ? "MHP / TXA / 2nd cannula"
      : (TASKS.find(t => t.id === blockingDeps[0])?.title ?? blockingDeps[0]);
    return (
      <button type="button" onClick={() => onOpenDetail(task)} className="w-full flex items-center gap-3 px-4 py-1.5 text-left opacity-50 active:opacity-70 transition">
        <span className="text-gray-700 text-xs w-3 shrink-0">○</span>
        <span className="text-gray-700 text-sm flex-1">{task.title}</span>
        <span className="text-gray-700 text-xs shrink-0">awaits {blockingTitle}</span>
      </button>
    );
  }

  if (isPendingAutonomy) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 ${isSuggested ? "bg-amber-950/20" : ""}`}>
        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-80 transition"
        >
          <span className={`text-xs w-3 shrink-0 ${isSuggested ? "text-amber-500" : txaDeferred ? "text-amber-500" : "text-gray-700"}`}>
            {isSuggested ? "▸" : "·"}
          </span>
          <span className={`text-sm flex-1 min-w-0 ${isSuggested ? "text-white font-medium" : txaDeferred ? "text-amber-200" : isLocked ? "text-gray-400" : "text-gray-300"}`}>
            {task.title}
          </span>
          {txaDeferred && !isSuggested && <span className="text-amber-600 text-xs shrink-0">still needed</span>}
          {isLocked && lockHint && (
            <span className="text-gray-600 text-[10px] shrink-0 hidden sm:inline max-w-[8rem] truncate">{lockHint}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onAutonomyAction(task)}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-600 text-white hover:border-gray-400 transition"
        >
          {autonomyButtonLabel(task)}
        </button>
      </div>
    );
  }

  // Pending non-autonomy (calls, consider surgical, fundal, etc.)
  if (isAutonomousLead && task.type === "call" && status === null) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2.5 ${isSuggested ? "bg-amber-950/20" : ""}`}>
        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left active:opacity-80 transition"
        >
          <span className={`text-xs w-3 shrink-0 ${isSuggested ? "text-amber-500" : "text-gray-700"}`}>
            {isSuggested ? "▸" : "·"}
          </span>
          <span className={`text-sm flex-1 min-w-0 ${isSuggested ? "text-white font-medium" : "text-gray-300"}`}>{task.title}</span>
        </button>
        <button
          type="button"
          onClick={() => onAutonomyAction(task)}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-600 text-white hover:border-gray-400 transition"
        >
          Done ✓
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenDetail(task)}
      className="w-full flex items-center gap-3 px-4 py-2 text-left active:bg-gray-900/40 transition"
    >
      <span className={`text-xs w-3 shrink-0 ${txaDeferred ? "text-amber-500" : task.consider ? "text-violet-500/70" : "text-gray-700"}`}>
        {task.consider ? "◇" : "·"}
      </span>
      <span className={`text-sm flex-1 ${txaDeferred ? "text-amber-200" : task.consider ? "text-violet-200/90" : "text-gray-300"}`}>{task.title}</span>
      {txaDeferred && <span className="text-amber-600 text-xs shrink-0">still needed</span>}
      {task.consider && status === null && <span className="text-violet-500/60 text-[10px] shrink-0">consider</span>}
    </button>
  );
}

function TaskList({ taskStates, level, now, onConfirmTask, onAssignedDone, onAutonomyAction, onOpenDetail, forcedTasks, txaTime, emergencyStartTime, suggestedTaskId, leadMode, jointArrestActive = false, jointDeckMode = false, jointArrest, onArrestResusToggle }) {
  const relevantLevels = LEVEL_ORDER.filter(l => levelVal(l) <= levelVal(level));
  const showSections = relevantLevels.length > 1;
  const sectionLabels = { minor: "Initial response", major: "Major PPH", massive: "Massive PPH" };
  const isAutonomousLead = leadMode === LEAD_MODES.AUTONOMOUS;
  const pinnedCallId = isAutonomousLead ? stabilisationCallId(level) : null;
  const pinnedCallTask = pinnedCallId ? TASKS.find(t => t.id === pinnedCallId) : null;
  const pinnedCallPending = pinnedCallTask && (taskStates[pinnedCallTask.id]?.status ?? null) === null;
  const forcedAbove = (forcedTasks || [])
    .map(id => TASKS.find(t => t.id === id))
    .filter(t => t && levelVal(t.level) > levelVal(level));

  return (
    <div className="min-h-0">
      {jointArrestActive && jointArrest && !jointDeckMode && (
        <JointArrestChecklistInline arrest={jointArrest} onToggle={onArrestResusToggle} />
      )}
      <div className={jointArrestActive && !jointDeckMode ? "border-l-4 border-l-amber-500/40" : ""}>
      {jointArrestActive && !jointDeckMode && (
        <div className="px-4 py-2 bg-amber-950/20 border-b border-amber-900/30">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">PPH haemorrhage — continue in parallel</span>
        </div>
      )}
      {pinnedCallPending && pinnedCallTask && (
        <div className="border-b border-amber-900/50 bg-amber-950/25">
          <div className="px-4 py-2 border-b border-amber-900/30">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Call — activate now</span>
          </div>
          <TaskRow
            key={pinnedCallTask.id}
            task={pinnedCallTask}
            state={taskStates[pinnedCallTask.id]}
            taskStates={taskStates}
            level={level}
            txaTime={txaTime}
            now={now}
            emergencyStartTime={emergencyStartTime}
            onConfirm={onConfirmTask}
            onAssignedDone={onAssignedDone}
            onAutonomyAction={onAutonomyAction}
            onOpenDetail={onOpenDetail}
            suggestedTaskId={suggestedTaskId}
            forcedTasks={forcedTasks}
            isAutonomousLead={isAutonomousLead}
          />
        </div>
      )}
      {forcedAbove.length > 0 && (
        <div>
          <div className="px-4 py-2 border-b border-gray-900">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">Activated early</span>
          </div>
          {forcedAbove.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              state={taskStates[task.id]}
              taskStates={taskStates}
              level={level}
              txaTime={txaTime}
              now={now}
              emergencyStartTime={emergencyStartTime}
              onConfirm={onConfirmTask}
              onAssignedDone={onAssignedDone}
              onAutonomyAction={onAutonomyAction}
              onOpenDetail={onOpenDetail}
              suggestedTaskId={suggestedTaskId}
              forcedTasks={forcedTasks}
              isAutonomousLead={isAutonomousLead}
            />
          ))}
        </div>
      )}
      {relevantLevels.map(sectionLevel => {
        const tasks = TASKS.filter(t => t.level === sectionLevel && (!t.hidden || (forcedTasks || []).includes(t.id)) && callTaskVisibleInChecklist(t, level) && t.id !== pinnedCallId);
        return (
          <div key={sectionLevel}>
            {showSections && (
              <div className="px-4 py-2 border-b border-gray-900">
                <span className="text-gray-700 text-xs font-bold uppercase tracking-widest">{sectionLabels[sectionLevel]}</span>
              </div>
            )}
            {tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                state={taskStates[task.id]}
                taskStates={taskStates}
                level={level}
                txaTime={txaTime}
                now={now}
                emergencyStartTime={emergencyStartTime}
                onConfirm={onConfirmTask}
              onAssignedDone={onAssignedDone}
              onAutonomyAction={onAutonomyAction}
              onOpenDetail={onOpenDetail}
              suggestedTaskId={suggestedTaskId}
              forcedTasks={forcedTasks}
              isAutonomousLead={isAutonomousLead}
              />
            ))}
          </div>
        );
      })}
      </div>
    </div>
  );
}

function SetupScreen({ onConfirm, onExit }) {
  const [ml, setMl] = useState("");
  const [birthTimeInput, setBirthTimeInput] = useState("");
  const [leadMode, setLeadMode] = useState(LEAD_MODES.GUIDED);
  const presets = [
    { v: 500,  label: "500 ml",   sub: "Minor PPH" },
    { v: 1000, label: "1,000 ml", sub: "Major PPH" },
    { v: 1500, label: "1,500 ml", sub: "Major PPH" },
    { v: 2000, label: "2,000 ml", sub: "Massive PPH" },
  ];

  function parseBirthTime() {
    if (!birthTimeInput.trim()) return null;
    const [hh, mm] = birthTimeInput.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return null;
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    // if parsed time is in the future, assume previous day
    if (d.getTime() > Date.now()) d.setDate(d.getDate() - 1);
    return d.getTime();
  }

  function submit(v) {
    if (v === "" || v == null || (typeof v === "string" && !v.trim())) return;
    const n = Number(v);
    if (!isNaN(n) && n > 0) onConfirm(n, parseBirthTime(), leadMode);
  }

  const customMl = ml.trim();
  const customValid = customMl !== "" && !isNaN(Number(customMl)) && Number(customMl) > 0;

  return (
    <div className="w-full min-w-0 box-border min-h-screen bg-gray-950 flex flex-col px-4 pt-8 pb-8 gap-6">
      <div className="flex items-start justify-between gap-3 w-full min-w-0">
        <div className="min-w-0 flex-1">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">PPH</p>
        <h1 className="text-white text-2xl font-black leading-tight">Initial blood loss</h1>
        <p className="text-gray-500 text-sm mt-1">How much has been lost?</p>
        </div>
        <button
          onClick={onExit}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600 shrink-0"
          aria-label="Exit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="w-full min-w-0 space-y-2">
        <p className="text-gray-600 text-xs uppercase tracking-widest">Session mode</p>
        <LeadModeToggle value={leadMode} onChange={setLeadMode} />
        <p className="text-gray-600 text-xs">
          {leadMode === LEAD_MODES.AUTONOMOUS
            ? "Checklist & timers — you lead, no step prompts"
            : "Step-by-step prompts — next task surfaced for you"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full min-w-0">
        {presets.map(({ v, label, sub }) => (
          <button key={v} onClick={() => submit(v)}
            className="min-w-0 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-left p-3 rounded-xl transition">
            <div className="text-white font-bold text-sm">{label}</div>
            <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
          </button>
        ))}
      </div>
      <div className="w-full min-w-0 space-y-3">
        <input
          type="number" value={ml} onChange={e => setMl(e.target.value)} placeholder="Enter ml"
          className="w-full min-w-0 box-border bg-gray-900 border border-gray-800 focus:border-gray-600 text-white rounded-xl px-4 py-3 text-base outline-none transition"
          onKeyDown={e => e.key === "Enter" && submit(ml)}
        />
        <button
          onClick={() => submit(ml)}
          disabled={!customValid}
          className="w-full bg-white text-gray-950 font-bold py-3 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start →
        </button>
      </div>
      <div className="w-full min-w-0">
        <p className="text-gray-600 text-xs mb-2">Birth time <span className="text-gray-700">(for TXA 3-hour window)</span></p>
        <input
          type="time" value={birthTimeInput} onChange={e => setBirthTimeInput(e.target.value)}
          className="w-full min-w-0 box-border bg-gray-900 border border-gray-800 focus:border-gray-600 text-white rounded-xl px-4 py-3 text-base outline-none transition"
        />
        <p className="text-gray-700 text-xs mt-1.5">Leave blank to use emergency start time</p>
      </div>
    </div>
  );
}

// ─── Aftercare checklist ──────────────────────────────────────────────────────
// Post-control care from GTG52 (minor_resolved / major_resolved / end_massive).
// Each item surfaces once the haemorrhage reached its minLevel.

const AFTERCARE = [
  { id: "oxy_continue",        minLevel: "minor",   text: "Continue oxytocin infusion for ≥4 hours" },
  { id: "obs",                 minLevel: "minor",   text: "Hourly BP, pulse and urine output for ≥4 hours" },
  { id: "fbc_check",           minLevel: "minor",   text: "Check FBC — transfuse if Hb <80 g/L or symptomatic" },
  { id: "vte",                 minLevel: "minor",   text: "VTE prophylaxis — restart LMWH once haemostasis confirmed" },
  { id: "document",            minLevel: "minor",   text: "Document cause, management and response in notes" },
  { id: "debrief",             minLevel: "minor",   text: "Debrief patient and partner — written summary" },
  { id: "hdu",                 minLevel: "major",   text: "HDU / ITU admission for ongoing monitoring" },
  { id: "serial_bloods",       minLevel: "major",   text: "Serial bloods: FBC, coagulation, U&E (4-hourly if massive)" },
  { id: "consultant_debrief",  minLevel: "major",   text: "Postnatal consultant debrief before discharge" },
  { id: "mbrrace",             minLevel: "massive", text: "MBRRACE notification if maternal death or near-miss" },
];

function MergedAftercareScreen({ level, arrestRecord, onComplete }) {
  const pphItems = AFTERCARE.filter(a => levelVal(level) >= levelVal(a.minLevel));
  const showPostResus = !!arrestRecord?.rosc;
  const postResusItems = showPostResus ? JOINT_POST_RESUS : [];
  const [postResusChecked, setPostResusChecked] = useState(() =>
    Object.fromEntries((arrestRecord?.postResusDone ?? []).map(id => [id, true]))
  );
  const [pphChecked, setPphChecked] = useState({});
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  function togglePostResus(id) { setPostResusChecked(prev => ({ ...prev, [id]: !prev[id] })); }
  function togglePph(id) { setPphChecked(prev => ({ ...prev, [id]: !prev[id] })); }

  function tryComplete() {
    const pphDone = pphItems.filter(a => pphChecked[a.id]);
    const postResusDone = postResusItems.filter(a => postResusChecked[a.id]);
    if (!pphDone.length && !postResusDone.length) { setConfirmEmpty(true); return; }
    onComplete({ pphDone, postResusDone });
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">
          {showPostResus ? "PPH + post-arrest" : "Post-PPH"}
        </p>
        <h2 className="text-white text-2xl font-black">Aftercare checklist</h2>
        <p className="text-gray-500 text-sm mt-1">
          {showPostResus
            ? "ROSC achieved — complete post-arrest and PPH aftercare before handover."
            : "Haemostasis achieved — complete before handover."}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {showPostResus && (
          <div className="space-y-2">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider px-1">Post-arrest care</p>
            {postResusItems.map(a => (
              <button key={a.id} onClick={() => togglePostResus(a.id)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition ${postResusChecked[a.id] ? "border-emerald-900/40 bg-emerald-950/20" : "border-gray-800"}`}>
                <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${postResusChecked[a.id] ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"}`}>✓</span>
                <span className={`text-sm leading-snug ${postResusChecked[a.id] ? "text-gray-400 line-through" : "text-white"}`}>{a.text}</span>
              </button>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider px-1">PPH aftercare</p>
          {pphItems.map(a => (
            <button key={a.id} onClick={() => togglePph(a.id)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition ${pphChecked[a.id] ? "border-gray-700 bg-gray-900" : "border-gray-800"}`}>
              <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${pphChecked[a.id] ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"}`}>✓</span>
              <span className={`text-sm leading-snug ${pphChecked[a.id] ? "text-gray-400 line-through" : "text-white"}`}>{a.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 border-t border-gray-800 flex-shrink-0 space-y-3">
        {confirmEmpty && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2">
            <p className="text-gray-400 text-sm">No aftercare items ticked — complete anyway?</p>
            <div className="flex gap-2">
              <button onClick={() => onComplete({ pphDone: [], postResusDone: [] })} className="flex-1 border border-gray-700 text-gray-300 text-sm py-2 rounded-lg">Complete anyway</button>
              <button onClick={() => setConfirmEmpty(false)} className="flex-1 text-gray-500 text-sm py-2">Go back</button>
            </div>
          </div>
        )}
        <button onClick={tryComplete}
          className="w-full bg-white text-gray-950 font-bold py-3.5 rounded-lg text-sm">
          Complete — view record
        </button>
      </div>
    </div>
  );
}

// ─── Summary screen ───────────────────────────────────────────────────────────

function SummaryScreen({ log, emergencyStartTime, resolveTime, bloodLoss, peakBloodLoss, aftercareCompleted, arrestRecord, onBack }) {
  const duration = (resolveTime ?? Date.now()) - emergencyStartTime;
  const peak = peakBloodLoss ?? bloodLoss;
  const arrestSummary = arrestRecord ? jointArrestSummaryText(arrestRecord) : null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">PPH record</p>
        <div className="flex gap-8 flex-wrap">
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Duration</p>
            <p className="text-white font-mono font-bold text-lg">{fmt(duration)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Final blood loss</p>
            <p className={`font-bold text-lg ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</p>
          </div>
          {peak > bloodLoss && (
            <div>
              <p className="text-gray-600 text-xs mb-0.5">Peak blood loss</p>
              <p className={`font-bold text-lg ${bloodLossClass(peak)}`}>{peak} ml</p>
            </div>
          )}
        </div>
        {arrestSummary && (
          <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-2.5">
            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Joint cardiac arrest</p>
            <p className="text-gray-300 text-sm">{arrestSummary.outcome}</p>
            <p className="text-gray-500 text-xs mt-0.5">{arrestSummary.stats}</p>
            {arrestSummary.postResusDone?.length > 0 && (
              <p className="text-emerald-400/80 text-xs mt-1">
                Post-arrest care: {arrestSummary.postResusDone.length}/{JOINT_POST_RESUS.length} documented
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {log.map((e, i) => {
          const isArrest = e.kind === "arrest" || e.kind === "arrest_summary";
          const isPostResus = e.kind === "post_resus";
          const prevKind = log[i - 1]?.kind;
          const showArrestHeader = isArrest && prevKind !== "arrest" && prevKind !== "arrest_summary";
          const showPostResusHeader = isPostResus && prevKind !== "post_resus";
          return (
            <div key={i}>
              {showArrestHeader && (
                <div className="px-5 py-2 bg-red-950/30 border-b border-red-900/30">
                  <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">Cardiac arrest timeline</span>
                </div>
              )}
              {showPostResusHeader && (
                <div className="px-5 py-2 bg-emerald-950/30 border-b border-emerald-900/30">
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Post-arrest aftercare</span>
                </div>
              )}
              <div className={`flex items-start gap-3 px-5 py-2.5 border-b border-gray-900 ${
                isArrest ? "bg-red-950/10" : isPostResus ? "bg-emerald-950/10" : ""
              }`}>
                <span className="text-gray-700 text-xs font-mono tabular-nums mt-0.5 w-16 shrink-0">{fmtTime(e.time)}</span>
                <span className={`text-sm leading-snug ${
                  isArrest ? "text-red-200/90" : isPostResus ? "text-emerald-200/90" : "text-gray-300"
                }`}>{e.label}</span>
              </div>
            </div>
          );
        })}
        {!log.length && <p className="text-gray-700 text-sm text-center py-10">No events recorded</p>}
      </div>

      <div className="px-5 py-5 border-t border-gray-800 flex-shrink-0 space-y-4">
        <p className="text-gray-500 text-xs leading-relaxed border-l-2 border-gray-700 pl-3">
          Complete incident documentation. Debrief team. Arrange postnatal review.<br />
          Report to MBRRACE-UK if maternal near miss or death
          {peak >= 2000 ? " (peak ≥2,000 ml — consider MBRRACE notification)." : "."}
        </p>
        {!aftercareCompleted && (
          <div className="space-y-1.5 text-xs text-gray-700">
            <p className="text-gray-500 font-medium mb-2">Post-event checklist</p>
            {["Drug record with times and doses", "Repeat bloods at 4 hours", "Postnatal debrief offered", "Thromboprophylaxis reviewed", "Iron supplementation started", "Incident report submitted"].map(item => (
              <p key={item}>☐ {item}</p>
            ))}
          </div>
        )}
        <button onClick={onBack} className="w-full border border-gray-800 text-gray-500 font-medium py-3 rounded-xl text-sm">Close</button>
      </div>
    </div>
  );
}

// ─── Session persistence ──────────────────────────────────────────────────────

const STORAGE_KEY = "pocket_og_pph_session";
const CA_STORAGE_KEY = "pocket_og_cardiac_arrest_session";
function saveSession(data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
function clearSession() { try { localStorage.removeItem(STORAGE_KEY); } catch {} }

function readActivePphSnapshot() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return s?.phase === "active" ? s : null;
  } catch {
    return null;
  }
}

function caClear() { try { localStorage.removeItem(CA_STORAGE_KEY); } catch {} }

function readActiveCaSnapshot() {
  try {
    const s = JSON.parse(localStorage.getItem(CA_STORAGE_KEY));
    return (s?.phase === "active" || s?.phase === "postresus") ? s : null;
  } catch {
    return null;
  }
}

// Testing aid — dev builds and localhost preview only (never production/PWA).
const SHOW_DEV_CLOCK = import.meta.env.DEV
  || (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));

function DevClock({ offsetMs, onAdvance, onReset, pphElapsed, jointArrest, now }) {
  const totalMin = Math.round(offsetMs / 60000);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const label = offsetMs === 0 ? "real time" : `+${hh ? `${hh}h ` : ""}${mm}m`;
  const steps = [
    { label: "+1 min",  ms: 60_000 },
    { label: "+5 min",  ms: 5 * 60_000 },
    { label: "+15 min", ms: 15 * 60_000 },
    { label: "+30 min", ms: 30 * 60_000 },
  ];
  const arrestActive = jointArrest?.active && !jointArrest?.rosc;
  const cycleRem = arrestActive ? cycleRemainingMs(jointArrest, now) : null;
  const adrDue = arrestActive && adrenalineDue(jointArrest, now);
  const adrNextMs = arrestActive && jointArrest.lastAdrenalineAt && !adrDue
    ? Math.max(0, ADRENALINE_INTERVAL_SEC * 1000 - (now - jointArrest.lastAdrenalineAt))
    : null;

  return (
    <div className="relative z-10 flex-shrink-0 border-t border-violet-900/60 bg-violet-950/95 px-3 py-2 space-y-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-violet-300 text-[11px] font-bold uppercase tracking-wider shrink-0">⏩ Dev clock</span>
        {steps.map(s => (
          <button key={s.label} onClick={() => onAdvance(s.ms)}
            className="border border-violet-700 text-violet-200 text-xs px-2.5 py-1 rounded-md hover:bg-violet-900/50 transition">
            {s.label}
          </button>
        ))}
        <span className="text-violet-400 text-xs ml-auto tabular-nums shrink-0">offset: {label}</span>
        <button onClick={onReset} className="border border-violet-800 text-violet-400 text-xs px-2 py-1 rounded-md shrink-0">reset</button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] tabular-nums">
        <span className="text-violet-400/80">PPH elapsed <span className="text-violet-200 font-mono">{fmt(pphElapsed)}</span></span>
        {arrestActive && (
          <>
            <span className="text-red-400/80">Arrest c{jointArrest.cycleNumber} <span className="text-red-300 font-mono">{fmt(cycleRem)}</span> to rhythm</span>
            {jointArrest.adrenalineCount > 0 && adrNextMs != null && (
              <span className="text-amber-400/80">Adr next <span className="text-amber-300 font-mono">{fmt(adrNextMs)}</span></span>
            )}
            {adrDue && (
              <span className="text-amber-300 font-bold">Adrenaline due now</span>
            )}
          </>
        )}
        {jointArrest?.rosc && (
          <span className="text-emerald-400/80">ROSC — arrest cycles stopped</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EmergencyPage({ onClose, onLaunchCardiacArrest, resumeFromParallel = false, onParallelResumeHandled }) {
  const [resumeSnapshot] = useState(() => (resumeFromParallel ? readActivePphSnapshot() : null));
  const [savedSession] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [recoveryDismissed, setRecoveryDismissed] = useState(() => !!resumeSnapshot);
  const [emergencyStartTime, setEmergencyStartTime] = useState(() => resumeSnapshot?.emergencyStartTime ?? savedSession?.emergencyStartTime ?? Date.now());
  const [phase, setPhase] = useState(() => (resumeSnapshot ? "active" : "setup"));
  const [bloodLoss, setBloodLoss] = useState(() => resumeSnapshot?.bloodLoss ?? 0);
  const [taskStates, setTaskStates] = useState(() => resumeSnapshot?.taskStates ?? {});
  const [log, setLog] = useState(() => resumeSnapshot?.log ?? []);
  const [txaTime, setTxaTime] = useState(() => resumeSnapshot?.txaTime ?? null);
  const [txaHandled, setTxaHandled] = useState(() => resumeSnapshot?.txaHandled ?? false);
  const [txaSecondDone, setTxaSecondDone] = useState(() => resumeSnapshot?.txaSecondDone ?? false);
  const [toneAssessed, setToneAssessed] = useState(() => resumeSnapshot?.toneAssessed ?? false);
  const [birthTime, setBirthTime] = useState(() => resumeSnapshot?.birthTime ?? null);
  const [carboCount, setCarboCount] = useState(() => {
    const s = resumeSnapshot;
    if (!s) return 0;
    if ((s.carboCount ?? 0) > 0 && !s.carboLastTime && !["done", "already_given"].includes(s.taskStates?.carboprost?.status)) return 0;
    return s.carboCount ?? 0;
  });
  const [carboLastTime, setCarboLastTime] = useState(() => resumeSnapshot?.carboLastTime ?? null);
  const [ciCleared, setCiCleared] = useState(() => resumeSnapshot?.ciCleared ?? {});
  const [forcedTasks, setForcedTasks] = useState(() => resumeSnapshot?.forcedTasks ?? []);
  const [uterotonicHold, setUterotonicHold] = useState(() => resumeSnapshot?.uterotonicHold ?? false);
  const [uterotonicEscalate, setUterotonicEscalate] = useState(() => resumeSnapshot?.uterotonicEscalate ?? null);
  const [queuedUterotonicId, setQueuedUterotonicId] = useState(() => resumeSnapshot?.queuedUterotonicId ?? null);
  const [ivAccessPendingSince, setIvAccessPendingSince] = useState(() => resumeSnapshot?.ivAccessPendingSince ?? null);
  const [ivAccessRetries, setIvAccessRetries] = useState(() => resumeSnapshot?.ivAccessRetries ?? 0);
  const [ivFailSnoozeUntil, setIvFailSnoozeUntil] = useState(() => resumeSnapshot?.ivFailSnoozeUntil ?? null);
  const [forcedFollowUpId, setForcedFollowUpId] = useState(null);
  const [infusionReassess, setInfusionReassess] = useState(() => resumeSnapshot?.infusionReassess ?? false);
  const [sessionRecoveredAt, setSessionRecoveredAt] = useState(() => (resumeSnapshot ? Date.now() : null));
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [clockOffset, setClockOffset] = useState(0); // dev fast-forward (testing only)
  const [escalationAlert, setEscalationAlert] = useState(null);
  const [standDownConfirm, setStandDownConfirm] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [leadMode, setLeadMode] = useState(() =>
    (resumeSnapshot?.leadMode ?? savedSession?.leadMode) === LEAD_MODES.AUTONOMOUS ? LEAD_MODES.AUTONOMOUS : LEAD_MODES.GUIDED
  );
  const [checklistAutonomyFlow, setChecklistAutonomyFlow] = useState(null);
  const [checklistDetailTask, setChecklistDetailTask] = useState(null);
  const [undoPromptHold, setUndoPromptHold] = useState(() => new Set());
  const [peakBloodLoss, setPeakBloodLoss] = useState(() => resumeSnapshot?.peakBloodLoss ?? resumeSnapshot?.bloodLoss ?? 0);
  const [aftercareCompleted, setAftercareCompleted] = useState(() => resumeSnapshot?.aftercareCompleted ?? false);
  const [jointArrest, setJointArrest] = useState(() => normalizeJointArrestState(resumeSnapshot?.jointArrest));
  const [jointArrestSetupOpen, setJointArrestSetupOpen] = useState(false);
  const [arrestRecord, setArrestRecord] = useState(null);

  const prevLevelRef = useRef(resumeSnapshot ? getLevel(resumeSnapshot.bloodLoss ?? 0) : null);
  const wakeLockRef = useRef(null);
  const parallelReturnLogged = useRef(false);

  // Dev fast-forward clock. Every timestamp and the ticking `now` run through
  // nowTs(), so advancing the offset makes all timers (drug delays, carboprost
  // repeats, TXA window, IV-fail windows) behave as if real time had passed.
  // The control that drives this only renders in dev builds — see DevClock below.
  const clockOffsetRef = useRef(0);
  const nowTs = () => Date.now() + clockOffsetRef.current;
  function advanceClock(ms) {
    clockOffsetRef.current += ms;
    setClockOffset(clockOffsetRef.current);
    const nextNow = nowTs();
    setNow(nextNow);
    setJointArrest(prev => {
      if (!prev.active || prev.rosc || prev.pendingShock || prev.rhythmPromptOpen) return prev;
      if (rhythmCheckDue(prev, nextNow)) {
        return { ...prev, rhythmPromptOpen: true };
      }
      return prev;
    });
  }
  function resetClock() {
    clockOffsetRef.current = 0;
    setClockOffset(0);
    setNow(nowTs());
  }

  useEffect(() => {
    const id = setInterval(() => setNow(nowTs()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== "active" || !("wakeLock" in navigator)) return;
    let released = false;
    async function acquire() {
      try {
        const wl = await navigator.wakeLock.request("screen");
        if (released) { wl.release().catch(() => {}); return; }
        wakeLockRef.current = wl;
      } catch { /* unsupported or denied */ }
    }
    acquire();
    function onVisibilityChange() {
      if (document.visibilityState === "visible") acquire();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      wakeLockRef.current?.release().catch(() => {});
    };
  }, [phase]);

  const level = getLevel(bloodLoss);

  function addLog(kind, label) {
    setLog(prev => [...prev, { kind, label, time: nowTs() }]);
  }

  function recordBloodLossDelta(delta, label) {
    const next = bloodLoss + delta;
    const at = nowTs();
    const newLog = [...log, { kind: "blood_loss", label, total: next, time: at }];
    setBloodLoss(next);
    setPeakBloodLoss(prev => Math.max(prev, next));
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, getLevel(next), at, next);
  }

  useEffect(() => {
    if (phase !== "active") return;
    const prev = prevLevelRef.current;
    if (prev && prev !== level) {
      const prevV = levelVal(prev);
      const newV = levelVal(level);
      const note = newV - prevV >= 2
        ? "Crossed Major (≥1,000 ml) and Massive (≥2,000 ml) thresholds in one step"
        : null;
      if (newV - prevV >= 2) {
        addLog("escalated", `Crossed Major PPH threshold (${bloodLoss} ml)`);
      }
      addLog("escalated", `Escalated to ${({ minor: "Minor", major: "Major", massive: "Massive" })[level]} PPH (${bloodLoss} ml)`);
      setEscalationAlert({ level, note });
    }
    prevLevelRef.current = level;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, phase]);

  const effectiveBirthTime = birthTime ?? emergencyStartTime;
  const ivAccessDone = taskStates.iv_access?.status === "done";

  function sessionSnapshot(overrides = {}) {
    return {
      emergencyStartTime,
      phase,
      bloodLoss,
      peakBloodLoss,
      aftercareCompleted,
      taskStates,
      toneAssessed,
      log,
      txaTime,
      txaHandled,
      txaSecondDone,
      birthTime,
      carboCount,
      carboLastTime,
      ciCleared,
      forcedTasks,
      uterotonicHold,
      uterotonicEscalate,
      queuedUterotonicId,
      ivAccessPendingSince,
      ivAccessRetries,
      ivFailSnoozeUntil,
      infusionReassess,
      sessionRecoveredAt,
      leadMode,
      jointArrest,
      ...overrides,
    };
  }

  function flushSession(overrides = {}) {
    if (phase !== "active") return;
    saveSession(sessionSnapshot(overrides));
  }

  useEffect(() => {
    if (phase !== "active") return;
    flushSession();
  }, [phase, bloodLoss, peakBloodLoss, aftercareCompleted, taskStates, toneAssessed, log, txaTime, txaHandled, txaSecondDone, birthTime, carboCount, carboLastTime, ciCleared, forcedTasks, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, ivFailSnoozeUntil, infusionReassess, sessionRecoveredAt, leadMode, jointArrest]);

  useEffect(() => {
    if (!resumeSnapshot || parallelReturnLogged.current) return;
    parallelReturnLogged.current = true;
    const t = Date.now();
    setLog(prev => [...prev, {
      kind: "parallel_return",
      label: "Returned from cardiac arrest — PPH management continues",
      time: t,
    }]);
    onParallelResumeHandled?.();
  }, [resumeSnapshot, onParallelResumeHandled]);

  // Auto-open rhythm check when CPR cycle elapses (embedded arrest).
  useEffect(() => {
    if (phase !== "active" || !jointArrest.active || jointArrest.rosc) return;
    if (jointArrest.pendingShock || jointArrest.rhythmPromptOpen) return;
    if (rhythmCheckDue(jointArrest, nowTs())) {
      setJointArrest(prev => ({ ...prev, rhythmPromptOpen: true }));
    }
  }, [phase, jointArrest.active, jointArrest.rosc, jointArrest.cycleStart, jointArrest.pendingShock, jointArrest.rhythmPromptOpen, now]);

  function evaluateEscalationAfterBlood(newLog, newLevel, at, bloodLossMl) {
    const esc = canEscalateUterotonic({ taskStates, log: newLog, now: at, level: newLevel, uterotonicHold, forcedTasks });
    if (esc && getLastUterotonic(taskStates)) setUterotonicEscalate(esc);
    else setUterotonicEscalate(null);
    if (uterotonicHold && !bleedingSettled(newLog, at)) setUterotonicHold(false);
    setForcedTasks(prev => {
      const next = withTheatreIfUncontrolledMajor(prev, taskStates, newLog, newLevel, bloodLossMl, at);
      if (!prev.includes("theatre") && next.includes("theatre")) {
        setLog(l => [...l, { kind: "theatre_forced", label: "Major PPH — ongoing bleeding after uterotonics — theatre activated", time: at }]);
      }
      return next;
    });
  }

  const prompt = phase === "active"
    ? computeNextPrompt({ taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone, effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, ivFailSnoozeUntil, infusionReassess, sessionRecoveredAt, forcedFollowUpId, jointArrest, undoPromptHold })
    : null;

  const suggestedAutonomyTask = phase === "active"
    ? getSuggestedAutonomyTask(prompt, taskStates, level, forcedTasks, txaTime)
    : null;
  const suggestedTaskId = suggestedAutonomyTask && isAutonomyEligible(suggestedAutonomyTask, forcedTasks)
    ? suggestedAutonomyTask.id
    : null;

  const jointArrestActive = jointArrest.active && !jointArrest.rosc;
  const isArrestInterrupt = !jointArrestActive && (prompt?.type === "arrest_rhythm" || prompt?.type === "arrest_shock");
  const showPromptRail = phase === "active" && shouldShowPromptRail(leadMode, prompt) && !isArrestInterrupt && !jointArrestActive;
  const isAutonomousLead = leadMode === LEAD_MODES.AUTONOMOUS;
  const jointNextUp = jointArrestActive
    ? computeJointNextUpQueue({
        jointArrest,
        now,
        log,
        level,
        toneAssessed,
        txaTime,
        txaHandled,
        txaSecondDone,
        effectiveBirthTime,
        carboCount,
        carboLastTime,
        ciCleared,
        forcedTasks,
        uterotonicHold,
        uterotonicEscalate,
        queuedUterotonicId,
        ivAccessPendingSince,
        ivAccessRetries,
        ivFailSnoozeUntil,
        infusionReassess,
        sessionRecoveredAt,
        forcedFollowUpId,
        undoPromptHold,
        taskStates,
      })
    : [];

  const activeCaSession = phase === "active" && !jointArrest.active && !jointArrest.rosc
    ? readActiveCaSnapshot()
    : null;
  // Legacy app-switch only — Option F embedded arrest never shows ← Arrest / Arrest SOS →
  const arrestNav = activeCaSession
    ? { active: true, cycle: activeCaSession.cycleNumber ?? null }
    : null;

  function handleOpenCardiacArrest() {
    flushSession();
    onLaunchCardiacArrest?.({
      postpartum: true,
      fromPph: true,
      resumeCa: !!readActiveCaSnapshot(),
    });
  }

  const relevantTasks = TASKS.filter(t => levelVal(t.level) <= levelVal(level));
  const assignedCount = relevantTasks.filter(t => taskStates[t.id]?.status === "assigned").length;

  // ── Handlers ──

  function clearIvAccessPending() {
    setIvAccessPendingSince(null);
    setIvAccessRetries(0);
  }

  function onIvAccessEstablished(states) {
    if (shouldOfferInfusionReassess(states)) setInfusionReassess(true);
    clearIvAccessPending();
  }

  function clearForcedFollowUp(taskId) {
    setForcedFollowUpId(prev => (prev === taskId ? null : prev));
  }

  function handleSetup(ml, bt, mode = LEAD_MODES.GUIDED) {
    // Fresh emergency — reset the clock to now (a discarded prior session must
    // not carry its elapsed time over into the new one).
    setEmergencyStartTime(nowTs());
    setBloodLoss(ml);
    setPeakBloodLoss(ml);
    if (bt) setBirthTime(bt);
    setLeadMode(mode === LEAD_MODES.AUTONOMOUS ? LEAD_MODES.AUTONOMOUS : LEAD_MODES.GUIDED);
    const initialLevel = getLevel(ml);
    prevLevelRef.current = initialLevel;
    const t = nowTs();
    const modeLabel = mode === LEAD_MODES.AUTONOMOUS ? "Autonomous" : "Guided";
    const logEntries = [
      { kind: "blood_loss", label: `Initial blood loss: ${ml} ml`, total: ml, time: t },
      { kind: "mode", label: `Session mode: ${modeLabel}`, time: t },
    ];
    if (levelVal(initialLevel) >= levelVal("major")) {
      logEntries.push({
        kind: "escalated",
        label: `Started at ${({ minor: "Minor", major: "Major", massive: "Massive" })[initialLevel]} PPH (${ml} ml)`,
        time: t,
      });
      setEscalationAlert({ level: initialLevel, note: null });
    }
    setLog(logEntries);
    setSessionRecoveredAt(null);
    setUndoPromptHold(new Set());
    setPhase("active");
  }

  function handleAddBlood(delta) {
    const next = bloodLoss + delta;
    recordBloodLossDelta(delta, `+${delta} ml → ${next} ml`);
  }

  function handleDone(task, opts = {}) {
    const t = nowTs();
    const scheduleFollowUp = task.followUpDelay && task.followUpQuestion;
    setTaskStates(prev => ({
      ...prev,
      [task.id]: {
        ...(scheduleFollowUp
          ? { status: "done", doneAt: t, followUpAt: t }
          : { status: "done", doneAt: t }),
        ...(opts.outOfSequence ? { outOfSequence: true } : {}),
      },
    }));
    addLog("task_done", `Done: ${task.title}`);
    if (task.id === "call_major" || task.id === "call_massive") absorbLowerCallSteps(setTaskStates, task.id, t);
    if (task.special === "txa") { setTxaTime(t); setTxaHandled(true); }
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    if (task.id === "iv_access") onIvAccessEstablished({ ...taskStates, iv_access: { status: "done", doneAt: t } });
    if (task.id === "abc" || task.id === "iv_access") syncArrestResusFromPphTask(task.id);
    if (task.uterotonic) {
      setUterotonicEscalate(null);
      setQueuedUterotonicId(null);
      if (taskStates.iv_access?.status !== "done") {
        setIvFailSnoozeUntil(Date.now() + 5 * 60 * 1000);
      }
    }
  }

  function handleAlreadyGiven(task, opts = {}) {
    const t = nowTs();
    setTaskStates(prev => ({
      ...prev,
      [task.id]: {
        status: "already_given",
        doneAt: t,
        alreadyGivenAt: t,
        ...(opts.outOfSequence ? { outOfSequence: true } : {}),
      },
    }));
    addLog("task_already_given", `Already given: ${task.title}`);
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    setUterotonicEscalate(null);
    setQueuedUterotonicId(null);
  }

  function handleAssign(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: nowTs() } }));
    addLog("task_assigned", `Assigned: ${task.title}`);
    if (task.id === "iv_access") {
      setIvAccessPendingSince(nowTs());
      setIvAccessRetries(0);
    }
  }

  function handleSkip(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: nowTs() } }));
    addLog("task_skipped", `Skipped: ${task.title}`);
    if (task.fallback) {
      const fb = TASKS.find(t => t.id === task.fallback);
      setForcedTasks(prev => prev.includes(task.fallback) ? prev : [...prev, task.fallback]);
      addLog("task_fallback", `${task.title} skipped — ${fb?.title ?? task.fallback} activated`);
      if (task.uterotonic) {
        setUterotonicEscalate(null);
        setQueuedUterotonicId(null);
      }
    }
  }

  function handleUndoTask(task) {
    const prev = taskStates[task.id];
    if (!canUndoChecklistTask(task, prev, jointArrest)) return;

    const restoreBimanual = task.id === "fundal_massage"
      && taskStates.bimanual?.status === "skipped"
      && taskStates.bimanual?.skipReason === "not_required";

    setTaskStates(ts => {
      const next = { ...ts };
      delete next[task.id];
      if (task.id === "call_major" || task.id === "call_massive") {
        const clearIfAbsorbed = (id) => {
          if (next[id]?.coveredByHigherCall) delete next[id];
        };
        if (task.id === "call_massive") { clearIfAbsorbed("call_team"); clearIfAbsorbed("call_major"); }
        else clearIfAbsorbed("call_team");
      }
      if (restoreBimanual) delete next.bimanual;
      return next;
    });

    if (task.special === "txa") {
      setTxaTime(null);
      setTxaHandled(false);
    }
    if (task.special === "carbo") {
      setCarboCount(0);
      setCarboLastTime(null);
    }
    if (task.id === "iv_access") {
      setIvAccessPendingSince(null);
      setIvAccessRetries(0);
      setInfusionReassess(false);
    }
    if (task.uterotonic) {
      setUterotonicEscalate(null);
      setQueuedUterotonicId(null);
    }
    if (prev.status === "skipped" || prev.status === "not_indicated") {
      if (task.fallback) {
        setForcedTasks(ft => ft.filter(id => id !== task.fallback));
      }
    }
    if (task.assess?.treatment && prev.assessOutcome === "present") {
      setForcedTasks(ft => ft.filter(id => id !== task.assess.treatment));
    }
    if (task.contraindications?.length) {
      setCiCleared(ci => {
        const next = { ...ci };
        delete next[task.id];
        return next;
      });
    }
    if (restoreBimanual) setToneAssessed(false);
    if (task.id === "cardiac_arrest_ref") setJointArrestSetupOpen(false);

    setUndoPromptHold(prev => new Set([...prev, task.id]));
    setChecklistDetailTask(null);
    setChecklistAutonomyFlow(null);

    addLog("task_undo", `Undone: ${task.title} (${prev.status.replace("_", " ")})`);
  }

  function releaseUndoPromptHold(taskId) {
    setUndoPromptHold(prev => {
      if (!prev.has(taskId)) return prev;
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
  }

  function handleNotAvailable(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: nowTs() } }));
    addLog("task_skipped", task.naOption?.log || `Not available: ${task.title}`);
  }

  function handleOpenChecklistDetail(task) {
    releaseUndoPromptHold(task.id);
    setChecklistDetailTask(task);
  }

  function checklistDetailStatus(task) {
    const rawStatus = taskStates[task.id]?.status ?? null;
    if (task.id === "txa" && rawStatus === "skipped" && txaEligible(taskStates, level, txaTime)) return null;
    return rawStatus;
  }

  function handleLeadModeChange(mode) {
    if (mode === leadMode) return;
    setLeadMode(mode);
    addLog("mode", `Switched to ${mode === LEAD_MODES.AUTONOMOUS ? "Autonomous" : "Guided"} mode`);
    setChecklistAutonomyFlow(null);
  }

  function handleChecklistAutonomy(task) {
    releaseUndoPromptHold(task.id);
    if (leadMode === LEAD_MODES.AUTONOMOUS) {
      if (task.type === "drug" || task.assess) {
        setChecklistAutonomyFlow({ task, step: "actions", outOfSequence: false });
        return;
      }
      handleDone(task);
      setChecklistDetailTask(null);
      return;
    }
    const suggested = getSuggestedAutonomyTask(prompt, taskStates, level, forcedTasks, txaTime);
    if (taskNeedsAutonomyWarning(task, suggested)) {
      setChecklistAutonomyFlow({
        task,
        step: "warn",
        suggestedTitle: suggested?.title ?? "Next on ladder",
      });
    } else {
      setChecklistAutonomyFlow({ task, step: "actions", outOfSequence: false });
    }
  }

  function handleOutOfSequenceProceed() {
    const { task, suggestedTitle } = checklistAutonomyFlow;
    addLog("out_of_sequence", `Out of sequence: ${task.title} (GTG52 suggested: ${suggestedTitle})`);
    setChecklistAutonomyFlow({ task, step: "actions", outOfSequence: true, suggestedTitle });
  }

  function finishChecklistAutonomyFlow(task, outOfSequence, fn) {
    fn(task, outOfSequence ? { outOfSequence: true } : {});
    setChecklistAutonomyFlow(null);
  }

  function handleChecklistAutonomyDone(task) {
    finishChecklistAutonomyFlow(task, checklistAutonomyFlow?.outOfSequence, handleDone);
  }

  function handleChecklistAutonomyDoneWithIv(task) {
    const t = nowTs();
    const oos = checklistAutonomyFlow?.outOfSequence ? { outOfSequence: true } : {};
    const scheduleFollowUp = task.followUpDelay && task.followUpQuestion;
    const ivWasPending = taskStates.iv_access?.status !== "done";

    setTaskStates(prev => {
      const next = { ...prev };
      if (ivWasPending) next.iv_access = { status: "done", doneAt: t };
      next[task.id] = {
        ...(scheduleFollowUp
          ? { status: "done", doneAt: t, followUpAt: t }
          : { status: "done", doneAt: t }),
        ...oos,
      };
      return next;
    });

    if (ivWasPending) addLog("task_done", "Done: IV access + bloods");
    addLog("task_done", `Done: ${task.title}`);

    if (task.special === "txa") { setTxaTime(t); setTxaHandled(true); }
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    if (ivWasPending) {
      onIvAccessEstablished({ ...taskStates, iv_access: { status: "done", doneAt: t } });
    }
    if (task.uterotonic) {
      setUterotonicEscalate(null);
      setQueuedUterotonicId(null);
    }

    setChecklistAutonomyFlow(null);
  }

  function handleChecklistAutonomyAlreadyGiven(task) {
    finishChecklistAutonomyFlow(task, checklistAutonomyFlow?.outOfSequence, handleAlreadyGiven);
  }

  function handleChecklistAutonomyAssign(task) {
    finishChecklistAutonomyFlow(task, false, handleAssign);
  }

  function handleChecklistAutonomySkip(task) {
    finishChecklistAutonomyFlow(task, false, handleSkip);
  }

  function handleChecklistAutonomyNotAvailable(task) {
    finishChecklistAutonomyFlow(task, false, handleNotAvailable);
  }

  function handleChecklistAutonomyAssessExclude(task) {
    finishChecklistAutonomyFlow(task, checklistAutonomyFlow?.outOfSequence, handleAssessExclude);
  }

  function handleChecklistAutonomyAssessPresent(task) {
    finishChecklistAutonomyFlow(task, checklistAutonomyFlow?.outOfSequence, handleAssessPresent);
  }

  function handleFollowupYes(task) {
    const t = nowTs();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: t } }));
    addLog("followup_done", task.followUpYesLog || `Confirmed done: ${task.title}`);
    clearForcedFollowUp(task.id);
    if (task.id === "call_major" || task.id === "call_massive") absorbLowerCallSteps(setTaskStates, task.id, t);
    if (task.special === "txa") { setTxaTime(t); setTxaHandled(true); }
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    if (task.id === "iv_access") onIvAccessEstablished({ ...taskStates, iv_access: { status: "done", doneAt: t } });
  }

  function handleFollowupNo(task, escalate = false) {
    clearForcedFollowUp(task.id);
    if (task.followUpEscalate && escalate) {
      setForcedTasks(prev => ensureMajorProtocol(
        prev.includes(task.followUpEscalate) ? prev : [...prev, task.followUpEscalate],
        taskStates,
      ));
      setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: nowTs(), escalatedAt: nowTs() } }));
      addLog("followup_escalate", task.followUpEscalateLog || `Escalating: ${task.title}`);
    } else if (task.followUpQuestion) {
      setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], followUpAt: nowTs() } }));
      addLog("followup_pending", task.followUpEscalate ? "Still in progress — check back in 5 min" : `Still in progress: ${task.title}`);
    } else {
      setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], assignedAt: nowTs() } }));
      addLog("followup_pending", `Still in progress: ${task.title}`);
    }
  }

  function handleAssessExclude(task, opts = {}) {
    setTaskStates(prev => ({
      ...prev,
      [task.id]: {
        status: "done",
        doneAt: nowTs(),
        assessOutcome: "excluded",
        ...(opts.outOfSequence ? { outOfSequence: true } : {}),
      },
    }));
    addLog("assess", task.assess.excludeLog || `${task.title} — excluded`);
  }

  function handleAssessPresent(task, opts = {}) {
    setTaskStates(prev => ({
      ...prev,
      [task.id]: {
        status: "done",
        doneAt: nowTs(),
        assessOutcome: "present",
        ...(opts.outOfSequence ? { outOfSequence: true } : {}),
      },
    }));
    addLog("assess", task.assess.presentLog || `${task.title} — present`);
    if (task.assess.treatment) {
      setForcedTasks(prev => prev.includes(task.assess.treatment) ? prev : [...prev, task.assess.treatment]);
    }
  }

  function handleBloodAdd(delta) {
    recordBloodLossDelta(delta, `Blood loss check: +${delta} ml → ${bloodLoss + delta} ml`);
  }

  function handleBloodUnchanged() {
    const at = nowTs();
    const newLog = [...log, { kind: "blood_loss_unchanged", label: `Blood loss check: unchanged (${bloodLoss} ml)`, time: at }];
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, level, at, bloodLoss);
  }

  function handleBloodPending() {
    const at = nowTs();
    const newLog = [...log, { kind: "blood_loss_pending", label: `Blood loss check: pending — no update (${bloodLoss} ml)`, time: at }];
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, level, at, bloodLoss);
  }

  function handleBloodCorrect(newTotal) {
    const prev = bloodLoss;
    const next = Math.max(0, Math.round(newTotal));
    if (next === prev) return;
    const at = nowTs();
    const newLevel = getLevel(next);
    const newLog = [...log, {
      kind: "blood_loss_correction",
      label: `Blood loss corrected: ${prev} → ${next} ml`,
      total: next,
      time: at,
    }];
    setBloodLoss(next);
    setPeakBloodLoss(p => Math.max(p, next));
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, newLevel, at, next);
  }

  function handleUterotonicEscalateYes(task) {
    if (task) setQueuedUterotonicId(task.id);
    setUterotonicEscalate(null);
    setUterotonicHold(false);
  }

  function handleUterotonicEscalateHold() {
    setUterotonicHold(true);
    setUterotonicEscalate(null);
    addLog("uterotonic_hold", "Uterotonic escalation held — bleeding settling");
  }

  function handleUterotonicEscalateNotYet() {
    setUterotonicEscalate(null);
  }

  function handleIvFailRetry() {
    const t = nowTs();
    setIvAccessPendingSince(t);
    setIvFailSnoozeUntil(null);
    if (ivAccessRetries < IV_ACCESS_MAX_RETRIES) {
      setIvAccessRetries(prev => prev + 1);
      addLog("iv_fail", `IV access — keep trying (${ivAccessRetries + 1}/${IV_ACCESS_MAX_RETRIES} retries used)`);
    } else {
      addLog("iv_fail", "IV access — keep trying (timer reset)");
    }
    setTaskStates(prev => ({
      ...prev,
      iv_access: { ...prev.iv_access, status: "assigned", assignedAt: t },
    }));
  }

  function handleIvFailImDrug(task) {
    if (!task?.id) return;
    setQueuedUterotonicId(task.id);
    addLog("iv_fail", `IV not in — proceeding to ${task.title}`);
  }

  function handleIvFailDismiss() {
    setIvFailSnoozeUntil(Date.now() + 3 * 60 * 1000);
    addLog("iv_fail", "IV access — IM route deferred; use checklist");
  }

  function handleInfusionYes() {
    setQueuedUterotonicId("oxytocin_inf");
    setInfusionReassess(false);
  }

  function handleInfusionAssign() {
    setTaskStates(prev => ({ ...prev, oxytocin_inf: { status: "assigned", assignedAt: nowTs() } }));
    addLog("task_assigned", "Assigned: Oxytocin infusion");
    setInfusionReassess(false);
  }

  function handleInfusionNotNeeded() {
    setTaskStates(prev => ({ ...prev, oxytocin_inf: { status: "not_indicated", doneAt: nowTs() } }));
    addLog("task_skipped", "Oxytocin infusion — not indicated after reassessment");
    setInfusionReassess(false);
  }

  function handleCheckCardiacArrest() {
    if (taskStates.cardiac_arrest_ref?.status) return;
    setForcedTasks(prev => prev.includes("cardiac_arrest_ref") ? prev : [...prev, "cardiac_arrest_ref"]);
    addLog("consider", "ABC — instability → cardiac arrest check");
  }

  function handleConsiderPrepare(task) {
    const t = nowTs();
    if (task.id === "theatre") {
      setTaskStates(prev => ({
        ...prev,
        [task.id]: {
          status: "assigned",
          assignedAt: t,
          preparing: true,
          transferSnoozeUntil: t + 2 * 60 * 1000,
        },
      }));
      addLog("consider", `Theatre team preparing — ${task.title}`);
    } else {
      setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: t } }));
      addLog("consider", `Consider ${task.title} — team preparing`);
    }
  }

  function handleTheatreInTheatre(task) {
    const t = nowTs();
    setTaskStates(prev => ({
      ...prev,
      [task.id]: { status: "done", doneAt: t, inTheatre: true },
    }));
    addLog("theatre_transfer", task.followUpYesLog || "Patient transferred to theatre — procedure underway");
    setForcedFollowUpId(null);
  }

  function handleTheatreStillPreparing(task) {
    const t = nowTs();
    setTaskStates(prev => ({
      ...prev,
      [task.id]: {
        ...prev[task.id],
        status: "assigned",
        transferSnoozeUntil: t + 3 * 60 * 1000,
      },
    }));
    addLog("theatre_transfer", "Theatre team preparing — patient not yet transferred");
    setForcedFollowUpId(null);
  }

  function handleConsiderNotIndicated(task) {
    const t = nowTs();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "not_indicated", doneAt: t } }));
    addLog("consider", `${task.title} — not indicated`);
  }

  function handleConsiderNotNow(task) {
    const t = nowTs();
    const snoozeMs = considerSnoozeMs(getLevel(bloodLoss));
    const mins = Math.round(snoozeMs / 60000);
    setTaskStates(prev => ({
      ...prev,
      [task.id]: { ...prev[task.id], considerSnoozeUntil: t + snoozeMs },
    }));
    addLog("consider", `${task.title} — deferred ${mins} min`);
  }

  function handleConsiderArrestYes(task) {
    const t = nowTs();
    const nextTaskStates = { ...taskStates, [task.id]: { status: "done", doneAt: t, arrestConfirmed: true } };
    const nextLog = [...log, { kind: "consider", label: "Maternal cardiac arrest — 2222 called", time: t }];
    setTaskStates(nextTaskStates);
    setLog(nextLog);
    flushSession({ taskStates: nextTaskStates, log: nextLog });
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
    setJointArrestSetupOpen(true);
  }

  function handleJointArrestStart({ collapseMinsAgo, cprSameAsCollapse, cprMinsAgo }) {
    const t = nowTs();
    const collapseTime = minsAgoToTimestamp(collapseMinsAgo, t);
    const cprStartTime = cprSameAsCollapse ? collapseTime : minsAgoToTimestamp(cprMinsAgo, t);
    const prefilled = arrestResusPrefilledFromPph(taskStates);
    const nextArrest = {
      ...createJointArrestState({ collapseTime, cprStartTime, now: t }),
      resusActionsDone: prefilled,
    };
    caClear();
    setJointArrest(nextArrest);
    setJointArrestSetupOpen(false);
    addLog("arrest", "Embedded arrest resus started — CPR cycles active alongside PPH");
    for (const id of prefilled) {
      if (id === "call_2222") continue;
      const action = JOINT_IMMEDIATE_ACTIONS.find(a => a.id === id);
      if (action) addLog("arrest", `Resus: ${action.title} (already done in PPH)`);
    }
    flushSession({ jointArrest: nextArrest });
  }

  function syncPphTasksFromArrestResus(actionId) {
    const pphIds = pphTasksForArrestResusAction(actionId);
    if (!pphIds.length) return;
    const t = nowTs();
    const toSync = pphIds.filter(id => {
      const st = taskStates[id]?.status;
      return st !== "done" && st !== "skipped" && st !== "already_given";
    });
    if (!toSync.length) return;
    setTaskStates(prev => {
      const next = { ...prev };
      for (const id of toSync) {
        next[id] = { status: "done", doneAt: t, viaArrestResus: actionId };
      }
      if (toSync.includes("iv_access")) onIvAccessEstablished(next);
      return next;
    });
    for (const id of toSync) {
      const pphTask = TASKS.find(x => x.id === id);
      addLog("task_done", `Done: ${pphTask?.title ?? id} (via arrest resus)`);
    }
  }

  function syncArrestResusFromPphTask(taskId) {
    if (!jointArrest.active || jointArrest.rosc) return;
    const resusId = arrestResusActionForPphTask(taskId);
    if (!resusId || (jointArrest.resusActionsDone ?? []).includes(resusId)) return;
    setJointArrest(prev => {
      const next = {
        ...prev,
        resusActionsDone: [...(prev.resusActionsDone ?? []), resusId],
      };
      flushSession({ jointArrest: next });
      return next;
    });
    const action = JOINT_IMMEDIATE_ACTIONS.find(a => a.id === resusId);
    if (action) addLog("arrest", `Resus: ${action.title} (via PPH)`);
  }

  function handleJointArrestRhythmManual() {
    setJointArrest(prev => ({ ...prev, rhythmPromptOpen: true }));
  }

  function handleArrestRhythmShockable() {
    setJointArrest(prev => ({ ...prev, rhythmPromptOpen: false, pendingShock: true }));
    addLog("arrest", `Rhythm check cycle ${jointArrest.cycleNumber} — shockable`);
  }

  function handleArrestRhythmNonShockable() {
    const t = nowTs();
    setJointArrest(prev => {
      const next = advanceCprCycle(prev, t);
      return { ...next, adrenalineArmed: true };
    });
    addLog("arrest", `Rhythm check cycle ${jointArrest.cycleNumber} — non-shockable · CPR continues`);
  }

  function handleArrestShockDelivered() {
    const t = nowTs();
    setJointArrest(prev => {
      const newCount = prev.shockCount + 1;
      const next = advanceCprCycle(prev, t);
      return {
        ...next,
        shockCount: newCount,
        adrenalineArmed: newCount >= 3 || prev.adrenalineArmed,
      };
    });
    addLog("arrest", `Shock ${jointArrest.shockCount + 1} delivered — resume CPR`);
  }

  function handleJointArrestRosc() {
    const t = nowTs();
    setJointArrest(prev => {
      const next = {
        ...prev,
        rosc: true,
        roscTime: t,
        rhythmPromptOpen: false,
        pendingShock: false,
        postResusCollapsed: true,
      };
      flushSession({ jointArrest: next });
      return next;
    });
    addLog("arrest", "ROSC — embedded arrest cycles stopped; continue PPH haemorrhage management");
  }

  function handleJointArrestAdrenaline() {
    const t = nowTs();
    setJointArrest(prev => {
      const nextCount = prev.adrenalineCount + 1;
      const next = {
        ...prev,
        adrenalineCount: nextCount,
        lastAdrenalineAt: t,
        adrenalineArmed: false,
      };
      flushSession({ jointArrest: next });
      return next;
    });
    addLog("arrest", `Adrenaline 1 mg IV — dose ${jointArrest.adrenalineCount + 1}`);
  }

  function handleJointArrestAmio300() {
    setJointArrest(prev => {
      const next = { ...prev, amio300Given: true };
      flushSession({ jointArrest: next });
      return next;
    });
    addLog("arrest", "Amiodarone 300 mg IV given");
  }

  function handleJointArrestAmio150() {
    setJointArrest(prev => {
      const next = { ...prev, amio150Given: true };
      flushSession({ jointArrest: next });
      return next;
    });
    addLog("arrest", "Amiodarone 150 mg IV given");
  }

  function handleJointArrestResusToggle(actionId) {
    const wasDone = (jointArrest.resusActionsDone ?? []).includes(actionId);
    const adding = !wasDone;
    setJointArrest(prev => {
      const done = prev.resusActionsDone ?? [];
      const nextDone = adding ? [...done, actionId] : done.filter(x => x !== actionId);
      const next = { ...prev, resusActionsDone: nextDone };
      flushSession({ jointArrest: next });
      return next;
    });
    const action = JOINT_IMMEDIATE_ACTIONS.find(a => a.id === actionId);
    if (action && adding) {
      addLog("arrest", `Resus: ${action.title}`);
      syncPphTasksFromArrestResus(actionId);
    }
  }

  function handleJointArrestResusDone(actionId) {
    if ((jointArrest.resusActionsDone ?? []).includes(actionId)) return;
    handleJointArrestResusToggle(actionId);
  }

  function handleConsiderArrestNo(task) {
    const t = nowTs();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: t, considerNoArrest: true } }));
    addLog("consider", "No cardiac arrest — continue PPH resus");
  }

  function handleCarboDose() {
    const next = carboCount + 1;
    setCarboCount(next);
    setCarboLastTime(nowTs());
    addLog("carbo_dose", `Carboprost dose ${next}/8`);
  }

  function handleCarboSkip() {
    const next = Math.min(carboCount + 1, 8);
    setCarboCount(next);
    setCarboLastTime(nowTs());
    addLog("carbo_skip", `Carboprost dose ${next}/8 skipped`);
  }

  function handleTxaSecondGiven() {
    setTxaSecondDone(true);
    addLog("txa_second", "TXA second dose 1 g IV given");
  }

  function handleTxaSecondNotNeeded() {
    setTxaSecondDone(true);
    addLog("txa_second", "TXA second dose — not needed / bleeding resolved");
  }

  function handleCiClear(task) {
    setCiCleared(prev => ({ ...prev, [task.id]: true }));
    addLog("ci_check", `${task.title} — contraindications checked, none present`);
  }

  function handleCiContraindicated(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: nowTs() } }));
    const fb = TASKS.find(t => t.id === task.fallback);
    addLog("ci_check", `${task.title} contraindicated${fb ? ` — switching to ${fb.title}` : ""}`);
    if (task.special === "txa") setTxaHandled(true);
    if (task.fallback) {
      setForcedTasks(prev => prev.includes(task.fallback) ? prev : [...prev, task.fallback]);
      if (task.uterotonic) {
        setUterotonicEscalate(null);
        setQueuedUterotonicId(null);
      }
    }
  }

  function handleToneCheckFirm() {
    setToneAssessed(true);
    setTaskStates(prev => ({ ...prev, bimanual: { status: "skipped", skippedAt: nowTs(), skipReason: "not_required" } }));
    addLog("tone_check", "Tone: uterus firm after fundal massage — bimanual not required");
  }

  function handleToneCheckBoggy() {
    setToneAssessed(true);
    addLog("tone_check", "Tone: uterus still boggy — proceeding to bimanual compression");
  }

  function handleConfirmTask(taskId) {
    const task = TASKS.find(t => t.id === taskId);
    if (taskStates[taskId]?.status === "assigned") {
      setForcedFollowUpId(taskId);
      return;
    }
    setTaskStates(prev => ({ ...prev, [taskId]: { status: "done", doneAt: nowTs() } }));
    addLog("task_done", `Confirmed done: ${task?.title ?? taskId}`);
    if (task?.special === "txa") { setTxaTime(nowTs()); setTxaHandled(true); }
    if (task?.special === "carbo") { setCarboCount(prev => prev === 0 ? 1 : prev); setCarboLastTime(nowTs()); }
    if (task?.uterotonic) { setQueuedUterotonicId(null); setUterotonicEscalate(null); }
  }

  function handleAssignedTap(taskId) {
    handleConfirmTask(taskId);
  }

  function handleAssignedDone(taskId) {
    const task = TASKS.find(t => t.id === taskId);
    if (!task || taskStates[taskId]?.status !== "assigned") return;
    clearForcedFollowUp(taskId);
    if (task.id === "theatre") {
      handleTheatreInTheatre(task);
      return;
    }
    handleFollowupYes(task);
  }

  function handleRecover() {
    const s = savedSession;
    if (!s) return;
    setEmergencyStartTime(s.emergencyStartTime ?? nowTs());
    setBloodLoss(s.bloodLoss ?? 0);
    setPeakBloodLoss(s.peakBloodLoss ?? s.bloodLoss ?? 0);
    setAftercareCompleted(s.aftercareCompleted ?? false);
    setTaskStates(s.taskStates ?? {});
    setLog(s.log ?? []);
    setTxaTime(s.txaTime ?? null);
    setTxaHandled(s.txaHandled ?? false);
    setTxaSecondDone(s.txaSecondDone ?? false);
    setToneAssessed(s.toneAssessed ?? false);
    setBirthTime(s.birthTime ?? null);
    setCarboCount(s.carboCount ?? 0);
    setCarboLastTime(s.carboLastTime ?? null);
    // Repair legacy dead-zone state: count set without confirm timestamp
    if ((s.carboCount ?? 0) > 0 && !s.carboLastTime && !["done", "already_given"].includes(s.taskStates?.carboprost?.status)) {
      setCarboCount(0);
    }
    setCiCleared(s.ciCleared ?? {});
    setForcedTasks(s.forcedTasks ?? []);
    setUterotonicHold(s.uterotonicHold ?? false);
    setUterotonicEscalate(s.uterotonicEscalate ?? null);
    setQueuedUterotonicId(s.queuedUterotonicId ?? null);
    setIvAccessPendingSince(s.ivAccessPendingSince ?? null);
    setIvAccessRetries(s.ivAccessRetries ?? 0);
    setIvFailSnoozeUntil(s.ivFailSnoozeUntil ?? null);
    setInfusionReassess(s.infusionReassess ?? false);
    setLeadMode(s.leadMode === LEAD_MODES.AUTONOMOUS ? LEAD_MODES.AUTONOMOUS : LEAD_MODES.GUIDED);
    setJointArrest(normalizeJointArrestState(s.jointArrest));
    prevLevelRef.current = getLevel(s.bloodLoss ?? 0);
    const t = nowTs();
    setSessionRecoveredAt(t);
    setRecoveryDismissed(true);
    setLog(prev => [...prev, { kind: "session_resumed", label: "Session resumed — blood check timer reset", time: t }]);
    setPhase("active");
  }

  function handleExit() {
    setExitConfirm(false);
    clearSession();
    onClose();
  }

  function handleStandDown() {
    const t = nowTs();
    const unresolvedEntries = TASKS
      .filter(task => taskStates[task.id]?.status === "assigned")
      .map(task => ({ kind: "unresolved", label: `Unresolved at stand-down: ${task.title}`, time: t }));
    const arrestSummary = jointArrestSummaryText(jointArrest);
    const arrestLogEntries = arrestSummary
      ? [
          { kind: "arrest_summary", label: arrestSummary.outcome, time: t },
          { kind: "arrest_summary", label: arrestSummary.stats, time: t },
        ]
      : [];
    if (jointArrestHadActivity(jointArrest)) {
      setArrestRecord({ ...jointArrest, postResusDone: jointArrest.postResusDone ?? [], stoodDownAt: t });
    }
    setResolveTime(t);
    setLog(prev => [
      ...prev,
      ...arrestLogEntries,
      { kind: "stand_down", label: `Emergency stood down — ${bloodLoss} ml total`, time: t },
      ...unresolvedEntries,
    ]);
    setStandDownConfirm(false);
    clearSession();
    caClear();
    setPhase("aftercare");
  }

  function handleAftercareComplete({ pphDone, postResusDone }) {
    const t = nowTs();
    const existingPostResus = new Set(arrestRecord?.postResusDone ?? []);
    setAftercareCompleted(true);
    setLog(prev => [
      ...prev,
      ...postResusDone
        .filter(a => !existingPostResus.has(a.id))
        .map(a => ({ kind: "post_resus", label: `Post-arrest aftercare: ${a.text}`, time: t })),
      ...pphDone.map(a => ({ kind: "aftercare", label: `Aftercare done: ${a.text}`, time: t })),
    ]);
    if (arrestRecord && postResusDone.length) {
      setArrestRecord(prev => prev ? {
        ...prev,
        postResusDone: [...new Set([...(prev.postResusDone ?? []), ...postResusDone.map(a => a.id)])],
      } : prev);
    }
    setPhase("summary");
  }

  // ── Render ──

  if (phase === "setup") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {exitConfirm && <ExitConfirm active={false} onConfirm={handleExit} onCancel={() => setExitConfirm(false)} />}
      {savedSession && !recoveryDismissed && (
        <div className="bg-amber-950/90 border-b border-amber-800/60 px-4 py-4 w-full min-w-0 box-border">
          <p className="text-amber-300 text-sm font-bold mb-1">Unfinished session found</p>
          <p className="text-amber-500 text-xs mb-3 break-words">
            {({ minor: "Minor", major: "Major", massive: "Massive" })[getLevel(savedSession.bloodLoss ?? 0)]} PPH · {savedSession.bloodLoss ?? 0} ml · {savedSession.log?.length ?? 0} events logged
          </p>
          <div className="flex gap-2 w-full min-w-0">
            <button onClick={handleRecover} className="flex-1 min-w-0 bg-amber-500 text-gray-950 font-bold py-2.5 text-sm rounded-lg">Resume session</button>
            <button onClick={() => { setRecoveryDismissed(true); clearSession(); }} className="flex-1 min-w-0 border border-amber-800 text-amber-400 text-sm py-2.5 rounded-lg">Discard</button>
          </div>
        </div>
      )}
      <SetupScreen onConfirm={handleSetup} onExit={() => setExitConfirm(true)} />
    </div>
  );
  if (phase === "aftercare") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <MergedAftercareScreen level={level} arrestRecord={arrestRecord} onComplete={handleAftercareComplete} />
    </div>
  );
  if (phase === "summary") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <SummaryScreen log={log} emergencyStartTime={emergencyStartTime} resolveTime={resolveTime} bloodLoss={bloodLoss} peakBloodLoss={peakBloodLoss} aftercareCompleted={aftercareCompleted} arrestRecord={arrestRecord} onBack={onClose} />
    </div>
  );

  const handlers = {
    onDone: handleDone, onAssign: handleAssign, onSkip: handleSkip, onNotAvailable: handleNotAvailable,
    onAlreadyGiven: handleAlreadyGiven,
    onFollowupYes: handleFollowupYes, onFollowupNo: handleFollowupNo,
    onAssessExclude: handleAssessExclude, onAssessPresent: handleAssessPresent,
    onBloodAdd: handleBloodAdd, onBloodUnchanged: handleBloodUnchanged, onBloodPending: handleBloodPending, onBloodCorrect: handleBloodCorrect,
    onCarboDose: handleCarboDose, onCarboSkip: handleCarboSkip,
    onTxaSecondGiven: handleTxaSecondGiven, onTxaSecondNotNeeded: handleTxaSecondNotNeeded,
    onToneCheckFirm: handleToneCheckFirm, onToneCheckBoggy: handleToneCheckBoggy,
    onCiClear: handleCiClear, onCiContraindicated: handleCiContraindicated,
    onUterotonicEscalateYes: handleUterotonicEscalateYes, onUterotonicEscalateHold: handleUterotonicEscalateHold,
    onUterotonicEscalateNotYet: handleUterotonicEscalateNotYet,
    onIvFailRetry: handleIvFailRetry, onIvFailImDrug: handleIvFailImDrug, onIvFailDismiss: handleIvFailDismiss,
    onInfusionYes: handleInfusionYes, onInfusionAssign: handleInfusionAssign, onInfusionNotNeeded: handleInfusionNotNeeded,
    onConsiderPrepare: handleConsiderPrepare, onConsiderNotIndicated: handleConsiderNotIndicated,
    onConsiderNotNow: handleConsiderNotNow, onConsiderArrestYes: handleConsiderArrestYes, onConsiderArrestNo: handleConsiderArrestNo,
    onCheckCardiacArrest: handleCheckCardiacArrest,
    onArrestRhythmShockable: handleArrestRhythmShockable,
    onArrestRhythmNonShockable: handleArrestRhythmNonShockable,
    onArrestShockDelivered: handleArrestShockDelivered,
    onArrestResusDone: handleJointArrestResusDone,
    onTheatreInTheatre: handleTheatreInTheatre, onTheatreStillPreparing: handleTheatreStillPreparing,
  };

  const jointNowPrompt = jointArrestActive
    ? buildJointNowPrompt(jointArrest, {
        taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone,
        effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now,
        uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince,
        ivAccessRetries, ivFailSnoozeUntil, infusionReassess, sessionRecoveredAt,
        forcedFollowUpId, jointArrest, undoPromptHold,
      }, handlers, now, jointNextUp)
    : null;
  const jointBloodCheckDue = jointArrestActive
    ? bloodCheckCountdown(log, now, level, sessionRecoveredAt)
    : null;
  const pphLevelLabel = { minor: "Minor PPH", major: "Major PPH", massive: "Massive PPH" }[level];
  const openPphCount = jointArrestActive
    ? countOpenPphTasks(taskStates, level, forcedTasks, txaTime)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 overflow-hidden w-full max-w-full emergency-shell" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {escalationAlert && <EscalationOverlay level={escalationAlert.level} note={escalationAlert.note} onDismiss={() => setEscalationAlert(null)} />}
      {standDownConfirm && <StandDownConfirm bloodLoss={bloodLoss} jointArrest={jointArrest} onConfirm={handleStandDown} onCancel={() => setStandDownConfirm(false)} />}
      {exitConfirm && <ExitConfirm active onConfirm={handleExit} onCancel={() => setExitConfirm(false)} />}
      {checklistDetailTask && (
        <ChecklistDetailSheet
          task={checklistDetailTask}
          state={taskStates[checklistDetailTask.id]}
          status={checklistDetailStatus(checklistDetailTask)}
          taskStates={taskStates}
          level={level}
          txaTime={txaTime}
          forcedTasks={forcedTasks}
          ivAccessDone={ivAccessDone}
          isAutonomousLead={isAutonomousLead}
          cardiacArrestPending={!taskStates.cardiac_arrest_ref?.status}
          onClose={() => setChecklistDetailTask(null)}
          onDone={handleDone}
          onAssign={handleAssign}
          onSkip={handleSkip}
          onNotAvailable={handleNotAvailable}
          onAlreadyGiven={handleAlreadyGiven}
          onConsiderPrepare={handleConsiderPrepare}
          onConsiderNotIndicated={handleConsiderNotIndicated}
          onConsiderNotNow={handleConsiderNotNow}
          onAutonomyAction={handleChecklistAutonomy}
          onCheckCardiacArrest={handleCheckCardiacArrest}
          onAssignedDone={handleAssignedDone}
          onAssessExclude={handleAssessExclude}
          onAssessPresent={handleAssessPresent}
          onConfirmTask={handleConfirmTask}
          onUndo={handleUndoTask}
          jointArrest={jointArrest}
        />
      )}
      {checklistAutonomyFlow?.step === "warn" && (
        <OutOfSequenceConfirm
          task={checklistAutonomyFlow.task}
          suggestedTitle={checklistAutonomyFlow.suggestedTitle}
          taskStates={taskStates}
          level={level}
          onProceed={handleOutOfSequenceProceed}
          onCancel={() => setChecklistAutonomyFlow(null)}
        />
      )}
      {checklistAutonomyFlow?.step === "actions" && (
        <ChecklistAutonomyActions
          task={checklistAutonomyFlow.task}
          ivAccessDone={ivAccessDone}
          ciCleared={ciCleared}
          isAutonomousLead={isAutonomousLead}
          showAlreadyGiven={shouldOfferAlreadyGiven(checklistAutonomyFlow.task, taskStates, carboCount)}
          onDone={handleChecklistAutonomyDone}
          onDoneWithIv={handleChecklistAutonomyDoneWithIv}
          onAlreadyGiven={handleChecklistAutonomyAlreadyGiven}
          onAssign={handleChecklistAutonomyAssign}
          onSkip={handleChecklistAutonomySkip}
          onNotAvailable={handleChecklistAutonomyNotAvailable}
          onAssessExclude={handleChecklistAutonomyAssessExclude}
          onAssessPresent={handleChecklistAutonomyAssessPresent}
          onCancel={() => setChecklistAutonomyFlow(null)}
        />
      )}

      {jointArrestSetupOpen && (
        <JointArrestSetupSheet
          onConfirm={handleJointArrestStart}
          onCancel={() => setJointArrestSetupOpen(false)}
        />
      )}

      {isArrestInterrupt && (
        <div className="fixed inset-0 z-[52] flex items-end bg-black/70">
          {prompt.type === "arrest_rhythm" ? (
            <JointArrestRhythmPrompt
              overlay
              cycleNumber={prompt.cycleNumber}
              onShockable={handleArrestRhythmShockable}
              onNonShockable={handleArrestRhythmNonShockable}
            />
          ) : (
            <JointArrestShockPrompt
              overlay
              shockNumber={prompt.shockNumber}
              onDelivered={handleArrestShockDelivered}
            />
          )}
        </div>
      )}

      {jointArrestActive ? (
        <>
          <JointInstrumentStrip
            pphElapsed={now - emergencyStartTime}
            bloodLoss={bloodLoss}
            bloodLossClass={bloodLossClass(bloodLoss)}
            levelLabel={pphLevelLabel}
            onAddBlood={handleAddBlood}
            onExit={() => setExitConfirm(true)}
            onStandDown={() => setStandDownConfirm(true)}
            arrest={jointArrest}
            now={now}
            onRhythmCheck={handleJointArrestRhythmManual}
            onRosc={handleJointArrestRosc}
            onAdrenaline={handleJointArrestAdrenaline}
            onAmio300={handleJointArrestAmio300}
            onAmio150={handleJointArrestAmio150}
            bloodCheckDue={jointBloodCheckDue}
          />
          <JointNowCard
            prompt={jointNowPrompt}
            onAdrenaline={handleJointArrestAdrenaline}
            onAmio300={handleJointArrestAmio300}
            onAmio150={handleJointArrestAmio150}
            arrest={jointArrest}
            nowContent={
              jointNowPrompt &&
              !["arrest_rhythm", "arrest_shock", "arrest_adrenaline", "arrest_amio", "arrest_resus"].includes(jointNowPrompt.type) ? (
                <ActivePromptArea
                  prompt={jointNowPrompt}
                  bloodLoss={bloodLoss}
                  level={level}
                  carboCount={carboCount}
                  assignedCount={assignedCount}
                  ivAccessDone={ivAccessDone}
                  cardiacArrestPending={!taskStates.cardiac_arrest_ref?.status}
                  taskStates={taskStates}
                  handlers={handlers}
                />
              ) : null
            }
          />
          <JointComingUpPanel items={jointNextUp} now={now} skipFirst={!!jointNowPrompt} />
          <SosDrugStrip
            variant="compact"
            tasks={TASKS}
            txaTime={txaTime}
            txaSecondDone={txaSecondDone}
            taskStates={taskStates}
            level={level}
            birthTime={effectiveBirthTime}
            carboCount={carboCount}
            carboLastTime={carboLastTime}
            log={log}
            sessionRecoveredAt={sessionRecoveredAt}
            now={now}
            forcedTasks={forcedTasks}
            uterotonicHold={uterotonicHold}
          />
        </>
      ) : (
        <>
      <Header
        elapsed={now - emergencyStartTime}
        bloodLoss={bloodLoss}
        level={level}
        assignedCount={assignedCount}
        leadMode={leadMode}
        showQuickAdd={prompt?.type !== "blood_loss_check"}
        arrestNav={arrestNav}
        arrestActive={jointArrestActive}
        onAddBlood={handleAddBlood}
        onCorrectBlood={handleBloodCorrect}
        onStandDown={() => setStandDownConfirm(true)}
        onExit={() => setExitConfirm(true)}
        onLeadModeChange={handleLeadModeChange}
        onOpenCardiacArrest={handleOpenCardiacArrest}
      />
        </>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
      {jointArrestActive && (
        <CollapsibleArrestChecklist
          arrest={jointArrest}
          actions={JOINT_IMMEDIATE_ACTIONS}
          onToggle={handleJointArrestResusToggle}
        />
      )}
      {jointArrest.rosc && phase === "active" && (
        <div className="flex-shrink-0 border-b border-emerald-900/40 bg-emerald-950/20 px-4 py-2.5">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">ROSC — cardiac arrest ended</p>
          <p className="text-gray-500 text-[11px] mt-0.5">Continue PPH resuscitation · post-arrest checklist at stand-down</p>
        </div>
      )}

      {!jointArrestActive && (
        <SosDrugStrip
          variant="full"
          tasks={TASKS}
          txaTime={txaTime}
          txaSecondDone={txaSecondDone}
          taskStates={taskStates}
          level={level}
          birthTime={effectiveBirthTime}
          carboCount={carboCount}
          carboLastTime={carboLastTime}
          log={log}
          sessionRecoveredAt={sessionRecoveredAt}
          now={now}
          forcedTasks={forcedTasks}
          uterotonicHold={uterotonicHold}
          onAssignedTap={handleAssignedTap}
          assignedStripLabels={ASSIGNED_STRIP_LABELS}
          callTaskVisible={callTaskVisibleInChecklist}
        />
      )}

      {isAutonomousLead && !showPromptRail && !jointArrestActive && <AutonomousModeBanner />}

      {showPromptRail && (
        <ActivePromptArea
          prompt={prompt}
          bloodLoss={bloodLoss}
          level={level}
          carboCount={carboCount}
          assignedCount={assignedCount}
          ivAccessDone={ivAccessDone}
          cardiacArrestPending={!taskStates.cardiac_arrest_ref?.status}
          taskStates={taskStates}
          handlers={handlers}
        />
      )}

      {jointArrestActive ? (
        <CollapsiblePphSection
          title="PPH haemorrhage"
          countLabel={openPphCount > 0 ? `${openPphCount} open` : null}
        >
          <TaskList
            taskStates={taskStates}
            level={level}
            now={now}
            onConfirmTask={handleConfirmTask}
            onAssignedDone={handleAssignedDone}
            onAutonomyAction={handleChecklistAutonomy}
            onOpenDetail={handleOpenChecklistDetail}
            forcedTasks={forcedTasks}
            txaTime={txaTime}
            emergencyStartTime={emergencyStartTime}
            suggestedTaskId={suggestedTaskId}
            leadMode={leadMode}
            jointArrestActive={jointArrestActive}
            jointDeckMode
            jointArrest={jointArrest}
            onArrestResusToggle={handleJointArrestResusToggle}
          />
        </CollapsiblePphSection>
      ) : (
      <TaskList
        taskStates={taskStates}
        level={level}
        now={now}
        onConfirmTask={handleConfirmTask}
        onAssignedDone={handleAssignedDone}
        onAutonomyAction={handleChecklistAutonomy}
        onOpenDetail={handleOpenChecklistDetail}
        forcedTasks={forcedTasks}
        txaTime={txaTime}
        emergencyStartTime={emergencyStartTime}
        suggestedTaskId={suggestedTaskId}
        leadMode={leadMode}
        jointArrestActive={jointArrestActive}
        jointArrest={jointArrest}
        onArrestResusToggle={handleJointArrestResusToggle}
      />
      )}
      </div>

      {SHOW_DEV_CLOCK && (
        <DevClock
          offsetMs={clockOffset}
          onAdvance={advanceClock}
          onReset={resetClock}
          pphElapsed={now - emergencyStartTime}
          jointArrest={jointArrest}
          now={now}
        />
      )}
    </div>
  );
}
