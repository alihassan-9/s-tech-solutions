import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Mail, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProjectRequestForm } from "@/components/portal/ProjectRequestForm";
import { CONTACT_EMAIL, COMPANY_LOCATION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project | S-Tech Solutions",
  description:
    "Tell us your target market, the fields you need, volume, and format. The brief reaches us by email and we reply from the same address.",
};

/** Same three lines the landing page's FAQ card asks people to include. */
const CHECKLIST = [
  "Your target market or industry",
  "The fields you need in each record",
  "Rough volume and preferred format",
];

/** What happens after the send button, so nobody is left guessing. */
const STEPS = [
  {
    title: "You send the brief",
    body: "It goes out as an email from your own address, so you keep a copy of exactly what you asked for.",
  },
  {
    title: "We scope it and reply",
    body: "Approach, volume, format, timeline, and price, usually within one working day.",
  },
  {
    title: "Work starts on your go-ahead",
    body: "Nothing runs until you confirm the scope. No automated sequence, no obligation.",
  },
];

/**
 * Where every "Get in touch" on the site now lands. A blank email asking
 * someone to describe their own requirements is a worse first step than the
 * form we already ask clients to fill in, so this is that same form, open to
 * anyone, sending the finished brief to our inbox.
 *
 * The right rail carries three cards rather than one. The form is tall, and a
 * single short card beside it left most of the column as empty sky; these
 * answer the questions someone actually has while filling it in, which is
 * where those answers are worth the most.
 */
export default function StartProjectPage() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Navbar />

      <main className="px-6 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link
              href="/"
              data-cursor="link"
              className="mx-auto flex w-fit items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to home
            </Link>

            <Eyebrow className="mx-auto mt-6">Get in touch</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Tell us what you need
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-ink-muted">
              Fill this in once and we can scope the work properly on the first reply.
              It reaches us as an email from you, and we answer from the same address.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <Reveal>
              <ProjectRequestForm submitLabel="Send my brief" />
            </Reveal>

            {/* Not sticky: with three cards the rail is nearly a screen tall,
                and pinning it would crop the last card on shorter laptops. */}
            <div className="space-y-5">
              <Reveal delay={0.1}>
                <GlassCard className="rounded-3xl p-7" lift={false}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Helpful to include
                  </p>
                  <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                    {CHECKLIST.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                          strokeWidth={1.75}
                        />
                        <span className="text-sm leading-5 text-ink-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.15}>
                <GlassCard className="rounded-3xl p-7" lift={false}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    What happens next
                  </p>
                  <ol className="mt-4 space-y-5 border-t border-ink/10 pt-5">
                    {STEPS.map((step, i) => (
                      <li key={step.title} className="flex gap-3.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{step.title}</p>
                          <p className="mt-1 text-xs leading-5 text-ink-muted">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.2}>
                <GlassCard className="rounded-3xl p-7" lift={false}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Or reach us directly
                  </p>
                  <div className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
                    <p className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        data-cursor="link"
                        className="link-sweep break-all"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                    <p className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
                      {COMPANY_LOCATION}
                    </p>
                    <p className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2} />
                      Founder-led replies
                    </p>
                    <p className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <ShieldCheck
                        className="h-3.5 w-3.5 shrink-0 text-brand"
                        strokeWidth={2}
                      />
                      Your brief stays confidential
                    </p>
                  </div>

                  <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-5 text-ink-soft">
                    Already a client?{" "}
                    <Link href="/portal" className="font-medium text-brand link-sweep">
                      Sign in to the portal
                    </Link>{" "}
                    and submit it there to track progress.
                  </p>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
