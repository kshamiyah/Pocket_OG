import { useState } from "react";
import { groupBedsBySection } from "../utils/wardLayouts";
import { bedRowTone, sectionCounts } from "../utils/bedDisplay";

function Chevron({ open }) {
  return <span className={`inline-block text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}>›</span>;
}

function CountBadge({ open, urgent }) {
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      {urgent > 0 && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="Has urgent jobs" />}
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{open}</span>
    </span>
  );
}

function bedLabel(bed) {
  return bed === null ? "General" : bed;
}

function BedTile({ bed, open, urgent, hasNote, onClick, compact }) {
  const tone = bedRowTone({ open, urgent });

  return (
    <button type="button" onClick={onClick} className={compact ? tone.tileCompact : tone.tile}>
      <span className={`flex items-center gap-1.5 min-w-0 ${tone.label}`}>
        <span className="truncate">{bedLabel(bed)}</span>
        {hasNote && (
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-claude-500" aria-label="Has a private note" />
        )}
      </span>
      {!tone.empty && <CountBadge open={open} urgent={urgent} />}
    </button>
  );
}

function BedSectionHeader({ title, open, onToggle, counts, collapsible }) {
  if (!collapsible) {
    return (
      <div className="sticky top-0 z-10 pt-2 pb-1 -mx-1 px-1 bg-gradient-to-b from-white from-70% to-transparent dark:from-gray-950 dark:to-transparent">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{title}</h3>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="sticky top-0 z-10 w-full flex items-center justify-between gap-2 pt-2 pb-1.5 -mx-1 px-1 bg-gradient-to-b from-white from-70% to-transparent dark:from-gray-950 dark:to-transparent"
    >
      <span className="flex items-center gap-1 min-w-0">
        <Chevron open={open} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">{title}</span>
      </span>
      {counts.open > 0 && (
        <span className="flex items-center gap-1.5 shrink-0">
          {counts.urgent > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-label="Has urgent jobs" />}
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{counts.open}</span>
        </span>
      )}
    </button>
  );
}

function BedSection({ group, onBedClick, open, onToggle, bedsWithNotes }) {
  const grid = group.grid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2";
  const counts = sectionCounts(group.beds);
  const collapsible = group.kind !== "general";
  const noted = bedsWithNotes || new Set();

  if (group.kind === "general") {
    return (
      <div className={grid}>
        {group.beds.map((b) => (
          <BedTile
            key="general"
            bed={b.bed}
            open={b.open}
            urgent={b.urgent}
            hasNote={noted.has(b.bed)}
            onClick={() => onBedClick(b.bed)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <BedSectionHeader
        title={group.title}
        open={open}
        onToggle={onToggle}
        counts={counts}
        collapsible={collapsible}
      />
      {open && (
        <div className={grid}>
          {group.beds.map((b) => (
            <BedTile
              key={b.bed ?? "general"}
              bed={b.bed}
              open={b.open}
              urgent={b.urgent}
              hasNote={noted.has(b.bed)}
              compact={group.grid}
              onClick={() => onBedClick(b.bed)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WardBedList({ beds, layout, onBedClick, bedsWithNotes }) {
  const groups = groupBedsBySection(beds, { layout });
  const [collapsed, setCollapsed] = useState(new Set());

  const isOpen = (key) => !collapsed.has(key);
  const toggle = (key) => setCollapsed((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <BedSection
          key={group.key}
          group={group}
          onBedClick={onBedClick}
          bedsWithNotes={bedsWithNotes}
          open={isOpen(group.key)}
          onToggle={() => toggle(group.key)}
        />
      ))}
    </div>
  );
}
