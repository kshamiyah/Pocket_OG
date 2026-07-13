// Handover testing loop — main driver.
//
// Boots a production preview server (vite preview, which also serves the PWA
// service worker so the offline pass is real), then drives the app across a
// matrix of scenarios × viewports × network × theme. For every state it:
//   - screenshots the viewport,
//   - runs structural checks (h-overflow, interactive overlap, clipping),
//   - captures console/page errors and failed requests,
//   - diffs against the saved baseline (test-corpus/baselines).
// Flow "walks" additionally assert navigation and post-reload persistence.
//
// Findings are reconciled against the persistent corpus (cases.json) into
// NEW / STILL BROKEN / FIXED and written to REPORT.md. Nothing is auto-fixed.
//
// Usage: node run.mjs [--fast]   (--fast: phone viewports only, skip desktop)

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { seedScript, runningState, PROFILE, JOBS, WARD_LAYOUTS, FIXED_NOW } from "./lib/fixtures.mjs";
import { captureDiagnostics, structuralChecks } from "./lib/checks.mjs";
import {
  DIRS, loadCases, saveCases, diffAgainstBaseline, bugsFromState, reconcile, writeReport,
} from "./lib/report.mjs";
import { runGestures } from "./lib/gestures.mjs";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const APP_DIR = new URL("..", import.meta.url).pathname;
const PORT = 4178;
const BASE = `http://localhost:${PORT}/`;
const FAST = process.argv.includes("--fast");

const VIEWPORTS = FAST
  ? [{ id: "375", width: 375, height: 812 }, { id: "414", width: 414, height: 896 }]
  : [{ id: "375", width: 375, height: 812 }, { id: "414", width: 414, height: 896 }, { id: "1280", width: 1280, height: 900 }];

const log = (...a) => console.log(...a);

// ---- server -----------------------------------------------------------------
async function startServer() {
  const proc = spawn(
    join(APP_DIR, "../../node_modules/.bin/vite"),
    ["preview", "--port", String(PORT), "--strictPort"],
    { cwd: APP_DIR, stdio: "ignore" }
  );
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) { log(`preview server up at ${BASE}`); return proc; }
    } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error("preview server did not start");
}

// ---- page helpers -----------------------------------------------------------
async function seedContext(browser, { width, height }, state, offline, opts = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    // Deny camera by default so ScanScreen shows its paste fallback rather than
    // hanging; callers can grant clipboard perms for copy-link checks.
    permissions: opts.permissions || [],
  });
  const { data, theme } = state;
  // Pin the browser clock so reminder states and relative-age text are
  // deterministic (stable screenshot baselines). Parsing and arithmetic still
  // work; only "now" is frozen. Registered first so the app sees it on boot.
  await context.addInitScript((fixed) => {
    const RealDate = Date;
    class FakeDate extends RealDate {
      constructor(...args) { if (args.length === 0) super(fixed); else super(...args); }
      static now() { return fixed; }
    }
    // eslint-disable-next-line no-global-assign
    window.Date = FakeDate;
    // Kill transitions/animations and the blinking caret so bottom-sheet
    // slide-ins and focused inputs don't cause sub-pixel screenshot jitter.
    // Init scripts run before the DOM exists, so defer if documentElement is
    // not there yet.
    const addStyle = () => {
      const root = document.head || document.documentElement;
      if (!root) return;
      const style = document.createElement("style");
      style.textContent = "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}";
      root.appendChild(style);
    };
    if (document.documentElement) addStyle();
    else document.addEventListener("DOMContentLoaded", addStyle);
  }, FIXED_NOW);
  await context.addInitScript(({ data, theme }) => {
    try {
      // Seed ONLY on the first load. addInitScript re-runs on every navigation,
      // so without this guard a reload would clobber any state the app just
      // wrote — which would make every persistence assertion falsely fail.
      if (localStorage.getItem("__seeded__")) return;
      for (const [k, v] of Object.entries(data)) {
        if (v === null || v === undefined) localStorage.removeItem(k);
        else localStorage.setItem(k, JSON.stringify(v));
      }
      localStorage.setItem("handover_theme_v1", theme);
      localStorage.setItem("__seeded__", "1");
    } catch { /* ignore */ }
  }, { data, theme });
  return context;
}

