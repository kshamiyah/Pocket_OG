export const GTG69_SECTIONS = [
  {
    id: "gtg69-overview", gl: "GTG69", condition: "Nausea & Vomiting of Pregnancy", setting: "Overview & PUQE Score",
    title: "NVP & HG — Overview and PUQE Scoring",
    tags: ["nausea vomiting pregnancy","nvp","hyperemesis gravidarum","hg","puqe","pregnancy unique quantification of emesis","mild","moderate","severe","first trimester","90%","0.3%","quality of life"],
    content: [
      { type: "subheading", value: "Overview" },
      { type: "text", value: "Nausea and vomiting of pregnancy (NVP) affects up to 90% of pregnant women. Hyperemesis gravidarum (HG) is the severe end of the spectrum, affecting 0.3–3.6% of pregnancies, and is one of the most common reasons for hospital admission in the first trimester." },
      { type: "list", items: [
        "NVP typically starts at 4–7 weeks and resolves by 16–20 weeks in most women",
        "NVP defined as nausea ± vomiting with onset before 16 weeks and no other identifiable cause",
        "HG: severe NVP with weight loss >5% of pre-pregnancy weight, dehydration, and electrolyte disturbance",
        "HG has significant psychological impact — rates of depression, PTSD, and pregnancy termination are high",
      ]},
      { type: "subheading", value: "PUQE Score (Pregnancy-Unique Quantification of Emesis)" },
      { type: "text", value: "The PUQE score quantifies NVP severity using 3 questions about the past 24 hours. Each question is scored 1–5; total score 3–15." },
      { type: "table", headers: ["Question", "Score 1", "Score 2", "Score 3", "Score 4", "Score 5"], rows: [
        ["Hours of nausea/day", "≤1 h", "1–3 h", "3–6 h", "6–9 h", ">9 h"],
        ["Vomiting episodes/day", "None", "1–2", "3–4", "5–6", ">6"],
        ["Retching episodes/day", "None", "1–2", "3–4", "5–6", ">6"],
      ]},
      { type: "table", headers: ["Total Score", "Severity", "Management Setting"], rows: [
        ["3–6", "Mild NVP", "Community / self-care"],
        ["7–12", "Moderate NVP", "Day care / ambulatory review"],
        ["≥13", "Severe NVP / Hyperemesis gravidarum", "Inpatient admission"],
      ]},
      { type: "alert", value: "PUQE is a guide — clinical assessment (weight, ketones, electrolytes) always takes precedence. A low PUQE with significant weight loss or electrolyte disturbance still warrants admission." },
    ]
  },
  {
    id: "gtg69-assessment", gl: "GTG69", condition: "Nausea & Vomiting of Pregnancy", setting: "Assessment & Admission Criteria",
    title: "NVP & HG — Assessment & Admission Criteria",
    tags: ["assessment","admission","dehydration","ketonuria","ketones","weight loss","electrolytes","hypokalaemia","hyponatraemia","dipstick","wernicke","thiamine","bloods","urine"],
    content: [
      { type: "subheading", value: "Initial Assessment" },
      { type: "list", items: [
        "Weight — compare with pre-pregnancy or booking weight (>5% loss is significant)",
        "Urine dipstick — ketonuria (2+ or more suggests significant dehydration and starvation)",
        "Blood pressure and pulse — tachycardia indicates dehydration",
        "Mucous membranes — signs of dehydration",
        "PUQE score calculation",
      ]},
      { type: "subheading", value: "Bloods (If Moderate or Severe)" },
      { type: "list", items: [
        "FBC (raised haematocrit suggests haemoconcentration)",
        "U&E — hypokalaemia and hyponatraemia are common in HG",
        "LFTs — transaminase elevation in up to 50% of HG (usually mild and transient)",
        "TFTs (thyroid function) — gestational transient thyrotoxicosis in up to 60% of HG; usually resolves spontaneously; propylthiouracil only if hyperthyroid symptoms are severe",
        "Urine MC&S — to exclude UTI as a cause",
      ]},
      { type: "subheading", value: "Admission Criteria" },
      { type: "list", items: [
        "Weight loss >5% of pre-pregnancy body weight",
        "Inability to keep down oral fluids or antiemetics",
        "Ketonuria 2+ or more on dipstick",
        "Significant electrolyte disturbance (Na+ <130 mmol/L, K+ <3.0 mmol/L)",
        "Suspected Wernicke's encephalopathy (confusion, ataxia, ophthalmoplegia)",
        "Social circumstances preventing adequate self-care",
      ]},
    ]
  },
  {
    id: "gtg69-antiemetics", gl: "GTG69", condition: "Nausea & Vomiting of Pregnancy", setting: "Antiemetic Ladder",
    title: "NVP & HG — Antiemetic Management",
    tags: ["antiemetic","cyclizine","promethazine","metoclopramide","ondansetron","prochlorperazine","domperidone","pyridoxine","vitamin b6","ginger","first line","second line","dexamethasone","corticosteroid","prednisolone"],
    content: [
      { type: "subheading", value: "Non-Pharmacological (Mild NVP)" },
      { type: "list", items: [
        "Small frequent meals — avoid large meals, fatty/spicy foods",
        "Ginger (capsules, biscuits, tea) — modest evidence of benefit",
        "Pyridoxine (vitamin B6) 10–25 mg TDS — safe and modestly effective",
        "Rest and avoid triggers",
        "Acupressure (P6 wristband) — low-quality evidence but harmless",
      ]},
      { type: "subheading", value: "First-Line Antiemetics" },
      { type: "list", items: [
        "Cyclizine 50 mg PO/IV/IM TDS — safe, well tolerated, antihistamine",
        "Promethazine 12.5–25 mg PO/IV/IM QDS — good evidence; sedating (useful at night)",
        "Prochlorperazine 5–10 mg PO TDS, or 12.5 mg IM — phenothiazine; available as buccal (Buccastem 3 mg)",
      ]},
      { type: "subheading", value: "Second-Line Antiemetics" },
      { type: "list", items: [
        "Metoclopramide 10 mg PO/IV/IM TDS (max 5 days continuous) — effective but tardive dyskinesia risk with prolonged use",
        "Domperidone 10 mg PO TDS — avoid >1 week due to QTc prolongation risk",
        "Ondansetron 4–8 mg PO/IV BD–TDS — effective; recent evidence (2022) suggests no significant teratogenicity risk at therapeutic doses; some centres use routinely in refractory HG",
      ]},
      { type: "subheading", value: "Refractory HG (Third-Line)" },
      { type: "list", items: [
        "Chlorpromazine 25 mg IM/IV — use only if other agents failed",
        "Hydrocortisone 100 mg IV BD / Prednisolone 40–50 mg PO OD — evidence supports short-term use in refractory HG; taper slowly",
        "Note: corticosteroids in first trimester — small association with cleft palate (counsel patient)",
        "Enteral nutrition (NG feed): if weight loss >10% or inadequate intake despite antiemetics",
      ]},
      { type: "alert", value: "Do NOT prescribe doxylamine in the UK — not licensed. Avoid prolonged (>5 days) metoclopramide monotherapy without specialist review." },
    ]
  },
  {
    id: "gtg69-fluids", gl: "GTG69", condition: "Nausea & Vomiting of Pregnancy", setting: "IV Fluids & Thiamine",
    title: "NVP & HG — IV Fluid Management & Thiamine",
    tags: ["iv fluids","hartmanns","saline","normal saline","dextrose","glucose","thiamine","pabrinex","wernicke","electrolytes","potassium","rehydration","hypokalaemia"],
    content: [
      { type: "alert", value: "NEVER administer dextrose (glucose-containing) IV fluids before thiamine (Pabrinex) in a woman with prolonged vomiting. Glucose administration precipitates Wernicke's encephalopathy in thiamine-deficient women." },
      { type: "subheading", value: "IV Thiamine (Pabrinex) — Give First" },
      { type: "list", items: [
        "Pabrinex (thiamine-containing IV vitamins) should be given before any glucose-containing fluids",
        "Dose: Pabrinex 2 pairs (1 vial of component I + 1 vial of component II) IV in 100 ml NaCl over 30 min",
        "Repeat if symptoms of Wernicke's or if admission >48 hours",
        "Oral thiamine 25–50 mg TDS: for outpatient supplementation in women at risk (prolonged vomiting)",
      ]},
      { type: "subheading", value: "IV Fluid Choice" },
      { type: "list", items: [
        "Hartmann's solution (lactated Ringer's): first choice — physiological, corrects metabolic alkalosis",
        "0.9% saline with potassium: use if significant hypokalaemia",
        "Avoid dextrose-only or glucose-saline in initial resuscitation until thiamine given",
        "Rate: 1 L over 4 hours initially, then reassess",
      ]},
      { type: "subheading", value: "Electrolyte Replacement" },
      { type: "list", items: [
        "Potassium: add 20–40 mmol KCl per litre if K+ <3.5 mmol/L (max 40 mmol/L peripherally, max 10 mmol/hr)",
        "Sodium: hyponatraemia (<130 mmol/L) — seek specialist advice; avoid rapid correction (risk of central pontine myelinolysis)",
        "Phosphate: severe HG can deplete phosphate — check and replace if low",
        "Monitor U&E every 24 hours while on IV fluids",
      ]},
      { type: "subheading", value: "VTE Prophylaxis" },
      { type: "list", items: [
        "All hospitalised women with HG have increased VTE risk (dehydration + immobility)",
        "Prescribe LMWH (enoxaparin) as per VTE risk assessment — start on admission",
        "TED stockings when mobile",
      ]},
    ]
  },
  {
    id: "gtg69-complications", gl: "GTG69", condition: "Nausea & Vomiting of Pregnancy", setting: "Complications",
    title: "NVP & HG — Wernicke's Encephalopathy & Complications",
    tags: ["wernicke","encephalopathy","thiamine deficiency","ataxia","ophthalmoplegia","confusion","nystagmus","korsakoff","ptyalism","oesophageal rupture","mallory weiss","pneumothorax","fetal outcomes"],
    content: [
      { type: "alert", value: "Wernicke's encephalopathy is rare but life-threatening. It can occur after as little as 3–4 weeks of severe vomiting. Early recognition and high-dose IV thiamine are essential." },
      { type: "subheading", value: "Wernicke's Encephalopathy" },
      { type: "list", items: [
        "Classic triad: confusion, ataxia, ophthalmoplegia (but all three present in <20% of cases)",
        "Other features: nystagmus, peripheral neuropathy, hypotension",
        "If suspected: give high-dose Pabrinex 2 pairs IV TDS × 3 days, then OD until oral intake established",
        "MRI brain if diagnosis uncertain",
        "Can progress to Korsakoff's syndrome (irreversible amnesia) if untreated",
      ]},
      { type: "subheading", value: "Other Complications" },
      { type: "list", items: [
        "Mallory-Weiss oesophageal tear: haematemesis after prolonged retching — usually self-limiting; endoscopy if significant bleeding",
        "Pneumomediastinum / oesophageal rupture (Boerhaave syndrome): rare; suspect if severe chest pain after vomiting",
        "Ptyalism (excessive salivation): common in HG; can be debilitating; no specific treatment",
        "Muscle weakness, peripheral neuropathy: thiamine or B12 deficiency with prolonged illness",
      ]},
      { type: "subheading", value: "Fetal and Pregnancy Outcomes" },
      { type: "list", items: [
        "NVP and HG are NOT associated with miscarriage (rate is similar or lower in NVP)",
        "HG: no consistent evidence of structural fetal abnormality from anti-emetics at therapeutic doses",
        "Severe HG with weight loss >5 kg: small increased risk of SGA and preterm birth",
        "Ondansetron: some meta-analyses show very small risk of cardiac defects, but absolute risk low — counsel and document",
      ]},
      { type: "subheading", value: "Psychological Impact" },
      { type: "list", items: [
        "Up to 50% of women with HG report significant depression or anxiety",
        "Termination of pregnancy for HG is not uncommon — explore and support all options",
        "Refer to perinatal mental health team if required",
        "Peer support: Pregnancy Sickness Support (PSS) helpline",
      ]},
    ]
  },
];
