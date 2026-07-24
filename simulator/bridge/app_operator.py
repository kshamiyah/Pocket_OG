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
for _path in (HERE, SIM):
    if _path not in sys.path:
        sys.path.insert(0, _path)

from stage4_sandbox import PatientV4, FUNDAL_FIRM_THRESHOLD, FUNDAL_TONE_PULSE   # noqa: E402
from stage3_sandbox import (           # noqa: E402
    PPH_MAJOR_ML, PPH_MASSIVE_ML, MAJOR_PRBC_ML_MIN, MASSIVE_PRBC_ML_MIN, MASSIVE_FFP_ML_MIN,
    MINOR_FLUID_ML_MIN, MAJOR_CRYST_ML_MIN, MAJOR_CRYST_CAP_ML, CONTROLLED_BLEED,
)
from scoring import grade_outcome, exsanguinating_warning, summarise_margin  # noqa: E402
from human_factors import (            # noqa: E402
    MIN_ACTION_MIN, action_delay_min, format_duration, normalize_human_factors,
    theatre_ready_delay_min, transfusion_start_delay_min, CALL_TASK_IDS,
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
DT_IDLE_MIN = 1.0      # fast-forward during monitoring (no task in progress)
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


def _skip_carboprost_asthma(session, now_ms):
    """R-TX-5: asthma → carboprost skipped entirely."""
    session["taskStates"]["carboprost"] = {
        "status": "skipped", "skippedAt": now_ms, "skipReason": "asthma",
    }


def _terminal_verdict(p):
    """Death: coronary fuse (ARREST) or oxygen debt (IRREVERSIBLE_SHOCK). Survivors graded."""
    if p.is_dead:
        return "ARREST" if p.death_cause == "cardiac_arrest" else "IRREVERSIBLE_SHOCK"
    if p.durable_bleed_rate < CONTROLLED_BLEED and p.map > 60:
        return grade_outcome(p, p._now_min, controlled=True)
    return None


def _prompt_is_actionable(ptype, tid):
    if ptype in (None, "monitoring"):
        return False
    return True


def _prompt_key(prompt):
    """Identity for de-duplicating in-flight delegations."""
    return (
        prompt.get("type"),
        prompt.get("taskId"),
        prompt.get("nextTaskId"),
    )


def _in_flight_has_prompt(in_flight, prompt):
    key = _prompt_key(prompt)
    return any(_prompt_key(item["prompt"]) == key for item in in_flight)


def _lanes_in_use(in_flight):
    return sum(1 for item in in_flight if item.get("uses_lane", True))


def _prompt_uses_lane(ptype, tid):
    """Calls are fire-and-forget — they do not occupy a parallel slot."""
    if tid in CALL_TASK_IDS:
        return False
    return _prompt_is_actionable(ptype, tid)


def _prompt_label(prompt):
    return _task_wait_name(prompt.get("type"), prompt.get("taskId"))


def _in_flight_detail(in_flight, t_min):
    rows = []
    for item in in_flight:
        prompt = item["prompt"]
        rows.append({
            "task": _prompt_label(prompt),
            "ptype": prompt.get("type"),
            "tid": prompt.get("taskId"),
            "remaining_min": round(max(0.0, item["until"] - t_min), 2),
            "until": round(item["until"], 2),
            "uses_lane": item.get("uses_lane", True),
        })
    return rows


def _completion_delay_min(prompt, ptype, tid, hf, bleed, map_mmhg, t_min, theatre_ready_at):
    if ptype == "theatre_transfer" and theatre_ready_at is not None and t_min < theatre_ready_at:
        return max(MIN_ACTION_MIN, theatre_ready_at - t_min)
    if tid in CALL_TASK_IDS:
        return MIN_ACTION_MIN
    return action_delay_min(ptype, tid, hf, bleed, map_mmhg)


def _task_wait_name(ptype, tid):
    if tid:
        return tid.replace("_", " ")
    if ptype:
        return ptype.replace("_", " ")
    return "task"


def _pending_wait_note(pending, t_min):
    """Log line while a human-factors delay is counting down."""
    remaining = max(0.0, pending["until"] - t_min)
    total = pending["total_min"]
    prompt = pending["prompt"]
    tid = prompt.get("taskId")
    name = _task_wait_name(prompt.get("type"), tid)
    if pending.get("kind") == "theatre":
        name = "theatre mobilisation"
    elif tid == "manual_removal":
        name = "manual removal setup"
    return (
        f"WAIT {name}: {format_duration(remaining)} left "
        f"(scheduled {format_duration(total)})"
    )


def _blood_wait_note(t_min, transfusion_starts_at, blood_wait_total):
    remaining = max(0.0, transfusion_starts_at - t_min)
    return (
        f"WAIT first PRBC: {format_duration(remaining)} left "
        f"(scheduled {format_duration(blood_wait_total)})"
    )


def _wait_step_dt(t_min, until_t):
    """Advance toward a deadline without overshooting (sub-minute waits stay sub-minute)."""
    remaining = until_t - t_min
    if remaining <= MIN_ACTION_MIN:
        return max(MIN_ACTION_MIN, remaining)
    return min(DT_IDLE_MIN, remaining)


def stream(scenario, max_steps=300):
    """Generator: yields a per-step snapshot dict so a UI can animate it live.
    Each snapshot: {t, ebl, tone, bleed, map, lactate, ptype, tid, note, acted,
    verdict}. The final snapshot carries the terminal verdict."""
    hf = normalize_human_factors(scenario.get("human_factors"))
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
        tissue_severity=scenario.get("tissue_severity", 0.0),
        manual_removal_duration_min=scenario.get("manual_removal_duration_min", 4.0),
        starting_Hb=scenario.get("starting_Hb", 110.0),
        **kw,
    )
    # no reflexive massage — the app prompts fundal_massage/bimanual itself, so she
    # presents at her true starting tone until the app actually orders massage.
    bridge = AppBridge()
    asthma = bool(scenario.get("asthma"))

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
    blood_ordered = False
    blood_ordered_at = None
    blood_wait_total = None
    transfusion_starts_at = None
    mhp_active = False
    rapid_cryst_ml = 0.0
    surg_idx = 0
    last_cryo_min = None
    theatre_ready_at = None
    theatre_assigned_at = None
    t_min = 0.0
    team_lanes = hf["team_lanes"]
    in_flight = []   # concurrent delegated jobs: {prompt, until, total_min, uses_lane, kind?}

    def mark_done(task_id):
        session["taskStates"][task_id] = {"status": "done", "doneAt": session["now"]}

    def on_dispatch(prompt):
        """Leader delegates — mark in-progress so the SOS engine moves on."""
        nonlocal theatre_assigned_at, theatre_ready_at
        ptype = prompt.get("type")
        tid = prompt.get("taskId")
        now_ms = session["now"]
        if ptype == "consider" and tid == "theatre":
            session["taskStates"]["theatre"] = {
                "status": "assigned", "assignedAt": now_ms, "preparing": True,
            }
            theatre_assigned_at = t_min
            ready_wait = theatre_ready_delay_min(hf, p.bleed_rate, p.map)
            theatre_ready_at = t_min + ready_wait
            return (
                f"delegate theatre — ready at t≈{theatre_ready_at:.1f} min "
                f"({format_duration(ready_wait)} mobilisation)"
            )
        if tid:
            if tid == "iv_access":
                session["ivAccessPendingSince"] = now_ms
            session["taskStates"][tid] = {"status": "assigned", "assignedAt": now_ms}
        return None

    def apply_prompt(prompt):
        """Translate one app recommendation into session + physiology updates."""
        nonlocal blood_ordered, blood_ordered_at, blood_wait_total, transfusion_starts_at
        nonlocal mhp_active, surg_idx, theatre_ready_at, theatre_assigned_at
        ptype = prompt.get("type")
        tid = prompt.get("taskId")
        now_ms = session["now"]
        note = ""

        if ptype in ("task", "ci_check", "followup") and tid in DRUG_MAP:
            if asthma and tid == "carboprost":
                _skip_carboprost_asthma(session, now_ms)
                note = "carboprost CONTRAINDICATED (asthma) — skip"
            elif ptype == "ci_check":
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
            if asthma:
                _skip_carboprost_asthma(session, now_ms)
                note = "carboprost CONTRAINDICATED (asthma) — skip repeat"
            else:
                p.give_uterotonic("carboprost", t_min)
                session["carboCount"] += 1
                session["carboLastTime"] = now_ms
                note = f"carboprost repeat #{session['carboCount']}"
        elif ptype == "uterotonic_escalate":
            nxt = prompt.get("nextTaskId")
            if nxt in DRUG_MAP:
                if asthma and nxt == "carboprost":
                    _skip_carboprost_asthma(session, now_ms)
                    note = "carboprost CONTRAINDICATED (asthma) — skip escalation"
                else:
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
            blood_ordered = True
            blood_ordered_at = t_min
            if transfusion_starts_at is None:
                blood_wait_total = transfusion_start_delay_min(hf, p.bleed_rate, p.map)
                transfusion_starts_at = t_min + blood_wait_total
            if tid == "mhp_pack":
                mhp_active = True
            mark_done(tid)
            note = (
                f"ORDER {tid} — PRBC infusion from t≈{transfusion_starts_at:.1f} min "
                f"({format_duration(blood_wait_total)} wait)"
            )
        elif ptype == "task" and tid == "suture":
            p.give_repair(t_min); mark_done(tid)
            note = "suture / repair tear" if not p.repair_ineffective else \
                   "suture attempted — tear not controlled (needs theatre)"
        elif ptype == "task" and tid == "manual_removal":
            p.give_manual_removal(t_min)
            mark_done(tid)
            proc = format_duration(p.manual_removal_duration_min)
            if p.manual_removal_ineffective:
                note = (
                    f"manual removal started ({proc} procedure) — "
                    "no cleavage plane suspected (accreta)"
                )
            else:
                note = f"manual removal started ({proc} procedure) — clears tissue on completion"
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
            note = "theatre mobilisation continues"
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
            # App asks immediately after massage — assess at peak fundal effect, capped
            # by tissue ceiling (retained products feel boggy even after massage).
            assess_tone = min(1.0, p.sustained_tone + (
                0.0 if p.fundal_ineffective else FUNDAL_TONE_PULSE))
            assess_tone = min(assess_tone, p.tissue_ceiling)
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
        elif ptype == "assess" and tid == "tissue_assess" and p.tissue_severity > 0:
            session["taskStates"][tid] = {
                "status": "done", "doneAt": now_ms, "assessOutcome": "present",
            }
            if "manual_removal" not in session["forcedTasks"]:
                session["forcedTasks"] = [*session["forcedTasks"], "manual_removal"]
            note = (
                f"TISSUE present (sev {p.tissue_severity:.2f}, "
                f"ceiling {p.tissue_ceiling:.2f}) — proceed to manual removal"
            )
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

        return note, ptype, tid

    def infuse_and_tick(step_dt, note, is_waiting=False):
        """Advance physiology; return (note, acted) after optional cryo."""
        nonlocal last_cryo_min, rapid_cryst_ml
        acted = bool(note and note != "(nothing / monitoring)" and not is_waiting)

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
        prbc_flowing = (
            blood_ordered and transfusion_starts_at is not None and t_min >= transfusion_starts_at
        )
        if prbc_flowing and session["level"] in ("major", "massive"):
            prbc_rate = (MASSIVE_PRBC_ML_MIN if session["level"] == "massive"
                         else MAJOR_PRBC_ML_MIN)
            blood_in = prbc_rate * step_dt
            if mhp_active and session["level"] == "massive":
                ffp_in = MASSIVE_FFP_ML_MIN * step_dt

        if prbc_flowing and p.fibrinogen_low and (
                last_cryo_min is None or t_min - last_cryo_min >= CRYO_REDOSE_MIN):
            p.give_cryoprecipitate(t_min)
            last_cryo_min = t_min
            cryo_note = f"cryo 2 pools (fib {p.fibrinogen_g_l:.1f})"
            note = f"{note} · {cryo_note}".lstrip(" ·") if note else cryo_note
            acted = True

        p.tick(t_min, dt_min=step_dt, fluids_in=fluids_in, blood_in=blood_in, ffp_in=ffp_in)
        return note, acted

    for _ in range(max_steps):
        now_ms = int(t_min * 60000)
        session["now"] = now_ms
        session["level"] = level_from_ebl(p.cumulative_bled)
        session["log"] = [{"kind": "blood_loss", "total": round(p.cumulative_bled), "time": now_ms}]

        ptype, tid = None, None
        events = []
        is_waiting = False
        step_dt = DT_IDLE_MIN

        # 1 — complete any delegated jobs whose timers have expired
        still = []
        for item in in_flight:
            if t_min >= item["until"]:
                note, ptype, tid = apply_prompt(item["prompt"])
                events.append({
                    "kind": "DONE",
                    "text": note,
                    "ptype": item["prompt"].get("type"),
                    "tid": item["prompt"].get("taskId"),
                    "task": _prompt_label(item["prompt"]),
                })
            else:
                still.append(item)
        in_flight = still

        # 2 — leader dispatches into free lanes (fast cadence; completions run in parallel)
        while _lanes_in_use(in_flight) < team_lanes:
            prompt = bridge.next_prompt(session)
            ptype = prompt.get("type")
            tid = prompt.get("taskId")
            if not _prompt_is_actionable(ptype, tid):
                break
            if _in_flight_has_prompt(in_flight, prompt):
                break

            uses_lane = _prompt_uses_lane(ptype, tid)
            if uses_lane and _lanes_in_use(in_flight) >= team_lanes:
                break

            # Theatre assign: instant delegation, mobilisation runs in background
            if ptype == "consider" and tid == "theatre":
                msg = on_dispatch(prompt)
                if msg:
                    events.append({"kind": "DELEGATE", "text": msg, "ptype": ptype, "tid": tid, "task": "theatre"})
                continue

            # Calls: fire-and-forget — no lane slot
            if tid in CALL_TASK_IDS:
                on_dispatch(prompt)
                note, ptype, tid = apply_prompt(prompt)
                events.append({"kind": "DONE", "text": note, "ptype": ptype, "tid": tid, "task": _prompt_label(prompt)})
                continue

            delay = _completion_delay_min(
                prompt, ptype, tid, hf, p.bleed_rate, p.map, t_min, theatre_ready_at,
            )
            delegate_note = on_dispatch(prompt)
            task = _prompt_label(prompt)

            if delay <= MIN_ACTION_MIN + 0.01:
                note, ptype, tid = apply_prompt(prompt)
                if delegate_note:
                    events.append({"kind": "DELEGATE", "text": delegate_note, "ptype": ptype, "tid": tid, "task": task})
                events.append({"kind": "DONE", "text": note, "ptype": ptype, "tid": tid, "task": task})
            else:
                total = delay
                if ptype == "theatre_transfer" and theatre_ready_at is not None:
                    total = theatre_ready_at - (theatre_assigned_at or t_min)
                item = {
                    "prompt": prompt,
                    "until": t_min + delay,
                    "started_at": t_min,
                    "total_min": total,
                    "uses_lane": uses_lane,
                }
                if ptype == "theatre_transfer":
                    item["kind"] = "theatre"
                in_flight.append(item)
                pending_view = {
                    "prompt": prompt,
                    "until": item["until"],
                    "total_min": total,
                    "kind": item.get("kind"),
                }
                if delegate_note:
                    events.append({"kind": "DELEGATE", "text": delegate_note, "ptype": ptype, "tid": tid, "task": task})
                events.append({
                    "kind": "WAIT",
                    "text": _pending_wait_note(pending_view, t_min),
                    "ptype": ptype,
                    "tid": tid,
                    "task": task,
                    "until": round(item["until"], 2),
                })

        if in_flight:
            is_waiting = True
            step_dt = min(_wait_step_dt(t_min, item["until"]) for item in in_flight)
        elif events:
            step_dt = MIN_ACTION_MIN
        else:
            step_dt = DT_IDLE_MIN

        note = " · ".join(e["text"] for e in events if e.get("text")) or "(nothing / monitoring)"
        if not events:
            ptype, tid = None, None

        # Blood bank delay runs in parallel with other prompts until PRBC starts.
        if (
            not is_waiting
            and blood_ordered
            and transfusion_starts_at is not None
            and t_min < transfusion_starts_at
            and note in ("(nothing / monitoring)", "")
        ):
            blood_note = _blood_wait_note(t_min, transfusion_starts_at, blood_wait_total or 0.0)
            events.append({"kind": "BLOOD", "text": blood_note})
            note = blood_note
            is_waiting = True
            step_dt = _wait_step_dt(t_min, transfusion_starts_at)

        note, acted = infuse_and_tick(step_dt, note, is_waiting=is_waiting)
        t_min += step_dt

        snap = {
            "t": round(t_min, 2), "step_dt": round(step_dt, 3),
            "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
            "bleed": round(p.bleed_rate), "source_bleed": round(p.source_bleed_rate),
            "map": round(p.map), "hr": round(p.heart_rate),
            "hb": round(p.hb_g_l, 1), "do2": round(p.oxygen_delivery, 2),
            "lactate": round(p.lactate, 1), "oxygen_debt": round(p.oxygen_debt, 1),
            "fibrinogen": round(p.fibrinogen_g_l, 2), "coag_mult": round(p.coag_multiplier, 2),
            "cpp": round(p.coronary_perfusion_pressure, 1),
            "level": session["level"], "ptype": ptype, "tid": tid, "note": note,
            "events": events,
            "in_flight_detail": _in_flight_detail(in_flight, t_min),
            "acted": acted, "verdict": None,
            "exsanguinating": exsanguinating_warning(p),
            "cardiac_arrest": p.cardiac_arrest_active,
            "arrest_min": round(p._minutes_in_arrest, 2),
            "death_cause": p.death_cause,
            "in_flight": len(in_flight),
            "lanes_in_use": _lanes_in_use(in_flight),
            "team_lanes": team_lanes,
        }

        verdict = _terminal_verdict(p)
        if verdict:
            snap["verdict"] = verdict
            snap["margin"] = p.margin_snapshot()
            bridge.close()
            yield snap
            return
        yield snap

    bridge.close()
    yield {"t": round(t_min, 2), "ebl": round(p.cumulative_bled), "tone": round(p.tone, 2),
           "bleed": round(p.bleed_rate), "source_bleed": round(p.source_bleed_rate),
           "map": round(p.map), "hr": round(p.heart_rate),
           "lactate": round(p.lactate, 1), "oxygen_debt": round(p.oxygen_debt, 1),
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
