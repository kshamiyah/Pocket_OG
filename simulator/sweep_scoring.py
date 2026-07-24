#!/usr/bin/env python3
"""
SERA margin sweep — phenotype × human-factor grid (Section F).

Usage: python3 simulator/sweep_scoring.py
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "bridge"))
sys.path.insert(0, HERE)

from patient_profile import PRESETS, build_response, scenario_from_profile  # noqa: E402
from human_factors import preset_human_factors  # noqa: E402
from app_operator import stream  # noqa: E402
from scoring import summarise_margin  # noqa: E402

PHENOTYPE_GRID = [
    ("typical_atonic", {}),
    ("refractory_atony", {}),
    ("tissue_mild", {"tissue_severity": 0.5}),
    ("trauma", {"trauma_severity": 0.6}),
    ("accreta", {"tissue_severity": 0.75, "preset": "accreta"}),
]

HF_GRID = ["ideal_robot", "competent", "busy_shift", "stretched"]


def run_case(name, scenario):
    last = None
    for snap in stream(scenario, max_steps=400):
        last = snap
        if snap.get("verdict"):
            break
    margin = last.get("margin") or {}
    return {
        "name": name,
        "verdict": last.get("verdict"),
        "t": last["t"],
        "ebl": last["ebl"],
        "peak_debt": margin.get("peak_oxygen_debt"),
        "map_nadir": margin.get("map_nadir"),
        "source_control_min": margin.get("source_control_min"),
        "exsanguinating": last.get("exsanguinating"),
    }


def main():
    print("=== SERA margin sweep ===\n")
    print(f"{'case':<40} {'verdict':<22} {'t':>5} {'EBL':>6} {'debt':>5} {'MAP↓':>4} {'ctrl':>5}")
    print("-" * 90)
    for phen_label, phen_kw in PHENOTYPE_GRID:
        preset = phen_kw.pop("preset", phen_label if phen_label in PRESETS else "typical_atonic")
        if preset not in PRESETS:
            preset = "typical_atonic"
        for hf_key in HF_GRID:
            tr = build_response(preset)
            sc = scenario_from_profile(
                70, 25, 500, [], tr,
                tissue_severity=phen_kw.get("tissue_severity", 0.0),
                trauma_severity=phen_kw.get("trauma_severity", 0.0),
                human_factors=preset_human_factors(hf_key),
            )
            label = f"{phen_label} × {hf_key}"
            try:
                r = run_case(label, sc)
                ctrl = r["source_control_min"]
                ctrl_s = f"{ctrl:.0f}" if ctrl is not None else "—"
                print(
                    f"{label:<40} {r['verdict'] or '?':<22} {r['t']:5.1f} "
                    f"{r['ebl']:6.0f} {r['peak_debt'] or 0:5.0f} {r['map_nadir'] or 0:4.0f} {ctrl_s:>5}"
                )
            except Exception as exc:
                print(f"{label:<40} ERROR: {exc}")


if __name__ == "__main__":
    main()
