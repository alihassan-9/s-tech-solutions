"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, MessageSquareText, FilePlus2, UserCircle, LogOut } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { usePortalAuth } from "@/lib/portal/auth";

const NAV_ITEMS = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/projects", label: "Projects", icon: Layers },
  { href: "/portal/suggestions", label: "Suggestions", icon: MessageSquareText },
  { href: "/portal/new-request", label: "New request", icon: FilePlus2 },
  { href: "/portal/profile", label: "Profile", icon: UserCircle },
];

/**
 * Persistent left-hand nav: pure navigation between the portal's own pages,
 * plus sign out. Projects, suggestions, and new-project each have their own
 * dedicated page now rather than being crammed into the sidebar itself, so
 * this stays a plain, fixed-height menu — nothing here should ever shift
 * position when clicked.
 */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { client, logout } = usePortalAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="p-5">
        <Link href="/portal/dashboard" data-cursor="link" onClick={onNavigate}>
          <Logo />
        </Link>
        {client ? (
          <Link href="/portal/profile" onClick={onNavigate} data-cursor="link" className="mt-4 block">
            <p className="text-sm font-semibold text-ink">{client.companyName}</p>
            <p className="text-xs text-ink-soft">{client.contactName}</p>
          </Link>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 px-5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
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
