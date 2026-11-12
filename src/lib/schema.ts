/**
 * Shape and validation of the editable content in src/data/*.json.
 * Shared by the site build, the admin panel and the Pages Functions,
 * so it must stay free of imports and of DOM or Node APIs.
 */

export type Lang = "es" | "en";
export type Bi = { es: string; en: string };

export const CATEGORIES = ["floral", "ornamental", "lettering", "fineline"] as const;
export type Category = (typeof CATEGORIES)[number];

export const OBJECTS = ["left", "center", "top"] as const;
export type ObjectPosition = (typeof OBJECTS)[number];

export type Work = {
  id: string;
  category: Category;
  wide?: boolean;
  object?: ObjectPosition;
  alt: Bi;
};

export type Gallery = { works: Work[]; cover: string[] };

export type NewsItem = {
  id: string;
  /** True when public/images/news/<id>.jpg exists. */
  image?: boolean;
  title: Bi;
  body: Bi;
  /** Date shown on the card, YYYY-MM-DD. */
  date?: string;
  /** Last day the card is shown, YYYY-MM-DD. */
  expires?: string;
  url?: string;
  cta?: Bi;
  hidden?: boolean;
};

export type News = { items: NewsItem[] };

export type IntroImage = { id: string; alt: Bi };

export type Texts = {
  hero: { kicker: Bi; title: Bi; lede: Bi };
  /** images[0] is the large photo, images[1] the small one over it. */
  intro: { title: Bi; p1: Bi; p2: Bi; images: IntroImage[] };
  styles: { title: Bi; items: { name: Bi; body: Bi }[] };
  quote: Bi;
  faq: { title: Bi; items: { q: Bi; a: Bi }[] };
  book: { title: Bi; body: Bi; cta: Bi };
};

export type Content = { gallery: Gallery; texts: Texts; news: News };

export const LIMITS = {
  works: 300,
  cover: 24,
  news: 30,
  faq: 30,
  styles: 4,
  introImages: 2,
  short: 140,
  alt: 300,
  long: 1500,
  url: 500,
  imageBytes: 3 * 1024 * 1024,
  imagesPerPublish: 24,
} as const;

export const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Message is in Spanish because the admin panel shows it as is. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function fail(path: string, problem: string): never {
  throw new ValidationError(`${path}: ${problem}`);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function record(v: unknown, path: string): Record<string, unknown> {
  if (!isRecord(v)) fail(path, "falta o no es válido");
  return v;
}

function list(v: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(v)) fail(path, "debe ser una lista");
  if (v.length > max) fail(path, `admite como máximo ${max} elementos`);
  return v;
}

function text(v: unknown): string {
  if (typeof v !== "string") return "";
  // Collapse stray control characters; keep ordinary spaces.
  return v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

/** Both languages, each falling back to the other; at least one is required. */
function bi(v: unknown, path: string, max: number): Bi {
  const r = isRecord(v) ? v : {};
  const es = text(r.es);
  const en = text(r.en);
  if (!es && !en) fail(path, "escribe el texto en al menos un idioma");
  const out = { es: es || en, en: en || es };
  if (out.es.length > max || out.en.length > max) {
    fail(path, `no puede pasar de ${max} caracteres`);
  }
  return out;
}

function optionalBi(v: unknown, path: string, max: number): Bi | undefined {
  const r = isRecord(v) ? v : {};
  if (!text(r.es) && !text(r.en)) return undefined;
  return bi(v, path, max);
}

function id(v: unknown, path: string): string {
  if (typeof v !== "string" || v.length > 80 || !ID_RE.test(v)) {
    fail(path, "identificador no válido");
  }
  return v;
}

function date(v: unknown, path: string): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string" || !DATE_RE.test(v) || Number.isNaN(Date.parse(v))) {
    fail(path, "la fecha no es válida");
  }
  return v;
}

function httpsUrl(v: unknown, path: string): string | undefined {
  const s = text(v);
  if (!s) return undefined;
  if (s.length > LIMITS.url) fail(path, "el enlace es demasiado largo");
  let parsed: URL;
  try {
    parsed = new URL(s);
  } catch {
    fail(path, "el enlace no es válido; debe empezar por https://");
  }
  if (parsed.protocol !== "https:") fail(path, "el enlace debe empezar por https://");
  return parsed.href;
}

