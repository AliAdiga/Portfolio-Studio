"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";

/**
 * Authentic screen recording of the real project, inside a browser frame.
 * Plays only while visible, always has a visible Pause/Play control, and does
 * not autoplay at all for visitors who prefer reduced motion.
 */
export function VideoPreview({ video, url }: { video: NonNullable<Project["video"]>; url: string }) {
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
      { threshold: 0.35 },
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

  return (
    <div className="browser relative">
      <div className="browser-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{url.replace(/^https?:\/\//, "")}</span>
      </div>
      <video
        ref={ref}
        className="block h-auto w-full"
        width={video.w}
        height={video.h}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={video.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="absolute bottom-3 right-3 min-h-11 rounded-full bg-ivory px-4 text-[0.88rem] font-semibold text-charcoal shadow-sm hover:bg-white"
      >
        {playing ? "Pause preview" : "Play preview"}
      </button>
    </div>
  );
}
