import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-[0.28em] font-serif text-[1.45rem] leading-none tracking-tight ${className}`}
      aria-label="Scroll & Serif, home"
    >
      <span>Scroll</span>
      <span className="amp italic">&amp;</span>
      <span>Serif</span>
    </Link>
  );
}
