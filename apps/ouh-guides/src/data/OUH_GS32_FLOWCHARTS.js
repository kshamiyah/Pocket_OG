// OUH GS32: Growth Scan Guideline v3.2 (August 2026), Oxford University
// Hospitals NHS Foundation Trust. Singleton pregnancies only; multiple
// pregnancies follow GS69 (6.1.4, p7).
//
// Local guidance: these charts live in the OUH Guides app, not in Pocket O&G,
// which is national-only. They use Pocket O&G's flowchart format so they can be
// merged into Pocket O&G later without change (see apps/ouh-guides/README.md).
//
// Each chart follows the guideline's own figure or table. Where a figure is
// open to more than one reading (for example two Figure 3 boxes that could
// both apply), the chart shows the boxes exactly as the figure does and the
// clinician chooses; it does not resolve the ambiguity. Page numbers are PDF
// pages; each cited page opens as an image from /sources/gs32/.

const page = p => ({ label: `OUH GS32 v3.2 · p${p}`, href: `/sources/gs32/page-${String(p).padStart(2, "0")}.jpg` });

const TABLE2_RISK_FACTORS = [
  "Age 40 or over",
  "Asian or Black ethnic group",
  "Booking BMI less than 18.5",
  "Booking BMI 35 or over",
  "Eating disorder, or a bowel disorder causing weight loss",
  "Bariatric surgery (e.g. gastric bypass or sleeve)",
  "Admitted to a hospital ward in this pregnancy after 12 weeks because of vaginal bleeding",
  "Smokes cigarettes (or carbon monoxide level more than 3 ppm)",
  "Recreational drugs in this pregnancy",
  "Previous preterm birth (before 37 weeks)",
  "High blood pressure in a previous pregnancy",
  "Previous stillbirth or late miscarriage (after 14 weeks)",
  "Sonographer: previous birthweight below the 10th centile",
  "Sonographer: high risk for PET on first trimester screening (BadgerNet critical alert)",
  "Sonographer: low PAPP-A, high inhibin or high AFP (ViewPoint)",
  "Sonographer: echogenic bowel at the 20-week screening (anomaly) scan",
  "Sonographer: single umbilical artery",
  "Sonographer: one or more fibroids larger than 5 cm",
];

const TABLE7_RISK_FACTORS = [
  "Current fetal: reduced fetal movements",
  "Current fetal: combined uterine artery Doppler PI at 20 to 24 week scan of 3.0 or more",
  "Current fetal: reduced liquor volume (MVP less than 2 cm)",
  "Current fetal: ACGV reduction of 40 centiles or more (from any previous scan)",
  "Current fetal: cCTG that does not meet criteria",
  "Current fetal: low PAPP-A, high AFP or high inhibin-A on first trimester screening",
  "Current maternal: abnormal sFlt:PlGF ratio",
  "Current maternal: age 40 or over",
  "Current maternal: hypertension",
  "Current maternal: diabetes",
  "Current maternal: gastric bypass",
  "Current maternal: other significant medical condition, e.g. CKD, SLE",
  "Current maternal: BMI less than 18.5",
  "Current maternal: smoking or substance abuse",
  "Historic: previous perinatal death",
];

// ── Figure 1 and Table 3: allocation at the 20-week screening (anomaly) scan ──

