import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  SECTION_TYPE, GRID_KIND, nextSectionId, rangeBeds, gridBeds,
  namedBeds, bedsForSection, parseCustomNums,
} from "../utils/wardLayouts";
import {
  BACK_LINK, OVERLAY_SCREEN, PANEL, PRIMARY_BTN, PRIMARY_BTN_SM,
  SCREEN_FOOTER, SCREEN_SCROLL, SELECTED_CHIP, safeBottom, safeTop,
} from "../utils/screenLayout";
import {
  TYPE_DISPLAY, TYPE_EYEBROW_MB1, TYPE_EYEBROW_MB2, TYPE_EYEBROW_MB4, TYPE_SECTION_MB2, TYPE_TITLE,
} from "../utils/typography";

const PILL = "px-2.5 py-1.5 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
const FIELD = "w-full min-w-0 box-border bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-claude-500/30 focus:border-claude-500";
const FIELD_SPLIT = `${FIELD} min-w-0 flex-1 basis-0`;
const ROW = "flex gap-2 w-full min-w-0";
const FORM = "flex flex-col gap-4 min-w-0 w-full";
const TOGGLE_ON = SELECTED_CHIP;
const TOGGLE_OFF = "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const PRESET_OFF = "bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
const TYPE_TILE = "w-full text-left rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 active:scale-[0.99] transition-transform";

const LETTER_BAY_PRESETS = ["A,B,C,D", "A,B,C,D,E", "A,B,C,D,E,F"];
const NUMBER_BAY_PRESETS = ["1,2,3,4", "1,2,3,4,5", "1,2,3,4,5,6"];

const TYPE_LABEL = {
  [SECTION_TYPE.RANGE]: "Numbered range",
  [SECTION_TYPE.GRID]: "Bays & beds",
  [SECTION_TYPE.NAMED]: "Named rooms",
};

const TYPE_TILES = [
  {
    type: SECTION_TYPE.RANGE,
    title: "Add numbered range",
    body: "Plain beds, e.g. 1–12, or a prefix like SR1–SR3",
  },
  {
    type: SECTION_TYPE.GRID,
    title: "Add bays & beds",
    body: "Bays A–D with numbered or lettered beds in each",
  },
  {
    type: SECTION_TYPE.NAMED,
    title: "Add named rooms",
    body: "One-off rooms that do not follow a pattern",
  },
];

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

function previewSample(beds, max = 4) {
  if (beds.length === 0) return "";
  const head = beds.slice(0, max).join(", ");
  const rest = beds.length - max;
  return rest > 0 ? `${head} +${rest} more` : head;
}

function BedPreviewSummary({ beds }) {
  const [open, setOpen] = useState(false);
  if (beds.length === 0) return null;

  return (
    <div className={`${PANEL} p-3 min-w-0`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{beds.length} beds</span>
          {!open && beds.length > 0 && (
            <span className="block mt-0.5 tabular-nums">{previewSample(beds)}</span>
          )}
        </p>
        {beds.length > 4 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 text-xs font-bold text-claude-700 dark:text-claude-400"
          >
            {open ? "Hide" : "Show all"}
          </button>
        )}
      </div>
      {open && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {beds.map((b) => <span key={b} className={PILL}>{b}</span>)}
        </div>
      )}
    </div>
  );
}

const RangeForm = forwardRef(function RangeForm({ initialSection }, ref) {
  const init = initRangeState(initialSection);
  const [prefix, setPrefix] = useState(init.prefix);
  const [mode, setMode] = useState(init.mode);
  const [from, setFrom] = useState(init.from);
  const [to, setTo] = useState(init.to);
  const [customInput, setCustomInput] = useState(init.customInput);

  const preview = useMemo(() => {
    if (mode === "custom") {
      return rangeBeds({ prefix, custom: parseCustomNums(customInput) });
    }
    return rangeBeds({ prefix, from: Number(from), to: Number(to) });
  }, [mode, prefix, from, to, customInput]);

  useImperativeHandle(ref, () => ({
    buildSection() {
      if (preview.length === 0) return null;
      const base = { id: initialSection?.id ?? nextSectionId(), type: SECTION_TYPE.RANGE, prefix };
      if (mode === "custom") {
        return { ...base, custom: parseCustomNums(customInput) };
      }
      return { ...base, from: Number(from), to: Number(to) };
    },
    previewCount: preview.length,
  }), [preview, mode, prefix, customInput, from, to, initialSection]);

  return (
    <div className={FORM}>
      <div>
        <p className={TYPE_SECTION_MB2}>Optional prefix</p>
        <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. SR" className={FIELD} />
      </div>

      <div className="min-w-0 w-full">
        <p className={TYPE_SECTION_MB2}>Room numbers</p>
        <div className={`${ROW} mb-3`}>
          <button
            type="button"
            onClick={() => setMode("range")}
            className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${mode === "range" ? TOGGLE_ON : TOGGLE_OFF}`}
          >
            Range
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${mode === "custom" ? TOGGLE_ON : TOGGLE_OFF}`}
          >
            Custom list
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

      <BedPreviewSummary beds={preview} />
    </div>
  );
});

