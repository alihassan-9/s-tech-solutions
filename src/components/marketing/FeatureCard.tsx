import type { ComponentType } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type IconComponent = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

export function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  className = "",
}: {
  icon?: IconComponent;
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <GlassCard className={`group rounded-3xl p-6 ${className}`}>
      {Icon ? (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-brand-soft-2 shadow-[0_8px_20px_-12px_rgba(31,98,240,0.7)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
        </div>
      ) : eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {eyebrow}
        </span>
      ) : null}

      <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
    </GlassCard>
  );
}