export const OUH_GS32_ALLOCATION = {
  id: "OUH_GS32_ALLOCATION",
  title: "Allocation to Growth Scan Care Pathway",
  subtitle: "OUH GS32 v3.2 · Figure 1 and Table 3 · 20-week scan",
  startId: "plurality",
  nodes: {
    "plurality": {
      type: "decision",
      title: "Singleton or Multiple Pregnancy?",
      text: "GS32 is for singleton pregnancies. Multiple pregnancies are allocated to a multiple pregnancy scan pathway instead (GS69).",
      sources: [page(7)],
      options: [
        { label: "Singleton", next: "low-growth" },
        { label: "Twins or higher order multiple pregnancy", next: "multiple" },
      ],
    },
    "multiple": {
      type: "end",
      title: "Use the Multiple Pregnancy Pathway (GS69)",
      text: "Women or pregnant people with a multiple pregnancy are allocated to the appropriate multiple pregnancy ultrasound scan pathway, not to one of the five Growth Scan Care Pathways, and have specific criteria for referral to the Fetal Medicine Unit (FMU).",
      items: ["Open the GS69 multiple pregnancy scan pathway in this app"],
      sources: [page(7)],
    },
    "low-growth": {
      type: "decision",
      title: "Is the EFW or AC Below the 10th Centile?",
      text: "Estimated fetal weight (EFW) or abdominal circumference (AC) at the 20-week screening (anomaly) scan.",
      sources: [page(9)],
      options: [
        { label: "Yes", next: "end-low-growth" },
        { label: "No", next: "uterine" },
      ],
    },
    "end-low-growth": {
      type: "end",
      title: "Pathway D1 (Scans Only), Growth Scan at 24 Weeks, Fetal Medicine Clinic",
      text: "Request Pathway D1 (scans only) and request a growth ultrasound scan at 24 weeks and refer to Fetal Medicine Clinic.",
      items: [
        "If the uterine artery Doppler total PI is 3.5 or more, request Pathway D2",
        "Pathway D1 scans: 28, 32, 36 and 39 weeks (Table 3)",
      ],
      sources: [page(9), page(10)],
    },
    "uterine": {
      type: "decision",
      title: "Is There a Congenital Uterine Abnormality?",
      text: "See the guideline's link for illustrations of Müllerian duct abnormalities.",
      sources: [page(9)],
      options: [
        { label: "No", next: "pi" },
        { label: "Yes: bicornuate or arcuate uterus", next: "bicornuate" },
        { label: "Yes: unicornuate, didelphic or septate uterus", next: "end-unicornuate" },
      ],
    },
    "bicornuate": {
      type: "action",
      title: "Refer to Preterm Labour Clinic",
      text: "Refer to Preterm Labour Clinic and request a Pathway as per the downstream flowchart (uterine artery Doppler total PI and risk factors).",
      sources: [page(9)],
      next: "pi",
    },
    "end-unicornuate": {
      type: "end",
      title: "Preterm Labour Clinic and Pathway D1",
      text: "Refer to Preterm Labour Clinic and request Pathway D1.",
      items: [
        "If the uterine artery Doppler total PI is 3.5 or more, request Pathway D2 (refer to Fetal Medicine)",
        "Pathway D1 scans: 28, 32, 36 and 39 weeks (Table 3)",
        "First consultant antenatal clinic after the 20-week scan at or before 25 weeks, for Pathway D0 or D1 (6.1.8)",
      ],
      sources: [page(9), page(10)],
    },
    "pi": {
      type: "decision",
      title: "Uterine Artery Doppler Total PI",
      text: "Total (combined) PI = right uterine artery PI + left uterine artery PI.\nIf only one side was obtained, total PI = the value obtained × 2 (e.g. left 1.1, right not obtained: total 2.2).",
      sources: [page(5), page(6), page(9)],
      options: [
        { label: "Below 2.5", next: "rf-low" },
        { label: "2.5 or more and below 3.0", next: "rf-mid" },
        { label: "3.0 or more and below 3.5", next: "end-d1" },
        { label: "3.5 or more", next: "end-d2" },
      ],
    },
    "rf-low": {
      type: "decision",
      title: "Any Pathway Risk Factor? (Table 2)",
      items: TABLE2_RISK_FACTORS,
      sources: [page(8)],
      options: [
        { label: "No risk factor", next: "end-a" },
        { label: "Any risk factor", next: "end-c" },
      ],
    },
    "rf-mid": {
      type: "decision",
      title: "Any Pathway Risk Factor? (Table 2)",
      items: TABLE2_RISK_FACTORS,
      sources: [page(8)],
      options: [
        { label: "No risk factor", next: "end-d0" },
        { label: "Any risk factor", next: "end-d1" },
      ],
    },
    "end-a": {
      type: "end",
      title: "Pathway A",
      text: "36-week scan.",
      items: ["Pathway scans can be booked within ± 5 days of the advised gestation"],
      sources: [page(10), page(6)],
    },
    "end-c": {
      type: "end",
      title: "Pathway C",
      text: "32-, 36- and 39-week scans.",
      items: [
        "The sonographer documents the risk factors on the scan report for Pathway C or D1",
        "BMI 35 or more, or fibroid(s) larger than 5 cm: regular growth scans from at least 32 weeks, as fundal height is hard to measure (6.1.9)",
        "Pathway scans can be booked within ± 5 days of the advised gestation",
      ],
      sources: [page(10), page(6), page(11)],
    },
    "end-d0": {
      type: "end",
      title: "Pathway D0",
      text: "28-, 32- and 36-week scans.",
      items: [
        "Refer for an appointment in a consultant antenatal clinic at or before 25 weeks",
        "Pathway scans can be booked within ± 5 days of the advised gestation",
      ],
      sources: [page(9), page(10)],
    },
    "end-d1": {
      type: "end",
      title: "Pathway D1",
      text: "28-, 32-, 36- and 39-week scans.",
      items: [
        "Refer for an appointment in a consultant antenatal clinic at or before 25 weeks",
        "The sonographer documents the risk factors on the scan report for Pathway C or D1",
        "BMI 35 or more, or fibroid(s) larger than 5 cm: regular growth scans from at least 32 weeks (6.1.9)",
        "Pathway scans can be booked within ± 5 days of the advised gestation",
      ],
      sources: [page(9), page(10), page(11)],
    },
    "end-d2": {
      type: "end",
      title: "Pathway D2",
      text: "Refer to Fetal Medicine.",
      sources: [page(9), page(10)],
    },
  },
};

