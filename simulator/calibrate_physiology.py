#!/usr/bin/env python3
"""
Calibrate SERA physiology against SERA_BUILD_HANDOVER.md Definition of done.

Untreated runs only (plus one treated crystalloid-only debt-path check).
Usage: python3 simulator/calibrate_physiology.py
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from stage4_sandbox import PatientV4, BASELINE_FLOW_ML_MIN, BASE_START_TONE  # noqa: E402
from stage1_sandbox import start_tone_from_risk_factors  # noqa: E402
from stage2_sandbox import LD50_DEBT_ML_KG, CPP_ARREST_MMHG, P_PERFUSION_FLOOR_MMHG, HB_FLOOR_G_L  # noqa: E402
from stage3_sandbox import CONTROLLED_BLEED, MAJOR_CRYST_ML_MIN  # noqa: E402
from patient_profile import build_response  # noqa: E402

EBL_FRAC_LO = 0.55   # plausible EBL at death / start_volume [TUNABLE]
EBL_FRAC_HI = 0.85


def run_untreated(label, patient_kw, max_min=240, dt=0.5):
    fibrinogen = patient_kw.pop("fibrinogen_g_l", None)
    p = PatientV4(start_ebl=500, treatment_response=build_response("typical_atonic"), **patient_kw)
    if fibrinogen is not None:
        p.fibrinogen_g_l = fibrinogen
    rows = []
    death_t = None
    max_ebl_frac_alive = 0.0
    min_hb_alive = p.hb_g_l
    for step in range(int(max_min / dt) + 1):
        t = step * dt
        p.tick(t, dt_min=dt)
        if not p.is_dead:
            max_ebl_frac_alive = max(max_ebl_frac_alive, p.cumulative_bled / p.start_volume)
            min_hb_alive = min(min_hb_alive, p.hb_g_l)
        if step % int(2 / dt) == 0 or p.is_dead:
            rows.append({
                "t": round(t, 1),
                "EBL": round(p.cumulative_bled),
                "bleed": round(p.bleed_rate),
                "MAP": round(p.map),
                "CPP": round(p.coronary_perfusion_pressure, 1),
                "debt": round(p.oxygen_debt, 1),
                "Hb": round(p.hb_g_l, 1),
                "cf": round(p.circulating_fraction, 3),
            })
        if p.is_dead and death_t is None:
            death_t = t
            break
    eq_map = rows[-1]["MAP"] if rows else None
    eq_bleed = rows[-1]["bleed"] if rows else None
    cause = p.death_cause if p.is_dead else "survived"
    ebl_at_death = p.cumulative_bled if p.is_dead else None
    hb_at_death = p.hb_g_l if p.is_dead else None
    ebl_frac = (ebl_at_death / p.start_volume) if ebl_at_death is not None else None
    return {
        "label": label,
        "start_volume": p.start_volume,
        "death_t_min": death_t,
        "cause": cause,
        "ebl_at_death": round(ebl_at_death) if ebl_at_death is not None else None,
        "ebl_frac": round(ebl_frac, 3) if ebl_frac is not None else None,
        "hb_at_death": round(hb_at_death, 1) if hb_at_death is not None else None,
        "max_ebl_frac_alive": round(max_ebl_frac_alive, 3),
        "min_hb_alive": round(min_hb_alive, 1),
        "equilibrium_map": eq_map,
        "equilibrium_bleed": eq_bleed,
        "start_bleed": round(BASELINE_FLOW_ML_MIN * (1 - p.start_tone)),
        "rows": rows[-3:],
    }


def run_treated_crystalloid_only(patient_kw, max_min=120, dt=0.5, cryst_ml_min=None):
    """Volume propped by crystalloid only — debt path should remain reachable."""
    cryst_ml_min = cryst_ml_min or MAJOR_CRYST_ML_MIN
    p = PatientV4(start_ebl=500, treatment_response=build_response("typical_atonic"), **patient_kw)
    death_t = None
    for step in range(int(max_min / dt) + 1):
        t = step * dt
        p.tick(t, dt_min=dt, fluids_in=cryst_ml_min * dt)
        if p.is_dead:
            death_t = t
            break
    return {
        "death_t_min": death_t,
        "cause": p.death_cause if p.is_dead else "survived",
        "ebl_at_death": round(p.cumulative_bled) if p.is_dead else None,
        "hb_at_death": round(p.hb_g_l, 1) if p.is_dead else None,
        "peak_debt": round(p._peak_debt, 1),
        "circulating_fraction": round(p.circulating_fraction, 2),
    }


def print_table(results):
    print(f"{'case':<32} {'cause':<18} {'t(min)':>6} {'EBL':>6} {'EBL/SV':>6} {'Hb':>5}")
    print("-" * 82)
    for r in results:
        t_s = f"{r['death_t_min']:.1f}" if r["death_t_min"] is not None else "—"
        ebl_s = str(r["ebl_at_death"]) if r["ebl_at_death"] is not None else "—"
        frac_s = f"{r['ebl_frac']:.2f}" if r.get("ebl_frac") is not None else "—"
        hb_s = f"{r['hb_at_death']:.1f}" if r.get("hb_at_death") is not None else "—"
        print(f"{r['label']:<32} {r['cause']:<18} {t_s:>6} {ebl_s:>6} {frac_s:>6} {hb_s:>5}")


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

    CATASTROPHIC_KW = {
        "risk_factors": [
            "overdistension", "previous_pph", "macrosomia", "prolonged_labour",
            "chorioamnionitis", "ga_or_augmentation", "grand_multiparity", "fibroids",
        ],
    }
    HB_ARREST_SWEEPS = [70, 110]

    print("=== SERA physiology calibration (untreated) ===\n")
    print(f"P_floor={P_PERFUSION_FLOOR_MMHG} mmHg | CPP_arrest={CPP_ARREST_MMHG} mmHg")
    print(f"LD50 debt={LD50_DEBT_ML_KG} mL/kg | EBL-at-death band {EBL_FRAC_LO:.0%}–{EBL_FRAC_HI:.0%} of start volume\n")

    results = []
    for label, kw in cases:
        res = run_untreated(label, kw, max_min=240)
        results.append(res)

    print_table(results)
    print()

    ok = True

    # --- Plausibility: no run exceeds ~1× start volume while alive; Hb > 0 while alive ---
    for r in results:
        if r["max_ebl_frac_alive"] > 1.02:
            print(f"✗ {r['label']}: EBL exceeded start volume while alive "
                  f"(max frac {r['max_ebl_frac_alive']:.2f})")
            ok = False
        if r["min_hb_alive"] <= 0:
            print(f"✗ {r['label']}: Hb hit 0 while alive (min {r['min_hb_alive']})")
            ok = False
    if ok:
        print("✓ EBL plausibility: no untreated run exceeded start volume while alive")
        print("✓ Hb plausibility: Hb > 0 throughout life (concentration preserved on haemorrhage alone)")

    # --- Untreated exsanguination: all die cardiac_arrest with EBL in band ---
    untreated_cardiac = [r for r in results if r["death_t_min"] is not None]
    if all(r["cause"] == "cardiac_arrest" for r in untreated_cardiac):
        print("✓ Untreated cases: all die by cardiac_arrest (exsanguination / coronary fuse)")
    else:
        bad = [r["label"] for r in untreated_cardiac if r["cause"] != "cardiac_arrest"]
        print(f"✗ Untreated cases expected cardiac_arrest; got other cause: {bad}")
        ok = False

    in_band = [
        r for r in untreated_cardiac
        if r["ebl_frac"] is not None and EBL_FRAC_LO <= r["ebl_frac"] <= EBL_FRAC_HI
    ]
    # Acute source-stress cases arrest early (R-CIRC-3b) — lower EBL at death is expected.
    chronic_labels = {
        "severe atony (typical risk)", "tissue 0.5 ceiling",
        "mild ooze (tone 0.95)", "coagulopathic moderate atony",
    }
    chronic = [r for r in untreated_cardiac if r["label"] in chronic_labels]
    chronic_in_band = [r for r in chronic if r in in_band]
    if len(chronic_in_band) == len(chronic):
        print(f"✓ EBL at death within {EBL_FRAC_LO:.0%}–{EBL_FRAC_HI:.0%} of start volume "
              f"(chronic exsanguination cases)")
    else:
        for r in chronic:
            if r not in in_band:
                print(f"✗ {r['label']}: EBL/SV {r['ebl_frac']:.2f} outside band")
        ok = False

    for r in untreated_cardiac:
        if "catastrophic" in r["label"] and r["ebl_frac"] is not None and r["ebl_frac"] > EBL_FRAC_HI:
            print(f"✗ {r['label']}: acute arrest EBL/SV {r['ebl_frac']:.2f} unexpectedly high")
            ok = False
    acute_ok = all(
        r["ebl_frac"] < EBL_FRAC_LO
        for r in untreated_cardiac
        if "catastrophic" in r["label"] and r["ebl_frac"] is not None
    )
    if acute_ok:
        print("✓ Catastrophic acute cases: arrest before exsanguination band (R-CIRC-3b path)")
    else:
        print("✗ Catastrophic cases: expected lower EBL/SV (acute penalty, not tank empty)")
        ok = False

    # --- Specific timing targets ---
    severe = next(r for r in results if "severe atony" in r["label"])
    if severe["cause"] == "cardiac_arrest" and 30 <= severe["death_t_min"] <= 45:
        print(f"✓ Severe atony exsanguinates @ {severe['death_t_min']:.1f} min (target 30–45)")
    else:
        print(f"✗ Severe atony: expected cardiac_arrest 30–45 min "
              f"(got {severe['cause']} @ {severe['death_t_min']})")
        ok = False

    cat = next(r for r in results if "catastrophic atony" in r["label"])
    if cat["cause"] == "cardiac_arrest" and 10 <= cat["death_t_min"] <= 45:
        print(f"✓ Catastrophic atony unchanged: arrest @ {cat['death_t_min']:.1f} min")
    else:
        print(f"✗ Catastrophic atony: expected arrest 10–45 min (got {cat['death_t_min']:.1f})")
        ok = False

    ooze = next(r for r in results if "mild ooze" in r["label"])
    if ooze["cause"] == "cardiac_arrest" and ooze["death_t_min"] > 120:
        print(f"✓ Mild ooze: exsanguinates late @ {ooze['death_t_min']:.1f} min (not frozen MAP survival)")
    else:
        print(f"✗ Mild ooze: expected late cardiac_arrest (got {ooze['cause']} @ {ooze['death_t_min']})")
        ok = False

    tissue = next(r for r in results if "tissue" in r["label"])
    if tissue["cause"] == "cardiac_arrest" and tissue["death_t_min"] < 90:
        print(f"✓ Tissue 0.5: exsanguinates @ {tissue['death_t_min']:.1f} min (not debt at frozen MAP)")
    else:
        print(f"✗ Tissue 0.5: expected exsanguination arrest (got {tissue['cause']} @ {tissue['death_t_min']})")
        ok = False

    # --- Treated debt path (crystalloid-only resuscitation) ---
    print("\n=== Treated debt path: crystalloid-only resuscitation ===\n")
    debt_run = run_treated_crystalloid_only({"base_tone": 0.45})
    print(f"  moderate atony + crystalloid {MAJOR_CRYST_ML_MIN} ml/min, no source control")
    print(f"  → {debt_run['cause']} @ {debt_run['death_t_min']:.1f} min | "
          f"EBL {debt_run['ebl_at_death']} ml | Hb {debt_run['hb_at_death']} g/L | "
          f"peak debt {debt_run['peak_debt']} | cf {debt_run['circulating_fraction']}")
    if debt_run["cause"] == "irreversible_shock" and debt_run["death_t_min"] is not None:
        print("✓ Debt path survives for treated-but-failing (volume propped, Hb diluted)")
    else:
        print(f"✗ Treated crystalloid-only: expected irreversible_shock (got {debt_run['cause']})")
        ok = False

    # --- Hb sweep on treated debt path ---
    print("\n=== Hb sweep: treated crystalloid-only (debt path) ===\n")
    debt_by_hb = {}
    for hb in [70, 90, 110, 130]:
        run = run_treated_crystalloid_only({"base_tone": 0.45, "starting_Hb": float(hb)})
        debt_by_hb[hb] = run
        t = run["death_t_min"]
        print(f"  Hb {hb:3d} g/L → {t:.1f} min — {run['cause']}" if t else f"  Hb {hb:3d} g/L → survived")
    debt_times = [debt_by_hb[hb]["death_t_min"] for hb in debt_by_hb]
    debt_causes = [debt_by_hb[hb]["cause"] for hb in debt_by_hb]
    if all(c == "irreversible_shock" for c in debt_causes) and all(t is not None for t in debt_times):
        if debt_by_hb[70]["death_t_min"] < debt_by_hb[110]["death_t_min"]:
            print(f"✓ Debt path Hb differentiation: "
                  f"70 @ {debt_by_hb[70]['death_t_min']:.0f} min < 110 @ {debt_by_hb[110]['death_t_min']:.0f} min")
        else:
            print("✗ Debt path: expected Hb 70 dies sooner than Hb 110")
            ok = False
    else:
        print("✗ Treated debt Hb sweep: not all irreversible_shock")
        ok = False

    # --- Catastrophic arrest Hb-independent ---
    print("\n=== Hb sweep: catastrophic atony (acute arrest path) ===\n")
    arrest_by_hb = {}
    for hb in HB_ARREST_SWEEPS:
        res = run_untreated(f"catastrophic Hb {hb}", {**CATASTROPHIC_KW, "starting_Hb": float(hb)}, max_min=240)
        arrest_by_hb[hb] = res
        t = res["death_t_min"]
        print(f"  Hb {hb:3d} g/L → {t:.1f} min — {res['cause']}" if t else f"  Hb {hb:3d} g/L → survived")
    t70 = arrest_by_hb[70]["death_t_min"]
    t110 = arrest_by_hb[110]["death_t_min"]
    if (arrest_by_hb[70]["cause"] == arrest_by_hb[110]["cause"] == "cardiac_arrest"
            and t70 is not None and t110 is not None and abs(t70 - t110) <= 1.0):
        print(f"✓ Acute arrest path: Hb-independent ({t70:.1f} vs {t110:.1f} min)")
    else:
        print("✗ Acute arrest Hb sweep failed")
        ok = False

    print()
    if ok:
        print("=== All calibration checks passed ===")
    else:
        print("=== Some checks FAILED — review output above ===")
        sys.exit(1)


if __name__ == "__main__":
    main()
