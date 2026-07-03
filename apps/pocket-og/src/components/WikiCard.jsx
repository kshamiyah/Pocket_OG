import { GUIDELINES } from "@pocket-og/guidelines";
import ContentBlock from "./ContentBlock";
import { highlightText } from "../utils/highlight";
import { glColors, sourceColors } from "../data/glColors";
import { READER_AVAILABLE } from "../data/readerAvailable";

const KIND_CTA = {
  calculator: { label: "Open calculator", sub: "Decision-support tool" },
  drug: { label: "Open in Rx", sub: "Doses & prescribing" },
  consent: { label: "Open consent", sub: "Risks & patient information" },
};

export default function WikiCard({ page, isExpanded, onToggle, isFallback, query = "", onOpenFlowchart, onOpenGuideline, onNavigate, grouped = false }) {
  const gl = GUIDELINES[page.gl];
  const highlightTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  // Cards may carry an explicit `source` (e.g. TOG review cards, which aren't in
  // the guideline registry); fall back to resolving colour from the gl code.
  const col = page.source ? sourceColors(page.source) : glColors(page.gl);
  const relatedGl = (page.relatedGl ?? []).map(code => GUIDELINES[code]).filter(Boolean);

  const metaParts = [
    page.setting,
    gl?.code,
    gl ? `${gl.version} · ${gl.date}` : null,
    page.tog?.year ? `TOG ${page.tog.year}` : null,
    page.flowchartId ? "⬡ flowchart" : null,
    isFallback ? "closest match" : null,
  ].filter(Boolean);

  return (
    <div className={`overflow-hidden bg-white flex transition-colors ${
      grouped ? "" : "rounded-2xl border border-gray-100 shadow-sm"
    } ${isFallback ? "opacity-70" : ""}`}>
      {/* Colored left accent bar */}
      <div className={`w-1 h-10 rounded-full shrink-0 self-center ml-4 ${col.accent}`} />

      {/* Card body */}
      <div className="flex-1 min-w-0">
        {/* Tap target */}
        <button
          onClick={onToggle}
          className="w-full text-left px-3 pr-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${col.conditionColor}`}>
              {page.condition}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">
              {highlightText(page.title, highlightTerms)}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">
              {metaParts.map((part, i) => (
                <span key={part}>
                  {i > 0 && <span className="text-gray-300"> · </span>}
                  <span className={part === "closest match" ? "text-amber-600" : part === "⬡ flowchart" ? "text-teal-600" : undefined}>
                    {part}
                  </span>
                </span>
              ))}
            </p>
          </div>
          {/* Chevron — rotates on expand */}
          <svg
            className={`w-4 h-4 text-gray-300 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 overflow-x-hidden">
            {page.draft && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                <span className="text-amber-500 text-sm leading-none mt-0.5">⚠</span>
                <p className="text-xs text-amber-700 leading-snug">
                  AI-summarised draft — pending clinical sign-off. Verify against the source article and local protocol.
                </p>
              </div>
            )}
            {page.content.map((block, i) => (
              <ContentBlock key={i} block={block} highlightTerms={highlightTerms} />
            ))}
            {gl && (
              <div className="mt-5 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{gl.code} {gl.version} · {gl.label} · {gl.source} · {gl.date}</p>
              </div>
            )}
            {page.tog && (
              <div className="mt-5 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  <span className={`font-semibold ${col.text}`}>TOG</span>
                  {" · "}The Obstetrician &amp; Gynaecologist
                  {page.tog.citation ? ` · ${page.tog.citation}` : ""}
                  {page.tog.authors ? ` · ${page.tog.authors}` : ""}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              {page.kind && onNavigate && KIND_CTA[page.kind] && (
                <button
                  type="button"
                  onClick={() => onNavigate({ type: page.kind, id: page.navId })}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 active:bg-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{KIND_CTA[page.kind].label}</p>
                      <p className="text-xs text-gray-500">{KIND_CTA[page.kind].sub}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </button>
              )}
              {page.tog?.url && (
                <a
                  href={page.tog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl ${col.bg} border ${col.border} hover:brightness-95 active:brightness-90 transition-all group`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg className={`w-4 h-4 shrink-0 ${col.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${col.text}`}>Read full article</p>
                      <p className="text-xs text-gray-500">Opens the TOG article (RCOG members)</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </a>
              )}
              {relatedGl.length > 0 && onOpenGuideline && (
                <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Related in Pocket O&amp;G</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedGl.map(rgl => {
                      const rcol = glColors(rgl.code);
                      const canRead = READER_AVAILABLE.has(rgl.code);
                      const label = `${rgl.code} · ${rgl.label}`;
                      return canRead ? (
                        <button
                          key={rgl.code}
                          type="button"
                          onClick={() => onOpenGuideline(rgl.code, page.id)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${rcol.badge} border ${rcol.border} hover:brightness-95 active:brightness-90 transition-all`}
                        >
                          {label} →
                        </button>
                      ) : rgl.pdf ? (
                        <a
                          key={rgl.code}
                          href={rgl.pdfUrl || rgl.pdfPath || `/guidelines/${rgl.code}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${rcol.badge} border ${rcol.border} hover:brightness-95 active:brightness-90 transition-all`}
                        >
                          {label} →
                        </a>
                      ) : (
                        <span key={rgl.code} className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${rcol.badge} border ${rcol.border}`}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {READER_AVAILABLE.has(page.gl) && onOpenGuideline && (
                <button
                  type="button"
                  onClick={() => onOpenGuideline(page.gl, page.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 active:bg-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Open guideline</p>
                      <p className="text-xs text-gray-500">{page.gl} · {gl?.label ?? "Full guideline text"}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </button>
              )}
              {gl?.pdf && (
                <a
                  href={gl.pdfUrl || gl.pdfPath || `/guidelines/${gl.code}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 active:bg-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">View source PDF</p>
                      <p className="text-xs text-gray-500">{page.gl} · Original document</p>
                    </div>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                </a>
              )}
              {page.flowchartId && onOpenFlowchart && (
                <button
                  type="button"
                  onClick={() => onOpenFlowchart(page.flowchartId)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-teal-50 border border-teal-100 hover:bg-teal-100 active:bg-teal-200 transition-colors group"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
