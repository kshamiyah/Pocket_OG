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

from stage1_sandbox import (
    BASELINE_FLOW_ML_MIN, maternal_ml_per_kg, start_tone_from_risk_factors, BASE_START_TONE,
)
from stage2_sandbox import (
    NORMAL_MAP, BASELINE_HR, MAP_ARREST, MAP_BREAKPOINTS, interp,
    DO2_NORMAL_ML_KG_MIN, VO2_DEMAND_ML_KG_MIN, DEBT_ADEQUACY_FLOOR,
    LD50_DEBT_ML_KG, LACTATE_AT_LD50, LACTATE_NORMAL,
)
from stage3_sandbox import (
    UTEROTONIC_PHARM_DELAY_SEC, scale_delay_by_bleed_rate,
    ONSET_MIN, TARGET_TONE, LADDER,
    FUNDAL_TONE_PULSE, FUNDAL_DECAY_PER_MIN, FUNDAL_FIRM_THRESHOLD,
    BIMANUAL_DURATION_MIN, BIMANUAL_BLEED_FACTOR,
    CONTROLLED_BLEED, PPH_MAJOR_ML, PPH_MASSIVE_ML, BLOOD_PREP_MIN,
    MAJOR_PRBC_ML_MIN, MASSIVE_PRBC_ML_MIN, MASSIVE_FFP_ML_MIN,
    CRYST_EFF, PRBC_EFF, FFP_EFF, PRBC_EFF_LOW_FIBRIN,
    DEFICIT_FRACTION_CAP, BLEED_STRESS_THRESHOLD_ML_MIN, BLEED_STRESS_K, BLEED_STRESS_CAP_MMHG,
    TXA_ONSET_MIN, TXA_FIBRINOLYSIS_FACTOR_1, TXA_FIBRINOLYSIS_FACTOR_2,
    FIBRINOGEN_START_G_L, FIBRINOGEN_TREAT_THRESHOLD_G_L, FIBRINOGEN_MIN_G_L, FIBRINOGEN_MAX_G_L,
    FIBRINOGEN_CONSUMPTION_PER_L_EBL, FIBRINOGEN_DILUTION_PER_L_PRBC, FIBRINOGEN_GAIN_PER_L_FFP,
    FIBRINOLYSIS_G_L_MIN_AT_MAX_BLEED, COAG_MULTIPLIER_BREAKPOINTS,
    CARBO_MAX_DOSES, CARBO_REPEAT_BASE_SEC, CARBO_REPEAT_FLOOR_SEC,
    URGENCY_EBL_ML, URGENCY_BLEED_ML_MIN, DRUG_INCREMENT, DRUG_TONE_CEILING,
)

# Surgery is a haemodynamic decision: still bleeding AND becoming unstable.
SURGERY_MAP_THRESHOLD = 60   # mmHg — MAP falling to here while bleeding -> theatre

# Surgical ladder (R-SURG-1). Tone targets [ASSUMED]; order/independence ACCEPTED.
SURGICAL_LADDER = ["balloon", "sutures", "hysterectomy"]
SURG_ONSET_MIN = {"balloon": 2, "sutures": 6, "hysterectomy": 10}
SURG_TARGET = {"balloon": 0.95, "sutures": 0.97, "hysterectomy": 0.999}
# Escalation between surgical steps waits for the PREVIOUS step's onset (time to
# see if it worked), then escalates if still bleeding. Theatre-mobilisation time is
# a human factor -> deferred, so the ideal model has no extra logistics delay.


from patient_profile import (  # noqa: E402
    uterotonics_refractory, fundal_refractory, bimanual_refractory,
    surgical_ineffective_steps,
)


