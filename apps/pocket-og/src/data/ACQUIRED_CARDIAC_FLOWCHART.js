// Cardiomyopathy in Pregnancy — assessment & management.
// Original interactive pathway synthesised from the cardiomyopathy section of
// the TOG review (Gelson E, Johnson M, Gatzoulis M, Uebing A. Cardiac disease
// in pregnancy. Part 2: acquired heart disease. TOG 2007;9:83–87, DOI
// 10.1576/toag.9.2.083.27308). Trimmed from a broader "acquired heart disease
// & arrhythmias" pathway now that valvular disease, ischaemic heart disease
// and arrhythmias have their own dedicated, more current TOG reviews and
// flowcharts (Timmons 2022 / Wuntakal 2013 / Roberts 2019).
// Decision support only — a summary of a review article, not a protocol.
// Verify against local guidance and read the full article.

export const TOG_ACQUIRED_CARDIAC_FLOWCHART = {
  id: "TOG_ACQUIRED_CARDIAC",
  title: "Cardiomyopathy in Pregnancy",
  subtitle: "TOG review (Gelson et al. 2007, Part 2) · assessment & management",
  startId: "cardiomyopathy",
  nodes: {

    "cardiomyopathy": {
      type: "decision",
      title: "Which Type of Cardiomyopathy?",
      options: [
        { label: "Dilated cardiomyopathy", next: "dilated" },
        { label: "Hypertrophic cardiomyopathy", next: "hypertrophic" },
        { label: "New, last month of pregnancy or postpartum", next: "peripartum" },
      ],
    },

    "dilated": {
      type: "alert",
      title: "Dilated Cardiomyopathy",
      text: "Poorly tolerated in pregnancy — 7% mortality with NYHA III/IV; risk of heart failure, irreversible LV dysfunction and fetal loss.",
      items: [
        "Counsel on these risks",
        "Offer termination for an unplanned pregnancy",
      ],
    },

    "hypertrophic": {
      type: "end",
      title: "Hypertrophic Cardiomyopathy",
      text: "Usually well tolerated if asymptomatic before pregnancy.",
      items: [
        "Risk of symptomatic progression, atrial fibrillation, syncope and maternal death if there was pre-existing heart failure or severe symptoms",
      ],
    },

    "peripartum": {
      type: "action",
      title: "Suspected Peripartum Cardiomyopathy",
      text: "LV systolic dysfunction/heart failure in the last month of pregnancy to 5 months postpartum. Rare (~1 in 2,289 live births) — a diagnosis of exclusion.",
      items: [
        "Exclude other causes of dilated cardiomyopathy with heart failure first",
        "Treat: beta-blockers, diuretics, hydralazine, digoxin (switch to ACE inhibitors postpartum)",
      ],
      next: "peripartum_outcome",
    },

    "peripartum_outcome": {
      type: "end",
      title: "Outcome & Future Pregnancy",
      items: [
        "~20% die or need transplantation; the rest recover partially or fully",
        "A future pregnancy carries a higher relapse risk if LV function hasn't fully recovered — some residual risk remains even after full recovery",
        "No consensus on recommendations for future pregnancies",
      ],
    },

  },
};
