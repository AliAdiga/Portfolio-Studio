const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const axeSrc = require("fs").readFileSync("D:/Projects/DAR/node_modules/axe-core/axe.min.js", "utf8");
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await ctx.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3770/", { waitUntil: "load" });
  await p.waitForTimeout(900);
  await p.evaluate(axeSrc);
  const r = await p.evaluate(() => axe.run(document, { runOnly: ["color-contrast"] }));
  for (const v of r.violations) for (const n of v.nodes) console.log(n.html.slice(0, 120), "|", n.any[0].message.slice(0, 160), "| data:", JSON.stringify(n.any[0].data && { fg: n.any[0].data.fgColor, bg: n.any[0].data.bgColor, ratio: n.any[0].data.contrastRatio }));
  await b.close();
})();
