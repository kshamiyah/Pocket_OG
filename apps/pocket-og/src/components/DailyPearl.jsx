import { useState } from "react";
import { GUIDELINES } from "@pocket-og/guidelines";
import { glColors } from "../data/glColors";
import ShareButton from "./ShareButton";

// Pearl of the Day — a quiet, auto-surfacing card on the landing screen. It shows
// a "New" accent until opened; opening marks it seen for the day and reveals the
// full teaching point with a one-tap link into the source content.

export default function DailyPearl({ pearl, unseen, onSeen, onNavigate }) {
  const [open, setOpen] = useState(false);
  if (!pearl) return null;

  const theme = glColors(pearl.gl);
  const gl = GUIDELINES[pearl.gl];

  const openModal = () => { setOpen(true); onSeen?.(); };
  const closeModal = () => setOpen(false);

  const goToSource = () => {
    closeModal();
    onNavigate?.(pearl.link);
  };

  return (
    <>
      {/* Landing-screen card */}
      <button
        type="button"
        onClick={openModal}
        className={`w-full text-left rounded-2xl border ${theme.border} ${theme.bg} p-4 flex items-start gap-3 hover:shadow-md active:scale-[0.99] transition-all`}
      >
        <span className="text-xl shrink-0 leading-none mt-0.5">💡</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-[10px] font-bold uppercase tracking-wide ${theme.text}`}>Pearl of the day</p>
            {unseen && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/70 text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent}`} />NEW
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug mt-1">{pearl.pearl}</p>
          <p className="text-[11px] text-gray-400 mt-1">{pearl.topic} · tap to read</p>
        </div>
      </button>

      {/* Expanded modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${theme.text}`}>Pearl of the day</span>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Close pearl"
                  className="w-8 h-8 -mr-2 -mt-2 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none shrink-0"
                >×</button>
              </div>

              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{pearl.topic}</p>
              <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3">{pearl.pearl}</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">{pearl.detail}</p>

              {gl && (
                <div className="flex items-center gap-2 mb-5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${theme.badge} border ${theme.border}`}>
                    {gl.code}
                  </span>
                  <span className="text-xs text-gray-400">{gl.label}</span>
                </div>
              )}

              <button
                onClick={goToSource}
                className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white ${theme.solid} ${theme.solidHover} transition-colors flex items-center justify-center gap-2`}
              >
                Open {pearl.link.label} →
              </button>

              <div className="flex justify-center mt-3">
                <ShareButton
                  title={`Pearl: ${pearl.topic}`}
                  text={`${pearl.pearl} — Pocket O&G pearl of the day`}
                  label="Share pearl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
