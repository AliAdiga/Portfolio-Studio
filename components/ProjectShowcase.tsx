import type { Project } from "@/content/projects";
import { BrowserFrame, PhoneFrame } from "./Frames";
import { Float } from "./Float";
import { Reveal } from "./Reveal";
import { PhoneVideo, VideoPreview } from "./VideoPreview";

function Swatches({ project }: { project: Project }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={`${project.name} colours`}>
      {project.palette.map((c) => (
        <li key={c.hex} className="flex items-center gap-2 text-[0.9rem]">
          <span
            className="inline-block h-5 w-5 rounded-full border border-current/30"
            style={{ background: c.hex }}
            aria-hidden="true"
          />
          {c.name} <span className="opacity-75">{c.hex}</span>
        </li>
      ))}
    </ul>
  );
}

function Actions({ project, dark }: { project: Project; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Plain anchor on purpose: a full navigation lets the browser morph the preview into the case-study hero. */}
      <a href={`/work/${project.slug}`} className={`btn ${dark ? "btn-light" : "btn-primary"}`}>
        View case study <span className="arrow" aria-hidden="true">&rarr;</span>
      </a>
      <a href={project.liveUrl} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
        Visit website<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

function Copy({ project, dark }: { project: Project; dark?: boolean }) {
  const soft = dark ? "text-paper/85" : "text-ink-soft";
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className={`text-[1rem] font-semibold ${dark ? "text-paper/85" : "text-plum"}`}>{project.category}</p>
        <h3 data-mask className="display mt-2 text-[clamp(2.6rem,5.4vw,4.8rem)]">
          {project.name}
        </h3>
      </div>
      <p className={`measure text-[1.08rem] ${soft}`}>{project.summary}</p>
      <p>
        <span
          className={`inline-block rounded-full border px-3.5 py-1 text-[0.88rem] font-semibold ${
            dark ? "border-paper/50" : "border-charcoal/40"
          }`}
        >
          {project.status.label}
        </span>
      </p>
      <dl className="grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="text-[0.92rem] font-semibold">My role</dt>
          <dd className={`mt-1.5 text-[0.98rem] ${soft}`}>{project.role.join(". ")}.</dd>
        </div>
        <div>
          <dt className="text-[0.92rem] font-semibold">{project.detail.title}</dt>
          <dd className={`mt-1.5 text-[0.98rem] ${soft}`}>{project.detail.body}</dd>
        </div>
      </dl>
      <Swatches project={project} />
      <Actions project={project} dark={dark} />
    </div>
  );
}

/** The main preview: a recording if one exists, otherwise a screenshot. Shares a transition name with the case-study hero. */
function MainPreview({ p }: { p: Project }) {
  const vt = `case-${p.slug}`;
  const href = `/work/${p.slug}`;
  if (p.video && p.video.kind !== "phone") return <VideoPreview video={p.video} url={p.liveUrl} href={href} vtName={vt} />;
  return <BrowserFrame shot={p.desktop[0]} url={p.liveUrl} href={href} vtName={vt} />;
}

