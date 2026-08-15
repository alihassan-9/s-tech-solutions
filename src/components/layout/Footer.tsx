import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Cloud } from "@/components/sky/Cloud";
import { CONTACT_EMAIL, COMPANY_LOCATION, START_PROJECT_PATH } from "@/lib/site";

// Rooted at "/" rather than bare fragments: the footer is on every page now,
// including ones that hold none of these sections.
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Services",
    links: [
      { href: "/#lead-generation", label: "Lead Generation & Prospect Research" },
      { href: "/#crm-management", label: "CRM Management & Data Operations" },
      { href: "/#email-marketing", label: "Email Marketing Support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "/#markets", label: "Markets" },
      { href: "/#process", label: "Process" },
      { href: "/#why-us", label: "Why Us" },
      { href: "/#team", label: "Team" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms and Conditions" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      data-cursor-theme="invert"
      className="relative isolate mt-24 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-brand via-deep to-brand-deep pt-20"
    >
      {/* High clouds catching light at the top edge of the footer. */}
      <Cloud className="-left-20 -top-10 h-40 w-[28rem]" opacity={0.18} blur={14} />
      <Cloud className="-right-16 top-10 h-32 w-[22rem]" opacity={0.14} blur={16} />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-white/25 blur-[110px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-14 pb-16 lg:flex-row">
          <div className="max-w-sm">
            <Link href="/#top" data-cursor="link">
              <Logo invert />
            </Link>
            <p className="mt-5 text-sm leading-6 text-invert-muted">
              Lead generation, data research &amp; verification, CRM management, and
              email marketing support for startups, agencies, and international teams.
            </p>

            <div className="mt-7 space-y-2.5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cursor="link"
                className="group flex items-center gap-2.5 text-sm text-invert-muted transition-colors hover:text-invert"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-light" strokeWidth={1.75} />
                <span className="link-sweep break-all">{CONTACT_EMAIL}</span>
              </a>
              <p className="flex items-center gap-2.5 text-sm text-invert-muted">
                <MapPin className="h-4 w-4 shrink-0 text-brand-light" strokeWidth={1.75} />
                {COMPANY_LOCATION}
              </p>
            </div>
          </div>

          {/* Four blocks now that policies have their own column: two up on a
              tablet, all four across once there is room. */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-invert/75">
                  {col.heading}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-cursor="link"
                        className="link-sweep inline-block text-sm leading-5 text-invert-muted transition-colors hover:text-invert"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-invert/75">
                Start a project
              </p>
              <Link
                href={START_PROJECT_PATH}
                data-cursor="link"
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-invert backdrop-blur-md transition-colors hover:bg-white/12"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <p className="mt-4 text-xs leading-5 text-invert-muted">
                Founder-led. Replies come from the person doing the work.
              </p>
            </div>
          </div>
        </div>

        {/* The policy links moved up into their own column, so this goes back
            to being just the credit line. */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-invert-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} S-Tech Solutions. All rights reserved.</p>
          <p>Muhammad Shahabaz · Founder &amp; CEO</p>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the footer edge. */}
      <div
        aria-hidden
        className="relative select-none overflow-hidden bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[23vw] font-bold leading-[0.8] tracking-tighter text-transparent"
      >
        S-TECH
      </div>
    </footer>
  );
}
