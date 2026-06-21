export const PVB_PROTOCOL = {
  id: "pvb",
  title: "PV Bleeding in Pregnancy",
  subtitle: "Antepartum haemorrhage — assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG63",
  color: "red",
  startId: "triage",
  nodes: {

    "triage": {
      type: "checklist",
      title: "Initial assessment — severity",
      subtitle: "Assess haemodynamic status before taking full history",
      alert: "If massive bleeding (>1000 ml), clinical shock, or unable to give history → activate major haemorrhage protocol immediately and call the registrar",
      items: [
        "Record BP, HR, RR, SpO₂ immediately",
        "Classify blood loss: spotting / minor (<50 ml, settled) / major (50–1000 ml) / massive (>1000 ml)",
        "Assess for haemodynamic compromise: pallor, tachycardia >100, hypotension, confusion",
        "Auscultate fetal heart immediately",
        "If compromised → 2× 14G IV access, emergency bloods, call consultant obstetrician now",
      ],
      next: "history",
    },

    "history": {
      type: "checklist",
      title: "Take a full history",
      items: [
        "Pain character: continuous → suspect abruption; intermittent → consider labour; painless → suspect praevia",
        "Fetal movements — any reduction since bleeding started?",
        "Rupture of membranes — fresh bleeding at SROM → consider vasa praevia",
        "Previous USS for placental site — known low-lying placenta or praevia?",
        "Risk factors for abruption: previous abruption, pre-eclampsia, smoking, trauma, cocaine use",
        "Cervical smear history and any recent instrumentation (to exclude lower genital tract cause)",
        "Gestation — confirm exact dates",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Clinical examination",
      alert: "Digital VE only AFTER USS has excluded placenta praevia — NEVER perform blind",
      items: [
        "Abdominal palpation: tender / woody / board-like uterus → significant abruption",
        "Soft and non-tender uterus → praevia or lower genital tract cause likely",
        "Speculum examination: amount of bleeding, cervical os, ectropion, lower genital tract source",
        "Do NOT perform digital vaginal examination until placenta praevia excluded by USS",
        "Auscultate fetal heart or apply CTG",
      ],
      next: "cause",
    },

    "cause": {
      type: "treatment",
      title: "Classify likely cause and direct management",
      sections: [
        {
          title: "Placenta praevia suspected",
          note: "Painless, high presenting part, known low placenta, or placental site unknown",
          items: [
            "No digital vaginal examination",
            "Urgent USS to confirm placental site",
            "CTG once clinically stable",
            "Admit if bleeding heavier than spotting or ongoing",
            "Manage per RCOG GTG27 if praevia confirmed",
          ],
        },
        {
          title: "Placental abruption suspected",
          note: "Continuous pain, tender or woody uterus, abruption risk factors",
          items: [
            "Clinical diagnosis — USS sensitivity is only 24%; normal USS does NOT exclude abruption",
            "FBC + clotting + crossmatch 4 units — even minor abruption can evolve rapidly",
            "CTG immediately — abnormal in 69% of significant abruptions",
            "Watch for DIC: falling fibrinogen, prolonged PT/aPTT — liaise with haematologist",
          ],
        },
        {
          title: "Lower genital tract / unexplained APH",
          note: "Normal examination, ectropion on speculum, no uterine tenderness",
          items: [
            "Ectropion: no change to antenatal care — reassure",
            "Unexplained APH: reclassify as high risk; serial USS for fetal growth",
            "Consider colposcopy referral if suspicious cervical appearance",
            "FBC + G&S for any episode heavier than spotting",
          ],
        },
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations",
      items: [
        "CTG — commence immediately for any APH at ≥24 weeks",
        "FBC and group & screen (crossmatch if major or massive bleeding)",
        "Clotting screen if abruption suspected or major APH",
        "USS — placental site, fetal presentation, liquor volume, EFW",
        "Kleihauer test if RhD-negative — to quantify fetomaternal haemorrhage",
        "Anti-D Ig ≥500 iu if RhD-negative and non-sensitised — give without waiting for Kleihauer result",
        "Consider corticosteroids if 24+0–34+6 weeks and preterm birth is a realistic risk",
      ],
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "Major or massive APH (>50 ml or clinical shock) — four pillars protocol",
        "Continuous abdominal pain → suspected abruption",
        "Suspicious or pathological CTG or any sign of fetal compromise",
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
        "APH severity classification — spotting / minor / major / massive",
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
