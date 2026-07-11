# Guideline coverage: gap analysis

Snapshot of what's in the knowledge base today, what's thin, and what's missing
against the working scope of a UK O&G trainee curriculum (RCOG Green-top
Guidelines, relevant NICE guidance, BASHH/FSRH, NHSCSP, MBRRACE). Prepared as a
punch list towards roughly 70% coverage of that corpus.

## 1. What's in the library today

**32 full guideline pages** (reader available), across:

| Source | Count | Codes |
|---|---|---|
| RBH local (`GL`/`CG` prefix) | 11 | GL952, GL787, GL895, GL861, GL783, GL880, GL891, GL983, CG565, CG621, CG623 |
| RCOG Green-top | 8 | GTG57, GTG63, GTG67, GTG52, GTG69, GTG31, GTG17, GTG5, GTG56 (9, see below) |
| NICE | 7 | QS46, QS22, NG88, NG25, CG192, NG133, NG229, NG73 (8) |
| BASHH | 2 | BASHH_PID, BASHH_HSV |
| NHSCSP | 1 | NHSCSP20 |
| MBRRACE | 1 | MBRRACE_SLMC2025 (surveillance report, not a management guideline) |

Around these, the app has 49 flowcharts, 13 consent/counselling pages, 15 drug
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
| Multiple pregnancy | Thin (QS46 is a quality standard summary, not the full NICE NG137 twin/triplet guideline) |
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
| Postnatal care pathway | **Missing** (NICE NG194) |
| Perinatal mental health | Strong (CG192) |
| Sepsis following pregnancy | **Missing** |
| Secondary PPH | **Missing** (covered only incidentally under GTG52) |

### Medical disorders in pregnancy
| Topic | Status |
|---|---|
| Thyroid disease | Thin (TOG-sourced flowchart only) |
| Cardiac disease (congenital, acquired, MI, arrhythmia, valvular) | Thin (TOG-sourced flowcharts only; no ESC/RCOG full guideline) |
| Epilepsy in pregnancy | **Missing** |
| Asthma in pregnancy | **Missing** |
| Renal disease in pregnancy | **Missing** |
| Obesity in pregnancy | **Missing** (also listed above) |

### Early pregnancy
| Topic | Status |
|---|---|
| First trimester miscarriage | Strong (CG565, CG621) |
| Recurrent miscarriage | Strong (GTG17) |
| Ectopic pregnancy | Strong (CG623, calculator, GTG21 cited) |
| Gestational trophoblastic disease | **Missing** |
| Antiphospholipid syndrome / recurrent loss workup | **Missing** beyond GTG17 |

### Gynaecology: benign
| Topic | Status |
|---|---|
| Heavy menstrual bleeding | Strong (NG88) |
| Endometriosis | Strong (NG73) |
| Endometrial hyperplasia | Strong (GTG67) |
| Cervical screening & colposcopy | Strong (NHSCSP20) |
| Ovarian hyperstimulation syndrome | Strong (GTG5) |
| Ovarian cysts (premenopausal / postmenopausal) | **Missing** (GTG34, GTG62) |
| Chronic pelvic pain | **Missing** |
| Premenstrual syndrome | **Missing** (GTG48) |
| Menopause | **Missing** (NICE NG23) |
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
| Urinary incontinence | **Missing** (NICE NG123) |
| Pelvic organ prolapse | **Missing** |

### Reproductive medicine / subfertility
| Topic | Status |
|---|---|
| OHSS | Strong (GTG5) |
| General subfertility assessment | **Missing** (NICE NG156) |
| PCOS | **Missing** |

### Sexual health (BASHH)
| Topic | Status |
|---|---|
| Pelvic inflammatory disease | Strong (BASHH_PID) |
| Genital herpes in pregnancy | Strong (BASHH_HSV) |
| Chlamydia | **Missing** |
| Gonorrhoea | **Missing** |
| Syphilis | **Missing** |
| Bacterial vaginosis / trichomonas | **Missing** |
| HIV in pregnancy (BHIVA) | **Missing** |

### Contraception
| Topic | Status |
|---|---|
| Contraception drugs (Rx) | Present as drug reference only |
| UKMEC / method choice, emergency contraception (FSRH) | **Missing** as a guideline |

### Safeguarding
| Topic | Status |
|---|---|
| Domestic abuse in pregnancy | **Missing** |

## 4. Rough scale of the gap

Counting the corpus a UK O&G trainee is realistically expected to know
(RCOG Green-top Guidelines ~60, relevant NICE guidelines ~18, BASHH ~10,
FSRH ~8, NHSCSP/other ~5) gives a working denominator of roughly 100–110
documents. At 32 full guideline pages, the library sits at **around
28–30% coverage**. Reaching 70% needs on the order of **45–50 more full
guideline pages**, prioritised below rather than added alphabetically.

## 5. Priority order to close the gap

**P0, safety-critical and currently absent:**
1. ~~Anti-D / rhesus disease prophylaxis~~ — done (GTG22)
2. ~~Shoulder dystocia~~ — done (GTG42)
3. ~~Sepsis in pregnancy and the puerperium~~ — done (GTG64, the current Dec 2024 unified guideline; supersedes the old GTG64a/b split)
4. ~~Placenta accreta spectrum + vasa praevia~~ — done (GTG27a, GTG27b)
5. Postnatal care pathway (NICE NG194)

**P1, high daily-use, currently thin or missing:**
6. ~~Caesarean section~~ — done (NG192)
7. ~~Operative vaginal delivery~~ — done (GTG26, "Assisted Vaginal Birth")
8. Vaginal birth after caesarean
9. Group B Streptococcus in pregnancy
10. Twin and triplet pregnancy (full NG137, upgrading QS46)
11. Obesity in pregnancy
12. Breech presentation at term
13. Perineal trauma / OASI repair
14. Fix the GTG50 cord prolapse orphan (§2)

**P2, completes core obstetric medicine and gynae oncology (currently a hard zero):**
15. Epilepsy in pregnancy
16. Asthma in pregnancy
17. Renal disease in pregnancy
18. Cardiac disease in pregnancy (upgrade TOG flowcharts to a full guideline tier)
19. Ovarian cancer (suspected malignancy, RMI)
20. Endometrial cancer
21. Cervical cancer
22. Vulval cancer

**P3, rounds out gynaecology, sexual health, reproductive medicine:**
23. Ovarian cysts, premenopausal and postmenopausal
24. Menopause (NICE NG23)
25. Urinary incontinence / pelvic organ prolapse
26. Chronic pelvic pain, PMS
27. PCOS, general subfertility assessment
28. Chlamydia, gonorrhoea, syphilis, BV/trichomonas, HIV in pregnancy
29. UKMEC / contraception method choice, emergency contraception
30. Gestational trophoblastic disease
31. Domestic abuse in pregnancy / safeguarding

Each addition should follow the existing pattern end to end (see CLAUDE.md,
"Adding content: registries to update"): sections file in
`packages/guidelines/src`, entry in `guidelines.js` + `readerAvailable.js`,
flowchart(s) where the source guideline has an algorithm, drug/consent
entries where relevant, search synonyms, and a topic page for anything
high-yield enough to deserve one.
