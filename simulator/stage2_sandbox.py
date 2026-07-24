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
    (0.40, 58),       # decompensating — kept above coronary arrest floor [TUNABLE C-CAL]
    (0.50, 48),       # permissive-hypotension tail — must stay above CPP arrest [TUNABLE B×G]
]

# Oxygen engine (R-ARR-1 / SERA handover Section C).
DO2_NORMAL_ML_KG_MIN = 12.0      # normal oxygen delivery at MAP 90, Hb 110 [ASSUMED]
DO2_CRIT_ML_KG_MIN = 4.0         # critical DO₂ — shock flag (BJA / LITFL)
VO2_DEMAND_ML_KG_MIN = 3.5       # tissue oxygen demand (basal) [ASSUMED, ~1 MET]
MAX_O2_EXTRACTION_RATIO = 0.65   # max O₂ER ~0.6–0.7
# Supply-dependency shoulder (R-ARR-1): progressive strain as extraction nears its limit
DO2_CRIT_EXTRACTION_ML_KG_MIN = VO2_DEMAND_ML_KG_MIN / MAX_O2_EXTRACTION_RATIO  # ~5.4
DO2_STRAIN_ML_KG_MIN = 2.0 * VO2_DEMAND_ML_KG_MIN                               # 7.0 — ratio 2:1
DEBT_SHOULDER_MAX_ML_KG_MIN = 0.5   # shoulder accrual at full strain [TUNABLE]
LD50_DEBT_ML_KG = 113.5          # R-ARR-1 / R12 (PMID 1989759): lethal cumulative oxygen debt (LD50)
# Repayment anchor: full LD50 debt clears in ~2 h at full surplus [TUNABLE — Section C item 19]
DEBT_REPAY_FULL_MIN = 120.0
DEBT_REPAY_MAX_ML_KG_MIN = LD50_DEBT_ML_KG / DEBT_REPAY_FULL_MIN
LACTATE_AT_LD50 = 12.9           # R12: lactate correlate at LD50
LACTATE_NORMAL = 1.0

# Legacy — retired as debt trigger; kept for stage2 sandbox only
DEBT_ADEQUACY_FLOOR = 0.70

# Haemoglobin (Section D)
STARTING_HB_DEFAULT_G_L = 110.0  # pregnancy default
PRBC_HB_G_L = 200.0              # packed cells ~200 g/L
HB_FLOOR_G_L = 25.0              # physiological minimum [TUNABLE — Section D]
HB_CEILING_G_L = PRBC_HB_G_L     # cannot exceed transfused packed-cell concentration

# MAP-coupled bleed (Section B)
P_PERFUSION_FLOOR_MMHG = 14.0    # self-tamponade floor [TUNABLE 10–15]

# R-CIRC-3c — exsanguination collapse [TUNABLE]
# Below this circulating fraction (blood_volume / start_volume), MAP falls from the
# compensated plateau toward 0 as the true tank empties. Reuses the coronary fuse;
# does not bite while volume is propped by infusion (treated debt path).
EXSANG_COLLAPSE_FRACTION = 0.40   # collapse begins below ~40% remaining volume

# Pulse pressure sub-model (Section G item 33) — narrows with volume deficit [ASSUMED anchors]
PP_BREAKPOINTS = [
    (0.00, 40.0),   # normal
    (0.15, 38.0),
    (0.30, 30.0),   # Class II/III — massive-transfusion predictor band
    (0.40, 20.0),
    (0.50, 15.0),   # terminal
]
RAP_MMHG = 10.0                  # right atrial pressure
CPP_ISCHEMIA_MMHG = 50.0         # ischaemia begins (StatPearls NBK551531)
CPP_ARREST_MMHG = 17.0           # arrest floor ~15–20
CORONARY_REVERSIBLE_WINDOW_MIN = 7.0  # ~6–8 min reversible window [TUNABLE]
# Injury accrual between ischaemia line and arrest floor [TUNABLE — Section G item 37]
CORONARY_INJURY_RATE_PER_MIN = 0.15   # [TUNABLE G item 37]
CORONARY_INJURY_RECOVERY_PER_MIN = 0.08
CORONARY_INJURY_ARREST_THRESHOLD = 1.0  # functional arrest after sustained ischaemia [TUNABLE]
CPP_INJURY_ARREST_MMHG = 40.0           # injury-triggered arrest while CPP below this [TUNABLE]
# R-CIRC-3b — acute compensation failure under fast haemorrhage [TUNABLE, uncapped]
ACUTE_BLEED_TOLERANCE_ML_MIN = 300.0  # chronic/severe atony source ~315 → minimal penalty
ACUTE_BLEED_PENALTY_K = 0.08          # mmHg per ml/min above tolerance [TUNABLE]

