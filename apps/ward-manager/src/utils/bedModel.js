// Bed data helpers. The stored bed shape is unchanged from earlier versions, so
// boards already saved on a phone keep working.

import { MIN } from "./time";
import { classifyCTGEntry } from "@pocket-og/guidelines";
import { getUnitSettings } from "../data/unitSettings";

export const STAGES = ["Latent", "Active first stage", "Passive second stage", "Active second stage"];
export const STAGE_SHORT = {
  "Latent": "Latent",
  "Active first stage": "Active 1st",
  "Passive second stage": "Fully, passive",
  "Active second stage": "Pushing",
};
export const STAGE_HINT = {
  "Latent": "under 4 cm",
  "Active first stage": "4 cm or more",
  "Passive second stage": "no urge to push",
  "Active second stage": "active 2nd stage",
};

// Exact parity; higher numbers come from the Custom stepper. Older boards may
// hold "Para 3+" or "Para 2+", which still display.
export const PARITIES = ["Para 0", "Para 1", "Para 2", "Para 3"];
export const BIRTH_MODES = ["SVD", "Instrumental", "Emergency CS", "Elective CS"];
export const BIRTH_SHORT = { SVD: "SVD", Instrumental: "Instr", "Emergency CS": "Em CS", "Elective CS": "El CS" };
// Risk flags, grouped for the Admit dropdown. `value` is what is stored (older
// values are kept so existing boards still work); `effect` says what the flag
// does in the app: "alert" raises its own alert, "CTG" counts as a continuous
// CTG indication, "handover" is recorded for handover only.
export const RISK_GROUPS = [
  { group: "Infection and GBS", items: [
    { value: "GBS+", label: "GBS positive this pregnancy", short: "GBS+", effect: "alert" },
    { value: "GBS previous baby", label: "Previous baby with GBS disease", short: "GBS prev baby", effect: "alert" },
    { value: "GBS previous pregnancy", label: "GBS in a previous pregnancy", short: "GBS prev preg", effect: "alert" },
    { value: "GBS negative 35-37", label: "Negative GBS swab at 35 to 37 weeks", short: "GBS neg swab", effect: "handover" },
    { value: "Infection suspected", label: "Suspected chorioamnionitis or sepsis", short: "Infection", effect: "alert" },
  ] },
  { group: "Diabetes", items: [
    { value: "Diabetic-T1", label: "Type 1 diabetes", short: "T1DM", effect: "alert" },
    { value: "Diabetic-T2", label: "Type 2 diabetes", short: "T2DM", effect: "alert" },
    { value: "Diabetic-GDM", label: "Gestational diabetes on medication", short: "GDM (meds)", effect: "alert" },
    { value: "Diabetic-GDM diet", label: "Gestational diabetes, diet only", short: "GDM (diet)", effect: "alert" },
  ] },
  { group: "Blood pressure", items: [
    { value: "Hypertensive", label: "Hypertension on medication", short: "HTN", effect: "alert" },
    { value: "Pre-eclampsia", label: "Pre-eclampsia", short: "PET", effect: "alert" },
    { value: "Eclampsia", label: "Eclamptic fit (now or earlier this pregnancy)", short: "Eclampsia", effect: "alert" },
  ] },
  { group: "Uterus", items: [
    { value: "Previous LSCS", label: "Previous caesarean", short: "Prev CS", effect: "CTG" },
    { value: "Other uterine scar", label: "Other full-thickness uterine scar", short: "Uterine scar", effect: "CTG" },
  ] },
  { group: "Baby", items: [
    { value: "FGR", label: "Growth restriction or high-risk SGA", short: "FGR/SGA", effect: "CTG" },
    { value: "Reduced fetal movements", label: "Reduced movements in the 24 h before labour", short: "RFM", effect: "CTG" },
    { value: "Non-cephalic", label: "Breech or other non-cephalic", short: "Breech", effect: "CTG" },
    { value: "Liquor volume", label: "Polyhydramnios or anhydramnios", short: "Poly/anhydram", effect: "CTG" },
  ] },
  { group: "Bleeding", items: [
    { value: "APH", label: "Antepartum or fresh bleeding", short: "Bleeding", effect: "alert" },
  ] },
  { group: "For handover", items: [
    { value: "Twins", label: "Twins", short: "Twins", effect: "handover" },
    { value: "BMI 40+", label: "BMI 40 or more", short: "BMI 40+", effect: "handover" },
    { value: "Previous PPH", label: "Previous PPH", short: "Prev PPH", effect: "handover" },
    { value: "Previous shoulder dystocia", label: "Previous shoulder dystocia", short: "Prev SD", effect: "handover" },
    { value: "Previous OASI", label: "Previous 3rd or 4th degree tear", short: "Prev OASI", effect: "handover" },
  ] },
];
const RISK_BY_VALUE = Object.fromEntries(RISK_GROUPS.flatMap(g => g.items).map(i => [i.value, i]));
// Older stored values that are no longer offered.
RISK_BY_VALUE["VBAC"] = { value: "VBAC", label: "VBAC", short: "VBAC", effect: "CTG" };
RISK_BY_VALUE["GBS previous"] = { value: "GBS previous", label: "GBS in a previous baby or pregnancy", short: "GBS prev", effect: "alert" };
RISK_BY_VALUE["GBS pending"] = { value: "GBS pending", label: "GBS result pending", short: "GBS pending", effect: "handover" };
export const RISK_FLAGS = Object.keys(RISK_BY_VALUE);