async function shot(page, key) {
  const path = join(DIRS.runs, `${key}.png`);
  await page.screenshot({ path });
  return path;
}

// Seed + open the app, settle, return the page and its diagnostics drain.
// Shared by flow walks and the gesture suite.
async function openApp(browser, vp, state, opts = {}) {
  const context = await seedContext(browser, vp, state, false, opts);
  const page = await context.newPage();
  const diag = captureDiagnostics(page);
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(300);
  return { context, page, diag };
}

// Render one seeded state across the current viewport/net, run checks.
async function renderState(browser, vp, net, scenario) {
  const offline = net === "offline";
  const context = await seedContext(browser, vp, scenario.state, offline);
  const page = await context.newPage();
  const diag = captureDiagnostics(page);
  const stateKey = `${scenario.id}__${vp.id}__${net}__${scenario.state.theme}`;
  const record = { scenario: scenario.id, viewport: vp.id, net, theme: scenario.state.theme };
  try {
    if (offline) {
      // Warm the cache online, then cut the network and reload from the SW.
      await page.goto(BASE, { waitUntil: "load" });
      await page.evaluate(() => navigator.serviceWorker?.ready).catch(() => {});
      await sleep(400);
      await context.setOffline(true);
      await page.reload({ waitUntil: "load" }).catch(() => {});
    } else {
      await page.goto(BASE, { waitUntil: "load" });
    }
    await page.waitForTimeout(300);
    if (scenario.reach) await scenario.reach(page);
    await page.waitForTimeout(250);

    const structural = await structuralChecks(page);
    const screenshot = await shot(page, stateKey);
    const baseline = diffAgainstBaseline(stateKey, screenshot);
    const diagnostics = diag.drain();
    // During the offline pass, requests aborted BY US are expected; keep only
    // ones that indicate the app itself failed (none, ideally, if SW works).
    if (offline) diagnostics.failedRequests = diagnostics.failedRequests.filter(() => false);
    return { ...record, structural, diagnostics, baseline, screenshotRel: `runs/${stateKey}.png` };
  } catch (err) {
    return { ...record, error: String(err), structural: { viewport: vp, overflow: [], overlaps: [], clipping: [], docScroll: null }, diagnostics: diag.drain(), baseline: { status: "error" } };
  } finally {
    await context.close();
  }
}

// ---- reach helpers (resilient) ---------------------------------------------
const clickText = async (page, text, opts = {}) => {
  const el = page.getByText(text, { exact: false }).first();
  await el.click({ timeout: 2500, ...opts });
};
const clickLabel = async (page, label) => {
  await page.getByLabel(label, { exact: false }).first().click({ timeout: 2500 });
};

// ---- scenario matrix --------------------------------------------------------
// state = seedScript(...) result; reach = optional interaction; tags control
// which extra matrix cells (dark/offline) also run.
function S(id, state, reach, tags = {}) { return { id, state, reach, tags }; }

