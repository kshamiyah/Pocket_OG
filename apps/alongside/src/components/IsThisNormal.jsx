import { useState } from "react";
import { searchSymptoms } from "../content/symptoms";
import { PHYS_SYSTEMS } from "../content/physiology";

const DOT = { u: "norm-dot-u", s: "norm-dot-s", c: "norm-dot-c" };
const SEV = {
  u: { badge: "Get seen now", cls: "norm-sev-u" },
  s: { badge: "Worth a call", cls: "norm-sev-s" },
};

export default function IsThisNormal({ onOpenBody }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const results = searchSymptoms(query);

  return (
    <div className="norm">
      <p className="norm-kicker">Is this normal?</p>
      <h1 className="norm-h">What's going on, and how urgently to be seen</h1>

      <div className="norm-golden">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" strokeLinejoin="round" /></svg>
        <p><b>Trust your instincts.</b> If you're ever worried about you or your baby, contact your midwife or maternity unit, day or night. You know your body. In an emergency, call 999.</p>
      </div>

      <div className="norm-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a symptom, e.g. headache" aria-label="Search symptoms" />
      </div>

      <div className="norm-legend">
        <span><i className="norm-dot-u" />Always call</span>
        <span><i className="norm-dot-s" />Worth a call</span>
        <span><i className="norm-dot-c" />Usually normal</span>
      </div>

      <div className="norm-list">
        {results.length === 0 && <p className="norm-empty">Nothing matched. If you're worried, contact your midwife or maternity unit.</p>}
        {results.map(s => {
          const isOpen = open === s.id;
          const sys = s.system ? PHYS_SYSTEMS[s.system] : null;
          return (
            <div key={s.id} className="norm-item" aria-expanded={isOpen}>
              <button type="button" onClick={() => setOpen(isOpen ? null : s.id)}>
                <i className={DOT[s.top]} />
                <span className="norm-q">{s.label}</span>
                <svg className="norm-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div className="norm-detail">
                {s.normal && (
                  <div className="norm-usually">
                    <p className="norm-usually-h">Usually</p>
                    <p>{s.normal}</p>
                    {sys && (
                      <button className="norm-syslink" onClick={() => onOpenBody(s.system)}>
                        Understand why: {sys.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    )}
                  </div>
                )}
                <p className="norm-watch-h">When to get seen</p>
                <div className="norm-watch">
                  {s.watch.map(([level, text], i) => (
                    <div key={i} className={"norm-flag " + SEV[level].cls}>
                      <span className="norm-flag-badge">{SEV[level].badge}</span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="norm-disc">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" strokeLinecap="round" /></svg>
        <p>This helps you decide <b>who to call and how quickly</b>. It can't diagnose anything and never replaces your midwife, maternity unit or 111. If you're worried, that's reason enough to call.</p>
      </div>
    </div>
  );
}
