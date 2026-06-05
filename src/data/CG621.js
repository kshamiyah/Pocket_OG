export const CG621_SECTIONS = [
  {
    id: "mc-med-indications", gl: "CG621", condition: "Medical Management of Miscarriage", setting: "Indications & Contraindications",
    title: "Medical Management — Indications & Contraindications",
    tags: ["mifepristone","misoprostol","medical management","missed miscarriage","incomplete miscarriage","contraindications","indications","medical treatment","haemoglobin","pyrexia","molar","anticoagulant","iucd","coil","asthma","porphyria"],
    content: [
      { type: "subheading", value: "Indications" },
      { type: "list", items: ["Missed miscarriage — medical management should be offered as a treatment option in addition to expectant and surgical management (SMM)","Incomplete miscarriage — do not routinely offer (no advantage over expectant management); some women will have strong preference — discuss with consultant","Up to 14 weeks gestation (CRL ≤84mm)","Miscarriage between 14–16 weeks / CRL >84mm — manage as per Maternity care pathway for <24-week spontaneous loss"] },
      { type: "subheading", value: "Contraindications" },
      { type: "list", items: ["Haemodynamically unstable","Haemoglobin <10g/dl (bleeding risk)","Severe pain","Pyrexia >38°C (possible infected products of conception)","Suspected molar pregnancy","Anti-coagulant therapy (bleeding risk)","Clotting disorders (bleeding risk)","Porphyria","Mitral stenosis","Severe asthma","Chronic adrenal failure (not for Mifepristone)","IUCD in-situ — coil must be removed before administration of misoprostol"] },
    ]
  },
  {
    id: "mc-med-regimen", gl: "CG621", condition: "Medical Management of Miscarriage", setting: "Drug Regimen",
    title: "Mifepristone & Misoprostol — Drug Regimen",
    tags: ["mifepristone","misoprostol","dose","regimen","200mg","800mcg","600mcg","vaginal","oral","48 hours","drug treatment","side effects","nausea","diarrhoea","bleeding","cramping","off label","unlicensed"],
    content: [
      { type: "alert", value: "Dispense 200mg Mifepristone to take orally followed by 800µg Misoprostol (600µg if incomplete miscarriage) for the patient to administer vaginally at home 48 hours after Mifepristone." },
      { type: "subheading", value: "How the Drugs Work" },
      { type: "list", items: ["Both drugs are off-label (not licensed for this indication) — document this and obtain e-consent","Mifepristone is an anti-progestogenic steroid — sensitises the myometrium to prostaglandin-induced contractions and ripens the cervix","Misoprostol is a synthetic prostaglandin analogue — induces uterine contractions resulting in evacuation of uterine contents","Bleeding usually starts within 24 hours of medical management"] },
      { type: "subheading", value: "Side Effects" },
      { type: "list", items: ["Nausea and vomiting — resolve within 2–6 hours","Diarrhoea — resolves within 24 hours","Pyrexia and fever — resolves within 12 hours","Skin rash — resolves within 2–3 days","Expect heavy bleeding and cramping pains for 24–48 hours after misoprostol administration"] },
      { type: "subheading", value: "Misoprostol Administration (Home Instructions)" },
      { type: "list", items: ["Insert misoprostol vaginally 48 hours after taking Mifepristone","Pass urine before inserting","Eat and drink as normal","Lie down for 30–60 minutes after vaginal insertion","Reinsert tablets if they fall out","Use sanitary towels rather than tampons","Paracetamol +/- ibuprofen analgesia — codeine 15mg or 30mg tablets also provided","If nausea and vomiting are severe, patient may call and return for anti-emetics","The 800µg misoprostol tablets can be taken orally but may be less effective (NICE 2019) — vaginal administration advised","Return any unused misoprostol tablets to any pharmacy — misoprostol is an abortifacient"] },
    ]
  },
  {
    id: "mc-med-pathway", gl: "CG621", condition: "Medical Management of Miscarriage", setting: "Outpatient Pathway",
    flowchartId: "CG621_OUTPATIENT",
    title: "Medical Management — Outpatient Pathway",
    tags: ["pathway","outpatient","consent","econsent","fbc","group and save","blood tests","anti-d","counselling","pre-treatment","steps","follow up","day 7","nursing call","repeat dose","surgical management","smm"],
    content: [
      { type: "subheading", value: "Pre-Treatment Steps" },
      { type: "list", items: ["Counsel patients on advantages, disadvantages and alternatives to medical management","Provide information leaflets on miscarriage and medical management","Give the patient time to decide and the option to return at a later date for treatment","Obtain e-consent — include: failure (~17%) and need for SMM, Mifepristone and Misoprostol are unlicensed for this indication, side effects, pain, potential heavy bleeding","Document temperature, blood pressure, pulse","Take blood: FBC and G&S (ensure Hb >100g/L)","Prescribe the pre-arranged pack: Mifepristone, misoprostol, codeine and a pregnancy test"] },
      { type: "alert", value: "Anti-D should NOT be administered to women undergoing medical management of miscarriage under 12 weeks' gestation." },
      { type: "subheading", value: "Follow-up" },
      { type: "list", items: ["No routine follow-up unless clinically indicated","A member of nursing staff will call 7–9 days after starting treatment to check commencement of bleeding and well-being","If patient describes moderate or heavy bleeding that has since reduced significantly — assume likely complete miscarriage; advise repeat pregnancy test in 3 weeks","If patient does not give history suggestive of complete miscarriage — offer second dose of 800mcg Misoprostol (arrange attendance as soon as possible); also discuss expectant management and surgical management","If the bleeding stops: perform home urine pregnancy test 3 weeks later — call EPU if positive"] },
      { type: "subheading", value: "When to Call the EPU" },
      { type: "list", items: ["Any concerns or prolonged/severe side effects","Prolonged (>3 days) heavy bleeding (flow not subsiding)","Haemorrhage — clots size of a palm or soaking sanitary pads every 20 minutes","Symptoms of haemodynamic instability or infection","Persistent bleeding for more than 3 weeks","Positive home pregnancy test after 3 weeks"] },
    ]
  },
  {
    id: "mc-med-inpatient", gl: "CG621", condition: "Medical Management of Miscarriage", setting: "Inpatient (>10 weeks)",
    flowchartId: "CG621_INPATIENT",
    title: "Medical Management — Inpatient Pathway (>10 weeks)",
    tags: ["inpatient","sonning ward","admission","over 10 weeks","crl 31mm","mifepristone","misoprostol","800mcg","repeat dose","3 hours","mews","discharge criteria","heavy bleeding","products of conception"],
    content: [
      { type: "subheading", value: "When Inpatient Management is Indicated" },
      { type: "list", items: ["Patient requests inpatient management","Gestation >10 weeks (CRL >31mm) — due to risk of heavier bleeding","A side room should be made available on Sonning Ward to maintain privacy"] },
      { type: "subheading", value: "Inpatient Protocol" },
      { type: "list", items: ["Mifepristone 200mg PO to take 48 hours before the date of admission","On admission: 800 micrograms of Misoprostol vaginally administered by the patient, nurse or duty doctor","MEWS observations on admission and every 4 hours","If no products of conception passed after 3 hours: administer further 800 micrograms Misoprostol vaginally","Patients can be discharged once products of conception are passed, bleeding is not heavy and observations are stable","If no products of conception seen and pain/bleeding have settled: allow home with ultrasound scan in EPU within 48 hours","If medical management fails: surgical management may be offered"] },
      { type: "subheading", value: "Third Consecutive Miscarriage" },
      { type: "alert", value: "If this miscarriage is the third consecutive miscarriage, offer for the POC to be sent to Oxford for cytogenetics if this has not already been done. Add 'Testing for Cytogenetics' to the consent form. If POC are being sent for cytogenetics, they must not be sent in formalin and some POC must still be sent for histology." },
    ]
  },
];
