// Isolated Oligohydramnios — assessment & management.
// Original interactive pathway synthesised from the TOG review (Falola AO,
// Filby L, Timmons P, Alleemudder D. Management of isolated abnormal amniotic
// fluid volume in pregnancy. TOG 2026;28:41–50, DOI 10.1111/tog.70021),
// combining the article's investigation algorithm (Figure 2) with its
// management, delivery-timing and postnatal guidance.
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_OLIGOHYDRAMNIOS_FLOWCHART = {
  id: "TOG_OLIGOHYDRAMNIOS",
  title: "Oligohydramnios: Assessment & Management",
  subtitle: "TOG review (Falola et al., 2026) · isolated oligohydramnios",
  startId: "detected",
  nodes: {

    "detected": {
      type: "action",
      title: "Reduced Liquor Identified on Ultrasound",
      text: "Oligohydramnios: AFI ≤5 cm or SDVP <2 cm. Anhydramnios: no measurable pool. SDVP is the preferred screening measure — AFI over-diagnoses oligohydramnios without improving outcome.",
      items: [
        "Isolated (term) oligohydramnios complicates 0.5–5% of pregnancies and is a diagnosis of exclusion",
        "Early-onset (2nd-trimester) oligohydramnios is a different, higher-stakes picture — usually previable PPROM or bilateral renal agenesis/severe renal impairment",
      ],
      next: "onset",
    },

    "onset": {
      type: "decision",
      title: "Onset?",
      options: [
        {
          label: "Early / 2nd-trimester onset",
          sublabel: "Nearly always a significant fetal or maternal cause",
          next: "early_onset",
        },
        {
          label: "Isolated at term / late pregnancy",
          sublabel: "Proceed with the systematic work-up",
          next: "workup",
        },
      ],
    },

    "early_onset": {
      type: "alert",
      title: "Early-Onset Oligohydramnios / Anhydramnios",
      text: "Refer urgently to fetal medicine — this is not managed as 'isolated' oligohydramnios.",
      items: [
        "Consider previable PPROM and bilateral renal agenesis / severe renal impairment (renal oligohydramnios) as leading causes",
        "Bilateral renal agenesis → Potter's sequence (clubbed feet, pulmonary hypoplasia, cranial/skin abnormalities) — considered incompatible with life; counsel accordingly",
        "Carries significant fetal morbidity/mortality — detailed fetal medicine assessment and counselling",
      ],
    },

    "workup": {
      type: "action",
      title: "Systematic Work-Up",
      text: "Actively exclude the common causes: rupture of membranes, placental disease/FGR, congenital infection.",
      items: [
        "History & exam: speculum if ROM suspected, blood pressure, medication review (ACE inhibitors, ARBs, NSAIDs/indomethacin), hydration status, travel/infection history",
        "Urine: dipstick/PCr to screen for pre-eclampsia",
        "Bloods: PlGF / sFlt-1:PlGF ratio if placental disease suspected; renal function if maternal renal impairment suspected",
        "Detailed ultrasound: growth, MCA Dopplers (if FGR or fetal anaemia suspected), full structural anomaly screen; consider a TORCH screen",
      ],
      next: "findings",
    },

    "findings": {
      type: "decision",
      title: "What Did the Work-Up Show?",
      options: [
        {
          label: "Rupture of membranes confirmed",
          sublabel: "PPROM",
          next: "prom",
        },
        {
          label: "Suspected maternal cause",
          sublabel: "Renal impairment, hypertensive disease/pre-eclampsia",
          next: "maternal",
        },
        {
          label: "Positive infection screen, FGR/SGA, or anhydramnios",
          sublabel: "Fetal concern",
          next: "fetal_medicine",
        },
        {
          label: "All normal",
          sublabel: "No ROM, infection, placental disease or anomaly",
          next: "isolated",
        },
      ],
    },

    "prom": {
      type: "end",
      title: "Manage as PPROM",
      text: "Follow the PPROM pathway — this is no longer managed as 'isolated' oligohydramnios.",
    },

    "maternal": {
      type: "action",
      title: "Refer to Maternal Medicine",
      items: [
        "Investigate and treat the maternal cause (renal impairment, hypertensive disease)",
        "Continue fetal surveillance in parallel",
      ],
      next: "isolated",
    },

    "fetal_medicine": {
      type: "alert",
      title: "Refer to Fetal Medicine",
      items: [
        "Consider genetic testing and a detailed assessment of fetal anatomy",
        "Some authors treat any oligohydramnios as a possible marker of placental insufficiency — manage as higher risk pending assessment",
      ],
    },

    "isolated": {
      type: "action",
      title: "Isolated / Idiopathic Oligohydramnios",
      text: "A diagnosis of exclusion — manage with increased surveillance.",
      items: [
        "Increased ultrasound surveillance for a deteriorating fetus (consistent ACOG/NICE position)",
        "Amnioinfusion has limited evidence — mainly studied for cord-compression reduction in labour, not for improving antenatal AFV; not routine UK practice",
        "There is an increased rate of SGA only discovered after birth despite surveillance — keep a low threshold to reassess growth",
      ],
      next: "delivery",
    },

    "delivery": {
      type: "alert",
      title: "Timing of Delivery: No Professional Consensus",
      text: "ACOG, FIGO, NICE and RCOG do not agree on timing of delivery for isolated oligohydramnios.",
      items: [
        "Induction (especially prostaglandin E2 with an unfavourable cervix) is linked to more emergency caesareans and non-reassuring CTG",
        "Evidence does not clearly show early induction reduces perinatal morbidity/mortality either way",
        "Authors' pragmatic view: given the link with postnatal SGA diagnosis, offer induction at term — individualise to the woman's risk factors and discuss the uncertainty",
      ],
      next: "labour",
    },

    "labour": {
      type: "action",
      title: "In Labour",
      items: [
        "Continuous fetal monitoring — increased risk of hypoxia from cord compression with reduced liquor cushioning",
      ],
      next: "after_birth",
    },

    "after_birth": {
      type: "end",
      title: "After Birth",
      items: [
        "Higher rate of respiratory distress and lower Apgar scores reported, particularly post-dates — deliver where neonatal services are accessible",
        "Increased rate of placental disorders reported in a subsequent pregnancy — consider increased growth surveillance next time",
      ],
    },

  },
};
