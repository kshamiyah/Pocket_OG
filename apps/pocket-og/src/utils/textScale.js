export const TEXT_SCALE_KEY = "pocketog_text_scale_v1";

export const TEXT_SCALES = ["default", "large", "xlarge"];

export const TEXT_SCALE_LABELS = {
  default: "Default",
  large: "Large",
  xlarge: "Extra large",
};

export function loadTextScale() {
  try {
    const value = localStorage.getItem(TEXT_SCALE_KEY);
    return TEXT_SCALES.includes(value) ? value : "default";
  } catch {
    return "default";
  }
}

export function saveTextScale(scale) {
  try {
    localStorage.setItem(TEXT_SCALE_KEY, scale);
  } catch {
    /* best effort */
  }
}

export function applyTextScale(scale) {
  const root = document.documentElement;
  TEXT_SCALES.forEach(id => root.classList.remove(`text-scale-${id}`));
  root.classList.add(`text-scale-${scale}`);
}

export function stepTextScale(current, delta) {
  const index = TEXT_SCALES.indexOf(current);
  const next = Math.min(TEXT_SCALES.length - 1, Math.max(0, index + delta));
  return TEXT_SCALES[next];
}
