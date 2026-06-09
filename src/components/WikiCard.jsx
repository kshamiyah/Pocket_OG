import { GUIDELINES } from "../data/guidelines";
import ContentBlock, { highlightText } from "./ContentBlock";
import { openUrl } from "../utils/openUrl";

const ACCENT = {
  GL952: "bg-blue-500",
  GL787: "bg-emerald-500",
  CG565: "bg-violet-500",
  CG621: "bg-rose-500",
  CG623: "bg-orange-500",
  GL895: "bg-sky-500",
  GL861: "bg-teal-500",
  GL783: "bg-amber-500",
  GL880: "bg-yellow-500",
  GL891: "bg-indigo-500",
  GL983: "bg-pink-500",
};

const CONDITION_COLOR = {
  GL952: "text-blue-500",
  GL787: "text-emerald-500",
  CG565: "text-violet-500",
  CG621: "text-rose-500",
  CG623: "text-orange-500",
  GL895: "text-sky-500",
  GL861: "text-teal-500",
  GL783: "text-amber-500",
  GL880: "text-yellow-500",
  GL891: "text-indigo-500",
  GL983: "text-pink-500",
};

export default function WikiCard({ page, isExpanded, onToggle, isFallback, query = "", onOpenFlowchart }) {
  const gl = GUIDELINES[page.gl];
  const highlightTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return (
    <div className={`rounded-3xl overflow-hidden bg-white flex transition-shadow ${
      isFallback ? "opacity-70 shadow-sm" : "shadow-sm hover:shadow-md"
    }`}>
      {/* Colored left accent bar */}
      <div className={`w-1 shrink-0 ${ACCENT[page.gl] ?? "bg-gray-300"}`} />

      {/* Card body */}
      <div className="flex-1 min-w-0">
        {/* Tap target */}
        <button
          onClick={onToggle}
          className="w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1 ${CONDITION_COLOR[page.gl] ?? "text-gray-400"}`}>
              {page.condition}
            </p>
            <h3 className="text-gray-900 font-semibold text-base leading-snug">
              {highlightText(page.title, highlightTerms)}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">{page.setting}</span>
              {gl && <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">{gl.version} · {gl.date}</span>}
              {isFallback && (
                <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">closest match</span>
              )}
              {page.flowchartId && (
                <span className="px-2 py-0.5 rounded-full text-xs text-teal-600 bg-teal-50 border border-teal-100">
                  ⬡ flowchart
                </span>
              )}
            </div>
          </div>
          {/* Chevron — rotates on expand */}
          <svg
            className={`w-4 h-4 text-gray-300 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* PDF source link */}
        {gl?.pdf && (
          <button
            onClick={() => openUrl(`/guidelines/${gl.code}.pdf`)}
            className="flex items-center gap-1.5 px-5 py-2 border-t border-gray-50 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View source PDF
          </button>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            {page.flowchartId && onOpenFlowchart && (
              <button
                onClick={() => onOpenFlowchart(page.flowchartId)}
                className="w-full mb-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-teal-50 border border-teal-100 hover:bg-teal-100 active:bg-teal-200 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-teal-600 text-base">⬡</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-teal-700">Interactive flowchart</p>
                    <p className="text-xs text-teal-500">Step through the clinical pathway</p>
                  </div>
                </div>
                <span className="text-teal-400 group-hover:text-teal-600 transition-colors">→</span>
              </button>
            )}
            {page.content.map((block, i) => (
              <ContentBlock key={i} block={block} highlightTerms={highlightTerms} />
            ))}
            <div className="mt-5 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{gl.code} {gl.version} · {gl.label} · RBH · {gl.date}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
