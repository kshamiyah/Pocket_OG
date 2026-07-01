// In-app changelog — newest release first. Edit this when you ship something.
// Each change has a `tag`: "new" | "improved" | "fixed".
// Keep the top `version` in step with package.json so the About build stamp,
// the hero chip and this list all show the same number.
export const UPDATES = [
  {
    version: "1.0.0",
    date: "Jul 2026",
    title: "First release",
    changes: [
      { tag: "new", text: "Interactive CTG classifier with the NICE NG229 reader & flowchart" },
      { tag: "new", text: "Cord prolapse emergency pathway (RCOG GTG50)" },
      { tag: "new", text: "In-app feedback — leave a quick note or a short survey" },
      { tag: "improved", text: "Colour-coded by source across the app, with a legend" },
      { tag: "improved", text: "New app typeface (Geist) and a cleaner home screen" },
    ],
  },
  {
    version: "0.1.0",
    date: "Jun 2026",
    title: "Initial release",
    changes: [
      { tag: "new", text: "29 guidelines with full-text search and in-app readers" },
      { tag: "new", text: "Interactive flowcharts, Rx formulary, Consent and Calculators" },
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
