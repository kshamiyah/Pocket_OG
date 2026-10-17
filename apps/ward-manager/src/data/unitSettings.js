// Unit settings: the local choices a unit can set for itself. Every rule the
// Rules and sources page marks as "local" that has a number or a yes/no behind
// it lives here. Defaults are the app's starting point, not national guidance;
// the "nice" line says what NICE (or the cited guideline) says instead.
//
// Settings are stored on this phone only (localStorage), like the board.

const KEY = "pocketog_suite_unit_v1";

export const UNIT_SETTINGS = [
  {
    key: "ctgForAll", type: "bool", default: true, group: "Fetal monitoring",
    label: "Continuous CTG for every woman in established labour",
    help: "On: hourly CTG review reminders for every woman in established labour or on oxytocin. Off: only when a NICE indication applies.",
    nice: "NICE offers intermittent auscultation to women at low risk (NG229 1.2.9) and continuous CTG when an indication applies (NG229 1.3.2 to 1.3.8).",
  },
  {
    key: "ctgLocalIndications", type: "bool", default: true, group: "Fetal monitoring",
    label: "Count preterm, GBS and PPROM as CTG indications",
    help: "Only matters when the setting above is off.",
    nice: "Not NG229 indications.",
  },
  {
    key: "meconiumCTGMandatory", type: "bool", default: true, group: "Fetal monitoring",
    label: "Continuous CTG mandatory with meconium",
    help: "On: meconium alerts say continuous CTG is required. Off: they say offer it.",
    nice: "NICE: offer continuous CTG and support the woman's choice (NG229 1.3.8, 1.3.11).",
  },
  {
    key: "suspiciousRecheckMin", type: "number", default: 30, min: 10, max: 60, step: 5, unit: "min", group: "Fetal monitoring",
    label: "Reassess a suspicious CTG within",
    help: "After this, the suspicious CTG alert turns urgent.",
    nice: "NICE sets no interval (NG229 1.5.5, 1.5.6).",
  },
  {
    key: "ctgReviewAmberMin", type: "number", default: 15, min: 5, max: 60, step: 5, unit: "min", group: "Fetal monitoring",
    label: "Hourly CTG review: amber when overdue by",
    help: "Before this the reminder is grey.",
    nice: "NICE asks for an hourly review (NG229 1.3.5, 1.3.6); it sets no overdue point.",
  },
  {
    key: "ctgReviewRedMin", type: "number", default: 30, min: 10, max: 120, step: 5, unit: "min", group: "Fetal monitoring",
    label: "Hourly CTG review: red when overdue by",
    nice: "NICE sets no overdue point.",
  },
  {
    key: "latentReassessH", type: "number", default: 6, min: 2, max: 8, step: 1, unit: "h", group: "Labour progress",
    label: "Reassess latent phase after",
    help: "Counted from admission, or from the start of induction.",
    nice: "NICE sets no interval.",
  },
  {
    key: "promAntibioticsOn", type: "bool", default: false, group: "Membranes and antibiotics",
    label: "Antibiotics after membranes ruptured for a set time",
    help: "Off: the app follows NICE and Green-top 36, which give antibiotics for GBS, preterm labour or suspected infection, not for time since rupture. On: an urgent prompt at the time below (GL787 uses 48 hours).",
    nice: "Not in NICE or Green-top 36: NG235 1.7.6 and 1.7.7, GTG36 7.1 offer induction at 24 hours instead.",
  },
  {
    key: "promAntibioticH", type: "number", default: 48, min: 12, max: 72, step: 6, unit: "h", group: "Membranes and antibiotics",
    label: "Antibiotics indicated when membranes ruptured",
    help: "For women who are not GBS positive.",
    nice: "GL787: 48 hours at term.",
  },
  {
    key: "neonatalTeamUnderWk", type: "number", default: 34, min: 28, max: 37, step: 1, unit: "weeks", group: "Preterm",
    label: "Inform the neonatal team under",
    help: "Gestation in completed weeks.",
    nice: "No national number.",
  },
  {
    key: "oxytocinMax", type: "number", default: 20, min: 10, max: 40, step: 2, unit: "mU/min", group: "Oxytocin",
    label: "Oxytocin maximum dose",
    help: "At or above this, escalate to the registrar or consultant.",
    nice: "NICE sets no maximum (NG235 1.8.54).",
  },
  {
    key: "oliguriaMlH", type: "number", default: 30, min: 20, max: 50, step: 5, unit: "mL/h", group: "Maternal observations",
    label: "Low urine output below",
    nice: "No NICE threshold in labour.",
  },
  {
    key: "labourRulesFromWk", type: "number", default: 28, min: 22, max: 34, step: 1, unit: "weeks", group: "Scope",
    label: "Apply labour progress and CTG rules from",
    help: "Below this gestation the board shows a note instead; preterm, antibiotic and obs alerts still run.",
    nice: "No national number: NICE CTG categories and labour timings are not written for extreme prematurity.",
  },
  {
    key: "pphCsMl", type: "number", default: 500, min: 500, max: 1000, step: 100, unit: "mL", group: "After birth",
    label: "PPH alert after a caesarean from",
    help: "After a vaginal birth the alert always starts at 500 mL. Over 1000 mL is always major.",
    nice: "RCOG GTG52: PPH is 500 mL or more after any birth. Some units use 1000 mL after a caesarean.",
  },
  {
    key: "staleBedH", type: "number", default: 3, min: 1, max: 8, step: 1, unit: "h", group: "Board",
    label: "Ask \"is she still here?\" after no entries for",
    help: "Any change to her record restarts the clock. Still here restarts it too.",
    nice: "App design choice.",
  },
  {
    key: "reviewOn", type: "bool", default: true, group: "Reviewed alerts",
    label: "Allow Reviewed on urgent alerts",
    help: "On: a clinician can mark an alert Reviewed and it goes quiet for the time below. Off: alerts stay until the problem clears.",
    nice: "App design choice.",
  },
  {
    key: "reviewFastMin", type: "number", default: 15, min: 5, max: 60, step: 5, unit: "min", group: "Reviewed alerts",
    label: "Returns after: RR under 9",
    nice: "App default.",
  },
  {
    key: "reviewUrgentMin", type: "number", default: 30, min: 5, max: 120, step: 5, unit: "min", group: "Reviewed alerts",
    label: "Returns after: pathological CTG, severe or low BP, pulse, RR, sugars, 5+ contractions",
    nice: "App default.",
  },
  {
    key: "reviewHourMin", type: "number", default: 60, min: 15, max: 240, step: 15, unit: "min", group: "Reviewed alerts",
    label: "Returns after: PPH, raised BP, temperature, urine output, oxytocin maximum, passive stage, blood-stained liquor",
    nice: "App default.",
  },
  {
    key: "reviewProgressMin", type: "number", default: 120, min: 30, max: 360, step: 30, unit: "min", group: "Reviewed alerts",
    label: "Returns after: slow progress, after ARM",
    nice: "App default.",
  },
  {
    key: "reviewLongMin", type: "number", default: 240, min: 60, max: 480, step: 30, unit: "min", group: "Reviewed alerts",
    label: "Returns after: long first stage, latent phase, membranes, meconium, liquor",
    nice: "App default.",
  },
];

