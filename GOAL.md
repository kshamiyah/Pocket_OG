# Goal: induction of labour fully national

Working checklist for the current goal. Any session picking this up: read
`CLAUDE.md` and `HANDOVER.md` first, then take the first unticked box below.

**Done means:** induction of labour runs on national guidance end to end. The
NG207 guide has its five workflows, and the local GL861 timing table is replaced
by a national timing chart in which every row names its national owner. GL861
stays in the app as a local overlay (including its CRB-first ordering, which the
`iol-first-method-bishop-6` divergence card depends on).

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
| 2 | `NG207_PROM`: term and preterm, GBS, the 24-hour point | NG207 1.2.10 to 1.2.16 | [ ] | [ ] | [ ] |
| 3 | `NG207_PROLONGED`: beyond 41 weeks, declining, monitoring from 42 | NG207 1.2.1 to 1.2.9 | [ ] | [ ] | [ ] |
| 4 | `NG207_CIRCUMSTANCES`: previous caesarean, breech, FGR, macrosomia, IUFD | NG207 1.2.17 to 1.2.32 | [ ] | [ ] | [ ] |
| 5 | `NG207_COMPLICATIONS`: hyperstimulation, unsuccessful induction, cord prolapse | NG207 1.7.1 to 1.7.6 | [ ] | [ ] | [ ] |
| 6 | National IOL timing chart, replacing `GL861_TIMING` as the national route | NG207, NG3, NG133, GTG43, GTG57, GTG31, GTG63 | [ ] | [ ] | [ ] |

## Log

- 5 Oct 2026: goal set. Starting with box 1, which sets the node vocabulary for
  the rest.
- 5 Oct 2026: box 1 built (`src/data/NG207_FLOWCHARTS.js`, not yet wired).
  8 nodes, all reachable; 18 citations, all present in the PDF. Awaiting review.
- 5 Oct 2026: box 1 approved and wired (flowcharts.js, App.jsx links and group,
  `ng207-methods` flowchartId, induction topic card, end-node hand-offs to the
  NG207 guide). Checked in the app: Flow tab group, guide button, end-node
  hand-off all work. Version 1.28.0. Next: box 2, `NG207_PROM`.
