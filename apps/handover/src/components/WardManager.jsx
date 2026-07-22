import { useState } from "react";
import { totalBeds, hasLayout } from "../utils/wardLayouts";
import ShareWardSheet from "./ShareWardSheet";
import { PANEL, PRIMARY_BTN_SM, SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop, BACK_LINK } from "../utils/screenLayout";
import { TYPE_EYEBROW, TYPE_LINK, TYPE_TITLE, TYPE_UI } from "../utils/typography";

export default function WardManager({
  wardNames, wardLayouts, jobs, onEditWard, onDeleteWard, onBack,
}) {
  const [newWard, setNewWard] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareWard, setShareWard] = useState(null);

  const addAndEdit = () => {
    const trimmed = newWard.trim();
    if (!trimmed) return;
    onEditWard(trimmed);
    setNewWard("");
  };

  const jobCount = (ward) => jobs.filter((j) => j.ward === ward).length;

  const confirmRemove = (ward) => {
    onDeleteWard(ward);
    setConfirmDelete(null);
  };

  return (
    <div className={`${SCREEN} px-5`}>
      <div className="shrink-0 flex items-center gap-3 mb-4" style={safeTop()}>
        <button type="button" onClick={onBack} className={BACK_LINK} aria-label="Back to home">
          ← Home
        </button>
        <div>
          <p className={`${TYPE_EYEBROW} mb-0.5`}>Manage wards</p>
          <div className={TYPE_TITLE}>Bed setup</div>
        </div>
      </div>

      <div className={`${SCREEN_SCROLL} flex flex-col gap-2 pb-3`}>
        {wardNames.length === 0 && (
          <div className={`${PANEL} p-5 text-center`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
              No wards yet. Add one below, or tag a job with a ward first.
            </p>
          </div>
        )}
        {wardNames.map((ward) => {
          const layout = wardLayouts[ward];
          const configured = Boolean(layout);
          const count = configured ? totalBeds(layout) : 0;
          const jobsOnWard = jobCount(ward);
          const confirming = confirmDelete === ward;

          return (
            <div key={ward} className={`${PANEL} p-4 min-w-0`}>
              <div className="flex items-start justify-between gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => { setConfirmDelete(null); onEditWard(ward); }}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="text-base font-semibold text-gray-900 dark:text-white truncate">{ward}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {configured ? (count > 0 ? `${count} beds` : "No beds") : "Not set up"}
                    {jobsOnWard > 0 && ` · ${jobsOnWard} job${jobsOnWard === 1 ? "" : "s"}`}
                  </div>
                </button>
                <div className="flex items-center gap-3 shrink-0">
                  {configured && count > 0 && (
                    <button
                      type="button"
                      onClick={() => setShareWard(ward)}
                      className={`${TYPE_LINK} text-gray-600 dark:text-gray-400`}
                    >
                      Share
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setConfirmDelete(null); onEditWard(ward); }}
                    className={`${TYPE_LINK} text-claude-700 dark:text-claude-400`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(confirming ? null : ward)}
                    className="text-sm font-semibold text-red-600 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {confirming && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-3">
                    Remove {ward}?
                    {jobsOnWard > 0
                      ? ` ${jobsOnWard} job${jobsOnWard === 1 ? "" : "s"} will lose their ward tag.`
                      : " Layout and bed notes for this ward will be deleted."}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className={`flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 ${TYPE_UI} text-gray-600 dark:text-gray-300`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmRemove(ward)}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"
                    >
                      Delete ward
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`${SCREEN_FOOTER} flex flex-col gap-2`} style={safeBottom()}>
        <div className="flex gap-2">
          <input
            value={newWard}
            onChange={(e) => setNewWard(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAndEdit()}
            placeholder="New ward name"
            className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
          />
          <button
            type="button"
            onClick={addAndEdit}
            disabled={!newWard.trim()}
            className={PRIMARY_BTN_SM}
          >
            Set up
          </button>
        </div>
      </div>

      {shareWard && hasLayout(wardLayouts, shareWard) && (
        <ShareWardSheet
          open={Boolean(shareWard)}
          wardName={shareWard}
          layout={wardLayouts[shareWard]}
          onClose={() => setShareWard(null)}
        />
      )}
    </div>
  );
}
