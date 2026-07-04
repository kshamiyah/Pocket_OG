// GL895 (PPRoM) + GL861 (Term PLRoM) — Rupture of Membranes triage
// Suspected SROM / leaking fluid → confirm ROM → classify by gestation →
// term (GL861) or preterm (GL895) management pathway.

export const GL895_ROM_TRIAGE_FLOWCHART = {
  id: "GL895_ROM_TRIAGE",
  title: "Rupture of Membranes: PROM / PPRoM Triage",
  subtitle: "GL895 PPRoM · GL861 Term PLRoM",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Suspected SROM / Leaking Fluid",
      text: "Initial assessment for every woman presenting with suspected rupture of membranes.",
      items: [
        "Maternal observations — BP, HR, RR, temperature — and MEOWS score",
        "Confirm gestational age using ultrasound CRL (scanned 8–13+6 weeks) or HC thereafter",
        "Abdominal palpation for presentation and fifths palpable; bedside ultrasound to confirm presentation if needed",
        "Avoid digital vaginal examination — increases infection risk and releases prostaglandins, which may stimulate contractions",
      ],
      next: "gestation",
    },

    "gestation": {
      type: "decision",
      title: "How many weeks is she?",
      text: "Gestation classifies the presentation and selects the pathway.",
      options: [
        { label: "≥ 37+0 weeks: Term PLRoM", sublabel: "GL861 pathway · assessment, expectant management or IOL", next: "term-assess" },
        { label: "< 37+0 weeks: PPRoM", sublabel: "GL895 pathway · admission, antibiotics, steroids or transfer", next: "pprom-assess" },
      ],
    },

    // ── TERM ARM (GL861) ──────────────────────────────────────────────

    "term-assess": {
      type: "action",
      title: "Term PLRoM: Assessment",
      text: "Confirm rupture and exclude cord or limb presentation.",
      items: [
        "Auscultate fetal heart in low-risk mothers; CTG for consultant-care patients or any concern",
        "If liquor is obvious: sterile speculum examination to exclude cord/limb presentation",
        "If no liquor seen: sterile speculum examination to confirm SROM",
        "If still no liquor seen on speculum: perform AmniSure test",
        "Provide 'Pre-labour Rupture of Membranes' leaflet",
      ],
      next: "term-confirm",
    },

    "term-confirm": {
      type: "decision",
      title: "Is SROM confirmed?",
      text: "Liquor seen (pooling on speculum) or positive AmniSure confirms rupture of membranes.",
      options: [
        { label: "Yes, liquor seen or AmniSure positive", next: "term-cord" },
        { label: "No, speculum dry and AmniSure negative", sublabel: "Consider other causes of leaking", next: "not-confirmed" },
      ],
    },

    "term-cord": {
      type: "decision",
      title: "Cord or limb presentation on speculum?",
      options: [
        { label: "No, cord and limb excluded", next: "term-sepsis" },
        { label: "Cord prolapse", sublabel: "Obstetric emergency", next: "cord-emergency" },
      ],
    },

    "term-sepsis": {
      type: "decision",
      title: "Signs of maternal sepsis or chorioamnionitis?",
      text: "Prompts: pyrexia, maternal tachycardia, uterine tenderness, offensive liquor, fetal tachycardia.",
      options: [
        { label: "No, well, no signs of infection", next: "term-flags" },
        { label: "Yes, clinical features of sepsis", sublabel: "IV antibiotics within 1 hour", next: "sepsis" },
      ],
    },

    "term-flags": {
      type: "decision",
      title: "Meconium, known GBS carrier, or pyrexia ≥ 37.2°C?",
      text: "Any of these means expectant management is not appropriate — offer immediate induction.",
      options: [
        { label: "No, clear liquor, GBS negative/unknown, apyrexial", next: "term-choice" },
        { label: "Yes, meconium, GBS carrier or pyrexia ≥ 37.2°C", sublabel: "Offer immediate induction", next: "term-immediate" },
      ],
    },

    "term-immediate": {
      type: "end",
      title: "Term PLRoM: Immediate Induction",
      text: "Offer immediate induction — discuss with the senior obstetrician and delivery suite coordinator.",
      items: [
        "Known GBS carrier: IV antibiotics from the moment SROM is diagnosed — advise immediate induction",
        "In labour: IV Benzylpenicillin 3g stat, then 1.5g 4-hourly until delivered",
        "Penicillin allergy in labour: Teicoplanin 10mg/kg stat, then 10mg/kg every 12 hours until delivered",
        "Cervix unfavourable (Bishop ≤ 6): consider Propess or Prostin gel after discussion with obstetrician",
        "Propess → commence oxytocin 24 hours later; Prostin → commence oxytocin 6–8 hours later",
      ],
    },

    "term-choice": {
      type: "decision",
      title: "Woman's choice, expectant management or immediate IOL?",
      text: "Offer expectant management for 18–24 hours or immediate induction. Aim: baby born within 48 hours of SROM.",
      options: [
        { label: "Expectant management (18–24 hours)", sublabel: "May wait at home · return advice given", next: "term-expectant" },
        { label: "Immediate induction of labour", next: "term-iol" },
      ],
    },

    "term-expectant": {
      type: "end",
      title: "Term PLRoM: Expectant Management",
      text: "Aim for the baby to be born within 48 hours of SROM. The woman may wait at home.",
      items: [
        "Do NOT perform VE for Bishop score at initial assessment — only when she returns to hospital",
        "Return immediately if: liquor becomes meconium-stained, contractions become regular and painful, pyrexia ≥ 37.2°C, or change in fetal movements",
        "Admit usually 18–24 hours after SROM — woman to phone delivery suite to arrange a suitable time",
        "Record her details (including phone number) on the delivery suite board and inform the DS coordinator",
        "Pyrexia or > 48 hours post-ROM (not in labour): Amoxicillin 1g 8-hourly for 7 days or until established labour",
        "Penicillin allergy (not in labour): Azithromycin 500mg 24-hourly for 7 days or until established labour",
      ],
    },

    "term-iol": {
      type: "end",
      title: "Term PLRoM: Induction of Labour",
      text: "Arrange induction via IOL suite or DAU.",
      items: [
        "Cervix unfavourable (Bishop ≤ 6): consider Propess or Prostin gel after discussion with obstetrician",
        "Midwife may administer Prostin per PGD100 to induce labour 18–24 hours after PROM (term, low risk)",
        "Propess inserted → commence oxytocin 24 hours later; Prostin inserted → commence oxytocin 6–8 hours later",
        "Known GBS carrier: IV antibiotics when SROM diagnosed",
        "In labour: IV Benzylpenicillin 3g stat, then 1.5g 4-hourly until delivered (penicillin allergy: Teicoplanin 10mg/kg 12-hourly)",
        "If augmentation cannot commence within 24 hours (capacity): bring into MAU for full observations, CTG and offer VE for Bishop score; consider Prostin after obstetrician discussion; if capacity remains an issue, admit to postnatal ward to await augmentation and escalate concerns to the obstetric team",
      ],
    },

    // ── PRETERM ARM (GL895) ───────────────────────────────────────────

    "pprom-assess": {
      type: "action",
      title: "PPRoM: Assessment",
      text: "Confirm rupture, screen for infection and establish fetal baseline. Note: normal amniotic fluid on ultrasound does NOT exclude rupture of membranes.",
      items: [
        "Sterile speculum examination with HVS — avoid digital examination",
        "If presence of liquor is in doubt and fluid loss reported within last 12 hours: perform AmniSure test",
        "Bloods for FBC and CRP for baseline results",
        "Urinalysis including culture",
        "Dawes-Redman CTG (from 26 weeks)",
        "Ultrasound scan to assess liquor volume, confirm presentation and estimate fetal weight",
      ],
      next: "pprom-confirm",
    },

    "pprom-confirm": {
      type: "decision",
      title: "Is PPRoM confirmed?",
      text: "Liquor seen (pooling on speculum) or positive AmniSure confirms rupture of membranes.",
      options: [
        { label: "Yes, liquor seen or AmniSure positive", next: "pprom-cord" },
        { label: "No, speculum dry and AmniSure negative", sublabel: "Consider other causes of leaking", next: "not-confirmed" },
      ],
    },

    "pprom-cord": {
      type: "decision",
      title: "Cord or limb presentation on speculum?",
      options: [
        { label: "No, cord and limb excluded", next: "pprom-sepsis" },
        { label: "Cord prolapse", sublabel: "Obstetric emergency", next: "cord-emergency" },
      ],
    },

    "pprom-sepsis": {
      type: "decision",
      title: "Signs of maternal sepsis or chorioamnionitis?",
      text: "Prompts: pyrexia, maternal tachycardia, uterine tenderness, offensive liquor, fetal tachycardia.",
      options: [
        { label: "No, well, no signs of infection", next: "pprom-gestation" },
        { label: "Yes, clinical features of sepsis", sublabel: "IV antibiotics within 1 hour", next: "sepsis" },
      ],
    },

    "pprom-gestation": {
      type: "decision",
      title: "Gestation and plurality?",
      text: "Below 27+0 weeks (singleton) or 28+0 weeks (multiple pregnancy), the unit must be able to provide Level-3 neonatal care.",
      options: [
        { label: "≥ 27+0 weeks (singleton) / ≥ 28+0 weeks (multiple)", sublabel: "Admit for observation", next: "pprom-admit" },
        { label: "< 27+0 weeks (singleton) / < 28+0 weeks (multiple)", sublabel: "In-utero transfer to Level-3 neonatal unit", next: "pprom-transfer" },
      ],
    },

    "pprom-admit": {
      type: "action",
      title: "PPRoM: Admit for 48–72 Hours",
      text: "Admit for observation, antibiotics and antenatal corticosteroids.",
      items: [
        "4-hourly maternal pulse, temperature and respiratory rate with MEOWS (in-patient observation chart)",
        "Daily observation of liquor",
        "CTG if maternal observations suggest developing systemic infection, or if there is uterine activity",
        "Antenatal corticosteroids — discuss benefits and risks with the woman",
        "Antibiotics: oral Amoxicillin 1000mg three times a day for 10 days",
        "Penicillin allergy: oral Azithromycin 500mg once a day for 10 days",
      ],
      next: "pprom-review",
    },

    "pprom-review": {
      type: "decision",
      title: "After 48–72 hours: normal growth scan, no chorioamnionitis, cephalic presentation?",
      text: "Women meeting all three criteria may be suitable for outpatient monitoring until delivery.",
      options: [
        { label: "Yes, all three criteria met", sublabel: "Suitable for outpatient monitoring", next: "pprom-outpatient" },
        { label: "No, any criterion not met", sublabel: "Remain inpatient", next: "pprom-inpatient" },
      ],
    },

    "pprom-outpatient": {
      type: "action",
      title: "PPRoM: Outpatient Management",
      text: "Discharge with clear self-monitoring advice and a structured review schedule.",
      items: [
        "Monitor vaginal loss — self-refer if any change in colour or odour",
        "Twice-daily temperature with a thermometer — refer with any single measurement ≥ 37.5°C",
        "No bathing in water of any kind (including swimming pools); avoid vaginal sexual intercourse",
        "Self-refer for lower abdominal pain or contractions, concerns about fetal movements, or feeling non-specifically 'unwell' (can reflect underlying infection)",
        "Weekly review on MAU — bloods for WBC and CRP plus genital swab",
        "Ultrasound scan every two weeks to assess fetal growth",
        "< 24 weeks' gestation: risk of fetal pulmonary hypoplasia — offer weekly scans to assess liquor volume",
      ],
      next: "pprom-birth",
    },

    "pprom-inpatient": {
      type: "action",
      title: "PPRoM: Continue Inpatient Care",
      text: "Criteria for outpatient monitoring not met — remain inpatient with senior obstetric review.",
      items: [
        "Continue 4-hourly observations with MEOWS and daily observation of liquor",
        "CTG if observations suggest developing infection or there is uterine activity",
        "Delivery before 37 weeks should be considered with objective evidence of infection — senior obstetrician to review and agree an individualised care plan",
      ],
      next: "pprom-birth",
    },

    "pprom-birth": {
      type: "end",
      title: "PPRoM: Planning Birth & GBS",
      text: "Appointment at consultant obstetric clinic at 34 weeks to plan birth.",
      items: [
        "Offer delivery at 37 weeks' gestation (no history of GBS colonisation)",
        "Delivery < 37 weeks considered with objective evidence of infection — senior obstetrician to agree an individualised plan considering obstetric risk factors including malpresentation",
        "Deliver on Delivery Suite with continuous electronic fetal monitoring",
        "IV antibiotics (Benzylpenicillin) recommended at delivery",
        "Chorioamnionitis is independently associated with PPH — management should reflect this",
        "GBS in current or any previous pregnancy, < 34+0 weeks: risks of preterm birth likely outweigh risk of perinatal GBS infection",
        "GBS, ≥ 34+0 weeks: may be more beneficial to recommend delivery — senior obstetrician to develop an individualised plan after discussing risks with the woman",
      ],
    },

    "pprom-transfer": {
      type: "end",
      title: "In-Utero Transfer: Level-3 Neonatal Unit",
      text: "PPRoM below 27+0 weeks (singleton) or 28+0 weeks (multiple pregnancy): advise transfer to a maternity unit able to provide Level-3 neonatal care, organised in accordance with the in-utero transfer protocol (CG508).",
      items: [
        "Loading dose before transfer: IV Benzylpenicillin 3g + Magnesium sulphate 4g slow IV over 10–15 minutes",
        "Exceptions to transfer: signs of severe maternal sepsis, or delivery imminent/expected within 3–4 hours of assessment",
        "Antenatal corticosteroids — discuss benefits and risks with the woman",
        "Antibiotics: oral Amoxicillin 1000mg three times a day for 10 days (penicillin allergy: Azithromycin 500mg once a day)",
        "< 24 weeks' gestation: risk of fetal pulmonary hypoplasia — offer weekly scans to assess liquor volume",
      ],
    },

    // ── SHARED END NODES ──────────────────────────────────────────────

    "not-confirmed": {
      type: "end",
      title: "ROM Not Confirmed",
      text: "No liquor on speculum and AmniSure negative.",
      items: [
        "Remember: normal amniotic fluid measurement on ultrasound does NOT exclude rupture of membranes",
        "Consider other causes of leaking — urinary incontinence, physiological discharge",
        "Safety-net: return if ongoing leaking, reduced fetal movements, abdominal pain, bleeding or fever",
        "If clinical suspicion persists despite negative tests, arrange senior review",
      ],
    },

    "cord-emergency": {
      type: "end",
      title: "Cord Prolapse: Obstetric Emergency",
      text: "Summon help immediately and follow the GTG50 cord prolapse pathway for step-by-step management.",
    },

    "sepsis": {
      type: "end",
      title: "Suspected Sepsis / Chorioamnionitis",
      text: "Infection may cause and complicate rupture of the membranes.",
      items: [
        "IV antibiotics within 1 hour and a full septic screen — see antibiotic guideline GL787",
        "Senior obstetric review — delivery should be expedited if appropriate",
        "Continuous CTG monitoring",
      ],
    },

  },
};
