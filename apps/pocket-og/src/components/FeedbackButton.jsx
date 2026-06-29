import { useEffect, useRef, useState } from "react";
import BottomSheet from "./BottomSheet";

const RECIPIENT = "khalid@drshamiyah.com";
const SUBJECT = "Pocket O&G — Feedback";
const TAB_BAR_CLEARANCE = "calc(4rem + env(safe-area-inset-bottom, 0px) + 0.625rem)";

const linkBtn =
  "flex-1 min-w-0 py-2 rounded-xl text-sm font-semibold text-center no-underline active:opacity-90";
const linkBtnPrimary = `${linkBtn} bg-gray-900 text-white`;
const linkBtnSecondary = `${linkBtn} border border-gray-200 text-gray-700`;
const linkBtnFullPrimary =
  "block w-full py-2.5 rounded-xl text-sm font-semibold text-center no-underline bg-gray-900 text-white active:opacity-90";

function buildFeedbackPayload(message, query, filter) {
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

  const mailtoHref =
    `mailto:${RECIPIENT}` +
    `?subject=${encodeURIComponent(SUBJECT)}` +
    `&body=${encodeURIComponent(body)}`;

  const gmailHref =
    `https://mail.google.com/mail/?${new URLSearchParams({
      view: "cm",
      fs: "1",
      to: RECIPIENT,
      su: SUBJECT,
      body,
    }).toString()}`;

  const outlookHref =
    `https://outlook.live.com/mail/0/deeplink/compose?${new URLSearchParams({
      to: RECIPIENT,
      subject: SUBJECT,
      body,
    }).toString()}`;

  const clipboardText = `To: ${RECIPIENT}\nSubject: ${SUBJECT}\n\n${body}`;

  return { body, mailtoHref, gmailHref, outlookHref, clipboardText };
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function usePrefersFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

function useIsIOS() {
  return useState(() => {
    if (typeof navigator === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  })[0];
}

export default function FeedbackButton({ query = "", filter = "ALL" }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("compose");
  const [message, setMessage] = useState("");
  const [sentPayload, setSentPayload] = useState(null);
  const [clipboardOk, setClipboardOk] = useState(false);
  const fallbackRef = useRef(null);
  const isDesktop = usePrefersFinePointer();
  const isIOS = useIsIOS();
  const mailLabel = isIOS ? "Mail" : "Email app";

  function resetForm() {
    setPhase("compose");
    setMessage("");
    setSentPayload(null);
    setClipboardOk(false);
  }

  function close() {
    setOpen(false);
    resetForm();
  }

  async function submitFeedback() {
    if (!message.trim()) return;
    const payload = buildFeedbackPayload(message, query, filter);
    const copied = await copyToClipboard(payload.clipboardText);
    setSentPayload(payload);
    setClipboardOk(copied);
    setPhase("sent");
  }

  async function handleCopyOnly() {
    if (!message.trim()) return;
    const payload = buildFeedbackPayload(message, query, filter);
    const copied = await copyToClipboard(payload.clipboardText);
    if (copied) {
      setClipboardOk(true);
      setTimeout(() => setClipboardOk(false), 2000);
      return;
    }
    setSentPayload(payload);
    setClipboardOk(false);
    setPhase("sent");
  }

  useEffect(() => {
    if (phase !== "sent" || clipboardOk) return;
    const el = fallbackRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [phase, clipboardOk]);

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

      <BottomSheet
        open={open}
        onClose={close}
        sheetClassName="min-h-[min(380px,78dvh)] sm:min-h-[420px] max-h-[92dvh]"
      >
        <div className="px-5 sm:px-6 pb-5 box-border flex-1 overflow-y-auto">
              {phase === "compose" ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-900">Send feedback</h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Your feedback is valuable — whether you&apos;ve spotted an error, found something unclear,
                    or have an idea to improve the app, it helps us get it right.
                  </p>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {isDesktop
                      ? "Copies your message — then open Gmail or Outlook"
                      : isIOS
                        ? "Copies your message — then open Mail (or webmail)"
                        : "Copies your message — then Email app, Gmail, or Outlook"}
                  </p>

                  {query && (
                    <p className="mt-2 text-sm text-gray-400">
                      Includes: <span className="text-gray-600 font-medium">"{query}"</span>
                      {filter !== "ALL" && <span> · {filter}</span>}
                    </p>
                  )}

                  <textarea
                    autoFocus
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Escape") close();
                    }}
                    placeholder="Describe the issue or suggestion…"
                    className="mt-4 w-full min-h-[140px] box-border border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />

                  <div className="flex gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1 min-w-0 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyOnly}
                      disabled={!message.trim()}
                      className="shrink-0 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 disabled:opacity-40 active:bg-gray-50"
                    >
                      {clipboardOk ? "Copied" : "Copy only"}
                    </button>
                    <button
                      type="button"
                      onClick={submitFeedback}
                      disabled={!message.trim()}
                      className="flex-1 min-w-0 py-3 rounded-xl bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-semibold text-white active:bg-gray-800"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-900">Feedback ready</h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {clipboardOk ? "Copied to clipboard. " : "Copy failed — select the text below. "}
                    {isDesktop
                      ? "Use Gmail or Outlook below — desktop browsers need webmail, not a local mail app."
                      : isIOS
                        ? `Tap ${mailLabel} to compose in Apple Mail — or Gmail/Outlook if you use webmail.`
                        : `Tap ${mailLabel} to pick your mail app — or Gmail/Outlook for webmail.`}
                  </p>

                  <textarea
                    ref={fallbackRef}
                    readOnly
                    rows={8}
                    value={sentPayload?.clipboardText ?? ""}
                    className="mt-4 w-full min-h-[160px] box-border border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />

                  {!isDesktop && (
                    <a href={sentPayload?.mailtoHref} className={`${linkBtnFullPrimary} mt-4 py-3`}>
                      {mailLabel}
                    </a>
                  )}

                  <div className="flex gap-2.5 mt-4">
                    <a
                      href={sentPayload?.gmailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={isDesktop ? linkBtnPrimary : linkBtnSecondary}
                    >
                      Gmail
                    </a>
                    <a
                      href={sentPayload?.outlookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={isDesktop ? linkBtnPrimary : linkBtnSecondary}
                    >
                      Outlook
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50"
                  >
                    Done
                  </button>
                </>
              )}
        </div>
      </BottomSheet>
    </>
  );
}