/** Display label for a stored risk value; typed "Other" risks show as typed. */
export function riskLabel(v) { return RISK_BY_VALUE[v]?.label ?? v; }
export function riskShort(v) { return RISK_BY_VALUE[v]?.short ?? v; }
export function riskEffect(v) { return RISK_BY_VALUE[v]?.effect ?? "handover"; }

export function isHypertensiveBed(bed) {
  const f = bed.riskFlags ?? [];
  return f.includes("Hypertensive") || f.includes("Pre-eclampsia") || f.includes("Eclampsia");
}
export const ANALGESIA = ["None", "Entonox", "Pethidine", "Epidural", "Remifentanil PCA"];
export const ONSETS = ["Spontaneous", "Induced", "PPROM"];
export const IND_METHODS = ["Dinoprostone", "Balloon", "Misoprostol", "ARM+Synto"];
export const MEMBRANES = ["Intact", "SROM", "AROM"];
export const LIQUORS = ["Clear", "Thin meconium", "Thick meconium", "Blood-stained", "Absent"];
export const LIQUOR_SHORT = {
  "Clear": "Clear", "Thin meconium": "Mec: thin", "Thick meconium": "Mec: thick",
  "Blood-stained": "Blood-stained", "Absent": "Absent",
};
export const DELIVERY_MODES = ["SVD", "Ventouse", "Forceps", "Em LSCS", "El LSCS"];
export const IOL_REASONS = [
  "Post-dates", "PROM at term", "Gestational diabetes", "Pre-eclampsia / hypertension",
  "Suspected FGR", "Reduced fetal movements", "Obstetric cholestasis", "Previous stillbirth",
  "Maternal request", "Other",
];

/** "Para 0" → "P0". Older boards stored "Para 2+". */
export function parityShort(p) {
  if (!p) return "P?";
  return p.replace("Para ", "P");
}

/**
 * Gestation typed as digits: "394" → 39+4, "39" → 39+0. Anything else
 * (letters, "+") is ignored. Valid range 22+0 to 43+0.
 */
export function gestFromDigits(input) {
  // Keep a digit only if the gestation can still end up between 22+0 and
  // 43+0, so an impossible value can never be typed in the first place.
  const possible = d => {
    if (d.length >= 1 && !"234".includes(d[0])) return false;
    if (d.length >= 2) { const w = Number(d.slice(0, 2)); if (w < 22 || w > 43) return false; }
    if (d.length === 3) { const day = Number(d[2]); if (day > 6 || (d.startsWith("43") && day > 0)) return false; }
    return true;
  };
  let digits = "";
  for (const ch of String(input ?? "").replace(/\D/g, "")) {
    if (digits.length < 3 && possible(digits + ch)) digits += ch;
  }
  if (digits.length < 2) return { digits, w: null, d: null, valid: false };
  const w = Number(digits.slice(0, 2));
  const d = digits.length === 3 ? Number(digits[2]) : 0;
  const inRange = w >= 22 && (w < 43 || (w === 43 && d === 0));
  return { digits, w, d, valid: inRange && d <= 6 };
}

