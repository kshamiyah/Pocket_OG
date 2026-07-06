# Pocket O&G: working notes

Guidance for anyone (human or AI) making changes in this repo.

## Writing style

- **Never use em dashes (—) in content or in replies.** They read as AI-written.
  Use a comma, colon, semicolon, or parentheses instead. En dashes in genuine
  numeric ranges (e.g. "24–28 weeks") are fine.
- **British English** throughout (haemorrhage, paediatric, anaesthetic, fetal).
- Keep clinical copy crisp and verifiable. Exact thresholds and doses live in the
  linked guideline; the app text points at them rather than restating everything.

## What this is

An offline-first PWA reference for O&G trainees. Monorepo (npm workspaces):

- `apps/pocket-og`: the app (React + Vite + Tailwind + vite-plugin-pwa).
- `apps/ward-manager`: a separate tool; occasionally a source of logic to port.
- `apps/handover`: standalone shift job-list PWA (QR/link handover); not linked from pocket-og.
- `packages/guidelines`: shared guideline content (`@pocket-og/guidelines`); handover does not use this package.

**Content ethos:** hand-authored, drawn verbatim from national guidance
(NICE / RCOG / BASHH / local). No runtime LLM. Every clinical claim must be
traceable to a cited source.

## Clinical safety & sourcing

This is a medical reference used by trainees, so accuracy is load-bearing.

- **Cite every clinical claim.** Each guide, flowchart, calculator and pearl
  names the guideline it comes from. If you cannot point to a source, do not
  state it as fact.
- **Never invent thresholds or doses.** Pull exact numbers from the cited
  guidance. Where the app must show a number that is a common default rather
  than a fixed national figure, mark it plainly (e.g. "verify against local
  protocol").
- **Frame outputs as decision aids, not instructions.** Calculators and
  flowcharts carry the "decision aid only, clinical responsibility remains with
  the treating clinician" framing. Keep it.
- **Prefer principles over restating everything.** State the teaching point and
  link to the guide for the full detail, rather than copying long passages.

## Commands (run from `apps/pocket-og`)

- Lint: `../../node_modules/.bin/eslint src/…`
- Build: `../../node_modules/.bin/vite build`
- Preview for manual/Playwright checks: `../../node_modules/.bin/vite preview --port 4173`
- Unit tests (where present): `../../node_modules/.bin/vitest run`
- Playwright uses the pre-installed Chromium at `/opt/pw-browsers/chromium`.

Verify non-trivial changes by driving the real UI (Playwright over `vite preview`),
not just by building.

## Tailwind

- Only ever use **literal, complete class strings**. Never build a class by
  interpolation (e.g. `` `hover:${x}` ``); the purge step drops classes it can't
  see spelled out. Theme classes in `src/data/glColors.js` are safe because they
  appear there in full.
- Style for both light and dark where the design isn't deliberately single-mode.

## Flowchart engine

Nodes are `action` | `decision` | `alert` | `end` | `classifier`, with a `startId`
and a `nodes` map (`next` for linear steps, `options` for decisions). See
`src/components/FlowchartPlayer.jsx` and any `src/data/*_FLOWCHART.js`.

## Navigation & deep links

- In-app navigation goes through `handleNavigate({ type, id })` in `App.jsx`.
  Types: `reader` (guideline code), `flowchart` (fc id), `calculator` (scenario
  id), `consent`, `drug`, `iol-prioritizer`.
- Shareable deep links use query params (`?g=` `?fc=` `?calc=` `?consent=`),
  handled in `src/utils/deepLink.js`.
- A guideline only opens in the reader if its code is in
  `src/data/readerAvailable.js`. Check before linking to a guide.

## Adding content: registries to update

Adding a flowchart or guideline usually touches several files. Miss one and the
link silently dead-ends, so check all of:
`src/data/flowcharts.js`, `src/data/connections.js`, `App.jsx`
(FLOWCHART_LINKS, FLOWCHART_GROUPS, FILTER_OPTIONS, handleNavigate),
`src/search/engine.js`, `src/search/synonyms.js`,
`src/components/GuidelineReader.jsx` (SECTIONS_MAP),
`src/data/readerAvailable.js`, and `packages/guidelines/src/*`.

## Search

Search is a local BM25 ranker over a bundled index (`src/search/engine.js`),
so new content is only findable once it is indexed.

- Guideline sections come from the wiki content automatically.
- Calculators, drugs (Rx) and consent pages are added as synthetic entries in
  `src/search/extraIndex.js` (`EXTRA_SEARCH_SECTIONS`, keyed by `kind`:
  `calc` / `drug` / `consent`). New ones must be added there to show up, and
  they feed the Meds / Calcs / Consent result filters.
- Add plausible search terms and abbreviations to `src/search/synonyms.js`
  (`SYNONYMS`) so users find content by the words they actually type. Keys are
  lower-case; watch for duplicate keys (eslint `no-dupe-keys`).

## Versioning & What's New

- The single source of truth for the version is `apps/pocket-og/package.json`.
  Keep the top entry of `src/data/updates.js` in step with it; `LATEST_VERSION`
  is derived from there and drives the hero chip, the About build stamp and the
  What's New modal.
- When shipping a user-facing change, add an entry to `updates.js` (tag it
  `new` / `improved` / `fixed`) and bump the version. Same-version additions to
  the current release are fine while a version is still in progress.

## Design & UI conventions

- **Source colours:** every guideline body has a colour derived from its issuer
  (RBH, NICE, RCOG, BASHH, ...) via `src/data/glColors.js`. Use `glColors(gl)`
  or `sourceColors(source)` for accents, badges and buttons rather than
  hard-coding colours, so a body's colour stays consistent everywhere.
- **Icons are inline SVG.** There is no icon library. Copy an existing inline
  SVG and adjust it.
- **Font** is Geist (loaded locally). Match the existing type scale and weights.
- **localStorage keys** follow `pocketog_<thing>_v1`. Bump the `_v` suffix if a
  stored shape changes incompatibly.
- Full-screen overlays (reader, flowchart player, prioritizer, pearl modal) use
  `fixed inset-0 z-50` with their own close control; follow that pattern.

## PWA gotcha

`registerType: 'autoUpdate'` means a deployed change often needs the app closed
and reopened **twice** before it shows. Mention this when reporting a UI change.

## Handover app (`apps/handover`)

Separate PWA, own Vercel project, not navigable from pocket-og.

- **localStorage:** `handover_portfolios_v2` (profiles, jobs, ward layouts, learned tasks).
- **QR payload:** `src/utils/payload.js` (v2; beds on wire, task text stripped via `stripHandover.js`).
- **Lint/build** from app dir: `npm run lint` / `npm run build` in `apps/handover`, or `-w apps/handover` from repo root.
- **Deploy:** root `apps/handover`, install `cd ../.. && npm install`; see `apps/handover/vercel.json`.

## Git

- Commit messages: do not mention the model or internal identifiers.
- After committing, re-set the author so the commit is attributed consistently:
  `git commit --amend --no-edit --reset-author`.
- Never create a PR unless explicitly asked.
