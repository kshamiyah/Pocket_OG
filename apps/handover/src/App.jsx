import { useCallback, useState } from "react";
import Onboarding from "./components/Onboarding";
import PortfolioScreen from "./components/PortfolioScreen";
import JobList from "./components/JobList";
import HandoverScreen from "./components/HandoverScreen";
import ScanScreen from "./components/ScanScreen";
import ReviewMerge from "./components/ReviewMerge";
import {
  getActivePortfolio,
  activatePortfolio,
  persistActivePortfolio,
  listPortfolios,
} from "./utils/portfolios";
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

function initialView(incoming, portfolio) {
  if (incoming) return "review";
  if (!portfolio) return listPortfolios().length > 0 ? "portfolios" : "portfolios-create";
  if (!portfolio.shift) return "onboarding";
  return "list";
}

export default function App() {
  const [portfolio, setPortfolioState] = useState(getActivePortfolio);
  const [jobs, setJobsState] = useState(() => getActivePortfolio()?.jobs ?? []);
  const [recentWards, setRecentWardsState] = useState(() => getActivePortfolio()?.recentWards ?? []);
  const [recentPhrases, setRecentPhrasesState] = useState(() => getActivePortfolio()?.recentPhrases ?? []);
  const [wardTasks, setWardTasksState] = useState(() => getActivePortfolio()?.wardTasks ?? {});
  const [wardLayouts, setWardLayoutsState] = useState(() => getActivePortfolio()?.wardLayouts ?? {});
  const [recentBeds, setRecentBedsState] = useState(() => getActivePortfolio()?.recentBeds ?? {});
  const [captureMode, setCaptureModeState] = useState(() => getActivePortfolio()?.captureMode ?? "round");
  const [incomingJobs, setIncomingJobs] = useState(incomingFromUrl);
  const [view, setView] = useState(() => initialView(incomingFromUrl(), getActivePortfolio()));

  const loadPortfolio = useCallback((next) => {
    activatePortfolio(next.id);
    setPortfolioState(next);
    setJobsState(next.jobs ?? []);
    setRecentWardsState(next.recentWards ?? []);
    setRecentPhrasesState(next.recentPhrases ?? []);
    setWardTasksState(next.wardTasks ?? {});
    setWardLayoutsState(next.wardLayouts ?? {});
    setRecentBedsState(next.recentBeds ?? {});
    setCaptureModeState(next.captureMode ?? "round");
    return next;
  }, []);

  const setJobs = (next) => {
    setJobsState(next);
    persistActivePortfolio({ jobs: next });
  };

  const setRecentWards = (next) => {
    setRecentWardsState(next);
    persistActivePortfolio({ recentWards: next });
  };

  const setRecentPhrases = (next) => {
    setRecentPhrasesState(next);
    persistActivePortfolio({ recentPhrases: next });
  };

  const setWardTasks = (next) => {
    setWardTasksState(next);
    persistActivePortfolio({ wardTasks: next });
  };

  const setWardLayouts = (next) => {
    setWardLayoutsState(next);
    persistActivePortfolio({ wardLayouts: next });
  };

  const setRecentBeds = (next) => {
    setRecentBedsState(next);
    persistActivePortfolio({ recentBeds: next });
  };

  const setCaptureMode = (next) => {
    setCaptureModeState(next);
    persistActivePortfolio({ captureMode: next });
  };

  const selectPortfolio = (next) => {
    const loaded = loadPortfolio(next);
    setView(loaded.shift ? "list" : "onboarding");
  };

  const completeOnboarding = ({ shiftType }) => {
    const shift = { type: shiftType, startedAt: new Date().toISOString() };
    const updated = persistActivePortfolio({ shift });
    if (updated) setPortfolioState(updated);
    setView("list");
  };

  const endShift = () => {
    const updated = persistActivePortfolio({ shift: null });
    if (updated) setPortfolioState(updated);
    setView("onboarding");
  };

  const finishHandover = ({ clear }) => {
    if (clear) setJobs([]);
    setView("list");
  };

  const afterIncoming = () => {
    const active = getActivePortfolio();
    if (active?.shift) return "list";
    if (active) return "onboarding";
    return listPortfolios().length > 0 ? "portfolios" : "portfolios-create";
  };

  const mergeIncoming = (chosen) => {
    let running = [...jobs];
    let id = nextId(running);
    const withIds = chosen.map((j) => ({ ...j, id: id++ }));
    running = [...running, ...withIds];
    setJobs(running);
    setIncomingJobs(null);
    setView(afterIncoming());
  };

  const discardIncoming = () => {
    setIncomingJobs(null);
    setView(afterIncoming());
  };

  if (view === "portfolios" || view === "portfolios-create") {
    return (
      <PortfolioScreen
        mode={view === "portfolios-create" ? "create" : "pick"}
        activeId={portfolio?.id}
        onSelect={selectPortfolio}
        onBack={portfolio && view === "portfolios" ? () => setView(portfolio.shift ? "list" : "onboarding") : undefined}
      />
    );
  }

  if (view === "onboarding" && portfolio) {
    return (
      <Onboarding
        portfolio={portfolio}
        onComplete={completeOnboarding}
        onSwitchPortfolio={() => setView("portfolios")}
      />
    );
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

  if (!portfolio) {
    return (
      <PortfolioScreen
        mode="create"
        activeId={null}
        onSelect={selectPortfolio}
      />
    );
  }

  return (
    <JobList
      portfolio={portfolio}
      jobs={jobs}
      setJobs={setJobs}
      recentWards={recentWards}
      setRecentWards={setRecentWards}
      recentPhrases={recentPhrases}
      setRecentPhrases={setRecentPhrases}
      wardTasks={wardTasks}
      setWardTasks={setWardTasks}
      wardLayouts={wardLayouts}
      setWardLayouts={setWardLayouts}
      recentBeds={recentBeds}
      setRecentBeds={setRecentBeds}
      captureMode={captureMode}
      setCaptureMode={setCaptureMode}
      onHandover={() => setView("handover")}
      onScan={() => setView("scan")}
      onPortfolios={() => setView("portfolios")}
      onEndShift={endShift}
    />
  );
}
