// BASHH_SYPHILIS — UK Guidelines for the Management of Syphilis (2024),
// and the companion UK Guidelines for the Management of Syphilis in
// Pregnancy and Children (2024)

export const BASHH_SYPHILIS_SECTIONS = [
  {
    id: "bashh-syphilis-staging",
    gl: "BASHH_SYPHILIS",
    condition: "Syphilis",
    setting: "Sexual Health",
    title: "Syphilis — Staging & Diagnosis",
    tags: [
      "syphilis", "bashh_syphilis", "bashh", "treponema pallidum",
      "primary syphilis", "secondary syphilis", "latent syphilis",
      "syphilis serology",
    ],
    content: [
      { type: "text", value: "BASHH published updated UK guidelines for syphilis, and a companion guideline for syphilis in pregnancy and children, in 2024." },
      { type: "table", headers: ["Stage", "Features"], rows: [
        ["Primary", "Chancre (typically painless) at the site of inoculation, 9–90 days after exposure"],
        ["Secondary", "Systemic — rash (including palms/soles), lymphadenopathy, mucosal lesions, condylomata lata; occurs weeks to months after the primary chancre"],
        ["Early latent (<2 years)", "Seropositive, asymptomatic, infection acquired within the preceding 2 years"],
        ["Late latent (≥2 years) / unknown duration", "Seropositive, asymptomatic, infection acquired more than 2 years ago or duration cannot be established"],
        ["Tertiary", "Late complications — cardiovascular, neurological (neurosyphilis), or gummatous disease"],
      ]},
      { type: "text", value: "Diagnosis is serological (treponemal and non-treponemal tests) supported by dark-field microscopy or PCR of lesion fluid where a chancre is present." },
    ],
  },

  {
    id: "bashh-syphilis-treatment",
    gl: "BASHH_SYPHILIS",
    condition: "Syphilis",
    setting: "Sexual Health",
    title: "Treatment",
    tags: [
      "benzathine penicillin syphilis", "syphilis treatment",
      "ceftriaxone syphilis", "penicillin allergy syphilis",
    ],
    content: [
      { type: "alert", value: "Penicillin (benzathine benzylpenicillin) is the only reliably effective treatment at every stage and in pregnancy — penicillin allergy should be confirmed, not assumed, given how central penicillin is to cure." },
      { type: "list", items: [
        "Early syphilis (primary, secondary, early latent): a single intramuscular dose of benzathine benzylpenicillin is standard",
        "Late latent syphilis or unknown duration: a longer, multi-dose course is required — follow the current BASHH dosing schedule/local protocol for exact number of doses and intervals",
        "Ceftriaxone is an alternative where penicillin genuinely cannot be used, in most cases — macrolides are no longer recommended due to resistance",
        "The 2024 update licensed benzathine penicillin with lidocaine, and extended the acceptable interval between doses in multi-dose regimens",
      ]},
    ],
  },

  {
    id: "bashh-syphilis-pregnancy",
    gl: "BASHH_SYPHILIS",
    condition: "Syphilis in Pregnancy",
    setting: "Obstetrics",
    title: "Syphilis in Pregnancy",
    tags: [
      "syphilis pregnancy", "congenital syphilis", "syphilis booking screening",
      "syphilis pregnancy treatment",
    ],
    content: [
      { type: "alert", value: "All pregnant women are screened for syphilis at booking. Vertical transmission can occur at any stage of pregnancy and is highest with untreated primary or secondary maternal infection." },
      { type: "list", items: [
        "Treat promptly with penicillin at the appropriate regimen for the stage of infection — treatment in the first two trimesters is most effective at preventing congenital infection",
        "Penicillin desensitisation is required for genuinely penicillin-allergic pregnant women — there is no fully effective non-penicillin alternative for preventing congenital syphilis",
        "Diagnosis in the second half of pregnancy: arrange sonographic assessment for signs of fetal infection (hepatomegaly, ascites, hydrops)",
        "Notify the paediatric team antenatally so the neonate can be assessed and treated as needed after birth",
      ]},
    ],
  },
];
