import { services, processSteps as steps, site } from "@/content/site";
import { Reveal } from "./Reveal";

export function WorkIntro() {
  return (
    <section id="work" className="wrap pb-14 pt-24 md:pt-32" aria-labelledby="work-h">
      <Reveal>
        <h2 id="work-h" className="display max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)]">
          Selected <em>work</em>
        </h2>
        <p className="measure mt-5 text-[1.08rem] text-ink-soft">
          Four websites, each with its own visual language. All four are my own projects, and each is labelled
          below as an independent concept or a personal project.
        </p>
      </Reveal>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32" aria-labelledby="services-h">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="services-h" className="display text-[clamp(2.2rem,4.4vw,3.8rem)]">
              What you <em>receive</em>
            </h2>
            <p className="mt-5 text-ink-soft">Three kinds of project I take on, described by what lands in your hands.</p>
          </div>
        </Reveal>
        <div className="lg:col-span-8">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 60} className="grid gap-6 border-t border-line py-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <h3 className="display text-[1.9rem] leading-[1.1]">{s.title}</h3>
                <p className="measure mt-4 text-ink-soft">{s.body}</p>
              </div>
              <ul className="space-y-2.5 text-[0.98rem]">
                {s.receive.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-plum" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="bg-sand py-24 md:py-32" aria-labelledby="about-h">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <h2 id="about-h" className="display text-[clamp(2.2rem,4.6vw,4rem)]">
            Careful work, <em>explained</em> plainly.
          </h2>
          <div className="measure mt-8 space-y-5 text-[1.08rem]">
            <p>
              I&rsquo;m {site.owner}, a designer and developer based in Amman, Jordan, with a Software Engineering
              background.
            </p>
            <p className="text-ink-soft">
              By day I&rsquo;m a TAC Support Engineer at Estarta, working across Cisco collaboration and Webex
              technologies. That job taught me to listen closely to a problem, explain technical things in plain
              language, connect systems that were not built to meet, and test before saying something is done.
            </p>
            <p className="text-ink-soft">
              I bring the same habits to websites: a clear conversation first, careful integrations, and a final
              check on real devices.
            </p>
          </div>
        </Reveal>
        <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-[14px] border border-charcoal/25 p-8">
            <h3 className="display text-2xl">Two separate things</h3>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="font-semibold">Professional support work</dt>
                <dd className="mt-1 text-[0.98rem] text-ink-soft">
                  Technical support at Estarta. It is not part of Scroll &amp; Serif.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Scroll &amp; Serif</dt>
                <dd className="mt-1 text-[0.98rem] text-ink-soft">
                  My independent design and development practice. Every project on this site is my own work.
                  Cisco and Estarta did not commission, review or endorse any of it.
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="on-dark bg-plum-deep py-24 text-ivory md:py-32" aria-labelledby="process-h">
      <div className="wrap">
        <Reveal>
          <h2 id="process-h" className="display max-w-2xl text-[clamp(2.2rem,4.6vw,4rem)]">
            How a project <em>unfolds</em>
          </h2>
        </Reveal>
        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="border-t border-ivory/35 pt-6">
              <h3 className="display text-[1.65rem] leading-[1.15]">{s.title}</h3>
              <p className="mt-4 text-[0.98rem] text-ivory/85">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
