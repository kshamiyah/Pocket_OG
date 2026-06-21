export const PPROM_PROTOCOL = {
  id: "pprom",
  title: "?PPROM / ?SROM",
  subtitle: "Prelabour rupture of membranes — assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG73 · NICE NG25",
  color: "teal",
  startId: "emergency_q",
  nodes: {

    // ─── Safety check first ────────────────────────────────────────────────────

    "emergency_q": {
      type: "question",
      question: "Is there an immediate emergency?",
      subtitle: "Cord prolapse, heavy bleeding, or signs of acute fetal compromise",
      options: [
        { label: "No — she is stable",                   next: "gestation_q"        },
        { label: "Yes — cord prolapse / major bleeding",  next: "immediate_emergency" },
      ],
    },

    "immediate_emergency": {
      type: "escalation",
      title: "Obstetric emergency — act now",
      alert: "Call 2222. This cannot wait.",
      items: [
        "Cord prolapse → elevate presenting part manually, call emergency team, prepare for emergency CS",
        "Major bleeding → activate major haemorrhage protocol",
        "Acute fetal compromise → call consultant, prepare theatre",
        "Do not leave the patient — get help to come to you",
      ],
      next: "history",
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    // ─── Gestation ────────────────────────────────────────────────────────────

    "gestation_q": {
      type: "question",
      question: "What's the gestation?",
      options: [
        { label: "Before 24 weeks",       sublabel: "Pre-viable",                    next: "pre24_path"         },
        { label: "24+0 to 33+6 weeks",    sublabel: "Preterm — admit and stabilise", next: "history"            },
        { label: "34+0 to 36+6 weeks",    sublabel: "Late preterm",                  next: "history"            },
        { label: "37 weeks or later",     sublabel: "Term SROM",                     next: "history"            },
      ],
    },

    "pre24_path": {
      type: "escalation",
      title: "PPROM before 24 weeks — consultant involvement required",
      alert: "PPROM before viability carries very high morbidity and mortality. Do not manage alone.",
      items: [
        "Involve consultant obstetrician and neonatology team immediately",
        "Counsel patient: prognosis depends heavily on gestation and extent of membrane rupture",
        "Risk of pulmonary hypoplasia, limb deformities, and infection is high at this gestation",
        "Full infection screen: FBC, CRP, HVS, MSU",
        "Serial USS for liquor volume and fetal growth",
        "Expectant management vs termination — senior counselling and patient decision required",
        "Document full counselling conversation",
      ],
      next: "history",
      // VERIFY: pulmonary hypoplasia, limb deformities, and serial USS specifics are PPROM-specific (RCOG GTG73) and not directly covered in NG25; periviable counselling framework covered in NG25
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    // ─── History & examination ─────────────────────────────────────────────────

    "history": {
      type: "checklist",
      title: "Take a focused history",
      items: [
        "Onset — sudden gush vs slow trickle; ongoing or settled",
        "Colour of fluid — clear, blood-stained, green (meconium), or offensive",
        "Gestation — confirm exact dates",
        "Fetal movements since rupture",
        "Uterine contractions or abdominal pain",
        "Cervical cerclage in situ — document and plan removal",
        "GBS status — known positive swab at any point in this pregnancy",
        "Risk factors for chorioamnionitis: previous PPROM, recent VE, cervical instrumentation",
      ],
      next: "examination",
      // VERIFY: PPROM-specific history items (cerclage removal, chorioamnionitis risk factors) are not individually enumerated in NG25; risk factor framework covered in NG25 overview
      source: { gl: "NG25", sectionId: "ng25-overview", label: "Overview & Definitions" },
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BP, HR, temperature, RR, SpO₂ — watch for maternal tachycardia (>100) or pyrexia",
        "Auscultate fetal heart; apply CTG",
        "Abdominal palpation — uterine tenderness, contractions, fetal lie and presentation",
        "Sterile speculum examination — visualise pooling of amniotic fluid in posterior fornix",
        "Inspect liquor colour and odour — offensive or green raises infection concern",
        "Do NOT perform digital vaginal examination — increases infection risk",
      ],
      next: "speculum_q",
      source: { gl: "NG25", sectionId: "ng25-diagnosis", label: "Diagnosis" },
    },

    // ─── Confirm diagnosis ────────────────────────────────────────────────────

    "speculum_q": {
      type: "question",
      question: "What did the speculum show?",
      options: [
        { label: "Pooling of clear fluid confirmed",    sublabel: "PPROM/SROM clinically confirmed",  next: "pprom_confirmed"  },
        { label: "No pooling visible",                  sublabel: "Diagnosis uncertain",               next: "swab_q"           },
        { label: "Green or offensive liquor",           sublabel: "Meconium or infection concern",     next: "meconium_concern" },
      ],
    },

    "meconium_concern": {
      type: "escalation",
      title: "Meconium or offensive liquor — escalate",
      alert: "Meconium-stained or offensive liquor raises concern for fetal compromise or chorioamnionitis.",
      items: [
        "Call registrar now",
        "Apply CTG — continuous monitoring",
        "FBC and CRP urgently — infection markers",
        "Maternal temperature, HR every hour",
        "If chorioamnionitis suspected: IV antibiotics and expedite delivery regardless of gestation",
      ],
      next: "pprom_confirmed",
      // VERIFY: meconium escalation pathway and chorioamnionitis expedite-delivery rule are not explicitly stated in NG25; NG25 tocolysis section confirms chorioamnionitis is a contraindication to tocolysis and implies delivery
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    "swab_q": {
      type: "question",
      question: "Was a confirmatory swab (IGFBP-1 or PAMG-1) sent?",
      subtitle: "e.g. ActimProm or AmniSure — useful when speculum is inconclusive",
      options: [
        { label: "Yes — result positive",     next: "pprom_confirmed" },
        { label: "Yes — result negative",     next: "srom_unlikely"   },
        { label: "Not yet / result pending",  next: "pending_swab"    },
      ],
    },

    "pending_swab": {
      type: "treatment",
      title: "Awaiting swab result",
      sections: [
        {
          title: "While awaiting",
          items: [
            "Send HVS for MC&S including GBS regardless of swab result",
            "CTG for fetal wellbeing",
            "Send FBC and CRP",
            "Observe for signs of infection or labour",
            "Do not discharge until diagnosis is confirmed or safely excluded",
          ],
        },
      ],
      next: "documentation",
      source: { gl: "NG25", sectionId: "ng25-diagnosis", label: "Diagnosis" },
    },

    "srom_unlikely": {
      type: "treatment",
      title: "Membrane rupture unlikely — negative swab",
      sections: [
        {
          title: "Management",
          items: [
            "Membrane rupture not confirmed on speculum or swab",
            "Consider: urinary incontinence (common in pregnancy), increased vaginal discharge",
            "If symptoms persist or worsen → repeat assessment; consider USS for liquor volume",
            "Advise: return immediately if gush of fluid, offensive discharge, fever, or reduced movements",
          ],
        },
      ],
      next: "documentation",
      source: { gl: "NG25", sectionId: "ng25-diagnosis", label: "Diagnosis" },
    },

    "pprom_confirmed": {
      type: "checklist",
      title: "PPROM/SROM confirmed — investigations",
      items: [
        "CTG — confirm fetal wellbeing; assess for fetal tachycardia or decelerations",
        "FBC — WCC >17 × 10⁹/L raises concern for infection",
        "CRP — elevated >10 mg/L raises concern; trend more useful than single value",
        "HVS — MC&S including GBS (result may take 48 hours)",
        "MSU — exclude UTI as a precipitant",
        "USS — confirm presentation, placental site, amniotic fluid volume (AFI or deepest pool), EFW",
      ],
      next: "infection_q",
      // VERIFY: specific infection thresholds (WCC >17, CRP >10) and PPROM investigation panel are not individually listed in NG25; general assessment framework covered in NG25 overview
      source: { gl: "NG25", sectionId: "ng25-overview", label: "Overview & Definitions" },
    },

    // ─── Infection screen ──────────────────────────────────────────────────────

    "infection_q": {
      type: "question",
      question: "Any signs of chorioamnionitis?",
      subtitle: "Use combination — no single marker is reliable alone",
      options: [
        { label: "No signs currently",               next: "gestation_mgmt_q"    },
        { label: "Yes — one or more signs present",  next: "chorioamnionitis_now" },
      ],
    },

    "chorioamnionitis_now": {
      type: "escalation",
      title: "Chorioamnionitis suspected — escalate now",
      alert: "Clinical chorioamnionitis = expedite delivery regardless of gestation.",
      items: [
        "Maternal pyrexia ≥37.5°C, tachycardia >100, fetal tachycardia >160 bpm",
        "Uterine tenderness on palpation",
        "Offensive or discoloured (green/brown) liquor",
        "Raised CRP (>10 mg/L) or WCC (>17 × 10⁹/L)",
        "Call registrar immediately — IV antibiotics and expedite delivery",
        "IV antibiotics per local trust protocol (do not delay for cultures)",
      ],
      next: "documentation",
      // VERIFY: chorioamnionitis diagnostic criteria (specific temperature/HR/fetal HR thresholds) are not enumerated in NG25; NG25 tocolysis section identifies chorioamnionitis as a contraindication; expedite-delivery rule is PPROM/GTG73 guidance
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    // ─── Management by gestation ───────────────────────────────────────────────

    "gestation_mgmt_q": {
      type: "question",
      question: "Which gestation band applies?",
      subtitle: "Management differs significantly",
      options: [
        { label: "24+0 to 33+6 weeks",  next: "early_preterm_mgmt" },
        { label: "34+0 to 36+6 weeks",  next: "late_preterm_mgmt"  },
        { label: "37 weeks or later",   next: "term_mgmt_q"        },
      ],
    },

    "early_preterm_mgmt": {
      type: "treatment",
      title: "24–33+6 weeks — admit and stabilise",
      sections: [
        {
          title: "Immediate management",
          items: [
            "Admit to hospital — inpatient management throughout",
            "Antibiotics — per local trust protocol (RCOG recommends erythromycin 250 mg QDS × 10 days or until labour)",
            "Corticosteroids — betamethasone 12 mg IM × 2 doses, 24 hours apart",
            "Magnesium sulphate — for neuroprotection if <30 weeks or delivery anticipated <34 weeks; per local protocol",
            "Expectant management until 37+0 weeks if no contraindications",
            "Do NOT perform digital vaginal examination",
          ],
        },
        {
          title: "Monitoring schedule",
          items: [
            "Maternal observations minimum 4-hourly: temperature, HR, BP",
            "Daily FBC and CRP",
            "CTG twice daily as minimum; more if clinically indicated",
            "USS weekly for liquor volume and fetal growth",
          ],
        },
      ],
      next: "escalation",
      // VERIFY: erythromycin 250 mg QDS × 10 days is PPROM-specific antibiotic guidance (ORACLE I trial / RCOG GTG73) and is not covered in NG25; MgSO4 up to 34 weeks extends slightly beyond NG25's primary threshold of <30 weeks (NG25 says "consider up to 33+6")
      source: { gl: "NG25", sectionId: "ng25-steroids", label: "Corticosteroids" },
    },

    "late_preterm_mgmt": {
      type: "treatment",
      title: "34+0 to 36+6 weeks",
      sections: [
        {
          title: "Management",
          items: [
            "Admit to hospital",
            "Antibiotics — per local trust protocol",
            "Corticosteroids — consider up to 35+6 weeks (discuss with senior; weigh risks vs benefits)",
            "Discuss with patient: expectant management until 37+0 weeks vs IOL — shared decision-making",
            "No routine IOL before 34+0 weeks unless infection or fetal compromise",
          ],
        },
        {
          title: "Monitoring schedule",
          items: [
            "Maternal observations minimum 4-hourly",
            "Daily FBC and CRP",
            "CTG twice daily minimum",
          ],
        },
      ],
      next: "escalation",
      // VERIFY: corticosteroids up to 35+6 weeks in PPROM context and IOL timing for late-preterm PPROM are covered in NG25 steroids section (offer up to 35+6 weeks) and transfer section; antibiotic use at 34–36+6 is PPROM-specific guidance not individually addressed in NG25
      source: { gl: "NG25", sectionId: "ng25-steroids", label: "Corticosteroids" },
    },

    "term_mgmt_q": {
      type: "question",
      question: "What's the GBS status?",
      subtitle: "Drives timing of IOL at term",
      options: [
        { label: "GBS positive",              sublabel: "Known positive swab this pregnancy",  next: "gbs_positive" },
        { label: "GBS negative or unknown",   sublabel: "Or no result available",              next: "gbs_negative" },
      ],
    },

    "gbs_positive": {
      type: "treatment",
      title: "Term SROM — GBS positive",
      sections: [
        {
          title: "Management",
          items: [
            "Offer immediate IOL or caesarean birth",
            "IV antibiotics in labour — per local protocol (usually benzylpenicillin)",
            "Continuous EFM in labour",
            "Neonatology review after birth",
          ],
        },
      ],
      next: "documentation",
      // VERIFY: GBS-positive SROM management (immediate IOL, benzylpenicillin) is PPROM/GBS-specific guidance (RCOG GTG36b) and not individually covered in NG25; delivery decision framework is covered in NG25 transfer section
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    "gbs_negative": {
      type: "treatment",
      title: "Term SROM — GBS negative or unknown",
      sections: [
        {
          title: "Management",
          items: [
            "Discuss expectant management vs IOL with patient",
            "Most units offer IOL if not in established labour within 24 hours — follow local protocol",
            "IV antibiotics in labour if chorioamnionitis suspected",
            "Continuous EFM in labour",
          ],
        },
        {
          title: "Monitoring while expectant",
          items: [
            "Maternal observations 4-hourly — watch for pyrexia and tachycardia",
            "Fetal heart rate checks regularly — apply CTG if any concerns",
            "Report offensive or discoloured liquor immediately",
          ],
        },
      ],
      next: "documentation",
      // VERIFY: IOL within 24 hours for term SROM and expectant monitoring specifics are PPROM-specific guidance (NICE CG55 / RCOG GTG73) not individually addressed in NG25; delivery decision and intrapartum CTG covered in NG25 transfer section
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    // ─── Escalation ───────────────────────────────────────────────────────────

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "Signs of chorioamnionitis — pyrexia, tachycardia (maternal or fetal), offensive liquor, uterine tenderness",
        "Abnormal or suspicious CTG at any stage",
        "Cord prolapse on speculum — obstetric emergency",
        "Significant antepartum haemorrhage",
        "Meconium-stained liquor",
        "Patient in established labour at any gestation",
        "Rapidly falling liquor volume on USS",
        "Patient distressed or requesting delivery — senior shared decision-making required",
      ],
      next: "documentation",
      source: { gl: "NG25", sectionId: "ng25-transfer", label: "Transfer & Delivery" },
    },

    // ─── Documentation ────────────────────────────────────────────────────────

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Gestation at presentation",
        "Onset and character of fluid loss — colour, odour, amount",
        "Speculum findings — pooling confirmed or not; swab result if used",
        "CTG result",
        "Investigations sent — FBC, CRP, HVS, MSU, USS findings",
        "GBS status documented",
        "Antibiotics prescribed — drug, dose, route, start date and time (per local protocol)",
        "Corticosteroids if given — drug, dose, batch, time, gestation",
        "Magnesium sulphate if given — indication, dose, monitoring plan",
        "Management plan — expectant vs IOL; senior review plan",
        "Consent discussion documented — risks of expectant management explained",
        "Safety-netting: patient advised of signs of infection and when to call urgently",
      ],
      source: { gl: "NG25", sectionId: "ng25-overview", label: "Overview & Definitions" },
    },

  },
};
