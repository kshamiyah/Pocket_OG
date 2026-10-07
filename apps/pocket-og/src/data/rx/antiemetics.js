// Antiemetics for nausea and vomiting in pregnancy (NVP) and hyperemesis
// gravidarum (HG), checked against RCOG Green-top Guideline 69 (2024) on
// 7 Oct 2026. Doses are from GTG69 Appendix III, "Recommended antiemetic
// therapies and dosages", which groups drugs as first, second and third line.
// The previous dexamethasone card is shelved in antiemetics.shelved.js.

const GTG69 = { label: "RCOG GTG69 (2024)", href: "https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.17739" };
const NO_NATIONAL_DOSE = "Not given in national guidance: refer to local guidelines";
const ASK_REACTIONS = "Ask about previous adverse reactions to antiemetics; stop promptly if one occurs (RCOG GTG69)";

export const ANTIEMETICS = [
  {
    id: "chlorpromazine",
    name: "Chlorpromazine",
    class: "Phenothiazine antipsychotic",
    color: "violet",
    iconColor: "#BF5AF2",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral / IM / IV",
        label: "Oral, IM or IV: nausea and vomiting in pregnancy (first line)",
        dose: "10–25 mg",
        frequency: "every 4–6 hours",
        notes: "First-line antiemetic in RCOG GTG69 Appendix III (phenothiazine).",
      },
    ],
    contraindications: [
      "CNS depression / comatose states",
      "Bone marrow depression",
      "Phaeochromocytoma",
    ],
    cautions: [
      "Drug-induced extrapyramidal symptoms and oculogyric crises can occur with phenothiazines (RCOG GTG69)",
      "Postural hypotension, particularly after IM administration",
      ASK_REACTIONS,
    ],
    pregnancySafety: "First line for NVP and HG (RCOG GTG69). A Cochrane review reports no increased risk of congenital malformations with first-line antiemetics (GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/chlorpromazine-hydrochloride/" },
      GTG69,
    ],
  },
  {
    id: "corticosteroids_hg",
    name: "Corticosteroids for hyperemesis",
    class: "Hydrocortisone, then prednisolone (third line)",
    color: "amber",
    iconColor: "#FF9F0A",
    routes: [
      {
        type: "iv",
        shortLabel: "IV hydrocortisone",
        label: "IV hydrocortisone: refractory HG (third line)",
        dose: "100 mg",
        frequency: "twice daily",
        notes: "Only once standard therapy, including IV fluids and regular antiemetics, has failed; give in addition to the antiemetics that were helping (RCOG GTG69).",
      },
      {
        type: "oral",
        shortLabel: "Oral prednisolone",
        label: "Oral prednisolone: once improving",
        dose: "40–50 mg",
        frequency: "once daily, tapered by 5–10 mg per week to the lowest dose that controls symptoms",
        notes: "Convert from IV hydrocortisone once clinical improvement occurs. In most cases prednisolone is continued until the gestation at which HG would have resolved; in some extreme cases until birth (RCOG GTG69).",
      },
    ],
    contraindications: [],
    cautions: [
      "Monitor blood pressure and screen for gestational diabetes (RCOG GTG69)",
    ],
    pregnancySafety: "Third line for HG (RCOG GTG69). First-trimester corticosteroid use is not associated with an increase in congenital malformations overall, or in orofacial clefting, cardiac defects or hypospadias, though data are more limited than for other antiemetics (GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/prednisolone/" },
      GTG69,
    ],
  },
  {
    id: "cyclizine",
    name: "Cyclizine",
    class: "Antihistamine antiemetic",
    color: "green",
    iconColor: "#34C759",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral / IM / IV",
        label: "Oral, IM or IV: nausea and vomiting in pregnancy (first line)",
        dose: "50 mg",
        frequency: "8-hourly",
        notes: "First-line antiemetic in RCOG GTG69 Appendix III (H1 antihistamine).",
      },
    ],
    contraindications: [
      "Urinary retention",
      "Closed-angle glaucoma",
    ],
    cautions: [
      "Anticholinergic effects: dry mouth, blurred vision, urinary retention",
      ASK_REACTIONS,
    ],
    pregnancySafety: "First line for NVP and HG (RCOG GTG69). A Cochrane review reports no increased risk of congenital malformations with first-line antiemetics (GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/cyclizine/" },
      GTG69,
    ],
  },
  {
    id: "domperidone",
    name: "Domperidone",
    class: "Dopamine antagonist",
    color: "blue",
    iconColor: "#0A84FF",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral: nausea and vomiting in pregnancy (second line)",
        dose: "10 mg",
        frequency: "8-hourly",
        notes: "Second-line antiemetic in RCOG GTG69 Appendix III.",
      },
      {
        type: "rectal",
        shortLabel: "PR",
        label: "Rectal: nausea and vomiting in pregnancy (second line)",
        dose: "30 mg",
        frequency: "12-hourly",
        notes: "Second-line antiemetic in RCOG GTG69 Appendix III.",
      },
    ],
    contraindications: [],
    cautions: [
      ASK_REACTIONS,
    ],
    pregnancySafety: "Second line for NVP and HG (RCOG GTG69 Appendix III).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/domperidone/" },
      GTG69,
    ],
  },
  {
    id: "doxylamine-pyridoxine",
    name: "Doxylamine/Pyridoxine (Xonvea®)",
    class: "Antihistamine + vitamin B6 combination",
    color: "pink",
    iconColor: "#FF375F",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral: nausea and vomiting in pregnancy (first line)",
        dose: "20 mg/20 mg (2 tablets of 10 mg/10 mg) at night",
        frequency: "if required, add 10 mg/10 mg in the morning and 10 mg/10 mg at lunchtime",
        maxDose: "4 tablets/day",
        notes: "Doses from RCOG GTG69 Appendix III. Modified-release tablets: swallow whole, do not crush or chew.",
      },
    ],
    contraindications: [
      "Hypersensitivity to antihistamines or pyridoxine",
      "Concurrent use of MAOIs (prolongs/intensifies antihistamine effects)",
    ],
    cautions: [
      "Anticholinergic effects: dry mouth, blurred vision, urinary retention",
      "Caution in asthma, narrow-angle glaucoma, and bladder-outflow obstruction",
      ASK_REACTIONS,
    ],
    pregnancySafety: "First line for NVP and HG, and the only licensed treatment of NVP in the UK (RCOG GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/doxylamine-with-pyridoxine/" },
      GTG69,
    ],
  },
  {
    id: "metoclopramide",
    name: "Metoclopramide",
    class: "Dopamine antagonist / prokinetic",
    color: "blue",
    iconColor: "#007AFF",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral / IV / IM / SC",
        label: "Oral, IV, IM or SC: nausea and vomiting in pregnancy (second line)",
        dose: "5–10 mg",
        frequency: "8-hourly",
        maxDose: "30 mg in 24 hr or 0.5 mg/kg in 24 hr, whichever is lower (EMA, quoted in RCOG GTG69)",
        notes: "Second line because of the risk of extrapyramidal effects. Give IV doses by slow bolus over at least 3 min. Can be used alone or with other antiemetics. The EMA advises a maximum of 5 days, but GTG69's authors advise it can be continued beyond 5 days in women who gain symptomatic relief (RCOG GTG69).",
      },
    ],
    contraindications: [
      "Previous tardive dyskinesia or extrapyramidal disorders",
      "Phaeochromocytoma",
      "GI obstruction or perforation",
    ],
    cautions: [
      "Extrapyramidal disorders and tardive dyskinesia, particularly in young people (EMA review, quoted in RCOG GTG69)",
      "IV: slow bolus over at least 3 min to reduce dystonic reactions (RCOG GTG69)",
      ASK_REACTIONS,
    ],
    pregnancySafety: "Safe and effective; second line because of extrapyramidal risk (RCOG GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/metoclopramide-hydrochloride/" },
      GTG69,
    ],
  },
  {
    id: "ondansetron",
    name: "Ondansetron",
    class: "5-HT3 antagonist",
    color: "indigo",
    iconColor: "#5856D6",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral: nausea and vomiting in pregnancy (second line)",
        dose: "4 mg 8-hourly or 8 mg 12-hourly",
        frequency: "8- or 12-hourly",
        notes: "Second line: its use should not be discouraged if first-line antiemetics are ineffective (RCOG GTG69). May need laxatives if constipation develops.",
      },
      {
        type: "iv",
        shortLabel: "IV",
        label: "IV: when oral not tolerated",
        dose: "8 mg",
        frequency: "over 15 min, 12-hourly",
        notes: "Dose from RCOG GTG69 Appendix III.",
      },
      {
        type: "rectal",
        shortLabel: "PR",
        label: "Rectal",
        dose: "16 mg",
        frequency: "daily",
        notes: "Dose from RCOG GTG69 Appendix III.",
      },
    ],
    contraindications: [
      "Congenital long QT syndrome",
      "Concurrent use of other QT-prolonging drugs",
    ],
    cautions: [
      "First trimester: a very small increase in the absolute risk of orofacial clefting, about 3 more per 10 000 births (14 versus 11 per 10 000); balance against the risks of poorly managed HG (RCOG GTG69)",
      "May need laxatives if constipation develops (RCOG GTG69)",
      ASK_REACTIONS,
    ],
    pregnancySafety: "Safe and effective second-line antiemetic (RCOG GTG69). Women can be reassured that the increase in absolute risk of orofacial clefting with first-trimester use is very small.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/ondansetron/" },
      GTG69,
    ],
  },
  {
    id: "prochlorperazine",
    name: "Prochlorperazine",
    class: "Phenothiazine antiemetic",
    color: "purple",
    iconColor: "#AF52DE",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral / buccal",
        label: "Oral or buccal: nausea and vomiting in pregnancy (first line)",
        dose: "5–10 mg oral, or 3 mg buccal",
        frequency: "6–8-hourly",
        notes: "First-line antiemetic in RCOG GTG69 Appendix III (phenothiazine).",
      },
      {
        type: "im",
        shortLabel: "IM / IV",
        label: "IM or IV: when oral not tolerated",
        dose: "12.5 mg",
        frequency: "8-hourly",
        notes: "Dose from RCOG GTG69 Appendix III.",
      },
      {
        type: "rectal",
        shortLabel: "PR",
        label: "Rectal",
        dose: "25 mg",
        frequency: "daily",
        notes: "Dose from RCOG GTG69 Appendix III.",
      },
    ],
    contraindications: [
      "Severe CNS depression",
      "Phaeochromocytoma",
      "Agranulocytosis",
    ],
    cautions: [
      "Drug-induced extrapyramidal symptoms and oculogyric crises can occur with phenothiazines (RCOG GTG69)",
      "Avoid in epilepsy: lowers seizure threshold",
      ASK_REACTIONS,
    ],
    pregnancySafety: "First line for NVP and HG (RCOG GTG69). A Cochrane review reports no increased risk of congenital malformations with first-line antiemetics (GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/prochlorperazine/" },
      GTG69,
    ],
  },
  {
    id: "promethazine",
    name: "Promethazine",
    class: "Antihistamine / phenothiazine",
    color: "teal",
    iconColor: "#30B0C7",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral / IM / IV",
        label: "Oral, IM or IV: nausea and vomiting in pregnancy (first line)",
        dose: "12.5–25 mg",
        frequency: "every 4–8 hours",
        notes: "First-line antiemetic in RCOG GTG69 Appendix III (H1 antihistamine).",
      },
    ],
    contraindications: [
      "Neonates / infants under 2 years",
      "CNS depression / comatose states",
    ],
    cautions: [
      "IV use: risk of severe tissue injury at the injection site",
      "Anticholinergic effects: dry mouth, blurred vision, urinary retention",
      ASK_REACTIONS,
    ],
    pregnancySafety: "First line for NVP and HG (RCOG GTG69). A Cochrane review reports no increased risk of congenital malformations with first-line antiemetics (GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/promethazine-hydrochloride/" },
      GTG69,
    ],
  },
  {
    id: "thiamine",
    name: "Thiamine (vitamin B1)",
    class: "Vitamin: Wernicke's encephalopathy prevention",
    color: "orange",
    iconColor: "#FF9500",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral: women admitted with vomiting",
        dose: "100 mg",
        frequency: "three times daily",
        notes: "For all women admitted with vomiting or severely reduced dietary intake, especially before dextrose or parenteral nutrition (RCOG GTG69).",
      },
      {
        type: "iv",
        shortLabel: "IV (Pabrinex®)",
        label: "IV: as part of vitamin B complex (Pabrinex®)",
        dose: NO_NATIONAL_DOSE,
        notes: "The IV alternative to oral thiamine, as part of vitamin B complex (RCOG GTG69). Give before dextrose or parenteral nutrition.",
      },
    ],
    contraindications: [],
    cautions: [
      "Give before dextrose or parenteral nutrition, to prevent Wernicke's encephalopathy (RCOG GTG69)",
    ],
    pregnancySafety: "Recommended for all women admitted with vomiting or severely reduced dietary intake (RCOG GTG69).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/thiamine/" },
      GTG69,
    ],
  },
];
