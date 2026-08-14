import type { ComponentType } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

/**
 * Engagement example card.
 *
 * Carries three layers so the grid doesn't read as a wall of one-liners: what
 * kind of work it is (tag), what the situation was (description), and what
 * actually landed in the client's hands (delivered) — the last pinned to the
 * card's base so every card in a row ends on the same line.
 */
export function MiniCard({
  icon: Icon,
  tag,
  title,
  description,
  delivered,
  className = "",
}: {
  icon?: IconComponent;
  tag?: string;
  title: string;
  description: string;
  delivered?: string;
  className?: string;
}) {
  return (
    <GlassCard className={`group flex flex-col rounded-3xl p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_8px_18px_-12px_rgba(31,98,240,0.8)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            <Icon className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
          </div>
        ) : null}
        {tag ? (
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
            {tag}
          </span>
        ) : null}
      </div>

      <h4 className="mt-5 text-base font-semibold tracking-tight text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>

      {delivered ? (
        <div className="mt-auto pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Typically delivered
          </p>
          <p className="mt-1.5 border-t border-ink/[0.07] pt-3 font-mono text-xs leading-5 text-brand">
            {delivered}
          </p>
        </div>
      ) : null}
    </GlassCard>
  );
}
