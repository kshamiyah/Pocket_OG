export const MIN = 60 * 1000;
export const HOUR = 60 * MIN;

export function hhmm(t) {
  if (t == null) return "--:--";
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** 95 min → "1h 35m". Negative values clamp to 0. */
export function fmtAge(ms) {
  const m = Math.max(0, Math.floor(ms / MIN));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

export function ageOf(iso, now = Date.now()) {
  return iso ? now - new Date(iso).getTime() : null;
}

/**
 * Resolve a time choice into an ISO string.
 * choice: { minsAgo: number } | { clock: "HH:MM", daysAgo: 0|1 }
 * Returns null for a clock time that lies in the future (callers block saving).
 */
export function resolveWhen(choice, now = Date.now()) {
  if (!choice) return new Date(now).toISOString();
  if (choice.minsAgo != null) return new Date(now - choice.minsAgo * MIN).toISOString();
  if (!choice.clock) return null;
  const [h, m] = choice.clock.split(":").map(Number);
  const d = new Date(now);
  d.setDate(d.getDate() - (choice.daysAgo ?? 0));
  d.setHours(h, m, 0, 0);
  if (d.getTime() > now) return null;
  return d.toISOString();
}

/** Build a WhenPicker value from an existing ISO time (for edits). */
export function whenFromISO(iso, now = Date.now()) {
  if (!iso) return { minsAgo: 0 };
  const d = new Date(iso);
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const daysAgo = Math.max(0, Math.round((today - day) / 86400000));
  return { clock: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`, daysAgo };
}
