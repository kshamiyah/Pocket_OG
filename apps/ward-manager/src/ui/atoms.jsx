import { useRef, useState } from "react";
import { CHIP, CHIP_SM, CHIP_ON, CHIP_OFF, INPUT, TYPE_OVERLINE } from "./styles";
import { resolveWhen } from "../utils/time";

export function Label({ children, hint, tight = false }) {
  return (
    <div className={`flex items-baseline justify-between gap-2 ${tight ? "mb-1" : "mb-2"}`}>
      <span className={TYPE_OVERLINE}>{children}</span>
      {hint && <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>}
    </div>
  );
}

export function Chip({ on, onClick, children, small = false, className = "", ...rest }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!on}
      className={`${small ? CHIP_SM : CHIP} ${on ? CHIP_ON : CHIP_OFF} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Single-select chip row. options: values, or { value, label }. */
export function ChipRow({ options, value, onChange, small = false, label = o => o }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => {
        const v = typeof o === "object" ? o.value : o;
        const l = typeof o === "object" ? o.label : label(o);
        return <Chip key={String(v)} small={small} on={value === v} onClick={() => onChange(v)}>{l}</Chip>;
      })}
    </div>
  );
}

export function MultiChipRow({ options, values, onChange, small = true }) {
  const toggle = v => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => <Chip key={o} small={small} on={values.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}
    </div>
  );
}

/** 0 to 10 cm circles. */
/**
 * Dilation as a ruler: one slim strip 0 to 10 cm. Tap a number or slide a
 * thumb along it; the readout above shows the value. Vertical scrolling still
 * works when a swipe starts on the strip. Tapping the selected number again
 * passes the same value back, so a caller can treat it as "clear".
 */
export function DilationGrid({ value, onChange }) {
  const track = useRef(null);
  const drag = useRef(null);
  const at = clientX => {
    const r = track.current.getBoundingClientRect();
    return Math.max(0, Math.min(10, Math.floor(((clientX - r.left) / r.width) * 11)));
  };
  const down = e => {
    const i = at(e.clientX);
    drag.current = { start: i, last: i, moved: false, wasSelected: i === value };
    track.current.setPointerCapture?.(e.pointerId);
    if (i !== value) onChange(i);
  };
  const move = e => {
    const d = drag.current; if (!d) return;
    const i = at(e.clientX);
    if (i !== d.last) { d.last = i; d.moved = true; onChange(i); }
  };
  const up = () => {
    const d = drag.current; drag.current = null;
    if (d && !d.moved && d.wasSelected) onChange(d.start);
  };
  const key = e => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    onChange(Math.max(0, Math.min(10, (value ?? (step > 0 ? -1 : 11)) + step)));
  };
  return (
    <div>
      <p className="text-center mb-2 tabular-nums">
        {value == null
          ? <span className="text-sm text-gray-400">Tap or slide</span>
          : <span className="text-3xl font-semibold text-gray-900 dark:text-white">{value}<span className="text-base font-normal text-gray-500"> cm</span></span>}
      </p>
      <div ref={track} role="slider" tabIndex={0} aria-label="Dilation in centimetres"
        aria-valuemin={0} aria-valuemax={10} aria-valuenow={value ?? undefined} aria-valuetext={value == null ? "not set" : `${value} cm`}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null; }} onKeyDown={key}
        className="relative grid grid-cols-11 h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 overflow-hidden select-none touch-pan-y cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-claude-500/40">
        {Array.from({ length: 11 }, (_, i) => {
          const sel = value === i;
          const below = value != null && i < value;
          return (
            <span key={i} data-cm={i}
              className={`relative flex items-end justify-center pb-1.5 text-sm font-semibold tabular-nums ${i ? "border-l border-gray-200 dark:border-gray-800" : ""} ${sel ? "bg-claude-600 text-white" : below ? "bg-claude-100 dark:bg-claude-950/50 text-claude-800 dark:text-claude-300" : "text-gray-500 dark:text-gray-400"}`}>
              <span aria-hidden="true" className={`absolute top-0 left-1/2 w-px ${i % 5 === 0 ? "h-3" : "h-2"} ${sel ? "bg-white/70" : "bg-gray-300 dark:bg-gray-700"}`} />
              {i}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, min, max, step = 1, bigStep, format = v => v, valueClass = "" }) {
  const set = v => onChange(Math.max(min, Math.min(max, v)));
  const btn = "w-12 h-12 rounded-xl border bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-bold active:scale-95";
  return (
    <div className="flex items-center gap-1.5">
      {bigStep && <button type="button" className={`${btn} text-xs`} onClick={() => set(value - bigStep)}>−{bigStep}</button>}
      <button type="button" className={`${btn} text-xl`} onClick={() => set(value - step)} aria-label="Decrease">−</button>
      <span className={`flex-1 text-center text-3xl font-semibold tabular-nums ${valueClass || "text-gray-900 dark:text-white"}`}>{format(value)}</span>
      <button type="button" className={`${btn} text-xl`} onClick={() => set(value + step)} aria-label="Increase">+</button>
      {bigStep && <button type="button" className={`${btn} text-xs`} onClick={() => set(value + bigStep)}>+{bigStep}</button>}
    </div>
  );
}

/**
 * When did it happen? "Now" and minutes-ago chips, or an exact clock time
 * today or yesterday. Future times are refused (value resolves to null).
 */
export function WhenPicker({ value, onChange, presets = [0, 10, 20, 30, 60], label = "When", tight = false }) {
  const exact = value?.clock != null;
  const [open, setOpen] = useState(exact);
  const resolved = resolveWhen(value);
  return (
    <div>
      <Label tight={tight}>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map(m => (
          <Chip key={m} small on={!exact && value?.minsAgo === m} onClick={() => { setOpen(false); onChange({ minsAgo: m }); }}>
            {m === 0 ? "Now" : m >= 60 && m % 60 === 0 ? `${m / 60}h ago` : `${m} min ago`}
          </Chip>
        ))}
        <Chip small on={exact || open} onClick={() => {
          setOpen(true);
          if (!exact) {
            const d = new Date();
            onChange({ clock: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`, daysAgo: 0 });
          }
        }}>{tight ? "Exact" : "Exact time"}</Chip>
      </div>
      {open && exact && (
        <div className="mt-2 flex gap-2 items-center">
          <input type="time" value={value.clock} onChange={e => onChange({ ...value, clock: e.target.value })}
            className={`${INPUT} flex-1`} aria-label="Exact time" />
          <ChipRow small options={[{ value: 0, label: "Today" }, { value: 1, label: "Yesterday" },
            ...((value.daysAgo ?? 0) > 1 ? [{ value: value.daysAgo, label: `${value.daysAgo} days ago` }] : [])]}
            value={value.daysAgo ?? 0} onChange={d => onChange({ ...value, daysAgo: d })} />
        </div>
      )}
      {exact && value.clock && !resolved && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5">That time is in the future. Pick a time that has passed.</p>
      )}
    </div>
  );
}
