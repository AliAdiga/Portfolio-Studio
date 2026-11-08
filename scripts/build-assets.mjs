// Converts raw captures in shots/ into optimized WebP in public/work/.
// Run: node scripts/build-assets.mjs  (raw captures are not committed)
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const map = [
  // [source, destination, width]
  ["dar-home-d", "dar/home-desktop", 1600],
  ["dar-home-m", "dar/home-mobile", 780],
  ["dar-explorer-d", "dar/explorer-desktop", 1600],
  ["dar-explorer-m", "dar/explorer-mobile", 780],
  ["aurelle-home-d", "aurelle/home-desktop", 1600],
  ["aurelle-home-m", "aurelle/home-mobile", 780],
  ["aurelle-women-d", "aurelle/women-desktop", 1600],
  ["aurelle-women-m", "aurelle/women-mobile", 780],
  ["caucasus-home-d", "caucasus/home-desktop", 1600],
  ["caucasus-home-m", "caucasus/home-mobile", 780],
  ["caucasus-menu-d", "caucasus/menu-desktop", 1600],
  ["caucasus-menu-m", "caucasus/menu-mobile", 780],
  ["zaytoun-app-home-d", "zaytoun/app-home-desktop", 1600],
  ["zaytoun-app-home-m", "zaytoun/app-home-mobile", 780],
  ["zaytoun-app-menu-d", "zaytoun/app-menu-desktop", 1600],
  ["zaytoun-app-menu-m", "zaytoun/app-menu-mobile", 780],
  ["zaytoun-app-reserve-d", "zaytoun/app-reserve-desktop", 1600],
  ["zaytoun-app-reserve-m", "zaytoun/app-reserve-mobile", 780],
];
for (const [src, dest, w] of map) {
  mkdirSync(`public/work/${dest.split("/")[0]}`, { recursive: true });
  const info = await sharp(`shots/${src}.png`)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/work/${dest}.webp`);
  console.log(dest, info.width, info.height, Math.round(info.size / 1024) + "KB");
}
