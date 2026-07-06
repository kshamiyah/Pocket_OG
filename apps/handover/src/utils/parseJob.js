// Quick-mode shorthand: ward/bed/task in one line.

const WARD_BED_TASK_RE = /^([A-Za-z][A-Za-z0-9\s]{0,18}?)\s*[/]\s*(\S+)\s+(.+)$/;
const WARD_SEP_RE = /^([A-Za-z][A-Za-z0-9\s]{0,18}?)\s*[:–-]\s+(.+)$/;
const WARD_AT_RE = /^@(\S+)\s+(.+)$/;
const BED_TASK_RE = /^#?(\d{1,2}[A-Za-z]?)\s+(.+)$/;
const BED_ONLY_PREFIX_RE = /^bed\s*#?(\S+)\s*[:–-]?\s*(.+)$/i;

export function parseJobInput(raw, { stickyWard = "", stickyBed = "" } = {}) {
  const text = raw.trim();
  if (!text) return null;

  const wardBed = text.match(WARD_BED_TASK_RE);
  if (wardBed) {
    return { ward: wardBed[1].trim(), bed: wardBed[2].trim(), text: wardBed[3].trim() };
  }

  const at = text.match(WARD_AT_RE);
  if (at) {
    const rest = at[2].trim();
    const bedMatch = rest.match(BED_TASK_RE);
    if (bedMatch) {
      return { ward: at[1].trim(), bed: bedMatch[1].trim(), text: bedMatch[2].trim() };
    }
    return { ward: at[1].trim(), bed: stickyBed, text: rest };
  }

  const bedExplicit = text.match(BED_ONLY_PREFIX_RE);
  if (bedExplicit) {
    return {
      ward: stickyWard,
      bed: bedExplicit[1].trim(),
      text: bedExplicit[2].trim(),
    };
  }

  const bedTask = text.match(BED_TASK_RE);
  if (bedTask) {
    return {
      ward: stickyWard,
      bed: bedTask[1].trim(),
      text: bedTask[2].trim(),
    };
  }

  const sep = text.match(WARD_SEP_RE);
  if (sep) {
    return { ward: sep[1].trim(), bed: stickyBed, text: sep[2].trim() };
  }

  return { ward: stickyWard, bed: stickyBed, text };
}
