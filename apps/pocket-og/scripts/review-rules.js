#!/usr/bin/env node

// Review compiler rules — confirm or decline before they are used at runtime.
//
// Usage:
//   node scripts/review-rules.js list
//   node scripts/review-rules.js show condition/severe-pet
//   node scripts/review-rules.js confirm condition/severe-pet --reviewer "KS"
//   node scripts/review-rules.js decline interaction/hyperemesis-no-dextrose --reason "Wording needs RBH tweak"
//   node scripts/review-rules.js export-md   → writes docs/COMPILER_RULES_REVIEW.md

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllRulesForReview, RULE_STATUS } from "../src/compiler/clinicalCompiler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const RULE_FILES = {
  condition: path.join(ROOT, "src/compiler/rules/conditions.js"),
  interaction: path.join(ROOT, "src/compiler/rules/interactions.js"),
  safety: path.join(ROOT, "src/compiler/rules/safety-checklists.js"),
};

const STATUS_ICON = {
  proposed: "⏳",
  confirmed: "✅",
  declined: "❌",
};

function allRulesFlat() {
  const { conditions, interactions, safetyChecklists } = getAllRulesForReview();
  return [
    ...conditions.map(r => ({ ...r, category: "condition" })),
    ...interactions.map(r => ({ ...r, category: "interaction" })),
    ...safetyChecklists.map(r => ({ ...r, category: "safety" })),
  ];
}

function parseRef(ref) {
  const [category, ...rest] = ref.split("/");
  const id = rest.join("/");
  if (!RULE_FILES[category] || !id) {
    console.error(`Invalid ref "${ref}". Use: condition/<id> | interaction/<id> | safety/<id>`);
    process.exit(1);
  }
  return { category, id, file: RULE_FILES[category] };
}

function updateRuleStatus({ category, id, file }, newStatus, { reviewer, reason }) {
  let content = fs.readFileSync(file, "utf8");
  const today = new Date().toISOString().slice(0, 10);

  // Match rule block by id field within the file
  const idPattern = new RegExp(
    `(\\{[\\s\\S]*?id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?status:\\s*)RULE_STATUS\\.\\w+`,
  );

  if (!idPattern.test(content)) {
    console.error(`Rule "${id}" not found in ${path.relative(ROOT, file)}`);
    process.exit(1);
  }

  const statusKey = newStatus === RULE_STATUS.CONFIRMED ? "CONFIRMED"
    : newStatus === RULE_STATUS.DECLINED ? "DECLINED"
    : "PROPOSED";

  content = content.replace(idPattern, `$1RULE_STATUS.${statusKey}`);

  if (newStatus === RULE_STATUS.CONFIRMED && reviewer) {
    const reviewedPattern = new RegExp(
      `(id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?)(\\n\\s*\\},|\\n\\s*immediateActions|\\n\\s*when:)`,
    );
    content = content.replace(reviewedPattern, (match, prefix, suffix) => {
      if (prefix.includes("reviewedBy:")) return match;
      return `${prefix}\n    reviewedBy: "${reviewer}",\n    reviewedAt: "${today}",${suffix}`;
    });
  }

  if (newStatus === RULE_STATUS.DECLINED && reason) {
    const declinePattern = new RegExp(
      `(id:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?)(\\n\\s*\\},|\\n\\s*immediateActions|\\n\\s*when:)`,
    );
    content = content.replace(declinePattern, (match, prefix, suffix) => {
      if (prefix.includes("declineReason:")) return match;
      return `${prefix}\n    declineReason: ${JSON.stringify(reason)},${suffix}`;
    });
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${category}/${id} → ${newStatus}`);
}

function cmdList() {
  const rules = allRulesFlat();
  const byStatus = { proposed: [], confirmed: [], declined: [] };
  for (const r of rules) byStatus[r.status]?.push(r);

  console.log("\n═══ COMPILER RULES — REVIEW QUEUE ═══\n");
  for (const status of ["proposed", "confirmed", "declined"]) {
    console.log(`${STATUS_ICON[status]} ${status.toUpperCase()} (${byStatus[status].length})`);
    for (const r of byStatus[status]) {
      console.log(`   ${r.category}/${r.id} — ${r.title ?? r.id}`);
      if (r.notes) console.log(`      Note: ${r.notes}`);
    }
    console.log("");
  }

  console.log("Confirm:  node scripts/review-rules.js confirm condition/severe-pet --reviewer \"Your Name\"");
  console.log("Decline:  node scripts/review-rules.js decline interaction/<id> --reason \"...\"");
  console.log("");
}

function cmdShow(ref) {
  const { category, id } = parseRef(ref);
  const rule = allRulesFlat().find(r => r.category === category && r.id === id);
  if (!rule) {
    console.error("Rule not found");
    process.exit(1);
  }
  console.log(JSON.stringify(rule, null, 2));
}

function cmdExportMd() {
  const rules = allRulesFlat();
  const lines = [
    "# Clinical Compiler — Rules Review",
    "",
    "Rules must be **confirmed** before the compiler uses them at runtime.",
    "",
    "| Status | Count |",
    "|--------|-------|",
  ];

  for (const status of ["proposed", "confirmed", "declined"]) {
    const n = rules.filter(r => r.status === status).length;
    lines.push(`| ${status} | ${n} |`);
  }

  lines.push("", "## Proposed (awaiting your sign-off)", "");

  for (const r of rules.filter(r => r.status === "proposed")) {
    lines.push(`### ${r.category}/${r.id}`);
    lines.push(`**${r.title ?? r.id}**`);
    if (r.notes) lines.push(`\n_${r.notes}_\n`);
    lines.push("```");
    lines.push(JSON.stringify(r, null, 2).slice(0, 2000));
    lines.push("```");
    lines.push("");
    lines.push("**Your decision:**");
    lines.push("```bash");
    lines.push(`node scripts/review-rules.js confirm ${r.category}/${r.id} --reviewer "KS"`);
    lines.push(`node scripts/review-rules.js decline ${r.category}/${r.id} --reason "..."`);
    lines.push("```");
    lines.push("");
  }

  const outPath = path.join(ROOT, "docs/COMPILER_RULES_REVIEW.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log(`Wrote ${outPath}`);
}

function main() {
  const [,, command, ref, ...rest] = process.argv;

  if (!command || command === "list") {
    cmdList();
    return;
  }

  if (command === "show" && ref) {
    cmdShow(ref);
    return;
  }

  if (command === "export-md") {
    cmdExportMd();
    return;
  }

  if ((command === "confirm" || command === "decline") && ref) {
    const parsed = parseRef(ref);
    const status = command === "confirm" ? RULE_STATUS.CONFIRMED : RULE_STATUS.DECLINED;
    let reviewer = null;
    let reason = null;
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === "--reviewer") reviewer = rest[++i];
      if (rest[i] === "--reason") reason = rest[++i];
    }
    updateRuleStatus(parsed, status, { reviewer, reason });
    return;
  }

  console.log(`Usage:
  node scripts/review-rules.js list
  node scripts/review-rules.js show condition/severe-pet
  node scripts/review-rules.js confirm condition/severe-pet --reviewer "KS"
  node scripts/review-rules.js decline interaction/<id> --reason "..."
  node scripts/review-rules.js export-md`);
}

main();
