#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Stage 1 Sandbox
===========================================

The smallest working version of the patient: three numbers (blood volume,
uterine tone, bleed rate) + one drug (oxytocin) + a ticking clock.

Purpose: watch the accepted rules behave like a real patient before adding
vitals, the full drug ladder, arrest, or oxygen debt (those are Stage 2+).

Every constant below is tagged with the rule it comes from in RULES.md.
Run:  python3 simulator/stage1_sandbox.py
"""

# ── Constants (each tagged to a signed-off rule) ───────────────────────────

BASELINE_FLOW_ML_MIN = 700        # R-BLEED-1: atonic uterus blood flow at term
MATERNAL_ML_PER_KG = 95           # R-VOL-1: weight-based maternal blood volume
ARREST_FRACTION = 0.40            # R-ARR-1 (bleeding calibration): arrest at >40% loss

# R-DRUG-OXY: onset/effect window from the app (UTEROTONIC_PHARM_DELAY_SEC.oxytocin_bolus = 180 s)
OXYTOCIN_ONSET_MIN = 3
OXYTOCIN_TARGET_TONE = 0.95       # R-TONE-GAIN: target tone at full responsiveness

# R-TONE-RESP: GTG52 Table 1 risk factors -> weight subtracted from responsiveness.
# Weights derived from the guideline odds ratios (Stones et al. 1993), tiered:
#   OR >= 8  (very high) -> 0.25   | OR 3-5 (high) -> 0.15   | OR ~2 (moderate) -> 0.10
RISK_FACTOR_WEIGHTS = {
    "praevia_or_accreta": 0.25,    # OR ~13 (very high)
    "overdistension":     0.15,    # multiple pregnancy / polyhydramnios, OR ~4.5 (high)
    "previous_pph":       0.15,    # OR ~3 (high)
    "macrosomia":         0.10,    # OR ~2 (moderate)
    "prolonged_labour":   0.10,    # OR ~2 (moderate)
    "chorioamnionitis":   0.10,    # OR ~2 (moderate)
    "ga_or_augmentation": 0.10,    # OR ~2 (moderate)
    "grand_multiparity":  0.10,    # OR ~2 (moderate)
    "fibroids":           0.10,    # OR ~2 (moderate)
}


def responsiveness_from_risk_factors(factors):
    """R-TONE-RESP:  R = max(0.1, 1 - sum of present risk-factor weights)."""
    total = sum(RISK_FACTOR_WEIGHTS.get(f, 0.0) for f in factors)
    return max(0.1, 1.0 - total)


class Patient:
    def __init__(self, weight_kg=70, risk_factors=None, start_tone=0.0):
        self.weight_kg = weight_kg
        self.blood_volume = weight_kg * MATERNAL_ML_PER_KG     # R-VOL-1
        self.start_volume = self.blood_volume
        self.tone = start_tone
        self.responsiveness = responsiveness_from_risk_factors(risk_factors or [])
        self._pending_oxytocin_at = None      # min at which a given dose takes effect

    @property
    def bleed_rate(self):
        """R-BLEED-2:  bleed_rate = 700 x (1 - tone)."""
        return BASELINE_FLOW_ML_MIN * (1.0 - self.tone)

    @property
    def fraction_lost(self):
        return (self.start_volume - self.blood_volume) / self.start_volume

    @property
    def arrested(self):
        """R-ARR-1 (bleeding calibration): acute arrest once >40% volume lost."""
        return self.fraction_lost >= ARREST_FRACTION

    def give_oxytocin(self, now_min):
        # R-DRUG-OXY: effect lands after the onset delay
        self._pending_oxytocin_at = now_min + OXYTOCIN_ONSET_MIN

    def tick(self, now_min, dt_min=1.0, fluids_in=0.0, blood_in=0.0):
        # apply any oxytocin whose onset has arrived (R-TONE-GAIN, scaled by R)
        if self._pending_oxytocin_at is not None and now_min >= self._pending_oxytocin_at:
            self.tone = self.tone + (OXYTOCIN_TARGET_TONE - self.tone) * self.responsiveness
            self._pending_oxytocin_at = None
        # R-VOL-2: volume balance for this tick
        self.blood_volume += fluids_in + blood_in - self.bleed_rate * dt_min
        if self.blood_volume < 0:
            self.blood_volume = 0.0


def run(scenario):
    """Run one scenario and print a minute-by-minute trace."""
    p = Patient(
        weight_kg=scenario.get("weight_kg", 70),
        risk_factors=scenario.get("risk_factors", []),
    )
    events = scenario.get("events", {})   # {minute: ("oxytocin",) or ("blood", ml) or ("fluids", ml)}
    duration = scenario.get("duration_min", 12)

    print(f"\n=== {scenario['name']} ===")
    print(f"weight {p.weight_kg} kg  ->  start blood volume {p.start_volume:.0f} ml")
    print(f"risk factors {scenario.get('risk_factors', []) or 'none'}  ->  responsiveness R = {p.responsiveness:.2f}")
    print(f"{'min':>4} | {'blood ml':>9} | {'tone':>5} | {'bleed ml/min':>12} | {'lost %':>6} | note")
    print("-" * 66)

    for minute in range(duration + 1):
        note = ""
        ev = events.get(minute)
        fluids_in = blood_in = 0.0
        if ev:
            if ev[0] == "oxytocin":
                p.give_oxytocin(minute)
                note = ">>> give OXYTOCIN (effect in 3 min)"
            elif ev[0] == "blood":
                blood_in = ev[1]
                note = f">>> transfuse {ev[1]:.0f} ml"
            elif ev[0] == "fluids":
                fluids_in = ev[1]
                note = f">>> IV fluids {ev[1]:.0f} ml"

        if not note and p._pending_oxytocin_at == minute:
            note = "oxytocin taking effect"

        print(f"{minute:>4} | {p.blood_volume:>9.0f} | {p.tone:>5.2f} | "
              f"{p.bleed_rate:>12.0f} | {p.fraction_lost*100:>5.0f}% | {note}")

        # advance the clock one minute (applies drug onset + volume balance)
        p.tick(minute, dt_min=1.0, fluids_in=fluids_in, blood_in=blood_in)

        if p.arrested:
            print(f"     *** ACUTE ARREST at min {minute+1} — >40% blood volume lost (R-ARR-1) ***")
            return "ARREST"

    controlled = p.bleed_rate < 50
    print(f"{'':>4} | outcome: {'STABILISING — bleeding controlled' if controlled else 'still bleeding'}")
    return "SURVIVE" if controlled else "ONGOING"


SCENARIOS = [
    {
        "name": "A — Low-risk responder, aggressive early resus (SURVIVES)",
        "weight_kg": 70,
        "risk_factors": [],
        "events": {0: ("oxytocin",), 1: ("blood", 1000), 2: ("blood", 1000), 3: ("blood", 1000)},
        "duration_min": 12,
    },
    {
        "name": "B — Low-risk responder, oxytocin LATE (no blood)",
        "weight_kg": 70,
        "risk_factors": [],
        "events": {5: ("oxytocin",)},
        "duration_min": 12,
    },
    {
        "name": "C — Refractory patient (multiple risk factors), oxytocin early",
        "weight_kg": 70,
        "risk_factors": ["overdistension", "previous_pph", "prolonged_labour", "praevia_or_accreta"],
        "events": {2: ("oxytocin",), 3: ("blood", 1500)},
        "duration_min": 12,
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 1 Sandbox")
    print("(three numbers + oxytocin; vitals/arrest-physiology/outcome scoring are Stage 2+)")
    for sc in SCENARIOS:
        run(sc)
    print("\nEvery constant above is tagged to a signed-off rule in simulator/RULES.md.")
