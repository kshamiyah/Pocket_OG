"""
SERA patient phenotype — presentation + treatment response matrix.

SERA (Simulated Emergency Response Agent) is the virtual obstetric patient.
The SOS algorithm is fixed (under test). This module configures how SERA's
body responds to each intervention after PPH is recognised.
"""

TREATMENT_LABELS = {
    "uterotonics": "Uterotonics (oxytocin → ergometrine → carboprost → misoprostol)",
    "massage": "Fundal massage / bimanual compression",
    "balloon": "Bakri balloon tamponade",
    "sutures": "B-Lynch / compression sutures (theatre)",
    "hysterectomy": "Peripartum hysterectomy",
}

EFFECTIVE = "effective"
INEFFECTIVE = "ineffective"

TREATMENT_KEYS = tuple(TREATMENT_LABELS.keys())

PRESET_OPTIONS = {
    "custom": "Custom — set each treatment manually",
    "typical_atonic": "Typical atonic PPH — drugs work",
    "refractory_atony": "Refractory atony — drugs fail, surgery works",
    "balloon_fails": "Balloon fails — drugs + sutures/hysterectomy work",
    "accreta": "Accreta / percreta — only hysterectomy works",
}

PRESETS = {
    "typical_atonic": {
        "uterotonics": EFFECTIVE,
        "massage": EFFECTIVE,
        "balloon": EFFECTIVE,
        "sutures": EFFECTIVE,
        "hysterectomy": EFFECTIVE,
    },
    "refractory_atony": {
        "uterotonics": INEFFECTIVE,
        "massage": EFFECTIVE,
        "balloon": EFFECTIVE,
        "sutures": EFFECTIVE,
        "hysterectomy": EFFECTIVE,
    },
    "balloon_fails": {
        "uterotonics": EFFECTIVE,
        "massage": EFFECTIVE,
        "balloon": INEFFECTIVE,
        "sutures": EFFECTIVE,
        "hysterectomy": EFFECTIVE,
    },
    "accreta": {
        "uterotonics": INEFFECTIVE,
        "massage": EFFECTIVE,
        "balloon": INEFFECTIVE,
        "sutures": INEFFECTIVE,
        "hysterectomy": EFFECTIVE,
    },
}


def default_response():
    return {k: EFFECTIVE for k in TREATMENT_KEYS}


def response_from_preset(preset_key):
    if preset_key == "custom":
        return default_response()
    return dict(PRESETS[preset_key])


def build_response(preset_key, overrides=None):
    """Merge a preset with per-treatment overrides from the UI."""
    base = response_from_preset(preset_key)
    if overrides:
        for k, v in overrides.items():
            if k in base and v in (EFFECTIVE, INEFFECTIVE):
                base[k] = v
    return base


def surgical_ineffective_steps(response):
    return [step for step in ("balloon", "sutures", "hysterectomy")
            if response.get(step) == INEFFECTIVE]


def uterotonics_refractory(response):
    return response.get("uterotonics") == INEFFECTIVE


def massage_refractory(response):
    return response.get("massage") == INEFFECTIVE


def summarise_response(response):
    """One-line human summary for the UI."""
    works, fails = [], []
    for key, label in TREATMENT_LABELS.items():
        short = label.split(" (")[0].split(" — ")[0]
        (works if response.get(key) == EFFECTIVE else fails).append(short)
    parts = []
    if works:
        parts.append("Responds: " + ", ".join(works))
    if fails:
        parts.append("No response: " + ", ".join(fails))
    return " · ".join(parts) if parts else "All treatments effective"


def scenario_from_profile(weight_kg, bmi, start_ebl, risk_factors, treatment_response, name="live"):
    """Build an app_operator scenario dict from presentation + phenotype."""
    return {
        "name": name,
        "weight_kg": weight_kg,
        "bmi": bmi,
        "start_ebl": start_ebl,
        "risk_factors": list(risk_factors or []),
        "treatment_response": dict(treatment_response),
        # Legacy keys for deprecated sandboxes / backwards compat
        "surgical_ineffective": surgical_ineffective_steps(treatment_response) or None,
    }
