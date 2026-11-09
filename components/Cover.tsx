import Image from "next/image";
import type { CSSProperties } from "react";
import type { Extras } from "@/content/extras";

/**
 * A project's cinematic cover. The monitor and its surroundings are part of the photograph, so the image
 * is shown whole (3:2, never cropped or framed again). Pass priority only for the initial LCP image (it loads eagerly with high fetch priority). Hover can enlarge it by at most 2%, clipped to the
 * container, on precise pointers only (see .cover in globals.css).
 */
export function Cover({
  cover,
  sizes,
  priority = false,
  href,
  vtName,
  className = "",
}: {
  cover: Extras["cover"];
  sizes: string;
  priority?: boolean;
  /** Optional link overlay. The visible link text lives elsewhere, so this stays out of the tab order. */
  href?: string;
  /** Shared-element transition name, matched on the case-study page. */
  vtName?: string;
  className?: string;
}) {
  const style = { aspectRatio: `${cover.w} / ${cover.h}`, ...(vtName ? { viewTransitionName: vtName } : {}) } as CSSProperties;
  return (
    <div className={`cover ${className}`} style={style}>
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.w}
        height={cover.h}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="cover-img"
      />
      {href && <a href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />}
    </div>
  );
}
