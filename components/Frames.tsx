import Image from "next/image";
import type { Shot } from "@/content/projects";

export function BrowserFrame({
  shot,
  url,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className = "",
}: {
  shot: Shot;
  url: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`browser ${className}`}>
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
