import HandoverMark from "./HandoverMark";
import { SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop, PRIMARY_BTN } from "../utils/screenLayout";
import { TYPE_BODY, TYPE_DISPLAY } from "../utils/typography";

export default function WelcomeScreen({ onComplete }) {
  return (
    <div className={`${SCREEN} px-6`}>
      <div
        className={`${SCREEN_SCROLL} flex flex-col justify-center pb-3`}
        style={safeTop("1.5rem")}
      >
        <HandoverMark className={`${TYPE_DISPLAY} mb-1`} />
        <p className={`text-lg font-semibold text-claude-600 dark:text-claude-400 mb-6`}>
          From takeover to handover.
        </p>
        <h1 className={`${TYPE_DISPLAY} mb-3`}>
          Your shift job list.
        </h1>
        <p className={`${TYPE_BODY} text-gray-600 dark:text-gray-400 leading-snug`}>
          Add jobs as you go, ward by ward. Scan to take over at the start of shift and hand over what is still open at the end.
        </p>
      </div>

      <div className={SCREEN_FOOTER} style={safeBottom()}>
        <button type="button" onClick={onComplete} className={PRIMARY_BTN}>
          Continue
        </button>
      </div>
    </div>
  );
}
