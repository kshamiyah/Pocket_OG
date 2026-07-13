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
  TRIAL:    { badge: "bg-cyan-50 text-cyan-700",       border: "border-cyan-100",    conditionColor: "text-cyan-600",    icon: "text-cyan-500",    accent: "bg-cyan-500",    solid: "bg-cyan-600",    solidHover: "hover:bg-cyan-700",    text: "text-cyan-700",    bg: "bg-cyan-50" },
  UKKA:     { badge: "bg-emerald-50 text-emerald-700", border: "border-emerald-100", conditionColor: "text-emerald-500", icon: "text-emerald-500", accent: "bg-emerald-500", solid: "bg-emerald-600", solidHover: "hover:bg-emerald-700", text: "text-emerald-700", bg: "bg-emerald-50" },
  ESC:      { badge: "bg-rose-50 text-rose-700",       border: "border-rose-100",    conditionColor: "text-rose-500",    icon: "text-rose-500",    accent: "bg-rose-500",    solid: "bg-rose-600",    solidHover: "hover:bg-rose-700",    text: "text-rose-700",    bg: "bg-rose-50" },
  ESHRE:    { badge: "bg-purple-50 text-purple-700",   border: "border-purple-100",  conditionColor: "text-purple-500",  icon: "text-purple-500",  accent: "bg-purple-500",  solid: "bg-purple-600",  solidHover: "hover:bg-purple-700",  text: "text-purple-700",  bg: "bg-purple-50" },
  BHIVA:    { badge: "bg-orange-50 text-orange-700",   border: "border-orange-100",  conditionColor: "text-orange-500",  icon: "text-orange-500",  accent: "bg-orange-500",  solid: "bg-orange-600",  solidHover: "hover:bg-orange-700",  text: "text-orange-700",  bg: "bg-orange-50" },
  FSRH:     { badge: "bg-lime-50 text-lime-700",       border: "border-lime-100",    conditionColor: "text-lime-600",    icon: "text-lime-600",    accent: "bg-lime-500",    solid: "bg-lime-600",    solidHover: "hover:bg-lime-700",    text: "text-lime-700",    bg: "bg-lime-50" },
  BSH:      { badge: "bg-sky-50 text-sky-700",         border: "border-sky-100",     conditionColor: "text-sky-500",     icon: "text-sky-500",     accent: "bg-sky-500",     solid: "bg-sky-600",     solidHover: "hover:bg-sky-700",     text: "text-sky-700",     bg: "bg-sky-50" },
  BGCS:     { badge: "bg-zinc-100 text-zinc-700",      border: "border-zinc-200",    conditionColor: "text-zinc-500",    icon: "text-zinc-500",    accent: "bg-zinc-500",    solid: "bg-zinc-700",    solidHover: "hover:bg-zinc-800",    text: "text-zinc-700",    bg: "bg-zinc-50" },
};

// Sources that appear in the app, in legend order.
export const SOURCE_ORDER = ["RBH", "NICE", "RCOG", "BASHH", "NHSCSP", "MBRRACE", "TOG", "TRIAL", "UKKA", "ESC", "ESHRE", "BHIVA", "FSRH", "BSH", "BGCS"];

export const SOURCE_LABELS = {
  RBH: "RBH — local trust",
  NICE: "NICE",
  RCOG: "RCOG",
  BASHH: "BASHH",
  NHSCSP: "NHS Cervical Screening",
  MBRRACE: "MBRRACE-UK",
  TOG: "TOG — RCOG review journal",
  TRIAL: "Landmark trial",
  UKKA: "UK Kidney Association",
  ESC: "European Society of Cardiology",
  ESHRE: "ESHRE / ASRM international guideline",
  BHIVA: "British HIV Association",
  FSRH: "Faculty of Sexual & Reproductive Healthcare",
  BSH: "British Society for Haematology",
  BGCS: "British Gynaecological Cancer Society",
};

// Hex equivalents (the -500 shades) for places that can't use Tailwind classes
// (e.g. inline link colours in RichText).
export const SOURCE_HEX = {
  RBH: "#3b82f6", NICE: "#14b8a6", RCOG: "#8b5cf6",
  BASHH: "#d946ef", NHSCSP: "#64748b", MBRRACE: "#6366f1",
  TOG: "#ec4899", TRIAL: "#06b6d4", UKKA: "#10b981", ESC: "#f43f5e",
  ESHRE: "#a855f7",
  BHIVA: "#f97316",
  FSRH: "#84cc16",
  BSH: "#0ea5e9",
  BGCS: "#71717a",
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

// Colour for a guideline code — resolved through its source. Codes that aren't
// guidelines but ARE a source key (e.g. "TOG") theme by that source directly;
// anything else falls through to the neutral default.
export function glColors(gl) {
  return sourceColors(GUIDELINES[gl]?.source ?? gl);
}
