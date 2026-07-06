export const ROLES = [
  { key: "fy", label: "FY1 / FY2" },
  { key: "sho", label: "SHO / CT" },
  { key: "reg", label: "Registrar / ST" },
  { key: "cons", label: "Consultant" },
];

export const SHIFT_TYPES = [
  { key: "day", label: "Day" },
  { key: "long", label: "Long day" },
  { key: "night", label: "Night" },
  { key: "oncall", label: "On-call" },
];

export const PRIORITY = { ROUTINE: "routine", URGENT: "urgent" };

export const SORT_MODE = { URGENCY: "urgency", WARD: "ward" };

export const CAPTURE_MODE = { ROUND: "round", QUICK: "quick" };

export const WARD_LAYOUT_KIND = {
  NUMBERED: "numbered",
  NAMED: "named",
  NONE: "none",
};

export const NO_WARD_LABEL = "No ward";

export const STARTER_PHRASES = [
  "Review CTG",
  "Chase bloods",
  "KVI to complete",
  "Review scan",
  "Speak to registrar",
  "Handover note",
];
