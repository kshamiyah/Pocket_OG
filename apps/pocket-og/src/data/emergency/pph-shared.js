/** Shared PPH level thresholds — keep in sync with GTG52 / pph.js content. */
export const PPH_LEVEL_ORDER = ["minor", "major", "massive"];

export const PPH_THRESHOLDS = {
  major: 1000,
  massive: 2000,
  /** Uncontrolled major bleeding — force theatre when uterotonic ladder exhausted */
  theatreForce: 1500,
};

export function pphLevelVal(level) {
  return PPH_LEVEL_ORDER.indexOf(level);
}

export function getPphLevel(ml) {
  if (ml >= PPH_THRESHOLDS.massive) return "massive";
  if (ml >= PPH_THRESHOLDS.major) return "major";
  return "minor";
}