const scenarios = [
  S("welcome", seedScript({ profile: null })),
  S("profile-setup", seedScript({ profile: { name: "", role: null } })),
  S("hub", seedScript({ profile: PROFILE }), null, { dark: true }),
  S("list-walk", runningState(), null, { dark: true, offline: true }),
  S("list-all", runningState(), (p) => clickText(p, "All jobs")),
  S("list-expand", runningState(), (p) => clickText(p, "Expand")),
  S("ward-board", runningState(), (p) => clickText(p, "Delivery Suite"), { dark: true, offline: true }),
  S("bed-jobs", runningState(), async (p) => { await clickText(p, "Delivery Suite"); await clickText(p, "Room 3"); }),
  S("notifications", runningState(), (p) => p.getByRole("button", { name: /tasks due|Notifications/ }).first().click({ timeout: 2500 })),
  S("handover", runningState(), (p) => clickLabel(p, "Hand over jobs"), { dark: true, offline: true }),
  S("handover-options", runningState(), async (p) => { await clickLabel(p, "Hand over jobs"); await clickText(p, "Options"); }),
  S("handover-wardfilter", runningState(), async (p) => { await clickLabel(p, "Hand over jobs"); await clickText(p, "Ward 42 ·"); }),
  S("add-job", runningState(), (p) => clickLabel(p, "Add job")),
  S("menu", runningState(), (p) => clickLabel(p, "More options")),
  S("ward-setup", runningState(), async (p) => { await clickText(p, "Delivery Suite"); await clickText(p, "Manage beds"); }),
  S("end-shift", runningState(), async (p) => { await clickLabel(p, "More options"); await p.waitForTimeout(350); await clickText(p, "End shift"); await p.getByText("End of shift").waitFor({ timeout: 5000 }); }),
  S("shift-picker", seedScript({ profile: PROFILE }), (p) => clickText(p, "Start a shift")),
  S("wards-intro", seedScript({ profile: PROFILE, wardLayouts: {} }), async (p) => { await clickText(p, "Start a shift"); await clickText(p, "Long day"); }),
  S("scan", seedScript({ profile: PROFILE }), (p) => clickText(p, "Take over")),
];

