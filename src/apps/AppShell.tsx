import { useEffect, type ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { seoFor, type SeoPage } from "@/lib/seo";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  const el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${name}"]`,
  );
  if (el) el.setAttribute("content", content);
}

function TitleSync({ page }: { page: SeoPage }) {
  const { lang } = useI18n();
  const seo = seoFor(page, lang);
  useEffect(() => {
    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:locale", lang === "es" ? "es_US" : "en_US", "property");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
  }, [seo.title, seo.description, lang]);
  return null;
}

export function AppShell({
  children,
  overHero = false,
  page = "home",
}: {
  children: ReactNode;
  overHero?: boolean;
  page?: SeoPage;
}) {
  return (
    <I18nProvider>
      <TitleSync page={page} />
      <div className="min-h-svh bg-paper">
        <SiteHeader overHero={overHero} />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}
