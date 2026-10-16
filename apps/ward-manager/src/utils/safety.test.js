// Safety gaps closed after the guideline audit. Each block names its source.

import { describe, it, expect } from "vitest"
import { computeAlerts } from "./wardAlerts.js"
import { currentOxytocin, declineAlert, fixAlert, fixLabel, obsProblem, recordObs, stampObs } from "./bedModel.js"
import { applyReviews, compareTriage, triageBed, triageWard } from "./triage.js"
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
  it("PPH Reviewed is time-limited: quiet for an hour, then back", () => {
    const b = delivered({ delivery: { time: t(2 * HOUR), mode: "SVD", ebl: 1200 } })
    const soon = { ...b, ...fixAlert(b, "pph", t(20 * MIN)) }
    expect(triageBed(soon, NOW).alerts.find(a => a.id === "pph").severity).toBe("info")
    const later = { ...b, ...fixAlert(b, "pph", t(70 * MIN)) }
    expect(triageBed(later, NOW).alerts.find(a => a.id === "pph").severity).toBe("urgent")
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

describe("observation values are never erased by a one-tap check", () => {
  const withBP = () => active({ observations: { lastPulse: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN), lastBP: t(40 * MIN), bpSystolic: "165", bpDiastolic: "112", bpAt: t(40 * MIN) } })
  it("stamping obs done keeps a severe BP alerting", () => {
    const b = withBP()
    const after = { ...b, ...stampObs(b, t(0)) }
    expect(after.observations.bpSystolic).toBe("165")
    expect(ids(after)).toContain("bp-severe")
  })
  it("the alert says how old the reading is and asks for a recheck after 30 min (NG133 1.7.3)", () => {
    const a = computeAlerts(withBP(), NOW).find(x => x.id === "bp-severe")
    expect(a.title).toMatch(/40m ago/)
    expect(a.title).toMatch(/recheck now/)
  })
  it("a newer normal value replaces it", () => {
    const b = withBP()
    const after = { ...b, ...recordObs(b, t(0), { bp: ["138", "88"] }) }
    expect(ids(after)).not.toContain("bp-severe")
  })
  it("a backdated value does not overwrite a newer one", () => {
    const b = withBP()
    const after = { ...b, ...recordObs(b, t(60 * MIN), { bp: ["120", "80"] }) }
    expect(after.observations.bpSystolic).toBe("165")
  })
})

describe("a repeat pulse confirms the first (NG235 1.8.20)", () => {
  it("recording twice keeps the earlier reading and turns red if both are over 120", () => {
    const b0 = active({ observations: { lastBP: t(5 * MIN), lastTemp: t(5 * MIN), lastRR: t(5 * MIN) } })
    const b1 = { ...b0, ...recordObs(b0, t(25 * MIN), { pulse: "126" }) }
    const b2 = { ...b1, ...recordObs(b1, t(5 * MIN), { pulse: "124" }) }
    expect(b2.observations.pulsePrev).toBe("126")
    expect(sev(b2, "tachycardia")).toBe("urgent")
  })
})

describe("respiratory rate (NG255 table 1; NG235 1.8.20)", () => {
  const rrBed = v => active({ observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN), rrValue: v, rrAt: t(10 * MIN) } })
  it("25 or more is urgent", () => expect(sev(rrBed("26"), "rr-high")).toBe("urgent"))
  it("21 to 24 is a warning", () => expect(sev(rrBed("22"), "rr-high")).toBe("warning"))
  it("under 9 is urgent", () => expect(sev(rrBed("8"), "rr-low")).toBe("urgent"))
  it("16 is not flagged", () => expect(ids(rrBed("16")).filter(i => i.startsWith("rr-"))).toEqual([]))
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
    const n = [ctg("normal", 10)]
    expect(ids(active({ oxytocinLog: [ox(6)], ctgLog: n }))).toContain("oxytocin-increment")
    expect(ids(active({ oxytocinLog: [ox(6)], ctgLog: n, oxytocinHeld: true }))).not.toContain("oxytocin-increment")
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
    expect(run(b, {})).not.toContain("latent-reassess")
    expect(run(b, { latentReassessH: 4 })).toContain("latent-reassess")
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

describe("new risk flags", () => {
  const NICE = { ...UNIT_DEFAULTS, ctgForAll: false }
  const reasons = b => computeAlerts(b, NOW, NICE).find(a => a.id === "ctg-not-documented")?.body ?? ""
  it("GBS in a previous baby prompts antibiotics like GBS+ (NG195 1.6.1)", () => {
    const a = computeAlerts(active({ riskFlags: ["GBS previous"] }), NOW).find(x => x.id === "gbs-iap")
    expect(a?.severity).toBe("urgent")
    expect(a.title).toMatch(/Previous GBS/)
  })
  it("suspected infection asks for antibiotics now and replaces the GBS prompt", () => {
    const a = ids(active({ riskFlags: ["GBS+", "Infection suspected"] }))
    expect(a).toContain("infection-suspected")
    expect(a).not.toContain("gbs-iap")
  })
  it("one Given clears the infection prompt", () => {
    const b = active({ riskFlags: ["Infection suspected"] })
    expect(ids({ ...b, ...fixAlert(b, "infection-suspected", t(0)) })).not.toContain("infection-suspected")
  })
  it("bleeding raises an urgent review that Reviewed clears", () => {
    const b = active({ riskFlags: ["APH"] })
    expect(sev(b, "aph")).toBe("urgent")
    expect(ids({ ...b, ...fixAlert(b, "aph", t(0)) })).not.toContain("aph")
  })
  it("baby and uterine risks count as CTG indications; diet-only GDM does not", () => {
    expect(reasons(active({ riskFlags: ["FGR"] }))).toMatch(/FGR/)
    expect(reasons(active({ riskFlags: ["Reduced fetal movements"] }))).toMatch(/Reduced movements/)
    expect(reasons(active({ riskFlags: ["Other uterine scar"] }))).toMatch(/Uterine scar/)
    expect(reasons(active({ riskFlags: ["Non-cephalic"], ves: [] }))).toMatch(/Non-cephalic/)
    expect(ids({ ...active({ riskFlags: ["Diabetic-GDM diet"] }) })).toContain("bgl-never")
    expect(computeAlerts(active({ riskFlags: ["Diabetic-GDM diet"] }), NOW, NICE).map(a => a.id)).not.toContain("ctg-not-documented")
  })
  it("pre-eclampsia gets hourly BP like hypertension", () => {
    const b = active({ riskFlags: ["Pre-eclampsia"], observations: { lastPulse: t(10 * MIN), lastBP: t(70 * MIN), lastTemp: t(10 * MIN) } })
    expect(sev(b, "bp-due")).toBe("urgent")
  })
  it("handover-only risks raise nothing", () => {
    const base = ids(active())
    expect(ids(active({ riskFlags: ["Twins", "BMI 40+", "My own note"] }))).toEqual(base)
  })
})

describe("the most dangerous problem comes first", () => {
  it("severe BP outranks the ROM review and an overdue VE", () => {
    const b = active({
      riskFlags: ["Pre-eclampsia"], membranes: "SROM", membranesTime: t(20 * HOUR),
      ves: [{ id: "v", time: t(5 * HOUR), dilation: 7 }],
      observations: { lastPulse: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN), lastBP: t(10 * MIN), bpSystolic: "165", bpDiastolic: "112", bpAt: t(10 * MIN) },
    })
    expect(computeAlerts(b, NOW)[0].id).toBe("bp-severe")
  })
  it("a major PPH is not last in Needs you now", () => {
    const pph = bed({ id: "p", bedNumber: "2", delivery: { time: t(HOUR), mode: "SVD", ebl: 1200 } })
    const busy = active({ id: "x", bedNumber: "1", ves: [{ id: "v", time: t(5 * HOUR), dilation: 4 }], riskFlags: ["GBS+"] })
    const order = triageWard({ p: pph, x: busy }, NOW).map(r => r.bed.bedNumber)
    expect(order[0]).toBe("2")
  })
  it("a major PPH leads a busy ward of urgent women", () => {
    const pph = bed({ id: "p", bedNumber: "2", delivery: { time: t(HOUR), mode: "SVD", ebl: 1200 } })
    const sbp = active({ id: "s", bedNumber: "4", riskFlags: ["Pre-eclampsia"],
      observations: { lastPulse: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN), lastBP: t(10 * MIN), bpSystolic: "165", bpDiastolic: "112", bpAt: t(10 * MIN) } })
    const path = active({ id: "c", bedNumber: "1", ctgLog: [ctg("pathological", 10, { baselineHR: 170 })] })
    const fever = active({ id: "f", bedNumber: "3", observations: { lastPulse: t(10 * MIN), lastBP: t(10 * MIN), lastRR: t(10 * MIN), lastTemp: t(10 * MIN), temp: "38.2", tempAt: t(10 * MIN) } })
    const order = triageWard({ f: fever, s: sbp, c: path, p: pph }, NOW).map(r => r.bed.bedNumber)
    expect(order[0]).toBe("2")
    expect(order.indexOf("3")).toBeGreaterThan(order.indexOf("4"))
  })
  it("compareTriage is exported for the board", () => expect(typeof compareTriage).toBe("function"))
})

