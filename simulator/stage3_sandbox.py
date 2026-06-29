#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Stage 3 Sandbox (uterotonic ladder)
===============================================================

Adds the full uterotonic ladder on top of Stage 2's vitals + oxygen engine.
The clinical point this demonstrates: ongoing bleeding is fixed by raising
TONE, not by transfusion. Stacking agents (R-TONE-GAIN) lets even a partial
responder climb toward tone = 1 and close the tap — with sane fluid volumes.

Ladder (timing from the app's pph-shared.js, I1; targets from RULES R-TONE-GAIN):
  oxytocin    onset 3 min   target tone 0.95
  ergometrine onset 5 min   target tone 0.95
  carboprost  onset 15 min  target tone 0.97   (also repeatable; not modelled here)
  misoprostol onset 10 min  target tone 0.95
  massage     immediate, transient +0.3, decays 0.1/min   (R-DRUG-MASSAGE)

Each agent pulls tone toward its target, scaled by responsiveness R
(R-TONE-RESP / R-TONE-GAIN). Stacking is cumulative.

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

# Uterotonic ladder — onset (min) from app timing (I1), target tone (R-TONE-GAIN)
UTEROTONICS = {
    "oxytocin":    {"onset_min": 3,  "target": 0.95},
    "ergometrine": {"onset_min": 5,  "target": 0.95},
    "carboprost":  {"onset_min": 15, "target": 0.97},
    "misoprostol": {"onset_min": 10, "target": 0.95},
}
MASSAGE_BONUS = 0.30          # R-DRUG-MASSAGE: immediate transient tone gain
MASSAGE_DECAY_PER_MIN = 0.10  # R-DRUG-MASSAGE: fades without a drug to sustain it


class PatientV3:
    def __init__(self, weight_kg=70, risk_factors=None):
        self.weight_kg = weight_kg
        self.blood_volume = weight_kg * MATERNAL_ML_PER_KG     # R-VOL-1
        self.start_volume = self.blood_volume
        self.responsiveness = responsiveness_from_risk_factors(risk_factors or [])
        self.sustained_tone = 0.0     # from uterotonics (R-TONE-GAIN stacking)
        self.massage_bonus = 0.0      # transient mechanical (R-DRUG-MASSAGE)
        self.oxygen_debt = 0.0
        self._pending = []            # list of (effect_min, target)

    # ── tone & bleeding ────────────────────────────────────────────────
    @property
    def tone(self):
        return min(1.0, self.sustained_tone + self.massage_bonus)

    @property
    def bleed_rate(self):
        return BASELINE_FLOW_ML_MIN * (1.0 - self.tone)        # R-BLEED-2

    @property
    def fraction_lost(self):
        return (self.start_volume - self.blood_volume) / self.start_volume

    # ── vitals (R-CIRC-1/2) ────────────────────────────────────────────
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
        return self.map <= MAP_ARREST                          # R-ARR-1 (acute)

    # ── interventions ──────────────────────────────────────────────────
    def give_uterotonic(self, drug_id, now_min):
        d = UTEROTONICS[drug_id]
        self._pending.append((now_min + d["onset_min"], d["target"]))

    def give_massage(self):
        self.massage_bonus = MASSAGE_BONUS

    def tick(self, now_min, dt_min=1.0, fluids_in=0.0, blood_in=0.0):
        # apply any uterotonic whose onset has arrived — stacking (R-TONE-GAIN)
        still_pending = []
        for effect_min, target in self._pending:
            if now_min >= effect_min:
                if target > self.sustained_tone:
                    self.sustained_tone += (target - self.sustained_tone) * self.responsiveness
            else:
                still_pending.append((effect_min, target))
        self._pending = still_pending
        # massage fades (R-DRUG-MASSAGE)
        self.massage_bonus = max(0.0, self.massage_bonus - MASSAGE_DECAY_PER_MIN * dt_min)
        # volume balance (R-VOL-2)
        self.blood_volume += fluids_in + blood_in - self.bleed_rate * dt_min
        if self.blood_volume < 0:
            self.blood_volume = 0.0
        # oxygen debt (R-ARR-1)
        if self.perfusion_adequacy < DEBT_ADEQUACY_FLOOR:
            shortfall = (DEBT_ADEQUACY_FLOOR - self.perfusion_adequacy) / DEBT_ADEQUACY_FLOOR
            self.oxygen_debt += VO2_DEMAND_ML_KG_MIN * shortfall * dt_min


def run(scenario):
    p = PatientV3(scenario.get("weight_kg", 70), scenario.get("risk_factors", []))
    events = scenario.get("events", {})
    duration = scenario.get("duration_min", 30)
    total_blood = 0.0

    print(f"\n=== {scenario['name']} ===")
    print(f"weight {p.weight_kg} kg -> start {p.start_volume:.0f} ml | "
          f"risk {scenario.get('risk_factors', []) or 'none'} -> R = {p.responsiveness:.2f}")
    print(f"{'min':>3} | {'blood':>5} | {'tone':>4} | {'bleed':>5} | "
          f"{'HR':>3} | {'MAP':>3} | {'lact':>4} | note")
    print("-" * 70)

    for minute in range(duration + 1):
        note = ""
        fluids_in = blood_in = 0.0
        for ev in events.get(minute, []):
            if ev[0] == "drug":
                p.give_uterotonic(ev[1], minute); note += f">>> {ev[1]} "
            elif ev[0] == "massage":
                p.give_massage(); note += ">>> massage/bimanual "
            elif ev[0] == "blood":
                blood_in += ev[1]; total_blood += ev[1]; note += f">>> blood {ev[1]:.0f} "

        print(f"{minute:>3} | {p.blood_volume:>5.0f} | {p.tone:>4.2f} | {p.bleed_rate:>5.0f} | "
              f"{p.heart_rate:>3.0f} | {p.map:>3.0f} | {p.lactate:>4.1f} | {note}")

        p.tick(minute, dt_min=1.0, fluids_in=fluids_in, blood_in=blood_in)

        if p.arrested:
            print(f"    *** ACUTE ARREST at min {minute+1} — perfusion collapse (MAP {p.map:.0f}) ***")
            print(f"    total blood given: {total_blood:.0f} ml")
            return "ARREST"

    controlled = p.bleed_rate < 50 and p.map > 60
    print(f"    outcome: {'CONTROLLED — bleeding stopped, perfusion restored' if controlled else 'ongoing shock'}")
    print(f"    final tone {p.tone:.2f}  |  total blood given: {total_blood:.0f} ml"
          f"  |  peak oxygen debt {p.oxygen_debt:.1f} mL/kg")
    return "SURVIVE" if controlled else "ONGOING"


SCENARIOS = [
    {
        # Partial responder — the Stage 2 'limping' patient — but treated by
        # ESCALATING THE LADDER instead of drowning her in 15 L of blood.
        "name": "Partial responder — climb the uterotonic ladder (sane fluids)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "fibroids"],   # R = 0.55
        "events": {
            0: [("massage",), ("drug", "oxytocin")],
            1: [("blood", 1000)],
            3: [("massage",), ("drug", "ergometrine")],
            4: [("blood", 1000)],
            8: [("drug", "carboprost")],
            9: [("blood", 500)],
            12: [("drug", "misoprostol")],
        },
        "duration_min": 30,
    },
    {
        # Same ladder, but a TRULY refractory uterus (R = 0.30): even the full
        # ladder can't reach control -> this is the patient who needs surgery.
        "name": "Refractory uterus — full ladder still not enough (needs surgery)",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "prolonged_labour", "praevia_or_accreta"],  # R = 0.30
        "events": {
            0: [("massage",), ("drug", "oxytocin")],
            1: [("blood", 1000)],
            3: [("drug", "ergometrine")],
            4: [("blood", 1000)],
            8: [("drug", "carboprost")],
            9: [("blood", 1000)],
            12: [("drug", "misoprostol")],
        },
        "duration_min": 30,
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 3 Sandbox (uterotonic ladder)")
    print("Point: control comes from raising TONE (stacking uterotonics), not from transfusion.")
    for sc in SCENARIOS:
        run(sc)
    print("\nEvery constant is tagged to a signed-off rule in simulator/RULES.md.")
