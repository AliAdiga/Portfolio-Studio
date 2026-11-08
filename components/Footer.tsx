import Link from "next/link";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="on-dark bg-plum-deep text-ivory">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark className="text-ivory" />
          <p className="mt-5 max-w-sm text-[0.98rem] text-ivory/80">
            Websites designed and built by {site.owner}. Based in {site.location}.
          </p>
        </div>
        <nav aria-label="Work">
          <h2 className="kicker text-ivory/75">Work</h2>
          <ul className="mt-4 space-y-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="text-link">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="kicker text-ivory/75">Elsewhere</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${site.email}`} className="text-link">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram} className="text-link" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.linkedin} className="text-link" rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <p className="wrap py-6 text-sm text-ivory/75">
          &copy; {new Date().getFullYear()} {site.name}. Featured project names and brands belong to their respective concepts and owners.
        </p>
      </div>
    </footer>
  );
}
