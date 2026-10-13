import { useEffect, useState } from "react";
import FlowchartPlayer from "../../pocket-og/src/components/FlowchartPlayer";
import TabPageHeader from "../../pocket-og/src/components/TabPageHeader";
import { glColors } from "../../pocket-og/src/data/glColors";
import { OUH_GUIDES, OUH_FLOWCHARTS } from "./data/guides";
import HomeSplash from "./HomeSplash";

// Same theme key as Pocket O&G, so a user's light/dark choice carries over
// if this app is ever served alongside it.
const THEME_KEY = "pocketog_theme_v1";

// The URL is the source of truth for where the user is, so the phone's back
// gesture and shared links work: "/" is the welcome screen, "?guides" the
// guide list, "?fc=<id>" a chart (over the list).
function readUrl() {
  const q = new URLSearchParams(window.location.search);
  const fc = q.get("fc");
  const activeId = fc && OUH_FLOWCHARTS[fc] ? fc : null;
  return { view: activeId || q.has("guides") ? "list" : "home", activeId };
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) ?? "light"; } catch { return "light"; }
  });
  useEffect(() => {
    const dark = theme === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#111827" : "#ffffff");
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* best effort */ }
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const [route, setRoute] = useState(readUrl);
  useEffect(() => {
    const onPop = () => setRoute(readUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // Forward moves push a history entry; going back pops it, or (if the user
  // arrived on this screen by a link) replaces it with the parent screen.
  const go = search => {
    window.history.pushState({ inApp: true }, "", search);
    setRoute(readUrl());
  };
  const back = parent => {
    if (window.history.state?.inApp) { window.history.back(); return; }
    window.history.replaceState(null, "", parent);
    setRoute(readUrl());
  };

  const open = id => go(`?fc=${encodeURIComponent(id)}`);
  const active = route.activeId ? OUH_FLOWCHARTS[route.activeId] : null;

  if (route.view === "home") {
    return <HomeSplash theme={theme} onThemeToggle={toggleTheme} onBrowse={() => go("?guides")} />;
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {active && (
        <FlowchartPlayer
          key={active.id}
          flowchart={active}
          gl={active.gl}
          theme={glColors(active.gl)}
          onClose={() => back("?guides")}
          appName="OUH Guides"
        />
      )}

      <div className="max-w-lg mx-auto relative">
        <button
          type="button"
          onClick={() => back(window.location.pathname)}
          className="absolute left-5 inline-flex items-center gap-1 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </button>
        <TabPageHeader
          title="OUH Guides"
          subtitle="Oxford University Hospitals local guidelines"
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        <div className="h-5" />

        {OUH_GUIDES.map(guide => {
          const col = glColors(guide.code);
          return (
            <div key={guide.code} className="mb-5 px-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-xs font-bold tracking-wide ${col.icon}`}>{guide.code}</span>
                <span className="text-xs text-gray-400">{guide.label}</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">
                {guide.title} {guide.version} · {guide.date}
                {guide.note ? <span className="block text-amber-600">{guide.note}</span> : null}
              </p>
              <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                {guide.flowcharts.map((fc, i) => (
                  <button
                    key={fc.id}
                    onClick={() => open(fc.id)}
                    className={`flex items-center gap-3 w-full px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${i > 0 ? "border-t border-gray-50" : ""}`}
                  >
                    <div className={`w-1 h-8 rounded-full shrink-0 ${col.accent}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{fc.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fc.subtitle}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
