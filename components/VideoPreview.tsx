"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

type Video = NonNullable<Project["video"]>;

/** Shared playback logic: plays only while visible, honours reduced motion and the user's own pause. */
function usePreviewVideo() {
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
  return { ref, playing, setPlaying, toggle };
}

/**
 * Authentic screen recording of the real project, inside a browser frame.
 * Always has a visible Pause/Play control and does not autoplay at all for
 * visitors who prefer reduced motion.
 */
export function VideoPreview({
  video,
  url,
  href,
  vtName,
}: {
  video: Video;
  url: string;
  href?: string;
  vtName?: string;
}) {
  const { ref, playing, setPlaying, toggle } = usePreviewVideo();
  return (
    <div className="browser relative" style={vtName ? ({ viewTransitionName: vtName } as CSSProperties) : undefined}>
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
      {href && <a href={href} tabIndex={-1} aria-hidden="true" data-cursor="View" className="absolute inset-0 z-10" />}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="absolute bottom-3 right-3 z-20 min-h-11 rounded-full bg-paper px-4 text-[0.88rem] font-semibold text-ink shadow-sm hover:bg-white"
      >
        {playing ? "Pause preview" : "Play preview"}
      </button>
    </div>
  );
}

/** Phone-shaped version for mobile app recordings. */
export function PhoneVideo({ video, className = "" }: { video: Video; className?: string }) {
  const { ref, playing, setPlaying, toggle } = usePreviewVideo();
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
        className="absolute bottom-4 left-1/2 min-h-11 -translate-x-1/2 rounded-full bg-paper px-4 text-[0.85rem] font-semibold text-ink shadow-sm hover:bg-white"
      >
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> app preview</span>
      </button>
    </div>
  );
}
