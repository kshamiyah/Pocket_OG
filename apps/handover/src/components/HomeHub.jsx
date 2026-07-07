import HandoverMark from "./HandoverMark";
import { roleLabel, timeGreeting } from "../utils/constants";
import { SCREEN, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

const LINK = "text-sm font-bold text-gray-500 dark:text-gray-400 active:text-gray-700 dark:active:text-gray-200";

export default function HomeHub({ profile, onTakeover, onStartShift, onManageWards, onEditProfile }) {
  const name = profile?.name?.trim();
  const label = roleLabel(profile);

  return (
    <div className={`${SCREEN} px-6`}>
      <div
        className={`${SCREEN_SCROLL} flex flex-col justify-center`}
        style={{ ...safeTop("1.5rem"), ...safeBottom("1rem") }}
      >
        <HandoverMark className="font-extrabold text-2xl text-gray-900 dark:text-white mb-1" />
        <p className="text-lg font-bold text-claude-600 dark:text-claude-400 mb-5">
          From takeover to handover.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
          Good {timeGreeting()}
          {name ? (
            <>
              {", "}
              <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
            </>
          ) : null}
          {label ? <span className="text-gray-500 dark:text-gray-400">{` · ${label}`}</span> : null}
          .
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onTakeover}
            className="w-full py-4 rounded-2xl bg-claude-600 text-white text-base font-bold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 7h10l-3-3" />
              <path d="M17 17H7l3 3" />
            </svg>
            Take over
          </button>
          <button
            type="button"
            onClick={onStartShift}
            className="w-full py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-base font-bold active:scale-[0.98] transition-all"
          >
            Start a shift
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button type="button" onClick={onManageWards} className={LINK}>
            Manage wards
          </button>
          <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
          <button type="button" onClick={onEditProfile} className={LINK}>
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
