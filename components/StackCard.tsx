"use client";
import { useEffect, useRef } from "react";

/**
 * Each project becomes a sticky "sheet" that the next one slides over.
 * Pure CSS position: sticky; scrolling stays native. A card taller than the
 * viewport must not hide its lower part, so it pins only when its bottom edge
 * reaches the bottom of the viewport. ResizeObserver supplies that offset.
 * Purpose: gives the work section the feel of turning through a portfolio.
 */
export function StackCard({ children, z }: { children: React.ReactNode; z: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const nav = 68;
      const top = Math.min(nav, window.innerHeight - el.offsetHeight);
      el.style.setProperty("--stack-top", `${top}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div ref={ref} className="stack-card" style={{ "--z": z } as React.CSSProperties}>
      {children}
    </div>
  );
}
