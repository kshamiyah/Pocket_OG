// Alert engine — rules from NICE NG235 (Intrapartum Care, Sept 2023) and NICE NG25 (Preterm Labour, Nov 2022)

// CTG feature classification (NICE NG229 §1.4.16–1.4.31) now lives in the shared
// @pocket-og/guidelines package so the pocket-og CTG Classifier and this engine
// stay in lockstep. Re-exported here so existing imports keep working.
export { classifyCTGEntry } from "@pocket-og/guidelines";
import { getUnitSettings } from "../data/unitSettings.js";
import { obsValueAt } from "./bedModel.js";

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

// `unit` holds the unit's local choices (src/data/unitSettings.js); tests pass
// their own, the app uses what this phone has saved.
export function computeAlerts(bed, now = Date.now(), unit = getUnitSettings()) {
  // After birth only maternal safety rules run (observations, sepsis, PPH);
  // labour, CTG and preterm rules stop.
  const delivered = !!bed.delivery;

  const alerts = [];

  const ves = [...(bed.ves ?? [])].sort((a, b) => new Date(a.time) - new Date(b.time));
  const lastVE = ves.length > 0 ? ves[ves.length - 1] : null;
  const oxyLog = bed.oxytocinLog ?? [];
  const currentOx = oxyLog.length > 0 ? oxyLog[oxyLog.length - 1] : null;
  const obs = bed.observations ?? {};
  // ctgLog defined here so tachysystole check can use the most recent source
  const ctgLog = bed.ctgLog ?? [];
  const lastCTG = ctgLog.length > 0 ? ctgLog[ctgLog.length - 1] : null;

  // Remifentanil PCA is not regional analgesia.
  const hasRegionalAnalgesia = bed.analgesia === "Epidural";
  const isNullip = bed.parity === "Para 0";
  const flags = bed.riskFlags ?? [];
  const isDiabetic = flags.some(f => f.startsWith("Diabetic"));
  const isHypertensive = flags.includes("Hypertensive") || flags.includes("Pre-eclampsia");
  // NG195 1.6.1: GBS this pregnancy, or in a previous baby or pregnancy, both
  // call for antibiotics in labour.
  const isGBSThisPregnancy = flags.includes("GBS+");
  const isGBSPrevious = flags.includes("GBS previous");
  const isGBSPos = isGBSThisPregnancy || isGBSPrevious;
  // A temperature of 38°C or more starts the infection pathway too (NG235
  // 1.8.20; GL787 treats maternal pyrexia over 38°C as intra-amniotic infection).
  const tempNow = obs.tempValue ? parseFloat(obs.tempValue) : null;
  const isFever = !delivered && tempNow !== null && tempNow >= 38;
  const isInfection = flags.includes("Infection suspected") || isFever;
  const hasBleeding = flags.includes("APH");
  const isGBSPending = flags.includes("GBS pending");
  // Membrane status comes from the VEs. Only when no VE has recorded membranes yet
  // does it fall back to what was recorded at admission (bed.membranes, etc.).
  const vesKnowMembranes = ves.some(v => v.membranes);
  const membranes = vesKnowMembranes ? (lastVE?.membranes ?? null) : (bed.membranes ?? null);
  const membranesTime = findMembranesTime(ves)
    ?? (!vesKnowMembranes && (membranes === "SROM" || membranes === "AROM") ? bed.membranesTime ?? null : null);
  const membranesRuptured = membranes === "SROM" || membranes === "AROM";
  const lastLiquor = vesKnowMembranes ? (lastVE?.liquor ?? null) : (bed.liquor ?? lastVE?.liquor ?? null);
  const hasMeconium = lastLiquor === "Thin meconium" || lastLiquor === "Thick meconium";

  const gestWks = parseGestWeeks(bed.gestation);
  const isPreterm = gestWks !== null && gestWks < 37;
  const gest = bed.gestation ?? "";

  // Under 28+0 the labour-progress and CTG rules are not validated, so they are
  // switched off and a visible note says so. Preterm, antibiotic and maternal
  // safety rules still run.
  const under28 = gestWks !== null && gestWks < unit.labourRulesFromWk;
  const labourRules = !delivered && !under28;
  if (under28 && !delivered) {
    alerts.push({
      id: "under-28",
      severity: "info",
      title: `Under ${unit.labourRulesFromWk}+0 (${gest}): labour progress and CTG rules are not applied`,
      body: "Individualised care with senior and neonatal input. Preterm, antibiotic and maternal observation alerts still run.",
      citation: "Unit setting (app scope)",
    });
  }

  // Oxytocin is running unless the last entry stopped it (dose 0).
  const oxyRunning = !!currentOx && !currentOx.stopped && currentOx.dose > 0;

  // ─── Preterm — neonatal team (unit setting, default under 34 weeks) ─
  if (!delivered && isPreterm && gestWks < unit.neonatalTeamUnderWk && !bed.neonatalTeamAlerted) {
    alerts.push({
      id: "preterm-neonatal",
      severity: "urgent",
      title: `Preterm ${gest} — alert neonatal team`,
      body: "Ensure NICU/neonatologist notified. Confirm delivery in appropriate setting with resuscitation team present.",
      citation: "Local practice",
    });
  }

  // ─── Preterm — MgSO4 neuroprotection (NICE NG25 1.10.2–1.10.3) ───────
  // Offer 24+0 to 29+6; consider 30+0 to 33+6 in established preterm labour.
  const inEstablishedLabour = bed.labourStage === "Active first stage"
    || bed.labourStage === "Passive second stage" || bed.labourStage === "Active second stage";
  if (!delivered && isPreterm && gestWks >= 23 && gestWks < 24 && !bed.mgso4Given) {
    alerts.push({
      id: "preterm-mgso4",
      severity: "warning",
      title: `MgSO4 neuroprotection: discuss (${gest})`,
      body: "Discuss IV magnesium sulfate for neuroprotection in established preterm labour or planned birth within 24 h (23+0 to 23+6), in the context of her individual circumstances.",
      citation: "NICE NG25 1.10.1 [2019]",
    });
  } else if (!delivered && isPreterm && gestWks >= 24 && gestWks < 30 && !bed.mgso4Given) {
    alerts.push({
      id: "preterm-mgso4",
      severity: "urgent",
      title: `MgSO4 neuroprotection: offer (${gest})`,
      body: "Offer IV magnesium sulfate for neuroprotection in established preterm labour or planned birth within 24 h (24+0 to 29+6). Regimen per NG25 1.10.4.",
      citation: "NICE NG25 1.10.2 [2015]",
    });
  } else if (!delivered && isPreterm && gestWks >= 30 && gestWks < 34 && inEstablishedLabour && !bed.mgso4Given) {
    alerts.push({
      id: "preterm-mgso4",
      severity: "warning",
      title: `MgSO4 neuroprotection: consider (${gest})`,
      body: "Consider IV magnesium sulfate for neuroprotection in established preterm labour or planned birth within 24 h (30+0 to 33+6).",
      citation: "NICE NG25 1.10.3 [2015]",
    });
  }

  // ─── Preterm — antenatal corticosteroids (NICE NG25 1.9.2–1.9.3) ─────
  // Offer 24+0 to 33+6; consider 34+0 to 35+6.
  if (!delivered && isPreterm && gestWks >= 22 && gestWks < 24 && !bed.corticosteroidsConfirmed) {
    alerts.push({
      id: "preterm-steroids",
      severity: "warning",
      title: `Antenatal corticosteroids: discuss (${gest})`,
      body: "Discuss maternal corticosteroids with the woman and the multidisciplinary team in the context of her individual circumstances (22+0 to 23+6).",
      citation: "NICE NG25 1.9.1 [2015, amended 2022]",
    });
  } else if (!delivered && isPreterm && gestWks >= 24 && gestWks < 34 && !bed.corticosteroidsConfirmed) {
    alerts.push({
      id: "preterm-steroids",
      severity: "urgent",
      title: `Antenatal corticosteroids: offer, confirm given (${gest})`,
      body: "Offer maternal corticosteroids in suspected, diagnosed or established preterm labour or P-PROM (24+0 to 33+6). Document if already given or not indicated.",
      citation: "NICE NG25 1.9.2 [2015, amended 2019]",
    });
  } else if (!delivered && isPreterm && gestWks >= 34 && gestWks < 36 && !bed.corticosteroidsConfirmed) {
    alerts.push({
      id: "preterm-steroids",
      severity: "warning",
      title: `Antenatal corticosteroids: consider (${gest})`,
      body: "Consider maternal corticosteroids in suspected, diagnosed or established preterm labour or P-PROM (34+0 to 35+6). Discuss benefits and risks.",
      citation: "NICE NG25 1.9.3 [2015]",
    });
  }

  // ─── Preterm — tocolysis (NICE NG25 1.8.1–1.8.4) ─────────────────────
  // Nifedipine is offered at 26+0 to 33+6 (considered at 24+0 to 25+6) with
  // intact membranes in suspected or diagnosed preterm labour.
  const membranesIntactNow = !membranesRuptured;
  // NG25 1.8.1: bleeding or infection may mean stopping labour is contraindicated.
  const tocolysisCaution = isInfection || flags.includes("APH");
  if (!delivered && isPreterm && gestWks >= 24 && gestWks < 34 && membranesIntactNow && !bed.tocolysisOffered
      && (bed.labourStage === "Latent" || bed.labourStage === "Active first stage")) {
    alerts.push({
      id: "preterm-tocolysis",
      severity: "warning",
      title: tocolysisCaution
        ? `Tocolysis: ${isInfection ? "infection" : "bleeding"} may contraindicate it (${gest})`
        : `Tocolysis: offer or record decision (${gest})`,
      body: tocolysisCaution
        ? "Suspected infection or bleeding may suggest stopping labour is contraindicated (NG25 1.8.1). Record the decision with senior input."
        : "Intact membranes in suspected or diagnosed preterm labour. Weigh the NG25 1.8.1 factors (bleeding, infection, gestation, steroid benefit, neonatal cot availability, her preference).",
      citation: "NICE NG25 1.8.1, 1.8.4 [2015, amended 2022]",
    });
  }

  if (labourRules) {
  // ─── Established first stage duration (NICE NG235 1.8.36) ──────────────
  // First labours last on average 8 h and are unlikely to last over 18 h;
  // second and subsequent labours average 5 h and are unlikely to last over 12 h.
  if (bed.activeFirstStageStartTime && bed.labourStage === "Active first stage") {
    const limit      = isNullip ? 18 * HOUR : 12 * HOUR;
    const limitLabel = isNullip ? "18 hours" : "12 hours";
    const ms = now - new Date(bed.activeFirstStageStartTime).getTime();
    if (ms >= limit) {
      alerts.push({
        id: "active-phase-limit",
        severity: "warning",
        title: `Established first stage over ${limitLabel} (${formatAge(ms)})`,
        body: `${isNullip ? "First" : "Second and subsequent"} labours are unlikely to last over ${limitLabel}. Review progress against the delay criteria (NG235 1.8.41 to 1.8.42).`,
        citation: "NICE NG235 1.8.36 [2007]",
      });
    }
  }

  // ─── ARM reassessment at 2h (NICE NG235 1.8.48–1.8.50) ─────────────────
  // Checks both VE absence AND inadequate contractions post-ARM
  if (bed.armTime && bed.labourStage === "Active first stage") {
    const ms = now - new Date(bed.armTime).getTime();
    const vesAfterARM = ves.filter(ve => new Date(ve.time) > new Date(bed.armTime));
    if (ms >= 2 * HOUR) {
      if (vesAfterARM.length === 0) {
        alerts.push({
          id: "arm-reassess",
          severity: "warning",
          title: `Reassess 2h after ARM (${formatAge(ms)} ago)`,
          body: "Repeat vaginal examination 2 hours after amniotomy. If there is no progress, diagnose delay and transfer to obstetric-led care for review and consideration of oxytocin.",
          citation: "NICE NG235 1.8.48, 1.8.49 [2023]",
        });
      }
    }
  }

  // ─── Progress in the established first stage (NICE NG235 1.8.42, 1.8.45) ─
  // Only examinations in the established first stage count (a latent-phase VE
  // would make a woman look slow the moment she becomes active). A 5-minute
  // tolerance stops a VE taken "2 hours later" being missed by seconds.
  const TOL = 5 * MIN;
  const activeStart = bed.activeFirstStageStartTime ? new Date(bed.activeFirstStageStartTime).getTime() - TOL : null;
  const activeVEs = activeStart == null ? ves : ves.filter(ve => new Date(ve.time).getTime() >= activeStart);
  let slow = null;
  if (bed.labourStage === "Active first stage" && activeVEs.length >= 2) {
    const last = activeVEs[activeVEs.length - 1];
    const prev = activeVEs[activeVEs.length - 2];
    const lastT = new Date(last.time).getTime();
    // Check 1: consecutive VEs about 2 h or more apart, less than 1 cm per 2 h.
    const gap = lastT - new Date(prev.time).getTime();
    const rate = (last.dilation - prev.dilation) / (gap / HOUR);
    // Check 2: less than 2 cm over about 4 h (latest active VE at least 4 h earlier).
    const earlier = [...activeVEs].reverse().find(ve => lastT - new Date(ve.time).getTime() >= 4 * HOUR - TOL);
    const gain4h = earlier ? last.dilation - earlier.dilation : null;
    if (gap >= 2 * HOUR - TOL && rate < 0.5) slow = { kind: "2h", cm: last.dilation - prev.dilation, ms: gap };
    else if (gain4h != null && gain4h < 2) slow = { kind: "4h", cm: gain4h, ms: lastT - new Date(earlier.time).getTime() };
  }

  // ─── VE timing (established first stage) ─────────────────────────────
  // NICE: offer a VE 4-hourly (NG235 1.8.19), and 2 hours after delay is
  // suspected (1.8.45). Amber when due; red 30 minutes later (local choice).
  if (bed.labourStage === "Active first stage") {
    if (!lastVE) {
      alerts.push({
        id: "ve-never",
        severity: "urgent",
        title: "No VE recorded",
        body: "No vaginal examination recorded in the established first stage. Offer 4-hourly VE.",
        citation: "NICE NG235 1.8.19 [2007]",
      });
    } else {
      const ms = now - new Date(lastVE.time).getTime();
      const interval = slow ? 2 * HOUR : 4 * HOUR;
      const why = slow
        ? "Delay suspected: offer a VE 2 hours later and diagnose delay if progress is less than 1 cm."
        : "Offer 4-hourly vaginal examination in the established first stage of labour.";
      const cite = slow ? "NICE NG235 1.8.45 [2007]" : "NICE NG235 1.8.19 [2007]";
      if (ms >= interval + 30 * MIN) {
        alerts.push({
          id: "ve-overdue", severity: "urgent", since: lastVE.time,
          title: `VE overdue (${formatAge(ms)} ago)`,
          body: why, citation: `${cite} · red after 30 min is local`,
        });
      } else if (ms >= interval) {
        alerts.push({
          id: "ve-due", severity: "warning", since: lastVE.time,
          title: `VE due (${formatAge(ms)} ago)`,
          body: why, citation: cite,
        });
      }
    }
  }

  // ─── Latent phase reassessment ───────────────────────────────────────
  if (bed.labourStage === "Latent") {
    const anchorTime = bed.modeOfOnset === "Induced" && bed.inductionStartTime
      ? bed.inductionStartTime
      : bed.admissionTime;
    if (anchorTime) {
      const ms = now - new Date(anchorTime).getTime();
      const sinceLabel = bed.modeOfOnset === "Induced" && bed.inductionStartTime
        ? "since IOL started"
        : "since admission";
      if (ms >= unit.latentReassessH * HOUR) {
        alerts.push({
          id: "latent-reassess",
          severity: "warning",
          title: "Latent phase — reassess now",
          body: `${formatAge(ms)} ${sinceLabel}. Offer reassessment to confirm or exclude established labour (regular contractions and progressive dilatation from 4 cm).`,
          citation: `${unit.latentReassessH} h unit setting · NG235 1.8.1`,
        });
      }
    }
  }

  // ─── Slow progress (NICE NG235 1.8.42, 1.8.45) ──────────────────────────
  if (slow?.kind === "2h") {
    alerts.push({
      id: "slow-progress",
      severity: "urgent",
      title: "Slow labour progress",
      body: `${slow.cm} cm in ${formatAge(slow.ms)} between examinations. Diagnose delay if progress is less than 1 cm 2 hours after delay is suspected; consider amniotomy if membranes intact, and obstetric review.`,
      citation: "NICE NG235 1.8.45 [2007]",
    });
  } else if (slow?.kind === "4h") {
    alerts.push({
      id: "slow-progress",
      severity: "urgent",
      title: "Slow labour progress",
      body: `${slow.cm} cm in ${formatAge(slow.ms)}. Less than 2 cm in 4 hours suggests delay: assess all aspects of progress and re-examine in 2 hours.`,
      citation: "NICE NG235 1.8.42 [2007]",
    });
  }

  // ─── Hyperstimulation ────────────────────────────────────────────────
  // P1-5: Use most recent contraction count from either VE or CTG
  const latestCxSource = (() => {
    const veHasCx  = lastVE  && typeof lastVE.contractions       === "number";
    const ctgHasCx = lastCTG && typeof lastCTG.contractionsPerTen === "number";
    if (!veHasCx && !ctgHasCx) return null;
    if (veHasCx && !ctgHasCx)  return { count: lastVE.contractions, from: "VE", time: lastVE.time };
    if (!veHasCx && ctgHasCx)  return { count: lastCTG.contractionsPerTen, from: "CTG", time: lastCTG.time };
    return new Date(lastVE.time) >= new Date(lastCTG.time)
      ? { count: lastVE.contractions, from: "VE", time: lastVE.time }
      : { count: lastCTG.contractionsPerTen, from: "CTG", time: lastCTG.time };
  })();
  const tooManyContractions = !!latestCxSource && latestCxSource.count >= 5;
  if (tooManyContractions) {
    alerts.push({
      id: "hyperstim",
      severity: "urgent",
      since: latestCxSource.time,
      title: `${latestCxSource.count} contractions in 10 min${oxyRunning ? ": reduce or stop oxytocin" : ""}`,
      body: oxyRunning
        ? `Recorded on the ${latestCxSource.from}. Reduce or stop the oxytocin until she is having 4 or fewer contractions in 10 minutes. Full risk assessment and measures to reduce contraction frequency.`
        : `Recorded on the ${latestCxSource.from}. 5 or more in 10 minutes: full risk assessment and measures to reduce contraction frequency.`,
      citation: oxyRunning ? "NICE NG235 1.8.55 [2023] · NG229 1.4.14 [2022]" : "NICE NG229 1.4.14 [2022]",
    });
  }

  // ─── Oxytocin (NICE NG235 1.8.54–1.8.56) ─────────────────────────────
  const ctgAbnormal = lastCTG && (lastCTG.classification === "suspicious" || lastCTG.classification === "pathological");
  const inSecondStage = bed.labourStage === "Passive second stage" || bed.labourStage === "Active second stage";
  if (oxyRunning && lastCTG?.classification === "pathological") {
    alerts.push({
      id: "oxytocin-stop-pathological",
      severity: "urgent",
      since: lastCTG.time,
      title: "Pathological CTG: stop oxytocin",
      body: "Oxytocin must be discontinued immediately if the CTG is pathological, and urgent obstetrician or senior midwife review sought. Record the stop in the oxytocin log.",
      citation: "NICE NG235 1.8.56 [2023]",
    });
  }
  if (oxyRunning) {
    if (currentOx.dose >= unit.oxytocinMax) {
      alerts.push({
        id: "oxytocin-max",
        severity: "urgent",
        title: "Oxytocin at maximum dose",
        body: `Current dose ${currentOx.dose} mU/min, at or above the unit maximum of ${unit.oxytocinMax} mU/min. Escalate to registrar or consultant.`,
        citation: "Local protocol (verify)",
      });
    } else {
      const msSinceIncrement = now - new Date(currentOx.lastIncrementTime).getTime();
      // No "increase" prompt while the dose is held, contractions are 5 or more,
      // the CTG is abnormal, or she is in the second stage (1.8.54 is first stage).
      // NG235 1.8.54: increase until 3 to 4 in 10, so no prompt once 3 or more
      // are recorded, and none without a CTG on record to judge it by.
      const atTarget = !!latestCxSource && latestCxSource.count >= 3;
      const incrementSafe = !bed.oxytocinHeld && !tooManyContractions && !atTarget && !ctgAbnormal && !inSecondStage && !!lastCTG;
      if (incrementSafe && msSinceIncrement >= 30 * MIN) {
        alerts.push({
          id: "oxytocin-increment",
          severity: "warning",
          title: `Oxytocin increment due (${formatAge(msSinceIncrement)} ago)`,
          body: `Time between increments no more frequent than every 30 minutes; increase until 3 to 4 contractions in 10 minutes. Current dose ${currentOx.dose} mU/min.`,
          citation: "NICE NG235 1.8.54 [2023]",
        });
      }
    }
  }

  // ─── Second stage — passive limit ────────────────────────────────────
  // With regional analgesia pushing may be delayed 1 h (parous) or up to 2 h
  // (nulliparous), then actively encouraged (NG235 1.6.34). Without an epidural,
  // offer further assessment after 1 h if there is no urge to push (NG235 1.9.8).
  if (bed.labourStage === "Passive second stage" && bed.passiveStartTime) {
    const limit = hasRegionalAnalgesia && isNullip ? 2 * HOUR : 1 * HOUR;
    const ms = now - new Date(bed.passiveStartTime).getTime();
    const limitLabel = limit === 2 * HOUR ? "2 hours" : "1 hour";
    const passiveCite = hasRegionalAnalgesia ? "NICE NG235 1.6.34 [2023]" : "NICE NG235 1.9.8 [2007]";
    if (ms >= limit) {
      alerts.push({
        id: "passive-limit",
        severity: "urgent",
        title: `Passive second stage limit reached (${formatAge(ms)})`,
        body: hasRegionalAnalgesia
          ? `${limitLabel} since full dilatation with an epidural (${isNullip ? "nulliparous" : "parous"}). Actively encourage her to push during contractions.`
          : `1 hour since full dilatation without an urge to push. Offer further assessment.`,
        citation: passiveCite,
      });
    }
  }

  // ─── PROM duration alerts ────────────────────────────────────────────
  if (membranesTime) {
    const ms = now - new Date(membranesTime).getTime();
    // GL787 (term PROM): prophylaxis indicated if GBS positive, ROM 48 h or
    // more, or maternal pyrexia over 38°C. GBS+ is covered by gbs-iap below.
    if (ms >= unit.promAntibioticH * HOUR && !isGBSPos && !bed.gbsAntibioticsStarted) {
      alerts.push({
        id: "prom-48h",
        severity: "urgent",
        title: `Membranes ruptured ${formatAge(ms)}: antibiotic prophylaxis indicated`,
        body: `ROM ${unit.promAntibioticH} hours or more (unit setting; GL787 says 48): intrapartum antibiotic prophylaxis is indicated. Regimen: IV benzylpenicillin 3 g stat, then 1.5 g 4-hourly until delivered; penicillin allergy: IV teicoplanin 10 mg/kg stat, then 12-hourly.`,
        citation: "GL787 (local)",
      });
    }
    if (ms >= 24 * HOUR && bed.labourStage === "Latent" && gestWks !== null && gestWks >= 37) {
      alerts.push({
        id: "prom-24h",
        severity: "urgent",
        title: "PROM > 24 hours — offer induction",
        body: `Prelabour rupture of membranes for > 24h without established labour. Offer induction of labour.${isGBSPos ? " GBS+ — offer immediate induction with IV benzylpenicillin." : isGBSPending ? " GBS result pending — check and commence antibiotics if positive." : ""}`,
        citation: isGBSPos ? "NICE NG235 1.7.7 [2023] · GL787" : "NICE NG235 1.7.7 [2023]",
      });
    } else if (ms >= unit.promReviewH * HOUR) {
      alerts.push({
        id: "prom-18h",
        // A review prompt at a local threshold, not an emergency.
        severity: "warning",
        title: `Membranes ruptured over ${unit.promReviewH} hours (${formatAge(ms)})`,
        body: `${isGBSPending ? "GBS result pending: obtain it urgently. " : "Review GBS status. "}Antibiotics if GBS positive, ROM 48 hours or more, or pyrexia over 38°C (GL787); in preterm labour (NG195 1.6.1).`,
        citation: `${unit.promReviewH} h is a unit setting: not in NG195 or GL787`,
      });
    } else if (ms >= (unit.promReviewH - 2) * HOUR) {
      alerts.push({
        id: "prom-16h",
        severity: "warning",
        title: `Membranes ruptured ${formatAge(ms)} — approaching ${unit.promReviewH}h`,
        body: `Review GBS status${isGBSPending ? " (result pending: check now)" : ""} and signs of infection.`,
        citation: "Unit setting",
      });
    }
  }

  } // end labourRules (progress, oxytocin, second stage, PROM)

  // ─── GBS+ — antibiotics required ────────────────────────────────────
  // NICE NG195 1.6.1: offer antibiotics during labour for GBS this pregnancy
  // or preterm labour; 1.6.4: first dose as soon as possible after labour starts.
  // An induction still latent with intact membranes is not yet labour.
  const inLabour = inEstablishedLabour || (bed.labourStage === "Latent" && bed.modeOfOnset !== "Induced");
  // Suspected chorioamnionitis or sepsis: antibiotics as soon as infection is
  // suspected (NG195 1.6.4). Broad-spectrum treatment also covers GBS (GL787:
  // IAP not required if already on antibiotics for chorioamnionitis).
  // Its own "Given": GBS prophylaxis (benzylpenicillin) does not cover it.
  if (!delivered && isInfection && !bed.broadAntibioticsStarted) {
    alerts.push({
      id: "infection-suspected",
      severity: "urgent",
      title: isFever && !flags.includes("Infection suspected")
        ? `Pyrexia ${tempNow}°C: assess for chorioamnionitis or sepsis`
        : "Suspected chorioamnionitis or sepsis: IV antibiotics now",
      body: "If infection is suspected, give the first dose of IV antibiotics as soon as it is suspected and continue until birth; GBS prophylaxis does not cover this. Regimen per local policy (GL787 treats maternal pyrexia over 38°C as intra-amniotic infection). Offer continuous CTG; senior review; assess sepsis risk (NG255).",
      since: isFever ? obs.tempAt ?? obs.lastTemp : undefined,
      citation: "NICE NG195 1.6.1, 1.6.4 · NG229 1.3.2, 1.3.8 · GL787",
    });
  }
  if (!delivered && isGBSPos && !isInfection && (membranesRuptured || inLabour) && !bed.gbsAntibioticsStarted) {
    alerts.push({
      id: "gbs-iap",
      severity: "urgent",
      title: isGBSThisPregnancy ? "GBS+ — IV antibiotic prophylaxis required" : "Previous GBS — IV antibiotic prophylaxis required",
      body: "Give the first dose as soon as possible after labour starts (or membranes rupture) and continue until birth. Regimen per GL787: IV benzylpenicillin 3 g stat, then 1.5 g 4-hourly; penicillin allergy: IV teicoplanin 10 mg/kg stat, then 10 mg/kg 12-hourly.",
      citation: "NICE NG195 1.6.1, 1.6.4 [2021] · GL787",
    });
  } else if (!delivered && isPreterm && !isGBSPos && !isInfection && inLabour && !bed.gbsAntibioticsStarted) {
    alerts.push({
      id: "iap-preterm",
      severity: "urgent",
      title: `Preterm labour (${gest}): offer intrapartum antibiotics`,
      body: "Offer antibiotics during labour to women in preterm labour, first dose as soon as possible after labour starts. Choice of antibiotic per NG195 table 1 and local policy.",
      citation: "NICE NG195 1.6.1, 1.6.4 [2021]",
    });
  }

  // ─── Bleeding (NICE NG235 1.8.20; NG229 1.3.2, 1.3.8) ────────────────
  if (!delivered && hasBleeding && !bed.bleedingReviewed) {
    alerts.push({
      id: "aph",
      severity: "urgent",
      title: "Bleeding: urgent obstetric review",
      body: "Fresh red bleeding is a transfer trigger and antepartum haemorrhage an obstetric emergency (NG235 1.8.20). Urgent obstetric review; offer continuous CTG. Tap Reviewed once seen; the flag stays for handover.",
      citation: "NICE NG235 1.8.20 · NG229 1.3.2, 1.3.8",
    });
  }

  // ─── GBS pending — remind to check result after rupture ─────────────
  if (!delivered && isGBSPending && membranesRuptured && !isGBSPos && !alerts.find(a => a.id.startsWith("prom-"))) {
    alerts.push({
      id: "gbs-pending-rupture",
      severity: "warning",
      title: "GBS result pending — membranes ruptured",
      body: "Obtain GBS result urgently. If positive, commence IV benzylpenicillin 3g stat then 1.5g every 4h until delivery.",
      citation: "GL787 (local)",
    });
  }

  // ─── Liquor / meconium (NICE NG235 1.8.20, 1.8.33) ───────────────────────
  const mecCTG = unit.meconiumCTGMandatory
    ? "Continuous CTG (unit policy: mandatory with meconium)."
    : "Offer continuous CTG; the monitoring method is her choice (NG229 1.3.11).";
  if (labourRules && lastLiquor === "Thick meconium") {
    alerts.push({
      id: "mec-thick",
      severity: "urgent",
      title: "Significant meconium — continuous CTG, notify neonatology",
      body: `${mecCTG} Obstetric-led care; staff trained in advanced neonatal life support may be needed at birth.`,
      citation: unit.meconiumCTGMandatory ? "NICE NG235 1.8.33 [2023] · NG229 1.3.8 · unit setting" : "NICE NG235 1.8.33 [2023] · NG229 1.3.8",
    });
  } else if (labourRules && lastLiquor === "Thin meconium") {
    alerts.push({
      id: "mec-thin",
      severity: "warning",
      title: unit.meconiumCTGMandatory ? "Thin meconium — continuous CTG" : "Thin meconium — discuss continuous CTG",
      body: `${mecCTG} Full risk assessment; escalate if the CTG becomes suspicious or pathological.`,
      citation: unit.meconiumCTGMandatory ? "NICE NG235 1.8.33 [2023] · NG229 1.3.8 · unit setting" : "NICE NG235 1.8.33 [2023] · NG229 1.3.8",
    });
  }

  if (labourRules && lastLiquor === "Blood-stained") {
    alerts.push({
      id: "liquor-blood",
      severity: "warning",
      title: "Blood-stained liquor — assess for abruption / vasa praevia",
      body: "Blood-stained amniotic fluid may indicate placental abruption or vasa praevia. Review fetal heart rate and escalate to senior if concerned.",
      citation: "NICE NG235 1.8.20 [2023]",
    });
  }

  if (labourRules && lastLiquor === "Absent") {
    alerts.push({
      id: "liquor-absent",
      severity: "warning",
      title: "No liquor draining post-rupture — assess for oligohydramnios",
      body: "Absent liquor after membrane rupture may indicate oligohydramnios and cord compression risk. Consider CTG and senior review.",
      citation: "Local practice",
    });
  }

  // ─── Abnormal observation values ─────────────────────────────────────
  const pulse = obs.pulseValue  ? parseFloat(obs.pulseValue)  : null;
  const bpSys = obs.bpSystolic  ? parseFloat(obs.bpSystolic)  : null;
  const bpDia = obs.bpDiastolic ? parseFloat(obs.bpDiastolic) : null;
  const temp  = obs.tempValue   ? parseFloat(obs.tempValue)   : null;
  const bgl   = obs.bglValue    ? parseFloat(obs.bglValue)    : null;
  const rr    = obs.rrValue     ? parseFloat(obs.rrValue)     : null;
  // Each value keeps alerting until a newer value replaces it, and says how old it is.
  const valueSince = name => obsValueAt(obs, name);
  const valueAge = name => { const at = valueSince(name); return at ? now - new Date(at).getTime() : null; };
  const aged = name => { const ms = valueAge(name); return ms != null && ms >= 5 * MIN ? ` (${formatAge(ms)} ago)` : ""; };

  // While the infection prompt is up it carries the temperature; afterwards
  // the pyrexia alert stays until a newer temperature replaces it.
  if (temp !== null && temp >= 38.0) {
    if (!isInfection || bed.broadAntibioticsStarted) {
      alerts.push({
        id: "temp-38",
        severity: "urgent",
        title: `Pyrexia ${temp}°C${aged("temp")} — probable intrauterine infection`, since: valueSince("temp"),
        body: "38°C or above is a transfer trigger and an indication for continuous CTG. If chorioamnionitis is suspected, offer IV antibiotics as soon as infection is suspected. Senior review; consider sepsis.",
        citation: "NICE NG235 1.8.20 · NG229 1.3.8 · NG195 1.6.1, 1.6.4",
      });
    }
  } else if (temp !== null && temp >= 37.5) {
    alerts.push({
      id: "temp-375",
      severity: "warning",
      title: `Temperature ${temp}°C${aged("temp")} — possible infection`, since: valueSince("temp"),
      body: "Repeat in 1 hour: 37.5°C or above on 2 readings 1 hour apart is a transfer trigger. Look for signs of chorioamnionitis.",
      citation: "NICE NG235 1.8.20 [2023]",
    });
  }

  // Repeat-reading rule (NG235 1.8.20: abnormal on 2 readings 15 to 30 minutes
  // apart). The first abnormal reading is amber; it turns red when a repeat
  // within the hour is also abnormal, or when no repeat comes within 30 minutes
  // (both local choices that put the NICE rule into practice).
  const repeatState = (name, abnormal) => {
    const at = valueSince(name);
    const prevRaw = obs[`${name}Prev`];
    const prevAt = obs[`${name}PrevAt`];
    const prev = prevRaw != null ? parseFloat(prevRaw) : null;
    if (prev != null && abnormal(prev) && at && prevAt && new Date(at) - new Date(prevAt) <= 60 * MIN) return "confirmed";
    // A value with no time (older boards) cannot be shown to be recent: treat as unrepeated.
    if (!at || now - new Date(at).getTime() >= 30 * MIN) return "unrepeated";
    return "first";
  };
  const REPEAT_TITLE = { confirmed: "confirmed on repeat", unrepeated: "not repeated", first: "repeat in 15 to 30 min" };

  if (pulse !== null && pulse > 130) {
    alerts.push({
      id: "tachycardia",
      severity: "urgent",
      title: `Maternal tachycardia: pulse ${pulse} bpm${aged("pulse")}`, since: valueSince("pulse"),
      body: "Over 130 is a high-risk criterion for severe illness or death from sepsis (NG255 table 1). Assess for haemorrhage, sepsis, pulmonary embolism or pain. Senior review.",
      citation: "NICE NG255 table 1 · NG235 1.8.20",
    });
  } else if (pulse !== null && pulse > 120) {
    const st = repeatState("pulse", v => v > 120);
    alerts.push({
      id: "tachycardia",
      severity: st === "first" ? "warning" : "urgent",
      title: `Pulse ${pulse} bpm${aged("pulse")}: ${REPEAT_TITLE[st]}`, since: valueSince("pulse"),
      body: st === "first"
        ? "Over 120 on 2 readings 15 to 30 minutes apart is a transfer trigger (NG235 1.8.20). Repeat the pulse; turns red if still over 120 or not repeated within 30 minutes."
        : "Over 120 on 2 readings, or not rechecked. Assess for haemorrhage, sepsis, pulmonary embolism or pain. Escalate to a senior clinician (NG235 1.8.20).",
      citation: st === "first" ? "NICE NG235 1.8.20 [2023]" : "NICE NG235 1.8.20 [2023] · red if not repeated in 30 min is local",
    });
  }

  if (bpSys !== null && bpDia !== null) {
    if (bpSys >= 160 || bpDia >= 110) {
      alerts.push({
        id: "bp-severe",
        severity: "urgent",
        // NG133 1.7.3: every 15 to 30 minutes until below 160/110.
        title: (valueAge("bp") ?? 0) >= 30 * MIN
          ? `Severe BP ${bpSys}/${bpDia}${aged("bp")} — recheck now`
          : `Severe hypertension — BP ${bpSys}/${bpDia} mmHg${aged("bp")}`,
        since: valueSince("bp"),
        body: "Severe hypertension (a single reading of 160/110 or more). Treat urgently per NG133 and local protocol; involve the obstetric consultant. Measure BP every 15 to 30 minutes until below 160/110.",
        citation: "NICE NG235 1.8.20 [2023] · NG133 1.7.3",
      });
    } else if (bpSys >= 140 || bpDia >= 90) {
      alerts.push({
        id: "bp-elevated",
        severity: isHypertensive ? "urgent" : "warning",
        title: `Hypertension — BP ${bpSys}/${bpDia} mmHg${aged("bp")}`, since: valueSince("bp"),
        body: isHypertensive
          ? `BP 140/90 or more in a woman with known hypertension. Hourly BP in labour; review treatment.`
          : `New BP 140/90 or more in labour. Repeat in 15 to 30 minutes (2 consecutive raised readings is a transfer trigger); assess for pre-eclampsia.`,
        citation: "NICE NG235 1.8.20 [2023] · NG133 1.7.3",
      });
    }
  }

  if (bgl !== null) {
    if (bgl < 4.0) {
      alerts.push({
        id: "bgl-low",
        severity: "urgent",
        title: `Hypoglycaemia — BGL ${bgl} mmol/L${aged("bgl")}`, since: valueSince("bgl"),
        body: "Below the 4 to 7 mmol/L target for labour. Treat hypoglycaemia per local protocol (GL983) and recheck.",
        citation: "NICE NG3 1.4.10, 1.4.12 · GL983",
      });
    } else if (bgl > 7.0) {
      alerts.push({
        id: "bgl-high",
        severity: "urgent",
        title: `Hyperglycaemia — BGL ${bgl} mmol/L${aged("bgl")}`, since: valueSince("bgl"),
        body: `Above the 4 to 7 mmol/L target for labour. IV dextrose and insulin if not maintained (NG3 1.4.12); adjust per GL983. Recheck hourly.`,
        citation: "NICE NG3 1.4.10, 1.4.12 · GL983",
      });
    }
  }

  // ─── Low BP / temperature: sepsis risk (NICE NG255 table 1) ──────────
  // Thresholds are the NG255 risk criteria for people who are or have recently
  // been pregnant with suspected sepsis. Low BP also prompts thinking about bleeding.
  if (bpSys !== null && bpSys <= 90) {
    alerts.push({
      id: "bp-low",
      severity: "urgent",
      title: `Low BP — systolic ${bpSys} mmHg${aged("bp")}`, since: valueSince("bp"),
      body: "Systolic 90 mmHg or less is a high-risk criterion for severe illness or death from sepsis (NG255 table 1). Consider haemorrhage and sepsis; urgent senior review.",
      citation: "NICE NG255 1.5.1–1.5.2, table 1",
    });
  } else if (bpSys !== null && bpSys <= 100) {
    alerts.push({
      id: "bp-low",
      severity: "warning",
      title: `Low-normal BP — systolic ${bpSys} mmHg${aged("bp")}`, since: valueSince("bp"),
      body: "Systolic 91 to 100 mmHg is a moderate to high risk criterion if sepsis is suspected (NG255 table 1). Review the whole picture.",
      citation: "NICE NG255 1.5.1–1.5.2, table 1",
    });
  }
  if (temp !== null && temp < 36) {
    alerts.push({
      id: "temp-low",
      severity: "warning",
      title: `Low temperature ${temp}°C${aged("temp")}`, since: valueSince("temp"),
      body: "Temperature below 36°C is a moderate to high risk criterion if sepsis is suspected (NG255 table 1).",
      citation: "NICE NG255 1.5.1–1.5.2, table 1",
    });
  }

  // ─── Respiratory rate (NICE NG255 table 1; NG235 1.8.20) ─────────────
  if (rr !== null && rr < 9) {
    alerts.push({
      id: "rr-low",
      severity: "urgent",
      title: `Respiratory rate ${rr}/min${aged("rr")}`,
      body: "Below 9 on 2 readings 15 to 30 minutes apart is a transfer trigger (NG235 1.8.20). Assess now; the app does not wait for the repeat (local choice).",
      citation: "NICE NG235 1.8.20 [2023] · red on the first reading is local",
      since: valueSince("rr"),
    });
  } else if (rr !== null && rr >= 25) {
    alerts.push({
      id: "rr-high",
      severity: "urgent",
      title: `Respiratory rate ${rr}/min${aged("rr")}`,
      body: "25 or more is a high-risk criterion for severe illness or death from sepsis (NG255 table 1). Senior review.",
      citation: "NICE NG255 1.5.1–1.5.2, table 1",
      since: valueSince("rr"),
    });
  } else if (rr !== null && rr >= 21) {
    const st = repeatState("rr", v => v >= 21);
    alerts.push({
      id: "rr-high",
      severity: st === "first" ? "warning" : "urgent",
      title: `Respiratory rate ${rr}/min${aged("rr")}: ${REPEAT_TITLE[st]}`,
      body: st === "first"
        ? "21 to 24 is a moderate to high risk criterion if sepsis is suspected (NG255 table 1); over 21 on 2 readings 15 to 30 minutes apart is a transfer trigger (NG235 1.8.20). Repeat; turns red if still raised or not repeated within 30 minutes."
        : "Raised on 2 readings, or not rechecked. Senior review and consider sepsis (NG235 1.8.20, NG255 table 1).",
      citation: st === "first" ? "NICE NG255 table 1 · NG235 1.8.20" : "NICE NG235 1.8.20 · NG255 table 1 · red if not repeated in 30 min is local",
      since: valueSince("rr"),
    });
  }

  // ─── PPH after birth ─────────────────────────────────────────────────
  if (delivered && bed.delivery.ebl != null && bed.delivery.ebl >= 500 && !bed.pphReviewed) {
    const major = bed.delivery.ebl > 1000;
    alerts.push({
      id: "pph",
      severity: major ? "urgent" : "warning",
      title: `${major ? "Major" : "Minor"} PPH: EBL ${bed.delivery.ebl} mL`,
      body: major
        ? "Major PPH (more than 1000 mL). Follow the PPH protocol; repeat observations and reassess ongoing loss."
        : "Minor PPH (500 to 1000 mL). Repeat observations and reassess ongoing loss.",
      citation: "RCOG GTG52",
    });
  }

  // ─── Maternal observations due (NICE NG235 1.8.19; NG133 1.7.3) ──────
  if (!delivered && bed.labourStage !== "Latent") {
    if (obs.lastPulse) {
      const ms = now - new Date(obs.lastPulse).getTime();
      if (ms >= HOUR) {
        alerts.push({ id: "pulse-due", severity: "info", title: "Maternal pulse check due", body: `Last recorded ${formatAge(ms)} ago. Hourly pulse in active labour.`, citation: "NICE NG235 1.8.19 [2007]" });
      }
    } else {
      alerts.push({ id: "pulse-never", severity: "info", title: "Pulse not recorded", body: "Hourly maternal pulse required in active labour.", citation: "NICE NG235 1.8.19 [2007]" });
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
          citation: isHypertensive ? "NICE NG133 1.7.3 [2019]" : "NICE NG235 1.8.19 [2007]",
        });
      }
    } else {
      alerts.push({ id: "bp-never", severity: isHypertensive ? "urgent" : "info", title: "BP not recorded", body: isHypertensive ? "Hourly BP required (hypertensive patient)." : "4-hourly BP required in active labour.", citation: "NICE NG235 1.8.19 [2007]" });
    }

    if (obs.lastTemp) {
      const ms = now - new Date(obs.lastTemp).getTime();
      if (ms >= 4 * HOUR) {
        alerts.push({ id: "temp-due", severity: "info", title: "Temperature check due", body: `4-hourly temperature in active labour. Last ${formatAge(ms)} ago.`, citation: "NICE NG235 1.8.19 [2007]" });
      }
    } else {
      alerts.push({ id: "temp-never", severity: "info", title: "Temperature not recorded", body: "4-hourly temperature required in active labour.", citation: "NICE NG235 1.8.19 [2007]" });
    }

    if (obs.lastRR) {
      const ms = now - new Date(obs.lastRR).getTime();
      if (ms >= 4 * HOUR) {
        alerts.push({ id: "rr-due", severity: "info", title: "Respiratory rate due", body: `4-hourly respiratory rate in active labour. Last ${formatAge(ms)} ago.`, citation: "NICE NG235 1.8.19 [2007]" });
      }
    } else {
      alerts.push({ id: "rr-never", severity: "info", title: "Respiratory rate not recorded", body: "4-hourly respiratory rate required in active labour.", citation: "NICE NG235 1.8.19 [2007]" });
    }
  }

  // ─── Active second stage (NICE NG235 1.9.25–1.9.28) ───────────────────
  // Same timings with or without an epidural: reassess after 1 h of active
  // pushing (nulliparous) or 30 min (parous); senior review if birth is not
  // imminent after 2 h (nulliparous) or 1 h (parous).
  if (labourRules && bed.labourStage === "Active second stage" && bed.pushingStartTime) {
    const pushMs   = now - new Date(bed.pushingStartTime).getTime();
    const reassess = isNullip ? HOUR : 30 * MIN;
    const review   = isNullip ? 2 * HOUR : HOUR;
    const cite     = isNullip
      ? (hasRegionalAnalgesia ? "NICE NG235 1.9.27 [2023]" : "NICE NG235 1.9.25 [2023]")
      : (hasRegionalAnalgesia ? "NICE NG235 1.9.28 [2023]" : "NICE NG235 1.9.26 [2023]");
    if (pushMs >= review) {
      alerts.push({
        id: "pushing-senior-review",
        severity: "urgent",
        title: `Pushing ${formatAge(pushMs)}: senior review if birth not imminent`,
        body: `Birth not imminent after ${isNullip ? "2 hours" : "1 hour"} of pushing: refer for senior review and a decision on place and mode of birth.`,
        citation: cite,
      });
    } else if (pushMs >= reassess) {
      alerts.push({
        id: "pushing-reassess",
        severity: "warning",
        title: `Pushing ${formatAge(pushMs)}: reassess progress`,
        body: `After ${isNullip ? "1 hour" : "30 minutes"} of active pushing, reassess progress, contractions and maternal and fetal wellbeing. If no progress, offer VE and consider amniotomy if membranes intact; if still no progress, diagnose delay and escalate for senior review.`,
        citation: cite,
      });
    }
  }

  // ─── Diabetic BGL ────────────────────────────────────────────────────
  if (isDiabetic && !delivered) {
    if (obs.lastBGL) {
      const ms = now - new Date(obs.lastBGL).getTime();
      if (ms >= HOUR) {
        alerts.push({
          id: "bgl-due",
          severity: "urgent",
          title: `BGL check due (${formatAge(ms)} ago)`,
          body: "Monitor capillary plasma glucose every hour during labour and birth; maintain 4 to 7 mmol/L. IV dextrose and insulin if not maintained.",
          citation: "NICE NG3 1.4.10, 1.4.12 · GL983",
        });
      }
    } else {
      alerts.push({
        id: "bgl-never",
        severity: "urgent",
        title: "BGL not recorded (diabetic patient)",
        body: "Hourly capillary glucose in labour; maintain 4 to 7 mmol/L.",
        citation: "NICE NG3 1.4.10, 1.4.12 · GL983",
      });
    }
  }

  // ─── Urine output ────────────────────────────────────────────────────
  if (obs.urineOutput !== undefined && obs.urineOutput < unit.oliguriaMlH) {
    alerts.push({
      id: "oliguria",
      // Optional and quiet: urine output is recorded only when someone chooses to.
      severity: "warning",
      title: `Low urine output: ${obs.urineOutput} mL/hr`,
      body: `Below the unit threshold of ${unit.oliguriaMlH} mL/hr. Review fluid balance and escalate if concerned.`,
      citation: "Unit setting: no NICE threshold in labour",
    });
  }

  // ─── CTG monitoring (NICE NG229) ──────────────────────────────────────
  // A logged classification is acted on in any stage of labour, including
  // latent and induction. The "not logged" and hourly-review prompts apply once
  // she is in established labour or on oxytocin (continuous CTG territory).
  if (labourRules) {
    const presentation = [...ves].reverse().find(v => v.presentation)?.presentation;
    const romMs = membranesRuptured && membranesTime ? now - new Date(membranesTime).getTime() : 0;
    const ctgReasons = [
      // NG229 1.3.2 antenatal maternal risk factors
      (flags.includes("VBAC") || flags.includes("Previous LSCS")) && "Previous CS",
      flags.includes("Other uterine scar") && "Uterine scar",
      isHypertensive && "Hypertension",
      // NG229 lists gestational diabetes only when it needs medication.
      flags.some(f => f.startsWith("Diabetic") && f !== "Diabetic-GDM diet") && "Diabetes",
      hasBleeding && "Bleeding",
      isInfection && "Suspected infection",
      romMs >= 24 * HOUR && !inEstablishedLabour && "ROM 24h+",
      // NG229 1.3.3 antenatal fetal risk factors
      ((presentation && presentation !== "Cephalic") || (!presentation && flags.includes("Non-cephalic"))) && "Non-cephalic",
      flags.includes("FGR") && "FGR/SGA",
      flags.includes("Reduced fetal movements") && "Reduced movements",
      flags.includes("Liquor volume") && "Poly/anhydramnios",
      gestWks !== null && gestWks >= 42 && "Over 42+0",
      // NG229 1.3.8 intrapartum risk factors
      hasMeconium && "Meconium",
      lastLiquor === "Blood-stained" && "Blood-stained liquor",
      temp !== null && temp >= 38 && "Pyrexia",
      pulse !== null && pulse > 120 && "Pulse over 120",
      bpSys !== null && bpDia !== null && (bpSys >= 140 || bpDia >= 90) && "Raised BP",
      alerts.some(a => a.id === "slow-progress") && "Delay",
      bed.analgesia === "Epidural" && "Epidural",
      (oxyRunning || bed.oxytocinStartTime) && "Oxytocin",
      // Local additions (not NG229 indications), a unit setting
      unit.ctgLocalIndications && isPreterm && `Preterm (${gest})`,
      unit.ctgLocalIndications && isGBSPos && "GBS+",
      unit.ctgLocalIndications && isGBSPending && "GBS pending",
      unit.ctgLocalIndications && bed.modeOfOnset === "PPROM" && "PPROM",
    ].filter(Boolean);
    // Unit setting: continuous CTG for everyone in established labour.
    const needsContinuousCTG = unit.ctgForAll || ctgReasons.length > 0;
    const ctgClockRuns = inEstablishedLabour || oxyRunning;

    if (ctgClockRuns && needsContinuousCTG && !lastCTG) {
      alerts.push({
        id: "ctg-not-documented",
        // With a NICE (or local) indication, a missing CTG is due, not background.
        severity: ctgReasons.length ? "warning" : "info",
        title: "Continuous CTG — not yet documented",
        body: `${ctgReasons.length ? `Indication: ${ctgReasons.join(", ")}.` : "Unit policy: continuous CTG in established labour."} Log a CTG review to track fetal wellbeing.`,
        citation: ctgReasons.length ? "NICE NG229 1.3.2, 1.3.3, 1.3.8 [2022]" : "Unit setting",
      });
    }

    if (lastCTG) {
      const msCTG = now - new Date(lastCTG.time).getTime();
      if (lastCTG.classification === "pathological") {
        alerts.push({
          id: "ctg-pathological",
          severity: "urgent",
          since: lastCTG.time,
          title: `Pathological CTG — urgent review (${formatAge(msCTG)} ago)`,
          body: "Urgent review by an obstetrician and a senior midwife. Exclude acute events (cord prolapse, abruption, uterine rupture). Full risk assessment with maternal observations; conservative measures. If still pathological, consider expediting birth.",
          citation: "NICE NG229 1.5.7, 1.5.8 [2022]",
        });
      } else if (lastCTG.classification === "suspicious") {
        const recheck = unit.suspiciousRecheckMin * MIN;
        if (msCTG >= recheck) {
          alerts.push({
            id: "ctg-suspicious-overdue",
            severity: "urgent",
            title: `Suspicious CTG — not reassessed (${formatAge(msCTG)} ago)`,
            body: `Not reassessed within ${unit.suspiciousRecheckMin} minutes (unit setting). Full risk assessment, conservative measures; urgent obstetric or senior midwife review if there are other risk factors such as slow progress, sepsis or meconium.`,
            citation: `NICE NG229 1.5.5, 1.5.6 · ${unit.suspiciousRecheckMin} min unit setting`,
          });
        } else {
          alerts.push({
            id: "ctg-suspicious",
            severity: "warning",
            title: `Suspicious CTG — reassess within ${formatAge(recheck - msCTG)}`,
            body: `Full risk assessment with maternal observations and conservative measures. Accelerations make acidosis unlikely. Logged ${formatAge(msCTG)} ago.`,
            citation: `NICE NG229 1.5.5, 1.5.6 · ${unit.suspiciousRecheckMin} min unit setting`,
          });
        }
      } else if (ctgClockRuns && needsContinuousCTG && msCTG >= 60 * MIN) {
        alerts.push({
          id: "ctg-review-due",
          severity: "info",
          title: `Hourly CTG review due (${formatAge(msCTG)} ago)`,
          body: "Full assessment of the woman and baby every hour, with a fresh-eyes review by another clinician.",
          citation: "NICE NG229 1.3.5, 1.3.6 [2022]",
        });
      }
    }
  }

  const order = { urgent: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity] || alertTier(a.id) - alertTier(b.id));
}

