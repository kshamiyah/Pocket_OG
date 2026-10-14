import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Board from "./Board";
import BedSheet from "./BedSheet";
import BedRecord from "./BedRecord";
import VESheet from "./VESheet";
import CTGSheet from "./CTGSheet";
import OxySheet from "./OxySheet";
import DeliverySheet from "./DeliverySheet";
import AdmitSheet from "./AdmitSheet";
import BoardRound from "./BoardRound";
import HandoverSheet from "./HandoverSheet";
import IOLQueue, { IOLEntrySheet } from "./IOLQueue";
import Sheet from "../ui/Sheet";
import UndoToast from "../ui/UndoToast";
import { ChipRow, Label } from "../ui/atoms";
import { BTN, BTN_DANGER, BTN_SECONDARY, TYPE_META } from "../ui/styles";
import { addVE, doctorLabel, editVE as applyEditVE, fixAlert, newId, setStage, stampObs, STAGE_SHORT } from "../utils/bedModel";
import { triageWard, wardSummary } from "../utils/triage";
import { hhmm } from "../utils/time";
import { getThemePref, isDarkResolved, setThemePref, watchSystemTheme } from "../utils/theme";

// Storage keys are unchanged so boards already on a phone carry over.
const STORAGE_KEY = "pocket_og_ward_beds";
const IOL_STORAGE_KEY = "pocket_og_iol_queue";

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
}

const byBedNumber = (a, b) => String(a.bedNumber).localeCompare(String(b.bedNumber), undefined, { numeric: true });

