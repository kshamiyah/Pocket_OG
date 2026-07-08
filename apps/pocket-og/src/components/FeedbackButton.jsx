import { useState } from "react";
import BottomSheet from "./BottomSheet";

// Where feedback goes. Set VITE_FEEDBACK_ENDPOINT to your form endpoint,
// e.g. a Formspree form URL: https://formspree.io/f/xxxxxxxx
// Until it's set (or if the POST fails), we fall back to a structured email so
// feedback is never lost. Both the quick note and the survey use this endpoint;
// each submission carries a `kind` field ("note" | "survey") so you can tell
// them apart.
const ENDPOINT = import.meta.env.VITE_FEEDBACK_ENDPOINT || "";
const RECIPIENT = "khalid@drshamiyah.com";
const TAB_BAR_CLEARANCE = "calc(4rem + env(safe-area-inset-bottom, 0px) + 0.625rem)";
const BUILD = typeof __BUILD_INFO__ !== "undefined" ? __BUILD_INFO__ : { version: "dev", sha: "dev" };

const ROLES = ["ST1–2", "ST3–5", "ST6–7", "Consultant", "Midwife", "Medical student", "Other"];
const USE_FREQ = ["Daily", "Weekly", "Occasionally", "No"];
const SECTIONS = ["Search", "Guidelines", "Flowcharts", "CTG tool", "Rx", "Counsel", "Calculators"];
const SEARCH_HIT = ["Yes", "Mostly", "No", "Didn't use"];

