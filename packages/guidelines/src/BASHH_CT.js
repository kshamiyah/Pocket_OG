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
        "Test of cure is recommended in pregnancy (from around 5–6 weeks after treatment) and for rectal infection, given the higher chance of treatment failure at these sites/in this group",
        "Partner notification: trace and treat partners from the preceding period per local protocol; advise abstinence until both partners have completed treatment",
      ]},
    ],
  },
];
