import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/content/projects";
import { BrowserFrame, PhoneFrame } from "@/components/Frames";
import { VideoPreview } from "@/components/VideoPreview";
import { Reveal } from "@/components/Reveal";
import { Float } from "@/components/Float";

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
  const next = nextProject(p.slug);

  return (
    <article className="page-in">
      <header className="wrap pb-12 pt-14 md:pt-20">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] text-ink-soft">
          <Link href="/#work" className="text-link">
            Work
          </Link>{" "}
          / <span aria-current="page">{p.name}</span>
        </nav>
        <h1 className="display mt-6 text-[clamp(3rem,8vw,7.5rem)]">{p.name}</h1>
        <p className="mt-2 text-[1.05rem] font-semibold text-plum">{p.category}</p>
        <p className="measure mt-8 text-[1.2rem] leading-[1.55]">{p.intro}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={p.liveUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            Visit website <span className="arrow" aria-hidden="true">&rarr;</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link href="/#contact" className="btn btn-ghost">
            Discuss a project
          </Link>
        </div>
      </header>

      <section className="wrap pb-20" aria-label={`${p.name} preview`}>
        <Reveal>
          {p.video ? (
            <VideoPreview video={p.video} url={p.liveUrl} />
          ) : (
            <BrowserFrame shot={p.desktop[0]} url={p.liveUrl} priority sizes="(min-width: 1320px) 1320px, 100vw" />
          )}
          <p className="mt-3 text-[0.92rem] text-ink-soft">
            {p.video ? "Screen recording of the real project." : p.desktop[0].caption}
          </p>
        </Reveal>
      </section>

      <section className="bg-sand py-20" aria-label="Project facts">
        <dl className="wrap grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-semibold">Status</dt>
            <dd className="mt-2 text-[0.98rem]">
              <strong className="font-semibold">{p.status.label}.</strong>{" "}
              <span className="text-ink-soft">{p.status.note}</span>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">My role</dt>
            <dd className="mt-2 text-[0.98rem] text-ink-soft">
              <ul className="space-y-1">
                {p.role.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Intended audience</dt>
            <dd className="mt-2 text-[0.98rem] text-ink-soft">{p.audience}</dd>
          </div>
          <div>
            <dt className="font-semibold">Built with</dt>
            <dd className="mt-2 text-[0.98rem] text-ink-soft">{p.stack}</dd>
          </div>
        </dl>
      </section>

      <section className="wrap grid gap-14 py-24 lg:grid-cols-12" aria-labelledby="goals-h">
        <Reveal className="lg:col-span-4">
          <h2 id="goals-h" className="display text-[clamp(2rem,3.6vw,3rem)]">
            Design <em>goals</em>
          </h2>
          <p className="mt-4 text-[0.95rem] text-ink-soft">
            These are the intentions behind the design. No results or performance figures are claimed.
          </p>
        </Reveal>
        <Reveal as="ul" delay={100} className="space-y-6 text-[1.1rem] lg:col-span-7 lg:col-start-6">
          {p.goals.map((g) => (
            <li key={g} className="border-t border-line pt-5">
              {g}
            </li>
          ))}
        </Reveal>
      </section>

      <section className="bg-plum-deep on-dark py-24 text-ivory" aria-labelledby="decisions-h">
        <div className="wrap">
          <Reveal>
            <h2 id="decisions-h" className="display text-[clamp(2rem,3.6vw,3rem)]">
              Key design <em>decisions</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {p.decisions.map((d, i) => (
              <Reveal key={d.title} delay={i * 90} className="border-t border-ivory/35 pt-6">
                <h3 className="display text-[1.5rem] leading-[1.15]">{d.title}</h3>
                <p className="mt-4 text-[0.98rem] text-ivory/85">{d.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-24" aria-labelledby="interactions-h">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="interactions-h" className="display text-[clamp(2rem,3.6vw,3rem)]">
              Implemented <em>interactions</em>
            </h2>
            <p className="mt-4 text-[0.95rem] text-ink-soft">What the live project actually does today.</p>
          </Reveal>
          <Reveal as="ul" delay={100} className="space-y-4 text-[1.05rem] lg:col-span-7 lg:col-start-6">
            {p.interactions.map((x) => (
              <li key={x} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-plum" />
                {x}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-24" aria-labelledby="screens-h">
        <div className="wrap">
          <Reveal>
            <h2 id="screens-h" className="display text-[clamp(2rem,3.6vw,3rem)]">
              On desktop and <em>mobile</em>
            </h2>
            {p.imageNote && <p className="mt-4 max-w-2xl text-[0.95rem] text-ink-soft">{p.imageNote}</p>}
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {p.desktop.map((s, i) => (
              <Reveal key={s.src} delay={i * 80}>
                <figure>
                  <BrowserFrame shot={s} url={p.liveUrl} sizes="(min-width: 768px) 46vw, 100vw" />
                  <figcaption className="mt-3 text-[0.92rem] text-ink-soft">{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:gap-10 md:grid-cols-3">
            {p.mobile.map((s, i) => (
              <Reveal key={s.src} delay={i * 90}>
                <Float distance={i % 2 ? -18 : 18}>
                  <figure>
                    <PhoneFrame shot={s} sizes="(min-width: 768px) 26vw, 44vw" />
                    <figcaption className="mt-3 text-[0.92rem] text-ink-soft">{s.caption}</figcaption>
                  </figure>
                </Float>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap grid gap-14 py-24 lg:grid-cols-12" aria-labelledby="impl-h">
        <Reveal className="lg:col-span-4">
          <h2 id="impl-h" className="display text-[clamp(2rem,3.6vw,3rem)]">
            Under the <em>surface</em>
          </h2>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-7 lg:col-start-6">
          <ul className="space-y-4 text-[1.02rem]">
            {p.implementation.map((x) => (
              <li key={x} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-plum" />
                {x}
              </li>
            ))}
          </ul>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="Project colours">
            {p.palette.map((c) => (
              <li key={c.hex} className="flex items-center gap-2 text-[0.92rem]">
                <span className="inline-block h-5 w-5 rounded-full border border-charcoal/30" style={{ background: c.hex }} aria-hidden="true" />
                {c.name} {c.hex}
              </li>
            ))}
          </ul>
          <a href={p.liveUrl} className="btn btn-ghost mt-10" target="_blank" rel="noopener noreferrer">
            Visit the live site <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Reveal>
      </section>

      <section className="on-dark bg-charcoal py-24 text-ivory" aria-label="Next project">
        <div className="wrap flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="text-[0.95rem] text-ivory/75">Next project</p>
            <Link href={`/work/${next.slug}`} className="display mt-3 block text-[clamp(2.4rem,6vw,5.4rem)] hover:text-[#e9bccb]">
              {next.name} <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="mt-2 text-ivory/75">{next.category}</p>
          </div>
          <Link href="/#contact" className="btn btn-light">
            Discuss a project
          </Link>
        </div>
      </section>
    </article>
  );
}
