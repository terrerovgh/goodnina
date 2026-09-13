import { AppShell } from "./AppShell";
import { GalleryGrid } from "@/components/gallery-grid";
import { useI18n } from "@/lib/i18n";

function Body() {
  const { t } = useI18n();
  return (
    <div className="pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h1 className="font-display text-section font-medium tracking-tight text-ink italic">
          {t.gallery.pageTitle}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          {t.gallery.lede}
        </p>
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </div>
    </div>
  );
}

export default function GalleryApp() {
  return (
    <AppShell page="gallery">
      <Body />
    </AppShell>
  );
}