function KindToggle({ label, value, onChange }) {
  return (
    <div>
      <p className={TYPE_SECTION_MB2}>{label}</p>
      <div className={ROW}>
        <button
          type="button"
          onClick={() => onChange(GRID_KIND.LETTER)}
          className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${value === GRID_KIND.LETTER ? TOGGLE_ON : TOGGLE_OFF}`}
        >
          Letters
        </button>
        <button
          type="button"
          onClick={() => onChange(GRID_KIND.NUMBER)}
          className={`min-w-0 flex-1 basis-0 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${value === GRID_KIND.NUMBER ? TOGGLE_ON : TOGGLE_OFF}`}
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

const GridForm = forwardRef(function GridForm({ initialSection }, ref) {
  const init = initGridState(initialSection);
  const [bayKind, setBayKind] = useState(init.bayKind);
  const [bedKind, setBedKind] = useState(init.bedKind);
  const [baysInput, setBaysInput] = useState(init.baysInput);
  const [perBay, setPerBay] = useState(init.perBay);
  const [bayOverrides, setBayOverrides] = useState(init.bayOverrides);
  const [customBays, setCustomBays] = useState(init.customBays);
  const [perBayOpen, setPerBayOpen] = useState(() => Object.keys(init.bayOverrides).length > 0);

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

  useImperativeHandle(ref, () => ({
    buildSection() {
      if (preview.length === 0) return null;
      const defaultN = Number(perBay);
      const customCounts = {};
      let hasCustom = false;
      for (const bay of bays) {
        const n = Number(bayOverrides[bay] ?? perBay);
        customCounts[bay] = n;
        if (n !== defaultN) hasCustom = true;
      }
      return {
        id: initialSection?.id ?? nextSectionId(),
        type: SECTION_TYPE.GRID,
        bayKind,
        bedKind,
        bays,
        perBay: defaultN,
        ...(hasCustom ? { bayCounts: customCounts } : {}),
      };
    },
    previewCount: preview.length,
  }), [preview, bayKind, bedKind, bays, perBay, bayOverrides, initialSection]);

  const bedCountForBayInput = (bay) => bayOverrides[bay] ?? perBay;

  const pickPreset = (value) => {
    setBaysInput(value);
    setCustomBays(false);
  };

  const onBayKindChange = (kind) => {
    setBayKind(kind);
    setCustomBays(false);
    setBaysInput(kind === GRID_KIND.NUMBER ? "1,2,3,4" : "A,B,C,D");
  };

  const presetBtns = bayKind === GRID_KIND.LETTER ? LETTER_BAY_PRESET_BTNS : NUMBER_BAY_PRESET_BTNS;
  const presetValues = bayKind === GRID_KIND.LETTER ? LETTER_BAY_PRESETS : NUMBER_BAY_PRESETS;

  return (
    <div className={FORM}>
      <KindToggle label="Bay labels" value={bayKind} onChange={onBayKindChange} />

      <div>
        <p className={TYPE_SECTION_MB2}>Which bays?</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetBtns.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => pickPreset(p.value)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                !customBays && baysInput === p.value ? TOGGLE_ON : PRESET_OFF
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomBays(true)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${customBays ? TOGGLE_ON : PRESET_OFF}`}
          >
            Custom
          </button>
        </div>
        {(customBays || !presetValues.includes(baysInput)) && (
          <input
            value={baysInput}
            onChange={(e) => { setBaysInput(e.target.value); setCustomBays(true); }}
            placeholder={bayKind === GRID_KIND.LETTER ? "e.g. A,B,C,D" : "e.g. 1,2,3,4"}
            className={FIELD}
          />
        )}
      </div>

      <KindToggle label="Bed labels" value={bedKind} onChange={setBedKind} />

      <div>
        <p className={TYPE_SECTION_MB2}>Beds per bay</p>
        <input
          type="number"
          inputMode="numeric"
          value={perBay}
          onChange={(e) => setPerBay(e.target.value)}
          placeholder="e.g. 4"
          className={FIELD}
        />
        {bays.length > 0 && (
          <button
            type="button"
            onClick={() => setPerBayOpen((v) => !v)}
            className="mt-2 text-sm font-semibold text-claude-700 dark:text-claude-400"
          >
            {perBayOpen ? "Hide per-bay overrides" : "Different count per bay"}
          </button>
        )}
      </div>

      {perBayOpen && bays.length > 0 && (
        <div className={`${PANEL} p-3 flex flex-col gap-2`}>
          {bays.map((bay) => (
            <div key={bay} className={ROW}>
              <span className="w-10 shrink-0 text-sm font-semibold text-gray-900 dark:text-white">{bay}</span>
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
      )}

      <BedPreviewSummary beds={preview} />
    </div>
  );
});

const NamedForm = forwardRef(function NamedForm({ initialSection }, ref) {
  const [input, setInput] = useState("");
  const [items, setItems] = useState(() => initialSection?.items ?? []);

  const commit = () => {
    const next = namedBeds([...items, ...input.split(/[\n,;]+/)]);
    setItems(next);
    setInput("");
  };

  useImperativeHandle(ref, () => ({
    buildSection() {
      if (items.length === 0) return null;
      return { id: initialSection?.id ?? nextSectionId(), type: SECTION_TYPE.NAMED, items };
    },
    previewCount: items.length,
  }), [items, initialSection]);

  return (
    <div className={FORM}>
      <div>
        <p className={TYPE_SECTION_MB2}>Room names</p>
        <div className={ROW}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            placeholder="Room name, or paste a list"
            className={FIELD_SPLIT}
          />
          <button type="button" onClick={commit} className={PRIMARY_BTN_SM}>Add</button>
        </div>
      </div>
      {items.length > 0 && (
        <div className={`${PANEL} p-3 flex flex-wrap gap-1.5`}>
          {items.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setItems(items.filter((x) => x !== b))}
              className={PILL}
              title="Tap to remove"
            >
              {b} ×
            </button>
          ))}
        </div>
      )}
      <BedPreviewSummary beds={items} />
    </div>
  );
});

