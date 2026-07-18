import { bodyFocusForWeek, careForWeek } from "../content/weeks";
import { babyForWeek } from "../content/baby";
import { PHYS_SYSTEMS } from "../content/physiology";
import { trimesterLabel } from "../lib/pregnancy";

export default function ThisWeek({ week, onChangeWeek, onOpenBody, onOpenTab }) {
  const baby = babyForWeek(week);
  const focus = bodyFocusForWeek(week);
  const focusSys = PHYS_SYSTEMS[focus.systemKey];
  const care = careForWeek(week);
  const toGo = Math.max(0, 40 - week);
  const progress = Math.min(100, Math.round((week / 40) * 100));

  return (
    <div className="tw">
      <button className="tw-weekbtn" onClick={onChangeWeek}>
        <span className="tw-weeknum">Week {week}</span>
        <span className="tw-weeksub">{trimesterLabel(week)} · {toGo === 0 ? "due now" : `${toGo} weeks to go`}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="tw-prog">
        <div className="tw-progbar"><i style={{ width: progress + "%" }} /></div>
        <div className="tw-progticks"><span>1st</span><span>2nd</span><span>3rd</span></div>
      </div>

      {/* This fortnight in you */}
      <button className="tw-card" onClick={() => onOpenBody(focus.systemKey)}>
        <p className="tw-lab">This fortnight in you</p>
        <h3>{focusSys.label}</h3>
        <p className="tw-body">{focus.hook}</p>
        <span className="tw-go">Understand why <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </button>

      {/* Your baby */}
      <button className="tw-card baby" onClick={() => onOpenTab("baby")}>
        <p className="tw-lab baby">Your baby at week {week}</p>
        <h3>About the size of {baby.size}</h3>
        <p className="tw-body">{baby.dev}</p>
        <span className="tw-go baby">More on your baby <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </button>

      {/* Worth knowing now */}
      {care && (
        <button className="tw-card" onClick={() => onOpenTab("care")}>
          <p className="tw-lab">{care.when === "now" ? "Around now" : `Coming up · week ${care.from}`}</p>
          <h3>{care.title}</h3>
          <p className="tw-body">{care.detail}</p>
          <span className="tw-go">Your care <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </button>
      )}

      {/* Explore CTA */}
      <button className="tw-explore" onClick={() => onOpenTab("body")}>
        <span>
          <b>Explore your whole body</b>
          <small>All {Object.keys(PHYS_SYSTEMS).length} systems, and the medicine behind them</small>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2.1 0 3.4 1.2 4 2.3.6-1.1 1.9-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" /></svg>
      </button>

      <div className="tw-disc">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" strokeLinecap="round" /></svg>
        <p>A decision aid, not medical advice. If you're worried about you or your baby, contact your midwife, maternity unit or NHS 111. In an emergency, call 999.</p>
      </div>
    </div>
  );
}