DTF_HR_BASE = 80.0
DTF_AT_BASE = 0.65
DTF_AT_MAX_HR = 0.40
DTF_MAX_HR = 180.0


def diastolic_time_fraction(hr):
    """Diastolic time fraction falls with tachycardia (Circulation 1999)."""
    hr = max(DTF_HR_BASE, min(DTF_MAX_HR, float(hr)))
    span = DTF_MAX_HR - DTF_HR_BASE
    return max(DTF_AT_MAX_HR, DTF_AT_BASE - (hr - DTF_HR_BASE) * (DTF_AT_BASE - DTF_AT_MAX_HR) / span)


def acute_bleed_map_penalty(source_stress_ml_min):
    """MAP drop from compensation failure under fast haemorrhage (R-CIRC-3b).

    Applied to pre-perfusion source demand (source_bleed × coag_multiplier).
    Tolerance sits above chronic severe-atony source (~315 ml/min) so slow tails
    keep the compensated MAP curve; torrential source (~700 ml/min) uncaps penalty.
    """
    excess = max(0.0, float(source_stress_ml_min) - ACUTE_BLEED_TOLERANCE_ML_MIN)
    return excess * ACUTE_BLEED_PENALTY_K


def perfusion_factor(map_mmhg, p_floor=P_PERFUSION_FLOOR_MMHG, normal_map=NORMAL_MAP):
    """Uterine bed pressure-passive bleed scaling (Section B)."""
    if normal_map <= p_floor:
        return 0.0
    return max(0.0, min(1.0, (map_mmhg - p_floor) / (normal_map - p_floor)))


def exsanguination_map_scale(circulating_fraction, collapse_fraction=EXSANG_COLLAPSE_FRACTION):
    """MAP multiplier as true circulating volume falls (R-CIRC-3c).

    At or above *collapse_fraction*, returns 1.0 (compensated plateau unchanged).
    From collapse_fraction → 0, linear taper to 0 so CPP crosses the coronary floor.
    """
    cf = max(0.0, float(circulating_fraction))
    if cf >= collapse_fraction or collapse_fraction <= 0:
        return 1.0
    return cf / collapse_fraction


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
    {
        # Partial responder, under-resuscitated: bleeding slowed but not stopped,
        # transfusion just keeps her off arrest. She "limps" in sustained shock —
        # the state where cumulative oxygen debt (and lactate) actually climb.
        "name": "D — Under-resuscitated: limps in sustained shock (oxygen debt climbs)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "fibroids"],   # ~R 0.55
        # oxytocin partially controls the bleed; transfusion just under the
        # post-control loss rate, so she sinks into and lingers in the shock band.
        "events": {**{m: ("blood", 345) for m in range(1, 46) if m != 3}, 3: ("oxytocin",)},
        "duration_min": 45,
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 2 Sandbox")
    print("(Stage 1 + vitals [HR/MAP] + oxygen delivery/debt/lactate; arrest = perfusion collapse)")
    for sc in SCENARIOS:
        run(sc)
    print("\nEvery constant is tagged to a signed-off rule in simulator/RULES.md.")
    print("[ASSUMED] = calibration value awaiting clinical sign-off (see audit note).")
