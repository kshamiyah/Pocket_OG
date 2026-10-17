// IOL queue priority. The tiers are the app's own order for local review:
// NICE NG207 lists indications (section 1.2) but sets no queue priority.

export const IOL_IND = [
  { label: "Severe pre-eclampsia",      tier: 0, cite: "" },
  { label: "PPROM + chorioamnionitis",  tier: 0, cite: "" },
  { label: "FGR: absent or reversed EDF", tier: 0, cite: "" },
  { label: "Pre-eclampsia",            tier: 1, cite: "" },
  { label: "PROM at term >24h",        tier: 1, cite: "" },
  { label: "Post-dates 42+0",          tier: 1, cite: "" },
  { label: "RFM + concerns",           tier: 1, cite: "" },
  { label: "Post-dates 41+",           tier: 2, cite: "" },
  { label: "GDM",                      tier: 2, cite: "" },
  { label: "ICP",                      tier: 2, cite: "" },
  { label: "Previous stillbirth",      tier: 2, cite: "" },
  { label: "SGA / FGR (stable)",       tier: 2, cite: "" },
  { label: "Maternal request",         tier: 3, cite: "" },
  { label: "Social",                   tier: 3, cite: "" },
];

// Labels saved by older versions.
const LEGACY = { "FGR \u2014 absent/reversed EDF": "FGR: absent or reversed EDF" };

// 0 = Urgent, 1 = High, 2 = Moderate, 3 = Routine
export function iolEntryTier(entry) {
  if (!entry.indications?.length) return 3;
  return Math.min(...entry.indications.map(ind => IOL_IND.find(i => i.label === (LEGACY[ind] ?? ind))?.tier ?? 3));
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
