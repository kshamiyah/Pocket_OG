// Antibiotics: national sources only (6 Oct 2026).
//
// Every dose here is quoted from a national guideline, saved in
// public/rx-sources/:
//   NICE NG109 (2018) lower UTI antimicrobial prescribing, table 2 (pregnancy)
//   NICE NG25 (2015, updated 2022) preterm labour and birth, 1.4
//   NICE NG195 (2021, updated 2026) neonatal infection, 1.6 and table 1
//   NICE NG192 (2021, updated 2024) caesarean birth, 1.4.43 to 1.4.45
//   BASHH bacterial vaginosis guideline (2012)
//
// The BNF is not reachable from the build environment. Where a national
// guideline names a drug but gives no dose, the card says so and refers to
// local guidelines rather than show an unverified figure. Choice of
// antibiotic is set by local antimicrobial policy.
//
// The previous local cards (from RBH GL787) are shelved, unchanged, in
// antibiotics.local-shelved.js. Co-amoxiclav is not carried over: NG192
// 1.4.45 and NG25 1.4.3 advise against its two obstetric uses here.

const LOCAL_POLICY = "Choice of antibiotic is set by local antimicrobial policy: follow your trust's guidelines.";
const NO_NATIONAL_DOSE = "Not given in national guidance: refer to local guidelines";

const NG109 = { label: "NICE NG109: lower UTI, antimicrobial prescribing", href: "/rx-sources/NICE-NG109-UTI-lower-antimicrobial-prescribing.pdf" };
const NG25  = { label: "NICE NG25: preterm labour and birth", href: "/rx-sources/NICE-NG25-preterm-labour-and-birth.pdf" };
const NG195 = { label: "NICE NG195: neonatal infection, antibiotics", href: "/rx-sources/NICE-NG195-neonatal-infection-antibiotics.pdf" };
const BASHH_BV = { label: "BASHH: bacterial vaginosis (2012)", href: "/rx-sources/BASHH-bacterial-vaginosis-2012.pdf" };

