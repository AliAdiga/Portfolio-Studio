const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const fs = require("fs");
const out = "D:/Projects/Portfolio-Studio/docs/screenshots/";
fs.mkdirSync(out, { recursive: true });
const B = "http://localhost:3820";
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  // desktop: intro frames, final hero, menus, footer
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch (e) {} });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 150)));
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 150)); });
  await p.goto(B + "/", { waitUntil: "domcontentloaded" });
  for (const [i, ms] of [[0, 60], [1, 350], [2, 350], [3, 900]]) {
    await p.waitForTimeout(ms);
    await p.screenshot({ path: out + "nh-intro-" + i + ".png" });
  }
  await p.screenshot({ path: out + "nh-hero-final.png" });
  await p.getByRole("button", { name: "Work", exact: true }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: out + "nh-menu-work.png" });
  await p.getByRole("button", { name: "Services", exact: true }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: out + "nh-menu-services.png" });
  await p.keyboard.press("Escape");
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: out + "nh-footer.png" });
  console.log("errors", errs);
  await ctx.close();
  await b.close();
})();
