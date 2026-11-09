const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const fs = require("fs");
const out = "D:/Projects/Portfolio-Studio/docs/screenshots/";
fs.mkdirSync(out, { recursive: true });
const base = "http://localhost:3770";
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function ctxFor(b, theme, vp, mob, dpr = 1) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob, deviceScaleFactor: dpr });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
  return ctx;
}
const scroll = async (p, sel, offset = 0) => {
  await p.evaluate(([s, o]) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - o); }, [sel, offset]);
  await p.waitForTimeout(1300);
};

(async () => {
  const b = await chromium.launch({ executablePath: exe });
  for (const theme of ["light", "dark"]) {
    const ctx = await ctxFor(b, theme, { width: 1440, height: 900 }, false);
    const p = await ctx.newPage();
    await p.goto(base + "/");
    await p.waitForTimeout(2600);
    await p.screenshot({ path: out + `desktop-${theme}-01-hero.png` });
    await p.getByRole("button", { name: /03\s*Zaytoun/ }).click();
    await p.waitForTimeout(1000);
    await p.screenshot({ path: out + `desktop-${theme}-02-hero-zaytoun.png` });
    await scroll(p, "#aurelle", 150);
    await p.screenshot({ path: out + `desktop-${theme}-03-work-aurelle.png` });
    await scroll(p, "#services", 80);
    await p.screenshot({ path: out + `desktop-${theme}-04-services.png` });
    await scroll(p, "#about", 68);
    await p.screenshot({ path: out + `desktop-${theme}-05-about.png` });
    await scroll(p, "#process", 68);
    await p.screenshot({ path: out + `desktop-${theme}-06-process.png` });
    await scroll(p, "#contact", 68);
    await p.screenshot({ path: out + `desktop-${theme}-07-contact.png` });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(1200);
    await p.screenshot({ path: out + `desktop-${theme}-08-footer.png` });
    await ctx.close();
  }
  // case study (light + dark)
  for (const theme of ["light", "dark"]) {
    const ctx = await ctxFor(b, theme, { width: 1440, height: 900 }, false);
    const p = await ctx.newPage();
    await p.goto(base + "/work/dar");
    await p.waitForTimeout(1500);
    await p.screenshot({ path: out + `case-dar-${theme}-01-top.png` });
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(120); }
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);
    if (theme === "light") await p.screenshot({ path: out + "case-dar-light-full.png", fullPage: true });
    await ctx.close();
  }
  // mobile
  for (const theme of ["light", "dark"]) {
    const ctx = await ctxFor(b, theme, { width: 390, height: 844 }, true, 2);
    const p = await ctx.newPage();
    await p.goto(base + "/");
    await p.waitForTimeout(2400);
    await p.screenshot({ path: out + `mobile-${theme}-01-hero.png` });
    await scroll(p, "#dar", 40);
    await p.screenshot({ path: out + `mobile-${theme}-02-work.png` });
    await scroll(p, "#contact", 40);
    await p.screenshot({ path: out + `mobile-${theme}-03-contact.png` });
    if (theme === "light") {
      await p.evaluate(() => scrollTo(0, 0));
      await p.waitForTimeout(500);
      await p.getByRole("button", { name: "Menu" }).click();
      await p.waitForTimeout(400);
      await p.screenshot({ path: out + "mobile-light-04-menu.png" });
    }
    await ctx.close();
  }
  // toggle + nav close-ups (2x)
  for (const theme of ["light", "dark"]) {
    const ctx = await ctxFor(b, theme, { width: 1440, height: 900 }, false, 2);
    const p = await ctx.newPage();
    await p.goto(base + "/");
    await p.waitForTimeout(1200);
    await scroll(p, "#work", 0);
    await p.getByRole("link", { name: "About", exact: true }).first().hover();
    await p.waitForTimeout(450);
    await p.screenshot({ path: out + `detail-${theme}-nav-toggle.png`, clip: { x: 480, y: 0, width: 880, height: 130 } });
    await ctx.close();
  }
  await b.close();
})();
