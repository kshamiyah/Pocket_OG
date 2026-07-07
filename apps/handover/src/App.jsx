import { useState } from "react";
import PortfolioSetup from "./components/PortfolioSetup";
import IntroScreen from "./components/IntroScreen";
import WardsIntroScreen from "./components/WardsIntroScreen";
import ShiftPicker from "./components/ShiftPicker";
import Home from "./components/Home";
import HandoverScreen from "./components/HandoverScreen";
import ScanScreen from "./components/ScanScreen";
import ReviewMerge from "./components/ReviewMerge";
import WardManager from "./components/WardManager";
import WardSetup from "./components/WardSetup";
import { Storage } from "./utils/storage";
import { nextId } from "./utils/jobs";
import { decodeHandoverPayload, extractHandoverCode } from "./utils/payload";

function incomingFromUrl() {
  const code = extractHandoverCode();
  if (!code) return null;
  window.history.replaceState(null, "", window.location.pathname);
  try {
    return decodeHandoverPayload(code);
  } catch {
    return null;
  }
}

export default function App() {
  const [profile, setProfileState] = useState(Storage.getProfile);
  const [shift, setShiftState] = useState(Storage.getShift);
  const [jobs, setJobsState] = useState(Storage.getJobs);
  const [recentWards, setRecentWardsState] = useState(Storage.getRecentWards);
  const [recentBeds, setRecentBedsState] = useState(Storage.getRecentBeds);
  const [wardLayouts, setWardLayoutsState] = useState(Storage.getWardLayouts);
  const [incomingJobs, setIncomingJobs] = useState(incomingFromUrl);
  const [wardSetupTarget, setWardSetupTarget] = useState(null);
  const [wardSetupReturn, setWardSetupReturn] = useState("list");
  // Rounds/Walk focus lives here, not inside Home's children, so it survives
  // switching tabs and even leaving Home entirely (Handover, Scan, Bed setup)
  // and coming back.
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedSelected, setBedSelected] = useState(false);
  const [view, setView] = useState(() =>
    incomingJobs ? "review" : !profile ? "portfolio" : !shift ? "shift" : "list"
  );

  const setJobs = (next) => { setJobsState(next); Storage.setJobs(next); };
  const setRecentWards = (next) => { setRecentWardsState(next); Storage.setRecentWards(next); };
  const setRecentBeds = (next) => { setRecentBedsState(next); Storage.setRecentBeds(next); };
  const setWardLayouts = (next) => { setWardLayoutsState(next); Storage.setWardLayouts(next); };

  const gateView = () => (!profile ? "portfolio" : !shift ? "shift" : "list");

  const completePortfolio = ({ role }) => {
    const nextProfile = { role };
    Storage.setProfile(nextProfile);
    setProfileState(nextProfile);
    // First-ever launch only — completePortfolio only runs once, when
    // profile was previously unset, so this chain can't resurface later.
    setView("intro");
  };

  const completeShift = ({ shiftType }) => {
    const nextShift = { type: shiftType, startedAt: new Date().toISOString() };
    Storage.setShift(nextShift);
    setShiftState(nextShift);
    setView("list");
  };

  // Ending a handover ends the shift — the next time this device is opened
  // it asks what's starting next, the "clocking out" half of the ritual.
  const finishHandover = ({ clear }) => {
    if (clear) setJobs([]);
    Storage.clearShift();
    setShiftState(null);
    setView("shift");
  };

  const mergeIncoming = (chosen) => {
    let running = [...jobs];
    let id = nextId(running);
    const withIds = chosen.map((j) => ({ ...j, id: id++ }));
    running = [...running, ...withIds];
    setJobs(running);
    setIncomingJobs(null);
    setView(gateView());
  };

  const discardIncoming = () => {
    setIncomingJobs(null);
    setView(gateView());
  };

  const openWardSetup = (wardName, returnTo = "list") => {
    setWardSetupTarget(wardName);
    setWardSetupReturn(returnTo);
    setView("wardSetup");
  };
  const saveWardLayout = (layout) => {
    setWardLayouts({ ...wardLayouts, [wardSetupTarget]: layout });
    setView(wardSetupReturn);
  };

  const wardNames = [...new Set([
    ...Object.keys(wardLayouts),
    ...recentWards,
    ...jobs.map((j) => j.ward).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));

  if (view === "portfolio") {
    return <PortfolioSetup initialRole={profile?.role} onComplete={completePortfolio} />;
  }

  if (view === "intro") {
    return <IntroScreen onComplete={() => setView("wardsIntro")} />;
  }

  if (view === "wardsIntro") {
    return (
      <WardsIntroScreen
        wardLayouts={wardLayouts}
        onAddWard={(ward) => openWardSetup(ward, "wardsIntro")}
        onComplete={() => setView("shift")}
      />
    );
  }

  if (view === "shift") {
    return <ShiftPicker onComplete={completeShift} />;
  }

  if (view === "review" && incomingJobs) {
    return <ReviewMerge incomingJobs={incomingJobs} onMerge={mergeIncoming} onDiscard={discardIncoming} />;
  }

  if (view === "handover") {
    return <HandoverScreen jobs={jobs} onBack={() => setView("list")} onFinish={finishHandover} />;
  }

  if (view === "scan") {
    return (
      <ScanScreen
        onBack={() => setView("list")}
        onScanned={(scannedJobs) => { setIncomingJobs(scannedJobs); setView("review"); }}
      />
    );
  }

  if (view === "wards") {
    return (
      <WardManager
        wardNames={wardNames}
        wardLayouts={wardLayouts}
        onEditWard={(ward) => openWardSetup(ward, "wards")}
        onBack={() => setView("list")}
      />
    );
  }

  if (view === "wardSetup") {
    return (
      <WardSetup
        wardName={wardSetupTarget}
        existingLayout={wardLayouts[wardSetupTarget]}
        onSave={saveWardLayout}
        onCancel={() => setView(wardSetupReturn)}
      />
    );
  }

  return (
    <Home
      jobs={jobs}
      setJobs={setJobs}
      shiftType={shift?.type}
      recentWards={recentWards}
      setRecentWards={setRecentWards}
      recentBeds={recentBeds}
      setRecentBeds={setRecentBeds}
      wardLayouts={wardLayouts}
      onHandover={() => setView("handover")}
      onScan={() => setView("scan")}
      onSetupWard={(ward) => openWardSetup(ward, "list")}
      onManageWards={() => setView("wards")}
      selectedWard={selectedWard}
      setSelectedWard={setSelectedWard}
      selectedBed={selectedBed}
      setSelectedBed={setSelectedBed}
      bedSelected={bedSelected}
      setBedSelected={setBedSelected}
    />
  );
}
