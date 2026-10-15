// Safety gaps closed after the guideline audit. Each block names its source.

import { describe, it, expect } from "vitest"
import { computeAlerts } from "./wardAlerts.js"
import { currentOxytocin, fixAlert, stampObs } from "./bedModel.js"
import { triageBed } from "./triage.js"
import { generateHandover } from "./handoverText.js"
import { UNIT_DEFAULTS } from "../data/unitSettings.js"

const MIN  = 60 * 1000
const HOUR = 60 * MIN
const NOW  = new Date("2024-06-01T12:00:00Z").getTime()
const t = msAgo => new Date(NOW - msAgo).toISOString()
const ids = b => computeAlerts(b, NOW).map(a => a.id)
const sev = (b, id) => computeAlerts(b, NOW).find(a => a.id === id)?.severity

function bed(overrides = {}) {
  return {
    id: "b1", bedNumber: "1", parity: "Para 0", gestation: "39+2",
    labourStage: "Latent", analgesia: "None", riskFlags: [],
    ves: [], oxytocinLog: [], ctgLog: [],
    observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastTemp: t(10 * MIN) },
    ...overrides,
  }
}
const active = (o = {}) => bed({
  labourStage: "Active first stage", activeFirstStageStartTime: t(HOUR),
  ves: [{ id: "v", time: t(30 * MIN), dilation: 5 }], ...o,
})
const ctg = (classification, minsAgo = 5, extra = {}) => ({ id: "c", time: t(minsAgo * MIN), classification, ...extra })

describe("CTG alerts in latent labour and induction (NG229)", () => {
  it("acts on a suspicious CTG logged in the latent phase", () => {
    expect(ids(bed({ ctgLog: [ctg("suspicious")] }))).toContain("ctg-suspicious")
  })
  it("acts on a pathological CTG logged in the latent phase", () => {
    expect(sev(bed({ ctgLog: [ctg("pathological")] }), "ctg-pathological")).toBe("urgent")
  })
  it("does not nag for a CTG in latent labour without oxytocin", () => {
    expect(ids(bed({ riskFlags: ["Previous LSCS"] }))).not.toContain("ctg-not-documented")
  })
  it("asks for a CTG once oxytocin is running, even before established labour", () => {
    const b = bed({ modeOfOnset: "Induced", oxytocinLog: [{ id: "o", startTime: t(HOUR), dose: 4, lastIncrementTime: t(10 * MIN) }] })
    expect(ids(b)).toContain("ctg-not-documented")
  })
})

describe("under 28+0 weeks", () => {
  const early = (g, o = {}) => active({ gestation: g, ves: [{ id: "v", time: t(5 * HOUR), dilation: 5 }], ...o })
  it("shows a scope note instead of going silent", () => {
    expect(ids(early("26+0"))).toContain("under-28")
  })
  it("still runs the preterm bundle (NG25)", () => {
    const a = ids(early("26+0"))
    expect(a).toContain("preterm-steroids")
    expect(a).toContain("preterm-mgso4")
    expect(a).toContain("iap-preterm")
  })
  it("still flags abnormal maternal observations", () => {
    expect(ids(early("26+0", { observations: { pulseValue: "130" } }))).toContain("tachycardia")
  })
  it("does not apply labour-progress or CTG rules", () => {
    const a = ids(early("26+0", { ctgLog: [ctg("pathological")] }))
    expect(a).not.toContain("ve-overdue")
    expect(a).not.toContain("ctg-pathological")
  })
  it("uses the NG25 'discuss' wording at 22 to 23 weeks", () => {
    const b = early("23+3")
    expect(sev(b, "preterm-steroids")).toBe("warning")
    expect(sev(b, "preterm-mgso4")).toBe("warning")
    expect(ids(b)).not.toContain("preterm-tocolysis")
  })
})

