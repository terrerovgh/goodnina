import { useCallback, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredWorks, type Work } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/lightbox";

const FRAMES = [
  "h-72 w-52 sm:h-80 sm:w-56",
  "h-80 w-56 sm:h-96 sm:w-64",
  "h-64 w-60 sm:h-72 sm:w-72",
  "mt-8 h-72 w-52 sm:h-80 sm:w-56",
  "h-96 w-56 sm:h-96 sm:w-60",
  "mt-10 h-64 w-56 sm:h-72 sm:w-64",
] as const;

const TILTS = [
  "-rotate-3",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-2",
  "rotate-1",
] as const;

export function GalleryStrip() {
  const { t, lang } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    down: boolean;
    startX: number;
    startScroll: number;
    moved: boolean;
  }>({ down: false, startX: 0, startScroll: 0, moved: false });
  const [active, setActive] = useState<number | null>(null);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down || !scroller.current) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 8) {
      drag.current.moved = true;
      try {
        scroller.current.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (drag.current.moved) {
      scroller.current.scrollLeft = drag.current.startScroll - dx;
    }
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      try {
        scroller.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }
    drag.current.down = false;
    window.setTimeout(() => {
      drag.current.moved = false;
    }, 0);
  };

  const openAt = useCallback(
    (work: Work) => {
      if (drag.current.moved) return;
      const i = featuredWorks.findIndex((w) => w.id === work.id);
      if (i >= 0) setActive(i);
    },
    [],
  );

  return (
    <section
      id="galeria"
      className="relative overflow-hidden bg-paper py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-section font-medium tracking-tight text-ink italic">
              {t.gallery.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {t.gallery.hint}
            </p>
          </div>
          <a
            href="/galeria"
            className="kicker text-ink no-underline underline-offset-4 hover:underline"
          >
            {t.gallery.all}
          </a>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="absolute top-1/2 left-3 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-foam/90 text-ink shadow-photo sm:grid"
          aria-label={t.gallery.prev}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="absolute top-1/2 right-3 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-foam/90 text-ink shadow-photo sm:grid"
          aria-label={t.gallery.next}
        >
          <ChevronRight className="size-5" />
        </button>

        <div
          ref={scroller}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="hide-scrollbar flex cursor-grab snap-x snap-mandatory items-end gap-0 overflow-x-auto px-8 py-10 active:cursor-grabbing sm:px-16"
        >
          {featuredWorks.map((work, i) => (
            <button
              key={work.id}
              type="button"
              onClick={() => openAt(work)}
              className={cn(
                "relative shrink-0 snap-center overflow-hidden rounded-sm bg-paper-deep shadow-photo transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:z-20 hover:rotate-0 hover:shadow-[var(--shadow-photo-hover)]",
                FRAMES[i % FRAMES.length],
                TILTS[i % TILTS.length],
                i === 0 ? "ml-0" : "-ml-6 sm:-ml-10",
              )}
              style={{ zIndex: (i % 5) + 1 }}
            >
              <img
                src={work.src}
                alt={work.alt[lang]}
                draggable={false}
                className={cn(
                  "h-full w-full object-cover",
                  work.object === "left" && "object-left",
                  work.object === "top" && "object-top",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {active !== null ? (
        <Lightbox
          items={featuredWorks}
          index={active}
          onClose={() => setActive(null)}
          onIndex={setActive}
        />
      ) : null}
    </section>
  );
}
