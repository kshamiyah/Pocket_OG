"""
SERA human factors — editable team timing for the app-as-operator loop.

Thirteen timing parameters + team_lanes (v1):
  1. team_experience       — multiplier on all delays (lower = faster/senior)
  2. stress_sensitivity    — how much low MAP / high bleed lengthen delays
  3–8. task delay buckets  — hands_on, calls, assess, consider, followup, default
  9. blood_lab_prep_min    — lab / crossmatch prep after blood is ordered
 10. first_prbc_min        — porter + setup after units are ready
 11. theatre_mobilisation_min — assign → ready for theatre_transfer
 12. manual_removal_logistics_min — anaesthesia / setup before manual removal starts
 13. o_neg_immediate        — skip crossmatch prep (use first_prbc only)
 14. team_lanes             — max delegated jobs in-flight at once (Fix 2)

Blood timing: total wait before PRBC infusion =
  (0 if o_neg_immediate else blood_lab_prep_min) + first_prbc_min,
  each scaled by team_experience × stress_multiplier.
"""

from __future__ import annotations

# ── Parameter keys (exactly 12) ───────────────────────────────────────────────

HF_KEYS = (
    "team_experience",
    "stress_sensitivity",
    "delay_hands_on_min",
    "delay_calls_min",
    "delay_assess_min",
    "delay_consider_min",
    "delay_followup_min",
    "delay_default_min",
    "blood_lab_prep_min",
    "first_prbc_min",
    "theatre_mobilisation_min",
    "manual_removal_logistics_min",
    "o_neg_immediate",
    "team_lanes",
)

HF_PRESET_OPTIONS = {
    "ideal_robot": "Ideal robot — every tap instant (tests the protocol only)",
    "competent": "Competent team — realistic ward timing (default)",
    "busy_shift": "Busy shift — ward under pressure (between competent and stretched)",
    "stretched": "Stretched shift — solo trainee, crossmatch blood",
    "chaotic": "Chaotic shift — slow team, long blood/theatre waits",
    "custom": "Custom — tune each timing yourself",
}

HF_PRESET_BLURBS = {
    "ideal_robot": (
        "The simulated clinician taps every SOS prompt immediately. "
        "Use this to ask: *does the protocol work if executed perfectly?*"
    ),
    "competent": (
        "Typical experienced team: IV and drugs in under a minute, "
        "first blood ~10 min, theatre ~15 min. O-neg used without waiting for crossmatch."
    ),
    "busy_shift": (
        "Short-staffed but still sharp: hands-on stays ~30 s, calls a little slower, "
        "team runs at ~1.15× speed. Scenario 1 survives with higher EBL than competent; "
        "the step before stretched."
    ),
    "stretched": (
        "One busy junior covering several jobs. Hands-on stretches to ~1 min; "
        "blood bank crossmatch adds delay. Often too slow for early atonic PPH."
    ),
    "chaotic": (
        "Understaffed, panicky shift. Everything slows further when she is crashing."
    ),
    "custom": "Set how fast the team acts and how long blood bank / theatre take.",
}

# Labels for custom controls (value stored in human_factors dict)
EXPERIENCE_CHOICES = {
    "Senior team — fast": 0.7,
    "Competent — typical": 1.0,
    "Busy shift — under pressure": 1.15,
    "Stretched — busy / junior": 1.35,
    "Solo trainee — slow": 1.6,
}

STRESS_CHOICES = {
    "Stays calm when unstable": 0.0,
    "Normal — slows a little under stress": 0.5,
    "Panic — much slower when crashing": 1.0,
}

# Plain labels → minutes stored in human_factors (no raw numbers in the UI)
TASK_SPEED_CHOICES = {
    "Instant — done as soon as SOS prompts": 0.0,
    "~15 seconds": 0.25,
    "~30 seconds": 0.5,
    "~1 minute": 1.0,
    "~2 minutes": 2.0,
    "~3 minutes": 3.0,
    "~5 minutes": 5.0,
}

LOGISTICS_TIME_CHOICES = {
    "Instant": 0.0,
    "~5 minutes": 5.0,
    "~10 minutes": 10.0,
    "~15 minutes": 15.0,
    "~20 minutes": 20.0,
    "~30 minutes": 30.0,
}

THEATRE_TIME_CHOICES = {
    "Instant": 0.0,
    "~10 minutes": 10.0,
    "~15 minutes": 15.0,
    "~25 minutes": 25.0,
    "~35 minutes": 35.0,
    "~45 minutes": 45.0,
    "~60 minutes": 60.0,
}

