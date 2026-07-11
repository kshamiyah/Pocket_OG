// NG244 — Managing Asthma in Pregnancy, During Labour and When Breastfeeding
// (part of the joint BTS/NICE/SIGN asthma pathway, updated November 2024)

export const NG244_SECTIONS = [
  {
    id: "ng244-antenatal-principles",
    gl: "NG244",
    condition: "Asthma in Pregnancy",
    setting: "Antenatal",
    title: "Antenatal Principles — Keep Treating as Normal",
    tags: [
      "asthma pregnancy", "asthma inhalers pregnancy", "asthma review pregnancy",
      "inhaled corticosteroids pregnancy", "montelukast pregnancy",
    ],
    content: [
      { type: "alert", value: "The biggest risk to the baby from asthma in pregnancy is poorly controlled asthma, not the medication used to control it. The consistent message is: keep taking your usual treatment. Stopping or reducing inhalers 'to be safe' is the wrong instinct here." },
      { type: "list", items: [
        "Offer an asthma review early in pregnancy, and again postpartum — a planned check-in, not just a reaction to symptoms.",
        "Short- and long-acting beta-agonists, inhaled corticosteroids, and oral theophylline are all used as normal in pregnancy.",
        "Leukotriene receptor antagonists (e.g. montelukast) and long-acting muscarinic antagonists: if needed to achieve control, continue them — don't stop a treatment that's working because of pregnancy alone.",
        "Explain explicitly that continuing treatment protects the baby by preventing maternal hypoxia and exacerbations — this reframes adherence as something done for the baby, not despite the pregnancy.",
      ]},
    ],
  },

  {
    id: "ng244-acute-exacerbation",
    gl: "NG244",
    condition: "Asthma in Pregnancy",
    setting: "Emergency",
    title: "Acute Asthma Exacerbation in Pregnancy",
    tags: [
      "acute asthma pregnancy", "asthma attack pregnancy", "severe asthma pregnancy",
      "salbutamol nebuliser pregnancy", "prednisolone pregnancy asthma",
    ],
    flowchartId: "NG244_ACUTE_ASTHMA",
    content: [
      { type: "alert", value: "Manage acute severe asthma in pregnancy the same way as in a non-pregnant adult — do not under-treat out of misplaced caution about medication in pregnancy. Maternal hypoxia is the greater threat to the fetus." },
      { type: "list", items: [
        "High-flow oxygen to maintain saturations in the normal range for pregnancy (avoid hypoxia — treat any desaturation as urgent, not borderline).",
        "Nebulised salbutamol (± ipratropium for a more severe attack) — standard doses, not reduced because of pregnancy.",
        "Oral prednisolone (typically 40 mg daily) started early rather than reserved for non-response — the benefit of prompt steroids outweighs any theoretical pregnancy concern.",
        "Continuous fetal monitoring once the pregnancy is at a viable gestation, alongside maternal monitoring — but do not let fetal monitoring delay or distract from maternal resuscitation.",
        "Escalate early — senior obstetric, anaesthetic and respiratory/ITU input for a severe or life-threatening attack, same thresholds as outside pregnancy.",
      ]},
    ],
  },

  {
    id: "ng244-labour-birth",
    gl: "NG244",
    condition: "Asthma in Pregnancy",
    setting: "Intrapartum",
    title: "Labour, Birth & Medication Cautions",
    tags: [
      "asthma labour", "carboprost asthma", "ergometrine asthma", "syntometrine asthma",
      "nsaid asthma pregnancy", "asthma uterotonic choice",
    ],
    content: [
      { type: "alert", value: "Acute asthma exacerbations in labour are uncommon, and well-controlled asthma is not a reason to plan anything other than a normal labour and birth — but a small number of drugs used around delivery need specific avoidance." },
      { type: "list", items: [
        "Carboprost (a prostaglandin F2α analogue, used for postpartum haemorrhage — see GTG52/GL787) is contraindicated in asthma — it can precipitate severe, life-threatening bronchospasm. Choose an alternative second-line uterotonic.",
        "Ergometrine (including as Syntometrine) can also provoke bronchospasm, particularly alongside general anaesthesia — use with caution and prefer oxytocin-based regimens where asthma is a known issue.",
        "NSAIDs should be avoided in anyone with aspirin/NSAID-sensitive asthma — check sensitivity history before reaching for a NSAID for analgesia.",
        "Continue the woman's usual inhalers through labour — being nil by mouth or in established labour is not a reason to withhold them.",
      ]},
    ],
  },

  {
    id: "ng244-breastfeeding",
    gl: "NG244",
    condition: "Asthma in Pregnancy",
    setting: "Postnatal",
    title: "Breastfeeding",
    tags: [
      "asthma breastfeeding", "inhalers breastfeeding", "prednisolone breastfeeding",
    ],
    content: [
      { type: "text", value: "Use asthma medicines as normal while breastfeeding, in line with standard BNF guidance — breastfeeding is not a reason to step down or avoid usual treatment, including inhaled or oral corticosteroids." },
    ],
  },
];
