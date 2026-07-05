import { PRIORITY, NO_WARD_LABEL } from "./constants";

export function nextId(existingJobs) {
  const max = existingJobs.reduce((m, j) => Math.max(m, j.id || 0), 0);
  return max + 1;
}

export function createJob({ id, text, ward, priority }) {
  return {
    id,
    text: text.trim(),
    ward: (ward || "").trim(),
    priority: priority === PRIORITY.URGENT ? PRIORITY.URGENT : PRIORITY.ROUTINE,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

// Open jobs first (urgent before routine, oldest first within a tier), done jobs last.
export function sortByUrgency(jobs) {
  return [...jobs].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.priority !== b.priority) return a.priority === PRIORITY.URGENT ? -1 : 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
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

export function summarize(jobs) {
  const open = jobs.filter((j) => !j.done);
  return {
    open: open.length,
    urgent: open.filter((j) => j.priority === PRIORITY.URGENT).length,
    done: jobs.length - open.length,
  };
}
