import { NextResponse } from "next/server";
import { z } from "zod";
import { projectTypes } from "@/content/site";

export const runtime = "nodejs";

/**
 * Project inquiry endpoint.
 *
 * Sending uses an email API over HTTPS (Resend's request format by default). It only works when these
 * server-side variables exist; nothing is ever exposed to the browser:
 *   INQUIRY_PROVIDER_API_KEY   API key for the provider
 *   INQUIRY_TO                 where inquiries are delivered
 *   INQUIRY_FROM               a sender address verified with the provider
 *   INQUIRY_PROVIDER_URL       optional, defaults to https://api.resend.com/emails
 * Without them the endpoint answers 503 { error: "not_configured" } and the form falls back to
 * email. It never reports success unless the provider accepted the message.
 */

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  type: z.enum(projectTypes),
  message: z.string().trim().min(20).max(4000),
  budget: z.string().trim().max(120).optional().default(""),
  timeline: z.string().trim().max(120).optional().default(""),
  website: z.string().optional().default(""), // honeypot: real visitors never see or fill this
  elapsed: z.number().optional().default(0), // ms between form render and submit
  key: z.string().min(8).max(80), // idempotency key, one per form attempt
});

// In-memory stores: per server instance only. Fine for a personal site; use a shared store at higher volume.
const hits = new Map<string, number[]>();
const seen = new Map<string, number>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const clean = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 200);
const json = (body: Record<string, unknown>, status: number) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  // Same-origin only.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json({ error: "forbidden" }, 403);
    } catch {
      return json({ error: "forbidden" }, 403);
    }
  }

  const raw = await req.text();
  if (raw.length > 16_000) return json({ error: "too_large" }, 413);

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0] ?? "form"), true]));
    return json({ error: "invalid", fields }, 400);
  }
  const v = parsed.data;

  // Spam signals. A filled honeypot is answered as if it worked, so bots learn nothing.
  if (v.website) return json({ ok: true }, 200);
  if (v.elapsed < 1200) return json({ error: "too_fast" }, 400);

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return json({ error: "rate_limited" }, 429);

  // The same attempt submitted twice is accepted once.
  const now = Date.now();
  for (const [k, t] of seen) if (now - t > 60 * 60 * 1000) seen.delete(k);
  if (seen.has(v.key)) return json({ ok: true, duplicate: true }, 200);

  const apiKey = process.env.INQUIRY_PROVIDER_API_KEY;
  const to = process.env.INQUIRY_TO;
  const from = process.env.INQUIRY_FROM;
  if (!apiKey || !to || !from) return json({ error: "not_configured" }, 503);

  const text = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Project type: ${v.type}`,
    v.budget ? `Budget: ${v.budget}` : null,
    v.timeline ? `Timeline: ${v.timeline}` : null,
    "",
    v.message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch(process.env.INQUIRY_PROVIDER_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: v.email,
        subject: `New inquiry: ${clean(v.type)} from ${clean(v.name)}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return json({ error: "send_failed" }, 502);
  } catch {
    return json({ error: "send_failed" }, 502);
  }

  seen.set(v.key, now);
  return json({ ok: true }, 200);
}
