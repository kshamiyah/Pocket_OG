import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  REMINDER_OFFSETS,
  formatReminderLabel,
  remindAtFromOffset,
  remindAtFromTimeString,
  timeStringFromRemindAt,
} from "../utils/reminders";
import { SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_CAPTION, TYPE_DISMISS, TYPE_LINK, TYPE_OVERLINE, TYPE_SECTION_MB2 } from "../utils/typography";

const CHIP = "px-3 py-2 rounded-lg text-xs font-semibold border transition-colors active:scale-[0.98]";
const CHIP_ON = "bg-claude-600 text-white border-claude-600";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const TILE = "py-2 rounded-lg text-xs font-semibold border transition-colors active:scale-[0.98]";
const TILE_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const TILE_COMPACT = "py-2 rounded-lg text-xs font-semibold border transition-colors active:scale-[0.98]";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const WHEEL_ITEM_H = 44;
const WHEEL_VIEW_H = WHEEL_ITEM_H * 3;
const WHEEL_EDGE_PAD = (WHEEL_VIEW_H - WHEEL_ITEM_H) / 2;

function nowTimeValue() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function defaultWheelMetrics() {
  return { itemH: WHEEL_ITEM_H, edgePad: WHEEL_EDGE_PAD };
}

function scrollTopForIndex(idx, { itemH }) {
  return idx * itemH;
}

function indexFromScrollTop(scrollTop, { itemH }) {
  return Math.round(scrollTop / itemH);
}

function splitTime(hhmm) {
  const [h, m] = (hhmm || nowTimeValue()).split(":");
  const hourNum = Number(h);
  const minuteNum = Number(m);
  const hour = Number.isFinite(hourNum) && hourNum >= 0 && hourNum < 24 ? hourNum : 12;
  const minute = Number.isFinite(minuteNum) && minuteNum >= 0 && minuteNum < 60 ? minuteNum : 0;
  return { hour, minute };
}

function joinTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function matchesOffset(remindAt, minutes) {
  if (!remindAt) return false;
  const at = new Date(remindAt).getTime();
  const expected = new Date(remindAtFromOffset(minutes)).getTime();
  if (Number.isNaN(at) || Number.isNaN(expected)) return false;
  return Math.abs(at - expected) < 60_000;
}

function isCustomReminder(remindAt) {
  if (!remindAt) return false;
  return !REMINDER_OFFSETS.some(({ minutes }) => matchesOffset(remindAt, minutes));
}

