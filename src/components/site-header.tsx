import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/logo";
import { useI18n } from "@/lib/i18n";
import { BOOKING_URL } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onPhoto = overHero && !scrolled && !open;
  const links = [
    { href: "/#sobre", label: t.nav.about, hash: true },
    { href: "/galeria", label: t.nav.work, hash: false },
    { href: "/#faq", label: t.nav.faq, hash: true },
  ] as const;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[var(--ease-out-soft)]",
        onPhoto
          ? "bg-transparent"
          : "bg-paper/90 shadow-[0_1px_0_rgb(28_24_20/0.08)] backdrop-blur-md",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
      >
        {t.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <Wordmark onPhoto={onPhoto} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) =>
            l.hash ? (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "kicker no-underline transition-opacity duration-200 hover:opacity-70",
                  onPhoto ? "text-on-photo" : "text-ink",
                )}
              >
                {l.label}
              </a>
            ) : (
              <a
                key={l.href}
                href="/galeria"
                className={cn(
                  "kicker no-underline transition-opacity duration-200 hover:opacity-70",
                  onPhoto ? "text-on-photo" : "text-ink",
                  pathname === "/galeria" && "opacity-100",
                )}
              >
                {l.label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "hidden items-center gap-1 text-kicker font-medium tracking-kicker uppercase sm:flex",
              onPhoto ? "text-on-photo/80" : "text-muted",
            )}
            role="group"
            aria-label={t.langLabel}
          >
            <button
              type="button"
              onClick={() => setLang("es")}
              className={cn(
                "px-1.5 py-1 transition-opacity duration-150",
                lang === "es"
                  ? onPhoto
                    ? "text-on-photo"
                    : "text-ink"
                  : "opacity-50 hover:opacity-80",
              )}
            >
              ES
            </button>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "px-1.5 py-1 transition-opacity duration-150",
                lang === "en"
                  ? onPhoto
                    ? "text-on-photo"
                    : "text-ink"
                  : "opacity-50 hover:opacity-80",
              )}
            >
              EN
            </button>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden h-10 items-center rounded-full px-4 text-kicker font-medium tracking-kicker uppercase no-underline transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.96] sm:inline-flex",
              onPhoto
                ? "bg-on-photo text-ink hover:bg-foam"
                : "bg-ink text-on-photo hover:bg-ink-soft",
            )}
          >
            {t.nav.book}
          </a>
          <button
            type="button"
            className={cn(
              "grid size-11 place-items-center md:hidden",
              onPhoto ? "text-on-photo" : "text-ink",
            )}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-paper px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) =>
              l.hash ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center font-display text-2xl text-ink no-underline"
                >
                  {l.label}
                </a>
              ) : (
                <a
                  key={l.href}
                  href="/galeria"
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center font-display text-2xl text-ink no-underline"
                >
                  {l.label}
                </a>
              ),
            )}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-12 items-center justify-center rounded-full bg-ink text-kicker font-medium tracking-kicker uppercase text-on-photo no-underline"
            >
              {t.nav.book}
            </a>
            <div className="mt-4 flex gap-4 text-kicker font-medium tracking-kicker uppercase text-muted">
              <button
                type="button"
                onClick={() => setLang("es")}
                className={lang === "es" ? "text-ink" : ""}
              >
                Español
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={lang === "en" ? "text-ink" : ""}
              >
                English
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
