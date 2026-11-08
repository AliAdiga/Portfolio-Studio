"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/content/projects";

/**
 * A deliberate stack, not a slider. DAR starts in front; the other three peek
 * from behind so their identities are visible at once. Choosing one brings it
 * forward. There is no autoplay, so nothing needs a pause control.
 * Depth: on devices with a fine pointer, frames drift slightly with the cursor.
 */
const slots = [
  { x: "0%", y: "0%", scale: 1, z: 4 },
  { x: "10%", y: "-10%", scale: 0.94, z: 3 },
  { x: "18%", y: "-19%", scale: 0.88, z: 2 },
  { x: "25%", y: "-28%", scale: 0.82, z: 1 },
];

function Frame({
  i,
  slot,
  focused,
  onPick,
  mx,
  my,
  reduce,
}: {
  i: number;
  slot: number;
  focused: boolean;
  onPick: () => void;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduce: boolean;
}) {
  const p = projects[i];
  const s = slots[slot];
  const depth = (4 - slot) * 5; // front frames move more
  const px = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const py = useTransform(my, [-0.5, 0.5], [-depth * 0.6, depth * 0.6]);
  const shot = p.desktop[0];
  return (
    <motion.div
      className="absolute bottom-0 left-0 w-[82%] sm:w-[84%]"
      initial={false}
      animate={{ x: s.x, y: s.y, scale: s.scale }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22 }}
      style={{ zIndex: s.z, transformOrigin: "0% 100%" }}
    >
      <motion.div style={reduce ? undefined : { x: px, y: py }} className="relative">
        <div className="browser">
          <div className="browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{p.liveUrl.replace(/^https?:\/\//, "")}</span>
          </div>
          <Image
            src={shot.src}
            alt={focused ? shot.alt : ""}
            width={shot.w}
            height={shot.h}
            sizes="(min-width: 1024px) 46vw, 90vw"
            priority={i === 0}
            className="block h-auto w-full"
          />
        </div>
        {!focused && (
          <button
            type="button"
            onClick={onPick}
            className="absolute inset-0 cursor-pointer rounded-[14px] bg-transparent"
            aria-label={`Bring ${p.name} to the front`}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function HeroStage() {
  const reduce = !!useReducedMotion();
  const [order, setOrder] = useState([0, 1, 2, 3]); // project indices, front first
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });

  const pick = (i: number) => setOrder((o) => [i, ...o.filter((x) => x !== i)]);
  const front = projects[order[0]];

  return (
    <div
      className="w-full"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: "1.12 / 1" }} role="group" aria-label="Featured projects">
        {projects.map((_, i) => (
          <Frame
            key={i}
            i={i}
            slot={order.indexOf(i)}
            focused={order[0] === i}
            onPick={() => pick(i)}
            mx={mx}
            my={my}
            reduce={reduce}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div aria-live="polite" className="min-w-0">
          <p className="display text-2xl leading-tight">{front.name}</p>
          <p className="text-[0.95rem] text-ink-soft">
            {front.category}. {front.status.label}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <ul className="flex gap-1.5" aria-label="Choose a project">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={order[0] === i}
                  className={`min-h-11 rounded-full border px-3.5 text-[0.88rem] font-semibold transition-colors ${
                    order[0] === i
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-charcoal/45 text-charcoal hover:border-charcoal"
                  }`}
                >
                  {p.name.split(" ")[0]}
                </button>
              </li>
            ))}
          </ul>
          <Link href={`/work/${front.slug}`} className="text-link text-[0.97rem] font-semibold">
            View case study
          </Link>
        </div>
      </div>
    </div>
  );
}
