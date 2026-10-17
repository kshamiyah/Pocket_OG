import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Board from "./Board";
import BedSheet from "./BedSheet";
import BedRecord from "./BedRecord";
import VESheet from "./VESheet";
import CTGSheet from "./CTGSheet";
import OxySheet from "./OxySheet";
import ObsSheet from "./ObsSheet";
import DeliverySheet from "./DeliverySheet";
import AdmitSheet from "./AdmitSheet";
import BoardRound from "./BoardRound";
import HandoverSheet from "./HandoverSheet";
import IOLQueue, { IOLEntrySheet } from "./IOLQueue";
import RulesPage, { RuleSheet, SourceSheet } from "./Rules";
import UnitSettings from "./UnitSettings";
import { changedSettings, saveUnitSettings } from "../data/unitSettings";
import Sheet from "../ui/Sheet";
import { RulesContext } from "../ui/rulesContext";
import UndoToast from "../ui/UndoToast";
import { ChipRow, Label } from "../ui/atoms";
import { BTN, BTN_DANGER, BTN_SECONDARY, TYPE_META } from "../ui/styles";
import { ACTION_ALERTS, STILL_HERE, addVE, declineAlert, doctorLabel, editVE as applyEditVE, fixAlert, fixLabel, setStage, STAGE_SHORT } from "../utils/bedModel";
import { triageWard, wardSummary } from "../utils/triage";
import { clock } from "../utils/time";

// Test-only clock control; the live build drops this import entirely.
const SimBar = import.meta.env.VITE_SIM === "1" ? lazy(() => import("../sim/SimBar")) : null;
import { getThemePref, isDarkResolved, setThemePref, watchSystemTheme } from "../utils/theme";

// Storage keys are unchanged so boards already on a phone carry over.
const STORAGE_KEY = "pocket_og_ward_beds";
const IOL_STORAGE_KEY = "pocket_og_iol_queue";
// Women removed from the board, kept for a day so the handover can list who
// left this shift (delivered and moved, transferred) with their timeline.
const REMOVED_KEY = "pocket_og_ward_removed";

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
}


