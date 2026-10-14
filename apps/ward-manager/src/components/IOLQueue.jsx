import { useState } from "react";
import Sheet from "../ui/Sheet";
import { Chip, Label, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT, TYPE_META } from "../ui/styles";
import { IconInfo, IconPlus } from "../ui/icons";
import { fmtAge, hhmm, resolveWhen, whenFromISO } from "../utils/time";
import { IOL_IND, iolEntryTier, sortIOLQueue } from "../utils/iolPriority";
import { newId } from "../utils/bedModel";

const TIERS = [
  { label: "Urgent", action: "Deliver within hours: escalate now", badge: "bg-red-600 text-white", bar: "bg-red-500", text: "text-red-700 dark:text-red-400" },
  { label: "High", action: "Expedite: aim to start today", badge: "bg-claude-600 text-white", bar: "bg-claude-600", text: "text-claude-700 dark:text-claude-400" },
  { label: "Moderate", action: "Plan: prioritise within the week", badge: "bg-claude-100 dark:bg-claude-950/50 text-claude-800 dark:text-claude-300", bar: "bg-claude-300", text: "text-claude-700 dark:text-claude-400" },
  { label: "Routine", action: "Schedule in the usual order", badge: "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300", bar: "bg-transparent", text: "text-gray-500 dark:text-gray-400" },
];

export function IOLEntrySheet({ entry = null, onSave, onClose }) {
  const [initials, setInitials] = useState(entry?.initials ?? "");
  const [weeks, setWeeks] = useState(entry?.gestWeeks ?? 40);
  const [days, setDays] = useState(entry?.gestDays ?? 0);
  const [inds, setInds] = useState(entry?.indications ?? []);
  const [when, setWhen] = useState(entry ? whenFromISO(entry.addedAt) : { minsAgo: 0 });
  const iso = resolveWhen(when);
  const ok = initials.trim() && inds.length && iso;
  const toggle = l => setInds(p => (p.includes(l) ? p.filter(x => x !== l) : [...p, l]));

  return (
    <Sheet open onClose={onClose} title={entry ? "Edit IOL entry" : "Add to IOL queue"} sub="NICE NG207 · Inducing labour"
      footer={
        <button type="button" disabled={!ok} onClick={() => ok && onSave({ id: entry?.id ?? newId("iol"), addedAt: iso, initials: initials.trim().toUpperCase(), gestWeeks: weeks, gestDays: days, indications: inds })}
          className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>{ok ? (entry ? "Save changes" : "Add to queue") : "Initials and at least one indication"}</button>
      }>
      <div>
        <Label>Initials</Label>
        <input value={initials} onChange={e => setInitials(e.target.value)} maxLength={4} placeholder="JB"
          className={`${INPUT} text-center text-xl font-semibold uppercase tracking-widest`} aria-label="Initials" />
      </div>
      <div>
        <Label>Gestation</Label>
        <Stepper value={weeks} onChange={setWeeks} min={24} max={42} format={w => `${w}+${days}`} />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[0, 1, 2, 3, 4, 5, 6].map(d => <Chip key={d} small on={days === d} onClick={() => setDays(d)}>+{d}</Chip>)}
        </div>
      </div>
      <div>
        <Label hint="select all that apply">Indication</Label>
        <div className="space-y-2">
          {TIERS.map((tier, k) => (
            <div key={tier.label}>
              <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${tier.text}`}>{tier.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {IOL_IND.filter(i => i.tier === k).map(i => <Chip key={i.label} small on={inds.includes(i.label)} onClick={() => toggle(i.label)}>{i.label}</Chip>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <WhenPicker label="Time queued" value={when} onChange={setWhen} presets={[0, 60, 120, 240]} />
    </Sheet>
  );
}

export function IOLReference({ onClose }) {
  return (
    <Sheet open onClose={onClose} title="IOL priority" sub="NICE NG207 · Inducing labour">
      <p className={TYPE_META}>Within each tier, higher gestation goes first, then the longest wait.</p>
      {TIERS.map((tier, k) => (
        <div key={tier.label} className={`${CARD} px-3 py-2.5 space-y-1.5`}>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${tier.badge}`}>{tier.label}</span>
            <span className={`text-xs font-medium ${tier.text}`}>{tier.action}</span>
          </div>
          {IOL_IND.filter(i => i.tier === k).map(i => (
            <div key={i.label} className="flex justify-between gap-2 text-sm">
              <span className="text-gray-800 dark:text-gray-200">{i.label}</span>
              {i.cite && <span className={TYPE_META}>{i.cite}</span>}
            </div>
          ))}
        </div>
      ))}
      <p className={`${TYPE_META} text-center`}>Decision aid only. Clinical responsibility remains with the treating clinician.</p>
    </Sheet>
  );
}

export default function IOLQueue({ queue, now, onAdd, onEdit, onAdmit, onRemove }) {
  const [showRef, setShowRef] = useState(false);
  const sorted = sortIOLQueue(queue);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onAdd} className={`${BTN} ${BTN_PRIMARY} flex-1`}><IconPlus /> Add to queue</button>
        <button type="button" onClick={() => setShowRef(true)} className={`${BTN} ${BTN_SECONDARY}`}><IconInfo /> Priority</button>
      </div>
      {sorted.length === 0 && <p className={`${TYPE_META} text-center py-10`}>No women queued for induction.</p>}
      {sorted.map((e, idx) => {
        const tier = TIERS[iolEntryTier(e)];
        const cites = [...new Set(e.indications.map(l => IOL_IND.find(i => i.label === l)?.cite).filter(Boolean))].join(" · ");
        return (
          <div key={e.id} className={`${CARD} flex overflow-hidden`}>
            <span className={`w-1 shrink-0 ${tier.bar}`} />
            <div className="flex-1 min-w-0 px-3 py-2.5 space-y-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{e.initials}</span>
                <span className={TYPE_META}>{e.gestWeeks}+{e.gestDays ?? 0}</span>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${tier.badge}`}>{tier.label}</span>
                <span className={`${TYPE_META} ml-auto`}>{hhmm(e.addedAt)} · {fmtAge(now - new Date(e.addedAt).getTime())} ago</span>
              </div>
              <p className={`text-xs font-medium ${tier.text}`}>{tier.action}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{e.indications.join(" · ")}</p>
              {cites && <p className={TYPE_META}>{cites}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => onAdmit(e)} className={`${BTN} ${BTN_PRIMARY} flex-1 min-h-10`}>Admit to ward</button>
                <button type="button" onClick={() => onEdit(e)} className={`${BTN} ${BTN_SECONDARY} min-h-10`}>Edit</button>
                <button type="button" onClick={() => onRemove(e)} className={`${BTN} ${BTN_SECONDARY} min-h-10`}>Remove</button>
              </div>
            </div>
          </div>
        );
      })}
      {sorted.length > 0 && <p className={`${TYPE_META} text-center`}>Priority order per NICE NG207. Decision aid only.</p>}
      {showRef && <IOLReference onClose={() => setShowRef(false)} />}
    </div>
  );
}
