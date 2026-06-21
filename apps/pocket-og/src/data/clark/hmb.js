export const HMB_PROTOCOL = {
  id: "hmb",
  title: "Heavy Menstrual Bleeding",
  subtitle: "Assessment & management",
  category: "gynaecology",
  guideline: "NICE NG88",
  color: "rose",
  startId: "red_flags_q",
  nodes: {

    // ─── Red flags first ───────────────────────────────────────────────────────

    "red_flags_q": {
      type: "question",
      question: "Any red flag features?",
      subtitle: "Screen before proceeding — some presentations need a different pathway",
      options: [
        { label: "Postmenopausal bleeding",          sublabel: "Any bleeding >12 months after last period",     next: "pmb_referral"   },
        { label: "Persistent IMB or postcoital bleeding", sublabel: "At any age — investigate before treating", next: "imb_path"        },
        { label: "HMB only — no red flags",                                                                     next: "history"        },
      ],
    },

    "pmb_referral": {
      type: "escalation",
      title: "Postmenopausal bleeding — 2WW referral",
      alert: "Any unexplained vaginal bleeding after menopause requires urgent suspected cancer referral. Do not treat empirically.",
      items: [
        "Refer under 2-week wait — gynaecology urgent suspected cancer pathway",
        "Do not delay referral to trial treatment first",
        "Ensure up-to-date cervical smear",
        "Treat iron deficiency anaemia in primary care while awaiting appointment",
        "Document: date of referral, last menstrual period, any risk factors for endometrial cancer",
      ],
      next: "documentation",
    },

    "imb_path": {
      type: "checklist",
      title: "IMB / PCB — initial assessment",
      alert: "Do not treat HMB empirically if IMB or PCB is the primary concern — investigate first.",
      items: [
        "STI screen: NAAT for Chlamydia trachomatis and Neisseria gonorrhoeae — essential if <25 or new/multiple partners",
        "Cervical smear: check history — arrange if overdue before proceeding to treatment",
        "FBC: Hb if significant blood loss suspected",
        "Proceed to speculum examination — findings will determine next steps",
      ],
      next: "imb_bleeding_active_q",
    },

    "imb_bleeding_active_q": {
      type: "question",
      question: "Is there significant ongoing or heavy bleeding right now?",
      subtitle: "Bridging medical treatment can be started immediately while investigations are pending",
      options: [
        { label: "Yes — bleeding is active, heavy, or distressing",        next: "imb_interim_tx" },
        { label: "No — mild, episodic, or currently settled",              next: "cervix_exam_q"  },
      ],
    },

    "imb_interim_tx": {
      type: "treatment",
      title: "Interim medical treatment — active IMB",
      sections: [
        {
          title: "Norethisterone — arrest or reduce ongoing bleeding",
          drugs: [
            {
              drug: "Norethisterone",
              dose: "5 mg TDS orally",
              note: "Continue until bleeding stops, then for a further 7 days. Withdrawal bleed expected 2–4 days after stopping. Avoid if personal/family history of VTE or migraine with aura.",
            },
          ],
        },
        {
          title: "Tranexamic acid — if heavy loss component",
          drugs: [
            {
              drug: "Tranexamic acid",
              dose: "1 g (2 × 500 mg) up to QDS",
              note: "During heavy bleeding days only — max 4 days per episode. Reduces blood loss ~50%. Avoid if history of VTE.",
            },
          ],
        },
        {
          title: "Key points",
          items: [
            "These are bridging treatments only — do not delay investigation",
            "Both can be used together — additive effect on blood loss",
            "Treat iron deficiency anaemia concurrently if Hb is low",
            "Proceed to speculum examination regardless of treatment response",
          ],
        },
      ],
      next: "cervix_exam_q",
    },

    "cervix_exam_q": {
      type: "question",
      question: "What does the cervix look like on speculum?",
      subtitle: "Any contact bleeding, ulceration, or irregular surface requires urgent referral",
      options: [
        { label: "Suspicious — contact bleeding, ulceration, or irregular surface", sublabel: "Urgent 2WW referral needed",                             next: "cervix_2ww"          },
        { label: "Ectropion visible",                                                sublabel: "Columnar epithelium on ectocervix — common, usually benign", next: "ectropion_symptom_q" },
        { label: "Cervical polyp",                                                  sublabel: "Pedunculated, soft, often bleeds on contact",               next: "cervical_polyp_path" },
        { label: "Normal cervix — no abnormality found",                            sublabel: "Assess endometrium next",                                    next: "imb_uss_q"           },
      ],
    },

    "cervix_2ww": {
      type: "escalation",
      title: "Suspicious cervix — urgent 2WW referral",
      alert: "Any cervix with contact bleeding, ulceration, irregular surface, or suspicious appearance must be referred urgently. Do not treat in primary care.",
      items: [
        "Refer under 2-week wait — gynaecology urgent suspected cervical cancer pathway",
        "Colposcopy referral if smear shows any grade of CIN — do not wait for further symptoms",
        "Do not biopsy in primary care — refer to colposcopy/gynaecology",
        "Cervical smear if overdue — but do not delay 2WW referral for the result",
        "Reassure patient: referral is precautionary — most cervical biopsies are benign",
      ],
      next: "documentation",
    },

    "ectropion_symptom_q": {
      type: "question",
      question: "Is the ectropion causing symptoms?",
      subtitle: "Ectropion is common and often asymptomatic — only treat if it is the likely cause of the PCB or discharge",
      options: [
        { label: "Yes — causing PCB, discharge, or discomfort", next: "ectropion_treatment" },
        { label: "No — incidental finding, patient asymptomatic", next: "imb_uss_q" },
      ],
    },

    "ectropion_treatment": {
      type: "treatment",
      title: "Symptomatic cervical ectropion",
      sections: [
        {
          title: "Management options",
          items: [
            "Reassurance first: explain ectropion is benign — normal columnar tissue on the outside of the cervix",
            "Cryotherapy: first-line office treatment — single freeze, effective in ~80%",
            "Silver nitrate application: for small symptomatic ectropion at colposcopy",
            "Refer to colposcopy if: cryotherapy not available, diagnosis uncertain, or smear abnormal",
          ],
        },
        {
          title: "After treatment",
          items: [
            "Vaginal discharge and spotting for 2–4 weeks post-cryotherapy — counsel in advance",
            "Review at 6–8 weeks — most resolve or improve significantly",
            "PCB persists after treatment: USS endometrium to exclude upper tract pathology",
          ],
        },
      ],
      next: "imb_uss_q",
    },

    "cervical_polyp_path": {
      type: "treatment",
      title: "Cervical polyp",
      sections: [
        {
          title: "Management",
          items: [
            "Small pedunculated polyps: can be avulsed in primary care — twist at base, apply silver nitrate to stump",
            "Send all removed tissue for histology — most are benign but rare malignancy reported",
            "Large or sessile polyps: refer to colposcopy / outpatient hysteroscopy — do not avulse in primary care",
          ],
        },
        {
          title: "Follow-up",
          items: [
            "Review histology — confirm benign and reassure patient when result available",
            "PCB persists after polypectomy: USS endometrium to exclude intrauterine pathology",
            "Recurrence is common — advise patient to report any further PCB",
          ],
        },
      ],
      next: "imb_uss_q",
    },

    "imb_uss_q": {
      type: "question",
      question: "What does pelvic USS show?",
      subtitle: "Transvaginal USS preferred — endometrial thickness and intrauterine cavity",
      options: [
        { label: "Thickened or irregular endometrium",       sublabel: ">11 mm premenopausal mid-cycle, or any thickness warranting investigation", next: "imb_biopsy"           },
        { label: "Intrauterine polyp or submucosal fibroid",                                                                                        next: "polyp_path"           },
        { label: "Normal endometrium and cavity",                                                                                                    next: "imb_no_abnormality_q" },
        { label: "USS not yet performed / pending",                                                                                                  next: "imb_arrange_uss"      },
      ],
    },

    "imb_arrange_uss": {
      type: "checklist",
      title: "Arrange USS — pending result",
      items: [
        "Transvaginal USS — request urgently if age ≥45 or risk factors present",
        "Ensure STI result is reviewed and acted on when available",
        "Safety-net: advise patient to return urgently if bleeding becomes heavy or new symptoms develop",
        "Return to this protocol when USS result is back to decide next step",
      ],
      next: "documentation",
    },

    "imb_biopsy": {
      type: "checklist",
      title: "Endometrial biopsy — perform or arrange",
      items: [
        "Pipelle biopsy: outpatient, <60 seconds — first-line for endometrial sampling",
        "NSAID 30–60 min before (e.g. ibuprofen 400 mg) reduces cramping",
        "If USS suggests focal polyp: hysteroscopy preferred — Pipelle misses focal lesions in ~60%",
        "Indications met: thickened USS endometrium, age ≥45, or persistent unexplained IMB/PCB",
      ],
      next: "biopsy_result_q",
    },

    "imb_no_abnormality_q": {
      type: "question",
      question: "Patient age and symptom status?",
      subtitle: "Normal cervix, normal USS — decide next step based on age, risk, and persistence",
      options: [
        { label: "≥ 45 years or significant risk factors", sublabel: "BMI >30, PCOS, diabetes, family history of endometrial cancer", next: "imb_biopsy"  },
        { label: "< 45 years, low risk, symptoms settled",                                                                             next: "imb_reassure" },
        { label: "< 45 years, low risk, but symptoms persist",                                                                         next: "imb_refer"    },
      ],
    },

    "imb_reassure": {
      type: "treatment",
      title: "Likely benign — reassure and safety-net",
      sections: [
        {
          title: "Management",
          items: [
            "STI result: review and treat if positive (Chlamydia: doxycycline 100 mg BD × 7 days)",
            "Reassure: most IMB/PCB in low-risk women <45 with normal investigations is benign",
            "Advise return if: symptoms persist beyond 2 further cycles, worsen, or new symptoms develop",
            "Consider LNG-IUS or CHC if concurrent HMB or contraception desired",
          ],
        },
      ],
      next: "documentation",
    },

    "imb_refer": {
      type: "escalation",
      title: "Refer to gynaecology — persistent unexplained IMB/PCB",
      items: [
        "Persistent symptoms despite normal cervix, normal USS, and negative STI screen — refer secondary care",
        "Include in referral: age, smear history, STI result, USS report, treatments tried",
        "Hysteroscopy ± directed biopsy will be the likely next step in secondary care",
        "Safety-net: advise patient to attend urgently if bleeding becomes heavy or new symptoms develop",
      ],
      next: "documentation",
    },

    // ─── History & examination ─────────────────────────────────────────────────

    "history": {
      type: "checklist",
      title: "Take a focused history",
      items: [
        "Cycle: length, duration, volume of loss, clots, flooding",
        "Associated symptoms: dysmenorrhoea, IMB, PCB, pelvic pressure, urinary frequency",
        "Quality-of-life impact — work, social, daily activities",
        "Future fertility wishes — critical for treatment planning",
        "Contraception requirements",
        "Previous treatments tried and response",
        "Bleeding disorders: HMB since menarche, family or personal bleeding history → check VWF, FVIII",
      ],
      next: "examination",
    },

    "examination": {
      type: "checklist",
      title: "Examine the patient",
      items: [
        "BMI — >30 is a risk factor for endometrial cancer",
        "Abdominal palpation — palpable uterus suggests significant fibroids → refer",
        "Pelvic examination if appropriate: uterine size, mobility, tenderness, adnexal mass",
        "FBC — treat iron deficiency anaemia concurrently",
        "Coagulation screen if HMB since menarche or personal/family bleeding history (VWF, FVIII)",
      ],
      next: "structural_q",
    },

    // ─── Structural pathology branch ───────────────────────────────────────────

    "structural_q": {
      type: "question",
      question: "Is structural pathology suspected?",
      subtitle: "Palpable uterus, bulk symptoms (pressure, urinary frequency), or prior abnormal USS",
      options: [
        { label: "Yes — or USS already abnormal",        next: "get_uss"  },
        { label: "No — no structural cause suspected",   next: "lng_q"    },
      ],
    },

    "get_uss": {
      type: "checklist",
      title: "Arrange pelvic USS",
      items: [
        "Transvaginal USS preferred — superior for endometrium and fibroids",
        "Transabdominal additionally if uterus palpable abdominally",
        "Report should include: uterine size, endometrial thickness, fibroid size / location / FIGO type, ovaries",
        "SIS (saline infusion sonography) if polyp or submucosal fibroid suspected on standard scan",
      ],
      next: "uss_findings_q",
    },

    "uss_findings_q": {
      type: "question",
      question: "What does the USS show?",
      options: [
        { label: "Endometrial polyp or submucosal fibroid",              next: "polyp_path"       },
        { label: "Fibroids ≥ 3 cm / multiple / distorting cavity",       next: "fertility_q"      },
        { label: "Thickened / abnormal endometrium or adenomyosis",      next: "biopsy_path"      },
        { label: "Normal — no significant findings",   sublabel: "Manage as no structural pathology",  next: "lng_q" },
      ],
    },

    // ─── Polyp / submucosal fibroid path ──────────────────────────────────────

    "polyp_path": {
      type: "treatment",
      title: "Polyp or submucosal fibroid — refer for hysteroscopy",
      sections: [
        {
          title: "Outpatient hysteroscopy",
          items: [
            "Gold standard for intrauterine pathology — outpatient preferred (no-touch technique ± LA)",
            "NSAID 30–60 minutes before procedure",
            "Polypectomy at time of diagnostic hysteroscopy if polyp identified",
            "Send all tissue for histology",
            "Submucosal fibroid: characterise FIGO type (0–2) and plan myomectomy",
          ],
        },
        {
          title: "After polypectomy",
          items: [
            "Review at 6–8 weeks — most women have significant improvement",
            "Symptoms recur: repeat hysteroscopy, LNG-IUS, or ablation",
          ],
        },
        {
          title: "Hysteroscopic myomectomy (submucosal fibroid)",
          items: [
            "GnRH analogue × 3 months pre-op if anaemic or fibroid large",
            "Type 0: usually complete resection in one procedure",
            "Type 1–2: may require staged procedures",
            "If fertility desired: allow 3–6 months before conception after myomectomy",
          ],
        },
      ],
      next: "documentation",
    },

    // ─── Fibroids ≥ 3 cm path ─────────────────────────────────────────────────

    "fertility_q": {
      type: "question",
      question: "Does she want to preserve fertility?",
      subtitle: "This determines which surgical options are appropriate",
      options: [
        { label: "Yes — future pregnancy desired",  next: "fibroid_fertility_path" },
        { label: "No — family complete",            next: "fibroid_symptom_q"      },
      ],
    },

    "fibroid_fertility_path": {
      type: "treatment",
      title: "Fibroids — fertility-preserving surgical options",
      sections: [
        {
          title: "Surgical options",
          items: [
            "Hysteroscopic myomectomy — submucosal fibroids FIGO type 0–2",
            "Laparoscopic myomectomy — intramural fibroids (ideally ≤3 fibroids, ≤10 cm); skilled surgeon required",
            "Open myomectomy — large, multiple, or complex fibroid configurations",
            "GnRH analogue × 3 months pre-op if large or anaemic — reduces size and blood loss",
            "Allow 3–6 months before conception after myomectomy",
          ],
        },
        {
          title: "Do NOT offer",
          items: [
            "UAE is NOT recommended if fertility desired — risk of premature ovarian failure",
            "Endometrial ablation is contraindicated if fertility desired",
          ],
        },
        {
          title: "Medical bridging while awaiting surgery",
          items: [
            "Tranexamic acid 1 g QDS during heavy days",
            "Relugolix (Ryeqo) — oral GnRH antagonist with HRT add-back; sustained symptom relief",
            "GnRH analogue (goserelin / leuprorelin) — temporary shrinkage pre-operatively",
          ],
        },
      ],
      next: "documentation",
    },

    "fibroid_symptom_q": {
      type: "question",
      question: "What is the primary symptom?",
      subtitle: "Family complete — determines which interventions to prioritise",
      options: [
        { label: "HMB only",                                            next: "fibroid_surgical_q" },
        { label: "Bulk symptoms — pressure, urinary frequency, pain",   next: "fibroid_bulk_path"  },
        { label: "Both HMB and bulk symptoms",                          next: "fibroid_bulk_path"  },
      ],
    },

    "fibroid_bulk_path": {
      type: "treatment",
      title: "Bulk symptoms — options",
      sections: [
        {
          title: "Medical bridging (temporary relief only)",
          items: [
            "Relugolix (Ryeqo) — oral GnRH antagonist with HRT add-back; sustained symptom relief",
            "GnRH analogue (goserelin) — temporary fibroid shrinkage; symptoms recur after stopping",
          ],
        },
        {
          title: "Definitive — choose surgical approach",
          items: [
            "UAE: addresses both HMB and bulk symptoms; MRI required first",
            "Myomectomy: removes fibroids, preserves uterus; recurrence ~30% at 5 years",
            "Hysterectomy: definitively addresses both HMB and bulk symptoms",
          ],
        },
      ],
      next: "fibroid_surgical_q",
    },

    "fibroid_surgical_q": {
      type: "question",
      question: "Which surgical approach does she prefer?",
      subtitle: "Shared decision — discuss pros, cons, and recovery for each",
      options: [
        { label: "UAE",           sublabel: "Non-surgical · uterus preserved · MRI required first",     next: "uae_path"          },
        { label: "Myomectomy",    sublabel: "Surgical · remove fibroids · keep uterus",                 next: "myomectomy_path"   },
        { label: "Hysterectomy",  sublabel: "Definitive · no further HMB · discuss route",             next: "hysterectomy_path" },
      ],
    },

    "uae_path": {
      type: "treatment",
      title: "Uterine Artery Embolisation (UAE)",
      sections: [
        {
          title: "Pre-procedure",
          items: [
            "MRI pelvis required first — maps fibroid vascularity and anatomy",
            "NOT recommended if fertility desired — risk of premature ovarian failure",
          ],
        },
        {
          title: "Procedure and outcomes",
          items: [
            "Interventional radiology — no surgical incision",
            "Fibroid shrinkage 40–70%; effective for most fibroid types and sizes",
            "Post-embolisation syndrome: pain, fever, nausea for 3–7 days — plan analgesia in advance",
            "Hospital stay 1–2 days; recovery 1–2 weeks",
            "Re-intervention rate ~20–30% at 5 years",
            "Rare risks: premature menopause (1–2%), fibroid expulsion, endometritis",
          ],
        },
      ],
      next: "documentation",
    },

    "myomectomy_path": {
      type: "treatment",
      title: "Laparoscopic or Open Myomectomy",
      sections: [
        {
          title: "Route selection",
          items: [
            "Laparoscopic: preferred if ≤3 fibroids and ≤10 cm; experienced laparoscopic surgeon required",
            "Open (abdominal): for large, multiple, or complex fibroid configurations",
            "GnRH analogue × 3 months pre-op if large or anaemic — reduces size and blood loss",
            "Intraoperative cell salvage for large cases",
          ],
        },
        {
          title: "Outcomes",
          items: [
            "Recurrence rate ~30% by 5 years",
            "Re-operation rate ~15% by 5 years",
            "Correct anaemia to Hb ≥100 g/L pre-operatively",
          ],
        },
      ],
      next: "documentation",
    },

    "hysterectomy_path": {
      type: "treatment",
      title: "Hysterectomy",
      sections: [
        {
          title: "Route — discuss with patient",
          items: [
            "Vaginal: preferred if uterus mobile and not enlarged; shorter recovery, fewest complications",
            "Laparoscopic (TLH / LAVH): minimally invasive; 2–4 weeks recovery; preferred when vaginal not suitable",
            "Abdominal: for very large uteri, significant adhesions, or complex anatomy; 4–8 weeks recovery",
          ],
        },
        {
          title: "Pre-operative",
          items: [
            "Correct anaemia: target Hb ≥100 g/L before surgery",
            "GnRH analogue × 3 months if fibroids very large — reduces uterine size",
            "Discuss ovarian conservation — avoids surgical menopause but retains ovarian cancer risk",
          ],
        },
        {
          title: "Post-operative",
          items: [
            "VTE prophylaxis: LMWH per unit protocol",
            "Pathology review of uterus post-operatively",
            "If oophorectomy performed: oestrogen-only HRT — no progestogen needed post-hysterectomy",
            "Patient satisfaction at 5 years: ~90%",
          ],
        },
      ],
      next: "documentation",
    },

    // ─── Endometrial biopsy path ───────────────────────────────────────────────

    "biopsy_path": {
      type: "checklist",
      title: "Endometrial biopsy indicated",
      items: [
        "Indications: endometrial thickening on USS, treatment failure in women ≥45, risk factors (BMI >30, PCOS, diabetes, tamoxifen, Lynch syndrome)",
        "Pipelle biopsy: outpatient procedure, <60 seconds, NSAID 30–60 minutes before",
        "False-negative rate for focal lesions ~60% — hysteroscopy required if polyp also suspected",
        "Adenomyosis features on USS: trial LNG-IUS or refer to gynaecology",
      ],
      next: "biopsy_result_q",
    },

    "biopsy_result_q": {
      type: "question",
      question: "What did the biopsy show?",
      options: [
        { label: "Normal / inactive / proliferative",                sublabel: "Treat HMB",                    next: "lng_q"             },
        { label: "Hyperplasia without atypia",                                                                next: "hyperplasia_path"  },
        { label: "Atypical hyperplasia (AEH/EIN) or carcinoma",      sublabel: "Urgent oncology referral",     next: "aeh_urgent"        },
      ],
    },

    "hyperplasia_path": {
      type: "treatment",
      title: "Endometrial hyperplasia without atypia",
      sections: [
        {
          title: "First-line treatment",
          items: [
            "LNG-IUS — regression rate >90% at 6 months; maintain for ≥12 months post-regression",
            "If LNG-IUS declined: norethisterone 10–15 mg daily",
            "6-monthly endometrial biopsy until two consecutive negative biopsies",
            "Address underlying risk factors: weight reduction, diabetes control",
          ],
        },
        {
          title: "Refer to gynaecology if",
          items: [
            "Persistent hyperplasia after 12 months of treatment",
            "Patient preference for hysterectomy",
            "HMB uncontrolled despite treatment",
          ],
        },
      ],
      next: "documentation",
    },

    "aeh_urgent": {
      type: "escalation",
      title: "Atypical hyperplasia / EIN — urgent referral",
      alert: "AEH/EIN carries 25–30% risk of concurrent or subsequent endometrial cancer. Do not manage in primary care.",
      items: [
        "Urgent MDT referral — gynaecological oncology input required for all cases",
        "Hysterectomy + bilateral salpingo-oophorectomy: recommended if family complete",
        "Fertility-sparing (specialist centres only): high-dose progestogen + LNG-IUS; mandatory 3-monthly hysteroscopy + biopsy",
        "Staging: MRI pelvis ± CT/PET if cancer suspected",
        "Advise patient clearly about the cancer risk — document the conversation",
      ],
      next: "documentation",
    },

    // ─── Pharmacological pathway ───────────────────────────────────────────────

    "lng_q": {
      type: "question",
      question: "Is LNG-IUS (Mirena) acceptable and suitable?",
      subtitle: "Most effective pharmacological option — reduces HMB by 71–95%. First-line unless contraindicated or declined.",
      options: [
        { label: "Yes — patient accepts, no contraindications",                                                         next: "lng_offer"       },
        { label: "No — declined or contraindicated",  sublabel: "Current breast cancer, distorted cavity, active PID",  next: "contraception_q" },
      ],
    },

    "lng_offer": {
      type: "treatment",
      title: "LNG-IUS (Mirena 52 mg) — First-Line",
      sections: [
        {
          title: "Insertion & counselling",
          items: [
            "Insert at any time in the menstrual cycle",
            "Irregular spotting very common in first 3–6 months — counsel before insertion so she is not surprised",
            "~50% of users achieve amenorrhoea within 12 months",
            "Contraception: >99.8% efficacy; fertility returns rapidly after removal",
          ],
        },
        {
          title: "Follow-up",
          items: [
            "Review at 3–6 months — irregular bleeding usually settles",
            "Treat iron deficiency anaemia concurrently",
            "Effective for up to 5 years; re-insert at 5 years if still indicated",
          ],
        },
      ],
      next: "lng_response_q",
    },

    "lng_response_q": {
      type: "question",
      question: "LNG-IUS response at 3–6 months?",
      options: [
        { label: "Good — HMB improved, spotting reducing or settled",            next: "lng_continue"            },
        { label: "Inadequate — HMB persists, or IUS expelled / not tolerated",  next: "refer_treatment_failure" },
      ],
    },

    "lng_continue": {
      type: "treatment",
      title: "Continue LNG-IUS — annual review",
      sections: [
        {
          title: "Ongoing management",
          items: [
            "Annual review — recheck FBC if anaemia was present",
            "LNG-IUS effective for up to 5 years — re-insert at 5 years if still indicated",
            "Advise patient to return if symptoms change, IMB/PCB develops, or new symptoms arise",
            "Endometrial biopsy if ≥45 years and new risk factors develop",
          ],
        },
      ],
      next: "documentation",
    },

    "contraception_q": {
      type: "question",
      question: "Does she want contraception?",
      options: [
        { label: "Yes — contraception desired",           next: "hormonal_tx"     },
        { label: "No — no contraception needed",          next: "non_hormonal_tx" },
      ],
    },

    "hormonal_tx": {
      type: "treatment",
      title: "Hormonal options — with contraceptive benefit",
      sections: [
        {
          title: "Combined hormonal contraception (CHC)",
          items: [
            "Combined pill (e.g. Microgynon, Rigevidon) — reduces blood loss by ~40–50%",
            "Use back-to-back to reduce cycle frequency and number of bleeds per year",
            "Patch (Evra) or ring (NuvaRing) — similar efficacy to combined pill",
            "Check UKMEC categories before prescribing",
          ],
        },
        {
          title: "Progestogen-only options",
          items: [
            "Norethisterone 5 mg TDS day 5–26 — reduces loss ~80%; not contraceptive at this dose",
            "Injectable progestogen (Depo-Provera) or implant — reduce HMB; variable bleeding pattern initially",
          ],
        },
      ],
      next: "tx_response_q",
    },

    "non_hormonal_tx": {
      type: "treatment",
      title: "Non-hormonal options",
      sections: [
        {
          title: "First-line",
          drugs: [
            { drug: "Tranexamic acid",  dose: "1 g (2 × 500 mg) up to QDS",   note: "During heavy bleeding only — max 4 days per cycle. Reduces loss ~50%. Avoid if history of VTE." },
            { drug: "Mefenamic acid",   dose: "500 mg TDS during bleeding",    note: "Reduces loss ~20–30%; also helps dysmenorrhoea. Avoid in renal disease or peptic ulcer disease." },
            { drug: "Ibuprofen",        dose: "400–600 mg TDS during bleeding", note: "Alternative NSAID — similar efficacy to mefenamic acid." },
          ],
        },
        {
          title: "Combination",
          items: [
            "Tranexamic acid + NSAID can be used together — additive effect on blood loss",
          ],
        },
      ],
      next: "tx_response_q",
    },

    "tx_response_q": {
      type: "question",
      question: "Response to treatment at 3–6 months?",
      options: [
        { label: "Satisfactory — symptoms adequately controlled",               next: "continue_tx"             },
        { label: "Inadequate — persists after ≥2 pharmacological options",     next: "refer_treatment_failure" },
      ],
    },

    "continue_tx": {
      type: "treatment",
      title: "Continue effective treatment — annual review",
      sections: [
        {
          title: "Ongoing",
          items: [
            "Annual review or sooner if symptoms change",
            "Reassess if: new IMB/PCB develops, approaching perimenopause, treatment no longer effective",
            "Endometrial biopsy if ≥45 years and risk factors for endometrial cancer develop",
          ],
        },
      ],
      next: "documentation",
    },

    "refer_treatment_failure": {
      type: "escalation",
      title: "Refer to gynaecology — treatment failure",
      items: [
        "Treatment failure after ≥2 pharmacological options — refer to secondary care gynaecology",
        "Include in referral: FBC result, USS findings, treatments tried and duration, fertility wishes",
        "Continue iron replacement while awaiting appointment",
        "Bridging treatment: tranexamic acid or NSAID for symptom relief while waiting",
        "Surgical options (ablation or hysterectomy) will be discussed at secondary care appointment",
      ],
      next: "documentation",
    },

    // ─── Documentation ────────────────────────────────────────────────────────

    "documentation": {
      type: "end",
      title: "Document on EPR",
      subtitle: "Before you leave the patient",
      items: [
        "Cycle details — length, duration, volume, flooding, clots",
        "Associated symptoms — dysmenorrhoea, IMB, PCB, bulk symptoms",
        "Fertility wishes and contraception requirements",
        "Examination findings — BMI, palpable uterus, pelvic findings",
        "FBC result — Hb, iron deficiency if present",
        "USS findings if performed",
        "Biopsy result if performed",
        "Red flag features and action taken",
        "Treatment offered and patient decision",
        "Counselling given — e.g. irregular spotting with LNG-IUS",
        "Follow-up plan and review date",
      ],
    },

  },
};
