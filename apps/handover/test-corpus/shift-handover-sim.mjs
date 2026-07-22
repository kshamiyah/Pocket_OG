// Two-doctor shift handover simulation: long day → night takeover.
// Usage: node shift-handover-sim.mjs  (from test-corpus/, app must be built)

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { accessSync } from "node:fs";
import { chromium } from "playwright-core";
import { encodeHandoverPayload } from "../src/utils/payload.js";
import { seedScript, KEYS, FIXED_NOW } from "./lib/fixtures.mjs";

const APP_DIR = new URL("..", import.meta.url).pathname;
const OUT_DIR = join(APP_DIR, ".screenshots", "shift-sim");
const PORT = 4180;
const BASE = `http://localhost:${PORT}/`;
const VP = { width: 390, height: 844 };

const CHROME_CANDIDATES = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
];

const DAY_PROFILE = { name: "Priya", role: "reg" };
const NIGHT_PROFILE = { name: "Alex", role: "sho" };
const DAY_SHIFT = { type: "long", startedAt: "2026-07-22T08:00:00.000Z" };

const WARD_LAYOUTS = {
  DS: {
    sections: [
      { id: "s-ds-1", type: "range", prefix: "SR ", from: 1, to: 6 },
      { id: "s-ds-2", type: "named", items: ["General"] },
    ],
  },
  Iffley: {
    sections: [
      { id: "s-if-1", type: "range", prefix: "Room ", from: 1, to: 10 },
      { id: "s-if-2", type: "named", items: ["Annex 1", "Annex 2"] },
    ],
  },
  Sonning: {
    sections: [
      { id: "s-so-1", type: "grid", bayKind: "letter", bedKind: "number", bays: ["A", "B", "C"], perBay: 4 },
      { id: "s-so-2", type: "range", prefix: "SR ", from: 1, to: 4 },
    ],
  },
};

function iso(offsetMin) {
  return new Date(FIXED_NOW + offsetMin * 60000).toISOString();
}

function buildDayJobs() {
  const specs = [
    ["Chase FBC + G&S, escalate if Hb < 70", "DS", "SR 1", "urgent", false, -480, -15],
    ["Review CTG trace", "DS", "SR 2", "routine", false, -460, null],
    ["Site epidural, anaesthetist aware", "DS", "SR 3", "routine", false, -440, 45],
    ["Consent for LSCS", "DS", "General", "urgent", false, -420, null],
    ["Update drug chart post-op", "DS", "SR 4", "routine", true, -600, null],
    ["Remove catheter AM", "DS", "SR 5", "routine", false, -400, 90],
    ["Diabetic review + sliding scale", "Iffley", "Room 3", "urgent", false, -380, -5],
    ["Chase MSU culture", "Iffley", "Room 7", "routine", false, -360, null],
    ["PV loss review, speculum if needed", "Iffley", "Room 2", "urgent", false, -340, null],
    ["TTOs and discharge letter", "Iffley", "Room 9", "routine", true, -720, null],
    ["Obs round + MEOWS", "Iffley", "Annex 1", "routine", false, -320, 30],
    ["Registrar review post-EMCS", "Sonning", "A2", "urgent", false, -300, null],
    ["Baby blood sugar 2h", "Sonning", "B1", "routine", false, -280, 60],
    ["Cannula care + flush", "Sonning", "C3", "routine", false, -260, null],
    ["Ward round bloods before post-take", "Sonning", "SR 2", "routine", false, -240, null],
    ["Call obstetric reg re reduced FM", "Sonning", "A4", "urgent", false, -220, -2],
    ["Pharmacy query on gentamicin", "", "", "routine", false, -200, null],
    ["Handover board update for maternity co-ordinator", "", "", "routine", false, -180, null],
    ["Review scan report in notes", "Iffley", "Room 5", "routine", false, -160, null],
    ["Chase cord gases", "DS", "SR 6", "urgent", false, -140, null],
  ];
  return specs.map(([text, ward, bed, priority, done, createdOffset, remindOffset], i) => ({
    id: i + 1,
    text,
    ward,
    bed,
    priority,
    done,
    createdAt: iso(createdOffset),
    ...(remindOffset != null ? { remindAt: iso(remindOffset) } : {}),
  }));
}

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    try { accessSync(p); return p; } catch { /* next */ }
  }
  return undefined;
}

async function startServer() {
  const proc = spawn(
    join(APP_DIR, "../../node_modules/.bin/vite"),
    ["preview", "--port", String(PORT), "--strictPort"],
    { cwd: APP_DIR, stdio: "ignore" },
  );
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return proc;
    } catch { /* wait */ }
    await sleep(500);
  }
  throw new Error("preview server did not start");
}

