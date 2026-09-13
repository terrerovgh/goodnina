import { AppShell } from "./AppShell";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { GalleryStrip } from "@/components/gallery-strip";
import { QuoteBand } from "@/components/quote-band";
import { FaqSection } from "@/components/faq-section";
import { BookSection } from "@/components/book-section";

export default function HomeApp() {
  return (
    <AppShell overHero>
      <Hero />
      <Intro />
      <GalleryStrip />
      <QuoteBand />
      <FaqSection />
      <BookSection />
    </AppShell>
  );
}
