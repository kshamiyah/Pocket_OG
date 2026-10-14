// Inline SVG icons (no icon library), stroke style matching Handover.

const base = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const IconX = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconTick = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={3} className={className} {...base}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const IconBack = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...base}><path d="M15 19l-7-7 7-7" /></svg>
);
export const IconPlus = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...base}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconMoon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
);
export const IconSun = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const IconClipboard = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.5h6M9 10h6M9 14h6M9 18h3" /></svg>
);
export const IconMore = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...base}><path d="M6 12h.01M12 12h.01M18 12h.01" /></svg>
);
export const IconRound = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 4v4h4" /></svg>
);
export const IconInfo = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
export const IconChevron = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...base}><path d="M9 5l7 7-7 7" /></svg>
);
