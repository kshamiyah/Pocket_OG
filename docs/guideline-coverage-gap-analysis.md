# Guideline coverage: gap analysis

Snapshot of what's in the knowledge base today, what's thin, and what's missing
against the working scope of a UK O&G trainee curriculum (RCOG Green-top
Guidelines, relevant NICE guidance, BASHH/FSRH, NHSCSP, MBRRACE). Prepared as a
punch list towards roughly 70% coverage of that corpus.

## 1. What's in the library today

**64 full guideline pages** (reader available), across:

| Source | Count | Codes |
|---|---|---|
| RBH local (`GL`/`CG` prefix) | 11 | GL952, GL787, GL895, GL861, GL783, GL880, GL891, GL983, CG565, CG621, CG623 |
| RCOG Green-top | 25 | GTG57, GTG63, GTG67, GTG52, GTG69, GTG31, GTG17, GTG5, GTG56, GTG22, GTG42, GTG64, GTG27A, GTG27B, GTG26, GTG45, GTG36, GTG72, GTG20A, GTG20B, GTG68, GTG62, GTG34, GTG48, GTG38 |
| NICE | 14 | QS22, NG88, NG25, CG192, NG133, NG229, NG73, NG192, NG137, NG194, NG244, NG23, NG123, NG257 |
| BASHH | 6 | BASHH_PID, BASHH_HSV, BASHH_CT, BASHH_GC, BASHH_SYPHILIS, BASHH_BV_TV |
| NHSCSP | 1 | NHSCSP20 |
| MBRRACE | 1 | MBRRACE_SLMC2025 (surveillance report, not a management guideline) |
| UK Kidney Association | 1 | UKKA_RENAL |
| ESC | 1 | ESC_CVD |
| ESHRE/ASRM international guideline | 1 | PCOS2023 |
| BHIVA | 1 | BHIVA_HIV_PREGNANCY |
| FSRH | 2 | FSRH_UKMEC, FSRH_EC |

Around these, the app has 75 flowcharts, 13 consent/counselling pages, 15 drug
(Rx) categories, and a set of curated topic pages tying guides, flowcharts,
drugs and trials together for the 11 highest-yield presentations (pre-eclampsia,
PPH, IOL, ectopic, hyperemesis, PPROM, HMB, maternal collapse, diabetes,
anaemia, perinatal mental health).

A separate tier, sourced from *TOG* (Obstetric Medicine review articles) rather
than a national guideline body, covers medical disorders in pregnancy as
flowcharts + pearls only, with no full-text reader page: thyroid disease,
congenital heart disease, cardiomyopathy, MI, arrhythmias, valvular disease,
oligo-/polyhydramnios. Treat these as a lighter-weight tier, not equivalent to
a Green-top page.

## 2. Fix first: existing inconsistencies

- **GTG50 (Umbilical Cord Prolapse)** is registered in `guidelines.js` and has
  a flowchart (`GTG50_FLOWCHART.js`), but has no `GTG50.js` sections file and
  is not in `readerAvailable.js`. It's a dead-end: the flowchart exists but
  there's no full guideline behind it. Either add the sections file or drop it
  from the registries until it's ready (see CLAUDE.md's "registries to update"
  list for what else references it).
- **RCOG GTG21 (Ectopic Pregnancy)** and **GTG37a (VTE risk in pregnancy)** are
  cited extensively as sources inside `calculator.js` but have no standalone
  reader page. Reasonable as-is since the calculators carry the content, but
  worth a full page if ectopic/VTE get deeper treatment later.
- **GTG63 (Antepartum Haemorrhage)** is the 2011 edition; RCOG has since split
  placenta praevia/accreta and vasa praevia out into their own current
  documents — **GTG27a and GTG27b (2018), now added**. GTG63 itself still
  covers general APH (abruption, unexplained bleeding) and is the oldest
  full-text guideline left in the library — still worth a refresh, but the
  praevia/accreta/vasa gap it left is closed.

