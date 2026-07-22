import { useMemo, useState } from "react";
import { layoutBedSections, bedsForWard } from "../utils/wardLayouts";
import { SELECTED_CHIP } from "../utils/screenLayout";
import { TYPE_LINK, TYPE_OVERLINE } from "../utils/typography";

const BED_BTN =
  "min-w-0 px-2 py-2 rounded-lg text-xs font-semibold border transition-colors truncate text-center active:scale-[0.98]";
const BED_ON = SELECTED_CHIP;
const BED_OFF = "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";

function NewBedEntry({ onCommit }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${BED_BTN} ${BED_OFF} border-dashed col-span-3`}
      >
        + new bed
      </button>
    );
  }

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed) onCommit(trimmed);
    setValue("");
    setOpen(false);
  };

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      onBlur={commit}
      placeholder="Bed / room"
      className="col-span-3 w-full box-border bg-white dark:bg-gray-950 border border-claude-400 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
    />
  );
}

function BedGrid({ beds, selectedBed, onSelect }) {
  if (beds.length === 0) return null;
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {beds.map((bed) => (
        <button
          key={bed}
          type="button"
          onClick={() => onSelect(bed)}
          className={`${BED_BTN} ${selectedBed === bed ? BED_ON : BED_OFF}`}
        >
          {bed}
        </button>
      ))}
    </div>
  );
}

export default function BedPickerPanel({
  ward,
  wardLayouts,
  recentBeds,
  selectedBed,
  onSelect,
  onClear,
  onSetupWard,
  configured,
  embedded = false,
}) {
  const { sections, extras } = useMemo(
    () => layoutBedSections(ward, wardLayouts, recentBeds),
    [ward, wardLayouts, recentBeds],
  );

  const flatBeds = useMemo(
    () => bedsForWard(ward, wardLayouts, recentBeds),
    [ward, wardLayouts, recentBeds],
  );

  const useGrouped = configured && sections.length > 0;

  return (
    <div className={`flex flex-col gap-3 pr-0.5 ${embedded ? "min-h-0" : "mt-2 max-h-52 overflow-y-auto overscroll-y-contain touch-pan-y"}`}>
      {useGrouped ? (
        <>
          {sections.map((section) => (
            <div key={section.id}>
              <p className={`${TYPE_OVERLINE} mb-1.5`}>
                {section.title}
              </p>
              <BedGrid beds={section.beds} selectedBed={selectedBed} onSelect={onSelect} />
            </div>
          ))}
          {extras.length > 0 && (
            <div>
              <p className={`${TYPE_OVERLINE} mb-1.5`}>
                Other
              </p>
              <BedGrid beds={extras} selectedBed={selectedBed} onSelect={onSelect} />
            </div>
          )}
        </>
      ) : (
        <BedGrid beds={flatBeds} selectedBed={selectedBed} onSelect={onSelect} />
      )}

      {configured && sections.length === 0 && flatBeds.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No beds set up for this ward yet.
        </p>
      )}

      <NewBedEntry onCommit={onSelect} />

      <div className="flex flex-wrap gap-2 pt-0.5">
        {selectedBed && (
          <button type="button" onClick={onClear} className={`${BED_BTN} ${BED_OFF} px-3`}>
            No bed
          </button>
        )}
        <button
          type="button"
          onClick={onSetupWard}
          className={`${TYPE_LINK} text-xs text-claude-700 dark:text-claude-400 py-1`}
        >
          {configured ? "Edit beds for this ward" : "Set up beds for this ward"}
        </button>
      </div>
    </div>
  );
}
