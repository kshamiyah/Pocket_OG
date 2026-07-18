import { useState } from "react";
import { eddFromWeek, formatEdd } from "../lib/pregnancy";

export default function Onboarding({ onDone }) {
  const [mode, setMode] = useState("date");
  const [dateVal, setDateVal] = useState("");
  const [weekVal, setWeekVal] = useState(12);

  const canStart = mode === "date" ? !!dateVal : true;
  const start = () => {
    if (mode === "date" && dateVal) onDone(dateVal);
    else if (mode === "week") onDone(eddFromWeek(weekVal));
  };

  return (
    <div className="ob">
      <div className="ob-inner">
        <div className="ob-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2.1 0 3.4 1.2 4 2.3.6-1.1 1.9-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" /></svg>
        </div>
        <h1 className="ob-h">Understand your pregnancy, week by week.</h1>
        <p className="ob-p">Plain-English answers about what's happening to you and your baby, and why, from the same guidance your midwife uses. Let's start with where you are.</p>

        {mode === "date" ? (
          <div className="ob-field">
            <label htmlFor="edd">When is your baby due?</label>
            <input id="edd" type="date" value={dateVal} onChange={e => setDateVal(e.target.value)} />
            <button className="ob-alt" type="button" onClick={() => setMode("week")}>I'm not sure of my due date</button>
          </div>
        ) : (
          <div className="ob-field">
            <label htmlFor="wk">How many weeks are you?</label>
            <div className="ob-weeknum">{weekVal} weeks</div>
            <input id="wk" className="phys-range" type="range" min="4" max="42" step="1" value={weekVal}
              style={{ "--fill": ((weekVal - 4) / 38 * 100) + "%" }} onChange={e => setWeekVal(+e.target.value)} />
            <p className="ob-eddhint">That puts your due date around <b>{formatEdd(eddFromWeek(weekVal))}</b>.</p>
            <button className="ob-alt" type="button" onClick={() => setMode("date")}>I know my due date</button>
          </div>
        )}

        <button className="ob-start" type="button" disabled={!canStart} onClick={start}>Start</button>
        <p className="ob-note">A concept and a decision aid, not medical advice. You can change your week any time. Nothing is shared, and no account is needed.</p>
      </div>
    </div>
  );
}