## 3. Coverage map by domain

Legend: **Strong** (full guideline + flowchart + drugs/consent as relevant),
**Thin** (partial: flowchart/calculator only, no full text, or single old
source), **Missing** (nothing beyond a passing mention).

### Obstetrics: antenatal
| Topic | Status |
|---|---|
| Hypertension / pre-eclampsia | Strong (GL952, NG133) |
| Diabetes in pregnancy | Strong (GL983) |
| Anaemia | Strong (GL783) |
| Obstetric cholestasis | Strong (GL880) |
| PPROM / preterm labour | Strong (GL895, NG25) |
| Reduced fetal movements | Strong (GTG57) |
| Small for gestational age / FGR | Strong (GTG31) |
| Multiple pregnancy | Strong (NG137, merged with its QS46 quality standard into one reader page) |
| Nausea & vomiting / hyperemesis | Strong (GTG69) |
| Antenatal care pathway | Thin (QS22 quality standard only, not full NICE NG201) |
| Antenatal corticosteroids | Thin (consent page only, no flowchart/guideline) |
| Anti-D / rhesus disease prevention | **Missing** |
| Group B Streptococcus in pregnancy | Thin (consent page "GBS antibiotics in labour" only; no GTG36/NG195 content) |
| Obesity in pregnancy | **Missing** |
| Prevention of early-onset neonatal infection | **Missing** |
| Cervical cerclage / cervical insufficiency | **Missing** |
| Breech presentation at term | Thin (ECV consent page only; no vaginal breech birth guideline) |
| VTE risk & thromboprophylaxis | Strong (GL891, calculator) |

### Obstetrics: intrapartum
| Topic | Status |
|---|---|
| Induction of labour | Strong (GL861) |
| Fetal monitoring in labour | Strong (NG229) |
| Antepartum haemorrhage | Thin (GTG63, 2011, superseded in part) |
| Umbilical cord prolapse | Thin (flowchart only, see §2) |
| Postpartum haemorrhage | Strong (GTG52) |
| Maternal collapse / cardiac arrest | Strong (GTG56, MBRRACE) |
| Shoulder dystocia | **Missing** |
| Operative vaginal (instrumental) delivery | Thin (consent page only, no clinical guideline) |
| Caesarean section | Thin (consent page only, no clinical guideline) |
| Vaginal birth after caesarean | Thin (consent page only, no clinical guideline) |
| Placenta accreta spectrum | **Missing** |
| Vasa praevia | **Missing** |
| Perineal trauma / OASI | **Missing** |
| Intrapartum sepsis | **Missing** (only general obstetric antibiotics, GL787) |

### Postnatal
| Topic | Status |
|---|---|
| Postnatal care pathway | Strong (NG194) |
| Perinatal mental health | Strong (CG192) |
| Sepsis following pregnancy | Strong (GTG64) |
| Secondary PPH | **Missing** (covered only incidentally under GTG52) |

### Medical disorders in pregnancy
| Topic | Status |
|---|---|
| Thyroid disease | Thin (TOG-sourced flowchart only) |
| Cardiac disease (congenital, acquired, MI, arrhythmia, valvular) | Strong (ESC 2025 guideline added on top of the existing TOG flowcharts — risk stratification, red flags, delivery planning, with the TOG flowcharts now reached via the reader rather than standing alone) |
| Epilepsy in pregnancy | Strong (GTG68) |
| Asthma in pregnancy | Strong (NG244) |
| Renal disease in pregnancy | Strong (UK Kidney Association 2019) |
| Obesity in pregnancy | Strong (GTG72, also listed above) |

### Early pregnancy
| Topic | Status |
|---|---|
| First trimester miscarriage | Strong (CG565, CG621) |
| Recurrent miscarriage | Strong (GTG17) |
| Ectopic pregnancy | Strong (CG623, calculator, GTG21 cited) |
| Gestational trophoblastic disease | Strong (GTG38) |
| Antiphospholipid syndrome / recurrent loss workup | **Missing** beyond GTG17 |

