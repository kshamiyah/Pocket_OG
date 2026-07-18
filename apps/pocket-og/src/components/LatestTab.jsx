import { useEffect, useMemo, useState } from "react";
import { sourceColors } from "../data/glColors";
import { NEWS_KINDS, formatNewsDate, formatSyncedAgo, markNewsSeen, unseenNewsIds } from "../data/latest";

const NO_ITEMS = [];

// Latest tab: the curated feed of new guidance and evidence. Items come from
// /latest.json via App (network-first, localStorage fallback); this component
// only renders and marks them seen.
export default function LatestTab({ feed, syncedAt, onNavigate, onSeen }) {
  const items = feed?.items ?? NO_ITEMS;
  const [kindFilter, setKindFilter] = useState("ALL");

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
              <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                {visible.map((item, i) => {
                  const col = sourceColors(item.source);
                  return (
                    <article key={item.id} className={`px-4 py-4 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${col.badge}`}>{item.source}</span>
                        <span className="text-[11px] font-medium text-gray-400">
                          {NEWS_KINDS[item.kind]?.label ?? "Update"} · {formatNewsDate(item.date)}
                        </span>
                        {item.weight === "practice" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white">Practice changed</span>
                        )}
                        {fresh?.has(item.id) && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug mt-2">{item.title}</h3>
                      <p className="text-[13px] text-gray-600 leading-relaxed mt-1.5">{item.why}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white ${col.solid} ${col.solidHover} transition-colors`}
                        >
                          Read the source
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {item.link && (
                          <button
                            onClick={() => onNavigate?.(item.link)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-semibold text-gray-600"
                          >
                            Open in app
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
                {visible.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-10">Nothing in this category yet.</p>
                )}
              </div>
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
