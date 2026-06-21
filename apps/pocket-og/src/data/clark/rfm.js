export const RFM_PROTOCOL = {
  id: "rfm",
  title: "Reduced Fetal Movements",
  subtitle: "RFM — Assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG57",
  color: "blue",
  startId: "history",
  nodes: {

    "history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Cover these key areas",
      alert: "RFM is the presenting symptom in ~50% of IUFDs — always take seriously regardless of perceived cause",
      items: [
        "Duration and character of RFM — reduced, absent, or changed pattern",
        "Whether movements have ever been felt at all",
        "Any preceding period of excessive or vigorous movements",
        "Anterior placenta — reduces perception but does not remove risk",
        "Risk factors for FGR/stillbirth: smoking, hypertension, diabetes, obesity",
        "Prior SGA, stillbirth, or recurrent RFM (≥2 episodes within 21 days = higher risk)",
        "Medications crossing the placenta: opioids, benzodiazepines; alcohol use",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BP, HR, temperature",
        "Symphysis-fundal height (SFH) — plot on customised growth chart",
        "Urinalysis — protein, glucose",
        "Auscultate fetal heart with handheld Doppler (sonicaid)",
        "Differentiate FHR from maternal pulse — FHR should be approximately double maternal rate",
        "If FH NOT detected → arrange immediate USS — do not leave woman alone",
      ],
      next: "gestation",
    },

    "gestation": {
      type: "calculator",
      title: "What is the gestation?",
      subtitle: "Select to get focused guidance for this patient",
      description: "Management differs significantly by gestation — select the band that applies",
      fields: [
        {
          id: "gestation_band",
          question: "Current gestation?",
          options: [
            { label: "Before 24+0 weeks", score: 1 },
            { label: "24+0 to 27+6 weeks", score: 2 },
            { label: "28+0 weeks or later", score: 3 },
          ],
        },
      ],
      scoring: [
        { min: 1, max: 1, label: "Before 24 weeks", color: "blue",  next: "pre_24"       },
        { min: 2, max: 2, label: "24–28 weeks",     color: "blue",  next: "mid_gestation" },
        { min: 3, max: 3, label: "28 weeks +",      color: "blue",  next: "over_28"       },
      ],
    },

    // ─── Path A: Before 24 weeks ───────────────────────────────────────────────

    "pre_24": {
      type: "treatment",
      title: "RFM before 24+0 weeks",
      sections: [
        {
          title: "Fetal heart confirmed on Doppler",
          items: [
            "If movement previously felt — reassure; normal variation before 24 weeks",
            "Advise: women feel movements from 16–24 weeks; significant variation is normal",
            "Advise: report immediately if no movement felt at all by 24 weeks",
            "Advise: report any further concerns",
          ],
        },
        {
          title: "If no movement ever felt",
          items: [
            "Arrange anomaly USS if not already performed",
            "Consider referral to fetal medicine specialist",
            "Possible underlying conditions: neuromuscular disorders, structural anomalies",
          ],
        },
      ],
      next: "documentation",
    },

    // ─── Path B: 24–28 weeks ───────────────────────────────────────────────────

    "mid_gestation": {
      type: "treatment",
      title: "RFM at 24+0 to 27+6 weeks",
      sections: [
        {
          title: "Fetal heart confirmed — next steps",
          items: [
            "Take history for FGR and stillbirth risk factors",
            "CTG can be offered from 26+0 weeks if there is clinical concern",
            "Consider USS if risk factors present or clinical suspicion of FGR",
            "USS: EFW and AC to assess for SGA; liquor volume; uterine artery Doppler if available",
          ],
        },
        {
          title: "If low risk and FH confirmed",
          items: [
            "Reassure — explain normal pattern of fetal movements at this gestation",
            "Advise: report any further RFM or change in movement pattern immediately",
            "Advise: attend maternity unit if concerned — do not wait",
          ],
        },
      ],
      next: "documentation",
    },

    // ─── Path C: 28 weeks + — full pathway ────────────────────────────────────

    "over_28": {
      type: "checklist",
      title: "Perform computerised CTG",
      subtitle: "28+0 weeks or later — full RFM pathway",
      items: [
        "Computerised CTG — minimum 20 minutes",
        "Computerised interpretation preferred over visual — reduces inter-observer variation",
        "A healthy fetus shows FHR accelerations with >92% of gross body movements",
        "If no acceleration for >80 minutes — fetal compromise is likely",
      ],
      next: "ctg_result",
    },

    "ctg_result": {
      type: "calculator",
      title: "CTG result?",
      subtitle: "Select the outcome to continue",
      description: "Interpret the CTG and select the result — this determines the next step",
      fields: [
        {
          id: "ctg_outcome",
          question: "CTG interpretation?",
          options: [
            { label: "Normal — RFM resolved, no risk factors", score: 1 },
            { label: "Normal — but RFM persists OR risk factors present", score: 2 },
            { label: "Suspicious or pathological", score: 3 },
          ],
        },
      ],
      scoring: [
        { min: 1, max: 1, label: "Normal — reassure",    color: "green", next: "reassure"     },
        { min: 2, max: 2, label: "USS indicated",         color: "amber", next: "uss_indicated" },
        { min: 3, max: 3, label: "Abnormal CTG",          color: "red",   next: "senior_review" },
      ],
    },

    "reassure": {
      type: "treatment",
      title: "Normal CTG — Reassure and discharge",
      badge: { label: "Normal CTG · No risk factors", color: "green" },
      sections: [
        {
          title: "Advice to give the patient",
          items: [
            "All findings today are normal — reassure",
            "Do NOT recommend formal kick charts — no evidence of benefit (Grade A)",
            "Fetal movements do not decrease towards term — this is a common myth",
            "Report any further reduction in movements or change in pattern immediately",
            "If ≥39 weeks and all investigations normal: IOL can be offered — not associated with increased CS rate",
          ],
        },
      ],
      next: "documentation",
    },

    "uss_indicated": {
      type: "checklist",
      title: "Request USS",
      subtitle: "Normal CTG — but USS is indicated",
      items: [
        "Estimated fetal weight (EFW) and abdominal circumference — SGA <10th centile",
        "Amniotic fluid volume — deepest vertical pocket (oligohydramnios = adverse outcome risk)",
        "Umbilical artery Doppler — pulsatility index; absent or reversed end-diastolic flow = severe FGR",
        "Cerebroplacental ratio (CPR) — consider if ≥37 weeks; CPR <1.1 may guide IOL decision",
        "Fetal morphology — if anomaly scan not previously performed",
        "Do not delay USS — perform at earliest available opportunity",
      ],
      next: "uss_result",
    },

    "uss_result": {
      type: "treatment",
      title: "USS outcome — management",
      sections: [
        {
          title: "Normal — EFW ≥10th centile, normal fluid, normal Doppler",
          items: [
            "Reassure — all investigations normal",
            "No indication for IOL before 39 weeks on RFM alone with normal investigations",
            "If ≥39 weeks: IOL can be offered in partnership with the woman",
            "Advise: report any further RFM or movement change immediately",
          ],
        },
        {
          title: "Abnormal — SGA, oligohydramnios, or abnormal Doppler",
          items: [
            "Manage per RCOG GTG31 (SGA / Growth Restricted Fetus)",
            "Senior obstetrician involvement — do not manage alone",
            "Absent or reversed end-diastolic flow on UAD = urgent senior review",
            "Frequency of surveillance and timing of birth determined by USS findings and gestation",
          ],
        },
      ],
      next: "escalation",
    },

    "senior_review": {
      type: "escalation",
      title: "Suspicious or pathological CTG — call senior now",
      alert: "Abnormal CTG in context of RFM increases risk of adverse outcome 7-fold. Do not manage alone.",
      items: [
        "Involve senior obstetrician (ST6+ or consultant) immediately",
        "Consider acute fetal compromise — expedite birth if appropriate",
        "If lesser degree of concern: further CTG monitoring with plan for frequent reassessment",
        "Add USS (EFW, liquor, UAD) if immediate birth not indicated",
        "If acute compromise → proceed to birth per unit protocol",
      ],
      next: "documentation",
    },

    "escalation": {
      type: "escalation",
      title: "Also escalate if…",
      items: [
        "Fetal heart not detected on Doppler at any gestation — immediate USS",
        "Recurrent RFM — 2 or more episodes within 21 days (stillbirth risk 1.4%, FGR risk 44%)",
        "SGA, oligohydramnios, or absent / reversed umbilical artery end-diastolic flow",
        "Woman requesting delivery despite normal investigations — senior shared decision-making",
      ],
      next: "documentation",
    },

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Gestation at presentation",
        "Nature of RFM — reduced, absent, or changed pattern",
        "Risk factors identified",
        "SFH plotted on growth chart",
        "FH confirmed on Doppler — time and result",
        "CTG performed — result and interpretation (if ≥28 weeks)",
        "USS performed or referred — findings (if indicated)",
        "Management plan and clinical rationale",
        "Safety-netting advice given — patient knows to return with any further concerns",
        "Follow-up plan — who and when",
      ],
    },

  },
};
