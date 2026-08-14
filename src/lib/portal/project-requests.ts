import type { NewProjectRequestInput, PortalProject } from "@/lib/portal/types";

/**
 * Projects a client submits through the portal's "Start a new project" form,
 * persisted to localStorage on their own device. In a real backend this is
 * an insert into the same projects table the CRM already reads from, landing
 * as a new row S-Tech's team sees on their side.
 *
 * These submissions are the only projects the portal holds: nothing is
 * seeded, so a new account starts empty and fills up with its own work.
 */
const STORAGE_KEY = "stech-portal-projects";

function readAll(): PortalProject[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PortalProject[]) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: PortalProject[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getRequestedProjects(clientId: string): PortalProject[] {
  return readAll().filter((p) => p.clientId === clientId);
}

export function submitNewProjectRequest(
  clientId: string,
  input: NewProjectRequestInput
): PortalProject {
  const today = new Date().toISOString().slice(0, 10);

  const project: PortalProject = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    clientId,
    name: input.name.trim(),
    service: input.service,
    status: "not_started",
    progress: 0,
    startedAt: today,
    dueAt: input.desiredDueDate || null,
    summary: input.notes.trim() || `New ${input.service.toLowerCase()} request, awaiting scoping.`,
    brief: {
      targetMarket: input.targetMarket.trim(),
      requiredFields: input.requiredFields.trim(),
      volume: input.volume.trim(),
      format: input.format.trim(),
      notes: input.notes.trim() || undefined,
    },
    clientSubmitted: true,
  };

  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

/** Every project belonging to a client, newest first. */
export function getAllProjectsForClient(clientId: string): PortalProject[] {
  return getRequestedProjects(clientId).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function getAnyProjectById(clientId: string, projectId: string): PortalProject | undefined {
  return getRequestedProjects(clientId).find((p) => p.id === projectId);
}
