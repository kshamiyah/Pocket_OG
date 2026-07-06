import { useEffect, useMemo, useRef, useState } from "react";
import { STARTER_PHRASES } from "../utils/constants";
import { hasWardLayout } from "../utils/wardLayouts";
import { parseJobInput } from "../utils/parseJob";
import { pushMRU } from "../utils/portfolios";

const WARD_CHIP = "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";
const WARD_CHIP_ON = "bg-amber-600 text-white border-amber-600";
const WARD_CHIP_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const PHRASE_CHIP = "shrink-0 max-w-[14rem] truncate px-3 py-1.5 rounded-lg text-xs font-semibold border bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 active:scale-95 transition-transform";

export default function QuickCapture({
  jobs,
  recentWards,
  setRecentWards,
  recentPhrases,
  wardLayouts,
  onRequestWardSetup,
  stickyUrgent,
  onToggleUrgent,
  onAdd,
}) {
  const [stickyWard, setStickyWard] = useState(recentWards[0] || "");
  const [stickyBed, setStickyBed] = useState("");
  const [text, setText] = useState("");
  const [customWard, setCustomWard] = useState("");
  const [showWardInput, setShowWardInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const phrasePool = useMemo(() => {
    if (recentPhrases.length > 0) return recentPhrases;
    if (jobs.length === 0) return STARTER_PHRASES;
    return [];
  }, [recentPhrases, jobs.length]);

  const phraseSuggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return phrasePool.slice(0, 6);
    return phrasePool
      .filter((p) => p.toLowerCase().includes(q) && p.toLowerCase() !== q)
      .slice(0, 4);
  }, [text, phrasePool]);

  const commitWard = (ward) => {
    const trimmed = ward.trim();
    if (!trimmed) return;
    if (!hasWardLayout(wardLayouts, trimmed)) {
      onRequestWardSetup(trimmed);
      setCustomWard("");
      setShowWardInput(false);
      return;
    }
    setStickyWard(trimmed);
    setRecentWards(pushMRU(recentWards, trimmed));
    setCustomWard("");
    setShowWardInput(false);
    inputRef.current?.focus();
  };

  const submit = (rawText) => {
    const parsed = parseJobInput(rawText, { stickyWard, stickyBed });
    if (!parsed?.text) return;
    onAdd({
      ward: parsed.ward,
      bed: parsed.bed,
      text: parsed.text,
      urgent: stickyUrgent,
    });
    if (parsed.ward) {
      setStickyWard(parsed.ward);
      setRecentWards(pushMRU(recentWards, parsed.ward));
    }
    if (parsed.bed) setStickyBed(parsed.bed);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 items-center">
        {recentWards.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setStickyWard(stickyWard === w ? "" : w)}
            className={`${WARD_CHIP} ${stickyWard === w ? WARD_CHIP_ON : WARD_CHIP_OFF}`}
          >
            {w}
          </button>
        ))}
        {showWardInput ? (
          <input
            type="text"
            value={customWard}
            onChange={(e) => setCustomWard(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitWard(customWard);
              if (e.key === "Escape") setShowWardInput(false);
            }}
            onBlur={() => {
              if (customWard.trim()) commitWard(customWard);
              else setShowWardInput(false);
            }}
            autoFocus
            placeholder="Ward"
            className="shrink-0 w-24 bg-gray-100 dark:bg-gray-900 border border-amber-400 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none"
          />
        ) : (
          <button type="button" onClick={() => setShowWardInput(true)} className={`${WARD_CHIP} ${WARD_CHIP_OFF}`}>
            + Ward
          </button>
        )}
        {stickyBed && (
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 px-1.5">
            Bed {stickyBed}
          </span>
        )}
        {stickyBed && (
          <button type="button" onClick={() => setStickyBed("")} className="text-[10px] font-bold text-gray-400">
            Clear bed
          </button>
        )}
      </div>

      {phraseSuggestions.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {phraseSuggestions.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => submit(stickyBed ? `${stickyBed} ${phrase}` : phrase)}
              className={PHRASE_CHIP}
            >
              {phrase}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit(text);
            }
          }}
          enterKeyHint="next"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="12 CTG · LR4/12 bloods · Antenatal: glucose"
          className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
        />
        <button
          type="button"
          onClick={onToggleUrgent}
          aria-label="Toggle urgent"
          aria-pressed={stickyUrgent}
          className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold ${
            stickyUrgent ? "bg-red-600 text-white border-red-600" : "bg-gray-100 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-800"
          }`}
        >
          !
        </button>
        <button
          type="button"
          onClick={() => submit(text)}
          disabled={!text.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 font-bold"
        >
          +
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-600">
        Shorthand: <span className="font-mono">12 CTG</span>, <span className="font-mono">LR4/12 bloods</span>. Names are stripped from the QR.
      </p>
    </div>
  );
}
