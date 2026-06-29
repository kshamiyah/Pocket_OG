#!/usr/bin/env python3
"""
Batch-run SERA against the real SOS engine.

Usage:
  python3 simulator/batch_run.py
  python3 simulator/batch_run.py --preset typical_atonic --count 10
"""

import argparse
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "bridge"))
sys.path.insert(0, HERE)

from patient_profile import PRESETS, scenario_from_profile  # noqa: E402
from app_operator import stream  # noqa: E402

# Low-risk presentation grid (typical_atonic phenotype for all)
LOW_RISK_COHORT = [
    {"id": 1,  "weight_kg": 70, "bmi": 25, "start_ebl": 500, "risk_factors": []},
    {"id": 2,  "weight_kg": 60, "bmi": 22, "start_ebl": 500, "risk_factors": []},
    {"id": 3,  "weight_kg": 80, "bmi": 28, "start_ebl": 550, "risk_factors": []},
    {"id": 4,  "weight_kg": 55, "bmi": 24, "start_ebl": 500, "risk_factors": []},
    {"id": 5,  "weight_kg": 90, "bmi": 30, "start_ebl": 600, "risk_factors": []},
    {"id": 6,  "weight_kg": 65, "bmi": 25, "start_ebl": 500, "risk_factors": ["macrosomia"]},
    {"id": 7,  "weight_kg": 75, "bmi": 26, "start_ebl": 500, "risk_factors": []},
    {"id": 8,  "weight_kg": 50, "bmi": 23, "start_ebl": 550, "risk_factors": []},
    {"id": 9,  "weight_kg": 85, "bmi": 32, "start_ebl": 500, "risk_factors": []},
    {"id": 10, "weight_kg": 70, "bmi": 25, "start_ebl": 650, "risk_factors": []},
]

ALGORITHM_FLAGS = {
    "massive_pathway": ("call_massive", "mhp_pack", "massive level before control"),
    "major_pathway": ("call_major", "blood_products", "major haemorrhage workup"),
    "surgical_consider": ("bakri", "theatre", "surgical consider / theatre"),
    "extra_uterotonics": ("ergometrine", "carboprost", "uterotonic ladder beyond oxytocin"),
    "transfusion": ("rapid_cryst", "blood_products", "transfusion started"),
    "mechanical_bridge": ("bimanual compression", "bimanual compression", "bimanual compression used"),
}


def analyse_run(snaps):
    """Extract metrics and heuristic algorithm flags from a run."""
    if not snaps:
        return {}
    last = snaps[-1]
    maps = [s["map"] for s in snaps]
    acted = [s for s in snaps if s.get("acted")]
    notes = " ".join(s.get("note") or "" for s in acted)
    levels = [s.get("level") for s in snaps]

    flags = []
    for name, (a, b, desc) in ALGORITHM_FLAGS.items():
        if a in notes or b in notes or (name == "massive_pathway" and "massive" in levels):
            if name == "major_pathway" and last["verdict"] == "CONTROLLED" and last["ebl"] < 1000:
                continue  # minor only — not a flag
            if name == "massive_pathway" and "massive" not in levels:
                continue
            flags.append(desc)

    massage_zero = any(
        s.get("note") == "fundal massage" and s.get("bleed") == 0
        for s in snaps
    )
    if massage_zero:
        flags.append("bleed stopped on chart before drugs (fundal spike)")

    oxy_steps = [s for s in acted if "oxytocin" in (s.get("note") or "")]
    first_oxy = oxy_steps[0]["t"] if oxy_steps else None
    first_massage = next((s["t"] for s in acted if "fundal massage" in (s.get("note") or "")), None)

    return {
        "verdict": last.get("verdict"),
        "t_min": last.get("t"),
        "ebl": last.get("ebl"),
        "final_tone": last.get("tone"),
        "min_map": min(maps),
        "max_level": max(levels, key=lambda l: ["minor", "major", "massive"].index(l)),
        "steps": len(snaps),
        "first_massage_t": first_massage,
        "first_oxytocin_t": first_oxy,
        "flags": flags,
    }


