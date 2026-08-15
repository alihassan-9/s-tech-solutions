"use client";

import { useEffect, useState } from "react";
import { BellRing, BellOff, ShieldAlert, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  DEFAULT_PREFERENCES,
  NOTIFICATION_TOPICS,
  getPreferences,
  getPushPermission,
  requestPushPermission,
  setPreferences,
  type NotificationPreferences,
  type PushPermission,
} from "@/lib/portal/notifications";
import type { NotificationTopic } from "@/lib/portal/types";

function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      data-cursor="link"
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? "bg-brand" : "bg-ink/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-float transition-all ${
          checked ? "left-[1.375rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

/**
 * Controls for the portal's notifications: whether this browser may show them
 * outside the tab, and which kinds are worth raising at all.
 *
 * Permission and preference are deliberately two separate things. The browser
 * grants permission once and remembers it forever; the push switch is the
 * client's own "not right now", which they can flip back without going near
 * browser settings. Turning push on asks for permission only if it has never
 * been answered, because a denial cannot be re-asked from the page.
 */
export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [permission, setPermission] = useState<PushPermission>("unsupported");

  useEffect(() => {
    const sync = () => {
      setPrefs(getPreferences());
      setPermission(getPushPermission());
    };
    sync();
  }, []);

  const save = (next: NotificationPreferences) => {
    setPrefs(next);
    setPreferences(next);
  };

  const onTogglePush = async (next: boolean) => {
    if (!next) {
      save({ ...prefs, push: false });
      return;
    }
    const result = await requestPushPermission();
    setPermission(result);
    // Switching on without permission would be a lie: the feed would keep
    // filling but nothing would ever surface outside the tab.
    save({ ...prefs, push: result === "granted" });
  };

  const onToggleTopic = (topic: NotificationTopic, next: boolean) =>
    save({ ...prefs, topics: { ...prefs.topics, [topic]: next } });

  const unsupported = permission === "unsupported";
  const denied = permission === "denied";

  return (
    <GlassCard className="rounded-3xl p-6 sm:p-8" lift={false}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            {prefs.push ? (
              <BellRing className="h-4 w-4 text-brand" strokeWidth={1.75} />
            ) : (
              <BellOff className="h-4 w-4 text-ink-soft" strokeWidth={1.75} />
            )}
            Push notifications
          </p>
          <p className="mt-1.5 max-w-md text-sm leading-6 text-ink-muted">
            Show project activity on your device as well as here in the portal.
          </p>
        </div>
        <Toggle
          checked={prefs.push}
          onChange={onTogglePush}
          disabled={unsupported || denied}
          label="Push notifications"
        />
      </div>

      {denied ? (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand-deep">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          Your browser is blocking notifications for this site. Allow them in the site
          settings beside the address bar, then come back and switch this on.
        </p>
      ) : null}

      {unsupported ? (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-xs leading-5 text-ink-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          This browser does not support notifications. Everything still arrives in the
          list on this page.
        </p>
      ) : null}

      <div className="mt-7 space-y-5 border-t border-ink/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
          What to notify me about
        </p>
        {NOTIFICATION_TOPICS.map((topic) => (
          <div key={topic.value} className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-ink">{topic.label}</p>
              <p className="mt-1 max-w-md text-xs leading-5 text-ink-muted">
                {topic.description}
              </p>
            </div>
            <Toggle
              checked={prefs.topics[topic.value]}
              onChange={(next) => onToggleTopic(topic.value, next)}
              label={topic.label}
            />
          </div>
        ))}
      </div>

      <p className="mt-7 flex items-start gap-2.5 border-t border-ink/10 pt-5 text-xs leading-5 text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        Preview: notifications are raised on this device while the portal is open. Once
        the portal is connected to our systems they will reach you with it closed too.
      </p>
    </GlassCard>
  );
}
