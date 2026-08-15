"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  buildProjectRequestEmail,
  openMailClient,
  type ProjectRequestEmail,
} from "@/lib/portal/project-email";
import {
  SERVICE_OPTIONS,
  type NewProjectRequestInput,
  type ProjectRequestContact,
  type ServiceType,
} from "@/lib/portal/types";

const fieldClasses =
  "w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

const labelClasses = "text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft";

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

const EMPTY_CONTACT: ProjectRequestContact = {
  contactName: "",
  email: "",
  companyName: "",
};

/**
 * The intake form for a new engagement, matching the same "helpful to
 * include" fields the landing page's FAQ card points clients toward: target
 * market, required fields, volume, format.
 *
 * Two callers, one form:
 *
 * - The portal passes `contact` (read from the signed-in client) and an
 *   `onSubmitted` handler that files the project on their dashboard.
 * - The public "start a project" page passes neither, so the form collects
 *   who is asking and confirms in place afterwards.
 *
 * Either way submitting sends the brief to S-Tech by email: there is no
 * server behind the portal yet, so the request is handed to the visitor's own
 * mail client fully written out rather than being dropped into localStorage
 * and never reaching anyone. See project-email.ts.
 */
export function ProjectRequestForm({
  contact,
  onSubmitted,
  submitLabel = "Submit request",
}: {
  /** Omit to collect the requester's details as part of the form. */
  contact?: ProjectRequestContact;
  /** Portal-side effects. When omitted the form confirms in place instead. */
  onSubmitted?: (input: NewProjectRequestInput, email: ProjectRequestEmail) => void;
  submitLabel?: string;
}) {
  const collectContact = !contact;

  const [form, setForm] = useState<NewProjectRequestInput>(EMPTY);
  const [who, setWho] = useState<ProjectRequestContact>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<ProjectRequestEmail | null>(null);

  const set = <K extends keyof NewProjectRequestInput>(key: K, value: NewProjectRequestInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setContact = <K extends keyof ProjectRequestContact>(
    key: K,
    value: ProjectRequestContact[K]
  ) => setWho((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const from: ProjectRequestContact = contact ?? {
      contactName: who.contactName.trim(),
      email: who.email.trim(),
      companyName: who.companyName?.trim() || undefined,
    };

    const email = buildProjectRequestEmail(from, form);
    // Before anything else: the handoff to the mail client has to happen
    // inside the click that caused it, or the browser treats it as an
    // unprompted navigation and drops it.
    openMailClient(email.mailtoUrl);

    if (onSubmitted) {
      onSubmitted(form, email);
      return;
    }

    setSent(email);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <GlassCard className="rounded-3xl p-8" lift={false}>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft">
          <CheckCircle2 className="h-5 w-5 text-brand" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-lg font-semibold tracking-tight text-ink">
          Your brief is ready to send
        </p>
        <p className="mt-2.5 max-w-md text-sm leading-6 text-ink-muted">
          We opened your email app with the whole request written out, addressed to us.
          Send it and we will reply from the same address, usually within one working
          day.
        </p>

        {/* If no mail app is set up, the handoff above did nothing visible.
            This is the way out of that, and it is also how someone copies the
            address into webmail instead. */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={sent.mailtoUrl}
            data-cursor="link"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            Nothing opened? Try again
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(null);
              setForm(EMPTY);
              setWho(EMPTY_CONTACT);
            }}
            data-cursor="link"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-3 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
          >
            Send another request
          </button>
        </div>

        <p className="mt-6 border-t border-ink/10 pt-5 text-xs leading-5 text-ink-soft">
          Or write to us directly at{" "}
          <a href={`mailto:${sent.to}`} className="font-medium text-brand link-sweep">
            {sent.to}
          </a>
          .
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="rounded-3xl p-8" lift={false}>
      <form onSubmit={onSubmit} className="space-y-5">
        {collectContact ? (
          <div className="space-y-5 border-b border-ink/10 pb-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Your name</label>
                <input
                  required
                  autoComplete="name"
                  placeholder="Who should we reply to?"
                  value={who.contactName}
                  onChange={(e) => setContact("contactName", e.target.value)}
                  className={`mt-2 ${fieldClasses}`}
                />
              </div>
              <div>
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={who.email}
                  onChange={(e) => setContact("email", e.target.value)}
                  className={`mt-2 ${fieldClasses}`}
                />
              </div>
            </div>

            {/* Optional on purpose: solo founders and freelancers are clients
                too, and this is not worth blocking a request over. */}
            <div>
              <label className={labelClasses}>
                Company name <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                autoComplete="organization"
                placeholder="Leave blank if you are working solo"
                value={who.companyName}
                onChange={(e) => setContact("companyName", e.target.value)}
                className={`mt-2 ${fieldClasses}`}
              />
            </div>
          </div>
        ) : null}

        <div>
          <label className={labelClasses}>Project name</label>
          <input
            required
            placeholder="e.g. Q4 SaaS Vertical Prospecting"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={`mt-2 ${fieldClasses}`}
          />
        </div>

        <div>
          <label className={labelClasses}>Service</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
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
          <label className={labelClasses}>Target market or industry</label>
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
          <label className={labelClasses}>Fields you need</label>
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
            <label className={labelClasses}>Approximate volume</label>
            <input
              required
              placeholder="e.g. 500 records"
              value={form.volume}
              onChange={(e) => set("volume", e.target.value)}
              className={`mt-2 ${fieldClasses}`}
            />
          </div>
          <div>
            <label className={labelClasses}>Preferred format</label>
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
          <label className={labelClasses}>Desired timeline</label>
          <input
            type="date"
            value={form.desiredDueDate}
            onChange={(e) => set("desiredDueDate", e.target.value)}
            className={`mt-2 ${fieldClasses}`}
          />
        </div>

        <div>
          <label className={labelClasses}>Anything else to add</label>
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
          {submitting ? "Sending…" : submitLabel}
          <Send className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <p className="text-xs leading-5 text-ink-soft">
          Submitting opens your email app with this brief addressed to us, so it reaches
          us directly. By sending it you agree to our{" "}
          <Link href="/terms" className="font-medium text-brand link-sweep">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-brand link-sweep">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </GlassCard>
  );
}