/** "Para 4" → 4; null if unknown. */
export function parityNum(p) {
  const m = /Para (\d+)/.exec(p ?? "");
  return m ? Number(m[1]) : null;
}

/** Previous births in order, short form: "SVD, Em CS". Empty if none recorded. */
export function birthHistory(bed) {
  return (bed.prevBirths ?? []).filter(Boolean).map(b => BIRTH_SHORT[b] ?? b).join(", ");
}

/** "P2 (SVD, Em CS)" when the births are recorded, else "P2". */
export function parityWithHistory(bed) {
  const h = birthHistory(bed);
  return h ? `${parityShort(bed.parity)} (${h})` : parityShort(bed.parity);
}

export function stageLabel(bed) {
  if (bed.delivery) return "Delivered";
  return STAGE_SHORT[bed.labourStage] ?? bed.labourStage ?? "No stage";
}

export function stationLabel(s) {
  if (s == null) return "?";
  return s > 0 ? `+${s}` : String(s);
}

/** "7 cm, station -1, breech" with unrecorded findings left out. */
export function veFindings(ve) {
  return [
    `${ve.dilation} cm`,
    ve.station != null ? `station ${stationLabel(ve.station)}` : null,
    ve.presentation && ve.presentation !== "Cephalic" ? ve.presentation.toLowerCase() : null,
  ].filter(Boolean).join(", ");
}

/** Current membrane status: from the latest VE that recorded it, else from admission. */
export function membraneStatus(bed) {
  const ves = sortedVEs(bed);
  const v = [...ves].reverse().find(x => x.membranes);
  const status = v?.membranes ?? bed.membranes ?? null;
  const time = [...ves].reverse().find(x => x.membranesTime)?.membranesTime ?? bed.membranesTime ?? null;
  const liquor = v ? v.liquor ?? null : bed.liquor ?? null;
  return { status, time: status && status !== "Intact" ? time : null, liquor: status && status !== "Intact" ? liquor : null };
}

/** Last recorded non-cephalic presentation, for the board tag. */
export function malpresentation(bed) {
  const ve = lastVE(bed);
  if (ve?.presentation) return ve.presentation !== "Cephalic" ? ve.presentation : null;
  return (bed.riskFlags ?? []).includes("Non-cephalic") ? "Breech" : null;
}

export function sortedVEs(bed) {
  return [...(bed.ves ?? [])].sort((a, b) => new Date(a.time) - new Date(b.time));
}

export function lastVE(bed) {
  const v = sortedVEs(bed);
  return v.length ? v[v.length - 1] : null;
}

export function lastCTG(bed) {
  const log = bed.ctgLog ?? [];
  return log.length ? log[log.length - 1] : null;
}

// The fetal heart features a graded CTG review records, carried forward by
// "CTG unchanged". Contractions are not: they are counted afresh each time
// (oxytocin is titrated against them, NG235 1.8.54).
const CTG_FEATURES = ["baselineHR", "baselineUndetermined", "variability", "variabilityMinutes", "decelerations",
  "decelerationsRepetitive", "decelerationMinutes", "accelerations"];

/**
 * "CTG unchanged": a new review at `iso` with the same fetal heart features as
 * the last graded review, plus this review's contraction count `contractions`
 * (left out when not given, for previewing). Offered only when that review was
 * normal (and not a clinician override), and only if the copy still grades
 * normal now (a rise in the active second stage, for example, would not).
 * Otherwise null, and the full form is used.
 */
