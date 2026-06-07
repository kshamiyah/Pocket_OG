import { useState } from "react";

const RECIPIENT = "k.shamiyah@gmail.com";

export default function FeedbackButton({ query = "", filter = "ALL" }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    const contextLines = [
      query  ? `Search query: "${query}"` : null,
      filter && filter !== "ALL" ? `Filter active: ${filter}` : null,
    ].filter(Boolean);

    const body = [
      message.trim(),
      "",
      "— — —",
      ...contextLines,
      "Sent from Pocket O&G",
    ].join("\n");

    const href =
      `mailto:${RECIPIENT}` +
      `?subject=${encodeURIComponent("Pocket O&G — Feedback")}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-5 z-30 flex items-center gap-1.5 bg-white border border-gray-200 shadow-md rounded-full pl-3 pr-3.5 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 hover:shadow-lg transition-all"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-5">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900">Report issue / Send feedback</h2>
              <p className="text-xs text-gray-400 mt-0.5">Opens your mail app with a pre-filled message</p>
            </div>

            {/* Context badge */}
            {query && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-400">
                Will include context: searching <span className="text-gray-600 font-medium">"{query}"</span>
                {filter !== "ALL" && <span> · filter <span className="text-gray-600 font-medium">{filter}</span></span>}
              </div>
            )}

            <textarea
              autoFocus
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Describe the issue or suggestion…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setOpen(false); setMessage(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-1 py-2.5 rounded-xl bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
              >
                Send →
              </button>
            </div>

            <p className="text-xs text-gray-300 text-center mt-3">⌘ + Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
}
