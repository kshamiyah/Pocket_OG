import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import PortfolioSetup from "./components/PortfolioSetup";
import WardsIntroScreen from "./components/WardsIntroScreen";
import ShiftPicker from "./components/ShiftPicker";
import HomeHub from "./components/HomeHub";
import Home from "./components/Home";
import HandoverScreen from "./components/HandoverScreen";
import EndShiftSummary from "./components/EndShiftSummary";
import ScanScreen from "./components/ScanScreen";
import ReviewMerge from "./components/ReviewMerge";
import WardManager from "./components/WardManager";
import WardSetup from "./components/WardSetup";
import CoachMarks from "./components/CoachMarks";
import { Storage, profileIsComplete } from "./utils/storage";
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

function gateView(profile, shift) {
  if (!profileIsComplete(profile)) return profile ? "setup" : "welcome";
  if (!shift) return "hub";
  return "list";
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
  const [coachPending, setCoachPending] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedSelected, setBedSelected] = useState(false);
  const [handoverReturn, setHandoverReturn] = useState("list");
  const [scanReturn, setScanReturn] = useState("hub");
  const [wardsReturn, setWardsReturn] = useState("hub");
  const [profileReturn, setProfileReturn] = useState("hub");
  const [view, setView] = useState(() =>
    incomingFromUrl() ? "review" : gateView(Storage.getProfile(), Storage.getShift())
  );

  const setJobs = (next) => { setJobsState(next); Storage.setJobs(next); };
  const setRecentWards = (next) => { setRecentWardsState(next); Storage.setRecentWards(next); };
  const setRecentBeds = (next) => { setRecentBedsState(next); Storage.setRecentBeds(next); };
  const setWardLayouts = (next) => { setWardLayoutsState(next); Storage.setWardLayouts(next); };

  const startCoachIfNeeded = () => {
    if (!Storage.getCoachDone()) setCoachPending(true);
  };

  const saveProfile = (nextProfile) => {
    Storage.setProfile(nextProfile);
    setProfileState(nextProfile);
  };

  const completeShift = ({ shiftType }) => {
    const nextShift = { type: shiftType, startedAt: new Date().toISOString() };
    Storage.setShift(nextShift);
    setShiftState(nextShift);
    if (Object.keys(wardLayouts).length === 0) {
      setView("wardsIntro");
    } else {
      setView("list");
      startCoachIfNeeded();
    }
  };

  const finishHandover = ({ clear, handedOverIds = [] }) => {
    if (clear && handedOverIds.length > 0) {
      const remove = new Set(handedOverIds);
      setJobs(jobs.filter((j) => !remove.has(j.id)));
    } else if (clear) {
      setJobs([]);
    }
    Storage.clearShift();
    setShiftState(null);
    setView("hub");
  };

  const confirmEndShift = () => {
    setJobs([]);
    Storage.clearShift();
    setShiftState(null);
    setView("hub");
  };

  const openHandover = (returnTo = "list") => {
    setHandoverReturn(returnTo);
    setView("handover");
  };

  const openScan = (returnTo = "hub") => {
    setScanReturn(returnTo);
    setView("scan");
  };

  const openWards = (returnTo = "hub") => {
    setWardsReturn(returnTo);
    setView("wards");
  };

  const openProfileEdit = (returnTo = "hub") => {
    setProfileReturn(returnTo);
    setView("profileEdit");
  };

  const mergeIncoming = (chosen) => {
    let running = [...jobs];
    let id = nextId(running);
    const withIds = chosen.map((j) => ({ ...j, id: id++ }));
    running = [...running, ...withIds];
    setJobs(running);
    setIncomingJobs(null);
    setView(gateView(profile, shift));
  };

  const discardIncoming = () => {
    setIncomingJobs(null);
    setView(gateView(profile, shift));
  };

  const openWardSetup = (wardName, returnTo = "list") => {
    setWardSetupTarget(wardName);
    setWardSetupReturn(returnTo);
    setView("wardSetup");
  };

  const saveWardLayout = (layout) => {
    const ward = wardSetupTarget;
    setWardLayouts({ ...wardLayouts, [ward]: layout });
    if (!layout.sections?.length && recentBeds[ward]) {
      const next = { ...recentBeds };
      delete next[ward];
      setRecentBeds(next);
    }
    setView(wardSetupReturn);
  };

  const wardNames = [...new Set([
    ...Object.keys(wardLayouts),
    ...recentWards,
    ...jobs.map((j) => j.ward).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));

  if (view === "welcome") {
    return <WelcomeScreen onComplete={() => setView("setup")} />;
  }

  if (view === "setup" || view === "profileEdit") {
    return (
      <PortfolioSetup
        initialProfile={profile}
        editMode={view === "profileEdit"}
        onComplete={(next) => {
          saveProfile(next);
          setView(view === "profileEdit" ? profileReturn : "hub");
        }}
        onCancel={view === "profileEdit" ? () => setView(profileReturn) : undefined}
      />
    );
  }

  if (view === "wardsIntro") {
    return (
      <WardsIntroScreen
        wardLayouts={wardLayouts}
        onAddWard={(ward) => openWardSetup(ward, "wardsIntro")}
        onComplete={() => {
          setView("list");
          startCoachIfNeeded();
        }}
      />
    );
  }

  if (view === "hub") {
    return (
      <HomeHub
        profile={profile}
        onTakeover={() => openScan("hub")}
        onStartShift={() => setView("shift")}
        onManageWards={() => openWards("hub")}
        onEditProfile={() => openProfileEdit("hub")}
      />
    );
  }

  if (view === "shift") {
    return <ShiftPicker profile={profile} onComplete={completeShift} onBack={() => setView("hub")} />;
  }

  if (view === "review" && incomingJobs) {
    return <ReviewMerge incomingJobs={incomingJobs} onMerge={mergeIncoming} onDiscard={discardIncoming} />;
  }

  if (view === "endShift") {
    return (
      <EndShiftSummary
        jobs={jobs}
        shiftType={shift?.type}
        onBack={() => setView("list")}
        onHandover={() => openHandover("endShift")}
        onConfirmEnd={confirmEndShift}
      />
    );
  }

  if (view === "handover") {
    return <HandoverScreen jobs={jobs} onBack={() => setView(handoverReturn)} onFinish={finishHandover} />;
  }

  if (view === "scan") {
    return (
      <ScanScreen
        onBack={() => setView(scanReturn)}
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
        onBack={() => setView(wardsReturn)}
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
    <>
      <Home
        jobs={jobs}
        setJobs={setJobs}
        shiftType={shift?.type}
        recentWards={recentWards}
        setRecentWards={setRecentWards}
        recentBeds={recentBeds}
        setRecentBeds={setRecentBeds}
        wardLayouts={wardLayouts}
        onHandover={() => openHandover("list")}
        onScan={() => openScan("list")}
        onSetupWard={(ward) => openWardSetup(ward, "list")}
        onManageWards={() => openWards("list")}
        onEditProfile={() => openProfileEdit("list")}
        onEndShift={() => setView("endShift")}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
        selectedBed={selectedBed}
        setSelectedBed={setSelectedBed}
        bedSelected={bedSelected}
        setBedSelected={setBedSelected}
      />
      {coachPending && (
        <CoachMarks
          onComplete={() => {
            Storage.setCoachDone(true);
            setCoachPending(false);
          }}
        />
      )}
    </>
  );
}
