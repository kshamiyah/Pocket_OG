import { useState } from "react";

const RECIPIENT = "k.shamiyah@gmail.com";
const TAB_BAR_CLEARANCE = "calc(4rem + env(safe-area-inset-bottom, 0px) + 0.625rem)";

function buildMailtoHref(message, query, filter) {
  const contextLines = [
    query ? `Search query: "${query}"` : null,
    filter && filter !== "ALL" ? `Filter active: ${filter}` : null,
  ].filter(Boolean);

  const body = [
    message.trim(),
    "",
    "— — —",
    ...contextLines,
    "Sent from Pocket O&G",
  ].join("\n");

  return (
    `mailto:${RECIPIENT}` +
    `?subject=${encodeURIComponent("Pocket O&G — Feedback")}` +
    `&body=${encodeURIComponent(body)}`
  );
}

function openMailto(href) {
  const link = document.createElement("a");
  link.href = href;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function FeedbackButton({ query = "", filter = "ALL" }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  function close() {
    setOpen(false);
    setMessage("");
    setCopied(false);
  }

  function handleSend() {
    if (!message.trim()) return;
    const href = buildMailtoHref(message, query, filter);
    openMailto(href);
    close();
  }

  async function handleCopy() {
    if (!message.trim()) return;
    const href = buildMailtoHref(message, query, filter);
    const text = decodeURIComponent(href.split("body=")[1] ?? "");
    try {
      await navigator.clipboard.writeText(`${RECIPIENT}\n\n${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      openMailto(href);
      close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        style={{ bottom: TAB_BAR_CLEARANCE }}
        className="fixed left-4 z-30 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur border border-gray-200 shadow-sm rounded-full text-gray-400 hover:text-gray-600 hover:shadow-md active:scale-95 transition-all"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={close} aria-hidden="true" />

          <div
            className="relative w-full max-w-lg box-border bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-8 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-4 pb-3 box-border">
              <h2 className="text-sm font-semibold text-gray-900">Send feedback</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Opens Mail on your device</p>

              {query && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Includes: <span className="text-gray-600 font-medium">"{query}"</span>
                  {filter !== "ALL" && <span> · {filter}</span>}
                </p>
              )}

              <textarea
                autoFocus
                rows={2}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape") close();
                }}
                placeholder="Describe the issue or suggestion…"
                className="mt-2 w-full box-border border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 min-w-0 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!message.trim()}
                  className="shrink-0 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 disabled:opacity-40 active:bg-gray-50"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex-1 min-w-0 py-2 rounded-xl bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-semibold text-white active:bg-gray-800"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