describe("after birth: maternal safety alerts continue", () => {
  const delivered = (o = {}) => bed({ delivery: { time: t(HOUR), mode: "SVD", ebl: 300 }, ...o })
  it("keeps quiet for a well woman and sits in the delivered list", () => {
    expect(ids(delivered())).toEqual([])
    expect(triageBed(delivered(), NOW).tier).toBe("delivered")
  })
  it("flags tachycardia and moves her back into 'needs you'", () => {
    const b = delivered({ observations: { pulseValue: "128" } })
    expect(ids(b)).toContain("tachycardia")
    expect(triageBed(b, NOW).tier).toBe("urgent")
  })
  it("flags major and minor PPH (RCOG GTG52)", () => {
    expect(sev(delivered({ delivery: { time: t(HOUR), mode: "SVD", ebl: 1200 } }), "pph")).toBe("urgent")
    expect(sev(delivered({ delivery: { time: t(HOUR), mode: "SVD", ebl: 600 } }), "pph")).toBe("warning")
  })
  it("lets the PPH alert be marked reviewed", () => {
    const b = delivered({ delivery: { time: t(HOUR), mode: "SVD", ebl: 1200 } })
    expect(ids({ ...b, ...fixAlert(b, "pph", t(0)) })).not.toContain("pph")
  })
  it("drops labour rules, CTG and preterm prompts", () => {
    const b = delivered({ gestation: "30+0", riskFlags: ["GBS+"], ctgLog: [ctg("pathological")] })
    const a = ids(b)
    expect(a).not.toContain("ctg-pathological")
    expect(a).not.toContain("gbs-iap")
    expect(a).not.toContain("preterm-steroids")
  })
  it("puts postnatal alerts in the handover", () => {
    const b = delivered({ delivery: { time: t(HOUR), mode: "SVD", ebl: 1200 } })
    expect(generateHandover({ b1: b }, null, NOW)).toMatch(/!! Major PPH/)
  })
})

describe("stale observation values", () => {
  it("a re-check stamped done clears the old abnormal value", () => {
    const b = active({ observations: { lastPulse: t(2 * HOUR), pulseValue: "130", lastBP: t(10 * MIN), lastTemp: t(10 * MIN) } })
    expect(ids(b)).toContain("tachycardia")
    const after = { ...b, ...stampObs(b, t(0), ["lastPulse"]) }
    expect(ids(after)).not.toContain("tachycardia")
  })
  it("the 'Done' fix on a due alert also clears the old value", () => {
    const b = active({ observations: { lastPulse: t(2 * HOUR), pulseValue: "130", lastBP: t(10 * MIN), lastTemp: t(10 * MIN) } })
    const after = { ...b, ...fixAlert(b, "pulse-due", t(0)) }
    expect(after.observations.pulseValue).toBeUndefined()
  })
})

describe("oxytocin stop, hold and safety (NG235 1.8.54 to 1.8.56)", () => {
  const ox = (dose, minsAgo = 40, extra = {}) => ({ id: "o" + dose, startTime: t(minsAgo * MIN), dose, lastIncrementTime: t(minsAgo * MIN), ...extra })
  it("tells you to stop oxytocin when the CTG is pathological", () => {
    expect(sev(active({ oxytocinLog: [ox(6)], ctgLog: [ctg("pathological")] }), "oxytocin-stop-pathological")).toBe("urgent")
  })
  it("no increment prompt while the CTG is suspicious", () => {
    expect(ids(active({ oxytocinLog: [ox(6)], ctgLog: [ctg("suspicious")] }))).not.toContain("oxytocin-increment")
  })
  it("no increment prompt with 5 or more contractions; says reduce or stop", () => {
    const b = active({ oxytocinLog: [ox(6)], ves: [{ id: "v", time: t(10 * MIN), dilation: 5, contractions: 5 }] })
    expect(ids(b)).not.toContain("oxytocin-increment")
    expect(computeAlerts(b, NOW).find(a => a.id === "hyperstim").title).toMatch(/reduce or stop oxytocin/)
  })
  it("no increment prompt while the dose is held", () => {
    expect(ids(active({ oxytocinLog: [ox(6)] }))).toContain("oxytocin-increment")
    expect(ids(active({ oxytocinLog: [ox(6)], oxytocinHeld: true }))).not.toContain("oxytocin-increment")
  })
  it("a stopped infusion is not running", () => {
    const b = active({ oxytocinLog: [ox(6, 90), ox(0, 30, { stopped: true })], ctgLog: [ctg("pathological")] })
    expect(currentOxytocin(b)).toBeNull()
    expect(ids(b)).not.toContain("oxytocin-stop-pathological")
    expect(ids(b)).not.toContain("oxytocin-increment")
  })
})

describe("low blood pressure and temperature (NICE NG255 table 1)", () => {
  const withObs = o => active({ observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastTemp: t(10 * MIN), ...o } })
  it("systolic 90 or less is urgent", () => {
    expect(sev(withObs({ bpSystolic: "88", bpDiastolic: "50" }), "bp-low")).toBe("urgent")
  })
  it("systolic 91 to 100 is a warning", () => {
    expect(sev(withObs({ bpSystolic: "98", bpDiastolic: "60" }), "bp-low")).toBe("warning")
  })
  it("systolic 101 is not flagged", () => {
    expect(ids(withObs({ bpSystolic: "101", bpDiastolic: "60" }))).not.toContain("bp-low")
  })
  it("temperature under 36°C is a warning", () => {
    expect(sev(withObs({ tempValue: "35.8" }), "temp-low")).toBe("warning")
  })
})

