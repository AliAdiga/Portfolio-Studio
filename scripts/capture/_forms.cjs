const { chromium } = require("D:/Projects/DAR/node_modules/playwright-core");
const fs = require("fs");
const A = "http://localhost:3710"; // no email provider configured
const B = "http://localhost:3711"; // wired to a local mock provider (records, never sends)
const LOG = "D:/Projects/Portfolio-Studio/scripts/_mock.log";
const ok = (c, m) => console.log(c ? "PASS" : "FAIL", m);
const mock = () => (fs.existsSync(LOG) ? fs.readFileSync(LOG, "utf8").trim().split("\n").filter(Boolean) : []);
const good = (extra = {}) => ({
  name: "Test Person",
  email: "test@example.com",
  type: "Website redesign",
  message: "We need a bilingual website for our small restaurant in Amman.",
  budget: "",
  timeline: "",
  website: "",
  elapsed: 5000,
  key: "key-" + Math.random().toString(36).slice(2) + "-abcdef",
  ...extra,
});
const post = (base, body, headers = {}) =>
  fetch(base + "/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const fill = async (p) => {
  await p.fill('input[name="name"]', "Test Person");
  await p.fill('input[name="email"]', "test@example.com");
  await p.selectOption('select[name="type"]', "Website redesign");
  await p.fill('textarea[name="message"]', "We need a bilingual website for our small restaurant in Amman.");
  await p.fill('input[name="budget"]', "Flexible");
};

(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });

  // ---- UI against the unconfigured server
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(A + "/#contact");
    await p.waitForTimeout(1500);
    await p.getByRole("button", { name: /Send inquiry/ }).click();
    ok((await p.locator(".error").count()) === 4, "form: 4 inline errors on empty submit");
    ok((await p.evaluate(() => document.activeElement.getAttribute("name"))) === "name", "form: focus moves to first invalid field");
    await fill(p);
    await p.getByRole("button", { name: /Send inquiry/ }).click();
    await p.waitForTimeout(900);
    const txt = await p.locator('[role="status"]').innerText();
    ok(/nothing has been sent/i.test(txt) && !/Thank you/.test(txt), "unconfigured: honest fallback, no success message");
    ok((await p.inputValue('textarea[name="message"]')).includes("restaurant in Amman"), "unconfigured: entered text is preserved");
    ok((await p.locator('a:has-text("Open it in your email app")').getAttribute("href")).startsWith("mailto:"), "unconfigured: prepared email link offered");
    await p.locator("#contact").screenshot({ path: "D:/Projects/Portfolio-Studio/shots/r/contact-fallback.png" });
    await ctx.close();
  }

  // ---- UI against the mock-provider server
  {
    const before = mock().length;
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(B + "/#contact");
    await p.waitForTimeout(1800);
    await fill(p);
    const btn = p.locator("form button[type=submit]");
    await btn.dblclick(); // accidental double click
    await p.waitForTimeout(1200);
    const txt = await p.locator('[role="status"]').innerText();
    ok(/Thank you/.test(txt), "mock provider: success shown only after the server accepted");
    const lines = mock().slice(before);
    ok(lines.length === 1, "double click sends exactly one message (" + lines.length + ")");
    const sent = lines[0] ? JSON.parse(JSON.parse(lines[0]).body) : {};
    ok(JSON.parse(lines[0]).auth === "Bearer test-key" && sent.to[0] === "owner@example.invalid" && sent.reply_to === "test@example.com", "provider request carries server-side key, destination and reply-to");
    ok(/Budget: Flexible/.test(sent.text) && /restaurant in Amman/.test(sent.text), "message body includes optional budget and the description");
    ok((await p.inputValue('textarea[name="message"]')) === "", "form resets after success");
    await p.locator("#contact").screenshot({ path: "D:/Projects/Portfolio-Studio/shots/r/contact-success.png" });

    // failure and sending states via network stubs
    await fill(p);
    await p.route("**/api/inquiries", (r) => r.fulfill({ status: 502, contentType: "application/json", body: '{"error":"send_failed"}' }));
    await btn.click();
    await p.waitForTimeout(700);
    ok(/could not be sent/.test(await p.locator('[role="status"]').innerText()), "502: helpful failure message");
    ok((await p.inputValue('textarea[name="message"]')).includes("restaurant in Amman"), "502: text preserved for another try");
    await p.unroute("**/api/inquiries");
    await p.route("**/api/inquiries", async (r) => {
      await new Promise((s) => setTimeout(s, 900));
      r.abort();
    });
    await btn.click();
    await p.waitForTimeout(250);
    ok((await btn.isDisabled()) && /Sending/.test(await btn.innerText()), "sending state: button disabled and labelled while in flight");
    await p.waitForTimeout(1200);
    ok(/could not be sent/.test(await p.locator('[role="status"]').innerText()), "network error: failure message, no false success");
    await ctx.close();
  }

  // ---- API hardening
  {
    const before = mock().length;
    let r = await post(B, good({ website: "http://spam.example" }));
    ok(r.status === 200 && mock().length === before, "honeypot: answered quietly, nothing sent");
    r = await post(B, good({ elapsed: 100 }));
    ok(r.status === 400, "too-fast submission rejected (400)");
    r = await post(B, good(), { Origin: "https://evil.example" });
    ok(r.status === 403, "cross-origin request rejected (403)");
    r = await post(B, good({ email: "nope", message: "short" }));
    const j = await r.json();
    ok(r.status === 400 && j.fields && j.fields.email && j.fields.message, "server-side validation (400 with field names)");
    const key = "dupe-" + Math.random().toString(36).slice(2) + "-abcdef";
    const n0 = mock().length;
    const r1 = await post(B, good({ key }));
    const r2 = await post(B, good({ key }));
    const j2 = await r2.json();
    ok(r1.status === 200 && r2.status === 200 && j2.duplicate === true && mock().length === n0 + 1, "same attempt twice is accepted once");
    r = await post(A, good());
    ok(r.status === 503, "unconfigured server answers 503, never success");
    let limited = false;
    for (let i = 0; i < 8; i++) {
      r = await post(B, good());
      if (r.status === 429) {
        limited = true;
        break;
      }
    }
    ok(limited, "rate limit: repeated submissions get 429");
  }
  await b.close();
})();
