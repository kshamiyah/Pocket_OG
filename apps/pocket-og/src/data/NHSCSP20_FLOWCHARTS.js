// NHSCSP20 — NHS Cervical Screening Programme Publication 20
// Four pathways: HPV primary screening, colposcopy/CIN management, test of cure, and screening in pregnancy

export const NHSCSP20_SCREENING_FLOWCHART = {
  id: "NHSCSP20_SCREENING",
  title: "HPV Primary Cervical Screening",
  subtitle: "NHSCSP: HPV primary pathway (England)",
  startId: "hpv-result",
  nodes: {

    "hpv-result": {
      type: "decision",
      title: "hrHPV test result?",
      text: "All cervical samples are tested for high-risk HPV first. Cytology is only performed if hrHPV is positive.",
      options: [
        { label: "hrHPV negative", sublabel: "No cytology required", next: "hpv-negative-end" },
        { label: "hrHPV positive", sublabel: "Proceed to cytology triage", next: "cytology-result" },
        { label: "Inadequate sample", sublabel: "Cannot be processed", next: "inadequate" },
      ],
    },

    "hpv-negative-end": {
      type: "end",
      title: "Routine Recall: 5 Years",
      text: "hrHPV negative result. No further action required.",
      items: [
        "Recall in 5 years for next routine screening invitation",
        "Applies to all ages 25–64",
        "Exit screening at age 65 if last result was hrHPV negative",
      ],
    },

    "inadequate": {
      type: "action",
      title: "Inadequate Sample: Repeat in 3 Months",
      text: "Sample was inadequate and cannot be assessed. A repeat sample is required.",
      items: [
        "Repeat sample should be taken after 3 months",
        "If 3 consecutive inadequate samples: refer to colposcopy",
        "Advise patient on factors that may improve sample adequacy (e.g. timing in cycle, atrophic epithelium)",
      ],
      next: "inadequate-count",
    },

    "inadequate-count": {
      type: "decision",
      title: "How many consecutive inadequate samples?",
      text: "Count of inadequate results determines onward management.",
      options: [
        { label: "1st or 2nd inadequate", sublabel: "Repeat again in 3 months", next: "hpv-result" },
        { label: "3rd consecutive inadequate", sublabel: "Colposcopy referral required", next: "colposcopy-referral" },
      ],
    },

    "cytology-result": {
      type: "decision",
      title: "Cytology (LBC) result?",
      text: "hrHPV positive — cytology determines the next step.",
      options: [
        { label: "Cytology negative", sublabel: "No cytological abnormality detected", next: "hpv-pos-cyto-neg" },
        { label: "Borderline nuclear changes (BNC) or mild dyskaryosis", sublabel: "Low-grade abnormality", next: "colposcopy-referral" },
        { label: "Moderate or severe dyskaryosis", sublabel: "High-grade, urgent colposcopy", next: "urgent-colposcopy" },
        { label: "?Glandular neoplasia or ?invasive cancer", sublabel: "Highest urgency", next: "same-day-urgent" },
      ],
    },

    "hpv-pos-cyto-neg": {
      type: "action",
      title: "hrHPV positive, cytology negative: Repeat in 12 months",
      text: "HPV infection without cytological change. Monitor with repeat screen in primary care.",
      items: [
        "Invite for repeat hrHPV test in 12 months",
        "Do not refer to colposcopy at this stage",
        "Cytology will be performed if still HPV positive at repeat",
      ],
      next: "repeat-12m",
    },

    "repeat-12m": {
      type: "decision",
      title: "12-month repeat result?",
      text: "Result of the first surveillance repeat at 12 months.",
      options: [
        { label: "hrHPV negative", sublabel: "HPV cleared", next: "hpv-negative-end" },
        { label: "hrHPV positive + any cytology abnormality", sublabel: "Borderline or above", next: "colposcopy-referral" },
        { label: "hrHPV positive + cytology negative", sublabel: "Persistent HPV, no cytological change", next: "repeat-24m" },
      ],
    },

    "repeat-24m": {
      type: "decision",
      title: "24-month repeat result?",
      text: "Result of second surveillance repeat (24 months from original positive).",
      options: [
        { label: "hrHPV negative", sublabel: "HPV cleared at 24 months", next: "hpv-negative-end" },
        { label: "hrHPV positive (any cytology)", sublabel: "Persistent HPV at 24 months, refer", next: "colposcopy-referral" },
      ],
    },

    "colposcopy-referral": {
      type: "action",
      title: "Refer to Colposcopy",
      text: "Colposcopy referral within 6 weeks (standard) or 2 weeks (high-grade).",
      items: [
        "Standard referral: within 6 weeks of notification",
        "Programme standard: ≥99% seen within 6 weeks",
        "Inform patient of referral in writing with information leaflet",
        "Urgent pathway: 2 weeks for high-grade dyskaryosis",
      ],
      next: "colposcopy-end",
    },

    "urgent-colposcopy": {
      type: "alert",
      title: "Urgent Colposcopy: 2-Week Pathway",
      text: "High-grade dyskaryosis (moderate or severe) with hrHPV positive. Urgent referral required.",
      items: [
        "Refer via 2-week urgent colposcopy pathway",
        "See-and-treat may be appropriate at colposcopy if appearance consistent",
        "Faster Diagnosis Standard: 28 days to cancer/no cancer result",
      ],
      next: "colposcopy-end",
    },

    "same-day-urgent": {
      type: "alert",
      title: "Same-Day Urgent Referral, ?Glandular / ?Invasive",
      text: "Cytology reporting glandular neoplasia or invasive cancer requires immediate action.",
      items: [
        "Contact colposcopy unit or on-call gynaecologist same day",
        "2-Week Wait (2WW) cancer pathway if invasive cancer suspected",
        "MDT review to be arranged",
        "Do not delay for repeat testing",
      ],
      next: "colposcopy-end",
    },

    "colposcopy-end": {
      type: "end",
      title: "Colposcopy Appointment",
      text: "Patient referred to colposcopy for assessment, directed biopsy, and/or treatment as appropriate.",
      items: [
        "See NHSCSP20 Colposcopy & CIN Management pathway for further decision-making",
        "Test of cure (TOC) 6 months post-treatment if treatment given",
      ],
    },

  },
};

