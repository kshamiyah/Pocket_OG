// Thyroid Dysfunction in Pregnancy: assessment & management.
// The hypothyroidism management recommendations (dose increase on a positive
// pregnancy test, TSH target and monitoring schedule) are taken from RCOG
// Green-top Guideline No. 76 (Chan S-Y et al. Management of Thyroid Disorders
// in Pregnancy. BJOG 2025;132(8):e130-e161, DOI 10.1111/1471-0528.18088).
// The hyperthyroid/Graves' branch is still distilled from the TOG review
// (Girling J. Thyroid disease in pregnancy. TOG 2008;10:237-243, DOI
// 10.1576/toag.10.4.237.27440), which is discursive rather than algorithmic.
// Decision support only, not a protocol. Verify against local guidance.

export const TOG_THYROID_FLOWCHART = {
  id: "TOG_THYROID",
  title: "Thyroid Dysfunction in Pregnancy",
  subtitle: "RCOG GTG76 (2025) · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Abnormal Thyroid Function Suspected",
      text: "Always interpret against trimester-specific reference ranges — pregnancy physiology (rising TBG, hCG cross-reactivity with the TSH receptor) shifts normal values. Total T4/T3 are unreliable in pregnancy; use fT4/fT3.",
      items: [
        "Both excess and deficient thyroid hormone mimic normal pregnancy symptoms — biochemistry drives management, not clinical impression alone",
      ],
      next: "pattern",
    },

    "pattern": {
      type: "decision",
      title: "What Does the Biochemistry Show?",
      options: [
        {
          label: "Low fT4, high TSH",
          sublabel: "Hypothyroid pattern",
          next: "hypo",
        },
        {
          label: "Low/suppressed TSH, high fT4",
          sublabel: "Hyperthyroid pattern",
          next: "hyper_context",
        },
      ],
    },

    "hypo": {
      type: "action",
      title: "Hypothyroidism: Classify and Treat",
      text: "Distinguish the category — it determines urgency.",
      items: [
        "Untreated hypothyroidism (often symptomatic) → initiate thyroxine urgently",
        "Previously diagnosed but suboptimally treated → rapid correction, especially important in the first trimester",
        "Subclinical (normal fT4, raised TSH, asymptomatic) → treatment benefit is debated — individualise",
        "Hypothyroxinaemia (low T4, normal TSH) → uncertain significance",
      ],
      next: "hypo_goal",
    },

    "hypo_goal": {
      type: "end",
      title: "Hypothyroidism: Ongoing Management",
      text: "Thyroxine requirements rise in early pregnancy, so a woman with known hypothyroidism needs a prompt dose increase and close monitoring to keep her euthyroid (RCOG GTG76).",
      items: [
        "Aim for euthyroidism before conception; in overt or severe subclinical hypothyroidism, titrate to a preconception TSH of 2.5 mU/L or below (GTG76, Grade B)",
        "Advise her to self-start a dose increase on a positive pregnancy test: double the levothyroxine dose on 2 days of each week (GTG76, Grade A)",
        "Check TSH and fT4 every 4 to 6 weeks until 20 weeks, then again at 28 weeks (GTG76, Grade A)",
        "Aim to keep TSH below 2.5 mU/L, with fT4 within the normal trimester- and manufacturer-specific range (GTG76, Grade C)",
        "Most antenatal care can be midwifery-led if control is optimal and there are no other risk factors",
      ],
    },

    "hyper_context": {
      type: "decision",
      title: "Clinical Context?",
      text: "Distinguishing hCG-driven hyperemesis thyrotoxicosis from Graves' disease changes management completely.",
      options: [
        {
          label: "Severe vomiting, first half of pregnancy",
          sublabel: [
            "Symptoms clearly postdate the pregnancy",
            "No goitre, no eye signs",
            "Tachycardia responds to IV rehydration",
          ],
          next: "hg",
        },
        {
          label: "Features not explained by hyperemesis",
          sublabel: "Goitre, eye signs, symptoms predate pregnancy, or persist despite rehydration",
          next: "graves",
        },
      ],
    },

    "hg": {
      type: "action",
      title: "Likely Hyperemesis-Related (hCG-Driven) Thyrotoxicosis",
      text: "Occurs in over 60% of severe hyperemesis gravidarum — suppressed TSH, high/very high fT4 from hCG's TSH-receptor spillover effect. This is NOT true thyroid disease.",
      items: [
        "No antithyroid medication — there is no intrinsic increase in thyroid activity, and it crosses the placenta, risking fetal hypothyroidism",
        "Absence of thyroid autoantibodies supports hyperemesis (but their presence doesn't exclude it)",
        "Confirm resolution as the hyperemesis settles — typically normalises by ~19–20 weeks",
        "If genuine diagnostic doubt (first-trimester Graves' can present with vomiting): take a detailed history and repeat testing as symptoms resolve",
      ],
      next: "hg_resolve",
    },

    "hg_resolve": {
      type: "end",
      title: "Confirm Resolution",
      items: [
        "Repeat thyroid function as hyperemesis resolves — expect normalisation",
        "If it doesn't normalise, or clinical features suggest Graves', reassess for true thyrotoxicosis",
      ],
    },

    "graves": {
      type: "action",
      title: "Graves' Disease (or Other True Hyperthyroidism)",
      text: "Goal: euthyroidism as early as possible, ideally pre-conception, to minimise maternal and fetal complications.",
      items: [
        "Beta-blockade (propranolol) if needed for tachycardia, tremor or anxiety — maternal/fetal benefit outweighs growth-restriction concerns",
        "Antithyroid drug (carbimazole or propylthiouracil) at the lowest effective dose — both cross the placenta similarly",
        "Clues: failure to gain weight despite good appetite, tachycardia >100 bpm not slowing with Valsalva, onycholysis. Eye signs/pretibial myxoedema do NOT reflect current activity",
        "Warn about agranulocytosis — report a sore throat immediately (not a reason to routinely switch agents)",
        "Radioactive iodine is absolutely contraindicated in pregnancy",
      ],
      next: "graves_monitor",
    },

    "graves_monitor": {
      type: "action",
      title: "Monitor and Titrate",
      items: [
        "Thyroid function monthly when stable, more often if new diagnosis or relapse — titrate antithyroid dose against results",
        "Disease activity typically worsens in the 1st trimester/puerperium and improves in the 2nd–3rd trimester — around a third of women can stop treatment in pregnancy",
        "Most need to restart or increase the dose postnatally to avoid relapse",
        "Measure TSH-receptor antibodies (TRAb) — required in anyone with active Graves' or a past history treated by surgery/radioactive iodine",
      ],
      next: "trab",
    },

    "trab": {
      type: "decision",
      title: "TRAb Result?",
      options: [
        {
          label: "Positive",
          sublabel: "Antibodies cross the placenta",
          next: "fetal_surveillance",
        },
        {
          label: "Negative",
          sublabel: "Continue routine monitoring",
          next: "routine_hyper",
        },
      ],
    },

    "fetal_surveillance": {
      type: "alert",
      title: "Monitor for Fetal Thyrotoxicosis",
      text: "Risk is proportional to TRAb titre (though even at high titres, absolute risk is low). Fetal thyroid can respond to these antibodies from ~20 weeks.",
      items: [
        "Watch for: tachycardia, excessive fetal movements, growth restriction, oligohydramnios, goitre (can cause neck extension/obstructed labour), polyhydramnios, hydrops, intrauterine death",
        "If it develops: deliver if gestation allows, or give high-dose antithyroid drug titrated against fetal heart rate (maternal thyroxine can be added if she becomes clinically hypothyroid — it doesn't cross the placenta)",
        "At delivery, check thyroid function on cord blood",
      ],
      next: "postnatal",
    },

    "routine_hyper": {
      type: "action",
      title: "Continue Routine Antenatal Care",
      items: [
        "Continue monthly monitoring and dose titration as above",
      ],
      next: "postnatal",
    },

    "postnatal": {
      type: "end",
      title: "Postnatal / Neonatal Considerations",
      items: [
        "Consider surgery (2nd trimester) for compression, suspected malignancy or failed medical therapy — experienced thyroid surgeon only",
        "Breastfeeding: split antithyroid doses through the day, feed before a dose where possible, monitor neonatal thyroid function (carbimazole transfers somewhat more than propylthiouracil)",
        "Neonatal hypothyroidism from transplacental antithyroid drugs is usually self-limiting",
        "Neonatal hyperthyroidism can present 7–10 days after birth (once maternal drug clears but TRAb persists) — warn parents to watch for weight loss or poor feeding",
      ],
    },

  },
};
