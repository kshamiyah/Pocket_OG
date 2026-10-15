// Regression tests for issues found by the multi-patient shift testing.

import { describe, it, expect } from "vitest"
import { computeAlerts } from "./wardAlerts.js"
import { setStage, veFindings, malpresentation } from "./bedModel.js"
import { clock } from "./time.js"
import { generateHandover } from "./handoverText.js"

const MIN  = 60 * 1000
const HOUR = 60 * MIN
const NOW  = new Date("2024-06-01T12:00:00Z").getTime()
const t = msAgo => new Date(NOW - msAgo).toISOString()
const has = (alerts, id) => alerts.some(a => a.id === id)

function bed(overrides = {}) {
  return {
    id: "b1", bedNumber: "1", parity: "Para 0", gestation: "39+2",
    labourStage: "Latent", analgesia: "None", riskFlags: [],
    ves: [], oxytocinLog: [], ctgLog: [],
    observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastTemp: t(10 * MIN) },
    ...overrides,
  }
}

describe("membranes recorded at admission (no VE yet)", () => {
  it("counts rupture time from admission for the PROM alerts", () => {
    const b = bed({ membranes: "SROM", membranesTime: t(19 * HOUR), liquor: "Clear" })
    expect(has(computeAlerts(b, NOW), "prom-18h")).toBe(true)
  })

  it("prompts GBS antibiotics for a GBS+ woman whose membranes ruptured before admission", () => {
    const b = bed({ riskFlags: ["GBS+"], membranes: "SROM", membranesTime: t(2 * HOUR) })
    expect(has(computeAlerts(b, NOW), "gbs-iap")).toBe(true)
  })

  it("uses admission liquor for meconium alerts", () => {
    const b = bed({ membranes: "SROM", membranesTime: t(HOUR), liquor: "Thick meconium" })
    expect(has(computeAlerts(b, NOW), "mec-thick")).toBe(true)
  })

  it("lets a later VE that records membranes take over", () => {
    const b = bed({
      membranes: "SROM", membranesTime: t(19 * HOUR),
      ves: [{ id: "v", time: t(HOUR), dilation: 3, membranes: "Intact" }],
    })
    expect(has(computeAlerts(b, NOW), "prom-18h")).toBe(false)
  })

  it("behaves exactly as before when nothing was recorded at admission", () => {
    const b = bed({ ves: [{ id: "v", time: t(HOUR), dilation: 3 }] })
    expect(computeAlerts(b, NOW).some(a => a.id.startsWith("prom-"))).toBe(false)
  })
})

describe("stage start times", () => {
  it("clears the pushing clock when the stage is moved back", () => {
    const b = bed({ labourStage: "Active second stage", pushingStartTime: t(HOUR), passiveStartTime: t(2 * HOUR) })
    const back = setStage(b, "Passive second stage", t(0))
    expect(back.pushingStartTime).toBeNull()
    expect(back.passiveStartTime).toBeUndefined() // kept as it was
    const again = setStage({ ...b, ...back }, "Active second stage", t(0))
    expect(again.pushingStartTime).toBe(t(0))
  })
})

describe("display helpers", () => {
  it("leaves unrecorded station out of the VE findings and shows breech", () => {
    expect(veFindings({ dilation: 7, station: null, presentation: "Cephalic" })).toBe("7 cm")
    expect(veFindings({ dilation: 7, station: -1, presentation: "Breech" })).toBe("7 cm, station -1, breech")
    expect(malpresentation(bed({ ves: [{ time: t(0), dilation: 7, presentation: "Breech" }] }))).toBe("Breech")
  })

  it("names the day for times that are not today", () => {
    const now = new Date(2024, 5, 1, 9, 0).getTime()
    expect(clock(new Date(2024, 5, 1, 8, 5).getTime(), now)).toBe("08:05")
    expect(clock(new Date(2024, 4, 31, 22, 15).getTime(), now)).toBe("22:15 yesterday")
    expect(clock(new Date(2024, 5, 2, 7, 30).getTime(), now)).toBe("07:30 tomorrow")
  })
})

describe("handover", () => {
  it("includes oxytocin, membranes and outstanding tasks for a labouring woman", () => {
    const b = bed({
      labourStage: "Active first stage", riskFlags: ["GBS+"], gbsAntibioticsStarted: true,
      ves: [{ id: "v", time: t(HOUR), dilation: 5, station: -1, membranes: "SROM", membranesTime: t(5 * HOUR), liquor: "Clear" }],
      oxytocinLog: [{ id: "o", startTime: t(2 * HOUR), dose: 6, lastIncrementTime: t(20 * MIN) }],
      tasks: [{ id: "x", text: "Repeat FBC", done: false }],
    })
    const text = generateHandover({ b1: b }, null, NOW)
    expect(text).toMatch(/Oxytocin 6 mU\/min/)
    expect(text).toMatch(/Membranes: SROM/)
    expect(text).toMatch(/GBS antibiotics ✓/)
    expect(text).toMatch(/To do: Repeat FBC/)
  })

  it("keeps risk flags and outstanding tasks for a delivered woman", () => {
    const b = bed({
      riskFlags: ["Hypertensive"], delivery: { time: t(HOUR), mode: "Ventouse", ebl: 1200 },
      tasks: [{ id: "x", text: "Repeat Hb", done: false }],
    })
    const text = generateHandover({ b1: b }, null, NOW)
    expect(text).toMatch(/major PPH/)
    expect(text).toMatch(/Hypertensive/)
    expect(text).toMatch(/To do: Repeat Hb/)
  })
})

describe("slow progress (NICE NG235 1.8.42, 1.8.45)", () => {
  const active = (ves, startHoursAgo) => bed({
    labourStage: "Active first stage",
    activeFirstStageStartTime: t(startHoursAgo * HOUR),
    ves,
  })

  it("ignores the latent-phase VE when she has just become active", () => {
    const b = active([
      { time: t(6 * HOUR), dilation: 3 },          // latent
      { time: t(10 * MIN), dilation: 4 },          // first active VE
    ], 0.25)
    expect(has(computeAlerts(b, NOW), "slow-progress")).toBe(false)
  })

  it("catches no change at a VE taken 2 hours later, even a minute early", () => {
    const b = active([
      { time: t(2 * HOUR - MIN), dilation: 5 },
      { time: t(0), dilation: 5 },
    ], 3)
    expect(has(computeAlerts(b, NOW), "slow-progress")).toBe(true)
  })

  it("flags less than 2 cm over 4 hours", () => {
    const b = active([
      { time: t(4 * HOUR), dilation: 4 },
      { time: t(2.5 * HOUR), dilation: 5 },
      { time: t(0), dilation: 5.5 },
    ], 5)
    expect(has(computeAlerts(b, NOW), "slow-progress")).toBe(true)
  })

  it("clears once progress is adequate again", () => {
    const b = active([
      { time: t(6 * HOUR), dilation: 4 },
      { time: t(4 * HOUR), dilation: 4.5 },
      { time: t(0), dilation: 8 },
    ], 7)
    expect(has(computeAlerts(b, NOW), "slow-progress")).toBe(false)
  })
})
