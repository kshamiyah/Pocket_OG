import { useState } from "react";
import { Chip, ChipRow, Label } from "../ui/atoms";
import { AlertList } from "./BedSheet";
import { ctgSummary } from "../utils/ctgText";
import {
  BTN, BTN_PRIMARY, BTN_SECONDARY, CARD, CHIP_ON, CTG_BOX, INPUT, TYPE_DISPLAY, TYPE_META, TYPE_UI_SM,
} from "../ui/styles";
import { IconBack, IconTick } from "../ui/icons";
import { fmtAge, clock } from "../utils/time";
import {
  ANALGESIA, LIQUOR_SHORT, PERSISTENT_FLAGS, STAGES, STAGE_SHORT, currentOxytocin, isHypertensiveBed, newId, obsStatus, parityWithHistory, recordObs, sortedVEs, stageLabel, stampObs, stationLabel,
} from "../utils/bedModel";

// Labels for the "recorded as done" list, so a mistaken Given or Done can be taken back.
const DONE_LABEL = {
  gbsAntibioticsStarted: "Intrapartum antibiotics given",
  broadAntibioticsStarted: "Antibiotics for suspected infection given",
  pphReviewed: "PPH reviewed",
  bleedingReviewed: "Bleeding reviewed",
  neonatalTeamAlerted: "Neonatal team alerted",
  mgso4Given: "MgSO4 given",
  corticosteroidsConfirmed: "Steroids confirmed",
  tocolysisOffered: "Tocolysis offered",
};

// Several alerts share one field (any intrapartum antibiotics), so list each field once.
const DONE_FIELDS = [...new Set(Object.values(PERSISTENT_FLAGS).map(f => f.field))];

const TASK_QUICK = ["Repeat FBC", "Group & Save", "Clotting screen", "Senior review", "Repeat CTG", "Antibiotics due", "Consent form", "IV access", "Urine dip"];

function SmallBtn({ children, onClick, tone = "gray" }) {
  const cls = tone === "red"
    ? "text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
    : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  return <button type="button" onClick={onClick} className={`min-h-8 px-2.5 rounded-lg border bg-white dark:bg-gray-950 text-xs font-semibold active:scale-95 ${cls}`}>{children}</button>;
}

