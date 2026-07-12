# Handover: what SERA is

**Audience:** anyone (human or AI) picking up the emergency-simulation work.
**Status:** SERA is a working prototype that lives outside `main`. This note
explains what it is, where it lives, how it is put together, and what state it is
in. Nothing here is on `main` and none of it is clinically validated.

---

## 1. One-line answer

**SERA (Simulated Emergency Response Agent)** is a virtual obstetric patient. She
is a physiology model of postpartum haemorrhage (PPH), built to **stress-test the
app's real SOS-PPH algorithm** by having that algorithm manage a bleeding patient
and watching whether the patient stabilises.

She is a *test subject*, not a feature of the app. The name refers to the
simulated patient (and the harness around her), not to any product the trainee
sees.

## 2. The core idea

Three moving parts, kept deliberately separate so each can be audited on its own:

- **SERA (the patient)** just bleeds and responds. She is a set of numbers (blood
  volume, bleed rate, uterine tone, heart rate, MAP, rhythm, drug levels) plus
  simple, individually-cited rules for how those numbers change each tick of a
  clock. She makes **no decisions**.
- **The SOS-PPH algorithm** is the **sole decision-maker**. This is the *real*
  `computeNextPrompt` from `apps/pocket-og/src/components/EmergencyPage.jsx` on
  the `emergency` branch. It is never modified for the simulation; only SERA's
  body and phenotype are configured. Testing a *copy* of the logic would be
  misleading, so the harness wraps the production function itself.
- **The operator / team** follows the algorithm step by step. When it asks them
  to assess something, they read SERA's real state and report it back.

We then watch whether, **by following the algorithm**, the patient stabilises,
arrests, or exsanguinates. If she dies even under a perfect operator, the fault
is in the decision logic; if she only dies under an imperfect operator, that is
about human robustness, not the protocol. That separation is the whole point.

## 3. Where it lives

SERA is **not on `main`.** It sits on two feature branches:

- **`emergency`** and **`Sera`** both carry the `apps/pocket-og/src/data/emergency/`
  modules (the real PPH / arrest / shoulder-dystocia logic the app runs) plus
  `EmergencyPage.jsx`.
- **`Sera`** additionally carries the whole **`simulator/`** directory, which is
  the physiology model and the harness. This is the branch to check out to see
  SERA in full.

There is a related handover on the `emergency` branch,
`docs/agent-handover-clinical-scenario-testing.md`, covering the separate (and
not-yet-built) idea of a YAML scenario DSL for joint PPH + arrest testing. SERA
is the physiology-simulator line of work; the scenario DSL is a different,
lighter test-harness idea. Do not confuse the two.

## 4. How it is built (`simulator/` on the `Sera` branch)

| File | What it is |
|---|---|
| `RESEARCH_BRIEF.md` | Stage 0 foundation: the landscape, what to borrow vs build, and the published source behind every proposed rule. |
| `RULES.md` | The candidate clinical rule book. Every number is a plain-English rule + the concrete figure/formula + its source, marked ACCEPTED / DEFERRED / ASSUMED with sign-off dates. |
| `stage1_sandbox.py` … `stage4_sandbox.py` | The patient physiology, built up in stages (see roadmap below). |
| `patient_profile.py` | The patient **phenotype**: presentation plus per-treatment response presets (what works for *this* patient). |
| `bridge/server.mjs` | Node bridge that wraps the real `computeNextPrompt` so Python can call the production algorithm. |
| `bridge/app_operator.py` | The loop that runs the real algorithm against the patient, translating between them. |
| `bridge/app_live.py` | **The product surface:** a Streamlit live view. Pick a patient and phenotype, press Run, watch the real algorithm manage her with charts of tone, MAP, bleeding and EBL, ending in a verdict. |

### The physiology, in short

- **Bleeding is obstetric at its core.** Baseline placental-bed flow ~700 ml/min;
  `bleed_rate = BASELINE_FLOW x (1 - tone)`, so an atonic uterus (tone 0) bleeds
  at ~700 ml/min and a firm one (tone 1) at ~0. Uterotonics and massage raise
  tone after their onset delay, which drops the bleed rate.
- **Blood volume is BMI-adjusted** (Vricella regression), so an obese mother
  arrests earlier on the same absolute loss: the same millilitres are a larger
  fraction of a smaller volume. This is a deliberate safety-relevant behaviour.
- **Circulation** (HR/MAP compensation) is lifted from simple, transparent
  haemorrhage models (Zenker / Curcio class); **shock staging** thresholds and
  the **arrest timing windows** (2-min rhythm, adrenaline, PMCS) come from
  published guidance and mirror the app's existing constants.

Every rule is candidate-only and must be clinician-signed against its cited
source before it is trusted. That sign-off discipline is the reason the model is
split into hundreds of small, individually-readable rules.

## 5. Important caveat in the code

`stage4_sandbox.simulate()` contains a **deprecated legacy "ideal operator"** (an
autonomous hand-coded clinician). It is kept only as a physiology smoke-test and
**must not be used for clinical testing.** In the real product the *algorithm*,
not a hand-coded operator, makes every decision. If you see the ideal operator
driving a scenario, that is the wrong path.

## 6. Roadmap / status

From `RESEARCH_BRIEF.md`, the staged plan was:

- **Stage 0** research brief (done).
- **Stage 1** PPH sandbox: volume, bleed rate, tone, oxytocin, the clock.
- **Stage 2** add circulation (HR/MAP) and the survive/deteriorate outcome.
- **Stage 3** full uterotonic ladder and the four T's.
- **Stage 4** onward toward the live bridge over the real engine.

The current state on `Sera` is a working live view: the real SOS-PPH engine
drives the simulated patient end to end (the "Option A" milestone), with a
Streamlit front end over the validated engine. It is a research / training /
software-testing tool. The regulatory line is explicit: the moment any output is
used to guide real patient care it becomes a medical-device question, so keep it
firmly on the testing side of that line.

## 7. How to run it (from the `Sera` branch)

```bash
git checkout Sera
npm install                          # JS bridge deps (one time)
pip install -r simulator/requirements.txt
streamlit run simulator/bridge/app_live.py
```

Pick a patient (weight, BMI, blood loss at recognition, risk factors), choose a
case phenotype, press **Run**, and watch the real algorithm manage her live to a
verdict: stabilised, arrest, or exsanguinating.
