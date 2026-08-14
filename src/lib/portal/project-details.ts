import type { PortalDeliverable, PortalTask, PortalUpdate } from "@/lib/portal/types";

/**
 * The rows that accumulate against a project while S-Tech works on it: the
 * task checklist, the files delivered, and the updates posted back to the
 * client.
 *
 * All three are written from the team's side of the workflow, not the
 * client's, so until the CRM's Supabase project is connected (see
 * src/lib/supabase/client.ts) there is nothing to return and every project
 * renders its empty state. These stores are the seam: replace them with
 * queries and the pages reading them stay exactly as they are.
 */
const TASKS: PortalTask[] = [];
const DELIVERABLES: PortalDeliverable[] = [];
const UPDATES: PortalUpdate[] = [];

export function getTasksForProject(projectId: string): PortalTask[] {
  return TASKS.filter((task) => task.projectId === projectId);
}

export function getDeliverablesForProject(projectId: string): PortalDeliverable[] {
  return DELIVERABLES.filter((deliverable) => deliverable.projectId === projectId);
}

export function getUpdatesForProject(projectId: string): PortalUpdate[] {
  return UPDATES.filter((update) => update.projectId === projectId).sort((a, b) =>
    b.postedAt.localeCompare(a.postedAt)
  );
}
