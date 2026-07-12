// FSRH_EC — FSRH Guideline: Emergency Contraception
// March 2017, amended July 2023 (further amended April 2026)

export const FSRH_EC_SECTIONS = [
  {
    id: "fsrh-ec-options",
    gl: "FSRH_EC",
    condition: "Emergency Contraception",
    setting: "Sexual & Reproductive Health",
    title: "Emergency Contraception — Options & Timing",
    tags: [
      "emergency contraception", "fsrh_ec", "levonorgestrel ec", "lng-ec",
      "ulipristal acetate", "upa-ec", "copper iud emergency contraception",
      "morning after pill",
    ],
    flowchartId: "FSRH_EC_METHOD_CHOICE",
    content: [
      { type: "table", headers: ["Method", "Licensed window", "Notes"], rows: [
        ["Copper IUD", "Up to 5 days after unprotected sex, or up to 5 days after the earliest estimated date of ovulation (whichever is later)", "Most effective option overall; also provides ongoing contraception if kept in place"],
        ["Ulipristal acetate (UPA-EC), 30 mg single dose", "Up to 120 hours (5 days)", "Delays ovulation by at least 5 days, but cannot suppress ovulation once the LH surge has started"],
        ["Levonorgestrel (LNG-EC), 1.5 mg single dose", "Up to 72 hours", "Least effective of the three; efficacy falls with time since intercourse"],
      ]},
      { type: "alert", value: "Offer the copper IUD as the most effective method to everyone who is eligible and within the window — do not let ready availability of the oral options crowd out this discussion." },
    ],
  },

  {
    id: "fsrh-ec-weight-quickstart",
    gl: "FSRH_EC",
    condition: "Emergency Contraception",
    setting: "Sexual & Reproductive Health",
    title: "Weight/BMI Considerations & Quick-Starting Contraception",
    tags: [
      "levonorgestrel weight bmi", "emergency contraception efficacy weight",
      "quick starting contraception", "ulipristal acetate delay hormonal contraception",
    ],
    content: [
      { type: "alert", value: "Levonorgestrel efficacy falls at higher body weight/BMI — pregnancy rates rise noticeably from around 70–75 kg upward. Current evidence does not support simply doubling the LNG-EC dose in this group; instead, offer the copper IUD or ulipristal acetate as more effective alternatives." },
      { type: "subheading", value: "Quick-Starting Hormonal Contraception After EC" },
      { type: "list", items: [
        "After LNG-EC: any hormonal method can be started immediately",
        "After UPA-EC: delay starting (or restarting) hormonal contraception for 5 days — ulipristal is a progesterone receptor modulator and can reduce the effectiveness of progestogen-containing methods started too soon, and vice versa",
        "Advise barrier contraception (or abstinence) until the newly started method has been used long enough to be effective, and until a pregnancy test can exclude pregnancy from this cycle if a period is late or abnormal",
      ]},
      { type: "subheading", value: "Repeated EC & Follow-Up" },
      { type: "list", items: [
        "More than one dose of oral EC can be needed within the same cycle if there is repeated unprotected sex — UPA-EC efficacy may be reduced if LNG-EC has been taken in the same cycle (and vice versa); the copper IUD does not have this interaction and is the best option when repeat cover is needed",
        "Advise a pregnancy test if the next period is more than 7 days late, lighter than usual, or if there is any concern about efficacy",
        "Use every consultation as an opportunity to discuss and start ongoing contraception, not just to supply EC in isolation",
      ]},
    ],
  },
];
