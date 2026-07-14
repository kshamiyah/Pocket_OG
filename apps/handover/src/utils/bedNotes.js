// Private bed notes — local only, never encoded into QR / handover links.

const MAX_LEN = 280;

export function bedNoteKey(ward, bed) {
  const w = (ward || "").trim();
  const b = bed == null || bed === "" ? "" : String(bed).trim();
  return `${w}|${b}`;
}

export function getBedNote(notes, ward, bed) {
  if (!notes) return "";
  return notes[bedNoteKey(ward, bed)] || "";
}

export function setBedNote(notes, ward, bed, text) {
  const key = bedNoteKey(ward, bed);
  const next = { ...(notes || {}) };
  const trimmed = String(text || "").trim().slice(0, MAX_LEN);
  if (!trimmed) {
    delete next[key];
  } else {
    next[key] = trimmed;
  }
  return next;
}

export function hasBedNote(notes, ward, bed) {
  return Boolean(getBedNote(notes, ward, bed));
}

export function notesForWard(notes, ward) {
  const prefix = `${(ward || "").trim()}|`;
  const out = new Set();
  if (!notes) return out;
  for (const key of Object.keys(notes)) {
    if (key.startsWith(prefix) && notes[key]) {
      const bed = key.slice(prefix.length);
      out.add(bed === "" ? null : bed);
    }
  }
  return out;
}

export { MAX_LEN as BED_NOTE_MAX };
