// Board triage: who needs you now, who is due soon, and what is next for each woman.
// Everything here is derived from computeAlerts(); no clinical threshold lives in
// this file. "Next due" asks the engine when each alert would first fire later on.

import { alertTier, computeAlerts } from "./wardAlerts";
import { MIN, HOUR } from "./time";
import { OBS_STAMP, reviewMinutes } from "./bedModel";

// Routine obs reminders are shown as P/B/T dots instead of alerts.
const OBS_IDS = new Set(Object.keys(OBS_STAMP));

/** Engine titles use em dashes; the app copy style does not. */
export function tidy(text) {
  return String(text ?? "").replace(/\s*—\s*/g, ": ");
}

const SHORT = {
  "preterm-neonatal": "Neonatal team",
  "preterm-mgso4": "MgSO4",
  "preterm-steroids": "Steroids",
  "preterm-tocolysis": "Tocolysis?",
  "under-28": "Under 28 weeks",
  "iap-preterm": "Preterm antibiotics",
  "pprom-antibiotics": "PPROM antibiotics",
  "oxytocin-stop-pathological": "Stop oxytocin",
  "bp-low": "Low BP",
  "temp-low": "Low temp",
  "pph": "PPH",
  "infection-suspected": "Antibiotics now",
  "aph": "Bleeding",
  "mgso4-eclampsia": "MgSO4 now",
  "gbs-prom-birth": "GBS ROM: offer birth",
  "mgso4-severe-pet": "Consider MgSO4",
  "active-phase-limit": "Long 1st stage",
  "arm-reassess": "Post-ARM review",
  "ve-never": "No VE yet",
  "ve-overdue": "VE overdue",
  "ve-due": "VE due",
  "latent-reassess": "Reassess",
  "slow-progress": "Slow progress",
  "oxytocin-poor-progress": "Under 2 cm on oxytocin",
  "hyperstim": "Hyperstimulation",
  "oxytocin-max": "Oxytocin at max",
  "oxytocin-increment": "Oxytocin review",
  "passive-limit": "Passive limit",
  "pushing-reassess": "Reassess pushing",
  "pushing-senior-review": "Senior review",
  "prom-48h": "ROM 48h: antibiotics",
  "prom-24h": "ROM over 24h",
  "gbs-iap": "GBS antibiotics",
  "mec-thick": "Thick meconium",
  "mec-thin": "Thin meconium",
  "liquor-blood": "Blood-stained liquor",
  "temp-38": "Pyrexia",
  "temp-375": "Raised temp",
  "tachycardia": "Tachycardia",
  "bp-severe": "Severe BP",
  "bp-elevated": "Raised BP",
  "bp-due": "BP due",
  "bp-never": "BP not recorded",
  "bgl-low": "Low BGL",
  "bgl-high": "High BGL",
  "bgl-due": "BGL due",
  "bgl-never": "BGL not recorded",
  "oliguria": "Oliguria",
  "ctg-not-documented": "CTG not logged",
  "ctg-pathological": "Pathological CTG",
  "ctg-suspicious-overdue": "CTG recheck overdue",
  "ctg-suspicious": "Suspicious CTG",
  "ctg-review-due": "CTG review due",
};

export function shortLabel(alert) {
  // An alert can carry its own short label when one id covers several states.
  return alert.short ?? SHORT[alert.id] ?? tidy(alert.title);
}

// Alerts worth forecasting as "next due", with the label shown on the board.
const NEXT = {
  "ve-due": "VE",
  "ve-overdue": "VE overdue",
  "latent-reassess": "Reassess",
  "ctg-review-due": "CTG review",
  "ctg-suspicious-overdue": "CTG recheck",
  "oxytocin-increment": "Oxytocin",
  "arm-reassess": "Post-ARM review",
  "active-phase-limit": "Long 1st stage",
  "passive-limit": "Passive limit",
  "pushing-reassess": "Reassess pushing",
  "pushing-senior-review": "Senior review",
  "prom-24h": "ROM 24h",
  "bgl-due": "BGL",
};

const STEP = 5 * MIN;
const HORIZON = 8 * HOUR;

/**
 * When one of `ids` (for example the VE reminders) will next appear, if it is
 * not showing now: { id, label, at } or null. Same 5 minute scan as nextDue.
 */
export function nextOf(bed, ids, now = Date.now()) {
  if (bed.delivery) return null;
  const want = new Set(ids);
  if (computeAlerts(bed, now).some(a => want.has(a.id))) return null;
  const hitAt = t => computeAlerts(bed, t).find(a => want.has(a.id));
  for (let t = now + STEP; t <= now + HORIZON; t += STEP) {
    if (!hitAt(t)) continue;
    for (let u = t - STEP + MIN; u < t; u += MIN) if (hitAt(u)) return { label: "VE", at: u };
    return { label: "VE", at: t };
  }
  return null;
}

