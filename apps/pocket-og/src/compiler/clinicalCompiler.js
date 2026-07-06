// Clinical Context Compiler — Stage 1 engine.
// Only uses rules with status === "confirmed". Proposed rules are ignored until sign-off.

import { isActiveRule, RULE_STATUS } from "./ruleStatus.js";
import { CONDITION_RULES } from "./rules/conditions.js";
import { INTERACTION_RULES } from "./rules/interactions.js";
import { SAFETY_CHECKLIST_RULES } from "./rules/safety-checklists.js";

const URGENCY_ORDER = { immediate: 0, urgent: 1, soon: 2, routine: 3 };

/**
 * @typedef {Object} ClinicalContext
 * @property {string[]} conditions
 * @property {{ weeks: number, days?: number }} [gestation]
 * @property {string[]} [history]
 * @property {string} [description]
 */

function formatGestation(gestation) {
  if (!gestation) return null;
  const days = gestation.days ?? 0;
  return `${gestation.weeks}+${days}`;
}

function formatTitle(conditions, gestation) {
  const labels = conditions.map(id => CONDITION_RULES[id]?.title ?? id);
  const gest = formatGestation(gestation);
  return gest ? `${labels.join(" + ")} at ${gest}` : labels.join(" + ");
}

function getActiveConditions(conditionIds) {
  return conditionIds
    .map(id => CONDITION_RULES[id])
    .filter(rule => rule && isActiveRule(rule));
}

function matchesWhen(when, context) {
  if (!when) return true;
  const { conditions = [], history = [] } = context;

  if (when.clinical?.length) {
    if (!when.clinical.every(c => conditions.includes(c))) return false;
  }
  if (when.history?.length) {
    if (!when.history.every(h => history.includes(h))) return false;
  }
  return true;
}

function getActiveInteractions(context) {
  return INTERACTION_RULES.filter(rule => isActiveRule(rule) && matchesWhen(rule.when, context));
}

function applyGestationBand(rule, gestation) {
  const band = rule.applyWhen ?? "";
  if (!gestation) return band.startsWith("gestation:") ? false : true;

  if (band === "gestation:<14") return gestation.weeks < 14;
  if (band === "gestation:24-36") return gestation.weeks >= 24 && gestation.weeks < 37;

  return true;
}

function getSafetyItems(context) {
  const { conditions = [], gestation } = context;
  const items = [];
  const seen = new Set();

  for (const rule of Object.values(SAFETY_CHECKLIST_RULES)) {
    if (!isActiveRule(rule)) continue;

    const appliesToCondition = conditions.includes(rule.applyWhen);
    const appliesToGestation = rule.applyWhen?.startsWith("gestation:") && applyGestationBand(rule, gestation);

    if (!appliesToCondition && !appliesToGestation) continue;

    for (const item of rule.items) {
      if (seen.has(item.item)) continue;
      seen.add(item.item);
      items.push(item);
    }
  }

  return items;
}

function compileImmediateActions(activeConditions) {
  const actions = activeConditions.flatMap(c => c.immediateActions ?? []);
  return [...actions].sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);
}

function compileInvestigations(activeConditions) {
  const seen = new Set();
  const items = [];
  for (const c of activeConditions) {
    for (const inv of c.investigations ?? []) {
      if (!seen.has(inv)) {
        seen.add(inv);
        items.push(inv);
      }
    }
  }
  return items;
}

