import { useState } from "react";
import { Chip, Stepper } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, CARD, TYPE_DISPLAY, TYPE_META, TYPE_OVERLINE } from "../ui/styles";
import { IconBack } from "../ui/icons";
import { UNIT_DEFAULTS, UNIT_SETTINGS, formatSetting, getUnitSettings } from "../data/unitSettings";

const GROUPS = [...new Set(UNIT_SETTINGS.map(s => s.group))];

/** Full-screen editor for the unit's local choices. Nothing changes until Save. */
export default function UnitSettings({ onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...getUnitSettings() }));
  const saved = getUnitSettings();
  const dirty = UNIT_SETTINGS.some(s => draft[s.key] !== saved[s.key]);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-gray-950 flex flex-col" role="dialog" aria-label="Unit settings">
      <div className="shrink-0 border-b border-gray-200 dark:border-gray-800" style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pb-3 flex items-start gap-3">
          <button type="button" onClick={onClose} aria-label="Back without saving"
            className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-claude-700 dark:text-claude-400 active:scale-95"><IconBack /></button>
          <div className="flex-1 min-w-0">
            <h2 className={TYPE_DISPLAY}>Unit settings</h2>
            <p className={`${TYPE_META} mt-0.5`}>Your unit's local choices. Stored on this phone only.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto px-5 py-4 space-y-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            These are the numbers and policies that national guidance leaves to each unit. Set them to match your local protocol. Each one shows what NICE or the cited guideline says, and the Rules and sources page shows what this phone is set to.
          </p>
          {GROUPS.map(g => (
            <section key={g} className="space-y-2">
              <h3 className={TYPE_OVERLINE}>{g}</h3>
              {UNIT_SETTINGS.filter(s => s.group === g).map(s => {
                const v = draft[s.key];
                const changed = v !== s.default;
                return (
                  <div key={s.key} className={`${CARD} px-3.5 py-3 space-y-2.5`}>
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-base font-semibold text-gray-900 dark:text-white leading-snug">{s.label}</p>
                      {changed && <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">Changed</span>}
                    </div>
                    {s.type === "bool" ? (
                      <div className="flex gap-1.5">
                        <Chip on={v === true} onClick={() => set(s.key, true)}>On</Chip>
                        <Chip on={v === false} onClick={() => set(s.key, false)}>Off</Chip>
                      </div>
                    ) : (
                      <Stepper value={v} onChange={x => set(s.key, x)} min={s.min} max={s.max} step={s.step}
                        format={x => <>{x}<span className="text-sm font-normal text-gray-500"> {s.unit}</span></>} />
                    )}
                    {s.help && <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{s.help}</p>}
                    <p className={TYPE_META}>App default: {formatSetting(s, s.default)} · {s.nice}</p>
                  </div>
                );
              })}
            </section>
          ))}
          <button type="button" onClick={() => setDraft({ ...UNIT_DEFAULTS })} className={`${BTN} ${BTN_SECONDARY} w-full`}>
            Reset all to app defaults
          </button>
          <p className={TYPE_META}>Decision aid only. Clinical responsibility remains with the treating clinician. Each phone keeps its own settings, so set up every phone your unit uses.</p>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pt-3">
          <button type="button" disabled={!dirty} onClick={() => onSave(draft)} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
            {dirty ? "Save unit settings" : "No changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
