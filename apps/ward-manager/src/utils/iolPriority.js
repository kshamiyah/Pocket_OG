// ─── IOL priority logic — NICE NG207 (Inducing labour) ───────────────────

export const IOL_IND = [
  { label: "Severe pre-eclampsia",      tier: 0, cite: "NG207 §1.4" },
  { label: "PPROM + chorioamnionitis",  tier: 0, cite: "NG207 §1.4" },
  { label: "FGR — absent/reversed EDF",tier: 0, cite: "NG207 §1.4" },
  { label: "Pre-eclampsia",            tier: 1, cite: "NG207 §1.4" },
  { label: "PROM at term >24h",        tier: 1, cite: "NG207 §1.4" },
  { label: "Post-dates 42+0",          tier: 1, cite: "NG207 §1.3" },
  { label: "RFM + concerns",           tier: 1, cite: "NG207 §1.4" },
  { label: "Post-dates 41+",           tier: 2, cite: "NG207 §1.3" },
  { label: "GDM",                      tier: 2, cite: "NG207 §1.4" },
  { label: "ICP",                      tier: 2, cite: "NG207 §1.4" },
  { label: "Previous stillbirth",      tier: 2, cite: "NG207 §1.4" },
  { label: "SGA / FGR (stable)",       tier: 2, cite: "NG207 §1.4" },
  { label: "Maternal request",         tier: 3, cite: "NG207 §1.4" },
  { label: "Social",                   tier: 3, cite: "" },
];

// 0 = Urgent, 1 = High, 2 = Moderate, 3 = Routine
export function iolEntryTier(entry) {
  if (!entry.indications?.length) return 3;
  return Math.min(...entry.indications.map(ind => IOL_IND.find(i => i.label === ind)?.tier ?? 3));
}

export function sortIOLQueue(queue) {
  return [...queue].sort((a, b) => {
    const ta = iolEntryTier(a), tb = iolEntryTier(b);
    if (ta !== tb) return ta - tb;
    const ga = a.gestWeeks * 7 + (a.gestDays ?? 0);
    const gb = b.gestWeeks * 7 + (b.gestDays ?? 0);
    if (ga !== gb) return gb - ga;
    return new Date(a.addedAt) - new Date(b.addedAt);
  });
}
