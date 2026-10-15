// Every alert rule the board applies, in plain language, with the guideline
// text it comes from. The Rules and sources page reads this file, and a test
// checks that every alert id the engine can raise is listed here.
//
// sources: keys into SOURCES (src/data/sources.js, verbatim text).
// local:   the part of the rule that is a local or app choice, not a national
//          number. Shown as "Local, verify against your protocol" (or "App
//          design choice" in the Scope group).

export const RULE_GROUPS = [
  "Preterm",
  "Antibiotics and membranes",
  "Labour progress",
  "Second stage",
  "Oxytocin and contractions",
  "Fetal monitoring (CTG)",
  "Maternal observations",
  "Diabetes",
  "After birth",
  "Scope",
];

export const RULES = [
  // ── Scope ──────────────────────────────────────────────────────────────
  {
    id: "scope-under-28", group: "Scope", title: "Under 28+0 weeks",
    when: "Gestation under 28+0 and not yet delivered.",
    then: "Shows a note that labour progress and CTG rules are not applied. Preterm, antibiotic and maternal observation alerts still run.",
    severity: "Info", alertIds: ["under-28"], sources: [],
    local: "App scope decision: the labour timings and CTG categories here are written for later gestations. Care is individualised with senior and neonatal input.",
  },
  {
    id: "scope-delivered", group: "Scope", title: "After birth",
    when: "Delivery recorded.",
    then: "Labour, CTG, preterm and antibiotic prompts stop. Maternal observation, sepsis and PPH alerts continue, and a woman with an active alert moves back up the board.",
    severity: "n/a", alertIds: [], sources: [],
    local: "App scope decision: the labour rules no longer apply after birth.",
  },

  // ── Preterm ────────────────────────────────────────────────────────────
  {
    id: "preterm-steroids", group: "Preterm", title: "Antenatal corticosteroids",
    when: "Preterm and not yet confirmed. 22+0 to 23+6: discuss. 24+0 to 33+6: offer. 34+0 to 35+6: consider.",
    then: "Discuss / offer (urgent) / consider. Tap Given to clear.",
    severity: "Urgent 24+0 to 33+6, otherwise warning", alertIds: ["preterm-steroids"],
    sources: ["NG25 1.9.1", "NG25 1.9.2", "NG25 1.9.3"],
  },
  {
    id: "preterm-mgso4", group: "Preterm", title: "Magnesium sulfate for neuroprotection",
    when: "Preterm and not yet given. 23+0 to 23+6: discuss. 24+0 to 29+6: offer. 30+0 to 33+6 in established labour: consider.",
    then: "Discuss / offer (urgent) / consider. Tap Given to clear.",
    severity: "Urgent 24+0 to 29+6, otherwise warning", alertIds: ["preterm-mgso4"],
    sources: ["NG25 1.10.1", "NG25 1.10.2", "NG25 1.10.3"],
  },
  {
    id: "preterm-tocolysis", group: "Preterm", title: "Tocolysis",
    when: "24+0 to 33+6, membranes intact, latent or established first stage, decision not yet recorded.",
    then: "Offer tocolysis or record the decision, weighing the NG25 1.8.1 factors.",
    severity: "Warning", alertIds: ["preterm-tocolysis"],
    sources: ["NG25 1.8.1", "NG25 1.8.4"],
  },
  {
    id: "preterm-neonatal", group: "Preterm", title: "Neonatal team",
    when: "Under 34+0 and the neonatal team not yet informed.",
    then: "Inform the neonatal team. Tap Done to clear.",
    severity: "Urgent", alertIds: ["preterm-neonatal"], sources: [],
    local: "34+0 cut-off is local practice; no national number.",
  },

  // ── Antibiotics and membranes ──────────────────────────────────────────
  {
    id: "gbs-iap", group: "Antibiotics and membranes", title: "GBS: intrapartum antibiotics",
    when: "GBS+ flag, in labour or membranes ruptured, antibiotics not yet given. An induction still latent with intact membranes is not yet labour.",
    then: "First dose as soon as possible, continue until birth. Regimen from GL787. Never hidden by the PROM alerts.",
    severity: "Urgent", alertIds: ["gbs-iap"],
    sources: ["NG195 1.6.1", "NG195 1.6.4", "GL787 GBS"],
  },
  {
    id: "iap-preterm", group: "Antibiotics and membranes", title: "Preterm labour: intrapartum antibiotics",
    when: "Under 37+0, in labour, not GBS+ (that has its own alert), antibiotics not yet given.",
    then: "Offer antibiotics in labour, first dose as soon as possible.",
    severity: "Urgent", alertIds: ["iap-preterm"],
    sources: ["NG195 1.6.1", "NG195 1.6.4", "GL787 PROM"],
  },
  {
    id: "prom-48h", group: "Antibiotics and membranes", title: "Membranes ruptured 48 hours",
    when: "Membranes ruptured 48 hours or more, not GBS+, antibiotics not yet given.",
    then: "Antibiotic prophylaxis indicated per GL787.",
    severity: "Urgent", alertIds: ["prom-48h"], sources: ["GL787 PROM"],
  },
  {
    id: "prom-24h", group: "Antibiotics and membranes", title: "Prelabour rupture of membranes at term: 24 hours",
    when: "37+0 or later, membranes ruptured 24 hours or more, still latent.",
    then: "Offer induction of labour.",
    severity: "Urgent", alertIds: ["prom-24h"], sources: ["NG235 1.7.6", "NG235 1.7.7"],
  },
  {
    id: "prom-18h", group: "Antibiotics and membranes", title: "Membranes ruptured 16 and 18 hours",
    when: "Membranes ruptured 16 hours (warning) or 18 hours (urgent).",
    then: "Review GBS status and signs of infection.",
    severity: "Warning at 16 h, urgent at 18 h", alertIds: ["prom-16h", "prom-18h"], sources: ["GL787 PROM"],
    local: "16 h and 18 h are local review points. Neither NG195 nor GL787 uses an 18 hour threshold; GL787 gives 48 hours for antibiotics at term.",
  },
  {
    id: "gbs-pending", group: "Antibiotics and membranes", title: "GBS result pending",
    when: "GBS pending flag and membranes ruptured.",
    then: "Chase the result; start antibiotics if positive.",
    severity: "Warning", alertIds: ["gbs-pending-rupture"], sources: ["GL787 GBS"],
    local: "Prompt to chase a pending result is local practice.",
  },
  {
    id: "meconium", group: "Antibiotics and membranes", title: "Meconium",
    when: "Thick or thin meconium recorded at a VE or on admission.",
    then: "Risk assessment, offer continuous CTG; thick meconium also prompts neonatal support at birth.",
    severity: "Urgent (thick), warning (thin)", alertIds: ["mec-thick", "mec-thin"],
    sources: ["NG235 1.8.33", "NG229 1.3.8", "NG229 1.3.11"],
  },
  {
    id: "liquor-blood", group: "Antibiotics and membranes", title: "Blood-stained liquor",
    when: "Blood-stained liquor recorded.",
    then: "Review fetal heart rate; escalate if concerned.",
    severity: "Warning", alertIds: ["liquor-blood"], sources: ["NG235 1.8.20", "NG229 1.3.8"],
  },
  {
    id: "liquor-absent", group: "Antibiotics and membranes", title: "No liquor after rupture",
    when: "Liquor recorded as absent.",
    then: "Consider CTG and senior review.",
    severity: "Warning", alertIds: ["liquor-absent"], sources: [],
    local: "Local practice; no national threshold.",
  },

  // ── Labour progress ────────────────────────────────────────────────────
  {
    id: "latent-reassess", group: "Labour progress", title: "Latent phase reassessment",
    when: "Latent for 4 hours since admission (or since induction started).",
    then: "Reassess to confirm or exclude established labour.",
    severity: "Warning", alertIds: ["latent-reassess"], sources: ["NG235 1.8.1"],
    local: "The 4 hour interval is local; NG235 1.8.1 gives the definition of established labour only.",
  },
  {
    id: "ve-4h", group: "Labour progress", title: "Vaginal examination every 4 hours",
    when: "Established first stage: no VE yet (urgent), 3.5 hours since the last (warning), 4 hours (urgent).",
    then: "Offer a VE.",
    severity: "Warning, then urgent", alertIds: ["ve-never", "ve-due-soon", "ve-overdue"], sources: ["NG235 1.8.19"],
    local: "The 30 minute early warning is an app choice.",
  },
  {
    id: "slow-progress", group: "Labour progress", title: "Slow progress in the first stage",
    when: "Established first stage VEs only: under 1 cm in about 2 hours between VEs, or under 2 cm over about 4 hours (5 minute tolerance).",
    then: "Suspect or diagnose delay; consider amniotomy and obstetric review.",
    severity: "Urgent", alertIds: ["slow-progress"], sources: ["NG235 1.8.42", "NG235 1.8.45"],
  },
  {
    id: "active-phase-limit", group: "Labour progress", title: "Long established first stage",
    when: "Established first stage over 18 hours (first labour) or 12 hours (later labours).",
    then: "Review progress against the delay criteria.",
    severity: "Warning", alertIds: ["active-phase-limit"], sources: ["NG235 1.8.36"],
  },
  {
    id: "arm", group: "Labour progress", title: "After amniotomy",
    when: "2 hours after ARM in the established first stage with no VE since, or a later VE with fewer than 3 contractions in 10 minutes.",
    then: "Repeat VE; if no progress, diagnose delay and obtain obstetric review including consideration of oxytocin.",
    severity: "Warning", alertIds: ["arm-reassess", "arm-cx-inadequate"],
    sources: ["NG235 1.8.48", "NG235 1.8.49", "NG235 1.8.50"],
    local: "\"Fewer than 3 in 10\" is a local marker of inadequate contractions.",
  },

  // ── Second stage ───────────────────────────────────────────────────────
  {
    id: "passive", group: "Second stage", title: "Passive second stage",
    when: "With an epidural: 2 hours (first labour) or 1 hour (later labours) since full dilatation. Without: 1 hour with no urge to push. Warning 15 minutes before.",
    then: "With an epidural, actively encourage pushing; without, offer further assessment.",
    severity: "Warning, then urgent", alertIds: ["passive-limit-soon", "passive-limit"],
    sources: ["NG235 1.6.34", "NG235 1.9.8"],
    local: "The 15 minute early warning is an app choice.",
  },
  {
    id: "pushing", group: "Second stage", title: "Active pushing",
    when: "Reassess after 1 hour of pushing (first labour) or 30 minutes (later labours); senior review if birth is not imminent after 2 hours or 1 hour. Same with or without an epidural.",
    then: "Reassess progress; then senior review and a decision on place and mode of birth.",
    severity: "Warning, then urgent", alertIds: ["pushing-reassess", "pushing-senior-review"],
    sources: ["NG235 1.9.25", "NG235 1.9.26", "NG235 1.9.27", "NG235 1.9.28"],
  },

  // ── Oxytocin and contractions ──────────────────────────────────────────
  {
    id: "hyperstim", group: "Oxytocin and contractions", title: "5 or more contractions in 10 minutes",
    when: "Latest count (from a VE or a CTG review) is 5 or more in 10 minutes.",
    then: "Risk assessment and measures to reduce frequency. On oxytocin: reduce or stop until 4 or fewer in 10.",
    severity: "Urgent", alertIds: ["hyperstim"], sources: ["NG229 1.4.14", "NG235 1.8.55"],
  },
  {
    id: "oxytocin-stop", group: "Oxytocin and contractions", title: "Pathological CTG on oxytocin",
    when: "Oxytocin running and the latest CTG is pathological.",
    then: "Stop oxytocin immediately; urgent obstetric or senior midwife review. Log the stop in the oxytocin sheet.",
    severity: "Urgent", alertIds: ["oxytocin-stop-pathological"], sources: ["NG235 1.8.56"],
  },
  {
    id: "oxytocin-increment", group: "Oxytocin and contractions", title: "Oxytocin dose review",
    when: "First stage, 30 minutes since the last change, and none of: dose held, 5 or more contractions in 10, suspicious or pathological CTG.",
    then: "Review whether to increase towards 3 to 4 contractions in 10 minutes.",
    severity: "Warning", alertIds: ["oxytocin-increment"], sources: ["NG235 1.8.54"],
  },
  {
    id: "oxytocin-max", group: "Oxytocin and contractions", title: "Oxytocin at maximum",
    when: "Dose 20 mU/min or more.",
    then: "Escalate to registrar or consultant.",
    severity: "Urgent", alertIds: ["oxytocin-max"], sources: [],
    local: "20 mU/min maximum, starting dose and step size are local protocol.",
  },

  // ── CTG ────────────────────────────────────────────────────────────────
  {
    id: "ctg-classify", group: "Fetal monitoring (CTG)", title: "How the app grades a CTG",
    when: "4 features: contractions, baseline, variability, decelerations. Each white, amber or red. Contractions amber at 5 or more in 10, or hypertonus.",
    then: "Normal: all white. Suspicious: 1 amber. Pathological: 1 red, or 2 or more amber. A clinician can grade a trace pathological on the whole picture; the app never downgrades.",
    severity: "n/a", alertIds: [], sources: ["NG229 1.4.12", "NG229 1.4.32"],
    local: "A baseline rise of 20 bpm or more scores amber here (local). NG229 1.4.37 uses this as a red feature in the active second stage.",
  },
  {
    id: "ctg-pathological", group: "Fetal monitoring (CTG)", title: "Pathological CTG",
    when: "Latest CTG pathological, any stage of labour including latent and induction.",
    then: "Urgent obstetric and senior midwife review, exclude acute events, conservative measures; consider expediting birth if it persists.",
    severity: "Urgent", alertIds: ["ctg-pathological"], sources: ["NG229 1.5.7", "NG229 1.5.8"],
  },
  {
    id: "ctg-suspicious", group: "Fetal monitoring (CTG)", title: "Suspicious CTG",
    when: "Latest CTG suspicious, any stage. Becomes urgent if not reassessed within 30 minutes.",
    then: "Full risk assessment and conservative measures; urgent review if other risk factors.",
    severity: "Warning, then urgent", alertIds: ["ctg-suspicious", "ctg-suspicious-overdue"],
    sources: ["NG229 1.5.5", "NG229 1.5.6"],
    local: "The 30 minute reassessment interval is local; NG229 does not set a time.",
  },
  {
    id: "ctg-indicated", group: "Fetal monitoring (CTG)", title: "Continuous CTG indicated, not logged",
    when: "Established labour or oxytocin running, no CTG logged, and any indication: previous CS, hypertension, diabetes, ROM 24 h+ before established labour, non-cephalic, over 42+0, meconium, blood-stained liquor, pyrexia, pulse over 120, raised BP, delay, epidural, oxytocin.",
    then: "Log a CTG review.",
    severity: "Info", alertIds: ["ctg-not-documented"], sources: ["NG229 1.3.2", "NG229 1.3.3", "NG229 1.3.8"],
    local: "Preterm, GBS+, GBS pending and PPROM are added as local indications; they are not NG229 indications.",
  },
  {
    id: "ctg-hourly", group: "Fetal monitoring (CTG)", title: "Hourly CTG review",
    when: "Continuous CTG indicated, established labour or oxytocin, and an hour since the last review.",
    then: "Hourly assessment with a fresh-eyes review.",
    severity: "Info", alertIds: ["ctg-review-due"], sources: ["NG229 1.3.5", "NG229 1.3.6"],
  },

  // ── Maternal observations ──────────────────────────────────────────────
  {
    id: "obs-due", group: "Maternal observations", title: "Routine observations",
    when: "Established labour: pulse hourly; BP and temperature 4-hourly (BP hourly if hypertensive).",
    then: "Shown as P / B / T dots on the board. A check marked done without a value clears the old reading.",
    severity: "Info (BP urgent if hypertensive)", alertIds: ["pulse-due", "pulse-never", "bp-due", "bp-never", "temp-due", "temp-never"],
    sources: ["NG235 1.8.19", "NG133 1.7.3"],
  },
  {
    id: "temp", group: "Maternal observations", title: "Raised temperature",
    when: "38.0°C or above (urgent), 37.5 to 37.9°C (warning).",
    then: "Transfer trigger and indication for continuous CTG; antibiotics if chorioamnionitis suspected; repeat 37.5 in 1 hour.",
    severity: "Urgent / warning", alertIds: ["temp-38", "temp-375"],
    sources: ["NG235 1.8.20", "NG229 1.3.8", "NG195 1.6.1", "NG195 1.6.4"],
  },
  {
    id: "tachycardia", group: "Maternal observations", title: "Maternal tachycardia",
    when: "Pulse over 120.",
    then: "Assess for bleeding, sepsis, PE or pain; escalate.",
    severity: "Urgent", alertIds: ["tachycardia"], sources: ["NG235 1.8.20", "NG255 table 1"],
    local: "NG235 asks for 2 readings over 120 15 to 30 minutes apart; the app alerts on the first so it is repeated.",
  },
  {
    id: "bp-high", group: "Maternal observations", title: "Raised blood pressure",
    when: "160/110 or more (urgent). 140/90 or more (urgent if known hypertensive, otherwise warning).",
    then: "Treat severe hypertension urgently per protocol; BP every 15 to 30 minutes until below 160/110.",
    severity: "Urgent / warning", alertIds: ["bp-severe", "bp-elevated"], sources: ["NG235 1.8.20", "NG133 1.7.3"],
  },
  {
    id: "sepsis-low", group: "Maternal observations", title: "Low BP or low temperature (sepsis risk)",
    when: "Systolic 90 or less (urgent); 91 to 100 (warning); temperature under 36°C (warning). Also after birth.",
    then: "Consider sepsis and haemorrhage; senior review.",
    severity: "Urgent / warning", alertIds: ["bp-low", "temp-low"],
    sources: ["NG255 1.5.1", "NG255 1.5.2", "NG255 table 1"],
  },
  {
    id: "oliguria", group: "Maternal observations", title: "Low urine output",
    when: "Recorded urine output under 30 mL per hour.",
    then: "Escalate.",
    severity: "Urgent", alertIds: ["oliguria"], sources: [],
    local: "30 mL/h is a local threshold.",
  },

  // ── Diabetes ───────────────────────────────────────────────────────────
  {
    id: "bgl", group: "Diabetes", title: "Capillary glucose in labour",
    when: "Diabetic flag: hourly glucose due; value under 4 or over 7 mmol/L.",
    then: "Keep 4 to 7 mmol/L; IV dextrose and insulin if not maintained (local VRII protocol).",
    severity: "Urgent", alertIds: ["bgl-due", "bgl-never", "bgl-low", "bgl-high"],
    sources: ["NG3 1.4.10", "NG3 1.4.12", "GL983 intrapartum"],
    local: "GL983 starts 2-hourly glucose for type 2 diabetes on metformin or diet; the app prompts hourly for every diabetic flag (NG3).",
  },

  // ── After birth ────────────────────────────────────────────────────────
  {
    id: "pph", group: "After birth", title: "Postpartum haemorrhage",
    when: "Recorded EBL 500 to 1000 mL (minor) or over 1000 mL (major).",
    then: "Minor: warning. Major: urgent. Tap Reviewed to clear.",
    severity: "Warning / urgent", alertIds: ["pph"], sources: ["GTG52 definitions"],
  },
];

export const RULE_FOR_ALERT = Object.fromEntries(RULES.flatMap(r => r.alertIds.map(id => [id, r])));
