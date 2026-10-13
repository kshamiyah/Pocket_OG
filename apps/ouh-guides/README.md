# OUH Guides

Oxford University Hospitals (OUH) local O&G guidelines as interactive pathways.

Pocket O&G (`apps/pocket-og`) is national-only. Local trust guidance lives in
small separate apps like this one, built from Pocket O&G's own components and
content formats so that a local app can be merged into Pocket O&G later.

## Content

| Guide | Version | Charts |
|---|---|---|
| GS32 Growth Scan Guideline | v3.2, August 2026 | Allocation (Figure 1, Table 3); growth scan findings (Tables 4 to 6); liquor volume (Figure 2); late FGR timing of birth (Figures 3 and 4, Table 7) |
| GS69 Multiple Pregnancy and Birth Guideline | v3.1, December 2025 (review date 24 August 2026 passed) | Scan pathway and referral |

- Charts: `src/data/OUH_GS32_FLOWCHARTS.js`, `src/data/OUH_GS69_FLOWCHARTS.js`, in Pocket O&G's flowchart format.
- Registry: `src/data/guides.js`. Codes carry the source prefix (`OUH-GS32`) so Pocket O&G's `glColors()` gives them the OUH colour.
- Citations: every decision and end node has `sources` (label and page image). Page images are rendered from the PDFs into `public/sources/gs32/` and `public/sources/gs69/` (PDF page numbers, two digits).
- Where the guideline is ambiguous (e.g. two Figure 3 boxes that could both apply), the chart shows the boxes as the figure does and the clinician chooses.

## Shared with Pocket O&G

The app imports from `../pocket-og/src`: `FlowchartPlayer`, `TabPageHeader`, `glColors`, `index.css` (fonts, dark mode) and the text-size setting. `tailwind.config.js` scans Pocket O&G's sources so its classes are kept. A change to those components changes both apps.

## Commands (from `apps/ouh-guides`)

- Tests: `../../node_modules/.bin/vitest run` (graph checks and one scenario per rule)
- Lint: `../../node_modules/.bin/eslint src`
- Build: `../../node_modules/.bin/vite build`
- Preview: `../../node_modules/.bin/vite preview --port 4174`

## Deploy (Vercel)

New Vercel project, root directory `apps/ouh-guides`. `vercel.json` installs from the repo root (`cd ../.. && npm install`) and builds to `dist`.

## Merging into Pocket O&G

1. Move the chart files to `apps/pocket-og/src/data/` and add each chart to `FLOWCHARTS` (`src/data/flowcharts.js`).
2. Add `FLOWCHART_LINKS` and a `FLOWCHART_GROUPS` entry per guide code in `App.jsx`, and an "OUH" source filter.
3. Add `"OUH"` to `SOURCE_ORDER` in `src/data/glColors.js` (the colours and label already exist).
4. Copy `public/sources/` to `apps/pocket-og/public/sources/` and add `/^\/sources\//` to `navigateFallbackDenylist` and `jpg` to `globPatterns` in its `vite.config.js`.
5. Add search synonyms and index entries if the charts should appear in search; add a What's New entry.
6. Copy `src/data/flowcharts.test.js` into Pocket O&G's tests.