function ObsPanel({ bed, now, onUpdate }) {
  const obs = bed.observations ?? {};
  const [open, setOpen] = useState(null);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [urine, setUrine] = useState(obs.urineOutput != null ? String(obs.urineOutput) : "");
  const items = obsStatus(bed, now);
  const shown = it => it.type === "bp"
    ? (obs.bpSystolic ? `${obs.bpSystolic}/${obs.bpDiastolic ?? "?"}` : null)
    : obs[it.valueKey] ?? null;

  const saveValue = it => {
    onUpdate(recordObs(bed, new Date().toISOString(), { [it.name]: it.type === "bp" ? [v1, v2] : v1 }), `${it.label} recorded`);
    setOpen(null); setV1(""); setV2("");
  };

  return (
    <div className="space-y-3">
      <p className={TYPE_META}>
        Pulse hourly · BP {isHypertensiveBed(bed) ? "hourly (hypertensive)" : "4-hourly"} · Temp 4-hourly
        {items.some(i => i.key === "lastBGL") ? " · BGL hourly" : ""}. Tap Done to stamp the time, or add a value.
      </p>
      {items.map(it => (
        <div key={it.key} className={`${CARD} px-3 py-2.5`}>
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${it.done ? "bg-emerald-500" : "border-2 border-gray-400 dark:border-gray-600"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{it.label}{shown(it) ? ` · ${shown(it)} ${it.unit}` : ""}</p>
              <p className={TYPE_META}>{it.at ? `${clock(it.at)} (${fmtAge(now - it.at)} ago)` : "Not recorded"}</p>
            </div>
            <SmallBtn onClick={() => { setOpen(open === it.key ? null : it.key); setV1(""); setV2(""); }}>Value</SmallBtn>
            <SmallBtn onClick={() => onUpdate(stampObs(bed, new Date().toISOString(), [it.key]), `${it.label} done`)}>Done</SmallBtn>
          </div>
          {open === it.key && (
            <div className="flex gap-2 mt-2">
              <input autoFocus type="number" inputMode={it.type === "float" ? "decimal" : "numeric"} value={v1} onChange={e => setV1(e.target.value)}
                placeholder={it.type === "bp" ? "Systolic" : `${it.label} (${it.unit})`} className={`${INPUT} flex-1`} aria-label={it.type === "bp" ? "Systolic" : it.label} />
              {it.type === "bp" && <input type="number" inputMode="numeric" value={v2} onChange={e => setV2(e.target.value)} placeholder="Diastolic" className={`${INPUT} flex-1`} aria-label="Diastolic" />}
              <button type="button" onClick={() => saveValue(it)} disabled={it.type === "bp" ? !(v1 && v2) : !v1}
                className={`${BTN} ${BTN_PRIMARY} px-4`} aria-label="Save value"><IconTick /></button>
            </div>
          )}
        </div>
      ))}
      <div>
        <Label>Urine output (mL/hr)</Label>
        <div className="flex gap-2">
          <input type="number" inputMode="numeric" value={urine} onChange={e => setUrine(e.target.value)} className={`${INPUT} flex-1`} aria-label="Urine output" />
          <button type="button" disabled={!urine} onClick={() => onUpdate({ observations: { ...obs, urineOutput: parseFloat(urine), lastUrineCheck: new Date().toISOString() } }, "Urine output recorded")}
            className={`${BTN} ${BTN_PRIMARY} px-5`}>Set</button>
        </div>
        {obs.urineOutput != null && obs.urineOutput < 30 && <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5">Oliguria {obs.urineOutput} mL/hr: escalate (NG235 §1.4.5).</p>}
      </div>
    </div>
  );
}

function TasksPanel({ bed, onUpdate }) {
  const tasks = bed.tasks ?? [];
  const [text, setText] = useState("");
  const add = raw => {
    const label = raw.trim();
    if (!label) return;
    onUpdate({ tasks: [...tasks, { id: newId("task"), text: label, done: false, createdAt: new Date().toISOString() }] }, `Task added: ${label}`);
    setText("");
  };
  const toggle = id => onUpdate({ tasks: tasks.map(x => (x.id === id ? { ...x, done: !x.done } : x)) });
  const ordered = [...tasks.filter(x => !x.done), ...tasks.filter(x => x.done)];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {TASK_QUICK.map(q => <Chip key={q} small onClick={() => add(q)}>+ {q}</Chip>)}
      </div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); add(text); }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Custom task" className={`${INPUT} flex-1`} aria-label="Custom task" />
        <button type="submit" disabled={!text.trim()} className={`${BTN} ${BTN_PRIMARY} px-5`}>Add</button>
      </form>
      {ordered.length === 0 ? <p className={`${TYPE_META} text-center py-6`}>No tasks yet.</p> : ordered.map(x => (
        <button key={x.id} type="button" onClick={() => toggle(x.id)} className={`${CARD} w-full px-3 py-2.5 flex items-center gap-3 text-left`}>
          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${x.done ? "bg-claude-600 border-claude-600 text-white" : "border-gray-300 dark:border-gray-600"}`}>{x.done && <IconTick className="w-3 h-3" />}</span>
          <span className={`text-sm ${x.done ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-900 dark:text-gray-100"}`}>{x.text}</span>
        </button>
      ))}
    </div>
  );
}

