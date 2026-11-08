"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/content/projects";
import type { Crop } from "@/content/extras";

type Video = NonNullable<Project["video"]>;

/**
 * Shared playback rules for every preview recording:
 * nothing is downloaded until the video is near the viewport, it plays only while visible,
 * it never autoplays for visitors who prefer reduced motion, and the visitor's own pause wins.
 */
export function useVisibleVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (userPaused.current) return;
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      v.pause();
    }
  };
  return { ref, playing, setPlaying, toggle };
}

export function PlayButton({ playing, toggle, label = "preview" }: { playing: boolean; toggle: () => void; label?: string }) {
  return (
    <button type="button" onClick={toggle} aria-pressed={playing} className="play-btn">
      {playing ? "Pause" : "Play"}
      <span className="sr-only"> {label}</span>
    </button>
  );
}

/**
 * The dominant visual of a project: a recording when one exists, otherwise the real screenshot.
 * One frame, no fake address bar. It carries the shared-element transition name used by the case study.
 */
export function StageMedia({
  project,
  href,
  vtName,
  sizes = "(min-width: 1024px) 56vw, 100vw",
  priority = false,
}: {
  project: Project;
  href?: string;
  vtName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const v = project.video && project.video.kind !== "phone" ? project.video : undefined;
  const shot = project.desktop[0];
  const w = v ? v.w : shot.w;
  const h = v ? v.h : shot.h;
  const { ref, playing, setPlaying, toggle } = useVisibleVideo();
  const style = { aspectRatio: `${w} / ${h}`, ...(vtName ? { viewTransitionName: vtName } : {}) } as CSSProperties;
  return (
    <div className="frame" style={style}>
      {v ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          width={v.w}
          height={v.h}
          poster={v.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={v.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={v.src} type="video/mp4" />
        </video>
      ) : (
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      )}
      {href && <a href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />}
      {v && <PlayButton playing={playing} toggle={toggle} label="project preview" />}
    </div>
  );
}

/** Phone-shaped recording of a mobile app. */
export function PhoneVideo({ video, className = "" }: { video: Video; className?: string }) {
  const { ref, playing, setPlaying, toggle } = useVisibleVideo();
  return (
    <div className={`phone relative ${className}`}>
      <video
        ref={ref}
        width={video.w}
        height={video.h}
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
      <PlayButton playing={playing} toggle={toggle} label="app preview" />
    </div>
  );
}

/** A cropped region of a real capture, with explicit dimensions so nothing shifts as it loads. */
export function CropImage({
  crop,
  aspect = "4 / 3",
  sizes = "(min-width: 1024px) 22vw, 90vw",
  className = "",
}: {
  crop: Crop;
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[10px] border border-line ${className}`} style={{ aspectRatio: aspect }}>
      <Image src={crop.src} alt={crop.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: crop.pos }} />
    </div>
  );
}
