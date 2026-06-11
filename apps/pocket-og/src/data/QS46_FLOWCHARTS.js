// QS46 — Multiple Pregnancy: Twin & Triplet Pregnancies (NICE)
// Flowchart 1: Chorionicity → Care Pathway
// Flowchart 2: When to involve tertiary fetal medicine centre

export const QS46_CARE_PATHWAY_FLOWCHART = {
  id: "QS46_CARE_PATHWAY",
  title: "Multiple Pregnancy — Care Pathway by Chorionicity",
  subtitle: "QS46 · NICE — Twin & Triplet Pregnancies",
  startId: "scan",
  nodes: {

    "scan": {
      type: "action",
      title: "Dating Scan — 11+2 to 14+1 Weeks",
      text: "All multiple pregnancies must have chorionicity and amnionicity determined by ultrasound and documented between 11+2 and 14+1 weeks.",
      items: [
        "Assess number of placental masses, Lambda or T-sign, membrane presence and thickness",
        "Label fetuses as Left/Right or Upper/Lower (not by number)",
        "Document in ultrasound report; store on PACS; place hard copy in hand-held notes",
      ],
      next: "how-many",
    },

    "how-many": {
      type: "decision",
      title: "How many fetuses?",
      text: "Determine whether this is a twin or triplet pregnancy.",
      options: [
        { label: "Twin pregnancy", sublabel: "Two fetuses", next: "twin-chorionicity" },
        { label: "Triplet pregnancy", sublabel: "Three fetuses", next: "triplet-chorionicity" },
      ],
    },

    // ── TWINS ────────────────────────────────────────────────────────────────

    "twin-chorionicity": {
      type: "decision",
      title: "Twin chorionicity?",
      text: "Monochorionic twins share a placenta and carry higher risks.",
      options: [
        { label: "Monochorionic (MC)", sublabel: "One shared placenta", next: "twin-mc-amnio" },
        { label: "Dichorionic (DC)", sublabel: "Two placentas — DCDA", next: "dcda" },
      ],
    },

    "twin-mc-amnio": {
      type: "decision",
      title: "Monochorionic twin — amnionicity?",
      text: "Monoamniotic twins share an amniotic sac — highest risk category.",
      options: [
        { label: "Monoamniotic (MCMA)", sublabel: "One shared sac — highest risk", next: "mcma" },
        { label: "Diamniotic (MCDA)", sublabel: "Separate sacs — commoner MC type", next: "mcda" },
      ],
    },

    "mcma": {
      type: "alert",
      title: "MCMA Twins — Higher-Risk",
      text: "Monochorionic monoamniotic twins are higher-risk. Involve a tertiary fetal medicine centre consultant.",
      items: [
        "Refer to / seek opinion from tertiary level fetal medicine centre",
        "Fortnightly ultrasound from 16 weeks for TTTS surveillance",
        "At each scan: biometry (HC, AC, FL) + amniotic fluid assessment",
        "Discuss preterm labour risks with woman by 24 weeks",
        "Agree birth plan by 28 weeks",
      ],
    },

    "mcda": {
      type: "action",
      title: "MCDA Twins — Intensive Monitoring",
      text: "Monochorionic diamniotic twins are at risk of TTTS and fetal growth restriction.",
      items: [
        "Fortnightly ultrasound from 16 weeks for TTTS (feto-fetal transfusion syndrome) surveillance",
        "At each scan: 2+ biometric parameters (HC, AC, FL) + amniotic fluid level assessment",
        "Care plan provided at chorionicity determination",
        "MDT core team care throughout",
        "Discuss preterm labour risks by 24 weeks",
        "Agree birth plan by 28 weeks",
      ],
      next: "mcda-complications",
    },

    "mcda-complications": {
      type: "decision",
      title: "Any complications on surveillance?",
      text: "Check for signs of TTTS or significant fetal weight discordance at each scan.",
      options: [
        { label: "Yes — complication identified", sublabel: "TTTS, discordance ≥25%, fetal anomaly etc.", next: "tertiary" },
        { label: "No — ongoing surveillance", sublabel: "Continue fortnightly scans", next: "ongoing-mc" },
      ],
    },

    "ongoing-mc": {
      type: "end",
      title: "Continue Monochorionic Surveillance",
      text: "Continue fortnightly ultrasound monitoring until birth.",
      items: [
        "TTTS screening at every scan",
        "Biometry + amniotic fluid at every scan",
        "Escalate immediately if TTTS signs or weight discordance ≥25% identified",
        "Involve tertiary FMC if complications arise",
      ],
    },

    "dcda": {
      type: "action",
      title: "DCDA Twins — Standard Multiple Pregnancy Pathway",
      text: "Dichorionic diamniotic twins have lower risk than monochorionic but require specialist MDT care.",
      items: [
        "MDT core team care throughout",
        "Ultrasound monitoring from 24 weeks: biometry (HC, AC, FL) + amniotic fluid at each scan",
        "Care plan provided at chorionicity determination",
        "Discuss preterm labour risks by 24 weeks",
        "Agree birth plan by 28 weeks",
      ],
      next: "dcda-complications",
    },

    "dcda-complications": {
      type: "decision",
      title: "Any complications on surveillance?",
      text: "Check for fetal weight discordance or other complications.",
      options: [
        { label: "Yes — complication identified", sublabel: "Discordance ≥25%, fetal anomaly etc.", next: "tertiary" },
        { label: "No — ongoing surveillance", sublabel: "Continue monitoring per schedule", next: "ongoing-dc" },
      ],
    },

    "ongoing-dc": {
      type: "end",
      title: "Continue DCDA Surveillance",
      text: "Continue ultrasound monitoring per schedule until birth.",
      items: [
        "Biometry + amniotic fluid at each scheduled scan from 24 weeks",
        "Escalate if weight discordance ≥25% or EFW below 10th centile",
        "Involve tertiary FMC if complications arise",
      ],
    },

    // ── TRIPLETS ─────────────────────────────────────────────────────────────

    "triplet-chorionicity": {
      type: "decision",
      title: "Triplet chorionicity?",
      text: "Triplet pregnancies are always higher risk. Chorionicity determines the specific risk level.",
      options: [
        { label: "Trichorionic (TCTA)", sublabel: "Three separate placentas", next: "tcta" },
        { label: "Dichorionic (DCTA)", sublabel: "Two placentas — highest-risk triplet category", next: "dcta-triplet" },
        { label: "Monochorionic (MCDA/MCMA)", sublabel: "Shared placenta — higher-risk", next: "mc-triplet" },
      ],
    },

    "tcta": {
      type: "action",
      title: "Trichorionic Triamniotic Triplets",
      text: "Three placentas, three sacs. Manage as higher-risk multiple pregnancy with MDT and tertiary input.",
      items: [
        "Seek tertiary fetal medicine centre opinion",
        "MDT core team care throughout",
        "Ultrasound surveillance for fetal weight discordance from 24 weeks",
        "Discuss preterm labour risks by 24 weeks",
        "Agree birth plan by 28 weeks",
      ],
      next: "tertiary",
    },

    "dcta-triplet": {
      type: "alert",
      title: "Dichorionic Triamniotic Triplets — Higher-Risk",
      text: "DCTA triplets are a higher-risk category requiring tertiary FMC involvement.",
      items: [
        "Involve tertiary fetal medicine centre consultant",
        "MDT core team care throughout",
        "Surveillance for TTTS (monochorionic pair) and fetal weight discordance",
        "Fortnightly scans from 16 weeks for monochorionic pair",
        "Agree birth plan by 28 weeks",
      ],
    },

    "mc-triplet": {
      type: "alert",
      title: "Monochorionic Triplets — Higher-Risk",
      text: "Monochorionic diamniotic or monoamniotic triplets are higher-risk and require tertiary FMC involvement.",
      items: [
        "Involve tertiary fetal medicine centre consultant",
        "Fortnightly ultrasound from 16 weeks for TTTS surveillance",
        "Biometry + amniotic fluid at every scan",
        "MDT core team care throughout",
        "Agree birth plan by 28 weeks",
      ],
    },

    // ── SHARED TERMINAL ──────────────────────────────────────────────────────

    "tertiary": {
      type: "end",
      title: "Involve Tertiary Fetal Medicine Centre",
      text: "Seek opinion from or refer to a tertiary level fetal medicine centre consultant.",
      items: [
        "Can be via seeking opinion (documented in notes) OR formal referral",
        "Tertiary FMC offers: fetoscopic laser ablation (TTTS), selective termination, RFA, complex fetal interventions",
        "Continue MDT core team care locally where possible",
        "Deliver care as close to the woman's home as appropriate",
      ],
    },

  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const QS46_TERTIARY_FLOWCHART = {
  id: "QS46_TERTIARY",
  title: "When to Involve Tertiary Fetal Medicine Centre",
  subtitle: "QS46 · NICE — Twin & Triplet Pregnancies",
  startId: "assess",
  nodes: {

    "assess": {
      type: "decision",
      title: "Pregnancy type?",
      text: "Determine whether the multiple pregnancy is higher-risk by type, or has developed a complication.",
      options: [
        { label: "Higher-risk pregnancy type", sublabel: "Based on chorionicity/amnionicity alone", next: "higher-risk-types" },
        { label: "Complication has developed", sublabel: "Identified on surveillance or clinically", next: "complicated" },
        { label: "Standard-risk so far", sublabel: "DCDA twins, TCTA triplets, no complications", next: "watch" },
      ],
    },

    "higher-risk-types": {
      type: "action",
      title: "Higher-Risk Pregnancy Types",
      text: "The following pregnancy types are higher-risk and require tertiary FMC involvement regardless of complications:",
      items: [
        "Monochorionic monoamniotic (MCMA) twins",
        "Dichorionic diamniotic (DCDA) triplets",
        "Monochorionic diamniotic (MCDA) triplets",
        "Monochorionic monoamniotic (MCMA) triplets",
      ],
      next: "involve",
    },

    "complicated": {
      type: "action",
      title: "Complicated Multiple Pregnancy",
      text: "Any of the following complications trigger tertiary FMC involvement:",
      items: [
        "Fetal weight discordance ≥25% AND EFW of any baby below 10th centile",
        "Fetal anomaly — structural or chromosomal",
        "Discordant fetal death (one baby died)",
        "Feto-fetal transfusion syndrome (TTTS/FFTS)",
        "Twin reverse arterial perfusion sequence (TRAP)",
        "Conjoined twins or triplets",
        "Suspected twin anaemia polycythaemia sequence (TAPS)",
      ],
      next: "involve",
    },

    "watch": {
      type: "end",
      title: "Continue Surveillance — Escalate if Needed",
      text: "Standard-risk multiple pregnancies continue on the routine MDT care pathway. Escalate to tertiary FMC if any complication develops.",
      items: [
        "DCDA twins: biometry + fluid from 24 weeks",
        "Escalate immediately if: TTTS signs, weight discordance ≥25%, fetal anomaly, or other complications",
        "Tertiary FMC should be involved promptly when any complication identified",
      ],
    },

    "involve": {
      type: "decision",
      title: "How to involve tertiary FMC?",
      text: "Two mechanisms for tertiary FMC involvement — either is acceptable.",
      options: [
        { label: "Seek opinion (phone/virtual)", sublabel: "Document discussion in woman's notes", next: "opinion" },
        { label: "Formal referral", sublabel: "Transfer care or joint consultation at FMC", next: "referral" },
      ],
    },

    "opinion": {
      type: "end",
      title: "Opinion Documented",
      text: "Consultant opinion sought from tertiary FMC and recorded in the woman's notes.",
      items: [
        "Document date, consultant name, and advice given",
        "Continue MDT care locally where possible",
        "Refer formally if the opinion recommends it or clinical situation deteriorates",
        "Deliver care as close to the woman's home as appropriate",
      ],
    },

    "referral": {
      type: "end",
      title: "Formal Tertiary Referral Made",
      text: "Woman referred to or seen at tertiary level fetal medicine centre.",
      items: [
        "FMC can offer: fetoscopic laser ablation (TTTS), selective termination via cord occlusion, radiofrequency ablation (RFA)",
        "Woman's preferences must be taken into account regarding travel",
        "Aim to maintain care locally wherever clinically safe",
        "Consider impact of distance on anxiety vs benefit of specialist input",
      ],
    },

  },
};
