// BASHH UK Guidelines for the Management of Syphilis (2024)
// Staging to treatment.

export const BASHH_SYPHILIS_TREATMENT_FLOWCHART = {
  id: "BASHH_SYPHILIS_TREATMENT",
  title: "Syphilis: Staging to Treatment",
  subtitle: "BASHH 2024",
  startId: "confirm",
  nodes: {

    "confirm": {
      type: "action",
      title: "Confirm Diagnosis & Stage",
      text: "Serology (treponemal + non-treponemal), supported by dark-field microscopy/PCR if a lesion is present.",
      items: ["Screen for HIV and other STIs at diagnosis", "Establish pregnancy status — changes the urgency and desensitisation pathway"],
      next: "stage",
    },

    "stage": {
      type: "decision",
      title: "What Stage?",
      options: [
        { label: "Primary, secondary, or early latent (<2 years)", next: "early-treatment" },
        { label: "Late latent, unknown duration, cardiovascular or gummatous", next: "late-treatment" },
        { label: "Neurological features (neurosyphilis suspected)", next: "neuro" },
      ],
    },

    "early-treatment": {
      type: "action",
      title: "Early Syphilis Treatment",
      items: [
        "Benzathine benzylpenicillin 2.4 MU IM, single dose",
        "Penicillin allergy: doxycycline 100 mg twice daily for 14 days",
      ],
      next: "herx-warning",
    },

    "late-treatment": {
      type: "action",
      title: "Late Latent / Unknown Duration Treatment",
      items: [
        "Benzathine benzylpenicillin 2.4 MU IM, weekly for 3 weeks",
        "Penicillin allergy: doxycycline 100 mg twice daily for 28 days",
      ],
      next: "herx-warning",
    },

    "neuro": {
      type: "end",
      title: "Neurosyphilis",
      text: "Inpatient IV benzylpenicillin — discuss with a specialist rather than treating as outpatient IM therapy.",
    },

    "herx-warning": {
      type: "action",
      title: "Warn About Jarisch-Herxheimer Reaction",
      text: "Fever, myalgia, headache within 24 hours of the first dose — not a penicillin allergy, treatment continues.",
      items: ["In pregnancy: monitor for preterm labour if it occurs"],
      next: "pregnancy-check",
    },

    "pregnancy-check": {
      type: "decision",
      title: "Pregnant?",
      options: [
        { label: "Yes", next: "pregnancy-path" },
        { label: "No", next: "follow-up" },
      ],
    },

    "pregnancy-path": {
      type: "end",
      title: "Pregnancy Pathway",
      items: [
        "Penicillin-allergic: desensitise — no fully effective non-penicillin alternative for preventing congenital infection",
        "Second half of pregnancy: sonographic assessment for fetal infection",
        "Agree a paediatric plan antenatally, before delivery",
      ],
    },

    "follow-up": {
      type: "end",
      title: "Serological Follow-Up",
      text: "Repeat non-treponemal titres to confirm an adequate treatment response; partner notification per stage-specific look-back period.",
    },

  },
};
