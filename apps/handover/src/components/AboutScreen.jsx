import HandoverMark from "./HandoverMark";
import { SCREEN, SCREEN_SCROLL, safeBottom, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_DISPLAY, TYPE_TITLE } from "../utils/typography";
import pkg from "../../package.json";

const SECTION = "mb-6";
const H = "text-sm font-semibold text-gray-900 dark:text-white mb-1.5";
const P = "text-sm text-gray-600 dark:text-gray-400 leading-relaxed";

export default function AboutScreen({ onBack, onOpenPrivacy }) {
  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 flex items-center gap-3 mb-4" style={safeTop()}>
        <button type="button" onClick={onBack} className={BACK_LINK} aria-label="Back">
          ← Back
        </button>
        <div className={TYPE_TITLE}>About</div>
      </div>

      <div className={`${SCREEN_SCROLL} pb-4`} style={safeBottom()}>
        <HandoverMark className={`${TYPE_DISPLAY} mb-1`} />
        <p className="text-base font-semibold text-claude-600 dark:text-claude-400 mb-6">
          From takeover to handover.
        </p>

        <div className={SECTION}>
          <h2 className={H}>What it is</h2>
          <p className={P}>
            A shift job list for your phone. Capture jobs by ward and bed as you go,
            walk the ward bed by bed, then hand over with a QR code or shareable link
            at the end of the shift.
          </p>
        </div>

        <div className={SECTION}>
          <h2 className={H}>Privacy</h2>
          <p className={P}>
            Everything stays on this device. No account, no server, and no cloud sync.
            Jobs, wards, bed notes and your profile live only in this phone&apos;s storage.
          </p>
          <p className={`${P} mt-2`}>
            A handover QR or link only carries the jobs you choose to send.
            Private bed notes are never included.
          </p>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="inline-block mt-2 text-sm font-semibold text-claude-600 dark:text-claude-400 underline underline-offset-2 text-left"
          >
            Read the full privacy policy
          </button>
          <p className={`${P} mt-2`}>
            Questions or feedback:{" "}
            <a
              href="mailto:khalid@drshamiyah.com"
              className="font-semibold text-claude-600 dark:text-claude-400 underline underline-offset-2"
            >
              khalid@drshamiyah.com
            </a>
          </p>
        </div>

        <div className={SECTION}>
          <h2 className={H}>How to use it</h2>
          <p className={P}>
            Take over by scanning a colleague&apos;s code, or start a fresh shift.
            Add jobs as you work. When you hand over, pick what to pass on —
            then clear your list if you are leaving.
          </p>
        </div>

        <div className={SECTION}>
          <h2 className={H}>Not a patient record</h2>
          <p className={P}>
            Use non-identifying shorthand only. Do not enter names, initials,
            dates of birth or hospital numbers. This tool does not replace
            verbal handover or clinical responsibility.
          </p>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600 tabular-nums">
          Version {pkg.version}
        </p>
      </div>
    </div>
  );
}