// ---- flow walks (navigation + persistence), run once at 375 online ----------
async function runWalks(browser, results) {
  const vp = VIEWPORTS[0];
  const walkBug = (scenario, category, expected, observed) => results.push({
    scenario, viewport: vp.id, net: "online", theme: "light",
    category, severity: "flow", signature: `${scenario}::${vp.id}::online::${category}::walk`,
    expected, observed,
  });

  // --- Onboarding walk: welcome → setup → hub -------------------------------
  {
    const ctx = await seedContext(browser, vp, seedScript({ profile: null }), false);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "load" });
      await clickText(page, "Get started");
      await page.getByPlaceholder("First name is enough").fill("Alex");
      await clickText(page, "SHO / CT");
      await clickText(page, "Continue");
      await page.waitForTimeout(300);
      const onHub = await page.getByText("Start a shift").count();
      if (!onHub) walkBug("onboarding", "nav", "After profile completion, land on the hub (Start a shift visible)", "Hub not reached after Continue");
      const stored = await page.evaluate(() => localStorage.getItem("handover_profile_v1"));
      if (!stored || !stored.includes("Alex")) walkBug("onboarding", "persist", "Profile saved to handover_profile_v1", `Stored profile: ${stored}`);
      await shot(page, "walk__onboarding-hub");
    } catch (e) { walkBug("onboarding", "nav", "Onboarding completes", String(e)); }
    finally { await ctx.close(); }
  }

  // --- Skip branch: first shift with no wards → wardsIntro → Skip → list -----
  {
    const ctx = await seedContext(browser, vp, seedScript({ profile: PROFILE, wardLayouts: {} }), false);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "load" });
      await clickText(page, "Start a shift");
      await clickText(page, "Long day");
      await page.waitForTimeout(200);
      const introSeen = await page.getByText("Add your wards").count();
      if (!introSeen) walkBug("skip-branch", "nav", "First shift with no layouts shows the wards intro", "Wards intro not shown");
      await clickText(page, "Skip for now");
      await page.waitForTimeout(300);
      const onList = await page.getByLabel("Add job").count();
      if (!onList) walkBug("skip-branch", "nav", "Skipping ward setup lands on the job list (FAB visible)", "Job list not reached after Skip");
    } catch (e) { walkBug("skip-branch", "nav", "Skip branch completes", String(e)); }
    finally { await ctx.close(); }
  }

  // --- Add-job + reload persistence -----------------------------------------
  {
    const ctx = await seedContext(browser, vp, runningState(), false);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "load" });
      const before = await page.evaluate(() => JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]").length);
      await clickLabel(page, "Add job");
      await page.getByPlaceholder("e.g. Chase repeat FBC").fill("Playwright regression job");
      await page.getByRole("button", { name: "Urgent", exact: true }).click(); // the form control, not a card badge
      // Two controls share the name "Add job": the FAB (aria-label) and the
      // sheet's submit button (text). The submit is rendered last in the DOM.
      await page.getByRole("button", { name: "Add job", exact: true }).last().click();
      await page.waitForTimeout(200);
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(300);
      const after = await page.evaluate(() => JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]"));
      if (after.length !== before + 1) walkBug("add-job-persist", "persist", `Job count increases by 1 and survives reload (${before}→${before + 1})`, `After reload: ${after.length}`);
      const added = after.find((j) => j.text === "Playwright regression job");
      if (!added) walkBug("add-job-persist", "persist", "Added job text survives reload", "Added job not found after reload");
      else if (added.priority !== "urgent") walkBug("add-job-persist", "persist", "Added job keeps urgent priority after reload", `priority=${added.priority}`);
    } catch (e) { walkBug("add-job-persist", "persist", "Add-job persistence check runs", String(e)); }
    finally { await ctx.close(); }
  }

  // --- Dark-mode toggle + reload persistence --------------------------------
  {
    const ctx = await seedContext(browser, vp, runningState(), false);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "load" });
      await clickLabel(page, "More options");
      await page.waitForTimeout(350); // let the menu sheet finish sliding up
      await page.getByRole("switch").first().click({ timeout: 2500 }); // the one dark-mode switch in the menu
      await page.waitForTimeout(250);
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(300);
      const isDark = await page.evaluate(() => ({
        cls: document.documentElement.classList.contains("dark"),
        ls: localStorage.getItem("handover_theme_v1"),
      }));
      if (!isDark.cls || isDark.ls !== "dark") walkBug("dark-persist", "persist", "Dark mode persists across reload (html.dark + handover_theme_v1=dark)", JSON.stringify(isDark));
    } catch (e) { walkBug("dark-persist", "persist", "Dark-mode persistence check runs", String(e)); }
    finally { await ctx.close(); }
  }

  // --- Ward layout change + jobs still map to beds ---------------------------
  {
    const ctx = await seedContext(browser, vp, runningState(), false);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE, { waitUntil: "load" });
      const bedsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]").map((j) => [j.ward, j.bed]));
      // Enter a ward, open Manage beds, remove the last section, save.
      await clickText(page, "Ward 42");
      await clickText(page, "Manage beds");
      await page.waitForTimeout(200);
      const removeBtns = page.getByRole("button", { name: "Remove" });
      if (await removeBtns.count() > 0) {
        await removeBtns.last().click();
        await page.waitForTimeout(100);
      } else {
        walkBug("layout-change", "nav", "Ward setup exposes section Remove controls", "No Remove control found");
      }
      await page.getByRole("button", { name: /^Save/ }).first().click();
      await page.waitForTimeout(200);
      await page.reload({ waitUntil: "load" });
      await page.waitForTimeout(300);
      const bedsAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]").map((j) => [j.ward, j.bed]));
      if (JSON.stringify(bedsBefore) !== JSON.stringify(bedsAfter)) {
        walkBug("layout-change", "data", "Editing a ward layout does not move jobs off their beds", `jobs bed mapping changed: ${JSON.stringify(bedsBefore)} → ${JSON.stringify(bedsAfter)}`);
      }
    } catch (e) { walkBug("layout-change", "nav", "Layout-change check runs", String(e)); }
    finally { await ctx.close(); }
  }
}

