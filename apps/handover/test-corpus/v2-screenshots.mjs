// Drive all payload-v2 / ward-layout flows and save screenshots to .screenshots/
// Usage: node v2-screenshots.mjs  (from test-corpus/, after npm run build in app dir)

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright-core";
import { encodeHandoverPayload } from "../src/utils/payload.js";
import {
  seedScript, runningState, PROFILE, SHIFT, WARD_LAYOUTS, FIXED_NOW, KEYS,
} from "./lib/fixtures.mjs";

const APP_DIR = new URL("..", import.meta.url).pathname;
const SHOT_DIR = join(APP_DIR, ".screenshots");
const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const VP = { width: 375, height: 812 };

const CHROME_CANDIDATES = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
];

async function findChrome() {
  const { accessSync } = await import("node:fs");
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

function sonningLayout() {
  return {
    sections: [
      { id: "s-son-1", type: "range", prefix: "Room ", from: 1, to: 8 },
      { id: "s-son-2", type: "named", items: ["SR 1", "SR 2", "SR 3"] },
    ],
  };
}

async function seedContext(browser, state) {
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
      style.textContent = "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}";
      root.appendChild(style);
    };
    if (document.documentElement) addStyle();
    else document.addEventListener("DOMContentLoaded", addStyle);
  }, FIXED_NOW);
  await context.addInitScript(({ data, theme }) => {
    if (localStorage.getItem("__seeded__")) return;
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    }
    localStorage.setItem("handover_theme_v1", theme);
    localStorage.setItem("__seeded__", "1");
  }, { data, theme });
  return context;
}

