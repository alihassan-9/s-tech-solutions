import Link from "next/link";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalProject } from "@/lib/portal/types";

/** Returns the whole label, since "Due No due date" is what you get from
 *  prefixing a date that isn't there. */
function dueLabel(iso: string | null): string {
  if (!iso) return "No due date yet";
  const date = new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `Due ${date}`;
}

export function ProjectCard({ project }: { project: PortalProject }) {
  return (
    <Link href={`/portal/projects/${project.id}`} data-cursor="card" className="block h-full">
      <GlassCard className="group h-full rounded-3xl p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            {project.service}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{project.name}</h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{project.summary}</p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span>Progress</span>
            <span className="font-semibold text-ink">{project.progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/[0.06]">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-ink/[0.07] pt-4">
          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
            <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.75} />
            {dueLabel(project.dueAt)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand">
            View project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
