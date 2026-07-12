// PCOS2023 — International Evidence-based Guideline for the Assessment and
// Management of Polycystic Ovary Syndrome (2023)
// Co-sponsored by ESHRE, ASRM, the Endocrine Society and ESE; led by the
// Centre for Research Excellence in PCOS (Monash University)

export const PCOS2023_SECTIONS = [
  {
    id: "pcos2023-diagnosis",
    gl: "PCOS2023",
    condition: "Polycystic Ovary Syndrome",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Diagnosis",
    tags: [
      "pcos", "polycystic ovary syndrome", "pcos2023", "rotterdam criteria",
      "pcos diagnosis", "hyperandrogenism", "pcom", "polycystic ovary morphology",
      "amh pcos", "pcos adolescents",
    ],
    flowchartId: "PCOS2023_DIAGNOSIS",
    content: [
      { type: "text", value: "The 2023 International Evidence-based Guideline for PCOS (ESHRE/ASRM/Endocrine Society/ESE) updates and refines the Rotterdam criteria, and is the current internationally endorsed reference in the absence of a dedicated NICE guideline." },
      { type: "alert", value: "Diagnose PCOS in adults when 2 of the following 3 features are present, having excluded other causes (e.g. hypothyroidism, hyperprolactinaemia, congenital adrenal hyperplasia, androgen-secreting tumours):" },
      { type: "list", items: [
        "Ovulatory dysfunction — irregular or absent ovulation, usually manifesting as irregular or absent periods",
        "Clinical or biochemical hyperandrogenism — hirsutism, acne, androgenic alopecia, or a raised free androgen index",
        "Polycystic ovarian morphology (PCOM) on ultrasound, or an elevated anti-Müllerian hormone (AMH) as an alternative to ultrasound in adults",
      ]},
      { type: "subheading", value: "Diagnosis in Adolescents" },
      { type: "text", value: "Both ovulatory dysfunction AND hyperandrogenism are required in adolescents — ultrasound and AMH are not used, since physiological multifollicular ovaries are common at this age and would lead to overdiagnosis." },
      { type: "subheading", value: "Endometrial Protection" },
      { type: "text", value: "Chronic anovulation means prolonged unopposed oestrogen exposure — flag the endometrial hyperplasia risk (see GTG67) in any woman with PCOS who has infrequent withdrawal bleeds, and ensure regular withdrawal bleeding is induced (COCP, cyclical progestogen, or an LNG-IUS) rather than left unaddressed." },
    ],
  },

  {
    id: "pcos2023-screening",
    gl: "PCOS2023",
    condition: "Polycystic Ovary Syndrome",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Metabolic, Cardiovascular & Psychological Screening",
    tags: [
      "pcos metabolic risk", "pcos insulin resistance", "pcos cardiovascular risk",
      "pcos sleep apnoea", "pcos anxiety depression", "pcos screening",
    ],
    content: [
      { type: "text", value: "PCOS is a whole-person condition, not just a reproductive diagnosis — the 2023 update strengthens recognition of metabolic, cardiovascular and psychological features alongside the reproductive ones." },
      { type: "list", items: [
        "Screen for metabolic risk: BMI, waist circumference, and an oral glucose tolerance test (particularly with additional risk factors such as obesity, family history of type 2 diabetes, or high-risk ethnicity)",
        "Consider cardiovascular risk factors and obstructive sleep apnoea symptoms, particularly in those with obesity",
        "Screen for anxiety and depression at diagnosis and periodically thereafter — psychological features are common and often under-recognised",
        "PCOS is a high-risk factor for adverse pregnancy outcomes (gestational diabetes, hypertensive disorders) — flag this at preconception counselling",
      ]},
    ],
  },

  {
    id: "pcos2023-management",
    gl: "PCOS2023",
    condition: "Polycystic Ovary Syndrome",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Management — Lifestyle & Medical",
    tags: [
      "pcos lifestyle management", "pcos cocp", "pcos metformin",
      "pcos hirsutism treatment", "pcos weight management",
    ],
    content: [
      { type: "alert", value: "Healthy lifestyle support — focused on overall health, preventing further weight gain, and weight management where needed — is foundational throughout life with PCOS, not a preliminary step before 'real' treatment." },
      { type: "subheading", value: "Menstrual Irregularity & Hyperandrogenism" },
      { type: "list", items: [
        "Combined oral contraceptive pill — first-line for managing irregular cycles, hirsutism and acne, in the absence of contraindications",
        "Metformin — consider in adults with a BMI ≥25, for metabolic outcomes (insulin resistance, glucose and lipid profile); an option for irregular cycles where the COCP is contraindicated, or in adolescents",
      ]},
    ],
  },

  {
    id: "pcos2023-fertility",
    gl: "PCOS2023",
    condition: "Polycystic Ovary Syndrome",
    setting: "Reproductive Medicine",
    title: "Management — Fertility",
    tags: [
      "pcos ovulation induction", "letrozole pcos", "clomiphene pcos",
      "pcos infertility treatment", "anovulatory infertility",
    ],
    content: [
      { type: "alert", value: "Letrozole is first-line pharmacological treatment for ovulation induction in anovulatory women with PCOS and no other infertility factor — it gives higher live birth rates than clomiphene citrate." },
      { type: "list", items: [
        "Weight loss, where BMI is raised, improves spontaneous ovulation and response to ovulation induction",
        "Clomiphene citrate remains an alternative where letrozole is unavailable or unsuitable",
        "Escalate to gonadotrophins or laparoscopic ovarian drilling, then IVF, per standard reproductive medicine pathways where first-line ovulation induction fails — see NG257 for the general subfertility pathway",
      ]},
    ],
  },
];
