// GTG20a/b — Breech presentation at term: ECV through to intrapartum
// management of vaginal breech birth (RCOG Green-top Guidelines No. 20a
// and 20b, 2nd edition, 2017). Decision support only.

export const GTG20_BREECH_FLOWCHART = {
  id: "GTG20_BREECH",
  title: "Breech at Term: ECV to Birth",
  subtitle: "GTG20a/b · External cephalic version through to vaginal breech birth",
  startId: "ecv-eligible",
  nodes: {

    "ecv-eligible": {
      type: "decision",
      title: "Any Contraindication to ECV?",
      text: "Absolute: independent indication for caesarean already present, APH in last 7 days, abnormal CTG, ruptured membranes, multiple pregnancy (except 2nd twin), major uterine anomaly.",
      options: [
        { label: "No contraindication — offer ECV", next: "ecv-attempt" },
        { label: "Contraindication present", next: "mode-discussion" },
      ],
    },

    "ecv-attempt": {
      type: "action",
      title: "ECV From 36 Weeks (Nulliparous) / 37 Weeks (Multiparous)",
      text: "Confirm presentation/liquor/placenta on ultrasound, CTG before and after, tocolytic (terbutaline) to improve success. Where facilities for immediate caesarean are available.",
      items: [
        "Anti-D for RhD-negative women afterwards, regardless of outcome",
        "Can be stopped at any point at the woman's request",
      ],
      next: "ecv-outcome",
    },

    "ecv-outcome": {
      type: "decision",
      title: "ECV Successful?",
      options: [
        { label: "Yes — cephalic", next: "cephalic-outcome" },
        { label: "No — remains breech, or declined", next: "mode-discussion" },
      ],
    },

    "cephalic-outcome": {
      type: "end",
      title: "Plan for Cephalic Birth",
      text: "Fewer than 1 in 20 babies turn back to breech after a successful ECV — routine antenatal care and birth planning continue as for a cephalic pregnancy.",
    },

    "mode-discussion": {
      type: "decision",
      title: "Any Higher-Risk Factor for Vaginal Breech Birth?",
      text: "Footling presentation, hyperextended neck on ultrasound, EFW >3.8kg or <10th centile, evidence of antenatal fetal compromise, or an existing independent indication for caesarean.",
      options: [
        { label: "Yes — one or more present", next: "recommend-cs" },
        { label: "No — reasonable candidate for vaginal breech birth", next: "vaginal-plan" },
      ],
    },

    "recommend-cs": {
      type: "end",
      title: "Planned Caesarean Recommended",
      text: "Footling presentation and a hyperextended neck are generally treated as strong reasons against a vaginal attempt. Still an individualised discussion, not an automatic rule.",
    },

    "vaginal-plan": {
      type: "action",
      title: "Plan Vaginal Breech Birth",
      text: "Safety depends on case selection, an experienced attendant for the whole labour, and how it's managed — not just at delivery.",
      items: [
        "Continuous CTG throughout labour",
        "'Hands off the breech' — no traction until scapulae visible",
        "Passive second stage up to 90 minutes is acceptable before active pushing",
        "Oxytocin augmentation used cautiously, mainly for inadequate contraction frequency",
      ],
      next: "progress-check",
    },

    "progress-check": {
      type: "decision",
      title: "Progress Adequate?",
      options: [
        { label: "Yes — descending as expected", next: "delivery" },
        { label: "Poor progress despite adequate contractions", next: "caesarean-intrapartum" },
      ],
    },

    "caesarean-intrapartum": {
      type: "end",
      title: "Move to Caesarean Section",
      text: "Poor progress despite adequate contractions is a clear stop-and-reassess trigger — don't push on and see.",
    },

    "delivery": {
      type: "end",
      title: "Delivery — Manoeuvres if Needed",
      text: "If spontaneous descent stalls: Løvset's manoeuvre for the arms, Mauriceau–Smellie–Veit for the aftercoming head. Call for senior help early if extraction isn't straightforward.",
    },

  },
};
