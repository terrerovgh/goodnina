import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BOOKING_URL, INSTAGRAM_URL } from "@/lib/content";

export function BookSection() {
  const { t } = useI18n();
  return (
    <section id="agendar" className="relative overflow-hidden bg-blush">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-section font-medium tracking-tight text-ink italic">
            {t.book.title}
          </h2>
          <p className="mt-6 max-w-xl text-lead leading-relaxed text-ink-soft">
            {t.book.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-kicker font-medium tracking-kicker uppercase text-on-photo no-underline transition-[background-color,transform] duration-200 ease-out hover:bg-ink-soft active:scale-[0.96]"
            >
              {t.book.cta}
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full px-6 text-kicker font-medium tracking-kicker uppercase text-ink no-underline underline-offset-4 hover:underline"
            >
              {t.book.instagram}
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-sm shadow-photo">
            <img
              src="/images/nina-profile.jpg"
              alt="Nina Romero"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
