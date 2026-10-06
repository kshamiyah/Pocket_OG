// The shelf: local guidance that is hidden from the app but kept in the repo.
//
// Pocket O&G is built on national guidance. When a topic has a complete
// national replacement, its local guideline is shelved here rather than
// deleted. Everything that belongs to it (guide text, flowcharts, PDF,
// divergence card) stays in the repo untouched; this list only stops it
// surfacing anywhere in the app.
//
// To put something back, delete its line. Nothing else needs to change.
//
// Every surface filters through this file: the Library, the Flow tab, search,
// topic cards, chart hand-offs and inline links, keyword links, pearls,
// "related guideline" links on articles and trials, divergence cards, and deep
// links. src/data/shelf.test.js fails if a shelved item can still be reached.

export const SHELVED_GUIDES = new Set([
  "GL861", // Induction of labour & term PLRoM (RBH). National: NG207, IOL_TIMING. Shelved 5 Oct 2026.
  "CG565", // First trimester miscarriage (RBH). National: NG126. Shelved 6 Oct 2026.
  "CG621", // Medical management of miscarriage (RBH). National: NG126. Shelved 6 Oct 2026.
  "CG623", // Ectopic pregnancy: medical management (RBH). National: NG126, GTG21. Shelved 6 Oct 2026.
]);

export const SHELVED_FLOWCHARTS = new Set([
  "GL861_IOL",    // replaced by NG207_METHOD and NG207_PROM
  "GL861_TIMING", // replaced by IOL_TIMING
  "CG565_TRIAGE",     // replaced by NG126_MISCARRIAGE
  "CG621_OUTPATIENT", // replaced by NG126_MISCARRIAGE
  "CG621_INPATIENT",  // replaced by NG126_MISCARRIAGE
  "CG623_MTX",        // replaced by NG126_ECTOPIC
]);

export const SHELVED_DIVERGENCES = new Set([
  "iol-first-method-bishop-6", // NG207 vs GL861; nothing to compare once GL861 is shelved
]);

// A link (whatsNext, inlineLinks, topic entry, keyword link, ...) is shelved
// if it opens a shelved guide or chart, or belongs to a shelved guide.
export function isShelvedLink(link) {
  if (!link) return false;
  if (link.gl && SHELVED_GUIDES.has(link.gl)) return true;
  if (link.type === "reader" && SHELVED_GUIDES.has(link.id)) return true;
  if (link.type === "flowchart" && SHELVED_FLOWCHARTS.has(link.id)) return true;
  return false;
}

export const isShelvedGuide = code => SHELVED_GUIDES.has(code);
export const isShelvedFlowchart = id => SHELVED_FLOWCHARTS.has(id);
export const isShelvedDivergence = id => SHELVED_DIVERGENCES.has(id);
