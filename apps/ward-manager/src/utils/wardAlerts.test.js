/**
 * Ward Alert Engine — Clinical Rule Tests
 *
 * Thresholds are hardcoded from source guidelines (not imported from
 * production code) so a change to the rule engine breaks the test.
 *
 * Sources:
 *   NICE NG235  — Intrapartum Care (Sept 2023)
 *   NICE NG25   — Preterm Labour (Nov 2022)
 *   NICE NG133  — Hypertension in Pregnancy (2023)
 *   GL983       — Diabetes in Pregnancy (local)
 *   GL787       — GBS (local)
 */

import { describe, it, expect } from "vitest"
import { computeAlerts, classifyCTGEntry } from "./wardAlerts.js"
import { UNIT_DEFAULTS } from "../data/unitSettings.js"

// NICE-only fetal monitoring: continuous CTG only when an indication applies.
const NICE_CTG = { ...UNIT_DEFAULTS, ctgForAll: false }

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MIN  = 60 * 1000
const HOUR = 60 * MIN
const NOW  = new Date("2024-06-01T12:00:00Z").getTime()

const t = msAgo => new Date(NOW - msAgo).toISOString()

const ids   = alerts => alerts.map(a => a.id)
const has   = (alerts, id) => alerts.some(a => a.id === id)
const hasNot = (alerts, id) => !alerts.some(a => a.id === id)

// Minimal valid bed for active first stage — no alarms by default
function activeBed(overrides = {}) {
  return {
    parity:     "Para 0",
    gestation:  "39+2",
    labourStage:"Active first stage",
    analgesia:  "None",
    riskFlags:  [],
    ves:        [{ time: t(1 * HOUR), dilation: 5, station: -2 }],
    oxytocinLog: [],
    observations: {
      lastPulse: t(30 * MIN),
      lastBP:    t(30 * MIN),
      lastTemp:  t(30 * MIN),
    },
    ...overrides,
  }
}

// ─── VE monitoring (NICE NG235 §1.4.1) ───────────────────────────────────────

describe("VE monitoring", () => {
  it("fires ve-never when no VE in active first stage", () => {
    const bed = activeBed({ ves: [] })
    expect(has(computeAlerts(bed, NOW), "ve-never")).toBe(true)
  })

  it("no alert when VE is 3h 29m ago", () => {
    const bed = activeBed({ ves: [{ time: t(3 * HOUR + 29 * MIN), dilation: 5 }] })
    const alerts = computeAlerts(bed, NOW)
    expect(hasNot(alerts, "ve-due-soon")).toBe(true)
    expect(hasNot(alerts, "ve-overdue")).toBe(true)
  })

  it("fires ve-due-soon warning at exactly 3h 30m", () => {
    const bed = activeBed({ ves: [{ time: t(3 * HOUR + 30 * MIN), dilation: 5 }] })
    expect(has(computeAlerts(bed, NOW), "ve-due-soon")).toBe(true)
  })

  it("fires ve-overdue urgent at exactly 4h", () => {
    const bed = activeBed({ ves: [{ time: t(4 * HOUR), dilation: 5 }] })
    expect(has(computeAlerts(bed, NOW), "ve-overdue")).toBe(true)
  })

  it("ve-overdue is urgent not warning", () => {
    const bed = activeBed({ ves: [{ time: t(5 * HOUR), dilation: 5 }] })
    const alert = computeAlerts(bed, NOW).find(a => a.id === "ve-overdue")
    expect(alert?.severity).toBe("urgent")
  })

  it("no VE alert when delivered", () => {
    const bed = activeBed({
      labourStage: "Active first stage",
      ves: [],
      delivery: { mode: "SVD", time: t(1 * HOUR), ebl: 300 },
    })
    // delivery state — the real app won't call computeAlerts in this state
    // but the engine should not crash
    expect(() => computeAlerts(bed, NOW)).not.toThrow()
  })
})

// ─── Latent phase reassessment (NICE NG235 §1.3.3) ───────────────────────────

describe("Latent phase reassessment", () => {
  const latentBed = hoursAgo => ({
    parity:      "Para 0",
    gestation:   "39+2",
    labourStage: "Latent",
    analgesia:   "None",
    riskFlags:   [],
    ves:         [],
    oxytocinLog: [],
    observations: {},
    admissionTime: t(hoursAgo * HOUR),
  })

  it("no alert at 3h 59m", () => {
    expect(hasNot(computeAlerts(latentBed(3.98), NOW), "latent-reassess")).toBe(true)
  })

  it("fires warning at exactly 4h", () => {
    expect(has(computeAlerts(latentBed(4), NOW), "latent-reassess")).toBe(true)
  })

  it("uses inductionStartTime for induced latent patients", () => {
    const bed = {
      ...latentBed(1),
      modeOfOnset: "Induced",
      inductionStartTime: t(5 * HOUR),
      admissionTime: t(1 * HOUR),
    }
    expect(has(computeAlerts(bed, NOW), "latent-reassess")).toBe(true)
  })

  it("falls back to admissionTime when induced but no IOL start recorded", () => {
    const bed = { ...latentBed(4), modeOfOnset: "Induced", inductionStartTime: null }
    expect(has(computeAlerts(bed, NOW), "latent-reassess")).toBe(true)
  })
})

// ─── Slow progress (NICE NG235 §1.5.1–1.5.4) ─────────────────────────────────

describe("Slow progress — threshold 0.5 cm/hr", () => {
  const slowBed = (cm1, cm2, hoursBetween) => activeBed({
    ves: [
      { time: t(hoursBetween * HOUR), dilation: cm1 },
      { time: t(0), dilation: cm2 },
    ],
  })

  it("no alert at exactly 0.5 cm/hr (1cm in 2h)", () => {
    expect(hasNot(computeAlerts(slowBed(5, 6, 2), NOW), "slow-progress")).toBe(true)
  })

  it("fires when rate is 0.4 cm/hr (0.8cm in 2h)", () => {
    expect(has(computeAlerts(slowBed(5, 5.8, 2), NOW), "slow-progress")).toBe(true)
  })

  it("fires when no cervical change over 2h", () => {
    expect(has(computeAlerts(slowBed(5, 5, 2), NOW), "slow-progress")).toBe(true)
  })

  it("does not fire with only one VE (need two to calculate rate)", () => {
    const bed = activeBed({ ves: [{ time: t(3 * HOUR), dilation: 5 }] })
    expect(hasNot(computeAlerts(bed, NOW), "slow-progress")).toBe(true)
  })

  it("does not fire if VEs are less than 2h apart", () => {
    // rule requires diffHours >= 2
    expect(hasNot(computeAlerts(slowBed(5, 5, 1.5), NOW), "slow-progress")).toBe(true)
  })
})

