// BHIVA_HIV_PREGNANCY — BHIVA Guidelines on the Management of HIV in
// Pregnancy and the Postpartum Period (2025), replacing the 2020 guideline
// (and its interim updates)

export const BHIVA_HIV_PREGNANCY_SECTIONS = [
  {
    id: "bhiva-hiv-antenatal",
    gl: "BHIVA_HIV_PREGNANCY",
    condition: "HIV in Pregnancy",
    setting: "Obstetrics",
    title: "Antenatal Principles & Antiretroviral Therapy",
    tags: [
      "hiv pregnancy", "bhiva", "bhiva_hiv_pregnancy", "antiretroviral pregnancy",
      "art pregnancy", "hiv booking screening", "viral load pregnancy",
    ],
    content: [
      { type: "text", value: "The BHIVA guideline on the management of HIV in pregnancy and the postpartum period (2025) covers antenatal care, mode of delivery, and infant feeding for women with HIV." },
      { type: "list", items: [
        "All pregnant women are offered HIV screening at booking, as part of routine antenatal screening",
        "Women already on effective antiretroviral therapy (ART) at conception should continue it",
        "Women diagnosed in pregnancy, or not on treatment, should start ART as soon as possible — by 24 weeks at the latest, and earlier wherever practical, to allow time to achieve an undetectable viral load before delivery",
        "Aim for an undetectable viral load by delivery — this is the single biggest determinant of mother-to-child transmission risk",
      ]},
      { type: "subheading", value: "Preconception & Screening Context" },
      { type: "list", items: [
        "Preconception counselling for women with known HIV: discuss achieving an undetectable viral load before conception, folic acid, and reviewing ART for any agents with a less favourable pregnancy safety profile",
        "HIV screening in pregnancy is opt-out and repeated later in pregnancy for women with ongoing risk factors, or presenting with a new potential exposure",
        "Screen for and treat opportunistic infections and co-infections that affect pregnancy management — syphilis, hepatitis B/C, and TB risk factors — as part of the same antenatal pathway",
      ]},
    ],
  },

  {
    id: "bhiva-hiv-delivery",
    gl: "BHIVA_HIV_PREGNANCY",
    condition: "HIV in Pregnancy",
    setting: "Obstetrics",
    title: "Mode of Delivery & Intrapartum Management",
    tags: [
      "hiv delivery mode", "caesarean hiv", "zidovudine infusion",
      "hiv viral load delivery", "vaginal delivery hiv",
    ],
    content: [
      { type: "table", headers: ["Viral load at 36 weeks", "Recommended mode of delivery"], rows: [
        ["<50 copies/ml", "Vaginal delivery is an option — normal obstetric management"],
        ["50–1,000 copies/ml", "Individualised discussion — pre-labour caesarean section is often recommended"],
        [">1,000 copies/ml", "Pre-labour caesarean section, with an intravenous zidovudine infusion started 4 hours before surgery"],
      ]},
      { type: "text", value: "Avoid unnecessary invasive procedures that increase fetal exposure to maternal blood — fetal scalp electrodes, fetal blood sampling, and instrumental delivery are used only when there is a compelling obstetric indication, and preferably only once the viral load is known to be suppressed." },
      { type: "text", value: "Where a pre-labour caesarean is planned for HIV alone, timing around 38–39 weeks is usual, balancing the aim of an undetectable viral load against the risk of spontaneous labour or rupture of membranes before the planned date." },
    ],
  },

  {
    id: "bhiva-hiv-neonatal-feeding",
    gl: "BHIVA_HIV_PREGNANCY",
    condition: "HIV in Pregnancy",
    setting: "Neonatal / Postnatal",
    title: "Neonatal PEP & Infant Feeding",
    tags: [
      "neonatal pep hiv", "infant feeding hiv", "breastfeeding hiv",
      "hiv informed choice breastfeeding", "undetectable viral load breastfeeding",
    ],
    content: [
      { type: "alert", value: "Deliver in a unit with on-site paediatric care so neonatal post-exposure prophylaxis (PEP) can start within 4 hours of birth. PEP regimen and duration are stratified by transmission risk (maternal viral load and ART history) — follow current BHIVA risk stratification and local protocol." },
      { type: "subheading", value: "Infant Feeding — Informed Choice" },
      { type: "text", value: "The 2025 update moves to a shared decision-making approach, replacing a blanket 'do not breastfeed' recommendation." },
      { type: "list", items: [
        "Women with a confirmed undetectable viral load (<50 copies/ml) on regular ART, with good adherence, may choose to breastfeed after discussing the risks and benefits — transmission risk is very low with viral suppression, but is not proven to be zero",
        "Women who choose to breastfeed should be supported by the clinical team to do so as safely as possible, with ongoing monitoring",
        "Formula feeding remains the option with no transmission risk and is fully supported for women who prefer it",
      ]},
      { type: "subheading", value: "Infant Testing Schedule" },
      { type: "text", value: "Infant HIV PCR testing follows a staged schedule (birth, around 6 weeks, and around 12 weeks, adjusted for feeding method and risk category), with a confirmatory HIV antibody test at 18–24 months once maternal antibody has cleared — verify the exact schedule against current BHIVA guidance and local protocol, as it is stratified by risk category." },
    ],
  },

  {
    id: "bhiva-hiv-postnatal-mdt",
    gl: "BHIVA_HIV_PREGNANCY",
    condition: "HIV in Pregnancy",
    setting: "Postnatal",
    title: "Postnatal Care & Multidisciplinary Support",
    tags: [
      "hiv postnatal care", "hiv multidisciplinary team", "hiv contraception postnatal",
      "hiv disclosure support", "hiv peer support pregnancy",
    ],
    content: [
      { type: "text", value: "Care for a woman with HIV in pregnancy is multidisciplinary from the outset — obstetrics, HIV/infectious disease specialists, specialist midwifery, and paediatrics all need a shared plan, agreed and documented well before delivery rather than improvised on the day." },
      { type: "list", items: [
        "Continue maternal ART postnatally without interruption — pregnancy is not a reason to pause treatment once started",
        "Address contraception before discharge — an unplanned pregnancy shortly afterwards undermines the careful antenatal planning just completed",
        "Psychosocial support and peer support networks are an important part of care — disclosure concerns, stigma, and the emotional weight of infant feeding decisions all warrant explicit attention, not just clinical follow-up",
        "Safety-net the woman and the wider family: confirm who else is aware of the diagnosis and how ongoing care will be coordinated once she is no longer attending antenatal appointments",
      ]},
    ],
  },
];
