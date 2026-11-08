import { projects, type Project } from "@/content/projects";
import { extras, type Capability } from "@/content/extras";
import { CropImage, PhoneVideo, StageMedia } from "./Media";
import { Reveal } from "./Reveal";
import { WorkIndex } from "./WorkIndex";

/** Each project keeps its own identity, on a shared grid. */
const looks: Record<string, string> = {
  dar: "bg-sand",
  aurelle: "on-dark bg-[var(--aur-bg)] text-paper",
  zaytoun: "bg-[var(--zay-bg)]",
  "caucasus-sweets-home": "on-dark bg-[#6e1f2c] text-paper",
};

function CapabilityRow({ cap, p }: { cap: Capability; p: Project }) {
  const phone = cap.phoneVideo && p.video?.kind === "phone";
  return (
    <li className={`grid items-center gap-4 ${phone ? "grid-cols-[7.5rem_1fr]" : "grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"}`}>
      {phone && p.video ? <PhoneVideo video={p.video} /> : <CropImage crop={cap} />}
      <div>
        <p className="font-semibold">{cap.label}</p>
        <p className="mt-1 text-[0.95rem] opacity-80">{cap.value}</p>
      </div>
    </li>
  );
}

function ProjectSection({ p, i }: { p: Project; i: number }) {
  const x = extras[p.slug];
  return (
    <section
      id={p.slug}
      data-project={p.slug}
      className={`scroll-mt-28 ${looks[p.slug]}`}
      aria-labelledby={`${p.slug}-h`}
    >
      <div className="wrap py-20 md:py-28">
        <div className="mb-10 flex items-center gap-4">
          <span className="num">{String(i + 1).padStart(2, "0")}</span>
          <hr className="rule flex-1" />
          <span className="text-[0.95rem] opacity-85">{p.category}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="sticky-visual lg:col-span-7">
            <StageMedia project={p} href={`/work/${p.slug}`} vtName={`case-${p.slug}`} />
          </Reveal>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <h3 id={`${p.slug}-h`} className="display text-[clamp(2.6rem,5vw,4.4rem)]">
                {p.name}
              </h3>
              <p className="display mt-4 text-[clamp(1.35rem,2vw,1.7rem)] !leading-[1.2] !tracking-[-0.015em] opacity-90">
                {x.line}
              </p>
              <p className="mt-5">
                <span className="badge">{p.status.label}</span>
              </p>
            </Reveal>

            <Reveal delay={60}>
              <ul className="space-y-5 border-t border-current/20 pt-6" aria-label={`What ${p.name} lets a visitor do`}>
                {x.capabilities.map((c) => (
                  <CapabilityRow key={c.label} cap={c} p={p} />
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90} className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Plain anchor on purpose: a full navigation lets the browser carry the preview into the case study. */}
              <a href={`/work/${p.slug}`} className="cs-link">
                <span className="label">View case study</span>
                <span className="ring" aria-hidden="true">&rarr;</span>
              </a>
              <a href={p.liveUrl} className="btn btn-secondary !min-h-11" target="_blank" rel="noopener noreferrer">
                Visit website<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <div id="work" data-nav="work" className="scroll-mt-4">
      <div className="wrap pb-12 pt-20 md:pt-28">
        <Reveal>
          <h2 className="display max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)]">
            Selected <em>work</em>
          </h2>
          <p className="measure mt-4 text-[1.08rem] text-ink-soft">
            Four websites, each with its own visual language. All are my own projects.
          </p>
        </Reveal>
      </div>
      <WorkIndex />
      {projects.map((p, i) => (
        <ProjectSection key={p.slug} p={p} i={i} />
      ))}
    </div>
  );
}
