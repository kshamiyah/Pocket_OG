// Rule lifecycle for the clinical compiler.
// Only "confirmed" rules are used at compile time.
// "proposed" rules appear in review output for clinical sign-off.
// "declined" rules are kept for audit but never compiled.

export const RULE_STATUS = {
  PROPOSED: "proposed",
  CONFIRMED: "confirmed",
  DECLINED: "declined",
};

export function isActiveRule(rule) {
  return rule?.status === RULE_STATUS.CONFIRMED;
}

export function ruleSummary(rule) {
  return {
    id: rule.id,
    status: rule.status,
    title: rule.title ?? rule.id,
    source: rule.source,
    reviewedBy: rule.reviewedBy ?? null,
    reviewedAt: rule.reviewedAt ?? null,
    declineReason: rule.declineReason ?? null,
  };
}
