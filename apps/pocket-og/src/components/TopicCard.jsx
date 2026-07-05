import { useState } from "react";
import { glColors } from "../data/glColors";
import { GUIDELINES } from "@pocket-og/guidelines";

// Curated topic card shown above search results when the query matches a
// topic in src/data/topics.js. Every row deep-links into existing content;
// the card itself carries no clinical text.

function RowIcon({ type, className }) {
  if (type === "flowchart") return <span className={`text-base leading-none ${className}`}>⬡</span>;
  if (type === "drug") {
    return (
      <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    );
  }
  if (type === "trial") {
    return (
      <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v6.75L4.5 18.9a1.5 1.5 0 001.3 2.25h12.4a1.5 1.5 0 001.3-2.25L14.25 9.75V3M8.25 3h7.5" />
      </svg>
    );
  }
  if (type === "calculator") {
    return (
      <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  // reader / default: book
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export default function TopicCard({ topic, onNavigate, onOpenGuideline }) {
  // First section open by default so the card starts compact but not empty.
  const [openSections, setOpenSections] = useState(() =>
    topic ? { [topic.sections[0]?.heading]: true } : {}
  );
  if (!topic) return null;
  const toggleSection = (heading) =>
    setOpenSections(prev => ({ ...prev, [heading]: !prev[heading] }));

  const open = (entry) => {
    if (entry.type === "reader") {
      if (entry.sectionId && onOpenGuideline) onOpenGuideline(entry.id, entry.sectionId);
      else onNavigate({ type: "reader", id: entry.id });
    } else {
      onNavigate({ type: entry.type, id: entry.id });
    }
  };

  return (
    <div className="mb-6 rounded-2xl overflow-hidden bg-white border border-orange-200 shadow-sm">
      {/* Orange is the dedicated topic-card colour: no source body owns it,
          and it stands out against the app's cool source palette. */}
      <div className="h-1.5 bg-orange-500" />
      <div className="px-4 pt-3.5 pb-3 border-b border-orange-100 bg-orange-50/50">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase text-white bg-orange-500">Topic</span>
          <span className="text-[10px] text-orange-700/70 font-medium">Everything in the app on this</span>
        </div>
        <h3 className="mt-1.5 text-lg font-bold text-gray-900 tracking-tight">{topic.title}</h3>
        {topic.subtitle && <p className="text-xs text-gray-400 mt-0.5">{topic.subtitle}</p>}
      </div>

      {topic.sections.map(section => {
        const isOpen = !!openSections[section.heading];
        return (
        <div key={section.heading} className="border-b border-gray-50 last:border-b-0">
          <button
            onClick={() => toggleSection(section.heading)}
            aria-expanded={isOpen}
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
          >
            <span className="flex-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.heading}</span>
            <span className="text-[10px] font-semibold text-gray-300">{section.entries.length}</span>
            <svg
              className={`w-3.5 h-3.5 text-gray-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
          <div className="pb-1">
            {section.entries.map((entry, i) => {
              const ecol = glColors(entry.gl ?? topic.gl);
              const badgeLabel = GUIDELINES[entry.gl]?.code ?? entry.gl;
              return (
                <button
                  key={`${entry.type}-${entry.id}-${entry.sectionId ?? i}`}
                  onClick={() => open(entry)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group"
                >
                  <div className={`w-8 h-8 rounded-xl ${ecol.bg} flex items-center justify-center shrink-0`}>
                    <RowIcon type={entry.type} className={ecol.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{entry.label}</p>
                    {entry.sublabel && <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.sublabel}</p>}
                  </div>
                  {badgeLabel && (
                    <span className={`shrink-0 text-[10px] font-bold ${ecol.icon}`}>{badgeLabel}</span>
                  )}
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm shrink-0">→</span>
                </button>
              );
            })}
          </div>
          )}
        </div>
        );
      })}

      <p className="px-4 py-2.5 border-t border-gray-50 text-[10px] text-gray-400 leading-snug">
        Curated links into cited guides, pathways and drug pages. Decision aid only; clinical responsibility remains with the treating clinician.
      </p>
    </div>
  );
}
