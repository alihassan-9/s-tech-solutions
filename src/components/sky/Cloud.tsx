/**
 * A single cumulus silhouette.
 *
 * The shape is a cluster of overlapping ellipses drawn into one group; the
 * blur on the wrapper melts them together so the seams disappear and you get
 * an organic edge instead of a row of circles. Because the blur lives on a
 * static element and only the *parent* is ever transformed, the browser
 * rasterises it once and reuses that layer while scrolling.
 */
export function Cloud({
  className = "",
  opacity = 1,
  blur = 12,
  tint = "#ffffff",
}: {
  className?: string;
  opacity?: number;
  /** Softness in px. Higher reads as further away / thinner vapour. */
  blur?: number;
  tint?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity, filter: `blur(${blur}px)` }}
      aria-hidden
    >
      <svg viewBox="0 0 320 130" className="h-full w-full" fill={tint}>
        <g>
          <ellipse cx="96" cy="78" rx="66" ry="40" />
          <ellipse cx="164" cy="58" rx="62" ry="48" />
          <ellipse cx="228" cy="80" rx="56" ry="36" />
          <ellipse cx="58" cy="92" rx="44" ry="26" />
          <ellipse cx="266" cy="94" rx="40" ry="22" />
          <rect x="44" y="80" width="234" height="30" rx="15" />
        </g>
      </svg>
    </div>
  );
}
