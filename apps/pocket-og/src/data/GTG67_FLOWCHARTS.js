// GTG67 — Management of Endometrial Hyperplasia (RCOG/BSGE, February 2016)
// Flowchart 1: Endometrial Hyperplasia — Investigation & Management Pathway
// Flowchart 2: Atypical Hyperplasia (AEH/EIN) — Standard & Fertility-Sparing

export const GTG67_MANAGEMENT_FLOWCHART = {
  id: "GTG67_MANAGEMENT",
  title: "Endometrial Hyperplasia — Management Pathway",
  subtitle: "GTG67 — RCOG/BSGE Endometrial Hyperplasia",
  startId: "presentation",
  nodes: {

    "presentation": {
      type: "action",
      title: "Abnormal Uterine Bleeding / Suspected Endometrial Pathology",
      text: "Common presentation for endometrial hyperplasia: HMB, intermenstrual bleeding (IMB), or postmenopausal bleeding (PMB). Risk factor assessment is essential.",
      items: [
        "Assess risk factors: BMI >30, PCOS, nulliparity, tamoxifen use, diabetes, HRT without adequate progestogen, Lynch syndrome",
        "Examine: abdominal, speculum (check cervix), bimanual (uterine size and tenderness)",
        "TVUSS: endometrial thickness, cavity assessment, structural pathology",
        "PMB with endometrial thickness >4 mm: warrants biopsy",
      ],
      next: "investigation",
    },

    "investigation": {
      type: "action",
      title: "Endometrial Biopsy",
      text: "Histological diagnosis is required. Pipelle biopsy is acceptable first-line; hysteroscopy + directed biopsy is superior especially for focal lesions.",
      items: [
        "Pipelle biopsy: outpatient; samples ~4% of endometrium; may miss focal pathology",
        "Hysteroscopy + directed biopsy: preferred if focal lesion suspected, Pipelle fails, or cervix is stenosed",
        "All tissue must be sent for histology",
        "If biopsy inadequate / inconclusive: repeat with hysteroscopy",
      ],
      next: "histology-result",
    },

    "histology-result": {
      type: "decision",
      title: "Histology result?",
      options: [
        { label: "Endometrial hyperplasia WITHOUT atypia", sublabel: "Benign; low malignant potential (~1–3%); progestogen treatment", next: "without-atypia" },
        { label: "Atypical hyperplasia (AEH) / Endometrial Intraepithelial Neoplasia (EIN)", sublabel: "Premalignant; ~8% concurrent cancer risk; specialist management", next: "aeh" },
        { label: "Normal / inactive / proliferative endometrium", sublabel: "No hyperplasia; treat symptoms; address risk factors", next: "normal" },
        { label: "Endometrial carcinoma", sublabel: "Urgent MDT/oncology referral", next: "cancer" },
      ],
    },

    "normal": {
      type: "end",
      title: "Normal Histology — Treat Underlying HMB",
      text: "No hyperplasia. Manage abnormal uterine bleeding per NICE NG88 HMB pathway. Address modifiable risk factors (weight, tamoxifen, HRT).",
    },

    "cancer": {
      type: "alert",
      title: "Endometrial Carcinoma — Urgent MDT Referral",
      text: "Refer urgently to gynaecological oncology MDT. Staging investigations: MRI pelvis ± CT chest/abdomen/pelvis. Management per NICE endometrial cancer guideline.",
      items: [
        "Do not delay referral to oncology MDT",
        "MRI pelvis: assess myometrial invasion, cervical involvement, lymph node status",
        "Inform patient sensitively; offer written information",
      ],
      next: "end-cancer",
    },

    "end-cancer": {
      type: "end",
      title: "Oncology MDT Management",
      text: "Standard endometrial cancer management: total hysterectomy + bilateral salpingo-oophorectomy + lymph node assessment ± adjuvant treatment depending on staging.",
    },

    "without-atypia": {
      type: "action",
      title: "Hyperplasia Without Atypia — First Steps",
      text: "Address risk factors AND offer progestogen treatment. Observation alone is only acceptable if reversible risk factors are fully corrected.",
      items: [
        "Counsel on risk factors: weight reduction, tamoxifen switch, HRT optimisation",
        "Offer treatment with LNG-IUS or oral progestogen (see below)",
        "Observation without treatment: only if reversible cause fully addressed AND woman accepts 6-monthly surveillance",
        "Spontaneous regression rate ~75% but treatment achieves faster, more reliable regression",
      ],
      next: "treat-without-atypia",
    },

    "treat-without-atypia": {
      type: "decision",
      title: "Treatment choice — hyperplasia without atypia",
      options: [
        { label: "LNG-IUS 52 mg (Mirena) — first-line", sublabel: ">90% regression at 6 months; preferred", next: "lng-ius" },
        { label: "Oral progestogen — LNG-IUS declined/unsuitable", sublabel: "MPA 10–20 mg/day or norethisterone 10–15 mg/day", next: "oral-progestogen" },
        { label: "Observation — reversible cause fully addressed", sublabel: "Only with close 6-monthly biopsy surveillance", next: "observation" },
      ],
    },

    "lng-ius": {
      type: "action",
      title: "LNG-IUS 52 mg — First-Line Treatment",
      text: "Levonorgestrel IUS provides local progestogen with minimal systemic effects. Achieves >90% regression at 6 months.",
      items: [
        "Insert at any time in cycle; can be done at time of hysteroscopy",
        "Continue for surveillance period — do not remove until two consecutive negative biopsies",
        "Advise irregular spotting in first 3–6 months",
        "Biopsy at 6 months: Pipelle or hysteroscopy",
      ],
      next: "surveillance",
    },

    "oral-progestogen": {
      type: "action",
      title: "Oral Progestogen — Alternative Treatment",
      text: "Continuous oral progestogen: MPA 10–20 mg/day or norethisterone 10–15 mg/day.",
      items: [
        "Regression rate ~66–80% at 6 months (lower than LNG-IUS)",
        "Compliance is critical — missed doses reduce efficacy",
        "Side effects: irregular bleeding, breast tenderness, mood changes, fluid retention",
        "Biopsy at 6 months to assess response",
      ],
      next: "surveillance",
    },

    "observation": {
      type: "action",
      title: "Observation — Surveillance Only",
      text: "Only if reversible risk factors are fully and verifiably addressed. Spontaneous regression rate ~75% at 24 months but no treatment means slower resolution.",
      items: [
        "6-monthly endometrial biopsy mandatory",
        "Document clearly what reversible risk factor has been corrected",
        "If not regressing after 12 months: start active treatment",
        "Low threshold to start LNG-IUS if patient accepts",
      ],
      next: "surveillance",
    },

    "surveillance": {
      type: "action",
      title: "Surveillance — 6-Monthly Endometrial Biopsy",
      text: "Repeat endometrial sampling at 6-monthly intervals throughout treatment.",
      items: [
        "Biopsy method: Pipelle or hysteroscopy + directed biopsy",
        "Aim: two consecutive negative (normal) biopsies before discharge from surveillance",
        "If regression confirmed at 6 months: continue treatment to second negative biopsy at 12 months",
        "Document biopsy results carefully; if any progression or new atypia → escalate management",
      ],
      next: "surveillance-response",
    },

    "surveillance-response": {
      type: "decision",
      title: "Response to treatment at 6 and 12 months?",
      options: [
        { label: "Regression — normal endometrium on two consecutive biopsies", sublabel: "Treatment successful; plan discharge or ongoing LNG-IUS", next: "regression" },
        { label: "No regression / persistence after 12 months of adequate treatment", sublabel: "Review, escalate, or consider hysterectomy", next: "no-regression" },
        { label: "Progression to atypia (AEH/EIN) at any point", sublabel: "Escalate to AEH management pathway", next: "aeh" },
      ],
    },

    "regression": {
      type: "end",
      title: "Regression Confirmed — Discharge / Retained LNG-IUS",
      text: "Two consecutive negative biopsies confirmed. Discharge from active surveillance. Recommend retaining LNG-IUS for up to 5 years to reduce relapse risk.",
      items: [
        "Address modifiable risk factors: ongoing weight management, review HRT/tamoxifen",
        "Advise: re-present promptly if abnormal bleeding recurs",
        "If asymptomatic: no further surveillance required after discharge",
        "Reassess need for LNG-IUS at 5 years",
      ],
    },

    "no-regression": {
      type: "decision",
      title: "No regression after 12 months — options?",
      options: [
        { label: "Switch treatment — change from oral progestogen to LNG-IUS, or vice versa", sublabel: "Reassess after further 6 months", next: "switch-tx" },
        { label: "Hysterectomy — preferred if family complete or patient preference", sublabel: "Definitive; no further surveillance needed", next: "hysterectomy-no-atypia" },
      ],
    },

    "switch-tx": {
      type: "end",
      title: "Switch Progestogen Treatment",
      text: "Change to LNG-IUS if on oral progestogen, or vice versa. Reassess compliance with oral treatment. Repeat biopsy at 6 months. If no regression after further 12 months: offer hysterectomy.",
    },

    "hysterectomy-no-atypia": {
      type: "end",
      title: "Total Hysterectomy — Treatment Failure / Patient Choice",
      text: "Total hysterectomy is appropriate for hyperplasia without atypia that fails to respond to progestogen treatment, or at patient request after full counselling. Ovarian conservation appropriate in most premenopausal women.",
    },

    "aeh": {
      type: "alert",
      title: "Atypical Hyperplasia (AEH/EIN) — Specialist Assessment Required",
      text: "AEH/EIN has ~8% concurrent endometrial cancer risk. Requires specialist management. MDT discussion recommended.",
      items: [
        "Pre-treatment MRI pelvis: to assess for myometrial invasion and exclude concurrent cancer",
        "Discuss with gynaecological oncology MDT",
        "Confirm fertility wishes before deciding treatment pathway",
        "If MRI suspicious for cancer: proceed directly to hysterectomy without conservative trial",
      ],
      next: "aeh-fertility",
    },

    "aeh-fertility": {
      type: "decision",
      title: "AEH/EIN — Fertility wishes?",
      options: [
        { label: "Family complete / no fertility desired — hysterectomy", sublabel: "Standard treatment; definitive", next: "aeh-hysterectomy" },
        { label: "Fertility desired — conservative management at specialist centre only", sublabel: "Requires full counselling; high relapse risk; 3-monthly surveillance", next: "aeh-conservative" },
      ],
    },

    "aeh-hysterectomy": {
      type: "end",
      title: "Total Hysterectomy for AEH/EIN",
      text: "Total hysterectomy is the recommended standard treatment. MRI pelvis pre-operatively. Thorough histological examination of specimen post-operatively.",
      items: [
        "Route: TLH preferred; or abdominal if contraindicated",
        "BSO: recommended in postmenopausal women; individualised decision in premenopausal women",
        "Post-operative histology: concurrent endometrial cancer found in up to 40% — must be reviewed by MDT",
        "If carcinoma confirmed: staging, MDT review, and adjuvant treatment as per oncology team",
      ],
    },

    "aeh-conservative": {
      type: "end",
      title: "Fertility-Sparing Management — AEH/EIN (Specialist Centres Only)",
      text: "Only at a centre with expertise. Full counselling of risks required. LNG-IUS ± high-dose oral progestogen. 3-monthly hysteroscopy + biopsy.",
      items: [
        "LNG-IUS 52 mg first-line; add high-dose MPA (400–600 mg/day) or megestrol (160 mg/day) if desired",
        "3-monthly hysteroscopy + directed biopsy throughout treatment",
        "If no regression at 3 months: increase dose / change regimen",
        "If regression confirmed (two negative biopsies): attempt conception without delay; refer reproductive medicine",
        "After completing childbearing: hysterectomy strongly recommended (high relapse rate)",
        "If no pregnancy in 2 years of CR: reassess; consider hysterectomy",
        "~30% fail conservative treatment — hysterectomy required",
      ],
    },
  },
};


