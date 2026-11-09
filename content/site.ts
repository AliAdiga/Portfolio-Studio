// Central site configuration. Contact details below were taken from Ali's own
// earlier portfolio project (D:\Projects\New-Portfilio\lib\content.ts).
// Confirm them before launch. Nothing here is invented.

export const site = {
  name: "Scroll & Serif",
  owner: "Ali Tsai",
  tagline: "Distinctive websites. Thoughtfully built.",
  description:
    "Scroll & Serif is the studio of Ali Tsai, a designer and developer in Amman, Jordan, creating distinctive, expressive websites for businesses and brands.",
  // Set NEXT_PUBLIC_SITE_URL in production. Falls back to localhost for development.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "alitsai55@gmail.com",
  instagram: "https://www.instagram.com/scrollandserif",
  linkedin: "https://www.linkedin.com/in/ali-tsai/",
  // Profile of the GitHub account that owns this portfolio's repository (AliAdiga/Portfolio-Studio).
  github: "https://github.com/AliAdiga",
  location: "Amman, Jordan",
} as const;

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

export const services = [
  {
    title: "Business and brand websites",
    body: "A complete site that looks like you and works well on a phone, in English, Arabic or both.",
    receive: ["Page designs and the finished build", "A short guide for editing content"],
    crop: { src: "/work/caucasus/menu-desktop.webp", pos: "50% 40%", slug: "caucasus-sweets-home", project: "Caucasus Sweets Home", alt: "A close view of the Caucasus Sweets Home menu and prices page." },
  },
  {
    title: "Interactive web experiences",
    body: "When a page should show rather than tell: a room to walk through, a menu to browse, a product that moves.",
    receive: ["One or two signature interactions", "Keyboard and reduced-motion support"],
    crop: { src: "/work/dar/explorer-desktop.webp", pos: "30% 55%", slug: "dar", project: "DAR", alt: "A close view of the DAR room explorer showing the isometric plan and time-of-day controls." },
  },
  {
    title: "Website redesigns",
    body: "I keep what already works, your content and structure, and rebuild the design and code around it.",
    receive: ["A review of what to keep and retire", "A redirect plan for existing pages"],
    crop: { src: "/work/zaytoun/site-desktop.webp", pos: "12% 85%", slug: "zaytoun", project: "Zaytoun", alt: "A close view of the Zaytoun home page headline and its reserve and menu buttons." },
  },
] as const;

export const strengths = [
  {
    title: "Visual design",
    body: "Type, colour and composition shaped around the business, not a template.",
  },
  {
    title: "Interactive development",
    body: "Motion and interaction that explain the work, and still work with a keyboard.",
  },
  {
    title: "Technical problem solving",
    body: "Integrations and edge cases handled with the habits of a support engineer.",
  },
] as const;

export const processSteps = [
  {
    title: "Understand",
    body: "We talk through your business and audience.",
    receive: "A one-page brief to react to.",
  },
  {
    title: "Design",
    body: "I show typography, colour and key pages before building.",
    receive: "Visual directions to steer.",
  },
  {
    title: "Build",
    body: "A working version on a private link, refined together.",
    receive: "Early, honest progress.",
  },
  {
    title: "Test and launch",
    body: "Checks on real screens, with a keyboard and reduced motion.",
    receive: "A live site and handover notes.",
  },
] as const;

export const projectTypes = [
  "Business or brand website",
  "Interactive web experience",
  "Website redesign",
  "Something else",
] as const;

/** Verified destinations only. A link that cannot be verified is omitted, never replaced with a placeholder. */
export const socials = [
  { id: "email", label: "Email", href: `mailto:${site.email}`, external: false },
  { id: "linkedin", label: "LinkedIn", href: site.linkedin, external: true },
  { id: "instagram", label: "Instagram", href: site.instagram, external: true },
  { id: "github", label: "GitHub", href: site.github, external: true },
] as const;

/** The Services menu: each entry links to an existing row in the Services section (stable ids). */
export const serviceMenu = [
  { id: "services-websites", title: "Websites", line: "Business and brand sites in English, Arabic or both.", art: "editorial" },
  { id: "services-interactive", title: "Interactive experiences", line: "Pages that show rather than tell.", art: "plan" },
  { id: "services-redesigns", title: "Redesigns", line: "Keep what works, rebuild the rest.", art: "beforeafter" },
] as const;
