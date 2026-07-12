// NG23 — Menopause: Identification and Management
// NICE Guideline NG23 (November 2015, last updated 07 November 2024)

export const NG23_SECTIONS = [
  {
    id: "ng23-diagnosis",
    gl: "NG23",
    condition: "Menopause",
    setting: "Gynaecology",
    title: "Diagnosis of Perimenopause & Menopause",
    tags: [
      "menopause diagnosis", "perimenopause", "ng23", "nice menopause",
      "fsh test menopause", "vasomotor symptoms", "hot flushes",
      "night sweats", "irregular periods menopause",
    ],
    content: [
      { type: "text", value: "NICE NG23 (November 2015, updated November 2024) covers identifying and managing the menopause, including in women with premature ovarian insufficiency." },
      { type: "alert", value: "Diagnose perimenopause and menopause on symptoms alone in women aged over 45, without laboratory tests, unless there is an atypical presentation." },
      { type: "subheading", value: "Typical Presentation" },
      { type: "list", items: [
        "Perimenopause: vasomotor symptoms (hot flushes, night sweats) with irregular periods",
        "Menopause in women with a uterus: vasomotor symptoms and no period for at least 12 months",
        "Menopause in women without a uterus (previous hysterectomy): diagnose on vasomotor symptoms alone",
        "Other common symptoms: mood changes, low mood, anxiety, difficulty sleeping, joint and muscle pain, reduced libido, and genitourinary symptoms (vaginal dryness, discomfort, recurrent urinary tract infection)",
      ]},
      { type: "subheading", value: "When to Use FSH" },
      { type: "list", items: [
        "Not needed in women over 45 with typical menopausal symptoms",
        "Consider FSH in women aged 40–45 with menopausal symptoms, including a change in the menstrual cycle",
        "Use FSH to diagnose suspected premature ovarian insufficiency in women under 40 (see the dedicated section below)",
        "Consider FSH in women already on hormonal contraception where natural menopause is otherwise hard to identify",
      ]},
    ],
  },

  {
    id: "ng23-hrt-types",
    gl: "NG23",
    condition: "Menopause",
    setting: "Gynaecology",
    title: "HRT: Types, Regimens & Routes",
    tags: [
      "hrt types", "combined hrt", "oestrogen only hrt", "cyclical hrt",
      "continuous combined hrt", "transdermal hrt", "hrt patch", "hrt gel",
      "lng-ius hrt", "mirena hrt", "oral hrt",
    ],
    content: [
      { type: "text", value: "The choice of HRT regimen depends on whether the uterus is present, and on how long it has been since the last menstrual period." },
      { type: "table", headers: ["Situation", "Regimen"], rows: [
        ["No uterus (previous hysterectomy)", "Oestrogen-only HRT — no progestogen required"],
        ["Uterus present, perimenopausal or <12 months since last period", "Cyclical combined HRT (oestrogen daily + progestogen for part of the cycle) — gives a withdrawal bleed"],
        ["Uterus present, ≥12 months since last period (or age ≥54 with uncertain menopausal status)", "Continuous combined HRT (oestrogen + progestogen daily) — no bleed"],
      ]},
      { type: "alert", value: "Any woman with a uterus taking oestrogen must have adequate endometrial progestogen protection — unopposed oestrogen increases endometrial cancer risk." },
      { type: "subheading", value: "Progestogen Delivery Options" },
      { type: "list", items: [
        "Oral progestogen, as part of a combined oral preparation",
        "Transdermal combined patch",
        "LNG-IUS (52 mg, Mirena) as the progestogen component, alongside oestrogen given separately — also provides contraception where relevant",
      ]},
      { type: "subheading", value: "Route of Oestrogen" },
      { type: "list", items: [
        "Oral: tablets — straightforward but carries a higher VTE risk than transdermal routes",
        "Transdermal: patches or gel — preferred where VTE risk, migraine with aura, or a BMI over 30 is a concern; also useful where oral absorption or adherence is a problem",
        "Vaginal (low-dose, local): treats genitourinary symptoms specifically — covered in the genitourinary symptoms section below",
      ]},
    ],
  },

  {
    id: "ng23-benefits-risks",
    gl: "NG23",
    condition: "Menopause",
    setting: "Gynaecology",
    title: "Benefits, Risks & Counselling",
    tags: [
      "hrt risks", "hrt benefits", "breast cancer hrt risk", "vte hrt risk",
      "cardiovascular disease hrt", "hrt bone protection", "osteoporosis hrt",
      "hrt counselling", "hrt shared decision making",
    ],
    content: [
      { type: "text", value: "Discuss benefits and risks individually, tailored to age, time since menopause, and personal risk factors — the balance is generally favourable for symptomatic women starting HRT before age 60 or within 10 years of menopause." },
      { type: "subheading", value: "Benefits" },
      { type: "list", items: [
        "Effective relief of vasomotor and other menopausal symptoms",
        "Bone protection — reduces risk of osteoporotic fracture while taking HRT",
        "Cardiovascular risk is not increased, and may be reduced, when HRT is started before age 60",
        "HRT does not appear to increase or decrease overall life expectancy",
      ]},
      { type: "subheading", value: "Breast Cancer Risk" },
      { type: "text", value: "The NICE patient decision aid quantifies the added risk for a woman starting HRT at 50 and taking it for 5 years, tracked over the 20 years from age 50 to 69:" },
      { type: "table", headers: ["HRT type", "Extra breast cancer cases per 1,000 women over 20 years"], rows: [
        ["Combined (oestrogen + progestogen)", "About 20 extra cases (roughly 1 extra case per 1,000 women per year)"],
        ["Oestrogen-only", "About 10 extra cases (roughly 1 extra case per 2,000 women per year)"],
      ]},
      { type: "subheading", value: "VTE Risk" },
      { type: "list", items: [
        "Oral oestrogen roughly doubles VTE risk compared with baseline",
        "Transdermal oestrogen (patch or gel) is not associated with an increased VTE risk — the preferred route for women with VTE risk factors",
      ]},
      { type: "text", value: "Individualise the conversation: someone with a personal or family history of breast cancer, VTE, or cardiovascular disease needs a tailored discussion, which may include involving specialist services rather than a blanket rule against HRT." },
    ],
  },

  {
    id: "ng23-non-hormonal-gsm",
    gl: "NG23",
    condition: "Menopause",
    setting: "Gynaecology",
    title: "Non-Hormonal Options & Genitourinary Symptoms",
    tags: [
      "non-hormonal menopause treatment", "cbt menopause", "menopause cbt",
      "fezolinetant", "genitourinary syndrome of menopause", "gsm",
      "vaginal oestrogen", "vaginal dryness menopause", "ssri menopause",
      "clonidine menopause",
    ],
    flowchartId: "NG23_MENOPAUSE_PATHWAY",
    content: [
      { type: "subheading", value: "Non-Hormonal Options for Vasomotor Symptoms" },
      { type: "list", items: [
        "Menopause-specific cognitive behavioural therapy (CBT) — an option for those who prefer not to take HRT, or alongside HRT",
        "SSRIs, SNRIs and clonidine are not routinely offered as first-line treatment for vasomotor symptoms alone, but can be considered where HRT is unsuitable",
        "Fezolinetant — an option for moderate to severe vasomotor symptoms when HRT is unsuitable",
      ]},
      { type: "subheading", value: "Genitourinary Symptoms of Menopause (GSM)" },
      { type: "alert", value: "Offer vaginal oestrogen to anyone with genitourinary symptoms of menopause, including those already using systemic HRT — systemic HRT alone does not reliably treat local genitourinary symptoms." },
      { type: "list", items: [
        "Vaginal oestrogen can be continued for as long as it is needed to control symptoms — review regularly, but it does not carry the same systemic risk discussion as oral or transdermal HRT",
        "In women with a personal history of breast cancer whose genitourinary symptoms persist despite non-hormonal treatments, vaginal oestrogen may be considered — discuss with their oncology team; this was an off-label use as of the November 2024 update",
      ]},
    ],
  },

  {
    id: "ng23-poi",
    gl: "NG23",
    condition: "Premature Ovarian Insufficiency",
    setting: "Gynaecology",
    title: "Premature Ovarian Insufficiency",
    tags: [
      "premature ovarian insufficiency", "poi", "early menopause",
      "poi diagnosis", "poi fsh", "poi hrt", "premature menopause under 40",
    ],
    content: [
      { type: "text", value: "Premature ovarian insufficiency (POI) is the loss of ovarian function before age 40." },
      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: [
        "Age under 40, with menopause-associated symptoms — including no or infrequent periods",
        "Elevated FSH on two blood samples taken 4–6 weeks apart",
      ]},
      { type: "alert", value: "Offer sex steroid replacement — a choice of HRT or a combined hormonal contraceptive — unless contraindicated. This is not optional symptom management: continuing replacement until at least the average age of natural menopause protects bone and cardiovascular health that would otherwise be lost early." },
      { type: "list", items: [
        "Discuss fertility implications sensitively — POI does not mean an absolute inability to conceive, and unprotected intercourse can still result in pregnancy",
        "HRT in POI is not the same risk conversation as HRT started around the average age of menopause — replacement is restoring physiological hormone levels rather than adding exposure",
      ]},
    ],
  },
];
