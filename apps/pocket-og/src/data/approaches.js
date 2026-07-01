// Clinical approach cards — symptom-led triage syntheses (cross-source, not a
// single guideline). Searchable; each links to its interactive flowchart.
export const APPROACH_SECTIONS = [
  {
    id: "approach-abdo-pain",
    gl: "ABDO",
    condition: "Clinical Approach",
    setting: "Triage — Abdominal Pain",
    title: "Abdominal Pain in Pregnancy",
    flowchartId: "ABDO_TRIAGE",
    tags: [
      "abdominal pain", "abdo pain", "tummy pain", "stomach pain", "abdominal pain pregnancy",
      "pain in pregnancy", "triage abdominal pain", "ruq pain", "epigastric pain",
      "appendicitis pregnancy", "abruption", "differential abdominal pain", "belly pain",
    ],
    content: [
      { type: "text", value: "A triage approach to abdominal pain in pregnancy — screen for emergencies first, then stratify by gestation. Open the flowchart to step through it." },
      { type: "alert", value: "Exclude the emergencies first: abruption, uterine rupture, severe pre-eclampsia/HELLP, ectopic (early pregnancy) and sepsis. Do not attribute pain to pregnancy until serious causes are excluded." },
      { type: "subheading", value: "Differential by gestation" },
      { type: "list", items: [
        "< 12 weeks: ectopic (exclude first), miscarriage, ovarian cyst/torsion, UTI, appendicitis",
        "12–24 weeks: appendicitis, torsion, UTI/pyelonephritis, fibroid degeneration, round-ligament pain",
        "≥ 24 weeks: labour/preterm labour, abruption, pre-eclampsia/HELLP, uterine rupture; plus appendicitis, UTI, cholecystitis",
      ]},
    ],
  },
];
