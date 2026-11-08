"use client";
import { useState } from "react";
import { projects } from "@/content/projects";

/**
 * The one marquee on the page: the four project names drifting slowly under the
 * hero. Hidden from assistive tech (the same names are real links elsewhere),
 * paused on hover, stopped for reduced motion, and has a visible Pause control.
 */
export function Marquee() {
  const [paused, setPaused] = useState(false);
  const row = (
    <>
      {projects.map((p) => (
        <span key={p.slug} className="flex items-baseline gap-5 pr-10 md:pr-16">
          <span className="display text-[clamp(2rem,4.2vw,3.6rem)] italic">{p.name}</span>
          <span className="text-[0.95rem] text-ink-soft">{p.category}</span>
          <span className="amp display text-[clamp(1.6rem,3vw,2.6rem)] italic">&amp;</span>
        </span>
      ))}
    </>
  );
  return (
    <section aria-label="Featured projects, scrolling" className="border-y border-line py-6">
      <div className="marquee relative overflow-hidden">
        <div className={`marquee-track ${paused ? "is-paused" : ""}`} aria-hidden="true">
          <div className="flex shrink-0">{row}</div>
          <div className="flex shrink-0">{row}</div>
        </div>
      </div>
      <div className="wrap mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="min-h-11 rounded-full px-4 text-[0.88rem] font-semibold text-ink-soft hover:text-charcoal"
        >
          {paused ? "Play marquee" : "Pause marquee"}
        </button>
      </div>
    </section>
  );
}
