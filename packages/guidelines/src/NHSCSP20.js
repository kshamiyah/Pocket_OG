export const NHSCSP20_SECTIONS = [
  {
    id: "nhscsp20-overview",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Screening",
    title: "Programme Overview",
    tags: ["cervical screening", "NHSCSP", "HPV", "colposcopy", "CIN", "cervical cancer", "NHS CSP"],
    content: [
      {
        type: "text",
        value: "NHSCSP invites people with a cervix aged 24.5–64 for regular screening. Uses HPV primary screening: samples tested for hrHPV first; cytology only if hrHPV detected.",
      },
      { type: "subheading", value: "Screening Ages & Intervals" },
      {
        type: "table",
        headers: ["Age Group", "Interval (HPV negative)", "Notes"],
        rows: [
          ["25–49", "5 years (from 1 July 2025)", "Previously 3 years; changed July 2025 following UKNSC recommendation"],
          ["50–64", "5 years", "Unchanged"],
          ["65+", "Exit screen if overdue", "Not routinely re-invited after age 64"],
        ],
      },
      {
        type: "alert",
        value: "From 1 July 2025: Screening interval for HPV-negative women aged 25–49 extended from 3 to 5 years, aligning with the 50–64 age group. Women already due are not affected — the new interval applies from their next result.",
      },
      { type: "subheading", value: "Programme Standards" },
      {
        type: "list",
        items: [
          "≥99% offered colposcopy within 6 weeks of referral",
          "Faster Diagnosis Standard: 28 days to cancer/no cancer result",
          "See-and-treat target: <10% CIN1 or negative histology",
          "Sample adequacy target: >98%",
        ],
      },
      { type: "subheading", value: "Who is included" },
      {
        type: "list",
        items: [
          "Anyone with a cervix aged 24.5–64 regardless of gender",
          "Trans men and non-binary people with a cervix should be screened",
          "Testosterone therapy may cause atrophic changes — sampling still achievable",
          "Reasonable adjustments required for people with learning disabilities",
          "Pregnant women: screening deferred to 12 weeks postpartum unless clinically indicated",
        ],
      },
    ],
  },

  {
    id: "nhscsp20-pathway",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Screening",
    title: "HPV Primary Screening Pathway",
    tags: [
      "HPV primary screening", "hrHPV", "cytology", "borderline", "dyskaryosis",
      "low grade", "high grade", "referral", "colposcopy", "recall",
      "inadequate sample",
    ],
    flowchartId: "NHSCSP20_SCREENING",
    content: [
      {
        type: "text",
        value: "All samples tested for hrHPV first. Cytology (LBC) performed only on hrHPV-positive samples. Implemented across England 2019–2020.",
      },
      { type: "subheading", value: "Result Pathways" },
      {
        type: "table",
        headers: ["Result", "Action", "Next step"],
        rows: [
          ["hrHPV negative", "No further action", "Routine recall 5 years"],
          ["hrHPV positive + cytology negative", "Repeat screen", "In 12 months"],
          ["hrHPV positive + borderline or low-grade dyskaryosis", "Refer to colposcopy", "Within 6 weeks"],
          ["hrHPV positive + high-grade dyskaryosis (moderate or severe)", "Urgent colposcopy", "2-week pathway"],
          ["hrHPV positive + ?glandular neoplasia or ?invasive cancer", "Urgent — same day / 2WW", "MDT review"],
          ["Inadequate sample", "Repeat in 3 months", "If ×3 inadequate → refer to colposcopy"],
        ],
      },
      { type: "subheading", value: "Persistent HPV positive, cytology negative — repeat pathway" },
      {
        type: "list",
        items: [
          "1st repeat at 12 months → hrHPV negative: routine recall 5 years",
          "1st repeat at 12 months → hrHPV positive + any cytology abnormality: refer to colposcopy immediately",
          "1st repeat at 12 months → hrHPV positive + cytology negative: repeat again at 24 months total",
          "2nd repeat at 24 months → hrHPV positive (any cytology): refer to colposcopy",
          "2nd repeat at 24 months → hrHPV negative: routine recall 5 years",
        ],
      },
      {
        type: "alert",
        value: "Any abnormal cytology (borderline or above) combined with a positive hrHPV test = immediate colposcopy referral. Do not repeat.",
      },
      { type: "subheading", value: "Cytology result categories (LBC)" },
      {
        type: "list",
        items: [
          "Negative: no abnormal cells",
          "Borderline nuclear changes (BNC): lowest-grade abnormality",
          "Mild dyskaryosis: broadly corresponds to CIN1",
          "Moderate dyskaryosis: broadly corresponds to CIN2",
          "Severe dyskaryosis / ?invasive: broadly corresponds to CIN3",
          "Glandular neoplasia: endocervical/endometrial glandular changes",
          "?Invasive cancer: urgent immediate referral same day",
        ],
      },
    ],
  },

  {
    id: "nhscsp20-colposcopy",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Colposcopy",
    title: "Colposcopy: Referral & Assessment",
    tags: [
      "colposcopy", "transformation zone", "acetowhite", "CIN", "biopsy",
      "see and treat", "Lugol's iodine", "acetic acid", "grade 1", "grade 2", "IFCPC",
    ],
    flowchartId: "NHSCSP20_COLPOSCOPY",
    content: [
      {
        type: "text",
        value: "Colposcopy extends the screening process with direct magnified visualisation of the cervix, directed biopsy, and treatment capability.",
      },
      { type: "subheading", value: "Referral indications" },
      {
        type: "list",
        items: [
          "hrHPV positive + abnormal cytology (any grade)",
          "hrHPV positive + cytology negative: persistent ×3 (at 12 and 24 months)",
          "Inadequate samples ×3 within 12 months",
          "Symptomatic: abnormal/intermenstrual/post-coital bleeding regardless of screen result",
          "Clinically suspicious cervix: direct 2WW referral even with normal smear",
          "Post-menopausal bleeding (see also endometrial assessment)",
        ],
      },
      { type: "subheading", value: "At colposcopy — assessment" },
      {
        type: "list",
        items: [
          "Assess transformation zone (TZ) type: Type 1 (fully ectocervical, fully visible) / Type 2 (endocervical component, fully visible) / Type 3 (endocervical component, not fully visible)",
          "Apply 5% acetic acid: acetowhite areas indicate abnormality",
          "Apply Lugol's iodine (Schiller's test): normal epithelium stains mahogany brown; abnormal epithelium unstained",
          "Record colposcopic impression: normal / CIN1 / CIN2–3 / CGIN / ?invasive",
          "Directed punch biopsy from most abnormal area (mandatory unless see-and-treat or obviously normal)",
          "Endocervical sampling if TZ Type 3 or glandular abnormality suspected",
        ],
      },
      { type: "subheading", value: "Colposcopic grading (IFCPC 2011)" },
      {
        type: "table",
        headers: ["Feature", "Grade 1 (Minor — likely CIN1)", "Grade 2 (Major — likely CIN2/3)"],
        rows: [
          ["Acetowhitening", "Faint, irregular, thin", "Dense, opaque, rapid onset"],
          ["Margins", "Indistinct, feathered, angular", "Sharp, raised/rolled, peeling"],
          ["Vascular pattern", "Fine mosaic/punctation", "Coarse mosaic/coarse punctation"],
          ["Iodine (Lugol's)", "Partial/variable uptake", "Complete iodine negativity"],
          ["Inner border sign", "Absent", "Present (inner border within acetowhite)"],
          ["Ridge sign", "Absent", "Present"],
        ],
      },
      {
        type: "alert",
        value: "See and treat: acceptable when referral is for high-grade dyskaryosis AND colposcopic appearance is consistently major grade. Target: <10% of see-and-treat specimens should be CIN1 or negative on histology.",
      },
    ],
  },

  {
    id: "nhscsp20-cin",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Colposcopy",
    title: "CIN Grading & Management",
    tags: [
      "CIN1", "CIN2", "CIN3", "cervical intraepithelial neoplasia", "management",
      "surveillance", "treatment", "watch and wait", "conservative management",
      "regression", "progression",
    ],
    flowchartId: "NHSCSP20_COLPOSCOPY",
    content: [
      { type: "subheading", value: "CIN Classification" },
      {
        type: "table",
        headers: ["Grade", "Histology", "Spontaneous Regression", "Progression Risk"],
        rows: [
          ["CIN1", "Mild dysplasia — lower ⅓ epithelium", "~60% regress within 2 years", "<1–3% to cancer over 10 years"],
          ["CIN2", "Moderate dysplasia — lower ⅔ epithelium", "~40–50% regress", "~5% if untreated over years"],
          ["CIN3 / CIS", "Severe dysplasia or carcinoma in situ — full thickness", "Low", "~30–35% if untreated long-term"],
        ],
      },
      { type: "subheading", value: "CIN1 — Management" },
      {
        type: "list",
        items: [
          "Do NOT routinely treat CIN1 — high regression rate",
          "Recall for hrHPV test at 12 months in primary care",
          "hrHPV negative at 12 months → routine 5-year recall",
          "hrHPV positive + any cytology abnormality at 12 months → refer to colposcopy",
          "hrHPV positive + cytology negative at 12 months → repeat in further 12 months (24 months total)",
          "If hrHPV still positive at 24 months → colposcopy referral",
          "If colposcopy confirms persistent CIN1 at 24 months with no regression: discuss treatment vs continued surveillance with patient",
        ],
      },
      { type: "subheading", value: "CIN2 — Management" },
      {
        type: "list",
        items: [
          "Treatment recommended but conservative management acceptable in selected cases",
          "Conservative ('watch and wait') for up to 2 years if: woman wishes to preserve fertility / age <30 / colposcopic appearance is minor grade",
          "During conservative management: 6-monthly colposcopy and hrHPV testing",
          "Treat if: CIN3 on repeat biopsy / no regression at 24 months / patient preference / colposcopic appearance worsens",
          "See-and-treat acceptable if referral with high-grade dyskaryosis and colposcopy confirms major grade",
        ],
      },
      { type: "subheading", value: "CIN3 — Management" },
      {
        type: "list",
        items: [
          "Treatment mandatory — conservative management is NOT appropriate",
          "LLETZ is the standard treatment (outpatient, local anaesthetic)",
          "See-and-treat acceptable: referral with moderate/severe dyskaryosis + major grade colposcopy",
          "CKC (cold knife cone biopsy) if: large/complex lesion, suspected CGIN, type 3 TZ, suspected invasion",
          "Ablation: only if all criteria met (see Treatment section)",
        ],
      },
      {
        type: "alert",
        value: "CIN3 requires treatment. Do not offer watch and wait. See-and-treat avoids delays and is acceptable when the clinical picture is consistent.",
      },
    ],
  },

  {
    id: "nhscsp20-treatment",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Colposcopy",
    title: "Treatment Options",
    tags: [
      "LLETZ", "large loop excision", "CKC", "cold knife cone", "ablation", "laser",
      "cryotherapy", "cold coagulation", "excision", "cone biopsy", "TETZ", "thermal ablation",
    ],
    content: [
      { type: "subheading", value: "LLETZ (Large Loop Excision of the Transformation Zone)" },
      {
        type: "list",
        items: [
          "Most common treatment; outpatient colposcopy clinic under local anaesthetic",
          "Thin electrically heated wire loop removes the transformation zone",
          "Tissue sent to histopathology for grade confirmation and margin assessment",
          "Cure rate: ~95% for CIN2/3 at first treatment",
          "Depth guidance: limit to ≤10–12mm where possible to reduce preterm birth risk",
          "Can be diagnostic (post-biopsy) or see-and-treat",
          "Wider excision acceptable for larger lesions to ensure complete TZ removal",
        ],
      },
      { type: "subheading", value: "CKC (Cold Knife Cone Biopsy)" },
      {
        type: "list",
        items: [
          "Requires general or regional anaesthesia in theatre",
          "Indications: CGIN suspected / TZ Type 3 / large/complex lesion / suspected early invasion / inadequate colposcopy",
          "Provides larger specimen with more accurate margin assessment",
          "Greater preterm birth risk with deeper cones",
        ],
      },
      { type: "subheading", value: "Ablative techniques" },
      {
        type: "alert",
        value: "Ablation only appropriate if ALL 4 criteria met: (1) entire lesion fully visible, (2) satisfactory colposcopy with no glandular abnormality concern, (3) no suspicion of invasion, (4) no significant discordance between cytology, colposcopy, and histology.",
      },
      {
        type: "list",
        items: [
          "Cold coagulation (thermal ablation): destroys abnormal cells using heat probe; outpatient",
          "Laser ablation: precise CO₂ laser; requires specialist equipment",
          "Cryotherapy: less commonly used in UK; less suitable for large or endocervical lesions",
          "Ablative techniques provide NO specimen for histology — ensure adequate pre-treatment biopsy",
        ],
      },
      { type: "subheading", value: "Reproductive consequences (RCOG SIP 21)" },
      {
        type: "list",
        items: [
          "LLETZ associated with increased preterm birth risk — risk increases with depth and volume",
          "Excision >10mm depth: approximately ×3 increased risk of spontaneous preterm birth",
          "Repeat excisions multiply the risk significantly",
          "Principle: minimum excision needed to achieve clear margins — preserve cervical stroma",
          "Subsequent pregnancy: measure cervical length at mid-gestation (18–24 weeks)",
          "Consider rescue cerclage / prophylactic cerclage if cervical length <25mm at 18–24 weeks",
          "Preconception counselling advised after deep or repeat excisions",
        ],
      },
    ],
  },

  {
    id: "nhscsp20-toc",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Post-treatment",
    title: "Test of Cure & Post-Treatment Follow-up",
    tags: [
      "test of cure", "TOC", "post-treatment", "follow-up", "HPV negative",
      "surveillance", "recurrence", "margins", "positive margins", "incomplete excision",
    ],
    flowchartId: "NHSCSP20_TOC",
    content: [
      { type: "subheading", value: "Test of Cure (TOC) — Standard Protocol" },
      {
        type: "list",
        items: [
          "TOC sample: taken 6 months after treatment in primary care",
          "Tests for hrHPV (not routine cytology)",
          "hrHPV negative at TOC → routine recall 5 years; re-enter normal screening",
          "hrHPV positive at TOC (any cytology result) → refer to colposcopy",
          "After successful TOC, re-enter routine 5-year recall regardless of age",
        ],
      },
      {
        type: "alert",
        value: "Any HPV-positive TOC result = refer to colposcopy. Do not repeat the TOC — refer regardless of whether cytology is normal.",
      },
      { type: "subheading", value: "Incomplete excision / positive margins" },
      {
        type: "table",
        headers: ["Margin status", "Action"],
        rows: [
          ["Ectocervical margin only", "TOC at 6 months acceptable; residual disease ~20%"],
          ["Endocervical margin involved", "Early colposcopy review at 6 months (rather than community TOC); higher risk of residual disease"],
          ["Both margins positive", "Discuss at MDT; strong consideration for re-excision or early colposcopy review"],
          ["CGIN at margins", "Re-excision or hysterectomy (if family complete) — refer to gynae-oncology MDT"],
        ],
      },
      { type: "subheading", value: "Long-term follow-up" },
      {
        type: "list",
        items: [
          "Treated CIN2/3 + HPV negative TOC: return to routine 5-yearly screening",
          "Long-term risk: women treated for CIN3 have marginally elevated lifetime cervical cancer risk vs. general population — continued screening participation important",
          "If HPV positive at any future routine screen: re-enter pathway as new screen positive",
        ],
      },
    ],
  },

  {
    id: "nhscsp20-cgin",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Colposcopy",
    title: "CGIN Management",
    tags: [
      "CGIN", "glandular intraepithelial neoplasia", "adenocarcinoma in situ", "AIS",
      "glandular changes", "cone biopsy", "hysterectomy", "glandular neoplasia",
      "endocervical", "multifocal",
    ],
    content: [
      {
        type: "text",
        value: "Cervical Glandular Intraepithelial Neoplasia (CGIN) affects endocervical glandular epithelium. High-grade CGIN (HCGIN) is synonymous with adenocarcinoma in situ (AIS). Coexists with squamous CIN in ~50% of cases.",
      },
      { type: "subheading", value: "Why CGIN requires more intensive management" },
      {
        type: "list",
        items: [
          "Multifocal/skip lesions common — difficult to completely excise",
          "May occur at any level of the endocervical canal, beyond colposcopic view",
          "Associated with adenocarcinoma of the cervix (glandular type)",
          "Higher rate of incomplete excision even with wider cone biopsy",
          "10% of all cervical abnormalities are glandular",
        ],
      },
      { type: "subheading", value: "Initial treatment" },
      {
        type: "list",
        items: [
          "Excision required: LLETZ or preferably CKC (deeper specimen, better margin assessment)",
          "Target: clear endocervical margin with ≥10mm of glandular tissue in specimen",
          "See-and-treat acceptable if referred with glandular dyskaryosis and colposcopy confirms CGIN",
          "Ablation is NOT appropriate for CGIN",
        ],
      },
      { type: "subheading", value: "Post-CGIN surveillance (clear margins)" },
      {
        type: "list",
        items: [
          "hrHPV and cytology at 6 months post-treatment",
          "hrHPV and cytology at 12 months",
          "Annual hrHPV and cytology for a further 8 years (10 years total from treatment)",
          "After 10 years of negative surveillance: return to routine 5-yearly screening",
          "Any hrHPV positive or abnormal cytology during surveillance → refer to colposcopy",
        ],
      },
      {
        type: "alert",
        value: "CGIN with positive endocervical margins or recurrent CGIN: refer to gynaecological oncology MDT. Hysterectomy is the preferred management in women who have completed their family.",
      },
    ],
  },

  {
    id: "nhscsp20-special",
    gl: "NHSCSP20",
    condition: "Cervical Cancer",
    setting: "Screening",
    title: "Special Populations",
    tags: [
      "pregnancy", "immunosuppressed", "HIV", "transplant", "young women", "fertility",
      "colposcopy pregnancy", "annual screening", "under 25", "trans", "non-binary",
      "HPV vaccination", "Gardasil",
    ],
    flowchartId: "NHSCSP20_PREGNANCY",
    content: [
      { type: "subheading", value: "Pregnancy" },
      {
        type: "list",
        items: [
          "Routine screening can be performed in pregnancy (ideally 10–20 weeks gestation)",
          "Colposcopy is SAFE in pregnancy — for assessment only, NOT treatment",
          "Punch biopsy: avoid unless invasive cancer is clinically suspected",
          "Treatment deferred to ≥12 weeks postpartum for CIN2/3",
          "High-grade CIN in pregnancy: 3-monthly colposcopy surveillance throughout",
          "Clinical suspicion of invasion: immediate MDT referral; do not defer",
          "Most CIN does not progress significantly during pregnancy; postpartum regression is common",
        ],
      },
      {
        type: "alert",
        value: "Do NOT treat CIN during pregnancy. Colposcopy in pregnancy is for assessment only — defer LLETZ/ablation to ≥12 weeks postpartum.",
      },
      { type: "subheading", value: "HIV positive" },
      {
        type: "list",
        items: [
          "Annual cervical screening (not routine 5-year recall)",
          "Screen at HIV diagnosis",
          "Managed in conjunction with HIV team; lower threshold for colposcopy referral",
          "Higher rates of hrHPV persistence, CIN, and progression",
          "After LLETZ: TOC at 6 months then annual surveillance as per HIV clinical guidelines",
        ],
      },
      { type: "subheading", value: "Immunosuppressed (non-HIV)" },
      {
        type: "list",
        items: [
          "Includes: solid organ transplant recipients, haematological malignancies, immunosuppressive drugs (methotrexate, biologic DMARDs, long-term high-dose steroids)",
          "Annual cervical screening recommended",
          "Lower threshold for colposcopy referral and treatment",
          "Managed in line with colposcopy programme management guidelines",
        ],
      },
      { type: "subheading", value: "Young women (under 25)" },
      {
        type: "list",
        items: [
          "Not invited for routine screening — programme starts at 24.5 years",
          "If symptomatic (abnormal bleeding, clinical concern): refer to colposcopy/gynaecology directly",
          "CIN2 in women under 25: conservative management preferred (high regression rate)",
          "HPV vaccination: offered to girls at 12–13 years (Gardasil 9 — protects against HPV 6/11/16/18/31/33/45/52/58)",
          "Catch-up vaccination available up to age 25",
        ],
      },
      { type: "subheading", value: "Trans men / non-binary people with a cervix" },
      {
        type: "list",
        items: [
          "Eligible for and should be invited to routine cervical screening",
          "Testosterone therapy may cause atrophic changes making sampling uncomfortable — sample remains adequate",
          "Sensitive, trauma-informed communication essential",
          "Support with reasonable adjustments; self-sampling research ongoing in UK",
        ],
      },
    ],
  },
];
