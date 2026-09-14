// NICE NG126 — Ectopic pregnancy and miscarriage: national early pregnancy
// workflows. Published 17 April 2019, last updated 17 June 2026.
// https://www.nice.org.uk/guidance/ng126
//
// Built from NG126's own recommendations, not from any trust pathway, so the
// app has national workflows that stand on their own. Local (RBH) flowcharts
// stay where they are as an optional overlay.
//
// Section numbers below are the June 2026 numbering, which renumbered the
// 2023 recommendations wholesale. Decision support only: these carry the
// thresholds, the guide carries the detail.

export const NG126_ASSESSMENT_FLOWCHART = {
  id: "NG126_ASSESSMENT",
  title: "Early Pregnancy: Assessment & Referral",
  subtitle: "NICE NG126 1.4 · who needs an early pregnancy assessment service",
  startId: "suspect",
  nodes: {

    "suspect": {
      type: "action",
      title: "Think Ectopic First",
      text: "In any woman of reproductive age with abdominal or pelvic pain, offer a pregnancy test, even when the symptoms look non-specific. Atypical presentation is common (1.4.2).",
      items: [
        "Common symptoms: abdominal or pelvic pain, amenorrhoea or a missed period, vaginal bleeding with or without clots",
        "Other symptoms: shoulder tip pain, dizziness or fainting, gastrointestinal or urinary symptoms, rectal pressure or pain on defecation, breast tenderness, passage of tissue",
        "Common signs: pelvic, adnexal or abdominal tenderness",
        "Other signs: cervical motion tenderness, rebound or peritoneal signs, pallor, tachycardia above 100, hypotension below 100/60, shock or collapse",
        "About a third of women with an ectopic pregnancy have no risk factors at all, so their absence does not reassure (1.4.8)",
      ],
      next: "acuity",
    },

    "acuity": {
      type: "decision",
      title: "How Is She Now?",
      text: "Symptoms and signs of ectopic pregnancy can resemble gastrointestinal conditions or urinary tract infection (1.4.5).",
      options: [
        { label: "Haemodynamically unstable, or significant concern about the degree of pain or bleeding", sublabel: "1.4.1", next: "ae" },
        { label: "Positive test with pain and abdominal tenderness, or pelvic tenderness, or cervical motion tenderness", sublabel: "1.4.7", next: "epau-now" },
        { label: "Bleeding or other early pregnancy symptoms, and none of the above", sublabel: "1.4.9 and 1.4.10", next: "triage" },
      ],
    },

    "ae": {
      type: "end",
      title: "Refer Directly to A&E",
      text: "Refer women who are haemodynamically unstable, or in whom there is significant concern about the degree of pain or bleeding, directly to A&E (1.4.1).",
    },

    "epau-now": {
      type: "end",
      title: "Refer Immediately to the Early Pregnancy Assessment Service",
      text: "Refer immediately for further assessment, or to the out-of-hours gynaecology service if the early pregnancy assessment service is not available (1.4.7).",
      items: [
        "Explain the reason for referral and what she can expect when she arrives (1.4.12)",
      ],
    },

    "triage": {
      type: "decision",
      title: "Gestation, Pain and Risk Factors",
      options: [
        { label: "Pain, or 6 weeks' gestation or more, or a pregnancy of uncertain gestation", sublabel: "1.4.9", next: "epau-refer" },
        { label: "Under 6 weeks, bleeding but not in pain, and no risk factors", sublabel: "1.4.10", next: "expectant" },
      ],
    },

    "epau-refer": {
      type: "end",
      title: "Refer to the Early Pregnancy Assessment Service",
      text: "The urgency of this referral depends on the clinical situation (1.4.9).",
    },

    "expectant": {
      type: "end",
      title: "Expectant Management, With Clear Safety Netting",
      text: "Use expectant management for women under 6 weeks' gestation who are bleeding but not in pain and have no risk factors, such as a previous ectopic pregnancy (1.4.10).",
      items: [
        "Return if bleeding continues or pain develops",
        "Repeat a urine pregnancy test after 7 to 10 days, and return if it is positive",
        "A negative pregnancy test means the pregnancy has miscarried",
        "Refer women who return with worsening symptoms that could suggest an ectopic pregnancy, immediately or within 24 hours depending on the clinical situation (1.4.11)",
      ],
    },

  },
};

