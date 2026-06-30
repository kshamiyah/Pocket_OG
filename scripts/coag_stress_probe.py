#!/usr/bin/env python3
"""
Physiology-only fibrinogen stress probe — bypasses SOS to exercise R-COAG.

Worst-case: tone 0, uterotonics refractory, massive PRBC without FFP until
MHP (optional). Shows whether coag_multiplier and fibrinogen threshold fire.

  python3 scripts/coag_stress_probe.py
  python3 scripts/coag_stress_probe.py --ffp-after 20 --txa
"""

import argparse
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "simulator"))

from patient_profile import PRESETS  # noqa: E402
from stage4_sandbox import PatientV4  # noqa: E402
from stage3_sandbox import MASSIVE_PRBC_ML_MIN, MASSIVE_FFP_ML_MIN  # noqa: E402

FULL_COMORBID = [
    "overdistension", "previous_pph", "macrosomia", "prolonged_labour",
    "chorioamnionitis", "ga_or_augmentation", "grand_multiparity", "fibroids",
]


def run_probe(weight_kg=55, start_ebl=800, duration_min=30, prbc_rate=MASSIVE_PRBC_ML_MIN,
              ffp_after_min=None, txa_at_min=2, preset="refractory_atony",
              prbc_from_min=15, cryst_rate=0, label=None):
    p = PatientV4(
        weight_kg, FULL_COMORBID,
        surgical_ineffective=None,
        bmi=26, start_ebl=start_ebl,
        treatment_response=PRESETS[preset],
    )
    title = label or preset
    print(f"{title}: {weight_kg} kg, start EBL {start_ebl} ml, "
          f"PRBC {prbc_rate} ml/min from t={prbc_from_min}"
          + (f", cryst {cryst_rate} ml/min" if cryst_rate else "")
          + (f", FFP from t={ffp_after_min}" if ffp_after_min else ", no FFP")
          + (", TXA at t=2" if txa_at_min is not None else ""))
    print(f"{'t':>4} {'EBL':>6} {'src':>4} {'eff':>4} {'coag×':>5} {'Fib':>5} {'MAP':>4} {'verdict':>10}")
    print("-" * 52)

    verdict = "ONGOING"
    min_fib = p.fibrinogen_g_l
    max_mult = 1.0
    for minute in range(duration_min + 1):
        blood_in = prbc_rate if minute >= prbc_from_min else 0.0
        fluids_in = cryst_rate if minute >= prbc_from_min else 0.0
        ffp_in = 0.0
        if ffp_after_min is not None and minute >= ffp_after_min:
            ffp_in = MASSIVE_FFP_ML_MIN
        if txa_at_min is not None and minute == txa_at_min:
            p.give_txa(minute)
        p.tick(minute, dt_min=1.0, fluids_in=fluids_in, blood_in=blood_in, ffp_in=ffp_in)
        min_fib = min(min_fib, p.fibrinogen_g_l)
        max_mult = max(max_mult, p.coag_multiplier)
        if p.arrested:
            verdict = "ARREST"
        elif p.durable_bleed_rate < 50 and p.map > 60:
            verdict = "CONTROLLED"
        mark = " <<" if p.fibrinogen_g_l < 2.0 or p.coag_multiplier > 1.0 else ""
        print(f"{minute:4d} {p.cumulative_bled:6.0f} {p.source_bleed_rate:4.0f} "
              f"{p.bleed_rate:4.0f} {p.coag_multiplier:5.2f} {p.fibrinogen_g_l:5.2f} "
              f"{p.map:4.0f} {verdict:>10}{mark}")
        if verdict != "ONGOING":
            break
    print(f"  → nadir Fib={min_fib:.2f} g/L, peak coag×={max_mult:.2f}\n")
    return p


def main():
    parser = argparse.ArgumentParser(description="Fibrinogen / R-COAG physiology stress probe")
    parser.add_argument("--duration", type=int, default=30)
    parser.add_argument("--ffp-after", type=int, default=None, help="Start FFP at this minute (MHP)")
    parser.add_argument("--no-txa", action="store_true")
    args = parser.parse_args()

    txa = None if args.no_txa else 2
    print("=== A: SOS-like (PRBC after prep, no FFP) — arrest before coag threshold ===\n")
    run_probe(ffp_after_min=None, txa_at_min=txa, duration_min=args.duration)

    print("=== B: Massive transfusion propping MAP — PRBC+cryst from t=0, no FFP ===\n")
    run_probe(prbc_from_min=0, cryst_rate=500, ffp_after_min=None, txa_at_min=txa,
              duration_min=args.duration, weight_kg=90,
              label="Propped massive bleed (90 kg)")

    print("=== C: Same as B + late MHP FFP at t=20 ===\n")
    run_probe(prbc_from_min=0, cryst_rate=500, ffp_after_min=20, txa_at_min=txa,
              duration_min=35, weight_kg=90, label="Late FFP rescue")

    print("=== D: B without TXA — fibrinolysis unconstrained ===\n")
    run_probe(prbc_from_min=0, cryst_rate=500, ffp_after_min=None, txa_at_min=None,
              duration_min=args.duration, weight_kg=90, label="No TXA")

    print("=== E: Held by transfusion (high-volume resuscitation) — coag× feedback ===\n")
    run_probe(prbc_from_min=0, prbc_rate=400, cryst_rate=800, ffp_after_min=None,
              txa_at_min=txa, duration_min=20, weight_kg=90, start_ebl=500,
              label="Exsanguination propped")


if __name__ == "__main__":
    main()
