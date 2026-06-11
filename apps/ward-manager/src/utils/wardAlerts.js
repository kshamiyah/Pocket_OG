// Alert engine — rules from NICE NG235 (Intrapartum Care, Sept 2023) and NICE NG25 (Preterm Labour, Nov 2022)

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

function formatAge(ms) {
  const totalMin = Math.floor(ms / MIN);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function findMembranesTime(ves) {
  if (!ves?.length) return null;
  for (let i = ves.length - 1; i >= 0; i--) {
    if (ves[i].membranesTime) return ves[i].membranesTime;
  }
  return null;
}

// Parses "32+4" or legacy "40w" → decimal weeks (e.g. 32.571)
function parseGestWeeks(str) {
  if (!str) return null;
  const plus = str.match(/^(\d+)\+(\d)$/);
  if (plus) return parseInt(plus[1]) + parseInt(plus[2]) / 7;
  const w = str.match(/^(\d+)w$/);
  if (w) return parseInt(w[1]);
  return null;
}

export function computeAlerts(bed, now = Date.now()) {
  const alerts = [];

  const ves = bed.ves ?? [];
  const lastVE = ves.length > 0 ? ves[ves.length - 1] : null;
  const prevVE = ves.length > 1 ? ves[ves.length - 2] : null;
  const oxyLog = bed.oxytocinLog ?? [];
  const currentOx = oxyLog.length > 0 ? oxyLog[oxyLog.length - 1] : null;
  const obs = bed.observations ?? {};

  const hasRegionalAnalgesia = bed.analgesia === "Epidural" || bed.analgesia === "Remifentanil PCA";
  const isNullip = bed.parity === "Para 0";
  const flags = bed.riskFlags ?? [];
  const isDiabetic = flags.some(f => f.startsWith("Diabetic"));
  const isHypertensive = flags.includes("Hypertensive");
  const isGBSPos = flags.includes("GBS+");
  const membranesTime = findMembranesTime(ves);
  const membranesRuptured = lastVE?.membranes === "SROM" || lastVE?.membranes === "AROM";

  const gestWks = parseGestWeeks(bed.gestation);
  const isPreterm = gestWks !== null && gestWks < 37;
  const gest = bed.gestation ?? "";

  // ─── Preterm — neonatal team (< 34 weeks) ───────────────────────────
  if (isPreterm && gestWks < 34 && !bed.neonatalTeamAlerted) {
    alerts.push({
      id: "preterm-neonatal",
      severity: "urgent",
      title: `Preterm ${gest} — alert neonatal team`,
      body: "Ensure NICU/neonatologist notified. Confirm delivery in appropriate setting with resuscitation team present.",
      citation: "NICE NG25 §1.1.4 [2022]",
    });
  }

  // ─── Preterm — MgSO4 neuroprotection (< 30 weeks) ───────────────────
  if (isPreterm && gestWks < 30 && !bed.mgso4Given) {
    alerts.push({
      id: "preterm-mgso4",
      severity: "urgent",
      title: `MgSO4 neuroprotection — ${gest} weeks`,
      body: "Offer IV magnesium sulphate if delivery expected within 24 h: 4 g loading dose over 15 min, then 1 g/hr maintenance until delivery or 24 h. Reduces risk of cerebral palsy.",
      citation: "NICE NG25 §1.6.1 [2022]",
    });
  }

  // ─── Preterm — antenatal corticosteroids (< 34+6) ───────────────────
  if (isPreterm && gestWks < 34 + 6 / 7 && !bed.corticosteroidsConfirmed) {
    alerts.push({
      id: "preterm-steroids",
      severity: "urgent",
      title: `Antenatal corticosteroids — confirm given (${gest})`,
      body: "Offer betamethasone 12 mg IM, repeat after 24 h if delivery expected within 7 days and gestation < 34+6. Document if already given or not indicated.",
      citation: "NICE NG25 §1.7.1 [2022]",
    });
  }

  // ─── Preterm — tocolysis consideration (28–33+6, active labour) ─────
  if (isPreterm && gestWks >= 28 && gestWks < 34 && bed.labourStage === "Active first stage" && !bed.tocolysisOffered) {
    alerts.push({
      id: "preterm-tocolysis",
      severity: "warning",
      title: `Consider tocolysis — active preterm labour (${gest})`,
      body: "Offer tocolysis (nifedipine 20 mg oral, repeat after 30 min if needed, or atosiban) to allow corticosteroids to work and/or facilitate in utero transfer to appropriate unit.",
      citation: "NICE NG25 §1.8.1–1.8.2 [2022]",
    });
  }

  // ─── Active first stage duration (NICE NG235 §1.5.1) ───────────────────
  if (bed.activeFirstStageStartTime && bed.labourStage === "Active first stage") {
    const limit      = isNullip ? 12 * HOUR : 10 * HOUR;
    const limitLabel = isNullip ? "12 hours" : "10 hours";
    const ms = now - new Date(bed.activeFirstStageStartTime).getTime();
    if (ms >= limit) {
      alerts.push({
        id: "active-phase-limit",
        severity: "urgent",
        title: `Active first stage > ${limitLabel} (${formatAge(ms)})`,
        body: `Active labour has exceeded ${limitLabel} for ${isNullip ? "nulliparous" : "multiparous"} woman. Senior/consultant review required. Assess for CPD and consider caesarean section if no progress despite augmentation.`,
        citation: "NICE NG235 §1.5.1 [2023]",
      });
    } else if (ms >= limit - HOUR) {
      alerts.push({
        id: "active-phase-limit-soon",
        severity: "warning",
        title: `Active first stage approaching ${limitLabel} limit`,
        body: `${formatAge(limit - ms)} remaining. Review progress and plan escalation if no change.`,
        citation: "NICE NG235 §1.5.1 [2023]",
      });
    }
  }

  // ─── ARM reassessment at 2h (NICE NG235 §1.5.3–1.5.4) ──────────────────
  if (bed.armTime && bed.labourStage === "Active first stage") {
    const ms = now - new Date(bed.armTime).getTime();
    const veAfterARM = ves.filter(ve => new Date(ve.time) > new Date(bed.armTime));
    if (ms >= 2 * HOUR && veAfterARM.length === 0) {
      alerts.push({
        id: "arm-reassess",
        severity: "warning",
        title: `Reassess 2h after ARM (${formatAge(ms)} ago)`,
        body: "No VE recorded since ARM. If contractions still inadequate at 2h post-ARM, offer oxytocin augmentation.",
        citation: "NICE NG235 §1.5.3–1.5.4 [2023]",
      });
    }
  }

  // ─── VE overdue (active first stage) ────────────────────────────────
  if (bed.labourStage === "Active first stage") {
    if (!lastVE) {
      alerts.push({
        id: "ve-never",
        severity: "urgent",
        title: "No VE recorded",
        body: "Offer vaginal examination on admission to active labour.",
        citation: "NICE NG235 §1.4.1 [2023]",
      });
    } else {
      const ms = now - new Date(lastVE.time).getTime();
      if (ms >= 4 * HOUR) {
        alerts.push({
          id: "ve-overdue",
          severity: "urgent",
          title: `VE overdue (${formatAge(ms)} ago)`,
          body: "Offer 4-hourly vaginal examination in active first stage of labour.",
          citation: "NICE NG235 §1.4.1 [2023]",
        });
      } else if (ms >= 3.5 * HOUR) {
        alerts.push({
          id: "ve-due-soon",
          severity: "warning",
          title: "VE due in 30 min",
          body: "Approaching 4-hour vaginal examination interval.",
          citation: "NICE NG235 §1.4.1 [2023]",
        });
      }
    }
  }

  // ─── Latent phase reassessment ───────────────────────────────────────
  if (bed.labourStage === "Latent" && bed.admissionTime) {
    const ms = now - new Date(bed.admissionTime).getTime();
    if (ms >= 4 * HOUR) {
      alerts.push({
        id: "latent-reassess",
        severity: "warning",
        title: "Latent phase — reassess now",
        body: `${formatAge(ms)} since admission. Offer reassessment to confirm or exclude active labour.`,
        citation: "NICE NG235 §1.3.3 [2023]",
      });
    }
  }

  // ─── Slow progress ───────────────────────────────────────────────────
  if (bed.labourStage === "Active first stage" && lastVE && prevVE) {
    const diffHours = (new Date(lastVE.time) - new Date(prevVE.time)) / HOUR;
    if (diffHours >= 2) {
      const rate = (lastVE.dilation - prevVE.dilation) / diffHours;
      if (rate < 0.5) {
        alerts.push({
          id: "slow-progress",
          severity: "urgent",
          title: "Slow labour progress",
          body: `Progress ${rate === 0 ? "0 cm" : `${rate.toFixed(1)} cm/hr`}${rate === 0 ? ` in ${diffHours.toFixed(1)}h — no cervical change` : " — below the 0.5 cm/hr threshold"}. If membranes intact, offer ARM then reassess after 2h. If still < 1 cm progress, offer oxytocin augmentation.`,
          citation: "NICE NG235 §1.5.1–1.5.4 [2023]",
        });
      }
    }
  }

  // ─── Hyperstimulation ────────────────────────────────────────────────
  if (lastVE && typeof lastVE.contractions === "number" && lastVE.contractions > 5) {
    alerts.push({
      id: "hyperstim",
      severity: "urgent",
      title: "Uterine hyperstimulation",
      body: `${lastVE.contractions} contractions/10 min recorded. Stop or reduce oxytocin. Consider terbutaline 250 mcg SC if hyperstimulation persists.`,
      citation: "NICE NG235 §1.5.7 [2023]",
    });
  }

  // ─── Oxytocin increment due ──────────────────────────────────────────
  if (currentOx) {
    if (currentOx.dose >= 20) {
      alerts.push({
        id: "oxytocin-max",
        severity: "urgent",
        title: "Oxytocin at maximum dose",
        body: `Current dose ${currentOx.dose} mU/min — at or above maximum (20 mU/min). Escalate to registrar / consultant.`,
        citation: "NICE NG235 §1.5.6 [2023]",
      });
    } else {
      const msSinceIncrement = now - new Date(currentOx.lastIncrementTime).getTime();
      if (msSinceIncrement >= 30 * MIN) {
        alerts.push({
          id: "oxytocin-increment",
          severity: "warning",
          title: `Oxytocin increment due (${formatAge(msSinceIncrement)} ago)`,
          body: `Increase by 1–2 mU/min if contractions < 4/10 min. Current dose ${currentOx.dose} mU/min. Increment every 30 min minimum. Target 3–4 contractions/10 min, each 40–60 sec.`,
          citation: "NICE NG235 §1.5.6 [2023]",
        });
      }
    }
  }

  // ─── Second stage — passive limit ────────────────────────────────────
  if (bed.labourStage === "Passive second stage" && bed.passiveStartTime) {
    const limit = isNullip ? 2 * HOUR : 1 * HOUR;
    const ms = now - new Date(bed.passiveStartTime).getTime();
    const limitLabel = isNullip ? "2 hours" : "1 hour";
    if (ms >= limit) {
      alerts.push({
        id: "passive-limit",
        severity: "urgent",
        title: `Passive second stage limit reached (${formatAge(ms)})`,
        body: `${limitLabel} passive second stage for ${isNullip ? "nulliparous" : "multiparous"} woman. Encourage active pushing if no urge, or reassess for descent.`,
        citation: "NICE NG235 §1.6.3 [2023]",
      });
    } else if (ms >= limit - 15 * MIN) {
      alerts.push({
        id: "passive-limit-soon",
        severity: "warning",
        title: `Passive second stage limit approaching`,
        body: `${formatAge(limit - ms)} until ${limitLabel} limit. Prepare to encourage pushing.`,
        citation: "NICE NG235 §1.6.3 [2023]",
      });
    }
  }

  // ─── Second stage — active pushing limit ────────────────────────────
  if (bed.labourStage === "Active second stage" && bed.pushingStartTime) {
    let limit;
    if (isNullip && hasRegionalAnalgesia) limit = 2 * HOUR;
    else if (isNullip) limit = 1 * HOUR;
    else if (!isNullip && hasRegionalAnalgesia) limit = 1 * HOUR;
    else limit = 30 * MIN;

    const ms = now - new Date(bed.pushingStartTime).getTime();
    const limitLabel = limit === 30 * MIN ? "30 minutes" : limit === HOUR ? "1 hour" : "2 hours";

    if (ms >= limit) {
      alerts.push({
        id: "pushing-limit",
        severity: "urgent",
        title: `Active pushing limit reached (${formatAge(ms)})`,
        body: `${limitLabel} active pushing ${hasRegionalAnalgesia ? "with regional analgesia" : "without epidural"}. Senior review required — consider instrumental delivery.`,
        citation: "NICE NG235 §1.6.5–1.6.6 [2023]",
      });
    } else if (ms >= limit - 15 * MIN) {
      alerts.push({
        id: "pushing-limit-soon",
        severity: "warning",
        title: "Active pushing limit approaching",
        body: `${formatAge(limit - ms)} until ${limitLabel} limit. Alert senior if not progressing.`,
        citation: "NICE NG235 §1.6.5–1.6.6 [2023]",
      });
    }
  }

  // ─── PROM duration alerts ────────────────────────────────────────────
  if (membranesTime) {
    const ms = now - new Date(membranesTime).getTime();
    if (ms >= 24 * HOUR && bed.labourStage === "Latent") {
      alerts.push({
        id: "prom-24h",
        severity: "urgent",
        title: "PROM > 24 hours — offer induction",
        body: "Prelabour rupture of membranes for > 24h without established labour. Offer induction of labour. If GBS+, offer immediate induction with IV benzylpenicillin.",
        citation: "NICE NG235 §1.2.11 [2023]",
      });
    } else if (ms >= 18 * HOUR) {
      alerts.push({
        id: "prom-18h",
        severity: "urgent",
        title: `Membranes ruptured > 18 hours (${formatAge(ms)})`,
        body: "Increased GBS risk. Review GBS status. Offer IV benzylpenicillin 3g stat then 1.5g every 4h until delivery if GBS+ or risk factors present.",
        citation: "NICE NG235 §1.2.9 [2023] · GL787",
      });
    } else if (ms >= 16 * HOUR) {
      alerts.push({
        id: "prom-16h",
        severity: "warning",
        title: `Membranes ruptured ${formatAge(ms)} — approaching 18h`,
        body: "Review GBS status. Prepare for intrapartum antibiotic prophylaxis if GBS+ or risk factors.",
        citation: "NICE NG235 §1.2.9 [2023] · GL787",
      });
    }
  }

  // ─── GBS+ — antibiotics required ────────────────────────────────────
  if (isGBSPos && membranesRuptured && !bed.gbsAntibioticsStarted && !alerts.find(a => a.id === "prom-18h" || a.id === "prom-24h")) {
    alerts.push({
      id: "gbs-iap",
      severity: "urgent",
      title: "GBS+ — IV antibiotic prophylaxis required",
      body: "Offer IV benzylpenicillin 3g stat, then 1.5g every 4 hours until delivery. If penicillin-allergic: clindamycin 900 mg IV 8-hourly.",
      citation: "GL787 · NICE NG235 §1.2.12 [2023]",
    });
  }

  // ─── Abnormal observation values ─────────────────────────────────────
  const pulse = obs.pulseValue  ? parseFloat(obs.pulseValue)  : null;
  const bpSys = obs.bpSystolic  ? parseFloat(obs.bpSystolic)  : null;
  const bpDia = obs.bpDiastolic ? parseFloat(obs.bpDiastolic) : null;
  const temp  = obs.tempValue   ? parseFloat(obs.tempValue)   : null;
  const bgl   = obs.bglValue    ? parseFloat(obs.bglValue)    : null;

  if (temp !== null && temp >= 38.0) {
    alerts.push({
      id: "temp-38",
      severity: "urgent",
      title: `Pyrexia ${temp}°C — probable intrauterine infection`,
      body: "Temperature ≥ 38.0°C in labour. Escalate to obstetric consultant immediately. Commence broad-spectrum IV antibiotics per local protocol. Consider expediting delivery.",
      citation: "NICE NG235 §1.4.6 [2023]",
    });
  } else if (temp !== null && temp >= 37.5) {
    alerts.push({
      id: "temp-375",
      severity: "warning",
      title: `Temperature ${temp}°C — possible infection`,
      body: "Temperature 37.5–37.9°C in labour. Repeat in 1 hour. Review clinical picture for chorioamnionitis (fetal tachycardia, uterine tenderness, offensive liquor).",
      citation: "NICE NG235 §1.4.6 [2023]",
    });
  }

  if (pulse !== null && pulse > 120) {
    alerts.push({
      id: "tachycardia",
      severity: "urgent",
      title: `Maternal tachycardia — pulse ${pulse} bpm`,
      body: "Pulse > 120 bpm. Assess for haemorrhage, sepsis, pulmonary embolism, or pain. Escalate to senior clinician.",
      citation: "NICE NG235 §1.4.5 [2023]",
    });
  }

  if (bpSys !== null && bpDia !== null) {
    if (bpSys >= 160 || bpDia >= 110) {
      alerts.push({
        id: "bp-severe",
        severity: "urgent",
        title: `Severe hypertension — BP ${bpSys}/${bpDia} mmHg`,
        body: "BP ≥ 160/110 mmHg — urgent antihypertensive treatment required within 30–60 min. Give labetalol 200 mg oral or nifedipine MR 10 mg. Aim < 150/100. Involve obstetric consultant.",
        citation: "NICE NG133 §1.5 [2023] · NICE NG235 §1.4.5",
      });
    } else if (bpSys >= 140 || bpDia >= 90) {
      alerts.push({
        id: "bp-elevated",
        severity: isHypertensive ? "urgent" : "warning",
        title: `Hypertension — BP ${bpSys}/${bpDia} mmHg`,
        body: isHypertensive
          ? `BP ≥ 140/90 in known hypertensive patient. Review antihypertensive regime. Target < 135/85.`
          : `New BP ≥ 140/90 in labour. Assess for pre-eclampsia (proteinuria, headache, visual disturbance). Repeat in 15–30 min.`,
        citation: "NICE NG133 §1.4 [2023] · NICE NG235 §1.4.5",
      });
    }
  }

  if (bgl !== null) {
    if (bgl < 4.0) {
      alerts.push({
        id: "bgl-low",
        severity: "urgent",
        title: `Hypoglycaemia — BGL ${bgl} mmol/L`,
        body: "Blood glucose < 4.0 mmol/L. Give 150 mL of 10% glucose IV or sugary drink if tolerated. Recheck in 15 min. Adjust VRII.",
        citation: "GL983 §Intrapartum [2023]",
      });
    } else if (bgl > 7.0) {
      alerts.push({
        id: "bgl-high",
        severity: "urgent",
        title: `Hyperglycaemia — BGL ${bgl} mmol/L`,
        body: `Blood glucose ${bgl} mmol/L — above VRII target range (4.0–7.0 mmol/L). Increase VRII rate. Recheck in 1 hour.`,
        citation: "GL983 §Intrapartum [2023]",
      });
    }
  }

  // ─── Maternal observations ───────────────────────────────────────────
  if (bed.labourStage !== "Latent") {
    if (obs.lastPulse) {
      const ms = now - new Date(obs.lastPulse).getTime();
      if (ms >= HOUR) {
        alerts.push({ id: "pulse-due", severity: "info", title: "Maternal pulse check due", body: `Last recorded ${formatAge(ms)} ago. Hourly pulse in active labour.`, citation: "NICE NG235 §1.4.5 [2023]" });
      }
    } else {
      alerts.push({ id: "pulse-never", severity: "info", title: "Pulse not recorded", body: "Hourly maternal pulse required in active labour.", citation: "NICE NG235 §1.4.5 [2023]" });
    }

    if (obs.lastBP) {
      const limit = isHypertensive ? HOUR : 4 * HOUR;
      const ms = now - new Date(obs.lastBP).getTime();
      if (ms >= limit) {
        alerts.push({
          id: "bp-due",
          severity: isHypertensive ? "urgent" : "info",
          title: isHypertensive ? "BP check overdue (hypertensive patient)" : "BP check due",
          body: isHypertensive ? `Hourly BP required. Last ${formatAge(ms)} ago.` : `4-hourly BP in active labour. Last ${formatAge(ms)} ago.`,
          citation: "NICE NG235 §1.4.5 [2023]",
        });
      }
    } else {
      alerts.push({ id: "bp-never", severity: isHypertensive ? "urgent" : "info", title: "BP not recorded", body: isHypertensive ? "Hourly BP required (hypertensive patient)." : "4-hourly BP required in active labour.", citation: "NICE NG235 §1.4.5 [2023]" });
    }

    if (obs.lastTemp) {
      const ms = now - new Date(obs.lastTemp).getTime();
      if (ms >= 4 * HOUR) {
        alerts.push({ id: "temp-due", severity: "info", title: "Temperature check due", body: `4-hourly temperature in active labour. Last ${formatAge(ms)} ago.`, citation: "NICE NG235 §1.4.5 [2023]" });
      }
    } else {
      alerts.push({ id: "temp-never", severity: "info", title: "Temperature not recorded", body: "4-hourly temperature required in active labour.", citation: "NICE NG235 §1.4.5 [2023]" });
    }
  }

  // ─── Diabetic BGL ────────────────────────────────────────────────────
  if (isDiabetic) {
    if (obs.lastBGL) {
      const ms = now - new Date(obs.lastBGL).getTime();
      if (ms >= HOUR) {
        alerts.push({
          id: "bgl-due",
          severity: "urgent",
          title: `BGL check due (${formatAge(ms)} ago)`,
          body: "Hourly blood glucose in active labour. Target 4.0–7.0 mmol/L. Start VRII if outside target range.",
          citation: "GL983 §Intrapartum [2023]",
        });
      }
    } else {
      alerts.push({
        id: "bgl-never",
        severity: "urgent",
        title: "BGL not recorded (diabetic patient)",
        body: "Hourly blood glucose required. Target 4.0–7.0 mmol/L. Start VRII if outside target range.",
        citation: "GL983 §Intrapartum [2023]",
      });
    }
  }

  // ─── Urine output ────────────────────────────────────────────────────
  if (obs.urineOutput !== undefined && obs.urineOutput < 30) {
    alerts.push({
      id: "oliguria",
      severity: "urgent",
      title: "Oliguria",
      body: `Urine output ${obs.urineOutput} mL/hr — below 30 mL/hr threshold. Escalate to medical team.`,
      citation: "NICE NG235 §1.4.5 [2023]",
    });
  }

  const order = { urgent: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}

export function bedStatusColor(alerts) {
  if (alerts.some(a => a.severity === "urgent")) return "urgent";
  if (alerts.some(a => a.severity === "warning")) return "warning";
  if (alerts.length > 0) return "info";
  return "ok";
}
