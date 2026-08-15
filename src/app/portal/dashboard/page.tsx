"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Layers, CalendarClock, ArrowUpRight } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { useRequireClient } from "@/lib/portal/auth";
import { getAllProjectsForClient } from "@/lib/portal/project-requests";
import { syncDueDateReminders } from "@/lib/portal/notifications";

/** How many project cards the dashboard previews before pointing to the full Projects page. */
const HIGHLIGHT_COUNT = 3;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * The main dashboard card: a highlights view of the client's projects.
 * Navigation, per-project progress/tasks, and the feedback composer all
 * live in the sidebar (PortalShell) now, so this stays focused on the
 * highlight-level summary rather than repeating that detail.
 */
export default function PortalDashboardPage() {
  const { client, loading } = useRequireClient();

  // Opening the portal is what checks for anything due. With no server to run
  // a schedule, the visit is the trigger; the store's dedupe key keeps a
  // second visit the same day from raising the same reminder twice.
  useEffect(() => {
    if (!client) return;
    syncDueDateReminders(client.id, getAllProjectsForClient(client.id));
  }, [client]);

  if (loading || !client) return null;

  const projects = getAllProjectsForClient(client.id);
  const activeProjects = projects.filter((p) => p.status !== "completed");
  const avgProgress = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;
  const nextDue = activeProjects
    .filter((p) => p.dueAt)
    .sort((a, b) => (a.dueAt as string).localeCompare(b.dueAt as string))[0];

  const highlightProjects = [...activeProjects, ...projects.filter((p) => p.status === "completed")]
    .slice(0, HIGHLIGHT_COUNT);

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <Reveal>
          <Eyebrow>Dashboard</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Welcome back, {client.contactName.split(" ")[0]}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-muted">
            {/* "currently in progress" overstated it: a just-submitted
                project is active but hasn't been started yet. */}
            {activeProjects.length > 0
              ? `${activeProjects.length} active project${activeProjects.length === 1 ? "" : "s"} on your account.`
              : "No active projects right now."}
          </p>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-3" step={0.06}>
          <StaggerItem>
            <GlassCard className="rounded-2xl p-5" lift={false}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                <Layers className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                {activeProjects.length}
              </p>
              <p className="text-xs text-ink-soft">Active projects</p>
            </GlassCard>
          </StaggerItem>
          <StaggerItem>
            <GlassCard className="rounded-2xl p-5" lift={false}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                <TrendingUp className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">{avgProgress}%</p>
              <p className="text-xs text-ink-soft">Average progress</p>
            </GlassCard>
          </StaggerItem>
          <StaggerItem>
            <GlassCard className="rounded-2xl p-5" lift={false}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                <CalendarClock className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                {nextDue?.dueAt ? formatDate(nextDue.dueAt) : "None set"}
              </p>
              <p className="text-xs text-ink-soft">Next due date</p>
            </GlassCard>
          </StaggerItem>
        </Stagger>

        {projects.length === 0 ? (
          <Reveal delay={0.1} className="mt-10">
            <p className="text-sm text-ink-muted">
              No projects yet. Use New request in the sidebar to submit your first one.
            </p>
          </Reveal>
        ) : (
          <>
            <Reveal delay={0.1} className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold tracking-tight text-ink">Highlights</h2>
                <Link
                  href="/portal/projects"
                  data-cursor="link"
                  className="flex items-center gap-1 text-sm font-semibold text-brand"
                >
                  View all projects
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            </Reveal>

            <Stagger className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" step={0.08}>
              {highlightProjects.map((project) => (
                <StaggerItem key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </div>
    </PortalShell>
  );
}