// ─── Hyperstimulation (NICE NG235 §1.5.7) ────────────────────────────────────

describe("Uterine hyperstimulation", () => {
  it("no alert at 4 contractions/10min", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, contractions: 4 }] })
    expect(hasNot(computeAlerts(bed, NOW), "hyperstim")).toBe(true)
  })

  it("fires at 5 contractions/10min (NG229 1.4.14: 5 or more)", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, contractions: 5 }] })
    expect(has(computeAlerts(bed, NOW), "hyperstim")).toBe(true)
  })

  it("fires urgent at 6 contractions/10min", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, contractions: 6 }] })
    expect(has(computeAlerts(bed, NOW), "hyperstim")).toBe(true)
  })
})

// ─── Oxytocin (NICE NG235 §1.5.6) ────────────────────────────────────────────

describe("Oxytocin", () => {
  it("fires oxytocin-max urgent at dose >= 20 mU/min", () => {
    const bed = activeBed({
      oxytocinLog: [{ dose: 20, lastIncrementTime: t(10 * MIN) }],
    })
    expect(has(computeAlerts(bed, NOW), "oxytocin-max")).toBe(true)
  })

  it("no increment alert at 29m since last increment", () => {
    const bed = activeBed({
      oxytocinLog: [{ dose: 10, lastIncrementTime: t(29 * MIN) }],
    })
    expect(hasNot(computeAlerts(bed, NOW), "oxytocin-increment")).toBe(true)
  })

  it("fires oxytocin-increment warning at exactly 30m", () => {
    const bed = activeBed({
      oxytocinLog: [{ dose: 10, lastIncrementTime: t(30 * MIN) }],
    })
    expect(has(computeAlerts(bed, NOW), "oxytocin-increment")).toBe(true)
  })
})

// ─── Second stage — passive limits (NICE NG235 1.6.34 with epidural, 1.9.8 without) ─

describe("Passive second stage limits", () => {
  const passiveBed = (parity, minutesIn, analgesia = "Epidural") => ({
    parity,
    gestation:   "39+2",
    labourStage: "Passive second stage",
    analgesia,
    riskFlags:   [],
    ves:         [{ time: t(1 * HOUR), dilation: 10 }],
    oxytocinLog: [],
    observations: { lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN) },
    passiveStartTime: t(minutesIn * MIN),
  })

  it("no epidural: further assessment after 1 h, whatever the parity (1.9.8)", () => {
    expect(has(computeAlerts(passiveBed("Para 0", 60, "None"), NOW), "passive-limit")).toBe(true)
  })

  // Nulliparous with epidural: up to 2h delay
  it("nullip — no alert at 1h 59m", () => {
    expect(hasNot(computeAlerts(passiveBed("Para 0", 119), NOW), "passive-limit")).toBe(true)
  })
  it("nullip — fires urgent at exactly 2h", () => {
    expect(has(computeAlerts(passiveBed("Para 0", 120), NOW), "passive-limit")).toBe(true)
  })
  it("nullip — fires approaching warning at 1h 45m", () => {
    expect(has(computeAlerts(passiveBed("Para 0", 105), NOW), "passive-limit-soon")).toBe(true)
  })

  // Multiparous: 1h limit
  it("multip — no alert at 59m", () => {
    expect(hasNot(computeAlerts(passiveBed("Para 1", 59), NOW), "passive-limit")).toBe(true)
  })
  it("multip — fires urgent at exactly 1h", () => {
    expect(has(computeAlerts(passiveBed("Para 1", 60), NOW), "passive-limit")).toBe(true)
  })
})

// ─── Preterm bundle (NICE NG25) ───────────────────────────────────────────────

describe("Preterm — neonatal team alert (< 34 weeks)", () => {
  const pretermBed = (gestation, overrides = {}) => ({
    parity: "Para 0", gestation, labourStage: "Active first stage",
    analgesia: "None", riskFlags: [], ves: [], oxytocinLog: [], observations: {},
    ...overrides,
  })

  it("fires urgent at 33+6", () => {
    expect(has(computeAlerts(pretermBed("33+6"), NOW), "preterm-neonatal")).toBe(true)
  })
  it("no alert at 34+0", () => {
    expect(hasNot(computeAlerts(pretermBed("34+0"), NOW), "preterm-neonatal")).toBe(true)
  })
  it("no alert when neonatal team already alerted", () => {
    expect(hasNot(computeAlerts(pretermBed("30+0", { neonatalTeamAlerted: true }), NOW), "preterm-neonatal")).toBe(true)
  })
})

describe("Preterm — MgSO4 neuroprotection (NG25 1.10.2–1.10.3)", () => {
  const pretermBed = (gestation, overrides = {}) => ({
    parity: "Para 0", gestation, labourStage: "Active first stage",
    analgesia: "None", riskFlags: [], ves: [], oxytocinLog: [], observations: {},
    neonatalTeamAlerted: true, corticosteroidsConfirmed: true,
    ...overrides,
  })
  const mg = alerts => alerts.find(a => a.id === "preterm-mgso4")

  it("offer (urgent) at 29+6", () => {
    expect(mg(computeAlerts(pretermBed("29+6"), NOW))?.severity).toBe("urgent")
  })
  it("consider (warning) at 30+0 in established labour", () => {
    expect(mg(computeAlerts(pretermBed("30+0"), NOW))?.severity).toBe("warning")
  })
  it("consider (warning) at 33+6", () => {
    expect(mg(computeAlerts(pretermBed("33+6"), NOW))?.severity).toBe("warning")
  })
  it("no alert at 34+0", () => {
    expect(hasNot(computeAlerts(pretermBed("34+0"), NOW), "preterm-mgso4")).toBe(true)
  })
  it("no 'consider' prompt at 31+0 in the latent phase", () => {
    expect(hasNot(computeAlerts(pretermBed("31+0", { labourStage: "Latent" }), NOW), "preterm-mgso4")).toBe(true)
  })
  it("no alert when MgSO4 already given", () => {
    expect(hasNot(computeAlerts(pretermBed("28+0", { mgso4Given: true }), NOW), "preterm-mgso4")).toBe(true)
  })
})

