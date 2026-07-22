import { useEffect, useRef, useState } from "react";

const DISMISS_THRESHOLD = 100;

export function bottomSheetTransform({ entered, closing, dragY = 0, lift = 0 }) {
  if (!entered || closing) return "translateY(100%)";
  const y = dragY + lift;
  return y === 0 ? "translateY(0)" : `translateY(${y}px)`;
}

/** Slide-up enter when `open` becomes true; pair with `setEntered(false)` on close. */
export function useSheetEntered(open) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  return [entered, setEntered];
}

export function sheetMotionClass({ dragging, instant = false }) {
  if (dragging || instant) return "";
  return "transition-transform duration-300 ease-out";
}

export function useBottomSheetSwipe(onDismiss) {
  const drag = useRef(null);
  const dragYRef = useRef(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    if (d.active && dragYRef.current >= DISMISS_THRESHOLD) onDismiss();
    drag.current = null;
    dragYRef.current = 0;
    setDragY(0);
    setDragging(false);
  };

  const handleProps = {
    onPointerDown: (e) => {
      drag.current = { startY: e.clientY, pointerId: e.pointerId, active: false };
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      const dy = e.clientY - d.startY;
      if (!d.active) {
        if (dy < 8) return;
        d.active = true;
        setDragging(true);
        e.currentTarget.setPointerCapture?.(d.pointerId);
      }
      const next = Math.max(0, dy);
      dragYRef.current = next;
      setDragY(next);
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  return { dragY, dragging, handleProps };
}
