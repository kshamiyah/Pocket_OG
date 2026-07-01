// In-app changelog — newest release first. Edit this when you ship something.
// Each change has a `tag`: "new" | "improved" | "fixed".
// Keep the top `version` in step with package.json so the About build stamp,
// the hero chip and this list all show the same number.
export const UPDATES = [
  {
    version: "1.0.0",
    date: "01/07/2026",
    title: "First release",
    changes: [
      { tag: "new", text: "Pocket O&G is live — a fast, offline reference for O&G trainees." },
    ],
  },
];

export const LATEST_VERSION = UPDATES[0].version;
export const LATEST_TITLE = UPDATES[0].title;

const SEEN_KEY = "pocketog_updates_seen_v1";

export function hasUnseenUpdates() {
  try {
    return localStorage.getItem(SEEN_KEY) !== LATEST_VERSION;
  } catch {
    return false;
  }
}

export function markUpdatesSeen() {
  try {
    localStorage.setItem(SEEN_KEY, LATEST_VERSION);
  } catch { /* storage unavailable — ignore */ }
}
