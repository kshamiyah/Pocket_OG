// NG137 — Twin and Triplet Pregnancy
// (NICE Guideline NG137, published 4 September 2019, updated 2024)
//
// QS46 (the NICE quality standard) already covers chorionicity/amnionicity
// determination, the MDT/tertiary referral pathway, growth-monitoring scan
// schedule, and the 24- and 28-week antenatal discussion checkpoints. This
// guideline adds what QS46 doesn't cover in detail: the actual recommended
// timing and mode of birth, and complication-specific staging/management.

export const NG137_SECTIONS = [
  {
    id: "ng137-timing-of-birth",
    gl: "NG137",
    condition: "Twin & Triplet Pregnancy",
    setting: "Antenatal",
    title: "Timing of Birth",
    tags: [
      "twin timing of birth", "triplet timing of birth", "dichorionic diamniotic timing",
      "monochorionic diamniotic timing", "monoamniotic timing", "elective birth twins",
    ],
    flowchartId: "NG137_TWINS",
    content: [
      { type: "text", value: "Recommended timing balances the rising stillbirth risk of continuing an uncomplicated multiple pregnancy further against the risks of iatrogenic prematurity — these are default planning windows for an uncomplicated pregnancy of the stated chorionicity/amnionicity, brought forward for any complication." },
      { type: "table",
        headers: ["Pregnancy type", "Planned birth"],
        rows: [
          ["Uncomplicated dichorionic diamniotic (DCDA) twins", "37+0 weeks"],
          ["Uncomplicated monochorionic diamniotic (MCDA) twins", "36+0 weeks"],
          ["Monochorionic monoamniotic (MCMA) twins", "32+0–33+6 weeks"],
          ["Uncomplicated trichorionic or dichorionic triamniotic triplets", "35+0 weeks"],
        ],
      },
      { type: "alert", value: "These aren't arbitrary — continuing an uncomplicated DCDA twin pregnancy beyond 37+6 weeks, or an uncomplicated MCDA twin pregnancy beyond 36+6 weeks, is associated with an increased risk of fetal death. Bring the plan forward, don't push it later, if in doubt." },
      { type: "text", value: "Offer a single course of antenatal corticosteroids ahead of any planned preterm birth (elective or in response to a complication), on the same principles as for a singleton pregnancy." },
    ],
  },

  {
    id: "ng137-mode-of-birth",
    gl: "NG137",
    condition: "Twin & Triplet Pregnancy",
    setting: "Intrapartum",
    title: "Mode of Birth",
    tags: [
      "twin mode of birth", "twin vaginal birth", "twin caesarean", "first twin presentation",
      "second twin delivery", "twin continuous monitoring",
    ],
    content: [
      { type: "subheading", value: "Twin 1 cephalic, beyond 32 weeks, no other complication" },
      { type: "list", items: [
        "Both planned vaginal birth and planned caesarean section are reasonable options — NICE does not recommend one over the other in this scenario, irrespective of chorionicity, provided there's no significant size discordance between the twins and no other obstetric contraindication to labour.",
        "This is a genuine choice to discuss with the woman, not a default toward either mode.",
      ]},
      { type: "subheading", value: "Twin 1 non-cephalic, or monoamniotic twins" },
      { type: "list", items: [
        "Twin 1 not cephalic: caesarean section is recommended.",
        "Monochorionic monoamniotic (MCMA) twins: caesarean section is recommended for all — the cord entanglement risk between the twins makes vaginal birth unsuitable regardless of presentation.",
      ]},
      { type: "subheading", value: "Requirements for planned vaginal twin birth" },
      { type: "list", items: [
        "Continuous electronic fetal monitoring of both babies throughout labour.",
        "Birth in an obstetric unit, attended by staff experienced and confident in twin birth — not a midwife-led unit or home birth setting.",
        "IV access established.",
        "A small proportion of women planning vaginal birth will still need an emergency caesarean section to deliver the second twin after the first is born vaginally — counsel for this possibility in advance rather than presenting vaginal birth as an all-or-nothing plan.",
        "There's no single mandated maximum time interval between the birth of twin 1 and twin 2 — decisions on augmentation, amniotomy for twin 2, or moving to caesarean are based on the fetal condition and progress, not a fixed clock.",
      ]},
    ],
  },

  {
    id: "ng137-complications",
    gl: "NG137",
    condition: "Twin & Triplet Pregnancy",
    setting: "Antenatal — Complications",
    title: "TTTS Staging & Other Monochorionic Complications",
    tags: [
      "ttts staging", "quintero staging", "twin to twin transfusion syndrome",
      "selective fetal growth restriction", "taps", "fetoscopic laser ablation",
    ],
    content: [
      { type: "text", value: "QS46 covers the surveillance schedule and tertiary referral triggers for these complications; this section adds the staging detail that shapes the management conversation once a complication is suspected." },
      { type: "subheading", value: "Twin-to-twin transfusion syndrome (TTTS) — Quintero staging" },
      { type: "table",
        headers: ["Stage", "Features"],
        rows: [
          ["I", "Oligohydramnios/polyhydramnios sequence; donor's bladder still visible; normal Dopplers"],
          ["II", "Donor's bladder not visible; Dopplers still normal"],
          ["III", "Critically abnormal Doppler waveforms (either twin)"],
          ["IV", "Hydrops in either twin"],
          ["V", "Death of one or both twins"],
        ],
      },
      { type: "alert", value: "Stage II or higher, identified before around 26 weeks, is the usual threshold for considering fetoscopic laser ablation at a tertiary fetal medicine centre — refer promptly rather than waiting for progression once TTTS is suspected." },
      { type: "subheading", value: "Selective fetal growth restriction (sFGR)" },
      { type: "text", value: "Growth discordance in a monochorionic pregnancy behaves differently from dichorionic FGR because of the shared circulation — the growth-restricted twin's Doppler pattern (and its variability) drives risk and monitoring frequency more than the discordance percentage alone. Manage jointly with the tertiary fetal medicine centre once identified (see QS46 for the discordance thresholds that trigger referral)." },
      { type: "subheading", value: "Twin anaemia polycythaemia sequence (TAPS)" },
      { type: "text", value: "A more subtle, slower variant of inter-twin transfusion without the amniotic fluid discordance of TTTS — suspected from middle cerebral artery Doppler differences between the twins (one showing signs of anaemia, the other of polycythaemia). Refer to the tertiary centre in the same way as suspected TTTS." },
    ],
  },
];
