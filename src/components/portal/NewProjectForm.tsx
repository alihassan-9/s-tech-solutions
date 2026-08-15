"use client";

import { useRouter } from "next/navigation";
import { ProjectRequestForm } from "@/components/portal/ProjectRequestForm";
import { usePortalAuth } from "@/lib/portal/auth";
import { notify } from "@/lib/portal/notifications";
import { submitNewProjectRequest } from "@/lib/portal/project-requests";

/**
 * The portal's copy of the project request form. Same fields as the public
 * one, minus the "who is asking" block: the signed-in client already answered
 * that.
 *
 * Submitting does two things at once. The project appears on the dashboard
 * with status "not_started" so the client can watch it from the moment they
 * ask, and the brief is emailed to S-Tech so somebody actually receives it.
 * The dashboard entry alone would be a note to self.
 */
export function NewProjectForm() {
  const { client } = usePortalAuth();
  const router = useRouter();

  if (!client) return null;

  return (
    <ProjectRequestForm
      contact={{
        contactName: client.contactName,
        email: client.email,
        companyName: client.companyName,
      }}
      submitLabel="Submit request"
      onSubmitted={(input) => {
        const project = submitNewProjectRequest(client.id, input);
        notify(client.id, {
          topic: "project_updates",
          title: "Request submitted",
          body: `${project.name} is on your dashboard. We will confirm the details by email.`,
          href: `/portal/projects/${project.id}`,
        });
        router.push(`/portal/projects/${project.id}`);
      }}
    />
  );
}
