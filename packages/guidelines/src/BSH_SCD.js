// BSH_SCD — Management of Sickle Cell Disease in Pregnancy
// British Society for Haematology guideline (Oteng-Ntim E, Pavord S, Howard R,
// et al. Br J Haematol 2021;194(6):980-995, DOI 10.1111/bjh.17671). This
// supersedes the archived RCOG Green-top Guideline No. 61 (archived May 2023).
// Original Pocket O&G summary drawn from that guideline; verify against the
// full text and local protocol.

export const BSH_SCD_SECTIONS = [
  {
    id: "bsh-scd-preconception",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Preconception",
    title: "Preconception Care & Medication Review",
    tags: [
      "sickle cell pregnancy", "sickle cell preconception", "hbss pregnancy",
      "hydroxycarbamide pregnancy", "hydroxyurea pregnancy", "penicillin prophylaxis sickle",
      "folic acid sickle cell", "scd preconception", "partner screening haemoglobinopathy",
    ],
    content: [
      { type: "alert", value: "Sickle cell disease (SCD) in pregnancy is high risk: more frequent painful crises, and higher rates of pre-eclampsia, fetal growth restriction, VTE and stillbirth (around four times the background risk). Care should be shared between haematology and obstetrics, ideally starting before conception." },
      { type: "subheading", value: "Before conception" },
      { type: "list", items: [
        "Folic acid 5 mg daily, started when planning pregnancy and continued throughout.",
        "Continue or start penicillin prophylaxis, and review vaccination status: annual influenza vaccine, and pneumococcal vaccine if not given in the previous five years.",
        "Stop hydroxycarbamide when attempting to conceive (teratogenic); stop iron chelators (1B).",
        "Stop ACE inhibitors and ARBs (used for renal protection): switch to an antihypertensive with a pregnancy safety record rather than simply stopping.",
        "Offer partner testing and genetic counselling (up to a 50% risk of an affected/carrier infant if the partner carries a beta-globin variant), and discuss prenatal diagnosis.",
        "Screen for end-organ complications (retinal, renal, cardiac including pulmonary hypertension, and iron overload); monitor and replace vitamin D.",
      ]},
    ],
  },

  {
    id: "bsh-scd-antenatal",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Antenatal",
    title: "Antenatal Care & Monitoring",
    tags: [
      "sickle cell antenatal", "aspirin sickle cell", "lmwh sickle cell pregnancy",
      "growth scan sickle cell", "transfusion sickle cell pregnancy", "scd antenatal care",
    ],
    content: [
      { type: "list", items: [
        "Aspirin 75-150 mg daily from 12 weeks of gestation for pre-eclampsia prevention.",
        "Prophylactic LMWH during any antenatal hospital admission (1B). Consider prophylactic LMWH from 28 weeks until six weeks postpartum, and from early pregnancy if there are additional risk factors.",
        "Serial fetal biometry (growth) scans every four weeks from 24 weeks of gestation (1C), given the increased risk of growth restriction and stillbirth.",
        "Continue folic acid 5 mg daily and penicillin prophylaxis; keep vaccinations up to date.",
        "NSAIDs, if needed, only between 12 and 31 weeks (avoid before 12 weeks and after 31 weeks because of ductus arteriosus concerns).",
        "Multidisciplinary antenatal care with haematology; monitor for crises, infection, anaemia and pre-eclampsia.",
      ]},
      { type: "subheading", value: "Transfusion" },
      { type: "alert", value: "There is insufficient evidence to recommend routine prophylactic transfusion over transfusion as required (2C). Transfuse for symptomatic or severe anaemia and for acute SCD complications. Use extended-phenotype (Rh and Kell) matched blood and be alert to alloimmunisation." },
    ],
  },

  {
    id: "bsh-scd-crisis",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Acute / Emergency",
    title: "Acute Painful (Vaso-occlusive) Crisis",
    tags: [
      "sickle cell crisis pregnancy", "vaso-occlusive crisis pregnancy", "painful crisis sickle cell",
      "sickle cell pain management pregnancy", "pethidine sickle cell", "opioid sickle cell crisis",
    ],
    content: [
      { type: "alert", value: "Assess rapidly for medical complications and precipitants (infection, dehydration, hypoxia, acute chest syndrome). Take a full set of observations including oxygen saturations, and involve haematology early." },
      { type: "subheading", value: "Analgesia" },
      { type: "list", items: [
        "Give prompt, effective analgesia and reassess frequently; a woman with a severe crisis usually needs a strong opioid (e.g. morphine or diamorphine) by subcutaneous or intravenous route.",
        "Avoid pethidine because of the risk of toxicity and pethidine-associated seizures in SCD.",
        "NSAIDs may be used as an adjunct but only between 12 and 31 weeks of gestation.",
        "Anticipate and treat opioid adverse effects: antihistamine for itch, laxative for constipation, antiemetic for nausea.",
      ]},
      { type: "subheading", value: "Supportive care" },
      { type: "list", items: [
        "Maintain hydration, keep the woman warm, and give oxygen if saturations are low; encourage incentive spirometry.",
        "Prescribe prophylactic LMWH throughout the admission unless contraindicated.",
        "Actively look for and treat acute chest syndrome and infection.",
      ]},
    ],
  },

  {
    id: "bsh-scd-complications",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Acute / Emergency",
    title: "Acute Chest Syndrome & Other Complications",
    tags: [
      "acute chest syndrome pregnancy", "sickle cell chest crisis", "acute anaemia sickle cell",
      "splenic sequestration", "aplastic crisis parvovirus sickle cell", "sickle cell stroke pregnancy",
    ],
    content: [
      { type: "alert", value: "Acute chest syndrome affects up to 10% of pregnant women with SCD and is a medical emergency. It is characterised by fever and/or respiratory symptoms with a new pulmonary infiltrate on imaging." },
      { type: "list", items: [
        "Manage acute chest syndrome with oxygen, antibiotics, analgesia and urgent transfusion (simple or exchange), involving haematology and critical care.",
        "Acute anaemia: consider aplastic crisis (parvovirus B19) and splenic sequestration; both may need transfusion.",
        "Remain alert to infection, VTE, stroke and pulmonary hypertension, all of which are more common in SCD.",
      ]},
    ],
  },

  {
    id: "bsh-scd-intrapartum",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Intrapartum",
    title: "Intrapartum Care",
    tags: [
      "sickle cell delivery", "sickle cell labour", "delivery timing sickle cell",
      "sickle cell intrapartum", "cross match sickle cell",
    ],
    content: [
      { type: "list", items: [
        "Delivery between 38 and 40 weeks is often indicated to prevent late-pregnancy complications; offer delivery by 40 weeks if it has not occurred.",
        "Keep the woman warm and well hydrated, monitor oxygen saturations, and avoid hypoxia.",
        "Provide good analgesia with an anaesthetic plan made in advance; regional analgesia is appropriate.",
        "Use continuous fetal monitoring in labour.",
        "Cross-match extended-phenotype-matched blood, and continue thromboprophylaxis around delivery.",
      ]},
    ],
  },

  {
    id: "bsh-scd-postnatal",
    gl: "BSH_SCD",
    condition: "Sickle Cell Disease in Pregnancy",
    setting: "Postnatal",
    title: "Postnatal Care & Contraception",
    tags: [
      "sickle cell postnatal", "postnatal lmwh sickle cell", "contraception sickle cell",
      "hydroxycarbamide breastfeeding", "sickle cell postpartum",
    ],
    content: [
      { type: "list", items: [
        "Prescribe postnatal LMWH for at least six weeks, particularly if it was used antenatally or additional risk factors are present.",
        "Encourage early mobilisation, hydration and good oxygenation.",
        "Contraception: progestogen-only methods and long-acting reversible contraception are safe and effective; combined hormonal methods are usually avoided.",
        "Hydroxycarbamide is not recommended during breastfeeding; discuss restarting disease-modifying treatment with haematology.",
        "Continue folic acid and penicillin prophylaxis.",
      ]},
    ],
  },
];
