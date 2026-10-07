# Goal: induction of labour fully national

**Status: COMPLETE (5 Oct 2026).** All seven boxes built, reviewed and wired.

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
| 7 | Shelve GL861, `GL861_IOL`, `GL861_TIMING` and the divergence card; leak check finds no trace in the running app | Dr Shamiyah, 5 Oct 2026 | [x] | [x] | [x] |

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
- 5 Oct 2026: box 7 approved. GOAL COMPLETE. Decisions recorded:
  - The GL895 PPROM triage chart keeps its GL861-derived term arm and subtitle
    for now; it is handled when PPROM gets its own national goal.
  - Local guides are shelved topic by topic, as each national replacement is
    finished, never all at once.
  - Pull request opened to `main`.

---

# Next goal (proposed, not started): every local guide shelved

**Direction (Dr Shamiyah, 6 Oct 2026):** "Everything local needs to be shelved.
Antibiotics are governed by local guidelines, not national." The end state is
zero local guides visible in the app. Where no national guidance exists
(antibiotics), the app points users to their own trust's policy instead.
Shelving stays topic by topic: a local guide is shelved once its national
replacement is finished, or, for antibiotics, once the pointer is in place.

Progress at 6 Oct 2026: 11 local guides; 1 shelved (GL861); 4 more have a
finished national replacement (NG126, NG133).

| # | Topic | Local | National | Blockers / sweep needed |
|---|---|---|---|---|
| 1 | Early pregnancy **(DONE: shelved and approved 6 Oct 2026)** | CG565, CG621, CG623 | NG126 (done) | Anti-D divergence cards carry a CG565 local block; PUL and ectopic calculators tagged CG623; methotrexate consent figures quoted "verbatim from CG623" |
| 2 | Hypertension | GL952 | NG133 (done) | References in quickref, TOG, trials, topics, pearls |
| 3 | Antibiotics **(DONE: shelved and approved 7 Oct 2026; BNF cross-check pending, see below)** | GL787 | none, by design | Pointer to trust antimicrobial policy. Rx antibiotic cards: shelve all local data, keep the drug and base its dosing on the BNF only (decision 6 Oct 2026). Blocked: bnf.nice.org.uk is denied by the environment's network policy |
| 4 | Cholestasis | GL880 | GTG43 (PDF in repo) | Build the guide; GL880 already matches GTG43 |
| 5 | VTE | GL891 | GTG37a, GTG37b (PDFs in repo) | Build the guide |
| 6 | Diabetes | GL983 | NG3 (PDF in repo) | DKA source still needed |
| 7 | PPROM | GL895 | GTG73 + pre-24-week source | Both sources needed; GL895 chart also carries GL861-derived term arm |
| 8 | Iron deficiency | GL783 | BSH guideline | Source needed |

## Step 1 audit: early pregnancy (6 Oct 2026)

Shelving CG565, CG621, CG623 is not a one-line change. Findings, checked against
the NG126 and GTG21 PDFs:

- **Calculators (PUL, ECTOPIC_DECISION, EXPECTANT_SURVEILLANCE,
  MTX_SURVEILLANCE):** already sourced to NG126 and GTG21. Only the links that
  open them are tagged `gl: "CG623"`. Fix: retag those links to NG126. No
  clinical change.
- **Methotrexate Rx card (`rx/cytotoxics.js`):** 50 mg/m2 IM, day 4 and 7 hCG,
  repeat if fall under 15%, weekly to below 15 IU/L are all in GTG21 (section on
  medical management, Appendix II). Fix: re-cite to GTG21; remove CG623-only
  operational notes (trust cytotoxic policy, 1-hour rest).
- **Ectopic consent page (`consent.js`, "verbatim from CG623"):** GTG21 supports
  success 65 to 95% (app says 65 to 94) and second dose 3 to 27% (app says 14
  in 100). Not found in GTG21: pain days 3 to 7 "up to 75 in 100", hCG rise
  "up to 86 in 100", surgery after MTX "10 in 100", rupture "7 in 100",
  laparoscopy complications "2 in 1,000", further treatment after salpingotomy
  "up to 1 in 5". These are local or unsourced: replace with national figures
  where one exists, otherwise state the risk without a number. Needs review.
- **Anti-D divergence cards:** carry a CG565/CG621 local block. Fix: hide local
  blocks belonging to shelved guides; the national positions stay.
- **Charts:** CG565_TRIAGE, CG621_OUTPATIENT, CG621_INPATIENT, CG623_MTX shelved;
  links to them repointed to the NG126 charts.
