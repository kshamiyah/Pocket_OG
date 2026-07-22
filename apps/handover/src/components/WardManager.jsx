import { useState } from "react";
import { totalBeds } from "../utils/wardLayouts";
import AddWardSheet from "./AddWardSheet";
import ShareWardSheet from "./ShareWardSheet";
import WardActionsSheet from "./WardActionsSheet";
import WardSetupExchangeSheet from "./WardSetupExchangeSheet";
import {
  PANEL, PRIMARY_BTN, SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop, BACK_LINK,
} from "../utils/screenLayout";
import { TYPE_EYEBROW, TYPE_TITLE } from "../utils/typography";

const ADD_BTN =
  "shrink-0 w-11 h-11 rounded-full border border-claude-200 dark:border-claude-900 text-claude-700 dark:text-claude-400 text-xl font-bold flex items-center justify-center active:scale-95 transition-all";

const MENU_BTN =
  "shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-900 transition-colors";

export default function WardManager({
  wardNames, wardLayouts, jobs, onEditWard, onDeleteWard, onScanSetup, onBack,
}) {
  const [menuWard, setMenuWard] = useState(null);
  const [shareLayouts, setShareLayouts] = useState(null);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addSession, setAddSession] = useState(0);

  const jobCount = (ward) => jobs.filter((j) => j.ward === ward).length;

  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 flex items-start justify-between gap-3 mb-4" style={safeTop()}>
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onBack} className={BACK_LINK} aria-label="Back to home">
            ← Home
          </button>
          <div className="min-w-0">
            <p className={`${TYPE_EYEBROW} mb-0.5`}>Manage wards</p>
            <div className={TYPE_TITLE}>Bed setup</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setAddSession((n) => n + 1); setAddOpen(true); }}
          aria-label="Add ward"
          className={ADD_BTN}
        >
          +
        </button>
      </div>

      <div className={`${SCREEN_SCROLL} flex flex-col gap-2 pb-3`}>
        {wardNames.length === 0 && (
          <div className={`${PANEL} p-5 text-center`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
              No wards yet. Tap + to add one, exchange a colleague&apos;s setup, or tag a job with a ward first.
            </p>
          </div>
        )}
        {wardNames.map((ward) => {
          const layout = wardLayouts[ward];
          const configured = Boolean(layout);
          const count = configured ? totalBeds(layout) : 0;
          const jobsOnWard = jobCount(ward);

          return (
            <div key={ward} className={`${PANEL} p-4 min-w-0`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-gray-900 dark:text-white truncate">{ward}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {configured ? (count > 0 ? `${count} beds` : "No beds") : "Not set up"}
                    {jobsOnWard > 0 && ` · ${jobsOnWard} job${jobsOnWard === 1 ? "" : "s"}`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuWard(ward)}
                  aria-label={`Actions for ${ward}`}
                  className={MENU_BTN}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="5" cy="12" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="19" cy="12" r="1.8" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {onScanSetup && (
        <div className={SCREEN_FOOTER} style={safeBottom()}>
          <button
            type="button"
            onClick={() => setExchangeOpen(true)}
            className={PRIMARY_BTN}
          >
            Exchange Ward Setup
          </button>
        </div>
      )}

      <AddWardSheet
        key={addSession}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={onEditWard}
      />

      <WardActionsSheet
        key={menuWard}
        open={Boolean(menuWard)}
        ward={menuWard}
        jobsOnWard={menuWard ? jobCount(menuWard) : 0}
        onClose={() => setMenuWard(null)}
        onEdit={() => onEditWard(menuWard)}
        onRemove={() => onDeleteWard(menuWard)}
      />

      <WardSetupExchangeSheet
        open={exchangeOpen}
        onClose={() => setExchangeOpen(false)}
        wardNames={wardNames}
        wardLayouts={wardLayouts}
        onReceive={onScanSetup}
        onShare={(layouts) => setShareLayouts(layouts)}
      />

      {shareLayouts && Object.keys(shareLayouts).length > 0 && (
        <ShareWardSheet
          open
          layouts={shareLayouts}
          onClose={() => setShareLayouts(null)}
        />
      )}
    </div>
  );
}
