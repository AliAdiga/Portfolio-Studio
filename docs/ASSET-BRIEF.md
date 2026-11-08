# Asset brief for ChatGPT image generation

Scope: only the optional "interactive studio" feature needs generated art. Everything else on the site uses real screenshots, code-built frames and CSS. **Never bake text into these images**; labels are added in code. The studio section is not built yet because the artwork does not exist, and a rough substitute would weaken the rest of the site.

Decision on structure: **one image per time of day with interactive hotspots is enough** for version 1. Hotspots are absolutely positioned buttons over the image (percent coordinates), so no separate room layers are needed. Request layers only if you later want rooms to light up individually.

Shared palette for both files: ivory #F4EFE7, charcoal #24211F, plum #674350, muted olive #6A6042, warm oak and linen neutrals. No neon, no glass, no tech logos.

---

## 1. `studio-iso-day.png` (required)

| Field | Value |
|---|---|
| Placement and purpose | Studio section, below Process and above Contact. Shows a small creative workspace as a single isometric cutaway with three zones: Design, Development, Selected work. |
| Dimensions | 2400 x 1600 px, 3:2 |
| Composition | One isometric room cutaway (30 degree axes), three zones in a gentle L shape. Design zone: drafting table with paper layouts, swatch cards, a plant. Development zone: a desk with a laptop and a monitor showing an abstract blank screen (no readable text or UI), a lamp. Selected work zone: a wall of four framed blank panels of different proportions plus a low bench. Floor: pale oak boards with a plum rug. |
| Negative space | Keep the top 12 percent and the outer 6 percent on every side empty ivory so it can bleed into the page. Keep the centre of each zone clear of tall objects so hotspot pins never cover detail. |
| Palette and lighting | Palette above. Soft morning daylight from the upper left, long gentle shadows, warm 5200 K. |
| Transparency | Transparent background (PNG with alpha) around the cutaway, soft contact shadow baked in. |
| Desktop crop | Full image, centred, max width 1100 px in a 12 column grid. |
| Mobile crop | Square crop of the centre 2:3 of the room, or show the full image at 100 percent width and rely on the stacked room list (the simple mobile equivalent). |
| Variants | Yes: pair with `studio-iso-evening.png`, identical geometry. |

Prompt:
"Isometric cutaway illustration of a small creative design studio, three zones: a drafting table with paper layouts and swatch cards, a development desk with a laptop and a monitor with a blank abstract screen, and a gallery wall with four blank framed panels. Pale oak floor, deep plum rug, muted olive plant leaves, ivory walls, charcoal furniture accents. Soft morning daylight from the upper left, gentle long shadows, calm editorial mood, clean vector-like painterly rendering, subtle paper grain. No text, no letters, no logos, no readable screen content, no people, no neon, no glassmorphism. Transparent background around the cutaway, generous empty margin on all sides. 3:2, 2400x1600."

## 2. `studio-iso-evening.png` (required if you want the Asia/Amman day and evening theme)

| Field | Value |
|---|---|
| Placement and purpose | Same slot. Swapped in when local time in Asia/Amman is between about 18:00 and 06:00, with a manual toggle. |
| Dimensions | 2400 x 1600 px, 3:2 |
| Composition | **Identical geometry, objects and camera as the day image.** Only lighting changes. |
| Negative space | Same as day. |
| Palette and lighting | Same palette, but deep plum evening light, warm lamp pools on the desks, a small window glow, cooler shadows. |
| Transparency | Transparent background. |
| Crops | Same as day. |
| Variants | This is the variant. Generate it by editing the approved day image so the layout matches exactly. |

Prompt: "Using the attached approved image, keep every object, position and the camera exactly the same. Change only the lighting to evening: deep plum ambient light, warm lamp pools on the drafting table and desk, subtle glow from the framed panels, cooler soft shadows. Still no text, no logos, no readable screens. Keep the transparent background."

## 3. `og-background.png` (optional)

Only if you want a richer social share card than the current typographic one.

| Field | Value |
|---|---|
| Placement | Background layer behind the text in the social sharing image |
| Dimensions | 1200 x 630 px, about 1.9:1 |
| Composition | Abstract soft ivory paper texture with a faint plum diagonal light wash on the right third |
| Negative space | Keep the left 65 percent flat and quiet for text |
| Palette | Ivory and plum only |
| Transparency | None |
| Crops | Single crop |
| Variants | No |

Prompt: "Subtle abstract paper texture in warm ivory (#F4EFE7) with a very faint deep plum (#674350) diagonal wash entering from the right edge. Quiet, editorial, no objects, no text, 1200x630."

---

## Integration notes (when the files arrive)

1. Put the files in `public/studio/` and keep the names above.
2. Hotspot positions go in `content/studio.ts` as `{ id, label, x, y, target }` in percent. Targets: Design opens a short panel about the visual direction stage; Development opens a panel about careful implementation; Selected work scrolls to `#work`.
3. The evening swap uses `Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Amman" })` on the client, with a manual toggle and a `prefers-reduced-motion` safe crossfade.
