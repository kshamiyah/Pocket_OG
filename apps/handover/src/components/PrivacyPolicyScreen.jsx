import { SCREEN, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_TITLE } from "../utils/typography";

export default function PrivacyPolicyScreen({ onBack }) {
  return (
    <div className={`${SCREEN} bg-[#fbe9e7] dark:bg-gray-950`}>
      <div
        className="shrink-0 flex items-center gap-3 px-5 pb-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
        style={safeTop("0.75rem")}
      >
        <button type="button" onClick={onBack} className={BACK_LINK} aria-label="Back to About">
          ← Back
        </button>
        <div className={TYPE_TITLE}>Privacy policy</div>
      </div>
      <iframe
        title="Handover privacy policy"
        src="/privacy.html"
        className="flex-1 w-full min-h-0 border-0 bg-[#fbe9e7] dark:bg-gray-950"
      />
    </div>
  );
}
