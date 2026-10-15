// Shared CTG categorisation logic (NICE NG229 1.4.16–1.4.31).
// Single source of truth for both apps:
//   • apps/ward-manager  — classifyCTGEntry() drives the labour-ward alert engine
//   • apps/pocket-og     — the CTG Classifier tool uses combineFeatureGrades()
//
// Feature grades use the trace-light convention:
//   "white"  = reassuring
//   "amber"  = non-reassuring
//   "red"    = abnormal
//
// Bands follow the NG229 feature table (see NG229.js): baseline 161–180 is
// non-reassuring and above 180 abnormal; variability over 25 bpm is
// non-reassuring for 15–25 min and abnormal beyond 25 min. The ≥20 bpm rising-
// baseline prompt is a LOCAL threshold, not an NG229 number. Keep this file,
// the reader (NG229.js) and the flowchart (NG229_FLOWCHART.js) in lockstep.

// Overall categorisation rule (NG229 1.4.32): combine the individual feature grades.
export function combineFeatureGrades(grades) {
  const reds = grades.filter(g => g === "red").length;
  const ambers = grades.filter(g => g === "amber").length;
  if (reds >= 1 || ambers >= 2) return "pathological";
  if (ambers === 1) return "suspicious";
  return "normal";
}

// Numeric/structured entry → overall category (used by the ward-manager engine).
// Scores all 4 NG229 features: baseline, variability, decelerations, contractions.
export function classifyCTGEntry(entry, prevBaselineHR = null) {
  const features = [];

  // Baseline HR
  const hr   = entry.baselineHR ?? 140;
  const rise = prevBaselineHR != null ? hr - prevBaselineHR : 0;
  if (hr < 100 || hr > 180)        features.push("red");
  // ≥20 bpm rise is a local clinical threshold; NICE NG229 1.4 scores absolute range only
  else if (hr < 110 || hr > 160 || rise >= 20) features.push("amber");
  else                              features.push("white");

  // Variability
  const v    = entry.variability ?? "5-25";
  const vMin = entry.variabilityMinutes ?? 0;
  if (v === "sinusoidal")     features.push("red");
  else if (v === "<5")        features.push(vMin > 50 ? "red" : vMin >= 30 ? "amber" : "white");
  else if (v === ">25")       features.push(vMin > 25 ? "red" : vMin >= 15 ? "amber" : "white");
  else                        features.push("white");

  // Decelerations
  const d    = entry.decelerations ?? "none";
  const dMin = entry.decelerationMinutes ?? 0;
  if (d === "none" || d === "early" || d === "variable") features.push("white");
  else if (d === "variable-concerning") features.push(dMin >= 30 ? "red" : "amber");
  else if (d === "late" || d === "prolonged") features.push("red");
  else features.push("white");

  // Contractions (NG229 1.4.12): 5 or more in 10 minutes, or hypertonus, is amber.
  // An unrecorded count scores white here; the CTG sheet asks for it.
  const cx = entry.contractionsPerTen;
  if ((typeof cx === "number" && cx >= 5) || entry.hypertonus) features.push("amber");
  else features.push("white");

  return combineFeatureGrades(features);
}
