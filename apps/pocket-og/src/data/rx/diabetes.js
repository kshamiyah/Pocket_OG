// Diabetes in pregnancy, checked against NICE NG3 (diabetes in pregnancy)
// on 7 Oct 2026. NICE gives no insulin infusion regimen, so rates refer to
// local guidelines. The previous cards, built from the local guideline RBH
// GL983, are shelved in diabetes.local-shelved.js.

const NG3 = { label: "NICE NG3", href: "https://www.nice.org.uk/guidance/ng3" };
const NO_NATIONAL_DOSE = "Not given in national guidance: refer to local guidelines";

export const DIABETES_DRUGS = [
  {
    id: "insulin_vrii",
    name: "Insulin (VRII)",
    class: "Variable rate insulin infusion",
    color: "pink",
    routes: [
      {
        type: "iv",
        shortLabel: "IV: labour and birth",
        label: "IV dextrose and insulin infusion: labour and birth",
        dose: NO_NATIONAL_DOSE,
        frequency: "check capillary glucose hourly; keep between 4 and 7 mmol/L",
        notes: "Consider from the onset of established labour in type 1 diabetes (NICE NG3 1.4.11). Use in any diabetes if capillary glucose is not kept between 4 and 7 mmol/L (1.4.12). Monitor capillary glucose every hour during labour and birth (1.4.10).",
      },
    ],
    contraindications: [],
    cautions: [
      "Steroids for fetal lung maturation in insulin-treated diabetes: give additional insulin according to an agreed protocol and monitor closely (NICE NG3 1.3.42)",
      "Pregnant women taking insulin should keep capillary glucose above 4 mmol/L (NICE NG3 1.3.6)",
      "After birth, women with insulin-treated pre-existing diabetes should reduce their insulin immediately and monitor glucose to find the right dose (NICE NG3 1.6.1); hypoglycaemia risk is higher postnatally, especially when breastfeeding (1.6.2)",
    ],
    pregnancySafety: "NICE NG3: rapid-acting insulin analogues (aspart and lispro) have advantages over soluble human insulin in pregnancy (1.3.12); isophane (NPH) insulin is the first choice for long-acting insulin (1.1.23).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/insulin-soluble-human/" },
      NG3,
    ],
  },
  {
    id: "metformin",
    name: "Metformin",
    class: "Biguanide: oral antidiabetic",
    color: "pink",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: diabetes in pregnancy",
        label: "Oral",
        dose: "500 mg once or twice daily, increased in steps of 500 mg at intervals of ≥1 week",
        maxDose: "2 g/day (standard licensed maximum)",
        frequency: "with or after meals",
        notes: "Gestational diabetes: offer metformin if glucose targets are not met with diet and exercise within 1 to 2 weeks (NICE NG3 1.2.19); add insulin if targets are still not met (1.2.21); offer insulin instead if metformin is contraindicated or unacceptable (1.2.20). If fasting glucose is 7.0 mmol/L or more at diagnosis, start insulin straight away, with or without metformin (1.2.22); consider the same at 6.0 to 6.9 mmol/L with complications such as macrosomia or hydramnios (1.2.23).",
      },
    ],
    cautions: [
      "Discontinue if DKA or acute illness develops",
      "Renal function should be checked periodically per standard practice",
    ],
    pregnancySafety: "NICE NG3: may be used as an adjunct or alternative to insulin before and during pregnancy when the likely benefits outweigh the potential for harm (1.1.21). After birth, women with type 2 diabetes who are breastfeeding can resume or continue metformin (1.6.4).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/metformin-hydrochloride/" },
      NG3,
    ],
  },
];
