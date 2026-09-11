// Source: Felker A, Patel R, Evans T, Knight M (Eds.) on behalf of MBRRACE-UK.
// Saving Lives, Improving Mothers' Care Compiled Report: Lessons learned to inform
// maternity care from the UK and Ireland Confidential Enquiries into Maternal Deaths
// and Morbidity 2022-24. NPEU, University of Oxford, September 2026.
// DOI: 10.5287/ora-bprerr4px
//
// Surveillance figures (section 1) are UK only, as in Chapter 2 of the report.
// Chapter figures (sections 3-8) are UK and Ireland unless stated. Where the report
// quotes other guidance (NICE, RCOG, FICM/ICS, NHS England Maternal Care Bundle),
// that source is named in the text.

export const MBRRACE_SLMC2026_SECTIONS = [
  {
    id: "slmc2026-overview",
    gl: "MBRRACE_SLMC2026",
    condition: "Surveillance 2022–24",
    setting: "All Settings",
    title: "MBRRACE 2026: Key Surveillance Findings",
    tags: [
      "mbrrace", "mbrrace-uk", "mbrrace 2026", "saving lives improving mothers care", "slmc", "slmc 2026",
      "maternal mortality", "maternal death", "maternal death rate", "confidential enquiry",
      "uk maternal mortality", "leading causes maternal death", "late maternal death",
      "inequalities maternity", "black maternal mortality", "deprivation maternal death",
      "resuscitative hysterotomy survival",
    ],
    content: [
      {
        type: "text",
        value: "MBRRACE-UK's 2026 Saving Lives, Improving Mothers' Care report covers maternal deaths in 2022–24. In that period, 252 women died from direct and indirect causes during or up to six weeks after pregnancy in the UK, a maternal death rate of 12.80 per 100,000 maternities. This is unchanged from 2021–23 (12.82) but 20% higher than in 2009–11, when the previous government set an ambition to halve maternal mortality in England by 2025. A further 24 deaths were classified as coincidental.",
      },
      {
        type: "subheading",
        value: "Leading causes of direct and indirect maternal death (up to 6 weeks)",
      },
      {
        type: "list",
        items: [
          "1st: Thrombosis and thromboembolism (42 women)",
          "2nd: Cardiac disease (39 women)",
          "3rd: Mental health conditions (35 women: 18 suicides; 17 from drugs, alcohol or other psychiatric causes)",
          "4th: Epilepsy and stroke (30 women)",
          "5th equal: Infection, excluding COVID-19 (26 women)",
          "5th equal: Other physical conditions (26 women)",
        ],
      },
      {
        type: "alert",
        value: "COVID-19 is no longer a leading cause of maternal death: six women died from COVID-19 in 2022–24, none of them in 2024. With COVID-19 deaths excluded, overall and indirect maternal death rates were still significantly higher than in 2019–21.",
      },
      {
        type: "subheading",
        value: "Direct and indirect deaths",
      },
      {
        type: "list",
        items: [
          "The rate of direct maternal deaths has risen 57% since 2009–11",
          "Indirect causes account for 54% of all direct and indirect deaths",
          "Direct (obstetric) causes only: VTE is first (2.13 per 100,000), then suicide (0.91) and sepsis (0.86). Cardiac disease is classified as an indirect cause, so it is second overall but does not appear in the direct-cause ranking",
          "Obstetric haemorrhage and amniotic fluid embolism caused deaths at equal rates in the UK (0.41 per 100,000 each)",
          "After cardiac disease, the leading indirect causes are neurological conditions (1.52 per 100,000) and other indirect causes, including general medical and surgical disorders (1.32 per 100,000). Both are 43–44% higher than in 2019–21, though not statistically significantly",
          "Deaths from other psychiatric causes (drugs, alcohol, others) rose to 0.86 per 100,000, three times the 2009–11 rate",
        ],
      },
      {
        type: "subheading",
        value: "Late deaths (6 weeks to 1 year after pregnancy)",
      },
      {
        type: "list",
        items: [
          "322 women died, 16.35 per 100,000 maternities, a 20% rise since 2009–11",
          "Suicide remains the leading cause of late death",
          "Psychiatric causes account for 33% of late deaths (suicide 19%, substance use 14%)",
        ],
      },
      {
        type: "subheading",
        value: "Inequalities (rates per 100,000 maternities)",
      },
      {
        type: "list",
        items: [
          "Black women: 32.42 vs 11.93 for White women, nearly three times the risk (RR 2.72; England)",
          "Asian women: 15.14, slightly higher than White women but not statistically significant (RR 1.27; England)",
          "Most deprived fifth of areas: 18.10 vs 9.32 in the least deprived, about twice the rate (RR 1.94; England)",
          "Age 35 or over: RR 1.62 compared with age 25–29; age 40 or over: nearly three times the risk (RR 2.89)",
          "28% of the women who died were born outside the UK; their overall rate was not significantly different from that of UK-born women",
        ],
      },
      {
        type: "subheading",
        value: "The women who died",
      },
      {
        type: "list",
        items: [
          "60% had pre-existing medical problems (excluding obesity); 33% were obese and 28% overweight",
          "47% had known mental health problems, 10% higher than in 2019–21",
          "21% had experienced domestic abuse; 20% were known to social services",
          "16% had severe and multiple disadvantages: three or more of substance use, domestic abuse, childhood abuse, arrival in the UK within 5 years, refugee or asylum seeker status, a mental health diagnosis, female genital mutilation, or known learning difficulties",
          "Only 46% of those who received antenatal care received the NICE-recommended level (booked by 10 weeks, no routine visits missed)",
          "41 babies were born by resuscitative hysterotomy; 17 (41%) survived, up from 26% in 2019–21 (not statistically significant)",
          "438 children were left motherless",
        ],
      },
      {
        type: "alert",
        value: "Of 178 women whose care was reviewed in the confidential enquiries, 16% received good care. For 61%, improvements in care may have made a difference to the outcome.",
      },
    ],
  },

  {
    id: "slmc2026-recommendations",
    gl: "MBRRACE_SLMC2026",
    condition: "Key Messages",
    setting: "All Settings",
    title: "MBRRACE 2026: New Recommendations & Recurring Messages",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace recommendations", "mbrrace 2026 recommendations", "national recommendations maternity",
      "maternal care bundle", "mews all settings", "remember the mother", "postnatal contraception",
      "theatre capacity caesarean", "rapid access antibiotics", "urgent prescribing",
      "electronic patient records maternity", "risk counselling pregnancy", "pre-pregnancy counselling",
      "get ready for pregnancy", "joined-up care", "safeguarding maternity",
    ],
    content: [
      {
        type: "text",
        value: "The report makes five new national recommendations for areas where there is no current national guidance. Most of its other recommendations restate existing guidance that needs better implementation.",
      },
      {
        type: "subheading",
        value: "New national recommendations",
      },
      {
        type: "list",
        items: [
          "Review theatre and workforce capacity planning guidance to manage the additional workload from changing maternal characteristics and associated caesarean section rates (Departments of Health)",
          "Ensure postnatal contraception can be prescribed and administered in maternity services for future pregnancy planning (Integrated Care Boards and commissioning bodies)",
          "Ensure there is a mechanism for rapid access to antibiotics in all hospital-based care settings, to allow rapid management of sepsis at the point of care (hospitals, trusts and health boards)",
          "Implement processes for acute community or hospital-based prescribing where an urgent start or change in medication is required (Integrated Care Boards, hospitals, trusts and health boards)",
          "Ensure multidisciplinary care gives high-risk women with complex medical comorbidities consistent advice on birth planning, medication adherence and monitoring, and vaccination, including vaccination of infants exposed to biologic medications (Integrated Care Boards and commissioning bodies)",
        ],
      },
      {
        type: "subheading",
        value: "Safety messages repeated across chapters",
      },
      {
        type: "list",
        items: [
          "Service provision and acuity: capacity across emergency triage, staffing and operating theatres must keep pace with increasing maternal complexity and clinical demand, with escalation pathways for periods of high acuity",
          "Electronic patient records: different systems within and between trusts, primary care and emergency services lead to gaps in communication and missed deterioration; integrating early warning scores and key correspondence should be prioritised",
          "Risk counselling must be trauma informed and balanced. Where a woman becomes pregnant or makes decisions against medical advice, document robustly, safety-net clearly and offer follow-up",
        ],
      },
      {
        type: "subheading",
        value: "Clinical messages",
      },
      {
        type: "list",
        items: [
          "Record maternal observations using MEWS for all pregnant or recently pregnant women in all settings, not just maternity",
          "Remember the mother: do not let focus on the baby or another task delay recognition of maternal deterioration, and listen to and escalate her concerns",
          "Recognise rapid deterioration: pregnant women tend to be young and fit and may compensate physiologically before a rapid decline",
          "Care should be proactive, not reactive: prepare and plan with multidisciplinary input",
          "Provide joined-up care: senior oversight and effective multidisciplinary working, with all MDT discussions and decisions clearly documented",
          "Get ready for pregnancy: use the time before conception or between pregnancies (including after miscarriage) to optimise medications, weight, smoking and mental health",
          "Incorporate safeguarding into all aspects of maternity care, especially for women facing multiple disadvantages",
          "Plan for care outside maternity wards, with defined management plans and clear communication between hospitals and specialties",
        ],
      },
      {
        type: "alert",
        value: "NHS England's Maternal Care Bundle (January 2026) is referenced throughout the report. Intervention 2.1 is to implement the national MEWS tool across all settings for women who are, or have been, pregnant in the past 4 weeks, with timely obstetric or obstetric physician review in line with MEWS escalation timeframes.",
      },
    ],
  },

  {
    id: "slmc2026-haemorrhage",
    gl: "MBRRACE_SLMC2026",
    condition: "Haemorrhage & AFE",
    setting: "Intrapartum / Postpartum",
    title: "MBRRACE 2026: Obstetric Haemorrhage & Amniotic Fluid Embolism",
    flowchartId: "GTG52_PPH",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace haemorrhage", "mbrrace pph", "mbrrace afe", "amniotic fluid embolism death",
      "obstetric haemorrhage death", "massive obstetric haemorrhage", "concealed haemorrhage",
      "clauss fibrinogen", "rotem", "teg", "fibrinogen 2 g/l", "cumulative blood loss", "cell salvage",
      "placenta accreta mbrrace", "caesarean capacity", "planned caesarean delay", "intraosseous access",
      "perimortem caesarean haemorrhage protocol",
    ],
    content: [
      {
        type: "text",
        value: "In the UK and Ireland, 11 women died from obstetric haemorrhage in 2022–24 (0.52 per 100,000 maternities), lower than in previous triennia but not significantly so. Six died after caesarean birth, one after assisted vaginal birth and four after spontaneous vaginal birth. Eight women died from amniotic fluid embolism (0.38 per 100,000); all died after caesarean birth, on the day they gave birth.",
      },
      {
        type: "alert",
        value: "Caesarean capacity is now a patient safety issue. In England, 45% of births in 2025 were by caesarean section, compared with 33% in 2020. When a planned caesarean is a time-critical risk-reduction intervention, treat its cancellation or delay as a clinical incident, with senior input, documented re-evaluation of the risks of delay and an agreed MDT plan.",
      },
      {
        type: "subheading",
        value: "Recognition",
      },
      {
        type: "list",
        items: [
          "Consider haemorrhage, which may be concealed, when classic signs of hypovolaemia are present (tachycardia and/or agitation, and the late sign of hypotension), even without revealed bleeding",
          "Several deaths involved delayed recognition while attention was on perineal repair, fetal heart auscultation or the baby",
          "Document blood loss, blood products, fluids and fluid balance, and update them regularly during ongoing haemorrhage. Be especially alert when cell salvage is used, as it makes real-time measurement of blood loss difficult",
          "A senior clinician should take a \"helicopter view\" to coordinate all aspects of care during major obstetric haemorrhage",
        ],
      },
      {
        type: "subheading",
        value: "Management (existing guidance needing better implementation)",
      },
      {
        type: "list",
        items: [
          "Trigger the massive obstetric haemorrhage protocol in an undelivered woman at the time the decision to proceed to perimortem caesarean section is made",
          "Do not deny clotting products on the basis of a single measure of coagulation in the face of ongoing haemorrhage",
          "Maternal Care Bundle (expert consensus): with concern about coagulopathy, abruption, fetal demise, suspected concealed bleeding, maternal cardiac arrest, suspected AFE or PPH over 1,000 mL, perform a coagulation test (Clauss fibrinogen or TEG/ROTEM point-of-care testing) to guide cryoprecipitate or fibrinogen concentrate, keeping fibrinogen above 2 g/L",
          "Maternal Care Bundle 5.1: measure cumulative blood loss at all births, with scales and a swab weight chart, under-buttock drapes for assisted vaginal births, a haemorrhage trolley or grab bag, and real-time documentation",
          "Maternal Care Bundle 5.3: MDT case review within a month for all bleeds over 2 L and every use of cryoprecipitate or fibrinogen concentrate",
          "Investigate and treat antenatal anaemia, as this may reduce PPH-associated morbidity (GTG52)",
          "Major obstetric haemorrhage protocols should include guidance for difficult intravascular access, considering intraosseous devices and staff training",
          "All maternity staff should be trained in managing obstetric emergencies, including PPH (GTG52)",
        ],
      },
      {
        type: "subheading",
        value: "Placenta accreta spectrum",
      },
      {
        type: "list",
        items: [
          "Elective delivery with suspected placenta accreta spectrum should be managed by an MDT including senior anaesthetists, obstetricians and gynaecologists experienced in the condition; in an emergency, involve the most senior clinicians available",
          "Caesarean sections are major operations: all team members, including any planned senior surgical support, should be present at the start of surgery",
          "For current PAS management, see the Placenta Praevia & Accreta Spectrum guide (GTG27a, 2026)",
        ],
      },
      {
        type: "subheading",
        value: "Amniotic fluid embolism",
      },
      {
        type: "list",
        items: [
          "Three of the eight women who died from AFE collapsed shortly after induction of labour",
          "In almost all AFE deaths, assessors noted excellent multidisciplinary resuscitation, with timely resuscitative hysterotomy by both hospital and pre-hospital teams",
        ],
      },
      {
        type: "subheading",
        value: "Future pregnancy",
      },
      {
        type: "list",
        items: [
          "High-risk women who have been advised about the risks of another pregnancy should be able to get contraception before discharge from maternity care (new national recommendation)",
          "Home birth planning for high-risk women benefits from senior MDT input covering the limits of treatment at home and the speed of transfer in an emergency",
        ],
      },
    ],
  },

  {
    id: "slmc2026-infection",
    gl: "MBRRACE_SLMC2026",
    condition: "Infection & Sepsis",
    setting: "All Settings",
    title: "MBRRACE 2026: Prevention & Treatment of Infection",
    flowchartId: "GTG64_SEPSIS",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace sepsis", "mbrrace infection", "maternal sepsis death", "sepsis six", "think sepsis",
      "group a strep pregnancy", "invasive group a streptococcus", "igas postpartum",
      "group b strep maternal sepsis", "e coli sepsis pregnancy", "pprom sepsis", "pprom before 23 weeks",
      "erythromycin pprom", "penicillin allergy pregnancy", "penicillin de-labelling", "mews not news2",
      "ng255", "covid vaccination pregnancy", "influenza vaccine pregnancy", "martha's rule",
      "cerclage monofilament",
    ],
    content: [
      {
        type: "text",
        value: "49 women in the UK and Ireland died from infection in 2022–24, 33 of them during pregnancy or up to six weeks after (1.47 per 100,000 maternities). Of the 20 direct (pregnancy-related) infection deaths, 75% were caused by three organisms: E. coli (8), group B streptococcus (4) and group A streptococcus (3).",
      },
      {
        type: "alert",
        value: "New national recommendation: ensure rapid access to antibiotics in all hospital-based care settings. NICE NG255: give a broad-spectrum antimicrobial without delay, within 1 hour of identifying that a pregnant or recently pregnant woman with suspected sepsis meets any high-risk criterion.",
      },
      {
        type: "subheading",
        value: "Recognition",
      },
      {
        type: "list",
        items: [
          "Think sepsis at an early stage in any unwell pregnant or recently pregnant woman; take all appropriate observations and act on them",
          "Use MEWS, not NEWS2, for pregnant and recently pregnant women, including in the emergency department. Where a system supports several early warning scores, alerts for these women must be configured to MEWS",
          "Respiratory rate and oxygen saturation were the abnormal observations most often not recognised or escalated",
          "In the postnatal period, record a full set of vital signs (pulse, blood pressure, temperature, respiratory rate) in any woman with symptoms or signs of ill health",
          "Repeated presentation to the GP, community midwife, triage or day assessment unit is a red flag and warrants thorough assessment for sepsis",
          "NICE NG255 factors that increase the risk of sepsis, or of it not being identified promptly: ethnic minority background; communication challenges; drug or alcohol misuse; social, economic or environmental factors such as homelessness or living in a deprived area",
          "Use professional interpreters rather than family members, especially in emergencies. Assessors raised concerns that pallor and jaundice were missed because of skin tone",
        ],
      },
      {
        type: "subheading",
        value: "The Sepsis Six (UK Sepsis Trust), within one hour of suspected sepsis",
      },
      {
        type: "list",
        items: [
          "1. Ensure a senior clinician attends",
          "2. Give oxygen if required (start if saturations are less than 92%)",
          "3. Obtain intravenous access and take bloods (including blood cultures, glucose, lactate, FBC, U&Es, CRP, LFTs, clotting)",
          "4. Give intravenous antibiotics",
          "5. Give intravenous fluids",
          "6. Monitor (use an appropriate early warning score and measure urine output)",
        ],
      },
      {
        type: "subheading",
        value: "Specific organisms",
      },
      {
        type: "list",
        items: [
          "Group A streptococcus: pregnant women are at 20 times greater risk of GAS infection than non-pregnant women, and deterioration can be extremely rapid. Always treat GAS as a pathogen, and have standard pathways for following up results that need urgent treatment",
          "If the woman or the baby has invasive GAS disease postpartum, treat both with antibiotics and adopt full infection control precautions (GTG64)",
          "Group B streptococcus causes severe maternal sepsis, not only neonatal infection. Document a positive GBS result so it is available in future pregnancies, and follow up postpartum women with known or suspected GBS, particularly those with cardiac or respiratory symptoms (auscultate the heart)",
        ],
      },
      {
        type: "subheading",
        value: "PPROM",
      },
      {
        type: "list",
        items: [
          "Five women died from sepsis after PPROM, all from E. coli and all with intrauterine fetal death; four had ruptured their membranes before 22 weeks",
          "Oral erythromycin alone does not give enough cover to prevent or treat clinical chorioamnionitis or maternal sepsis, particularly from gram-negative organisms such as E. coli",
          "There is no national or international guidance on antibiotics after PPROM before 23 weeks. The risk of ascending infection is no lower at earlier gestations, so consider a very low threshold for admission and observation",
          "Counsel clearly about the baby's chances of survival and the maternal risk of sepsis if the pregnancy continues; only two of the five women had this documented",
          "The risk of maternal sepsis does not end with delivery: keep monitoring for deterioration afterwards",
          "Monofilament cerclage sutures carry a lower infection risk than braided sutures and should be considered in women at high risk of sepsis",
        ],
      },
      {
        type: "subheading",
        value: "Other lessons",
      },
      {
        type: "list",
        items: [
          "Penicillin allergy: five women who died from sepsis had a recorded penicillin allergy. Clarify severity, consider testing and de-labelling before pregnancy, and have a clear alternative regimen",
          "Ambulance and remote triage often did not account for recent pregnancy. Ask whether a woman has been pregnant in the last four weeks, including pregnancies ending in miscarriage or termination",
          "Martha's Rule, which ensures concerns from patients, families and staff are acted on, will be implemented in all maternity settings in England",
          "Vaccination: neither woman who died from influenza had been vaccinated in pregnancy, and 60% of the ten women who died from COVID-19 were unvaccinated. When a vaccine is declined, gently revisit it at each visit. No maternal deaths have been attributed to any vaccine since MBRRACE-UK reporting began in 2009",
          "Of the 49 women who died from infection, 43% were obese and 24% overweight",
        ],
      },
    ],
  },

  {
    id: "slmc2026-epilepsy",
    gl: "MBRRACE_SLMC2026",
    condition: "Epilepsy",
    setting: "Pre-pregnancy / Antenatal / Postnatal",
    title: "MBRRACE 2026: Epilepsy & Seizure Disorders",
    flowchartId: "GTG68_SEIZURE",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace epilepsy", "sudep", "sudep pregnancy", "sudep risk factors", "epilepsy death pregnancy",
      "lamotrigine levels pregnancy", "levetiracetam levels pregnancy", "anti-seizure medication monitoring",
      "asm levels", "valproate postnatal", "functional dissociative seizures", "non-epileptic seizures pregnancy",
      "epilepsy in pregnancy team", "ethosuximide", "pregabalin seizures", "lacosamide",
    ],
    content: [
      {
        type: "text",
        value: "Neurological conditions were the second leading indirect cause, and the fourth leading overall cause, of maternal death in 2022–24. Fifteen women in the UK and Ireland died from causes related to epilepsy, 13 of them from sudden unexpected death in epilepsy (SUDEP); two more had suspected SUDEP without a formal epilepsy diagnosis. There was no specific period of risk. Of the 19 women who died from epilepsy or other seizure disorders, nine were undelivered, four died in the early postnatal period and six more than six weeks after pregnancy.",
      },
      {
        type: "alert",
        value: "Intermittent seizures were repeatedly treated as normal. Increasing seizure frequency or a change in seizure type needs proactive review, just as an abnormal blood pressure or glucose would.",
      },
      {
        type: "subheading",
        value: "Joined-up care",
      },
      {
        type: "list",
        items: [
          "Maternal Care Bundle 3.1: every pregnant woman with epilepsy should have access to a local epilepsy in pregnancy team (at minimum an epilepsy nurse specialist or neurologist, a maternal medicine obstetrician, and an obstetric physician where available). 3.2: women needing more complex care should be referred to the maternal medicine network MDT",
          "Maternal Care Bundle expert consensus: case review and triage within 2 weeks of the first NHS contact with a positive pregnancy test; highest-risk women seen in person for a medication review within a further 2 weeks; follow-up within 14 days of the end of pregnancy to review medication, postpartum risks and contraception",
          "New national recommendation: processes for urgent prescribing at the point of care. In one case, a dose increase was delayed because a letter was sent asking the GP to prescribe it",
        ],
      },
      {
        type: "subheading",
        value: "Medication monitoring",
      },
      {
        type: "list",
        items: [
          "Many women who died did not have their anti-seizure medication levels monitored. The absence of a pre-pregnancy baseline should not prevent monitoring or clinically indicated dose changes",
          "Lamotrigine levels are reported to fall by up to 70% in pregnancy (GTG68), and levetiracetam levels can drop as early as the first trimester. Lamotrigine clearance varies so much that fixed dose adjustments are unreliable",
          "NICE NG217: when starting monitoring in women planning pregnancy, obtain a baseline (pre-conception) level and check adherence",
        ],
      },
      {
        type: "subheading",
        value: "Choice of anti-seizure medication",
      },
      {
        type: "list",
        items: [
          "Several women were on medicines or combinations that are not first-line. Re-assess regimens at transition from paediatric to adult services; for example, ethosuximide controls absence seizures only",
          "Pregabalin is not a first-line anti-seizure medication and can exacerbate some seizure types",
          "Combining lacosamide with other sodium channel-blocking medicines can cause neurotoxic effects (dizziness, diplopia, ataxia) that may affect adherence; monitor levels of each medicine where indicated",
          "Remember the mother: after pregnancy it may be appropriate to reassess seizure control and restart a previously effective medicine that was avoided in pregnancy. For valproate, this means effective contraception and the Pregnancy Prevention Programme",
        ],
      },
      {
        type: "subheading",
        value: "SUDEP risk factors (NICE NG217)",
      },
      {
        type: "list",
        items: [
          "Non-adherence to medication",
          "Alcohol and drug misuse",
          "Focal to bilateral tonic-clonic or generalised tonic-clonic seizures",
          "Uncontrolled seizures",
          "Living alone",
          "Sleeping alone without supervision",
        ],
      },
      {
        type: "subheading",
        value: "Counselling and other lessons",
      },
      {
        type: "list",
        items: [
          "Talk to women and their partners or carers about the risk of SUDEP and how to minimise it (for example, sleep alarms or monitors for women who sleep alone). Pre-pregnancy counselling has focused on fetal risks, with little on the risks to women of uncontrolled seizures",
          "Functional/dissociative seizures (previously non-epileptic seizure disorder) do not respond to anti-seizure medication, but a new or changed seizure pattern still needs neurological review. Febrile seizures are rare in adults and need investigation",
          "NICE recommends more frequent monitoring reviews for women with learning disabilities",
        ],
      },
    ],
  },

  {
    id: "slmc2026-stroke",
    gl: "MBRRACE_SLMC2026",
    condition: "Stroke & Headache",
    setting: "Antenatal / Postnatal",
    title: "MBRRACE 2026: Stroke & Intracerebral Disease",
    flowchartId: "GL952_POSTNATAL",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace stroke", "stroke pregnancy", "intracerebral haemorrhage pregnancy",
      "subarachnoid haemorrhage pregnancy", "headache red flags pregnancy", "thunderclap headache pregnancy",
      "postnatal hypertension stroke", "bromocriptine", "cabergoline lactation suppression",
      "figo pregnancy passport", "aneurysm pregnancy", "ambulance pre-alert labour ward",
    ],
    content: [
      {
        type: "text",
        value: "20 women in the UK and Ireland died from stroke during or up to six weeks after pregnancy (12 intracerebral haemorrhage, 7 subarachnoid haemorrhage, 1 ischaemic stroke), and 21 died from stroke or other neurological causes between six weeks and one year. Of the 41 women who died from stroke, 8 (20%) had persistent hypertension.",
      },
      {
        type: "subheading",
        value: "Red flags in a pregnant woman with headache (RCP Acute Care Toolkit 15)",
      },
      {
        type: "list",
        items: [
          "Sudden-onset headache, thunderclap or worst headache ever",
          "Headache that takes longer than usual to resolve or persists for more than 48 hours",
          "Associated symptoms: fever, seizures, focal neurology, photophobia, diplopia",
          "Excessive use of opioids",
        ],
      },
      {
        type: "subheading",
        value: "Lessons",
      },
      {
        type: "list",
        items: [
          "Postnatal hypertension: the discharge summary must reach primary care, with key conditions and a clear postnatal plan in an initial summary box. Telephone reviews cannot measure blood pressure",
          "The FIGO pregnancy passport can be given before discharge to women with cardiometabolic risk factors; it covers follow-up checks and future health risks",
          "Do not attribute confusion or drowsiness to grief or mental health without investigating. Record MEWS for any woman with headache and new severe hypertension",
          "Bromocriptine is second line to cabergoline for lactation suppression. The MHRA says it is contraindicated in hypertension or cardiovascular conditions and should not be prescribed without regular blood pressure monitoring",
          "After treatment of an aneurysm in pregnancy, refer to maternal medicine for senior oversight and joint delivery planning; repeat imaging is normally within one to two months",
          "Women with a personal or family history of increased intracranial haemorrhage risk need consultant-led MDT care in a unit with on-site interventional radiology",
          "Use professional interpreters at every encounter, including 999 calls. Ambulance dispatch should identify pregnancy even for non-obstetric presentations such as stroke",
          "Maternal Care Bundle 2.2: a standardised pre-alert system between the ambulance service and labour ward",
        ],
      },
    ],
  },

  {
    id: "slmc2026-medical",
    gl: "MBRRACE_SLMC2026",
    condition: "Medical & Surgical Conditions",
    setting: "All Settings",
    title: "MBRRACE 2026: General Medical & Surgical Conditions",
    flowchartId: "GL983_DKA",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace medical", "mbrrace other indirect", "pancreatitis pregnancy", "gallstones pregnancy",
      "glp-1 pancreatitis", "dka pregnancy", "dka normal glucose", "phaeochromocytoma pregnancy",
      "neurofibromatosis pregnancy", "bowel obstruction pregnancy", "adhesions pregnancy",
      "asthma death pregnancy", "tocilizumab pregnancy", "biologics pregnancy", "maternal medicine network",
      "sle pregnancy death", "larc postnatal",
    ],
    content: [
      {
        type: "text",
        value: "27 women in the UK and Ireland died from general medical and surgical conditions during or up to six weeks after pregnancy (1.27 per 100,000 maternities), and 30 more between six weeks and one year. The largest groups were gastrointestinal (15, including 10 from pancreatitis), endocrine (11, including 8 with diabetes), respiratory (6), connective tissue disorders (6) and non-obstetric intra-abdominal bleeding (5).",
      },
      {
        type: "alert",
        value: "Pancreatitis deaths have risen sharply: ten in 2022–24, more than twice as many as in 2019–21 and five times as many as in 2013–15. Seven of the women had gallstones and all were overweight or obese. Consider pancreatitis in women with abdominal pain and vomiting, especially with a raised BMI or gallstones, and check serum amylase.",
      },
      {
        type: "subheading",
        value: "Risk factors for gallstones",
      },
      {
        type: "list",
        items: [
          "Female sex",
          "High oestrogen levels (including pregnancy)",
          "Age over 40 years",
          "BMI over 30 kg/m²",
          "Rapid weight loss or prolonged fasting",
          "A family history of gallstones",
          "Diabetes, Crohn's disease, cirrhosis and infections",
          "Diets high in refined sugars or fats and low in fibre",
        ],
      },
      {
        type: "text",
        value: "GLP-1 receptor agonists, increasingly used for weight loss, are linked to rare necrotising and fatal pancreatitis. They are contraindicated in pregnancy, but this could still present in pregnancy or postpartum.",
      },
      {
        type: "subheading",
        value: "Diabetes",
      },
      {
        type: "list",
        items: [
          "DKA can develop in pregnancy with only mildly raised, or normal, blood glucose. Measure blood ketones in any unwell woman with diabetes, especially if she is breathless",
          "Women with long-standing diabetes are at increased risk of severe hypoglycaemia and DKA",
          "Six of the eight women with diabetes who died were vulnerable. Disengagement, particularly postnatally or after the loss of a child, was often followed by deteriorating physical health",
        ],
      },
      {
        type: "subheading",
        value: "Other conditions",
      },
      {
        type: "list",
        items: [
          "Phaeochromocytoma (1 in 15,000 to 300,000 pregnancies) can mimic pre-eclampsia. Screening is recommended for new unexplained hypertension before 20 weeks, or hypertension without oedema or hyperuricaemia. Consider it in women with neurofibromatosis, especially with hypertension, headache, sweating or tachycardia",
          "Consider bowel obstruction from adhesions (including after caesarean section) in abdominal pain with new gastrointestinal symptoms",
          "Asthma: review in early pregnancy and postpartum, and check adherence and inhaler technique at every review (NICE NG245)",
          "Tocilizumab can be used in pregnancy and breastfeeding, provided the baby does not receive live vaccines for the first six months (UKTIS)",
        ],
      },
      {
        type: "subheading",
        value: "Networked care and counselling",
      },
      {
        type: "list",
        items: [
          "Care for women with similar conditions varied widely. The new national recommendation calls for consistent MDT advice on birth planning, medication, monitoring and vaccination, including vaccination of infants exposed to biologics",
          "Pre-pregnancy advice is the responsibility of all health professionals; assessors suggest extending this to all services, including emergency services and paediatrics",
          "Women with pre-existing medical conditions should have pre-pregnancy counselling from doctors experienced in managing their condition in pregnancy",
          "Maternity services should be able to offer all appropriate contraception, including LARC, before discharge (FSRH)",
          "When several specialties are involved, the responsible consultant obstetrician or physician must lead and coordinate care",
        ],
      },
    ],
  },

  {
    id: "slmc2026-critical-care",
    gl: "MBRRACE_SLMC2026",
    condition: "Critical Care & Anaesthesia",
    setting: "Hospital",
    title: "MBRRACE 2026: Critical Care & Anaesthesia",
    flowchartId: "MATERNAL_COLLAPSE_ARREST",
    tags: [
      "mbrrace", "mbrrace 2026", "mbrrace critical care", "maternal critical care", "icu pregnancy", "obstetric review icu",
      "mbrrace anaesthesia", "anaesthetic maternal deaths", "difficult iv access", "intraosseous",
      "starvation ketosis pregnancy", "pregnancy test icu", "neuroprognostication pregnancy",
      "maternal death coroner", "category 4 caesarean list", "diagnostic curiosity",
    ],
    content: [
      {
        type: "text",
        value: "For the first time since MBRRACE-UK reporting began, no woman in the UK and Ireland died from complications of anaesthesia (2022–24). Between 2021 and 2024, 144 women were admitted to ICU before they died. Sepsis was the most common cause of death (19%), followed by neurological and other indirect causes (17% each).",
      },
      {
        type: "subheading",
        value: "Critical care standards (FICM and ICS 2026, as cited)",
      },
      {
        type: "list",
        items: [
          "Every maternity patient in ICU needs a documented multidisciplinary (intensive care, obstetric and anaesthetic) consultant-led review at least once every 24 hours. Daily obstetric review is the minimum standard; under 20 weeks, gynaecology review may substitute, depending on local arrangements",
          "ICUs caring for maternity patients must have a named lead clinician and lead nurse for maternal critical care, and a clearly defined 24/7 escalation route",
          "Remote review of electronic records is not enough; critically ill women need face-to-face review",
          "Do not exclude pregnancy from the differential until a pregnancy test has been offered and is negative (NICE)",
          "Have a low threshold for considering starvation ketosis in pregnancy, measure blood ketones, and involve a dietitian",
          "Pregnant and recently pregnant women should receive the same standard of care as non-pregnant patients (for example, neuroprognostication after cardiac arrest) unless there is a clear clinical reason not to",
          "Support breastfeeding, milk expression and routine contact with the baby during intensive care",
        ],
      },
      {
        type: "subheading",
        value: "Anaesthetic lessons",
      },
      {
        type: "list",
        items: [
          "Identify anticipated difficult IV access antenatally, with a documented MDT plan. Size cannulae for the anticipated clinical scenario, and consider ultrasound guidance or intraosseous access early",
          "Maintain diagnostic curiosity when the course does not fit the expected pattern; fixation on pre-eclampsia delayed recognition of a phaeochromocytoma",
          "Women with complex needs should have timely antenatal MDT planning with an experienced obstetric anaesthetist",
          "Manage category 4 caesarean lists separately from more urgent caesareans, so they are not delayed to late in the day",
          "Units need escalation policies for high activity, including a plan to get more senior obstetric and anaesthetic help",
        ],
      },
      {
        type: "subheading",
        value: "After a maternal death",
      },
      {
        type: "list",
        items: [
          "Referral to the coroner (procurator fiscal in Scotland) remains mandatory for every woman who dies while pregnant or within 42 days of the end of pregnancy",
          "Keep clear, contemporaneous records of all conversations with the family (RCOG Good Practice Paper 18), and provide sustained support for staff",
        ],
      },
    ],
  },
];
