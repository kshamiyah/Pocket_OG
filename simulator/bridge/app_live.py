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
for _path in (HERE, SIM):
    if _path not in sys.path:
        sys.path.insert(0, _path)

from app_operator import stream   # noqa: E402
from human_factors import (       # noqa: E402
    COMPETENT, EXPERIENCE_CHOICES, HF_PRESET_BLURBS, HF_PRESET_OPTIONS,
    LOGISTICS_TIME_CHOICES, STRESS_CHOICES, TASK_SPEED_BUCKETS, TASK_SPEED_CHOICES,
    THEATRE_TIME_CHOICES, TEAM_LANES_CHOICES, blood_wait_breakdown, choice_for_nearest, choice_for_value,
    describe_human_factors, format_duration, normalize_human_factors, preset_human_factors,
)
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

TISSUE_SEVERITY_LABELS = {
    0.0: "Placenta complete — no retained tissue",
    0.25: "Minor tags — small membrane fragments; trickle bleed",
    0.5: "Partial retention — placenta piece or significant membranes",
    0.75: "Major retention — large fragment or trapped placenta",
    1.0: "Accreta / complete retention — no cleavage plane",
}

MANUAL_REMOVAL_DURATION_OPTIONS = {
    "Quick bedside (~3 min)": 3.0,
    "Standard (~4 min)": 4.0,
    "Typical ERPC (~5 min)": 5.0,
    "Difficult ERPC (~8 min)": 8.0,
}

MAP_CHART_FLOOR = 20
MAP_CHART_CEIL = 100
CHART_H = 200


def format_log_block(snap):
    """Multi-line log block for one simulation tick."""
    lines = []
    t = snap["t"]
    dt = snap.get("step_dt", 0)
    lines.append(
        f"── t={t:5.1f}  (+{dt:.2f} min) ─────────────────────────────────────"
    )
    lines.append(
        f"  CIRC   MAP {snap['map']:3d} mmHg  CPP {snap.get('cpp', 0):4.0f}  "
        f"HR {snap.get('hr', 0):3.0f} bpm"
        + ("  ⚠ coronary ischaemia" if snap.get("cardiac_arrest") else "")
        + (f"  arrest {snap.get('arrest_min', 0):.1f} min" if snap.get("cardiac_arrest") else "")
    )
    lines.append(
        f"  BLEED  EBL {snap['ebl']:,} ml  rate {snap['bleed']}/{snap.get('source_bleed', '?')} ml/min  "
        f"tone {snap['tone']:.2f}"
    )
    lines.append(
        f"  OXY    Hb {snap.get('hb', 0):.0f} g/L  DO₂ {snap.get('do2', 0):.1f}  "
        f"debt {snap.get('oxygen_debt', 0):.1f}  lact {snap.get('lactate', 0):.1f}"
    )
    lines.append(
        f"  COAG   fibrinogen {snap.get('fibrinogen', 0):.1f} g/L  ×{snap.get('coag_mult', 1):.2f}"
    )
    level = (snap.get("level") or "?").upper()
    lanes = snap.get("lanes_in_use", snap.get("in_flight", 0))
    cap = snap.get("team_lanes", 1)
    flags = []
    if snap.get("exsanguinating"):
        flags.append("exsanguinating")
    if snap.get("cardiac_arrest"):
        flags.append("fuse active")
    flag_s = f"  [{', '.join(flags)}]" if flags else ""
    lines.append(f"  TEAM   {level} PPH  ·  {lanes}/{cap} lanes busy{flag_s}")

    events = snap.get("events") or []
    if events:
        for ev in events:
            kind = ev.get("kind", "INFO")
            task = ev.get("task")
            task_s = f" ({task})" if task and task not in (ev.get("text") or "") else ""
            lines.append(f"  [{kind:8}]{task_s} {ev.get('text', '')}")
    elif snap.get("note"):
        for part in snap["note"].split(" · "):
            part = part.strip()
            if part:
                lines.append(f"  [INFO    ] {part}")

    for job in snap.get("in_flight_detail") or []:
        lane = "lane" if job.get("uses_lane", True) else "free"
        lines.append(
            f"  [QUEUE   ] {job['task']} ({lane}): "
            f"{job['remaining_min']:.1f} min left → t={job['until']:.1f}"
        )

    cause = snap.get("death_cause")
    verdict = snap.get("verdict")
    if cause and verdict in ("ARREST", "IRREVERSIBLE_SHOCK"):
        cause_label = (
            "coronary fuse (CPP)"
            if cause == "cardiac_arrest"
            else "oxygen debt (LD50)"
        )
        lines.append(f"  [DEATH   ] {verdict} — {cause_label}")

    lines.append("")
    return lines


