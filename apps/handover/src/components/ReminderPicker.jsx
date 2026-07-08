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
const TIME_INPUT = "min-w-0 w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-3 text-base text-center tabular-nums text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

function defaultTimeValue() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function splitTime(hhmm) {
  const [h, m] = (hhmm || defaultTimeValue()).split(":");
  const hourNum = Number(h);
  const minuteNum = Number(m);
  const hour = Number.isFinite(hourNum) && hourNum >= 0 && hourNum < 24
    ? String(hourNum).padStart(2, "0")
    : "12";
  const minute = Number.isFinite(minuteNum) && minuteNum >= 0 && minuteNum < 60
    ? String(minuteNum).padStart(2, "0")
    : "00";
  return { hour, minute };
}

function joinTime(hour, minute) {
  return `${hour}:${minute}`;
}

function clampHour(value) {
  const n = Math.min(23, Math.max(0, Number(value) || 0));
  return String(n).padStart(2, "0");
}

function clampMinute(value) {
  const n = Math.min(59, Math.max(0, Number(value) || 0));
  return String(n).padStart(2, "0");
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

  const setHour = (raw) => {
    setPendingTime((current) => joinTime(clampHour(raw), splitTime(current).minute));
  };

  const setMinute = (raw) => {
    setPendingTime((current) => joinTime(splitTime(current).hour, clampMinute(raw)));
  };

  const stopBubble = (e) => e.stopPropagation();

  return (
    <div className="min-w-0 max-w-full overflow-hidden relative z-10">
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
        <div
          className="mt-2 min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 flex flex-col gap-2"
          onClick={stopBubble}
          onPointerDown={stopBubble}
        >
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Remind at</p>
          <div className="grid grid-cols-2 gap-2 min-w-0">
            <label className="min-w-0 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">Hour</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={23}
                value={Number(hour)}
                onChange={(e) => setHour(e.target.value)}
                className={TIME_INPUT}
                aria-label="Reminder hour"
              />
            </label>
            <label className="min-w-0 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">Min</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                value={Number(minute)}
                onChange={(e) => setMinute(e.target.value)}
                className={TIME_INPUT}
                aria-label="Reminder minute"
              />
            </label>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-600 tabular-nums text-center">{pendingTime}</p>
          <div className="grid grid-cols-2 gap-2 min-w-0">
            <button
              type="button"
              onClick={(e) => { stopBubble(e); setTimeOpen(false); }}
              className="min-w-0 py-2.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => { stopBubble(e); confirmTime(); }}
              className="min-w-0 py-2.5 rounded-xl text-sm font-bold bg-claude-600 text-white touch-manipulation"
            >
              Set reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
