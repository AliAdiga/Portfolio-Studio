import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/content/projects";
import { extras } from "@/content/extras";
import { Cover } from "@/components/Cover";
import { CropImage } from "@/components/Media";
import { DemoDialog } from "@/components/DemoDialog";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} case study`,
    description: p.intro,
    openGraph: { title: `${p.name}: ${p.category}`, description: p.intro, type: "article" },
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const x = extras[p.slug];
  const next = nextProject(p.slug);
  const nx = extras[next.slug];
  const demoPoster = p.video ? p.video.poster : p.desktop[0].src;
  const demoAlt = p.video?.kind === "phone" ? p.mobile[1].alt : p.desktop[0].alt;

  return (
    <article>
      <header className="wrap pb-10 pt-12 md:pt-16">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] text-ink-soft">
          <Link href="/#work" className="text-link">
            Work
          </Link>{" "}
          / <span aria-current="page">{p.name}</span>
        </nav>
        <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
          <h1 className="display text-[clamp(3rem,8vw,7rem)]">{p.name}</h1>
          <span className="badge mb-3">{p.status.label}</span>
        </div>
        <p className="mt-1 text-[1.05rem] font-semibold text-plum">{p.category}</p>
        <p className="measure mt-6 text-[1.2rem] leading-[1.55]">{p.intro}</p>
        <p className="mt-3 max-w-xl text-[0.92rem] text-ink-soft">{p.status.note}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={p.liveUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Visit website <span className="arrow" aria-hidden="true">&rarr;</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/#contact" className="btn btn-secondary">
            Discuss a project
          </Link>
        </div>
      </header>

      {/* The cinematic cover sits right under the title. It carries the shared transition name from the home page. */}
      <section className="wrap pb-14" aria-label={`${p.name} cover`}>
        <Cover cover={x.cover} priority sizes="(min-width: 1320px) 1224px, 100vw" vtName={`case-${p.slug}`} />
      </section>

      <section className="border-y border-line bg-sand" aria-label="Project facts">
        <dl className="wrap grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[0.9rem] font-semibold text-ink-soft">Role</dt>
            <dd className="mt-2 space-y-0.5">
              {p.role.map((r) => (
                <p key={r}>{r}</p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[0.9rem] font-semibold text-ink-soft">Scope</dt>
            <dd className="mt-2">{x.scope}</dd>
          </div>
          <div>
            <dt className="text-[0.9rem] font-semibold text-ink-soft">Project type</dt>
            <dd className="mt-2">{p.status.label}</dd>
          </div>
          <div>
            <dt className="text-[0.9rem] font-semibold text-ink-soft">Technology</dt>
            <dd className="mt-2">{p.stack}</dd>
          </div>
        </dl>
      </section>

      {/* Real interface: actual screenshots, then the recorded interaction. */}
      <section className="wrap py-20 md:py-24" aria-labelledby="screens-h">
        <Reveal>
          <h2 id="screens-h" className="display text-[clamp(2rem,3.8vw,3.2rem)]">
            The real <em>interface</em>
          </h2>
          <p className="mt-3 text-[0.95rem] text-ink-soft">
            The cover above is a presentation image. These are actual captures of the project.
          </p>
        </Reveal>
        <div className="mt-10 grid items-start gap-10 md:grid-cols-12">
          <div className="grid gap-8 md:col-span-8">
            {p.desktop.map((s) => (
              <Reveal key={s.src}>
                <figure>
                  <div className="frame" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
                    <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-[0.92rem] text-ink-soft">{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-1">
            {p.mobile.map((s) => (
              <Reveal key={s.src}>
                <figure>
                  <div className="phone">
                    <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 768px) 22vw, 44vw" />
                  </div>
                  <figcaption className="mt-3 text-[0.92rem] text-ink-soft">{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-sand" aria-labelledby="interaction-h">
        <div className="wrap grid items-center gap-12 py-20 md:py-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 id="interaction-h" className="display text-[clamp(2rem,3.8vw,3.2rem)]">
              The <em>interaction</em>
            </h2>
            <ul className="mt-8 space-y-4 text-[1.02rem]">
              {p.interactions.map((i) => (
                <li key={i} className="flex gap-4">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-plum" />
                  {i}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60} className="lg:col-span-7">
            <div className="frame" style={{ aspectRatio: p.video?.kind === "phone" ? "16 / 10" : `${p.video?.w ?? 16} / ${p.video?.h ?? 10}` }}>
              <Image
                src={demoPoster}
                alt={demoAlt}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className={p.video?.kind === "phone" ? "object-cover object-top" : "object-cover"}
              />
              <div className="absolute inset-0 grid place-items-center bg-black/25">
                <DemoDialog project={p} className="btn btn-primary" label="Watch demo" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wrap py-20 md:py-24" aria-labelledby="decisions-h">
        <Reveal>
          <h2 id="decisions-h" className="display text-[clamp(2rem,3.8vw,3.2rem)]">
            Three design <em>decisions</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-12">
          {p.decisions.map((d, i) => (
            <Reveal key={d.title} delay={i * 60} className={i === 0 ? "md:col-span-6" : "md:col-span-3"}>
              <CropImage
                crop={x.decisionMedia[i]}
                aspect={i === 0 ? "4 / 3" : "3 / 4"}
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
              />
              <p className="num mt-5 text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-1 text-[1.5rem] leading-[1.15]">{d.title}</h3>
              <p className="mt-3 text-[0.98rem] text-ink-soft">{d.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="tech-h">
        <div className="wrap py-14">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2">
              <h2 id="tech-h" className="display text-[clamp(1.6rem,2.6vw,2.2rem)]">
                Technical <em>details</em>
              </h2>
              <span className="btn btn-secondary !min-h-11 !px-4">
                <span className="group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            <div className="mt-8 grid gap-12 md:grid-cols-3">
              <div>
                <h3 className="font-semibold">Audience and goals</h3>
                <p className="mt-3 text-ink-soft">{p.audience}</p>
                <ul className="mt-3 space-y-2 text-ink-soft">
                  {p.goals.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Implementation</h3>
                <ul className="mt-3 space-y-2 text-ink-soft">
                  {p.implementation.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Colour and imagery</h3>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label="Project colours">
                  {p.palette.map((c) => (
                    <li key={c.hex} className="flex items-center gap-2 text-[0.92rem]">
                      <span className="inline-block h-5 w-5 rounded-full border border-line" style={{ background: c.hex }} aria-hidden="true" />
                      {c.name} {c.hex}
                    </li>
                  ))}
                </ul>
                {p.imageNote && <p className="mt-4 text-ink-soft">{p.imageNote}</p>}
              </div>
            </div>
          </details>
        </div>
      </section>

      <section className="on-dark text-paper" style={{ background: next.tone }} aria-label="Next project">
        <div className="wrap grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[0.95rem] text-paper/80">Next project</p>
            <a href={`/work/${next.slug}`} className="display mt-3 block text-[clamp(2.6rem,6vw,5.4rem)]">
              {next.name} <span aria-hidden="true">&rarr;</span>
            </a>
            <p className="mt-2 text-paper/80">{next.category}</p>
          </div>
          <div className="lg:col-span-5">
            <Cover cover={nx.cover} sizes="(min-width: 1024px) 34vw, 100vw" href={`/work/${next.slug}`} />
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="wrap flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <p className="display max-w-2xl text-[clamp(1.8rem,3.4vw,2.8rem)]">
            Have something <em>similar</em> in mind?
          </p>
          <Link href="/#contact" className="btn btn-primary">
            Discuss a project <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