export function sameAsLastCTG(bed, iso, contractions = null) {
  const log = bed.ctgLog ?? [];
  const graded = log.filter(e => e.baselineHR != null || e.baselineUndetermined);
  const last = graded.at(-1);
  if (!last || log.at(-1) !== last || last.classification !== "normal" || last.clinicianOverride) return null;
  const entry = { id: newId("ctg"), time: iso, sameAsLast: true };
  for (const k of CTG_FEATURES) if (last[k] !== undefined) entry[k] = last[k];
  if (contractions != null) entry.contractionsPerTen = contractions;
  const start = graded.find(e => e.baselineHR != null && !e.baselineUndetermined)?.baselineHR ?? null;
  const cat = classifyCTGEntry(entry, last.baselineHR ?? null, { startBaselineHR: start, activeSecondStage: bed.labourStage === "Active second stage" });
  if (cat !== "normal") return null;
  return { ...entry, classification: cat, autoClassification: cat };
}

/** The running oxytocin entry, or null if never started or stopped (dose 0). */
export function currentOxytocin(bed) {
  const log = bed.oxytocinLog ?? [];
  const last = log.length ? log[log.length - 1] : null;
  return last && !last.stopped && last.dose > 0 ? last : null;
}

export function isDiabetic(bed) {
  return (bed.riskFlags ?? []).some(f => f.startsWith("Diabetic"));
}

/** Obs the board tracks as dots, with the refresh interval in minutes. */
export function obsItems(bed) {
  const hypertensive = isHypertensiveBed(bed);
  return [
    { key: "lastPulse", name: "pulse", letter: "P", label: "Pulse", unit: "bpm", limit: 60, valueKey: "pulseValue", type: "int" },
    { key: "lastBP", name: "bp", letter: "B", label: "BP", unit: "mmHg", limit: hypertensive ? 60 : 240, type: "bp" },
    { key: "lastTemp", name: "temp", letter: "T", label: "Temp", unit: "°C", limit: 240, valueKey: "tempValue", type: "float" },
    { key: "lastRR", name: "rr", letter: "R", label: "Resp rate", unit: "/min", limit: 240, valueKey: "rrValue", type: "int" },
    ...(isDiabetic(bed) ? [{ key: "lastBGL", name: "bgl", letter: "G", label: "BGL", unit: "mmol/L", limit: 60, valueKey: "bglValue", type: "float" }] : []),
  ];
}

/** "done" = recorded within its interval; "due" = never or overdue. */
export function obsStatus(bed, now = Date.now()) {
  const obs = bed.observations ?? {};
  return obsItems(bed).map(it => {
    const t = obs[it.key] ? new Date(obs[it.key]).getTime() : null;
    return { ...it, at: t, done: t != null && now - t < it.limit * MIN };
  });
}

export function obsTracked(bed) {
  return !bed.delivery && (bed.labourStage === "Active first stage" || bed.labourStage === "Passive second stage" || bed.labourStage === "Active second stage");
}

// ─── State transitions (pure: bed in, partial update out) ────────────────

/**
 * Add a new VE. A save with the same time and findings as an existing VE is a
 * double tap and is ignored; anything else is saved, even at the same minute.
 * Returns { updates, duplicate }.
 */
export function addVE(bed, ve) {
  const ves = bed.ves ?? [];
  const duplicate = ves.some(v => v.time === ve.time && v.dilation === ve.dilation && v.station === ve.station);
  if (duplicate) return { updates: {}, duplicate: true };
  const updates = { ves: [...ves, ve] };
  if (ve.membranes === "AROM" && !bed.armTime) updates.armTime = ve.membranesTime;
  return { updates, duplicate: false };
}

/**
 * Stage the clinician may want to move to after this dilation. Only offered,
 * never applied automatically: established labour also needs regular contractions.
 */
export function suggestedStage(bed, dilation) {
  const idx = STAGES.indexOf(bed.labourStage);
  if (dilation >= 10 && idx < 2) return "Passive second stage";
  if (dilation >= 4 && idx < 1) return "Active first stage";
  return null;
}

export function editVE(bed, ve) {
  return { ves: (bed.ves ?? []).map(v => (v.id === ve.id ? ve : v)) };
}

