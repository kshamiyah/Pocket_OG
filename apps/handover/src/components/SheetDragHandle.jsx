/** Paints the home-indicator zone to match the sheet (iOS Capacitor). */
export function SheetSafeBottom() {
  return (
    <div
      aria-hidden
      className="bg-white dark:bg-gray-950"
      style={{ height: "env(safe-area-inset-bottom, 0px)" }}
    />
  );
}

export default function SheetDragHandle({ handleProps }) {
  return (
    <div
      className="shrink-0 mx-auto mt-2 mb-1 h-6 w-full flex items-center justify-center touch-none"
      aria-hidden="true"
      {...handleProps}
    >
      <div className="h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