export const GTG67_AEH_FLOWCHART = {
  id: "GTG67_AEH",
  title: "Atypical Hyperplasia (AEH/EIN) — Detailed Pathway",
  subtitle: "GTG67 — RCOG/BSGE",
  startId: "diagnosis",
  nodes: {

    "diagnosis": {
      type: "alert",
      title: "AEH / EIN Diagnosed on Biopsy",
      text: "Atypical endometrial hyperplasia (AEH) / Endometrial Intraepithelial Neoplasia (EIN) is a premalignant condition. Concurrent endometrial cancer risk ~8% (up to 40% at hysterectomy). Requires urgent specialist management.",
      items: [
        "Inform patient of diagnosis and malignancy risk sensitively",
        "Arrange MRI pelvis urgently (within 2–4 weeks) to assess for myometrial invasion",
        "Discuss with gynaecological oncology MDT",
        "Confirm fertility wishes before management decision",
      ],
      next: "mri",
    },

    "mri": {
      type: "action",
      title: "MRI Pelvis — Urgent",
      text: "MRI pelvis is recommended before any conservative management to exclude myometrial invasion or concurrent cancer.",
      items: [
        "If MRI shows myometrial invasion or features suspicious for cancer: do NOT attempt conservative treatment — proceed to hysterectomy",
        "If MRI normal (no invasion): conservative treatment may be offered to women wishing to preserve fertility",
        "MRI also useful for planning surgery (route, complexity, lymph node involvement)",
      ],
      next: "mri-result",
    },

    "mri-result": {
      type: "decision",
      title: "MRI pelvis result?",
      options: [
        { label: "Myometrial invasion / features suspicious for concurrent endometrial cancer", sublabel: "Proceed to hysterectomy; do not trial conservative treatment", next: "hysterectomy" },
        { label: "Normal MRI — no invasion seen", sublabel: "Can offer conservative management if fertility desired", next: "fertility-decision" },
      ],
    },

    "fertility-decision": {
      type: "decision",
      title: "Fertility wishes?",
      options: [
        { label: "No desire for fertility / Family complete", sublabel: "Hysterectomy recommended", next: "hysterectomy" },
        { label: "Strongly desires fertility / Unfit for surgery — conservative management", sublabel: "Specialist centre; full informed consent required", next: "conservative" },
      ],
    },

    "hysterectomy": {
      type: "action",
      title: "Total Hysterectomy",
      text: "Standard definitive treatment for AEH/EIN. Removes risk of progression to endometrial cancer.",
      items: [
        "Total laparoscopic hysterectomy (TLH) preferred if surgically suitable",
        "BSO: recommended in postmenopausal women; discuss with premenopausal women",
        "Intraoperative frozen section: not recommended routinely for AEH (wait full histology)",
        "Post-operative histology review: essential — up to 40% have concurrent cancer",
        "If carcinoma confirmed: refer to oncology MDT for staging and adjuvant treatment",
      ],
      next: "post-op",
    },

    "post-op": {
      type: "decision",
      title: "Post-operative histology — concurrent endometrial cancer?",
      options: [
        { label: "AEH only — no concurrent carcinoma", sublabel: "No further oncological treatment; routine follow-up", next: "no-cancer" },
        { label: "Concurrent endometrial carcinoma identified", sublabel: "Urgent oncology MDT; staging investigations", next: "concurrent-cancer" },
      ],
    },

    "no-cancer": {
      type: "end",
      title: "AEH Only at Hysterectomy — Discharge",
      text: "No endometrial cancer at hysterectomy. Routine post-operative follow-up. No further gynaecological cancer surveillance required. Address modifiable risk factors.",
    },

    "concurrent-cancer": {
      type: "end",
      title: "Concurrent Endometrial Cancer — Oncology MDT",
      text: "Refer to gynaecological oncology MDT urgently. Staging MRI ± CT. Adjuvant treatment (radiotherapy, chemotherapy) per FIGO stage and MDT recommendation.",
    },

    "conservative": {
      type: "action",
      title: "Conservative (Fertility-Sparing) Treatment — Specialist Centre Only",
      text: "Only at centres with expertise in conservative management of AEH. Full informed consent including cancer risk. Multi-disciplinary approach with reproductive medicine.",
      items: [
        "LNG-IUS 52 mg: insert at start of treatment; leave in situ throughout",
        "High-dose oral progestogen: MPA 400–600 mg/day OR megestrol acetate 160 mg/day (some centres add to LNG-IUS)",
        "3-monthly hysteroscopy + directed biopsy to assess response",
        "Reproductive medicine referral: for ovulation induction or IVF planning concurrent with or after remission",
      ],
      next: "conservative-response",
    },

    "conservative-response": {
      type: "decision",
      title: "Response at 3-monthly hysteroscopy + biopsy?",
      options: [
        { label: "Complete remission — normal endometrium on two consecutive biopsies", sublabel: "Attempt conception without delay", next: "remission" },
        { label: "Partial response — hyperplasia reduced but not resolved", sublabel: "Continue treatment; review regimen; re-biopsy at 3 months", next: "partial" },
        { label: "No response / progression to carcinoma", sublabel: "Hysterectomy required; stop conservative management", next: "failed-conservative" },
      ],
    },

    "remission": {
      type: "action",
      title: "Complete Remission — Attempt Conception",
      text: "Two consecutive normal biopsies achieved. Attempt conception without delay — relapse risk increases with time.",
      items: [
        "Refer to reproductive medicine for fertility treatment as appropriate",
        "Continue LNG-IUS: may remove to allow natural conception if preferred, but relapse risk increases",
        "Ongoing 6-monthly surveillance biopsies during conception attempts",
        "After completed childbearing: strongly recommend hysterectomy",
        "If no pregnancy within 2 years of remission: reassess; consider hysterectomy",
      ],
      next: "conception-outcome",
    },

    "conception-outcome": {
      type: "decision",
      title: "Conception achieved?",
      options: [
        { label: "Pregnancy achieved — deliver safely", sublabel: "Return to gynaecology after childbearing for hysterectomy discussion", next: "post-pregnancy" },
        { label: "No pregnancy after 2 years / Relapse on surveillance", sublabel: "Reassess; hysterectomy recommended", next: "relapse" },
      ],
    },

    "post-pregnancy": {
      type: "end",
      title: "Post-Childbearing — Hysterectomy Recommended",
      text: "Strongly recommend hysterectomy after childbearing is complete. High relapse rate of AEH after conservative treatment. Full counselling regarding ongoing cancer risk if surgery declined.",
    },

    "partial": {
      type: "action",
      title: "Partial Response — Review and Continue",
      text: "Hyperplasia present but improving. Review treatment compliance. Consider increasing dose or changing progestogen. Continue 3-monthly surveillance.",
      items: [
        "Check compliance with oral progestogen if used",
        "Check LNG-IUS position (USS or hysteroscopy)",
        "Consider adding/increasing oral progestogen if LNG-IUS alone",
        "Re-biopsy at 3 months",
        "If no complete remission by 9–12 months: consider hysterectomy",
      ],
      next: "conservative-response",
    },

    "failed-conservative": {
      type: "end",
      title: "Conservative Treatment Failed — Hysterectomy Required",
      text: "No response, persistence of AEH, or progression to carcinoma. Hysterectomy is now required. Discuss with oncology MDT if carcinoma confirmed.",
      items: [
        "Counsel woman sensitively about treatment failure",
        "Arrange hysterectomy urgently if cancer progression",
        "Post-operative histology essential — full oncological staging if cancer found",
      ],
    },

    "relapse": {
      type: "end",
      title: "Relapse / No Pregnancy — Hysterectomy Recommended",
      text: "Relapse of AEH after remission, or no pregnancy after 2 years. Hysterectomy is strongly recommended. If woman declines, restart progestogen treatment with intensified surveillance.",
    },
  },
};
