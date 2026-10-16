// Shared CTG categorisation logic (NICE NG229 1.4.12 to 1.4.32, 1.4.37).
// Single source of truth for both apps:
//   • apps/ward-manager  — classifyCTGEntry() drives the labour-ward alert engine
//   • apps/pocket-og     — the CTG Classifier tool uses combineFeatureGrades()
//
// Feature grades use the trace-light convention:
//   "white"  = reassuring
//   "amber"  = non-reassuring
//   "red"    = abnormal
//
// Bands follow the current NG229 feature tables (checked against nice.org.uk,
// 16 Oct 2026):
//   Baseline (1.4.15)    white 110 to 160; amber 100 to 109, a rise of 20 bpm or
//                        more from the start of labour or since the last review,
//                        or unable to determine; red below 100 or above 160.
//                        In the active second stage a 20 bpm rise is red (1.4.37).
//   Variability (1.4.18) white 5 to 25; amber under 5 for 30 to 50 min, or over
//                        25 for up to 10 min; red under 5 for over 50 min, over
//                        25 for over 10 min, or sinusoidal.
//   Decelerations (1.4.24) white none, early, or variable without concerning
//                        characteristics; amber repetitive concerning variables
//                        for under 30 min, or non-repetitive concerning variables
//                        for over 30 min; red repetitive concerning variables for
//                        over 30 min, late, acute bradycardia or a single
//                        prolonged deceleration of 3 min or more.
//   Contractions (1.4.12) amber at 5 or more in 10 min, or hypertonus.
// The table does not grade non-repetitive concerning variables present for
// 30 min or less; they are not white (white excludes concerning features), so
// this file scores them amber. That is an app choice. Keep this file, the
// reader (NG229.js) and the Pocket O&G picker in lockstep.

// Overall categorisation rule (NG229 1.4.32): combine the individual feature grades.
export function combineFeatureGrades(grades) {
  const reds = grades.filter(g => g === "red").length;
  const ambers = grades.filter(g => g === "amber").length;
  if (reds >= 1 || ambers >= 2) return "pathological";
  if (ambers === 1) return "suspicious";
  return "normal";
}

// Numeric/structured entry → overall category (used by the ward-manager engine).
// prevBaselineHR: baseline at the last review. opts.startBaselineHR: baseline
// at the start of labour. opts.activeSecondStage: a 20 bpm rise scores red.
export function gradeCTGFeatures(entry, prevBaselineHR = null, opts = {}) {
  const g = {};

  // Baseline (NG229 1.4.15, 1.4.37)
  const hr = entry.baselineHR ?? 140;
  const rises = [prevBaselineHR, opts.startBaselineHR].filter(x => x != null).map(x => hr - x);
  const risen = rises.some(r => r >= 20);
  if (entry.baselineUndetermined) g.baseline = "amber";
  else if (hr < 100 || hr > 160) g.baseline = "red";
  else if (risen && opts.activeSecondStage) g.baseline = "red";
  else if (hr < 110 || risen) g.baseline = "amber";
  else g.baseline = "white";

  // Variability (NG229 1.4.18)
  const v = entry.variability ?? "5-25";
  const vMin = entry.variabilityMinutes ?? 0;
  if (v === "sinusoidal") g.variability = "red";
  else if (v === "<5") g.variability = vMin > 50 ? "red" : vMin >= 30 ? "amber" : "white";
  else if (v === ">25") g.variability = vMin > 10 ? "red" : "amber";
  else g.variability = "white";

  // Decelerations (NG229 1.4.24)
  const d = entry.decelerations ?? "none";
  const dMin = entry.decelerationMinutes ?? 0;
  if (d === "variable-concerning") {
    // Older entries have no repetitive flag: treat as repetitive (the safer reading).
    const repetitive = entry.decelerationsRepetitive !== false;
    g.decelerations = repetitive ? (dMin > 30 ? "red" : "amber") : "amber";
  } else if (d === "late" || d === "prolonged") g.decelerations = "red";
  else g.decelerations = "white";

  // Contractions (NG229 1.4.12): 5 or more in 10 minutes, or hypertonus, is amber.
  // An unrecorded count scores white here; the CTG sheet asks for it.
  const cx = entry.contractionsPerTen;
  g.contractions = (typeof cx === "number" && cx >= 5) || entry.hypertonus ? "amber" : "white";

  return g;
}

export function classifyCTGEntry(entry, prevBaselineHR = null, opts = {}) {
  return combineFeatureGrades(Object.values(gradeCTGFeatures(entry, prevBaselineHR, opts)));
}
