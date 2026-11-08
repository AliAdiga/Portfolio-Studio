"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Gentle scroll depth: layers (a phone over a browser frame) drift at slightly
 * different speeds, which separates them visually. Uses transform only, never
 * touches native scrolling, and is disabled for reduced-motion visitors.
 */
export function Float({
  children,
  distance = 28,
  className = "",
}: {
  children: React.ReactNode;
  /** Pixels of travel across the viewport pass. Negative moves the other way. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
