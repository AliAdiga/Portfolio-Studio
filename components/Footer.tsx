import Link from "next/link";
import { site, nav } from "@/content/site";
import { projects } from "@/content/projects";
import { Monogram, Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-plum-deep text-paper">
      <span className="footer-amp" aria-hidden="true">
        &amp;
      </span>
      <div className="wrap relative py-20 md:py-28">
        <h2 className="display max-w-4xl text-[clamp(2.6rem,6.4vw,5.6rem)]">
          Let&rsquo;s make something <em>distinctive</em>.
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link href="/#contact" className="btn btn-primary">
            Discuss a project <span className="arrow" aria-hidden="true">&rarr;</span>
          </Link>
          <a href={`mailto:${site.email}`} className="text-link tap text-[1.1rem] font-semibold">
            {site.email}
          </a>
        </div>

        <hr className="rule my-14" />

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Monogram />
              <Wordmark className="text-paper" />
            </div>
            <p className="mt-5 max-w-xs text-[0.96rem] text-paper/80">
              Websites designed and built by {site.owner}. Based in {site.location}.
            </p>
          </div>
          <nav aria-label="Project pages">
            <h3 className="text-[0.9rem] font-semibold text-paper/75">Work</h3>
            <ul className="mt-4 space-y-2">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="text-link tap">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Site">
            <h3 className="text-[0.9rem] font-semibold text-paper/75">Studio</h3>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-link tap">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-[0.9rem] font-semibold text-paper/75">Elsewhere</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={site.instagram} className="text-link tap" rel="noopener noreferrer" target="_blank">
                  Instagram<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.linkedin} className="text-link tap" rel="noopener noreferrer" target="_blank">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="relative border-t border-paper/15">
        <p className="wrap py-6 text-sm text-paper/75">
          &copy; {new Date().getFullYear()} {site.name}. Featured project names and brands belong to their respective concepts and owners.
        </p>
      </div>
    </footer>
  );
}
