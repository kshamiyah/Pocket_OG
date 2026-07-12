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
      { type: "text", value: "Neonatal treatment: a single dose of IM/IV ceftriaxone, adjusted for neonatal weight — check local neonatal dosing, and note that ceftriaxone needs caution in neonates with jaundice/hyperbilirubinaemia and must not be given alongside IV calcium. Since chlamydia and gonorrhoea can co-exist, cover both organisms (ceftriaxone plus oral azithromycin) if the causative organism isn't yet confirmed." },
      { type: "alert", value: "Disseminated gonococcal infection (DGI) is rare but should be considered in anyone with a triad of tenosynovitis, dermatitis (petechial/pustular acral skin lesions) and migratory polyarthralgia or septic arthritis. It needs admission for IV ceftriaxone and specialist input, not outpatient oral treatment." },
    ],
  },

  {
    id: "bashh-gc-resistance-screening",
    gl: "BASHH_GC",
    condition: "Gonorrhoea",
    setting: "Sexual Health",
    title: "Antimicrobial Resistance & Screening",
    tags: [
      "grasp programme", "ceftriaxone resistant gonorrhoea", "gonorrhoea msm screening",
      "gonorrhoea triple site testing",
    ],
    content: [
      { type: "alert", value: "Ceftriaxone-resistant gonorrhoea is an emerging problem in England — surveillance (GRASP) recorded 15 cases in the first 8 months of 2025, already exceeding the 13 recorded for all of 2024. This is why taking a culture specimen before treatment matters even when NAAT alone would confirm the diagnosis: without it, resistance can't be detected or acted on." },
      { type: "list", items: [
        "Report confirmed or suspected ceftriaxone treatment failure promptly per local health protection team protocol — this is how emerging resistant strains are tracked and contained",
        "MSM: triple-site testing (urethral/urine, rectal, pharyngeal) as for chlamydia — pharyngeal infection is often asymptomatic and is also the site most associated with treatment failure",
        "Screen every 3–6 months in MSM with ongoing risk, as for chlamydia",
      ]},
    ],
  },
];
