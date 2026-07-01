// Colour = SOURCE. Every guideline-derived surface (Search results, Guides,
// Flowcharts, Consent, Calc) is themed by the body the content comes from, so
// colour carries a consistent meaning across the app. Clinical-severity colours
// (red/amber/green for CTG grades, risk frequency, alerts) are deliberately NOT
// used here, so a coloured accent never looks like a danger signal.
//
// Token roles:
//   badge          — light pill background + text
//   border         — border to pair with badge
//   conditionColor — coloured text for condition/setting labels
//   icon           — text colour for the code in list views
//   accent         — solid bar / dot
//   solid          — solid bg for primary buttons
//   solidHover     — hover modifier for solid buttons
//   text / bg      — for consent/calc list theming
import { GUIDELINES } from "@pocket-og/guidelines";

export const SOURCE_COLORS = {
  RBH:      { badge: "bg-blue-50 text-blue-700",       border: "border-blue-100",    conditionColor: "text-blue-500",    icon: "text-blue-500",    accent: "bg-blue-500",    solid: "bg-blue-600",    solidHover: "hover:bg-blue-700",    text: "text-blue-700",    bg: "bg-blue-50" },
  NICE:     { badge: "bg-teal-50 text-teal-700",       border: "border-teal-100",    conditionColor: "text-teal-500",    icon: "text-teal-500",    accent: "bg-teal-500",    solid: "bg-teal-600",    solidHover: "hover:bg-teal-700",    text: "text-teal-700",    bg: "bg-teal-50" },
  RCOG:     { badge: "bg-violet-50 text-violet-700",   border: "border-violet-100",  conditionColor: "text-violet-500",  icon: "text-violet-500",  accent: "bg-violet-500",  solid: "bg-violet-600",  solidHover: "hover:bg-violet-700",  text: "text-violet-700",  bg: "bg-violet-50" },
  BASHH:    { badge: "bg-fuchsia-50 text-fuchsia-700", border: "border-fuchsia-100", conditionColor: "text-fuchsia-500", icon: "text-fuchsia-500", accent: "bg-fuchsia-500", solid: "bg-fuchsia-600", solidHover: "hover:bg-fuchsia-700", text: "text-fuchsia-700", bg: "bg-fuchsia-50" },
  NHSCSP:   { badge: "bg-slate-100 text-slate-700",    border: "border-slate-200",   conditionColor: "text-slate-500",   icon: "text-slate-500",   accent: "bg-slate-500",   solid: "bg-slate-600",   solidHover: "hover:bg-slate-700",   text: "text-slate-700",   bg: "bg-slate-50" },
  MBRRACE:  { badge: "bg-indigo-50 text-indigo-700",   border: "border-indigo-100",  conditionColor: "text-indigo-500",  icon: "text-indigo-500",  accent: "bg-indigo-500",  solid: "bg-indigo-600",  solidHover: "hover:bg-indigo-700",  text: "text-indigo-700",  bg: "bg-indigo-50" },
  TOG:      { badge: "bg-pink-50 text-pink-700",       border: "border-pink-100",    conditionColor: "text-pink-500",    icon: "text-pink-500",    accent: "bg-pink-500",    solid: "bg-pink-600",    solidHover: "hover:bg-pink-700",    text: "text-pink-700",    bg: "bg-pink-50" },
};

// Sources that appear in the app, in legend order.
export const SOURCE_ORDER = ["RBH", "NICE", "RCOG", "BASHH", "NHSCSP", "MBRRACE", "TOG"];

export const SOURCE_LABELS = {
  RBH: "RBH — local trust",
  NICE: "NICE",
  RCOG: "RCOG",
  BASHH: "BASHH",
  NHSCSP: "NHS Cervical Screening",
  MBRRACE: "MBRRACE-UK",
  TOG: "TOG — RCOG review journal",
};

// Hex equivalents (the -500 shades) for places that can't use Tailwind classes
// (e.g. inline link colours in RichText).
export const SOURCE_HEX = {
  RBH: "#3b82f6", NICE: "#14b8a6", RCOG: "#8b5cf6",
  BASHH: "#d946ef", NHSCSP: "#64748b", MBRRACE: "#6366f1",
  TOG: "#ec4899",
};

export const DEFAULT_GL_COLORS = {
  badge: "bg-gray-100 text-gray-600",
  border: "border-gray-200",
  conditionColor: "text-gray-400",
  icon: "text-gray-400",
  accent: "bg-gray-300",
  solid: "bg-gray-500",
  solidHover: "hover:bg-gray-600",
  text: "text-gray-600",
  bg: "bg-gray-50",
};

// Colour for a source key (e.g. "NICE") — used by consent/calc/legend.
export function sourceColors(source) {
  return SOURCE_COLORS[source] ?? DEFAULT_GL_COLORS;
}

// Resolve the primary source from a citation label like "NICE NG192 · RCOG CA14"
// (consent procedures and calc scenarios store their source this way).
export function sourceFromLabel(label = "") {
  const up = label.toUpperCase();
  return SOURCE_ORDER.find(s => up.includes(s)) ?? null;
}

// Colour for a guideline code — resolved through its source.
export function glColors(gl) {
  return sourceColors(GUIDELINES[gl]?.source);
}
