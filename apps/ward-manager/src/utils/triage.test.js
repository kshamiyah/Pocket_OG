import { describe, it, expect } from "vitest"
import { triageBed, triageWard, wardSummary, nextDue, tidy, shortLabel } from "./triage.js"
import { addVE, suggestedStage, fixAlert, stampObs, obsStatus, setStage } from "./bedModel.js"
import { resolveWhen } from "./time.js"

const MIN  = 60 * 1000
const HOUR = 60 * MIN
const NOW  = new Date("2024-06-01T12:00:00Z").getTime()
const t = msAgo => new Date(NOW - msAgo).toISOString()

function activeBed(overrides = {}) {
  return {
    id: "b1",
    bedNumber: "1",
    parity: "Para 0",
    gestation: "39+2",
    labourStage: "Active first stage",
    analgesia: "None",
    riskFlags: [],
    ves: [{ id: "v1", time: t(1 * HOUR), dilation: 5, station: -2 }],
    oxytocinLog: [],
    ctgLog: [{ id: "c1", time: t(20 * MIN), classification: "normal" }],
    observations: { lastPulse: t(30 * MIN), lastBP: t(30 * MIN), lastTemp: t(30 * MIN) },
    ...overrides,
  }
}

describe("triageBed", () => {
  it("puts a delivered woman in the delivered tier with no alerts", () => {
    const r = triageBed(activeBed({ delivery: { time: t(HOUR), mode: "SVD" } }), NOW)
    expect(r.tier).toBe("delivered")
    expect(r.shown).toEqual([])
    expect(r.next).toBeNull()
  })

  it("is on track when nothing is due", () => {
    const r = triageBed(activeBed(), NOW)
    expect(r.tier).toBe("ok")
    expect(r.urgent).toBe(0)
  })

  it("hides routine obs reminders from the alert list (they show as dots)", () => {
    const r = triageBed(activeBed({ observations: { lastPulse: t(2 * HOUR), lastBP: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN) } }), NOW)
    expect(r.alerts.some(a => a.id === "pulse-due")).toBe(true)
    expect(r.shown.some(a => a.id === "pulse-due")).toBe(false)
    expect(r.tier).toBe("ok")
  })

  it("a pulse never recorded in established labour is due, not on track", () => {
    const r = triageBed(activeBed({ observations: {} }), NOW)
    expect(r.shown.some(a => a.id === "pulse-never")).toBe(true)
    expect(r.tier).toBe("warning")
  })

  it("no CTG ever logged in established labour is due, not on track", () => {
    expect(triageBed(activeBed({ ctgLog: [] }), NOW).tier).toBe("warning")
  })

  it("keeps an urgent BP reminder for a hypertensive woman", () => {
    const r = triageBed(activeBed({ riskFlags: ["Hypertensive"], observations: { lastPulse: t(10 * MIN), lastTemp: t(10 * MIN) } }), NOW)
    expect(r.shown.some(a => a.id === "bp-never" && a.severity === "urgent")).toBe(true)
    expect(r.tier).toBe("urgent")
  })

  it("is urgent when GBS+ with ruptured membranes and no antibiotics, and clears once marked", () => {
    const bed = activeBed({ riskFlags: ["GBS+"], ves: [{ id: "v1", time: t(HOUR), dilation: 5, station: -2, membranes: "SROM", membranesTime: t(2 * HOUR) }] })
    const before = triageBed(bed, NOW)
    expect(before.tier).toBe("urgent")
    expect(shortLabel(before.top)).toBe("GBS antibiotics")
    const after = triageBed({ ...bed, ...fixAlert(bed, "gbs-iap", t(0)) }, NOW)
    expect(after.shown.some(a => a.id === "gbs-iap")).toBe(false)
  })

  it("is due when the VE reaches 4 hours", () => {
    const r = triageBed(activeBed({ ves: [{ id: "v1", time: t(4 * HOUR + 10 * MIN), dilation: 5, station: -2 }] }), NOW)
    expect(r.tier).toBe("warning")
    expect(r.top.id).toBe("ve-due")
  })
})

