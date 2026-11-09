"use client";
import Image from "next/image";
import { useId, useRef } from "react";
import type { AdditionalProject } from "@/content/projects";

/**
 * "More views": a lightweight dialog with the genuine captures for a compact project card.
 * Images are plain lazy <img>s inside a closed dialog, so nothing loads until it is opened.
 * Native <dialog>: Escape and the backdrop close it, focus is trapped while open and returns to the button.
 */
export function PreviewDialog({ project }: { project: AdditionalProject }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const shots = [project.cover, project.detail];

  return (
    <>
      <button
        type="button"
        className="text-link tap font-semibold"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        More views<span className="sr-only"> of {project.name}</span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-t`}
        className="m-auto max-h-[92dvh] w-[min(94vw,62rem)] max-w-none overflow-y-auto rounded-[14px] border border-line bg-ivory p-0 text-charcoal shadow-[0_40px_80px_-30px_rgb(0_0_0_/_0.6)] backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-ivory px-5 py-3">
          <h2 id={`${id}-t`} className="display text-[1.25rem]">
            {project.name}: captures
          </h2>
          <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <div className="grid gap-6 p-5">
          {shots.map((s) => (
            <figure key={s.src}>
              <div className="frame" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
                <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1024px) 900px, 90vw" loading="lazy" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[0.92rem] text-ink-soft">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </dialog>
    </>
  );
}
