// GTG48 — Management of Premenstrual Syndrome
// RCOG Green-top Guideline No. 48 (December 2016, February 2017 update)

export const GTG48_SECTIONS = [
  {
    id: "gtg48-diagnosis",
    gl: "GTG48",
    condition: "Premenstrual Syndrome",
    setting: "Gynaecology",
    title: "Diagnosis & Classification",
    tags: [
      "premenstrual syndrome", "pms", "gtg48", "rcog", "pmdd",
      "premenstrual dysphoric disorder", "symptom diary", "drsp",
      "premenstrual exacerbation",
    ],
    content: [
      { type: "text", value: "RCOG Green-top Guideline No. 48 (December 2016) covers the diagnosis, classification and management of premenstrual syndrome (PMS). PMS affects around 4 in 10 women, with severe symptoms in 5–8%." },
      { type: "subheading", value: "Classification" },
      { type: "list", items: [
        "Core PMS — psychological and/or physical symptoms in the luteal phase, resolving with menstruation, with a symptom-free week in the follicular phase; requires ovulatory cycles",
        "Premenstrual dysphoric disorder (PMDD) — the severe end of the psychological spectrum, dominated by mood symptoms (irritability, low mood, anxiety, loss of confidence) severe enough to affect daily function",
        "Premenstrual exacerbation — worsening of an underlying physical or psychiatric condition in the luteal phase, without a symptom-free week; treat the underlying condition as well as the premenstrual pattern",
      ]},
      { type: "alert", value: "Diagnosis requires prospective symptom recording over at least 2 menstrual cycles — retrospective recall is unreliable. The Daily Record of Severity of Problems (DRSP) is a validated, simple diary tool for this." },
      { type: "text", value: "Where the diagnosis is unclear or symptoms are atypical, a 3-month trial of a GnRH analogue can be used diagnostically — resolution of symptoms during ovarian suppression confirms an ovarian-hormone-driven cause." },
    ],
  },

  {
    id: "gtg48-first-line",
    gl: "GTG48",
    condition: "Premenstrual Syndrome",
    setting: "Gynaecology",
    title: "Management — First-Line",
    tags: [
      "pms lifestyle", "pms cbt", "pms ssri", "luteal phase ssri",
      "continuous ssri pms", "exercise pms", "vitamin b6 pms",
    ],
    flowchartId: "GTG48_PMS_LADDER",
    content: [
      { type: "list", items: [
        "Lifestyle measures: regular aerobic exercise, regular meals, reduced caffeine and alcohol, adequate sleep",
        "Cognitive behavioural therapy (CBT) — effective for the psychological symptoms of PMS",
        "Vitamin B6 is used by some as a first-line adjunct, though evidence quality is limited — verify dose against local protocol if prescribed",
      ]},
      { type: "alert", value: "SSRIs are first-line drug treatment for significant psychological symptoms. They can be taken continuously (daily throughout the cycle) or intermittently, restricted to the luteal phase — both strategies are supported, and choice depends on symptom pattern, cycle regularity, and patient preference." },
    ],
  },

  {
    id: "gtg48-hormonal",
    gl: "GTG48",
    condition: "Premenstrual Syndrome",
    setting: "Gynaecology",
    title: "Management — Hormonal Treatment",
    tags: [
      "cocp pms", "drospirenone pms", "continuous cocp pms",
      "transdermal oestrogen pms", "gnrh analogue pms", "add-back hrt pms",
      "ovulation suppression pms",
    ],
    flowchartId: "GTG48_PMS_LADDER",
    content: [
      { type: "text", value: "Where first-line measures are insufficient, hormonal treatment aims to suppress ovulation — PMS does not occur in anovulatory cycles." },
      { type: "subheading", value: "Combined Hormonal Contraception" },
      { type: "list", items: [
        "A drospirenone-containing combined oral contraceptive is a reasonable choice, given its antimineralocorticoid and antiandrogenic properties",
        "Use continuously (running packs back-to-back) rather than with the standard 7-day break — the hormone-free interval is when PMS symptoms recur",
      ]},
      { type: "subheading", value: "Transdermal Oestrogen" },
      { type: "list", items: [
        "Transdermal oestrogen (patch or gel) suppresses ovulation and can relieve PMS symptoms",
        "Requires endometrial protection if the uterus is present — cyclical progestogen or an LNG-IUS (52 mg, Mirena)",
      ]},
      { type: "subheading", value: "GnRH Analogues" },
      { type: "alert", value: "Reserve GnRH analogues for the most severe, refractory symptoms, or for diagnostic use — they are not for routine or first-line use. If used beyond 6 months, give add-back HRT to protect bone density and limit menopausal side effects." },
    ],
  },

  {
    id: "gtg48-surgical",
    gl: "GTG48",
    condition: "Premenstrual Syndrome",
    setting: "Gynaecology",
    title: "Management — Surgical (Last Resort)",
    tags: [
      "hysterectomy pms", "bilateral oophorectomy pms", "bso pms",
      "surgical menopause pms", "gnrh test of cure",
    ],
    content: [
      { type: "alert", value: "Hysterectomy with bilateral salpingo-oophorectomy (BSO) is reserved for the most severe, refractory PMS/PMDD once medical management has failed, or where long-term GnRH analogue treatment would otherwise be needed indefinitely." },
      { type: "list", items: [
        "Do not proceed to surgery without a preceding trial of GnRH analogue — this confirms the diagnosis (symptom response to ovarian suppression) and confirms that HRT will be tolerated afterwards",
        "Surgery is irreversible and requires full counselling, including that HRT will usually be needed afterwards (typically continuous combined or oestrogen-only depending on any residual endometrium) to avoid replacing PMS with surgical menopause symptoms",
        "Consider concurrently if another gynaecological condition (e.g. fibroids, adenomyosis) independently indicates hysterectomy",
      ]},
    ],
  },
];
