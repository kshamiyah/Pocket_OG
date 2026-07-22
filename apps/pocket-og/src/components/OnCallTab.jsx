import { useMemo } from "react";
import { glColors } from "../data/glColors";
import { SIM_CASES, scoredBeatCount } from "../data/simCases";
import TabPageHeader from "./TabPageHeader";

// On Call — the case library. Lists every simulated patient grouped by setting;
// tapping one opens the SimPlayer. Drafts (draft: true) are shown here with a
// tag so they can be reviewed on this branch, and filtered out of production
// separately.

const SETTING_ORDER = ["Maternity Assessment Unit", "Delivery Suite", "Antenatal Clinic"];

function DifficultyDots({ level }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Level ${level}`}>
      {[1, 2, 3].map(n => (
        <span key={n} className={`w-1.5 h-1.5 rounded-full ${n <= level ? "bg-gray-500" : "bg-gray-200"}`} />
      ))}
    </span>
  );
}

function CaseCard({ simCase, onOpen }) {
  const c = glColors(simCase.gl);
  const scored = scoredBeatCount(simCase);
  return (
    <button
      type="button"
      onClick={() => onOpen(simCase.id)}
      className="w-full text-left px-4 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 active:scale-[0.99] transition-all"
    >
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
          <svg className={c.text} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={{ width: 20, height: 20 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3 7 4-14 3 7h4" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{simCase.title}</p>
            {simCase.draft && (
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700">Draft</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span className={`px-1.5 py-0.5 rounded ${c.badge} font-semibold text-[10px]`}>{simCase.gl}</span>
            <DifficultyDots level={simCase.difficulty ?? 1} />
            <span className="tabular-nums">{scored} {scored === 1 ? "decision" : "decisions"}</span>
          </div>
        </div>
        <span className="text-gray-300 text-lg shrink-0">›</span>
      </div>
    </button>
  );
}

export default function OnCallTab({ onOpenSim, theme, onThemeToggle }) {
  const groups = useMemo(() => {
    const bySetting = {};
    for (const c of SIM_CASES) (bySetting[c.setting] ??= []).push(c);
    const ordered = [];
    for (const s of SETTING_ORDER) if (bySetting[s]) { ordered.push([s, bySetting[s]]); delete bySetting[s]; }
    for (const [s, list] of Object.entries(bySetting)) ordered.push([s, list]);
    return ordered;
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto">
        <TabPageHeader
          title="On Call"
          subtitle="Simulated patients · decision practice"
          theme={theme}
          onThemeToggle={onThemeToggle}
        />

        <div className="px-5 pt-2">
          <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 mb-5">
            <p className="text-xs text-gray-500 leading-relaxed">
              A fictional patient arrives and you make the calls, step by step. Each decision is scored against the guideline, with the reasoning and source shown. Training simulation, decision aid only.
            </p>
          </div>

          {groups.map(([setting, list]) => (
            <div key={setting} className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 px-1">{setting}</h2>
              <div className="space-y-2.5">
                {list.map(c => <CaseCard key={c.id} simCase={c} onOpen={onOpenSim} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
