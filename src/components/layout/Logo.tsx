import Image from "next/image";

/**
 * S-Tech mark: the actual brand icon (public/stech-logo.jpg), shown at a
 * small fixed size in a rounded tile. The source image is a flat opaque
 * square with its own blue fill already baked in, so it needs no background
 * of its own here, just rounded corners to match the rest of the UI.
 *
 * `compact` shows the short wordmark ("S-Tech."), used only by the footer's
 * own brand mark since its copyright line already spells out the full name
 * right below it. Every other instance (navbar, portal header, login page)
 * defaults to the full "S-Tech Solutions."
 */
export function Logo({
  invert = false,
  compact = false,
  className = "",
}: {
  invert?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] shadow-[0_6px_16px_-6px_rgba(31,98,240,0.8)]">
        <Image src="/stech-logo.jpg" alt="" fill sizes="32px" className="object-cover" />
      </span>
      {/* Normal line-height, not leading-none — the nav links beside this
          in the navbar use their default line-height too, and forcing a
          tight custom leading here (plus a manual pixel nudge) put the two
          out of step with each other more than it fixed anything. */}
      <span
        className={`whitespace-nowrap text-[15px] font-semibold tracking-tight ${
          invert ? "text-invert" : "text-ink"
        }`}
      >
        {compact ? "S-Tech" : "S-Tech Solutions"}
        <span className="text-brand-light">.</span>
      </span>
    </span>
  );
}
