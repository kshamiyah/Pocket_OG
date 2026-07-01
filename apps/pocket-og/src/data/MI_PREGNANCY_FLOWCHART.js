// Myocardial Infarction in Pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review (Wuntakal R,
// Shetty N, Ioannou E, Sharma S, Kurian J. Myocardial infarction and
// pregnancy. TOG 2013;15:247–255, DOI 10.1111/tog.12052).
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_MI_PREGNANCY_FLOWCHART = {
  id: "TOG_MI_PREGNANCY",
  title: "Myocardial Infarction in Pregnancy",
  subtitle: "TOG review (Wuntakal et al. 2013) · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Chest Pain / Suspected Acute Coronary Syndrome",
      text: "Keep a low threshold — the relative risk of MI is 3–4× higher in pregnancy, up to 50% occur peripartum, and symptoms are easily attributed to normal pregnancy.",
      items: [
        "Investigate epigastric pain, vomiting or dizziness alongside chest pain, especially with risk factors",
        "Risk factors: parity >3, maternal age >35, pre-existing hypertension/diabetes/IHD, smoking, obesity, family history, pre-eclampsia, thrombophilia",
      ],
      next: "investigate",
    },

    "investigate": {
      type: "action",
      title: "Initial Investigations",
      items: [
        "Serial ECGs — a single ECG can be normal; 12-lead sensitivity for ischaemia is as low as ~50%",
        "Troponin I/T (biomarker of choice) — never above normal in healthy pregnancy/labour/caesarean, unlike CK/myoglobin. A negative troponin at presentation doesn't exclude damage (can take 12h to peak)",
        "Echocardiogram — safe in pregnancy, excludes aortic dissection, assesses LV function/wall motion",
      ],
      next: "classify",
    },

    "classify": {
      type: "decision",
      title: "ECG / Clinical Picture?",
      options: [
        { label: "ST elevation (STEMI)", next: "stemi" },
        { label: "No ST elevation but ongoing ischaemia/high-risk features (NSTEMI)", next: "nstemi" },
        { label: "Non-diagnostic but suspicion remains", next: "further_ix" },
      ],
    },

    "further_ix": {
      type: "action",
      title: "Further Investigation",
      text: "Coronary angiography is safe in pregnancy and aids both diagnosis and treatment.",
      items: [
        "Reassure re: radiation — diagnostic doses in this context (angiography ~1.5mGy fetal, PCI ~3mGy fetal) are well below the 50mGy threshold for fetal harm",
        "Use radial access, shield the abdomen, minimise fluoroscopy time",
      ],
      next: "cause",
    },

    "stemi": {
      type: "action",
      title: "STEMI Management",
      items: [
        "Primary PCI is the treatment of choice — bare metal stents preferred over drug-eluting (lack of pregnancy safety data)",
        "Thrombolysis (IV t-PA, doesn't cross the placenta) is reasonable if PCI would be significantly delayed — carries an ~8% maternal haemorrhage risk",
      ],
      next: "cause",
    },

    "nstemi": {
      type: "action",
      title: "NSTEMI Management",
      items: [
        "First-line: antiplatelet therapy",
        "Angiography with a view to stenting if symptoms continue despite medical therapy, or with haemodynamic instability",
        "MDT discussion if symptoms settle but high-risk features remain",
      ],
      next: "cause",
    },

    "cause": {
      type: "decision",
      title: "Likely Cause?",
      text: "Angiography series show roughly half of pregnancy-associated MI is atherosclerotic — the rest is dissection, thrombosis or spasm.",
      options: [
        {
          label: "Atherosclerotic",
          sublabel: "Cardiovascular risk factors present",
          next: "meds",
        },
        {
          label: "Non-atherosclerotic suspected",
          sublabel: "Especially if no cardiovascular risk factors",
          next: "nonathero",
        },
      ],
    },

    "nonathero": {
      type: "alert",
      title: "Consider Non-Atherosclerotic Causes",
      items: [
        "Coronary artery dissection — highest risk 3rd trimester to 3 months postpartum; ~80% affect the LAD; mortality 30–40%",
        "Coronary artery thrombosis — 8–14% of cases; pregnancy's hypercoagulable state or underlying hereditary thrombophilia",
        "Coronary artery spasm — spontaneous, or drug-induced (terbutaline, ergotamine, bromocriptine, cocaine)",
        "Other: vasculitis (e.g. Kawasaki disease), collagen vascular disease, amniotic fluid embolism, phaeochromocytoma",
      ],
      next: "meds",
    },

    "meds": {
      type: "action",
      title: "Medical Management",
      items: [
        "Can use safely: low-dose aspirin (60–150mg), heparin (LMWH/UFH — don't cross placenta, stop 24h before induction), labetalol, nifedipine (but avoid immediately after an acute event — increases mortality)",
        "Limited use only: clopidogrel — shortest duration possible",
        "Contraindicated: statins, ACE inhibitors, ARBs",
      ],
      next: "delivery",
    },

    "delivery": {
      type: "action",
      title: "Timing & Mode of Delivery",
      text: "No standardised guidelines — individualise via MDT (cardiologist, obstetric physician, obstetrician, anaesthetist, neonatologist).",
      items: [
        "Where possible, delay delivery by 2–3 weeks after the MI — maternal mortality risk is highest in the immediate aftermath",
        "Neither vaginal nor caesarean delivery raises mortality — choose on obstetric/maternal grounds",
        "If vaginal: epidural analgesia, left lateral position, continuous cardiac + fetal monitoring, shorten the second stage with instrumental delivery",
        "Third stage: slow IV oxytocin infusion (<2 U/min). Ergometrine is contraindicated — risk of coronary artery spasm",
      ],
      next: "postnatal",
    },

    "postnatal": {
      type: "end",
      title: "Postnatal Care",
      items: [
        "HDU/ICU monitoring for at least 24–48 hours",
        "Thromboembolic risk assessment",
        "Arrange cardiology follow-up",
        "Future pregnancy and contraception advice depends on the underlying cause and residual cardiac function",
      ],
    },

  },
};