def format_log_line(snap):
    """Compact single line (legacy)."""
    return "\n".join(format_log_block(snap)).strip()


def render_human_factors_summary(hf):
    """Sidebar block: what these settings mean in plain language."""
    desc = describe_human_factors(hf)
    st.markdown(f"**{desc['team']}**")
    st.caption(desc["stress"])
    st.markdown("**Example timings** (simulation clock)")
    for line in desc["examples"]:
        st.markdown(f"- {line}")


def task_speed_picker(title, key, value, help_text, sos_examples):
    """Select how long the team takes — labels only, no raw minutes."""
    st.markdown(title)
    st.caption(sos_examples)
    default = choice_for_nearest(
        TASK_SPEED_CHOICES, value, "~30 seconds",
    )
    choice = st.select_slider(
        "Wait time",
        options=list(TASK_SPEED_CHOICES.keys()),
        value=default,
        help=help_text,
        key=key,
        label_visibility="collapsed",
    )
    return TASK_SPEED_CHOICES[choice]


def logistics_picker(title, key, value, choices, help_text, note):
    st.markdown(title)
    st.caption(note)
    default = choice_for_nearest(choices, value, "~10 minutes")
    choice = st.select_slider(
        "Wait time",
        options=list(choices.keys()),
        value=default,
        help=help_text,
        key=key,
        label_visibility="collapsed",
    )
    return choices[choice]


def level_badge(level):
    colours = {"minor": "#ca8a04", "major": "#ea580c", "massive": "#dc2626"}
    colour = colours.get(level, "#64748b")
    return (
        f"<span style='background:{colour};color:white;padding:2px 10px;"
        f"border-radius:4px;font-weight:600;font-size:0.85rem'>{level.upper()} PPH</span>"
    )


def vitals_chart(df, column, title, y_domain=None, height=CHART_H, ref_y=None, ref_label=None):
    enc = {
        "x": alt.X("t:Q", title="Time (min)"),
        "y": alt.Y(f"{column}:Q", title=title),
    }
    if y_domain is not None:
        enc["y"] = alt.Y(f"{column}:Q", title=title, scale=alt.Scale(domain=y_domain, clamp=True))
    chart = (
        alt.Chart(df.reset_index())
        .mark_line(strokeWidth=2)
        .encode(**enc)
        .properties(height=height)
    )
    if ref_y is not None:
        rule = alt.Chart(pd.DataFrame({"y": [ref_y]})).mark_rule(
            strokeDash=[4, 4], color="#c0392b"
        ).encode(y="y:Q")
        if ref_label:
            label = alt.Chart(pd.DataFrame({"y": [ref_y], "label": [ref_label]})).mark_text(
                align="left", dx=4, dy=-6, color="#c0392b", size=11
            ).encode(y="y:Q", text="label:N")
            chart = chart + rule + label
        else:
            chart = chart + rule
    return chart


def render_chart(slot, df, column, heading, y_title, y_domain=None, ref_y=None, ref_label=None):
    """Draw into a fixed placeholder so ticks replace rather than stack."""
    slot.markdown(f"**{heading}**")
    slot.altair_chart(
        vitals_chart(df, column, y_title, y_domain=y_domain, ref_y=ref_y, ref_label=ref_label),
        use_container_width=True,
    )