class PatientV4:
    def __init__(self, weight_kg=70, risk_factors=None, surgical_ineffective=None, bmi=25,
                 start_ebl=500, base_tone=BASE_START_TONE, treatment_response=None):
        # start_ebl = blood already lost when PPH is recognised / SOS is opened.
        # SOS is not triggered below ~500 ml (minor PPH), so default to 500.
        self.weight_kg = weight_kg
        self.bmi = bmi
        self.start_volume = weight_kg * maternal_ml_per_kg(bmi)   # full volume before loss
        self.blood_volume = self.start_volume - start_ebl          # already down by start_ebl
        if treatment_response:
            self.treatment_response = dict(treatment_response)
            self.surgical_ineffective = set(surgical_ineffective_steps(self.treatment_response))
            self.drug_refractory = uterotonics_refractory(self.treatment_response)
            self.fundal_ineffective = fundal_refractory(self.treatment_response)
            self.bimanual_ineffective = bimanual_refractory(self.treatment_response)
        else:
            # Legacy path (deprecated sandboxes)
            self.treatment_response = None
            self.surgical_ineffective = set(surgical_ineffective or [])
            self.drug_refractory = "balloon" in self.surgical_ineffective
            self.fundal_ineffective = False
            self.bimanual_ineffective = False
        # R-SEVERITY: risk factors set how ATONIC she starts (severity / bleed rate),
        # not treatability. Lower starting tone = faster bleed.
        self.start_tone = start_tone_from_risk_factors(risk_factors or [], base_tone)
        self.sustained_tone = self.start_tone
        self.fundal_pulse = 0.0
        self.compression_until = 0.0   # sim minutes — bimanual mechanical hold
        self._now_min = 0.0
        self.oxygen_debt = 0.0
        self.cumulative_bled = float(start_ebl)   # EBL starts at the recognition point
        self.cumulative_fluids_in = 0.0   # crystalloid given (R-VOL-2 / R-TX-3b)
        self.cumulative_blood_in = 0.0    # PRBC given
        self.cumulative_ffp_in = 0.0    # FFP given (R-COAG-4)
        self.fibrinogen_g_l = FIBRINOGEN_START_G_L
        self._map_bleed_penalty = 0.0     # acute drain stress (R-CIRC-3b)
        self._txa_doses = 0
        self._txa_effect_from = float("inf")   # sim minutes — antifibrinolytic effect active
        self._pending = []           # uterotonics: (effect_min, target)  — scaled by R
        self._pending_surg = []      # surgical: (effect_min, target, step) — mechanical

    @property
    def level(self):
        if self.cumulative_bled >= PPH_MASSIVE_ML: return "massive"
        if self.cumulative_bled >= PPH_MAJOR_ML: return "major"
        return "minor"

    @property
    def palpation_tone(self):
        return min(1.0, self.sustained_tone + self.fundal_pulse)

    @property
    def tone(self):
        return self.palpation_tone

    @property
    def compression_active(self):
        return self._now_min < self.compression_until

    @property
    def txa_active(self):
        return self._txa_doses > 0 and self._now_min >= self._txa_effect_from

    @property
    def txa_fibrinolysis_factor(self):
        if not self.txa_active:
            return 1.0
        return TXA_FIBRINOLYSIS_FACTOR_2 if self._txa_doses >= 2 else TXA_FIBRINOLYSIS_FACTOR_1

    @property
    def coag_multiplier(self):
        return interp(self.fibrinogen_g_l, COAG_MULTIPLIER_BREAKPOINTS)

    @property
    def fibrinogen_low(self):
        return self.fibrinogen_g_l < FIBRINOGEN_TREAT_THRESHOLD_G_L

    @property
    def source_bleed_rate(self):
        base = BASELINE_FLOW_ML_MIN * (1.0 - self.palpation_tone)
        if self.compression_active and not self.bimanual_ineffective:
            base *= BIMANUAL_BLEED_FACTOR
        return base

    @property
    def bleed_rate(self):
        return self.source_bleed_rate * self.coag_multiplier

    @property
    def durable_bleed_rate(self):
        return BASELINE_FLOW_ML_MIN * (1.0 - self.sustained_tone) * self.coag_multiplier

    @property
    def effective_replacement_ml(self):
        prbc_eff = PRBC_EFF_LOW_FIBRIN if self.fibrinogen_low else PRBC_EFF
        return (self.cumulative_fluids_in * CRYST_EFF
                + self.cumulative_blood_in * prbc_eff
                + self.cumulative_ffp_in * FFP_EFF)

    @property
    def haemorrhagic_deficit_ml(self):
        return max(0.0, self.cumulative_bled - self.effective_replacement_ml)

    @property
    def effective_fraction_lost(self):
        # R-CIRC-3: MAP/HR from haemorrhagic deficit, not transient tank fill.
        if self.start_volume <= 0:
            return 0.0
        return min(DEFICIT_FRACTION_CAP, self.haemorrhagic_deficit_ml / self.start_volume)

    @property
    def fraction_lost(self):
        # Net circulating volume (R-VOL-2) — for display / legacy; not used for MAP.
        return (self.start_volume - self.blood_volume) / self.start_volume

    @property
    def heart_rate(self):
        return min(180, BASELINE_HR + 160 * max(0.0, self.effective_fraction_lost))

    @property
    def map(self):
        base = interp(max(0.0, self.effective_fraction_lost), MAP_BREAKPOINTS)
        return max(0.0, base - self._map_bleed_penalty)
    @property
    def perfusion_adequacy(self): return self.map / NORMAL_MAP
    @property
    def lactate(self): return LACTATE_NORMAL + self.oxygen_debt * (LACTATE_AT_LD50 - LACTATE_NORMAL) / LD50_DEBT_ML_KG
    @property
    def arrested(self): return self.map <= MAP_ARREST

    def give_uterotonic(self, drug_id, now_min):
        self._pending.append((now_min + ONSET_MIN[drug_id], drug_id))

    def give_surgical(self, step, now_min):
        self._pending_surg.append((now_min + SURG_ONSET_MIN[step], SURG_TARGET[step], step))

    def give_fundal_massage(self):
        if not self.fundal_ineffective:
            self.fundal_pulse = FUNDAL_TONE_PULSE

    def start_bimanual_compression(self, now_min):
        if not self.bimanual_ineffective:
            self.compression_until = max(self.compression_until, now_min + BIMANUAL_DURATION_MIN)

    def give_txa(self, now_min):
        """Antifibrinolytic — slows fibrinolysis after onset (R-COAG-6 / WOMAN)."""
        was_active = self.txa_active
        self._txa_doses = min(2, self._txa_doses + 1)
        if not was_active:
            self._txa_effect_from = now_min + TXA_ONSET_MIN

    def _update_coagulation(self, source_bleed, bled_ml, blood_in, ffp_in, dt_min):
        if dt_min <= 0:
            return
        lysis = ((source_bleed / BASELINE_FLOW_ML_MIN)
                 * FIBRINOLYSIS_G_L_MIN_AT_MAX_BLEED * dt_min * self.txa_fibrinolysis_factor)
        self.fibrinogen_g_l -= (bled_ml / 1000.0) * FIBRINOGEN_CONSUMPTION_PER_L_EBL
        self.fibrinogen_g_l -= (blood_in / 1000.0) * FIBRINOGEN_DILUTION_PER_L_PRBC
        self.fibrinogen_g_l -= lysis
        self.fibrinogen_g_l += (ffp_in / 1000.0) * FIBRINOGEN_GAIN_PER_L_FFP
        self.fibrinogen_g_l = max(FIBRINOGEN_MIN_G_L,
                                  min(FIBRINOGEN_MAX_G_L, self.fibrinogen_g_l))

    def give_massage(self):
        """Legacy alias — fundal pulse only."""
        self.give_fundal_massage()

    def tick(self, now_min, dt_min=1.0, fluids_in=0.0, blood_in=0.0, ffp_in=0.0):
        self._now_min = now_min
        # surgical control first — MECHANICAL, independent of R (R-SURG-1)
        keep_s = []
        for effect_min, target, step in self._pending_surg:
            if now_min >= effect_min:
                if step not in self.surgical_ineffective and target > self.sustained_tone:
                    self.sustained_tone = target      # full mechanical effect
            else:
                keep_s.append((effect_min, target, step))
        self._pending_surg = keep_s
        # uterotonics — each adds an equal increment of tone (R-SEVERITY; no R).
        keep = []
        for effect_min, drug_id in self._pending:
            if now_min >= effect_min:
                if not self.drug_refractory:
                    self.sustained_tone = min(DRUG_TONE_CEILING,
                                              self.sustained_tone + DRUG_INCREMENT[drug_id])
            else:
                keep.append((effect_min, drug_id))
        self._pending = keep
        source_bleed = self.source_bleed_rate
        effective_bleed = source_bleed * self.coag_multiplier
        bled = effective_bleed * dt_min
        self.cumulative_bled += bled
        self.cumulative_fluids_in += fluids_in
        self.cumulative_blood_in += blood_in
        self.cumulative_ffp_in += ffp_in
        self._update_coagulation(source_bleed, bled, blood_in, ffp_in, dt_min)
        self.blood_volume += fluids_in + blood_in + ffp_in - bled
        if self.blood_volume < 0:
            self.blood_volume = 0.0
        if dt_min > 0:
            infusion_ml_min = (fluids_in + blood_in + ffp_in) / dt_min
        else:
            infusion_ml_min = 0.0
        net_balance_ml_min = infusion_ml_min - effective_bleed
        if net_balance_ml_min < -BLEED_STRESS_THRESHOLD_ML_MIN:
            excess = -net_balance_ml_min - BLEED_STRESS_THRESHOLD_ML_MIN
            self._map_bleed_penalty = min(BLEED_STRESS_CAP_MMHG, excess * BLEED_STRESS_K)
        else:
            self._map_bleed_penalty = 0.0
        self.fundal_pulse = max(0.0, self.fundal_pulse - FUNDAL_DECAY_PER_MIN * dt_min)
        if self.perfusion_adequacy < DEBT_ADEQUACY_FLOOR:
            shortfall = (DEBT_ADEQUACY_FLOOR - self.perfusion_adequacy) / DEBT_ADEQUACY_FLOOR
            self.oxygen_debt += VO2_DEMAND_ML_KG_MIN * shortfall * dt_min


