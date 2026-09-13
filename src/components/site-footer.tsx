import { useI18n } from "@/lib/i18n";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";
import { Wordmark } from "@/components/logo";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Wordmark />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            {t.footer.credit}
          </p>
          <address className="kicker not-italic">{t.footer.location}</address>
        </div>
        <nav
          className="flex flex-col items-start gap-3 md:items-end"
          aria-label="Footer"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl italic text-ink no-underline transition-opacity duration-200 hover:opacity-60"
          >
            {INSTAGRAM_HANDLE}
          </a>
          <div className="flex flex-wrap gap-5 text-sm text-muted">
            <a
              href="/galeria"
              className="text-muted no-underline hover:text-ink"
            >
              {t.footer.work}
            </a>
            <a
              href="/#agendar"
              className="text-muted no-underline hover:text-ink"
            >
              {t.footer.book}
            </a>
            <a
              href="/privacidad"
              className="text-muted no-underline hover:text-ink"
            >
              {t.footer.privacy}
            </a>
            <a href="/aviso" className="text-muted no-underline hover:text-ink">
              {t.footer.legal}
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
