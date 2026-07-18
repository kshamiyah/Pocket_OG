import { useState } from "react";
import { SCREENING, CHECKS, screeningAroundWeek } from "../content/care";
import { PHYS_SYSTEMS } from "../content/physiology";
import { ProvenanceFooter } from "./provenance";

export default function MyCare({ week, onOpenBody }) {
  const [open, setOpen] = useState(null);
  const nowIds = screeningAroundWeek(week);

  return (
    <div className="care">
      <p className="care-kicker">Your care</p>
      <h1 className="care-h">Your antenatal care, explained</h1>
      <p className="care-intro">What each appointment, scan and test is actually for, and why it happens when it does.</p>

      <div className="care-choice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a7 7 0 0 0-4 12.7V18h8v-2.3A7 7 0 0 0 12 3Z" /><path d="M9.5 21h5" strokeLinecap="round" /></svg>
        <p><b>It's your choice.</b> All NHS screening is free, and you can have all of it, some, or none. Screening tells you the <b>chance</b> of a condition, not a yes or no, and you can change your mind.</p>
      </div>

      <div className="care-sect">
        <div className="phys-h"><span>Screening you'll be offered</span><span className="phys-rule" /></div>
        <div className="care-list">
          {SCREENING.map(s => {
            const isOpen = open === s.id;
            const isNow = nowIds.includes(s.id);
            return (
              <div key={s.id} className="care-item" aria-expanded={isOpen}>
                <button type="button" onClick={() => setOpen(isOpen ? null : s.id)}>
                  <span className="care-when">{s.when}{isNow && <span className="care-nowtag">around now</span>}</span>
                  <span className="care-title">{s.title}</span>
                  <svg className="care-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="care-detail">
                  <p><b>What it is.</b> {s.what}</p>
                  <p><b>Why.</b> {s.why}</p>
                  {s.more && s.more.map((m, i) => <p key={i}><b>{m.h}.</b> {m.body}</p>)}
                  {s.conditions && (
                    <div className="care-conditions">
                      <p className="care-cond-h">The 11 conditions it checks for</p>
                      <ul>{s.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul>
                    </div>
                  )}
                  {s.support && <p className="care-support">{s.support}</p>}
                  {s.choice && <p className="care-optional">A screening choice, entirely up to you.</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="care-sect">
        <div className="phys-h"><span>Your regular checks</span><span className="phys-rule" /></div>
        <div className="care-checks">
          {CHECKS.map(c => (
            <button key={c.id} className="care-check" onClick={() => onOpenBody(c.system)}>
              <div className="care-check-top">
                <h3>{c.title}</h3>
                <span className="care-check-link">{PHYS_SYSTEMS[c.system].label} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </div>
              <p className="care-check-what">{c.what}</p>
              <p className="care-check-why">{c.why}</p>
            </button>
          ))}
        </div>
      </div>

      <ProvenanceFooter codes={["QS22"]} extra={["NHS: Screening tests in pregnancy (nhs.uk, reviewed March 2026)"]} />
    </div>
  );
}
