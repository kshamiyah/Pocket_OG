export const PVB_PROTOCOL = {
  id: "pvb",
  title: "PV Bleeding in Pregnancy",
  subtitle: "Antepartum haemorrhage — assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG63",
  color: "red",
  startId: "bleeding_q",
  nodes: {

    // ─── Opening triage ────────────────────────────────────────────────────────

    "bleeding_q": {
      type: "question",
      question: "How much is she bleeding?",
      subtitle: "Estimate blood loss and assess immediately",
      options: [
        { label: "Spotting",           sublabel: "< 1 teaspoon, settled or settling",        next: "stable_q"         },
        { label: "Minor",              sublabel: "< 50 ml, ongoing but not heavy",           next: "stable_q"         },
        { label: "Major",              sublabel: "50–1000 ml, significant and active",       next: "major_assessment" },
        { label: "Massive / shocked",  sublabel: "> 1000 ml, or clinical shock",             next: "massive_protocol" },
      ],
    },

    "massive_protocol": {
      type: "escalation",
      title: "Massive haemorrhage — activate the protocol now",
      alert: "Activate major haemorrhage protocol immediately. Call the consultant obstetrician.",
      items: [
        "Call 2222 / major haemorrhage protocol — follow your unit's pathway",
        "2× 14G IV access immediately",
        "Bloods: FBC, clotting, crossmatch 4 units, U&E, LFTs",
        "Fluid resuscitation — 0.9% NaCl while awaiting blood products",
        "Activate massive transfusion protocol if required — liaise with haematology",
        "Auscultate fetal heart / apply CTG — prepare for possible emergency delivery",
        "Do NOT leave the patient alone at any point",
      ],
      next: "history",
    },

    // ─── Stability check ───────────────────────────────────────────────────────

    "stable_q": {
      type: "question",
      question: "Is she haemodynamically stable?",
      subtitle: "HR, BP, pallor, consciousness",
      options: [
        { label: "Yes — BP and HR normal, no pallor",       next: "history"       },
        { label: "No — tachycardia, hypotension, or pallor", next: "unstable_now"  },
      ],
    },

    "unstable_now": {
      type: "escalation",
      title: "Haemodynamically compromised — act now",
      alert: "Do not delay. Call the registrar/consultant immediately.",
      items: [
        "2× large-bore IV access — 14G or 16G",
        "Emergency bloods: FBC, crossmatch 4 units, clotting, G&S",
        "IV fluid resuscitation — 0.9% NaCl bolus",
        "Auscultate fetal heart immediately — apply CTG",
        "Call consultant obstetrician NOW — this cannot wait",
        "Prepare for emergency delivery if fetal compromise present",
      ],
      next: "history",
    },

    // ─── History & examination ─────────────────────────────────────────────────

    "major_assessment": {
      type: "checklist",
      title: "Major APH — immediate actions",
      alert: "Digital VE only AFTER USS excludes placenta praevia — NEVER perform blind",
      items: [
        "IV access × 2 — 14G or 16G",
        "FBC, clotting, crossmatch 4 units, G&S",
        "Auscultate fetal heart — apply CTG immediately",
        "Call registrar now — do not manage major APH alone",
        "Consider IV fluid resuscitation if haemodynamically compromised",
      ],
      next: "history",
    },

    "history": {
      type: "checklist",
      title: "Take a focused history",
      items: [
        "Pain character: continuous → suspect abruption; intermittent → consider labour; painless → suspect praevia",
        "Fetal movements — any reduction since bleeding started?",
        "Rupture of membranes — fresh bleeding at SROM → consider vasa praevia",
        "Previous USS for placental site — known low-lying placenta or praevia?",
        "Risk factors for abruption: previous abruption, pre-eclampsia, smoking, trauma, cocaine use",
        "Cervical smear history and any recent instrumentation (lower genital tract cause)",
        "Gestation — confirm exact dates",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Clinical examination",
      alert: "Digital VE only AFTER USS has excluded placenta praevia — NEVER perform blind",
      items: [
        "BP, HR, temperature, RR, SpO₂",
        "Abdominal palpation: tender / woody / board-like uterus → significant abruption",
        "Soft and non-tender uterus → praevia or lower genital tract cause likely",
        "Speculum examination: amount of bleeding, cervical os, ectropion, lower genital tract source",
        "Do NOT perform digital VE until placenta praevia excluded by USS",
        "Auscultate fetal heart or apply CTG",
      ],
      next: "pain_q",
    },

    // ─── Clinical branch: pain character ──────────────────────────────────────

    "pain_q": {
      type: "question",
      question: "Is there any pain?",
      subtitle: "Pain character helps classify the likely cause",
      options: [
        { label: "No pain — painless bleeding",            sublabel: "Praevia or lower genital tract more likely",  next: "placenta_site_q" },
        { label: "Continuous / constant pain",             sublabel: "Suspect abruption",                          next: "abruption_path"  },
        { label: "Crampy / intermittent",                  sublabel: "Possible labour or lower genital tract",     next: "crampy_path"     },
      ],
    },

    "placenta_site_q": {
      type: "question",
      question: "Is the placental site known?",
      subtitle: "From previous USS report or notes",
      options: [
        { label: "Known anterior or fundal — not low",    next: "lower_gt_path"  },
        { label: "Known low-lying or praevia",            next: "praevia_path"   },
        { label: "Not known / no recent USS",             next: "praevia_path"   },
      ],
    },

    "praevia_path": {
      type: "treatment",
      title: "Placenta praevia — manage carefully",
      sections: [
        {
          title: "Immediate actions",
          items: [
            "No digital vaginal examination — ever",
            "Urgent USS to confirm placental site",
            "CTG once clinically stable",
            "Admit if bleeding heavier than spotting or ongoing",
          ],
        },
        {
          title: "If praevia confirmed",
          items: [
            "Manage per RCOG GTG27 — major praevia requires consultant-led care",
            "Corticosteroids if <34+6 weeks and preterm delivery a realistic risk",
            "If bleeding settled and gestation <36 weeks — inpatient vs outpatient with senior guidance",
            "Planned caesarean section — do not allow vaginal delivery with major praevia",
          ],
        },
      ],
      next: "investigations",
    },

    "abruption_path": {
      type: "checklist",
      title: "Placental abruption — investigate urgently",
      alert: "USS sensitivity for abruption is only 24%. Normal USS does NOT exclude abruption.",
      items: [
        "FBC + clotting + crossmatch 4 units — even minor abruption can evolve rapidly",
        "CTG immediately — abnormal in 69% of significant abruptions",
        "Watch for DIC: falling fibrinogen, prolonged PT/aPTT — liaise with haematologist",
        "Call registrar — do not manage alone",
        "If significant abruption with fetal compromise: prepare for emergency delivery",
      ],
      next: "investigations",
    },

    "crampy_path": {
      type: "treatment",
      title: "Crampy pain with bleeding",
      sections: [
        {
          title: "Consider",
          items: [
            "Threatened preterm labour — if <37 weeks with regular contractions",
            "Lower genital tract source — ectropion, cervicitis, polyp",
            "Early abruption — crampy pain can precede constant pain; monitor closely",
          ],
        },
        {
          title: "Actions",
          items: [
            "CTG — continuous monitoring",
            "Speculum to visualise cervix — is the os open?",
            "USS — fetal wellbeing, placental site, liquor volume",
            "If <34 weeks with threatened preterm labour: corticosteroids and tocolysis per unit protocol",
          ],
        },
      ],
      next: "investigations",
    },

    "lower_gt_path": {
      type: "treatment",
      title: "Lower genital tract / unexplained APH",
      sections: [
        {
          title: "Management",
          items: [
            "Ectropion on speculum — no change to antenatal care; reassure",
            "Unexplained APH: reclassify as higher risk; arrange serial USS for fetal growth",
            "FBC + G&S for any episode heavier than spotting",
            "Consider colposcopy referral if suspicious cervical appearance",
          ],
        },
      ],
      next: "investigations",
    },

    // ─── Investigations ────────────────────────────────────────────────────────

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "CTG — commence immediately for any APH at ≥24 weeks",
        "FBC and group & screen (crossmatch if major or massive bleeding)",
        "Clotting screen if abruption suspected or major APH",
        "USS — placental site, fetal presentation, liquor volume, EFW",
        "Kleihauer test if RhD-negative — to quantify fetomaternal haemorrhage",
        "Anti-D Ig ≥500 iu if RhD-negative and non-sensitised — give without waiting for Kleihauer",
        "Corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
      ],
      next: "ctg_q",
    },

    // ─── CTG branch ───────────────────────────────────────────────────────────

    "ctg_q": {
      type: "question",
      question: "What does the CTG show?",
      options: [
        { label: "Normal",                          next: "escalation"    },
        { label: "Suspicious or pathological",      next: "ctg_abnormal"  },
      ],
    },

    "ctg_abnormal": {
      type: "escalation",
      title: "Abnormal CTG — call the senior now",
      alert: "Fetal compromise with APH requires immediate senior involvement.",
      items: [
        "Call consultant obstetrician immediately",
        "Prepare for emergency delivery if acute compromise",
        "Do not leave the patient alone",
        "Escalate to anaesthetics if emergency CS anticipated",
      ],
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Also escalate if…",
      items: [
        "Major or massive APH (>50 ml or clinical shock)",
        "Continuous abdominal pain → suspected abruption",
        "Bleeding ongoing — do not discharge with active bleeding",
        "Preterm gestation <37 weeks with significant APH",
        "Suspected placenta praevia — no digital VE; admit and arrange urgent USS",
        "DIC suspected — fibrinogen falling, PT/aPTT prolonged",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Time of presentation and estimated blood loss",
        "APH severity — spotting / minor / major / massive",
        "BP and HR at presentation",
        "FH confirmed and CTG result",
        "Likely cause — praevia / abruption / lower genital tract / unexplained",
        "Anti-D Ig if given — dose, time, lot number; Kleihauer sent",
        "Investigations requested and results",
        "Corticosteroids if given — drug, dose, time, gestation",
        "Admission or discharge decision and management plan",
        "Safety-netting advice given to patient",
      ],
    },

  },
};
