import Image from "next/image";
import { additionalProjects } from "@/content/projects";
import { PreviewDialog } from "./PreviewDialog";
import { Reveal } from "./Reveal";

/**
 * Secondary, more compact than featured work: three equal cards with a real desktop capture, HTML text
 * below the image, an external link and a small preview dialog. The collection comes from the shared
 * project data (collection: "additional").
 */
export function MoreWebsites() {
  return (
    <section id="more" data-nav="more" className="border-t border-line bg-ivory" aria-labelledby="more-h">
      <div className="wrap py-16 md:py-24">
        <Reveal>
          <h2 id="more-h" className="display text-[clamp(2rem,4vw,3.2rem)]">
            More <em>websites</em>
          </h2>
          <p className="measure mt-3 text-[1.02rem] text-ink-soft">
            Three further sites I designed and built, shown as portfolio pieces. No client relationships are implied.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {additionalProjects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 60} className="more-card flex flex-col">
              <div className="more-shot" style={{ aspectRatio: `${p.cover.w} / ${p.cover.h}` }}>
                <Image
                  src={p.cover.src}
                  alt={p.cover.alt}
                  width={p.cover.w}
                  height={p.cover.h}
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 46vw, 92vw"
                  loading="lazy"
                  className="more-img"
                />
              </div>
              <div className="mt-5 flex flex-1 flex-col">
                <p className="text-[0.92rem] font-semibold text-plum">{p.category}</p>
                <h3 className="display mt-1 text-[1.7rem] leading-[1.1]">{p.name}</h3>
                <p className="mt-3 text-[0.98rem] text-ink-soft">{p.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-1 pt-5">
                  <a href={p.liveUrl} className="cs-link" target="_blank" rel="noopener noreferrer">
                    <span className="label">Visit website</span>
                    <span className="ring" aria-hidden="true">&#8599;</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <PreviewDialog project={p} />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
