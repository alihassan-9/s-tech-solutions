import { GlassCard } from "@/components/ui/GlassCard";
import type { ClientMessage, PortalUpdate } from "@/lib/portal/types";

type FeedItem = {
  id: string;
  date: string;
  source: "stech" | "client";
  title: string;
  body: string;
};

const CLIENT_MESSAGE_TITLE: Record<ClientMessage["type"], string> = {
  suggestion: "Suggestion sent",
  update_request: "Update requested",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Merges S-Tech's posted updates with the client's own submitted messages
 * into one chronological feed, so the project reads as a two-way
 * conversation instead of a one-way broadcast.
 */
export function ActivityFeed({
  updates,
  messages,
  emptyLabel = "No activity yet.",
}: {
  updates: PortalUpdate[];
  messages: ClientMessage[];
  emptyLabel?: string;
}) {
  const items: FeedItem[] = [
    ...updates.map((u) => ({ id: u.id, date: u.postedAt, source: "stech" as const, title: u.title, body: u.body })),
    ...messages.map((m) => ({
      id: m.id,
      date: m.createdAt,
      source: "client" as const,
      title: CLIENT_MESSAGE_TITLE[m.type],
      body: m.body,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <GlassCard key={item.id} className="rounded-2xl p-4" lift={false}>
          <div className="flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                item.source === "stech" ? "bg-brand-soft text-brand" : "bg-ink/[0.06] text-ink-soft"
              }`}
            >
              {item.source === "stech" ? "S-Tech Solutions" : "You"}
            </span>
            <span className="text-xs text-ink-soft">{formatDate(item.date)}</span>
          </div>
          <p className="mt-2.5 text-sm font-semibold text-ink">{item.title}</p>
          <p className="mt-1.5 text-sm leading-6 text-ink-muted">{item.body}</p>
        </GlassCard>
      ))}
    </div>
  );
}
