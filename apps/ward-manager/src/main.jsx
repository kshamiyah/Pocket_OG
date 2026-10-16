import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const start = () => createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// The private test board is built with VITE_SIM=1 and gets a simulated clock;
// in the live build this branch is removed entirely.
if (import.meta.env.VITE_SIM === "1") import("./sim/clock.js").then(start);
else start();
