/**
 * Shapes mirror what the real Supabase schema will look like once the CRM
 * project is connected. Swapping the local stores (project-requests.ts,
 * project-details.ts, client-messages.ts) for real queries later should mean
 * touching data-fetching code only, not these types or the UI.
 */

export type ProjectStatus = "not_started" | "in_progress" | "in_review" | "completed";

export interface PortalClient {
  id: string;
  /**
   * Optional: plenty of clients are solo founders, freelancers, or people
   * enquiring before a company exists, so nothing in the portal blocks on
   * having one. Treat an empty string and undefined the same way, and fall
   * back to the contact name wherever a client needs a display label.
   */
  companyName?: string;
  contactName: string;
  email: string;
}

/** The label to show for a client: their company if they gave one, else their name. */
export function clientDisplayName(client: PortalClient): string {
  return client.companyName?.trim() || client.contactName;
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

/**
 * Who a request came from. Inside the portal this is filled in from the
 * signed-in client; on the public form the visitor types it, since there is
 * no account to read it from. Company name is optional in both.
 */
export interface ProjectRequestContact {
  contactName: string;
  email: string;
  companyName?: string;
}

export type NotificationTopic = "project_updates" | "messages" | "reminders";

/**
 * One item in the portal's notification centre. Raised on the client's own
 * device today (see notifications.ts); a real backend would insert these as
 * rows and deliver them through Web Push so they arrive with the portal
 * closed too.
 */
export interface PortalNotification {
  id: string;
  clientId: string;
  topic: NotificationTopic;
  title: string;
  body: string;
  /** Portal route this notification is about, if any. */
  href?: string;
  /** Set when a notification must only ever be raised once. */
  dedupeKey?: string;
  createdAt: string;
  read: boolean;
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
