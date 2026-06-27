import { useState, useEffect, useRef } from "react";
import { getPphLevel, pphLevelVal, PPH_LEVEL_ORDER, PPH_THRESHOLDS } from "../data/emergency/pph-shared.js";

// ─── Task registry ──────────────────────────────────────────────────────────

const TASKS = [
  // Minor — stabilisation
  { id: "call_team",      level: "minor",   type: "call",     title: "Call for help",                         detail: "• Midwife in charge\n• On-call obstetrician",                                                                                                          followUpDelay: 90 },
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
  { id: "call_major",     level: "major",   type: "call",     title: "Call for help — major PPH",             detail: "• Midwife in charge\n• On-call obstetrician\n• Senior obstetrician\n• Anaesthetist\n• Alert theatre\n• Activate major PPH protocol\n• Alert blood transfusion lab", followUpDelay: 90, critical: true },
  { id: "second_cannula", level: "major",   type: "access",   title: "2nd large bore cannula",                detail: "14G or 16G — insert now\nCrossmatch 4 units red cells urgently\nRepeat FBC and coagulation",                                                              followUpDelay: 90, critical: true, deps: ["iv_access"] },
  { id: "txa",            level: "major",   type: "drug",     title: "Tranexamic acid 1 g IV",                detail: "Over 10 minutes IV\n⚠ TIME CRITICAL — give ASAP, within 3 hours of birth",                                                                                 followUpDelay: 90, critical: true, special: "txa", deps: ["iv_access"] },
  { id: "rapid_cryst",    level: "major",   type: "fluid",    title: "Rapid crystalloid",                     detail: "Up to 1.5–2 L Hartmann's pending blood products\nO-negative blood if life-threatening — do not wait for crossmatch\nDo not delay blood products for crystalloid",                deps: ["iv_access"] },
  { id: "carboprost",     level: "major",   type: "drug",     title: "Carboprost 0.25 mg IM",                 detail: "Every 15 minutes — up to 8 doses\nContraindicated in asthma",                                                                                              uterotonic: true, special: "carbo", followUpDelay: 90, followUpYesLog: "Carboprost dose 1 confirmed given", contraindications: ["Asthma", "Significant cardiac disease", "Active hepatic disease", "Active renal disease"], fallback: "misoprostol" },
  { id: "misoprostol",    level: "major",   type: "drug",     title: "Misoprostol 800 mcg",                   detail: "PR or sublingual — place under tongue or per rectum\nAlternative if other uterotonics unavailable or failed",                                          uterotonic: true },
  { id: "keep_warm",      level: "major",   type: "action",   title: "Keep patient warm",                     detail: "Blankets and warming device\nHypothermia worsens coagulopathy\nTreat acidosis" },
  { id: "calcium",        level: "major",   type: "drug",     title: "Calcium gluconate 10 ml 10% IV",        detail: "Treat hypocalcaemia — common in massive transfusion (citrate chelates calcium)\nCheck ionised calcium; correct acidosis\nGive slowly IV with cardiac monitoring", deps: ["iv_access"] },
  { id: "rotem_teg",      level: "major",   type: "action",   title: "ROTEM / TEG coagulation",               detail: "Point-of-care coagulation to guide product selection — if available\nNot present in all units — otherwise use lab fibrinogen/PT/APTT\nMaintain normothermia — correct acidosis", naOption: { label: "Not available", log: "ROTEM/TEG not available — using lab fibrinogen/PT/APTT" } },
  { id: "blood_products", level: "major",   type: "blood",    title: "Blood products",                        detail: "• Red cells — maintain Hb >80 g/L\n• Cryoprecipitate 2 pools — fibrinogen <2 g/L (first choice)\n• FFP 4 units — fibrinogen <1.5 g/L or coagulopathy; 1:1 with RBCs if massive ongoing loss\n• Platelets — if <75 × 10⁹/L (<100 if ongoing bleeding)\n• rFVIIa — consider if life-threatening haemorrhage not responding (haematologist)", deps: ["iv_access"] },
  // Massive
  { id: "call_massive",   level: "massive", type: "call",     title: "Activate massive PPH",                  detail: "• Consultant obstetrician — NOW\n• Consultant anaesthetist — NOW\n• Haematologist — NOW\n• Blood bank — activate MHP\n• IR if UAE planned",               followUpDelay: 90, critical: true },
  { id: "mhp_pack",       level: "massive", type: "blood",    title: "MHP pack immediately",                  detail: "Empirical — do not wait for lab results\nTarget pack: 6 units red cells + 4 units FFP\n± Platelets ± Cryoprecipitate\nMove to 1:1 RBC:FFP ratio if bleeding ongoing\nCall blood bank now",                          followUpDelay: 90, critical: true, deps: ["iv_access"] },
  { id: "cell_salvage",   level: "massive", type: "action",   title: "Cell salvage",                          detail: "Activate if available\nHaematologist authorisation if Rh-negative", naOption: { label: "Not available", log: "Cell salvage not available in this unit" } },
  { id: "bakri",          level: "massive", type: "surgical", title: "Bakri balloon tamponade",               detail: "300–500 ml saline — tamponade test\nIf bleeding stops, may avoid theatre\nHave theatre prepared regardless", consider: true, considerLead: "If bleeding continues despite resuscitation" },
  { id: "theatre",        level: "massive", type: "surgical", title: "Transfer to theatre",                   detail: "• Stepwise uterine devascularisation\n• Bilateral uterine artery ligation\n• B-Lynch / Hayman brace suture\n• UAE if stable\n• Peripartum hysterectomy — last resort", consider: true, considerLead: "If haemorrhage not controlled — prepare early" },
  { id: "cardiac_arrest_ref", level: "minor", type: "call", title: "Cardiac arrest — 2222", detail: "Call 2222 — maternal cardiac arrest\nStart CPR immediately — 30:2, hard and fast\nDo not stop haemorrhage management during CPR\nTreat reversible cause: Hypovolaemia (4 Hs)\nAnaesthetist to manage airway\nFull maternal cardiac arrest protocol applies", consider: true, considerArrestCheck: true, hidden: true },
];

