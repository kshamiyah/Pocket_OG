// Acquired Heart Disease & Arrhythmias in Pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review (Gelson E,
// Johnson M, Gatzoulis M, Uebing A. Cardiac disease in pregnancy. Part 2:
// acquired heart disease. TOG 2007;9:83–87, DOI 10.1576/toag.9.2.083.27308).
// The source article is discursive rather than algorithmic — this pathway
// distils its valvular, ischaemic, arrhythmia and cardiomyopathy guidance
// into one triage tree.
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_ACQUIRED_CARDIAC_FLOWCHART = {
  id: "TOG_ACQUIRED_CARDIAC",
  title: "Acquired Heart Disease & Arrhythmias in Pregnancy",
  subtitle: "TOG review (Gelson et al. 2007, Part 2) · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "decision",
      title: "What's the Clinical Picture?",
      options: [
        { label: "Known or suspected valvular heart disease", next: "valvular" },
        { label: "Chest pain / suspected ischaemia", next: "ischaemic" },
        { label: "Palpitations / arrhythmia", next: "arrhythmia" },
        { label: "Heart failure / suspected cardiomyopathy", next: "cardiomyopathy" },
      ],
    },

    "valvular": {
      type: "decision",
      title: "Which Valve Lesion?",
      options: [
        { label: "Mitral stenosis", next: "mitral_stenosis" },
        { label: "Aortic stenosis", next: "aortic_stenosis" },
        { label: "Regurgitant lesion (MR / MVP / AR)", next: "regurgitant" },
        { label: "Mechanical prosthetic valve", next: "mechanical_valve" },
      ],
    },

    "mitral_stenosis": {
      type: "action",
      title: "Mitral Stenosis",
      items: [
        "NYHA III/IV or valve area <1cm² → delay conception until after correction",
        "Medical therapy: bed rest and diuretics to reduce volume overload; beta-blockade to optimise ventricular filling",
        "Atrial fibrillation: prompt DC cardioversion, beta-blockers or digoxin",
        "Balloon mitral valvuloplasty is safe and effective if symptoms are refractory to medical therapy",
      ],
      next: "endocarditis",
    },

    "aortic_stenosis": {
      type: "action",
      title: "Aortic Stenosis",
      items: [
        "Symptomatic, severe (peak gradient >80mmHg), or LV dysfunction → delay conception until after correction",
        "Symptomatic in pregnancy: bed rest, consider valve replacement",
        "Avoid cardiopulmonary bypass where possible — 1.5–5% maternal mortality, 16–33% fetal mortality regardless of gestation (fetal mortality can fall to 10% by avoiding hypothermia and maintaining perfusion pressure)",
        "Aortic balloon valvuloplasty can palliate, deferring valve replacement until after delivery",
      ],
      next: "endocarditis",
    },

    "regurgitant": {
      type: "action",
      title: "Regurgitant Lesion (MR / MVP / AR)",
      text: "Generally well tolerated in pregnancy — the fall in systemic vascular resistance reduces afterload.",
      items: [
        "Asymptomatic: no treatment needed",
        "Symptomatic heart failure: nitrates, hydralazine, diuretics, digoxin",
      ],
      next: "endocarditis",
    },

    "mechanical_valve": {
      type: "alert",
      title: "Mechanical Prosthetic Valve — Anticoagulation Trade-off",
      text: "45% thrombotic-episode incidence, 1–4% maternal mortality if under-anticoagulated. Every regimen carries real risk — this needs an informed discussion.",
      items: [
        "Warfarin throughout, stop at 38 weeks for elective LSCS: 4% maternal thromboembolism, 6% fetal abnormality, ~30% fetal loss",
        "LMWH weeks 6–12 then warfarin to 38 weeks then LSCS: 9% thromboembolism, 0% fetal abnormality, ~30% fetal loss",
        "LMWH throughout pregnancy: 25% thromboembolism, 0% fetal abnormality, ~30% fetal loss",
        "Low-dose aspirin often added to heparin; monitor LMWH with monthly anti-factor Xa levels, aiming for the high therapeutic range",
      ],
      next: "endocarditis",
    },

    "endocarditis": {
      type: "end",
      title: "Endocarditis Prophylaxis",
      text: "Give antibiotics in labour/delivery for all valvular lesions except mitral valve prolapse without regurgitation.",
    },

    "ischaemic": {
      type: "end",
      title: "Suspected Acute Myocardial Infarction",
      text: "Rare in pregnancy (1 in 10,000) but carries 37–50% maternal mortality, mostly at the time of infarction.",
      items: [
        "Treat exactly as outside pregnancy: heparin, beta-blockers, nitrates",
        "Coronary angiography is safe; percutaneous catheter intervention is first-line",
        "Thrombolysis can cause placental-site bleeding but remains indicated when needed",
      ],
    },

    "arrhythmia": {
      type: "decision",
      title: "Haemodynamically Stable?",
      text: "Risk of arrhythmia is highest during labour and delivery.",
      options: [
        { label: "Stable SVT", next: "svt_stable" },
        { label: "Stable VT", next: "vt_stable" },
        { label: "Unstable — any tachyarrhythmia", next: "unstable" },
      ],
    },

    "svt_stable": {
      type: "end",
      title: "Stable SVT",
      items: [
        "Vagal manoeuvre first",
        "IV adenosine is safe if that fails",
        "Second-line: digoxin, beta-blockers or calcium-channel blockers",
        "Atrial fibrillation/flutter needs prompt rate or rhythm control — thromboembolism and fetal risk",
      ],
    },

    "vt_stable": {
      type: "end",
      title: "Stable VT",
      text: "Usually reflects underlying structural heart disease.",
      items: [
        "Lidocaine or procainamide",
        "Beta-blockers or sotalol used prophylactically",
        "Amiodarone is contraindicated — fetal hypothyroidism, growth restriction, prematurity",
      ],
    },

    "unstable": {
      type: "alert",
      title: "Unstable Tachyarrhythmia",
      text: "Electrical cardioversion is safe in pregnancy and necessary for any haemodynamically unstable tachyarrhythmia.",
      items: [
        "Manage the airway carefully — aspiration/regurgitation risk",
        "Avoid the supine position — aortocaval compression",
      ],
    },

    "cardiomyopathy": {
      type: "decision",
      title: "Which Type?",
      options: [
        { label: "Dilated cardiomyopathy", next: "dilated" },
        { label: "Hypertrophic cardiomyopathy", next: "hypertrophic" },
        { label: "New — last month of pregnancy or postpartum", next: "peripartum" },
      ],
    },

    "dilated": {
      type: "alert",
      title: "Dilated Cardiomyopathy",
      text: "Poorly tolerated in pregnancy — 7% mortality with NYHA III/IV; risk of heart failure, irreversible LV dysfunction and fetal loss.",
      items: [
        "Counsel on these risks",
        "Offer termination for an unplanned pregnancy",
      ],
    },

    "hypertrophic": {
      type: "end",
      title: "Hypertrophic Cardiomyopathy",
      text: "Usually well tolerated if asymptomatic before pregnancy.",
      items: [
        "Risk of symptomatic progression, atrial fibrillation, syncope and maternal death if there was pre-existing heart failure or severe symptoms",
      ],
    },

    "peripartum": {
      type: "action",
      title: "Suspected Peripartum Cardiomyopathy",
      text: "LV systolic dysfunction/heart failure in the last month of pregnancy to 5 months postpartum. Rare (~1 in 2,289 live births) — a diagnosis of exclusion.",
      items: [
        "Exclude other causes of dilated cardiomyopathy with heart failure first",
        "Treat: beta-blockers, diuretics, hydralazine, digoxin (switch to ACE inhibitors postpartum)",
      ],
      next: "peripartum_outcome",
    },

    "peripartum_outcome": {
      type: "end",
      title: "Outcome & Future Pregnancy",
      items: [
        "~20% die or need transplantation; the rest recover partially or fully",
        "A future pregnancy carries a higher relapse risk if LV function hasn't fully recovered — some residual risk remains even after full recovery",
        "No consensus on recommendations for future pregnancies",
      ],
    },

  },
};
