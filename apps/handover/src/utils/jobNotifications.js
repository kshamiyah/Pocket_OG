import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { PRIORITY } from "./constants";

const MAX_BODY = 160;
const MAX_TITLE = 48;

export function notificationId(jobId) {
  if (typeof jobId === "number" && Number.isInteger(jobId) && jobId > 0) return jobId;
  let hash = 0;
  const s = String(jobId);
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  return Math.abs(hash) % 2147483646 || 1;
}

export function jobIdFromNotificationId(jobs, notifId) {
  return jobs.find((j) => notificationId(j.id) === notifId)?.id ?? null;
}

function formatTitle(job) {
  const urgent = job.priority === PRIORITY.URGENT;
  const location = [job.ward, job.bed].filter(Boolean).join(" · ");
  if (location) {
    const prefix = urgent ? "Urgent · " : "";
    const title = `${prefix}${location}`;
    return title.length > MAX_TITLE ? `${title.slice(0, MAX_TITLE - 1)}…` : title;
  }
  if (urgent) return "Urgent task due";
  const text = job.text?.trim() || "Task due";
  return text.length > MAX_TITLE ? `${text.slice(0, MAX_TITLE - 1)}…` : text;
}

function formatBody(job) {
  const location = [job.ward, job.bed].filter(Boolean).join(" · ");
  const text = job.text?.trim() || "Task due";
  const clipped = text.length > MAX_BODY ? `${text.slice(0, MAX_BODY - 1)}…` : text;
  return location ? clipped : clipped;
}

function buildNotification(job) {
  const at = new Date(job.remindAt).getTime();
  return {
    id: notificationId(job.id),
    title: formatTitle(job),
    body: formatBody(job),
    schedule: { at: new Date(at) },
    extra: { jobId: job.id, remindAt: job.remindAt },
  };
}

function futureReminderJobs(jobs) {
  return jobs.filter((job) => {
    if (job.done || !job.remindAt) return false;
    const at = new Date(job.remindAt).getTime();
    return !Number.isNaN(at) && at > Date.now();
  });
}

async function ensurePermission({ onPermissionPrompt, onPermissionDenied } = {}) {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === "granted") return true;
  if (current.display === "denied") {
    onPermissionDenied?.();
    return false;
  }
  onPermissionPrompt?.();
  const requested = await LocalNotifications.requestPermissions();
  if (requested.display === "granted") return true;
  onPermissionDenied?.();
  return false;
}

function scheduleChanged(pending, desired) {
  if (!pending?.schedule?.at) return true;
  const pendingAt = new Date(pending.schedule.at).getTime();
  const desiredAt = desired.schedule.at.getTime();
  if (Number.isNaN(pendingAt) || Number.isNaN(desiredAt)) return true;
  return Math.abs(pendingAt - desiredAt) > 1000
    || pending.title !== desired.title
    || pending.body !== desired.body;
}

/** Schedule OS reminders for open jobs with a future remindAt (native only). */
export async function syncJobReminders(jobs, callbacks = {}) {
  if (!Capacitor.isNativePlatform()) return;

  const desiredList = futureReminderJobs(jobs).map(buildNotification);
  const desiredIds = new Set(desiredList.map((n) => n.id));

  try {
    const { notifications: pending } = await LocalNotifications.getPending();
    const pendingById = new Map(pending.map((n) => [n.id, n]));

    const toCancel = pending
      .filter((n) => !desiredIds.has(n.id))
      .map((n) => ({ id: n.id }));

    const toSchedule = [];
    for (const desired of desiredList) {
      const existing = pendingById.get(desired.id);
      if (!existing || scheduleChanged(existing, desired)) {
        toSchedule.push(desired);
      }
    }

    if (toCancel.length > 0) {
      await LocalNotifications.cancel({ notifications: toCancel });
    }

    if (desiredList.length === 0) return;

    if (toSchedule.length === 0) return;

    if (!(await ensurePermission(callbacks))) return;

    await LocalNotifications.schedule({ notifications: toSchedule });
  } catch {
    /* notifications unavailable; in-app reminders still work */
  }
}

/** Cancel and reschedule a single job reminder (e.g. after snooze). */
export async function syncOneJobReminder(job, callbacks = {}) {
  if (!Capacitor.isNativePlatform()) return;

  const id = notificationId(job.id);

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    if (job.done || !job.remindAt) return;

    const at = new Date(job.remindAt).getTime();
    if (Number.isNaN(at) || at <= Date.now()) return;

    if (!(await ensurePermission(callbacks))) return;

    await LocalNotifications.schedule({ notifications: [buildNotification(job)] });
  } catch {
    /* ignore */
  }
}

export function listenForNotificationOpens(onOpenJobId) {
  if (!Capacitor.isNativePlatform()) return () => {};

  let handle;
  LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
    const jobId = event.notification?.extra?.jobId ?? event.notification?.id;
    if (jobId != null) onOpenJobId(jobId);
  }).then((h) => {
    handle = h;
  });

  return () => handle?.remove();
}
