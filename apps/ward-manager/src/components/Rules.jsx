import { useMemo, useState } from "react";
import Sheet from "../ui/Sheet";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT, TYPE_DISPLAY, TYPE_META, TYPE_OVERLINE } from "../ui/styles";
import { IconBack, IconChevron } from "../ui/icons";
import { RULES, RULE_FOR_ALERT, RULE_GROUPS } from "../data/ruleCatalogue";
import { SOURCES, SOURCES_ACCESSED } from "../data/sources";
import { UNIT_SETTINGS, formatSetting, getUnitSettings, saveUnitSettings } from "../data/unitSettings";
import { Chip, Stepper } from "../ui/atoms";

const DISCLAIMER = "Decision aid only. Clinical responsibility remains with the treating clinician.";

function sourceLabel(key) {
  const s = SOURCES[key];
  if (!s) return key;
  if (s.issuer === "NICE") return `NICE ${key}`;
  if (s.issuer === "RCOG") return `RCOG ${s.doc}`;
  return `${s.doc} local: ${key.split(" ").slice(1).join(" ")}`;
}

function SourceChip({ k, onSource }) {
  return (
    <button type="button" onClick={() => onSource(k)}
      className="min-h-9 px-2.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 active:scale-95 bg-claude-50 dark:bg-claude-950/40 border-claude-200 dark:border-claude-800 text-claude-800 dark:text-claude-300">
      {sourceLabel(k)} <IconChevron className="w-3 h-3" />
    </button>
  );
}

/** One unit setting, changeable right here on the rule card. */
function SettingLine({ s, onSaved }) {
  const v = getUnitSettings()[s.key];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(v);
  const save = () => {
    saveUnitSettings({ ...getUnitSettings(), [s.key]: draft });
    setEditing(false);
    onSaved?.(s);
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <p className="flex-1 text-xs leading-snug text-gray-700 dark:text-gray-300">
          <span className="font-semibold">This phone: </span>{s.label} <span className="font-semibold">{formatSetting(s, v)}</span>
          {v === s.default ? " (app default)" : <span className="font-semibold text-amber-700 dark:text-amber-400"> (changed from {formatSetting(s, s.default)})</span>}
        </p>
        {!editing && (
          <button type="button" onClick={() => { setDraft(v); setEditing(true); }} aria-label={`Change: ${s.label}`}
            className="shrink-0 min-h-8 px-2.5 rounded-lg border border-claude-200 dark:border-claude-800 text-xs font-semibold text-claude-700 dark:text-claude-400">Change</button>
        )}
      </div>
      {editing && (
        <div className="space-y-2 pb-1">
          {s.type === "bool" ? (
            <div className="flex gap-1.5">
              <Chip small on={draft === true} onClick={() => setDraft(true)}>On</Chip>
              <Chip small on={draft === false} onClick={() => setDraft(false)}>Off</Chip>
            </div>
          ) : (
            <Stepper value={draft} onChange={setDraft} min={s.min} max={s.max} step={s.step}
              format={x => <>{x}<span className="text-sm font-normal text-gray-500"> {s.unit}</span></>} />
          )}
          <p className={TYPE_META}>App default: {formatSetting(s, s.default)} · {s.nice}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(false)} className={`${BTN} ${BTN_SECONDARY} flex-1 !min-h-10`}>Cancel</button>
            <button type="button" onClick={save} disabled={draft === v} className={`${BTN} ${BTN_PRIMARY} flex-1 !min-h-10`}>Save for this phone</button>
          </div>
        </div>
      )}
    </div>
  );
}

/** What this phone is set to, for rules a unit can change. */
function SettingLines({ keys, onSettings, onSettingSaved }) {
  const defs = keys.map(k => UNIT_SETTINGS.find(s => s.key === k)).filter(Boolean);
  return (
    <div className="rounded-lg px-2.5 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-2">
      {defs.map(s => <SettingLine key={s.key} s={s} onSaved={onSettingSaved} />)}
      {onSettings && (
        <button type="button" onClick={onSettings} className="min-h-8 text-xs font-semibold text-claude-700 dark:text-claude-400 underline decoration-dotted underline-offset-2">
          All unit settings
        </button>
      )}
    </div>
  );
}

function RuleBody({ rule, onSource, onSettings, onSettingSaved }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug"><span className="font-semibold">When: </span>{rule.when}</p>
      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug"><span className="font-semibold">Then: </span>{rule.then}</p>
      {rule.severity !== "n/a" && <p className={TYPE_META}>Alert level: {rule.severity}</p>}
      {rule.local && (
        <p className="rounded-lg px-2.5 py-2 text-xs leading-snug bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
          <span className="font-semibold">{rule.group === "Scope" || rule.group === "Board" ? "App design choice: " : "Local, verify against your protocol: "}</span>{(t => t.charAt(0).toUpperCase() + t.slice(1))(rule.local.replace(/^App (scope decision|design choice)[:,]?\s*/, ""))}
        </p>
      )}
      {rule.settings?.length > 0 && <SettingLines keys={rule.settings} onSettings={onSettings} onSettingSaved={onSettingSaved} />}
      {rule.sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {rule.sources.map(k => <SourceChip key={k} k={k} onSource={onSource} />)}
        </div>
      )}
    </div>
  );
}

