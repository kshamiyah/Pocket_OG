// CG565 — First Trimester Miscarriage Triage
// Covers all 5 ultrasound diagnostic states and their management pathways

export const CG565_TRIAGE_FLOWCHART = {
  id: "CG565_TRIAGE",
  title: "Miscarriage Triage Pathway",
  subtitle: "CG565 · Management of First Trimester Miscarriage",
  startId: "uss-result",
  nodes: {

    "uss-result": {
      type: "decision",
      title: "Ultrasound findings",
      text: "What does the transvaginal ultrasound show?",
      options: [
        { label: "Viable IUP, heartbeat seen", sublabel: "Threatened miscarriage", next: "viable" },
        { label: "Pregnancy of uncertain viability", sublabel: "Empty sac <25mm OR fetal pole ≤7mm with no heartbeat", next: "uncertain" },
        { label: "Complete miscarriage", sublabel: "Empty uterine cavity, endometrial thickness <15mm", next: "complete-prior-uss" },
        { label: "Incomplete miscarriage", sublabel: "Intrauterine tissue 15–50mm, no sac visible", next: "incomplete-mgmt" },
        { label: "Missed miscarriage", sublabel: "Empty sac >25mm OR CRL >7mm with no heartbeat", next: "missed-confirm" },
      ],
    },

    // ── VIABLE ────────────────────────────────────────────────────────────

    "viable": {
      type: "end",
      title: "Threatened Miscarriage: Viable IUP",
      text: "Despite bleeding, 90% of pregnancies at 8 weeks will not miscarry. Reassure the patient.",
      items: [
        "Reassure: 90% will not miscarry at 8 weeks",
        "If bleeding + history of previous miscarriage: offer progesterone (CG758)",
        "Discharge back to GP care",
        "Dating scan at 12 weeks",
        "Return to EPAGU if: very heavy bleeding (clots size of palm / soaking pads every 20 min), bleeding >14 days, pain not controlled with simple analgesia",
      ],
    },

    // ── UNCERTAIN VIABILITY ────────────────────────────────────────────────

    "uncertain": {
      type: "action",
      title: "Pregnancy of Uncertain Viability",
      text: "Findings do not yet allow confident diagnosis. A repeat scan is required.",
      items: [
        "Empty intrauterine gestation sac <25mm — no heartbeat can be confirmed yet",
        "OR fetal pole ≤7mm seen with no fetal heart activity",
        "Plan rescan in 7–14 days (minimum 14 days if transabdominal USS was used)",
        "Document findings and plan in notes",
      ],
      next: "end-uncertain",
    },

    "end-uncertain": {
      type: "end",
      title: "Await Rescan",
      text: "Rescan at 7–14 days to re-classify.",
      items: [
        "Advise patient to contact EPAGU if: very heavy bleeding, pain not controlled, concerned",
        "At rescan: re-classify using the same USS criteria",
        "If still uncertain after two scans: consultant review",
      ],
    },

    // ── COMPLETE MISCARRIAGE ───────────────────────────────────────────────

    "complete-prior-uss": {
      type: "decision",
      title: "Prior USS showing IUP in this pregnancy?",
      text: "Was an intrauterine pregnancy confirmed on a previous scan in this pregnancy?",
      options: [
        { label: "Yes, prior IUP confirmed on USS", sublabel: "Complete miscarriage can be confirmed", next: "end-complete" },
        { label: "No prior USS in this pregnancy", sublabel: "Ectopic must be excluded first", next: "bhcg-serial" },
      ],
    },

    "bhcg-serial": {
      type: "action",
      title: "Check serial βhCG, exclude ectopic",
      text: "No prior USS means ectopic cannot be excluded on USS alone. Serial βhCG required.",
      items: [
        "Take βhCG today (Day 0)",
        "Repeat βhCG in 48 hours",
        "Refer to PUL/Ectopic protocol (GL1061) in parallel",
        "Caution: falling βhCG can occur in ectopic — this does not exclude it",
      ],
      next: "bhcg-result",
    },

    "bhcg-result": {
      type: "decision",
      title: "48-hour βhCG result",
      text: "What did the serial βhCG show over 48 hours?",
      options: [
        { label: ">50% fall in 48 hours", sublabel: "Likely confirms complete miscarriage", next: "end-complete" },
        { label: "<50% fall or a rise", sublabel: "Pregnancy of Unknown Location (PUL), ectopic not excluded", next: "end-pul" },
      ],
    },

    "end-complete": {
      type: "end",
      title: "Complete Miscarriage: Discharge",
      text: "Complete miscarriage confirmed. No further intervention required.",
      items: [
        "Discharge to GP care",
        "Perform home urine pregnancy test after 3 weeks",
        "Call EPAGU if: UPT positive at 3 weeks, bleeding persists >2 weeks, very heavy bleeding, uncontrolled pain",
        "Written information and EPAGU contact number",
      ],
    },

    "end-pul": {
      type: "alert",
      title: "Pregnancy of Unknown Location (PUL)",
      text: "βhCG pattern does not confirm complete miscarriage. Ectopic pregnancy must be excluded.",
      items: [
        "Refer to PUL / Ectopic Pregnancy Protocol (GL1061 / CG623)",
        "Discuss with consultant on call",
        "Arrange further TVS",
        "Caution: falling βhCG does NOT exclude ectopic — clinical assessment essential",
      ],
    },

    // ── INCOMPLETE MISCARRIAGE ─────────────────────────────────────────────

    "incomplete-mgmt": {
      type: "decision",
      title: "Incomplete miscarriage, management approach",
      text: "Tissue 15–50mm present. Three management options. Expectant is recommended first-line.",
      options: [
        { label: "Expectant (recommended)", sublabel: "80% resolve within 3 days", next: "end-expectant-incomplete" },
        { label: "Surgical (SMM)", sublabel: "Patient preference or clinical indication", next: "end-smm" },
        { label: "Medical (select cases)", sublabel: "Single dose Misoprostol, discuss with consultant", next: "end-medical-incomplete" },
      ],
    },

    "end-expectant-incomplete": {
      type: "end",
      title: "Expectant: Incomplete Miscarriage",
      text: "80% of incomplete miscarriages resolve within 3 days.",
      items: [
        "No immediate intervention required",
        "If bleeding continues 2–3 weeks: return for repeat USS",
        "At repeat USS: may continue expectant management or opt for SMM",
        "If bleeding stops: home UPT after 3 weeks",
        "Discharge if UPT negative; call EPAGU if UPT positive",
        "Call EPAGU if: very heavy bleeding, pain not controlled, concerned",
      ],
    },

    "end-medical-incomplete": {
      type: "end",
      title: "Medical: Incomplete Miscarriage",
      text: "Medical management can be offered but has no advantage over expectant for incomplete miscarriage.",
      items: [
        "Discuss with consultant on call before proceeding",
        "Single dose Misoprostol 800mcg PV",
        "Follow up per Medical Management of Miscarriage protocol (CG621)",
        "~20% will require surgical management (SMM)",
      ],
    },

    "end-smm": {
      type: "end",
      title: "Surgical Management of Miscarriage (SMM)",
      text: "Previously ERPC. Provides certainty of time to resolution.",
      items: [
        "Book as elective day case (unless emergency → emergency theatre list)",
        "Pre-op: MRSA swabs, FBC, Rh Group & Save (valid within 3 days)",
        "Cervical preparation: Misoprostol 600mcg PV 1–2hrs pre-op",
        "(400mcg if previous caesarean section)",
        "Intra-op antibiotics: Metronidazole 1g PR + Doxycycline 100mg BD × 7 days",
        "Anti-D immunoglobulin: Rh-negative women (at time of procedure)",
        "Send POC to histology (pink consent form required); no routine follow-up needed",
      ],
    },

    // ── MISSED MISCARRIAGE ─────────────────────────────────────────────────

    "missed-confirm": {
      type: "action",
      title: "Missed Miscarriage: Offer Confirmatory Scan",
      text: "Diagnosis requires confirmation before management is planned.",
      items: [
        "Offer a confirmation scan by a second trained sonographer or doctor",
        "Ideally same day",
        "USS criteria: empty sac >25mm; OR CRL >7mm with no heartbeat; OR no change in size over 1 week (if earlier sac <25mm or CRL <7mm)",
        "Explain diagnosis sensitively; give information leaflet",
      ],
      next: "missed-ci",
    },

    "missed-ci": {
      type: "decision",
      title: "Contraindications to expectant management?",
      text: "Is any of the following present? If yes, explore other options first.",
      options: [
        { label: "No contraindications", sublabel: "Expectant management is appropriate first-line", next: "missed-mgmt" },
        { label: "Contraindication present:", sublabel: "Late first trimester · Coagulopathy · Unable to transfuse · Previous traumatic pregnancy loss · Evidence of infection", next: "missed-mgmt-no-expectant" },
      ],
    },

    "missed-mgmt": {
      type: "decision",
      title: "Missed miscarriage, management approach",
      text: "Expectant is first-line. All three options should be discussed.",
      options: [
        { label: "Expectant (first-line)", sublabel: "90% resolve within 3 weeks", next: "end-expectant-missed" },
        { label: "Medical (CG621)", sublabel: "Mifepristone + Misoprostol, fewer emergency admissions", next: "end-medical-missed" },
        { label: "Surgical (SMM)", sublabel: "Provides certainty; no follow-up needed", next: "end-smm" },
      ],
    },

    "missed-mgmt-no-expectant": {
      type: "decision",
      title: "Preferred management (expectant contraindicated)",
      text: "Expectant management is not recommended in this case.",
      options: [
        { label: "Medical (CG621)", sublabel: "Mifepristone + Misoprostol; fewer admissions than expectant", next: "end-medical-missed" },
        { label: "Surgical (SMM)", sublabel: "Provides certainty; no follow-up needed", next: "end-smm" },
      ],
    },

    "end-expectant-missed": {
      type: "end",
      title: "Expectant: Missed Miscarriage",
      text: "90% will commence naturally within 3 weeks of diagnosis.",
      items: [
        "Timing of commencement is unpredictable — patient must be counselled",
        "Avoids surgical and anaesthetic risks",
        "Routine follow-up at 2–3 weeks",
        "If incomplete at follow-up: repeat USS; reconsider options",
        "30% will ultimately require surgical management (vs. 20% for medical)",
        "Call EPAGU if: very heavy bleeding, pain not controlled, concerned",
      ],
    },

    "end-medical-missed": {
      type: "end",
      title: "Medical: Missed Miscarriage",
      text: "Mifepristone + Misoprostol per CG621. 80% success rate.",
      items: [
        "See Medical Management of Miscarriage protocol (CG621)",
        "Faster, more predictable commencement of bleeding than expectant",
        "Fewer emergency admissions than expectant management",
        "~20% will require surgical management (SMM)",
        "Follow-up as per CG621 protocol",
      ],
    },

  },
};
