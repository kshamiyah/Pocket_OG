import { useEffect, useMemo, useState } from "react";
import { sourceColors } from "../data/glColors";
import { NEWS_KINDS, NEWS_KIND_COLORS, formatNewsDate, formatSyncedAgo, markNewsSeen, unseenNewsIds } from "../data/latest";

const NO_ITEMS = [];

// Display serif for headlines: system Georgia, so nothing extra is downloaded.
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

// First sentence (or ~110 chars) so teasers show the change without the full wall of text.
function ledeOf(why = "") {
  const t = why.trim();
  if (!t) return "";
  const m = t.match(/^[\s\S]{20,}?[.!?](?:\s|$)/);
  if (m) return m[0].trim();
  return t.length > 110 ? `${t.slice(0, 107).trim()}…` : t;
}

function Kicker({ item, col, fresh }) {
  const kindLabel = NEWS_KINDS[item.kind]?.label ?? "Update";
  const showSource = item.source && item.source.toUpperCase() !== kindLabel.toUpperCase();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className={`w-3.5 h-[3px] rounded-full shrink-0 ${col.accent}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${col.text}`}>{kindLabel}</span>
      {showSource && <span className="text-[10px] font-semibold text-gray-400 truncate">{item.source}</span>}
      {fresh && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-label="New" />}
    </div>
  );
}

