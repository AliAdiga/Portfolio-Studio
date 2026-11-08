"use client";
import { useId, useRef, useState } from "react";
import { projectTypes, site } from "@/content/site";
import { Divider } from "./Divider";

/**
 * Inquiry form. No backend is configured by default, so the honest behaviour is:
 *  - validate, then open the visitor's email app with the message prepared
 *    (nothing is sent until they press Send there), and
 *  - if NEXT_PUBLIC_CONTACT_ENDPOINT is set (for example a Formspree URL),
 *    POST the form and report success only when the server answers 2xx.
 * A success message is never shown unless a request was actually accepted.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Values = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.type) e.type = "Please choose a project type.";
  if (v.message.trim().length < 20) e.message = "Please describe the project in at least a sentence or two (20 characters).";
  return e;
}

export function ContactSection() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "mailto"; href: string; body: string }
    | { kind: "sent" }
    | { kind: "failed" }
  >({ kind: "idle" });

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const v: Values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      type: String(fd.get("type") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const found = validate(v);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (endpoint) {
      setState({ kind: "sending" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(v),
        });
        setState(res.ok ? { kind: "sent" } : { kind: "failed" });
        if (res.ok) formRef.current?.reset();
      } catch {
        setState({ kind: "failed" });
      }
      return;
    }

    const body = `Name: ${v.name.trim()}\nEmail: ${v.email.trim()}\nProject type: ${v.type}\n\n${v.message.trim()}`;
    const href = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry: ${v.type}`)}&body=${encodeURIComponent(body)}`;
    setState({ kind: "mailto", href, body });
    window.location.href = href;
  }

  const field = (k: keyof Values) => ({
    id: `${uid}-${k}`,
    name: k,
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });
  const err = (k: keyof Values) =>
    errors[k] ? (
      <p className="error" id={`${uid}-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <section id="contact" data-nav="contact" className="bg-sand" aria-labelledby="contact-h">
      <Divider from="#3a2230" to="var(--c-sand)" />
      <div className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <h2 id="contact-h" data-mask className="display text-[clamp(2.4rem,5vw,4.4rem)]">
            Tell me about your <em>project</em>
          </h2>
          <p className="measure mt-6 text-[1.08rem] text-ink-soft">
            A few lines about your business and what you need is enough to start. I read every message myself.
          </p>
          <ul className="mt-8 space-y-3 text-[1.02rem]">
            <li>
              Email:{" "}
              <a className="text-link font-semibold" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="text-link font-semibold" href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="text-link font-semibold" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          className="grid gap-6 rounded-[14px] border border-charcoal/25 bg-ivory p-6 sm:p-9 lg:col-span-7"
          data-reveal
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
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

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-plum" disabled={state.kind === "sending"}>
              {endpoint ? (state.kind === "sending" ? "Sending" : "Send inquiry") : "Prepare my email"}
              <span className="arrow" aria-hidden="true">&rarr;</span>
            </button>
            {!endpoint && (
              <p className="max-w-sm text-[0.92rem] text-ink-soft">
                This form has no server behind it yet. It opens your email app with your message ready, and nothing
                is sent until you press Send there.
              </p>
            )}
          </div>

          <div aria-live="polite" role="status">
            {state.kind === "mailto" && (
              <div className="rounded-[10px] border border-charcoal/25 p-4 text-[0.95rem]">
                <p>
                  Your email app should open with the message prepared. Nothing has been sent yet. If nothing opened,{" "}
                  <a className="text-link font-semibold" href={state.href}>
                    try again
                  </a>{" "}
                  or write to <strong>{site.email}</strong> and paste this:
                </p>
                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-[0.9rem] text-ink-soft">{state.body}</pre>
              </div>
            )}
            {state.kind === "sent" && <p className="font-semibold">Thank you. Your message was received.</p>}
            {state.kind === "failed" && (
              <p className="error">
                Your message could not be sent. Please email{" "}
                <a className="text-link font-semibold" href={`mailto:${site.email}`}>
                  {site.email}
                </a>{" "}
                instead.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