// ── Tables 4, 5 and 6: findings at every growth scan from 24+0 ──

const EVERY_RESULT = [
  "MCA Doppler Vmax above 100 cm/s: refer to FMU (risk of fetal anaemia). No other standalone MCA measurement should prompt referral.",
  "Other growth concerns: refer to FMU or request FMU review of images",
];
const MAU_NOTE = "Refer to MAU only if DAU does not have the capacity or ability to review within the necessary timeframe (DAU working hours: Monday to Friday 0800 to 1800)";
const DAU_NOTE = "Refer to DAU by telephone and document as a BadgerNet referral; the administrative team can organise it on a clinician's behalf. Horton General Hospital scans: use the dedicated next-day ANC slots (Tuesday to Friday) instead of DAU";

function dopplerNodes(prefix, table, pageNo, late) {
  return {
    [`${prefix}-umba`]: {
      type: "decision",
      title: "Umbilical Artery Doppler",
      sources: [page(pageNo)],
      options: [
        { label: "Absent or reversed end diastolic flow (AREDF)", next: `${prefix}-aredf` },
        { label: "PI above the 95th centile", next: `${prefix}-abnormal` },
        { label: "Normal", next: `${prefix}-cpr` },
      ],
    },
    [`${prefix}-cpr`]: {
      type: "decision",
      title: "Cerebroplacental Ratio (CPR)",
      text: "CPR is only measured from 32+0, as MCA Doppler is measured from 32+0.",
      sources: [page(pageNo), page(13)],
      options: [
        { label: "CPR below 1.1", next: `${prefix}-abnormal` },
        { label: "Normal, MCA not obtained, or before 32+0", next: `${prefix}-growth` },
      ],
    },
    [`${prefix}-aredf`]: {
      type: "end",
      title: late ? "Needs Immediate Obstetric Review" : "Needs Same-Day Obstetric Review",
      text: "Urgent phone call to FMU; if FMU not available, contact DAU or MAU.",
      items: [`Diagnosis: SGA risk with abnormal Dopplers, or normal fetal growth but abnormal Dopplers (${table})`, MAU_NOTE, ...EVERY_RESULT],
      sources: [page(pageNo)],
    },
    [`${prefix}-abnormal`]: {
      type: "end",
      title: late ? "Needs Same-Day Obstetric Review" : "Refer to FMU",
      text: late
        ? "Refer to FMU, and to DAU or MAU if no same-day consultant ANC appointment is already arranged."
        : "Refer to FMU.",
      items: [`Diagnosis: SGA risk with abnormal Dopplers, or normal fetal growth but abnormal Dopplers (${table})`, ...(late ? [DAU_NOTE, MAU_NOTE] : []), ...EVERY_RESULT],
      sources: [page(pageNo)],
    },
  };
}

