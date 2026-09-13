import { useI18n } from "@/lib/i18n";

export function QuoteBand() {
  const { t } = useI18n();
  return (
    <section className="bg-ink px-5 py-20 text-on-photo sm:px-8 sm:py-28">
      <blockquote className="mx-auto max-w-4xl">
        <p className="font-display text-section font-medium leading-snug tracking-tight italic text-on-photo">
          {t.quote}
        </p>
        <footer className="mt-8 kicker text-on-photo/55">
          <cite className="not-italic">Nina Romero</cite>
        </footer>
      </blockquote>
    </section>
  );
}