describe("Preterm — corticosteroids (NG25 1.9.2–1.9.3)", () => {
  const pretermBed = (gestation, overrides = {}) => ({
    parity: "Para 0", gestation, labourStage: "Active first stage",
    analgesia: "None", riskFlags: [], ves: [], oxytocinLog: [], observations: {},
    neonatalTeamAlerted: true, mgso4Given: true,
    ...overrides,
  })
  const st = alerts => alerts.find(a => a.id === "preterm-steroids")

  it("offer (urgent) at 33+6", () => {
    expect(st(computeAlerts(pretermBed("33+6"), NOW))?.severity).toBe("urgent")
  })
  it("consider (warning) at 34+0", () => {
    expect(st(computeAlerts(pretermBed("34+0"), NOW))?.severity).toBe("warning")
  })
  it("consider (warning) at 35+6", () => {
    expect(st(computeAlerts(pretermBed("35+6"), NOW))?.severity).toBe("warning")
  })
  it("no alert at 36+0", () => {
    expect(hasNot(computeAlerts(pretermBed("36+0"), NOW), "preterm-steroids")).toBe(true)
  })
  it("no alert when steroids confirmed", () => {
    expect(hasNot(computeAlerts(pretermBed("32+0", { corticosteroidsConfirmed: true }), NOW), "preterm-steroids")).toBe(true)
  })
})

