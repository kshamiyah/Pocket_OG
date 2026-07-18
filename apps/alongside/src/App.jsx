import { useState } from "react";
import PhysiologyExperience from "./components/PhysiologyExperience";
import ThisWeek from "./components/ThisWeek";
import MyBaby from "./components/MyBaby";
import MyCare from "./components/MyCare";
import IsThisNormal from "./components/IsThisNormal";
import Onboarding from "./components/Onboarding";
import WeekSheet from "./components/WeekSheet";
import { useTheme } from "./theme";
import { usePregnancy } from "./lib/pregnancy";

const TABS = [
  { id: "week", label: "This week", icon: <path d="M4 11 12 4l8 7M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" /> },
  { id: "body", label: "My body", icon: <path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2.1 0 3.4 1.2 4 2.3.6-1.1 1.9-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" /> },
  { id: "baby", label: "My baby", icon: <><circle cx="12" cy="9" r="4" /><path d="M6 19c0-3.3 2.6-5 6-5s6 1.7 6 5" strokeLinecap="round" /></> },
  { id: "normal", label: "Is this normal?", icon: <><path d="M12 3a7 7 0 0 0-4 12.7V18h8v-2.3A7 7 0 0 0 12 3Z" /><path d="M9.5 21h5" strokeLinecap="round" /></> },
  { id: "care", label: "My care", icon: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" /></> },
];

function Header({ week, onChangeWeek, dark, toggle }) {
  return (
    <header className="app-header">
      <span className="app-brand">Alongside</span>
      <div className="app-headright">
        {week != null && (
          <button className="app-weekchip" onClick={onChangeWeek} aria-label="Change your week">
            Week {week}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <button className="app-themebtn" onClick={toggle} aria-label={dark ? "Light mode" : "Dark mode"}>
          {dark
            ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" strokeLinecap="round" /></svg>
            : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" strokeLinejoin="round" /></svg>}
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const { dark, toggle } = useTheme();
  const { ready, week, setEdd } = usePregnancy();
  const [tab, setTab] = useState("week");
  const [bodyInitial, setBodyInitial] = useState(null);
  const [bodyKey, setBodyKey] = useState(0);
  const [sheet, setSheet] = useState(false);

  if (!ready) return <Onboarding onDone={setEdd} />;

  const openBody = sys => { setBodyInitial(sys ?? null); setBodyKey(k => k + 1); setTab("body"); };

  return (
    <div className="app">
      <Header week={week} onChangeWeek={() => setSheet(true)} dark={dark} toggle={toggle} />

      <main className="app-main">
        {tab === "week" && (
          <ThisWeek week={week} onChangeWeek={() => setSheet(true)} onOpenBody={openBody} onOpenTab={setTab} />
        )}
        {tab === "body" && (
          <PhysiologyExperience key={bodyKey} dark={dark} initialSystem={bodyInitial} />
        )}
        {tab === "baby" && (
          <MyBaby week={week} />
        )}
        {tab === "care" && (
          <MyCare week={week} onOpenBody={openBody} />
        )}
        {tab === "normal" && (
          <IsThisNormal onOpenBody={openBody} />
        )}
      </main>

      <nav className="app-tabbar" role="tablist" aria-label="Main">
        {TABS.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            className="app-tab" onClick={() => (t.id === "body" ? openBody(null) : setTab(t.id))}>
            <span className="app-tab-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{t.icon}</svg></span>
            {t.label}
          </button>
        ))}
      </nav>

      {sheet && (
        <WeekSheet week={week} onClose={() => setSheet(false)}
          onApply={iso => { setEdd(iso); setSheet(false); }} />
      )}
    </div>
  );
}
