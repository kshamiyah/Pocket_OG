// GTG36 — Prevention of Early-onset Neonatal Group B Streptococcal Disease
// (RCOG Green-top Guideline No. 36, 3rd edition, September 2017).
// Antenatal/intrapartum risk factor screen through to the neonatal
// observation pathway (NICE NG195). Exact antibiotic doses are in GL787.

export const GTG36_GBS_FLOWCHART = {
  id: "GTG36_GBS",
  title: "GBS: Prophylaxis & Neonatal Observation",
  subtitle: "GTG36 · Risk factors through to newborn observation",
  startId: "risk-factor-check",
  nodes: {

    "risk-factor-check": {
      type: "decision",
      title: "Any GBS Risk Factor Present?",
      text: "GBS on a swab or urine culture this pregnancy, previous baby with invasive GBS disease, preterm labour <37 weeks, rupture of membranes ≥18 hours, or intrapartum pyrexia ≥38°C.",
      options: [
        { label: "Yes — one or more present", next: "offer-iap" },
        { label: "No known risk factor", next: "no-iap" },
      ],
    },

    "no-iap": {
      type: "end",
      title: "No GBS-Specific IAP Indicated",
      text: "Unknown GBS status alone, with no other risk factor, is not itself an indication for prophylaxis. Planned pre-labour caesarean with intact membranes also doesn't need GBS-specific IAP — the routine surgical antibiotic dose still applies.",
    },

    "offer-iap": {
      type: "action",
      title: "Offer Intrapartum Antibiotic Prophylaxis (IAP)",
      text: "Counsel on the benefit, and on the right to decline. See GL787 for antibiotic choice and dosing (including penicillin allergy).",
      items: [
        "GBS bacteriuria: treat the bacteriuria at diagnosis AND still offer IAP in labour",
        "Start as soon as labour is confirmed or membranes rupture — don't wait for established labour",
        "Intrapartum pyrexia ≥38°C: manage as possible chorioamnionitis, not GBS prophylaxis alone",
      ],
      next: "birth",
    },

    "birth": {
      type: "decision",
      title: "After Birth — Is the Baby Well?",
      options: [
        { label: "Well, risk factor present (± IAP given)", next: "observation" },
        { label: "Red flag present", next: "red-flag" },
      ],
    },

    "observation": {
      type: "end",
      title: "Clinical Observation ≥12 Hours",
      text: "Regular checks of colour, tone, feeding, breathing and temperature — not a single check at birth.",
      items: [
        "A well baby who received adequate IAP does not routinely need blood tests or antibiotics",
        "Safety-net parents before discharge: poor feeding, drowsiness/irritability, fast or noisy breathing, high or low temperature — urgent review",
      ],
    },

    "red-flag": {
      type: "alert",
      title: "Red Flag — Start Empirical Treatment",
      text: "Temperature instability, respiratory distress, poor feeding, abnormal tone/responsiveness, seizures, or other signs of clinical instability.",
      items: [
        "Start empirical IV antibiotics promptly — benzylpenicillin plus gentamicin, standard first line",
        "Admit for enhanced monitoring",
        "Stop around 36h if cultures negative, well, and inflammatory markers reassuring; minimum 7 days if culture-positive or ongoing clinical suspicion",
      ],
    },

  },
};
