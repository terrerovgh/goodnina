import { AppShell } from "./AppShell";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { StylesBand } from "@/components/styles-band";
import { GalleryStrip } from "@/components/gallery-strip";
import { QuoteBand } from "@/components/quote-band";
import { FaqSection } from "@/components/faq-section";
import { BookSection } from "@/components/book-section";

export default function HomeApp() {
  return (
    <AppShell overHero page="home">
      <Hero />
      <Intro />
      <StylesBand />
      <GalleryStrip />
      <QuoteBand />
      <FaqSection />
      <BookSection />
    </AppShell>
  );
}