async function seedContext(browser, state, tag) {
  const context = await browser.newContext({
    viewport: VP,
    deviceScaleFactor: 2,
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const { data, theme } = state;
  await context.addInitScript((fixed) => {
    const RealDate = Date;
    class FakeDate extends RealDate {
      constructor(...args) { if (args.length === 0) super(fixed); else super(...args); }
      static now() { return fixed; }
    }
    window.Date = FakeDate;
    const addStyle = () => {
      const root = document.head || document.documentElement;
      if (!root) return;
      const style = document.createElement("style");
      style.textContent = "*,*::before,*::after{transition-duration:0.05s!important;animation-duration:0.05s!important}";
      root.appendChild(style);
    };
    if (document.documentElement) addStyle();
    else document.addEventListener("DOMContentLoaded", addStyle);
  }, FIXED_NOW);
  await context.addInitScript(({ data, theme, tag }) => {
    if (localStorage.getItem("__seeded__")) return;
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    }
    localStorage.setItem("handover_theme_v1", theme);
    localStorage.setItem("__seeded__", tag);
  }, { data, theme, tag });
  return context;
}

function attachDiagnostics(page, report) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      report.issues.push({ kind: "console", text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    report.issues.push({ kind: "pageerror", text: String(err) });
  });
  page.on("requestfailed", (req) => {
    report.issues.push({ kind: "request", text: `${req.method()} ${req.url()} — ${req.failure()?.errorText}` });
  });
}

async function snap(page, report, name) {
  mkdirSync(OUT_DIR, { recursive: true });
  const path = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  report.screenshots.push(name);
  return path;
}

async function step(report, label, fn, { critical = false } = {}) {
  try {
    await fn();
    report.steps.push({ label, ok: true });
    return true;
  } catch (err) {
    report.steps.push({ label, ok: false, error: String(err) });
    report.issues.push({ kind: "step", step: label, text: String(err) });
    if (critical) throw err;
    return false;
  }
}

async function wardButton(page, name) {
  return page.locator("button").filter({
    has: page.getByText(name, { exact: true }),
  }).first();
}

async function open(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(400);
}

async function clickExchange(page) {
  await page.getByLabel("Exchange").click();
  await page.waitForTimeout(250);
}

async function readClipboard(page) {
  return page.evaluate(async () => {
    try { return await navigator.clipboard.readText(); } catch { return null; }
  });
}

