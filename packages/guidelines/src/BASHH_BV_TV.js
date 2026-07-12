// BASHH_BV_TV — UK National Guideline for the Management of Bacterial
// Vaginosis (2012) and UK National Guideline for the Management of
// Trichomonas vaginalis (2021, updating the 2014 edition)

export const BASHH_BV_TV_SECTIONS = [
  {
    id: "bashh-bv-diagnosis",
    gl: "BASHH_BV_TV",
    condition: "Bacterial Vaginosis",
    setting: "Sexual Health",
    title: "Bacterial Vaginosis — Diagnosis",
    tags: [
      "bacterial vaginosis", "bv", "bashh_bv_tv", "bashh", "amsel criteria",
      "clue cells", "whiff test", "vaginal discharge differential",
    ],
    content: [
      { type: "text", value: "Bacterial vaginosis (BV) is a disturbance of normal vaginal flora — loss of lactobacilli and overgrowth of anaerobes — rather than a sexually transmitted infection in the conventional sense, though it is more common in sexually active women." },
      { type: "subheading", value: "Diagnosis — Amsel Criteria" },
      { type: "text", value: "Diagnose with at least 3 of the following 4 features:" },
      { type: "list", items: [
        "Thin, homogeneous, white/grey vaginal discharge",
        "Vaginal pH >4.5",
        "Positive 'whiff test' — fishy odour on adding 10% potassium hydroxide",
        "Clue cells on microscopy (≥20% of epithelial cells)",
      ]},
      { type: "subheading", value: "Differentiating Causes of Vaginal Discharge" },
      { type: "table", headers: ["Feature", "BV", "Trichomonas", "Candida"], rows: [
        ["Discharge", "Thin, white/grey, fishy odour", "Thin, frothy, offensive", "Thick, white, 'cottage cheese', usually odourless"],
        ["Vaginal pH", ">4.5", ">4.5", "Usually ≤4.5"],
        ["Itch/irritation", "Uncommon", "Common", "Prominent"],
        ["Key finding", "Clue cells, positive whiff test", "Motile trophozoites; strawberry cervix (rare)", "Pseudohyphae/spores on microscopy"],
      ]},
    ],
  },

  {
    id: "bashh-bv-treatment",
    gl: "BASHH_BV_TV",
    condition: "Bacterial Vaginosis",
    setting: "Sexual Health",
    title: "Bacterial Vaginosis — Treatment & Recurrence",
    tags: [
      "metronidazole bv", "bv pregnancy", "recurrent bacterial vaginosis",
      "bv relapse",
    ],
    content: [
      { type: "alert", value: "Metronidazole 400 mg orally twice daily for 7 days is first-line — this gives fewer relapses at 4 weeks than the alternative single 2 g dose, though the single dose can help with adherence where that is a concern." },
      { type: "list", items: [
        "Topical alternatives: intravaginal metronidazole 0.75% gel once daily for 5 days, or clindamycin 2% cream at night for 7 days — clindamycin cream is particularly useful in the first trimester of pregnancy",
        "Treat symptomatic women; treating asymptomatic BV in pregnancy to prevent preterm birth is not routinely recommended outside of specific risk groups",
        "BV in pregnancy is associated with preterm birth, prelabour rupture of membranes and low birthweight — a low threshold to treat symptomatic infection is appropriate",
        "Oral cure rates are 70–80%",
      ]},
      { type: "subheading", value: "Recurrent BV" },
      { type: "text", value: "Recurrence within 3 months is common (up to half of women). For frequent relapse:" },
      { type: "list", items: [
        "Review contributing factors — vaginal douching, receptive oral sex, an intrauterine device, and smoking are all associated with recurrence",
        "Consider a longer or repeated course of the same regimen before switching agents",
        "BV is not an STI in the conventional sense, so partner treatment is not routinely recommended, including for female partners — though the evidence here continues to evolve",
      ]},
    ],
  },

  {
    id: "bashh-tv-diagnosis",
    gl: "BASHH_BV_TV",
    condition: "Trichomonas Vaginalis",
    setting: "Sexual Health",
    title: "Trichomonas Vaginalis — Diagnosis",
    tags: [
      "trichomonas vaginalis", "trichomoniasis", "strawberry cervix",
      "tv infection", "naat trichomonas",
    ],
    content: [
      { type: "text", value: "Trichomonas vaginalis (TV) is a sexually transmitted protozoan infection. The BASHH UK national guideline was updated in 2021." },
      { type: "list", items: [
        "Presentation: offensive, thin, frothy vaginal discharge, vulval irritation, dysuria; 'strawberry cervix' (punctate haemorrhages) is a classic but uncommon finding (~2%)",
        "Can be asymptomatic — test if a partner is diagnosed, or opportunistically alongside other STI testing",
        "Diagnosis: NAAT (preferred, most sensitive) or wet-mount microscopy for motile trophozoites (rapid but less sensitive)",
        "Screen for other STIs concurrently — TV is often found alongside other infections",
      ]},
    ],
  },

  {
    id: "bashh-tv-treatment",
    gl: "BASHH_BV_TV",
    condition: "Trichomonas Vaginalis",
    setting: "Sexual Health",
    title: "Trichomonas Vaginalis — Treatment & Partner Notification",
    tags: [
      "metronidazole trichomonas", "trichomonas pregnancy",
      "trichomonas partner notification",
    ],
    content: [
      { type: "alert", value: "Metronidazole 400–500 mg orally twice daily for 7 days is the preferred regimen (the 2021 update moved away from the older single 2 g dose, which now has a higher relapse rate at test of cure) — a single 2 g dose remains an alternative where adherence to a 7-day course is a concern." },
      { type: "list", items: [
        "Pregnancy: avoid the high-dose single 2 g regimen; the 7-day lower-dose course is preferred",
        "Partner notification: treat all partners presumptively, regardless of their own test result, given the difficulty of reliably excluding infection on a single specimen",
        "TV in pregnancy is associated with preterm birth and low birthweight, supporting prompt treatment of symptomatic infection",
        "Advise abstinence until both the woman and her partner(s) have completed treatment",
      ]},
    ],
  },
];
