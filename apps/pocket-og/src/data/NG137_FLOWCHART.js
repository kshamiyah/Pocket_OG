// NG137 — Twin and Triplet Pregnancy (NICE Guideline NG137, September 2019,
// updated 2024). Timing and mode of birth for an otherwise uncomplicated
// multiple pregnancy — bring forward for any complication (see QS46 for
// the complication/tertiary-referral pathway).

export const NG137_TWINS_FLOWCHART = {
  id: "NG137_TWINS",
  title: "Twin & Triplet Pregnancy: Timing & Mode of Birth",
  subtitle: "NG137 · Uncomplicated pregnancy planning",
  startId: "chorionicity",
  nodes: {

    "chorionicity": {
      type: "decision",
      title: "Chorionicity & Amnionicity?",
      options: [
        { label: "Dichorionic diamniotic (DCDA) twins", next: "dcda" },
        { label: "Monochorionic diamniotic (MCDA) twins", next: "mcda" },
        { label: "Monochorionic monoamniotic (MCMA) twins", next: "mcma" },
        { label: "Trichorionic / dichorionic triamniotic triplets", next: "triplets" },
      ],
    },

    "dcda": {
      type: "action",
      title: "DCDA Twins — Plan Birth at 37+0 Weeks",
      text: "Continuing beyond 37+6 weeks increases fetal death risk if uncomplicated.",
      next: "presentation-check",
    },

    "mcda": {
      type: "action",
      title: "MCDA Twins — Plan Birth at 36+0 Weeks",
      text: "Continuing beyond 36+6 weeks increases fetal death risk if uncomplicated.",
      next: "presentation-check",
    },

    "mcma": {
      type: "end",
      title: "MCMA Twins — Plan Caesarean at 32+0–33+6 Weeks",
      text: "Caesarean section recommended for all monoamniotic twins — cord entanglement risk makes vaginal birth unsuitable regardless of presentation.",
    },

    "triplets": {
      type: "end",
      title: "Triplets — Plan Birth at 35+0 Weeks",
      text: "Uncomplicated trichorionic or dichorionic triamniotic triplets. Individualise mode of birth with senior input.",
    },

    "presentation-check": {
      type: "decision",
      title: "Twin 1 Presentation, Beyond 32 Weeks, No Other Complication?",
      options: [
        { label: "Cephalic, no complication", next: "mode-choice" },
        { label: "Non-cephalic, or another complication present", next: "caesarean" },
      ],
    },

    "mode-choice": {
      type: "end",
      title: "Vaginal or Caesarean — Genuine Choice",
      text: "NICE does not recommend one mode over the other here, regardless of chorionicity, provided there's no significant twin size discordance.",
      items: [
        "Planned vaginal birth needs: continuous monitoring of both babies, an obstetric unit with staff experienced in twin birth, IV access",
        "Counsel that a minority planning vaginal birth still need an emergency caesarean to deliver twin 2",
        "No fixed maximum interval between twin 1 and twin 2 — decisions follow fetal condition, not the clock",
      ],
    },

    "caesarean": {
      type: "end",
      title: "Caesarean Section Recommended",
      text: "Twin 1 non-cephalic, or another complication present — plan caesarean birth.",
    },

  },
};
