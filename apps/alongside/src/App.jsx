import { useState } from "react";
import { TOPICS, getTopic } from "./content/topics";
import TopicPage from "./components/TopicPage";
import PhysiologyExperience from "./components/PhysiologyExperience";
import { useTheme } from "./theme";

const AREA_STYLE = {
  Gynae: "text-accent bg-accentsoft",
  Pregnancy: "text-calm bg-calmbg",
};

function Header({ dark, toggle }) {
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between px-5 pt-5">
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-semibold tracking-tight text-ink">Alongside</span>
        <span className="text-[11px] text-inkfaint">concept · by Pocket O&amp;G</span>
      </div>
      <button
        onClick={toggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-inksoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {dark ? (
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" strokeLinecap="round" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" strokeLinejoin="round" /></svg>
        )}
      </button>
    </header>
  );
}

function Home({ onOpen }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-16">
      <div className="pt-6">
        <h1 className="text-balance font-serif text-[32px] font-semibold leading-tight text-ink">
          Know what's normal, and the care you can expect.
        </h1>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-inksoft">
          Plain-English women's health, drawn from the same national guidance your clinicians use. Understand what's happening, learn the signs that need attention, and walk into appointments ready to be heard.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => onOpen(t.id)}
            className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left transition-transform hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${AREA_STYLE[t.area] ?? "text-inksoft bg-surface2"}`}>{t.area}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-inkfaint">{t.mode}</span>
              </div>
              <h2 className="font-serif text-lg font-semibold text-ink">{t.title}</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-inksoft">{t.blurb}</p>
            </div>
            <span className="flex-none text-inkfaint transition-colors group-hover:text-accent">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-surface2 p-4">
        <svg className="mt-0.5 h-5 w-5 flex-none text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" strokeLinecap="round" /></svg>
        <p className="text-[12.5px] leading-snug text-inksoft">
          <span className="font-semibold text-ink">A concept, and a decision aid, not medical advice.</span> If you are worried about your health or your baby, contact your midwife, GP, maternity unit or NHS 111. In an emergency, call 999.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { dark, toggle } = useTheme();
  const [openId, setOpenId] = useState(null);
  const topic = openId ? getTopic(openId) : null;

  return (
    <div className="min-h-full bg-paper">
      <Header dark={dark} toggle={toggle} />
      {openId === "pregnancy-physiology"
        ? <PhysiologyExperience dark={dark} onExit={() => setOpenId(null)} />
        : topic
          ? <TopicPage topic={topic} onBack={() => setOpenId(null)} />
          : <Home onOpen={setOpenId} />}
    </div>
  );
}
