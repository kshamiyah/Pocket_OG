import { useState } from "react";
import {
  REMINDER_OFFSETS,
  remindAtFromOffset,
  remindAtFromTimeString,
  timeStringFromRemindAt,
} from "../utils/reminders";

const CHIP = "px-3 py-2 rounded-lg text-xs font-bold border transition-colors active:scale-[0.98]";
const CHIP_ON = "bg-claude-600 text-white border-claude-600";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const LABEL = "text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2";
const SELECT = "min-w-0 w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-3 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

function defaultTimeValue() {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5 + 30);
  if (d.getMinutes() >= 60) {
    d.setHours(d.getHours() + 1);
    d.setMinutes(d.getMinutes() - 60);
  }
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function splitTime(hhmm) {
  const [h, m] = (hhmm || defaultTimeValue()).split(":");
  const hour = HOURS.includes(h) ? h : "12";
  const minute = MINUTES.includes(m) ? m : MINUTES.reduce((best, cand) => (
    Math.abs(Number(cand) - Number(m)) < Math.abs(Number(best) - Number(m)) ? cand : best
  ), "00");
  return { hour, minute };
}

function joinTime(hour, minute) {
  return `${hour}:${minute}`;
}

export default function ReminderPicker({ remindAt, onChange }) {
  const [timeOpen, setTimeOpen] = useState(false);
  const [pendingTime, setPendingTime] = useState(defaultTimeValue);
  const savedTime = timeStringFromRemindAt(remindAt);
  const { hour, minute } = splitTime(pendingTime);

  const openTimePicker = () => {
    setPendingTime(savedTime || defaultTimeValue());
    setTimeOpen(true);
  };

  const pickOffset = (minutes) => {
    onChange(remindAtFromOffset(minutes));
    setTimeOpen(false);
  };

  const confirmTime = () => {
    const next = remindAtFromTimeString(pendingTime);
    if (next) {
      onChange(next);
      setTimeOpen(false);
    }
  };

  const setHour = (nextHour) => setPendingTime(joinTime(nextHour, minute));
  const setMinute = (nextMinute) => setPendingTime(joinTime(hour, nextMinute));

  const stopSwipe = (e) => e.stopPropagation();

  return (
    <div className="min-w-0 max-w-full overflow-hidden" onPointerDown={stopSwipe} onPointerMove={stopSwipe}>
      <p className={LABEL}>Reminder</p>
      <div className="grid grid-cols-3 gap-1.5 mb-1.5">
        {REMINDER_OFFSETS.map(({ label, minutes }) => (
          <button
            key={label}
            type="button"
            onClick={() => pickOffset(minutes)}
            className={`${CHIP} ${CHIP_OFF}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => (timeOpen ? setTimeOpen(false) : openTimePicker())}
          className={`${CHIP} ${timeOpen || savedTime ? CHIP_ON : CHIP_OFF}`}
        >
          {savedTime && !timeOpen ? `Custom · ${savedTime}` : "Custom"}
        </button>
        {remindAt && (
          <button
            type="button"
            onClick={() => { onChange(null); setTimeOpen(false); }}
            className={`${CHIP} ${CHIP_OFF}`}
          >
            Clear
          </button>
        )}
      </div>
      {timeOpen && (
        <div className="mt-2 min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Remind at</label>
          <div className="grid grid-cols-2 gap-2 min-w-0">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className={SELECT}
              aria-label="Reminder hour"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className={SELECT}
              aria-label="Reminder minute"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-600 tabular-nums">{pendingTime}</p>
          <div className="grid grid-cols-2 gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setTimeOpen(false)}
              className="min-w-0 py-2.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmTime}
              className="min-w-0 py-2.5 rounded-xl text-sm font-bold bg-claude-600 text-white"
            >
              Set reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
