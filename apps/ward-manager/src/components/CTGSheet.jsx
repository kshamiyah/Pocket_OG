import { useMemo, useState } from "react";
import Sheet from "../ui/Sheet";
import { Chip, ChipRow, Label, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, CTG_BOX, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import { classifyCTGEntry } from "../utils/wardAlerts";
import { newId } from "../utils/bedModel";
import { CTG_DESC } from "../utils/ctgText";

export default function CTGSheet({ bed, editCTG = null, onSave, onClose }) {
  const log = bed.ctgLog ?? [];
  // Quick "CTG normal" entries carry no features, so look back for the last full review.
  const prev = (editCTG ? log.filter(e => e.id !== editCTG.id) : log).filter(e => e.baselineHR != null).at(-1) ?? null;
  const prevHR = prev?.baselineHR ?? null;

  const [when, setWhen] = useState(editCTG ? whenFromISO(editCTG.time) : { minsAgo: 0 });
  const [hr, setHR] = useState(editCTG?.baselineHR ?? prevHR ?? 140);
  const [vari, setVari] = useState(editCTG?.variability ?? "5-25");
  const [varMin, setVarMin] = useState(editCTG?.variabilityMinutes ?? 0);
  const [dec, setDec] = useState(editCTG?.decelerations ?? "none");
  const [decMin, setDecMin] = useState(editCTG?.decelerationMinutes ?? 0);
  const [accel, setAccel] = useState(editCTG?.accelerations ?? true);
  const [ctx, setCtx] = useState(editCTG?.contractionsPerTen ?? 3);

  const entry = { baselineHR: hr, variability: vari, variabilityMinutes: varMin, decelerations: dec, decelerationMinutes: decMin, accelerations: accel, contractionsPerTen: ctx };
  const cat = useMemo(() => classifyCTGEntry(entry, prevHR), [hr, vari, varMin, dec, decMin, accel, ctx, prevHR]); // eslint-disable-line react-hooks/exhaustive-deps
  const iso = resolveWhen(when);
  const rise = prevHR != null ? hr - prevHR : 0;
  const hrTone = hr < 100 || hr > 160 ? "text-red-600 dark:text-red-400" : hr < 110 ? "text-claude-700 dark:text-claude-400" : "";

  const save = () => iso && onSave({ id: editCTG?.id ?? newId("ctg"), time: iso, ...entry, classification: cat });

  return (
    <Sheet open onClose={onClose}
      title={`${editCTG ? "Edit CTG review" : "CTG review"} · Bed ${bed.bedNumber}`}
      sub="NICE NG229 · Fetal monitoring in labour"
      footer={
        <button type="button" onClick={save} disabled={!iso}
          className={`${BTN} w-full min-h-[3.25rem] text-base ${cat === "pathological" ? "bg-red-600 text-white" : BTN_PRIMARY}`}>
          {editCTG ? "Save changes" : `Log ${cat} CTG`}
        </button>
      }>
      <div className={`rounded-xl border px-3 py-2.5 ${CTG_BOX[cat]}`}>
        <p className="text-base font-semibold capitalize">{cat}</p>
        <p className="text-sm opacity-90 leading-snug">{CTG_DESC[cat]}</p>
      </div>

      <div>
        <Label hint={prevHR != null ? `last ${prevHR} bpm${rise >= 20 ? `, up ${rise}` : ""}` : undefined}>Baseline (bpm)</Label>
        <Stepper value={hr} onChange={setHR} min={60} max={220} bigStep={10} valueClass={hrTone} />
      </div>

      <div>
        <Label>Variability</Label>
        <ChipRow small value={vari} onChange={v => { setVari(v); setVarMin(0); }}
          options={[{ value: "5-25", label: "5 to 25" }, { value: "<5", label: "Under 5" }, { value: ">25", label: "Over 25" }, { value: "sinusoidal", label: "Sinusoidal" }]} />
        {vari === "<5" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Chip small on={varMin < 30} onClick={() => setVarMin(15)}>Under 30 min</Chip>
            <Chip small on={varMin >= 30 && varMin <= 50} onClick={() => setVarMin(40)}>30 to 50 min</Chip>
            <Chip small on={varMin > 50} onClick={() => setVarMin(60)}>Over 50 min</Chip>
          </div>
        )}
        {vari === ">25" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Chip small on={varMin <= 10} onClick={() => setVarMin(5)}>Up to 10 min</Chip>
            <Chip small on={varMin > 10} onClick={() => setVarMin(15)}>Over 10 min</Chip>
          </div>
        )}
      </div>

      <div>
        <Label>Decelerations</Label>
        <ChipRow small value={dec} onChange={v => { setDec(v); setDecMin(0); }}
          options={[
            { value: "none", label: "None" }, { value: "early", label: "Early" }, { value: "variable", label: "Variable" },
            { value: "variable-concerning", label: "Variable, concerning" }, { value: "late", label: "Late" }, { value: "prolonged", label: "Prolonged, 3 min+" },
          ]} />
        {dec === "variable-concerning" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Chip small on={decMin < 30} onClick={() => setDecMin(15)}>Under 30 min</Chip>
            <Chip small on={decMin >= 30} onClick={() => setDecMin(30)}>30 min or more</Chip>
          </div>
        )}
      </div>

      <div>
        <Label>Accelerations</Label>
        <ChipRow small value={accel} onChange={setAccel} options={[{ value: true, label: "Present" }, { value: false, label: "Absent" }]} />
      </div>

      <div>
        <Label hint={ctx >= 5 ? "tachysystole: see NG229" : undefined}>Contractions in 10 min</Label>
        <ChipRow small value={ctx} onChange={setCtx} options={[0, 1, 2, 3, 4, 5, 6, 7]} />
      </div>

      <WhenPicker label="Time of review" value={when} onChange={setWhen} />
      <p className={TYPE_META}>Decision aid only. Clinical responsibility remains with the treating clinician.</p>
    </Sheet>
  );
}