/** Earliest future alert from NEXT that is not already showing. */
export function nextDue(bed, now = Date.now(), alertsNow = computeAlerts(bed, now)) {
  if (bed.delivery) return null;
  const present = new Set(alertsNow.map(a => a.id));
  const firstNew = t => computeAlerts(bed, t).find(a => NEXT[a.id] && !present.has(a.id));
  for (let t = now + STEP; t <= now + HORIZON; t += STEP) {
    const hit = firstNew(t);
    if (!hit) continue;
    // Refine to the minute inside the last step.
    for (let u = t - STEP + MIN; u < t; u += MIN) {
      const early = firstNew(u);
      if (early) return { id: early.id, label: NEXT[early.id], at: u };
    }
    return { id: hit.id, label: NEXT[hit.id], at: t };
  }
  return null;
}

/**
 * tier: "urgent" | "warning" | "ok" | "delivered"
 * shown: alerts for the board and bed panel (routine obs reminders removed)
 */
/**
 * Mark alerts a clinician has reviewed: they drop to info (out of "needs you")
 * and carry `reviewed` with the time, who, and when they come back.
 */
export function applyReviews(alerts, bed, now = Date.now()) {
  const reviews = bed.reviews ?? {};
  const out = alerts.map(a => {
    const r = reviews[a.id];
    const mins = reviewMinutes(a.id);
    if (!r || !mins) return a;
    const at = new Date(r.at).getTime();
    const until = at + mins * MIN;
    const newer = a.since && new Date(a.since).getTime() > at;
    // Worse than when it was reviewed: a higher severity or a new stage.
    const RANK = { urgent: 0, warning: 1, info: 2 };
    const worse = (r.severity && RANK[a.severity] < RANK[r.severity]) || (r.short != null && a.short && a.short !== r.short);
    if (now >= until || newer || worse) return a;
    return { ...a, severity: "info", reviewed: { at: r.at, by: r.by, until, severity: a.severity } };
  });
  const order = { urgent: 0, warning: 1, info: 2 };
  return out.sort((x, y) => order[x.severity] - order[y.severity] || alertTier(x.id) - alertTier(y.id));
}

export function triageBed(bed, now = Date.now()) {
  const alerts = applyReviews(computeAlerts(bed, now), bed, now);
  const shown = alerts.filter(a => !(OBS_IDS.has(a.id) && a.severity === "info"));
  const urgent = shown.filter(a => a.severity === "urgent").length;
  const warning = shown.filter(a => a.severity === "warning").length;
  // Reviewed problems that are still there: quieter, but never "on track" and
  // never folded away with the delivered women.
  const watching = shown.filter(a => a.reviewed).length;
  const tier = urgent ? "urgent" : warning ? "warning" : watching ? "watching" : bed.delivery ? "delivered" : "ok";
  const top = tier === "watching" ? shown.find(a => a.reviewed) : shown[0] ?? null;
  return { tier, alerts, shown, top, next: nextDue(bed, now, alerts), urgent, warning, watching };
}

const TIER_RANK = { urgent: 0, warning: 1, watching: 2, ok: 3, delivered: 4 };

export function compareTriage(a, b) {
  const top = t => (t.top ? alertTier(t.top.id) : 3);
  return TIER_RANK[a.t.tier] - TIER_RANK[b.t.tier]
    || top(a.t) - top(b.t)
    || b.t.urgent - a.t.urgent
    || b.t.warning - a.t.warning
    || (a.t.next?.at ?? Infinity) - (b.t.next?.at ?? Infinity)
    || String(a.bed.bedNumber).localeCompare(String(b.bed.bedNumber), undefined, { numeric: true });
}

/** [{ bed, t }] sorted for the board. */
export function triageWard(beds, now = Date.now()) {
  return Object.values(beds).map(bed => ({ bed, t: triageBed(bed, now) })).sort(compareTriage);
}

export function wardSummary(rows) {
  const live = rows.filter(r => !r.bed.delivery);
  const nexts = live.map(r => r.t.next?.at).filter(Boolean).sort((a, b) => a - b);
  return {
    women: live.length,
    urgent: rows.filter(r => r.t.tier === "urgent").length,
    warning: rows.filter(r => r.t.tier === "warning").length,
    watching: rows.filter(r => r.t.tier === "watching").length,
    delivered: rows.length - live.length,
    nextAt: nexts[0] ?? null,
  };
}
