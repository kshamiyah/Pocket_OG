import { useMemo, useState } from "react";
import {
  SECTION_TYPE, GRID_KIND, nextSectionId, rangeBeds, gridBeds,
  namedBeds, bedsForSection, parseCustomNums,
} from "../utils/wardLayouts";
import { OVERLAY_SCREEN, SCREEN_FOOTER, SCREEN_SCROLL, safeBottom, safeTop } from "../utils/screenLayout";

const CHIP = "px-2.5 py-1.5 rounded-lg text-sm font-bold border";
const PILL = "px-2.5 py-1.5 rounded-md text-sm font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
// text-base (16px), not text-sm — anything smaller triggers iOS/Android's
// auto-zoom-on-focus, which is the "why does it zoom in" complaint.
const FIELD = "w-full min-w-0 box-border bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";
const FIELD_SPLIT = `${FIELD} min-w-0 flex-1 basis-0`;
const ROW = "flex gap-2 w-full min-w-0";
const FORM = "flex flex-col gap-3 min-w-0 w-full";
const PILL_WRAP = "flex flex-wrap gap-1.5 min-w-0 w-full";
const ADD_FORM_WRAP = "rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-4 mb-4 min-w-0 w-full";

const TOGGLE_ON = "bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white";
const TOGGLE_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";

const LETTER_BAY_PRESETS = ["A,B,C,D", "A,B,C,D,E", "A,B,C,D,E,F"];
const NUMBER_BAY_PRESETS = ["1,2,3,4", "1,2,3,4,5", "1,2,3,4,5,6"];

function initRangeState(section) {
  if (!section) {
    return { prefix: "", mode: "range", from: "1", to: "12", customInput: "1,4,6,19" };
  }
  if (section.custom?.length) {
    return {
      prefix: section.prefix || "",
      mode: "custom",
      from: "1",
      to: "12",
      customInput: section.custom.join(","),
    };
  }
  return {
    prefix: section.prefix || "",
    mode: "range",
    from: String(section.from ?? 1),
    to: String(section.to ?? 12),
    customInput: "1,4,6,19",
  };
}

function initGridState(section) {
  if (!section) {
    return {
      bayKind: GRID_KIND.LETTER,
      bedKind: GRID_KIND.NUMBER,
      baysInput: "A,B,C,D",
      perBay: "4",
      bayOverrides: {},
      customBays: false,
    };
  }
  const bayKind = section.bayKind ?? GRID_KIND.LETTER;
  const bays = section.bays ?? [];
  const baysInput = bays.length ? bays.join(",") : (bayKind === GRID_KIND.NUMBER ? "1,2,3,4" : "A,B,C,D");
  const presets = bayKind === GRID_KIND.NUMBER ? NUMBER_BAY_PRESETS : LETTER_BAY_PRESETS;
  const perBay = String(section.perBay ?? 4);
  const bayOverrides = {};
  if (section.bayCounts) {
    for (const bay of bays) {
      const n = section.bayCounts[bay];
      if (n != null && n !== Number(perBay)) bayOverrides[bay] = String(n);
    }
  }
  return {
    bayKind,
    bedKind: section.bedKind ?? GRID_KIND.NUMBER,
    baysInput,
    perBay,
    bayOverrides,
    customBays: !presets.includes(baysInput),
  };
}

function RangeForm({ initialSection, onSave, onCancel }) {
  const init = initRangeState(initialSection);
  const [prefix, setPrefix] = useState(init.prefix);
  const [mode, setMode] = useState(init.mode);
  const [from, setFrom] = useState(init.from);
  const [to, setTo] = useState(init.to);
  const [customInput, setCustomInput] = useState(init.customInput);
  const editing = Boolean(initialSection);

  const preview = useMemo(() => {
    if (mode === "custom") {
      const custom = parseCustomNums(customInput);
      return rangeBeds({ prefix, custom });
    }
    return rangeBeds({ prefix, from: Number(from), to: Number(to) });
  }, [mode, prefix, from, to, customInput]);

  const saveSection = () => {
    if (preview.length === 0) return;
    const base = { id: initialSection?.id ?? nextSectionId(), type: SECTION_TYPE.RANGE, prefix };
    if (mode === "custom") {
      onSave({ ...base, custom: parseCustomNums(customInput) });
    } else {
      onSave({ ...base, from: Number(from), to: Number(to) });
    }
  };

  return (
    <div className={FORM}>
      <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix (optional), e.g. SR" className={FIELD} />

      <div className="min-w-0 w-full">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Room numbers</p>
        <div className={`${ROW} mb-3`}>
          <button
            type="button"
            onClick={() => setMode("range")}
            className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-bold border transition-colors ${mode === "range" ? TOGGLE_ON : TOGGLE_OFF}`}
          >
            Range
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-bold border transition-colors ${mode === "custom" ? TOGGLE_ON : TOGGLE_OFF}`}
          >
            Custom
          </button>
        </div>

        {mode === "range" ? (
          <div className={ROW}>
            <input type="number" inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" className={FIELD_SPLIT} />
            <input type="number" inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" className={FIELD_SPLIT} />
          </div>
        ) : (
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 1,4,6,19"
            className={FIELD}
          />
        )}
      </div>

      {preview.length > 0 && (
        <div className={PILL_WRAP}>
          {preview.map((b) => <span key={b} className={PILL}>{b}</span>)}
        </div>
      )}
      <div className={ROW}>
        <button onClick={onCancel} className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={saveSection}
          disabled={preview.length === 0}
          className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          {editing ? "Save section" : "Add section"}
        </button>
      </div>
    </div>
  );
}

