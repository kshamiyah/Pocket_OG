import { useEffect, useState } from "react";
import FlowchartPlayer from "../../pocket-og/src/components/FlowchartPlayer";
import TabPageHeader from "../../pocket-og/src/components/TabPageHeader";
import { glColors } from "../../pocket-og/src/data/glColors";
import { OUH_GUIDES, OUH_FLOWCHARTS } from "./data/guides";

// Same theme key as Pocket O&G, so a user's light/dark choice carries over
// if this app is ever served alongside it.
const THEME_KEY = "pocketog_theme_v1";

function initialFlowchart() {
  try {
    const id = new URLSearchParams(window.location.search).get("fc");
    return id && OUH_FLOWCHARTS[id] ? id : null;
  } catch { return null; }
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

  const [activeId, setActiveId] = useState(initialFlowchart);
  const open = id => {
    setActiveId(id);
    try { window.history.replaceState(null, "", id ? `?fc=${encodeURIComponent(id)}` : window.location.pathname); } catch { /* ignore */ }
  };

  const active = activeId ? OUH_FLOWCHARTS[activeId] : null;

  return (
    <div className="min-h-screen bg-white pb-16">
      {active && (
        <FlowchartPlayer
          key={active.id}
          flowchart={active}
          gl={active.gl}
          theme={glColors(active.gl)}
          onClose={() => open(null)}
          appName="OUH Guides"
        />
      )}

      <div className="max-w-lg mx-auto">
        <TabPageHeader
          title="OUH Guides"
          subtitle="Oxford University Hospitals local guidelines"
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        <div className="mx-5 mt-4 mb-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
          <p className="text-xs text-green-700 leading-relaxed">
            Local OUH guidance, laid out as interactive pathways. Each step cites the guideline page it comes from.
            Decision aid only: clinical responsibility remains with the treating clinician. Check the current approved
            version on the OUH intranet before relying on it.
          </p>
        </div>

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
