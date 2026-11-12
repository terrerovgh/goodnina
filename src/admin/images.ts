import { LIMITS, type ImageKind } from "../lib/schema";
import { h } from "./dom";
import { key, state } from "./store";

const MAX_SIDE = 1600;

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Shrink a photo to at most 1600 px on its long side and re-encode it as JPEG,
 * so phone originals of many megabytes never reach the repository.
 */
export async function toJpeg(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`No se pudo leer "${file.name}". Prueba con una foto JPG o PNG.`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Este navegador no puede preparar la foto.");
  ctx.fillStyle = "#fff"; // transparent PNGs would otherwise turn black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  for (const quality of [0.86, 0.75, 0.6]) {
    const blob = await encode(canvas, quality);
    if (blob && blob.size <= LIMITS.imageBytes) return blob;
  }
  throw new Error(`"${file.name}" es demasiado grande incluso después de reducirla.`);
}

/**
 * Thumbnail for a photo: the local preview if it was uploaded in this session,
 * else the deployed WebP, else the original straight from the repository
 * (published but not deployed yet).
 */
export function thumb(kind: ImageKind, id: string, alt: string, cls = ""): HTMLImageElement {
  const local = state.previews.get(key(kind, id));
  const img = h("img", {
    class: cls,
    alt,
    loading: "lazy",
    decoding: "async",
    draggable: false,
    src: local ?? `/images/opt/${kind}/${id}-480.webp`,
  });
  if (!local) {
    img.addEventListener(
      "error",
      () => {
        img.src = `/api/admin/image?kind=${kind}&id=${encodeURIComponent(id)}`;
      },
      { once: true },
    );
  }
  return img;
}