def run_cohort(cases, preset_key):
    phenotype = PRESETS[preset_key]
    results = []
    for case in cases:
        sc = scenario_from_profile(
            case["weight_kg"], case["bmi"], case["start_ebl"],
            case.get("risk_factors", []), phenotype,
        )
        snaps = list(stream(sc))
        summary = analyse_run(snaps)
        summary["id"] = case["id"]
        summary["weight_kg"] = case["weight_kg"]
        summary["bmi"] = case["bmi"]
        summary["start_ebl"] = case["start_ebl"]
        summary["risk_factors"] = case.get("risk_factors", [])
        results.append(summary)
    return results


def print_report(results):
    print(f"\n{'ID':>3} {'kg':>4} {'BMI':>4} {'start':>5} {'verdict':>10} {'t':>5} {'EBL':>5} {'tone':>5} {'minMAP':>6} {'level':>7}  flags")
    print("-" * 95)
    for r in results:
        flag_str = "; ".join(r["flags"]) if r["flags"] else "—"
        print(
            f"{r['id']:>3} {r['weight_kg']:>4} {r['bmi']:>4} {r['start_ebl']:>5} "
            f"{r['verdict'] or '?' :>10} {r['t_min']:>5.1f} {r['ebl']:>5} {r['final_tone']:>5.2f} "
            f"{r['min_map']:>6} {r['max_level']:>7}  {flag_str}"
        )

    # Aggregate algorithm observations
    print("\n=== ALGORITHM OBSERVATIONS (low-risk cohort) ===\n")
    controlled = [r for r in results if r["verdict"] == "CONTROLLED"]
    arrests = [r for r in results if r["verdict"] == "ARREST"]
    ongoing = [r for r in results if r["verdict"] not in ("CONTROLLED", "ARREST")]

    print(f"Controlled: {len(controlled)}/10 | Arrest: {len(arrests)} | Ongoing: {len(ongoing)}")
    if controlled:
        ebls = [r["ebl"] - r["start_ebl"] for r in controlled]
        times = [r["t_min"] for r in controlled]
        print(f"Extra blood loss after recognition: min {min(ebls):.0f} ml, max {max(ebls):.0f} ml, mean {sum(ebls)/len(ebls):.0f} ml")
        print(f"Time to control: {min(times):.1f}–{max(times):.1f} min (mean {sum(times)/len(times):.1f})")

    flag_counts = {}
    for r in results:
        for f in r["flags"]:
            flag_counts[f] = flag_counts.get(f, 0) + 1
    if flag_counts:
        print("\nFlags across cohort:")
        for f, n in sorted(flag_counts.items(), key=lambda x: -x[1]):
            print(f"  [{n}/10] {f}")

    issues = []
    if arrests:
        issues.append(f"{len(arrests)} low-risk patient(s) arrested — algorithm or phenotype mismatch")
    over_tx = [r for r in results if r["verdict"] == "CONTROLLED" and any("transfusion" in x for x in r["flags"])]
    if over_tx:
        issues.append(f"{len(over_tx)}/10 controlled but transfusion pathway opened — possible over-escalation for minor/early major")
    over_surg = [r for r in results if any("surgical" in x for x in r["flags"])]
    if over_surg:
        issues.append(f"{len(over_surg)}/10 triggered surgical consider — unexpected for typical atonic low-risk")
    over_utero = [r for r in results if any("uterotonic ladder beyond" in x for x in r["flags"])]
    if over_utero:
        issues.append(f"{len(over_utero)}/10 escalated past oxytocin despite responsive uterus")
    massage_all = sum(1 for r in results if any("fundal spike" in x for x in r["flags"]))
    if massage_all:
        issues.append(f"{massage_all}/10 show instant bleed stop on fundal before drugs")

    if issues:
        print("\nPotential algorithm / protocol issues to review:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. {issue}")
    else:
        print("\nNo heuristic flags — protocol performed as expected on all low-risk runs.")

    return results


def main():
    parser = argparse.ArgumentParser(description="Batch-run SERA against the SOS engine")
    parser.add_argument("--preset", default="typical_atonic", choices=list(PRESETS.keys()))
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--json", action="store_true", help="Print raw JSON results")
    args = parser.parse_args()

    cases = LOW_RISK_COHORT[: args.count]
    print(f"Running {len(cases)} patients — preset: {args.preset}")
    results = run_cohort(cases, args.preset)
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print_report(results)


if __name__ == "__main__":
    main()
