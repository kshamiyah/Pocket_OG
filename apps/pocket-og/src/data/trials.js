// Landmark Trials: the pivotal studies behind O&G practice, as original
// summaries (never reproductions). Same card family as the TOG review cards, so
// they render, cross-link and search through the existing machinery, but with a
// trial-provenance block and a fixed internal structure so every card reads the
// same: clinical question, design & population, key result, what it changed,
// caveats. `draft: true` shows the "verify" banner until it has a clinical read.
//
// Card schema:
//   id, source: "TRIAL", gl: "TRIAL"     drives the Trial colour + filter
//   condition, setting, title, tags      same as any searchable card
//   trial: { acronym, name, group, citation, doi, url, year, n, design }
//   relatedGl: []                        the guideline(s) this evidence underpins
//   flowchartId (optional)               cross-link to an interactive pathway
//   content: []                          text | alert | subheading | list | table

export const TRIAL_SECTIONS = [
  {
    id: "trial-arrive",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Induction of labour",
    title: "ARRIVE: elective induction at 39 weeks in low-risk nulliparas",
    draft: false,
    trial: {
      acronym: "ARRIVE",
      name: "A Randomized Trial of Induction Versus Expectant Management",
      group: "Grobman WA et al., NICHD MFMU Network",
      citation: "N Engl J Med 2018;379:513–23",
      doi: "10.1056/NEJMoa1800566",
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1800566",
      year: 2018,
      n: "6,106 women",
      design: "Multicentre RCT",
    },
    flowchartId: "GL861_TIMING",
    relatedGl: ["GL861"],
    tags: [
      "arrive", "elective induction", "induction at 39 weeks", "iol 39 weeks", "iol timing",
      "low risk nulliparous", "nulliparous induction", "expectant management", "grobman",
      "caesarean rate induction", "induction versus expectant", "when to induce", "landmark trial",
      "obstetric trial", "rct induction",
    ],
    content: [
      { type: "alert", value: "Bottom line: in low-risk nulliparous women, elective induction at 39 weeks did not increase adverse perinatal outcomes and modestly reduced caesarean birth and pre-eclampsia, compared with expectant management." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In low-risk nulliparous women, does elective induction of labour at 39+0 weeks improve perinatal outcomes compared with expectant management?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multicentre randomised controlled trial across 41 US centres (NICHD MFMU Network).",
        "6,106 low-risk nulliparous women with a singleton, randomised at 38+0 to 38+6 weeks.",
        "Elective induction at 39+0 to 39+4 weeks versus expectant management to at least 40+5 (or until a medical indication arose).",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Primary composite (perinatal death or severe neonatal morbidity): 4.3% induction vs 5.4% expectant, no significant difference (RR 0.80, 95% CI 0.64–1.00).",
        "Caesarean birth: lower with induction, 18.6% vs 22.2% (RR 0.84).",
        "Gestational hypertension or pre-eclampsia: lower with induction, 9.1% vs 14.1%.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Reframed elective induction at 39 weeks as a reasonable option for low-risk nulliparous women rather than a driver of caesarean birth. It shaped US (ACOG) practice; UK guidance stayed more cautious about applying it universally, given differences in baseline practice and capacity." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "Low-risk nulliparous women only; the result does not extend to multiparas or higher-risk pregnancies.",
        "Conducted in US MFMU centres, where the expectant-arm caesarean rate was high and baseline practice differs from many UK units.",
        "Not powered for perinatal mortality alone; the composite outcome was driven by morbidity.",
        "Service capacity and resource implications of routine 39-week induction were not the trial's focus.",
      ] },
    ],
  },

  {
    id: "trial-magpie",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Pre-eclampsia & eclampsia",
    title: "Magpie: magnesium sulfate to prevent eclampsia",
    draft: false,
    trial: {
      acronym: "Magpie",
      name: "Magnesium sulphate for women with pre-eclampsia",
      group: "Magpie Trial Collaborative Group (Duley L et al.)",
      citation: "Lancet 2002;359:1877–90",
      doi: "10.1016/S0140-6736(02)08778-0",
      url: "https://doi.org/10.1016/S0140-6736(02)08778-0",
      year: 2002,
      n: "10,141 women",
      design: "Multinational placebo-controlled RCT",
    },
    flowchartId: "GL952_SEVERE_LW",
    relatedGl: ["GL952", "NG133"],
    tags: [
      "magpie", "magnesium sulphate", "magnesium sulfate", "mgso4", "eclampsia prevention",
      "seizure prophylaxis", "pre-eclampsia", "severe pre-eclampsia", "duley", "anticonvulsant",
      "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: magnesium sulfate more than halved the risk of eclampsia in women with pre-eclampsia, with the clearest benefit in severe disease. It is the anticonvulsant of choice." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women with pre-eclampsia, does magnesium sulfate reduce eclampsia and improve outcomes for mother and baby, compared with placebo?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multinational placebo-controlled randomised trial across 33 countries.",
        "10,141 women with pre-eclampsia, randomised before or shortly after delivery.",
        "Magnesium sulfate (loading dose then maintenance) versus placebo.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Eclampsia: 0.8% magnesium vs 1.9% placebo, a 58% relative reduction (RR 0.42, 95% CI 0.29–0.60).",
        "Maternal death lower with magnesium but not statistically significant (RR 0.55, 95% CI 0.26–1.14).",
        "No substantive harm to babies; the benefit was greatest in severe pre-eclampsia (lower number needed to treat).",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Established magnesium sulfate as the drug of choice for seizure prophylaxis in severe pre-eclampsia and for treating eclampsia, displacing older anticonvulsants. It underpins current NICE and RCOG guidance." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "Absolute benefit is modest in mild disease; the number needed to treat is high in non-severe pre-eclampsia and low in severe disease.",
        "Requires monitoring for toxicity (reflexes, respiratory rate, urine output); calcium gluconate is the antidote.",
        "The trial did not resolve the optimal regimen or duration.",
      ] },
    ],
  },

  {
    id: "trial-term-breech",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Breech at term",
    title: "Term Breech Trial: planned caesarean vs vaginal breech birth",
    draft: false,
    trial: {
      acronym: "Term Breech Trial",
      name: "Planned caesarean section versus planned vaginal birth for breech presentation at term",
      group: "Hannah ME et al., Term Breech Trial Collaborative Group",
      citation: "Lancet 2000;356:1375–83",
      doi: "10.1016/S0140-6736(00)02840-3",
      url: "https://doi.org/10.1016/S0140-6736(00)02840-3",
      year: 2000,
      n: "2,088 women",
      design: "Multicentre RCT",
    },
    relatedGl: [],
    tags: [
      "term breech trial", "breech", "breech presentation", "planned caesarean breech",
      "vaginal breech", "mode of delivery breech", "hannah", "elective caesarean breech",
      "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: planned caesarean reduced serious neonatal harm for term breech in this trial, and practice shifted worldwide. Later follow-up and observational data softened that conclusion, so selected vaginal breech birth remains reasonable." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "For a singleton breech at term, does planned caesarean section improve outcomes compared with planned vaginal birth?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multicentre randomised controlled trial across 121 centres in 26 countries.",
        "2,088 women with a singleton frank or complete breech at term.",
        "Planned caesarean versus planned vaginal breech birth.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Perinatal or neonatal death or serious neonatal morbidity: 1.6% planned caesarean vs 5.0% planned vaginal (RR 0.33, 95% CI 0.19–0.56).",
        "No significant difference in maternal death or serious maternal morbidity at 6 weeks.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Drove a rapid worldwide move to planned caesarean for term breech, and vaginal breech skills declined. It remains one of the most debated obstetric trials." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The 2-year follow-up found no difference in death or neurodevelopmental delay between the groups.",
        "Criticised for variable inclusion and intrapartum care, and some deaths were unrelated to mode of birth.",
        "Later observational data (e.g. PREMODA) suggest vaginal breech birth is reasonable with strict selection and a skilled attendant.",
      ] },
    ],
  },

  {
    id: "trial-antenatal-steroids",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Preterm birth",
    title: "Antenatal corticosteroids for fetal lung maturation",
    draft: false,
    trial: {
      acronym: "Liggins & Howie",
      name: "Antepartum glucocorticoids to prevent respiratory distress syndrome; confirmed by later meta-analysis",
      group: "Liggins GC, Howie RN (1972); Cochrane review, Roberts D et al.",
      citation: "Pediatrics 1972;50:515–25; Cochrane 2017 CD004454",
      doi: "10.1002/14651858.CD004454.pub3",
      url: "https://doi.org/10.1002/14651858.CD004454.pub3",
      year: 1972,
      n: "Original RCT + 30 trials, 7,774 women",
      design: "RCT, confirmed by meta-analysis",
    },
    relatedGl: ["NG25"],
    tags: [
      "antenatal steroids", "antenatal corticosteroids", "betamethasone", "dexamethasone",
      "fetal lung maturation", "respiratory distress syndrome", "rds", "preterm birth steroids",
      "liggins", "howie", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: a course of antenatal corticosteroids before anticipated preterm birth reduces neonatal death and respiratory distress. It is one of the highest-impact interventions in obstetrics." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women at risk of preterm birth, does a course of antenatal corticosteroids improve neonatal outcomes?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "First shown in the 1972 Liggins and Howie randomised trial in women at risk of preterm birth.",
        "Confirmed across many trials, pooled in the Cochrane review (30 trials, 7,774 women).",
        "A single course of betamethasone or dexamethasone versus placebo or no treatment.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Neonatal death: reduced (RR about 0.69).",
        "Respiratory distress syndrome: reduced (RR about 0.66).",
        "Also fewer intraventricular haemorrhages and cases of necrotising enterocolitis.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Made a single course of antenatal corticosteroids standard care when preterm birth is anticipated, typically from 24 to 34+6 weeks, with the greatest benefit if birth follows within 7 days." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "Benefit is greatest when birth occurs within 7 days; repeated courses carry uncertainty and possible growth effects.",
        "Late preterm use (34 to 36+6) reduces respiratory morbidity but increases neonatal hypoglycaemia.",
        "Not a substitute for other measures; timing relative to birth matters.",
      ] },
    ],
  },

  {
    id: "trial-mgso4-neuroprotection",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Preterm neuroprotection",
    title: "Magnesium sulfate for fetal neuroprotection before preterm birth",
    draft: false,
    trial: {
      acronym: "Mg neuroprotection",
      name: "Magnesium sulphate before preterm birth for neuroprotection of the fetus",
      group: "Doyle LW et al. (Cochrane); trials include BEAM, ACTOMgSO4, PREMAG",
      citation: "Cochrane 2009 CD004661",
      doi: "10.1002/14651858.CD004661.pub3",
      url: "https://doi.org/10.1002/14651858.CD004661.pub3",
      year: 2009,
      n: "5 RCTs, 6,145 babies",
      design: "Meta-analysis of RCTs",
    },
    relatedGl: ["NG25"],
    tags: [
      "magnesium neuroprotection", "magnesium sulphate neuroprotection", "mgso4 neuroprotection",
      "cerebral palsy prevention", "fetal neuroprotection", "preterm neuroprotection", "beam",
      "actomgso4", "premag", "doyle", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: magnesium sulfate given to women in or facing very preterm birth reduces cerebral palsy in the child, without increasing perinatal death." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "Given before anticipated preterm birth, does magnesium sulfate protect the fetal brain and reduce cerebral palsy?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Meta-analysis of 5 randomised trials (including BEAM, ACTOMgSO4 and PREMAG), 6,145 babies.",
        "Women in established preterm labour or with planned very preterm birth.",
        "Magnesium sulfate versus placebo, given close to anticipated birth.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Cerebral palsy: reduced (RR 0.68, 95% CI 0.54–0.87).",
        "Substantial gross motor dysfunction: reduced.",
        "No increase in perinatal death.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Made magnesium sulfate for neuroprotection standard care before very preterm birth (commonly before about 30 weeks, considered up to 33+6), separate from its use in pre-eclampsia." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "Absolute benefit is greatest at the earliest gestations.",
        "It should be given close to birth; the optimal timing and repeat dosing are not fully settled.",
        "Monitor for magnesium toxicity as with any magnesium regimen.",
      ] },
    ],
  },

  {
    id: "trial-aspre",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Pre-eclampsia prevention",
    title: "ASPRE: aspirin to prevent preterm pre-eclampsia",
    draft: false,
    trial: {
      acronym: "ASPRE",
      name: "Aspirin versus placebo in pregnancies at high risk for preterm pre-eclampsia",
      group: "Rolnik DL et al.",
      citation: "N Engl J Med 2017;377:613–22",
      doi: "10.1056/NEJMoa1704559",
      url: "https://doi.org/10.1056/NEJMoa1704559",
      year: 2017,
      n: "1,776 women",
      design: "Multicentre double-blind RCT",
    },
    relatedGl: ["NG133", "GL952"],
    tags: [
      "aspre", "aspirin pre-eclampsia", "aspirin prophylaxis", "preterm pre-eclampsia",
      "first trimester screening", "150 mg aspirin", "pre-eclampsia prevention", "rolnik",
      "fmf screening", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: in women screened as high risk in the first trimester, aspirin 150 mg at night markedly reduced preterm pre-eclampsia, though not term pre-eclampsia." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women identified in the first trimester as high risk for preterm pre-eclampsia, does aspirin reduce it compared with placebo?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multicentre double-blind placebo-controlled randomised trial.",
        "1,776 women with a singleton at high risk of preterm pre-eclampsia by first-trimester combined screening.",
        "Aspirin 150 mg each night from 11 to 14 weeks until 36 weeks, versus placebo.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Preterm pre-eclampsia (delivery before 37 weeks): 1.6% aspirin vs 4.3% placebo (OR 0.38, 95% CI 0.20–0.74), a 62% reduction.",
        "No significant effect on term pre-eclampsia.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Strengthened the case for aspirin prophylaxis in high-risk women and for targeting it by first-trimester screening, and supported the 150 mg dose. UK practice identifies high risk by clinical risk factors rather than the full screening algorithm." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The benefit was specific to preterm pre-eclampsia, not term disease.",
        "The first-trimester screening algorithm is not universally adopted; NICE uses a clinical risk-factor checklist.",
        "Adherence to nightly aspirin influenced the effect.",
      ] },
    ],
  },

  {
    id: "trial-woman",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Postpartum haemorrhage",
    title: "WOMAN: tranexamic acid for postpartum haemorrhage",
    draft: false,
    trial: {
      acronym: "WOMAN",
      name: "Early tranexamic acid for postpartum haemorrhage",
      group: "WOMAN Trial Collaborators (Shakur H et al.)",
      citation: "Lancet 2017;389:2105–16",
      doi: "10.1016/S0140-6736(17)30638-4",
      url: "https://doi.org/10.1016/S0140-6736(17)30638-4",
      year: 2017,
      n: "20,060 women",
      design: "International double-blind placebo-controlled RCT",
    },
    flowchartId: "GTG52_PPH",
    relatedGl: ["GTG52"],
    tags: [
      "woman trial", "tranexamic acid", "txa", "postpartum haemorrhage", "pph", "obstetric bleeding",
      "shakur", "death from bleeding", "antifibrinolytic", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: giving tranexamic acid early reduced death due to bleeding in postpartum haemorrhage, with the benefit only when given within 3 hours." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women with postpartum haemorrhage, does tranexamic acid reduce death and hysterectomy compared with placebo?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "International double-blind placebo-controlled RCT across 21 countries.",
        "20,060 women with clinically diagnosed postpartum haemorrhage after vaginal or caesarean birth.",
        "Tranexamic acid 1 g IV (repeated if bleeding continued) versus placebo, alongside standard care.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Death due to bleeding: 1.5% tranexamic acid vs 1.9% placebo (RR 0.81, 95% CI 0.65–1.00).",
        "Greater benefit when given within 3 hours of birth (RR about 0.69); little benefit after 3 hours.",
        "No reduction in hysterectomy, and no increase in thromboembolic events.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "WHO now recommends tranexamic acid within 3 hours for postpartum haemorrhage, and it is embedded in RCOG and local PPH protocols as an early step." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The benefit depends on giving it early; after 3 hours there was little effect.",
        "Hysterectomy was often decided at randomisation, so the trial could not show an effect on it.",
        "Absolute benefit was largest in settings with high PPH mortality.",
      ] },
    ],
  },

  {
    id: "trial-oracle",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Preterm birth & PPROM",
    title: "ORACLE I & II: antibiotics in PPROM and in preterm labour",
    draft: false,
    trial: {
      acronym: "ORACLE I & II",
      name: "Broad-spectrum antibiotics for preterm prelabour rupture of membranes (I) and for spontaneous preterm labour (II)",
      group: "Kenyon SL et al.",
      citation: "Lancet 2001;357:979–88 & 989–94",
      doi: "10.1016/S0140-6736(00)04233-1",
      url: "https://doi.org/10.1016/S0140-6736(00)04233-1",
      year: 2001,
      n: "ORACLE I 4,826; ORACLE II 6,295",
      design: "Two factorial RCTs, with 7-year follow-up",
    },
    flowchartId: "GL895_ROM_TRIAGE",
    relatedGl: ["GL895", "NG25"],
    tags: [
      "oracle", "oracle i", "oracle ii", "erythromycin pprom", "co-amoxiclav", "coamoxiclav",
      "pprom antibiotics", "preterm labour antibiotics", "necrotising enterocolitis", "nec",
      "kenyon", "prelabour rupture of membranes", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: for PPROM, erythromycin helps and co-amoxiclav harms (necrotising enterocolitis). For preterm labour with intact membranes, antibiotics do not help and may harm, so are not given." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "Do broad-spectrum antibiotics improve neonatal outcomes in preterm prelabour rupture of membranes (ORACLE I), and in spontaneous preterm labour with intact membranes (ORACLE II)?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Two large factorial randomised trials (erythromycin, co-amoxiclav, both, or placebo).",
        "ORACLE I: 4,826 women with PPROM. ORACLE II: 6,295 women in preterm labour with intact membranes.",
        "Long-term outcomes assessed in the ORACLE Children Study at 7 years.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "PPROM (ORACLE I): erythromycin prolonged pregnancy and reduced neonatal morbidity; co-amoxiclav increased necrotising enterocolitis.",
        "Preterm labour, intact membranes (ORACLE II): neither antibiotic improved outcomes.",
        "At 7 years, antibiotics in the intact-membranes group were linked to a small excess of functional impairment and cerebral palsy.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Made erythromycin the antibiotic for PPROM, made co-amoxiclav one to avoid, and established that antibiotics are not given for preterm labour with intact membranes in the absence of infection. This is reflected in NICE NG25." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The harm signal for antibiotics in preterm labour came mainly from the long-term follow-up.",
        "The findings assume no clinical infection; suspected chorioamnionitis is treated on its own merits.",
      ] },
    ],
  },

  {
    id: "trial-eclipse",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Gynaecology · Heavy menstrual bleeding",
    title: "ECLIPSE: LNG-IUS vs medical therapy for heavy menstrual bleeding",
    draft: false,
    trial: {
      acronym: "ECLIPSE",
      name: "Levonorgestrel intrauterine system versus usual medical treatment for menorrhagia",
      group: "Gupta J et al., ECLIPSE Trial Collaborative Group",
      citation: "N Engl J Med 2013;368:128–37",
      doi: "10.1056/NEJMoa1204724",
      url: "https://doi.org/10.1056/NEJMoa1204724",
      year: 2013,
      n: "571 women",
      design: "Pragmatic multicentre RCT (UK primary care)",
    },
    flowchartId: "NG88_TREATMENT",
    relatedGl: ["NG88"],
    tags: [
      "eclipse", "lng-ius", "mirena", "levonorgestrel intrauterine system", "heavy menstrual bleeding",
      "menorrhagia", "hmb medical treatment", "gupta", "first line hmb", "landmark trial", "gynaecology trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: the LNG-IUS improved quality of life more than usual medical treatment for heavy menstrual bleeding, and made it the first-line option." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women with heavy menstrual bleeding in primary care, does the LNG-IUS improve quality of life more than usual medical treatment?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Pragmatic multicentre randomised trial in UK primary care.",
        "571 women presenting with heavy menstrual bleeding.",
        "LNG-IUS versus usual medical treatment (tranexamic or mefenamic acid, combined pill, or oral progestogen).",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "The LNG-IUS gave a greater improvement in the Menorrhagia Multi-Attribute Scale (quality of life) at 2 years.",
        "More women continued the LNG-IUS than usual medical treatment.",
        "Both groups improved, but the LNG-IUS improved more.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "Established the LNG-IUS as the first-line pharmacological treatment for heavy menstrual bleeding without structural or histological cause, as in NICE NG88." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The outcome was patient-reported quality of life, not a measured blood-loss reduction.",
        "The trial was open-label, and it addresses HMB without structural pathology.",
      ] },
    ],
  },

  {
    id: "trial-prism",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Gynaecology · Early pregnancy bleeding",
    title: "PRISM: progesterone for bleeding in early pregnancy",
    draft: false,
    trial: {
      acronym: "PRISM",
      name: "Progesterone in women with bleeding in early pregnancy",
      group: "Coomarasamy A et al.",
      citation: "N Engl J Med 2019;380:1815–24",
      doi: "10.1056/NEJMoa1813730",
      url: "https://doi.org/10.1056/NEJMoa1813730",
      year: 2019,
      n: "4,153 women",
      design: "Multicentre double-blind placebo-controlled RCT",
    },
    flowchartId: "CG565_TRIAGE",
    relatedGl: ["CG565", "CG621"],
    tags: [
      "prism", "progesterone", "threatened miscarriage", "early pregnancy bleeding", "vaginal progesterone",
      "micronised progesterone", "coomarasamy", "previous miscarriage", "miscarriage prevention",
      "landmark trial", "gynaecology trial", "early pregnancy trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: vaginal progesterone did not raise live births overall for early pregnancy bleeding, but helped women who had also had previous miscarriages, and the benefit grew with the number of prior losses." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In women with bleeding in early pregnancy (threatened miscarriage), does vaginal progesterone increase the chance of a live birth?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multicentre double-blind placebo-controlled randomised trial (UK).",
        "4,153 women with bleeding in early pregnancy and a viable intrauterine pregnancy.",
        "Vaginal micronised progesterone 400 mg twice daily versus placebo, until 16 weeks.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Live birth after at least 34 weeks overall: 75% progesterone vs 72% placebo, not statistically significant.",
        "In women with previous miscarriages, benefit increased with the number of prior losses.",
        "With three or more previous miscarriages, live birth was 72% vs 57%, a meaningful benefit.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "NICE NG126 (updated 2021) recommends offering vaginal micronised progesterone to women with early pregnancy bleeding and a previous miscarriage." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "There was no benefit overall or in women with no previous miscarriage.",
        "The guideline recommendation targets the bleeding-plus-previous-miscarriage group, based on a pre-specified subgroup.",
      ] },
    ],
  },

  {
    id: "trial-big-baby",
    gl: "TRIAL",
    source: "TRIAL",
    condition: "Landmark Trial",
    setting: "Obstetrics · Suspected large-for-dates",
    title: "Big Baby Trial: induction at 38 weeks for a suspected large baby",
    draft: false,
    trial: {
      acronym: "Big Baby Trial",
      name: "Induction of labour versus standard care to prevent shoulder dystocia in suspected large-for-gestational-age fetuses",
      group: "Gardosi J et al., Warwick Clinical Trials Unit",
      citation: "Lancet 2025;405:1743–56",
      doi: "10.1016/S0140-6736(25)00162-X",
      url: "https://doi.org/10.1016/S0140-6736(25)00162-X",
      year: 2025,
      n: "2,893 women",
      design: "Multicentre open-label RCT",
    },
    flowchartId: "GL861_TIMING",
    relatedGl: ["GL861"],
    tags: [
      "big baby trial", "macrosomia", "large for gestational age", "lga", "suspected big baby",
      "induction for macrosomia", "shoulder dystocia prevention", "estimated fetal weight",
      "gardosi", "quenby", "iol 38 weeks", "large for dates", "landmark trial", "obstetric trial",
    ],
    content: [
      { type: "alert", value: "Bottom line: for a fetus suspected to be large for gestational age, inducing at 38 weeks did not significantly reduce shoulder dystocia in the main analysis. A per-protocol analysis did show a reduction, so it informs shared decisions rather than mandating early induction." },

      { type: "subheading", value: "Clinical question" },
      { type: "text", value: "In pregnancies with a fetus suspected to be large for gestational age, does induction of labour at 38 weeks reduce shoulder dystocia compared with standard care?" },

      { type: "subheading", value: "Design & population" },
      { type: "list", items: [
        "Multicentre open-label randomised trial across 106 UK hospitals.",
        "2,893 women with a suspected large-for-gestational-age fetus (estimated fetal weight above the 90th customised percentile), identified between 35 and 38 weeks; drug-treated diabetes and gestational diabetes were excluded.",
        "Induction at 38+0 to 38+4 weeks versus standard care. The trial stopped early because shoulder dystocia in the standard-care group was lower than expected.",
      ] },

      { type: "subheading", value: "Key result" },
      { type: "list", items: [
        "Shoulder dystocia (intention-to-treat): 2.3% induction vs 3.1% standard care (RR 0.75, 95% CI 0.51–1.09), not statistically significant.",
        "Per-protocol analysis: 2.3% vs 3.7% (RR 0.62, 95% CI 0.41–0.92), a significant reduction.",
        "Induction lowered mean birthweight by about 164 g; around a quarter of the standard-care group had already given birth by 38 weeks, which narrowed the difference between the groups.",
      ] },

      { type: "subheading", value: "What it changed" },
      { type: "text", value: "It has not rewritten a guideline. Instead it gives women with a suspected large baby and their clinicians clearer information for shared decisions about the timing and mode of birth. Meta-analyses that pool this and earlier trials find that induction around 38 weeks reduces caesarean birth and macrosomia, supporting it as one reasonable option." },

      { type: "subheading", value: "Caveats" },
      { type: "list", items: [
        "The primary intention-to-treat outcome was not statistically significant; the significant result came from the per-protocol analysis.",
        "The trial stopped early and did not reach its recruitment target, so it was underpowered.",
        "Suspected large-for-gestational-age is an ultrasound estimate that is often inaccurate, and diabetic pregnancies were excluded.",
        "A health-economic analysis found early induction raised neonatal costs and was not cost-effective in maternal quality-of-life terms.",
      ] },
    ],
  },
];
