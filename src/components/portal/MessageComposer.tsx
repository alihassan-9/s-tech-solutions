"use client";

import { useState, type FormEvent } from "react";
import { MessageSquarePlus, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePortalAuth } from "@/lib/portal/auth";
import { addClientMessage } from "@/lib/portal/client-messages";
import type { ClientMessageType } from "@/lib/portal/types";

const TYPE_OPTIONS: { value: ClientMessageType; label: string; icon: typeof MessageSquarePlus }[] = [
  { value: "suggestion", label: "Suggestion", icon: MessageSquarePlus },
  { value: "update_request", label: "Request an update", icon: RefreshCw },
];

/**
 * Lets a client send a suggestion or ask for a status update, either about
 * one project (`projectId` set) or as general feedback (`projectId: null`).
 * Stored via client-messages.ts; `onSent` lets the parent refresh whatever
 * list is showing these.
 */
export function MessageComposer({
  projectId,
  onSent,
  title = "Send a message",
  description = "Have a suggestion, or want a status update on this project? Send it here.",
}: {
  projectId: string | null;
  onSent?: () => void;
  title?: string;
  description?: string;
}) {
  const { client } = usePortalAuth();
  const [type, setType] = useState<ClientMessageType>("suggestion");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!client || !body.trim()) return;

    addClientMessage(client.id, projectId, type, body);
    setBody("");
    setSent(true);
    onSent?.();
    window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <GlassCard className="rounded-3xl p-6" lift={false}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-6 text-ink-muted">{description}</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((option) => {
            const isActive = type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                data-cursor="link"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive ? "bg-brand text-white" : "bg-ink/[0.06] text-ink-muted hover:bg-ink/[0.1]"
                }`}
              >
                <option.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {option.label}
              </button>
            );
          })}
        </div>

        <textarea
          required
          rows={3}
          placeholder={
            type === "suggestion"
              ? "Tell us what you'd like to see, or how we can improve."
              : "Let us know you'd like an update, and we'll follow up."
          }
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full resize-none rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />

        <button
          type="submit"
          disabled={!body.trim()}
          data-cursor="link"
          className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {sent ? (
            <>
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
              Sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={1.75} />
              Send
            </>
          )}
        </button>
      </form>
    </GlassCard>
  );
}