# Sidebar copy for each task-speed bucket (custom mode)
TASK_SPEED_BUCKETS = (
    {
        "key": "delay_hands_on_min",
        "title": "Hands-on clinical — how long to act?",
        "sos_examples": "SOS prompts: IV access, oxytocin, massage, TXA, order blood products.",
        "help": "Time from the prompt appearing to the team actually doing it.",
    },
    {
        "key": "delay_calls_min",
        "title": "Calls and escalation — how long to act?",
        "sos_examples": "SOS prompts: call for help, call major PPH, activate massive haemorrhage protocol.",
        "help": "Includes finding the phone, bleeping, and brief handover.",
    },
    {
        "key": "delay_assess_min",
        "title": "Checks and assessment — how long to act?",
        "sos_examples": "SOS prompts: check uterine tone, log blood loss, trauma/tissue assess.",
        "help": "Quick clinical checks, not major decisions.",
    },
    {
        "key": "delay_consider_min",
        "title": "Big decisions — how long to act?",
        "sos_examples": "SOS prompts: consider Bakri balloon, send to theatre.",
        "help": "Time to discuss, consent, and mobilise before committing.",
    },
    {
        "key": "delay_followup_min",
        "title": "Chasing delegated jobs — how long to act?",
        "sos_examples": "SOS prompts: confirm someone else completed an assigned task.",
        "help": "e.g. you assigned IV access — how long until someone confirms it is in.",
    },
    {
        "key": "delay_default_min",
        "title": "Everything else — how long to act?",
        "sos_examples": "Any SOS prompt not covered above.",
        "help": "Catch-all for miscellaneous steps.",
    },
)


def choice_for_value(choices, value, default_label):
    for label, v in choices.items():
        if abs(v - float(value)) < 0.01:
            return label
    return choice_for_nearest(choices, value, default_label)


def choice_for_nearest(choices, value, default_label):
    """Pick the closest labelled option for a stored minute value."""
    try:
        target = float(value)
    except (TypeError, ValueError):
        return default_label
    best_label, best_dist = default_label, float("inf")
    for label, minutes in choices.items():
        dist = abs(minutes - target)
        if dist < best_dist:
            best_dist = dist
            best_label = label
    return best_label


def format_duration(minutes):
    """Turn simulation minutes into readable text."""
    if minutes is None or minutes <= 0:
        return "instant"
    secs = minutes * 60
    if secs < 90:
        return f"~{int(round(secs))} seconds"
    if minutes < 10:
        whole = int(minutes) if abs(minutes - round(minutes)) < 0.05 else None
        return f"~{whole} min" if whole is not None else f"~{minutes:.1f} min"
    return f"~{int(round(minutes))} min"

# Competent-team baseline (literature-anchored where noted in RESEARCH_BRIEF)
COMPETENT = {
    "team_experience": 1.0,
    "stress_sensitivity": 0.5,
    "delay_hands_on_min": 0.5,
    "delay_calls_min": 0.3,
    "delay_assess_min": 0.2,
    "delay_consider_min": 1.0,
    "delay_followup_min": 1.5,   # ~90 s chase
    "delay_default_min": 0.25,
    "blood_lab_prep_min": 5.0,   # MHP / lab activation ~5 min
    "first_prbc_min": 10.0,      # first unit at bedside ~10–15 min
    "theatre_mobilisation_min": 15.0,
    "manual_removal_logistics_min": 8.0,  # anaesthetist / setup before ERPC starts
    "o_neg_immediate": True,
    "team_lanes": 5,                 # leader + nurse + anaesthetist + runner
}

HF_PRESETS = {
    "ideal_robot": {
        **COMPETENT,
        "team_experience": 0.05,
        "stress_sensitivity": 0.0,
        "delay_hands_on_min": 0.0,
        "delay_calls_min": 0.0,
        "delay_assess_min": 0.0,
        "delay_consider_min": 0.0,
        "delay_followup_min": 0.0,
        "delay_default_min": 0.0,
        "blood_lab_prep_min": 0.0,
        "first_prbc_min": 0.0,
        "theatre_mobilisation_min": 0.0,
        "manual_removal_logistics_min": 0.0,
        "o_neg_immediate": True,
        "team_lanes": 99,
    },
    "competent": dict(COMPETENT),
    "busy_shift": {
        **COMPETENT,
        "team_experience": 1.15,
        "stress_sensitivity": 0.55,
        "delay_hands_on_min": 0.5,   # keep ~30 s — hands-on is the survival bottleneck
        "delay_calls_min": 0.45,
        "delay_followup_min": 2.0,
        "first_prbc_min": 11.0,
        "theatre_mobilisation_min": 18.0,
        "manual_removal_logistics_min": 9.0,
        "o_neg_immediate": True,
        "team_lanes": 3,
    },
    "stretched": {
        **COMPETENT,
        "team_experience": 1.35,
        "stress_sensitivity": 0.75,
        "delay_hands_on_min": 1.0,
        "delay_calls_min": 0.8,
        "delay_followup_min": 2.5,
        "blood_lab_prep_min": 8.0,
        "first_prbc_min": 18.0,
        "theatre_mobilisation_min": 25.0,
        "manual_removal_logistics_min": 12.0,
        "o_neg_immediate": False,
        "team_lanes": 2,
    },
    "chaotic": {
        **COMPETENT,
        "team_experience": 1.6,
        "stress_sensitivity": 1.0,
        "delay_hands_on_min": 1.5,
        "delay_calls_min": 1.2,
        "delay_consider_min": 2.0,
        "delay_followup_min": 3.0,
        "blood_lab_prep_min": 12.0,
        "first_prbc_min": 25.0,
        "theatre_mobilisation_min": 35.0,
        "manual_removal_logistics_min": 18.0,
        "o_neg_immediate": False,
        "team_lanes": 1,
    },
}

