import HandoverMark from "./HandoverMark";
import { SCREEN, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";
import pkg from "../../package.json";

const SECTION = "mb-6";
const H = "text-sm font-bold text-gray-900 dark:text-white mb-1.5";
const P = "text-sm text-gray-600 dark:text-gray-400 leading-relaxed";

export default function AboutScreen({ onBack }) {
  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 flex items-center gap-3 mb-4" style={safeTop()}>
        <button type="button" onClick={onBack} className="text-sm font-bold text-gray-500 dark:text-gray-400" aria-label="Back">
          ← Back
        </button>
        <div className="font-extrabold text-lg text-gray-900 dark:text-white">About</div>
      </div>

      <div className={`${SCREEN_SCROLL} pb-4`} style={safeBottom()}>
        <HandoverMark className="font-extrabold text-2xl text-gray-900 dark:text-white mb-1" />
        <p className="text-base font-bold text-claude-600 dark:text-claude-400 mb-6">
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
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm font-semibold text-claude-600 dark:text-claude-400 underline underline-offset-2"
          >
            Read the full privacy policy
          </a>
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
