"use client";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { useSlidingPill } from "./useSlidingPill";

/**
 * Compact index of the four projects. It sticks just below the header on large screens
 * (and is an ordinary row on small ones), highlights the project in view, and links straight to each.
 */
export function WorkIndex() {
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  useSlidingPill(list, active);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-project]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.project ?? null);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Project index" className="work-index">
      <div className="wrap flex h-12 items-center overflow-x-auto">
        <div ref={list} className="nav-list">
          <span className="pill" aria-hidden="true" />
          {projects.map((p, i) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              data-key={p.slug}
              aria-current={active === p.slug ? "true" : undefined}
              className="nav-item !min-h-10 whitespace-nowrap !px-3 text-[0.92rem]"
            >
              <span className="num mr-2">{String(i + 1).padStart(2, "0")}</span>
              {p.name.split(" ")[0]}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
