# Pocket O&G

Clinical guideline reference app for RBH Maternity. Built with React + Vite + Tailwind CSS, deployed on Vercel.

## Guidelines included

| Code | Title | Version | Date |
|------|-------|---------|------|
| GL952 | Hypertension in Pregnancy (PET / PIH) | V6.3 | March 2026 |
| GL787 | Obstetric Antibiotics | V6.0 | July 2024 |
| CG565 | First Trimester Miscarriage | V6 | September 2024 |
| CG621 | Medical Management of Miscarriage | V6 | May 2024 |
| CG623 | Ectopic Pregnancy — Medical Management | V5 | June 2025 |
| GL895 | Preterm Pre-Labour Rupture of Membranes (PPRoM) | V7 | November 2023 |
| GL861 | Induction of Labour & Term PLRoM | V6.10 | May 2026 |

## Features

- Full-text search across all guideline sections with fuzzy matching and synonym expansion
- Filter by guideline or topic
- Interactive decision flowcharts for key clinical pathways
- Works offline (PWA-ready static build)

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
