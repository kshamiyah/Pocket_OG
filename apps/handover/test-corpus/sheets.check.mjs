// Sheet dismissal check: every header sheet must fully unmount when dismissed,
// in any order. Regression guard for sibling sheets sharing a React key, which
// left a dead full-screen overlay swallowing every tap (the app looked frozen).
//
// Usage: node sheets.check.mjs   (app must be built)

import { spawn } from "node:child_process";
import { accessSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright-core";
import { runningState } from "./lib/fixtures.mjs";
import { viteBin } from "./lib/vite-bin.mjs";

const APP_DIR = new URL("..", import.meta.url).pathname;
const PORT = 4184;
const BASE = `http://localhost:${PORT}/`;

const CHROME = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
].find((p) => { try { accessSync(p); return true; } catch { return false; } });

const SHEETS = [
  { id: "notifications", label: /notification/i },
  { id: "exchange", label: "Exchange" },
  { id: "menu", label: "More options" },
];

async function startServer() {
  const proc = spawn(
    viteBin(APP_DIR),
    ["preview", "--port", String(PORT), "--strictPort"],
    { cwd: APP_DIR, stdio: "ignore" }
  );
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return proc; } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error("preview server did not start");
}

async function seededPage(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
  });
  const page = await context.newPage();
  const { data, theme } = runningState();
  await page.addInitScript(([d, t]) => {
    for (const [k, v] of Object.entries(d)) localStorage.setItem(k, JSON.stringify(v));
    localStorage.setItem("handover_theme_v1", t);
  }, [data, theme]);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await sleep(600);
  return { context, page };
}

const openOverlays = (page) => page.locator("div.fixed.inset-0.z-50").count();

async function openAndClose(page, sheet) {
  await page.getByLabel(sheet.label).first().click({ timeout: 5000 });
  await sleep(420);
  if ((await openOverlays(page)) !== 1) {
    throw new Error(`${sheet.id}: sheet did not open`);
  }
  await page.getByRole("button", { name: /^(Close|Cancel)$/ }).last().click({ timeout: 5000 });
  await sleep(700);
  const left = await openOverlays(page);
  if (left !== 0) {
    throw new Error(`${sheet.id}: ${left} overlay still mounted after dismiss (taps are blocked)`);
  }
}

async function main() {
  if (!CHROME) throw new Error("no chromium executable found");
  const server = await startServer();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const failures = [];

  try {
    // Every ordered pair: opening sheet B after sheet A must still dismiss cleanly.
    for (const first of SHEETS) {
      for (const second of SHEETS) {
        if (first.id === second.id) continue;
        const { context, page } = await seededPage(browser);
        const order = `${first.id} → ${second.id}`;
        try {
          await openAndClose(page, first);
          await openAndClose(page, second);
          // The header must still be reachable once both sheets are dismissed.
          await page.getByRole("button", { name: "All jobs" }).click({ timeout: 5000 });
          console.log(`✓ ${order}`);
        } catch (e) {
          const msg = String(e).split("\n")[0];
          failures.push(`${order}: ${msg}`);
          console.log(`✗ ${order}: ${msg}`);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(failures.length === 0
    ? "\n✓ All sheets dismiss cleanly in every order."
    : `\n✗ ${failures.length} failing order(s):\n- ${failures.join("\n- ")}`);
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
