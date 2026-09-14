import { DIVERGENCES } from "@pocket-og/guidelines";
import { sourceColors } from "../data/glColors";

// "Guidance differs": one clinical decision on which bodies disagree.
//
// Neutrality is a property of this component, not of each entry, so it cannot
// erode as entries are added:
//   - every position gets identical size, type and spacing
//   - positions are sorted newest first HERE, and the footer states the rule,
//     because an unexplained order always reads as a ranking
//   - scope is shown, since most apparent conflicts are scope mismatches
//   - what the bodies agree on is shown, so a narrow difference does not read
//     as wholesale disagreement
//   - status is a fact about the document, never a quality judgement
//   - local trust guidance sits outside the national card, clearly optional
//
// Yellow surface with a solid yellow header band. The band matters: the app's
// alert blocks are bg-amber-50, which in dark mode is #352d23 against this
// card's #343122, so a flat yellow card would be indistinguishable from the
// alerts it sits beneath in NG126 and GTG22. No alert carries a band, so the
// band is what separates them.
//
// Source colour still comes only from glColors, so a rail means "who said it",
// never "how good it is". Every utility used here is remapped under html.dark
// in index.css; a colour outside that set would silently stay light.
//
// Purely presentational: WikiCard renders it without onNavigate, so it must
// never depend on navigation props.

const STATUS = {
  current:    { label: "Current",    cls: "bg-emerald-50 text-emerald-700" },
  archived:   { label: "Archived",   cls: "bg-gray-100 text-gray-500" },
  superseded: { label: "Superseded", cls: "bg-gray-100 text-gray-500" },
};

export default function CompareBlock({ id }) {
  const d = DIVERGENCES[id];
  if (!d) return null;

  // The ordering rule, applied here rather than trusted to the data.
  const positions = [...(d.positions ?? [])].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  const local = d.local ?? [];

  return (
    <div className="mb-4">
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 overflow-hidden">

        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-yellow-200">
          <span className="text-yellow-900 text-xs leading-none">⇄</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-900">
            Guidance differs
          </span>
          <span className="ml-auto text-[10px] font-semibold text-yellow-900 tabular-nums">
            {positions.length} sources
          </span>
        </div>

        <p className="px-3.5 pt-3 text-sm font-bold text-gray-900 leading-snug">{d.question}</p>
        {d.scope && <p className="px-3.5 pt-1 pb-3 text-[11px] text-gray-500 leading-snug">{d.scope}</p>}

        {positions.map((p, i) => {
          const col = sourceColors(p.source);
          const status = STATUS[p.status] ?? STATUS.current;
          return (
            <div key={i} className="flex gap-2.5 px-3.5 py-3 border-t border-yellow-200">
              <div className={`w-[3px] rounded-full shrink-0 ${col.accent}`} />
              <div className="min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-900">{p.body}</span>
                  <span className="text-[11px] text-gray-500 tabular-nums">{p.year}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-[13px] text-gray-700 leading-snug">{p.position}</p>
                {p.citation && <span className="text-[10px] text-gray-500">{p.citation}</span>}
              </div>
            </div>
          );
        })}

        {d.agreed && (
          <div className="border-t border-yellow-200 bg-yellow-100 px-3.5 py-3">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              They agree on
            </span>
            <p className="text-xs text-gray-700 leading-snug">{d.agreed}</p>
          </div>
        )}

        {d.why && (
          <div className="border-t border-yellow-200 px-3.5 py-3">
            <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Why they differ
            </span>
            <p className="text-xs text-gray-700 leading-snug">{d.why}</p>
          </div>
        )}

        <div className="border-t border-yellow-200 px-3.5 py-2.5">
          <p className="text-[10px] text-gray-500 leading-snug">
            <span className="font-semibold">Listed newest first.</span>{" "}
            Pocket O&amp;G does not rank guidance.
            {d.lastReviewed ? ` Last reviewed ${d.lastReviewed}.` : ""}
          </p>
        </div>
      </div>

      {local.length > 0 && (
        <div className="mt-2 rounded-xl border border-dashed border-blue-200 bg-blue-50 px-3.5 py-3">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-700 mb-2">
            Local variation · optional
          </span>
          <div className="flex flex-col gap-2">
            {local.map((l, i) => (
              <div key={i}>
                <p className="text-xs text-gray-700 leading-snug">
                  <span className="font-semibold text-gray-900">{l.body}:</span> {l.position}
                </p>
                {l.citation && <span className="text-[10px] text-gray-500">{l.citation}</span>}
              </div>
            ))}
          </div>
          {d.localNote && <p className="mt-2 text-[11px] text-gray-500 leading-snug">{d.localNote}</p>}
        </div>
      )}
    </div>
  );
}
