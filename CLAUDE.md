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
- `packages/guidelines`: shared guideline content (`@pocket-og/guidelines`).

**Content ethos:** hand-authored, drawn verbatim from national guidance
(NICE / RCOG / BASHH / local). No runtime LLM. Every clinical claim must be
traceable to a cited source.

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

## PWA gotcha

`registerType: 'autoUpdate'` means a deployed change often needs the app closed
and reopened **twice** before it shows. Mention this when reporting a UI change.

## Git

- Commit messages: do not mention the model or internal identifiers.
- After committing, re-set the author so the commit is attributed consistently:
  `git commit --amend --no-edit --reset-author`.
- Never create a PR unless explicitly asked.
