export const GL787_SECTIONS = [
  {
    id: "abx-maternal-sepsis", gl: "GL787", condition: "Maternal Sepsis", setting: "Inpatient",
    title: "Maternal Sepsis — Empirical Treatment",
    tags: ["sepsis","maternal sepsis","infection","chorioamnionitis","iai","endometritis","pyrexia","fever","temperature","postpartum sepsis","puerperal","amoxicillin","clindamycin","gentamicin","teicoplanin","mrsa","esbl","broad spectrum"],
    content: [
      { type: "alert", value: "Take 2 sets of blood cultures BEFORE starting antibiotics. Refer to Maternal Sepsis guideline GL872 for risk stratification." },
      { type: "subheading", value: "First Choice (no penicillin allergy, no MRSA)" },
      { type: "list", items: ["IV amoxicillin 1 g 8 hourly","+ IV clindamycin 1.2 g 6 hourly for 48–72 hours","+ IV gentamicin 5 mg/kg STAT","Then: pathogen-targeted therapy based on C&S results"] },
      { type: "subheading", value: "Penicillin Allergy OR MRSA Positive" },
      { type: "list", items: ["IV teicoplanin 10 mg/kg 12 hourly × 3 doses, then 10 mg/kg 24 hourly","+ IV clindamycin 1.2 g 6 hourly","+ IV gentamicin 5 mg/kg STAT","Then: pathogen-targeted therapy"] },
      { type: "subheading", value: "Known ESBL Positive" },
      { type: "list", items: ["IV temocillin 2 g 12 hourly","+ IV clindamycin 1.2 g 6 hourly for 48–72 hours","Then: pathogen-targeted therapy"] },
      { type: "subheading", value: "Gentamicin Dosing" },
      { type: "list", items: ["Use booking weight if BMI <30","Use corrected dosing weight if BMI ≥30","Max dose 500 mg","STAT doses: no monitoring required"] },
    ]
  },
  {
    id: "abx-cs-prophylaxis", gl: "GL787", condition: "Caesarean Section", setting: "Prophylaxis",
    title: "Caesarean Section — Antibiotic Prophylaxis",
    tags: ["caesarean","c-section","lscs","section","prophylaxis","pre-op","surgical","co-amoxiclav","clindamycin","gentamicin","teicoplanin","mrsa","bmi","obese","emergency","elective","pprom","prom","azithromycin","skin incision"],
    content: [
      { type: "alert", value: "Give antibiotics 30 minutes before skin incision. Emergency LSCS with PPROM/PROM >4hrs or cervical dilatation ≥4 cm: add IV azithromycin 500 mg single dose." },
      { type: "subheading", value: "No MRSA Risk" },
      { type: "table", headers: ["BMI","Regimen"], rows: [["BMI <30","IV co-amoxiclav 1.2 g single dose"],["BMI ≥30","IV co-amoxiclav 1.2 g + IV amoxicillin 1 g single dose"]] },
      { type: "subheading", value: "Penicillin Allergy" },
      { type: "list", items: ["IV clindamycin 1.2 g STAT + IV gentamicin 5 mg/kg STAT","No further doses required"] },
      { type: "subheading", value: "Known or High Risk MRSA" },
      { type: "list", items: ["IV teicoplanin 10 mg/kg STAT + IV gentamicin 5 mg/kg STAT","No further doses required"] },
    ]
  },
  {
    id: "abx-gbs", gl: "GL787", condition: "Group B Streptococcus", setting: "Intrapartum Prophylaxis",
    title: "GBS — Intrapartum Antibiotic Prophylaxis (IAP)",
    tags: ["gbs","group b strep","streptococcus","iap","intrapartum","prophylaxis","benzylpenicillin","teicoplanin","penicillin allergy","eogbsd","neonatal","preterm labour","pprom"],
    content: [
      { type: "subheading", value: "IAP Indicated For" },
      { type: "list", items: ["Previous baby with early- or late-onset invasive GBS infection","GBS colonisation detected on vaginal/perineal swab in current pregnancy","GBS bacteriuria or infection in current pregnancy"] },
      { type: "subheading", value: "IAP NOT Required For" },
      { type: "list", items: ["Women undergoing caesarean delivery (use CS prophylaxis instead)","Women already on broad-spectrum antibiotics for pyrexia or chorioamnionitis"] },
      { type: "subheading", value: "Regimen" },
      { type: "table", headers: ["Allergy Status","Regimen"], rows: [["No penicillin allergy","IV benzylpenicillin 3 g STAT, then 1.5 g 4 hourly until delivered"],["Penicillin allergy","IV teicoplanin 10 mg/kg STAT, then 10 mg/kg every 12 hours until delivered"],["If proceeds to LSCS (pen allergy)","Add gentamicin 5 mg/kg STAT"]] },
    ]
  },
  {
    id: "abx-uti", gl: "GL787", condition: "UTI / Pyelonephritis", setting: "General",
    title: "UTI, ASB & Pyelonephritis",
    tags: ["uti","urinary tract infection","pyelonephritis","asb","asymptomatic bacteriuria","cystitis","urine","nitrofurantoin","amoxicillin","trimethoprim","cefradine","dysuria","frequency","urosepsis","kidney","renal","msu","culture"],
    content: [
      { type: "alert", value: "ASB in pregnancy MUST be treated — risk of pyelonephritis, preterm delivery, perinatal mortality." },
      { type: "subheading", value: "ASB / Cystitis (3-day course)" },
      { type: "table", headers: ["Drug","Dose","Notes"], rows: [["Amoxicillin PO","1 g 8 hourly × 3 days","If sensitive"],["Cefradine PO","500 mg 6 hourly × 3 days","First line alternative"],["Nitrofurantoin PO","50 mg 6 hourly × 3 days","Avoid 3rd trimester; eGFR <45"],["Trimethoprim PO","200 mg 12 hourly × 3 days","Avoid 1st trimester; avoid with folate antagonists"]] },
      { type: "subheading", value: "Acute Pyelonephritis (inpatient)" },
      { type: "list", items: ["IV aztreonam 2 g 8 hourly (first choice)","Known ESBL: IV temocillin 2 g 12 hourly for 24–48 hrs","Duration: 7 days total","Switch IV → oral once afebrile 48 hours, based on UC&S"] },
      { type: "subheading", value: "Urosepsis (UTI + MEOWS ≥3)" },
      { type: "list", items: ["IV meropenem 1 g 8 hourly","Alternative: IV gentamicin 5 mg/kg OD","Review and revise once cultures back"] },
    ]
  },
  {
    id: "abx-wound-skin", gl: "GL787", condition: "Wound & Skin Infection", setting: "Postnatal",
    title: "Wound, Skin & Soft Tissue Infections",
    tags: ["wound","cellulitis","skin infection","soft tissue","cs wound","caesarean wound","perineal","episiotomy","abscess","redness","swelling","erythema","dehiscence","infected wound","surgical site","co-amoxiclav","flucloxacillin","teicoplanin","mrsa","incision","laceration","tear","perineal tear","postnatal","infection"],
    content: [
      { type: "alert", value: "Cellulitis is not covered as a standalone section in GL787. The guidance below covers wound-associated cellulitis. For systemic features treat as Maternal Sepsis." },
      { type: "subheading", value: "CS Wound Infection / Wound Cellulitis" },
      { type: "list", items: ["Send wound swab or aspirate before starting antibiotics","Surgical review — drain any localised or deep collection","Antibiotic treatment indicated for localised cellulitis, associated sepsis, or haematoma/abscess"] },
      { type: "table", headers: ["Allergy Status","Regimen"], rows: [["No penicillin allergy","IV co-amoxiclav 1.2 g 8 hourly OR PO co-amoxiclav 625 mg 8 hourly"],["Penicillin allergy / MRSA","IV teicoplanin 10 mg/kg 12 hourly × 3 doses, then 10 mg/kg 24 hourly"]] },
      { type: "subheading", value: "Perineal / Episiotomy Wound Infection" },
      { type: "list", items: ["Treat as wound cellulitis above if localised","If systemic features (fever, tachycardia, MEOWS ≥3): treat as Maternal Sepsis","Routine prophylaxis NOT recommended for uncomplicated episiotomy repair"] },
      { type: "subheading", value: "Mastitis / Breast Cellulitis" },
      { type: "list", items: ["PO flucloxacillin 1 g 6 hourly (first choice)","Penicillin allergy: PO/IV clindamycin 450 mg 6 hourly PO or 1.2 g 6 hourly IV","Known MRSA: IV teicoplanin 10 mg/kg 12 hourly × 3 doses, then 24 hourly","Breast abscess: refer for I&D / aspiration"] },
      { type: "subheading", value: "When to Escalate" },
      { type: "list", items: [{ text: "MEOWS ≥3 → treat as Maternal Sepsis (see that section)", mbrrace: "MBRRACE consistently finds that sepsis deaths follow delayed escalation. A MEOWS score of ≥3 is a hard threshold that must trigger the sepsis pathway immediately — not a 'monitor and review' response." },{ text: "Rapidly spreading erythema → urgent senior review", mbrrace: "Necrotising fasciitis — frequently presenting as cellulitis that's spreading fast — is overrepresented in sepsis-related maternal deaths. Delay in recognising the need for urgent surgical review is a recurring finding in MBRRACE reports." },"Suspected necrotising fasciitis → emergency surgical review"] },
    ]
  },
  {
    id: "abx-endometritis", gl: "GL787", condition: "Endometritis", setting: "Postnatal",
    title: "Endometritis — Postnatal",
    tags: ["endometritis","postnatal infection","offensive discharge","abdominal pain","co-amoxiclav","clindamycin","gentamicin","vaginal delivery","caesarean","uterus","womb infection"],
    content: [
      { type: "alert", value: "If severe — treat as Maternal Sepsis. Mild–moderate only below." },
      { type: "subheading", value: "Mild–Moderate Endometritis (vaginal delivery)" },
      { type: "list", items: ["Send vaginal swab","PO co-amoxiclav 625 mg 8 hourly (if no true penicillin allergy)"] },
      { type: "subheading", value: "Penicillin Allergy" },
      { type: "list", items: ["IV gentamicin 5 mg/kg for 48 hrs","+ PO clindamycin 450 mg 6 hourly for 5 days"] },
    ]
  },
  {
    id: "abx-pprom", gl: "GL787", condition: "PPROM / Preterm Labour", setting: "Prophylaxis",
    title: "PPROM & Preterm Labour — Antibiotics",
    tags: ["pprom","prom","preterm","premature rupture","membranes","amoxicillin","azithromycin","preterm labour","benzylpenicillin","prolong pregnancy","latency"],
    content: [
      { type: "subheading", value: "PPROM" },
      { type: "list", items: ["PO amoxicillin 1 g 8 hourly for 7 days (or until established labour)","Penicillin allergy: PO azithromycin 500 mg 24 hourly for 7 days","In established labour: switch to GBS IAP regimen"] },
      { type: "subheading", value: "Preterm Labour (signs of infection)" },
      { type: "list", items: ["Maternal pyrexia >38°C: treat as IAI/chorioamnionitis","IV benzylpenicillin 3 g STAT then 1.5 g 4 hourly until delivered","Penicillin allergy: IV teicoplanin 10 mg/kg STAT then 12 hourly","If proceeds to LSCS: add gentamicin 5 mg/kg STAT"] },
      { type: "subheading", value: "PROM at Term" },
      { type: "list", items: ["Routine prophylaxis NOT recommended","Prophylaxis indicated if: GBS positive, ROM ≥48 hours, or maternal pyrexia >38°C"] },
    ]
  },
  {
    id: "abx-gentamicin", gl: "GL787", condition: "Gentamicin", setting: "Dosing & Monitoring",
    title: "Gentamicin — Dosing & Monitoring",
    tags: ["gentamicin","dosing","monitoring","levels","renal","gfr","weight","bmi","dose banding","obese","aminoglycoside","ototoxicity","stat dose","5mg/kg"],
    content: [
      { type: "subheading", value: "Dosing Weight" },
      { type: "list", items: ["BMI <30: use booking weight","BMI ≥30: use corrected dosing weight (see Table 8 in guideline)","Max dose 500 mg"] },
      { type: "subheading", value: "Standard Dose Banding (GFR >30, low AKI risk)" },
      { type: "table", headers: ["Booking Weight","Dose"], rows: [["≤54 kg","260 mg"],["55–58 kg","280 mg"],["59–62 kg","300 mg"],["63–66 kg","320 mg"],["67–70 kg","340 mg"],["71–74 kg","360 mg"],["75–78 kg","380 mg"],["79–82 kg","400 mg"],["83–86 kg","420 mg"],["87–90 kg","440 mg"],["91–94 kg","460 mg"],["≥95 kg","500 mg"]] },
      { type: "subheading", value: "STAT Doses — No Monitoring Required" },
      { type: "text", value: "Single STAT doses (sepsis, GBS IAP, surgical prophylaxis) do not require level monitoring." },
      { type: "subheading", value: "Ongoing Therapy — Check Level at 20–24 hrs" },
      { type: "list", items: ["Level <1 mg/L → continue","Level ≥1 mg/L → hold, recheck after 12 hours","GFR ≤30 or high AKI risk → use low-dose extended interval regimen","Post-partum → use Adult IV Gentamicin Guideline"] },
      { type: "subheading", value: "Contraindications" },
      { type: "list", items: ["Myasthenia gravis","AKI stage 3","CKD stage 5 (not on dialysis)","Renal transplant","Hypersensitivity to aminoglycosides"] },
    ]
  },
  {
    id: "abx-teicoplanin", gl: "GL787", condition: "Teicoplanin", setting: "Dosing",
    title: "Teicoplanin — Dose Banding",
    tags: ["teicoplanin","dose","dosing","mrsa","penicillin allergy","glycopeptide","weight","banding","renal","10mg/kg"],
    content: [
      { type: "subheading", value: "Dosing (use booking weight)" },
      { type: "table", headers: ["Booking Weight","Dose"], rows: [["≤40 kg","400 mg"],["41–58 kg","600 mg"],["59–74 kg","800 mg"],["75–91 kg","1000 mg"],["92–108 kg","1200 mg"],["109–124 kg","1400 mg"],["125–141 kg","1600 mg"],["142–158 kg","1800 mg"],["159–174 kg","2000 mg"],[">175 kg","12 mg/kg"]] },
      { type: "subheading", value: "Renal Dose Adjustment" },
      { type: "table", headers: ["CrCl","Adjustment"], rows: [["30–80 ml/min","Normal loading days 1–4; then normal dose every 48 hrs"],["<30 ml/min / haemodialysis","Normal loading; then normal dose every 72 hrs"]] },
    ]
  },
  {
    id: "abx-vaginal-discharge", gl: "GL787", condition: "Vaginal Discharge", setting: "General",
    title: "Vaginal Discharge — BV, Candida, STIs",
    tags: ["vaginal discharge","bv","bacterial vaginosis","candida","thrush","clotrimazole","metronidazole","chlamydia","gonorrhoea","sti","tv","trichomonas","azithromycin","ceftriaxone","itch","fishy","offensive"],
    content: [
      { type: "subheading", value: "Bacterial Vaginosis (BV)" },
      { type: "list", items: ["PO metronidazole 400 mg 12 hourly for 5 days","Breastfeeding: intravaginal metronidazole gel (0.75%) × 5 days OR intravaginal clindamycin cream (2%) × 7 days","Treat symptomatic women only"] },
      { type: "subheading", value: "Vulvovaginal Candidiasis (Thrush)" },
      { type: "list", items: ["Clotrimazole 500 mg PV STAT + topical clotrimazole 1% cream 12 hourly for 10 days"] },
      { type: "subheading", value: "STIs — Refer ALL to GUM" },
      { type: "list", items: ["IM ceftriaxone 1 g single dose (NG)","+ PO azithromycin 1 g single dose (CT)","+ PO metronidazole 400 mg 12 hourly for 5 days (TV)"] },
    ]
  },
];
