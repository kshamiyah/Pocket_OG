export const GL783_SECTIONS = [
  {
    id: "ida-diagnosis", gl: "GL783", condition: "Iron Deficiency Anaemia", setting: "Diagnosis & Thresholds",
    title: "Iron Deficiency Anaemia — Diagnosis & Management Overview",
    tags: ["anaemia","iron deficiency","ida","haemoglobin","ferritin","mcv","mch","transferrin saturation","thalassaemia","sickle cell","haemoglobinopathy","110","105","15","30","25","80","threshold","booking bloods","16 weeks","28 weeks","34 weeks"],
    content: [
      { type: "subheading", value: "Diagnostic Thresholds (in absence of other diagnosis)" },
      { type: "table", headers: ["Measure", "Threshold"], rows: [
        ["Haemoglobin — 1st trimester", "< 110 g/L"],
        ["Haemoglobin — 2nd & 3rd trimester", "< 105 g/L"],
        ["Serum Ferritin", "< 15 µg/L (most reliable test; consider oral iron if < 30 µg/L)"],
        ["MCH", "< 25 pg"],
        ["MCV", "< 80 fl"],
        ["Transferrin saturation", "< 15%"],
      ]},
      { type: "alert", value: "Patients with Thalassaemia or Sickle Cell Disease should NEVER routinely receive iron therapy (oral or IV). Refer to haematologist." },
      { type: "subheading", value: "Monitoring Schedule" },
      { type: "list", items: [
        "Recheck Hb at 16 weeks if on oral iron — if no improvement, check compliance; if compliant, check red cell folate & B12, refer to secondary care",
        "Recheck Hb at 28 weeks — start oral iron if Hb < 105 g/L",
        "Repeat Hb and ferritin at 34 weeks in women with diagnosed IDA",
        "Consider IV iron over oral if Hb < 80 g/L with no increment on oral iron, or if > 34 weeks",
        "If Hb < 70 g/L — transfuse (aim to increase Hb to 70 g/L only; even 1 unit is sufficient)",
        "If postnatal Hb ≥ 70 g/L and symptomatic — give IV iron; if asymptomatic — start oral iron OD",
        "Routine iron supplementation is NOT recommended in pregnancy",
      ]},
    ]
  },
  {
    id: "ida-screening", gl: "GL783", condition: "Iron Deficiency Anaemia", setting: "Screening — At-Risk Groups",
    title: "IDA — Who to Screen with Ferritin at Booking",
    tags: ["ida","screening","at risk","ferritin","booking","multiparous","vegetarian","bariatric","ibd","coeliac","placenta praevia","accreta","jehovah witness","consecutive pregnancy","teenage","haemoglobinopathy","previous anaemia","bleeding","p3"],
    content: [
      { type: "subheading", value: "Known Anaemic Women — Ferritin at Booking" },
      { type: "list", items: [
        "Hb < 110 g/L at booking",
        "Known haemoglobinopathy (non-anaemic but high risk of iron depletion)",
        "Previous anaemia",
        "Multiparity P3 and above",
        "Consecutive pregnancy < 1 year following delivery",
        "Vegetarians / teenage pregnancies",
        "Recent history of bleeding",
        "Post-bariatric surgery (also check B12 and folate)",
        "History of inflammatory bowel disorder or coeliac disease",
      ]},
      { type: "subheading", value: "Non-Anaemic Women — Ferritin at Booking" },
      { type: "list", items: [
        "High risk of bleeding (Placenta Praevia, Placenta Accreta)",
        "Jehovah's Witness",
      ]},
      { type: "text", value: "Ensure FBC and Ferritin done at booking in above groups; check results within 7–10 days. Start oral iron if Hb < 110 g/L and/or Ferritin < 30 µg/L. Document baseline ferritin, Hb, start date and dose in clinical notes." },
    ]
  },
  {
    id: "ida-oral", gl: "GL783", condition: "Iron Deficiency Anaemia", setting: "Oral Iron Therapy",
    title: "IDA — Oral Iron Therapy",
    tags: ["oral iron","ferrous fumarate","ferrous sulphate","ferrous gluconate","feredetate","sytron","galfer","fefol","elemental iron","40mg","80mg","alternate days","once daily","absorption","dietary advice","tea","coffee","compliance","3 months","0.2 g/dl","rise"],
    content: [
      { type: "subheading", value: "Dosing Principle" },
      { type: "text", value: "Elemental iron 40–80 mg once daily or on alternate days. This reduces GI side effects and improves compliance. Hb should rise by 0.1–0.2 g/dL per day with adequate treatment. Continue for 3 months after Hb normalises to replenish stores." },
      { type: "subheading", value: "Oral Iron Preparations" },
      { type: "table", headers: ["Preparation", "Dose", "Elemental Iron"], rows: [
        ["Ferrous Fumarate", "200 mg OD / alternate days", "65 mg"],
        ["Ferrous Gluconate", "300 mg OD / alternate days", "35 mg"],
        ["Ferrous Sulphate", "200 mg OD / alternate days", "60 mg"],
        ["Ferrous Feredetate (Sytron)", "190 mg/5 mL elixir OD / alternate days", "27.5 mg/5 mL"],
        ["Galfer (Fe sulphate + folate)", "300 mg", "47 mg"],
        ["Fefol A (Fe fumarate + folate)", "305 mg", "100 mg"],
      ]},
      { type: "subheading", value: "Key Points" },
      { type: "list", items: [
        "Do NOT take oral iron after food or tea/coffee (decreases absorption)",
        "Provide dietary information verbally and in written form",
        "Pass on to community midwives and GPs to continue prescription postnatally",
        "Oral iron must be stopped 24 hours before IV iron infusion; do not restart for at least 5 days after last infusion",
      ]},
    ]
  },
  {
    id: "ida-iv", gl: "GL783", condition: "Iron Deficiency Anaemia", setting: "IV Iron — Ferinject",
    title: "IDA — IV Iron (Ferinject) — Indications & Dosing",
    tags: ["iv iron","intravenous iron","ferinject","ferric carboxymaltose","1000mg","ganzoni","dose calculation","moderate anaemia","powerplan","epr","100mg vials","antenatal","postnatal","blood transfusion","transfuse","70","80","100","ferinject dose","weight"],
    content: [
      { type: "subheading", value: "Indications" },
      { type: "list", items: [
        "Oral iron failed or unlikely to be effective (GI side effects, poor compliance)",
        "Rapid Hb increase required",
        "Moderate anaemia Hb 80–100 g/L due to iron deficiency — safer and more cost-effective than transfusion",
        "Asymptomatic Hb > 70 to < 80 g/L — consider IV iron over transfusion",
        "Hb < 70 g/L — transfuse (aim to increase Hb to 70 g/L only; even 1 unit is OK)",
        "Ensure Hb, ferritin, red cell folate & B12 checked within last 2 weeks before prescribing",
      ]},
      { type: "alert", value: "Ferinject maximum single dose = 1000 mg/week (15 mg/kg). Target Hb for dose calculation = 110 g/L." },
      { type: "subheading", value: "Ganzoni Formula" },
      { type: "text", value: "Cumulative iron deficit [mg] = 500 mg + (weight [kg] × (target Hb − actual Hb ÷ 10) × 2.4)\n\nExample: 70 kg, Hb 80 g/L → 500 + (70 × 3 × 2.4) = ~1004 mg → prescribe 1100 mg\n\n< 66 kg: round DOWN to nearest 100 mg. > 66 kg: round UP to nearest 100 mg." },
      { type: "subheading", value: "Dosage Table (number of 100 mg vials)" },
      { type: "table", headers: ["Weight (kg)", "Hb rise 10", "Hb rise 20", "Hb rise 30", "Hb rise 40", "Hb rise 50"], rows: [
        ["50 kg", "6", "7", "8", "9", "11"],
        ["60 kg", "6", "7", "9", "10", "12"],
        ["70 kg", "7", "9", "11", "12", "14"],
        ["80 kg", "7", "9", "11", "13", "15"],
        ["90 kg", "8", "10", "12", "14", "16"],
        ["100 kg", "8", "10", "13", "15", "17"],
      ]},
    ]
  },
  {
    id: "ida-admin", gl: "GL783", condition: "Iron Deficiency Anaemia", setting: "Ferinject Administration",
    title: "IDA — Ferinject Administration & Follow-up",
    tags: ["ferinject","administration","iv infusion","dilution","normal saline","infusion rate","15 minutes","6 minutes","50ml","100ml","250ml","anaphylaxis","hydrocortisone","chlorpheniramine","adrenaline","adverse reaction","side effects","headache","rash","dau","delivery suite","marsh","iffley","cannula","22 gauge","venflon","210 ml/hr","follow up","7 to 14 days","fbc","ferritin","postnatal 6 weeks"],
    content: [
      { type: "subheading", value: "Dilution & Administration Times" },
      { type: "table", headers: ["Dose", "Diluent (0.9% NaCl)", "Rate / Time"], rows: [
        ["100–200 mg", "50 mL", "Pump rate 210 mL/hr (no minimum time)"],
        ["200–500 mg", "100 mL", "Over 6 minutes"],
        ["500–1000 mg", "Up to 250 mL", "Over 15 minutes"],
      ]},
      { type: "subheading", value: "Procedure" },
      { type: "list", items: [
        "Can be prescribed by all doctors; administered by appropriately trained midwives",
        "Administer in DAU, Delivery Suite, or Marsh/Iffley Wards",
        "Insert 22G venflon (blue), take blood samples from cannula, flush with 2 mL Normal Saline",
        "Connect Ferinject infusion; infuse at pump rate 210 mL/hr",
        "Observe patient throughout for adverse events; remove cannula, apply pressure, extend and elevate arm after",
      ]},
      { type: "alert", value: "IV Chlorpheniramine, Hydrocortisone and Adrenaline must be available for immediate use in event of severe adverse drug reaction (included on Powerplan)." },
      { type: "subheading", value: "Common Side Effects" },
      { type: "list", items: ["Headache (3%)", "Gastrointestinal symptoms", "Rash", "Anaphylaxis — very rare"] },
      { type: "subheading", value: "Follow-up" },
      { type: "list", items: [
        "Repeat FBC 7–14 days after treatment — rise in MCV and MCH confirms iron uptake",
        "Further FBC 7 days later to confirm Hb improvement",
        "Check serum ferritin to assess iron stores",
        "FBC at 6-week postnatal visit at GP; continue oral iron 5 days after infusion until 6-week FBC",
        "Postnatal Ferinject: increases in Hb of 20–30 g/L by day 14 may be achieved",
      ]},
    ]
  },
];
