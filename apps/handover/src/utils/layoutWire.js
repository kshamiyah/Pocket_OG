// Helpers for ward layouts on the handover wire and at import time.

import {
  flattenLayout,
  hasLayout,
  nextSectionId,
  saveLayout,
} from "./wardLayouts.js";

/** Strip local section ids for the wire; regenerate on import. */
export function compactLayoutForWire(layout) {
  if (!layout?.sections?.length) return null;
  return {
    sections: layout.sections.map((section) => {
      const copy = { ...section };
      delete copy.id;
      return copy;
    }),
  };
}

/** Restore a layout received on the wire. */
export function expandLayoutFromWire(wireLayout) {
  if (!wireLayout?.sections?.length) return { sections: [] };
  return {
    sections: wireLayout.sections.map((section) => ({
      ...section,
      id: nextSectionId(),
    })),
  };
}

/** Layouts for configured wards referenced by the jobs being sent. */
export function layoutsForJobWards(wardLayouts, jobs) {
  const wards = [...new Set(jobs.map((j) => (j.ward || "").trim()).filter(Boolean))];
  const out = {};
  for (const ward of wards) {
    if (!hasLayout(wardLayouts, ward)) continue;
    const compact = compactLayoutForWire(wardLayouts[ward]);
    if (compact) out[ward] = compact;
  }
  return out;
}

export function defaultLayoutImportPrefs(incomingLayouts, localLayouts) {
  const prefs = {};
  for (const ward of Object.keys(incomingLayouts || {})) {
    const exists = hasLayout(localLayouts, ward);
    prefs[ward] = {
      import: !exists,
      conflict: exists ? null : "theirs",
    };
  }
  return prefs;
}

export function bedsInLayoutSet(layout) {
  return new Set(flattenLayout(layout).map((b) => b.bed));
}

/** Jobs on `ward` whose bed is not in the receiver layout (exact string match). */
export function bedMismatchesForWard(jobs, ward, localLayout, bedRemaps = {}) {
  const beds = bedsInLayoutSet(localLayout);
  return jobs.filter((j) => {
    if (j.ward !== ward || !j.bed) return false;
    const key = bedRemapKey(ward, j.bed);
    if (bedRemaps[key]) return false;
    return !beds.has(j.bed);
  });
}

export function bedRemapKey(ward, bed) {
  return `${ward}|${bed}`;
}

export function applyBedRemaps(jobs, bedRemaps) {
  if (!bedRemaps || Object.keys(bedRemaps).length === 0) return jobs;
  return jobs.map((j) => {
    if (!j.ward || !j.bed) return j;
    const mapped = bedRemaps[bedRemapKey(j.ward, j.bed)];
    return mapped ? { ...j, bed: mapped } : j;
  });
}

/** Build the layout patch to apply at merge time from review choices. */
export function buildLayoutImportPlan(prefs, incomingLayouts, localLayouts) {
  const plan = {};
  for (const [ward, incoming] of Object.entries(incomingLayouts || {})) {
    const pref = prefs[ward];
    if (!pref?.import) {
      plan[ward] = { mode: "skip" };
      continue;
    }
    const expanded = expandLayoutFromWire(incoming);
    const exists = hasLayout(localLayouts, ward);
    if (!exists || pref.conflict === "theirs") {
      plan[ward] = { mode: exists ? "replace" : "add", layout: expanded };
    } else {
      plan[ward] = { mode: "skip" };
    }
  }
  return plan;
}

export function applyLayoutImportPlan(localLayouts, plan) {
  let next = { ...localLayouts };
  for (const [ward, spec] of Object.entries(plan || {})) {
    if (spec.mode === "skip" || !spec.layout) continue;
    next = saveLayout(next, ward, spec.layout);
  }
  return next;
}
