// Wording follows the classification rule in @pocket-og/guidelines (combineFeatureGrades):
// pathological = 1 abnormal feature, or 2 or more non-reassuring features.
export const CTG_DESC = {
  normal: "All features reassuring. Continue monitoring.",
  suspicious: "1 non-reassuring feature. Conservative measures, reassess in 30 min.",
  pathological: "1 abnormal feature, or 2 or more non-reassuring features. Immediate senior review, consider FBS.",
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
    "variable-concerning": `Concerning variable (${e.decelerationMinutes >= 30 ? "30m+" : "under 30m"})`,
    late: "Late decels", prolonged: "Prolonged decel",
  }[e.decelerations] ?? e.decelerations;
  return [`HR ${e.baselineHR}`, vari, dec, e.accelerations ? "Accels present" : "No accels"].join(" · ");
}
