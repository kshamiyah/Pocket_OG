import { HYPEREMESIS_PROTOCOL } from "./hyperemesis";

export const CLARK_PROTOCOLS = {
  hyperemesis: HYPEREMESIS_PROTOCOL,
};

export const CLARK_CATEGORIES = [
  {
    id: "antenatal",
    label: "Antenatal",
    protocols: [
      {
        id: "hyperemesis",
        label: "Hyperemesis Gravidarum",
        subtitle: "Nausea & vomiting in pregnancy",
        guideline: "RCOG GTG69",
        available: true,
      },
      {
        id: "pre_eclampsia",
        label: "Pre-eclampsia",
        subtitle: "Hypertension in pregnancy",
        guideline: "RBH GL952",
        available: false,
      },
      {
        id: "gestational_diabetes",
        label: "Gestational Diabetes",
        subtitle: "Diabetes in pregnancy",
        guideline: "RBH GL983",
        available: false,
      },
      {
        id: "antepartum_haemorrhage",
        label: "Antepartum Haemorrhage",
        subtitle: "Bleeding after 24 weeks",
        guideline: "RCOG GTG63",
        available: false,
      },
      {
        id: "vte",
        label: "VTE in Pregnancy",
        subtitle: "Thrombosis risk assessment",
        guideline: "RBH GL891",
        available: false,
      },
    ],
  },
  {
    id: "intrapartum",
    label: "Intrapartum",
    protocols: [
      {
        id: "postpartum_haemorrhage",
        label: "Postpartum Haemorrhage",
        subtitle: "PPH — active management",
        guideline: "RCOG GTG52",
        available: false,
      },
      {
        id: "cord_prolapse",
        label: "Cord Prolapse",
        subtitle: "Obstetric emergency",
        guideline: "RCOG GTG50",
        available: false,
      },
    ],
  },
  {
    id: "gynaecology",
    label: "Gynaecology",
    protocols: [
      {
        id: "ectopic",
        label: "Ectopic Pregnancy",
        subtitle: "Suspected ectopic — assessment & management",
        guideline: "RBH CG623",
        available: false,
      },
      {
        id: "miscarriage",
        label: "Miscarriage",
        subtitle: "First trimester pregnancy loss",
        guideline: "RBH CG565",
        available: false,
      },
      {
        id: "heavy_menstrual_bleeding",
        label: "Heavy Menstrual Bleeding",
        subtitle: "Assessment & medical management",
        guideline: "NICE NG88",
        available: false,
      },
    ],
  },
];
