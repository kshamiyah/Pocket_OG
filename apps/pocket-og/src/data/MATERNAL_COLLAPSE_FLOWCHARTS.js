// Obstetric Cardiac Arrest — GTG56
// Source: OAA/Resuscitation Council UK/MBRRACE-UK Maternal Cardiac Arrest QRH V1.1 (2021),
// consistent with RCOG Green-top Guideline No. 56 (2019).

export const MATERNAL_COLLAPSE_ARREST_FLOWCHART = {
  id: "MATERNAL_COLLAPSE_ARREST",
  title: "Obstetric Cardiac Arrest",
  subtitle: "GTG56 · OAA Maternal Cardiac Arrest QRH V1.1",
  startId: "confirm-arrest",
  nodes: {

    "confirm-arrest": {
      type: "action",
      title: "Confirm cardiac arrest, call for help",
      text: "Declare 'Obstetric cardiac arrest'.",
      items: [
        "Team for mother, and team for neonate if ≥20 weeks",
        "Note the time",
      ],
      next: "position",
    },

    "position": {
      type: "action",
      title: "Relieve aortocaval compression",
      text: "Lie flat and relieve aortocaval compression before or alongside starting CPR.",
      items: [
        "Manual uterine displacement to the left — hand below the uterus on the maternal right, push slightly up and to the left ('up, off and over')",
        "Or left lateral tilt 15–30° from head to toe on a firm surface (soft surfaces such as a bed, pillows or blankets are not effective)",
        "In major trauma, protect the spine with a spinal board before tilting; in its absence, use manual displacement",
      ],
      next: "cpr-start",
    },

    "cpr-start": {
      type: "action",
      title: "Commence CPR, request cardiac arrest trolley",
      text: "Standard CPR ratios and hand position apply.",
      items: [
        "30 compressions (100–120/min, depress 5–6 cm centre of chest) to 2 ventilations",
        "Evaluate potential causes: obstetric 4H's and 4T's, plus eclampsia and intracranial haemorrhage",
      ],
      next: "team-roles",
    },

    "team-roles": {
      type: "action",
      title: "Identify team leader, allocate roles",
      text: "Include a scribe.",
      items: [
        "Senior midwife, obstetrician and obstetric anaesthetist join the general arrest team",
        "Most senior obstetrician and anaesthetist called at the time of the arrest call",
        "Neonatal team called early if delivery is likely (antepartum collapse over 22+0 weeks)",
      ],
      next: "rhythm-check",
    },

    "rhythm-check": {
      type: "decision",
      title: "Apply defibrillation pads, check rhythm",
      text: "Defibrillation is safe in pregnancy — no change to standard shock energies. Check rhythm and pulse every 2 minutes.",
      options: [
        { label: "VF / pulseless VT", sublabel: "Shockable rhythm", next: "shockable" },
        { label: "PEA / asystole", sublabel: "Non-shockable rhythm", next: "non-shockable" },
      ],
    },

    "shockable": {
      type: "action",
      title: "Defibrillate",
      text: "Give first adrenaline and amiodarone after the 3rd shock.",
      items: [
        "Adrenaline 1 mg IV, then every 3–5 minutes",
        "Amiodarone 300 mg IV after the 3rd shock",
        "Left pad lateral to the left breast (anterior/posterior if breasts are large or engorged); remove uterine monitors before shock",
      ],
      next: "airway",
    },

    "non-shockable": {
      type: "action",
      title: "Resume CPR",
      text: "Give first adrenaline immediately.",
      items: [
        "Adrenaline 1 mg IV, then every 3–5 minutes",
      ],
      next: "airway",
    },

    "airway": {
      type: "action",
      title: "Maintain airway and ventilation",
      text: "Failed intubation is more common in pregnancy — have a failed intubation drill ready.",
      items: [
        "100% oxygen via bag-valve-mask, 10–15 L/min",
        "Supraglottic airway with drain port, or tracheal tube if trained — intubation may be difficult, airway pressures may be higher",
        "Apply waveform capnography; if expired CO₂ is absent, presume oesophageal intubation until excluded",
      ],
      next: "circulation",
    },

    "circulation": {
      type: "action",
      title: "Circulation",
      text: "Two wide-bore cannulae (minimum 16 gauge), above the diaphragm if possible.",
      items: [
        "If IV access fails: upper limb intraosseous access",
        "Fluids: 500 mL IV crystalloid bolus",
        "Atropine 0.5–1 mg IV (up to 3 mg) if vagal tone is the likely cause",
        "Calcium chloride 10%, 10 mL IV, for magnesium overdose, low calcium or hyperkalaemia",
        "Magnesium: 2 g IV for polymorphic VT/hypomagnesaemia, 4 g IV for eclampsia",
        "Tranexamic acid 1 g if haemorrhage; thrombolysis/PCI if suspected massive PE or MI",
        "Intralipid 1.5 mL/kg IV bolus then 15 mL/kg/hr infusion, if local anaesthetic toxicity",
        "Consider extracorporeal CPR (ECPR) if available",
      ],
      next: "gestation-check",
    },

    "gestation-check": {
      type: "decision",
      title: "Gestation ≥20 weeks, or uterus at/above the umbilicus?",
      text: "This decides whether perimortem caesarean section is indicated.",
      options: [
        { label: "Yes", sublabel: "≥20 weeks or uterus palpable at/above umbilicus", next: "pmcs" },
        { label: "No", sublabel: "<20 weeks", next: "continue-resus-under20" },
      ],
    },

    "pmcs": {
      type: "alert",
      title: "Emergency hysterotomy (perimortem caesarean section)",
      text: "No response to correctly performed CPR within 4 minutes of collapse, or resuscitation continuing beyond this — perform PMCS. Aim to complete delivery within 5 minutes of collapse.",
      items: [
        "Do not delay by moving the woman — perform where the collapse and resuscitation are taking place",
        "Use whichever incision gives the most rapid access: midline vertical or suprapubic transverse",
        "Only a scalpel and umbilical cord clamps are required",
        "No anaesthesia needed if there is no circulation",
      ],
      next: "post-resus",
    },

    "continue-resus-under20": {
      type: "action",
      title: "Continue CPR and the standard ALS algorithm",
      text: "Below 20 weeks there is no proven benefit from delivering the fetus and placenta.",
      items: [
        "Continue chest compressions, ventilation and drug cycle as above",
        "Keep reassessing rhythm every 2 minutes",
      ],
      next: "post-resus",
    },

    "post-resus": {
      type: "end",
      title: "Post-resuscitation care",
      text: "Ongoing management depends on the underlying cause.",
      items: [
        "If haemorrhage: activate the Massive Haemorrhage Protocol — uterotonics, fibrinogen, tranexamic acid; consider uterine tamponade/sutures, aortic compression, hysterectomy",
        "Transfer to a high dependency or critical care area with an adequately skilled team",
        "Accurate documentation; clinical incident form; report all maternal deaths to MBRRACE-UK",
        "Debrief the woman (if alive), her family, and all staff involved",
      ],
    },

  },
};
