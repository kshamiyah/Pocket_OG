// BASHH_GC — UK National Guideline for the Management of Neisseria gonorrhoeae
// BASHH 2019, updated 2025

export const BASHH_GC_SECTIONS = [
  {
    id: "bashh-gc-overview",
    gl: "BASHH_GC",
    condition: "Gonorrhoea",
    setting: "Sexual Health",
    title: "Gonorrhoea — Overview & Diagnosis",
    tags: [
      "gonorrhoea", "gonorrhea", "neisseria gonorrhoeae", "bashh_gc", "bashh",
      "gonorrhoea antimicrobial resistance", "gonorrhoea culture",
    ],
    content: [
      { type: "text", value: "The BASHH UK national guideline (2019, updated 2025) covers the management of Neisseria gonorrhoeae infection. Rising antimicrobial resistance drives frequent revision of first-line treatment, so always check the current recommendation before treating." },
      { type: "list", items: [
        "Often asymptomatic in women; can cause vaginal discharge, dysuria or pelvic pain; a cause of PID if untreated",
        "Diagnosis: NAAT for screening at relevant sites (genital, rectal, pharyngeal); take a culture specimen before treatment wherever possible, to allow antimicrobial susceptibility testing",
      ]},
    ],
  },

  {
    id: "bashh-gc-treatment",
    gl: "BASHH_GC",
    condition: "Gonorrhoea",
    setting: "Sexual Health",
    title: "Treatment & Test of Cure",
    tags: [
      "ceftriaxone gonorrhoea", "gonorrhoea treatment", "gonorrhoea test of cure",
      "gonorrhoea pregnancy treatment", "ciprofloxacin gonorrhoea",
    ],
    content: [
      { type: "alert", value: "Ceftriaxone 1 g intramuscularly as a single dose is first-line monotherapy (since the 2019 update) — dual therapy with azithromycin was dropped as azithromycin resistance rose." },
      { type: "list", items: [
        "Ciprofloxacin can be used where susceptibility is confirmed at all infected sites — this helps preserve ceftriaxone against emerging resistance",
        "Ceftriaxone is safe in pregnancy and is the treatment of choice",
        "Test of cure is recommended for all cases, and is particularly important for pharyngeal infection, where treatment failure is more common — verify the current interval against local protocol, as timing and site-specific recommendations are updated as resistance patterns evolve",
        "Partner notification and concurrent screening for other STIs, as for chlamydia",
      ]},
    ],
  },

  {
    id: "bashh-gc-complications",
    gl: "BASHH_GC",
    condition: "Gonorrhoea",
    setting: "Sexual Health",
    title: "Complications",
    tags: [
      "disseminated gonococcal infection", "gonorrhoea pid", "gonorrhoea epididymitis",
      "ophthalmia neonatorum", "gonococcal arthritis",
    ],
    content: [
      { type: "list", items: [
        "Pelvic inflammatory disease (PID) and epididymo-orchitis, as with chlamydia, with the same downstream fertility risk",
        "Ophthalmia neonatorum — severe, sight-threatening neonatal conjunctivitis acquired at birth from an untreated maternal infection; a notifiable condition requiring urgent same-day ophthalmology and paediatric assessment",
      ]},
      { type: "alert", value: "Disseminated gonococcal infection (DGI) is rare but should be considered in anyone with a triad of tenosynovitis, dermatitis (petechial/pustular acral skin lesions) and migratory polyarthralgia or septic arthritis. It needs admission for IV ceftriaxone and specialist input, not outpatient oral treatment." },
    ],
  },
];
