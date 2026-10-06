# Pocket O&G: handover

> **Update 5 Oct 2026:** the induction of labour goal is complete. Read `GOAL.md`
> for what was built (five NG207 workflows, the national timing chart `IOL_TIMING`)
> and the shelf (`apps/pocket-og/src/data/shelf.js`), which hides local guides
> topic by topic once their national replacement is finished. Sections 4, 5 and 7
> below predate that work.

Last updated 4 October 2026. Written for an agent picking up the national-guidance
migration. Read this with `CLAUDE.md`, which holds the permanent house rules.

---

## 1. What we are trying to do

Pocket O&G is an offline-first PWA clinical reference for O&G trainees. The app was
originally built around Royal Berkshire (RBH) local guidelines. The programme in
progress converts it to **national guidance as the spine, with local content as an
optional overlay**.

The governing rule, in Dr Shamiyah's words:

> "I want us to ignore the local guidance as if they don't exist. we need to develop
> a dataset that ONLY relies on national guidance. anything local is extra."

A second rule governs conflicts:

> "we don't choose what people use to follow. we present all the guidelines in a nice
> way and outline the difference."

Local guidance is therefore **demoted, not deleted**. A local guideline stays in the
app, relabelled "(local)", and keeps the operational detail national guidance leaves
out (trust logistics, antibiotic regimens set to local resistance patterns).

### Non-negotiable working rules

- **One topic at a time, finished end to end.** Do not start the next topic with the
  current one half-wired. The user has asked for this repeatedly.
- **Every clinical claim traces to a cited source.** Never invent a threshold or a
  dose. If you cannot cite it, do not state it.
- **Verify against the source PDF**, not against what the app already says. The app
  has been wrong before (see section 6).
- **No em dashes** in content or in replies. British English throughout.
- **Commit messages must not mention the model or internal identifiers.** After
  committing, run `git commit --amend --no-edit --reset-author`.
- **Never create a PR unless explicitly asked.** Never push without being asked.

---

## 2. Architecture you must know

Monorepo, npm workspaces. `apps/pocket-og` is the app, `packages/guidelines` is the
shared content package (`@pocket-og/guidelines`).

### Content model

Guide sections are `{ id, gl, condition, setting, title, tags, flowchartId?, content: [] }`.
Block types: `text`, `alert`, `subheading`, `list`, `table`, `compare`.

Flowchart nodes are `action | decision | alert | end | classifier`, with `startId` and
a `nodes` map. `next` for linear steps, `options` for decisions.

### Registries: miss one and the link silently dead-ends

Adding a **guide** touches five places:
1. `packages/guidelines/src/guidelines.js` (the GUIDELINES entry)
2. `packages/guidelines/src/index.js` (export)
3. `apps/pocket-og/src/components/GuidelineReader.jsx` (import + `SECTIONS_MAP`)
4. `apps/pocket-og/src/search/engine.js` (import + spread)
5. `apps/pocket-og/src/data/readerAvailable.js`

Adding a **flowchart** touches: `src/data/flowcharts.js` (import + `FLOWCHARTS`),
`App.jsx` (`FLOWCHART_LINKS`, `FLOWCHART_GROUPS`), the `flowchartId` on the guide
section, and `src/data/connections.js`.

`FILTER_OPTIONS` needs no change: it derives from `e.page.flowchartId` and
`GUIDELINES[gl].source`.

### Gotchas that have cost real time

- **Links only render in `text`, `alert` and `list` blocks.** `ContentBlock` renders
  those through `rt()` (RichText, draws links) but table headers and cells through
  `hi()` (highlight only). A phrase that occurs only inside a table can never become
  a link. Two NG133 links were built, passed every data check, and rendered nowhere.
- **The phrase matcher uses plain `includes` with no word boundaries.** A bare
  "eclampsia" attaches to the first "pre-eclampsia" on the page.
- **`whatsNext` renders only on end nodes.** It silently does nothing elsewhere.
- **Dark mode is a centralised remap** in `index.css` under `html.dark`, not Tailwind
  `dark:` variants (there are zero in src). It covers `bg-*-50/100/200`,
  `border-*-100/200`, `text-*-600..900`, greys and white. It does **not** cover
  `bg-*-500`, `zinc` or `stone`. A colour outside the covered set stays light.