def verdict_message(verdict, snap):
    t, ebl, map_v = snap["t"], snap["ebl"], snap["map"]
    margin = snap.get("margin") or {}
    peak_debt = margin.get("peak_oxygen_debt", snap.get("oxygen_debt", 0))
    if verdict == "CONTROLLED_COMFORTABLY":
        return (
            f"✅ **CONTROLLED comfortably** at {t:.1f} min — EBL {ebl:,} ml, "
            f"peak debt {peak_debt:.0f} mL/kg (wide margin)."
        )
    if verdict == "NEAR_MISS":
        return (
            f"⚠️ **NEAR MISS** at {t:.1f} min — survived but peak debt {peak_debt:.0f} mL/kg "
            f"or MAP nadir {margin.get('map_nadir', map_v)} mmHg."
        )
    if verdict == "CONTROLLED" or str(verdict).startswith("CONTROLLED"):
        return f"✅ **CONTROLLED** at {t:.1f} min — EBL {ebl:,} ml. Protocol kept her alive."
    if verdict == "ARREST":
        return f"🛑 **CARDIAC ARREST** at {t:.1f} min — EBL {ebl:,} ml, MAP {map_v} mmHg (coronary fuse)."
    if verdict == "IRREVERSIBLE_SHOCK":
        return (
            f"🛑 **IRREVERSIBLE SHOCK** at {t:.1f} min — EBL {ebl:,} ml, "
            f"oxygen debt {peak_debt:.0f} mL/kg (≥ LD50)."
        )
    if verdict and "held_by_transfusion" in str(verdict):
        return (
            f"⚠️ **Held by transfusion** at {t:.1f} min — ~1 blood volume in, source still uncontrolled."
        )
    return f"⚠️ **ONGOING** at {t:.1f} min — EBL {ebl:,} ml."


st.set_page_config(page_title="SERA — SOS live", layout="wide")
st.title("SERA — Simulated Emergency Response Agent")
st.caption(
    "Simulated Emergency Response Agent: configure presentation and phenotype in the sidebar, "
    "then run the real SOS algorithm unchanged and watch whether the protocol stabilises her."
)

