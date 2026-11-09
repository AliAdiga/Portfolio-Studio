const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const axeSrc = require("fs").readFileSync("D:/Projects/DAR/node_modules/axe-core/axe.min.js", "utf8");
const base = "http://localhost:3840";
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  let total = 0;
  for (const [url, vp] of [["/", { width: 1440, height: 900 }], ["/", { width: 390, height: 844 }], ["/work/dar", { width: 1440, height: 900 }], ["/work/zaytoun", { width: 390, height: 844 }], ["/work/aurelle", { width: 1440, height: 900 }], ["/work/caucasus-sweets-home", { width: 1440, height: 900 }]]) {
    for (const theme of ["light", "dark"]) {
      const ctx = await b.newContext({ viewport: vp, reducedMotion: "reduce" });
      await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
      const p = await ctx.newPage();
      await p.goto(base + url, { waitUntil: "load" });
      await p.waitForTimeout(900);
      await p.evaluate(axeSrc);
      const r = await p.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }));
      total += r.violations.length;
      console.log(url, vp.width, theme, "violations", r.violations.length);
      for (const v of r.violations) console.log("  ", v.id, v.impact, v.nodes.length, v.nodes[0].target.join(" ").slice(0, 100), "|", ((v.nodes[0].any[0] || {}).message || "").slice(0, 150));
      await ctx.close();
    }
  }
  console.log("TOTAL", total);
  await b.close();
})();
