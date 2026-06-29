#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Stage 2 Sandbox
===========================================

Layers ON TOP of Stage 1 (it imports the Stage 1 patient unchanged) and adds:

  * vitals a clinician actually watches — heart rate + MAP   (R-CIRC-1 / R-CIRC-2)
  * the universal oxygen engine — delivery, debt, lactate    (R-ARR-1)

The arrest trigger graduates from Stage 1's crude "40% volume lost" proxy to the
real mechanism: oxygen delivery collapsing (MAP floor). Cumulative oxygen debt is
modelled and RECORDED but, per the scope decision in RULES.md (R-OUT-DEATH), it
does NOT score the algorithm — the app manages the acute emergency, not ITU.

Every constant is tagged to a signed-off rule. Calibration values with no direct
citation are flagged [ASSUMED] (same discipline as RULES.md).

Run:  python3 simulator/stage2_sandbox.py
"""

from stage1_sandbox import (
    Patient, BASELINE_FLOW_ML_MIN, responsiveness_from_risk_factors,
)

# ── Stage 2 constants ──────────────────────────────────────────────────────

NORMAL_MAP = 90                  # R-CIRC-2: normal mean arterial pressure (pregnant ~baseline)
BASELINE_HR = 80                 # R-CIRC-1: resting maternal heart rate
MAP_ARREST = 35                  # R-ARR-1 (acute): perfusion floor; below this the heart can't sustain output

# R-CIRC-1 / R-CIRC-2 — MAP vs fraction of blood volume lost (breakpoints).
# Compensation holds MAP until ~30% loss, then it falls off a cliff. Values
# within the ATLS class ranges; exact interpolation [ASSUMED].
MAP_BREAKPOINTS = [   # (fraction_lost, MAP)
    (0.00, 90),
    (0.15, 85),       # Class I/II boundary — still compensated
    (0.30, 75),       # Class II/III — compensation straining
    (0.40, 45),       # Class III/IV — pressure falling steeply
    (0.50, 25),       # exsanguination — arrest territory
]

# Oxygen engine (R-ARR-1).
DO2_NORMAL_ML_KG_MIN = 12.0      # normal oxygen delivery [ASSUMED, standard physiology ~10-12]
VO2_DEMAND_ML_KG_MIN = 3.5       # tissue oxygen demand (basal) [ASSUMED, ~1 MET]
DEBT_ADEQUACY_FLOOR = 0.70       # perfusion below 70% of normal starts incurring debt [ASSUMED calibration]
LD50_DEBT_ML_KG = 113.5          # R-ARR-1 / R12 (PMID 1989759): lethal cumulative oxygen debt (LD50)
LACTATE_AT_LD50 = 12.9           # R12: lactate correlate at LD50
LACTATE_NORMAL = 1.0


def interp(x, points):
    """Linear interpolation over a list of (x, y) breakpoints."""
    if x <= points[0][0]:
        return points[0][1]
    if x >= points[-1][0]:
        return points[-1][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x0 <= x <= x1:
            t = (x - x0) / (x1 - x0)
            return y0 + t * (y1 - y0)
    return points[-1][1]


class PatientV2(Patient):
    """Stage 1 patient + vitals + oxygen engine."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.oxygen_debt = 0.0          # cumulative, mL/kg (R-ARR-1)
        self._arrested_by_perfusion = False

    @property
    def heart_rate(self):
        # R-CIRC-1: HR climbs with volume lost (compensation), capped
        frac = max(0.0, self.fraction_lost)
        return min(180, BASELINE_HR + 160 * frac)

    @property
    def map(self):
        # R-CIRC-1 / R-CIRC-2: MAP held then collapses
        return interp(max(0.0, self.fraction_lost), MAP_BREAKPOINTS)

    @property
    def perfusion_adequacy(self):
        return self.map / NORMAL_MAP

    @property
    def oxygen_delivery(self):
        # R-ARR-1: delivery tracks perfusion
        return DO2_NORMAL_ML_KG_MIN * self.perfusion_adequacy

    @property
    def lactate(self):
        # R12: lactate rises with cumulative debt; anchored 1.0 (normal) -> 12.9 at LD50
        return LACTATE_NORMAL + self.oxygen_debt * (LACTATE_AT_LD50 - LACTATE_NORMAL) / LD50_DEBT_ML_KG

    @property
    def arrested(self):
        # R-ARR-1 (acute): arrest when oxygen delivery collapses (perfusion floor)
        return self.map <= MAP_ARREST

    def tick(self, now_min, dt_min=1.0, fluids_in=0.0, blood_in=0.0):
        super().tick(now_min, dt_min=dt_min, fluids_in=fluids_in, blood_in=blood_in)
        # R-ARR-1: accumulate oxygen debt when perfusion is inadequate
        if self.perfusion_adequacy < DEBT_ADEQUACY_FLOOR:
            shortfall = (DEBT_ADEQUACY_FLOOR - self.perfusion_adequacy) / DEBT_ADEQUACY_FLOOR
            self.oxygen_debt += VO2_DEMAND_ML_KG_MIN * shortfall * dt_min


