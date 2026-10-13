// OUH Guides registry. Each guide lists its flowcharts in Pocket O&G's
// flowchart format; codes carry the source as a prefix ("OUH-") so Pocket
// O&G's glColors() themes them with the OUH source colour.
import { OUH_GS32_FLOWCHARTS } from "./OUH_GS32_FLOWCHARTS";
import { OUH_GS69_FLOWCHARTS } from "./OUH_GS69_FLOWCHARTS";

export const OUH_GUIDES = [
  {
    code: "OUH-GS32",
    label: "Growth Scans (singleton)",
    title: "GS32 Growth Scan Guideline",
    version: "v3.2",
    date: "August 2026",
    flowcharts: OUH_GS32_FLOWCHARTS,
  },
  {
    code: "OUH-GS69",
    label: "Multiple Pregnancy",
    title: "GS69 Multiple Pregnancy and Birth Guideline",
    version: "v3.1",
    date: "December 2025",
    note: "Review date 24 August 2026 has passed: check the current approved version",
    flowcharts: OUH_GS69_FLOWCHARTS,
  },
];

export const OUH_FLOWCHARTS = Object.fromEntries(
  OUH_GUIDES.flatMap(g => g.flowcharts.map(fc => [fc.id, { ...fc, gl: g.code }]))
);