- Then add CG565, CG621, CG623 to the shelf, extend the leak check.
- 6 Oct 2026: step 1 built. CG565, CG621, CG623 and their four charts on the
  shelf; every link repointed to NG126; ectopic consent page, methotrexate card
  and four pearls re-sourced to NG126, GTG21, GTG17, RCOG CA2 and the RCOG
  patient leaflet (now in public/consent-sources). Found and fixed on the way:
  the Counsel tab crashed on open (missing import, live since 20 Jul 2026), and
  consent risks without a frequency band were never rendered. Leak check: 18
  surfaces clean. 23 tests pass. Version 1.29.0. Awaiting review.
- 6 Oct 2026: step 1 approved. Pull request opened.

## Step 2 research: antibiotics (6 Oct 2026)

BNF is unreachable from this environment ("BNF is only available in the UK";
geo-restricted, not a network setting). Agreed alternative: doses from national
NICE and BASHH guidelines, which are BNF-aligned. Sources saved in
apps/pocket-og/public/rx-sources/.

| Card | National source | Finding |
|---|---|---|
| Nitrofurantoin | NICE NG109 table 2 | 100 mg MR twice daily (or 50 mg four times daily) for 7 days; avoid at term. No national prophylaxis dose |
| Amoxicillin | NICE NG109 table 2 | 500 mg three times daily for 7 days, only if culture shows susceptibility |
| Cefalexin | NICE NG109 table 2 | 500 mg twice daily for 7 days. No national prophylaxis dose |
| Erythromycin | NICE NG25 1.4.1 | 250 mg four times daily, maximum 10 days or until established labour |
| Metronidazole (oral) | BASHH BV 2012 | 400 mg twice daily 5 to 7 days, or 2 g single dose |
| Clindamycin (oral) | BASHH BV 2012 | Alternative: 300 mg twice daily for 7 days |
| Benzylpenicillin | NICE NG195 1.6.2 | National first choice for intrapartum antibiotics; NG195 gives no dose. GTG36 (cited by the card) unreachable (Wiley) |
| Clindamycin IV for GBS with penicillin allergy | NICE NG195 table 1 | CONTRADICTED: NG195 names a cephalosporin (e.g. cefotaxime) or, if severe, vancomycin |
| Gentamicin | NICE NG195 1.6.2, 1.6.3 | Named for chorioamnionitis with benzylpenicillin and metronidazole; once-daily dosing; no dose |
| Metronidazole IV and PR | NICE NG195 table 1 | Named for chorioamnionitis; no dose. PR surgical prophylaxis: no national source |
| Co-amoxiclav | NICE NG192 1.4.45; NG25 1.4.3 | CONTRADICTED: do not use before skin incision at caesarean; do not use for PPROM. Card cited NG192 for the opposite |
- 6 Oct 2026: step 2 built. GL787 on the shelf; Rx antibiotic cards rebuilt from
  NICE NG109, NG25, NG195, NG192 and BASHH (20 doses and statements matched word
  for word); doses NICE does not give say "refer to local guidelines"; old cards
  stored in rx/antibiotics.local-shelved.js; co-amoxiclav and IV clindamycin for
  GBS removed as contradicted by NICE. National text that said "see GL787" now
  points to local antimicrobial policy. New permanent test: national content
  never names a shelved guide (it caught a CG565 mention left in a pearl).
  24 tests pass. Version 1.30.0. Awaiting review.
- 7 Oct 2026: step 2 approved; PR #45 merged (1.30.0). BNF follow-up handed to a
  local session (the BNF is UK-only): add BNF doses for benzylpenicillin,
  gentamicin and IV metronidazole in labour, and cross-check the other six cards.
