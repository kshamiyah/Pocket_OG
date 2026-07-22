import { useEffect, useRef, useState } from "react";
import { enterMotionClass, exitMotionClass, MOTION_MS, REDUCE_MOTION } from "../utils/panelMotion";

const SHELL = "fixed inset-0 overflow-hidden bg-white dark:bg-gray-950";

/** Full-screen transitions with paired exit + enter animations. */
export default function ViewTransition({ viewKey, direction = "forward", children }) {
  const childRef = useRef(children);
  const firstRef = useRef(true);
  const [pane, setPane] = useState(() => ({
    key: viewKey,
    direction,
    node: children,
    exiting: null,
  }));

  useEffect(() => {
    childRef.current = children;
  });

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    setPane((prev) => {
      if (viewKey === prev.key) {
        return { ...prev, node: childRef.current, direction };
      }
      return {
        key: viewKey,
        direction,
        node: childRef.current,
        exiting: { key: prev.key, node: prev.node },
      };
    });
  }, [viewKey, direction]);

  useEffect(() => {
    if (!pane.exiting) return undefined;
    const timer = window.setTimeout(() => {
      setPane((prev) => {
        if (!prev.exiting) return prev;
        return {
          ...prev,
          node: childRef.current,
          exiting: null,
        };
      });
    }, MOTION_MS);
    return () => window.clearTimeout(timer);
  }, [pane.exiting]);

  if (pane.exiting) {
    return (
      <div className={SHELL}>
        <div
          className={`absolute inset-0 z-0 ${exitMotionClass(pane.direction, pane.exiting.key)} ${REDUCE_MOTION}`}
        >
          {pane.exiting.node}
        </div>
        <div className={`absolute inset-0 z-10 ${enterMotionClass(pane.direction)} ${REDUCE_MOTION}`}>
          {pane.node}
        </div>
      </div>
    );
  }

  return (
    <div className={SHELL}>
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