describe("Reviewed: urgent alerts can be acknowledged", () => {
  const path = (minsAgo = 10) => active({ ctgLog: [ctg("pathological", minsAgo, { baselineHR: 170 })] })
  it("offers Reviewed on a pathological CTG", () => {
    expect(fixAlert(path(), "ctg-pathological", t(0), "Dr S").reviews["ctg-pathological"]).toEqual({ at: t(0), by: "Dr S" })
  })
  it("quietens it for 30 minutes, out of Needs you now", () => {
    const b = { ...path(), ...fixAlert(path(), "ctg-pathological", t(5 * MIN), "Dr S") }
    const r = triageBed(b, NOW)
    const a = r.alerts.find(x => x.id === "ctg-pathological")
    expect(a.severity).toBe("info")
    expect(a.reviewed.by).toBe("Dr S")
    expect(r.tier).not.toBe("urgent")
  })
  it("comes back after the window if still present", () => {
    const b = { ...path(60), ...fixAlert(path(60), "ctg-pathological", t(40 * MIN)) }
    expect(applyReviews(computeAlerts(b, NOW), b, NOW).find(x => x.id === "ctg-pathological").severity).toBe("urgent")
  })
  it("comes back at once when a newer pathological CTG is logged", () => {
    const b0 = path(30)
    const b = { ...b0, ...fixAlert(b0, "ctg-pathological", t(20 * MIN)), ctgLog: [...b0.ctgLog, { id: "c2", time: t(5 * MIN), classification: "pathological" }] }
    expect(applyReviews(computeAlerts(b, NOW), b, NOW).find(x => x.id === "ctg-pathological").severity).toBe("urgent")
  })
  it("the handover says it was reviewed", () => {
    const b = { ...path(), ...fixAlert(path(), "ctg-pathological", t(5 * MIN), "Dr S") }
    expect(generateHandover({ b1: b }, null, NOW)).toMatch(/reviewed .* by Dr S/)
  })
})

