import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 400;

export default function BottomSheet({
  open,
  onClose,
  children,
  zIndex = 50,
  maxWidthClass = "max-w-lg",
  sheetClassName = "",
  align = "bottom",
  showHandle = true,
  dismissible = true,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimerRef = useRef(null);
  const animGenRef = useRef(0);

  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/unmount animation lifecycle
      setMounted(true);
      return;
    }

    if (!mounted) return;

    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, TRANSITION_MS);
  }, [open, mounted]);

  useLayoutEffect(() => {
    if (!open || !mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets slide animation before unmount
      setVisible(false);
      return;
    }

    const gen = ++animGenRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (animGenRef.current === gen) setVisible(true);
      });
    });
  }, [open, mounted]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!open || !mounted || !dismissible) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mounted, onClose, dismissible]);

  if (!mounted) return null;

  const alignClass =
    align === "responsive"
      ? "items-end sm:items-center justify-center"
      : "items-end justify-center";

  const radiusClass =
    align === "responsive" ? "rounded-t-3xl sm:rounded-3xl mx-0 sm:mx-4" : "rounded-t-3xl";

  const sheet = (
    <div
      className={`fixed inset-0 flex ${alignClass} backdrop-blur-sm transition-opacity duration-300 ease-out ${
        visible ? "bg-black/40 opacity-100" : "bg-black/40 opacity-0"
      }`}
      style={{ zIndex }}
    >
      <div
        className="absolute inset-0"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthClass} box-border bg-white shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
          visible ? "translate-y-0" : "translate-y-full"
        } ${radiusClass} ${sheetClassName}`}
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        onClick={e => e.stopPropagation()}
      >
        {showHandle && (
          <div className={`flex justify-center pt-3 pb-2 shrink-0 ${align === "responsive" ? "sm:hidden" : ""}`}>
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