export const OUH_GS32_GROWTH = {
  id: "OUH_GS32_GROWTH",
  title: "Growth Scan Findings from 24+0",
  subtitle: "OUH GS32 v3.2 · Tables 4, 5 and 6 · diagnosis and actions",
  startId: "gestation",
  nodes: {
    "gestation": {
      type: "decision",
      title: "Gestation at This Growth Scan",
      sources: [page(15), page(16), page(17)],
      options: [
        { label: "24+0 to 34+6", sublabel: "Table 4", next: "t4-umba" },
        { label: "35+0 to 36+6", sublabel: "Table 5", next: "t5-umba" },
        { label: "37+0 or later", sublabel: "Table 6", next: "t6-umba" },
      ],
    },

    // Table 4: 24+0 to 34+6
    ...dopplerNodes("t4", "Table 4", 15, false),
    "t4-growth": {
      type: "decision",
      title: "Fetal Growth (Table 4)",
      sources: [page(15)],
      options: [
        { label: "EFW below the 3rd centile", next: "t4-efw3" },
        { label: "EFW 3rd to 9th centile, or AC below the 10th centile", sublabel: "Including when MCA is not obtained (only relevant from 32+0)", next: "t4-sga" },
        { label: "EFW above the 95th centile", next: "t4-large" },
        { label: "Normal (EFW and AC at or above the 10th centile)", next: "t4-normal" },
      ],
    },
    "t4-efw3": {
      type: "end",
      title: "Refer to FMU",
      text: "EFW below the 3rd centile with normal Dopplers.",
      items: ["Diagnosis: SGA risk with normal Dopplers", ...EVERY_RESULT],
      sources: [page(15)],
    },
    "t4-sga": {
      type: "end",
      title: "Repeat Scan in 2 Weeks",
      text: "Repeat scan in 2 weeks, with ANC on the same day (if possible).",
      items: ["Diagnosis: SGA risk with normal Dopplers, or abnormal growth with unobtainable MCA", ...EVERY_RESULT],
      sources: [page(15)],
    },
    "t4-large": {
      type: "end",
      title: "Large for Dates",
      text: "Only arrange an OGTT (via the community midwife) if other risk factors for GDM are present and she has not previously been screened.",
      items: ["Diagnosis: large for dates / fetal macrosomia", ...EVERY_RESULT],
      sources: [page(15)],
    },
    "t4-normal": {
      type: "end",
      title: "Normal Fetal Growth",
      text: "36-week scan as planned (if 7 days or more from the last ultrasound scan). No ANC referral.",
      items: [
        "Provided EFW is at or above the 10th centile and Dopplers are normal, no additional scans are required for an ACGV reduction of 40 centiles or more before the 36-week scan; scans more often than 4-weekly are not required where EFW is at or above the 10th centile",
        ...EVERY_RESULT,
      ],
      sources: [page(15)],
    },

    // Table 5: 35+0 to 36+6
    ...dopplerNodes("t5", "Table 5", 16, true),
    "t5-growth": {
      type: "decision",
      title: "Fetal Growth (Table 5)",
      sources: [page(16)],
      options: [
        { label: "EFW or AC below the 10th centile", sublabel: "Including EFW below the 3rd centile, and when MCA is not obtained", next: "t5-dau" },
        { label: "ACGV decrease of 40 centiles or more", next: "t5-dau" },
        { label: "EFW above the 95th centile", next: "t5-large" },
        { label: "EFW 10th to 19th centile and AC at or above the 10th centile", next: "t5-1019" },
        { label: "EFW at or above the 20th centile and AC at or above the 10th centile", next: "t5-normal" },
      ],
    },
    "t5-dau": {
      type: "end",
      title: "Refer to DAU",
      text: "Refer to DAU for an appointment the same or next working day (unless a consultant ANC appointment is already booked within 3 days).",
      items: ["Diagnosis: SGA risk with normal Dopplers, or abnormal growth with unobtainable MCA", "Then use the Figure 3 timing-of-birth chart", DAU_NOTE, ...EVERY_RESULT],
      sources: [page(16), page(22)],
    },
    "t5-large": {
      type: "end",
      title: "Large for Dates: Refer to ANC",
      text: "Refer to ANC. No glucose testing or OGTT. If she has risk factors for GDM and has not previously been screened, refer to the maternity diabetes clinic.",
      items: ["Diagnosis: large for dates / fetal macrosomia", ...EVERY_RESULT],
      sources: [page(16)],
    },
    "t5-1019": {
      type: "end",
      title: "Repeat Scan at 39 Weeks",
      text: "Request a repeat scan at 39 weeks, provided birth is not already planned before 40+0.",
      items: ["Diagnosis: normal fetal growth", ...EVERY_RESULT],
      sources: [page(16)],
    },
    "t5-normal": {
      type: "end",
      title: "Normal Fetal Growth",
      text: "No additional action; continue on the allocated Growth Scan Care Pathway.",
      items: EVERY_RESULT,
      sources: [page(16)],
    },

    // Table 6: 37+0 or later
    ...dopplerNodes("t6", "Table 6", 17, true),
    "t6-growth": {
      type: "decision",
      title: "Fetal Growth (Table 6)",
      sources: [page(17)],
      options: [
        { label: "EFW or AC below the 10th centile", sublabel: "Including EFW below the 3rd centile, and when MCA is not obtained", next: "t6-dau" },
        { label: "ACGV decrease of 40 centiles or more", next: "t6-dau" },
        { label: "EFW above the 95th centile", next: "t6-large" },
        { label: "EFW 10th to 19th centile and AC at or above the 10th centile", next: "t6-1019" },
        { label: "EFW at or above the 20th centile and AC at or above the 10th centile", next: "t6-normal" },
      ],
    },
    "t6-dau": {
      type: "end",
      title: "Refer to DAU Within 24 Hours",
      text: "Refer to DAU for review within 24 hours, unless a same-day consultant ANC appointment is already booked. If DAU or ANC review is not possible within that time frame, refer to MAU for review within 24 hours.",
      items: ["Diagnosis: SGA risk with normal Dopplers, or abnormal growth with unobtainable MCA", "Then use the Figure 4 timing-of-birth chart", DAU_NOTE, ...EVERY_RESULT],
      sources: [page(17), page(23)],
    },
    "t6-large": {
      type: "end",
      title: "Large for Dates: Refer to ANC",
      text: "Refer to ANC. No glucose testing or OGTT. If she has risk factors for GDM and has not previously been screened, refer to the maternity diabetes clinic.",
      items: ["Diagnosis: large for dates / fetal macrosomia", ...EVERY_RESULT],
      sources: [page(17)],
    },
    "t6-1019": {
      type: "end",
      title: "Repeat Scan in 14 Days or More",
      text: "Request a repeat scan 14 days or more later, provided birth is not already planned within the next 14 days.",
      items: ["Diagnosis: normal fetal growth", ...EVERY_RESULT],
      sources: [page(17)],
    },
    "t6-normal": {
      type: "end",
      title: "Normal Fetal Growth",
      text: "No action; continue on the allocated Growth Scan Care Pathway.",
      items: EVERY_RESULT,
      sources: [page(17)],
    },
  },
};

