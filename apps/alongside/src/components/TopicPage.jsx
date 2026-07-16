import { useState } from "react";
import { TrustChip, ProvenanceFooter } from "./provenance";

function Block({ block }) {
  if (block.type === "text") {
    return <p className="text-[15px] leading-relaxed text-ink">{block.value}</p>;
  }
  if (block.type === "alert") {
    return (
      <div className="flex gap-3 rounded-2xl border border-urgent/30 bg-urgentbg px-4 py-3">
        <svg className="mt-0.5 h-5 w-5 flex-none text-urgent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3 2 20h20Z" strokeLinejoin="round" /><path d="M12 9v5" strokeLinecap="round" />
          <circle cx="12" cy="16.7" r=".7" fill="currentColor" stroke="none" />
        </svg>
        <p className="text-sm font-medium leading-snug text-ink">{block.value}</p>
      </div>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="space-y-2">
        {block.items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

const SEV = {
  urgent: { dot: "bg-urgent", label: "Get seen urgently", chip: "text-urgent bg-urgentbg" },
  soon: { dot: "bg-notice", label: "Worth checking soon", chip: "text-notice bg-noticebg" },
  routine: { dot: "bg-calm", label: "Routine", chip: "text-calm bg-calmbg" },
};

export default function TopicPage({ topic, onBack }) {
  const sections = [
    { id: "understand", label: "Understand" },
    { id: "care", label: topic.goodCareLabel },
    { id: "seen", label: "When to get seen" },
    { id: "ask", label: "Questions to ask" },
    { id: "words", label: "Words" },
  ];
  const [active, setActive] = useState("understand");

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16">
      <button
        onClick={onBack}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-sm font-semibold text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        All topics
      </button>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-accent">{topic.area} · {topic.mode}</p>
      <h1 className="mt-1 text-balance font-serif text-3xl font-semibold leading-tight text-ink">{topic.title}</h1>
      <p className="mt-2 max-w-prose text-[15px] text-inksoft">{topic.blurb}</p>
      <div className="mt-3"><TrustChip codes={topic.basedOn} extra={topic.extraSources ?? []} /></div>

      {/* section switcher */}
      <div className="sticky top-0 z-10 -mx-5 mt-5 overflow-x-auto border-b border-line bg-paper/90 px-5 py-2 backdrop-blur">
        <div className="flex gap-1.5">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              aria-pressed={active === s.id}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                active === s.id ? "bg-accent text-white" : "bg-surface2 text-inksoft hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {active === "understand" && (
          <div className="space-y-4">
            {topic.understand.map((b, i) => <Block key={i} block={b} />)}
          </div>
        )}

        {active === "care" && (
          <div className="space-y-3">
            {topic.goodCare.map((g, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md bg-calmbg text-calm">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <p className="text-[15px] font-medium leading-snug text-ink">{g.point}</p>
                </div>
                {g.caveat && (
                  <p className="mt-2.5 rounded-xl bg-noticebg px-3 py-2 text-[13px] leading-snug text-notice">
                    {g.caveat}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {active === "seen" && (
          <div className="space-y-2.5">
            {topic.whenSeen.map((w, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${SEV[w.level].dot}`} />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${SEV[w.level].chip}`}>{SEV[w.level].label}</span>
                </div>
                <p className="text-[14px] leading-snug text-ink">{w.text}</p>
              </div>
            ))}
          </div>
        )}

        {active === "ask" && (
          <ul className="space-y-2.5">
            {topic.questions.map((q, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className="font-serif text-2xl leading-none text-accent">“</span>
                <span className="text-[14px] leading-snug text-ink">{q}</span>
              </li>
            ))}
          </ul>
        )}

        {active === "words" && (
          <dl className="space-y-3">
            {topic.words.map((w, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="font-serif text-[16px] font-semibold text-ink">{w.term}</dt>
                <dd className="mt-1 text-[14px] leading-snug text-inksoft">{w.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <ProvenanceFooter codes={topic.basedOn} extra={topic.extraSources ?? []} />
    </div>
  );
}
