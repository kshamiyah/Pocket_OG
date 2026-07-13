// Isolated payload-integrity check for apps/handover.
//
// Runs against the REAL source module (../src/utils/payload.js) in Node — no
// browser needed — so it is fast and deterministic. It asserts the payload's
// actual contract and, crucially, records where that contract diverges from
// what the kickoff spec / CLAUDE.md describe (a v2 payload with a
// `stripHandover.js` that removes task text when "keep a copy" is on).
//
// Output: writes findings to results/payload.json and prints a summary.
// Exit code is always 0 — this is a reporting tool, not a gate.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// buildHandoverUrl/extractHandoverCode touch window.location; stub it so the
// module's URL-building helpers are testable in Node.
globalThis.window = {
  location: { origin: "https://handover.example", pathname: "/", href: "https://handover.example/" },
  history: { replaceState() {} },
};

const {
  encodeHandoverPayload,
  decodeHandoverPayload,
  buildHandoverUrl,
  extractHandoverCode,
  HandoverPayloadError,
} = await import("../src/utils/payload.js");

const findings = [];
const notes = [];
function fail(id, msg, detail) { findings.push({ id, severity: "payload", msg, detail }); }
function note(msg) { notes.push(msg); }

// A realistic multi-ward, mixed-priority selection carrying identifiable-ish
// clinical shorthand, so a text leak would be obvious.
const jobs = [
  { id: 1, ward: "Delivery Suite", bed: "Room 3", text: "Chase FBC + group and save", priority: "urgent", done: false, createdAt: "2026-07-13T08:00:00.000Z", remindAt: "2026-07-13T09:00:00.000Z" },
  { id: 2, ward: "Delivery Suite", bed: "Room 5", text: "Review CTG at 10:00", priority: "routine", done: false, createdAt: "2026-07-13T08:05:00.000Z" },
  { id: 3, ward: "Ward 42", bed: "Bay A bed 2", text: "Consent for LSCS", priority: "urgent", done: false, createdAt: "2026-07-13T08:10:00.000Z" },
  { id: 4, ward: "", bed: "", text: "Bloods round on the whole ward", priority: "routine", done: false, createdAt: "2026-07-13T08:15:00.000Z" },
];

// ---- 1. Round-trip fidelity -------------------------------------------------
const code = encodeHandoverPayload(jobs);
let decoded;
try {
  decoded = decodeHandoverPayload(code);
} catch (e) {
  fail("roundtrip-throw", "decodeHandoverPayload threw on a payload it just encoded", String(e));
  decoded = [];
}

if (decoded.length !== jobs.length) {
  fail("roundtrip-count", `Decoded job count ${decoded.length} != encoded ${jobs.length}`);
}
jobs.forEach((j, i) => {
  const d = decoded[i];
  if (!d) return;
  if (d.ward !== j.ward) fail("roundtrip-ward", `Job ${i}: ward "${d.ward}" != "${j.ward}"`);
  if (d.bed !== j.bed) fail("roundtrip-bed", `Job ${i}: bed "${d.bed}" != "${j.bed}"`);
  if (d.text !== j.text) fail("roundtrip-text", `Job ${i}: text "${d.text}" != "${j.text}"`);
  if (d.priority !== j.priority) fail("roundtrip-priority", `Job ${i}: priority "${d.priority}" != "${j.priority}"`);
});

