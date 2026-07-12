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
    id: "tog-ovarian-torsion",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Acute Gynaecology",
    title: "Ovarian Torsion",
    draft: false,
    tog: {
      article: "Ovarian torsion: a modern approach to management",
      authors: "Bailey F, Moore G, De A, Holland T",
      citation: "TOG 2025;27:221–30",
      doi: "10.1111/tog.12985",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.12985",
      year: 2025,
    },
    flowchartId: "TOG_OVARIAN_TORSION",
    relatedGl: ["GTG62", "GTG5"],
    tags: [
      "ovarian torsion", "adnexal torsion", "torsion", "twisted ovary",
      "ovarian cyst pain", "acute pelvic pain", "sudden pelvic pain",
      "detorsion", "oophoropexy", "oophorectomy", "cystectomy",
      "whirlpool sign", "follicular ring sign", "blue-black ovary",
      "laparoscopy torsion", "acute gynaecology", "tog review", "gynae emergency",
    ],
    content: [
      { type: "alert", value: "Bottom line: suspect torsion with sudden, unilateral, severe pelvic pain, especially with an ovarian cyst, in pregnancy or after assisted reproduction. Only ~40% are diagnosed on ultrasound, so a normal scan does not exclude it: if clinical suspicion is high, proceed to laparoscopy. Treat with laparoscopic detorsion and ovarian conservation, even if the ovary looks blue-black." },

      { type: "subheading", value: "Presentation" },
      { type: "list", items: [
        "Sudden-onset, unilateral, severe lower abdominal or pelvic pain, which may fluctuate (intermittent torsion). More common on the right.",
        "Nausea and, particularly, vomiting are common (vomiting in ~41%).",
        "Signs may include tachycardia (~11%), an uncommon low-grade fever, a palpable adnexal mass and suprapubic tenderness.",
        "Accounts for 2–3% of acute gynaecological presentations.",
      ]},

      { type: "subheading", value: "Who is at higher risk" },
      { type: "list", items: [
        "Known ovarian cyst, especially larger than 50 mm.",
        "Pregnancy: 12–18% of torsions occur in pregnancy, most commonly in the first trimester (10–17 weeks).",
        "Assisted reproduction (around 11-fold risk).",
        "Post tubal-sterilisation, PCOS or multicystic ovaries.",
        "Previous torsion (recurrence risk is higher under age 20).",
      ]},

      { type: "subheading", value: "Imaging" },
      { type: "text", value: "Transvaginal ultrasound with and without Doppler is first-line. Suggestive signs include an asymmetrically enlarged ovary with peripheral follicle displacement, the whirlpool sign (twisted pedicle; sensitivity ~82%, specificity ~81%), the follicular ring sign, free fluid, and a displaced ovary. MRI can help when the presentation is non-specific or in pregnancy; CT has no role because of ovarian irradiation." },
      { type: "alert", value: "Governance point (verbatim): \"Transvaginal ultrasound can aid the diagnosis when findings are positive; however, if negative, it does not override the need for laparoscopy if clinical suspicion is high.\" The decision to operate is clinical, not radiological." },

      { type: "subheading", value: "Management" },
      { type: "list", items: [
        "Prompt laparoscopic detorsion is the mainstay in premenopausal women; laparoscopy is preferred over laparotomy, with comparable ovarian recovery and no excess thromboembolism.",
        "Conserve the ovary even when it appears blue-black: ovarian function is preserved after detorsion.",
        "Perform cystectomy if a causative cyst is present, to treat the underlying cause and reduce recurrence.",
        "Oophorectomy is described as harmful and unnecessary in this setting yet remains widely performed; avoid it in premenopausal women unless clearly indicated.",
        "Consider oophoropexy (low threshold) where there is a non-correctable cause or recurrent torsion, though no standardised technique exists.",
      ]},

      { type: "subheading", value: "Key points" },
      { type: "list", items: [
        "A normal ultrasound does not exclude torsion: if suspicion is high, operate.",
        "Time matters: delay risks infarction, and prompt surgery preserves the ovary.",
        "Default to ovarian conservation and fertility preservation in premenopausal women.",
      ]},

      { type: "text", value: "Base review: Bailey, Moore, De & Holland, TOG 2025;27:221–30 (DOI 10.1111/tog.12985). This is an original Pocket O&G summary, not a reproduction; read the full article for the complete discussion and references, and verify against local protocol. See also GTG62 (suspected ovarian masses) and GTG5 (OHSS)." },
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
    // Narrowed from the original "acquired heart disease & arrhythmias" scope —
    // valvular disease, ischaemic heart disease and arrhythmias now have their
    // own dedicated, more current cards (Timmons 2022 / Wuntakal 2013 /
    // Roberts 2019). Cardiomyopathy is the one topic this 2007 review still
    // covers that none of those newer reviews address.
    title: "Cardiomyopathy in Pregnancy",
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
      "cardiomyopathy pregnancy", "dilated cardiomyopathy pregnancy", "hypertrophic cardiomyopathy pregnancy",
      "peripartum cardiomyopathy", "heart failure pregnancy", "left ventricular dysfunction pregnancy",
      "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: peripartum cardiomyopathy is a rare (~1 in 2,289 live births) diagnosis of exclusion presenting from the last month of pregnancy to 5 months postpartum. Dilated cardiomyopathy is poorly tolerated in pregnancy; hypertrophic cardiomyopathy is usually well tolerated if the woman was asymptomatic beforehand." },

      { type: "subheading", value: "Dilated cardiomyopathy" },
      { type: "list", items: [
        "Poorly tolerated in pregnancy — 7% mortality with NYHA III/IV, and a risk of heart failure, irreversible LV dysfunction and fetal loss.",
        "Counsel accordingly; offer termination for an unplanned pregnancy in this context.",
      ]},

      { type: "subheading", value: "Hypertrophic cardiomyopathy" },
      { type: "list", items: [
        "Usually well tolerated if the woman was asymptomatic before pregnancy.",
        "Risk of symptomatic progression, atrial fibrillation, syncope and maternal death if there was pre-existing heart failure or severe symptoms.",
      ]},

      { type: "subheading", value: "Peripartum cardiomyopathy" },
      { type: "list", items: [
        "LV systolic dysfunction/heart failure presenting in the last month of pregnancy to 5 months postpartum. Rare (~1 in 2,289 live births) and a diagnosis of exclusion — rule out other causes of dilated cardiomyopathy with heart failure first.",
        "Treat with beta-blockers, diuretics, hydralazine and digoxin (switch to ACE inhibitors postpartum).",
        "~20% die or need transplantation; the rest recover partially or fully.",
        "A future pregnancy carries a higher relapse risk if LV function hasn't fully recovered — and some residual risk even after full recovery. There's no consensus on recommendations for future pregnancies.",
      ]},

      { type: "text", value: "Cardiomyopathy section of Part 2 of a two-part TOG review (Gelson, Johnson, Gatzoulis & Uebing, TOG 2007;9:83–87) — see also Part 1: Congenital Heart Disease, and the dedicated newer reviews on Valvular Heart Disease, Myocardial Infarction, and Cardiac Arrhythmias in Pregnancy. Read the full article for the complete discussion and references; verify all doses and thresholds against local protocol." },
    ],
  },

  {
    id: "tog-cardiac-mi",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Myocardial Infarction in Pregnancy",
    draft: false,
    tog: {
      article: "Myocardial infarction and pregnancy",
      authors: "Wuntakal R, Shetty N, Ioannou E, Sharma S, Kurian J",
      citation: "TOG 2013;15:247–255",
      doi: "10.1111/tog.12052",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.12052",
      year: 2013,
    },
    flowchartId: "TOG_MI_PREGNANCY",
    relatedGl: ["GL891", "MBRRACE_SLMC2025"],
    tags: [
      "myocardial infarction pregnancy", "mi pregnancy", "acute coronary syndrome pregnancy",
      "acs pregnancy", "chest pain pregnancy", "stemi pregnancy", "nstemi pregnancy",
      "coronary artery dissection pregnancy", "coronary artery spasm", "troponin pregnancy",
      "ischaemic heart disease pregnancy", "aspirin pregnancy", "clopidogrel pregnancy",
      "thrombolysis pregnancy", "percutaneous coronary intervention pregnancy", "pci pregnancy",
      "coronary angiography pregnancy", "ergometrine contraindication", "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: acute MI is rare but the relative risk is 3–4× higher in pregnancy, and cardiac disease is the leading cause of maternal death in the UK. Up to 50% occur in the peripartum period. Keep a low threshold — symptoms are easily attributed to normal pregnancy, and two consecutive UK confidential enquiry reports found a consistent failure to consider AMI in women with risk factors." },

      { type: "subheading", value: "Why pregnancy raises MI risk" },
      { type: "list", items: [
        "Pregnancy significantly increases myocardial oxygen demand (rising cardiac output, heart rate); physiological anaemia, hypercoagulability and falling diastolic BP can reduce oxygen supply where coronary flow is already compromised.",
        "The peripartum period is highest-risk: rising cardiac output from IVC decompression and uterine blood return after delivery, plus more frequent coronary dissection/thrombosis at this time.",
        "Pregnancy itself is not an established independent risk factor for atherosclerotic MI, but the combination of physiological change with pre-existing risk factors matters.",
      ]},

      { type: "subheading", value: "Risk factors" },
      { type: "list", items: [
        "From confidential enquiry data: higher parity (>3), maternal age >35, pre-existing hypertension/diabetes/ischaemic heart disease, smoking, obesity, strong family history. Risk of AMI is ~30× higher over 40 than under 20.",
        "Also reported: hyperlipidaemia, pre-eclampsia/eclampsia, thrombophilia, migraine, postpartum infection, blood transfusion.",
        "Maternal death risk is greatest if the infarct occurs in late pregnancy, or if delivery occurs within 2 weeks of the infarct.",
      ]},

      { type: "subheading", value: "Causes — not just atherosclerosis" },
      { type: "alert", value: "Consider non-atherosclerotic causes especially in women with no cardiovascular risk factors — angiography series show roughly half of pregnancy-associated MI is atherosclerotic, but coronary dissection and thrombosis together account for over a third of cases." },
      { type: "list", items: [
        "Coronary artery dissection: highest risk in the third trimester to 3 months postpartum; affects the LAD in ~80% of cases; associated mortality 30–40%.",
        "Coronary artery thrombosis: 8–14% of cases — pregnancy's hypercoagulable state, or underlying hereditary thrombophilia first manifesting now.",
        "Coronary artery spasm: spontaneous, or drug-induced (terbutaline, ergotamine, bromocriptine, cocaine).",
        "Other: vasculitis (e.g. Kawasaki disease), collagen vascular disease, amniotic fluid embolism, phaeochromocytoma.",
      ]},

      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: [
        "Chest pain plus pregnancy-typical features (epigastric pain, vomiting, dizziness) in a woman with risk factors should prompt investigation — don't dismiss as normal pregnancy.",
        "ECG: ST elevation is the most sensitive/specific marker, but 12-lead ECG sensitivity for ischaemia is as low as ~50% — use serial ECGs, changes can evolve over time.",
        "Troponin I/T is the biomarker of choice — never raised above the upper limit of normal in healthy pregnancy, labour or caesarean section (unlike CK/myoglobin, which do rise in labour). A negative troponin at presentation doesn't exclude damage — it can take 12 hours to peak. Troponin can be raised in pre-eclampsia/gestational hypertension/PE but never above the MI threshold in pre-eclampsia alone.",
        "Echocardiogram: safe in pregnancy, useful to exclude aortic dissection and assess LV function/wall motion, though limited for diagnosing MI itself.",
        "Coronary angiography: safe and useful for diagnosis and treatment. Reassure — diagnostic radiation doses in this context (angiography ~1.5mGy fetal, PCI ~3mGy fetal) are well below the 50mGy threshold associated with fetal harm. Use radial access, shield the abdomen, minimise fluoroscopy time.",
      ]},

      { type: "subheading", value: "Treatment" },
      { type: "list", items: [
        "STEMI: primary PCI is treatment of choice (bare metal stents preferred over drug-eluting — lack of pregnancy safety data). Thrombolysis (IV t-PA, doesn't cross the placenta) is a reasonable alternative if PCI access would be significantly delayed — but carries an ~8% maternal haemorrhage risk.",
        "NSTEMI: first-line antiplatelet therapy; angiography with a view to stenting if symptoms continue despite medical therapy or there's haemodynamic instability.",
        "Care in an HDU/ICU setting with fetal monitoring; delivery must be considered if the maternal condition deteriorates with a viable fetus.",
      ]},

      { type: "table",
        headers: ["Can use safely", "Limited use only", "Contraindicated"],
        rows: [
          ["Low-dose aspirin (60–150mg), heparin (LMWH/UFH), labetalol", "Clopidogrel (shortest duration possible)", "Statins, ACE inhibitors, ARBs"],
          ["Nifedipine (but avoid immediately after an acute event — increases mortality)", "", ""],
        ],
      },

      { type: "subheading", value: "Timing and mode of delivery" },
      { type: "list", items: [
        "No standardised guidelines — individualise via MDT (cardiologist, obstetric physician, obstetrician, anaesthetist, neonatologist).",
        "Where possible, delay delivery by 2–3 weeks after the MI — maternal mortality risk is highest in the immediate aftermath.",
        "Neither vaginal nor caesarean delivery is associated with higher mortality — choose on obstetric/maternal grounds. If vaginal: epidural analgesia, left lateral position, continuous cardiac + fetal monitoring, shorten the second stage with instrumental delivery.",
        "Third stage: slow IV oxytocin infusion (<2 U/min) to avoid hypotension. Ergometrine is contraindicated — risk of coronary artery spasm.",
        "Postpartum: HDU/ICU monitoring for at least 24–48 hours; thromboembolic risk assessment; arrange cardiology follow-up; future pregnancy/contraception advice depends on the underlying cause and residual cardiac function.",
      ]},

      { type: "text", value: "Summary of a TOG review (Wuntakal, Shetty, Ioannou, Sharma & Kurian, TOG 2013;15:247–255). Read the full article for the complete discussion and references; verify all doses and thresholds against local protocol." },
    ],
  },

  {
    id: "tog-cardiac-arrhythmias",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Cardiac Arrhythmias & Palpitations in Pregnancy",
    draft: false,
    tog: {
      article: "Management of palpitations and cardiac arrhythmias in pregnancy",
      authors: "Roberts A, Mechery J, Mechery A, Clarke B, Vause S",
      citation: "TOG 2019;21:263–270",
      doi: "10.1111/tog.12599",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.12599",
      year: 2019,
    },
    flowchartId: "TOG_ARRHYTHMIAS_PREGNANCY",
    relatedGl: ["MBRRACE_SLMC2025"],
    tags: [
      "palpitations pregnancy", "cardiac arrhythmia pregnancy", "svt pregnancy",
      "supraventricular tachycardia pregnancy", "atrial fibrillation pregnancy", "atrial flutter pregnancy",
      "ventricular tachycardia pregnancy", "long qt syndrome pregnancy", "lqts", "wolff-parkinson-white",
      "bradyarrhythmia pregnancy", "heart block pregnancy", "ectopic beats pregnancy",
      "holter monitor pregnancy", "adenosine pregnancy", "amiodarone pregnancy", "sotalol pregnancy",
      "flecainide pregnancy", "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: palpitations are common in pregnancy and usually benign — around 50% of women investigated have only ectopic beats or non-sustained arrhythmia. Women with pre-existing cardiac disease are at highest risk of a true arrhythmia. Most anti-arrhythmic drugs are safe in pregnancy (long-term amiodarone is the notable exception), so treat pathological arrhythmias promptly." },

      { type: "subheading", value: "Why pregnancy triggers palpitations" },
      { type: "list", items: [
        "Cardiac output rises ~50% (mainly via stroke volume); heart rate rises 10–20 bpm, mostly in the third trimester — this alone can feel like a 'pounding heartbeat'.",
        "50–60% of pregnant women have atrial/ventricular ectopic beats on continuous ECG — usually felt as a 'missed' or 'skipping' beat.",
        "Arrhythmogenesis is multifactorial: increased atrial/ventricular stretch from higher blood volume, and oestrogen-driven upregulation of alpha-adrenergic receptors.",
      ]},

      { type: "subheading", value: "History — separating physiology from pathology" },
      { type: "table",
        headers: ["Reassuring", "Needs further assessment"],
        rows: [
          ["Fast, regular heartbeat, especially lying down", "Fast AND irregular heartbeat"],
          ["Occasional 'thumping' (ectopic beats)", "Palpitations waking from sleep or occurring at work"],
          ["Pre-vasovagal symptoms before the episode", "Dizziness, shortness of breath, chest pain, syncope after onset"],
          ["", "Personal or family history of cardiac disease/sudden death"],
        ],
      },
      { type: "text", value: "Ask specifically: exact sensation, frequency/duration, onset/offset (sudden raises suspicion), triggers, associated syncope/pre-syncope, whether symptoms predate pregnancy, and drug/caffeine use." },

      { type: "subheading", value: "Investigation" },
      { type: "list", items: [
        "A clear physiological history with no red flags and a normal exam may not need further investigation.",
        "Otherwise: FBC (exclude anaemia), TFTs (exclude thyrotoxicosis), 12-lead ECG. An abnormal baseline ECG (delta wave in WPW, LVH pattern in HCM, QTc >460ms in LQTS) should prompt a cardiology opinion.",
        "Ambulatory ECG (Holter, typically 24–72h) is the most-used tool but has variable sensitivity since symptoms are often infrequent — diagnostic yield for a clinically significant arrhythmia is only 3–24%. Event recorders suit infrequent symptoms.",
        "Echocardiogram to exclude structural disease — needed for a diagnosed arrhythmia, audible murmur, concerning history, known structural disease, or family history of inherited arrhythmia; not usually needed for clearly physiological symptoms.",
      ]},

      { type: "subheading", value: "Managing specific arrhythmias" },
      { type: "list", items: [
        "Sinus tachycardia and ectopic beats: usually benign, no treatment required — but consider inappropriate sinus tachycardia or POTS as alternative diagnoses.",
        "SVT (the most common non-benign arrhythmia, ~24 per 100,000): vagal manoeuvres first-line; IV adenosine if that fails (terminates ~90%, safe under monitoring); verapamil, metoprolol or DC cardioversion as alternatives if compromised. Beta-blockers for prophylaxis. Catheter ablation isn't usually recommended in pregnancy.",
        "Atrial fibrillation/flutter (uncommon, usually reflects underlying pathology — e.g. mitral stenosis, electrolyte/metabolic disturbance): investigate the cause. Anticoagulate persistent AF (usually LMWH, MDT with cardiology/haematology). DC cardioversion first-line if compromised; IV flecainide or ibutilide preferred pharmacologically in a structurally normal heart; beta-blockers first-line for rate control.",
        "Ventricular tachycardia: exclude structural heart disease/channelopathy first. Idiopathic RVOT VT responds to beta-blockade or verapamil. Haemodynamically unstable → electrical cardioversion (safe, no evidence of fetal harm). Stable → pharmacological cardioversion (sotalol/flecainide) guided by the underlying cause. Prophylaxis: beta-blockers, amiodarone, or an ICD.",
        "Bradyarrhythmias: rare, usually well tolerated. First-degree block and Wenkebach are usually benign. Complete heart block: pace if symptomatic (temporary for delivery, or permanent — safe in pregnancy).",
      ]},

      { type: "subheading", value: "Long QT syndrome — special considerations" },
      { type: "alert", value: "Cardiac events are less common during pregnancy in LQTS but rise significantly postpartum, particularly in type 2 LQTS — compounded by sleep deprivation and missed medication doses with a newborn." },
      { type: "list", items: [
        "Continue beta-blockers throughout AND after pregnancy — don't stop postpartum.",
        "Avoid QT-prolonging drugs and electrolyte disturbance. Hyperemesis is high-risk (vomiting → non-adherence + electrolyte disturbance). Commonly-prescribed drugs to avoid include prochlorperazine, ondansetron, trimethoprim and erythromycin.",
        "LQTS is linked to sudden infant death (a gene variant found in ~10% of SIDS cases) — arrange neonatal review before discharge and a genetics referral for the baby.",
      ]},

      { type: "subheading", value: "General principles for pre-existing arrhythmias" },
      { type: "list", items: [
        "Preconception: condition-specific risk counselling, medication review, optimise control, consider accessory-pathway ablation before pregnancy.",
        "Antenatal: medication review, growth scans if on beta-blockers, anaesthetic review, birth planning.",
        "Intrapartum: vaginal birth usually recommended; consider continuous cardiac monitoring if high-risk; ensure the care plan specifies drugs/facilities needed and drugs to avoid.",
        "Postnatal: period of inpatient monitoring; some conditions (e.g. LQTS) carry high postnatal risk; plan medication and breastfeeding; arrange ongoing cardiology follow-up.",
      ]},

      { type: "text", value: "Summary of a TOG review (Roberts, Mechery, Mechery, Clarke & Vause, TOG 2019;21:263–270). Read the full article for the complete discussion, drug-safety table and references; verify all doses and thresholds against local protocol." },
    ],
  },

  {
    id: "tog-cardiac-valvular",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Maternal Medicine",
    title: "Valvular Heart Disease in Pregnancy",
    draft: false,
    tog: {
      article: "Valvular heart disease in pregnancy",
      authors: "Timmons P, Partridge G, McKelvey A, Lyall H, Morosan M, Freeman L",
      citation: "TOG 2023;25:19–27",
      doi: "10.1111/tog.12857",
      url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/tog.12857",
      year: 2022,
    },
    flowchartId: "TOG_VALVULAR_PREGNANCY",
    relatedGl: ["GL891", "MBRRACE_SLMC2025"],
    tags: [
      "valvular heart disease pregnancy", "mitral stenosis pregnancy", "aortic stenosis pregnancy",
      "mitral regurgitation pregnancy", "aortic regurgitation pregnancy", "mechanical heart valve pregnancy",
      "bioprosthetic valve pregnancy", "prosthetic valve anticoagulation", "warfarin pregnancy heart valve",
      "warfarin embryopathy", "lmwh mechanical valve", "mwho classification", "who classification cardiac",
      "nyha class", "balloon valvuloplasty pregnancy", "rheumatic heart disease pregnancy",
      "endocarditis prophylaxis pregnancy", "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: regurgitant lesions are generally better tolerated than stenotic lesions in pregnancy, and right-sided lesions better than left-sided. Pre-conception counselling with mWHO risk classification is essential for all women with valvular disease. Anticoagulation for mechanical valves is a genuine trade-off between maternal and fetal risk, not a solved problem." },

      { type: "subheading", value: "Pre-conception assessment" },
      { type: "list", items: [
        "See a cardiologist with expertise in pregnancy, a maternal-medicine obstetrician and an obstetric physician. Baseline ECG, echocardiogram and (where appropriate) exercise tolerance test.",
        "Assess using the modified WHO (mWHO) classification — Class I (no detectable increased risk) through Class IV (pregnancy contraindicated, e.g. severe mitral/aortic stenosis, pulmonary arterial hypertension, LVEF <30%). Also grade functional status by NYHA class (I–IV).",
        "All women with cardiac disease should be told they're at increased risk of obstetric complications (preterm birth, hypertensive disease, PPH) — fetal complications occur in up to 30% of cases and correlate with maternal disease severity.",
        "Serial growth scans (~4-weekly from 28 weeks) for all stenotic valvular disease and symptomatic regurgitant disease — FGR risk up to 30%.",
      ]},

      { type: "subheading", value: "Mitral stenosis" },
      { type: "table",
        headers: ["Severity", "Valve area", "Heart failure risk in pregnancy"],
        rows: [
          ["Mild", ">1.5 cm²", "Usually well tolerated"],
          ["Moderate", "1.0–1.5 cm²", "~1 in 3"],
          ["Severe", "<1.0 cm²", "~1 in 2"],
        ],
      },
      { type: "list", items: [
        "Even asymptomatic severe mitral stenosis warrants counselling against pregnancy, effective contraception (typically LARC), and optimisation with prepregnancy balloon valvotomy or valve replacement.",
        "Predictors of complications: NYHA ≥II, systolic pulmonary artery pressure >30mmHg, severe stenosis, advanced maternal age. Mortality is low (0–3%) in developed nations if managed well.",
        "Fetal risk: prematurity 20–30%, FGR up to 30%.",
        "Antenatal: review frequency by severity (each trimester if mild/asymptomatic; at least monthly if severe/symptomatic). Anticoagulate (LMWH) if moderate-severe stenosis (AF risk), left atrial enlargement ≥60mL/m², prior embolism/LA thrombus, or CCF.",
        "Surgery in pregnancy reserved for NYHA III/IV or PA pressure ≥50mmHg despite medical therapy — percutaneous balloon mitral valvuloplasty is the intervention of choice.",
      ]},

      { type: "subheading", value: "Aortic stenosis" },
      { type: "list", items: [
        "Defined as an antegrade valve velocity ≥2.0 m/s. Asymptomatic pre-pregnancy → heart failure risk <10% (vs 25% if symptomatic).",
        "A physiological increase in the echo gradient during pregnancy is normal — its absence (or a fall) should raise concern for a failing left ventricle, not reassure.",
        "Even severe AS with normal pre-pregnancy exercise tolerance and preserved LV function can be expected to tolerate pregnancy reasonably; a Bruce protocol exercise test and NT-proBNP pre-conception both help risk-stratify.",
        "Symptomatic/severe disease, reduced exercise tolerance or impaired LV function → counsel against pregnancy, offer contraception and surgical treatment.",
        "Antenatal review monthly-to-bimonthly if severe. Medical: reduce activity, beta-blockers/diuretics for incipient failure. Surgical: percutaneous valvuloplasty for severe symptoms despite maximal medical therapy; if not feasible with life-threatening symptoms, consider termination or early delivery followed by valve surgery.",
        "Preterm birth and FGR occur in 20–25% with moderate/severe AS; offer fetal echocardiography (~10% risk of congenital cardiac defects with LVOT pathology).",
      ]},

      { type: "subheading", value: "Regurgitant lesions (mitral/aortic)" },
      { type: "list", items: [
        "Mild disease usually well tolerated (peripheral vasodilatation reduces afterload). Moderate-severe, symptomatic, or impaired LV function → higher heart failure risk (20–25%); FGR in 5–10%.",
        "Medical: diuretics for fluid overload. Surgical: repair ideally pre-pregnancy; acute severe regurgitation refractory to medical therapy may need surgery in pregnancy, though delivery should ideally precede this.",
      ]},

      { type: "subheading", value: "Valve replacement — bioprosthetic vs mechanical" },
      { type: "list", items: [
        "Bioprosthetic: no anticoagulation needed in pregnancy if haemodynamically stable and low complication risk absent dysfunction — but up to a third fail within 10–15 years, so repeat surgery is often needed eventually.",
        "Mechanical: durable but needs lifelong anticoagulation. ROPAC registry data: 58% 'event-free' pregnancy with a mechanical valve vs 79% with a bioprosthesis.",
      ]},

      { type: "subheading", value: "Anticoagulation for mechanical valves" },
      { type: "alert", value: "Vitamin K antagonists (warfarin) are the most effective at preventing valve thrombosis but are teratogenic; LMWH doesn't cross the placenta but carries a higher maternal thromboembolic risk (~10%). There is no anticoagulation strategy that eliminates risk to both mother and fetus." },
      { type: "list", items: [
        "Warfarin embryopathy (nasal hypoplasia, short long bones/digits, stippled epiphyses) is most associated with exposure at 6–12 weeks; overall fetal anomaly rate ~5–6% with first-trimester warfarin exposure, correlating with total dose. Risk rises markedly above a warfarin dose of 5mg/day.",
        "Direct oral anticoagulants (e.g. rivaroxaban) are contraindicated with mechanical valves, pregnant or not.",
      ]},
      { type: "table",
        headers: ["Strategy", "Approach"],
        rows: [
          ["VKA throughout", "Warfarin continued; switch to twice-daily LMWH ~2 weeks before delivery"],
          ["LMWH 1st trimester, VKA 2nd/3rd", "Switch to LMWH before 6 weeks; restart warfarin after 12 weeks; switch back to LMWH before delivery"],
          ["LMWH throughout", "Switch to LMWH after a positive pregnancy test; continued until delivery"],
        ],
      },
      { type: "text", value: "LMWH for a prosthetic valve needs twice-daily dosing with regular peak/trough anti-Xa levels (peak target 0.8–1.2 IU/mL) — doses required are >50% higher than standard weight-based VTE treatment doses. Factor in maternal preference, valve thrombogenicity, compliance, and monitoring availability — this is a genuinely shared decision." },

      { type: "subheading", value: "Anaesthetic considerations" },
      { type: "list", items: [
        "Stenotic lesions: fixed cardiac output tolerates regional-anaesthesia hypotension poorly — consider invasive BP monitoring and a carefully titrated low-dose combined spinal-epidural. Maintain a slower heart rate (preserves diastolic coronary filling) and preload.",
        "Regurgitant lesions: usually tolerate regional anaesthesia well (falling SVR reduces regurgitant flow).",
        "Anticoagulation and neuraxial anaesthesia: allow 24 hours between the last LMWH dose and neuraxial block; INR should be <1.5 before neuraxial anaesthesia in women on warfarin.",
      ]},

      { type: "subheading", value: "Intrapartum & postpartum" },
      { type: "list", items: [
        "Mode of delivery is individualised; mild/moderate dysfunction not on anticoagulation can usually have a normal vaginal delivery. Instrumental delivery to shorten the second stage if severe hypertension or a poorly-tolerated Valsalva is anticipated.",
        "Plan delivery timing to ensure safe peripartum anticoagulation — avoid a prolonged induction in a high thrombosis-risk woman; caesarean can allow more predictable anticoagulation control. Emergency delivery within 2 weeks of warfarin → caesarean preferred (neonatal intracranial bleeding risk).",
        "Endocarditis prophylaxis is no longer routinely recommended beyond standard caesarean antibiotics, except with a personal history of infective endocarditis.",
        "Third stage: anticipate large fluid shifts — diuretics may be needed in severe mitral stenosis to prevent autotransfusion-induced pulmonary oedema; avoid volume depletion in aortic stenosis. Avoid ergometrine in arrhythmia or aortic-dissection risk; avoid carboprost in asthma or raised PA pressure.",
        "Resume anticoagulation as soon as safely possible postpartum to minimise thromboembolic risk; balance this carefully against PPH risk with early haematology involvement.",
        "Lactation is safe, including on warfarin (present in milk only as an inactive metabolite).",
      ]},

      { type: "text", value: "Summary of a TOG review (Timmons, Partridge, McKelvey, Lyall, Morosan & Freeman, TOG 2023;25:19–27, accepted 2022). Read the full article for the complete discussion, mWHO/NYHA tables and references; verify all doses and thresholds against local protocol." },
    ],
  },
];
