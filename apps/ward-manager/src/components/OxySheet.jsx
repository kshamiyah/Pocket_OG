import { useState } from "react";
import Sheet from "../ui/Sheet";
import { Label, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, BTN_SECONDARY } from "../ui/styles";
import { clock, resolveWhen } from "../utils/time";
import { currentOxytocin, newId } from "../utils/bedModel";
import { getUnitSettings } from "../data/unitSettings";

const PROTOCOL = [
  "Increase no more often than every 30 min, until 3 to 4 contractions in 10 min (NG235 1.8.54)",
  "More than 4 in 10 min: reduce or stop until 4 or fewer (NG235 1.8.55)",
  "Pathological CTG: stop immediately and get urgent obstetric or senior midwife review (NG235 1.8.56)",
];

export default function OxySheet({ bed, onSave, onHold, onClose }) {
  const current = currentOxytocin(bed);
  const [dose, setDose] = useState(current?.dose ?? 2);
  const [when, setWhen] = useState({ minsAgo: 0 });
  const iso = resolveWhen(when);
  const held = !!bed.oxytocinHeld;
  const max = getUnitSettings().oxytocinMax;

  return (
    <Sheet open onClose={onClose} title={`Oxytocin · Bed ${bed.bedNumber}`} sub="NICE NG235 1.8.54 to 1.8.56 · local protocol for doses"
      footer={
        <div className="space-y-2">
          <button type="button" disabled={!iso} onClick={() => iso && onSave({ id: newId("ox"), startTime: iso, dose, lastIncrementTime: iso })}
            className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
            {current ? `Log dose change · ${dose} mU/min` : `Start at ${dose} mU/min`}
          </button>
          {current && (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => onHold(!held)} className={`${BTN} ${BTN_SECONDARY} whitespace-nowrap`}>
                {held ? "Release hold" : "Hold at this dose"}
              </button>
              <button type="button" disabled={!iso}
                onClick={() => iso && onSave({ id: newId("ox"), startTime: iso, dose: 0, stopped: true, lastIncrementTime: iso })}
                className={`${BTN} whitespace-nowrap bg-red-600 text-white`}>
                Stop oxytocin
              </button>
            </div>
          )}
        </div>
      }>
      {current && (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Current: <b>{current.dose} mU/min</b> since {clock(current.lastIncrementTime ?? current.startTime)}
          {held && <span className="text-claude-800 dark:text-claude-300 font-semibold">, held (no increase prompts)</span>}
        </p>
      )}
      <div>
        <Label>Dose (mU/min)</Label>
        <Stepper value={dose} onChange={setDose} min={1} max={max} valueClass={dose >= max ? "text-red-600 dark:text-red-400" : ""} />
        {dose >= max && <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center mt-1.5">Unit maximum: escalate to the registrar.</p>}
      </div>
      <WhenPicker label="Time of change" value={when} onChange={setWhen} />
      <ul className="rounded-xl border bg-claude-50 dark:bg-claude-950/30 border-claude-200 dark:border-claude-800 px-3 py-2.5 space-y-1">
        {PROTOCOL.map(p => <li key={p} className="text-xs text-claude-900 dark:text-claude-200 leading-snug">{p}</li>)}
        <li className="text-xs text-claude-900 dark:text-claude-200 leading-snug">Starting dose and step size are local protocol; maximum {max} mU/min is a unit setting</li>
      </ul>
    </Sheet>
  );
}
