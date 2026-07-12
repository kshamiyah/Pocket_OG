// BASHH_CT — UK National Guideline for the Management of Chlamydia trachomatis
// BASHH 2015, updated September 2018 (treatment update)

export const BASHH_CT_SECTIONS = [
  {
    id: "bashh-ct-overview",
    gl: "BASHH_CT",
    condition: "Chlamydia",
    setting: "Sexual Health",
    title: "Chlamydia — Overview & Diagnosis",
    tags: [
      "chlamydia", "chlamydia trachomatis", "bashh_ct", "bashh",
      "naat chlamydia", "chlamydia screening", "chlamydia symptoms",
    ],
    content: [
      { type: "text", value: "The BASHH UK national guideline (2015, treatment updated September 2018) covers the management of Chlamydia trachomatis, the most commonly diagnosed bacterial STI in the UK." },
      { type: "list", items: [
        "Often asymptomatic — routine opportunistic screening (e.g. National Chlamydia Screening Programme, under-25s) detects most cases",
        "Women: may cause vaginal discharge, post-coital or intermenstrual bleeding, pelvic pain, or dysuria; untreated infection is a cause of PID, tubal factor infertility and ectopic pregnancy",
        "Diagnosis: nucleic acid amplification test (NAAT) on a vulvovaginal swab (self-taken is acceptable) or first-catch urine",
        "Test all sites relevant to sexual history (rectal, pharyngeal) — infection at extragenital sites is commonly asymptomatic",
      ]},
    ],
  },

  {
    id: "bashh-ct-treatment",
    gl: "BASHH_CT",
    condition: "Chlamydia",
    setting: "Sexual Health",
    title: "Treatment",
    tags: [
      "doxycycline chlamydia", "azithromycin chlamydia", "chlamydia treatment",
      "chlamydia pregnancy treatment", "chlamydia test of cure",
    ],
    content: [
      { type: "alert", value: "Doxycycline 100 mg twice daily for 7 days is first-line for uncomplicated urogenital, pharyngeal and rectal infection — this replaced azithromycin as first-line after rising azithromycin resistance (2018 update)." },
      { type: "list", items: [
        "Pregnancy and breastfeeding: doxycycline is contraindicated — use azithromycin 1 g single dose, or an alternative per current BASHH guidance/local protocol",
        "Test of cure is recommended around 5 weeks after treatment for pregnant women, and for rectal infection (7 days after treatment) and pharyngeal infection (12 days after treatment), given the higher chance of treatment failure at these sites/in this group",
        "Partner notification: trace and treat all sexual partners from the preceding 4 weeks (asymptomatic index case) or since the onset of symptoms if longer; advise abstinence until both partners have completed treatment (or 7 days after a single-dose regimen)",
      ]},
    ],
  },

  {
    id: "bashh-ct-complications-lgv",
    gl: "BASHH_CT",
    condition: "Chlamydia",
    setting: "Sexual Health",
    title: "Complications & Lymphogranuloma Venereum (LGV)",
    tags: [
      "chlamydia complications", "pid chlamydia", "epididymitis chlamydia",
      "reactive arthritis chlamydia", "lgv", "lymphogranuloma venereum",
      "rectal chlamydia lgv", "neonatal chlamydia conjunctivitis",
    ],
    content: [
      { type: "subheading", value: "Complications of Untreated Infection" },
      { type: "list", items: [
        "Pelvic inflammatory disease (PID), and downstream tubal factor infertility and ectopic pregnancy risk",
        "Epididymo-orchitis in men",
        "Sexually acquired reactive arthritis (formerly Reiter's syndrome) — an immune-mediated arthritis following genital infection",
        "Neonatal conjunctivitis or pneumonia if acquired at birth from an untreated maternal infection — a further reason to test and treat promptly in pregnancy",
      ]},
      { type: "alert", value: "LGV is a distinct, more invasive serovar of Chlamydia trachomatis, seen predominantly in men who have sex with men, presenting as proctitis (rectal pain, discharge, tenesmus) that can mimic inflammatory bowel disease, or inguinal lymphadenopathy." },
      { type: "list", items: [
        "LGV requires a longer course than standard chlamydia — doxycycline 100 mg twice daily for 21 days once confirmed",
        "Suspect LGV in anyone with symptomatic proctitis and a positive rectal chlamydia NAAT — request specific LGV testing on the sample",
        "Partner notification for LGV extends further back — trace and offer presumptive treatment to partners from the preceding 60 days",
      ]},
    ],
  },

  {
    id: "bashh-ct-screening",
    gl: "BASHH_CT",
    condition: "Chlamydia",
    setting: "Sexual Health",
    title: "Screening & Retesting",
    tags: [
      "national chlamydia screening programme", "ncsp", "chlamydia under 25",
      "chlamydia retest", "chlamydia msm screening", "triple site testing",
    ],
    content: [
      { type: "subheading", value: "National Chlamydia Screening Programme (NCSP)" },
      { type: "list", items: [
        "Opportunistic screening for sexually active people under 25 in England — offered annually and on change of sexual partner, in a wide range of settings (GP, pharmacy, contraception services), not just sexual health clinics",
        "Aims to detect and treat asymptomatic infection before it causes reproductive harm (PID, tubal damage) rather than waiting for symptomatic presentation",
      ]},
      { type: "subheading", value: "Men Who Have Sex with Men (MSM)" },
      { type: "text", value: "Triple-site testing (urethral/urine, rectal, pharyngeal) is the standard of care in MSM — testing urine alone misses a large proportion of infections, since extragenital infection is frequently asymptomatic." },
      { type: "list", items: [
        "Screen every 3–6 months in MSM with ongoing risk (new or multiple partners, condomless sex), including those on HIV PrEP or living with HIV",
      ]},
      { type: "subheading", value: "Retesting After Treatment" },
      { type: "text", value: "A test of cure is different from retesting for reinfection. Offer a repeat test (not just a test of cure) around 3 months after treatment in under-25s and anyone at ongoing risk — reinfection from an untreated or new partner is common and is the leading cause of a positive result at this point, rather than treatment failure." },
    ],
  },
];