def run(scenario):
    p = PatientV2(
        weight_kg=scenario.get("weight_kg", 70),
        risk_factors=scenario.get("risk_factors", []),
    )
    events = scenario.get("events", {})
    duration = scenario.get("duration_min", 12)

    print(f"\n=== {scenario['name']} ===")
    print(f"weight {p.weight_kg} kg -> start {p.start_volume:.0f} ml | "
          f"risk {scenario.get('risk_factors', []) or 'none'} -> R = {p.responsiveness:.2f}")
    print(f"{'min':>3} | {'blood':>5} | {'tone':>4} | {'bleed':>5} | "
          f"{'HR':>3} | {'MAP':>3} | {'O2debt':>6} | {'lact':>4} | note")
    print("-" * 74)

    for minute in range(duration + 1):
        note = ""
        fluids_in = blood_in = 0.0
        ev = events.get(minute)
        if ev:
            if ev[0] == "oxytocin":
                p.give_oxytocin(minute); note = ">>> OXYTOCIN"
            elif ev[0] == "blood":
                blood_in = ev[1]; note = f">>> blood {ev[1]:.0f}"
            elif ev[0] == "fluids":
                fluids_in = ev[1]; note = f">>> fluids {ev[1]:.0f}"

        print(f"{minute:>3} | {p.blood_volume:>5.0f} | {p.tone:>4.2f} | {p.bleed_rate:>5.0f} | "
              f"{p.heart_rate:>3.0f} | {p.map:>3.0f} | {p.oxygen_debt:>6.1f} | "
              f"{p.lactate:>4.1f} | {note}")

        p.tick(minute, dt_min=1.0, fluids_in=fluids_in, blood_in=blood_in)

        if p.arrested:
            print(f"    *** ACUTE ARREST at min {minute+1} — oxygen delivery collapsed "
                  f"(MAP {p.map:.0f} <= {MAP_ARREST}) [R-ARR-1] ***")
            print(f"    recorded: oxygen debt {p.oxygen_debt:.1f} mL/kg, lactate {p.lactate:.1f} "
                  f"(LD50 debt = {LD50_DEBT_ML_KG}; recorded, not scored — RULES R-OUT-DEATH)")
            return "ARREST"

    controlled = p.bleed_rate < 50 and p.map > 60
    print(f"    outcome: {'STABILISING — bleeding controlled, perfusion holding' if controlled else 'ongoing shock'}"
          f"  (peak oxygen debt {p.oxygen_debt:.1f} mL/kg)")
    return "SURVIVE" if controlled else "ONGOING"


SCENARIOS = [
    {
        "name": "A — Low-risk responder, aggressive early resus (SURVIVES)",
        "weight_kg": 70, "risk_factors": [],
        "events": {0: ("oxytocin",), 1: ("blood", 1000), 2: ("blood", 1000), 3: ("blood", 1000)},
    },
    {
        "name": "B — Untreated atony (ARRESTS via perfusion collapse)",
        "weight_kg": 70, "risk_factors": [],
        "events": {},
    },
    {
        "name": "C — Refractory patient, early oxytocin + blood (ARRESTS anyway)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "prolonged_labour", "praevia_or_accreta"],
        "events": {2: ("oxytocin",), 3: ("blood", 1500)},
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 2 Sandbox")
    print("(Stage 1 + vitals [HR/MAP] + oxygen delivery/debt/lactate; arrest = perfusion collapse)")
    for sc in SCENARIOS:
        run(sc)
    print("\nEvery constant is tagged to a signed-off rule in simulator/RULES.md.")
    print("[ASSUMED] = calibration value awaiting clinical sign-off (see audit note).")
