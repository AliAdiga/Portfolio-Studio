"use client";
import { useEffect, useRef } from "react";

/**
 * A small label that follows the pointer over elements marked data-cursor
 * ("View"). Desktop fine pointers only, never for reduced motion, and it is
 * purely a hint: every target is also a normal link. Position is written
 * straight to the element, so React never re-renders on pointer movement.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 18}px, 0)`;
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      if (t) {
        el.textContent = t.dataset.cursor ?? "";
        el.classList.add("is-on");
      } else {
        el.classList.remove("is-on");
      }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, []);
  return <div ref={ref} className="cursor-label" aria-hidden="true" />;
}
