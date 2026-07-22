import { PANEL, PRIMARY_BTN, SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";
import { TYPE_BODY, TYPE_DISPLAY, TYPE_EYEBROW_MB4 } from "../utils/typography";

const POINTS = [
  {
    title: "A shift checklist",
    body: "Capture jobs as you go, walk the ward, and hand over what is still open at the end of shift.",
  },
  {
    title: "On this phone only",
    body: "No account and no cloud. A handover code only includes the jobs you choose to send. Private bed notes never leave this device.",
  },
  {
    title: "Clinical shorthand only",
    body: "Do not enter patient names, initials, dates of birth, or hospital numbers.",
  },
  {
    title: "Not a patient record",
    body: "This does not replace verbal handover or your clinical responsibility.",
  },
];

export default function DisclaimerScreen({ onComplete }) {
  return (
    <div className={`${SCREEN} px-6`}>
      <div
        className={`${SCREEN_SCROLL} flex flex-col justify-center pb-3`}
        style={safeTop("1.25rem")}
      >
        <p className={TYPE_EYEBROW_MB4}>
          Before you start
        </p>
        <h1 className={`${TYPE_DISPLAY} mb-2`}>
          Things to know
        </h1>
        <p className={`${TYPE_BODY} text-gray-600 dark:text-gray-400 leading-snug mb-6`}>
          Handover stays on this phone. Keep it safe for you and your patients.
        </p>

        <div className={`${PANEL} px-5 py-1`}>
          <ul>
            {POINTS.map(({ title, body }, index) => (
              <li
                key={title}
                className={`flex gap-3.5 py-4 ${
                  index > 0 ? "border-t border-gray-200 dark:border-gray-800" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="shrink-0 w-7 h-7 rounded-full bg-claude-100 dark:bg-claude-950/60 text-claude-700 dark:text-claude-400 text-xs font-semibold flex items-center justify-center mt-0.5"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className={`${TYPE_BODY} font-semibold leading-snug`}>
                    {title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mt-1">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={SCREEN_FOOTER} style={safeBottom()}>
        <button type="button" onClick={onComplete} className={PRIMARY_BTN}>
          I understand
        </button>
      </div>
    </div>
  );
}
