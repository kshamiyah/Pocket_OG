// Integrity check: every cross-reference in the app must resolve to a real target.
// Covers flowchart "what's next" + inline links, guideline section flowchartIds,
// and calculator connections. Run:  npx vitest run src/data/linkCheck.test.js
import { test, expect } from "vitest";
import { FLOWCHARTS } from "./flowcharts";
import { FLOWCHART_NODE_CONNECTIONS, CALCULATOR_CONNECTIONS } from "./connections";
import { GUIDELINES } from "@pocket-og/guidelines";
import * as GL from "@pocket-og/guidelines";
import { CALCULATOR_SCENARIOS } from "./calculator";
import { CONSENT_PROCEDURES } from "./consent";
import { PEARLS, pearlLinks } from "./pearls";
import { TRIAL_SECTIONS } from "./trials";
import { ANTIHYPERTENSIVES } from "./rx/antihypertensives";
import { UTEROTONICS } from "./rx/uterotonics";
import { ANTIEMETICS } from "./rx/antiemetics";
import { ANTIBIOTICS } from "./rx/antibiotics";
import { ANTIVIRALS } from "./rx/antivirals";
import { TOCOLYTICS } from "./rx/tocolytics";
import { ANTICOAGULANTS } from "./rx/anticoagulants";
import { ANALGESIA } from "./rx/analgesia";
import { ENDOMETRIOSIS_DRUGS } from "./rx/endometriosis";
import { CONTRACEPTION } from "./rx/contraception";

const flowchartIds = new Set(Object.keys(FLOWCHARTS));
const guidelineCodes = new Set(Object.keys(GUIDELINES));
const calcIds = new Set(CALCULATOR_SCENARIOS.map(s => s.id));
const consentIds = new Set(CONSENT_PROCEDURES.map(p => p.id));
const drugIds = new Set([
  ...ANTIHYPERTENSIVES, ...UTEROTONICS, ...ANTIEMETICS, ...ANTIBIOTICS, ...ANTIVIRALS,
  ...TOCOLYTICS, ...ANTICOAGULANTS, ...ANALGESIA, ...ENDOMETRIOSIS_DRUGS, ...CONTRACEPTION,
].map(d => d.id));

// Resolve a single { type, id, gl } link to an error string, or null if OK.
function checkLink(link, where) {
  const { type, id, gl } = link;
  if (type === "flowchart") {
    if (!flowchartIds.has(id)) return `${where}: flowchart link → missing flowchart "${id}"`;
  } else if (type === "reader") {
    if (!guidelineCodes.has(id ?? gl)) return `${where}: reader link → missing guideline "${id ?? gl}"`;
  } else if (type === "calculator") {
    if (!calcIds.has(id)) return `${where}: calculator link → missing scenario "${id}"`;
  } else if (type === "consent") {
    if (!consentIds.has(id)) return `${where}: consent link → missing procedure "${id}"`;
  } else if (type === "drug") {
    if (!drugIds.has(id)) return `${where}: drug link → missing drug "${id}"`;
  } else if (type === "iol-prioritizer") {
    /* app-level target, always available */
  } else {
    return `${where}: unknown link type "${type}"`;
  }
  return null;
}

test("all flowchart node connections resolve to real targets", () => {
  const errors = [];
  for (const [fcId, nodes] of Object.entries(FLOWCHART_NODE_CONNECTIONS)) {
    if (!flowchartIds.has(fcId)) errors.push(`connections key "${fcId}" is not a registered flowchart`);
    const fc = FLOWCHARTS[fcId];
    for (const [nodeId, conn] of Object.entries(nodes)) {
      if (fc && !fc.nodes[nodeId]) errors.push(`${fcId}.${nodeId}: node id does not exist in the flowchart`);
      for (const l of conn.whatsNext ?? []) {
        const e = checkLink(l, `${fcId}.${nodeId} whatsNext`); if (e) errors.push(e);
      }
      for (const l of conn.inlineLinks ?? []) {
        const e = checkLink(l, `${fcId}.${nodeId} inlineLinks`); if (e) errors.push(e);
        // inline link phrase should actually appear in the node's text/items
        const node = fc?.nodes[nodeId];
        if (node && l.phrase) {
          const hay = [node.text, ...(node.items ?? [])].filter(Boolean).join(" ").toLowerCase();
          if (!hay.includes(l.phrase.toLowerCase())) {
            errors.push(`${fcId}.${nodeId}: inline phrase "${l.phrase}" not found in node text`);
          }
        }
      }
    }
  }
  for (const [calcId, links] of Object.entries(CALCULATOR_CONNECTIONS)) {
    for (const l of links) { const e = checkLink(l, `calc:${calcId}`); if (e) errors.push(e); }
  }
  if (errors.length) console.log("\nBROKEN LINKS:\n" + errors.join("\n") + "\n");
  expect(errors).toEqual([]);
});

test("every Pearl of the Day links to real content", () => {
  const errors = [];
  const ids = new Set();
  for (const pearl of PEARLS) {
    if (ids.has(pearl.id)) errors.push(`duplicate pearl id "${pearl.id}"`);
    ids.add(pearl.id);
    if (!guidelineCodes.has(pearl.gl)) errors.push(`pearl:${pearl.id}: gl "${pearl.gl}" is not a guideline`);
    const links = pearlLinks(pearl);
    if (links.length === 0) errors.push(`pearl:${pearl.id}: has no resolvable links`);
    for (const l of links) {
      const e = checkLink(l, `pearl:${pearl.id}`); if (e) errors.push(e);
    }
  }
  if (errors.length) console.log("\nBROKEN pearl links:\n" + errors.join("\n") + "\n");
  expect(errors).toEqual([]);
});

test("every Landmark Trial card links to real content", () => {
  const errors = [];
  const ids = new Set();
  for (const t of TRIAL_SECTIONS) {
    if (ids.has(t.id)) errors.push(`duplicate trial id "${t.id}"`);
    ids.add(t.id);
    if (t.flowchartId && !flowchartIds.has(t.flowchartId)) errors.push(`trial:${t.id}: flowchartId "${t.flowchartId}" not registered`);
    for (const code of t.relatedGl ?? []) {
      if (!guidelineCodes.has(code)) errors.push(`trial:${t.id}: relatedGl "${code}" is not a guideline`);
    }
  }
  if (errors.length) console.log("\nBROKEN trial links:\n" + errors.join("\n") + "\n");
  expect(errors).toEqual([]);
});

test("every guideline section flowchartId resolves", () => {
  const errors = [];
  for (const [name, val] of Object.entries(GL)) {
    if (!name.endsWith("_SECTIONS") || !Array.isArray(val)) continue;
    for (const section of val) {
      if (section.flowchartId && !flowchartIds.has(section.flowchartId)) {
        errors.push(`${name} · ${section.id}: flowchartId "${section.flowchartId}" not registered`);
      }
    }
  }
  if (errors.length) console.log("\nBROKEN flowchartId:\n" + errors.join("\n") + "\n");
  expect(errors).toEqual([]);
});
