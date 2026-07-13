# Handover testing loop (`apps/handover/test-corpus`)

Automated UI/layout + flow + payload regression harness for the handover PWA.
It drives the real built app in Chromium across a matrix of scenarios,
viewports, network states and themes, runs structural checks, diffs against
saved baselines, and produces a triaged `REPORT.md`. **It never auto-fixes
anything** — it reports.

## What it checks

- **Layout** — per screenshot, in-page bounding-box checks flag horizontal
  viewport overflow, overlapping interactive controls (hit-tested, so an open
  modal doesn't flag the screen behind it), and unintended text clipping
  (single-line ellipsis truncation is treated as intentional).
- **Flow** — navigation walks assert onboarding, the shift/skip branches, and
  take-over reach the right screens.
- **Persistence** — after add-job, dark-mode toggle and a ward-layout edit, the
  page is fully reloaded (simulating a PWA relaunch) and state is asserted to
  survive, with jobs still mapped to the right beds.
- **Offline-first** — a subset runs with the network cut after the service
  worker warms, to confirm the app still renders from cache.
- **Console / network** — any page error, `console.error`, or unexpected failed
  request during a flow is an automatic flag.
- **Payload integrity (highest priority)** — `payload.check.mjs` runs in
  isolation against `src/utils/payload.js`: encode→decode round-trip, no
  local-only fields on the wire, tamper detection, link round-trip. See the
  finding about `stripHandover.js` / "keep a copy" in `REPORT.md`.
- **Visual (vision pass)** — new or flagged screenshots are eyeballed; notes
  live in `visual-notes.md` and are folded into the report.

## Layout

```
run.mjs            orchestrator (server, matrix, walks, report)
payload.check.mjs  isolated payload-integrity check
lib/fixtures.mjs   seed data (storage shapes mirror src/utils/*)
lib/checks.mjs     in-page structural checks + console/network capture
lib/report.mjs     baseline diffing, NEW/STILL BROKEN/FIXED, markdown report
baselines/         the corpus: one PNG per flow+state (committed)
cases.json         corpus memory: last-known status per bug signature (committed)
visual-notes.md    vision-pass findings (committed)
REPORT.md          latest report (committed) — the deliverable
runs/ results/     transient per-run output (gitignored)
```

## Run it

```bash
cd apps/handover
../../node_modules/.bin/vite build       # the harness serves the built app
cd test-corpus
npm install                              # first time only (playwright-core, pixelmatch, pngjs)
node run.mjs            # full matrix: 375, 414, 1280 px + dark/offline subsets
node run.mjs --fast     # phone widths only (375, 414)
node payload.check.mjs  # just the payload check
```

The first run establishes baselines (everything is a "new baseline", no diff
noise). Subsequent runs classify each finding as **NEW**, **STILL BROKEN** or
**FIXED** against `cases.json` and the saved baselines. A clean pass is
`NEW: 0 / STILL BROKEN: 0`.

## Re-run as a loop

```bash
claude -p "run the handover test suite in apps/handover/test-corpus and report NEW/STILL BROKEN/FIXED"
```

or wire `node run.mjs` into a pre-push hook scoped to `apps/handover`.

## Notes / caveats

- Uses the pre-installed Chromium at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` via `playwright-core`.
- The preview server runs on port **4178** (`vite preview --strictPort`).
- Rebuild the app (`vite build`) before re-running after any app change — the
  harness serves `dist/`, not the dev server, so the service-worker offline
  test is meaningful.
- To reset the corpus from scratch: `rm -rf baselines runs cases.json results`.
- **Do not auto-fix** anything touching `payload.js` — a bug there could leak
  identifiable clinical text. Those are flagged for human review only.
