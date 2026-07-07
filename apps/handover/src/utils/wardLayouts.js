// A ward's bed layout is a composition of sections, so wards with lettered
// bays, plain numbered beds, side rooms, or a mix of all three can all be
// expressed without special-casing. Each section generates its own slice of
// the bed list; a ward's full bed list is just all sections flattened in
// order.

export const SECTION_TYPE = { RANGE: "range", GRID: "grid", NAMED: "named" };

const MAX_SECTION_BEDS = 60;

let _sectionUid = 0;
export function nextSectionId() {
  return `s${Date.now().toString(36)}${(_sectionUid++).toString(36)}`;
}

export function rangeBeds({ prefix = "", from, to }) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  const span = end - start + 1;
  if (!Number.isFinite(span) || span < 1 || span > MAX_SECTION_BEDS) return [];
  return Array.from({ length: span }, (_, i) => `${prefix}${start + i}`);
}

export function gridBeds({ bays = [], perBay }) {
  if (!Array.isArray(bays) || bays.length === 0) return [];
  if (!Number.isFinite(perBay) || perBay < 1 || perBay > MAX_SECTION_BEDS) return [];
  return bays.flatMap((bay) => Array.from({ length: perBay }, (_, i) => `${bay}${i + 1}`));
}

export function namedBeds(items = []) {
  return [...new Set(items.map((s) => String(s).trim()).filter(Boolean))];
}

export function bedsForSection(section) {
  if (section.type === SECTION_TYPE.RANGE) return rangeBeds(section);
  if (section.type === SECTION_TYPE.GRID) return gridBeds(section);
  if (section.type === SECTION_TYPE.NAMED) return namedBeds(section.items);
  return [];
}

// Flattened, section-tagged bed list for a saved layout — used to render the
// bed picker grouped the way it was set up (Bay A's beds together, etc).
export function flattenLayout(layout) {
  if (!layout?.sections?.length) return [];
  return layout.sections.flatMap((section) => {
    const beds = bedsForSection(section);
    return beds.map((bed) => ({ bed, sectionId: section.id, sectionLabel: section.label || "" }));
  });
}

export function totalBeds(layout) {
  return flattenLayout(layout).length;
}

// Beds to offer for a ward: recently-used first, then whatever the saved
// layout generates, deduplicated.
export function bedsForWard(ward, wardLayouts, recentBeds) {
  const key = (ward || "").trim();
  if (!key) return [];
  const recent = recentBeds[key] || [];
  const layoutBeds = flattenLayout(wardLayouts[key]).map((b) => b.bed);
  const merged = [...recent];
  for (const b of layoutBeds) if (!merged.includes(b)) merged.push(b);
  return merged;
}

// A layout key existing in storage (even with zero sections) means "this
// ward has been configured, deliberately or with no beds" — distinct from
// "nobody has set this ward up yet".
export function hasLayout(wardLayouts, ward) {
  const key = (ward || "").trim();
  return Boolean(key && wardLayouts[key]);
}

export function saveLayout(wardLayouts, ward, layout) {
  const key = (ward || "").trim();
  if (!key) return wardLayouts;
  return { ...wardLayouts, [key]: layout };
}

export function deleteLayout(wardLayouts, ward) {
  const key = (ward || "").trim();
  if (!key || !(key in wardLayouts)) return wardLayouts;
  const next = { ...wardLayouts };
  delete next[key];
  return next;
}