function compileManagementSections(activeConditions, interactions, gestation) {
  const sections = [];

  for (const c of activeConditions) {
    if (!c.management) continue;
    for (const block of Object.values(c.management)) {
      sections.push(block);
    }
  }

  const syntheses = interactions.filter(i => i.kind === "synthesis" && i.synthesis);
  if (syntheses.length) {
    sections.push({
      title: "Clinical insights",
      alert: "Multi-condition considerations",
      items: syntheses.map(i => {
        const s = i.synthesis;
        if (s.conflict) {
          return `${s.conflict} → Resolution: ${s.resolution}`;
        }
        return [s.insight, s.management, s.monitoring].filter(Boolean).join(" ");
      }),
    });
  }

  const deliverySynth = syntheses.find(s => s.synthesis?.patientTemplate);
  if (deliverySynth && gestation) {
    const s = deliverySynth.synthesis;
    sections.push({
      title: s.title ?? "Delivery timing",
      note: "Synthesized from multiple guidelines",
      items: [
        ...(s.conflict ? [s.conflict.split(".")[0] + ".", s.conflict.split(".")[1]?.trim() + "."].filter(Boolean) : []),
        s.patientTemplate.replace("{gestation}", formatGestation(gestation)),
        `→ ${s.resolution}`,
      ],
    });
  }

  return sections;
}

function buildNodes(context, activeConditions, interactions) {
  const nodes = {};
  const { conditions, gestation, history = [] } = context;
  const sequence = ["start"];

  const immediate = compileImmediateActions(activeConditions);
  const investigations = compileInvestigations(activeConditions);
  const sources = [...new Set(activeConditions.flatMap(c => c.guidelines))];

  nodes.start = {
    type: "checklist",
    title: "Immediate Actions",
    subtitle: "Next 30 minutes — critical interventions",
    alert: conditions.length > 1 ? "Multiple high-risk conditions require coordinated management" : null,
    items: immediate.map(a => {
      let text = `${a.action}: ${a.detail}`;
      if (a.precaution) text += ` ⚠ ${a.precaution}`;
      return text;
    }),
    source: { gl: "Multiple", label: `Compiled from ${sources.join(", ") || "—"}` },
    next: "investigations",
  };

  nodes.investigations = {
    type: "checklist",
    title: "Investigations",
    subtitle: "Required workup for this clinical scenario",
    items: investigations,
    source: { gl: "Multiple", label: "Compiled investigation panel" },
    next: null,
  };

  let nextAfterInvestigations = "management";

  const alertInteraction = interactions.find(i => i.kind === "alert" && i.alert?.items);
  if (alertInteraction) {
    sequence.push("safety_alert");
    nodes.safety_alert = {
      type: "escalation",
      title: alertInteraction.alert.title ?? "Safety alert",
      subtitle: alertInteraction.alert.subtitle ?? "",
      badge: { label: "Essential Reading", color: "red" },
      alert: alertInteraction.alert.subtitle ?? alertInteraction.alert.message,
      items: alertInteraction.alert.items ?? [alertInteraction.alert.message],
      source: alertInteraction.alert.source ?? { gl: "Multiple", label: alertInteraction.title },
      next: "management",
    };
    nextAfterInvestigations = "safety_alert";
  }

  const needsVteQuestion = history.includes("previous-vte")
    && interactions.some(i => i.kind === "escalation");

  if (needsVteQuestion) {
    sequence.push("vte_question", "vte_escalation");
    nodes.vte_question = {
      type: "question",
      question: "Does this patient have a previous VTE?",
      subtitle: "Previous VTE + current high-risk condition may require therapeutic anticoagulation",
      options: [
        { label: "No previous VTE", sublabel: "Standard prophylaxis", next: "management" },
        { label: "Yes — previous DVT or PE", sublabel: "Requires escalation", next: "vte_escalation" },
      ],
    };
    const esc = interactions.find(i => i.kind === "escalation");
    nodes.vte_escalation = {
      type: "escalation",
      title: esc.escalation.title,
      subtitle: esc.escalation.subtitle,
      badge: esc.escalation.badge,
      alert: esc.escalation.alert,
      items: esc.escalation.items,
      source: esc.escalation.source,
      next: "management",
    };
    nextAfterInvestigations = alertInteraction ? "safety_alert" : "vte_question";
    if (alertInteraction) {
      nodes.safety_alert.next = "vte_question";
    }
  }

  sequence.push("management", "safety", "end");
  nodes.investigations.next = nextAfterInvestigations;

  nodes.management = {
    type: "treatment",
    title: "Management Plan",
    badge: { label: "Multi-Guideline Synthesis", color: "amber" },
    sections: compileManagementSections(activeConditions, interactions, gestation),
    source: { gl: "Multiple", label: `Compiled from ${sources.join(" + ") || "—"}` },
    next: "safety",
  };

  const safetyItems = getSafetyItems(context);
  nodes.safety = {
    type: "checklist",
    title: "What You Might Forget",
    subtitle: "Common omissions for this clinical scenario",
    items: safetyItems.map(i => `${i.item} — ${i.reason} (${i.source})`),
    source: { gl: "Multiple", label: "Safety synthesis" },
    next: "end",
  };

  nodes.end = {
    type: "end",
    title: "Pathway Complete",
    subtitle: "Review plan with consultant",
    items: [
      "Document all risk factors and management decisions in notes",
      "Complete VTE risk assessment form if indicated",
      "Book consultant review within 24 hours",
      "Arrange appropriate follow-up",
      "Ensure patient has emergency contact information",
    ],
    source: { gl: "Multiple", label: "Clinical governance" },
  };

  return { nodes, sequence };
}

