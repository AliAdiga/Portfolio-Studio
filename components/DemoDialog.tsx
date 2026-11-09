"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { Project } from "@/content/projects";

/**
 * "Watch demo": opens the project's real screen recording in a modal.
 * The video element only exists while the dialog is open, so no recording is downloaded until a visitor asks
 * for it. Native controls are shown, it starts muted, and closing it stops and unloads the video.
 * Escape and the backdrop close it, and focus returns to the button that opened it.
 */
export function DemoDialog({ project, className = "btn btn-secondary !min-h-11", label = "Watch demo" }: { project: Project; className?: string; label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const video = project.video;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => setOpen(false);
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  if (!video) return null;
  const phone = video.kind === "phone";

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        {label}
        <span className="sr-only"> for {project.name}</span>
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-t`}
        className="m-auto w-[min(94vw,64rem)] max-w-none rounded-[14px] border border-line bg-ivory p-0 text-charcoal shadow-[0_40px_80px_-30px_rgb(0_0_0_/_0.6)] backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <h2 id={`${id}-t`} className="display text-[1.25rem]">
            {project.name}: demo
          </h2>
          <button type="button" className="btn btn-secondary !min-h-11 !px-4" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <div className="grid place-items-center bg-[#14100e] p-3 sm:p-5">
          {open && (
            <video
              key={video.src}
              className={phone ? "max-h-[70dvh] w-auto rounded-[14px]" : "h-auto w-full rounded-[10px]"}
              style={{ aspectRatio: `${video.w} / ${video.h}` }}
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={video.alt}
            />
          )}
        </div>
        <p className="px-5 py-3 text-[0.9rem] text-ink-soft">Screen recording of the real project. No sound.</p>
      </dialog>
    </>
  );
}