// ---- main -------------------------------------------------------------------
async function main() {
  // clean previous run screenshots (baselines persist)
  rmSync(DIRS.runs, { recursive: true, force: true });
  mkdirSync(DIRS.runs, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const stateResults = [];
  let stateCount = 0;

  const GESTURES_ONLY = process.argv.includes("--gestures-only");
  try {
    for (const scenario of (GESTURES_ONLY ? [] : scenarios)) {
      for (const vp of VIEWPORTS) {
        const r = await renderState(browser, vp, "online", scenario);
        stateResults.push(r); stateCount++;
        if (r.error) log(`  ! ${scenario.id} ${vp.id} online: ${r.error.split("\n")[0]}`);
      }
      // dark variant (phone only)
      if (scenario.tags.dark) {
        const dstate = { ...scenario, state: { ...scenario.state, theme: "dark" } };
        const r = await renderState(browser, VIEWPORTS[0], "online", dstate);
        stateResults.push(r); stateCount++;
      }
      // offline variant (phone only)
      if (scenario.tags.offline) {
        const r = await renderState(browser, VIEWPORTS[0], "offline", scenario);
        stateResults.push(r); stateCount++;
      }
      log(`✓ ${scenario.id}`);
    }

    const walkBugs = [];
    if (!GESTURES_ONLY) {
      log("running flow walks (navigation + persistence)…");
      await runWalks(browser, walkBugs);
      stateResults.push(...walkBugs.map((b) => ({ __walk: true, ...b })));
    }

    log("running gesture suite (swipe, edit, reminders, takeover, ward setup)…");
    const gestureBugs = [];
    await runGestures(browser, gestureBugs, {
      openApp, shot, BASE, diffAgainstBaseline,
      fixtures: { runningState, seedScript, PROFILE },
    });
    stateResults.push(...gestureBugs.map((b) => ({ __walk: true, ...b })));
    if (GESTURES_ONLY) {
      const real = gestureBugs.filter((b) => b.category !== "visual-regression");
      log(`\ngesture findings (excl. new-baseline visreg): ${real.length}`);
      for (const b of real) log(`  [${b.severity}] ${b.scenario}/${b.category}: ${b.observed}`);
    }

    // ---- aggregate ----
    const cases = loadCases();
    const runBugs = [];
    for (const s of stateResults) {
      if (s.__walk) { runBugs.push(s); continue; }
      const bugs = bugsFromState(s);
      for (const b of bugs) b.screenshot = s.screenshotRel;
      runBugs.push(...bugs);
    }

    // payload check result (run it inline for the report)
    const payloadResult = await runPayload();

    const payloadBugs = payloadResult.findings.map((f) => ({
      scenario: "payload", viewport: "-", net: "-", theme: "-",
      category: f.id, severity: "payload", signature: `payload::${f.id}`,
      expected: "Payload contract holds", observed: f.msg,
    }));

    const { classified, fixed } = reconcile(cases, runBugs, payloadBugs);
    saveCases(cases);
    const reportPath = writeReport({
      classified, fixed, states: stateCount, payloadResult,
      meta: { viewports: VIEWPORTS.map((v) => v.id) },
    });
    log(`\nReport written: ${reportPath}`);
    log(`States: ${stateCount} | NEW: ${classified.filter((c) => c.status === "NEW").length} | STILL BROKEN: ${classified.filter((c) => c.status === "STILL BROKEN").length} | FIXED: ${fixed.length}`);
    // Persist raw results for debugging
    writeFileSync(join(DIRS.results, "states.json"), JSON.stringify(stateResults, null, 2));
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

async function runPayload() {
  const { spawnSync } = await import("node:child_process");
  spawnSync("node", ["payload.check.mjs"], { cwd: new URL(".", import.meta.url).pathname, stdio: "ignore" });
  const { readFileSync } = await import("node:fs");
  return JSON.parse(readFileSync(join(DIRS.results, "payload.json"), "utf8"));
}

main().catch((e) => { console.error(e); process.exit(1); });
