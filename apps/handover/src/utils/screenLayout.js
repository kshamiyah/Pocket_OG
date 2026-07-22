/** Shared full-screen mobile layout tokens (iOS-safe dvh, not 100vh). */
export const SCREEN = "h-dvh max-h-dvh flex flex-col overflow-hidden bg-white dark:bg-gray-950";
export const SCREEN_SCROLL = "flex-1 min-h-0 overflow-y-auto overflow-x-hidden";
export const SCREEN_FOOTER =
  "shrink-0 pt-2 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950";

export function safeTop(extra = "1.25rem") {
  return { paddingTop: `calc(env(safe-area-inset-top) + ${extra})` };
}

export function safeBottom(extra = "0.75rem") {
  return { paddingBottom: `calc(env(safe-area-inset-bottom) + ${extra})` };
}

export const OVERLAY_SCREEN = "fixed inset-0 z-50 h-dvh max-h-dvh flex flex-col overflow-hidden bg-white dark:bg-gray-950";

/** Primary onboarding / hub CTA (claude orange). */
export const PRIMARY_BTN =
  "w-full py-4 rounded-2xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-base font-bold active:scale-95 transition-all";

/** Compact full-width primary CTA. */
export const PRIMARY_BTN_COMPACT =
  "w-full py-3 rounded-xl bg-claude-600 text-white text-sm font-bold active:scale-[0.98] transition-all";

/** Inline primary action (Add, Enter, etc.). */
export const PRIMARY_BTN_SM =
  "shrink-0 px-4 py-2.5 rounded-xl bg-claude-600 text-white text-sm font-bold active:scale-95 transition-all";

/** Selected chip, toggle, or urgency "routine" state. */
export const SELECTED_CHIP = "bg-claude-600 text-white border-claude-600";

/** Selected segment tab (sort, mode). */
export const SEGMENT_ON = "bg-claude-600 text-white";

/** Soft panel for onboarding form sections. */
export const PANEL =
  "rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40";

/** Min 44px tap height for text back links. */
export const BACK_LINK =
  "inline-flex items-center min-h-11 px-1 -mx-1 text-sm font-bold text-gray-500 dark:text-gray-400 active:text-gray-700 dark:active:text-gray-200";

/** Segmented control tab (mode, density, sort). */
export const SEGMENT_TAB = "px-3 py-2 min-h-11 flex items-center text-xs font-bold";

/** Job list spacing (All jobs, ward drill, master sheet). */
export const JOB_LIST = "flex flex-col gap-1.5";
export const JOB_LIST_SECTION = "flex flex-col gap-1.5";
export const JOB_LIST_SCROLL =
  "flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-5 py-3 flex flex-col gap-3 touch-pan-y";
