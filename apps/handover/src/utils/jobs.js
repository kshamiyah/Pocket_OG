import { PRIORITY, NO_WARD_LABEL } from "./constants";
import { bedsForWard, compareBedLabels } from "./wardLayouts";

export const GENERAL_BED = null;

export function nextId(existingJobs) {
  const max = existingJobs.reduce((m, j) => Math.max(m, j.id || 0), 0);
  return max + 1;
}

export function createJob({ id, text, ward, bed, priority, remindAt }) {
  const job = {
    id,
    text: text.trim(),
    ward: (ward || "").trim(),
    bed: (bed || "").trim(),
    priority: priority === PRIORITY.URGENT ? PRIORITY.URGENT : PRIORITY.ROUTINE,
    done: false,
    createdAt: new Date().toISOString(),
  };
  if (remindAt) job.remindAt = remindAt;
  return job;
}

// Open jobs first (urgent before routine, oldest first within a tier), done jobs last.
export function sortByUrgency(jobs) {
  return [...jobs].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.priority !== b.priority) return a.priority === PRIORITY.URGENT ? -1 : 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

/** Completed jobs, newest first (by created time; no completedAt yet). */
export function sortCompleted(jobs) {
  return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function splitOpenDone(jobs) {
  const open = [];
  const done = [];
  for (const job of jobs) {
    if (job.done) done.push(job);
    else open.push(job);
  }
  return { open: sortByUrgency(open), done: sortCompleted(done) };
}

// Jobs grouped into ward sections (alphabetical, unlabelled jobs last), each
// section internally sorted by urgency.
export function groupByWard(jobs) {
  const groups = new Map();
  for (const job of jobs) {
    const key = job.ward || NO_WARD_LABEL;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(job);
  }
  const entries = [...groups.entries()].map(([ward, list]) => [ward, sortByUrgency(list)]);
  entries.sort((a, b) => {
    if (a[0] === NO_WARD_LABEL) return 1;
    if (b[0] === NO_WARD_LABEL) return -1;
    return a[0].localeCompare(b[0]);
  });
  return entries;
}

function counts(list) {
  return {
    open: list.filter((j) => !j.done).length,
    urgent: list.filter((j) => !j.done && j.priority === PRIORITY.URGENT).length,
  };
}

// Full ward -> bed -> jobs tree for the Rounds/Overview navigation. Known
// wards and beds (from layouts or prior use) are included even with zero
// jobs, so an empty one is still somewhere to navigate into and add to.
// Bed-less jobs for a ward land in a "General" bucket (GENERAL_BED); wardless
// jobs land in the top-level "noWard" bucket.
export function buildHierarchy(jobs, { wardNames = [], wardLayouts = {}, recentBeds = {} } = {}) {
  const byWard = new Map();
  const ensureWard = (ward) => {
    if (!byWard.has(ward)) byWard.set(ward, new Map());
    return byWard.get(ward);
  };
  for (const ward of wardNames) {
    const bedMap = ensureWard(ward);
    for (const bed of bedsForWard(ward, wardLayouts, recentBeds)) {
      if (!bedMap.has(bed)) bedMap.set(bed, []);
    }
  }

  const noWardJobs = [];
  for (const job of jobs) {
    if (!job.ward) { noWardJobs.push(job); continue; }
    const bedMap = ensureWard(job.ward);
    const bedKey = job.bed || GENERAL_BED;
    if (!bedMap.has(bedKey)) bedMap.set(bedKey, []);
    bedMap.get(bedKey).push(job);
  }

  const wards = [...byWard.entries()].map(([ward, bedMap]) => {
    if (!bedMap.has(GENERAL_BED)) bedMap.set(GENERAL_BED, []);
    const beds = [...bedMap.entries()]
      .map(([bed, list]) => ({ bed, jobs: sortByUrgency(list), ...counts(list) }))
      .sort((a, b) => {
        if (a.bed === GENERAL_BED) return -1;
        if (b.bed === GENERAL_BED) return 1;
        return compareBedLabels(a.bed, b.bed);
      });
    const allJobs = beds.flatMap((b) => b.jobs);
    return { ward, beds, ...counts(allJobs) };
  }).sort((a, b) => a.ward.localeCompare(b.ward));

  return { wards, noWard: { jobs: sortByUrgency(noWardJobs), ...counts(noWardJobs) } };
}

export function summarize(jobs) {
  const open = jobs.filter((j) => !j.done);
  return {
    open: open.length,
    urgent: open.filter((j) => j.priority === PRIORITY.URGENT).length,
    done: jobs.length - open.length,
  };
}

export function shiftSummary(jobs) {
  const wards = [...new Set(jobs.map((j) => j.ward).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const { open, urgent, done } = summarize(jobs);
  return { total: jobs.length, wards, wardCount: wards.length, open, urgent, done };
}