describe("fever and the infection pathway (NG195 1.6.1, 1.6.4; NG25 1.8.1)", () => {
  const febrile = o => bed({ gestation: "33+2", labourStage: "Latent", observations: { lastTemp: t(10 * MIN), tempValue: "38.2", tempAt: t(10 * MIN) }, ...o })
  it("38.2°C raises the infection prompt", () => expect(sev(febrile(), "infection-suspected")).toBe("urgent"))
  it("GBS prophylaxis given does not silence it", () => expect(ids(febrile({ gbsAntibioticsStarted: true }))).toContain("infection-suspected"))
  it("tocolysis prompt warns that infection may contraindicate it", () => {
    expect(computeAlerts(febrile(), NOW).find(a => a.id === "preterm-tocolysis").title).toMatch(/infection may contraindicate/)
  })
})

describe("magnesium sulfate in severe pre-eclampsia or eclampsia (NG133 1.8)", () => {
  const severe = { lastPulse: t(10 * MIN), lastTemp: t(10 * MIN), lastRR: t(10 * MIN), lastBP: t(10 * MIN), bpSystolic: "165", bpDiastolic: "105", bpAt: t(10 * MIN) }
  it("pre-eclampsia with severe BP prompts 'consider magnesium sulfate'", () => {
    const b = active({ riskFlags: ["Pre-eclampsia"], observations: severe })
    expect(sev(b, "mgso4-severe-pet")).toBe("urgent")
  })
  it("severe BP without pre-eclampsia ticked does not", () => {
    expect(ids(active({ observations: severe }))).not.toContain("mgso4-severe-pet")
  })
  it("pre-eclampsia with low urine output prompts too", () => {
    const b = active({ riskFlags: ["Pre-eclampsia"], observations: { ...severe, bpSystolic: "140", bpDiastolic: "90", urineOutput: 20 } })
    expect(ids(b)).toContain("mgso4-severe-pet")
  })
  it("clears with Assessed, or when magnesium is already running", () => {
    const b = active({ riskFlags: ["Pre-eclampsia"], observations: severe })
    expect(ids({ ...b, ...fixAlert(b, "mgso4-severe-pet", t(0)) })).not.toContain("mgso4-severe-pet")
    expect(ids({ ...b, mgso4Given: true })).not.toContain("mgso4-severe-pet")
  })
  it("eclampsia prompts 'give' even after birth, and outranks severe BP", () => {
    const b = bed({ riskFlags: ["Eclampsia"], delivery: { time: t(HOUR), mode: "SVD" }, observations: severe })
    const a = computeAlerts(b, NOW)
    expect(a[0].id).toBe("mgso4-eclampsia")
    expect(ids({ ...b, ...fixAlert(b, "mgso4-eclampsia", t(0)) })).not.toContain("mgso4-eclampsia")
  })
})

