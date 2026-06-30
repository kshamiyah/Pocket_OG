// In-app changelog — newest release first. Edit this when you ship something.
// Each change has a `tag`: "new" | "improved" | "fixed".
// Keep the top `version` in step with package.json so the About build stamp,
// the hero chip and this list all show the same number.
export const UPDATES = [
  {
    version: "0.2.0",
    date: "30 Jun 2026",
    title: "CTG tools, emergencies & feedback",
    changes: [
      { tag: "new", text: "Interactive CTG classifier with the NICE NG229 reader & flowchart" },
      { tag: "new", text: "Cord prolapse emergency pathway (RCOG GTG50)" },
      { tag: "improved", text: "Feedback: leave a quick note or a short survey, all in-app" },
      { tag: "improved", text: "Smarter search — added CTG terms and tidied synonyms" },
      { tag: "fixed", text: "Themed flowchart groups and added a build/version stamp" },
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