export const NG126_VIABILITY_FLOWCHART = {
  id: "NG126_VIABILITY",
  title: "Ultrasound: Location & Viability",
  subtitle: "NICE NG126 1.5 and 1.6 · CRL and mean sac diameter thresholds",
  startId: "scan",
  nodes: {

    "scan": {
      type: "action",
      title: "Offer a Transvaginal Ultrasound Scan",
      text: "Offer women attending an early pregnancy assessment service a transvaginal scan to identify the location of the pregnancy and whether there is a fetal pole and heartbeat (1.5.1).",
      items: [
        "Consider a transabdominal scan where the uterus is enlarged or there is other pelvic pathology, such as fibroids or an ovarian cyst (1.5.2)",
        "If a transvaginal scan is unacceptable to her, offer a transabdominal scan and explain its limitations (1.5.3)",
        "Diagnosing miscarriage on a single scan cannot be guaranteed accurate, particularly at very early gestations (1.6.1)",
      ],
      next: "location",
    },

    "location": {
      type: "decision",
      title: "What Does the Scan Show?",
      options: [
        { label: "An intrauterine pregnancy", next: "viability" },
        { label: "Signs of a tubal ectopic pregnancy", sublabel: "Adnexal mass, tubal ring, or free fluid", next: "ectopic" },
        { label: "No intrauterine and no extrauterine pregnancy", sublabel: "Pregnancy of unknown location", next: "pul" },
      ],
    },

    "viability": {
      type: "decision",
      title: "Look for a Heartbeat First",
      text: "Look first for a fetal heartbeat. If there is none but a fetal pole is visible, measure the crown to rump length. Only measure the mean gestational sac diameter if no fetal pole is visible (1.6.2).",
      options: [
        { label: "Fetal heartbeat seen", next: "viable" },
        { label: "Fetal pole, no heartbeat", sublabel: "Measure crown to rump length", next: "crl" },
        { label: "No fetal pole", sublabel: "Measure mean gestational sac diameter", next: "msd" },
      ],
    },

    "viable": {
      type: "end",
      title: "Viable Intrauterine Pregnancy",
      text: "Where she has bleeding, see the threatened miscarriage pathway. Do not use gestational age from the last menstrual period alone to decide whether a heartbeat should be visible (1.6.9).",
    },

    "crl": {
      type: "decision",
      title: "Crown to Rump Length",
      options: [
        { label: "Less than 7.0 mm on transvaginal scan", sublabel: "1.6.3", next: "rescan-7" },
        { label: "7.0 mm or more on transvaginal scan", sublabel: "1.6.4", next: "second-opinion" },
        { label: "Measured transabdominally", sublabel: "1.6.5", next: "rescan-14" },
      ],
    },

    "msd": {
      type: "decision",
      title: "Mean Gestational Sac Diameter",
      options: [
        { label: "Less than 25.0 mm on transvaginal scan", sublabel: "1.6.6", next: "rescan-7" },
        { label: "25.0 mm or more on transvaginal scan", sublabel: "1.6.7", next: "second-opinion" },
        { label: "Measured transabdominally", sublabel: "1.6.8", next: "rescan-14" },
      ],
    },

    "rescan-7": {
      type: "end",
      title: "Rescan After a Minimum of 7 Days",
      text: "Perform a second scan a minimum of 7 days after the first before making a diagnosis. Further scans may be needed before a diagnosis can be made (1.6.3 and 1.6.6).",
      items: [
        "Tell her what to expect while waiting, and that waiting has no detrimental effect on the pregnancy (1.6.11)",
        "Give a 24-hour contact number for someone experienced in early pregnancy care (1.6.12)",
      ],
    },

    "second-opinion": {
      type: "end",
      title: "Second Opinion and/or Rescan After 7 Days",
      text: "Seek a second opinion on viability and/or perform a second scan a minimum of 7 days after the first before making a diagnosis (1.6.4 and 1.6.7).",
    },

    "rescan-14": {
      type: "end",
      title: "Record the Measurement, Rescan After 14 Days",
      text: "Where the measurement was taken transabdominally, record it and perform a second scan a minimum of 14 days after the first before making a diagnosis (1.6.5 and 1.6.8).",
    },

    "ectopic": {
      type: "end",
      title: "Signs of a Tubal Ectopic Pregnancy",
      text: "An adnexal mass moving separately to the ovary containing a gestational sac with a yolk sac, or with a fetal pole, indicates a tubal ectopic pregnancy (1.7.1). An empty gestational sac (tubal ring) or a complex inhomogeneous adnexal mass indicates a high probability (1.7.2).",
      items: [
        "Moderate to large free fluid in the peritoneal cavity or Pouch of Douglas may represent haemoperitoneum (1.7.4)",
        "For the high probability and possible signs, take into account the other scan findings, her clinical presentation and serum hCG before making a diagnosis (1.7.2 to 1.7.4)",
      ],
    },

    "pul": {
      type: "end",
      title: "Pregnancy of Unknown Location",
      text: "A positive pregnancy test with no intrauterine or extrauterine pregnancy seen. She could have an ectopic pregnancy until the location is determined (1.8.1). Follow the serial hCG pathway.",
      items: [
        "Where complete miscarriage is diagnosed without a previous scan confirming an intrauterine pregnancy, always consider a pregnancy of unknown location and follow up until a definitive diagnosis is reached (1.6.13)",
      ],
    },

  },
};