describe("GBS positive with ruptured membranes: offer immediate birth (NG207 1.2.12, 1.2.16)", () => {
  const rom = (o = {}) => bed({ labourStage: "Latent", gestation: "38+0", riskFlags: ["GBS+"], membranes: "SROM", membranesTime: t(30 * MIN), ...o })
  it("fires as soon as the waters break, not at 24 hours", () => expect(sev(rom(), "gbs-prom-birth")).toBe("urgent"))
  it("also from 34+0 preterm", () => expect(ids(rom({ gestation: "34+2" }))).toContain("gbs-prom-birth"))
  it("not under 34+0", () => expect(ids(rom({ gestation: "33+6" }))).not.toContain("gbs-prom-birth"))
  it("not for GBS in a previous pregnancy only (NICE: positive test this pregnancy)", () =>
    expect(ids(rom({ riskFlags: ["GBS previous"] }))).not.toContain("gbs-prom-birth"))
  it("not once in established labour, or with an induction under way", () => {
    expect(ids(rom({ labourStage: "Active first stage", activeFirstStageStartTime: t(10 * MIN) }))).not.toContain("gbs-prom-birth")
    expect(ids(rom({ modeOfOnset: "Induced", inductionStartTime: t(10 * MIN) }))).not.toContain("gbs-prom-birth")
  })
  it("clears with Offered", () => {
    const b = rom()
    expect(ids({ ...b, ...fixAlert(b, "gbs-prom-birth", t(0)) })).not.toContain("gbs-prom-birth")
  })
})

describe("handover detail", () => {
  it("shows when a treatment was given, the CTG trend, and why oxytocin stopped", () => {
    const b = active({
      id: "h", bedNumber: "5", riskFlags: ["GBS+"],
      ...fixAlert(active(), "gbs-iap", t(90 * MIN), "Dr S"),
      ctgLog: [ctg("normal", 120), ctg("suspicious", 60), { ...ctg("pathological", 10), comment: "Discussed with reg" }],
      oxytocinLog: [{ id: "o1", startTime: t(3 * HOUR), dose: 6, lastIncrementTime: t(2 * HOUR) }, { id: "o2", startTime: t(10 * MIN), dose: 0, stopped: true, stopReason: "Pathological CTG" }],
    })
    const text = generateHandover({ h: b }, null, NOW)
    expect(text).toMatch(/Intrapartum antibiotics given 10:30 ✓/)
    expect(text).toMatch(/CTG: normal 10:00 > suspicious 11:00 > pathological 11:50 \(Discussed with reg\)/)
    expect(text).toMatch(/Oxytocin stopped 11:50: Pathological CTG/)
  })
})


describe("fixes from the second shift test", () => {
  it("stop-oxytocin alert is an action, not a snooze", () => {
    expect(fixLabel("oxytocin-stop-pathological")).toBe("Stop oxytocin")
  })
  it("a severe BP keeps the magnesium prompt up after a lower repeat, until Assessed", () => {
    const b0 = active({ riskFlags: ["Pre-eclampsia"], observations: { lastPulse: t(5 * MIN), lastTemp: t(5 * MIN), lastRR: t(5 * MIN) } })
    const b1 = { ...b0, ...recordObs(b0, t(40 * MIN), { bp: ["165", "110"] }) }
    const b2 = { ...b1, ...recordObs(b1, t(5 * MIN), { bp: ["150", "100"] }) }
    expect(ids(b2)).toContain("mgso4-severe-pet")
    expect(b2.observations.bpWorst).toMatchObject({ sys: 165, dia: 110 })
    expect(ids({ ...b2, ...fixAlert(b2, "mgso4-severe-pet", t(0)) })).not.toContain("mgso4-severe-pet")
  })
  it("consider prompts can be answered Not given, and the handover says so", () => {
    const b = active({ gestation: "30+2" })
    const after = { ...b, ...declineAlert("preterm-mgso4", t(0), "Dr S") }
    expect(ids(after)).not.toContain("preterm-mgso4")
    expect(generateHandover({ x: { ...after, id: "x", bedNumber: "1" } }, null, NOW)).toMatch(/MgSO4 \(neuroprotection\) not given/)
  })
  it("implausible obs are refused", () => {
    expect(obsProblem("temp", "383")).toMatch(/looks wrong/)
    expect(obsProblem("rr", "220")).toMatch(/looks wrong/)
    expect(obsProblem("bp", ["80", "120"])).toMatch(/higher than diastolic/)
    expect(obsProblem("pulse", "88")).toBeNull()
  })
})
