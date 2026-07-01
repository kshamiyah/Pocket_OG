// Polyhydramnios in a singleton pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review
// (Karkhanis P, Patni S. TOG 2014;16:207–13, DOI 10.1111/tog.12113),
// combining the article's two management algorithms (Figures 4 & 5).
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_POLYHYDRAMNIOS_FLOWCHART = {
  id: "TOG_POLYHYDRAMNIOS",
  title: "Polyhydramnios — Assessment & Management",
  subtitle: "TOG review (Karkhanis & Patni, 2014) · singleton pregnancy",
  startId: "detected",
  nodes: {

    "detected": {
      type: "action",
      title: "Polyhydramnios Confirmed on Ultrasound",
      text: "Amniotic fluid above the 95th centile: AFI ≥25 cm or DVP ≥8 cm (either measure; neither is superior). Incidence 0.2–3.9%. Confirm, then search for a cause — unexplained polyhydramnios is a diagnosis of exclusion.",
      items: [
        "Classify severity by AFI: mild 25.0–29.9 cm · moderate 30.0–34.9 cm · severe >35 cm",
        "Risk of a major anomaly despite a normal scan rises with severity: ~1% mild, ~2% moderate, ~11% severe",
      ],
      next: "workup",
    },

    "workup": {
      type: "action",
      title: "Investigate for a Cause",
      text: "A cause is found in about half of cases (maternal, fetal or placental); the rest are unexplained.",
      items: [
        "Maternal: random blood sugar / OGTT / HbA1c; red-cell antibodies; TORCH screen (toxoplasma, CMV, parvovirus) if features of fetal infection",
        "Detailed fetal ultrasound: structural survey, stomach bubble (abnormal if small/absent after 45 min), long bones & thorax (skeletal dysplasia), movements/tone/joints; consider fetal echocardiography",
        "Consider karyotyping on an individual basis — factor in nuchal translucency / Down syndrome screening",
        "Transvaginal cervical length to quantify preterm-labour risk",
      ],
      next: "cause",
    },

    "cause": {
      type: "decision",
      title: "What Did Assessment Show?",
      text: "Direct management by the underlying cause.",
      options: [
        {
          label: "Fetal anomaly or suspected aneuploidy",
          sublabel: [
            "Structural anomaly on USS",
            "Aneuploidy risk 10–20% if persistent/severe",
          ],
          next: "anomaly",
        },
        {
          label: "Maternal cause",
          sublabel: ["Diabetes / macrosomia", "Red-cell antibodies", "Congenital infection"],
          next: "maternal",
        },
        {
          label: "SGA fetus or reduced fetal movements",
          sublabel: "Fetal wellbeing concern",
          next: "mfm",
        },
        {
          label: "No cause found — unexplained",
          sublabel: "50–60% of cases; diagnosis of exclusion",
          next: "unexplained",
        },
      ],
    },

    "anomaly": {
      type: "alert",
      title: "Urgent Fetal Medicine Referral",
      text: "Refer urgently to the fetal medicine specialist team.",
      items: [
        "Detailed counselling; karyotyping / microarray as indicated",
        "MDT plan for pregnancy, delivery and neonatal care tailored to the abnormality",
        "Fetal loss rises to ~60% where a structural anomaly coexists",
      ],
    },

    "maternal": {
      type: "action",
      title: "Treat the Maternal Cause",
      items: [
        "Diabetes → MDT (maternal medicine, diabetology, dietetics); optimise glycaemic control — reduces macrosomia and improves outcome",
        "Red-cell antibodies → manage per the isoimmunisation pathway",
        "Congenital infection → manage per local pathway",
      ],
      next: "surveillance",
    },

    "mfm": {
      type: "action",
      title: "Refer to Maternal–Fetal Medicine",
      text: "SGA, reduced fetal movements, or persistent/worsening polyhydramnios all warrant MFM referral.",
      items: [
        "Serial growth scans and fetal wellbeing surveillance",
        "Plan timing and mode of birth with the MFM team",
      ],
      next: "surveillance",
    },

    "unexplained": {
      type: "decision",
      title: "Unexplained Polyhydramnios — Severity?",
      text: "Manage by severity and watch for progression.",
      options: [
        {
          label: "Mild (25–29.9) or moderate (30–34.9 cm)",
          sublabel: "Often resolves; main association is LGA",
          next: "mild_mod",
        },
        {
          label: "Severe (>35 cm), persistent or symptomatic",
          sublabel: "Respiratory compromise / preterm-labour risk",
          next: "severe",
        },
      ],
    },

    "mild_mod": {
      type: "action",
      title: "Mild / Moderate — Surveillance",
      items: [
        "Serial growth scans; transvaginal cervical length",
        "Consider antenatal steroids if cervical shortening",
        "No benefit from induction for isolated/unexplained polyhydramnios — induce only for a maternal/fetal indication",
      ],
      next: "surveillance",
    },

    "severe": {
      type: "action",
      title: "Severe / Persistent — Specialist Management",
      text: "Refer to fetal medicine.",
      items: [
        "Therapeutic amnioreduction (amniodrainage) if maternal respiratory compromise or significant cervical shortening — stop when AFI <25 cm; complication rate ~1.5% (preterm labour, PPROM, chorioamnionitis, abruption); high recurrence",
        "Sulindac / indomethacin reduce fluid but risk ductus arteriosus constriction and impaired fetal renal function — specialist supervision only, not for general obstetric practice",
      ],
      next: "surveillance",
    },

    "surveillance": {
      type: "action",
      title: "Ongoing Surveillance & Counselling",
      text: "Serial ultrasound for liquor volume and fetal growth.",
      items: [
        "Counsel on risks: preterm birth, unstable lie (→ caesarean), cord prolapse, placental abruption and PPH",
        "Give antenatal steroids if preterm birth is anticipated",
      ],
      next: "labour",
    },

    "labour": {
      type: "action",
      title: "Plan for Labour & Birth",
      items: [
        "Induce only for a maternal or fetal indication — not for polyhydramnios alone",
        "Anticipate unstable lie, cord prolapse and abruption; consider controlled amniotomy in theatre",
        "If macrosomic: monitor for labour dystocia; anticipate shoulder dystocia and PPH",
      ],
      next: "neonatal",
    },

    "neonatal": {
      type: "end",
      title: "After Birth",
      text: "Overall fetal loss is up to ~4% (up to ~60% with a coexistent structural anomaly).",
      items: [
        "Thorough neonatal examination",
        "Check upper-GI patency with a nasogastric tube — especially in unexplained cases",
        "Raise a neonatal alert",
      ],
    },

  },
};
