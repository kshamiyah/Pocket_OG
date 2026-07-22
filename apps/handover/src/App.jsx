import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import WelcomeScreen from "./components/WelcomeScreen";
import DisclaimerScreen from "./components/DisclaimerScreen";
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
import AboutScreen from "./components/AboutScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import CoachMarks from "./components/CoachMarks";
import FeedbackToast from "./components/FeedbackToast";
import ViewTransition from "./components/ViewTransition";
import { Storage, profileIsComplete } from "./utils/storage";
import { nextId } from "./utils/jobs";
import { parseIncomingHandover } from "./utils/payload";
import { syncJobReminders } from "./utils/jobNotifications";
import { deleteLayout } from "./utils/wardLayouts";
import { applyBedRemaps, applyLayoutImportPlan } from "./utils/layoutWire";

function readIncomingFromUrl() {
  const payload = parseIncomingHandover(window.location.href);
  if (!payload) return null;
  window.history.replaceState(null, "", window.location.pathname);
  return payload;
}

const INITIAL_INCOMING = readIncomingFromUrl();

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
  const [recentPhrases, setRecentPhrasesState] = useState(Storage.getRecentPhrases);
  const [wardLayouts, setWardLayoutsState] = useState(Storage.getWardLayouts);
  const [bedNotes, setBedNotesState] = useState(Storage.getBedNotes);
  const [incomingPayload, setIncomingPayload] = useState(INITIAL_INCOMING);
  const [wardSetupTarget, setWardSetupTarget] = useState(null);
  const [wardSetupReturn, setWardSetupReturn] = useState("list");
  const [coachPending, setCoachPending] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedSelected, setBedSelected] = useState(false);
  const [handoverReturn, setHandoverReturn] = useState("list");
  const [handoverMode, setHandoverMode] = useState("share");
  const [endShiftContext, setEndShiftContext] = useState(null);
  const [scanReturn, setScanReturn] = useState("hub");
  const [wardsReturn, setWardsReturn] = useState("hub");
  const [profileReturn, setProfileReturn] = useState("hub");
  const [aboutReturn, setAboutReturn] = useState("hub");
  const [view, setView] = useState(() =>
    INITIAL_INCOMING ? "review" : gateView(Storage.getProfile(), Storage.getShift())
  );
  const [navDirection, setNavDirection] = useState("forward");
  const [toast, setToast] = useState(null);
  const [toastElevated, setToastElevated] = useState(false);
  const toastTimer = useRef(null);

  const flashToast = (message, { elevated = false, duration = 2600 } = {}) => {
    if (!message) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastElevated(elevated);
    setToast(message);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      setToastElevated(false);
    }, duration);
  };

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
    setToastElevated(false);
  }, []);

  // Dismiss confirmation toast on the next tap after a short grace period, so in-list
  // navigation (ward drill, sheets) clears it even when App view stays on "list".
  useEffect(() => {
    if (!toast) return undefined;
    let armed = false;
    const armId = window.setTimeout(() => { armed = true; }, 400);
    const onInteract = () => {
      if (!armed) return;
      dismissToast();
    };
    document.addEventListener("pointerdown", onInteract, { capture: true });
    return () => {
      window.clearTimeout(armId);
      document.removeEventListener("pointerdown", onInteract, { capture: true });
    };
  }, [toast, dismissToast]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const navigate = useCallback((next, direction = "forward") => {
    dismissToast();
    setNavDirection(direction);
    setView(next);
  }, [dismissToast]);

  const setJobs = (next) => { setJobsState(next); Storage.setJobs(next); };
  const setRecentWards = (next) => { setRecentWardsState(next); Storage.setRecentWards(next); };
  const setRecentBeds = (next) => { setRecentBedsState(next); Storage.setRecentBeds(next); };
  const setRecentPhrases = (next) => { setRecentPhrasesState(next); Storage.setRecentPhrases(next); };
  const setWardLayouts = (next) => { setWardLayoutsState(next); Storage.setWardLayouts(next); };
  const setBedNotes = (next) => { setBedNotesState(next); Storage.setBedNotes(next); };

  useEffect(() => {
    syncJobReminders(jobs);
  }, [jobs]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    const openIncoming = (url) => {
      const payload = parseIncomingHandover(url);
      if (!payload) return;
      setIncomingPayload(payload);
      setNavDirection("forward");
      setView("review");
    };

    CapApp.getLaunchUrl().then((result) => {
      if (result?.url) openIncoming(result.url);
    });

    let removeListener;
    CapApp.addListener("appUrlOpen", (event) => {
      openIncoming(event.url);
    }).then((handle) => {
      removeListener = () => handle.remove();
    });

    return () => removeListener?.();
  }, []);

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
      navigate("wardsIntro");
    } else {
      navigate("list");
      startCoachIfNeeded();
    }
  };

  const applyShareJobs = ({ handedOverIds = [], removeFromPhone = false }) => {
    if (removeFromPhone && handedOverIds.length > 0) {
      const remove = new Set(handedOverIds);
      setJobs(jobs.filter((j) => !remove.has(j.id)));
    }
  };

  const finishShareJobs = ({ handedOverIds = [], removeFromPhone = false }) => {
    const count = handedOverIds.length;
    applyShareJobs({ handedOverIds, removeFromPhone });
    navigate("list", "back");
    if (count > 0) {
      flashToast(`Shared ${count} job${count === 1 ? "" : "s"}`);
    }
  };

  const bridgeShareToEndShift = ({ handedOverIds = [], removeFromPhone = false }) => {
    setEndShiftContext({ jobs, handedOverIds });
    applyShareJobs({ handedOverIds, removeFromPhone });
    navigate("endShift");
  };

  const finishEndShiftHandover = ({ handedOverIds = [] }) => {
    const handedCount = handedOverIds.length;
    setEndShiftContext(null);
    setJobs([]);
    setBedNotes({});
    Storage.clearShift();
    setShiftState(null);
    navigate("hub", "back");
    flashToast(
      handedCount > 0
        ? `Handover sent · ${handedCount} job${handedCount === 1 ? "" : "s"}`
        : "Shift ended",
    );
  };

  const confirmEndShift = () => {
    setEndShiftContext(null);
    setJobs([]);
    setBedNotes({});
    Storage.clearShift();
    setShiftState(null);
    navigate("hub", "back");
    flashToast("Shift ended");
  };

  const openShareJobs = () => {
    setHandoverMode("share");
    setHandoverReturn("list");
    navigate("handover");
  };

  const openHandoverForEndShift = () => {
    setHandoverMode("endShift");
    setHandoverReturn("endShift");
    navigate("handover");
  };

  const openEndShift = () => {
    setEndShiftContext(null);
    navigate("endShift");
  };

  const openScan = (returnTo = "hub") => {
    setScanReturn(returnTo);
    navigate("scan");
  };

  const openWards = (returnTo = "hub") => {
    setWardsReturn(returnTo);
    navigate("wards");
  };

  const openProfileEdit = (returnTo = "hub") => {
    setProfileReturn(returnTo);
    navigate("profileEdit");
  };

  const openAbout = (returnTo = "hub") => {
    setAboutReturn(returnTo);
    navigate("about");
  };

  const viewAfterReview = () => {
    if (scanReturn === "wards" || scanReturn === "wardsIntro") return scanReturn;
    return gateView(profile, shift);
  };

  const mergeIncoming = ({ jobs: chosen, layoutImport, bedRemaps }) => {
    const remapped = applyBedRemaps(chosen, bedRemaps);
    let running = [...jobs];
    let id = nextId(running);
    const withIds = remapped.map((j) => ({ ...j, id: id++ }));
    running = [...running, ...withIds];
    setJobs(running);

    const layoutCount = Object.values(layoutImport || {}).filter((s) => s.mode !== "skip").length;
    if (layoutCount > 0) {
      setWardLayouts(applyLayoutImportPlan(wardLayouts, layoutImport));
    }

    setIncomingPayload(null);
    const nextView = viewAfterReview();
    navigate(nextView);

    const parts = [];
    if (remapped.length > 0) {
      parts.push(`${remapped.length} job${remapped.length === 1 ? "" : "s"}`);
    }
    if (layoutCount > 0) {
      parts.push(`${layoutCount} ward layout${layoutCount === 1 ? "" : "s"}`);
    }
    if (parts.length > 0) {
      flashToast(`Added ${parts.join(" and ")}`, { elevated: nextView === "list" });
    }
  };

  const discardIncoming = () => {
    setIncomingPayload(null);
    navigate(viewAfterReview(), "back");
  };

  const openWardSetup = (wardName, returnTo = "list") => {
    setWardSetupTarget(wardName);
    setWardSetupReturn(returnTo);
    navigate("wardSetup", "up");
  };

  const saveWardLayout = (layout) => {
    const ward = wardSetupTarget;
    setWardLayouts({ ...wardLayouts, [ward]: layout });
    if (!layout.sections?.length && recentBeds[ward]) {
      const next = { ...recentBeds };
      delete next[ward];
      setRecentBeds(next);
    }
    navigate(wardSetupReturn, "fade");
  };

  const deleteWard = (wardName) => {
    const key = (wardName || "").trim();
    if (!key) return;

    setWardLayouts((layouts) => deleteLayout(layouts, key));
    setRecentWards((wards) => wards.filter((w) => w !== key));

    setRecentBeds((beds) => {
      if (!beds[key]) return beds;
      const next = { ...beds };
      delete next[key];
      return next;
    });

    setBedNotes((notes) => {
      const prefix = `${key}|`;
      const noteKeys = Object.keys(notes).filter((k) => k.startsWith(prefix));
      if (noteKeys.length === 0) return notes;
      const next = { ...notes };
      for (const k of noteKeys) delete next[k];
      return next;
    });

    setJobs((list) => {
      if (!list.some((j) => j.ward === key)) return list;
      return list.map((j) => (j.ward === key ? { ...j, ward: "", bed: "" } : j));
    });

    if (selectedWard === key) {
      setSelectedWard(null);
      setSelectedBed(null);
      setBedSelected(false);
    }
    if (wardSetupTarget === key) setWardSetupTarget(null);
  };

  const wardNames = [...new Set([
    ...Object.keys(wardLayouts),
    ...recentWards,
    ...jobs.map((j) => j.ward).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b));

  const renderScreen = () => {
    if (view === "welcome") {
      return (
        <WelcomeScreen
          onComplete={() => navigate(Storage.getDisclaimerDone() ? "setup" : "disclaimer")}
        />
      );
    }

    if (view === "disclaimer") {
      return (
        <DisclaimerScreen
          onComplete={() => {
            Storage.setDisclaimerDone(true);
            navigate("setup");
          }}
        />
      );
    }

    if (view === "setup" || view === "profileEdit") {
      return (
        <PortfolioSetup
          initialProfile={profile}
          editMode={view === "profileEdit"}
          onComplete={(next) => {
            saveProfile(next);
            navigate(view === "profileEdit" ? profileReturn : "hub");
          }}
          onCancel={view === "profileEdit" ? () => navigate(profileReturn, "back") : undefined}
        />
      );
    }

    if (view === "wardsIntro") {
      return (
        <WardsIntroScreen
          wardLayouts={wardLayouts}
          onAddWard={(ward) => openWardSetup(ward, "wardsIntro")}
          onScanSetup={() => openScan("wardsIntro")}
          onComplete={() => {
            navigate("list");
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
          onStartShift={() => navigate("shift")}
          onManageWards={() => openWards("hub")}
          onEditProfile={() => openProfileEdit("hub")}
          onAbout={() => openAbout("hub")}
        />
      );
    }

    if (view === "about") {
      return (
        <AboutScreen
          onBack={() => navigate(aboutReturn, "back")}
          onOpenPrivacy={() => navigate("privacy")}
        />
      );
    }

    if (view === "privacy") {
      return <PrivacyPolicyScreen onBack={() => navigate("about", "back")} />;
    }

    if (view === "shift") {
      return (
        <ShiftPicker
          profile={profile}
          onComplete={completeShift}
          onBack={() => navigate("hub", "back")}
        />
      );
    }

    if (view === "review" && incomingPayload) {
      return (
        <ReviewMerge
          incomingJobs={incomingPayload.jobs}
          incomingLayouts={incomingPayload.layouts}
          wardLayouts={wardLayouts}
          onMerge={mergeIncoming}
          onDiscard={discardIncoming}
        />
      );
    }

    if (view === "endShift") {
      return (
        <EndShiftSummary
          jobs={endShiftContext?.jobs ?? jobs}
          handedOverIds={endShiftContext?.handedOverIds ?? []}
          shiftType={shift?.type}
          onBack={() => {
            setEndShiftContext(null);
            navigate("list", "back");
          }}
          onHandover={openHandoverForEndShift}
          onConfirmEnd={confirmEndShift}
        />
      );
    }

    if (view === "handover") {
      return (
        <HandoverScreen
          jobs={jobs}
          wardLayouts={wardLayouts}
          onBack={() => navigate(handoverReturn, "back")}
          onFinish={handoverMode === "endShift" ? finishEndShiftHandover : finishShareJobs}
          onBridgeToEndShift={bridgeShareToEndShift}
          mode={handoverMode}
        />
      );
    }

    if (view === "scan") {
      return (
        <ScanScreen
          onBack={() => navigate(scanReturn, "back")}
          onScanned={(payload) => {
            setIncomingPayload(payload);
            navigate("review");
          }}
        />
      );
    }

    if (view === "wards") {
      return (
        <WardManager
          wardNames={wardNames}
          wardLayouts={wardLayouts}
          jobs={jobs}
          onEditWard={(ward) => openWardSetup(ward, "wards")}
          onDeleteWard={deleteWard}
          onScanSetup={() => openScan("wards")}
          onBack={() => navigate(wardsReturn, "back")}
        />
      );
    }

    if (view === "wardSetup") {
      return (
        <WardSetup
          wardName={wardSetupTarget}
          existingLayout={wardLayouts[wardSetupTarget]}
          onSave={saveWardLayout}
          onCancel={() => navigate(wardSetupReturn, "fade")}
        />
      );
    }

    return (
      <>
        <Home
          jobs={jobs}
          setJobs={setJobs}
          shiftType={shift?.type}
          shiftStartedAt={shift?.startedAt}
          recentWards={recentWards}
          setRecentWards={setRecentWards}
          recentBeds={recentBeds}
          setRecentBeds={setRecentBeds}
          recentPhrases={recentPhrases}
          setRecentPhrases={setRecentPhrases}
          wardLayouts={wardLayouts}
          bedNotes={bedNotes}
          setBedNotes={setBedNotes}
          onScan={() => openScan("list")}
          onShareJobs={openShareJobs}
          onEndShift={openEndShift}
          onSetupWard={(ward) => openWardSetup(ward, "list")}
          onManageWards={() => openWards("list")}
          onEditProfile={() => openProfileEdit("list")}
          onAbout={() => openAbout("list")}
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
  };

  return (
    <>
      <ViewTransition viewKey={view} direction={navDirection}>
        {renderScreen()}
      </ViewTransition>
      <FeedbackToast message={toast} elevated={toastElevated} />
    </>
  );
}
