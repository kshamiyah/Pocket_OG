import { useEffect, useRef, useState } from "react";
import { PHYS_SYSTEMS, PHYS_ORDER, cardiacOutputAtWeek } from "../content/physiology";
import { ProvenanceFooter } from "./provenance";

const REDUCED = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function Html({ html, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

const FLAG = {
  u: { badge: "Get seen now", dot: "bg-urgent", chip: "text-urgent bg-urgentbg" },
  s: { badge: "Worth a call", dot: "bg-notice", chip: "text-notice bg-noticebg" },
};

/* ---- cardiovascular interactive ---- */
function CardioSim({ dark }) {
  const canvasRef = useRef(null);
  const [week, setWeek] = useState(24);
  const [vol, setVol] = useState(REDUCED ? 50 : 0);

  const pct = Math.round(cardiacOutputAtWeek(week));
  const hr = Math.round(72 + (pct / 40) * 16);

  useEffect(() => {
    if (REDUCED) return;
    let n = 0, raf;
    const step = () => { n = Math.min(50, n + 2.5); setVol(Math.round(n)); if (n < 50) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    const draw = () => {
      const ctx = cv.getContext("2d");
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth, h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const x0 = 6, x1 = w - 6, y0 = 12, y1 = h - 16, maxPct = 45, maxWk = 40;
      const X = wk => x0 + (wk / maxWk) * (x1 - x0);
      const Y = p => y1 - (p / maxPct) * (y1 - y0);
      const accent = css("--accent") || "#7A4A66";
      const line = css("--line") || "#e8dede";
      const faint = css("--ink-faint") || "#9c8e97";
      const surface = css("--surface") || "#fff";

      ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.font = "9px system-ui"; ctx.fillStyle = faint;
      [0, 20, 40].forEach(p => { const y = Y(p); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.fillText("+" + p + "%", x0, y - 3); });

      const grad = ctx.createLinearGradient(0, y0, 0, y1);
      grad.addColorStop(0, accent.startsWith("#") ? accent + "55" : accent);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      for (let wk = 0; wk <= maxWk; wk++) { const px = X(wk), py = Y(cardiacOutputAtWeek(wk)); wk === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
      ctx.lineTo(X(maxWk), y1); ctx.lineTo(X(0), y1); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      for (let wk = 0; wk <= maxWk; wk++) { const px = X(wk), py = Y(cardiacOutputAtWeek(wk)); wk === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();

      const mx = X(week), my = Y(cardiacOutputAtWeek(week));
      ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, y1); ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(mx, my, 5.5, 0, 7); ctx.fillStyle = accent; ctx.fill();
      ctx.beginPath(); ctx.arc(mx, my, 2.2, 0, 7); ctx.fillStyle = surface; ctx.fill();
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [week, dark]);

  const fill = ((week - 4) / (40 - 4)) * 100;

  return (
    <>
      <div className="phys-stat">
        <span className="phys-num">+{vol}%</span>
        <span className="phys-cap"><b>more blood</b> by late pregnancy,<br />about 1.5 extra litres.</span>
      </div>
      <div className="phys-sim">
        <div className="phys-sim-h">
          <span className="phys-sim-lbl">Your heart's workload</span>
          <span className="phys-readout">Week {week} · <span className="phys-pct">+{pct}%</span></span>
        </div>
        <div className="phys-chartwrap"><canvas ref={canvasRef} className="phys-canvas" role="img" aria-label="How cardiac output rises across pregnancy" /></div>
        <input type="range" className="phys-range" min="4" max="40" step="1" value={week}
          style={{ "--fill": fill + "%" }} onChange={e => setWeek(+e.target.value)} aria-label="Weeks of pregnancy" />
        <div className="phys-wkscale"><span>4 wks</span><span>20</span><span>28</span><span>40 wks</span></div>
        <div className="phys-heartline">
          <svg className={"phys-heart" + (REDUCED ? "" : " beat")} style={{ "--beat": (60 / hr).toFixed(2) + "s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2.1 0 3.4 1.2 4 2.3.6-1.1 1.9-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" />
          </svg>
          <span className="phys-hr">Around <b>{hr}</b> beats per minute</span>
        </div>
      </div>
    </>
  );
}

function SystemView({ sys, dark, onBack }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <button className="phys-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to your body
      </button>
      <p className="phys-kicker">{sys.kicker}</p>
      <h2 className="phys-headline">{sys.headline.pre}<span className="phys-big">{sys.headline.big}</span>{sys.headline.post}</h2>

      {sys.cardio && <CardioSim dark={dark} />}

      <div className="phys-sect">
        <div className="phys-h"><span>Why your body does this</span><span className="phys-rule" /></div>
        {sys.why.map((p, i) => <Html key={i} className="phys-prose" html={p} />)}
      </div>

      <div className="phys-sect">
        <div className="phys-h"><span>What you'll feel</span><span className="phys-rule" /></div>
        <div className="phys-feel">
          {sys.feel.map(([q, a], i) => (
            <div key={i} className="phys-feelrow" aria-expanded={open === i}>
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="phys-q">{q}</span>
                <span className="phys-plus"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg></span>
              </button>
              <div className="phys-a"><Html html={a} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="phys-sect">
        <div className="phys-h"><span>The clever bit</span><span className="phys-rule" /></div>
        <div className="phys-clever">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" strokeLinecap="round" /><circle cx="12" cy="12" r="3.5" /></svg>
          <Html html={sys.clever} />
        </div>
      </div>

      <div className="phys-sect">
        <div className="phys-h"><span>When it's more than normal</span><span className="phys-rule" /></div>
        <div className="phys-flags">
          {sys.flags.map(([sev, text], i) => (
            <div key={i} className="phys-flag">
              <div className="phys-flag-t">
                <span className={"phys-sev " + FLAG[sev].dot} />
                <span className={"phys-badge " + FLAG[sev].chip}>{FLAG[sev].badge}</span>
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <ProvenanceFooter codes={["PHYSIOLOGY"]} />
    </div>
  );
}

export default function PhysiologyExperience({ dark, onExit }) {
  const [sysKey, setSysKey] = useState(null);
  const sys = sysKey ? PHYS_SYSTEMS[sysKey] : null;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16">
      {sys ? (
        <SystemView sys={sys} dark={dark} onBack={() => setSysKey(null)} />
      ) : (
        <div>
          <button className="phys-back" onClick={onExit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            All topics
          </button>
          <p className="mt-3 font-serif text-xl font-semibold leading-tight text-ink">Right now, your body is quietly rebuilding itself to grow and deliver a whole person.</p>
          <p className="mt-1 text-[13px] text-inksoft">Tap a part to see what is changing, and why.</p>

          <div className="phys-figwrap">
            <svg viewBox="0 0 210 340" aria-hidden="true">
              <circle cx="105" cy="42" r="29" fill="var(--accent-soft)" stroke="var(--line)" />
              <path d="M62 84 Q105 70 148 84 Q156 110 152 150 Q149 205 135 260 Q129 300 120 332 L90 332 Q81 300 75 260 Q61 205 58 150 Q54 110 62 84 Z" fill="var(--accent-soft)" stroke="var(--line)" strokeWidth="1.5" />
              <ellipse cx="105" cy="205" rx="30" ry="26" fill="color-mix(in oklab,var(--accent) 16%, var(--surface))" stroke="var(--line)" />
            </svg>
            {PHYS_ORDER.map(k => {
              const s = PHYS_SYSTEMS[k];
              return (
                <button key={k} className="phys-hot" style={{ left: s.hotspot.left, top: s.hotspot.top }} onClick={() => setSysKey(k)} aria-label={s.label} title={s.label}>
                  <span className="phys-dot" />
                </button>
              );
            })}
          </div>

          <div className="phys-grid">
            {PHYS_ORDER.map(k => {
              const s = PHYS_SYSTEMS[k];
              return (
                <button key={k} className="phys-card" onClick={() => setSysKey(k)}>
                  <span className="phys-card-lab">{s.label}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              );
            })}
          </div>

          <div className="phys-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" strokeLinecap="round" /></svg>
            <p>Start with <b>Heart &amp; blood</b> to see the trimester slider, it shows how your heart's workload really changes week by week.</p>
          </div>
        </div>
      )}
    </div>
  );
}