function calculateCompleteness(context, activeConditions, interactions) {
  let score = 0;
  const max = 5;

  if (activeConditions.length > 0) score += 1;
  if (activeConditions.some(c => (c.immediateActions?.length ?? 0) > 0)) score += 1;
  if (activeConditions.some(c => (c.investigations?.length ?? 0) > 0)) score += 1;
  if (interactions.length > 0 || activeConditions.some(c => c.management)) score += 1;
  if (getSafetyItems(context).length > 0) score += 1;

  const missingConditions = context.conditions.filter(id => {
    const rule = CONDITION_RULES[id];
    return !rule || !isActiveRule(rule);
  });

  return {
    score: score / max,
    missingConditions,
    pendingRules: countPendingRules(),
  };
}

function countPendingRules() {
  const conditions = Object.values(CONDITION_RULES).filter(r => r.status === RULE_STATUS.PROPOSED).length;
  const interactions = INTERACTION_RULES.filter(r => r.status === RULE_STATUS.PROPOSED).length;
  const safety = Object.values(SAFETY_CHECKLIST_RULES).filter(r => r.status === RULE_STATUS.PROPOSED).length;
  return { conditions, interactions, safety, total: conditions + interactions + safety };
}

/**
 * Compile a CLARK-compatible protocol from clinical context.
 * Returns null protocol if no confirmed condition rules match.
 */
export function compileClinicalProtocol(context) {
  const activeConditions = getActiveConditions(context.conditions);

  if (activeConditions.length === 0) {
    return {
      protocol: null,
      completeness: calculateCompleteness(context, [], []),
      blockedReason: "No confirmed condition rules for: " + context.conditions.join(", "),
      pendingRules: countPendingRules(),
    };
  }

  const interactions = getActiveInteractions(context);
  const { nodes, sequence } = buildNodes(context, activeConditions, interactions);

  const protocol = {
    id: `compiled_${context.conditions.join("_")}`,
    title: formatTitle(context.conditions, context.gestation),
    subtitle: context.description ?? "Compiled clinical pathway",
    category: "compiled",
    color: "purple",
    startId: "start",
    nodes,
    metadata: {
      conditions: context.conditions,
      gestation: context.gestation,
      history: context.history ?? [],
      compiledFrom: [...new Set(activeConditions.flatMap(c => c.guidelines))],
      nodeSequence: sequence,
      ruleStatus: "confirmed-only",
    },
  };

  return {
    protocol,
    completeness: calculateCompleteness(context, activeConditions, interactions),
    pendingRules: countPendingRules(),
  };
}

/** For review tooling — export all rules regardless of status. */
export function getAllRulesForReview() {
  return {
    conditions: Object.values(CONDITION_RULES),
    interactions: INTERACTION_RULES,
    safetyChecklists: Object.values(SAFETY_CHECKLIST_RULES),
  };
}

export { CONDITION_RULES, INTERACTION_RULES, SAFETY_CHECKLIST_RULES, RULE_STATUS };
