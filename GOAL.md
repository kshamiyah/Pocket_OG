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
| 3 | `NG207_PROLONGED`: beyond 41 weeks, declining, monitoring from 42 | NG207 1.2.1 to 1.2.9 | [x] | [ ] | [ ] |
| 4 | `NG207_CIRCUMSTANCES`: previous caesarean, breech, FGR, macrosomia, IUFD | NG207 1.2.17 to 1.2.32 | [ ] | [ ] | [ ] |
| 5 | `NG207_COMPLICATIONS`: hyperstimulation, unsuccessful induction, cord prolapse | NG207 1.7.1 to 1.7.6 | [ ] | [ ] | [ ] |
| 6 | National IOL timing chart, replacing `GL861_TIMING` as the national route | NG207, NG3, NG133, GTG43, GTG57, GTG31, GTG63 | [ ] | [ ] | [ ] |
| 7 | Shelve GL861, `GL861_IOL`, `GL861_TIMING` and the divergence card; leak check finds no trace in the running app | Dr Shamiyah, 5 Oct 2026 | [ ] | [ ] | [ ] |

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
