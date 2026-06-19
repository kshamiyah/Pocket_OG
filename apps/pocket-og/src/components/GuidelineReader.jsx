import { useRef, useState, useEffect } from "react";
import { GUIDELINES, GL861_SECTIONS } from "@pocket-og/guidelines";
import { FLOWCHARTS } from "../data/flowcharts";
import ContentBlock from "./ContentBlock";
import SeeAlso from "./SeeAlso";

const SECTIONS_MAP = {
  GL861: GL861_SECTIONS,
};

const GL_THEME = {
  GL861: { activePill: "bg-teal-600 text-white", badge: "bg-teal-50 text-teal-700" },
};

export default function GuidelineReader({ gl, onClose, onNavigate }) {
  const sections = SECTIONS_MAP[gl] ?? [];
  const guideline = GUIDELINES[gl];
  const theme = GL_THEME[gl] ?? { activePill: "bg-gray-800 text-white", badge: "bg-gray-100 text-gray-600" };

  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const tocRef = useRef(null);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);

  // Scroll spy — update active TOC pill as user scrolls
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      let found = sections[0]?.id;
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (el && el.getBoundingClientRect().top <= 140) found = s.id;
      }
      setActiveId(found);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [sections]);

  // Keep active TOC pill centred in the pill row
  useEffect(() => {
    if (!activeId || !tocRef.current) return;
    const pill = tocRef.current.querySelector(`[data-id="${activeId}"]`);
    if (pill) pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  const jumpTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">

      {/* Sticky header */}
      <div className="shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-3 flex items-center gap-3">
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
        </div>

        {/* TOC pill row */}
        <div ref={tocRef} className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {sections.map(s => (
            <button
              key={s.id}
              data-id={s.id}
              onClick={() => jumpTo(s.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeId === s.id ? theme.activePill : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s.setting}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-32">
          {sections.map((section, i) => (
            <div
              key={section.id}
              ref={el => { sectionRefs.current[section.id] = el; }}
              style={{ scrollMarginTop: "130px" }}
              className={i > 0 ? "mt-10 pt-8 border-t border-gray-100" : ""}
            >
              {/* Section heading */}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {section.condition} · {section.setting}
                </p>
                <h2 className="text-xl font-bold text-gray-900 leading-snug">{section.title}</h2>
              </div>

              {/* Content blocks */}
              {section.content.map((block, j) => (
                <ContentBlock key={j} block={block} />
              ))}

              {/* Flowchart cross-link */}
              {section.flowchartId && FLOWCHARTS[section.flowchartId] && onNavigate && (
                <div className="mt-5">
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
          ))}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-center space-y-3">
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

    </div>
  );
}