export const NG126_PUL_FLOWCHART = {
  id: "NG126_PUL",
  title: "Pregnancy of Unknown Location: Serial hCG",
  subtitle: "NICE NG126 1.8 · two measurements 48 hours apart",
  startId: "sample",
  nodes: {

    "sample": {
      type: "action",
      title: "Take Two hCG Measurements 48 Hours Apart",
      text: "Take 2 serum hCG measurements as near as possible to 48 hours apart, but no earlier, to determine subsequent management. Take further measurements only after review by a senior healthcare professional (1.8.5).",
      items: [
        "Do not use serum hCG to determine the location of the pregnancy (1.8.2)",
        "Place more importance on her clinical symptoms than on the hCG result, and review her if any symptoms change, whatever the previous results (1.8.3)",
        "Do not use serum progesterone as an adjunct to serial hCG (1.8.10)",
        "Whatever the level, give written information on what to do if symptoms are new or worsening, including how to access emergency care 24 hours a day (1.8.6)",
      ],
      next: "change",
    },

    "change": {
      type: "decision",
      title: "Change Over 48 Hours",
      options: [
        { label: "Increase greater than 63%", sublabel: "1.8.7", next: "likely-iup" },
        { label: "Decrease greater than 50%", sublabel: "1.8.8", next: "likely-loss" },
        { label: "Decrease less than 50%, or increase less than 63%", sublabel: "1.8.9", next: "review-24h" },
      ],
    },

    "likely-iup": {
      type: "end",
      title: "Likely Developing Intrauterine Pregnancy",
      text: "Tell her she is likely to have a developing intrauterine pregnancy, although an ectopic pregnancy cannot be excluded. Offer a transvaginal scan to determine the location between 7 and 14 days later (1.8.7).",
      items: [
        "Consider an earlier scan where the serum hCG is 1,500 IU/L or more",
        "If a viable intrauterine pregnancy is confirmed, offer routine antenatal care",
        "If it is not confirmed, refer for immediate clinical review by a senior gynaecologist",
      ],
    },

    "likely-loss": {
      type: "end",
      title: "Pregnancy Unlikely to Continue",
      text: "Tell her the pregnancy is unlikely to continue, but that this is not confirmed. Provide oral and written information about support and counselling services (1.8.8).",
      items: [
        "Ask her to take a urine pregnancy test 14 days after the second serum hCG test",
        "If negative, no further action is needed",
        "If positive, she should return to the early pregnancy assessment service for clinical review within 24 hours",
      ],
    },

    "review-24h": {
      type: "end",
      title: "Clinical Review Within 24 Hours",
      text: "Refer her for clinical review in the early pregnancy assessment service within 24 hours (1.8.9).",
    },

  },
};

