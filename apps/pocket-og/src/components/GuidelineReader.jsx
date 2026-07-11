import { useRef, useState, useMemo, useEffect } from "react";
import {
  GUIDELINES,
  GL861_SECTIONS, GL952_SECTIONS, GL891_SECTIONS, GL983_SECTIONS,
  GL880_SECTIONS, GL787_SECTIONS, GL783_SECTIONS, GL895_SECTIONS,
  CG565_SECTIONS, CG621_SECTIONS, CG623_SECTIONS,
  QS46_SECTIONS, QS22_SECTIONS,
  GTG57_SECTIONS, GTG63_SECTIONS, GTG67_SECTIONS,
  NG88_SECTIONS, NHSCSP20_SECTIONS,
  GTG52_SECTIONS, GTG69_SECTIONS, NG25_SECTIONS,
  GTG31_SECTIONS, GTG17_SECTIONS, CG192_SECTIONS,
  NG133_SECTIONS,
  NG229_SECTIONS,
  BASHH_PID_SECTIONS,
  BASHH_HSV_SECTIONS,
  NG73_SECTIONS,
  MBRRACE_SLMC2025_SECTIONS,
  GTG5_SECTIONS,
  GTG56_SECTIONS,
  GTG22_SECTIONS,
} from "@pocket-og/guidelines";
import { FLOWCHARTS } from "../data/flowcharts";
import { GUIDELINE_KEYWORD_LINKS } from "../data/connections";
import { glColors } from "../data/glColors";
import ContentBlock from "./ContentBlock";
import SeeAlso from "./SeeAlso";
import BottomSheet from "./BottomSheet";
import ShareButton from "./ShareButton";
import { shareUrl as deepLinkUrl } from "../utils/deepLink";

const SECTIONS_MAP = {
  GL861: GL861_SECTIONS,
  GL952: GL952_SECTIONS,
  GL891: GL891_SECTIONS,
  GL983: GL983_SECTIONS,
  GL880: GL880_SECTIONS,
  GL787: GL787_SECTIONS,
  GL783: GL783_SECTIONS,
  GL895: GL895_SECTIONS,
  CG565: CG565_SECTIONS,
  CG621: CG621_SECTIONS,
  CG623: CG623_SECTIONS,
  QS46:  QS46_SECTIONS,
  QS22:  QS22_SECTIONS,
  GTG57: GTG57_SECTIONS,
  GTG63: GTG63_SECTIONS,
  GTG67: GTG67_SECTIONS,
  NG88:  NG88_SECTIONS,
  NHSCSP20: NHSCSP20_SECTIONS,
  GTG52: GTG52_SECTIONS,
  GTG69: GTG69_SECTIONS,
  NG25:  NG25_SECTIONS,
  GTG31: GTG31_SECTIONS,
  GTG17: GTG17_SECTIONS,
  CG192: CG192_SECTIONS,
  NG133: NG133_SECTIONS,
  NG229: NG229_SECTIONS,
  BASHH_PID: BASHH_PID_SECTIONS,
  BASHH_HSV: BASHH_HSV_SECTIONS,
  NG73: NG73_SECTIONS,
  MBRRACE_SLMC2025: MBRRACE_SLMC2025_SECTIONS,
  GTG5: GTG5_SECTIONS,
  GTG56: GTG56_SECTIONS,
  GTG22: GTG22_SECTIONS,
};


// Strip common abbreviation prefixes from titles (e.g. "IOL — ", "IDA — ", "VTE — ")
// so they're not redundant alongside the condition label shown above
function shortTitle(title) {
  return title.replace(/^.+? — /, "");
}

function blockText(block) {
  if (!block) return "";
  if (block.type === "text" || block.type === "alert" || block.type === "subheading") return block.value ?? "";
  if (block.type === "list") return (block.items ?? []).join(" ");
  if (block.type === "table") return [...(block.headers ?? []), ...(block.rows ?? []).flat()].join(" ");
  return "";
}

// Returns an array of per-block link arrays for a section, respecting first-mention-only.
function computeSectionBlockLinks(section, allLinks) {
  const seenIds = new Set();
  return (section.content ?? []).map(block => {
    const available = allLinks.filter(l => !seenIds.has(l.id));
    const text = blockText(block).toLowerCase();
    for (const l of available) {
      if (text.includes(l.phrase.toLowerCase())) seenIds.add(l.id);
    }
    return available;
  });
}

export default function GuidelineReader({ gl, onClose, onNavigate, scrollToSectionId }) {
  const sections = SECTIONS_MAP[gl] ?? [];
  const guideline = GUIDELINES[gl];
  const theme = glColors(gl);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const [showContents, setShowContents] = useState(false);

  const shareTitle = `${gl} — ${guideline?.label ?? "Pocket O&G"}`.trim();
  const shareLink = deepLinkUrl("reader", gl);
  const shareText = `${shareTitle}${guideline?.source ? ` (${guideline.source})` : ""} — via Pocket O&G`;

  const keywordLinks = GUIDELINE_KEYWORD_LINKS[gl] ?? [];
  const blockLinksMap = useMemo(() => {
    const map = {};
    for (const section of sections) {
      map[section.id] = computeSectionBlockLinks(section, keywordLinks);
    }
    return map;
  }, [sections, keywordLinks]);

  const jumpTo = (id) => {
    setShowContents(false);
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  useEffect(() => {
    if (!scrollToSectionId) return;
    const timer = setTimeout(() => jumpTo(scrollToSectionId), 200);
    return () => clearTimeout(timer);
  }, [gl, scrollToSectionId]);

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">

      {/* Main header */}
      <div className="shrink-0 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Close guideline reader"
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
          <ShareButton title={shareTitle} text={shareText} url={shareLink} label="Share this guideline" />
          <button
            onClick={() => setShowContents(true)}
            aria-label="Show table of contents"
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
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${theme.conditionColor}`}>
                  {section.condition}
                </p>
                <h2 className="text-sm font-bold text-gray-900 leading-snug">
                  {shortTitle(section.title)}
                </h2>
              </div>

              {/* Section content */}
              <div className="px-4 pt-5 pb-10">
                {section.content.map((block, j) => (
                  <ContentBlock
                    key={j}
                    block={block}
                    inlineLinks={blockLinksMap[section.id]?.[j] ?? []}
                    onNavigate={onNavigate}
                  />
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
                href={guideline.pdfUrl || guideline.pdfPath || `/guidelines/${gl}.pdf`}
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
            <p className="text-xs text-gray-400">{gl} {guideline?.version} · {guideline?.date}</p>
            <p className="text-xs text-gray-400 mt-1">Content summarised from source guidelines — verify against current published versions and local protocols. For decision support only.</p>
          </div>

        </div>
      </div>

      <BottomSheet
        open={showContents}
        onClose={() => setShowContents(false)}
        zIndex={60}
        showHandle
        sheetClassName="max-h-[min(90dvh,100%)]"
      >
        <div className="px-5 pb-2 flex items-center justify-between shrink-0">
          <p className="text-base font-bold text-gray-900">Contents</p>
          <button
            type="button"
            onClick={() => setShowContents(false)}
            aria-label="Close table of contents"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-2">
          {sections.map((section, i) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpTo(section.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                i > 0 ? "border-t border-gray-50" : ""
              }`}
            >
              <span className={`text-xs font-bold w-5 shrink-0 ${theme.conditionColor}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-wide ${theme.conditionColor}`}>{section.condition}</p>
                <p className="text-sm font-medium text-gray-900 leading-snug mt-0.5">{shortTitle(section.title)}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </BottomSheet>

    </div>
  );
}
