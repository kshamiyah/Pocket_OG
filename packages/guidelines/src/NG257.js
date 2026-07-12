// NG257 — Fertility Problems: Assessment and Treatment
// NICE Guideline NG257 (31 March 2026) — replaces CG156 (February 2013)

export const NG257_SECTIONS = [
  {
    id: "ng257-initial-assessment",
    gl: "NG257",
    condition: "Subfertility",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Defining Infertility & Initial Assessment",
    tags: [
      "subfertility", "infertility", "ng257", "nice fertility",
      "when to investigate infertility", "fertility assessment",
    ],
    content: [
      { type: "text", value: "NICE NG257 (March 2026) covers assessment and treatment for people with fertility problems, replacing the earlier CG156. Recommendations on PCOS-specific ovulatory dysfunction have been removed from this guideline pending a dedicated NICE PCOS guideline — see the separate PCOS guidance." },
      { type: "alert", value: "Offer clinical assessment and investigation after 1 year of unprotected vaginal intercourse without conception, where there is no known or suspected cause. Investigate earlier where there is a known risk factor — for example age 36 or over, amenorrhoea, previous pelvic surgery or infection, or a known cause in either partner." },
      { type: "list", items: [
        "Take a full history from both partners: cycle regularity, coital frequency, previous pregnancies, past pelvic infection or surgery, relevant medical and drug history, and lifestyle factors (smoking, alcohol, BMI)",
        "A BMI of 30 or more is associated with a longer time to conception; weight loss improves the chance of conception in women who are not ovulating",
      ]},
    ],
  },

  {
    id: "ng257-investigations",
    gl: "NG257",
    condition: "Subfertility",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Investigations",
    tags: [
      "semen analysis", "who semen reference values", "mid luteal progesterone",
      "ovulation confirmation", "hsg", "hycosy", "tubal patency test",
    ],
    content: [
      { type: "subheading", value: "Semen Analysis" },
      { type: "table", headers: ["Parameter", "WHO reference value"], rows: [
        ["Volume", "≥1.4 ml"],
        ["pH", "≥7.2"],
        ["Sperm concentration", "≥16 million/ml"],
      ]},
      { type: "text", value: "Repeat an abnormal semen analysis to confirm, ideally around 3 months later to allow a full cycle of spermatogenesis, unless the result is grossly abnormal (in which case repeat sooner and refer for specialist assessment)." },
      { type: "subheading", value: "Confirming Ovulation" },
      { type: "list", items: [
        "Mid-luteal phase serum progesterone (approximately 7 days before the expected next period) confirms ovulation in women with regular cycles",
        "Investigate the cause of anovulation (e.g. thyroid disease, hyperprolactinaemia, PCOS) in women with irregular or absent periods",
      ]},
      { type: "subheading", value: "Tubal Patency" },
      { type: "list", items: [
        "Hysterosalpingography (HSG) or hysterosalpingo-contrast sonography (HyCoSy) — first-line in women without comorbidities affecting their choice of management",
        "Laparoscopy and dye test where there is a higher likelihood of tubal or other pelvic pathology (e.g. history of pelvic infection, endometriosis, previous pelvic surgery)",
      ]},
    ],
  },

  {
    id: "ng257-unexplained-ivf",
    gl: "NG257",
    condition: "Subfertility",
    setting: "Gynaecology / Reproductive Medicine",
    title: "Unexplained Infertility & IVF Pathway",
    tags: [
      "unexplained infertility", "ivf", "in vitro fertilisation", "ivf referral",
      "clomiphene unexplained infertility", "ovarian stimulation unexplained infertility",
    ],
    content: [
      { type: "alert", value: "Do not offer oral ovarian stimulation agents (clomiphene citrate, anastrozole or letrozole) to women with unexplained infertility — they do not improve the chance of a live birth in this group and increase the chance of multiple pregnancy." },
      { type: "list", items: [
        "Unexplained infertility: normal semen analysis, confirmed ovulation, and patent tubes, with no conception after a full assessment",
        "Offer IVF for unexplained infertility if conception has not occurred after 2 years of trying (including any time spent under investigation)",
        "IVF is offered directly, without a trial of stimulated intrauterine insemination, for unexplained infertility",
      ]},
      { type: "subheading", value: "Referral Principles" },
      { type: "list", items: [
        "Absolute indications for earlier IVF referral: bilateral tubal blockage, severe male factor infertility, or where ovulation induction/IUI is inappropriate or has already failed",
        "NHS funding criteria for IVF (number of cycles, age limits, BMI thresholds) are set locally by integrated care boards — verify against local protocol before counselling on access",
      ]},
    ],
  },
];
