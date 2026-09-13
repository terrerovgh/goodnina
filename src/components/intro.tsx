import { useI18n } from "@/lib/i18n";
import { works } from "@/lib/content";

const lotus = works.find((w) => w.id === "paisley-lotus")!;
const mandala = works.find((w) => w.id === "mandala-eye")!;

export function Intro() {
  const { t, lang } = useI18n();
  return (
    <section id="sobre" className="bg-paper" aria-labelledby="sobre-title">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:items-start">
        <div className="lg:col-span-7">
          <h2
            id="sobre-title"
            className="font-display text-section font-medium tracking-tight text-ink italic"
          >
            {t.intro.title}
          </h2>
          <div className="mt-8 space-y-6 text-lead leading-relaxed text-ink-soft">
            <p>{t.intro.p1}</p>
            <p>{t.intro.p2}</p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm pb-10 lg:col-span-5 lg:mt-6 lg:pb-4">
          <div className="relative z-10 w-4/5 overflow-hidden rounded-sm shadow-photo">
            <img
              src={lotus.src}
              alt={lotus.alt[lang]}
              width={900}
              height={1200}
              decoding="async"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-6 z-20 aspect-[3/4] w-1/2 overflow-hidden rounded-sm shadow-photo lg:bottom-2">
            <img
              src={mandala.src}
              alt={mandala.alt[lang]}
              width={900}
              height={1200}
              decoding="async"
              className="h-full w-full origin-[20%_48%] scale-[1.9] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
