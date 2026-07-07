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
