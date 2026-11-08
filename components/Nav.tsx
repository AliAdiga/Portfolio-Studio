"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { useSlidingPill } from "./useSlidingPill";

const key = (href: string) => href.replace("/#", "");

export function Nav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const pathname = usePathname();

  // On a case study, Work stays associated with the current location.
  const active = pathname.startsWith("/work/") ? "work" : pathname === "/" ? section : null;
  useSlidingPill(list, active);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      setOpen(false);
      trigger.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  // Home page: the section nearest the middle of the viewport is "current".
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSection((e.target as HTMLElement).dataset.nav ?? null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  const openMenu = () => {
    dialog.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialog.current?.close();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory" style={{ height: "var(--nav-h)" }}>
      <div className="wrap flex h-full items-center justify-between gap-4">
        <Wordmark />
        <nav aria-label="Primary" className="hidden md:block">
          <div ref={list} className="nav-list">
            <span className="pill" aria-hidden="true" />
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                data-key={key(n.href)}
                className="nav-item"
                aria-current={active === key(n.href) ? "true" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/#contact" className="btn btn-primary hidden !min-h-11 !px-5 md:inline-flex">
            Discuss a project
          </Link>
          <button
            ref={trigger}
            type="button"
            className="btn btn-secondary !min-h-11 !px-4 md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={openMenu}
          >
            Menu
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-label="Site menu"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-ivory p-0 text-charcoal backdrop:bg-black/40 md:hidden"
        onClick={(e) => e.target === dialog.current && closeMenu()}
      >
        <div className="wrap flex h-full flex-col py-5">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={closeMenu}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={closeMenu}
                aria-current={active === key(n.href) ? "true" : undefined}
                className="display border-b border-line py-5 text-4xl"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/#contact" onClick={closeMenu} className="btn btn-primary mt-auto w-full">
            Discuss a project <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </dialog>
    </header>
  );
}
