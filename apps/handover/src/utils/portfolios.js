import { ROLES } from "./constants";

const STORE_KEY = "handover_portfolios_v2";

const V1_KEYS = [
  "handover_profile_v1",
  "handover_shift_v1",
  "handover_jobs_v1",
  "handover_recent_wards_v1",
  "handover_recent_phrases_v1",
];

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

function newId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyPortfolio({ name, role = null }) {
  const now = new Date().toISOString();
  return {
    id: newId(),
    name: name.trim(),
    role,
    jobs: [],
    recentWards: [],
    recentPhrases: [],
    wardTasks: {},
    wardLayouts: {},
    recentBeds: {},
    captureMode: "round",
    shift: null,
    createdAt: now,
    lastUsedAt: now,
  };
}

function loadStoreRaw() {
  return read(STORE_KEY, { activeId: null, items: {} });
}

function saveStore(store) {
  write(STORE_KEY, store);
}

function migrateV1() {
  const hasV1 = V1_KEYS.some((key) => localStorage.getItem(key) != null);
  if (!hasV1) return null;

  const profile = read("handover_profile_v1", null);
  const portfolio = emptyPortfolio({
    name: "My list",
    role: profile?.role ?? null,
  });
  portfolio.jobs = read("handover_jobs_v1", []);
  portfolio.recentWards = read("handover_recent_wards_v1", []);
  portfolio.recentPhrases = read("handover_recent_phrases_v1", []);
  portfolio.shift = read("handover_shift_v1", null);

  const store = { activeId: portfolio.id, items: { [portfolio.id]: portfolio } };
  saveStore(store);

  for (const key of V1_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }

  return portfolio;
}

export function loadStore() {
  let store = loadStoreRaw();
  if (!store.items || typeof store.items !== "object") {
    store = { activeId: null, items: {} };
  }
  if (Object.keys(store.items).length === 0) {
    const migrated = migrateV1();
    if (migrated) return loadStoreRaw();
  }
  return store;
}

export function listPortfolios() {
  const { items } = loadStore();
  return Object.values(items).sort(
    (a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt)
  );
}

export function getActivePortfolio() {
  const store = loadStore();
  if (!store.activeId) return null;
  const p = store.items[store.activeId];
  if (!p) return null;
  return {
    ...p,
    wardTasks: p.wardTasks || {},
    wardLayouts: p.wardLayouts || {},
    recentBeds: p.recentBeds || {},
    captureMode: p.captureMode || "round",
  };
}

export function getPortfolio(id) {
  return loadStore().items[id] ?? null;
}

export function createPortfolio({ name, role = null }) {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const portfolio = emptyPortfolio({ name: trimmed, role });
  const store = loadStore();
  store.items[portfolio.id] = portfolio;
  store.activeId = portfolio.id;
  saveStore(store);
  return portfolio;
}

export function updatePortfolio(id, patch) {
  const store = loadStore();
  const current = store.items[id];
  if (!current) return null;

  const next = {
    ...current,
    ...patch,
    id: current.id,
    name: patch.name != null ? String(patch.name).trim() || current.name : current.name,
    lastUsedAt: new Date().toISOString(),
  };
  store.items[id] = next;
  saveStore(store);
  return next;
}

export function deletePortfolio(id) {
  const store = loadStore();
  if (!store.items[id]) return false;

  delete store.items[id];
  if (store.activeId === id) {
    const remaining = Object.keys(store.items);
    store.activeId = remaining[0] ?? null;
  }
  saveStore(store);
  return true;
}

export function activatePortfolio(id) {
  const store = loadStore();
  const portfolio = store.items[id];
  if (!portfolio) return null;

  store.activeId = id;
  portfolio.lastUsedAt = new Date().toISOString();
  store.items[id] = portfolio;
  saveStore(store);
  return portfolio;
}

export function persistActivePortfolio(patch) {
  const store = loadStore();
  const id = store.activeId;
  if (!id || !store.items[id]) return null;

  const next = {
    ...store.items[id],
    ...patch,
    lastUsedAt: new Date().toISOString(),
  };
  store.items[id] = next;
  saveStore(store);
  return next;
}

export function roleLabel(roleKey) {
  if (!roleKey) return null;
  return ROLES.find((r) => r.key === roleKey)?.label ?? null;
}

// Most-recently-used, de-duplicated, capped list.
export function pushMRU(list, value, max = 6) {
  const trimmed = value.trim();
  if (!trimmed) return list;
  const next = [trimmed, ...list.filter((v) => v.toLowerCase() !== trimmed.toLowerCase())];
  return next.slice(0, max);
}
