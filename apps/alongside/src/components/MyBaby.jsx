import { useState } from "react";
import { babyStageForWeek } from "../content/baby";
import { ProvenanceFooter } from "./provenance";

export default function MyBaby({ week }) {
  const [sel, setSel] = useState(week);
  const stage = babyStageForWeek(sel);
  const atNow = sel === week;
  const fill = ((sel - 4) / (42 - 4)) * 100;

  return (
    <div className="mybaby">
      <div className="baby-top">
        <p className="baby-kicker">Your baby</p>
        <div className="baby-weekrow">
          <h1 className="baby-week">Week {sel}</h1>
          {atNow
            ? <span className="baby-nowtag">where you are</span>
            : <button className="baby-now" onClick={() => setSel(week)}>Back to now (week {week})</button>}
        </div>
        <input type="range" className="phys-range" min="4" max="42" step="1" value={sel}
          style={{ "--fill": fill + "%" }} onChange={e => setSel(+e.target.value)} aria-label="Explore other weeks" />
        <div className="phys-wkscale"><span>4</span><span>20</span><span>28</span><span>42</span></div>
        <p className="baby-scrubhint">Drag to look ahead, or back.</p>
      </div>

      <div className="baby-hero">
        <div className="baby-heroblob" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2.1 0 3.4 1.2 4 2.3.6-1.1 1.9-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" /></svg>
        </div>
        <div>
          <p className="baby-sizelab">About the size of</p>
          <p className="baby-size">{stage.size}</p>
          <p className="baby-measure">{stage.measure}</p>
        </div>
      </div>

      {stage.milestone && (
        <div className="baby-milestone">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.5-.5Z" /></svg>
          {stage.milestone}
        </div>
      )}

      <p className="baby-headline">{stage.headline}</p>

      <ul className="baby-points">
        {stage.points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>

      <p className="baby-avgnote">Every baby grows at their own pace, so these are averages. Early measurements are head to bottom, later ones head to heel.</p>

      <ProvenanceFooter codes={[]} extra={["NHS pregnancy week-by-week guide and standard antenatal references (2026)"]} />
    </div>
  );
}
