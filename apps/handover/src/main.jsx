import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeProvider";
import DarkModeFab from "./components/DarkModeToggle";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <DarkModeFab />
    </ThemeProvider>
  </StrictMode>
);
