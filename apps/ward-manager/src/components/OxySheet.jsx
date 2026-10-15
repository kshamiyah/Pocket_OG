import { useState } from "react";
import Sheet from "../ui/Sheet";
import { Label, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY } from "../ui/styles";
import { clock, resolveWhen } from "../utils/time";
import { currentOxytocin, newId } from "../utils/bedModel";

const PROTOCOL = [
  "Start 1 to 2 mU/min, increase by 1 to 2 mU every 30 min minimum",
  "Target 3 to 4 contractions in 10 min, each 40 to 60 sec",
  "Maximum 20 mU/min: escalate to the registrar at maximum",
  "Do not routinely use in the 2nd stage with regional analgesia",
];

export default function OxySheet({ bed, onSave, onClose }) {
  const current = currentOxytocin(bed);
  const [dose, setDose] = useState(current?.dose ?? 2);
  const [when, setWhen] = useState({ minsAgo: 0 });
  const iso = resolveWhen(when);

  return (
    <Sheet open onClose={onClose} title={`Oxytocin · Bed ${bed.bedNumber}`} sub="NICE NG235 §1.5.6 · verify against local protocol"
      footer={
        <button type="button" disabled={!iso} onClick={() => iso && onSave({ id: newId("ox"), startTime: iso, dose, lastIncrementTime: iso })}
          className={`${BTN} ${BTN_PRIMARY} w-full min-h-[3.25rem] text-base`}>
          {current ? `Log dose change · ${dose} mU/min` : `Start at ${dose} mU/min`}
        </button>
      }>
      {current && (
        <p className="text-sm text-gray-700 dark:text-gray-300">Current: <b>{current.dose} mU/min</b> since {clock(current.lastIncrementTime ?? current.startTime)}</p>
      )}
      <div>
        <Label>Dose (mU/min)</Label>
        <Stepper value={dose} onChange={setDose} min={1} max={20} valueClass={dose >= 20 ? "text-red-600 dark:text-red-400" : ""} />
        {dose >= 20 && <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center mt-1.5">Maximum dose: escalate to the registrar.</p>}
      </div>
      <WhenPicker label="Time of change" value={when} onChange={setWhen} />
      <ul className="rounded-xl border bg-claude-50 dark:bg-claude-950/30 border-claude-200 dark:border-claude-800 px-3 py-2.5 space-y-1">
        {PROTOCOL.map(p => <li key={p} className="text-xs text-claude-900 dark:text-claude-200 leading-snug">{p}</li>)}
      </ul>
    </Sheet>
  );
}