- **`glColors(gl)` resolves via `GUIDELINES[gl].source`**, not by guideline code.
- **Search UI uses `searchV2` from `rankV2.js`**, not `engine.search`.
- **PWA `registerType: 'autoUpdate'`** means a change often needs the app closed and
  reopened twice. Before any local visual check, unregister the service worker and
  clear caches, or you will be looking at a stale bundle.
- **Source PDFs live in BOTH** `packages/guidelines/src/` and
  `apps/pocket-og/public/guidelines/`, referenced by `pdfPath`. Remote ones use
  `pdfUrl` instead.
- **NICE blocks WebFetch (403)** on guidance pages and PDF resources. Establish
  currency from the local PDF front matter plus search snippets.

### Versioning

`apps/pocket-og/package.json` is the source of truth. The top entry of
`src/data/updates.js` must match it. Add a What's New entry for user-facing changes.

---

## 3. What has been done

Current version **1.27.0**. `main` is level with `origin/main` at `f27c9e0`.

### Topics migrated to national guidance

| Topic | National source | Local guideline, now an overlay |
|---|---|---|
| Early pregnancy, ectopic, miscarriage | NICE NG126 | CG565, CG621 |
| Hypertension in pregnancy | NICE NG133 | GL952 |
| Induction of labour and term PLROM | NICE NG207 | GL861 |

Each has a full guide written from the source PDF, workflows, and the local pathway
kept and relabelled "(local)".

- **NG126**: 8 sections, 6 flowcharts (48 nodes).
- **NG133**: fully rewritten from source, 9 sections, 114 recommendation numbers,
  6 flowcharts (42 nodes). The previous file attributed a great deal to NG133 that
  the guideline does not contain, all removed.
- **NG207**: 10 sections, 67 cited recommendation numbers, all verified present in
  the source, zero phantoms. No workflows yet.

### The "Guidance differs" component

`apps/pocket-og/src/components/CompareBlock.jsx` renders a divergence without ranking
it. Dataset is `packages/guidelines/src/divergences.js`. Design is locked, do not
restyle without asking.

Neutrality is enforced by the component, not by each entry: identical size and type
for every position, positions sorted newest first in the component, scope shown,
areas of agreement shown, status as a fact about the document rather than a quality
judgement, and local guidance in a separate block outside the national card.

Three entries exist: `antid-ectopic-under-12`, `antid-threatened-heavy-bleeding`,
`iol-first-method-bishop-6`.

Only genuine divergence belongs here. Do not add supersession (one document replacing
another is chronology) or equipoise (one body declining to rank options).

### Anti-D corrections

NG126 changed in June 2026. Pearls, GTG38 wording and the GTG22 flowchart were all
corrected. The GTG22 flowchart had been routing early miscarriage to "250 IU" against
current NG126.

---

## 4. The most recent change: READ THIS FIRST

The GL861 correction is **committed and pushed** as `b8f487a`, on `main`. Read it
with `git show b8f487a`. The three new source PDFs are committed alongside this
handover in the commit that follows it.

An earlier draft of this document described this work as uncommitted. It was, and a
cloud agent correctly refused to start because the files were unreachable from its
container. That is now resolved: everything described below is in git history.

### What the GL861 commit does

Two changes, both authorised by the user.

**1. A clinical correction.** GL861's IOL timing table gave obstetric cholestasis with
bile acids >100 as "37+0 to 39+6". That was wrong against RCOG GTG43 (June 2022) and
also against **GL880, the trust's own cholestasis guideline**, which already matches
GTG43. For the group GL880 itself puts at 3.5% stillbirth risk, that row sent people
one to four weeks late.

Corrected to GTG43's three bands in all three places it appeared (timing table,
indications list, and the `GL861_TIMING` flowchart node):

- peak bile acids 19 to 39 (mild): planned birth by 40+0
- peak bile acids 40 to 99 (moderate): planned birth at 38+0 to 39+0
- peak bile acids 100 or more (severe): planned birth at 35+0 to 36+0

An alert notes this follows GTG43 and matches GL880, and carries GL880's own
instruction to arrange induction imminently if already past 35 to 36 weeks. The
priority column was deliberately left at 2: GTG43 says nothing about trust booking
priorities and inventing one would breach the sourcing rule.

