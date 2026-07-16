import { GUIDELINES } from "@pocket-og/guidelines";

// Human-readable name for each source key used in the clinician registry.
const SOURCE_NAMES = {
  NICE: "NICE",
  RCOG: "RCOG",
  RBH: "local NHS guideline",
  NHSCSP: "NHS screening",
  BASHH: "BASHH",
  ESC: "European Society of Cardiology",
  REVIEW: "peer-reviewed guidance",
};

// Short trust label for one clinician guideline code, resolved from the shared
// registry so it stays in step with the clinician app.
export function sourceLabel(code) {
  const g = GUIDELINES[code];
  if (!g) return code;
  const name = SOURCE_NAMES[g.source] ?? g.source;
  return g.source === "REVIEW" ? name : `${name} ${g.code}`;
}

// Full provenance line for the footer, with version and date.
export function sourceLine(code) {
  const g = GUIDELINES[code];
  if (!g) return code;
  const name = SOURCE_NAMES[g.source] ?? g.source;
  return `${name}${g.source !== "REVIEW" ? ` ${g.code}` : ""} · ${g.label} · ${g.version} · ${g.date}`;
}
