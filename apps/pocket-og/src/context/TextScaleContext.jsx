import { createContext, useContext, useEffect, useState } from "react";
import { applyTextScale, loadTextScale, saveTextScale, stepTextScale } from "../utils/textScale";

const TextScaleContext = createContext(null);

export function TextScaleProvider({ children }) {
  const [textScale, setTextScale] = useState(loadTextScale);

  useEffect(() => {
    applyTextScale(textScale);
    saveTextScale(textScale);
  }, [textScale]);

  const increaseTextScale = () => setTextScale(current => stepTextScale(current, 1));
  const decreaseTextScale = () => setTextScale(current => stepTextScale(current, -1));

  return (
    <TextScaleContext.Provider value={{ textScale, setTextScale, increaseTextScale, decreaseTextScale }}>
      {children}
    </TextScaleContext.Provider>
  );
}

export function useTextScale() {
  const value = useContext(TextScaleContext);
  if (!value) throw new Error("useTextScale must be used within TextScaleProvider");
  return value;
}
