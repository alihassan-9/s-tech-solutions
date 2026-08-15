import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow } from "@/components/marketing/Eyebrow";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/site";

export interface LegalSection {
  /** Numbered, e.g. "1. Who we are". The number carries into the contents list. */
  heading: string;
  body: ReactNode;
}

/** "1. Who we are" becomes "1-who-we-are", which is also the anchor. */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Shared frame for the privacy policy and the terms.
 *
 * Laid out as a document rather than a single centred ribbon: a sticky
 * contents list on the left and the clauses on the right. Fifteen to eighteen
 * numbered clauses are unusable as one uninterrupted scroll, and a lone narrow
 * column stranded in the middle of a wide screen looked like a mistake. The
 * measure of the text column is still capped for reading; it is the contents
 * rail that takes up the space beside it.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  related,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  /** The other legal document, linked at the foot of this one. */
  related: { href: string; label: string };
}) {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <Navbar />

      <main className="px-6 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/"
              data-cursor="link"
              className="flex w-fit items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to home
            </Link>

            <Eyebrow className="mt-6">{eyebrow}</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">{intro}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-soft">
              Last updated {LEGAL_LAST_UPDATED}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[15rem_1fr] lg:items-start">
            {/* Desktop only: on a phone this would be eighteen links standing
                between the reader and the first clause. */}
            <Reveal className="hidden lg:block lg:sticky lg:top-28">
              <nav aria-label="Contents">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Contents
                </p>
                <ul className="mt-4 space-y-1 border-l border-ink/10">
                  {sections.map((section) => (
                    <li key={section.heading}>
                      <a
                        href={`#${slugify(section.heading)}`}
                        data-cursor="link"
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[13px] leading-5 text-ink-muted transition-colors hover:border-brand hover:text-brand"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>

            {/* Deliberately not wrapped in <Reveal>: it fires on 20% of the
                element being in view, and 20% of a document this tall never
                is, so the card would sit at opacity 0 forever. */}
            <div>
              <GlassCard className="rounded-3xl p-8 sm:p-10" lift={false}>
                <div className="space-y-10">
                  {sections.map((section) => (
                    <section
                      key={section.heading}
                      id={slugify(section.heading)}
                      className="scroll-mt-28 space-y-3.5"
                    >
                      <h2 className="text-lg font-semibold tracking-tight text-ink">
                        {section.heading}
                      </h2>
                      {section.body}
                    </section>
                  ))}
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2.5 text-sm text-ink-muted">
                    <Mail className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      data-cursor="link"
                      className="link-sweep break-all font-medium text-brand"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                  <Link
                    href={related.href}
                    data-cursor="link"
                    className="group inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
                  >
                    {related.label}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function LegalText({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-7 text-ink-muted">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-7 text-ink-muted">
          <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
