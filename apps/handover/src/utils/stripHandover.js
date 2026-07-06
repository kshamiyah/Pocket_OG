// Strip likely identifiers from task text before it goes into a shareable QR payload.
// Ward and bed travel separately; this only cleans the free-text task line.

const TITLE_NAME_RE = /\b(?:Mrs?|Ms|Miss|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/gi;
const FOR_PATIENT_RE = /\bfor\s+(?:the\s+)?(?:patient\s+)?(?:Mrs?|Ms|Miss|Dr)?\.?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/gi;
const NHS_RE = /\b\d{3}\s?\d{3}\s?\d{4}\b/g;
const DOB_RE = /\b\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\b/g;
const EMAIL_RE = /\b[\w.+-]+@[\w.-]+\.\w{2,}\b/gi;

function collapse(text) {
  return text.replace(/\s{2,}/g, " ").replace(/^[,;:\s–-]+|[,;:\s–-]+$/g, "").trim();
}

export function stripHandover(text, { bed = "" } = {}) {
  const original = String(text || "").trim();
  if (!original) return "";

  let s = original;

  if (bed) {
    const escaped = bed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    s = s.replace(new RegExp(`^(?:bed\\s*)?#?${escaped}\\s*[:–-]?\\s*`, "i"), "");
  }

  s = s.replace(TITLE_NAME_RE, "");
  s = s.replace(FOR_PATIENT_RE, "");
  s = s.replace(NHS_RE, "");
  s = s.replace(DOB_RE, "");
  s = s.replace(EMAIL_RE, "");
  s = s.replace(/\bfor\s*$/i, "");
  s = collapse(s);

  return s || original;
}
