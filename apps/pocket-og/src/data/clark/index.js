import { HYPEREMESIS_PROTOCOL } from "./hyperemesis";
import { RFM_PROTOCOL } from "./rfm";
import { ITCHING_PROTOCOL } from "./itching";
import { PVB_PROTOCOL } from "./pvb";
import { SWOLLEN_LEGS_PROTOCOL } from "./swollen_legs";

export const CLARK_PROTOCOLS = {
  hyperemesis: HYPEREMESIS_PROTOCOL,
  rfm: RFM_PROTOCOL,
  itching: ITCHING_PROTOCOL,
  pvb: PVB_PROTOCOL,
  swollen_legs: SWOLLEN_LEGS_PROTOCOL,
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
        id: "rfm",
        label: "Reduced Fetal Movements",
        subtitle: "RFM — assessment & management",
        guideline: "RCOG GTG57",
        available: true,
      },
      {
        id: "itching",
        label: "Itching in Pregnancy",
        subtitle: "Obstetric cholestasis screen",
        guideline: "RBH GL880",
        available: true,
      },
      {
        id: "pvb",
        label: "PV Bleeding in Pregnancy",
        subtitle: "Antepartum haemorrhage",
        guideline: "RCOG GTG63",
        available: true,
      },
      {
        id: "swollen_legs",
        label: "Swollen Legs",
        subtitle: "DVT screen & VTE risk",
        guideline: "RBH GL891",
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
