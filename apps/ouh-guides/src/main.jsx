import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../pocket-og/src/index.css";
import App from "./App";
import { applyTextScale, loadTextScale } from "../../pocket-og/src/utils/textScale";
import { TextScaleProvider } from "../../pocket-og/src/context/TextScaleContext";

applyTextScale(loadTextScale());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TextScaleProvider>
      <App />
    </TextScaleProvider>
  </StrictMode>
);