// ── Figure 2: liquor volume ──

export const OUH_GS32_LIQUOR = {
  id: "OUH_GS32_LIQUOR",
  title: "Management of Liquor Volume Abnormalities",
  subtitle: "OUH GS32 v3.2 · Figure 2",
  startId: "mvp",
  nodes: {
    "mvp": {
      type: "decision",
      title: "Maximum Vertical Pool (MVP)",
      text: "Also referred to as deepest vertical pool (DVP).",
      sources: [page(19)],
      options: [
        { label: "Below 2 cm", sublabel: "Oligohydramnios", next: "oligo" },
        { label: "2 cm or more and below 8 cm", next: "end-normal" },
        { label: "8 cm or more", sublabel: "Polyhydramnios", next: "afi" },
      ],
    },
    "end-normal": {
      type: "end",
      title: "Normal Liquor Volume",
      sources: [page(19)],
    },
    "oligo": {
      type: "decision",
      title: "Other Concerning Scan Findings?",
      sources: [page(19)],
      options: [
        { label: "Yes", next: "end-oligo-other" },
        { label: "No", next: "end-oligo" },
      ],
    },
    "end-oligo-other": {
      type: "end",
      title: "Manage the Other Findings",
      text: "As appropriate for the other concerning scan findings.",
      sources: [page(19)],
    },
    "end-oligo": {
      type: "end",
      title: "MAU Same-Day Review",
      text: "MAU (same-day review) and refer to FMU for image review.",
      sources: [page(19)],
    },
    "afi": {
      type: "decision",
      title: "Measure the Amniotic Fluid Index (AFI)",
      sources: [page(19)],
      options: [
        { label: "Below 25 cm", next: "end-normal" },
        { label: "25 cm or more and 30 cm or less", sublabel: "Mild polyhydramnios", next: "mild-dm" },
        { label: "Above 30 cm", sublabel: "Moderate to severe polyhydramnios", next: "severe-dm" },
      ],
    },
    "mild-dm": {
      type: "decision",
      title: "Pre-Pregnancy Diabetes or GDM?",
      text: "Mild polyhydramnios.",
      sources: [page(19)],
      options: [
        { label: "Yes", next: "end-diabetes" },
        { label: "No", next: "mild-gest" },
      ],
    },
    "mild-gest": {
      type: "decision",
      title: "Gestation",
      sources: [page(19)],
      options: [
        { label: "Before 35+0", next: "mild-ogtt" },
        { label: "35+0 or later", next: "mild-missed" },
      ],
    },
    "mild-ogtt": {
      type: "decision",
      title: "Negative OGTT in the Last 4 Weeks?",
      sources: [page(19)],
      options: [
        { label: "Yes", next: "end-no-action" },
        { label: "No", next: "end-cmw" },
      ],
    },
    "mild-missed": {
      type: "decision",
      title: "Was OGTT Screening Missed?",
      sources: [page(19)],
      options: [
        { label: "No", next: "end-anc" },
        { label: "Yes", next: "end-diabetes" },
      ],
    },
    "severe-dm": {
      type: "decision",
      title: "Pre-Pregnancy Diabetes or GDM?",
      text: "Moderate to severe polyhydramnios.",
      sources: [page(19)],
      options: [
        { label: "Yes", next: "end-diabetes" },
        { label: "No", next: "end-fmu" },
      ],
    },
    "end-no-action": { type: "end", title: "No Further Action", sources: [page(19)] },
    "end-cmw": { type: "end", title: "Contact the Community Midwife to Arrange an OGTT", sources: [page(19)] },
    "end-anc": { type: "end", title: "Refer to ANC", sources: [page(19)] },
    "end-diabetes": { type: "end", title: "Refer to Maternity Diabetes", sources: [page(19)] },
    "end-fmu": { type: "end", title: "Refer to FMU", sources: [page(19)] },
  },
};

