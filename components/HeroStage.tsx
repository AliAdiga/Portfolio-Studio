"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { projects } from "@/content/projects";
import { extras } from "@/content/extras";

const num = (i: number) => String(i + 1).padStart(2, "0");
const FADE_MS = 400;

/**
 * Typographic opening. "Scroll" and "& Serif" frame a central project cover. On first entry a narrow window in the
 * middle opens onto the full 3:2 photograph while the two words slide outward (see the hero-open keyframes and the
 * intro script). The photograph is always laid out at its final size and only revealed with a clip-path, so it is
 * never stretched or squashed. Without the intro (return visits, reduced motion, small screens use a simpler version,
 * or if scripting fails) the final composition is simply shown.
 *
 * Choosing a project crossfades the cover in the same fixed container: the incoming image is decoded first, the
 * outgoing one stays fully visible until then, and the opening never replays. Nothing cycles by itself.
 */
export function HeroStage() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const request = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const p = projects[active];

  // The hero's tint follows the selected project (a registered CSS property transitions it).
  useEffect(() => {
    root.current?.closest<HTMLElement>(".hero")?.style.setProperty("--hero-accent", extras[p.slug].accent);
  }, [p.slug]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function choose(i: number) {
    const id = ++request.current;
    if (i === active) {
      setPending(null);
      return;
    }
    setPending(i);
    const img = imgs.current[i];
    try {
      if (img && !(img.complete && img.naturalWidth > 0)) await img.decode();
    } catch {
      /* a failed decode still lets the browser paint whatever it has */
    }
    if (request.current !== id) return; // a newer choice replaced this one
    window.clearTimeout(timer.current);
    setPrev(active);
    setActive(i);
    setPending(null);
    timer.current = window.setTimeout(() => setPrev(null), reduce ? 0 : FADE_MS + 50);
  }

  return (
    <div ref={root}>
      <div className="hero-stage">
        <p className="hero-word hero-word-l" aria-hidden="true">
          Scroll
        </p>
        <div className="hero-mask">
          <div className="cover" style={{ aspectRatio: "3 / 2" }} role="group" aria-label="Featured project cover">
            {projects.map((proj, i) => {
              const c = extras[proj.slug].cover;
              const state = i === active ? "on" : i === prev ? "prev" : "off";
              return (
                <Image
                  key={proj.slug}
                  id={i === 0 ? "hero-first" : undefined}
                  ref={(el) => {
                    imgs.current[i] = el;
                  }}
                  src={c.src}
                  alt={i === active ? c.alt : ""}
                  aria-hidden={i === active ? undefined : true}
                  width={c.w}
                  height={c.h}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading="eager"
                  data-state={state}
                  className="cover-layer"
                />
              );
            })}
            <a href={`/work/${p.slug}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />
          </div>
        </div>
        <p className="hero-word hero-word-r" aria-hidden="true">
          <span className="amp italic">&amp;</span> Serif
        </p>
      </div>

      <div className="wrap hero-copy grid items-start gap-8 pb-10 pt-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 id="hero-h" className="display text-[clamp(2.2rem,4vw,3.6rem)]">
            Distinctive websites. <em>Thoughtfully</em> built.
          </h1>
          <p className="lede mt-4">Independent design and development by Ali Tsai, based in Amman.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#work" className="btn btn-primary">
              Explore the work <span className="arrow" aria-hidden="true">&darr;</span>
            </Link>
            <Link href="#contact" className="btn btn-secondary">
              Discuss a project
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex min-h-[4.2rem] flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div aria-live="polite" aria-busy={pending !== null} className="min-w-0">
              <div key={p.slug} className="fade-text">
                <p className="display text-[1.5rem] leading-tight">{p.name}</p>
                <p className="text-[0.95rem] text-ink-soft">
                  {p.category} <span className="badge ml-1 align-middle">{p.status.label}</span>
                </p>
              </div>
            </div>
            <a href={`/work/${p.slug}`} className="cs-link">
              <span className="label">View case study</span>
              <span className="ring" aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <LayoutGroup id="hero-selector">
            <ol className="mt-2 flex flex-wrap gap-x-1 border-t border-line" aria-label="Choose a project">
              {projects.map((proj, i) => {
                const selected = (pending ?? active) === i;
                return (
                  <li key={proj.slug} className="relative">
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      aria-pressed={active === i}
                      className={`flex min-h-11 items-baseline gap-2 px-3 pt-2 text-[0.95rem] font-semibold transition-colors duration-[180ms] ${
                        selected ? "text-charcoal" : "text-ink-soft hover:text-charcoal"
                      }`}
                    >
                      <span className="num">{num(i)}</span>
                      {proj.name.split(" ")[0]}
                    </button>
                    {selected && (
                      <motion.span
                        layoutId="hero-tab"
                        aria-hidden="true"
                        className="absolute inset-x-3 -top-px h-[2px] bg-[var(--c-marker)]"
                        transition={{ duration: reduce ? 0 : 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}