**2. Removal of rows with no national source**, on the user's explicit instruction
(they chose this knowing the content disappears from the app):

- Maternal age 40 to 44 at 40+0, and 45 or over at 38+0
- Full therapeutic anticoagulation at 39+0

Removed from the timing table, from the flowchart's indication menu, and their three
flowchart nodes deleted. A knock-on fix: the "Declining IOL" subheading read "by 42
weeks, or 40 weeks if age >=40", referencing the age policy that no longer exists.

The removal was scoped to the timing rows only. GL861 still holds other local-only
material (Rushey MLU, bleep numbers, delivery suite logistics, CRB-first ordering)
which was left deliberately. The CRB-first ordering in particular **must not be
deleted**: the `iol-first-method-bishop-6` divergence card depends on it.

### Verification already run on this edit

Graph walk: `GL861_IOL_FLOWCHART` 23/23 nodes reachable, `GL861_TIMING_FLOWCHART`
14/14 reachable, no orphans, no dangling targets. Timing table 13 rows. No dangling
references to deleted node ids anywhere in `apps/pocket-og/src`. Lint clean, 20 tests
pass, build succeeds. Browser-checked: all three cholestasis bands render with the
correct gestations, and the maternal age and anticoagulation rows are absent from the
rendered table.

---

## 5. What is left to do

### Immediate next step: register the three new PDFs

All three are on disk in `packages/guidelines/src/` but **not registered** in
`guidelines.js`, and not yet copied to `apps/pocket-og/public/guidelines/`.

| Code | File | Status |
|---|---|---|
| NICE NG3, diabetes in pregnancy | `diabetes-in-pregnancy-...-51038446021.pdf` | Published 25 Feb 2015, last updated 16 Dec 2020 |
| RCOG GTG43, intrahepatic cholestasis | `BJOG - 2022 - Girling - ...pdf` | June 2022 |
| RCOG GTG37b, acute VTE management | `gtg-37b-1.pdf` | April 2015 |

Note `gtg-37a.pdf` is already in `public/guidelines/` but that is thromboprophylaxis,
a different guideline.

### Then: the national IOL timing chart

This replaces `GL861_TIMING`. It is **not** a single-guideline chart. GL861's timing
table is a local aggregation of 14 decisions each owned by a different national
guideline. Twelve now have national owners:

