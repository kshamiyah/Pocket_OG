import { useState } from "react";

/**
 * Open/close state for a SubPage, so it can slide out before it unmounts.
 * page: the open page's key (or null). closing: true while sliding out.
 */
export function useSubPage() {
  const [page, setPage] = useState(null);
  const [closing, setClosing] = useState(false);
  const open = key => { setClosing(false); setPage(key); };
  const close = () => {
    // With reduced motion there is no exit animation to wait for.
    const still = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) setPage(null); else setClosing(true);
  };
  const closed = () => { setClosing(false); setPage(null); };
  return { page, closing, open, close, closed };
}
