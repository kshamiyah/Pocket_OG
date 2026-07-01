// Inline link colours follow the source colour of their target (hex values
// avoid Tailwind purge issues). Flowchart/reader links carry a `gl`; calculator
// links carry an `id` mapped to its scenario's source.
import { GUIDELINES } from "@pocket-og/guidelines";
import { SOURCE_HEX, sourceFromLabel } from "../data/glColors";
import { CALCULATOR_SCENARIOS } from "../data/calculator";

const FALLBACK_HEX = "#6b7280"; // gray-500
const CALC_SOURCE = Object.fromEntries(
  CALCULATOR_SCENARIOS.map(s => [s.id, sourceFromLabel(s.source)])
);

function linkColor(link) {
  if (link.type === "calculator") return SOURCE_HEX[CALC_SOURCE[link.id]] ?? FALLBACK_HEX;
  // flowchart + reader links carry a guideline code
  return SOURCE_HEX[GUIDELINES[link.gl]?.source] ?? FALLBACK_HEX;
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
