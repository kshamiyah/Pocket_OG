// The Rules and sources page must cover every alert the engine can raise, and
// every rule must point at real source text or say plainly that it is local.

import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { RULES, RULE_FOR_ALERT, RULE_GROUPS } from "./ruleCatalogue.js"
import { SOURCES } from "./sources.js"
import { UNIT_SETTINGS } from "./unitSettings.js"

const engine = readFileSync(new URL("../utils/wardAlerts.js", import.meta.url), "utf8")
const engineIds = [...new Set([...engine.matchAll(/id: "([a-z0-9-]+)"/g)].map(m => m[1]))]

describe("rule catalogue", () => {
  it("lists every alert id the engine can raise", () => {
    expect(engineIds.length).toBeGreaterThan(40)
    expect(engineIds.filter(id => !RULE_FOR_ALERT[id])).toEqual([])
  })
  it("lists no alert id the engine does not raise", () => {
    expect(Object.keys(RULE_FOR_ALERT).filter(id => !engineIds.includes(id))).toEqual([])
  })
  it("every source key resolves to verbatim text", () => {
    const missing = RULES.flatMap(r => r.sources).filter(k => !SOURCES[k]?.text)
    expect(missing).toEqual([])
  })
  it("every rule is sourced or marked local", () => {
    expect(RULES.filter(r => !r.sources.length && !r.local).map(r => r.id)).toEqual([])
  })
  it("every rule sits in a known group, with unique ids", () => {
    expect(RULES.filter(r => !RULE_GROUPS.includes(r.group))).toEqual([])
    expect(new Set(RULES.map(r => r.id)).size).toBe(RULES.length)
  })
  it("NICE sources link to the exact recommendation", () => {
    const bad = Object.entries(SOURCES).filter(([, s]) => s.issuer === "NICE" && !/^https:\/\/www\.nice\.org\.uk\/guidance\/ng\d+\/chapter\//.test(s.url))
    expect(bad).toEqual([])
  })
  it("uses no em dashes in the app's own wording", () => {
    const own = RULES.flatMap(r => [r.title, r.when, r.then, r.local ?? ""])
    expect(own.filter(x => x.includes("—"))).toEqual([])
  })
  it("every unit setting is shown on at least one rule, and every rule setting exists", () => {
    const used = new Set(RULES.flatMap(r => r.settings ?? []))
    expect(UNIT_SETTINGS.map(x => x.key).filter(k => !used.has(k))).toEqual([])
    expect([...used].filter(k => !UNIT_SETTINGS.some(x => x.key === k))).toEqual([])
  })
})
