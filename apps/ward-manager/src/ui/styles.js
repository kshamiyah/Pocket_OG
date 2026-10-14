// Shared class strings. Colours, radii and type follow Handover's tokens
// (Handover: src/utils/typography.js, screenLayout.js, JobCard.jsx) so the two
// apps read as one family. Keep every class literal so Tailwind can see it.

// Type
export const TYPE_DISPLAY = "text-2xl font-semibold leading-tight text-gray-900 dark:text-white";
export const TYPE_TITLE = "text-lg font-semibold leading-snug text-gray-900 dark:text-white";
export const TYPE_BODY_SM = "text-sm font-normal leading-snug text-gray-900 dark:text-gray-100";
export const TYPE_UI = "text-sm font-semibold";
export const TYPE_UI_SM = "text-xs font-semibold";
export const TYPE_META = "text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400";
export const TYPE_OVERLINE = "text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500";
export const TYPE_EYEBROW = "text-xs font-medium uppercase tracking-wide text-claude-600 dark:text-claude-400";
export const TYPE_CAPTION = "text-xs font-normal text-gray-400 dark:text-gray-500";
export const TYPE_BADGE = "text-xs font-semibold uppercase tracking-wide";

// Surfaces
export const SCREEN = "min-h-dvh bg-white dark:bg-gray-950";
export const CARD = "rounded-xl border bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";
export const CARD_URGENT = "rounded-xl border bg-gray-50 dark:bg-gray-900/60 border-red-300 dark:border-red-900";
export const CARD_DUE = "rounded-xl border bg-gray-50 dark:bg-gray-900/60 border-claude-500 dark:border-claude-600 ring-1 ring-claude-500/30";
export const DIVIDER = "border-gray-200 dark:border-gray-800";

// Chips (Handover: SELECTED_CHIP and the unselected mode tab)
export const CHIP = "min-h-11 px-3.5 rounded-lg border text-sm font-semibold transition-colors active:scale-[0.97] disabled:opacity-40";
export const CHIP_SM = "min-h-9 px-3 rounded-lg border text-xs font-semibold transition-colors active:scale-[0.97] disabled:opacity-40";
export const CHIP_ON = "bg-claude-600 text-white border-claude-600";
export const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

// Buttons
export const BTN = "min-h-12 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:active:scale-100";
export const BTN_PRIMARY = "bg-claude-600 text-white disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400";
export const BTN_SECONDARY = "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40";
export const BTN_OK = "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400";
export const BTN_CONCERN = "bg-claude-50 dark:bg-claude-950/40 border border-claude-200 dark:border-claude-800 text-claude-800 dark:text-claude-300";
export const BTN_DANGER = "bg-white dark:bg-gray-950 border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400";

// Round outlined header button (Handover Home ICON_BTN + OUTLINE_ICON_BTN)
export const ICON_BTN = "w-11 h-11 rounded-full border flex items-center justify-center active:scale-95 transition-all border-claude-200 dark:border-claude-900 text-claude-700 dark:text-claude-400";

// Severity accents
export const SEV_TEXT = {
  urgent: "text-red-600 dark:text-red-400",
  warning: "text-claude-700 dark:text-claude-400",
  info: "text-gray-500 dark:text-gray-400",
};
export const SEV_BAR = {
  urgent: "bg-red-500",
  warning: "bg-claude-500",
  info: "bg-transparent",
};
export const ALERT_BOX = {
  urgent: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  warning: "bg-claude-50 dark:bg-claude-950/30 border-claude-200 dark:border-claude-800",
  info: "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800",
};
export const URGENT_BADGE = "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded";

// CTG category styling
export const CTG_BOX = {
  normal: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400",
  suspicious: "bg-claude-50 dark:bg-claude-950/40 border-claude-200 dark:border-claude-800 text-claude-800 dark:text-claude-300",
  pathological: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400",
};

export const INPUT = "w-full h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";
