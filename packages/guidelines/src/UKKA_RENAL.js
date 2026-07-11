// UKKA_RENAL — Clinical Practice Guideline on Pregnancy and Renal Disease
// (UK Kidney Association / Renal Association, September 2019)

export const UKKA_RENAL_SECTIONS = [
  {
    id: "ukka-renal-risk-preconception",
    gl: "UKKA_RENAL",
    condition: "Renal Disease in Pregnancy",
    setting: "Preconception / Antenatal",
    title: "Risk Stratification & Preconception Counselling",
    tags: [
      "ckd pregnancy", "chronic kidney disease pregnancy", "renal disease pregnancy risk",
      "proteinuria pregnancy", "creatinine pregnancy",
    ],
    content: [
      { type: "text", value: "Chronic kidney disease (CKD) affects around 3% of pregnant women in high-income countries — roughly 15,000–20,000 pregnancies a year in England. Outcomes track closely with baseline kidney function, not just the underlying diagnosis." },
      { type: "alert", value: "The strongest predictors of a poor pregnancy outcome are hypertension, a raised serum creatinine, and significant proteinuria at booking — not the specific renal diagnosis. Use these three findings to judge risk, and to decide how intensively to monitor, more than the label of the underlying kidney disease." },
      { type: "list", items: [
        "Pre-eclampsia, fetal growth restriction, preterm birth, and accelerated loss of maternal renal function are all more likely with CKD — discuss this explicitly before conception where possible.",
        "Offer preconception counselling whenever the opportunity arises — reviewing current renal function, blood pressure control, proteinuria, and medication safety before pregnancy is far more useful than reacting once pregnant.",
        "Aspirin 75-150mg from 12 weeks for pre-eclampsia prevention applies here as it does for other high-risk groups (see NG133) — CKD itself is a recognised high-risk factor.",
      ]},
    ],
  },

  {
    id: "ukka-renal-medications",
    gl: "UKKA_RENAL",
    condition: "Renal Disease in Pregnancy",
    setting: "Preconception / Antenatal",
    title: "Medication Safety & Switching",
    tags: [
      "ace inhibitor pregnancy", "arb pregnancy", "renal medication pregnancy",
      "immunosuppression pregnancy", "mycophenolate pregnancy",
    ],
    content: [
      { type: "alert", value: "ACE inhibitors and angiotensin receptor blockers (ARBs) are teratogenic and should be stopped before conception wherever possible, or as soon as pregnancy is confirmed if conception wasn't planned — switch to an antihypertensive with a safety record in pregnancy rather than simply stopping treatment." },
      { type: "list", items: [
        "Medicines with a good pregnancy safety record for CKD: low-dose aspirin, LMWH, labetalol, nifedipine, methyldopa, prednisolone, azathioprine, ciclosporin, tacrolimus, hydroxychloroquine.",
        "Mycophenolate mofetil/mycophenolic acid is teratogenic — stop at least 6 weeks before conception (allow longer where possible) and switch to an alternative agent such as azathioprine under specialist guidance. Do not stop abruptly without a replacement plan — graft or disease-control risk matters as much as the teratogenic risk.",
      ]},
      { type: "subheading", value: "Renal transplant recipients" },
      { type: "list", items: [
        "The generally recommended window to conceive is 1–2 years post-transplant, once graft function is stable, proteinuria is minimal, and there's been no recent rejection episode.",
        "Maintenance immunosuppression compatible with pregnancy: calcineurin inhibitors (tacrolimus, ciclosporin), azathioprine, low-dose prednisolone.",
        "Pre-eclampsia risk is substantially higher after transplant (around a fifth to a third of pregnancies, versus a few percent in the general obstetric population) — low-dose aspirin is recommended for all pregnant transplant recipients, not just those with additional risk factors.",
      ]},
    ],
  },

  {
    id: "ukka-renal-monitoring",
    gl: "UKKA_RENAL",
    condition: "Renal Disease in Pregnancy",
    setting: "Antenatal",
    title: "Antenatal Monitoring & the Pre-Eclampsia Overlap Problem",
    tags: [
      "ckd monitoring pregnancy", "superimposed pre-eclampsia ckd", "joint renal obstetric clinic",
      "dialysis pregnancy",
    ],
    content: [
      { type: "alert", value: "Distinguishing superimposed pre-eclampsia from a flare or natural progression of underlying renal disease is genuinely difficult — both can cause worsening hypertension and proteinuria. Don't expect a clean answer; involve joint renal-obstetric input early and monitor trends (rate of change) rather than relying on a single reading." },
      { type: "list", items: [
        "Joint care with a renal-obstetric clinic for any woman with significant CKD, not just those already under a nephrologist for an unrelated reason.",
        "More frequent blood pressure, proteinuria and renal function monitoring than a standard antenatal schedule — the exact interval depends on baseline severity and should be individualised with the joint clinic.",
        "Serial growth scans, given the increased risk of fetal growth restriction.",
        "Pregnancy on dialysis is high-risk but achievable with intensified dialysis (more frequent/longer sessions) under specialist nephrology-obstetric care — this needs planning in a centre experienced in the combination, not an incidental add-on to a standard dialysis schedule.",
      ]},
    ],
  },
];