export const NG126_MISCARRIAGE_FLOWCHART = {
  id: "NG126_MISCARRIAGE",
  title: "Management of Miscarriage",
  subtitle: "NICE NG126 1.9 to 1.12 · threatened, expectant, medical and surgical",
  startId: "which",
  nodes: {

    "which": {
      type: "decision",
      title: "Threatened, or Confirmed Miscarriage?",
      options: [
        { label: "Bleeding with a confirmed intrauterine pregnancy and a fetal heartbeat", sublabel: "Threatened miscarriage", next: "threatened" },
        { label: "Miscarriage confirmed on ultrasound", next: "expectant-suitable" },
      ],
    },

    "threatened": {
      type: "decision",
      title: "Any Previous Miscarriage?",
      text: "Progesterone is only for women with early pregnancy bleeding AND a previous miscarriage, and only where the intrauterine pregnancy is confirmed on a scan.",
      options: [
        { label: "Yes, she has had a previous miscarriage", sublabel: "1.9.2", next: "progesterone" },
        { label: "No previous miscarriage", sublabel: "1.9.1", next: "threatened-advice" },
      ],
    },

    "progesterone": {
      type: "end",
      title: "Offer Vaginal Micronised Progesterone 400 mg Twice Daily",
      text: "Offer vaginal micronised progesterone 400 mg twice daily to women with an intrauterine pregnancy confirmed by a scan who have vaginal bleeding and have previously had a miscarriage (1.9.2).",
      items: [
        "If a fetal heartbeat is confirmed, continue until 16 completed weeks of pregnancy (1.9.3)",
        "Progesterone can be started before a heartbeat is detected, but only once the pregnancy is confirmed intrauterine",
      ],
    },

    "threatened-advice": {
      type: "end",
      title: "Safety Netting and Routine Care",
      text: "Advise her to return for further assessment if the bleeding gets worse or persists beyond 14 days. If the bleeding stops, she should start or continue routine antenatal care (1.9.1).",
    },

    "expectant-suitable": {
      type: "decision",
      title: "Is Expectant Management Appropriate?",
      text: "Expectant management for 7 to 14 days is the first-line strategy for confirmed miscarriage. Explore other options where any of the following apply (1.10.1).",
      options: [
        { label: "None of the exclusions, and expectant management is acceptable to her", next: "expectant" },
        { label: "Increased risk of haemorrhage, late first trimester, coagulopathy, unable to have a transfusion, previous traumatic pregnancy experience, or evidence of infection", sublabel: "1.10.1", next: "route" },
        { label: "Expectant management is not acceptable to her", sublabel: "1.10.2", next: "route" },
      ],
    },

    "expectant": {
      type: "end",
      title: "Expectant Management for 7 to 14 Days",
      text: "Explain what it involves and that most women need no further treatment, and give oral and written information on what to expect, pain relief, and where and when to get help in an emergency (1.10.3 and 1.10.4).",
      items: [
        "If bleeding and pain resolve, give her a urine pregnancy test to do at home 3 weeks later, and advise her to return for individualised care if it is positive (1.10.5)",
        "Offer a repeat scan if bleeding and pain have not started, or are persisting or increasing, then discuss all three options again (1.10.6)",
        "Review a woman who continues with expectant management a minimum of 14 days after the first follow-up (1.10.7)",
      ],
    },

    "route": {
      type: "decision",
      title: "Medical or Surgical?",
      options: [
        { label: "Medical management, missed miscarriage", sublabel: "1.11.1", next: "medical-missed" },
        { label: "Medical management, incomplete miscarriage", sublabel: "1.11.3", next: "medical-incomplete" },
        { label: "Surgical management", sublabel: "1.12.1", next: "surgical" },
      ],
    },

    "medical-missed": {
      type: "end",
      title: "Mifepristone 200 mg, Then Misoprostol 800 micrograms",
      text: "For medical management of missed miscarriage offer 200 mg oral mifepristone and, 48 hours later, 800 micrograms misoprostol (vaginal, oral or sublingual) unless the gestational sac has already been passed (1.11.1).",
      items: [
        "Advise her to contact her healthcare professional if bleeding has not started within 48 hours of the misoprostol (1.11.2)",
        "Offer pain relief and anti-emetics as needed (1.11.5)",
        "Tell her what to expect: the length and extent of bleeding, pain, diarrhoea and vomiting, and when and how to seek help (1.11.6)",
        "In August 2023 this use of mifepristone and misoprostol was off label",
      ],
    },

    "medical-incomplete": {
      type: "end",
      title: "Misoprostol 600 micrograms, Single Dose",
      text: "For medical management of incomplete miscarriage use a single dose of misoprostol 600 micrograms (vaginal, oral or sublingual). 800 micrograms can be used instead so that protocols for missed and incomplete miscarriage match (1.11.3).",
      items: [
        "Do not offer mifepristone as a treatment for incomplete miscarriage (1.11.4)",
        "Offer pain relief and anti-emetics as needed (1.11.5)",
      ],
    },

    "surgical": {
      type: "end",
      title: "Manual Vacuum Aspiration or Theatre",
      text: "Where clinically appropriate, offer a choice of manual vacuum aspiration under local anaesthetic in an outpatient or clinic setting, or surgical management in a theatre under general anaesthetic (1.12.1).",
      items: [
        "Provide oral and written information about the options and what to expect during and after the procedure (1.12.2)",
      ],
    },

  },
};

