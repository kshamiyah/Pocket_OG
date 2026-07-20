import { TEXT_SCALE_LABELS, TEXT_SCALES } from "../utils/textScale";
import { useTextScale } from "../context/TextScaleContext";

export default function TextSizeStepper({ className = "" }) {
  const { textScale, increaseTextScale, decreaseTextScale } = useTextScale();

  const atMin = textScale === TEXT_SCALES[0];
  const atMax = textScale === TEXT_SCALES[TEXT_SCALES.length - 1];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={decreaseTextScale}
        disabled={atMin}
        aria-label="Decrease text size"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-35 disabled:pointer-events-none"
      >
        A−
      </button>
      <span className="flex-1 text-center text-xs font-semibold text-gray-600 px-1 min-w-[5.5rem]">
        {TEXT_SCALE_LABELS[textScale]}
      </span>
      <button
        type="button"
        onClick={increaseTextScale}
        disabled={atMax}
        aria-label="Increase text size"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-35 disabled:pointer-events-none"
      >
        A+
      </button>
    </div>
  );
}
