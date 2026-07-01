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
//   tog: { article, authors, citation, doi, url, year }  — provenance + link-out;
//     `year` surfaces in the collapsed card's meta line so it's visible at a
//     glance how current a review is, without expanding it.
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
      year: 2014,
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
      { type: "alert", value: "Bottom line: polyhydramnios = SDVP >8 cm or AFI >24 cm. Idiopathic (isolated) polyhydramnios is the most common cause — 60–70% of all cases (~1% of all pregnancies), usually mild-to-moderate and picked up in the third trimester. Mild polyhydramnios usually resolves and carries little excess risk beyond a higher rate of LGA babies; risk rises with severity, and severe polyhydramnios carries meaningfully higher fetal and maternal morbidity." },

      { type: "subheading", value: "Definition & classification" },
      { type: "text", value: "Fluid is assessed on ultrasound by single/maximum deepest vertical pocket (SDVP — also called MVP or DVP) or amniotic fluid index (AFI — sum of four cord/limb-free quadrants). There is no single agreed severity classification; the table below (Fetal Medicine Foundation / Pagan et al.) is the most widely used. Polyhydramnios complicates 1–2% of pregnancies (earlier estimates ranged 0.2–3.9%)." },
      { type: "table",
        headers: ["Severity", "SDVP", "AFI", "Genomic abnormality risk (isolated cases)"],
        rows: [
          ["Mild", "≥8–<12 cm", "≥24.0–<30 cm", "~1%"],
          ["Moderate", "≥12–<16 cm", "≥30.0–<35 cm", "~2%"],
          ["Severe", "≥16 cm", "≥35.0 cm", "~10%"],
        ],
      },
      { type: "text", value: "A 2024 meta-analysis found an overall genomic abnormality rate of ~4.5% in apparently isolated polyhydramnios — the most common finding (~21% of abnormal cases) was Bartter syndrome, an autosomal recessive polyuric disorder that can be fatal in the newborn." },

      { type: "subheading", value: "Aetiology" },
      { type: "text", value: "Idiopathic (unexplained) polyhydramnios is the single most common cause overall, and fetal abnormalities account for over 30% of severe cases. Every case needs a systematic search for a cause." },
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
        "Prostaglandin synthetase inhibitors reduce fluid but risk ductus arteriosus constriction and impaired fetal renal function — indomethacin is no longer used because of neonatal morbidity; sulindac (200 mg 12-hourly) has a better adverse-effect profile but remains specialist-supervision only, not for general obstetric practice.",
        "Serial ultrasound for liquor volume and fetal growth. Mild polyhydramnios often resolves — its only consistent association is a higher incidence of large-for-gestational-age babies.",
      ]},

      { type: "subheading", value: "Timing of delivery — by severity (isolated polyhydramnios)" },
      { type: "alert", value: "Evidence on induction timing is inconsistent and randomised trials are lacking. Individualise, and weigh against the woman's own risk factors." },
      { type: "table",
        headers: ["Severity", "Delivery guidance"],
        rows: [
          ["Mild", "No clear benefit of induction; continuous CTG in labour is advised regardless of severity"],
          ["Moderate", "Induction may be offered from 40 weeks after discussing risks and benefits"],
          ["Severe", "Significant risk of adverse outcome — induction before 40 weeks should be offered; exact timing individualised"],
        ],
      },
      { type: "subheading", value: "Management of labour" },
      { type: "list", items: [
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

      { type: "text", value: "Base review: Karkhanis & Patni, TOG 2014;16:207–13. Classification thresholds, anomaly-risk figures and delivery-timing guidance updated to the newer companion review — Falola, Filby, Timmons & Alleemudder, TOG 2026;28:41–50 (DOI 10.1111/tog.70021), which covers polyhydramnios and oligohydramnios together. Read both full articles for the complete discussion and references; verify all doses and thresholds against local protocol." },
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
      year: 2026,
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

  {
    id: "tog-thyroid-disease-pregnancy",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Thyroid Disease in Pregnancy",
    draft: false,
    tog: {
      article: "Thyroid disease in pregnancy",
      authors: "Girling J",
      citation: "TOG 2008;10:237–243",
      doi: "10.1576/toag.10.4.237.27440",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1576/toag.10.4.237.27440",
      year: 2008,
    },
    flowchartId: "TOG_THYROID",
    relatedGl: ["GTG69", "GL952"],
    tags: [
      "thyroid disease pregnancy", "hypothyroidism pregnancy", "hyperthyroidism pregnancy",
      "graves disease pregnancy", "thyrotoxicosis pregnancy", "thyroid function tests pregnancy",
      "tft pregnancy", "tsh pregnancy", "free t4", "ft4", "levothyroxine pregnancy",
      "thyroxine dose pregnancy", "carbimazole", "propylthiouracil", "ptu", "antithyroid drugs",
      "subclinical hypothyroidism", "hypothyroxinaemia", "thyroid storm", "trab", "tsh receptor antibodies",
      "fetal goitre", "fetal thyrotoxicosis", "neonatal thyrotoxicosis", "neonatal hypothyroidism",
      "iodine deficiency pregnancy", "hyperemesis thyroid", "hcg thyroid", "radioactive iodine pregnancy",
      "thyroid surgery pregnancy", "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: interpret thyroid function against trimester-specific reference ranges, not standard ones — pregnancy physiology shifts TSH/fT4 and total hormone levels. Hypothyroidism (~1% of pregnancies) needs euthyroidism ideally before conception — only first-trimester control affects the fetus. Hyperthyroidism (~2 per 1000, usually Graves') is managed with the lowest effective antithyroid dose; many women can reduce or stop treatment in the third trimester." },

      { type: "subheading", value: "Why pregnancy changes the numbers" },
      { type: "list", items: [
        "Thyroxine-binding globulin triples by 20 weeks (oestrogen-driven) — total T4/T3 rise and are unreliable; fT4/fT3 are the tests of choice, read against trimester-specific ranges.",
        "hCG shares a receptor subunit with TSH — a first-trimester 'spillover' can biochemically mimic hyperthyroidism, especially with multiple pregnancy, molar pregnancy or hyperemesis gravidarum.",
        "Maternal thyroxine (not fT3) crosses the placenta before 12 weeks and matters for fetal brain development; after 12 weeks the fetal thyroid runs independently, provided maternal iodine intake is adequate.",
      ]},
      { type: "table",
        headers: ["Excess thyroid hormone", "Deficient thyroid hormone"],
        rows: [
          ["Heat intolerance, increased appetite, sweating, palpitations, tachycardia", "Constipation, tiredness, weight gain, hair thinning"],
        ],
      },
      { type: "text", value: "Both extremes mimic normal pregnancy symptoms — this is exactly why biochemistry (not clinical impression) drives management." },

      { type: "subheading", value: "Hypothyroidism" },
      { type: "list", items: [
        "Distinguish: untreated hypothyroidism (low fT4, high TSH, often symptomatic — needs urgent thyroxine); previously diagnosed but suboptimally treated; subclinical hypothyroidism (normal fT4, raised TSH, asymptomatic — treatment debatable); hypothyroxinaemia (low T4, normal TSH).",
        "Aim for euthyroidism before conception — only first-trimester control has been linked to fetal neurodevelopment in the literature, and the evidence for dose-adjustment improving outcome is not conclusive.",
        "Hypothyroidism itself does not appear to influence pregnancy outcome once euthyroid — don't base management on preventing obstetric complications.",
        "If optimally treated at conception: test pre-pregnancy, early first trimester, and again in the second/third trimester — most antenatal care can be midwifery-led.",
      ]},

      { type: "subheading", value: "Hyperthyroidism (usually Graves' disease)" },
      { type: "list", items: [
        "Goal: euthyroidism as early as possible, ideally pre-conception — this minimises maternal and fetal complications.",
        "Beta-blockade (propranolol) for tachycardia/tremor/anxiety if needed — maternal/fetal benefit outweighs growth-restriction concerns.",
        "Antithyroid drugs (carbimazole or propylthiouracil) block synthesis and reduce TSH-receptor antibody titre — use the lowest effective dose; both cross the placenta similarly.",
        "Useful clinical clues: failure to gain weight despite good appetite, tachycardia >100 bpm not slowing with Valsalva, onycholysis. Eye signs and pretibial myxoedema do NOT reflect current disease activity.",
        "Monitor thyroid function monthly when stable, more often if new/relapsing; titrate against results. Disease activity tends to worsen in the first trimester/puerperium and improve in the 2nd–3rd trimester — around a third of women can stop treatment in pregnancy, reducing fetal hypothyroidism risk. Most need to restart/increase postnatally.",
        "Both drugs can cause agranulocytosis — tell women to report a sore throat immediately; this is not a reason to switch agents routinely.",
        "Radioactive iodine is absolutely contraindicated in pregnancy (crosses the placenta, destroys the fetal thyroid). Surgery can be done in pregnancy (usually 2nd trimester) for compression, suspected malignancy or failed medical therapy — needs an experienced thyroid surgeon.",
        "Breastfeeding: minimal transfer for both agents; carbimazole transfers somewhat more than propylthiouracil — split doses through the day, feed before a dose where possible, monitor neonatal thyroid function.",
      ]},

      { type: "table",
        headers: ["Complications of poorly controlled hyperthyroidism", ""],
        rows: [
          ["Maternal", "Thyroid storm, congestive cardiac failure, pre-eclampsia"],
          ["Fetal", "Fetal growth restriction, prematurity, stillbirth"],
        ],
      },

      { type: "subheading", value: "Fetal & neonatal thyrotoxicosis" },
      { type: "list", items: [
        "TSH-receptor stimulating antibodies (TRAb) cross the placenta — measure them in anyone with active Graves' disease or a past history treated by surgery/radioactive iodine.",
        "If TRAb positive, monitor for fetal thyrotoxicosis: tachycardia, excessive movements, growth restriction, oligohydramnios, goitre (can cause neck extension/obstructed labour), polyhydramnios (oesophageal pressure), hydrops, or intrauterine death.",
        "Management: deliver if gestation allows; otherwise high-dose antithyroid drug titrated against fetal heart rate — maternal thyroxine can be added if she becomes clinically hypothyroid (it doesn't cross the placenta).",
        "Neonatal hypothyroidism (from transplacental antithyroid drugs) is usually self-limiting. Neonatal hyperthyroidism can present 7–10 days postnatally (once maternal antithyroid drug has cleared but TRAb persists) — warn parents to watch for weight loss or poor feeding.",
      ]},

      { type: "subheading", value: "Hyperemesis gravidarum vs Graves' disease" },
      { type: "alert", value: "hCG-driven biochemical hyperthyroidism occurs in >60% of severe hyperemesis gravidarum — suppressed TSH, high/very high fT4. It is NOT true thyroid disease and does not need antithyroid medication." },
      { type: "list", items: [
        "Favours HG-related thyrotoxicosis: symptoms clearly postdate the pregnancy, no goitre or eye signs, tachycardia responds to IV rehydration, thyroid autoantibodies negative (their absence supports HG, though presence doesn't exclude it).",
        "Usually resolves by ~19–20 weeks as hCG falls — confirm normalisation as the hyperemesis settles rather than starting antithyroid drugs.",
        "If genuine doubt about first-trimester Graves' presenting with vomiting: take a detailed history and repeat testing as hyperemesis resolves; antithyroid medication crosses the placenta and risks fetal hypothyroidism, so avoid it unless truly indicated.",
      ]},

      { type: "subheading", value: "Iodine deficiency — a global perspective" },
      { type: "text", value: "Worldwide, iodine deficiency is the leading preventable cause of mental handicap (neurological cretinism), affecting millions in deficient regions. Supplementation before conception or up to the second trimester can protect the fetal brain and reduce pregnancy loss — a key ethical/public-health issue even where routine practice locally is unaffected." },

      { type: "subheading", value: "Key points" },
      { type: "list", items: [
        "Always use trimester-specific reference ranges — standard non-pregnant ranges will misclassify normal pregnancy physiology as disease.",
        "Hypothyroidism: get euthyroid before conception; only first-trimester control matters for the fetus.",
        "Hyperthyroidism: lowest effective antithyroid dose, monthly monitoring, expect to reduce/stop in the third trimester, radioactive iodine is contraindicated.",
        "Measure TRAb in anyone with active or past Graves' disease — positive results need fetal surveillance for thyrotoxicosis.",
        "hCG-mediated hyperthyroidism in hyperemesis is not Graves' disease and does not need antithyroid drugs.",
      ]},

      { type: "text", value: "Summary of a TOG review (Girling J, TOG 2008;10:237–243). Read the full article for the complete discussion and references; verify all doses and thresholds against local protocol." },
    ],
  },

  {
    id: "tog-cardiac-congenital",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Cardiac Disease in Pregnancy — Congenital Heart Disease",
    draft: false,
    tog: {
      article: "Cardiac disease in pregnancy. Part 1: congenital heart disease",
      authors: "Gelson E, Johnson M, Gatzoulis M, Uebing A",
      citation: "TOG 2007;9:15–20",
      doi: "10.1576/toag.9.1.015.27291",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1576/toag.9.1.015.27291",
      year: 2007,
    },
    flowchartId: "TOG_CHD_PREGNANCY",
    relatedGl: ["GL952", "MBRRACE_SLMC2025"],
    tags: [
      "congenital heart disease pregnancy", "chd pregnancy", "cardiac disease pregnancy",
      "heart disease pregnancy", "coarctation of the aorta", "tetralogy of fallot",
      "transposition of the great arteries", "tga", "fontan", "marfan syndrome pregnancy",
      "pulmonary hypertension pregnancy", "eisenmenger syndrome", "cyanotic heart disease",
      "nyha class", "cardiac risk pregnancy", "aortic root dilatation", "aortopathy",
      "prepregnancy cardiac counselling", "cardiac indications caesarean", "cardiac mdt",
      "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: heart disease is now the most common indirect cause of maternal death in the UK. Congenital heart disease now accounts for the majority of cardiac disease in pregnancy (up from 5% to ~80% of cases over two decades) — a direct result of more children surviving corrective surgery into reproductive age. Ideally, pregnancy is planned and managed by a multidisciplinary team (obstetrics, cardiology, anaesthetics, neonatology, midwifery)." },

      { type: "subheading", value: "Why pregnancy is high-risk with heart disease" },
      { type: "list", items: [
        "Systemic vascular resistance falls to 30–70% of preconception values by 8 weeks — this drives fluid retention, plasma volume expansion and a falling haematocrit.",
        "Cardiac output rises (via stroke volume and heart rate), peaking at 20–24 weeks and staying high to term; BP falls until mid-pregnancy, then returns to prepregnancy levels late in the second trimester.",
        "Labour (especially the second stage) and the immediate postpartum period are the highest-risk points — auto-transfusion during contractions and the return of uterine blood to the circulation after delivery both spike cardiac output further. Cardiac output stays high for 24 hours postpartum, with rapid volume shifts over the first 2 weeks — this is when pulmonary oedema risk peaks.",
      ]},

      { type: "subheading", value: "Predictors of adverse cardiac events" },
      { type: "table",
        headers: ["Predicts a maternal cardiac event", "Predicts an adverse neonatal event"],
        rows: [
          ["Prior cardiac event (heart failure, TIA, stroke) or arrhythmia", "NYHA class >II or cyanosis at the baseline antenatal visit"],
          ["Baseline NYHA class >II or cyanosis", "Maternal left heart obstruction"],
          ["Left heart obstruction (mitral valve area <2cm², aortic valve area <1.5cm², or peak outflow gradient >30mmHg)", "Maternal smoking"],
          ["Reduced systemic LV function (ejection fraction <40%)", "Multiple gestation / anticoagulation during pregnancy"],
        ],
      },

      { type: "subheading", value: "Management principles" },
      { type: "list", items: [
        "Prepregnancy counselling: explain the impact of pregnancy on the specific lesion, the risk to mother and fetus, and the chance of congenital heart disease in the baby.",
        "Labour/delivery: vaginal delivery with low-dose epidural is the mode of choice; forceps/ventouse can shorten maternal expulsive effort. Left lateral position; monitor preload and BP; minimise blood loss.",
        "Caesarean is reserved for specific cardiac indications: aortopathy with aortic root >4cm, aortic dissection/aneurysm, or warfarin within the last 2 weeks.",
        "Antibiotic prophylaxis in labour for everyone except repaired PDA, isolated ostium secundum ASD, or mitral valve prolapse without regurgitation.",
        "Third stage: avoid oxytocin bolus (causes hypotension) — use a low-dose infusion instead; avoid ergometrine (acute hypertension). Uterine compression sutures are useful for atony at caesarean.",
        "Postpartum haemodynamic monitoring for 24–72 hours typically, extended to 10–14 days with pulmonary hypertension; multidisciplinary follow-up at 6 weeks.",
      ]},

      { type: "subheading", value: "Lesion-specific risk — low risk" },
      { type: "list", items: [
        "Small left-to-right shunts (ASD/VSD/PDA): well tolerated absent pulmonary hypertension. ASDs carry atrial arrhythmia/paradoxical embolism risk — low threshold for heparin prophylaxis; labour needs careful management as blood loss or regional-anaesthesia vasodilatation can alter shunt direction.",
        "Repaired coarctation: usually well tolerated. Assess pre-conception for re-coarctation, repair-site aneurysm, bicuspid valve or hypertension. Risk of aortic dissection/rupture in both repaired and native disease — control BP tightly with beta-blockers first-line; monitor fetal growth.",
        "Repaired tetralogy of Fallot: generally well tolerated, but watch for arrhythmia and RV failure, especially with residual shunts, RVOT obstruction or pulmonary hypertension. Echo before pregnancy; regular cardiac review throughout; some need diuretics or bed rest for pulmonary regurgitation symptoms.",
      ]},

      { type: "subheading", value: "Lesion-specific risk — moderate risk" },
      { type: "list", items: [
        "Transposition of the great arteries post-Mustard/Senning repair (systemic RV): usually tolerated if uncomplicated; poorly tolerated with long-term complications (RV dysfunction, tricuspid regurgitation, arrhythmia). Stop ACE inhibitors before conception (fetal nephrotoxicity/malformation).",
        "Cyanotic heart disease without pulmonary hypertension: falling SVR and rising cardiac output worsen right-to-left shunting and hypoxia. Maternal risk depends on ventricular function; fetal effects are marked (30–50% preterm/low birthweight risk) — maternal hypoxaemia severity is the strongest predictor of neonatal outcome. Bed rest and oxygen therapy help.",
        "Fontan circulation: increasing numbers now reach childbearing age. Main concern is the ability to augment cardiac output/heart rate; tendency to poorly-tolerated atrial arrhythmias. Maternal risk is low in NYHA I–II with good ventricular function.",
      ]},

      { type: "subheading", value: "Lesion-specific risk — high risk" },
      { type: "list", items: [
        "Marfan syndrome: aortic dissection/rupture risk depends on aortic root diameter — ~1% maternal mortality if <4cm, up to 25% if >4cm. Postpone pregnancy until aortic arch replacement if the root is dilated; discuss termination for an unplanned pregnancy in this context. Serial echocardiograms, prophylactic beta-blockade if dilatation occurs, and aggressive BP control.",
        "Pulmonary vascular disease/pulmonary hypertension of any cause: very high risk — fixed pulmonary vascular resistance can't match the rise in cardiac output. Mortality varies by cause: Eisenmenger syndrome 36%, primary pulmonary hypertension 30%, secondary pulmonary hypertension 56%. Offer termination for an unplanned pregnancy; if continuing, close monitoring and bed rest from the third trimester, surveillance to 14 days postpartum. Anticoagulation, oxygen and pulmonary vasodilators may help; only 15–25% of these pregnancies reach term.",
      ]},

      { type: "subheading", value: "Neonatal outcome and inheritance" },
      { type: "list", items: [
        "Neonatal complications (preterm birth, SGA, respiratory distress, IVH, death) are all increased — predicted by obstetric risk factors, multiple gestation, smoking and anticoagulation.",
        "Offspring inheritance risk of congenital heart disease is 3–5% overall (vs 1% general population) — around 3% for common lesions like tetralogy of Fallot, up to 10% for ASD, coarctation or aortic stenosis. Marfan syndrome is autosomal dominant with a 50% recurrence rate.",
      ]},

      { type: "text", value: "Part 1 of a two-part TOG review (Gelson, Johnson, Gatzoulis & Uebing, TOG 2007;9:15–20) — see also Part 2: Acquired Heart Disease. Read the full article for the complete discussion and references; verify all thresholds against local protocol." },
    ],
  },

  {
    id: "tog-cardiac-acquired",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Cardiac Disease in Pregnancy — Acquired Heart Disease & Arrhythmias",
    draft: false,
    tog: {
      article: "Cardiac disease in pregnancy. Part 2: acquired heart disease",
      authors: "Gelson E, Johnson M, Gatzoulis M, Uebing A",
      citation: "TOG 2007;9:83–87",
      doi: "10.1576/toag.9.2.083.27308",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1576/toag.9.2.083.27308",
      year: 2007,
    },
    flowchartId: "TOG_ACQUIRED_CARDIAC",
    relatedGl: ["GL891", "MBRRACE_SLMC2025"],
    tags: [
      "acquired heart disease pregnancy", "valvular heart disease pregnancy", "mitral stenosis pregnancy",
      "mitral regurgitation", "mitral valve prolapse", "aortic stenosis pregnancy",
      "mechanical heart valve pregnancy", "prosthetic valve anticoagulation", "warfarin pregnancy heart valve",
      "ischaemic heart disease pregnancy", "myocardial infarction pregnancy", "cardiac arrhythmia pregnancy",
      "svt pregnancy", "supraventricular tachycardia pregnancy", "atrial fibrillation pregnancy",
      "ventricular tachycardia pregnancy", "dilated cardiomyopathy pregnancy", "hypertrophic cardiomyopathy pregnancy",
      "peripartum cardiomyopathy", "rheumatic heart disease pregnancy", "amiodarone pregnancy",
      "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: rheumatic and ischaemic heart disease are both expected to rise in the UK because of immigration patterns and increasing maternal age. Regurgitant valve lesions are generally well tolerated in pregnancy; stenotic lesions are not. Mechanical heart valves need careful anticoagulation planning — every available regimen carries a real fetal loss risk (up to 30%)." },

      { type: "subheading", value: "Causes" },
      { type: "text", value: "Rheumatic valvular disease is declining in the UK-born population but rising with immigration from countries where rheumatic fever remains prevalent — often first recognised in pregnancy when cardiac demand increases. Ischaemic heart disease is rising with maternal age, diabetes, obesity and smoking. Peripartum cardiomyopathy occurs mainly around delivery, associated with multiple pregnancy and pre-eclampsia." },

      { type: "subheading", value: "Valvular heart disease" },
      { type: "list", items: [
        "Mitral stenosis (the most common clinically significant valvular lesion in pregnancy): rising heart rate/stroke volume increases the trans-valvular gradient and left atrial pressure — dyspnoea, orthopnoea, PND, pulmonary oedema, and atrial fibrillation risk (persists into the puerperium). NYHA III/IV or valve area <1cm² → delay conception until after correction. Medical therapy: bed rest and diuretics to reduce volume overload, beta-blockade to optimise filling; AF needs prompt DC cardioversion, beta-blockers or digoxin. Balloon mitral valvuloplasty is safe and effective if symptoms are refractory.",
        "Mitral valve prolapse (the most common cardiac abnormality in pregnant women, 12–17%): without regurgitation, rarely causes complications.",
        "Mitral regurgitation: usually well tolerated (falling SVR reduces afterload). Asymptomatic — no treatment needed; symptomatic heart failure — nitrates, hydralazine, diuretics, digoxin.",
        "Aortic stenosis: usually congenital in young women. Symptomatic, severe (peak gradient >80mmHg), or with LV dysfunction → delay conception until after correction. If symptomatic in pregnancy: bed rest, consider valve replacement — avoid cardiopulmonary bypass where possible (1.5–5% maternal mortality, 16–33% fetal mortality regardless of gestation; fetal mortality can drop to 10% by avoiding hypothermia and maintaining perfusion pressure). Aortic balloon valvuloplasty can palliate until after delivery.",
      ]},

      { type: "subheading", value: "Mechanical prosthetic valves — anticoagulation" },
      { type: "alert", value: "Bioprosthetic valves carry no increased risk and don't degenerate faster in pregnancy. Mechanical valves carry a 45% thrombotic-episode incidence and 1–4% maternal mortality — anticoagulation strategy is a genuine trade-off, not a solved problem." },
      { type: "table",
        headers: ["Regimen", "Maternal thromboembolism", "Fetal abnormality", "Fetal loss"],
        rows: [
          ["Warfarin throughout, stop at 38 weeks for elective LSCS", "4%", "6%", "~30%"],
          ["LMWH weeks 6–12, then warfarin to 38 weeks, then LSCS", "9%", "0%", "~30%"],
          ["LMWH throughout pregnancy", "25%", "0%", "~30%"],
        ],
      },
      { type: "text", value: "Low-dose aspirin is used as an adjunct to heparin. Monitor LMWH with monthly anti-factor Xa levels, aiming for the high therapeutic range. Whatever regimen is chosen, fetal loss risk is up to 30% — this needs an informed discussion of relative risks and benefits." },
      { type: "text", value: "Endocarditis prophylaxis: give antibiotics in labour/delivery for all valvular lesions except mitral valve prolapse without regurgitation." },

      { type: "subheading", value: "Ischaemic heart disease" },
      { type: "list", items: [
        "Acute MI is rare in pregnancy (1 in 10,000) but carries 37–50% maternal mortality, mostly at the time of infarction. Pregnancy itself isn't an established independent risk factor, though the physiological changes are plausible contributors.",
        "Treat exactly as outside pregnancy: heparin, beta-blockers, nitrates. Coronary angiography is safe; PCI is first-line. Thrombolysis can cause placental-site bleeding but remains indicated when needed.",
      ]},

      { type: "subheading", value: "Cardiac arrhythmias" },
      { type: "list", items: [
        "Pregnancy increases arrhythmia incidence (hormonal changes, autonomic shifts, haemodynamic demand, mild hypokalaemia) — risk is highest during labour and delivery.",
        "Atrial/ventricular ectopics are common and benign — no further investigation needed.",
        "SVT (new or worsening) is more common in pregnancy, including AF/flutter (thromboembolism and fetal risk — treat promptly) and re-entrant tachycardias (WPW, LGL).",
        "Stable SVT: vagal manoeuvre first; IV adenosine is safe if that fails; second-line digoxin, beta-blockers or calcium-channel blockers.",
        "VT is uncommon and usually reflects structural disease. Stable: lidocaine or procainamide; beta-blockers/sotalol used prophylactically. Amiodarone is contraindicated (fetal hypothyroidism, growth restriction, prematurity).",
        "Any haemodynamically unstable tachyarrhythmia: electrical cardioversion is safe in pregnancy — manage the airway (aspiration risk) and avoid the supine position (aortocaval compression).",
      ]},

      { type: "subheading", value: "Cardiomyopathy" },
      { type: "list", items: [
        "Dilated: poorly tolerated — 7% mortality with NYHA III/IV, risk of heart failure, irreversible LV dysfunction and fetal loss. Counsel accordingly; offer termination for an unplanned pregnancy.",
        "Hypertrophic: usually well tolerated if asymptomatic pre-pregnancy; risk of symptomatic progression, AF, syncope and maternal death if there was pre-existing heart failure or severe symptoms.",
        "Peripartum cardiomyopathy: LV systolic dysfunction/heart failure presenting in the last month of pregnancy to 5 months postpartum. Rare (~1 in 2,289 live births) and a diagnosis of exclusion — rule out other causes of dilated cardiomyopathy with heart failure first. Treat with beta-blockers, diuretics, hydralazine and digoxin (switch to ACE inhibitors postpartum). ~20% die or need transplantation; the rest recover partially or fully. A future pregnancy carries a higher relapse risk if LV function hasn't fully recovered — and some residual risk even after full recovery. There's no consensus on recommendations for future pregnancies.",
      ]},

      { type: "text", value: "Part 2 of a two-part TOG review (Gelson, Johnson, Gatzoulis & Uebing, TOG 2007;9:83–87) — see also Part 1: Congenital Heart Disease. Read the full article for the complete discussion and references; verify all doses and thresholds against local protocol." },
    ],
  },
];
