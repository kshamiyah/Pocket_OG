import { PRIORITY } from "./constants";

export const REMINDER_OFFSETS = [
  { label: "+30m", minutes: 30 },
  { label: "+1h", minutes: 60 },
  { label: "+2h", minutes: 120 },
];

export const SNOOZE_MINUTES = 15;
export const UPCOMING_BADGE_MINUTES = 60;

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

function compareDueTasks(a, b) {
  const aUrgent = a.priority === PRIORITY.URGENT ? 0 : 1;
  const bUrgent = b.priority === PRIORITY.URGENT ? 0 : 1;
  if (aUrgent !== bUrgent) return aUrgent - bUrgent;
  return new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime();
}

export function countDueReminders(jobs, now = Date.now()) {
  return jobs.filter((j) => !j.done && reminderStatus(j.remindAt, now) === "due").length;
}

export function dueTasks(jobs, now = Date.now()) {
  return jobs
    .filter((j) => !j.done && reminderStatus(j.remindAt, now) === "due")
    .sort(compareDueTasks);
}

export function upcomingTasks(jobs, now = Date.now()) {
  return jobs
    .filter((j) => !j.done && reminderStatus(j.remindAt, now) === "scheduled")
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());
}

export function upcomingWithinMinutes(jobs, minutes = UPCOMING_BADGE_MINUTES, now = Date.now()) {
  const limit = now + minutes * 60_000;
  return upcomingTasks(jobs, now).filter((j) => new Date(j.remindAt).getTime() <= limit);
}

/** Bell badge: due now + reminders in the next hour. */
export function notificationBadgeCount(jobs, now = Date.now()) {
  const due = countDueReminders(jobs, now);
  const soon = upcomingWithinMinutes(jobs, UPCOMING_BADGE_MINUTES, now).length;
  return due + soon;
}

export function urgentTasksWithoutReminder(jobs) {
  return jobs
    .filter((j) => !j.done && !j.remindAt && j.priority === PRIORITY.URGENT)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export function countScheduledTasks(jobs, now = Date.now()) {
  return upcomingTasks(jobs, now).length;
}
