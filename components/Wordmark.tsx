import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-[0.28em] py-[0.8rem] font-serif text-[1.45rem] leading-none tracking-tight ${className}`}
      aria-label="Scroll & Serif, home"
    >
      <span>Scroll</span>
      <span className="amp italic">&amp;</span>
      <span>Serif</span>
    </Link>
  );
}

/** Compact S&S monogram for the footer. Decorative. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-14 w-14 items-center justify-center rounded-[14px] border border-current/40 font-serif text-[1.35rem] leading-none ${className}`}
    >
      S<span className="amp italic">&amp;</span>S
    </span>
  );
}
