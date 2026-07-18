#!/usr/bin/env node
// Content review: cross-check app content against the guideline text it cites.
//
// The app's clinical content (flowcharts, pearls) restates numbers that must be
// traceable to the cited guideline. The guideline text itself lives in
// packages/guidelines/src as *_SECTIONS. This script extracts every numeric
// clinical claim (dose, threshold, timing, percentage) from the app content and
// checks the same value+unit appears somewhere in the cited guideline's
// sections. Anything it cannot find is flagged for human review against the
// original guideline PDF.
//
// A flagged claim is NOT automatically wrong. It means the number cannot be
// verified against the in-repo guideline text, so either:
//   - the app content is wrong (fix it),
//   - the guideline sections omit that detail (consider adding it), or
//   - the claim comes from a different source (cite it explicitly).
//
// Usage (from repo root):
//   node scripts/content-review.mjs check [GL codes...] [--out report.md] [--strict]
//   node scripts/content-review.mjs pack GTG52 [--out gtg52-review.md]
//
// "check": numeric cross-check, writes a markdown report (stdout by default).
//          --strict exits 1 if any findings, for use as a gate.
// "pack":  emits the guideline text plus every app item citing it, side by
//          side, as a bundle for a full semantic proofread (human or AI).

import { register } from "node:module";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

register("./lib/loader.mjs", import.meta.url);

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DATA = path.join(REPO_ROOT, "apps", "pocket-og", "src", "data");
const GUIDELINES_SRC = path.join(REPO_ROOT, "packages", "guidelines", "src");

// Flowcharts whose registry key does not start with their guideline code.
// Value is the list of in-repo guideline codes the flowchart draws from, or
// null when the source is external (TOG review articles, ESC, Resus Council,
// local aggregates) and no in-repo section text exists to check against.
const FLOWCHART_GL_OVERRIDES = {
  GTG20_BREECH: ["GTG20A", "GTG20B"],
  MATERNAL_COLLAPSE_ARREST: ["GTG56"],
  BSH_SCD_CRISIS: ["BSH_SCD"],
  SCD_CRISIS: ["BSH_SCD"],
  QS46_CARE_PATHWAY: ["NG137"],
  QS46_TERTIARY: ["NG137"],
  ADNEXAL_MASS_TRIAGE: ["GTG62", "GTG34"],
  ESC_MWHO_TRIAGE: ["ESC_CVD"],
};

// ── load data ────────────────────────────────────────────────────────────────

async function loadData() {
  const guidelinesMod = await import(pathToFileURL(path.join(GUIDELINES_SRC, "index.js")).href);
  const { FLOWCHARTS } = await import(pathToFileURL(path.join(APP_DATA, "flowcharts.js")).href);
  const { PEARLS } = await import(pathToFileURL(path.join(APP_DATA, "pearls.js")).href);

  // Group guideline sections by their gl code (one module can carry several).
  const sectionsByGl = new Map();
  for (const [name, value] of Object.entries(guidelinesMod)) {
    if (!name.endsWith("_SECTIONS") || !Array.isArray(value)) continue;
    for (const section of value) {
      if (!section || !section.gl) continue;
      if (!sectionsByGl.has(section.gl)) sectionsByGl.set(section.gl, []);
      sectionsByGl.get(section.gl).push(section);
    }
  }
  return { GUIDELINES: guidelinesMod.GUIDELINES ?? {}, sectionsByGl, FLOWCHARTS, PEARLS };
}

// ── text collection ──────────────────────────────────────────────────────────

// Keys that are wiring or presentation, not clinical prose.
const SKIP_KEYS = new Set([
  "id", "type", "next", "startId", "gl", "fc", "calc", "drug", "tool",
  "color", "iconColor", "href", "url", "pdfPath", "pdfUrl", "pdfs",
  "flowchartId", "kind", "tags", "icon",
]);

function collectStrings(node, trail, out) {
  if (typeof node === "string") {
    out.push({ trail, text: node });
  } else if (Array.isArray(node)) {
    node.forEach((item, i) => collectStrings(item, trail, out));
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.has(key)) continue;
      collectStrings(value, trail ? `${trail}.${key}` : key, out);
    }
  }
  return out;
}

// ── claim extraction ─────────────────────────────────────────────────────────

