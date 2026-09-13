import {
  BOOKING_URL,
  INSTAGRAM_URL,
  copy,
  featuredWorks,
  type Lang,
} from "./content";

export const SITE_URL = "https://goodnina.com";
export const SITE_NAME = "Nina Romero";
export const LEGAL_NAME = "Jaline Romero Heredia";
export const LOCALITY = "Albuquerque";
export const REGION = "NM";
export const COUNTRY = "US";

export type SeoPage = "home" | "gallery" | "legal" | "privacy";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return new URL(path, SITE_URL).href;
}

export function seoFor(
  page: SeoPage,
  lang: Lang,
): { title: string; description: string; ogAlt: string; path: string } {
  const t = copy[lang];
  switch (page) {
    case "gallery":
      return {
        title: t.gallery.metaTitle,
        description: t.gallery.metaDescription,
        ogAlt: t.ogAlt,
        path: "/galeria",
      };
    case "legal":
      return {
        title: t.legal.metaTitle,
        description: t.legal.metaDescription,
        ogAlt: t.ogAlt,
        path: "/aviso",
      };
    case "privacy":
      return {
        title: t.privacy.metaTitle,
        description: t.privacy.metaDescription,
        ogAlt: t.ogAlt,
        path: "/privacidad",
      };
    default:
      return {
        title: t.metaTitle,
        description: t.metaDescription,
        ogAlt: t.ogAlt,
        path: "/",
      };
  }
}

export function jsonLdForPage(page: SeoPage, lang: Lang = "en") {
  const t = copy[lang];
  const seo = seoFor(page, lang);
  const inLanguage = lang === "es" ? "es-US" : "en-US";

  const person = {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: SITE_NAME,
    alternateName: [LEGAL_NAME, "goodnina", "goodnina_tattooing"],
    jobTitle: lang === "es" ? "Tatuadora" : "Tattoo artist",
    description: seo.description,
    url: SITE_URL,
    image: absoluteUrl("/images/nina-profile.jpg"),
    nationality: "CU",
    knowsLanguage: ["en", "es"],
    knowsAbout: [
      "Fine line tattoo",
      "Floral tattoo",
      "Ornamental tattoo",
      "Lettering tattoo",
      "Mandala tattoo",
    ],
    sameAs: [INSTAGRAM_URL],
    workLocation: {
      "@type": "Place",
      name: `${LOCALITY}, New Mexico`,
      address: {
        "@type": "PostalAddress",
        addressLocality: LOCALITY,
        addressRegion: REGION,
        addressCountry: COUNTRY,
      },
    },
  };

  const parlor = {
    "@type": "TattooParlor",
    "@id": absoluteUrl("/#studio"),
    name: SITE_NAME,
    alternateName: "goodnina tattooing",
    url: SITE_URL,
    image: [absoluteUrl("/og.jpg"), absoluteUrl("/images/hero.jpg")],
    description: t.metaDescription,
    inLanguage,
    employee: { "@id": absoluteUrl("/#person") },
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressRegion: REGION,
      addressCountry: COUNTRY,
    },
    areaServed: {
      "@type": "City",
      name: LOCALITY,
      containedInPlace: {
        "@type": "State",
        name: "New Mexico",
      },
    },
    sameAs: [INSTAGRAM_URL],
    knowsAbout: [
      "Fine line tattoo",
      "Floral tattoo",
      "Ornamental tattoo",
      "Lettering tattoo",
    ],
    potentialAction: {
      "@type": "ReserveAction",
      name: t.book.cta,
      target: BOOKING_URL,
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE_URL,
    name: SITE_NAME,
    description: t.metaDescription,
    inLanguage: ["en-US", "es-US"],
    publisher: { "@id": absoluteUrl("/#person") },
  };

  const crumbs = [{ name: SITE_NAME, path: "/" }];
  if (page === "gallery") crumbs.push({ name: t.gallery.pageTitle, path: "/galeria" });
  if (page === "legal") crumbs.push({ name: t.legal.title, path: "/aviso" });
  if (page === "privacy") crumbs.push({ name: t.privacy.title, path: "/privacidad" });

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };

  const graph: Record<string, unknown>[] = [website, person, parlor, breadcrumb];

  if (page === "home") {
    graph.push({
      "@type": "FAQPage",
      "@id": absoluteUrl("/#faq-schema"),
      mainEntity: t.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  if (page === "gallery") {
    graph.push({
      "@type": "CollectionPage",
      "@id": absoluteUrl("/galeria#gallery"),
      name: t.gallery.pageTitle,
      description: t.gallery.metaDescription,
      url: absoluteUrl("/galeria"),
      inLanguage,
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: { "@id": absoluteUrl("/#person") },
      image: featuredWorks.map((w) => absoluteUrl(w.src)),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
