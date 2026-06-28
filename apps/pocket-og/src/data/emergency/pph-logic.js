// Pure logic extracted from EmergencyPage.jsx so it can be unit-tested
// independently of React. EmergencyPage.jsx imports everything from here.

import {
  getPphLevel,
  pphLevelVal,
  PPH_LEVEL_ORDER,
  PPH_THRESHOLDS,
  UTEROTONIC_PHARM_DELAY_SEC,
  effectiveUterotonicDelaySec,
  effectiveCarboRepeatDelaySec,
} from "./pph-shared.js";

export { getPphLevel, pphLevelVal, PPH_LEVEL_ORDER, PPH_THRESHOLDS, UTEROTONIC_PHARM_DELAY_SEC };
/** @deprecated Use UTEROTONIC_PHARM_DELAY_SEC from pph-shared.js */
export const PHARM_DELAY_SEC = UTEROTONIC_PHARM_DELAY_SEC;

export function levelVal(l) { return pphLevelVal(l); }
export function getLevel(ml) { return getPphLevel(ml); }

// ─── Task registry ────────────────────────────────────────────────────────────

export const TASKS = [
  // Minor — stabilisation
  { id: "call_team",      level: "minor",   type: "call",     title: "Call for help",                         detail: "• Midwife in charge\n• On-call obstetrician",                                                                                                          followUpDelay: 90 },
  { id: "abc",            level: "minor",   type: "action",   title: "ABC — airway, breathing, circulation",  detail: "Position patient flat\nHigh-flow O₂ 15 L/min via non-rebreather mask — do not wait for SpO₂ to fall in haemorrhage\nAssess for shock — HR, BP, skin perfusion, capillary refill" },
  { id: "iv_access",      level: "minor",   type: "access",   title: "IV access + bloods",                    detail: "1 × 16G IV cannula\nBloods: FBC, coagulation, U&E, group & screen",                                                                                    followUpDelay: 90  },
  { id: "fundal_massage", level: "minor",   type: "action",   title: "Fundal massage",                        detail: "Place hand firmly on fundus\nRub up a contraction — sustained circular massage\nAssess uterine tone immediately after", noDelegate: true, noSkip: true },
  { id: "bimanual",       level: "minor",   type: "action",   title: "Bimanual uterine compression",          detail: "One hand in vagina, one on abdomen\nSustained compression until uterus contracts\nContinue while awaiting uterotonic effect",                               followUpDelay: 90, deps: ["fundal_massage"] },
  // Minor — Trauma
  { id: "trauma_assess",  level: "minor",   type: "action",   title: "Trauma — inspect birth canal",          detail: "Cervix, vagina, perineum — good exposure and lighting",
    assess: { question: "Any laceration, haematoma or genital tract trauma?", excludeLabel: "No — none", excludeLog: "Trauma excluded — no genital tract trauma", excludeListNote: "no lacerations / haematoma", presentLabel: "Yes — present", presentLog: "Trauma identified — proceeding to repair", treatment: "suture" } },
  { id: "suture",         level: "minor",   type: "action",   title: "Suture lacerations / surgical haemostasis", detail: "Suture all visible lacerations\nDirect pressure / pack while awaiting senior\nEscalate to theatre if not controlled",                                  hidden: true, followUpDelay: 300, followUpQuestion: "Trauma bleeding controlled?", followUpYesLog: "Trauma controlled — haemostasis achieved", followUpEscalate: "theatre", followUpEscalateLog: "Trauma not controlled at 5 min — escalating to theatre / EUA" },
  // Minor — Tissue
  { id: "tissue_assess",  level: "minor",   type: "action",   title: "Tissue — check placenta",               detail: "Confirm placenta and membranes complete",
    assess: { question: "Placenta and membranes complete?", excludeLabel: "Yes — complete", excludeLog: "Tissue excluded — placenta complete", excludeListNote: "placenta complete", presentLabel: "No — retained", presentLog: "Retained tissue suspected", presentListNote: "retained tissue", treatment: "manual_removal" } },
  { id: "manual_removal", level: "minor",   type: "action",   title: "Manual removal of retained tissue",     detail: "Manual exploration / removal under anaesthesia\nGive prophylactic antibiotics",                                                                          hidden: true, followUpDelay: 300 },
  { id: "catheterise",    level: "minor",   type: "action",   title: "Catheterise",                           detail: "Urinary catheter — target output >30 ml/hr\nMonitor hourly" },
  { id: "iv_fluids",      level: "minor",   type: "fluid",    title: "IV fluids",                             detail: "IV crystalloid resuscitation (Hartmann's / 0.9% saline)",                                                                                                deps: ["iv_access"] },
  // Minor — uterotonics
  { id: "oxytocin_bolus", level: "minor",   type: "drug",     title: "Oxytocin 5 IU IV",                      detail: "Slowly IV over ~1 minute\nOnly if not already given for active management of third stage",                                                               uterotonic: true },
  { id: "oxytocin_inf",   level: "minor",   type: "drug",     title: "Oxytocin infusion",                     detail: "40 IU in 500 ml Hartmann's at 125 ml/hr IV",                                                                                                             uterotonic: true, deps: ["iv_access"], requiresIv: true },
  { id: "ergometrine",    level: "minor",   type: "drug",     title: "Ergometrine 500 mcg",                   detail: "IM or slow IV\nIf oxytocin alone insufficient",                                                                                                         uterotonic: true, contraindications: ["Hypertension", "Pre-eclampsia", "Cardiac disease", "Obliterative vascular disease"], fallback: "carboprost" },
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

export const UTEROTONIC_ORDER = ["oxytocin_bolus", "oxytocin_inf", "ergometrine", "carboprost", "misoprostol"];
export const IV_ACCESS_MAX_RETRIES = 2;

// ─── Pure helper functions ────────────────────────────────────────────────────

export function considerSnoozeMs(level) {
  if (levelVal(level) >= levelVal("massive")) return 2 * 60 * 1000;
  return 5 * 60 * 1000;
}

export function ivAccessDeadlineMs(level, retries) {
  if (levelVal(level) >= levelVal("massive")) return 90 * 1000;
  if (levelVal(level) >= levelVal("major")) return retries > 0 ? 90 * 1000 : 120 * 1000;
  return 3 * 60 * 1000;
}

export function uterotonicTaken(taskStates, id) {
  const s = taskStates[id]?.status;
  return s === "done" || s === "already_given";
}

export function getLastUterotonic(taskStates) {
  let last = null;
  for (const id of UTEROTONIC_ORDER) {
    if (uterotonicTaken(taskStates, id)) {
      const ts = taskStates[id];
      last = { id, at: ts.doneAt || ts.alreadyGivenAt || 0 };
    }
  }
  return last;
}

export function getNextUterotonic(taskStates, level, forcedTasks) {
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

export function uterotonicLadderExhaustedAtLevel(taskStates, level) {
  if (!getLastUterotonic(taskStates)) return false;
  for (const id of UTEROTONIC_ORDER) {
    const t = TASKS.find(x => x.id === id);
    if (!t || levelVal(t.level) > levelVal(level)) continue;
    const s = taskStates[id]?.status;
    if (!uterotonicTaken(taskStates, id) && s !== "skipped" && s !== "not_indicated") return false;
  }
  return true;
}

export function isBloodCheckEvent(e) {
  return e.kind === "blood_loss" || e.kind === "blood_loss_pending" || e.kind === "blood_loss_correction" || e.kind === "blood_loss_unchanged";
}

export function bloodLossRate(log, now, windowMs = 10 * 60 * 1000) {
  const points = log.filter(e => (e.kind === "blood_loss" || e.kind === "blood_loss_correction") && typeof e.total === "number");
  if (points.length < 2) return 0;
  const latest = points[points.length - 1];
  const cutoff = now - windowMs;
  let ref = points[0];
  for (const p of points) { if (p.time <= cutoff) ref = p; }
  const elapsedMin = (latest.time - ref.time) / 60000;
  if (elapsedMin <= 0) return 0;
  const rateElapsed = Math.max(elapsedMin, 1);
  return Math.max(0, (latest.total - ref.total) / rateElapsed);
}

export function reassessInterval(rate, level) {
  const levelCap = level === "massive" ? 180 : level === "major" ? 240 : 300;
  let rateInterval;
  if (rate >= 150)      rateInterval = 60;
  else if (rate >= 50)  rateInterval = 120;
  else if (rate >= 10)  rateInterval = 180;
  else if (rate >= 1)   rateInterval = 300;
  else                  rateInterval = 420;
  return Math.min(levelCap, rateInterval);
}

export function bleedingSettled(log, now) {
  return bloodLossRate(log, now) < 1;
}

export function hadBloodCheckSince(log, since) {
  return log.some(e => isBloodCheckEvent(e) && e.time > since);
}

export function uterotonicTimingBlocked(last, log, now, uterotonicHold) {
  if (!last) return false;
  const rate = bloodLossRate(log, now);
  const delayMs = effectiveUterotonicDelaySec(last.id, rate) * 1000;
  if (now - last.at < delayMs) return true;
  if (!hadBloodCheckSince(log, last.at)) return true;
  if (uterotonicHold && bleedingSettled(log, now)) return true;
  return false;
}

export function carboRepeatDue(carboLastTime, now, log) {
  const delaySec = effectiveCarboRepeatDelaySec(bloodLossRate(log, now));
  return (now - carboLastTime) / 1000 >= delaySec;
}

export function canEscalateUterotonic({ taskStates, log, now, level, uterotonicHold, forcedTasks }) {
  const next = getNextUterotonic(taskStates, level, forcedTasks);
  if (!next) return null;
  const last = getLastUterotonic(taskStates);
  if (!last) return next;
  if (uterotonicTimingBlocked(last, log, now, uterotonicHold)) return null;
  if (next.requiresIv && taskStates.iv_access?.status !== "done") return null;
  return next;
}

export function withTheatreIfUncontrolledMajor(forcedTasks, taskStates, log, level, bloodLossMl, at) {
  if (levelVal(level) < levelVal("major")) return forcedTasks;
  if (bloodLossMl < PPH_THRESHOLDS.theatreForce) return forcedTasks;
  if (taskStates.theatre?.status) return forcedTasks;
  if (!uterotonicLadderExhaustedAtLevel(taskStates, level)) return forcedTasks;
  if (bloodLossRate(log, at) < 10) return forcedTasks;
  if (forcedTasks.includes("theatre")) return forcedTasks;
  return [...forcedTasks, "theatre"];
}

export function depSatisfied(depId, taskStates) {
  const status = taskStates[depId]?.status;
  if (depId === "iv_access") return status === "done";
  return ["done", "skipped"].includes(status);
}

export function txaEligible(taskStates, level, txaTime) {
  const s = taskStates.txa?.status;
  if (s === "done" || s === "already_given" || txaTime) return false;
  return levelVal(level) >= levelVal("major");
}

export function effectiveTaskStatus(id, taskStates, level, txaTime) {
  const s = taskStates[id]?.status ?? null;
  if (id === "txa" && s === "skipped" && txaEligible(taskStates, level, txaTime)) return null;
  return s;
}

export function stabilisationCallId(level) {
  if (levelVal(level) >= levelVal("massive")) return "call_massive";
  if (levelVal(level) >= levelVal("major")) return "call_major";
  return "call_team";
}

export function ivAccessFollowUpHeld(task, taskStates, now, ivAccessPendingSince, level, ivAccessRetries) {
  if (task.id !== "iv_access" || taskStates.iv_access?.status !== "assigned") return false;
  if (!ivAccessPendingSince) return false;
  return (now - ivAccessPendingSince) < ivAccessDeadlineMs(level, ivAccessRetries);
}

export function followUpAnchor(task, taskStates) {
  const ts = taskStates[task.id];
  if (!ts || !task.followUpDelay) return null;
  if (ts.status === "assigned") return ts.assignedAt;
  if (ts.status === "done" && task.followUpQuestion && ts.followUpAt) return ts.followUpAt;
  return null;
}

export function taskCriticalForFollowUp(task, level) {
  if (task.critical) return true;
  if (task.id === "iv_access" && levelVal(level) >= levelVal("major")) return true;
  return false;
}

export function taskCriticalForQueue(task) {
  return !!task.critical;
}

export function countMonitoringPending({ taskStates, level, forcedTasks, txaTime }) {
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

// ─── Main prompt engine ───────────────────────────────────────────────────────

export function computeNextPrompt({ taskStates, level, toneAssessed, log, txaTime, txaHandled, txaSecondDone, effectiveBirthTime, carboCount, carboLastTime, ciCleared, forcedTasks, now, uterotonicHold, uterotonicEscalate, queuedUterotonicId, ivAccessPendingSince, ivAccessRetries, infusionReassess, sessionRecoveredAt, forcedFollowUpId }) {
  function depsOk(task) {
    return (task.deps || []).every(id => depSatisfied(id, taskStates));
  }
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

  // Priority 1 — IV attempt window expired → IM route
  if (taskStates.iv_access?.status !== "done" && ivAccessPendingSince) {
    const windowMs = ivAccessDeadlineMs(level, ivAccessRetries);
    if (now - ivAccessPendingSince >= windowMs) {
      const imOpts = ["ergometrine", "carboprost", "misoprostol"].filter(id => {
        const t = TASKS.find(x => x.id === id);
        return t && levelVal(t.level) <= levelVal(level) && !uterotonicTaken(taskStates, id) && taskStates[id]?.status !== "skipped";
      });
      return { type: "iv_fail", imOptions: imOpts.map(id => TASKS.find(x => x.id === id)), retries: ivAccessRetries, maxRetries: IV_ACCESS_MAX_RETRIES, windowMs, level };
    }
  }

  // Priority 1.04 — cardiac arrest check
  if ((forcedTasks || []).includes("cardiac_arrest_ref")) {
    const arrestTask = TASKS.find(x => x.id === "cardiac_arrest_ref");
    if (arrestTask && st("cardiac_arrest_ref") == null) return gate(arrestTask);
  }

  // Priority 1.05 — user tapped an assigned row
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
    if (overdue >= 0 && overdue >= bestCritOverdue) { bestCritOverdue = overdue; bestCritFollowup = t; }
  }
  if (bestCritFollowup) return { type: "followup", task: bestCritFollowup };

  // Priority 1.5 — tone assessment after fundal massage
  const fundalStatus = taskStates["fundal_massage"]?.status;
  if ((fundalStatus === "done" || fundalStatus === "skipped") && !toneAssessed) return { type: "tone_check" };

  // Priority 1.75 — force-activated fallbacks/treatments
  const forced = nextForcedTask();
  if (forced) return forced;

  // Priority 1.85 — IV just established → reassess infusion need
  if (infusionReassess && taskStates.iv_access?.status === "done" && !uterotonicTaken(taskStates, "oxytocin_inf") && taskStates.oxytocin_inf?.status !== "not_indicated") {
    return { type: "infusion_reassess" };
  }

  // Priority 1.9 — queued uterotonic
  if (queuedUterotonicId) {
    const qt = TASKS.find(x => x.id === queuedUterotonicId);
    if (qt && st(qt.id) == null && depsOk(qt)) return gate(qt);
  }

  // Priority 2.2 — uterotonic escalation offer
  if (uterotonicEscalate) {
    const last = getLastUterotonic(taskStates);
    return { type: "uterotonic_escalate", nextTask: uterotonicEscalate, sinceTitle: last ? TASKS.find(x => x.id === last.id)?.title : null };
  }

  // Priority 2 — blood loss check
  const blRate = bloodLossRate(log, now);
  const blInterval = reassessInterval(blRate, level);
  const lastCheck = [...log].reverse().find(isBloodCheckEvent);
  const checkAnchor = Math.max(lastCheck?.time ?? 0, sessionRecoveredAt ?? 0);
  if (lastCheck && (now - checkAnchor) / 1000 > blInterval) return { type: "blood_loss_check", rate: blRate, interval: blInterval };

  // Priority 4 — non-critical follow-ups
  let bestFollowup = null;
  let bestOverdue = 0;
  for (const t of TASKS) {
    if (!relevant(t) || !t.followUpDelay || taskCriticalForFollowUp(t, level)) continue;
    if (ivAccessFollowUpHeld(t, taskStates, now, ivAccessPendingSince, level, ivAccessRetries)) continue;
    const anchor = followUpAnchor(t, taskStates);
    if (anchor == null) continue;
    const overdue = (now - anchor) / 1000 - t.followUpDelay;
    if (overdue >= 0 && overdue >= bestOverdue) { bestOverdue = overdue; bestFollowup = t; }
  }
  if (bestFollowup) return { type: "followup", task: bestFollowup };

  // Priority 4.9 — stabilisation trio
  for (const id of [stabilisationCallId(level), "abc", "iv_access"]) {
    const t = TASKS.find(x => x.id === id);
    if (!t || !relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    return gate(t);
  }

  // Priority 5 — critical unstarted tasks, highest level first
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

  // Priority 6 — carboprost repeat dose (rate-scaled interval)
  const carboActive = carboCount > 0 && carboLastTime;
  if (carboActive && carboCount < 8 && carboRepeatDue(carboLastTime, now, log)) {
    return { type: "carbo_dose" };
  }

  // Priority 6.5 — TXA second dose
  if (txaTime && !txaSecondDone && levelVal(level) >= levelVal("major")) {
    const sinceFirst = (now - txaTime) / 1000;
    const windowOpen = effectiveBirthTime + 3 * 60 * 60 * 1000 > now;
    if (sinceFirst >= 30 * 60 && windowOpen) return { type: "txa_second" };
  }

  // Priority 7 — next regular task
  for (const t of TASKS) {
    if (t.consider) continue;
    if (!relevant(t) || st(t.id) !== null || !depsOk(t)) continue;
    if (t.hidden && !(forcedTasks || []).includes(t.id)) continue;
    if (t.special === "txa" && !txaEligible(taskStates, level, txaTime)) continue;
    if (t.special === "carbo" && carboCount > 0 && carboLastTime) continue;
    if (toneGate(t)) continue;
    if (t.uterotonic) {
      const nextUt = getNextUterotonic(taskStates, level, forcedTasks);
      if (!nextUt || t.id !== nextUt.id) continue;
      const last = getLastUterotonic(taskStates);
      if (last && uterotonicTimingBlocked(last, log, now, uterotonicHold)) continue;
    }
    return gate(t);
  }

  // Priority 7.5 — massive escalation considerations
  if (levelVal(level) >= levelVal("massive")) {
    for (const t of TASKS) {
      if (!t.consider || t.considerArrestCheck || !relevant(t) || st(t.id) !== null || considerSnoozed(t.id)) continue;
      if (toneGate(t)) continue;
      return gate(t);
    }
  }

  // Cardiac arrest check at massive if ABC done
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
