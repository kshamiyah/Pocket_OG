export const GTG31_SECTIONS = [
  {
    id: "gtg31-overview", gl: "GTG31", condition: "SGA & Fetal Growth Restriction", setting: "Overview & Definitions",
    title: "SGA/FGR — Definitions & Risk Factors",
    tags: ["sga","small for gestational age","fgr","fetal growth restriction","10th centile","3rd centile","5th centile","efw","ac","abdominal circumference","biometry","placental insufficiency","stillbirth"],
    content: [
      { type: "subheading", value: "Definitions" },
      { type: "list", items: [
        "Small for Gestational Age (SGA): EFW or AC below the 10th centile for gestational age",
        "Severe SGA: EFW or AC below the 3rd centile",
        "Fetal Growth Restriction (FGR): SGA + evidence of placental insufficiency (abnormal Dopplers, liquor reduction)",
        "Constitutional SGA: small but normally grown fetus, normal Doppler studies — no increased perinatal risk",
        "AGA (appropriate for gestational age): EFW/AC 10th–90th centile",
      ]},
      { type: "subheading", value: "Risk Factors for Placental SGA/FGR" },
      { type: "table", headers: ["Category", "Specific Risk Factors"], rows: [
        ["Maternal", "Previous SGA baby, previous stillbirth, smoking, cocaine use, age >40, BMI <18.5 or >35, autoimmune disease (SLE, APS)"],
        ["Medical", "Pre-existing hypertension, diabetes with vascular disease, chronic kidney disease, thrombophilia"],
        ["Uterine / Placental", "Uterine anomaly, uterine artery notching on Doppler, placenta praevia, velamentous cord insertion"],
        ["Pregnancy", "Multiple pregnancy, pre-eclampsia, abnormal first-trimester serum screening (low PAPP-A)"],
      ]},
      { type: "subheading", value: "Uterine Artery Doppler Screening" },
      { type: "list", items: [
        "Offer uterine artery Doppler at 20–24 weeks if high-risk (previous SGA, PE, abruption, stillbirth)",
        "Bilateral notching or high resistance index (RI >0.58) at 24 weeks: increased risk of late SGA/PE",
        "Abnormal uterine artery Doppler: refer for consultant-led care; increase surveillance frequency",
        "Consider aspirin 75–150 mg OD from 12 weeks to reduce pre-eclampsia and SGA risk in high-risk women",
      ]},
      { type: "alert", value: "All women with a SGA fetus should be managed in a consultant-led unit with access to fetal medicine expertise and neonatal care." },
    ]
  },
  {
    id: "gtg31-surveillance", gl: "GTG31", condition: "SGA & Fetal Growth Restriction", setting: "Surveillance Protocol",
    title: "SGA/FGR — Doppler Surveillance Categories",
    tags: ["doppler","umbilical artery","mca","middle cerebral artery","ductus venosus","dv","absent end diastolic flow","aedf","reversed end diastolic flow","redf","biophysical profile","bpp","liquor","amniotic fluid","surveillance","serial growth scan"],
    content: [
      { type: "subheading", value: "Surveillance Framework" },
      { type: "text", value: "The severity of surveillance is determined by centile and Doppler findings. Serial growth scans and Doppler studies guide management and timing of delivery." },
      { type: "table", headers: ["Category", "Criteria", "Surveillance"], rows: [
        ["Minor SGA", "AC/EFW 5th–10th centile, normal UA Doppler", "Growth scan every 2 weeks; UA Doppler fortnightly; delivery at 37+0"],
        ["Major SGA", "AC/EFW <5th centile, normal UA Doppler", "Growth + UA Doppler every 2 weeks; MCA at 34 weeks; delivery at 37+0"],
        ["Abnormal UA (PI >95th centile)", "AC/EFW <10th centile + high UA resistance", "Weekly growth + Doppler; consider MCA; CTG 2–3× per week; delivery 37+0"],
        ["AEDF (Absent End Diastolic Flow)", "UA with absent diastolic flow", "Admit or very close outpatient; daily CTG; DV Doppler 2–3× weekly; deliver ≥34 weeks"],
        ["REDF (Reversed End Diastolic Flow)", "UA with reversed diastolic flow", "Admit; daily CTG + DV Doppler; deliver ≥32 weeks or sooner if DV abnormal"],
      ]},
      { type: "subheading", value: "Middle Cerebral Artery (MCA) Doppler" },
      { type: "list", items: [
        "MCA pulsatility index (PI): assess brain-sparing — MCA PI <5th centile suggests brain sparing (redistribution)",
        "Cerebroplacental ratio (CPR = MCA PI / UA PI) <1.0 at term: associated with adverse outcome",
        "Use MCA / DV in major SGA from 34 weeks to guide timing of delivery",
      ]},
      { type: "subheading", value: "Ductus Venosus (DV) Doppler" },
      { type: "list", items: [
        "DV assessment is the key tool in pre-viable and very preterm FGR",
        "Absent or reversed 'a' wave in DV: indicates impending cardiac decompensation — deliver urgently",
        "DV PI for veins >95th centile: escalate urgency of delivery planning",
      ]},
      { type: "alert", value: "CTG is NOT a substitute for Doppler surveillance in SGA/FGR — normal CTG does not exclude significant compromise in a fetus with abnormal Dopplers." },
    ]
  },
  {
    id: "gtg31-delivery", gl: "GTG31", condition: "SGA & Fetal Growth Restriction", setting: "Delivery Timing",
    title: "SGA/FGR — Timing and Mode of Delivery",
    tags: ["delivery","timing","37 weeks","32 weeks","34 weeks","corticosteroids","magnesium sulphate","induction","caesarean section","mode","iol","cs","neonatal","nicu","icu","admission"],
    content: [
      { type: "subheading", value: "Delivery Timing by Doppler Category" },
      { type: "table", headers: ["Category", "Gestation for Delivery"], rows: [
        ["Minor SGA (5th–10th centile), normal Doppler", "Deliver at 37+0 weeks"],
        ["Major SGA (<5th centile), normal Doppler", "Deliver at 37+0 weeks"],
        ["SGA + abnormal UA PI (>95th centile)", "Consider delivery at 37+0; discuss with fetal medicine"],
        ["SGA + AEDF", "Deliver at 34+0 weeks (or earlier if other deterioration)"],
        ["SGA + REDF", "Deliver at 30–32 weeks; DV or biophysical profile to guide timing"],
        ["DV absent/reversed 'a' wave", "Deliver immediately (regardless of gestation, with parental counselling)"],
      ]},
      { type: "subheading", value: "Pre-Delivery Preparation" },
      { type: "list", items: [
        "Antenatal corticosteroids: offer if delivery planned <34+6 weeks (betamethasone 12 mg IM × 2, 24 h apart)",
        "Magnesium sulphate: offer if <30+0 weeks for neuroprotection (4 g IV loading, 1 g/hr maintenance)",
        "In-utero transfer: arrange if NICU level 3 not available locally",
      ]},
      { type: "subheading", value: "Mode of Delivery" },
      { type: "list", items: [
        "Normal Dopplers: vaginal birth is appropriate — offer IOL at 37+0",
        "AEDF/REDF: caesarean section is generally recommended (high risk of intrapartum compromise)",
        "If vaginal birth attempted with abnormal Dopplers: continuous CTG mandatory; low threshold for LSCS",
        "Neonatal team must be present at all deliveries of SGA fetuses <34 weeks",
      ]},
      { type: "alert", value: "Where there is severe SGA with REDF and gestation is ≤28 weeks, decisions on delivery must involve senior obstetrician, neonatologist, and parents — risks of extreme prematurity vs. fetal compromise must be carefully balanced." },
    ]
  },
  {
    id: "gtg31-postnatal", gl: "GTG31", condition: "SGA & Fetal Growth Restriction", setting: "Postnatal & Future Pregnancy",
    title: "SGA/FGR — Postnatal Care & Recurrence Risk",
    tags: ["postnatal","neonatal","hypoglycaemia","hypothermia","nec","necrotising enterocolitis","polycythaemia","recurrence","next pregnancy","aspirin","future pregnancy","thrombophilia","antiphospholipid"],
    content: [
      { type: "subheading", value: "Immediate Neonatal Care" },
      { type: "list", items: [
        "Hypoglycaemia: SGA neonates are at high risk — early feeding, blood glucose monitoring protocol",
        "Hypothermia: maintain normothermia; use warmed environment and plastic wrap if very preterm",
        "Polycythaemia: common in SGA — monitor haematocrit; dilutional exchange transfusion if symptomatic",
        "Necrotising enterocolitis (NEC): increased risk especially in growth-restricted preterm neonates",
        "Cord blood samples: send FBC, blood gas, chromosomes if dysmorphic features",
      ]},
      { type: "subheading", value: "Postpartum Investigations" },
      { type: "list", items: [
        "Placental examination by histopathology — helpful to confirm or exclude placental pathology",
        "Thrombophilia screen: if previous unexplained SGA or stillbirth — screen mother for APS, thrombophilia",
        "Karyotype: if dysmorphic or structural fetal abnormality was suspected antenatally",
        "Investigate for TORCH infections if early-onset FGR (<20 weeks)",
      ]},
      { type: "subheading", value: "Recurrence Risk & Future Pregnancy" },
      { type: "list", items: [
        "Previous SGA: recurrence risk ~25% — offer uterine artery Doppler at 20–24 weeks in future pregnancies",
        "Aspirin 75–150 mg OD from 12 weeks: recommended if previous SGA with placental insufficiency",
        "Postnatal debrief with consultant: discuss cause, recurrence risk, and future pregnancy management",
        "Long-term maternal health: SGA with placental dysfunction is associated with increased lifetime cardiovascular risk",
      ]},
    ]
  },
];
