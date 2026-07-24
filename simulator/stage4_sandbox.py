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
    NORMAL_MAP, BASELINE_HR, MAP_BREAKPOINTS, interp,
    DO2_NORMAL_ML_KG_MIN, DO2_CRIT_ML_KG_MIN, VO2_DEMAND_ML_KG_MIN,
    MAX_O2_EXTRACTION_RATIO, DO2_CRIT_EXTRACTION_ML_KG_MIN, DO2_STRAIN_ML_KG_MIN,
    DEBT_SHOULDER_MAX_ML_KG_MIN, LD50_DEBT_ML_KG, DEBT_REPAY_MAX_ML_KG_MIN,
    LACTATE_AT_LD50, LACTATE_NORMAL,
    STARTING_HB_DEFAULT_G_L, PRBC_HB_G_L, HB_FLOOR_G_L, HB_CEILING_G_L, P_PERFUSION_FLOOR_MMHG, perfusion_factor,
    acute_bleed_map_penalty, exsanguination_map_scale,
    PP_BREAKPOINTS, RAP_MMHG, CPP_ISCHEMIA_MMHG, CPP_ARREST_MMHG,
    CORONARY_REVERSIBLE_WINDOW_MIN, CORONARY_INJURY_RATE_PER_MIN,
    CORONARY_INJURY_RECOVERY_PER_MIN,
    ACUTE_BLEED_TOLERANCE_ML_MIN,
    diastolic_time_fraction, DTF_AT_BASE,
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
    CRYO_DOSE_FIBRINOGEN_G, CRYO_MG_PER_KG_PER_G_L, CRYO_ONSET_MIN,
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
    surgical_ineffective_steps, INEFFECTIVE,
)

# R-BLEED-3: trauma repair (suture) — definitive control of a genital-tract tear,
# landing after a short onset (time to expose, identify, suture the vessel).
REPAIR_ONSET_MIN = 4
# R-BLEED-3: manual removal procedure duration (anaesthesia in place → products out).
# Logistics to START the procedure are human factors; effect is instant on completion.
MANUAL_REMOVAL_DURATION_MIN_DEFAULT = 4.0