// Clinical priority within a severity, so the most dangerous problem is always
// on top: 0 = deteriorating now (bleeding, severe BP, pathological CTG, sepsis
// signs); 1 = treatment or decision due; 2 = timing reminders.
// Tier 0 in order of urgency, so a woman bleeding heavily outranks one whose
// only problem is a fever. The order is an app choice, shown on the Rules page.
const TIER_0 = [
  "pph", "aph", "bp-low", "ctg-pathological", "oxytocin-stop-pathological", "bp-severe", "rr-low",
  "infection-suspected", "temp-38", "rr-high", "tachycardia", "hyperstim", "bgl-low", "mec-thick", "liquor-blood",
];
const TIER_2 = new Set([
  "ve-overdue", "ve-never", "ve-due", "bp-due", "bp-never", "pulse-due", "pulse-never", "temp-due", "temp-never",
  "rr-due", "rr-never", "bgl-due", "bgl-never", "prom-18h", "prom-16h", "latent-reassess", "ctg-review-due",
  "ctg-not-documented", "oxytocin-increment", "active-phase-limit", "under-28",
]);
export function alertTier(id) {
  const i = TIER_0.indexOf(id);
  return i >= 0 ? i / 100 : TIER_2.has(id) ? 2 : 1;
}

export function bedStatusColor(alerts) {
  if (alerts.some(a => a.severity === "urgent")) return "urgent";
  if (alerts.some(a => a.severity === "warning")) return "warning";
  if (alerts.length > 0) return "info";
  return "ok";
}
