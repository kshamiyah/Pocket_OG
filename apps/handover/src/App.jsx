import { useState } from "react";
import Onboarding from "./components/Onboarding";
import JobList from "./components/JobList";
import HandoverScreen from "./components/HandoverScreen";
import ScanScreen from "./components/ScanScreen";
import ReviewMerge from "./components/ReviewMerge";
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
  const [incomingJobs, setIncomingJobs] = useState(incomingFromUrl);
  const [view, setView] = useState(() => (incomingJobs ? "review" : shift ? "list" : "onboarding"));

  const setJobs = (next) => { setJobsState(next); Storage.setJobs(next); };
  const setRecentWards = (next) => { setRecentWardsState(next); Storage.setRecentWards(next); };

  const completeOnboarding = ({ role, shiftType }) => {
    const nextProfile = { role };
    const nextShift = { type: shiftType, startedAt: new Date().toISOString() };
    Storage.setProfile(nextProfile);
    Storage.setShift(nextShift);
    setProfileState(nextProfile);
    setShiftState(nextShift);
    setView("list");
  };

  const finishHandover = ({ clear }) => {
    if (clear) setJobs([]);
    setView("list");
  };

  const mergeIncoming = (chosen) => {
    let running = [...jobs];
    let id = nextId(running);
    const withIds = chosen.map((j) => ({ ...j, id: id++ }));
    running = [...running, ...withIds];
    setJobs(running);
    setIncomingJobs(null);
    setView(shift ? "list" : "onboarding");
  };

  const discardIncoming = () => {
    setIncomingJobs(null);
    setView(shift ? "list" : "onboarding");
  };

  if (view === "onboarding") {
    return <Onboarding knownRole={profile?.role} onComplete={completeOnboarding} />;
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

  return (
    <JobList
      jobs={jobs}
      setJobs={setJobs}
      shiftType={shift?.type}
      recentWards={recentWards}
      setRecentWards={setRecentWards}
      onHandover={() => setView("handover")}
      onScan={() => setView("scan")}
    />
  );
}
