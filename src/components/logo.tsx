import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  onPhoto = false,
}: {
  className?: string;
  onPhoto?: boolean;
}) {
  return (
    <a
      href="/"
      className={cn(
        "group flex items-center gap-2.5 no-underline",
        className,
      )}
      aria-label="Nina Romero — home"
    >
      <span
        className={cn(
          "grid size-8 place-items-center",
          onPhoto ? "text-on-photo" : "text-ink",
        )}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="size-7" fill="none">
          <g
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 27 V14.2" />
            <path d="M16 14.2 C16 14.2 9.8 8.8 12.1 5.6 C14.2 8.3 16 10 16 10" />
            <path d="M16 14.2 C16 14.2 22.2 8.8 19.9 5.6 C17.8 8.3 16 10 16 10" />
            <path d="M16 16.2 C16 16.2 8.6 15 8.6 11.6 C12 13.4 15.2 15.2 16 16.2" />
            <path d="M16 16.2 C16 16.2 23.4 15 23.4 11.6 C20 13.4 16.8 15.2 16 16.2" />
            <circle cx="16" cy="11" r="1.05" fill="currentColor" stroke="none" />
          </g>
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-xl font-medium tracking-tight leading-none sm:text-2xl",
          onPhoto ? "text-on-photo" : "text-ink",
        )}
      >
        Nina Romero
      </span>
    </a>
  );
}
