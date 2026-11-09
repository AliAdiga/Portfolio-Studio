"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Reveal = { init: () => void; jump: () => void };

/** After a client-side route change, hand the newly rendered page to the reveal controller. */
export function RevealRescan() {
  const pathname = usePathname();
  useEffect(() => {
    const r = (window as unknown as { __reveal?: Reveal }).__reveal;
    if (!r) return;
    r.init();
    requestAnimationFrame(() => r.jump());
  }, [pathname]);
  return null;
}
