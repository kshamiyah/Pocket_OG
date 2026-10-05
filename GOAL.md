# Goal: induction of labour fully national

Working checklist for the current goal. Any session picking this up: read
`CLAUDE.md` and `HANDOVER.md` first, then take the first unticked box below.

**Done means:** induction of labour runs on national guidance end to end. The
NG207 guide has its five workflows, and the local GL861 timing table is replaced
by a national timing chart in which every row names its national owner. GL861
and its two charts are then **shelved**: hidden from every surface of the app,
but kept in the repo untouched so they can be put back by removing one line
from the shelf list. The `iol-first-method-bishop-6` divergence card depends on
GL861's CRB-first ordering, so it is shelved with it, not deleted.

**Direction (Dr Shamiyah, 5 Oct 2026):** "I want to move away from all local
guides." National guidance is the product. Nothing new is built on local
content, and national charts never route a reader into a local pathway.

## Definition of done for each box

A box is ticked only when all of these hold:

1. Built from the source PDF, not from what the app already says.
2. Every cited recommendation number checked to exist in the extracted PDF text,
   by a script that fails on zero.
3. Graph walk: every `next` and `options[].next` resolves, every node reachable
   from `startId`, no orphans.
4. Reviewed by Dr Shamiyah **before** it is wired into the app.
5. Wired into every registry (`flowcharts.js`, `App.jsx` FLOWCHART_LINKS and
   FLOWCHART_GROUPS, the guide section's `flowchartId`, `connections.js`).
6. Lint clean, tests pass, build succeeds, checked in the real app with the
   service worker cleared.
7. Committed and pushed, with a What's New line.

Review runs rolling: the next box is built while the previous one is under
review. Nothing is wired until it is approved.

## Checklist

| # | Piece | Source | Built | Reviewed | Wired |
|---|---|---|---|---|---|
| 1 | `NG207_METHOD`: sweep, assessment, Bishop score to method | NG207 1.3, 1.5.1 to 1.5.4, 1.7.5, 1.7.6 | [x] | [x] | [x] |
| 2 | `NG207_PROM`: term and preterm, GBS, the 24-hour point | NG207 1.2.10 to 1.2.16 | [x] | [x] | [x] |
| 3 | `NG207_PROLONGED`: beyond 41 weeks, declining, monitoring from 42 | NG207 1.2.1 to 1.2.9 | [x] | [x] | [x] |
| 4 | `NG207_CIRCUMSTANCES`: previous caesarean, breech, FGR, macrosomia, IUFD | NG207 1.2.17 to 1.2.32 | [x] | [x] | [x] |
| 5 | `NG207_COMPLICATIONS`: hyperstimulation, unsuccessful induction, cord prolapse | NG207 1.7.1 to 1.7.6 | [x] | [x] | [x] |
| 6 | National IOL timing chart, replacing `GL861_TIMING` as the national route | NG207, NG3, NG133, GTG43, GTG57, GTG31, GTG63 | [x] | [x] | [x] |
| 7 | Shelve GL861, `GL861_IOL`, `GL861_TIMING` and the divergence card; leak check finds no trace in the running app | Dr Shamiyah, 5 Oct 2026 | [x] | [ ] | [ ] |

## Log

- 5 Oct 2026: goal set. Starting with box 1, which sets the node vocabulary for
  the rest.
- 5 Oct 2026: box 1 built (`src/data/NG207_FLOWCHARTS.js`, not yet wired).
  8 nodes, all reachable; 18 citations, all present in the PDF. Awaiting review.
- 5 Oct 2026: box 1 approved and wired (flowcharts.js, App.jsx links and group,
  `ng207-methods` flowchartId, induction topic card, end-node hand-offs to the
  NG207 guide). Checked in the app: Flow tab group, guide button, end-node
  hand-off all work. Version 1.28.0. Next: box 2, `NG207_PROM`.
- 5 Oct 2026: decision on local guides: "I don't want it to show in the app, but
  I want us to store all the summaries somewhere, to make it possible in the
  future to just put back in." Added box 7 (the shelf). Knock-on: NG207 gives no
  PROM antibiotic regimens, so none will show once GL861 is shelved. Open
  question: shelve per topic as each national replacement completes, or all
  local guides at once.
- 5 Oct 2026: box 2 built (`NG207_PROM`, not yet wired). 13 nodes, all
  reachable; 7 citations (1.2.10 to 1.2.16), all present in the PDF. No
  antibiotic regimens: NG207 defers to the NICE neonatal infection guideline.
  Awaiting review.
- 5 Oct 2026: box 2 approved and wired: registry, Flow tab, `ng207-prom`
  flowchartId, induction topic card, and a hand-off on every end node (term
  induction routes to `NG207_METHOD`; preterm routes to NG25). Walked in the
  app: term route, 24-hour decision, hand-off into the method chart. Next:
  box 3, `NG207_PROLONGED`.
- 5 Oct 2026: box 3 built (`NG207_PROLONGED`, not yet wired). 8 nodes, all
  reachable; 11 citations (1.1.3, 1.1.5, 1.2.1 to 1.2.9), all present in the PDF.
  Awaiting review.
- 5 Oct 2026: box 3 approved and wired. Flow tab lists all three NG207 charts;
  the 41-week induction route hands off into `NG207_METHOD`. Next: box 4,
  `NG207_CIRCUMSTANCES`.
- 5 Oct 2026: box 4 built (`NG207_CIRCUMSTANCES`, not yet wired). 18 nodes, all
  reachable; 17 citations (1.1.3, 1.2.17 to 1.2.32), all present in the PDF.
  Only dose: NG207's own mifepristone 200 mg (1.2.31). Awaiting review.
- 5 Oct 2026: box 4 approved and wired: opened from both `ng207-circumstances`
  and `ng207-iufd`; hand-offs to GTG45, GTG20b, NG192 and GTG31 where they
  apply. NG3 cannot be linked yet (no reader guide). Next: box 5,
  `NG207_COMPLICATIONS`.
- 5 Oct 2026: box 5 built (`NG207_COMPLICATIONS`, not yet wired). 6 nodes, all
  reachable; 7 citations (1.3.5, 1.7.1 to 1.7.6), all present in the PDF. No
  tocolytic named: NG207 names none. Awaiting review.
- 5 Oct 2026: box 5 approved and wired. All five NG207 workflows are live: the
  Flow tab lists all five, and every end node across them has a hand-off.
  Next: box 6, the national timing chart. It draws on seven guidelines, so each
  row needs its own source check before it is built.
- 5 Oct 2026: box 6 source research. Read from the source PDFs (not the app):
  | Row | National source, verbatim sense | Local GL861 said |
  |---|---|---|
  | Post-dates | NG207 1.2.4: discuss induction from 41+0 | 40+7 (same gestation) |
  | Reduced fetal movements | GTG57 (2026, key recs): no objective compromise, no indication to expedite [A]; expediting is individual, and after 39+0 does not appear to add risk [A]; audit: no uncomplicated RFM induced before 39 weeks | From 38+6 |
  | Pre-existing diabetes, no complications | NG3 1.4.2: elective birth 37+0 to 38+6 | 37+0 to 38+6 (match) |
  | Pre-existing diabetes with complications | NG3 1.4.3: consider before 37 weeks | (absent) |
  | GDM | NG3 1.4.4: no later than 40+6 | 40+3 to 40+6 (local refinement) |
  | GDM with complications | NG3 1.4.5: consider before 40+6 | 37 to 40 |
  | Pre-eclampsia | NG133 table 3: before 34 and 34 to 36+6 surveillance unless 1.5.7 indications; from 37 initiate birth within 24 to 48 h | ASAP from 37+0 |
  | Chronic or gestational hypertension, BP below 160/110 | NG133 1.3.14, 1.3.15, 1.4.7, 1.4.8: no planned birth before 37 weeks; after 37, timing agreed with a senior obstetrician | 40+0 to 40+6 |
  | "Raised PCR 30 or more with symptoms" | No national row: with hypertension this is pre-eclampsia under NG133 | 39+0 to 40+6 |
  | ICP | GTG43: mild, consider planned birth by 40 weeks or ongoing care; moderate, consider planned birth at 38 to 39 weeks; severe, consider at 35 to 36 weeks [A]; comorbidities may bring timing forward | Fixed in b8f487a, but worded as "planned birth at 38+0 to 39+0" and "35+0 to 36+0", tighter than GTG43 |
  | APH | GTG63 13.1: compromise, deliver immediately; unexplained without compromise, senior obstetrician decides; before 37+0 settled, no evidence for elective early birth; after 37+0 minor or major APH, consider induction | Individualised |
  | SGA / FGR | GTG31 2024 edition: source not obtainable here (Wiley and Europe PMC blocked; PubMed rate-limited). Blocked until the PDF is added. | Individualised |
- 5 Oct 2026: GTG31 (2024, third edition) PDF supplied and added; Library entry
  corrected from "February 2013". Its timing: SGA with FGR excluded, consider
  birth at 39+0, by 39+6 [B]; late FGR, initiate from 37+0, complete by 37+6
  [A]; early FGR, tertiary care. The app's existing GTG31 guide still says
  "minor SGA: deliver at 37+0", which contradicts the 2024 edition (outside
  this goal; flagged).
- 5 Oct 2026: box 6 built (`IOL_TIMING`, `src/data/IOL_TIMING_FLOWCHART.js`, not
  yet wired). 25 nodes, all reachable. Multi-source check: every NICE number
  verified against its own PDF (NG3, NG133, NG207), no unsourced numbers, and
  18 RCOG statements matched word for word in GTG57, GTG43, GTG31 and GTG63.
  Awaiting review.
- 5 Oct 2026: box 6 approved and wired: registry, Flow tab (NG207 group),
  induction topic card, hand-offs to NG207, NG133 and GTG57/GTG63 charts and
  guides, and the two trials (ARRIVE, Gardosi 2025) now open `IOL_TIMING`
  instead of `GL861_TIMING`. Their `relatedGl: ["GL861"]` is left for box 7.
  Hand-off test now also fails if any hand-off routes to a local guide.
  Next: box 7, the shelf.
- 5 Oct 2026: box 7 built. `src/data/shelf.js` lists shelved items; every data
  source filters through it (reader, FLOWCHARTS, App lists and Library,
  navigation and deep links, topics, connections, keyword links, pearls,
  related-guideline links, search index, divergence card). Permanent test
  `src/data/shelf.test.js` checks nothing shelved is reachable and everything
  shelved is still stored; proven to fail when a filter is removed. In-app leak
  check: 17 surfaces, no trace (the one hit was the search box echoing "GL861").
  Known remaining text: the local GL895 PPROM triage chart's subtitle names GL861
  and its term arm carries GL861-derived steps; GL895 is outside this goal.
  Awaiting review.