export const NHSCSP20_COLPOSCOPY_FLOWCHART = {
  id: "NHSCSP20_COLPOSCOPY",
  title: "Colposcopy & CIN Management",
  subtitle: "NHSCSP Publication 20: CIN decision pathway",
  startId: "colposcopy-assessment",
  nodes: {

    "colposcopy-assessment": {
      type: "action",
      title: "Colposcopy Assessment",
      text: "Perform full colposcopy: assess TZ type, apply acetic acid and Lugol's iodine, record colposcopic impression.",
      items: [
        "TZ Type 1: fully ectocervical and fully visible",
        "TZ Type 2: endocervical component, fully visible",
        "TZ Type 3: endocervical component, not fully visible — consider CKC",
        "Directed punch biopsy from most abnormal area (unless see-and-treat or obviously normal)",
      ],
      next: "histology-result",
    },

    "histology-result": {
      type: "decision",
      title: "Histology / colposcopic impression?",
      text: "Based on directed biopsy or see-and-treat specimen.",
      options: [
        { label: "Normal / CIN1", sublabel: "No high-grade or glandular disease", next: "cin1-management" },
        { label: "CIN2", sublabel: "Moderate dysplasia", next: "cin2-decision" },
        { label: "CIN3 / CIS", sublabel: "Severe dysplasia or carcinoma in situ", next: "cin3-treatment" },
        { label: "CGIN / glandular neoplasia", sublabel: "Endocervical glandular disease", next: "cgin-management" },
        { label: "?Invasive cancer", sublabel: "Suspicious features on colposcopy or histology", next: "invasive-mdt" },
      ],
    },

    "cin1-management": {
      type: "action",
      title: "CIN1: Surveillance, No Routine Treatment",
      text: "CIN1 has high spontaneous regression (~60% within 2 years). Do not treat routinely.",
      items: [
        "Return to primary care for hrHPV test at 12 months",
        "hrHPV negative at 12 months → routine 5-year recall",
        "hrHPV positive + any abnormality → refer to colposcopy",
        "hrHPV positive + cytology negative at 12 months → repeat at 24 months",
        "If persistent CIN1 at 24 months with no regression: discuss treatment vs surveillance",
      ],
      next: "cin1-end",
    },

    "cin1-end": {
      type: "end",
      title: "CIN1: Surveillance in Primary Care",
      text: "12-month hrHPV recall in primary care. Colposcopy only if HPV persistent or abnormality develops.",
    },

    "cin2-decision": {
      type: "decision",
      title: "CIN2: Treatment or conservative management?",
      text: "Treatment is recommended. Conservative management ('watch and wait') is acceptable in selected women.",
      options: [
        { label: "Proceed to treatment (LLETZ)", sublabel: "Standard approach, all women, or patient preference", next: "lletz" },
        { label: "Conservative management", sublabel: "Age <30, fertility wishes, minor-grade colposcopy", next: "cin2-conservative" },
      ],
    },

    "cin2-conservative": {
      type: "action",
      title: "CIN2: Conservative Management (Watch & Wait)",
      text: "Acceptable for up to 2 years if criteria met: age <30, fertility preservation, minor-grade colposcopy.",
      items: [
        "6-monthly colposcopy and hrHPV testing throughout surveillance period",
        "Treat if: CIN3 on repeat biopsy, no regression at 24 months, patient preference, or worsening colposcopy",
        "Advise patient of ~40–50% regression rate but ongoing cancer risk if untreated long-term",
      ],
      next: "cin2-review",
    },

    "cin2-review": {
      type: "decision",
      title: "CIN2 review at 6–24 months",
      text: "Outcome of surveillance colposcopy and hrHPV testing.",
      options: [
        { label: "Regression, hrHPV negative and no CIN on colposcopy/biopsy", sublabel: "Successful conservative management", next: "toc-pathway" },
        { label: "No regression / progression at 24 months, or patient preference for treatment", sublabel: "Proceed to excision", next: "lletz" },
      ],
    },

    "cin3-treatment": {
      type: "alert",
      title: "CIN3: Treatment Mandatory",
      text: "Conservative management is NOT appropriate for CIN3. LLETZ is the standard first-line treatment.",
      items: [
        "See-and-treat acceptable: referral with high-grade dyskaryosis + major-grade colposcopy",
        "CKC if: TZ Type 3, suspected CGIN, large/complex lesion, suspected invasion",
        "Target: <10% of see-and-treat specimens CIN1 or negative",
      ],
      next: "lletz",
    },

    "lletz": {
      type: "action",
      title: "LLETZ (Large Loop Excision of TZ)",
      text: "Outpatient procedure under local anaesthetic. Removes the transformation zone for histological assessment.",
      items: [
        "Cure rate ~95% for CIN2/3 at first treatment",
        "Limit depth to ≤10–12 mm where possible to reduce preterm birth risk",
        "Tissue sent to histopathology — margins assessed",
        "Wider excision acceptable for larger lesions",
        "Preconception counselling if deep or repeat excision",
      ],
      next: "margins-check",
    },

    "margins-check": {
      type: "decision",
      title: "Margin status on excision specimen?",
      text: "Histological margin assessment guides follow-up.",
      options: [
        { label: "Clear margins (all margins free)", sublabel: "Standard TOC pathway", next: "toc-pathway" },
        { label: "Ectocervical margin involved only", sublabel: "TOC at 6 months acceptable; ~20% residual disease", next: "toc-pathway" },
        { label: "Endocervical or both margins involved", sublabel: "Higher residual risk, early colposcopy review", next: "early-colposcopy-review" },
        { label: "CGIN at margins", sublabel: "Re-excision or hysterectomy: MDT", next: "cgin-margins" },
      ],
    },

    "toc-pathway": {
      type: "end",
      title: "Test of Cure at 6 Months",
      text: "hrHPV TOC in primary care 6 months post-treatment.",
      items: [
        "hrHPV negative → routine 5-year recall",
        "hrHPV positive (any cytology) → refer to colposcopy",
        "See NHSCSP20 TOC pathway for full detail",
      ],
    },

    "early-colposcopy-review": {
      type: "end",
      title: "Early Colposcopy Review at 6 Months",
      text: "Endocervical margin involved — higher risk of residual disease. Colposcopy review rather than community TOC.",
      items: [
        "Colposcopy review at 6 months post-treatment",
        "Consider re-excision if residual disease confirmed",
        "Discuss at MDT if both margins involved",
      ],
    },

    "cgin-management": {
      type: "action",
      title: "CGIN: CKC (preferred) or Wide LLETZ",
      text: "CGIN requires excision with adequate glandular tissue. Ablation is NOT appropriate.",
      items: [
        "Preferred: cold knife cone biopsy (CKC) for better margin assessment",
        "Target: clear endocervical margin with ≥10 mm glandular tissue in specimen",
        "Post-CGIN surveillance: hrHPV + cytology at 6 months, 12 months, then annually for 8 years (10 years total)",
        "Any positive result during surveillance → colposcopy",
        "CGIN with positive endocervical margins → gynaecological oncology MDT",
      ],
      next: "cgin-margins",
    },

    "cgin-margins": {
      type: "end",
      title: "CGIN: MDT Review / Re-excision",
      text: "Positive endocervical margins or recurrent CGIN requires gynaecological oncology MDT discussion.",
      items: [
        "Re-excision (repeat cone) or hysterectomy if family complete",
        "10-year surveillance programme if clear margins achieved",
        "Annual hrHPV + cytology throughout surveillance",
      ],
    },

    "invasive-mdt": {
      type: "end",
      title: "Suspected Invasive Cancer: Immediate MDT Referral",
      text: "Features suspicious for invasive cancer on colposcopy or histology require same-day oncology referral.",
      items: [
        "Do not delay for repeat testing",
        "2-Week Wait (2WW) cancer pathway",
        "Gynaecological oncology MDT to direct further management",
        "Staging investigations as directed by MDT",
      ],
    },

  },
};

