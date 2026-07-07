import { useState } from "react";
import { ROLES, ROLE_OTHER_KEY } from "../utils/constants";
import { SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

const ROLE_BTN = "py-2 rounded-xl border text-center text-sm font-bold active:scale-[0.98] transition-all";
const ROLE_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const ROLE_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800";
const FIELD = "w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";

export default function PortfolioSetup({ initialProfile, editMode = false, onComplete, onCancel }) {
  const [name, setName] = useState(initialProfile?.name || "");
  const [role, setRole] = useState(initialProfile?.role || null);
  const [roleLabel, setRoleLabel] = useState(initialProfile?.roleLabel || "");
  const [showOther, setShowOther] = useState(initialProfile?.role === ROLE_OTHER_KEY);

  const trimmedName = name.trim();
  const otherValid = !showOther || roleLabel.trim().length > 0;
  const canSubmit = trimmedName.length > 0 && role && otherValid;

  const pickRole = (key) => {
    if (key === ROLE_OTHER_KEY) {
      setShowOther(true);
      setRole(ROLE_OTHER_KEY);
      return;
    }
    setShowOther(false);
    setRoleLabel("");
    setRole(key);
  };

  const submit = () => {
    if (!canSubmit) return;
    onComplete({
      name: trimmedName,
      role,
      ...(role === ROLE_OTHER_KEY ? { roleLabel: roleLabel.trim() } : {}),
    });
  };

  return (
    <div className={`${SCREEN} px-6`}>
      <div className={`${SCREEN_SCROLL} pb-3`} style={safeTop()}>
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight mb-1">
          {editMode ? "Your profile" : "Set up this phone"}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {editMode
            ? "Stored on this device only. Use a first name, not a patient identifier."
            : "One-time. This device is yours from here on."}
        </p>

        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1.5 block">
          Your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          placeholder="First name is enough"
          className={`${FIELD} mb-4`}
        />

        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1.5">Your role</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => pickRole(r.key)}
              className={`${ROLE_BTN} ${role === r.key && !showOther ? ROLE_ON : ROLE_OFF}`}
            >
              {r.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => pickRole(ROLE_OTHER_KEY)}
            className={`${ROLE_BTN} ${showOther ? ROLE_ON : ROLE_OFF}`}
          >
            Other
          </button>
        </div>

        {showOther && (
          <input
            type="text"
            value={roleLabel}
            onChange={(e) => setRoleLabel(e.target.value)}
            placeholder="e.g. ODP, Band 6"
            className={`${FIELD} mt-2`}
          />
        )}
      </div>

      <div className={`${SCREEN_FOOTER} flex flex-col gap-2`} style={safeBottom()}>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white dark:text-gray-950 disabled:text-gray-400 text-base font-bold active:scale-[0.98] transition-all"
        >
          {editMode ? "Save" : "Continue"}
        </button>
        {editMode && onCancel && (
          <button type="button" onClick={onCancel} className="w-full py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