TEAM_LANES_CHOICES = {
    "Solo — one person doing everything": 1,
    "Short-staffed — 2 available": 2,
    "Stretched — 3 available": 3,
    "Busy ward — 4 available": 4,
    "Full PPH team — 5 available": 5,
    "Large team — 8 available": 8,
    "Unlimited (ideal robot)": 99,
}

# Minimum action tick so the ideal robot stays ~9 s per tap when delays are 0.
MIN_ACTION_MIN = 0.15

# ── Task → bucket mapping (SOS task ids from pph-logic.js) ──────────────────

_CALLS = frozenset({
    "call_team", "call_major", "call_massive", "cardiac_arrest_ref",
})

# Exported for app_operator (calls are fire-and-forget — no lane slot).
CALL_TASK_IDS = _CALLS

_HANDS_ON = frozenset({
    "abc", "iv_access", "second_cannula", "fundal_massage", "bimanual",
    "trauma_assess", "tissue_assess", "suture", "catheterise",
    "iv_fluids", "oxytocin_bolus", "oxytocin_inf", "ergometrine", "carboprost",
    "misoprostol", "coag_review", "txa", "rapid_cryst", "keep_warm", "calcium",
    "rotem_teg", "blood_products", "mhp_pack", "cell_salvage",
})

_CONSIDER = frozenset({"bakri", "theatre"})


def default_human_factors():
    return dict(COMPETENT)


def normalize_human_factors(raw):
    """Merge partial dict with defaults; coerce types."""
    out = default_human_factors()
    if not raw:
        return out
    for key in HF_KEYS:
        if key not in raw:
            continue
        val = raw[key]
        if key == "o_neg_immediate":
            out[key] = bool(val)
        elif key == "team_lanes":
            out[key] = max(1, int(round(float(val))))
        else:
            out[key] = max(0.0, float(val))
    return out


def preset_human_factors(preset_key):
    if preset_key in HF_PRESETS:
        return dict(HF_PRESETS[preset_key])
    return default_human_factors()


def stress_level(bleed_rate_ml_min, map_mmhg):
    """0–1 urgency from haemorrhage severity (for delay scaling)."""
    bleed = max(0.0, float(bleed_rate_ml_min))
    map_v = float(map_mmhg)
    bleed_stress = min(1.0, bleed / 400.0)
    map_stress = min(1.0, max(0.0, (75.0 - map_v) / 40.0)) if map_v < 75 else 0.0
    return min(1.0, 0.55 * bleed_stress + 0.45 * map_stress)


def stress_multiplier(hf, bleed_rate_ml_min, map_mmhg):
    level = stress_level(bleed_rate_ml_min, map_mmhg)
    return 1.0 + hf["stress_sensitivity"] * level


def scaled_delay(base_min, hf, bleed_rate_ml_min, map_mmhg):
    if base_min <= 0:
        return MIN_ACTION_MIN
    mult = hf["team_experience"] * stress_multiplier(hf, bleed_rate_ml_min, map_mmhg)
    return max(MIN_ACTION_MIN, base_min * mult)


def _bucket_for_prompt(ptype, tid):
    if ptype == "followup":
        return "delay_followup_min"
    if ptype in ("tone_check", "blood_loss_check"):
        return "delay_assess_min"
    if ptype == "assess":
        return "delay_assess_min"
    if ptype == "consider" and tid in _CONSIDER:
        return "delay_consider_min"
    if ptype == "theatre_transfer":
        return "delay_default_min"
    if tid in _CALLS:
        return "delay_calls_min"
    if tid in _HANDS_ON:
        return "delay_hands_on_min"
    if ptype in ("task", "ci_check", "carbo_dose", "uterotonic_escalate", "txa_second"):
        return "delay_hands_on_min"
    return "delay_default_min"