export const NHSCSP20_TOC_FLOWCHART = {
  id: "NHSCSP20_TOC",
  title: "Test of Cure After CIN Treatment",
  subtitle: "NHSCSP: Post-treatment HPV test of cure",
  startId: "treatment-done",
  nodes: {

    "treatment-done": {
      type: "action",
      title: "CIN Treatment Completed",
      text: "LLETZ, CKC, or ablation performed. Arrange test of cure in primary care.",
      items: [
        "TOC sample taken 6 months after treatment by GP/primary care",
        "TOC tests hrHPV only (not routine cytology)",
        "Ensure patient has written information about TOC and timing",
        "Document margin status in referral/discharge letter",
      ],
      next: "margin-status",
    },

    "margin-status": {
      type: "decision",
      title: "What were the excision margins?",
      text: "Margin status at time of treatment influences where TOC is performed.",
      options: [
        { label: "Clear margins or ectocervical margin only", sublabel: "Standard community TOC at 6 months", next: "toc-sample" },
        { label: "Endocervical margin involved or CGIN at margin", sublabel: "Early colposcopy review at 6 months instead of community TOC", next: "early-colposcopy" },
      ],
    },

    "early-colposcopy": {
      type: "end",
      title: "Colposcopy Review at 6 Months",
      text: "Positive endocervical margin or CGIN: colposcopy clinic review instead of community TOC.",
      items: [
        "Colposcopy with hrHPV test and directed biopsy if abnormality seen",
        "Consider re-excision if residual disease confirmed",
        "CGIN at margins: refer to gynaecological oncology MDT",
        "If no residual disease confirmed at colposcopy: enter TOC pathway from 6 months",
      ],
    },

    "toc-sample": {
      type: "action",
      title: "TOC Sample at 6 Months, hrHPV Test",
      text: "Primary care hrHPV test 6 months post-treatment. No cytology unless HPV positive.",
      items: [
        "Taken by GP practice nurse or other trained practitioner",
        "Result reported as hrHPV positive or negative",
        "Cytology performed automatically by lab if hrHPV positive",
      ],
      next: "toc-result",
    },

    "toc-result": {
      type: "decision",
      title: "TOC hrHPV result?",
      text: "The TOC result determines long-term follow-up.",
      options: [
        { label: "hrHPV negative", sublabel: "Successful clearance of HPV post-treatment", next: "toc-negative" },
        { label: "hrHPV positive (any cytology result)", sublabel: "Residual or persistent HPV", next: "toc-positive" },
      ],
    },

    "toc-negative": {
      type: "end",
      title: "TOC Negative: Routine 5-Year Recall",
      text: "hrHPV negative at TOC. Treatment successful. Re-enter routine cervical screening.",
      items: [
        "Routine recall in 5 years",
        "No special follow-up required",
        "Continue routine screening until age 65",
        "If HPV positive at any future routine screen: re-enter pathway as new screen positive",
      ],
    },

    "toc-positive": {
      type: "alert",
      title: "TOC Positive: Refer to Colposcopy",
      text: "ANY hrHPV positive TOC result requires colposcopy referral. Do not repeat the TOC.",
      items: [
        "Refer to colposcopy regardless of cytology result",
        "Do not offer a second TOC — refer immediately",
        "Likely residual or recurrent CIN — colposcopy will assess and treat",
        "Faster Diagnosis Standard applies: 28 days to cancer/no cancer result",
      ],
      next: "toc-positive-end",
    },

    "toc-positive-end": {
      type: "end",
      title: "Colposcopy Referral Made",
      text: "Patient referred to colposcopy for assessment of possible residual/recurrent disease.",
      items: [
        "Colposcopy within 6 weeks of referral",
        "Further treatment (repeat LLETZ / CKC) if residual CIN confirmed",
        "MDT if CGIN or suspected invasion",
      ],
    },

  },
};

