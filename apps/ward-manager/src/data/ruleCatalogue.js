// Every alert rule the board applies, in plain language, with the guideline
// text it comes from. The Rules and sources page reads this file, and a test
// checks that every alert id the engine can raise is listed here.
//
// sources: keys into SOURCES (src/data/sources.js, verbatim text).
// settings: keys into UNIT_SETTINGS (src/data/unitSettings.js) that change
//          this rule; the page shows what this phone is set to.
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
  "Board",
  "Scope",
];

export const RULES = [
  // ── Scope ──────────────────────────────────────────────────────────────
  {
    id: "scope-under-28", group: "Scope", title: "Under the unit's gestation (default 28+0)",
    when: "Gestation under the unit's cut-off (default 28+0) and not yet delivered.",
    then: "Shows a note that labour progress and CTG rules are not applied. Preterm, antibiotic and maternal observation alerts still run.",
    severity: "Info", alertIds: ["under-28"], sources: [], settings: ["labourRulesFromWk"],
    local: "App scope decision, editable by the unit: the labour timings and CTG categories here are written for later gestations. Care is individualised with senior and neonatal input.",
  },
  {
    id: "scope-reviewed", group: "Scope", title: "Marking an alert Reviewed",
    when: "An urgent or due alert with no Given or Done action (for example pathological CTG, severe BP, pyrexia, ROM review) is marked Reviewed, if the unit allows it.",
    then: "It drops out of Needs you now, shows who reviewed it and when, and returns after the unit's time if still present (default 15 minutes for RR under 9; 30 for pathological CTG, BP, pulse, RR, sugars; 60 for temperature, PPH and similar; 2 to 4 hours for progress and membranes), or at once if a newer CTG or obs value arrives. The handover lists it as reviewed. With Reviewed switched off, alerts stay until the problem clears.",
    severity: "n/a", alertIds: [], sources: ["NG133 1.7.3", "NG229 1.5.7"],
    settings: ["reviewOn", "reviewFastMin", "reviewUrgentMin", "reviewHourMin", "reviewProgressMin", "reviewLongMin"],
    local: "App design choice: whether Reviewed is allowed, and the return times, are unit settings.",
  },
  {
    id: "scope-order", group: "Scope", title: "Which problem comes first",
    when: "Several alerts at once, or several women needing you.",
    then: "Urgent before due before info. Within that: active bleeding (PPH, antepartum bleed), low BP, pathological CTG, severe BP, then signs of sepsis, then treatments due, then timing reminders (VE, obs, CTG review). Women are ordered by their single most dangerous problem.",
    severity: "n/a", alertIds: [], sources: [],
    local: "App design choice: the order is the app's, for review by your unit.",
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
    then: "Discuss / offer (urgent) / consider. Tap Given, or Not given if decided against; the handover shows which.",
    severity: "Urgent 24+0 to 33+6, otherwise warning", alertIds: ["preterm-steroids"],
    sources: ["NG25 1.9.1", "NG25 1.9.2", "NG25 1.9.3"],
  },
  {
    id: "preterm-mgso4", group: "Preterm", title: "Magnesium sulfate for neuroprotection",
    when: "Preterm and not yet given. 23+0 to 23+6: discuss. 24+0 to 29+6: offer. 30+0 to 33+6 in established labour: consider.",
    then: "Discuss / offer (urgent) / consider. Tap Given, or Not given if decided against; the handover shows which.",
    severity: "Urgent 24+0 to 29+6, otherwise warning", alertIds: ["preterm-mgso4"],
    sources: ["NG25 1.10.1", "NG25 1.10.2", "NG25 1.10.3"],
  },
  {
    id: "preterm-tocolysis", group: "Preterm", title: "Tocolysis",
    when: "24+0 to 33+6, membranes intact, latent or established first stage, decision not yet recorded.",
    then: "Offer tocolysis or record the decision, weighing the NG25 1.8.1 factors. With suspected infection or bleeding the prompt says it may be contraindicated.",
    severity: "Warning", alertIds: ["preterm-tocolysis"],
    sources: ["NG25 1.8.1", "NG25 1.8.4"],
  },
  {
    id: "preterm-neonatal", group: "Preterm", title: "Neonatal team",
    when: "Under the unit's gestation (default 34+0) and the neonatal team not yet informed.",
    then: "Inform the neonatal team. Tap Done to clear.",
    severity: "Urgent", alertIds: ["preterm-neonatal"], sources: [], settings: ["neonatalTeamUnderWk"],
    local: "The gestation cut-off is a unit setting; no national number.",
  },

  // ── Antibiotics and membranes ──────────────────────────────────────────
  {
    id: "gbs-iap", group: "Antibiotics and membranes", title: "GBS: intrapartum antibiotics",
    when: "GBS positive this pregnancy; a previous baby with GBS disease; or GBS in a previous pregnancy without a negative swab at 35 to 37 weeks this pregnancy. In labour, or from 37+0 as soon as the membranes rupture; antibiotics not yet given. Before 37+0, ruptured membranes alone (PPROM) do not count, and an induction still latent with intact membranes is not yet labour.",
    then: "First dose as soon as possible, continue until birth. Regimen from GL787. Never hidden by the PROM alerts.",
    severity: "Urgent", alertIds: ["gbs-iap"],
    sources: ["NG195 1.6.1", "NG195 1.6.4", "GTG36 5.3", "GTG36 5.4", "GTG36 7.1", "GTG36 8.1.1", "GL787 GBS"],
  },
  {
    id: "infection-suspected", group: "Antibiotics and membranes", title: "Suspected chorioamnionitis or sepsis",
    when: "Risk flag \"Suspected chorioamnionitis or sepsis\" ticked, or a temperature of 38°C or more recorded, and antibiotics for infection not yet given. GBS prophylaxis does not count.",
    then: "IV antibiotics now, first dose as soon as infection is suspected; continuous CTG; senior review. Replaces the GBS and preterm antibiotic prompts, since broad-spectrum treatment covers GBS (GL787).",
    severity: "Urgent", alertIds: ["infection-suspected"],
    sources: ["NG195 1.6.1", "NG195 1.6.4", "NG229 1.3.2", "NG229 1.3.8", "GL787 GBS", "GL787 PROM"],
  },
  {
    id: "aph", group: "Antibiotics and membranes", title: "Bleeding",
    when: "Risk flag \"Antepartum or fresh bleeding\" ticked and not yet reviewed.",
    then: "Urgent obstetric review and continuous CTG. Tap Reviewed once seen; the flag stays for handover and as a CTG indication.",
    severity: "Urgent", alertIds: ["aph"],
    sources: ["NG235 1.8.20", "NG229 1.3.2", "NG229 1.3.8"],
  },
  {
    id: "iap-preterm", group: "Antibiotics and membranes", title: "Preterm labour: intrapartum antibiotics",
    when: "Under 37+0, in labour, not GBS+ (that has its own alert), antibiotics not yet given. Waters broken without labour (PPROM) does not count until labour starts.",
    then: "Offer antibiotics in labour, first dose as soon as possible.",
    severity: "Urgent", alertIds: ["iap-preterm"],
    sources: ["NG195 1.6.1", "NG195 1.6.4", "GL787 PROM"],
  },
  {
    id: "gbs-prom-birth", group: "Antibiotics and membranes", title: "GBS positive and waters broken: offer immediate birth",
    when: "Spontaneous rupture of membranes before established labour, 34+0 or later, GBS positive this pregnancy, no induction yet started.",
    then: "Offer immediate induction of labour or caesarean birth, with intrapartum antibiotics. Tap Offered once discussed. Fires as soon as the waters break, not at 24 hours.",
    severity: "Urgent", alertIds: ["gbs-prom-birth"],
    sources: ["NG207 1.2.12", "NG207 1.2.16", "NG195 1.7.1"],
  },
  {
    id: "prom-48h", group: "Antibiotics and membranes", title: "Membranes ruptured 48 hours",
    when: "Membranes ruptured for the unit's time (default 48 hours, as GL787), not GBS+, antibiotics not yet given.",
    then: "Antibiotic prophylaxis indicated per GL787.",
    severity: "Urgent", alertIds: ["prom-48h"], sources: ["GL787 PROM"], settings: ["promAntibioticH"],
  },
  {
    id: "prom-24h", group: "Antibiotics and membranes", title: "Prelabour rupture of membranes at term: 24 hours",
    when: "37+0 or later, membranes ruptured 24 hours or more, still latent.",
    then: "Offer induction of labour.",
    severity: "Urgent", alertIds: ["prom-24h"], sources: ["NG235 1.7.6", "NG235 1.7.7", "GTG36 7.1"],
  },
  {
    id: "meconium", group: "Antibiotics and membranes", title: "Meconium",
    when: "Thick or thin meconium recorded at a VE or on admission.",
    then: "Continuous CTG (mandatory or offered, per unit setting); thick meconium also prompts neonatal support at birth.",
    severity: "Urgent (thick), warning (thin)", alertIds: ["mec-thick", "mec-thin"],
    sources: ["NG235 1.8.33", "NG229 1.3.8", "NG229 1.3.11"], settings: ["meconiumCTGMandatory"],
    local: "Making continuous CTG mandatory with meconium is a unit choice. NICE says offer it and support the woman's choice (NG229 1.3.11).",
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
    when: "Latent for the unit's interval (default 6 hours) since admission, or since induction started.",
    then: "Reassess to confirm or exclude established labour.",
    severity: "Warning", alertIds: ["latent-reassess"], sources: ["NG235 1.8.1"], settings: ["latentReassessH"],
    local: "The interval is a unit setting; NG235 1.8.1 gives the definition of established labour only.",
  },
  {
    id: "ve-4h", group: "Labour progress", title: "Vaginal examination timing",
    when: "Established first stage: no VE yet (urgent). Otherwise amber when a VE is due (4 hours after the last, or 2 hours after delay is suspected; on oxytocin, 4 hours after it started, then 4-hourly), red 30 minutes later.",
    then: "Offer a VE. After suspected delay, diagnose delay if progress is less than 1 cm.",
    severity: "Warning, then urgent", alertIds: ["ve-never", "ve-due", "ve-overdue"], sources: ["NG235 1.8.19", "NG235 1.8.45", "NG235 1.8.58", "NG235 1.8.59"],
    local: "Turning red 30 minutes after the VE is due is a unit choice. NICE times the VE; it sets no overdue point. On oxytocin NICE times the VE from when the infusion has led to regular contractions; the app counts from the start. After a restart NICE leaves the timing to clinical assessment; the app reminds at 4 hours.",
  },
  {
    id: "slow-progress", group: "Labour progress", title: "Delay in the first stage",
    when: "Established first stage VEs. Suspected: under 2 cm in about 4 hours (or under 1 cm in 2 hours). Diagnosed: under 1 cm at the VE 2 hours after delay was suspected. Confirmed: no progress at the VE 2 hours after an amniotomy. 5 minute tolerance on the timings.",
    then: "Suspected: re-examine in 2 hours (the VE timer switches to 2 hours). Diagnosed: consider amniotomy if membranes are intact, then VE 2 hours later; if already ruptured, obstetric review including consideration of oxytocin. Confirmed: obstetric-led care and a full obstetric assessment including consideration of oxytocin.",
    severity: "Urgent", alertIds: ["slow-progress"],
    sources: ["NG235 1.8.42", "NG235 1.8.45", "NG235 1.8.46", "NG235 1.8.48", "NG235 1.8.49", "NG235 1.8.50"],
  },
  {
    id: "oxytocin-poor-progress", group: "Labour progress", title: "Progress on oxytocin",
    when: "First VE about 4 hours or more after oxytocin started, compared with the VE about 4 hours before it: under 2 cm gained. 5 minute tolerance on the timings. VEs after oxytocin starts are judged by this rule, not the delay steps.",
    then: "Further obstetric review to assess whether a caesarean birth is advisable. 2 cm or more: 4-hourly VEs.",
    severity: "Urgent", alertIds: ["oxytocin-poor-progress"], sources: ["NG235 1.8.58"],
  },
  {
    id: "active-phase-limit", group: "Labour progress", title: "Long established first stage",
    when: "Established first stage over 18 hours (first labour) or 12 hours (later labours).",
    then: "Review progress against the delay criteria.",
    severity: "Warning", alertIds: ["active-phase-limit"], sources: ["NG235 1.8.36"],
  },
  {
    id: "arm", group: "Labour progress", title: "After amniotomy",
    when: "2 hours after ARM in the established first stage with no VE since.",
    then: "Repeat VE; if no progress, diagnose delay and obtain obstetric review including consideration of oxytocin.",
    severity: "Warning", alertIds: ["arm-reassess"],
    sources: ["NG235 1.8.48", "NG235 1.8.49", "NG235 1.8.50"],
  },

  // ── Second stage ───────────────────────────────────────────────────────
  {
    id: "passive", group: "Second stage", title: "Passive second stage",
    when: "With an epidural: 2 hours (first labour) or 1 hour (later labours) since full dilatation. Without: 1 hour with no urge to push.",
    then: "With an epidural, actively encourage pushing; without, offer further assessment.",
    severity: "Urgent", alertIds: ["passive-limit"],
    sources: ["NG235 1.6.34", "NG235 1.9.8"],
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
    then: "Stop oxytocin immediately; urgent obstetric or senior midwife review. One alert covers both: it replaces the pathological CTG alert until the stop is logged, then that alert takes over. The Stop oxytocin button opens the oxytocin sheet to log the stop and its reason; it cannot be snoozed.",
    severity: "Urgent", alertIds: ["oxytocin-stop-pathological"], sources: ["NG235 1.8.56", "NG229 1.5.7", "NG229 1.5.8"],
  },
  {
    id: "oxytocin-increment", group: "Oxytocin and contractions", title: "Oxytocin dose review",
    when: "First stage, 30 minutes since the last change, a CTG on record, and none of: dose held, 3 or more contractions in 10 already (the target), suspicious or pathological CTG.",
    then: "Review whether to increase towards 3 to 4 contractions in 10 minutes.",
    severity: "Warning", alertIds: ["oxytocin-increment"], sources: ["NG235 1.8.54"],
  },
  {
    id: "oxytocin-max", group: "Oxytocin and contractions", title: "Oxytocin at maximum",
    when: "Dose at or above the unit maximum (default 20 mU/min).",
    then: "Escalate to registrar or consultant.",
    severity: "Urgent", alertIds: ["oxytocin-max"], sources: [], settings: ["oxytocinMax"],
    local: "The maximum is a unit setting; starting dose and step size are local protocol.",
  },

  // ── CTG ────────────────────────────────────────────────────────────────
  {
    id: "ctg-classify", group: "Fetal monitoring (CTG)", title: "How the app grades a CTG",
    when: "4 features, each white, amber or red. Contractions: amber at 5 or more in 10, or hypertonus. Baseline: white 110 to 160; amber 100 to 109, a rise of 20 bpm or more from the start of labour or the last review, or unable to determine; red below 100 or above 160, and a 20 bpm rise in the active second stage. Variability: amber under 5 for 30 to 50 min or over 25 for up to 10 min; red under 5 for over 50 min, over 25 for over 10 min, or sinusoidal. Decelerations: amber repetitive concerning variables for 30 min or less, or non-repetitive for over 30 min; red repetitive concerning variables for over 30 min, late, acute bradycardia or a prolonged deceleration of 3 min or more.",
    then: "Normal: all white. Suspicious: 1 amber. Pathological: 1 red, or 2 or more amber. A clinician can grade a trace pathological on the whole picture; the app never downgrades.",
    severity: "n/a", alertIds: [],
    sources: ["NG229 1.4.12", "NG229 1.4.15", "NG229 1.4.18", "NG229 1.4.24", "NG229 1.4.32", "NG229 1.4.37"],
    local: "NICE does not grade non-repetitive concerning variables present for 30 minutes or less; the app scores them amber (they are not white, which excludes concerning features).",
  },
  {
    id: "ctg-pathological", group: "Fetal monitoring (CTG)", title: "Pathological CTG",
    when: "Latest CTG pathological, any stage of labour including latent and induction.",
    then: "Urgent obstetric and senior midwife review, exclude acute events, conservative measures; consider expediting birth if it persists.",
    severity: "Urgent", alertIds: ["ctg-pathological"], sources: ["NG229 1.5.7", "NG229 1.5.8"],
  },
  {
    id: "ctg-suspicious", group: "Fetal monitoring (CTG)", title: "Suspicious CTG",
    when: "Latest CTG suspicious, any stage. Becomes urgent if not reassessed within the unit's interval (default 30 minutes). Each CTG review can carry a short comment (for example \"discussed with registrar\"), shown on the card and in handover.",
    then: "Full risk assessment and conservative measures; urgent review if other risk factors.",
    severity: "Warning, then urgent", alertIds: ["ctg-suspicious", "ctg-suspicious-overdue"],
    sources: ["NG229 1.5.5", "NG229 1.5.6"], settings: ["suspiciousRecheckMin"],
    local: "The reassessment interval is a unit setting; NG229 does not set a time.",
  },
  {
    id: "ctg-indicated", group: "Fetal monitoring (CTG)", title: "Continuous CTG, not logged",
    when: "Established labour or oxytocin running and no CTG logged. By default this applies to every woman (unit setting). With that setting off, only when there is an indication: previous CS or other uterine scar, hypertension, diabetes (not diet-only GDM), bleeding, suspected infection, ROM 24 h+ before established labour, non-cephalic, growth restriction, reduced movements, poly- or anhydramnios, over 42+0, meconium, blood-stained liquor, pyrexia, pulse over 120, raised BP, delay, epidural, oxytocin.",
    then: "Log a CTG review.",
    severity: "Warning with an indication, otherwise info", alertIds: ["ctg-not-documented"], sources: ["NG229 1.2.9", "NG229 1.3.2", "NG229 1.3.3", "NG229 1.3.8"],
    settings: ["ctgForAll", "ctgLocalIndications"],
    local: "Continuous CTG for everyone is a unit choice: NICE offers intermittent auscultation to women at low risk (NG229 1.2.9). Preterm, GBS+ and PPROM can be added as local indications; they are not NG229 indications.",
  },
  {
    id: "ctg-hourly", group: "Fetal monitoring (CTG)", title: "Hourly CTG review",
    when: "On continuous CTG (everyone by default, see above), established labour or oxytocin, and an hour since the last review.",
    then: "Hourly assessment with a fresh-eyes review. Grey when due; amber, then red, once overdue by the unit's times (default 15 and 30 minutes).",
    severity: "Info, then warning, then urgent", alertIds: ["ctg-review-due"], sources: ["NG229 1.3.5", "NG229 1.3.6"], settings: ["ctgForAll", "ctgReviewAmberMin", "ctgReviewRedMin"],
    local: "NICE asks for an hourly review; the overdue colours and their timings are unit choices.",
  },

  // ── Maternal observations ──────────────────────────────────────────────
  {
    id: "obs-due", group: "Maternal observations", title: "Routine observations",
    when: "Established labour: pulse hourly; BP, temperature and respiratory rate 4-hourly (BP hourly if hypertensive).",
    then: "Shown as \"Obs due\" on the board. Recorded values stay on the board, with their age, until a newer value replaces them; marking obs done never erases a value.",
    severity: "Info (BP urgent if hypertensive)", alertIds: ["pulse-due", "pulse-never", "bp-due", "bp-never", "temp-due", "temp-never", "rr-due", "rr-never"],
    sources: ["NG235 1.8.19", "NG133 1.7.3"],
  },
  {
    id: "temp", group: "Maternal observations", title: "Raised temperature",
    when: "38.0°C or above (urgent), 37.5 to 37.9°C (warning).",
    then: "In labour: transfer trigger and indication for continuous CTG; antibiotics if chorioamnionitis suspected; repeat 37.5 in 1 hour. After birth, 38.0°C or above: assess for sepsis, grading risk with the NG255 criteria for people recently pregnant; senior review.",
    severity: "Urgent / warning", alertIds: ["temp-38", "temp-375"],
    sources: ["NG235 1.8.20", "NG229 1.3.8", "NG195 1.6.1", "NG195 1.6.4", "NG255 1.5.1", "NG255 1.5.2"],
  },
  {
    id: "tachycardia", group: "Maternal observations", title: "Maternal tachycardia",
    when: "Pulse over 130: urgent at once. Pulse over 120: amber on the first reading; urgent if a repeat within the hour is also over 120, or no repeat within 30 minutes.",
    then: "Repeat the pulse; then assess for bleeding, sepsis, PE or pain and escalate.",
    severity: "Warning, then urgent", alertIds: ["tachycardia"], sources: ["NG235 1.8.20", "NG255 table 1"],
    local: "NG235 asks for 2 readings over 120, 15 to 30 minutes apart. Red when not repeated within 30 minutes is a unit choice.",
  },
  {
    id: "bp-high", group: "Maternal observations", title: "Raised blood pressure",
    when: "160/110 or more (urgent). 140/90 or more (urgent if known hypertensive, otherwise warning).",
    then: "Treat severe hypertension urgently per protocol; BP every 15 to 30 minutes until below 160/110. After 30 minutes without a new reading the alert asks for a recheck.",
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
    id: "rr", group: "Maternal observations", title: "Respiratory rate",
    when: "25 or more: urgent at once (NG255). Under 9: urgent at once. 21 to 24: amber on the first reading; urgent if a repeat within the hour is also 21 or more, or no repeat within 30 minutes.",
    then: "Repeat a borderline reading; senior review and consider sepsis.",
    severity: "Warning, then urgent", alertIds: ["rr-high", "rr-low"],
    sources: ["NG255 table 1", "NG235 1.8.20"],
    local: "NG235 asks for 2 readings 15 to 30 minutes apart. Red at once below 9, and red when not repeated within 30 minutes, are unit choices.",
  },
  {
    id: "mgso4-pet", group: "Maternal observations", title: "Magnesium sulfate: severe pre-eclampsia or eclampsia",
    when: "Eclampsia risk ticked (a fit now or earlier this pregnancy) and magnesium not running: urgent, give. Pre-eclampsia ticked with severe BP (160/110 or more) or low urine output: urgent, consider. Before or after birth. Magnesium already running for neuroprotection counts.",
    then: "Eclampsia: give IV magnesium sulfate (Collaborative Eclampsia Trial regimen); no other anticonvulsant instead. Pre-eclampsia: check for severe features (headache, visual scotomata, vomiting, epigastric pain, oliguria with severe hypertension, worsening bloods) and consider magnesium sulfate if any. A severe BP keeps the prompt up after a lower repeat until Assessed is tapped. Tap Given or Assessed to clear.",
    severity: "Urgent", alertIds: ["mgso4-eclampsia", "mgso4-severe-pet"],
    sources: ["NG133 1.8.1", "NG133 1.8.2", "NG133 1.8.3", "NG133 1.8.4", "NG133 1.8.5"],
    local: "NG133 section 1.8 is written for a critical care setting. The app prompts on the delivery suite board too, using severe BP or low urine output as the trigger to check for severe features.",
  },
  {
    id: "oliguria", group: "Maternal observations", title: "Low urine output",
    when: "Optional: only if someone records urine output (under More in the bed record), and it is under the unit threshold (default 30 mL per hour).",
    then: "Amber: review fluid balance and escalate if concerned. No reminders to record it.",
    severity: "Warning", alertIds: ["oliguria"], sources: [], settings: ["oliguriaMlH"],
    local: "The threshold is a unit setting; NICE sets none for labour.",
  },

  // ── Diabetes ───────────────────────────────────────────────────────────
  {
    id: "bgl", group: "Diabetes", title: "Capillary glucose in labour",
    when: "Diabetic flag: hourly glucose due; value under 4 or over 7 mmol/L.",
    then: "Keep 4 to 7 mmol/L; IV dextrose and insulin if not maintained (local VRII protocol).",
    severity: "Urgent", alertIds: ["bgl-due", "bgl-never", "bgl-low", "bgl-high"],
    sources: ["NG3 1.4.10", "NG3 1.4.12", "GL983 intrapartum"],
    local: "Hourly for every diabetic flag, by choice, following NG3. GL983 allows 2-hourly for type 2 diabetes on metformin or diet with glucose at or below 7.",
  },

  // ── Board ──────────────────────────────────────────────────────────────
  {
    id: "bed-stale", group: "Board", title: "Is she still here?",
    when: "No entry on her record for the unit's time (default 3 hours). Any change to the record, or Still here, restarts the clock.",
    then: "Still here restarts the clock. Not here opens her full record to update her or remove her from the board.",
    severity: "Warning", alertIds: ["bed-stale"], sources: [], settings: ["staleBedH"],
    local: "An app design choice so the board does not show women who have left.",
  },

  // ── After birth ────────────────────────────────────────────────────────
  {
    id: "pph", group: "After birth", title: "Postpartum haemorrhage",
    when: "Recorded EBL 500 to 1000 mL (minor) or over 1000 mL (major). After a caesarean the alert starts at the unit's setting (default 500 mL, as GTG52).",
    then: "Minor: warning, with the GTG52 first measures. Major: urgent; senior multidisciplinary team if still bleeding or shocked; over 1500 mL, incident review. Reviewed quiets it for the unit's time (default 60 minutes); it then returns while she is on the board.",
    severity: "Warning / urgent", alertIds: ["pph"], sources: ["GTG52 definitions"], settings: ["pphCsMl"],
    local: "GTG52 uses 500 mL after any birth. A higher start after caesarean is a unit choice.",
  },
];

export const RULE_FOR_ALERT = Object.fromEntries(RULES.flatMap(r => r.alertIds.map(id => [id, r])));
