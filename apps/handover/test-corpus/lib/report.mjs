// Corpus bookkeeping, baseline image diffing, and markdown report generation.
//
// The "corpus" is the persistent memory of the loop: baselines/ holds one PNG
// per flow+state (the named test cases), and cases.json holds the last-known
// status of every bug signature so a re-run can classify each finding as NEW,
// STILL BROKEN, or FIXED instead of re-flagging the world.

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const HERE = dirname(dirname(fileURLToPath(import.meta.url)));
export const DIRS = {
  baselines: join(HERE, "baselines"),
  runs: join(HERE, "runs"),
  results: join(HERE, "results"),
};
for (const d of Object.values(DIRS)) mkdirSync(d, { recursive: true });

const CASES_FILE = join(HERE, "cases.json");

export function loadCases() {
  if (!existsSync(CASES_FILE)) return { bugs: {}, states: {} };
  try { return JSON.parse(readFileSync(CASES_FILE, "utf8")); } catch { return { bugs: {}, states: {} }; }
}
export function saveCases(cases) {
  writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
}

// Compare a fresh screenshot against the stored baseline for the same state.
// Returns { status: "new-baseline" | "unchanged" | "changed", pct, diffPath? }.
export function diffAgainstBaseline(stateKey, currentPath) {
  const baselinePath = join(DIRS.baselines, `${stateKey}.png`);
  if (!existsSync(baselinePath)) {
    copyFileSync(currentPath, baselinePath);
    return { status: "new-baseline", pct: 0 };
  }
  const a = PNG.sync.read(readFileSync(baselinePath));
  const b = PNG.sync.read(readFileSync(currentPath));
  if (a.width !== b.width || a.height !== b.height) {
    return { status: "changed", pct: 100, reason: `dimensions ${a.width}x${a.height} → ${b.width}x${b.height}` };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const mismatch = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  const pct = (mismatch / (a.width * a.height)) * 100;
  if (pct > 0.2) {
    const diffPath = join(DIRS.runs, `${stateKey}.diff.png`);
    writeFileSync(diffPath, PNG.sync.write(diff));
    return { status: "changed", pct: Number(pct.toFixed(2)), diffPath };
  }
  return { status: "unchanged", pct: Number(pct.toFixed(2)) };
}

// Turn a state's raw checks into flat bug records with stable signatures.
export function bugsFromState({ scenario, viewport, net, theme, structural, diagnostics, baseline }) {
  const bugs = [];
  const base = { scenario, viewport, net, theme };
  const sig = (category, detail) => `${scenario}::${viewport}::${net}::${category}::${detail}`;

  if (structural.docScroll) {
    bugs.push({ ...base, category: "h-scroll", severity: "visual",
      signature: sig("h-scroll", "doc"),
      expected: "No horizontal document scroll on a phone-first layout",
      observed: `document scrollWidth ${structural.docScroll.scrollWidth} > viewport ${structural.docScroll.vw}` });
  }
  for (const o of structural.overflow) {
    bugs.push({ ...base, category: "overflow", severity: "visual",
      signature: sig("overflow", `${o.el}:${o.side}`),
      expected: "Element stays within the viewport width",
      observed: `${o.el} overflows ${o.side} (right=${Math.round(o.rect.right)}, vw=${structural.viewport.vw})` });
  }
  for (const o of structural.overlaps) {
    bugs.push({ ...base, category: "overlap", severity: "visual",
      signature: sig("overlap", `${o.a}|${o.b}`),
      expected: "Interactive controls do not overlap",
      observed: `${o.a} overlaps ${o.b} (${o.overlapPct}% of the smaller control)` });
  }
  for (const c of structural.clipping) {
    bugs.push({ ...base, category: "clipping", severity: "visual",
      signature: sig("clipping", `${c.el}:${c.axis}`),
      expected: "Content is not clipped (non-ellipsis)",
      observed: `${c.el} clipped on ${c.axis} (scroll=${c.scroll} > client=${c.client})` });
  }
  for (const e of diagnostics.pageErrors) {
    bugs.push({ ...base, category: "page-error", severity: "flow",
      signature: sig("page-error", e.slice(0, 80)),
      expected: "No uncaught errors during the flow",
      observed: `Uncaught: ${e}` });
  }
  for (const e of diagnostics.consoleErrors) {
    bugs.push({ ...base, category: "console-error", severity: "flow",
      signature: sig("console-error", e.slice(0, 80)),
      expected: "No console errors during the flow",
      observed: `console.error: ${e}` });
  }
  for (const r of diagnostics.failedRequests) {
    bugs.push({ ...base, category: "net-fail", severity: "flow",
      signature: sig("net-fail", r.url.slice(0, 80)),
      expected: net === "offline" ? "Assets served from the PWA cache while offline" : "No failed network requests",
      observed: `${r.method} ${r.url} failed (${r.error})` });
  }
  if (baseline?.status === "changed") {
    bugs.push({ ...base, category: "visual-regression", severity: "visual",
      signature: sig("visual-regression", "baseline"),
      expected: "Screenshot matches the saved baseline for this state",
      observed: `Differs from baseline by ${baseline.pct}%${baseline.reason ? " (" + baseline.reason + ")" : ""}` });
  }
  return bugs;
}

const SEV_RANK = { payload: 0, flow: 1, visual: 2 };

// Classify this run's bugs against the prior corpus, update statuses, write it.
export function reconcile(cases, runBugs, extraFindings = []) {
  const now = new Date().toISOString();
  const seen = new Set();
  const classified = [];

  for (const bug of [...extraFindings, ...runBugs]) {
    const prior = cases.bugs[bug.signature];
    seen.add(bug.signature);
    let status;
    if (!prior || prior.state === "fixed") status = "NEW";
    else status = "STILL BROKEN";
    cases.bugs[bug.signature] = {
      state: "open", firstSeen: prior?.firstSeen || now, lastSeen: now,
      severity: bug.severity, scenario: bug.scenario,
    };
    classified.push({ ...bug, status });
  }

  // Anything previously open and not seen this run is FIXED.
  const fixed = [];
  for (const [signature, rec] of Object.entries(cases.bugs)) {
    if (rec.state === "open" && !seen.has(signature)) {
      rec.state = "fixed"; rec.fixedAt = now;
      fixed.push({ signature, ...rec });
    }
  }

  classified.sort((a, b) => (SEV_RANK[a.severity] - SEV_RANK[b.severity]) ||
    (a.status === b.status ? 0 : a.status === "NEW" ? -1 : 1));
  return { classified, fixed };
}

export function writeReport({ classified, fixed, states, payloadResult, meta }) {
  const lines = [];
  const now = new Date().toISOString();
  lines.push(`# Handover test loop — report`);
  lines.push("");
  lines.push(`_Generated ${now}_`);
  lines.push("");
  const counts = classified.reduce((m, b) => (m[b.status] = (m[b.status] || 0) + 1, m), {});
  const sev = classified.reduce((m, b) => (m[b.severity] = (m[b.severity] || 0) + 1, m), {});
  lines.push(`**Pass summary:** ${states} flow+state screenshots across ${meta.viewports.join(", ")} px, online + offline.`);
  lines.push("");
  lines.push(`| | Count |`);
  lines.push(`|---|---|`);
  lines.push(`| 🆕 NEW | ${counts["NEW"] || 0} |`);
  lines.push(`| 🔁 STILL BROKEN | ${counts["STILL BROKEN"] || 0} |`);
  lines.push(`| ✅ FIXED (this run) | ${fixed.length} |`);
  lines.push(`| — payload/data severity | ${sev["payload"] || 0} |`);
  lines.push(`| — broken-flow severity | ${sev["flow"] || 0} |`);
  lines.push(`| — visual-only severity | ${sev["visual"] || 0} |`);
  lines.push("");

  // Payload section always first — highest priority, flagged for human review.
  lines.push(`## 🔒 Payload / data integrity (review-only, do not auto-fix)`);
  lines.push("");
  lines.push(`Isolated check against \`src/utils/payload.js\` (payload v${payloadResult.version}, ${payloadResult.payloadBytes} bytes; link ${payloadResult.linkBytes} bytes).`);
  lines.push("");
  if (payloadResult.findings.length === 0) {
    lines.push(`- ✓ Contract assertions passed: encode→decode round-trip preserves ward/bed/text/priority; only \`{w,b,t,p}\` reach the wire (no \`id\`/\`done\`/\`createdAt\`/\`remindAt\` leak); corrupted codes are rejected; link round-trips.`);
  } else {
    for (const f of payloadResult.findings) lines.push(`- ✗ **${f.id}** — ${f.msg}`);
  }
  for (const n of payloadResult.notes) lines.push(`- ⚑ ${n}`);
  lines.push("");

  const sevBadge = { payload: "🔒 payload", flow: "🔴 flow", visual: "🟡 visual" };
  const statusBadge = { "NEW": "🆕 NEW", "STILL BROKEN": "🔁 STILL BROKEN" };

  lines.push(`## Findings`);
  lines.push("");
  if (classified.length === 0) {
    lines.push(`No structural, flow, or visual findings this pass. ✅`);
    lines.push("");
  } else {
    let i = 0;
    for (const b of classified) {
      i++;
      lines.push(`### ${i}. [${statusBadge[b.status]}] ${sevBadge[b.severity]} — ${b.category} · ${b.scenario}`);
      lines.push("");
      lines.push(`- **Flow / state:** ${b.scenario}`);
      lines.push(`- **Viewport / network / theme:** ${b.viewport}px · ${b.net} · ${b.theme}`);
      lines.push(`- **Expected:** ${b.expected}`);
      lines.push(`- **Observed:** ${b.observed}`);
      if (b.screenshot) lines.push(`- **Screenshot:** \`${b.screenshot}\``);
      lines.push("");
    }
  }

  // Vision-pass notes (written by a human/agent reviewing flagged + new-baseline
  // screenshots). Kept in visual-notes.md so it survives mechanical re-runs.
  const notesPath = join(HERE, "visual-notes.md");
  if (existsSync(notesPath)) {
    lines.push(`## 👁 Visual review (vision pass)`);
    lines.push("");
    lines.push(readFileSync(notesPath, "utf8").trim());
    lines.push("");
  }

  if (fixed.length) {
    lines.push(`## ✅ Fixed since last run`);
    lines.push("");
    for (const f of fixed) lines.push(`- ${f.scenario} — \`${f.signature}\``);
    lines.push("");
  }

  const reportPath = join(HERE, "REPORT.md");
  writeFileSync(reportPath, lines.join("\n"));
  return reportPath;
}
