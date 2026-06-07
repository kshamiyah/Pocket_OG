# Pocket O&G

Clinical guideline reference app for RBH Maternity. Built with React + Vite + Tailwind CSS, deployed on Vercel.

## Guidelines included

| Code | Title | Version | Date | Flowcharts |
|------|-------|---------|------|----------|
| GL952 | Hypertension in Pregnancy | V6.3 | March 2026 | Triage, Acute, Severe/LW, Postnatal |
| GL787 | Obstetric Antibiotics | V6.0 | July 2024 | — |
| CG565 | First Trimester Miscarriage | V6 | September 2024 | Triage |
| CG621 | Medical Management of Miscarriage | V6 | May 2024 | Outpatient, Inpatient |
| CG623 | Ectopic Pregnancy — Medical Management | V5 | June 2025 | MTX pathway |
| GL895 | Preterm Pre-Labour Rupture of Membranes (PPRoM) | V7 | November 2023 | — |
| GL861 | Induction of Labour & Term PLRoM | V6.10 | May 2026 | IOL pathway |
| GL783 | Iron Deficiency Anaemia | V5 | January 2024 | — |
| GL880 | Intrahepatic Cholestasis of Pregnancy | V6 | March 2024 | Delivery timing |
| GL891 | VTE in Pregnancy & Postnatal | V7 | October 2024 | Antenatal risk, Postnatal risk |
| GL983 | Diabetes in Pregnancy | V4 | February 2025 | DKA pathway |
| QS46 | Multiple Pregnancy (Twins & Triplets) — NICE | QS46 | September 2019 | Care pathway, Tertiary FMC referral |
| QS22 | Antenatal Care — NICE | QS22 | February 2023 | Appointment schedule |
| GTG57 | Reduced Fetal Movements — RCOG | GTG57 | February 2026 | Care pathway, Gestation triage, Recurrent RFM |

## Features

- Full-text search across all guideline sections with synonym expansion and word-boundary scoring
- Guideline picker to browse and filter by topic
- Interactive decision flowcharts with per-guideline colour theming
- System font stack (SF Pro / Helvetica Neue) for a native feel on iOS/macOS

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
4. Add colour theming to `FC_GL_COLOR` in `src/App.jsx` (badge, icon, accent, solid, solidHover)

## Tech stack

Vite · React 19 · Tailwind CSS · Vercel

## Important

Content is derived verbatim from RBH trust guidelines. This tool is for reference only and is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
