// Congenital Heart Disease in Pregnancy — risk stratification & management.
// Original interactive pathway synthesised from the TOG review (Gelson E,
// Johnson M, Gatzoulis M, Uebing A. Cardiac disease in pregnancy. Part 1:
// congenital heart disease. TOG 2007;9:15–20, DOI 10.1576/toag.9.1.015.27291).
// The source article is discursive with risk tables (Box 1/2) rather than a
// single figure — this pathway distils its risk-predictor and lesion-specific
// guidance into one decision tree.
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_CHD_PREGNANCY_FLOWCHART = {
  id: "TOG_CHD_PREGNANCY",
  title: "Congenital Heart Disease in Pregnancy",
  subtitle: "TOG review (Gelson et al. 2007, Part 1) · risk & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Known or Suspected Congenital Heart Disease",
      text: "Ideally a planned pregnancy managed by a multidisciplinary team (obstetrics, cardiology, anaesthetics, neonatology, midwifery).",
      items: [
        "Prepregnancy counselling: explain risk to mother and fetus, and the chance of congenital heart disease in the baby",
      ],
      next: "predictors",
    },

    "predictors": {
      type: "decision",
      title: "Any High-Risk Predictors Present?",
      text: "Any of these raise the risk of a maternal cardiac event or an adverse neonatal event.",
      options: [
        {
          label: "Yes — one or more present",
          sublabel: [
            "Prior cardiac event/arrhythmia; NYHA class >II or cyanosis",
            "Left heart obstruction (mitral valve area <2cm², aortic valve area <1.5cm², or gradient >30mmHg)",
            "Reduced LV function (ejection fraction <40%)",
          ],
          next: "high_risk_predictor",
        },
        { label: "No", sublabel: "Proceed to lesion-specific risk", next: "lesion_category" },
      ],
    },

    "high_risk_predictor": {
      type: "alert",
      title: "Increased Risk of a Cardiac Event",
      text: "Refer to (or increase input from) the tertiary cardiac-obstetric MDT — more frequent surveillance is warranted.",
      next: "lesion_category",
    },

    "lesion_category": {
      type: "decision",
      title: "Which Lesion Category?",
      options: [
        {
          label: "Low risk",
          sublabel: "Small L–R shunts, repaired coarctation, repaired tetralogy of Fallot",
          next: "low_risk",
        },
        {
          label: "Moderate risk",
          sublabel: "TGA (post-repair), cyanotic disease without pulmonary hypertension, Fontan circulation",
          next: "moderate_risk",
        },
        {
          label: "High risk",
          sublabel: "Marfan syndrome with aortic dilatation, pulmonary vascular disease/pulmonary hypertension",
          next: "high_risk",
        },
      ],
    },

    "low_risk": {
      type: "action",
      title: "Low-Risk Lesions",
      items: [
        "Small ASD/VSD/PDA: well tolerated absent pulmonary hypertension. ASDs → low threshold for heparin prophylaxis (atrial arrhythmia/paradoxical embolism risk); labour needs care as blood loss or regional-anaesthesia vasodilatation can alter shunt direction",
        "Repaired coarctation: assess pre-conception for re-coarctation, repair-site aneurysm, bicuspid valve, hypertension. Control BP tightly (beta-blockers first-line); monitor fetal growth",
        "Repaired tetralogy of Fallot: watch for arrhythmia/RV failure, especially with residual shunts or RVOT obstruction. Echo before pregnancy; regular review; consider diuretics/bed rest for pulmonary regurgitation symptoms",
      ],
      next: "labour_plan",
    },

    "moderate_risk": {
      type: "action",
      title: "Moderate-Risk Lesions",
      items: [
        "TGA post-Mustard/Senning repair: usually tolerated if uncomplicated; poorly tolerated with long-term complications. Stop ACE inhibitors before conception",
        "Cyanotic heart disease without pulmonary hypertension: falling SVR + rising cardiac output worsen right-to-left shunting and hypoxia. Maternal hypoxaemia severity is the strongest predictor of neonatal outcome — bed rest and oxygen therapy help",
        "Fontan circulation: maternal risk is low in NYHA I–II with good ventricular function; watch for poorly-tolerated atrial arrhythmias",
      ],
      next: "labour_plan",
    },

    "high_risk": {
      type: "alert",
      title: "High-Risk Lesions",
      items: [
        "Marfan syndrome: mortality ~1% if aortic root <4cm, up to 25% if >4cm. Postpone pregnancy until aortic arch replacement if the root is dilated; discuss termination for an unplanned pregnancy in this context. Serial echocardiograms, prophylactic beta-blockade if dilating, aggressive BP control",
        "Pulmonary vascular disease/pulmonary hypertension: very high risk — mortality varies by cause (Eisenmenger 36%, primary pulmonary hypertension 30%, secondary 56%). Offer termination for an unplanned pregnancy; if continuing, close monitoring and bed rest from the third trimester, surveillance to 14 days postpartum",
      ],
      next: "labour_plan",
    },

    "labour_plan": {
      type: "action",
      title: "Labour & Delivery Planning",
      items: [
        "Vaginal delivery with low-dose epidural is the mode of choice; forceps/ventouse can shorten the second stage",
        "Caesarean reserved for: aortopathy with aortic root >4cm, aortic dissection/aneurysm, or warfarin within the last 2 weeks",
        "Antibiotic prophylaxis for all except repaired PDA, isolated ostium secundum ASD, or mitral valve prolapse without regurgitation",
        "Third stage: avoid oxytocin bolus (use a low-dose infusion) and avoid ergometrine (acute hypertension); uterine compression sutures for atony at caesarean",
      ],
      next: "postpartum",
    },

    "postpartum": {
      type: "end",
      title: "Postpartum Surveillance",
      items: [
        "Haemodynamic monitoring 24–72 hours typically, extended to 10–14 days with pulmonary hypertension",
        "Multidisciplinary follow-up at 6 weeks",
        "Counsel on offspring recurrence risk: 3–5% overall (vs 1% general population), up to 10% for ASD/coarctation/aortic stenosis, 50% for Marfan syndrome (autosomal dominant)",
      ],
    },

  },
};
