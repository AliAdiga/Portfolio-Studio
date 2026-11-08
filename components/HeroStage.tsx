"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, type Project } from "@/content/projects";
import { extras } from "@/content/extras";
import { PlayButton, useVisibleVideo } from "./Media";

const poster = (p: Project) => (p.video && p.video.kind !== "phone" ? p.video.poster : p.desktop[0].src);
const num = (i: number) => String(i + 1).padStart(2, "0");

/** The recording for the active project, laid over its poster. Nothing loads until it is visible. */
function HeroVideo({ video }: { video: NonNullable<Project["video"]> }) {
  const { ref, playing, setPlaying, toggle } = useVisibleVideo();
  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={video.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <PlayButton playing={playing} toggle={toggle} label="project preview" />
    </>
  );
}

/**
 * One dominant project at a time, with only a hint of the next one behind it.
 * Choosing a project coordinates the visual, title, category, selector and the hero tint.
 * No autoplay carousel: the visitor chooses.
 */
export function HeroStage() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const p = projects[active];
  const next = projects[(active + 1) % projects.length];
  const dur = reduce ? 0 : 0.48;
  const ease = [0.3, 0.8, 0.3, 1] as const;

  // The hero's tint follows the selected project (a registered CSS property transitions it).
  useEffect(() => {
    root.current?.closest<HTMLElement>(".hero")?.style.setProperty("--hero-accent", extras[p.slug].accent);
  }, [p.slug]);

  return (
    <div ref={root} className="w-full">
      <div className="relative" style={{ aspectRatio: "16 / 10" }} role="group" aria-label="Featured project">
        <div className="stage-peek" aria-hidden="true">
          <Image src={poster(next)} alt="" fill sizes="40vw" className="object-cover" />
        </div>
        <div className="frame absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={p.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur, ease }}
            >
              <Image
                src={poster(p)}
                alt={p.desktop[0].alt}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
                style={{ objectPosition: p.slug === "zaytoun" ? "8% 50%" : "50% 50%" }}
              />
              {p.video && p.video.kind !== "phone" && <HeroVideo video={p.video} />}
              <a href={`/work/${p.slug}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div aria-live="polite" className="min-w-0">
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease }}
          >
            <p className="display text-[1.7rem] leading-tight">{p.name}</p>
            <p className="text-[0.95rem] text-ink-soft">
              {p.category} <span className="badge ml-1 align-middle">{p.status.label}</span>
            </p>
          </motion.div>
        </div>
        <a href={`/work/${p.slug}`} className="cs-link">
          <span className="label">View case study</span>
          <span className="ring" aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <ol className="mt-4 flex flex-wrap gap-x-1 border-t border-line" aria-label="Choose a project">
        {projects.map((proj, i) => (
          <li key={proj.slug} className="relative">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`flex min-h-11 items-baseline gap-2 px-3 pt-2 text-[0.95rem] font-semibold transition-colors duration-[180ms] ${
                active === i ? "text-charcoal" : "text-ink-soft hover:text-charcoal"
              }`}
            >
              <span className="num">{num(i)}</span>
              {proj.name.split(" ")[0]}
            </button>
            {active === i && (
              <motion.span
                layoutId="hero-tab"
                aria-hidden="true"
                className="absolute inset-x-3 -top-px h-[2px] bg-[var(--c-marker)]"
                transition={{ duration: dur, ease }}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
