// Landing-page carousel screenshots (390×844, light mode).
// Usage: from apps/handover/test-corpus after `npm run build`:
//   node landing-screenshots.mjs
//
// Outputs seven PNGs to public/screenshots/ for early-access.html.

import { spawn } from "node:child_process";
import { accessSync, copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright-core";
import { seedScript, FIXED_NOW } from "./lib/fixtures.mjs";

const APP_DIR = new URL("..", import.meta.url).pathname;
const OUT_DIR = join(APP_DIR, ".screenshots", "landing");
const PUBLIC_DIR = join(APP_DIR, "public", "screenshots");
const PORT = 4182;
const BASE = `http://localhost:${PORT}/`;
const VP = { width: 390, height: 844 };

const CHROME_CANDIDATES = [
  "/usr/local/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
];

const PROFILE = { name: "Priya", role: "reg" };
const SHIFT = { type: "long", startedAt: "2026-07-22T08:00:00.000Z" };

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

function buildJobs() {
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

const JOBS = buildJobs();

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

async function seedContext(browser, tag, overrides = {}) {
  const state = seedScript({
    profile: PROFILE,
    shift: SHIFT,
    jobs: JOBS,
    wardLayouts: WARD_LAYOUTS,
    recentWards: ["DS", "Iffley", "Sonning"],
    recentBeds: {
      DS: ["SR 1", "SR 3", "General"],
      Iffley: ["Room 3", "Room 7"],
      Sonning: ["A2", "B1"],
    },
    recentPhrases: ["Chase bloods", "Review CTG", "Consent"],
    theme: "light",
    ...overrides,
  });
  const context = await browser.newContext({
    viewport: VP,
    deviceScaleFactor: 2,
    permissions: ["clipboard-read", "clipboard-write"],
  });
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
  }, { data: state.data, theme: state.theme, tag });
  return context;
}

async function snap(page, name) {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(PUBLIC_DIR, { recursive: true });
  const file = `${name}.png`;
  const path = join(OUT_DIR, file);
  await page.screenshot({ path, fullPage: false });
  copyFileSync(path, join(PUBLIC_DIR, file));
  console.log(`  ✓ ${file}`);
  return path;
}

async function open(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(500);
}

async function wardButton(page, name) {
  return page.locator("button").filter({
    has: page.getByText(name, { exact: true }),
  }).first();
}

async function main() {
  console.log("Capturing landing carousel screenshots…");
  const chrome = findChrome();
  if (!chrome) throw new Error("No Chrome found");
  console.log(`Using ${chrome}`);

  const browser = await chromium.launch({
    headless: true,
    executablePath: chrome,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const server = await startServer();

  try {
    console.log("\n1. Start shift");
    {
      const ctx = await seedContext(browser, "landing-start", {
        shift: null,
        jobs: [],
        wardLayouts: {},
      });
      const page = await ctx.newPage();
      await open(page);
      await page.getByRole("button", { name: "Start a shift" }).click();
      await page.waitForTimeout(450);
      await page.getByText("Starting a shift?").waitFor({ timeout: 8000 });
      await snap(page, "start-shift");
      await ctx.close();
    }

    console.log("\n2. Bed board");
    {
      const ctx = await seedContext(browser, "landing-board");
      const page = await ctx.newPage();
      await open(page);
      await (await wardButton(page, "DS")).click();
      await page.waitForTimeout(500);
      await snap(page, "bed-board");
      await ctx.close();
    }

    console.log("\n3. Ward setup");
    {
      const ctx = await seedContext(browser, "landing-ward-setup");
      const page = await ctx.newPage();
      await open(page);
      await (await wardButton(page, "DS")).click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: "Manage ward" }).click();
      await page.waitForTimeout(450);
      await page.getByText("Set up DS").waitFor({ timeout: 8000 });
      await page.getByText("Numbered range").first().click();
      await page.waitForTimeout(300);
      await snap(page, "ward-setup");
      await ctx.close();
    }

    console.log("\n4. Add job");
    {
      const ctx = await seedContext(browser, "landing-add-job");
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Add job").click();
      await page.waitForTimeout(400);
      const wizard = page.locator(".rounded-t-3xl");
      await wizard.getByPlaceholder("e.g. Chase repeat FBC").fill("Review CTG trace");
      await wizard.getByRole("button", { name: "Next" }).click();
      await page.waitForTimeout(300);
      await wizard.getByRole("button", { name: "DS", exact: true }).click();
      await page.waitForTimeout(200);
      await wizard.getByRole("button", { name: "Next" }).click();
      await page.waitForTimeout(300);
      await wizard.getByRole("button", { name: "Urgent", exact: true }).click();
      await page.waitForTimeout(250);
      await wizard.getByText("Urgency").waitFor({ timeout: 5000 });
      await snap(page, "add-job");
      await ctx.close();
    }

    console.log("\n5. All jobs");
    {
      const ctx = await seedContext(browser, "landing-jobs");
      const page = await ctx.newPage();
      await open(page);
      await page.getByRole("button", { name: "All jobs" }).click();
      await page.waitForTimeout(450);
      await snap(page, "job-list");
      await ctx.close();
    }

    console.log("\n6. End shift");
    {
      const ctx = await seedContext(browser, "landing-end");
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Exchange").click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: /^End shift/ }).click();
      await page.waitForTimeout(500);
      await page.getByText("End shift").first().waitFor({ timeout: 8000 });
      await snap(page, "end-shift");
      await ctx.close();
    }

    console.log("\n7. Handover");
    {
      const ctx = await seedContext(browser, "landing-handover");
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Exchange").click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: /^Hand over/ }).click();
      await page.waitForTimeout(700);
      await page.getByText("Scan or share").waitFor({ timeout: 10000 });
      await page.getByText("Scan or share").scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await snap(page, "handover");
      await ctx.close();
    }

    console.log(`\nDone.\n  ${PUBLIC_DIR}`);
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
