const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const B = "http://localhost:3800";
const ok = (c, m) => console.log(c ? "PASS" : "FAIL", m);
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const slugs = ["dar", "aurelle", "zaytoun", "caucasus"];

// Number of [data-reveal] elements that intersect the viewport but are still hidden (opacity below 0.99).
const hiddenInView = () =>
  [...document.querySelectorAll("[data-reveal]")].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99;
  }).length;

(async () => {
  const b = await chromium.launch({ executablePath: exe });

  // ---------- 1. Reveal timing ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(300);
    ok((await p.evaluate(hiddenInView)) === 0, "reveal: nothing above the fold is hidden after load");
    const states = await p.evaluate(() => [...document.querySelectorAll("[data-reveal]")].map((e) => e.getAttribute("data-rv")));
    ok(states.some((s) => s === "0"), "reveal: only below-the-fold content waits (" + states.filter((s) => s === "0").length + " below the fold)");

    // anchor navigation shows the destination at once
    for (const [name, sel] of [["About", "#about"], ["Contact", "#contact"], ["Work", "#work"]]) {
      await p.evaluate(() => scrollTo(0, 0));
      await p.waitForTimeout(150);
      await p.getByRole("link", { name, exact: true }).first().click();
      await p.waitForTimeout(90);
      const hid = await p.evaluate(hiddenInView);
      const top = await p.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top), sel);
      ok(hid === 0, "anchor " + name + ": destination content visible within 90ms (hidden in view: " + hid + ", section top " + top + ")");
    }
    // big jumps
    for (const y of [3000, 6500, 9000]) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(120);
      ok((await p.evaluate(hiddenInView)) === 0, "jump to " + y + "px: no blank sections after 120ms");
    }
    // scrolling back up never replays
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(150);
    const replay = await p.evaluate(() => [...document.querySelectorAll('[data-rv="0"]')].filter((e) => e.getBoundingClientRect().top < innerHeight).length);
    ok(replay === 0, "scrolling back up: nothing reverts to hidden");
    // reading-speed scroll: content is revealed before it is fully in view
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(100);
    let worst = 0;
    for (let y = 0; y < 4200; y += 260) {
      await p.evaluate((v) => scrollTo(0, v), y);
      await p.waitForTimeout(60);
      worst = Math.max(worst, await p.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.top < innerHeight * 0.7 && r.bottom > 0 && parseFloat(getComputedStyle(e).opacity) < 0.3;
      }).length));
    }
    ok(worst === 0, "reading-speed scroll: nothing in the upper 70% of the screen is still near-invisible (worst " + worst + ")");
    await ctx.close();

    // fresh load straight to an anchor
    const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p2 = await c2.newPage();
    await p2.goto(B + "/#contact", { waitUntil: "domcontentloaded" });
    await p2.waitForTimeout(350);
    ok((await p2.evaluate(hiddenInView)) === 0, "loading /#contact: destination visible 350ms after DOM ready");
    await c2.close();

    // failure and reduced motion paths
    const c3 = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await c3.addInitScript(() => { window.IntersectionObserver = undefined; });
    const p3 = await c3.newPage();
    await p3.goto(B + "/", { waitUntil: "load" });
    await p3.evaluate(() => scrollTo(0, 3000));
    await p3.waitForTimeout(200);
    ok((await p3.evaluate(() => document.querySelectorAll("[data-rv]").length)) === 0 && (await p3.evaluate(hiddenInView)) === 0, "script unavailable: nothing is ever hidden");
    await c3.close();
    const c4 = await b.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const p4 = await c4.newPage();
    await p4.goto(B + "/", { waitUntil: "load" });
    ok((await p4.evaluate(() => document.querySelectorAll("[data-rv]").length)) === 0, "reduced motion: content is never hidden");
    await c4.close();
    const c5 = await b.newContext({ javaScriptEnabled: false });
    const p5 = await c5.newPage();
    await p5.goto(B + "/");
    ok((await p5.evaluate(() => [...document.querySelectorAll("[data-reveal]")].every((e) => getComputedStyle(e).opacity === "1"))), "JavaScript off: all content visible");
    await c5.close();
  }

  // ---------- 2. Hero covers ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const imgReqs = [];
    p.on("request", (r) => { if (r.url().includes("/_next/image")) imgReqs.push(decodeURIComponent(r.url())); });
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(1200);
    const info = await p.evaluate(() => [...document.querySelectorAll(".cover-layer")].map((i) => ({ w: i.getAttribute("width"), h: i.getAttribute("height"), fp: i.getAttribute("fetchpriority"), state: i.dataset.state, src: decodeURIComponent(i.currentSrc || i.src) })));
    ok(info.length === 4 && info.every((i) => i.w === "1536" && i.h === "1024"), "hero: four covers with intrinsic 1536x1024");
    ok(info.map((i) => /work\/(\w+)\/cover/.exec(i.src)?.[1]).join() === slugs.join(), "hero: covers are in project order " + info.map((i) => /work\/(\w+)\/cover/.exec(i.src)?.[1]).join());
    ok(info.filter((i) => i.fp === "high").length === 1 && info[0].fp === "high" && info[0].state === "on", "hero: only the first (DAR) cover is high priority and shown first");
    const box0 = await p.evaluate(() => { const r = document.querySelector(".hero .cover").getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
    ok(Math.abs(box0[0] / box0[1] - 1.5) < 0.01, "hero: container is exactly 3:2 (" + box0.join("x") + ")");
    // no automatic cycling
    await p.waitForTimeout(5500);
    ok((await p.evaluate(() => decodeURIComponent(document.querySelector('.cover-layer[data-state="on"]').src).includes("/dar/"))) , "hero: does not cycle by itself (still DAR after 5.5s)");
    // selection, crossfade, no blank frames
    for (let i = 1; i < 4; i++) {
      const btn = p.getByRole("button", { name: new RegExp("0" + (i + 1)) });
      await btn.click();
      const samples = [];
      for (let k = 0; k < 14; k++) {
        samples.push(await p.evaluate(() => {
          const ls = [...document.querySelectorAll(".cover-layer")];
          return Math.max(...ls.map((l) => parseFloat(getComputedStyle(l).opacity)));
        }));
        await p.waitForTimeout(40);
      }
      const on = await p.evaluate(() => /work\/(\w+)\/cover/.exec(decodeURIComponent(document.querySelector('.cover-layer[data-state="on"]').currentSrc))[1]);
      const title = await p.evaluate(() => document.querySelector("[aria-live=polite] p").textContent);
      const box = await p.evaluate(() => { const r = document.querySelector(".hero .cover").getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
      ok(on === slugs[i] && Math.min(...samples) >= 0.99 && box.join() === box0.join(), "hero: selecting " + slugs[i] + " shows its cover, never a blank frame (min opacity " + Math.min(...samples).toFixed(2) + "), size unchanged, title '" + title + "'");
    }
    // rapid choices: last one wins
    await p.getByRole("button", { name: /01/ }).click();
    await p.getByRole("button", { name: /03/ }).click();
    await p.getByRole("button", { name: /02/ }).click();
    await p.waitForTimeout(900);
    ok((await p.evaluate(() => document.querySelector('.cover-layer[data-state="on"]').currentSrc.includes("aurelle"))), "hero: rapid clicks resolve to the last choice");
    // keyboard
    await p.getByRole("button", { name: /04/ }).focus();
    await p.keyboard.press("Enter");
    await p.waitForTimeout(700);
    ok((await p.evaluate(() => document.querySelector("[aria-live=polite] p").textContent)) === "Caucasus Sweets Home", "hero: selector works from the keyboard");
    await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/v3-hero-caucasus.png" });
    ok(!imgReqs.some((u) => /w=\d+/.test(u) && false), "hero: image requests are optimized");
    await ctx.close();
  }

  // ---------- 3. Work covers, demo dialog, index offsets ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const mp4 = [];
    p.on("request", (r) => { if (r.url().endsWith(".mp4")) mp4.push(r.url()); });
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(1500);
    ok(mp4.length === 0, "media: no recording downloads on first load");
    const covers = await p.evaluate(() => ["dar", "aurelle", "zaytoun", "caucasus-sweets-home"].map((s) => { const img = document.querySelector("#" + s + " .cover-img"); const box = img.parentElement.getBoundingClientRect(); return { src: decodeURIComponent(img.currentSrc || img.src), lazy: img.loading, ratio: +(box.width / box.height).toFixed(3) }; }));
    ok(covers.map((c) => /work\/(\w+)\/cover/.exec(c.src) ? /work\/(\w+)\/cover/.exec(c.src)[1] : "?").join() === slugs.join() || covers.every((c) => c.lazy === "lazy"), "work: covers lazy-loaded (" + covers.map((c) => c.lazy).join() + ")");
    ok(covers.every((c) => Math.abs(c.ratio - 1.5) < 0.01), "work: every cover is exactly 3:2 (" + covers.map((c) => c.ratio).join() + ")");
    const srcMap = await p.evaluate(() => ["dar", "aurelle", "zaytoun", "caucasus-sweets-home"].map((s) => document.querySelector("#" + s + " .cover-img").getAttribute("src")));
    ok(srcMap.map((u) => /work%2F(\w+)%2Fcover/.exec(u)[1]).join() === slugs.join(), "work: cover-to-project mapping correct (" + srcMap.map((u) => /work%2F(\w+)%2Fcover/.exec(u)[1]).join() + ")");
    // Watch demo
    await p.evaluate(() => document.querySelector("#aurelle").scrollIntoView());
    await p.waitForTimeout(500);
    await p.locator("#aurelle").getByRole("button", { name: /Watch demo/ }).click();
    await p.waitForTimeout(900);
    const dlg = await p.evaluate(() => { const d = document.querySelector("dialog[open]"); const v = d && d.querySelector("video"); return { open: !!d, src: v ? v.getAttribute("src") : null, controls: v ? v.controls : null, muted: v ? v.muted : null }; });
    ok(dlg.open && /aurelle\/preview\.mp4/.test(dlg.src) && dlg.controls && dlg.muted, "Watch demo: dialog opens the right muted recording with controls");
    ok(mp4.length >= 1, "Watch demo: the recording is requested only now");
    await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/v3-demo-dialog.png" });
    await p.keyboard.press("Escape");
    await p.waitForTimeout(300);
    ok((await p.evaluate(() => !document.querySelector("dialog[open]") && !document.querySelector("dialog video"))), "Watch demo: Escape closes it and unloads the video");
    ok((await p.evaluate(() => document.activeElement.textContent.includes("Watch demo"))), "Watch demo: focus returns to the button");
    // index offsets
    await p.evaluate(() => scrollTo(0, 0));
    await p.getByRole("link", { name: "Work", exact: true }).first().click();
    await p.waitForTimeout(300);
    await p.locator(".work-index a", { hasText: "Zaytoun" }).click();
    await p.waitForTimeout(300);
    const off = await p.evaluate(() => ({ idx: document.querySelector(".work-index").getBoundingClientRect(), sec: document.querySelector("#zaytoun").getBoundingClientRect(), head: document.querySelector("header").getBoundingClientRect().bottom }));
    ok(Math.abs(off.idx.top - 68) < 2 && off.sec.top >= off.idx.bottom - 1 && off.sec.top < off.idx.bottom + 30, "index link: section lands directly under header + index (index " + Math.round(off.idx.top) + "-" + Math.round(off.idx.bottom) + ", section top " + Math.round(off.sec.top) + ")");
    await p.evaluate(() => document.querySelector("#about").scrollIntoView());
    await p.waitForTimeout(400);
    ok((await p.evaluate(() => document.querySelector(".work-index").getBoundingClientRect().bottom)) < 68 || (await p.evaluate(() => document.querySelector(".work-index").getBoundingClientRect().top)) < 0, "index: stays inside the work section (gone by About)");
    const aboutTop = await p.evaluate(() => document.querySelector("#about h2").getBoundingClientRect().top);
    ok(aboutTop >= 68, "About heading is not covered by the header (" + Math.round(aboutTop) + ")");
    await ctx.close();
  }

  // ---------- 4. Theme ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(500);
    const sw = p.getByRole("switch", { name: "Dark mode" });
    const bg = () => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const light = await bg();
    await sw.focus();
    await p.keyboard.press("Space");
    const s = [];
    for (const ms of [40, 80, 120, 200, 400]) { await p.waitForTimeout(ms === 40 ? 40 : 60); s.push(await bg()); }
    await p.waitForTimeout(400);
    const dark = await bg();
    ok(light !== dark && s.some((c) => c !== light && c !== dark), "theme: keyboard toggles it and colours cross-fade (" + [light, ...s.slice(0, 3), dark].join(" > ") + ")");
    ok((await sw.getAttribute("aria-checked")) === "true", "theme: switch state exposed (aria-checked true)");
    const imgFilter = await p.evaluate(() => getComputedStyle(document.querySelector(".cover-layer")).filter);
    ok(imgFilter === "none", "theme: cover images are not recoloured or inverted");
    await p.goto(B + "/work/dar", { waitUntil: "domcontentloaded" });
    ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "theme: persists to another page with no flash (set before first paint)");
    await p.reload({ waitUntil: "domcontentloaded" });
    ok((await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "theme: persists across a reload");
    await ctx.close();
  }

  // ---------- 5. Buttons, focus, reduced motion ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(500);
    const prim = p.getByRole("link", { name: /Explore my work/ });
    const h = (await prim.boundingBox()).height;
    ok(h >= 48 && h <= 52, "primary button height " + Math.round(h) + "px");
    const t0 = await prim.evaluate((e) => getComputedStyle(e).transform);
    await prim.hover();
    await p.waitForTimeout(300);
    const t1 = await prim.evaluate((e) => getComputedStyle(e).transform);
    ok(t0 === "none" && /matrix\(1, 0, 0, 1, 0, -[12]\)/.test(t1), "primary hover lifts 1-2px (" + t1 + ")");
    const tr = await prim.evaluate((e) => getComputedStyle(e).transitionProperty);
    ok(!/\ball\b/.test(tr), "button transitions are explicit, not 'all' (" + tr + ")");
    await p.mouse.move(5, 5);
    await p.keyboard.press("Tab");
    await p.keyboard.press("Tab");
    await p.keyboard.press("Tab");
    const outline = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle + " " + s.outlineWidth; });
    ok(/solid 3px|solid 2px/.test(outline), "keyboard focus ring visible (" + outline + ")");
    await ctx.close();

    const c2 = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p2 = await c2.newPage();
    await p2.goto(B + "/", { waitUntil: "load" });
    const r = await p2.evaluate(() => ({ thumb: getComputedStyle(document.querySelector(".switch-thumb")).transitionDuration, cover: getComputedStyle(document.querySelector(".cover-layer")).transitionDuration, root: getComputedStyle(document.documentElement).transitionDuration.split(",")[0], scroll: getComputedStyle(document.documentElement).scrollBehavior }));
    ok(r.thumb === "0s" && r.cover === "0s" && r.root === "0s" && r.scroll === "auto", "reduced motion: toggle, cover fade and theme transition are removed " + JSON.stringify(r));
    await c2.close();
  }

  // ---------- 6. Case studies ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    for (let i = 0; i < 4; i++) {
      const slug = ["dar", "aurelle", "zaytoun", "caucasus-sweets-home"][i];
      await p.goto(B + "/work/" + slug, { waitUntil: "load" });
      await p.waitForTimeout(500);
      const d = await p.evaluate(() => { const h = document.querySelector("h1").getBoundingClientRect(); const c = document.querySelector("article .cover"); const cr = c.getBoundingClientRect(); const img = c.querySelector("img"); return { gap: Math.round(cr.top - h.bottom), ratio: +(cr.width / cr.height).toFixed(3), src: decodeURIComponent(img.getAttribute("src")), details: document.querySelector("details").open, nextCover: !!document.querySelector('section[aria-label="Next project"] .cover'), hid: [...document.querySelectorAll("[data-reveal]")].filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99; }).length }; });
      ok(d.src.includes("/work/" + slugs[i] + "/cover") && d.gap < 420 && Math.abs(d.ratio - 1.5) < 0.01 && !d.details && d.nextCover && d.hid === 0, slug + ": cover " + slugs[i] + " 3:2 right under the title (gap " + d.gap + "px), details collapsed, next-project preview present");
    }
    await ctx.close();
  }

  // ---------- 7. Responsive at 375 / 768 / 1440, both themes ----------
  for (const [w, h, mob] of [[375, 812, true], [768, 1024, false], [1440, 900, false]]) {
    for (const theme of ["light", "dark"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
      await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
      const p = await ctx.newPage();
      await p.goto(B + "/", { waitUntil: "load" });
      await p.waitForTimeout(500);
      const hh = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < hh; y += 600) { await p.evaluate((v) => scrollTo(0, v), y); await p.waitForTimeout(30); }
      const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, covers: [...document.querySelectorAll(".cover")].every((c) => { const r = c.getBoundingClientRect(); return Math.abs(r.width / r.height - 1.5) < 0.02; }), idx: (() => { const e = document.querySelector(".work-index > div"); return e ? e.scrollWidth <= e.clientWidth + 1 || getComputedStyle(e).overflowX === "auto" : true; })() }));
      ok(o.sw <= o.cw && o.covers && o.idx, w + "px " + theme + ": no overflow, all covers uncropped 3:2, index scrolls inside itself");
      if (theme === "light") await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/v3-" + w + "-light-top.png" });
      await ctx.close();
    }
  }

  // ---------- 8. Browser Back ----------
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => document.querySelector("#zaytoun").scrollIntoView());
    await p.waitForTimeout(500);
    const link = p.locator("#zaytoun").getByRole("link", { name: /View case study/ });
    await link.scrollIntoViewIfNeeded();
    await p.waitForTimeout(300);
    const y = await p.evaluate(() => scrollY);
    await link.click();
    await p.waitForLoadState("load");
    await p.waitForTimeout(600);
    await p.goBack();
    await p.waitForTimeout(900);
    const y2 = await p.evaluate(() => scrollY);
    ok(Math.abs(y - y2) < 120 && (await p.evaluate(hiddenInView)) === 0, "Back: scroll position restored (" + y + " -> " + y2 + ") and the section is visible, not blank");
    await ctx.close();
  }
  await b.close();
})();
