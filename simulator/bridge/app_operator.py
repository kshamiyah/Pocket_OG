#!/usr/bin/env python3
"""
App-as-operator loop (Option A) — the REAL Pocket O&G PPH SOS engine drives
SERA (Simulated Emergency Response Agent).

Each step: build the app's session from the patient's physiology, ask the real
engine (via the Node bridge) for its NOW recommendation, translate that into a
physiological action, and advance the clock. The app decides; the patient
responds. This tests whether the SOS protocol keeps the simulated mother alive.

Run:  python3 simulator/bridge/app_operator.py
(Requires the Node bridge deps; launches vite-node automatically.)
"""

import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SIM = os.path.dirname(HERE)
REPO = os.path.dirname(SIM)
sys.path.insert(0, SIM)

from stage4_sandbox import PatientV4, FUNDAL_FIRM_THRESHOLD, FUNDAL_TONE_PULSE   # noqa: E402
from stage3_sandbox import (           # noqa: E402
    PPH_MAJOR_ML, PPH_MASSIVE_ML, MAJOR_PRBC_ML_MIN, MASSIVE_PRBC_ML_MIN, MASSIVE_FFP_ML_MIN,
    MINOR_FLUID_ML_MIN, MAJOR_CRYST_ML_MIN, MAJOR_CRYST_CAP_ML,
)

# app drug task id -> our physiology drug id
DRUG_MAP = {
    "oxytocin_bolus": "oxytocin", "oxytocin_inf": "oxytocin",
    "ergometrine": "ergometrine", "carboprost": "carboprost", "misoprostol": "misoprostol",
}
SURGICAL_SEQUENCE = ["balloon", "sutures", "hysterectomy"]
# Variable cadence: an active tap (give drug, call, mark done) costs only a few
# seconds (a team acts fast / in parallel); when the app is just monitoring or
# waiting on a timer, fast-forward the clock.
DT_ACTION_MIN = 0.15   # ~9 s per active tap
DT_IDLE_MIN = 1.0      # fast-forward while waiting
# Cryoprecipitate redose cadence: cryo onset ~5 min, each dose ~+1 g/L, so redose to
# target every ~6 min while fibrinogen stays below the 2 g/L guidance threshold.
CRYO_REDOSE_MIN = 6


