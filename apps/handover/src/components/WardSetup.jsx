import { useMemo, useState } from "react";
import {
  SECTION_TYPE, nextSectionId, rangeBeds, gridBeds, namedBeds, bedsForSection,
} from "../utils/wardLayouts";

const CHIP = "px-2.5 py-1.5 rounded-lg text-xs font-bold border";
const PILL = "px-2.5 py-1 rounded-md text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
// text-base (16px), not text-sm — anything smaller triggers iOS/Android's
// auto-zoom-on-focus, which is the "why does it zoom in" complaint.
const FIELD = "bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500";

function RangeForm({ onAdd, onCancel }) {
  const [label, setLabel] = useState("");
  const [prefix, setPrefix] = useState("");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("12");
  const preview = useMemo(
    () => rangeBeds({ prefix, from: Number(from), to: Number(to) }),
    [prefix, from, to]
  );

  return (
    <div className="flex flex-col gap-3">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional), e.g. Side rooms" className={FIELD} />
      <div className="flex gap-2">
        <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix, e.g. SR" className={`${FIELD} flex-1`} />
        <input type="number" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" className={`${FIELD} w-20`} />
        <input type="number" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" className={`${FIELD} w-20`} />
      </div>
      {preview.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {preview.map((b) => <span key={b} className={PILL}>{b}</span>)}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={() => preview.length > 0 && onAdd({ id: nextSectionId(), type: SECTION_TYPE.RANGE, label, prefix, from: Number(from), to: Number(to) })}
          disabled={preview.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Add section
        </button>
      </div>
    </div>
  );
}

function GridForm({ onAdd, onCancel }) {
  const [label, setLabel] = useState("");
  const [baysInput, setBaysInput] = useState("A,B,C,D");
  const [perBay, setPerBay] = useState("6");
  const bays = useMemo(
    () => [...new Set(baysInput.split(",").map((b) => b.trim()).filter(Boolean))],
    [baysInput]
  );
  const preview = useMemo(() => gridBeds({ bays, perBay: Number(perBay) }), [bays, perBay]);

  return (
    <div className="flex flex-col gap-3">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional), e.g. Bays" className={FIELD} />
      <div className="flex gap-2">
        <input value={baysInput} onChange={(e) => setBaysInput(e.target.value)} placeholder="Bay letters, e.g. A,B,C,D" className={`${FIELD} flex-1`} />
        <input type="number" value={perBay} onChange={(e) => setPerBay(e.target.value)} placeholder="Per bay" className={`${FIELD} w-24`} />
      </div>
      {preview.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {preview.map((b) => <span key={b} className={PILL}>{b}</span>)}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={() => preview.length > 0 && onAdd({ id: nextSectionId(), type: SECTION_TYPE.GRID, label, bays, perBay: Number(perBay) })}
          disabled={preview.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Add section
        </button>
      </div>
    </div>
  );
}

function NamedForm({ onAdd, onCancel }) {
  const [label, setLabel] = useState("");
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);

  const commit = () => {
    const next = namedBeds([...items, ...input.split(/[\n,;]+/)]);
    setItems(next);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-3">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional), e.g. Side rooms" className={FIELD} />
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder="Room name… or paste a list"
          className={`${FIELD} flex-1`}
        />
        <button onClick={commit} className="shrink-0 px-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-sm font-bold">Add</button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((b) => (
            <button key={b} onClick={() => setItems(items.filter((x) => x !== b))} className={PILL} title="Tap to remove">{b} ×</button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={() => items.length > 0 && onAdd({ id: nextSectionId(), type: SECTION_TYPE.NAMED, label, items })}
          disabled={items.length === 0}
          className="flex-1 py-2.5 rounded-xl bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          Add section
        </button>
      </div>
    </div>
  );
}

const TYPE_LABEL = { [SECTION_TYPE.RANGE]: "Numbered range", [SECTION_TYPE.GRID]: "Lettered bays", [SECTION_TYPE.NAMED]: "Named rooms" };

export default function WardSetup({ wardName, existingLayout, onSave, onCancel }) {
  const [sections, setSections] = useState(existingLayout?.sections || []);
  const [adding, setAdding] = useState(null);

  const totalCount = sections.reduce((n, s) => n + bedsForSection(s).length, 0);

  const addSection = (section) => { setSections((cur) => [...cur, section]); setAdding(null); };
  const removeSection = (id) => setSections((cur) => cur.filter((s) => s.id !== id));

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950 flex flex-col">
      <div
        className="flex-1 min-h-0 overflow-y-auto px-5"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.25rem)" }}
      >
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onCancel} className="text-gray-500 text-xl leading-none" aria-label="Cancel">←</button>
        <div>
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">Set up {wardName}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">One-time, on this device. Add as many sections as this ward needs.</p>
        </div>
      </div>

      {sections.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {sections.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {s.label || TYPE_LABEL[s.type]}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-600">{bedsForSection(s).length} beds</div>
                </div>
                <button onClick={() => removeSection(s.id)} className="text-xs font-bold text-red-600 dark:text-red-400 shrink-0">Remove</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {bedsForSection(s).map((b) => <span key={b} className={PILL}>{b}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {adding === null && (
        <div className="grid grid-cols-1 gap-2 mb-6">
          <button onClick={() => setAdding(SECTION_TYPE.RANGE)} className={`${CHIP} text-left px-4 py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add numbered range
            <span className="block text-xs font-normal opacity-80 mt-0.5">Plain beds, e.g. 1–12, or a prefix like SR1–SR3</span>
          </button>
          <button onClick={() => setAdding(SECTION_TYPE.GRID)} className={`${CHIP} text-left px-4 py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add lettered bays
            <span className="block text-xs font-normal opacity-80 mt-0.5">Bay letters × beds per bay, e.g. A–D with 6 each</span>
          </button>
          <button onClick={() => setAdding(SECTION_TYPE.NAMED)} className={`${CHIP} text-left px-4 py-3 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add named rooms
            <span className="block text-xs font-normal opacity-80 mt-0.5">One-off rooms or slots that don't follow a pattern</span>
          </button>
        </div>
      )}

      {adding === SECTION_TYPE.RANGE && <RangeForm onAdd={addSection} onCancel={() => setAdding(null)} />}
      {adding === SECTION_TYPE.GRID && <GridForm onAdd={addSection} onCancel={() => setAdding(null)} />}
      {adding === SECTION_TYPE.NAMED && <NamedForm onAdd={addSection} onCancel={() => setAdding(null)} />}
      </div>

      <div className="shrink-0 px-5 pt-3 flex flex-col gap-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        {sections.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mb-1">
            No sections added, saving now means "no beds on this ward."
          </p>
        )}
        <button
          onClick={() => onSave({ sections })}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold active:scale-[0.98] transition-all"
        >
          {totalCount > 0 ? `Save layout · ${totalCount} beds` : "Save — no beds for this ward"}
        </button>
        <button onClick={onCancel} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Cancel</button>
      </div>
    </div>
  );
}
