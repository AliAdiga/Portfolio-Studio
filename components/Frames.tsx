import Image from "next/image";
import type { CSSProperties } from "react";
import type { Shot } from "@/content/projects";

export function BrowserFrame({
  shot,
  url,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className = "",
  vtName,
  href,
  cursor = "View",
}: {
  shot: Shot;
  url: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Shared-element transition name, matched on the case-study page. */
  vtName?: string;
  /** Optional link overlay; the real link text lives elsewhere, so this is hidden from assistive tech. */
  href?: string;
  cursor?: string;
}) {
  return (
    <div className={`browser relative ${className}`} style={vtName ? ({ viewTransitionName: vtName } as CSSProperties) : undefined}>
      <div className="browser-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{url.replace(/^https?:\/\//, "")}</span>
      </div>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.w}
        height={shot.h}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
      {href && <a href={href} tabIndex={-1} aria-hidden="true" data-cursor={cursor} className="absolute inset-0" />}
    </div>
  );
}

export function PhoneFrame({
  shot,
  sizes = "(min-width: 1024px) 18vw, 44vw",
  className = "",
  priority = false,
}: {
  shot: Shot;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`phone ${className}`}>
      <Image src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} sizes={sizes} priority={priority} />
    </div>
  );
}
