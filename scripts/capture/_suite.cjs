const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const fs = require("fs");
const A = "http://localhost:3740";
const ok = (c, m) => console.log(c ? "PASS" : "FAIL", m);
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const b = await chromium.launch({ executablePath: exe });

  // ---- theme: system preference, saved choice, no flash
  {
    let ctx = await b.newContext({ colorScheme: "dark" });
    let p = await ctx.newPage();
    await p.goto(A + "/", { waitUntil: "domcontentloaded" });
    ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "theme: follows system dark when no saved choice (set before hydration)");
    await ctx.close();

    ctx = await b.newContext({ colorScheme: "dark" });
    await ctx.addInitScript(() => localStorage.setItem("theme", "light"));
    p = await ctx.newPage();
    await p.goto(A + "/", { waitUntil: "domcontentloaded" });
    ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "light", "theme: saved choice (light) beats system dark");
    await ctx.close();

    ctx = await b.newContext({ colorScheme: "light" });
    p = await ctx.newPage();
    await p.goto(A + "/", { waitUntil: "load" });
    await p.waitForTimeout(800);
    const sw = p.getByRole("switch", { name: "Dark mode" });
    ok((await sw.count()) === 1, 'switch: role=switch with name "Dark mode"');
    ok((await sw.getAttribute("aria-checked")) === "false", "switch: aria-checked false in light");
    const box = await sw.boundingBox();
    ok(box.height >= 44 && box.width >= 76, "switch: target >= 44px high (" + Math.round(box.width) + "x" + Math.round(box.height) + ")");
    const geo = () =>
      p.evaluate(() =>
        [...document.querySelectorAll("header a, header button")]
          .map((e) => {
            const r = e.getBoundingClientRect();
            return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(",");
          })
          .join("|"),
      );
    const before = await geo();
    const h0 = await p.evaluate(() => document.documentElement.scrollHeight);
    await sw.click();
    await p.waitForTimeout(700);
    ok((await sw.getAttribute("aria-checked")) === "true" && (await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "switch: click sets dark and aria-checked true");
    const after = await geo();
    const h1 = await p.evaluate(() => document.documentElement.scrollHeight);
    ok(before === after && Math.abs(h0 - h1) < 3, "theme switch causes no layout shift (header geometry equal, page height " + h0 + " -> " + h1 + ")");
    const thumb = await p.evaluate(() => getComputedStyle(document.querySelector(".switch-thumb")).transitionDuration);
    ok(/0\.46s/.test(thumb), "switch: thumb transition ~460ms (" + thumb + ")");
    await p.reload();
    await p.waitForTimeout(500);
    ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "theme: saved dark persists after reload");
    await ctx.close();
  }

  // ---- reduced motion
  {
    const ctx = await b.newContext({ reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(A + "/");
    await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({
      thumb: getComputedStyle(document.querySelector(".switch-thumb")).transitionDuration,
      rise: getComputedStyle(document.querySelector(".rise")).animationName,
      rev: (() => {
        const e = document.querySelector("[data-reveal]:not(.is-in)");
        return e ? getComputedStyle(e).opacity : "1";
      })(),
      vid: document.querySelector("video") ? document.querySelector("video").paused : true,
    }));
    ok(r.thumb === "0s" && r.rise === "none" && r.rev === "1", "reduced motion: no thumb transition, no entrance animation, content visible " + JSON.stringify(r));
    ok(r.vid !== false, "reduced motion: hero video does not autoplay");
    await ctx.close();
  }

  // ---- nav states
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(A + "/");
    await p.waitForTimeout(800);
    await p.evaluate(() => document.querySelector("#work").scrollIntoView());
    await p.waitForTimeout(900);
    const cur = () => p.evaluate(() => [...document.querySelectorAll('header .nav-item[aria-current="true"]')].map((e) => e.textContent));
    ok((await cur()).join() === "Work", "nav: Work is current in Selected Work");
    await p.getByRole("link", { name: "About", exact: true }).first().hover();
    await p.waitForTimeout(350);
    const hov = await p.evaluate(() => {
      const e = [...document.querySelectorAll("header .nav-item")].find((x) => x.textContent === "About");
      const s = getComputedStyle(e);
      return {
        bg: s.backgroundColor,
        tr: s.transform,
        cur: [...document.querySelectorAll('header .nav-item[aria-current="true"]')].map((x) => x.textContent).join(),
        pill: getComputedStyle(document.querySelector(".nav-list")).getPropertyValue("--pill-o"),
      };
    });
    ok(hov.bg !== "rgba(0, 0, 0, 0)" && hov.tr !== "none", "nav: hover shows surface and lifts " + JSON.stringify(hov));
    ok(hov.cur === "Work" && hov.pill.trim() === "1", "nav: hovering another item keeps the active state");
    await p.evaluate(() => document.querySelector("#about").scrollIntoView());
    await p.waitForTimeout(900);
    ok((await cur()).join() === "About", "nav: active marker moves to About");
    const top = await p.evaluate(() => document.querySelector("#about h2").getBoundingClientRect().top);
    ok(top >= 68, "sticky header does not cover the About heading (top " + Math.round(top) + ")");
    await p.goto(A + "/work/dar");
    await p.waitForTimeout(700);
    ok((await cur()).join() === "Work", "nav: Work stays current on a case study");
    await ctx.close();
  }

  // ---- hero selector
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(A + "/");
    await p.waitForTimeout(900);
    const acc0 = await p.evaluate(() => getComputedStyle(document.querySelector(".hero")).getPropertyValue("--hero-accent").trim());
    await p.getByRole("button", { name: /02\s*Aurelle/ }).click();
    await p.waitForTimeout(900);
    const info = await p.evaluate(() => ({
      name: document.querySelector("[aria-live=polite] p").textContent,
      pressed: [...document.querySelectorAll('[aria-label="Choose a project"] button')].map((x) => x.getAttribute("aria-pressed")).join(),
      acc: getComputedStyle(document.querySelector(".hero")).getPropertyValue("--hero-accent").trim(),
    }));
    ok(info.name === "Aurelle" && info.pressed === "false,true,false,false" && info.acc !== acc0, "hero: selecting Aurelle updates title, selector and accent " + JSON.stringify(info));
    await p.screenshot({ path: "D:/Projects/Portfolio-Studio/shots/r/hero-aurelle.png" });
    const btn = await p.getByRole("link", { name: /Explore my work/ }).boundingBox();
    ok(btn.height >= 48 && btn.height <= 52, "primary CTA height " + Math.round(btn.height) + "px");
    await ctx.close();
  }

  // ---- work: index, sticky release, short viewport, lazy videos
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const mp4 = [];
    p.on("request", (r) => {
      if (r.url().endsWith(".mp4")) mp4.push(r.url().split("/").slice(-2).join("/"));
    });
    await p.goto(A + "/");
    await p.waitForTimeout(2500);
    ok(mp4.length <= 1, "media: only the hero recording loads at first (" + mp4.join(",") + ")");
    await p.evaluate(() => document.querySelector("#work").scrollIntoView());
    await p.waitForTimeout(800);
    await p.locator(".work-index a", { hasText: "Zaytoun" }).click();
    await p.waitForTimeout(1400);
    ok(await p.evaluate(() => (document.querySelector('.work-index a[aria-current="true"]') || { textContent: "" }).textContent.includes("Zaytoun")), "index: link jumps to Zaytoun and highlights it");
    const idxTop = await p.evaluate(() => document.querySelector(".work-index").getBoundingClientRect().top);
    ok(Math.abs(idxTop - 68) < 2, "index: sticks directly under the header (" + Math.round(idxTop) + ")");
    const sec = await p.evaluate(() => document.querySelector("#zaytoun h3").getBoundingClientRect().top);
    ok(sec >= 116, "index and header do not cover the project heading (top " + Math.round(sec) + ")");
    let worst = -1e9;
    for (const slug of ["dar", "aurelle", "zaytoun", "caucasus-sweets-home"]) {
      const ov = await p.evaluate(async (s) => {
        const el = document.getElementById(s);
        const vis = el.querySelector(".sticky-visual");
        let max = -1e9;
        const y0 = el.getBoundingClientRect().top + scrollY;
        const h = el.offsetHeight;
        for (let k = 0; k <= 12; k++) {
          scrollTo(0, y0 - 100 + ((h + 100) * k) / 12);
          await new Promise((r) => setTimeout(r, 60));
          max = Math.max(max, vis.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom);
        }
        return max;
      }, slug);
      worst = Math.max(worst, ov);
    }
    ok(worst <= 1, "sticky visual never extends past its own section (worst overshoot " + Math.round(worst) + "px)");
    await ctx.close();

    const c2 = await b.newContext({ viewport: { width: 1280, height: 600 } });
    const p2 = await c2.newPage();
    await p2.goto(A + "/");
    await p2.waitForTimeout(800);
    ok((await p2.evaluate(() => getComputedStyle(document.querySelector(".sticky-visual")).position)) === "static", "short viewport (600px high): sticky disabled, normal flow");
    await c2.close();
  }

  // ---- responsive overflow and tap targets
  for (const [w, h] of [[360, 740], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 720], [1440, 900]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    const p = await ctx.newPage();
    await p.goto(A + "/");
    await p.waitForTimeout(700);
    const hh = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < hh; y += 700) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(40);
    }
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok(o.sw <= o.cw, "no horizontal overflow at " + w + "x" + h + " (" + o.sw + " vs " + o.cw + ")");
    if (w <= 430) {
      const tiny = await p.evaluate(() =>
        [...document.querySelectorAll("a,button,select,input,textarea,summary")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && e.getAttribute("aria-hidden") !== "true" && !e.closest(".hp") && e.tabIndex >= 0 && r.height < 40;
          })
          .map((e) => (e.textContent || e.name || "").trim().slice(0, 24) + ":" + Math.round(e.getBoundingClientRect().height))
          .slice(0, 10),
      );
      console.log("  small tap targets at", w, JSON.stringify(tiny));
    }
    await ctx.close();
  }
  await b.close();
})();