export const NHSCSP20_PREGNANCY_FLOWCHART = {
  id: "NHSCSP20_PREGNANCY",
  title: "Cervical Screening & CIN in Pregnancy",
  subtitle: "NHSCSP: Management during pregnancy",
  startId: "screening-due",
  nodes: {

    "screening-due": {
      type: "decision",
      title: "Screening due or abnormal result identified in pregnancy?",
      text: "Cervical screening can be performed in pregnancy, but treatment is deferred postpartum.",
      options: [
        { label: "Routine screening due during pregnancy", sublabel: "Consider timing and whether to screen now or defer", next: "timing-decision" },
        { label: "Known abnormal result / referred to colposcopy during pregnancy", sublabel: "Assessment only, no treatment", next: "colposcopy-in-pregnancy" },
        { label: "Clinically suspicious cervix in pregnancy", sublabel: "Urgent referral, do not defer", next: "suspicious-cervix" },
      ],
    },

    "timing-decision": {
      type: "decision",
      title: "Gestation at time screening is due?",
      text: "Screening in pregnancy is acceptable. Ideal timing is 10–20 weeks gestation.",
      options: [
        { label: "10–20 weeks gestation", sublabel: "Optimal window, screen now", next: "screen-in-pregnancy" },
        { label: "Near term (>28 weeks) or early first trimester (<10 weeks)", sublabel: "Consider deferring to postpartum", next: "defer-postpartum" },
      ],
    },

    "screen-in-pregnancy": {
      type: "action",
      title: "Cervical Screen in Pregnancy (10–20 Weeks)",
      text: "Cervical screening is safe in pregnancy. Inform the patient and obtain consent.",
      items: [
        "Cervical ectropion common in pregnancy — sample from squamocolumnar junction",
        "Inform laboratory that sample is from a pregnant woman",
        "Result pathway is the same as non-pregnant: hrHPV first, then cytology if positive",
        "If hrHPV negative: routine recall 5 years (postpartum)",
        "If hrHPV positive + abnormal cytology: refer to colposcopy (assessment only)",
      ],
      next: "screen-result",
    },

    "screen-result": {
      type: "decision",
      title: "Screening result?",
      text: "Manage result as per standard pathway; treatment deferred until ≥12 weeks postpartum.",
      options: [
        { label: "hrHPV negative", sublabel: "Routine postpartum recall", next: "postpartum-recall" },
        { label: "hrHPV positive + abnormal cytology", sublabel: "Refer to colposcopy (assessment only)", next: "colposcopy-in-pregnancy" },
      ],
    },

    "defer-postpartum": {
      type: "end",
      title: "Defer Screening to 12 Weeks Postpartum",
      text: "Deferring to after delivery is acceptable if gestation is not in the optimal screening window.",
      items: [
        "Invite for cervical screening at the 6–8 week postnatal check or separately at 12 weeks postpartum",
        "Document deferral decision in notes",
        "If symptomatic (bleeding, contact bleeding): do not defer — refer for colposcopy",
      ],
    },

    "colposcopy-in-pregnancy": {
      type: "alert",
      title: "Colposcopy in Pregnancy: Assessment ONLY",
      text: "Colposcopy is safe in pregnancy. The purpose is assessment — NO treatment should be given.",
      items: [
        "Assess colposcopic appearance and TZ type",
        "Biopsy: avoid unless invasive cancer is clinically suspected",
        "Explain clearly to patient: treatment will be deferred to postpartum",
        "Reassurance: most CIN does not progress in pregnancy; regression common postpartum",
      ],
      next: "cin-grade-pregnancy",
    },

    "cin-grade-pregnancy": {
      type: "decision",
      title: "CIN grade identified at colposcopy in pregnancy?",
      text: "Grade of disease guides surveillance frequency during pregnancy.",
      options: [
        { label: "CIN1 or CIN2", sublabel: "Low risk of significant progression", next: "cin12-pregnancy" },
        { label: "CIN3 (or high-grade colposcopic impression)", sublabel: "Higher grade, closer surveillance", next: "cin3-pregnancy" },
        { label: "?Invasive cancer / features suspicious for invasion", sublabel: "Do NOT defer, immediate MDT", next: "invasive-pregnancy" },
      ],
    },

    "cin12-pregnancy": {
      type: "end",
      title: "CIN1/2 in Pregnancy: Surveillance",
      text: "Low-to-moderate grade CIN: surveillance during pregnancy, treatment deferred to postpartum.",
      items: [
        "Colposcopy surveillance: 3-monthly during pregnancy is not required for CIN1/2",
        "Reassess at 12 weeks postpartum — most will regress",
        "LLETZ / ablation: defer to ≥12 weeks postpartum",
        "Advise patient that CIN2/3 requires treatment postpartum",
      ],
    },

    "cin3-pregnancy": {
      type: "action",
      title: "CIN3 in Pregnancy: 3-Monthly Colposcopy Surveillance",
      text: "High-grade CIN requires closer surveillance in pregnancy but NO treatment until postpartum.",
      items: [
        "3-monthly colposcopy surveillance throughout pregnancy",
        "Re-biopsy only if invasive cancer clinically suspected",
        "Delivery should not be influenced by CIN alone",
        "LLETZ: schedule for ≥12 weeks postpartum",
        "Postpartum regression of high-grade CIN is common — reassess before treating",
      ],
      next: "cin3-postpartum",
    },

    "cin3-postpartum": {
      type: "end",
      title: "CIN3: Treatment ≥12 Weeks Postpartum",
      text: "Defer all treatment to ≥12 weeks after delivery.",
      items: [
        "LLETZ under local anaesthetic in outpatient colposcopy clinic",
        "Test of cure (TOC) hrHPV at 6 months post-treatment",
        "Consider cervical length monitoring in future pregnancies if deep excision performed",
      ],
    },

    "suspicious-cervix": {
      type: "end",
      title: "Clinically Suspicious Cervix: Immediate MDT Referral",
      text: "Clinical suspicion of invasion during pregnancy requires urgent oncology input. Do NOT defer.",
      items: [
        "Same-day contact with gynaecological oncology team",
        "2-Week Wait (2WW) cancer pathway if invasive cancer suspected",
        "MDT to determine extent of investigation and whether delivery plan is affected",
        "EUA / examination under anaesthesia may be required",
        "Biopsy under controlled conditions if clinically indicated",
      ],
    },

    "invasive-pregnancy": {
      type: "end",
      title: "?Invasive Cancer in Pregnancy: Immediate MDT",
      text: "Do not defer investigation or MDT referral in suspected invasive disease.",
      items: [
        "Immediate gynaecological oncology MDT referral",
        "Staging investigations as clinically appropriate",
        "Multidisciplinary discussion to include obstetric team",
        "Individualised management balancing maternal and fetal outcomes",
      ],
    },

    "postpartum-recall": {
      type: "end",
      title: "Postpartum Recall",
      text: "hrHPV negative: routine recall after delivery. No further action in pregnancy.",
      items: [
        "Next routine screening in 5 years (postpartum)",
        "Ensure postnatal records updated with screening result",
      ],
    },

  },
};
