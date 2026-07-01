// TOG — *The Obstetrician & Gynaecologist* review cards.
//
// TOG is the RCOG's peer-reviewed CPD/review journal. These cards are ORIGINAL
// summaries written for Pocket O&G — never reproductions of the journal text or
// figures. Each card links out to the full article (RCOG/Wiley) for members.
//
// Card schema (structured on purpose — keep every card in the same shape so
// they stay skimmable, searchable and cross-linkable):
//   id, source: "TOG", gl: "TOG"     — drives the TOG colour + filter
//   condition, setting, title, tags  — same as any searchable card
//   draft: true                      — shows an "AI-summarised, verify" banner
//   tog: { article, authors, citation, doi, url }  — provenance + link-out
//   relatedGl: []                    — cross-links to guidelines already in the app
//   flowchartId (optional)           — cross-link to an interactive pathway
//   content: []                      — text | alert | subheading | list | table
export const TOG_SECTIONS = [
  {
    id: "tog-polyhydramnios",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Fetal / Amniotic Fluid",
    title: "Polyhydramnios in Singleton Pregnancies",
    // Summary drawn directly from the source article below. Have a final clinical
    // read-through, then set draft:false to drop the amber banner.
    draft: false,
    tog: {
      article: "Polyhydramnios in singleton pregnancies: perinatal outcomes and management",
      authors: "Karkhanis P, Patni S",
      citation: "TOG 2014;16:207–13",
      doi: "10.1111/tog.12113",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.12113",
    },
    relatedGl: ["GL983", "GTG52", "GTG50", "GTG42"],
    tags: [
      "polyhydramnios", "poly", "increased liquor", "excess amniotic fluid", "high afi",
      "amniotic fluid index", "afi", "deepest vertical pool", "dvp", "deepest vertical pocket",
      "unexplained polyhydramnios", "idiopathic polyhydramnios", "amnioreduction", "amniodrainage",
      "therapeutic amniocentesis", "sulindac", "indomethacin", "macrosomia", "unstable lie",
      "large liquor volume", "raised afi", "fetal anomaly polyhydramnios", "aneuploidy polyhydramnios",
      "tog review", "amniotic fluid",
    ],
    content: [
      { type: "alert", value: "Bottom line: polyhydramnios = amniotic fluid above the 95th centile (AFI ≥25 cm or DVP ≥8 cm). About half the cases have a maternal/fetal cause and half are unexplained. Mild polyhydramnios usually resolves and carries little excess risk; severe or persistent unexplained polyhydramnios carries a 2–5× rise in perinatal morbidity and mortality." },

      { type: "subheading", value: "Definition & classification" },
      { type: "text", value: "Fluid is assessed on ultrasound by amniotic fluid index (AFI — sum of four cord/limb-free quadrants) or deepest vertical pool (DVP). Neither method is superior. A constant AFI ≥25 cm or DVP ≥8 cm can be used across gestations. Incidence 0.2–3.9%." },
      { type: "table",
        headers: ["Severity", "AFI", "Anomaly risk despite a normal scan"],
        rows: [
          ["Mild", "25.0–29.9 cm", "~1%"],
          ["Moderate", "30.0–34.9 cm", "~2%"],
          ["Severe", "> 35 cm", "~11%"],
        ],
      },

      { type: "subheading", value: "Aetiology" },
      { type: "text", value: "A cause is found in about half of cases; the rest are unexplained (diagnosis of exclusion). Every case needs a systematic search for a cause." },
      { type: "list", items: [
        "Maternal: uncontrolled diabetes (with macrosomia), red-cell isoimmunisation → immune hydrops, lithium (fetal diabetes insipidus).",
        "Fetal — impaired swallowing/obstruction: oesophageal atresia & tracheo-oesophageal fistula, duodenal atresia, CDH, CCAM; neurological (anencephaly, myotonic dystrophy, arthrogryposis); genetic (Beckwith–Wiedemann); hydrops; tumours (e.g. sacrococcygeal teratoma); congenital infection (toxoplasma, CMV, parvovirus).",
        "Placental: chorioangioma (polyhydramnios in ~30%).",
        "Unexplained: 50–60% of all cases — linked with malpresentation, macrosomia and primary caesarean, and a 2–5× rise in perinatal morbidity/mortality.",
      ]},
      { type: "text", value: "Aneuploidy is present in ~10% when there is a sonographic anomaly plus polyhydramnios, but only ~1% with a normal scan; persistent polyhydramnios carries a 10–20% aneuploidy risk." },

      { type: "subheading", value: "Assessment & investigations" },
      { type: "list", items: [
        "Maternal: random blood sugar / OGTT / HbA1c; red-cell antibodies; TORCH screen (toxoplasma, CMV, parvovirus) if features of fetal infection.",
        "Detailed fetal ultrasound for structural anomaly — visualise the stomach (abnormal if small/absent after 45 min), assess long bones & thorax (skeletal dysplasia), fetal movements/tone/joints; consider fetal echocardiography.",
        "Consider karyotyping on an individual-case basis, factoring in nuchal translucency / Down syndrome screening.",
        "Transvaginal cervical length to quantify preterm-labour risk.",
      ]},

      { type: "subheading", value: "Management in pregnancy" },
      { type: "list", items: [
        "Treat the cause — MDT (maternal medicine, diabetology, dietetics) for diabetes; better glycaemic control improves outcomes.",
        "Refer to maternal–fetal medicine if: suspected fetal anomaly, SGA fetus, concerns about fetal movements, or persistent/worsening polyhydramnios.",
        "Counsel on risks: preterm birth (consider steroids if cervical shortening), unstable lie (→ caesarean), cord prolapse, placental abruption, and postpartum haemorrhage.",
        "Therapeutic amnioreduction (amniodrainage) for maternal respiratory compromise or significant cervical shortening — stop when AFI < 25 cm or discomfort relieved; complication rate ~1.5% (preterm labour, PPROM, chorioamnionitis, abruption); high recurrence.",
        "Prostaglandin synthetase inhibitors (indomethacin; sulindac 200 mg 12-hourly) reduce fluid but risk ductus arteriosus constriction and impaired fetal renal function — specialist supervision only, not for general obstetric practice.",
        "Serial ultrasound for liquor volume and fetal growth. Mild polyhydramnios often resolves — its only consistent association is a higher incidence of large-for-gestational-age babies.",
      ]},

      { type: "subheading", value: "Management of labour" },
      { type: "list", items: [
        "Insufficient evidence to induce for polyhydramnios alone — benefits do not outweigh the risks; induce only for a maternal or fetal indication (e.g. uncontrolled diabetes, prolonged pregnancy, hypertension).",
        "Anticipate labour dystocia if macrosomic; consider controlled amniotomy in theatre; be prepared for shoulder dystocia and PPH.",
        "In unexplained polyhydramnios, arrange a thorough neonatal examination including checking upper-GI patency with a nasogastric tube, and raise a neonatal alert.",
      ]},

      { type: "subheading", value: "Key points" },
      { type: "list", items: [
        "Mild polyhydramnios resolves frequently and is not usually associated with adverse perinatal outcomes (apart from more LGA babies).",
        "Severe polyhydramnios carries a higher prevalence of aneuploidy (10–20%) and structural anomaly.",
        "Overall fetal loss is up to ~4%, rising to ~60% where there is a coexistent structural anomaly.",
        "Unexplained polyhydramnios is a diagnosis of exclusion and warrants strategic surveillance.",
      ]},

      { type: "text", value: "Summary of a TOG review (Karkhanis & Patni, TOG 2014;16:207–13). Read the full article for the complete discussion, figures and references; verify all doses and thresholds against local protocol." },
    ],
  },
];
