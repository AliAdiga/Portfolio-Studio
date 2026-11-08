/**
 * A soft paper-wave edge between two sections of different tone.
 * `from` is the colour of the section above, `to` the section below, both as
 * CSS colour values so they follow the active theme.
 */
export function Divider({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <svg
      className="divider"
      style={{ background: from, transform: flip ? "scaleY(-1)" : undefined }}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 44 C 220 92 470 6 740 34 C 1000 62 1220 12 1440 46 L1440 80 L0 80 Z" fill={to} />
    </svg>
  );
}
