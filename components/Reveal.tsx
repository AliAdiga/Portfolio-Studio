import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Marks content for the scroll reveal (see RevealScript). Server component.
 * `delay` is a stagger offset in ms; the stylesheet caps the total at 180ms so nothing waits long.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  id,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} data-reveal="" suppressHydrationWarning className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
