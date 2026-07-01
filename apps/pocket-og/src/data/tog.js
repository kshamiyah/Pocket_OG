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
//
// TRIAL: this is a single demonstration card. The clinical content is a faithful
// draft aligned with RCOG GTG69 but is NOT yet clinically signed off, and the
// citation fields are placeholders — fill them from the downloaded article.
export const TOG_SECTIONS = [
  {
    id: "tog-nvp-hyperemesis",
    gl: "TOG",
    source: "TOG",
    condition: "TOG Review",
    setting: "Review — Early Pregnancy",
    title: "Nausea & Vomiting of Pregnancy and Hyperemesis Gravidarum",
    draft: true,
    tog: {
      article: "Nausea and vomiting of pregnancy and hyperemesis gravidarum",
      authors: "",                       // TODO: fill from the article
      citation: "TOG 20XX;XX:XXX–XXX",   // TODO: volume;issue:pages
      doi: "",                           // TODO: 10.1111/tog.XXXXX
      url: "",                           // TODO: Wiley/RCOG article URL
    },
    relatedGl: ["GTG69"],
    tags: [
      "nausea vomiting pregnancy", "nvp", "hyperemesis", "hyperemesis gravidarum", "hg",
      "morning sickness", "vomiting pregnancy", "sickness in pregnancy", "puqe", "puqe score",
      "antiemetic pregnancy", "cyclizine", "prochlorperazine", "promethazine", "ondansetron",
      "metoclopramide", "xonvea", "doxylamine pyridoxine", "thiamine pregnancy", "wernicke",
      "ketonuria pregnancy", "iv fluids pregnancy", "dehydration pregnancy", "tog review",
    ],
    content: [
      { type: "alert", value: "Bottom line: most NVP is self-limiting — onset before 9 weeks, peaks ~9–12 weeks, usually settles by 16–20 weeks. Hyperemesis gravidarum (HG) is the severe end: protracted vomiting with dehydration, electrolyte disturbance, ketosis and >5% pre-pregnancy weight loss. New or first onset after 11 weeks is atypical — look for another cause." },

      { type: "subheading", value: "Assess severity — PUQE score" },
      { type: "text", value: "The PUQE (Pregnancy-Unique Quantification of Emesis) score grades severity over the last 24 h from nausea duration, number of vomits and number of retches." },
      { type: "table",
        headers: ["PUQE", "Severity", "Typical action"],
        rows: [
          ["≤ 6", "Mild", "Community / oral antiemetics, reassurance, fluids"],
          ["7–12", "Moderate", "Oral or ambulatory management, review closely"],
          ["≥ 13", "Severe", "Consider admission / ambulatory day-unit IV fluids"],
        ],
      },
      { type: "list", items: [
        "Check weight (vs booking), signs of dehydration, urinary ketones and MSU.",
        "Bloods: U&E (hypokalaemia, hyponatraemia), FBC, and consider TFTs, LFTs, glucose.",
        "Exclude other causes: UTI, thyroid disease, GI pathology; consider multiple/molar pregnancy on scan.",
      ]},

      { type: "subheading", value: "Antiemetic ladder" },
      { type: "alert", value: "No antiemetic is licensed specifically for NVP, but first-line agents have a long reassuring safety record. Do not withhold treatment — undertreated NVP causes real morbidity." },
      { type: "table",
        headers: ["Line", "Options", "Notes"],
        rows: [
          ["First", "Cyclizine, promethazine, prochlorperazine, or doxylamine–pyridoxine (Xonvea)", "Antihistamine / phenothiazine — well-established safety"],
          ["Second", "Metoclopramide or domperidone", "Metoclopramide max 5 days (extrapyramidal effects); domperidone — cardiac caution"],
          ["Second", "Ondansetron", "Counsel re. the small absolute increase in cleft-palate risk with first-trimester use; shared decision"],
          ["Third", "Corticosteroids (e.g. hydrocortisone IV → oral prednisolone taper)", "For refractory HG under senior/consultant guidance"],
        ],
      },

      { type: "subheading", value: "Supportive care when admitted" },
      { type: "list", items: [
        "IV rehydration with normal saline + added potassium (guided by U&E). Avoid dextrose-only fluids.",
        "Give thiamine (oral or IV) to prevent Wernicke's encephalopathy — and give it BEFORE any glucose-containing fluid.",
        "Thromboprophylaxis: HG + dehydration + admission is a VTE risk — prescribe LMWH and TEDs unless contraindicated.",
        "Consider H2-receptor antagonist or PPI for associated reflux/oesophagitis.",
        "Daily weight, fluid balance, U&E and ketone monitoring; step down as PUQE improves.",
      ]},

      { type: "subheading", value: "Complications to watch for" },
      { type: "list", items: [
        "Wernicke's encephalopathy (thiamine deficiency), central pontine myelinolysis (over-rapid Na⁺ correction).",
        "Mallory–Weiss tears, venous thromboembolism, acute kidney injury.",
        "Significant psychological impact — screen for low mood; NVP is a recognised contributor to poor wellbeing and, rarely, termination requests.",
      ]},

      { type: "subheading", value: "MRCOG pearls" },
      { type: "list", items: [
        "HG is a clinical triad: >5% weight loss, dehydration and electrolyte imbalance.",
        "Ketonuria is a traditional marker but is NOT a reliable measure of HG severity — treat the patient, not the dipstick.",
        "First onset of vomiting after 11 weeks' gestation should prompt a search for an alternative diagnosis.",
      ]},

      { type: "text", value: "Draft summary aligned with RCOG GTG69 — pending clinical sign-off. Always verify doses against the app Rx formulary and your local protocol, and read the full TOG article for the complete discussion." },
    ],
  },
];