| Row | National owner | Verified? |
|---|---|---|
| Post-dates | NG207 1.2.4 (offer from 41+0; GL861's "40+7" is the same gestation) | yes |
| Reduced fetal movements | GTG57 | in app, timing not re-read |
| Pre-existing diabetes, 37+0 to 38+6 | NG3 1.4.2 | yes, exact match |
| GDM, no later than 40+6 | NG3 1.4.4 | yes |
| GDM with complications | NG3 1.4.5 (consider before 40+6) | yes; GL861's "37 to 40" is a local refinement |
| Hypertension and pre-eclampsia | NG133 | in app |
| Non-proteinuric hypertension | NG133 | in app |
| Raised PCR with symptoms | NG133 | in app |
| Cholestasis, three bands | GTG43 | yes |
| IUGR / SGA | GTG31 | in app |
| APH | GTG63 | in app |

**Two rows have no national source and were deleted:** maternal age, and
anticoagulation timing. GTG37b gives no gestation for planned birth at all, it only
says stop LMWH 24 hours beforehand, so the "39+0" was a local operational choice.

### Then: NG207 workflows

NG207 has a guide but no flowcharts. Proposed set, agreed in principle but not built:

1. `NG207_METHOD`: Bishop score to method. Sweep from 39 weeks, 6 or less to
   dinoprostone or 25 microgram oral misoprostol, above 6 to amniotomy and oxytocin,
   mechanical where pharmacological is unsuitable (1.3.1 to 1.3.10). **Start here**,
   it is the highest-traffic path and sets the node vocabulary for the rest.
2. `NG207_PROM`: term and preterm, GBS branches, the 24-hour decision point
   (1.2.10 to 1.2.16).
3. `NG207_PROLONGED`: beyond 41 weeks, declining induction, monitoring from 42 weeks
   (1.2.1 to 1.2.9).
4. `NG207_CIRCUMSTANCES`: previous caesarean, breech, growth restriction, macrosomia,
   IUFD route (1.2.17 to 1.2.32).
5. `NG207_COMPLICATIONS`: hyperstimulation, unsuccessful induction, cord prolapse
   (1.7.1 to 1.7.6).

`GL861_IOL` is genuinely replaced by charts 1 and 2. Show each chart to the user for
review before wiring it up: that is the established rhythm.

### Remaining national-only roadmap

Topics still RBH-local, needing national replacement. PDFs for the first three are now
in the repo:

- **Diabetes**: NICE NG3 (have it) plus a DKA source (still needed). Replaces GL983.
- **Cholestasis**: RCOG GTG43 (have it). Replaces GL880, though GL880 already matches it.
- **VTE**: RCOG GTG37b (have it) plus GTG37a (already in public/). Replaces GL891.
- **PPROM before 24 weeks**: GTG73 plus a pre-24-week source. Still needed.
- **Iron deficiency**: BSH guideline. Still needed.

`GL787` obstetric antibiotics deliberately stays local: antibiotic choices are set to
local resistance patterns. Same reasoning applies to the PLROM antibiotic regimens,
which NG207 does not state at all.

### Parked

- **15 dead keyword links app-wide**: 11 phrases absent from the content, 4 occurring
  only inside tables (and tables cannot render links). Audit script at
  `scratchpad/link_audit.mjs`.
- Whether table cells should render links at all. Would fix the 4 above.
- `LATEST_VERSION` unused lint error in `App.jsx`, pre-existing on origin/main.
- Unverified hunch that `zinc` and `stone` badges do not remap in dark mode.
- Optionally adding NICE NG136 and DG49 / HealthTech 630.
- Merged branches deletable: `ng133-flowcharts`, `add-handover-app`,
  `cursor-layout-edits`, `ng207-induction`.

---

## 6. Verification discipline

This section exists because each item below is a real error that shipped or nearly
shipped in this project.

**Verify against parsed content, not raw file text.** Four false findings came from
truncated or failed greps: a claim NG133 had no magnesium content (grep capped at 24
lines), a claim no national file had eclampsia content (grep silently returned
nothing), a claim of 10 problems in the NG133 rewrite (the checker matched the
author's own header comment listing the deletions), and a claim the Flow tab listed
one chart (the regex matched a different guideline's title). In every case the fix was
a Node script importing the module and walking the parsed objects.

**A checker that can pass on zero must fail on zero.** An NG133 flowchartId
cross-check reported "problems: 0" while 0 of 9 sections actually had a flowchartId.
Make an empty result set an explicit failure.

**Your own corrective text will trip your own checker.** A check for the old
cholestasis figure fired on the note explaining the correction. Read the hit before
believing it. (In that instance the right fix was still to remove the figure, so a
skim-reader never meets the wrong number.)

**Audit citations against the source.** For NG207, all 67 cited recommendation numbers
were checked to exist in the extracted PDF text. NG133 is why: its previous version
cited recommendations that do not exist.

**Walk the graph after editing a flowchart.** Deleting decision branches orphans
nodes. Check every `next` and every `options[].next` resolves, and that every node is
reachable from `startId`.

**Clear the service worker before any visual check**, or you will verify a stale
bundle and believe a change failed.

Reusable scripts from this session are in the session scratchpad: `check_ng207.mjs`,
`check_topics.mjs`, `check_gl861.mjs`. They are not in the repo. Rewrite as needed.

---

## 7. Suggested first actions

1. Read `CLAUDE.md`.
2. `git show b8f487a` to see the GL861 cholestasis correction, already verified and
   pushed. Nothing to do here beyond understanding it, since the national timing
   chart builds on it.
3. The version has **not** been bumped for that correction and `updates.js` has no
   entry for it. Current version is 1.27.0. Add a What's New entry and bump when you
   ship the next user-facing change, or do it as its own small commit first.
4. Register NG3, GTG43 and GTG37b: add to `guidelines.js`, copy each PDF from
   `packages/guidelines/src/` into `apps/pocket-og/public/guidelines/`, set `pdfPath`.
5. Ask the user whether to build the national timing chart next or the NG207
   workflows. Both are ready to start, and they prefer to choose.
