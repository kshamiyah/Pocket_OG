# Virtual Obstetric Patient — PPH simulator

A physiology simulator for postpartum haemorrhage (PPH), driven by the **real
Pocket O&G SOS-PPH algorithm**.

## The idea

- **The patient** just bleeds and responds — a validated physiology model
  (`stage1`…`stage4`; every clinical value signed off in `RULES.md`).
- **The SOS-PPH algorithm** (the real `computeNextPrompt` from `EmergencyPage.jsx`
  on the emergency branch) is the **sole decision-maker** — nothing acts on its own.
- **The team** follows the algorithm step by step; when it asks them to assess
  something they read the patient's real state and report it.
- We watch whether, **by following the algorithm, the patient stabilises.**

## Run the live view (the product)

```bash
npm install                                   # JS bridge deps (one time)
pip install -r requirements.txt               # Python deps (one time)
streamlit run simulator/bridge/app_live.py
```

Pick a patient (weight, BMI, blood loss at recognition, risk factors, accreta),
press **Run**, and watch the real algorithm manage her live — its NOW
recommendation, her vitals, and charts of tone, MAP, bleeding and EBL, ending in
a verdict (stabilised / arrest / exsanguinating).

## Files

| File | What it is |
|---|---|
| `RULES.md` | The signed-off clinical rule book + references |
| `stage1`…`stage4_sandbox.py` | The patient physiology (built up in stages) |
| `bridge/server.mjs` | Node bridge wrapping the real `computeNextPrompt` |
| `bridge/app_operator.py` | The loop: real algorithm ↔ patient (translation) |
| `bridge/app_live.py` | **The product** — live Streamlit view |

> Note: `stage4_sandbox.simulate()` is a **deprecated** legacy "ideal operator"
> (an autonomous hand-coded clinician), kept only as a physiology smoke-test. It
> is NOT the product and must not be used for clinical testing — the algorithm,
> not a hand-coded operator, makes every decision in the live view.
