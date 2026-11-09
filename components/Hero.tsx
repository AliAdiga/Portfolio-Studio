import Link from "next/link";
import { HeroStage } from "./HeroStage";

export function Hero() {
  return (
    <section className="hero relative overflow-x-clip" aria-labelledby="hero-h">
      <div className="hero-wash" aria-hidden="true" />
      <span className="hero-amp" aria-hidden="true">
        &amp;
      </span>
      <div className="wrap relative grid items-center gap-10 py-8 lg:min-h-[min(calc(100dvh-var(--nav-h)),780px)] lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h1 id="hero-h" className="display text-[clamp(2.7rem,4.4vw,4.5rem)]">
            <span className="block">
              Distinctive
            </span>
            <span className="block">
              websites.
            </span>
            <span className="block">
              <em>Thoughtfully</em> built.
            </span>
          </h1>
          <p className="lede mt-6">
            I&rsquo;m Ali Tsai, a designer and developer based in Amman, creating expressive digital experiences for
            businesses and brands.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#work" className="btn btn-primary">
              Explore my work <span className="arrow" aria-hidden="true">&darr;</span>
            </Link>
            <Link href="#contact" className="btn btn-secondary">
              Discuss a project
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