/* DAR: split, text left, wide video stage right, phone overlapping. Sand ground. */
function Dar({ p }: { p: Project }) {
  return (
    <section id={p.slug} className="overflow-x-clip bg-sand py-24 md:py-32" aria-labelledby={`${p.slug}-h`}>
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div id={`${p.slug}-h`}>
            <Copy project={p} />
          </div>
        </Reveal>
        <div className="tilt relative lg:col-span-7">
          <Reveal delay={120} wipe>
            <Float distance={14}>
              <MainPreview p={p} />
            </Float>
          </Reveal>
          <Reveal delay={260} className="absolute -bottom-10 -left-4 hidden w-[22%] sm:block lg:-left-6">
            <Float distance={-36}>
              <PhoneFrame shot={p.mobile[1]} sizes="18vw" />
            </Float>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Aurelle: dark, media left (browser + overlapping phone), text right. */
function Aurelle({ p }: { p: Project }) {
  return (
    <section
      id={p.slug}
      className="on-dark overflow-x-clip bg-[var(--aur-bg)] py-24 text-paper md:py-32"
      aria-labelledby={`${p.slug}-h`}
    >
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <div className="tilt relative order-2 lg:order-1 lg:col-span-7">
          <Reveal wipe>
            <Float distance={14}>
              <MainPreview p={p} />
            </Float>
          </Reveal>
          <Reveal delay={200} className="absolute -bottom-12 right-[-2%] w-[26%] sm:w-[22%] lg:-right-12">
            <Float distance={-40}>
              <PhoneFrame shot={p.mobile[0]} sizes="18vw" />
            </Float>
          </Reveal>
          <Reveal delay={320} className="absolute -top-8 left-[-3%] hidden w-[34%] sm:block">
            <Float distance={30}>
              <BrowserFrame shot={p.desktop[1]} url={`${p.liveUrl.replace(/^https?:\/\//, "")}/women.html`} sizes="24vw" />
            </Float>
          </Reveal>
        </div>
        <Reveal className="order-1 lg:order-2 lg:col-span-5" delay={80}>
          <div id={`${p.slug}-h`}>
            <Copy project={p} dark />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Zaytoun: stacked. Title and summary, then a full-width device row, then three text columns. */
function Zaytoun({ p }: { p: Project }) {
  return (
    <section id={p.slug} className="overflow-x-clip bg-[var(--zay-bg)] py-24 md:py-32" aria-labelledby={`${p.slug}-h`}>
      <div className="wrap">
        <Reveal>
          <div id={`${p.slug}-h`} className="max-w-3xl">
            <p className="text-[1rem] font-semibold text-olive">{p.category}</p>
            <h3 data-mask className="display mt-2 text-[clamp(2.6rem,6.2vw,5.6rem)]">
              {p.name}
            </h3>
            <p className="measure mt-6 text-[1.08rem] text-ink-soft">{p.summary}</p>
          </div>
        </Reveal>

        <div className="tilt mt-14 grid items-end gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-8" wipe>
            <Float distance={12}>
              <MainPreview p={p} />
            </Float>
          </Reveal>
          <Reveal delay={150} className="md:col-span-2">
            <Float distance={-30}>
              {p.video?.kind === "phone" ? (
                <PhoneVideo video={p.video} />
              ) : (
                <PhoneFrame shot={p.mobile[1]} sizes="(min-width: 1024px) 17vw, 40vw" />
              )}
            </Float>
          </Reveal>
          <Reveal delay={280} className="md:col-span-2">
            <Float distance={26}>
              <PhoneFrame shot={p.mobile[2]} sizes="(min-width: 1024px) 17vw, 40vw" />
            </Float>
          </Reveal>
        </div>

        <Reveal className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          <div className="flex flex-col gap-5">
            <p>
              <span className="inline-block rounded-full border border-charcoal/40 px-3.5 py-1 text-[0.88rem] font-semibold">
                {p.status.label}
              </span>
            </p>
            <div>
              <h4 className="text-[0.92rem] font-semibold">My role</h4>
              <p className="mt-1.5 text-[0.98rem] text-ink-soft">{p.role.join(". ")}.</p>
            </div>
          </div>
          <div>
            <h4 className="text-[0.92rem] font-semibold">{p.detail.title}</h4>
            <p className="mt-1.5 text-[0.98rem] text-ink-soft">{p.detail.body}</p>
          </div>
          <div className="flex flex-col gap-6">
            <Swatches project={p} />
            <Actions project={p} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Caucasus Sweets: burgundy ground, text left, desktop plus a phone on the right. */
function Caucasus({ p }: { p: Project }) {
  return (
    <section
      id={p.slug}
      className="on-dark overflow-x-clip bg-[#6e1f2c] py-24 text-paper md:py-32"
      aria-labelledby={`${p.slug}-h`}
    >
      <div className="wrap grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div id={`${p.slug}-h`}>
            <Copy project={p} dark />
          </div>
        </Reveal>
        <div className="tilt relative lg:col-span-7">
          <Reveal delay={100} wipe>
            <Float distance={14}>
              <MainPreview p={p} />
            </Float>
          </Reveal>
          <Reveal delay={260} className="absolute -bottom-12 right-[-2%] w-[26%] sm:w-[22%] lg:-right-8">
            <Float distance={-30}>
              <PhoneFrame shot={p.mobile[1]} sizes="16vw" />
            </Float>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ProjectShowcase({ project }: { project: Project }) {
  switch (project.slug) {
    case "dar":
      return <Dar p={project} />;
    case "aurelle":
      return <Aurelle p={project} />;
    case "zaytoun":
      return <Zaytoun p={project} />;
    default:
      return <Caucasus p={project} />;
  }
}
