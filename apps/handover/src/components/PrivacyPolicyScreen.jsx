import { Storage } from "../utils/storage";
import { SCREEN, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_TITLE } from "../utils/typography";
import { THEME_DARK } from "../utils/theme";

export default function PrivacyPolicyScreen({ onBack }) {
  const theme = Storage.getTheme();
  const dark = theme === THEME_DARK;
  const src = `/privacy.html?theme=${dark ? "dark" : "light"}`;

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
        src={src}
        className="flex-1 w-full min-h-0 border-0 bg-[#fbe9e7] dark:bg-gray-950"
        style={{ colorScheme: dark ? "dark" : "light" }}
      />
    </div>
  );
}
