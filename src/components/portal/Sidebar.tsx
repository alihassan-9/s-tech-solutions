"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  MessageSquareText,
  FilePlus2,
  UserCircle,
  LogOut,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { usePortalAuth } from "@/lib/portal/auth";
import { useUnreadNotifications } from "@/components/portal/useUnreadNotifications";
import { clientDisplayName } from "@/lib/portal/types";

const NAV_ITEMS = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/projects", label: "Projects", icon: Layers },
  { href: "/portal/notifications", label: "Notifications", icon: Bell },
  { href: "/portal/suggestions", label: "Suggestions", icon: MessageSquareText },
  { href: "/portal/new-request", label: "New request", icon: FilePlus2 },
  { href: "/portal/profile", label: "Profile", icon: UserCircle },
];

/** How many unread the badge counts to before it gives up and says "9+". */
const BADGE_MAX = 9;

/**
 * Persistent left-hand nav: pure navigation between the portal's own pages,
 * plus sign out. Projects, suggestions, notifications, and new-project each
 * have their own dedicated page rather than being crammed into the sidebar
 * itself, so this stays a plain, fixed-height menu — nothing here should ever
 * shift position when clicked. The unread badge is the one live element, and
 * it sits inside a row whose height it cannot change.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { client, logout } = usePortalAuth();
  const pathname = usePathname();
  const unread = useUnreadNotifications();

  return (
    <div className="flex h-full flex-col">
      <div className="p-5">
        <Link href="/portal/dashboard" data-cursor="link" onClick={onNavigate}>
          <Logo />
        </Link>
        {client ? (
          <Link href="/portal/profile" onClick={onNavigate} data-cursor="link" className="mt-4 block">
            {/* Company name is optional, so the label falls back to the
                person rather than rendering an empty line. */}
            <p className="text-sm font-semibold text-ink">{clientDisplayName(client)}</p>
            {client.companyName?.trim() ? (
              <p className="text-xs text-ink-soft">{client.contactName}</p>
            ) : (
              <p className="text-xs text-ink-soft">{client.email}</p>
            )}
          </Link>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 px-5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.href === "/portal/notifications" && unread > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              data-cursor="link"
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand text-white" : "text-ink-muted hover:bg-ink/[0.06] hover:text-ink"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
              {showBadge ? (
                <span
                  aria-label={`${unread} unread`}
                  className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                    isActive ? "bg-white text-brand" : "bg-brand text-white"
                  }`}
                >
                  {unread > BADGE_MAX ? `${BADGE_MAX}+` : unread}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-5">
        <button
          type="button"
          onClick={logout}
          data-cursor="link"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </div>
  );
}
