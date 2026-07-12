// Sickle Cell Painful Crisis in Pregnancy — acute pathway.
// Original interactive pathway from the BSH guideline (Oteng-Ntim E, et al.
// Management of sickle cell disease in pregnancy. Br J Haematol 2021;194:980-995,
// DOI 10.1111/bjh.17671). Decision support only, not a protocol. Verify locally.

export const BSH_SCD_CRISIS_FLOWCHART = {
  id: "SCD_CRISIS",
  title: "Sickle Cell Painful Crisis in Pregnancy",
  subtitle: "BSH 2021 · assess, analgesia, exclude acute chest syndrome",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Suspected Painful (Vaso-occlusive) Crisis",
      text: "Assess rapidly for complications and precipitants. Involve haematology early.",
      items: [
        "Full observations including oxygen saturations",
        "Look for precipitants: infection, dehydration, hypoxia, cold, over-exertion",
        "Look for complications: acute chest syndrome, acute anaemia, infection, VTE, stroke",
      ],
      next: "analgesia",
    },

    "analgesia": {
      type: "action",
      title: "Prompt Analgesia & Supportive Care",
      text: "Give effective analgesia quickly and reassess frequently.",
      items: [
        "Strong opioid (e.g. morphine or diamorphine) SC or IV for a severe crisis",
        "Avoid pethidine (toxicity and pethidine-associated seizures in SCD)",
        "NSAIDs only as an adjunct between 12 and 31 weeks of gestation",
        "Hydration, keep warm, oxygen if saturations are low, incentive spirometry",
        "Prophylactic LMWH throughout the admission unless contraindicated",
        "Adjuvants: antihistamine for itch, laxative for constipation, antiemetic",
      ],
      next: "acs",
    },

    "acs": {
      type: "decision",
      title: "Acute Chest Syndrome?",
      text: "Fever and/or respiratory symptoms with a new pulmonary infiltrate. Affects up to 10% of pregnant women with SCD.",
      options: [
        { label: "Yes, or strongly suspected", sublabel: "Fever/respiratory symptoms + new infiltrate", next: "chest" },
        { label: "No", sublabel: "Continue crisis management", next: "support" },
      ],
    },

    "chest": {
      type: "alert",
      title: "Acute Chest Syndrome: Medical Emergency",
      text: "Escalate immediately to haematology and critical care.",
      items: [
        "Oxygen, antibiotics and analgesia",
        "Urgent transfusion (simple or exchange), extended-phenotype matched",
        "Continue LMWH; monitor closely",
      ],
      next: "support",
    },

    "support": {
      type: "end",
      title: "Ongoing Crisis Care",
      text: "Continue supportive care and reassess for resolution and complications.",
      items: [
        "Continue analgesia, hydration, warmth and oxygen as needed",
        "Continue LMWH throughout admission",
        "Reassess regularly; involve the multidisciplinary team",
      ],
    },

  },
};
