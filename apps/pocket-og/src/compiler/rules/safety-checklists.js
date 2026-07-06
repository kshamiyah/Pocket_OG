// "What you might forget" items — keyed by condition or gestation band.
// Only confirmed items are included in compiled pathways.

import { RULE_STATUS } from "../ruleStatus.js";

/**
 * @typedef {Object} SafetyItem
 * @property {string} item
 * @property {string} reason
 * @property {string} source
 */

/**
 * @typedef {Object} SafetyChecklistRule
 * @property {string} id
 * @property {string} title
 * @property {string} status
 * @property {string} [applyWhen]  // condition id or gestation band key
 * @property {SafetyItem[]} items
 * @property {string} [notes]
 * @property {string} [reviewedBy]
 * @property {string} [reviewedAt]
 * @property {string} [declineReason]
 */

/** @type {Record<string, SafetyChecklistRule>} */
export const SAFETY_CHECKLIST_RULES = {
  "early-pregnancy": {
    id: "early-pregnancy",
    title: "Early pregnancy (<14 weeks)",
    status: RULE_STATUS.PROPOSED,
    applyWhen: "gestation:<14",
    items: [
      { item: "Dating scan if not done", reason: "Confirm gestation and viability", source: "QS22" },
      { item: "Folic acid 400mcg daily", reason: "Neural tube defect prevention (5mg if high risk)", source: "QS22" },
      { item: "Booking bloods", reason: "FBC, blood group, infections screen", source: "QS22" },
    ],
  },

  "preterm-delivery": {
    id: "preterm-delivery",
    title: "Preterm (<37 weeks)",
    status: RULE_STATUS.PROPOSED,
    applyWhen: "gestation:24-36",
    items: [
      { item: "Antenatal corticosteroids", reason: "Indicated <34+6 weeks", source: "NG25" },
      { item: "Anti-D if Rh negative", reason: "Sensitising event", source: "QS22" },
      { item: "Inform neonatal team", reason: "Preterm admission needed", source: "NG25" },
      { item: "MgSO₄ for neuroprotection", reason: "Consider if <30 weeks", source: "NG25" },
    ],
  },

  hyperemesis: {
    id: "hyperemesis",
    title: "Hyperemesis safety items",
    status: RULE_STATUS.PROPOSED,
    applyWhen: "hyperemesis",
    items: [
      { item: "Thiamine supplementation", reason: "Prevent Wernicke's encephalopathy", source: "GTG69" },
      { item: "Check for red flags", reason: "Neurological symptoms may indicate Wernicke's", source: "GTG69" },
      { item: "Weight monitoring", reason: "Track weight loss from baseline", source: "GTG69" },
      { item: "Avoid dextrose IV", reason: "Precipitates Wernicke's in thiamine deficiency", source: "GTG69" },
      { item: "Consider USS viability", reason: "Exclude molar pregnancy", source: "GTG69" },
      { item: "VTE assessment", reason: "Dehydration increases thrombosis risk", source: "GL891" },
    ],
  },

  twins: {
    id: "twins",
    title: "Twin pregnancy safety items",
    status: RULE_STATUS.PROPOSED,
    applyWhen: "twins",
    items: [
      { item: "Book early dating scan", reason: "Confirm chorionicity (MCDA vs DCDA)", source: "QS46" },
      { item: "Arrange growth scans", reason: "Every 2 weeks from 16 weeks", source: "QS46" },
      { item: "Folic acid 5mg", reason: "Higher dose for multiple pregnancy", source: "QS22" },
      { item: "Inform of increased risks", reason: "Twins: higher miscarriage, PTB, PET risks", source: "QS46" },
    ],
  },

  "severe-pet": {
    id: "severe-pet",
    title: "Severe PET safety items",
    status: RULE_STATUS.PROPOSED,
    applyWhen: "severe-pet",
    items: [
      { item: "Inform anaesthetics", reason: "May need epidural; LMWH timing matters", source: "GL952" },
      { item: "VTE assessment", reason: "PET is an additional VTE risk factor", source: "GL891" },
      { item: "Postnatal BP plan", reason: "Follow GL952 postnatal pathway", source: "GL952" },
    ],
  },
};

export const SAFETY_CHECKLIST_IDS = Object.keys(SAFETY_CHECKLIST_RULES);
