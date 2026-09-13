import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-svh overflow-hidden bg-ink">
      <img
        src="/images/hero.jpg"
        alt="Nina Romero entre margaritas y crisantemos"
        className="hero-photo absolute inset-0 h-full w-full object-cover outline-none"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/20"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-svh flex-col justify-end px-5 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-16">
        <p className="kicker text-on-photo/80">{t.hero.kicker}</p>
        <h1 className="mt-3 max-w-5xl font-display text-display font-medium leading-display tracking-tight text-on-photo italic">
          {t.hero.title}
        </h1>
        <p className="mt-5 font-sans text-sm font-medium tracking-kicker text-on-photo/85 uppercase sm:text-base">
          {t.hero.lede}
        </p>
      </div>
    </section>
  );
}
