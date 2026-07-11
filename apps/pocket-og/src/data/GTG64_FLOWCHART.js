// GTG64 — Identification and Management of Maternal Sepsis During and
// Following Pregnancy (RCOG Green-top Guideline No. 64, December 2024).
// Decision support only — escalate early and follow your local sepsis
// pathway/antimicrobial policy.

export const GTG64_SEPSIS_FLOWCHART = {
  id: "GTG64_SEPSIS",
  title: "Maternal Sepsis",
  subtitle: "GTG64 · Antenatal, intrapartum & postnatal",
  startId: "recognise",
  nodes: {

    "recognise": {
      type: "alert",
      title: "Suspected Maternal Sepsis?",
      text: "Pyrexia, hypothermia, tachycardia, tachypnoea, hypoxia, hypotension, oliguria, impaired consciousness, or failure to respond to treatment. A normal temperature does NOT rule out sepsis — GAS sepsis can present with a normal or low temperature and progress within hours.",
      items: [
        "Constant severe abdominal/pelvic pain not relieved by usual analgesia — red flag for genital tract sepsis",
        "Ask about sore throat/scarlet fever in the woman or household contacts (children) — group A strep",
      ],
      next: "meows",
    },

    "meows": {
      type: "decision",
      title: "Track-and-Trigger: MEOWS Result?",
      text: "Check physiological parameters against your local maternity early warning chart.",
      options: [
        { label: "One severely abnormal parameter, or ≥2 mildly abnormal", sublabel: "Trigger — escalate now regardless of how well she looks", next: "sepsis-six" },
        { label: "Not currently triggering, but sepsis still clinically suspected", sublabel: "Low threshold to proceed anyway if genital tract sepsis or GAS suspected", next: "sepsis-six" },
      ],
    },

    "sepsis-six": {
      type: "action",
      title: "Sepsis Six — Complete Within 1 Hour",
      text: "Do not wait for senior review or a confirmed source to start.",
      items: [
        "GIVE: high-flow oxygen if hypoxic/unwell",
        "GIVE: IV broad-spectrum antibiotics within 1 hour, per local antimicrobial policy",
        "GIVE: IV fluid bolus if hypotensive — minimum 20 mL/kg crystalloid if hypotensive and/or lactate >4 mmol/L",
        "TAKE: blood cultures before antibiotics if possible — don't delay antibiotics to get them",
        "TAKE: serum lactate",
        "TAKE: accurate urine output — catheterise if needed",
      ],
      next: "response-check",
    },

    "response-check": {
      type: "decision",
      title: "Responding to the Bundle?",
      options: [
        { label: "Improving — stable observations, falling lactate", next: "source-control" },
        { label: "Not improving, or hypotension persists / lactate rising", next: "escalate" },
      ],
    },

    "escalate": {
      type: "alert",
      title: "Escalate — Senior MDT Now",
      text: "Involve obstetric seniors, anaesthetics/critical care, and microbiology/infectious diseases without delay.",
      items: [
        "Vasopressors for hypotension not responding to fluids — needs critical care, not labour ward alone",
        "Consider critical care admission for vasopressor need, persistent high lactate, or multi-organ dysfunction",
      ],
      next: "source-control",
    },

    "source-control": {
      type: "action",
      title: "Identify & Control the Source",
      text: "Runs in parallel with resuscitation, not after it.",
      items: [
        "Evacuate retained products of conception if likely source",
        "Drain any collection/abscess under imaging or surgical guidance",
        "Remove infected foreign material (e.g. cervical cerclage)",
        "Consider early imaging (ultrasound/CT) if source unclear",
        "Hysterectomy — last resort for overwhelming intrauterine infection, senior MDT decision only",
        "Necrotising fasciitis red flags (pain out of proportion, spreading erythema, crepitus): immediate senior surgical review",
      ],
      next: "followup",
    },

    "followup": {
      type: "end",
      title: "Document, Debrief, Safety-Net",
      text: "Document source, time of recognition, each Sepsis Six element and when completed, antibiotics and rationale, and MDT input.",
      items: [
        "Review cultures at 48–72h; de-escalate antibiotics per sensitivities",
        "Debrief the woman and her birth partner",
        "Report severe sepsis/near-miss locally; report any sepsis death to MBRRACE-UK",
        "Give red-flag safety-netting advice before discharge",
      ],
    },

  },
};
