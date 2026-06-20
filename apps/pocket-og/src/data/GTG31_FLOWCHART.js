// GTG31 — SGA / Fetal Growth Restriction Surveillance
// Centile → Doppler category → surveillance interval → delivery timing

export const GTG31_SURVEILLANCE_FLOWCHART = {
  id: "GTG31_SURVEILLANCE",
  title: "SGA / FGR Surveillance",
  subtitle: "GTG31 · Small for Gestational Age Fetus",
  startId: "confirmed",
  nodes: {

    "confirmed": {
      type: "action",
      title: "SGA Confirmed on Ultrasound",
      text: "AC or EFW below the 10th centile. Refer to consultant-led care. Document centile and gestation clearly.",
      items: [
        "Confirm gestation accuracy — use first-trimester dating scan CRL if available",
        "Assess liquor volume (AFI or SDP)",
        "Perform umbilical artery (UA) Doppler at the same visit",
        "Consider timing of uterine artery Doppler at 20–24 weeks if not yet done",
        "Review maternal history for risk factors (previous SGA, hypertension, smoking, APS)",
      ],
      next: "centile",
    },

    "centile": {
      type: "decision",
      title: "What centile is the AC / EFW?",
      text: "Centile determines the baseline surveillance intensity before Doppler findings.",
      options: [
        { label: "5th–10th centile", sublabel: "Minor SGA — assess UA Doppler", next: "ua_minor" },
        { label: "< 5th centile", sublabel: "Major SGA — heightened surveillance", next: "ua_major" },
      ],
    },

    "ua_minor": {
      type: "decision",
      title: "UA Doppler — Minor SGA (5th–10th centile)",
      text: "Umbilical artery pulsatility index (PI) measured at free loop of cord.",
      options: [
        { label: "Normal PI (< 95th centile)", sublabel: "Routine fortnightly surveillance", next: "minor_normal" },
        { label: "Raised PI (> 95th centile)", sublabel: "Increase surveillance intensity", next: "raised_pi" },
        { label: "AEDF / REDF", sublabel: "Absent or reversed end diastolic flow — escalate", next: "aedf" },
      ],
    },

    "ua_major": {
      type: "decision",
      title: "UA Doppler — Major SGA (< 5th centile)",
      text: "Umbilical artery pulsatility index (PI) measured at free loop of cord.",
      options: [
        { label: "Normal PI (< 95th centile)", sublabel: "Fortnightly surveillance with MCA from 34 weeks", next: "major_normal" },
        { label: "Raised PI (> 95th centile)", sublabel: "Weekly surveillance; consider admission", next: "raised_pi" },
        { label: "AEDF", sublabel: "Absent end diastolic flow — admit", next: "aedf" },
        { label: "REDF", sublabel: "Reversed end diastolic flow — urgent delivery", next: "redf" },
      ],
    },

    "minor_normal": {
      type: "end",
      title: "Minor SGA — Normal Doppler",
      text: "Lowest risk category. Fortnightly surveillance is appropriate.",
      items: [
        "Growth scan (AC + EFW) every 2 weeks",
        "UA Doppler every 2 weeks",
        "Planned delivery at 37+0 weeks",
        "No additional fetal monitoring (CTG or BPP) required unless clinical concern",
        "Advise woman to report reduced fetal movements promptly",
      ],
    },

    "major_normal": {
      type: "end",
      title: "Major SGA — Normal Doppler",
      text: "Higher baseline risk despite normal Dopplers — closer surveillance than minor SGA.",
      items: [
        "Growth scan (AC + EFW) every 2 weeks",
        "UA Doppler every 2 weeks",
        "MCA Doppler from 34+0 weeks — assess brain sparing and CPR",
        "CTG if clinical concern arises",
        "Planned delivery at 37+0 weeks; discuss with fetal medicine if <34 weeks",
      ],
    },

    "raised_pi": {
      type: "action",
      title: "Raised UA PI (> 95th centile)",
      text: "Increased placental resistance — intermediate risk category. Intensify surveillance.",
      items: [
        "Weekly growth scan and UA Doppler",
        "MCA Doppler weekly from any gestation (assess cerebroplacental ratio, CPR)",
        "CTG 2–3× per week",
        "Assess amniotic fluid weekly (oligohydramnios increases risk)",
        "Discuss with fetal medicine if < 34 weeks",
      ],
      next: "raised_gestation",
    },

    "raised_gestation": {
      type: "decision",
      title: "Current Gestation?",
      text: "Delivery timing for raised UA PI depends on gestation and any additional deterioration.",
      options: [
        { label: "< 34+0 weeks", sublabel: "Continue close surveillance; steroids if delivery anticipated", next: "raised_preterm" },
        { label: "≥ 34+0 weeks", sublabel: "Assess MCA / CPR; plan delivery", next: "raised_term" },
      ],
    },

    "raised_preterm": {
      type: "end",
      title: "Raised PI — Preterm (< 34 weeks)",
      text: "Aim to continue pregnancy with close monitoring. Deliver if deterioration.",
      items: [
        "Antenatal corticosteroids if delivery anticipated before 34+6 weeks (betamethasone 12 mg IM × 2)",
        "MgSO₄ if < 30+0 weeks and delivery imminent (neuroprotection)",
        "Continue weekly UA + MCA Doppler and CTG 2–3× per week",
        "Deliver if: AEDF/REDF develops, DV abnormal, CTG pathological, or maternal deterioration",
        "Plan delivery at 37+0 if Dopplers normalise and gestation reached",
      ],
    },

    "raised_term": {
      type: "end",
      title: "Raised PI — Term (≥ 34 weeks)",
      text: "Low CPR or brain sparing at term — consider delivery.",
      items: [
        "CPR (MCA PI / UA PI) < 1.0: associated with adverse outcome at term — discuss delivery",
        "MCA PI < 5th centile (brain sparing): plan delivery without delay",
        "Deliver at 37+0 weeks if CPR > 1.0 and MCA normal",
        "Continuous CTG in labour; low threshold for LSCS",
        "Neonatal team present at delivery",
      ],
    },

    "aedf": {
      type: "alert",
      title: "Absent End Diastolic Flow (AEDF) — Escalate",
      text: "AEDF indicates severely impaired placental function. Inpatient management or very frequent outpatient attendance.",
      items: [
        "Admit or arrange review every 2–3 days minimum",
        "Daily CTG",
        "DV (ductus venosus) Doppler 2–3× per week — key escalation trigger",
        "Corticosteroids: give betamethasone if < 34+6 weeks",
        "MgSO₄ if < 30+0 weeks and delivery imminent",
        "Planned delivery at 34+0 weeks (or sooner if DV abnormal or CTG pathological)",
      ],
      next: "dv_aedf",
    },

    "dv_aedf": {
      type: "decision",
      title: "Ductus Venosus Doppler?",
      text: "DV PI for veins > 95th centile or absent/reversed 'a' wave indicates impending cardiac decompensation.",
      options: [
        { label: "Normal DV", sublabel: "Continue surveillance; deliver at 34+0", next: "deliver_34" },
        { label: "Abnormal DV PI (> 95th centile)", sublabel: "Expedite delivery; discuss with seniors", next: "deliver_now" },
        { label: "Absent or reversed 'a' wave", sublabel: "Emergency delivery", next: "emergency" },
      ],
    },

    "redf": {
      type: "alert",
      title: "Reversed End Diastolic Flow (REDF) — Urgent",
      text: "REDF represents critical placental failure. Admit immediately.",
      items: [
        "Admit immediately; daily CTG and DV Doppler",
        "Corticosteroids urgently if < 34+6 weeks",
        "MgSO₄ if < 30+0 weeks and delivery imminent (neuroprotection)",
        "Planned delivery at 30–32 weeks; DV Doppler guides exact timing",
        "Senior obstetrician and neonatologist must be involved",
        "Counsel parents about prognosis at very preterm gestations",
      ],
      next: "dv_redf",
    },

    "dv_redf": {
      type: "decision",
      title: "Ductus Venosus Doppler?",
      options: [
        { label: "Normal DV", sublabel: "Deliver at 30–32 weeks; continue daily monitoring until then", next: "deliver_32" },
        { label: "Abnormal / absent 'a' wave", sublabel: "Emergency delivery now", next: "emergency" },
      ],
    },

    "deliver_34": {
      type: "end",
      title: "Deliver at 34+0 Weeks",
      text: "AEDF with normal DV — planned delivery at 34 weeks.",
      items: [
        "Ensure corticosteroid course complete (give if not already given)",
        "Mode of delivery: caesarean section generally preferred with AEDF",
        "Continuous CTG if vaginal birth attempted",
        "Neonatal team present at delivery; NICU cot confirmed",
        "Cord blood gas at delivery",
      ],
    },

    "deliver_32": {
      type: "end",
      title: "Deliver at 30–32 Weeks",
      text: "REDF with normal DV — plan delivery at 30–32 weeks.",
      items: [
        "Ensure corticosteroids given (betamethasone IM)",
        "MgSO₄ if < 30+0 weeks — neuroprotection",
        "Caesarean section recommended",
        "Level 3 NICU required — arrange in-utero transfer if not available",
        "Counsel parents with neonatology team before delivery",
      ],
    },

    "deliver_now": {
      type: "end",
      title: "Expedite Delivery — Abnormal DV",
      text: "Deteriorating DV Doppler indicates impending cardiac decompensation.",
      items: [
        "Senior obstetrician decision — weigh gestation against risk of intrauterine death",
        "Corticosteroids if < 34+6 weeks and time allows",
        "MgSO₄ if < 30 weeks",
        "Caesarean section",
        "NICU cot confirmed; neonatal team present",
      ],
    },

    "emergency": {
      type: "end",
      title: "Emergency Delivery — Absent / Reversed DV 'a' Wave",
      text: "Absent or reversed 'a' wave in DV indicates impending fetal death. Deliver without delay.",
      items: [
        "Consultant obstetrician and neonatologist immediately",
        "Counsel parents urgently on prognosis — at very early gestations this is a difficult decision",
        "Caesarean section",
        "Give corticosteroids and MgSO₄ if time permits — do not delay delivery",
        "NICU cot must be confirmed before delivery",
      ],
    },

  },
};
