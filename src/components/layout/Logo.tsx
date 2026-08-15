import Image from "next/image";

/**
 * S-Tech mark: the actual brand icon (public/stech-logo.jpg), shown at a
 * small fixed size in a rounded tile. The source image is a flat opaque
 * square with its own blue fill already baked in, so it needs no background
 * of its own here, just rounded corners to match the rest of the UI.
 *
 * Always the full wordmark. The footer used to shorten it to "S-Tech." on
 * the grounds that its copyright line spelled the name out anyway, but the
 * brand mark is the one place the full name earns its space.
 */
export function Logo({
  invert = false,
  className = "",
}: {
  invert?: boolean;
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
        S-Tech Solutions
        <span className="text-brand-light">.</span>
      </span>
    </span>
  );
}
