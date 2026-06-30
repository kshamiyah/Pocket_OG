// Inline colors by gl / calc id — hex values avoid Tailwind purge issues
const INLINE_COLORS = {
  // flowchart links
  CG623:                  "#f97316", // orange-500
  GL891:                  "#6366f1", // indigo-500
  GL861:                  "#14b8a6", // teal-500
  // calculator links
  MTX_SURVEILLANCE:       "#8b5cf6", // violet-500
  ECTOPIC_DECISION:       "#f43f5e", // rose-500
  EXPECTANT_SURVEILLANCE: "#14b8a6", // teal-500
  VTE_RISK:               "#6366f1", // indigo-500
  // reader (guideline) link targets
  GL952:  "#3b82f6", // blue-500
  GL983:  "#ec4899", // pink-500
  GL880:  "#ca8a04", // yellow-600
  GL787:  "#10b981", // emerald-500
  GL895:  "#0ea5e9", // sky-500
  GL783:  "#f59e0b", // amber-500
  GTG52:  "#ef4444", // red-500
  GTG69:  "#f97316", // orange-500
  NG25:   "#0ea5e9", // sky-500
  GTG31:  "#22c55e", // green-500
  GTG17:  "#8b5cf6", // violet-500
  CG192:  "#a855f7", // purple-500
  CG565:  "#8b5cf6", // violet-500
  NG133:  "#06b6d4", // cyan-500
};

function linkColor(link) {
  if (link.type === "flowchart") return INLINE_COLORS[link.gl] ?? "#6b7280";
  if (link.type === "calculator") return INLINE_COLORS[link.id] ?? "#6b7280";
  if (link.type === "reader") return INLINE_COLORS[link.gl] ?? "#6b7280";
  return "#6b7280";
}

// Case-insensitive phrase matching; preserves original casing in output
function buildSegments(text, links) {
  const lowerText = text.toLowerCase();
  const active = links.filter(l => l.phrase && lowerText.includes(l.phrase.toLowerCase()));
  if (!active.length) return [{ content: text, link: null }];

  const segments = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = null;
    let earliestIdx = Infinity;
    const lowerRemaining = remaining.toLowerCase();

    for (const l of active) {
      const idx = lowerRemaining.indexOf(l.phrase.toLowerCase());
      if (idx !== -1 && idx < earliestIdx) {
        earliest = l;
        earliestIdx = idx;
      }
    }

    if (!earliest) {
      segments.push({ content: remaining, link: null });
      break;
    }
    if (earliestIdx > 0) segments.push({ content: remaining.slice(0, earliestIdx), link: null });
    segments.push({ content: remaining.slice(earliestIdx, earliestIdx + earliest.phrase.length), link: earliest });
    remaining = remaining.slice(earliestIdx + earliest.phrase.length);
  }

  return segments;
}

export default function RichText({ text, links = [], onNavigate }) {
  if (!text) return null;
  if (!links.length || !onNavigate) return <>{text}</>;

  const segments = buildSegments(text, links);
  const hasLink = segments.some(s => s.link);
  if (!hasLink) return <>{text}</>;

  return (
    <>
      {segments.map((seg, i) =>
        seg.link ? (
          <button
            key={i}
            onClick={() => onNavigate(seg.link)}
            className="inline font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: linkColor(seg.link) }}
          >
            {seg.content}
          </button>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </>
  );
}