// Unit spellings, longest first so the alternation matches greedily.
// [spelling, canonical unit, scale to canonical]
const UNIT_DEFS = [
  ["micrograms", "mcg", 1], ["microgram", "mcg", 1], ["mcg", "mcg", 1],
  ["µg", "mcg", 1], ["μg", "mcg", 1],
  ["milligrams", "mcg", 1000], ["milligram", "mcg", 1000], ["mg/kg", "mg/kg", 1],
  ["mg/l", "mg/l", 1], ["mg", "mcg", 1000],
  ["grams", "mcg", 1e6], ["gram", "mcg", 1e6],
  ["g/dl", "g/dl", 1], ["g/l", "g/l", 1],
  ["kg/m²", "kg/m2", 1], ["kg/m2", "kg/m2", 1], ["kg", "kg", 1],
  ["mmol/mol", "mmol/mol", 1], ["mmol/l", "mmol/l", 1],
  ["µmol/l", "umol/l", 1], ["μmol/l", "umol/l", 1], ["umol/l", "umol/l", 1],
  ["nmol/l", "nmol/l", 1], ["pmol/l", "pmol/l", 1],
  ["ng/ml", "ng/ml", 1], ["miu/ml", "miu/ml", 1], ["iu/ml", "iu/ml", 1],
  ["ml/kg/hr", "ml/kg/h", 1], ["ml/kg/hour", "ml/kg/h", 1], ["ml/kg", "ml/kg", 1],
  ["ml/hr", "ml/h", 1], ["ml/hour", "ml/h", 1], ["ml/min", "ml/min", 1],
  ["l/min", "l/min", 1],
  ["mls", "ml", 1], ["ml", "ml", 1],
  ["litres", "ml", 1000], ["litre", "ml", 1000],
  ["mmhg", "mmhg", 1], ["kpa", "kpa", 1],
  ["iu", "iu", 1], ["units", "iu", 1], ["unit", "iu", 1],
  ["×10⁹/l", "x109/l", 1], ["x10⁹/l", "x109/l", 1], ["x109/l", "x109/l", 1],
  ["weeks", "wk", 1], ["week", "wk", 1], ["wks", "wk", 1],
  ["days", "d", 1], ["day", "d", 1],
  ["hourly", "h", 1], ["hours", "h", 1], ["hour", "h", 1], ["hrs", "h", 1], ["hr", "h", 1],
  ["minutes", "min", 1], ["minute", "min", 1], ["mins", "min", 1], ["min", "min", 1],
  ["seconds", "s", 1], ["second", "s", 1], ["secs", "s", 1], ["sec", "s", 1],
  ["percent", "%", 1], ["%", "%", 1],
  ["mm", "mm", 1], ["cm", "cm", 1],
  ["beats/min", "bpm", 1], ["bpm", "bpm", 1], ["/min", "/min", 1],
  ["doses", "dose", 1], ["dose", "dose", 1],
];

const UNIT_LOOKUP = new Map(UNIT_DEFS.map(([s, u, k]) => [s, [u, k]]));
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const UNIT_ALT = UNIT_DEFS.map(([s]) => escapeRe(s)).join("|");
const NUM = String.raw`(?:\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)`;

const CLAIM_RE = new RegExp(
  String.raw`(?<![\d+.,])(${NUM})(?:\s*(?:–|—|-|−|to)\s*(${NUM}))?\s*(${UNIT_ALT})(?![a-z0-9µμ⁹%²/])`,
  "gi"
);
// Gestational age written as weeks+days, e.g. "37+0" or "34+6 weeks".
const GA_RE = /\b(\d{1,2})\+([0-6])\b/g;

function claimKey(rawValue, rawUnit) {
  const [unit, scale] = UNIT_LOOKUP.get(rawUnit.toLowerCase()) ?? [rawUnit.toLowerCase(), 1];
  const value = parseFloat(rawValue.replace(/,/g, "")) * scale;
  return `${value} ${unit}`;
}

function extractClaims(text) {
  const claims = [];
  for (const m of text.matchAll(CLAIM_RE)) {
    const [, v1, v2, unit] = m;
    claims.push({ key: claimKey(v1, unit), display: `${v1}${v2 ? "–" + v2 : ""} ${unit}`, index: m.index, source: text });
    if (v2) claims.push({ key: claimKey(v2, unit), display: `${v1}–${v2} ${unit}`, index: m.index, source: text });
  }
  for (const m of text.matchAll(GA_RE)) {
    claims.push({ key: `ga:${m[1]}+${m[2]}`, display: `${m[0]} weeks`, index: m.index, source: text });
  }
  return claims;
}

