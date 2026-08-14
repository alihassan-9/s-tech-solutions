/**
 * Shapes mirror what the real Supabase schema will look like once the CRM
 * project is connected. Swapping the local stores (project-requests.ts,
 * project-details.ts, client-messages.ts) for real queries later should mean
 * touching data-fetching code only, not these types or the UI.
 */

export type ProjectStatus = "not_started" | "in_progress" | "in_review" | "completed";

export interface PortalClient {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
}

export interface PortalTask {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
  completedAt: string | null;
}

export interface PortalDeliverable {
  id: string;
  projectId: string;
  title: string;
  format: string;
  deliveredAt: string;
  note?: string;
}

export interface PortalUpdate {
  id: string;
  projectId: string;
  title: string;
  body: string;
  postedAt: string;
}

export const SERVICE_OPTIONS = ["Lead Generation", "CRM Management", "Email Marketing"] as const;

export type ServiceType = (typeof SERVICE_OPTIONS)[number];

/** The actual spec a project runs on: what was asked for, in a client's own words. */
export interface ProjectBrief {
  targetMarket: string;
  requiredFields: string;
  volume: string;
  format: string;
  notes?: string;
}

export interface PortalProject {
  id: string;
  clientId: string;
  name: string;
  service: string;
  status: ProjectStatus;
  progress: number;
  startedAt: string;
  dueAt: string | null;
  summary: string;
  brief?: ProjectBrief;
  /** True for projects a client submitted through the portal themselves. */
  clientSubmitted?: boolean;
}

/** What the "Start a new project" form collects. */
export interface NewProjectRequestInput {
  name: string;
  service: ServiceType;
  targetMarket: string;
  requiredFields: string;
  volume: string;
  format: string;
  notes: string;
  desiredDueDate: string;
}

export type ClientMessageType = "suggestion" | "update_request";

/**
 * A message a client sends from the portal, either about one project or
 * general feedback (projectId null). Stored on the client's own device for
 * now (see client-messages.ts); a real backend would insert these as rows
 * S-Tech's team sees on their side too.
 */
export interface ClientMessage {
  id: string;
  clientId: string;
  projectId: string | null;
  /** Set when the message was tagged to a specific task via the @ picker. */
  taskId?: string | null;
  type: ClientMessageType;
  body: string;
  createdAt: string;
}
