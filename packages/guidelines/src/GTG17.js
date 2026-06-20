export const GTG17_SECTIONS = [
  {
    id: "gtg17-overview", gl: "GTG17", condition: "Recurrent Miscarriage", setting: "Overview & Definition",
    title: "Recurrent Miscarriage — Overview & Definition",
    tags: ["recurrent miscarriage","rm","rpl","recurrent pregnancy loss","three consecutive","two consecutive","spontaneous","first trimester","second trimester","prevalence","1%","2%","antiphospholipid","aps","chromosomal"],
    content: [
      { type: "subheading", value: "Definition" },
      { type: "list", items: [
        "RCOG (GTG17): 3 or more consecutive pregnancy losses before 24 weeks of gestation",
        "ESHRE / ASRM: 2 or more pregnancy losses (increasingly adopted clinically)",
        "Affects approximately 1% of couples trying to conceive",
        "Secondary recurrent miscarriage: RM after a previous live birth",
      ]},
      { type: "subheading", value: "Aetiology" },
      { type: "table", headers: ["Cause", "Approximate Frequency", "Notes"], rows: [
        ["Antiphospholipid syndrome (APS)", "15%", "Most important treatable cause — screen all couples"],
        ["Parental chromosomal anomaly", "3–5%", "Balanced translocation or inversion — refer for genetic counselling"],
        ["Uterine anomaly", "10–15%", "Septate uterus most common; may be amenable to surgical correction"],
        ["Thrombophilia (inherited)", "Controversial", "Heterozygous factor V Leiden, prothrombin gene mutation — association debated"],
        ["Unexplained", "~50%", "Prognosis relatively good with supportive care; live birth rate ~65%"],
      ]},
      { type: "subheading", value: "Investigations" },
      { type: "list", items: [
        "Antiphospholipid antibodies: lupus anticoagulant (LA), anticardiolipin (aCL IgG + IgM), anti-β2 glycoprotein-1 — test twice, 12 weeks apart",
        "Parental karyotype: both partners (identify balanced translocations)",
        "Uterine assessment: transvaginal ultrasound (TVS) ± saline infusion sonohysterography (SIS) or hysteroscopy",
        "Thyroid function (TSH): treat hypothyroidism; TPO antibodies associated with RM",
        "Thrombophilia screen: consider if personal/family history of VTE; do NOT routinely screen all",
      ]},
      { type: "alert", value: "Products of conception (POC) from the 3rd or subsequent miscarriage should be sent for cytogenetic analysis — identifies chromosomally abnormal pregnancies which carry better prognosis for future pregnancies." },
    ]
  },
  {
    id: "gtg17-aps", gl: "GTG17", condition: "Recurrent Miscarriage", setting: "Antiphospholipid Syndrome",
    title: "Recurrent Miscarriage — Antiphospholipid Syndrome (APS)",
    tags: ["antiphospholipid","aps","lupus anticoagulant","anticardiolipin","anti-beta2","la","acl","aspirin","lmwh","heparin","low molecular weight","75mg","treatment","sapporo","revised sapporo"],
    content: [
      { type: "subheading", value: "APS Diagnostic Criteria (Revised Sapporo / Sydney)" },
      { type: "text", value: "APS is diagnosed when at least one clinical AND one laboratory criterion are met." },
      { type: "subheading", value: "Clinical Criteria" },
      { type: "list", items: [
        "Vascular thrombosis: 1 or more episodes of arterial, venous, or small vessel thrombosis",
        "Pregnancy morbidity: 3+ unexplained consecutive first-trimester miscarriages (<10 weeks), OR",
        "1+ unexplained fetal death ≥10 weeks (morphologically normal fetus), OR",
        "1+ premature birth <34 weeks due to severe pre-eclampsia, eclampsia, or placental insufficiency",
      ]},
      { type: "subheading", value: "Laboratory Criteria (must be positive on 2 occasions ≥12 weeks apart)" },
      { type: "list", items: [
        "Lupus anticoagulant (LA) — detected by clotting-based assay",
        "Anticardiolipin antibody (aCL) IgG or IgM: medium-high titre (>40 GPL or MPL, or >99th percentile)",
        "Anti-β2 glycoprotein-1 antibody (IgG or IgM): >99th percentile",
      ]},
      { type: "subheading", value: "Treatment in Pregnancy" },
      { type: "list", items: [
        "Aspirin 75 mg OD: start before conception or as soon as pregnancy confirmed",
        "LMWH (e.g., enoxaparin 40 mg SC OD): add once fetal cardiac activity confirmed on TVS",
        "Combined aspirin + LMWH: live birth rate ~70% (vs ~40% with aspirin alone)",
        "Continue LMWH to 6 weeks postnatally: APS carries elevated VTE risk in the postpartum period",
        "Do NOT use unfractionated heparin routinely — LMWH preferred",
        "Hydroxychloroquine: consider in SLE with APS",
      ]},
      { type: "alert", value: "Aspirin + LMWH is the standard of care for obstetric APS. Higher intensity anticoagulation (therapeutic LMWH or warfarin) is reserved for women with prior thrombosis." },
    ]
  },
  {
    id: "gtg17-uterine", gl: "GTG17", condition: "Recurrent Miscarriage", setting: "Uterine & Genetic Causes",
    title: "Recurrent Miscarriage — Uterine Anomalies & Genetics",
    tags: ["uterine anomaly","septate","arcuate","bicornuate","unicornuate","hysteroscopy","metroplasty","septum","chromosomal","balanced translocation","preimplantation genetic testing","pgt","ivf"],
    content: [
      { type: "subheading", value: "Uterine Anomalies" },
      { type: "list", items: [
        "Prevalence in RM: ~10–15%; most common anomaly is septate uterus",
        "Diagnose with 3D TVS, SIS/SHG, or hysteroscopy + laparoscopy",
        "Septate uterus: hysteroscopic metroplasty — good evidence for improving live birth rate",
        "Submucous fibroids: hysteroscopic myomectomy if ≥1 cm distorting cavity",
        "Endometrial polyps: hysteroscopic polypectomy",
        "Bicornuate / unicornuate uterus: reproductive outcomes are less clear; surgical correction not well-evidenced",
        "Cervical weakness (insufficiency): consider cervical cerclage in second-trimester losses with cervical shortening",
      ]},
      { type: "subheading", value: "Parental Chromosomal Anomalies" },
      { type: "list", items: [
        "Offer karyotype of both partners after 3+ miscarriages (or earlier if clinical suspicion)",
        "Balanced reciprocal or Robertsonian translocation: ~3–5% of RM couples",
        "Refer to clinical genetics if translocation identified — live birth rate ~50% (vs 65% in unexplained RM)",
        "Preimplantation genetic testing (PGT-A / PGT-SR): consider in translocation carriers — discuss with tertiary unit",
      ]},
      { type: "subheading", value: "Chromosomal Analysis of Products of Conception (POC)" },
      { type: "list", items: [
        "Aneuploidy accounts for ~50–60% of sporadic miscarriages",
        "If POC chromosomally abnormal: prognosis for future pregnancies is better",
        "If POC chromosomally normal: greater importance of investigating maternal causes",
        "Store POC in dry pot (not formalin) for cytogenetics — or use chorionic villi with array CGH",
      ]},
    ]
  },
  {
    id: "gtg17-unexplained", gl: "GTG17", condition: "Recurrent Miscarriage", setting: "Unexplained RM & Future Pregnancy",
    title: "Recurrent Miscarriage — Unexplained RM & Prognosis",
    tags: ["unexplained","prognosis","live birth","supportive care","tommy's","pregnancy support","progesterone","dydrogesterone","prometrium","mifepristone","counselling","age","number of miscarriages"],
    content: [
      { type: "subheading", value: "Prognosis in Unexplained RM" },
      { type: "table", headers: ["Number of Previous Miscarriages", "Age <35", "Age 35–39", "Age ≥40"], rows: [
        ["3", "~65%", "~50%", "~35%"],
        ["4", "~60%", "~45%", "~25%"],
        ["5+", "~55%", "~35%", "~20%"],
      ]},
      { type: "subheading", value: "Management of Unexplained RM" },
      { type: "list", items: [
        "Supportive care in early pregnancy unit: early TVS scans and emotional support improve outcomes",
        "Progesterone (micronised vaginal progesterone 400 mg BD): PRISM trial suggests benefit if ≥1 previous miscarriage + early pregnancy bleeding; PROMISE trial showed no benefit in unexplained RM without bleeding",
        "Dydrogesterone (Duphaston) 10 mg BD: emerging evidence; consider in selected cases",
        "Do NOT routinely offer: LMWH alone (without APS), aspirin alone, prednisolone, intravenous immunoglobulin, or paternal cell immunisation",
        "Vitamin supplementation: folic acid 5 mg OD (standard recommendation); no proven benefit from additional supplements",
      ]},
      { type: "subheading", value: "Psychological Support" },
      { type: "list", items: [
        "Recurrent miscarriage causes significant grief, anxiety, and depression — address at every consultation",
        "Refer to specialist recurrent miscarriage clinic (Tommy's, local RPL clinic)",
        "Peer support: Tommy's Midwives helpline, Sands, Miscarriage Association",
        "Psychological therapy: CBT or counselling if anxiety/depression",
        "Subsequent pregnancy: early TVS at 6+0 and 8+0 weeks (or upon symptoms) to confirm viability",
      ]},
      { type: "alert", value: "There is currently no evidence that routine HLA testing, natural killer cell testing, or immunological treatments improve live birth rates in unexplained recurrent miscarriage — avoid offering outside clinical trials." },
    ]
  },
];
