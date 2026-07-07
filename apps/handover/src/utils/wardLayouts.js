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

export function rangeBeds({ prefix = "", from, to, custom } = {}) {
  if (custom?.length) {
    if (custom.length > MAX_SECTION_BEDS) return [];
    return custom.map((n) => `${prefix}${n}`);
  }
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  const span = end - start + 1;
  if (!Number.isFinite(span) || span < 1 || span > MAX_SECTION_BEDS) return [];
  return Array.from({ length: span }, (_, i) => `${prefix}${start + i}`);
}

export function parseCustomNums(input) {
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  const nums = parts.map((s) => Number(s)).filter((n) => Number.isFinite(n));
  return [...new Set(nums)];
}

export const GRID_KIND = { LETTER: "letter", NUMBER: "number" };

// Legacy — old sections may still use bed-first via gridFormat / labelOrder.
const LABEL_ORDER = { BAY_FIRST: "bayFirst", BED_FIRST: "bedFirst" };
export const GRID_FORMAT = { LETTER_FIRST: "letterFirst", NUMBER_FIRST: "numberFirst" };

function indexToLetter(i) {
  const n = i + 1;
  if (n < 1 || n > 26) return String(n);
  return String.fromCharCode(64 + n);
}

function usesBedFirst(section) {
  if (section.labelOrder === LABEL_ORDER.BED_FIRST) return true;
  if (!section.bayKind && section.gridFormat === GRID_FORMAT.NUMBER_FIRST) return true;
  return false;
}

function formatLabel(bayToken, bedToken, bedFirst) {
  return bedFirst ? `${bedToken}${bayToken}` : `${bayToken}${bedToken}`;
}

export function bayListFromSection(section) {
  const bayKind = section.bayKind ?? GRID_KIND.LETTER;
  if (bayKind === GRID_KIND.NUMBER) {
    if (Number.isFinite(section.bayFrom) && Number.isFinite(section.bayTo)) {
      return rangeBeds({ from: section.bayFrom, to: section.bayTo }).map(String);
    }
    return (section.bays || []).map(String);
  }
  return [...new Set((section.bays || []).map((b) => String(b).trim().toUpperCase()).filter(Boolean))];
}

export function normalizeGridSection(section) {
  if (section.bayKind && section.bedKind) return section;
  if (section.gridFormat === GRID_FORMAT.NUMBER_FIRST) {
    return {
      ...section,
      bayKind: GRID_KIND.LETTER,
      bedKind: GRID_KIND.NUMBER,
      labelOrder: LABEL_ORDER.BED_FIRST,
    };
  }
  return {
    ...section,
    bayKind: GRID_KIND.LETTER,
    bedKind: GRID_KIND.NUMBER,
  };
}

export function gridBeds(rawSection) {
  const section = normalizeGridSection(rawSection);
  const { bedKind } = section;
  const bays = bayListFromSection(section);
  const bedFirst = usesBedFirst(section);
  if (bays.length === 0) return [];

  return bays.flatMap((bay) => {
    const count = bedCountForBay(section, bay);
    if (!Number.isFinite(count) || count < 1 || count > MAX_SECTION_BEDS) return [];
    return Array.from({ length: count }, (_, i) => {
      const bayToken = String(bay);
      const bedToken = bedKind === GRID_KIND.LETTER ? indexToLetter(i) : String(i + 1);
      return formatLabel(bayToken, bedToken, bedFirst);
    });
  });
}

export function bedCountForBay(section, bay) {
  const key = String(bay);
  const custom = section.bayCounts?.[key];
  if (custom != null && Number.isFinite(Number(custom))) return Number(custom);
  return Number(section.perBay);
}

export function namedBeds(items = []) {
  return [...new Set(items.map((s) => String(s).trim()).filter(Boolean))];
}

// Bay-first sort: all B beds, then all C, then numeric bays (14A…), then side rooms (SR1…).
const BED_KIND_ORDER = { letter: 0, number: 1, plain: 1, side: 2, other: 3 };

export function parseBedLabel(label) {
  const s = String(label);
  let m = s.match(/^([A-Z])(\d+)$/i);
  if (m) return { kind: "letter", group: m[1].toUpperCase(), within: Number(m[2]) };
  m = s.match(/^(\d+)([A-Z])$/i);
  if (m) return { kind: "number", group: m[1], within: m[2].toUpperCase() };
  m = s.match(/^([A-Z]{2,})(\d+)$/i);
  if (m) return { kind: "side", group: m[1].toUpperCase(), within: Number(m[2]) };
  m = s.match(/^(\d+)$/);
  if (m) return { kind: "plain", group: "", within: Number(m[1]) };
  return { kind: "other", group: s, within: 0 };
}

function compareGroup(pa, pb) {
  if (pa.kind === "number" || pa.kind === "plain") {
    return Number(pa.group) - Number(pb.group);
  }
  return String(pa.group).localeCompare(String(pb.group), undefined, { numeric: true });
}

