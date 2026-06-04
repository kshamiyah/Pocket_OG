import { GUIDELINES, GL_COLORS } from "../data/guidelines";
import ContentBlock from "./ContentBlock";

export default function WikiCard({ page, isExpanded, onToggle, isFallback }) {
  const gl = GUIDELINES[page.gl];
  const colors = GL_COLORS[page.gl];
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isFallback ? "bg-slate-800/30 border-slate-700/30 opacity-80" : "bg-slate-800/50 border-slate-700/50"}`}>
      <button onClick={onToggle} className="w-full text-left p-4 hover:bg-slate-700/30 transition-colors flex gap-3 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${colors.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>{gl.code}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs border bg-slate-700/50 text-slate-400 border-slate-600/40">{page.setting}</span>
            {isFallback && <span className="px-2 py-0.5 rounded-md text-xs border bg-slate-700/30 text-slate-500 border-slate-700/30">closest match</span>}
          </div>
          <h3 className="text-white font-semibold text-base leading-snug">{page.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{page.condition}</p>
        </div>
        <span className="text-slate-500 text-xl shrink-0 mt-0.5 font-light">{isExpanded ? "−" : "+"}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-5 border-t border-slate-700/40 pt-4">
          {page.content.map((block, i) => <ContentBlock key={i} block={block} />)}
          <div className="mt-4 pt-3 border-t border-slate-700/40">
            <p className="text-xs text-slate-500">{gl.code} {gl.version} · {gl.label} · RBH · {gl.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
