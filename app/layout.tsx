import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealScript } from "@/components/RevealScript";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Distinctive websites by Ali Tsai`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  robots: site.url.includes("localhost") ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EFE7" },
    { media: "(prefers-color-scheme: dark)", color: "#17120F" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint. Marks JS as available (so reveal styles only apply when they can resolve),
// then applies the saved theme, or the system preference when there is no saved choice.
const initScript =
  "(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('theme')}catch(e){}" +
  "if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t;" +
  // Hero opening: only on the home page, on a first visit in this browser session, and never with reduced motion.
  "try{if(location.pathname==='/'&&!sessionStorage.getItem('ss-hero')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-hero-intro','')}catch(e){}})()";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <div className="progress" aria-hidden="true" />
        <main id="main">{children}</main>
        <Footer />
        <RevealScript />
      </body>
    </html>
  );
}
