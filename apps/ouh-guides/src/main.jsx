import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../pocket-og/src/index.css";
import App from "./App";
import { applyTextScale, loadTextScale } from "../../pocket-og/src/utils/textScale";

applyTextScale(loadTextScale());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
