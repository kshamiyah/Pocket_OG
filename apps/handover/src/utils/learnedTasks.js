import { STARTER_PHRASES } from "./constants";
import { pushMRU } from "./portfolios";

export function tasksForWard(wardTasks, recentPhrases, ward) {
  const wardKey = (ward || "").trim();
  const local = wardKey ? (wardTasks[wardKey] || []) : [];
  const global = recentPhrases || [];
  const merged = [...local];
  for (const task of global) {
    if (!merged.some((t) => t.toLowerCase() === task.toLowerCase())) merged.push(task);
  }
  if (merged.length === 0) return STARTER_PHRASES;
  return merged.slice(0, 10);
}

export function recordTaskUsage({ wardTasks, recentPhrases, ward, task }) {
  const trimmed = task.trim();
  if (!trimmed) return { wardTasks, recentPhrases };

  const nextPhrases = pushMRU(recentPhrases, trimmed, 12);
  const wardKey = (ward || "").trim();
  if (!wardKey) return { wardTasks, recentPhrases: nextPhrases };

  const nextWardTasks = {
    ...wardTasks,
    [wardKey]: pushMRU(wardTasks[wardKey] || [], trimmed, 8),
  };
  return { wardTasks: nextWardTasks, recentPhrases: nextPhrases };
}
