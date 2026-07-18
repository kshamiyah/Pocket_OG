import { useEffect, useMemo, useState } from "react";
import { sourceColors } from "../data/glColors";
import { NEWS_KINDS, formatNewsDate, formatSyncedAgo, markNewsSeen, unseenNewsIds } from "../data/latest";

const NO_ITEMS = [];

// Display serif for headlines: system Georgia, so nothing extra is downloaded.
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

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
  return (
    <div className="flex items-center gap-2 mt-3.5">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white ${col.solid} ${col.solidHover} transition-colors`}
      >
        Read the source
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      {item.link && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate?.(item.link); }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white transition-colors text-xs font-semibold text-gray-700"
        >
          Open in app
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Full-width feature card: practice-changing stories, and compact stories once expanded.
function HeroCard({ item, col, fresh, onNavigate, onCollapse }) {
  return (
    <article
      className={`col-span-2 rounded-3xl border p-5 ${col.bg} ${col.border} ${onCollapse ? "cursor-pointer" : ""}`}
      onClick={onCollapse}
    >
      <div className="flex items-center justify-between gap-2">
        <Kicker item={item} col={col} fresh={fresh} />
        {item.weight === "practice" && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white shrink-0">Practice changed</span>
        )}
      </div>
      <h3 className="text-xl text-gray-900 leading-snug mt-2.5" style={SERIF}>{item.title}</h3>
      <p className="text-[13px] text-gray-600 leading-relaxed mt-2">{item.why}</p>
      <p className="text-[11px] font-medium text-gray-400 mt-2.5">{formatNewsDate(item.date)}</p>
      <StoryActions item={item} col={col} onNavigate={onNavigate} />
    </article>
  );
}

// Half-width teaser: headline and date only, taps open into a full card.
function CompactCard({ item, col, fresh, spanFull, onExpand }) {
  return (
    <article className={spanFull ? "col-span-2" : "col-span-1"}>
      <button
        onClick={onExpand}
        className={`w-full h-full text-left rounded-3xl border p-4 flex flex-col ${col.bg} ${col.border} transition-transform active:scale-[0.98]`}
      >
        <Kicker item={item} col={col} fresh={fresh} />
        <h3 className="text-[15px] text-gray-900 leading-snug mt-2 line-clamp-4" style={SERIF}>{item.title}</h3>
        <p className="text-[11px] font-medium text-gray-400 mt-auto pt-2.5">{formatNewsDate(item.date)}</p>
      </button>
    </article>
  );
}

// Latest tab, magazine front page: a briefing strip, practice-changing stories
// as full-width features, everything else as tappable half-width teasers.
// Items come from /latest.json via App (network-first, localStorage fallback);
// this component only renders and marks them seen.
export default function LatestTab({ feed, syncedAt, onNavigate, onSeen }) {
  const items = feed?.items ?? NO_ITEMS;
  const [kindFilter, setKindFilter] = useState("ALL");
  const [expanded, setExpanded] = useState({});

  // Snapshot which items were unseen when the tab opened, so the "New" markers
  // survive the seen-state being cleared by the effect below. Items that only
  // arrive after mount (first ever sync) simply render without a marker.
  const [fresh] = useState(() => unseenNewsIds(items));

  useEffect(() => {
    if (items.length === 0) return;
    markNewsSeen(items);
    onSeen?.();
  }, [items, onSeen]);

  const kindsPresent = useMemo(
    () => ["ALL", ...Object.keys(NEWS_KINDS).filter(k => items.some(it => it.kind === k))],
    [items]
  );
  const visible = kindFilter === "ALL" ? items : items.filter(it => it.kind === kindFilter);
  const syncedAgo = formatSyncedAgo(syncedAt);

  // Layout plan: hero for practice-weight or expanded stories; compact teasers
  // pair up two across, and the last teaser of an odd run stretches full width
  // so the grid never leaves a ragged gap.
  const laidOut = useMemo(() => {
    const isHero = it => it.weight === "practice" || !!expanded[it.id];
    return visible.map((it, i) => {
      if (isHero(it)) return { item: it, hero: true, spanFull: true };
      let runStart = i;
      while (runStart > 0 && !isHero(visible[runStart - 1])) runStart--;
      const runEnd = (() => { let j = i; while (j + 1 < visible.length && !isHero(visible[j + 1])) j++; return j; })();
      const runLen = runEnd - runStart + 1;
      const lastOfOddRun = runLen % 2 === 1 && i === runEnd;
      return { item: it, hero: false, spanFull: lastOfOddRun };
    });
  }, [visible, expanded]);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-5 pt-14 pb-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            New guidance and evidence in O&amp;G, curated
            {feed?.updated ? <> · feed updated {formatNewsDate(feed.updated)}</> : null}
            {syncedAgo ? <> · synced {syncedAgo}</> : null}
          </p>
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
            {fresh.size > 0 && (
              <div className="px-5 pt-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <p className="text-xs font-semibold text-blue-700">
                    Your briefing · {fresh.size} new {fresh.size === 1 ? "story" : "stories"} since your last visit
                  </p>
                </div>
              </div>
            )}

            {kindsPresent.length > 2 && (
              <div className="px-5 pt-3 pb-1 flex gap-1.5 flex-wrap">
                {kindsPresent.map(k => (
                  <button
                    key={k}
                    onClick={() => setKindFilter(k)}
                    aria-pressed={kindFilter === k}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      kindFilter === k ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {k === "ALL" ? "All" : NEWS_KINDS[k].label}
                  </button>
                ))}
              </div>
            )}

            <div className="px-5 pt-3">
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
                      onCollapse={item.weight === "practice" ? undefined : () => setExpanded(prev => ({ ...prev, [item.id]: false }))}
                    />
                  ) : (
                    <CompactCard
                      key={item.id}
                      item={item}
                      col={col}
                      fresh={isFresh}
                      spanFull={spanFull}
                      onExpand={() => setExpanded(prev => ({ ...prev, [item.id]: true }))}
                    />
                  );
                })}
              </div>
              {visible.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-10">Nothing in this category yet.</p>
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
