"use client";
import { useEffect, type RefObject } from "react";

/**
 * Positions a shared "pressed" marker behind the active item of a list.
 * Items carry data-key; the marker is the container's .pill child. Values are written to
 * CSS variables directly (no React state), so hovering other items never disturbs it.
 */
export function useSlidingPill(container: RefObject<HTMLElement | null>, activeKey: string | null) {
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const place = () => {
      const el = activeKey ? root.querySelector<HTMLElement>(`[data-key="${activeKey}"]`) : null;
      if (!el) {
        root.style.setProperty("--pill-o", "0");
        return;
      }
      root.style.setProperty("--pill-x", `${el.offsetLeft}px`);
      root.style.setProperty("--pill-w", `${el.offsetWidth}px`);
      root.style.setProperty("--pill-o", "1");
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
  }, [container, activeKey]);
}
