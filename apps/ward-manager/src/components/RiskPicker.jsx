import { useState } from "react";
import { Label } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, INPUT, TYPE_META, TYPE_OVERLINE } from "../ui/styles";
import { IconChevron, IconTick, IconX } from "../ui/icons";
import { RISK_FLAGS, RISK_GROUPS, riskShort } from "../utils/bedModel";

// What a ticked risk does, shown beside each option so it is clear which
// ones change alerts and which are only recorded.
const EFFECT_TAG = {
  alert: { text: "alert", cls: "bg-claude-50 dark:bg-claude-950/40 text-claude-800 dark:text-claude-300" },
  CTG: { text: "CTG", cls: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  handover: { text: "handover", cls: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" },
};

function Row({ label, effect, on, onToggle }) {
  const tag = effect && EFFECT_TAG[effect];
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onToggle}
      className="w-full min-h-11 px-2 -mx-2 rounded-lg flex items-center gap-3 text-left active:bg-gray-100 dark:active:bg-gray-900">
      <span className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center ${on ? "bg-claude-600 border-claude-600 text-white" : "border-gray-300 dark:border-gray-600"}`}>
        {on && <IconTick className="w-3 h-3" />}
      </span>
      <span className="flex-1 min-w-0 text-sm text-gray-900 dark:text-gray-100 leading-snug">{label}</span>
      {tag && <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${tag.cls}`}>{tag.text}</span>}
    </button>
  );
}

/** Risk flags as a dropdown checklist, grouped, with free-text "Other" risks. */
export default function RiskPicker({ values, onChange }) {
  const [open, setOpen] = useState(false);
  const [other, setOther] = useState("");
  const toggle = v => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  const custom = values.filter(v => !RISK_FLAGS.includes(v));
  const addOther = () => {
    const v = other.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setOther("");
  };

  return (
    <div>
      <Label hint="optional">Risks</Label>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className={`${INPUT} flex items-center justify-between text-left`}>
        <span className={values.length ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-400"}>
          {values.length ? `${values.length} ticked` : "None ticked"}
        </span>
        <IconChevron className={`w-4 h-4 text-gray-500 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
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

      {open && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-3 space-y-4">
          <p className={TYPE_META}>Tick all that apply. Tags show what each does: raises an <b>alert</b>, counts as a <b>CTG</b> indication, or is recorded for <b>handover</b>.</p>
          {RISK_GROUPS.map(g => (
            <div key={g.group}>
              <p className={`${TYPE_OVERLINE} mb-0.5`}>{g.group}</p>
              {g.items.map(i => <Row key={i.value} label={i.label} effect={i.effect} on={values.includes(i.value)} onToggle={() => toggle(i.value)} />)}
            </div>
          ))}
          <div>
            <p className={`${TYPE_OVERLINE} mb-1`}>Other</p>
            {custom.map(v => <Row key={v} label={v} effect="handover" on onToggle={() => toggle(v)} />)}
            <div className="flex gap-2 mt-1">
              <input id="risk-other" value={other} onChange={e => setOther(e.target.value)} maxLength={40}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOther(); } }}
                placeholder="Type another risk" aria-label="Other risk" className={`${INPUT} flex-1`} />
              <button type="button" onClick={addOther} disabled={!other.trim()} className={`${BTN} ${BTN_SECONDARY}`}>Add</button>
            </div>
            <p className={`${TYPE_META} mt-1`}>No names or identifiers.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className={`${BTN} ${BTN_PRIMARY} w-full`}>Done</button>
        </div>
      )}
    </div>
  );
}
