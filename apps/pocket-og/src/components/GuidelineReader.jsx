import { useRef, useState } from "react";
import { GUIDELINES, GL861_SECTIONS } from "@pocket-og/guidelines";
import { FLOWCHARTS } from "../data/flowcharts";
import ContentBlock from "./ContentBlock";
import SeeAlso from "./SeeAlso";

const SECTIONS_MAP = {
  GL861: GL861_SECTIONS,
};

const GL_THEME = {
  GL861: { badge: "bg-teal-50 text-teal-700", conditionColor: "text-teal-500" },
};

const DEFAULT_THEME = { badge: "bg-gray-100 text-gray-600", conditionColor: "text-gray-400" };

export default function GuidelineReader({ gl, onClose, onNavigate }) {
  const sections = SECTIONS_MAP[gl] ?? [];
  const guideline = GUIDELINES[gl];
  const theme = GL_THEME[gl] ?? DEFAULT_THEME;
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [showContents, setShowContents] = useState(false);

  const jumpTo = (id) => {
    setShowContents(false);
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">

      {/* Main header */}
      <div className="shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>{gl}</span>
            <p className="text-sm font-bold text-gray-900 mt-0.5 leading-snug">{guideline?.label}</p>
          </div>
          <button
            onClick={() => setShowContents(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-32">

          {sections.map((section) => (
            <div key={section.id} ref={el => { sectionRefs.current[section.id] = el; }}>

              {/* Sticky section header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm px-4 py-2.5">
                <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${theme.conditionColor}`}>
                  {section.condition}
                </p>
                <h2 className="text-sm font-bold text-gray-900 leading-snug">
                  {section.title.replace(/^IOL — |^Term PLRoM — /, "")}
                </h2>
              </div>

              {/* Section content */}
              <div className="px-4 pt-5 pb-10">
                {section.content.map((block, j) => (
                  <ContentBlock key={j} block={block} />
                ))}

                {section.flowchartId && FLOWCHARTS[section.flowchartId] && onNavigate && (
                  <div className="mt-4">
                    <SeeAlso
                      label="Related flowchart"
                      links={[{
                        type: "flowchart",
                        id: section.flowchartId,
                        gl,
                        label: FLOWCHARTS[section.flowchartId].title,
                        sublabel: `${gl} — step through the pathway`,
                      }]}
                      onNavigate={onNavigate}
                    />
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Footer */}
          <div className="mx-4 pt-6 pb-6 border-t border-gray-100 text-center space-y-3">
            {guideline?.pdf && (
              <a
                href={guideline.pdfPath || `/guidelines/${gl}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium text-gray-600"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View source PDF
              </a>
            )}
            <p className="text-xs text-gray-300">{gl} {guideline?.version} · {guideline?.date}</p>
          </div>

        </div>
      </div>

      {/* Contents sheet */}
      {showContents && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setShowContents(false)}
          />
          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto">
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <p className="text-base font-bold text-gray-900">Contents</p>
              <button
                onClick={() => setShowContents(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] pb-8">
              {sections.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => jumpTo(section.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                    i > 0 ? "border-t border-gray-50" : ""
                  }`}
                >
                  <span className={`text-xs font-bold w-5 shrink-0 ${theme.conditionColor}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-semibold uppercase tracking-wide ${theme.conditionColor}`}>{section.condition}</p>
                    <p className="text-sm font-medium text-gray-900 leading-snug mt-0.5">
                      {section.title.replace(/^IOL — |^Term PLRoM — /, "")}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
