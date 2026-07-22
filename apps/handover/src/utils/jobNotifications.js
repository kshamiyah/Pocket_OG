import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const MAX_BODY = 160;

function notificationId(jobId) {
  if (typeof jobId === "number" && Number.isInteger(jobId) && jobId > 0) return jobId;
  let hash = 0;
  const s = String(jobId);
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  return Math.abs(hash) % 2147483646 || 1;
}

function formatBody(job) {
  const location = [job.ward, job.bed].filter(Boolean).join(" · ");
  const text = job.text?.trim() || "Task due";
  const clipped = text.length > MAX_BODY ? `${text.slice(0, MAX_BODY - 1)}…` : text;
  return location ? `${location}\n${clipped}` : clipped;
}

async function ensurePermission() {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === "granted") return true;
  const requested = await LocalNotifications.requestPermissions();
  return requested.display === "granted";
}

async function clearPending() {
  const { notifications } = await LocalNotifications.getPending();
  if (notifications.length === 0) return;
  await LocalNotifications.cancel({
    notifications: notifications.map((n) => ({ id: n.id })),
  });
}

/** Schedule OS reminders for open jobs with a future remindAt (native only). */
export async function syncJobReminders(jobs) {
  if (!Capacitor.isNativePlatform()) return;

  const future = jobs.filter((job) => {
    if (job.done || !job.remindAt) return false;
    const at = new Date(job.remindAt).getTime();
    return !Number.isNaN(at) && at > Date.now();
  });

  try {
    await clearPending();
    if (future.length === 0) return;
    if (!(await ensurePermission())) return;

    await LocalNotifications.schedule({
      notifications: future.map((job) => ({
        id: notificationId(job.id),
        title: "Task due",
        body: formatBody(job),
        schedule: { at: new Date(job.remindAt) },
      })),
    });
  } catch {
    /* notifications unavailable; in-app reminders still work */
  }
}