export default function BedRecord({ bed, t, now, onBack, onUpdate, onFix, onStage, onOpenVE, onOpenCTG, onOpenOxy, onOpenDelivery, onEdit, onRemove }) {
  const [tab, setTab] = useState("overview");
  if (!bed) return null;
  const ves = [...sortedVEs(bed)].reverse();
  const ctgs = [...(bed.ctgLog ?? [])].reverse();
  const oxy = currentOxytocin(bed);
  const pendingTasks = (bed.tasks ?? []).filter(x => !x.done).length;
  const TABS = [["overview", "Overview"], ["ves", `VEs ${ves.length || ""}`], ["ctg", `CTG ${ctgs.length || ""}`], ["obs", "Obs"], ["tasks", `Tasks${pendingTasks ? ` ${pendingTasks}` : ""}`]];

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-gray-950 overflow-y-auto overscroll-contain" role="dialog" aria-label={`Bed ${bed.bedNumber} record`}>
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}>
        <div className="max-w-lg mx-auto px-5 pb-3">
          <div className="flex items-start gap-3">
            <button type="button" onClick={onBack} aria-label="Back to board"
              className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-claude-700 dark:text-claude-400 active:scale-95"><IconBack /></button>
            <div className="flex-1 min-w-0">
              <h2 className={TYPE_DISPLAY}>Bed {bed.bedNumber}</h2>
              <p className={`${TYPE_META} mt-0.5`}>{parityWithHistory(bed)} · {bed.gestation} · {stageLabel(bed)}{bed.admissionTime ? ` · admitted ${clock(bed.admissionTime)}` : ""}</p>
            </div>
            <button type="button" onClick={onEdit} className="min-h-11 px-3 text-sm font-semibold text-claude-700 dark:text-claude-400">Edit</button>
          </div>
          <div className="flex gap-1.5 mt-3 overflow-x-auto -mx-1 px-1">
            {TABS.map(([k, l]) => (
              <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k}
                className={`shrink-0 px-3 py-2 min-h-10 rounded-lg ${TYPE_UI_SM} border transition-colors ${tab === k ? CHIP_ON : "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"}`}>{l.trim()}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-4 space-y-5" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>
        {tab === "overview" && (
          <>
            {t.alerts.length ? <AlertList alerts={t.alerts} onFix={onFix} /> : (
              <p className="rounded-xl border px-3 py-2.5 text-sm bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400">All clear. No active alerts.</p>
            )}
            {DONE_FIELDS.some(f => bed[f]) && (
              <div>
                <Label>Recorded as done</Label>
                <div className="space-y-1.5">
                  {DONE_FIELDS.filter(f => bed[f]).map(f => (
                    <div key={f} className={`${CARD} px-3 py-2 flex items-center justify-between gap-3`}>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{DONE_LABEL[f] ?? f}</span>
                      <SmallBtn onClick={() => onUpdate({ [f]: false }, `${DONE_LABEL[f] ?? "Item"} taken back`)}>Not done</SmallBtn>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!bed.delivery && (
              <div>
                <Label hint="NICE NG235 §1.1">Stage</Label>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => <Chip key={s} on={bed.labourStage === s} onClick={() => onStage(s)}>{STAGE_SHORT[s]}</Chip>)}
                </div>
                {bed.labourStage === "Active second stage" && bed.pushingStartTime && <p className={`${TYPE_META} mt-1.5`}>Pushing since {clock(bed.pushingStartTime)} ({fmtAge(now - new Date(bed.pushingStartTime).getTime())})</p>}
                {bed.labourStage === "Passive second stage" && bed.passiveStartTime && <p className={`${TYPE_META} mt-1.5`}>Fully dilated since {clock(bed.passiveStartTime)} ({fmtAge(now - new Date(bed.passiveStartTime).getTime())})</p>}
              </div>
            )}
            <div>
              <Label>Analgesia</Label>
              <ChipRow small options={ANALGESIA} value={bed.analgesia} onChange={a => onUpdate({ analgesia: a }, `Analgesia: ${a}`)} />
            </div>
            {bed.modeOfOnset === "Induced" && (
              <div className={`${CARD} px-3 py-2.5 space-y-0.5`}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Induction · {bed.inductionMethod ?? "method not recorded"}</p>
                <p className={TYPE_META}>{bed.inductionStartTime ? `Started ${clock(bed.inductionStartTime)} (${fmtAge(now - new Date(bed.inductionStartTime).getTime())} ago)` : "Start time not recorded"}</p>
                {(bed.iolReasons ?? []).length > 0 && <p className={TYPE_META}>{bed.iolReasons.join(", ")}</p>}
              </div>
            )}
            {bed.delivery ? (
              <div className="rounded-xl border px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{bed.delivery.mode} at {clock(bed.delivery.time)}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80">{bed.delivery.ebl != null ? `EBL ${bed.delivery.ebl} mL` : "EBL not recorded"}{bed.delivery.notes ? ` · ${bed.delivery.notes}` : ""}</p>
                </div>
                <SmallBtn onClick={onOpenDelivery}>Edit</SmallBtn>
              </div>
            ) : (
              <button type="button" onClick={onOpenDelivery} className={`${BTN} ${BTN_SECONDARY} w-full`}>Mark delivered</button>
            )}
            <button type="button" onClick={onRemove} className={`${BTN} ${BTN_SECONDARY} w-full text-red-600 dark:text-red-400`}>Remove from board</button>
            <p className={`${TYPE_META} text-center`}>Removing can be undone for a few seconds.</p>
          </>
        )}

        {tab === "ves" && (
          <>
            <button type="button" onClick={() => onOpenVE(null)} className={`${BTN} ${BTN_PRIMARY} w-full`}>Record VE</button>
            {ves.length === 0 ? <p className={`${TYPE_META} text-center py-6`}>No VEs recorded yet.</p> : ves.map(v => (
              <div key={v.id} className={`${CARD} px-3 py-2.5 flex items-center gap-3`}>
                <span className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-white w-14">{v.dilation}<span className="text-xs font-normal text-gray-500"> cm</span></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{clock(v.time)} <span className={TYPE_META}>({fmtAge(now - new Date(v.time).getTime())} ago)</span></p>
                  <p className={TYPE_META}>
                    {v.station != null ? `Station ${stationLabel(v.station)} · ` : ""}{v.presentation && v.presentation !== "Cephalic" ? `${v.presentation} · ` : ""}{v.membranes ?? "Membranes not recorded"}{v.membranesTime ? ` ${clock(v.membranesTime)}` : ""}{v.liquor ? ` · ${LIQUOR_SHORT[v.liquor] ?? v.liquor}` : ""}{v.contractions != null ? ` · ${v.contractions} in 10` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <SmallBtn onClick={() => onOpenVE(v)}>Edit</SmallBtn>
                  <SmallBtn tone="red" onClick={() => onUpdate({ ves: (bed.ves ?? []).filter(x => x.id !== v.id) }, `VE ${clock(v.time)} deleted`)}>Delete</SmallBtn>
                </div>
              </div>
            ))}
            <p className={`${TYPE_META} text-center`}>NICE NG235 §1.4.1: 4-hourly VE in active labour</p>
          </>
        )}

        {tab === "ctg" && (
          <>
            <button type="button" onClick={() => onOpenCTG(null)} className={`${BTN} ${BTN_PRIMARY} w-full`}>Log CTG review</button>
            {ctgs.length === 0 ? <p className={`${TYPE_META} text-center py-6`}>No CTG reviews logged.</p> : ctgs.map(c => (
              <div key={c.id} className={`${CARD} px-3 py-2.5 flex items-start gap-3`}>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{clock(c.time)}</span>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded border capitalize ${CTG_BOX[c.classification] ?? ""}`}>{c.classification}</span>
                  </div>
                  <p className={TYPE_META}>{c.baselineHR != null ? ctgSummary(c) : "Logged as normal"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <SmallBtn onClick={() => onOpenCTG(c)}>Edit</SmallBtn>
                  <SmallBtn tone="red" onClick={() => onUpdate({ ctgLog: (bed.ctgLog ?? []).filter(x => x.id !== c.id) }, `CTG ${clock(c.time)} deleted`)}>Delete</SmallBtn>
                </div>
              </div>
            ))}
            <p className={`${TYPE_META} text-center`}>NICE NG229 · Fetal monitoring in labour</p>
          </>
        )}

        {tab === "obs" && (
          <>
            <ObsPanel bed={bed} now={now} onUpdate={onUpdate} />
            <div>
              <Label hint="NG235 §1.5.6">Oxytocin</Label>
              <div className={`${CARD} px-3 py-2.5 flex items-center gap-3`}>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{oxy ? `${oxy.dose} mU/min${bed.oxytocinHeld ? ", held" : ""}` : "Not running"}</p>
                  {oxy && <p className={TYPE_META}>Last change {clock(oxy.lastIncrementTime ?? oxy.startTime)} ({fmtAge(now - new Date(oxy.lastIncrementTime ?? oxy.startTime).getTime())} ago)</p>}
                </div>
                <SmallBtn onClick={onOpenOxy}>{oxy ? "Change" : "Start"}</SmallBtn>
              </div>
              {(bed.oxytocinLog ?? []).length > 1 && (
                <p className={`${TYPE_META} mt-1.5`}>History: {(bed.oxytocinLog ?? []).map(o => `${o.stopped ? "stopped" : o.dose} at ${clock(o.lastIncrementTime ?? o.startTime)}`).join(", ")}</p>
              )}
            </div>
          </>
        )}

        {tab === "tasks" && <TasksPanel bed={bed} onUpdate={onUpdate} />}
      </div>
    </div>
  );
}
