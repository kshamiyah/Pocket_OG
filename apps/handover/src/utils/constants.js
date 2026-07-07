export const ROLES = [
  { key: "fy", label: "FY1 / FY2" },
  { key: "sho", label: "SHO / CT" },
  { key: "reg", label: "Registrar / ST" },
  { key: "cons", label: "Consultant" },
  { key: "mw", label: "Midwife" },
  { key: "anp", label: "ANP" },
  { key: "nurse", label: "Nurse" },
];

export const ROLE_OTHER_KEY = "other";

export function roleLabel(profile) {
  if (!profile) return "";
  if (profile.role === ROLE_OTHER_KEY) return profile.roleLabel?.trim() || "Other";
  return ROLES.find((r) => r.key === profile.role)?.label ?? "";
}

export function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export const SHIFT_TYPES = [
  { key: "day", label: "Day" },
  { key: "long", label: "Long day" },
  { key: "night", label: "Night" },
  { key: "oncall", label: "On-call" },
];

export const PRIORITY = { ROUTINE: "routine", URGENT: "urgent" };

export const SORT_MODE = { URGENCY: "urgency", WARD: "ward" };

export const NO_WARD_LABEL = "General";