export const NG126_ECTOPIC_FLOWCHART = {
  id: "NG126_ECTOPIC",
  title: "Tubal Ectopic: Expectant, Medical or Surgical",
  subtitle: "NICE NG126 1.14 to 1.17 · thresholds for each pathway",
  startId: "surgery-first",
  nodes: {

    "surgery-first": {
      type: "decision",
      title: "Any Indication for Surgery First Line?",
      text: "Offer surgery as a first-line treatment to women who are unable to return for follow-up after methotrexate, or who have any of the features below (1.15.2).",
      options: [
        { label: "Significant pain, adnexal mass 35 mm or larger, fetal heartbeat visible, serum hCG 5,000 IU/L or more, or unable to return for follow-up", sublabel: "1.15.2", next: "surgery" },
        { label: "None of these", next: "iup-excluded" },
      ],
    },

    "surgery": {
      type: "end",
      title: "Surgery, First Line",
      text: "Perform laparoscopically wherever possible, taking into account the woman's condition and the complexity of the procedure (1.16.1).",
      items: [
        "Offer a salpingectomy unless she has other risk factors for infertility (1.17.1)",
        "Consider salpingotomy as an alternative where there are risk factors for infertility such as contralateral tube damage (1.17.2)",
        "Tell women having a salpingotomy that up to 1 in 5 may need further treatment, which may include methotrexate or a salpingectomy (1.17.3)",
      ],
    },

    "iup-excluded": {
      type: "decision",
      title: "Is an Intrauterine Pregnancy Excluded on Ultrasound?",
      text: "Methotrexate is only for women with no intrauterine pregnancy, as confirmed on a scan (1.15.1).",
      options: [
        { label: "Yes, no intrauterine pregnancy on ultrasound", next: "hcg" },
        { label: "Not yet confirmed", next: "exclude-first" },
      ],
    },

    "exclude-first": {
      type: "end",
      title: "Exclude an Intrauterine Pregnancy Before Treating",
      text: "Methotrexate should only be offered on a first visit where there is a definitive diagnosis of ectopic pregnancy and a viable intrauterine pregnancy has been excluded (1.15.1).",
    },

    "hcg": {
      type: "decision",
      title: "Serum hCG, With a Woman Who Is Stable and Pain Free",
      text: "Expectant management applies only to women who are clinically stable and pain free, with a tubal ectopic under 35 mm, no visible heartbeat, and who can return for follow-up (1.14.1 and 1.14.2).",
      options: [
        { label: "1,000 IU/L or less", sublabel: "1.14.1, offer expectant management", next: "expectant-offer" },
        { label: "Above 1,000 and below 1,500 IU/L", sublabel: "1.14.2, consider expectant management", next: "expectant-consider" },
        { label: "1,500 up to below 5,000 IU/L", sublabel: "1.15.3, her choice of methotrexate or surgery", next: "choice" },
      ],
    },

    "expectant-offer": {
      type: "end",
      title: "Offer Expectant Management",
      text: "Offer expectant management to women who are clinically stable and pain free, with a tubal ectopic under 35 mm and no visible heartbeat, hCG of 1,000 IU/L or less, and who are able to return for follow-up (1.14.1). Methotrexate is also an option at this level (1.15.1).",
      items: [
        "Repeat hCG on days 2, 4 and 7 after the original test (1.14.3)",
        "If it falls by 15% or more from the previous value, repeat weekly until under 20 IU/L",
        "If it does not fall by 15%, stays the same or rises, review her condition and seek senior advice",
        "There seems to be no difference between expectant and medical management in the rate of ectopic pregnancies ending naturally, tubal rupture, or the need for further treatment (1.14.4)",
      ],
    },

    "expectant-consider": {
      type: "end",
      title: "Consider Expectant Management",
      text: "Consider expectant management for women who are clinically stable and pain free, with a tubal ectopic under 35 mm and no visible heartbeat, hCG above 1,000 and below 1,500 IU/L, and who are able to return for follow-up (1.14.2). Methotrexate is also an option below 1,500 IU/L (1.15.1).",
      items: [
        "Repeat hCG on days 2, 4 and 7 after the original test (1.14.3)",
        "Offer surgery where methotrexate is not acceptable to her (1.15.1)",
      ],
    },

    "choice": {
      type: "end",
      title: "Her Choice of Methotrexate or Surgery",
      text: "Offer the choice of either methotrexate or surgical management to women with hCG of at least 1,500 and less than 5,000 IU/L who are able to return for follow-up, and who have no significant pain, an unruptured ectopic under 35 mm with no visible heartbeat, and no intrauterine pregnancy (1.15.3).",
      items: [
        "After methotrexate, take hCG on days 4 and 7, then once weekly until a negative result (1.15.4)",
        "If hCG plateaus or rises, reassess her condition for further treatment (1.15.4)",
        "Advise women choosing methotrexate that the chance of needing further intervention is higher, and that they may need urgent admission if their condition deteriorates",
      ],
    },

  },
};

