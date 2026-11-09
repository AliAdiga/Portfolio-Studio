"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import { serviceMenu } from "@/content/site";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { useSlidingPill } from "./useSlidingPill";
import { ServicesPanel, WorkPanel } from "./NavPanels";

type MenuId = "work" | "services";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Floating header: brand, Work and Services disclosure menus, About, the day/night switch and a "Let's talk" action.
 *
 * Menus are disclosure buttons (aria-expanded, aria-controls) that reveal panels of ordinary links. Click, tap and
 * keyboard are primary. On precise pointers, hovering also opens a menu after a short intent delay, and moving
 * between trigger and panel is forgiving (a grace period before closing). Only one menu is open at a time.
 * Escape, an outside click, tabbing away, or navigating closes it; Escape returns focus to its trigger.
 * Closed panels use visibility:hidden, so their links are never keyboard-focusable.
 */
export function Nav() {
  const pathname = usePathname();
  const shell = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const timer = useRef<number | undefined>(undefined);
  const openedBy = useRef<"hover" | "click">("click");
  // The open menu is remembered with the path it was opened on, so navigating closes it with no effect needed.
  const [openState, setOpenState] = useState<{ id: MenuId; path: string } | null>(null);
  const open = openState && openState.path === pathname ? openState.id : null;
  const [seen, setSeen] = useState<Record<MenuId, boolean>>({ work: false, services: false }); // render panel content on first open
  const [section, setSection] = useState<string | null>(null);

  const active = pathname.startsWith("/work/") ? "work" : pathname === "/" ? section : null;
  useSlidingPill(list, active);

  const show = useCallback((id: MenuId | null, by: "hover" | "click" = "click") => {
    window.clearTimeout(timer.current);
    openedBy.current = by;
    setOpenState(id ? { id, path: window.location.pathname } : null);
    if (id) setSeen((s) => (s[id] ? s : { ...s, [id]: true }));
  }, []);
  const close = useCallback(() => show(null), [show]);
  // Render a menu's content (and start its images loading) as soon as someone shows interest, before it opens.
  const prepare = (id: MenuId) => setSeen((s) => (s[id] ? s : { ...s, [id]: true }));

  // Escape closes and restores focus; an outside press closes; tabbing out of the header closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const id = open;
      close();
      triggers.current[id]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // Home page: the section nearest the middle of the viewport is "current". More websites belongs to Work.
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const key = (e.target as HTMLElement).dataset.nav ?? null;
          setSection(key === "more" ? "work" : key);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  // Hover intent (precise pointers only). A click-opened menu is not closed by the pointer leaving.
  const hoverOpen = (id: MenuId) => {
    if (!finePointer()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => show(id, "hover"), 110);
  };
  const hoverStay = () => window.clearTimeout(timer.current);
  const hoverLeave = () => {
    if (!finePointer()) return;
    window.clearTimeout(timer.current);
    if (openedBy.current === "hover") timer.current = window.setTimeout(close, 240);
  };

  // Panels sit after the whole bar in the DOM, so Tab is routed by hand to keep the order natural:
  // trigger -> panel links -> the next nav item. Shift+Tab from the first link goes back to the trigger.
  const focusables = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter((el) => el.offsetParent !== null);
  const triggerKeyDown = (id: MenuId) => (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || e.shiftKey || open !== id) return;
    const first = focusables(document.getElementById(`menu-${id}`)!)[0];
    if (first) {
      e.preventDefault();
      first.focus();
    }
  };
  const panelKeyDown = (id: MenuId) => (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = focusables(e.currentTarget as HTMLElement);
    if (!items.length) return;
    if (e.shiftKey && document.activeElement === items[0]) {
      e.preventDefault();
      triggers.current[id]?.focus();
    } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
      e.preventDefault();
      close();
      const bar = Array.from(list.current?.querySelectorAll<HTMLElement>(".nav-item") ?? []);
      const at = bar.indexOf(triggers.current[id] as HTMLElement);
      (bar[at + 1] ?? triggers.current[id])?.focus();
    }
  };

  const trigger = (id: MenuId, label: string) => (
    <button
      type="button"
      ref={(el) => {
        triggers.current[id] = el;
      }}
      data-key={id}
      className="nav-item gap-1.5"
      aria-expanded={open === id}
      aria-controls={`menu-${id}`}
      aria-current={active === id ? "true" : undefined}
      onClick={() => show(open === id ? null : id, "click")}
      onFocus={() => prepare(id)}
      onKeyDown={triggerKeyDown(id)}
      onPointerEnter={() => {
        prepare(id);
        hoverOpen(id);
      }}
      onPointerLeave={hoverLeave}
    >
      {label}
      <CaretDown size={14} weight="bold" aria-hidden="true" className={`nav-caret ${open === id ? "is-open" : ""}`} />
    </button>
  );

  return (
    <header className="site-header">
      <div
        ref={shell}
        className="nav-shell"
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (open && next && !shell.current?.contains(next)) close();
        }}
      >
        <div className="nav-bar">
          <Wordmark />
          <nav aria-label="Primary" className="hidden md:block">
            <div ref={list} className="nav-list">
              <span className="pill" aria-hidden="true" />
              {trigger("work", "Work")}
              {trigger("services", "Services")}
              <Link
                href="/#about"
                data-key="about"
                className="nav-item"
                aria-current={active === "about" ? "true" : undefined}
              >
                About
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden min-[380px]:inline-flex">
              <ThemeToggle />
            </span>
            <Link href="/#contact" className="btn btn-primary hidden !min-h-11 !px-5 md:inline-flex">
              Let&rsquo;s talk <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
            <MobileMenu active={active} />
          </div>
        </div>

        {(["work", "services"] as const).map((id) => (
          <div
            key={id}
            id={`menu-${id}`}
            className="nav-panel"
            data-open={open === id}
            onPointerEnter={hoverStay}
            onPointerLeave={hoverLeave}
            onKeyDown={panelKeyDown(id)}
          >
            {seen[id] && (id === "work" ? <WorkPanel onNavigate={close} /> : <ServicesPanel onNavigate={close} />)}
          </div>
        ))}
      </div>
    </header>
  );
}

