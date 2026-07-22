import { SHIFT_TYPES, roleLabel, timeGreeting } from "../utils/constants";
import { PANEL, SCREEN, SCREEN_SCROLL, safeBottom, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_BODY, TYPE_DISPLAY, TYPE_EYEBROW_MB4 } from "../utils/typography";

const SHIFT_BTN =
  "py-4 rounded-2xl text-base font-semibold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white active:scale-[0.98] active:border-claude-500 active:bg-claude-50 dark:active:bg-claude-950/30 transition-all";

export default function ShiftPicker({ profile, onComplete, onBack }) {
  const name = profile?.name?.trim();
  const label = roleLabel(profile);

  return (
    <div className={`${SCREEN} px-6`}>
      <div
        className={`${SCREEN_SCROLL} flex flex-col justify-center pb-4`}
        style={{ ...safeTop("1.25rem"), ...safeBottom("1rem") }}
      >
        {onBack && (
          <button type="button" onClick={onBack} className={`${BACK_LINK} mb-6 self-start`}>
            ← Back
          </button>
        )}
        <p className={TYPE_EYEBROW_MB4}>
          New shift
        </p>
        <p className={`${TYPE_BODY} text-gray-600 dark:text-gray-400 mb-1`}>
          Good {timeGreeting()}
          {name ? (
            <>
              {", "}
              <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
            </>
          ) : null}
          {label ? <span className="text-gray-500 dark:text-gray-500">{` · ${label}`}</span> : null}
          .
        </p>
        <h1 className={`${TYPE_DISPLAY} mb-2`}>Starting a shift?</h1>
        <p className={`${TYPE_BODY} text-gray-600 dark:text-gray-400 leading-snug mb-6`}>
          Pick what you are working. You can change ward layouts later.
        </p>
        <div className={`${PANEL} p-3 grid grid-cols-2 gap-2.5`}>
          {SHIFT_TYPES.map((s) => (
            <button key={s.key} type="button" onClick={() => onComplete({ shiftType: s.key })} className={SHIFT_BTN}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
