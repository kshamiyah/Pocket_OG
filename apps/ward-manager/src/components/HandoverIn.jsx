export default function HandoverIn({ beds, doctorName, onTakeOver, onClear }) {
  const bedList = Object.values(beds).sort((a, b) =>
    a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true })
  );

  const stageShort = s => ({
    "Latent":               "Latent",
    "Active first stage":   "Active 1st",
    "Passive second stage": "Passive 2nd",
    "Active second stage":  "Active 2nd",
  }[s] ?? s ?? "—");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 3rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}>

      <p className="text-gray-500 text-base mb-1">Dr. {doctorName}</p>
      <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight mb-2">Taking over</h1>
      <p className="text-gray-600 text-sm mb-8">
        {bedList.length} patient{bedList.length !== 1 ? "s" : ""} on the board from the previous shift
      </p>

      {/* Patient list */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-8">
        {bedList.map((bed, i) => {
          const isDelivered = !!bed.delivery;
          return (
            <div key={bed.id}
              className={`px-4 py-3.5 ${i > 0 ? "border-t border-gray-200/60 dark:border-gray-800/60" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-bold text-sm">Bed {bed.bedNumber}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {bed.parity} · {bed.gestation}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isDelivered
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {isDelivered ? "Delivered" : stageShort(bed.labourStage)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onTakeOver}
        className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-base font-bold mb-3 active:scale-95 transition-all">
        Take over ward
      </button>
      <button onClick={onClear}
        className="w-full py-4 rounded-2xl bg-transparent text-gray-600 text-base font-medium border border-gray-300 dark:border-gray-800 active:scale-95 transition-all">
        Clear board — start fresh
      </button>
    </div>
  );
}
