// Suspected ovarian mass triage
// RCOG Green-top Guideline No. 62 (Nov 2011, premenopausal) and No. 34
// (Jul 2016, amended Dec 2025, postmenopausal)

export const ADNEXAL_MASS_TRIAGE_FLOWCHART = {
  id: "ADNEXAL_MASS_TRIAGE",
  title: "Suspected Ovarian Mass Triage",
  subtitle: "GTG62 / GTG34 · Premenopausal & postmenopausal ovarian cysts",
  startId: "found-mass",
  nodes: {

    "found-mass": {
      type: "action",
      title: "Ovarian Cyst / Mass Found on Imaging",
      text: "History, examination and CA125 in every woman with a suspected ovarian mass.",
      items: [
        "Do not check CA125 during menstruation — false positives are common",
        "CA125 can also be raised by fibroids, endometriosis, pregnancy, PID or liver disease",
        "Age <40: add hCG, AFP and LDH if imaging features are concerning (germ cell tumour markers)",
      ],
      next: "suspicious-check",
    },

    "suspicious-check": {
      type: "decision",
      title: "Any Suspicious Features?",
      text: "Rapid growth, ascites, solid or papillary areas, bilaterality, or strong clinical suspicion.",
      options: [
        { label: "Yes — suspicious features present", next: "refer-oncology" },
        { label: "No — reassuring appearance", next: "menopausal-status" },
      ],
    },

    "refer-oncology": {
      type: "end",
      title: "Calculate RMI and Refer",
      text: "RMI = U × M × CA125 (U: 0 / 1 / 3 by ultrasound features; M: 1 premenopausal, 3 postmenopausal).",
      items: [
        "RMI >200 (some centres use 250 — verify against local protocol), or strong clinical suspicion regardless of RMI, → refer to the gynaecological oncology MDT before any surgery",
        "Staging imaging (CT chest/abdomen/pelvis ± MRI pelvis) as directed by the MDT",
        "Avoid cyst rupture at any subsequent surgery — use a retrieval bag if minimal access surgery is used",
      ],
    },

    "menopausal-status": {
      type: "decision",
      title: "Menopausal Status?",
      options: [
        { label: "Premenopausal", next: "pre-size" },
        { label: "Postmenopausal", next: "post-size" },
      ],
    },

    "pre-size": {
      type: "decision",
      title: "Premenopausal: Cyst Features?",
      options: [
        { label: "Simple, unilocular, <5 cm, CA125 normal", next: "pre-conservative" },
        { label: "Simple, 5–7 cm, or CA125 mildly raised", next: "pre-refer" },
        { label: "Complex, or >7 cm", next: "refer-oncology" },
      ],
    },

    "pre-conservative": {
      type: "end",
      title: "Conservative Management",
      text: "Malignancy in an asymptomatic simple premenopausal cyst of this size is rare (around 1 in 1000).",
      items: [
        "Repeat ultrasound at 3–6 months",
        "Discharge if the cyst is unchanged or smaller after 1 year",
        "Many resolve spontaneously — likely functional",
      ],
    },

    "pre-refer": {
      type: "end",
      title: "Routine Gynaecology Referral",
      items: [
        "Further imaging or gynaecology opinion",
        "Interval rescan per local protocol (verify against local protocol)",
        "Calculate RMI if any uncertainty about risk",
      ],
    },

    "post-size": {
      type: "decision",
      title: "Postmenopausal: Cyst Features?",
      options: [
        { label: "Simple, unilocular, ≤3 cm", next: "post-no-followup" },
        { label: "Simple, 3–5 cm, CA125 normal", next: "post-conservative" },
        { label: "Complex, >5 cm, or CA125 raised", next: "refer-oncology" },
      ],
    },

    "post-no-followup": {
      type: "end",
      title: "No Routine Follow-up Needed",
      text: "December 2025 RCOG/RCR consensus, supported by BGCS and BSUR.",
      items: [
        "Unilateral, unilocular, simple cysts ≤3 cm on imaging in postmenopausal women do not need routine surveillance",
        "Re-image only if new symptoms develop",
      ],
    },

    "post-conservative": {
      type: "end",
      title: "Conservative Management with Surveillance",
      items: [
        "Yearly ultrasound and CA125",
        "Discharge if stable",
        "Refer if the cyst enlarges or CA125 rises",
      ],
    },

  },
};
