// GTG22 — The Use of Anti-D Immunoglobulin for Rhesus D Prophylaxis
// (RCOG Green-top Guideline No. 22, March 2011; dosing regimens for routine
// antenatal anti-D prophylaxis per NICE TA156, "Routine antenatal anti-D
// prophylaxis for women who are rhesus D negative")

export const GTG22_SECTIONS = [
  {
    id: "gtg22-overview",
    gl: "GTG22",
    condition: "Anti-D Prophylaxis",
    setting: "Antenatal",
    title: "Rhesus D Alloimmunisation — Overview & Who Needs Anti-D",
    tags: [
      "anti-d", "anti d", "antid", "rhesus disease", "rhd negative", "rh negative",
      "rhesus negative", "hdfn", "haemolytic disease of the fetus and newborn",
      "rhesus alloimmunisation", "feto-maternal haemorrhage", "fmh",
    ],
    content: [
      { type: "text", value: "RhD-negative women can become sensitised (alloimmunised) if fetal RhD-positive red cells cross into their circulation, a feto-maternal haemorrhage (FMH). Once sensitised, a woman produces anti-D antibodies that persist for life and can cross the placenta in future RhD-positive pregnancies to cause haemolytic disease of the fetus and newborn (HDFN) — ranging from mild neonatal jaundice/anaemia to severe hydrops and intrauterine death." },
      { type: "alert", value: "Anti-D immunoglobulin (Ig) is prophylaxis, not treatment. Given before sensitisation occurs, it clears fetal RhD-positive cells from the maternal circulation before the woman's immune system mounts a response. Once a woman is already sensitised (has detectable immune anti-D on her antibody screen), anti-D Ig has no benefit and should not be given — refer to fetal medicine for surveillance instead." },

      { type: "subheading", value: "Who this applies to" },
      { type: "list", items: [
        "All RhD-negative women who are not known to be already sensitised to the D antigen.",
        "Blood group and antibody screen are taken at booking, and the antibody screen is repeated at around 28 weeks — before any dose of routine antenatal anti-D prophylaxis (RAADP) is given, to confirm she remains unsensitised.",
        "Anti-D Ig is not required if the baby's father is confirmed RhD negative (rare in practice to act on this alone, since paternity and paternal blood group are not always certain) or if the woman is already known to be sensitised.",
      ]},

      { type: "subheading", value: "Passive anti-D vs true sensitisation" },
      { type: "alert", value: "A weak, transient anti-D antibody can appear on screening for some weeks after a dose of anti-D Ig — this is passive antibody from the product itself, not new sensitisation. Discuss unexpected positive screens with the blood transfusion laboratory, correlating with the dose and timing of anti-D Ig given, rather than assuming alloimmunisation." },

      { type: "subheading", value: "Why this matters" },
      { type: "list", items: [
        "RhD-negative status affects roughly 15% of white British/European women, and is less common in most other ethnic backgrounds.",
        "Before anti-D prophylaxis became routine practice, RhD alloimmunisation was a leading cause of severe fetal anaemia, hydrops and perinatal death; population use of anti-D Ig has made this rare in the UK, but it still occurs when prophylaxis is missed, delayed, or given at an inadequate dose for the feto-maternal haemorrhage involved.",
        "Each pregnancy and each potentially sensitising event carries its own indication for anti-D — cover is not cumulative, and a missed dose is not compensated for by a later one.",
      ]},
    ],
  },

  {
    id: "gtg22-raadp",
    gl: "GTG22",
    condition: "Anti-D Prophylaxis",
    setting: "Antenatal",
    title: "Routine Antenatal Anti-D Prophylaxis (RAADP)",
    tags: [
      "raadp", "routine antenatal anti-d prophylaxis", "anti-d 28 weeks", "anti-d 34 weeks",
      "anti-d dose", "1500 iu anti-d", "500 iu anti-d",
    ],
    flowchartId: "GTG22_ANTID",
    content: [
      { type: "text", value: "Small, clinically silent feto-maternal haemorrhages occur through pregnancy even without an identifiable sensitising event. RAADP covers this background risk in the third trimester, separately from anti-D given for a specific sensitising event." },
      { type: "table",
        headers: ["Regimen", "Dose", "Timing"],
        rows: [
          ["Single-dose", "1500 IU", "One dose at 28 weeks, or any time between 28 and 30 weeks"],
          ["Two-dose", "500 IU + 500 IU", "One dose at 28 weeks, a second at 34 weeks"],
          ["Two-dose (alternative product)", "1000–1650 IU + 1000–1650 IU", "One dose at 28 weeks, a second at 34 weeks"],
        ],
      },
      { type: "text", value: "NICE TA156: any of the above regimens is an acceptable option for a RhD-negative woman not known to be sensitised; where a choice exists, use the lowest-cost preparation available locally. Local policy typically standardises on one regimen — check which your unit stocks." },

      { type: "subheading", value: "Practical points" },
      { type: "list", items: [
        "RAADP is given regardless of whether anti-D Ig has already been given earlier in the same pregnancy for a sensitising event — the two are separate indications and doses are not interchangeable.",
        "If a sensitising event occurs close to a scheduled RAADP dose, give the sensitising-event dose in full; do not assume it substitutes for the RAADP dose, or vice versa (see the sensitising-events section for gestational dosing and FMH testing).",
        "Confirm the antibody screen was taken and is unsensitised before each RAADP dose — this is usually the same 28-week booking sample.",
      ]},

      { type: "subheading", value: "Discussing anti-D with the woman" },
      { type: "list", items: [
        "Anti-D Ig is a plasma-derived blood product. Explain why it's offered, what it does (and doesn't do), and that she can decline it.",
        "If declined, document the discussion clearly and flag the pregnancy so subsequent staff don't assume prophylaxis has been given.",
        "Declining antenatal prophylaxis does not preclude postnatal anti-D if the baby is confirmed RhD positive — re-offer it after birth.",
      ]},
    ],
  },

  {
    id: "gtg22-sensitising-events",
    gl: "GTG22",
    condition: "Anti-D Prophylaxis",
    setting: "Antenatal / Emergency",
    title: "Anti-D for Potentially Sensitising Events",
    tags: [
      "sensitising event", "sensitizing event", "anti-d miscarriage", "anti-d ectopic",
      "anti-d amniocentesis", "anti-d cvs", "anti-d ecv", "anti-d abdominal trauma",
      "anti-d aph", "anti-d antepartum haemorrhage", "anti-d 250 iu", "anti-d 500 iu",
      "kleihauer", "feto-maternal haemorrhage",
    ],
    flowchartId: "GTG22_ANTID",
    content: [
      { type: "alert", value: "Give anti-D Ig as soon as possible and always within 72 hours of a potentially sensitising event. If the 72-hour window is missed, a dose given up to 10 days after the event may still offer some protection — give it rather than not, and document why it was late." },

      { type: "subheading", value: "Potentially sensitising events" },
      { type: "list", items: [
        "Miscarriage, threatened miscarriage, or intervention for miscarriage (medical or surgical evacuation) — give anti-D Ig at any gestation if evacuation is performed; for a continuing pregnancy with threatened miscarriage, give anti-D Ig only if bleeding is heavy, repeated, or associated with abdominal pain, particularly as gestation approaches or passes 12 weeks. Anti-D is not routinely needed for light, painless bleeding before 12 weeks in a continuing pregnancy.",
        "Ectopic pregnancy",
        "Molar pregnancy (until confirmed complete)",
        "Termination of pregnancy — medical or surgical, at any gestation",
        "Chorionic villus sampling, amniocentesis, cordocentesis, and other invasive intrauterine procedures (e.g. fetal shunting, selective reduction)",
        "External cephalic version — whether or not it succeeds",
        "Closed (blunt) abdominal trauma",
        "Antepartum haemorrhage",
        "Intrauterine death",
        "Delivery — vaginal, instrumental, or caesarean",
      ]},

      { type: "subheading", value: "Dose by gestation" },
      { type: "table",
        headers: ["Gestation at event", "Minimum dose", "FMH quantification"],
        rows: [
          ["Before 20+0 weeks", "250 IU IM", "Not routinely required"],
          ["20+0 weeks or later", "500 IU IM", "Required — Kleihauer or flow cytometry, to check whether the standard dose is enough"],
        ],
      },

      { type: "subheading", value: "Multiple events" },
      { type: "list", items: [
        "Each new sensitising event is managed on its own merits with its own dose — regardless of what has already been given earlier in the pregnancy.",
        "Recurrent small bleeds (e.g. ongoing spotting): if concerned about cumulative FMH, a Kleihauer/FMH estimate every 2 weeks can guide whether an extra dose is needed.",
      ]},
    ],
  },

  {
    id: "gtg22-fmh-quantification",
    gl: "GTG22",
    condition: "Anti-D Prophylaxis",
    setting: "Antenatal / Postnatal",
    title: "Quantifying FMH & Dosing for Large Bleeds",
    tags: [
      "kleihauer test", "flow cytometry fmh", "feto-maternal haemorrhage quantification",
      "anti-d extra dose", "125 iu per ml", "large fmh",
    ],
    content: [
      { type: "text", value: "500 IU anti-D Ig (IM) is calculated to clear a feto-maternal haemorrhage of up to 4 mL of fetal red cells — enough for the great majority of sensitising events and for routine delivery. Larger bleeds need more anti-D than the standard dose provides." },
      { type: "list", items: [
        "Take a sample for FMH quantification (Kleihauer acid-elution test, or flow cytometry) alongside every ≥20-week sensitising event and every delivery.",
        "If the Kleihauer estimate suggests FMH >4 mL, confirm with flow cytometry and give additional anti-D Ig without waiting — do not delay treatment pending confirmation if the initial estimate is already high.",
        "Additional dosing is calculated at 125 IU anti-D Ig per mL of fetal red cells in excess of the 4 mL already covered by the initial dose (traditional IM dosing calculation — confirm the figure for the product in local stock with the transfusion laboratory).",
        "Recheck a follow-up sample to confirm fetal cells have cleared: about 48 hours after an IV dose, or about 72 hours after an IM dose. If cells persist, give a further dose and recheck again.",
      ]},
      { type: "alert", value: "Large FMH volumes, or fetal cells that don't clear on the follow-up sample, warrant discussion with haematology/the transfusion laboratory and, where the event occurred antenatally, with fetal medicine — large FMH is itself a marker of possible fetal anaemia and may need its own surveillance regardless of maternal anti-D dosing." },

      { type: "subheading", value: "Route of administration" },
      { type: "list", items: [
        "Standard route is intramuscular, into the deltoid — avoid the gluteal region, where absorption is slower and less reliable.",
        "Large IM doses are usually split between two injection sites.",
        "Where a woman has a bleeding disorder or significant thrombocytopenia, an IM injection carries a bleeding risk — some anti-D Ig preparations are licensed for intravenous use and this route may be preferable in that situation; check the product license and discuss with haematology.",
      ]},
    ],
  },

  {
    id: "gtg22-postnatal",
    gl: "GTG22",
    condition: "Anti-D Prophylaxis",
    setting: "Postnatal",
    title: "Postnatal Anti-D After Delivery",
    tags: [
      "postnatal anti-d", "cord blood group", "anti-d after birth", "anti-d delivery",
      "rhd positive baby", "anti-d 500 iu delivery",
    ],
    content: [
      { type: "alert", value: "Take cord blood at every delivery to a RhD-negative woman, for the baby's blood group (and direct antiglobulin test if clinically indicated). If the baby is confirmed RhD positive, give the mother at least 500 IU anti-D Ig IM within 72 hours of delivery, along with a maternal sample for FMH quantification." },
      { type: "list", items: [
        "If FMH quantification shows more than 4 mL of fetal red cells, give additional anti-D Ig calculated as above (125 IU per mL in excess of 4 mL) and recheck clearance on a follow-up sample.",
        "If the baby's RhD group is not known (e.g. no cord sample obtained, or result delayed), give anti-D Ig within the 72-hour window on the assumption the baby may be RhD positive, rather than waiting — it can be withheld only once RhD-negative status is confirmed.",
        "Postnatal anti-D is required after every delivery of a RhD-positive baby, irrespective of whether RAADP was given antenatally, and irrespective of the mode of birth.",
      ]},

      { type: "subheading", value: "Documentation" },
      { type: "list", items: [
        "Record every anti-D dose given (or offered and declined) in the maternity notes and, where used locally, on a dedicated anti-D administration record — event, gestation, dose, batch number, and route.",
        "Clear documentation matters for the next pregnancy: whoever books a subsequent pregnancy needs to know what prophylaxis was, or wasn't, given previously, since a missed or inadequate dose is a specific reason to counsel about the risk of sensitisation.",
      ]},
    ],
  },
];
