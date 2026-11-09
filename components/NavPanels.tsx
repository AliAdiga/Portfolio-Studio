import Image from "next/image";
import Link from "next/link";
import { additionalProjects } from "@/content/projects";
import { extras } from "@/content/extras";
import { serviceMenu } from "@/content/site";

type Props = { onNavigate: () => void };

/** Large DAR tile, a "More websites" tile with three small previews, a "Behind the work" tile and an invitation strip. */
export function WorkPanel({ onNavigate }: Props) {
  const dar = extras.dar.cover;
  const behind = extras.dar.capabilities[0]; // a real capture of the DAR room explorer
  return (
    <div className="grid gap-3 p-3 md:grid-cols-12">
      <Link href="/#work" onClick={onNavigate} className="menu-tile flex flex-col gap-4 md:col-span-7 md:row-span-2">
        <div className="cover" style={{ aspectRatio: `${dar.w} / ${dar.h}` }}>
          <Image src={dar.src} alt="" width={dar.w} height={dar.h} sizes="(min-width: 1024px) 480px, 90vw" loading="eager" className="cover-img" />
        </div>
        <div>
          <p className="display text-[1.6rem] leading-tight">Selected work</p>
          <p className="mt-1 text-[0.95rem] text-ink-soft">
            Four websites with full case studies, from interiors and perfume to food and sweets.
          </p>
        </div>
      </Link>

      <Link href="/#more" onClick={onNavigate} className="menu-tile md:col-span-5">
        <p className="display text-[1.3rem] leading-tight">More websites</p>
        <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">
          {additionalProjects.map((p) => (
            <div key={p.slug} className="relative overflow-hidden rounded-[8px] border border-line" style={{ aspectRatio: "3 / 2" }}>
              <Image src={p.cover.src} alt="" fill sizes="140px" loading="eager" className="object-cover" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.9rem] text-ink-soft">Vestra, Cedar Stone Legal and Evercare Hospital.</p>
      </Link>

      <Link href="/work/dar" onClick={onNavigate} className="menu-tile flex gap-4 md:col-span-5">
        <div className="relative w-[38%] shrink-0 overflow-hidden rounded-[8px] border border-line" style={{ aspectRatio: "4 / 3" }} aria-hidden="true">
          <Image src={behind.src} alt="" fill sizes="150px" loading="eager" className="object-cover" style={{ objectPosition: behind.pos }} />
        </div>
        <div>
          <p className="display text-[1.3rem] leading-tight">Behind the work</p>
          <p className="mt-2 text-[0.9rem] text-ink-soft">How the DAR interiors site was designed and built.</p>
        </div>
      </Link>

      <div className="menu-strip flex flex-wrap items-center justify-between gap-3 md:col-span-12">
        <p className="text-[0.95rem]">Have something in mind?</p>
        <Link href="/#contact" onClick={onNavigate} className="cs-link !min-h-10">
          <span className="label">Let&rsquo;s talk</span>
          <span className="ring" aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

/** Original, lightweight illustrations drawn with currentColor and the plum accent. Decorative. */
function Art({ kind }: { kind: (typeof serviceMenu)[number]["art"] }) {
  const common = { viewBox: "0 0 160 100", "aria-hidden": true, focusable: false, className: "h-full w-full" } as const;
  if (kind === "editorial")
    return (
      <svg {...common}>
        <rect x="14" y="10" width="132" height="80" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="26" y="22" width="62" height="9" rx="2" fill="currentColor" />
        <rect x="26" y="36" width="44" height="9" rx="2" fill="var(--c-plum)" />
        <rect x="26" y="54" width="62" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="26" y="62" width="56" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="26" y="70" width="40" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="98" y="22" width="36" height="52" rx="4" fill="var(--c-plum)" opacity="0.18" stroke="currentColor" strokeWidth="1.2" />
        <path d="M98 64 l12 -12 10 9 8 -8 6 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  if (kind === "plan")
    return (
      <svg {...common}>
        <path d="M20 18 H140 V84 H20 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M70 18 V50 H20 M70 66 V84 M70 50 H112 M112 50 V84" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M70 50 a14 14 0 0 1 -14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M34 70 C 52 58, 84 70, 96 60" fill="none" stroke="var(--c-plum)" strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx="98" cy="40" r="9" fill="var(--c-plum)" opacity="0.18" />
        <circle cx="98" cy="40" r="4" fill="var(--c-plum)" />
        <rect x="118" y="24" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  return (
    <svg {...common}>
      <g opacity="0.55">
        <rect x="14" y="16" width="86" height="64" rx="5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 3" />
        <rect x="24" y="28" width="30" height="5" rx="2" fill="currentColor" />
        <rect x="24" y="40" width="58" height="4" rx="2" fill="currentColor" />
        <rect x="24" y="50" width="50" height="4" rx="2" fill="currentColor" />
        <rect x="24" y="60" width="40" height="4" rx="2" fill="currentColor" />
      </g>
      <rect x="56" y="26" width="90" height="64" rx="5" fill="var(--c-ivory)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="66" y="36" width="46" height="8" rx="2" fill="var(--c-plum)" />
      <rect x="66" y="50" width="70" height="4" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="66" y="58" width="60" height="4" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="66" y="70" width="28" height="9" rx="3" fill="currentColor" />
    </svg>
  );
}

export function ServicesPanel({ onNavigate }: Props) {
  return (
    <div className="grid gap-3 p-3 md:grid-cols-3">
      {serviceMenu.map((s) => (
        <Link key={s.id} href={`/#${s.id}`} onClick={onNavigate} className="menu-tile flex flex-col gap-3">
          <div className="menu-art">
            <Art kind={s.art} />
          </div>
          <div>
            <p className="display text-[1.3rem] leading-tight">{s.title}</p>
            <p className="mt-1 text-[0.92rem] text-ink-soft">{s.line}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
