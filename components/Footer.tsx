import { ArrowUp, EnvelopeSimple, GithubLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { site, socials } from "@/content/site";
import { AmmanClock } from "./AmmanClock";
import { Reveal } from "./Reveal";

const icons: Record<(typeof socials)[number]["id"], ReactNode> = {
  email: <EnvelopeSimple size={56} weight="fill" aria-hidden="true" />,
  linkedin: <LinkedinLogo size={56} weight="fill" aria-hidden="true" />,
  instagram: <InstagramLogo size={56} weight="fill" aria-hidden="true" />,
  github: <GithubLogo size={56} weight="fill" aria-hidden="true" />,
};

/** "Last updated" is shown only when the build date is real (set in next.config.ts when the site is built). */
function lastUpdated() {
  const raw = process.env.NEXT_PUBLIC_BUILD_DATE;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return {
    iso: d.toISOString().slice(0, 10),
    text: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Amman" }).format(d),
  };
}

/** One personal sign-off: a note card, four social tiles and a quiet line of metadata. The inquiry form sits above. */
export function Footer() {
  const updated = lastUpdated();
  return (
    <footer className="on-dark relative overflow-hidden bg-plum-deep text-paper">
      <span className="footer-amp" aria-hidden="true">
        &amp;
      </span>
      <div className="wrap relative pb-8 pt-20 md:pt-28">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="order-2 text-[0.92rem] lg:order-1 lg:col-span-3">
            {updated && (
              <p>
                <span className="footer-label block">Last updated</span>
                <time dateTime={updated.iso}>{updated.text}</time>
              </p>
            )}
          </div>

          <Reveal className="order-1 lg:order-2 lg:col-span-7">
            <div className="note-card">
              <p className="note-kicker">A note from Ali</p>
              <p className="note-line">Thanks for spending a little time with my work.</p>
              <p className="note-line">I build websites with character, care, and attention to the details.</p>
              <p className="note-line">Have something in mind? Let&rsquo;s make it happen.</p>
              <p className="note-line">
                <a href={`mailto:${site.email}`} className="note-email tap-sm">
                  {site.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <ul className="social-row" aria-label="Contact and social links">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  className="social-tile"
                  {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {icons[s.id]}
                  <span className="social-label">{s.label}</span>
                  {s.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-paper/20 pt-6 text-[0.92rem] text-paper/85">
          <p>
            Currently in Amman, <AmmanClock />
          </p>
          <p className="max-w-xl">
            &copy; {new Date().getFullYear()} {site.name}. Featured project names and brands belong to their respective
            concepts and owners.
          </p>
          <a href="#top" className="tap text-link font-semibold">
            Back to top <ArrowUp size={16} weight="bold" aria-hidden="true" className="ml-1.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
