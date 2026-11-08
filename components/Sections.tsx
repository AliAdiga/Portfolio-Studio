import Image from "next/image";
import { services, strengths, processSteps as steps, site } from "@/content/site";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="services" data-nav="services" className="border-t border-line bg-ivory" aria-labelledby="services-h">
      <div className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 id="services-h" className="display text-[clamp(2.2rem,4.4vw,3.8rem)]">
              What you <em>receive</em>
            </h2>
            <p className="mt-5 max-w-xs text-ink-soft">Three kinds of project, described by what lands in your hands.</p>
          </div>
        </Reveal>
        <div className="lg:col-span-8">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 50} className="grid gap-8 border-t border-line py-9 first:border-t-0 first:pt-0 md:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="num text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-1 text-[1.8rem] leading-[1.1]">{s.title}</h3>
                <p className="measure mt-3 text-ink-soft">{s.body}</p>
                <ul className="mt-5 space-y-2 text-[0.96rem]">
                  {s.receive.map((r) => (
                    <li key={r} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-plum" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <figure>
                <div className="frame" style={{ aspectRatio: "4 / 3" }}>
                  <Image
                    src={s.crop.src}
                    alt={s.crop.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: s.crop.pos }}
                  />
                </div>
                <figcaption className="mt-3 text-[0.9rem] text-ink-soft">
                  From{" "}
                  <a href={`/work/${s.crop.slug}`} className="text-link font-semibold text-charcoal">
                    {s.crop.project}
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" data-nav="about" className="border-t border-line bg-sand" aria-labelledby="about-h">
      <div className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="num text-ink-soft">Amman, Jordan</p>
          <h2 id="about-h" className="display mt-3 text-[clamp(2.2rem,4.6vw,4rem)]">
            Careful work, <em>explained</em> plainly.
          </h2>
          <div className="measure mt-8 space-y-5 text-[1.08rem]">
            <p>
              I&rsquo;m {site.owner}, a designer and developer with a Software Engineering background. By day I&rsquo;m
              a TAC Support Engineer at Estarta, working across Cisco collaboration and Webex technologies.
            </p>
            <p className="text-ink-soft">
              That work taught me to diagnose a problem calmly, explain it plainly and test before I say something
              works. Scroll &amp; Serif is where I bring those habits to websites.
            </p>
          </div>
          <p className="mt-6 max-w-md text-[0.9rem] text-ink-soft">
            Scroll &amp; Serif is my independent practice. Estarta and Cisco are not involved in these projects.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-semibold">
            <li>
              <a href={site.linkedin} className="text-link tap" target="_blank" rel="noopener noreferrer">
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} className="text-link tap" target="_blank" rel="noopener noreferrer">
                Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-link tap">
                {site.email}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
          <h3 className="sr-only">Strengths</h3>
          <ol className="lg:pt-8">
            {strengths.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] border-t border-line py-7">
                <span className="num text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="display text-[1.6rem] leading-[1.15]">{s.title}</p>
                  <p className="mt-2 text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" data-nav="process" className="border-t border-line bg-ivory" aria-labelledby="process-h">
      <div className="wrap py-20 md:py-28">
        <Reveal>
          <h2 id="process-h" className="display max-w-2xl text-[clamp(2.2rem,4.6vw,4rem)]">
            How a project <em>unfolds</em>
          </h2>
        </Reveal>
        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 70} className="border-t border-line pt-0">
              <span aria-hidden="true" className="-mt-px block h-[2px] w-12 bg-plum" />
              <p className="num mt-5 text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-1 text-[1.7rem] leading-[1.15]">{s.title}</h3>
              <p className="mt-3 text-[0.98rem]">{s.body}</p>
              <p className="mt-2 text-[0.98rem] text-ink-soft">
                <span className="font-semibold text-charcoal">You receive: </span>
                {s.receive}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
