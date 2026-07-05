// Clinical condition rules — one entry per compilable condition.
// Set status to "confirmed" after clinical review (see scripts/review-rules.js).

import { RULE_STATUS } from "../ruleStatus.js";

/** @typedef {"immediate"|"urgent"|"soon"|"routine"} ActionUrgency */

/**
 * @typedef {Object} ConditionAction
 * @property {string} action
 * @property {string} detail
 * @property {ActionUrgency} urgency
 * @property {{ gl: string, label?: string, sectionId?: string }} source
 * @property {string} [precaution]
 * @property {string} [flowchartLink]
 * @property {string} [calculatorLink]
 */

/**
 * @typedef {Object} ConditionRule
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {string[]} guidelines
 * @property {string[]} [flowcharts]
 * @property {string[]} [calculators]
 * @property {ConditionAction[]} immediateActions
 * @property {string[]} investigations
 * @property {Object} [management]
 * @property {string} [reviewedBy]
 * @property {string} [reviewedAt]
 * @property {string} [declineReason]
 * @property {string} [notes]
 */

/** @type {Record<string, ConditionRule>} */
export const CONDITION_RULES = {
  "severe-pet": {
    id: "severe-pet",
    title: "Severe pre-eclampsia",
    status: RULE_STATUS.PROPOSED,
    notes: "Draft from GL952 / NG133. Confirm thresholds and drug lines against local protocol.",
    guidelines: ["GL952", "NG133"],
    flowcharts: ["GL952_TRIAGE", "GL952_ACUTE", "GL952_SEVERE_LW"],
    immediateActions: [
      {
        action: "Blood pressure control",
        detail: "Labetalol 200mg PO or IV pathway",
        urgency: "immediate",
        source: { gl: "GL952", label: "Acute BP management" },
        flowchartLink: "GL952_ACUTE",
      },
      {
        action: "Seizure prophylaxis assessment",
        detail: "MgSO₄ bolus + infusion if indicated",
        urgency: "immediate",
        source: { gl: "GL952", label: "Severe PET management" },
        precaution: "Check renal function first; adjust dose if eGFR <30",
      },
    ],
    investigations: [
      "FBC (raised haematocrit suggests haemoconcentration)",
      "U&E (for renal function and MgSO₄ dosing)",
      "LFT (transaminase elevation common in PET)",
      "Uric acid (>350 μmol/L supports PET diagnosis)",
      "Urinary protein:creatinine ratio",
      "eGFR (essential for MgSO₄ dosing adjustment)",
    ],
  },

  twins: {
    id: "twins",
    title: "Twin pregnancy",
    status: RULE_STATUS.PROPOSED,
    notes: "Draft from QS46. Confirm scan intervals against local twins pathway.",
    guidelines: ["QS46"],
    flowcharts: ["QS46_CARE_PATHWAY"],
    immediateActions: [
      {
        action: "Fetal monitoring",
        detail: "CTG for both twins if clinically indicated",
        urgency: "urgent",
        source: { gl: "QS46", label: "Multiple pregnancy monitoring" },
      },
    ],
    investigations: [
      "USS: growth, AFI, dopplers for both twins",
      "Confirm chorionicity (MCDA vs DCDA)",
    ],
  },

  hyperemesis: {
    id: "hyperemesis",
    title: "Hyperemesis gravidarum",
    status: RULE_STATUS.PROPOSED,
    notes: "Draft from GTG69. Wernicke's / dextrose warning is safety-critical — please confirm wording.",
    guidelines: ["GTG69"],
    calculators: ["PUQE"],
    immediateActions: [
      {
        action: "Assess hydration status",
        detail: "Dry mucous membranes, reduced skin turgor, tachycardia",
        urgency: "immediate",
        source: { gl: "GTG69", label: "Assessment & admission criteria" },
      },
      {
        action: "IV fluid resuscitation if needed",
        detail: "Hartmann's or Normal Saline 1L over 2–4 hours",
        urgency: "immediate",
        source: { gl: "GTG69", label: "Fluid management" },
        precaution: "Do NOT give dextrose (risk of Wernicke's encephalopathy)",
      },
      {
        action: "Antiemetic therapy",
        detail: "Start first-line antiemetics immediately",
        urgency: "immediate",
        source: { gl: "GTG69", label: "Pharmacological management" },
      },
    ],
    investigations: [
      "Urine dip: ketones (2+ or more suggests significant dehydration)",
      "MSU (urine MC&S) to exclude UTI as a cause",
      "FBC (raised haematocrit suggests haemoconcentration)",
      "U&E (hypokalaemia and hyponatraemia common in HG)",
      "LFT (transaminase elevation in up to 50% of HG)",
      "TFTs (gestational transient thyrotoxicosis in up to 60% of HG)",
      "USS: confirm viability, exclude molar pregnancy",
    ],
    management: {
      fluids: {
        title: "IV fluid resuscitation",
        alert: "NEVER use dextrose — use Hartmann's or Normal Saline only",
        items: [
          "Hartmann's or Normal Saline 1L over 2–4 hours",
          "Check U&Es and replace potassium if low",
          "Continue until tolerating oral fluids",
        ],
      },
      antiemetics: {
        title: "Antiemetic therapy",
        note: "Stepwise escalation",
        drugs: [
          { drug: "Cyclizine", dose: "50mg PO/IV TDS", note: "First line" },
          { drug: "Prochlorperazine", dose: "5–10mg PO TDS or 12.5mg IM", note: "Alternative first line" },
          { drug: "Ondansetron", dose: "4–8mg PO/IV BD–TDS", note: "If first line fails" },
          { drug: "Metoclopramide", dose: "10mg PO/IV TDS", note: "Prokinetic" },
        ],
      },
      supplements: {
        title: "Essential supplements",
        note: "Prevent Wernicke's encephalopathy",
        drugs: [
          { drug: "Thiamine", dose: "25–50mg PO OD or Pabrinex IV", note: "Prevent Wernicke's" },
          { drug: "Folic acid", dose: "5mg PO OD", note: "Standard in pregnancy" },
        ],
      },
    },
  },

  "previous-vte": {
    id: "previous-vte",
    title: "Previous VTE (history flag)",
    status: RULE_STATUS.PROPOSED,
    notes: "History modifier only — not a standalone presenting complaint. Triggers escalation rules.",
    guidelines: ["GL891"],
    calculators: ["VTE_RISK"],
    immediateActions: [],
    investigations: [],
  },

  pprom: {
    id: "pprom",
    title: "Preterm prelabour rupture of membranes",
    status: RULE_STATUS.PROPOSED,
    notes: "Placeholder for Stage 1 — to be expanded from GL895 / GTG73 after review.",
    guidelines: ["GL895", "GTG73"],
    flowcharts: ["GL895_ROM_TRIAGE"],
    immediateActions: [
      {
        action: "Confirm diagnosis",
        detail: "Sterile speculum examination; avoid digital examination unless in established labour",
        urgency: "immediate",
        source: { gl: "GL895", label: "Diagnosis" },
        flowchartLink: "GL895_ROM_TRIAGE",
      },
    ],
    investigations: [
      "MSU (exclude ascending infection)",
      "FBC and CRP (chorioamnionitis screen)",
      "Confirm gestation and fetal presentation",
    ],
  },
};

export const CONDITION_IDS = Object.keys(CONDITION_RULES);
