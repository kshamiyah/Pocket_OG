import { WARD_LAYOUT_KIND } from "./constants";
import { pushMRU } from "./portfolios";

export function hasWardLayout(wardLayouts, ward) {
  const key = (ward || "").trim();
  return Boolean(key && wardLayouts[key]);
}

export function numberedBeds(from, to) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  const cap = 40;
  const span = end - start + 1;
  if (span < 1 || span > cap) return null;
  return Array.from({ length: span }, (_, i) => String(start + i));
}

export function parseNamedBeds(raw) {
  return [...new Set(
    raw
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  )];
}

export function bedsForWard(ward, wardLayouts, recentBeds = {}) {
  const key = (ward || "").trim();
  const layout = wardLayouts[key];
  if (!layout || layout.kind === WARD_LAYOUT_KIND.NONE) return { kind: WARD_LAYOUT_KIND.NONE, beds: [] };

  const configured = layout.beds || [];
  const recent = recentBeds[key] || [];
  const merged = [...recent];
  for (const bed of configured) {
    if (!merged.includes(bed)) merged.push(bed);
  }
  return { kind: layout.kind, beds: merged };
}

export function wardNeedsBed(ward, wardLayouts) {
  const key = (ward || "").trim();
  const layout = wardLayouts[key];
  return layout?.kind !== WARD_LAYOUT_KIND.NONE;
}

export function recordBedUsage(recentBeds, ward, bed) {
  const wardKey = (ward || "").trim();
  const bedKey = String(bed || "").trim();
  if (!wardKey || !bedKey) return recentBeds;
  return {
    ...recentBeds,
    [wardKey]: pushMRU(recentBeds[wardKey] || [], bedKey, 8),
  };
}

export function saveWardLayout(wardLayouts, ward, layout) {
  const key = (ward || "").trim();
  if (!key) return wardLayouts;
  return { ...wardLayouts, [key]: layout };
}
