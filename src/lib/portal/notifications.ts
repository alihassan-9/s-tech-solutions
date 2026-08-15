import type {
  NotificationTopic,
  PortalNotification,
  PortalProject,
} from "@/lib/portal/types";

/**
 * The portal's notification centre.
 *
 * Two layers, and they are worth keeping apart:
 *
 * 1. The in-portal feed. Every notification is stored (localStorage, like the
 *    rest of the portal's data) and read back by /portal/notifications and the
 *    sidebar's unread badge. This layer always works.
 * 2. The browser notification. When the visitor has granted permission and
 *    left push on, the same notification is also handed to the operating
 *    system so it surfaces outside the tab.
 *
 * Layer 2 is as far as a portal with no backend can go: real Web Push needs a
 * push service subscription and a server holding VAPID keys to send to it, so
 * notifications raised here reach the OS while the portal is open rather than
 * while it is closed. When Supabase lands, `notify()` becomes an insert and
 * the delivery moves server-side; the reading side of this module (the feed,
 * the unread count, the preferences) stays as it is.
 */

const NOTIFICATIONS_KEY = "stech-portal-notifications";
const PREFS_KEY = "stech-portal-notification-prefs";

/** Same-tab change signal. `storage` only fires in the *other* tabs. */
const CHANGE_EVENT = "stech-portal-notifications-changed";

/** Oldest entries past this are dropped, so the store cannot grow forever. */
const MAX_STORED = 60;

export interface NotificationPreferences {
  /** Mirror in-portal notifications to the operating system. */
  push: boolean;
  topics: Record<NotificationTopic, boolean>;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  push: false,
  topics: { project_updates: true, messages: true, reminders: true },
};

export const NOTIFICATION_TOPICS: {
  value: NotificationTopic;
  label: string;
  description: string;
}[] = [
  {
    value: "project_updates",
    label: "Project updates",
    description: "Requests you submit, status changes, and delivered work.",
  },
  {
    value: "messages",
    label: "Messages and replies",
    description: "Suggestions and update requests you send, and anything we send back.",
  },
  {
    value: "reminders",
    label: "Due date reminders",
    description: "A nudge as a project approaches or passes its requested date.",
  },
];

/* ------------------------------- storage -------------------------------- */

function readAll(): PortalNotification[] {
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as PortalNotification[]) : [];
  } catch {
    return [];
  }
}

function writeAll(notifications: PortalNotification[]): void {
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Newest first. */
export function getNotifications(clientId: string): PortalNotification[] {
  return readAll()
    .filter((n) => n.clientId === clientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadCount(clientId: string): number {
  return readAll().filter((n) => n.clientId === clientId && !n.read).length;
}

export function markAsRead(id: string): void {
  writeAll(readAll().map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllAsRead(clientId: string): void {
  writeAll(readAll().map((n) => (n.clientId === clientId ? { ...n, read: true } : n)));
}

export function clearNotifications(clientId: string): void {
  writeAll(readAll().filter((n) => n.clientId !== clientId));
}

/**
 * Subscribe to every change, from this tab or another one. Returns the
 * unsubscribe function, so a component can hand it straight back from an
 * effect.
 */
export function subscribeToNotifications(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === NOTIFICATIONS_KEY || event.key === PREFS_KEY) listener();
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}

/* ------------------------------ preferences ------------------------------ */

/**
 * Device-level rather than per client: these describe what this browser is
 * allowed to pop up, which is the same question no matter who is signed in.
 */
export function getPreferences(): NotificationPreferences {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const stored = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      push: stored.push ?? DEFAULT_PREFERENCES.push,
      topics: { ...DEFAULT_PREFERENCES.topics, ...stored.topics },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreferences(prefs: NotificationPreferences): void {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* --------------------------- browser delivery ---------------------------- */

export type PushPermission = NotificationPermission | "unsupported";

export function getPushPermission(): PushPermission {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/**
 * Ask the browser for permission. Must be called from a real click: browsers
 * ignore (and some permanently deny) a request that did not come from a user
 * gesture.
 */
export async function requestPushPermission(): Promise<PushPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

function showBrowserNotification(notification: PortalNotification): void {
  if (getPushPermission() !== "granted") return;
  try {
    // tag: a repeat of the same notification replaces the old one in the OS
    // tray instead of stacking up another copy of it.
    new Notification(notification.title, {
      body: notification.body,
      tag: notification.dedupeKey ?? notification.id,
      icon: "/favicon.ico",
    });
  } catch {
    // Some mobile browsers only allow notifications through a service worker
    // and throw on the constructor. The in-portal feed still has the entry,
    // which is the part that matters.
  }
}

/* ------------------------------- raising --------------------------------- */

/**
 * Record a notification and, if the visitor allowed it, show it outside the
 * tab too. Returns null when nothing was recorded, which happens when the
 * topic is switched off or when a `dedupeKey` has already been used.
 */
export function notify(
  clientId: string,
  input: {
    topic: NotificationTopic;
    title: string;
    body: string;
    href?: string;
    dedupeKey?: string;
  }
): PortalNotification | null {
  const prefs = getPreferences();
  if (!prefs.topics[input.topic]) return null;

  const all = readAll();
  if (
    input.dedupeKey &&
    all.some((n) => n.clientId === clientId && n.dedupeKey === input.dedupeKey)
  ) {
    return null;
  }

  const notification: PortalNotification = {
    id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    clientId,
    topic: input.topic,
    title: input.title,
    body: input.body,
    href: input.href,
    dedupeKey: input.dedupeKey,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const trimmed = [...all, notification]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-MAX_STORED);
  writeAll(trimmed);

  if (prefs.push) showBrowserNotification(notification);
  return notification;
}

/* ------------------------------ reminders -------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(iso: string): number {
  const due = new Date(`${iso}T00:00:00`).getTime();
  const today = new Date(new Date().toDateString()).getTime();
  return Math.round((due - today) / DAY_MS);
}

/**
 * Raise a reminder for anything due soon or already overdue. Called from the
 * dashboard, so it runs whenever the portal is opened; the dedupe key pins
 * each reminder to one project, one due date, and one day, which is what
 * stops a second visit the same afternoon from firing it again.
 */
export function syncDueDateReminders(
  clientId: string,
  projects: PortalProject[],
  withinDays = 3
): void {
  const today = new Date().toISOString().slice(0, 10);

  for (const project of projects) {
    if (project.status === "completed" || !project.dueAt) continue;

    const remaining = daysUntil(project.dueAt);
    if (remaining > withinDays) continue;

    const body =
      remaining < 0
        ? `${project.name} passed its requested date. We will confirm a revised one with you.`
        : remaining === 0
          ? `${project.name} is at its requested date today.`
          : `${project.name} is due in ${remaining} day${remaining === 1 ? "" : "s"}.`;

    notify(clientId, {
      topic: "reminders",
      title: remaining < 0 ? "Past its requested date" : "Due date approaching",
      body,
      href: `/portal/projects/${project.id}`,
      dedupeKey: `due:${project.id}:${project.dueAt}:${today}`,
    });
  }
}
