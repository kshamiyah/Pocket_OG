// Joint BASHH/RCOG HSV in pregnancy (2024) — management pathway.
// Backbone follows the guideline's Appendix 2 algorithm: classify episode
// (recurrent/known vs first episode by trimester) → antivirals → mode of
// delivery → neonatal handoff. PPROM branches link to the GL895 ROM flowchart.
//
// Doses/timings verbatim from Clarke et al. Int J STD AIDS 2024.

export const BASHH_HSV_PREGNANCY_FLOWCHART = {
  id: "BASHH_HSV_PREGNANCY",
  title: "Genital Herpes in Pregnancy — Management",
  subtitle: "BASHH/RCOG 2024 · HSV in pregnancy",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Suspected or Known Genital Herpes in Pregnancy",
      text: "Confirm the diagnosis and set up MDT care. Do not delay treatment while awaiting results.",
      items: [
        "Refer to genitourinary medicine (GUM); arrange a full STI screen (chlamydia, gonorrhoea, syphilis, HIV, ± hepatitis B/C)",
        "PCR from ulcers — type-specific HSV, VZV and Treponema pallidum; consider enterovirus / MPOX / LGV by risk",
        "HSV type-specific serology — especially in the third trimester, to separate a first episode from a recurrence",
        "Inform the neonatal team early; document a delivery and postnatal plan (GUM + obstetrics + neonatology)",
      ],
      next: "classify",
    },

    "classify": {
      type: "decision",
      title: "First episode, or recurrent / known before pregnancy?",
      text: "The type of episode drives neonatal risk and mode of delivery.",
      options: [
        { label: "First (primary / non-primary) episode", sublabel: "New acquisition in this pregnancy", next: "trimester" },
        { label: "Recurrent, or diagnosed before pregnancy", sublabel: "Low neonatal risk (0–3%)", next: "recurrent-ante" },
      ],
    },

    // ── FIRST EPISODE ─────────────────────────────────────────────────
    "trimester": {
      type: "decision",
      title: "When was the first episode acquired?",
      options: [
        { label: "First or second trimester (until 27+6 weeks)", next: "first-early" },
        { label: "Third trimester (from 28 weeks)", sublabel: "Highest neonatal risk", next: "first-third" },
      ],
    },

    "first-early": {
      type: "action",
      title: "First Episode — 1st / 2nd Trimester",
      text: "Treat the episode and plan suppression; vaginal delivery is anticipated.",
      items: [
        "Treat: aciclovir 400 mg three times daily OR valaciclovir 500 mg twice daily (usually 5 days)",
        "HSV type-specific serology if not known to carry both HSV-1 and HSV-2",
        "Suppression from 32 weeks (aciclovir 400 mg TDS / valaciclovir 500 mg BD); from 22 weeks if high risk of premature delivery",
        "Discuss avoiding sex in the third trimester to remove uncertainty about later lesions",
      ],
      next: "labour",
    },

    "first-third": {
      type: "alert",
      title: "First Episode — 3rd Trimester (High Risk)",
      text: "Neonatal transmission risk is very high (up to 41%) if shedding at delivery — insufficient time to transfer protective antibody.",
      items: [
        "Treat: aciclovir 400 mg three times daily OR valaciclovir 500 mg twice daily — may continue the treatment dose until delivery",
        "Perform HSV serology",
        "Caesarean section is recommended for all first-episode genital herpes in the third trimester, particularly within 6 weeks of expected delivery",
        "Manage the baby as a highest-risk neonatal case",
      ],
      next: "labour",
    },

    // ── RECURRENT / KNOWN ─────────────────────────────────────────────
    "recurrent-ante": {
      type: "action",
      title: "Recurrent / Known Genital Herpes — Antenatal",
      text: "Suppression for all known genital herpes; vaginal delivery anticipated.",
      items: [
        "Treat symptomatic recurrences only if needed — supportive care often suffices (most resolve in 7–10 days)",
        "Suppression for ALL known genital herpes: aciclovir 400 mg TDS or valaciclovir 500 mg BD from 32 weeks (from 22 weeks if high risk of premature delivery)",
        "If suppression needed before 32 weeks: aciclovir 400 mg BD or valaciclovir 500 mg OD, then step up from 32 weeks",
        "If only one HSV type is known and sexually active in the third trimester — risk-assess for a primary episode of the other type (serology may help)",
      ],
      next: "labour",
    },

    // ── LABOUR / DELIVERY ─────────────────────────────────────────────
    "labour": {
      type: "decision",
      title: "At onset of labour — what is the situation?",
      text: "Mode of delivery depends on episode type and whether membranes have ruptured preterm.",
      options: [
        { label: "First-episode lesions, or acquired within 6 weeks", sublabel: "High risk", next: "cs" },
        { label: "Recurrent lesions (acquired before 3rd trimester / >6 weeks ago)", sublabel: "Low risk", next: "vaginal" },
        { label: "No genital lesions at term", next: "no-lesions" },
        { label: "Preterm prelabour rupture of membranes (<37 weeks)", next: "pprom" },
      ],
    },

    "cs": {
      type: "end",
      title: "Recommend Caesarean Section",
      text: "Primary/non-primary lesions at delivery — recommend caesarean to reduce fetal exposure to HSV.",
      items: [
        "Benefit reduces once membranes ruptured >4 hours, but still expedite caesarean to deliver within 4 hours where possible",
        "If caesarean is declined and vaginal birth proceeds: IV aciclovir 5 mg/kg every 8 hours to the mother/parent; neonate IV aciclovir 20 mg/kg every 8 hours",
        "Manage the baby as a highest-risk neonatal case — inform the neonatal / Paediatric Infectious Diseases team",
      ],
    },

    "vaginal": {
      type: "end",
      title: "Offer Vaginal Delivery",
      text: "Recurrent lesions at labour — neonatal risk is low (0–3%).",
      items: [
        "Offer vaginal delivery where there is confidence the lesions are recurrent rather than a first episode",
        "Caesarean section should NOT be recommended solely to reduce HSV transmission",
        "The final choice rests with the pregnant woman or person, weighing the very low risk against caesarean risks (per NICE intrapartum guidance)",
        "Watch the neonate for red-flag symptoms in the first 6 weeks (SEM lesions, lethargy, poor feeding, fever)",
      ],
    },

    "no-lesions": {
      type: "end",
      title: "No Genital Lesions at Term",
      text: "Vaginal delivery is anticipated in the absence of lesions or other obstetric indications.",
      items: [
        "Continue suppressive antivirals until delivery if started",
        "At term SROM there is no evidence to guide management, but many clinicians expedite delivery to limit fetal exposure",
      ],
    },

    "pprom": {
      type: "decision",
      title: "PPROM — primary or recurrent HSV?",
      text: "The premature neonate is high-risk in either case. Management is MDT and depends on gestation.",
      options: [
        { label: "Primary / non-primary HSV with PPROM", next: "pprom-primary" },
        { label: "Recurrent HSV with PPROM", next: "pprom-recurrent" },
      ],
    },

    "pprom-primary": {
      type: "end",
      title: "Primary HSV + PPROM",
      text: "Limited evidence — decide immediate delivery vs conservative management by MDT (obstetrics, neonatology, GUM).",
      items: [
        "If immediate delivery: the benefit of caesarean section in reducing neonatal herpes remains",
        "If conservative management: IV aciclovir 5 mg/kg every 8 hours until delivery",
        "Consider antenatal corticosteroids per NICE to reduce preterm morbidity",
        "If delivery is indicated within 6 weeks of the primary infection, caesarean may still offer some benefit despite prolonged membrane rupture",
        "Manage the baby as a highest-risk neonatal case",
      ],
    },

    "pprom-recurrent": {
      type: "end",
      title: "Recurrent HSV + PPROM",
      text: "Suppress and manage the membrane rupture per the ROM/PPROM pathway.",
      items: [
        "Start suppression — aciclovir 400 mg three times daily or valaciclovir 500 mg twice daily — continued until delivery",
        "PPROM before 34 weeks: expectant management is appropriate",
        "At or after 34 weeks: manage per the RCOG / local PPROM guideline (see the Rupture of Membranes pathway)",
        "Consider antenatal corticosteroids; outcomes are not materially influenced by recurrent genital herpes lesions",
      ],
    },

  },
};
