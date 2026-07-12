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
      "jarisch-herxheimer reaction", "neurosyphilis",
    ],
    flowchartId: "BASHH_SYPHILIS_TREATMENT",
    content: [
      { type: "alert", value: "Penicillin (benzathine benzylpenicillin) is the only reliably effective treatment at every stage and in pregnancy — penicillin allergy should be confirmed, not assumed, given how central penicillin is to cure." },
      { type: "table", headers: ["Stage", "Regimen"], rows: [
        ["Early syphilis (primary, secondary, early latent)", "Benzathine benzylpenicillin 2.4 MU IM, single dose"],
        ["Late latent, unknown duration, cardiovascular or gummatous syphilis", "Benzathine benzylpenicillin 2.4 MU IM, weekly for 3 weeks (3 doses total)"],
        ["Neurosyphilis", "IV benzylpenicillin — an inpatient regimen, not the outpatient IM benzathine form; discuss with a specialist"],
      ]},
      { type: "list", items: [
        "Penicillin allergy, early syphilis: doxycycline 100 mg twice daily for 14 days is the standard oral alternative",
        "Penicillin allergy, late latent/unknown duration: doxycycline 100 mg twice daily for 28 days",
        "Ceftriaxone is a further alternative where doxycycline is unsuitable, in most cases — macrolides are no longer recommended due to resistance",
        "The 2024 update licensed benzathine penicillin with lidocaine (reducing injection pain), and extended the acceptable interval between doses in multi-dose regimens",
      ]},
      { type: "alert", value: "Warn about the Jarisch-Herxheimer reaction — fever, myalgia and headache within 24 hours of the first dose, from the immune response to dying spirochaetes. It is not a penicillin allergy and does not mean treatment should stop; it is more pronounced in early syphilis and can (rarely) trigger preterm labour if it occurs in pregnancy, so monitor accordingly." },
      { type: "text", value: "Co-infection with HIV does not change the treatment regimen, but follow-up serology should be more intensive, and neurosyphilis should be considered at a lower threshold." },
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
      { type: "subheading", value: "Congenital Syphilis" },
      { type: "list", items: [
        "Early features (first 2 years): hepatosplenomegaly, rash, snuffles (nasal discharge), failure to thrive, jaundice",
        "Late features (if untreated): Hutchinson's teeth, saddle nose, sabre shins, sensorineural deafness — all preventable with adequate antenatal treatment",
        "Every case in pregnancy warrants a paediatric plan agreed before delivery, not arranged reactively afterwards",
      ]},
    ],
  },

  {
    id: "bashh-syphilis-followup",
    gl: "BASHH_SYPHILIS",
    condition: "Syphilis",
    setting: "Sexual Health",
    title: "Serological Follow-Up",
    tags: [
      "syphilis serology follow up", "syphilis titre", "serofast",
      "syphilis reinfection", "syphilis hiv monitoring",
    ],
    content: [
      { type: "text", value: "Cure is confirmed serologically, not just by symptom resolution — non-treponemal titres (e.g. RPR/VDRL) are followed over time; treponemal tests usually stay positive for life and are not used to monitor response." },
      { type: "table", headers: ["Stage", "Expected response"], rows: [
        ["Early syphilis", "Fourfold decline in non-treponemal titre within 6–12 months"],
        ["Late latent syphilis", "Fourfold decline within 12–24 months"],
      ]},
      { type: "list", items: [
        "A sustained fourfold rise in titre after treatment suggests reinfection or treatment failure — investigate and retreat rather than assume it's a lab variation",
        "Serofast state: titres plateau at a low positive level without meeting the fourfold-decline definition — common, and routine retreatment is not warranted without other evidence of active infection",
        "HIV co-infection: monitor more frequently (e.g. 3-monthly rather than 6-monthly) and maintain a lower threshold for considering neurosyphilis if the clinical or serological picture is atypical",
      ]},
    ],
  },
];
