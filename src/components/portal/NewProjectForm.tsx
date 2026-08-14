"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { usePortalAuth } from "@/lib/portal/auth";
import { submitNewProjectRequest } from "@/lib/portal/project-requests";
import { SERVICE_OPTIONS, type ServiceType, type NewProjectRequestInput } from "@/lib/portal/types";

const fieldClasses =
  "w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

const EMPTY: NewProjectRequestInput = {
  name: "",
  service: SERVICE_OPTIONS[0],
  targetMarket: "",
  requiredFields: "",
  volume: "",
  format: "",
  notes: "",
  desiredDueDate: "",
};

/**
 * The proper intake form for a new engagement, matching the same "helpful
 * to include" fields the landing page's FAQ card points clients toward:
 * target market, required fields, volume, format. Submitting creates a real
 * (locally persisted, for now) project that shows up on the dashboard with
 * status "not_started" until S-Tech picks it up.
 */
export function NewProjectForm() {
  const { client } = usePortalAuth();
  const router = useRouter();
  const [form, setForm] = useState<NewProjectRequestInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof NewProjectRequestInput>(key: K, value: NewProjectRequestInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setSubmitting(true);
    const project = submitNewProjectRequest(client.id, form);
    router.push(`/portal/projects/${project.id}`);
  };

  return (
    <GlassCard className="rounded-3xl p-8" lift={false}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Project name
          </label>
          <input
            required
            placeholder="e.g. Q4 SaaS Vertical Prospecting"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={`mt-2 ${fieldClasses}`}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Service
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SERVICE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => set("service", option as ServiceType)}
                data-cursor="link"
                className={`rounded-xl px-3 py-3 text-center text-sm font-medium transition-colors ${
                  form.service === option
                    ? "bg-brand text-white"
                    : "bg-ink/[0.05] text-ink-muted hover:bg-ink/[0.09]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Target market or industry
          </label>
          <textarea
            required
            rows={2}
            placeholder="Who should this cover? Industry, company size, region, role."
            value={form.targetMarket}
            onChange={(e) => set("targetMarket", e.target.value)}
            className={`mt-2 resize-none ${fieldClasses}`}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Fields you need
          </label>
          <textarea
            required
            rows={2}
            placeholder="e.g. company, contact name, title, work email, LinkedIn URL"
            value={form.requiredFields}
            onChange={(e) => set("requiredFields", e.target.value)}
            className={`mt-2 resize-none ${fieldClasses}`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
              Approximate volume
            </label>
            <input
              required
              placeholder="e.g. 500 records"
              value={form.volume}
              onChange={(e) => set("volume", e.target.value)}
              className={`mt-2 ${fieldClasses}`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
              Preferred format
            </label>
            <input
              required
              placeholder="e.g. XLSX, CSV, CRM import"
              value={form.format}
              onChange={(e) => set("format", e.target.value)}
              className={`mt-2 ${fieldClasses}`}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Desired timeline
          </label>
          <input
            type="date"
            value={form.desiredDueDate}
            onChange={(e) => set("desiredDueDate", e.target.value)}
            className={`mt-2 ${fieldClasses}`}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Anything else to add
          </label>
          <textarea
            rows={3}
            placeholder="Context, exclusions, priorities, anything that helps scope it right."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`mt-2 resize-none ${fieldClasses}`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          data-cursor="link"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Submitting…" : "Submit request"}
          <Send className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </form>
    </GlassCard>
  );
}
