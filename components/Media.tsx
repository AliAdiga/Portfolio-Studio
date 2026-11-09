import Image from "next/image";
import type { Crop } from "@/content/extras";

/** A cropped region of a real capture, with a reserved aspect ratio so nothing shifts as it loads. */
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
    <div className={`relative overflow-hidden rounded-[10px] border border-line bg-sand ${className}`} style={{ aspectRatio: aspect }}>
      <Image src={crop.src} alt={crop.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: crop.pos }} />
    </div>
  );
}