with st.sidebar:
    with st.expander("1 · Presentation", expanded=True):
        st.caption("How sick she is when SOS opens.")
        weight = st.slider("Weight (kg)", 40, 150, 70)
        bmi = st.slider("BMI", 18, 50, 25)
        start_ebl = st.slider(
            "Blood loss at recognition (ml)", 500, 2000, 500, step=50,
            help="Blood already lost when SOS is opened.",
        )
        starting_Hb = st.slider(
            "Starting haemoglobin (g/L)", 70, 140, 110, step=5,
            help="Antenatal Hb at recognition. Feeds oxygen delivery (Section D).",
        )
        chosen = [k for k, v in RISK_FACTORS.items() if st.checkbox(v, key=f"rf_{k}")]

        st.markdown("**Insults**")
        st.caption("R-BLEED-3 non-atonic causes. Trauma = additive bleed; tissue = tone ceiling.")
        trauma_severity = st.slider(
            "Genital tract tear (0–1)", 0.0, 1.0, 0.0, step=0.05,
            help="Tone-independent bleed from a tear; cleared by suture repair.",
        )
        tissue_severity = st.select_slider(
            "Retained tissue (0–1)",
            options=[0.0, 0.25, 0.5, 0.75, 1.0],
            value=0.0,
            help=(
                "Caps uterine tone from t0 (ceiling = 1 − severity). "
                "Drugs bank tone but bleed reads the cap until manual removal clears it."
            ),
        )
        st.caption(TISSUE_SEVERITY_LABELS[tissue_severity])
        if tissue_severity > 0:
            removal_label = st.selectbox(
                "Manual removal procedure duration",
                list(MANUAL_REMOVAL_DURATION_OPTIONS.keys()),
                index=1,
                help="Physiology clock: time under anaesthesia until products are out. "
                     "Setup delay (find anaesthetist) is in Human factors.",
            )
            manual_removal_duration_min = MANUAL_REMOVAL_DURATION_OPTIONS[removal_label]
        else:
            manual_removal_duration_min = 4.0
        asthma = st.checkbox("Asthma (skip carboprost)", help="R-TX-5")

    with st.expander("2 · Phenotype", expanded=False):
        st.caption("What works for this patient.")
        preset = st.selectbox(
            "Preset",
            list(PRESET_OPTIONS.keys()),
            format_func=lambda k: PRESET_OPTIONS[k],
        )

        treatment_response = {}
        phenotype_keys = list(TREATMENT_LABELS.keys())
        if trauma_severity <= 0:
            phenotype_keys = [k for k in phenotype_keys if k != "repair"]
        if tissue_severity <= 0:
            phenotype_keys = [k for k in phenotype_keys if k != "manual_removal"]
        for key in phenotype_keys:
            label = TREATMENT_LABELS[key]
            default = PRESETS[preset][key] if preset != "custom" else EFFECTIVE
            choice = st.radio(
                label,
                [EFFECTIVE, INEFFECTIVE],
                index=0 if default == EFFECTIVE else 1,
                format_func=lambda v: "Works" if v == EFFECTIVE else "Fails",
                horizontal=True,
                key=f"treatment_{preset}_{key}",
            )
            treatment_response[key] = choice

        st.info(summarise_response(treatment_response))

    with st.expander("3 · Human factors", expanded=False):
        st.caption(
            "How long the *simulated team* takes to do what SOS asks — not the patient. "
            "While they work, the clock runs and she keeps bleeding."
        )

        hf_preset = st.selectbox(
            "Team preset",
            list(HF_PRESET_OPTIONS.keys()),
            index=list(HF_PRESET_OPTIONS.keys()).index("competent"),
            format_func=lambda k: HF_PRESET_OPTIONS[k],
            help="Pick a realistic team profile. Use *Ideal robot* to test the protocol alone.",
        )
        st.caption(HF_PRESET_BLURBS.get(hf_preset, ""))

        if hf_preset != "custom":
            human_factors = preset_human_factors(hf_preset)
        else:
            hf_base = dict(COMPETENT)

            st.markdown("**Who is on the team?**")
            exp_label = st.select_slider(
                "Team speed",
                options=list(EXPERIENCE_CHOICES.keys()),
                value=choice_for_value(
                    EXPERIENCE_CHOICES, hf_base["team_experience"], "Competent — typical",
                ),
                help="Overall multiplier on every task. Senior teams finish SOS steps faster.",
            )
            hf_base["team_experience"] = EXPERIENCE_CHOICES[exp_label]

            stress_label = st.select_slider(
                "Behaviour when she crashes",
                options=list(STRESS_CHOICES.keys()),
                value=choice_for_value(
                    STRESS_CHOICES, hf_base["stress_sensitivity"],
                    "Normal — slows a little under stress",
                ),
                help="When bleed rate is high or BP is falling, delays can stretch further.",
            )
            hf_base["stress_sensitivity"] = STRESS_CHOICES[stress_label]

            with st.expander("Task speed — waiting while the team works", expanded=False):
                st.markdown(
                    "When SOS shows a prompt, the simulated team does **not** tap instantly. "
                    "These settings control how long she waits while they work. "
                    "**The clock keeps running and she keeps bleeding during that wait.**"
                )
                st.caption(
                    "Pick a real-world wait time for each type of prompt. "
                    "You never need to enter minutes as a decimal."
                )
                for bucket in TASK_SPEED_BUCKETS:
                    hf_base[bucket["key"]] = task_speed_picker(
                        bucket["title"],
                        f"hf_{bucket['key']}",
                        hf_base[bucket["key"]],
                        bucket["help"],
                        bucket["sos_examples"],
                    )

            with st.expander("Blood bank and theatre", expanded=False):
                st.caption("Delays outside the bedside team — lab, porter, theatre mobilisation.")
                hf_base["o_neg_immediate"] = st.checkbox(
                    "O-negative available immediately",
                    value=bool(hf_base["o_neg_immediate"]),
                    help=(
                        "If ticked, skip the crossmatch / lab prep wait (emergency O-neg). "
                        "If unticked, lab prep time applies before any unit leaves the fridge."
                    ),
                )
                hf_base["blood_lab_prep_min"] = logistics_picker(
                    "Blood bank prepares units — how long?",
                    "hf_blood_lab",
                    hf_base["blood_lab_prep_min"],
                    LOGISTICS_TIME_CHOICES,
                    "Crossmatch or MHP pack assembly. Ignored when O-neg is ticked below.",
                    "From ordering blood to units ready in the lab (crossmatch path only).",
                )
                hf_base["first_prbc_min"] = logistics_picker(
                    "Porter brings first unit + line setup — how long?",
                    "hf_first_prbc",
                    hf_base["first_prbc_min"],
                    LOGISTICS_TIME_CHOICES,
                    "Time from units ready to PRBC actually running in.",
                    "From units available to first unit infusing at the bedside.",
                )
                blood_preview = blood_wait_breakdown(normalize_human_factors(hf_base))
                if blood_preview["crossmatch"]:
                    st.caption(
                        f"**Total blood wait after order:** "
                        f"{format_duration(blood_preview['total_min'])} "
                        f"({format_duration(blood_preview['lab_min'])} lab + "
                        f"{format_duration(blood_preview['bedside_min'])} bedside)"
                    )
                else:
                    st.caption(
                        f"**Total blood wait after order:** "
                        f"{format_duration(blood_preview['total_min'])} (O-neg path)"
                    )

                hf_base["theatre_mobilisation_min"] = logistics_picker(
                    "Theatre team mobilises — how long?",
                    "hf_theatre",
                    hf_base["theatre_mobilisation_min"],
                    THEATRE_TIME_CHOICES,
                    "From assigning theatre in SOS to patient ready for transfer / surgery.",
                    "From 'send to theatre' to team and anaesthetic ready.",
                )
                hf_base["manual_removal_logistics_min"] = logistics_picker(
                    "Manual removal setup — how long?",
                    "hf_manual_removal",
                    hf_base["manual_removal_logistics_min"],
                    LOGISTICS_TIME_CHOICES,
                    "From SOS prompting removal to procedure starting under anaesthesia.",
                    "Find anaesthetist, transfer if needed, establish/regional block.",
                )

            human_factors = normalize_human_factors(hf_base)

        lanes_default = choice_for_nearest(
            TEAM_LANES_CHOICES,
            human_factors.get("team_lanes", 5),
            "Full PPH team — 5 available",
        )
        lanes_label = st.select_slider(
            "People available (parallel slots)",
            options=list(TEAM_LANES_CHOICES.keys()),
            value=lanes_default,
            help=(
                "How many delegated SOS tasks can run at the same time. "
                "1 = one person doing everything in sequence; 5 ≈ full PPH team. "
                "Phone calls do not use a slot."
            ),
        )
        human_factors = normalize_human_factors({
            **human_factors,
            "team_lanes": TEAM_LANES_CHOICES[lanes_label],
        })
        render_human_factors_summary(human_factors)

    st.divider()
    speed = st.select_slider("Playback speed", ["slow", "normal", "fast"], "normal")
    verbose_log = st.checkbox(
        "Detailed simulation log",
        value=True,
        help="Show full physiology, team lanes, and each delegated action on separate lines.",
    )
    go = st.button("▶ Run simulation", type="primary", use_container_width=True)

