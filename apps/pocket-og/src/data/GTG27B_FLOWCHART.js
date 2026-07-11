// GTG27b — Vasa Praevia: Diagnosis and Management
// (RCOG Green-top Guideline No. 27b, September 2018)

export const GTG27B_VASA_FLOWCHART = {
  id: "GTG27B_VASA",
  title: "Vasa Praevia",
  subtitle: "GTG27b · Antenatal plan & emergency presentation",
  startId: "presentation",
  nodes: {

    "presentation": {
      type: "decision",
      title: "How Is This Presenting?",
      options: [
        { label: "Known/suspected vasa praevia — antenatal planning", next: "antenatal-plan" },
        { label: "Bleeding or membrane rupture — in labour or unexpectedly", next: "emergency" },
      ],
    },

    "antenatal-plan": {
      type: "action",
      title: "Antenatal Plan",
      text: "Diagnosis is by targeted TVS + colour Doppler in women with risk factors (velamentous cord insertion, bilobed/succenturiate placenta, resolving 2nd-trimester praevia, multiple pregnancy, IVF).",
      items: [
        "Antenatal corticosteroids from ~32 weeks",
        "Outpatient care reasonable if asymptomatic with reassuring cervical length; consider admission from ~30–32 weeks or sooner for shortening cervix, bleeding, contractions, or multiple pregnancy",
        "Plan elective caesarean section before labour is expected — commonly 34–36 weeks — to avoid unprotected vessels being exposed to rupture of membranes",
        "Clear safety-netting: come in immediately for ANY bleeding or suspected waters breaking",
      ],
      next: "outcome-note",
    },

    "outcome-note": {
      type: "end",
      title: "Antenatal Diagnosis Changes the Outcome",
      text: "Survival >95% (up to ~97% in the largest cohorts) with antenatal diagnosis and planned pre-labour caesarean section — versus roughly 60% fetal mortality when it presents unexpectedly in labour.",
    },

    "emergency": {
      type: "alert",
      title: "Vasa Praevia Bleeding = Fetal Emergency",
      text: "Bleeding after rupture of membranes, with or without acute CTG change (bradycardia, sinusoidal trace, terminal deceleration), in a woman with known or suspected vasa praevia.",
      items: [
        "Immediate category 1 caesarean section — do not wait for confirmation the blood is fetal",
        "Alert the neonatal team in advance — the baby may be born profoundly anaemic and need immediate resuscitation ± transfusion",
        "Treat a known antenatally-diagnosed vasa praevia presenting with any bleeding/suspected rupture before its planned elective date the same way — immediate category 1 section, not expectant assessment",
      ],
    },

  },
};
