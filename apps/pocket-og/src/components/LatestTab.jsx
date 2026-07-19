import { useEffect, useMemo, useState } from "react";
import { sourceColors } from "../data/glColors";
import { NEWS_KINDS, formatNewsDate, formatSyncedAgo, markNewsSeen, unseenNewsIds } from "../data/latest";

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

// Hybrid: practice stories start featured/open; everything else starts collapsed.
// Any story can be toggled, featured included. Items from /latest.json via App.
export default function LatestTab({ feed, syncedAt, onNavigate, onSeen }) {
  const items = feed?.items ?? NO_ITEMS;
  const [kindFilter, setKindFilter] = useState("ALL");
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
    if (kindFilter === "PRACTICE") return items.filter(it => it.weight === "practice");
    if (kindFilter === "ALL") return items;
    return items.filter(it => it.kind === kindFilter);
  }, [items, kindFilter]);
  const syncedAgo = formatSyncedAgo(syncedAt);

  const setOpen = (id, open) => setExpanded(prev => ({ ...prev, [id]: open }));

  // Open = full-width hero. Closed teasers pair two-across; last of an odd run
  // stretches full width so the grid never leaves a ragged gap.
  const laidOut = useMemo(() => {
    const isHero = it => !!expanded[it.id];
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

            {(kindsPresent.length > 2 || hasPractice) && (
              <div className="px-5 pt-3 pb-1 flex gap-1.5 flex-wrap">
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
                {kindsPresent.filter(k => k !== "ALL").map(k => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setKindFilter(k)}
                    aria-pressed={kindFilter === k}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      kindFilter === k ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {NEWS_KINDS[k].label}
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
