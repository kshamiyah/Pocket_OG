export function sectionCounts(beds) {
  return beds.reduce(
    (acc, b) => ({ open: acc.open + b.open, urgent: acc.urgent + b.urgent }),
    { open: 0, urgent: 0 },
  );
}

export function bedRowTone({ open, urgent }) {
  const empty = open === 0;
  if (empty) {
    return {
      empty: true,
      tile: "rounded-xl border px-4 py-3.5 flex items-center justify-between text-left bg-gray-50/30 dark:bg-gray-900/20 border-gray-100/80 dark:border-gray-800/40",
      tileCompact: "rounded-xl border px-3.5 py-2.5 flex items-center justify-between text-left bg-gray-50/30 dark:bg-gray-900/20 border-gray-100/80 dark:border-gray-800/40",
      label: "text-sm font-medium text-gray-300 dark:text-gray-600",
      labelSm: "text-xs font-medium text-gray-300 dark:text-gray-600",
      shell: "border-gray-100/80 dark:border-gray-800/40 bg-gray-50/30 dark:bg-gray-900/20",
    };
  }
  const active = "rounded-xl border px-4 py-3.5 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";
  const activeCompact = "rounded-xl border px-3.5 py-2.5 flex items-center justify-between text-left bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800";
  const urgentExtra = urgent > 0 ? " border-l-4 border-l-red-500" : "";
  return {
    empty: false,
    tile: active + urgentExtra,
    tileCompact: activeCompact + urgentExtra,
    label: "text-sm font-bold text-gray-900 dark:text-white",
    labelSm: "text-xs font-bold text-gray-700 dark:text-gray-300",
    shell: urgent > 0 ? "border-gray-100 dark:border-gray-800/60 border-l-4 border-l-red-500" : "border-gray-100 dark:border-gray-800/60",
  };
}