// Uterotonic escalation ladder — give → pharm wait → blood-loss assess → next step
const UTEROTONIC_ORDER = ["oxytocin_bolus", "oxytocin_inf", "ergometrine", "carboprost", "misoprostol"];
const PHARM_DELAY_SEC = {
  oxytocin_bolus: 180,   // ~2–3 min
  oxytocin_inf:   300,   // ~5 min before next step
  ergometrine:    300,
  carboprost:     900,   // 15 min between doses (repeat handled separately)
  misoprostol:    600,
};
const IV_ACCESS_MAX_RETRIES = 2;

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

function bleedingSettled(log, now) {
  return bloodLossRate(log, now) < 1;
}

function hadBloodCheckSince(log, since) {
  return log.some(e => isBloodCheckEvent(e) && e.time > since);
}

function isBloodCheckEvent(e) {
  return e.kind === "blood_loss" || e.kind === "blood_loss_pending" || e.kind === "blood_loss_correction" || e.kind === "blood_loss_unchanged";
}

function canEscalateUterotonic({ taskStates, log, now, level, uterotonicHold, forcedTasks }) {
  const next = getNextUterotonic(taskStates, level, forcedTasks);
  if (!next) return null;
  const last = getLastUterotonic(taskStates);
  if (!last) return next;
  const delayMs = (PHARM_DELAY_SEC[last.id] || 180) * 1000;
  if (now - last.at < delayMs) return null;
  if (!hadBloodCheckSince(log, last.at)) return null;
  if (uterotonicHold && bleedingSettled(log, now)) return null;
  if (next.requiresIv && taskStates.iv_access?.status !== "done") return null;
  return next;
}

