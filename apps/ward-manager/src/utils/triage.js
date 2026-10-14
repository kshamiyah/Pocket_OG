// Board triage: who needs you now, who is due soon, and what is next for each woman.
// Everything here is derived from computeAlerts(); no clinical threshold lives in
// this file. "Next due" asks the engine when each alert would first fire later on.

import { computeAlerts } from "./wardAlerts";
import { MIN, HOUR } from "./time";
import { OBS_STAMP } from "./bedModel";

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
  "active-phase-limit": "1st stage limit",
  "active-phase-limit-soon": "1st stage limit soon",
  "arm-reassess": "Post-ARM review",
  "arm-cx-inadequate": "Contractions post-ARM",
  "ve-never": "No VE yet",
  "ve-overdue": "VE overdue",
  "ve-due-soon": "VE due soon",
  "latent-reassess": "Reassess",
  "slow-progress": "Slow progress",
  "hyperstim": "Hyperstimulation",
  "oxytocin-max": "Oxytocin at max",
  "oxytocin-increment": "Oxytocin review",
  "passive-limit": "Passive limit",
  "passive-limit-soon": "Passive limit soon",
  "pushing-limit": "Pushing limit",
  "pushing-limit-soon": "Pushing limit soon",
  "pushing-urgent": "Pushing review",
  "pushing-warning": "Pushing",
  "prom-24h": "ROM over 24h",
  "prom-18h": "ROM over 18h",
  "prom-16h": "ROM 16h+",
  "gbs-iap": "GBS antibiotics",
  "gbs-pending-rupture": "GBS pending",
  "mec-thick": "Thick meconium",
  "mec-thin": "Thin meconium",
  "liquor-blood": "Blood-stained liquor",
  "liquor-absent": "No liquor",
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
  return SHORT[alert.id] ?? tidy(alert.title);
}

// Alerts worth forecasting as "next due", with the label shown on the board.
const NEXT = {
  "ve-overdue": "VE",
  "latent-reassess": "Reassess",
  "ctg-review-due": "CTG review",
  "ctg-suspicious-overdue": "CTG recheck",
  "oxytocin-increment": "Oxytocin",
  "arm-reassess": "Post-ARM review",
  "active-phase-limit": "1st stage limit",
  "passive-limit": "Passive limit",
  "pushing-urgent": "Pushing review",
  "pushing-limit": "Pushing limit",
  "prom-18h": "ROM 18h",
  "prom-24h": "ROM 24h",
  "bgl-due": "BGL",
};

const STEP = 5 * MIN;
const HORIZON = 8 * HOUR;

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
export function triageBed(bed, now = Date.now()) {
  if (bed.delivery) return { tier: "delivered", alerts: [], shown: [], top: null, next: null, urgent: 0, warning: 0 };
  const alerts = computeAlerts(bed, now);
  const shown = alerts.filter(a => !(OBS_IDS.has(a.id) && a.severity === "info"));
  const urgent = shown.filter(a => a.severity === "urgent").length;
  const warning = shown.filter(a => a.severity === "warning").length;
  const tier = urgent ? "urgent" : warning ? "warning" : "ok";
  return { tier, alerts, shown, top: shown[0] ?? null, next: nextDue(bed, now, alerts), urgent, warning };
}

const TIER_RANK = { urgent: 0, warning: 1, ok: 2, delivered: 3 };

export function compareTriage(a, b) {
  return TIER_RANK[a.t.tier] - TIER_RANK[b.t.tier]
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
  const live = rows.filter(r => r.t.tier !== "delivered");
  const nexts = live.map(r => r.t.next?.at).filter(Boolean).sort((a, b) => a - b);
  return {
    women: live.length,
    urgent: live.filter(r => r.t.tier === "urgent").length,
    warning: live.filter(r => r.t.tier === "warning").length,
    delivered: rows.length - live.length,
    nextAt: nexts[0] ?? null,
  };
}
