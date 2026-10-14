import { useState } from "react";
import Sheet from "../ui/Sheet";
import { ChipRow, Label, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, INPUT } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import { DELIVERY_MODES } from "../utils/bedModel";

const EBL_PRESETS = [200, 350, 500, 1000, 1500];

export default function DeliverySheet({ bed, onSave, onClose }) {
  const ex = bed.delivery ?? null;
  const [mode, setMode] = useState(ex?.mode ?? null);
  const [ebl, setEbl] = useState(ex?.ebl != null ? String(ex.ebl) : "");
  const [notes, setNotes] = useState(ex?.notes ?? "");
  const [when, setWhen] = useState(ex ? whenFromISO(ex.time) : { minsAgo: 0 });
  const iso = resolveWhen(when);
  const eblNum = ebl === "" ? null : Number(ebl);

  const save = () => mode && iso && onSave({ time: iso, mode, ebl: Number.isFinite(eblNum) ? eblNum : null, notes: notes.trim() || null });

  return (
    <Sheet open onClose={onClose}
      title={`${ex ? "Delivery record" : "Delivered"} · Bed ${bed.bedNumber}`}
      footer={
        <button type="button" onClick={save} disabled={!mode || !iso} className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {mode ? (ex ? "Save changes" : `Save · ${mode}`) : "Pick a mode"}
        </button>
      }>
      <div>
        <Label>Mode</Label>
        <ChipRow options={DELIVERY_MODES} value={mode} onChange={setMode} />
      </div>
      <div>
        <Label hint="add later if not known">EBL (mL)</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <ChipRow options={EBL_PRESETS} value={eblNum} onChange={v => setEbl(String(v))} />
        </div>
        <input type="number" inputMode="numeric" value={ebl} onChange={e => setEbl(e.target.value)} placeholder="Or type exact mL" className={INPUT} aria-label="EBL in mL" />
        {eblNum >= 1000 && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5">Major PPH (1000 mL or more): follow the PPH protocol.</p>}
        {eblNum >= 500 && eblNum < 1000 && <p className="text-xs font-semibold text-claude-700 dark:text-claude-400 mt-1.5">PPH (500 mL or more): monitor closely.</p>}
      </div>
      <WhenPicker label="Time of birth" value={when} onChange={setWhen} />
      <div>
        <Label>Notes (optional)</Label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. shoulder dystocia, perineal tear"
          className={`${INPUT} h-auto py-2.5 resize-none`} />
      </div>
    </Sheet>
  );
}
