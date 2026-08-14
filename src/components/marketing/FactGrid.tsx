const COLUMN_CLASSES = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
} as const;

/**
 * Hairline-divided key/value panel. Each cell has its own rounded corners
 * (not just the outer group) — with only the outer wrapper rounded, the
 * corner cells were sharp rectangles getting clipped along the outer curve,
 * which let a soft blurred sliver of whatever sits behind the panel show
 * through right at that corner. The gap between cells is still drawn by the
 * container's background showing through a `gap-2` grid, wide enough for
 * each cell's own rounding to read cleanly rather than a hairline.
 */
export function FactGrid({
  items,
  columns = 2,
  invert = false,
  className = "",
}: {
  items: { label: string; value: string }[];
  columns?: 2 | 3;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-2 ${COLUMN_CLASSES[columns]} ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl backdrop-blur-md transition-colors duration-300 ${
            invert ? "bg-white/10 p-6 hover:bg-white/16" : "bg-white/75 p-5 hover:bg-white"
          }`}
        >
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
              invert ? "text-invert-muted" : "text-ink-soft"
            }`}
          >
            {item.label}
          </p>
          <p
            className={`mt-2 text-sm font-medium break-words ${
              invert ? "text-invert" : "text-ink"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
