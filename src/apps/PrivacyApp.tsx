import { AppShell } from "./AppShell";
import { useI18n } from "@/lib/i18n";

function Body() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-5 pt-28 pb-20 sm:px-8 sm:pt-32">
      <h1 className="font-display text-section font-medium italic text-ink">
        {t.privacy.title}
      </h1>
      <p className="mt-8 text-lead leading-relaxed text-ink-soft">
        {t.privacy.body}
      </p>
    </div>
  );
}

export default function PrivacyApp() {
  return (
    <AppShell page="privacy">
      <Body />
    </AppShell>
  );
}
