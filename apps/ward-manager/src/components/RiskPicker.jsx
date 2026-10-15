import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Label } from "../ui/atoms";
import { BTN, BTN_PRIMARY, CARD, INPUT, TYPE_DISPLAY, TYPE_META, TYPE_OVERLINE } from "../ui/styles";
import { IconBack, IconChevron, IconPlus, IconTick, IconX } from "../ui/icons";
import { RISK_FLAGS, RISK_GROUPS, riskShort } from "../utils/bedModel";

// What a ticked risk does, shown beside each option so it is clear which
// ones change alerts and which are only recorded.
const EFFECT_TAG = {
  alert: { text: "alert", cls: "bg-claude-50 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300" },
  CTG: { text: "CTG", cls: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  handover: { text: "handover", cls: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" },
};

// Extra words people type when searching, beyond each risk's label and short form.
const KEYWORDS = {
  "Infection suspected": "chorio chorioamnionitis sepsis pyrexia fever",
  "Previous LSCS": "caesarean cs lscs vbac section",
  "Hypertensive": "htn hypertension bp",
  "Pre-eclampsia": "pet pre-eclampsia",
  "Liquor volume": "poly polyhydramnios oligo anhydramnios",
  "APH": "aph bleed bleeding haemorrhage",
  "Previous OASI": "tear oasi 3rd 4th",
  "Previous shoulder dystocia": "sd dystocia",
  "Reduced fetal movements": "rfm movements",
  "FGR": "fgr sga growth iugr",
  "Non-cephalic": "breech transverse oblique",
};

function Row({ label, effect, on, onToggle }) {
  const tag = effect && EFFECT_TAG[effect];
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onToggle}
      className="w-full min-h-12 px-3 flex items-center gap-3 text-left active:bg-gray-100 dark:active:bg-gray-900">
      <span className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center ${on ? "bg-claude-600 border-claude-600 text-white" : "border-gray-300 dark:border-gray-600"}`}>
        {on && <IconTick className="w-3 h-3" />}
      </span>
      <span className="flex-1 min-w-0 text-sm text-gray-900 dark:text-gray-100 leading-snug">{label}</span>
      {tag && <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${tag.cls}`}>{tag.text}</span>}
    </button>
  );
}

/** Full-screen risks page, opened from the Admit or Edit sheet. */
function RisksPage({ values, onChange, onClose }) {
  const [q, setQ] = useState("");
  // Escape closes only this page, not the Admit sheet underneath (which would
  // lose what has been entered).
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  const toggle = v => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  const custom = values.filter(v => !RISK_FLAGS.includes(v));
  const needle = q.trim().toLowerCase();
  const groups = useMemo(() => RISK_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(i => !needle || `${i.value} ${i.label} ${i.short} ${KEYWORDS[i.value] ?? ""}`.toLowerCase().includes(needle)),
  })).filter(g => g.items.length), [needle]);
  const typed = q.trim();
  const canAdd = typed && !values.includes(typed) && !RISK_FLAGS.some(v => v.toLowerCase() === typed.toLowerCase());
  const addTyped = () => { if (canAdd) onChange([...values, typed]); setQ(""); };

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-950 flex flex-col" role="dialog" aria-label="Risks">
      <div className="shrink-0 border-b border-gray-200 dark:border-gray-800" style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pb-3 space-y-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} aria-label="Back to admission"
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-claude-700 dark:text-claude-400 active:scale-95"><IconBack /></button>
            <h2 className={`${TYPE_DISPLAY} flex-1`}>Risks</h2>
            <span className={TYPE_META}>{values.length ? `${values.length} ticked` : "None ticked"}</span>
          </div>
          <input id="risk-search" type="search" value={q} onChange={e => setQ(e.target.value)} maxLength={40}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTyped(); } }}
            placeholder="Search, e.g. breech, PET, GBS" aria-label="Search risks" className={INPUT} />
          {canAdd && (
            <button type="button" onClick={addTyped}
              className="w-full min-h-11 rounded-xl border border-dashed border-claude-300 dark:border-claude-800 text-sm font-semibold text-claude-700 dark:text-claude-400 flex items-center justify-center gap-1.5">
              <IconPlus className="w-4 h-4" /> Add "{typed}" as another risk
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto px-5 py-4 space-y-5">
          {custom.length > 0 && (
            <section>
              <h3 className={`${TYPE_OVERLINE} mb-1.5`}>Added by you</h3>
              <div className={`${CARD} overflow-hidden divide-y divide-gray-200 dark:divide-gray-800`}>
                {custom.map(v => <Row key={v} label={v} effect="handover" on onToggle={() => toggle(v)} />)}
              </div>
            </section>
          )}
          {groups.map(g => (
            <section key={g.group}>
              <h3 className={`${TYPE_OVERLINE} mb-1.5`}>{g.group}</h3>
              <div className={`${CARD} overflow-hidden divide-y divide-gray-200 dark:divide-gray-800`}>
                {g.items.map(i => <Row key={i.value} label={i.label} effect={i.effect} on={values.includes(i.value)} onToggle={() => toggle(i.value)} />)}
              </div>
            </section>
          ))}
          {!groups.length && !canAdd && <p className={`${TYPE_META} text-center`}>Already added.</p>}
          <p className={TYPE_META}>ALERT raises its own alert. CTG counts as a continuous CTG indication. HANDOVER is recorded only. No names or identifiers.</p>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pt-3">
          <button type="button" onClick={onClose} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>Done</button>
        </div>
      </div>
    </div>
  );
}

/** Risks row on the Admit sheet: one tap opens the risks page. */
export default function RiskPicker({ values, onChange }) {
  const [open, setOpen] = useState(false);
  const toggle = v => onChange(values.filter(x => x !== v));
  return (
    <div>
      <Label hint="optional">Risks</Label>
      <button type="button" onClick={() => setOpen(true)}
        className={`${INPUT} flex items-center justify-between text-left`}>
        <span className={values.length ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-400"}>
          {values.length ? `${values.length} ticked · change` : "Add risks"}
        </span>
        <IconChevron className="w-4 h-4 text-gray-500" />
      </button>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {values.map(v => (
            <button key={v} type="button" onClick={() => toggle(v)} aria-label={`Remove ${v}`}
              className="min-h-8 pl-2.5 pr-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 bg-claude-50 dark:bg-claude-950/40 border-claude-200 dark:border-claude-800 text-claude-800 dark:text-claude-300">
              {riskShort(v)} <IconX className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
      {/* Portal: the sheet's slide-in transform would otherwise trap this full-screen page inside it. */}
      {open && createPortal(<RisksPage values={values} onChange={onChange} onClose={() => setOpen(false)} />, document.body)}
    </div>
  );
}