function snippet(text, index, span = 90) {
  const start = Math.max(0, index - span / 2);
  const end = Math.min(text.length, index + span);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? "…" : ""}`;
}

// ── guideline corpora ────────────────────────────────────────────────────────

function buildCorpora(sectionsByGl) {
  const corpora = new Map();
  for (const [gl, sections] of sectionsByGl) {
    const strings = collectStrings(sections, "", []);
    const keys = new Set();
    for (const { text } of strings) {
      for (const claim of extractClaims(text)) keys.add(claim.key);
    }
    corpora.set(gl, { keys, sections });
  }
  return corpora;
}

function resolveFlowchartGls(registryKey, glCodes) {
  if (registryKey in FLOWCHART_GL_OVERRIDES) return FLOWCHART_GL_OVERRIDES[registryKey];
  const matches = glCodes.filter((gl) => registryKey === gl || registryKey.startsWith(gl + "_"));
  if (!matches.length) return null;
  const longest = Math.max(...matches.map((g) => g.length));
  return matches.filter((g) => g.length === longest);
}

// ── check mode ───────────────────────────────────────────────────────────────

function checkItem(label, gls, strings, corpora) {
  const keySets = gls.map((gl) => corpora.get(gl)?.keys).filter(Boolean);
  const findings = [];
  const seen = new Set();
  for (const { trail, text } of strings) {
    for (const claim of extractClaims(text)) {
      if (keySets.some((set) => set.has(claim.key))) continue;
      const dedupe = `${claim.display}|${trail}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      findings.push({ label, trail, claim: claim.display, key: claim.key, context: snippet(text, claim.index) });
    }
  }
  return findings;
}

function runCheck(data, glFilter) {
  const { GUIDELINES, sectionsByGl, FLOWCHARTS, PEARLS } = data;
  const corpora = buildCorpora(sectionsByGl);
  const glCodes = [...corpora.keys()];

  const perGl = new Map(); // gl -> [{item, findings}]
  const unsourced = []; // items with no in-repo guideline text
  let itemsChecked = 0;

  const record = (gls, itemLabel, findings) => {
    itemsChecked += 1;
    const primary = gls[0];
    if (!perGl.has(primary)) perGl.set(primary, []);
    if (findings.length) perGl.get(primary).push({ itemLabel, gls, findings });
  };

  for (const [key, fc] of Object.entries(FLOWCHARTS)) {
    const gls = resolveFlowchartGls(key, glCodes);
    const label = `Flowchart ${key} (${fc.title ?? key})`;
    if (!gls) {
      unsourced.push(`${label}, subtitle: ${fc.subtitle ?? "?"}`);
      continue;
    }
    if (glFilter.length && !gls.some((g) => glFilter.includes(g))) continue;
    const strings = [];
    for (const [nodeId, node] of Object.entries(fc.nodes ?? {})) {
      collectStrings(node, `node ${nodeId}`, strings);
    }
    record(gls, label, checkItem(label, gls, strings, corpora));
  }

  for (const pearl of PEARLS) {
    const gls = pearl.gl && corpora.has(pearl.gl) ? [pearl.gl] : null;
    const label = `Pearl "${pearl.id}" (${pearl.topic})`;
    if (!gls) {
      unsourced.push(`${label}, cites ${pearl.gl ?? "nothing"}`);
      continue;
    }
    if (glFilter.length && !glFilter.includes(pearl.gl)) continue;
    const strings = [
      { trail: "pearl", text: pearl.pearl ?? "" },
      { trail: "detail", text: pearl.detail ?? "" },
    ];
    record(gls, label, checkItem(label, gls, strings, corpora));
  }

  // ── report ──
  const lines = [];
  const totalFindings = [...perGl.values()].flat().reduce((n, i) => n + i.findings.length, 0);
  lines.push(`# Content review: numeric cross-check`);
  lines.push("");
  lines.push(`Checked ${itemsChecked} content items against the in-repo guideline text.`);
  lines.push(`Findings: **${totalFindings}** numeric claims that could not be matched to the cited guideline's sections.`);
  lines.push("");
  lines.push(`A finding is not automatically an error. For each one, check the original guideline: either fix the app content, add the missing detail to the guideline sections, or cite the real source in the content file.`);
  lines.push("");

  const sortedGls = [...perGl.keys()].sort();
  for (const gl of sortedGls) {
    const items = perGl.get(gl);
    if (!items.length) continue;
    const meta = GUIDELINES[gl];
    lines.push(`## ${gl}${meta ? `: ${meta.label} (${meta.source}, ${meta.date})` : ""}`);
    lines.push("");
    for (const item of items) {
      lines.push(`### ${item.itemLabel}`);
      if (item.gls.length > 1) lines.push(`Checked against: ${item.gls.join(", ")}`);
      lines.push("");
      for (const f of item.findings) {
        lines.push(`- **${f.claim}** [${f.trail}]`);
        lines.push(`  > ${f.context}`);
      }
      lines.push("");
    }
  }

  const cleanGls = sortedGls.filter((gl) => !perGl.get(gl).length);
  if (cleanGls.length) {
    lines.push(`## Clean`);
    lines.push("");
    lines.push(`No unmatched numeric claims: ${cleanGls.join(", ")}`);
    lines.push("");
  }

  if (unsourced.length && !glFilter.length) {
    lines.push(`## No in-repo source text (manual verification only)`);
    lines.push("");
    lines.push(`These items cite sources whose text is not in packages/guidelines, so the script cannot check them. Verify against the named source directly:`);
    lines.push("");
    for (const u of unsourced) lines.push(`- ${u}`);
    lines.push("");
  }

  return { report: lines.join("\n"), totalFindings };
}