async function snap(page, name) {
  mkdirSync(SHOT_DIR, { recursive: true });
  const path = join(SHOT_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log(`  ✓ ${name}.png`);
  return path;
}

async function open(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(350);
}

async function main() {
  console.log("Building screenshots for payload v2 flows…");
  mkdirSync(SHOT_DIR, { recursive: true });

  const chrome = await findChrome();
  const browser = await chromium.launch({
    headless: true,
    executablePath: chrome,
  });

  const server = await startServer();

  try {
    // ---- 1. Handover with ward layouts (Tom) --------------------------------
    console.log("\n1. Handover with layouts");
    {
      const ctx = await seedContext(browser, runningState());
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Hand over or take over").click();
      await page.waitForTimeout(150);
      await page.getByRole("button", { name: /Hand over Share open jobs/ }).click();
      await page.waitForTimeout(300);
      await snap(page, "v2-01-handover-with-jobs");
      await page.evaluate(() => {
        const el = document.querySelector(".shrink-0.border-t.border-gray-200");
        el?.scrollIntoView({ block: "end" });
      });
      await page.waitForTimeout(150);
      await snap(page, "v2-02-handover-layout-hint");
      await ctx.close();
    }

    // ---- 2. Review: new ward layout (default checked) ------------------------
    console.log("\n2. Review — new ward layout (default A)");
    {
      const incomingJobs = [
        { ward: "Sonning", bed: "SR 3", text: "Chase group and save", priority: "urgent" },
        { ward: "Sonning", bed: "Room 2", text: "Review obs chart", priority: "routine" },
      ];
      const code = encodeHandoverPayload({
        jobs: incomingJobs,
        layouts: { Sonning: sonningLayout() },
      });
      const link = `${BASE}?ho=${code}`;

      const ctx = await seedContext(browser, seedScript({
        profile: PROFILE,
        shift: SHIFT,
        jobs: [],
        wardLayouts: {},
        recentWards: [],
      }));
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Hand over or take over").click();
      await page.waitForTimeout(150);
      await page.getByRole("button", { name: /Take over Scan or paste/ }).click();
      await page.waitForTimeout(200);
      await snap(page, "v2-03-scan-paste");
      await page.getByPlaceholder("Or paste the handover link").fill(link);
      await page.getByRole("button", { name: "Go", exact: true }).click();
      await page.waitForTimeout(350);
      await page.getByText("Review before it lands").waitFor({ timeout: 5000 });
      await snap(page, "v2-04-review-new-ward-checked");
      await ctx.close();
    }

    // ---- 3. Review: existing ward — conflict UI ------------------------------
    console.log("\n3. Review — existing ward conflict");
    {
      const incomingJobs = [
        { ward: "Delivery Suite", bed: "Room 99", text: "Unknown bed task", priority: "routine" },
      ];
      const code = encodeHandoverPayload({
        jobs: incomingJobs,
        layouts: WARD_LAYOUTS,
      });
      const link = `${BASE}?ho=${code}`;

      const ctx = await seedContext(browser, runningState());
      const page = await ctx.newPage();
      await open(page);
      await page.goto(link, { waitUntil: "load" });
      await page.waitForTimeout(400);
      await page.getByText("Review before it lands").waitFor({ timeout: 5000 });
      await snap(page, "v2-05-review-existing-ward-unchecked");
      // Enable layout import for existing ward (checkbox defaults off)
      await page.locator('input[type="checkbox"]').first().check();
      await page.waitForTimeout(200);
      await snap(page, "v2-06-review-conflict-prompt");
      await page.getByRole("button", { name: "Keep mine" }).click();
      await page.waitForTimeout(200);
      await snap(page, "v2-07-review-keep-mine-mismatch");
      await page.getByRole("button", { name: "Pick bed" }).click();
      await page.waitForTimeout(250);
      await snap(page, "v2-08-review-bed-picker");
      await ctx.close();
    }

    // ---- 4. Review: Use theirs ------------------------------------------------
    console.log("\n4. Review — use theirs");
    {
      const code = encodeHandoverPayload({
        jobs: [{ ward: "Ward 42", bed: "A1", text: "New bay task", priority: "urgent" }],
        layouts: WARD_LAYOUTS,
      });
      const ctx = await seedContext(browser, seedScript({
        profile: PROFILE, shift: SHIFT, jobs: [], wardLayouts: {},
      }));
      const page = await ctx.newPage();
      await page.goto(`${BASE}?ho=${code}`, { waitUntil: "load" });
      await page.waitForTimeout(400);
      await page.getByRole("button", { name: /^Add/ }).click();
      await page.waitForTimeout(400);
      await snap(page, "v2-09-merged-jobs-and-layout");
      await ctx.close();
    }

    // ---- 5. Manage wards → Share ---------------------------------------------
    console.log("\n5. Share ward setup");
    {
      const ctx = await seedContext(browser, runningState());
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("More options").click();
      await page.waitForTimeout(350);
      await page.getByText("Manage wards").click();
      await page.waitForTimeout(400);
      await snap(page, "v2-10-manage-wards-share-btn");
      await page.getByRole("button", { name: "Share" }).first().click();
      await page.waitForTimeout(400);
      await snap(page, "v2-11-share-ward-sheet");
      await ctx.close();
    }

    // ---- 6. Layout-only import ------------------------------------------------
    console.log("\n6. Layout-only import");
    {
      const code = encodeHandoverPayload({
        jobs: [],
        layouts: { Sonning: sonningLayout() },
      });
      const ctx = await seedContext(browser, seedScript({
        profile: PROFILE, shift: SHIFT, jobs: [], wardLayouts: {},
      }));
      const page = await ctx.newPage();
      await page.goto(`${BASE}?ho=${code}`, { waitUntil: "load" });
      await page.waitForTimeout(400);
      await page.getByText("Import bed layout").waitFor({ timeout: 5000 });
      await snap(page, "v2-12-layout-only-review");
      await page.getByRole("button", { name: "Add to my wards" }).click();
      await page.waitForTimeout(400);
      await snap(page, "v2-13-layout-only-merged");
      await ctx.close();
    }

    // ---- 7. Wards intro — scan ward setup ------------------------------------
    console.log("\n7. Onboarding scan ward setup");
    {
      const ctx = await seedContext(browser, seedScript({
        profile: PROFILE,
        shift: null,
        jobs: [],
        wardLayouts: {},
        coachDone: true,
      }));
      const page = await ctx.newPage();
      await open(page);
      await page.getByRole("button", { name: "Start a shift" }).click();
      await page.waitForTimeout(300);
      await page.locator("button").filter({ hasText: /^Day$/ }).click();
      await page.waitForTimeout(400);
      await page.getByText("Add your wards").waitFor({ timeout: 5000 });
      await snap(page, "v2-14-wards-intro");
      await page.getByRole("button", { name: "Scan ward setup code" }).click();
      await page.waitForTimeout(350);
      await snap(page, "v2-15-wards-intro-scan");
      await ctx.close();
    }

    // ---- 8. Exchange sheet (prior feature, quick verify) ---------------------
    console.log("\n8. Exchange sheet (filled handover button)");
    {
      const ctx = await seedContext(browser, runningState());
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel("Hand over or take over").click();
      await page.waitForTimeout(300);
      await snap(page, "v2-16-exchange-sheet");
      await ctx.close();
    }

    console.log(`\nDone. Screenshots in ${SHOT_DIR}`);
  } finally {
    browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
