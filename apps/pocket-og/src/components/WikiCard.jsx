import { GUIDELINES } from "@pocket-og/guidelines";
import ContentBlock, { highlightText } from "./ContentBlock";
import { glColors } from "../data/glColors";

export default function WikiCard({ page, isExpanded, onToggle, isFallback, query = "", onOpenFlowchart }) {
  const gl = GUIDELINES[page.gl];
  const highlightTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const col = glColors(page.gl);

  return (
    <div className={`rounded-3xl overflow-hidden bg-white flex transition-shadow ${
      isFallback ? "opacity-70 shadow-sm" : "shadow-sm hover:shadow-md"
    }`}>
      {/* Colored left accent bar */}
      <div className={`w-1 shrink-0 ${col.accent}`} />

      {/* Card body */}
      <div className="flex-1 min-w-0">
        {/* Tap target */}
        <button
          onClick={onToggle}
          className="w-full text-left px-3 sm:px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1 ${col.conditionColor}`}>
              {page.condition}
            </p>
            <h3 className="text-gray-900 font-semibold text-base leading-snug">
              {highlightText(page.title, highlightTerms)}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">{page.setting}</span>
              {gl && <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">{gl.version} · {gl.date}</span>}
              {isFallback && (
                <span className="px-2 py-0.5 rounded-full text-xs text-amber-600 bg-amber-50 border border-amber-100">closest match</span>
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
          <a
            href={gl.pdfUrl || gl.pdfPath || `/guidelines/${gl.code}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 border-t border-gray-50 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View source PDF
          </a>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-3 sm:px-5 pb-5 border-t border-gray-100 pt-4 overflow-x-hidden">
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
              <p className="text-xs text-gray-400">{gl.code} {gl.version} · {gl.label} · {gl.source} · {gl.date}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