export const ANTIBIOTICS = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    class: "Aminopenicillin",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: lower UTI in pregnancy",
        label: "Oral: lower UTI in pregnancy (second choice)",
        dose: "500 mg",
        frequency: "Three times a day for 7 days",
        notes: "Only if culture results are available and show susceptibility (NICE NG109 table 2).",
      },
    ],
    cautions: [
      "Second choice for lower UTI in pregnancy: if no improvement after at least 48 hours on the first choice, or the first choice is unsuitable (NICE NG109)",
      LOCAL_POLICY,
    ],
    sources: [NG109],
  },
  {
    id: "benzylpenicillin",
    name: "Benzylpenicillin",
    class: "Penicillin",
    color: "lime",
    routes: [
      {
        type: "iv",
        shortLabel: "IV: intrapartum antibiotics",
        label: "IV: intrapartum antibiotics for neonatal infection",
        dose: NO_NATIONAL_DOSE,
        notes: "First choice when intrapartum antibiotics are given and there is no penicillin allergy. With chorioamnionitis: benzylpenicillin plus gentamicin plus metronidazole (NICE NG195 table 1).",
      },
    ],
    cautions: [
      "Penicillin allergy (not severe): NICE NG195 names a cephalosporin active against group B streptococcus, for example cefotaxime, with caution (off label)",
      "Severe penicillin allergy: NICE NG195 names vancomycin, or another antibiotic active against group B streptococcus based on sensitivity testing or local susceptibility data",
      LOCAL_POLICY,
    ],
    sources: [NG195],
  },
  {
    id: "cefalexin",
    name: "Cefalexin",
    class: "First-generation cephalosporin",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: lower UTI in pregnancy",
        label: "Oral: lower UTI in pregnancy (second choice)",
        dose: "500 mg",
        frequency: "Twice a day for 7 days",
      },
    ],
    cautions: [
      "Second choice for lower UTI in pregnancy: if no improvement after at least 48 hours on the first choice, or the first choice is unsuitable (NICE NG109)",
      LOCAL_POLICY,
    ],
    sources: [NG109],
  },
  {
    id: "clindamycin",
    name: "Clindamycin",
    class: "Lincosamide",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: bacterial vaginosis",
        label: "Oral: bacterial vaginosis (alternative regimen)",
        dose: "300 mg",
        frequency: "Twice a day for 7 days",
        notes: "Alternative regimen (BASHH 2012). Intravaginal clindamycin cream 2% once daily for 7 days is a recommended regimen.",
      },
    ],
    cautions: [
      "Not the national choice for intrapartum antibiotics in penicillin allergy: NICE NG195 names a cephalosporin, or vancomycin if the allergy is severe",
      LOCAL_POLICY,
    ],
    sources: [BASHH_BV, NG195],
  },
  {
    id: "erythromycin",
    name: "Erythromycin",
    class: "Macrolide",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: P-PROM",
        label: "Oral: prophylaxis for intrauterine infection in P-PROM",
        dose: "250 mg",
        frequency: "Four times a day for a maximum of 10 days, or until she is in established labour (whichever is sooner)",
        notes: "NICE NG25 1.4.1.",
      },
    ],
    cautions: [
      "If erythromycin cannot be tolerated or is contraindicated, consider an oral penicillin for a maximum of 10 days or until established labour (NICE NG25 1.4.2)",
      "Do not offer co-amoxiclav as prophylaxis for intrauterine infection in P-PROM (NICE NG25 1.4.3)",
      LOCAL_POLICY,
    ],
    sources: [NG25],
  },
  {
    id: "gentamicin",
    name: "Gentamicin",
    class: "Aminoglycoside",
    color: "lime",
    routes: [
      {
        type: "iv",
        shortLabel: "IV: chorioamnionitis",
        label: "IV: intrapartum, with chorioamnionitis",
        dose: NO_NATIONAL_DOSE,
        frequency: "Once-daily dosing if used during labour (NICE NG195 1.6.3)",
        notes: "With chorioamnionitis and no penicillin allergy: benzylpenicillin plus gentamicin plus metronidazole (NICE NG195 table 1).",
      },
    ],
    cautions: [LOCAL_POLICY],
    sources: [NG195],
  },
  {
    id: "metronidazole",
    name: "Metronidazole",
    class: "Nitroimidazole",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: bacterial vaginosis",
        label: "Oral: bacterial vaginosis",
        dose: "400 mg twice a day for 5 to 7 days, or 2 g as a single dose",
        notes: "Recommended regimens (BASHH 2012). Intravaginal metronidazole gel 0.75% once daily for 5 days is also recommended.",
      },
      {
        type: "iv",
        shortLabel: "IV: chorioamnionitis",
        label: "IV: intrapartum, with chorioamnionitis",
        dose: NO_NATIONAL_DOSE,
        notes: "With chorioamnionitis: benzylpenicillin (or a cephalosporin in penicillin allergy) plus metronidazole, with gentamicin where NICE NG195 table 1 lists it.",
      },
    ],
    pregnancySafety: "Meta-analyses show no evidence of teratogenicity from metronidazole in the first trimester (BASHH 2012).",
    cautions: [LOCAL_POLICY],
    sources: [BASHH_BV, NG195],
  },
  {
    id: "nitrofurantoin",
    name: "Nitrofurantoin",
    class: "Nitrofuran",
    color: "lime",
    routes: [
      {
        type: "oral",
        shortLabel: "Oral: lower UTI in pregnancy",
        label: "Oral: lower UTI in pregnancy (first choice)",
        dose: "100 mg modified-release (or, if unavailable, 50 mg four times a day)",
        frequency: "Twice a day for 7 days",
        notes: "If eGFR is 45 ml/minute or more (NICE NG109 table 2).",
      },
    ],
    cautions: [
      "Avoid at term because it may produce neonatal haemolysis (NICE NG109)",
      "If there are symptoms of pyelonephritis or a complicated UTI, see the NICE guideline on acute pyelonephritis (NICE NG109)",
      LOCAL_POLICY,
    ],
    sources: [NG109],
  },
];
