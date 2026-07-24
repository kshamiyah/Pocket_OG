"""
SERA patient phenotype — presentation + treatment response matrix.

SERA (Simulated Emergency Response Agent) is the virtual obstetric patient.
The SOS algorithm is fixed (under test). This module configures how SERA's
body responds to each intervention after PPH is recognised.
"""

TREATMENT_LABELS = {
    "uterotonics": "Uterotonics (oxytocin → ergometrine → carboprost → misoprostol)",
    "fundal_massage": "Fundal massage",
    "bimanual": "Bimanual uterine compression",
    "balloon": "Bakri balloon tamponade",
    "sutures": "B-Lynch / compression sutures (theatre)",
    "hysterectomy": "Peripartum hysterectomy",
    "repair": "Genital tract repair (suture)",
    "manual_removal": "Manual removal of retained tissue",
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

_PRESET_BODY = {
    "uterotonics": EFFECTIVE,
    "fundal_massage": EFFECTIVE,
    "bimanual": EFFECTIVE,
    "balloon": EFFECTIVE,
    "sutures": EFFECTIVE,
    "hysterectomy": EFFECTIVE,
    "repair": EFFECTIVE,
    "manual_removal": EFFECTIVE,
}

PRESETS = {
    "typical_atonic": dict(_PRESET_BODY),
    "refractory_atony": {**_PRESET_BODY, "uterotonics": INEFFECTIVE},
    "balloon_fails": {**_PRESET_BODY, "balloon": INEFFECTIVE},
    "accreta": {
        **_PRESET_BODY,
        "uterotonics": INEFFECTIVE,
        "balloon": INEFFECTIVE,
        "sutures": INEFFECTIVE,
        "manual_removal": INEFFECTIVE,
    },
}


def _migrate_legacy_massage(response):
    """Old presets / saved sessions used a single 'massage' key."""
    if "massage" not in response:
        return response
    out = dict(response)
    legacy = out.pop("massage")
    out.setdefault("fundal_massage", legacy)
    out.setdefault("bimanual", legacy)
    return out


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
            elif k == "massage" and v in (EFFECTIVE, INEFFECTIVE):
                base["fundal_massage"] = base["bimanual"] = v
    return base


def surgical_ineffective_steps(response):
    response = _migrate_legacy_massage(response)
    return [step for step in ("balloon", "sutures", "hysterectomy")
            if response.get(step) == INEFFECTIVE]


def uterotonics_refractory(response):
    return _migrate_legacy_massage(response).get("uterotonics") == INEFFECTIVE


def fundal_refractory(response):
    r = _migrate_legacy_massage(response)
    return r.get("fundal_massage") == INEFFECTIVE


def bimanual_refractory(response):
    r = _migrate_legacy_massage(response)
    return r.get("bimanual") == INEFFECTIVE


def massage_refractory(response):
    """Legacy — both mechanical steps ineffective."""
    return fundal_refractory(response) and bimanual_refractory(response)


def summarise_response(response):
    """One-line human summary for the UI."""
    response = _migrate_legacy_massage(response)
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


def scenario_from_profile(
    weight_kg, bmi, start_ebl, risk_factors, treatment_response,
    name="live", trauma_severity=0.0, tissue_severity=0.0,
    manual_removal_duration_min=4.0, starting_Hb=110.0, asthma=False, human_factors=None,
):
    """Build an app_operator scenario dict from presentation + phenotype."""
    out = {
        "name": name,
        "weight_kg": weight_kg,
        "bmi": bmi,
        "start_ebl": start_ebl,
        "risk_factors": list(risk_factors or []),
        "treatment_response": dict(treatment_response),
        "trauma_severity": trauma_severity,
        "tissue_severity": tissue_severity,
        "manual_removal_duration_min": manual_removal_duration_min,
        "starting_Hb": starting_Hb,
        "asthma": asthma,
        # Legacy keys for deprecated sandboxes / backwards compat
        "surgical_ineffective": surgical_ineffective_steps(treatment_response) or None,
    }
    if human_factors is not None:
        out["human_factors"] = dict(human_factors)
    return out
