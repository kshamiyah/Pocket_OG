#!/usr/bin/env python3
"""
Calibrate SERA physiology against SERA_BUILD_HANDOVER.md Definition of done.

Untreated runs only — no SOS operator. Usage:
  python3 simulator/calibrate_physiology.py
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from stage4_sandbox import PatientV4, BASELINE_FLOW_ML_MIN, BASE_START_TONE  # noqa: E402
from stage1_sandbox import start_tone_from_risk_factors  # noqa: E402
from stage2_sandbox import LD50_DEBT_ML_KG, CPP_ARREST_MMHG, P_PERFUSION_FLOOR_MMHG  # noqa: E402
from stage3_sandbox import CONTROLLED_BLEED  # noqa: E402
from patient_profile import build_response  # noqa: E402


def run_untreated(label, patient_kw, max_min=180, dt=0.5):
    fibrinogen = patient_kw.pop("fibrinogen_g_l", None)
    p = PatientV4(start_ebl=500, treatment_response=build_response("typical_atonic"), **patient_kw)
    if fibrinogen is not None:
        p.fibrinogen_g_l = fibrinogen
    rows = []
    death_t = None
    for step in range(int(max_min / dt) + 1):
        t = step * dt
        p.tick(t, dt_min=dt)
        if step % int(2 / dt) == 0 or p.is_dead:
            rows.append({
                "t": round(t, 1),
                "EBL": round(p.cumulative_bled),
                "bleed": round(p.bleed_rate),
                "MAP": round(p.map),
                "CPP": round(p.coronary_perfusion_pressure, 1),
                "debt": round(p.oxygen_debt, 1),
                "Hb": round(p.hb_g_l, 1),
            })
        if p.is_dead and death_t is None:
            death_t = t
            break
    eq_map = rows[-1]["MAP"] if rows else None
    eq_bleed = rows[-1]["bleed"] if rows else None
    cause = p.death_cause if p.is_dead else "survived"
    return {
        "label": label,
        "death_t_min": death_t,
        "cause": cause,
        "equilibrium_map": eq_map,
        "equilibrium_bleed": eq_bleed,
        "start_bleed": round(BASELINE_FLOW_ML_MIN * (1 - p.start_tone)),
        "rows": rows[-6:],
    }


def main():
    cases = [
        ("severe atony (typical risk)", {"risk_factors": ["previous_pph", "overdistension"]}),
        ("catastrophic atony (full comorbid)", {
            "risk_factors": [
                "overdistension", "previous_pph", "macrosomia", "prolonged_labour",
                "chorioamnionitis", "ga_or_augmentation", "grand_multiparity", "fibroids",
            ],
        }),
        ("catastrophic trauma", {"trauma_severity": 0.8, "base_tone": 0.95}),
        ("tissue 0.5 ceiling", {"tissue_severity": 0.5}),
        ("mild ooze (tone 0.95)", {"base_tone": 0.95}),
        ("coagulopathic moderate atony", {"base_tone": 0.45, "fibrinogen_g_l": 0.8}),
    ]

    SEVERE_ATONY_KW = {"risk_factors": ["previous_pph", "overdistension"]}
    CATASTROPHIC_KW = {
        "risk_factors": [
            "overdistension", "previous_pph", "macrosomia", "prolonged_labour",
            "chorioamnionitis", "ga_or_augmentation", "grand_multiparity", "fibroids",
        ],
    }
    HB_DEBT_SWEEPS = [70, 90, 110, 130]
    HB_ARREST_SWEEPS = [70, 110]

    print("=== SERA physiology calibration (untreated) ===\n")
    print(f"P_floor={P_PERFUSION_FLOOR_MMHG} mmHg | CPP_arrest={CPP_ARREST_MMHG} mmHg\n")

    results = []
    for label, kw in cases:
        res = run_untreated(label, kw, max_min=240)
        results.append(res)
        st = start_tone_from_risk_factors(kw.get("risk_factors", []), kw.get("base_tone", BASE_START_TONE))
        print(f"--- {label} ---")
        print(f"  start tone {st:.2f} | start source bleed ~{res['start_bleed']} ml/min")
        if res["death_t_min"] is not None:
            print(f"  DEATH @ {res['death_t_min']:.1f} min — {res['cause']}")
        else:
            print(f"  survived {240} min sim — eq MAP {res['equilibrium_map']} bleed {res['equilibrium_bleed']} ml/min")
        print(f"  tail: {res['rows'][-3:]}")
        print()

    # Cross-model constraint: equilibrium MAP vs coronary floor
    tissue_res = next(r for r in results if "tissue" in r["label"])
    if tissue_res["equilibrium_map"] and tissue_res["equilibrium_map"] > 35:
        print(f"✓ Tissue equilibrium MAP {tissue_res['equilibrium_map']} > spurious arrest zone")

    # Hb differentiation on debt path (severe atony → irreversible_shock)
    print("=== Hb sweep: severe atony (debt path) ===\n")
    debt_by_hb = {}
    for hb in HB_DEBT_SWEEPS:
        res = run_untreated(f"severe atony Hb {hb}", {**SEVERE_ATONY_KW, "starting_Hb": float(hb)}, max_min=240)
        debt_by_hb[hb] = res
        t = res["death_t_min"]
        print(f"  Hb {hb:3d} g/L → {t:.1f} min — {res['cause']}" if t else f"  Hb {hb:3d} g/L → survived")
    print()
    debt_times = [debt_by_hb[hb]["death_t_min"] for hb in HB_DEBT_SWEEPS]
    debt_causes = [debt_by_hb[hb]["cause"] for hb in HB_DEBT_SWEEPS]
    print("  Summary:", " | ".join(
        f"Hb {hb} → {debt_by_hb[hb]['death_t_min']:.1f} min" for hb in HB_DEBT_SWEEPS
        if debt_by_hb[hb]["death_t_min"] is not None
    ))
    if all(c == "irreversible_shock" for c in debt_causes) and all(t is not None for t in debt_times):
        strictly_increasing = all(
            debt_by_hb[HB_DEBT_SWEEPS[i]]["death_t_min"] < debt_by_hb[HB_DEBT_SWEEPS[i + 1]]["death_t_min"]
            for i in range(len(HB_DEBT_SWEEPS) - 1)
        )
        if strictly_increasing:
            print(f"✓ Debt path: four distinct monotonic death times "
                  f"({debt_by_hb[70]['death_t_min']:.0f} < {debt_by_hb[90]['death_t_min']:.0f} < "
                  f"{debt_by_hb[110]['death_t_min']:.0f} < {debt_by_hb[130]['death_t_min']:.0f} min)")
        elif debt_by_hb[70]["death_t_min"] < debt_by_hb[110]["death_t_min"]:
            print(f"✗ Debt path: expected strictly increasing times across Hb 70/90/110/130 "
                  f"(got {debt_by_hb[70]['death_t_min']:.0f} / {debt_by_hb[90]['death_t_min']:.0f} / "
                  f"{debt_by_hb[110]['death_t_min']:.0f} / {debt_by_hb[130]['death_t_min']:.0f} min)")
        else:
            print(f"✗ Debt path: expected Hb 70 < Hb 110 death time "
                  f"({debt_by_hb[70]['death_t_min']:.0f} vs {debt_by_hb[110]['death_t_min']:.0f} min)")
    else:
        print("✗ Debt path Hb sweep: not all runs died by irreversible_shock")

    # Hb should NOT shift arrest timing (catastrophic → cardiac_arrest, pressure-driven)
    print("\n=== Hb sweep: catastrophic atony (arrest path) ===\n")
    arrest_by_hb = {}
    for hb in HB_ARREST_SWEEPS:
        res = run_untreated(f"catastrophic Hb {hb}", {**CATASTROPHIC_KW, "starting_Hb": float(hb)}, max_min=240)
        arrest_by_hb[hb] = res
        t = res["death_t_min"]
        print(f"  Hb {hb:3d} g/L → {t:.1f} min — {res['cause']}" if t else f"  Hb {hb:3d} g/L → survived")
    print()
    t70 = arrest_by_hb[70]["death_t_min"]
    t110 = arrest_by_hb[110]["death_t_min"]
    if (arrest_by_hb[70]["cause"] == arrest_by_hb[110]["cause"] == "cardiac_arrest"
            and t70 is not None and t110 is not None):
        delta = abs(t70 - t110)
        if delta <= 1.0:
            print(f"✓ Arrest path: Hb does not shift timing "
                  f"(Hb 70 @ {t70:.1f} min vs Hb 110 @ {t110:.1f} min, Δ={delta:.1f} min)")
        else:
            print(f"✗ Arrest path: expected ~identical arrest time regardless of Hb "
                  f"({t70:.1f} vs {t110:.1f} min, Δ={delta:.1f} min)")
    else:
        print("✗ Arrest path Hb sweep: expected both cardiac_arrest")

    print("\nTargets: severe atony 60–120 min | catastrophic 15–45 min | mild ooze >>120 min")


if __name__ == "__main__":
    main()
