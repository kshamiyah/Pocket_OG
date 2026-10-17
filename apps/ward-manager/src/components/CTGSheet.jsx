import { useMemo, useState } from "react";
import Sheet from "../ui/Sheet";
import { Chip, ChipRow, Label, Stepper, WhenPicker } from "../ui/atoms";
import { BTN, BTN_PRIMARY, CTG_BOX, INPUT, TYPE_META } from "../ui/styles";
import { resolveWhen, whenFromISO } from "../utils/time";
import { classifyCTGEntry } from "../utils/wardAlerts";
import { newId, sameAsLastCTG } from "../utils/bedModel";
import { CTG_DESC, ctgSummary } from "../utils/ctgText";

export default function CTGSheet({ bed, editCTG = null, notice = null, onSave, onClose }) {
  const log = bed.ctgLog ?? [];
  // Quick "CTG normal" entries carry no features, so look back for the last full review.
  const prev = (editCTG ? log.filter(e => e.id !== editCTG.id) : log).filter(e => e.baselineHR != null).at(-1) ?? null;
  const prevHR = prev?.baselineHR ?? null;
  // NG229 1.4.15 compares with the start of labour as well as the last review.
  const startHR = log.find(e => e.baselineHR != null && !e.baselineUndetermined && e.id !== editCTG?.id)?.baselineHR ?? null;
  const secondStage = bed.labourStage === "Active second stage";

  const [when, setWhen] = useState(editCTG ? whenFromISO(editCTG.time) : { minsAgo: 0 });
  // Nothing is pre-graded: each feature must be chosen, so a rushed entry
  // cannot log a "normal" CTG nobody looked at.
  const [hr, setHR] = useState(editCTG?.baselineHR ?? prevHR ?? 140);
  const [hrSet, setHrSet] = useState(!!editCTG);
  const [vari, setVari] = useState(editCTG?.variability ?? null);
  const [varMin, setVarMin] = useState(editCTG?.variabilityMinutes ?? 0);
  const [undetermined, setUndetermined] = useState(!!editCTG?.baselineUndetermined);
  const [dec, setDec] = useState(editCTG?.decelerations ?? null);
  const [decRep, setDecRep] = useState(editCTG?.decelerationsRepetitive ?? true);
  const [comment, setComment] = useState(editCTG?.comment ?? "");
  const [decMin, setDecMin] = useState(editCTG?.decelerationMinutes ?? 0);
  const [accel, setAccel] = useState(editCTG?.accelerations ?? null);
  // Contractions are the 4th NG229 feature: required, never guessed or carried over.
  const [ctx, setCtx] = useState(editCTG?.contractionsPerTen ?? null);
  const [hypertonus, setHypertonus] = useState(!!editCTG?.hypertonus);

  const entry = {
    baselineHR: hr, baselineUndetermined: undetermined, variability: vari, variabilityMinutes: varMin,
    decelerations: dec, decelerationsRepetitive: dec === "variable-concerning" ? decRep : undefined, decelerationMinutes: decMin,
    accelerations: accel, contractionsPerTen: ctx, hypertonus,
  };
  const autoCat = useMemo(() => classifyCTGEntry(entry, prevHR, { startBaselineHR: startHR, activeSecondStage: secondStage }), [hr, undetermined, vari, varMin, dec, decRep, decMin, accel, ctx, hypertonus, prevHR, startHR, secondStage]); // eslint-disable-line react-hooks/exhaustive-deps
  // The clinician may judge a trace pathological on the whole picture even when
  // the features grade lower; the app never downgrades.
  const [override, setOverride] = useState(!!editCTG?.clinicianOverride);
  const cat = override ? "pathological" : autoCat;
  const iso = resolveWhen(when);
  const same = !editCTG ? sameAsLastCTG(bed, new Date().toISOString()) : null;
  const rise = Math.max(prevHR != null ? hr - prevHR : 0, startHR != null ? hr - startHR : 0);
  const hrTone = undetermined || !hrSet ? "text-gray-400" : hr < 100 || hr > 160 ? "text-red-600 dark:text-red-400" : hr < 110 || rise >= 20 ? "text-claude-700 dark:text-claude-400" : "";

  const missing = [!(hrSet || undetermined) && "baseline", vari == null && "variability", dec == null && "decelerations", ctx == null && "contractions"].filter(Boolean);
  const complete = missing.length === 0;
  const ready = !!iso && complete;
  const save = () => ready && onSave({
    id: editCTG?.id ?? newId("ctg"), time: iso, ...entry, comment: comment.trim() || undefined, classification: cat,
    autoClassification: autoCat, clinicianOverride: override && autoCat !== "pathological",
  });

  return (
    <Sheet open onClose={onClose}
      title={`${editCTG ? "Edit CTG review" : "CTG review"} · Bed ${bed.bedNumber}`}
      sub="NICE NG229 · Fetal monitoring in labour"
      footer={
        <button type="button" onClick={save} disabled={!ready}
          className={`${BTN} w-full min-h-[3.25rem] text-base ${cat === "pathological" ? "bg-red-600 text-white" : BTN_PRIMARY}`}>
          {!complete ? `Grade ${missing.join(", ")} to log` : editCTG ? "Save changes" : `Log ${cat} CTG`}
        </button>
      }>
      {notice && <p className="text-sm font-semibold text-claude-800 dark:text-claude-300">{notice}</p>}
      {/* Hourly review with the fetal heart unchanged: tapping today's
          contraction count logs the same graded heart features at this time
          (only after a normal graded review, and only if it still grades
          normal). Contractions are never carried over. 5 or more, or anything
          else changed: grade the features below. */}
      {same && (
        <div className="rounded-xl border px-3 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900">
          <span className="block text-base font-bold text-emerald-900 dark:text-emerald-200">✓ Fetal heart unchanged since last review</span>
          <span className="block text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">{ctgSummary(same)}</span>
          <span className="block text-xs font-semibold text-emerald-900 dark:text-emerald-200 mt-2 mb-1.5">Contractions in 10 min now: tap to log as normal</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map(n => (
              <button key={n} type="button" aria-label={`Unchanged, ${n} ${n === 1 ? "contraction" : "contractions"} in 10 minutes`}
                onClick={() => { const e = sameAsLastCTG(bed, new Date().toISOString(), n); if (e) onSave(e); }}
                className="flex-1 min-h-[2.75rem] rounded-lg border text-base font-semibold tabular-nums bg-white dark:bg-gray-900 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 active:scale-95">
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
      {same && <p className={`${TYPE_META} text-center`}>5 or more, or anything else changed: grade it below</p>}
      {complete || override ? (
        <div className={`rounded-xl border px-3 py-2.5 ${CTG_BOX[cat]}`}>
          <p className="text-base font-semibold capitalize">{cat}</p>
          <p className="text-sm opacity-90 leading-snug">{CTG_DESC[cat]}</p>
        </div>
      ) : (
        <div className="rounded-xl border px-3 py-2.5 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Not graded yet</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">Grade each of the 4 features; the category appears when all are done.</p>
        </div>
      )}
      {complete && autoCat !== "pathological" && (
        <button type="button" onClick={() => setOverride(o => !o)} aria-pressed={override}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${override ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900" : "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"}`}>
          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-[11px] font-bold ${override ? "bg-red-600 border-red-600 text-white" : "border-gray-300 dark:border-gray-600"}`}>{override ? "✓" : ""}</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">I judge this trace pathological <span className="text-gray-500 dark:text-gray-400">(features grade it {autoCat})</span></span>
        </button>
      )}

      <div>
        <Label hint={prevHR != null ? `last ${prevHR} bpm${rise >= 20 ? `, up ${rise}${secondStage ? " (red in active 2nd stage)" : ""}` : ""}` : undefined}>Baseline (bpm)</Label>
        <Stepper value={hr} onChange={v => { setHR(v); setHrSet(true); }} min={60} max={220} bigStep={10} valueClass={hrTone} />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {!hrSet && !undetermined && <Chip small on={false} onClick={() => setHrSet(true)}>Confirm {hr} bpm</Chip>}
          <Chip small on={undetermined} onClick={() => setUndetermined(u => !u)}>Unable to determine</Chip>
        </div>
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
        <ChipRow small value={dec} onChange={v => { setDec(v); setDecMin(0); setDecRep(true); }}
          options={[
            { value: "none", label: "None" }, { value: "early", label: "Early" }, { value: "variable", label: "Variable" },
            { value: "variable-concerning", label: "Variable, concerning" }, { value: "late", label: "Late" }, { value: "prolonged", label: "Prolonged, 3 min+" },
          ]} />
        {dec === "variable-concerning" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Chip small on={decRep} onClick={() => setDecRep(true)}>Repetitive</Chip>
            <Chip small on={!decRep} onClick={() => setDecRep(false)}>Non-repetitive</Chip>
            <span className="w-px bg-gray-200 dark:bg-gray-700 mx-0.5" aria-hidden="true" />
            <Chip small on={decMin <= 30} onClick={() => setDecMin(15)}>30 min or less</Chip>
            <Chip small on={decMin > 30} onClick={() => setDecMin(31)}>Over 30 min</Chip>
          </div>
        )}
      </div>

      <div>
        <Label hint="optional">Accelerations</Label>
        <ChipRow small value={accel} onChange={setAccel} options={[{ value: true, label: "Present" }, { value: false, label: "Absent" }]} />
      </div>

      <div>
        <Label hint={ctx >= 5 || hypertonus ? "amber feature (NG229 1.4.12)" : "required"}>Contractions in 10 min</Label>
        <ChipRow small value={ctx} onChange={setCtx} options={[0, 1, 2, 3, 4, 5, 6, 7]} />
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Chip small on={hypertonus} onClick={() => setHypertonus(h => !h)}>Hypertonus</Chip>
        </div>
      </div>

      <WhenPicker label="Time of review" value={when} onChange={setWhen} />
      <div>
        <Label hint="optional">Comment</Label>
        <input id="ctg-comment" type="text" value={comment} onChange={e => setComment(e.target.value)} maxLength={120}
          placeholder="e.g. CTG discussed with registrar, review in 30 min" aria-label="CTG comment" className={INPUT} />
        <p className={`${TYPE_META} mt-1`}>Shows on the card and in handover. No names or identifiers.</p>
      </div>
      <p className={TYPE_META}>Decision aid only. Clinical responsibility remains with the treating clinician.</p>
    </Sheet>
  );
}
