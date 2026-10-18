import { useRef, useState } from "react";

/**
 * Swipe from the left edge to go back, as on iOS. A touch that starts within
 * `edge` px of the left side and moves mostly sideways drags the page with the
 * finger; released past a third of the width (or flicked) it calls onBack,
 * otherwise it springs back. Vertical scrolling is untouched (touch-action
 * pan-y), and mouse input is ignored.
 */
export function useSwipeBack(onBack, { edge = 16 } = {}) {
  const [dx, setDx] = useState(0);
  const drag = useRef(null);
  const reset = () => { drag.current = null; setDx(0); };
  const onPointerDown = e => {
    // Not from a slider (the dilation strip), whose drag is its own.
    if (e.pointerType === "mouse" || e.clientX > edge || e.target?.closest?.('[role="slider"]')) return;
    drag.current = { x: e.clientX, y: e.clientY, t: Date.now(), id: e.pointerId, sideways: null, dx: 0 };
  };
  const onPointerMove = e => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const mx = e.clientX - d.x, my = e.clientY - d.y;
    if (d.sideways == null && (Math.abs(mx) > 8 || Math.abs(my) > 8)) d.sideways = Math.abs(mx) > Math.abs(my) && mx > 0;
    if (d.sideways === false) { reset(); return; }
    if (d.sideways) { d.dx = Math.max(0, mx); setDx(d.dx); }
  };
  const onPointerUp = e => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const width = e.currentTarget?.getBoundingClientRect?.().width || window.innerWidth;
    const fast = d.dx > 40 && d.dx / Math.max(1, Date.now() - d.t) > 0.5;
    const go = d.sideways && (d.dx > width / 3 || fast);
    reset();
    if (go) onBack();
  };
  return {
    swipeProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: reset },
    swipeStyle: {
      touchAction: "pan-y",
      ...(dx ? { transform: `translateX(${dx}px)` } : { transition: "transform 0.2s ease-out" }),
    },
  };
}