export function parseGallery(input: unknown): Gallery {
  const root = record(input, "Galería");
  const seen = new Set<string>();
  const works = list(root.works, "Galería", LIMITS.works).map((raw, i) => {
    const path = `Galería, foto ${i + 1}`;
    const r = record(raw, path);
    // Key order is the order the JSON file is written in; keep it stable.
    const work: Work = {
      id: id(r.id, path),
      category: CATEGORIES.includes(r.category as Category)
        ? (r.category as Category)
        : fail(path, "elige una categoría"),
    } as Work;
    if (seen.has(work.id)) fail(path, "hay dos fotos con el mismo identificador");
    seen.add(work.id);
    if (r.wide === true) work.wide = true;
    if (r.object !== undefined && r.object !== null && r.object !== "center") {
      if (!OBJECTS.includes(r.object as ObjectPosition)) fail(path, "encuadre no válido");
      work.object = r.object as ObjectPosition;
    }
    work.alt = bi(r.alt, `${path}, descripción`, LIMITS.alt);
    return work;
  });
  const cover: string[] = [];
  for (const raw of list(root.cover, "Portada", LIMITS.cover)) {
    // A cover entry whose work was removed is dropped rather than rejected.
    if (typeof raw === "string" && seen.has(raw) && !cover.includes(raw)) cover.push(raw);
  }
  return { works, cover };
}

export function parseTexts(input: unknown): Texts {
  const root = record(input, "Textos");
  const hero = record(root.hero, "Portada");
  const intro = record(root.intro, "Sobre mí");
  const styles = record(root.styles, "Estilos");
  const faq = record(root.faq, "Preguntas");
  const book = record(root.book, "Agendar");

  const introImages = list(intro.images, "Sobre mí, fotos", LIMITS.introImages);
  if (introImages.length !== LIMITS.introImages) {
    fail("Sobre mí, fotos", `deben ser exactamente ${LIMITS.introImages}`);
  }

  const styleItems = list(styles.items, "Estilos", LIMITS.styles);
  if (styleItems.length !== LIMITS.styles) {
    fail("Estilos", `deben ser exactamente ${LIMITS.styles}`);
  }

  return {
    hero: {
      kicker: bi(hero.kicker, "Portada, línea superior", LIMITS.short),
      title: bi(hero.title, "Portada, título", LIMITS.short),
      lede: bi(hero.lede, "Portada, línea inferior", LIMITS.short),
    },
    intro: {
      title: bi(intro.title, "Sobre mí, título", LIMITS.short),
      p1: bi(intro.p1, "Sobre mí, primer párrafo", LIMITS.long),
      p2: bi(intro.p2, "Sobre mí, segundo párrafo", LIMITS.long),
      images: introImages.map((raw, i) => {
        const path = `Sobre mí, foto ${i + 1}`;
        const r = record(raw, path);
        return { id: id(r.id, path), alt: bi(r.alt, `${path}, descripción`, LIMITS.alt) };
      }),
    },
    styles: {
      title: bi(styles.title, "Estilos, título", LIMITS.short),
      items: styleItems.map((raw, i) => {
        const path = `Estilos, ${i + 1}`;
        const r = record(raw, path);
        return {
          name: bi(r.name, `${path}, nombre`, LIMITS.short),
          body: bi(r.body, `${path}, texto`, LIMITS.long),
        };
      }),
    },
    quote: bi(root.quote, "Cita", LIMITS.long),
    faq: {
      title: bi(faq.title, "Preguntas, título", LIMITS.short),
      items: list(faq.items, "Preguntas", LIMITS.faq).map((raw, i) => {
        const path = `Pregunta ${i + 1}`;
        const r = record(raw, path);
        return {
          q: bi(r.q, `${path}, pregunta`, LIMITS.alt),
          a: bi(r.a, `${path}, respuesta`, LIMITS.long),
        };
      }),
    },
    book: {
      title: bi(book.title, "Agendar, título", LIMITS.short),
      body: bi(book.body, "Agendar, texto", LIMITS.long),
      cta: bi(book.cta, "Agendar, botón", LIMITS.short),
    },
  };
}

