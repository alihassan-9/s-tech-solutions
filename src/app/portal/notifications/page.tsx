"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Trash2, ArrowUpRight } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { NotificationSettings } from "@/components/portal/NotificationSettings";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { useRequireClient } from "@/lib/portal/auth";
import {
  clearNotifications,
  getNotifications,
  markAllAsRead,
  markAsRead,
  subscribeToNotifications,
} from "@/lib/portal/notifications";
import type { NotificationTopic, PortalNotification } from "@/lib/portal/types";

const TOPIC_LABEL: Record<NotificationTopic, string> = {
  project_updates: "Project update",
  messages: "Message",
  reminders: "Reminder",
};

/** Relative for anything recent, an actual date once it stops being "ago". */
function formatWhen(iso: string): string {
  const then = new Date(iso);
  const minutes = Math.round((Date.now() - then.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  if (minutes < 60 * 24 * 7) return `${Math.round(minutes / (60 * 24))}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * The portal's notification centre: everything raised for this client, and
 * the switches that decide what gets raised and whether it also reaches the
 * device. A page rather than a dropdown, for the same reason projects and
 * suggestions are pages: the sidebar stays a plain menu that never changes
 * height when something arrives.
 */
export default function PortalNotificationsPage() {
  const { client, loading } = useRequireClient();
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  // Self-contained (not referencing a memoized callback) so the setState call
  // is textually inside this effect, matching the pattern that satisfies
  // react-hooks/set-state-in-effect elsewhere in this codebase.
  useEffect(() => {
    const sync = () => setNotifications(client ? getNotifications(client.id) : []);
    sync();
    return subscribeToNotifications(sync);
  }, [client]);

  if (loading || !client) return null;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PortalShell>
      <div className="mx-auto max-w-3xl px-6 py-10 lg:py-16">
        <Reveal>
          <Eyebrow>Notifications</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What has been happening
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            {unread > 0
              ? `${unread} unread on your account.`
              : "Everything here is caught up."}
          </p>
        </Reveal>

        {notifications.length > 0 ? (
          <Reveal delay={0.05} className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => markAllAsRead(client.id)}
              disabled={unread === 0}
              data-cursor="link"
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              Mark all as read
            </button>
            <button
              type="button"
              onClick={() => clearNotifications(client.id)}
              data-cursor="link"
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-white hover:text-ink"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Clear all
            </button>
          </Reveal>
        ) : null}

        {notifications.length === 0 ? (
          <Reveal delay={0.1} className="mt-8">
            <GlassCard className="rounded-3xl p-8 text-center" lift={false}>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft">
                <Bell className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">Nothing yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
                Submit a request or send us a message and the activity on it shows up
                here.
              </p>
              <Link
                href="/portal/new-request"
                data-cursor="link"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover"
              >
                Start a new project
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </GlassCard>
          </Reveal>
        ) : (
          <Stagger className="mt-4 space-y-3" step={0.05}>
            {notifications.map((notification) => {
              const body = (
                <>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        notification.read ? "bg-ink/15" : "bg-brand"
                      }`}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                      {TOPIC_LABEL[notification.topic]}
                    </span>
                    <span className="ml-auto text-xs text-ink-soft">
                      {formatWhen(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-ink">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{notification.body}</p>
                </>
              );

              return (
                <StaggerItem key={notification.id}>
                  <GlassCard
                    className={`rounded-2xl p-5 ${notification.read ? "opacity-75" : ""}`}
                    lift={false}
                  >
                    {/* A notification about a project links to it, and opening
                        it is the read receipt. One without a destination is
                        still markable, just by clicking the card. */}
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        onClick={() => markAsRead(notification.id)}
                        data-cursor="link"
                        className="block"
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        data-cursor="link"
                        className="block w-full text-left"
                      >
                        {body}
                      </button>
                    )}
                  </GlassCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        <Reveal delay={0.1} className="mt-12">
          <h2 className="text-base font-semibold tracking-tight text-ink">Settings</h2>
          <p className="mt-1.5 text-sm leading-6 text-ink-muted">
            These apply to this browser.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-4">
          <NotificationSettings />
        </Reveal>
      </div>
    </PortalShell>
  );
}
