// Wording follows the classification rule in @pocket-og/guidelines (combineFeatureGrades):
// NG229 1.4.32 scores 4 features (contractions, baseline, variability, decelerations);
// pathological = 1 red feature, or 2 or more amber features.
export const CTG_DESC = {
  normal: "All 4 features white (reassuring). Continue CTG and hourly review.",
  suspicious: "1 amber feature. Full risk assessment and conservative measures; reassess (30 min locally).",
  pathological: "1 red feature, or 2 or more amber features. Urgent obstetric and senior midwife review.",
};

export function ctgSummary(e) {
  const vari = {
    "5-25": "Var normal",
    "<5": `Var under 5 (${e.variabilityMinutes > 50 ? "over 50m" : e.variabilityMinutes >= 30 ? "30 to 50m" : "under 30m"})`,
    ">25": `Var over 25 (${e.variabilityMinutes > 10 ? "over 10m" : "up to 10m"})`,
    sinusoidal: "Sinusoidal",
  }[e.variability] ?? e.variability;
  const dec = {
    none: "No decels", early: "Early decels", variable: "Variable decels",
    "variable-concerning": `Concerning ${e.decelerationsRepetitive === false ? "non-repetitive" : "repetitive"} variables (${e.decelerationMinutes > 30 ? "over 30m" : "30m or less"})`,
    late: "Late decels", prolonged: "Prolonged decel",
  }[e.decelerations] ?? e.decelerations;
  const cx = e.contractionsPerTen != null ? `${e.contractionsPerTen} in 10${e.hypertonus ? ", hypertonus" : ""}` : e.hypertonus ? "Hypertonus" : null;
  return [e.baselineUndetermined ? "Baseline undetermined" : `HR ${e.baselineHR}`, vari, dec,
    e.accelerations === true ? "Accels present" : e.accelerations === false ? "No accels" : null, cx,
    e.clinicianOverride ? `clinician judged pathological (features: ${e.autoClassification})` : null].filter(Boolean).join(" · ");
}