def action_delay_min(ptype, tid, hf, bleed_rate_ml_min, map_mmhg):
    """Minutes before the operator completes this prompt's action."""
    if tid == "manual_removal":
        return scaled_delay(
            hf["manual_removal_logistics_min"], hf, bleed_rate_ml_min, map_mmhg,
        )
    bucket = _bucket_for_prompt(ptype, tid)
    return scaled_delay(hf[bucket], hf, bleed_rate_ml_min, map_mmhg)


def transfusion_start_delay_min(hf, bleed_rate_ml_min, map_mmhg):
    """Minutes from ordering blood until PRBC infusion can begin."""
    prep = 0.0 if hf["o_neg_immediate"] else hf["blood_lab_prep_min"]
    base = prep + hf["first_prbc_min"]
    return scaled_delay(base, hf, bleed_rate_ml_min, map_mmhg)


def manual_removal_logistics_delay_min(hf, bleed_rate_ml_min, map_mmhg):
    return scaled_delay(hf["manual_removal_logistics_min"], hf, bleed_rate_ml_min, map_mmhg)


def theatre_ready_delay_min(hf, bleed_rate_ml_min, map_mmhg):
    return scaled_delay(hf["theatre_mobilisation_min"], hf, bleed_rate_ml_min, map_mmhg)


def blood_wait_breakdown(hf, bleed_rate_ml_min=200, map_mmhg=65):
    """Plain-language blood timing parts (after order, before PRBC runs)."""
    prep = 0.0 if hf["o_neg_immediate"] else hf["blood_lab_prep_min"]
    bedside = hf["first_prbc_min"]
    prep_scaled = scaled_delay(prep, hf, bleed_rate_ml_min, map_mmhg) if prep else 0.0
    bedside_scaled = scaled_delay(bedside, hf, bleed_rate_ml_min, map_mmhg)
    total = prep_scaled + bedside_scaled
    return {
        "lab_min": prep_scaled,
        "bedside_min": bedside_scaled,
        "total_min": total,
        "crossmatch": not hf["o_neg_immediate"],
    }


def describe_human_factors(hf, bleed_rate_ml_min=200, map_mmhg=65):
    """Plain-English summary for the Streamlit sidebar."""
    exp = hf["team_experience"]
    if exp <= 0.2:
        team = "Every action is instant (robot operator)"
    elif exp <= 0.85:
        team = "Senior team — acts quickly"
    elif exp <= 1.05:
        team = "Competent team — typical ward timing"
    elif exp <= 1.3:
        team = "Busy shift — ward under pressure"
    elif exp <= 1.45:
        team = "Stretched team — busy or junior"
    else:
        team = "Solo / chaotic — slow on every task"

    stress = hf["stress_sensitivity"]
    if stress <= 0.1:
        stress_txt = "Team stays calm even when she deteriorates"
    elif stress <= 0.6:
        stress_txt = "Tasks slow moderately when bleeding is brisk or BP falls"
    else:
        stress_txt = "Tasks slow a lot when she is crashing"

    iv = format_duration(scaled_delay(hf["delay_hands_on_min"], hf, 100, 70))
    call = format_duration(scaled_delay(hf["delay_calls_min"], hf, 100, 70))
    blood = blood_wait_breakdown(hf, bleed_rate_ml_min, map_mmhg)
    theatre = format_duration(theatre_ready_delay_min(hf, bleed_rate_ml_min, map_mmhg))
    removal = format_duration(
        manual_removal_logistics_delay_min(hf, bleed_rate_ml_min, map_mmhg),
    )

    examples = [
        f"Hands-on task (e.g. IV, oxytocin): {iv}",
        f"Call for help / escalate: {call}",
    ]
    if blood["crossmatch"]:
        examples.append(
            f"First PRBC at bedside: {format_duration(blood['total_min'])} "
            f"(lab {format_duration(blood['lab_min'])} + porter {format_duration(blood['bedside_min'])})"
        )
    else:
        examples.append(
            f"First PRBC at bedside: {format_duration(blood['total_min'])} "
            f"(O-neg — no crossmatch wait)"
        )
    examples.append(f"Theatre ready after assign: {theatre}")
    examples.append(f"Manual removal setup (anaesthesia): {removal}")
    examples.append(f"Parallel team slots (in-flight): {int(hf.get('team_lanes', 1))}")

    return {"team": team, "stress": stress_txt, "examples": examples}


def summarise_human_factors(hf):
    """One-line fallback (CLI / compact views)."""
    d = describe_human_factors(hf)
    return f"{d['team']}. {d['examples'][2]}."