def simulate(scenario):
    """DEPRECATED — legacy "ideal operator" (an autonomous hand-coded clinician).

    This is NOT the product. The product is the patient driven by the REAL SOS-PPH
    algorithm: simulator/bridge/app_operator.py + app_live.py. This function is kept
    only as a quick CLI smoke-test of the PatientV4 physiology; its drug/surgery
    DECISIONS do not represent the app and should not be used for clinical testing.
    """
    p = PatientV4(scenario.get("weight_kg", 70), scenario.get("risk_factors", []),
                  scenario.get("surgical_ineffective"), bmi=scenario.get("bmi", 25),
                  start_ebl=scenario.get("start_ebl", 500),
                  treatment_response=scenario.get("treatment_response"))
    duration = scenario.get("duration_min", 40)

    next_rung = 0
    last_drug_id, last_drug_min = None, None
    carbo_doses = 0
    surg_rung, last_surg_min, last_surg_step = 0, None, None
    total_blood = 0.0
    transfusion_started_min = None
    asthma = bool(scenario.get("asthma"))

    rows = []
    verdict, verdict_min = "ONGOING", None

    for minute in range(duration + 1):
        action = ""
        blood_in = 0.0
        # No reflexive massage: it's a transient adjunct that doesn't give durable
        # control, and applying it at t0 hid the patient's true presenting tone.

        bleeding = p.durable_bleed_rate >= CONTROLLED_BLEED
        # Surgery decision: still bleeding AND (becoming unstable OR has already bled
        # a massive amount without control). The amount-bled limb catches the case
        # where transfusion is propping up the pressure but the source won't stop.
        unstable = p.map <= SURGERY_MAP_THRESHOLD or p.cumulative_bled >= PPH_MASSIVE_ML

        # SURGERY — can fire at any point, even mid-ladder. Accreta etc. handled by
        # the mechanical-ineffective flag in tick().
        if bleeding and unstable and surg_rung < len(SURGICAL_LADDER):
            if last_surg_min is None or (minute - last_surg_min) > SURG_ONSET_MIN[last_surg_step]:
                step = SURGICAL_LADDER[surg_rung]; p.give_surgical(step, minute)
                last_surg_min, last_surg_step = minute, step
                surg_rung += 1
                action += f">> SURGERY: {step} (MAP {p.map:.0f}) "

        # UTEROTONICS — climb the ladder / repeat carboprost while still bleeding
        # but haemodynamically holding. Each drug adds an equal tone increment.
        elif bleeding and next_rung < len(LADDER):
            current = LADDER[next_rung]
            if current == "carboprost" and asthma:
                next_rung += 1
                action += "carboprost CONTRAINDICATED (asthma) — skip "
            elif current == "carboprost":
                due = last_drug_id != "carboprost" or (minute - last_drug_min) >= \
                    scale_delay_by_bleed_rate(CARBO_REPEAT_BASE_SEC, p.bleed_rate, CARBO_REPEAT_FLOOR_SEC) / 60.0
                if due and carbo_doses < CARBO_MAX_DOSES:
                    p.give_uterotonic("carboprost", minute)
                    last_drug_id, last_drug_min = "carboprost", minute
                    carbo_doses += 1
                    action += f"carboprost #{carbo_doses} "
                elif carbo_doses >= CARBO_MAX_DOSES:
                    next_rung += 1
                    action += "carboprost max 8 doses -> misoprostol "
            else:
                due = last_drug_id is None or (minute - last_drug_min) >= \
                    scale_delay_by_bleed_rate(UTEROTONIC_PHARM_DELAY_SEC[last_drug_id], p.bleed_rate) / 60.0
                if due:
                    p.give_uterotonic(current, minute)
                    last_drug_id, last_drug_min = current, minute; next_rung += 1
                    action += f"give {current} "

        # transfusion (R-TX-2/3): only at major+, rate-limited by cannulae
        if p.level in ("major", "massive"):
            if transfusion_started_min is None:
                transfusion_started_min = minute; action += f"START transfusion ({p.level}) "
            if minute >= transfusion_started_min + BLOOD_PREP_MIN:
                rate = MASSIVE_PRBC_ML_MIN if p.level == "massive" else MAJOR_PRBC_ML_MIN
                blood_in = rate; total_blood += blood_in

        rows.append({
            "min": minute, "EBL": round(p.cumulative_bled), "tone": round(p.tone, 2),
            "bleed_ml_min": round(p.bleed_rate), "HR": round(p.heart_rate),
            "MAP": round(p.map), "lactate": round(p.lactate, 1),
            "blood_volume": round(p.blood_volume), "total_blood": round(total_blood),
            "action": action.strip(),
        })
        p.tick(minute, dt_min=1.0, blood_in=blood_in)

        if p.arrested:
            verdict, verdict_min = "ARREST", minute + 1
            break
        if p.durable_bleed_rate < 50 and p.map > 60:
            verdict, verdict_min = "CONTROLLED", minute + 1
            break
    else:
        if total_blood >= p.start_volume:
            verdict = "EXSANGUINATING"

    return {
        "start_tone": round(p.start_tone, 2),
        "start_bleed": round(BASELINE_FLOW_ML_MIN * (1 - p.start_tone)),
        "start_volume": round(p.start_volume),
        "ml_per_kg": round(p.start_volume / p.weight_kg, 1),
        "rows": rows, "verdict": verdict, "verdict_min": verdict_min,
        "total_blood": round(total_blood), "peak_ebl": rows[-1]["EBL"] if rows else 0,
        "final_tone": rows[-1]["tone"] if rows else 0,
    }


def run(scenario):
    """CLI printer — uses simulate() so output matches the UI exactly."""
    res = simulate(scenario)
    print(f"\n=== {scenario['name']} ===")
    extra = " | accreta (balloon/sutures ineffective)" if scenario.get("surgical_ineffective") else ""
    print(f"start tone {res['start_tone']} ({res['start_bleed']} ml/min) | "
          f"start vol {res['start_volume']} ml ({res['ml_per_kg']} ml/kg){extra}")
    print(f"{'min':>3} | {'EBL(ml)':>7} | {'tone':>4} | {'bleed/min':>9} | {'MAP':>3} | action")
    print("-" * 80)
    for r in res["rows"]:
        print(f"{r['min']:>3} | {r['EBL']:>7} | {r['tone']:>4.2f} | {r['bleed_ml_min']:>9} | {r['MAP']:>3} | {r['action']}")
    print(f"    >>> {res['verdict']}"
          + (f" at min {res['verdict_min']}" if res['verdict_min'] else "")
          + f" — final tone {res['final_tone']}, total blood {res['total_blood']} ml, peak EBL {res['peak_ebl']} ml")
    return res["verdict"]


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
