const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  for (const [tag, vp, mob] of [["desktop 1440x900", { width: 1440, height: 900 }, false], ["mobile 390x844", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__m = { lcp: 0, cls: 0 };
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await p.goto("http://localhost:3740/", { waitUntil: "load" });
    await p.waitForTimeout(3500);
    const r = await p.evaluate(() => {
      const res = performance.getEntriesByType("resource");
      const by = (re) => Math.round(res.filter((e) => re.test(e.name)).reduce((s, e) => s + (e.transferSize || 0), 0) / 1024);
      return { lcp: Math.round(window.__m.lcp), cls: +window.__m.cls.toFixed(3), totalKB: Math.round(res.reduce((s, e) => s + (e.transferSize || 0), 0) / 1024), jsKB: by(/\.js/), imgKB: by(/_next\/image|\.webp|\.png/), videoKB: by(/\.mp4/), requests: res.length };
    });
    console.log(tag, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
