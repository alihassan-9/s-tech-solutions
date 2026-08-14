import type { ClientMessage, ClientMessageType } from "@/lib/portal/types";

/**
 * Client-submitted suggestions and update requests, persisted to
 * localStorage on the client's device. This is what a real backend table
 * would hold once Supabase is connected; only the storage mechanism changes
 * then, since the read/write signatures below are what the UI already calls.
 */
const STORAGE_KEY = "stech-portal-messages";

function readAll(): ClientMessage[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClientMessage[]) : [];
  } catch {
    return [];
  }
}

function writeAll(messages: ClientMessage[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

/** Pass `projectId: null` for general feedback not tied to one project. */
export function getClientMessages(clientId: string, projectId: string | null): ClientMessage[] {
  return readAll()
    .filter((m) => m.clientId === clientId && m.projectId === projectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Every message a client has sent, any project, newest first. */
export function getAllClientMessages(clientId: string): ClientMessage[] {
  return readAll()
    .filter((m) => m.clientId === clientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addClientMessage(
  clientId: string,
  projectId: string | null,
  type: ClientMessageType,
  body: string,
  taskId: string | null = null
): ClientMessage {
  const message: ClientMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    clientId,
    projectId,
    taskId,
    type,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(message);
  writeAll(all);
  return message;
}
