"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, User, Mail, CheckCircle2, Save } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { usePortalAuth, useRequireClient } from "@/lib/portal/auth";

const inputClasses =
  "w-full rounded-xl border border-ink/10 bg-white/70 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

/** View and edit the signed-in client's own account details. */
export default function PortalProfilePage() {
  const { updateProfile } = usePortalAuth();
  const { client, loading } = useRequireClient();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // Self-contained (not referencing a memoized callback) so the setState
  // call is textually inside this effect, matching the pattern that
  // satisfies react-hooks/set-state-in-effect elsewhere in this codebase.
  useEffect(() => {
    const sync = () => {
      if (!client) return;
      setCompanyName(client.companyName);
      setContactName(client.contactName);
      setEmail(client.email);
    };
    sync();
  }, [client]);

  if (loading || !client) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ companyName: companyName.trim(), contactName: contactName.trim(), email: email.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <PortalShell>
      <div className="mx-auto max-w-2xl px-6 py-10 lg:py-16">
        <Reveal>
          <Eyebrow>Client profile</Eyebrow>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            This is what S-Tech sees for your account, and what appears on anything you submit
            through the portal.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <GlassCard className="rounded-3xl p-8" lift={false}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  Company name
                </label>
                <div className="relative mt-2">
                  <Building2
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                    strokeWidth={1.75}
                  />
                  <input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  Contact name
                </label>
                <div className="relative mt-2">
                  <User
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                    strokeWidth={1.75}
                  />
                  <input
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" strokeWidth={1.75} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <button
                type="submit"
                data-cursor="link"
                className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-brand transition-colors hover:bg-brand-hover"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" strokeWidth={1.75} />
                    Save changes
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </Reveal>
      </div>
    </PortalShell>
  );
}