export function deleteVE(bed, id) {
  return { ves: (bed.ves ?? []).filter(v => v.id !== id) };
}

// Observation values and the time each was taken. Stamping a check as done
// never deletes a value: an abnormal reading keeps alerting (with its age)
// until a newer value replaces it, so a one-tap "done" cannot hide it.
const OBS_FIELDS = {
  pulse: { stamp: "lastPulse", values: ["pulseValue"], at: "pulseAt", prev: "pulsePrev", prevAt: "pulsePrevAt" },
  bp: { stamp: "lastBP", values: ["bpSystolic", "bpDiastolic"], at: "bpAt" },
  temp: { stamp: "lastTemp", values: ["tempValue"], at: "tempAt" },
  rr: { stamp: "lastRR", values: ["rrValue"], at: "rrAt", prev: "rrPrev", prevAt: "rrPrevAt" },
  bgl: { stamp: "lastBGL", values: ["bglValue"], at: "bglAt" },
};

export function stampObs(bed, iso, keys = ["lastPulse", "lastBP", "lastTemp", "lastRR"]) {
  const observations = { ...(bed.observations ?? {}) };
  keys.forEach(k => { if (!observations[k] || observations[k] < iso) observations[k] = iso; });
  return { observations };
}

/**
 * Record observation values taken at `iso`, e.g. { pulse: "92", bp: ["150", "95"], temp: "37.4" }.
 * Each value replaces the stored one only if it is at least as recent.
 */
// Plausible ranges for typed values: outside them the value is almost
// certainly a typo (383 for 38.3), so the sheet asks for it to be checked.
export const OBS_RANGE = {
  pulse: [[25, 250, "Pulse"]],
  temp: [[30, 43, "Temperature"]],
  rr: [[4, 70, "Respiratory rate"]],
  bp: [[50, 280, "Systolic"], [20, 180, "Diastolic"]],
  bgl: [[0.5, 40, "Glucose"]],
};
/** null if every value is plausible, else a message naming the first problem. */
export function obsProblem(name, raw) {
  const vals = Array.isArray(raw) ? raw : [raw];
  const ranges = OBS_RANGE[name] ?? [];
  for (let i = 0; i < vals.length; i++) {
    const r = ranges[i]; const v = vals[i];
    if (!r || v == null || String(v).trim() === "") continue;
    const n = parseFloat(v);
    if (!Number.isFinite(n) || n < r[0] || n > r[1]) return `${r[2]} ${v} looks wrong (expected ${r[0]} to ${r[1]}). Check and re-enter.`;
  }
  if (name === "bp" && vals.length === 2 && parseFloat(vals[0]) <= parseFloat(vals[1])) return "Systolic must be higher than diastolic. Check and re-enter.";
  return null;
}

export function recordObs(bed, iso, entries) {
  const observations = { ...(bed.observations ?? {}) };
  for (const [name, raw] of Object.entries(entries)) {
    const f = OBS_FIELDS[name];
    const vals = Array.isArray(raw) ? raw : [raw];
    if (!f || vals.some(v => v == null || String(v).trim() === "")) continue;
    if (!observations[f.stamp] || observations[f.stamp] < iso) observations[f.stamp] = iso;
    const prevAt = observations[f.at] ?? observations[f.stamp];
    if (prevAt && prevAt > iso && observations[f.values[0]] != null) continue;
    // Pulse and RR keep the reading before, so a repeat can confirm it (NG235 1.8.20).
    if (f.prev && observations[f.values[0]] != null && prevAt) {
      observations[f.prev] = observations[f.values[0]];
      observations[f.prevAt] = prevAt;
    }
    f.values.forEach((k, i) => { observations[k] = String(vals[i]).trim(); });
    observations[f.at] = iso;
    if (name === "bp") {
      // Keep the worst BP and the last severe reading, so a lower repeat does not hide them.
      const [sys, dia] = vals.map(v => parseFloat(v));
      if (sys >= 160 || dia >= 110) observations.bpSevereAt = iso;
      const w = observations.bpWorst;
      if (!w || sys > w.sys || (sys === w.sys && dia > w.dia)) observations.bpWorst = { sys, dia, at: iso };
    }
  }
  return { observations };
}

