// Analgesia, checked against national guidance (7 Oct 2026): NICE NG192
// (caesarean birth, 1.6), NICE NG235 (intrapartum care, 1.6) and the
// BASHH/RCOG guideline on genital herpes in pregnancy (2024). NICE names the
// drugs but gives few oral doses; doses without a national source are kept
// until they are checked against the BNF.

const NO_NATIONAL_DOSE = "Not given in national guidance: refer to local guidelines";
const NG192 = { label: "NICE NG192", href: "https://www.nice.org.uk/guidance/ng192" };
const NG235 = { label: "NICE NG235", href: "https://www.nice.org.uk/guidance/ng235" };
const HSV_2024 = { label: "BASHH/RCOG HSV in Pregnancy 2024", href: "https://www.bashh.org/resources/24/updated_guideline_herpes_in_pregnancy_2024/" };

export const ANALGESIA = [
  {
    id: "codeine",
    name: "Codeine",
    class: "Opioid analgesic (pro-drug of morphine)",
    color: "yellow",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: postnatal, not if breastfeeding",
        label: "Oral: postnatal analgesia (not if breastfeeding)",
        dose: "30–60 mg",
        frequency: "every 4–6 hours as needed",
        maxDose: "240 mg/day",
        notes: "Do not offer codeine or co-codamol to women who are breastfeeding: it can cause serious neonatal sedation and respiratory depression (NICE NG192 1.6.20). After caesarean birth, NICE's step-up from paracetamol is dihydrocodeine or co-dydramol (NG192 1.6.19).",
      },
    ],
    contraindications: [
      "Breastfeeding (NICE NG192 1.6.20)",
      "Respiratory depression",
    ],
    cautions: [
      "Some over-the-counter medicines contain codeine: advise women not to take them while breastfeeding (NICE NG192 1.6.27)",
    ],
    pregnancySafety: "Not for women who are breastfeeding (NICE NG192 1.6.20, 1.6.27).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/codeine-phosphate/" },
      NG192,
    ],
  },
  {
    id: "dihydrocodeine",
    name: "Dihydrocodeine / co-dydramol",
    class: "Opioid analgesic",
    color: "yellow",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: after caesarean",
        label: "Oral: pain after caesarean birth",
        dose: NO_NATIONAL_DOSE,
        frequency: "regularly, not just when needed (NICE NG192 1.6.21)",
        notes: "If paracetamol is not enough or NSAIDs cannot be taken: add immediate-release dihydrocodeine to paracetamol, or change to co-dydramol (paracetamol plus dihydrocodeine) as an alternative to paracetamol (NICE NG192 1.6.19).",
      },
    ],
    contraindications: [],
    cautions: [
      "Co-dydramol contains paracetamol: it replaces paracetamol rather than being added to it (NICE NG192 1.6.19)",
    ],
    pregnancySafety: "Named by NICE NG192 for pain after caesarean birth (1.6.19), where codeine is not offered to women who are breastfeeding (1.6.20).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/dihydrocodeine-tartrate/" },
      NG192,
    ],
  },
  {
    id: "diamorphine",
    name: "Diamorphine",
    class: "Opioid analgesic",
    color: "yellow",
    routes: [
      {
        type: "im",
        shortLabel: "IM: labour analgesia",
        label: "IM: systemic analgesia in established labour",
        dose: "5–7.5 mg",
        frequency: "may repeat after 3–4 hours (maximum 2 doses per labour)",
        maxDose: "15 mg per labour",
        notes: "Opioids give limited pain relief in labour (NICE NG235 1.6.18). Give an antiemetic with any IV or IM opioid (1.6.19). No birthing pool or bath within 2 hr of an opioid, or if drowsy (1.6.20).",
      },
      {
        type: "neuraxial",
        shortLabel: "Neuraxial: caesarean",
        label: "Intrathecal or epidural: analgesia after caesarean birth",
        dose: "Intrathecal up to 300 micrograms; or epidural up to 3 mg if intrathecal diamorphine has not been given",
        frequency: "single dose at caesarean birth",
        notes: "Offered to reduce the need for supplemental analgesia after caesarean birth (NICE NG192 1.6.11; off-label). With known risk factors for respiratory depression, monitor oxygen saturation, respiratory rate and sedation hourly for at least 12 hr after birth (1.6.5).",
      },
    ],
    contraindications: [
      "Respiratory depression",
      "Concurrent MAOI use or within 14 days",
    ],
    cautions: [
      "In labour: drowsiness, nausea and vomiting in the woman; short-term respiratory depression and drowsiness in the baby, which may last several days and make breastfeeding harder (NICE NG235 1.6.18)",
      "Always give an antiemetic with IV or IM opioids (NICE NG235 1.6.19)",
    ],
    pregnancySafety: "Systemic opioid in labour (NICE NG235 1.6.18) and neuraxial analgesia at caesarean birth (NICE NG192 1.6.11).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/diamorphine-hydrochloride/" },
      NG235,
      NG192,
    ],
  },
  {
    id: "diclofenac",
    name: "Diclofenac",
    class: "NSAID / COX inhibitor",
    color: "yellow",
    routes: [
      {
        type: "rectal",
        shortLabel: "PR: post-CS analgesia",
        label: "PR: postoperative analgesia (post-CS)",
        dose: "100 mg",
        frequency: "up to twice daily",
        maxDose: "150 mg/day",
        notes: "An NSAID option after caesarean birth, combined with paracetamol unless contraindicated, given regularly (NICE NG192 1.6.18, 1.6.21). For postnatal use only.",
      },
      {
        type: "oral",
        shortLabel: "Oral: postnatal",
        label: "Oral: postnatal perineal / uterine pain",
        dose: "50 mg",
        frequency: "3 times daily with food",
        maxDose: "150 mg/day",
        notes: "For postnatal use only; avoid from 30 weeks in pregnancy.",
      },
    ],
    contraindications: [
      "Pregnancy ≥30 weeks: ductus arteriosus closure risk",
      "NSAID hypersensitivity / aspirin-sensitive asthma",
      "Active peptic ulcer or GI bleeding",
      "Severe renal impairment",
    ],
    cautions: [
      "Postnatal use only: contraindicated from 30 weeks of pregnancy",
      "Risk of premature ductus arteriosus closure and oligohydramnios in pregnancy",
      "GI protection (PPI) if at risk of peptic ulcer disease",
    ],
    pregnancySafety: "Avoid in pregnancy from 30 weeks. Postnatal use only in the obstetric context. After caesarean, an NSAID is combined with paracetamol unless contraindicated (NICE NG192 1.6.18).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/diclofenac-sodium/" },
      NG192,
    ],
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    class: "NSAID / COX inhibitor",
    color: "yellow",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: postnatal",
        label: "Oral: postnatal analgesia",
        dose: "400–600 mg",
        frequency: "3 times daily with food",
        maxDose: "2.4 g/day",
        notes: "After caesarean birth, give with paracetamol unless contraindicated, regularly rather than only when needed (NICE NG192 1.6.18, 1.6.21). For postnatal use only; avoid from 30 weeks in pregnancy.",
      },
    ],
    contraindications: [
      "Pregnancy ≥30 weeks",
      "NSAID or aspirin hypersensitivity",
      "Active peptic ulcer",
      "Severe renal impairment",
    ],
    cautions: [
      "AVOID IN PREGNANCY FROM 30 WEEKS: premature ductus arteriosus closure risk",
      "Postnatal use only in obstetrics",
      "GI protection if prolonged use or GI risk factors",
    ],
    pregnancySafety: "Avoid from 30 weeks of pregnancy. After caesarean birth, NICE's example NSAID to combine with paracetamol (NG192 1.6.18).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/ibuprofen/" },
      NG192,
    ],
  },
  {
    id: "morphine",
    name: "Morphine",
    class: "Opioid analgesic",
    color: "yellow",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral IR: after caesarean",
        label: "Oral immediate-release: after caesarean birth",
        dose: "5–10 mg",
        frequency: "every 4 hours as needed",
        maxDose: "60 mg/day (immediate-release)",
        notes: "Offer to women who had spinal or epidural anaesthesia for caesarean birth. If she cannot take oral medicines (for example, nausea or vomiting), offer IV, IM or SC morphine (NICE NG192 1.6.15).",
      },
      {
        type: "iv",
        shortLabel: "IV PCA: after GA caesarean",
        label: "IV PCA: after general anaesthetic for caesarean",
        dose: "1–2 mg bolus (PCA); 5–10 mg (IV/IM PRN)",
        frequency: "PCA: lockout 5 min; PRN: every 4–6 hr",
        maxDose: "Per PCA protocol; or 10–15 mg per IM dose",
        notes: "Consider IV PCA with morphine after a general anaesthetic for caesarean; if PCA is not acceptable or pain is less severe, consider oral immediate-release morphine (NICE NG192 1.6.16). Monitor oxygen saturation, respiratory rate, sedation and pain scores hourly throughout PCA and for at least 2 hr after stopping (1.6.17).",
      },
      {
        type: "neuraxial",
        shortLabel: "Neuraxial: if no diamorphine",
        label: "Intrathecal or epidural: caesarean, if diamorphine is unavailable",
        dose: "Intrathecal preservative-free morphine up to 100 micrograms plus intrathecal fentanyl up to 15 micrograms; or epidural preservative-free morphine up to 3 mg",
        frequency: "single dose at caesarean birth",
        notes: "Only if diamorphine is unavailable (NICE NG192 1.6.12; off-label). Causes more nausea, vomiting and itching than diamorphine. Use only preservative-free morphine, stored separately from preservative-containing morphine (1.6.13). With known risk factors for respiratory depression, monitor oxygen saturation, respiratory rate and sedation hourly for at least 12 hr after birth (1.6.9).",
      },
    ],
    contraindications: [
      "Respiratory depression",
      "Paralytic ileus",
    ],
    cautions: [
      "Women who wish to breastfeed will usually be able to do so while taking pain relief after caesarean birth (NICE NG192 1.6.14)",
      "In labour, opioids can cause short-term respiratory depression and drowsiness in the baby (NICE NG235 1.6.18)",
    ],
    pregnancySafety: "Used after caesarean birth: oral, parenteral, PCA and neuraxial (NICE NG192 1.6.12 to 1.6.17).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/morphine/" },
      NG192,
      NG235,
    ],
  },
  {
    id: "paracetamol",
    name: "Paracetamol",
    class: "Non-opioid analgesic / antipyretic",
    color: "yellow",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral",
        label: "Oral: analgesia and antipyretic",
        dose: "1 g",
        frequency: "every 4–6 hours",
        maxDose: "4 g/day (reduce to 3 g/day if <50 kg or hepatic impairment)",
        notes: "After caesarean birth, give with an NSAID unless contraindicated, regularly rather than only when needed, to reduce the need for opioids (NICE NG192 1.6.18, 1.6.21).",
      },
      {
        type: "iv",
        shortLabel: "IV: when oral unavailable",
        label: "IV: when oral route unavailable (Perfalgan®)",
        dose: "1 g",
        frequency: "every 4–6 hours",
        maxDose: "4 g/day",
        notes: "When the oral route is not possible. Give over 15 min.",
      },
    ],
    contraindications: [
      "Severe hepatic impairment",
    ],
    cautions: [
      "Do not exceed 4 g/day: hepatotoxicity",
      "Reduce to 3 g/day if <50 kg, hepatic impairment, regular alcohol use, or malnutrition",
      "Beware of combination products (co-codamol, co-dydramol, cold and flu remedies): double-dosing risk",
    ],
    pregnancySafety: "No evidence of harm in pregnancy at standard doses (BASHH/RCOG HSV in Pregnancy 2024). After caesarean birth, given regularly with an NSAID (NICE NG192 1.6.18, 1.6.21).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/paracetamol/" },
      NG192,
      HSV_2024,
    ],
  },
  {
    id: "remifentanil",
    name: "Remifentanil",
    class: "Opioid analgesic (short-acting)",
    color: "yellow",
    routes: [
      {
        type: "iv",
        shortLabel: "IV PCA: labour",
        label: "IV PCA: labour analgesia",
        dose: "40 micrograms per bolus",
        frequency: "patient-controlled, 2-minute lockout",
        notes: "An option for women who want ongoing pain relief during labour and birth (NICE NG235 1.6.21; off-label). Obstetric units only, because of the risk of respiratory depression (1.6.22).",
      },
    ],
    contraindications: [],
    cautions: [
      "Obstetric units only (NICE NG235 1.6.22)",
      "One-to-one care from a midwife trained in remifentanil PCA, and continuous monitoring of breathing and pulse oximetry (NICE NG235 1.6.24)",
      "Continuous CTG if there are other risk factors (NICE NG235 1.6.24)",
    ],
    pregnancySafety: "For labour (NICE NG235 1.6.21 to 1.6.24).",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/remifentanil/" },
      NG235,
    ],
  },
  {
    id: "lidocaine-topical",
    name: "Lidocaine (topical)",
    class: "Local anaesthetic",
    color: "yellow",
    routes: [
      {
        type: "topical",
        shortLabel: "Topical: genital lesions",
        label: "Topical: symptomatic relief of genital herpes lesions",
        dose: "2% gel or 5% ointment",
        frequency: "Apply to affected area as needed",
        maxDose: "Avoid extensive/occluded application (systemic absorption)",
        notes: "Supportive symptom relief for painful genital herpes lesions in pregnancy, alongside saline bathing and paracetamol. No evidence of harm in standard doses in pregnancy (BASHH/RCOG 2024).",
      },
    ],
    contraindications: ["Known hypersensitivity to local anaesthetics"],
    cautions: [
      "Avoid application to large or broken areas under occlusion: risk of systemic absorption",
      "For symptom relief only: not an antiviral",
    ],
    pregnancySafety: "No evidence of harm in standard topical doses in pregnancy (BASHH/RCOG 2024). Used for symptomatic relief of genital herpes lesions.",
    sources: [
      { label: "BNF", href: "https://bnf.nice.org.uk/drugs/lidocaine-hydrochloride/" },
      HSV_2024,
    ],
  },
];
