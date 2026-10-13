// OUH GS69: Multiple Pregnancy and Birth Guideline v3.1 (December 2025),
// Oxford University Hospitals NHS Foundation Trust. Scan pathway and referral
// only; GS69's wider antenatal and intrapartum care is not summarised here.
//
// GS69 states a review date of 24 August 2026, which has passed: the chart
// opens with that warning. Page numbers are PDF pages; each cited page opens as
// an image from /sources/gs69/.

const page = p => ({ label: `OUH GS69 v3.1 · p${p}`, href: `/sources/gs69/page-${String(p).padStart(2, "0")}.jpg` });

export const OUH_GS69_SCANS = {
  id: "OUH_GS69_SCANS",
  title: "Multiple Pregnancy: Scan Pathway",
  subtitle: "OUH GS69 v3.1 · chorionicity, scans and referral",
  startId: "review-date",
  nodes: {
    "review-date": {
      type: "alert",
      title: "Review Date Has Passed",
      text: "GS69 v3.1 lists a review date of 24 August 2026. Check that this is still the currently approved version before relying on it.",
      sources: [page(5)],
      next: "number",
    },
    "number": {
      type: "decision",
      title: "How Many Fetuses?",
      sources: [page(7)],
      options: [
        { label: "Twins", next: "chorionicity" },
        { label: "Triplets or more (higher order multiple pregnancy)", next: "end-higher" },
      ],
    },
    "end-higher": {
      type: "end",
      title: "Urgent FMU Referral",
      text: "Refer urgently to FMU, with the first visit preferably before 11 weeks. Thereafter care is as per monochorionic twins.",
      items: [
        "All monochorionic twin and higher order multiple pregnancies are cared for by the Fetal Medicine Unit at the John Radcliffe Hospital",
        "Scanned in FMU, as a minimum, every 2 weeks from 16 weeks until delivery",
        "Selective termination should be discussed by a Fetal Medicine consultant",
      ],
      sources: [page(13), page(8), page(7), page(5)],
    },
    "chorionicity": {
      type: "decision",
      title: "Chorionicity",
      text: "Determining chorionicity is crucial and is always possible before 14 weeks. In the first trimester, examine the placenta(s): if the placenta can be seen in the base of the membrane between the two sacs, the Lambda sign means the pregnancy is dichorionic. If the Lambda sign cannot be seen before 14 weeks, the pregnancy is monochorionic.",
      sources: [page(7)],
      options: [
        { label: "Dichorionic (DC)", next: "end-dc" },
        { label: "Monochorionic diamniotic (MCDA)", next: "end-mcda" },
        { label: "Monochorionic monoamniotic (MCMA)", next: "end-mcma" },
        { label: "Uncertain", next: "end-uncertain" },
      ],
    },
    "end-uncertain": {
      type: "end",
      title: "Establish Chorionicity",
      text: "If the Lambda sign is not visible after 14 weeks, assess chorionicity using fetal sex; if the sexes are the same and you are unsure, refer to FMU.",
      items: ["If the Lambda sign cannot be seen before 14 weeks, the pregnancy is monochorionic"],
      sources: [page(7)],
    },
    "end-dc": {
      type: "end",
      title: "DC Twins: Growth Scans at 24, 28, 32 and 36 Weeks",
      text: "Serial growth scans at 24, 28, 32 and 36 weeks as a minimum, preferably booked at the time of the anomaly scan.",
      items: [
        "Umbilical artery Doppler and quantified (deepest pool) liquor volume at every scan; MCA Doppler, as with singletons, at every scan from 32+0",
        "Scans at other times are not normally undertaken unless a specific problem is identified or requested by the clinician",
        "Uterine artery Doppler should not normally be performed in twin pregnancies",
        "Pre-booked 28, 32 and 36 week scans on the same day and site as the clinic appointment (not the 24 week scan)",
        "Twins are reviewed in clinic after all scans from 28 weeks",
        "Sonographers refer suspected growth abnormalities to FMU, or arrange follow-up in Maternity Ultrasound Level 4, using the same criteria as for singletons (GS32)",
        "Timing of birth is individual, usually planned no later than 37 to 37+6 weeks",
      ],
      sources: [page(8), page(11), page(5)],
    },
    "end-mcda": {
      type: "end",
      title: "MCDA Twins: FMU Scans Every 2 Weeks from 16 Weeks",
      text: "Refer to FMU. MC twins are scanned within the Fetal Medicine Unit (except the 12 week and anomaly scans), as a minimum every 2 weeks from 16 weeks until delivery.",
      items: [
        "Routine schedule: basic scans at 16, 18, 20, 22, 24, 26, 28, 30, 32, 34 and 36 weeks; at 20 weeks add cervical length, cardiac scan and fetal anatomy (ultrasound department)",
        "Basic assessment: growth with documented discrepancy, liquor volume with or without membrane folding, bladder presence, UmbA PI, and MCA PSV and PI",
        "Closer follow-up at the examiner's discretion, e.g. weekly if membrane folding, size discordance above 20%, sIUGR, or any twin with EFW below the 10th centile",
        "Advise her to report urgently a rapid increase in abdominal distension or shortness of breath: possible TTTS, needing same-day FMU review",
        "Suspected TTTS or selective IUGR: evaluation by or under the supervision of a fetal medicine consultant",
        "Timing of birth is individual, usually planned no later than 36+6 weeks",
      ],
      sources: [page(12), page(8), page(13), page(5)],
    },
    "end-mcma": {
      type: "end",
      title: "MCMA Twins: FMU Care",
      text: "Refer to FMU. MC twins are scanned within the Fetal Medicine Unit (except the 12 week and anomaly scans), as a minimum every 2 weeks from 16 weeks until delivery.",
      items: [
        "Closer follow-up at the examiner's discretion",
        "Advise her to report urgently a rapid increase in abdominal distension or shortness of breath: needs same-day FMU review",
        "Uncomplicated MCMA: birth between 32+0 and 33+6 weeks; caesarean section is advised",
      ],
      sources: [page(8), page(12), page(13), page(5)],
    },
  },
};

export const OUH_GS69_FLOWCHARTS = [OUH_GS69_SCANS];
