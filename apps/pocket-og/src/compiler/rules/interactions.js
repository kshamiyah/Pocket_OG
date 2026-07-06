// Cross-condition and drug interaction rules.
// Confirmed rules are evaluated when compiling multi-condition pathways.

import { RULE_STATUS } from "../ruleStatus.js";

/**
 * @typedef {Object} InteractionRule
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {{ clinical?: string[], history?: string[], drugs?: string[] }} when
 * @property {"alert"|"synthesis"|"escalation"} kind
 * @property {Object} [alert]
 * @property {Object} [synthesis]
 * @property {Object} [escalation]
 * @property {string} [notes]
 * @property {string} [reviewedBy]
 * @property {string} [reviewedAt]
 * @property {string} [declineReason]
 */

/** @type {InteractionRule[]} */
export const INTERACTION_RULES = [
  {
    id: "hyperemesis-no-dextrose",
    title: "Hyperemesis: never IV dextrose",
    status: RULE_STATUS.PROPOSED,
    notes: "Safety-critical. GTG69 — confirm before confirming.",
    when: { clinical: ["hyperemesis"] },
    kind: "alert",
    alert: {
      severity: "critical",
      title: "Critical Safety Alert",
      subtitle: "Hyperemesis requires specific fluid precautions",
      items: [
        "NEVER give IV dextrose — precipitates Wernicke's encephalopathy",
        "Always use Hartmann's or Normal Saline for IV fluids",
        "Give thiamine supplementation (Pabrinex or oral thiamine)",
        "Check for neurological red flags: confusion, nystagmus, ataxia",
        "If neurological symptoms: Pabrinex 2 pairs IV TDS immediately",
      ],
      source: { gl: "GTG69", label: "Wernicke's prevention" },
    },
  },

  {
    id: "hyperemesis-twins-severity",
    title: "Hyperemesis worse in twins",
    status: RULE_STATUS.PROPOSED,
    when: { clinical: ["hyperemesis", "twins"] },
    kind: "synthesis",
    synthesis: {
      title: "Clinical insight",
      insight: "Multiple pregnancy is a risk factor for more severe hyperemesis gravidarum.",
      management: "Twins often experience worse symptoms. Lower threshold for admission and IV therapy.",
      monitoring: "Increased risk of dehydration and electrolyte imbalance.",
    },
  },

  {
    id: "pet-twins-delivery-timing",
    title: "PET vs twin delivery timing conflict",
    status: RULE_STATUS.PROPOSED,
    notes: "QS46 vs GL952 — confirm resolution wording with local MDT practice.",
    when: { clinical: ["severe-pet", "twins"] },
    kind: "synthesis",
    synthesis: {
      title: "Delivery timing",
      conflict: "QS46: uncomplicated twins deliver 36–37 weeks. GL952: severe PET deliver by 34 weeks if uncontrolled.",
      resolution: "Severe PET overrides routine twin timing. Aim for 34 weeks if BP controlled; consider earlier if not controlled.",
      patientTemplate: "Your patient: {gestation} with severe PET + twins",
    },
  },

  {
    id: "previous-vte-escalation",
    title: "Previous VTE + high-risk pregnancy",
    status: RULE_STATUS.PROPOSED,
    when: { history: ["previous-vte"], clinical: ["severe-pet", "hyperemesis"] },
    kind: "escalation",
    escalation: {
      title: "VTE risk escalation required",
      subtitle: "Previous VTE + current high-risk condition = very high risk",
      badge: { label: "Very High Risk", color: "red" },
      alert: "Consider therapeutic anticoagulation, not prophylactic dose alone",
      items: [
        "Escalate to therapeutic LMWH if indicated (not prophylactic dose alone)",
        "Enoxaparin 1mg/kg SC BD (weight-based dosing)",
        "Inform anaesthetics early: 12hr gap needed before neuraxial",
        "Check platelets before procedures if also on MgSO₄",
        "Continue for minimum 6 weeks postpartum",
      ],
      source: { gl: "GL891", label: "VTE risk stratification & management" },
    },
  },

  {
    id: "mgso4-renal-check",
    title: "MgSO₄ requires renal function check",
    status: RULE_STATUS.PROPOSED,
    when: { clinical: ["severe-pet"] },
    kind: "alert",
    alert: {
      severity: "high",
      message: "Check renal function before MgSO₄ — adjust dose if eGFR <30",
      source: { gl: "GL952", label: "MgSO₄ dosing" },
    },
  },
];

export const INTERACTION_IDS = INTERACTION_RULES.map(r => r.id);
