// GTG52 — Postpartum Haemorrhage Management
// Blood loss assessment → minor → major → massive / MHP escalation

export const GTG52_PPH_FLOWCHART = {
  id: "GTG52_PPH",
  title: "PPH Management",
  subtitle: "GTG52 · Postpartum Haemorrhage",
  startId: "assess",
  nodes: {

    "assess": {
      type: "action",
      title: "Post-Delivery — Assess Blood Loss",
      text: "Estimate and document blood loss immediately after delivery. Active management of third stage should already have been given (oxytocin 10 IU IM). Rub up a contraction if uterus is atonic.",
      items: [
        "Visually estimate blood loss — weigh swabs where possible",
        "Assess uterine tone — bimanual compression if atonic",
        "Assess maternal haemodynamic status: BP, pulse, consciousness",
        "Check placenta is complete; inspect the perineum and vagina for trauma",
      ],
      next: "blood_loss",
    },

    "blood_loss": {
      type: "decision",
      title: "Estimated Blood Loss?",
      text: "Classify the haemorrhage to guide escalation. Do not wait for symptoms — haemodynamic compromise is a late sign.",
      options: [
        { label: "< 500 ml — normal", sublabel: "Routine third-stage management complete", next: "normal" },
        { label: "500–1000 ml — Minor PPH", sublabel: "Initiate measures; escalation if no response", next: "minor" },
        { label: "> 1000 ml — Major PPH", sublabel: "Activate major PPH response immediately", next: "major" },
      ],
    },

    "normal": {
      type: "end",
      title: "Normal Blood Loss — Active Management Complete",
      text: "Blood loss within expected range. Ensure active management of third stage is documented.",
      items: [
        "Confirm placenta complete and uterus well-contracted",
        "Monitor BP, pulse, and lochia for 1 hour postpartum",
        "Document blood loss and AMTSL in notes",
        "Advise woman and partner on signs of late PPH to watch for at home",
      ],
    },

    "minor": {
      type: "action",
      title: "Minor PPH — 500–1000 ml",
      text: "Call for help. Begin treatment immediately. Do not delay for results.",
      items: [
        "Inform midwife in charge and on-call obstetrician",
        "IV access: 16G cannula × 1; send FBC, coag, U&E, G&S",
        "IV crystalloid resuscitation (Hartmann's / 0.9% saline)",
        "Catheterise — target urine output >30 ml/hr",
        "Bimanual uterine compression if atonic",
        "Uterotonics: oxytocin 5 IU IV slowly, then 40 IU in 500 ml Hartmann's at 125 ml/hr",
        "Ergometrine 500 mcg IM/IV if oxytocin alone insufficient (avoid if hypertensive or cardiac disease)",
        "Inspect placenta (complete?), cavity, cervix, vagina, and perineum",
      ],
      next: "minor_response",
    },

    "minor_response": {
      type: "decision",
      title: "Response to Treatment?",
      text: "Reassess after initial measures. Escalate if loss approaches 1000 ml or haemodynamic compromise develops.",
      options: [
        { label: "Controlled — bleeding settled", sublabel: "Continue monitoring; ensure cause addressed", next: "minor_resolved" },
        { label: "Not controlled / approaching 1000 ml", sublabel: "Escalate to Major PPH protocol", next: "major" },
      ],
    },

    "minor_resolved": {
      type: "end",
      title: "Minor PPH — Resolved",
      text: "Bleeding controlled with initial measures.",
      items: [
        "Continue oxytocin infusion for at least 4 hours",
        "Hourly BP, pulse and urine output for 4 hours",
        "Check FBC result — transfuse if Hb <80 g/L or symptomatic",
        "Document cause, management and response in notes",
        "Low threshold to escalate if any clinical deterioration",
      ],
    },

    "major": {
      type: "alert",
      title: "Major PPH — > 1000 ml — ESCALATE NOW",
      text: "Major haemorrhage response: do not delay awaiting laboratory results. Every minute matters.",
      items: [
        "Call senior midwife, senior obstetrician, and anaesthetist",
        "Alert theatre team — surgical intervention may be required",
        "Activate local Major PPH Protocol",
      ],
      next: "major_resus",
    },

    "major_resus": {
      type: "action",
      title: "Resuscitation & Pharmacological Treatment",
      text: "Simultaneous resuscitation and haemostasis. Assign roles clearly.",
      items: [
        "2 × large bore IV cannulae (14G or 16G); crossmatch 4 units",
        "Rapid crystalloid: Hartmann's up to 1.5–2 L pending blood products",
        "O-negative blood if life-threatening haemorrhage before crossmatch",
        "Tranexamic acid (TXA) 1 g IV over 10 minutes — give ASAP, within 3 hours of birth",
        "Carboprost (Hemabate) 0.25 mg IM every 15 min, max 8 doses (contraindicated in asthma)",
        "Misoprostol 800 mcg PR / sublingual",
        "Keep patient warm; treat acidosis and hypocalcaemia (10 ml 10% calcium gluconate)",
        "Targets: Hb > 80 g/L · Plt > 75 × 10⁹/L · fibrinogen > 2 g/L",
      ],
      next: "blood_products",
    },

    "blood_products": {
      type: "action",
      title: "Blood Products",
      text: "Transfuse to targets. Use ROTEM/TEG for point-of-care guidance if available.",
      items: [
        "Red cells: maintain Hb > 80 g/L",
        "Cryoprecipitate (2 pools): first choice for fibrinogen < 2 g/L",
        "FFP (4 units): if fibrinogen < 1.5 g/L or coagulopathy; 1:1 ratio with RBCs if massive",
        "Platelets: transfuse if Plt < 75 × 10⁹/L (< 100 if ongoing)",
        "Recombinant Factor VIIa: consider in life-threatening haemorrhage not responding to above",
      ],
      next: "major_response",
    },

    "major_response": {
      type: "decision",
      title: "Bleeding Controlled?",
      text: "Reassess after blood products and pharmacological measures.",
      options: [
        { label: "Yes — haemostasis achieved", sublabel: "Monitor closely; arrange HDU/ITU", next: "major_resolved" },
        { label: "No — ongoing / > 2000 ml", sublabel: "Activate Massive Haemorrhage Protocol", next: "massive" },
      ],
    },

    "major_resolved": {
      type: "end",
      title: "Major PPH — Controlled",
      text: "Haemostasis achieved.",
      items: [
        "HDU or ITU admission for ongoing monitoring",
        "Reassess Hb, coagulation, electrolytes at 4 and 12 hours",
        "VTE risk assessment — restart LMWH once haemostasis confirmed (high VTE risk post-PPH)",
        "Debrief patient and partner with written summary",
        "Postnatal debrief with consultant before discharge",
      ],
    },

    "massive": {
      type: "alert",
      title: "Massive PPH — > 2000 ml — ACTIVATE MHP",
      text: "Hospital Massive Haemorrhage Protocol. Contact haematologist and blood bank immediately.",
      items: [
        "Call consultant obstetrician, consultant anaesthetist, haematologist",
        "MHP pack: 6 units RBCs + 4 units FFP ± platelets ± cryoprecipitate",
        "Cell salvage if available (haematologist authorisation if Rh-negative)",
        "ROTEM / TEG to guide product replacement",
      ],
      next: "surgical",
    },

    "surgical": {
      type: "action",
      title: "Intrauterine Balloon & Surgical Options",
      text: "Surgical escalation in order of invasiveness. Do not delay transfer to theatre.",
      items: [
        "Bakri balloon tamponade: inflate with 300–500 ml saline — 'tamponade test' if bleeding stops",
        "B-Lynch brace suture: atony at caesarean",
        "Hayman suture: simpler brace technique",
        "Systematic pelvic devascularisation: bilateral uterine ± ovarian artery ligation",
        "Uterine artery embolisation (UAE): if haemodynamically stable — uterine-conserving",
        "Peripartum hysterectomy: life-saving last resort — consultant + gynaecological oncologist",
      ],
      next: "end_massive",
    },

    "end_massive": {
      type: "end",
      title: "Post-Massive PPH — Critical Care",
      text: "Intensive monitoring and critical care mandatory after massive haemorrhage.",
      items: [
        "HDU or ITU admission",
        "Serial bloods: FBC, coag, U&E every 4 hours until stable",
        "VTE prophylaxis once haemostasis achieved — high VTE risk post-massive PPH",
        "MBRRACE notification if maternal death or near-miss",
        "Debrief: patient, partner, and staff; written summary of events",
      ],
    },

  },
};
