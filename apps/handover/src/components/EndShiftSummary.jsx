import { useMemo } from "react";
import HandoverMark from "./HandoverMark";
import { PRIORITY, SHIFT_TYPES } from "../utils/constants";
import { shiftSummary } from "../utils/jobs";
import { SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop, BACK_LINK, PRIMARY_BTN } from "../utils/screenLayout";
import {
  TYPE_BADGE, TYPE_DISPLAY, TYPE_OVERLINE, TYPE_SECTION_MB2, TYPE_STAT, TYPE_STAT_ACCENT, TYPE_STAT_LABEL, TYPE_TITLE, TYPE_UI_SM,
} from "../utils/typography";

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${accent ? "border-claude-200 dark:border-claude-900 bg-claude-50 dark:bg-claude-950/30" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"}`}>
      <div className={`${accent ? TYPE_STAT_ACCENT : TYPE_STAT}`}>
        {value}
      </div>
      <div className={TYPE_STAT_LABEL}>
        {label}
      </div>
    </div>
  );
}

export default function EndShiftSummary({
  jobs, shiftType, handedOverIds = [], onBack, onHandover, onConfirmEnd,
}) {
  const stats = shiftSummary(jobs);
  const handedSet = useMemo(() => new Set(handedOverIds), [handedOverIds]);
  const open = jobs.filter((j) => !j.done && !handedSet.has(j.id)).length;
  const urgent = jobs.filter((j) => !j.done && j.priority === PRIORITY.URGENT && !handedSet.has(j.id)).length;
  const shiftLabel = SHIFT_TYPES.find((s) => s.key === shiftType)?.label ?? "Shift";
  const hasOpen = open > 0;
  const bridgedHandover = handedOverIds.length > 0;

  return (
    <div className={`${SCREEN} px-5`}>
      <div className={`${SCREEN_SCROLL} pb-3`} style={safeTop()}>
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={onBack} className={BACK_LINK}>
            ← Back
          </button>
          <HandoverMark className={TYPE_TITLE} />
        </div>

        <p className={`${TYPE_OVERLINE} mb-1`}>
          {shiftLabel} shift
        </p>
        <h1 className={`${TYPE_DISPLAY} mb-2`}>End shift</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {stats.total === 0
            ? "You didn't add any jobs this shift."
            : hasOpen
              ? "Share open jobs before you leave, or end without handover."
              : bridgedHandover
                ? "You handed over your open jobs. Review your shift, then finish."
                : "Nothing left open. You can finish your shift."}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <Stat label="Jobs created" value={stats.total} />
          <Stat label="Wards covered" value={stats.wardCount} />
          <Stat label="Done" value={stats.done} />
          <Stat label="Outstanding" value={open} accent={hasOpen} />
        </div>

        {stats.wards.length > 0 && (
          <div className="mb-6">
            <p className={TYPE_SECTION_MB2}>
              Wards on your list
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stats.wards.map((ward) => (
                <span
                  key={ward}
                  className={`${TYPE_BADGE} text-claude-800 dark:text-claude-300 bg-claude-100 dark:bg-claude-900/30 px-2 py-1 rounded-lg`}
                >
                  {ward}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasOpen && (
          <div className="rounded-2xl border border-claude-200 dark:border-claude-900 bg-claude-50 dark:bg-claude-950/20 px-4 py-3.5 mb-4">
            <p className={`${TYPE_UI_SM} text-claude-900 dark:text-claude-200 mb-1`}>
              {open} job{open === 1 ? "" : "s"} still open
              {urgent > 0 ? ` · ${urgent} urgent` : ""}
            </p>
            <p className="text-sm text-claude-800/80 dark:text-claude-300/80 leading-snug">
              Hand these over as a QR or link. Your list clears when you finish your shift.
            </p>
          </div>
        )}
      </div>

      <div className={`${SCREEN_FOOTER} flex flex-col gap-2.5`} style={safeBottom()}>
        {hasOpen ? (
          <>
            <button
              type="button"
              onClick={onHandover}
              className="w-full py-4 rounded-2xl bg-claude-600 text-white text-base font-bold active:scale-95 transition-all"
            >
              Hand over and end shift
            </button>
            <button
              type="button"
              onClick={onConfirmEnd}
              className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold active:scale-[0.98] transition-all"
            >
              End shift without handover
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConfirmEnd}
            className={PRIMARY_BTN}
          >
            End shift
          </button>
        )}
      </div>
    </div>
  );
}