export function parseNews(input: unknown): News {
  const root = record(input, "Novedades");
  const seen = new Set<string>();
  const items = list(root.items, "Novedades", LIMITS.news).map((raw, i) => {
    const path = `Novedad ${i + 1}`;
    const r = record(raw, path);
    const item: NewsItem = {
      id: id(r.id, path),
      title: bi(r.title, `${path}, título`, LIMITS.short),
      body: bi(r.body, `${path}, texto`, LIMITS.long),
    };
    if (seen.has(item.id)) fail(path, "hay dos novedades con el mismo identificador");
    seen.add(item.id);
    if (r.image === true) item.image = true;
    const shown = date(r.date, `${path}, fecha`);
    if (shown) item.date = shown;
    const expires = date(r.expires, `${path}, ocultar después de`);
    if (expires) item.expires = expires;
    const url = httpsUrl(r.url, `${path}, enlace`);
    if (url) {
      item.url = url;
      const cta = optionalBi(r.cta, `${path}, texto del enlace`, LIMITS.short);
      if (cta) item.cta = cta;
    }
    if (r.hidden === true) item.hidden = true;
    return item;
  });
  return { items };
}

export function parseContent(input: unknown): Content {
  const root = record(input, "Contenido");
  return {
    gallery: parseGallery(root.gallery),
    texts: parseTexts(root.texts),
    news: parseNews(root.news),
  };
}

function isBi(v: unknown): v is Bi {
  if (!isRecord(v)) return false;
  const keys = Object.keys(v);
  return keys.length === 2 && typeof v.es === "string" && typeof v.en === "string";
}

export type Localized<T> = T extends Bi
  ? string
  : T extends (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

/** Replace every `{ es, en }` leaf with the string for one language. */
export function localize<T>(node: T, lang: Lang): Localized<T> {
  if (isBi(node)) return node[lang] as Localized<T>;
  if (Array.isArray(node)) return node.map((n) => localize(n, lang)) as Localized<T>;
  if (isRecord(node)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = localize(v, lang);
    return out as Localized<T>;
  }
  return node as Localized<T>;
}

/** True while a news item should be on the site. `today` is YYYY-MM-DD. */
export function isNewsVisible(item: NewsItem, today: string): boolean {
  return !item.hidden && (!item.expires || item.expires >= today);
}

/** File-name-safe id from free text, e.g. "Lirios en el hombro" → "lirios-en-el-hombro". */
export function slugify(input: string, maxWords = 5): string {
  const words = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, maxWords);
  return words.join("-").slice(0, 60).replace(/-+$/, "");
}

/** `base`, or `base-2`, `base-3`… when the id is already taken. */
export function uniqueId(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const root = base || "foto";
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export const IMAGE_DIRS = {
  gallery: "public/images/gallery",
  news: "public/images/news",
  intro: "public/images/intro",
} as const;
export const IMAGE_KINDS = Object.keys(IMAGE_DIRS) as ImageKind[];
export type ImageKind = keyof typeof IMAGE_DIRS;

/** Folder of the generated WebP sizes, public/images/opt/<kind>. */
export function optDir(kind: ImageKind): string {
  return `public/images/opt/${kind}`;
}

/** Ids whose photo the content refers to, per kind. */
export function referencedImages(content: Content): Record<ImageKind, Set<string>> {
  return {
    gallery: new Set(content.gallery.works.map((w) => w.id)),
    news: new Set(content.news.items.filter((n) => n.image).map((n) => n.id)),
    intro: new Set(content.texts.intro.images.map((img) => img.id)),
  };
}

export function imagePath(kind: ImageKind, imageId: string): string {
  return `${IMAGE_DIRS[kind]}/${imageId}.jpg`;
}

export const DATA_FILES = {
  gallery: "src/data/gallery.json",
  texts: "src/data/texts.json",
  news: "src/data/news.json",
} as const;

/** The exact bytes a data file is stored as, so unchanged content diffs clean. */
export function serialize(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
