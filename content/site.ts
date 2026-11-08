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
    body: "A complete site for your business: clear pages and a visual style that fits you. You receive a finished site that works well on a phone and reads comfortably in English, Arabic, or both.",
    receive: ["Page designs and the finished build", "Mobile and desktop layouts", "A short guide for editing content"],
    crop: { src: "/work/caucasus/menu-desktop.webp", pos: "50% 40%", slug: "caucasus-sweets-home", project: "Caucasus Sweets Home", alt: "A close view of the Caucasus Sweets Home menu and prices page." },
  },
  {
    title: "Interactive web experiences",
    body: "When a page needs to show something rather than say it: a room you can walk through, a product that moves, a menu that feels like a book. Interaction is added where it explains the work, and kept out of the way of the essentials.",
    receive: ["One or two signature interactions", "Keyboard and reduced-motion support", "A calm fallback for older devices"],
    crop: { src: "/work/dar/explorer-desktop.webp", pos: "30% 55%", slug: "dar", project: "DAR", alt: "A close view of the DAR room explorer showing the isometric plan and time-of-day controls." },
  },
  {
    title: "Website redesigns",
    body: "If your current site no longer represents you, I start by keeping what works: your content, your structure, your search presence. Then I rebuild the design and the code around it so it looks and feels current.",
    receive: ["A review of what to keep and what to retire", "A redesigned, rebuilt site", "A redirect plan for existing pages"],
    crop: { src: "/work/zaytoun/site-desktop.webp", pos: "12% 85%", slug: "zaytoun", project: "Zaytoun", alt: "A close view of the Zaytoun home page headline and its reserve and menu buttons." },
  },
] as const;

export const processSteps = [
  {
    title: "Understand the business",
    body: "We talk about who you serve, what they need to do on your site, and what makes you different. You leave with a short written brief to react to.",
  },
  {
    title: "Establish the visual direction",
    body: "I show you typography, colour, and key page compositions before building anything, so you can steer while change is still cheap.",
  },
  {
    title: "Build and refine",
    body: "You see a working version early, on a private link. We refine the details together: wording, images, spacing, motion.",
  },
  {
    title: "Test and launch",
    body: "I check the site on real screen sizes, with a keyboard, and with reduced motion on. Then we publish together and I hand over everything you need.",
  },
] as const;

export const projectTypes = [
  "Business or brand website",
  "Interactive web experience",
  "Website redesign",
  "Something else",
] as const;