function WizardHeader({ wardName, step, total, editing, onBack }) {
  const labels = editing
    ? ["Edit section", "Configure", "Confirm"]
    : ["Choose type", "Configure", "Confirm"];

  return (
    <div className="mb-5 min-w-0">
      <button type="button" onClick={onBack} className={`${BACK_LINK} mb-3`}>
        ← Back
      </button>
      <p className={TYPE_EYEBROW_MB1}>
        {step} of {total} · {labels[step - 1]}
      </p>
      <h1 className={TYPE_DISPLAY}>
        {step === 1 ? `Add a section · ${wardName}` : wardName}
      </h1>
    </div>
  );
}

function SectionRow({ section, expanded, onToggle, onEdit, onRemove }) {
  const beds = bedsForSection(section);
  return (
    <div className={`${PANEL} p-4 min-w-0`}>
      <div className="flex items-start justify-between gap-2 min-w-0">
        <button type="button" onClick={onToggle} className="min-w-0 text-left flex-1">
          <div className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {TYPE_LABEL[section.type]}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {beds.length} beds · {previewSample(beds, 3)}
          </div>
        </button>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={onEdit} className="text-sm font-semibold text-claude-700 dark:text-claude-400">
            Edit
          </button>
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-red-600 dark:text-red-400">
            Remove
          </button>
        </div>
      </div>
      {expanded && beds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          {beds.map((b) => <span key={b} className={PILL}>{b}</span>)}
        </div>
      )}
    </div>
  );
}

