// Takes screenshots of the live project sites for the portfolio.
//
// For every site it works out whether there is a dark and a light theme:
//   1. it loads the page once with the browser set to dark and once set to light,
//   2. if the site ignores that, it looks for a theme toggle button and clicks it,
//   3. it measures the real brightness of what was drawn, so it never mislabels a shot.
// Sites with two themes get <slug>-<n>-dark.jpg and <slug>-<n>-light.jpg, the portfolio
// shows the one that matches the visitor's theme. Single-theme sites get <slug>-<n>.jpg.
//
//   npm i -D playwright
//   node scripts/capture-projects.mjs                  (all sites)
//   node scripts/capture-projects.mjs --only muse      (one site)
//   node scripts/capture-projects.mjs --url https://example.com --slug demo
//
// It uses the Chrome you already have installed. If that fails, run
// `npx playwright install chromium` once and try again.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const SITES = [
  { slug: "muse", url: "https://muse-studentsvoice.lovable.app/" },
  { slug: "arthra", url: "https://arthrafin-7qakibfj.manus.space/" },
  { slug: "ittige", url: "https://ittige.vercel.app/" },
  { slug: "o-patience", url: "https://sort-visually-abhirai2006.lovable.app/" },
  { slug: "binary-search", url: "https://binarysearch-abhirai.netlify.app/" },
  { slug: "git-viva", url: "https://git-github-by-abhirai2006.netlify.app/" },
];

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const OUT = arg("out") ?? "public/media/live";
const PER_SITE = Number(arg("shots") ?? 3);
const VIEW = { width: 1600, height: 900 };
const sites = arg("url")
  ? [{ slug: arg("slug") ?? "site", url: arg("url") }]
  : SITES.filter((s) => !arg("only") || s.slug === arg("only"));

mkdirSync(OUT, { recursive: true });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch() {
  const executablePath = process.env.CHROME_PATH;
  if (executablePath) return chromium.launch({ executablePath, args: ["--no-sandbox"] });
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return await chromium.launch();
  }
}

const browser = await launch();
const helper = await (await browser.newContext()).newPage(); // used only to measure brightness

/** Average brightness (0 dark, 1 light) of a screenshot. */
async function brightness(png) {
  return helper.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 48;
    c.height = 27;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, 48, 27);
    const d = g.getImageData(0, 0, 48, 27).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4)
      sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    return sum / (d.length / 4) / 255;
  }, png.toString("base64"));
}

async function openPage(url, colorScheme) {
  const context = await browser.newContext({ viewport: VIEW, colorScheme, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  // hide the hosting badge some free hosts add to the corner of the page
  await page
    .addStyleTag({
      content:
        'a[href*="lovable.dev"][href*="badge"], a[href*="lovable-badge"], [id*="lovable-badge"] { display: none !important; }',
    })
    .catch(() => {});
  await pause(2500); // let intro animations settle
  return page;
}

async function top(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(500);
  return page.screenshot({ type: "png" });
}

/** Look for a theme toggle and click it. Returns true if something was clicked. */
async function toggleTheme(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const selectors = [
    '[aria-label*="theme" i]',
    '[aria-label*="dark" i]',
    '[aria-label*="light" i]',
    '[aria-label*="mode" i]',
    '[title*="theme" i]',
    '[title*="mode" i]',
    "[data-theme-toggle], #theme-toggle, .theme-toggle, #themeToggle",
    'button:has-text("Dark")',
    'button:has-text("Light")',
    'button:has-text("Theme")',
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if ((await el.count()) && (await el.isVisible().catch(() => false))) {
      await el.click({ timeout: 3000 }).catch(() => {});
      await pause(1200);
      return true;
    }
  }
  // last resort: flip the usual class and attribute
  await page.evaluate(() => {
    const r = document.documentElement;
    const wasDark = r.classList.contains("dark") || r.dataset.theme === "dark";
    r.classList.toggle("dark", !wasDark);
    r.classList.toggle("light", wasDark);
    r.dataset.theme = wasDark ? "light" : "dark";
  });
  await pause(800);
  return true;
}

/** Screenshots down the page: the top, then about one screen further each time. */
async function grab(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const shots = [];
  for (let k = 0; k < PER_SITE; k++) {
    const y = Math.round(VIEW.height * 0.95 * k);
    if (k > 0 && y > total - VIEW.height * 0.5) break;
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await pause(900); // lets lazy content and reveal animations show up
    shots.push(await page.screenshot({ type: "jpeg", quality: 82 }));
  }
  return shots;
}

const save = (name, buf) => {
  writeFileSync(`${OUT}/${name}`, buf);
  console.log("  saved", name);
};

for (const { slug, url } of sites) {
  console.log(`\n${slug}  ${url}`);
  try {
    const dark = await openPage(url, "dark");
    const light = await openPage(url, "light");
    const [bd, bl] = [await brightness(await top(dark)), await brightness(await top(light))];

    if (Math.abs(bd - bl) > 0.2) {
      // the site follows the browser's colour scheme
      console.log(`  follows the browser theme (dark ${bd.toFixed(2)}, light ${bl.toFixed(2)})`);
      (await grab(dark)).forEach((b, i) => save(`${slug}-${i + 1}-dark.jpg`, b));
      (await grab(light)).forEach((b, i) => save(`${slug}-${i + 1}-light.jpg`, b));
    } else {
      // the site ignores the browser setting: try its own toggle
      const first = await brightness(await top(dark));
      const firstShots = await grab(dark);
      await toggleTheme(dark);
      const second = await brightness(await top(dark));
      if (Math.abs(first - second) > 0.2) {
        console.log(`  has a theme toggle (${first.toFixed(2)} then ${second.toFixed(2)})`);
        const secondShots = await grab(dark);
        const [darkShots, lightShots] =
          first < second ? [firstShots, secondShots] : [secondShots, firstShots];
        darkShots.forEach((b, i) => save(`${slug}-${i + 1}-dark.jpg`, b));
        lightShots.forEach((b, i) => save(`${slug}-${i + 1}-light.jpg`, b));
      } else {
        console.log("  one theme only");
        firstShots.forEach((b, i) => save(`${slug}-${i + 1}.jpg`, b));
      }
    }
    await dark.context().close();
    await light.context().close();
  } catch (err) {
    console.log(`  FAILED: ${err.message.split("\n")[0]}`);
  }
}

await browser.close();
console.log(
  `\nDone. Look through ${OUT}/ and delete any shot you do not like, then commit the folder.`,
);
