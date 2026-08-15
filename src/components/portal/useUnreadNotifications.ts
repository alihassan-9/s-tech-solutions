"use client";

import { useEffect, useState } from "react";
import { usePortalAuth } from "@/lib/portal/auth";
import { getUnreadCount, subscribeToNotifications } from "@/lib/portal/notifications";

/**
 * Live unread count for the signed-in client. Stays in step with the store
 * whether the change came from this tab or another one, so the sidebar badge
 * and the mobile bar's dot never disagree with the notifications page.
 */
export function useUnreadNotifications(): number {
  const { client } = usePortalAuth();
  const [unread, setUnread] = useState(0);

  // The setState call sits inside sync() rather than in the effect body,
  // matching the pattern that satisfies react-hooks/set-state-in-effect
  // elsewhere in this codebase.
  useEffect(() => {
    const sync = () => setUnread(client ? getUnreadCount(client.id) : 0);
    sync();
    return subscribeToNotifications(sync);
  }, [client]);

  return unread;
}
