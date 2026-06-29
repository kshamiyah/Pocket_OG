#!/usr/bin/env python3
"""
Virtual Obstetric Patient — Streamlit front end
===============================================

Clickable UI that wraps the validated Stage 4 engine (no logic here — it calls
stage4_sandbox.simulate()). Pick a patient, press nothing (it runs live), read
the verdict and charts.

Run:  streamlit run simulator/app.py
"""

import pandas as pd
import streamlit as st

from stage4_sandbox import simulate

# Friendly labels for the GTG52 risk factors (key -> label)
RISK_FACTORS = {
    "praevia_or_accreta": "Placenta praevia / accreta",
    "overdistension": "Multiple pregnancy / polyhydramnios",
    "previous_pph": "Previous PPH",
    "macrosomia": "Macrosomia (>4 kg)",
    "prolonged_labour": "Prolonged labour",
    "chorioamnionitis": "Chorioamnionitis / pyrexia",
    "ga_or_augmentation": "GA / oxytocin augmentation",
    "grand_multiparity": "Grand multiparity",
    "fibroids": "Uterine fibroids",
}

st.set_page_config(page_title="Virtual Obstetric Patient — PPH", layout="wide")
st.title("Virtual Obstetric Patient — PPH simulator")
st.caption("Ideal-operator model. Every value is signed off in RULES.md. "
           "Pick a patient on the left; the simulation runs live.")

# ── Inputs ─────────────────────────────────────────────────────────────────
with st.sidebar:
    st.header("Patient")
    weight = st.slider("Weight (kg)", 40, 150, 70)
    bmi = st.slider("BMI (kg/m²)", 18, 50, 25)
    duration = st.slider("Duration to simulate (min)", 15, 60, 40)

    st.header("Risk factors")
    chosen = [key for key, label in RISK_FACTORS.items() if st.checkbox(label, value=False)]

    st.header("Cause")
    accreta = st.checkbox("Accreta — balloon & sutures ineffective", value=False)

scenario = {
    "name": "UI patient",
    "weight_kg": weight,
    "bmi": bmi,
    "risk_factors": chosen,
    "duration_min": duration,
    "surgical_ineffective": ["balloon", "sutures"] if accreta else None,
}

res = simulate(scenario)
df = pd.DataFrame(res["rows"]).set_index("min")

# ── Patient summary ────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)
c1.metric("Responsiveness R", res["responsiveness"])
c2.metric("Start blood volume", f"{res['start_volume']:,} ml", f"{res['ml_per_kg']} ml/kg")
c3.metric("Peak blood loss (EBL)", f"{res['peak_ebl']:,} ml")
c4.metric("Total blood given", f"{res['total_blood']:,} ml")

# ── Verdict ────────────────────────────────────────────────────────────────
verdict = res["verdict"]
at = f" at minute {res['verdict_min']}" if res["verdict_min"] else ""
if verdict == "CONTROLLED":
    st.success(f"✅ CONTROLLED{at} — bleeding stopped, perfusion restored "
               f"(final tone {res['final_tone']}).")
elif verdict == "ARREST":
    st.error(f"🛑 CARDIAC ARREST{at} — perfusion collapsed.")
elif verdict == "EXSANGUINATING":
    st.error("🩸 EXSANGUINATING — ~1 blood volume transfused, still bleeding: "
             "surgical control mandatory.")
else:
    st.warning(f"⚠️ Ongoing — not yet controlled within {duration} min "
               f"(final tone {res['final_tone']}).")

# ── Charts ─────────────────────────────────────────────────────────────────
st.subheader("What happened, minute by minute")
g1, g2 = st.columns(2)
with g1:
    st.markdown("**Uterine tone** (0 atonic → 1 firm)")
    st.line_chart(df[["tone"]])
    st.markdown("**Bleeding rate (ml/min)**")
    st.line_chart(df[["bleed_ml_min"]])
    st.markdown("**Estimated blood loss & circulating volume (ml)**")
    st.line_chart(df[["EBL", "blood_volume"]])
with g2:
    st.markdown("**Blood pressure — MAP (mmHg)**  ·  arrest at ≤ 35")
    st.line_chart(df[["MAP"]])
    st.markdown("**Heart rate (bpm)**")
    st.line_chart(df[["HR"]])
    st.markdown("**Lactate (mmol/L)**  ·  oxygen-debt marker")
    st.line_chart(df[["lactate"]])

# ── Action log ─────────────────────────────────────────────────────────────
with st.expander("Operator action log (what was given, and when)"):
    log = df[df["action"] != ""][["EBL", "tone", "bleed_ml_min", "MAP", "action"]]
    st.dataframe(log, use_container_width=True)
