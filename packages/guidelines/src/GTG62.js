// GTG62 — Management of Suspected Ovarian Masses in Premenopausal Women
// RCOG/BSGE Green-top Guideline No. 62 (November 2011)

export const GTG62_SECTIONS = [
  {
    id: "gtg62-overview",
    gl: "GTG62",
    condition: "Ovarian Masses in Premenopausal Women",
    setting: "Gynaecology",
    title: "Suspected Ovarian Masses — Overview & Risk",
    tags: [
      "ovarian cyst", "ovarian mass", "gtg62", "rcog", "bsge",
      "premenopausal ovarian cyst", "adnexal mass", "functional cyst",
      "simple ovarian cyst", "complex ovarian cyst", "ovarian cancer risk premenopausal",
    ],
    content: [
      { type: "text", value: "RCOG/BSGE Green-top Guideline No. 62 (November 2011) covers the initial assessment and management of suspected ovarian masses in premenopausal women, clarifying when a mass can be managed within a benign gynaecology service and when it needs referral to gynaecological oncology." },
      { type: "alert", value: "Ovarian malignancy is rare in premenopausal women — the incidence in an asymptomatic simple cyst is around 1 in 1000. Most masses found incidentally on scan are functional cysts (follicular or corpus luteal) and resolve without intervention." },
      { type: "subheading", value: "When to Suspect Malignancy" },
      { type: "list", items: [
        "Ultrasound features: multilocular cyst, solid areas, papillary structures, ascites, strong internal blood flow, bilateral masses",
        "Rapid growth on serial imaging",
        "Family history of ovarian or breast cancer, or known BRCA1/2 or Lynch syndrome status",
        "Persistent or worsening symptoms (bloating, pelvic pain, early satiety, urinary frequency) — the same symptom set flagged for ovarian cancer awareness in primary care",
      ]},
      { type: "subheading", value: "Acute Presentation" },
      { type: "text", value: "Sudden-onset severe pain raises the possibility of torsion, rupture or haemorrhage into a cyst — this is an acute gynaecological presentation and is managed separately from the elective triage pathway below." },
    ],
  },

  {
    id: "gtg62-investigation",
    gl: "GTG62",
    condition: "Ovarian Masses in Premenopausal Women",
    setting: "Gynaecology",
    title: "Investigation & Risk of Malignancy Index",
    tags: [
      "rmi", "risk of malignancy index", "ca125", "transvaginal ultrasound ovarian",
      "iota simple rules", "germ cell tumour markers", "afp", "hcg", "ldh",
      "ovarian tumour markers premenopausal",
    ],
    content: [
      { type: "text", value: "Transvaginal ultrasound (TVUSS) is the first-line imaging investigation. Serum CA125 should be checked in all women with a suspected ovarian mass." },
      { type: "alert", value: "Do not check CA125 during menstruation — this gives false positives. CA125 is also raised by fibroids, endometriosis, pregnancy, pelvic infection and liver disease, so interpret it alongside imaging, not in isolation." },
      { type: "subheading", value: "Additional Tumour Markers Under Age 40" },
      { type: "text", value: "In women under 40 with a complex mass, add hCG, AFP and LDH — germ cell tumours are more common in this age group and are not reliably flagged by CA125 alone." },
      { type: "subheading", value: "Risk of Malignancy Index (RMI I)" },
      { type: "text", value: "RMI I combines the ultrasound findings, menopausal status and CA125 level into a single score used to triage referral." },
      { type: "table", headers: ["Component", "Scoring"], rows: [
        ["Ultrasound score (U)", "1 point each for: multilocular cyst, solid areas, metastases, ascites, bilateral lesions. U = 0 (no features), U = 1 (one feature), U = 3 (two or more features)"],
        ["Menopausal score (M)", "1 = premenopausal, 3 = postmenopausal"],
        ["CA125", "Serum level in IU/ml"],
        ["RMI I", "= U × M × CA125"],
      ]},
      { type: "alert", value: "RMI >200 (some centres use a threshold of 250 — verify against local protocol) predicts a substantially higher risk of malignancy and should prompt referral to the gynaecological oncology MDT." },
      { type: "text", value: "The IOTA (International Ovarian Tumour Analysis) simple rules are a validated ultrasound-based alternative or adjunct to RMI, using benign and malignant feature sets to classify a mass; local availability of trained sonographers determines whether this is used alongside RMI." },
    ],
  },

  {
    id: "gtg62-management",
    gl: "GTG62",
    condition: "Ovarian Masses in Premenopausal Women",
    setting: "Gynaecology",
    title: "Management Pathway",
    tags: [
      "conservative management ovarian cyst", "ovarian cyst follow up",
      "ovarian cyst discharge", "ovarian cyst surveillance premenopausal",
      "ovarian cyst referral gynaecology",
    ],
    flowchartId: "ADNEXAL_MASS_TRIAGE",
    content: [
      { type: "text", value: "Management is driven by cyst appearance, size and CA125 rather than by symptoms alone, since most simple cysts are asymptomatic." },
      { type: "table", headers: ["Cyst description", "Management"], rows: [
        ["Simple, unilocular, <5 cm, CA125 normal", "Conservative — repeat scan at 3–6 months; discharge if unchanged or smaller at 1 year"],
        ["Simple, 5–7 cm, or CA125 mildly raised", "Routine gynaecology referral; interval rescan per local protocol"],
        ["Complex features, or >7 cm", "Further imaging (MRI) and gynaecology referral — ultrasound assessment becomes less reliable at larger sizes"],
        ["RMI >200 or strong clinical suspicion", "Refer to the gynaecological oncology MDT before any surgery"],
      ]},
      { type: "text", value: "See the linked flowchart for the full triage pathway, which also covers postmenopausal cysts (RCOG Green-top Guideline No. 34)." },
    ],
  },

  {
    id: "gtg62-surgical",
    gl: "GTG62",
    condition: "Ovarian Masses in Premenopausal Women",
    setting: "Gynaecology",
    title: "Surgical Management Principles",
    tags: [
      "laparoscopic ovarian cystectomy", "ovarian cystectomy", "cyst rupture avoidance",
      "retrieval bag ovarian", "frozen section ovarian", "fertility preservation ovarian surgery",
    ],
    content: [
      { type: "text", value: "Where surgery is indicated for a mass with a benign appearance, laparoscopy is the gold-standard approach — it is associated with earlier discharge and is cost-effective compared with laparotomy." },
      { type: "subheading", value: "Avoiding Rupture" },
      { type: "list", items: [
        "Pre- and intra-operative assessment cannot completely exclude malignancy, so spillage of cyst contents should be avoided wherever possible",
        "Use a tissue retrieval bag for extraction when operating laparoscopically",
        "If the cyst cannot be removed intact laparoscopically, extend the incision or convert to open surgery rather than risk rupture",
      ]},
      { type: "subheading", value: "Cystectomy vs Oophorectomy" },
      { type: "list", items: [
        "Ovarian cystectomy (rather than oophorectomy) is preferred where technically feasible in women who wish to preserve fertility",
        "Send the specimen for histology; frozen section can guide intra-operative decision-making if malignancy is suspected unexpectedly",
        "If malignancy is found or strongly suspected intra-operatively, do not proceed with definitive surgery outside a gynaecological oncology setting — close and refer to the MDT for staging",
      ]},
      { type: "subheading", value: "Suspected Malignancy Pre-operatively" },
      { type: "text", value: "Where RMI or imaging raises significant concern before surgery, management belongs with the gynaecological oncology MDT from the outset, including the choice of incision and the extent of staging surgery." },
    ],
  },
];