function Chips({ options, value, onChange, multi = false }) {
  const active = o => (multi ? value.has(o) : value === o);
  const toggle = o => {
    if (multi) {
      const s = new Set(value);
      s.has(o) ? s.delete(o) : s.add(o);
      onChange(s);
    } else {
      onChange(value === o ? null : o);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-all active:scale-95 ${
            active(o) ? "bg-gray-900 text-white border-transparent" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Rating({ value, onChange, max = 5 }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
            value === n ? "bg-gray-900 text-white border-transparent" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold text-gray-900 mb-0.5">{label}</p>
      {hint ? <p className="text-xs text-gray-400 mb-2">{hint}</p> : <div className="mb-2" />}
      {children}
    </div>
  );
}

function BackBar({ onBack, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 -ml-1">
      <button type="button" onClick={onBack} aria-label="Back" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

const textareaCls =
  "w-full box-border border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";
const inputCls =
  "w-full box-border border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

export default function FeedbackButton({ query = "", filter = "ALL" }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("choose"); // choose | note | survey | done
  const [submitting, setSubmitting] = useState(false);
  const [sentVia, setSentVia] = useState("");

  // quick note
  const [note, setNote] = useState("");
  const [noteContact, setNoteContact] = useState("");

  // survey
  const [role, setRole] = useState(null);
  const [useFreq, setUseFreq] = useState(null);
  const [usefulness, setUsefulness] = useState(0);
  const [sections, setSections] = useState(new Set());
  const [searchHit, setSearchHit] = useState(null);
  const [concerns, setConcerns] = useState("");
  const [missing, setMissing] = useState("");
  const [recommend, setRecommend] = useState(0);
  const [contact, setContact] = useState("");

  function reset() {
    setPhase("choose"); setSubmitting(false); setSentVia("");
    setNote(""); setNoteContact("");
    setRole(null); setUseFreq(null); setUsefulness(0); setSections(new Set());
    setSearchHit(null); setConcerns(""); setMissing(""); setRecommend(0); setContact("");
  }

  function close() {
    setOpen(false);
    reset();
  }

  const context = () => ({ query, filter, version: BUILD.version, build: BUILD.sha });

  const surveyHasInput =
    !!role || !!useFreq || usefulness > 0 || sections.size > 0 ||
    !!searchHit || concerns.trim() || missing.trim() || recommend > 0;

  function buildPayload(kind) {
    if (kind === "note") {
      return {
        kind: "note",
        _subject: "Pocket O&G — Note",
        message: note.trim(),
        contact: noteContact.trim(),
        context: context(),
        submittedAt: new Date().toISOString(),
      };
    }
    return {
      kind: "survey",
      _subject: "Pocket O&G — Survey",
      role: role ?? "",
      wouldUseOnWard: useFreq ?? "",
      overallUsefulness: usefulness || "",
      sectionsUseful: [...sections],
      searchFoundIt: searchHit ?? "",
      clinicalConcerns: concerns.trim(),
      missingOrAdd: missing.trim(),
      recommend: recommend || "",
      contact: contact.trim(),
      context: context(),
      submittedAt: new Date().toISOString(),
    };
  }

  function emailFallback(p) {
    const ctx = `— Pocket O&G · "${p.context.query}" / ${p.context.filter} / v${p.context.version} ${p.context.build}`;
    const body = p.kind === "note"
      ? [p.message, "", p.contact ? `Contact: ${p.contact}` : null, ctx].filter(l => l !== null).join("\n")
      : [
          `Role: ${p.role || "—"}`,
          `Would use on ward: ${p.wouldUseOnWard || "—"}`,
          `Overall usefulness: ${p.overallUsefulness || "—"}/5`,
          `Sections useful: ${p.sectionsUseful.join(", ") || "—"}`,
          `Search found it: ${p.searchFoundIt || "—"}`,
          `Recommend (0–10): ${p.recommend || "—"}`,
          "",
          `Clinical concerns / errors:\n${p.clinicalConcerns || "—"}`,
          "",
          `Missing / would add:\n${p.missingOrAdd || "—"}`,
          "",
          p.contact ? `Contact: ${p.contact}` : null,
          ctx,
        ].filter(l => l !== null).join("\n");
    window.location.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(p._subject)}&body=${encodeURIComponent(body)}`;
  }

  async function submit(kind) {
    if (submitting) return;
    const payload = buildPayload(kind);
    setSubmitting(true);
    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) { setSentVia("endpoint"); setPhase("done"); setSubmitting(false); return; }
      } catch { /* fall through to email */ }
    }
    emailFallback(payload);
    setSentVia("email");
    setSubmitting(false);
    setPhase("done");
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

      <BottomSheet open={open} onClose={close} sheetClassName="min-h-[min(360px,72dvh)] max-h-[92dvh]">
        <div className="px-5 sm:px-6 pb-5 box-border flex-1 overflow-y-auto">

          {/* Chooser */}
          {phase === "choose" && (
            <>
              <h2 className="text-lg font-semibold text-gray-900">Feedback</h2>
              <p className="text-sm text-gray-500 mt-1 mb-5 leading-relaxed">
                Tell me what you think — a quick note, or a short survey. Both help.
              </p>

              <button
                type="button"
                onClick={() => setPhase("note")}
                className="w-full flex items-start gap-3 text-left rounded-2xl border border-gray-200 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors mb-3"
              >
                <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 8l-3-3h13a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v13z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">Share a quick note</span>
                  <span className="block text-xs text-gray-500 mt-0.5">A content correction, an error, or a suggestion — no form to fill in</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPhase("survey")}
                className="w-full flex items-start gap-3 text-left rounded-2xl border border-gray-200 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-6 0h.01M12 16h3m-6 0h.01" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900">Take the 1-minute survey</span>
                  <span className="block text-xs text-gray-500 mt-0.5">A few tappable questions to help shape what comes next</span>
                </span>
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-5 leading-relaxed">
                Please don&apos;t include any patient-identifiable information.
              </p>
            </>
          )}

          {/* Quick note */}
          {phase === "note" && (
            <>
              <BackBar onBack={() => setPhase("choose")} title="Quick note" />
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Spotted an error, or have a suggestion? Tell me in your own words.
                <span className="block mt-1 text-gray-400">No patient-identifiable information, please.</span>
              </p>
              <textarea
                autoFocus
                rows={5}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Your feedback, correction, or suggestion…"
                className={`${textareaCls} min-h-[140px] mb-4`}
              />
              <input
                type="text"
                value={noteContact}
                onChange={e => setNoteContact(e.target.value)}
                placeholder="Name or contact (optional)"
                className={`${inputCls} mb-4`}
              />
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setPhase("choose")} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => submit("note")}
                  disabled={!note.trim() || submitting}
                  className="flex-1 py-3 rounded-xl bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-semibold text-white active:bg-gray-800"
                >
                  {submitting ? "Sending…" : "Send"}
                </button>
              </div>
            </>
          )}

          {/* Survey */}
          {phase === "survey" && (
            <>
              <BackBar onBack={() => setPhase("choose")} title="Quick survey" />
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Answer what you like — nothing is required.
                <span className="block mt-1 text-gray-400">No patient-identifiable information, please.</span>
              </p>

              <Field label="Your role">
                <Chips options={ROLES} value={role} onChange={setRole} />
              </Field>
              <Field label="Would you use this on the ward?">
                <Chips options={USE_FREQ} value={useFreq} onChange={setUseFreq} />
              </Field>
              <Field label="Overall usefulness" hint="1 = not useful · 5 = very useful">
                <Rating value={usefulness} onChange={setUsefulness} />
              </Field>
              <Field label="Which sections were useful?" hint="Select any">
                <Chips options={SECTIONS} value={sections} onChange={setSections} multi />
              </Field>
              <Field label="Did search find what you needed?">
                <Chips options={SEARCH_HIT} value={searchHit} onChange={setSearchHit} />
              </Field>
              <Field label="Any clinical content errors or concerns?" hint="Most important — this is a clinical tool">
                <textarea rows={3} value={concerns} onChange={e => setConcerns(e.target.value)} placeholder="e.g. a dose, threshold, or pathway that looks off…" className={textareaCls} />
              </Field>
              <Field label="What's missing, or what would you add?">
                <textarea rows={3} value={missing} onChange={e => setMissing(e.target.value)} placeholder="Guidelines, calculators, emergencies…" className={textareaCls} />
              </Field>
              <Field label="Recommend to a colleague?" hint="0 = not at all · 10 = definitely (optional)">
                <Rating value={recommend} onChange={setRecommend} max={10} />
              </Field>
              <Field label="Name or contact" hint="Optional — only if you're happy to be followed up">
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Optional" className={inputCls} />
              </Field>

              <div className="flex gap-2.5 mt-2">
                <button type="button" onClick={() => setPhase("choose")} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 active:bg-gray-50">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => submit("survey")}
                  disabled={!surveyHasInput || submitting}
                  className="flex-1 py-3 rounded-xl bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 text-sm font-semibold text-white active:bg-gray-800"
                >
                  {submitting ? "Sending…" : "Send feedback"}
                </button>
              </div>
            </>
          )}

          {/* Done */}
          {phase === "done" && (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Thank you</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {sentVia === "email"
                  ? "Your mail app should be opening — just hit send to finish."
                  : "Your feedback was sent. It genuinely helps."}
              </p>
              <button type="button" onClick={close} className="mt-5 w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold active:bg-gray-800">
                Done
              </button>
            </div>
          )}

        </div>
      </BottomSheet>
    </>
  );
}