class AppBridge:
    """Persistent Node process wrapping the real computeNextPrompt."""
    def __init__(self):
        self.proc = subprocess.Popen(
            ["npx", "vite-node", "simulator/bridge/server.mjs"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, cwd=REPO,
        )
        self.proc.stdout.readline()   # consume {"ready":true}

    def next_prompt(self, session):
        self.proc.stdin.write(json.dumps(session) + "\n")
        self.proc.stdin.flush()
        return json.loads(self.proc.stdout.readline())

    def close(self):
        try:
            self.proc.terminate()
        except Exception:
            pass


def level_from_ebl(ebl):
    if ebl >= PPH_MASSIVE_ML:
        return "massive"
    if ebl >= PPH_MAJOR_ML:
        return "major"
    return "minor"


def task_done(session, task_id):
    return session["taskStates"].get(task_id, {}).get("status") == "done"


def crystalloid_rate_ml_min(session):
    """IV fluids after app tasks complete (R-TX-3b). Rapid crystalloid takes priority."""
    rapid_ml = session.get("rapidCrystMl", 0.0)
    if task_done(session, "rapid_cryst") and rapid_ml < MAJOR_CRYST_CAP_ML:
        return MAJOR_CRYST_ML_MIN
    if task_done(session, "iv_fluids"):
        return MINOR_FLUID_ML_MIN
    return 0.0


def stream(scenario, max_steps=300):
    """Generator: yields a per-step snapshot dict so a UI can animate it live.
    Each snapshot: {t, ebl, tone, bleed, map, lactate, ptype, tid, note, acted,
    verdict}. The final snapshot carries the terminal verdict."""
    start_ebl = scenario.get("start_ebl", 500)
    kw = {}
    if "base_tone" in scenario:      # firm uterus for a pure-trauma case
        kw["base_tone"] = scenario["base_tone"]
    p = PatientV4(
        scenario.get("weight_kg", 70),
        scenario.get("risk_factors", []),
        scenario.get("surgical_ineffective"),
        bmi=scenario.get("bmi", 25),
        start_ebl=start_ebl,
        treatment_response=scenario.get("treatment_response"),
        trauma_severity=scenario.get("trauma_severity", 0.0),
        **kw,
    )
    # no reflexive massage — the app prompts fundal_massage/bimanual itself, so she
    # presents at her true starting tone until the app actually orders massage.
    bridge = AppBridge()

    session = {
        "taskStates": {}, "level": level_from_ebl(start_ebl), "toneAssessed": False,
        "log": [{"kind": "blood_loss", "total": round(start_ebl), "time": 0}],
        "txaTime": None, "txaHandled": False, "txaSecondDone": False,
        "effectiveBirthTime": 0, "carboCount": 0, "carboLastTime": None,
        "ciCleared": {}, "forcedTasks": [], "now": 0,
        "uterotonicHold": False, "uterotonicEscalate": None, "queuedUterotonicId": None,
        "ivAccessPendingSince": None, "ivAccessRetries": 0, "ivFailSnoozeUntil": None,
        "infusionReassess": False, "sessionRecoveredAt": None, "forcedFollowUpId": None,
        "undoPromptHold": [],
    }
    transfusing = False
    mhp_active = False
    rapid_cryst_ml = 0.0
    surg_idx = 0
    last_cryo_min = None
    t_min = 0.0

    def mark_done(task_id):
        session["taskStates"][task_id] = {"status": "done", "doneAt": session["now"]}

    for _ in range(max_steps):
        now_ms = int(t_min * 60000)
        session["now"] = now_ms
        session["level"] = level_from_ebl(p.cumulative_bled)
        # keep the app's blood-loss log current so it sees rate / EBL
        session["log"] = [{"kind": "blood_loss", "total": round(p.cumulative_bled), "time": now_ms}]

        prompt = bridge.next_prompt(session)
        ptype = prompt.get("type")
        tid = prompt.get("taskId")
        note = ""

        # ── translate the app's recommendation into a physiological action ──
        if ptype in ("task", "ci_check", "followup") and tid in DRUG_MAP:
            if ptype == "ci_check":
                session["ciCleared"][tid] = True   # clear CI, drug given next
                note = f"clear CI for {tid}"
            else:
                p.give_uterotonic(DRUG_MAP[tid], t_min)
                if tid == "carboprost":
                    session["carboCount"] = max(1, session["carboCount"])
                    session["carboLastTime"] = now_ms
                mark_done(tid)
                if p.drug_refractory:
                    note = f"GIVE {tid} (no uterotonic response)"
                else:
                    note = f"GIVE {tid}"
        elif ptype == "carbo_dose":
            p.give_uterotonic("carboprost", t_min)
            session["carboCount"] += 1
            session["carboLastTime"] = now_ms
            note = f"carboprost repeat #{session['carboCount']}"
        elif ptype == "uterotonic_escalate":
            nxt = prompt.get("nextTaskId")
            if nxt in DRUG_MAP:
                p.give_uterotonic(DRUG_MAP[nxt], t_min)
                mark_done(nxt)
                note = f"escalate -> {nxt}"
        elif ptype == "task" and tid == "fundal_massage":
            p.give_fundal_massage(); mark_done(tid)
            note = "fundal massage" if not p.fundal_ineffective else "fundal massage (no response)"
        elif ptype == "task" and tid == "bimanual":
            p.start_bimanual_compression(t_min); mark_done(tid)
            note = "bimanual compression" if not p.bimanual_ineffective else "bimanual (no response)"
        elif ptype == "task" and tid in ("blood_products", "mhp_pack"):
            transfusing = True
            if tid == "mhp_pack":
                mhp_active = True
            mark_done(tid)
            note = f"START transfusion ({tid})"
        elif ptype == "task" and tid == "suture":
            p.give_repair(t_min); mark_done(tid)
            note = "suture / repair tear" if not p.repair_ineffective else \
                   "suture attempted — tear not controlled (needs theatre)"
        elif ptype == "task" and tid == "rapid_cryst":
            mark_done(tid); note = "START rapid crystalloid"
        elif ptype == "task" and tid == "iv_fluids":
            mark_done(tid); note = "START IV fluids"
        elif ptype == "consider" and tid == "bakri":
            if surg_idx < len(SURGICAL_SEQUENCE):
                step = SURGICAL_SEQUENCE[surg_idx]
                p.give_surgical(step, t_min)
                note = f">> SURGERY: {step}"
                if p.treatment_response and p.treatment_response.get(step) == "ineffective":
                    note += " (no physiological response)"
                surg_idx += 1
            mark_done(tid)
        elif ptype == "consider" and tid == "theatre":
            session["taskStates"]["theatre"] = {
                "status": "assigned", "assignedAt": now_ms, "preparing": True,
            }
            note = "theatre team preparing (assigned)"
        elif ptype == "theatre_transfer":
            # In theatre the team may proceed through the ladder in one mobilisation
            # (e.g. sutures fail → hysterectomy) without a second app prompt.
            steps_done = []
            while surg_idx < len(SURGICAL_SEQUENCE):
                step = SURGICAL_SEQUENCE[surg_idx]
                p.give_surgical(step, t_min)
                steps_done.append(step)
                surg_idx += 1
                if step not in p.surgical_ineffective:
                    break
            if steps_done:
                note = " >> THEATRE: " + " → ".join(steps_done)
                failed = [s for s in steps_done if s in p.surgical_ineffective]
                if failed:
                    note += f" ({', '.join(failed)} — no physiological response)"
            else:
                note = "theatre transfer (surgical ladder complete)"
            session["taskStates"]["theatre"] = {
                "status": "done", "doneAt": now_ms, "inTheatre": True,
            }
        elif ptype == "tone_check":
            session["toneAssessed"] = True
            # App asks immediately after massage — assess at peak fundal effect, not decayed.
            assess_tone = min(1.0, p.sustained_tone + (
                0.0 if p.fundal_ineffective else FUNDAL_TONE_PULSE))
            if assess_tone >= FUNDAL_FIRM_THRESHOLD:
                session["taskStates"]["bimanual"] = {
                    "status": "skipped", "skippedAt": now_ms, "skipReason": "not_required",
                }
                note = f"tone firm ({assess_tone:.2f}) — bimanual not required"
            else:
                note = f"tone boggy ({assess_tone:.2f}) — proceed to bimanual"
        elif ptype == "blood_loss_check":
            note = "blood loss check"   # log already reflects EBL
        elif ptype == "txa_second":
            p.give_txa(t_min)
            session["txaSecondDone"] = True
            note = "GIVE txa 2nd dose"
        elif ptype == "assess" and tid == "trauma_assess" and p.trauma_severity > 0:
            # SERA has a genital-tract tear → answer "present", which forces the app's
            # suture pathway (mirrors handleAssessPresent: done+present, treatment forced).
            session["taskStates"][tid] = {
                "status": "done", "doneAt": now_ms, "assessOutcome": "present",
            }
            if "suture" not in session["forcedTasks"]:
                session["forcedTasks"] = [*session["forcedTasks"], "suture"]
            note = f"TRAUMA present (sev {p.trauma_severity:.2f}) — proceed to repair"
        elif ptype == "assess" and tid:
            mark_done(tid); note = f"exclude {tid}"   # no trauma/tissue for this patient
        elif ptype in ("task", "ci_check", "consider", "followup") and tid:
            if ptype == "ci_check":
                session["ciCleared"][tid] = True
            elif tid == "theatre":
                pass  # handled above
            else:
                if tid == "txa":
                    session["txaTime"] = now_ms; session["txaHandled"] = True
                    p.give_txa(t_min)
                mark_done(tid)
            note = f"do {tid}"
        elif ptype in (None, "monitoring"):
            note = "(nothing / monitoring)"

        # active management is fast; idle/monitoring fast-forwards the clock
        acted = bool(note and note != "(nothing / monitoring)")
        step_dt = DT_ACTION_MIN if acted else DT_IDLE_MIN

        # ── infusion each step (rate-limited by cannulae) ──
        fluids_in = 0.0
        blood_in = 0.0
        ffp_in = 0.0
        cryst_rate = crystalloid_rate_ml_min(session)
        if cryst_rate > 0:
            fluids_in = cryst_rate * step_dt
            if task_done(session, "rapid_cryst"):
                room = MAJOR_CRYST_CAP_ML - rapid_cryst_ml
                fluids_in = min(fluids_in, room)
                rapid_cryst_ml += fluids_in
                session["rapidCrystMl"] = rapid_cryst_ml
        if transfusing and session["level"] in ("major", "massive"):
            prbc_rate = (MASSIVE_PRBC_ML_MIN if session["level"] == "massive"
                         else MAJOR_PRBC_ML_MIN)
            blood_in = prbc_rate * step_dt
            if mhp_active and session["level"] == "massive":
                ffp_in = MASSIVE_FFP_ML_MIN * step_dt

        # Cryoprecipitate per the blood-product guidance ("Cryoprecipitate 2 pools —
        # fibrinogen <2 g/L"). The app never prompts it discretely, so the operator,
        # following the written guidance, gives it to target while fibrinogen is low.
        # This is an operator-fidelity assumption (clinician reads guidance + the result).
        if transfusing and p.fibrinogen_low and (
                last_cryo_min is None or t_min - last_cryo_min >= CRYO_REDOSE_MIN):
            p.give_cryoprecipitate(t_min)
            last_cryo_min = t_min
            note = f"{note} · cryo 2 pools (fib {p.fibrinogen_g_l:.1f})".lstrip(" ·") if note else \
                   f"cryo 2 pools (fib {p.fibrinogen_g_l:.1f})"
            acted = True

        p.tick(t_min, dt_min=step_dt, fluids_in=fluids_in, blood_in=blood_in, ffp_in=ffp_in)
        t_min += step_dt

        snap = {
            "t": round(t_min, 2), "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
            "bleed": round(p.bleed_rate), "source_bleed": round(p.source_bleed_rate),
            "map": round(p.map), "lactate": round(p.lactate, 1),
            "fibrinogen": round(p.fibrinogen_g_l, 2), "coag_mult": round(p.coag_multiplier, 2),
            "level": session["level"], "ptype": ptype, "tid": tid, "note": note,
            "acted": acted, "verdict": None,
        }

        if p.arrested:
            snap["verdict"] = "ARREST"; bridge.close(); yield snap; return
        if p.durable_bleed_rate < 50 and p.map > 60:
            snap["verdict"] = "CONTROLLED"; bridge.close(); yield snap; return
        yield snap

    bridge.close()
    yield {"t": round(t_min, 2), "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
           "bleed": round(p.bleed_rate), "source_bleed": round(p.source_bleed_rate),
           "map": round(p.map), "lactate": round(p.lactate, 1),
           "fibrinogen": round(p.fibrinogen_g_l, 2), "coag_mult": round(p.coag_multiplier, 2),
           "level": session.get("level"), "ptype": None, "tid": None, "note": "(time up)",
           "acted": False, "verdict": "ONGOING"}


def run(scenario, verbose=True):
    """CLI consumer of stream() — single source of truth."""
    last, logs = None, []
    for snap in stream(scenario):
        last = snap
        if snap["acted"]:
            logs.append(f"  t={snap['t']:>4.1f}  EBL={snap['ebl']:>5.0f}  tone={snap['tone']:.2f}  "
                        f"bleed={snap['bleed']:>4.0f}  MAP={snap['map']:>3.0f}  | app: "
                        f"{snap['ptype'] or '-'} {snap['tid'] or ''} -> {snap['note']}")
    return {"verdict": last["verdict"], "t": last["t"], "ebl": last["ebl"],
            "final_tone": last["tone"], "log": logs}


if __name__ == "__main__":
    sc = {"name": "low-risk", "weight_kg": 70, "bmi": 25, "risk_factors": []}
    print("App-as-operator — real SOS engine driving the simulated patient\n")
    res = run(sc)
    print("\n".join(res["log"]))
    print(f"\n  VERDICT: {res['verdict']} at t={res['t']} min | EBL {res['ebl']} ml | final tone {res['final_tone']}")
