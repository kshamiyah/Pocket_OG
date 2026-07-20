import { useEffect, useMemo, useState } from "react";
import { sourceColors, glColors } from "../data/glColors";
import { SIM_CASES } from "../data/simCases";
import { NEWS_KINDS, unseenNewsIds, newsItemsAddedWithinDays } from "../data/latest";
import ThemeToggle from "./ThemeToggle";
import TextSizeToggle from "./TextSizeToggle";
import DailyPearl from "./DailyPearl";
import InstallBanner from "./InstallBanner";
import { LATEST_VERSION } from "../data/updates";

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };
const BRIEF_ROTATE_MS = 5000;
const SUGGEST_ROTATE_MS = 4000;

const CAROUSEL_ARROW =
  "w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shrink-0 self-center";

function CarouselDots({ count, index }) {
  if (count <= 1) return null;
  return (
    <div className="flex justify-center gap-1.5 mt-2.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1 rounded-full transition-all ${
            i === index ? "w-4 bg-gray-400" : "w-1 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function BriefingCard({ item, fresh, onOpenNews }) {
  const col = sourceColors(item.source);
  const kindLabel = NEWS_KINDS[item.kind]?.label ?? "Update";
  const isFresh = fresh?.has(item.id);

  return (
    <button
      type="button"
      onClick={() => onOpenNews?.(item.id)}
      className={`w-full text-left rounded-2xl border p-3.5 ${col.bg} ${col.border} hover:shadow-sm active:scale-[0.99] transition-all`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-3 h-[3px] rounded-full shrink-0 ${col.accent}`} />
        <span className={`text-[10px] font-bold tracking-widest uppercase ${col.text}`}>{kindLabel}</span>
        {item.source && item.source.toUpperCase() !== kindLabel.toUpperCase() && (
          <span className="text-[10px] font-semibold text-gray-400 truncate">{item.source}</span>
        )}
        {isFresh && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-label="New" />}
        {item.weight === "practice" && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-900 text-white shrink-0">
            Practice
          </span>
        )}
      </div>
      <p className="text-[15px] text-gray-900 leading-snug mt-2 line-clamp-2" style={SERIF}>{item.title}</p>
    </button>
  );
}

function useRotatingIndex(length, intervalMs) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [length]);

  useEffect(() => {
    if (length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex(i => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs]);

  const step = delta => setIndex(i => (i + delta + length) % length);

  return { index, setIndex, step, canStep: length > 1 };
}

export default function HomeScreen({
  theme,
  onThemeToggle,
  onAbout,
  updatesUnseen,
  onOpenUpdates,
  inputRef,
  searchHints,
  hintIndex,
  inputValue,
  onInputChange,
  onSubmitSearch,
  suggestions,
  feed,
  onOpenNews,
  onNavigate,
  onSwitchTab,
  pearl,
  pearlUnseen,
  pearlDismissed,
  onPearlSeen,
  onPearlDismiss,
}) {
  const feedItems = feed?.items ?? [];
  const briefingItems = useMemo(() => newsItemsAddedWithinDays(feedItems, 7), [feedItems]);
  const fresh = useMemo(() => unseenNewsIds(feedItems), [feedItems]);
  const hasUnseenBriefing = briefingItems.some(it => fresh.has(it.id));

  const [searchFocused, setSearchFocused] = useState(false);

  const brief = useRotatingIndex(briefingItems.length, BRIEF_ROTATE_MS);
  const suggest = useRotatingIndex(suggestions.length, SUGGEST_ROTATE_MS);

  const activeBrief = briefingItems[brief.index] ?? briefingItems[0];
  const activeSuggestion = suggestions[suggest.index] ?? suggestions[0];

  return (
    <div
      className="min-h-screen flex flex-col text-center"
      style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        className="shrink-0 max-w-lg mx-auto w-full px-5"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onAbout}
            aria-label="About Pocket O&G"
            className="w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur border border-gray-200 shadow-sm rounded-full text-gray-400 hover:text-gray-600 hover:shadow-md active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <TextSizeToggle />
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${searchFocused ? "justify-start" : "justify-center"}`}
      >
        <div className="max-w-lg mx-auto w-full px-5 py-6 animate-enter">
        <div className="mb-8">
          <h1 className="text-[42px] sm:text-[52px] font-[800] tracking-[-0.03em] text-black leading-[0.95]">
            Pocket O&amp;G
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed">
            Pocket the evidence. Make the call.
          </p>
          {updatesUnseen && (
            <button
              type="button"
              onClick={onOpenUpdates}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 hover:bg-blue-100 active:scale-95 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              What&apos;s new
            </button>
          )}
        </div>

        <div className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 overflow-hidden focus-within:border-gray-300 focus-within:ring-4 focus-within:ring-gray-900/5 focus-within:shadow-xl transition-all">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder={searchHints[hintIndex]}
                value={inputValue}
                onChange={onInputChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={e => e.key === "Enter" && onSubmitSearch()}
                className="w-full bg-transparent pl-11 pr-14 py-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none text-left"
                style={{ fontSize: "16px" }}
              />
              <button
                type="button"
                onClick={() => onSubmitSearch()}
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:bg-gray-800 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-100 px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {suggest.canStep && (
                    <button
                      type="button"
                      onClick={() => suggest.step(-1)}
                      aria-label="Previous suggestion"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 active:scale-95 transition-all shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <button
                    key={activeSuggestion}
                    type="button"
                    onClick={() => onSubmitSearch(activeSuggestion)}
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-200 active:scale-[0.99] transition-all animate-enter"
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 shrink-0">Try</span>
                    <span className="text-sm font-medium text-gray-700 truncate">{activeSuggestion}</span>
                  </button>
                  {suggest.canStep && (
                    <button
                      type="button"
                      onClick={() => suggest.step(1)}
                      aria-label="Next suggestion"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 active:scale-95 transition-all shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                <CarouselDots count={suggestions.length} index={suggest.index} />
              </div>
            )}
          </div>
        </div>

        {briefingItems.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {hasUnseenBriefing && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                <h2 className={`text-xs font-bold tracking-wide uppercase truncate ${hasUnseenBriefing ? "text-blue-700" : "text-gray-400"}`}>
                  {hasUnseenBriefing ? "Since you were last here" : "Latest updates"}
                </h2>
              </div>
              <span className="text-gray-300">·</span>
              <button
                type="button"
                onClick={() => onSwitchTab("latest")}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 shrink-0"
              >
                See all
              </button>
            </div>
            <div className="flex items-stretch gap-2">
              {brief.canStep && (
                <button
                  type="button"
                  onClick={() => brief.step(-1)}
                  aria-label="Previous update"
                  className={CAROUSEL_ARROW}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div key={activeBrief.id} className="flex-1 min-w-0 animate-enter text-left">
                <BriefingCard item={activeBrief} fresh={fresh} onOpenNews={onOpenNews} />
              </div>
              {brief.canStep && (
                <button
                  type="button"
                  onClick={() => brief.step(1)}
                  aria-label="Next update"
                  className={CAROUSEL_ARROW}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            <CarouselDots count={briefingItems.length} index={brief.index} />
          </section>
        )}

        {!pearlDismissed && (
          <div className="mb-6 text-left">
            <DailyPearl
              pearl={pearl}
              unseen={pearlUnseen}
              onSeen={onPearlSeen}
              onDismiss={onPearlDismiss}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {/* On Call — case simulation entry */}
        {SIM_CASES.length > 0 && (() => {
          const sim = SIM_CASES[0];
          const c = glColors(sim.gl);
          return (
            <button
              type="button"
              onClick={() => onNavigate?.({ type: "sim", id: sim.id })}
              className="mb-6 w-full text-left px-4 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                  <svg className={c.text} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={{ width: 18, height: 18 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3 7 4-14 3 7h4" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    On Call <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold align-middle ${c.badge}`}>NEW</span>
                  </p>
                  <p className="text-xs text-gray-400 leading-snug mt-0.5">
                    {sim.setting}: a patient is waiting. Work the case, get the lesson.
                  </p>
                </div>
                <span className="text-gray-300 text-lg shrink-0">›</span>
              </div>
            </button>
          );
        })()}

        <InstallBanner />

        <div className="mt-8 text-xs text-gray-400">
          <p>
            Built by{" "}
            <a
              href="https://drshamiyah.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              Khalid Shamiyah
            </a>
          </p>
          <button
            type="button"
            onClick={onOpenUpdates}
            className="mt-1 underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            v{LATEST_VERSION}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
