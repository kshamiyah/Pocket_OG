const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetSidebar({ activeLetters, onSelect }) {
  return (
    <div
      className="fixed right-1 z-30 flex flex-col items-center justify-center py-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
      style={{ top: "72px", bottom: "72px" }}
    >
      {ALL_LETTERS.map((letter) => {
        const active = activeLetters.has(letter);
        return (
          <button
            key={letter}
            aria-label={active ? `Jump to ${letter}` : undefined}
            onPointerDown={(e) => {
              e.preventDefault();
              if (active) onSelect(letter);
            }}
            onKeyDown={(e) => {
              if (active && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(letter);
              }
            }}
            className={`w-8 flex items-center justify-center text-[10px] font-bold leading-none py-[3px] rounded transition-colors ${
              active
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200"
                : "text-gray-200 cursor-default pointer-events-none"
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
