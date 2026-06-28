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

/** Minimum wait between uterotonic ladder steps at catastrophic bleed rates (seconds). */
export const UTEROTONIC_DELAY_FLOOR_SEC = 60;

/** Standard pharm wait after each uterotonic before escalation is considered. */
export const UTEROTONIC_PHARM_DELAY_SEC = {
  oxytocin_bolus: 180,
  oxytocin_inf: 300,
  ergometrine: 300,
  carboprost: 900,
  misoprostol: 600,
};

export const CARBO_REPEAT_BASE_SEC = 15 * 60;
export const CARBO_REPEAT_FLOOR_SEC = 5 * 60;

/**
 * Scale a clinical wait by current bleed rate (ml/min).
 * Settled/slow bleeding keeps the full interval; brisk loss shortens it.
 */
export function scaleDelayByBleedRate(baseSec, rateMlMin, floorSec = UTEROTONIC_DELAY_FLOOR_SEC) {
  if (baseSec <= 0) return baseSec;
  if (rateMlMin < 1) return baseSec;
  if (rateMlMin < 10) return Math.max(floorSec, Math.round(baseSec * 0.75));
  if (rateMlMin < 50) return Math.max(floorSec, Math.round(baseSec * 0.5));
  return floorSec;
}

export function effectiveUterotonicDelaySec(uterotonicId, rateMlMin) {
  const base = UTEROTONIC_PHARM_DELAY_SEC[uterotonicId] ?? 180;
  return scaleDelayByBleedRate(base, rateMlMin);
}

export function effectiveCarboRepeatDelaySec(rateMlMin) {
  return scaleDelayByBleedRate(CARBO_REPEAT_BASE_SEC, rateMlMin, CARBO_REPEAT_FLOOR_SEC);
}