/** When a value was taken: its own time, or (older boards) its check stamp. */
export function obsValueAt(obs, name) {
  const f = OBS_FIELDS[name];
  return obs?.[f.at] ?? obs?.[f.stamp] ?? null;
}

export function setStage(bed, stage, iso) {
  const u = { labourStage: stage };
  const idx = STAGES.indexOf(stage);
  // Going back a stage clears the start times of the later stages, so re-entering
  // them later starts a fresh clock instead of reusing the mistaken one.
  if (idx < 1) u.activeFirstStageStartTime = null;
  if (idx < 2) u.passiveStartTime = null;
  if (idx < 3) u.pushingStartTime = null;
  if (stage === "Active first stage" && !bed.activeFirstStageStartTime) u.activeFirstStageStartTime = iso;
  if (stage === "Passive second stage" && !bed.passiveStartTime) u.passiveStartTime = iso;
  if (stage === "Active second stage" && !bed.pushingStartTime) u.pushingStartTime = iso;
  return u;
}

// Alerts that a tap can clear: a stored "done" flag, or an obs stamp.
// What each done flag means, for the bed record and handover.
export const DONE_LABEL = {
  gbsAntibioticsStarted: "Intrapartum antibiotics given",
  broadAntibioticsStarted: "Antibiotics for suspected infection given",
  pphReviewed: "PPH reviewed",
  bleedingReviewed: "Bleeding reviewed",
  neonatalTeamAlerted: "Neonatal team alerted",
  mgso4Given: "MgSO4 (neuroprotection) given",
  corticosteroidsConfirmed: "Steroids given",
  tocolysisOffered: "Tocolysis offered",
  mgso4PETGiven: "MgSO4 (eclampsia) given",
  mgso4PETAssessed: "Severe pre-eclampsia features assessed",
  gbsBirthOffered: "Immediate birth offered (GBS, ruptured membranes)",
};

export const PERSISTENT_FLAGS = {
  "gbs-iap": { field: "gbsAntibioticsStarted", label: "Antibiotics given" },
  "preterm-neonatal": { field: "neonatalTeamAlerted", label: "Done" },
  "preterm-mgso4": { field: "mgso4Given", label: "Given" },
  "preterm-steroids": { field: "corticosteroidsConfirmed", label: "Given" },
  "preterm-tocolysis": { field: "tocolysisOffered", label: "Offered" },
  "iap-preterm": { field: "gbsAntibioticsStarted", label: "Antibiotics given" },
  "prom-48h": { field: "gbsAntibioticsStarted", label: "Antibiotics given" },
  "infection-suspected": { field: "broadAntibioticsStarted", label: "Antibiotics given" },
  "aph": { field: "bleedingReviewed", label: "Reviewed" },
  "mgso4-eclampsia": { field: "mgso4PETGiven", label: "Given" },
  "gbs-prom-birth": { field: "gbsBirthOffered", label: "Offered" },
  "mgso4-severe-pet": { field: "mgso4PETAssessed", label: "Assessed" },
};
export const OBS_STAMP = {
  "pulse-never": "lastPulse", "pulse-due": "lastPulse",
  "bp-never": "lastBP", "bp-due": "lastBP",
  "temp-never": "lastTemp", "temp-due": "lastTemp",
  "rr-never": "lastRR", "rr-due": "lastRR",
  "bgl-never": "lastBGL", "bgl-due": "lastBGL",
};

/**
 * Alerts a clinician can mark "Reviewed" (minutes the alert stays quiet). It
 * returns after the window if the problem is still there, or at once if a newer
 * record (a new CTG, a new obs value) arrives. Severe BP and pathological CTG
 * use 30 min: NG133 1.7.3 (BP every 15 to 30 min) and a prompt re-review.
 */