- 7 Oct 2026: BNF follow-up done in a local session, from BNF pages saved by
  hand into bnf-sources/ (gitignored; the BNF is UK-only and copyrighted).
  Benzylpenicillin now carries the BNF intrapartum GBS prophylaxis dose (3 g,
  then 1.5 g every 4 hours until birth); route renamed to GBS prophylaxis. The
  BNF has no obstetric dose for gentamicin or IV metronidazole, so both still
  refer to local guidelines. Cross-check: nitrofurantoin, amoxicillin,
  cefalexin and erythromycin match the BNF; oral metronidazole for BV is
  400–500 mg in the BNF (app keeps BASHH's 400 mg); the BNF has no oral
  clindamycin dose for BV (app keeps BASHH). New check
  scripts/check-bnf-doses.mjs fails on zero. Version 1.31.0. Next: the other
  Rx files against the BNF, one file at a time.
- 7 Oct 2026: Rx antihypertensives checked against NICE NG133 and NG25. NG133
  gives no doses for the blood-pressure drugs, only magnesium and aspirin, so
  those eight doses are unchanged until the BNF pages are saved locally.
  Fixed: magnesium neuroprotection (NG25 1.10.4: 4 g over 15 min, then 1 g/hr
  until birth or 24 hr; was 4 g over 30 min, no infusion); eclampsia loading
  over 5 to 15 min and recurrent-fit dose (NG133 1.8.4); enalapril, captopril
  and atenolol notes rewritten from NG133 1.9.4 to 1.9.7 and the MHRA note
  (enalapril no longer marked as one to avoid in breastfeeding). Version 1.32.0. Next:
  uterotonics.
- 7 Oct 2026: Rx uterotonics checked against NICE NG235, NG207, NG126 and
  NG88. Fixed: oxytocin third-stage timing, 5 unit slow IV option, carbetocin
  at caesarean; carboprost second-line, interval not less than 15 min;
  misoprostol PPH routes, missed miscarriage 48 hr after mifepristone,
  incomplete miscarriage 600 micrograms, induction oral 25 micrograms;
  ergometrine contraindications and antiemetic; tranexamic acid's place in
  HMB. Unsourced extras removed. Doses with no national source (oxytocin
  infusions, carboprost 250 micrograms, ergometrine IV, dinoprostone, oral
  tranexamic acid) unchanged pending BNF / RCOG GTG52 (RCOG site blocked from
  the cloud today). The GTG52 guide text still says oxytocin "at delivery of
  anterior shoulder"; NG235 supersedes it. Version 1.33.0. Next: tocolytics.
- 7 Oct 2026: Rx tocolytics checked against NICE NG25, RCOG GTG74 (2022) and
  NICE NG3. Atosiban reframed as second-line (NG25 1.8.4); nifedipine card
  gains a tocolysis entry (NG25 1.8.2, 1.8.3; no national dose, refer to local
  guidelines). Betamethasone card became "Antenatal corticosteroids" (id kept
  as betamethasone so links still work): dexamethasone first (GTG74; fixed
  "6 mg every 6 hr" to 12 hr apart), betamethasone alternative, NICE and RCOG
  gestation ranges side by side, NG25 repeat-course criteria, infection as a
  balance not a contraindication. Indomethacin shelved in
  rx/tocolytics.shelved.js (not in NG25). Atosiban dose unchanged pending
  BNF. Version 1.34.0. Next: anticoagulants.
- 7 Oct 2026: Rx anticoagulants checked against NICE NG133 and RCOG GTG37a
  and GTG37b (2015). Aspirin until birth (was "stop at 36 weeks"); LMWH
  treatment doses replaced with GTG37b booking-weight bands (were 1 mg/kg
  and 100 units/kg BD); regional and post-spinal timings, platelet and anti-Xa
  monitoring, over-170 kg and high prophylactic doses, renal dose reduction
  from GTG37a/b. Unsourced extras removed; contraindications kept pending
  BNF. Version 1.35.0. Next: analgesia.
- 7 Oct 2026: Rx analgesia checked against NICE NG192, NG235, NG194 and
  BASHH/RCOG HSV 2024. Codeine: not offered when breastfeeding (NG192
  1.6.20, 1.6.27). New cards: dihydrocodeine/co-dydramol (NG192 1.6.19; no
  national dose) and remifentanil PCA (NG235 1.6.21 to 1.6.24). Neuraxial
  diamorphine and morphine doses from NG192 1.6.11 to 1.6.13 (new
  "neuraxial" route type in RxPage); oral IR morphine routine after neuraxial
  (1.6.15); PCA and neuraxial monitoring. Paracetamol + NSAID regularly
  (1.6.18, 1.6.21). Unsourced extras removed; NSAID 30-week warning and
  oral doses kept pending BNF. Version 1.36.0. Next: antiemetics.
- 7 Oct 2026: Rx antiemetics checked against RCOG GTG69 (2024; PDF in
  sources/). All doses from Appendix III; first/second/third line per GTG69
  (chlorpromazine was "third-line", now first). Ondansetron risk reworded to
  orofacial clefting (3 per 10 000); metoclopramide may exceed 5 days.
  Dexamethasone shelved in rx/antiemetics.shelved.js; new cards:
  corticosteroids for HG, domperidone, thiamine. Found but not yet changed:
  pearl "gtg69-no-doxylamine-uk" contradicts GTG69; PUQE calculator says
  Hartmann's first (GTG69: 0.9% saline with KCl) and metoclopramide max 5 days (both since fixed, same version);
  GTG69 guide text is the 2016 edition. Version 1.37.0.
