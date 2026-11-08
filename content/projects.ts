// Single source of truth for the four featured projects.
// Every statement here was checked against the project's own source or
// documentation (see README "Content provenance"). Do not add results,
// traffic, awards, testimonials or client names without evidence.

export type Shot = {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  /** One line used on the hero stage and in navigation. */
  short: string;
  /** Case-study introduction. */
  intro: string;
  /** Concise explanation of the experience, shown on the homepage. */
  summary: string;
  status: { label: string; note: string };
  role: string[];
  audience: string;
  goals: string[];
  /** A single meaningful design or implementation detail, shown on the homepage. */
  detail: { title: string; body: string };
  decisions: { title: string; body: string }[];
  interactions: string[];
  implementation: string[];
  stack: string;
  liveUrl: string;
  /** Colours taken from the project's own interface. */
  palette: { name: string; hex: string }[];
  desktop: Shot[];
  mobile: Shot[];
  /** Optional authentic screen recording. */
  video?: { src: string; poster: string; w: number; h: number; alt: string; kind?: "browser" | "phone" };
  /** Solid colour taken from the project, used when it floods the next-project panel. */
  tone: string;
  imageNote?: string;
};

const d = (src: string, alt: string, caption: string, w = 1440, h = 900): Shot => ({ src, w, h, alt, caption });
const m = (src: string, alt: string, caption: string): Shot => ({ src, w: 780, h: 1688, alt, caption });

