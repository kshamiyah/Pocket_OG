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
      alert: "ACTIVATE MAJOR HAEMORRHAGE PROTOCOL immediately. Four pillars: Communication — Resuscitation — Monitoring and Investigation — Arrest Bleeding by Delivery.",
      items: [
        "Call major haemorrhage protocol — alert consultant obstetrician and consultant anaesthetist",
        "O₂ 10–15 L/min via non-rebreather facemask",
        "2× 14G IV cannulae immediately",
        "Bloods (20 ml): FBC, coagulation screen, crossmatch 4 units, U&E, LFTs; Kleihauer if RhD-negative",
        "Catheterise — urine output target ≥30 ml/hour",
        "Left lateral tilt — avoid aortocaval compression",
        "Activate massive transfusion protocol — liaise with haematologist and blood transfusion laboratory",
        "Assess fetal wellbeing (CTG) — decide timing and mode of delivery",
        "Do NOT leave the patient alone at any point",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-massive", label: "Massive APH Management" },
      next: "history",
    },

    // ─── Stability check ───────────────────────────────────────────────────────

    "stable_q": {
      type: "question",
      question: "Is she haemodynamically stable?",
      subtitle: "HR, BP, pallor, consciousness",
      options: [
        { label: "Yes — BP and HR normal, no pallor",        next: "history"      },
        { label: "No — tachycardia, hypotension, or pallor", next: "unstable_now" },
      ],
    },

    "unstable_now": {
      type: "escalation",
      title: "Haemodynamically compromised — act now",
      alert: "ABCD resuscitation. Mother is always the priority — stabilise before assessing fetal wellbeing.",
      items: [
        "2× 14G IV cannulae immediately",
        "Emergency bloods: FBC, coagulation screen, crossmatch 4 units, U&E, LFTs; Kleihauer if RhD-negative",
        "O₂ 10–15 L/min via non-rebreather facemask",
        "Catheterise — monitor urine output",
        "Call consultant obstetrician and consultant anaesthetist NOW",
        "Assess fetal wellbeing (CTG) — prepare for emergency delivery if fetal compromise present",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-massive", label: "Massive APH Management" },
      next: "history",
    },

    // ─── History & examination ─────────────────────────────────────────────────

    "major_assessment": {
      type: "checklist",
      title: "Major APH — immediate actions",
      alert: "Digital VE only AFTER USS excludes placenta praevia — NEVER perform blind",
      items: [
        "2× 14G or 16G IV access",
        "FBC, coagulation screen, crossmatch 4 units, U&E, LFTs",
        "Assess fetal wellbeing — apply CTG once mother is stable",
        "Call registrar now — do not manage major APH alone",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-investigations", label: "Investigations in APH" },
      next: "history",
    },

    "history": {
      type: "checklist",
      title: "Take a focused history",
      items: [
        "Pain character: continuous → suspect abruption; intermittent → consider labour; painless → suspect praevia",
        "Fetal movements — cessation or reduction is concerning",
        "Rupture of membranes — fresh bleeding at rupture → consider vasa praevia",
        "Previous USS for placental site — known low-lying placenta or praevia?",
        "Risk factors for abruption: previous abruption, pre-eclampsia, smoking, cocaine/amphetamine use, abdominal trauma",
        "Cervical smear history and any recent instrumentation (lower genital tract cause)",
        "Gestation — confirm exact dates",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-assessment", label: "Clinical Assessment of APH" },
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Clinical examination",
      alert: "Digital VE only AFTER USS has excluded placenta praevia — NEVER perform blind",
      items: [
        "Record pulse and blood pressure immediately",
        "Abdominal palpation: woody/tense/board-like uterus → significant abruption; soft and non-tender → praevia or lower genital tract cause likely",
        "Assess uterine contractions and fetal lie/presentation",
        "Speculum examination: amount of bleeding, cervical dilatation, ectropion",
        "Digital VE: ONLY after USS has confirmed placenta is not praevia",
        "Assess fetal wellbeing — CTG once mother is stable",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-assessment", label: "Clinical Assessment of APH" },
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
            "No digital vaginal examination — ever, until USS has confirmed placenta is not praevia",
            "Urgent USS to confirm placental site",
            "CTG once mother is clinically stable",
            "Admit if bleeding is heavier than spotting or ongoing — should remain in hospital until bleeding has stopped",
          ],
        },
        {
          title: "If praevia confirmed",
          items: [
            "Manage per RCOG GTG27 — major praevia requires consultant-led care",
            "Corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
          ],
        },
      ],
      source: { gl: "GTG63", sectionId: "gtg63-hospitalisation", label: "Hospitalisation After APH" },
      next: "investigations",
    },

    "abruption_path": {
      type: "checklist",
      title: "Placental abruption — investigate urgently",
      alert: "USS sensitivity for abruption is only 24%. Placental abruption is a CLINICAL DIAGNOSIS — a normal USS does NOT exclude it.",
      items: [
        "FBC, coagulation screen, crossmatch 4 units — even minor abruption can evolve rapidly",
        "CTG once mother is stable — abnormal in approximately 69% of significant abruptions",
        "Watch for DIC: falling fibrinogen, PT/aPTT >1.5× control — liaise with haematologist urgently",
        "Tocolysis is CONTRAINDICATED in placental abruption",
        "Call registrar — do not manage alone",
        "If significant abruption with fetal compromise: immediate caesarean section with concurrent maternal resuscitation",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-investigations", label: "Investigations in APH" },
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
            "Early abruption — monitor closely; pain may become continuous",
          ],
        },
        {
          title: "Actions",
          items: [
            "CTG — once mother is stable",
            "Speculum to visualise cervix — is the os open?",
            "USS — fetal wellbeing, placental site, liquor volume",
            "Corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
            "Tocolysis: contraindicated in abruption; relatively contraindicated in praevia; may be considered in settled minor bleeding with suspected preterm labour at very preterm gestations — only after senior obstetrician review",
          ],
        },
      ],
      source: { gl: "GTG63", sectionId: "gtg63-tocolysis", label: "Tocolysis in APH" },
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
            "Any APH heavier than spotting: reclassify as high risk and arrange serial USS for fetal growth",
            "FBC + group & save for any episode heavier than spotting",
            "Women discharged should be advised to report any further bleeding, pain or reduced fetal movements immediately",
          ],
        },
      ],
      source: { gl: "GTG63", sectionId: "gtg63-hospitalisation", label: "Hospitalisation After APH" },
      next: "investigations",
    },

    // ─── Investigations ────────────────────────────────────────────────────────

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "CTG — perform once the mother is stable",
        "Minor APH: FBC + group & save; coagulation screen not indicated unless platelets are abnormal",
        "Major/massive APH: FBC + coagulation screen + crossmatch 4 units + U&E + LFTs",
        "USS — placental site (essential before any vaginal examination), fetal presentation, liquor volume, EFW",
        "Kleihauer test if RhD-negative — to quantify fetomaternal haemorrhage for anti-D dosing",
        "Anti-D Ig ≥500 iu if RhD-negative and non-sensitised — give without waiting for Kleihauer result",
        "Corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-investigations", label: "Investigations in APH" },
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
      alert: "Abnormal CTG in APH is associated with poor fetal outcome — expedite delivery.",
      items: [
        "Call consultant obstetrician immediately",
        "Immediate caesarean section with concurrent maternal resuscitation if fetal compromise",
        "Do not leave the patient alone",
        "Escalate to anaesthetics if emergency CS anticipated",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-delivery", label: "Labour, Delivery & Mode of Birth" },
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Also escalate if…",
      items: [
        "Major or massive APH (>50 ml or clinical shock)",
        "Continuous abdominal pain → suspected abruption",
        "Bleeding ongoing — do not discharge with active bleeding",
        "Preterm gestation with significant APH",
        "Suspected placenta praevia — no digital VE; admit and arrange urgent USS",
        "DIC suspected — fibrinogen falling, PT/aPTT prolonged; liaise with haematologist",
      ],
      source: { gl: "GTG63", sectionId: "gtg63-assessment", label: "Clinical Assessment of APH" },
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
      source: { gl: "GTG63", sectionId: "gtg63-antid", label: "Anti-D Immunoglobulin in RhD-Negative Women with APH" },
    },

  },
};