function KindToggle({ label, hint, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-0.5">{label}</p>
      {hint && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{hint}</p>}
      <div className={ROW}>
        <button
          type="button"
          onClick={() => onChange(GRID_KIND.LETTER)}
          className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-bold border transition-colors ${value === GRID_KIND.LETTER ? TOGGLE_ON : TOGGLE_OFF}`}
        >
          Letters
        </button>
        <button
          type="button"
          onClick={() => onChange(GRID_KIND.NUMBER)}
          className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-bold border transition-colors ${value === GRID_KIND.NUMBER ? TOGGLE_ON : TOGGLE_OFF}`}
        >
          Numbers
        </button>
      </div>
    </div>
  );
}

function parseBayList(input, bayKind) {
  const parts = input.split(",").map((b) => b.trim()).filter(Boolean);
  if (bayKind === GRID_KIND.LETTER) {
    return [...new Set(parts.map((b) => b.toUpperCase()))];
  }
  return [...new Set(parts)];
}

function GridForm({ initialSection, onSave, onCancel }) {
  const init = initGridState(initialSection);
  const [bayKind, setBayKind] = useState(init.bayKind);
  const [bedKind, setBedKind] = useState(init.bedKind);
  const [baysInput, setBaysInput] = useState(init.baysInput);
  const [perBay, setPerBay] = useState(init.perBay);
  const [bayOverrides, setBayOverrides] = useState(init.bayOverrides);
  const [customBays, setCustomBays] = useState(init.customBays);
  const editing = Boolean(initialSection);

  const LETTER_BAY_PRESET_BTNS = [
    { label: "A–D", value: "A,B,C,D" },
    { label: "A–E", value: "A,B,C,D,E" },
    { label: "A–F", value: "A,B,C,D,E,F" },
  ];
  const NUMBER_BAY_PRESET_BTNS = [
    { label: "1–4", value: "1,2,3,4" },
    { label: "1–5", value: "1,2,3,4,5" },
    { label: "1–6", value: "1,2,3,4,5,6" },
  ];

  const bays = useMemo(() => parseBayList(baysInput, bayKind), [baysInput, bayKind]);

  const countsForDraft = useMemo(() => {
    const counts = {};
    for (const bay of bays) counts[bay] = Number(bayOverrides[bay] ?? perBay);
    return counts;
  }, [bays, bayOverrides, perBay]);

  const draftSection = useMemo(() => ({
    bayKind,
    bedKind,
    bays,
    perBay: Number(perBay),
    bayCounts: countsForDraft,
  }), [bayKind, bedKind, bays, perBay, countsForDraft]);

  const preview = useMemo(() => gridBeds(draftSection), [draftSection]);

  const applyPerBayToAll = () => setBayOverrides({});

  const bedCountForBayInput = (bay) => bayOverrides[bay] ?? perBay;

  const saveGridSection = () => {
    if (preview.length === 0) return;
    const defaultN = Number(perBay);
    const customCounts = {};
    let hasCustom = false;
    for (const bay of bays) {
      const n = Number(bedCountForBayInput(bay));
      customCounts[bay] = n;
      if (n !== defaultN) hasCustom = true;
    }
    onSave({
      id: initialSection?.id ?? nextSectionId(),
      type: SECTION_TYPE.GRID,
      bayKind,
      bedKind,
      bays,
      perBay: defaultN,
      ...(hasCustom ? { bayCounts: customCounts } : {}),
    });
  };

  const pickPreset = (value) => {
    setBaysInput(value);
    setCustomBays(false);
  };

  const onBayKindChange = (kind) => {
    setBayKind(kind);
    setCustomBays(false);
    setBaysInput(kind === GRID_KIND.NUMBER ? "1,2,3,4" : "A,B,C,D");
  };

  return (
    <div className={FORM}>
      <KindToggle
        label="Bays are labelled with"
        hint="Letters (A, B, C…) or numbers (1, 2, 3…)."
        value={bayKind}
        onChange={onBayKindChange}
      />

      {bayKind === GRID_KIND.LETTER ? (
        <div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Which bays?</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {LETTER_BAY_PRESET_BTNS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => pickPreset(p.value)}
                className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                  !customBays && baysInput === p.value
                    ? "bg-claude-600 text-white border-claude-600"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomBays(true)}
              className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                customBays
                  ? "bg-claude-600 text-white border-claude-600"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
              }`}
            >
              Custom
            </button>
          </div>
          {(customBays || !LETTER_BAY_PRESETS.includes(baysInput)) && (
            <input
              value={baysInput}
              onChange={(e) => { setBaysInput(e.target.value); setCustomBays(true); }}
              placeholder="e.g. A,B,C,D"
              className={FIELD}
            />
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Which bays?</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {NUMBER_BAY_PRESET_BTNS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => pickPreset(p.value)}
                className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                  !customBays && baysInput === p.value
                    ? "bg-claude-600 text-white border-claude-600"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomBays(true)}
              className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                customBays
                  ? "bg-claude-600 text-white border-claude-600"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
              }`}
            >
              Custom
            </button>
          </div>
          {(customBays || !NUMBER_BAY_PRESETS.includes(baysInput)) && (
            <input
              value={baysInput}
              onChange={(e) => { setBaysInput(e.target.value); setCustomBays(true); }}
              placeholder="e.g. 14,17,22 or 1,2,3,4"
              className={FIELD}
            />
          )}
        </div>
      )}

      <KindToggle
        label="Beds in each bay are labelled with"
        hint={bedKind === GRID_KIND.LETTER ? "Letters A, B, C… up to the count below." : "Numbers 1, 2, 3… up to the count below."}
        value={bedKind}
        onChange={setBedKind}
      />

      <div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Default beds per bay</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Most bays match this. Tweak individual bays below if one is different.</p>
        <div className={ROW}>
          <input
            type="number"
            inputMode="numeric"
            value={perBay}
            onChange={(e) => setPerBay(e.target.value)}
            placeholder="e.g. 4"
            className={FIELD_SPLIT}
          />
          <button
            type="button"
            onClick={applyPerBayToAll}
            disabled={bays.length === 0}
            className="shrink-0 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 disabled:text-gray-400"
          >
            Apply to all
          </button>
        </div>
      </div>

      {bays.length > 0 && (
        <div className="min-w-0 w-full">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Beds in each bay</p>
          <div className="flex flex-col gap-2">
            {bays.map((bay) => (
              <div key={bay} className={ROW}>
                <span className="w-10 shrink-0 text-sm font-bold text-gray-900 dark:text-white">{bay}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={bedCountForBayInput(bay)}
                  onChange={(e) => setBayOverrides((cur) => ({ ...cur, [bay]: e.target.value }))}
                  className={FIELD_SPLIT}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="min-w-0 w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Preview</p>
          <div className={PILL_WRAP}>
            {preview.map((b) => <span key={b} className={PILL}>{b}</span>)}
          </div>
        </div>
      )}

      <div className={ROW}>
        <button onClick={onCancel} className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={saveGridSection}
          disabled={preview.length === 0}
          className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          {editing ? "Save section" : "Add section"}
        </button>
      </div>
    </div>
  );
}

function NamedForm({ initialSection, onSave, onCancel }) {
  const [input, setInput] = useState("");
  const [items, setItems] = useState(() => initialSection?.items ?? []);
  const editing = Boolean(initialSection);

  const commit = () => {
    const next = namedBeds([...items, ...input.split(/[\n,;]+/)]);
    setItems(next);
    setInput("");
  };

  return (
    <div className={FORM}>
      <div className={ROW}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder="Room name… or paste a list"
          className={FIELD_SPLIT}
        />
        <button onClick={commit} className="shrink-0 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-sm font-bold">Add</button>
      </div>
      {items.length > 0 && (
        <div className={PILL_WRAP}>
          {items.map((b) => (
            <button key={b} onClick={() => setItems(items.filter((x) => x !== b))} className={PILL} title="Tap to remove">{b} ×</button>
          ))}
        </div>
      )}
      <div className={ROW}>
        <button onClick={onCancel} className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300">Cancel</button>
        <button
          onClick={() => items.length > 0 && onSave({ id: initialSection?.id ?? nextSectionId(), type: SECTION_TYPE.NAMED, items })}
          disabled={items.length === 0}
          className="min-w-0 flex-1 basis-0 py-2.5 rounded-xl bg-claude-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 text-sm font-bold"
        >
          {editing ? "Save section" : "Add section"}
        </button>
      </div>
    </div>
  );
}

const TYPE_LABEL = { [SECTION_TYPE.RANGE]: "Numbered range", [SECTION_TYPE.GRID]: "Bays & beds", [SECTION_TYPE.NAMED]: "Named rooms" };

export default function WardSetup({ wardName, existingLayout, onSave, onCancel }) {
  const [sections, setSections] = useState(existingLayout?.sections || []);
  const [draft, setDraft] = useState(null);

  const totalCount = sections.reduce((n, s) => n + bedsForSection(s).length, 0);

  const editingSection = draft?.sectionId
    ? sections.find((s) => s.id === draft.sectionId)
    : null;

  const saveSection = (section) => {
    setSections((cur) => (
      draft?.sectionId
        ? cur.map((s) => (s.id === draft.sectionId ? section : s))
        : [...cur, section]
    ));
    setDraft(null);
  };

  const removeSection = (id) => {
    setSections((cur) => cur.filter((s) => s.id !== id));
    if (draft?.sectionId === id) setDraft(null);
  };

  const cancelDraft = () => setDraft(null);

  const visibleSections = draft?.sectionId
    ? sections.filter((s) => s.id !== draft.sectionId)
    : sections;

  return (
    <div className={OVERLAY_SCREEN}>
      <div
        className={`${SCREEN_SCROLL} px-5 pb-3`}
        style={safeTop()}
      >
      <div className="flex items-center gap-3 mb-5 min-w-0">
        <button onClick={onCancel} className="text-gray-500 text-xl leading-none shrink-0" aria-label="Cancel">←</button>
        <div className="min-w-0">
          <div className="font-extrabold text-lg text-gray-900 dark:text-white">Set up {wardName}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">One-time, on this device. Add as many sections as this ward needs.</p>
        </div>
      </div>

      {visibleSections.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {visibleSections.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2.5 min-w-0">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="text-base font-bold text-gray-900 dark:text-white truncate">
                    {TYPE_LABEL[s.type]}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-600">{bedsForSection(s).length} beds</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => setDraft({ type: s.type, sectionId: s.id })} className="text-xs font-bold text-claude-700 dark:text-claude-400">
                    Edit
                  </button>
                  <button type="button" onClick={() => removeSection(s.id)} className="text-xs font-bold text-red-600 dark:text-red-400">
                    Remove
                  </button>
                </div>
              </div>
              <div className={`${PILL_WRAP} mt-2`}>
                {bedsForSection(s).map((b) => <span key={b} className={PILL}>{b}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!draft && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          <button type="button" onClick={() => setDraft({ type: SECTION_TYPE.RANGE })} className={`${CHIP} text-left px-4 py-3.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add numbered range
            <span className="block text-sm font-normal opacity-80 mt-1">Plain beds, e.g. 1–12, or a prefix like SR1–SR3</span>
          </button>
          <button type="button" onClick={() => setDraft({ type: SECTION_TYPE.GRID })} className={`${CHIP} text-left px-4 py-3.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add bays &amp; beds
            <span className="block text-sm font-normal opacity-80 mt-1">A grid of bays, each with beds. Bays and beds can each be letters or numbers.</span>
          </button>
          <button type="button" onClick={() => setDraft({ type: SECTION_TYPE.NAMED })} className={`${CHIP} text-left px-4 py-3.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800`}>
            + Add named rooms
            <span className="block text-sm font-normal opacity-80 mt-1">One-off rooms or slots that don't follow a pattern</span>
          </button>
        </div>
      )}

      {draft?.type === SECTION_TYPE.RANGE && (
        <div className={ADD_FORM_WRAP}>
          <p className="text-xs font-bold uppercase tracking-widest text-claude-600 mb-3">
            {editingSection ? "Edit numbered range" : "Add numbered range"}
          </p>
          <RangeForm
            key={draft.sectionId ?? "new-range"}
            initialSection={editingSection}
            onSave={saveSection}
            onCancel={cancelDraft}
          />
        </div>
      )}
      {draft?.type === SECTION_TYPE.GRID && (
        <div className={ADD_FORM_WRAP}>
          <p className="text-xs font-bold uppercase tracking-widest text-claude-600 mb-3">
            {editingSection ? "Edit bays & beds" : "Add bays & beds"}
          </p>
          <GridForm
            key={draft.sectionId ?? "new-grid"}
            initialSection={editingSection}
            onSave={saveSection}
            onCancel={cancelDraft}
          />
        </div>
      )}
      {draft?.type === SECTION_TYPE.NAMED && (
        <div className={ADD_FORM_WRAP}>
          <p className="text-xs font-bold uppercase tracking-widest text-claude-600 mb-3">
            {editingSection ? "Edit named rooms" : "Add named rooms"}
          </p>
          <NamedForm
            key={draft.sectionId ?? "new-named"}
            initialSection={editingSection}
            onSave={saveSection}
            onCancel={cancelDraft}
          />
        </div>
      )}
      </div>

      <div className={`${SCREEN_FOOTER} px-5 flex flex-col gap-2`} style={safeBottom()}>
        {sections.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-600 text-center mb-1">
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
