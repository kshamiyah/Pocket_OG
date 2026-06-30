# Pocket O&G

Clinical reference app for RBH Maternity — full-text search, in-app guideline readers, interactive decision flowcharts, a drug formulary, consent risk modules, and clinical calculators. Built with React + Vite + Tailwind CSS, deployed on Vercel.

## Guidelines included

29 guidelines from RBH, NICE, RCOG, BASHH, NHSCSP and MBRRACE. **Reader** = full searchable in-app text; **Flowchart** = interactive decision pathway.

| Code | Title | Source | Version · Date | Reader | Flowchart |
|------|-------|--------|----------------|:------:|:---------:|
| BASHH_PID | Pelvic Inflammatory Disease | BASHH | 2019 · 2018 (updated 2019) | ✓ | ✓ |
| MBRRACE_SLMC2025 | MBRRACE 2025 | MBRRACE | 2021–23 data · September 2025 | ✓ |  |
| NHSCSP20 | Cervical Screening & Colposcopy | NHSCSP | 2020 (updated 2025) | ✓ | ✓ |
| QS22 | Antenatal Care | NICE | February 2023 | ✓ | ✓ |
| NG73 | Endometriosis | NICE | September 2017 (updated 2024) | ✓ | ✓ |
| NG229 | Fetal Monitoring in Labour (CTG) | NICE | December 2022 (updated 2026) | ✓ | ✓ |
| NG88 | Heavy Menstrual Bleeding | NICE | September 2023 | ✓ | ✓ |
| NG133 | Hypertension in Pregnancy | NICE | June 2019 (updated 2023) | ✓ |  |
| QS46 | Multiple Pregnancy (Twins & Triplets) | NICE | September 2019 | ✓ | ✓ |
| CG192 | Perinatal Mental Health | NICE | December 2014 (updated 2020) | ✓ |  |
| NG25 | Preterm Labour & Birth | NICE | November 2015 (updated 2022) | ✓ |  |
| GL983 | Diabetes in Pregnancy | RBH | V4 · February 2025 | ✓ | ✓ |
| CG623 | Ectopic Pregnancy — Medical Management | RBH | V5 · June 2025 | ✓ | ✓ |
| CG565 | First Trimester Miscarriage | RBH | V6 · September 2024 | ✓ | ✓ |
| GL952 | Hypertension in Pregnancy | RBH | V6.3 · March 2026 | ✓ | ✓ |
| GL861 | Induction of Labour & Term PLRoM | RBH | V6.10 · May 2026 | ✓ | ✓ |
| GL880 | Intrahepatic Cholestasis of Pregnancy | RBH | V6 · March 2024 | ✓ | ✓ |
| GL783 | Iron Deficiency Anaemia | RBH | V5 · January 2024 | ✓ |  |
| CG621 | Medical Management of Miscarriage | RBH | V6 · May 2024 | ✓ | ✓ |
| GL787 | Obstetric Antibiotics | RBH | V6.0 · July 2024 | ✓ |  |
| GL895 | PPRoM | RBH | V7 · November 2023 | ✓ |  |
| GL891 | VTE in Pregnancy & Postnatal | RBH | V7 · October 2024 | ✓ |  |
| GTG63 | Antepartum Haemorrhage | RCOG | November 2011 | ✓ | ✓ |
| GTG67 | Endometrial Hyperplasia | RCOG | February 2016 | ✓ | ✓ |
| GTG69 | Nausea & Vomiting of Pregnancy | RCOG | June 2016 | ✓ |  |
| GTG52 | Postpartum Haemorrhage | RCOG | December 2016 | ✓ | ✓ |
| GTG17 | Recurrent Miscarriage | RCOG | April 2011 | ✓ |  |
| GTG57 | Reduced Fetal Movements | RCOG | February 2026 | ✓ | ✓ |
| GTG31 | Small for Gestational Age Fetus (SGA) | RCOG | February 2013 | ✓ | ✓ |

## Features

- **Search** — full-text across all guideline sections with synonym expansion and word-boundary scoring
- **Guidelines** — browse/filter by source (RBH · NICE · RCOG · …) with in-app readers and source PDFs
- **Flowcharts** — interactive decision pathways with per-guideline colour theming, including an interactive **CTG classifier** (NG229) that grades each feature and routes into the action pathway
- **Rx** — obstetric & gynaecology drug formulary
- **Consent** — procedure risk modules (verbatim RCOG/NICE frequencies)
- **Calculator** — β-hCG/PUL, ectopic surveillance, VTE risk, PUQE
- Installable PWA with offline caching; system font stack for a native feel on iOS/macOS

## Adding a new guideline

1. Extract text from the PDF: `pdftotext GLXXX.pdf -`
2. Create `src/data/GLXXX.js` — model the section schema on any existing data file
3. Add metadata to `src/data/guidelines.js`
4. Import and spread sections into `SEARCH_INDEX` in `src/search/engine.js`
5. Add a filter pill entry in `FILTER_OPTIONS` in `src/App.jsx`
6. Place the source PDF in `public/guidelines/GLXXX.pdf`
7. Add relevant synonyms to `src/search/synonyms.js` if needed
8. `git add . && git commit -m "add GLXXX" && git push`

Vercel autodeploys on push to `main`.

## Adding a flowchart

1. Create `src/data/GLXXX_FLOWCHART.js` — each node has `id`, `type` (action/decision/alert/end), `text`, and `options` (for decision nodes)
2. Export and register it in `src/data/flowcharts.js`
3. Add `flowchartId: "GLXXX_..."` to the relevant section object in `src/data/GLXXX.js`

## Tech stack

Vite · React 19 · Tailwind CSS · Vercel

## Important

Content is derived verbatim from RBH trust guidelines. This tool is for reference only and is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