describe("nextDue", () => {
  it("forecasts the next VE four hours after the last one, to the minute", () => {
    const bed = activeBed({ ctgLog: [] }) // no hourly CTG review to come first
    const n = nextDue(bed, NOW)
    expect(n.label).toBe("VE")
    expect(n.at).toBe(NOW + 3 * HOUR)
  })

  it("returns null for a delivered woman", () => {
    expect(nextDue(activeBed({ delivery: { time: t(0), mode: "SVD" } }), NOW)).toBeNull()
  })
})

describe("triageWard ordering", () => {
  it("sorts urgent, then due soon, then on track, then delivered", () => {
    const beds = {
      a: activeBed({ id: "a", bedNumber: "1" }),
      b: activeBed({ id: "b", bedNumber: "2", riskFlags: ["GBS+"], ves: [{ id: "v", time: t(HOUR), dilation: 5, station: -2, membranes: "SROM", membranesTime: t(2 * HOUR) }] }),
      c: activeBed({ id: "c", bedNumber: "3", ves: [{ id: "v", time: t(4 * HOUR + 10 * MIN), dilation: 5, station: -2 }] }),
      d: activeBed({ id: "d", bedNumber: "4", delivery: { time: t(HOUR), mode: "SVD" } }),
    }
    const rows = triageWard(beds, NOW)
    expect(rows.map(r => r.bed.id)).toEqual(["b", "c", "a", "d"])
    const s = wardSummary(rows)
    expect(s).toMatchObject({ women: 3, urgent: 1, warning: 1, delivered: 1 })
  })
})

describe("bed helpers", () => {
  it("saves a second VE in the same minute if the findings differ", () => {
    const bed = activeBed()
    const ve = { id: "v2", time: bed.ves[0].time, dilation: 7, station: 0 }
    const r = addVE(bed, ve)
    expect(r.duplicate).toBe(false)
    expect(r.updates.ves).toHaveLength(2)
  })

  it("ignores an exact double-tap duplicate", () => {
    const bed = activeBed()
    const r = addVE(bed, { ...bed.ves[0], id: "v2" })
    expect(r.duplicate).toBe(true)
    expect(r.updates).toEqual({})
  })

  it("records ARM time from the first AROM VE", () => {
    const bed = activeBed()
    const r = addVE(bed, { id: "v2", time: t(0), dilation: 6, station: -1, membranes: "AROM", membranesTime: t(0) })
    expect(r.updates.armTime).toBe(t(0))
  })

  it("offers (never forces) a stage change from the dilation", () => {
    expect(suggestedStage(activeBed({ labourStage: "Latent" }), 4)).toBe("Active first stage")
    expect(suggestedStage(activeBed({ labourStage: "Latent" }), 3)).toBeNull()
    expect(suggestedStage(activeBed(), 10)).toBe("Passive second stage")
    expect(suggestedStage(activeBed({ labourStage: "Active second stage" }), 10)).toBeNull()
  })

  it("stamps pulse, BP and temperature together", () => {
    const bed = activeBed({ observations: {} })
    const u = stampObs(bed, t(0))
    const status = obsStatus({ ...bed, ...u }, NOW)
    expect(status.every(s => s.done)).toBe(true)
  })

  it("keeps the first pushing start time when the stage is set again", () => {
    const bed = activeBed({ labourStage: "Active second stage", pushingStartTime: t(HOUR) })
    expect(setStage(bed, "Active second stage", t(0)).pushingStartTime).toBeUndefined()
    expect(setStage(activeBed(), "Active second stage", t(0)).pushingStartTime).toBe(t(0))
  })
})

describe("time and copy", () => {
  it("refuses a clock time in the future", () => {
    const later = new Date(NOW + 30 * MIN)
    const clock = `${String(later.getHours()).padStart(2, "0")}:${String(later.getMinutes()).padStart(2, "0")}`
    expect(resolveWhen({ clock, daysAgo: 0 }, NOW)).toBeNull()
    expect(resolveWhen({ clock, daysAgo: 1 }, NOW)).not.toBeNull()
    expect(resolveWhen({ minsAgo: 20 }, NOW)).toBe(t(20 * MIN))
  })

  it("replaces em dashes in engine titles", () => {
    expect(tidy("Preterm 33+2 — alert neonatal team")).toBe("Preterm 33+2: alert neonatal team")
  })
})
