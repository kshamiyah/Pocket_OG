#!/usr/bin/env python3
"""
LIVE visualizer — watch the REAL Pocket O&G SOS engine drive the simulated
patient in real time.

Run:  streamlit run simulator/bridge/app_live.py
"""

import os
import sys
import time

import pandas as pd
import streamlit as st

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))

from app_operator import stream   # noqa: E402

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

st.set_page_config(page_title="SOS engine — live", layout="wide")
st.title("PPH SOS algorithm — live on the simulated patient")
st.caption("The patient just bleeds. The REAL SOS-PPH algorithm (computeNextPrompt "
           "from the emergency branch) is the sole decision-maker — the team follows "
           "it step by step. We watch whether, by following the algorithm, she stabilises.")

with st.sidebar:
    st.header("Patient")
    weight = st.slider("Weight (kg)", 40, 150, 70)
    bmi = st.slider("BMI", 18, 50, 25)
    start_ebl = st.slider("Blood loss at recognition (ml)", 500, 2000, 500, step=50,
                          help="Blood already lost when SOS is opened (not called below ~500 ml).")
    chosen = [k for k, v in RISK_FACTORS.items() if st.checkbox(v)]
    accreta = st.checkbox("Accreta (balloon/sutures ineffective)")
    speed = st.select_slider("Playback speed", ["slow", "normal", "fast"], "normal")
    go = st.button("▶ Run with real SOS engine", type="primary")

delay = {"slow": 0.5, "normal": 0.22, "fast": 0.05}[speed]

scenario = {
    "name": "live", "weight_kg": weight, "bmi": bmi, "start_ebl": start_ebl,
    "risk_factors": chosen,
    "surgical_ineffective": ["balloon", "sutures"] if accreta else None,
}

if go:
    now_box = st.empty()
    metric_box = st.empty()
    c1, c2 = st.columns(2)
    tone_box, map_box = c1.empty(), c2.empty()
    bleed_box, ebl_box = c1.empty(), c2.empty()
    log_box = st.empty()

    rows, logs = [], []
    with st.spinner("Starting the real SOS engine (first step takes a few seconds)…"):
        gen = stream(scenario)
        for snap in gen:
            rows.append(snap)
            df = pd.DataFrame(rows).set_index("t")

            verb = snap["note"] or "…"
            now_box.markdown(f"### 🩺 App says NOW: **{verb}**  \n"
                             f"<span style='color:gray'>level: {snap['level']} · "
                             f"prompt: {snap['ptype'] or '-'} {snap['tid'] or ''}</span>",
                             unsafe_allow_html=True)

            m1, m2, m3, m4, m5 = metric_box.columns(5)
            m1.metric("Time (min)", snap["t"])
            m2.metric("Blood loss", f"{snap['ebl']:,} ml")
            m3.metric("Uterine tone", f"{snap['tone']:.2f}")
            m4.metric("Bleeding", f"{snap['bleed']} ml/min")
            m5.metric("MAP", f"{snap['map']} mmHg")

            tone_box.markdown("**Uterine tone** (0 atonic → 1 firm)")
            tone_box.line_chart(df[["tone"]], height=180)
            map_box.markdown("**MAP (mmHg)** · arrest ≤ 35")
            map_box.line_chart(df[["map"]], height=180)
            bleed_box.markdown("**Bleeding (ml/min)**")
            bleed_box.line_chart(df[["bleed"]], height=180)
            ebl_box.markdown("**Cumulative blood loss (ml)**")
            ebl_box.line_chart(df[["ebl"]], height=180)

            if snap["acted"]:
                logs.append(f"t={snap['t']:>4}  {snap['ptype'] or '-'} {snap['tid'] or ''} → {snap['note']}")
            log_box.code("\n".join(logs[-16:]) or "…")

            time.sleep(delay)
            if snap["verdict"]:
                break

    v = rows[-1]["verdict"]
    if v == "CONTROLLED":
        st.success(f"✅ CONTROLLED at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml. "
                   "The SOS protocol kept her alive.")
    elif v == "ARREST":
        st.error(f"🛑 CARDIAC ARREST at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml.")
    else:
        st.warning(f"⚠️ Still ongoing at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml.")
else:
    st.info("Pick a patient on the left and press **Run** to watch the real SOS engine manage her.")
