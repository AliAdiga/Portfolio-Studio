// Editorial layer on top of content/projects.ts: short homepage copy, visitor-value capabilities
// and the real capture crops that illustrate them. Every crop is a region of an authentic
// screenshot already used in the case study. Nothing here adds functionality that the
// projects do not have.

export type Crop = { src: string; alt: string; pos: string };
export type Capability = Crop & { label: string; value: string; phoneVideo?: boolean };

export type Extras = {
  /** Tint that colours the hero when this project is selected. */
  accent: string;
  /** One strong sentence for the homepage. */
  line: string;
  /** Short scope summary for the case-study facts row. */
  scope: string;
  capabilities: Capability[];
  /** One crop per key design decision, in order. */
  decisionMedia: Crop[];
};

export const extras: Record<string, Extras> = {
  dar: {
    accent: "#b08560",
    line: "Walk through a home room by room, then change its light and finish.",
    scope: "Concept, interface, bilingual front-end",
    capabilities: [
      {
        label: "Move room by room",
        value: "Four rooms, by isometric plan or a plain list.",
        src: "/work/dar/explorer-desktop.webp",
        pos: "28% 62%",
        alt: "The DAR isometric plan showing the bedroom, bathroom, kitchen and living room.",
      },
      {
        label: "Change the light and finish",
        value: "Morning, golden hour or blue hour, in walnut or oak.",
        src: "/work/dar/explorer-mobile.webp",
        pos: "50% 72%",
        alt: "The DAR explorer's time-of-day and finish controls on a phone.",
      },
      {
        label: "Read it in English or Arabic",
        value: "Right-to-left layouts are built in from the start.",
        src: "/work/dar/home-desktop.webp",
        pos: "88% 4%",
        alt: "The DAR header with its Arabic language link and Start a project button.",
      },
    ],
    decisionMedia: [
      { src: "/work/dar/explorer-desktop.webp", pos: "80% 40%", alt: "A walnut kitchen photograph with material markers." },
      { src: "/work/dar/explorer-desktop.webp", pos: "20% 60%", alt: "The isometric plan beside the room list controls." },
      { src: "/work/dar/home-desktop.webp", pos: "2% 55%", alt: "The DAR headline with its concept visualization label." },
    ],
  },
  aurelle: {
    accent: "#8d2a43",
    line: "Meet each fragrance as a scene, in English, French or Arabic.",
    scope: "Brand, interface, front-end",
    capabilities: [
      {
        label: "A gallery of scenes",
        value: "Each fragrance fills the screen, with previous, next and pause controls.",
        src: "/work/aurelle/home-desktop.webp",
        pos: "50% 55%",
        alt: "The Aurelle perfume bottle between blood orange halves and lavender.",
      },
      {
        label: "A softer world for florals",
        value: "Pour Elle shares the bag, but not the mood.",
        src: "/work/aurelle/women-desktop.webp",
        pos: "40% 40%",
        alt: "The Aurelle Pour Elle headline over botanical illustrations.",
      },
      {
        label: "Your language and currency",
        value: "Switch between English, French and Arabic at any time.",
        src: "/work/aurelle/home-desktop.webp",
        pos: "92% 6%",
        alt: "The language and currency selectors in the Aurelle header.",
      },
    ],
    decisionMedia: [
      { src: "/work/aurelle/home-desktop.webp", pos: "50% 45%", alt: "The dark Aurelle gallery stage." },
      { src: "/work/aurelle/women-desktop.webp", pos: "50% 45%", alt: "The pale Pour Elle page." },
      { src: "/work/aurelle/home-desktop.webp", pos: "50% 90%", alt: "The Aurelle gallery controls and discover link." },
    ],
  },
  zaytoun: {
    accent: "#6f8450",
    line: "Browse the menu, then move toward a table.",
    scope: "Interface, website and companion app",
    capabilities: [
      {
        label: "A film-led welcome",
        value: "Cooking footage sets the mood before any text.",
        src: "/work/zaytoun/site-desktop.webp",
        pos: "40% 60%",
        alt: "The Zaytoun home page with a chef's spoon over a salad.",
      },
      {
        label: "Menu by course",
        value: "Starters to desserts, with prices in dinars.",
        src: "/work/zaytoun/app-menu-mobile.webp",
        pos: "50% 22%",
        alt: "The Zaytoun app menu listing Mezze Royale and Kibbeh Nayeh with prices.",
      },
      {
        label: "From menu to reservation",
        value: "Browse by course, then reserve with a calendar picker.",
        src: "/work/zaytoun/app-reserve-mobile.webp",
        pos: "50% 30%",
        alt: "The Zaytoun app reservation form.",
        phoneVideo: true,
      },
    ],
    decisionMedia: [
      { src: "/work/zaytoun/site-desktop.webp", pos: "30% 70%", alt: "The Zaytoun headline over cooking footage." },
      { src: "/work/zaytoun/site-desktop.webp", pos: "95% 6%", alt: "The Zaytoun Book a table button in the header." },
      { src: "/work/zaytoun/app-menu-mobile.webp", pos: "50% 40%", alt: "Menu dishes grouped by course in the Zaytoun app." },
    ],
  },
  "caucasus-sweets-home": {
    accent: "#9c2f42",
    line: "An Arabic-first catalogue with an English twin, prices included.",
    scope: "Identity direction, interface, front-end",
    capabilities: [
      {
        label: "Menu with sizes and prices",
        value: "Every item, every size, in one place.",
        src: "/work/caucasus/menu-desktop.webp",
        pos: "50% 40%",
        alt: "The Caucasus Sweets Home menu and prices page.",
      },
      {
        label: "Arabic and English",
        value: "The Arabic pages are the source; English is generated from them.",
        src: "/work/caucasus/home-desktop.webp",
        pos: "92% 6%",
        alt: "The Caucasus Sweets Home header with its Arabic language switch.",
      },
      {
        label: "Made for phones",
        value: "The menu and a call button stay one tap away.",
        src: "/work/caucasus/home-mobile.webp",
        pos: "50% 25%",
        alt: "The Caucasus Sweets Home home page on a phone.",
      },
    ],
    decisionMedia: [
      { src: "/work/caucasus/home-desktop.webp", pos: "20% 60%", alt: "The burgundy hero with the honey cake headline." },
      { src: "/work/caucasus/menu-desktop.webp", pos: "50% 30%", alt: "The menu page with category filters." },
      { src: "/work/caucasus/home-mobile.webp", pos: "50% 30%", alt: "The mobile home page with its call button." },
    ],
  },
};