// How long a Reviewed alert stays quiet: each alert belongs to a group whose
// time is a unit setting (Unit settings, "Reviewed alerts").
export const REVIEW_GROUP = {
  "rr-low": "reviewFastMin",
  "ctg-pathological": "reviewUrgentMin", "ctg-suspicious-overdue": "reviewUrgentMin", "hyperstim": "reviewUrgentMin",
  "bp-severe": "reviewUrgentMin", "bp-low": "reviewUrgentMin", "tachycardia": "reviewUrgentMin", "rr-high": "reviewUrgentMin",
  "bgl-low": "reviewUrgentMin", "bgl-high": "reviewUrgentMin", "pushing-reassess": "reviewUrgentMin",
  "pph": "reviewHourMin", "bp-elevated": "reviewHourMin", "temp-38": "reviewHourMin", "temp-375": "reviewHourMin", "temp-low": "reviewHourMin",
  "oliguria": "reviewHourMin", "oxytocin-max": "reviewHourMin", "passive-limit": "reviewHourMin",
  "pushing-senior-review": "reviewHourMin", "liquor-blood": "reviewHourMin",
  "slow-progress": "reviewProgressMin", "oxytocin-poor-progress": "reviewProgressMin", "arm-reassess": "reviewProgressMin",
  "active-phase-limit": "reviewLongMin", "latent-reassess": "reviewLongMin", "prom-24h": "reviewLongMin",

  "mec-thick": "reviewLongMin", "mec-thin": "reviewLongMin", "liquor-absent": "reviewLongMin",
};

/** Minutes a Reviewed alert stays quiet, or null if it cannot be reviewed (or Reviewed is off). */
export function reviewMinutes(alertId, unit = getUnitSettings()) {
  const key = REVIEW_GROUP[alertId];
  return key && unit.reviewOn ? unit[key] : null;
}

// Alerts whose button does something rather than record it: the screen opens
// the right sheet (stopping oxytocin is logged in the oxytocin sheet).
export const ACTION_ALERTS = { "oxytocin-stop-pathological": "Stop oxytocin" };

// "Is she still here?": Still here stamps the record (restarting the clock);
// the second button, Not here, opens her full record to remove or update her.
export const STILL_HERE = "bed-stale";

// "Discuss / consider" prompts that can be answered "not given", so the
// handover never reads as given when it was decided against.
export const DECLINABLE = new Set(["preterm-mgso4", "preterm-steroids"]);
export const declinedField = alertId => DECLINABLE.has(alertId) ? `${PERSISTENT_FLAGS[alertId].field}Declined` : null;
export function declineAlert(alertId, iso, by = null) {
  const f = declinedField(alertId);
  return f ? { [f]: true, [`${f}At`]: iso, ...(by ? { [`${f}By`]: by } : {}) } : {};
}

export function fixLabel(alertId) {
  if (alertId === STILL_HERE) return "Still here";
  if (ACTION_ALERTS[alertId]) return ACTION_ALERTS[alertId];
  if (PERSISTENT_FLAGS[alertId]) return PERSISTENT_FLAGS[alertId].label;
  if (OBS_STAMP[alertId]) return "Done";
  if (reviewMinutes(alertId)) return "Reviewed";
  return null;
}

export function fixAlert(bed, alertId, iso, by = null) {
  if (alertId === STILL_HERE) return { confirmedHereAt: iso };
  if (ACTION_ALERTS[alertId]) return {};
  if (PERSISTENT_FLAGS[alertId]) {
    const f = PERSISTENT_FLAGS[alertId].field;
    return { [f]: true, [`${f}At`]: iso, ...(by ? { [`${f}By`]: by } : {}) };
  }
  if (OBS_STAMP[alertId]) return stampObs(bed, iso, [OBS_STAMP[alertId]]);
  if (reviewMinutes(alertId)) return { reviews: { ...(bed.reviews ?? {}), [alertId]: { at: iso, by } } };
  return {};
}

/** "Dr Shah", or just "Doctor" when no name was given. */
export function doctorLabel(name) {
  const n = String(name ?? "").trim();
  return n && n !== "Doctor" ? `Dr ${n}` : "Doctor";
}

export function capitalise(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
