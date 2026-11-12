import galleryData from "../data/gallery.json";
import newsData from "../data/news.json";
import textsData from "../data/texts.json";
import {
  localize,
  parseGallery,
  parseNews,
  parseTexts,
  type Lang,
  type Work,
} from "./schema";

export type { Category, Lang, NewsItem, Work } from "./schema";

export const BOOKING_URL = "https://venue.ink/@goodnina_tattooing";
export const INSTAGRAM_URL = "https://www.instagram.com/goodnina_tattooing/";
export const INSTAGRAM_HANDLE = "@goodnina_tattooing";

/*
 * Editable content lives in src/data/*.json and is written by the admin panel
 * (/admin). Parsing here makes a malformed file fail the build with a clear
 * message instead of shipping a broken page.
 */
const gallery = parseGallery(galleryData);
const texts = parseTexts(textsData);

/** Full gallery, in mosaic order. */
export const works: Work[] = gallery.works;

/** Homepage strip, in order. Full set lives in /galeria. */
export const coverIds: string[] = gallery.cover;

export const featuredWorks: Work[] = coverIds
  .map((id) => works.find((w) => w.id === id))
  .filter((w): w is Work => Boolean(w));

/** Every announcement, in panel order; News.astro decides which are shown. */
export const news = parseNews(newsData).items;

/* Text that stays in code: SEO, navigation, labels, legal. */
const fixed = {
  es: {
    metaTitle: "Nina Romero | Tatuadora fine line en Albuquerque, NM",
    metaDescription:
      "Tatuajes fine line, florales y ornamentales a medida, por Nina Romero — tatuadora cubana en Albuquerque, Nuevo México. Mira el trabajo y agenda por Venue.",
    ogAlt:
      "Nina Romero, tatuadora fine line en Albuquerque, entre flores, con corona de margaritas y crisantemos.",
    skip: "Saltar al contenido",
    nav: {
      work: "Galería",
      about: "Sobre",
      faq: "Preguntas",
      book: "Agendar",
    },
    langLabel: "Idioma",
    introImages: {
      lotus: "Un loto ornamental con volutas de paisley recorriendo el antebrazo.",
      mandala:
        "Mandala ornamental con un ojo al centro y geometría bajando hacia la mano.",
    },
    news: {
      title: "Novedades",
      more: "Más información",
    },
    gallery: {
      title: "Galería",
      pageTitle: "Galería de tatuajes",
      metaTitle: "Galería de tatuajes | Fine line y floral — Nina Romero",
      metaDescription:
        "Tatuajes fine line, florales, ornamentales y lettering de Nina Romero en Albuquerque, NM. Piezas curadas y recientes. Agenda una sesión por Venue.",
      hint: "Desliza hacia el lado.",
      lede: "Piezas curadas y recientes: floral, ornamental, lettering y fine line. Toca una para verla de cerca.",
      all: "Ver todo",
      filterAll: "Todas",
      filters: {
        floral: "Floral",
        ornamental: "Ornamental",
        lettering: "Lettering",
        fineline: "Fine line",
      },
      empty: "No hay piezas en esta categoría todavía.",
      close: "Cerrar",
      prev: "Anterior",
      next: "Siguiente",
    },
    bookInstagram: "Instagram",
    footer: {
      location: "Albuquerque, New Mexico",
      legal: "Aviso legal",
      privacy: "Privacidad",
      credit:
        "Nina Romero — tatuadora cubana en Albuquerque. Fine line, floral y ornamental.",
      work: "Galería",
      book: "Agendar",
    },
    privacy: {
      title: "Privacidad",
      metaTitle: "Privacidad | Nina Romero",
      metaDescription:
        "Cómo trata este portafolio los datos: sin formularios en el servidor; las citas se reservan en Venue e Instagram.",
      body: "Este sitio es un portafolio. No guarda formularios ni datos personales en este servidor. Las citas se reservan en Venue; Instagram y Venue tienen sus propias políticas. No se necesitan cookies de seguimiento para ver el sitio.",
    },
    legal: {
      title: "Aviso legal",
      metaTitle: "Aviso legal | Nina Romero",
      metaDescription:
        "Aviso legal del portafolio de Nina Romero (Jaline Romero Heredia), tatuadora en Albuquerque, Nuevo México.",
      body: "Artista: Nina Romero (Jaline Romero Heredia). Albuquerque, Nuevo México, EE. UU. Este sitio web es un portafolio de tatuaje fine line, floral y ornamental. Instagram @goodnina_tattooing.",
    },
  },
  en: {
    metaTitle: "Nina Romero | Fine Line Tattoo Artist in Albuquerque, NM",
    metaDescription:
      "Custom fine line, floral, and ornamental tattoos by Nina Romero — Cuban tattoo artist in Albuquerque, New Mexico. View the work and book a session on Venue.",
    ogAlt:
      "Nina Romero, fine line tattoo artist in Albuquerque, among daisies and chrysanthemums.",
    skip: "Skip to content",
    nav: {
      work: "Gallery",
      about: "About",
      faq: "FAQ",
      book: "Book",
    },
    langLabel: "Language",
    introImages: {
      lotus: "An ornamental lotus with paisley scrolls running the forearm.",
      mandala:
        "An ornamental mandala with an eye at the center, geometry running to the hand.",
    },
    news: {
      title: "News",
      more: "More info",
    },
    gallery: {
      title: "Gallery",
      pageTitle: "Tattoo gallery",
      metaTitle: "Tattoo Gallery | Fine Line & Floral — Nina Romero",
      metaDescription:
        "Custom fine line, floral, ornamental, and lettering tattoos by Nina Romero in Albuquerque, NM. Healed and fresh work — book a session on Venue.",
      hint: "Slide sideways.",
      lede: "Healed and fresh tattoos — floral, ornamental, lettering, and fine line. Tap a piece to look closer.",
      all: "See all",
      filterAll: "All",
      filters: {
        floral: "Floral",
        ornamental: "Ornamental",
        lettering: "Lettering",
        fineline: "Fine line",
      },
      empty: "Nothing in this category yet.",
      close: "Close",
      prev: "Previous",
      next: "Next",
    },
    bookInstagram: "Instagram",
    footer: {
      location: "Albuquerque, New Mexico",
      legal: "Legal",
      privacy: "Privacy",
      credit:
        "Nina Romero — Cuban tattoo artist in Albuquerque. Fine line, floral & ornamental.",
      work: "Gallery",
      book: "Book",
    },
    privacy: {
      title: "Privacy",
      metaTitle: "Privacy | Nina Romero",
      metaDescription:
        "How this portfolio handles data: no forms stored here; booking happens on Venue and Instagram.",
      body: "This site is a portfolio. It does not store forms or personal data on this server. Booking happens on Venue; Instagram and Venue have their own policies. No tracking cookies are required to view the site.",
    },
    legal: {
      title: "Legal",
      metaTitle: "Legal | Nina Romero",
      metaDescription:
        "Legal notice for Nina Romero (Jaline Romero Heredia), tattoo artist in Albuquerque, New Mexico.",
      body: "Artist: Nina Romero (Jaline Romero Heredia). Albuquerque, New Mexico, USA. This website is a portfolio of fine line, floral, and ornamental tattooing. Instagram @goodnina_tattooing.",
    },
  },
} as const;

function copyFor(lang: Lang) {
  const { bookInstagram, ...rest } = fixed[lang];
  const edited = localize(texts, lang);
  return {
    ...rest,
    ...edited,
    book: { ...edited.book, instagram: bookInstagram },
  };
}

export const copy = { es: copyFor("es"), en: copyFor("en") };

export type Copy = (typeof copy)[Lang];
