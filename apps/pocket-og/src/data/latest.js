// Latest: the curated news feed behind the Latest tab.
//
// Items live in /latest.json, a static asset deployed alongside the app but
// deliberately NOT precached by the service worker (the PWA glob skips .json),
// so a news-only deploy reaches installed apps on their next online visit
// without a version bump. The app fetches the feed when online and keeps the
// last good copy in localStorage so the tab still reads offline.
//
// Feed shape: { updated: "YYYY-MM-DD", items: [ ... ] }
// Item shape:
//   id      stable string, the dedupe/seen key (e.g. "2026-06-gtg27-pas")
//   date    "YYYY-MM-DD" or "YYYY-MM" when only the month is known
//   kind    "guideline" | "trial" | "safety" | "report"
//   source  a SOURCE_COLORS key (NICE, RCOG, TRIAL, ...) for the accent colour
//   weight  "practice" (practice changed) | "aware" (worth knowing)
//   title   headline
//   why     two sentences max on what it means on the ward
//   url     the primary source; every item must link out
//   link    optional { type, id } for handleNavigate into an app card

const CACHE_KEY = "pocketog_news_v1";
const SEEN_KEY = "pocketog_news_seen_v1";

export const NEWS_KINDS = {
  guideline: { label: "Guideline" },
  trial: { label: "Trial" },
  safety: { label: "Safety" },
  report: { label: "Report" },
  research: { label: "Research" },
};

function isValidItem(it) {
  return it && typeof it.id === "string" && typeof it.title === "string" && typeof it.url === "string";
}

function sanitizeFeed(feed) {
  if (!feed || !Array.isArray(feed.items)) return null;
  return { updated: feed.updated ?? null, items: feed.items.filter(isValidItem) };
}

// Last good copy, or null if never synced. Returns { feed, syncedAt }.
export function loadCachedNews() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const feed = sanitizeFeed(parsed.feed);
    if (!feed) return null;
    return { feed, syncedAt: parsed.syncedAt ?? null };
  } catch {
    return null;
  }
}

export function saveCachedNews(feed) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ feed, syncedAt: Date.now() }));
  } catch { /* storage unavailable — ignore */ }
}

// Network fetch; resolves to the parsed feed or rejects (offline, bad payload).
export async function fetchLatestNews() {
  const res = await fetch("/latest.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`latest.json ${res.status}`);
  const feed = sanitizeFeed(await res.json());
  if (!feed) throw new Error("latest.json malformed");
  return feed;
}

function seenIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function unseenNewsIds(items) {
  const seen = seenIds();
  return new Set(items.filter(it => !seen.has(it.id)).map(it => it.id));
}

// Store only the ids in the current feed, so the seen list can't grow forever.
export function markNewsSeen(items) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(items.map(it => it.id)));
  } catch { /* storage unavailable — ignore */ }
}

// "30 Jun 2026" from "2026-06-30", "Jun 2026" from "2026-06".
export function formatNewsDate(date) {
  if (!date) return "";
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m) return date;
  const dt = new Date(Date.UTC(y, m - 1, d || 1));
  const opts = d
    ? { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
    : { month: "short", year: "numeric", timeZone: "UTC" };
  return dt.toLocaleDateString("en-GB", opts);
}

// "just now" / "2 h ago" / "3 days ago" for the sync stamp.
export function formatSyncedAgo(syncedAt) {
  if (!syncedAt) return null;
  const mins = Math.floor((Date.now() - syncedAt) / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
