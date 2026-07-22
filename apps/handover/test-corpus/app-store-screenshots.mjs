// App Store screenshots (6.7" iPhone: 430×932 @3x → 1290×2796).
// Usage: node app-store-screenshots.mjs  (from test-corpus/, app must be built)

import { spawn } from "node:child_process";
import { accessSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright-core";
import { encodeHandoverPayload } from "../src/utils/payload.js";
import { seedScript, FIXED_NOW } from "./lib/fixtures.mjs";

const APP_DIR = new URL("..", import.meta.url).pathname;
const OUT_DIR = join(APP_DIR, ".screenshots", "app-store");
const PORT = 4181;
const BASE = `http://localhost:${PORT}/`;
const VP = { width: 430, height: 932 };

const CHROME_CANDIDATES = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1148/chrome-mac/Chromium.app/Contents/MacOS/Chromium`,
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
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
    ["Pharmacy query on gentamicin", "", "", "routine", false, -200, null],
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

async function seedContext(browser, state, tag) {
  const context = await browser.newContext({
    viewport: VP,
    deviceScaleFactor: 3,
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

function midShiftState(theme) {
  return seedScript({
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
    theme,
  });
}

async function snap(page, name) {
  mkdirSync(OUT_DIR, { recursive: true });
  const path = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log(`  ✓ ${name}.png (${VP.width * 3}×${VP.height * 3})`);
  return path;
}

async function open(page, url = BASE) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(450);
}

async function wardButton(page, name) {
  return page.locator("button").filter({
    has: page.getByText(name, { exact: true }),
  }).first();
}

async function clickExchange(page) {
  await page.getByLabel("Exchange").click();
  await page.waitForTimeout(250);
}

async function main() {
  console.log("Capturing App Store screenshots…");
  mkdirSync(OUT_DIR, { recursive: true });

  const chrome = findChrome();
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const server = await startServer();

  try {
    // 1. Start shift — light
    console.log("\n1. Start shift (light)");
    {
      const ctx = await seedContext(browser, seedScript({
        profile: PROFILE,
        shift: null,
        jobs: [],
        wardLayouts: {},
        theme: "light",
      }), "start-light");
      const page = await ctx.newPage();
      await open(page);
      await page.getByRole("button", { name: "Start a shift" }).click();
      await page.waitForTimeout(400);
      await page.getByText("Starting a shift?").waitFor({ timeout: 5000 });
      await snap(page, "01-start-shift");
      await ctx.close();
    }

    // 2. By ward — light
    // 4. All jobs — light
    // 7. End shift summary — light
    console.log("\n2–4, 7. Job list views + end shift (light)");
    {
      const ctx = await seedContext(browser, midShiftState("light"), "list-light");
      const page = await ctx.newPage();
      await open(page);
      await snap(page, "02-by-ward");

      await page.getByRole("button", { name: "All jobs" }).click();
      await page.waitForTimeout(350);
      await snap(page, "04-all-jobs");

      await clickExchange(page);
      await page.getByRole("button", { name: "End shift" }).click();
      await page.waitForTimeout(450);
      await page.getByText("End shift").first().waitFor({ timeout: 5000 });
      await snap(page, "07-end-shift-summary");
      await ctx.close();
    }

    // 3. Ward drill — dark
    console.log("\n3. Ward drill (dark)");
    {
      const ctx = await seedContext(browser, midShiftState("dark"), "ward-dark");
      const page = await ctx.newPage();
      await open(page);
      await (await wardButton(page, "DS")).click();
      await page.waitForTimeout(400);
      await snap(page, "03-ward-drill");
      await ctx.close();
    }

    // 5. Handover QR — dark
    console.log("\n5. Handover QR (dark)");
    {
      const ctx = await seedContext(browser, midShiftState("dark"), "handover-dark");
      const page = await ctx.newPage();
      await open(page);
      await clickExchange(page);
      await page.getByRole("button", { name: "End shift" }).click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: "Hand over and end shift" }).click();
      await page.waitForTimeout(600);
      await page.getByText(/Tap the code to enlarge|Show this to whoever/).waitFor({ timeout: 8000 });
      await snap(page, "05-handover-qr");
      await ctx.close();
    }

    // 8. Ward setup — light
    console.log("\n8. Ward setup (light)");
    {
      const ctx = await seedContext(browser, midShiftState("light"), "setup-light");
      const page = await ctx.newPage();
      await open(page);
      await (await wardButton(page, "DS")).click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: "Manage ward" }).click();
      await page.waitForTimeout(450);
      await page.getByText("Set up DS").waitFor({ timeout: 5000 });
      await page.getByText("Numbered range").first().click();
      await page.waitForTimeout(300);
      await snap(page, "08-ward-setup");
      await ctx.close();
    }

    // 6. Takeover review — dark
    console.log("\n6. Takeover review (dark)");
    {
      const openJobs = JOBS.filter((j) => !j.done);
      const code = encodeHandoverPayload({ jobs: openJobs, layouts: WARD_LAYOUTS });
      const link = `${BASE}?ho=${code}`;

      const ctx = await seedContext(browser, seedScript({
        profile: { name: "Alex", role: "sho" },
        shift: { type: "night", startedAt: "2026-07-22T20:00:00.000Z" },
        jobs: [],
        wardLayouts: {},
        recentWards: [],
        theme: "dark",
      }), "review-dark");
      const page = await ctx.newPage();
      await open(page, link);
      await page.getByText("Review before it lands").waitFor({ timeout: 8000 });
      await page.getByText("Ward layouts in this handover").waitFor({ timeout: 5000 });
      await snap(page, "06-takeover-review");
      await ctx.close();
    }

    // 9. Add job wizard — light
    console.log("\n9. Add job wizard (light)");
    {
      const ctx = await seedContext(browser, midShiftState("light"), "addjob-light");
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
      await snap(page, "09-add-job");
      await ctx.close();
    }

    // 10. Notifications — dark
    console.log("\n10. Notifications (dark)");
    {
      const ctx = await seedContext(browser, midShiftState("dark"), "notify-dark");
      const page = await ctx.newPage();
      await open(page);
      await page.getByLabel(/tasks due|Notifications/i).click();
      await page.waitForTimeout(400);
      await page.getByText("Notifications").waitFor({ timeout: 5000 });
      await page.getByText(/\d+ due/).waitFor({ timeout: 5000 });
      await snap(page, "10-notifications");
      await ctx.close();
    }

    console.log(`\nDone. ${OUT_DIR}`);
  } finally {
    browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