### Gynaecology: benign
| Topic | Status |
|---|---|
| Heavy menstrual bleeding | Strong (NG88) |
| Endometriosis | Strong (NG73) |
| Endometrial hyperplasia | Strong (GTG67) |
| Cervical screening & colposcopy | Strong (NHSCSP20) |
| Ovarian hyperstimulation syndrome | Strong (GTG5) |
| Ovarian cysts (premenopausal / postmenopausal) | Strong (GTG62, GTG34) |
| Chronic pelvic pain | **Missing** |
| Premenstrual syndrome | Strong (GTG48) |
| Menopause | Strong (NICE NG23) |
| Fibroids beyond HMB | Thin (folded into NG88 flowcharts only) |
| Lichen sclerosus / vulval disease | **Missing** |
| Female genital mutilation | **Missing** |

### Gynaecological oncology
| Topic | Status |
|---|---|
| Ovarian cancer | **Missing** |
| Endometrial cancer | Thin (only hyperplasia, GTG67, as a precursor) |
| Cervical cancer | **Missing** (screening pathway only, via NHSCSP20) |
| Vulval cancer | **Missing** |

### Urogynaecology
| Topic | Status |
|---|---|
| Urinary incontinence | Strong (NICE NG123) |
| Pelvic organ prolapse | Strong (NICE NG123, same guideline) |

### Reproductive medicine / subfertility
| Topic | Status |
|---|---|
| OHSS | Strong (GTG5) |
| General subfertility assessment | Strong (NICE NG257, replaces the old CG156) |
| PCOS | Strong (ESHRE/ASRM International Guideline 2023 — NICE removed PCOS-specific content from NG257 pending its own dedicated guideline) |

### Sexual health (BASHH)
| Topic | Status |
|---|---|
| Pelvic inflammatory disease | Strong (BASHH_PID) |
| Genital herpes in pregnancy | Strong (BASHH_HSV) |
| Chlamydia | Strong (BASHH_CT) |
| Gonorrhoea | Strong (BASHH_GC) |
| Syphilis | Strong (BASHH_SYPHILIS, includes syphilis in pregnancy) |
| Bacterial vaginosis / trichomonas | Strong (BASHH_BV_TV) |
| HIV in pregnancy (BHIVA) | Strong (BHIVA_HIV_PREGNANCY) |

### Contraception
| Topic | Status |
|---|---|
| Contraception drugs (Rx) | Present as drug reference only |
| UKMEC / method choice, emergency contraception (FSRH) | Strong (FSRH_UKMEC, FSRH_EC) |

### Safeguarding
| Topic | Status |
|---|---|
| Domestic abuse in pregnancy | **Missing** |

## 4. Rough scale of the gap