export const NG126_ANTID_FLOWCHART = {
  id: "NG126_ANTID",
  title: "Anti-D in Early Pregnancy",
  subtitle: "NICE NG126 1.18 · rewritten June 2026",
  startId: "rhd",
  nodes: {

    "rhd": {
      type: "decision",
      title: "Is She RhD Negative and Not Already Sensitised?",
      text: "Where the gestation measured on ultrasound differs from that calculated from the last menstrual period, use the ultrasound findings (1.18.1).",
      options: [
        { label: "RhD negative, no immune anti-D on her antibody screen", next: "gestation" },
        { label: "RhD positive, or already sensitised", next: "not-applicable" },
      ],
    },

    "not-applicable": {
      type: "end",
      title: "Anti-D Prophylaxis Does Not Apply",
      text: "Anti-D is prophylaxis, not treatment. Once a woman is already sensitised it has no benefit.",
    },

    "gestation": {
      type: "decision",
      title: "Gestation by Ultrasound",
      options: [
        { label: "Up to and including 11+6 weeks", sublabel: "1.18.1", next: "no-antid" },
        { label: "12+0 to 12+6 weeks", sublabel: "1.18.2 and 1.18.3", next: "indication" },
      ],
    },

    "no-antid": {
      type: "end",
      title: "Do Not Offer Anti-D",
      text: "Do not offer anti-D prophylaxis for an ectopic pregnancy, miscarriage or threatened miscarriage up to and including 11+6 weeks, including where the pregnancy is managed surgically (1.18.1).",
      items: [
        "Do not use a Kleihauer test to quantify feto-maternal haemorrhage (1.18.5)",
        "Guidance differs here: BSH (2014) advises a minimum of 250 IU for all ectopic pregnancies whatever the management. Both positions are set out in the NG126 and GTG22 guides",
      ],
    },

    "indication": {
      type: "decision",
      title: "What Is Happening at 12+0 to 12+6 Weeks?",
      options: [
        { label: "Medical management or a surgical procedure for ectopic pregnancy or miscarriage", sublabel: "1.18.2, offer", next: "offer-250" },
        { label: "Threatened miscarriage with heavy or recurrent bleeding", sublabel: "1.18.3, consider", next: "consider-250" },
      ],
    },

    "offer-250": {
      type: "end",
      title: "Offer At Least 250 IU Anti-D Ig",
      text: "Offer anti-D prophylaxis at a dose of at least 250 IU (50 micrograms) to women who are RhD negative and are at 12+0 to 12+6 completed weeks and having medical management or a surgical procedure to manage an ectopic pregnancy or miscarriage (1.18.2).",
      items: [
        "Discuss that anti-D is obtained from blood plasma but contains no blood cells, so she can make an informed choice (1.18.4)",
        "Do not use a Kleihauer test to quantify feto-maternal haemorrhage (1.18.5)",
      ],
    },

    "consider-250": {
      type: "end",
      title: "Consider At Least 250 IU Anti-D Ig",
      text: "Consider anti-D prophylaxis at a dose of at least 250 IU (50 micrograms) for women who are RhD negative at 12+0 to 12+6 completed weeks with threatened miscarriage and heavy or recurrent bleeding (1.18.3). The committee chose not to define heavy or recurrent, leaving it to clinical judgement.",
      items: [
        "Discuss that anti-D is obtained from blood plasma but contains no blood cells (1.18.4)",
      ],
    },

  },
};