async function runDayDoctor(browser) {
  const report = {
    doctor: "Dr Priya (long day)",
    role: "Registrar · long day shift",
    steps: [],
    issues: [],
    screenshots: [],
    notes: [],
  };

  const dayJobs = buildDayJobs();
  const ctx = await seedContext(browser, seedScript({
    profile: DAY_PROFILE,
    shift: DAY_SHIFT,
    jobs: dayJobs,
    wardLayouts: WARD_LAYOUTS,
    recentWards: ["DS", "Iffley", "Sonning"],
    recentBeds: {
      DS: ["SR 1", "SR 3", "General"],
      Iffley: ["Room 3", "Room 7"],
      Sonning: ["A2", "B1"],
    },
    recentPhrases: ["Chase bloods", "Review CTG", "Consent"],
  }), "day");

  const page = await ctx.newPage();
  attachDiagnostics(page, report);

  try {
    await step(report, "Open job list", async () => {
      await open(page);
      await snap(page, report, "day-01-job-list-by-ward");
    });

    await step(report, "Switch to All jobs", async () => {
      await page.getByRole("button", { name: "All jobs" }).click();
      await page.waitForTimeout(300);
      await snap(page, report, "day-02-all-jobs");
    });

    await step(report, "Drill DS ward", async () => {
      await page.getByRole("button", { name: "By ward" }).click();
      await page.waitForTimeout(200);
      await (await wardButton(page, "DS")).click();
      await page.waitForTimeout(300);
      await snap(page, report, "day-03-ward-ds");
    });

    await step(report, "Open notifications (due reminders)", async () => {
      const bell = page.getByLabel(/tasks due|Notifications/i);
      await bell.click();
      await page.waitForTimeout(300);
      await snap(page, report, "day-04-notifications");
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page.waitForTimeout(200);
    });

    await step(report, "End shift summary", async () => {
      await clickExchange(page);
      await page.getByRole("button", { name: "End shift" }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "day-05-end-shift-summary");
    });

    await step(report, "Hand over and end shift", async () => {
      await page.getByRole("button", { name: "Hand over and end shift" }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "day-06-handover-screen");
    });

    await step(report, "Scroll handover job list", async () => {
      await page.evaluate(() => {
        const scroll = document.querySelector(".overflow-y-auto");
        scroll?.scrollTo(0, scroll.scrollHeight);
      });
      await page.waitForTimeout(200);
      await snap(page, report, "day-07-handover-jobs-scrolled");
    });

    let handoverLink = null;
    await step(report, "Copy handover link", async () => {
      await page.getByRole("button", { name: /Copy link|Share link/ }).click();
      await page.waitForTimeout(300);
      handoverLink = await readClipboard(page);
      if (!handoverLink?.includes("ho=")) {
        const stored = await page.evaluate(() => ({
          jobs: JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]"),
          layouts: JSON.parse(localStorage.getItem("handover_ward_layouts_v1") || "{}"),
        }));
        const openJobs = stored.jobs.filter((j) => !j.done);
        const code = encodeHandoverPayload({ jobs: openJobs, layouts: stored.layouts });
        handoverLink = `${BASE}?ho=${code}`;
        report.notes.push("Clipboard empty; rebuilt link from localStorage.");
      }
      await snap(page, report, "day-08-handover-qr");
    });

    await step(report, "Finish shift", async () => {
      await page.getByRole("button", { name: "Finish shift" }).click();
      await page.waitForTimeout(500);
      await snap(page, report, "day-09-shift-ended-hub");
    });

    report.handoverLink = handoverLink;
    report.stats = {
      jobsTotal: dayJobs.length,
      jobsOpen: dayJobs.filter((j) => !j.done).length,
      wards: Object.keys(WARD_LAYOUTS).length,
    };
  } catch (err) {
    report.notes.push(`Simulation aborted: ${err.message}`);
    await snap(page, report, "day-ERROR").catch(() => {});
  } finally {
    if (!report.handoverLink) {
      const openJobs = dayJobs.filter((j) => !j.done);
      const code = encodeHandoverPayload({ jobs: openJobs, layouts: WARD_LAYOUTS });
      report.handoverLink = `${BASE}?ho=${code}`;
      report.notes.push("Fallback: encoded handover link from seed data.");
    }
    await ctx.close();
  }

  return report;
}