// ── pack mode ────────────────────────────────────────────────────────────────

function renderSectionContent(content, lines) {
  for (const block of content ?? []) {
    if (block.type === "subheading") lines.push(`**${block.value}**`);
    else if (block.type === "text" || block.type === "alert") lines.push(block.value);
    else if (block.type === "list") {
      for (const item of block.items ?? []) {
        lines.push(`- ${typeof item === "string" ? item : item.text}`);
      }
    } else if (block.type === "table") {
      lines.push(`| ${block.headers.join(" | ")} |`);
      lines.push(`|${block.headers.map(() => "---").join("|")}|`);
      for (const row of block.rows ?? []) lines.push(`| ${row.join(" | ")} |`);
    }
    lines.push("");
  }
}

function runPack(data, gl) {
  const { GUIDELINES, sectionsByGl, FLOWCHARTS, PEARLS } = data;
  const sections = sectionsByGl.get(gl);
  if (!sections) {
    const known = [...sectionsByGl.keys()].sort().join(", ");
    throw new Error(`No guideline sections for "${gl}". Known codes: ${known}`);
  }
  const meta = GUIDELINES[gl];
  const lines = [];
  lines.push(`# Review pack: ${gl}${meta ? `, ${meta.label} (${meta.source}, ${meta.date})` : ""}`);
  lines.push("");
  lines.push(`Read Part 1 (the guideline text as held in this repo), then review each item in Part 2 against it. Flag: numbers or doses that differ, recommendations stated more strongly than the guideline states them, missing caveats or contraindications, and anything in the app content that has no basis in the guideline text. Where the guideline text itself looks wrong, verify against the original PDF${meta?.pdfUrl ? ` (${meta.pdfUrl})` : ""}.`);
  lines.push("");
  lines.push(`## Part 1: guideline text (packages/guidelines/src)`);
  lines.push("");
  for (const s of sections) {
    lines.push(`### ${s.title} [${s.id}]`);
    lines.push("");
    renderSectionContent(s.content, lines);
  }

  lines.push(`## Part 2: app content citing ${gl}`);
  lines.push("");
  const glCodes = [...sectionsByGl.keys()];
  for (const [key, fc] of Object.entries(FLOWCHARTS)) {
    const gls = resolveFlowchartGls(key, glCodes);
    if (!gls || !gls.includes(gl)) continue;
    lines.push(`### Flowchart ${key}: ${fc.title ?? ""}`);
    lines.push("");
    for (const [nodeId, node] of Object.entries(fc.nodes ?? {})) {
      lines.push(`**[${node.type}] ${nodeId}: ${node.title ?? ""}**`);
      if (node.text) lines.push(node.text);
      for (const item of node.items ?? []) {
        lines.push(`- ${typeof item === "string" ? item : item.text}`);
      }
      for (const opt of node.options ?? []) {
        lines.push(`- Option: ${opt.label}${opt.sublabel ? ` (${opt.sublabel})` : ""} -> ${opt.next}`);
      }
      lines.push("");
    }
  }
  for (const pearl of PEARLS) {
    if (pearl.gl !== gl) continue;
    lines.push(`### Pearl "${pearl.id}": ${pearl.topic}`);
    lines.push("");
    lines.push(`> ${pearl.pearl}`);
    lines.push("");
    lines.push(pearl.detail ?? "");
    lines.push("");
  }
  return lines.join("\n");
}

// ── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const outIdx = args.indexOf("--out");
  const outFile = outIdx >= 0 ? args[outIdx + 1] : null;
  const positional = args.filter((a, i) => !a.startsWith("--") && i !== outIdx + 1);
  const command = positional[0] === "pack" || positional[0] === "check" ? positional.shift() : "check";

  const data = await loadData();

  let output;
  let exitCode = 0;
  if (command === "pack") {
    const gl = positional[0];
    if (!gl) {
      console.error("Usage: node scripts/content-review.mjs pack <GL code> [--out file]");
      process.exit(2);
    }
    output = runPack(data, gl.toUpperCase());
  } else {
    const { report, totalFindings } = runCheck(data, positional.map((g) => g.toUpperCase()));
    output = report;
    if (strict && totalFindings > 0) exitCode = 1;
  }

  if (outFile) {
    writeFileSync(outFile, output + "\n");
    console.log(`Written to ${outFile}`);
  } else {
    console.log(output);
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(2);
});
