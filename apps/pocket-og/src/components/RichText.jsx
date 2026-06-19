// Inline colors by gl / calc id — hex values avoid Tailwind purge issues
const INLINE_COLORS = {
  CG623:                  "#f97316", // orange-500
  GL891:                  "#6366f1", // indigo-500
  GL861:                  "#14b8a6", // teal-500
  MTX_SURVEILLANCE:       "#8b5cf6", // violet-500
  ECTOPIC_DECISION:       "#f43f5e", // rose-500
  EXPECTANT_SURVEILLANCE: "#14b8a6", // teal-500
  VTE_RISK:               "#6366f1", // indigo-500
};

function linkColor(link) {
  if (link.type === "flowchart") return INLINE_COLORS[link.gl] ?? "#6b7280";
  if (link.type === "calculator") return INLINE_COLORS[link.id] ?? "#6b7280";
  return "#6b7280";
}

// Splits `text` by matched phrase, returning [{content, link|null}]
function buildSegments(text, links) {
  const active = links.filter(l => l.phrase && text.includes(l.phrase));
  if (!active.length) return [{ content: text, link: null }];

  const segments = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = null;
    let earliestIdx = Infinity;

    for (const l of active) {
      const idx = remaining.indexOf(l.phrase);
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
    segments.push({ content: earliest.phrase, link: earliest });
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