// ── Figures 3 and 4, Table 7: late FGR, timing of birth ──

const LATE_COMMON = [
  "All referral criteria, except an isolated ACGV reduction with EFW at or above the 20th centile without risk factors, equate to a recommendation for birth in an obstetric-led unit and advice for continuous electronic fetal monitoring during labour",
  "Indications for urgent cCTG in this setting: hypertension (140/90 mmHg or more), AREDF or CPR below 1.1 (6.6.1)",
  "Check whether a Fetal Medicine Management Plan already exists on BadgerNet; seek Fetal Medicine opinion for abnormal fetal Dopplers and unusual cases",
  "Take a holistic view; if other maternal conditions exist, decide timing of birth with the relevant guidelines (and the Maternal Medicine team if needed)",
];
const DECLINE_NOTE = "If induction of labour or birth after 39+0 is declined: counsel that there is no increase in risk from birth or induction at this gestation and no evidence on how to monitor late SGA/FGR if pregnancy continues; agree an alternative monitoring plan (routine daily cCTGs are not supported by evidence)";
const FMU_ALONGSIDE = "FMU review will be requested alongside DAU review in any case of abnormal Doppler";

// Figures 3 and 4 share the same boxes. Risk factors (Table 7) only change the
// outcome for EFW 3rd to 9th centile and the two ACGV boxes, so the chart asks
// about them only on those branches. Figure 4's green ACGV box reads "EFW 10
// 10th centile"; it is taken as 10th to 19th, matching Figure 3.
// Steps 1 and 2 of Figures 3 and 4: what to check, with the categories the
// figure uses for each.
const LATE_MEASURES = [
  { label: "Uterine artery PI", note: "Combined, at the 20-week anomaly scan", values: ["3.0 or more", "2.50 to 2.99", "below 2.5"] },
  { label: "EFW", note: "Centile", values: ["below 1st", "1st to 2nd", "3rd to 9th", "10th or more"] },
  { label: "AC", note: "Centile", values: ["below 10th", "10th or more"] },
  { label: "ACGV", note: "From any previous scan: see the table at the top of the Viewpoint scan report", values: ["drop of 40 centiles or more", "drop of less than 40"] },
  { label: "UmbA EDF", values: ["absent or reversed (AREDF)", "positive"] },
  { label: "UmbA PI", note: "Assuming EDF positive", values: ["above 95th centile", "95th or below"] },
  { label: "CPR", values: ["below 1.1", "1.1 or more"] },
  { label: "Liquor MVP", values: ["below 2 cm", "2 cm or more"] },
];

function boxOptions(prefix) {
  const rf = "Next: any risk factors (Table 7)?";
  return [
    { label: "UmbA AREDF", sublabel: "Irrespective of EFW or risk factors", next: `${prefix}-aredf` },
    { label: "EFW below the 1st centile", next: `${prefix}-urgent` },
    { label: "EFW below the 10th centile and any of: UmbA PI above the 95th centile, CPR below 1.1, current pre-eclampsia", next: `${prefix}-urgent` },
    { label: "EFW at or above the 10th centile but CPR below 1.1 and/or UmbA PI above the 95th centile", next: `${prefix}-doppler` },
    { label: "EFW 1st to 2nd centile", next: `${prefix}-efw12` },
    { label: "EFW 3rd to 9th centile", sublabel: rf, next: `${prefix}-rf-efw` },
    { label: "Isolated AC below the 10th centile", next: `${prefix}-39` },
    { label: "ACGV reduction of 40 centiles or more and EFW 10th to 19th centile", sublabel: rf, next: `${prefix}-rf-acgv-1019` },
    { label: "ACGV reduction of 40 centiles or more and EFW at or above the 20th centile", sublabel: rf, next: `${prefix}-rf-acgv-20` },
  ];
}

