// GTG22 — Anti-D Prophylaxis (RCOG Green-top Guideline No. 22; RAADP dosing
// per NICE TA156). Decision support only — confirm local product/dose
// availability and involve haematology/the transfusion lab for FMH > 4 mL.

export const GTG22_ANTID_FLOWCHART = {
  id: "GTG22_ANTID",
  title: "Anti-D Prophylaxis",
  subtitle: "GTG22 · RhD-negative, not known to be sensitised",
  startId: "indication",
  nodes: {

    "indication": {
      type: "decision",
      title: "What Is the Indication for Anti-D?",
      text: "Confirm the woman is RhD negative and not known to be already sensitised (immune anti-D on her antibody screen) before proceeding.",
      options: [
        { label: "Routine antenatal prophylaxis (RAADP)", sublabel: "No sensitising event — background third-trimester cover", next: "raadp" },
        { label: "Potentially sensitising event", sublabel: "e.g. miscarriage, ectopic, ECV, APH, abdominal trauma, invasive procedure", next: "event-gestation" },
        { label: "Postnatal, after birth", sublabel: "Check cord blood group", next: "postnatal" },
      ],
    },

    "raadp": {
      type: "action",
      title: "Give Routine Antenatal Anti-D Prophylaxis",
      text: "Confirm the 28-week antibody screen is unsensitised before giving RAADP. Use whichever regimen is stocked locally.",
      items: [
        "Single-dose: 1500 IU at 28 weeks, or any time 28–30 weeks",
        "Two-dose: 500 IU at 28 weeks + 500 IU at 34 weeks",
        "Two-dose (alternative product): 1000–1650 IU at 28 weeks + 1000–1650 IU at 34 weeks",
        "RAADP is separate from — not a substitute for — any sensitising-event dose given earlier in the same pregnancy",
      ],
      next: "postnatal-reminder",
    },

    "event-gestation": {
      type: "decision",
      title: "Gestation at Time of the Event?",
      options: [
        { label: "Before 20+0 weeks", next: "dose-early" },
        { label: "20+0 weeks or later", next: "dose-late" },
      ],
    },

    "dose-early": {
      type: "end",
      title: "250 IU Anti-D Ig IM",
      text: "Give within 72 hours of the event (up to 10 days may still offer some protection if 72 hours is missed).",
      items: [
        "FMH quantification (Kleihauer/flow cytometry) not routinely required at this gestation",
        "Document the event, dose, batch number and timing",
        "If bleeding is recurrent, consider FMH estimation every 2 weeks to check whether an extra dose is needed",
      ],
    },

    "dose-late": {
      type: "action",
      title: "500 IU Anti-D Ig IM + FMH Quantification",
      text: "Give within 72 hours of the event. Take a sample for Kleihauer or flow cytometry alongside the dose.",
      items: [
        "500 IU covers a feto-maternal haemorrhage of up to 4 mL fetal red cells",
        "If Kleihauer suggests FMH >4 mL, confirm with flow cytometry — don't delay treatment awaiting confirmation if the estimate is already high",
      ],
      next: "fmh-check",
    },

    "fmh-check": {
      type: "decision",
      title: "FMH Greater Than 4 mL?",
      options: [
        { label: "Yes", next: "extra-dose" },
        { label: "No", next: "dose-late-done" },
      ],
    },

    "dose-late-done": {
      type: "end",
      title: "Standard Dose Sufficient",
      text: "Document the event, dose, batch number, timing and FMH result.",
    },

    "extra-dose": {
      type: "end",
      title: "Give Additional Anti-D Ig",
      text: "Calculate the extra dose at 125 IU per mL of fetal red cells in excess of the 4 mL already covered — confirm the figure for the product in local stock with the transfusion laboratory.",
      items: [
        "Recheck a follow-up sample for clearance: ~48 hours after an IV dose, ~72 hours after an IM dose",
        "If fetal cells persist, give a further dose and recheck again",
        "Large FMH is itself a marker of possible fetal anaemia — consider fetal medicine input regardless of maternal dosing",
      ],
    },

    "postnatal": {
      type: "decision",
      title: "Cord Blood Group of the Baby?",
      text: "Take cord blood at every delivery to a RhD-negative woman.",
      options: [
        { label: "RhD positive", next: "postnatal-dose" },
        { label: "RhD negative", next: "postnatal-negative" },
        { label: "Not known / result delayed", next: "postnatal-dose" },
      ],
    },

    "postnatal-negative": {
      type: "end",
      title: "No Anti-D Required",
      text: "Baby confirmed RhD negative — no maternal sensitisation risk from this delivery. Document the cord group result.",
    },

    "postnatal-dose": {
      type: "action",
      title: "500 IU Anti-D Ig IM Within 72 Hours of Delivery",
      text: "Give on the assumption the baby may be RhD positive if the group isn't yet known — anti-D can be withheld only once RhD-negative status is confirmed.",
      items: [
        "Take a maternal sample for FMH quantification alongside the dose",
        "Required after every RhD-positive delivery regardless of mode of birth or whether RAADP was given antenatally",
      ],
      next: "fmh-check",
    },

    "postnatal-reminder": {
      type: "end",
      title: "RAADP Given — Postnatal Anti-D Still Required",
      text: "RAADP does not cover delivery itself. Take cord blood at birth and give postnatal anti-D if the baby is RhD positive.",
    },

  },
};
