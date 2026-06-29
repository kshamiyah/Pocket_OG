#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Stage 4 Sandbox (surgical / mechanical control)
==========================================================================

Adds the surgical ladder on top of Stage 3. Mechanical control (balloon, sutures,
hysterectomy) physically compresses the bleeding source, so it raises tone
REGARDLESS of responsiveness R (unlike uterotonics). It is the escalation both
the refractory and partial-responder patients were left needing.

Surgical ladder (R-SURG-1), escalated when the uterotonic ladder is exhausted
and bleeding continues:
    Bakri balloon   -> tone ~0.95   (first-line mechanical, may avoid theatre)
    B-Lynch + ligation -> tone ~0.97   (laparotomy)
    hysterectomy    -> tone ~0.999  (definitive)
Some causes (placenta accreta) blunt balloon/sutures -> hysterectomy is definitive.

Run:  python3 simulator/stage4_sandbox.py
"""

from stage1_sandbox import BASELINE_FLOW_ML_MIN, MATERNAL_ML_PER_KG, responsiveness_from_risk_factors
from stage2_sandbox import (
    NORMAL_MAP, BASELINE_HR, MAP_ARREST, MAP_BREAKPOINTS, interp,
    DO2_NORMAL_ML_KG_MIN, VO2_DEMAND_ML_KG_MIN, DEBT_ADEQUACY_FLOOR,
    LD50_DEBT_ML_KG, LACTATE_AT_LD50, LACTATE_NORMAL,
)
from stage3_sandbox import (
    UTEROTONIC_PHARM_DELAY_SEC, scale_delay_by_bleed_rate,
    ONSET_MIN, TARGET_TONE, LADDER, MASSAGE_BONUS, MASSAGE_DECAY_PER_MIN,
    CONTROLLED_BLEED, PPH_MAJOR_ML, PPH_MASSIVE_ML, BLOOD_PREP_MIN,
    MAJOR_INFUSION_ML_MIN, MASSIVE_INFUSION_ML_MIN,
)

# Surgical ladder (R-SURG-1). Tone targets [ASSUMED]; order/independence ACCEPTED.
SURGICAL_LADDER = ["balloon", "sutures", "hysterectomy"]
SURG_ONSET_MIN = {"balloon": 2, "sutures": 6, "hysterectomy": 10}
SURG_TARGET = {"balloon": 0.95, "sutures": 0.97, "hysterectomy": 0.999}
SURG_ESCALATION_WAIT = 4   # min to assess response / mobilise theatre [ASSUMED]


class PatientV4:
    def __init__(self, weight_kg=70, risk_factors=None, surgical_ineffective=None):
        self.weight_kg = weight_kg
        self.blood_volume = weight_kg * MATERNAL_ML_PER_KG
        self.start_volume = self.blood_volume
        self.responsiveness = responsiveness_from_risk_factors(risk_factors or [])
        self.surgical_ineffective = set(surgical_ineffective or [])   # e.g. accreta
        self.sustained_tone = 0.0
        self.massage_bonus = 0.0
        self.oxygen_debt = 0.0
        self.cumulative_bled = 0.0
        self._pending = []           # uterotonics: (effect_min, target)  — scaled by R
        self._pending_surg = []      # surgical: (effect_min, target, step) — mechanical

    @property
    def level(self):
        if self.cumulative_bled >= PPH_MASSIVE_ML: return "massive"
        if self.cumulative_bled >= PPH_MAJOR_ML: return "major"
        return "minor"

    @property
    def tone(self): return min(1.0, self.sustained_tone + self.massage_bonus)
    @property
    def bleed_rate(self): return BASELINE_FLOW_ML_MIN * (1.0 - self.tone)
    @property
    def fraction_lost(self): return (self.start_volume - self.blood_volume) / self.start_volume
    @property
    def heart_rate(self): return min(180, BASELINE_HR + 160 * max(0.0, self.fraction_lost))
    @property
    def map(self): return interp(max(0.0, self.fraction_lost), MAP_BREAKPOINTS)
    @property
    def perfusion_adequacy(self): return self.map / NORMAL_MAP
    @property
    def lactate(self): return LACTATE_NORMAL + self.oxygen_debt * (LACTATE_AT_LD50 - LACTATE_NORMAL) / LD50_DEBT_ML_KG
    @property
    def arrested(self): return self.map <= MAP_ARREST

    def give_uterotonic(self, drug_id, now_min):
        self._pending.append((now_min + ONSET_MIN[drug_id], TARGET_TONE[drug_id]))

    def give_surgical(self, step, now_min):
        self._pending_surg.append((now_min + SURG_ONSET_MIN[step], SURG_TARGET[step], step))

    def give_massage(self): self.massage_bonus = MASSAGE_BONUS

    def tick(self, now_min, dt_min=1.0, blood_in=0.0):
        # surgical control first — MECHANICAL, independent of R (R-SURG-1)
        keep_s = []
        for effect_min, target, step in self._pending_surg:
            if now_min >= effect_min:
                if step not in self.surgical_ineffective and target > self.sustained_tone:
                    self.sustained_tone = target      # full mechanical effect
            else:
                keep_s.append((effect_min, target, step))
        self._pending_surg = keep_s
        # uterotonics — scaled by responsiveness (R-TONE-GAIN)
        keep = []
        for effect_min, target in self._pending:
            if now_min >= effect_min:
                if target > self.sustained_tone:
                    self.sustained_tone += (target - self.sustained_tone) * self.responsiveness
            else:
                keep.append((effect_min, target))
        self._pending = keep
        self.massage_bonus = max(0.0, self.massage_bonus - MASSAGE_DECAY_PER_MIN * dt_min)
        bled = self.bleed_rate * dt_min
        self.cumulative_bled += bled
        self.blood_volume += blood_in - bled
        if self.blood_volume < 0: self.blood_volume = 0.0
        if self.perfusion_adequacy < DEBT_ADEQUACY_FLOOR:
            shortfall = (DEBT_ADEQUACY_FLOOR - self.perfusion_adequacy) / DEBT_ADEQUACY_FLOOR
            self.oxygen_debt += VO2_DEMAND_ML_KG_MIN * shortfall * dt_min


def run(scenario):
    p = PatientV4(scenario.get("weight_kg", 70), scenario.get("risk_factors", []),
                  scenario.get("surgical_ineffective"))
    duration = scenario.get("duration_min", 40)

    next_rung = 0
    last_drug_id, last_drug_min = None, None
    surg_rung, last_surg_min = 0, None
    total_blood = 0.0
    transfusion_started_min = None

    print(f"\n=== {scenario['name']} ===")
    extra = f" | accreta (balloon/sutures ineffective)" if p.surgical_ineffective else ""
    print(f"weight {p.weight_kg} kg | risk {scenario.get('risk_factors', []) or 'none'} -> R = {p.responsiveness:.2f}{extra}")
    print(f"{'min':>3} | {'EBL':>5} | {'tone':>4} | {'bleed':>5} | {'MAP':>3} | action")
    print("-" * 76)

    for minute in range(duration + 1):
        action = ""
        blood_in = 0.0
        if minute == 0:
            p.give_massage(); action += "massage + "

        # uterotonic ladder (CLOCK 1: app's bleed-rate-scaled escalation)
        if p.bleed_rate >= CONTROLLED_BLEED and next_rung < len(LADDER):
            due = last_drug_id is None or (minute - last_drug_min) >= \
                scale_delay_by_bleed_rate(UTEROTONIC_PHARM_DELAY_SEC[last_drug_id], p.bleed_rate) / 60.0
            if due:
                drug = LADDER[next_rung]; p.give_uterotonic(drug, minute)
                last_drug_id, last_drug_min = drug, minute; next_rung += 1
                action += f"give {drug} "

        # surgical ladder — once drugs exhausted and still bleeding (R-SURG-1)
        elif next_rung >= len(LADDER) and p.bleed_rate >= CONTROLLED_BLEED and surg_rung < len(SURGICAL_LADDER):
            if last_surg_min is None or (minute - last_surg_min) >= SURG_ESCALATION_WAIT:
                step = SURGICAL_LADDER[surg_rung]; p.give_surgical(step, minute)
                last_surg_min = minute; surg_rung += 1
                action += f">> SURGERY: {step} "

        # transfusion (R-TX-2/3): only at major+, rate-limited by cannulae
        if p.level in ("major", "massive"):
            if transfusion_started_min is None:
                transfusion_started_min = minute; action += f"START transfusion ({p.level}) "
            if minute >= transfusion_started_min + BLOOD_PREP_MIN:
                rate = MASSIVE_INFUSION_ML_MIN if p.level == "massive" else MAJOR_INFUSION_ML_MIN
                blood_in = min(rate, p.bleed_rate); total_blood += blood_in

        print(f"{minute:>3} | {p.cumulative_bled:>5.0f} | {p.tone:>4.2f} | {p.bleed_rate:>5.0f} | {p.map:>3.0f} | {action.strip()}")
        p.tick(minute, dt_min=1.0, blood_in=blood_in)

        if p.arrested:
            print(f"    *** ARREST at min {minute+1} (MAP {p.map:.0f}) — total blood {total_blood:.0f} ml ***")
            return "ARREST"
        if p.bleed_rate < 50 and p.map > 60:
            print(f"    >>> CONTROLLED at min {minute+1} — tone {p.tone:.2f}, bleed {p.bleed_rate:.0f} ml/min, "
                  f"total blood {total_blood:.0f} ml ({total_blood/p.start_volume:.1f} blood vol)")
            return "SURVIVE"

    print(f"    outcome: ongoing — tone {p.tone:.2f}, total blood {total_blood:.0f} ml")
    return "ONGOING"


SCENARIOS = [
    {
        "name": "Refractory uterus — drugs fail, BALLOON rescues",
        "risk_factors": ["overdistension", "previous_pph", "prolonged_labour", "praevia_or_accreta"],  # R 0.30
        "duration_min": 40,
    },
    {
        "name": "Placenta accreta — balloon & sutures fail, needs HYSTERECTOMY",
        "risk_factors": ["overdistension", "previous_pph", "praevia_or_accreta"],   # R 0.45
        "surgical_ineffective": ["balloon", "sutures"],
        "duration_min": 45,
    },
]


if __name__ == "__main__":
    print("Virtual Obstetric Patient — Stage 4 (surgical / mechanical control)")
    print("Mechanical control raises tone regardless of responsiveness — the escalation drugs can't provide.")
    for sc in SCENARIOS:
        run(sc)
    print("\nSurgical tone targets [ASSUMED]; ladder order ACCEPTED (RULES R-SURG-1).")
