import { CheckCircle2, Clock, Search, Sparkles } from "lucide-react";
import type { ProjectStatus } from "@/lib/portal/types";

/**
 * Status reads through icon + label, not colour alone — the site stays
 * strictly within the blue palette, so "in progress" vs "in review" are
 * differentiated by shade/fill weight and a distinct icon rather than
 * unrelated hues like green/amber.
 */
const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  not_started: {
    label: "Not started",
    icon: Clock,
    className: "bg-ink/[0.06] text-ink-soft",
  },
  in_progress: {
    label: "In progress",
    icon: Sparkles,
    className: "bg-brand-soft text-brand",
  },
  in_review: {
    label: "In review",
    icon: Search,
    className: "border border-brand/25 bg-brand/10 text-brand-deep",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-brand text-white",
  },
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const { label, icon: Icon, className: toneClass } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${toneClass} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </span>
  );
}
