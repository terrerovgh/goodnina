import * as Accordion from "@radix-ui/react-accordion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const { t } = useI18n();
  return (
    <section id="faq" className="bg-paper" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2
            id="faq-title"
            className="font-display text-section font-medium tracking-tight text-ink italic"
          >
            {t.faq.title}
          </h2>
        </div>
        <Accordion.Root
          type="single"
          collapsible
          className="lg:col-span-8"
        >
          {t.faq.items.map((item, i) => (
            <Accordion.Item
              key={item.q}
              value={`item-${i}`}
              className="border-b border-line"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "group flex w-full items-start justify-between gap-6 py-5 text-left",
                    "transition-opacity duration-200 hover:opacity-80",
                  )}
                >
                  <span className="flex gap-4">
                    <span className="kicker mt-1.5 shrink-0 text-rose">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-2 grid size-8 shrink-0 place-items-center text-muted transition-transform duration-200 ease-out group-data-[state=open]:rotate-45"
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none">
                      <path
                        d="M8 1.5 v13 M1.5 8 h13"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none">
                <p className="max-w-xl pb-6 pl-12 text-base leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
