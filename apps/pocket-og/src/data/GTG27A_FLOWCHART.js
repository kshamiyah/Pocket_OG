// GTG27a — Placenta Praevia and Placenta Accreta Spectrum: Diagnosis and
// Management (RCOG Green-top Guideline No. 27a, September 2018).
// Antenatal planning pathway — not an acute emergency algorithm. For active
// bleeding, manage as antepartum haemorrhage (GTG63) alongside this plan.

export const GTG27A_PAS_FLOWCHART = {
  id: "GTG27A_PAS",
  title: "Placenta Praevia & Accreta Spectrum",
  subtitle: "GTG27a · Antenatal planning pathway",
  startId: "scan-finding",
  nodes: {

    "scan-finding": {
      type: "decision",
      title: "Placenta Low-Lying or Praevia at the Anomaly Scan?",
      text: "Placenta praevia = covers the internal os. Low-lying = placental edge <20 mm from the os (TVS is superior to TAS/transperineal, and safe).",
      options: [
        { label: "Yes — low-lying or praevia", next: "rescan-32" },
        { label: "No — normal placental site", next: "no-further-action" },
      ],
    },

    "no-further-action": {
      type: "end",
      title: "Routine Antenatal Care",
      text: "No further placental scanning indicated on this basis.",
    },

    "rescan-32": {
      type: "action",
      title: "Rescan With TVS at ~32 Weeks",
      text: "Many low-lying placentas resolve as the lower segment develops — confirm persistence before acting on the mid-trimester finding.",
      next: "pas-risk-check",
    },

    "pas-risk-check": {
      type: "decision",
      title: "Any Risk Factors for Placenta Accreta Spectrum?",
      text: "Previous caesarean section, other uterine surgery, IVF conception — especially combined with praevia over the scar.",
      options: [
        { label: "Yes — PAS risk factors present", next: "pas-features" },
        { label: "No — praevia/low-lying alone", next: "rescan-36" },
      ],
    },

    "pas-features": {
      type: "action",
      title: "Look for Ultrasound Features of PAS",
      text: "Loss of retroplacental clear zone, myometrial thinning, placental lacunae, bladder wall interruption, bridging vessels on colour Doppler. Consider MRI as an adjunct via the specialist team if equivocal.",
      next: "pas-suspected-check",
    },

    "pas-suspected-check": {
      type: "decision",
      title: "PAS Suspected on Imaging?",
      options: [
        { label: "Yes — high probability of PAS", next: "mdt-referral" },
        { label: "No convincing features", next: "rescan-36" },
      ],
    },

    "mdt-referral": {
      type: "alert",
      title: "Refer to Specialist PAS MDT — Antenatally",
      text: "Senior obstetric, anaesthetic and neonatal input, agreed access to blood products, critical care and interventional radiology.",
      items: [
        "Avoid digital vaginal examination",
        "Single course of antenatal corticosteroids 34+0–35+6 weeks (earlier if other preterm risk factors)",
        "Plan birth in the specialist centre — typically discussed in the 35–37 week range, balancing prematurity against the risk of labour starting first",
      ],
      next: "delivery-plan",
    },

    "rescan-36": {
      type: "action",
      title: "Further TVS at ~36 Weeks",
      text: "Confirms final placental position and guides mode/timing of birth.",
      items: [
        "Avoid digital vaginal examination",
        "Single course of antenatal corticosteroids 34+0–35+6 weeks (earlier if other preterm risk factors)",
        "Agree an individualised admission threshold — outpatient care is reasonable for stable, asymptomatic women with rapid access to the unit",
      ],
      next: "delivery-plan",
    },

    "delivery-plan": {
      type: "end",
      title: "Planned Birth",
      text: "Uncomplicated praevia, no PAS suspicion: planned caesarean ~36–37 weeks. Suspected PAS: caesarean hysterectomy (placenta left in situ, not separated) in a specialist centre with the full MDT and major haemorrhage protocol ready. Bring delivery forward for bleeding, labour, or any other obstetric indication.",
    },

  },
};