function compareWithin(pa, pb) {
  if (typeof pa.within === "number" && typeof pb.within === "number") {
    return pa.within - pb.within;
  }
  return String(pa.within).localeCompare(String(pb.within), undefined, { numeric: true });
}

export function compareBedLabels(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  const pa = parseBedLabel(a);
  const pb = parseBedLabel(b);

  const ka = BED_KIND_ORDER[pa.kind] ?? 9;
  const kb = BED_KIND_ORDER[pb.kind] ?? 9;
  if (ka !== kb) return ka - kb;

  const groupCmp = compareGroup(pa, pb);
  if (groupCmp !== 0) return groupCmp;

  return compareWithin(pa, pb);
}

export function sortBedLabels(beds) {
  return [...beds].sort(compareBedLabels);
}

/** Section key + title for grouping beds in the ward board UI. */
export function bedSectionMeta(bed) {
  if (bed === null) {
    return { key: "__general__", title: "General", kind: "general", grid: false };
  }
  const p = parseBedLabel(bed);
  if (p.kind === "letter") {
    return { key: `bay-${p.group}`, title: `Bay ${p.group}`, kind: "bay", grid: true };
  }
  if (p.kind === "side") {
    const title = p.group === "SR" ? "Side rooms" : p.group;
    return { key: `side-${p.group}`, title, kind: "side", grid: true };
  }
  if (p.kind === "number") {
    return { key: `room-${p.group}`, title: `Bay ${p.group}`, kind: "room", grid: true };
  }
  if (p.kind === "plain") {
    return { key: "__plain__", title: "Beds", kind: "plain", grid: true };
  }
  return { key: `other-${bed}`, title: "Other", kind: "other", grid: false };
}

/** Preserve bed sort order while inserting section boundaries. */
export function groupBedsBySection(bedRows, { layout } = {}) {
  const order = layoutBedOrder(layout);
  const groups = [];
  const index = new Map();

  for (const row of sortBedRows(bedRows, order)) {
    const meta = bedSectionMeta(row.bed);
    let group = index.get(meta.key);
    if (!group) {
      group = { ...meta, beds: [] };
      index.set(meta.key, group);
      groups.push(group);
    }
    group.beds.push(row);
  }

  for (const group of groups) {
    group.beds = sortBedRows(group.beds, order);
  }

  return sortSectionGroups(groups, order);
}

function layoutBedOrder(layout) {
  if (!layout?.sections?.length) return null;
  const order = new Map();
  flattenLayout(layout).forEach(({ bed }, i) => {
    if (!order.has(bed)) order.set(bed, i);
  });
  return order;
}

function sortBedRows(rows, order) {
  return [...rows].sort((a, b) => {
    if (a.bed === null && b.bed !== null) return -1;
    if (a.bed !== null && b.bed === null) return 1;
    if (!order) return compareBedLabels(a.bed, b.bed);
    const ia = order.get(a.bed) ?? Number.MAX_SAFE_INTEGER;
    const ib = order.get(b.bed) ?? Number.MAX_SAFE_INTEGER;
    if (ia !== ib) return ia - ib;
    return compareBedLabels(a.bed, b.bed);
  });
}

function sortSectionGroups(groups, order) {
  return [...groups].sort((a, b) => {
    if (a.kind === "general") return -1;
    if (b.kind === "general") return 1;
    const minIndex = (g) => Math.min(...g.beds.map((r) => order?.get(r.bed) ?? Number.MAX_SAFE_INTEGER));
    const ia = minIndex(a);
    const ib = minIndex(b);
    if (order && ia !== ib) return ia - ib;
    return compareBedLabels(a.beds[0]?.bed, b.beds[0]?.bed);
  });
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

// Beds to offer for a ward: layout order first, then any ad-hoc MRU beds
// not in the layout appended at the end. MRU does not reorder chips.
// If the ward was saved with no beds, skip MRU so cleared layouts stay cleared.
export function bedsForWard(ward, wardLayouts, recentBeds) {
  const key = (ward || "").trim();
  if (!key) return [];
  const layout = wardLayouts[key];
  const layoutBeds = flattenLayout(layout).map((b) => b.bed);
  if (hasLayout(wardLayouts, key) && layoutBeds.length === 0) return [];

  const recent = recentBeds[key] || [];
  const merged = [...layoutBeds];
  for (const b of recent) if (!merged.includes(b)) merged.push(b);
  if (layout?.sections?.length) {
    const extras = merged.slice(layoutBeds.length);
    return [...layoutBeds, ...sortBedLabels(extras)];
  }
  return sortBedLabels(merged);
}

export function mostRecentBed(ward, recentBeds) {
  const key = (ward || "").trim();
  if (!key) return "";
  return recentBeds[key]?.[0] || "";
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