const RF_TEXT = "Table 7 lists risk factors as they relate to timing of birth. It deliberately leaves out fetal Doppler abnormalities on the current scan, which the figure deals with.";
const ACGV_NOTE = "Table 7 also lists an ACGV reduction of 40 centiles or more, which is the finding that brought you here. The guideline does not say whether it counts for this box. If it always counted, the box without risk factors could never apply, which suggests only the other factors are meant; this is not stated, so use clinical judgement.";

function riskFactorNodes(prefix, figure, figPages) {
  const sources = [page(21), ...figPages];
  const ask = (title, extra, yes, no) => ({
    type: "decision",
    title,
    text: extra ? `${RF_TEXT}\n\n${extra}` : RF_TEXT,
    items: TABLE7_RISK_FACTORS,
    sources,
    options: [
      { label: "One or more risk factors", next: yes },
      { label: "No risk factors", next: no },
    ],
  });
  return {
    [`${prefix}-rf-efw`]: ask(`EFW 3rd to 9th Centile: Any Risk Factors? (${figure})`, null, `${prefix}-efw12`, `${prefix}-39`),
    [`${prefix}-rf-acgv-1019`]: ask(`ACGV Drop, EFW 10th to 19th: Any Risk Factors? (${figure})`, ACGV_NOTE, `${prefix}-39`, `${prefix}-40`),
    [`${prefix}-rf-acgv-20`]: ask(`ACGV Drop, EFW 20th or Above: Any Risk Factors? (${figure})`, ACGV_NOTE, `${prefix}-40`, `${prefix}-41`),
  };
}