function StoryActions({ item, col, onNavigate }) {
  const hasApp = !!item.link;
  const base = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors";
  return (
    <div className="flex items-center gap-2 mt-3.5 flex-wrap">
      {hasApp && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onNavigate?.(item.link); }}
          className={`${base} text-white ${col.solid} ${col.solidHover}`}
        >
          Open in app
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className={
          hasApp
            ? `${base} bg-white/80 hover:bg-white text-gray-700 border border-gray-200/80`
            : `${base} text-white ${col.solid} ${col.solidHover}`
        }
      >
        Read the source
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

// Expanded story: full why + actions. Tap the header/title to collapse (featured
// practice stories included). Action buttons stay outside that control.
function HeroCard({ item, col, fresh, onNavigate, onCollapse }) {
  return (
    <article className={`col-span-2 rounded-3xl border p-5 ${col.bg} ${col.border}`}>
      <button type="button" onClick={onCollapse} aria-expanded="true" className="w-full text-left">
        <div className="flex items-center justify-between gap-2">
          <Kicker item={item} col={col} fresh={fresh} />
          <div className="flex items-center gap-2 shrink-0">
            {item.weight === "practice" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white">
                Practice changed
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl text-gray-900 leading-snug mt-2.5" style={SERIF}>{item.title}</h3>
      </button>
      {item.why ? <p className="text-[13px] text-gray-600 leading-relaxed mt-2">{item.why}</p> : null}
      <p className="text-[11px] font-medium text-gray-400 mt-2.5">{formatNewsDate(item.date)}</p>
      <StoryActions item={item} col={col} onNavigate={onNavigate} />
    </article>
  );
}

// Teaser: headline + one-line lede of the change, taps open into a full card.
function CompactCard({ item, col, fresh, spanFull, onExpand }) {
  const lede = ledeOf(item.why);
  return (
    <article className={spanFull ? "col-span-2" : "col-span-1"}>
      <button
        type="button"
        onClick={onExpand}
        aria-expanded="false"
        className={`w-full h-full text-left rounded-3xl border p-4 flex flex-col ${col.bg} ${col.border} transition-transform active:scale-[0.98]`}
      >
        <div className="flex items-center justify-between gap-2">
          <Kicker item={item} col={col} fresh={fresh} />
          <div className="flex items-center gap-2 shrink-0">
            {item.weight === "practice" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white">
                Practice
              </span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <h3 className="text-[15px] text-gray-900 leading-snug mt-2 line-clamp-3" style={SERIF}>{item.title}</h3>
        {lede ? (
          <p className="text-[12px] text-gray-500 leading-snug mt-2 line-clamp-2">{lede}</p>
        ) : null}
        <p className="text-[11px] font-medium text-gray-400 mt-auto pt-2.5">{formatNewsDate(item.date)}</p>
      </button>
    </article>
  );
}

// Open = full-width hero. Closed teasers pair two-across; last of an odd run
// stretches full width so the grid never leaves a ragged gap.
function layoutStories(list, expanded) {
  const isHero = it => !!expanded[it.id];
  return list.map((it, i) => {
    if (isHero(it)) return { item: it, hero: true, spanFull: true };
    let runStart = i;
    while (runStart > 0 && !isHero(list[runStart - 1])) runStart--;
    const runEnd = (() => { let j = i; while (j + 1 < list.length && !isHero(list[j + 1])) j++; return j; })();
    const runLen = runEnd - runStart + 1;
    const lastOfOddRun = runLen % 2 === 1 && i === runEnd;
    return { item: it, hero: false, spanFull: lastOfOddRun };
  });
}

function StoryGrid({ laidOut, fresh, onNavigate, setOpen }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {laidOut.map(({ item, hero, spanFull }) => {
        const col = sourceColors(item.source);
        const isFresh = fresh.has(item.id);
        return hero ? (
          <HeroCard
            key={item.id}
            item={item}
            col={col}
            fresh={isFresh}
            onNavigate={onNavigate}
            onCollapse={() => setOpen(item.id, false)}
          />
        ) : (
          <CompactCard
            key={item.id}
            item={item}
            col={col}
            fresh={isFresh}
            spanFull={spanFull}
            onExpand={() => setOpen(item.id, true)}
          />
        );
      })}
    </div>
  );
}

// Briefing first (unseen), then Earlier. Practice stories start featured/open;
// everything else starts collapsed. Any story can be toggled. Items from /latest.json via App.
export default function LatestTab({ feed, syncedAt, onNavigate, onSeen }) {
  const items = feed?.items ?? NO_ITEMS;
  const [kindFilter, setKindFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    for (const it of items) {
      if (it.weight === "practice") init[it.id] = true;
    }
    return init;
  });

  const [fresh] = useState(() => unseenNewsIds(items));

  useEffect(() => {
    if (items.length === 0) return;
    markNewsSeen(items);
    onSeen?.();
  }, [items, onSeen]);

  // Open newly arrived practice stories; leave existing user toggles alone.
  useEffect(() => {
    setExpanded(prev => {
      let changed = false;
      const next = { ...prev };
      for (const it of items) {
        if (it.weight === "practice" && next[it.id] === undefined) {
          next[it.id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [items]);

  const kindsPresent = useMemo(
    () => ["ALL", ...Object.keys(NEWS_KINDS).filter(k => items.some(it => it.kind === k))],
    [items]
  );
  const hasPractice = items.some(it => it.weight === "practice");
  const visible = useMemo(() => {
    let list = items;
    if (kindFilter === "PRACTICE") list = list.filter(it => it.weight === "practice");
    else if (kindFilter !== "ALL") list = list.filter(it => it.kind === kindFilter);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter(it => {
      const kindLabel = NEWS_KINDS[it.kind]?.label ?? "";
      const hay = [it.title, it.why, it.source, it.kind, kindLabel].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [items, kindFilter, searchQuery]);

  const briefing = useMemo(() => visible.filter(it => fresh.has(it.id)), [visible, fresh]);
  const earlier = useMemo(() => visible.filter(it => !fresh.has(it.id)), [visible, fresh]);
  const showSections = briefing.length > 0 && earlier.length > 0;
  const briefingLaidOut = useMemo(() => layoutStories(briefing, expanded), [briefing, expanded]);
  const earlierLaidOut = useMemo(() => layoutStories(earlier, expanded), [earlier, expanded]);
  const allLaidOut = useMemo(() => layoutStories(visible, expanded), [visible, expanded]);
  const syncedAgo = formatSyncedAgo(syncedAt);
  const searchActive = searchQuery.trim().length > 0;

  const setOpen = (id, open) => setExpanded(prev => ({ ...prev, [id]: open }));

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-14 pb-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Latest news, guidance and evidence in O&amp;G · curated
          </p>
          {(feed?.updated || syncedAgo) && (
            <p className="text-xs text-gray-400 mt-0.5">
              {feed?.updated ? <>feed updated {formatNewsDate(feed.updated)}</> : null}
              {feed?.updated && syncedAgo ? " · " : null}
              {syncedAgo ? <>synced {syncedAgo}</> : null}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="px-5 pt-10 text-center">
            <p className="text-sm font-semibold text-gray-600">Nothing here yet</p>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              The feed syncs when you are online. Open Latest once with a connection and it stays readable offline.
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-20 bg-white px-5 pt-3 pb-2">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search the feed…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                {searchActive && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                  >
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {(kindsPresent.length > 2 || hasPractice) && (
              <div className="px-5 pt-1 pb-1 flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setKindFilter("ALL")}
                  aria-pressed={kindFilter === "ALL"}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    kindFilter === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {hasPractice && (
                  <button
                    type="button"
                    onClick={() => setKindFilter("PRACTICE")}
                    aria-pressed={kindFilter === "PRACTICE"}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      kindFilter === "PRACTICE" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Practice
                  </button>
                )}
                {kindsPresent.filter(k => k !== "ALL").map(k => {
                  const chip = NEWS_KIND_COLORS[k];
                  const on = kindFilter === k;
                  return (
                    <button
                      type="button"
                      key={k}
                      onClick={() => setKindFilter(k)}
                      aria-pressed={on}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        on ? (chip?.active ?? "bg-gray-900 text-white") : (chip?.idle ?? "bg-gray-100 text-gray-500 hover:bg-gray-200")
                      }`}
                    >
                      {NEWS_KINDS[k].label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="px-5 pt-3">
              {visible.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">
                  {searchActive
                    ? <>No stories match &ldquo;{searchQuery.trim()}&rdquo;</>
                    : "Nothing in this category yet."}
                </p>
              ) : showSections ? (
                <div className="space-y-5">
                  <section>
                    <div className="flex items-center gap-2 mb-2.5 px-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <h3 className="text-xs font-bold tracking-wide uppercase text-blue-700">
                        Since you were last here · {briefing.length}
                      </h3>
                    </div>
                    <StoryGrid laidOut={briefingLaidOut} fresh={fresh} onNavigate={onNavigate} setOpen={setOpen} />
                  </section>
                  <section>
                    <h3 className="text-xs font-bold tracking-wide uppercase text-gray-400 mb-2.5 px-0.5">
                      Earlier
                    </h3>
                    <StoryGrid laidOut={earlierLaidOut} fresh={fresh} onNavigate={onNavigate} setOpen={setOpen} />
                  </section>
                </div>
              ) : briefing.length > 0 ? (
                <section>
                  <div className="flex items-center gap-2 mb-2.5 px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <h3 className="text-xs font-bold tracking-wide uppercase text-blue-700">
                      Since you were last here · {briefing.length}
                    </h3>
                  </div>
                  <StoryGrid laidOut={briefingLaidOut} fresh={fresh} onNavigate={onNavigate} setOpen={setOpen} />
                </section>
              ) : (
                <StoryGrid laidOut={allLaidOut} fresh={fresh} onNavigate={onNavigate} setOpen={setOpen} />
              )}
              <p className="text-[11px] text-gray-400 mt-3 px-1 leading-snug">
                Signposts to new guidance and evidence, each linking to the primary source. Read the source itself
                before changing practice, and verify against local guidance.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
