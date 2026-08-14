/** Small capsule that labels a section, with a live-looking pulse dot. */
export function Eyebrow({
  children,
  invert = false,
  className = "",
}: {
  children: React.ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
        invert
          ? "border-white/20 bg-white/10 text-invert-muted"
          : "border-white/70 bg-white/60 text-brand shadow-[0_4px_16px_-8px_rgba(9,38,84,0.4)]"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            invert ? "bg-brand-light" : "bg-brand"
          }`}
        />
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            invert ? "bg-brand-light" : "bg-brand"
          }`}
        />
      </span>
      {children}
    </span>
  );
}
