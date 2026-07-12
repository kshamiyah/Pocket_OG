// GTG34 — Ovarian Cysts in Postmenopausal Women
// RCOG Green-top Guideline No. 34 (July 2016), amended December 2025 in line
// with the RCOG/RCR consensus statement on follow-up of simple cysts,
// supported by the British Gynaecological Cancer Society (BGCS) and the
// British Society of Urogenital Radiology (BSUR)

export const GTG34_SECTIONS = [
  {
    id: "gtg34-overview",
    gl: "GTG34",
    condition: "Ovarian Cysts in Postmenopausal Women",
    setting: "Gynaecology",
    title: "Ovarian Cysts in Postmenopausal Women — Overview & Risk",
    tags: [
      "postmenopausal ovarian cyst", "gtg34", "rcog", "ovarian cancer risk postmenopausal",
      "adnexal mass postmenopausal", "simple ovarian cyst postmenopausal",
      "incidental ovarian cyst", "ovarian cyst follow up postmenopausal",
    ],
    content: [
      { type: "text", value: "RCOG Green-top Guideline No. 34 (July 2016, amended December 2025) covers the investigation and management of ovarian cysts in postmenopausal women. Many are found incidentally, during investigation of symptoms or on imaging performed for another reason." },
      { type: "alert", value: "The same cyst appearance carries a higher malignancy risk in a postmenopausal woman than in a premenopausal woman — this is reflected directly in the Risk of Malignancy Index, where menopausal status alone triples the score." },
      { type: "text", value: "Not every postmenopausal ovarian cyst needs surgery. Simple cysts are common at this age (often serous cystadenomas or inclusion cysts) and the great majority are benign — the guideline exists to triage which ones need review or surgery and which can be safely left alone." },
    ],
  },

  {
    id: "gtg34-investigation",
    gl: "GTG34",
    condition: "Ovarian Cysts in Postmenopausal Women",
    setting: "Gynaecology",
    title: "Investigation & Risk Stratification",
    tags: [
      "rmi postmenopausal", "ca125 postmenopausal", "risk of malignancy index postmenopausal",
      "transvaginal ultrasound postmenopausal ovarian", "ct staging ovarian",
    ],
    content: [
      { type: "text", value: "Transvaginal ultrasound and serum CA125 are first-line investigations in every postmenopausal woman with a known or suspected ovarian cyst." },
      { type: "subheading", value: "Risk of Malignancy Index (RMI I)" },
      { type: "table", headers: ["Component", "Scoring"], rows: [
        ["Ultrasound score (U)", "1 point each for: multilocular cyst, solid areas, metastases, ascites, bilateral lesions. U = 0 (no features), U = 1 (one feature), U = 3 (two or more features)"],
        ["Menopausal score (M)", "3 for postmenopausal status (vs 1 premenopausal)"],
        ["CA125", "Serum level in IU/ml"],
        ["RMI I", "= U × M × CA125"],
      ]},
      { type: "alert", value: "RMI >200 (some centres use 250 — verify against local protocol) should prompt referral to the gynaecological oncology MDT. Where malignancy is suspected on ultrasound or RMI, CT chest/abdomen/pelvis and MRI pelvis are used for staging." },
    ],
  },

  {
    id: "gtg34-management",
    gl: "GTG34",
    condition: "Ovarian Cysts in Postmenopausal Women",
    setting: "Gynaecology",
    title: "Management Pathway, Including the December 2025 Update",
    tags: [
      "simple ovarian cyst no follow up", "postmenopausal cyst surveillance",
      "ovarian cyst 3cm", "rcog rcr consensus statement ovarian cyst",
      "postmenopausal ovarian cyst discharge",
    ],
    flowchartId: "ADNEXAL_MASS_TRIAGE",
    content: [
      { type: "alert", value: "December 2025 update: following a joint RCOG/RCR consensus statement, supported by the BGCS and BSUR, unilateral, unilocular, simple ovarian cysts measuring 3 cm or less on imaging in postmenopausal women do not require routine follow-up." },
      { type: "table", headers: ["Cyst description", "Management"], rows: [
        ["Simple, unilocular, ≤3 cm", "No routine follow-up (December 2025 consensus). Re-image only for new symptoms"],
        ["Simple, unilocular, 3–5 cm, CA125 normal", "Conservative — yearly ultrasound and CA125; discharge if stable"],
        ["Complex features, >5 cm, or CA125 raised", "Refer to gynaecology; calculate RMI and consider MDT input"],
        ["RMI >200 or strong clinical suspicion", "Refer to the gynaecological oncology MDT before any surgery"],
      ]},
      { type: "text", value: "See the linked flowchart for the full triage pathway, which also covers premenopausal cysts (RCOG/BSGE Green-top Guideline No. 62)." },
    ],
  },

  {
    id: "gtg34-surgical",
    gl: "GTG34",
    condition: "Ovarian Cysts in Postmenopausal Women",
    setting: "Gynaecology",
    title: "Surgical Management",
    tags: [
      "bilateral salpingo-oophorectomy", "bso ovarian cyst", "postmenopausal ovarian surgery",
      "laparoscopy postmenopausal ovarian cyst", "hysterectomy ovarian cyst",
    ],
    content: [
      { type: "text", value: "Surgery in postmenopausal women is more often bilateral salpingo-oophorectomy (BSO), with or without hysterectomy, reflecting both the higher background incidence of neoplasia at this age and the absence of any reproductive function to preserve." },
      { type: "list", items: [
        "Laparoscopic approach is preferred where the mass has a benign appearance",
        "Avoid intra-operative cyst rupture — use a retrieval bag for extraction; rupture of an unexpected malignancy risks upstaging and the need for adjuvant treatment",
        "Where malignancy is suspected pre-operatively (RMI >200 or suspicious imaging), surgery should be planned and performed within the gynaecological oncology MDT setting rather than as a routine benign case",
        "Incidental malignancy found at surgery: refer for full staging and MDT-led management",
      ]},
    ],
  },
];
