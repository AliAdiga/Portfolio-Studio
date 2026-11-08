"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds .is-in to [data-reveal] and [data-mask] elements as they enter the
 * viewport. Purpose: sequence content as the visitor reaches it, without
 * touching native scrolling. Elements are visible by default if JavaScript
 * fails.
 *
 * Elements that start fully clipped (mask and wipe reveals) report zero
 * visible area, so the observer watches their parent and flips the class on
 * the clipped child instead.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in), [data-mask]:not(.is-in)"),
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const watched = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          watched.get(entry.target)?.forEach((t) => t.classList.add("is-in"));
          watched.delete(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const el of els) {
      const clipped = el.hasAttribute("data-mask") || el.hasAttribute("data-wipe");
      const target = clipped && el.parentElement ? el.parentElement : el;
      const list = watched.get(target) ?? [];
      list.push(el);
      watched.set(target, list);
    }
    watched.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
