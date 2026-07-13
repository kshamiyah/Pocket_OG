// Seed data for deterministic app states. Shapes mirror the real storage
// contract (src/utils/storage.js keys, all _v1) and the job/layout shapes in
// src/utils/jobs.js and src/utils/wardLayouts.js.

export const KEYS = {
  profile: "handover_profile_v1",
  shift: "handover_shift_v1",
  jobs: "handover_jobs_v1",
  recentWards: "handover_recent_wards_v1",
  recentPhrases: "handover_recent_phrases_v1",
  wardLayouts: "handover_ward_layouts_v1",
  recentBeds: "handover_recent_beds_v1",
  coachDone: "handover_coach_done_v1",
  theme: "handover_theme_v1",
};

export const PROFILE = { name: "Sam", role: "sho" };

export const SHIFT = { type: "long", startedAt: "2026-07-13T08:00:00.000Z" };

// Two configured wards: a numbered range with side rooms, and a lettered grid.
export const WARD_LAYOUTS = {
  "Delivery Suite": {
    sections: [
      { id: "s-ds-1", type: "range", prefix: "Room ", from: 1, to: 6 },
      { id: "s-ds-2", type: "named", items: ["Theatre", "Recovery"] },
    ],
  },
  "Ward 42": {
    sections: [
      { id: "s-w42-1", type: "grid", bayKind: "letter", bedKind: "number", bays: ["A", "B", "C"], perBay: 4 },
      { id: "s-w42-2", type: "range", prefix: "SR", from: 1, to: 3 },
    ],
  },
};

export const RECENT_WARDS = ["Delivery Suite", "Ward 42"];
export const RECENT_BEDS = {
  "Delivery Suite": ["Room 3", "Room 5", "Theatre"],
  "Ward 42": ["A2", "B1", "SR2"],
};

// A FIXED wall-clock the browser is pinned to (see FIXED_NOW injection in
// run.mjs). Anchoring fixtures here makes reminder due/upcoming states AND
// relative-age text ("just now", "1h ago") deterministic, so baseline diffs
// stay stable across runs.
export const FIXED_NOW = Date.parse("2026-07-13T09:00:00.000Z");
function iso(offsetMin) { return new Date(FIXED_NOW + offsetMin * 60000).toISOString(); }

// A populated, cross-ward job list with urgent/routine, done, and reminders in
// both due (past) and scheduled (future) states, plus one long-text job to
// stress truncation/overlap.
export const JOBS = [
  { id: 1, text: "Chase FBC + G&S, escalate if Hb < 70", ward: "Delivery Suite", bed: "Room 3", priority: "urgent", done: false, createdAt: iso(-60), remindAt: iso(-10) },
  { id: 2, text: "Review CTG", ward: "Delivery Suite", bed: "Room 5", priority: "routine", done: false, createdAt: iso(-55) },
  { id: 3, text: "Site the epidural, anaesthetist aware and on the way for the next available slot", ward: "Delivery Suite", bed: "Theatre", priority: "routine", done: false, createdAt: iso(-50), remindAt: iso(30) },
  { id: 4, text: "Consent for LSCS", ward: "Ward 42", bed: "A2", priority: "urgent", done: false, createdAt: iso(-45) },
  { id: 5, text: "Discharge summary", ward: "Ward 42", bed: "B1", priority: "routine", done: true, createdAt: iso(-120) },
  { id: 6, text: "TTOs and remove cannula", ward: "Ward 42", bed: "SR2", priority: "routine", done: false, createdAt: iso(-40), remindAt: iso(-5) },
  { id: 7, text: "Bloods round across the whole ward before the post-take", ward: "", bed: "", priority: "routine", done: false, createdAt: iso(-30) },
];

export const RECENT_PHRASES = ["Chase bloods", "Review CTG", "Consent", "TTOs"];

// A named localStorage seed for a given scenario. `theme` optional.
export function seedScript(state = {}) {
  const {
    profile = null, shift = null, jobs = [], wardLayouts = {},
    recentWards = [], recentBeds = {}, recentPhrases = [], coachDone = true, theme = "light",
  } = state;
  const data = {
    [KEYS.profile]: profile,
    [KEYS.shift]: shift,
    [KEYS.jobs]: jobs,
    [KEYS.wardLayouts]: wardLayouts,
    [KEYS.recentWards]: recentWards,
    [KEYS.recentBeds]: recentBeds,
    [KEYS.recentPhrases]: recentPhrases,
    [KEYS.coachDone]: coachDone,
  };
  // theme is stored as a raw string, not JSON.
  return { data, theme };
}

// The "fully set up, mid-shift, populated" baseline most seeded states build on.
export function runningState(overrides = {}) {
  return seedScript({
    profile: PROFILE, shift: SHIFT, jobs: JOBS, wardLayouts: WARD_LAYOUTS,
    recentWards: RECENT_WARDS, recentBeds: RECENT_BEDS, recentPhrases: RECENT_PHRASES,
    ...overrides,
  });
}
