// GL952 — Hypertension in Pregnancy / Pre-Eclampsia
// Four focused flowcharts: Triage, Acute Management, Severe (Labour Ward), Postnatal

export const GL952_TRIAGE_FLOWCHART = {
  id: "GL952_TRIAGE",
  title: "Hypertension Classification",
  subtitle: "GL952 · Hypertension in Pregnancy",
  startId: "bp-timing",
  nodes: {

    "bp-timing": {
      type: "decision",
      title: "When was hypertension first recorded?",
      text: "BP ≥140/90 mmHg — when did this first appear?",
      options: [
        { label: "Pre-pregnancy or <20 weeks", sublabel: "Hypertension present before mid-pregnancy", next: "chronic-htn" },
        { label: "≥20 weeks (new onset)", sublabel: "No prior hypertension documented", next: "proteinuria" },
      ],
    },

    "chronic-htn": {
      type: "end",
      title: "Chronic Hypertension",
      text: "Hypertension diagnosed before pregnancy or before 20 weeks' gestation.",
      items: [
        "Refer to obstetric medicine / consultant-led care",
        "Continue antihypertensives (switch if needed — avoid ACE inhibitors, ARBs)",
        "Target BP <140/90 mmHg antenatally and postnatally",
        "Assess for superimposed PET at each antenatal contact",
        "Uterine artery Dopplers offered at 20–24 weeks",
      ],
    },

    "proteinuria": {
      type: "decision",
      title: "Significant proteinuria?",
      text: "Check urine PCR and/or dipstick.",
      options: [
        { label: "Yes — PCR >30 mg/mmol or ≥2+ dipstick", sublabel: "Significant proteinuria present", next: "pet-features" },
        { label: "No proteinuria", sublabel: "Dipstick negative or trace", next: "gest-htn" },
      ],
    },

    "pet-features": {
      type: "decision",
      title: "Additional PET features?",
      text: "Check for end-organ involvement beyond proteinuria.",
      options: [
        { label: "Yes — any of the following:", sublabel: "Severe headache, visual changes, epigastric pain, platelets <100, ALT >40, creatinine ≥90, FGR, eclampsia", next: "severe-pet" },
        { label: "No additional features", sublabel: "Proteinuria + HTN only", next: "mild-pet" },
      ],
    },

    "gest-htn": {
      type: "end",
      title: "Gestational Hypertension",
      text: "New-onset HTN ≥20 weeks without significant proteinuria or end-organ involvement.",
      items: [
        "Admit or increase surveillance depending on BP level",
        "Start antihypertensives if BP ≥150/100 mmHg (target ≤135/85)",
        "PET screen bloods: twice weekly if ≤149/99; three times weekly if >149/99",
        "Monitor for development of PET features at each contact",
        "Postnatal target BP ≤149/99 mmHg",
      ],
    },

    "mild-pet": {
      type: "end",
      title: "Pre-Eclampsia (Mild–Moderate)",
      text: "New-onset HTN ≥20 weeks with significant proteinuria. No severe features.",
      items: [
        "Admit to antenatal ward",
        "PET bloods twice or three times weekly depending on BP",
        "Start antihypertensives — target ≤135/85 mmHg antenatally",
        "CTG on admission then weekly; USS within 2 days",
        "Discuss timing of delivery with consultant",
        "LMWH if VTE risk score indicates",
      ],
    },

    "severe-pet": {
      type: "end",
      title: "Severe PET / Eclampsia",
      text: "Pre-Eclampsia with severe features or eclampsia. Urgent escalation required.",
      items: [
        "Transfer to Labour Ward immediately",
        "Call LW co-ordinator, Obs registrar, Anaesthetic registrar, Consultant",
        "IV access, continuous CTG, BP every 5 minutes",
        "Consider MgSO4 if seizure risk (see Severe LW flowchart)",
        "Strict fluid restriction: 40 ml/hr + previous hour's urine, max 80 ml/hr",
        "Plan expedited delivery",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GL952_ACUTE_FLOWCHART = {
  id: "GL952_ACUTE",
  title: "Acute BP Management",
  subtitle: "GL952 · New Elevated BP on Ward",
  startId: "record-bp",
  nodes: {

    "record-bp": {
      type: "action",
      title: "Record BP on MOWS",
      text: "Document reading on the Modified Obstetric Warning Score chart.",
      items: [
        "Use a calibrated electronic sphygmomanometer",
        "Patient seated, arm at heart level",
        "Record both systolic and diastolic",
        "Repeat BP in 15 minutes",
      ],
      next: "after-15min",
    },

    "after-15min": {
      type: "decision",
      title: "BP after 15 minutes",
      text: "Is BP still ≥140/90 mmHg on repeat measurement?",
      options: [
        { label: "Yes — still elevated", sublabel: "≥140 systolic or ≥90 diastolic", next: "sho-review" },
        { label: "No — normalised", sublabel: "Both readings now <140/90", next: "end-monitor" },
      ],
    },

    "end-monitor": {
      type: "end",
      title: "BP Normalised",
      text: "BP has returned to <140/90 on repeat. Continue routine monitoring.",
      items: [
        "Document on MOWS",
        "Repeat BP in 1 hour",
        "Inform midwife in charge; document plan",
        "Review if BP rises again",
      ],
    },

    "sho-review": {
      type: "action",
      title: "SHO review within 1 hour",
      text: "Senior House Officer to review the patient.",
      items: [
        "Take full history: headache, epigastric pain, visual changes, oedema",
        "Check asthma history and known drug allergies",
        "Examine: reflexes (clonus), urine dipstick, fetal movements",
        "Review current medications",
        "Document findings and management plan",
      ],
      next: "on-treatment",
    },

    "on-treatment": {
      type: "decision",
      title: "Already on antihypertensives?",
      text: "Is the patient currently prescribed antihypertensive medication?",
      options: [
        { label: "Yes — on treatment", sublabel: "Increase current dose or add agent", next: "increase-current" },
        { label: "No — not on treatment", sublabel: "Start new antihypertensive", next: "asthma-check" },
      ],
    },

    "increase-current": {
      type: "action",
      title: "Increase antihypertensive",
      text: "Increase current antihypertensive to next dose tier.",
      items: [
        "Labetalol: increase by 100mg BD increments (max 800mg/day)",
        "Nifedipine MR: increase by 10mg BD increments (max 80mg/day)",
        "Methyldopa: increase by 250mg increments (max 3g/day)",
        "Recheck BP in 1 hour",
      ],
      next: "recheck-1hr",
    },

    "asthma-check": {
      type: "decision",
      title: "Asthmatic?",
      text: "Is there a history of asthma or bronchospasm?",
      options: [
        { label: "No asthma", sublabel: "Labetalol is safe", next: "start-labetalol" },
        { label: "Yes — asthmatic", sublabel: "Avoid beta-blockers", next: "start-nifedipine" },
      ],
    },

    "start-labetalol": {
      type: "action",
      title: "Start Labetalol 100mg BD",
      text: "First-line oral antihypertensive in pregnancy.",
      items: [
        "Labetalol 100mg orally TWICE daily",
        "Also CI in bradycardia and pulmonary oedema",
        "Caution in diabetes (may mask hypoglycaemia)",
        "Recheck BP in 1 hour",
      ],
      next: "recheck-1hr",
    },

    "start-nifedipine": {
      type: "action",
      title: "Start Nifedipine MR 10mg BD",
      text: "Second-line; use when Labetalol is contraindicated.",
      items: [
        "Nifedipine MR (modified-release) 10mg orally TWICE daily",
        "CI in advanced aortic stenosis",
        "Not licensed in pregnancy — document",
        "Recheck BP in 1 hour",
      ],
      next: "recheck-1hr",
    },

    "recheck-1hr": {
      type: "decision",
      title: "BP after 1 hour",
      text: "Is BP still ≥140/90 mmHg 1 hour after starting / increasing treatment?",
      options: [
        { label: "No — controlled", sublabel: "BP now <140/90", next: "end-controlled" },
        { label: "Yes — still elevated", sublabel: "Further escalation needed", next: "registrar" },
      ],
    },

    "end-controlled": {
      type: "end",
      title: "BP Controlled",
      text: "BP responding to treatment. Continue monitoring.",
      items: [
        "4-hourly BP monitoring",
        "Document on MOWS; update drug chart",
        "Review bloods: U+Es, FBC, LFTs, PCR",
        "Inform consultant of new antihypertensive initiation",
      ],
    },

    "registrar": {
      type: "action",
      title: "Registrar review + escalation",
      text: "BP not controlled after first treatment. Escalate.",
      items: [
        "Registrar to review immediately",
        "Second dose of antihypertensive",
        "Transfer to Labour Ward",
        "Start CTG; IV access",
        "Recheck BP in 2 hours",
      ],
      next: "recheck-2hr",
    },

    "recheck-2hr": {
      type: "decision",
      title: "BP after 2 further hours",
      text: "Is BP ≥150/100 mmHg despite two doses of oral antihypertensive?",
      options: [
        { label: "No — now controlled", sublabel: "Continue LW monitoring", next: "end-lw-monitor" },
        { label: "Yes — still ≥150/100", sublabel: "Parenteral therapy needed", next: "iv-alert" },
      ],
    },

    "end-lw-monitor": {
      type: "end",
      title: "On Labour Ward",
      text: "BP controlled but continuing on Labour Ward for close monitoring.",
      items: [
        "Hourly BP on Labour Ward",
        "Continuous CTG",
        "Review by consultant",
        "Plan for delivery timing",
      ],
    },

    "iv-alert": {
      type: "alert",
      title: "CONSULTANT — Consider IV therapy",
      text: "BP remains uncontrolled after two oral doses. Consultant involvement mandatory.",
      items: [
        "IV Labetalol 50mg over 5 minutes — repeat 40–80mg every 10 minutes (max 200mg)",
        "OR IV Hydralazine 5–20mg slow bolus over 10–20 minutes",
        "If asthmatic: use Hydralazine (avoid Labetalol)",
        "Oral Nifedipine 10mg stat may also be considered",
        "Target systolic <150 mmHg and diastolic <100 mmHg",
        "Consider MgSO4 if severe features present (see Severe LW flowchart)",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GL952_SEVERE_LW_FLOWCHART = {
  id: "GL952_SEVERE_LW",
  title: "Severe PET — Labour Ward",
  subtitle: "GL952 · MgSO4 & IV Antihypertensives",
  startId: "lw-admission",
  nodes: {

    "lw-admission": {
      type: "alert",
      title: "Labour Ward Admission — Severe PET",
      text: "Call LW co-ordinator, Obs registrar, Anaesthetic registrar, Consultant obstetrician and Consultant anaesthetist.",
      items: [
        "IV access (wide-bore); blood: FBC, U+E, LFTs, coagulation, G&S",
        "Continuous CTG",
        "BP every 5 minutes",
        "Strict fluid balance: 40 ml/hr + previous hour urine; max 80 ml/hr in labour",
        "NBM + omeprazole + cyclizine",
        "Catheterise; hourly urine output",
        "Inform NICU if <36 weeks",
        "Do NOT give LMWH in labour",
      ],
      next: "bp-severity",
    },

    "bp-severity": {
      type: "decision",
      title: "BP level on Labour Ward",
      text: "What is the current BP?",
      options: [
        { label: "BP ≥160/110 mmHg", sublabel: "Severe hypertension — treat immediately", next: "iv-antihyp" },
        { label: "BP 150–159/100–109 mmHg", sublabel: "Moderate–severe — escalate if persistent", next: "moderate-action" },
        { label: "BP <150/100 mmHg", sublabel: "Controlled — continue oral agents", next: "end-controlled-lw" },
      ],
    },

    "end-controlled-lw": {
      type: "end",
      title: "BP Controlled",
      text: "Continue oral antihypertensives and monitoring protocol.",
      items: [
        "Do NOT omit or delay oral antihypertensives",
        "BP every 30 minutes until stable, then hourly",
        "Continue MgSO4 monitoring if in progress",
        "Review trigger for MgSO4 criteria each hour",
      ],
    },

    "moderate-action": {
      type: "action",
      title: "Moderate HTN — Escalate",
      text: "BP 150–159/100–109 × 3 readings: escalate to registrar.",
      items: [
        "Registrar review if BP >150/100 on three consecutive readings",
        "Do NOT omit oral antihypertensives",
        "Consider adding second oral agent",
        "Recheck BP every 15 minutes",
      ],
      next: "mgso4-decision",
    },

    "iv-antihyp": {
      type: "decision",
      title: "Which IV antihypertensive?",
      text: "Check for contraindications to Labetalol.",
      options: [
        { label: "No asthma / no CI to Labetalol", sublabel: "Use IV Labetalol first-line", next: "iv-labetalol" },
        { label: "Asthmatic or CI to Labetalol", sublabel: "Use IV Hydralazine instead", next: "iv-hydralazine" },
      ],
    },

    "iv-labetalol": {
      type: "action",
      title: "IV Labetalol",
      text: "First-line IV antihypertensive for severe HTN.",
      items: [
        "Bolus: 50mg IV over 5 minutes",
        "Repeat 40–80mg every 10 minutes (max 200mg total bolus)",
        "Infusion: 100mg in 100ml 5% glucose at 20ml/hr; double every 30 mins; max 160ml/hr",
        "Target: systolic <150 mmHg and diastolic <100 mmHg",
        "Recheck BP every 5 minutes",
      ],
      next: "mgso4-decision",
    },

    "iv-hydralazine": {
      type: "action",
      title: "IV Hydralazine",
      text: "Alternative IV antihypertensive when Labetalol is contraindicated.",
      items: [
        "5–20mg slow IV bolus over 10–20 minutes",
        "Infusion: 60mg in 60ml 0.9% NaCl at 1–12 ml/hr",
        "May cause reflex tachycardia — monitor HR",
        "Target: systolic <150 mmHg and diastolic <100 mmHg",
        "Recheck BP every 5 minutes",
      ],
      next: "mgso4-decision",
    },

    "mgso4-decision": {
      type: "decision",
      title: "MgSO4 criteria met?",
      text: "Is there any of the following (in the context of severe HTN)?",
      options: [
        { label: "Yes — one or more criteria:", sublabel: "Severe headache · Visual disturbance · Epigastric pain · Papilloedema · Clonus >3 beats · HELLP · Platelets <100 · ALT >70", next: "mgso4-loading" },
        { label: "No criteria — BP management only", sublabel: "Continue antihypertensives; reassess hourly", next: "end-no-mgso4" },
      ],
    },

    "end-no-mgso4": {
      type: "end",
      title: "No MgSO4 Indicated",
      text: "Continue IV antihypertensives and monitoring. Reassess MgSO4 criteria at each review.",
      items: [
        "BP every 5 minutes until controlled, then every 15 minutes",
        "Continuous CTG",
        "Fluid restriction maintained",
        "Reassess MgSO4 criteria every 1–2 hours",
        "Consultant to plan delivery",
      ],
    },

    "mgso4-loading": {
      type: "action",
      title: "MgSO4 Loading Dose",
      text: "Seizure prophylaxis / treatment for eclampsia.",
      items: [
        "Loading: 4g IV — two 10ml ampoules of 20% MgSO4 in one 20ml syringe",
        "Administer SLOWLY over 5–10 minutes",
        "If eclampsia occurring: give loading dose immediately",
        "Document time of loading dose",
      ],
      next: "mgso4-maintenance",
    },

    "mgso4-maintenance": {
      type: "action",
      title: "MgSO4 Maintenance",
      text: "Continue infusion for ≥24 hours after last seizure or after delivery.",
      items: [
        "Five 10ml ampoules (20% MgSO4) in 50ml syringe = 10g in 50ml",
        "Run at 5ml/hr = 1g/hr",
        "If anuric: loading dose only, no maintenance",
        "Continue ≥24 hrs after last seizure or after delivery (whichever is later)",
      ],
      next: "mgso4-monitoring",
    },

    "mgso4-monitoring": {
      type: "alert",
      title: "MgSO4 Monitoring Protocol",
      text: "Every 15 minutes × 2 hours, then hourly. STOP if toxicity signs.",
      items: [
        "Continuous ECG + pulse oximetry (SpO2)",
        "BP",
        "Patellar reflexes (biceps if epidural) — absent reflexes: STOP MgSO4",
        "Respiratory rate — if <10/min: O2, stop MgSO4, calcium gluconate 1g IV",
        "Conscious level",
        "Hourly urine output — if <100ml/4hrs: reduce to 0.5g/hr",
        "ANTIDOTE: Calcium gluconate 10ml of 10% IV over 5–10 minutes",
      ],
      next: "seizure-check",
    },

    "seizure-check": {
      type: "decision",
      title: "Further seizure?",
      text: "Has the patient had a further eclamptic seizure after loading dose?",
      options: [
        { label: "No further seizures", sublabel: "Continue maintenance infusion", next: "end-mgso4" },
        { label: "Yes — further seizure", sublabel: "Extra bolus required", next: "extra-bolus" },
      ],
    },

    "extra-bolus": {
      type: "action",
      title: "Extra MgSO4 Bolus",
      text: "For further seizure despite maintenance infusion.",
      items: [
        "Additional 2g MgSO4 slow IV over 5 minutes",
        "Check: patellar reflexes, RR, conscious level before giving",
        "If respiratory arrest: intubate, ventilate, calcium gluconate IV",
        "Contact anaesthetist",
      ],
      next: "end-mgso4",
    },

    "end-mgso4": {
      type: "end",
      title: "Continuing MgSO4 Infusion",
      text: "Patient on MgSO4 maintenance. Ongoing monitoring essential.",
      items: [
        "Continue monitoring protocol (see above)",
        "MgSO4 levels if clinically indicated: therapeutic 2.0–3.5 mmol/L",
        "Plan delivery with consultant",
        "Postnatal: stay on LW ≥24hrs after MgSO4 stopped",
        "Antidote always available at bedside: Calcium gluconate 1g IV",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GL952_POSTNATAL_FLOWCHART = {
  id: "GL952_POSTNATAL",
  title: "Postnatal BP Management",
  subtitle: "GL952 · After Delivery",
  startId: "postnatal-start",
  nodes: {

    "postnatal-start": {
      type: "action",
      title: "Post-delivery — initial review",
      text: "PET features commonly worsen in the first 24 hours after delivery. Remain vigilant.",
      items: [
        "4-hourly BP monitoring inpatient",
        "Ask about symptoms (headache, epigastric pain) at every BP check",
        "Continue antihypertensives at current dose",
        "Review bloods at 48 hours",
      ],
      next: "mgso4-used",
    },

    "mgso4-used": {
      type: "decision",
      title: "Was MgSO4 used?",
      text: "Is the patient coming off an MgSO4 infusion?",
      options: [
        { label: "Yes — on MgSO4", sublabel: "Extended Labour Ward stay needed", next: "mgso4-postnatal" },
        { label: "No MgSO4", sublabel: "Transfer to postnatal ward", next: "methyldopa-check" },
      ],
    },

    "mgso4-postnatal": {
      type: "action",
      title: "MgSO4 — Postnatal Stay",
      text: "Remain on Labour Ward until MgSO4 requirements are met.",
      items: [
        "Stay on Labour Ward ≥24 hours after MgSO4 stopped",
        "Registrar review within 4 hours of delivery",
        "Registrar review ≥8-hourly while on LW",
        "Registrar review 1–2 hours after MgSO4 stopped",
        "Continue MgSO4 monitoring until infusion complete",
      ],
      next: "methyldopa-check",
    },

    "methyldopa-check": {
      type: "decision",
      title: "On Methyldopa?",
      text: "Is the patient currently prescribed Methyldopa?",
      options: [
        { label: "Yes — on Methyldopa", sublabel: "Must switch promptly", next: "stop-methyldopa" },
        { label: "No Methyldopa", sublabel: "Proceed to BP target review", next: "severity-check" },
      ],
    },

    "stop-methyldopa": {
      type: "action",
      title: "Stop Methyldopa",
      text: "Methyldopa causes postnatal depression — stop within 2 days of delivery.",
      items: [
        "Stop Methyldopa within 2 days of delivery",
        "Switch to Labetalol, Nifedipine, or ACE inhibitor",
        "First choice postnatal: Enalapril (check U+Es at 1 week)",
        "Black African/Caribbean: consider Nifedipine or Amlodipine",
        "Labetalol and Nifedipine: both safe for breastfeeding",
        "Avoid ARBs and diuretics if breastfeeding",
      ],
      next: "severity-check",
    },

    "severity-check": {
      type: "decision",
      title: "HTN severity / diagnosis",
      text: "What was the antenatal diagnosis?",
      options: [
        { label: "Chronic Hypertension", sublabel: "Pre-existing HTN", next: "chronic-postnatal" },
        { label: "Gestational Hypertension", sublabel: "New HTN ≥20 weeks, no PET", next: "gest-postnatal" },
        { label: "Mild PET", sublabel: "PET without severe features", next: "mild-pet-postnatal" },
        { label: "Moderate / Severe PET or Eclampsia", sublabel: "Severe features or MgSO4 used", next: "severe-pet-postnatal" },
      ],
    },

    "chronic-postnatal": {
      type: "end",
      title: "Chronic HTN — Postnatal",
      text: "Target BP <140/90 mmHg.",
      items: [
        "Target: <140/90 mmHg",
        "Continue or adjust pre-existing antihypertensives",
        "Stop Methyldopa if used in pregnancy",
        "6–8 week GP review; consider specialist referral if on multiple agents",
      ],
    },

    "gest-postnatal": {
      type: "end",
      title: "Gestational HTN — Postnatal",
      text: "Target ≤149/99 mmHg. Most will come off treatment within weeks.",
      items: [
        "Target: ≤149/99 mmHg",
        "Reduce antihypertensives if BP <130/80 for >24 hours",
        "Discharge criteria: no symptoms + BP ≤150/100 for >24hrs since last medication change",
        "Community midwife: BP on days 3, 4, 6 post-discharge",
        "6–8 week GP review",
      ],
    },

    "mild-pet-postnatal": {
      type: "action",
      title: "Mild PET — Postnatal",
      text: "Stay 24–48 hours. Single blood check.",
      items: [
        "Target: 130/80 to <150/100 mmHg",
        "Length of stay: 24–48 hours",
        "Bloods: FBC, U+E, LFTs, platelets once at 48–72 hours",
        "Discharge criteria: no symptoms + BP ≤150/100 + bloods stable + >24hrs since last medication increase",
      ],
      next: "discharge-plan",
    },

    "severe-pet-postnatal": {
      type: "action",
      title: "Moderate / Severe PET — Postnatal",
      text: "Stay 3–5 days. Daily bloods until improving.",
      items: [
        "Target: 130/80 to <150/100 mmHg",
        "Length of stay: 3–5 days; must be >24hrs since last medication increase",
        "Bloods: at 48 hours post-delivery; repeat every 48 hours until improving",
        "Community: alternate-day BP checks up to 2 weeks post-discharge",
      ],
      next: "discharge-plan",
    },

    "discharge-plan": {
      type: "action",
      title: "Discharge Checklist",
      text: "All women need to meet these criteria before discharge.",
      items: [
        "No symptoms of PET (headache, epigastric pain, visual changes)",
        "BP ≤150/100 mmHg (with or without antihypertensives)",
        "Blood results stable or improving",
        "Generate postnatal BP management plan on EPR",
        "Prescribe ≥2 weeks of antihypertensive on TTO",
        "Written information on warning signs",
      ],
      next: "followup",
    },

    "followup": {
      type: "end",
      title: "Follow-Up Schedule",
      text: "All women with PET need structured follow-up.",
      items: [
        "2-week review: medical review if still on antihypertensive",
        "6–8 weeks: review ALL women with PET history",
        "Still on antihypertensive at 6–8 weeks: refer to hypertension specialist",
        "Still proteinuric at 6–8 weeks: GP/specialist review at 3 months (renal function)",
        "On medication at day 12 post-discharge: GP appointment day 13–14",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const GL952_POSTNATAL_WARD_FLOWCHART = {
  id: "GL952_POSTNATAL_WARD",
  title: "Postnatal Ward — BP Management",
  subtitle: "GL952 · Acute BP Decision Tool",
  startId: "bp-reading",
  nodes: {

    "bp-reading": {
      type: "decision",
      title: "Current BP reading",
      text: "Assess the blood pressure and choose the appropriate band.",
      options: [
        { label: "≥160/110 mmHg", sublabel: "Severe hypertension", next: "severe" },
        { label: "150–159 / 100–109 mmHg", sublabel: "Moderate hypertension", next: "moderate-symptoms" },
        { label: "130–149 / 80–99 mmHg", sublabel: "Mild / within target range", next: "maintain" },
        { label: "<130/80 mmHg", sublabel: "Below target", next: "low-bp" },
      ],
    },

    // ── SEVERE ────────────────────────────────────────────────────────────────

    "severe": {
      type: "alert",
      title: "Severe Hypertension — Act Now",
      text: "BP ≥160/110 requires treatment within 30–60 minutes. Call registrar immediately.",
      items: [
        "Call obstetric registrar NOW",
        "Oral nifedipine 10 mg stat (repeat once at 30 min if still ≥160/110)",
        "OR IV labetalol 50 mg over 5 minutes if IV access in situ",
        "Continuous BP monitoring — recheck every 15 minutes",
        "Pulse oximetry; ensure IV access",
        "Do NOT leave patient unattended",
      ],
      next: "severe-recheck",
    },

    "severe-recheck": {
      type: "decision",
      title: "BP after treatment?",
      text: "Recheck BP 30 minutes after first-line treatment.",
      options: [
        { label: "Controlled — <150/100", sublabel: "Treatment effective", next: "severe-controlled" },
        { label: "Still ≥160/110", sublabel: "Not responding", next: "severe-escalate" },
      ],
    },

    "severe-controlled": {
      type: "end",
      title: "Severe HTN — Now Controlled",
      text: "Continue close monitoring and review ongoing regimen.",
      items: [
        "BP monitoring every 30 minutes for 2 hours, then hourly",
        "Review ongoing antihypertensive regimen with registrar",
        "Consider Enalapril 5 mg OD as maintenance agent (first choice postnatal)",
        "Check U+Es at 1 week if starting enalapril",
        "Document all treatment changes on EPR",
      ],
    },

    "severe-escalate": {
      type: "alert",
      title: "Uncontrolled Severe Hypertension — Escalate",
      text: "BP not responding to first-line treatment. Call consultant.",
      items: [
        "Call consultant obstetrician and anaesthetist",
        "Anaesthetic review — consider HDU/ITU",
        "IV hydralazine 5–10 mg slow bolus over 10–20 minutes",
        "OR repeat IV labetalol 50–100 mg; max cumulative 200 mg",
        "Check bloods urgently: FBC, U+E, LFTs, clotting",
        "Consider eclampsia protocol if neurological symptoms develop",
      ],
      next: "severe-escalate-end",
    },

    "severe-escalate-end": {
      type: "end",
      title: "Senior Review Ongoing",
      text: "Continue treatment under consultant supervision. HDU criteria likely met.",
      items: [
        "HDU admission if BP remains uncontrolled or symptoms present",
        "Continuous monitoring until BP stable for ≥1 hour",
        "MgSO4 if eclampsia risk: severe headache, visual changes, clonus",
      ],
    },

    // ── MODERATE ──────────────────────────────────────────────────────────────

    "moderate-symptoms": {
      type: "decision",
      title: "Any symptoms?",
      text: "Ask about: headache, visual disturbance (floaters / flashing lights), epigastric or RUQ pain.",
      options: [
        { label: "Yes — symptoms present", sublabel: "Call registrar first", next: "symptoms-present" },
        { label: "No symptoms", sublabel: "Adjust medication", next: "medication-check" },
      ],
    },

    "symptoms-present": {
      type: "alert",
      title: "Symptoms Present — Call Registrar",
      text: "Do not adjust medication without registrar review. Symptoms may indicate PET deterioration.",
      items: [
        "Call obstetric registrar before any medication change",
        "Send bloods: FBC, U+E, LFTs, uric acid",
        "Urine output — catheterise if not already done",
        "CTG if any fetal concern",
        "Do not leave patient alone",
      ],
      next: "symptoms-end",
    },

    "symptoms-end": {
      type: "end",
      title: "Await Registrar Review",
      text: "Management will be directed by the registrar following assessment.",
      items: [
        "Continue BP monitoring every 15 minutes",
        "Repeat observations: RR, O2 sats, conscious level",
        "If BP escalates to ≥160/110 before registrar arrives: give oral nifedipine 10 mg",
      ],
    },

    // ── MEDICATION CHECK ──────────────────────────────────────────────────────

    "medication-check": {
      type: "decision",
      title: "Current antihypertensive?",
      text: "What is the patient currently taking?",
      options: [
        { label: "Methyldopa", sublabel: "Must switch postnatally", next: "switch-methyldopa" },
        { label: "Labetalol", sublabel: "Titrate up or switch", next: "titrate-labetalol" },
        { label: "Nifedipine MR", sublabel: "Titrate up or add agent", next: "titrate-nifedipine" },
        { label: "None / other", sublabel: "Start enalapril first line", next: "start-treatment" },
      ],
    },

    "switch-methyldopa": {
      type: "action",
      title: "Switch from Methyldopa",
      text: "Methyldopa must be stopped within 2 days of delivery — associated with postnatal depression.",
      items: [
        "STOP methyldopa",
        "First choice: Enalapril 5 mg OD — preferred postnatal agent (GL952)",
        "Black African/Caribbean ethnicity: use Nifedipine MR 10 mg BD or Amlodipine instead",
        "Enalapril is safe for breastfeeding; check U+Es at 1 week",
        "Recheck BP in 4 hours after switching",
        "Document switch on EPR and TTO",
      ],
      next: "recheck-4h",
    },

    "start-treatment": {
      type: "action",
      title: "Start Antihypertensive",
      text: "No current treatment — initiate first-line postnatal agent.",
      items: [
        "First choice postnatally: Enalapril 5 mg OD",
        "Black African/Caribbean ethnicity: Nifedipine MR 10 mg BD or Amlodipine",
        "Labetalol 100 mg BD: alternative if enalapril not appropriate",
        "Enalapril and labetalol both safe for breastfeeding",
        "Check U+Es at 1 week after starting enalapril",
        "Recheck BP in 4 hours",
      ],
      next: "recheck-4h",
    },

    "titrate-labetalol": {
      type: "action",
      title: "Titrate Labetalol",
      text: "Increase dose in stepwise fashion. Consider switching to or adding enalapril postnatally.",
      items: [
        "Titration: 100 mg BD → 200 mg BD → 200 mg TDS → 400 mg TDS (max 800 mg/day)",
        "Postnatally: consider switching to Enalapril 5 mg OD (first choice per GL952)",
        "Avoid labetalol in: asthma, heart failure, bradycardia",
        "Recheck BP in 4 hours after dose change",
        "If already on max dose (800 mg/day): call registrar — add second agent",
      ],
      next: "max-check-labetalol",
    },

    "titrate-nifedipine": {
      type: "action",
      title: "Titrate Nifedipine MR",
      text: "Increase dose stepwise. Consider adding enalapril as second agent if needed.",
      items: [
        "Titration: 10 mg BD → 20 mg BD → 30 mg BD → 40 mg BD (max 80 mg/day)",
        "Safe for breastfeeding",
        "Consider adding Enalapril 5 mg OD if dose escalation alone insufficient",
        "Recheck BP in 4 hours after dose change",
        "If already on max dose (80 mg/day): call registrar",
      ],
      next: "max-check-nifedipine",
    },

    "max-check-labetalol": {
      type: "decision",
      title: "Already on maximum labetalol dose?",
      text: "800 mg/day is the maximum dose of labetalol.",
      options: [
        { label: "No — dose increased", sublabel: "Recheck in 4 hours", next: "recheck-4h" },
        { label: "Yes — on maximum", sublabel: "Add second agent", next: "add-agent" },
      ],
    },

    "max-check-nifedipine": {
      type: "decision",
      title: "Already on maximum nifedipine dose?",
      text: "80 mg/day is the maximum dose of nifedipine MR.",
      options: [
        { label: "No — dose increased", sublabel: "Recheck in 4 hours", next: "recheck-4h" },
        { label: "Yes — on maximum", sublabel: "Add second agent", next: "add-agent" },
      ],
    },

    "add-agent": {
      type: "end",
      title: "Maximum Dose — Call Registrar",
      text: "Single agent at maximum dose is insufficient. Registrar review needed to add second agent.",
      items: [
        "Call obstetric registrar",
        "Add Enalapril 5 mg OD to existing regimen (if not already on it)",
        "Or add Labetalol / Nifedipine MR as appropriate",
        "Check U+Es at 1 week if adding enalapril",
        "Document combination regimen on EPR and TTO",
      ],
    },

    "recheck-4h": {
      type: "end",
      title: "Recheck BP in 4 Hours",
      text: "Document medication change and continue routine monitoring.",
      items: [
        "Continue 4-hourly BP monitoring",
        "If next reading ≥160/110: restart from top of pathway",
        "If next reading still 150–159/100–109: call registrar — further escalation needed",
        "Document all changes on EPR",
        "Ensure medication changes reflected on drug chart and TTO",
      ],
    },

    // ── MAINTAIN ──────────────────────────────────────────────────────────────

    "maintain": {
      type: "end",
      title: "Maintain Current Treatment",
      text: "BP within acceptable range. Continue current antihypertensive and monitoring.",
      items: [
        "Continue current antihypertensive unchanged",
        "4-hourly BP monitoring",
        "Recheck at next routine observation",
        "If BP trends upward on consecutive readings — reassess",
      ],
    },

    // ── LOW BP ────────────────────────────────────────────────────────────────

    "low-bp": {
      type: "decision",
      title: "On antihypertensive treatment?",
      text: "BP <130/80 — assess whether treatment reduction is needed.",
      options: [
        { label: "Yes — on treatment", sublabel: "Consider dose reduction", next: "reduce-dose" },
        { label: "No treatment", sublabel: "Monitor only", next: "low-no-treatment" },
      ],
    },

    "reduce-dose": {
      type: "end",
      title: "Consider Reducing Dose",
      text: "BP <130/80 sustained for >24 hours on treatment — step down.",
      items: [
        "Reduce antihypertensive dose by one step",
        "Do not stop abruptly — step down gradually",
        "Recheck BP in 4 hours after reducing",
        "Inform registrar of dose reduction",
        "Document on EPR and update TTO before discharge",
      ],
    },

    "low-no-treatment": {
      type: "end",
      title: "Low BP — No Treatment",
      text: "BP <130/80 with no antihypertensives. No action required.",
      items: [
        "Reassure patient",
        "Continue 4-hourly BP monitoring",
        "Ensure adequate hydration",
        "If symptomatic (dizzy, faint): lie flat, call midwife",
      ],
    },

  },
};
