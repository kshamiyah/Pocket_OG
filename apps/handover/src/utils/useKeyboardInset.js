import { useEffect, useState } from "react";

/** Visible keyboard overlap in px (0 when closed). Uses Visual Viewport on iOS Safari / WKWebView. */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;

    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(overlap)));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}
