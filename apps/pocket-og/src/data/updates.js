// In-app changelog — newest release first. Edit this when you ship something.
// Each change has a `tag`: "new" | "improved" | "fixed".
// Keep the top `version` in step with package.json so the About build stamp,
// the hero chip and this list all show the same number.
export const UPDATES = [
  {
    version: "1.6.0",
    date: "05/07/2026",
    title: "Six more topic cards",
    changes: [
      { tag: "new", text: "Topic cards added for postpartum haemorrhage, induction of labour, ectopic pregnancy, hyperemesis gravidarum, PPROM & preterm labour, and heavy menstrual bleeding. Search any of these (e.g. \"PPH\", \"IOL\", \"HMB\") to see guides, pathways, drugs, calculators, evidence and don't-miss items in one place." },
    ],
  },
  {
    version: "1.5.0",
    date: "05/07/2026",
    title: "Topic cards in search",
    changes: [
      { tag: "new", text: "Topic cards: searching a big topic now shows a curated card above the results with everything the app holds on it in one place, organised as guides, pathways, drugs, evidence and don't-miss items. First topic: pre-eclampsia. Try searching \"PET\"." },
    ],
  },
  {
    version: "1.4.0",
    date: "04/07/2026",
    title: "Landmark Trials in the Library",
    changes: [
      { tag: "new", text: "Landmark Trials: a new section under Library, Articles, collecting the guideline-changing studies behind O&G practice. Each card gives the clinical question, design, key result and what it changed, with a link to the paper and to the guideline it underpins." },
      { tag: "new", text: "Ten trials to start: ARRIVE, Magpie, the Term Breech Trial, antenatal corticosteroids, magnesium for neuroprotection, ASPRE, WOMAN, ORACLE I & II, ECLIPSE and PRISM. Find them via the Trials filter in Library or in search." },
    ],
  },
  {
    version: "1.3.0",
    date: "04/07/2026",
    title: "Pearl of the Day, sharing & a rebuilt IOL prioritiser",
    changes: [
      { tag: "new", text: "Pearl of the Day: a daily teaching point on the home screen that links straight to the flowchart and the full guideline it comes from. It changes every day, and you can dismiss it or tap through." },
      { tag: "improved", text: "The IOL Priority List is rebuilt on the NICE NG207 four-tier model: multiple indications per patient, hours since SROM, post-dates priority derived automatically from gestation, editable entries, and tier-grouped ordering with a one-tap reset to the recommended order." },
      { tag: "new", text: "Share buttons on guidelines, flowcharts, calculators and consent pages, so you can send a colleague straight to what you are reading." },
      { tag: "fixed", text: "Shared links now open the app directly to the shared content instead of the home screen." },
    ],
  },
  {
    version: "1.2.0",
    date: "03/07/2026",
    title: "New guides, triage flowcharts & app-wide search",
    changes: [
      { tag: "new", text: "Genital Herpes in Pregnancy, a new BASHH/RCOG 2024 guide with an interactive management flowchart: first episode by trimester, suppressive therapy, mode of delivery, PPROM and neonatal care." },
      { tag: "new", text: "Two new triage flowcharts: Rupture of Membranes (PROM/PPRoM), and Acute Heavy Menstrual Bleeding in ED." },
      { tag: "new", text: "Antivirals added to Rx, aciclovir, valaciclovir and famciclovir, each with dosing and BNF links." },
      { tag: "improved", text: "Search now covers the whole app, medications, calculators and consent pages appear in results, with new Meds, Calcs and Consent filters and smarter ranking." },
      { tag: "improved", text: "IOL Priority List moved to the Calculator tab." },
      { tag: "fixed", text: "Fixed several broken links between flowcharts, calculators and guidelines, and the Genital Herpes guide now opens correctly." },
      { tag: "new", text: "TOG Reviews, a Library section with in-depth summaries of RCOG's review journal, each with its own interactive flowchart: polyhydramnios & oligohydramnios, thyroid disease, cardiac disease (congenital, cardiomyopathy, myocardial infarction, arrhythmias, valvular disease)." },
      { tag: "improved", text: "PUL and post-ectopic hCG calculators now have a Quick entry mode, jump straight to the numbers when you already know the clinical picture." },
      { tag: "fixed", text: "The keyboard no longer pops open automatically when you launch the app." },
    ],
  },
  {
    version: "1.0.0",
    date: "01/07/2026",
    title: "First release",
    changes: [
      { tag: "new", text: "Pocket O&G is live, a fast, offline reference for O&G trainees." },
    ],
  },
];

export const LATEST_VERSION = UPDATES[0].version;
export const LATEST_TITLE = UPDATES[0].title;

const SEEN_KEY = "pocketog_updates_seen_v1";

export function hasUnseenUpdates() {
  try {
    return localStorage.getItem(SEEN_KEY) !== LATEST_VERSION;
  } catch {
    return false;
  }
}

export function markUpdatesSeen() {
  try {
    localStorage.setItem(SEEN_KEY, LATEST_VERSION);
  } catch { /* storage unavailable — ignore */ }
}
