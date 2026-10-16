import { useMemo, useRef, useState } from "react";
import Sheet from "../ui/Sheet";
import { BTN, BTN_PRIMARY, BTN_SECONDARY } from "../ui/styles";
import { generateHandover } from "../utils/handoverText";

export default function HandoverSheet({ beds, shift, now, onClose }) {
  const text = useMemo(() => generateHandover(beds, shift, now), [beds, shift, now]);
  const [status, setStatus] = useState(null);
  const preRef = useRef(null);
  const count = Object.keys(beds).length;

  const selectText = () => {
    const el = preRef.current; if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  };
  const copy = () => {
    const fail = () => { selectText(); setStatus("Select the text below and copy it."); };
    try {
      navigator.clipboard.writeText(text).then(() => setStatus("Copied"), fail);
    } catch { fail(); }
  };
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <Sheet open onClose={onClose} title="Handover" sub={`${count} ${count === 1 ? "woman" : "women"} · sorted by bed`}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={copy} className={`${BTN} ${BTN_PRIMARY} flex-1 min-h-[3.25rem] text-base`}>{status === "Copied" ? "Copied" : "Copy handover"}</button>
          {canShare && <button type="button" onClick={() => navigator.share({ title: "Labour ward handover", text }).catch(() => {})} className={`${BTN} ${BTN_SECONDARY} px-5`}>Share</button>}
        </div>
      }>
      {status && status !== "Copied" && <p className="text-xs font-semibold text-claude-700 dark:text-claude-400">{status}</p>}
      <pre ref={preRef} className="text-xs leading-relaxed font-mono whitespace-pre-wrap break-words rounded-xl border p-3 bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 select-text">{text}</pre>
    </Sheet>
  );
}
