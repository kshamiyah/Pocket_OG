import { useEffect, useRef, useState } from "react";
import { BED_NOTE_MAX } from "../utils/bedNotes";

export default function BedNote({ value = "", onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const areaRef = useRef(null);

  const startEdit = () => {
    setDraft(value);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const el = areaRef.current;
    if (!el) return undefined;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
    return undefined;
  }, [open]);

  const save = () => {
    onChange?.(draft);
    setOpen(false);
  };

  const cancel = () => {
    setOpen(false);
  };

  if (open) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-3 py-2.5">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">
            Note
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-600">
            Stays on this phone · not handed over
          </span>
        </div>
        <textarea
          ref={areaRef}
          value={draft}
          maxLength={BED_NOTE_MAX}
          rows={3}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Context for you only…"
          className="w-full resize-none bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500"
        />
        <div className="flex items-center justify-between gap-2 mt-2">
          <span className="text-[10px] tabular-nums text-gray-400 dark:text-gray-600">
            {draft.length}/{BED_NOTE_MAX}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancel}
              className="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="px-3 py-1.5 rounded-lg bg-claude-600 text-white text-xs font-bold active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (value) {
    return (
      <button
        type="button"
        onClick={startEdit}
        className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-3 py-2.5 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-600">
            Note
          </span>
          <span className="text-[10px] font-bold text-claude-700 dark:text-claude-400">Edit</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug line-clamp-2 whitespace-pre-wrap">
          {value}
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className="self-start text-xs font-bold text-gray-400 dark:text-gray-500 px-0.5 py-1"
    >
      + Add a note
    </button>
  );
}