describe("intrapartum antibiotics (NICE NG195 1.6.1, 1.6.4)", () => {
  it("prompts antibiotics for preterm labour without GBS", () => {
    expect(sev(active({ gestation: "34+2" }), "iap-preterm")).toBe("urgent")
  })
  it("uses the GBS prompt, not both, when she is also GBS+", () => {
    const a = ids(active({ gestation: "34+2", riskFlags: ["GBS+"] }))
    expect(a).toContain("gbs-iap")
    expect(a).not.toContain("iap-preterm")
  })
  it("one 'Given' clears either prompt", () => {
    const b = active({ gestation: "34+2" })
    expect(ids({ ...b, ...fixAlert(b, "iap-preterm", t(0)) })).not.toContain("iap-preterm")
  })
})

describe("PROM 24 hours: term only (NICE NG235 1.7.7)", () => {
  const prom = g => bed({ gestation: g, membranes: "SROM", membranesTime: t(25 * HOUR) })
  it("offers induction at term", () => {
    expect(ids(prom("39+0"))).toContain("prom-24h")
  })
  it("does not apply before 37+0", () => {
    expect(ids(prom("36+3"))).not.toContain("prom-24h")
  })
})

describe("ROM 48 hours: antibiotics (GL787)", () => {
  const rom = (h, o = {}) => bed({ gestation: "39+0", labourStage: "Active first stage", activeFirstStageStartTime: t(HOUR),
    ves: [{ id: "v", time: t(30 * MIN), dilation: 5 }], membranes: "SROM", membranesTime: t(h * HOUR), ...o })
  it("fires at 48 hours", () => {
    expect(sev(rom(48), "prom-48h")).toBe("urgent")
    expect(ids(rom(47))).not.toContain("prom-48h")
  })
  it("clears once antibiotics are given", () => {
    expect(ids(rom(50, { gbsAntibioticsStarted: true }))).not.toContain("prom-48h")
  })
})

describe("unit settings change the local thresholds", () => {
  const U = o => ({ ...UNIT_DEFAULTS, ...o })
  const run = (b, o) => computeAlerts(b, NOW, U(o)).map(a => a.id)
  it("suspicious CTG recheck interval", () => {
    const b = bed({ ctgLog: [ctg("suspicious", 25)] })
    expect(run(b, {})).toContain("ctg-suspicious")
    expect(run(b, { suspiciousRecheckMin: 20 })).toContain("ctg-suspicious-overdue")
  })
  it("latent reassessment interval", () => {
    const b = bed({ admissionTime: t(5 * HOUR) })
    expect(run(b, {})).toContain("latent-reassess")
    expect(run(b, { latentReassessH: 6 })).not.toContain("latent-reassess")
  })
  it("ROM review and antibiotic hours", () => {
    const b = active({ membranes: "SROM", membranesTime: t(13 * HOUR) })
    expect(run(b, {})).not.toContain("prom-18h")
    expect(run(b, { promReviewH: 12 })).toContain("prom-18h")
    expect(run(b, { promAntibioticH: 12 })).toContain("prom-48h")
  })
  it("neonatal team gestation", () => {
    const b = active({ gestation: "35+0" })
    expect(run(b, {})).not.toContain("preterm-neonatal")
    expect(run(b, { neonatalTeamUnderWk: 36 })).toContain("preterm-neonatal")
  })
  it("oxytocin maximum", () => {
    const b = active({ oxytocinLog: [{ id: "o", startTime: t(HOUR), dose: 16, lastIncrementTime: t(10 * MIN) }] })
    expect(run(b, {})).not.toContain("oxytocin-max")
    expect(run(b, { oxytocinMax: 16 })).toContain("oxytocin-max")
  })
  it("oliguria threshold", () => {
    const b = active({ observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastTemp: t(10 * MIN), urineOutput: 35 } })
    expect(run(b, {})).not.toContain("oliguria")
    expect(run(b, { oliguriaMlH: 40 })).toContain("oliguria")
  })
  it("meconium wording follows the setting", () => {
    const b = active({ membranes: "SROM", membranesTime: t(HOUR), liquor: "Thin meconium" })
    const body = o => computeAlerts(b, NOW, U(o)).find(a => a.id === "mec-thin").body
    expect(body({})).toMatch(/mandatory/)
    expect(body({ meconiumCTGMandatory: false })).toMatch(/her choice/)
  })
})
