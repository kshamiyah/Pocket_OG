// Handover payload: a compact, versioned, checksummed encoding of open jobs
// and optional ward bed layouts, carried as a QR code or shareable link (?ho=...).
// No server involved — the code itself is the entire message.

import { Capacitor } from "@capacitor/core";
import { compactLayoutForWire, expandLayoutFromWire } from "./layoutWire.js";

const VERSION_V1 = 1;
const VERSION_V2 = 2;
/** Public PWA origin for handover links from the native app (Capacitor uses capacitor:// locally). */
export const HANDOVER_LINK_ORIGIN = "https://pocket-handover.vercel.app";

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

function compactJob(job) {
  return {
    w: job.ward || "",
    b: job.bed || "",
    t: job.text,
    p: job.priority === "urgent" ? "u" : "r",
  };
}

function expandJob(job, i) {
  return {
    id: `incoming-${Date.now()}-${i}`,
    ward: job.w || "",
    bed: job.b || "",
    text: job.t || "",
    priority: job.p === "u" ? "urgent" : "routine",
    done: false,
    createdAt: new Date().toISOString(),
  };
}

function compactLayouts(layouts) {
  const w = {};
  for (const [ward, layout] of Object.entries(layouts || {})) {
    const compact = compactLayoutForWire(layout);
    if (compact) w[ward] = compact;
  }
  return w;
}

function expandLayouts(wireMap) {
  const layouts = {};
  for (const [ward, layout] of Object.entries(wireMap || {})) {
    layouts[ward] = expandLayoutFromWire(layout);
  }
  return layouts;
}

/**
 * @param {Array|{ jobs: Array, layouts?: Record<string, object> }} jobsOrPayload
 * @returns {string}
 */
export function encodeHandoverPayload(jobsOrPayload, layoutsArg) {
  const jobs = Array.isArray(jobsOrPayload) ? jobsOrPayload : (jobsOrPayload?.jobs || []);
  const layouts = Array.isArray(jobsOrPayload)
    ? (layoutsArg || {})
    : (jobsOrPayload?.layouts || {});

  const wireLayouts = compactLayouts(layouts);
  const hasLayouts = Object.keys(wireLayouts).length > 0;
  const version = hasLayouts ? VERSION_V2 : VERSION_V1;

  const compact = {
    v: version,
    j: jobs.map(compactJob),
  };
  if (hasLayouts) compact.w = wireLayouts;

  const body = toBase64Url(JSON.stringify(compact));
  return `${body}.${checksum(body)}`;
}

/**
 * @returns {{ version: number, jobs: Array, layouts: Record<string, object> }}
 */
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
  if (!compact || !Array.isArray(compact.j)) {
    throw new HandoverPayloadError("This code is from a different version of Handover.");
  }
  if (compact.v !== VERSION_V1 && compact.v !== VERSION_V2) {
    throw new HandoverPayloadError("This code is from a different version of Handover.");
  }

  return {
    version: compact.v,
    jobs: compact.j.map(expandJob),
    layouts: compact.v === VERSION_V2 ? expandLayouts(compact.w) : {},
  };
}

export function buildHandoverUrl(jobs, layouts = {}) {
  const code = encodeHandoverPayload({ jobs, layouts });
  const url = Capacitor.isNativePlatform()
    ? new URL("/", HANDOVER_LINK_ORIGIN)
    : new URL(window.location.origin + window.location.pathname);
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

export function parseIncomingHandover(url) {
  const code = extractHandoverCode(url);
  if (!code) return null;
  try {
    return decodeHandoverPayload(code);
  } catch {
    return null;
  }
}
