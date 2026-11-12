// Generates the WebP sizes the site serves from the originals the admin panel
// commits: public/images/<kind>/<id>.jpg → public/images/opt/<kind>/<id>-<w>.webp
//
// Only missing files are written, so the derivatives already in git are left
// alone and the ones for newer photos are plain build output (see .gitignore).
import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KINDS = ["gallery", "news", "intro"];
const WIDTHS = [480, 960];
const QUALITY = 72;

let written = 0;

for (const kind of KINDS) {
  const srcDir = path.join(root, "public/images", kind);
  const outDir = path.join(root, "public/images/opt", kind);
  if (!existsSync(srcDir)) continue;
  await mkdir(outDir, { recursive: true });

  for (const file of (await readdir(srcDir)).sort()) {
    if (!file.endsWith(".jpg")) continue;
    const id = file.slice(0, -".jpg".length);
    for (const width of WIDTHS) {
      const out = path.join(outDir, `${id}-${width}.webp`);
      if (existsSync(out)) continue;
      await sharp(path.join(srcDir, file))
        .rotate() // apply EXIF orientation before the metadata is dropped
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(out);
      written += 1;
      console.log(`images: ${path.relative(root, out)}`);
    }
  }
}

console.log(written ? `images: ${written} generated` : "images: up to date");
