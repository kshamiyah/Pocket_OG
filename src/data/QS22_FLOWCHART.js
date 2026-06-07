// QS22 — Antenatal Care (NICE)
// Flowchart: Appointment Schedule by Parity

export const QS22_APPOINTMENTS_FLOWCHART = {
  id: "QS22_APPOINTMENTS",
  title: "Antenatal Appointment Schedule by Parity",
  subtitle: "QS22 · NICE — Antenatal Care",
  startId: "booking",
  nodes: {

    "booking": {
      type: "action",
      title: "Booking Appointment — by 10 Weeks",
      text: "All women should have a booking appointment by 10 weeks gestation. Late presenters should still be offered booking and all relevant care.",
      items: [
        "Complete risk assessment: VTE, GDM, pre-eclampsia, FGR, mental health, domestic abuse, consanguinity",
        "Offer CO test and opt-out referral to stop smoking service if CO ≥4 ppm",
        "Offer healthy eating advice and food safety information",
        "Offer flu vaccine (if appropriate season) and pertussis vaccine information",
        "Identify complex social factors (substance misuse, domestic abuse, homelessness, recent immigration)",
        "Establish small named midwife team (4–8 midwives) for continuity of carer",
      ],
      next: "parity",
    },

    "parity": {
      type: "decision",
      title: "Parity?",
      text: "The number of appointments differs by parity. Nulliparous women have 10 appointments; multiparous women have 7.",
      options: [
        { label: "Nulliparous", sublabel: "First pregnancy — 10 appointments", next: "nulliparous-schedule" },
        { label: "Multiparous", sublabel: "Previous birth — 7 appointments", next: "multiparous-schedule" },
      ],
    },

    "nulliparous-schedule": {
      type: "action",
      title: "Nulliparous — 10 Appointments",
      text: "Recommended antenatal appointment schedule for women in their first pregnancy.",
      items: [
        "Booking (by 10 weeks) — risk assessment, booking bloods, history",
        "16 weeks — review screening results, discuss anomaly scan",
        "20 weeks — anomaly scan (18+0 to 20+6)",
        "25 weeks — BP, urine, symphysis-fundal height (SFH), review anomaly scan",
        "28 weeks — BP, urine, SFH, full blood count, antibody screen",
        "31 weeks — BP, urine, SFH",
        "34 weeks — BP, urine, SFH, review birth and feeding plan",
        "36 weeks — BP, urine, SFH, presentation, CO test, GBS info, discuss birth options",
        "38 weeks — BP, urine, SFH",
        "40 weeks — BP, urine, SFH, offer membrane sweep, discuss post-dates options",
        "41 weeks — if not delivered: offer membrane sweep, discuss induction of labour",
      ],
      next: "complications",
    },

    "multiparous-schedule": {
      type: "action",
      title: "Multiparous — 7 Appointments",
      text: "Recommended antenatal appointment schedule for women who have had a previous birth.",
      items: [
        "Booking (by 10 weeks) — risk assessment, booking bloods, history",
        "16 weeks — review screening results",
        "20 weeks — anomaly scan (18+0 to 20+6)",
        "28 weeks — BP, urine, SFH, full blood count, antibody screen",
        "34 weeks — BP, urine, SFH, review birth and feeding plan",
        "36 weeks — BP, urine, SFH, presentation, CO test",
        "38 weeks — BP, urine, SFH",
        "41 weeks — if not delivered: offer membrane sweep, discuss induction of labour",
      ],
      next: "complications",
    },

    "complications": {
      type: "decision",
      title: "Any risk factors or complications identified?",
      text: "Additional appointments are scheduled if risk factors or complications are identified at any point.",
      options: [
        { label: "Yes — risk factors identified", sublabel: "Increase frequency per risk", next: "additional-care" },
        { label: "No — low risk, routine care", sublabel: "Continue standard schedule", next: "routine-end" },
      ],
    },

    "additional-care": {
      type: "end",
      title: "Additional Appointments Required",
      text: "Extra appointments are added to the standard schedule based on risk factors or complications.",
      items: [
        "Hypertension or pre-eclampsia risk: more frequent BP and urine monitoring",
        "GDM or risk factors: glucose tolerance test (GTT) at 24–28 weeks",
        "FGR risk or small-for-dates: serial growth scans from 26–28 weeks",
        "VTE: LMWH prescribing and monitoring plan",
        "Mental health concerns: liaison with perinatal mental health team",
        "Domestic abuse: safe enquiry, MARAC referral if indicated",
        "Obstetric history (e.g. previous CS, PPH): obstetric-led care",
      ],
    },

    "routine-end": {
      type: "end",
      title: "Routine Antenatal Pathway Complete",
      text: "Continue with standard appointment schedule. Reassess at each visit.",
      items: [
        "Reassess risk at every appointment — new risks can develop at any gestation",
        "Offer membrane sweep at 40 weeks (nulliparous) and 41 weeks (all women)",
        "Discuss induction of labour at or after 41 weeks if not delivered",
        "Postnatal contact: within 24 hours of discharge and at 10–14 days",
      ],
    },

  },
};
