import { GL861_IOL_FLOWCHART, GL861_TIMING_FLOWCHART } from "./GL861_FLOWCHARTS";
import { GL891_ANTENATAL_FLOWCHART, GL891_POSTNATAL_FLOWCHART } from "./GL891_FLOWCHARTS";
import { GL983_DKA_FLOWCHART } from "./GL983_FLOWCHART";
import { GL880_DELIVERY_FLOWCHART } from "./GL880_FLOWCHART";

export const FLOWCHARTS = {
  GL861_IOL:        GL861_IOL_FLOWCHART,
  GL861_TIMING:     GL861_TIMING_FLOWCHART,
  GL891_ANTENATAL:  GL891_ANTENATAL_FLOWCHART,
  GL891_POSTNATAL:  GL891_POSTNATAL_FLOWCHART,
  GL983_DKA:        GL983_DKA_FLOWCHART,
  GL880_DELIVERY:   GL880_DELIVERY_FLOWCHART,
};

export const FLOWCHART_GROUPS = [
  {
    label: "Induction of Labour",
    gl: "GL861",
    color: "teal",
    entries: [
      { id: "GL861_IOL",    title: "IOL Pathway",               subtitle: "Step-by-step management" },
      { id: "GL861_TIMING", title: "IOL Timing by Indication",  subtitle: "When to induce — priority & gestation" },
    ],
  },
  {
    label: "VTE — Thromboprophylaxis",
    gl: "GL891",
    color: "indigo",
    entries: [
      { id: "GL891_ANTENATAL", title: "Antenatal VTE Risk",  subtitle: "Risk scoring & prophylaxis indications" },
      { id: "GL891_POSTNATAL", title: "Postnatal VTE Risk",  subtitle: "Prophylaxis duration after delivery" },
    ],
  },
  {
    label: "DKA in Pregnancy",
    gl: "GL983",
    color: "pink",
    entries: [
      { id: "GL983_DKA", title: "DKA Emergency Pathway", subtitle: "Recognition → fluids → FRII → resolution" },
    ],
  },
  {
    label: "Cholestasis (ICP)",
    gl: "GL880",
    color: "yellow",
    entries: [
      { id: "GL880_DELIVERY", title: "ICP Diagnosis & Delivery", subtitle: "Bile acid stratification & timing" },
    ],
  },
];
