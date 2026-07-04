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
];
