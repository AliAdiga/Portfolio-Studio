const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const B = "http://localhost:3840";
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ok = (c, m) => console.log(c ? "PASS" : "FAIL", m);
const out = "D:/Projects/Portfolio-Studio/docs/screenshots/";
const NAV = 76;
const hiddenInView = () =>
  [...document.querySelectorAll("[data-reveal]")].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99;
  }).length;
const panelState = (id) => (document.getElementById(id) ? getComputedStyle(document.getElementById(id)).visibility : "none");

(async () => {
  const b = await chromium.launch({ executablePath: exe });

  // ================= NAVIGATION (desktop) =================
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text().slice(0, 140)); });
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(1500);
    ok(errs.length === 0, "console: no errors or warnings on load (incl. hydration) " + JSON.stringify(errs));

    const geo = await p.evaluate(() => { const r = document.querySelector(".nav-bar").getBoundingClientRect(); return { l: Math.round(r.left), rr: Math.round(innerWidth - r.right), t: Math.round(r.top), h: Math.round(r.height) }; });
    ok(geo.l >= 12 && Math.abs(geo.l - geo.rr) <= 2 && geo.t >= 10, "header floats centered with breathing space (left " + geo.l + ", right " + geo.rr + ", top " + geo.t + ")");
    await p.evaluate(() => scrollTo(0, 2400));
    await p.waitForTimeout(300);
    ok((await p.evaluate(() => Math.round(document.querySelector(".nav-bar").getBoundingClientRect().top))) === geo.t, "header stays put (sticky) while scrolling");
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(200);

    // closed state
    const sem = await p.evaluate(() => ["work", "services"].map((id) => { const t = document.querySelector('button[aria-controls="menu-' + id + '"]'); return { exp: t.getAttribute("aria-expanded"), ctrl: !!document.getElementById("menu-" + id), role: t.getAttribute("role") }; }));
    ok(sem.every((s) => s.exp === "false" && s.ctrl && !s.role), "disclosure buttons: aria-expanded false, aria-controls resolves, no menu roles");
    ok((await p.evaluate(panelState, "menu-work")) === "hidden" && (await p.evaluate(panelState, "menu-services")) === "hidden", "closed panels are hidden from keyboard and assistive tech (visibility hidden)");
    await p.locator('button[aria-controls="menu-work"]').focus();
    await p.keyboard.press("Tab");
    ok((await p.evaluate(() => document.activeElement.getAttribute("aria-controls"))) === "menu-services", "Tab skips closed panel content (goes to the next nav item)");

    // click opens, one at a time, content
    await p.locator('button[aria-controls="menu-work"]').click();
    await p.waitForTimeout(450);
    const w = await p.evaluate(() => { const pn = document.getElementById("menu-work"); const r = pn.getBoundingClientRect(); return { vis: getComputedStyle(pn).visibility, op: getComputedStyle(pn).opacity, exp: document.querySelector('button[aria-controls="menu-work"]').getAttribute("aria-expanded"), links: [...pn.querySelectorAll("a")].map((a) => a.getAttribute("href")), thumbs: pn.querySelectorAll('div[aria-hidden="true"] img').length, inView: r.top >= 0 && r.bottom <= innerHeight, dur: getComputedStyle(pn).transitionDuration }; });
    ok(w.vis === "visible" && w.op === "1" && w.exp === "true", "Work menu opens on click (aria-expanded true)");
    ok(["/#work", "/#more", "/work/dar", "/#contact"].every((h) => w.links.includes(h)) && w.thumbs >= 3, "Work menu links: " + w.links.join(", ") + "; previews: " + w.thumbs);
    ok(w.inView && /0\.24s/.test(w.dur), "Work menu stays within the viewport; 240ms transition (" + w.dur + ")");
    await p.screenshot({ path: out + "nf-menu-work.png" });
    await p.locator('button[aria-controls="menu-services"]').click();
    await p.waitForTimeout(450);
    ok((await p.evaluate(panelState, "menu-work")) === "hidden" && (await p.evaluate(panelState, "menu-services")) === "visible", "only one menu open at a time");
    const sv = await p.evaluate(() => [...document.querySelectorAll("#menu-services a")].map((a) => a.getAttribute("href")));
    ok(sv.join() === "/#services-websites,/#services-interactive,/#services-redesigns", "Services menu links to stable service IDs: " + sv.join(", "));
    ok(await p.evaluate(() => ["services-websites", "services-interactive", "services-redesigns"].every((id) => document.getElementById(id))), "those section IDs exist on the page");
    await p.screenshot({ path: out + "nf-menu-services.png" });

    // Escape, outside click, tab-out
    await p.keyboard.press("Escape");
    await p.waitForTimeout(350);
    ok((await p.evaluate(panelState, "menu-services")) === "hidden" && (await p.evaluate(() => document.activeElement.getAttribute("aria-controls"))) === "menu-services", "Escape closes the menu and returns focus to its trigger");
    await p.locator('button[aria-controls="menu-work"]').click();
    await p.waitForTimeout(350);
    await p.mouse.click(700, 760);
    await p.waitForTimeout(350);
    ok((await p.evaluate(panelState, "menu-work")) === "hidden", "outside click closes the menu");
    await p.locator('button[aria-controls="menu-work"]').focus();
    await p.keyboard.press("Enter");
    await p.waitForTimeout(350);
    await p.keyboard.press("Tab");
    ok((await p.evaluate(() => document.activeElement.closest("#menu-work") !== null)), "keyboard: Tab from an open trigger enters its panel");
    for (let i = 0; i < 6; i++) await p.keyboard.press("Tab");
    await p.waitForTimeout(350);
    ok((await p.evaluate(panelState, "menu-work")) === "hidden", "tabbing out of the header closes the menu");

    // navigation closes + anchor offsets
    await p.locator('button[aria-controls="menu-services"]').click();
    await p.waitForTimeout(350);
    await p.locator('#menu-services a[href="/#services-interactive"]').click();
    await p.waitForTimeout(250);
    const a1 = await p.evaluate(() => ({ closed: getComputedStyle(document.getElementById("menu-services")).visibility, top: Math.round(document.getElementById("services-interactive").getBoundingClientRect().top), hid: [...document.querySelectorAll("[data-reveal]")].filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99; }).length }));
    ok(a1.closed === "hidden" && a1.top >= NAV && a1.top < NAV + 80 && a1.hid === 0, "Services link: menu closes, row lands under the header (top " + a1.top + "), content visible");
    await p.locator('button[aria-controls="menu-work"]').click();
    await p.waitForTimeout(350);
    await p.locator('#menu-work a[href="/work/dar"]').click();
    await p.waitForURL("**/work/dar");
    await p.waitForTimeout(500);
    ok((await p.evaluate(panelState, "menu-work")) === "hidden" && /DAR/.test(await p.locator("h1").innerText()), "Behind the work: opens the DAR case study and the menu is closed");
    ok((await p.evaluate(() => document.querySelector('header .nav-item[aria-current="true"]').textContent.trim())) === "Work", "Work stays current on a case study");
    for (const [name, sel] of [["Selected work", "#work"], ["More websites", "#more"]]) {
      await p.goto(B + "/", { waitUntil: "load" });
      await p.waitForTimeout(500);
      await p.locator('button[aria-controls="menu-work"]').click();
      await p.waitForTimeout(350);
      await p.locator('#menu-work a', { hasText: name }).first().click();
      await p.waitForTimeout(300);
      const t = await p.evaluate((s) => ({ top: Math.round(document.querySelector(s).getBoundingClientRect().top), hid: [...document.querySelectorAll("[data-reveal]")].filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99; }).length }), sel);
      ok(t.top >= NAV - 1 && t.top < NAV + 40 && t.hid === 0, name + ": lands below the header (top " + t.top + "), content visible");
    }
    await ctx.close();
  }

  // ================= HOVER INTENT (fine pointer) =================
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(800);
    const tr = p.locator('button[aria-controls="menu-work"]');
    const box = await tr.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.waitForTimeout(30);
    const early = await p.evaluate(panelState, "menu-work");
    await p.waitForTimeout(350);
    ok(early === "hidden" && (await p.evaluate(panelState, "menu-work")) === "visible", "hover: opens after a short intent delay, not instantly");
    const pb = await p.locator("#menu-work").boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height + 14, { steps: 4 });
    await p.mouse.move(pb.x + 60, pb.y + 30, { steps: 8 });
    await p.waitForTimeout(500);
    ok((await p.evaluate(panelState, "menu-work")) === "visible", "hover: pointer can travel from trigger to panel without it closing");
    await p.mouse.move(700, 820, { steps: 6 });
    await p.waitForTimeout(600);
    ok((await p.evaluate(panelState, "menu-work")) === "hidden", "hover: closes after the pointer leaves");
    await tr.click();
    await p.waitForTimeout(400);
    await p.mouse.move(700, 820, { steps: 6 });
    await p.waitForTimeout(600);
    ok((await p.evaluate(panelState, "menu-work")) === "visible", "a menu opened by click stays open when the pointer leaves");
    await ctx.close();
  }

  // ================= SHORT VIEWPORT + TABLET =================
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 520 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(600);
    await p.locator('button[aria-controls="menu-work"]').click();
    await p.waitForTimeout(450);
    const s = await p.evaluate(() => { const e = document.getElementById("menu-work"); const r = e.getBoundingClientRect(); return { bottom: Math.round(r.bottom), vh: innerHeight, scrolls: e.scrollHeight > e.clientHeight }; });
    ok(s.bottom <= s.vh && s.scrolls, "short window (520px high): panel stays inside the viewport and scrolls internally");
    await ctx.close();
    const c2 = await b.newContext({ viewport: { width: 768, height: 1024 } });
    const p2 = await c2.newPage();
    await p2.goto(B + "/", { waitUntil: "load" });
    await p2.waitForTimeout(600);
    const tab = await p2.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bar: document.querySelector(".nav-bar").getBoundingClientRect().height, menuBtn: !!document.querySelector("button[aria-haspopup=dialog]") && getComputedStyle(document.querySelector("button[aria-haspopup=dialog]")).display !== "none" }));
    ok(tab.sw <= tab.cw, "768px: no overflow (" + (tab.menuBtn ? "compact menu" : "full nav") + ")");
    await p2.locator('button[aria-controls="menu-work"]').click().catch(() => {});
    await p2.waitForTimeout(450);
    await p2.screenshot({ path: out + "nf-tablet-menu.png" });
    await c2.close();
  }

  // ================= MOBILE MENU (touch) =================
  {
    const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(800);
    ok((await p.evaluate(() => document.querySelector(".switch") !== null && document.querySelector(".switch").getBoundingClientRect().width > 0)), "mobile: theme switch stays visible in the header");
    const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    ok(m.sw <= m.cw, "mobile: header and hero cause no horizontal overflow");
    await p.getByRole("button", { name: "Menu" }).tap();
    await p.waitForTimeout(400);
    ok((await p.evaluate(() => !!document.querySelector("dialog[open]"))), "mobile: Menu opens an accessible dialog by tap");
    const wb = p.locator('dialog[open] button[aria-controls="mobile-work"]');
    ok((await wb.getAttribute("aria-expanded")) === "false", "mobile: Work group starts collapsed");
    await wb.tap();
    ok((await wb.getAttribute("aria-expanded")) === "true" && (await p.locator("#mobile-work a").count()) === 3, "mobile: Work expands to three links");
    const sb = p.locator('dialog[open] button[aria-controls="mobile-services"]');
    await sb.tap();
    ok((await sb.getAttribute("aria-expanded")) === "true" && (await p.locator("#mobile-services a").count()) === 3, "mobile: Services expands to three links");
    ok((await p.locator("dialog[open]").getByRole("link", { name: /Let.s talk/ }).isVisible()) && (await p.locator("dialog[open] .switch").isVisible()), "mobile: contact action and theme switch present in the menu");
    await p.screenshot({ path: out + "nf-mobile-menu.png" });
    await p.keyboard.press("Escape");
    await p.waitForTimeout(300);
    ok((await p.evaluate(() => !document.querySelector("dialog[open]") && document.activeElement.textContent.trim() === "Menu")), "mobile: Escape closes and focus returns to Menu");
    await p.getByRole("button", { name: "Menu" }).tap();
    await p.waitForTimeout(300);
    await p.locator('dialog[open] button[aria-controls="mobile-services"]').tap();
    await p.locator('#mobile-services a', { hasText: "Redesigns" }).tap();
    await p.waitForTimeout(500);
    const mt = await p.evaluate(() => ({ closed: !document.querySelector("dialog[open]"), top: Math.round(document.getElementById("services-redesigns").getBoundingClientRect().top) }));
    ok(mt.closed && mt.top >= NAV && mt.top < NAV + 80, "mobile: choosing a link closes the menu and lands under the header (top " + mt.top + ")");
    await ctx.close();
  }

  // ================= HERO =================
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => {
      window.__anim = [];
      document.addEventListener("animationstart", (e) => { if (/^hero-/.test(e.animationName)) window.__anim.push(["start", e.animationName, performance.now()]); }, true);
      document.addEventListener("animationend", (e) => { if (/^hero-/.test(e.animationName)) window.__anim.push(["end", e.animationName, performance.now()]); }, true);
      window.__cls = 0;
      try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {}
    });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "domcontentloaded" });
    const flag0 = await p.evaluate(() => document.documentElement.hasAttribute("data-hero-intro"));
    ok(flag0, "hero: first visit starts the opening");
    await p.waitForTimeout(120);
    const imm = await p.evaluate(() => ({ h1: getComputedStyle(document.querySelector("h1")).opacity, btn: document.querySelector("a.btn-primary") !== null, nav: document.querySelector(".nav-bar").getBoundingClientRect().height > 0, mask: getComputedStyle(document.querySelector(".hero-mask")).opacity }));
    ok(imm.h1 === "1" && imm.btn && imm.nav, "hero: navigation, headline and actions are available immediately");
    await p.evaluate(() => scrollTo(0, 120));
    ok((await p.evaluate(() => scrollY)) > 0 && (await p.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden")), "hero: no scroll lock during the opening");
    await p.evaluate(() => scrollTo(0, 0));
    // sample the opening
    const samples = [];
    for (let i = 0; i < 12; i++) {
      samples.push(await p.evaluate(() => { const m = document.querySelector(".hero-mask"); const c = document.querySelector(".hero .cover").getBoundingClientRect(); return { op: +getComputedStyle(m).opacity, clip: getComputedStyle(m).clipPath, cw: Math.round(c.width), ch: Math.round(c.height) }; }));
      await p.waitForTimeout(110);
    }
    await p.waitForTimeout(600);
    const anim = await p.evaluate(() => window.__anim);
    const st = anim.find((a) => a[0] === "start" && a[1] === "hero-open");
    const en = anim.find((a) => a[0] === "end" && a[1] === "hero-open");
    ok(st && en && en[2] - st[2] >= 900 && en[2] - st[2] <= 1200, "hero: opening lasts about a second (" + (st && en ? Math.round(en[2] - st[2]) : "n/a") + "ms)");
    ok(new Set(samples.map((s) => s.cw + "x" + s.ch)).size === 1, "hero: the image container never changes size during the reveal, so the photo is not distorted (" + samples[0].cw + "x" + samples[0].ch + ")");
    ok(samples.every((s, i) => s.op === 0 || s.op === 1 || i > 0) && samples.some((s) => s.clip !== "none" && /inset/.test(s.clip)), "hero: window clips the photo while opening");
    const fin = await p.evaluate(() => ({ attr: document.documentElement.hasAttribute("data-hero-intro"), op: getComputedStyle(document.querySelector(".hero-mask")).opacity, clip: getComputedStyle(document.querySelector(".hero-mask")).clipPath, flag: sessionStorage.getItem("ss-hero"), cover: (() => { const r = document.querySelector(".hero .cover").getBoundingClientRect(); return +(r.width / r.height).toFixed(3); })(), cls: window.__cls }));
    ok(!fin.attr && fin.op === "1" && fin.clip === "none" && fin.flag === "1", "hero: ends fully open, no permanent capsule crop, flag cleared and session marked");
    ok(Math.abs(fin.cover - 1.5) < 0.01, "hero: final photograph is the full 3:2 composition");
    ok(fin.cls < 0.02, "hero: no layout shift (CLS " + fin.cls.toFixed(3) + ")");
    // words don't overlap the image, across widths
    for (const w of [1024, 1280, 1440, 1920]) {
      await p.setViewportSize({ width: w, height: 900 });
      await p.waitForTimeout(250);
      const ov = await p.evaluate(() => { const c = document.querySelector(".hero .cover").getBoundingClientRect(); return [...document.querySelectorAll(".hero-word")].map((e) => { const r = e.getBoundingClientRect(); return { overlap: r.right > c.left + 1 && r.left < c.right - 1, off: r.left < 0 || r.right > innerWidth }; }); });
      ok(ov.every((o) => !o.overlap && !o.off), "hero: words sit beside the photo without overlap or clipping at " + w + "px");
    }
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.screenshot({ path: out + "nf-hero-final.png" });
    // selection: no replay, crossfade
    await p.getByRole("button", { name: /02/ }).click();
    await p.waitForTimeout(700);
    const sel = await p.evaluate(() => ({ attr: document.documentElement.hasAttribute("data-hero-intro"), name: getComputedStyle(document.querySelector(".hero-mask")).animationName, title: document.querySelector("[aria-live=polite] p").textContent, on: decodeURIComponent(document.querySelector('.cover-layer[data-state="on"]').currentSrc), anim: window.__anim.filter((a) => a[0] === "start" && a[1] === "hero-open").length }));
    ok(!sel.attr && sel.name === "none" && sel.title === "Aurelle" && /aurelle/.test(sel.on) && sel.anim === 1, "hero: choosing a project crossfades without replaying the opening");
    // reload: no replay
    await p.reload({ waitUntil: "domcontentloaded" });
    ok(!(await p.evaluate(() => document.documentElement.hasAttribute("data-hero-intro"))), "hero: does not replay on reload within the session");
    // return from a case study
    await p.waitForTimeout(500);
    await p.locator(".hero a.cs-link").click();
    await p.waitForURL("**/work/**");
    await p.goBack();
    await p.waitForTimeout(700);
    ok(!(await p.evaluate(() => document.documentElement.hasAttribute("data-hero-intro"))) && (await p.evaluate(() => getComputedStyle(document.querySelector(".hero-mask")).animationName)) === "none", "hero: does not replay when returning from a case study");
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "domcontentloaded" });
    const r = await p.evaluate(() => ({ attr: document.documentElement.hasAttribute("data-hero-intro"), op: getComputedStyle(document.querySelector(".hero-mask")).opacity, clip: getComputedStyle(document.querySelector(".hero-mask")).clipPath, an: getComputedStyle(document.querySelector(".hero-mask")).animationName }));
    ok(!r.attr && r.op === "1" && r.clip === "none" && r.an === "none", "reduced motion: final hero composition immediately");
    await p.waitForTimeout(600);
    await p.getByRole("button", { name: /03/ }).click();
    await p.waitForTimeout(400);
    ok((await p.evaluate(() => document.querySelector("[aria-live=polite] p").textContent)) === "Zaytoun", "reduced motion: project selector still works");
    await ctx.close();
    const c2 = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const p2 = await c2.newPage();
    await p2.goto(B + "/");
    ok((await p2.evaluate(() => getComputedStyle(document.querySelector(".hero-mask")).opacity)) === "1", "JavaScript off: hero shows its final composition");
    await c2.close();
  }
  for (const [w, h, mob] of [[375, 812, true], [768, 1024, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(150);
    const an = await p.evaluate(() => ({ mask: getComputedStyle(document.querySelector(".hero-mask")).animationName, word: getComputedStyle(document.querySelector(".hero-word-l")).animationName }));
    await p.waitForTimeout(1700);
    const g = await p.evaluate(() => { const c = document.querySelector(".hero .cover").getBoundingClientRect(); const wl = document.querySelector(".hero-word-l").getBoundingClientRect(); const wr = document.querySelector(".hero-word-r").getBoundingClientRect(); return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, imgInView: c.left >= 0 && c.right <= innerWidth, ratio: +(c.width / c.height).toFixed(2), stacked: c.top > wl.bottom - 2 && c.top > wr.bottom - 2, sameRow: Math.abs(wl.top - wr.top) < 4, op: getComputedStyle(document.querySelector(".hero-mask")).opacity }; });
    ok(an.mask === "hero-open-m" && an.word === "none", w + "px: simple reveal, words do not move (" + an.mask + ", words " + an.word + ")");
    ok(g.sw <= g.cw && g.imgInView && g.ratio === 1.5 && g.stacked && g.op === "1", w + "px: stacked heading, full 3:2 image and copy, no overflow");
    await p.screenshot({ path: out + "nf-hero-" + w + ".png" });
    await ctx.close();
  }

  // ================= FOOTER =================
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: "America/New_York" });
    await ctx.clock.install({ time: new Date("2026-11-09T12:00:30Z") });
    const errs = [];
    const p = await ctx.newPage();
    p.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text().slice(0, 140)); });
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(300);
    await ctx.clock.runFor(100);
    const t0 = await p.evaluate(() => document.querySelector("footer").innerText);
    ok(/Currently in Amman,\s*3:00 PM/.test(t0), "clock: shows Amman time regardless of the browser's timezone (12:00:30Z -> 3:00 PM) ");
    await ctx.clock.runFor(30_000);
    ok(/3:01 PM/.test(await p.evaluate(() => document.querySelector("footer").innerText)), "clock: updates on the minute (3:01 PM after 30s)");
    ok(errs.length === 0, "footer: no hydration or console errors " + JSON.stringify(errs));
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => scrollTo(0, 3000));
    await p.waitForTimeout(150);
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(150);
    ok((await p.evaluate(() => [...document.querySelectorAll("footer [data-reveal]")].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length)) === 0, "footer: note and tiles are visible when scrolled to (one gentle entrance, never blank)");
    const txt = await p.evaluate(() => document.querySelector(".note-card").innerText.replace(/\s+/g, " "));
    ok(/A NOTE FROM ALI/i.test(txt) && txt.includes("Thanks for spending a little time with my work.") && txt.includes("I build websites with character, care, and attention to the details.") && txt.includes("Have something in mind? Let\u2019s make it happen.") && txt.includes("alitsai55@gmail.com"), "footer: note is real HTML with the requested wording");
    const soc = await p.evaluate(() => [...document.querySelectorAll(".social-tile")].map((a) => ({ label: a.querySelector(".social-label").textContent, href: a.getAttribute("href"), tgt: a.target, svg: !!a.querySelector("svg"), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height), sr: !!a.querySelector(".sr-only") })));
    ok(soc.map((s) => s.label).join() === "Email,LinkedIn,Instagram,GitHub" && soc.every((s) => s.svg && s.w >= 120 && s.h >= 120), "footer: four labelled tiles with real SVG icons: " + soc.map((s) => s.label).join(", "));
    ok(soc[0].href === "mailto:alitsai55@gmail.com" && soc[1].href === "https://www.linkedin.com/in/ali-tsai/" && soc[2].href === "https://www.instagram.com/scrollandserif" && soc[3].href === "https://github.com/AliAdiga" && soc.slice(1).every((s) => s.tgt === "_blank" && s.sr), "footer: destinations match the verified data; external ones open in a new tab with an accessible note");
    const hit = await p.evaluate(() => [...document.querySelectorAll(".social-tile")].map((a) => { const r = a.querySelector(".social-label").getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return a.contains(el); }));
    ok(hit.every(Boolean), "footer: overlapping tiles keep their labels and hit areas usable");
    const t = p.locator(".social-tile").nth(1);
    const before = await t.evaluate((e) => ({ tr: getComputedStyle(e).translate, rot: getComputedStyle(e).rotate }));
    await t.hover();
    await p.waitForTimeout(350);
    const hov = await t.evaluate((e) => ({ tr: getComputedStyle(e).translate, rot: getComputedStyle(e).rotate }));
    ok(/-6px/.test(hov.tr) && /^0deg|^0$/.test(hov.rot) && before.rot !== hov.rot, "footer tile: rises 6px and straightens on hover (" + before.rot + " -> " + hov.rot + ", " + hov.tr + ")");
    await p.mouse.move(5, 5);
    await p.keyboard.press("Tab");
    await t.focus();
    await p.waitForTimeout(350);
    ok(/-6px/.test(await t.evaluate((e) => getComputedStyle(e).translate)), "footer tile: same lift on keyboard focus");
    await t.hover();
    await p.mouse.down();
    await p.waitForTimeout(250);
    ok(/0\.97/.test(await t.evaluate((e) => getComputedStyle(e).scale)), "footer tile: short press state");
    await p.mouse.up();
    await p.mouse.move(5, 5);
    ok(!(await p.evaluate(() => /chat/i.test(document.body.innerHTML.replace(/<script[\s\S]*?<\/script>/g, "")) && !!document.querySelector('[class*="chat"],[id*="chat"],iframe'))), "footer: no chat widget");
    const upd = await p.evaluate(() => { const t = document.querySelector("footer time"); return t ? { dt: t.getAttribute("datetime"), text: t.textContent } : null; });
    ok(upd && /^\d{4}-\d{2}-\d{2}$/.test(upd.dt) && /\d{4}/.test(upd.text), "footer: 'Last updated' comes from the real build date (" + (upd ? upd.text : "none") + ")");
    await p.screenshot({ path: out + "nf-footer-desktop.png" });
    await p.getByRole("link", { name: /Back to top/ }).click();
    await p.waitForTimeout(400);
    ok((await p.evaluate(() => scrollY)) < 5, "footer: Back to top returns to the top");
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(500);
    const g = await p.evaluate(() => { const r = [...document.querySelectorAll(".social-tile")].map((a) => a.getBoundingClientRect()); const lefts = [...new Set(r.map((x) => Math.round(x.left)))]; const tops = [...new Set(r.map((x) => Math.round(x.top)))]; const overlap = r.some((a, i) => r.some((b, j) => i < j && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1)); return { cols: lefts.length, rows: tops.length, overlap, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, min: Math.min(...r.map((x) => x.height)) }; });
    ok(g.cols === 2 && g.rows === 2 && !g.overlap && g.sw <= g.cw && g.min >= 120, "mobile footer: tidy 2x2 tiles, no overlap or overflow");
    await p.screenshot({ path: out + "nf-footer-mobile.png" });
    await ctx.close();
  }

  // ================= THEMES =================
  for (const theme of ["light", "dark"]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); localStorage.removeItem("x"); } catch (e) {} }, theme);
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(2200);
    await p.screenshot({ path: out + "nf-hero-" + theme + ".png" });
    await p.locator('button[aria-controls="menu-work"]').click();
    await p.waitForTimeout(500);
    await p.screenshot({ path: out + "nf-menu-work-" + theme + ".png" });
    await p.keyboard.press("Escape");
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(900);
    await p.screenshot({ path: out + "nf-footer-" + theme + ".png" });
    ok(true, "screenshots captured for " + theme);
    await ctx.close();
  }
  await b.close();
})();
