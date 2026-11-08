"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

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

  const openMenu = () => {
    dialog.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialog.current?.close();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory" style={{ height: "var(--nav-h)" }}>
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-link text-[0.97rem] font-medium">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/#contact" className="btn btn-primary hidden min-h-11 py-2 md:inline-flex">
            Discuss a project
          </Link>
          <button
            ref={trigger}
            type="button"
            className="btn btn-ghost min-h-11 px-4 py-2 md:hidden"
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
            <button type="button" className="btn btn-ghost min-h-11 px-4 py-2" onClick={closeMenu}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex flex-col">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={closeMenu} className="display border-b border-line py-5 text-4xl">
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/#contact" onClick={closeMenu} className="btn btn-plum mt-auto w-full">
            Discuss a project
          </Link>
        </div>
      </dialog>
    </header>
  );
}
