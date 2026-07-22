import { enterMotionClass, REDUCE_MOTION } from "../utils/panelMotion";

/** In-panel slide/fade when `panelKey` changes (ward drill, list mode, sort). */
export default function PanelTransition({ panelKey, direction = "forward", className = "", style, children }) {
  return (
    <div
      key={panelKey}
      className={`min-h-0 flex flex-col ${enterMotionClass(direction)} ${REDUCE_MOTION} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