export default function WardSetup({ wardName, existingLayout, onSave, onCancel }) {
  const [sections, setSections] = useState(existingLayout?.sections || []);
  const [wizard, setWizard] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const formRef = useRef(null);

  const totalCount = sections.reduce((n, s) => n + bedsForSection(s).length, 0);
  const editingSection = wizard?.sectionId
    ? sections.find((s) => s.id === wizard.sectionId)
    : null;

  const saveSection = (section) => {
    setSections((cur) => (
      wizard?.sectionId
        ? cur.map((s) => (s.id === wizard.sectionId ? section : s))
        : [...cur, section]
    ));
    setWizard(null);
  };

  const removeSection = (id) => {
    setSections((cur) => cur.filter((s) => s.id !== id));
    if (wizard?.sectionId === id) setWizard(null);
    if (expandedSectionId === id) setExpandedSectionId(null);
  };

  const startWizard = (opts = {}) => {
    if (opts.sectionId) {
      const section = sections.find((s) => s.id === opts.sectionId);
      if (!section) return;
      setWizard({ step: 2, type: section.type, sectionId: opts.sectionId, pending: null });
      return;
    }
    setWizard({ step: opts.type ? 2 : 1, type: opts.type ?? null, sectionId: null, pending: null });
  };

  const wizardBack = () => {
    if (!wizard) return;
    if (wizard.step === 1 || (wizard.step === 2 && wizard.sectionId)) {
      setWizard(null);
      return;
    }
    if (wizard.step === 2) {
      setWizard({ ...wizard, step: 1, type: null, pending: null });
      return;
    }
    setWizard({ ...wizard, step: 2, pending: null });
  };

  const wizardContinue = () => {
    const built = formRef.current?.buildSection?.();
    if (!built) return;
    setWizard((w) => ({ ...w, step: 3, pending: built }));
  };

  const wizardConfirm = () => {
    if (!wizard?.pending) return;
    saveSection(wizard.pending);
  };

  const renderWizardForm = () => {
    if (wizard?.type === SECTION_TYPE.RANGE) {
      return (
        <RangeForm
          ref={formRef}
          key={wizard.sectionId ?? "new-range"}
          initialSection={editingSection}
        />
      );
    }
    if (wizard?.type === SECTION_TYPE.GRID) {
      return (
        <GridForm
          ref={formRef}
          key={wizard.sectionId ?? "new-grid"}
          initialSection={editingSection}
        />
      );
    }
    if (wizard?.type === SECTION_TYPE.NAMED) {
      return (
        <NamedForm
          ref={formRef}
          key={wizard.sectionId ?? "new-named"}
          initialSection={editingSection}
        />
      );
    }
    return null;
  };

  if (wizard) {
    const editing = Boolean(wizard.sectionId);
    const step = wizard.step;
    const pendingBeds = wizard.pending ? bedsForSection(wizard.pending).length : 0;

    return (
      <div className={OVERLAY_SCREEN}>
        <div className={`${SCREEN_SCROLL} px-5 pb-3`} style={safeTop()}>
          <WizardHeader
            wardName={wardName}
            step={step}
            total={3}
            editing={editing}
            onBack={wizardBack}
          />

          {step === 1 && (
            <div className="flex flex-col gap-2">
              {TYPE_TILES.map((tile) => (
                <button
                  key={tile.type}
                  type="button"
                  onClick={() => setWizard({ step: 2, type: tile.type, sectionId: null, pending: null })}
                  className={TYPE_TILE}
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{tile.title}</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">{tile.body}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className={`${PANEL} p-4`}>
              <p className={TYPE_EYEBROW_MB4}>
                {TYPE_LABEL[wizard.type]}
              </p>
              {renderWizardForm()}
            </div>
          )}

          {step === 3 && wizard.pending && (
            <div className={`${PANEL} p-5`}>
              <p className={TYPE_EYEBROW_MB2}>Ready to add</p>
              <h2 className={`${TYPE_TITLE} mb-1`}>
                {TYPE_LABEL[wizard.pending.type]}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {pendingBeds} beds on {wardName}
              </p>
              <BedPreviewSummary beds={bedsForSection(wizard.pending)} />
            </div>
          )}
        </div>

        {step > 1 && (
          <div className={`${SCREEN_FOOTER} px-5 flex flex-col gap-2`} style={safeBottom()}>
            {step === 2 && (
              <button type="button" onClick={wizardContinue} className={PRIMARY_BTN}>
                Continue
              </button>
            )}
            {step === 3 && (
              <button type="button" onClick={wizardConfirm} className={PRIMARY_BTN}>
                {editing ? "Save section" : "Add section"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={OVERLAY_SCREEN}>
      <div className={`${SCREEN_SCROLL} px-5 pb-3`} style={safeTop()}>
        <div className="mb-5 min-w-0">
          <button type="button" onClick={onCancel} className={`${BACK_LINK} mb-3`}>
            ← Back
          </button>
          <p className={TYPE_EYEBROW_MB1}>Ward layout</p>
          <h1 className={TYPE_DISPLAY}>
            Set up {wardName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
            Add bed sections for this ward. You can edit them later from Manage wards.
          </p>
        </div>

        {sections.length > 0 ? (
          <div className="flex flex-col gap-2 mb-4">
            {sections.map((s) => (
              <SectionRow
                key={s.id}
                section={s}
                expanded={expandedSectionId === s.id}
                onToggle={() => setExpandedSectionId((id) => (id === s.id ? null : s.id))}
                onEdit={() => startWizard({ sectionId: s.id })}
                onRemove={() => removeSection(s.id)}
              />
            ))}
          </div>
        ) : (
          <div className={`${PANEL} p-5 mb-4 text-center`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
              No sections yet. Add numbered beds, bays, or named rooms.
            </p>
          </div>
        )}

        <button type="button" onClick={() => startWizard()} className={`${PRIMARY_BTN} mb-2`}>
          Add section
        </button>
      </div>

      <div className={`${SCREEN_FOOTER} px-5 flex flex-col gap-2`} style={safeBottom()}>
        {sections.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
            Saving without sections means no beds on this ward.
          </p>
        )}
        <button type="button" onClick={() => onSave({ sections })} className={`${PRIMARY_BTN} active:scale-[0.98]`}>
          {totalCount > 0 ? `Save layout · ${totalCount} beds` : "Save layout"}
        </button>
        <button type="button" onClick={onCancel} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
}