export default function WardPage({ shift, onEndShift }) {
  const [beds, setBeds] = useState(() => load(STORAGE_KEY, {}));
  const [iolQueue, setIolQueue] = useState(() => load(IOL_STORAGE_KEY, []));
  const [removed, setRemoved] = useState(() => load(REMOVED_KEY, []));
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState("board");
  const [sheet, setSheet] = useState(null);        // { type, bedId?, edit?, entry? }
  // Rules and sources: the full page, a rule pop-up for one alert, and the
  // source pop-up. These layer above whatever is open underneath.
  const [rulesOpen, setRulesOpen] = useState(false);
  const [ruleAlert, setRuleAlert] = useState(null);
  const [sourceKey, setSourceKey] = useState(null);
  const rulesCtx = useMemo(() => ({ openRule: id => setRuleAlert(id) }), []);
  // Unit settings change the engine's local thresholds; bumping the version
  // re-runs triage with the new values.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unitVersion, setUnitVersion] = useState(0);
  const [recordId, setRecordId] = useState(null);  // full record overlay
  const [round, setRound] = useState(null);        // { ids, index, updated:Set }
  const [toast, setToast] = useState(null);        // { message, snapshot? }
  const [flashId, setFlashId] = useState(null);
  const [themePref, setThemePrefState] = useState(getThemePref);
  const [dark, setDark] = useState(() => isDarkResolved());
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmClear, setConfirmClear] = useState(null);
  const toastTimer = useRef(null);
  const flashTimer = useRef(null);

  useEffect(() => { save(STORAGE_KEY, beds); }, [beds]);
  useEffect(() => { save(IOL_STORAGE_KEY, iolQueue); }, [iolQueue]);
  useEffect(() => { save(REMOVED_KEY, removed); }, [removed]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    const onVis = () => { if (!document.hidden) setNow(Date.now()); };
    document.addEventListener("visibilitychange", onVis);
    // The test board's simulated clock announces each jump (never fires in the live app).
    const onSim = () => setNow(Date.now());
    window.addEventListener("sim-clock", onSim);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("sim-clock", onSim); };
  }, []);
  useEffect(() => watchSystemTheme(setDark), []);
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(flashTimer.current); }, []);

  const rows = useMemo(() => triageWard(beds, now), [beds, now, unitVersion]); // eslint-disable-line react-hooks/exhaustive-deps
  const summary = useMemo(() => wardSummary(rows), [rows]);
  const triage = useMemo(() => Object.fromEntries(rows.map(r => [r.bed.id, r.t])), [rows]);

  // ── Changes, each with a toast and a few seconds of undo ──────────────
  const showToast = useCallback((message, snapshot) => {
    clearTimeout(toastTimer.current);
    setToast({ message, snapshot });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);
  const settingSaved = s => { setUnitVersion(v => v + 1); showToast(`Saved: ${s.label}`); };

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
    // updatedAt feeds "is she still here?": any edit counts as an entry.
    commit(message ?? `Bed ${bed.bedNumber} updated`, { ...beds, [bedId]: { ...bed, ...updates, updatedAt: new Date().toISOString() } }, null, bedId);
  }, [beds, commit]);

  const undo = () => {
    if (!toast?.snapshot) return;
    setBeds(toast.snapshot.beds);
    setIolQueue(toast.snapshot.iolQueue);
    showToast("Undone");
  };

  const closeSheet = () => setSheet(null);
  // A sheet opened from a bed card returns to that card when it closes, so the
  // result is visible and the next action is one tap away.
  const finish = () => (sheet?.from === "bed" && sheet.bedId ? setSheet({ type: "bed", bedId: sheet.bedId }) : closeSheet());
  const onCard = sheet?.type === "bed";
  const iso = () => new Date().toISOString();

  // ── Actions ──────────────────────────────────────────────────────────
  const fix = (bedId, alertId, kind) => {
    const bed = beds[bedId];
    // Stopping oxytocin is logged in the oxytocin sheet, with the reason.
    if (ACTION_ALERTS[alertId]) { setSheet({ type: "oxy", bedId, from: sheet?.bedId === bedId ? "bed" : undefined, stop: true }); return; }
    // "Not here": open her full record, where she can be removed or updated.
    if (kind === "decline" && alertId === STILL_HERE) { closeSheet(); setRecordId(bedId); return; }
    if (kind === "decline") {
      updateBed(bedId, declineAlert(alertId, iso(), doctorLabel(shift?.doctorName)), `Not given · Bed ${bed.bedNumber}`);
      return;
    }
    const label = fixLabel(alertId);
    updateBed(bedId, fixAlert(bed, alertId, iso(), doctorLabel(shift?.doctorName)), `${label === "Reviewed" ? "Reviewed" : label ?? "Done"} · Bed ${bed.bedNumber}`);
  };
  const changeStage = (bedId, stage, keepOpen = false) => {
    const bed = beds[bedId]; if (bed.labourStage === stage) return;
    updateBed(bedId, setStage(bed, stage, iso()), `Bed ${bed.bedNumber}: ${STAGE_SHORT[stage]}`);
    if (!keepOpen && !onCard) closeSheet();
  };
  const saveVE = (bedId, ve, stageTo, editing) => {
    const bed = beds[bedId];
    let updates;
    if (editing) updates = applyEditVE(bed, ve);
    else {
      const r = addVE(bed, ve);
      if (r.duplicate) { finish(); showToast("That VE is already saved"); return; }
      updates = r.updates;
    }
    if (stageTo) Object.assign(updates, setStage(bed, stageTo, ve.time));
    updateBed(bedId, updates, `${editing ? "VE updated" : `VE ${ve.dilation} cm saved`} · Bed ${bed.bedNumber}${stageTo ? ` · ${STAGE_SHORT[stageTo]}` : ""}`);
    finish();
  };
  const saveCTG = (bedId, entry, editing) => {
    const bed = beds[bedId]; const log = bed.ctgLog ?? [];
    updateBed(bedId, { ctgLog: editing ? log.map(e => (e.id === entry.id ? entry : e)) : [...log, entry] },
      `${editing ? "CTG updated" : `${entry.classification[0].toUpperCase()}${entry.classification.slice(1)} CTG logged`} · Bed ${bed.bedNumber}`);
    finish();
  };
  const saveOxy = (bedId, entry) => {
    const bed = beds[bedId]; const log = bed.oxytocinLog ?? [];
    const msg = entry.stopped ? "Oxytocin stopped" : `Oxytocin ${entry.dose} mU/min`;
    updateBed(bedId, { oxytocinLog: [...log, entry], oxytocinHeld: false, ...(log.length ? {} : { oxytocinStartTime: entry.startTime }) }, `${msg} · Bed ${bed.bedNumber}`);
    finish();
  };
  const holdOxy = (bedId, held) => {
    updateBed(bedId, { oxytocinHeld: held }, `Oxytocin ${held ? "held at current dose" : "hold released"} · Bed ${beds[bedId].bedNumber}`);
    finish();
  };
  const saveDelivery = (bedId, record) => {
    const bed = beds[bedId];
    updateBed(bedId, { delivery: record }, `Bed ${bed.bedNumber} delivered · ${record.mode}`);
    finish();
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
  const editDetails = (bedId, updates, back) => {
    updateBed(bedId, updates, `Bed ${updates.bedNumber} details saved`);
    // Opened from the bed card: go back to it, so the change is visible.
    if (back === "bed") setSheet({ type: "bed", bedId }); else closeSheet();
  };
  const removeBed = bedId => {
    const bed = beds[bedId];
    const next = { ...beds }; delete next[bedId];
    // Undo puts her back on the board; the handover then ignores this entry.
    const iso = new Date().toISOString();
    setRemoved(r => [...r.filter(x => Date.now() - new Date(x.at).getTime() < 24 * 3600000 && x.bed?.id !== bedId), { at: iso, bed }]);
    commit(`Bed ${bed.bedNumber} removed`, next);
    setRecordId(null);
    closeSheet();
  };

  // ── Board round ──────────────────────────────────────────────────────
  const startRound = () => {
    // Everyone on the board, sickest first (the board's order): a delivered
    // woman can still be bleeding, hypertensive or septic, so she is seen too.
    const ids = rows.map(r => r.bed.id);
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
    <RulesContext.Provider value={rulesCtx}>
      {SimBar && <Suspense fallback={null}><SimBar rows={rows} /></Suspense>}
      <Board
        rows={rows} summary={summary} now={now} shift={shift} dark={dark} flashId={flashId}
        iolQueue={iolQueue} tab={tab} onTab={setTab}
        onOpenBed={id => setSheet({ type: "bed", bedId: id })}
        onAdmit={() => setSheet({ type: "admit" })}
        onRound={startRound}
        onHandover={() => setSheet({ type: "handover" })}
        onToggleTheme={toggleTheme}
        onMenu={() => { setConfirmEnd(false); setConfirmClear(null); setSheet({ type: "menu" }); }}
        onRules={() => setRulesOpen(true)}
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
          onCTG={id => setSheet({ type: "ctg", bedId: id })}
          onMore={id => setSheet({ type: "bed", bedId: id })}
          onFix={fix}
          onHandover={() => { setRound(null); setSheet({ type: "handover" }); }} />
      )}

      {recordBed && (
        <BedRecord bed={recordBed} t={triage[recordBed.id]} now={now}
          onBack={() => setRecordId(null)}
          onUpdate={(u, msg) => updateBed(recordBed.id, u, msg)}
          onFix={(id, kind) => fix(recordBed.id, id, kind)}
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
          onEdit={() => setSheet({ type: "edit", bedId: sb.id, back: "bed" })}
          onCTGConcern={() => setSheet({ type: "ctg", bedId: sb.id, from: "bed" })}
          onVE={() => setSheet({ type: "ve", bedId: sb.id, from: "bed" })}
          onObs={() => setSheet({ type: "obs", bedId: sb.id, from: "bed" })}
          onFix={(id, kind) => fix(sb.id, id, kind)}
          onStage={s => changeStage(sb.id, s)}
          onDelivered={() => setSheet({ type: "delivery", bedId: sb.id, from: "bed" })}
          onOxy={() => setSheet({ type: "oxy", bedId: sb.id, from: "bed" })}
          onRecord={() => { setRecordId(sb.id); closeSheet(); }}
          onRemove={() => removeBed(sb.id)} />
      )}
      {sheet?.type === "ve" && sb && <VESheet key={sheet.edit?.id ?? "new"} bed={sb} editVE={sheet.edit ?? null} onClose={finish} onSave={(ve, stageTo) => saveVE(sb.id, ve, stageTo, !!sheet.edit)} />}
      {sheet?.type === "ctg" && sb && <CTGSheet key={sheet.edit?.id ?? "new"} bed={sb} editCTG={sheet.edit ?? null} notice={sheet.notice} onClose={finish} onSave={e => saveCTG(sb.id, e, !!sheet.edit)} />}
      {sheet?.type === "oxy" && sb && <OxySheet bed={sb} stopping={!!sheet.stop} onClose={finish} onSave={e => saveOxy(sb.id, e)} onHold={h => holdOxy(sb.id, h)} />}
      {sheet?.type === "delivery" && sb && <DeliverySheet bed={sb} onClose={finish} onSave={r => saveDelivery(sb.id, r)} />}
      {sheet?.type === "obs" && sb && (
        <ObsSheet bed={sb} onClose={finish} onSave={(u, msg) => { updateBed(sb.id, u, `${msg} · Bed ${sb.bedNumber}`); finish(); }} />
      )}
      {sheet?.type === "edit" && sb && (
        <AdmitSheet mode="edit" bed={sb} existingNumbers={Object.values(beds).map(b => b.bedNumber)}
          onClose={sheet.back === "bed" ? () => setSheet({ type: "bed", bedId: sb.id }) : closeSheet}
          onSave={u => editDetails(sb.id, u, sheet.back)} />
      )}
      {sheet?.type === "admit" && (
        <AdmitSheet mode={sheet.entry ? "iol" : "new"} iolEntry={sheet.entry ?? null}
          existingNumbers={Object.values(beds).map(b => b.bedNumber)} onClose={closeSheet} onSave={bed => admit(bed, sheet.entry)} />
      )}
      {sheet?.type === "handover" && <HandoverSheet beds={beds} shift={shift} now={now} removed={removed} iolQueue={iolQueue} onClose={closeSheet} />}
      {sheet?.type === "iol" && (
        <IOLEntrySheet entry={sheet.entry ?? null} onClose={closeSheet} onSave={entry => {
          const exists = iolQueue.some(e => e.id === entry.id);
          commit(exists ? `${entry.initials} updated` : `${entry.initials} added to IOL queue`, beds, exists ? iolQueue.map(e => (e.id === entry.id ? entry : e)) : [...iolQueue, entry]);
          closeSheet();
        }} />
      )}
      {sheet?.type === "menu" && (
        <Sheet open onClose={closeSheet} title="Shift" sub={shift ? `${doctorLabel(shift.doctorName)} · until ${clock(shift.shiftEnd)}` : undefined}>
          <div>
            <Label>Appearance</Label>
            <ChipRow small value={themePref} onChange={p => { setThemePrefState(p); setDark(setThemePref(p)); }}
              options={[{ value: "system", label: "Match phone" }, { value: "light", label: "Day" }, { value: "dark", label: "Night" }]} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { closeSheet(); setRulesOpen(true); }} className={`${BTN} ${BTN_SECONDARY} whitespace-nowrap`}>
              Rules and sources
            </button>
            <button type="button" onClick={() => { closeSheet(); setSettingsOpen(true); }} className={`${BTN} ${BTN_SECONDARY} whitespace-nowrap`}>
              Unit settings{changedSettings().length ? ` (${changedSettings().length})` : ""}
            </button>
          </div>
          {confirmClear !== "ask" ? (
            <button type="button" disabled={!Object.keys(beds).length} onClick={() => setConfirmClear("ask")} className={`${BTN} ${BTN_SECONDARY} w-full`}>
              Clear the board
            </button>
          ) : (
            <div className="space-y-2">
              <p className={`${TYPE_META} text-center`}>This removes all {Object.keys(beds).length} women from this phone.</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setConfirmClear(null)} className={`${BTN} ${BTN_SECONDARY}`}>Keep them</button>
                <button type="button" onClick={() => { commit("Board cleared", {}); setConfirmClear(null); closeSheet(); }} className={`${BTN} bg-red-600 text-white`}>Clear board</button>
              </div>
            </div>
          )}
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
      {(!sheet || sheet.type === "bed") && (
        <UndoToast message={toast?.message} onUndo={toast?.snapshot ? undo : null}
          top={sheet?.type === "bed" ? "calc(env(safe-area-inset-top) + 0.75rem)" : null}
          bottom={round ? "calc(env(safe-area-inset-bottom) + 9rem)" : recordBed ? "calc(env(safe-area-inset-bottom) + 1.25rem)" : undefined} />
      )}

      {rulesOpen && <RulesPage onClose={() => setRulesOpen(false)} onSource={setSourceKey} onSettings={() => setSettingsOpen(true)} onSettingSaved={settingSaved} />}
      {settingsOpen && (
        <UnitSettings onClose={() => setSettingsOpen(false)}
          onSave={draft => { saveUnitSettings(draft); setUnitVersion(v => v + 1); setSettingsOpen(false); showToast("Unit settings saved"); }} />
      )}
      {ruleAlert && (
        <RuleSheet alertId={ruleAlert} onSource={setSourceKey} onClose={() => setRuleAlert(null)}
          onSettings={() => { setRuleAlert(null); setSheet(null); setSettingsOpen(true); }}
          onSettingSaved={settingSaved}
          onAll={() => { setRuleAlert(null); setSheet(null); setRulesOpen(true); }} />
      )}
      {sourceKey && <SourceSheet sourceKey={sourceKey} onClose={() => setSourceKey(null)} />}
    </RulesContext.Provider>
  );
}