function taskCriticalForFollowUp(task, level) {
  if (task.critical) return true;
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
  return !uterotonicTaken(taskStates, "oxytocin_inf") && taskStates.oxytocin_inf?.status !== "not_indicated";
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

function stabilisationCallId(level) {
  if (levelVal(level) >= levelVal("massive")) return "call_massive";
  if (levelVal(level) >= levelVal("major")) return "call_major";
  return "call_team";
}

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

function computeNextPrompt({ taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone, effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, infusionReassess, sessionRecoveredAt, forcedFollowUpId }) {
  function depsOk(task) {
    return (task.deps || []).every(id => depSatisfied(id, taskStates));
  }
  // A task is relevant at the current level, OR if it has been force-activated as a
  // fallback after a higher-tier drug was found contraindicated.
  function relevant(task) { return levelVal(task.level) <= levelVal(level) || (forcedTasks || []).includes(task.id); }
  function st(id) { return effectiveTaskStatus(id, taskStates, level, txaTime); }
  function toneGate(task) {
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
      return gate(t);
    }
    return null;
  }

  // Priority 1 — IV attempt window expired → IM route (before IV follow-up chasers)
  if (taskStates.iv_access?.status !== "done" && ivAccessPendingSince) {
    const windowMs = ivAccessDeadlineMs(level, ivAccessRetries);
    if (now - ivAccessPendingSince >= windowMs) {
      const imOpts = ["ergometrine", "carboprost", "misoprostol"].filter(id => {
        const t = TASKS.find(x => x.id === id);
        return t && levelVal(t.level) <= levelVal(level) && !uterotonicTaken(taskStates, id) && taskStates[id]?.status !== "skipped";
      });
      return {
        type: "iv_fail",
        imOptions: imOpts.map(id => TASKS.find(x => x.id === id)),
        retries: ivAccessRetries,
        maxRetries: IV_ACCESS_MAX_RETRIES,
        windowMs,
        level,
      };
    }
  }

  // Priority 1.04 — cardiac arrest check (flagged from ABC instability, any PPH level)
  if ((forcedTasks || []).includes("cardiac_arrest_ref")) {
    const arrestTask = TASKS.find(x => x.id === "cardiac_arrest_ref");
    if (arrestTask && st("cardiac_arrest_ref") == null) return gate(arrestTask);
  }

  // Priority 1.05 — user tapped an assigned row in the checklist
  if (forcedFollowUpId) {
    const t = TASKS.find(x => x.id === forcedFollowUpId);
    if (t && taskStates[t.id]?.status === "assigned") return { type: "followup", task: t };
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
  if (bestCritFollowup) return { type: "followup", task: bestCritFollowup };

  // Priority 1.5 — tone assessment after fundal massage (or if fundal skipped)
  const fundalStatus = taskStates["fundal_massage"]?.status;
  if ((fundalStatus === "done" || fundalStatus === "skipped") && !toneAssessed) return { type: "tone_check" };

  // Priority 1.75 — force-activated fallbacks/treatments (carboprost after ergometrine CI, suture after trauma, etc.)
  const forced = nextForcedTask();
  if (forced) return forced;

  // Priority 1.85 — IV just established → reassess infusion need
  if (infusionReassess && taskStates.iv_access?.status === "done" && !uterotonicTaken(taskStates, "oxytocin_inf") && taskStates.oxytocin_inf?.status !== "not_indicated") {
    return { type: "infusion_reassess" };
  }

  // Priority 1.9 — queued uterotonic (user accepted escalation)
  if (queuedUterotonicId) {
    const qt = TASKS.find(x => x.id === queuedUterotonicId);
    if (qt && st(qt.id) == null && depsOk(qt)) return gate(qt);
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

  // Priority 2 — blood loss check
  const blRate = bloodLossRate(log, now);
  const blInterval = reassessInterval(blRate, level);
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  const checkAnchor = Math.max(lastCheck?.time ?? 0, sessionRecoveredAt ?? 0);
  if (lastCheck && (now - checkAnchor) / 1000 > blInterval) return { type: "blood_loss_check", rate: blRate, interval: blInterval };

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
  if (bestFollowup) return { type: "followup", task: bestFollowup };

  // Priority 4.9 — stabilisation trio in fixed order before other critical tasks
  for (const id of [stabilisationCallId(level), "abc", "iv_access"]) {
    const t = TASKS.find(x => x.id === id);
    if (!t || !relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    return gate(t);
  }

  // Priority 5 — critical unstarted tasks, highest level first so call_massive
  // surfaces before second_cannula when at massive PPH
  for (const critLevel of ["massive", "major", "minor"]) {
    for (const t of TASKS) {
      if (t.level !== critLevel || !relevant(t) || st(t.id) !== null || !depsOk(t) || !taskCriticalForQueue(t)) continue;
      if (t.hidden && !(forcedTasks || []).includes(t.id)) continue;
      if (t.special === "txa" && !txaEligible(taskStates, level, txaTime)) continue;
      if (t.special === "carbo" && carboCount > 0 && carboLastTime) continue;
      if (toneGate(t)) continue;
      return gate(t);
    }
  }

  // Priority 6 — carboprost repeat dose (requires confirmed first dose with timestamp)
  const carboActive = carboCount > 0 && carboLastTime;
  if (carboActive && carboCount < 8 && (now - carboLastTime) / 1000 >= 15 * 60) {
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
    if (toneGate(t)) continue;
    // Uterotonic ladder — only surface the next rung when allowed
    if (t.uterotonic) {
      const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
      if (!nextUt || t.id !== nextUt.id) continue;
      const last = getLastUterotonic(taskStates);
      if (last) {
        const delayMs = (PHARM_DELAY_SEC[last.id] || 180) * 1000;
        if (now - last.at < delayMs) continue;
        if (!hadBloodCheckSince(log, last.at)) continue;
        if (uterotonicHold && bleedingSettled(log, now)) continue;
      }
    }
    return gate(t);
  }

  // Priority 7.5 — massive escalation considerations (soft prompts, not sequential orders)
  if (levelVal(level) >= levelVal("massive")) {
    for (const t of TASKS) {
      if (!t.consider || t.considerArrestCheck || !relevant(t) || st(t.id) !== null || considerSnoozed(t.id)) continue;
      if (toneGate(t)) continue;
      return gate(t);
    }
  }

  // Cardiac arrest check at massive if ABC done but not yet assessed (backup if ABC button not used)
  if (levelVal(level) >= levelVal("massive")) {
    const arrestTask = TASKS.find(x => x.id === "cardiac_arrest_ref");
    const abcDone = ["done", "skipped"].includes(taskStates.abc?.status);
    if (arrestTask && abcDone && st("cardiac_arrest_ref") == null && !(forcedTasks || []).includes("cardiac_arrest_ref")) {
      return gate(arrestTask);
    }
  }

  const pending = countMonitoringPending({ taskStates, level, forcedTasks, txaTime });
  return { type: "monitoring", ...pending };
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

function StandDownConfirm({ bloodLoss, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-end p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full" onClick={e => e.stopPropagation()}>
        <p className="text-white font-bold mb-1">Stand down?</p>
        <p className="text-gray-500 text-sm mb-4">
          Total blood loss: <span className={`font-bold ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-700 text-gray-300 font-medium py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-white text-gray-950 font-bold py-2.5 rounded-lg text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ elapsed, bloodLoss, level, assignedCount, showQuickAdd, onAddBlood, onCorrectBlood, onStandDown }) {
  const levelLabel = { minor: "Minor PPH", major: "Major PPH", massive: "Massive PPH" }[level];
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
    <div className="bg-gray-900 px-4 pt-3 pb-3 border-b border-gray-800 flex-shrink-0 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-white text-xl font-bold tabular-nums shrink-0">{fmt(elapsed)}</span>
        <button onClick={onStandDown} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2.5 py-1.5 rounded transition shrink-0">Stand down</button>
      </div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {assignedCount > 0 && <span className="text-amber-500 text-xs">{assignedCount} in progress</span>}
        <span className="text-gray-600 text-xs">{levelLabel}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-gray-600 text-xs shrink-0">Blood loss</span>
          <span className={`text-2xl font-black tabular-nums transition-colors ${bloodLossClass(bloodLoss)}`}>{bloodLoss} ml</span>
          {showQuickAdd && !correcting && (
            <button onClick={openCorrect} className="text-gray-600 hover:text-gray-400 text-xs shrink-0 transition">Correct</button>
          )}
        </div>
        {showQuickAdd && !correcting && (
          <div className="grid grid-cols-3 gap-2">
            {[100, 250, 500].map(n => (
              <button key={n} onClick={() => onAddBlood(n)}
                className="text-gray-600 hover:text-gray-300 text-xs border border-gray-800 hover:border-gray-600 px-2 py-2 rounded transition min-h-[44px]">
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

// ─── Drug strip ───────────────────────────────────────────────────────────────

function DrugStrip({ txaTime, txaSecondDone, taskStates, level, birthTime, carboCount, carboLastTime, now }) {
  const items = [];

  // TXA 3-hour window. Shown only while clinically actionable:
  //  • before the first dose (at major+) → "give it in time"
  //  • between first and second dose → "2nd dose window"
  // Hidden once the second dose is given or the window has closed.
  const windowMs = 3 * 60 * 60 * 1000;
  const remaining = Math.max(0, birthTime + windowMs - now);
  const txaRelevant = levelVal(level) >= levelVal("major");
  const ivReady = taskStates.iv_access?.status === "done";
  const txaFirstGiven = !!txaTime;
  const txaAwaitingFirst = txaEligible(taskStates, level, txaTime);
  // Before 1st dose: countdown while IV in and TXA still due. After 1st dose: track 2nd-dose window.
  const showTxaWindow = txaRelevant && remaining > 0 && !txaSecondDone && (
    txaFirstGiven || (txaAwaitingFirst && ivReady)
  );
  if (showTxaWindow) {
    const pct = Math.max(0, Math.min(100, (remaining / windowMs) * 100));
    const urgent = remaining < 30 * 60 * 1000;
    const label = txaTime ? "2nd dose window" : "TXA window";
    items.push(
      <div key="txa" className="flex items-center gap-3">
        <span className="text-gray-600 text-xs w-24 shrink-0">{label}</span>
        <div className="flex-1 bg-gray-800 h-px relative">
          <div className={`absolute top-0 left-0 h-px transition-all ${urgent ? "bg-orange-400" : "bg-gray-500"}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-xs font-mono tabular-nums w-14 text-right shrink-0 ${urgent ? "text-orange-400" : "text-gray-500"}`}>
          {fmt(remaining)}
        </span>
      </div>
    );
  }

  if (carboCount > 0) {
    const nextMs = carboLastTime ? Math.max(0, carboLastTime + 15 * 60 * 1000 - now) : null;
    const due = nextMs === 0;
    items.push(
      <div key="carbo" className="flex items-center gap-3">
        <span className="text-gray-600 text-xs w-18 shrink-0">Carboprost</span>
        <span className="text-gray-500 text-xs">{carboLastTime ? `${carboCount} / 8` : "assigned"}</span>
        {!carboLastTime && (
          <span className="text-amber-500 text-xs ml-auto">confirm dose 1</span>
        )}
        {nextMs !== null && carboCount < 8 && (
          <span className={`text-xs font-mono ml-auto ${due ? "text-amber-400 font-bold" : "text-gray-600"}`}>
            {due ? "dose due now" : `next in ${fmt(nextMs)}`}
          </span>
        )}
        {carboCount >= 8 && <span className="text-gray-700 text-xs ml-auto">max doses</span>}
      </div>
    );
  }

  if (!items.length) return null;
  return (
    <div className="px-4 py-2.5 border-b border-gray-800 flex-shrink-0 space-y-2">
      {items}
    </div>
  );
}

// ─── Active prompt sub-components ────────────────────────────────────────────

function TaskPrompt({ task, onDone, onAssign, onSkip, onNotAvailable, onAlreadyGiven, ivAccessDone, onCheckCardiacArrest }) {
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
        {task.uterotonic && (
          <button onClick={() => onAlreadyGiven(task)} className="w-full border border-amber-700 text-amber-400 font-bold py-3 text-sm rounded-lg">
            Already given
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onDone(task)}
            disabled={!canGive}
            className={`${task.noDelegate && !task.uterotonic ? "w-full" : "flex-1"} bg-white text-gray-950 font-bold py-3 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed`}
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

function FollowupPrompt({ task, onYes, onNo }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  const escalates = !!task.followUpEscalate;
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Follow-up</span>
      <p className="text-white text-xl font-bold leading-snug">{task.followUpQuestion || task.title}</p>
      <p className="text-gray-600 text-xs">{task.followUpQuestion ? "Reassess now" : "Assigned to team — has it been done?"}</p>
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

function IvFailPrompt({ imOptions, retries, maxRetries, windowMs, level, onRetry, onImDrug }) {
  useEffect(() => { if ("vibrate" in navigator) navigator.vibrate([100, 60, 100]); }, []);
  const canRetry = retries < maxRetries;
  const nextWindow = fmtIvWindow(ivAccessDeadlineMs(level, retries + 1));
  const title = retries === 0
    ? `No IV after ${fmtIvWindow(windowMs)}`
    : "Still no IV access";
  const detail = canRetry
    ? `Cannula not in — IM / sublingual route if not achieved soon. ${maxRetries - retries} retry${maxRetries - retries !== 1 ? "ies" : ""} left.`
    : "IV access not achieved — give uterotonic by IM / sublingual route. Infusion unavailable until IV in.";
  return (
    <div className="px-4 py-3.5 space-y-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-red-400">IV access</span>
      <p className="text-white text-xl font-bold leading-snug">{title}</p>
      <p className="text-gray-500 text-xs">{detail}</p>
      <div className="flex flex-col gap-2 pt-1">
        {canRetry && (
          <button onClick={onRetry} className="w-full border border-gray-700 text-white font-medium py-2.5 text-sm rounded-lg">
            Keep trying — another {nextWindow}
          </button>
        )}
        {imOptions.map(t => (
          <button key={t.id} onClick={() => onImDrug(t)} className="w-full bg-white text-gray-950 font-bold py-2.5 text-sm rounded-lg">
            {t.title}
          </button>
        ))}
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
            <button onClick={() => onArrestYes(task)} className="w-full bg-red-500 text-white font-bold py-3 text-sm rounded-lg">
              Yes — call 2222 now
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

function ActivePromptArea({ prompt, bloodLoss, level, carboCount, assignedCount, ivAccessDone, cardiacArrestPending, handlers }) {
  if (!prompt) return null;
  const { onDone, onAssign, onSkip, onNotAvailable, onAlreadyGiven, onFollowupYes, onFollowupNo, onAssessExclude, onAssessPresent, onBloodAdd, onBloodUnchanged, onBloodPending, onBloodCorrect, onCarboDose, onCarboSkip, onTxaSecondGiven, onTxaSecondNotNeeded, onToneCheckFirm, onToneCheckBoggy, onCiClear, onCiContraindicated, onUterotonicEscalateYes, onUterotonicEscalateHold, onUterotonicEscalateNotYet, onIvFailRetry, onIvFailImDrug, onInfusionYes, onInfusionAssign, onInfusionNotNeeded, onConsiderPrepare, onConsiderNotIndicated, onConsiderNotNow, onConsiderArrestYes, onConsiderArrestNo, onCheckCardiacArrest } = handlers;

  let content;
  switch (prompt.type) {
    case "task":         content = <TaskPrompt task={prompt.task} onDone={onDone} onAssign={onAssign} onSkip={onSkip} onNotAvailable={onNotAvailable} onAlreadyGiven={onAlreadyGiven} ivAccessDone={ivAccessDone} onCheckCardiacArrest={prompt.task.id === "abc" && cardiacArrestPending ? onCheckCardiacArrest : undefined} />; break;
    case "followup":     content = <FollowupPrompt task={prompt.task} onYes={onFollowupYes} onNo={onFollowupNo} />; break;
    case "assess":       content = <AssessPrompt task={prompt.task} onExclude={onAssessExclude} onPresent={onAssessPresent} />; break;
    case "blood_loss_check": content = <BloodCheckPrompt level={level} bloodLoss={bloodLoss} rate={prompt.rate} interval={prompt.interval} onAdd={onBloodAdd} onUnchanged={onBloodUnchanged} onPending={onBloodPending} onCorrect={onBloodCorrect} />; break;
    case "carbo_dose":   content = <CarboDosePrompt count={carboCount} onDose={onCarboDose} onSkip={onCarboSkip} />; break;
    case "txa_second":   content = <TxaSecondPrompt onGiven={onTxaSecondGiven} onNotNeeded={onTxaSecondNotNeeded} />; break;
    case "tone_check":   content = <ToneCheckPrompt onFirm={onToneCheckFirm} onBoggy={onToneCheckBoggy} />; break;
    case "uterotonic_escalate": content = <UterotonicEscalatePrompt nextTask={prompt.nextTask} sinceTitle={prompt.sinceTitle} onYes={() => onUterotonicEscalateYes(prompt.nextTask)} onHold={onUterotonicEscalateHold} onNotYet={onUterotonicEscalateNotYet} />; break;
    case "iv_fail":      content = <IvFailPrompt imOptions={prompt.imOptions} retries={prompt.retries} maxRetries={prompt.maxRetries} windowMs={prompt.windowMs} level={prompt.level} onRetry={onIvFailRetry} onImDrug={onIvFailImDrug} />; break;
    case "infusion_reassess": content = <InfusionReassessPrompt onYes={onInfusionYes} onAssign={onInfusionAssign} onNotNeeded={onInfusionNotNeeded} />; break;
    case "ci_check":     content = <CiCheckPrompt task={prompt.task} onClear={onCiClear} onContraindicated={onCiContraindicated} />; break;
    case "consider":     content = <ConsiderPrompt task={prompt.task} remindMin={Math.round(considerSnoozeMs(level) / 60000)} onPrepare={onConsiderPrepare} onNotIndicated={onConsiderNotIndicated} onNotNow={onConsiderNotNow} onArrestYes={onConsiderArrestYes} onArrestNo={onConsiderArrestNo} />; break;
    case "monitoring":   content = <MonitoringPrompt inProgress={prompt.inProgress} blocked={prompt.blocked} />; break;
    default:             return null;
  }

  const isInterrupt = ["followup", "assess", "blood_loss_check", "carbo_dose", "txa_second", "tone_check", "ci_check", "uterotonic_escalate", "iv_fail", "infusion_reassess", "consider"].includes(prompt.type);

  return (
    <div className={`flex-shrink-0 border-b border-gray-800 ${isInterrupt ? "bg-gray-900" : "bg-gray-900"}`}>
      {isInterrupt && (
        <div className="px-4 pt-2.5 pb-0">
          <div className="h-px bg-amber-500/50 w-full" />
        </div>
      )}
      {content}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskRow({ task, state, taskStates, level, txaTime, now, emergencyStartTime, onConfirm }) {
  const rawStatus = state?.status ?? null;
  const txaDeferred = task.id === "txa" && rawStatus === "skipped" && txaEligible(taskStates, level, txaTime);
  const status = txaDeferred ? null : rawStatus;
  const blockingDeps = (task.deps || []).filter(id => !depSatisfied(id, taskStates));
  const isLocked = !status && blockingDeps.length > 0;

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
      : null;
    const mark = completedMark();
    return (
      <div className="flex items-center gap-3 px-4 py-1.5">
        <span className="text-gray-700 text-xs w-3 shrink-0">✓</span>
        <span className="text-gray-700 text-sm min-w-0">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto shrink-0 text-right tabular-nums">
          {[status === "already_given" && "already given", assessNote, callNote, refNote, mark].filter(Boolean).join(" · ")}
        </span>
      </div>
    );
  }

  if (status === "not_indicated") {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5">
        <span className="text-gray-800 text-xs w-3 shrink-0">–</span>
        <span className="text-gray-800 text-sm">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto">not indicated</span>
      </div>
    );
  }

  if (status === "skipped") {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5">
        <span className="text-gray-800 text-xs w-3 shrink-0">–</span>
        <span className="text-gray-800 text-sm">{task.title}</span>
        <span className="text-gray-800 text-xs ml-auto">
          {state?.skipReason === "not_required" ? "not required — uterus firm" : "skipped"}
        </span>
      </div>
    );
  }

  if (status === "assigned") {
    const sinceMs = now - (state.assignedAt || now);
    return (
      <button onClick={() => onConfirm(task.id)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-gray-900 transition">
        <span className="text-amber-500 text-xs w-3 shrink-0">→</span>
        <span className="text-white text-sm flex-1">{task.title}</span>
        <span className="text-gray-600 text-xs tabular-nums">{fmt(sinceMs)}</span>
      </button>
    );
  }

  if (isLocked) {
    const blockingTitle = TASKS.find(t => t.id === blockingDeps[0])?.title ?? blockingDeps[0];
    return (
      <div className="flex items-center gap-3 px-4 py-1.5 opacity-30">
        <span className="text-gray-700 text-xs w-3 shrink-0">○</span>
        <span className="text-gray-700 text-sm flex-1">{task.title}</span>
        <span className="text-gray-700 text-xs shrink-0">awaits {blockingTitle}</span>
      </div>
    );
  }

  // Pending
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <span className={`text-xs w-3 shrink-0 ${txaDeferred ? "text-amber-500" : "text-gray-700"}`}>·</span>
      <span className={`text-sm flex-1 ${txaDeferred ? "text-amber-200" : "text-gray-300"}`}>{task.title}</span>
      {txaDeferred && <span className="text-amber-600 text-xs shrink-0">still needed</span>}
    </div>
  );
}

function TaskList({ taskStates, level, now, onConfirmTask, forcedTasks, txaTime, emergencyStartTime }) {
  const relevantLevels = LEVEL_ORDER.filter(l => levelVal(l) <= levelVal(level));
  const showSections = relevantLevels.length > 1;
  const sectionLabels = { minor: "Initial response", major: "Major PPH", massive: "Massive PPH" };
  const forcedAbove = (forcedTasks || [])
    .map(id => TASKS.find(t => t.id === id))
    .filter(t => t && levelVal(t.level) > levelVal(level));

  return (
    <div className="flex-1 overflow-y-auto">
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
            />
          ))}
        </div>
      )}
      {relevantLevels.map(sectionLevel => {
        const tasks = TASKS.filter(t => t.level === sectionLevel && (!t.hidden || (forcedTasks || []).includes(t.id)));
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
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Setup screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onConfirm }) {
  const [ml, setMl] = useState("");
  const [birthTimeInput, setBirthTimeInput] = useState("");
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
    if (!isNaN(n) && n > 0) onConfirm(n, parseBirthTime());
  }

  const customMl = ml.trim();
  const customValid = customMl !== "" && !isNaN(Number(customMl)) && Number(customMl) > 0;

  return (
    <div className="w-full min-w-0 box-border min-h-screen bg-gray-950 flex flex-col px-4 pt-8 pb-8 gap-6">
      <div className="w-full min-w-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">PPH</p>
        <h1 className="text-white text-2xl font-black leading-tight">Initial blood loss</h1>
        <p className="text-gray-500 text-sm mt-1">How much has been lost?</p>
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

function AftercareScreen({ level, onComplete }) {
  const items = AFTERCARE.filter(a => levelVal(level) >= levelVal(a.minLevel));
  const [checked, setChecked] = useState({});
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  function toggle(id) { setChecked(prev => ({ ...prev, [id]: !prev[id] })); }
  function tryComplete() {
    const done = items.filter(a => checked[a.id]);
    if (!done.length) { setConfirmEmpty(true); return; }
    onComplete(done);
  }
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">Post-PPH</p>
        <h2 className="text-white text-2xl font-black">Aftercare checklist</h2>
        <p className="text-gray-500 text-sm mt-1">Haemostasis achieved — complete before handover.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {items.map(a => (
          <button key={a.id} onClick={() => toggle(a.id)}
            className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition ${checked[a.id] ? "border-gray-700 bg-gray-900" : "border-gray-800"}`}>
            <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${checked[a.id] ? "bg-white text-gray-950" : "border border-gray-600 text-transparent"}`}>✓</span>
            <span className={`text-sm leading-snug ${checked[a.id] ? "text-gray-400 line-through" : "text-white"}`}>{a.text}</span>
          </button>
        ))}
      </div>
      <div className="px-4 py-4 border-t border-gray-800 flex-shrink-0 space-y-3">
        {confirmEmpty && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2">
            <p className="text-gray-400 text-sm">No aftercare items ticked — complete anyway?</p>
            <div className="flex gap-2">
              <button onClick={() => onComplete([])} className="flex-1 border border-gray-700 text-gray-300 text-sm py-2 rounded-lg">Complete anyway</button>
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

function SummaryScreen({ log, emergencyStartTime, resolveTime, bloodLoss, peakBloodLoss, aftercareCompleted, onBack }) {
  const duration = (resolveTime ?? Date.now()) - emergencyStartTime;
  const peak = peakBloodLoss ?? bloodLoss;
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
      </div>

      <div className="flex-1 overflow-y-auto">
        {log.map((e, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-2.5 border-b border-gray-900">
            <span className="text-gray-700 text-xs font-mono tabular-nums mt-0.5 w-16 shrink-0">{fmtTime(e.time)}</span>
            <span className="text-gray-300 text-sm leading-snug">{e.label}</span>
          </div>
        ))}
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
function saveSession(data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
function clearSession() { try { localStorage.removeItem(STORAGE_KEY); } catch {} }

// ─── Main component ───────────────────────────────────────────────────────────

export default function EmergencyPage({ onClose }) {
  const [savedSession] = useState(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  });
  const [recoveryDismissed, setRecoveryDismissed] = useState(false);
  const [emergencyStartTime, setEmergencyStartTime] = useState(() => savedSession?.emergencyStartTime ?? Date.now());
  const [phase, setPhase] = useState("setup");
  const [bloodLoss, setBloodLoss] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [log, setLog] = useState([]);
  const [txaTime, setTxaTime] = useState(null);
  const [txaHandled, setTxaHandled] = useState(false);
  const [txaSecondDone, setTxaSecondDone] = useState(false);
  const [toneAssessed, setToneAssessed] = useState(false);
  const [birthTime, setBirthTime] = useState(null);
  const [carboCount, setCarboCount] = useState(0);
  const [carboLastTime, setCarboLastTime] = useState(null);
  const [ciCleared, setCiCleared] = useState({});
  const [forcedTasks, setForcedTasks] = useState([]);
  const [uterotonicHold, setUterotonicHold] = useState(false);
  const [uterotonicEscalate, setUterotonicEscalate] = useState(null);
  const [queuedUterotonicId, setQueuedUterotonicId] = useState(null);
  const [ivAccessPendingSince, setIvAccessPendingSince] = useState(null);
  const [ivAccessRetries, setIvAccessRetries] = useState(0);
  const [forcedFollowUpId, setForcedFollowUpId] = useState(null);
  const [infusionReassess, setInfusionReassess] = useState(false);
  const [sessionRecoveredAt, setSessionRecoveredAt] = useState(null);
  const [resolveTime, setResolveTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [escalationAlert, setEscalationAlert] = useState(null);
  const [standDownConfirm, setStandDownConfirm] = useState(false);
  const [peakBloodLoss, setPeakBloodLoss] = useState(0);
  const [aftercareCompleted, setAftercareCompleted] = useState(false);

  const prevLevelRef = useRef(null);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
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
    setLog(prev => [...prev, { kind, label, time: Date.now() }]);
  }

  function bumpPeak(ml) {
    setPeakBloodLoss(prev => Math.max(prev, ml));
  }

  function addBloodLog(label, total) {
    bumpPeak(total);
    setLog(prev => [...prev, { kind: "blood_loss", label, total, time: Date.now() }]);
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

  useEffect(() => {
    if (phase !== "active") return;
    saveSession({ emergencyStartTime, phase, bloodLoss, peakBloodLoss, aftercareCompleted, taskStates, toneAssessed, log,
      txaTime, txaHandled, txaSecondDone, birthTime, carboCount, carboLastTime, ciCleared, forcedTasks,
      uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, infusionReassess, sessionRecoveredAt });
  }, [phase, bloodLoss, peakBloodLoss, aftercareCompleted, taskStates, toneAssessed, log, txaTime, txaHandled, txaSecondDone, birthTime, carboCount, carboLastTime, ciCleared, forcedTasks, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, infusionReassess, sessionRecoveredAt]);

  const effectiveBirthTime = birthTime ?? emergencyStartTime;
  const ivAccessDone = taskStates.iv_access?.status === "done";

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
    ? computeNextPrompt({ taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone, effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, infusionReassess, sessionRecoveredAt, forcedFollowUpId })
    : null;

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

  function handleSetup(ml, bt) {
    // Fresh emergency — reset the clock to now (a discarded prior session must
    // not carry its elapsed time over into the new one).
    setEmergencyStartTime(Date.now());
    setBloodLoss(ml);
    setPeakBloodLoss(ml);
    if (bt) setBirthTime(bt);
    const initialLevel = getLevel(ml);
    prevLevelRef.current = initialLevel;
    const t = Date.now();
    const logEntries = [{ kind: "blood_loss", label: `Initial blood loss: ${ml} ml`, total: ml, time: t }];
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
    setPhase("active");
  }

  function handleAddBlood(delta) {
    const next = bloodLoss + delta;
    setBloodLoss(next);
    addBloodLog(`+${delta} ml → ${next} ml`, next);
  }

  function handleDone(task) {
    const t = Date.now();
    const scheduleFollowUp = task.followUpDelay && task.followUpQuestion;
    setTaskStates(prev => ({
      ...prev,
      [task.id]: scheduleFollowUp
        ? { status: "done", doneAt: t, followUpAt: t }
        : { status: "done", doneAt: t },
    }));
    addLog("task_done", `Done: ${task.title}`);
    if (task.id === "call_major" || task.id === "call_massive") absorbLowerCallSteps(setTaskStates, task.id, t);
    if (task.special === "txa") { setTxaTime(t); setTxaHandled(true); }
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    if (task.id === "iv_access") onIvAccessEstablished({ ...taskStates, iv_access: { status: "done", doneAt: t } });
    if (task.uterotonic) { setUterotonicEscalate(null); setQueuedUterotonicId(null); }
  }

  function handleAlreadyGiven(task) {
    const t = Date.now();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "already_given", doneAt: t, alreadyGivenAt: t } }));
    addLog("task_already_given", `Already given: ${task.title}`);
    if (task.special === "carbo") { setCarboCount(1); setCarboLastTime(t); }
    setUterotonicEscalate(null);
    setQueuedUterotonicId(null);
  }

  function handleAssign(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: Date.now() } }));
    addLog("task_assigned", `Assigned: ${task.title}`);
    if (task.id === "iv_access") {
      setIvAccessPendingSince(Date.now());
      setIvAccessRetries(0);
    }
  }

  function handleSkip(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: Date.now() } }));
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

  function handleNotAvailable(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: Date.now() } }));
    addLog("task_skipped", task.naOption?.log || `Not available: ${task.title}`);
  }

  function handleFollowupYes(task) {
    const t = Date.now();
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
      setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now(), escalatedAt: Date.now() } }));
      addLog("followup_escalate", task.followUpEscalateLog || `Escalating: ${task.title}`);
    } else if (task.followUpQuestion) {
      setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], followUpAt: Date.now() } }));
      addLog("followup_pending", task.followUpEscalate ? "Still in progress — check back in 5 min" : `Still in progress: ${task.title}`);
    } else {
      setTaskStates(prev => ({ ...prev, [task.id]: { ...prev[task.id], assignedAt: Date.now() } }));
      addLog("followup_pending", `Still in progress: ${task.title}`);
    }
  }

  function handleAssessExclude(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now(), assessOutcome: "excluded" } }));
    addLog("assess", task.assess.excludeLog || `${task.title} — excluded`);
  }

  function handleAssessPresent(task) {
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: Date.now(), assessOutcome: "present" } }));
    addLog("assess", task.assess.presentLog || `${task.title} — present`);
    if (task.assess.treatment) {
      setForcedTasks(prev => prev.includes(task.assess.treatment) ? prev : [...prev, task.assess.treatment]);
    }
  }

  function handleBloodAdd(delta) {
    const next = bloodLoss + delta;
    const at = Date.now();
    const newLog = [...log, { kind: "blood_loss", label: `Blood loss check: +${delta} ml → ${next} ml`, total: next, time: at }];
    setBloodLoss(next);
    setPeakBloodLoss(prev => Math.max(prev, next));
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, getLevel(next), at, next);
  }

  function handleBloodUnchanged() {
    const at = Date.now();
    const newLog = [...log, { kind: "blood_loss_unchanged", label: `Blood loss check: unchanged (${bloodLoss} ml)`, time: at }];
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, level, at, bloodLoss);
  }

  function handleBloodPending() {
    const at = Date.now();
    const newLog = [...log, { kind: "blood_loss_pending", label: `Blood loss check: pending — no update (${bloodLoss} ml)`, time: at }];
    setLog(newLog);
    evaluateEscalationAfterBlood(newLog, level, at, bloodLoss);
  }

  function handleBloodCorrect(newTotal) {
    const prev = bloodLoss;
    const next = Math.max(0, Math.round(newTotal));
    if (next === prev) return;
    const at = Date.now();
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
    const t = Date.now();
    setIvAccessPendingSince(t);
    setIvAccessRetries(prev => prev + 1);
    setTaskStates(prev => ({
      ...prev,
      iv_access: { ...prev.iv_access, status: "assigned", assignedAt: t },
    }));
    addLog("iv_fail", `IV access — keep trying (${ivAccessRetries + 1}/${IV_ACCESS_MAX_RETRIES} retries used)`);
  }

  function handleIvFailImDrug(task) {
    setQueuedUterotonicId(task.id);
    addLog("iv_fail", `IV not in — proceeding to ${task.title}`);
  }

  function handleInfusionYes() {
    setQueuedUterotonicId("oxytocin_inf");
    setInfusionReassess(false);
  }

  function handleInfusionAssign() {
    setTaskStates(prev => ({ ...prev, oxytocin_inf: { status: "assigned", assignedAt: Date.now() } }));
    addLog("task_assigned", "Assigned: Oxytocin infusion");
    setInfusionReassess(false);
  }

  function handleInfusionNotNeeded() {
    setTaskStates(prev => ({ ...prev, oxytocin_inf: { status: "not_indicated", doneAt: Date.now() } }));
    addLog("task_skipped", "Oxytocin infusion — not indicated after reassessment");
    setInfusionReassess(false);
  }

  function handleCheckCardiacArrest() {
    if (taskStates.cardiac_arrest_ref?.status) return;
    setForcedTasks(prev => prev.includes("cardiac_arrest_ref") ? prev : [...prev, "cardiac_arrest_ref"]);
    addLog("consider", "ABC — instability → cardiac arrest check");
  }

  function handleConsiderPrepare(task) {
    const t = Date.now();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "assigned", assignedAt: t } }));
    addLog("consider", `Consider ${task.title} — team preparing`);
  }

  function handleConsiderNotIndicated(task) {
    const t = Date.now();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "not_indicated", doneAt: t } }));
    addLog("consider", `${task.title} — not indicated`);
  }

  function handleConsiderNotNow(task) {
    const t = Date.now();
    const snoozeMs = considerSnoozeMs(getLevel(bloodLoss));
    const mins = Math.round(snoozeMs / 60000);
    setTaskStates(prev => ({
      ...prev,
      [task.id]: { ...prev[task.id], considerSnoozeUntil: t + snoozeMs },
    }));
    addLog("consider", `${task.title} — deferred ${mins} min`);
  }

  function handleConsiderArrestYes(task) {
    const t = Date.now();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: t, arrestConfirmed: true } }));
    addLog("consider", "Maternal cardiac arrest — 2222 called");
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
  }

  function handleConsiderArrestNo(task) {
    const t = Date.now();
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "done", doneAt: t, considerNoArrest: true } }));
    addLog("consider", "No cardiac arrest — continue PPH resus");
  }

  function handleCarboDose() {
    const next = carboCount + 1;
    setCarboCount(next);
    setCarboLastTime(Date.now());
    addLog("carbo_dose", `Carboprost dose ${next}/8`);
  }

  function handleCarboSkip() {
    const next = Math.min(carboCount + 1, 8);
    setCarboCount(next);
    setCarboLastTime(Date.now());
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
    setTaskStates(prev => ({ ...prev, [task.id]: { status: "skipped", skippedAt: Date.now() } }));
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
    setTaskStates(prev => ({ ...prev, bimanual: { status: "skipped", skippedAt: Date.now(), skipReason: "not_required" } }));
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
    setTaskStates(prev => ({ ...prev, [taskId]: { status: "done", doneAt: Date.now() } }));
    addLog("task_done", `Confirmed done: ${task?.title ?? taskId}`);
    if (task?.special === "txa") { setTxaTime(Date.now()); setTxaHandled(true); }
    if (task?.special === "carbo") { setCarboCount(prev => prev === 0 ? 1 : prev); setCarboLastTime(Date.now()); }
    if (task?.uterotonic) { setQueuedUterotonicId(null); setUterotonicEscalate(null); }
  }

  function handleRecover() {
    const s = savedSession;
    if (!s) return;
    setEmergencyStartTime(s.emergencyStartTime ?? Date.now());
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
    setInfusionReassess(s.infusionReassess ?? false);
    prevLevelRef.current = getLevel(s.bloodLoss ?? 0);
    const t = Date.now();
    setSessionRecoveredAt(t);
    setLog(prev => [...prev, { kind: "session_resumed", label: "Session resumed — blood check timer reset", time: t }]);
    setPhase("active");
  }

  function handleStandDown() {
    const t = Date.now();
    const unresolvedEntries = TASKS
      .filter(task => taskStates[task.id]?.status === "assigned")
      .map(task => ({ kind: "unresolved", label: `Unresolved at stand-down: ${task.title}`, time: t }));
    setResolveTime(t);
    setLog(prev => [
      ...prev,
      { kind: "stand_down", label: `Emergency stood down — ${bloodLoss} ml total`, time: t },
      ...unresolvedEntries,
    ]);
    setStandDownConfirm(false);
    clearSession();
    setPhase("aftercare");
  }

  function handleAftercareComplete(doneItems) {
    const t = Date.now();
    setAftercareCompleted(true);
    setLog(prev => [
      ...prev,
      ...doneItems.map(a => ({ kind: "aftercare", label: `Aftercare done: ${a.text}`, time: t })),
    ]);
    setPhase("summary");
  }

  // ── Render ──

  if (phase === "setup") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
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
      <SetupScreen onConfirm={handleSetup} />
    </div>
  );
  if (phase === "aftercare") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <AftercareScreen level={level} onComplete={handleAftercareComplete} />
    </div>
  );
  if (phase === "summary") return (
    <div className="emergency-shell fixed inset-0 z-50 bg-gray-950 overflow-y-auto overflow-x-hidden w-full max-w-full" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <SummaryScreen log={log} emergencyStartTime={emergencyStartTime} resolveTime={resolveTime} bloodLoss={bloodLoss} peakBloodLoss={peakBloodLoss} aftercareCompleted={aftercareCompleted} onBack={onClose} />
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
    onIvFailRetry: handleIvFailRetry, onIvFailImDrug: handleIvFailImDrug,
    onInfusionYes: handleInfusionYes, onInfusionAssign: handleInfusionAssign, onInfusionNotNeeded: handleInfusionNotNeeded,
    onConsiderPrepare: handleConsiderPrepare, onConsiderNotIndicated: handleConsiderNotIndicated,
    onConsiderNotNow: handleConsiderNotNow, onConsiderArrestYes: handleConsiderArrestYes, onConsiderArrestNo: handleConsiderArrestNo,
    onCheckCardiacArrest: handleCheckCardiacArrest,
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 overflow-hidden w-full max-w-full emergency-shell" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {escalationAlert && <EscalationOverlay level={escalationAlert.level} note={escalationAlert.note} onDismiss={() => setEscalationAlert(null)} />}
      {standDownConfirm && <StandDownConfirm bloodLoss={bloodLoss} onConfirm={handleStandDown} onCancel={() => setStandDownConfirm(false)} />}

      <Header
        elapsed={now - emergencyStartTime}
        bloodLoss={bloodLoss}
        level={level}
        assignedCount={assignedCount}
        showQuickAdd={prompt?.type !== "blood_loss_check"}
        onAddBlood={handleAddBlood}
        onCorrectBlood={handleBloodCorrect}
        onStandDown={() => setStandDownConfirm(true)}
      />

      <DrugStrip
        txaTime={txaTime}
        txaSecondDone={txaSecondDone}
        taskStates={taskStates}
        level={level}
        birthTime={effectiveBirthTime}
        carboCount={carboCount}
        carboLastTime={carboLastTime}
        now={now}
      />

      <ActivePromptArea
        prompt={prompt}
        bloodLoss={bloodLoss}
        level={level}
        carboCount={carboCount}
        assignedCount={assignedCount}
        ivAccessDone={ivAccessDone}
        cardiacArrestPending={!taskStates.cardiac_arrest_ref?.status}
        handlers={handlers}
      />

      <TaskList
        taskStates={taskStates}
        level={level}
        now={now}
        onConfirmTask={handleConfirmTask}
        forcedTasks={forcedTasks}
        txaTime={txaTime}
        emergencyStartTime={emergencyStartTime}
      />
    </div>
  );
}