delay = {"slow": 0.5, "normal": 0.22, "fast": 0.05}[speed]

scenario = scenario_from_profile(
    weight, bmi, start_ebl, chosen, treatment_response,
    trauma_severity=trauma_severity,
    tissue_severity=tissue_severity,
    manual_removal_duration_min=manual_removal_duration_min,
    starting_Hb=starting_Hb,
    asthma=asthma,
)
scenario["human_factors"] = human_factors

if go:
    # ── Fixed layout: every visual element gets its own placeholder ──
    verdict_box = st.empty()
    now_box = st.empty()
    metrics_box = st.empty()

    st.markdown("##### Vitals over time")
    row1 = st.columns(3)
    row2 = st.columns(3)
    map_slot = row1[0].empty()
    bleed_slot = row1[1].empty()
    ebl_slot = row1[2].empty()
    tone_slot = row2[0].empty()
    hr_slot = row2[1].empty()
    fib_slot = row2[2].empty()
    lactate_slot = st.empty()

    st.markdown("##### Recent log")
    log_slot = st.empty()

    rows, logs = [], []
    baseline_map = None

    with st.spinner("Starting SOS engine (first step takes a few seconds)…"):
        for snap in stream(scenario):
            rows.append(snap)
            if baseline_map is None:
                baseline_map = snap["map"]
            df = pd.DataFrame(rows).set_index("t")

            verb = snap["note"] or "Monitoring…"
            verdict_box.info("Simulation running…")
            now_box.markdown(
                f"### SOS says NOW: {verb}\n\n{level_badge(snap['level'])} "
                f"&nbsp;·&nbsp; prompt `{snap['ptype'] or '-'} "
                f"{snap['tid'] or ''}` "
                f"&nbsp;·&nbsp; {snap.get('in_flight', 0)}/{snap.get('team_lanes', 1)} jobs in flight"
                .strip(),
                unsafe_allow_html=True,
            )

            map_delta = snap["map"] - baseline_map
            with metrics_box.container():
                r1c1, r1c2, r1c3, r1c4 = st.columns(4)
                r2c1, r2c2, r2c3, r2c4 = st.columns(4)
                r1c1.metric("Time", f"{snap['t']:.1f} min")
                r1c2.metric("EBL", f"{snap['ebl']:,} ml")
                r1c3.metric("Bleed rate", f"{snap['bleed']} ml/min")
                r1c4.metric("Tone", f"{snap['tone']:.2f}")
                r2c1.metric("MAP", f"{snap['map']} mmHg", delta=f"{map_delta:+d}")
                r2c2.metric("Heart rate", f"{snap.get('hr', 0):.0f} bpm")
                fib = snap.get("fibrinogen")
                r2c3.metric(
                    "Fibrinogen", f"{fib:.1f} g/L" if fib is not None else "—",
                    delta="low" if fib is not None and fib < 2.0 else None,
                    delta_color="inverse",
                )
                r2c4.metric("Coag ×", f"{snap.get('coag_mult', 1):.2f}")

            render_chart(
                map_slot, df, "map", "MAP (mmHg) · arrest ≤35",
                "MAP", y_domain=[MAP_CHART_FLOOR, MAP_CHART_CEIL],
            )
            render_chart(bleed_slot, df, "bleed", "Bleeding (ml/min)", "ml/min")
            render_chart(ebl_slot, df, "ebl", "Cumulative EBL (ml)", "ml")
            render_chart(
                tone_slot, df, "tone", "Uterine tone (0 atonic → 1 firm)",
                "Tone", y_domain=[0, 1],
            )
            if "hr" in df.columns:
                render_chart(
                    hr_slot, df, "hr", "Heart rate · R-CIRC-1",
                    "bpm", y_domain=[60, 180],
                )
            if "fibrinogen" in df.columns:
                render_chart(
                    fib_slot, df, "fibrinogen", "Fibrinogen · treat ≤2.0 g/L",
                    "g/L", y_domain=[0, 6], ref_y=2.0, ref_label="≤2.0",
                )
            if "lactate" in df.columns:
                render_chart(
                    lactate_slot, df, "lactate",
                    "Lactate proxy · recorded, not scored (R-ARR-1)",
                    "mmol/L", y_domain=[0, 15], ref_y=12.9, ref_label="LD50 proxy",
                )

            block = format_log_block(snap) if verbose_log else [
                f"t={snap['t']:5.1f}  MAP={snap['map']}  EBL={snap['ebl']:,}  "
                f"| {snap.get('note', '')[:120]}",
                "",
            ]
            logs.extend(block)
            log_slot.code("\n".join(logs[-120:]) or "…", language=None)

            time.sleep(delay)
            if snap.get("verdict"):
                break

    final = rows[-1]
    v = final.get("verdict")
    msg = verdict_message(v, final)
    if v == "CONTROLLED" or str(v).startswith("CONTROLLED"):
        verdict_box.success(msg)
    elif v in ("NEAR_MISS",) or (v and "held_by_transfusion" in str(v)):
        verdict_box.warning(msg)
    elif v in ("ARREST", "IRREVERSIBLE_SHOCK"):
        verdict_box.error(msg)
    else:
        verdict_box.warning(msg)

    # Final static view for review / print
    st.markdown("##### Full simulation log")
    st.code("\n".join(logs) or "…", language=None)

else:
    st.info("Configure the patient in the sidebar, then press **Run simulation**.")
