#!/usr/bin/env python3
"""
App-as-operator loop (Option A) — the REAL Pocket O&G PPH SOS engine drives the
validated Python patient.

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

from stage4_sandbox import PatientV4   # noqa: E402
from stage3_sandbox import (           # noqa: E402
    PPH_MAJOR_ML, PPH_MASSIVE_ML, MAJOR_INFUSION_ML_MIN, MASSIVE_INFUSION_ML_MIN,
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


def stream(scenario, max_steps=300):
    """Generator: yields a per-step snapshot dict so a UI can animate it live.
    Each snapshot: {t, ebl, tone, bleed, map, lactate, ptype, tid, note, acted,
    verdict}. The final snapshot carries the terminal verdict."""
    p = PatientV4(scenario.get("weight_kg", 70), scenario.get("risk_factors", []),
                  scenario.get("surgical_ineffective"), bmi=scenario.get("bmi", 25))
    p.give_massage()   # bimanual compression is reflexive; app will also prompt it
    bridge = AppBridge()

    session = {
        "taskStates": {}, "level": "minor", "toneAssessed": False,
        "log": [{"kind": "blood_loss", "total": 0, "time": 0}],
        "txaTime": None, "txaHandled": False, "txaSecondDone": False,
        "effectiveBirthTime": 0, "carboCount": 0, "carboLastTime": None,
        "ciCleared": {}, "forcedTasks": [], "now": 0,
        "uterotonicHold": False, "uterotonicEscalate": None, "queuedUterotonicId": None,
        "ivAccessPendingSince": None, "ivAccessRetries": 0, "ivFailSnoozeUntil": None,
        "infusionReassess": False, "sessionRecoveredAt": None, "forcedFollowUpId": None,
        "undoPromptHold": [],
    }
    transfusing = False
    surg_idx = 0
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
            p.give_massage(); mark_done(tid); note = "massage"
        elif ptype == "task" and tid == "bimanual":
            p.give_massage(); mark_done(tid); note = "bimanual compression"
        elif ptype == "task" and tid in ("blood_products", "mhp_pack", "rapid_cryst"):
            transfusing = True; mark_done(tid); note = f"START transfusion ({tid})"
        elif ptype == "consider" and tid == "bakri":
            if surg_idx < len(SURGICAL_SEQUENCE):
                p.give_surgical(SURGICAL_SEQUENCE[surg_idx], t_min)
                note = f">> SURGERY: {SURGICAL_SEQUENCE[surg_idx]}"; surg_idx += 1
            mark_done(tid)
        elif ptype == "theatre_transfer":
            if surg_idx < len(SURGICAL_SEQUENCE):
                p.give_surgical(SURGICAL_SEQUENCE[surg_idx], t_min)
                note = f">> THEATRE: {SURGICAL_SEQUENCE[surg_idx]}"; surg_idx += 1
            mark_done("theatre")
        elif ptype == "tone_check":
            session["toneAssessed"] = True; note = "assess tone"
        elif ptype == "blood_loss_check":
            note = "blood loss check"   # log already reflects EBL
        elif ptype == "assess" and tid:
            mark_done(tid); note = f"exclude {tid}"   # atony scenarios: no trauma/tissue
        elif ptype in ("task", "ci_check", "consider", "followup") and tid:
            if ptype == "ci_check":
                session["ciCleared"][tid] = True
            else:
                if tid == "txa":
                    session["txaTime"] = now_ms; session["txaHandled"] = True
                mark_done(tid)
            note = f"do {tid}"
        elif ptype in (None, "monitoring"):
            note = "(nothing / monitoring)"

        # active management is fast; idle/monitoring fast-forwards the clock
        acted = bool(note and note != "(nothing / monitoring)")
        step_dt = DT_ACTION_MIN if acted else DT_IDLE_MIN

        # ── transfusion each step (rate-limited by cannulae) ──
        blood_in = 0.0
        if transfusing and session["level"] in ("major", "massive"):
            rate = MASSIVE_INFUSION_ML_MIN if session["level"] == "massive" else MAJOR_INFUSION_ML_MIN
            blood_in = min(rate, p.bleed_rate) * step_dt

        snap = {
            "t": round(t_min, 2), "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
            "bleed": round(p.bleed_rate), "map": round(p.map), "lactate": round(p.lactate, 1),
            "level": session["level"], "ptype": ptype, "tid": tid, "note": note,
            "acted": acted, "verdict": None,
        }

        p.tick(t_min, dt_min=step_dt, blood_in=blood_in)
        t_min += step_dt

        if p.arrested:
            snap["verdict"] = "ARREST"; bridge.close(); yield snap; return
        if p.bleed_rate < 50 and p.map > 60:
            snap["verdict"] = "CONTROLLED"; bridge.close(); yield snap; return
        yield snap

    bridge.close()
    yield {"t": round(t_min, 2), "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
           "bleed": round(p.bleed_rate), "map": round(p.map), "lactate": round(p.lactate, 1),
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
