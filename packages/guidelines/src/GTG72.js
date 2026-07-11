// GTG72 — Care of Women with Obesity in Pregnancy
// (RCOG Green-top Guideline No. 72, 2nd edition, 2018/2019; first edition
// published jointly with CMACE in 2010)

export const GTG72_SECTIONS = [
  {
    id: "gtg72-classification-risks",
    gl: "GTG72",
    condition: "Obesity in Pregnancy",
    setting: "Antenatal",
    title: "Classification & Risks",
    tags: [
      "obesity pregnancy", "bmi classification pregnancy", "class 1 obesity", "class 2 obesity",
      "class 3 obesity", "morbid obesity pregnancy",
    ],
    content: [
      { type: "table",
        headers: ["Class", "BMI (kg/m²)"],
        rows: [
          ["Class I", "30.0–34.9"],
          ["Class II", "35.0–39.9"],
          ["Class III (morbid obesity)", "≥40"],
        ],
      },
      { type: "text", value: "Use booking BMI (calculated from measured, not self-reported, height and weight at booking) to classify and to trigger the pathway below — thresholds matter because several specific recommendations (folic acid dose, anaesthetic referral) are pegged to them directly." },
      { type: "subheading", value: "Maternal risks" },
      { type: "list", items: [
        "Miscarriage, gestational diabetes, pre-eclampsia, venous thromboembolism (VTE is a leading contributor to UK direct maternal deaths, and obesity is present in a large proportion of these).",
        "Higher rate of induction of labour and of caesarean section.",
        "Anaesthetic complications — technically harder regional and general anaesthesia, more difficult venous access.",
        "Postpartum haemorrhage and wound infection.",
      ]},
      { type: "subheading", value: "Fetal/neonatal risks" },
      { type: "list", items: [
        "Stillbirth, congenital anomaly, prematurity.",
        "Macrosomia, with its own downstream risks — shoulder dystocia and operative birth.",
        "Neonatal death.",
      ]},
    ],
  },

  {
    id: "gtg72-antenatal-management",
    gl: "GTG72",
    condition: "Obesity in Pregnancy",
    setting: "Antenatal",
    title: "Antenatal Management",
    tags: [
      "folic acid 5mg", "vitamin d pregnancy", "obesity gdm screening", "consultant led care obesity",
      "anaesthetic referral obesity", "weight management pregnancy",
    ],
    content: [
      { type: "list", items: [
        "Folic acid 5 mg daily (the higher, prescription-only dose) from before conception or as early as possible, if BMI ≥30 — not the standard 400 microgram over-the-counter dose.",
        "Vitamin D 10 micrograms daily throughout pregnancy and while breastfeeding — this applies to all women, but adherence is worth checking explicitly in this group.",
        "Offer consultant-led antenatal care for BMI ≥30 at booking.",
        "Screen for gestational diabetes with an oral glucose tolerance test — obesity is itself a standard indication, in line with GL983.",
        "Refer to an obstetric anaesthetist antenatally for BMI ≥40 — to assess venous access and the likely difficulty of regional/general anaesthesia, and to document an agreed anaesthetic plan for labour and birth in advance rather than working it out acutely.",
        "VTE risk assessment at booking and again on any admission — obesity is one of the weighted factors in the scoring tool (see GL891); thromboprophylaxis dosing itself is often weight-banded.",
      ]},
      { type: "subheading", value: "Weight management advice" },
      { type: "list", items: [
        "Do not recommend weight loss/dieting during pregnancy itself — encourage healthy eating and regular moderate activity instead, in line with general pregnancy nutrition advice.",
        "This is a supportive, non-judgemental conversation, not a target-setting exercise — frame it as reducing risk, not as a weight-loss programme.",
        "Discuss future pregnancy planning opportunistically, including that achieving a lower BMI before a future pregnancy reduces the risks above — but this is a conversation for antenatal or postnatal follow-up, not a condition placed on care in the current pregnancy.",
      ]},
    ],
  },

  {
    id: "gtg72-intrapartum",
    gl: "GTG72",
    condition: "Obesity in Pregnancy",
    setting: "Intrapartum",
    title: "Intrapartum Care",
    tags: [
      "obesity intrapartum care", "manual handling obesity", "fetal scalp electrode",
      "active management third stage obesity", "iv access obesity",
    ],
    content: [
      { type: "list", items: [
        "Establish IV access early in labour — venous access tends to get harder, not easier, once labour is established and time-critical.",
        "Continuous electronic fetal monitoring can be technically difficult to maintain externally — a fetal scalp electrode is a reasonable early option rather than persisting with a poor-quality external trace.",
        "Confirm the anaesthetic plan made antenatally is documented and available to the intrapartum team, particularly for BMI ≥40.",
        "Manual handling and equipment: ensure appropriately rated beds, theatre tables and hoists are available and staff are trained in their use — this protects the woman and staff, and needs planning ahead of an emergency, not during one.",
        "Active management of the third stage is recommended given the increased PPH risk — see GTG52 for the specifics.",
      ]},
    ],
  },

  {
    id: "gtg72-postnatal",
    gl: "GTG72",
    condition: "Obesity in Pregnancy",
    setting: "Postnatal",
    title: "Postnatal Care",
    tags: [
      "postnatal vte prophylaxis obesity", "wound care obesity", "breastfeeding support obesity",
      "bariatric surgery pregnancy",
    ],
    content: [
      { type: "list", items: [
        "Continue VTE risk assessment and thromboprophylaxis into the postnatal period per GL891 — risk doesn't end at delivery.",
        "Extra attention to wound care after caesarean section, given the higher infection risk — clear safety-netting on wound red flags before discharge.",
        "Proactively offer breastfeeding support — obesity is associated with lower breastfeeding initiation and continuation, and support should be offered rather than assumed unnecessary.",
        "Women who have had bariatric surgery need individualised advice on nutrition and supplementation in any future pregnancy, given the malabsorption risk — involve dietetics.",
      ]},
    ],
  },
];
