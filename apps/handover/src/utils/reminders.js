export const REMINDER_OFFSETS = [
  { label: "+30m", minutes: 30 },
  { label: "+1h", minutes: 60 },
  { label: "+2h", minutes: 120 },
];

export const SNOOZE_MINUTES = 15;

export function remindAtFromOffset(minutes, from = Date.now()) {
  return new Date(from + minutes * 60_000).toISOString();
}

/** HH:mm (24h) today; if already passed, use tomorrow. */
export function remindAtFromTimeString(hhmm, from = Date.now()) {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const d = new Date(from);
  d.setHours(h, m, 0, 0);
  if (d.getTime() <= from) d.setDate(d.getDate() + 1);
  return d.toISOString();
}

export function timeStringFromRemindAt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** @returns {"due"|"scheduled"|null} */
export function reminderStatus(remindAt, now = Date.now()) {
  if (!remindAt) return null;
  const at = new Date(remindAt).getTime();
  if (Number.isNaN(at)) return null;
  return at <= now ? "due" : "scheduled";
}

export function formatReminderLabel(remindAt, now = Date.now()) {
  if (!remindAt) return null;
  const d = new Date(remindAt);
  if (Number.isNaN(d.getTime())) return null;

  const clock = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const diffMs = d.getTime() - now;
  if (diffMs <= 0) return "Task due";

  const mins = Math.ceil(diffMs / 60_000);
  if (mins < 60) return `Remind ${clock} · in ${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 24) {
    return rem > 0 ? `Remind ${clock} · in ${hours}h ${rem}m` : `Remind ${clock} · in ${hours}h`;
  }
  return `Remind ${clock}`;
}

export function countDueReminders(jobs, now = Date.now()) {
  return jobs.filter((j) => !j.done && reminderStatus(j.remindAt, now) === "due").length;
}

export function dueTasks(jobs, now = Date.now()) {
  return jobs.filter((j) => !j.done && reminderStatus(j.remindAt, now) === "due");
}

export function upcomingTasks(jobs, now = Date.now()) {
  return jobs
    .filter((j) => !j.done && reminderStatus(j.remindAt, now) === "scheduled")
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());
}

export function countScheduledTasks(jobs, now = Date.now()) {
  return upcomingTasks(jobs, now).length;
}
