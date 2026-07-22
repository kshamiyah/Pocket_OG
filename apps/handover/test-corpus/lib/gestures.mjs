// Full gesture-level pass: drives the app the way a user actually does —
// swipes, taps-to-edit, reminder pickers, paste-to-takeover, copy-link, ward
// setup, section collapse — asserting behaviour AND capturing a screenshot at
// each meaningful step for the visual audit. Screenshots are baseline-diffed
// like every other state.
//
// runGestures(browser, results, deps) pushes finding objects into `results`
// (same shape reconcile() expects) and writes screenshots via deps.shot.

import { encodeHandoverPayload, decodeHandoverPayload } from "../../src/utils/payload.js";

const VP = { id: "375", width: 375, height: 812 };

export async function runGestures(browser, results, deps) {
  const { openApp, shot, BASE, diffAgainstBaseline, fixtures } = deps;
  const { runningState, seedScript, PROFILE } = fixtures;

  // Push a flow/data finding.
  const bug = (scenario, category, severity, expected, observed) => results.push({
    scenario, viewport: VP.id, net: "online", theme: "light", category, severity,
    signature: `gesture::${scenario}::${category}`, expected, observed,
  });

  // Screenshot + baseline diff a gesture step; regressions become findings.
  const snap = async (page, key, theme = "light") => {
    const stateKey = `gesture-${key}__${VP.id}__online__${theme}`;
    const path = await shot(page, stateKey);
    const base = diffAgainstBaseline(stateKey, path);
    if (base.status === "changed") {
      results.push({
        scenario: `gesture-${key}`, viewport: VP.id, net: "online", theme,
        category: "visual-regression", severity: "visual",
        signature: `gesture-${key}::${VP.id}::online::${theme}::visual-regression`,
        expected: "Screenshot matches saved baseline", observed: `Differs by ${base.pct}%`,
        screenshot: `runs/${stateKey}.png`,
      });
    }
  };

  const jobsInStore = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]"));

  // ---- helpers --------------------------------------------------------------
  // A real left-swipe on a JobCard: press in the card's right padding (clear of
  // the inner text button, which stops pointerdown propagation), drag left past
  // the 38px snap threshold. page.mouse emits real pointer events in Chromium,
  // so setPointerCapture in the component works.
  const swipeLeft = async (page, cardLoc) => {
    const b = await cardLoc.boundingBox();
    const sx = b.x + b.width - 5, sy = b.y + b.height / 2;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx - 20, sy, { steps: 3 });
    await page.mouse.move(sx - 72, sy, { steps: 10 });
    await page.mouse.up();
  };
  const cardFor = (page, text) =>
    page.getByRole("button", { name: `Edit job: ${text}` })
      .locator('xpath=ancestor::div[contains(@style,"translateX")][1]');

  // ============================ 1. Swipe to delete + undo ====================
  await withPage(async (page) => {
    await page.getByText("All jobs").click();
    await page.waitForTimeout(200);
    const before = (await jobsInStore(page)).length;
    const target = "Review CTG";
    await swipeLeft(page, cardFor(page, target));
    await page.waitForTimeout(200);
    const del = page.getByRole("button", { name: "Delete job" }).first();
    if (!(await del.count())) { bug("swipe-delete", "gesture", "flow", "Left-swipe reveals a Delete action", "No Delete button appeared after swipe"); return; }
    await snap(page, "swipe-1-revealed");
    await del.click();
    await page.waitForTimeout(200);
    const after = (await jobsInStore(page)).length;
    if (after !== before - 1) bug("swipe-delete", "gesture", "flow", `Swipe-delete removes one job (${before}→${before - 1})`, `Count is ${after}`);
    const undo = page.getByRole("button", { name: "Undo" });
    if (!(await undo.count())) bug("swipe-delete", "undo", "flow", "Deleting shows an Undo toast", "No Undo toast");
    await snap(page, "swipe-2-deleted-undo");
    await undo.first().click();
    await page.waitForTimeout(200);
    const restored = (await jobsInStore(page)).length;
    if (restored !== before) bug("swipe-delete", "undo", "flow", "Undo restores the deleted job", `Count after undo is ${restored}`);
    const stillThere = (await jobsInStore(page)).some((j) => j.text === target);
    if (!stillThere) bug("swipe-delete", "undo", "data", "Undo restores the exact job text", `"${target}" missing after undo`);
  });

  // ============================ 2. Mark done + undo ==========================
  await withPage(async (page) => {
    await page.getByText("All jobs").click();
    await page.waitForTimeout(200);
    const card = cardFor(page, "Consent for LSCS");
    await card.getByRole("button", { name: "Mark done" }).click();
    await page.waitForTimeout(200);
    const done = (await jobsInStore(page)).find((j) => j.text === "Consent for LSCS")?.done;
    if (!done) bug("mark-done", "gesture", "flow", "Tapping the check marks a job done", "Job not marked done");
    await snap(page, "markdone-1");
    const undo = page.getByRole("button", { name: "Undo" });
    if (await undo.count()) { await undo.first().click(); await page.waitForTimeout(150); }
    const doneAfter = (await jobsInStore(page)).find((j) => j.text === "Consent for LSCS")?.done;
    if (doneAfter) bug("mark-done", "undo", "flow", "Undo un-marks the job", "Job still done after undo");
  });

  // ============================ 3. Inline edit + custom reminder =============
  await withPage(async (page) => {
    await page.getByText("All jobs").click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Edit job: Review CTG" }).click();
    await page.waitForTimeout(200);
    await snap(page, "edit-1-open");
    // change text — the editing card is the only one with a text input
    const input = page.getByRole("textbox").first();
    await input.fill("Review CTG then escalate to reg");
    // custom reminder: Custom -> hour/min -> Set reminder
    await page.getByRole("button", { name: /^Custom/ }).click();
    await page.getByLabel("Reminder hour").fill("14");
    await page.getByLabel("Reminder minute").fill("45");
    await snap(page, "edit-2-reminder-custom");
    await page.getByRole("button", { name: "Set reminder" }).click();
    await page.waitForTimeout(150);
    // priority -> urgent (the in-card control)
    await page.getByRole("button", { name: "Urgent", exact: true }).click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "Done", exact: true }).first().click();
    await page.waitForTimeout(150);
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(300);
    const j = (await jobsInStore(page)).find((x) => x.text === "Review CTG then escalate to reg");
    if (!j) bug("inline-edit", "data", "data", "Edited job text persists across reload", "Edited text not found after reload");
    else {
      if (j.priority !== "urgent") bug("inline-edit", "data", "flow", "Priority change persists", `priority=${j.priority}`);
      if (!j.remindAt || new Date(j.remindAt).getHours() !== 14 || new Date(j.remindAt).getMinutes() !== 45)
        bug("inline-edit", "reminder", "flow", "Custom reminder 14:45 persists", `remindAt=${j.remindAt}`);
    }
  });

  // ============================ 4. Reminder presets + clear ==================
  await withPage(async (page) => {
    await page.getByText("All jobs").click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Edit job: TTOs and remove cannula" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "+1h", exact: true }).click();
    await page.waitForTimeout(150);
    let j = (await jobsInStore(page)).find((x) => x.text === "TTOs and remove cannula");
    const FIXED = Date.parse("2026-07-13T09:00:00.000Z");
    if (!j?.remindAt) bug("reminder-preset", "flow", "flow", "+1h preset sets a reminder", "remindAt not set");
    else {
      const mins = Math.round((new Date(j.remindAt).getTime() - FIXED) / 60000);
      if (Math.abs(mins - 60) > 2) bug("reminder-preset", "flow", "flow", "+1h sets reminder ~60m ahead", `set ${mins}m ahead`);
    }
    await snap(page, "reminder-preset-set");
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await page.waitForTimeout(150);
    j = (await jobsInStore(page)).find((x) => x.text === "TTOs and remove cannula");
    if (j?.remindAt) bug("reminder-preset", "clear", "flow", "Clear removes the reminder", `remindAt still ${j.remindAt}`);
  });

  // ============================ 5. Paste-to-takeover (decode → merge) ========
  // Empty list so the header exchange button routes to Take over (scan). The
  // camera is denied, so ScanScreen falls back to its paste field — the real
  // decode→review→merge path without a webcam.
  await withPage(async (page) => {
    const incoming = [
      { ward: "Postnatal", bed: "Bay B bed 4", text: "Give anti-D, cross-check blood group", priority: "urgent" },
      { ward: "Postnatal", bed: "SR2", text: "Repeat bilirubin at 18:00", priority: "routine" },
      { ward: "Triage", bed: "", text: "Await swab result, chase microbiology", priority: "routine" },
    ];
    const code = encodeHandoverPayload(incoming);
    const link = `${BASE}?ho=${code}`;
    await page.getByLabel("Hand over or take over").click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: /Scan or paste a colleague/ }).click();
    await page.waitForTimeout(200);
    await page.getByPlaceholder("Or paste the handover link").fill(link);
    await snap(page, "takeover-1-paste");
    await page.getByRole("button", { name: "Go", exact: true }).click();
    await page.waitForTimeout(300);
    const reviewSeen = await page.getByText("Review before it lands").count();
    if (!reviewSeen) { bug("takeover", "decode", "data", "Pasting a handover link decodes to the review screen", "Review screen not shown"); return; }
    await snap(page, "takeover-2-review");
    // uncheck the middle job, then add the rest
    await page.getByText("Repeat bilirubin at 18:00").click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: /^Add/ }).click();
    await page.waitForTimeout(300);
    const jobs = await jobsInStore(page);
    const texts = jobs.map((j) => j.text);
    if (!texts.includes("Give anti-D, cross-check blood group") || !texts.includes("Await swab result, chase microbiology"))
      bug("takeover", "merge", "data", "Selected incoming jobs land on the list verbatim", `list has: ${texts.join(" | ")}`);
    if (texts.includes("Repeat bilirubin at 18:00"))
      bug("takeover", "merge", "data", "Unchecked incoming job is NOT added", "Unchecked job was merged anyway");
    const antiD = jobs.find((j) => j.text === "Give anti-D, cross-check blood group");
    if (antiD && (antiD.ward !== "Postnatal" || antiD.bed !== "Bay B bed 4" || antiD.priority !== "urgent"))
      bug("takeover", "merge", "data", "Ward/bed/priority survive the takeover round-trip", JSON.stringify(antiD));
    await snap(page, "takeover-3-merged");
  }, seedScript({ profile: PROFILE, shift: { type: "day", startedAt: "2026-07-13T08:00:00.000Z" }, jobs: [], wardLayouts: {} }));

  // ============================ 6. Handover subset → copy-link integrity =====
  await withPage(async (page) => {
    await page.getByLabel("Hand over or take over").click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Hand over" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "None", exact: true }).click(); // clear selection
    await page.waitForTimeout(100);
    // select exactly two known jobs
    await page.getByText("Chase FBC + G&S, escalate if Hb < 70").click();
    await page.getByText("Consent for LSCS").click();
    await page.waitForTimeout(150);
    await snap(page, "handover-subset-1");
    await page.getByRole("button", { name: /Copy link|Share link/ }).click();
    await page.waitForTimeout(200);
    let clip = "";
    try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { bug("handover-copy", "clipboard", "flow", "Copy link writes the handover URL to the clipboard", String(e)); }
    if (clip) {
      const code = new URL(clip).searchParams.get("ho");
      const decoded = decodeHandoverPayload(code);
      const texts = decoded.jobs.map((j) => j.text).sort();
      const expected = ["Chase FBC + G&S, escalate if Hb < 70", "Consent for LSCS"].sort();
      if (JSON.stringify(texts) !== JSON.stringify(expected))
        bug("handover-copy", "integrity", "payload", "Copied link contains exactly the two selected jobs", `contains: ${texts.join(" | ")}`);
    }
  }, runningState(), { permissions: ["clipboard-read", "clipboard-write"] });

  // ============================ 7. Ward setup: add + remove sections =========
  await withPage(async (page) => {
    await page.getByLabel("More options").click();
    await page.waitForTimeout(350);
    await page.getByText("Manage wards").click();
    // HomeMenu.requestClose waits 280ms (a JS timer, not a CSS transition) before
    // navigating, so wait for the target screen rather than a fixed sleep.
    await page.getByText("Bed setup").waitFor({ timeout: 5000 });
    await page.getByPlaceholder("New ward name").fill("Antenatal");
    await page.getByRole("button", { name: "Set up", exact: true }).click();
    await page.getByText("Set up Antenatal").waitFor({ timeout: 5000 });
    await page.getByRole("button", { name: "Add section" }).click();
    // numbered range 1..6
    await page.getByText("Add numbered range").click();
    await page.waitForTimeout(150);
    await page.getByPlaceholder("From").fill("1");
    await page.getByPlaceholder("To").fill("6");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Add section" }).click();
    await page.waitForTimeout(200);
    // numbered bays with lettered beds -> 1A,1B… (the user-requested config)
    await page.getByRole("button", { name: "Add section" }).click();
    await page.getByText("Add bays & beds").click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Numbers", exact: true }).first().click(); // bays = numbers
    await page.getByRole("button", { name: "Letters", exact: true }).last().click();  // beds = letters
    await page.waitForTimeout(150);
    await snap(page, "wardsetup-1b-numbered-bays");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(150);
    await page.getByRole("button", { name: "Add section" }).click();
    await page.waitForTimeout(200);
    await snap(page, "wardsetup-1-two-sections");
    // remove the numbered RANGE (first Remove) so we keep the grid section, then save
    const removeBtns = page.getByRole("button", { name: "Remove" });
    const nBefore = await removeBtns.count();
    if (nBefore >= 1) { await removeBtns.first().click(); await page.waitForTimeout(150); }
    await page.getByRole("button", { name: /^Save/ }).first().click();
    await page.waitForTimeout(250);
    const layout = await page.evaluate(() => JSON.parse(localStorage.getItem("handover_ward_layouts_v1") || "{}").Antenatal);
    if (!layout || !layout.sections?.length) bug("ward-setup", "save", "flow", "New ward saves with its remaining section(s)", `layout=${JSON.stringify(layout)}`);
    const grid = layout?.sections?.find((s) => s.type === "grid");
    if (!grid || grid.bayKind !== "number" || grid.bedKind !== "letter")
      bug("ward-setup", "numbered-bays", "data", "Grid section persists numbered bays + lettered beds", `grid=${JSON.stringify(grid)}`);
    await snap(page, "wardsetup-2-saved");
  });

  // ============================ 8. Bed section collapse / expand =============
  await withPage(async (page) => {
    await page.getByText("Ward 42").click(); // grid ward with Bay A/B/C -> collapsible
    await page.waitForTimeout(250);
    await snap(page, "bedsection-1-expanded");
    const header = page.getByRole("button", { name: /Bay A/ }).first();
    if (await header.count()) {
      await header.click();
      await page.waitForTimeout(200);
      await snap(page, "bedsection-2-collapsed");
      await header.click();
      await page.waitForTimeout(150);
    } else {
      bug("bed-section", "collapse", "flow", "Bed board sections are collapsible", "No collapsible Bay section found");
    }
  });

  // ============================ 9. Notification → open task ==================
  await withPage(async (page) => {
    await page.getByRole("button", { name: /tasks due|Notifications/ }).first().click();
    await page.waitForTimeout(300);
    await snap(page, "notif-open-1");
    // tap the first due task
    const firstTask = page.getByText("Chase FBC + G&S, escalate if Hb < 70").first();
    if (await firstTask.count()) {
      await firstTask.click();
      await page.waitForTimeout(300);
      // should land in All jobs with that job in edit mode (its text in an input)
      const tb = page.getByRole("textbox").first();
      const editing = (await tb.count()) && (await tb.inputValue()) === "Chase FBC + G&S, escalate if Hb < 70";
      if (!editing) bug("notif-open", "nav", "flow", "Tapping a due task opens it for editing", "Job did not open in edit mode");
      await snap(page, "notif-open-2-task");
    } else {
      bug("notif-open", "nav", "flow", "Due task is listed in the notification centre", "Due task not listed");
    }
  });

  // helper: seed running state, open, run fn, close
  async function withPage(fn, state = runningState(), opts = {}) {
    const { context, page, diag } = await openApp(browser, VP, state, opts);
    try {
      await fn(page);
      // any console/page errors during the gesture are automatic flags
      const d = diag.drain();
      for (const e of d.pageErrors) bug("gesture-runtime", "page-error", "flow", "No uncaught errors during gestures", e.slice(0, 140));
      for (const e of d.consoleErrors) bug("gesture-runtime", "console-error", "flow", "No console errors during gestures", e.slice(0, 140));
    } catch (err) {
      const msg = String(err.message || err).split("\n").slice(0, 3).join(" ").slice(0, 300);
      bug("gesture-harness", "error", "flow", "Gesture flow runs to completion", msg);
    } finally {
      await context.close();
    }
  }
}
