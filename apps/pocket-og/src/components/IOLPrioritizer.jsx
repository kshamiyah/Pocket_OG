import { useState, useEffect } from "react";
import {
  IOL_TIERS, IOL_IND, SROM_KEY, SROM_ESCALATION_HOURS,
  iolEntryTier, governingIndication, entryReason, hasSrom, isSromEscalated, sortIOLQueue,
} from "../utils/iolPriority";

const INPUT_CLS = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400";

let _uid = 0;
const uid = () => ++_uid;

const TIER_GROUPS = [0, 1, 2, 3].map(t => ({
  tier: t,
  meta: IOL_TIERS[t],
  items: IOL_IND.filter(i => i.tier === t),
}));

export default function IOLPrioritizer({ onClose }) {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [label, setLabel] = useState("");
  const [gestWeeks, setGestWeeks] = useState("");
  const [gestExtraDays, setGestExtraDays] = useState("");
  const [daysWaiting, setDaysWaiting] = useState("");
  const [indications, setIndications] = useState([]);
  const [sromHours, setSromHours] = useState("");

  const [vpTop, setVpTop] = useState(0);
  const [vpHeight, setVpHeight] = useState(() =>
    (typeof window !== "undefined" && window.visualViewport?.height) || (typeof window !== "undefined" ? window.innerHeight : 0)
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => { setVpTop(vv.offsetTop); setVpHeight(vv.height); };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, []);

  const gestDaysTotal = gestWeeks !== "" ? parseInt(gestWeeks) : null;
  const sromSelected = indications.includes(SROM_KEY);

  const resetForm = () => {
    setLabel(""); setGestWeeks(""); setGestExtraDays(""); setDaysWaiting("");
    setIndications([]); setSromHours("");
  };

  const toggleInd = (key) =>
    setIndications(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const savePatient = () => {
    if (!indications.length) return;
    const fields = {
      gestWeeks: gestDaysTotal ?? 40,
      gestDays: gestExtraDays !== "" ? Math.min(6, parseInt(gestExtraDays) || 0) : 0,
      indications,
      sromHours: indications.includes(SROM_KEY) && sromHours !== "" ? Math.max(0, parseInt(sromHours) || 0) : null,
      daysWaiting: Math.max(0, parseInt(daysWaiting) || 0),
    };
    if (editingId != null) {
      setPatients(prev => prev.map(x => x.id === editingId ? { ...x, ...fields, label: label.trim() || x.label } : x));
    } else {
      setPatients(prev => [...prev, { id: uid(), label: label.trim() || String(prev.length + 1), ...fields }]);
    }
    resetForm();
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setLabel(p.label);
    setGestWeeks(String(p.gestWeeks));
    setGestExtraDays(p.gestDays ? String(p.gestDays) : "");
    setDaysWaiting(String(p.daysWaiting));
    setIndications(p.indications);
    setSromHours(p.sromHours != null ? String(p.sromHours) : "");
    setShowForm(true);
  };

  const cancelForm = () => { resetForm(); setShowForm(false); setEditingId(null); };

  const remove = (id) => {
    if (editingId === id) cancelForm();
    setPatients(prev => prev.filter(x => x.id !== id));
  };

  const sorted = sortIOLQueue(patients);

  return (
    <div
      className="fixed left-0 right-0 z-50 bg-white flex flex-col overflow-hidden"
      style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', sans-serif", top: vpTop, height: vpHeight }}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">↑↓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">IOL Priority List</p>
          <p className="text-xs text-gray-400">NICE NG207 · ranked by urgency, gestation &amp; wait</p>
        </div>
        <button
          onClick={() => setShowKey(v => !v)}
          aria-pressed={showKey}
          aria-label="Priority key"
          className={`h-8 px-2.5 flex items-center gap-1 rounded-xl text-xs font-semibold transition-colors shrink-0 ${showKey ? "bg-teal-100 text-teal-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
        >
          <span className="text-sm leading-none">ⓘ</span> Key
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
        >×</button>
      </div>

      {/* Priority key */}
      {showKey && (
        <div className="shrink-0 border-b border-gray-100 bg-gray-50 px-4 py-3 overflow-y-auto max-h-[48%]">
          <div className="max-w-lg mx-auto space-y-2.5 text-xs text-gray-600 leading-relaxed">
            <p className="text-gray-500">Each patient is ranked by her <b>most urgent indication</b> (NICE NG207 tiers), then by gestation and time waiting.</p>
            {IOL_TIERS.map(t => (
              <div key={t.key} className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 h-fit ${t.badge}`}>{t.label}</span>
                <span>
                  <b>{t.within}.</b>{" "}
                  {IOL_IND.filter(i => i.tier === IOL_TIERS.indexOf(t)).map(i => i.label).join(" · ")}
                </span>
              </div>
            ))}
            <div className="pt-1.5 border-t border-gray-100 space-y-1.5">
              <p><b>Multiple indications:</b> a patient takes her single most urgent tier — indications are not added up (e.g. SROM + pre-eclampsia is ranked by the pre-eclampsia).</p>
              <p><b>Hours since SROM:</b> term PROM/SROM starts at Moderate and <b>escalates to High at ≥ {SROM_ESCALATION_HOURS}h</b> since rupture (NICE NG207 — offer IOL, expectant max ~24h). SROM patients are then ordered by hours since rupture (longest first).</p>
            </div>
            <p className="text-gray-400 pt-1">Decision support only — the clinical team makes the final call.</p>
          </div>
        </div>
      )}

      {/* Patient list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-2">
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm font-medium text-gray-500">No patients added yet</p>
              <p className="text-xs text-gray-400 mt-1">Tap <b>+ Add patient</b> below to build the list.</p>
              <button onClick={() => setShowKey(true)} className="text-xs text-teal-600 hover:text-teal-700 mt-2 font-medium">ⓘ How the priorities work</button>
            </div>
          )}
          {sorted.map((p, i) => {
            const tier = iolEntryTier(p);
            const meta = IOL_TIERS[tier];
            const gov = governingIndication(p);
            const escalated = hasSrom(p) && isSromEscalated(p);
            const isEditing = editingId === p.id;
            return (
              <div key={p.id} className={`px-3.5 py-3 rounded-2xl border bg-white ${isEditing ? "border-teal-400 ring-2 ring-teal-400/20" : "border-gray-100 shadow-sm"}`}>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[15px] font-semibold text-gray-900 leading-tight">Patient {p.label}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${meta.badge}`}>{meta.label}</span>
                      {escalated && (
                        <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500 text-white shrink-0">Escalated</span>
                      )}
                      <span className="text-[11px] text-gray-400">{p.gestWeeks}+{p.gestDays ?? 0}</span>
                    </div>
                    {/* indication chips */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.indications.map(k => {
                        const ind = IOL_IND.find(x => x.key === k);
                        if (!ind) return null;
                        const isGov = gov && gov.key === k;
                        return (
                          <span key={k} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isGov ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
                            {ind.label}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">
                      {meta.within} · {entryReason(p)}
                      {p.daysWaiting > 0 ? ` · ${p.daysWaiting}d on list` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(p)} aria-label={`Edit patient ${p.label}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </button>
                    <button onClick={() => remove(p.id)} aria-label={`Remove patient ${p.label}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 text-lg leading-none transition-colors">×</button>
                  </div>
                </div>
              </div>
            );
          })}
          {patients.length > 0 && (
            <button onClick={() => setPatients([])} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Bottom — add / edit form */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 pt-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-lg mx-auto">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-base leading-none">+</span> Add patient
            </button>
          ) : (
            <div className="space-y-2 max-h-[62vh] overflow-y-auto pb-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">{editingId != null ? "Edit patient" : "New patient"}</p>
                <button onClick={cancelForm} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              </div>

              <input
                type="text" placeholder="Patient label / initials (optional)"
                value={label} onChange={e => setLabel(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                className={INPUT_CLS}
              />

              <div>
                <p className="text-xs text-gray-400 mb-1 pl-1">Gestation</p>
                <div className="flex gap-2">
                  <input type="number" inputMode="numeric" placeholder="Weeks (e.g. 39)" min="20" max="43"
                    value={gestWeeks} onChange={e => setGestWeeks(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} className={INPUT_CLS + " flex-1 min-w-0"} />
                  <input type="number" inputMode="numeric" placeholder="+Days" min="0" max="6"
                    value={gestExtraDays} onChange={e => setGestExtraDays(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} className={INPUT_CLS + " w-24"} />
                </div>
              </div>

              {/* Indications — multi-select by tier */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5 pl-1">Indication — select all that apply</p>
                <div className="space-y-2">
                  {TIER_GROUPS.map(({ tier, meta, items }) => (
                    <div key={tier}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${meta.text}`}>{meta.label}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {items.map(ind => {
                          const on = indications.includes(ind.key);
                          return (
                            <button key={ind.key} type="button" onClick={() => toggleInd(ind.key)}
                              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-left leading-tight transition-colors active:scale-95 ${
                                on ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600"
                              }`}>
                              {ind.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours since SROM — only when the SROM indication is selected */}
              {sromSelected && (
                <div className="rounded-xl bg-teal-50 border border-teal-100 px-3 py-2.5">
                  <p className="text-xs font-semibold text-teal-700 mb-1">Hours since SROM</p>
                  <input type="number" inputMode="numeric" placeholder="e.g. 18" min="0"
                    value={sromHours} onChange={e => setSromHours(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} className={INPUT_CLS} />
                  <p className="text-[11px] text-teal-600 mt-1">
                    {sromHours !== "" && parseInt(sromHours) >= SROM_ESCALATION_HOURS
                      ? `≥ ${SROM_ESCALATION_HOURS}h — escalates to High priority`
                      : `Escalates to High at ≥ ${SROM_ESCALATION_HOURS}h since rupture`}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 mb-1 pl-1">Days on IOL list</p>
                <input type="number" inputMode="numeric" placeholder="0" min="0"
                  value={daysWaiting} onChange={e => setDaysWaiting(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} className={INPUT_CLS} />
              </div>

              <button
                onClick={savePatient}
                disabled={!indications.length}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                {editingId != null ? "Save changes" : "Add"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