function TimeScrollWheel({ items, value, onChange, ariaLabel }) {
  const ref = useRef(null);
  const scrollTimer = useRef(null);
  const syncing = useRef(false);
  const metricsRef = useRef(defaultWheelMetrics());

  const measureWheel = () => {
    const el = ref.current;
    const first = el?.firstElementChild;
    if (!first) return metricsRef.current;
    const itemH = first.getBoundingClientRect().height;
    if (itemH <= 0) return metricsRef.current;
    const next = { itemH, edgePad: (WHEEL_VIEW_H - itemH) / 2 };
    metricsRef.current = next;
    el.style.paddingTop = `${next.edgePad}px`;
    el.style.paddingBottom = `${next.edgePad}px`;
    return next;
  };

  const applyScrollTop = (el, top, smooth = false) => {
    syncing.current = true;
    if (smooth) {
      el.scrollTo({ top, behavior: "smooth" });
      window.setTimeout(() => { syncing.current = false; }, 220);
      return;
    }
    el.scrollTop = top;
    requestAnimationFrame(() => {
      el.scrollTop = top;
      syncing.current = false;
    });
  };

  const scrollToIndex = (idx, smooth = false) => {
    const el = ref.current;
    if (!el) return;
    const metrics = measureWheel();
    applyScrollTop(el, scrollTopForIndex(idx, metrics), smooth);
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(value);
    if (idx < 0) return;
    const metrics = measureWheel();
    applyScrollTop(el, scrollTopForIndex(idx, metrics), false);
  }, [value, items]);

  const snapSelection = () => {
    const el = ref.current;
    if (!el || syncing.current) return;
    const metrics = measureWheel();
    const idx = indexFromScrollTop(el.scrollTop, metrics);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const next = items[clamped];
    const targetTop = scrollTopForIndex(clamped, metrics);
    if (Math.abs(el.scrollTop - targetTop) > 1) {
      scrollToIndex(clamped, true);
    }
    if (next !== value) onChange(next);
  };

  const onScroll = () => {
    if (syncing.current) return;
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(snapSelection, 80);
  };

  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  return (
    <div className="relative flex-1 min-w-0 overflow-hidden" style={{ height: WHEEL_VIEW_H }}>
      <div
        className="pointer-events-none absolute inset-x-0 rounded-lg border border-claude-500/35 bg-claude-500/5"
        style={{
          top: "50%",
          height: WHEEL_ITEM_H,
          transform: "translateY(-50%)",
        }}
        aria-hidden="true"
      />
      <div
        ref={ref}
        role="listbox"
        aria-label={ariaLabel}
        onScroll={onScroll}
        onPointerUp={snapSelection}
        onTouchEnd={snapSelection}
        className="h-full overflow-y-auto overscroll-y-contain touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: WHEEL_EDGE_PAD, paddingBottom: WHEEL_EDGE_PAD }}
      >
        {items.map((item) => {
          const selected = item === value;
          return (
            <div
              key={item}
              role="option"
              aria-selected={selected}
              className={`box-border flex shrink-0 items-center justify-center tabular-nums text-lg font-bold leading-none transition-colors ${
                selected ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"
              }`}
              style={{ height: WHEEL_ITEM_H }}
            >
              {String(item).padStart(2, "0")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomTimePanel({ pendingTime, hour, minute, onHour, onMinute, onCancel, onConfirm }) {
  const stopBubble = (e) => e.stopPropagation();

  return (
    <div
      className="mt-2 min-w-0 max-w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 flex flex-col gap-2"
      onClick={stopBubble}
      onPointerDown={stopBubble}
    >
      <p className={TYPE_OVERLINE}>Remind at</p>
      <div className="flex items-stretch gap-1 min-w-0">
        <TimeScrollWheel
          items={HOURS}
          value={hour}
          onChange={onHour}
          ariaLabel="Reminder hour"
        />
        <span className="self-center text-xl font-bold leading-none text-gray-400 dark:text-gray-500">:</span>
        <TimeScrollWheel
          items={MINUTES}
          value={minute}
          onChange={onMinute}
          ariaLabel="Reminder minute"
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 tabular-nums text-center font-semibold">
        {pendingTime}
      </p>
      <div className="grid grid-cols-2 gap-2 min-w-0">
        <button
          type="button"
          onClick={(e) => { stopBubble(e); onCancel(); }}
          className={`min-w-0 py-2.5 rounded-xl ${TYPE_DISMISS} border border-gray-200 dark:border-gray-800 touch-manipulation`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e) => { stopBubble(e); onConfirm(); }}
          className="min-w-0 py-2.5 rounded-xl text-sm font-bold bg-claude-600 text-white touch-manipulation"
        >
          Set reminder
        </button>
      </div>
    </div>
  );
}

function DefaultReminderPicker({ remindAt, onChange }) {
  const [timeOpen, setTimeOpen] = useState(false);
  const [pendingTime, setPendingTime] = useState(nowTimeValue);
  const savedTime = timeStringFromRemindAt(remindAt);
  const { hour, minute } = splitTime(pendingTime);

  const openTimePicker = () => {
    setPendingTime(savedTime || nowTimeValue());
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

  return (
    <div className="min-w-0 max-w-full overflow-hidden relative z-10">
      <p className={TYPE_SECTION_MB2}>Reminder</p>
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
        <CustomTimePanel
          pendingTime={pendingTime}
          hour={hour}
          minute={minute}
          onHour={(h) => setPendingTime((t) => joinTime(h, splitTime(t).minute))}
          onMinute={(m) => setPendingTime((t) => joinTime(splitTime(t).hour, m))}
          onCancel={() => setTimeOpen(false)}
          onConfirm={confirmTime}
        />
      )}
    </div>
  );
}

function WizardReminderPicker({
  remindAt,
  onChange,
  compact = false,
  overlayRoot,
  onCustomTimeOpenChange,
}) {
  const [timeOpen, setTimeOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [pendingTime, setPendingTime] = useState(nowTimeValue);
  const savedTime = timeStringFromRemindAt(remindAt);
  const { hour, minute } = splitTime(pendingTime);

  const showSummary = Boolean(remindAt) && !picking && !timeOpen;
  const customActive = timeOpen || (Boolean(remindAt) && isCustomReminder(remindAt));

  const openTimePicker = () => {
    setPendingTime(savedTime || nowTimeValue());
    setPicking(true);
    setTimeOpen(true);
  };

  const pickOffset = (minutes) => {
    onChange(remindAtFromOffset(minutes));
    setTimeOpen(false);
    setPicking(false);
  };

  const confirmTime = () => {
    const next = remindAtFromTimeString(pendingTime);
    if (next) {
      onChange(next);
      setTimeOpen(false);
      setPicking(false);
    }
  };

  const clearReminder = () => {
    onChange(null);
    setTimeOpen(false);
    setPicking(false);
  };

  useEffect(() => {
    onCustomTimeOpenChange?.(timeOpen);
  }, [timeOpen, onCustomTimeOpenChange]);

  const tileClass = (on) => `${compact ? TILE_COMPACT : TILE} ${on ? SELECTED_CHIP : TILE_OFF}`;

  const presetGrid = (
    <div className={compact ? "grid grid-cols-4 gap-1.5" : "grid grid-cols-2 gap-2"}>
      {REMINDER_OFFSETS.map(({ label, minutes }) => (
        <button
          key={label}
          type="button"
          onClick={() => pickOffset(minutes)}
          className={tileClass(matchesOffset(remindAt, minutes))}
        >
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => (timeOpen ? setTimeOpen(false) : openTimePicker())}
        className={tileClass(customActive)}
      >
        {savedTime && isCustomReminder(remindAt) && !timeOpen ? savedTime : "Custom"}
      </button>
    </div>
  );

  const closeCustomTime = () => {
    setTimeOpen(false);
    setPicking(Boolean(remindAt));
  };

  const timeOverlay = compact && timeOpen && overlayRoot && createPortal(
    <div className="absolute inset-0 z-40 flex flex-col bg-white dark:bg-gray-950 overflow-y-auto overscroll-y-contain touch-pan-y px-3 pt-2 pb-3">
      <button
        type="button"
        onClick={closeCustomTime}
        className={`self-start ${TYPE_DISMISS} text-xs mb-2 px-1 min-h-8 shrink-0`}
      >
        ← Back
      </button>
      <CustomTimePanel
        pendingTime={pendingTime}
        hour={hour}
        minute={minute}
        onHour={(h) => setPendingTime((t) => joinTime(h, splitTime(t).minute))}
        onMinute={(m) => setPendingTime((t) => joinTime(splitTime(t).hour, m))}
        onCancel={closeCustomTime}
        onConfirm={confirmTime}
      />
    </div>,
    overlayRoot,
  );

  return (
    <div className={`min-w-0 max-w-full ${compact ? "" : "overflow-hidden"}`}>
      {showSummary ? (
        <div className={`rounded-lg border border-claude-500/35 bg-claude-500/5 flex items-center gap-2 min-w-0 ${
          compact ? "px-2.5 py-2" : "px-3 py-3"
        }`}>
          <p className={`flex-1 min-w-0 font-semibold text-gray-900 dark:text-white truncate ${compact ? "text-xs" : "text-sm"}`}>
            {formatReminderLabel(remindAt)}
          </p>
          <button
            type="button"
            onClick={() => setPicking(true)}
            className={`shrink-0 ${TYPE_LINK} text-xs text-claude-700 dark:text-claude-400`}
          >
            Change
          </button>
          <button
            type="button"
            onClick={clearReminder}
            className={`shrink-0 ${TYPE_CAPTION}`}
          >
            Clear
          </button>
        </div>
      ) : (
        presetGrid
      )}
      {!compact && timeOpen && (
        <CustomTimePanel
          pendingTime={pendingTime}
          hour={hour}
          minute={minute}
          onHour={(h) => setPendingTime((t) => joinTime(h, splitTime(t).minute))}
          onMinute={(m) => setPendingTime((t) => joinTime(splitTime(t).hour, m))}
          onCancel={() => {
            setTimeOpen(false);
            setPicking(!remindAt);
          }}
          onConfirm={confirmTime}
        />
      )}
      {compact && timeOverlay}
    </div>
  );
}

export default function ReminderPicker({
  remindAt,
  onChange,
  variant = "default",
  compact = false,
  overlayRoot,
  onCustomTimeOpenChange,
}) {
  if (variant === "wizard") {
    return (
      <WizardReminderPicker
        remindAt={remindAt}
        onChange={onChange}
        compact={compact}
        overlayRoot={overlayRoot}
        onCustomTimeOpenChange={onCustomTimeOpenChange}
      />
    );
  }
  return <DefaultReminderPicker remindAt={remindAt} onChange={onChange} />;
}
