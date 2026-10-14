import { useState } from "react";
import { CHIP, CHIP_SM, CHIP_ON, CHIP_OFF, INPUT, TYPE_OVERLINE } from "./styles";
import { resolveWhen } from "../utils/time";

export function Label({ children, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-2 mb-2">
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
export function DilationGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {Array.from({ length: 11 }, (_, i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-pressed={value === i}
          aria-label={`${i} centimetres`}
          className={`aspect-square rounded-full border text-lg font-semibold tabular-nums transition-colors active:scale-95 ${value === i ? CHIP_ON : CHIP_OFF}`}>
          {i}
        </button>
      ))}
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
export function WhenPicker({ value, onChange, presets = [0, 10, 20, 30, 60], label = "When" }) {
  const exact = value?.clock != null;
  const [open, setOpen] = useState(exact);
  const resolved = resolveWhen(value);
  return (
    <div>
      <Label>{label}</Label>
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
        }}>Exact time</Chip>
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
