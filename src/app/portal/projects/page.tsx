"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { usePortalAuth } from "@/lib/portal/auth";
import { getAllProjectsForClient } from "@/lib/portal/project-requests";

/** The full project listing — the dashboard only shows a short highlights preview. */
export default function PortalProjectsPage() {
  const { client, loading } = usePortalAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !client) router.replace("/portal");
  }, [loading, client, router]);

  if (loading || !client) return null;

  const projects = getAllProjectsForClient(client.id);

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <Reveal>
          <Eyebrow>Projects</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            All your projects
          </h1>
          <p className="mt-3 text-base leading-7 text-ink-muted">
            {projects.length} project{projects.length === 1 ? "" : "s"} on your account.
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <Reveal delay={0.1} className="mt-10">
            <p className="text-sm text-ink-muted">
              No projects yet. Use New request in the sidebar to submit your first one.
            </p>
          </Reveal>
        ) : (
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" step={0.06}>
            {projects.map((project) => (
              <StaggerItem key={project.id} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </PortalShell>
  );
}