export const OUH_GS32_LATE_FGR = {
  id: "OUH_GS32_LATE_FGR",
  title: "Late FGR: Timing of Birth",
  subtitle: "OUH GS32 v3.2 · Figures 3 and 4 · 35+0 to 39+6",
  startId: "review",
  nodes: {
    "review": {
      type: "action",
      title: "Obstetric Review if Any Of",
      items: [
        "EFW or AC below the 10th centile",
        "AC growth velocity (ACGV) deceleration of 40 centiles or more",
        "UmbA absent or reversed end diastolic flow (AREDF): urgent call to FMU, DAU or MAU",
        "UmbA PI above the 95th centile: plus FMU referral",
        "CPR below 1.1: plus FMU referral",
      ],
      sources: [page(22), page(23), page(20)],
      next: "gestation",
    },
    "gestation": {
      type: "decision",
      title: "Gestation at This Scan",
      sources: [page(22), page(23)],
      options: [
        { label: "35+0 to 36+6", sublabel: "Figure 3", next: "f3-check" },
        { label: "37+0 to 39+6", sublabel: "Figure 4", next: "f4-check" },
      ],
    },
    "f3-check": {
      type: "action",
      title: "Check and Review",
      text: "From the anomaly scan and the 35+0 to 36+6 scan, note which applies for each. The next step uses them to choose the box.",
      measures: LATE_MEASURES,
      sources: [page(22)],
      next: "f3-box",
    },
    "f3-box": {
      type: "decision",
      title: "Which Box Applies? (Figure 3)",
      text: "Risk factors (Table 7) only change the outcome for EFW 3rd to 9th centile and the ACGV boxes; for those, the next step asks about them.",
      sources: [page(22)],
      options: boxOptions("f3"),
    },
    ...riskFactorNodes("f3", "Figure 3", [page(22)]),
    "f3-aredf": {
      type: "end",
      title: "Urgent cCTG: Recommend Birth by Emergency Caesarean Section",
      text: "Urgent cCTG. Recommend birth by emergency caesarean section. The categorisation and urgency of caesarean section is determined by the cCTG.",
      items: ["Urgent call to FMU, DAU or MAU", ...LATE_COMMON],
      sources: [page(22)],
    },
    "f3-urgent": {
      type: "end",
      title: "Recommend Birth Before 37+0",
      text: "Urgent cCTG if hypertensive or CPR below 1.1. Recommend birth before 37+0 weeks.",
      items: [FMU_ALONGSIDE, ...LATE_COMMON],
      sources: [page(22)],
    },
    "f3-doppler": {
      type: "end",
      title: "Contact the On-Call Consultant Obstetrician",
      text: "Urgent cCTG (if CPR below 1.1). Contact the on-call consultant obstetrician. Consider FMU review.",
      items: [FMU_ALONGSIDE, ...LATE_COMMON],
      sources: [page(22)],
    },
    "f3-efw12": {
      type: "end",
      title: "Recommend Birth 37+0 to 37+6",
      text: "Recommend birth at 37+0 to 37+6 weeks.",
      items: LATE_COMMON,
      sources: [page(22)],
    },
    "f3-39": {
      type: "end",
      title: "Rescan in 2 Weeks: Recommend Birth 39+0 to 39+6",
      text: "Rescan in 2 weeks. Recommend birth at 39+0 to 39+6 weeks.",
      items: [...LATE_COMMON, DECLINE_NOTE],
      sources: [page(22), page(20)],
    },
    "f3-40": {
      type: "end",
      title: "Rescan in 2 Weeks: Recommend Birth 40+0 to 40+6",
      text: "Rescan in 2 weeks. Recommend birth at 40+0 to 40+6 weeks.",
      items: [...LATE_COMMON, DECLINE_NOTE],
      sources: [page(22), page(20)],
    },
    "f3-41": {
      type: "end",
      title: "Rescan in 2 Weeks: Recommend Birth 41+0 to 41+3",
      text: "Rescan in 2 weeks. Recommend birth at 41+0 to 41+3 weeks.",
      items: [
        "This is the one box that does not equate to a recommendation for birth in an obstetric-led unit with continuous electronic fetal monitoring",
        ...LATE_COMMON.slice(1),
        DECLINE_NOTE,
      ],
      sources: [page(22), page(20)],
    },
    "f4-check": {
      type: "action",
      title: "Check and Review",
      text: "From the anomaly scan and the 37+0 to 39+6 scan, note which applies for each. The next step uses them to choose the box.",
      measures: LATE_MEASURES,
      sources: [page(23)],
      next: "f4-box",
    },
    "f4-box": {
      type: "decision",
      title: "Which Box Applies? (Figure 4)",
      text: "Risk factors (Table 7) only change the outcome for EFW 3rd to 9th centile and the ACGV boxes; for those, the next step asks about them.",
      sources: [page(23)],
      options: boxOptions("f4"),
    },
    ...riskFactorNodes("f4", "Figure 4", [page(23)]),
    "f4-aredf": {
      type: "end",
      title: "Urgent cCTG: Recommend Birth by Emergency Caesarean Section",
      text: "Urgent cCTG. Recommend birth by emergency caesarean section. The categorisation and urgency of caesarean section is determined by the cCTG.",
      items: ["Urgent call to FMU, DAU or MAU", ...LATE_COMMON],
      sources: [page(23)],
    },
    "f4-urgent": {
      type: "end",
      title: "Recommend Urgent Birth",
      text: "Urgent cCTG if hypertensive or CPR below 1.1. Recommend urgent birth.",
      items: LATE_COMMON,
      sources: [page(23)],
    },
    "f4-doppler": {
      type: "end",
      title: "Recommend Urgent Birth",
      text: "Urgent cCTG if hypertensive or CPR below 1.1. Recommend urgent birth.",
      items: LATE_COMMON,
      sources: [page(23)],
    },
    "f4-efw12": {
      type: "end",
      title: "Recommend Urgent Birth",
      text: "Urgent cCTG if hypertensive or CPR below 1.1. Recommend urgent birth.",
      items: LATE_COMMON,
      sources: [page(23)],
    },
    "f4-39": {
      type: "end",
      title: "Recommend Birth 39+0 to 39+6",
      text: "Recommend birth at 39+0 to 39+6 weeks.",
      items: [...LATE_COMMON, DECLINE_NOTE],
      sources: [page(23), page(20)],
    },
    "f4-40": {
      type: "end",
      title: "Rescan in 2 Weeks: Recommend Birth 40+0 to 40+6",
      text: "Rescan in 2 weeks (unless birth is planned before this). Recommend birth at 40+0 to 40+6 weeks.",
      items: [...LATE_COMMON, DECLINE_NOTE],
      sources: [page(23), page(20)],
    },
    "f4-41": {
      type: "end",
      title: "Rescan in 2 Weeks: Recommend Birth 41+0 to 41+3",
      text: "Rescan in 2 weeks (unless birth is planned before this). Recommend birth at 41+0 to 41+3 weeks.",
      items: [
        "This is the one box that does not equate to a recommendation for birth in an obstetric-led unit with continuous electronic fetal monitoring",
        ...LATE_COMMON.slice(1),
        DECLINE_NOTE,
      ],
      sources: [page(23), page(20)],
    },
  },
};

export const OUH_GS32_FLOWCHARTS = [OUH_GS32_ALLOCATION, OUH_GS32_GROWTH, OUH_GS32_LIQUOR, OUH_GS32_LATE_FGR];
