// Regenerates docs/screenshots/*.png from a running site.
//   npm i -D playwright && npx playwright install chromium
//   node scripts/screenshots.mjs https://portfolio.abhirai2006.workers.dev
import { chromium } from "playwright";

const URL = process.argv[2] || "https://portfolio.abhirai2006.workers.dev";
const OUT = "docs/screenshots";

const sections = [
  ["02-power-levels", "#arsenal"],
  ["03-live-code", "#github"],
  ["04-projects", "#projects"],
  ["06-ask", "#ask"],
  ["05-anime", "#shelf"],
  ["08-contact", "#contact"],
];

const settle = async (page, ms = 2500) => {
  // scroll through once so lazy sections, images and reveal animations all fire
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(ms);
};

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });

// desktop
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "load" });
await settle(page, 5000); // give the 3D background time to render
await page.screenshot({ path: `${OUT}/01-hero.png` });
for (const [name, sel] of sections) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log("saved", name);
}
await page.close();

// mobile hero
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await m.goto(URL, { waitUntil: "load" });
await settle(m, 4000);
await m.screenshot({ path: `${OUT}/07-mobile-hero.png` });
console.log("saved 07-mobile-hero");

await browser.close();
