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
    draft: true,
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
];