async function runNightDoctor(browser, handoverLink) {
  const report = {
    doctor: "Dr Alex (night)",
    role: "SHO / CT · new to site, no wards",
    steps: [],
    issues: [],
    screenshots: [],
    notes: [],
  };

  const ctx = await seedContext(browser, seedScript({
    profile: NIGHT_PROFILE,
    shift: null,
    jobs: [],
    wardLayouts: {},
    recentWards: [],
    recentBeds: {},
    recentPhrases: [],
  }), "night");

  const page = await ctx.newPage();
  attachDiagnostics(page, report);

  try {
    await step(report, "Open hub (no active shift)", async () => {
      await open(page);
      await snap(page, report, "night-01-hub");
    });

    await step(report, "Start night shift", async () => {
      await page.getByRole("button", { name: "Start a shift" }).click();
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: "Night", exact: true }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "night-02-wards-intro");
    });

    await step(report, "Skip ward setup (empty)", async () => {
      await page.getByRole("button", { name: "Skip for now" }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "night-03-empty-list");
    });

    await step(report, "Take over via pasted link", async () => {
      await clickExchange(page);
      await page.getByRole("button", { name: /Take over/ }).click();
      await page.waitForTimeout(300);
      await snap(page, report, "night-04-scan-paste");
      await page.getByPlaceholder("Or paste the handover link").fill(handoverLink);
      await page.getByRole("button", { name: "Go", exact: true }).click();
      await page.waitForTimeout(500);
    });

    await step(report, "Review incoming jobs + layouts", async () => {
      await page.getByText("Review before it lands").waitFor({ timeout: 8000 });
      await snap(page, report, "night-05-review-top");
      await page.evaluate(() => {
        const scroll = document.querySelector(".overflow-y-auto");
        scroll?.scrollTo(0, scroll.scrollHeight / 2);
      });
      await page.waitForTimeout(200);
      await snap(page, report, "night-06-review-layouts");
    });

    await step(report, "Accept takeover", async () => {
      const addBtn = page.getByRole("button", { name: /Add .* to my list/ });
      await addBtn.click();
      await page.waitForTimeout(600);
      await snap(page, report, "night-07-after-merge");
    });

    await step(report, "Verify three wards on list", async () => {
      for (const ward of ["DS", "Iffley", "Sonning"]) {
        await (await wardButton(page, ward)).waitFor({ timeout: 8000 });
      }
      await snap(page, report, "night-08-three-wards");
    });

    await step(report, "Drill Iffley + Manage ward", async () => {
      await (await wardButton(page, "Iffley")).click();
      await page.waitForTimeout(300);
      await snap(page, report, "night-09-iffley-beds");
      await page.getByRole("button", { name: "Manage ward" }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "night-10-iffley-setup");
      await page.getByRole("button", { name: "← Back" }).click();
      await page.waitForTimeout(200);
      await page.getByRole("button", { name: "← Wards" }).click();
      await page.waitForTimeout(200);
    });

    await step(report, "All jobs view", async () => {
      await page.getByRole("button", { name: "All jobs" }).click();
      await page.waitForTimeout(300);
      await snap(page, report, "night-11-all-jobs");
    });

    await step(report, "Add job on inherited ward", async () => {
      await page.getByLabel("Add job").click();
      await page.waitForTimeout(400);
      await snap(page, report, "night-12-add-job-wizard");
      await page.locator('input[type="text"]').first().fill("Night review obs chart");
      await page.getByRole("button", { name: "Next" }).click();
      await page.waitForTimeout(300);
      await (await wardButton(page, "Iffley")).click();
      await page.waitForTimeout(200);
      await page.getByRole("button", { name: "Next" }).click();
      await page.waitForTimeout(200);
      await page.getByRole("button", { name: /Add job|Save/ }).last().click();
      await page.waitForTimeout(500);
      await snap(page, report, "night-13-job-added");
    });

    await step(report, "Manage wards menu", async () => {
      await page.getByLabel("More options").click();
      await page.waitForTimeout(250);
      await snap(page, report, "night-14-menu");
      await page.getByRole("button", { name: "Manage wards" }).click();
      await page.waitForTimeout(400);
      await snap(page, report, "night-15-manage-wards");
    });

    const stored = await page.evaluate(() => ({
      jobs: JSON.parse(localStorage.getItem("handover_jobs_v1") || "[]"),
      layouts: JSON.parse(localStorage.getItem("handover_ward_layouts_v1") || "{}"),
    }));
    report.stats = {
      jobsImported: stored.jobs.length,
      wardsImported: Object.keys(stored.layouts).length,
      wardNames: Object.keys(stored.layouts),
    };
  } catch (err) {
    report.notes.push(`Simulation aborted: ${err.message}`);
    await snap(page, report, "night-ERROR").catch(() => {});
  } finally {
    await ctx.close();
  }

  return report;
}

function writeReport(day, night) {
  const md = `# Shift handover simulation

## Dr Priya (long day)
- Jobs: ${day.stats?.jobsTotal ?? "?"} total, ${day.stats?.jobsOpen ?? "?"} open across ${day.stats?.wards ?? "?"} wards
- Steps: ${day.steps.filter((s) => s.ok).length}/${day.steps.length} passed
- Issues: ${day.issues.length}

## Dr Alex (night)
- Imported: ${night.stats?.jobsImported ?? "?"} jobs, ${night.stats?.wardsImported ?? "?"} wards (${(night.stats?.wardNames || []).join(", ")})
- Steps: ${night.steps.filter((s) => s.ok).length}/${night.steps.length} passed
- Issues: ${night.issues.length}

## Screenshots
${[...day.screenshots, ...night.screenshots].map((s) => `- ${s}.png`).join("\n")}
`;
  writeFileSync(join(OUT_DIR, "REPORT.md"), md);
  writeFileSync(join(OUT_DIR, "report.json"), JSON.stringify({ day, night }, null, 2));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Shift handover simulation…");
  const chrome = findChrome();
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const server = await startServer();

  try {
    console.log("\n=== Dr Priya (long day) ===");
    const day = await runDayDoctor(browser);
    console.log(`  steps ${day.steps.filter((s) => s.ok).length}/${day.steps.length}, issues ${day.issues.length}`);

    if (!day.handoverLink) {
      console.warn("Day doctor UI handover failed; using seed fallback if present.");
    }

    console.log("\n=== Dr Alex (night) ===");
    const night = await runNightDoctor(browser, day.handoverLink);
    console.log(`  steps ${night.steps.filter((s) => s.ok).length}/${night.steps.length}, issues ${night.issues.length}`);

    writeReport(day, night);
    console.log(`\nDone. Output: ${OUT_DIR}`);
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