export const UNIT_DEFAULTS = Object.fromEntries(UNIT_SETTINGS.map(s => [s.key, s.default]));
const BY_KEY = Object.fromEntries(UNIT_SETTINGS.map(s => [s.key, s]));

function valid(key, v) {
  const s = BY_KEY[key];
  if (!s) return false;
  if (s.type === "bool") return typeof v === "boolean";
  return typeof v === "number" && Number.isFinite(v) && v >= s.min && v <= s.max;
}

let cache = null;

/** Current settings: defaults overlaid with what this phone has saved. */
export function getUnitSettings() {
  if (cache) return cache;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {}; } catch { saved = {}; }
  cache = { ...UNIT_DEFAULTS };
  for (const [k, v] of Object.entries(saved)) if (valid(k, v)) cache[k] = v;
  return cache;
}

/** Save settings; only values that differ from the default are stored. */
export function saveUnitSettings(next) {
  cache = { ...UNIT_DEFAULTS };
  const changed = {};
  for (const [k, v] of Object.entries(next)) {
    if (!valid(k, v)) continue;
    cache[k] = v;
    if (v !== UNIT_DEFAULTS[k]) changed[k] = v;
  }
  try { localStorage.setItem(KEY, JSON.stringify(changed)); } catch { /* storage blocked */ }
  return cache;
}

export function changedSettings(settings = getUnitSettings()) {
  return UNIT_SETTINGS.filter(s => settings[s.key] !== s.default);
}

export function formatSetting(s, v) {
  return s.type === "bool" ? (v ? "On" : "Off") : `${v} ${s.unit}`;
}
