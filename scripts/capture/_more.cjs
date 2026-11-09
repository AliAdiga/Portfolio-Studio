const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const B = "http://localhost:3840";
const ok = (c, m) => console.log(c ? "PASS" : "FAIL", m);
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const names = ["Vestra", "Cedar Stone Legal", "Evercare Hospital"];
const urls = ["https://vestra-eta.vercel.app", "https://cedar-stone-legal.vercel.app", "https://evercare-hospital-blush.vercel.app"];
const hiddenInView = () =>
  [...document.querySelectorAll("[data-reveal]")].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99;
  }).length;

(async () => {
  const b = await chromium.launch({ executablePath: exe });

  // ---- structure, links, images, lazy loading
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const reqs = [];
    p.on("request", (r) => { if (/more%2F|work\/more/.test(decodeURIComponent(r.url())) && !r.url().includes("localhost:3840/work/more/")) reqs.push(decodeURIComponent(r.url())); });
    await p.goto(B + "/", { waitUntil: "load" });
    await p.waitForTimeout(1500);
    ok(reqs.length === 0, "lazy: no More-websites captures downloaded on first load (" + reqs.length + ")");
    const order = await p.evaluate(() => [...document.querySelectorAll("main > *, main section, #work")].map((e) => e.id).filter(Boolean));
    const ids = await p.evaluate(() => ["work", "more", "services"].map((id) => document.getElementById(id).getBoundingClientRect().top + scrollY));
    ok(ids[0] < ids[1] && ids[1] < ids[2], "order: Selected Work, then More websites, then Services");
    ok((await p.locator("#more-h").innerText()).replace(/\s+/g, " ") === "More websites", "heading reads 'More websites'");
    const cards = await p.evaluate(() => [...document.querySelectorAll("#more .more-card")].map((c) => ({ name: c.querySelector("h3").textContent, cat: c.querySelector("p.text-plum").textContent, desc: c.querySelectorAll("p")[1].textContent, href: c.querySelector("a.cs-link").href, target: c.querySelector("a.cs-link").target, rel: c.querySelector("a.cs-link").rel, sr: c.querySelector("a.cs-link .sr-only").textContent, img: (() => { const i = c.querySelector("img"); return { w: i.getAttribute("width"), h: i.getAttribute("height"), loading: i.loading, alt: i.alt.length > 40, src: decodeURIComponent(i.getAttribute("src")) }; })() })));
    ok(cards.length === 3 && cards.map((c) => c.name).join() === names.join(), "three cards in order: " + cards.map((c) => c.name).join(", "));
    ok(cards.every((c, i) => c.href.replace(/\/$/, "") === urls[i] && c.target === "_blank" && /noopener/.test(c.rel) && /opens in a new tab/.test(c.sr)), "links: correct URLs, new tab, noopener, accessible 'opens in a new tab'");
    ok(cards.every((c) => c.img.w === "1357" && c.img.h === "932" && c.img.loading === "lazy" && c.img.alt), "images: explicit 1357x932, lazy, descriptive alt");
    ok(cards.every((c) => c.cat && c.desc.length > 40), "each card has category and a one-sentence description in HTML below the image");
    ok(cards.map((c) => /more%2F(\S+?)-desktop|more\/(\S+?)-desktop/.exec(c.img.src) ? 1 : 0).every(Boolean) && /vestra/.test(cards[0].img.src) && /cedar/.test(cards[1].img.src) && /evercare/.test(cards[2].img.src), "captures mapped to the right projects");
    const naturals = await p.evaluate(() => [...document.querySelectorAll("#more .more-img")].map((i) => ({ nat: +(i.naturalWidth / i.naturalHeight).toFixed(3), box: +(i.getBoundingClientRect().width / i.getBoundingClientRect().height).toFixed(3) })));
    await p.evaluate(() => document.querySelector("#more").scrollIntoView());
    await p.waitForTimeout(1200);
    const n2 = await p.evaluate(() => [...document.querySelectorAll("#more .more-img")].map((i) => ({ nat: +(i.naturalWidth / i.naturalHeight).toFixed(3), box: +(i.getBoundingClientRect().width / i.getBoundingClientRect().height).toFixed(3) })));
    ok(n2.every((x) => Math.abs(x.nat - x.box) < 0.02), "images are not stretched (natural vs displayed ratio " + n2.map((x) => x.nat + "/" + x.box).join(", ") + ")");
    ok(reqs.length === 3, "lazy: the three captures load only when the section nears the screen (" + reqs.length + ")");
    ok((await p.evaluate(hiddenInView)) === 0, "reveal: section visible, never blank, after scrolling to it");
    ok((await p.evaluate(() => [...document.querySelectorAll('header .nav-item[aria-current="true"]')].map((e) => e.textContent.trim()).join())) === "Work", "nav: More websites counts as Work, so only Work is marked active");
    await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/more-desktop-light.png" });
    await ctx.close();
  }

  // ---- anchor / jump reveal
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/#more", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(400);
    ok((await p.evaluate(hiddenInView)) === 0, "loading /#more: cards visible within 400ms of DOM ready");
    await ctx.close();
  }

  // ---- hover, focus, dialog (desktop)
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => document.querySelector("#more").scrollIntoView());
    await p.waitForTimeout(1000);
    const card = p.locator("#more .more-card").nth(1);
    const before = await card.evaluate((c) => ({ tr: getComputedStyle(c.querySelector(".more-img")).transform, bc: getComputedStyle(c.querySelector(".more-shot")).borderColor }));
    await card.locator(".more-shot").hover();
    await p.waitForTimeout(450);
    const after = await card.evaluate((c) => ({ tr: getComputedStyle(c.querySelector(".more-img")).transform, bc: getComputedStyle(c.querySelector(".more-shot")).borderColor, ring: getComputedStyle(c.querySelector(".ring")).transform, dur: getComputedStyle(c.querySelector(".more-img")).transitionDuration, bdur: getComputedStyle(c.querySelector(".more-shot")).transitionDuration }));
    ok(/matrix\(1\.025, 0, 0, 1\.025/.test(after.tr) && before.tr === "none", "hover: image scales to 1.025 (" + after.tr + ")");
    ok(after.bc !== before.bc, "hover: border emphasised (" + before.bc + " -> " + after.bc + ")");
    ok(/matrix\(1, 0, 0, 1, 3, 0\)/.test(after.ring), "hover: arrow moves 3px (" + after.ring + ")");
    ok(after.dur === "0.25s" && after.bdur === "0.25s", "hover durations 250ms");
    ok((await p.evaluate(() => getComputedStyle(document.querySelector("#more .more-shot")).overflow)) === "hidden", "image is clipped inside its frame");
    // essential controls visible without hover
    ok((await card.locator("a.cs-link").isVisible()) && (await card.getByRole("button", { name: /More views/ }).isVisible()), "Visit website and More views are visible without hover");
    // keyboard
    await p.mouse.move(5, 5);
    await p.evaluate(() => document.querySelector("#more .more-card a.cs-link").focus());
    await p.keyboard.press("Shift+Tab");
    await p.keyboard.press("Tab");
    const focus = await p.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return { txt: a.textContent.trim().slice(0, 20), outline: s.outlineStyle + " " + s.outlineWidth, shot: getComputedStyle(a.closest(".more-card").querySelector(".more-shot")).borderColor }; });
    ok(/solid 3px/.test(focus.outline), "keyboard focus ring on the link (" + focus.outline + ") and card border emphasised (" + focus.shot + ")");
    await p.keyboard.press("Tab");
    ok((await p.evaluate(() => document.activeElement.textContent.includes("More views"))), "Tab reaches 'More views' after 'Visit website'");
    await p.keyboard.press("Enter");
    await p.waitForTimeout(600);
    const dlg = await p.evaluate(() => { const d = document.querySelector("dialog[open]"); return d ? { imgs: d.querySelectorAll("img").length, title: d.querySelector("h2").textContent } : null; });
    ok(dlg && dlg.imgs === 2 && /Vestra/.test(dlg.title), "dialog opens by keyboard with both captures (" + (dlg ? dlg.title : "none") + ")");
    await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/more-dialog.png" });
    await p.keyboard.press("Escape");
    await p.waitForTimeout(300);
    ok((await p.evaluate(() => !document.querySelector("dialog[open]") && document.activeElement.textContent.includes("More views"))), "Escape closes the dialog and focus returns to its button");
    await ctx.close();
  }

  // ---- reduced motion
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(B + "/", { waitUntil: "load" });
    await p.evaluate(() => document.querySelector("#more").scrollIntoView());
    await p.waitForTimeout(500);
    await p.locator("#more .more-shot").first().hover();
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ tr: getComputedStyle(document.querySelector("#more .more-img")).transform, dur: getComputedStyle(document.querySelector("#more .more-img")).transitionDuration, hid: document.querySelectorAll("#more [data-rv]").length }));
    ok(r.tr === "none" && r.dur === "0s" && r.hid === 0, "reduced motion: no scale, no transition, cards never hidden " + JSON.stringify(r));
    await ctx.close();
  }

  // ---- responsive columns, both themes, overflow
  for (const [w, h, cols] of [[375, 812, 1], [768, 1024, 2], [1440, 900, 3]]) {
    for (const theme of ["light", "dark"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
      await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
      const p = await ctx.newPage();
      await p.goto(B + "/#more", { waitUntil: "load" });
      await p.waitForTimeout(900);
      const g = await p.evaluate(() => { const cs = [...document.querySelectorAll("#more .more-card")].map((c) => c.getBoundingClientRect()); const lefts = [...new Set(cs.map((r) => Math.round(r.left)))]; const widths = [...new Set(cs.map((r) => Math.round(r.width)))]; return { columns: lefts.length, equalWidth: widths.length === 1, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, hid: [...document.querySelectorAll("[data-reveal]")].filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && parseFloat(getComputedStyle(e).opacity) < 0.99; }).length }; });
      ok(g.columns === cols && g.equalWidth && g.sw <= g.cw && g.hid === 0, w + "px " + theme + ": " + g.columns + " column(s), equal cards, no overflow, nothing hidden");
      await p.screenshot({ path: "D:/Projects/Portfolio-Studio/docs/screenshots/more-" + w + "-" + theme + ".png" });
      await ctx.close();
    }
  }
  await b.close();
})();
