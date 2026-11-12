/**
 * Turns "the content the panel wants" into the list of file changes for one
 * commit. Pure: no network, so it can be reasoned about and tested on its own.
 */
import {
  DATA_FILES,
  IMAGE_DIRS,
  IMAGE_KINDS,
  LIMITS,
  ValidationError,
  imagePath,
  optDir,
  referencedImages,
  serialize,
  type Content,
  type ImageKind,
} from "../lib/schema";
import type { Change } from "./github";

export type Upload = { kind: ImageKind; id: string; bytes: Uint8Array };

/** What the repository holds right now, at the commit being built on. */
export type Current = {
  files: Record<keyof typeof DATA_FILES, string | null>;
  /** File names in public/images/<kind> and public/images/opt/<kind>. */
  originals: Record<ImageKind, string[]>;
  derived: Record<ImageKind, string[]>;
};

export type PendingChange = Change | { path: string; upload: Upload };

export type Plan = { changes: PendingChange[]; message: string };

const DERIVED_RE = /^(.+)-(?:480|960)\.webp$/;

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

export function planPublish(next: Content, uploads: Upload[], current: Current): Plan {
  const wanted = referencedImages(next);
  const existing = Object.fromEntries(
    IMAGE_KINDS.map((kind) => [kind, new Set(current.originals[kind])]),
  ) as Record<ImageKind, Set<string>>;

  if (uploads.length > LIMITS.imagesPerPublish) {
    throw new ValidationError(
      `Son demasiadas fotos nuevas de una vez (máximo ${LIMITS.imagesPerPublish}). Publica en dos tandas.`,
    );
  }

  const changes: PendingChange[] = [];
  const uploaded = Object.fromEntries(
    IMAGE_KINDS.map((kind) => [kind, new Set<string>()]),
  ) as Record<ImageKind, Set<string>>;

  for (const up of uploads) {
    // An upload for something no longer in the content is simply not needed.
    if (!wanted[up.kind].has(up.id)) continue;
    if (existing[up.kind].has(`${up.id}.jpg`) || uploaded[up.kind].has(up.id)) {
      throw new ValidationError(`Ya existe una foto con el nombre "${up.id}".`);
    }
    if (!isJpeg(up.bytes)) {
      throw new ValidationError(`La foto "${up.id}" no es un JPEG válido.`);
    }
    if (up.bytes.length > LIMITS.imageBytes) {
      throw new ValidationError(`La foto "${up.id}" pesa demasiado.`);
    }
    uploaded[up.kind].add(up.id);
    changes.push({ path: imagePath(up.kind, up.id), upload: up });
  }

  // Every referenced photo must be in the repository or in this publish.
  for (const kind of IMAGE_KINDS) {
    for (const id of wanted[kind]) {
      if (!existing[kind].has(`${id}.jpg`) && !uploaded[kind].has(id)) {
        throw new ValidationError(
          `Falta la foto de "${id}". Vuelve a subirla e inténtalo de nuevo.`,
        );
      }
    }
  }

  // Remove the files of anything that is no longer referenced.
  let removed = 0;
  for (const kind of IMAGE_KINDS) {
    for (const name of current.originals[kind]) {
      if (!name.endsWith(".jpg")) continue;
      if (!wanted[kind].has(name.slice(0, -4))) {
        changes.push({ path: `${IMAGE_DIRS[kind]}/${name}`, delete: true });
        removed += 1;
      }
    }
    for (const name of current.derived[kind]) {
      const match = DERIVED_RE.exec(name);
      if (match && !wanted[kind].has(match[1])) {
        changes.push({ path: `${optDir(kind)}/${name}`, delete: true });
      }
    }
  }

  const touched: string[] = [];
  const labels = { gallery: "galería", texts: "textos", news: "novedades" } as const;
  for (const key of ["gallery", "texts", "news"] as const) {
    const content = serialize(next[key]);
    if (content !== current.files[key]) {
      changes.push({ path: DATA_FILES[key], content });
      touched.push(labels[key]);
    }
  }

  const added = IMAGE_KINDS.reduce((n, kind) => n + uploaded[kind].size, 0);
  const detail = [
    added ? `${added} foto${added === 1 ? "" : "s"} nueva${added === 1 ? "" : "s"}` : "",
    removed ? `${removed} eliminada${removed === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  const message =
    `Panel: actualiza ${touched.length ? touched.join(", ") : "imágenes"}` +
    (detail.length ? ` (${detail.join(", ")})` : "");

  return { changes, message };
}