Counting the corpus a UK O&G trainee is realistically expected to know
(RCOG Green-top Guidelines ~60, relevant NICE guidelines ~18, BASHH ~10,
FSRH ~8, NHSCSP/other ~5) gives a working denominator of roughly 100–110
documents. At 64 full guideline pages, the library sits at **around
58–64% coverage**, up from 28–30% at the start of this punch list. Reaching
70% needs on the order of **10–15 more full guideline pages** — mainly the
remaining gynae oncology items (P2 #19–22), perineal trauma/OASI and the
GTG50 orphan fix (P1 #13–14), and the tail of P3 (#31–32 plus the P3 items
not yet started: ovarian cysts follow-on topics, chronic pelvic pain).

## 5. Priority order to close the gap

**P0, safety-critical and currently absent:**
1. ~~Anti-D / rhesus disease prophylaxis~~ — done (GTG22)
2. ~~Shoulder dystocia~~ — done (GTG42)
3. ~~Sepsis in pregnancy and the puerperium~~ — done (GTG64, the current Dec 2024 unified guideline; supersedes the old GTG64a/b split)
4. ~~Placenta accreta spectrum + vasa praevia~~ — done (GTG27a, GTG27b)
5. ~~Postnatal care pathway~~ — done (NG194) — **P0 now fully closed out**

**P1, high daily-use, currently thin or missing:**
6. ~~Caesarean section~~ — done (NG192)
7. ~~Operative vaginal delivery~~ — done (GTG26, "Assisted Vaginal Birth")
8. ~~Vaginal birth after caesarean~~ — done (GTG45)
9. ~~Group B Streptococcus in pregnancy~~ — done (GTG36)
10. ~~Twin and triplet pregnancy~~ — done (NG137, since merged with QS46 into a single "Twin & Triplet Pregnancy" reader page — QS46's statements were a distillation of NG137 itself, not a separate source, so splitting them across two pages was more confusing than useful)
11. ~~Obesity in pregnancy~~ — done (GTG72)
12. ~~Breech presentation at term~~ — done (GTG20a "External Cephalic Version", GTG20b "Management of Breech Presentation")
13. Perineal trauma / OASI repair
14. Fix the GTG50 cord prolapse orphan (§2)

**P2, completes core obstetric medicine and gynae oncology (currently a hard zero):**
15. ~~Epilepsy in pregnancy~~ — done (GTG68)
16. ~~Asthma in pregnancy~~ — done (NG244)
17. ~~Renal disease in pregnancy~~ — done (UK Kidney Association 2019)
18. ~~Cardiac disease in pregnancy~~ — done (ESC 2025, upgrades the existing TOG flowcharts to a full guideline tier — all four obstetric medicine items now closed out)
19. Ovarian cancer (suspected malignancy, RMI)
20. Endometrial cancer
21. Cervical cancer
22. Vulval cancer

**P3, rounds out gynaecology, sexual health, reproductive medicine:**
23. ~~Ovarian cysts, premenopausal and postmenopausal~~ — done (GTG62 premenopausal, GTG34 postmenopausal including the December 2025 simple-cyst follow-up update, shared RMI-based triage flowchart)
24. ~~Menopause (NICE NG23)~~ — done (diagnosis, HRT types/regimens/routes, quantified benefit-risk counselling, non-hormonal options, GSM, and premature ovarian insufficiency)
25. ~~Urinary incontinence / pelvic organ prolapse~~ — done (NICE NG123 covers both in one guideline, shared UI/POP triage flowchart)
26. ~~Premenstrual syndrome~~ — done (RCOG GTG48; chronic pelvic pain dropped from this item, still open below)
27. ~~PCOS, general subfertility assessment~~ — done (PCOS via the 2023 ESHRE/ASRM international guideline, since NICE removed PCOS content from its fertility guideline pending a dedicated one; general subfertility via NICE NG257, the March 2026 successor to CG156)
28. ~~Chlamydia, gonorrhoea, syphilis, BV/trichomonas, HIV in pregnancy~~ — done (BASHH_CT, BASHH_GC, BASHH_SYPHILIS, BASHH_BV_TV, and BHIVA_HIV_PREGNANCY per the 2025 BHIVA guideline)
29. ~~UKMEC / contraception method choice, emergency contraception~~ — done (FSRH_UKMEC per the 2025 update, FSRH_EC)
30. ~~Gestational trophoblastic disease~~ — done (RCOG GTG38)
31. Domestic abuse in pregnancy / safeguarding
32. Chronic pelvic pain (split out of the old item 26, which now covers PMS only)

Each addition should follow the existing pattern end to end (see CLAUDE.md,
"Adding content: registries to update"): sections file in
`packages/guidelines/src`, entry in `guidelines.js` + `readerAvailable.js`,
flowchart(s) where the source guideline has an algorithm, drug/consent
entries where relevant, search synonyms, and a topic page for anything
high-yield enough to deserve one.
