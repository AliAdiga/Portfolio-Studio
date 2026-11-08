import type { CSSProperties, ElementType, ReactNode } from "react";

/** Server component: marks content for the scroll reveal observer. `wipe` unveils it with a clip-path instead of a fade. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  wipe = false,
  className = "",
  children,
}: {
  as?: ElementType;
  delay?: number;
  wipe?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-reveal
      data-wipe={wipe ? "" : undefined}
      className={className}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
