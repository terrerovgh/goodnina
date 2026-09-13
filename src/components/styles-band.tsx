import { useI18n } from "@/lib/i18n";

export function StylesBand() {
  const { t } = useI18n();
  return (
    <section
      id="estilos"
      className="border-y border-line bg-paper"
      aria-labelledby="estilos-title"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2
          id="estilos-title"
          className="font-display text-section font-medium tracking-tight text-ink italic"
        >
          {t.styles.title}
        </h2>
        <ul className="mt-12 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {t.styles.items.map((item) => (
            <li key={item.name}>
              <h3 className="font-display text-2xl font-medium italic leading-snug text-ink">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
