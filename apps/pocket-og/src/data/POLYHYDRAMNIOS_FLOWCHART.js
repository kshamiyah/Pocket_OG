// Polyhydramnios in a singleton pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review
// (Karkhanis P, Patni S. TOG 2014;16:207–13, DOI 10.1111/tog.12113),
// combining the article's two management algorithms (Figures 4 & 5).
// Classification thresholds, anomaly-risk figures and delivery-timing
// guidance updated to the newer companion review (Falola, Filby, Timmons &
// Alleemudder. TOG 2026;28:41–50, DOI 10.1111/tog.70021).
// Decision support only — a summary of review articles, not a protocol.
// Verify against local guidance and read the full articles.

export const TOG_POLYHYDRAMNIOS_FLOWCHART = {
  id: "TOG_POLYHYDRAMNIOS",
  title: "Polyhydramnios: Assessment & Management",
  subtitle: "TOG reviews (Karkhanis & Patni 2014; Falola et al. 2026) · singleton pregnancy",
  startId: "detected",
  nodes: {

    "detected": {
      type: "action",
      title: "Polyhydramnios Confirmed on Ultrasound",
      text: "SDVP >8 cm or AFI >24 cm (either measure; neither is superior). Complicates 1–2% of pregnancies. Confirm, then search for a cause — idiopathic polyhydramnios is a diagnosis of exclusion.",
      items: [
        "Classify severity: mild SDVP ≥8–<12 / AFI ≥24–<30 cm · moderate SDVP ≥12–<16 / AFI ≥30–<35 cm · severe SDVP ≥16 / AFI ≥35 cm",
        "Genomic abnormality risk in isolated cases rises with severity: ~1% mild, ~2% moderate, ~10% severe",
      ],
      next: "workup",
    },

    "workup": {
      type: "action",
      title: "Investigate for a Cause",
      text: "Idiopathic (unexplained) polyhydramnios is the most common cause overall — 60–70% of all cases; fetal abnormalities account for over 30% of severe cases.",
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
          label: "Fetal anomaly or suspected genomic abnormality",
          sublabel: [
            "Structural anomaly on USS",
            "Genomic abnormality risk rises with severity (~1% mild, ~2% moderate, ~10% severe)",
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
          label: "No cause found, idiopathic",
          sublabel: "60–70% of cases; diagnosis of exclusion",
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
      title: "Idiopathic Polyhydramnios: Severity?",
      text: "Manage by severity and watch for progression.",
      options: [
        {
          label: "Mild (SDVP 8–<12 / AFI 24–<30 cm)",
          sublabel: "Often resolves; main association is LGA",
          next: "mild",
        },
        {
          label: "Moderate (SDVP 12–<16 / AFI 30–<35 cm)",
          sublabel: "Risk rises with severity",
          next: "moderate",
        },
        {
          label: "Severe (SDVP ≥16 / AFI ≥35 cm), persistent or symptomatic",
          sublabel: "Significant risk of adverse outcome",
          next: "severe",
        },
      ],
    },

    "mild": {
      type: "action",
      title: "Mild: Surveillance, No Change in Management",
      text: "Not conclusively linked to adverse outcomes apart from a higher rate of LGA babies.",
      items: [
        "Serial growth scans; transvaginal cervical length",
        "Continuous CTG in labour advised regardless of severity",
        "No clear benefit of induction for isolated polyhydramnios alone — induce only for a maternal/fetal indication",
      ],
      next: "surveillance",
    },

    "moderate": {
      type: "action",
      title: "Moderate: Surveillance, Consider Induction from 40 Weeks",
      text: "Risk of adverse outcome rises with severity, though the exact threshold for expedited delivery is unclear.",
      items: [
        "Serial growth scans; transvaginal cervical length; consider antenatal steroids if cervical shortening",
        "Induction may be offered from 40 weeks after discussing risks and benefits",
      ],
      next: "surveillance",
    },

    "severe": {
      type: "action",
      title: "Severe / Persistent: Specialist Management",
      text: "Refer to fetal medicine. Significant risk of adverse outcome — induction before 40 weeks should be offered; exact timing individualised.",
      items: [
        "Therapeutic amnioreduction (amniodrainage) if maternal respiratory compromise or significant cervical shortening — stop when AFI/SDVP normalises; complication rate ~1.5% (preterm labour, PPROM, chorioamnionitis, abruption); high recurrence",
        "Sulindac may be used under specialist supervision only (better safety profile than indomethacin, which is no longer used due to neonatal morbidity) — risk of ductus arteriosus constriction and impaired fetal renal function",
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
        "Timing per the severity-based guidance above, or for a maternal/fetal indication if the cause is treatable (e.g. diabetes)",
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
