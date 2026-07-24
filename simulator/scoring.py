"""
SERA margin scoring — graded outcomes (Section F).

Measures how close the patient came to physiological limits, not just survive/die.
"""

from stage2_sandbox import LD50_DEBT_ML_KG
from stage3_sandbox import CONTROLLED_BLEED

# Graded bands [TUNABLE thresholds — Section F item 27]
NEAR_MISS_DEBT_FRAC = 0.55       # peak debt / LD50
COMFORTABLE_DEBT_FRAC = 0.25
COMFORTABLE_SOURCE_CONTROL_MIN = 20.0
NEAR_MISS_MAP_NADIR = 50


def exsanguinating_warning(p):
    """Held by transfusion alone — source still uncontrolled (Section H item 39)."""
    return (p.cumulative_blood_in >= p.start_volume
            and p.durable_bleed_rate >= CONTROLLED_BLEED)


def grade_outcome(p, t_min, controlled=True):
    """
    Map physiology + margin snapshot → graded verdict string.
    Death causes are passed through; survivors get comfortable / near-miss / controlled.
    """
    if p.is_dead:
        return "ARREST" if p.death_cause == "cardiac_arrest" else "IRREVERSIBLE_SHOCK"

    margin = p.margin_snapshot()
    peak_debt = margin["peak_oxygen_debt"]
    debt_frac = peak_debt / LD50_DEBT_ML_KG if LD50_DEBT_ML_KG else 0.0
    src_min = margin["source_control_min"]
    map_nadir = margin["map_nadir"]

    tags = []
    if exsanguinating_warning(p):
        tags.append("held_by_transfusion")

    if not controlled:
        if tags:
            return "ONGOING+" + ",".join(tags)
        return "ONGOING"

    if (debt_frac <= COMFORTABLE_DEBT_FRAC
            and (src_min is None or src_min <= COMFORTABLE_SOURCE_CONTROL_MIN)
            and map_nadir >= NEAR_MISS_MAP_NADIR):
        verdict = "CONTROLLED_COMFORTABLY"
    elif debt_frac >= NEAR_MISS_DEBT_FRAC or map_nadir < NEAR_MISS_MAP_NADIR:
        verdict = "NEAR_MISS"
    else:
        verdict = "CONTROLLED"

    if tags:
        verdict += "+" + ",".join(tags)
    return verdict


def summarise_margin(margin, verdict, t_min):
    """One-line CLI / log summary."""
    src = margin.get("source_control_min")
    src_s = f"{src:.1f} min" if src is not None else "not achieved"
    return (
        f"{verdict} @ {t_min:.1f} min | peak debt {margin['peak_oxygen_debt']:.0f} "
        f"({100 * margin['peak_oxygen_debt'] / LD50_DEBT_ML_KG:.0f}% LD50) | "
        f"EBL {margin['peak_ebl']:.0f} | MAP nadir {margin['map_nadir']} | "
        f"Hb nadir {margin['hb_nadir']} | source control {src_s} | "
        f"shock {margin['minutes_in_shock']:.0f} min"
    )
