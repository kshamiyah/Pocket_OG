// Curated topic pages, surfaced as a card above search results when the query
// matches one of the topic's terms. A topic page states no clinical facts of
// its own: every row is a link into existing, cited content (guides,
// flowcharts, drugs, trials), so there is nothing here to clinically verify
// beyond the labels.
//
// Shape:
//   terms    — normalised queries that trigger the card (lower-case)
//   gl       — owning guideline code, drives the accent colour via glColors
//   sections — groups of link rows. Entry types:
//     reader (id = gl code, optional sectionId to scroll to)
//     flowchart / calculator / drug / consent (id = navId)
//     trial (id = trials.js page id, opens Library > Articles > Trials)

export const TOPICS = {
  "pre-eclampsia": {
    id: "pre-eclampsia",
    title: "Pre-eclampsia",
    subtitle: "Hypertensive disorders of pregnancy",
    gl: "GL952",
    terms: [
      "pet", "pe", "pih", "pre-eclampsia", "preeclampsia", "pre eclampsia",
      "eclampsia", "severe pet", "severe pre-eclampsia", "severe preeclampsia",
      "hypertension in pregnancy", "pregnancy induced hypertension",
      "pregnancy-induced hypertension", "gestational hypertension",
      "hypertensive disorders of pregnancy",
    ],
    sections: [
      {
        heading: "Guides",
        entries: [
          { type: "reader", id: "GL952", gl: "GL952", label: "Hypertensive disorders (local guideline)", sublabel: "GL952: definitions, thresholds, management" },
          { type: "reader", id: "GL952", sectionId: "pet-severe-lw", gl: "GL952", label: "Severe PET on labour ward", sublabel: "GL952: severe disease section" },
          { type: "reader", id: "GL952", sectionId: "pet-medications", gl: "GL952", label: "Antihypertensive choices & doses", sublabel: "GL952: medications section" },
          { type: "reader", id: "NG133", gl: "NG133", label: "Hypertension in pregnancy (NICE)", sublabel: "NG133: full guideline" },
        ],
      },
      {
        heading: "Pathways",
        entries: [
          { type: "flowchart", id: "GL952_TRIAGE", gl: "GL952", label: "Triage: raised BP in pregnancy", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_ACUTE", gl: "GL952", label: "Acute BP management", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_SEVERE_LW", gl: "GL952", label: "Severe PET on labour ward", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_POSTNATAL", gl: "GL952", label: "Postnatal hypertension", sublabel: "GL952 flowchart" },
          { type: "flowchart", id: "GL952_POSTNATAL_WARD", gl: "GL952", label: "Postnatal ward round", sublabel: "GL952 flowchart" },
        ],
      },
      {
        heading: "Drugs",
        entries: [
          { type: "drug", id: "labetalol", gl: "GL952", label: "Labetalol", sublabel: "Rx: doses & routes" },
          { type: "drug", id: "nifedipine", gl: "GL952", label: "Nifedipine", sublabel: "Rx: doses & routes" },
          { type: "drug", id: "magnesium_sulphate", gl: "GL952", label: "Magnesium sulphate", sublabel: "Rx: seizure prophylaxis & treatment" },
        ],
      },
      {
        heading: "Evidence",
        entries: [
          { type: "trial", id: "trial-magpie", gl: "GL952", label: "Magpie", sublabel: "MgSO4 to prevent eclampsia" },
          { type: "trial", id: "trial-aspre", gl: "GL952", label: "ASPRE", sublabel: "Aspirin to prevent preterm pre-eclampsia" },
        ],
      },
      {
        heading: "Don't miss",
        entries: [
          { type: "reader", id: "NG133", sectionId: "ng133-prevention", gl: "NG133", label: "Aspirin prophylaxis & risk stratification", sublabel: "NG133: prevention section" },
          { type: "reader", id: "GL952", sectionId: "pet-postnatal-community", gl: "GL952", label: "Postnatal follow-up after discharge", sublabel: "GL952: community section" },
        ],
      },
    ],
  },
};

const normalise = (q) =>
  (q ?? "")
    .toLowerCase()
    .replace(/[?!.,;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Exact match of the normalised query against a topic's terms. Deliberately
// strict for now: the card should feel curated, not fuzzy.
export function topicForQuery(query) {
  const q = normalise(query);
  if (!q) return null;
  return Object.values(TOPICS).find(t => t.terms.includes(q)) ?? null;
}
