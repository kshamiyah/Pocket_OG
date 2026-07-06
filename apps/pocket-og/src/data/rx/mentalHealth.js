export const MENTAL_HEALTH_DRUGS = [
  {
    id: "sertraline",
    name: "Sertraline",
    class: "SSRI antidepressant",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral",
        dose: "50 mg once daily initially",
        maxDose: "200 mg/day",
        frequency: "increased in steps of 50 mg at intervals of ≥1 week if needed",
        notes: "CG192: preferred first-line SSRI in pregnancy and breastfeeding — extensive safety data and the lowest placental transfer of the SSRIs.",
      },
    ],
    cautions: [
      "Neonatal adaptation syndrome (jitteriness, feeding difficulty, irritability) is usually self-limiting",
      "Small increased risk of PPHN with late-pregnancy SSRI use — this is not a reason to stop treatment",
      "Inform neonatology of maternal SSRI use before delivery",
    ],
    pregnancySafety: "First-line SSRI choice in pregnancy and breastfeeding (CG192).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/sertraline/" },
      { label: "NICE CG192", href: "https://www.nice.org.uk/guidance/cg192/resources/antenatal-and-postnatal-mental-health-clinical-management-and-service-guidance-pdf-35109869806789" },
    ],
  },
  {
    id: "fluoxetine",
    name: "Fluoxetine",
    class: "SSRI antidepressant",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral",
        dose: "20 mg once daily initially",
        maxDose: "60 mg/day",
        frequency: "reviewed and titrated per response",
        notes: "CG192: second-choice SSRI in pregnancy — its long half-life increases neonatal exposure. Compatible with breastfeeding.",
      },
    ],
    cautions: [
      "Long half-life increases neonatal drug exposure compared with sertraline",
      "Neonatal adaptation syndrome and small increased PPHN risk apply as for other SSRIs — not a reason to stop treatment",
    ],
    pregnancySafety: "Second-choice SSRI in pregnancy after sertraline (CG192).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/fluoxetine/" },
      { label: "NICE CG192", href: "https://www.nice.org.uk/guidance/cg192/resources/antenatal-and-postnatal-mental-health-clinical-management-and-service-guidance-pdf-35109869806789" },
    ],
  },
  {
    id: "lithium",
    name: "Lithium",
    class: "Mood stabiliser",
    color: "purple",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral — level-guided",
        label: "Oral — individualised to serum level",
        dose: "Individualised, specialist-guided — not a fixed starting dose",
        frequency: "target serum level 0.4–0.6 mmol/L in pregnancy",
        notes: "CG192: monitor levels closely; fetal cardiac scan at 18–20 weeks; withhold in labour and restart postnatally.",
      },
    ],
    contraindications: [],
    cautions: [
      "Teratogenic — small absolute risk of Ebstein's anomaly",
      "Requires specialist perinatal psychiatry input for all dosing decisions",
      "Withhold during labour and restart postnatally",
    ],
    pregnancySafety: "Teratogenic risk requires specialist monitoring, but untreated severe mood disorder also carries significant risk — the decision to continue is individualised (CG192).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/lithium-carbonate/" },
      { label: "NICE CG192", href: "https://www.nice.org.uk/guidance/cg192/resources/antenatal-and-postnatal-mental-health-clinical-management-and-service-guidance-pdf-35109869806789" },
    ],
  },
];
