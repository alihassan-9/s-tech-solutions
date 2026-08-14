"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, RefreshCw, AtSign } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { MentionComposer } from "@/components/portal/MentionComposer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { usePortalAuth } from "@/lib/portal/auth";
import { getAllProjectsForClient } from "@/lib/portal/project-requests";
import { getTasksForProject } from "@/lib/portal/project-details";
import { getAllClientMessages } from "@/lib/portal/client-messages";
import type { ClientMessage } from "@/lib/portal/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Everything to do with client-sent feedback lives here now: the @ mention
 * composer to send a new suggestion or update request, and a full history
 * of what's been sent, each entry showing which project and task (if any)
 * it was tagged to.
 */
export default function PortalSuggestionsPage() {
  const { client, loading } = usePortalAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ClientMessage[]>([]);

  const projects = client ? getAllProjectsForClient(client.id) : [];

  const refreshMessages = useCallback(() => {
    if (!client) {
      setMessages([]);
      return;
    }
    setMessages(getAllClientMessages(client.id));
  }, [client]);

  useEffect(() => {
    if (!loading && !client) router.replace("/portal");
  }, [loading, client, router]);

  // Self-contained (not referencing refreshMessages) so the setState call
  // is textually inside this effect, matching the pattern that satisfies
  // react-hooks/set-state-in-effect elsewhere in this codebase.
  useEffect(() => {
    const sync = () => {
      if (!client) {
        setMessages([]);
        return;
      }
      setMessages(getAllClientMessages(client.id));
    };
    sync();
  }, [client]);

  if (loading || !client) return null;

  return (
    <PortalShell>
      <div className="mx-auto max-w-3xl px-6 py-10 lg:py-16">
        <Reveal>
          <Eyebrow>Suggestions</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Send feedback, track what you&apos;ve sent
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-muted">
            Type @ to tag a specific project, then pick a task if it applies. Leave it untagged
            for general feedback.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <GlassCard className="rounded-3xl p-6" lift={false}>
            <MentionComposer projects={projects} onSent={refreshMessages} />
          </GlassCard>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <h2 className="text-base font-semibold tracking-tight text-ink">History</h2>
          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-ink-muted">Nothing sent yet.</p>
            ) : (
              messages.map((message) => {
                const project = projects.find((p) => p.id === message.projectId);
                const task = project?.id
                  ? getTasksForProject(project.id).find((t) => t.id === message.taskId)
                  : undefined;

                return (
                  <GlassCard key={message.id} className="rounded-2xl p-4" lift={false}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand">
                        {message.type === "suggestion" ? (
                          <MessageSquarePlus className="h-3 w-3" strokeWidth={2} />
                        ) : (
                          <RefreshCw className="h-3 w-3" strokeWidth={2} />
                        )}
                        {message.type === "suggestion" ? "Suggestion" : "Update requested"}
                      </span>
                      <span className="text-xs text-ink-soft">{formatDate(message.createdAt)}</span>
                    </div>

                    <p className="mt-2.5 text-sm leading-6 text-ink">{message.body}</p>

                    {project ? (
                      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-brand">
                        <AtSign className="h-3 w-3" strokeWidth={2} />
                        {project.name}
                        {task ? <span className="text-ink-soft"> · {task.title}</span> : null}
                      </p>
                    ) : null}
                  </GlassCard>
                );
              })
            )}
          </div>
        </Reveal>
      </div>
    </PortalShell>
  );
}