export const projects: Project[] = [
  {
    slug: "dar",
    name: "DAR",
    category: "Architecture and interiors",
    short: "An interiors studio concept you can walk through.",
    intro:
      "DAR is an English and Arabic website for an imagined architecture and interiors studio inspired by contemporary homes in Amman. Its centre is an explorable residence: choose a room, change the light, swap the finish, and open the material behind each marker.",
    summary:
      "The home page rebuilds a concrete shell into a furnished room as you scroll. Four concept projects open into a residence you explore room by room, by plan or isometric view, at different times of day.",
    status: {
      label: "Independent concept",
      note: "DAR is not a real studio. The studio, team and clients are fictional, and every image is a labelled concept visualization.",
    },
    role: ["Concept and information design", "Interface design", "Front-end development", "Direction of AI-generated concept imagery"],
    audience: "Homeowners imagining a renovation, and businesses looking for a distinctive interiors presence online.",
    goals: [
      "Let visitors understand a space by moving through it rather than reading about it.",
      "Make the path from browsing to a project inquiry short and calm.",
      "Work equally well in English and Arabic, including right-to-left layout.",
    ],
    detail: {
      title: "The room list is the real control",
      body: "The isometric plan is a supplementary pointer interface. A plain list of rooms is the primary, keyboard-friendly way to move, and room, view and time of day are stored in the URL so any state can be linked.",
    },
    decisions: [
      {
        title: "Photography leads, type stays quiet",
        body: "A restrained palette of ivory, walnut and plum-brown lets the interiors carry the page. Display type is a light serif; interface text is a plain sans.",
      },
      {
        title: "An accessible primary control",
        body: "The HTML room list drives the explorer. The SVG floor plan and the hotspots add a second way in without being the only one.",
      },
      {
        title: "Honest labelling",
        body: "Images carry a concept label, the project pages say the work is conceptual, and the inquiry form says plainly when nothing has been sent.",
      },
    ],
    interactions: [
      "Scroll transformation on the home page: shell, surfaces, joinery, furnished, with a Play control for visitors who prefer not to scroll.",
      "Room explorer across four rooms with isometric and plan views.",
      "Morning, golden hour and blue hour lighting, and walnut or oak finishes.",
      "Material hotspots that open a detail panel.",
      "Existing-versus-proposed comparison slider and an image lightbox.",
      "Saved ideas list stored on the device, and a five-question style quiz.",
      "A three-step project inquiry flow that runs in a demo mode.",
    ],
    implementation: [
      "Next.js 16 and React 19 with strict TypeScript.",
      "Plain CSS variables and CSS modules, with no utility framework.",
      "Typed content for projects, rooms and materials, with English and Arabic dictionaries.",
      "Requests for room images are race-safe, so the title, markers and photograph always match.",
      "Automated accessibility audits in both languages and a 320 px reflow check.",
    ],
    stack: "Next.js, React, TypeScript, CSS modules",
    tone: "#684450",
    liveUrl: "https://dar-architecture.vercel.app",
    palette: [
      { name: "Limestone", hex: "#F5EEE1" },
      { name: "Plum", hex: "#684450" },
    ],
    desktop: [
      d("/work/dar/home-desktop.webp", "DAR home page: a bare concrete room with a large window over Amman and the headline Thoughtful spaces. Made for living.", "Home page, first stage of the scroll transformation."),
      d("/work/dar/explorer-desktop.webp", "The DAR room explorer showing an isometric apartment plan beside a photograph of a walnut kitchen with material markers.", "Room explorer: isometric plan, kitchen view and time-of-day controls."),
    ],
    mobile: [
      m("/work/dar/home-mobile.webp", "DAR home page on a phone showing the concrete room and the headline.", "Home page on a 390 px screen."),
      m("/work/dar/explorer-mobile.webp", "The DAR room explorer on a phone.", "Room explorer on a 390 px screen."),
    ],
    video: {
      src: "/work/dar/explorer.mp4",
      poster: "/work/dar/explorer-desktop.webp",
      w: 1120,
      h: 700,
      alt: "Screen recording of the DAR room explorer switching between the living room, kitchen, bedroom and bathroom and changing the time of day.",
    },
    imageNote: "Interior imagery on DAR is AI-generated and labelled as concept visualization on the site.",
  },
  {
    slug: "aurelle",
    name: "Aurelle",
    category: "Perfume and luxury presentation",
    short: "A perfume house presented as a dark gallery and a soft floral world.",
    intro:
      "Aurelle is a multi-page website for an imagined perfume house from Grasse. A dark gallery presents each fragrance as a scene, and a light companion world, Pour Elle, shows the floral range, with both sharing one shopping bag.",
    summary:
      "Each fragrance is staged as a full-screen scene with mist and fruit, with clear previous, next and pause controls. The site runs in English, French and Arabic, with full right-to-left support.",
    status: {
      label: "Independent concept",
      note: "Aurelle is an imagined brand created for this portfolio. It is not a real perfume house and does not sell products.",
    },
    role: ["Brand and interface design", "Front-end development", "Direction of AI-generated product imagery"],
    audience: "Shoppers who expect a fragrance brand to feel like an object of desire, on a phone as much as on a desktop.",
    goals: [
      "Give each fragrance its own atmosphere while keeping navigation obvious.",
      "Let a visitor change language and currency without losing their place.",
      "Keep heavy imagery smooth on mobile through sized, compressed images.",
    ],
    detail: {
      title: "Two worlds, one bag",
      body: "The signature collection lives on a dark stage. Pour Elle is a pale, botanical counterpart with its own type scale. They share one bag and one navigation, so moving between moods never costs context.",
    },
    decisions: [
      {
        title: "Dark for drama, light for softness",
        body: "Darkness gives bottle and amber glass their contrast. The floral range gets a deliberately lighter page so it never reads as a recoloured copy.",
      },
      {
        title: "Motion with controls",
        body: "The hero gallery has previous, next and pause controls and a gallery or list view, so the spectacle is optional.",
      },
      {
        title: "Three languages from the start",
        body: "English, French and Arabic strings are set before first paint, and Arabic switches the whole layout to right-to-left.",
      },
    ],
    interactions: [
      "Full-screen hero gallery with previous, next and pause controls, and a switch to a list view.",
      "Language and currency selectors in the header.",
      "Search and a shopping bag shared across the home page, Pour Elle and Florals pages.",
      "Quick view on products.",
      "Separate pages for the house story and client care.",
    ],
    implementation: [
      "Multi-page site built with Vite, with GSAP for animation and Lenis for smooth scrolling.",
      "Language is applied before first paint to avoid a flash of untranslated text.",
      "Arabic loads its own typefaces only when needed.",
      "Structured data and a theme colour set in the page head.",
    ],
    stack: "Vite, GSAP, Lenis, vanilla JavaScript",
    tone: "#2b0b13",
    liveUrl: "https://aurelle-perfume-ashen.vercel.app",
    palette: [
      { name: "Noir", hex: "#080808" },
      { name: "Wine", hex: "#410E18" },
      { name: "Rosé", hex: "#AF546C" },
    ],
    desktop: [
      d("/work/aurelle/home-desktop.webp", "Aurelle home page: a perfume bottle between blood orange halves and lavender on a dark misty stage, with the name Ember below.", "Home gallery, the Ember scene."),
      d("/work/aurelle/women-desktop.webp", "Aurelle Pour Elle page with the headline Fragrances that attract people, botanical illustrations and a pink perfume bottle on a pale background.", "Pour Elle, the light floral world."),
    ],
    mobile: [
      m("/work/aurelle/home-mobile.webp", "Aurelle home page on a phone showing the Ember perfume scene.", "Home gallery on a 390 px screen."),
      m("/work/aurelle/women-mobile.webp", "Aurelle Pour Elle page on a phone.", "Pour Elle on a 390 px screen."),
    ],
    video: {
      src: "/work/aurelle/preview.mp4",
      poster: "/work/aurelle/home-desktop.webp",
      w: 1120,
      h: 700,
      alt: "Screen recording of the Aurelle home gallery moving between fragrance scenes with the next button.",
    },
    imageNote: "Product photography on Aurelle is AI-generated.",
  },
  {
    slug: "zaytoun",
    name: "Zaytoun",
    category: "Restaurant and hospitality",
    short: "A bilingual restaurant site and a companion reservations app.",
    intro:
      "Zaytoun is a bilingual website for a Levantine fine-dining restaurant in Amman, led by a full-bleed video hero and a menu organised by course. A companion mobile app carries the same identity and takes reservations.",
    summary:
      "A film-led home page, a menu you can browse by course with prices in Jordanian dinars, and a reservation flow with a calendar picker. English and Arabic are available throughout.",
    status: {
      label: "Personal project",
      note: "Built independently by Ali Tsai. No client relationship is implied.",
    },
    role: ["Interface design", "Front-end development of the website", "Mobile app build with Expo", "Reservation data flow"],
    audience: "Diners deciding where to eat, often on a phone, in English or Arabic.",
    goals: [
      "Make the atmosphere of the restaurant felt before a visitor reads a word.",
      "Make the menu easy to scan by course, with prices visible.",
      "Keep reserving a table to a few clear steps.",
    ],
    detail: {
      title: "A reservation that reaches the restaurant",
      body: "In the app, a reservation is saved to a Supabase database and triggers an email alert to the restaurant. If that step fails, the guest can still continue by phone or WhatsApp.",
    },
    decisions: [
      {
        title: "Film first, with a scrim",
        body: "The home page opens on cooking footage under a dark scrim so serif headlines and navigation stay legible over moving images.",
      },
      {
        title: "Olive and terracotta",
        body: "A deep olive and a warm terracotta call to action make the identity feel of its place without leaning on cliché.",
      },
      {
        title: "Menu as a reading experience",
        body: "Dishes are grouped by course, with prices in dinars and the most popular dishes and chef's picks flagged.",
      },
    ],
    interactions: [
      "Full-bleed video hero with reserve and explore actions.",
      "Menu filtered by course: starters, mains, Western and desserts.",
      "Language switch between English and Arabic.",
      "Reservation form with time slots and a calendar date picker, in the app.",
      "Additional website pages for gallery, events, journal, FAQ and gift cards.",
    ],
    implementation: [
      "Website built with Next.js; the mobile app uses Expo Router and React Native.",
      "Reservations are written to Supabase with an email trigger to the restaurant (app).",
      "Arabic and English dictionaries share one language context.",
      "Restaurant structured data and a cookie consent notice on the website.",
    ],
    stack: "Next.js, Expo, React Native, Supabase",
    tone: "#4A5E3A",
    liveUrl: "https://zaytoun-restaurant.vercel.app",
    palette: [
      { name: "Olive", hex: "#4A5E3A" },
      { name: "Terracotta", hex: "#C3612B" },
    ],
    desktop: [
      { src: "/work/zaytoun/site-desktop.webp", w: 1600, h: 829, alt: "Zaytoun home page: a chef's hand with a spoon over a salad under the headline The Taste of Home, with Explore menu and Reserve a table buttons.", caption: "Website home page, captured from the live deployment." },
      d("/work/zaytoun/app-menu-desktop.webp", "The Zaytoun app menu screen showing starters with photographs and prices.", "Companion app, menu screen shown in its web build."),
    ],
    mobile: [
      m("/work/zaytoun/app-home-mobile.webp", "The Zaytoun app home screen on a phone with the headline The Taste of Home.", "Companion app home on a 390 px screen."),
      m("/work/zaytoun/app-menu-mobile.webp", "The Zaytoun app menu on a phone listing Mezze Royale, Kibbeh Nayeh and Fatayer Trio with prices.", "Companion app menu on a 390 px screen."),
      m("/work/zaytoun/app-reserve-mobile.webp", "The Zaytoun app reservation form with name, phone, date and time slots.", "Companion app reservation form."),
    ],
    video: {
      src: "/work/zaytoun/app-preview.mp4",
      poster: "/work/zaytoun/app-menu-mobile.webp",
      w: 360,
      h: 780,
      kind: "phone",
      alt: "Screen recording of the Zaytoun app: the menu scrolling through starters, then the reservation form.",
    },
    imageNote: "Website screenshot was captured earlier from the live deployment. App screens are the Expo web build run locally.",
  },
  {
    slug: "caucasus-sweets-home",
    name: "Caucasus Sweets Home",
    category: "Bakery and dessert house",
    short: "An Arabic-first site for a Caucasian dessert house in Amman.",
    intro:
      "Caucasus Sweets Home is a bilingual website for a Caucasian dessert house in Amman. The Arabic pages are the source of truth, an English twin is generated from them, and the same content also ships as an Android app.",
    summary:
      "A burgundy and cream identity with a vertical video, a menu with sizes and prices, a story section, a gallery and branch details. Arabic is right-to-left from the first line of code.",
    status: {
      label: "Independent concept",
      note: "Created by Ali Tsai as a personal concept project. No endorsement or client relationship is implied.",
    },
    role: ["Visual identity direction", "Interface design", "Front-end development", "English page generation tooling"],
    audience: "Neighbours and visitors in Amman looking for a dessert, who want prices and branch details quickly.",
    goals: [
      "Make the menu and prices reachable in one tap.",
      "Treat Arabic as the main language rather than a translation.",
      "Run as a plain static site that loads quickly on mobile networks.",
    ],
    detail: {
      title: "Arabic is the source, English is generated",
      body: "The Arabic pages hold the text. A small build script produces the English twin and rewrites the SEO tags, language alternates and sitemap, so the two versions cannot drift apart.",
    },
    decisions: [
      {
        title: "Burgundy, cream and ornament",
        body: "A deep burgundy ground, cream surfaces and a woven ornament pattern give the brand a warm, specific character.",
      },
      {
        title: "Menu first",
        body: "The primary navigation action is the menu with prices, and a call button stays visible on every screen.",
      },
      {
        title: "No build step for the browser",
        body: "Plain HTML, CSS and JavaScript keep the pages light, and WebP images keep the photography small.",
      },
    ],
    interactions: [
      "Arabic and English pages with a language switch.",
      "Menu and prices with sizes for each item.",
      "Vertical video, story section, gallery and branch details.",
      "An installable site with a service worker and manifest.",
      "A floating call button.",
    ],
    implementation: [
      "Static HTML, CSS and JavaScript with no browser build step.",
      "Menu data in one file, in Arabic and English, with sizes and prices.",
      "A Python script generates the English pages, canonical and language-alternate tags and the sitemap.",
      "Local business structured data on each page.",
      "The same content also runs as a separate Android app built with Expo.",
    ],
    stack: "HTML, CSS, JavaScript, Python build script, Expo",
    tone: "#6E1F2C",
    liveUrl: "https://caucasus-sweets-home.vercel.app",
    palette: [
      { name: "Burgundy", hex: "#6E1F2C" },
      { name: "Cream", hex: "#FCF7EB" },
    ],
    desktop: [
      d("/work/caucasus/home-desktop.webp", "Caucasus Sweets Home English home page on a burgundy background with the headline When life gives you dessert, order a honey cake, beside a vertical video of a lemonade and flowers.", "English home page."),
      d("/work/caucasus/menu-desktop.webp", "Caucasus Sweets Home menu and prices page.", "Menu and prices."),
    ],
    mobile: [
      m("/work/caucasus/home-mobile.webp", "Caucasus Sweets Home home page on a phone.", "Home page on a 390 px screen."),
      m("/work/caucasus/menu-mobile.webp", "Caucasus Sweets Home menu page on a phone.", "Menu on a 390 px screen."),
    ],
    video: {
      src: "/work/caucasus/preview.mp4",
      poster: "/work/caucasus/home-desktop.webp",
      w: 1120,
      h: 700,
      alt: "Screen recording of the Caucasus Sweets Home English site scrolling from the hero through the menu and gallery sections.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
