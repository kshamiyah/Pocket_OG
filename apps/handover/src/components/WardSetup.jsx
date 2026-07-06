import { useMemo, useState } from "react";
import { WARD_LAYOUT_KIND } from "../utils/constants";
import { numberedBeds, parseNamedBeds } from "../utils/wardLayouts";

function initialNumberedRange(existingLayout) {
  if (existingLayout?.kind !== WARD_LAYOUT_KIND.NUMBERED || !existingLayout.beds?.length) {
    return { from: "1", to: "12" };
  }
  const nums = existingLayout.beds.map(Number).filter(Number.isFinite);
  if (nums.length === 0) return { from: "1", to: "12" };
  return { from: String(Math.min(...nums)), to: String(Math.max(...nums)) };
}

const CHIP = "py-3 rounded-xl text-sm font-bold border transition-colors";
const CHIP_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const PREVIEW_CHIP = "px-2.5 py-1 rounded-md text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";

export default function WardSetup({ wardName, existingLayout, onSave, onCancel }) {
  const numberedDefaults = initialNumberedRange(existingLayout);
  const [kind, setKind] = useState(existingLayout?.kind ?? WARD_LAYOUT_KIND.NUMBERED);
  const [from, setFrom] = useState(numberedDefaults.from);
  const [to, setTo] = useState(numberedDefaults.to);
  const [namedInput, setNamedInput] = useState("");
  const [namedBeds, setNamedBeds] = useState(existingLayout?.kind === WARD_LAYOUT_KIND.NAMED ? existingLayout.beds : []);
  const [error, setError] = useState("");

  const numberedPreview = useMemo(() => {
    const f = Number(from);
    const t = Number(to);
    if (!Number.isFinite(f) || !Number.isFinite(t)) return [];
    return numberedBeds(f, t) || [];
  }, [from, to]);

  const previewBeds = kind === WARD_LAYOUT_KIND.NUMBERED
    ? numberedPreview
    : kind === WARD_LAYOUT_KIND.NAMED
      ? namedBeds
      : [];

  const addNamed = () => {
    const next = parseNamedBeds(namedInput);
    if (next.length === 0) return;
    setNamedBeds((cur) => [...new Set([...cur, ...next])]);
    setNamedInput("");
    setError("");
  };

  const removeNamed = (bed) => setNamedBeds((cur) => cur.filter((b) => b !== bed));

  const save = () => {
    if (kind === WARD_LAYOUT_KIND.NONE) {
      onSave({ kind: WARD_LAYOUT_KIND.NONE, beds: [] });
      return;
    }
    if (kind === WARD_LAYOUT_KIND.NUMBERED) {
      const beds = numberedBeds(Number(from), Number(to));
      if (!beds?.length) {
        setError("Pick a range between 1 and 40 beds.");
        return;
      }
      onSave({ kind: WARD_LAYOUT_KIND.NUMBERED, beds });
      return;
    }
    if (namedBeds.length === 0) {
      setError("Add at least one bed, room or slot.");
      return;
    }
    onSave({ kind: WARD_LAYOUT_KIND.NAMED, beds: namedBeds });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col px-5 overflow-y-auto"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={onCancel} className="text-gray-500 text-xl leading-none" aria-label="Cancel">
          ←
        </button>
        <div>
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">
            Set up {wardName}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Saved on this device for your portfolio. You only do this once per ward.
          </p>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">How are beds labelled here?</p>
      <div className="grid grid-cols-1 gap-2 mb-5">
        <button type="button" onClick={() => setKind(WARD_LAYOUT_KIND.NUMBERED)} className={`${CHIP} text-left px-4 ${kind === WARD_LAYOUT_KIND.NUMBERED ? CHIP_ON : CHIP_OFF}`}>
          Numbered beds
          <span className="block text-xs font-normal opacity-80 mt-0.5">e.g. 1–12 on a postnatal ward</span>
        </button>
        <button type="button" onClick={() => setKind(WARD_LAYOUT_KIND.NAMED)} className={`${CHIP} text-left px-4 ${kind === WARD_LAYOUT_KIND.NAMED ? CHIP_ON : CHIP_OFF}`}>
          Named rooms or bays
          <span className="block text-xs font-normal opacity-80 mt-0.5">e.g. Rm 1, Bay A, Suite</span>
        </button>
        <button type="button" onClick={() => setKind(WARD_LAYOUT_KIND.NONE)} className={`${CHIP} text-left px-4 ${kind === WARD_LAYOUT_KIND.NONE ? CHIP_ON : CHIP_OFF}`}>
          No beds
          <span className="block text-xs font-normal opacity-80 mt-0.5">Theatre, clinic, or ward-level tasks only</span>
        </button>
      </div>

      {kind === WARD_LAYOUT_KIND.NUMBERED && (
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <label className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">From</span>
              <input
                type="number"
                min={1}
                max={99}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </label>
            <label className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">To</span>
              <input
                type="number"
                min={1}
                max={99}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </label>
          </div>
        </div>
      )}

      {kind === WARD_LAYOUT_KIND.NAMED && (
        <div className="mb-5">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={namedInput}
              onChange={(e) => setNamedInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNamed()}
              placeholder="Rm 1, Bay A… or paste a list"
              className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <button type="button" onClick={addNamed} className="shrink-0 px-4 rounded-xl bg-amber-600 text-white text-sm font-bold">
              Add
            </button>
          </div>
          {namedBeds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {namedBeds.map((bed) => (
                <button key={bed} type="button" onClick={() => removeNamed(bed)} className={PREVIEW_CHIP} title="Tap to remove">
                  {bed} ×
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {previewBeds.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600 mb-2">Preview</div>
          <div className="flex flex-wrap gap-1.5">
            {previewBeds.map((bed) => (
              <span key={bed} className={PREVIEW_CHIP}>{bed}</span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}

      <div className="mt-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={save}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-[0.98] transition-all"
        >
          Save layout
        </button>
        <button type="button" onClick={onCancel} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
}
