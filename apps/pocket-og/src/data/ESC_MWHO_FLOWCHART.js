// ESC_CVD — Cardiac Disease in Pregnancy (2025 ESC Guidelines).
// mWHO 2.0 risk-triage entry point — for condition-specific detail, see the
// congenital heart disease, cardiomyopathy, MI, arrhythmia and valvular
// pathways linked from the reader.

export const ESC_MWHO_TRIAGE_FLOWCHART = {
  id: "ESC_MWHO_TRIAGE",
  title: "Cardiac Disease in Pregnancy: mWHO Risk Triage",
  subtitle: "ESC 2025 · Modified WHO classification",
  startId: "known-disease",
  nodes: {

    "known-disease": {
      type: "decision",
      title: "Known Cardiac Disease, or New Red-Flag Symptoms?",
      text: "Breathlessness disproportionate to gestation, orthopnoea/PND, exertional syncope, chest pain, sustained palpitations, or a new/changed murmur.",
      options: [
        { label: "Known cardiac disease — planning pregnancy or already pregnant", next: "classify" },
        { label: "New red-flag symptoms, no known cardiac history", next: "assess-new" },
      ],
    },

    "assess-new": {
      type: "action",
      title: "Assess as Possible New Cardiac Disease",
      text: "Do not attribute to 'normal pregnancy' by default — ECG, and cardiology input/echo if any red flag is present.",
      next: "classify",
    },

    "classify": {
      type: "decision",
      title: "mWHO Class?",
      text: "Based on the specific lesion/condition — see condition-specific pathways for detail.",
      options: [
        { label: "I — minimal risk", next: "class1" },
        { label: "II — small increased risk", next: "class2" },
        { label: "II–III — intermediate risk", next: "class23" },
        { label: "III — significantly increased risk", next: "class3" },
        { label: "IV — extremely high risk", next: "class4" },
      ],
    },

    "class1": {
      type: "end",
      title: "Class I — Standard Obstetric Care",
      text: "No detectable increased mortality risk; no/mild morbidity increase.",
    },

    "class2": {
      type: "end",
      title: "Class II — Cardiology Follow-Up",
      text: "Small increased mortality risk or moderate morbidity increase. Pregnancy Heart Team not routinely required.",
    },

    "class23": {
      type: "action",
      title: "Class II–III — Individualised Care",
      text: "Intermediate risk. Pregnancy Heart Team often advised — involve early rather than waiting for deterioration.",
    },

    "class3": {
      type: "alert",
      title: "Class III — Pregnancy Heart Team Mandatory",
      text: "Significantly increased mortality risk or severe morbidity. High-risk care, delivery planned in a centre with immediate cardiology/anaesthetic/critical care access.",
    },

    "class4": {
      type: "alert",
      title: "Class IV — Extremely High Risk",
      text: "Pregnancy generally advised against at this risk level. If pregnancy continues: shared decision-making within the Pregnancy Heart Team, detailed maternal-fetal risk counselling, psychological support, and maximally intensive monitoring throughout.",
    },

  },
};
