export const CG565_SECTIONS = [
  {
    id: "mc-diagnosis", gl: "CG565", condition: "Miscarriage", setting: "General",
    title: "Diagnosis & Classification",
    tags: ["diagnosis","classify","threatened","viable","uncertain viability","puv","pul","gestational sac","fetal heart","heartbeat","complete","incomplete","missed","types","first trimester","early pregnancy","bleeding in pregnancy","miscarriage types"],
    content: [
      { type: "subheading", value: "Threatened Miscarriage (Viable IUP)" },
      { type: "list", items: ["Reassure patient — 90% of pregnancies at 8 weeks will not miscarry","If bleeding AND history of previous miscarriage — consider progesterone (see CG758)","Discharge back to the care of her GP","Advise to contact EPAGU if: bleeding very heavily (clots size of palm or soaking pads every 20 minutes), bleeding persists for more than 14 days (may need repeat US), pain not controlled with simple analgesia"] },
      { type: "subheading", value: "Pregnancy of Uncertain Viability (PUV)" },
      { type: "text", value: "This has occurred when the ultrasound shows:" },
      { type: "list", items: ["Empty intrauterine gestation sac <25mm","Fetal pole seen ≤7mm and no fetal heart beat seen"] },
      { type: "subheading", value: "Management of PUV" },
      { type: "list", items: ["Plan for rescan in 7–14 days (minimum of 14 days if transabdominal US)","Advise patients to contact the EPAGU if: bleeding very heavily, pain not controlled with simple analgesia, concerned/worried"] },
    ]
  },
  {
    id: "mc-complete", gl: "CG565", condition: "Miscarriage", setting: "Complete Miscarriage",
    title: "Complete Miscarriage",
    tags: ["complete miscarriage","empty uterus","bhcg","beta hcg","pregnancy test","ectopic excluded","after miscarriage","follow up","products of conception","endometrial thickness","tissue diameter","15mm"],
    content: [
      { type: "subheading", value: "Diagnosing Complete Miscarriage" },
      { type: "text", value: "Complete miscarriage is likely when the ultrasound shows:" },
      { type: "list", items: ["Empty uterine cavity","Tissue diameter (or endometrial thickness) <15mm — retained products are unlikely to be found on histology when <15mm"] },
      { type: "alert", value: "If there is no previous ultrasound in this pregnancy, ectopic pregnancy must be excluded. See PUL guideline (GL110) for protocol." },
      { type: "subheading", value: "Serum βHCG Assessment" },
      { type: "list", items: ["A fall in βHCG of >50% in 48 hours usually confirms complete miscarriage","A 48 hour rise in βHCG, or a fall of <50%, indicates a pregnancy of unknown location (PUL) — refer to PUL/Ectopic Pregnancy Protocol and discuss with consultant on call","Caution: falling βHCG can occur in ectopic pregnancy — careful attention to symptoms and history is needed"] },
      { type: "subheading", value: "After Diagnosis of Complete Miscarriage" },
      { type: "list", items: ["Discharge patient to the care of her GP","Advise patient to perform a home urine pregnancy test after 3 weeks","Advise patients to call the EPAGU if: home urine pregnancy test after 3 weeks is positive, bleeding persists for more than 2 weeks, bleeding very heavily (clots size of palm or soaking pads every 20 minutes), pain not controlled with simple analgesia, concerned/worried"] },
    ]
  },
  {
    id: "mc-incomplete", gl: "CG565", condition: "Miscarriage", setting: "Incomplete Miscarriage",
    title: "Incomplete Miscarriage — Management",
    tags: ["incomplete miscarriage","retained products","poc","retained products of conception","open os","intrauterine tissue","expectant","conservative","smm","erpc","surgical","management options","15mm","50mm"],
    content: [
      { type: "subheading", value: "Diagnosis" },
      { type: "list", items: ["Examination findings: open internal os +/- POC in situ","OR Ultrasound findings: intrauterine tissue diameter 15–50mm with no visible intrauterine sac"] },
      { type: "subheading", value: "Management Options" },
      { type: "list", items: ["Expectant (conservative) management is highly effective — 80% resolve within 3 days; should be recommended as first-line treatment unless specific SMM indications are present","Follow up — if bleeding continues for 2–3 weeks: advise return for repeat ultrasound; may then continue expectant or proceed to surgical evacuation","If bleeding stops: perform home urine pregnancy test 3 weeks later — discharge if negative"] },
      { type: "subheading", value: "Surgical Management (SMM)" },
      { type: "list", items: ["Should be offered rather than recommended","See SMM section for full indications and protocol"] },
      { type: "subheading", value: "Medical Management (Note)" },
      { type: "text", value: "Medical management can be offered for incomplete miscarriage in the first trimester, although evidence suggests there is no advantage over expectant management (no difference in time to resolution). Some women will have a strong preference — discuss with consultant. A single dose of 800 micrograms of misoprostol can be used." },
    ]
  },
  {
    id: "mc-missed", gl: "CG565", condition: "Miscarriage", setting: "Missed Miscarriage",
    title: "Missed Miscarriage — Management",
    tags: ["missed miscarriage","anembryonic","no heartbeat","fetal loss","blighted ovum","silent miscarriage","management","expectant","medical","surgical","confirmation scan","gestation sac","25mm","crl","7mm"],
    content: [
      { type: "subheading", value: "Diagnosis (US Findings — Any One Of)" },
      { type: "list", items: ["Empty gestation sac >25mm (anembryonic gestation)","No embryonic heart activity with CRL >7mm (fetal loss)","No change / suboptimal increase in size of sac or CRL since previous scan 1 week ago (if GS <25mm or CRL <7mm)"] },
      { type: "alert", value: "The patient should be given the option of having a confirmation scan by a second trained sonographer/doctor as soon as possible, ideally on the same day." },
      { type: "subheading", value: "A. Expectant Management (First Line)" },
      { type: "list", items: ["Avoids surgical/anaesthetic risks — commencement of symptoms is unpredictable; 90% will start within 3 weeks of diagnosis","Explore other options first if: increased risk of haemorrhage (late first trimester), coagulopathies, inability to have blood transfusion, evidence of infection, previous traumatic pregnancy experience","If late first trimester (>10 weeks US dates) or tissue diameter >50mm — SMM may be preferable due to risk of severe pain and bleeding","Routine follow-up for missed miscarriage is 2–3 weeks later"] },
      { type: "subheading", value: "B. Medical Management" },
      { type: "list", items: ["Fewer emergency admissions than expectant management","Fewer 20% result in SMM (vs 30% for expectant)","Faster, more predictable commencement of bleeding","See CG621 for full Mifepristone + Misoprostol protocol"] },
      { type: "subheading", value: "C. Surgical Management of Miscarriage (SMM)" },
      { type: "list", items: ["Provides certainty of time to resolution (for most)","Done under GA or Manual Vacuum Aspiration (local anaesthetic) for a selected group","No follow up required","See SMM section for full indications and protocol"] },
    ]
  },
  {
    id: "mc-smm", gl: "CG565", condition: "Miscarriage", setting: "Surgical Management (SMM)",
    title: "Surgical Management of Miscarriage (SMM)",
    tags: ["smm","erpc","surgical","evacuation","theatre","operation","general anaesthetic","ga","mva","manual vacuum aspiration","indications","cervical preparation","misoprostol","anti-d","metronidazole","doxycycline","histology","products of conception","poc","augmentin","infection","molar pregnancy"],
    content: [
      { type: "subheading", value: "Indications for SMM" },
      { type: "list", items: ["Patient preference","Persistent excessive bleeding/pain","Haemodynamically unstable","US tissue diameter >50mm (increased risk of excessive bleeding)","US dates >10 weeks gestation (increased risk of excessive bleeding)","Evidence of infected retained tissue (proceed after 6–24h IV antibiotics)","Suspected gestational trophoblastic disease","Failed medical/surgical management"] },
      { type: "alert", value: "Where infection is suspected, delaying surgical intervention for 12–24 hours is recommended to allow intravenous antibiotic (Augmentin) administration." },
      { type: "subheading", value: "Pre-op Protocol" },
      { type: "list", items: ["Complete the EPAGU SMM pathway at time of consultation","Book as elective day case on a future list (unless emergency indication)","MRSA swabs, FBC, Rhesus group & save (valid within 3 days)","Patients requiring emergency SMM — add to Emergency theatre list","Procedures other than SMM (repeat SMMs, molar pregnancies, retained POC, laparoscopies) must be discussed with consultant"] },
      { type: "subheading", value: "Cervical Preparation" },
      { type: "text", value: "Indicated for missed and most incomplete miscarriages (closed internal os on bimanual examination). Not indicated if open internal os assessed on initial bimanual examination." },
      { type: "list", items: ["Misoprostol 600µg PV (400µg for women with previous caesarean section) 1–2 hours pre-op"] },
      { type: "subheading", value: "Intra-op: Antibiotic Prophylaxis & Anti-D" },
      { type: "list", items: ["Metronidazole 1g PR at time of operation + doxycycline 100mg BD for next 7 days","Anti-D immunoglobulin to all non-sensitised Rh negative women in theatre (see Anti-D guideline GL786)"] },
      { type: "subheading", value: "POC Histology" },
      { type: "list", items: ["Ensure POC are seen and documented at evacuation","Send adequate sample to histology to confirm intrauterine pregnancy and exclude molar pregnancy","If third consecutive miscarriage — offer POC to be sent to Oxford for cytogenetics (not in formalin; some POC must still be sent for histology)","Surgeon's responsibility to chase histology result — essential if minimal/no sample obtained (risk of ectopic pregnancy or molar)"] },
      { type: "subheading", value: "Complications of SMM" },
      { type: "list", items: ["Haemorrhage (<3%)","Infection (2–3%) — no increase over expectant/medical management","Incomplete evacuation requiring further ERPC (<1%)","Uterine perforation (<1%), cervical tears","Bowel/bladder trauma (<1%)","Intrauterine adhesions (<5%)","No additional risk to fertility"] },
    ]
  },
];