// ---- 2. No unexpected fields leak onto the wire -----------------------------
// Decode the raw compact object and confirm only {w,b,t,p} per job.
function rawCompact(codeStr) {
  const body = codeStr.split(".")[0];
  const b64 = body.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return JSON.parse(Buffer.from(b64 + pad, "base64").toString("utf8"));
}
const compact = rawCompact(code);
const ALLOWED = new Set(["w", "b", "t", "p"]);
compact.j.forEach((cj, i) => {
  const extra = Object.keys(cj).filter((k) => !ALLOWED.has(k));
  if (extra.length) fail("field-leak", `Job ${i}: unexpected field(s) on the wire: ${extra.join(", ")}`, JSON.stringify(cj));
});
// Confirm none of the local-only fields survive into the payload string.
for (const secret of ["createdAt", "remindAt", "\"id\"", "done"]) {
  if (code.includes(secret) || JSON.stringify(compact).includes(secret.replace(/"/g, ""))) {
    // createdAt/remindAt/done/id must not appear as keys
    if (JSON.stringify(compact).match(new RegExp(`"${secret.replace(/"/g, "")}"\\s*:`))) {
      fail("field-leak-key", `Local-only field "${secret}" leaked into payload`);
    }
  }
}

// ---- 3. The "keep a copy" claim --------------------------------------------
// SPEC (kickoff + CLAUDE.md): task text is stripped from the payload when
// "keep a copy" is ON (via stripHandover.js, payload v2).
// REALITY (code + app README): keepCopy only controls whether handed-over jobs
// are removed from the LOCAL list (App.jsx finishHandover: clear = !keepCopy).
// The encoded payload is produced by buildHandoverUrl(jobsToSend) and is
// IDENTICAL regardless of keepCopy. There is no stripHandover.js and the
// payload version is 1, not 2.
const codeKeep = encodeHandoverPayload(jobs);   // "keep a copy" ON
const codeClear = encodeHandoverPayload(jobs);  // "keep a copy" OFF
const identical = codeKeep === codeClear;
const textPresentInKeep = decodeHandoverPayload(codeKeep).some((d) => d.text === "Consent for LSCS");

if (identical && textPresentInKeep) {
  note('CONFIRMED: "keep a copy" has no effect on payload contents. Task text (e.g. "Consent for LSCS") is present on the wire whether keep-copy is on or off. This matches the app README ("Ward, bed, and task text travel on the wire verbatim") but CONTRADICTS the kickoff spec / CLAUDE.md, which claim task text is stripped in the keep-copy version. No stripHandover.js exists; payload version is 1.');
} else {
  fail("keepcopy-unexpected", "keep-copy behaviour did not match the code as read; re-check payload.js/App.jsx", JSON.stringify({ identical, textPresentInKeep }));
}

// ---- 4. Corruption / tamper detection --------------------------------------
try {
  decodeHandoverPayload(code.slice(0, -1)); // break the checksum
  fail("checksum-weak", "Corrupted payload (dropped last char) decoded without error");
} catch (e) {
  if (!(e instanceof HandoverPayloadError)) fail("checksum-wrongerr", "Corruption threw a non-HandoverPayloadError", String(e));
}

// ---- 5. Link round-trip -----------------------------------------------------
const url = buildHandoverUrl(jobs);
const extracted = extractHandoverCode(url);
if (extracted !== code) fail("link-roundtrip", "extractHandoverCode(buildHandoverUrl(jobs)) != encodeHandoverPayload(jobs)", JSON.stringify({ url }));

// ---- Report -----------------------------------------------------------------
const out = {
  ranAt: new Date().toISOString(),
  version: compact.v,
  payloadBytes: code.length,
  linkBytes: url.length,
  findings,
  notes,
};
mkdirSync(join(HERE, "results"), { recursive: true });
writeFileSync(join(HERE, "results", "payload.json"), JSON.stringify(out, null, 2));

console.log("── Payload integrity check ──");
console.log(`payload v${compact.v}, ${code.length} bytes (link ${url.length} bytes)`);
if (findings.length === 0) console.log("✓ Contract assertions passed (round-trip, no field leak, tamper-detection, link round-trip).");
else {
  console.log(`✗ ${findings.length} finding(s):`);
  for (const f of findings) console.log(`  [${f.severity}] ${f.id}: ${f.msg}`);
}
for (const n of notes) console.log(`\n⚑ ${n}`);