/** Small-screen menu: a dialog with expandable Work and Services groups, the theme switch and a contact action. */
function MobileMenu({ active }: { active: string | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [group, setGroup] = useState<MenuId | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      setIsOpen(false);
      setGroup(null);
      trigger.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const closeMenu = () => dialog.current?.close();
  const groupBtn = (id: MenuId, label: string) => (
    <button
      type="button"
      className="display flex w-full items-center justify-between border-b border-line py-4 text-left text-[2rem]"
      aria-expanded={group === id}
      aria-controls={`mobile-${id}`}
      onClick={() => setGroup(group === id ? null : id)}
    >
      {label}
      <CaretDown size={22} weight="bold" aria-hidden="true" className={`nav-caret ${group === id ? "is-open" : ""}`} />
    </button>
  );
  const sub = "block border-b border-line py-3 pl-3 text-[1.05rem]";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="btn btn-secondary !min-h-11 !px-4 md:hidden"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          dialog.current?.showModal();
          setIsOpen(true);
        }}
      >
        Menu
      </button>
      <dialog
        ref={dialog}
        aria-label="Site menu"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none overflow-y-auto bg-ivory p-0 text-charcoal backdrop:bg-black/40 md:hidden"
        onClick={(e) => e.target === dialog.current && closeMenu()}
      >
        <div className="wrap flex min-h-full flex-col py-5">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={closeMenu}>
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-8">
            {groupBtn("work", "Work")}
            <div id="mobile-work" hidden={group !== "work"}>
              <Link href="/#work" onClick={closeMenu} className={sub}>
                Selected work
              </Link>
              <Link href="/#more" onClick={closeMenu} className={sub}>
                More websites
              </Link>
              <Link href="/work/dar" onClick={closeMenu} className={sub}>
                Behind the work
              </Link>
            </div>
            {groupBtn("services", "Services")}
            <div id="mobile-services" hidden={group !== "services"}>
              {serviceMenu.map((s) => (
                <Link key={s.id} href={`/#${s.id}`} onClick={closeMenu} className={sub}>
                  {s.title}
                </Link>
              ))}
            </div>
            <Link
              href="/#about"
              onClick={closeMenu}
              aria-current={active === "about" ? "true" : undefined}
              className="display block border-b border-line py-4 text-[2rem]"
            >
              About
            </Link>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <ThemeToggle />
            <span className="text-[0.95rem] text-ink-soft">Dark mode</span>
          </div>
          <Link href="/#contact" onClick={closeMenu} className="btn btn-primary mt-auto w-full">
            Let&rsquo;s talk <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </dialog>
    </>
  );
}
