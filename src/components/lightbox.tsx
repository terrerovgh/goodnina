import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Work } from "@/lib/content";
import { useI18n } from "@/lib/i18n";

type Props = {
  items: Work[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
};

export function Lightbox({ items, index, onClose, onIndex }: Props) {
  const { t, lang } = useI18n();
  const work = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft")
        onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, items.length, onClose, onIndex]);

  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={work.alt[lang]}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 grid size-11 place-items-center text-on-photo"
        aria-label={t.gallery.close}
      >
        <X className="size-6" />
      </button>
      <button
        type="button"
        className="absolute top-1/2 left-2 z-10 grid size-11 -translate-y-1/2 place-items-center text-on-photo sm:left-6"
        aria-label={t.gallery.prev}
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index - 1 + items.length) % items.length);
        }}
      >
        <ChevronLeft className="size-7" />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-2 z-10 grid size-11 -translate-y-1/2 place-items-center text-on-photo sm:right-6"
        aria-label={t.gallery.next}
        onClick={(e) => {
          e.stopPropagation();
          onIndex((index + 1) % items.length);
        }}
      >
        <ChevronRight className="size-7" />
      </button>
      <figure
        className="flex max-h-full max-w-3xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={work.src}
          alt={work.alt[lang]}
          className="max-h-[78svh] w-auto max-w-full object-contain"
        />
        <figcaption className="max-w-xl text-center text-sm leading-relaxed text-on-photo/75">
          {work.alt[lang]}
        </figcaption>
      </figure>
    </div>
  );
}
