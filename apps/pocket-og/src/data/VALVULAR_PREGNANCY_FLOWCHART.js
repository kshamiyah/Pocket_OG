// Valvular Heart Disease in Pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review (Timmons P,
// Partridge G, McKelvey A, Lyall H, Morosan M, Freeman L. Valvular heart
// disease in pregnancy. TOG 2023;25:19–27, DOI 10.1111/tog.12857).
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_VALVULAR_PREGNANCY_FLOWCHART = {
  id: "TOG_VALVULAR_PREGNANCY",
  title: "Valvular Heart Disease in Pregnancy",
  subtitle: "TOG review (Timmons et al. 2022/23) · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Known Valvular Heart Disease — Pre-Conception Assessment",
      text: "As a rule, regurgitant lesions are better tolerated than stenotic lesions, and right-sided lesions better than left-sided.",
      items: [
        "Assess with the modified WHO (mWHO) classification (I–IV) and NYHA functional class",
        "Baseline ECG, echocardiogram, and exercise tolerance test where appropriate",
      ],
      next: "lesiontype",
    },

    "lesiontype": {
      type: "decision",
      title: "Stenotic or Regurgitant?",
      options: [
        { label: "Stenotic lesion", next: "stenotic_type" },
        { label: "Regurgitant lesion", next: "regurgitant_mgmt" },
      ],
    },

    "stenotic_type": {
      type: "decision",
      title: "Which Stenotic Lesion?",
      options: [
        { label: "Mitral stenosis", next: "mitral_stenosis" },
        { label: "Aortic stenosis", next: "aortic_stenosis" },
      ],
    },

    "mitral_stenosis": {
      type: "action",
      title: "Mitral Stenosis",
      text: "Heart failure risk by severity: mild (valve area >1.5cm²) usually well tolerated; moderate (1.0–1.5cm²) ~1 in 3; severe (<1.0cm²) ~1 in 2.",
      items: [
        "Even asymptomatic severe mitral stenosis → counsel against pregnancy, effective contraception (typically LARC), optimise with prepregnancy balloon valvotomy or replacement",
        "Predictors of complications: NYHA ≥II, systolic PA pressure >30mmHg, severe stenosis, advanced maternal age",
        "Antenatal: review each trimester if mild/asymptomatic, at least monthly if severe/symptomatic. Anticoagulate (LMWH) if moderate-severe stenosis, LA enlargement ≥60mL/m², prior embolism/LA thrombus, or CCF",
        "Surgery in pregnancy reserved for NYHA III/IV or PA pressure ≥50mmHg despite medical therapy — percutaneous balloon mitral valvuloplasty is the intervention of choice",
      ],
      next: "onvalve",
    },

    "aortic_stenosis": {
      type: "action",
      title: "Aortic Stenosis",
      text: "Defined as antegrade valve velocity ≥2.0 m/s. A physiological rise in the echo gradient during pregnancy is normal — its absence should raise concern for a failing left ventricle, not reassure.",
      items: [
        "Asymptomatic pre-pregnancy → heart failure risk <10% (vs 25% if symptomatic). Bruce protocol exercise test + NT-proBNP help risk-stratify pre-conception",
        "Symptomatic/severe, reduced exercise tolerance, or impaired LV function → counsel against pregnancy, offer contraception and surgical treatment",
        "Antenatal review monthly-to-bimonthly if severe. Medical: reduce activity, beta-blockers/diuretics for incipient failure",
        "Surgical: percutaneous valvuloplasty for severe symptoms despite maximal medical therapy; if not feasible with life-threatening symptoms, consider termination or early delivery followed by valve surgery",
      ],
      next: "onvalve",
    },

    "regurgitant_mgmt": {
      type: "action",
      title: "Regurgitant Lesion (Mitral / Aortic)",
      text: "Mild disease is usually well tolerated (peripheral vasodilatation reduces afterload).",
      items: [
        "Moderate-severe, symptomatic, or impaired LV function → higher heart failure risk (20–25%); FGR in 5–10%",
        "Medical: diuretics for fluid overload",
        "Surgical: repair ideally pre-pregnancy; acute severe regurgitation refractory to medical therapy may need surgery in pregnancy — delivery should ideally precede this",
      ],
      next: "onvalve",
    },

    "onvalve": {
      type: "decision",
      title: "On a Mechanical Prosthetic Valve?",
      options: [
        { label: "Yes — mechanical valve", next: "mechanical_valve" },
        { label: "No — native valve or bioprosthesis", next: "delivery_plan" },
      ],
    },

    "mechanical_valve": {
      type: "alert",
      title: "Anticoagulation Strategy — Individualised MDT Decision",
      text: "Warfarin is most effective at preventing valve thrombosis but is teratogenic; LMWH doesn't cross the placenta but carries a higher maternal thromboembolic risk (~10%). No strategy eliminates risk to both mother and fetus.",
      items: [
        "VKA throughout: continue warfarin; switch to twice-daily LMWH ~2 weeks before delivery",
        "LMWH 1st trimester, VKA 2nd/3rd: switch to LMWH before 6 weeks; restart warfarin after 12 weeks; switch back to LMWH before delivery",
        "LMWH throughout: switch after a positive pregnancy test, continue to delivery",
        "Warfarin embryopathy risk rises markedly above a dose of 5mg/day — factor this into the choice. Monitor LMWH with peak/trough anti-Xa levels (peak target 0.8–1.2 IU/mL)",
      ],
      next: "delivery_plan",
    },

    "delivery_plan": {
      type: "action",
      title: "Delivery Planning",
      items: [
        "Individualised MDT plan; mild/moderate dysfunction not on anticoagulation → normal vaginal delivery usually appropriate",
        "Instrumental delivery to shorten the second stage if severe hypertension or a poorly-tolerated Valsalva is anticipated",
        "Plan delivery timing for safe peripartum anticoagulation — avoid a prolonged induction in a high thrombosis-risk woman; caesarean allows more predictable anticoagulation control",
        "Emergency delivery within 2 weeks of warfarin → caesarean preferred (neonatal intracranial bleeding risk)",
      ],
      next: "third_stage",
    },

    "third_stage": {
      type: "action",
      title: "Third Stage & Postpartum",
      items: [
        "Continuous BP/pulse monitoring — arterial line if severe disease",
        "Diuretics may be needed in severe mitral stenosis to prevent autotransfusion-induced pulmonary oedema; avoid volume depletion in aortic stenosis",
        "Oxytocic choice: concentrated oxytocin infusion preferred. Avoid ergometrine in arrhythmia/aortic-dissection risk; avoid carboprost in asthma or raised PA pressure",
        "Resume anticoagulation as soon as safely possible postpartum to minimise thromboembolic risk",
      ],
      next: "endresult",
    },

    "endresult": {
      type: "end",
      title: "Ongoing Care",
      items: [
        "Endocarditis prophylaxis is no longer routinely recommended beyond standard caesarean antibiotics, except with a personal history of infective endocarditis",
        "Lactation is safe, including on warfarin (present in milk only as an inactive metabolite)",
        "Contraception planning is essential — LARC/IUD are good options; combined oral contraceptives are usually avoided (prothrombotic)",
      ],
    },

  },
};
