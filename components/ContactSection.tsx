"use client";
import { useEffect, useId, useRef, useState } from "react";
import { projectTypes, site } from "@/content/site";

type Values = { name: string; email: string; type: string; message: string; budget: string; timeline: string };
type Errors = Partial<Record<"name" | "email" | "type" | "message", string>>;
type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback"; href: string; body: string }
  | { kind: "failed" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.type) e.type = "Please choose a project type.";
  if (v.message.trim().length < 20) e.message = "Please describe the project in a sentence or two (at least 20 characters).";
  return e;
}

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random();

/**
 * Inquiry form. It posts to /api/inquiries and reports success only after the server accepted the message.
 * If sending is not available, the visitor's text stays in the form and a prepared email is offered instead.
 */
export function ContactSection() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const attempt = useRef("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    startedAt.current = Date.now();
    attempt.current = newKey();
  }, []);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state.kind === "sending") return; // blocks accidental double submits
    const fd = new FormData(ev.currentTarget);
    const v: Values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      type: String(fd.get("type") ?? ""),
      message: String(fd.get("message") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
    };
    const found = validate(v);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Errors)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setState({ kind: "sending" });
    const fallbackBody = `Name: ${v.name.trim()}\nEmail: ${v.email.trim()}\nProject type: ${v.type}\n${
      v.budget.trim() ? `Budget: ${v.budget.trim()}\n` : ""
    }${v.timeline.trim() ? `Timeline: ${v.timeline.trim()}\n` : ""}\n${v.message.trim()}`;
    const fallbackHref = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry: ${v.type}`)}&body=${encodeURIComponent(fallbackBody)}`;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...v,
          website: String(fd.get("website") ?? ""),
          elapsed: Date.now() - startedAt.current,
          key: attempt.current,
        }),
      });
      if (res.ok) {
        formRef.current?.reset();
        attempt.current = newKey();
        startedAt.current = Date.now();
        setState({ kind: "sent" });
      } else if (res.status === 503) {
        setState({ kind: "fallback", href: fallbackHref, body: fallbackBody });
      } else if (res.status === 400) {
        const data = (await res.json().catch(() => ({}))) as { fields?: Record<string, boolean>; error?: string };
        if (data.fields) {
          const e: Errors = {};
          for (const k of Object.keys(data.fields)) {
            if (k === "name" || k === "email" || k === "type" || k === "message") e[k] = "Please check this field.";
          }
          setErrors(e);
        }
        setState({ kind: "failed" });
      } else {
        setState({ kind: "failed" });
      }
    } catch {
      setState({ kind: "failed" });
    }
  }

  const field = (k: keyof Errors) => ({
    id: `${uid}-${k}`,
    name: k,
    "aria-required": true as const,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });
  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p className="error" id={`${uid}-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;
  const sending = state.kind === "sending";

  return (
    <section id="contact" data-nav="contact" className="border-t border-line bg-sand" aria-labelledby="contact-h">
      <div className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal="" suppressHydrationWarning>
          <h2 id="contact-h" className="display text-[clamp(2.4rem,5vw,4.4rem)]">
            Tell me about your <em>project</em>
          </h2>
          <p className="measure mt-6 text-[1.08rem] text-ink-soft">
            A few lines about your business and what you need is enough to start. I read every message myself.
          </p>
          <p className="mt-8 text-[1.02rem]">
            Prefer email?{" "}
            <a className="text-link tap-sm font-semibold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          aria-busy={sending}
          className="grid gap-6 rounded-[14px] border border-line bg-ivory p-6 shadow-[0_24px_40px_-32px_rgb(58_34_48_/_0.5)] sm:p-9 lg:col-span-7"
          data-reveal=""
          suppressHydrationWarning
          style={{ "--d": "100ms" } as React.CSSProperties}
        >
          <p className="text-[0.95rem] text-ink-soft">All fields are required except budget and timeline.</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={`${uid}-name`}>Name</label>
              <input type="text" autoComplete="name" {...field("name")} />
              {err("name")}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-email`}>Email</label>
              <input type="email" autoComplete="email" {...field("email")} />
              {err("email")}
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${uid}-type`}>Project type</label>
            <select defaultValue="" {...field("type")}>
              <option value="" disabled>
                Choose one
              </option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {err("type")}
          </div>
          <div className="field">
            <label htmlFor={`${uid}-message`}>Short project description</label>
            <textarea {...field("message")} />
            {err("message")}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="field">
              <label htmlFor={`${uid}-budget`}>
                Budget <span className="font-normal text-ink-soft">(optional)</span>
              </label>
              <input id={`${uid}-budget`} name="budget" type="text" autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor={`${uid}-timeline`}>
                Timeline <span className="font-normal text-ink-soft">(optional)</span>
              </label>
              <input id={`${uid}-timeline`} name="timeline" type="text" autoComplete="off" />
            </div>
          </div>

          {/* Honeypot: hidden from people and assistive tech. */}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Sending" : "Send inquiry"}
              <span className="arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div aria-live="polite" role="status">
            {state.kind === "sent" && (
              <p className="font-semibold">Thank you. Your inquiry was received, and I&rsquo;ll reply by email.</p>
            )}
            {state.kind === "failed" && (
              <p className="error" role="alert">
                Your message could not be sent. It is still in the form, so you can try again, or email{" "}
                <a className="text-link font-semibold" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            )}
            {state.kind === "fallback" && (
              <div className="rounded-[10px] border border-line p-4 text-[0.95rem]">
                <p>
                  Sending from this page isn&rsquo;t available right now, and nothing has been sent. Your message is
                  still in the form.{" "}
                  <a className="text-link font-semibold" href={state.href}>
                    Open it in your email app
                  </a>{" "}
                  or write to <strong>{site.email}</strong>.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
