import { useState } from "react";
import LandingScreen from "./components/LandingScreen";
import ShiftSetup    from "./components/ShiftSetup";
import HandoverIn    from "./components/HandoverIn";
import WardPage      from "./components/WardPage";

const SHIFT_KEY = "pocket_suite_shift";
const BEDS_KEY  = "pocket_og_ward_beds";

function loadShift() {
  try { return JSON.parse(localStorage.getItem(SHIFT_KEY)); }
  catch { return null; }
}

function loadBeds() {
  try { const r = localStorage.getItem(BEDS_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

function hasBeds() {
  return Object.keys(loadBeds()).length > 0;
}

export default function App() {
  const [shift, setShift] = useState(loadShift);
  const [view,  setView]  = useState(() => loadShift() ? "board" : "landing");
  const [beds,  setBeds]  = useState(loadBeds);

  const beginShift = () => setView("setup");

  const completeSetup = shiftData => {
    localStorage.setItem(SHIFT_KEY, JSON.stringify(shiftData));
    setShift(shiftData);
    if (hasBeds()) {
      setBeds(loadBeds());
      setView("handover_in");
    } else {
      setView("board");
    }
  };

  const takeOver = () => setView("board");

  const clearAndStart = () => {
    localStorage.removeItem(BEDS_KEY);
    setView("board");
  };

  const endShift = () => {
    localStorage.removeItem(SHIFT_KEY);
    setShift(null);
    setView("landing");
  };

  if (view === "landing")     return <LandingScreen onBegin={beginShift} />;
  if (view === "setup")       return <ShiftSetup onComplete={completeSetup} />;
  if (view === "handover_in") return (
    <HandoverIn
      beds={beds}
      doctorName={shift?.doctorName ?? "Doctor"}
      onTakeOver={takeOver}
      onClear={clearAndStart}
    />
  );
  return <WardPage shift={shift} onEndShift={endShift} />;
}
