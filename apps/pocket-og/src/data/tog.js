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
    flowchartId: "TOG_POLYHYDRAMNIOS",
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

  {
    id: "tog-oligohydramnios",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Fetal / Amniotic Fluid",
    title: "Isolated Oligohydramnios",
    draft: false,
    tog: {
      article: "Management of isolated abnormal amniotic fluid volume in pregnancy",
      authors: "Falola AO, Filby L, Timmons P, Alleemudder D",
      citation: "TOG 2026;28:41–50",
      doi: "10.1111/tog.70021",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.70021",
    },
    flowchartId: "TOG_OLIGOHYDRAMNIOS",
    relatedGl: ["GL895", "GTG31", "GL861"],
    tags: [
      "oligohydramnios", "anhydramnios", "low amniotic fluid", "reduced liquor", "low afi",
      "low amniotic fluid index", "single deepest vertical pocket", "sdvp", "isolated oligohydramnios",
      "idiopathic oligohydramnios", "potter sequence", "potter's sequence", "renal agenesis",
      "bilateral renal agenesis", "pulmonary hypoplasia", "amnioinfusion", "cord compression",
      "placental insufficiency oligohydramnios", "fgr oligohydramnios", "sga oligohydramnios",
      "induction oligohydramnios", "timing of delivery oligohydramnios", "low liquor volume",
      "reduced amniotic fluid", "tog review", "amniotic fluid",
    ],
    content: [
      { type: "alert", value: "Bottom line: oligohydramnios = AFI ≤5 cm or SDVP <2 cm; anhydramnios = no measurable pool. Isolated (idiopathic) oligohydramnios is a diagnosis of exclusion, complicating 0.5–5% of pregnancies. There is no consensus on timing of delivery — practice varies widely, and evidence does not clearly show early induction improves outcomes." },

      { type: "subheading", value: "Measurement" },
      { type: "text", value: "SDVP (single/maximum deepest vertical pocket) is generally preferred to AFI for screening — AFI increases the diagnosis of oligohydramnios (Cochrane 2008; SAFE trial 2015) without improving outcome. Oligohydramnios: AFI ≤5 cm or SDVP <2 cm." },

      { type: "subheading", value: "Early-onset vs isolated oligohydramnios" },
      { type: "alert", value: "Early-onset (2nd trimester) oligohydramnios is different from term isolated oligohydramnios — it is nearly always due to fetal or maternal pathology (previable PPROM, bilateral renal agenesis or severe renal impairment) and carries major morbidity. Bilateral renal agenesis → Potter's sequence (clubbed feet, pulmonary hypoplasia, cranial/skin abnormalities) — considered incompatible with life; this review focuses on isolated (term) oligohydramnios, not early-onset disease." },

      { type: "subheading", value: "Causes" },
      { type: "list", items: [
        "Maternal — placental: hypertensive disease / pre-eclampsia, nephropathy; disruptions to fluid state: hyperemesis, dehydration, anorexia.",
        "Fetal: congenital infection (toxoplasma, rubella, CMV, HSV); medications (ACE inhibitors, ARBs, NSAIDs/indomethacin); chromosomal abnormality; renal outflow obstruction (bilateral renal agenesis, PUJ obstruction, bilateral MCDK, posterior urethral valves, LUTO); fetal anaemia.",
        "Placental / other: placental insufficiency (FGR), prolonged/post-dates pregnancy, twin-to-twin transfusion syndrome, rupture of membranes.",
      ]},
      { type: "text", value: "Rupture of membranes and placental insufficiency/FGR are the two causes to actively exclude — some authors argue isolated oligohydramnios should always be treated as a possible marker of placental insufficiency and managed as higher risk." },

      { type: "subheading", value: "Assessment & investigations" },
      { type: "list", items: [
        "History & exam: speculum if ROM suspected, blood pressure, medication review (ACEi/ARB/NSAID), hydration status, travel/infection history.",
        "Urine: dipstick/PCr to rule out pre-eclampsia.",
        "Bloods: PlGF / sFlt-1:PlGF ratio if placental disease suspected; renal function if maternal renal impairment suspected.",
        "Detailed ultrasound: growth, MCA Dopplers (if FGR or fetal anaemia suspected), structural anomaly screen; consider TORCH screen.",
        "If all normal (no ROM, infection, placental disease or anomaly) → isolated/idiopathic oligohydramnios.",
      ]},

      { type: "subheading", value: "Management in pregnancy" },
      { type: "list", items: [
        "Increased ultrasound surveillance and monitoring for a deteriorating fetus (consistent ACOG/NICE position).",
        "Amnioinfusion has limited evidence: mainly studied for cord-compression reduction in labour, not for improving AFV antenatally — not routine UK practice.",
        "Continuous intrapartum monitoring is advised given the increased risk of fetal hypoxia from cord compression.",
        "There is an increased rate of SGA only discovered after birth, despite antenatal surveillance — keep a low threshold to reassess growth.",
      ]},

      { type: "subheading", value: "Timing of delivery — no consensus" },
      { type: "alert", value: "ACOG, FIGO, NICE and RCOG do not agree on timing of delivery for isolated oligohydramnios. Induction (especially prostaglandin E2 with an unfavourable cervix) is associated with more emergency caesarean sections and non-reassuring CTG, but evidence does not clearly show early induction reduces perinatal morbidity/mortality either way." },
      { type: "text", value: "Review authors' pragmatic view: given the association between term/post-term isolated oligohydramnios and postnatal diagnosis of SGA, offer induction of labour at term — but individualise to the woman's risk factors pending better evidence." },

      { type: "subheading", value: "After birth" },
      { type: "list", items: [
        "Higher rate of respiratory distress and lower Apgar scores reported, particularly post-dates — deliver where neonatal services are accessible.",
        "Increased rate of placental disorders reported in a subsequent pregnancy after a pregnancy with isolated oligohydramnios — consider increased growth surveillance next time.",
      ]},

      { type: "subheading", value: "Key points" },
      { type: "list", items: [
        "Isolated oligohydramnios is a diagnosis of exclusion — actively rule out ROM, infection, placental disease and fetal anomaly first.",
        "SDVP is the preferred screening measure over AFI (fewer over-diagnoses, same outcomes).",
        "No professional body agrees on timing of delivery — decisions should be individualised and discussed with the woman.",
        "Continuous fetal monitoring in labour is advised because of the cord-compression risk from reduced liquor.",
      ]},

      { type: "text", value: "Summary of a TOG review (Falola, Filby, Timmons & Alleemudder, TOG 2026;28:41–50), which also updates polyhydramnios data — read the full article for the complete discussion, figures, tables and references; verify all thresholds against local protocol." },
    ],
  },
];
