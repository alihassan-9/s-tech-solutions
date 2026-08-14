import type { ReactNode } from "react";

/**
 * Edge-to-edge horizontal ticker.
 *
 * The children are rendered twice and the track slides exactly -50%, so the
 * second copy lands where the first began and the loop is seamless. Pausing
 * on hover lets people actually read an item they spotted.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`marquee-group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div
        className="animate-marquee flex w-max shrink-0 items-stretch"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}
