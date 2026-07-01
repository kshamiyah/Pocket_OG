// Shared CTG categorisation logic (NICE NG229 §1.4.16–1.4.31).
// Single source of truth for both apps:
//   • apps/ward-manager  — classifyCTGEntry() drives the labour-ward alert engine
//   • apps/pocket-og     — the CTG Classifier tool uses combineFeatureGrades()
//
// Feature grades use the trace-light convention:
//   "white"  = reassuring
//   "amber"  = non-reassuring
//   "red"    = abnormal
//
// ⚠ The baseline upper band (>160 treated as abnormal) and the increased-
//   variability timing (>10 min) below are the operational thresholds carried
//   over from the original engine; they are flagged for verbatim verification
//   against the NG229 PDF in the pocket-og reader. Keep this file, the reader
//   (NG229.js) and the flowchart (NG229_FLOWCHART.js) in lockstep when updating.

// Overall categorisation rule: combine the three individual feature grades.
export function combineFeatureGrades(grades) {
  const reds = grades.filter(g => g === "red").length;
  const ambers = grades.filter(g => g === "amber").length;
  if (reds >= 1 || ambers >= 2) return "pathological";
  if (ambers === 1) return "suspicious";
  return "normal";
}

// Numeric/structured entry → overall category (used by the ward-manager engine).
export function classifyCTGEntry(entry, prevBaselineHR = null) {
  const features = [];

  // Baseline HR
  const hr   = entry.baselineHR ?? 140;
  const rise = prevBaselineHR != null ? hr - prevBaselineHR : 0;
  if (hr < 100 || hr > 160)        features.push("red");
  // ≥20 bpm rise is a local clinical threshold; NICE NG229 §1.4 scores absolute range only
  else if (hr < 110 || rise >= 20) features.push("amber");
  else                              features.push("white");

  // Variability
  const v    = entry.variability ?? "5-25";
  const vMin = entry.variabilityMinutes ?? 0;
  if (v === "sinusoidal")     features.push("red");
  else if (v === "<5")        features.push(vMin > 50 ? "red" : vMin >= 30 ? "amber" : "white");
  else if (v === ">25")       features.push(vMin > 10 ? "red" : "amber");
  else                        features.push("white");

  // Decelerations
  const d    = entry.decelerations ?? "none";
  const dMin = entry.decelerationMinutes ?? 0;
  if (d === "none" || d === "early" || d === "variable") features.push("white");
  else if (d === "variable-concerning") features.push(dMin >= 30 ? "red" : "amber");
  else if (d === "late" || d === "prolonged") features.push("red");
  else features.push("white");

  return combineFeatureGrades(features);
}
