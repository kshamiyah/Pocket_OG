import { describe, it, expect } from "vitest"
import { bedFromCard, cardBlocker, cardMissing, emptyCard, hhmmToISO, typeTimeDigit, vesGoDown } from "./quickHandover.js"
import { computeAlerts } from "./wardAlerts.js"

const NOW = new Date(2024, 5, 1, 14, 0).getTime() // 14:00 local
const at = (h, m, dayBack = 0) => new Date(2024, 5, 1 - dayBack, h, m).toISOString()
const card = p => ({ ...emptyCard(), bed: "4", ...p })
const full = p => card({ parity: "Para 1", gestDigits: "403", stage: "Active first stage", ves: [{ dil: 6, hhmm: "1200" }], ...p })

describe("quick handover times", () => {
  it("reads 1345 as 13:45 today, and a later time as yesterday", () => {
    expect(hhmmToISO("1345", NOW)).toBe(at(13, 45))
    expect(hhmmToISO("2330", NOW)).toBe(at(23, 30, 1))
    expect(hhmmToISO("2575", NOW)).toBeNull()
  })
  it("refuses digits that cannot make a real time", () => {
    expect(typeTimeDigit("", "3")).toBe("")
    expect(typeTimeDigit("2", "5")).toBe("2")
    expect(typeTimeDigit("13", "7")).toBe("13")
    expect(typeTimeDigit("134", "5")).toBe("1345")
  })
})

describe("quick handover card", () => {
  it("builds a complete woman with her VEs in time order and the stage clock from the first at 4 cm", () => {
    const b = bedFromCard(full({ ves: [{ dil: 6, hhmm: "1200" }, { dil: 4, hhmm: "0800" }] }), NOW)
    expect(b.gestation).toBe("40+3")
    expect(b.ves.map(v => v.dilation)).toEqual([4, 6])
    expect(b.activeFirstStageStartTime).toBe(at(8, 0))
    expect(b.ves[1].membranes).toBe("Intact")
    expect(b.ves[0].membranes).toBeUndefined()
    expect(computeAlerts(b, NOW).some(a => a.id === "details-missing")).toBe(false)
  })
  it("saves with gaps and the board says what to add", () => {
    const c = card({ stage: "Latent", skipped: ["parity", "gest", "ve"] })
    expect(cardBlocker(c)).toBeNull()
    expect(cardMissing(c)).toEqual(["parity", "gestation", "VE"])
    const a = computeAlerts(bedFromCard(c, NOW), NOW).find(x => x.id === "details-missing")
    expect(a.title).toBe("Add parity, gestation, VE")
    expect(a.severity).toBe("warning")
  })
  it("the VE gap clears once a VE is recorded, and No VE yet is not a gap", () => {
    const b = bedFromCard(full({ ves: [], skipped: ["ve"] }), NOW)
    expect(computeAlerts(b, NOW).find(x => x.id === "details-missing").missing).toEqual(["VE"])
    const withVE = { ...b, ves: [{ id: "v", time: at(13, 50), dilation: 5 }] }
    expect(computeAlerts(withVE, NOW).some(x => x.id === "details-missing")).toBe(false)
    expect(cardMissing(full({ ves: [], noVE: true }))).toEqual([])
  })
  it("will not save ROM or oxytocin without their times", () => {
    expect(cardBlocker(full({ rom: { on: true, type: "SROM", liquor: "Clear", hhmm: null } }))).toMatch(/ROM time/)
    expect(cardBlocker(full({ oxy: { on: true, dose: 6, hhmm: null } }))).toMatch(/oxytocin/)
  })
  it("ROM time starts the membranes clock (24 hour rule)", () => {
    const b = bedFromCard(full({ stage: "Latent", gestDigits: "400", ves: [], noVE: true, rom: { on: true, type: "SROM", liquor: "Clear", hhmm: "1100" } }), NOW + 24 * 3600e3)
    expect(b.membranes).toBe("SROM")
    expect(b.membranesTime).toBe(at(11, 0, -1))
    const c = bedFromCard(full({ ves: [], noVE: true, rom: { on: true, type: "AROM", liquor: "Clear", hhmm: "1000" } }), NOW)
    expect(c.armTime).toBe(at(10, 0))
  })
  it("oxytocin keeps its start for the hours on oxytocin, and the dose as handed over", () => {
    const b = bedFromCard(full({ oxy: { on: true, dose: 8, hhmm: "0900" } }), NOW)
    expect(b.oxytocinLog).toHaveLength(1)
    expect(b.oxytocinLog[0]).toMatchObject({ startTime: at(9, 0), dose: 8, lastIncrementTime: new Date(NOW).toISOString() })
  })
  it("an induction without a start time is listed, never set to now", () => {
    const b = bedFromCard(full({ iol: { on: true, method: "Balloon", hhmm: null } }), NOW)
    expect(b.inductionStartTime).toBeNull()
    expect(computeAlerts(b, NOW).find(x => x.id === "details-missing").missing).toEqual(["induction start time"])
  })
  it("flags a later VE with less dilation", () => {
    expect(vesGoDown(full({ ves: [{ dil: 6, hhmm: "0800" }, { dil: 4, hhmm: "1200" }] }), NOW)).toBe(true)
  })
})