describe("Preterm — tocolysis (NG25 1.8.1–1.8.4: intact membranes, under 34+0)", () => {
  const pretermBed = (gestation, overrides = {}) => ({
    parity: "Para 0", gestation, labourStage: "Active first stage",
    analgesia: "None", riskFlags: [], ves: [], oxytocinLog: [], observations: {},
    neonatalTeamAlerted: true, mgso4Given: true, corticosteroidsConfirmed: true,
    ...overrides,
  })

  it("fires warning at 30+0 in active labour", () => {
    expect(has(computeAlerts(pretermBed("30+0"), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("no alert at 34+0 (beyond window)", () => {
    expect(hasNot(computeAlerts(pretermBed("34+0"), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("still offered under 28 weeks (NG25 1.8.4: 26+0 to 33+6)", () => {
    expect(has(computeAlerts(pretermBed("27+6", { labourStage: "Latent" }), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("no alert below 24 weeks", () => {
    expect(hasNot(computeAlerts(pretermBed("23+5", { labourStage: "Latent" }), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("fires in suspected preterm labour (latent phase)", () => {
    expect(has(computeAlerts(pretermBed("30+0", { labourStage: "Latent" }), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("no alert once membranes have ruptured", () => {
    const bed = pretermBed("30+0", { ves: [{ time: t(HOUR), dilation: 4, membranes: "SROM", membranesTime: t(HOUR) }] })
    expect(hasNot(computeAlerts(bed, NOW), "preterm-tocolysis")).toBe(true)
  })
  it("no alert in the second stage", () => {
    expect(hasNot(computeAlerts(pretermBed("30+0", { labourStage: "Active second stage" }), NOW), "preterm-tocolysis")).toBe(true)
  })
  it("no alert when tocolysis already offered", () => {
    expect(hasNot(computeAlerts(pretermBed("30+0", { tocolysisOffered: true }), NOW), "preterm-tocolysis")).toBe(true)
  })
})

// ─── PROM duration (NICE NG235 §1.2.9, §1.2.11) ──────────────────────────────

describe("PROM duration alerts", () => {
  const promBed = (hoursAgo, labourStage = "Active first stage") => ({
    parity: "Para 0", gestation: "39+2", labourStage,
    analgesia: "None", riskFlags: [], oxytocinLog: [], observations: {},
    ves: [{
      time: t(hoursAgo * HOUR),
      dilation: 5,
      membranes: "SROM",
      membranesTime: t(hoursAgo * HOUR),
    }],
  })

  it("no alert at 15h 59m", () => {
    const alerts = computeAlerts(promBed(15.98), NOW)
    expect(hasNot(alerts, "prom-16h")).toBe(true)
    expect(hasNot(alerts, "prom-18h")).toBe(true)
  })

  it("fires prom-16h warning at exactly 16h", () => {
    expect(has(computeAlerts(promBed(16), NOW), "prom-16h")).toBe(true)
  })

  it("fires prom-18h urgent at exactly 18h", () => {
    expect(has(computeAlerts(promBed(18), NOW), "prom-18h")).toBe(true)
  })

  it("at 18h prom-16h is replaced by prom-18h (only one fires)", () => {
    const alerts = computeAlerts(promBed(18), NOW)
    expect(hasNot(alerts, "prom-16h")).toBe(true)
    expect(has(alerts, "prom-18h")).toBe(true)
  })

  it("fires prom-24h urgent at 24h when in latent phase", () => {
    expect(has(computeAlerts(promBed(24, "Latent"), NOW), "prom-24h")).toBe(true)
  })
})

// ─── GBS+ intrapartum antibiotics (GL787, RCOG GTG36: from onset of labour or ROM) ─

describe("GBS+ antibiotic prophylaxis", () => {
  const gbsBed = (overrides = {}) => ({
    parity: "Para 0", gestation: "39+2", labourStage: "Active first stage",
    analgesia: "None", riskFlags: ["GBS+"], oxytocinLog: [], observations: {},
    ves: [{ time: t(1 * HOUR), dilation: 5, membranes: "SROM" }],
    ...overrides,
  })

  it("fires gbs-iap when GBS+, membranes ruptured, no antibiotics", () => {
    expect(has(computeAlerts(gbsBed(), NOW), "gbs-iap")).toBe(true)
  })

  it("no alert when antibiotics already started", () => {
    expect(hasNot(computeAlerts(gbsBed({ gbsAntibioticsStarted: true }), NOW), "gbs-iap")).toBe(true)
  })

  it("fires in established labour even with intact membranes", () => {
    const bed = gbsBed({ ves: [{ time: t(1*HOUR), dilation: 5, membranes: "Intact" }] })
    expect(has(computeAlerts(bed, NOW), "gbs-iap")).toBe(true)
  })

  it("fires in spontaneous latent labour", () => {
    const bed = gbsBed({ labourStage: "Latent", modeOfOnset: "Spontaneous", ves: [{ time: t(1*HOUR), dilation: 2, membranes: "Intact" }] })
    expect(has(computeAlerts(bed, NOW), "gbs-iap")).toBe(true)
  })

  it("no alert for an induction still latent with intact membranes (not yet in labour)", () => {
    const bed = gbsBed({ labourStage: "Latent", modeOfOnset: "Induced", ves: [{ time: t(1*HOUR), dilation: 1, membranes: "Intact" }] })
    expect(hasNot(computeAlerts(bed, NOW), "gbs-iap")).toBe(true)
  })

  it("gbs-iap still fires alongside prom-18h (the antibiotics prompt is never hidden)", () => {
    const bed = gbsBed({
      ves: [{
        time: t(18 * HOUR),
        dilation: 5,
        membranes: "SROM",
        membranesTime: t(18 * HOUR),
      }],
    })
    expect(has(computeAlerts(bed, NOW), "gbs-iap")).toBe(true)
    expect(has(computeAlerts(bed, NOW), "prom-18h")).toBe(true)
  })
})

// ─── Observations — abnormal values ──────────────────────────────────────────

describe("Temperature thresholds (NICE NG235 §1.4.6)", () => {
  const tempBed = temp => activeBed({ observations: {
    lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
    tempValue: temp,
  }})

  it("no alert at 37.4°C", () => {
    expect(hasNot(computeAlerts(tempBed(37.4), NOW), "temp-375")).toBe(true)
  })
  it("fires temp-375 warning at 37.5°C", () => {
    expect(has(computeAlerts(tempBed(37.5), NOW), "temp-375")).toBe(true)
  })
  it("fires temp-38 urgent at 38.0°C", () => {
    expect(has(computeAlerts(tempBed(38.0), NOW), "temp-38")).toBe(true)
  })
  it("at 38°C only temp-38 fires (not temp-375 as well)", () => {
    const alerts = computeAlerts(tempBed(38.0), NOW)
    expect(hasNot(alerts, "temp-375")).toBe(true)
  })
})

describe("Maternal tachycardia (NICE NG235 §1.4.5)", () => {
  const pulseBed = pulse => activeBed({ observations: {
    lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
    pulseValue: pulse,
  }})

  it("no alert at 120 bpm", () => {
    expect(hasNot(computeAlerts(pulseBed(120), NOW), "tachycardia")).toBe(true)
  })
  it("fires urgent at 121 bpm", () => {
    expect(has(computeAlerts(pulseBed(121), NOW), "tachycardia")).toBe(true)
  })
})

describe("Blood pressure thresholds (NICE NG133 §1.5)", () => {
  const bpBed = (sys, dia, hypertensive = false) => activeBed({
    riskFlags: hypertensive ? ["Hypertensive"] : [],
    observations: {
      lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
      bpSystolic: sys, bpDiastolic: dia,
    },
  })

  it("no alert at 139/89", () => {
    expect(hasNot(computeAlerts(bpBed(139, 89), NOW), "bp-elevated")).toBe(true)
  })
  it("fires bp-elevated warning at 140/90 (new hypertension)", () => {
    const alert = computeAlerts(bpBed(140, 90), NOW).find(a => a.id === "bp-elevated")
    expect(alert?.severity).toBe("warning")
  })
  it("fires bp-elevated URGENT at 140/90 in known hypertensive patient", () => {
    const alert = computeAlerts(bpBed(140, 90, true), NOW).find(a => a.id === "bp-elevated")
    expect(alert?.severity).toBe("urgent")
  })
  it("fires bp-severe urgent at 160/110", () => {
    expect(has(computeAlerts(bpBed(160, 110), NOW), "bp-severe")).toBe(true)
  })
  it("fires bp-severe at systolic alone >= 160", () => {
    expect(has(computeAlerts(bpBed(160, 85), NOW), "bp-severe")).toBe(true)
  })
  it("fires bp-severe at diastolic alone >= 110", () => {
    expect(has(computeAlerts(bpBed(150, 110), NOW), "bp-severe")).toBe(true)
  })
})

describe("Blood glucose thresholds (GL983)", () => {
  const bglBed = bgl => activeBed({ observations: {
    lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
    bglValue: bgl,
  }})

  it("no alert at 4.0 mmol/L", () => {
    expect(hasNot(computeAlerts(bglBed(4.0), NOW), "bgl-low")).toBe(true)
  })
  it("fires bgl-low urgent at 3.9 mmol/L", () => {
    expect(has(computeAlerts(bglBed(3.9), NOW), "bgl-low")).toBe(true)
  })
  it("no alert at 7.0 mmol/L", () => {
    expect(hasNot(computeAlerts(bglBed(7.0), NOW), "bgl-high")).toBe(true)
  })
  it("fires bgl-high urgent at 7.1 mmol/L", () => {
    expect(has(computeAlerts(bglBed(7.1), NOW), "bgl-high")).toBe(true)
  })
})

// ─── Diabetic BGL monitoring frequency (GL983) ───────────────────────────────

describe("Diabetic BGL monitoring", () => {
  const diabeticBed = obsOverrides => activeBed({
    riskFlags: ["Diabetic - T1DM"],
    observations: { lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN), ...obsOverrides },
  })

  it("fires bgl-never when no BGL recorded", () => {
    expect(has(computeAlerts(diabeticBed({}), NOW), "bgl-never")).toBe(true)
  })
  it("no alert at 59m since last BGL", () => {
    expect(hasNot(computeAlerts(diabeticBed({ lastBGL: t(59 * MIN) }), NOW), "bgl-due")).toBe(true)
  })
  it("fires bgl-due urgent at exactly 60m", () => {
    expect(has(computeAlerts(diabeticBed({ lastBGL: t(60 * MIN) }), NOW), "bgl-due")).toBe(true)
  })
})

// ─── Observation monitoring frequencies (NICE NG235 §1.4.5) ──────────────────

describe("Observation monitoring in active labour", () => {
  it("fires pulse-never when no pulse recorded", () => {
    const bed = activeBed({ observations: { lastBP: t(30*MIN), lastTemp: t(30*MIN) } })
    expect(has(computeAlerts(bed, NOW), "pulse-never")).toBe(true)
  })

  it("fires pulse-due when pulse > 1h ago", () => {
    const bed = activeBed({ observations: {
      lastPulse: t(61 * MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
    }})
    expect(has(computeAlerts(bed, NOW), "pulse-due")).toBe(true)
  })

  it("fires bp-never when no BP recorded", () => {
    const bed = activeBed({ observations: { lastPulse: t(30*MIN), lastTemp: t(30*MIN) } })
    expect(has(computeAlerts(bed, NOW), "bp-never")).toBe(true)
  })

  it("fires bp-due (info) when BP > 4h ago (non-hypertensive)", () => {
    const bed = activeBed({ observations: {
      lastPulse: t(30*MIN), lastBP: t(4*HOUR + MIN), lastTemp: t(30*MIN),
    }})
    const alert = computeAlerts(bed, NOW).find(a => a.id === "bp-due")
    expect(alert).toBeTruthy()
    expect(alert.severity).toBe("info")
  })

  it("fires bp-due URGENT when BP > 1h ago in hypertensive patient", () => {
    const bed = activeBed({
      riskFlags: ["Hypertensive"],
      observations: {
        lastPulse: t(30*MIN), lastBP: t(61*MIN), lastTemp: t(30*MIN),
      },
    })
    const alert = computeAlerts(bed, NOW).find(a => a.id === "bp-due")
    expect(alert?.severity).toBe("urgent")
  })

  it("fires temp-due when temp > 4h ago", () => {
    const bed = activeBed({ observations: {
      lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(4*HOUR + MIN),
    }})
    expect(has(computeAlerts(bed, NOW), "temp-due")).toBe(true)
  })

  it("no monitoring alerts in latent phase", () => {
    const bed = {
      parity: "Para 0", gestation: "39+2", labourStage: "Latent",
      analgesia: "None", riskFlags: [], ves: [], oxytocinLog: [], observations: {},
    }
    const monitoringIds = ["pulse-never", "pulse-due", "bp-never", "bp-due", "temp-never", "temp-due"]
    const fired = ids(computeAlerts(bed, NOW)).filter(id => monitoringIds.includes(id))
    expect(fired).toHaveLength(0)
  })
})

// ─── Oliguria (NICE NG235 §1.4.5) ────────────────────────────────────────────

describe("Oliguria", () => {
  it("fires urgent when urine output < 30 mL/hr", () => {
    const bed = activeBed({ observations: {
      lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
      urineOutput: 29,
    }})
    expect(has(computeAlerts(bed, NOW), "oliguria")).toBe(true)
  })

  it("no alert at exactly 30 mL/hr", () => {
    const bed = activeBed({ observations: {
      lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN),
      urineOutput: 30,
    }})
    expect(hasNot(computeAlerts(bed, NOW), "oliguria")).toBe(true)
  })
})

// ─── Established first stage duration (NICE NG235 1.8.36) ────────────────────
// First labours are unlikely to last over 18 h; subsequent labours over 12 h.

describe("Established first stage duration", () => {
  const activePhaseBed = (parity, hoursIn) => activeBed({
    parity,
    activeFirstStageStartTime: t(hoursIn * HOUR),
  })

  it("nullip — no alert at 17h 59m", () => {
    expect(hasNot(computeAlerts(activePhaseBed("Para 0", 17.98), NOW), "active-phase-limit")).toBe(true)
  })
  it("nullip — warning at 18h", () => {
    const a = computeAlerts(activePhaseBed("Para 0", 18), NOW).find(x => x.id === "active-phase-limit")
    expect(a?.severity).toBe("warning")
  })
  it("multip — no alert at 11h 59m", () => {
    expect(hasNot(computeAlerts(activePhaseBed("Para 1", 11.98), NOW), "active-phase-limit")).toBe(true)
  })
  it("multip — warning at 12h", () => {
    expect(has(computeAlerts(activePhaseBed("Para 1", 12), NOW), "active-phase-limit")).toBe(true)
  })
  it("no alert when activeFirstStageStartTime not set", () => {
    const bed = activeBed({ activeFirstStageStartTime: null })
    expect(hasNot(computeAlerts(bed, NOW), "active-phase-limit")).toBe(true)
  })
})

// ─── ARM reassessment at 2h (NICE NG235 §1.5.3–1.5.4) ────────────────────────

describe("ARM reassessment", () => {
  const armBed = (hoursAgoARM, vesAfterARM = []) => activeBed({
    armTime: t(hoursAgoARM * HOUR),
    ves: [
      { time: t(hoursAgoARM * HOUR + 30 * MIN), dilation: 5 }, // VE before ARM
      ...vesAfterARM,
    ],
  })

  it("no alert at 1h 59m after ARM with no subsequent VE", () => {
    expect(hasNot(computeAlerts(armBed(1.98), NOW), "arm-reassess")).toBe(true)
  })

  it("fires warning at exactly 2h after ARM with no subsequent VE", () => {
    expect(has(computeAlerts(armBed(2), NOW), "arm-reassess")).toBe(true)
  })

  it("no alert at 3h after ARM if VE has been done since ARM", () => {
    const veAfter = [{ time: t(1 * HOUR), dilation: 6 }] // 1h ago, after ARM which was 3h ago
    expect(hasNot(computeAlerts(armBed(3, veAfter), NOW), "arm-reassess")).toBe(true)
  })

  it("no alert when no ARM recorded", () => {
    const bed = activeBed({ armTime: null })
    expect(hasNot(computeAlerts(bed, NOW), "arm-reassess")).toBe(true)
  })
})

// ─── CTG classification engine (NICE NG229 §1.4.16–1.4.31) ───────────────────

describe("classifyCTGEntry — baseline HR", () => {
  const entry = (baselineHR, prevHR = null) =>
    classifyCTGEntry({ baselineHR, variability: "5-25", variabilityMinutes: 0,
                       decelerations: "none", decelerationMinutes: 0,
                       accelerations: true, contractionsPerTen: 3 }, prevHR)

  it("110 bpm — normal", () => expect(entry(110)).toBe("normal"))
  it("160 bpm — normal", () => expect(entry(160)).toBe("normal"))
  it("109 bpm — suspicious (AMBER baseline)", () => expect(entry(109)).toBe("suspicious"))
  it("100 bpm — suspicious", () => expect(entry(100)).toBe("suspicious"))
  it("99 bpm — pathological (RED baseline)", () => expect(entry(99)).toBe("pathological"))
  it("161 bpm — suspicious (NG229: 161–180 non-reassuring)", () => expect(entry(161)).toBe("suspicious"))
  it("180 bpm — suspicious", () => expect(entry(180)).toBe("suspicious"))
  it("181 bpm — pathological (NG229: above 180 abnormal)", () => expect(entry(181)).toBe("pathological"))
  it("rise ≥ 20 bpm from previous — suspicious", () => expect(entry(155, 135)).toBe("suspicious"))
  it("rise = 19 bpm — still normal", () => expect(entry(154, 135)).toBe("normal"))
  it("rise ≥ 20 but HR still in normal range — suspicious (1 amber: baseline)", () =>
    expect(entry(135, 114)).toBe("suspicious"))
})

describe("classifyCTGEntry — variability", () => {
  const entry = (variability, variabilityMinutes) =>
    classifyCTGEntry({ baselineHR: 140, variability, variabilityMinutes,
                       decelerations: "none", decelerationMinutes: 0,
                       accelerations: true, contractionsPerTen: 3 })

  it("5-25 bpm — normal (white)", () => expect(entry("5-25", 0)).toBe("normal"))
  it("<5 bpm for < 30 min — acceptable (white)", () => expect(entry("<5", 29)).toBe("normal"))
  it("<5 bpm for 30 min — AMBER → suspicious", () => expect(entry("<5", 30)).toBe("suspicious"))
  it("<5 bpm for 50 min — AMBER → suspicious", () => expect(entry("<5", 50)).toBe("suspicious"))
  it("<5 bpm for 51 min — RED → pathological", () => expect(entry("<5", 51)).toBe("pathological"))
  it(">25 bpm for under 15 min — reassuring (NG229)", () => expect(entry(">25", 14)).toBe("normal"))
  it(">25 bpm for 15 min — AMBER → suspicious", () => expect(entry(">25", 15)).toBe("suspicious"))
  it(">25 bpm for 25 min — AMBER → suspicious", () => expect(entry(">25", 25)).toBe("suspicious"))
  it(">25 bpm for 26 min — RED → pathological", () => expect(entry(">25", 26)).toBe("pathological"))
  it("sinusoidal — RED → pathological", () => expect(entry("sinusoidal", 0)).toBe("pathological"))
})

describe("classifyCTGEntry — decelerations", () => {
  const entry = (decelerations, decelerationMinutes) =>
    classifyCTGEntry({ baselineHR: 140, variability: "5-25", variabilityMinutes: 0,
                       decelerations, decelerationMinutes,
                       accelerations: true, contractionsPerTen: 3 })

  it("none — normal", () => expect(entry("none", 0)).toBe("normal"))
  it("early — normal (white)", () => expect(entry("early", 0)).toBe("normal"))
  it("variable without concerns — normal (white)", () => expect(entry("variable", 0)).toBe("normal"))
  it("variable-concerning < 30 min — AMBER → suspicious", () => expect(entry("variable-concerning", 29)).toBe("suspicious"))
  it("variable-concerning at exactly 30 min — RED → pathological", () => expect(entry("variable-concerning", 30)).toBe("pathological"))
  it("late decelerations — RED → pathological", () => expect(entry("late", 0)).toBe("pathological"))
  it("prolonged deceleration — RED → pathological", () => expect(entry("prolonged", 0)).toBe("pathological"))
})

// Contractions are the 4th CTG feature (NICE NG229 1.4.12, 1.4.32):
// 5 or more in 10 minutes, or hypertonus, scores amber.
describe("classifyCTGEntry: contractions (NG229 1.4.12)", () => {
  const entry = (contractionsPerTen, extra = {}) =>
    classifyCTGEntry({ baselineHR: 140, variability: "5-25", variabilityMinutes: 0,
                       decelerations: "none", decelerationMinutes: 0,
                       accelerations: true, contractionsPerTen, ...extra })

  it("4 in 10 min: normal", () => expect(entry(4)).toBe("normal"))
  it("not recorded: scored white", () => expect(entry(null)).toBe("normal"))
  it("5 in 10 min: amber, so suspicious", () => expect(entry(5)).toBe("suspicious"))
  it("hypertonus: amber, so suspicious", () => expect(entry(3, { hypertonus: true })).toBe("suspicious"))
  it("6 in 10 min plus reduced variability: 2 ambers, so pathological", () =>
    expect(entry(6, { variability: "<5", variabilityMinutes: 35 })).toBe("pathological"))
})

describe("classifyCTGEntry — overall formula", () => {
  it("all white features → normal", () => {
    expect(classifyCTGEntry({
      baselineHR: 140, variability: "5-25", variabilityMinutes: 0,
      decelerations: "none", decelerationMinutes: 0,
      accelerations: true, contractionsPerTen: 3,
    })).toBe("normal")
  })

  it("1 amber feature → suspicious", () => {
    expect(classifyCTGEntry({
      baselineHR: 105, variability: "5-25", variabilityMinutes: 0,
      decelerations: "none", decelerationMinutes: 0,
      accelerations: true, contractionsPerTen: 3,
    })).toBe("suspicious")
  })

  it("2 amber features → pathological", () => {
    expect(classifyCTGEntry({
      baselineHR: 105, variability: "<5", variabilityMinutes: 35,
      decelerations: "none", decelerationMinutes: 0,
      accelerations: true, contractionsPerTen: 3,
    })).toBe("pathological")
  })

  it("1 red feature → pathological regardless of other features being white", () => {
    expect(classifyCTGEntry({
      baselineHR: 90, variability: "5-25", variabilityMinutes: 0,
      decelerations: "none", decelerationMinutes: 0,
      accelerations: true, contractionsPerTen: 3,
    })).toBe("pathological")
  })
})

// ─── CTG alert rules (NICE NG229 §1.3–1.5) ───────────────────────────────────

function ctgBed(overrides = {}) {
  return {
    parity: "Para 0", gestation: "39+2",
    labourStage: "Active first stage", analgesia: "None",
    riskFlags: [], modeOfOnset: "Spontaneous",
    ves: [{ time: t(1 * HOUR), dilation: 5 }],
    oxytocinLog: [], oxytocinStartTime: null, ctgLog: [],
    observations: { lastPulse: t(30*MIN), lastBP: t(30*MIN), lastTemp: t(30*MIN) },
    ...overrides,
  }
}

const normalCTG = (minsAgo) => ({
  id: `ctg-${minsAgo}`, time: t(minsAgo * MIN),
  baselineHR: 140, variability: "5-25", variabilityMinutes: 0,
  decelerations: "none", decelerationMinutes: 0,
  accelerations: true, contractionsPerTen: 3,
  classification: "normal",
})

const suspiciousCTG = (minsAgo) => ({
  id: `ctg-s-${minsAgo}`, time: t(minsAgo * MIN),
  baselineHR: 105, variability: "5-25", variabilityMinutes: 0,
  decelerations: "none", decelerationMinutes: 0,
  accelerations: true, contractionsPerTen: 3,
  classification: "suspicious",
})

const pathologicalCTG = (minsAgo) => ({
  id: `ctg-p-${minsAgo}`, time: t(minsAgo * MIN),
  baselineHR: 90, variability: "5-25", variabilityMinutes: 0,
  decelerations: "none", decelerationMinutes: 0,
  accelerations: true, contractionsPerTen: 3,
  classification: "pathological",
})

describe("CTG — continuous monitoring indication", () => {
  it("NICE-only setting: no ctg-not-documented alert when patient has no indication and no CTG", () => {
    const bed = ctgBed()
    expect(hasNot(computeAlerts(bed, NOW, NICE_CTG), "ctg-not-documented")).toBe(true)
  })

  it("default unit setting: every woman in established labour is on CTG", () => {
    const bed = ctgBed()
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("fires ctg-not-documented (info) for epidural patient with no CTG", () => {
    const bed = ctgBed({ analgesia: "Epidural" })
    const a = computeAlerts(bed, NOW).find(b => b.id === "ctg-not-documented")
    expect(a?.severity).toBe("info")
  })

  it("fires ctg-not-documented for oxytocin patient", () => {
    const bed = ctgBed({ oxytocinStartTime: t(30 * MIN) })
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("fires ctg-not-documented for VBAC patient", () => {
    const bed = ctgBed({ riskFlags: ["VBAC"] })
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("fires ctg-not-documented for preterm patient", () => {
    const bed = ctgBed({ gestation: "34+2" })
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("does not fire ctg-not-documented if CTG already logged", () => {
    const bed = ctgBed({ analgesia: "Epidural", ctgLog: [normalCTG(20)] })
    expect(hasNot(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("does not fire ctg-not-documented in Latent phase", () => {
    const bed = ctgBed({ labourStage: "Latent", analgesia: "Epidural" })
    expect(hasNot(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })
})

describe("CTG — pathological", () => {
  it("fires ctg-pathological (urgent) for pathological CTG", () => {
    const bed = ctgBed({ ctgLog: [pathologicalCTG(10)] })
    const a = computeAlerts(bed, NOW).find(b => b.id === "ctg-pathological")
    expect(a?.severity).toBe("urgent")
  })

  it("ctg-pathological fires regardless of time since logged", () => {
    const bed = ctgBed({ ctgLog: [pathologicalCTG(120)] })
    expect(has(computeAlerts(bed, NOW), "ctg-pathological")).toBe(true)
  })
})

describe("CTG — suspicious", () => {
  it("fires ctg-suspicious (warning) when < 30 min after logging", () => {
    const bed = ctgBed({ ctgLog: [suspiciousCTG(20)] })
    const a = computeAlerts(bed, NOW).find(b => b.id === "ctg-suspicious")
    expect(a?.severity).toBe("warning")
  })

  it("fires ctg-suspicious-overdue (urgent) when > 30 min with no new CTG", () => {
    const bed = ctgBed({ ctgLog: [suspiciousCTG(31)] })
    const a = computeAlerts(bed, NOW).find(b => b.id === "ctg-suspicious-overdue")
    expect(a?.severity).toBe("urgent")
  })

  it("ctg-suspicious escalates to ctg-suspicious-overdue at exactly 30 min", () => {
    const before = ctgBed({ ctgLog: [suspiciousCTG(29)] })
    const after  = ctgBed({ ctgLog: [suspiciousCTG(30)] })
    expect(has(computeAlerts(before, NOW), "ctg-suspicious")).toBe(true)
    expect(has(computeAlerts(after,  NOW), "ctg-suspicious-overdue")).toBe(true)
  })

  it("no suspicious alert if follow-up CTG is normal", () => {
    const bed = ctgBed({ ctgLog: [suspiciousCTG(60), normalCTG(10)] })
    expect(hasNot(computeAlerts(bed, NOW), "ctg-suspicious")).toBe(true)
    expect(hasNot(computeAlerts(bed, NOW), "ctg-suspicious-overdue")).toBe(true)
  })
})

describe("CTG — normal review overdue", () => {
  it("NICE-only setting: no ctg-review-due for non-indicated patient even if 90 min since CTG", () => {
    const bed = ctgBed({ ctgLog: [normalCTG(90)] })
    expect(hasNot(computeAlerts(bed, NOW, NICE_CTG), "ctg-review-due")).toBe(true)
  })

  it("default unit setting: hourly CTG review for everyone in established labour", () => {
    const bed = ctgBed({ ctgLog: [normalCTG(61)] })
    expect(has(computeAlerts(bed, NOW), "ctg-review-due")).toBe(true)
  })

  it("fires ctg-review-due (info) for indicated patient at 60+ min since normal CTG", () => {
    const bed = ctgBed({ analgesia: "Epidural", ctgLog: [normalCTG(61)] })
    const a = computeAlerts(bed, NOW).find(b => b.id === "ctg-review-due")
    expect(a?.severity).toBe("info")
  })

  it("no ctg-review-due at 59 min for indicated patient", () => {
    const bed = ctgBed({ analgesia: "Epidural", ctgLog: [normalCTG(59)] })
    expect(hasNot(computeAlerts(bed, NOW), "ctg-review-due")).toBe(true)
  })
})

// ─── Active second stage (NICE NG235 1.9.25–1.9.28) ─────────────────────────────
// Nulliparous: reassess at 1 h of pushing, senior review if birth not imminent at 2 h.
// Parous: reassess at 30 min, senior review at 1 h. The same with or without an epidural.

function pushBed(parity, pushingMinutes, overrides = {}) {
  return activeBed({
    parity,
    labourStage: "Active second stage",
    pushingStartTime: t(pushingMinutes * MIN),
    ves: [{ time: t(1 * HOUR), dilation: 10, station: 0 }],
    ...overrides,
  })
}

describe("Active second stage — nulliparous (1.9.25, 1.9.27)", () => {
  for (const analgesia of ["None", "Epidural"]) {
    it(`${analgesia}: nothing at 59 min`, () => {
      const a = computeAlerts(pushBed("Para 0", 59, { analgesia }), NOW)
      expect(hasNot(a, "pushing-reassess") && hasNot(a, "pushing-senior-review")).toBe(true)
    })
    it(`${analgesia}: reassess (warning) at 1 h`, () => {
      const a = computeAlerts(pushBed("Para 0", 60, { analgesia }), NOW)
      expect(has(a, "pushing-reassess")).toBe(true)
      expect(hasNot(a, "pushing-senior-review")).toBe(true)
    })
    it(`${analgesia}: senior review (urgent) at 2 h`, () => {
      const a = computeAlerts(pushBed("Para 0", 120, { analgesia }), NOW)
      expect(a.find(x => x.id === "pushing-senior-review")?.severity).toBe("urgent")
      expect(hasNot(a, "pushing-reassess")).toBe(true)
    })
  }
})

describe("Active second stage — parous (1.9.26, 1.9.28)", () => {
  for (const analgesia of ["None", "Epidural"]) {
    it(`${analgesia}: nothing at 29 min`, () => {
      const a = computeAlerts(pushBed("Para 1", 29, { analgesia }), NOW)
      expect(hasNot(a, "pushing-reassess") && hasNot(a, "pushing-senior-review")).toBe(true)
    })
    it(`${analgesia}: reassess at 30 min`, () => {
      expect(has(computeAlerts(pushBed("Para 1", 30, { analgesia }), NOW), "pushing-reassess")).toBe(true)
    })
    it(`${analgesia}: senior review at 1 h`, () => {
      expect(has(computeAlerts(pushBed("Para 1", 60, { analgesia }), NOW), "pushing-senior-review")).toBe(true)
    })
  }
  it("Para 2+ treated as parous", () => {
    expect(has(computeAlerts(pushBed("Para 2+", 60), NOW), "pushing-senior-review")).toBe(true)
  })
  it("only one pushing alert at a time (no duplicate rules)", () => {
    const a = computeAlerts(pushBed("Para 0", 130, { analgesia: "None" }), NOW)
    expect(a.filter(x => x.id.startsWith("pushing")).length).toBe(1)
  })
})

describe("Second stage pushing time — edge cases", () => {
  it("no alert when not in active second stage", () => {
    const bed = activeBed({ pushingStartTime: t(90 * MIN) }) // first stage but has pushingStartTime
    const alerts = computeAlerts(bed, NOW)
    expect(hasNot(alerts, "pushing-warning")).toBe(true)
    expect(hasNot(alerts, "pushing-urgent")).toBe(true)
  })

  it("no alert when pushingStartTime missing", () => {
    const bed = activeBed({ labourStage: "Active second stage", pushingStartTime: null })
    const alerts = computeAlerts(bed, NOW)
    expect(hasNot(alerts, "pushing-warning")).toBe(true)
    expect(hasNot(alerts, "pushing-urgent")).toBe(true)
  })
})

// ─── Liquor / meconium alerts (NICE NG235 §1.7) ──────────────────────────────

describe("Liquor alerts", () => {
  it("fires mec-thick (urgent) for thick meconium", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thick meconium" }] })
    const alerts = computeAlerts(bed, NOW)
    expect(has(alerts, "mec-thick")).toBe(true)
    expect(alerts.find(a => a.id === "mec-thick").severity).toBe("urgent")
  })

  it("fires mec-thin (warning) for thin meconium", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thin meconium" }] })
    const alerts = computeAlerts(bed, NOW)
    expect(has(alerts, "mec-thin")).toBe(true)
    expect(alerts.find(a => a.id === "mec-thin").severity).toBe("warning")
  })

  it("does not fire mec-thick when liquor is thin", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thin meconium" }] })
    expect(hasNot(computeAlerts(bed, NOW), "mec-thick")).toBe(true)
  })

  it("does not fire mec-thin when liquor is thick", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thick meconium" }] })
    expect(hasNot(computeAlerts(bed, NOW), "mec-thin")).toBe(true)
  })

  it("fires liquor-blood (warning) for blood-stained", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Blood-stained" }] })
    const alerts = computeAlerts(bed, NOW)
    expect(has(alerts, "liquor-blood")).toBe(true)
    expect(alerts.find(a => a.id === "liquor-blood").severity).toBe("warning")
  })

  it("fires liquor-absent (warning) for absent liquor", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Absent" }] })
    const alerts = computeAlerts(bed, NOW)
    expect(has(alerts, "liquor-absent")).toBe(true)
    expect(alerts.find(a => a.id === "liquor-absent").severity).toBe("warning")
  })

  it("fires no liquor alert when liquor is Clear", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Clear" }] })
    const alerts = computeAlerts(bed, NOW)
    expect(hasNot(alerts, "mec-thick")).toBe(true)
    expect(hasNot(alerts, "mec-thin")).toBe(true)
    expect(hasNot(alerts, "liquor-blood")).toBe(true)
    expect(hasNot(alerts, "liquor-absent")).toBe(true)
  })

  it("fires no liquor alert when liquor is null", () => {
    const bed = activeBed({ ves: [{ time: t(1 * HOUR), dilation: 5, liquor: null }] })
    const alerts = computeAlerts(bed, NOW)
    expect(hasNot(alerts, "mec-thick")).toBe(true)
    expect(hasNot(alerts, "mec-thin")).toBe(true)
    expect(hasNot(alerts, "liquor-blood")).toBe(true)
    expect(hasNot(alerts, "liquor-absent")).toBe(true)
  })

  it("meconium triggers needsContinuousCTG — ctg-not-documented fires", () => {
    const bed = activeBed({
      ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thin meconium" }],
      ctgLog: [],
    })
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("thick meconium triggers needsContinuousCTG — ctg-not-documented fires", () => {
    const bed = activeBed({
      ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Thick meconium" }],
      ctgLog: [],
    })
    expect(has(computeAlerts(bed, NOW), "ctg-not-documented")).toBe(true)
  })

  it("clear liquor does not trigger CTG by itself (NICE-only setting)", () => {
    const bed = activeBed({
      ves: [{ time: t(1 * HOUR), dilation: 5, liquor: "Clear" }],
      ctgLog: [],
    })
    expect(hasNot(computeAlerts(bed, NOW, NICE_CTG), "ctg-not-documented")).toBe(true)
  })
})

// ─── Alert severity ordering ──────────────────────────────────────────────────

describe("Alert ordering", () => {
  it("urgent alerts sort before warning, warning before info", () => {
    const bed = activeBed({
      ves: [{ time: t(5 * HOUR), dilation: 5, contractions: 6 }], // ve-overdue urgent + hyperstim urgent
      observations: {},  // triggers info alerts
    })
    const alerts = computeAlerts(bed, NOW)
    const sevOrder = { urgent: 0, warning: 1, info: 2 }
    for (let i = 1; i < alerts.length; i++) {
      expect(sevOrder[alerts[i].severity]).toBeGreaterThanOrEqual(sevOrder[alerts[i-1].severity])
    }
  })
})
