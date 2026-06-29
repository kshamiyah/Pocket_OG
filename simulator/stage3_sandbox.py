#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Stage 3 Sandbox (uterotonic ladder, two clocks)
===========================================================================

Adds the full uterotonic ladder with TWO separate clocks, after verifying how
the live app actually works (emergency branch, pph-shared.js):

  CLOCK 1 — ESCALATION timing: when the OPERATOR gives the next rung.
      = the app's pharmacological wait, SCALED DOWN by bleed rate
        (brisk bleeding -> escalate within ~60 s).  [source: app I1]

  CLOCK 2 — drug ONSET: when a given drug STARTS raising tone.
      = a separate pharmacological value (the app does NOT model this).
        [ASSUMED — awaiting clinical sign-off]

The operator climbs the ladder automatically while bleeding continues; each
agent then raises tone after its onset, stacking via R-TONE-GAIN. Transfusion
is modest and capped (no more 15-litre fixes).

Run:  python3 simulator/stage3_sandbox.py
"""

from stage1_sandbox import (
    BASELINE_FLOW_ML_MIN, MATERNAL_ML_PER_KG, responsiveness_from_risk_factors,
)
from stage2_sandbox import (
    NORMAL_MAP, BASELINE_HR, MAP_ARREST, MAP_BREAKPOINTS, interp,
    DO2_NORMAL_ML_KG_MIN, VO2_DEMAND_ML_KG_MIN, DEBT_ADEQUACY_FLOOR,
    LD50_DEBT_ML_KG, LACTATE_AT_LD50, LACTATE_NORMAL,
)

# ── CLOCK 1: escalation timing — ported from app pph-shared.js (I1) ─────────
UTEROTONIC_DELAY_FLOOR_SEC = 60
UTEROTONIC_PHARM_DELAY_SEC = {
    "oxytocin": 180, "ergometrine": 300, "carboprost": 900, "misoprostol": 600,
}


def scale_delay_by_bleed_rate(base_sec, rate_ml_min, floor_sec=UTEROTONIC_DELAY_FLOOR_SEC):
    """App logic: brisk bleeding shortens the wait before escalating (I1)."""
    if base_sec <= 0:
        return base_sec
    if rate_ml_min < 1:
        return base_sec
    if rate_ml_min < 10:
        return max(floor_sec, round(base_sec * 0.75))
    if rate_ml_min < 50:
        return max(floor_sec, round(base_sec * 0.5))
    return floor_sec


# ── CLOCK 2: drug onset of effect — SEPARATE, pharmacological [ASSUMED] ─────
# When the drug STARTS raising tone (not the app's escalation wait).
ONSET_MIN = {
    "oxytocin": 2,      # fast (IV faster than IM)
    "ergometrine": 2,   # fast
    "carboprost": 4,    # starts within minutes (full effect builds later)
    "misoprostol": 10,  # genuinely slow agent
}
TARGET_TONE = {        # R-TONE-GAIN targets at R = 1
    "oxytocin": 0.95, "ergometrine": 0.95, "carboprost": 0.97, "misoprostol": 0.95,
}
LADDER = ["oxytocin", "ergometrine", "carboprost", "misoprostol"]

MASSAGE_BONUS = 0.30
MASSAGE_DECAY_PER_MIN = 0.10
CONTROLLED_BLEED = 100        # ml/min — operator stops escalating below this
TRANSFUSION_CAP_ML = 3000     # realistic ceiling for this sandbox


class PatientV3:
    def __init__(self, weight_kg=70, risk_factors=None):
        self.weight_kg = weight_kg
        self.blood_volume = weight_kg * MATERNAL_ML_PER_KG
        self.start_volume = self.blood_volume
        self.responsiveness = responsiveness_from_risk_factors(risk_factors or [])
        self.sustained_tone = 0.0
        self.massage_bonus = 0.0
        self.oxygen_debt = 0.0
        self._pending = []     # (effect_min, target)

    @property
    def tone(self):
        return min(1.0, self.sustained_tone + self.massage_bonus)

    @property
    def bleed_rate(self):
        return BASELINE_FLOW_ML_MIN * (1.0 - self.tone)

    @property
    def fraction_lost(self):
        return (self.start_volume - self.blood_volume) / self.start_volume

    @property
    def heart_rate(self):
        return min(180, BASELINE_HR + 160 * max(0.0, self.fraction_lost))

    @property
    def map(self):
        return interp(max(0.0, self.fraction_lost), MAP_BREAKPOINTS)

    @property
    def perfusion_adequacy(self):
        return self.map / NORMAL_MAP

    @property
    def lactate(self):
        return LACTATE_NORMAL + self.oxygen_debt * (LACTATE_AT_LD50 - LACTATE_NORMAL) / LD50_DEBT_ML_KG

    @property
    def arrested(self):
        return self.map <= MAP_ARREST

    def give_uterotonic(self, drug_id, now_min):
        self._pending.append((now_min + ONSET_MIN[drug_id], TARGET_TONE[drug_id]))

    def give_massage(self):
        self.massage_bonus = MASSAGE_BONUS

    def tick(self, now_min, dt_min=1.0, blood_in=0.0):
        keep = []
        for effect_min, target in self._pending:
            if now_min >= effect_min:
                if target > self.sustained_tone:
                    self.sustained_tone += (target - self.sustained_tone) * self.responsiveness
            else:
                keep.append((effect_min, target))
        self._pending = keep
        self.massage_bonus = max(0.0, self.massage_bonus - MASSAGE_DECAY_PER_MIN * dt_min)
        self.blood_volume += blood_in - self.bleed_rate * dt_min
        if self.blood_volume < 0:
            self.blood_volume = 0.0
        if self.perfusion_adequacy < DEBT_ADEQUACY_FLOOR:
            shortfall = (DEBT_ADEQUACY_FLOOR - self.perfusion_adequacy) / DEBT_ADEQUACY_FLOOR
            self.oxygen_debt += VO2_DEMAND_ML_KG_MIN * shortfall * dt_min


def run(scenario):
    p = PatientV3(scenario.get("weight_kg", 70), scenario.get("risk_factors", []))
    duration = scenario.get("duration_min", 30)

    # operator state
    next_rung = 0
    last_drug_id, last_drug_min = None, None
    total_blood = 0.0
    transfused_at_fraction = -1

    print(f"\n=== {scenario['name']} ===")
    print(f"weight {p.weight_kg} kg | risk {scenario.get('risk_factors', []) or 'none'} -> R = {p.responsiveness:.2f}")
    print(f"{'min':>3} | {'blood':>5} | {'tone':>4} | {'bleed':>5} | {'HR':>3} | {'MAP':>3} | {'lact':>4} | operator action")
    print("-" * 78)

    for minute in range(duration + 1):
        action = ""
        blood_in = 0.0

        # ── OPERATOR ──
        if minute == 0:
            p.give_massage(); action += "massage + "
        # CLOCK 1: escalate up the ladder while bleeding continues
        if p.bleed_rate >= CONTROLLED_BLEED and next_rung < len(LADDER):
            due = False
            if last_drug_id is None:
                due = True
            else:
                wait_min = scale_delay_by_bleed_rate(
                    UTEROTONIC_PHARM_DELAY_SEC[last_drug_id], p.bleed_rate) / 60.0
                due = (minute - last_drug_min) >= wait_min
            if due:
                drug = LADDER[next_rung]
                p.give_uterotonic(drug, minute)
                last_drug_id, last_drug_min = drug, minute
                next_rung += 1
                action += f"give {drug} "
        # transfusion: modest boluses per ~15% lost, capped
        band = int(max(0.0, p.fraction_lost) / 0.15)
        if band > transfused_at_fraction and total_blood < TRANSFUSION_CAP_ML:
            blood_in = 1000.0
            total_blood += 1000.0
            transfused_at_fraction = band
            action += "+ blood 1000 "

        print(f"{minute:>3} | {p.blood_volume:>5.0f} | {p.tone:>4.2f} | {p.bleed_rate:>5.0f} | "
              f"{p.heart_rate:>3.0f} | {p.map:>3.0f} | {p.lactate:>4.1f} | {action.strip()}")

        p.tick(minute, dt_min=1.0, blood_in=blood_in)

        if p.arrested:
            print(f"    *** ACUTE ARREST at min {minute+1} — perfusion collapse (MAP {p.map:.0f}) ***")
            print(f"    total blood: {total_blood:.0f} ml | final tone {p.tone:.2f} -> drugs maxed out, needs SURGERY")
            return "ARREST"

    controlled = p.bleed_rate < 50 and p.map > 60
    print(f"    outcome: {'CONTROLLED — tap closed, perfusion restored' if controlled else 'ongoing shock'}")
    print(f"    final tone {p.tone:.2f} | total blood {total_blood:.0f} ml | peak O2 debt {p.oxygen_debt:.1f} mL/kg")
    return "SURVIVE" if controlled else "ONGOING"


SCENARIOS = [
    {
        "name": "Partial responder — auto-escalating ladder (was 'limping', now treated right)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "fibroids"],          # R = 0.55
        "duration_min": 30,
    },
    {
        "name": "Refractory uterus — full ladder still not enough (needs surgery)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "prolonged_labour", "praevia_or_accreta"],  # R = 0.30
        "duration_min": 30,
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 3 (two clocks: escalation vs onset)")
    print("Operator climbs the ladder on the app's bleed-rate-scaled timer; drugs act on a separate onset.")
    for sc in SCENARIOS:
        run(sc)
    print("\nClock 1 (escalation) = app pph-shared.js (I1). Clock 2 (onset) = [ASSUMED], needs sign-off.")
