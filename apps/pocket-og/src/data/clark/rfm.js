export const RFM_PROTOCOL = {
  id: "rfm",
  title: "Reduced Fetal Movements",
  subtitle: "RFM — Assessment & management",
  category: "antenatal",
  guideline: "RCOG GTG57",
  color: "blue",
  startId: "gestation_q",
  nodes: {

    // ─── Opening question ──────────────────────────────────────────────────────

    "gestation_q": {
      type: "question",
      question: "What's the gestation?",
      options: [
        { label: "Before 24 weeks",     sublabel: "< 24+0",              next: "pre24_fh_q"  },
        { label: "24 to 27+6 weeks",    sublabel: "24+0 – 27+6",         next: "mid_fh_q"    },
        { label: "28 weeks or later",   sublabel: "≥ 28+0 — full pathway", next: "late_fh_q" },
      ],
    },

    // ─── Path A: Before 24 weeks ───────────────────────────────────────────────

    "pre24_fh_q": {
      type: "question",
      question: "Can you hear the fetal heart on Doppler?",
      subtitle: "Differentiate FHR from maternal pulse — FHR should be ~double maternal rate",
      options: [
        { label: "Yes — fetal heart confirmed",    next: "pre24_movement_q" },
        { label: "No — cannot detect fetal heart", next: "iufd_alert"       },
      ],
    },

    "pre24_movement_q": {
      type: "question",
      question: "Has the patient ever felt movements at all?",
      options: [
        { label: "Yes — movements felt before, now reduced",   next: "pre24_reassure" },
        { label: "No — no movement felt at any point so far",  next: "pre24_anomaly"  },
      ],
    },

    "pre24_reassure": {
      type: "treatment",
      title: "Reassure — normal variation before 24 weeks",
      source: { gl: "GTG57", sectionId: "gtg57-gestation-management", label: "Management by Gestation (<28 Weeks)" },
      sections: [
        {
          title: "Advice to give the patient",
          items: [
            "Fetal heart confirmed — this is reassuring",
            "Significant variation in perceived movement is normal before 24 weeks",
            "Most women perceive movement from 18–20 weeks; multiparous women may feel movement from 16 weeks; primiparous women may not perceive movement until after 20 weeks",
            "Advise: attend immediately if no movement felt at all by 24 weeks",
            "Advise: return with any further concerns — do not dismiss RFM",
          ],
        },
        {
          title: "Risk factors to check before discharge",
          items: [
            "Smoking, hypertension, diabetes, obesity, anterior placenta",
            "Prior SGA, stillbirth, or recurrent RFM (≥2 episodes within 21 days)",
            "If risk factors present → consider anomaly USS if not yet performed",
          ],
        },
      ],
      next: "documentation",
    },

    "pre24_anomaly": {
      type: "escalation",
      title: "No movement ever felt — arrange USS",
      alert: "No perceived movement at all before 24 weeks requires further investigation",
      source: { gl: "GTG57", sectionId: "gtg57-gestation-management", label: "Management by Gestation (<28 Weeks)" },
      items: [
        "Arrange anomaly USS if not already performed",
        "Consider referral to fetal medicine specialist",
        "Possible underlying: neuromuscular disorder, structural anomaly, oligohydramnios",
        "Do not discharge without a plan and safety-netting",
      ],
      next: "documentation",
    },

    // ─── Path B: 24 to 27+6 weeks ─────────────────────────────────────────────

    "mid_fh_q": {
      type: "question",
      question: "Can you hear the fetal heart on Doppler?",
      subtitle: "Differentiate FHR from maternal pulse — FHR should be ~double maternal rate",
      options: [
        { label: "Yes — fetal heart confirmed",    next: "mid_risk_q"  },
        { label: "No — cannot detect fetal heart", next: "iufd_alert"  },
      ],
    },

    "mid_risk_q": {
      type: "question",
      question: "Are there risk factors for FGR or stillbirth?",
      subtitle: "Smoking, hypertension, diabetes, obesity, prior SGA/stillbirth, anterior placenta, recurrent RFM",
      options: [
        { label: "No significant risk factors",   next: "mid_reassure"    },
        { label: "Yes — one or more risk factors", next: "mid_investigate" },
      ],
    },

    "mid_reassure": {
      type: "treatment",
      title: "24–28 weeks — low risk, fetal heart confirmed",
      source: { gl: "GTG57", sectionId: "gtg57-gestation-management", label: "Management by Gestation (<28 Weeks)" },
      sections: [
        {
          title: "Reassure the patient",
          items: [
            "Fetal heart confirmed — reassuring",
            "Explain normal pattern of movement at this gestation",
            "CTG is NOT recommended before 26+0 weeks — insufficient evidence [GTG57]",
            "CTG can be offered from 26+0 weeks if there is clinical indication",
            "No further investigation required today if low risk",
          ],
        },
        {
          title: "Safety netting",
          items: [
            "Report any further reduction or change in movement pattern immediately",
            "Attend maternity unit if concerned — do not wait",
            "RFM is presenting symptom in approximately 50% of IUFDs — always take seriously",
          ],
        },
      ],
      next: "documentation",
    },

    "mid_investigate": {
      type: "checklist",
      title: "Risk factors present — investigate",
      subtitle: "24+0 to 27+6 weeks with risk factors",
      source: { gl: "GTG57", sectionId: "gtg57-gestation-management", label: "Management by Gestation (<28 Weeks)" },
      items: [
        "CTG — can be offered from 26+0 weeks if clinically indicated",
        "USS — EFW and abdominal circumference to screen for SGA (<10th centile)",
        "Liquor volume — oligohydramnios is associated with adverse outcome",
        "If SGA or abnormal Doppler found → manage per RCOG GTG31 with senior input",
      ],
      next: "documentation",
    },

    // ─── Path C: 28 weeks or later ────────────────────────────────────────────

    "late_fh_q": {
      type: "question",
      question: "Can you hear the fetal heart on Doppler?",
      subtitle: "Differentiate FHR from maternal pulse — FHR should be ~double maternal rate",
      options: [
        { label: "Yes — fetal heart confirmed",    next: "late_history" },
        { label: "No — cannot detect fetal heart", next: "iufd_alert"   },
      ],
    },

    "late_history": {
      type: "checklist",
      title: "Take a focused history",
      subtitle: "Cover these areas before CTG",
      alert: "RFM is the presenting symptom in approximately 50% of IUFDs — always take seriously regardless of perceived cause",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "Duration and character of RFM — reduced, absent, or changed pattern",
        "Any preceding period of excessive or vigorous movements",
        "Anterior placenta — may decrease perception before 28 weeks but should NOT cause a sudden change in movement after 28 weeks",
        "Medications crossing the placenta: opioids, benzodiazepines, methadone; alcohol use",
        "Risk factors for FGR/stillbirth: smoking, hypertension, diabetes, obesity",
        "Prior SGA, stillbirth, or recurrent RFM (≥2 episodes within 21 days = higher risk)",
      ],
      next: "late_exam",
    },

    "late_exam": {
      type: "checklist",
      title: "Examine the patient",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "BP, HR, temperature",
        "Symphysis-fundal height (SFH) — plot on customised growth chart",
        "Urinalysis — protein, glucose",
        "Perform computerised CTG — minimum 20 minutes",
        "Computerised interpretation preferred — reduces inter-observer variation",
        "A healthy fetus shows FHR accelerations with 92–97% of gross body movements",
        "If no acceleration for >80 minutes — fetal compromise is likely",
      ],
      next: "ctg_q",
    },

    "ctg_q": {
      type: "question",
      question: "What does the CTG show?",
      options: [
        { label: "Normal",                               sublabel: "Reassuring — no concerns",            next: "ctg_normal_rf_q"  },
        { label: "Suspicious or pathological",           sublabel: "Any abnormal feature",                next: "senior_review"    },
      ],
    },

    "ctg_normal_rf_q": {
      type: "question",
      question: "Normal CTG — are RFM or risk factors still present?",
      subtitle: "Recurrent RFM, SGA risk, or abnormal SFH suggests USS is needed even with normal CTG",
      options: [
        { label: "No — RFM resolved, no risk factors",                next: "reassure_discharge"  },
        { label: "Yes — RFM persists or risk factors present",        next: "uss_checklist"       },
      ],
    },

    "reassure_discharge": {
      type: "treatment",
      title: "Normal CTG — Reassure and discharge",
      badge: { label: "Normal CTG · No risk factors", color: "green" },
      source: { gl: "GTG57", sectionId: "gtg57-after-normal-investigations", label: "After Normal Investigations — Surveillance & Intervention" },
      sections: [
        {
          title: "Advice to give the patient",
          items: [
            "All findings today are normal — reassure",
            "Do NOT recommend formal kick charts — no evidence of benefit [Grade A]",
            "Fetal movements do not decrease towards term — this is a common misconception",
            "Report any further reduction in movements or change in pattern immediately",
          ],
        },
      ],
      next: "documentation",
    },

    "uss_checklist": {
      type: "checklist",
      title: "Request USS",
      subtitle: "Normal CTG — but USS is indicated",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "EFW and abdominal circumference — SGA <10th centile",
        "Amniotic fluid volume — deepest vertical pocket (oligohydramnios is associated with adverse outcome)",
        "Umbilical artery Doppler — pulsatility index; absent or reversed end-diastolic flow = severe FGR",
        "Consider cerebroplacental ratio (CPR) — especially if ≥37 weeks",
        "Fetal morphology — if anomaly scan not previously performed",
        "Do not delay USS — perform at earliest available opportunity",
      ],
      next: "uss_q",
    },

    "uss_q": {
      type: "question",
      question: "What does the USS show?",
      options: [
        { label: "Normal",   sublabel: "EFW ≥10th centile, normal fluid, normal Doppler",      next: "uss_normal"   },
        { label: "Abnormal", sublabel: "SGA, oligohydramnios, or abnormal Doppler",             next: "uss_abnormal" },
      ],
    },

    "uss_normal": {
      type: "treatment",
      title: "Normal USS — reassure",
      source: { gl: "GTG57", sectionId: "gtg57-after-normal-investigations", label: "After Normal Investigations — Surveillance & Intervention" },
      sections: [
        {
          title: "Management",
          items: [
            "Reassure — all investigations normal",
            "No indication for expediting birth before 39 weeks on RFM alone with normal investigations [Grade A]",
            "If ≥39 weeks: IOL can be offered in partnership with the woman [Grade A]",
            "Advise: report any further RFM or movement change immediately",
          ],
        },
      ],
      next: "escalation_check",
    },

    "uss_abnormal": {
      type: "escalation",
      title: "Abnormal USS — senior review needed",
      alert: "Do not manage SGA, oligohydramnios, or abnormal Doppler alone",
      source: { gl: "GTG57", sectionId: "gtg57-after-normal-investigations", label: "After Normal Investigations — Surveillance & Intervention" },
      items: [
        "Manage per RCOG GTG31 (SGA / Growth Restricted Fetus)",
        "Involve senior obstetrician (ST6+ or consultant)",
        "Absent or reversed end-diastolic flow on umbilical artery Doppler = urgent senior review",
        "Frequency of surveillance and timing of birth determined by USS findings and gestation",
      ],
      next: "documentation",
    },

    "senior_review": {
      type: "escalation",
      title: "Suspicious or pathological CTG — call senior now",
      alert: "Abnormal CTG in context of RFM increases risk of adverse outcome (aOR 7.1). Do not manage alone.",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "Involve senior obstetrician (ST6+ or consultant) immediately",
        "Consider acute fetal compromise — expedite birth if appropriate",
        "If lesser degree of concern: further CTG monitoring with plan for frequent reassessment",
        "Add USS (EFW, liquor, umbilical artery Doppler) if immediate birth not indicated",
        "If acute compromise → proceed to birth per unit protocol",
      ],
      next: "documentation",
    },

    // ─── IUFD alert ───────────────────────────────────────────────────────────

    "iufd_alert": {
      type: "escalation",
      title: "Fetal heart not detected — act now",
      alert: "Do not leave the woman alone. Arrange immediate USS to confirm fetal viability.",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "Arrange immediate USS — do not delay",
        "Do not reassure the patient until USS confirms viability",
        "Stay with the patient — do not leave her alone",
        "Call senior obstetrician now",
        "If IUFD confirmed → follow bereavement pathway; involve senior team and midwifery lead",
      ],
      next: "documentation",
    },

    // ─── Escalation summary ───────────────────────────────────────────────────

    "escalation_check": {
      type: "escalation",
      title: "Also escalate if any of these apply",
      source: { gl: "GTG57", sectionId: "gtg57-recurrent-rfm", label: "Recurrent RFM" },
      items: [
        "Recurrent RFM — 2 or more episodes within 21 days after 26+0 weeks (stillbirth risk 1.4%, FGR risk 44.2%)",
        "SGA, oligohydramnios, or absent / reversed umbilical artery end-diastolic flow",
        "Woman requesting delivery despite normal investigations — individualised senior decision",
        "Any clinical deterioration or instinct that something is wrong",
      ],
      next: "documentation",
    },

    // ─── Documentation ────────────────────────────────────────────────────────

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      source: { gl: "GTG57", sectionId: "gtg57-clinical-assessment", label: "Clinical Assessment" },
      items: [
        "Gestation at presentation",
        "Nature of RFM — reduced, absent, or changed pattern",
        "Risk factors identified",
        "SFH plotted on growth chart",
        "FH confirmed on Doppler — time and result",
        "CTG performed — result and interpretation (if ≥26 weeks)",
        "USS performed or referred — findings (if indicated)",
        "Management plan and clinical rationale",
        "Safety-netting advice given — patient knows to return with any further concerns",
        "Follow-up plan — who and when",
      ],
    },

  },
};