export default function WardPage({ shift, onEndShift }) {
  const [beds, setBeds] = useState(() => load(STORAGE_KEY, {}));
  const [iolQueue, setIolQueue] = useState(() => load(IOL_STORAGE_KEY, []));
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState("board");
  const [sheet, setSheet] = useState(null);        // { type, bedId?, edit?, entry? }
  const [recordId, setRecordId] = useState(null);  // full record overlay
  const [round, setRound] = useState(null);        // { ids, index, updated:Set }
  const [toast, setToast] = useState(null);        // { message, snapshot? }
  const [flashId, setFlashId] = useState(null);
  const [themePref, setThemePrefState] = useState(getThemePref);
  const [dark, setDark] = useState(() => isDarkResolved());
  const [confirmEnd, setConfirmEnd] = useState(false);
  const toastTimer = useRef(null);
  const flashTimer = useRef(null);

  useEffect(() => { save(STORAGE_KEY, beds); }, [beds]);
  useEffect(() => { save(IOL_STORAGE_KEY, iolQueue); }, [iolQueue]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    const onVis = () => { if (!document.hidden) setNow(Date.now()); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  useEffect(() => watchSystemTheme(setDark), []);
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(flashTimer.current); }, []);

  const rows = useMemo(() => triageWard(beds, now), [beds, now]);
  const summary = useMemo(() => wardSummary(rows), [rows]);
  const triage = useMemo(() => Object.fromEntries(rows.map(r => [r.bed.id, r.t])), [rows]);

  // ── Changes, each with a toast and a few seconds of undo ──────────────
  const showToast = useCallback((message, snapshot) => {
    clearTimeout(toastTimer.current);
    setToast({ message, snapshot });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const flash = useCallback(id => {
    clearTimeout(flashTimer.current);
    setFlashId(id);
    flashTimer.current = setTimeout(() => setFlashId(null), 1300);
  }, []);

  const commit = useCallback((message, nextBeds, nextQueue, bedId) => {
    const snapshot = { beds, iolQueue };
    setBeds(nextBeds);
    if (nextQueue) setIolQueue(nextQueue);
    setNow(Date.now());
    if (bedId) {
      flash(bedId);
      setRound(r => (r ? { ...r, updated: new Set(r.updated).add(bedId) } : r));
    }
    showToast(message, snapshot);
  }, [beds, iolQueue, flash, showToast]);

  const updateBed = useCallback((bedId, updates, message) => {
    const bed = beds[bedId]; if (!bed) return;
    commit(message ?? `Bed ${bed.bedNumber} updated`, { ...beds, [bedId]: { ...bed, ...updates } }, null, bedId);
  }, [beds, commit]);

  const undo = () => {
    if (!toast?.snapshot) return;
    setBeds(toast.snapshot.beds);
    setIolQueue(toast.snapshot.iolQueue);
    showToast("Undone");
  };

  const closeSheet = () => setSheet(null);
  const iso = () => new Date().toISOString();

  // ── Actions ──────────────────────────────────────────────────────────
  const ctgNormal = bedId => {
    const bed = beds[bedId];
    updateBed(bedId, { ctgLog: [...(bed.ctgLog ?? []), { id: newId("ctg"), time: iso(), classification: "normal", quick: true }] }, `Normal CTG logged · Bed ${bed.bedNumber}`);
    closeSheet();
  };
  const obsDone = bedId => {
    const bed = beds[bedId];
    updateBed(bedId, stampObs(bed, iso()), `Obs done · Bed ${bed.bedNumber}`);
    closeSheet();
  };
  const fix = (bedId, alertId) => {
    const bed = beds[bedId];
    const label = { "gbs-iap": "GBS antibiotics given", "preterm-neonatal": "Neonatal team alerted", "preterm-steroids": "Steroids confirmed", "preterm-mgso4": "MgSO4 given", "preterm-tocolysis": "Tocolysis offered" }[alertId] ?? "Done";
    updateBed(bedId, fixAlert(bed, alertId, iso()), `${label} · Bed ${bed.bedNumber}`);
  };
  const changeStage = (bedId, stage, keepOpen = false) => {
    const bed = beds[bedId]; if (bed.labourStage === stage) return;
    updateBed(bedId, setStage(bed, stage, iso()), `Bed ${bed.bedNumber}: ${STAGE_SHORT[stage]}`);
    if (!keepOpen) closeSheet();
  };
  const saveVE = (bedId, ve, stageTo, editing) => {
    const bed = beds[bedId];
    let updates;
    if (editing) updates = applyEditVE(bed, ve);
    else {
      const r = addVE(bed, ve);
      if (r.duplicate) { closeSheet(); showToast("That VE is already saved"); return; }
      updates = r.updates;
    }
    if (stageTo) Object.assign(updates, setStage(bed, stageTo, ve.time));
    updateBed(bedId, updates, `${editing ? "VE updated" : `VE ${ve.dilation} cm saved`} · Bed ${bed.bedNumber}${stageTo ? ` · ${STAGE_SHORT[stageTo]}` : ""}`);
    closeSheet();
  };
  const saveCTG = (bedId, entry, editing) => {
    const bed = beds[bedId]; const log = bed.ctgLog ?? [];
    updateBed(bedId, { ctgLog: editing ? log.map(e => (e.id === entry.id ? entry : e)) : [...log, entry] },
      `${editing ? "CTG updated" : `${entry.classification[0].toUpperCase()}${entry.classification.slice(1)} CTG logged`} · Bed ${bed.bedNumber}`);
    closeSheet();
  };
  const saveOxy = (bedId, entry) => {
    const bed = beds[bedId]; const log = bed.oxytocinLog ?? [];
    updateBed(bedId, { oxytocinLog: [...log, entry], ...(log.length ? {} : { oxytocinStartTime: entry.startTime }) }, `Oxytocin ${entry.dose} mU/min · Bed ${bed.bedNumber}`);
    closeSheet();
  };
  const saveDelivery = (bedId, record) => {
    const bed = beds[bedId];
    updateBed(bedId, { delivery: record }, `Bed ${bed.bedNumber} delivered · ${record.mode}`);
    closeSheet();
    if (round) setRound(r => {
      const ids = r.ids.filter(id => id !== bedId);
      return { ...r, ids, index: Math.min(r.index, ids.length) };
    });
  };
  const admit = (bed, iolEntry) => {
    const nextQueue = iolEntry ? iolQueue.filter(e => e.id !== iolEntry.id) : null;
    commit(`Bed ${bed.bedNumber} added`, { ...beds, [bed.id]: bed }, nextQueue, bed.id);
    setTab("board");
    closeSheet();
  };
  const editDetails = (bedId, updates) => {
    updateBed(bedId, updates, `Bed ${updates.bedNumber} details saved`);
    closeSheet();
  };
  const removeBed = bedId => {
    const bed = beds[bedId];
    const next = { ...beds }; delete next[bedId];
    commit(`Bed ${bed.bedNumber} removed`, next);
    setRecordId(null);
    closeSheet();
  };

  // ── Board round ──────────────────────────────────────────────────────
  const startRound = () => {
    const ids = Object.values(beds).filter(b => !b.delivery).sort(byBedNumber).map(b => b.id);
    setRound({ ids, index: 0, updated: new Set() });
  };

  const toggleTheme = () => {
    const pref = dark ? "light" : "dark";
    setThemePrefState(pref);
    setDark(setThemePref(pref));
  };

  // ── Render ───────────────────────────────────────────────────────────
  const sb = sheet?.bedId ? beds[sheet.bedId] : null;
  const recordBed = recordId ? beds[recordId] : null;

  return (
    <>
      <Board
        rows={rows} summary={summary} now={now} shift={shift} dark={dark} flashId={flashId}
        iolQueue={iolQueue} tab={tab} onTab={setTab}
        onOpenBed={id => setSheet({ type: "bed", bedId: id })}
        onAdmit={() => setSheet({ type: "admit" })}
        onRound={startRound}
        onHandover={() => setSheet({ type: "handover" })}
        onToggleTheme={toggleTheme}
        onMenu={() => { setConfirmEnd(false); setSheet({ type: "menu" }); }}
        iolView={
          <IOLQueue queue={iolQueue} now={now}
            onAdd={() => setSheet({ type: "iol" })}
            onEdit={entry => setSheet({ type: "iol", entry })}
            onAdmit={entry => setSheet({ type: "admit", entry })}
            onRemove={entry => commit(`${entry.initials} removed from IOL queue`, beds, iolQueue.filter(e => e.id !== entry.id))} />
        }
      />

      {round && (
        <BoardRound ids={round.ids} index={round.index} beds={beds} triage={triage} updated={round.updated} now={now}
          onIndex={i => setRound(r => ({ ...r, index: Math.max(0, i) }))}
          onExit={() => setRound(null)}
          onVE={id => setSheet({ type: "ve", bedId: id })}
          onCTGNormal={ctgNormal}
          onMore={id => setSheet({ type: "bed", bedId: id })}
          onFix={fix}
          onHandover={() => { setRound(null); setSheet({ type: "handover" }); }} />
      )}

      {recordBed && (
        <BedRecord bed={recordBed} t={triage[recordBed.id]} now={now}
          onBack={() => setRecordId(null)}
          onUpdate={(u, msg) => updateBed(recordBed.id, u, msg)}
          onFix={id => fix(recordBed.id, id)}
          onStage={s => changeStage(recordBed.id, s, true)}
          onOpenVE={v => setSheet({ type: "ve", bedId: recordBed.id, edit: v })}
          onOpenCTG={c => setSheet({ type: "ctg", bedId: recordBed.id, edit: c })}
          onOpenOxy={() => setSheet({ type: "oxy", bedId: recordBed.id })}
          onOpenDelivery={() => setSheet({ type: "delivery", bedId: recordBed.id })}
          onEdit={() => setSheet({ type: "edit", bedId: recordBed.id })}
          onRemove={() => removeBed(recordBed.id)} />
      )}

      {sheet?.type === "bed" && sb && (
        <BedSheet bed={sb} t={triage[sb.id]} now={now} onClose={closeSheet}
          onCTGNormal={() => ctgNormal(sb.id)}
          onCTGConcern={() => setSheet({ type: "ctg", bedId: sb.id })}
          onVE={() => setSheet({ type: "ve", bedId: sb.id })}
          onObs={() => obsDone(sb.id)}
          onFix={id => fix(sb.id, id)}
          onStage={s => changeStage(sb.id, s)}
          onDelivered={() => setSheet({ type: "delivery", bedId: sb.id })}
          onOxy={() => setSheet({ type: "oxy", bedId: sb.id })}
          onRecord={() => { setRecordId(sb.id); closeSheet(); }}
          onRemove={() => removeBed(sb.id)} />
      )}
      {sheet?.type === "ve" && sb && <VESheet key={sheet.edit?.id ?? "new"} bed={sb} editVE={sheet.edit ?? null} onClose={closeSheet} onSave={(ve, stageTo) => saveVE(sb.id, ve, stageTo, !!sheet.edit)} />}
      {sheet?.type === "ctg" && sb && <CTGSheet key={sheet.edit?.id ?? "new"} bed={sb} editCTG={sheet.edit ?? null} onClose={closeSheet} onSave={e => saveCTG(sb.id, e, !!sheet.edit)} />}
      {sheet?.type === "oxy" && sb && <OxySheet bed={sb} onClose={closeSheet} onSave={e => saveOxy(sb.id, e)} />}
      {sheet?.type === "delivery" && sb && <DeliverySheet bed={sb} onClose={closeSheet} onSave={r => saveDelivery(sb.id, r)} />}
      {sheet?.type === "edit" && sb && (
        <AdmitSheet mode="edit" bed={sb} existingNumbers={Object.values(beds).map(b => b.bedNumber)} onClose={closeSheet} onSave={u => editDetails(sb.id, u)} />
      )}
      {sheet?.type === "admit" && (
        <AdmitSheet mode={sheet.entry ? "iol" : "new"} iolEntry={sheet.entry ?? null}
          existingNumbers={Object.values(beds).map(b => b.bedNumber)} onClose={closeSheet} onSave={bed => admit(bed, sheet.entry)} />
      )}
      {sheet?.type === "handover" && <HandoverSheet beds={beds} shift={shift} now={now} onClose={closeSheet} />}
      {sheet?.type === "iol" && (
        <IOLEntrySheet entry={sheet.entry ?? null} onClose={closeSheet} onSave={entry => {
          const exists = iolQueue.some(e => e.id === entry.id);
          commit(exists ? `${entry.initials} updated` : `${entry.initials} added to IOL queue`, beds, exists ? iolQueue.map(e => (e.id === entry.id ? entry : e)) : [...iolQueue, entry]);
          closeSheet();
        }} />
      )}
      {sheet?.type === "menu" && (
        <Sheet open onClose={closeSheet} title="Shift" sub={shift ? `${doctorLabel(shift.doctorName)} · until ${hhmm(shift.shiftEnd)}` : undefined}>
          <div>
            <Label>Appearance</Label>
            <ChipRow small value={themePref} onChange={p => { setThemePrefState(p); setDark(setThemePref(p)); }}
              options={[{ value: "system", label: "Match phone" }, { value: "light", label: "Day" }, { value: "dark", label: "Night" }]} />
          </div>
          <button type="button" disabled={!Object.keys(beds).length} onClick={() => { commit("Board cleared", {}); closeSheet(); }} className={`${BTN} ${BTN_SECONDARY} w-full`}>
            Clear the board
          </button>
          {!confirmEnd ? (
            <button type="button" onClick={() => setConfirmEnd(true)} className={`${BTN} ${BTN_DANGER} w-full`}>End shift</button>
          ) : (
            <div className="space-y-2">
              <p className={`${TYPE_META} text-center`}>The board stays on this phone for the next shift to take over.</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setConfirmEnd(false)} className={`${BTN} ${BTN_SECONDARY}`}>Cancel</button>
                <button type="button" onClick={() => { closeSheet(); onEndShift(); }} className={`${BTN} bg-red-600 text-white`}>End shift</button>
              </div>
            </div>
          )}
        </Sheet>
      )}

      {/* Hidden while a sheet is open so it never covers controls; it returns when the sheet closes. */}
      {!sheet && (
        <UndoToast message={toast?.message} onUndo={toast?.snapshot ? undo : null}
          bottom={round ? "calc(env(safe-area-inset-bottom) + 9rem)" : recordBed ? "calc(env(safe-area-inset-bottom) + 1.25rem)" : undefined} />
      )}
    </>
  );
}
