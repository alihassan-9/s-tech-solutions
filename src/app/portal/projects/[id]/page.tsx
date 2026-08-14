"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, FileText, CalendarClock, ClipboardList } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { ActivityFeed } from "@/components/portal/ActivityFeed";
import { MessageComposer } from "@/components/portal/MessageComposer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { usePortalAuth } from "@/lib/portal/auth";
import { getTasksForProject, getDeliverablesForProject, getUpdatesForProject } from "@/lib/portal/project-details";
import { getAnyProjectById } from "@/lib/portal/project-requests";
import { getClientMessages } from "@/lib/portal/client-messages";
import type { ClientMessage } from "@/lib/portal/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Whole label, so a project without a date reads "No due date yet" rather
 *  than "Due No due date". */
function dueLabel(iso: string | null): string {
  return iso ? `Due ${formatDate(iso)}` : "No due date yet";
}

export default function PortalProjectPage() {
  const { client, loading } = usePortalAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const project = client ? getAnyProjectById(client.id, params.id) ?? null : null;

  const [messages, setMessages] = useState<ClientMessage[]>([]);

  // Named + defined outside the effect so it isn't a *direct* setState call
  // in the effect body itself — same reasoning as PortalAuthProvider's
  // localStorage read.
  const refreshMessages = useCallback(() => {
    if (!client || !project) {
      setMessages([]);
      return;
    }
    setMessages(getClientMessages(client.id, project.id));
  }, [client, project]);

  useEffect(() => {
    if (!loading && !client) router.replace("/portal");
  }, [loading, client, router]);

  // Self-contained (not referencing refreshMessages) so the setState call
  // is textually inside this effect, matching the pattern that satisfies
  // react-hooks/set-state-in-effect elsewhere in this codebase.
  useEffect(() => {
    const sync = () => {
      if (!client || !project) {
        setMessages([]);
        return;
      }
      setMessages(getClientMessages(client.id, project.id));
    };
    sync();
  }, [client, project]);

  if (loading || !client) return null;

  if (!project) {
    return (
      <PortalShell>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-ink">Project not found</h1>
          <p className="mt-2 text-sm text-ink-muted">
            This project doesn&apos;t exist or isn&apos;t part of your account.
          </p>
          <Link href="/portal/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to dashboard
          </Link>
        </div>
      </PortalShell>
    );
  }

  const tasks = getTasksForProject(project.id);
  const deliverables = getDeliverablesForProject(project.id);
  const updates = getUpdatesForProject(project.id);

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <Link
            href="/portal/dashboard"
            data-cursor="link"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to dashboard
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                {project.service}
              </span>
              <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">{project.summary}</p>
            </div>
            <StatusBadge status={project.status} className="shrink-0" />
          </div>

          <GlassCard className="mt-8 rounded-3xl p-6" lift={false}>
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span>Overall progress</span>
              <span className="font-semibold text-ink">{project.progress}%</span>
            </div>
            <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.75} />
                Started {formatDate(project.startedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.75} />
                {dueLabel(project.dueAt)}
              </span>
            </div>
          </GlassCard>
        </Reveal>

        {project.brief ? (
          <Reveal delay={0.1} className="mt-8">
            <GlassCard className="rounded-3xl p-6" lift={false}>
              <div className="flex items-center gap-2.5">
                <ClipboardList className="h-4.5 w-4.5 text-brand" strokeWidth={1.75} />
                <h2 className="text-base font-semibold tracking-tight text-ink">Project brief</h2>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Target market
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink">{project.brief.targetMarket}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Fields
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink">{project.brief.requiredFields}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Volume
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink">{project.brief.volume}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    Format
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-ink">{project.brief.format}</p>
                </div>
                {project.brief.notes ? (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                      Notes
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-ink-muted">{project.brief.notes}</p>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </Reveal>
        ) : null}

        {/* Tasks/Deliverables paired against Activity — both are "status"
            content, so the two columns read as parallel rather than one
            column carrying work detail and the other carrying a form plus
            a feed. items-start keeps each column at its own natural height
            instead of CSS Grid's default stretch, which was forcing the
            shorter column into a taller box than its content needed. */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <Reveal>
              <h2 className="text-base font-semibold tracking-tight text-ink">Tasks</h2>
              <div className="mt-4 divide-y divide-ink/[0.06] overflow-hidden rounded-2xl border border-ink/[0.08] bg-white/70 backdrop-blur-md">
                {tasks.length === 0 ? (
                  <p className="px-4 py-3.5 text-sm text-ink-muted">
                    Tasks will appear here once we&apos;ve scoped the project.
                  </p>
                ) : null}
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3.5">
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-ink/20" strokeWidth={1.75} />
                    )}
                    <span
                      className={`text-sm ${task.done ? "text-ink-soft line-through" : "text-ink"}`}
                    >
                      {task.title}
                    </span>
                    {task.done && task.completedAt ? (
                      <span className="ml-auto shrink-0 text-xs text-ink-soft">
                        {formatDate(task.completedAt)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-base font-semibold tracking-tight text-ink">Deliverables</h2>
              <Stagger className="mt-4 grid gap-3 sm:grid-cols-2" step={0.06}>
                {deliverables.length === 0 ? (
                  <p className="text-sm text-ink-muted">Nothing delivered yet on this project.</p>
                ) : (
                  deliverables.map((file) => (
                    <StaggerItem key={file.id}>
                      <GlassCard className="h-full rounded-2xl p-4" lift={false}>
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                            <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink">{file.title}</p>
                            <p className="mt-1 text-xs text-ink-soft">
                              {file.format} · {formatDate(file.deliveredAt)}
                            </p>
                            {file.note ? (
                              <p className="mt-2 text-xs leading-5 text-ink-muted">{file.note}</p>
                            ) : null}
                          </div>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  ))
                )}
              </Stagger>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.15}>
              <h2 className="text-base font-semibold tracking-tight text-ink">Activity</h2>
              <div className="mt-4">
                <ActivityFeed
                  updates={updates}
                  messages={messages}
                  emptyLabel="No activity yet on this project."
                />
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-8">
          <MessageComposer
            projectId={project.id}
            onSent={refreshMessages}
            title="Send a message"
            description="Have a suggestion about this project, or want a status update? Send it here."
          />
        </Reveal>
      </div>
    </PortalShell>
  );
}
