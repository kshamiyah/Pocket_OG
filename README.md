# ClinRef

Clinical guideline retrieval tool for RBH Maternity.

## Adding a new guideline

1. Create `src/data/GLXXX.js` using the section schema in existing data files
2. Add the guideline metadata to `src/data/guidelines.js`
3. Import and merge the sections in `App.jsx` (see WIKI array)
4. Add relevant synonyms to `src/search/synonyms.js`
5. `git add . && git commit -m "added GLXXX" && git push`

Vercel autodeploys on push. No other steps needed.

## Guidelines currently included

| Code | Title | Version | Review Date |
|------|-------|---------|-------------|
| GL952 | Hypertension in Pregnancy | V6.3 | December 2026 |
| GL787 | Obstetric Antibiotics | V6.0 | July 2026 |

## Tech stack

Vite · React · Tailwind CSS · Vercel

## Important

Content is derived verbatim from RBH trust guidelines. This tool is for reference only and is not a substitute for clinical judgement. Always escalate to a senior when uncertain.
