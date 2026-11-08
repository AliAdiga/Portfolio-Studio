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

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, social images. **If unset or localhost, the site is `noindex` and robots disallows everything.** |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Optional form endpoint (for example a Formspree form URL). If unset, the form opens the visitor's email app with a prepared message and states that nothing is sent until they press Send. A success message appears only after the endpoint returns 2xx. |

No secrets are used or committed.

## Where things live

- `content/projects.ts`: all four projects (single source of truth for the homepage and case studies).
- `content/site.ts`: contact details, services, process.
- `components/ProjectShowcase.tsx`: four different homepage compositions.
- `app/work/[slug]/page.tsx`: reusable case-study template.
- `public/work/**`: optimized screenshots. `npm run assets` rebuilds them from raw captures in `shots/` (not committed). `scripts/capture/` holds the Playwright capture scripts that were used.
- `docs/ASSET-BRIEF.md`: image-generation brief.

## Content provenance

Every project statement was checked against the project's own source or docs on the author's machine (D:\Projects\DAR, 3D-Website-Perfume, zaytoun-app, caucasus_sweets_home) and the Vercel project settings. Screenshots are real captures of those projects run locally, except the Zaytoun website desktop image, which is an earlier capture of the live deployment. Contact details and social links were taken from Ali's earlier portfolio project and need confirming.

## Design and motion features

Paper grain and soft light wash, wave dividers between sections, stacked project sheets (native `position: sticky`), CSS scroll-driven hero drift and progress rule, masked headline and wiped image reveals, cursor "View" label, hover tilt, one pausable marquee, shared-element case-study transitions (cross-document View Transitions, so project links are plain anchors), real screen recordings with Play/Pause, and a light/dark theme toggle (light by default, remembered on the device).

## Motion and accessibility

Entrance and scroll reveals use IntersectionObserver and CSS, content is visible if JavaScript fails, and everything collapses under `prefers-reduced-motion` (including the DAR preview video, which then does not autoplay). Native scrolling is never intercepted. Case-study navigation uses the CSS View Transitions API where supported.
