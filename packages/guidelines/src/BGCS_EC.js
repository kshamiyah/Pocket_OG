// BGCS_EC — Endometrial (Uterine) Cancer
// British Gynaecological Cancer Society (BGCS) uterine cancer guidelines:
// Recommendations for practice (Morrison J, Balega J, Buckley L, et al.
// Eur J Obstet Gynecol Reprod Biol 2022;270:50-89). Original Pocket O&G
// summary; grades in brackets are the guideline's own. Verify against the
// full text and local protocol.

export const BGCS_EC_SECTIONS = [
  {
    id: "bgcs-ec-overview",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Overview, Risk Factors & Prevention",
    tags: [
      "endometrial cancer", "uterine cancer", "womb cancer", "endometrial carcinoma",
      "endometrial cancer risk factors", "endometrial cancer prevention", "bgcs",
    ],
    content: [
      { type: "text", value: "Endometrial cancer (EC) is the most common gynaecological cancer in the UK. It is broadly split into type I (endometrioid), which is oestrogen-driven and linked to obesity and better prognosis, and higher-grade non-endometrioid tumours (serous, clear cell, carcinosarcoma, grade 3 endometrioid) with a poorer prognosis." },
      { type: "subheading", value: "Risk factors" },
      { type: "list", items: [
        "Unopposed oestrogen exposure: obesity, PCOS, nulliparity, early menarche/late menopause, oestrogen-only HRT, tamoxifen.",
        "Diabetes, hypertension, and increasing age.",
        "Lynch syndrome (hereditary): a major inherited risk.",
      ]},
      { type: "subheading", value: "Prevention" },
      { type: "list", items: [
        "Ever-use of the levonorgestrel intrauterine system (LNG-IUS) confers around a 78% reduction in EC risk compared with never-use.",
        "There is no UK screening programme for women at average or high risk of EC.",
        "Lynch syndrome: annual screening with transvaginal ultrasound, hysteroscopy and/or endometrial sampling may be offered from age 35 after counselling (Grade C); risk-reducing hysterectomy (with bilateral salpingo-oophorectomy) is effective once the family is complete (Grade C).",
      ]},
    ],
  },

  {
    id: "bgcs-ec-diagnosis",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Presentation & Diagnosis",
    tags: [
      "endometrial cancer diagnosis", "postmenopausal bleeding endometrial cancer",
      "endometrial thickness cancer", "lynch testing endometrial cancer",
      "endometrial biopsy cancer", "endometrial cancer referral",
    ],
    content: [
      { type: "alert", value: "The commonest symptom is postmenopausal bleeding (PMB): vaginal bleeding at least a year after the last period in a woman not on HRT. The probability of endometrial cancer in a woman with PMB is around 5-10%. Refer on the suspected-cancer (2-week-wait) pathway." },
      { type: "list", items: [
        "Transvaginal ultrasound double-layer endometrial thickness with a cut-off of 4 mm should be investigated (Grade B).",
        "An endometrial thickness <4 mm with no endometrial irregularity does not require further investigation unless there is recurrent PMB (Grade B).",
        "Diagnosis is histological: endometrial biopsy, and hysteroscopy with directed biopsy where sampling fails or a focal lesion is suspected (see the GTG67 postmenopausal-bleeding pathway).",
        "Atypical hyperplasia carries a substantial risk of concurrent cancer and should be discussed at the gynaecological oncology MDT.",
      ]},
      { type: "alert", value: "All patients with endometrial cancer should be offered testing for Lynch syndrome (Grade C)." },
    ],
  },

  {
    id: "bgcs-ec-classification",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Histological & Molecular Classification",
    tags: [
      "endometrial cancer molecular classification", "pole endometrial cancer",
      "mmr deficient endometrial", "p53 endometrial cancer", "nsmp", "tcga endometrial",
      "serous endometrial cancer", "clear cell carcinosarcoma",
    ],
    content: [
      { type: "text", value: "The TCGA analysis identified four molecular subgroups that carry prognostic significance and increasingly guide treatment alongside stage and grade." },
      { type: "table", headers: ["Molecular group", "Prognosis"], rows: [
        ["POLE-mutant (POLEmut)", "Best prognosis; may allow de-escalation of adjuvant therapy"],
        ["Mismatch-repair deficient (MMRd)", "Intermediate; prompts Lynch syndrome consideration"],
        ["No specific molecular profile (NSMP / copy-number low)", "Intermediate"],
        ["p53-abnormal (p53abn)", "Poorest prognosis; often high-grade, less chemosensitive"],
      ]},
      { type: "subheading", value: "Histology" },
      { type: "list", items: [
        "Type I: endometrioid adenocarcinoma, oestrogen-driven, usually lower grade and better prognosis.",
        "High-grade / non-endometrioid: serous, clear cell, carcinosarcoma, and grade 3 endometrioid, with a higher risk of extra-uterine spread.",
      ]},
    ],
  },

  {
    id: "bgcs-ec-surgery",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Surgical Management & Staging",
    tags: [
      "endometrial cancer surgery", "total hysterectomy bso endometrial",
      "sentinel lymph node endometrial", "endometrial cancer staging", "figo staging endometrial",
      "endometrial cancer mdt",
    ],
    content: [
      { type: "list", items: [
        "All confirmed or suspected EC should be discussed at a specialist gynaecological cancer MDT (Grade D).",
        "Presumed FIGO stage IA endometrioid, grade 1 or 2, may undergo surgery by a gynaecologist at a gynaecological cancer diagnostic unit who is a core MDT member (Grade D).",
        "High-grade tumours (serous, clear cell, carcinosarcoma, grade 3 endometrioid) or suspected FIGO 1B or above should be operated on at a cancer centre by a subspecialty-trained surgeon (Grade D).",
      ]},
      { type: "subheading", value: "Surgery" },
      { type: "list", items: [
        "Standard surgery is total hysterectomy and bilateral salpingo-oophorectomy, without vaginal cuff or parametrectomy (Grade D). Minimal-access (laparoscopic) surgery is standard of care where feasible.",
        "Systematic lymphadenectomy of non-bulky nodes is not recommended, especially in low-risk EC (Grade A).",
        "Sentinel lymph node biopsy has high diagnostic accuracy and should replace lymphadenectomy of non-bulky nodes for staging (Grade B).",
        "Surgical staging (sentinel node and omental biopsy) may be appropriate for disease greater than low risk (Grade C).",
        "Ovarian conservation may be considered in premenopausal grade 1 endometrioid EC with <50% myometrial invasion and no extra-uterine disease on imaging.",
      ]},
    ],
  },

  {
    id: "bgcs-ec-adjuvant",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Adjuvant Treatment",
    tags: [
      "endometrial cancer adjuvant", "brachytherapy endometrial", "ebrt endometrial",
      "endometrial cancer radiotherapy", "endometrial cancer chemotherapy", "portec",
    ],
    content: [
      { type: "list", items: [
        "Intra-cavitary (vaginal) brachytherapy alone may be considered for low-grade, stage I tumours without deep myometrial invasion (Grade B).",
        "Combined external beam radiotherapy (EBRT) and intra-cavitary brachytherapy may be considered for high-grade tumours, deep myometrial invasion and/or stage II disease (Grade B).",
        "Chemotherapy is used for high-risk and advanced disease; adjuvant therapy is increasingly guided by the molecular profile (e.g. de-escalation considered in POLEmut tumours).",
        "Progestin therapy may be considered where surgery or radiotherapy is not an option (Grade B).",
      ]},
    ],
  },

  {
    id: "bgcs-ec-fertility",
    gl: "BGCS_EC",
    condition: "Endometrial Cancer",
    setting: "Gynae-Oncology",
    title: "Fertility-sparing Management",
    tags: [
      "fertility sparing endometrial cancer", "progestin endometrial cancer",
      "lng-ius endometrial cancer", "medroxyprogesterone endometrial", "megestrol endometrial",
    ],
    content: [
      { type: "alert", value: "Fertility-sparing management is an option only in carefully selected women with grade 1 endometrioid EC (or atypical hyperplasia) confined to the endometrium, after MDT discussion and counselling that it is not standard curative treatment." },
      { type: "list", items: [
        "Treatment is medroxyprogesterone acetate 400-600 mg/day or megestrol acetate 160-320 mg/day and/or the LNG-IUS for 6-12 months (Grade B).",
        "Hysteroscopic resection before progestin therapy may be considered; adding a GnRH analogue may be considered (Grade B).",
        "Strict surveillance during treatment includes serial endometrial biopsy.",
        "Proceed to definitive surgery (hysterectomy) if treatment fails or once childbearing is complete (Grade A).",
      ]},
    ],
  },
];
