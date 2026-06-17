const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetSidebar({ activeLetters, onSelect }) {
  return (
    <div
      className="fixed right-1 z-30 flex flex-col items-center justify-center py-1 rounded-full bg-white/70 backdrop-blur-sm"
      style={{ top: "72px", bottom: "72px" }}
    >
      {ALL_LETTERS.map((letter) => {
        const active = activeLetters.has(letter);
        return (
          <button
            key={letter}
            onPointerDown={(e) => {
              e.preventDefault();
              if (active) onSelect(letter);
            }}
            className={`w-5 flex items-center justify-center text-[8px] font-bold leading-none py-[2px] rounded transition-colors ${
              active
                ? "text-gray-500 hover:text-gray-900 active:bg-gray-200/60"
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
