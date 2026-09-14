// NG126: Ectopic pregnancy and miscarriage, diagnosis and initial management
// (NICE guideline NG126, published 17 April 2019, last updated 17 June 2026).
//
// Source PDF: packages/guidelines/src/ectopic-pregnancy-and-miscarriage-
// diagnosis-and-initial-management-pdf-66141662244037.pdf (52 pages), also
// served to users from /guidelines/ at the same filename.
//
// Scope: early pregnancy, up to 13 completed weeks. Recommendation numbers in
// this file follow the current (June 2026) structure, 1.1 to 1.18. NICE marks
// recommendations with the year they were last reviewed, e.g. [2026] for the
// rewritten anti-D section.
//
// NG126 gives no methotrexate dose: the 50 mg/m² regimen in the app comes from
// RCOG GTG21 and RBH CG623 and is not repeated here.

export const NG126_SECTIONS = [
  {
    id: "ng126-assessment",
    gl: "NG126",
    condition: "Early Pregnancy",
    setting: "Initial Assessment",
    title: "Initial Assessment & Ectopic Red Flags",
    tags: [
      "ng126", "nice ng126", "ectopic symptoms", "ectopic signs", "early pregnancy assessment", "epau", "epas",
      "shoulder tip pain", "cervical motion tenderness", "adnexal tenderness",
      "pregnancy test", "bleeding in early pregnancy", "pain in early pregnancy",
      "atypical presentation ectopic", "referral early pregnancy", "under 6 weeks bleeding",
      "ectopic pregnancy and miscarriage", "early pregnancy guideline",
    ],
    content: [
      {
        type: "text",
        value: "NG126 covers early pregnancy, meaning up to 13 completed weeks. Atypical presentation of ectopic pregnancy is common, and about a third of women with an ectopic pregnancy have no known risk factors, so exclude it even when there are none.",
      },
      {
        type: "alert",
        value: "Refer women who are haemodynamically unstable, or where there is significant concern about the degree of pain or bleeding, directly to A&E.",
      },
      { type: "subheading", value: "Symptoms of ectopic pregnancy" },
      {
        type: "list",
        items: [
          "Common: abdominal or pelvic pain; amenorrhoea or missed period; vaginal bleeding with or without clots",
          "Also reported: breast tenderness; gastrointestinal symptoms; dizziness, fainting or syncope; shoulder tip pain; urinary symptoms; passage of tissue; rectal pressure or pain on defecation",
          "Even if a symptom is less common, it may still be significant",
        ],
      },
      { type: "subheading", value: "Signs on examination" },
      {
        type: "list",
        items: [
          "More common: pelvic tenderness; adnexal tenderness; abdominal tenderness",
          "Also reported: cervical motion tenderness; rebound tenderness or peritoneal signs; pallor; abdominal distension; enlarged uterus; tachycardia (more than 100 beats per minute) or hypotension (less than 100/60 mmHg); shock or collapse; orthostatic hypotension",
        ],
      },
      { type: "subheading", value: "Assessment" },
      {
        type: "list",
        items: [
          "In any woman of reproductive age, consider that she may be pregnant and think about offering a pregnancy test, even when symptoms are non-specific",
          "The symptoms and signs of ectopic pregnancy can resemble gastrointestinal conditions or urinary tract infection",
          "All healthcare professionals caring for women of reproductive age should have access to pregnancy tests",
        ],
      },
      { type: "subheading", value: "Who to refer, and how urgently" },
      {
        type: "list",
        items: [
          "Refer immediately to an early pregnancy assessment service (or out-of-hours gynaecology service) any woman with a positive pregnancy test and pain with abdominal tenderness, or pelvic tenderness, or cervical motion tenderness",
          "Refer women with bleeding or other symptoms of early pregnancy complications who have pain, or a pregnancy of 6 weeks' gestation or more, or a pregnancy of uncertain gestation. The urgency depends on the clinical situation",
          "Under 6 weeks' gestation, bleeding but not in pain and no risk factors such as previous ectopic pregnancy: use expectant management. Advise her to return if bleeding continues or pain develops, to repeat a urine pregnancy test after 7 to 10 days and return if it is positive, and that a negative test means the pregnancy has miscarried",
          "Refer women who return with worsening symptoms or signs that could suggest an ectopic pregnancy. Whether she is seen immediately or within 24 hours depends on the clinical situation",
        ],
      },
    ],
  },

  {
    id: "ng126-ultrasound",
    gl: "NG126",
    condition: "Early Pregnancy",
    setting: "Ultrasound",
    title: "Ultrasound: Location & Viability",
    tags: [
      "ng126", "nice ng126", "transvaginal ultrasound", "tvs", "transabdominal scan", "crown rump length", "crl 7mm",
      "mean gestational sac diameter", "msd 25mm", "fetal pole", "fetal heartbeat",
      "repeat scan 7 days", "repeat scan 14 days", "viability scan", "missed miscarriage diagnosis",
      "complete miscarriage", "ng126 ultrasound",
    ],
    content: [
      {
        type: "text",
        value: "Offer a transvaginal ultrasound scan to identify the location of the pregnancy and whether there is a fetal pole and heartbeat. Consider a transabdominal scan for women with an enlarged uterus or other pelvic pathology, such as fibroids or an ovarian cyst. If a transvaginal scan is unacceptable to the woman, offer a transabdominal scan and explain its limitations.",
      },
      {
        type: "alert",
        value: "Diagnosis of miscarriage using one ultrasound scan cannot be guaranteed to be 100% accurate, and there is a small chance the diagnosis may be incorrect, particularly at very early gestational ages.",
      },
      { type: "subheading", value: "What to measure" },
      {
        type: "list",
        items: [
          "Look first for a fetal heartbeat",
          "If there is no visible heartbeat but there is a visible fetal pole, measure the crown-rump length",
          "Only measure the mean gestational sac diameter if the fetal pole is not visible",
        ],
      },
      { type: "subheading", value: "When to rescan: transvaginal" },
      {
        type: "list",
        items: [
          "Crown-rump length under 7.0 mm with no visible heartbeat: second scan a minimum of 7 days after the first before diagnosing. Further scans may be needed",
          "Crown-rump length 7.0 mm or more with no visible heartbeat: seek a second opinion on viability and/or a second scan a minimum of 7 days later",
          "Mean gestational sac diameter under 25.0 mm with no visible fetal pole: second scan a minimum of 7 days later. Further scans may be needed",
          "Mean gestational sac diameter 25.0 mm or more with no visible fetal pole: seek a second opinion and/or a second scan a minimum of 7 days later",
        ],
      },
      { type: "subheading", value: "When to rescan: transabdominal" },
      {
        type: "list",
        items: [
          "No visible heartbeat when the crown-rump length is measured: record the size and rescan a minimum of 14 days later",
          "No visible fetal pole when the mean gestational sac diameter is measured: record the size and rescan a minimum of 14 days later",
        ],
      },
      { type: "subheading", value: "Also" },
      {
        type: "list",
        items: [
          "Do not use gestational age from the last menstrual period alone to decide whether a fetal heartbeat should be visible, and tell women that the date of their last menstrual period may not represent gestational age accurately",
          "Tell women what to expect while waiting for a repeat scan, and that waiting has no detrimental effect on the outcome of the pregnancy",
          "Give a 24-hour contact telephone number so she can speak to someone experienced in early pregnancy care",
          "When diagnosing complete miscarriage without a previous scan confirming an intrauterine pregnancy, always consider a pregnancy of unknown location, and advise follow-up until a definitive diagnosis is reached",
        ],
      },
    ],
  },

  {
    id: "ng126-ectopic-signs",
    gl: "NG126",
    condition: "Ectopic Pregnancy",
    setting: "Ultrasound",
    title: "Ultrasound Signs of Tubal Ectopic Pregnancy",
    tags: [
      "ng126", "nice ng126", "sliding sign", "tubal ring", "bagel sign", "adnexal mass", "pseudo-sac", "pseudosac",
      "double decidual sign", "empty uterus", "haemoperitoneum", "pouch of douglas",
      "heterotopic pregnancy", "ectopic ultrasound diagnosis", "ng126 ectopic signs",
    ],
    content: [
      { type: "subheading", value: "Signs indicating a tubal ectopic pregnancy" },
      {
        type: "list",
        items: [
          "An adnexal mass moving separately to the ovary (sometimes called the sliding sign), comprising a gestational sac containing a yolk sac",
          "An adnexal mass moving separately to the ovary, comprising a gestational sac and fetal pole, with or without a fetal heartbeat",
        ],
      },
      { type: "subheading", value: "Signs indicating a high probability" },
      {
        type: "list",
        items: [
          "An adnexal mass moving separately to the ovary with an empty gestational sac (sometimes described as a tubal ring or bagel sign)",
          "A complex, inhomogeneous adnexal mass moving separately to the ovary",
        ],
      },
      { type: "subheading", value: "Signs indicating a possible ectopic pregnancy" },
      {
        type: "list",
        items: [
          "An empty uterus",
          "A collection of fluid within the uterine cavity, sometimes described as a pseudo-sac. Distinguish it from an early intrauterine sac, identified by an eccentrically located hypoechoic structure with a double decidual sign (a gestational sac surrounded by 2 concentric echogenic rings)",
        ],
      },
      {
        type: "alert",
        value: "For the high probability and possible signs, take into account the other intrauterine and adnexal features on the scan, the woman's clinical presentation and her serum hCG levels before making a diagnosis.",
      },
      { type: "subheading", value: "Also look for" },
      {
        type: "list",
        items: [
          "A moderate to large amount of free fluid in the peritoneal cavity or Pouch of Douglas, which might represent haemoperitoneum. Weigh it with the other scan features, the clinical presentation and hCG before making a diagnosis",
          "Heterotopic pregnancy: scan the uterus and adnexae",
          "All scans should be performed, or directly supervised and reviewed, by appropriately qualified healthcare professionals trained and experienced in diagnosing ectopic pregnancy",
        ],
      },
    ],
  },

  {
    id: "ng126-pul",
    gl: "NG126",
    condition: "Pregnancy of Unknown Location",
    setting: "Early Pregnancy Unit",
    title: "Pregnancy of Unknown Location: hCG",
    tags: [
      "ng126", "nice ng126", "pregnancy of unknown location", "pul", "serial hcg", "48 hours apart", "63% rise",
      "50% fall", "hcg 1500", "trophoblastic proliferation", "serum progesterone",
      "ng126 pul", "hcg interpretation",
    ],
    content: [
      {
        type: "text",
        value: "A pregnancy of unknown location means a positive pregnancy test with no intrauterine or extrauterine pregnancy visible on transvaginal ultrasound scan. A woman with a pregnancy of unknown location could have an ectopic pregnancy until the location is determined.",
      },
      {
        type: "alert",
        value: "Place more importance on clinical symptoms than on serum hCG results, and review the woman's condition if any of her symptoms change, regardless of previous results and assessments.",
      },
      { type: "subheading", value: "Using hCG" },
      {
        type: "list",
        items: [
          "Do not use serum hCG measurements to determine the location of the pregnancy",
          "Use them only for assessing trophoblastic proliferation, to help determine subsequent management",
          "Take 2 measurements as near as possible to 48 hours apart, but no earlier. Take further measurements only after review by a senior healthcare professional",
          "Do not use serum progesterone measurements as an adjunct to diagnose either viable intrauterine pregnancy or ectopic pregnancy",
          "Regardless of hCG levels, give written information about what to do if symptoms are new or worsening, including how to access emergency care 24 hours a day",
        ],
      },
      { type: "subheading", value: "Interpreting the 48-hour result" },
      {
        type: "list",
        items: [
          "Rise greater than 63%: likely a developing intrauterine pregnancy, though ectopic pregnancy cannot be excluded. Offer a transvaginal scan 7 to 14 days later, and consider an earlier scan if hCG is 1,500 IU/litre or above. If a viable intrauterine pregnancy is confirmed, offer routine antenatal care; if it is not confirmed, refer for immediate clinical review by a senior gynaecologist",
          "Fall greater than 50%: the pregnancy is unlikely to continue, but this is not confirmed. Give information about support and counselling, and ask her to take a urine pregnancy test 14 days after the second hCG. Negative means no further action; positive means returning to the early pregnancy assessment service for clinical review within 24 hours",
          "Fall of less than 50%, or rise of less than 63%: refer for clinical review in the early pregnancy assessment service within 24 hours",
        ],
      },
    ],
  },

  {
    id: "ng126-threatened",
    gl: "NG126",
    condition: "Threatened Miscarriage",
    setting: "Early Pregnancy",
    title: "Threatened Miscarriage & Progesterone",
    tags: [
      "ng126", "nice ng126", "threatened miscarriage", "vaginal micronised progesterone", "progesterone 400 mg",
      "bleeding with previous miscarriage", "16 weeks progesterone", "prism",
      "ng126 threatened miscarriage",
    ],
    content: [
      {
        type: "list",
        items: [
          "Confirmed intrauterine pregnancy with a fetal heartbeat, vaginal bleeding and no history of previous miscarriage: advise her to return for further assessment if bleeding gets worse or persists beyond 14 days, and to start or continue routine antenatal care if the bleeding stops",
          "Offer vaginal micronised progesterone 400 mg twice daily to women with an intrauterine pregnancy confirmed by a scan who have vaginal bleeding and have previously had a miscarriage",
          "If a fetal heartbeat is confirmed, continue progesterone until 16 completed weeks of pregnancy",
        ],
      },
    ],
  },

  {
    id: "ng126-miscarriage-management",
    gl: "NG126",
    condition: "Miscarriage",
    setting: "Management",
    title: "Management of Miscarriage",
    tags: [
      "ng126", "nice ng126", "expectant management miscarriage", "medical management miscarriage", "mifepristone 200 mg",
      "misoprostol 800", "misoprostol 600", "missed miscarriage", "incomplete miscarriage",
      "manual vacuum aspiration", "mva", "surgical management of miscarriage", "smm",
      "urine pregnancy test 3 weeks", "ng126 miscarriage",
    ],
    content: [
      { type: "subheading", value: "Expectant management" },
      {
        type: "list",
        items: [
          "Use expectant management for 7 to 14 days as the first-line strategy for a confirmed diagnosis of miscarriage",
          "Explore other options if she is at increased risk of haemorrhage (for example she is in the late first trimester), has had a previous adverse or traumatic experience associated with pregnancy, is at increased risk from the effects of haemorrhage (for example coagulopathy or unable to have a blood transfusion), or there is evidence of infection",
          "Offer medical management if expectant management is not acceptable to her",
          "If bleeding and pain resolve within the 7 to 14 days, provide a urine pregnancy test to carry out at home 3 weeks later, and advise her to return for individualised care if it is positive",
          "Offer a repeat scan if bleeding and pain have not started, or are persisting or increasing, then discuss continued expectant, medical and surgical management so she can choose",
          "Review a woman who opts for continued expectant management at a minimum of 14 days after the first follow-up appointment",
        ],
      },
      { type: "subheading", value: "Medical management" },
      {
        type: "list",
        items: [
          "Missed miscarriage: 200 mg oral mifepristone, then 48 hours later 800 micrograms misoprostol (vaginal, oral or sublingual) unless the gestational sac has already been passed",
          "Incomplete miscarriage: a single dose of misoprostol 600 micrograms (vaginal, oral or sublingual). 800 micrograms can be used instead so that protocols for missed and incomplete miscarriage align",
          "Do not offer mifepristone as a treatment for incomplete miscarriage",
          "If bleeding has not started within 48 hours of misoprostol, she should contact her healthcare professional. Where there are concerns she will not make contact, the service should follow her up",
          "Offer pain relief and anti-emetics as needed, and explain what to expect: the length and extent of bleeding, and side effects including pain, diarrhoea and vomiting",
          "Provide a urine pregnancy test to carry out at home 3 weeks later, unless symptoms worsen, in which case she should return sooner",
          "A positive test at 3 weeks means returning for review, to rule out retained, molar or ectopic pregnancy and assess the need for further investigation or treatment",
          "If the test is negative but she is still bleeding heavily or has other symptoms such as pelvic pain or fever, assess the need for further investigation or treatment",
        ],
      },
      {
        type: "alert",
        value: "NICE notes that in August 2023 the use of mifepristone and misoprostol in these recommendations was off label.",
      },
      { type: "subheading", value: "Surgical management" },
      {
        type: "list",
        items: [
          "Where clinically appropriate, offer a choice of manual vacuum aspiration under local anaesthetic in an outpatient or clinic setting, or surgical management in a theatre under general anaesthetic",
          "Provide oral and written information about the options and what to expect during and after the procedure",
        ],
      },
    ],
  },

  {
    id: "ng126-ectopic-management",
    gl: "NG126",
    condition: "Ectopic Pregnancy",
    setting: "Management",
    title: "Management of Tubal Ectopic Pregnancy",
    tags: [
      "ng126", "nice ng126", "expectant management ectopic", "methotrexate ectopic", "surgery ectopic",
      "hcg 1000", "hcg 1500", "hcg 5000", "35 mm adnexal mass", "days 2 4 7",
      "salpingectomy", "salpingotomy", "laparoscopy ectopic", "ng126 ectopic management",
    ],
    content: [
      { type: "subheading", value: "Expectant management" },
      {
        type: "list",
        items: [
          "Offer it to women who are clinically stable and pain free, with a tubal ectopic pregnancy measuring less than 35 mm with no visible heartbeat on transvaginal scan, serum hCG of 1,000 IU/L or less, and who are able to return for follow-up",
          "Consider it on the same criteria where serum hCG is above 1,000 IU/L and below 1,500 IU/L",
          "Repeat hCG on days 2, 4 and 7 after the original test. If it drops by 15% or more from the previous value, repeat weekly until a negative result (less than 20 IU/L). If it does not fall by 15%, stays the same or rises, review her clinical condition and seek senior advice",
          "Advise that, on limited evidence, expectant and medical management appear not to differ in the rate of ectopic pregnancies ending naturally, the risk of tubal rupture, the need for additional treatment (though urgent admission may be needed if her condition deteriorates), or health status, depression and anxiety scores",
          "Time taken to resolve and future fertility outcomes are likely to be the same with either expectant or medical management",
        ],
      },
      { type: "subheading", value: "Methotrexate" },
      {
        type: "list",
        items: [
          "Offer systemic methotrexate to women who have no significant pain, an unruptured tubal ectopic pregnancy with an adnexal mass smaller than 35 mm with no visible heartbeat, a serum hCG level less than 1,500 IU/litre, no intrauterine pregnancy as confirmed on scan, and who are able to return for follow-up",
          "Offer it on a first visit only where there is a definitive diagnosis of ectopic pregnancy and a viable intrauterine pregnancy has been excluded. Offer surgery where methotrexate is not acceptable to the woman",
          "After methotrexate, take 2 serum hCG measurements in the first week (days 4 and 7), then one per week until a negative result. If levels plateau or rise, reassess her condition for further treatment",
        ],
      },
      {
        type: "alert",
        value: "NICE notes that in April 2019 the use of methotrexate in these recommendations was off label. NG126 does not state a methotrexate dose.",
      },
      { type: "subheading", value: "Surgery as first-line treatment" },
      {
        type: "list",
        items: [
          "Offer surgery first-line to women unable to return for follow-up after methotrexate, or who have significant pain, an adnexal mass of 35 mm or larger, a fetal heartbeat visible on ultrasound, or a serum hCG level of 5,000 IU/litre or more",
        ],
      },
      { type: "subheading", value: "Choice of methotrexate or surgery" },
      {
        type: "list",
        items: [
          "Offer the choice where serum hCG is at least 1,500 IU/litre and less than 5,000 IU/litre, she is able to return for follow-up, and she has no significant pain, an unruptured ectopic with an adnexal mass smaller than 35 mm with no visible heartbeat, and no intrauterine pregnancy on scan",
          "Advise women who choose methotrexate that their chance of needing further intervention is increased, and that they may need to be urgently admitted if their condition deteriorates",
        ],
      },
      { type: "subheading", value: "Surgical technique and follow-up" },
      {
        type: "list",
        items: [
          "Perform surgery laparoscopically wherever possible, taking into account the condition of the woman and the complexity of the procedure. Surgeons should be competent in laparoscopic surgery, and the equipment should be available",
          "Offer salpingectomy unless she has other risk factors for infertility; consider salpingotomy as an alternative where she has, such as contralateral tube damage",
          "Tell women having a salpingotomy that up to 1 in 5 may need further treatment, which may include methotrexate and/or a salpingectomy",
          "After salpingotomy: one serum hCG at 7 days after surgery, then one per week until a negative result",
          "After salpingectomy: a urine pregnancy test after 3 weeks, returning for further assessment if it is positive",
        ],
      },
      { type: "subheading", value: "Information for women" },
      {
        type: "list",
        items: [
          "Give all women with an ectopic pregnancy oral and written information about the treatment options and what to expect during and after treatment, how to contact a healthcare professional for advice afterwards and who that will be, and where and when to get help in an emergency",
          "Tell them they can self-refer to an early pregnancy assessment service in future pregnancies if they have any early concerns",
        ],
      },
    ],
  },

  {
    id: "ng126-antid",
    gl: "NG126",
    condition: "Anti-D Prophylaxis",
    setting: "Early Pregnancy",
    title: "Anti-D Prophylaxis in Early Pregnancy",
    tags: [
      "ng126", "nice ng126", "anti-d early pregnancy", "anti-d miscarriage", "anti-d ectopic", "11+6 weeks",
      "12+0 to 12+6", "250 iu anti-d", "rhd negative early pregnancy", "kleihauer",
      "ng126 anti-d", "anti-d 2026",
    ],
    content: [
      {
        type: "alert",
        value: "Do not offer anti-D immunoglobulin prophylaxis for an ectopic pregnancy, miscarriage or threatened miscarriage up to and including 11+6 weeks' gestation. Where the length of gestation measured on ultrasound differs from that calculated from the last menstrual period, use the ultrasound findings to guide management.",
      },
      { type: "compare", id: "antid-ectopic-under-12" },
      {
        type: "list",
        items: [
          "Offer anti-D immunoglobulin at a dose of at least 250 IU (50 micrograms) to women who are RhD-negative and are at 12+0 to 12+6 completed weeks of pregnancy, and having medical management or a surgical procedure to manage ectopic pregnancy or miscarriage",
          "Consider anti-D immunoglobulin at a dose of at least 250 IU (50 micrograms) for women who are RhD-negative and are at 12+0 to 12+6 completed weeks with threatened miscarriage and heavy or recurrent bleeding",
          "Discuss the use of anti-D immunoglobulin where it is a suitable option: it is a protein obtained from blood plasma, but it does not contain blood cells (it is a filtered blood product)",
          "Do not use a Kleihauer test for quantifying feto-maternal haemorrhage",
        ],
      },
      { type: "compare", id: "antid-threatened-heavy-bleeding" },
      {
        type: "text",
        value: "NICE reviewed the evidence and rewrote these recommendations in June 2026.",
      },
    ],
  },
];
