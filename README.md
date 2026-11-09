# Scroll & Serif

Portfolio site for Ali Tsai. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion. Fonts (Newsreader and Hanken Grotesk) are self-hosted by `next/font` at build time.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck && npm run lint
npm run build && npm start
```

## Configuration

See `.env.example`. Nothing secret is committed.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and social images. If unset or localhost, the site is `noindex`. |
| `INQUIRY_PROVIDER_API_KEY` | Server-side API key for the email provider. |
| `INQUIRY_TO` | Where project inquiries are delivered. |
| `INQUIRY_FROM` | A sender address verified with the provider. |
| `INQUIRY_PROVIDER_URL` | Optional. Defaults to Resend (`https://api.resend.com/emails`); any API that accepts the same JSON (`from`, `to`, `reply_to`, `subject`, `text`) works. |

### Inquiry flow

`POST /api/inquiries` validates the message server-side (zod), rejects cross-origin requests, treats a filled honeypot and a submission faster than 1.2 seconds as spam, rate-limits per IP, accepts one message per idempotency key, and only then calls the provider. The form shows success only after the server answers 200.

If the three server variables are missing, the endpoint answers `503 not_configured`. The form then keeps the visitor's text and offers a prepared email to the address in `content/site.ts`. It never shows a false success.

Rate limiting and duplicate protection are in memory per server instance, which is enough for a personal site. Use a shared store if traffic grows.

## Where things live

- `content/projects.ts`: the four projects (case-study content, status labels, palette, media).
- `content/extras.ts`: short homepage lines, visitor-value capabilities, hero accents and the crops that illustrate each point.
- `content/site.ts`: contact details, services, strengths, process.
- `app/globals.css`: design tokens (colour, radius, shadow, motion) and the control system.
- `components/ThemeToggle.tsx`: the day/night switch (CSS and inline SVG only).
- `components/Nav.tsx`, `useSlidingPill.ts`: navigation with a sliding pressed marker.
- `components/HeroStage.tsx`: the hero project stage and numbered selector.
- `components/Work.tsx`, `WorkIndex.tsx`: sticky visual beside a short narrative, plus the project index.
- `app/work/[slug]/page.tsx`: case-study template.
- `app/api/inquiries/route.ts`: inquiry endpoint.
- `public/work/**`: optimized captures and recordings. `npm run assets` rebuilds WebP from raw captures in `shots/` (not committed).
- `scripts/capture/`: the Playwright scripts used to capture media and to test (`_suite.cjs` behaviour, `_forms.cjs` inquiry flow against a local mock provider, `_axe2.cjs` accessibility).
- `docs/ASSET-BRIEF.md`: brief for optional generated artwork. `docs/screenshots/`: review screenshots.

## Content provenance

Every project statement was checked against the project's own source or documentation (DAR, Aurelle, Zaytoun app, Caucasus Sweets Home) and the Vercel project settings. Screenshots and recordings are real captures of those projects run locally, except the Zaytoun website desktop image, which is an earlier capture of the live deployment. Contact details and social links came from Ali's earlier portfolio project and need confirming.

## Reveal system

`components/RevealScript.tsx` is a small inline script that runs before hydration. Content is only hidden after it has confirmed an element sits below the fold; anything in or above the viewport is shown instantly, anchor jumps, large scroll jumps and Back/Forward restoration show the destination at once, and lower sections fade in (opacity plus 16px, about 480ms, stagger capped at 180ms) when they come within 15% of the viewport. Each group reveals once. Reduced motion, a missing IntersectionObserver, a script error or JavaScript being off all leave every element visible, because the hidden state is only ever applied by that script.

## Cinematic covers

The four 3:2 presentation images live in `assets-source/covers/` (PNG originals, 1536x1024) and are exported to `public/work/<project>/cover.webp` by `npm run assets`. Next.js serves AVIF/WebP per device from those. They are shown whole (never re-framed or cropped, never recoloured in dark mode) by `components/Cover.tsx`; the hero crossfades between them in a fixed 3:2 container only after the incoming image has decoded. Mapping is in `content/extras.ts`.

Real recordings open from a "Watch demo" button (`components/DemoDialog.tsx`); the video element only exists while the dialog is open, so nothing is downloaded until a visitor asks.

## Design system notes

- Light, ivory and charcoal with a deep plum accent; dark theme swaps the same tokens. Theme follows a saved choice, otherwise the system setting, and is applied before first paint.
- Controls are 12px radius, media frames 14px, fields 10px, status labels 6px. Light comes from the upper left.
- Motion: button press 180ms, theme 260ms, section entrance 520ms, project selection 480ms, switch thumb 460ms. Only transform and opacity animate on scroll. Native scrolling is never intercepted.
- Reduced motion removes sliding, lifting and entrance movement, stops preview recordings from autoplaying and disables the shared-element transition.
- Project links to case studies are plain anchors on purpose: a full navigation lets supporting browsers carry the preview into the case-study hero (cross-document View Transitions). Other browsers navigate normally.
