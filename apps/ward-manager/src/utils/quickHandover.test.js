import { describe, it, expect } from "vitest"
import { bedFromCard, cardBlocker, cardFromIOLEntry, cardMissing, cardOnset, cardVEs, emptyCard, hhmmToISO, onsetPatch, typeTimeDigit, vesGoDown } from "./quickHandover.js"
import { computeAlerts } from "./wardAlerts.js"

const NOW = new Date(2024, 5, 1, 14, 0).getTime() // 14:00 local
const at = (h, m, dayBack = 0) => new Date(2024, 5, 1 - dayBack, h, m).toISOString()
const card = p => ({ ...emptyCard(), bed: "4", ...p })
const full = p => card({ parity: "Para 1", gestDigits: "403", stage: "Active first stage", onset: "Spontaneous", ves: [{ dil: 6, hhmm: "1200" }], ...p })

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
    expect(cardMissing(c)).toEqual(["parity", "gestation", "onset", "VE"])
    const a = computeAlerts(bedFromCard(c, NOW), NOW).find(x => x.id === "details-missing")
    expect(a.title).toBe("Add parity, gestation, onset, VE")
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

describe("VEs in any order", () => {
  it("sorts by time however they were entered, across midnight too", () => {
    const c = full({ ves: [{ dil: 7, hhmm: "1200" }, { dil: 4, hhmm: "2300" }, { dil: 5, hhmm: "0500" }] })
    expect(cardVEs(c, NOW).map(v => v.dil)).toEqual([4, 5, 7])
    const b = bedFromCard(c, NOW)
    expect(b.ves.map(v => v.dilation)).toEqual([4, 5, 7])
    expect(b.activeFirstStageStartTime).toBe(at(23, 0, 1))
    expect(vesGoDown(c, NOW)).toBe(false)
  })
})

describe("onset on the card", () => {
  it("unanswered stays unknown and is listed, and clears once set", () => {
    const b = bedFromCard(full({ onset: null }), NOW)
    expect(b.modeOfOnset).toBeNull()
    expect(computeAlerts(b, NOW).find(x => x.id === "details-missing").missing).toEqual(["onset"])
    expect(computeAlerts({ ...b, modeOfOnset: "Spontaneous" }, NOW).some(x => x.id === "details-missing")).toBe(false)
  })
  it("an older bed with no onset and no pending list raises no gap", () => {
    const b = bedFromCard(full(), NOW)
    expect(computeAlerts({ ...b, modeOfOnset: undefined, pendingDetails: undefined }, NOW).some(x => x.id === "details-missing")).toBe(false)
  })
  it("IOL turns the induction details on", () => {
    const c = full(onsetPatch(emptyCard(), "Induced"))
    expect(cardOnset(c)).toBe("Induced")
    expect(bedFromCard(c, NOW).modeOfOnset).toBe("Induced")
    expect(cardMissing(c)).toEqual(["induction start time"])
  })
  it("PPROM turns SROM on and will not save without the ROM time", () => {
    const c = full(onsetPatch(emptyCard(), "PPROM"))
    expect(c.rom).toMatchObject({ on: true, type: "SROM" })
    expect(cardBlocker(c)).toMatch(/ROM time/)
    const b = bedFromCard({ ...c, rom: { ...c.rom, hhmm: "1000" } }, NOW)
    expect(b.modeOfOnset).toBe("PPROM")
    expect(b.membranes).toBe("SROM")
    expect(b.membranesTime).toBe(at(10, 0))
  })
  it("changing away from PPROM drops a ROM with no time but keeps one with a time", () => {
    const blank = { ...emptyCard(), ...onsetPatch(emptyCard(), "PPROM") }
    expect(onsetPatch(blank, "Spontaneous").rom.on).toBe(false)
    const timed = { ...blank, rom: { ...blank.rom, hhmm: "1000" } }
    expect(onsetPatch(timed, "Spontaneous").rom.on).toBe(true)
  })
})

describe("admit from the IOL queue", () => {
  const entry = { id: "q", initials: "AB", gestWeeks: 41, gestDays: 2, indications: ["Pre-eclampsia", "Post-dates"], addedAt: at(9, 30) }
  it("pre-fills what the queue knows and keeps the risk flag", () => {
    const c = { ...cardFromIOLEntry(entry, NOW), bed: "4", parity: "Para 0", noVE: true }
    expect(cardMissing(c)).toEqual([])
    const b = bedFromCard(c, NOW)
    expect(b).toMatchObject({ gestation: "41+2", labourStage: "Latent", modeOfOnset: "Induced", inductionStartTime: at(9, 30) })
    expect(b.iolReasons).toEqual(["Pre-eclampsia", "Post-dates"])
    expect(b.riskFlags).toEqual(["Pre-eclampsia"])
  })
  it("leaves the start time blank if she was queued over 24 hours ago", () => {
    const old = cardFromIOLEntry({ ...entry, addedAt: at(9, 30, 2) }, NOW)
    expect(old.iol.hhmm).toBeNull()
    expect(cardMissing({ ...old, bed: "4", parity: "Para 0", noVE: true })).toEqual(["induction start time"])
  })
})

describe("pushing on the card", () => {
  const pushing = p => full({ parity: "Para 0", stage: "Active second stage", ves: [{ dil: 10, hhmm: "1210" }], ...p })
  it("will not save without when pushing started", () => {
    expect(cardBlocker(pushing())).toMatch(/pushing started/)
    expect(cardBlocker(pushing({ pushHHMM: "1335" }))).toBeNull()
    expect(cardBlocker(full({ pushHHMM: null }))).toBeNull()
  })
  it("times pushing from when she started, not from the 10 cm VE", () => {
    const b = bedFromCard(pushing({ pushHHMM: "1335" }), NOW)
    expect(b.pushingStartTime).toBe(at(13, 35))
    expect(b.passiveStartTime).toBe(at(12, 10))
    const ids = computeAlerts(b, NOW).map(a => a.id)
    expect(ids).not.toContain("pushing-reassess")
    expect(ids).not.toContain("pushing-senior-review")
  })
  it("still reassesses once she has actually pushed long enough", () => {
    const b = bedFromCard(pushing({ pushHHMM: "1255" }), NOW)
    expect(computeAlerts(b, NOW).map(a => a.id)).toContain("pushing-reassess")
  })
  it("a time left over from choosing Pushing by mistake is ignored", () => {
    const b = bedFromCard(full({ pushHHMM: "1335" }), NOW)
    expect(b.pushingStartTime).toBeNull()
    expect(b.passiveStartTime).toBeNull()
  })
})