/** Pop-up with the exact guideline wording and a link to the source page. */
export function SourceSheet({ sourceKey, onClose }) {
  const s = SOURCES[sourceKey];
  if (!s) return null;
  const isNice = s.issuer === "NICE";
  return (
    <Sheet open onClose={onClose} title={`${s.issuer === "Local" ? "" : `${s.issuer} `}${s.doc} · ${s.rec}`} sub={s.docTitle}
      footer={s.url && (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${BTN} ${BTN_PRIMARY} w-full`}>
          Open on the {isNice ? "NICE" : s.issuer} website
        </a>
      )}>
      <blockquote className="border-l-4 border-claude-400 dark:border-claude-700 pl-3 text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-line">
        {s.text}
      </blockquote>
      <p className={TYPE_META}>
        {isNice
          ? `Copied word for word from the NICE website on ${SOURCES_ACCESSED}. If NICE has updated the guideline since, the linked page is authoritative.`
          : s.issuer === "Local"
            ? "Local guideline text as held in Pocket O&G. Check your trust intranet for the current version."
            : s.note ?? "Check the full guideline."}
      </p>
    </Sheet>
  );
}

/** Pop-up for one alert: the rule behind it and its sources. */
export function RuleSheet({ alertId, onSource, onAll, onSettings, onSettingSaved, onClose }) {
  const rule = RULE_FOR_ALERT[alertId];
  if (!rule) return null;
  return (
    <Sheet open onClose={onClose} title={rule.title} sub={`Rule behind this alert · ${rule.group}`}
      footer={<button type="button" onClick={onAll} className={`${BTN} ${BTN_SECONDARY} w-full`}>All rules and sources</button>}>
      <RuleBody rule={rule} onSource={onSource} onSettings={onSettings} onSettingSaved={onSettingSaved} />
      <p className={TYPE_META}>{DISCLAIMER}</p>
    </Sheet>
  );
}

/** Full-screen list of every rule the board applies, grouped by topic. */
export default function RulesPage({ onClose, onSource, onSettings, onSettingSaved }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return RULES;
    return RULES.filter(r => [r.title, r.when, r.then, r.local ?? "", ...r.sources, ...r.alertIds].join(" ").toLowerCase().includes(needle));
  }, [q]);
  const counts = useMemo(() => ({
    rules: RULES.length,
    local: RULES.filter(r => r.local).length,
    sources: new Set(RULES.flatMap(r => r.sources)).size,
  }), []);

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-gray-950 overflow-y-auto overscroll-contain" role="dialog" aria-label="Rules and sources">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pb-3">
          <div className="flex items-start gap-3">
            <button type="button" onClick={onClose} aria-label="Back to board"
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-claude-700 dark:text-claude-400 active:scale-95"><IconBack /></button>
            <div className="flex-1 min-w-0">
              <h2 className={TYPE_DISPLAY}>Rules and sources</h2>
              <p className={`${TYPE_META} mt-0.5`}>{counts.rules} rules · {counts.sources} guideline sources · {counts.local} with a local element</p>
            </div>
          </div>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search rules, e.g. oxytocin, GBS, 1.8.19"
            aria-label="Search rules" className={`${INPUT} w-full mt-3`} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-4 space-y-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
        {!q && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
            Every alert the board can raise, what sets it off, and the guideline it comes from. Tap a source to read the exact wording and open the page it was taken from. Amber notes mark numbers that are local choices rather than national guidance; where your unit can set them, the card shows what this phone is set to.
          </p>
        )}
        {RULE_GROUPS.map(g => {
          const rules = shown.filter(r => r.group === g);
          if (!rules.length) return null;
          return (
            <section key={g} className="space-y-2">
              <h3 className={TYPE_OVERLINE}>{g}</h3>
              {rules.map(r => (
                <article key={r.id} className={`${CARD} px-3.5 py-3 space-y-2`}>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{r.title}</h4>
                  <RuleBody rule={r} onSource={onSource} onSettings={onSettings} onSettingSaved={onSettingSaved} />
                </article>
              ))}
            </section>
          );
        })}
        {!shown.length && <p className={`${TYPE_META} text-center`}>No rules match "{q}".</p>}
        <p className={TYPE_META}>{DISCLAIMER} NICE text accessed {SOURCES_ACCESSED}.</p>
      </div>
    </div>
  );
}
