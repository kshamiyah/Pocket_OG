import { useState } from "react";
import { eddFromWeek, formatEdd } from "../lib/pregnancy";

// Small bottom sheet to change how far along she is, by week or by due date.
// `mode` tracks which control she last used, so Done applies the right one.
export default function WeekSheet({ week, onApply, onClose }) {
  const [w, setW] = useState(week);
  const [dateVal, setDateVal] = useState("");
  const [mode, setMode] = useState("week");

  const apply = () => onApply(mode === "date" && dateVal ? dateVal : eddFromWeek(w));

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="Change your week" onClick={e => e.stopPropagation()}>
        <div className="sheet-grab" />
        <h3 className="sheet-h">How far along are you?</h3>

        <div className="sheet-weeknum">{w} weeks</div>
        <input className="phys-range" type="range" min="4" max="42" step="1" value={w}
          style={{ "--fill": ((w - 4) / 38 * 100) + "%" }}
          onChange={e => { setW(+e.target.value); setMode("week"); }} aria-label="Weeks" />
        <div className="phys-wkscale"><span>4</span><span>20</span><span>28</span><span>42</span></div>
        <p className="sheet-edd">Due date around <b>{formatEdd(mode === "date" && dateVal ? dateVal : eddFromWeek(w))}</b></p>

        <div className="sheet-or"><span>or set your due date</span></div>
        <input className="sheet-date" type="date" value={dateVal}
          onChange={e => { setDateVal(e.target.value); setMode("date"); }} aria-label="Due date" />

        <div className="sheet-actions">
          <button className="sheet-cancel" type="button" onClick={onClose}>Cancel</button>
          <button className="sheet-done" type="button" onClick={apply}>Done</button>
        </div>
      </div>
    </div>
  );
}
