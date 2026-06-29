#!/usr/bin/env python3
"""
LIVE visualizer — watch the REAL Pocket O&G SOS engine drive the simulated
patient in real time.

Run:  streamlit run simulator/bridge/app_live.py
"""

import os
import sys
import time

import altair as alt
import pandas as pd
import streamlit as st

HERE = os.path.dirname(os.path.abspath(__file__))
SIM = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, SIM)

from app_operator import stream   # noqa: E402
from patient_profile import (    # noqa: E402
    EFFECTIVE, INEFFECTIVE, PRESET_OPTIONS, PRESETS, TREATMENT_LABELS,
    scenario_from_profile, summarise_response,
)

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

MAP_CHART_FLOOR = 20
MAP_CHART_CEIL = 100


def format_log_line(snap):
    """One line per simulation tick — matches CLI detail (vitals + what happened)."""
    tag = "ACTION" if snap["acted"] else "WAIT  "
    return (
        f"t={snap['t']:5.1f}  MAP={snap['map']:3d}  EBL={snap['ebl']:5,}  "
        f"bleed={snap['bleed']:3d}  tone={snap['tone']:.2f}  | {tag}: {snap['note']}"
    )


def vitals_chart(df, column, title, y_domain=None, height=180):
    enc = {
        "x": alt.X("t:Q", title="Time (min)"),
        "y": alt.Y(f"{column}:Q", title=title),
    }
    if y_domain is not None:
        enc["y"] = alt.Y(f"{column}:Q", title=title, scale=alt.Scale(domain=y_domain, clamp=True))
    chart = (
        alt.Chart(df.reset_index())
        .mark_line(point={"size": 30})
        .encode(**enc)
        .properties(height=height)
    )
    return chart


st.set_page_config(page_title="SOS engine — live", layout="wide")
st.title("PPH SOS algorithm — live on the simulated patient")
st.caption(
    "Configure a **patient phenotype** (what works / what doesn't after PPH is recognised), "
    "then run the **real SOS algorithm** unchanged. We watch whether following the protocol "
    "keeps her alive."
)

with st.sidebar:
    st.header("1 · Presentation")
    st.caption("How sick she is when SOS opens — not what fixes her.")
    weight = st.slider("Weight (kg)", 40, 150, 70)
    bmi = st.slider("BMI", 18, 50, 25)
    start_ebl = st.slider(
        "Blood loss at recognition (ml)", 500, 2000, 500, step=50,
        help="Blood already lost when SOS is opened (not called below ~500 ml).",
    )
    chosen = [k for k, v in RISK_FACTORS.items() if st.checkbox(v, key=f"rf_{k}")]

    st.divider()
    st.header("2 · Case phenotype")
    st.caption("You know the case — set what will and won't work for **this** patient.")
    preset = st.selectbox(
        "Preset",
        list(PRESET_OPTIONS.keys()),
        format_func=lambda k: PRESET_OPTIONS[k],
    )

    treatment_response = {}
    for key, label in TREATMENT_LABELS.items():
        default = PRESETS[preset][key] if preset != "custom" else EFFECTIVE
        choice = st.radio(
            label,
            [EFFECTIVE, INEFFECTIVE],
            index=0 if default == EFFECTIVE else 1,
            format_func=lambda v: "Responds" if v == EFFECTIVE else "No response",
            horizontal=True,
            key=f"treatment_{preset}_{key}",
        )
        treatment_response[key] = choice

    st.info(summarise_response(treatment_response))

    st.divider()
    speed = st.select_slider("Playback speed", ["slow", "normal", "fast"], "normal")
    go = st.button("▶ Run with real SOS engine", type="primary")

delay = {"slow": 0.5, "normal": 0.22, "fast": 0.05}[speed]

scenario = scenario_from_profile(
    weight, bmi, start_ebl, chosen, treatment_response,
)

if go:
    st.markdown(f"**Phenotype:** {summarise_response(treatment_response)}")
    now_box = st.empty()
    metric_box = st.empty()
    c1, c2 = st.columns(2)
    tone_box, map_box = c1.empty(), c2.empty()
    bleed_box, ebl_box = c1.empty(), c2.empty()
    log_box = st.empty()

    rows, logs = [], []
    baseline_map = None
    with st.spinner("Starting the real SOS engine (first step takes a few seconds)…"):
        gen = stream(scenario)
        for snap in gen:
            rows.append(snap)
            if baseline_map is None:
                baseline_map = snap["map"]
            df = pd.DataFrame(rows).set_index("t")

            verb = snap["note"] or "…"
            now_box.markdown(
                f"### 🩺 App says NOW: **{verb}**  \n"
                f"<span style='color:gray'>level: {snap['level']} · "
                f"prompt: {snap['ptype'] or '-'} {snap['tid'] or ''}</span>",
                unsafe_allow_html=True,
            )

            map_delta = snap["map"] - baseline_map
            m1, m2, m3, m4, m5 = metric_box.columns(5)
            m1.metric("Time (min)", f"{snap['t']:.1f}")
            m2.metric("Blood loss (EBL)", f"{snap['ebl']:,} ml")
            m3.metric("Uterine tone", f"{snap['tone']:.2f}")
            m4.metric("Bleeding", f"{snap['bleed']} ml/min")
            m5.metric("MAP", f"{snap['map']} mmHg", delta=f"{map_delta:+d} vs start")

            tone_box.markdown("**Uterine tone** (0 atonic → 1 firm)")
            tone_box.altair_chart(
                vitals_chart(df, "tone", "Tone", y_domain=[0, 1]),
                use_container_width=True,
            )
            map_box.markdown("**MAP (mmHg)** · arrest ≤ 35 · fixed scale so drops are visible")
            map_box.altair_chart(
                vitals_chart(df, "map", "MAP (mmHg)", y_domain=[MAP_CHART_FLOOR, MAP_CHART_CEIL]),
                use_container_width=True,
            )
            bleed_box.markdown("**Bleeding (ml/min)**")
            bleed_box.altair_chart(
                vitals_chart(df, "bleed", "ml/min"),
                use_container_width=True,
            )
            ebl_box.markdown("**Cumulative blood loss (ml)**")
            ebl_box.altair_chart(
                vitals_chart(df, "ebl", "EBL (ml)"),
                use_container_width=True,
            )

            logs.append(format_log_line(snap))
            log_box.markdown("**Simulation log** — every tick (ACTION = team step, WAIT = clock advancing)")
            log_box.code("\n".join(logs[-40:]) or "…")

            time.sleep(delay)
            if snap.get("verdict"):
                break

    v = rows[-1]["verdict"]
    if v == "CONTROLLED":
        st.success(
            f"✅ CONTROLLED at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml. "
            "The SOS protocol kept her alive."
        )
    elif v == "ARREST":
        st.error(
            f"🛑 CARDIAC ARREST at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml. "
            f"MAP {rows[-1]['map']} mmHg."
        )
    else:
        st.warning(f"⚠️ Still ongoing at {rows[-1]['t']} min — blood loss {rows[-1]['ebl']:,} ml.")
else:
    st.info(
        "Set **presentation** (how sick) and **phenotype** (what works) in the sidebar, "
        "then press **Run**."
    )
