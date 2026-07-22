/** Depth in ward drill stack (for forward/back direction). */
export function drillDepth(key) {
  if (key === "wards") return 0;
  if (key.startsWith("bed:")) return 2;
  return 1;
}

export function drillKey(selectedWard, bedSelected, selectedBed, noWardToken) {
  if (selectedWard === noWardToken) return "noward";
  if (selectedWard && bedSelected) return `bed:${selectedWard}:${selectedBed ?? ""}`;
  if (selectedWard) return `ward:${selectedWard}`;
  return "wards";
}

export function drillDirection(nextKey, prevKey) {
  return drillDepth(nextKey) >= drillDepth(prevKey) ? "forward" : "back";
}

export function enterMotionClass(direction) {
  if (direction === "back") return "animate-view-enter-back";
  if (direction === "up") return "animate-view-enter-up";
  if (direction === "fade") return "animate-fade-in";
  return "animate-view-enter-forward";
}

export function exitMotionClass(direction, exitingView) {
  if (exitingView === "wardSetup") return "animate-view-exit-down";
  if (direction === "back") return "animate-view-exit-back";
  if (direction === "up") return "animate-view-exit-down";
  return "animate-view-exit-forward";
}

export const MOTION_MS = 300;
export const REDUCE_MOTION = "motion-reduce:animate-none";
