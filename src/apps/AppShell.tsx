import { useEffect, type ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function TitleSync({ title }: { title?: string }) {
  const { t } = useI18n();
  useEffect(() => {
    document.title = title ?? t.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.metaDescription);
  }, [t, title]);
  return null;
}

export function AppShell({
  children,
  overHero = false,
  title,
}: {
  children: ReactNode;
  overHero?: boolean;
  title?: string;
}) {
  return (
    <I18nProvider>
      <TitleSync title={title} />
      <div className="min-h-svh bg-paper">
        <SiteHeader overHero={overHero} />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}
