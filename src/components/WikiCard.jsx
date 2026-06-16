import { GUIDELINES } from "../data/guidelines";
import ContentBlock, { highlightText } from "./ContentBlock";

const PILL = {
  GL952: "bg-blue-50 text-blue-700 border-blue-100",
  GL787: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CG565: "bg-violet-50 text-violet-700 border-violet-100",
  CG621: "bg-rose-50 text-rose-700 border-rose-100",
  CG623: "bg-orange-50 text-orange-700 border-orange-100",
  GL895: "bg-sky-50 text-sky-700 border-sky-100",
  GL783: "bg-amber-50 text-amber-700 border-amber-100",
  GL880: "bg-yellow-50 text-yellow-700 border-yellow-100",
  GL891: "bg-indigo-50 text-indigo-700 border-indigo-100",
  GL983: "bg-pink-50 text-pink-700 border-pink-100",
  GL861: "bg-teal-50 text-teal-700 border-teal-100",
};

export default function WikiCard({ page, isExpanded, onToggle, isFallback, query = "" }) {
  const gl = GUIDELINES[page.gl];
  const highlightTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${isFallback ? "border-gray-100 opacity-70" : "border-gray-200 shadow-sm hover:shadow-md"}`}>
      <button onClick={onToggle} className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex gap-3 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PILL[page.gl]}`}>
              {gl.code}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">{page.setting}</span>
            {isFallback && <span className="px-2 py-0.5 rounded-full text-xs text-gray-400 bg-gray-100">closest match</span>}
          </div>
          <h3 className="text-gray-900 font-semibold text-base leading-snug">{highlightText(page.title, highlightTerms)}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{page.condition}</p>
        </div>
        <span className="text-gray-300 text-2xl shrink-0 mt-0.5 font-light leading-none">{isExpanded ? "−" : "+"}</span>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          {page.content.map((block, i) => <ContentBlock key={i} block={block} highlightTerms={highlightTerms} />)}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{gl.code} {gl.version} · {gl.label} · RBH · {gl.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
