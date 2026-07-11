// GTG72 — Care of Women with Obesity in Pregnancy (RCOG Green-top
// Guideline No. 72, 2nd edition, 2018/2019). BMI-triggered antenatal
// pathway — a planning aid, not a substitute for individualised care.

export const GTG72_OBESITY_FLOWCHART = {
  id: "GTG72_OBESITY",
  title: "Obesity in Pregnancy: Antenatal Pathway",
  subtitle: "GTG72 · Booking BMI-triggered actions",
  startId: "bmi-check",
  nodes: {

    "bmi-check": {
      type: "decision",
      title: "Booking BMI (Measured, Not Self-Reported)?",
      options: [
        { label: "30.0–34.9 (Class I)", next: "class1" },
        { label: "35.0–39.9 (Class II)", next: "class1" },
        { label: "≥40 (Class III / morbid obesity)", next: "class3" },
      ],
    },

    "class1": {
      type: "action",
      title: "Class I/II Pathway",
      items: [
        "Folic acid 5 mg daily (not the standard 400 microgram dose)",
        "Vitamin D 10 micrograms daily",
        "Consultant-led antenatal care",
        "OGTT for gestational diabetes screening",
        "VTE risk assessment (GL891) — weight-banded thromboprophylaxis dosing where indicated",
      ],
      next: "intrapartum-plan",
    },

    "class3": {
      type: "alert",
      title: "Class III / Morbid Obesity — Add Anaesthetic Referral",
      text: "Everything in the Class I/II pathway, plus:",
      items: [
        "Refer antenatally to an obstetric anaesthetist — assess venous access and anticipated difficulty of regional/general anaesthesia",
        "Document an agreed anaesthetic plan for labour and birth in advance",
      ],
      next: "intrapartum-plan",
    },

    "intrapartum-plan": {
      type: "end",
      title: "Intrapartum & Postnatal Planning",
      text: "Carry the plan into labour and beyond.",
      items: [
        "Early IV access in labour",
        "Consider fetal scalp electrode if external CTG monitoring is technically poor",
        "Confirm equipment/manual handling needs ahead of time (beds, theatre table, hoists)",
        "Active management of the third stage (increased PPH risk)",
        "Continue VTE risk assessment and thromboprophylaxis postnatally",
      ],
    },

  },
};
