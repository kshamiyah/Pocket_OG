// Handover payload: a compact, versioned, checksummed encoding of the open
// job list, carried either as a QR code or a plain shareable link (?ho=...).
// No server involved — the code itself is the entire message.

const VERSION = 1;

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const binary = atob(b64 + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Not cryptographic — just enough to catch a botched scan or a truncated paste.
function checksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum = (sum + str.charCodeAt(i) * (i + 1)) % 1679616;
  return sum.toString(36).padStart(4, "0");
}

export class HandoverPayloadError extends Error {}

export function encodeHandoverPayload(jobs) {
  const compact = {
    v: VERSION,
    j: jobs.map((job) => ({
      w: job.ward || "",
      t: job.text,
      p: job.priority === "urgent" ? "u" : "r",
    })),
  };
  const body = toBase64Url(JSON.stringify(compact));
  return `${body}.${checksum(body)}`;
}

export function decodeHandoverPayload(code) {
  const parts = String(code || "").split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new HandoverPayloadError("That code looks incomplete. Try scanning it again.");
  }
  const [body, sum] = parts;
  if (checksum(body) !== sum) {
    throw new HandoverPayloadError("That code didn't come through cleanly. Try scanning it again.");
  }
  let compact;
  try {
    compact = JSON.parse(fromBase64Url(body));
  } catch {
    throw new HandoverPayloadError("That code didn't come through cleanly. Try scanning it again.");
  }
  if (!compact || compact.v !== VERSION || !Array.isArray(compact.j)) {
    throw new HandoverPayloadError("This code is from a different version of Handover.");
  }
  return compact.j.map((job, i) => ({
    id: `incoming-${Date.now()}-${i}`,
    ward: job.w || "",
    text: job.t || "",
    priority: job.p === "u" ? "urgent" : "routine",
    done: false,
    createdAt: new Date().toISOString(),
  }));
}

export function buildHandoverUrl(jobs) {
  const code = encodeHandoverPayload(jobs);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("ho", code);
  return url.toString();
}

export function extractHandoverCode(url = window.location.href) {
  try {
    return new URL(url).searchParams.get("ho");
  } catch {
    return null;
  }
}
