// Cardiac Arrhythmias & Palpitations in Pregnancy — assessment & management.
// Original interactive pathway synthesised from the TOG review (Roberts A,
// Mechery J, Mechery A, Clarke B, Vause S. Management of palpitations and
// cardiac arrhythmias in pregnancy. TOG 2019;21:263–270, DOI
// 10.1111/tog.12599).
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_ARRHYTHMIAS_PREGNANCY_FLOWCHART = {
  id: "TOG_ARRHYTHMIAS_PREGNANCY",
  title: "Palpitations & Cardiac Arrhythmias in Pregnancy",
  subtitle: "TOG review (Roberts et al. 2019) · assessment & management",
  startId: "start",
  nodes: {

    "start": {
      type: "action",
      title: "Woman Presents with Palpitations",
      text: "Palpitations are common in pregnancy and usually benign — around 50% of women investigated have only ectopic beats or a non-sustained arrhythmia. Those with pre-existing cardiac disease are at highest risk of a true arrhythmia.",
      next: "history",
    },

    "history": {
      type: "action",
      title: "History & Examination",
      items: [
        "Ask: exact sensation, frequency/duration, onset/offset (sudden raises suspicion), triggers, associated syncope/pre-syncope, whether symptoms predate pregnancy, drug/caffeine use",
        "Examine: pulse, BP, respiratory rate, sats, temperature; cardiac auscultation for murmurs; respiratory exam for pulmonary oedema/infection",
      ],
      next: "redflags",
    },

    "redflags": {
      type: "decision",
      title: "Reassuring or Concerning Features?",
      options: [
        {
          label: "Reassuring",
          sublabel: "Fast, regular heartbeat lying down; occasional 'thumping'; pre-vasovagal symptoms",
          next: "reassure",
        },
        {
          label: "Concerning",
          sublabel: [
            "Fast AND irregular; palpitations waking from sleep or at work",
            "Dizziness, shortness of breath, chest pain, syncope",
            "Personal/family history of cardiac disease or sudden death",
          ],
          next: "investigate",
        },
      ],
    },

    "reassure": {
      type: "end",
      title: "Likely Physiological",
      text: "A clear physiological history with no red flags and a normal exam may not need further investigation.",
    },

    "investigate": {
      type: "action",
      title: "Baseline Investigations",
      items: [
        "FBC (exclude anaemia), TFTs (exclude thyrotoxicosis), 12-lead ECG",
      ],
      next: "ecgfindings",
    },

    "ecgfindings": {
      type: "decision",
      title: "ECG Findings?",
      options: [
        { label: "Normal, or expected pregnancy changes", next: "ambulatory" },
        {
          label: "Abnormal",
          sublabel: "Delta wave (WPW), LVH pattern (HCM), QTc >460ms (LQTS)",
          next: "abnormal_ecg",
        },
      ],
    },

    "abnormal_ecg": {
      type: "alert",
      title: "Specific Pathology Suspected",
      text: "Seek a cardiology second opinion and manage per the suspected diagnosis.",
      next: "diagnosis",
    },

    "ambulatory": {
      type: "action",
      title: "Ambulatory Monitoring",
      items: [
        "Holter monitor (24–72h) is most used — diagnostic yield for a clinically significant arrhythmia is only 3–24% since symptoms are often infrequent",
        "Event recorder for infrequent symptoms",
        "Echocardiogram if: diagnosed arrhythmia, audible murmur, concerning history, known structural disease, or family history of inherited arrhythmia",
      ],
      next: "diagnosis",
    },

    "diagnosis": {
      type: "decision",
      title: "What's the Diagnosis?",
      options: [
        { label: "Sinus tachycardia / ectopic beats", next: "benign" },
        { label: "Supraventricular tachycardia (SVT)", next: "svt" },
        { label: "Atrial fibrillation / flutter", next: "af" },
        { label: "Ventricular tachycardia (VT)", next: "vt" },
        { label: "Long QT syndrome", next: "lqts" },
        { label: "Bradyarrhythmia", next: "brady" },
      ],
    },

    "benign": {
      type: "end",
      title: "Benign: Reassure",
      text: "Sinus tachycardia and ectopic beats are common and benign; treatment is not usually required. Consider inappropriate sinus tachycardia or POTS as alternative diagnoses if persistent.",
    },

    "svt": {
      type: "action",
      title: "SVT Management",
      text: "The most common non-benign arrhythmia in pregnancy (~24 per 100,000).",
      items: [
        "Vagal manoeuvres first-line",
        "IV adenosine if that fails — terminates ~90% of SVT, safe under monitoring",
        "Alternatives if compromised: verapamil, metoprolol, or DC cardioversion",
        "Beta-blockers for prophylaxis; catheter ablation isn't usually recommended in pregnancy",
      ],
      next: "mdt_plan",
    },

    "af": {
      type: "action",
      title: "Atrial Fibrillation / Flutter",
      text: "Uncommon in pregnancy — usually reflects underlying pathology (mitral stenosis, electrolyte/metabolic disturbance). Investigate the underlying cause.",
      items: [
        "Anticoagulate persistent AF — usually LMWH, MDT with cardiology/haematology",
        "DC cardioversion first-line if haemodynamically compromised",
        "IV flecainide or ibutilide preferred pharmacologically in a structurally normal heart",
        "Beta-blockers first-line for rate control",
      ],
      next: "mdt_plan",
    },

    "vt": {
      type: "action",
      title: "Ventricular Tachycardia",
      text: "Exclude structural heart disease/channelopathy first.",
      items: [
        "Idiopathic RVOT VT responds to beta-blockade or verapamil",
        "Haemodynamically unstable → electrical cardioversion (safe, no evidence of fetal harm)",
        "Stable → pharmacological cardioversion (sotalol/flecainide) guided by the underlying cause",
        "Prophylaxis: beta-blockers, amiodarone, or an implantable cardioverter-defibrillator",
      ],
      next: "mdt_plan",
    },

    "lqts": {
      type: "alert",
      title: "Long QT Syndrome",
      text: "Cardiac events are less common during pregnancy but rise significantly postpartum, particularly in type 2 LQTS — compounded by sleep deprivation and missed medication doses with a newborn.",
      items: [
        "Continue beta-blockers throughout AND after pregnancy",
        "Avoid QT-prolonging drugs and electrolyte disturbance — commonly-prescribed culprits include prochlorperazine, ondansetron, trimethoprim, erythromycin",
        "Hyperemesis is high-risk (vomiting → non-adherence + electrolyte disturbance)",
        "LQTS is linked to sudden infant death — arrange neonatal review before discharge and a genetics referral for the baby",
      ],
      next: "mdt_plan",
    },

    "brady": {
      type: "end",
      title: "Bradyarrhythmia",
      text: "Rare in pregnancy, usually well tolerated.",
      items: [
        "First-degree block and Wenkebach are usually benign",
        "Complete heart block: pace if symptomatic (temporary for delivery, or permanent — safe in pregnancy)",
      ],
    },

    "mdt_plan": {
      type: "end",
      title: "Ongoing MDT Management",
      items: [
        "Preconception: condition-specific risk counselling, medication review, optimise control, consider accessory-pathway ablation before pregnancy",
        "Antenatal: medication review, growth scans if on beta-blockers, anaesthetic review, birth planning",
        "Intrapartum: vaginal birth usually recommended; continuous cardiac monitoring if high-risk; care plan specifying available drugs/facilities and drugs to avoid",
        "Postnatal: inpatient monitoring period; some conditions (e.g. LQTS) carry high postnatal risk; plan medication/breastfeeding; arrange ongoing cardiology follow-up",
      ],
    },

  },
};
