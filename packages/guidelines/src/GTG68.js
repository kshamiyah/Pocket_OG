// GTG68 — Epilepsy in Pregnancy
// (RCOG Green-top Guideline No. 68, June 2016)

export const GTG68_SECTIONS = [
  {
    id: "gtg68-preconception",
    gl: "GTG68",
    condition: "Epilepsy in Pregnancy",
    setting: "Preconception / Antenatal",
    title: "Preconception Counselling & Antiepileptic Drug Optimisation",
    tags: [
      "epilepsy preconception", "aed optimisation", "epilepsy folic acid",
      "epilepsy seizure risk pregnancy", "antiepileptic drug pregnancy",
    ],
    content: [
      { type: "alert", value: "Around two-thirds of women with epilepsy will not have any deterioration in seizure control during pregnancy — reassure with this, but individualise, since a minority do worsen and a small number of seizure types (especially with poor pre-pregnancy control) carry real risk to both mother and baby." },
      { type: "list", items: [
        "Review AED regimen before conception wherever possible — aim for monotherapy at the lowest effective dose, since polytherapy and higher doses carry greater teratogenic risk.",
        "Minimise or avoid sodium valproate in any woman who could become pregnant — see the Valproate Pregnancy Prevention Programme section below.",
        "Only change a well-established, effective AED regimen after specialist evaluation of the trade-off between teratogenic risk and the risk of destabilising seizure control — an unplanned switch that triggers seizures is not a safer outcome.",
        "Folic acid 5 mg daily (the higher, prescription-only dose) from before conception, continued until at least the end of the first trimester.",
        "Offer a detailed anomaly scan in line with the national fetal anomaly screening programme standards.",
      ]},
    ],
  },

  {
    id: "gtg68-valproate-ppp",
    gl: "GTG68",
    condition: "Epilepsy in Pregnancy",
    setting: "Preconception",
    title: "Valproate & the Pregnancy Prevention Programme",
    tags: [
      "valproate pregnancy", "valproate pregnancy prevention programme", "valproate ppp",
      "sodium valproate teratogenic", "mhra valproate",
    ],
    content: [
      { type: "alert", value: "Sodium valproate is contraindicated in women and girls of childbearing potential unless the conditions of the MHRA Pregnancy Prevention Programme (PPP) are met and no other treatment is effective or tolerated — this is a regulatory requirement, not just a clinical preference." },
      { type: "subheading", value: "PPP requirements" },
      { type: "list", items: [
        "Annual specialist (neurology) review.",
        "Annual signed risk acknowledgement form, confirming the woman has been informed of the risks.",
        "Highly effective contraception (failure rate <1%) maintained throughout treatment, reviewed at each specialist visit.",
      ]},
      { type: "subheading", value: "Why the risk is treated so seriously" },
      { type: "text", value: "In-utero valproate exposure is associated with major congenital malformation and, separately, with neurodevelopmental impairment (affecting communication, language and behaviour) — the neurodevelopmental risk occurs across a wider dose range than the malformation risk and is not limited to women who have a visibly affected pregnancy scan." },
      { type: "text", value: "If a woman taking valproate is already pregnant, do not stop it abruptly without specialist input — an uncontrolled switch or withdrawal seizure carries its own immediate risk. Involve neurology urgently to plan the safest way forward." },
    ],
  },

  {
    id: "gtg68-antenatal-monitoring",
    gl: "GTG68",
    condition: "Epilepsy in Pregnancy",
    setting: "Antenatal",
    title: "Antenatal Monitoring & Joint Care",
    tags: [
      "epilepsy joint clinic", "aed level monitoring pregnancy", "lamotrigine pregnancy",
      "levetiracetam pregnancy", "epilepsy specialist referral",
    ],
    content: [
      { type: "list", items: [
        "Care jointly with an epilepsy specialist (neurologist or epilepsy nurse specialist) or a joint obstetric-neurology clinic — not obstetric care alone.",
        "Refer promptly for specialist review if seizures are poorly controlled, or if a dose change is being considered.",
      ]},
      { type: "alert", value: "Clearance of lamotrigine and levetiracetam rises substantially in pregnancy — levels can fall to a fraction of the pre-pregnancy baseline on an unchanged dose, which can silently erode seizure control through the second and third trimester." },
      { type: "list", items: [
        "Monitor drug levels at the start of each trimester and again in the final month for women on lamotrigine, levetiracetam, oxcarbazepine, or topiramate — these are the AEDs with the most marked and least predictable pregnancy-related clearance changes.",
        "Dose increases through pregnancy are common and expected for these drugs — anticipate this rather than only reacting to breakthrough seizures.",
        "After birth, clearance reverts towards the pre-pregnancy rate over days to weeks — plan a proactive postnatal dose reduction rather than waiting for signs of toxicity (sedation, ataxia, diplopia).",
      ]},
    ],
  },

  {
    id: "gtg68-intrapartum-postnatal",
    gl: "GTG68",
    condition: "Epilepsy in Pregnancy",
    setting: "Intrapartum / Postnatal",
    title: "Labour, Birth & Postnatal Safety",
    tags: [
      "seizure in labour", "epilepsy delivery planning", "epilepsy breastfeeding",
      "epilepsy safety advice", "sleep deprivation seizure trigger", "vitamin k baby",
    ],
    flowchartId: "GTG68_SEIZURE",
    content: [
      { type: "list", items: [
        "Most women with well-controlled epilepsy can plan a normal vaginal birth in a standard obstetric unit — epilepsy alone is not an indication for caesarean section or induction.",
        "Continue the usual AED regimen through labour; sleep deprivation and missed doses are recognised seizure triggers, both of which labour can provoke — keep doses on schedule.",
        "A seizure in labour is managed the same as any other seizure: protect the airway, left lateral position, benzodiazepine if prolonged, and continuous monitoring — involve anaesthetic and neonatal teams early.",
        "Give the baby the standard neonatal vitamin K regardless of maternal AED — this is routine practice, not specific to enzyme-inducing AEDs.",
        "Breastfeeding is encouraged and is compatible with the great majority of AEDs — discuss the specific regimen rather than assuming any AED is a reason to avoid it.",
      ]},
      { type: "subheading", value: "Practical safety advice to give before discharge" },
      { type: "list", items: [
        "Shower rather than bathe alone, and avoid bathing the baby alone, if seizure control is uncertain.",
        "Change and feed the baby on the floor or on a low surface rather than a bed or sofa edge, to reduce injury risk if a seizure occurs.",
        "Prioritise sleep and share night feeds where possible — sleep deprivation is a modifiable trigger, not an inevitable side effect of new parenthood to just push through.",
      ]},
    ],
  },
];