class PatientV4:
    def __init__(self, weight_kg=70, risk_factors=None, surgical_ineffective=None, bmi=25,
                 start_ebl=500, base_tone=BASE_START_TONE, treatment_response=None,
                 trauma_severity=0.0, tissue_severity=0.0,
                 manual_removal_duration_min=MANUAL_REMOVAL_DURATION_MIN_DEFAULT,
                 starting_Hb=STARTING_HB_DEFAULT_G_L):
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
            self.repair_ineffective = self.treatment_response.get("repair") == INEFFECTIVE
            self.manual_removal_ineffective = (
                self.treatment_response.get("manual_removal") == INEFFECTIVE
            )
        else:
            # Legacy path (deprecated sandboxes)
            self.treatment_response = None
            self.surgical_ineffective = set(surgical_ineffective or [])
            self.drug_refractory = "balloon" in self.surgical_ineffective
            self.fundal_ineffective = False
            self.bimanual_ineffective = False
            self.repair_ineffective = False
            self.manual_removal_ineffective = False
        # R-BLEED-3: trauma is a SEPARATE, tone-independent bleed term from the same
        # arterial supply (BASELINE_FLOW). trauma_severity 0→1 = fraction of that supply
        # leaking from a torn vessel; drug/tone/balloon-independent, cleared by REPAIR.
        self.trauma_severity = max(0.0, min(1.0, trauma_severity))
        # R-BLEED-3: tissue caps contractile tone (ceiling = 1 − severity). Drugs bank
        # in sustained_tone; bleed reads effective_tone = min(sustained, ceiling).
        self.tissue_severity = max(0.0, min(1.0, tissue_severity))
        self.manual_removal_duration_min = max(0.5, float(manual_removal_duration_min))
        self.starting_Hb = float(starting_Hb)
        # R-HB-1: track Hb mass (g); concentration derived from blood_volume
        remaining_ml = max(0.0, self.start_volume - start_ebl)
        self.Hb_mass = self.starting_Hb * remaining_ml / 1000.0
        self._hb_nadir = self.starting_Hb
        self._peak_debt = 0.0
        self._map_nadir = NORMAL_MAP
        self._minutes_in_shock = 0.0
        self._source_control_min = None
        # R-ARR-2 coronary fuse state (Section G)
        self._cardiac_output_failed = False
        self._minutes_in_arrest = 0.0
        self._coronary_injury = 0.0
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
        self._pending_cryo = []      # fibrinogen replacement: (effect_min, g/L gain)
        self._pending_repair = []    # trauma repair: (effect_min,) — clears trauma_severity
        self._pending_manual_removal = []  # (effect_min,) — clears tissue_severity if works

    @property
    def tissue_ceiling(self):
        return 1.0 - self.tissue_severity

    @property
    def effective_sustained_tone(self):
        return min(self.sustained_tone, self.tissue_ceiling)

    @property
    def effective_palpation_tone(self):
        raw = min(1.0, self.sustained_tone + self.fundal_pulse)
        return min(raw, self.tissue_ceiling)

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
        # Palpable tone — capped by tissue ceiling (retained products feel boggy).
        return self.effective_palpation_tone

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
    def trauma_bleed_rate(self):
        # R-BLEED-3: tone-independent arterial leak from a tear; unaffected by
        # uterotonics/massage/balloon. Cleared only by repair (drops trauma_severity).
        return BASELINE_FLOW_ML_MIN * self.trauma_severity

    @property
    def hb_g_l(self):
        if self.blood_volume <= 0:
            return 0.0
        return self.Hb_mass / (self.blood_volume / 1000.0)

    @property
    def perfusion_factor(self):
        return perfusion_factor(self.map)

    @property
    def source_bleed_rate(self):
        atony = BASELINE_FLOW_ML_MIN * (1.0 - self.effective_palpation_tone)
        if self.compression_active and not self.bimanual_ineffective:
            atony *= BIMANUAL_BLEED_FACTOR   # bimanual compresses the uterus, not a tear
        return atony + self.trauma_bleed_rate

    @property
    def bleed_rate(self):
        return self.source_bleed_rate * self.coag_multiplier * self.perfusion_factor

    @property
    def durable_bleed_rate(self):
        # Durable = excludes transient massage/bimanual, but trauma IS durable until
        # repaired (repair lowers trauma_severity itself), so it stays in.
        atony = BASELINE_FLOW_ML_MIN * (1.0 - self.effective_sustained_tone)
        raw = (atony + self.trauma_bleed_rate) * self.coag_multiplier
        return raw * perfusion_factor(self.map)

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
        # Net circulating volume (R-VOL-2) — for display / legacy.
        return (self.start_volume - self.blood_volume) / self.start_volume

    @property
    def circulating_fraction(self):
        """True tank level (R-VOL-2): net of bleeding and infusion."""
        if self.start_volume <= 0:
            return 0.0
        return max(0.0, self.blood_volume / self.start_volume)

    @property
    def heart_rate(self):
        return min(180, BASELINE_HR + 160 * max(0.0, self.effective_fraction_lost))

    @property
    def map(self):
        base = interp(max(0.0, self.effective_fraction_lost), MAP_BREAKPOINTS)
        base = max(0.0, base - self._map_bleed_penalty)
        return base * exsanguination_map_scale(self.circulating_fraction)

    @property
    def pulse_pressure(self):
        return interp(max(0.0, self.effective_fraction_lost), PP_BREAKPOINTS)

    @property
    def dbp(self):
        return max(0.0, self.map - self.pulse_pressure / 3.0)

    @property
    def coronary_perfusion_pressure(self):
        return max(0.0, self.dbp - RAP_MMHG)

    @property
    def coronary_supply(self):
        return self.coronary_perfusion_pressure * diastolic_time_fraction(self.heart_rate)

    @property
    def perfusion_adequacy(self):
        return self.map / NORMAL_MAP

    @property
    def oxygen_delivery(self):
        # R-ARR-1 / Section C item 18: DO₂ = 12 × (MAP/90) × (Hb/110)
        hb_ratio = self.hb_g_l / STARTING_HB_DEFAULT_G_L
        return DO2_NORMAL_ML_KG_MIN * (self.map / NORMAL_MAP) * hb_ratio

    @property
    def vo2_delivered(self):
        return min(VO2_DEMAND_ML_KG_MIN, self.oxygen_delivery * MAX_O2_EXTRACTION_RATIO)

    @property
    def in_shock(self):
        return self.oxygen_delivery < DO2_CRIT_ML_KG_MIN

    @property
    def lactate(self):
        return LACTATE_NORMAL + self.oxygen_debt * (LACTATE_AT_LD50 - LACTATE_NORMAL) / LD50_DEBT_ML_KG

    @property
    def dead_by_debt(self):
        return self.oxygen_debt >= LD50_DEBT_ML_KG

    @property
    def cardiac_arrest_active(self):
        return self._cardiac_output_failed

    @property
    def cardiac_arrest_irreversible(self):
        return self._minutes_in_arrest >= CORONARY_REVERSIBLE_WINDOW_MIN

    @property
    def arrested(self):
        """Legacy alias — coronary fuse functional arrest, not MAP≤35."""
        return self._cardiac_output_failed

    @property
    def is_dead(self):
        return self.dead_by_debt or self.cardiac_arrest_irreversible

    @property
    def death_cause(self):
        if self.cardiac_arrest_irreversible:
            return "cardiac_arrest"
        if self.dead_by_debt:
            return "irreversible_shock"
        return None

    def _update_hb(self, bled_ml, fluids_in, blood_in, ffp_in):
        vol_before = max(self.blood_volume, 1.0)
        conc = self.Hb_mass / (vol_before / 1000.0)
        if bled_ml > 0:
            self.Hb_mass = max(0.0, self.Hb_mass - conc * bled_ml / 1000.0)
        if blood_in > 0:
            self.Hb_mass += PRBC_HB_G_L * blood_in / 1000.0
        # crystalloid / FFP: volume only — Hb_mass unchanged → dilution

    def _clamp_hb_mass(self):
        # Defensive bounds — extreme constant-rate infusion tests can dilute or
        # concentrate Hb beyond physiology; normal operator-driven runs stay in range.
        if self.blood_volume <= 0:
            return
        vol_l = self.blood_volume / 1000.0
        lo = HB_FLOOR_G_L * vol_l
        hi = HB_CEILING_G_L * vol_l
        self.Hb_mass = max(lo, min(hi, self.Hb_mass))

    def _update_hb_after_volume(self):
        self._clamp_hb_mass()
        if self.blood_volume > 0:
            self._hb_nadir = min(self._hb_nadir, self.hb_g_l)

    def _update_oxygen_debt(self, dt_min):
        if dt_min <= 0:
            return
        do2 = self.oxygen_delivery
        vo2_del = self.vo2_delivered
        # Hard floor: extraction capped at MAX_O2_EXTRACTION_RATIO cannot meet demand
        hard_deficit = max(0.0, VO2_DEMAND_ML_KG_MIN - do2 * MAX_O2_EXTRACTION_RATIO)
        # Soft shoulder: microcirculatory strain as DO₂:VO₂ ratio falls toward ~2:1
        # (progressive supply-dependency, not a sharp knee)
        shoulder_span = DO2_STRAIN_ML_KG_MIN - DO2_CRIT_EXTRACTION_ML_KG_MIN
        shoulder_frac = max(0.0, min(1.0, (DO2_STRAIN_ML_KG_MIN - do2) / shoulder_span))
        shoulder = DEBT_SHOULDER_MAX_ML_KG_MIN * shoulder_frac
        debt_accrual = hard_deficit + shoulder
        if debt_accrual > 0:
            self.oxygen_debt += debt_accrual * dt_min
        elif self.oxygen_debt > 0:
            surplus = vo2_del - VO2_DEMAND_ML_KG_MIN
            depth_factor = 1.0 - 0.35 * min(1.0, self.oxygen_debt / LD50_DEBT_ML_KG)
            drain = min(DEBT_REPAY_MAX_ML_KG_MIN, surplus * 0.55) * depth_factor
            self.oxygen_debt = max(0.0, self.oxygen_debt - drain * dt_min)
        self._peak_debt = max(self._peak_debt, self.oxygen_debt)

    def _update_coronary_fuse(self, dt_min):
        if dt_min <= 0:
            return
        cpp = self.coronary_perfusion_pressure
        if cpp < CPP_ARREST_MMHG:
            self._cardiac_output_failed = True
            self._minutes_in_arrest += dt_min
        elif cpp >= CPP_ISCHEMIA_MMHG:
            self._cardiac_output_failed = False
            self._minutes_in_arrest = 0.0
            if self._coronary_injury > 0:
                self._coronary_injury = max(
                    0.0, self._coronary_injury - CORONARY_INJURY_RECOVERY_PER_MIN * dt_min,
                )
        # Injury accrues only under acute haemorrhage — compensation overwhelmed
        acute = self._map_bleed_penalty > 0.0
        if acute and cpp < CPP_ISCHEMIA_MMHG:
            stress = (CPP_ISCHEMIA_MMHG - cpp) / CPP_ISCHEMIA_MMHG
            hr_factor = DTF_AT_BASE / max(0.35, diastolic_time_fraction(self.heart_rate))
            source_stress = self.source_bleed_rate * self.coag_multiplier
            bleed_boost = 1.0 + max(0.0, source_stress - ACUTE_BLEED_TOLERANCE_ML_MIN) / 300.0
            self._coronary_injury = min(
                1.0,
                self._coronary_injury + CORONARY_INJURY_RATE_PER_MIN * stress * hr_factor
                * bleed_boost * dt_min,
            )

    def _track_margin(self, now_min, dt_min):
        self._map_nadir = min(self._map_nadir, self.map)
        if self.in_shock:
            self._minutes_in_shock += dt_min
        if (self._source_control_min is None
                and self.durable_bleed_rate < CONTROLLED_BLEED):
            self._source_control_min = now_min

    def margin_snapshot(self):
        return {
            "peak_oxygen_debt": round(self._peak_debt, 1),
            "peak_ebl": round(self.cumulative_bled),
            "map_nadir": round(self._map_nadir),
            "hb_nadir": round(self._hb_nadir, 1),
            "minutes_in_shock": round(self._minutes_in_shock, 1),
            "source_control_min": self._source_control_min,
            "total_prbc_ml": round(self.cumulative_blood_in),
            "total_crystalloid_ml": round(self.cumulative_fluids_in),
            "total_ffp_ml": round(self.cumulative_ffp_in),
        }

    def give_uterotonic(self, drug_id, now_min):
        self._pending.append((now_min + ONSET_MIN[drug_id], drug_id))

    def give_surgical(self, step, now_min):
        self._pending_surg.append((now_min + SURG_ONSET_MIN[step], SURG_TARGET[step], step))

    def give_repair(self, now_min):
        """Suture / repair a genital-tract tear — definitive trauma control after onset.
        If the tear is beyond simple repair (repair_ineffective), it does not resolve →
        the app's follow-up escalates to theatre (ligation/hysterectomy)."""
        self._pending_repair.append(now_min + REPAIR_ONSET_MIN)

    def give_manual_removal(self, now_min):
        """Manual removal / ERPC — procedure runs for manual_removal_duration_min;
        on completion tissue_severity → 0 instantly if removal works."""
        self._pending_manual_removal.append(
            now_min + self.manual_removal_duration_min
        )

    def give_fundal_massage(self):
        if not self.fundal_ineffective:
            self.fundal_pulse = FUNDAL_TONE_PULSE

    def start_bimanual_compression(self, now_min):
        if not self.bimanual_ineffective:
            self.compression_until = max(self.compression_until, now_min + BIMANUAL_DURATION_MIN)

    def give_cryoprecipitate(self, now_min):
        """Fibrinogen replacement — cryo (2 pools ≈ 4 g) or fibrinogen concentrate
        (~60 mg/kg). Weight-scaled rise lands after onset (R-COAG). This is the real
        fibrinogen fix; FFP barely moves it."""
        gain = (CRYO_DOSE_FIBRINOGEN_G * 1000.0) / (CRYO_MG_PER_KG_PER_G_L * self.weight_kg)
        self._pending_cryo.append((now_min + CRYO_ONSET_MIN, gain))

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
                if step not in self.surgical_ineffective:
                    if target > self.sustained_tone:
                        self.sustained_tone = target      # full mechanical effect
                    # Definitive — uterine source (and retained tissue with it) is gone.
                    if step == "hysterectomy":
                        self.tissue_severity = 0.0
                        self.trauma_severity = 0.0
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
        # fibrinogen replacement — cryo / fibrinogen concentrate lands after onset (R-COAG).
        keep_c = []
        for effect_min, gain in self._pending_cryo:
            if now_min >= effect_min:
                self.fibrinogen_g_l = min(FIBRINOGEN_MAX_G_L, self.fibrinogen_g_l + gain)
            else:
                keep_c.append((effect_min, gain))
        self._pending_cryo = keep_c
        # trauma repair — clears the tear (trauma_severity → 0) once the suture lands,
        # unless the tear is beyond simple repair (then it persists → theatre escalation).
        keep_r = []
        for effect_min in self._pending_repair:
            if now_min >= effect_min:
                if not self.repair_ineffective:
                    self.trauma_severity = 0.0
            else:
                keep_r.append(effect_min)
        self._pending_repair = keep_r
        # manual removal — lifts tissue ceiling instantly on completion if it works.
        keep_m = []
        for effect_min in self._pending_manual_removal:
            if now_min >= effect_min:
                if not self.manual_removal_ineffective:
                    self.tissue_severity = 0.0
            else:
                keep_m.append(effect_min)
        self._pending_manual_removal = keep_m
        source_bleed = self.source_bleed_rate
        effective_bleed = self.bleed_rate
        bled = effective_bleed * dt_min
        self.cumulative_bled += bled
        self.cumulative_fluids_in += fluids_in
        self.cumulative_blood_in += blood_in
        self.cumulative_ffp_in += ffp_in
        self._update_hb(bled, fluids_in, blood_in, ffp_in)
        self._update_coagulation(source_bleed, bled, blood_in, ffp_in, dt_min)
        self.blood_volume += fluids_in + blood_in + ffp_in - bled
        if self.blood_volume < 0:
            self.blood_volume = 0.0
        self._update_hb_after_volume()
        # R-CIRC-3b: acute compensation failure from pre-perfusion source demand
        source_stress = source_bleed * self.coag_multiplier
        self._map_bleed_penalty = acute_bleed_map_penalty(source_stress)
        self.fundal_pulse = max(0.0, self.fundal_pulse - FUNDAL_DECAY_PER_MIN * dt_min)
        self._update_oxygen_debt(dt_min)
        self._update_coronary_fuse(dt_min)
        self._track_margin(now_min, dt_min)


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

        if p.is_dead:
            cause = p.death_cause
            verdict, verdict_min = (
                ("ARREST", minute + 1) if cause == "cardiac_arrest"
                else ("IRREVERSIBLE_SHOCK", minute + 1)
            )
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
