// The shelf (src/data/shelf.js): shelved local guidance must be unreachable
// everywhere in the app, and still stored so it can be put back.
// Run:  npx vitest run src/data/shelf.test.js
import { test, expect } from "vitest";
import { GUIDELINES, DIVERGENCES } from "@pocket-og/guidelines";
import * as GL from "@pocket-og/guidelines";
import { SHELVED_GUIDES, SHELVED_FLOWCHARTS, SHELVED_DIVERGENCES, isShelvedLink } from "./shelf";
import { FLOWCHARTS } from "./flowcharts";
import { FLOWCHART_NODE_CONNECTIONS, CALCULATOR_CONNECTIONS, GUIDELINE_KEYWORD_LINKS } from "./connections";
import { TOPICS } from "./topics";
import { PEARLS } from "./pearls";
import { READER_AVAILABLE } from "./readerAvailable";
import { SEARCH_INDEX } from "../search/engine";
import * as GL861_CHARTS from "./GL861_FLOWCHART";

test("the shelf is not empty", () => {
  expect(SHELVED_GUIDES.size + SHELVED_FLOWCHARTS.size + SHELVED_DIVERGENCES.size).toBeGreaterThan(0);
});

test("shelved content is still stored, so it can be put back", () => {
  for (const code of SHELVED_GUIDES) {
    expect(GUIDELINES[code], `${code} registry entry`).toBeTruthy();
    expect(GL[`${code}_SECTIONS`]?.length, `${code} guide text`).toBeGreaterThan(0);
  }
  const storedCharts = Object.values(GL861_CHARTS).map(c => c.id);
  for (const id of SHELVED_FLOWCHARTS) expect(storedCharts, `${id} chart file`).toContain(id);
  for (const id of SHELVED_DIVERGENCES) expect(DIVERGENCES[id], `${id} divergence`).toBeTruthy();
});

test("shelved content cannot be reached from anywhere in the app", () => {
  const leaks = [];
  for (const id of SHELVED_FLOWCHARTS) if (FLOWCHARTS[id]) leaks.push(`FLOWCHARTS serves ${id}`);
  for (const code of SHELVED_GUIDES) if (READER_AVAILABLE.has(code)) leaks.push(`reader opens ${code}`);

  let linksChecked = 0;
  const check = (where, list) => (list ?? []).forEach(l => { linksChecked++; if (isShelvedLink(l)) leaks.push(`${where} links to ${l.gl}/${l.id}`); });
  for (const [fc, nodes] of Object.entries(FLOWCHART_NODE_CONNECTIONS)) {
    if (SHELVED_FLOWCHARTS.has(fc)) leaks.push(`connections kept for ${fc}`);
    for (const [node, c] of Object.entries(nodes)) { check(`${fc}.${node}`, c.whatsNext); check(`${fc}.${node} inline`, c.inlineLinks); }
  }
  for (const [k, list] of Object.entries(CALCULATOR_CONNECTIONS)) check(`calculator ${k}`, list);
  for (const [k, list] of Object.entries(GUIDELINE_KEYWORD_LINKS)) {
    if (SHELVED_GUIDES.has(k)) leaks.push(`keyword links kept for ${k}`);
    check(`keywords ${k}`, list);
  }
  for (const t of Object.values(TOPICS)) for (const s of t.sections ?? []) check(`topic ${t.id}`, s.entries);
  for (const p of PEARLS) if (SHELVED_GUIDES.has(p.gl) || SHELVED_FLOWCHARTS.has(p.fc)) leaks.push(`pearl ${p.id}`);
  for (const page of SEARCH_INDEX) {
    if (SHELVED_GUIDES.has(page.gl)) leaks.push(`search indexes ${page.id}`);
    if (page.id?.startsWith("differs-") && SHELVED_DIVERGENCES.has(page.id.slice(8))) leaks.push(`search indexes ${page.id}`);
  }
  // Charts that are still served must not step into a shelved chart.
  for (const [id, fc] of Object.entries(FLOWCHARTS)) for (const n of Object.values(fc.nodes ?? {})) {
    for (const t of [n.next, ...(n.options ?? []).map(o => o.next)]) if (t && SHELVED_FLOWCHARTS.has(t)) leaks.push(`${id} steps into ${t}`);
  }

  expect(linksChecked).toBeGreaterThan(100);
  expect(leaks).toEqual([]);
});
