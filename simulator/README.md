# Virtual Obstetric Patient — simulator

A physiology simulator for postpartum haemorrhage (PPH). Every clinical value is
signed off and sourced in **`RULES.md`**. The engine is built in stages
(`stage1`…`stage4`), and **`app.py`** is a clickable front end over the full
Stage 4 model.

## Run the front end (recommended)

```bash
pip install -r requirements.txt        # first time only
streamlit run simulator/app.py
```

Then open the URL it prints (usually http://localhost:8501). Pick a patient on
the left — weight, BMI, risk factors, accreta — and the simulation runs live,
showing the verdict (controlled / arrest / exsanguinating) and charts of tone,
blood pressure, bleeding, EBL and lactate over time.

## Run a stage from the command line

```bash
python3 simulator/stage4_sandbox.py    # full PPH model, sample scenarios
```

## Files

| File | What it is |
|---|---|
| `RULES.md` | The signed-off clinical rule book + references (single source of truth) |
| `RESEARCH_BRIEF.md` | Stage 0 landscape / design |
| `stage1_sandbox.py` | blood volume + tone + one drug |
| `stage2_sandbox.py` | + vitals (HR/MAP) + oxygen delivery/debt/lactate |
| `stage3_sandbox.py` | + full uterotonic ladder, responsiveness, transfusion |
| `stage4_sandbox.py` | + surgical control; `simulate()` is the engine the UI calls |
| `app.py` | Streamlit front end |

The UI contains **no clinical logic** — it calls `stage4_sandbox.simulate()`, so
the front end and the validated engine can never drift apart.
