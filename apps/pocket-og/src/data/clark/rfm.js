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
        "Gestation and whether movements have ever been felt",
        "Duration and character of RFM — reduced, absent, or changed pattern",
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
      subtitle: "Check and document",
      items: [
        "BP, HR, temperature",
        "Symphysis-fundal height (SFH) — plot on customised growth chart",
        "Urinalysis — protein, glucose",
        "Auscultate fetal heart with handheld Doppler (sonicaid)",
        "Differentiate FHR from maternal pulse — FHR should be approximately double maternal rate",
        "If FH NOT detected on Doppler → immediate ultrasound referral — do not leave woman alone",
      ],
      next: "gestation_pathway",
    },

    "gestation_pathway": {
      type: "treatment",
      title: "Assessment by gestation",
      sections: [
        {
          title: "Before 24+0 weeks",
          items: [
            "Confirm fetal heartbeat with Doppler",
            "If FH confirmed and movement previously felt — reassure",
            "If no movement ever felt → arrange anomaly USS; consider fetal medicine referral",
            "Advise: report if no movement felt at all by 24 weeks",
          ],
        },
        {
          title: "24+0 to 27+6 weeks",
          items: [
            "Confirm FH with Doppler",
            "Assess stillbirth and FGR risk factors",
            "CTG can be offered from 26+0 weeks if clinical concern",
            "USS if risk factors or clinical suspicion of FGR",
          ],
        },
        {
          title: "28+0 weeks or later — full pathway",
          items: [
            "Confirm FH → proceed to computerised CTG",
            "CTG ≥20 minutes — computerised interpretation preferred",
            "Normal CTG + no risk factors + RFM resolved → reassure and discharge with advice",
            "Normal CTG + risk factors OR RFM persists → USS (EFW, fluid, UAD)",
            "Suspicious or pathological CTG → senior obstetrician review immediately",
          ],
        },
      ],
      next: "investigations",
    },

    "investigations": {
      type: "checklist",
      title: "Investigations — ≥28 weeks",
      subtitle: "CTG first; USS if clinically indicated",
      items: [
        "Computerised CTG — ≥20 minutes; computerised preferred over visual interpretation",
        "USS indicated if: CTG normal but RFM persists, risk factors present, or no USS in past 2 weeks",
        "USS: estimated fetal weight (EFW) and abdominal circumference — SGA <10th centile",
        "Amniotic fluid volume — deepest vertical pocket (oligohydramnios = adverse outcome risk)",
        "Umbilical artery Doppler — raised PI; absent or reversed end-diastolic flow = severe FGR",
        "Cerebroplacental ratio (CPR) — consider if ≥37 weeks; CPR <1.1 may guide IOL decision",
      ],
      next: "management",
    },

    "management": {
      type: "treatment",
      title: "Management by outcome",
      sections: [
        {
          title: "Normal CTG + RFM resolved + no risk factors",
          items: [
            "Reassure — no indication to expedite birth",
            "Do NOT recommend formal kick charts — no evidence of benefit (Grade A)",
            "Advise: fetal movements do not decrease towards term",
            "Advise: report any further RFM or change in pattern immediately",
          ],
        },
        {
          title: "All investigations normal — recurrent RFM at ≥39 weeks",
          items: [
            "IOL at ≥39 weeks can be offered — not associated with increased CS rate (Grade A)",
            "Shared decision-making — document discussion and woman's wishes",
            "If woman declines IOL: increase surveillance (CTG + USS)",
          ],
        },
        {
          title: "SGA / oligohydramnios / abnormal Doppler",
          items: [
            "Manage per RCOG GTG31 (SGA / Growth Restricted Fetus)",
            "Senior obstetrician involvement",
            "Frequency of surveillance and timing of birth determined by USS findings and gestation",
            "Absent or reversed end-diastolic flow on UAD = urgent senior review",
          ],
        },
      ],
      next: "escalation",
    },

    "escalation": {
      type: "escalation",
      title: "Escalate — call the senior if…",
      items: [
        "Fetal heart not detected on Doppler — arrange immediate USS",
        "Suspicious or pathological CTG",
        "SGA, oligohydramnios, or absent / reversed umbilical artery end-diastolic flow",
        "Recurrent RFM — 2 or more episodes within 21 days (stillbirth risk 1.4%, FGR risk 44%)",
        "Clinical concern about fetal compromise at any gestation",
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
        "CTG performed — result and interpretation",
        "USS performed or referred — findings",
        "Management plan and clinical rationale",
        "Safety-netting advice given to patient — advised to return with any further concerns",
        "Follow-up plan — who and when",
      ],
    },

  },
};
