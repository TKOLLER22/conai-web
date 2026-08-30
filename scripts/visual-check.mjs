#!/usr/bin/env node
/**
 * Screenshot a page with the system Chrome (no bundled browser).
 *
 *   node scripts/visual-check.mjs <url> <out.png> [--mobile] [--light] [--scroll=<0..1|#selector>]
 *
 * Used for ad-hoc visual verification of layouts, themes and breakpoints.
 */
import puppeteer from "puppeteer-core";

const CHROME = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
}[process.platform];

const [url, out] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/visual-check.mjs <url> <out.png> [--mobile] [--light] [--scroll=...]");
  process.exit(1);
}
const flags = new Set(process.argv.slice(4));
const scrollArg = [...flags].find((f) => f.startsWith("--scroll="))?.slice(9);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--disable-gpu"] });
const page = await browser.newPage();
if (flags.has("--mobile")) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
} else {
  await page.setViewport({ width: 1456, height: 900 });
}
if (flags.has("--light")) {
  await page.evaluateOnNewDocument(() => localStorage.setItem("conai-theme", "light"));
}
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 900));
if (scrollArg) {
  await page.evaluate((pos) => {
    if (pos.startsWith("#")) document.querySelector(pos)?.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: document.body.scrollHeight * Number(pos), behavior: "instant" });
  }, scrollArg);
  await new Promise((r) => setTimeout(r, 500));
}
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
