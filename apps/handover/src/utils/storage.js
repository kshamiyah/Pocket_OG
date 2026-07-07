const KEYS = {
  profile: "handover_profile_v1",
  shift: "handover_shift_v1",
  jobs: "handover_jobs_v1",
  recentWards: "handover_recent_wards_v1",
  recentPhrases: "handover_recent_phrases_v1",
  wardLayouts: "handover_ward_layouts_v1",
  recentBeds: "handover_recent_beds_v1",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const Storage = {
  getProfile: () => read(KEYS.profile, null),
  setProfile: (profile) => write(KEYS.profile, profile),

  getShift: () => read(KEYS.shift, null),
  setShift: (shift) => write(KEYS.shift, shift),
  clearShift: () => { try { localStorage.removeItem(KEYS.shift); } catch { /* ignore */ } },

  getJobs: () => read(KEYS.jobs, []),
  setJobs: (jobs) => write(KEYS.jobs, jobs),

  getRecentWards: () => read(KEYS.recentWards, []),
  setRecentWards: (wards) => write(KEYS.recentWards, wards),

  getRecentPhrases: () => read(KEYS.recentPhrases, []),
  setRecentPhrases: (phrases) => write(KEYS.recentPhrases, phrases),

  // { [wardName]: { sections: [...] } }
  getWardLayouts: () => read(KEYS.wardLayouts, {}),
  setWardLayouts: (layouts) => write(KEYS.wardLayouts, layouts),

  // { [wardName]: [bed, ...] } — most-recently-used beds, per ward
  getRecentBeds: () => read(KEYS.recentBeds, {}),
  setRecentBeds: (beds) => write(KEYS.recentBeds, beds),
};

// Most-recently-used, de-duplicated, capped list — used for both ward chips
// and job-text suggestion chips.
export function pushMRU(list, value, max = 6) {
  const trimmed = value.trim();
  if (!trimmed) return list;
  const next = [trimmed, ...list.filter((v) => v.toLowerCase() !== trimmed.toLowerCase())];
  return next.slice(0, max);
}
