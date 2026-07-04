// IOL priority — NICE NG207 four-tier model with multi-indication support.
// Ported from the ward-manager engine; adds hours-since-SROM escalation & ordering,
// and derives post-dates priority automatically from the entered gestation.
//
// A patient may carry several indications; her tier is the MOST urgent of them
// (lowest tier number). Two indications are time/gestation-driven:
//   • Term PROM / SROM — starts Moderate, escalates to High at >=24h since rupture.
//   • Post-dates — applied automatically from gestation: 41+0..41+6 = Moderate,
//     >=42+0 = High (stillbirth risk rises past 42 weeks, NICE NG207).

export const IOL_TIERS = [
  { key: "urgent",   label: "Urgent",   badge: "bg-red-500 text-white",     dot: "bg-red-500",    text: "text-red-700",    within: "induce within 24h" },
  { key: "high",     label: "High",     badge: "bg-orange-500 text-white",  dot: "bg-orange-500", text: "text-orange-700", within: "24–48h" },
  { key: "moderate", label: "Moderate", badge: "bg-amber-400 text-white",   dot: "bg-amber-400",  text: "text-amber-700",  within: "48–72h" },
  { key: "routine",  label: "Routine",  badge: "bg-gray-300 text-gray-700", dot: "bg-gray-400",   text: "text-gray-500",   within: "flexible" },
];

export const SROM_ESCALATION_HOURS = 24;
export const SROM_KEY = "term-prom";

// Selectable indications (post-dates is NOT here — it is derived from gestation).
export const IOL_IND = [
  { key: "severe-pet",   label: "Severe pre-eclampsia",        tier: 0, cite: "NG207 §1.2" },
  { key: "pprom-chorio", label: "PPROM + chorioamnionitis",    tier: 0, cite: "NG207 §1.2" },
  { key: "fgr-aedf",     label: "FGR — absent/reversed EDF",   tier: 0, cite: "NG207 §1.2" },
  { key: "pet",          label: "Pre-eclampsia",               tier: 1, cite: "NG207 §1.2" },
  { key: "rfm",          label: "RFM + concerns",              tier: 1, cite: "NG207 §1.2" },
  { key: SROM_KEY,       label: "Term PROM / SROM",            tier: 2, cite: "NG207 §1.3", srom: true },
  { key: "gdm",          label: "GDM",                         tier: 2, cite: "NG207 §1.2" },
  { key: "icp",          label: "Obstetric cholestasis (ICP)", tier: 2, cite: "NG207 §1.2" },
  { key: "prev-sb",      label: "Previous stillbirth",         tier: 2, cite: "NG207 §1.2" },
  { key: "sga-stable",   label: "SGA / FGR (stable)",          tier: 2, cite: "NG207 §1.2" },
  { key: "maternal-req", label: "Maternal request",            tier: 3, cite: "NG207 §1.2" },
  { key: "social",       label: "Social",                      tier: 3, cite: "" },
];

const BY_KEY = Object.fromEntries(IOL_IND.map(i => [i.key, i]));
export const indByKey = (key) => BY_KEY[key] ?? null;

const gestTotalDays = (entry) => (entry?.gestWeeks || 0) * 7 + (entry?.gestDays || 0);

export function isSromEscalated(entry) {
  const h = Number(entry?.sromHours);
  return Number.isFinite(h) && h >= SROM_ESCALATION_HOURS;
}

// Tier for one selectable indication on a given entry (SROM escalates by hours).
export function indicationTier(key, entry) {
  const ind = BY_KEY[key];
  if (!ind) return 3;
  if (ind.srom) return isSromEscalated(entry) ? 1 : 2;
  return ind.tier;
}

// Derived post-dates indication from gestation (or null if <41+0).
export function postDatesInd(entry) {
  const d = gestTotalDays(entry);
  if (d >= 42 * 7) return { key: "postdates", label: "Post-dates 42+0", tier: 1, cite: "NG207 §1.1", auto: true };
  if (d >= 41 * 7) return { key: "postdates", label: `Post-dates ${entry.gestWeeks}+${entry.gestDays || 0}`, tier: 2, cite: "NG207 §1.1", auto: true };
  return null;
}

// All indications that count towards this patient — selected + derived post-dates.
export function effectiveIndications(entry) {
  const list = (entry?.indications ?? [])
    .map(k => BY_KEY[k])
    .filter(Boolean)
    .map(ind => ({ ...ind, tier: indicationTier(ind.key, entry) }));
  const pd = postDatesInd(entry);
  if (pd) list.push(pd);
  return list;
}

// 0 = Urgent, 1 = High, 2 = Moderate, 3 = Routine
export function iolEntryTier(entry) {
  const eff = effectiveIndications(entry);
  if (!eff.length) return 3;
  return Math.min(...eff.map(i => i.tier));
}

export function hasSrom(entry) {
  return (entry?.indications ?? []).some(k => BY_KEY[k]?.srom);
}

// True if this patient qualifies for the list at all (an indication or post-dates).
export function isValidEntry(entry) {
  return (entry?.indications?.length ?? 0) > 0 || postDatesInd(entry) != null;
}

// The indication that sets the tier (for "why this priority").
export function governingIndication(entry) {
  const eff = effectiveIndications(entry);
  let best = null, bestTier = 4;
  for (const i of eff) { if (i.tier < bestTier) { bestTier = i.tier; best = i; } }
  return best;
}

export function entryReason(entry) {
  const gov = governingIndication(entry);
  if (!gov) return "No indication";
  if (gov.srom) {
    const h = Number(entry?.sromHours);
    const hrs = Number.isFinite(h) ? `${h}h since SROM` : "term PROM/SROM";
    return isSromEscalated(entry) ? `${hrs} — ≥24h, escalated to High` : `${gov.label} · ${hrs}`;
  }
  return gov.label;
}

// Sort the queue by clinical urgency:
//   1. tier (most urgent first)
//   2. if BOTH governed by SROM → longer since rupture first
//   3. gestation (more advanced first)
//   4. hours since SROM (longer first; 0 for non-SROM)
//   5. longer on the list first
export function sortIOLQueue(queue) {
  return [...queue].sort((a, b) => {
    const ta = iolEntryTier(a), tb = iolEntryTier(b);
    if (ta !== tb) return ta - tb;

    const aSrom = hasSrom(a), bSrom = hasSrom(b);
    if (aSrom && bSrom) {
      const sa = Number(a.sromHours) || 0, sb = Number(b.sromHours) || 0;
      if (sa !== sb) return sb - sa;
    }

    const ga = gestTotalDays(a), gb = gestTotalDays(b);
    if (ga !== gb) return gb - ga;

    const sa = aSrom ? (Number(a.sromHours) || 0) : 0;
    const sb = bSrom ? (Number(b.sromHours) || 0) : 0;
    if (sa !== sb) return sb - sa;

    return (b.daysWaiting || 0) - (a.daysWaiting || 0);
  });
}
