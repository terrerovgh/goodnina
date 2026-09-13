import { useMemo, useState } from "react";
import {
  works,
  type Category,
  type Work,
} from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/lightbox";

const CATEGORIES: Category[] = [
  "floral",
  "ornamental",
  "lettering",
  "fineline",
];

export function GalleryGrid() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [active, setActive] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === "all" ? works : works.filter((w) => w.category === filter)),
    [filter],
  );

  const open = (work: Work) => {
    const i = items.findIndex((w) => w.id === work.id);
    if (i >= 0) setActive(i);
  };

  return (
    <div>
      <div
        className="hide-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label={t.gallery.title}
      >
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          {t.gallery.filterAll}
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
          >
            {t.gallery.filters[c]}
          </FilterChip>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-muted">{t.gallery.empty}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((work, i) => (
            <li
              key={work.id}
              className={cn(
                work.wide && "col-span-2",
                !work.wide && i % 7 === 0 && "sm:col-span-2",
              )}
            >
              <button
                type="button"
                onClick={() => open(work)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-sm bg-paper-deep shadow-photo",
                  work.wide ? "aspect-[5/3]" : "aspect-[3/4]",
                )}
              >
                <img
                  src={work.src}
                  alt={work.alt[lang]}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]",
                    work.object === "left" && "object-left",
                    work.object === "top" && "object-top",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {active !== null ? (
        <Lightbox
          items={items}
          index={active}
          onClose={() => setActive(null)}
          onIndex={setActive}
        />
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-kicker font-medium tracking-kicker uppercase transition-[background-color,color] duration-200",
        active
          ? "bg-ink text-on-photo"
          : "bg-transparent text-ink ring-1 ring-line hover:bg-paper-deep",
      )}
    >
      {children}
    </button>
  );
}
