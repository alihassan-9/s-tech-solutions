"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { NewProjectForm } from "@/components/portal/NewProjectForm";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { useRequireClient } from "@/lib/portal/auth";

export default function NewProjectRequestPage() {
  const { client, loading } = useRequireClient();

  if (loading || !client) return null;

  return (
    <PortalShell>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          {/* flex, not inline-flex — this needs to occupy its own row so the
              Eyebrow below doesn't end up sharing a line with it. An inline
              element's margin-top doesn't force a line break by itself. */}
          <Link
            href="/portal/dashboard"
            data-cursor="link"
            className="flex w-fit items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to dashboard
          </Link>

          <Eyebrow className="mt-6">Start a new project</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Tell us what you need
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            The more specific this is, the faster we can scope it accurately. This creates a
            project on your dashboard right away, and our team follows up to confirm details.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <NewProjectForm />
        </Reveal>
      </div>
    </PortalShell>
  );
}
