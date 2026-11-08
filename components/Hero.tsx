import Link from "next/link";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return (
    <section className="relative overflow-x-clip" aria-labelledby="hero-h">
      <div className="hero-wash" aria-hidden="true" />
      <span className="hero-amp" aria-hidden="true">
        &amp;
      </span>
      <div className="wrap relative grid items-center gap-10 py-8 lg:min-h-[min(calc(100dvh-var(--nav-h)),760px)] lg:grid-cols-12 lg:gap-8">
        <div className="hero-text lg:col-span-6">
          <h1
            id="hero-h"
            className="display text-[clamp(2.7rem,4.3vw,4.4rem)]"
          >
            <span className="rise block" style={{ "--d": "60ms" } as React.CSSProperties}>
              Distinctive
            </span>
            <span className="rise block" style={{ "--d": "160ms" } as React.CSSProperties}>
              websites.
            </span>
            <span className="rise block" style={{ "--d": "260ms" } as React.CSSProperties}>
              <em>Thoughtfully</em> built.
            </span>
          </h1>
          <p className="lede rise mt-7" style={{ "--d": "420ms" } as React.CSSProperties}>
            I&rsquo;m Ali Tsai, a designer and developer based in Amman, creating expressive digital experiences for
            businesses and brands.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--d": "540ms" } as React.CSSProperties}>
            <Link href="#work" className="btn btn-primary">
              Explore my work <span className="arrow" aria-hidden="true">&darr;</span>
            </Link>
            <Link href="#contact" className="btn btn-ghost">
              Discuss a project
            </Link>
          </div>
        </div>
        <div className="hero-stage lg:-mr-10 lg:col-span-6">
          <div className="rise" style={{ "--d": "300ms" } as React.CSSProperties}>
            <HeroStage />
          </div>
        </div>
      </div>
    </section>
  );
}
