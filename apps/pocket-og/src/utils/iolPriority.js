// IOL priority — NICE NG207 four-tier model with multi-indication support.
// Ported from the ward-manager engine; adds hours-since-SROM escalation & ordering.
//
// A patient may carry several indications; her tier is the MOST urgent of them
// (lowest tier number). Term PROM / SROM is time-driven: it escalates from
// Moderate to High once ≥24h have elapsed since rupture (NICE NG207 — offer IOL,
// expectant max ~24h), and SROM patients are ordered by hours since rupture.

export const IOL_TIERS = [
  { key: "urgent",   label: "Urgent",   badge: "bg-red-500 text-white",     dot: "bg-red-500",    text: "text-red-700",    within: "induce within 24h" },
  { key: "high",     label: "High",     badge: "bg-orange-500 text-white",  dot: "bg-orange-500", text: "text-orange-700", within: "24–48h" },
  { key: "moderate", label: "Moderate", badge: "bg-amber-400 text-white",   dot: "bg-amber-400",  text: "text-amber-700",  within: "48–72h" },
  { key: "routine",  label: "Routine",  badge: "bg-gray-300 text-gray-700", dot: "bg-gray-400",   text: "text-gray-500",   within: "flexible" },
];

export const SROM_ESCALATION_HOURS = 24;

// key of the SROM/term-PROM indication (its tier is computed from hours).
export const SROM_KEY = "term-prom";

export const IOL_IND = [
  { key: "severe-pet",   label: "Severe pre-eclampsia",        tier: 0, cite: "NG207 §1.2" },
  { key: "pprom-chorio", label: "PPROM + chorioamnionitis",    tier: 0, cite: "NG207 §1.2" },
  { key: "fgr-aedf",     label: "FGR — absent/reversed EDF",   tier: 0, cite: "NG207 §1.2" },
  { key: "pet",          label: "Pre-eclampsia",               tier: 1, cite: "NG207 §1.2" },
  { key: "postdates-42", label: "Post-dates 42+0",             tier: 1, cite: "NG207 §1.1" },
  { key: "rfm",          label: "RFM + concerns",              tier: 1, cite: "NG207 §1.2" },
  { key: SROM_KEY,       label: "Term PROM / SROM",            tier: 2, cite: "NG207 §1.3", srom: true },
  { key: "postdates-41", label: "Post-dates 41+",              tier: 2, cite: "NG207 §1.1" },
  { key: "gdm",          label: "GDM",                         tier: 2, cite: "NG207 §1.2" },
  { key: "icp",          label: "Obstetric cholestasis (ICP)", tier: 2, cite: "NG207 §1.2" },
  { key: "prev-sb",      label: "Previous stillbirth",         tier: 2, cite: "NG207 §1.2" },
  { key: "sga-stable",   label: "SGA / FGR (stable)",          tier: 2, cite: "NG207 §1.2" },
  { key: "maternal-req", label: "Maternal request",            tier: 3, cite: "NG207 §1.2" },
  { key: "social",       label: "Social",                      tier: 3, cite: "" },
];

const BY_KEY = Object.fromEntries(IOL_IND.map(i => [i.key, i]));

export const indByKey = (key) => BY_KEY[key] ?? null;

export function isSromEscalated(entry) {
  const h = Number(entry?.sromHours);
  return Number.isFinite(h) && h >= SROM_ESCALATION_HOURS;
}

// Tier for one indication on a given entry (SROM escalates by hours since rupture).
export function indicationTier(key, entry) {
  const ind = BY_KEY[key];
  if (!ind) return 3;
  if (ind.srom) return isSromEscalated(entry) ? 1 : 2;
  return ind.tier;
}

// 0 = Urgent, 1 = High, 2 = Moderate, 3 = Routine
export function iolEntryTier(entry) {
  const keys = entry?.indications ?? [];
  if (!keys.length) return 3;
  return Math.min(...keys.map(k => indicationTier(k, entry)));
}

export function hasSrom(entry) {
  return (entry?.indications ?? []).some(k => BY_KEY[k]?.srom);
}

// The indication that sets the tier (for display of "why this priority").
export function governingIndication(entry) {
  const keys = entry?.indications ?? [];
  let best = null, bestTier = 4;
  for (const k of keys) {
    const t = indicationTier(k, entry);
    if (t < bestTier) { bestTier = t; best = k; }
  }
  return BY_KEY[best] ?? null;
}

export function entryReason(entry) {
  const gov = governingIndication(entry);
  if (!gov) return "No indication selected";
  if (gov.srom) {
    const h = Number(entry?.sromHours);
    const hrs = Number.isFinite(h) ? `${h}h since SROM` : "term PROM/SROM";
    return isSromEscalated(entry) ? `${hrs} — ≥24h, escalated to High` : `${gov.label} · ${hrs}`;
  }
  return gov.label;
}

// Sort the queue by clinical urgency:
//   1. tier (most urgent first)
//   2. if BOTH governed by SROM → longer since rupture first (infection clock)
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

    const ga = a.gestWeeks * 7 + (a.gestDays ?? 0);
    const gb = b.gestWeeks * 7 + (b.gestDays ?? 0);
    if (ga !== gb) return gb - ga;

    const sa = aSrom ? (Number(a.sromHours) || 0) : 0;
    const sb = bSrom ? (Number(b.sromHours) || 0) : 0;
    if (sa !== sb) return sb - sa;

    return (b.daysWaiting || 0) - (a.daysWaiting || 0);
  });
}
